# Audit Findings v2.02

## app.js (11605 lines) — COMPLETED

### Issues Found & Fixed:
1. **Zaino sync race condition** — localStorage-only sync caused different counts on different devices. Fixed with merge+accept-remote strategy.
2. **Posizione auth bypass** — Added auth checks to `initMap()`, `listenLivePositions()`, `loadTrackLine()` to prevent data loading without auth.
3. **Cross-link "Posizione Live" visible to unauthenticated** — Added `protected-link` class + hide in `updateProtectedTabsUI`.
4. **"Configura GPS Logger" broken link** — Removed from both IT/EN templates and JS handler.

### Issues Found (to fix):
5. **Dead code: Legacy post editor (lines 11347-11605)** — Has `return;` at line 11350 so it never executes, but the dead code below it references `listEl`, `addBtn`, `saveBtn`, `statusEl`, `BADGE_PRESETS` which are never defined. This is harmless (never runs) but adds ~250 lines of dead weight.
6. **Curiosità archive (line 11296)** — Only shows Italian text ("Le curiosità appariranno qui...") even on EN version. Should use isEN.
7. **Weather stats (line 11263)** — Hardcoded "54" days. Should use a constant.

### No Issues Found In:
- Tab switching + PROTECTED_TABS logic (correct)
- Diario gate + approval logic (correct)
- Chat section (correct, sanitized)
- Notification engine (correct)
- Admin panel (correct)
- POI Esplora (correct)
- Audio recorder (correct)
- Photo upload + compression (correct)
- Admin user management (correct, includes dedup + ghost detection)
- Notification config panel (correct)
- Weather aggregate stats (correct logic)

## Next: index.html, index_en.html, home-variants.*, data.js, etc.
