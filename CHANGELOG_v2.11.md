# Changelog v2.11 — Bug Fixes & Performance Improvements

Data: 6 Giugno 2026

---

## Riepilogo

Questa release risolve 6 categorie di problemi identificati nell'analisi approfondita della v2.10, combinando le raccomandazioni di due report indipendenti. Nessuna contraddizione è stata trovata tra i due documenti di analisi.

---

## 1. Fix Critico: Admin Panel Bloccato (`home-variants.js`)

**Problema:** Quando l'Owner simulava il ruolo "Follower" o "Visitor" tramite il triplo-tap sul logo, `home-variants.js` nascondeva permanentemente il pannello Admin, il pulsante Diario e i link di navigazione admin. Anche dopo il reload, il `localStorage` manteneva l'Owner bloccato fuori dal proprio pannello.

**Soluzione implementata:**
- Rimossa completamente la propagazione del ruolo simulato all'app globale (righe 101-116 e 1138-1190)
- La simulazione ora cambia **solo** l'aspetto della homepage, mai `window.isOwner` o la visibilità di `#tab-admin`
- Aggiunto un **banner visivo** (arancione, fisso in alto) quando la simulazione è attiva, con possibilità di reset con un tap
- Aggiunto **auto-reset** del ruolo simulato in `app.js` → `onAuthStateChanged`: se un Owner fa login e ha un ruolo salvato diverso da "owner", viene resettato automaticamente

---

## 2. Fix Login Google: Race Condition GIS (`app.js`)

**Problema:** Se l'utente cliccava "Accedi" prima che Google Identity Services (GIS) fosse caricato, il fallback a `signInWithRedirect` partiva silenziosamente e spesso falliva su GitHub Pages.

**Soluzione implementata:**
- **Retry con attesa:** Invece di fare fallback immediato, il sistema attende fino a 3 secondi (15 tentativi × 200ms) per il caricamento di GIS
- **Feedback visuale:** Toast "Caricamento login..." durante l'attesa, "Reindirizzamento a Google..." se si usa il fallback
- **Gestione popup bloccato:** Se GIS è caricato ma il prompt viene bloccato (Safari, adblocker), viene mostrato un avviso e si fa fallback a redirect
- **Persistenza esplicita:** `setPersistence(LOCAL)` chiamato prima di qualsiasi tentativo di login
- **Try/catch globale:** Qualsiasi errore di inizializzazione GIS viene catturato con fallback a redirect

---

## 3. Fix Admin Panel: Pulizia Dati Orfani (`app.js`)

**Problema:** Quando si eliminava un utente dal pannello Admin, i suoi messaggi nella chat rimanevano orfani (senza profilo associato), creando "messaggi fantasma".

**Soluzione implementata:**
- Aggiunta query `orderByChild('uid').equalTo(uid)` sui messaggi chat durante l'eliminazione
- I messaggi dell'utente eliminato vengono **soft-deleted**: il campo `name` diventa "[Utente Eliminato]", `photo` viene svuotato, e viene aggiunto un flag `deletedUser: true`
- Questo preserva il contesto della conversazione senza lasciare dati orfani

---

## 4. Fix XSS: Escape HTML in `days-renderer.js`

**Problema:** La funzione `esc()` era un semplice passthrough (`return s || ''`) senza alcuna sanificazione HTML.

**Soluzione implementata:**
- `esc()` ora esegue escape completo di `&`, `<`, `>`, `"` per prevenire XSS se i dati dovessero mai provenire da input utente o da Firebase

---

## 5. Fix Service Worker: Aggiornamento Controllato (`sw.js` + `app.js`)

**Problema:** `skipWaiting()` aggressivo nel SW causava potenziali rotture a metà navigazione quando gli asset in memoria non corrispondevano ai nuovi scaricati.

**Soluzione implementata:**
- **SW (`sw.js`):** Rimosso `self.skipWaiting()` dall'evento `install`. Il nuovo SW attende un messaggio esplicito dal client.
- **Client (`app.js`):** Sostituito `handleSwUpdate` con un **banner elegante** ("Nuova versione disponibile!") con pulsanti "Aggiorna" e "Chiudi". Solo al click su "Aggiorna" viene inviato `skipWaiting` + reload.
- **Offline migliorato:** La strategia di fallback ora serve la shell dell'app (`index.html`) dalla cache invece della pagina `offline.html`, permettendo la navigazione dell'itinerario anche senza connessione.

---

## 6. Fix Performance: Listener Registry + IntersectionObserver (`app.js`)

**Problema:** 
- I listener Firebase nella chat avevano fallback `.on()` senza registrazione, causando accumulo di listener e memory leak su tab switch ripetuti.
- Le mappe Leaflet usavano `setTimeout(200ms)` per `invalidateSize()`, insufficiente su dispositivi lenti.

**Soluzione implementata:**
- **Listener Registry:** Tutti i fallback `.on()` nella chat ora creano un registry di emergenza se `window.registerFirebaseListener` non è disponibile, garantendo che i listener vengano sempre tracciati e rimossi al cambio tab.
- **IntersectionObserver:** Sostituito il `setTimeout` arbitrario con un `IntersectionObserver` che rileva quando il contenitore della mappa diventa visibile nel viewport, chiamando `invalidateSize()` solo in quel momento. Mantenuto un fallback `setTimeout(300ms)` per mappe create dopo il tab switch.

---

## 7. Fix Linee Blu Laterali (`style.css`)

**Problema:** Possibili linee blu laterali visibili su schermi larghi o in modalità PWA standalone, causate dall'assenza di un background esplicito su `html` e da potenziali artefatti del `theme-color`.

**Soluzione implementata:**
- Aggiunto `background: var(--bg)` su `html` per garantire che l'area esterna al `body` (max-width: 900px) sia sempre del colore neutro del tema
- Aggiunto reset esplicito `border-left: none; border-right: none; box-shadow: none;` su `body` nella media query `min-width: 1024px`

---

## File Modificati

| File | Tipo di modifica |
|------|-----------------|
| `home-variants.js` | Fix propagazione ruolo (righe 101-116, 1138-1190) |
| `app.js` | Fix login GIS, auto-reset ruolo, chat cleanup, SW banner, listener registry, IntersectionObserver |
| `days-renderer.js` | Fix XSS nella funzione `esc()` |
| `sw.js` | Rimosso skipWaiting aggressivo, migliorato offline |
| `style.css` | Fix linee blu laterali |

---

## Note per il Deploy

1. **Incrementare la versione del SW:** Aggiornare `CACHE_VERSION` in `sw.js` per forzare il download dei nuovi asset
2. **Nessuna modifica al backend Firebase** richiesta per questi fix
3. **Compatibilità:** Tutte le modifiche sono retrocompatibili e non richiedono modifiche a `database.rules.json` o `functions/index.js`
4. Per la query `orderByChild('uid')` nella pulizia chat, assicurarsi che esista un indice in `database.rules.json` su `chat/messages/.indexOn: ["uid", "timestamp"]`
