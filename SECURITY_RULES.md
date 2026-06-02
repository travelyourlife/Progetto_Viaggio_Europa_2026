# Firebase Security Rules — Quo Vadis v1.27

## Correzioni applicate rispetto alle rules precedenti

| # | Cosa cambiato | Prima | Dopo | Perché |
|---|---------------|-------|------|--------|
| 1 | `trips/$familyId` read | `true` (pubblico!) | owners + approved | **Posizione live, diario, zaino, note erano leggibili da chiunque senza login** |
| 2 | `live` read | `auth != null` | owners + approved | Qualsiasi utente Google vedeva la posizione live |
| 3 | `chat/$familyId` write | `auth != null` | owners + approved | Qualsiasi utente Google poteva scrivere in chat (bypass del gate client-side) |
| 4 | `notifications/queue` write | `auth != null` | solo owners | Qualsiasi utente poteva pushare notifiche spam |
| 5 | `fcm_prefs` | non esisteva | `$uid` read/write | Nuovo nodo per sync preferenze chat cross-device |

---

## Cosa contiene ogni path Firebase

| Path | Contenuto | Dati sensibili? |
|------|-----------|:---:|
| `trips/$familyId/livePosition` | GPS in tempo reale (lat, lng, timestamp) | 🔴 **SÌ** |
| `trips/$familyId/live` | Posizione live del driver (lat, lng, speed, heading) | 🔴 **SÌ** |
| `trips/$familyId/liveSession` | Sessione tracking attiva (km, start time) | 🟡 |
| `trips/$familyId/diary` | Diario di viaggio (testi, foto, audio) | 🟡 |
| `trips/$familyId/notes` | Note giornaliere per ogni tappa | 🟡 |
| `trips/$familyId/zaino` | Checklist zaino/packing (cosa portare) | ⚪ |
| `trips/$familyId/checkins` | Check-in luoghi visitati | ⚪ |
| `trips/$familyId/customCheckins` | Tappe personalizzate aggiunte | ⚪ |
| `trips/$familyId/dailySummaries` | Km percorsi per giorno | ⚪ |
| `trips/$familyId/tracks` | Tracce GPS registrate | 🔴 **SÌ** |
| `trips/$familyId/parking` | Parcheggi salvati (coordinate) | 🟡 |
| `trips/$familyId/approvedUsers` | Lista utenti approvati | ⚪ |
| `trips/$familyId/pendingUsers` | Richieste di accesso in attesa | ⚪ |
| `trips/$familyId/notifications/queue` | Coda notifiche push | ⚪ |
| `trips/$familyId/dayOverride` | Override giorno corrente (admin) | ⚪ |
| `trips/$familyId/quizScores` | Punteggi quiz bambini | ⚪ |
| `trips/$familyId/analytics` | Analytics mini-console (sessioni, pageviews) | ⚪ |
| `live` | Posizione live broadcast | 🔴 **SÌ** |
| `chat/$familyId` | Messaggi chat viaggio | 🟡 |
| `chat/users` | Lista utenti chat (nome, email, device) | 🟡 |
| `chat/banned` | Utenti bannati dalla chat | ⚪ |
| `chat/typing` | Indicatore "sta scrivendo..." | ⚪ |
| `chat/presence` | Indicatore online/offline | ⚪ |
| `fcm_tokens/$uid` | Token push notification per device | 🟡 |
| `fcm_prefs/$uid` | Preferenze notifiche (chat on/off, last read) | ⚪ |
| `notificationQueue` | Coda notifiche globale | ⚪ |

---

## Matrice accessi per ruolo

### Legenda
- ✅ = accesso consentito
- ❌ = accesso negato
- 📖 = solo lettura
- ✏️ = solo il proprio $uid

### READ (lettura)

| Path | 🔴 Non loggato | 🟡 Loggato (non approved) | 🟢 Approved | 🔵 Owner |
|------|:---:|:---:|:---:|:---:|
| `trips/*` (posizione, diario, zaino, km...) | ❌ | ❌ | ✅ | ✅ |
| `live` (posizione live broadcast) | ❌ | ❌ | ✅ | ✅ |
| `chat/$familyId` (messaggi) | ❌ | ✅ | ✅ | ✅ |
| `chat/users` (lista utenti) | ❌ | ❌ | ❌ | ✅ |
| `chat/banned` (utenti bannati) | ❌ | ✅ | ✅ | ✅ |
| `chat/typing` (sta scrivendo) | ✅ | ✅ | ✅ | ✅ |
| `chat/presence` (online/offline) | ✅ | ✅ | ✅ | ✅ |
| `fcm_tokens` (tutti i token) | ❌ | ❌ | ❌ | ✅ |
| `fcm_tokens/$uid` (proprio token) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `fcm_prefs/$uid` (proprie preferenze) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `notificationQueue` | ❌ | ❌ | ❌ | ✅ |

### WRITE (scrittura)

| Path | 🔴 Non loggato | 🟡 Loggato (non approved) | 🟢 Approved | 🔵 Owner |
|------|:---:|:---:|:---:|:---:|
| `trips/*` (dati viaggio) | ❌ | ❌ | ❌ | ✅ |
| `trips/*/approvedUsers/$uid` (auto-registrazione) | ❌ | ✅ ✏️ (1 volta) | — | ✅ |
| `trips/*/pendingUsers/$uid` (richiesta accesso) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `trips/*/notifications/queue` (push notifiche) | ❌ | ❌ | ❌ | ✅ |
| `live` (posizione live) | ❌ | ❌ | ❌ | ✅ |
| `chat/$familyId` (messaggi) | ❌ | ❌ | ✅ | ✅ |
| `chat/users/$uid` (proprio profilo) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `chat/banned` (ban utenti) | ❌ | ❌ | ❌ | ✅ |
| `chat/typing/$uid` (sta scrivendo) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `chat/presence/$uid` (presenza) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `fcm_tokens/$uid` (proprio token) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `fcm_prefs/$uid` (proprie preferenze) | ❌ | ✅ ✏️ | ✅ ✏️ | ✅ |
| `notificationQueue` | ❌ | ❌ | ❌ | ✅ |

---

## Come applicare

1. Vai su [Firebase Console → Realtime Database → Rules](https://console.firebase.google.com/project/viaggio-europa-2026/database/viaggio-europa-2026-default-rtdb/rules)
2. Copia il contenuto di `database.rules.json`
3. Incolla e clicca **Publish**

## TODO sicurezza (da verificare in futuro)

- [ ] **Google Analytics**: verifica se traccia gli owner — eventuale opt-out
- [ ] **Rate limiting**: Firebase rules non supportano rate limiting nativo — valutare Cloud Functions
- [ ] **XSS chat**: verificare che `renderMessage()` usi `textContent` e non `innerHTML`
- [ ] **Session expiry**: valutare re-auth forzata dopo X giorni
- [ ] **Ban evasion**: attualmente un utente bannato può creare nuovo account Google
