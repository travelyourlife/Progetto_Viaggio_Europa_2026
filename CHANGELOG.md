## v3.23
- Corretti tutti i tempi di percorrenza stimati (verificati con Google Maps + fattore campervan)
- Corretti i km errati su 30 tratte
- Fix crash IIFE suggerimenti ricerca (Array.isArray su buildDayIndex)

# Quo Vadis — Changelog

## v4.27 — 2026-06-29
**Popup mappa arricchito + traccia GPS continua senza buchi (Mappa e Live)**
- **Popup mappa fullscreen arricchito**: toccando un marker sulla mappa a schermo intero degli Itinerari città, il popup ora mostra la **descrizione** e le **info pratiche** della tappa in un'area **scrollabile e responsive** (ottimizzata per schermi piccoli), oltre ai pulsanti direzioni già presenti.
- Aggiunto il pulsante **📖 Apri dettaglio** nel popup: chiude la mappa fullscreen, riporta alla tab Itinerari e apre/espande automaticamente la scheda completa della tappa selezionata. Bilingue IT/EN.
- **Ricostruzione gap GPS "al volo" (Spec Fix 3)**: introdotto un helper condiviso `_fillGapsOSRM` applicato sia alla mappa **"Mappa"** sia alla mappa **Live**. Quando tra due punti GPS registrati c'è un buco (≥ 3 km, es. tracciamento sospeso in galleria o app chiusa), il tratto mancante viene ricostruito con la **geometria stradale reale** tramite OSRM, ottenendo una **polyline rossa continua** per ciascuna giornata, senza salti in linea retta.
- Ricostruzione **solo a video** (nessuna scrittura su Firebase), con **cache sessionStorage** per gap già risolti e **fallback a interpolazione lineare** se OSRM non risponde entro il timeout. Limite di sicurezza sui gap molto grandi (GAP_MAX_KM=400) per evitare richieste improprie.
- Versione bump a **4.27**, cache-busting (`?v=4.27`) e precache del service worker allineati.

