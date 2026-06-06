# Quo Vadis v1.99 — Bug Report & Code Audit

**Author:** Manus AI  
**Date:** 5 June 2026  
**Target Version:** v1.99 (bumped from v1.98)  
**Status:** ALL CONFIRMED FIXES APPLIED IN THIS RELEASE

---

## Executive Summary

The "Quo Vadis" travel app is a robust, feature-rich vanilla JavaScript Progressive Web App (PWA) powered by Firebase Services. This audit identified 15 issues across the client-side codebase. After cross-validation with the developer, 13 fixes were applied and 1 was confirmed as a false positive (#8 ReDoS). The hero section was also redesigned with a new two-level layout.

---

## Summary Table

| # | Severity | Issue | Verdict | Status |
|:--|:---------|:------|:--------|:-------|
| 1 | CRITICAL | TRIP_START fallback date parsing (off-by-one) | Partial (fallbacks only) | FIXED |
| 2 | HIGH | signOut() doesn't detach Firebase listeners | Confirmed | FIXED |
| 3 | HIGH | pendingUsers listener never cleaned up | Confirmed | FIXED |
| 4 | MEDIUM | Diary delete has no .catch() error handler | Confirmed | FIXED |
| 5 | MEDIUM | Diary publish/edit has no .catch() | Confirmed | FIXED |
| 6 | MEDIUM | Haversine function defined 3 times | Partial (different IIFEs) | CONSOLIDATED |
| 7 | MEDIUM | sessionStorage for recap dedup (lost on refresh) | Confirmed | FIXED |
| 8 | MEDIUM | Search regex ReDoS risk | FALSE POSITIVE | NOT A BUG |
| 9 | MEDIUM | photo.url in diary not sanitized (XSS risk) | Confirmed | FIXED |
| 10 | LOW | Math.abs masks negative countdown post-trip | Partial (post-trip only) | FIXED |
| 11 | LOW | SW skipWaiting is automatic | Acceptable risk | DOCUMENTED |
| 12 | LOW | linkify regex matches trailing punctuation | Confirmed | FIXED |
| 13 | SUGGESTION | API key exposed in client-side JS | Standard for Firebase | DOCUMENTED |
| 14 | SUGGESTION | setInterval for stats not cleared on tab switch | Confirmed | FIXED |
| 15 | NEW | Admin "Rimuovi" incomplete cleanup + ghost users | Confirmed | FIXED |

---

## Detailed Findings & Fixes Applied

### #1 — CRITICAL: TRIP_START Fallback Date Parsing

**Files:** `data.js`, `app.js` (lines 123, 561, 10994), `home-variants.js`, `unified-map.js`

**Issue:** Some fallback definitions used `new Date('2026-06-26')` (without `T00:00:00`), which is parsed as UTC midnight and can show wrong countdown in UTC+ timezones.

**Developer review:** The main definition in `data.js` uses `new Date('2026-06-26T00:00:00')` which is correctly parsed as local time in modern browsers. Bug exists only in fallbacks.

**Fix applied:** All occurrences changed to `new Date(2026, 5, 26)` (explicit local date constructor). Main definition also updated for consistency.

---

### #2 — HIGH: signOut() Doesn't Detach Firebase Listeners

**File:** `app.js` (line ~5485)

**Issue:** When user logs out, active `.on()` listeners continue receiving data — memory leak + potential data leakage on shared devices.

**Fix applied:** Added `detachFirebaseListeners()` call before `firebase.auth().signOut()`.

---

### #3 — HIGH: pendingUsers Listener Never Cleaned Up

**File:** `app.js` (line ~337)

**Issue:** `pendingRef.on('value', ...)` is set up without `registerFirebaseListener()`. Never detached.

**Fix applied:** Wrapped with `registerFirebaseListener()` for proper cleanup on logout.

---

### #4-5 — MEDIUM: Diary Operations Missing .catch()

**File:** `app.js` (diary delete, publish, edit, photo delete)

**Issue:** Async database operations have no error handling. Silent failures when offline.

**Fix applied:** Added `.catch()` with `showToast` error feedback to all diary write/delete operations.

---

### #6 — MEDIUM: Haversine Function Duplicated

**File:** `app.js` (lines ~1565, ~5210, ~6996, ~7535)

**Issue:** 3 unique implementations in different IIFE scopes (the 4th was in the same IIFE as #3).

**Developer review:** Confirmed 3 copies, not 4. Cannot fully consolidate due to IIFE scope isolation.

**Fix applied:** `_haversine` (GPX parser) aliased to `haversineGlobal` (same IIFE). `_haversineKm` kept with explanatory comment (different IIFE). GPS tracking `haversine` kept in its closure.

---

### #7 — MEDIUM: sessionStorage for Recap Dedup

**File:** `app.js` (lines 2455, 6675, 6895)

**Issue:** `sessionStorage` is cleared on tab close. Refreshing triggers duplicate recap prompts.

**Fix applied:** All 3 occurrences of `recap_done_` changed from `sessionStorage` to `localStorage`.

---

### #8 — NOT A BUG: Search Regex ReDoS

**Developer review:** The input is already escaped with `query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before `new RegExp()`. The resulting pattern is purely literal — no backtracking possible.

**Action:** No fix applied. False positive.

---

### #9 — MEDIUM: photo.url XSS via innerHTML

**File:** `app.js` (line ~9397)

**Issue:** `photo.url` from Firebase inserted directly into innerHTML without sanitization.

**Fix applied:** Added validation: URL must match `^https://` and is passed through `escapeHtml()` before insertion. Non-matching URLs render as empty src.

---

### #10 — LOW: Math.abs Masks Post-Trip Countdown

**File:** `home-variants.js` (line ~411)

**Issue:** `Math.abs(currentDay)` is correct pre-trip but would show wrong countdown post-trip.

**Developer review:** Bug only manifests post-trip. Pre-trip path is correct.

**Fix applied:** Changed to `currentDay < 0 ? Math.abs(currentDay) : 0` — shows 0 if trip is over.

---

### #11 — LOW: Service Worker skipWaiting

**File:** `sw.js` (line 82)

**Issue:** Automatic `skipWaiting()` could interrupt user actions mid-flow.

**Developer review:** Acceptable for travel PWA where updates are critical. Client-side already handles `SW_UPDATED` message.

**Fix applied:** Added documentation comment explaining the design decision.

---

### #12 — LOW: Linkify Regex Trailing Punctuation

**File:** `app.js` (line ~8448)

**Issue:** URL regex `/(https?:\/\/[^\s<"']+)/g` matches trailing periods, commas, parentheses.

**Fix applied:** Added post-match cleanup: strips `[.,;:!?)\]]+` from end of matched URLs, appends as plain text after the link.

---

### #13 — SUGGESTION: Firebase API Key in Client-Side JS

**File:** `data.js` (line ~129)

**Action:** Added documentation comment explaining Firebase keys are safe to expose (identify project only). Recommended adding HTTP referrer restrictions in Google Cloud Console.

---

### #14 — SUGGESTION: setInterval Never Cleared on Tab Switch

**File:** `app.js` (line ~4973)

**Issue:** `setInterval(updateStats, 60000)` runs continuously even when tab is hidden.

**Fix applied:** Added `visibilitychange` listener that clears interval when hidden, restarts on visible.

---

### #15 — NEW: Admin "Rimuovi" Incomplete Cleanup + Ghost Users

**File:** `app.js` (line ~10670)

**Issue (from live screenshots):**
1. "Rimuovi" button only removed from `approvedUsers`. User entry persisted in `chat/users` and `pendingUsers`, reappearing as "Sconosciuto".
2. Ghost users (Marco Guerriero, Virginia Mandara) show as "Attivo" but their Firebase Auth accounts were deleted.

**Fix applied:**
1. **Complete cleanup:** "Rimuovi" now removes from `approvedUsers` + `chat/users` + `pendingUsers` + `fcm_tokens` via `Promise.all()` with `.catch()`.
2. **Ghost indicator:** Users with `lastSeen` > 30 days ago (non-owners) get a ghost emoji badge with tooltip in admin panel.

---

## Hero Redesign (v1.99)

Updated in `home-variants.html` (IT) and `home-variants_en.html` (EN):

**Pre-trip layout:**
- Main row: countdown number + "giorni alla partenza" + avatar
- Sub-row: target city + weather + daylight (with `hero-info-block` flex-wrap)

**During-trip layout (new two-level design):**
- Top: status badge (IN VIAGGIO / ON THE ROAD)
- Main row: city block (clickable) | centered day badge (G/D prefix) | avatar
- Distance-from-home badge
- Sub-row: weather + daylight (flex-wrap, `hero-info-block`)

**New CSS classes** in `home-variants.css`:
- `.hv-hero-v199`, `.hv-hero-trip-top`, `.hv-hero-trip-main`
- `.hv-hero-trip-city-block`, `.hv-hero-trip-day-badge`, `.hv-hero-trip-distance`
- `.hv-weather-v199` with `hero-info-block` wrapping

---

## Files Modified in v1.99

| File | Changes |
|:-----|:--------|
| `version.json` | Version → 1.99 |
| `data.js` | TRIP_START/END local date constructor, Firebase API key comment |
| `app.js` | Fixes #1-5, #7, #9, #12, #14, #15 |
| `home-variants.js` | Fix #10 (Math.abs guard), TRIP_START fallbacks |
| `home-variants.html` | Hero redesign (IT) — owner-a + follower-a |
| `home-variants_en.html` | Hero redesign (EN) — owner-a + follower-a |
| `home-variants.css` | New v1.99 hero CSS classes |
| `sw.js` | Fix #11 comment, cache name `quo-vadis-v1.99` |
| `unified-map.js` | TRIP_START fallback fix |
| `index.html` | `EXPECTED_VERSION = '1.99'` + title |
| `index_en.html` | `EXPECTED_VERSION = '1.99'` + title |

---

## Deployment Commands

**TEST (Preview channel, expires in 7 days):**
```bash
cd ~/Downloads && rm -rf Progetto_Viaggio_Europa_2026 && mkdir Progetto_Viaggio_Europa_2026 && cd Progetto_Viaggio_Europa_2026 && unzip -o ~/Downloads/quo-vadis-v199.zip && firebase hosting:channel:deploy test --expires 7d
```

**PRODUCTION (GitHub + Firebase):**
```bash
cd ~/Downloads && rm -rf Progetto_Viaggio_Europa_2026 && git clone https://github.com/travelyourlife/Progetto_Viaggio_Europa_2026.git && cd Progetto_Viaggio_Europa_2026 && ONLINE_VER=$(python3 -c "import json;print(json.load(open('version.json'))['version'])") && find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} + && unzip -o ~/Downloads/quo-vadis-v199.zip && NEW_VER=$(python3 -c "import json;print(json.load(open('version.json'))['version'])") && if [ "$ONLINE_VER" = "$NEW_VER" ]; then echo "ERRORE: versione $NEW_VER uguale a quella online" && exit 1; fi && echo "OK: $ONLINE_VER -> $NEW_VER" && git add -A && git commit -m "v$NEW_VER: update" && git push origin main && firebase deploy --only hosting
```
