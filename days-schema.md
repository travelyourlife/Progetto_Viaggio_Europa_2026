# Days Data Schema — Option 4 Architecture

## Overview

All trip content lives in a single structured data file (`days-data.js`).
The app renders multiple views from the same data:
- **Itinerario (tab-giorni)**: all blocks for a given day
- **Cibo (tab-cibo)**: only food blocks, grouped by country
- **Cultura (tab-cultura)**: only culture blocks, grouped by country
- **Luoghi (tab-luoghi)**: only POI blocks, grouped by category
- **Attività (tab-attivita)**: only activity blocks, grouped by type

## Schema

```javascript
var DAYS_DATA = [
  {
    id: "g0",
    date: "26/06",
    title: "Selvazzano → Leoben",
    flags: "🇮🇹→🇦🇹",
    country: "AT",         // primary country for this day
    region: "austria",     // for grouping in section views
    km: 350,
    hours: "3h 30m",
    tolls: "Pedaggi A4+A23 ~€15 + Vignetta AT digitale €12,80 (10gg)",
    tollLinks: [{ text: "Vignetta AT digitale", url: "https://www.asfinag.at" }],
    meteo: {
      lat: 47.3765, lon: 15.0914,
      high: 25, low: 14,
      cond: "Bel tempo",
      daylight: "16h di luce"
    },
    narrative: "Partenza nel pomeriggio, arrivo sera a Leoben — dove tutto è iniziato 🌒 Qui abbiamo visto la nostra prima eclissi totale di sole (11 agosto 1999). Il viaggio inizia e finisce con un'eclissi!",
    highlights: [
      // POI, attractions, main activities for the day
      { icon: "🏛️", title: "Hauptplatz Leoben", text: "Centro storico compatto, passeggiata serale" }
    ],
    food: [
      {
        type: "street",  // street | market | restaurant | flea
        icon: "🌭",
        title: "Leoben street food",
        text: "Gasthäuser in Hauptplatz — cucina stiriana: <em>Brettljause</em> (tagliere di salumi e formaggi) ~€10-14, <em>Backhendl</em> (pollo fritto stiriano) ~€12, <em>Steirischer Schweinsbraten</em> (arrosto di maiale) ~€11. Tutto condito con il famoso <em>Kürbiskernöl</em> (olio di semi di zucca).",
        beer: "Gösser Bräu — la birra Gösser nasce qui!"
      }
    ],
    scooter: "Leoben centro — Hauptplatz e centro storico compatto, ideale per passeggiata serale",
    kids: [
      { name: "Leopark", desc: "St. Michael bei Leoben — parco giochi al coperto, attività per tutte le età", maps: "https://maps.google.com/?q=Leopark+St+Michael+Leoben" },
      { name: "Kunsthalle Leoben", desc: "museo interattivo per bambini 6-14 anni", maps: "https://maps.google.com/?q=Kunsthalle+Leoben" }
    ],
    events: [],  // empty if no events
    alternatives: [
      // ➕ alt suggestions
    ],
    practical: {
      parking: [
        { name: "Campingclub Hinterberg", address: "Hinterbergstr. 47, Leoben", maps: "https://maps.google.com/?q=47.3611,15.0656", price: "da €25/notte (tutto incluso)", notes: "Bambini sotto 15 anni gratis, animali gratis. Gestione familiare, tranquillo. Check-in 7-21." }
      ],
      fuel: "OMV, BP, Shell, Eni, diesel ~€1.95-2.00/L (IT) / ~€1.88-1.95/L (AT). Nessun tratto remoto senza carburante in autostrada.",
      grocery: [
        { name: "Interspar Leoben", location: "LCS Leoben City Shopping", maps: "https://maps.google.com/?q=Interspar+Leoben" },
        { name: "Merkur Markt", location: "Pichlmayergasse 16", maps: "https://maps.google.com/?q=Merkur+Markt+Leoben" }
      ],
      laundry: "Lavanderia self-service disponibile al Campingclub Hinterberg",
      camper: { text: "Campingclub Hinterberg (carico/scarico acqua, elettricità)", maps: "https://maps.google.com/?q=Campingclub+Hinterberg+Leoben" },
      emergency: { name: "LKH Hochsteiermark Leoben", type: "Ospedale regionale", maps: "https://maps.google.com/?q=LKH+Hochsteiermark+Leoben", phones: "144 (Ambulanza), 133 (Polizia), 122 (Vigili del Fuoco), 112 (Emergenza UE)", notes: "Necessaria vignetta autostradale austriaca." },
      budget: "~€100-140/giorno"
    }
  },
  // ... more days
];
```

## Views Rendering Logic

### Itinerario (tab-giorni) — per day
For each day, render ALL blocks in order:
1. Header (title, km, hours, tolls)
2. Meteo badge
3. Narrative (personal text)
4. Highlights
5. Food (street food + markets)
6. Scooter
7. Events (if any)
8. Kids
9. Practical info

### Cibo (tab-cibo) — per country
Group days by `region`, then for each region show all `food` blocks.
Also include general country cuisine info (currently static HTML in tab-cibo).

### Cultura (tab-cultura) — per country
This is mostly static editorial content (history, traditions).
Could add a `culture` array to each day for day-specific cultural notes.

### Luoghi (tab-luoghi) — per category
Extract all `highlights` with coordinates and render as POI cards.
Merge with existing `POI_ATTIVITA[]` array.

### Attività (tab-attivita) — per type
Mostly static guides (camping, trekking, fishing, scooter rentals).
The `scooter` field from each day can auto-generate the scooter section.

## Migration Notes

- The `text` fields support inline HTML (<em>, <strong>, <a>)
- The `narrative` field is free-form personal text
- `alternatives` are the ➕ alt suggestions
- `events` have date ranges and may span multiple days
- Some content in tab-cibo and tab-cultura is EDITORIAL (not day-specific)
  → This stays as static HTML or moves to a separate `EDITORIAL_CONTENT` object