## v4.26 — 2026-06-29
**Traccia GPS reale (rossa) anche nella mappa "Mappa"**
- La mappa del tab **Mappa** ora mostra, sopra il percorso pianificato (verde/blu), la **traccia GPS realmente percorsa** in rosso, recuperata da Firebase per tutti i giorni passati — finora era visibile solo nella mappa **Live**.
- La traccia è disegnata **un giorno alla volta** (una polyline per giornata, senza unire la fine di un giorno con l'inizio del successivo), esattamente come nella mappa Live.
- Esclude il **giorno corrente** (ancora "live") per non duplicare la traccia di oggi.
- **Anti-duplicati**: le linee precedenti vengono rimosse prima di ridisegnare, così cambi di lingua o re-render non accumulano polyline sovrapposte.
- Richiede l'autenticazione (owner/follower); in assenza di login o dati la mappa pianificata resta invariata.

## v4.25 — 2026-06-29
**Reazioni e commenti sulle singole foto del diario**
- Ora ogni **foto** del diario può ricevere **reazioni** e **commenti**, non solo l'intero post. Aprendo una foto a schermo intero (lightbox) compaiono la barra delle reazioni e la sezione commenti.
- Le **reazioni** usano lo **stesso identico set** già presente in Chat e Diario (👍 ❤️ 😂 😮 🍻 🥳 🙏): una reazione per utente, ritocco per rimuoverla, con conteggio e nomi di chi ha reagito.
- I **commenti** per foto riusano lo stesso stile del diario: lista commenti con autore e data, campo per scrivere, invio con tasto Invio o pulsante, ed eliminazione consentita all'autore o all'owner.
- Dati salvati su Firebase sotto `diary/{post}/photos/{foto}/reactions` e `.../comments`, con aggiornamento **in tempo reale** mentre il lightbox è aperto.
- **Badge di riepilogo** (❤️ n · 💬 n) sulle miniature delle foto nel diario, per vedere a colpo d'occhio quali foto hanno interazioni senza doverle aprire.
- Bilingue IT/EN; listener Firebase staccato alla chiusura del lightbox per evitare perdite di memoria.

**Fix mappa live (spinner infinito al primo login)**
- Risolto un caso residuo per cui, al **primo accesso** con il tab "In Viaggio" già attivo, la mappa restava sullo spinner: `initMap()` non veniva richiamata quando `posizione-content` diventava visibile dopo l'autenticazione. Ora l'inizializzazione usa l'accessor esposto `window._initPosMap()` sia nel percorso **owner** sia in quello **follower approvato**.

## v4.24 — 2026-06-29
**Collegamenti Wikipedia automatici in Attività, Cibo e Cultura**
- I link Wikipedia (icona 📖) ora vengono **iniettati automaticamente** accanto ai termini rilevanti nelle tab **Attività**, **Cibo** e **Cultura**, senza modificare i testi a mano.
- **Fix dell'iniezione**: la funzione girava una sola volta al caricamento di `app.js`, quando `wiki-links.js` (caricato in modo lazy) e il contenuto delle tab non esistevano ancora — risultato: 0 link iniettati. Ora l'iniezione è una funzione riutilizzabile (`injectAllWikiLinks`) richiamata all'apertura delle tab, con ritentativi finché i dati sono disponibili. Risultato verificato: **389 link** iniettati (Attività 72, Cibo 116, Cultura 147).
- **Nuovi termini** aggiunti a `wiki-links.js`: tabella **WIKI_NATURE** (aurora boreale, sole di mezzanotte, sauna, fiordo, renna, Sami…), nuovi sentieri (WIKI_TREKS), parchi/aree naturali (WIKI_PARKS), diritto di libero accesso (Allemannsretten, Jokamiehenoikeus) e cucine nazionali (WIKI_FOOD). Tutti gli URL IT/EN verificati come pagine Wikipedia esistenti.
- Versione bump a **4.24**, cache-busting (`?v=4.24`) e precache del service worker allineati.

## v4.23 — 2026-06-29
**Ordine delle tappe negli Itinerari città — percorso a piedi sensato**
- Le tappe delle città erano numerate nell'ordine di inserimento dei dati, producendo sulla mappa un tracciato a zigzag (avanti e indietro). Ora un **ottimizzatore di percorso a piedi** (nearest-neighbour + raffinamento 2-opt) riordina automaticamente le tappe in una sequenza geograficamente logica, mantenendo la **prima tappa come punto di partenza**.
- La nuova numerazione è **coerente ovunque**: marker sulla mappa, linea del tracciato, popup ed elenco numerato seguono lo stesso ordine. Vale anche per la mappa a schermo intero.
- Applicato a **tutte le 21 città** a runtime (nessun dato riscritto a mano). Riduzione media del percorso a piedi di circa il 45% (totale ~261 km → ~138 km); es. Riga 10,0 → 4,4 km, Copenaghen 20,9 → 8,2 km, Bilbao 23,0 → 7,5 km. Salvaguardia inclusa: se l'ordine ottimizzato non risultasse migliore, viene mantenuto quello originale.
- **Cache-busting** aggiornato (`?v=4.23`) e precache del service worker allineato.

## v4.22 — 2026-06-28
Sezione **"Colonna sonora"** (playlist collaborativa nella Chat) resa più chiara e invitante.

- **Invito esplicito sempre visibile**: sotto al titolo "🎵 Colonna sonora — G_X_" compare ora la riga **"🎶 Tocca per suggerire una canzone per la tappa di oggi →"** (IT) / **"🎶 Tap to suggest a song for today's stop →"** (EN), così è chiaro che la sezione serve a proporre brani. La riga si nasconde automaticamente quando si apre la sezione (il form è già visibile) ed è cliccabile per aprirla.
- **Form più comprensibile**: aggiunta l'etichetta **"➕ Suggerisci un brano per oggi:"**, placeholder più chiari (**"Titolo canzone"**, **"Artista"**) e il pulsante mostra ora il testo **"➕ Invia"** invece della sola icona.
- **Freccia più evidente**: il chevron di apertura è ora un pallino azzurro ben riconoscibile come comando di espansione.
- Tutto bilingue IT/EN.

**Link interni nei messaggi (Chat/Diario)**
- I link che puntano alla stessa app con un'ancora di tab (es. `https://viaggio-europa-2026.web.app/#tab-diario`) **non aprono più una scheda esterna né ricaricano l'app**: ora vengono riconosciuti come navigazione interna e mostrati in forma breve e leggibile (es. **"📂 Diario"**). Cliccandoli si passa direttamente alla tab corrispondente con `switchTab`, restando dentro l'app. I link esterni continuano ad aprirsi normalmente in una nuova scheda.

**Mappa Itinerari città a schermo intero**
- Aggiunto un pulsante **⛶ Schermo intero** sull'angolo della mappa di ogni città (come nella Mappa Percorso). Apre un overlay a tutto schermo che ricostruisce gli stessi marker numerati, il percorso a piedi e i livelli di importanza, con titolo della città e pulsante di chiusura (×). Disponibile anche senza login (la mappa città è pubblica).

**Dati di viaggio — partenza da Selvazzano Dentro**
- Il viaggio parte ufficialmente da **Selvazzano Dentro** il **25/06/2026** (TRIP_START). Eventuali dati GPS/GPX registrati **prima** della partenza (es. il tracciato di test del **24/06**) vengono ora **ignorati**: non vengono più conteggiati nei km totali (Home + Statistiche) né mostrati nell'elenco dei riepiloghi giornalieri. La mappa percorso già caricava solo le tracce dal giorno di partenza in poi.

**Galleria foto e ordinamento (Diario)**
- **Tutte le foto dei post ora compaiono in Galleria**: risolta la causa per cui alcune foto sparivano. In fase di upload (sia nuovo post sia aggiunta a un post esistente) le foto usavano una chiave basata su `Date.now()` che, con più immagini caricate insieme, poteva **collidere e sovrascrivere** una foto con l'altra. Ora ogni foto usa una **chiave univoca** generata da Firebase (`push()`) e salva `uploadedAt`.
- **Ordine cronologico inverso affidabile**: la Galleria ordina le foto per data (più recenti in alto) e, a parità di giorno, per orario di caricamento/chiave cronologica, con supporto all'ordine manuale impostato nel post.
- **Galleria sempre aggiornata**: aprendo la vista Galleria viene ricaricata, così le foto appena aggiunte ai post compaiono subito senza dover riavviare l'app.
- **Riordino foto nei post (owner)**: ogni foto di un post con più immagini mostra i comandi **◀ ▶** per spostarla a sinistra/destra; il nuovo ordine viene salvato e si riflette sia nel post sia nella Galleria.

**Altro**
- **Cache-busting** aggiornato (`?v=4.22`) e precache del service worker allineato.

## v4.21 — 2026-06-28
Livelli di importanza e filtro "Solo imperdibili" negli **Itinerari città**.

- **3 livelli di importanza per ogni tappa**: ⭐⭐ **Imperdibile**, ⭐ **Consigliato**, nessuna stella = opzionale. La stella compare accanto al nome della tappa nella lista. I livelli sono assegnati con criteri oggettivi (siti UNESCO, landmark-simbolo della città, tipo di luogo, notorietà nelle fonti) — non in base a giudizi soggettivi. Su 359 tappe: **48 imperdibili**, **101 consigliate**, 210 opzionali; ogni città ha almeno una imperdibile.
- **Marker della mappa per livello**: le imperdibili (⭐⭐) hanno un marker più grande, dorato, con anello e stellina; le consigliate (⭐) sono arancioni; le altre mantengono il colore della categoria. Le imperdibili stanno sopra le altre (z-index) per essere sempre visibili.
- **Filtro "⭐ Solo imperdibili"**: un pulsante nasconde le tappe minori e mostra solo le ⭐⭐, per chi ha poco tempo e vuole il percorso essenziale. Si ripristina con "↩︎ Mostra tutte".
- Tutto bilingue IT/EN, con supporto tema chiaro e scuro.

**Posizione attuale unificata (sezione "In viaggio" + Home).** Risolto il caso in cui in zone rurali (es. una *seniūnija* lituana) la card "Siamo a:" mostrava solo il **Paese** invece del luogo specifico. Ora un unico geocoder condiviso (`_geocodePlace`, zoom=14 con catena di fallback `city → town → village → municipality → hamlet → suburb → ... → county`) alimenta **Home, card "Siamo a:" e scrittura su Firebase**, così tutte le viste mostrano sempre lo **stesso luogo specifico** (es. *Pasvalys* / *Ąžuolynė*, non solo "Lituania"). Nessuna dipendenza dal check-in.

**Pulsante "Itinerari città".** Aggiunto nella schermata "Itinerario — Giorno per Giorno" un pulsante verde **🗺️ Itinerari città** accanto a "📅 Vai a oggi", che apre direttamente la sezione Itinerari città. Il box dei pulsanti è ora sempre visibile (anche fuori dal periodo di viaggio), così l'accesso agli Itinerari città è sempre disponibile. Bilingue IT/EN.

**Fix: spinner infinito sulla mappa di "In viaggio".** Aprendo la tab "In viaggio" da loggato, la mappa Leaflet a volte restava bloccata sullo spinner di caricamento. Ora l'inizializzazione della mappa è idempotente e lo spinner viene sempre rimosso una volta pronti i tile (con fallback temporizzato di sicurezza), così la mappa con furgone/posizione si mostra correttamente.

**Fix: pulsante "Vai a oggi".** Il pulsante non scrollava al giorno corrente quando veniva premuto mentre la tab Itinerario non era ancora attiva (il contenuto era `display:none`, quindi le coordinate erano nulle). Ora il pulsante: (1) attiva la tab Itinerario se necessario, (2) apre **solo** l'accordion del giorno di oggi chiudendo gli altri, (3) scrolla l'intestazione del giorno appena sotto la barra superiore. Verificato su G4 (oggi).

- **Cache-busting** aggiornato (`?v=4.21`) e precache del service worker allineato.

## v4.20 — 2026-06-28
Popup mappa più compatto negli **Itinerari città**.

- **Popup marker compatto**: toccando un numero sulla mini-mappa il popup mostra ora solo **titolo + breve teaser + i 3 pulsanti indicazioni** (🚶 A piedi / 🛴 Monopattino / 🚍 Mezzi). Rimossi la descrizione lunga e il link "Leggi tutto" dal popup, che occupavano quasi tutta la piccola mappa. La descrizione completa resta disponibile nella lista delle tappe sotto la mappa.
- **Cache-busting** aggiornato (`?v=4.20`) e precache del service worker allineato.

## v4.19 — 2026-06-28
Nuova città negli **Itinerari città** e rimozione di una funzione del Diario.

- **Aggiunta León (Spagna)** agli Itinerari città: 12 tappe a piedi nel centro storico (Cattedrale gotica "Casa della Luce", Casa Botines di Gaudí, Basílica de San Isidoro, Palacio de los Guzmanes, Parador de San Marcos, Plaza Mayor, Barrio Húmedo, Plaza del Grano, mura romane, ecc.), con descrizioni bilingui IT+EN, coordinate reali e fonti.
- **Ordine geografico**: i chip della Spagna seguono ora il flusso del viaggio → San Sebastián → Bilbao → **León** → Palencia → Genova. Totale **22 città / 359 tappe**.
- **Rimosso il pulsante "Ci sono stato!" / "I was there!"** dai post del Diario (markup, contatore, elenco nomi, handler di click e regole CSS associate). Restano invariati reazioni e commenti.
- **Cache-busting** aggiornato (`?v=4.19`) e precache del service worker allineato.

## v4.18 — 2026-06-28
Fix dei tre pulsanti indicazioni (🚶 A piedi / 🛴 Monopattino / 🚍 Mezzi) negli **Itinerari città**.

- **Risolto: i tre pulsanti sembravano identici** sul telefono. Quando l'app non aveva ancora la posizione GPS (caso tipico su mobile prima di aprire la mappa), il fallback introdotto in v4.14 apriva per tutti e tre lo stesso link di "ricerca destinazione", ignorando il mezzo di trasporto.
- Ora **ogni pulsante genera sempre un percorso con il proprio `travelmode`** (`walking` / `bicycling` per il monopattino / `transit`), anche senza GPS: il link omette l'origine e Google Maps usa automaticamente la posizione attuale del telefono.
- Quando la posizione live è nota, l'origine viene comunque fissata su "qui" (href ricalcolato al tocco).
- **Cache-busting** aggiornato (`?v=4.18`) e precache del service worker allineato.

## v4.17 — 2026-06-28
Forte espansione dei contenuti della sezione **Itinerari città**: molti più luoghi da visitare per ogni città.

- **Da 100 a 347 tappe** complessive sulle 20 città: ora ogni città include tutti i luoghi rilevanti da percorrere a piedi (non più solo 5).
- Esempi di copertura: **Vienna 23**, **Vilnius 23**, **Varsavia / Copenaghen 21**, **San Sebastián / Bilbao 20**, **Riga 19**, **Amiens / Tallinn 18**, **Tromsø / Genova 17**, **Brema / Palencia / Leoben 16**, **Rovaniemi / Bergen 15**, **Oulu / Trondheim 14**, **Stavanger / Kristiansand 12**.
- Ogni nuova tappa ha **descrizioni estese bilingui IT+EN** da fonti reali (lunghezza media ~460 caratteri), teaser, info pratiche, **fonti citate**, **coordinate reali verificate** dentro i confini città e link mappa.
- **Deduplica** automatica per nome e per vicinanza (~70 m) rispetto alle tappe esistenti; ID tappa rigenerati in sequenza per città.
- Mappa Leaflet verificata con il maggior numero di marker (es. Vienna con 23 marker numerati e tracciato a piedi).
- Piccola pulizia qualità: rimosse 2 voci non turistiche da Leoben.
- **Cache-busting** aggiornato (`?v=4.17`) e precache del service worker allineato.

## v4.16 — 2026-06-28
Fix del caricamento nella funzione **Importa da Screenshot** (Admin → spese).

- **Risolto l'errore `storage/unauthorized`**: l'upload dello screenshot su Firebase Storage nel percorso `expenses/{familyId}/...` veniva rifiutato perché in `storage.rules` non esisteva alcuna regola per quel percorso (cadeva nel blocco finale che nega tutto).
- Aggiunta una regola dedicata: lettura per gli utenti autenticati, **scrittura riservata agli owner** per file immagine fino a 10 MB (coerente con le altre regole di Storage).
- **Nota deployment**: questo fix richiede il deploy delle regole di Storage (`firebase deploy --only storage`), non incluso nel deploy di hosting/functions/database.

## v4.15 — 2026-06-28
Espansione della sezione **Itinerari città** da 11 a **20 città**, coprendo tutte le tappe urbane del viaggio.

- **9 nuove città** aggiunte: **Leoben** (AT), **Rovaniemi** e **Oulu** (FI), **Tromsø**, **Stavanger** e **Kristiansand** (NO), **Brema** (DE), **Amiens** (FR) e **Palencia** (ES).
- Ogni nuova città ha un itinerario a piedi di **5 tappe** (45 nuove tappe, **100 in totale**) con descrizioni bilingui IT+EN basate su fonti reali (Wikipedia, siti ufficiali di musei/turismo), teaser, info pratiche e fonti citate per ogni tappa.
- Le città sono ora ordinate secondo la **sequenza reale del viaggio** (Leoben → Vienna → … → Palencia → Genova).
- Coordinate reali verificate per tutte le 45 nuove tappe (dentro i confini delle rispettive città); categorie allineate alle icone dell'app. Mappe Leaflet con marker numerati e tracciato a piedi verificate (es. Tromsø attraversa il fiordo fino alla Cattedrale dell'Artico).

