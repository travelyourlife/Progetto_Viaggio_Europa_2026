# Quo Vadis — Guida all'Integrazione del Tracking GPS Esterno
**Autore:** Manus AI  
**Data:** 3 Giugno 2026  
**Versione PWA Supportata:** v1.49+  

---

## 1. Introduzione e Obiettivi
La PWA **Quo Vadis** dispone di un sistema di tracking in tempo reale integrato che sfrutta le API di geolocalizzazione del browser (`navigator.geolocation.watchPosition`). Sebbene comodo, questo approccio presenta alcune limitazioni tipiche delle applicazioni web eseguite in background sui dispositivi mobili [1]:
* **Sospensione del processo:** I sistemi operativi mobili (specialmente iOS e versioni recenti di Android) tendono ad aggredire e congelare i processi in background dei browser web (come Safari o Chrome) per risparmiare batteria, interrompendo il tracciamento continuo [2].
* **Consumo energetico elevato:** Il GPS continuo gestito tramite JavaScript nel browser non è ottimizzato a livello di sistema operativo [3].
* **Mancanza di precisione costante:** I browser faticano a mantenere l'acquisizione del segnale ad alta precisione a schermo spento [1].

Per ovviare a questi problemi, Quo Vadis include un'architettura di **importazione asincrona** progettata per accogliere file di tracciamento generati da applicazioni di logging GPS dedicate [4]. Queste app native funzionano come servizi di sistema, non vengono interrotte dal sistema operativo e garantiscono un tracciamento millimetrico con consumi ridotti [2] [3].

Questa guida spiega come configurare l'applicazione nativa **GPS Logger** (Android) o **Overland / OsmAnd** (iOS/Android) per registrare i tracciati del furgone, caricarli automaticamente su **Google Drive** e vederli sincronizzati all'interno di Quo Vadis senza alcun intervento manuale [4].

---

## 2. Architettura di Integrazione
L'integrazione si basa su un flusso di sincronizzazione a tre livelli:

```
[ Dispositivo GPS / Smartphone ] 
             │
             │ (Registrazione nativa in background)
             ▼
[ App di Logging (es. GPS Logger) ] 
             │
             │ (Auto-upload automatico via Wi-Fi/Dati)
             ▼
      [ Google Drive ]  <─── Cartella dedicata (es. "GPSLogger")
             │
             │ (Sincronizzazione OAuth2 automatica o manuale)
             ▼
       [ Quo Vadis PWA ] 
             │
             │ (Parsing GPX asincrono lato client)
             ▼
[ Firebase Realtime Database ] ───> Aggiornamento Mappa Live e Diario
```

### Come funziona il caricamento in Quo Vadis:
1. L'app nativa registra la posizione in formato **GPX** (standard XML per dati GPS) [5].
2. L'app carica periodicamente il file GPX in una cartella specifica di Google Drive (es. `GPSLogger`) [4].
3. All'apertura di Quo Vadis (se l'utente è autenticato come Organizzatore/Owner), la PWA effettua una chiamata alle API di Google Drive utilizzando un token OAuth2 memorizzato in sessione [4].
4. La PWA scansiona la cartella di Drive, identifica i nuovi file GPX (confrontando gli ID con quelli già importati in `localStorage`), li scarica e li analizza [4].
5. I punti GPS estratti dal file GPX vengono uniti, deduplicati (finestra di 30 secondi) e scritti nel nodo Firebase `trips/{FAMILY_ID}/tracks/{data}/points` [4].
6. La distanza totale giornaliera viene ricalcolata tramite formula di Haversine sui punti effettivi e salvata in `dailySummaries/{data}` se superiore a quella precedentemente registrata, aggiornando automaticamente le statistiche del diario [4].

---

## 3. Configurazione dell'App di Logging GPS (Consigliata: GPS Logger per Android)
**GPS Logger for Android** è un'applicazione open-source, leggera e priva di pubblicità, ideale per questo scopo [6].

