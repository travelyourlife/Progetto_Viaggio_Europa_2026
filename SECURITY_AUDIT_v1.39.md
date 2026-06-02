# Security Audit — Quo Vadis v1.38 → v1.39

## Sommario Esecutivo

L'app Quo Vadis è una PWA familiare basata su Firebase (Realtime Database, Auth, Storage, Cloud Functions). L'analisi ha identificato **7 vulnerabilità critiche**, **5 medie** e **4 basse**. Le correzioni applicate nella v1.27 (documentate in `SECURITY_RULES.md`) hanno risolto i problemi più gravi (dati pubblici), ma rimangono lacune significative.

---

## Vulnerabilità Identificate

### 🔴 CRITICHE (da risolvere subito)

| # | Vulnerabilità | Rischio | Dove |
|---|---------------|---------|------|
| C1 | **`bannedUsers` non ha regole dedicate** | Un utente bannato può rimuovere il proprio ban via console Firebase (il path è sotto `trips/$familyId` che ha `.write` solo per owner, MA il ban check è solo client-side) | `database.rules.json` + `app.js` |
| C2 | **Ban enforcement solo client-side** | Il global ban check (`showGlobalBanScreen`) avviene nel browser. Un utente tecnico può bypassarlo rimuovendo il JS o usando l'API REST di Firebase direttamente | `app.js` linea 257 |
| C3 | **Chat ban solo client-side** | Il `patchedPush` che blocca i messaggi degli utenti bannati è un override JS locale. Usando l'API REST o la console del browser si può scrivere direttamente in `chat/$familyId` | `app.js` linea 7586 |
| C4 | **`approvedUsers` self-registration** | Qualsiasi utente autenticato può scriversi in `approvedUsers/$uid` se il record non esiste (`!data.exists()`). Questo bypassa completamente il gate di approvazione | `database.rules.json` linea 9 |
| C5 | **Nessuna validazione dati nelle rules** | Non ci sono regole `.validate` — un utente approvato può scrivere dati arbitrari in chat (messaggi enormi, strutture malformate, flooding) | `database.rules.json` |
| C6 | **Firebase Storage senza regole visibili** | Non esiste un file `storage.rules` nel progetto. Se le Storage Rules di default sono attive, chiunque autenticato può caricare file senza limiti di dimensione o tipo | Progetto Firebase |
| C7 | **`chat/typing` e `chat/presence` pubblici in lettura** | Chiunque (anche non autenticato) può leggere chi è online e chi sta scrivendo — information disclosure | `database.rules.json` linea 43-44 |

### 🟡 MEDIE

| # | Vulnerabilità | Rischio | Dove |
|---|---------------|---------|------|
| M1 | **OWNER_UIDS esposti nel client** | Gli UID degli owner sono hardcoded in `data.js` (linea 14). Un attaccante conosce esattamente chi sono gli admin | `data.js` |
| M2 | **Nessun rate limiting** | Un utente approvato può floodare la chat con migliaia di messaggi al secondo via API REST. Firebase Rules non supportano rate limiting nativo | `database.rules.json` |
| M3 | **Nessun Content-Security-Policy** | L'hosting Firebase non ha headers CSP configurati. Un eventuale XSS avrebbe accesso completo al DOM e ai token Firebase | `firebase.json` |
| M4 | **`linkify()` potenziale XSS** | La funzione `linkify()` inserisce URL in `href` senza validazione aggiuntiva. Anche se `escapeHtml()` è applicato prima, URL con `javascript:` non passano (il regex richiede `https?://`), ma URL con caratteri speciali come `"` nell'URL (post-escape) potrebbero causare problemi in edge case | `app.js` linea 7422 |
| M5 | **Nessun `.indexOn` nelle rules** | Le query `orderByChild('timestamp')` e `orderByChild('dayNumber')` non hanno indici definiti — performance degradata e warning in console Firebase | `database.rules.json` |

### 🟢 BASSE

| # | Vulnerabilità | Rischio | Dove |
|---|---------------|---------|------|
| L1 | **Firebase API key esposta** | La chiave API è nel codice client. Questo è "by design" per Firebase, ma senza restrizioni HTTP referrer nella console Google Cloud, la chiave può essere usata da qualsiasi dominio | `data.js`, `sw.js` |
| L2 | **Nessuna session expiry** | Firebase Auth mantiene la sessione indefinitamente. Un dispositivo perso/rubato mantiene l'accesso | Client Firebase Auth |
| L3 | **Ban evasion possibile** | Un utente bannato può creare un nuovo account Google e ri-registrarsi | Architettura |
| L4 | **`pendingUsers` sovrascrivibile** | Un utente può sovrascrivere la propria richiesta in `pendingUsers/$uid` infinite volte (la regola è `auth.uid === $uid` senza `!data.exists()`) | `database.rules.json` linea 14 |

---

## Analisi Dettagliata

### C1/C2/C3: Ban Enforcement

**Stato attuale:** Il ban globale scrive in `trips/$familyId/bannedUsers/$uid = true`. Il check avviene:
- All'avvio dell'app (client-side, linea 257)
- Prima di inviare messaggi chat (client-side, `patchedPush` linea 7586)

