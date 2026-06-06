# Changelog v2.15

## Fix e Miglioramenti

### Simulazione ruoli realistica
- La simulazione "Visitor" e "Follower" ora nasconde correttamente i controlli Owner in **tutte** le sezioni:
  - **Diario**: nasconde "+ Aggiungi giorno", pulsanti editing, bozze, mostra icone traduzione 🌐 per Follower EN
  - **Posizione/Live**: nasconde controlli viaggio e pulsante quick-start
  - **Chat**: nasconde input per Visitor (mostra prompt login)
  - **Admin**: nasconde il link Admin nel menu
- Aggiunto `window._simRole` per coordinare la simulazione tra tutte le sezioni

### Link notifica "Nuova richiesta" → Admin
- Il link "Apri →" nelle notifiche di nuova richiesta di accesso ora porta al pannello **Admin** (prima portava al Diario)
- Aggiornata anche la Cloud Function `notifyNewPendingUser` con `click_action` corretto

### Click "Quo Vadis" header → Home
- Cliccando sul titolo "Quo Vadis" nell'header si torna alla Home (comportamento standard)

### Card Diario cliccabili nella Home
- Le card del feed (diario) nella Home sono ora cliccabili e portano alla sezione Diario

### Card "Tracking" nelle Azioni Rapide (solo Owner)
- Nuova card toggle nella Home: un tap per avviare/fermare il tracking GPS
- Quando si avvia: toast "Ricordati di avviare anche GPSLogger!" + deep link Android
- Quando si ferma: toast "Ricordati di fermare anche GPSLogger!"
- La card si aggiorna automaticamente (verde ▶ / rosso ⏹)

### Conferma prima dell'auto-stop
- Quando il furgone è fermo da 10 minuti, appare un dialog di conferma:
  - "Fermo da 10 minuti. Fermare il tracking?"
  - Pulsanti: [Continua] / [Ferma]
  - Se nessuna risposta entro 2 minuti → auto-stop

### Barra grigia rimossa
- Rimosso il separatore solido tra il badge "km da casa" e il meteo nella hero card

### "Configure GPS Logger" rimosso
- Rimossa la voce "Configure GPS Logger" dalla home EN (era un residuo)

## Deploy

1. **Database rules**: già pubblicate (v2.13, invariate)
2. **Cloud Functions**: `firebase deploy --only functions --project viaggio-europa-2026` (per fix link notifica)
3. **Hosting**: push su GitHub + `firebase deploy --only hosting`
