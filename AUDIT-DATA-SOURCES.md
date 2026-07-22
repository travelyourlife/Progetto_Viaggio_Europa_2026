# Audit Fonti Dati — Quo Vadis v4.79

## Problema
La stessa metrica (es. "km percorsi") viene calcolata con logiche diverse in punti diversi dell'app, producendo numeri discordanti.

---

## 1. KM PERCORSI — 3 fonti diverse

| Dove appare | Fonte | Logica | Valore attuale (G10) |
|---|---|---|---|
| **Header Home** "~X km percorsi 🚐" | `DAYS_DATA[].km` (locale) | Somma `km` dei giorni completati (`< currentDay`) | ~3.077 |
| **Widget Bento** "🚐 3702 Km percorsi" | Firebase DB `dailySummaries` + `live` + `tracks` | `computeTotalKm()`: somma tutti i dailySummaries + max(today summary, live, trackPoints) | 3.702 |
| **Tab Tappe** "12.000 km" totale | `DAYS_DATA[].km` (locale) | Somma TUTTI i 55 giorni (passati + futuri pianificati) | ~12.000 |
| **Tab Posizione** "stat-total-km" | Firebase DB `dailySummaries` + `live` + `tracks` | Stessa `computeTotalKm()` del widget bento | 3.702 |
| **Tab Posizione** "pos-total-km-display" | Firebase DB `dailySummaries/{today}` + `tracks/{today}` | Solo km di OGGI (non totale!) | ~480 |

### Perché divergono?
- **DAYS_DATA** = km inseriti manualmente da GPX a fine giornata (3.077 per G1-G10)
- **Firebase dailySummaries** = km scritti automaticamente dal GPS tracker ogni sessione di guida (3.702 per G1-G10)
- La differenza (625 km) può essere: km su traghetto col GPS acceso, imprecisioni GPS, tratti extra non nel GPX

### Raccomandazione
**Fonte unica: `computeTotalKm()` da Firebase** (è il dato reale, automatico, in tempo reale). Eliminare il cumulativo da DAYS_DATA nell'header Home e usare `computeTotalKm()` ovunque.

---

## 2. CITTÀ ATTUALE — 2 fonti

| Dove appare | Fonte | Logica |
|---|---|---|
| **Home hero** (render iniziale) | `DAYS_DATA[currentDay].title` | Parsing del titolo del giorno (es. "Kuopio → Oulu" → "Oulu") = **destinazione pianificata** |
| **Home hero** (override async) | Firebase `/currentLocation/city` | Listener real-time, sovrascrive se `updatedAt < 24h` = **posizione GPS reale** |
| **Tab Posizione** | Firebase `/currentLocation` | Reverse geocode dalla posizione GPS |
| **Prossima tappa** | `TRIP_COORDS[currentDay+1].city` | Coordinata pianificata del giorno dopo |

### Problema
L'override GPS (`fetchLiveDistanceFromHome`) era definito ma **mai chiamato** (fixato in v4.79). Anche dopo il fix, c'è un flash: prima appare la città pianificata, poi dopo ~500ms viene sovrascritta dal GPS.

### Raccomandazione
Invertire la priorità: caricare PRIMA dal Firebase `/currentLocation` (cache locale), e usare DAYS_DATA solo come fallback se il GPS è stale (>24h).

---

## 3. GIORNO CORRENTE — logica coerente ma ripetuta

| Dove | Logica |
|---|---|
| Home, Mappa, Tappe, Posizione, Stats | `Math.floor((now - TRIP_START) / 86400000)` |
| Con override attivo | `window._dayOverride` |

**Nessuna inconsistenza**, ma il calcolo è duplicato in ~10 punti. Sarebbe meglio un `window.getCurrentDay()` centralizzato.

---

## 4. PAESI VISITATI — 2 fonti

| Dove appare | Fonte | Logica |
|---|---|---|
| **Widget Home** `hs-countries` | Firebase `checkins` | Conta le bandiere uniche nei check-in effettuati |
| **Tab Posizione** `stat-countries` | Firebase `checkins` + `countriesVisited` | Stessa logica + merge con nodo `countriesVisited` |

### Problema minore
Il widget Home conta solo dai check-in, ma il tab Posizione aggiunge anche `countriesVisited` (scritto quando si attraversa un confine). Possibile discrepanza di 1-2 paesi.

---

## 5. METEO — 2 fonti

| Dove appare | Fonte | Logica |
|---|---|---|
| **Home hero** (render iniziale) | `DAYS_DATA[currentDay].meteo` | Dati statici inseriti manualmente (previsione al momento della pianificazione) |
| **Home hero** (override async) | Open-Meteo API live | `fetchHeroLiveWeather()` sovrascrive con previsione reale |
| **Prossima tappa** | Open-Meteo API live | Sempre live |

### Problema
Come per la città: flash iniziale con meteo statico, poi override con meteo live. Nessuna inconsistenza numerica, solo UX.

---

## 6. COORDINATE / POSIZIONE MAPPA — coerente

| Dove | Fonte |
|---|---|
| Mappa route | `TRIP_COORDS[]` (weather-coords.js) — 55 coordinate pianificate |
| Mappa live tracking | Firebase `tracks/{date}/points` — punti GPS reali |
| Mini-map Home | `TRIP_COORDS[currentDay]` → override con `/currentLocation` GPS |

**Coerente**: la mappa route usa le coordinate pianificate per il tracciato, il live tracking mostra la traccia reale sovrapposta.

---

## RIEPILOGO INCONSISTENZE CRITICHE

| # | Metrica | Problema | Impatto utente |
|---|---|---|---|
| **1** | Km totali | Header Home (3.077) ≠ Widget Bento (3.702) | Confusione: quale è giusto? |
| **2** | Città | Flash pianificata → GPS (fixato in v4.79 ma con delay) | Vede "Oulu" per 500ms poi "Kuopio" |
| **3** | Paesi | Home widget ≠ Tab Posizione (possibile ±1-2) | Minore |

---

## PROPOSTA: FONTE UNICA

| Metrica | Fonte unica raccomandata | Perché |
|---|---|---|
| **Km totali** | `computeTotalKm()` da Firebase | È il dato reale dal GPS, automatico, include km di oggi |
| **Città attuale** | Firebase `/currentLocation/city` | È la posizione GPS reale, aggiornata ogni 90s |
| **Paesi visitati** | Firebase `countriesVisited` (merge con checkins) | Più completo |
| **Meteo** | Open-Meteo API live (già fatto) | Sempre aggiornato |
| **Giorno corrente** | `window.getCurrentDay()` centralizzato | Evita duplicazione |

### Per i km: quale numero è "giusto"?
- **3.077** (DAYS_DATA) = km su strada calcolati dai file GPX, escluso traghetto
- **3.702** (Firebase) = km totali registrati dal GPS tracker (include tutto)

La differenza di ~625 km in 10 giorni è significativa. Probabilmente il GPS tracker conta anche:
- Km percorsi sul traghetto (il GPS segna movimento anche in mare)
- Piccoli spostamenti locali (parcheggio → supermercato → parcheggio)
- Imprecisioni GPS che gonfiano la distanza

**Domanda per te**: vuoi mostrare il dato "pulito" (solo strada, da GPX) o il dato "reale totale" (dal GPS tracker)?
