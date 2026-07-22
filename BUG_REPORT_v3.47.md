# Bug Report — Quo Vadis v3.47 (Code Audit)

## Riepilogo

Analisi completa del codice su ~14.800 righe di app.js + 8 file JS ausiliari.

---

## BUG CORRETTI (questa sessione)

### CRITICI (funzionalità rotta)

| # | File | Linea | Descrizione | Fix |
|---|------|-------|-------------|-----|
| 1 | app.js | 5260 | **"Vai a oggi" non apriva l'accordion** — `getElementById('g1')` trova lo span anchor, non il div.accordion-header. L'accordion restava chiuso. | Ora usa `getElementById('g1-header')` per aprire l'accordion |
| 2 | app.js | 2278 | **switchTab cross-link non apriva l'accordion** — Stesso problema: i link da cultura/cibo che puntano a `#g7` trovavano lo span, non l'header. | Aggiunto check su `nextElementSibling` con classe accordion-header |
| 3 | app.js | 5331 | **openTodayAccordion (auto-open al caricamento)** — Stessa causa dei bug 1-2. | Ora punta a `g{X}-header` |
| 4 | app.js | 6388 | **Sync checkin non funzionava** — Usava chiavi `'G' + i` ma Firebase salva con chiavi numeriche (`'0'`, `'1'`, ...). I checkin remoti non venivano mai sincronizzati in locale. | Ora usa `String(i)` |

### MEDI (display errato)

| # | File | Linea | Descrizione | Fix |
|---|------|-------|-------------|-----|
| 5 | app.js | 5256 | Pulsante "Vai a G0" invece di "Vai a G1" | `+ (tripDay + 1)` |
| 6 | app.js | 6614 | Day selector dropdown mostrava G0-G54 | `+ (d + 1)` |
| 7 | app.js | 6627 | Day label nel selector mostrava G0 | `+ (currentDay + 1)` |
| 8 | app.js | 6657 | Toast "sincronizzato a G0" | `+ (currentDay + 1)` |
| 9 | app.js | 3113 | Notifica parcheggio "Giorno 0" | `+ (getCurrentTripDay() + 1)` |
| 10 | app.js | 3952 | Parking badge "G0" | `+ (getCurrentTripDay() + 1)` |
| 11 | app.js | 4547 | Km chart label "G0" | `+ (d + 1)` |
| 12 | app.js | 5304 | Today highlight su mini-timeline non matchava | `'G' + (tripDay + 1)` |
| 13 | app.js | 9265 | Diary day badge "G0" | `+ (Math.max(0, tripDay) + 1)` |
| 14 | app.js | 9827 | Diary timeline day "G0" | `+ (tripDay + 1)` |
| 15 | app.js | 10023 | Diary timeline day "G0" (altro punto) | `+ (tripDay + 1)` |
| 16 | app.js | 12582 | Diary entry card "G0" | `+ (dn + 1)` |
| 17 | home-variants.js | 483 | Home card dayLabel "G0" | `+ (currentDay + 1)` |
| 18 | weather-coords.js | 58 | Commento errato "G56" (inesistente) | → "G55" |

---

## VERIFICHE COMPLETATE (nessun bug trovato)

| Area | Stato | Note |
|------|-------|------|
| Tracking/GPS live | ✅ OK | watchPosition, Firebase write, auto-resume, conflict check tutti funzionanti |
| Firebase database rules | ✅ OK | live/, tracks/, liveSession/ ereditano correttamente da parent |
| Capacitor GPS bridge | ✅ OK | Background geolocation, buffer & flush, event delegation |
| Weather widget | ✅ OK | data-day usa (parseInt(id.replace('g','')) - 1) = 0-indexed, corretto per getDayDate() |
| Region color assignment | ✅ OK | Regex /^g(\d+)/ estrae correttamente da "g1-header" → 1 |
| Diary entry creation | ✅ OK | dayNumber salvato 0-indexed, display aggiunge +1 |
| Diary customStops (v3.47) | ✅ OK | .once() prima di splice, escapeHtml, null checks |
| Place search (v3.47) | ✅ OK | Debounce, _nominatimFetch rate limit, .catch() handler |
| Mini-timeline highlight | ✅ OK | Confronta con label G1-G55 dall'itinerario |
| Home progress bar | ✅ OK | (tripDay + 1) / TRIP_DAYS |
| POI data (poi-data.js) | ✅ OK | Tutte le referenze g1-g54, nessun g0 |
| Wiki links | ✅ OK | g1-g54, g55 (ultimo giorno) non ha link wiki (corretto) |
| nearDay (data.js) | ✅ OK | 80 entries, range g1-g53 |
| Region startDay/endDay | ✅ OK | g1-g55 copertura completa senza gap |
| days-data.js IDs | ✅ OK | 55 entries g1-g55 |
| weather-coords.js | ✅ OK | 55 entries, commenti G1-G55 |

---

## ISSUE MINORI (non corretti — bassa priorità)

| # | Tipo | Descrizione |
|---|------|-------------|
| 1 | Dead code | `firebaseSyncCheckin` (L6409) definita ma mai chiamata |
| 2 | Performance | 7 scroll/touch listener senza `{ passive: true }` |
| 3 | Style | 73 `getElementById` senza null check (safe perché gli elementi esistono sempre) |
| 4 | Style | ~30 `parseInt` senza radix (tutti su stringhe decimali, safe) |
| 5 | Cosmetic | h3 IDs nel HTML statico (es. `id="rientro-g50g53"`) non aggiornati — non referenziati da nessun href |

---

## TRACKING — PRONTO PER IL TEST

Il sistema di tracking è completo e funzionale:

1. **PWA (browser)**: `navigator.geolocation.watchPosition` con accumulo km, polyline, idle detection, auto-stop dopo 10 min fermo
2. **Native (Capacitor)**: `capacitor-gps-bridge.js` con background geolocation, buffer ogni 60s, flush a Firebase
3. **Auto-resume**: dopo refresh/riavvio, riprende la sessione attiva leggendo `liveSession/{uid}` da Firebase
4. **Auto-start**: opzionale, si attiva con 3 punti >15 km/h consecutivi (solo durante viaggio 25/06-18/08)
5. **Conflict check**: se un altro owner ha tracking attivo, blocca con messaggio
6. **Daily summaries**: auto-save ogni 5 min a `dailySummaries/{date}` per prevenire perdita dati
7. **Firebase paths**: `trips/viaggio-europa-2026/live/{uid}`, `tracks/{date}/points`, `liveSession/{uid}`, `lastPosition`
8. **Database rules**: owner ha write su tutti i sotto-path tramite regola parent `$familyId`

---

*Report generato il 21/06/2026 — Quo Vadis v3.47*
