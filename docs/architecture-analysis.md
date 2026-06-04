# Quo Vadis — Analisi Architetturale: Client vs Server

## Panoramica

Quo Vadis è una **PWA client-heavy** con backend Firebase serverless. L'architettura è volutamente sbilanciata verso il client per massimizzare la reattività offline e minimizzare i costi Firebase.

---

## Distribuzione Attuale

### Lato Client (Browser/PWA)

| Componente | File | Righe | Responsabilità |
|------------|------|-------|----------------|
| Logica principale | `app.js` | 10.566 | Auth, GPS, chat, diary, zaino, notifiche, geofence, meteo, admin |
| Homepage varianti | `home-variants.js` | 1.158 | Rendering homepage per ruolo |
| Renderer giorni | `days-renderer.js` | 443 | Render itinerario, cibo, cultura, attività |
| Dati itinerario | `days-data.js` | 6.546 | 54 giorni completi (statico) |
| Dati configurazione | `data.js` | 633 | TRIP_START, coordinate, POI |
| Link Wikipedia | `wiki-links.js` | 311 | Dizionari link culturali |
| Service Worker | `sw.js` | 315 | Cache, offline, push display |
| HTML + template | `index.html` | 9.076 | UI completa (536 KB) |
| **Totale JS client** | | **~19.700** | |

**Cosa fa il client:**
- Rendering completo di tutte le viste (DOM manipulation: ~470 operazioni)
- Calcoli GPS (distanza, velocità, gap estimation via OSRM)
- Chiamate API esterne dirette (Open-Meteo, Nominatim, OSRM)
- Gestione stato offline (localStorage: 77 accessi, sessionStorage: 9)
- Real-time listeners Firebase (27 `.on()` attivi)
- Logica di business: geofence, check-in automatico, quiz scoring
- 90 timer attivi (setInterval/setTimeout)

### Lato Server (Firebase Cloud Functions)

| Funzione | Trigger | Responsabilità |
|----------|---------|----------------|
| `sendPushNotification` | DB write | Invia FCM, filtra per ruolo/preferenze, pulisce token invalidi |
| `notifyNewPendingUser` | DB write | Notifica owner di nuovi utenti |
| `dailyCountdown` | Scheduler 8:00 | Countdown pre-partenza |
| `dailyReminders` | Scheduler 8:00 | Promemoria zaino/checklist |
| `eveningNextStage` | Scheduler 19:00 | Reminder tappa di domani |

**Totale server: 636 righe** — solo push notifications e scheduler.

### Firebase Services (BaaS)

| Servizio | Uso |
|----------|-----|
| Realtime Database | Chat, diary, check-ins, zaino sync, user prefs, notif queue |
| Authentication | Google Sign-In, ruoli (owner/approved/pending/banned) |
| Cloud Storage | Foto diario, messaggi vocali chat |
| Cloud Messaging (FCM) | Push notifications |
| Hosting | File statici PWA |

---

## Rapporto Client/Server

| Metrica | Client | Server |
|---------|--------|--------|
| Righe di codice | ~19.700 (97%) | ~636 (3%) |
| Logica di business | 100% | 0% |
| API esterne | 4 (Open-Meteo, Nominatim, OSRM, OSM tiles) | 1 (FCM) |
| Computazione | Pesante (250+ operazioni math) | Leggera (solo filtering) |
| Storage | localStorage + sessionStorage | Firebase RTDB |

---

## Opportunità di Ottimizzazione

### 1. Code Splitting — Priorità ALTA

**Problema:** `app.js` è un monolite da 10.566 righe caricato tutto insieme.

**Soluzione:** Spezzare in moduli caricati on-demand:
- `core.js` (~2.000 righe) — auth, routing, base UI
- `chat.js` (~1.500 righe) — caricato solo quando si apre la chat
- `gps-tracking.js` (~1.200 righe) — caricato solo per owner/driver
- `diary.js` (~800 righe) — caricato on-demand
- `admin.js` (~600 righe) — caricato solo per owner

**Impatto:** -60% tempo di parse iniziale per follower/visitor.

### 2. Lazy Loading Dati Statici — Priorità ALTA

**Problema:** `days-data.js` (6.546 righe, ~250 KB) caricato sempre, anche se l'utente guarda solo la home.

