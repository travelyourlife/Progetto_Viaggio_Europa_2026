# Guida Completa all'Installazione e Configurazione di Mendhak GPSLogger

**Mendhak GPSLogger** (`com.mendhak.gpslogger`) è una delle migliori applicazioni open-source per Android dedicate alla registrazione di tracce GPS [1]. A differenza di altre applicazioni presenti sul Google Play Store, è progettata specificamente per ridurre al minimo il consumo della batteria durante i lunghi viaggi o le escursioni [1]. 

Questa guida descrive dettagliatamente come installare l'applicazione, configurarla per massimizzare il risparmio energetico durante il viaggio in furgone del 2026, e attivare il caricamento automatico delle tracce su **Google Drive**.

---

## 1. Come Installare Mendhak GPSLogger su Android

A causa delle restrittive politiche di Google relative ai servizi in background e all'accesso ai file, l'applicazione è stata rimossa dal Google Play Store nel 2023 [5]. È tuttavia attivamente sviluppata e distribuita in modo sicuro attraverso canali alternativi ufficiali [1].

È possibile installare l'applicazione in due modi:

### Metodo A: Tramite F-Droid (Consigliato per gli aggiornamenti)
[F-Droid](https://f-droid.org/) è il catalogo di riferimento per le applicazioni open-source e sicure su Android [3].
1. Scarica e installa l'applicazione di F-Droid dal sito ufficiale [https://f-droid.org/](https://f-droid.org/) [3].
2. Apri F-Droid, cerca **GPSLogger** (sviluppato da *Mendhak*) e installalo [3].
3. Questo metodo ti consentirà di ricevere notifiche e aggiornamenti futuri in modo automatico [3].

### Metodo B: Installazione diretta del file APK (Più veloce)
Se non desideri installare F-Droid, puoi scaricare direttamente il pacchetto di installazione:
1. Visita la pagina ufficiale dei rilasci su GitHub dal tuo smartphone: [https://github.com/mendhak/gpslogger/releases](https://github.com/mendhak/gpslogger/releases) [2].
2. Identifica l'ultima versione stabile (es. **v135** o successiva) [2].
3. Nella sezione **Assets**, scarica il file con estensione `.apk` (ad esempio `gpslogger-135.apk`) [2] [3].
4. Una volta completato il download, apri il file. Se il sistema lo richiede, autorizza il browser (Chrome, Firefox, ecc.) a *"Installare applicazioni da sorgenti sconosciute"* nelle impostazioni di sicurezza di Android.

---

## 2. Configurazione per il Massimo Risparmio di Batteria

Per evitare che il GPS rimanga costantemente attivo e scarichi rapidamente lo smartphone, Mendhak GPSLogger permette di spegnere completamente il chip GPS tra una rilevazione e l'altra [1]. 

Di seguito viene riportata la configurazione ottimale consigliata per un viaggio stradale (road trip), bilanciando la precisione della traccia (un punto ogni 30-60 secondi) con l'efficienza energetica.

### Impostazioni di Logging (Logging Details)
Accedi al menu toccando l'icona con le tre linee in alto a sinistra, quindi seleziona **Logging details** [1]:
* **Log to GPX**: **Attivo (ON)** (il formato standard, leggero e compatibile con la mappa di *Quo Vadis*) [1].
* **Log to KML / CSV**: **Disattivo (OFF)** (riduce le operazioni di scrittura in memoria e risparmia energia).
* **New file creation**: Seleziona **Once a day** (crea un unico file GPX per ogni giorno di viaggio) [4].
* **Custom file name**: Puoi impostarlo come `viaggio-%Y%m%d` per avere file ordinati per data (es. `viaggio-20260603.gpx`).

### Impostazioni di Performance e Filtri (Performance)
Questo è il menu più importante per preservare la batteria. Seleziona **Performance** dal menu principale [4]:
* **Location providers**: Seleziona **GPS** (garantisce la massima precisione all'aperto) [4]. Disattiva *Network* e *Passive* per evitare che l'app si risvegli inutilmente con coordinate approssimative delle celle telefoniche [4].
* **Time before logging (Intervallo di tempo)**: Imposta a **30** o **60 secondi** [4]. Per un viaggio in auto/furgone, 30-60 secondi sono l'ideale: offrono una traccia fluida senza sovraccaricare il sistema.
* **Distance filter (Filtro distanza)**: Imposta a **10 metri** [1] [4]. Evita di registrare punti duplicati o "rimbalzi" del GPS quando sei fermo al semaforo o in un parcheggio.
* **Accuracy filter (Filtro precisione)**: Imposta a **40 metri** [1] [4]. Impedisce all'app di salvare punti totalmente errati (ad esempio quando entri in un tunnel o sotto una fitta copertura boscosa).
* **Duration to match accuracy**: Imposta a **10 secondi** [1]. Indica per quanti secondi il GPS deve tentare di ottenere un punto preciso prima di arrendersi. Un tempo troppo lungo tiene il GPS acceso inutilmente.
* **Keep GPS on between fixes**: **ASSOLUTAMENTE DISATTIVO (OFF)** [1] [4]. Questa è la chiave del risparmio energetico: quando è spento, l'applicazione spegne completamente il chip GPS durante l'intervallo di attesa (es. per 30 secondi) e lo riaccende solo per il tempo strettamente necessario a prendere il punto successivo [1].
* **Don't log if I'm not moving**: **Attivo (ON)** [4]. Sfrutta i sensori di movimento dello smartphone per sospendere la ricerca GPS quando il veicolo è fermo [2] [4].

---

## 3. Risoluzione dei Problemi di Background su Android 12+

I sistemi Android moderni (Android 12, 13, 14 e successivi) dispongono di sistemi di risparmio energetico estremamente aggressivi che tendono a "uccidere" le applicazioni in background, interrompendo la registrazione del percorso dopo pochi minuti [1] [6]. 

Per garantire che GPSLogger funzioni ininterrottamente durante il viaggio, è necessario applicare manualmente queste tre impostazioni di sistema [1]:

### 1. Autorizzazione della Posizione "Sempre"
Durante il primo avvio, o accedendo a *Impostazioni del Telefono > App > GPSLogger > Autorizzazioni > Posizione*:
* Seleziona tassativamente **Consenti sempre** (Allow all the time) [1] [3]. Se imposti *"Consenti solo quando l'app è in uso"*, Android interromperà la registrazione non appena spegnerai lo schermo [1].

### 2. Disattivazione dell'Ottimizzazione Batteria (Senza Limiti)
Android applica di default un profilo "Ottimizzato" che chiude le app in background.
* Vai in *Impostazioni del Telefono > App > GPSLogger > Batteria* (o *Utilizzo batteria app*) [7].
* Cambia l'impostazione da *Ottimizzata* (o *Con restrizioni*) a **Senza restrizioni** (Unrestricted) [1] [7].
* Per i dispositivi **Samsung**, **Xiaomi** o **Huawei**, che hanno politiche ancora più severe, consulta le guide specifiche sul sito di riferimento [Don't Kill My App](https://dontkillmyapp.com/) per evitare arresti anomali [1] [6].

### 3. Mantieni la Notifica Attiva
GPSLogger mostra una notifica persistente nella barra di stato quando è in funzione [1]. Non bloccare o nascondere questa notifica: serve a indicare ad Android che l'applicazione sta eseguendo un "servizio in primo piano" legittimo, impedendo al sistema operativo di terminarla per recuperare memoria RAM [3].

---

## 4. Configurazione del Caricamento Automatico su Google Drive

Una delle funzioni più potenti di Mendhak GPSLogger è la capacità di caricare automaticamente i file GPX registrati su uno spazio cloud personale, senza alcun intervento manuale [1] [4].

Di seguito la procedura per configurare il caricamento automatico su **Google Drive**:

1. Apri il menu laterale di GPSLogger e seleziona **Auto send, email and upload** [1] [4].
2. Seleziona **Google Drive** [1] [4].
3. Tocca **Authorize this app** (Autorizza questa app) [4]. Si aprirà una finestra del browser o una schermata di sistema in cui dovrai selezionare il tuo account Google e concedere a GPSLogger il permesso di scrivere file nel tuo spazio Drive [4].
4. Una volta completata l'autorizzazione, configura i seguenti parametri:
   * **Google Drive Folder**: Specifica il nome della cartella in cui salvare i file (es. `Viaggio_Europa_2026/Tracce_GPS`). Se la cartella non esiste, l'applicazione la creerà automaticamente.
   * **Upload on WiFi only**: **Attivo (ON)** se desideri risparmiare dati mobili all'estero (i file verranno caricati non appena il telefono si connetterà al WiFi del furgone o di un campeggio). Se hai un piano dati illimitato in Europa, puoi lasciarlo disattivato.
5. Torna indietro al menu *Auto send, email and upload* e configura la frequenza di invio [4]:
   * **Allow auto sending**: **Attivo (ON)** [4].
   * **How often (minutes)**: Imposta la frequenza di caricamento in minuti [4].
     * Se desideri un backup a fine giornata, imposta **1440** (24 ore) [4].
     * Se preferisci aggiornamenti più frequenti durante la guida, puoi impostare **180** (ogni 3 ore) o **60** (ogni ora).

---

## 5. Riepilogo delle Differenze: BasicAirData vs Mendhak

| Caratteristica | BasicAirData GPS Logger | Mendhak GPSLogger |
| :--- | :--- | :--- |
| **Disponibilità** | Google Play Store ✅ | F-Droid / GitHub (Sorgenti esterne) ⚠️ |
| **Intervallo minimo** | Fino a 1 secondo (continuo) | Configurabile (da 0 secondi a ore) |
| **Gestione Batteria** | Tiene il GPS costantemente acceso | Spegne il GPS tra un punto e l'altro (Duty Cycling) |
| **Consumo Batteria** | Elevato (~8-10% all'ora) | Molto ridotto (~2-4% all'ora a 30s) |
| **Caricamento Cloud** | Solo manuale | Automatico (Google Drive, Dropbox, FTP, ecc.) |
| **Uso Consigliato** | Tracciamento ad altissima precisione per brevi sessioni | Tracciamento a lungo termine per intere giornate di viaggio |

---

## Riferimenti

[1] [GPSLogger for Android Official Website](https://gpslogger.app/) - Documentazione ufficiale, FAQ e caratteristiche del risparmio energetico.  
[2] [Mendhak GPSLogger GitHub Releases](https://github.com/mendhak/gpslogger/releases) - Codice sorgente e pacchetti APK ufficiali per l'installazione diretta.  
[3] [F-Droid - GPSLogger Package Page](https://f-droid.org/en/packages/com.mendhak.gpslogger/) - Pagina ufficiale del pacchetto sul market open-source F-Droid.  
[4] [LearnOSM - GPSLogger for Android Guide](https://learnosm.org/en/mobile-mapping/gpslogger/) - Guida passo-passo alla configurazione dei profili e dei filtri di logging.  
[5] [Hacker News Discussion on GPSLogger Removal](https://news.ycombinator.com/item?id=24735159) - Dettagli sulla rimozione dell'app dal Google Play Store per via delle politiche sui permessi di scrittura e posizione.  
[6] [Don't Kill My App!](https://dontkillmyapp.com/) - Guida alla configurazione dei risparmi energetici proprietari dei vari produttori Android (Samsung, Xiaomi, ecc.).  
[7] [Google Pixel Help - Battery Optimization Settings](https://support.google.com/pixelphone/answer/7015477?hl=en) - Istruzioni ufficiali Google per la gestione dell'utilizzo della batteria in background per le singole applicazioni.