## v4.14 — 2026-06-28
Fix dei pulsanti indicazioni (🚶/🛴/🚍) nella sezione **Itinerari città**, soprattutto su telefono.

- **Fix link indicazioni su mobile**: i pulsanti percorso usavano un link Google Maps con origine vuota, che sul telefono poteva non aprire nulla finché l'app non aveva la posizione GPS. Ora, quando la posizione non è ancora disponibile, il pulsante apre comunque **il luogo di destinazione** su Google Maps (`maps/search`), garantendo che apra sempre qualcosa di utile.
- **Percorso completo quando c'è il GPS**: se la posizione live è disponibile, il pulsante calcola il percorso reale **dalla tua posizione** alla tappa con il mezzo scelto (a piedi / monopattino / mezzi).
- **Href aggiornato al click**: il link viene ricalcolato al momento del tocco, così se la posizione arriva dopo l'apertura della pagina il percorso parte comunque da dove ti trovi.
- **Cache-busting** sugli script della sezione (`?v=4.14`) e allineamento del precache del service worker, per garantire che il fix arrivi subito ai dispositivi.

## v4.13 — 2026-06-28
Estensione della sezione **Itinerari città** a **tutte le città principali del viaggio**: ora 11 città con itinerario a piedi completo.

- **10 nuove città** aggiunte alla sezione (oltre a Vilnius): **Vienna, Varsavia, Riga, Tallinn, Trondheim, Bergen, Copenaghen, San Sebastián, Bilbao, Genova**, ordinate secondo la sequenza del viaggio.
- Ogni città ha un itinerario a piedi di **5 tappe** (55 tappe totali) con descrizioni estese bilingui IT+EN basate solo su fonti reali (Wikipedia, UNESCO, siti ufficiali di musei/turismo), teaser, note pratiche (orari/prezzi/indirizzi) e fonti citate per ogni tappa.
- I **chip città** in cima alla sezione permettono di passare da una città all'altra; ogni città mantiene mappa Leaflet con marker numerati, tracciato a piedi tratteggiato, popup espandibili e indicazioni multimodali (🚶/🛴/🚍).
- Coordinate reali verificate per tutte le 55 tappe; categorie allineate alle icone dell'app.
- Nessuna modifica al codice UI necessaria: il modulo era già multi-città; verificato il rendering in entrambe le lingue (IT/EN).

## v4.12 — 2026-06-28
Nuova sezione **Itinerari città** (Altro → Itinerari città) con la prima città completa: **Vilnius**.

- **Nuova sezione "Itinerari città"**: percorsi a piedi nelle città principali del viaggio, con schede tappa espandibili (accordion "Leggi tutto / Read more") e descrizioni estese bilingui IT+EN basate solo su fonti reali (Wikipedia, UNESCO, siti ufficiali musei/turismo). Ogni tappa riporta le fonti consultate.
- **Mappa itinerario interattiva** (Leaflet/OpenStreetMap) dedicata a ciascuna città: marker numerati in ordine di visita e **tracciato a piedi tratteggiato** che collega le tappe (guida indicativa, non navigazione stradale).
- **Puntino blu "posizione live"**: la mappa mostra in tempo reale la posizione dell'utente (`watchPosition`), attivata all'apertura della mappa e fermata all'uscita dalla sezione.
- **Indicazioni multimodali**: per ogni tappa tre pulsanti — 🚶 A piedi, 🛴 Monopattino, 🚍 Mezzi — che aprono Google Maps con `travelmode` walking/bicycling/transit a partire dalla posizione corrente.
- **Popup mappa espandibili**: cliccando un marker si apre un popup con descrizione breve, "Leggi tutto" per il testo esteso e gli stessi pulsanti indicazioni.
- **Vilnius**: itinerario completo a piedi nel centro storico UNESCO con 8 tappe (Torre di Gediminas, Giardino Bernardino, Museo dei Giocattoli, Užupis, Halės Turgus, Piazza della Cattedrale, Via Pilies, Caffè di Užupis).
- Integrazione in entrambe le lingue (`index.html` e `index_en.html`) e nuova tile nel menu "Altro".

## v4.11 — 2026-06-28
Fix di codifica caratteri (mojibake) nei contenuti delle tappe.

- **FIX mojibake in `days-renderer.js`**: il file conteneva testo UTF-8 interpretato erroneamente come CP1252 (es. `ðŸ"‹` invece di 📋, `â›½` invece di ⛽, bandiere e simboli corrotti) visibile nei blocchi "Info Pratiche / Practical Info", "Pernottamento", "Carburante", "Emergenze", nella guida gastronomica e nelle etichette dei paesi. Ripristinati correttamente tutti i 114 caratteri emoji e i 61 simboli/box-drawing corrotti.
- Riparazione effettuata con decodifica inversa CP1252→UTF-8 più correzione mirata dei pochi token con byte irrecuperabili (bandiera 🇨🇿, famiglia 👨‍👩‍👧‍👦, 🍽️, 🅿️, 🚑, 🔗); verificato che lo scheletro di codice resti invariato (nessuna modifica logica) e che la sintassi JS sia valida.
- Scansione dell'intero progetto: nessun altro file conteneva mojibake.

