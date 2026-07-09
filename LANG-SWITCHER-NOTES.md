# Language Switcher Analysis

## Current Mechanism
- 3 separate HTML files: index.html (IT), index_en.html (EN), index_es.html (ES)
- Each file has a single link that points to the NEXT language in a cycle:
  - IT page: shows 🇬🇧 flag → links to EN (title: "IT → EN → ES")
  - EN page: shows 🇪🇸 flag → links to ES (title: "EN → ES → IT")
  - ES page: shows 🇮🇹 flag → links to IT (title: "ES → IT → EN")
- The cycle is: IT → EN → ES → IT (circular)
- User must click multiple times to reach the desired language
- The flag shown is the NEXT language, not the current one — confusing!
- Preference saved in localStorage: 'quo-vadis-lang'

## HTML Locations
- Home header: `.home-lang-switch` (line 270 in index.html, 264 in index_en.html, 238 in index_es.html)
- Altro/Settings tab: `#altro-lang-switch` (line 16089 in index.html)
- Header bar: `#langSwitch` (used in app.js line 7482)

## Problems
1. Not intuitive — shows a single flag, user doesn't know what languages are available
2. Circular cycle requires multiple clicks to reach desired language
3. Title tooltip "ES → IT → EN" looks like a translation path, not a menu
4. Flag shown is the TARGET language, not the current one

## Proposed Alternatives
A. **Dropdown with 3 flags** — tap flag icon → shows 3 options (🇮🇹 IT, 🇬🇧 EN, 🇪🇸 ES)
B. **3 small flags always visible** — active one highlighted, others dimmed
C. **Globe icon + dropdown** — 🌐 tap → dropdown with language names
D. **Bottom sheet** — tap current flag → bottom sheet with 3 options + language names