**Problema:** Le Firebase Security Rules per `trips/$familyId` hanno `.write` solo per owner, quindi un utente bannato NON può rimuovere il proprio ban dal database. Tuttavia, il ban non impedisce la LETTURA dei dati (l'utente è ancora in `approvedUsers`). Il ban è solo un "overlay" visivo.

**Soluzione consigliata:** Aggiungere nelle rules un check `!root.child('trips/$familyId/bannedUsers/' + auth.uid).exists()` a tutte le regole di lettura/scrittura per utenti approvati.

### C4: Self-Registration in approvedUsers

**Stato attuale:** La regola `".write": "auth != null && auth.uid === $uid && !data.exists()"` permette a QUALSIASI utente Google autenticato di auto-approvarsi.

**Problema:** Questo rende inutile il sistema di approvazione. Qualsiasi persona con un account Google può:
1. Autenticarsi con Firebase Auth (la chiave API è pubblica)
2. Scrivere in `trips/viaggio-europa-2026/approvedUsers/{proprio-uid}`
3. Avere accesso completo a tutti i dati del viaggio

**Soluzione:** Rimuovere questa regola. Solo gli owner devono poter scrivere in `approvedUsers`.

### C5: Validazione Dati

**Stato attuale:** Nessuna regola `.validate` esiste. Un utente approvato può scrivere in chat:
- Messaggi di dimensione illimitata
- Strutture JSON arbitrarie
- Campi non previsti

**Soluzione:** Aggiungere regole di validazione per i messaggi chat (max lunghezza testo, campi obbligatori, tipo dati).

### C6: Firebase Storage

**Stato attuale:** Il codice carica file in:
- `diary/$familyId/$dayKey/` (foto e audio del diario)
- `chat/` (foto e audio della chat)

Non esiste un file `storage.rules` nel progetto. Se le regole di default sono `allow read, write: if request.auth != null`, qualsiasi utente autenticato può caricare file arbitrari.

**Soluzione:** Creare regole Storage che limitino upload per dimensione, tipo MIME, e path.

### M1: OWNER_UIDS Esposti

**Stato attuale:** `data.js` linea 14 contiene:
```javascript
var OWNER_UIDS = ['RxlVlsfeaEeSwFUVYbKQujEsbBo1', 'Mh8BOeFPnFe7WObcsUoP6wyRgPw1'];
```

**Rischio:** Basso in sé (gli UID non sono segreti in Firebase), ma combinato con la self-registration (C4), un attaccante sa esattamente quale FAMILY_ID e quali UID targetizzare.

### M3: Content-Security-Policy

**Stato attuale:** `firebase.json` non configura headers di sicurezza. L'app carica script da CDN (Firebase, Leaflet, ecc.) senza CSP.

**Soluzione:** Aggiungere headers CSP, X-Frame-Options, X-Content-Type-Options in `firebase.json`.

---

## Matrice Rischio vs Impatto

| Vulnerabilità | Probabilità | Impatto | Score |
|---|:---:|:---:|:---:|
| C4 Self-registration | Alta | Alto (accesso totale dati) | **9/10** |
| C5 No validation | Media | Alto (DoS, data corruption) | **7/10** |
| C7 Typing/Presence pubblici | Alta | Basso (info disclosure) | **5/10** |
| C1-C3 Ban bypass | Bassa | Medio (utente già bannato) | **5/10** |
| C6 Storage rules | Media | Medio (upload abusivo) | **6/10** |
| M2 No rate limiting | Bassa | Alto (flooding) | **5/10** |
| M3 No CSP | Bassa | Alto (se XSS trovato) | **4/10** |

---

## Fix Implementati nella v1.39

### 1. Database Rules — Correzioni Critiche

- **Rimossa self-registration** in `approvedUsers` (solo owner può approvare)
- **Aggiunto ban check** a tutte le regole di lettura per utenti approvati
- **Aggiunta validazione chat** (max 5000 caratteri, campi obbligatori)
- **Typing/Presence** richiedono autenticazione per la lettura
- **Aggiunto `.indexOn`** per le query usate dall'app
- **Aggiunto `bannedUsers` write rule** esplicita (solo owner)

### 2. Firebase Hosting Headers

- Aggiunto `X-Frame-Options: DENY`
- Aggiunto `X-Content-Type-Options: nosniff`
- Aggiunto `Referrer-Policy: strict-origin-when-cross-origin`

### 3. Client-Side Hardening

- **Chat message size limit** (5000 caratteri) applicato anche lato client
- **Linkify migliorato** con validazione URL più stretta

### 4. Storage Rules Template

- Creato file `storage.rules` con limiti su dimensione (10MB), tipo MIME, e path

---

## Raccomandazioni NON implementate (richiedono intervento manuale)

| # | Raccomandazione | Motivo |
|---|-----------------|--------|
| R1 | Restringere API key per HTTP referrer nella Google Cloud Console | Richiede accesso alla console GCP |
| R2 | Implementare rate limiting via Cloud Functions | Richiede logica server-side complessa |
| R3 | Aggiungere re-auth forzata dopo 30 giorni | Richiede modifica del flusso auth |
| R4 | Ban per email oltre che per UID (anti-evasion) | Richiede logica aggiuntiva |
| R5 | Audit log delle azioni admin | Richiede nuovo nodo Firebase + UI |
| R6 | Verificare e pubblicare Storage Rules dalla Firebase Console | Richiede accesso alla console Firebase |

---

## Come Applicare le Nuove Rules

1. Vai su [Firebase Console → Realtime Database → Rules](https://console.firebase.google.com/project/viaggio-europa-2026/database/viaggio-europa-2026-default-rtdb/rules)
2. Copia il contenuto di `database.rules.json` (v1.39)
3. Incolla e clicca **Publish**
4. Per Storage Rules: vai su Firebase Console → Storage → Rules e incolla il contenuto di `storage.rules`