## v4.10 — 2026-06-28
Interventi derivati dall'audit tecnico (priorità P0→P4). Verificate riga per riga sul codice reale; gli item già risolti in build precedenti (es. `escapeHtml` apice singolo, pulsante `wasThere` sempre visibile) sono stati confermati e non ritoccati.

**P0 — Critici**
- **FIX conversione valute (`toEur`)**: le valute non presenti in `FX_RATES` non vengono più trattate erroneamente 1:1 con l'EUR. `toEur` ora restituisce `null` (segnale di errore) e il salvataggio manuale/modifica di una spesa viene **bloccato** con avviso se la valuta non è supportata. Per la sola visualizzazione/aggregazione è stato introdotto `toEurDisplay`, che evita `NaN` sui record storici.
- **FIX rate-limit atomico (Cloud Functions)**: `checkRateLimit` è stato convertito da `once()`+`set()` (soggetto a race condition) a una **transazione atomica** (`transaction()`), evitando che richieste concorrenti aggirino il limite.

**P1 — Alta priorità**
- **FIX GPS resume**: anche nel percorso di ripristino del tracking, in caso di permesso negato il watcher si **ferma automaticamente** (come già avveniva nel percorso principale), evitando uno stato "attivo" che non registra.
- **Hardening `linkify`**: regex resa case-insensitive e aggiunta validazione esplicita del protocollo (`http/https`) per rafforzare la difesa anti-XSS sui link generati dagli utenti.

**P2 — Media priorità**
- **Dark mode**: aggiunti override per il picker reazioni dei commenti (`.comment-react-picker`, ora con classe CSS dedicata al posto dello stile inline) e per i popup Leaflet (`.leaflet-popup-content-wrapper`/`.leaflet-popup-tip`), migliorando la leggibilità dei tip sulla mappa in tema scuro.
- **Import GPX più robusto**: il completamento dell'importazione ora attende (via `Promise.all`) sia la scrittura del tracciato sia quella del riepilogo giornaliero, così il toast "completato" compare solo a dati effettivamente persistiti.
- **Retry OpenAI (Cloud Functions)**: le tre chiamate OpenAI (traduzione, OCR screenshot, parsing PDF) usano un helper `fetchOpenAIWithRetry` con backoff esponenziale sugli errori transitori (429/500/502/503/504); timeout/abort preservati.

**P3/P4 — Bassa priorità / debito tecnico**
- **Error callback sui listener Firebase**: `registerFirebaseListener` ora applica un error callback di default a tutti i listener registrati (log + eventuale avviso), così un errore di permessi/rete non resta silenzioso. Aggiunti callback dedicati anche ai listener di diario e spese nel percorso di fallback.
- **Tassi di cambio configurabili**: all'avvio del modulo spese, eventuali tassi presenti in `trips/{id}/fxRates` sovrascrivono i valori hardcoded (con validazione), consentendo l'aggiornamento dei cambi senza ridistribuire l'app. Fallback completo ai valori di default.
- **Lazy-loading immagini**: confermato già presente sulle immagini di feed/commenti/avatar; la lightbox resta volutamente a caricamento immediato.
- **Nota App Check**: raccomandazione di configurazione lato console Firebase (non una modifica di codice) documentata a parte.
- **Cache bump**: `CACHE_NAME` aggiornato a `quo-vadis-v4.10`.

## v4.09 — 2026-06-28
- **Diario — bozza di default**: i nuovi post del diario vengono ora creati come **bozza** e non più pubblicati automaticamente. Sono visibili solo all'organizzatore finché non vengono pubblicati esplicitamente con il pulsante "✅ Pubblica".
- **Diario — modale "Modifica voce" con doppia azione**: aggiunti i pulsanti **"Salva bozza"** (secondario) e **"Salva e pubblica"** (primario, verde). Lo stato del post non dipende più solo dalla data ma dall'azione scelta.
- **FIX ordinamento timeline diario**: la timeline è ora ordinata principalmente per **data reale** (decrescente), con `dayNumber` e `createdAt` come tiebreaker. Corregge i post che apparivano in posizione errata (es. "Si parte!" del 25/06 mostrato sopra il 27/06).
- **FIX `dayNumber` non sincronizzato**: modificando la **Data** di una voce nel modale, il `dayNumber` (giorni dalla partenza) viene ora ricalcolato automaticamente, mantenendo coerenti l'etichetta "Giorno N" e l'ordine cronologico.
- **Cache bump**: `CACHE_NAME` aggiornato a `quo-vadis-v4.09` per forzare l'aggiornamento del service worker e ricaricare gli asset.

## v4.08 — 2026-06-27
- **FIX `days-renderer.js` language bug**: `_isEN` spostato prima di `COUNTRY_LABELS` — la versione EN ora mostra correttamente i nomi dei paesi in inglese.
- **FIX GPS error recovery**: se il permesso posizione viene negato, il tracking si ferma automaticamente (prima restava "attivo" senza registrare).
- **FIX Nominatim User-Agent dinamico**: usa `EXPECTED_VERSION` a runtime invece di versione hardcoded.
- **FIX `removeChild` null check**: 4 file picker ora verificano `document.body.contains()` prima di rimuovere l'input (previene `NotFoundError` su alcuni browser).
- **FIX `var db` shadowing**: rinominato a `delBtn` nel handler commenti per evitare conflitto con il riferimento Firebase.
- **FIX Firebase rules `wasThere`**: aggiunta regola per permettere ai follower approvati di marcare "Ci siamo stati!" sui post del diario.
- **Limite post diario aumentato**: da 500 a 2000 caratteri (`#diario-edit-text` maxlength + rows da 4 a 6).

## v4.07 — 2026-06-27
- **Sezione "A piedi" rinnovata** con 3 sotto-sezioni:
  - 👣 **Passi giornalieri (Garmin)**: passi + km inseriti manualmente dal Garmin (type=daily_walk)
  - 🧥 **Hiking (Strava)**: km da attività Hike/Walk sincronizzate automaticamente via webhook Strava
  - **Totale viaggio**: somma km (daily + hiking) + passi totali
- **Input Garmin/manuale**: pulsante "+ Aggiungi giorno" (owner only) apre modal con campi Data, Passi (da Garmin), Km a piedi, Nota. Se km vuoto, stima automatica da passi (×0.0007).
- **Rimossa riga "Oggi"** e chip bici/dislivello dalla sezione attività.
- **Nuovo campo `steps`** nel nodo Firebase `/activities` — i passi si sommano nel totale viaggio.
- **CSS `pos-chip-purple`**: aggiunta classe per chip passi (light + dark mode).
- **Rimossi dalla chat**: pulsante 🎙️ 5s (quick voice) e ✉️ cartolina (postcard) + relativi handler JS.

## v4.04 — 2026-06-27
- **Zero prompt() residui**: sostituiti gli ultimi 2 `prompt()` (edit nome sosta + edit displayName admin) con modal custom `_showPromptModal`. L'app è ora 100% compatibile iOS PWA.
- **Listener singleton guards**: aggiunti guard `_listenerAttached_*` ai 6 listener globali del sync block (checkins, currentDay, notes, zaino, livePosition, quizScores) per prevenire doppio attach.
- **restMode**: salvataggio parcheggio notte scrive `restMode: true` su `/currentLocation`. Home mostra badge ambra "🌙 Sosta notturna" + riepilogo G[N] + anteprima G[N+1]. Avvio tracking mattina rimuove il flag.
- **Dark mode 4 classi**: aggiunti override per `.diario-draft-badge`, `.admin-card`, `.chat-postcard/.chat-postcard-card`, `.playlist-section`.
- **importRecordsData date range**: warning esplicito se tutte le date sono fuori range viaggio; skip automatico date fuori range con toast informativo.
- **hv-badge-amber CSS**: aggiunta classe per badge ambra (light + dark mode) in home-variants.css.

## v4.03 — 2026-06-27
- **Rimossa feature "Ci siamo stati!"**: rimosso pulsante, render, click handler e regole database.
- **Reazioni aggiornate**: rimossa 🔥 (fuoco), aggiunte 🍻 (birre) e 🥳 (party) sia ai post che ai commenti.