### Passo 1: Installazione
1. Scarica e installa **GPS Logger** da [Google Play Store](https://play.google.com/store/apps/details?id=com.mendhak.gpslogger) o da [F-Droid](https://f-droid.org/packages/com.mendhak.gpslogger/) [6].

### Passo 2: Ottimizzazione di Sistema (Fase Critica)
Per evitare che Android interrompa l'app in background [2]:
1. Vai nelle **Impostazioni** dello smartphone → **App** → **GPS Logger**.
2. Seleziona **Batteria** o **Risparmio energetico**.
3. Imposta su **Senza restrizioni** (o disattiva l'ottimizzazione della batteria per questa app).
4. Assicurati che l'app abbia il permesso di accedere alla posizione impostato su **Consenti sempre** (non solo "Mentre usi l'app").

### Passo 3: Configurazione dei Parametri di Tracciamento
Apri GPS Logger, entra in **Impostazioni** (icona ingranaggio) → **Performance**:
* **Intervallo di tempo (Time-based logging):** Imposta a **30 secondi** (un buon compromesso tra precisione e consumo di batteria).
* **Filtro di distanza (Distance filter):** Imposta a **10 metri** (evita di registrare punti duplicati quando il furgone è fermo).
* **Filtro di precisione (Accuracy filter):** Imposta a **50 metri** (scarta i punti con scarsa ricezione, ad esempio sotto gallerie o canyon urbani).
* **Mantieni GPS attivo (Keep GPS on between points):** Imposta su **Sì** se viaggi in aree con frequenti perdite di segnale, altrimenti **No** per risparmiare batteria.

### Passo 4: Configurazione del Formato di File
In **Impostazioni** → **File**:
* **Formati di esportazione:** Seleziona esclusivamente **GPX** (disattiva KML, CSV, ecc. per risparmiare spazio).
* **Regola di nomenclatura del file (File naming):** Scegli `yyyyMMdd` (es. `20260603.gpx`). Questo rende i file facilmente riconducibili ai giorni del viaggio.
* **Creazione nuovo file:** Imposta su **Ogni giorno (New file each day)**. Quo Vadis elabora i dati su base giornaliera, quindi avere un file GPX per ogni data velocizza drasticamente l'importazione.

### Passo 5: Configurazione dell'Auto-Caricamento su Google Drive
In **Impostazioni** → **Auto-upload / Integrazioni**:
1. Seleziona **Google Drive**.
2. Attiva l'opzione **Abilita caricamento automatico (Enable auto-upload)**.
3. Clicca su **Autorizza / Collega account** ed effettua l'accesso con lo stesso account Google che utilizzerai su Quo Vadis.
4. **Cartella di destinazione (Target folder):** Specifica `GPSLogger` (puoi scegliere un altro nome, ma dovrai configurarlo di conseguenza in Quo Vadis).
5. **Frequenza di caricamento (Upload interval):** Imposta su **Ogni ora** o **Solo su connessione Wi-Fi / Connessione dati attiva**.
6. **Azione dopo il caricamento:** Scegli **Mantieni file locale** come backup di sicurezza.

---

## 4. Configurazione Alternativa per iOS (Overland o OsmAnd)
Su iOS, a causa delle severe restrizioni di Apple sui processi in background [2], consigliamo due alternative:

### Opzione A: Overland (Consigliata per la semplicità)
**Overland** è un'app open-source progettata specificamente per raccogliere dati di posizione in background in modo efficiente [7].
1. Installa **Overland** dall'App Store [7].
2. Nelle impostazioni di iOS, imposta la geolocalizzazione su **Sempre** e disattiva il risparmio energetico per l'app [2].
3. Overland registra i dati localmente. A fine giornata, puoi esportare il tracciato cliccando su **Export** → seleziona il formato **GPX** → salvalo direttamente nella tua cartella di **Google Drive** [4] [7].

### Opzione B: OsmAnd Maps (Consigliata se si usa anche per la navigazione offline)
1. Installa **OsmAnd Maps** dall'App Store [8].
2. Attiva il plugin **Trip Recording** (Registrazione Viaggio) [8].
3. Nelle impostazioni del plugin, imposta l'intervallo di registrazione a **30 secondi** [8].
4. Avvia la registrazione del tracciato all'inizio della giornata (apparirà un widget rosso "REC") [8].
5. A fine giornata, salva il tracciato, vai nella lista dei tuoi tracciati in OsmAnd, seleziona **Condividi / Esporta** e salvalo in formato **GPX** su **Google Drive** [4] [8].

---

## 5. Configurazione e Sincronizzazione in Quo Vadis PWA
Una volta che i file GPX iniziano a confluire nella cartella di Google Drive, configura la PWA per riceverli [4].

### Passo 1: Configurazione della Cartella in Quo Vadis
1. Apri **Quo Vadis** sul tuo smartphone o desktop.
2. Assicurati di aver effettuato l'accesso con un account registrato come **Organizzatore / Owner** (solo gli amministratori possono importare tracciati e modificare i dati storici del viaggio) [4].
3. Vai alla scheda **Posizione** e scorri fino alla sezione **Sincronizzazione Google Drive** (in fondo alla pagina).
4. Nel campo di testo **Nome Cartella Drive**, inserisci il nome esatto della cartella configurata nell'app di logging (es. `GPSLogger`).
5. Clicca su **Salva Configurazione Cartella** [4].

### Passo 2: Sincronizzazione Automatica (Background)
La PWA implementa un meccanismo di auto-sync intelligente per non disturbare l'utente [4]:
* All'apertura dell'applicazione, se l'utente è un Owner e sono trascorse più di **6 ore** dall'ultimo sync (parametro `DRIVE_SYNC_INTERVAL = 6 * 3600000`), Quo Vadis attende 5 secondi per consentire il caricamento dell'interfaccia, quindi richiede silenziosamente un token OAuth2 di Google [4].
* Se il token in sessione è scaduto, potrebbe apparire un pop-up rapido di Google che richiede il consenso (se non già concesso in precedenza).
* I file GPX modificati negli ultimi 60 giorni vengono scansionati. Quelli non presenti nell'elenco locale di `localStorage` (chiave `driveImportedFiles`) vengono scaricati, analizzati in background e i dati caricati direttamente su Firebase [4].
* Al termine, un toast di notifica verde informerà l'utente dell'avvenuta sincronizzazione (es. *“✅ Sincronizzati 2 tracciati GPS da Drive”*) [4].

### Passo 3: Sincronizzazione Manuale (Forzata)
Se hai appena terminato una tappa e vuoi vedere immediatamente il tracciato aggiornato sulla mappa [4]:
1. Assicurati che l'app di logging sul telefono abbia completato l'upload del file GPX su Google Drive.
2. In Quo Vadis, scheda **Posizione**, scorri fino alla sezione Drive e clicca sul pulsante **🔄 Sincronizza Ora** [4].
3. Se richiesto, autorizza l'accesso in lettura al tuo Google Drive.
4. L'applicazione mostrerà un indicatore di progresso (*“📡 Sincronizzazione file GPX da Drive...”*) e aggiornerà istantaneamente la mappa live e i chilometri del diario [4].

### Passo 4: Importazione Manuale da File Locale (Fallback)
Se ti trovi in una zona senza copertura di rete o preferisci non collegare Google Drive [4]:
1. Nella scheda **Posizione**, clicca sul pulsante **📂 Importa GPX / JSON** [4].
2. Seleziona il file `.gpx` memorizzato localmente sul tuo dispositivo.
3. Quo Vadis analizzerà il file e mostrerà un **Report di Importazione** interattivo, indicando il numero di punti rilevati, i chilometri stimati e le date coperte [4].
4. Clicca su **✅ Conferma Importazione** per salvare i dati nel database Firebase [4].

---

## 6. Risoluzione dei Problemi Comuni (Troubleshooting)

| Problema | Possibile Causa | Soluzione |
| :--- | :--- | :--- |
| **I tracciati presentano "salti" rettilinei o mancano intere ore di viaggio.** | Il sistema operativo del telefono ha terminato l'app di logging in background per risparmiare energia [2]. | Rivedi il **Passo 2 della Sezione 3**. Disattiva qualsiasi ottimizzazione della batteria per l'app di logging. Assicurati che il GPS sia impostato su "Consenti sempre". |
| **Il pulsante di sincronizzazione di Drive restituisce un errore di autorizzazione.** | Il token di Google OAuth2 è scaduto o bloccato dal browser [4]. | Svuota la cache del browser o effettua un logout e login in Quo Vadis. Assicurati che il browser non stia bloccando i cookie di terze parti o i pop-up di Google. |
| **La PWA dice "Nessun file trovato" anche se i file sono su Drive.** | Il nome della cartella inserito in Quo Vadis non corrisponde esattamente a quello su Drive [4]. | Verifica maiuscole/minuscole e spazi nel nome della cartella su Google Drive e nel campo di testo di Quo Vadis. |
| **I chilometri importati dal GPX sono inferiori a quelli reali del contachilometri.** | Il GPX contiene punti registrati a furgone fermo che sono stati scartati dal filtro di deduplicazione, oppure il segnale GPS è andato perso in galleria [4]. | Questo è normale. I dati GPS sono stime geometriche. Quo Vadis dà sempre la priorità al valore del contachilometri reale (`odometerKm`) se inserito manualmente tramite il pannello "Modifica Km" [4]. |

---

## 7. Riferimenti e Risorse Esterne
Per approfondimenti sui formati e sugli strumenti citati in questa guida, consultare le seguenti risorse:

* [1] [W3C Geolocation API Specification](https://www.w3.org/TR/geolocation/) — Documentazione ufficiale sulle API di geolocalizzazione nei browser web.
* [2] [Don't kill my app!](https://dontkillmyapp.com/) — Guida dettagliata su come impedire ai vari produttori di smartphone Android di terminare le applicazioni in background.
* [3] [Android Background Location Limits](https://developer.android.com/about/versions/11/privacy/background-location) — Documentazione ufficiale per sviluppatori Android sulle restrizioni di accesso alla posizione in background.
* [4] Codice Sorgente di Quo Vadis PWA (`app.js`, moduli `showTimelineImport`, `performDriveSync`, `importRecordsData`).
* [5] [GPX: GPS Exchange Format](https://www.topografix.com/gpx.asp) — Specifiche ufficiali dello standard XML per lo scambio di dati GPS.
* [6] [GPS Logger for Android GitHub Repository](https://github.com/mendhak/gpslogger) — Repository ufficiale e documentazione del logger consigliato.
* [7] [Overland iOS Location Tracker](https://overland.apollomapping.com/) — Sito ufficiale dell'applicazione di tracking consigliata per dispositivi Apple.
* [8] [OsmAnd Trip Recording Plugin](https://osmand.net/docs/user/plugins/trip-recording/) — Guida all'uso del plugin di registrazione dei tracciati in OsmAnd.
