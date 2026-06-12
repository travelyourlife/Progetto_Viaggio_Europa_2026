# Changelog v2.58

## Fix e Miglioramenti

### 1. Haversine unificata (data.js)
- Estratta funzione canonica `window._haversineKm` in `data.js`, condivisa da tutti i moduli
- Le 4 implementazioni IIFE-locali in `app.js` ora delegano alla globale (con fallback inline per sicurezza)
- Previene divergenze silenziose se una copia viene corretta e le altre no

### 2. Rate limiter globale per Nominatim
- Aggiunto `window._nominatimFetch` (queue FIFO con spacing 1100ms) prima di `AuthManager`
- Tutte le chiamate `fetch()` a `nominatim.openstreetmap.org` ora passano per il throttler:
  - `pos-city-name` (già aveva throttle 30s, ora anche in coda globale)
  - `_reverseGeocode` nel modulo Statistiche (riga ~5680)
  - `_reverseGeocode` nel modulo Weather Widget (riga ~5682)
  - `reverseGeocode` nel modulo Place Recognition (riga ~7710)
  - `fetchNearby` — reverse geocode + catUrl (riga ~3170, prima senza throttle)
- Evita ban IP temporanei in zone remote (Norvegia, Finlandia) con rete lenta

### 3. CSS variables mancanti
- Aggiunte `--bg-secondary`, `--text-primary`, `--bg-color` al `:root` (light e dark mode)
- Correggono background trasparenti/bianchi su `.pos-ws-item` e altri elementi in dark mode su Android WebView

### 4. curiosita-scheduler.js: AuthManager invece di firebase.auth().currentUser
- Il check owner ora usa `AuthManager.getUser()` quando disponibile
- Previene race condition al cold start Android dove `firebase.auth().currentUser` è ancora `null` anche se `AuthManager` ha già risolto l'utente

### 5. visibilitychange listeners: documentati chiaramente
- I due listener `visibilitychange` sono in IIFE separati con scopi distinti:
  - GPS IIFE: `_emergencySave()` dei dati di viaggio quando l'app va in background
  - Stats IIFE: pausa/ripresa dell'interval di aggiornamento statistiche
- Aggiunto commento esplicativo per evitare futura rimozione errata

### 6. debug-overlay.js: caricamento condizionale
- Il script ora viene iniettato dinamicamente solo se `window.IS_PROD !== true`
- Per disabilitare in produzione: aggiungere `window.IS_PROD = true;` in `data.js`
- Di default rimane attivo (sezione Debug Log visibile solo in Admin tab)

### 7. quiz-fun.js: cleanup confetti su tab switch
- Aggiunto listener `tabSwitched` che rimuove tutti gli elementi `.quiz-confetti` orfani
- Previene accumulo di ghost node DOM nelle sessioni lunghe (54 giorni di viaggio)

### 8. Chat: pending indicator esteso a Firebase offline
- Il badge "⏳ Invio in corso..." ora si mostra anche quando `window._firebaseConnected === false`
- Prima compariva solo con `!navigator.onLine` — ora copre anche il caso "rete presente ma Firebase irraggiungibile"

### 9. Badge "🔴 Offline" sulla hero card
- Il listener `.info/connected` ora aggiorna `window._firebaseConnected` (usato dalla chat)
- Quando Firebase si disconnette: badge rosso persistente "🔴 Nessuna connessione" sulla hero card
- Quando Firebase si riconnette: badge rimosso automaticamente + toast "☁️ Online"
- Chiarisce alla famiglia in viaggio che il tracking non è in tempo reale

## File modificati
- `app.js` — tutti i fix sopra (haversine, Nominatim, offline badge, chat pending, visibilitychange)
- `data.js` — aggiunta `window._haversineKm` canonica
- `style.css` — aggiunte variabili CSS mancanti (light + dark mode)
- `curiosita-scheduler.js` — fix AuthManager
- `quiz-fun.js` — cleanup confetti
- `index.html` — debug-overlay condizionale, EXPECTED_VERSION 2.58
- `index_en.html` — EXPECTED_VERSION 2.58
- `sw.js` — CACHE_NAME 'quo-vadis-v2.58'
- `version.json` — 2.58

## Deploy

1. **Hosting**: push su GitHub + `firebase deploy --only hosting --project viaggio-europa-2026`
2. **Functions**: nessuna modifica
3. **Database rules**: nessuna modifica

---

## Fix Tracking GPS (analisi approfondita v2.58)

### Bug A — CRITICO: CapGPS bloccava app.js su Android nativo
`capacitor-gps-bridge.js` intercettava tutti i click su Start/Stop in **capture phase** con `e.stopPropagation()`, impedendo ai handler di `app.js` (`startLive`/`stopLive`) di ricevere l'evento. Risultato: su APK Android `liveActive` restava sempre `false`, nessun timer partiva, autosave non girava, e la UI di `app.js` non si aggiornava mai.

**Fix**: aggiunto sistema di eventi custom tra CapGPS e app.js:
- `capgpsTrackingStarted` → app.js setta `liveActive=true`, avvia timers (autosave, idle check, UI clock), mostra pannello stats
- `capgpsTrackingStopped` → app.js chiama `stopLive()` per cleanup
- `capgpsPositionUpdate` → app.js aggiorna `todayKm`, `lastMovementTime`, e chiama `updateLiveUI()`

### Bug B — UI stats nativo vuota/sbagliata
`updateUIStats()` in CapGPS sovrascriveva l'`innerHTML` dell'intero container `#pos-live-stats` invece di aggiornare i singoli `<span>` (`live-speed-now`, `live-km-today`, `live-time-today`). Il pannello restava anche `display:none` perché solo app.js lo rendeva visibile.

**Fix**: `updateUIStats` aggiorna i singoli span e imposta `statsDiv.style.display = ''` quando il tracking è attivo.

### Bug C — `getFirebaseRefs` in CapGPS: user null al cold start
CapGPS usava `firebase.auth().currentUser` che al cold start Capacitor è ancora `null` anche con utente loggato → refs non trovate → tracking falliva silenziosamente.

**Fix**: `getFirebaseRefs` usa ora `window.firebaseUser` (settato da `checkOwnerStatus`) come prima scelta, con fallback su `AuthManager.getUser()` e infine `currentUser`.

### Bug D — Crash silenzioso in `startLive_resume`
`getFamilyRef('live/' + firebaseUser.uid)` senza null check → `TypeError` se `firebaseUser` era null al momento del resume.

**Fix**: `_resumeUid = firebaseUser ? firebaseUser.uid : 'driver'`

### Bug E — `todayPoints` senza limite
Array cresceva indefinitamente. Con update ogni 50m e giornate da 300km → 6000+ oggetti. Su sessioni multiple senza riavvio dell'app, rischio OOM su dispositivi con poca RAM.

**Fix**: aggiunto `pushTrackPoint()` con cap a 5000 punti, che droppa il 10% più vecchio quando superato. Tutti i `todayPoints.push(pt)` nelle funzioni di tracking sostituiti.

### Bug F — `haversineKm` quinta implementazione in CapGPS
**Fix**: ora delega a `window._haversineKm` (data.js), coerente con gli altri moduli.

## File aggiuntivi modificati (rispetto alla lista precedente)
- `capacitor-gps-bridge.js` — fix getFirebaseRefs, haversineKm, updateUIStats, eventi capgps*
- `app.js` — listener capgpsTrackingStarted/Stopped/PositionUpdate, pushTrackPoint, null guard startLive_resume