## v4.02 — 2026-06-27
- **P0 Firebase Listener Cleanup**: aggiunto `.off()` prima di `.on()` su tutti i listener ripetibili (loadCheckins, renderParkingList, renderCustomCheckins, renderDailySummaries, notification drawer, playlist, home-variants /currentLocation). Rimosso listener `currentDay` duplicato. Previene memory leak dopo ore di uso.
- **P1 Rate Limiting Cloud Functions**: aggiunta funzione `checkRateLimit()` con contatore giornaliero per-utente. Limiti: `translatePost` 50/giorno, `parseExpenseScreenshot` 20/giorno, `parseExpensePdf` 10/giorno. Previene abuso e costi imprevisti.
- **P1 XSS Fix**: aggiunto `escapeHtml()` su tutti i dati utente in `innerHTML` (parking name, weather card name, curiosità body/source)
- **P1 Database Rules — String Limits**: aggiunti limiti lunghezza a `pendingUsers` (displayName ≤100, email ≤200), `playlist` (song ≤200, artist ≤200, displayName ≤100), `chat/users` (name ≤100, email ≤200)
- **P1 Storage Rules — Postcards**: aggiunta regola per `postcards/{familyId}/{filename}` (immagini max 5MB, utenti autenticati)
- **P2 Dark Mode**: aggiunto `background` e `color` con CSS variables ai textarea/input dei modal cartolina e map tips
- **P2 Nominatim**: User-Agent aggiornato a `QuoVadis-TripApp/4.02`; chiamata country detection ora usa `_nominatimFetch` (rate limiting + UA) invece di `fetch` diretto
- **P2 importRecordsData Nominatim**: fallback country lookup ora usa `_nominatimFetch` invece di `fetch` diretto

## v4.01 — 2026-06-27
- **Firebase Rules**: aggiunte regole per `mapTips`, `playlist`, `wasThere`, `comments/reactions` — i follower ora possono scrivere
- **#18 Cartolina — fix iOS PWA**: sostituito `prompt()` (bloccato su iOS standalone) con modal custom
- **#18 Cartolina — push notification**: aggiunta Cloud Function `notifyNewPostcard` per notifica ai follower
- **#2 "Ci siamo stati!"**: corretto path Firebase da `beenThere` a `wasThere` (coerente con le rules); toggle ora scrive `true` (boolean)
- **#11 Map Tips**: aggiunto pulsante "Aggiungi consiglio" e "Tips ON/OFF" in HTML (IT + EN); owner può eliminare qualsiasi pin; limite 120 caratteri con contatore; modal custom al posto di `prompt()`
- **#7 Voce rapida — countdown visivo**: il pulsante ora mostra 5→4→3→2→1→✔ durante la registrazione
- **#Extra Reazioni commenti**: confermato già implementato (render + click handler presenti)
- **Storage Rules**: aggiunta regola per foto commenti (`diary/{fid}/{postKey}/comments/{file}`) — qualsiasi utente autenticato può caricare immagini max 5MB
- **Fix città follower**: soglia freshness `/currentLocation` portata da 60 min a 24h (fix Aurora vede Varsavia)
- **Fix scroll modali**: `diario-edit-modal`, `manual-km-modal`, `install-modal`, `family-modal-card`, `ios-install-card`, `hv-role-modal` ora scrollabili su schermi piccoli

## v3.22 — 2026-06-19
- **Fix suggerimenti ricerca non funzionanti**: `buildDayIndex()` nell'IIFE dei suggerimenti lanciava un errore silenzioso (`day.trekking.forEach is not a function`) perché alcuni giorni hanno `trekking` come oggetto/stringa anziché array. L'errore bloccava l'intera IIFE prima che l'`addEventListener` venisse raggiunto, rendendo il dropdown completamente inerte. Aggiunto `Array.isArray()` per tutti i campi iterati (`highlights`, `food`, `kids`, `trekking`, `fishing`, `alternatives`, `events`).
- **Nessuno spazio vuoto in alto**: confermato fix dal v3.21 (wrapper interno non tocca il parent overlay).

## v3.21 — 2026-06-19
- **Fix spazio vuoto in alto nella Home**: il dropdown suggerimenti v3.20 sovrascriveva `position: relative` sul search-overlay (che deve restare `fixed`), creando 60px di spazio fantasma. Ora il dropdown usa un wrapper interno dedicato.
- **Fix suggerimenti ricerca non visibili**: il dropdown veniva appeso al search-overlay con posizionamento rotto. Ora viene inserito in un `<div>` wrapper con `position: relative` attorno all'input, senza toccare il parent overlay.
- **Fix modal installazione pointer-events**: il modal overlay ora ha `pointer-events: none` quando chiuso, impedendo blocco dei click sulla pagina sottostante.

## v3.20 — 2026-06-19
- **Search Suggestions Dropdown**: autocomplete intelligente nella barra di ricerca
  - Mostra sezioni tematiche prioritizzate (Campeggio, Cibo, Trekking, Pesca, Meteo, ecc.) come primo risultato
  - Sotto: risultati per giorno dall'itinerario con match nel titolo, narrative, POI, cibo, attività
  - Max 3 sezioni tematiche + 5 risultati giornalieri
  - Click su un suggerimento → naviga direttamente alla sezione/giorno corretto
  - Navigazione con frecce tastiera + Enter
  - Dark mode supportato
  - Appare dopo 2+ caratteri con debounce 150ms

## v3.19 — 2026-06-18
- **Istruzioni installazione migliorate**: aggiunta posizione esatta degli elementi UI per ogni browser/dispositivo
  - Tutti i riferimenti a pulsanti ora includono "in alto a destra", "in basso", "angolo in basso a destra", ecc.
  - Mac Chrome: "3 puntini, in alto a destra"
  - Mac Edge: "3 puntini, in alto a destra"
  - Mac Safari: "barra menu in alto"
  - Samsung Internet: "in basso" / "in basso a destra"
  - Firefox iOS: "3 linee, angolo in basso a destra"
- **Logica banner corretta**: modal solo alla 1ª visita, banner ogni 2 visite (3ª, 5ª, 7ª...)
  - Nessun reminder modal ripetuto
  - Visite pari: nessuna interruzione

## v3.18 — 2026-06-18

### Install UX completo (modal + banner + reminder + notifiche)

- **Modal primo accesso**: overlay a schermo intero con istruzioni step-by-step specifiche per dispositivo/browser
  - iPhone Safari: 3 step con nota per layout Compact iOS 26 (⋯ → Condividi)
  - iPhone Chrome: 3 step con Share in alto a destra
  - iPhone Firefox: 4 step con menu hamburger
  - iPhone altro browser: suggerisce Safari + pulsante "Copia link"
  - Android Samsung Internet: ⊕ nella barra indirizzi oppure ≡ → Aggiungi a Home
  - Android Chrome/altro: ⋮ → Aggiungi a Home / Installa app
  - Mac Chrome: ⋮ → Trasmetti, salva e condividi → Installa pagina come app
  - Mac Safari: File → Aggiungi al Dock
  - Mac Edge: … → App → Installa il sito come app
  - Desktop Firefox: suggerisce Chrome/Edge
  - Chrome/Edge/Samsung con `beforeinstallprompt`: pulsante "Installa Ora" diretto

- **Banner sottile** (ogni 2 visite dal browser, a partire dalla 3ª):
  - Richiudibile con ✕, non riappare nella stessa sessione
  - Istruzioni specifiche per piattaforma (stesse del modal, versione compatta)
  - Appare alle visite 3, 5, 7, 9...

- **Prompt notifiche** (app installata, una sola volta):
  - Appare al 2° avvio dell'app installata (standalone)
  - Solo se `Notification.permission === 'default'`
  - "No grazie" → non riappare mai più
  - "Attiva Notifiche" → lancia `requestPushPermission()`

- Rilevamento browser iOS migliorato (CriOS, FxiOS, EdgiOS separati)
- Nuovo CSS `.install-modal-*` con backdrop blur, animazioni scale+translate
- Visit counter dedicato (`qv-install-visits`) separato dal visit count notifiche

