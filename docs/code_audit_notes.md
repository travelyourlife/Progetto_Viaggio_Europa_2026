# Code Audit Findings - Quo Vadis v1.60

## ESLint Results
- **2 errors** (both `no-func-assign`): lines 7780 and 8257
  - These are intentional decorator patterns (wrapping sendMessage and updateChatAuth)
  - Not actual bugs, but could be refactored to use proper wrapper pattern
- **286 warnings** (mostly `no-undef` for browser globals, empty blocks, redeclares)
  - Most are false positives due to function hoisting and global scope sharing
  - 17 empty blocks: mostly intentional empty catch/else blocks
  - 13 redeclares: mostly expected (global vars declared in config)

## Actual Issues Found

### Bug: GPX Import may overwrite odometerKm
- Line 6977: `existingKm = existing.odometerKm || existing.km || 0`
- If odometerKm is set (manual entry), the import checks if GPS km > odometerKm
- But it uses `||` which means if odometerKm is 0 it falls through to km
- The `summRef.update({ km: ... })` writes to `km` field, NOT `odometerKm`
- So odometerKm is preserved correctly. NOT a bug actually.

### Potential Issue: OSRM gap estimation is async but modifies todayKm
- Line 1476: `todayKm += gapKm` inside an async fetch callback
- If multiple gaps are detected before the first resolves, could cause race condition
- LOW RISK: gaps are rare and the code resets on each tracking start

### Potential Issue: Drive sync doesn't check odometerKm before updating km
- Same as above - it only updates `km` field, never touches `odometerKm`
- The display logic always prefers odometerKm if present
- So this is SAFE by design

### Style Issues (not bugs)
- Function reassignment pattern (decorator) at lines 7780, 8257
- Multiple haversine implementations (3 copies in different scopes)
- Large monolithic file (10,425 lines, 487KB)
- Some empty catch blocks that silently swallow errors

## Security Assessment
- ✅ escapeHtml() used for all user-generated content in chat
- ✅ Firebase rules enforce role-based access
- ✅ Chat input maxlength=5000
- ✅ textContent used for most DOM text insertion
- ✅ linkify() only runs AFTER escapeHtml() in chat
- ⚠️ No CSP header (but static site on GitHub Pages, low risk)
- ⚠️ Firebase API key exposed in source (normal for client-side Firebase)
- ⚠️ GIS_CLIENT_ID exposed (normal for OAuth2 public clients)

## Optimization Patterns Found
- Stale-While-Revalidate caching strategy (instant load + background update)
- Cache-First for CDN assets (versioned, stable)
- Image cache with 80-item LRU limit
- IntersectionObserver for lazy-loading sections
- Debounced Firebase sync (zaino)
- Throttled reverse geocoding (max 1 per 30s)
- requestAnimationFrame for smooth animations
- loading="lazy" on all user images
- Firebase listener registry with cleanup on tab switch
- Auto-save every 5 minutes during tracking (prevents data loss)
- Eco mode: 30s GPS interval vs 10s normal

## Architecture
- Total JS: 19,363 lines across all files
- app.js: 10,425 lines (487KB) - main logic
- days-data.js: 225KB - trip data
- index.html: 534KB - full UI
- sw.js: 309 lines - service worker
- functions/index.js: 617 lines - 5 Cloud Functions
- Version: V1.60
