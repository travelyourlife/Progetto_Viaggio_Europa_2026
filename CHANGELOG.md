# Quo Vadis — Changelog

## v2.89 (14 giugno 2026)
- Fix iOS: nella mappa a schermo intero il titolo e il pulsante di chiusura non finiscono più sotto la status bar / Dynamic Island (rispetto della safe-area in alto e ai lati)
- Fix: il titolo della mappa fullscreen ora si tronca con i puntini su schermi stretti invece di sovrapporsi

## v2.88 (14 giugno 2026)
- Nuovo: 3 curiosità al giorno in 3 fasce orarie (mattino 09:00, pomeriggio 14:00, sera 19:00), incluso il pre-partenza, fino al 18 agosto 2026 incluso
- Scheduler: tracciamento per-fascia (sentSlots) per evitare duplicati; recupero delle fasce già scadute quando l'app si apre più tardi; watcher ogni 30 min mentre l'app è aperta
- Scheduler: stop automatico degli invii dopo il 18 agosto 2026
- Dati: portate a 3/giorno tutte le giornate che ne avevano meno (pre-partenza e G53/G54): +53 curiosità, tutte verificate con fonte
- Dati: rimossi 4 testi duplicati tra pre-partenza e tappa, sostituiti con curiosità uniche e verificate (240 curiosità totali, tutte diverse)
- Fix: getCuriositaForDay ora ignora le voci legacy in formato fact/factEn

## v2.68 (12 giugno 2026)
- Fix: translatePost API contract rotto (client mandava {text,from,to}, server vuole {text,key,familyId})
- Fix: notifica pending_access duplicata rimossa dal client (gestita solo da CF)
- Fix: 6 occorrenze "54 giorni" → "55 giorni" in curiosita-data.js
- Fix: curiosità finali spostate a day 54 (ultimo giorno)
- Fix: fallback TRIP_DAYS 54→55 in app.js
- Fix: fallback tripStart 26→25 giugno in unified-map.js
- Fix: fallback tripStart 26→25 giugno in home-variants.js (2 occorrenze mancanti)
- Sicurezza: validazione uid in chat database rules
- Sicurezza: limite 5000 chars su translatePost CF
- Nuovo: bump_version.py — versione da un'unica fonte
- Nuovo: controlla.py — validazione pre-rilascio automatica (7 categorie)
- Nuovo: self-check integrità dati a runtime (banner rosso per owner)
- Nuovo: commenti-contratto client↔CF per translatePost
- Miglioramento: .catch() su 4 chiamate Firebase critiche (tracking, diario)

## v2.67 (12 giugno 2026)
- Fix critico: itinerario in data.js riscritto da 54 a 55 entry con date corrette
- Fix: G1 aveva data 27/06 invece di 26/06 (sfasamento da g1 in poi)
- Fix: inserito G5 "Riga giorno libero" (30/06) mancante
- Fix: regioni aggiornate con range corretti (g2-g6 Baltici, g7-g15 Finlandia...)
- Sicurezza: notifications/queue .write ristretto da auth!=null a utenti approvati
- Fix: fallback sparsi 26→25 giugno, 54→55 giorni in app.js
- Fix: curiosità aggiunta per day 54 (ultimo giorno)
- Fix: commento "54 giorni" in data.js

## v2.66 (12 giugno 2026)
- Fix: DOMContentLoaded non nasconde tab se utente era già loggato (fix definitivo refresh)
- Fix: tooltip minibar misurato off-screen per evitare overflow bordo destro
- Fix: functions/index.js pulito da codice orfano dopo rimozione funzioni
- Fix: tutte le Cloud Functions deployate con --force per bypass gen1 CPU

## v2.65 (12 giugno 2026)
- Fix: tab Admin/Tracking visibili senza refresh (fix ottimistico con _wasLoggedIn)
- Fix: tooltip minibar troncato su segmenti vicini al bordo destro
- Tile mappe: CartoCDN → OpenStreetMap (funziona su GitHub Pages senza CSP)
- Nuovo: furgone "ultima posizione nota" visibile sulla mappa anche quando tracking spento

## v2.64 (12 giugno 2026)
- Fix: auto-publish lato client per post diario schedulati scaduti
- Fix: hardcoded 54/55 giorni risolti sistematicamente in tutti i file
- Fix: TRIP_META centralizzato in data.js con attributo data-trip-meta per HTML
- Fix: tooltip minibar con calcolo larghezza reale (no più troncamento)
- Nuovo: window.TRIP_META — oggetto centralizzato con tutte le stringhe di data
- Fix CF: publishScheduledPosts legge solo diary/ invece di tutto trips/
- Fix CF: processNotificationQueue usa transaction() per lock atomico

## v2.63 (12 giugno 2026)
- Fix: gallery si aggiorna dopo upload foto (forceReload)
- Fix: quiz ripristina progresso al reload (incluso contatore revealed)
- Fix: loadDiaryWeather: N query Firebase → 1 query singola su weatherLog
- Fix: offline.html versione aggiornata da v1.41 a v2.63
- Fix: chat upload con validazione MIME (solo immagini/audio/video/PDF)
- Fix: mediaRecorder.stream undefined su Safari → stream salvato in closure
- Fix: linkify() XSS — testo link wrappato con escapeHtml()
- Fix: _placeReverseCache con limite LRU 300 entry e eviction 20%
- Fix: sezioni regionali accordion corrette dopo inserimento G5 Riga
- Fix: assegnazione regioni alla minibar (range aggiornati per 55 giorni)

## v2.62 (12 giugno 2026)
- Itinerario: TRIP_START → 25 giugno (era 26) in 6 file
- Itinerario: TRIP_DAYS 54→55
- Itinerario: G5 "Riga giorno libero" aggiunto (30/06)
- Fix: OSRM gap con else per data.code !== 'Ok' (traghetti/zone remote)
- Fix: updateMeteo sequenziale → parallelo in batch di 8 (~15s → ~2s)
- Fix: updateMeteo guard readyState
- Fix: stopLive reset _effectiveDriveMs, _lastGpsFix, nasconde pos-live-stats
- Fix: todayPoints.push residuo → pushTrackPoint
- CF: publishScheduledPosts legge solo diary/ (non tutto trips/)
- CF: processNotificationQueue lock atomico con transaction()

## v2.61 (precedente)
- Fix critico: SyntaxError riga 4160 bloccava tutti i click
- Fix: tab Admin/Tracking visibili senza refresh (v1 del fix ottimistico)
- Nuovo: minibar segmentata Home con 55 segmenti e tooltip
- Nuovo: Cloud Functions create (processNotificationQueue, publishScheduledPosts, translatePost, notifyNewPendingUser)
- Fix: chat messaggi doppi (authStateChanged bypassava _chatAuthSubscribed)
- Fix: database rules pendingUsers .read aggiunto per owner