## v3.17 — 2026-06-17
- Meteo live ridotto a 7 giorni (era 16) per coerenza con yr.no
- Invertito ordine sub-sezioni Notifiche (Orari prima di Preferenze)
- Swap completato anche nella versione EN


## v3.16 (17 giugno 2026)
UI/UX admin + itinerario: separazione sezioni, accordion esclusivo, navigazione dropdown.

### Admin
- **Separato "Utenti" e "Notifiche"** in due accordion distinti (prima erano combinati in uno solo).
- Aggiunto anchor `admin-sec-notifiche` e voce "🔔 Notifiche" / "🔔 Notifications" nel jump menu.
- Rimosso "🔗 Links" dal jump menu (la sezione resta dentro Sistema & Debug).
- **Accordion esclusivo**: aprire un accordion admin chiude automaticamente tutti gli altri.

### Accordion esclusivo globale
- Tutti i `details.pos-accordion` nella stessa sezione tab sono ora esclusivi (aprire uno chiude gli altri).
- Stile card unificato per `.pos-accordion` (prima era senza stile — ora ha bordo, border-radius, padding come Legenda).

### Itinerario: navigazione regioni → dropdown
- Convertito il nav orizzontale scrollabile (iqn-pills) in dropdown collassabile "🗺️ Vai a regione..." / "🗺️ Go to region...".
- Pills ora centrate e wrappate nel dropdown aperto.
- Auto-chiusura dropdown dopo selezione regione.

### Stile
- `justify-content: center` per pills nei dropdown aperti (collapsible tab-index).
- Dark mode per `.iqn-toggle` e `.pos-accordion`.

---

## v3.14 (17 giugno 2026)
Fix meteo live: previsioni ora funzionano (re-query elementi dopo rendering dinamico, delay 500ms). Tap su meteo apre yr.no con coordinate del giorno.

---

## v3.13 (16 giugno 2026)
Fix critico: aggiornamento PWA ora funziona correttamente (EXPECTED_VERSION + CACHE_NAME sincronizzati, hardRefresh con cache-bust, SKIP_WAITING su banner).

---

## v3.12 (16 giugno 2026)
Admin jump menu → dropdown "Vai a sezione..." (stile unificato con Cibo/Attività/Luoghi/Piano).

### Fix: Admin jump menu
- Il menu di navigazione admin ora usa lo stesso dropdown collassabile delle altre sezioni.
- Aggiunto `tab-admin` alla lista `collapsibleSections` → il JS genera automaticamente il bottone "📑 Vai a sezione..." con chevron.
- Rimosso `style="margin:12px 0"` inline per coerenza con gli altri tab-index.

---

## v3.11 (16 giugno 2026)
Import CSV/PDF spese + fix UX admin + ottimizzazione caricamento.

### Cloud Functions v1.97
- **NEW**: `parseExpensePdf` — onCall: riceve testo estratto da PDF, lo invia a GPT-4o per categorizzazione automatica delle transazioni.

### Expense: Import CSV/Excel (client-side)
- Nuovo bottone "📊 Importa CSV / Excel" nella sezione Spese.
- Parsing locale (zero costi API): auto-detect separatore (virgola, punto e virgola, tab).
- Auto-mapping colonne per Revolut, N26, Wise, banche EU (date, amount, description, currency).
- Categorizzazione automatica basata su keyword matching (Shell→carburante, Lidl→cibo, ecc.).
- Preview con checkbox per conferma selettiva prima dell’import.

### Expense: Import PDF (AI-powered)
- Nuovo bottone "📄 Importa PDF (AI)" nella sezione Spese.
- Estrazione testo via pdf.js (caricato on-demand da CDN), poi invio a Cloud Function `parseExpensePdf`.
- GPT-4o analizza e categorizza tutte le transazioni trovate.
- Stesso flusso di preview/conferma dello screenshot OCR.

### Fix: Grafici spese — spazio vuoto eliminato
- I canvas dei grafici (categoria + giornaliero) ora partono con `display:none`.
- Vengono mostrati solo quando ci sono spese effettive da visualizzare.

### Fix: Admin/Tracking appaiono subito (no refresh)
- Aggiunto show ottimistico per `posizione-content`, `posizione-gate`, `pos-admin-panel` e `diario-content`.
- Se `qv-owner-hint` è presente in localStorage, il contenuto viene mostrato immediatamente senza attendere Firebase Auth.
- Elimina la necessità di refresh manuale dopo il primo caricamento.

### Admin: Jump Menu
- Aggiunto menu di navigazione rapida in cima al tab Admin (stile Piano).
- Link: Diagnostica, Viaggio, Utenti, Sistema, Spese, Links.
- Anchor ID su ogni sezione per scroll diretto.

### Rimosso: Gestione Post Pre-Partenza
- Eliminata la sezione "Gestione Post Pre-Partenza" dal tab Admin (HTML IT + EN).
- Il codice JS non era mai stato collegato (bottoni non funzionanti).

---

## v3.10 (16 giugno 2026)
Audit finale completo + fix localizzazione + banner unificato + zaino dinamico.

### Cloud Functions v1.96
- **A3.5**: `dailyCountdown` target cambiato da `owner` a `family` — Aurora e tutti gli approvati ricevono il countdown.
- **A2.4**: AbortController con timeout su tutti i fetch esterni: 15s meteo (Open-Meteo), 30s OpenAI (translate + expense OCR).
- **A3.2**: `dailyReminders` zaino — legge `zaino.totalItems` dal DB (scritto dal client) con fallback 192.

### Localizzazione Expense (IT/EN parity)
- Tutti i messaggi del modulo spese ora usano `isEN` per la lingua corretta (toast, placeholder, etichette statistiche, conferme).
- Sezione expense aggiunta a `index_en.html` (era mancante).
- Card cliccabile "Next Adventure" aggiunta a `home-variants_en.html` (era mancante).

### Zaino totalItems dinamico
- Il client scrive `zaino.totalItems` su Firebase ogni volta che si salva lo zaino.
- La Cloud Function `dailyReminders` legge il valore reale dal DB (fallback: 192 se non presente).
- Supporta correttamente il caso multi-utente (owner + Aurora entrambi modificano lo zaino).

### Banner aggiornamento unificato
- Il banner dinamico SW ora chiama `hardRefresh()` (unregister SW + clear caches + reload) — stesso comportamento del banner statico.
- Il banner dinamico non appare se il banner statico è già visibile (deduplicazione).
- Rimosso codice `doReload` duplicato.

### Dead code rimosso
- Eliminato codice morto zaino export/import (funzioni `exportZainoJSON`, `importZainoJSON`, listener relativi).

### UX: Pulsante "Aggiorna" — fallback 2s
- Se il SW non risponde a `skipWaiting` entro 2 secondi, forza `location.reload(true)` comunque.
- Risolve il problema del banner che non scompariva su dispositivi con SW vecchio non reattivo.

---

## v3.08 (16 giugno 2026)
Audit fix completi + UX card cliccabile + hard refresh.

### Cloud Functions v1.95 — Audit fix completi
- **A1.2/A1.3**: Token stale cleanup — singola lettura batch + multi-delete atomico (prima: 1 read per ogni token invalido).
- **A2.5**: `getRomeDateStr(now)` usato in tutte le funzioni (dailyReminders, eveningNextStage, morningWeatherPush, dailyWeatherArchiver). Elimina rischio sfasamento UTC/locale.
- **A1.4**: `publishScheduledPosts` usa `orderByChild('draft').equalTo(true)` — legge solo i draft, non tutto il diario.
- **A4**: Guard notturno — `curiositaDispatcher` salta silenziosamente tra 23:00 e 06:00 (risparmia ~14 invocazioni/notte).
- **B2.1/B2.2**: Owner UIDs estratti in costante `OWNER_UIDS` (non più hardcoded inline).
- **A3.1** (fix precedente): Array CURIOSITA ora ha 241 entries (3/giorno viaggio), ogni slot manda una curiosità diversa.

### UX: Card "Prossima Avventura" cliccabile
- Tap sulla card hero (escluso avatar) → naviga al tab Giorni, giorno 0.
- `e.stopPropagation()` evita conflitto con avatar lightbox.
- Feedback visivo: `transform: scale(0.98)` on `:active`.

