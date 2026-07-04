# Quo Vadis v4.63 — i18n (IT/EN/ES) progress

## Goal
Fix minibar arrow (DONE), complete EN to 100%, add full es-ES (UI+content),
3-flag cycle IT->EN->ES, version bump 4.63.

## Translation infrastructure (rate-limit aware)
- i18n_common.py: raw HTTP to proxy; detects HTTP-200 rate-limit body, backoff, global throttle.
- Backups in .i18n_backup/.

## DATA TRANSLATION STATUS (all verified, 0 missing EN, 0 missing ES)
- days-data.js: 2179 leaves, 0 missing EN, 0 missing ES.
- curiosita-data.js: 241 EN+ES DONE (factES manual for entry 187).
- poi-data.js: 447 ES DONE.
- city-itineraries.js: 22 cities ES DONE.
- data.js: itinerario/regioni/POI_ATTIVITA — 522 ES DONE.

## CODE STATUS (3-language infra)
- app.js: LANG3 + T(it,en,es) + isEN (true for en AND es). Minibar arrow fix DONE. window.db exposed.
- days-renderer.js: COUNTRY_LABELS_ES, _lang3, pickLang(); ALL content fields use pickLang. DONE.
- home-variants.js: _lang3, _en(en||es), _hvT(); pending/empty localized; HomeVariants.rerender exposed.
- quiz-fun.js: ES labels. city-itineraries-ui.js: es values + 3-way t().

## HTML FILES
- index_es.html: CREATED. DOCTYPE fixed, lang="es", 3-way redirect, EXPECTED_VERSION 4.63,
  title V4.63, loads home-variants_es.html?v=4.63. home-lang-switch 🇮🇹->index.html (title ES->IT->EN),
  altro-lang-switch -> index.html. 0 missing ES.
- home-variants_es.html: CREATED (110 strings ES).

## FLAG CYCLE WIRING (DONE in HTML)
- index.html (IT): 🇬🇧 -> index_en.html (title "IT → EN → ES"). DONE
- index_en.html (EN): 🇪🇸 -> index_es.html + altro row "Español". DONE
- index_es.html (ES): 🇮🇹 -> index.html (title "ES → IT → EN") + altro row -> index.html. DONE

## STILL TODO (code) — RESUME HERE
1. app.js lang-switch JS handler: ensure preference-save recognizes 'es' (search 'quo-vadis-lang', langBtn/homeLangBtn/altroLangBtn ~line 7408-7470). Currently binary en/it.
2. index.html top redirect: browser 'es' -> index_es.html (currently non-it -> en). Add es branch.
   index_en.html redirect: keep (it->index.html), add optional es handling if stored.
3. sw.js: precache add './index_es.html' + './home-variants_es.html'; bump CACHE_NAME 4.62->4.63.
4. Version bump 4.62->4.63 in index.html + index_en.html: all ?v=4.62 -> 4.63, title V4.62->V4.63,
   EXPECTED_VERSION "4.62"->"4.63". version.json version->4.63. (index_es.html already 4.63 for those it has.)
5. Full node --check all JS; local smoke test (python http.server) for index_es.html.
6. CHANGELOG.md prepend v4.63 entry.
7. Build quo-vadis-v4.63.zip (exclude .git, node_modules, *.zip, .i18n_backup, i18n_*.py, *_PROGRESS.md, /tmp).

## NOTES
- home-variants templates loaded via fetch('./home-variants_<lang>.html?v=...') from each index; NOT in JS.
- BeautifulSoup roundtrip: & -> &amp; (harmless); dropped DOCTYPE (restored for index_es.html).
- LLM proxy returns rate-limit as HTTP 200 with {"error":...}; 200 req/min limit.

## Verify commands
- node --check <file>
- coverage scan: node -e '...walk DATA... count missing EN/ES'
