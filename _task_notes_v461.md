# Task v4.61 — 3 modifiche insieme

## Obiettivo (confermato dall'utente)
1. Km traghetti ITEMIZZATI nel totale (non esclusi). Default confermato.
2. Linea rossa TRATTEGGIATA per tratte traghetto sulle mappe (resto continuo).
3. Etichette mappa in alfabeto latino (CARTO Voyager) su TUTTE le mappe.

Nota utente: oggi ha attivato tracking tardi sul traghetto → buco GPS da compensare (il tratteggio collega comunque i due punti).

## Dati traghetto (fonti reali: Openferry/DirectFerries/fergeruter.info)
- Totale grezzo: 12.150 km → Traghetto 384 km + Su strada 11.766 km
- FERRY_KM_BY_ID = { g8:80, g19:40, g21:25, g26:89, g33:20, g35:130 }
- Rotte: g8 Tallinn–Helsinki 80; g19 Gryllefjord–Andenes 40; g21 Vesterålen 25; g26 Moskenes–Bodø 89; g33 Traghetti interni 20; g35 Kristiansand–Hirtshals 130

## FATTO finora
- data.js: aggiunti "ferryKm" e "ferryRoute" alle 6 tappe (g8,g19,g21,g26,g33,g35). node --check OK.
- app.js (~riga 2351): aggiunto FERRY_KM_BY_ID, totalFerryKm, totalRoadKm; funzione formatKmBreakdown(); wiring #minibar-breakdown (init + setUnit).
- index.html + index_en.html: aggiunto <div id="minibar-breakdown"> sotto minibar stats row.

## PROGRESSO AGGIORNATO
- FASE 3 (CARTO Voyager) FATTA: sostituito in app.js (5 tileLayer), city-itineraries-ui.js (2), home-variants.js (2 static img), home-variants.html + _en (img src), preconnect in index+index_en. SW gia' whitelista basemaps.cartocdn.com (riga 253). OK.
- FASE 4 (ferry dashed) IN CORSO: aggiunto helper globale window._drawFerryLegs(map, routeCoords) + window.FERRY_DAY_IDX=[7,18,20,25,32,34] in cima ad app.js (dopo isEN). dashArray '2,9' rosso #e53e3e.
  - Invocato a: app.js site1 fullscreen (~1451), site2 routeMapInstance (~1745).
  - ANCORA DA INVOCARE: app.js ~1685 (era tileLayer, verificare se disegna route), ~4105, ~6020; unified-map.js (linea route?). Cercare 'L.polyline(routeCoords' o simili in questi punti e aggiungere _drawFerryLegs dopo.
  - routeCoords deve avere HOME in testa. Se un punto usa TRIP_COORDS senza HOME, passare [HOME].concat(...) o adattare indice.

## DA FARE (originale)
- Phase 3: CARTO Voyager tile su TUTTE le mappe. Cerca L.tileLayer / tile.openstreetmap.org in app.js, home-variants.js, city-itineraries-ui.js e altri. Sostituire URL con:
  https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png (subdomains abcd, attribution CARTO+OSM)
  Per la mini-mappa Home LIVE che usa una tile IMMAGINE statica (staticmap?), verificare come è costruita — potrebbe usare un URL immagine OSM; sostituire con equivalente Latin se possibile.
- Phase 4: polyline tratteggiata rossa per tratte traghetto. Trovare dove si disegna il percorso (L.polyline) sulla mappa itinerario. Segmentare: per ogni coppia di giorni consecutivi, se il giorno di arrivo ha ferryKm>0 → quel segmento è dashed rosso (dashArray), altrimenti continuo. Attenzione: serve coordinate per giorno.
- Phase 5: bump versione 4.60 -> 4.61 su TUTTI i file (sed 's/4\.60/4.61/g' su index.html index_en.html sw.js version.json + ?v= refs), CHANGELOG, node --check, rebuild zip quo-vadis-v4.61.zip (escludi zip/node_modules/.git), consegna.

## Note tecniche
- DAYS_DATA (days-data.js) è auto-generato, km numerico, NON ha ferryKm → uso FERRY_KM_BY_ID statico in app.js.
- itinerario (data.js) km come stringhe.
- minibar-detail ha data-trip-meta summaryIT "55 giorni · 13 paesi · 12.000 km" — lasciato invariato (totale grande resta 12.000).
- Script pubblicazione utente: clona repo travelyourlife/Progetto_Viaggio_Europa_2026, unzip quo-vadis-vX.zip, commit/push, firebase deploy.