**Soluzione:** Caricare solo il giorno corrente + ±2 giorni, fetch il resto on-demand.

**Impatto:** -200 KB sul primo caricamento.

### 3. Aggregazione Meteo Server-Side — Priorità MEDIA

**Problema:** Ogni client chiama Open-Meteo API individualmente (stesse coordinate, stessi dati). Con 20 follower = 20 chiamate identiche.

**Soluzione:** Cloud Function schedulata che fetcha il meteo ogni 3h e lo scrive in Firebase RTDB. I client leggono da lì.

**Vantaggi:**
- Riduce chiamate API esterne da N×client a 1
- Dati già disponibili offline (cached in Firebase)
- Nessun rate-limit risk su Open-Meteo

**Costo:** ~1 Cloud Function invocation ogni 3h = trascurabile.

### 4. Pre-computed Stats — Priorità MEDIA

**Problema:** Ogni client calcola indipendentemente: km totali, paesi visitati, progress %, giorni trascorsi.

**Soluzione:** Cloud Function triggered su check-in/diary write che aggiorna un nodo `trips/{id}/stats` con valori pre-calcolati.

**Vantaggi:**
- Tutti i client mostrano gli stessi numeri (consistenza)
- Meno computazione client-side
- Stats disponibili anche per utenti appena connessi

### 5. index.html Troppo Grande — Priorità MEDIA

**Problema:** 536 KB di HTML con tutti i template inline (tutte le tab, tutti i ruoli).

**Soluzione:**
- Estrarre i template in file separati caricati on-demand
- Oppure: generare l'HTML server-side con solo le sezioni rilevanti per il ruolo

**Impatto:** -300 KB per follower che non vedono admin/GPS/diary-edit.

### 6. Chat Notification Batching — Priorità BASSA ✅ (fatto)

**Problema:** Ogni messaggio chat = 1 push notification separata.

**Soluzione:** Tag fisso + conteggio server-side (implementato in questa versione).

### 7. Service Worker Precache Intelligente — Priorità BASSA

**Problema:** SW precacha TUTTI i file statici all'install, anche quelli non necessari per il ruolo.

**Soluzione:** Precache solo core assets, lazy-cache il resto on-first-use.

**Impatto:** Install più veloce, meno storage occupato.

### 8. Firebase Listener Cleanup — Priorità BASSA

**Problema:** 27 listener `.on()` attivi contemporaneamente, anche per sezioni non visibili.

**Soluzione:** Attach/detach listener solo quando la tab è visibile. Il codice ha già `registerFirebaseListener()` ma non tutti i listener lo usano.

**Impatto:** Meno bandwidth Firebase, meno battery drain su mobile.

---

## Cosa NON Spostare Server-Side

| Componente | Motivo per restare client |
|------------|--------------------------|
| GPS tracking | Richiede accesso hardware device |
| Geofence | Dipende da posizione real-time locale |
| Rendering UI | Reattività istantanea, offline-first |
| Zaino checkbox | Deve funzionare offline |
| Quiz | Logica semplice, nessun vantaggio server |
| Mappa Leaflet | Rendering grafico locale |

---

## Roadmap Suggerita

| Fase | Intervento | Effort | Impatto |
|------|-----------|--------|---------|
| 1 | Code splitting `app.js` | 2-3 giorni | ⭐⭐⭐⭐⭐ |
| 2 | Lazy load `days-data.js` | 1 giorno | ⭐⭐⭐⭐ |
| 3 | Meteo server-side | 1 giorno | ⭐⭐⭐ |
| 4 | Pre-computed stats | 0.5 giorni | ⭐⭐⭐ |
| 5 | Template splitting HTML | 2 giorni | ⭐⭐⭐ |
| 6 | Listener cleanup | 1 giorno | ⭐⭐ |
| 7 | SW precache ottimizzato | 0.5 giorni | ⭐⭐ |

---

## Conclusione

L'architettura attuale è **corretta per il caso d'uso** (PWA offline-first per famiglia in viaggio). Il server fa il minimo indispensabile (push dispatch + scheduling). Le ottimizzazioni principali sono sul **peso del client** (code splitting + lazy loading), non sullo spostamento di logica server-side. L'unica eccezione significativa è il **meteo aggregato** che eviterebbe chiamate duplicate da tutti i client.
