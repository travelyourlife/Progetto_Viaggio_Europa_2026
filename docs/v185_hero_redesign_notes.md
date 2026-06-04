# v1.85 Hero Redesign Notes

## Current Structure (index.html lines 307-347)
- `div.home-hero-card` — flex container, align-items center, justify-content space-between
  - `div#hero-pre-trip.hero-card-content` — pre-trip content (flex:1)
    - `span.hero-card-label` — "PROSSIMA AVVENTURA" (orange/accent)
    - `div.hero-card-countdown` — flex baseline
      - `span#home-countdown-num.hero-card-number` — big number (52px)
      - `span.hero-card-text` — "giorni alla partenza"
    - `div.hero-card-date` — "📅 26 giugno 2026"
  - `div#hero-during-trip.hero-card-trip` (hidden by default)
    - `div.hero-trip-top` → `span.hero-trip-label` "🟢 IN VIAGGIO"
    - `div.hero-trip-main` — flex
      - `div#hero-city-link.hero-trip-city-block` → city + country
      - `div.hero-trip-date` → date-day (big) + date-month
      - `img.hero-card-avatar` — icon.png (80x80 circle)
  - `img#hero-pre-avatar.hero-card-avatar` — icon.png (shown in pre-trip)
  - `div#hero-weather-row.hero-weather-row` — weather info (hidden by default, shown after fetch)

## Family Image
- `./icon.png` — 512x512 cartoon family in van (same as splash)
- Already used as `.hero-card-avatar` (80x80 circle)
- Already hidden on <400px via CSS media query

## What Needs to Change (from mockup)
### PRE-TRIP:
- "PROSSIMA AVVENTURA" label ✓ (already exists)
- Big countdown number ✓ (already exists: #home-countdown-num)
- "giorni alla partenza" text ✓ (already exists)
- 📅 26 giugno 2026 ✓ (already exists)
- Family avatar on right ✓ (already exists: #hero-pre-avatar)
- Weather row below separator ✓ (already exists)
- BUG: countdown shows wrong number (uses real date, not override)
- BUG: "G1" badge shown instead of countdown in home-variants.js

### DURING TRIP:
- "● IN VIAGGIO" green label ✓ (already exists)
- Big day label "G12" + city name
- Family avatar on right ✓ (already exists inside hero-trip-main)
- Date below
- Weather row below separator ✓

## Key Bugs to Fix
1. home-variants.js line 439-440: dayNum='1', dayLabel='G1' in pre-trip → should be countdown
2. home-variants.js line 475-477: totalDays='54', totalKm='12.000', totalCountries='13' → should be '0'
3. home-variants.js line 479: progressText shows countdown correctly but stats are wrong
4. app.js line 4755-4758: updateStats() uses real date, not override for countdown
5. app.js line 3360-3371: Itinerario countdown uses real date when override is -1

## CSS Changes Needed
- Hide #homeSearchOpen on <400px (currently only hidden at <340px)
