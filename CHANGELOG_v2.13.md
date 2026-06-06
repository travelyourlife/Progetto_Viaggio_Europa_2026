# Changelog v2.13

## Fix: Notifiche multiple alla registrazione utente

### Problema
Quando un nuovo utente si registrava, l'Owner riceveva 4+ notifiche push "Nuova richiesta di accesso" invece di 1.

### Causa
1. **Doppia sorgente push**: Il client (app.js) e il Cloud Function (`notifyNewPendingUser`) inviavano entrambi una notifica push. Il Cloud Function si attiva automaticamente su `onValueCreated` in `pendingUsers/{uid}`.
2. **Auto-submit multipli**: 4 punti nel codice (onAuthStateChanged, updateChatAuth, checkDiarioAccess, checkPosizioneAccess) facevano `.set()` su pendingUsers indipendentemente, triggerando il listener Owner più volte.

### Fix applicato
- **Rimosso `queuePushNotification` dal client** (riga 422): il Cloud Function `notifyNewPendingUser` gestisce già l'invio push con tag unico per UID (`access-request-${uid.slice(0,8)}`).
- **Aggiunto flag globale `window._pendingSubmitDone`**: impedisce che più code path scrivano su pendingUsers contemporaneamente. Solo il primo a trovare l'utente non-pending esegue il `.set()`.
- **Debounce 2s sul toast in-app**: anche se il listener Owner riceve eventi multipli ravvicinati, il toast viene mostrato una sola volta.

---

## Feature: Owner dinamici (approccio ibrido)

### Descrizione
Permette di promuovere/demotare utenti a Owner dall'app, senza modificare il codice.

### Architettura
- **Owner hardcoded** (OWNER_UIDS in data.js): immutabili, fungono da "super-admin". Non possono essere demotati da nessuno. Sono il fallback di sicurezza contro lockout.
- **Owner dinamici** (database `trips/{familyId}/ownerUsers/{uid}`): promossi/demotati dai super-admin. Hanno gli stessi poteri degli Owner hardcoded (admin panel, write su tutti i nodi, push notifications).
- **Check ibrido**: `isOwner = OWNER_UIDS.includes(uid) || ownerUsers[uid] === true`

### UI nel pannello Admin
- **Badge "Owner ★"** per Owner hardcoded (super-admin)
- **Badge "Owner"** per Owner dinamici
- **Pulsante "⬆️ Promuovi Owner"** su utenti approvati (visibile solo ai super-admin)
- **Pulsante "⬇️ Rimuovi Owner"** su Owner dinamici (visibile solo ai super-admin)
- Conferma con dialog prima di ogni azione
- Aggiornamento automatico del ruolo FCM token (`role: 'owner'` / `role: 'family'`) per il targeting push

### Protezioni
- Solo i 2 Owner hardcoded possono promuovere/demotare
- Gli Owner hardcoded NON possono essere demotati (nemmeno da se stessi)
- Gli Owner dinamici NON possono promuovere/demotare altri
- Nessun rischio di lockout: anche se tutti gli Owner dinamici vengono rimossi, i 2 super-admin restano

### Database rules aggiornate
- Nuovo nodo `trips/{familyId}/ownerUsers` con `.write` riservato ai 2 UID hardcoded
- Tutti i nodi privilegiati ora includono `root.child('trips/' + $familyId + '/ownerUsers/' + auth.uid).val() === true` come condizione alternativa per .write/.read
- File: `database-rules-v2.13.json` (da copiare nella console Firebase)

### Storage rules (NON modificate)
- Le Storage rules (`storage.rules`) restano con i 2 UID hardcoded per l'upload diary
- Gli Owner dinamici NON possono uploadare media nel diario (solo i super-admin)
- Questo è intenzionale: le Storage rules non possono consultare il Realtime Database

---

## File modificati
- `app.js` — fix notifiche + Owner dinamici (checkOwnerStatus, renderAdminUsers, handler promote/demote)
- `database.rules.json` — aggiunto ownerUsers + permessi dinamici
- `version.json` → 2.13
- `sw.js` → CACHE_NAME 'quo-vadis-v2.13'
- `index.html` → EXPECTED_VERSION '2.13'
- `index_en.html` → EXPECTED_VERSION '2.13'

## Deploy
1. **Test channel**: `firebase hosting:channel:deploy test --project viaggio-europa-2026`
2. **Database rules**: Copiare il contenuto di `database-rules-v2.13.json` nella console Firebase → Realtime Database → Rules
3. **Produzione**: Push su GitHub + `firebase deploy --only hosting`