### UX: Pulsante "Aggiorna" — hard refresh
- Il pulsante "Aggiorna" nel banner nuova versione ora: `skipWaiting` → svuota tutte le cache SW → `location.reload(true)`.

---

## v3.07 (16 giugno 2026)
Redesign notifiche + Expense Tracker + Live badge + Audit fix.

### Notification System Redesign (Cloud Functions v1.80→v1.90)
- **REDESIGN**: `dailyCuriosity` (singolo cron 09:00) sostituito da `curiositaDispatcher` (cron ogni 30 min).
  - Invia 3 curiosità/giorno a orari configurabili dall'admin panel (default 09:00, 14:00, 19:00).
  - Legge `notifSchedule.curiositySlot1Time/2/3Time` da Firebase.
  - Dedup atomico via `curiositaMeta.sentSlots[dateKey].slotX` (transaction).
- **Client-side curiosità disabilitato**: flag `window.QV_CURIOSITA_SERVER_SIDE = true`.
- **Admin panel**: aggiunti 3 campi orario curiosità + toggle attivazione.

### Expense Tracker (nuovo modulo admin)
- **Inserimento manuale**: importo, valuta (EUR/NOK/SEK/DKK/PLN/CZK/GBP/CHF), categoria, sottocategoria, data, nota, chi paga.
- **Import da screenshot**: upload foto app banca → Cloud Function `parseExpenseScreenshot` con GPT-4o Vision → estrazione automatica con categorizzazione AI.
- **Statistiche**: totale, media/giorno, top categoria, grafico a barre per categoria, grafico andamento giornaliero.
- **Lista spese**: filtro per categoria, eliminazione singola, export CSV.
- **Conversione valute**: tassi fissi embedded (aggiornabili).
- **Solo admin**: visibile solo agli owner del viaggio.

### UX: Live Tab Badge
- **Pallino verde animato** sul tab "Live" nella navbar quando il tracking GPS è attivo.
- Pulsazione CSS (riusa `pos-pulse-green`), si attiva/disattiva automaticamente con lo stato del tracking.

### Cloud Functions v1.90
- Nuova: `parseExpenseScreenshot` — onCall, GPT-4o Vision OCR per screenshot banca.
- Nuova: `cleanupOldNotifications` — onSchedule 03:00, purge coda >7 giorni + curiositaMeta >3 giorni.
- `openai` aggiunto a package.json dependencies.

### Database Rules Audit Fix
- Aggiunto nodo `expenses` con regole owner-only + validate + indexOn.
- Aggiunto `notifications/curiositaMeta` con regole owner-only.
- Aggiunto `.indexOn` su `notifications/queue` (createdAt, sentAt).
- Aggiunto `.indexOn` su `dailySummaries`.
- Aggiunta `.validate` su `fcm_tokens/$uid` (richiede campo `token`).

- Nota deploy: **hosting + functions + database** (`firebase deploy --only hosting,functions,database`).

## v3.06 (16 giugno 2026)
Audit completo dei contenuti + bug fix.

### Content Audit
- **Prezzi aggiornati**: Leopark (€9,90/€19,90 vs precedenti €10/€25), Dyreparken (range NOK 269-699 vs fisso NOK 559), Linnanmäki poi-a-421 (ingresso area €5 + braccialetto €53).
- **Descrizioni corrette**: Segla 639m (era 600m), Acquario di Genova "il più grande d'Italia" (era "d'Europa").
- **Curiosità corrette**: Riesenrad 129 anni (era 127), Mack Bryggeri riformulato, foca Saimaa ~480 (era ~430), Jules Verne "visse" (era "nacque"), titanio Guggenheim 0,38 mm specificato.
- **Days-data**: verificata coerenza interna di date, km (12.045 totali), velocità medie e link pedaggi — nessuna correzione necessaria.

### Bug Fix
- **GPS km tracking**: corretto bug che mostrava km fantasma (39 km) quando il tracking era inattivo. Aggiunto date-gate in `app.js` e pulizia `todayKm: null` allo stop in `capacitor-gps-bridge.js`.
- **HTML title**: era hardcoded "V2.00", ora "Quo Vadis — V3.06".
- **Parc Astérix**: città corretta da "Amiens" a "Plailly".
- **Stigfossen**: altezza corretta 320m → 240m in curiosita-data.js.
- **data.js price sync**: Lennusadam, Guggenheim, Acquario Genova, Chenonceau, Chambord, Fuente Dé.

### Notification System Redesign (Cloud Functions v1.80)
- **REDESIGN**: `dailyCuriosity` (singolo cron 09:00) sostituito da `curiositaDispatcher` (cron */30 min).
  - Invia 3 curiosità/giorno a orari configurabili dall'admin panel (default 09:00, 14:00, 19:00).
  - Legge `notifSchedule.curiositySlot1Time/2/3Time` da Firebase.
  - Dedup atomico via `curiositaMeta.sentSlots[dateKey].slotX` (transaction).
- **Client-side curiosità disabilitato**: flag `window.QV_CURIOSITA_SERVER_SIDE = true` in index.html/index_en.html.
  - `curiosita-scheduler.js` mantiene evening recap (21:00) e buongiorno (client-side).
- **Admin panel**: aggiunti 3 campi orario curiosità + toggle attivazione nel pannello Notifiche.
- **Cloud Functions v1.80**: TRIP_START corretto (25 giugno), countdown dice "25 giugno", dedup migliorato.
- Nota deploy: **hosting + functions** (`firebase deploy --only hosting,functions`). Rispondere N alla domanda sulla cancellazione delle funzioni Strava.

## v2.99 (15 giugno 2026)
Nuova funzione social sul diario + completamento delle due note rimaste dalla v2.98.
- **Nuovo: reazioni sui post del diario** — sotto ogni post pubblicato c'è una barra di reazioni emoji (👍 ❤️ 😍 🔥 😮). Ogni membro approvato può mettere o togliere **una** reazione; il conteggio per emoji è visibile a tutti. La reazione si salva in `diary/{post}/reactions/{uid}`.
- **Nuovo: commenti sui post del diario** — thread di commenti espandibile per ogni post. I membri approvati possono commentare (max 2000 caratteri); l'autore del commento e l'owner possono eliminarlo. I commenti si salvano in `diary/{post}/comments/{id}` con `{uid, name, text, ts}`.
- **Notifiche push**: l'owner riceve una notifica quando arriva una nuova reazione o un nuovo commento (con esclusione del mittente via `senderUid`). Riusa la coda esistente e la Cloud Function `processNotificationQueue` — **nessuna modifica server necessaria**.
- **Sicurezza (regole DB)**: aggiunte regole specifiche e validate su `diary/{post}/reactions` e `diary/{post}/comments`. La scrittura è consentita **solo** a utenti approvati e non bannati; ogni utente può scrivere unicamente la propria reazione (`uid === auth.uid`); i commenti validano struttura, autore e lunghezza del testo. Il resto del nodo `diary` resta in sola lettura per i non-owner, come prima.
- **Pre-flight**: `controlla.py` ora verifica anche la presenza e la correttezza delle nuove regole `diary/reactions` e `diary/comments`.
- **Build/versione**: `bump_version.py` ora aggiorna automaticamente anche il badge versione di `offline.html` (prima andava fatto a mano).
- **Parità IT/EN**: in `index_en.html` `wiki-links.js` ora è caricato **lazy** alla prima apertura del tab Cultura/Attività, esattamente come in `index.html` (prima era caricato subito).
- Nota deploy: oltre all'hosting, questa release richiede l'aggiornamento delle **regole del Realtime Database** (`firebase deploy --only database`), altrimenti reazioni e commenti dei membri verranno rifiutati. Le Cloud Functions non cambiano.

