# Current Post System Analysis

## Current State:
1. **Admin editor** (app.js ~10940-11100): Edits posts with fields: date, type (select from POST_TYPES), body IT, body EN, image URL. Saves to Firebase `trips/{familyId}/preTripPosts`.
2. **Home feed** (home-variants.js ~779-838): Reads from `window._preTripPostsOverride` or defaults. Shows ALL posts (no limit). Has avatar removed already in rendering (just date + badge + body).
3. **Diario tab** (app.js ~9015-9050): `buildPreDepartureDiary()` renders posts with timeline marker + card. Also reads from `window._preTripPostsOverride` or defaults.

## Problems to Fix:
1. **Hardcoded fallback posts** — both home-variants.js and app.js have hardcoded default posts. These should be removed; if Firebase has no posts, show empty state.
2. **No draft/publish status** — all posts are always visible. Need a `status: 'draft'|'published'` field.
3. **No title field** — posts have no optional title. Need to add.
4. **Badge not fully editable** — POST_TYPES is a fixed list. Need to allow custom badge text.
5. **Avatar still showing in Diario** — the `diario-entry-marker` (blue circle) acts as avatar. Need to check if it's the blue dot in the screenshot.
6. **Home shows all posts** — should show max 3 most recent published.
7. **Inconsistency** — Home uses `hv-feed-item` class, Diario uses `diario-entry` class. Both should look the same.

## Firebase Path:
`trips/{familyId}/preTripPosts` — array of post objects

## New Data Model:
```json
{
  "id": "auto-generated",
  "date": "2026-06-04",
  "status": "published" | "draft",
  "title": "Optional title",
  "badge": "🚀 Countdown",
  "badgeType": "countdown",
  "body": { "it": "...", "en": "..." },
  "image": "url or null"
}
```

## Files to Modify:
- app.js: admin editor (add title, badge text, status toggle), diario rendering (filter published, no marker/avatar)
- home-variants.js: filter published, max 3, no avatar
- index.html + index_en.html: update diario HTML structure if needed