## v2.98 (15 giugno 2026)
Release di hardening e pulizia derivata da due report di audit. Correzioni strutturali:
- **Sicurezza (XSS)** Sanitizzazione output mancante: `makeWikiIcon()` ora applica `escapeHtml` su URL e titolo; le statistiche meteo (città più calda/fredda) passano da `escapeHtml`; in `unified-map.js` l'URL `poi.maps` del popup è ora escapato. Nessun campo dato può più iniettare HTML nel DOM.
- **Rete** La chiamata OSRM (calcolo percorso) usava `fetch` senza timeout → poteva restare appesa. Ora usa `fetchWithTimeout(url, {}, 6000)`.
- **UI** Banner versione: fallback hardcoded `'8.3'` sostituito con `window.APP_VERSION || '?'` → niente più versione errata mostrata.
- **Safari/iOS** `unified-map.js`: accesso a `localStorage` protetto con helper `_lsGet`/`_lsSet` (try/catch) → niente crash in navigazione privata; rinominata la variabile `var L` (ombreggiava il namespace Leaflet `L`) in `lbl`.
- **Service Worker** Rimosso `firebase-installations-compat.js` (0 utilizzi) da `sw.js` (importScripts + CDN_ASSETS) e da `firebase-messaging-sw.js`. Rimosso il duplicato di `van-marker.svg` da STATIC_ASSETS. Rimosso `wiki-links.js` dal precache (è caricato lazy alla prima apertura del tab Cultura/Attività).
- **GPS Android (mappa famiglia)** `capacitor-gps-bridge.js` ora scrive `trips/{familyId}/lastPosition` (ad ogni live-write, ad ogni flush periodico e allo stop) con gli stessi campi della PWA (`lat/lng/heading/ts/name`) → il furgone resta visibile sulla mappa famiglia anche dopo lo stop del tracking.
- **Dati POI** Corretti i prezzi della Haus der Musik (Vienna): Adulti €16→€14, Ridotto €11→€10, Bambini €8→€6 (IT+EN). Rimossi 3 POI realmente duplicati (Angry Birds Activity Park al Lago Saimaa, prima triplicato come "Attività"; "Segla" su Senja, prima doppio) — 450→447 POI. Verificato che le altre apparenti ripetizioni (Tivoli, Experimentarium, Acquario) sono lo stesso luogo proposto in giorni o tab diversi (scelta editoriale, mantenute).
- **Offline** Aggiornato il badge versione di `offline.html` da v2.63 a v2.98.
- **Build** Inclusi `controlla.py` e `bump_version.py` nello zip (richiesta W4). Esclusi `node_modules/`, gli script di analisi e `functions/package-lock.json`.
- Nota deploy: **solo hosting**. Le Cloud Functions non sono state modificate in questa release.

## v2.97 (15 giugno 2026)
- **Fix: notifiche curiosità doppie** (es. due "Sapevi che…" a pochi minuti di distanza).
- Causa: race condition. Lo scheduler gira all'apertura dell'app, ogni 30 min e ad ogni riapertura; due esecuzioni ravvicinate leggevano lo stato "fascia già inviata" PRIMA che l'altra lo scrivesse (lo stato veniva aggiornato solo a fine invio) → la stessa fascia partiva due volte.
- Soluzione strutturale: **lock atomico via transaction** su `curiositaMeta`. Ogni fascia oraria viene "reclamata" in modo atomico prima dell'invio; solo l'esecuzione che vince la transaction invia, le altre si fermano. Mantenuto anche il dedup sul contenuto come seconda barriera.
- Stessa correzione applicata a **Evening Recap** (reclamo atomico del giorno + rollback in caso di errore) e a **Buongiorno** (claim su Firebase, non più solo `localStorage` per-dispositivo → niente doppio invio tra due dispositivi owner).

## v2.96 (15 giugno 2026)
Audit completo del codice riga per riga (integrato con due report esterni). Correzioni:
- **CRITICO** Tracking GPS: `pushTrackPoint` andava in ricorsione infinita (stack overflow) e bloccava il salvataggio dei punti → km incoerenti/zero. Ora salva correttamente il punto.
- **CRITICO** Geolocalizzazione inversa (Nominatim): doppio parse JSON azzerava il nome città; `searchPlaces` ora rispetta il rate-limit (1 req/s) condiviso.
- **CRITICO** Lazy-load dei tab: il rilevamento del tab usava `e.detail.tab` (oggetto) invece della stringa `e.detail` → alcune sezioni non si inizializzavano.
- **CRITICO** `customCheckins` usata prima della dichiarazione e alcune chiamate a `queuePushNotification`/`translate` con riferimenti non ancora definiti → risolti (hoist + guardie).
- **ALTO** Fuso orario: tutte le "chiavi del giorno" ora usano la data **locale** (`localDateStr`) invece di UTC. Prima, dopo le ~22:00, riepiloghi/curiosità/check-in/meteo potevano finire sul giorno sbagliato.
- **ALTO** Evening recap: query del diario corretta (non raccoglie più per errore i contenuti di altri giorni, es. giorno 5 che catturava 50-59).
- **MEDIO** Service Worker: codice e dati (`*.js`, `*.json`) ora caricati in **network-first** quando online → le novità si vedono al primo avvio, non al secondo. `CACHE_NAME` allineato alla versione.
- **MEDIO** Rimosso il secondo handler `onBackgroundMessage` in `firebase-messaging-sw.js` → niente rischio di notifiche doppie.
- **MEDIO** Icona notifiche push: path corretto per GitHub Pages (sottocartella del progetto).
- **MEDIO/Sicurezza** Cloud Function `translatePost`: ora verifica che il chiamante sia owner o membro approvato del viaggio.
- **MINORE** Parità IT/EN: `index_en.html` allineato (rimosso script inutilizzato, attivato `IS_PROD`), badge "Oggi sei qui" localizzato, guardia su `reg.installing`.
- Nota deploy: oltre all'hosting, le voci su icona notifiche e sicurezza translate richiedono `firebase deploy --only functions`.

## v2.95 (15 giugno 2026)
- Fix: il token FCM non veniva salvato e il "Test Push" falliva con `AbortError: Subscription failed — no active Service Worker` (code 20)
- Causa: `messaging.getToken()` veniva chiamato prima che il Service Worker fosse ATTIVO; ora si attende `navigator.serviceWorker.ready` (SW attivo garantito) prima di richiedere il token
- Stessa correzione applicata al flusso diagnostico "Refresh Token" del pannello Admin
- Fix grammaticale: "2 problemai" → "2 problemi" (e "avvisi"/"problemi trovati")

## v2.94 (15 giugno 2026)
- Fix: nella lista "Curiosità del Viaggio" comparivano curiosità duplicate su giorni diversi e ne veniva mostrata solo una per giornata
- Scheduler: dedup strutturale basato sul contenuto — una stessa curiosità non viene mai inviata due volte, indipendentemente da quando si apre l'app
- Scheduler: ogni invio ora memorizza i metadati "logici" (giorno di viaggio, data e fascia oraria), non solo l'orario di invio
- Lista: le curiosità sono raggruppate per giorno e mostrano le 3 fasce (Mattino / Pomeriggio / Sera) con la fonte
- Pulizia automatica una-tantum (solo owner) dei duplicati già presenti in coda, mantenendo la voce più vecchia

## v2.93 (15 giugno 2026)
- Nuovo: nel "Riepilogo Giornaliero" è ora visibile una scheda **TOTALE** in cima alla lista, con la somma dei km percorsi, il tempo di guida complessivo e la velocità media generale su tutti i giorni tracciati
- Il totale usa il valore del contachilometri (se inserito a mano per quel giorno), altrimenti i km da GPS, in coerenza con le singole schede

## v2.92 (15 giugno 2026)
- Fix: il Service Worker non risultava più registrato ("Not registered") nella PWA installata su Chrome quando l'app veniva ripresa dallo stato in background
- SW: registrazione robusta — registra subito se la pagina è già caricata (readyState) invece di affidarsi solo all'evento 'load', con scope esplicito './'
- SW: ri-registrazione automatica al ritorno in primo piano (visibilitychange) quando manca una registrazione attiva
- SW: errori di registrazione ora loggati come warning visibile (console.warn) invece che in debug silenzioso
- System Status: auto-recupero — il pannello tenta di ri-registrare il SW ("⏳ Registrazione...") prima di mostrare "❌ Not registered", riflettendo lo stato reale

## v2.91 (14 giugno 2026)
- Allineamento di versione (nessuna modifica funzionale rispetto alla 2.90)

## v2.90 (14 giugno 2026)
- Fix iOS: l'header della Home ("Quo Vadis" + icone) rispetta la safe-area in alto e non finisce più sotto la status bar / Dynamic Island
- Fix iOS: il pannello Notifiche rispetta la safe-area in alto (titolo e ingranaggio non più sotto la status bar)

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
