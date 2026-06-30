'use strict';
// ═══════════════════════════════════════════════════════════════
// data.js — Unica fonte di verità per Quo Vadis V4.8
// ═══════════════════════════════════════════════════════════════

var TRIP_START = new Date(2026, 5, 25, 0, 0, 0); // Month is 0-indexed: 5 = June — partenza 25 giugno (pomeriggio)
var TRIP_END = new Date(2026, 7, 18, 23, 59, 59);   // Month is 0-indexed: 7 = August
var TRIP_DAYS = 55;

// v3.93: Country bounding boxes for offline GPS→country lookup
// Ordered from smallest to largest to prefer more specific matches
var COUNTRY_BOUNDS = [
  {code:'EE', name:'Estonia', nameIt:'Estonia', latMin:57.5, latMax:59.7, lngMin:21.8, lngMax:28.2},
  {code:'LV', name:'Latvia', nameIt:'Lettonia', latMin:55.7, latMax:58.1, lngMin:20.9, lngMax:28.2},
  {code:'LT', name:'Lithuania', nameIt:'Lituania', latMin:53.9, latMax:56.5, lngMin:20.9, lngMax:26.8},
  {code:'DK', name:'Denmark', nameIt:'Danimarca', latMin:54.5, latMax:57.8, lngMin:8.0, lngMax:15.2},
  {code:'NL', name:'Netherlands', nameIt:'Paesi Bassi', latMin:50.7, latMax:53.6, lngMin:3.3, lngMax:7.2},
  {code:'AT', name:'Austria', nameIt:'Austria', latMin:46.37, latMax:49.02, lngMin:9.53, lngMax:17.16},
  {code:'CZ', name:'Czechia', nameIt:'Cechia', latMin:48.55, latMax:51.06, lngMin:12.09, lngMax:18.86},
  {code:'IT', name:'Italy', nameIt:'Italia', latMin:35.5, latMax:47.1, lngMin:6.6, lngMax:18.5},
  {code:'PL', name:'Poland', nameIt:'Polonia', latMin:49.0, latMax:54.8, lngMin:14.1, lngMax:24.2},
  {code:'FI', name:'Finland', nameIt:'Finlandia', latMin:59.8, latMax:70.1, lngMin:20.5, lngMax:31.6},
  {code:'SE', name:'Sweden', nameIt:'Svezia', latMin:55.3, latMax:69.1, lngMin:11.1, lngMax:24.2},
  {code:'NO', name:'Norway', nameIt:'Norvegia', latMin:57.9, latMax:71.2, lngMin:4.6, lngMax:31.1},
  {code:'DE', name:'Germany', nameIt:'Germania', latMin:47.3, latMax:55.1, lngMin:5.9, lngMax:15.0}
];

// v3.93: Offline country detection from GPS coordinates
function getCountryFromCoords(lat, lng) {
  for (var i = 0; i < COUNTRY_BOUNDS.length; i++) {
    var c = COUNTRY_BOUNDS[i];
    if (lat >= c.latMin && lat <= c.latMax && lng >= c.lngMin && lng <= c.lngMax) {
      return c;
    }
  }
  return null; // not found — use Nominatim fallback
}

// Tab order for swipe navigation (shared between app.js sections)
var TAB_ORDER = ['home', 'riepilogo', 'giorni', 'posizione', 'diario', 'cibo', 'cultura', 'attivita', 'piano', 'zaino', 'chat'];

// Owner UIDs — only these can write to Firebase
var OWNER_UIDS = ['RxlVlsfeaEeSwFUVYbKQujEsbBo1', 'Mh8BOeFPnFe7WObcsUoP6wyRgPw1']; // travelyourlife + aurora.mandara

// ─── Itinerario completo (55 giorni) ───
// Ogni entry alimenta: tabella, timeline, mappa, countdown
var itinerario = [
  {"id": "g1", "label": "G1", "labelEn": "D1", "data": "25/06", "tragitto": "Selvazzano ➔ Leoben", "tragittoEn": "Selvazzano ➔ Leoben", "km": "460", "ore": "5h 30m", "oreEn": "5h 30m", "paesi": "🇮🇹➔🇦🇹", "note": "Partenza pomeriggio, notte a Leoben", "noteEn": "Departure afternoon, night in Leoben", "mapsUrl": "https://maps.google.com/?q=Leoben+Austria", "mapsLabel": "📍 Leoben", "region": 0, "desc": "Partenza pomeriggio, notte a Leoben", "descEn": "Departure afternoon, night in Leoben", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Leoben+Austria", "text": "📍 Leoben", "target": "_blank"}]},
  {"id": "g2", "label": "G2", "labelEn": "D2", "data": "26/06", "tragitto": "Leoben ➔ Vienna", "tragittoEn": "Leoben ➔ Vienna", "km": "160", "ore": "2h", "oreEn": "2h", "paesi": "🇦🇹", "note": "Amici a Vienna. Prater o Haus der Musik", "noteEn": "Friends in Vienna. Prater or Haus der Musik", "mapsUrl": "https://maps.google.com/?q=Prater+Wien", "mapsLabel": "📍 Prater Wien", "region": 0, "desc": "Amici a Vienna. Prater o Haus der Musik", "descEn": "Friends in Vienna. Prater or Haus der Musik", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Prater+Wien", "text": "📍 Prater Wien", "target": "_blank"}]},
  {"id": "g3", "label": "G3", "labelEn": "D3", "data": "27/06", "tragitto": "Vienna ➔ Varsavia", "tragittoEn": "Vienna ➔ Warsaw", "km": "670", "ore": "8h 30m", "oreEn": "8h 30m", "paesi": "🇦🇹➔🇨🇿➔🇵🇱", "note": "Sosta Brno. Parco Fontane", "noteEn": "Stop in Brno. Fountain Park", "mapsUrl": "https://maps.google.com/?q=Multimedia+Fountain+Park+Warsaw", "mapsLabel": "📍 Multimedia Fountain Warsaw", "region": 1, "desc": "Sosta Brno. Parco Fontane", "descEn": "Stop in Brno. Fountain Park", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Multimedia+Fountain+Park+Warsaw", "text": "📍 Multimedia Fountain Warsaw", "target": "_blank"}]},
  {"id": "g4", "label": "G4", "labelEn": "D4", "data": "28/06", "tragitto": "Varsavia ➔ Vilnius", "tragittoEn": "Warsaw ➔ Vilnius", "km": "510", "ore": "6h", "oreEn": "6h", "paesi": "🇵🇱➔🇱🇹", "note": "Bernardinai Garden, Uzupis", "noteEn": "Bernardinai Garden, Uzupis", "mapsUrl": "https://maps.google.com/?q=Bernardine+Garden+Vilnius", "mapsLabel": "📍 Bernardine Garden Vilnius", "region": 1, "desc": "Bernardinai Garden, Uzupis", "descEn": "Bernardinai Garden, Uzupis", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bernardine+Garden+Vilnius", "text": "📍 Bernardine Garden Vilnius", "target": "_blank"}]},
  {"id": "g5", "label": "G5", "labelEn": "D5", "data": "29/06", "tragitto": "Vilnius ➔ Riga", "tragittoEn": "Vilnius ➔ Riga", "km": "300", "ore": "4h", "oreEn": "4h", "paesi": "🇱🇹➔🇱🇻", "note": "Collina delle Croci. Motor Museum", "noteEn": "Hill of Crosses. Motor Museum", "mapsUrl": "https://maps.google.com/?q=56.0153,23.4161", "mapsLabel": "📍 Hill of Crosses Siauliai", "region": 1, "desc": "Collina delle Croci. Motor Museum", "descEn": "Hill of Crosses. Motor Museum", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=56.0153,23.4161", "text": "📍 Hill of Crosses Siauliai", "target": "_blank"}]},
  {"id": "g6", "label": "G6", "labelEn": "D6", "data": "30/06", "tragitto": "Riga ➔ Pärnu ➔ Haapsalu ➔ Tallinn", "tragittoEn": "Riga ➔ Pärnu ➔ Haapsalu ➔ Tallinn", "km": "390", "ore": "5h", "oreEn": "5h", "paesi": "🇱🇻➔🇪🇪", "note": "Risalita lenta lungo la costa baltica: spiagge di Pärnu e cittadina di Haapsalu, notte a Tallinn", "noteEn": "Slow drive up the Baltic coast: Pärnu beaches and the town of Haapsalu, overnight in Tallinn", "mapsUrl": "https://maps.google.com/?q=59.4370,24.7536", "mapsLabel": "📍 Tallinn", "region": 1, "desc": "Risalita lenta lungo la costa baltica: spiagge di Pärnu e cittadina di Haapsalu, notte a Tallinn", "descEn": "Slow drive up the Baltic coast: Pärnu beaches and the town of Haapsalu, overnight in Tallinn", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=P%C3%A4rnu+Estonia", "text": "📍 Pärnu", "target": "_blank"}, {"type": "link", "href": "https://maps.google.com/?q=Haapsalu+Estonia", "text": "📍 Haapsalu", "target": "_blank"}, {"type": "link", "href": "https://maps.google.com/?q=59.4370,24.7536", "text": "📍 Tallinn", "target": "_blank"}]},
  {"id": "g7", "label": "G7", "labelEn": "D7", "data": "01/07", "tragitto": "Tallinn — giorno in città", "tragittoEn": "Tallinn — city day", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇪🇪", "note": "Città Vecchia e Lennusadam (Seaplane Harbour)", "noteEn": "Old Town and Lennusadam (Seaplane Harbour)", "mapsUrl": "https://maps.google.com/?q=Lennusadam+Seaplane+Harbour+Tallinn", "mapsLabel": "📍 Seaplane Harbour Tallinn", "region": 1, "desc": "Città Vecchia e Lennusadam (Seaplane Harbour)", "descEn": "Old Town and Lennusadam (Seaplane Harbour)", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Tallinn+Old+Town", "text": "📍 Tallinn Old Town", "target": "_blank"}, {"type": "link", "href": "https://maps.google.com/?q=Lennusadam+Seaplane+Harbour+Tallinn", "text": "📍 Seaplane Harbour", "target": "_blank"}]},
  {"id": "g8", "label": "G8", "labelEn": "D8", "data": "02/07", "tragitto": "Tallinn ➔ Lappeenranta", "tragittoEn": "Tallinn ➔ Lappeenranta", "km": "225", "ore": "3h + traghetto 2h", "oreEn": "3h + traghetto 2h", "paesi": "🇪🇪➔🇫🇮", "note": "Traghetto 2h. Piazza Mercato Helsinki", "noteEn": "2h ferry. Helsinki Market Square", "mapsUrl": "https://maps.google.com/?q=Kauppatori+Helsinki", "mapsLabel": "📍 Market Square Helsinki", "region": 2, "desc": "Traghetto 2h. Piazza Mercato Helsinki", "descEn": "2h ferry. Helsinki Market Square", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Kauppatori+Helsinki", "text": "📍 Market Square Helsinki", "target": "_blank"}]},
  {"id": "g9", "label": "G9", "labelEn": "D9", "data": "03/07", "tragitto": "Lappeenranta ➔ Punkaharju", "tragittoEn": "Lappeenranta ➔ Punkaharju", "km": "120", "ore": "2h", "oreEn": "2h", "paesi": "🇫🇮", "note": "🛣️ Punkaharju Ridge Road", "noteEn": "🛣️ Punkaharju Ridge Road", "mapsUrl": "https://maps.google.com/?q=61.7667,29.3833", "mapsLabel": "📍 Punkaharju Ridge Road", "region": 2, "desc": "🛣️ Punkaharju Ridge Road", "descEn": "🛣️ Punkaharju Ridge Road", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=61.7667,29.3833", "text": "📍 Punkaharju Ridge Road", "target": "_blank"}]},
  {"id": "g10", "label": "G10", "labelEn": "D10", "data": "04/07", "tragitto": "Regione dei Laghi", "tragittoEn": "Lake District", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇫🇮", "note": "Canoa, pesca, sauna nel bosco", "noteEn": "Canoeing, fishing, forest sauna", "mapsUrl": "https://maps.google.com/?q=Saimaa+Lake+Finland", "mapsLabel": "📍 Saimaa Lake Finland", "region": 2, "desc": "Canoa, pesca, sauna nel bosco", "descEn": "Canoeing, fishing, forest sauna", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Saimaa+Lake+Finland", "text": "📍 Saimaa Lake Finland", "target": "_blank"}]},
  {"id": "g11", "label": "G11", "labelEn": "D11", "data": "05/07", "tragitto": "Laghi ➔ Oulu", "tragittoEn": "Lakes ➔ Oulu", "km": "480", "ore": "6h 30m", "oreEn": "6h 30m", "paesi": "🇫🇮", "note": "Risalita foreste boreali", "noteEn": "Climbing boreal forests", "mapsUrl": "https://maps.google.com/?q=Oulu+Finland", "mapsLabel": "📍 Oulu", "region": 2, "desc": "Risalita foreste boreali", "descEn": "Climbing boreal forests", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Oulu+Finland", "text": "📍 Oulu", "target": "_blank"}]},
  {"id": "g12", "label": "G12", "labelEn": "D12", "data": "06/07", "tragitto": "Oulu ➔ Ranua", "tragittoEn": "Oulu ➔ Ranua", "km": "160", "ore": "2h", "oreEn": "2h", "paesi": "🇫🇮", "note": "⭐ Ranua Wildlife Park", "noteEn": "⭐ Ranua Wildlife Park", "mapsUrl": "https://maps.google.com/?q=Ranua+Wildlife+Park", "mapsLabel": "📍 Ranua Resort", "region": 2, "desc": "⭐ Ranua Wildlife Park", "descEn": "⭐ Ranua Wildlife Park", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Ranua+Wildlife+Park", "text": "📍 Ranua Resort", "target": "_blank"}]},
  {"id": "g13", "label": "G13", "labelEn": "D13", "data": "07/07", "tragitto": "Ranua ➔ Rovaniemi", "tragittoEn": "Ranua ➔ Rovaniemi", "km": "80", "ore": "1h 15m", "oreEn": "1h 15m", "paesi": "🇫🇮", "note": "Foto al Circolo Polare", "noteEn": "Photo at the Arctic Circle", "mapsUrl": "https://maps.google.com/?q=66.5436,25.8473", "mapsLabel": "📍 Santa Claus Village", "region": 2, "desc": "Foto al Circolo Polare", "descEn": "Photo at the Arctic Circle", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=66.5436,25.8473", "text": "📍 Santa Claus Village", "target": "_blank"}]},
  {"id": "g14", "label": "G14", "labelEn": "D14", "data": "08/07", "tragitto": "Rovaniemi", "tragittoEn": "Rovaniemi", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇫🇮", "note": "⭐ Santa Claus Village + Arktikum", "noteEn": "⭐ Santa Claus Village + Arktikum", "mapsUrl": "https://maps.google.com/?q=Santa+Claus+Village+Rovaniemi", "mapsLabel": "📍 Santa Claus Main Office", "region": 2, "desc": "⭐ Santa Claus Village + Arktikum", "descEn": "⭐ Santa Claus Village + Arktikum", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Santa+Claus+Village+Rovaniemi", "text": "📍 Santa Claus Main Office", "target": "_blank"}]},
  {"id": "g15", "label": "G15", "labelEn": "D15", "data": "09/07", "tragitto": "Rovaniemi ➔ Inari", "tragittoEn": "Rovaniemi ➔ Inari", "km": "330", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇫🇮", "note": "Museo Siida. Renne", "noteEn": "Siida Museum. Reindeer", "mapsUrl": "https://maps.google.com/?q=69.0714,27.0142", "mapsLabel": "📍 Siida Museum Inari", "region": 2, "desc": "Museo Siida. Renne", "descEn": "Siida Museum. Reindeer", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.0714,27.0142", "text": "📍 Siida Museum Inari", "target": "_blank"}]},
  {"id": "g16", "label": "G16", "labelEn": "D16", "data": "10/07", "tragitto": "Inari ➔ Kilpisjärvi", "tragittoEn": "Inari ➔ Kilpisjärvi", "km": "430", "ore": "6h", "oreEn": "6h", "paesi": "🇫🇮", "note": "Treriksröset", "noteEn": "Treriksröset", "mapsUrl": "https://maps.google.com/?q=69.0485,20.7890", "mapsLabel": "📍 Kilpisjärvi", "region": 2, "desc": "Treriksröset", "descEn": "Treriksröset", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.0485,20.7890", "text": "📍 Kilpisjärvi", "target": "_blank"}]},
  {"id": "g17", "label": "G17", "labelEn": "D17", "data": "11/07", "tragitto": "Kilpisjärvi ➔ Tromsø", "tragittoEn": "Kilpisjärvi ➔ Tromsø", "km": "160", "ore": "2h 30m", "oreEn": "2h 30m", "paesi": "🇫🇮➔🇳🇴", "note": "Fjellheisen, Polaria", "noteEn": "Fjellheisen, Polaria", "mapsUrl": "https://maps.google.com/?q=Fjellheisen+Tromsø", "mapsLabel": "📍 Fjellheisen Tromsø", "region": 3, "desc": "Fjellheisen, Polaria", "descEn": "Fjellheisen, Polaria", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Fjellheisen+Tromsø", "text": "📍 Fjellheisen Tromsø", "target": "_blank"}]},
  {"id": "g18", "label": "G18", "labelEn": "D18", "data": "12/07", "tragitto": "Tromsø ➔ Senja", "tragittoEn": "Tromsø ➔ Senja", "km": "170", "ore": "3h", "oreEn": "3h", "paesi": "🇳🇴", "note": "🛣️ Senja National Tourist Route", "noteEn": "🛣️ Senja National Tourist Route", "mapsUrl": "https://maps.google.com/?q=69.2950,17.0500", "mapsLabel": "📍 Tungeneset Senja", "region": 3, "desc": "🛣️ Senja National Tourist Route", "descEn": "🛣️ Senja National Tourist Route", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.2950,17.0500", "text": "📍 Tungeneset Senja", "target": "_blank"}]},
  {"id": "g19", "label": "G19", "labelEn": "D19", "data": "13/07", "tragitto": "Senja ➔ Andenes", "tragittoEn": "Senja ➔ Andenes", "km": "70", "ore": "1h 30m + traghetto 1h 50m", "oreEn": "1h 30m + traghetto 1h 50m", "paesi": "🇳🇴", "note": "🛣️ Andøya NTR. Ingresso Vesterålen", "noteEn": "🛣️ Andøya NTR. Entrance to Vesterålen", "mapsUrl": "https://maps.google.com/?q=69.3267,16.1317", "mapsLabel": "📍 Andenes Lighthouse", "region": 3, "desc": "🛣️ Andøya NTR. Ingresso Vesterålen", "descEn": "🛣️ Andøya NTR. Entrance to Vesterålen", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.3267,16.1317", "text": "📍 Andenes Lighthouse", "target": "_blank"}]},
  {"id": "g20", "label": "G20", "labelEn": "D20", "data": "14/07", "tragitto": "Andenes", "tragittoEn": "Andenes", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "⭐ Safari Balene + Space Center", "noteEn": "⭐ Whale Safari + Space Center", "mapsUrl": "https://maps.google.com/?q=69.3250,16.1300", "mapsLabel": "📍 Whale Safari Andenes", "region": 3, "desc": "⭐ Safari Balene + Space Center", "descEn": "⭐ Whale Safari + Space Center", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.3250,16.1300", "text": "📍 Whale Safari Andenes", "target": "_blank"}]},
  {"id": "g21", "label": "G21", "labelEn": "D21", "data": "15/07", "tragitto": "Andenes ➔ Svolvær", "tragittoEn": "Andenes ➔ Svolvær", "km": "185", "ore": "3h 30m + traghetto 45m", "oreEn": "3h 30m + traghetto 45m", "paesi": "🇳🇴", "note": "🛣️ Lofoten (E10) NTR", "noteEn": "🛣️ Lofoten (E10) NTR", "mapsUrl": "https://maps.google.com/?q=Svolvær+Lofoten", "mapsLabel": "📍 Svolvær", "region": 3, "desc": "🛣️ Lofoten (E10) NTR", "descEn": "🛣️ Lofoten (E10) NTR", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Svolvær+Lofoten", "text": "📍 Svolvær", "target": "_blank"}]},
  {"id": "g22", "label": "G22", "labelEn": "D22", "data": "16/07", "tragitto": "Svolvær ➔ Henningsvær", "tragittoEn": "Svolvær ➔ Henningsvær", "km": "30", "ore": "1h (con soste)", "oreEn": "1h (con soste)", "paesi": "🇳🇴", "note": "⭐ Reinebringen + Henningsvær", "noteEn": "⭐ Reinebringen + Henningsvær", "mapsUrl": "https://maps.google.com/?q=Henningsvær+Lofoten", "mapsLabel": "📍 Henningsvær", "region": 3, "desc": "⭐ Reinebringen + Henningsvær", "descEn": "⭐ Reinebringen + Henningsvær", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Henningsvær+Lofoten", "text": "📍 Henningsvær", "target": "_blank"}]},
  {"id": "g23", "label": "G23", "labelEn": "D23", "data": "17/07", "tragitto": "Lofoten (Spiagge)", "tragittoEn": "Lofoten (Beaches)", "km": "60", "ore": "1h 15m", "oreEn": "1h 15m", "paesi": "🇳🇴", "note": "Haukland e Ramberg", "noteEn": "Haukland and Ramberg", "mapsUrl": "https://maps.google.com/?q=68.2500,13.5833", "mapsLabel": "📍 Haukland Beach", "region": 3, "desc": "Haukland e Ramberg", "descEn": "Haukland and Ramberg", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=68.2500,13.5833", "text": "📍 Haukland Beach", "target": "_blank"}]},
  {"id": "g24", "label": "G24", "labelEn": "D24", "data": "18/07", "tragitto": "Lofoten (Reine)", "tragittoEn": "Lofoten (Reine)", "km": "60", "ore": "1h 15m", "oreEn": "1h 15m", "paesi": "🇳🇴", "note": "Kayak nel fiordo", "noteEn": "Kayak in the fjord", "mapsUrl": "https://maps.google.com/?q=Reine+Lofoten", "mapsLabel": "📍 Reine Lofoten", "region": 3, "desc": "Kayak nel fiordo", "descEn": "Kayak in the fjord", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Reine+Lofoten", "text": "📍 Reine Lofoten", "target": "_blank"}]},
  {"id": "g25", "label": "G25", "labelEn": "D25", "data": "19/07", "tragitto": "Lofoten (Relax)", "tragittoEn": "Lofoten (Relax)", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Nusfjord + Viking Museum", "noteEn": "Nusfjord + Viking Museum", "mapsUrl": "https://maps.google.com/?q=68.0333,13.3500", "mapsLabel": "📍 Nusfjord", "region": 3, "desc": "Nusfjord + Viking Museum", "descEn": "Nusfjord + Viking Museum", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=68.0333,13.3500", "text": "📍 Nusfjord", "target": "_blank"}]},
  {"id": "g26", "label": "G26", "labelEn": "D26", "data": "20/07", "tragitto": "Lofoten ➔ Mo i Rana", "tragittoEn": "Lofoten ➔ Mo i Rana", "km": "230", "ore": "3h 30m + traghetto 3h 15m", "oreEn": "3h 30m + traghetto 3h 15m", "paesi": "🇳🇴", "note": "⛴️ Moskenes–Bodø + Arctic Circle", "noteEn": "⛴️ Moskenes–Bodø + Arctic Circle", "mapsUrl": "https://maps.google.com/?q=66.5633,15.3117", "mapsLabel": "📍 Arctic Circle Centre", "region": 3, "desc": "⛴️ Moskenes–Bodø + Arctic Circle", "descEn": "⛴️ Moskenes–Bodø + Arctic Circle", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=66.5633,15.3117", "text": "📍 Arctic Circle Centre", "target": "_blank"}]},
  {"id": "g27", "label": "G27", "labelEn": "D27", "data": "21/07", "tragitto": "Mo i Rana ➔ Trondheim", "tragittoEn": "Mo i Rana ➔ Trondheim", "km": "470", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇳🇴", "note": "🛣️ Helgelandskysten. Ghiacciaio Svartisen", "noteEn": "🛣️ Helgelandskysten. Svartisen Glacier", "mapsUrl": "https://maps.google.com/?q=Nidaros+Cathedral+Trondheim", "mapsLabel": "📍 Nidaros Cathedral", "region": 3, "desc": "🛣️ Helgelandskysten. Ghiacciaio Svartisen", "descEn": "🛣️ Helgelandskysten. Svartisen Glacier", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Nidaros+Cathedral+Trondheim", "text": "📍 Nidaros Cathedral", "target": "_blank"}]},
  {"id": "g28", "label": "G28", "labelEn": "D28", "data": "22/07", "tragitto": "Trondheim", "tragittoEn": "Trondheim", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Cattedrale Nidaros + Bakklandet", "noteEn": "Nidaros Cathedral + Bakklandet", "mapsUrl": "https://maps.google.com/?q=Bakklandet+Trondheim", "mapsLabel": "📍 Bakklandet", "region": 3, "desc": "Cattedrale Nidaros + Bakklandet", "descEn": "Nidaros Cathedral + Bakklandet", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bakklandet+Trondheim", "text": "📍 Bakklandet", "target": "_blank"}]},
  {"id": "g29", "label": "G29", "labelEn": "D29", "data": "23/07", "tragitto": "Trondheim ➔ Molde", "tragittoEn": "Trondheim ➔ Molde", "km": "215", "ore": "4h", "oreEn": "4h", "paesi": "🇳🇴", "note": "⭐ Atlantic Road", "noteEn": "⭐ Atlantic Road", "mapsUrl": "https://maps.google.com/?q=63.0167,7.3500", "mapsLabel": "📍 Atlanterhavsveien", "region": 3, "desc": "⭐ Atlantic Road", "descEn": "⭐ Atlantic Road", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=63.0167,7.3500", "text": "📍 Atlanterhavsveien", "target": "_blank"}]},
  {"id": "g30", "label": "G30", "labelEn": "D30", "data": "24/07", "tragitto": "Molde ➔ Geiranger", "tragittoEn": "Molde ➔ Geiranger", "km": "110", "ore": "3h", "oreEn": "3h", "paesi": "🇳🇴", "note": "⭐ Trollstigen + Geiranger", "noteEn": "⭐ Trollstigen + Geiranger", "mapsUrl": "https://maps.google.com/?q=62.4567,7.6700", "mapsLabel": "📍 Trollstigen", "region": 3, "desc": "⭐ Trollstigen + Geiranger", "descEn": "⭐ Trollstigen + Geiranger", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=62.4567,7.6700", "text": "📍 Trollstigen", "target": "_blank"}]},
  {"id": "g31", "label": "G31", "labelEn": "D31", "data": "25/07", "tragitto": "Geiranger ➔ Bergen", "tragittoEn": "Geiranger ➔ Bergen", "km": "370", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇳🇴", "note": "🛣️ Hardanger NTR. Fiordi panoramici", "noteEn": "🛣️ Hardanger NTR. Panoramic fjords", "mapsUrl": "https://maps.google.com/?q=Bryggen+Bergen", "mapsLabel": "📍 Bryggen Bergen", "region": 3, "desc": "🛣️ Hardanger NTR. Fiordi panoramici", "descEn": "🛣️ Hardanger NTR. Panoramic fjords", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bryggen+Bergen", "text": "📍 Bryggen Bergen", "target": "_blank"}]},
  {"id": "g32", "label": "G32", "labelEn": "D32", "data": "26/07", "tragitto": "Bergen", "tragittoEn": "Bergen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Mercato Pesce + Fløibanen", "noteEn": "Fish Market + Fløibanen", "mapsUrl": "https://maps.google.com/?q=Fløibanen+Bergen", "mapsLabel": "📍 Fløibanen", "region": 3, "desc": "Mercato Pesce + Fløibanen", "descEn": "Fish Market + Fløibanen", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Fløibanen+Bergen", "text": "📍 Fløibanen", "target": "_blank"}]},
  {"id": "g33", "label": "G33", "labelEn": "D33", "data": "27/07", "tragitto": "Bergen ➔ Stavanger", "tragittoEn": "Bergen ➔ Stavanger", "km": "210", "ore": "5h", "oreEn": "5h", "paesi": "🇳🇴", "note": "Traghetti interni", "noteEn": "Internal ferries", "mapsUrl": "https://maps.google.com/?q=Stavanger+Norway", "mapsLabel": "📍 Stavanger", "region": 3, "desc": "Traghetti interni", "descEn": "Internal ferries", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Stavanger+Norway", "text": "📍 Stavanger", "target": "_blank"}]},
  {"id": "g34", "label": "G34", "labelEn": "D34", "data": "28/07", "tragitto": "Stavanger ➔ Kristiansand", "tragittoEn": "Stavanger ➔ Kristiansand", "km": "230", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇳🇴", "note": "⭐ Preikestolen", "noteEn": "⭐ Preikestolen", "mapsUrl": "https://maps.google.com/?q=58.9863,6.1885", "mapsLabel": "📍 Preikestolen Trailhead", "region": 3, "desc": "⭐ Preikestolen", "descEn": "⭐ Preikestolen", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=58.9863,6.1885", "text": "📍 Preikestolen Trailhead", "target": "_blank"}]},
  {"id": "g35", "label": "G35", "labelEn": "D35", "data": "29/07", "tragitto": "K.sand ➔ Copenhagen", "tragittoEn": "K.sand ➔ Copenhagen", "km": "375", "ore": "5h + traghetto 3h 15m", "oreEn": "5h + traghetto 3h 15m", "paesi": "🇳🇴➔🇩🇰", "note": "⛴️ Color Line + Nyhavn", "noteEn": "⛴️ Color Line + Nyhavn", "mapsUrl": "https://maps.google.com/?q=Nyhavn+Copenhagen", "mapsLabel": "📍 Nyhavn", "region": 4, "desc": "⛴️ Color Line + Nyhavn", "descEn": "⛴️ Color Line + Nyhavn", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Nyhavn+Copenhagen", "text": "📍 Nyhavn", "target": "_blank"}]},
  {"id": "g36", "label": "G36", "labelEn": "D36", "data": "30/07", "tragitto": "Copenhagen", "tragittoEn": "Copenhagen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Tivoli + canali", "noteEn": "⭐ Tivoli + canals", "mapsUrl": "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen", "mapsLabel": "📍 Tivoli Gardens", "region": 4, "desc": "⭐ Tivoli + canali", "descEn": "⭐ Tivoli + canals", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen", "text": "📍 Tivoli Gardens", "target": "_blank"}]},
  {"id": "g37", "label": "G37", "labelEn": "D37", "data": "31/07", "tragitto": "Copenhagen", "tragittoEn": "Copenhagen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Experimentarium", "noteEn": "⭐ Experimentarium", "mapsUrl": "https://maps.google.com/?q=Reffen+Copenhagen+Street+Food", "mapsLabel": "📍 Reffen", "region": 4, "desc": "⭐ Experimentarium", "descEn": "⭐ Experimentarium", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Reffen+Copenhagen+Street+Food", "text": "📍 Reffen", "target": "_blank"}]},
  {"id": "g38", "label": "G38", "labelEn": "D38", "data": "01/08", "tragitto": "Copenhagen ➔ Billund", "tragittoEn": "Copenhagen ➔ Billund", "km": "265", "ore": "3h", "oreEn": "3h", "paesi": "🇩🇰", "note": "🛣️ Ponte Storebælt. Odense", "noteEn": "🛣️ Storebælt Bridge. Odense", "mapsUrl": "https://maps.google.com/?q=LEGO+House+Billund", "mapsLabel": "📍 LEGO House", "region": 4, "desc": "🛣️ Ponte Storebælt. Odense", "descEn": "🛣️ Storebælt Bridge. Odense", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=LEGO+House+Billund", "text": "📍 LEGO House", "target": "_blank"}]},
  {"id": "g39", "label": "G39", "labelEn": "D39", "data": "02/08", "tragitto": "Legoland", "tragittoEn": "Legoland", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Legoland", "noteEn": "⭐ Legoland", "mapsUrl": "https://maps.google.com/?q=Legoland+Billund", "mapsLabel": "📍 Legoland Billund", "region": 4, "desc": "⭐ Legoland", "descEn": "⭐ Legoland", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Legoland+Billund", "text": "📍 Legoland Billund", "target": "_blank"}]},
  {"id": "g40", "label": "G40", "labelEn": "D40", "data": "03/08", "tragitto": "LEGO House + Lalandia", "tragittoEn": "LEGO House + Lalandia", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ LEGO House", "noteEn": "⭐ LEGO House", "mapsUrl": "https://maps.google.com/?q=LEGO+House+Billund", "mapsLabel": "📍 LEGO House Billund", "region": 5, "desc": "⭐ LEGO House", "descEn": "⭐ LEGO House", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=LEGO+House+Billund", "text": "📍 LEGO House Billund", "target": "_blank"}]},
  {"id": "g41", "label": "G41", "labelEn": "D41", "data": "04/08", "tragitto": "Billund ➔ Brema", "tragittoEn": "Billund ➔ Bremen", "km": "400", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇩🇰➔🇩🇪", "note": "🛣️ Margueritruten. Ribe + Musicanti", "noteEn": "🛣️ Marguerite Route. Ribe + Musicians", "mapsUrl": "https://maps.google.com/?q=Town+Musicians+of+Bremen+Statue", "mapsLabel": "📍 Bremen Musicians", "region": 5, "desc": "🛣️ Margueritruten. Ribe + Musicanti", "descEn": "🛣️ Marguerite Route. Ribe + Musicians", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Town+Musicians+of+Bremen+Statue", "text": "📍 Bremen Musicians", "target": "_blank"}]},
  {"id": "g42", "label": "G42", "labelEn": "D42", "data": "05/08", "tragitto": "Brema ➔ Amiens", "tragittoEn": "Bremen ➔ Amiens", "km": "715", "ore": "8h 30m", "oreEn": "8h 30m", "paesi": "🇩🇪➔🇫🇷", "note": "Cattedrale + Hortillonnages", "noteEn": "Cathedral + Hortillonnages", "mapsUrl": "https://maps.google.com/?q=Amiens+Cathedral", "mapsLabel": "📍 Amiens Cathedral", "region": 5, "desc": "Cattedrale + Hortillonnages", "descEn": "Cathedral + Hortillonnages", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Amiens+Cathedral", "text": "📍 Amiens Cathedral", "target": "_blank"}]},
  {"id": "g43", "label": "G43", "labelEn": "D43", "data": "06/08", "tragitto": "Amiens ➔ Loira", "tragittoEn": "Amiens ➔ Loire", "km": "330", "ore": "4h", "oreEn": "4h", "paesi": "🇫🇷", "note": "Arrivo Valle dei Re", "noteEn": "Arrival in the Valley of the Kings", "mapsUrl": "https://maps.google.com/?q=Château+d'Amboise", "mapsLabel": "📍 Amboise", "region": 5, "desc": "Arrivo Valle dei Re", "descEn": "Arrival in the Valley of the Kings", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Château+d'Amboise", "text": "📍 Amboise", "target": "_blank"}]},
  {"id": "g44", "label": "G44", "labelEn": "D44", "data": "07/08", "tragitto": "Castelli della Loira", "tragittoEn": "Loire Castles", "km": "50", "ore": "1h", "oreEn": "1h", "paesi": "🇫🇷", "note": "⭐ Clos Lucé + Chenonceau", "noteEn": "⭐ Clos Lucé + Chenonceau", "mapsUrl": "https://maps.google.com/?q=Clos+Lucé+Amboise", "mapsLabel": "📍 Clos Lucé", "region": 5, "desc": "⭐ Clos Lucé + Chenonceau", "descEn": "⭐ Clos Lucé + Chenonceau", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Clos+Lucé+Amboise", "text": "📍 Clos Lucé", "target": "_blank"}]},
  {"id": "g45", "label": "G45", "labelEn": "D45", "data": "08/08", "tragitto": "Loira ➔ San Sebastián", "tragittoEn": "Loire ➔ San Sebastián", "km": "670", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇫🇷➔🇪🇸", "note": "⭐ Gaztelugatxe + Pintxos", "noteEn": "⭐ Gaztelugatxe + Pintxos", "mapsUrl": "https://maps.google.com/?q=Zurriola+Beach+San+Sebastian", "mapsLabel": "📍 Zurriola Beach", "region": 6, "desc": "⭐ Gaztelugatxe + Pintxos", "descEn": "⭐ Gaztelugatxe + Pintxos", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Zurriola+Beach+San+Sebastian", "text": "📍 Zurriola Beach", "target": "_blank"}]},
  {"id": "g46", "label": "G46", "labelEn": "D46", "data": "09/08", "tragitto": "San Sebastián ➔ Bilbao", "tragittoEn": "San Sebastián ➔ Bilbao", "km": "100", "ore": "1h 30m", "oreEn": "1h 30m", "paesi": "🇪🇸", "note": "⭐ Guggenheim Bilbao", "noteEn": "⭐ Guggenheim Bilbao", "mapsUrl": "https://maps.google.com/?q=Guggenheim+Museum+Bilbao", "mapsLabel": "📍 Guggenheim Bilbao", "region": 6, "desc": "⭐ Guggenheim Bilbao", "descEn": "⭐ Guggenheim Bilbao", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Guggenheim+Museum+Bilbao", "text": "📍 Guggenheim Bilbao", "target": "_blank"}]},
  {"id": "g47", "label": "G47", "labelEn": "D47", "data": "10/08", "tragitto": "Bilbao ➔ Picos de Europa", "tragittoEn": "Bilbao ➔ Picos de Europa", "km": "220", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇪🇸", "note": "⭐ Fuente Dé + Picos", "noteEn": "⭐ Fuente Dé + Picos", "mapsUrl": "https://maps.google.com/?q=43.1500,-4.8000", "mapsLabel": "📍 Fuente Dé", "region": 6, "desc": "⭐ Fuente Dé + Picos", "descEn": "⭐ Fuente Dé + Picos", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=43.1500,-4.8000", "text": "📍 Fuente Dé", "target": "_blank"}]},
  {"id": "g48", "label": "G48", "labelEn": "D48", "data": "11/08", "tragitto": "Picos ➔ Palencia", "tragittoEn": "Picos ➔ Palencia", "km": "165", "ore": "2h 30m", "oreEn": "2h 30m", "paesi": "🇪🇸", "note": "Arrivo + sopralluogo spot eclissi", "noteEn": "Arrival + eclipse spot inspection", "mapsUrl": "https://maps.google.com/?q=Palencia+Spain", "mapsLabel": "📍 Palencia", "region": 6, "desc": "Arrivo + sopralluogo spot eclissi", "descEn": "Arrival + eclipse spot inspection", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Palencia+Spain", "text": "📍 Palencia", "target": "_blank"}]},
  {"id": "g49", "label": "G49", "labelEn": "D49", "data": "12/08", "tragitto": "🌒 ECLISSI TOTALE", "tragittoEn": "🌒 TOTAL ECLIPSE", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇪🇸", "note": "⭐⭐⭐ ECLISSI TOTALE", "noteEn": "⭐⭐⭐ TOTAL ECLIPSE", "mapsUrl": "https://maps.google.com/?q=Palencia+Spain", "mapsLabel": "📍 Palencia, Spain", "region": 6, "desc": "⭐⭐⭐ ECLISSI TOTALE", "descEn": "⭐⭐⭐ TOTAL ECLIPSE", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Palencia+Spain", "text": "📍 Palencia, Spain", "target": "_blank"}]},
  {"id": "g50", "label": "G50", "labelEn": "D50", "data": "13/08", "tragitto": "Palencia ➔ Costa Brava", "tragittoEn": "Palencia ➔ Costa Brava", "km": "770", "ore": "8h 30m", "oreEn": "8h 30m", "paesi": "🇪🇸", "note": "Cadaqués, Cap de Creus", "noteEn": "Cadaqués, Cap de Creus", "mapsUrl": "https://maps.google.com/?q=Costa+Brava+Spain", "mapsLabel": "📍 Costa Brava", "region": 6, "desc": "Cadaqués, Cap de Creus", "descEn": "Cadaqués, Cap de Creus", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Costa+Brava+Spain", "text": "📍 Costa Brava", "target": "_blank"}]},
  {"id": "g51", "label": "G51", "labelEn": "D51", "data": "14/08", "tragitto": "Costa Brava (relax)", "tragittoEn": "Costa Brava (relax)", "km": "30", "ore": "—", "oreEn": "—", "paesi": "🇪🇸", "note": "Cadaqués, Cap de Creus, spiagge", "noteEn": "Cadaqués, Cap de Creus, beaches", "mapsUrl": "https://maps.google.com/?q=Cadaqués+Spain", "mapsLabel": "📍 Cadaqués", "region": 6, "desc": "Cadaqués, Cap de Creus, spiagge", "descEn": "Cadaqués, Cap de Creus, beaches", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Cadaqués+Spain", "text": "📍 Cadaqués", "target": "_blank"}]},
  {"id": "g52", "label": "G52", "labelEn": "D52", "data": "15/08", "tragitto": "Costa Brava ➔ C. Azzurra", "tragittoEn": "Costa Brava ➔ C. Azzurra", "km": "610", "ore": "7h", "oreEn": "7h", "paesi": "🇪🇸➔🇫🇷", "note": "Mare (o Camargue)", "noteEn": "Sea (or Camargue)", "mapsUrl": "https://maps.google.com/?q=Côte+d'Azur+France", "mapsLabel": "📍 Cote d'Azur", "region": 6, "desc": "Mare (o Camargue)", "descEn": "Sea (or Camargue)", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Côte+d'Azur+France", "text": "📍 Cote d'Azur", "target": "_blank"}]},
  {"id": "g53", "label": "G53", "labelEn": "D53", "data": "16/08", "tragitto": "C. Azzurra ➔ Genova", "tragittoEn": "C. Azzurra ➔ Genoa", "km": "195", "ore": "2h 30m", "oreEn": "2h 30m", "paesi": "🇫🇷➔🇮🇹", "note": "⭐ Acquario di Genova", "noteEn": "⭐ Genoa Aquarium", "mapsUrl": "https://maps.google.com/?q=Acquario+di+Genova", "mapsLabel": "📍 Acquario di Genova", "region": 7, "desc": "⭐ Acquario di Genova", "descEn": "⭐ Genoa Aquarium", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Acquario+di+Genova", "text": "📍 Acquario di Genova", "target": "_blank"}]},
  {"id": "g54", "label": "G54", "labelEn": "D54", "data": "17/08", "tragitto": "Genova", "tragittoEn": "Genoa", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇮🇹", "note": "Porto Antico + Galata + Boccadasse", "noteEn": "Old Port + Galata + Boccadasse", "mapsUrl": "https://maps.google.com/?q=Porto+Antico+Genova", "mapsLabel": "📍 Porto Antico Genova", "region": 7, "desc": "Porto Antico + Galata + Boccadasse", "descEn": "Old Port + Galata + Boccadasse", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Porto+Antico+Genova", "text": "📍 Porto Antico Genova", "target": "_blank"}]},
  {"id": "g55", "label": "G55", "labelEn": "D55", "data": "18/08", "tragitto": "Genova ➔ Selvazzano", "tragittoEn": "Genoa ➔ Selvazzano", "km": "370", "ore": "4h", "oreEn": "4h", "paesi": "🇮🇹", "note": "Rientro a casa", "noteEn": "Return home", "mapsUrl": "https://maps.google.com/?q=Selvazzano+Dentro+Padova", "mapsLabel": "📍 Selvazzano Dentro", "region": 7, "desc": "Rientro a casa", "descEn": "Return home", "iconsText": "—", "icons": [], "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Selvazzano+Dentro+Padova", "text": "📍 Selvazzano Dentro", "target": "_blank"}]}
];

// ─── Regioni per la timeline mobile ───
var regioni = [
  {"label": "🇦🇹 Europa Centrale", "labelEn": "🇦🇹 Central Europe", "startDay": "g1", "endDay": "g2"},
  {"label": "🇱🇹🇱🇻🇪🇪 Paesi Baltici", "labelEn": "🇱🇹🇱🇻🇪🇪 Baltic States", "startDay": "g3", "endDay": "g7"},
  {"label": "🇫🇮 Finlandia & Lapponia", "labelEn": "🇫🇮 Finland & Lapland", "startDay": "g8", "endDay": "g16"},
  {"label": "🇳🇴 Norvegia", "labelEn": "🇳🇴 Norway", "startDay": "g17", "endDay": "g34"},
  {"label": "🇩🇰 Danimarca & Legoland", "labelEn": "🇩🇰 Denmark & Legoland", "startDay": "g35", "endDay": "g40"},
  {"label": "🇩🇪🇫🇷🇪🇸 Germania → Spagna", "labelEn": "🇩🇪🇫🇷🇪🇸 Germany → Spain", "startDay": "g41", "endDay": "g51"},
  {"label": "🇮🇹 Rientro", "labelEn": "🇮🇹 Return", "startDay": "g52", "endDay": "g55"}
];

// ─── Tab-index per il tab Giorni ───
var giorniTabIndex = [
  {"href": "#g0", "region": "central", "label": "G0–G10 Europa Centrale", "labelEn": "D0–D10 Central Europe"},
  {"href": "#g11", "region": "finland", "label": "G11–G15 Finlandia/Tromsø", "labelEn": "D11–D15 Finland/Tromsø"},
  {"href": "#g16", "region": "lofoten", "label": "G16–G23 Senja/Lofoten", "labelEn": "D16–D23 Senja/Lofoten"},
  {"href": "#g24", "region": "norway-south", "label": "G24–G33 Norvegia Sud", "labelEn": "D24–D33 South Norway"},
  {"href": "#g33", "region": "denmark", "label": "G33–G39 Danimarca", "labelEn": "D33–D39 Denmark"},
  {"href": "#g40", "region": "france", "label": "G40–G42 Francia", "labelEn": "D40–D42 France"},
  {"href": "#g43", "region": "spain", "label": "G43–G49 Spagna", "labelEn": "D43–D49 Spain"},
  {"href": "#g50", "region": "return", "label": "G50–G53 Rientro", "labelEn": "D50–D53 Return"},
  {"href": "#meteo", "region": "weather", "label": "☀️ Meteo", "labelEn": "☀️ Weather"},
  {"href": "#secB", "region": "alt", "label": "🗺️ Alternative", "labelEn": "🗺️ Alternatives"},
  {"href": "#pioggia", "region": "rain", "label": "☔ Piano Pioggia", "labelEn": "☔ Rain Plan"},
  {"href": "#feste", "region": "events", "label": "🎉 Feste ed Eventi", "labelEn": "🎉 Festivals & Events"}
];

// ─── Codici meteo (Open-Meteo WMO) ───
var weatherCodes = {
  0: {"it": "Sereno", "en": "Clear sky", "icon": "☀️"},
  1: {"it": "Prevalentemente sereno", "en": "Mainly clear", "icon": "🌤️"},
  2: {"it": "Parzialmente nuvoloso", "en": "Partly cloudy", "icon": "⛅"},
  3: {"it": "Coperto", "en": "Overcast", "icon": "☁️"},
  45: {"it": "Nebbia", "en": "Fog", "icon": "🌫️"},
  48: {"it": "Nebbia con brina", "en": "Depositing rime fog", "icon": "🌫️"},
  51: {"it": "Pioviggine leggera", "en": "Light drizzle", "icon": "🌦️"},
  53: {"it": "Pioviggine moderata", "en": "Moderate drizzle", "icon": "🌦️"},
  55: {"it": "Pioviggine intensa", "en": "Dense drizzle", "icon": "🌧️"},
  61: {"it": "Pioggia leggera", "en": "Slight rain", "icon": "🌦️"},
  63: {"it": "Pioggia moderata", "en": "Moderate rain", "icon": "🌧️"},
  65: {"it": "Pioggia forte", "en": "Heavy rain", "icon": "🌧️"},
  71: {"it": "Neve leggera", "en": "Slight snow", "icon": "❄️"},
  73: {"it": "Neve moderata", "en": "Moderate snow", "icon": "❄️"},
  75: {"it": "Neve forte", "en": "Heavy snow", "icon": "❄️"},
  80: {"it": "Rovesci leggeri", "en": "Slight showers", "icon": "🌦️"},
  81: {"it": "Rovesci moderati", "en": "Moderate showers", "icon": "🌧️"},
  82: {"it": "Rovesci violenti", "en": "Violent showers", "icon": "🌧️"},
  95: {"it": "Temporale", "en": "Thunderstorm", "icon": "⛈️"},
  96: {"it": "Temporale con grandine", "en": "Thunderstorm with hail", "icon": "⛈️"},
  99: {"it": "Temporale forte con grandine", "en": "Severe thunderstorm", "icon": "⛈️"},
};

// ─── Firebase Configuration ───
// NOTE (v2.34): Firebase API keys are safe to expose client-side (they only identify the project).
// Security is enforced by Firebase Security Rules + Auth. Restrict this key in
// Google Cloud Console → API Restrictions → HTTP referrers:
//   viaggio-europa-2026.web.app/*
//   https://localhost
//   https://localhost/*
//   http://localhost
//   http://localhost/*
// The localhost entries are required for Capacitor WebView (which serves from https://localhost).
// For production Android, prefer a separate API key with Android app restriction (SHA-1 + package name).
var firebaseConfig = {
  apiKey: "AIzaSyCuUYGu_5PlIlDbxwYsFYL5y4OmoGehzzg",
  authDomain: "viaggio-europa-2026.firebaseapp.com",
  databaseURL: "https://viaggio-europa-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "viaggio-europa-2026",
  storageBucket: "viaggio-europa-2026.firebasestorage.app",
  messagingSenderId: "859844907239",
  appId: "1:859844907239:web:f226b10961df1fe66fd242"
};

var VAPID_KEY = 'BBW43ENkLgM_oXOaCCyo_m3voilbfw2fdlqjtopognVCmyiGXAibwedF94Og56uQdh61IvLqokMfIeR0BYhYkis';

// ─── POI: Luoghi da Visitare ───
// Categorie: "park" = Parchi divertimento, "market" = Mercati, "nature" = Parchi nazionali,
//            "museum" = Musei, "viewpoint" = Viewpoint, "festival" = Festival, "spa" = Terme
var POI_ATTIVITA = [
  // ═══ MUSEI E ATTRAZIONI ═══
  { id: "poi-kunsthalle-leoben", cat: "museum", name: "Kunsthalle Leoben", nameEn: "Kunsthalle Leoben", lat: 47.3767, lng: 15.0908, country: "🇦🇹", city: "Leoben", nearDay: "g1",
    desc: "Museo interattivo per bambini 6-14 anni. Mostre temporanee coinvolgenti e creative.",
    descEn: "Interactive museum for children 6-14. Engaging and creative temporary exhibitions.",
    price: "€9 adulti, €5 bambini", priceEn: "€9 adults, €5 children",
    url: "https://www.kunsthalle-leoben.at", mapsUrl: "https://maps.google.com/?q=Kunsthalle+Leoben" },

  { id: "poi-occupazione-riga", cat: "museum", name: "Museo dell'Occupazione", nameEn: "Museum of the Occupation of Latvia", lat: 56.9480, lng: 24.1100, country: "🇱🇻", city: "Riga", nearDay: "g5",
    desc: "Storia delle occupazioni sovietica e nazista della Lettonia. Coinvolgente e toccante. Ingresso gratuito.",
    descEn: "History of Soviet and Nazi occupations of Latvia. Engaging and moving. Free entry.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://okupacijasmuzejs.lv/en/", mapsUrl: "https://maps.google.com/?q=Museum+of+the+Occupation+of+Latvia+Riga" },

  { id: "poi-lennusadam", cat: "museum", name: "Lennusadam (Seaplane Harbour)", nameEn: "Seaplane Harbour", lat: 59.4510, lng: 24.7380, country: "🇪🇪", city: "Tallinn", nearDay: "g6",
    desc: "Museo marittimo in hangar per idrovolanti. Sottomarino vero, simulatori. Perfetto per bambini.",
    descEn: "Maritime museum in seaplane hangars. Real submarine, simulators. Perfect for kids.",
    price: "€22 adulti, €11 studenti, gratis <8", priceEn: "€22 adults, €11 students, free <8",
    url: "https://meremuuseum.ee/en/lennusadam/", mapsUrl: "https://maps.google.com/?q=Lennusadam+Tallinn" },

  { id: "poi-suomenlinna", cat: "museum", name: "Suomenlinna", nameEn: "Suomenlinna", lat: 60.1454, lng: 24.9881, country: "🇫🇮", city: "Helsinki", nearDay: "g7",
    desc: "Fortezza marina UNESCO raggiungibile in traghetto (15 min). Musei, tunnel, picnic. Ideale per famiglie.",
    descEn: "UNESCO sea fortress reachable by ferry (15 min). Museums, tunnels, picnics. Ideal for families.",
    price: "Traghetto €5 A/R, musei €8", priceEn: "Ferry €5 return, museums €8",
    url: "https://www.suomenlinna.fi/en/", mapsUrl: "https://maps.google.com/?q=Suomenlinna+Helsinki" },

  { id: "poi-arktikum", cat: "museum", name: "Arktikum", nameEn: "Arktikum", lat: 66.5050, lng: 25.7350, country: "🇫🇮", city: "Rovaniemi", nearDay: "g13",
    desc: "Museo sulla vita artica e cultura Sámi. Architettura spettacolare con tunnel di vetro di 172m.",
    descEn: "Museum on Arctic life and Sámi culture. Spectacular architecture with 172m glass tunnel.",
    price: "€18 adulti, €7 bambini", priceEn: "€18 adults, €7 children",
    url: "https://www.arktikum.fi/en/", mapsUrl: "https://maps.google.com/?q=Arktikum+Rovaniemi" },

  { id: "poi-siida", cat: "museum", name: "Siida Museum", nameEn: "Siida Museum", lat: 69.0714, lng: 27.0142, country: "🇫🇮", city: "Inari", nearDay: "g14",
    desc: "Museo della cultura Sámi e della natura artica a Inari. Mostre all'aperto e indoor. Renne.",
    descEn: "Museum of Sámi culture and Arctic nature in Inari. Outdoor and indoor exhibitions. Reindeer.",
    price: "€15 adulti, €7 bambini", priceEn: "€15 adults, €7 children",
    url: "https://siida.fi/en/", mapsUrl: "https://maps.google.com/?q=Siida+Museum+Inari" },

  { id: "poi-lofotr", cat: "museum", name: "Lofotr Viking Museum", nameEn: "Lofotr Viking Museum", lat: 68.2300, lng: 13.7900, country: "🇳🇴", city: "Borg, Lofoten", nearDay: "g21",
    desc: "Ricostruzione di una longhouse vichinga (83m). Attività interattive: tiro con l'arco, barca vichinga.",
    descEn: "Reconstruction of a Viking longhouse (83m). Interactive activities: archery, Viking boat.",
    price: "NOK 220 adulti, NOK 100 bambini", priceEn: "NOK 220 adults, NOK 100 children",
    url: "https://www.lofotr.no/en/", mapsUrl: "https://maps.google.com/?q=Lofotr+Viking+Museum" },

  { id: "poi-bryggen", cat: "museum", name: "Bryggen", nameEn: "Bryggen", lat: 60.3975, lng: 5.3240, country: "🇳🇴", city: "Bergen", nearDay: "g31",
    desc: "Quartiere anseatico UNESCO. Edifici in legno colorati del XIV secolo. Botteghe artigiane e musei.",
    descEn: "UNESCO Hanseatic quarter. Colourful 14th-century wooden buildings. Artisan workshops and museums.",
    price: "Ingresso libero (museo NOK 120)", priceEn: "Free entry (museum NOK 120)",
    url: "https://www.visitbergen.com/things-to-do/bryggen-in-bergen-p822003", mapsUrl: "https://maps.google.com/?q=Bryggen+Bergen" },

  { id: "poi-petrolio", cat: "museum", name: "Museo Petrolio Norvegese", nameEn: "Norwegian Petroleum Museum", lat: 58.9700, lng: 5.7330, country: "🇳🇴", city: "Stavanger", nearDay: "g32",
    desc: "Interattivo e sorprendente. Piattaforme petrolifere, simulatori, storia dell'industria offshore.",
    descEn: "Interactive and surprising. Oil platforms, simulators, offshore industry history.",
    price: "NOK 180 adulti, NOK 90 bambini", priceEn: "NOK 180 adults, NOK 90 children",
    url: "https://www.norskolje.museum.no/en/", mapsUrl: "https://maps.google.com/?q=Norwegian+Petroleum+Museum+Stavanger" },

  { id: "poi-nationalmuseet", cat: "museum", name: "Nationalmuseet", nameEn: "National Museum of Denmark", lat: 55.6745, lng: 12.5747, country: "🇩🇰", city: "Copenhagen", nearDay: "g35",
    desc: "Museo nazionale danese. Sezione bambini eccezionale con attività interattive. Ingresso gratuito.",
    descEn: "Danish National Museum. Exceptional children's section with interactive activities. Free entry.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://en.natmus.dk/", mapsUrl: "https://maps.google.com/?q=Nationalmuseet+Copenhagen" },

  { id: "poi-experimentarium", cat: "museum", name: "Experimentarium", nameEn: "Experimentarium", lat: 55.7200, lng: 12.5800, country: "🇩🇰", city: "Copenhagen", nearDay: "g35",
    desc: "Science center interattivo. 300+ exhibit hands-on. Perfetto per bambini 6-12 anni.",
    descEn: "Interactive science center. 300+ hands-on exhibits. Perfect for children 6-12.",
    price: "DKK 215 adulti, DKK 135 bambini", priceEn: "DKK 215 adults, DKK 135 children",
    url: "https://www.experimentarium.dk/en/", mapsUrl: "https://maps.google.com/?q=Experimentarium+Copenhagen" },

  { id: "poi-chambord", cat: "museum", name: "Château de Chambord", nameEn: "Château de Chambord", lat: 47.6161, lng: 1.5170, country: "🇫🇷", city: "Chambord", nearDay: "g41",
    desc: "Il più grande castello della Loira. Scala a doppia elica di Leonardo da Vinci. 440 stanze.",
    descEn: "The largest château in the Loire Valley. Leonardo da Vinci's double helix staircase. 440 rooms.",
    price: "€21 adulti, gratis <26 EU", priceEn: "€21 adults, free <26 EU",
    url: "https://www.chambord.org/en/", mapsUrl: "https://maps.google.com/?q=Château+de+Chambord" },

  { id: "poi-chenonceau", cat: "museum", name: "Château de Chenonceau", nameEn: "Château de Chenonceau", lat: 47.3249, lng: 1.0703, country: "🇫🇷", city: "Chenonceaux", nearDay: "g41",
    desc: "\"Castello delle Dame\", sul fiume Cher. Giardini spettacolari. Il più visitato dopo Versailles.",
    descEn: "\"Ladies' Castle\", over the River Cher. Spectacular gardens. Most visited after Versailles.",
    price: "€19 adulti, €15 bambini (7-18)", priceEn: "€19 adults, €15 children (7-18)",
    url: "https://www.chenonceau.com/en/", mapsUrl: "https://maps.google.com/?q=Château+de+Chenonceau" },

  { id: "poi-san-telmo", cat: "museum", name: "San Telmo Museoa", nameEn: "San Telmo Museum", lat: 43.3240, lng: -1.9830, country: "🇪🇸", city: "San Sebastián", nearDay: "g44",
    desc: "Museo della società basca in un convento del XVI secolo. Storia, arte e cultura del Paese Basco.",
    descEn: "Museum of Basque society in a 16th-century convent. History, art and culture of the Basque Country.",
    price: "€8 adulti, gratis <25", priceEn: "€8 adults, free <25",
    url: "https://www.santelmomuseoa.eus/en", mapsUrl: "https://maps.google.com/?q=San+Telmo+Museoa+San+Sebastian" },

  { id: "poi-guggenheim", cat: "museum", name: "Museo Guggenheim", nameEn: "Guggenheim Museum Bilbao", lat: 43.2687, lng: -2.9340, country: "🇪🇸", city: "Bilbao", nearDay: "g45",
    desc: "Architettura iconica di Frank Gehry. Collezione arte contemporanea. Scultura \"Puppy\" all'ingresso.",
    descEn: "Iconic Frank Gehry architecture. Contemporary art collection. \"Puppy\" sculpture at entrance.",
    price: "€18 adulti, gratis <18", priceEn: "€18 adults, free <18",
    url: "https://www.guggenheim-bilbao.eus/en", mapsUrl: "https://maps.google.com/?q=Guggenheim+Museum+Bilbao" },

  { id: "poi-acquario-genova-m", cat: "museum", name: "Acquario di Genova", nameEn: "Genoa Aquarium", lat: 44.4097, lng: 8.9268, country: "🇮🇹", city: "Genova", nearDay: "g52",
    desc: "Il più grande acquario d'Italia e tra i maggiori in Europa. 70 vasche, 12.000 animali, 600 specie. Delfini, squali, pinguini.",
    descEn: "Italy's largest aquarium and among the biggest in Europe. 70 tanks, 12,000 animals, 600 species. Dolphins, sharks, penguins.",
    price: "da €26 adulti, da €16 bambini (4-12)", priceEn: "from €26 adults, from €16 children (4-12)",
    url: "https://www.acquariodigenova.it/en/", mapsUrl: "https://maps.google.com/?q=Acquario+di+Genova" },

  { id: "poi-galata", cat: "museum", name: "Galata Museo del Mare", nameEn: "Galata Maritime Museum", lat: 44.4130, lng: 8.9220, country: "🇮🇹", city: "Genova", nearDay: "g52",
    desc: "Museo marittimo interattivo. Sottomarino visitabile. Il più grande museo marittimo del Mediterraneo.",
    descEn: "Interactive maritime museum. Visitable submarine. The largest maritime museum in the Mediterranean.",
    price: "€17 adulti, €12 bambini", priceEn: "€17 adults, €12 children",
    url: "https://www.galatamuseodelmare.it/en/", mapsUrl: "https://maps.google.com/?q=Galata+Museo+del+Mare+Genova" },

  // ═══ VIEWPOINT ═══
  { id: "poi-punkaharju", cat: "viewpoint", name: "Punkaharju Ridge", nameEn: "Punkaharju Ridge", lat: 61.7667, lng: 29.3833, country: "🇫🇮", city: "Punkaharju", nearDay: "g8",
    desc: "Cresta glaciale tra due laghi. Strada panoramica unica al mondo (7 km). Patrimonio naturale finlandese.",
    descEn: "Glacial ridge between two lakes. Unique scenic road in the world (7 km). Finnish natural heritage.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitsavonlinna.fi/en/see-and-do/punkaharju/", mapsUrl: "https://maps.google.com/?q=Punkaharju+Ridge" },

  { id: "poi-aavasaksa", cat: "viewpoint", name: "Aavasaksa Hill", nameEn: "Aavasaksa Hill", lat: 66.4000, lng: 23.7300, country: "🇫🇮", city: "Aavasaksa", nearDay: "g11",
    desc: "Punto più meridionale dove si vede il sole di mezzanotte. Torre panoramica. Vista sulla Svezia.",
    descEn: "Southernmost point to see the midnight sun. Panoramic tower. View over Sweden.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitfinland.com/en/product/aavasaksa-hill/", mapsUrl: "https://maps.google.com/?q=Aavasaksa+Hill" },

  { id: "poi-fjellheisen", cat: "viewpoint", name: "Fjellheisen Tromsø", nameEn: "Fjellheisen Tromsø", lat: 69.6400, lng: 19.0000, country: "🇳🇴", city: "Tromsø", nearDay: "g16",
    desc: "Funivia a 421m sopra Tromsø. Vista a 360° sulla città artica, fiordi e montagne. Sole di mezzanotte.",
    descEn: "Cable car to 421m above Tromsø. 360° view over the Arctic city, fjords and mountains. Midnight sun.",
    price: "NOK 250 adulti, NOK 120 bambini", priceEn: "NOK 250 adults, NOK 120 children",
    url: "https://fjellheisen.no/en/", mapsUrl: "https://maps.google.com/?q=Fjellheisen+Tromsø" },

  { id: "poi-segla", cat: "viewpoint", name: "Segla", nameEn: "Segla", lat: 69.2950, lng: 17.0500, country: "🇳🇴", city: "Senja", nearDay: "g17",
    desc: "Vetta iconica di Senja. Escursione 4h A/R, vista mozzafiato sui fiordi. Difficoltà media.",
    descEn: "Iconic Senja peak. 4h return hike, breathtaking fjord views. Medium difficulty.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/hike-to-segla/200282/", mapsUrl: "https://maps.google.com/?q=Segla+Senja" },

  { id: "poi-reinebringen", cat: "viewpoint", name: "Reinebringen", nameEn: "Reinebringen", lat: 67.9340, lng: 13.0750, country: "🇳🇴", city: "Reine, Lofoten", nearDay: "g21",
    desc: "Vista iconica su Reine e i fiordi delle Lofoten. Scalinata in pietra (1h salita). Imperdibile.",
    descEn: "Iconic view over Reine and Lofoten fjords. Stone staircase (1h climb). Unmissable.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/reinebringen/216936/", mapsUrl: "https://maps.google.com/?q=Reinebringen+Lofoten" },

  { id: "poi-atlantic-road", cat: "viewpoint", name: "Atlantic Road", nameEn: "Atlantic Road", lat: 63.0170, lng: 7.3530, country: "🇳🇴", city: "Averøy", nearDay: "g28",
    desc: "Strada sull'oceano tra isolotti. Uno dei drive più scenografici al mondo. 8,3 km di ponti.",
    descEn: "Road over the ocean between islets. One of the world's most scenic drives. 8.3 km of bridges.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/the-atlantic-road/5765/", mapsUrl: "https://maps.google.com/?q=Atlantic+Road+Norway" },

  { id: "poi-trollstigen", cat: "viewpoint", name: "Trollstigen Viewpoint", nameEn: "Trollstigen Viewpoint", lat: 62.4560, lng: 7.6700, country: "🇳🇴", city: "Trollstigen", nearDay: "g29",
    desc: "Piattaforma panoramica sulla strada dei troll. Tornanti vertiginosi e cascate. Accessibile in auto.",
    descEn: "Panoramic platform on the Troll Road. Dizzying hairpin bends and waterfalls. Accessible by car.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/trollstigen/5765/", mapsUrl: "https://maps.google.com/?q=Trollstigen+Viewpoint" },

  { id: "poi-ornesvingen", cat: "viewpoint", name: "Ørnesvingen (Geirangerfjord)", nameEn: "Ørnesvingen (Geirangerfjord)", lat: 62.0800, lng: 7.0500, country: "🇳🇴", city: "Geiranger", nearDay: "g29",
    desc: "Vista a strapiombo sul fiordo UNESCO. Accessibile in auto. Uno dei panorami più fotografati della Norvegia.",
    descEn: "Sheer view over the UNESCO fjord. Accessible by car. One of Norway's most photographed panoramas.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/ornesvingen-viewpoint/186816/", mapsUrl: "https://maps.google.com/?q=Ørnesvingen+Geiranger" },

  { id: "poi-stegastein", cat: "viewpoint", name: "Stegastein Viewpoint", nameEn: "Stegastein Viewpoint", lat: 60.9000, lng: 7.2000, country: "🇳🇴", city: "Aurland", nearDay: "g30",
    desc: "Piattaforma in vetro sospesa a 650m sopra l'Aurlandsfjord. Accessibile in auto. Vista mozzafiato.",
    descEn: "Glass platform suspended 650m above Aurlandsfjord. Accessible by car. Breathtaking view.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitnorway.com/listings/stegastein-viewpoint/5766/", mapsUrl: "https://maps.google.com/?q=Stegastein+Viewpoint" },

  { id: "poi-preikestolen", cat: "viewpoint", name: "Preikestolen", nameEn: "Preikestolen (Pulpit Rock)", lat: 58.9863, lng: 6.1900, country: "🇳🇴", city: "Stavanger", nearDay: "g32",
    desc: "\"Pulpito\": roccia piatta a 604m sul Lysefjord. Escursione 4h A/R. Icona della Norvegia.",
    descEn: "\"Pulpit Rock\": flat cliff 604m above Lysefjord. 4h return hike. Norway icon.",
    price: "Parcheggio NOK 300", priceEn: "Parking NOK 300",
    url: "https://www.visitnorway.com/listings/preikestolen/185743/", mapsUrl: "https://maps.google.com/?q=Preikestolen" },

  { id: "poi-igueldo", cat: "viewpoint", name: "Monte Igueldo", nameEn: "Monte Igueldo", lat: 43.3200, lng: -2.0050, country: "🇪🇸", city: "San Sebastián", nearDay: "g44",
    desc: "Funicolare storica con vista sulla baia della Concha. Piccolo parco divertimenti vintage in cima.",
    descEn: "Historic funicular with views over La Concha bay. Small vintage amusement park at the top.",
    price: "Funicolare €4, parco €1-3/attrazione", priceEn: "Funicular €4, park €1-3/ride",
    url: "https://www.monteigueldo.es/en/", mapsUrl: "https://maps.google.com/?q=Monte+Igueldo+San+Sebastian" },

  { id: "poi-corniche", cat: "viewpoint", name: "Corniche Basque", nameEn: "Corniche Basque", lat: 43.3700, lng: -1.7500, country: "🇫🇷", city: "Hendaye", nearDay: "g44",
    desc: "Strada costiera tra Hendaye e Saint-Jean-de-Luz. Scogliere sull'Atlantico. Panorama spettacolare.",
    descEn: "Coastal road between Hendaye and Saint-Jean-de-Luz. Atlantic cliffs. Spectacular panorama.",
    price: "Gratuito", priceEn: "Free",
    url: "https://www.visitfrance.com/", mapsUrl: "https://maps.google.com/?q=Corniche+Basque" },

  { id: "poi-fuente-de", cat: "viewpoint", name: "Fuente Dé Cable Car", nameEn: "Fuente Dé Cable Car", lat: 43.1500, lng: -4.8100, country: "🇪🇸", city: "Picos de Europa", nearDay: "g46",
    desc: "Funivia a 1.823m. Vista a 360° sulle montagne calcaree dei Picos de Europa.",
    descEn: "Cable car to 1,823m. 360° view over the Picos de Europa limestone mountains.",
    price: "€30 adulti A/R (alta stagione), €15 bambini", priceEn: "€30 adults round-trip (high season), €15 children",
    url: "https://cantur.com/instalaciones/3-teleferico-de-fuente-de", mapsUrl: "https://maps.google.com/?q=Fuente+Dé+Cable+Car" },

  { id: "poi-cinque-terre-sentiero", cat: "viewpoint", name: "Cinque Terre sentiero", nameEn: "Cinque Terre Trail", lat: 44.1280, lng: 9.7100, country: "🇮🇹", city: "Cinque Terre", nearDay: "g52",
    desc: "Sentiero tra i borghi colorati con vista sul mare ligure. Vigneti terrazzati e scogliere.",
    descEn: "Trail between colourful villages with views over the Ligurian sea. Terraced vineyards and cliffs.",
    price: "Cinque Terre Card €16/giorno", priceEn: "Cinque Terre Card €16/day",
    url: "https://www.parconazionale5terre.it/en/sentieri/", mapsUrl: "https://maps.google.com/?q=Sentiero+Azzurro+Cinque+Terre" },

  // ═══ FESTIVAL ═══
  { id: "poi-ollesummer", cat: "festival", name: "Õllesummer", nameEn: "Õllesummer", lat: 59.4370, lng: 24.7530, country: "🇪🇪", city: "Tallinn", nearDay: "g6",
    desc: "Festival birra e musica più grande d'Estonia. 01–04 luglio. Ingresso ~€15-25.",
    descEn: "Estonia's largest beer and music festival. Jul 01–04. Entry ~€15-25.",
    price: "€15-25", priceEn: "€15-25", period: "01–04/07",
    url: "https://ollesummer.ee", mapsUrl: "https://maps.google.com/?q=Õllesummer+Tallinn" },

  { id: "poi-ruisrock", cat: "festival", name: "Ruisrock", nameEn: "Ruisrock", lat: 60.4300, lng: 22.2200, country: "🇫🇮", city: "Turku", nearDay: "g9",
    desc: "Uno dei festival rock più antichi d'Europa (1970). 04–06 luglio. Turku (deviazione).",
    descEn: "One of Europe's oldest rock festivals (1970). Jul 04–06. Turku (detour).",
    price: "€129 giornaliero", priceEn: "€129 day pass", period: "04–06/07",
    url: "https://www.ruisrock.fi/en", mapsUrl: "https://maps.google.com/?q=Ruisrock+Turku" },

  { id: "poi-midnight-sun-film", cat: "festival", name: "Midnight Sun Film Festival", nameEn: "Midnight Sun Film Festival", lat: 67.4167, lng: 26.5833, country: "🇫🇮", city: "Sodankylä", nearDay: "g14",
    desc: "Cinema sotto il sole di mezzanotte. 09–13 luglio. Fondato da Aki Kaurismäki. Sodankylä.",
    descEn: "Cinema under the midnight sun. Jul 09–13. Founded by Aki Kaurismäki. Sodankylä.",
    price: "Pass ~€80", priceEn: "Pass ~€80", period: "09–13/07",
    url: "https://msfilmfestival.fi/en/", mapsUrl: "https://maps.google.com/?q=Sodankylä+Finland" },

  { id: "poi-bukta", cat: "festival", name: "Bukta Festival", nameEn: "Bukta Festival", lat: 69.6500, lng: 18.9600, country: "🇳🇴", city: "Tromsø", nearDay: "g22",
    desc: "Festival musica all'aperto nell'Artico. 17–19 luglio. Tromsø.",
    descEn: "Outdoor music festival in the Arctic. Jul 17–19. Tromsø.",
    price: "NOK 1.200 pass", priceEn: "NOK 1,200 pass", period: "17–19/07",
    url: "https://bukta.no", mapsUrl: "https://maps.google.com/?q=Bukta+Festival+Tromsø" },

  { id: "poi-olavsfest", cat: "festival", name: "Olavsfestdagene", nameEn: "Olavsfestdagene", lat: 63.4305, lng: 10.3951, country: "🇳🇴", city: "Trondheim", nearDay: "g27",
    desc: "Festival medievale di St. Olav. 28/07–03/08. Concerti, mercato medievale, pellegrinaggio. Trondheim.",
    descEn: "Medieval festival of St. Olav. Jul 28–Aug 03. Concerts, medieval market, pilgrimage. Trondheim.",
    price: "Molti eventi gratuiti", priceEn: "Many free events", period: "28/07–03/08",
    url: "https://www.olavsfestdagene.no/en", mapsUrl: "https://maps.google.com/?q=Olavsfestdagene+Trondheim" },

  { id: "poi-jazz-cph", cat: "festival", name: "Copenhagen Jazz Festival", nameEn: "Copenhagen Jazz Festival", lat: 55.6761, lng: 12.5683, country: "🇩🇰", city: "Copenhagen", nearDay: "g35",
    desc: "1.000+ concerti in tutta la città, molti gratuiti. 04–13 luglio. Il più grande festival jazz del Nord Europa.",
    descEn: "1,000+ concerts across the city, many free. Jul 04–13. Northern Europe's largest jazz festival.",
    price: "Molti concerti gratuiti", priceEn: "Many free concerts", period: "04–13/07",
    url: "https://jazz.dk", mapsUrl: "https://maps.google.com/?q=Copenhagen+Jazz+Festival" },

  { id: "poi-semana-grande", cat: "festival", name: "Semana Grande", nameEn: "Semana Grande", lat: 43.3183, lng: -1.9812, country: "🇪🇸", city: "San Sebastián", nearDay: "g44",
    desc: "La festa più grande dei Paesi Baschi. 09–16 agosto. Fuochi d'artificio sulla Concha ogni sera alle 22:30!",
    descEn: "The biggest festival in the Basque Country. Aug 09–16. Fireworks over La Concha every night at 22:30!",
    price: "Gratuito", priceEn: "Free", period: "09–16/08",
    url: "https://www.donostia.eus/info/ciudadano/fiestas", mapsUrl: "https://maps.google.com/?q=Semana+Grande+San+Sebastian" },

  { id: "poi-aste-nagusia", cat: "festival", name: "Aste Nagusia Bilbao", nameEn: "Aste Nagusia Bilbao", lat: 43.2630, lng: -2.9350, country: "🇪🇸", city: "Bilbao", nearDay: "g45",
    desc: "9 giorni di festa: tori, concerti, fuochi. 16–24 agosto. Inizia il sabato dopo il 15/08.",
    descEn: "9 days of festivities: bulls, concerts, fireworks. Aug 16–24. Starts Saturday after Aug 15.",
    price: "Gratuito", priceEn: "Free", period: "16–24/08",
    url: "https://www.bilbao.eus/", mapsUrl: "https://maps.google.com/?q=Aste+Nagusia+Bilbao" },

  // ═══ TERME ═══
  { id: "poi-therme-wien", cat: "spa", name: "Therme Wien Oberlaa", nameEn: "Therme Wien Oberlaa", lat: 48.1420, lng: 16.4020, country: "🇦🇹", city: "Vienna", nearDay: "g2",
    desc: "Complesso termale moderno con Area Famiglia (scivoli, zona toddler). In metro dal centro (U1 → Oberlaa).",
    descEn: "Modern thermal complex with Family Area (slides, toddler zone). Metro from centre (U1 → Oberlaa).",
    price: "€39 adulto, €23 bambino", priceEn: "€39 adult, €23 child",
    url: "https://www.thermewien.at/en/", mapsUrl: "https://maps.google.com/?q=48.1420,16.4020(Therme+Wien+Oberlaa)" },

  { id: "poi-sauna-saimaa", cat: "spa", name: "Sauna finlandese sul lago", nameEn: "Finnish Lakeside Sauna", lat: 61.5000, lng: 28.5000, country: "🇫🇮", city: "Saimaa", nearDay: "g9",
    desc: "Esperienza autentica: sauna a legna + tuffo nel lago Saimaa. Noleggiabile nelle strutture locali.",
    descEn: "Authentic experience: wood-burning sauna + dip in Lake Saimaa. Available at local facilities.",
    price: "~€20-40/famiglia", priceEn: "~€20-40/family",
    url: "https://www.visitsaimaa.fi/en/finnish-sauna-by-lake-saimaa/", mapsUrl: "https://maps.google.com/?q=Saimaa+lakeside+sauna+Finland" },

  { id: "poi-pust", cat: "spa", name: "Pust Tromsø", nameEn: "Pust Tromsø", lat: 69.6470, lng: 18.9620, country: "🇳🇴", city: "Tromsø", nearDay: "g16",
    desc: "Sauna galleggiante sul fiordo artico. Tuffo nell'acqua a 8°C! Sole di mezzanotte incluso.",
    descEn: "Floating sauna on the Arctic fjord. Dip in 8°C water! Midnight sun included.",
    price: "NOK 150 adulto (~€13), NOK 79 bambino", priceEn: "NOK 150 adult (~€13), NOK 79 child",
    url: "https://www.pust.no", mapsUrl: "https://maps.google.com/?q=69.6470,18.9620(Pust+Tromsø)" },


  { id: "poi-la-perla", cat: "spa", name: "La Perla San Sebastián", nameEn: "La Perla San Sebastián", lat: 43.3180, lng: -1.9870, country: "🇪🇸", city: "San Sebastián", nearDay: "g44",
    desc: "Talassoterapia sulla spiaggia della Concha. Piscina con vista sull'oceano. Bambini ammessi in alcune zone.",
    descEn: "Thalassotherapy on La Concha beach. Pool with ocean view. Children allowed in some areas.",
    price: "~€30/persona", priceEn: "~€30/person",
    url: "https://www.la-perla.net/en/", mapsUrl: "https://maps.google.com/?q=43.3180,-1.9870(La+Perla+San+Sebastian)" },

  { id: "poi-hermida", cat: "spa", name: "Balneario La Hermida", nameEn: "Balneario La Hermida", lat: 43.2250, lng: -4.6100, country: "🇪🇸", city: "La Hermida", nearDay: "g46",
    desc: "Acque a 60°C nella gola del Deva. A 30 km da Fuente Dé — si abbina alla funivia mattutina. Storico (XIX sec).",
    descEn: "60°C waters in the Deva gorge. 30 km from Fuente Dé — combine with morning cable car. Historic (19th c.).",
    price: "~€20/persona", priceEn: "~€20/person",
    url: "https://balneariolahermida.com/", mapsUrl: "https://maps.google.com/?q=43.2250,-4.6100(Balneario+La+Hermida)" },

  { id: "poi-castilla-termal", cat: "spa", name: "Castilla Termal", nameEn: "Castilla Termal", lat: 42.0000, lng: -4.5300, country: "🇪🇸", city: "Palencia", nearDay: "g48",
    desc: "Terme in convento restaurato. Acque minerali a 36°C. Relax pre-eclissi perfetto.",
    descEn: "Spa in a restored convent. 36°C mineral waters. Perfect pre-eclipse relaxation.",
    price: "~€25/persona", priceEn: "~€25/person",
    url: "https://www.castillatermal.com/en/", mapsUrl: "https://maps.google.com/?q=Castilla+Termal+Palencia" },

  // ═══ PARCHI DIVERTIMENTO ═══
  { id: "poi-prater", cat: "park", name: "Wiener Prater", nameEn: "Vienna Prater", lat: 48.2134, lng: 16.4042, country: "🇦🇹", city: "Vienna", nearDay: "g2",
    desc: "Parco divertimenti storico (1897). Ruota panoramica Riesenrad, 250+ attrazioni. Ingresso gratuito, singole attrazioni a pagamento.",
    descEn: "Historic amusement park (1897). Giant Ferris wheel Riesenrad, 250+ rides. Free entry, pay per ride.",
    price: "Ingresso gratuito, giostre €3-6", priceEn: "Free entry, rides €3-6",
    url: "https://www.praterwien.com", mapsUrl: "https://maps.google.com/?q=Wurstelprater+Vienna" },

  { id: "poi-linnanmaki", cat: "park", name: "Linnanmäki", nameEn: "Linnanmäki", lat: 60.1878, lng: 24.9400, country: "🇫🇮", city: "Helsinki", nearDay: "g7",
    desc: "Il parco divertimenti più antico e popolare della Finlandia (1950). 40+ attrazioni, ingresso gratuito. Ricavato va in beneficenza.",
    descEn: "Finland's oldest and most popular amusement park (1950). 40+ rides, free entry. Profits go to charity.",
    price: "Ingresso gratuito, braccialetto giostre ~€44", priceEn: "Free entry, ride wristband ~€44",
    url: "https://www.linnanmaki.fi/en/", mapsUrl: "https://maps.google.com/?q=Linnanmäki+Helsinki" },

  { id: "poi-ranua", cat: "park", name: "Ranua Wildlife Park", nameEn: "Ranua Wildlife Park", lat: 65.9300, lng: 26.5100, country: "🇫🇮", city: "Ranua", nearDay: "g11",
    desc: "Zoo artico con 50 specie boreali: orsi polari, linci, lupi, ghiottoni. Unico zoo con orsi polari in Finlandia.",
    descEn: "Arctic zoo with 50 boreal species: polar bears, lynx, wolves, wolverines. Only zoo with polar bears in Finland.",
    price: "Adulti €22, bambini €18", priceEn: "Adults €22, children €18",
    url: "https://www.ranuazoo.com/en/", mapsUrl: "https://maps.google.com/?q=Ranua+Wildlife+Park" },

  { id: "poi-santapark", cat: "park", name: "SantaPark", nameEn: "SantaPark", lat: 66.5436, lng: 25.8473, country: "🇫🇮", city: "Rovaniemi", nearDay: "g13",
    desc: "Grotta sotterranea di Babbo Natale a Rovaniemi. Attività per famiglie, Ice Gallery, Elf School.",
    descEn: "Underground Santa Claus cave in Rovaniemi. Family activities, Ice Gallery, Elf School.",
    price: "Adulti €39, bambini €33", priceEn: "Adults €39, children €33",
    url: "https://santaparkarcticworld.com/santapark/", mapsUrl: "https://maps.google.com/?q=SantaPark+Rovaniemi" },

  { id: "poi-polaria", cat: "park", name: "Polaria", nameEn: "Polaria", lat: 69.6480, lng: 18.9570, country: "🇳🇴", city: "Tromsø", nearDay: "g16",
    desc: "Acquario artico a Tromsø. Foche barbute, cinema panoramico, esposizioni su clima artico.",
    descEn: "Arctic aquarium in Tromsø. Bearded seals, panoramic cinema, Arctic climate exhibitions.",
    price: "Adulti NOK 180, bambini NOK 90", priceEn: "Adults NOK 180, children NOK 90",
    url: "https://www.polaria.no/en/", mapsUrl: "https://maps.google.com/?q=Polaria+Tromsø" },

  { id: "poi-kristiansand", cat: "park", name: "Kristiansand Dyrepark", nameEn: "Kristiansand Zoo", lat: 58.1850, lng: 8.0700, country: "🇳🇴", city: "Kristiansand", nearDay: "g33",
    desc: "Zoo e parco divertimenti #1 in Norvegia. Mondo di Cardamom, Kaptein Sabeltann, animali da 5 continenti.",
    descEn: "Norway's #1 zoo and theme park. Cardamom Town, Captain Sabertooth, animals from 5 continents.",
    price: "Adulti NOK 499, bambini NOK 399", priceEn: "Adults NOK 499, children NOK 399",
    url: "https://www.dyreparken.no/english/", mapsUrl: "https://maps.google.com/?q=Dyreparken+Kristiansand" },

  { id: "poi-tivoli", cat: "park", name: "Tivoli Gardens", nameEn: "Tivoli Gardens", lat: 55.6736, lng: 12.5681, country: "🇩🇰", city: "Copenhagen", nearDay: "g35",
    desc: "Storico parco divertimenti di Copenhagen (1843). 30+ attrazioni, giardini, concerti. Secondo parco più antico al mondo.",
    descEn: "Historic Copenhagen amusement park (1843). 30+ rides, gardens, concerts. Second oldest park in the world.",
    price: "Ingresso DKK 155, giostre extra", priceEn: "Entry DKK 155, rides extra",
    url: "https://www.tivoli.dk/en/", mapsUrl: "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen" },

  { id: "poi-legoland", cat: "park", name: "Legoland Billund", nameEn: "Legoland Billund", lat: 55.7354, lng: 9.1268, country: "🇩🇰", city: "Billund", nearDay: "g38",
    desc: "Il Legoland originale (1968). 50+ attrazioni, Miniland con monumenti in LEGO, aree tematiche per tutte le età.",
    descEn: "The original Legoland (1968). 50+ rides, Miniland with LEGO monuments, themed areas for all ages.",
    price: "DKK 449 online, bambini <2 gratis", priceEn: "DKK 449 online, children <2 free",
    url: "https://www.legoland.dk/en/", mapsUrl: "https://maps.google.com/?q=Legoland+Billund" },

  { id: "poi-lalandia", cat: "park", name: "Lalandia Aquadome", nameEn: "Lalandia Aquadome", lat: 55.7300, lng: 9.1200, country: "🇩🇰", city: "Billund", nearDay: "g39",
    desc: "Il parco acquatico più grande della Scandinavia. Scivoli, piscina onde, area bambini, wellness. Clima tropicale tutto l'anno.",
    descEn: "Scandinavia's largest waterpark. Slides, wave pool, kids area, wellness. Tropical climate year-round.",
    price: "DKK 249/giorno (ospiti resort gratis)", priceEn: "DKK 249/day (resort guests free)",
    url: "https://www.lalandia.dk/en/billund/go-exploring/the-aquadome", mapsUrl: "https://maps.google.com/?q=Lalandia+Billund" },

  { id: "poi-heidepark", cat: "park", name: "Heide Park Resort", nameEn: "Heide Park Resort", lat: 53.0244, lng: 9.8781, country: "🇩🇪", city: "Soltau", nearDay: "g40",
    desc: "Il più grande parco divertimenti della Germania del nord. Colossos (montagna russa in legno), Krake, Flug der Dämonen.",
    descEn: "Northern Germany's largest theme park. Colossos (wooden coaster), Krake, Flug der Dämonen.",
    price: "€52 online, bambini <3 gratis", priceEn: "€52 online, children <3 free",
    url: "https://www.heide-park.de/en/", mapsUrl: "https://maps.google.com/?q=Heide+Park+Soltau" },

  { id: "poi-futuroscope", cat: "park", name: "Futuroscope", nameEn: "Futuroscope", lat: 46.6683, lng: 0.3678, country: "🇫🇷", city: "Poitiers", nearDay: "g42",
    desc: "Parco tematico sulla tecnologia e multimedia vicino a Poitiers. Attrazioni immersive, cinema 4D, realtà virtuale.",
    descEn: "Technology and multimedia theme park near Poitiers. Immersive attractions, 4D cinema, virtual reality.",
    price: "€42 adulti, €36 bambini", priceEn: "€42 adults, €36 children",
    url: "https://www.futuroscope.com/en", mapsUrl: "https://maps.google.com/?q=Futuroscope+Poitiers" },


  // ═══ MERCATI ═══
  { id: "poi-naschmarkt", cat: "market", name: "Naschmarkt", nameEn: "Naschmarkt", lat: 48.1988, lng: 16.3630, country: "🇦🇹", city: "Vienna", nearDay: "g2",
    desc: "Il mercato più famoso di Vienna (dal 1780). 120+ bancarelle: spezie, formaggi, olive, ristoranti etnici. Mercatino delle pulci il sabato.",
    descEn: "Vienna's most famous market (since 1780). 120+ stalls: spices, cheeses, olives, ethnic restaurants. Flea market on Saturdays.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.wien.info/en/shopping-wining-dining/markets/naschmarkt", mapsUrl: "https://maps.google.com/?q=Naschmarkt+Vienna" },

  { id: "poi-hala-mirowska", cat: "market", name: "Hala Mirowska", nameEn: "Hala Mirowska", lat: 52.2380, lng: 20.9920, country: "🇵🇱", city: "Warsaw", nearDay: "g3",
    desc: "Storico mercato coperto di Varsavia (1901). Frutta, verdura, carne, formaggi locali. Atmosfera autentica polacca.",
    descEn: "Historic covered market in Warsaw (1901). Fruits, vegetables, meat, local cheeses. Authentic Polish atmosphere.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://halamirowska.pl", mapsUrl: "https://maps.google.com/?q=Hala+Mirowska+Warsaw" },

  { id: "poi-hales-market", cat: "market", name: "Halės Turgus", nameEn: "Halės Market", lat: 54.6730, lng: 25.2830, country: "🇱🇹", city: "Vilnius", nearDay: "g4",
    desc: "Il mercato centrale di Vilnius. Prodotti freschi lituani, pane nero, formaggi cagliati, miele. Sezione gastronomia moderna.",
    descEn: "Vilnius central market. Fresh Lithuanian products, black bread, curd cheese, honey. Modern gastronomy section.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.halesturgus.lt", mapsUrl: "https://maps.google.com/?q=Halės+Turgus+Vilnius" },

  { id: "poi-riga-central", cat: "market", name: "Mercato Centrale di Riga", nameEn: "Riga Central Market", lat: 56.9422, lng: 24.1131, country: "🇱🇻", city: "Riga", nearDay: "g5",
    desc: "Il mercato più grande d'Europa (UNESCO). 5 padiglioni in ex-hangar Zeppelin. Pesce, carne, latticini, verdure, gastronomia.",
    descEn: "Europe's largest market (UNESCO). 5 pavilions in former Zeppelin hangars. Fish, meat, dairy, vegetables, gastronomy.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.centraltirgus.lv/en/", mapsUrl: "https://maps.google.com/?q=Riga+Central+Market" },

  { id: "poi-agenskalns-market", cat: "market", name: "Āgenskalns Market", nameEn: "Āgenskalns Market", lat: 56.9383, lng: 24.0856, country: "\ud83c\uddf1\ud83c\uddfb", city: "Riga", nearDay: "g5",
    desc: "Il mercato più antico della riva sinistra della Daugava (1898). Padiglione Art Nouveau ristrutturato. Prodotti locali, gastronomia, caffè, eventi culturali.",
    descEn: "The oldest market on the left bank of the Daugava (1898). Renovated Art Nouveau pavilion. Local produce, gastronomy, cafés, cultural events.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.agenskalnatirgus.lv/en", mapsUrl: "https://maps.google.com/?q=\u0100genskalns+Market+Riga" },

  { id: "poi-balti-jaam", cat: "market", name: "Balti Jaama Turg", nameEn: "Balti Jaam Market", lat: 59.4400, lng: 24.7370, country: "🇪🇪", city: "Tallinn", nearDay: "g6",
    desc: "Mercato moderno di Tallinn vicino alla stazione. Street food, prodotti locali estoni, artigianato, bar sul rooftop.",
    descEn: "Modern Tallinn market near the station. Street food, local Estonian products, crafts, rooftop bar.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://astfrm.ee/en/", mapsUrl: "https://maps.google.com/?q=Balti+Jaama+Turg+Tallinn" },

  { id: "poi-kauppatori", cat: "market", name: "Kauppatori", nameEn: "Helsinki Market Square", lat: 60.1675, lng: 24.9525, country: "🇫🇮", city: "Helsinki", nearDay: "g7",
    desc: "Piazza del mercato sul porto di Helsinki. Pesce fresco, frutti di bosco, artigianato finlandese. Old Market Hall adiacente.",
    descEn: "Market square on Helsinki harbour. Fresh fish, berries, Finnish crafts. Adjacent Old Market Hall.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.myhelsinki.fi/en/see-and-do/sights/market-square", mapsUrl: "https://maps.google.com/?q=Kauppatori+Helsinki" },

  { id: "poi-bergen-fish", cat: "market", name: "Fisketorget Bergen", nameEn: "Bergen Fish Market", lat: 60.3943, lng: 5.3259, country: "🇳🇴", city: "Bergen", nearDay: "g31",
    desc: "Storico mercato del pesce di Bergen (dal 1200). Granchio reale, salmone, gamberoni. Anche indoor con ristoranti.",
    descEn: "Historic Bergen fish market (since 1200). King crab, salmon, prawns. Also indoor with restaurants.",
    price: "Ingresso libero, piatti €15-30", priceEn: "Free entry, dishes €15-30",
    url: "https://www.visitbergen.com/things-to-do/fish-market-in-bergen-p822253", mapsUrl: "https://maps.google.com/?q=Fisketorget+Bergen" },

  { id: "poi-torvehallerne", cat: "market", name: "Torvehallerne", nameEn: "Torvehallerne", lat: 55.6839, lng: 12.5711, country: "🇩🇰", city: "Copenhagen", nearDay: "g35",
    desc: "Food hall di Copenhagen con 60+ bancarelle gourmet. Smørrebrød, pasticceria danese, caffè specialty, prodotti nordici.",
    descEn: "Copenhagen food hall with 60+ gourmet stalls. Smørrebrød, Danish pastries, specialty coffee, Nordic products.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://torvehallernekbh.dk/en/", mapsUrl: "https://maps.google.com/?q=Torvehallerne+Copenhagen" },

  { id: "poi-reffen", cat: "market", name: "Reffen Street Food", nameEn: "Reffen Street Food", lat: 55.6930, lng: 12.6100, country: "🇩🇰", city: "Copenhagen", nearDay: "g36",
    desc: "Il più grande mercato street food all'aperto dei Paesi Nordici. 50+ cucine dal mondo, birre artigianali, vista sul porto.",
    descEn: "The largest outdoor street food market in the Nordics. 50+ world cuisines, craft beers, harbour views.",
    price: "Ingresso libero, piatti DKK 80-130", priceEn: "Free entry, dishes DKK 80-130",
    url: "https://reframetheworld.com/en/reffen/", mapsUrl: "https://maps.google.com/?q=Reffen+Copenhagen" },

  { id: "poi-bretxa", cat: "market", name: "Mercado de la Bretxa", nameEn: "La Bretxa Market", lat: 43.3240, lng: -1.9870, country: "🇪🇸", city: "San Sebastián", nearDay: "g44",
    desc: "Mercato storico di San Sebastián (1870). Pesce fresco del Cantabrico, pintxos, prodotti baschi. Nel cuore della Parte Vieja.",
    descEn: "Historic San Sebastián market (1870). Fresh Cantabrian fish, pintxos, Basque products. In the heart of Parte Vieja.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.donostia.eus/ataria/es/web/mercadodelabretxa", mapsUrl: "https://maps.google.com/?q=Mercado+de+la+Bretxa+San+Sebastian" },

  { id: "poi-mercato-orientale", cat: "market", name: "Mercato Orientale", nameEn: "Mercato Orientale", lat: 44.4072, lng: 8.9422, country: "🇮🇹", city: "Genova", nearDay: "g53",
    desc: "Il mercato coperto più grande di Genova. Pesto fresco, focaccia, pesce, frutta. Food court al piano superiore (MOG).",
    descEn: "Genoa's largest covered market. Fresh pesto, focaccia, fish, fruit. Food court upstairs (MOG).",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.moggenova.it", mapsUrl: "https://maps.google.com/?q=Mercato+Orientale+Genova" },

  // ═══ PARCHI NAZIONALI ═══
  { id: "poi-lemmenjoki", cat: "nature", name: "Parco Nazionale Lemmenjoki", nameEn: "Lemmenjoki National Park", lat: 68.8500, lng: 26.0000, country: "🇫🇮", city: "Lemmenjoki", nearDay: "g14",
    desc: "La più grande riserva naturale della Finlandia (2.850 km²). Foreste vergini, fiumi per canoa, cercatori d'oro, cultura Sámi.",
    descEn: "Finland's largest nature reserve (2,850 km²). Virgin forests, rivers for canoeing, gold panners, Sámi culture.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.nationalparks.fi/lemmenjoki", mapsUrl: "https://maps.google.com/?q=Lemmenjoki+National+Park" },

  { id: "poi-urho-kekkonen", cat: "nature", name: "Parco Nazionale Urho Kekkonen", nameEn: "Urho Kekkonen National Park", lat: 68.3000, lng: 28.0000, country: "🇫🇮", city: "Saariselkä", nearDay: "g14",
    desc: "Secondo parco più grande della Finlandia (2.550 km²). Tundra, foreste di pini, renne selvatiche. Sentieri segnalati e wilderness huts.",
    descEn: "Finland's second largest park (2,550 km²). Tundra, pine forests, wild reindeer. Marked trails and wilderness huts.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.nationalparks.fi/urhokekkonennp", mapsUrl: "https://maps.google.com/?q=Urho+Kekkonen+National+Park" },

  { id: "poi-abisko", cat: "nature", name: "Parco Nazionale di Abisko", nameEn: "Abisko National Park", lat: 68.3500, lng: 18.8300, country: "🇸🇪", city: "Abisko", nearDay: "g16",
    desc: "Parco nazionale svedese in Lapponia (1909). Paesaggio montano artico, foreste di betulle, aurora boreale. Kungsleden trail. Deviazione da Tromsø (~200 km).",
    descEn: "Swedish national park in Lapland (1909). Arctic mountain landscape, birch forests, northern lights. Kungsleden trail. Detour from Tromsø (~200 km).",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.sverigesnationalparker.se/en/parks/abisko-national-park/", mapsUrl: "https://maps.google.com/?q=Abisko+National+Park+Sweden" },

  { id: "poi-anderdalen", cat: "nature", name: "Parco Nazionale Ånderdalen", nameEn: "Ånderdalen National Park", lat: 69.1000, lng: 16.9500, country: "🇳🇴", city: "Senja", nearDay: "g17",
    desc: "Unico parco nazionale dell'isola di Senja. Foreste costiere, laghi alpini, alci. Sentieri facili per famiglie.",
    descEn: "Senja island's only national park. Coastal forests, alpine lakes, moose. Easy family-friendly trails.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/anderdalen-national-park/200284/", mapsUrl: "https://maps.google.com/?q=Ånderdalen+National+Park+Senja" },

  { id: "poi-jotunheimen", cat: "nature", name: "Parco Nazionale Jotunheimen", nameEn: "Jotunheimen National Park", lat: 61.5000, lng: 8.3670, country: "🇳🇴", city: "Jotunheimen", nearDay: "g29",
    desc: "\"Casa dei Giganti\": il parco più popolare della Norvegia. Le 2 montagne più alte del nord Europa, cresta Besseggen, ghiacciai.",
    descEn: "\"Home of the Giants\": Norway's most popular park. Northern Europe's 2 highest peaks, Besseggen ridge, glaciers.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://jotunheimen.com/", mapsUrl: "https://maps.google.com/?q=Jotunheimen+National+Park" },

  { id: "poi-hardangervidda", cat: "nature", name: "Parco Nazionale Hardangervidda", nameEn: "Hardangervidda National Park", lat: 60.1000, lng: 7.5000, country: "🇳🇴", city: "Hardangervidda", nearDay: "g30",
    desc: "Il più grande parco nazionale della Norvegia (3.422 km²). Altopiano più grande d'Europa, renne selvatiche, cascate spettacolari.",
    descEn: "Norway's largest national park (3,422 km²). Europe's largest mountain plateau, wild reindeer, spectacular waterfalls.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/hardangervidda-national-park/186814/", mapsUrl: "https://maps.google.com/?q=Hardangervidda+National+Park" },

  { id: "poi-folgefonna", cat: "nature", name: "Parco Nazionale Folgefonna", nameEn: "Folgefonna National Park", lat: 60.0500, lng: 6.3500, country: "🇳🇴", city: "Folgefonna", nearDay: "g30",
    desc: "Terzo ghiacciaio più grande della Norvegia. Escursioni sul ghiacciaio, kayak nei fiordi, cascate. Tra Bergen e Hardanger.",
    descEn: "Norway's third largest glacier. Glacier hikes, fjord kayaking, waterfalls. Between Bergen and Hardanger.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/folgefonna-national-park/186815/", mapsUrl: "https://maps.google.com/?q=Folgefonna+National+Park" },

  { id: "poi-thy", cat: "nature", name: "Parco Nazionale Thy", nameEn: "Thy National Park", lat: 56.9500, lng: 8.3500, country: "🇩🇰", city: "Thy", nearDay: "g37",
    desc: "Il primo parco nazionale della Danimarca (2008). Dune, brughiere, foreste costiere. \"Cold Hawaii\" per il surf. Cervi e aquile.",
    descEn: "Denmark's first national park (2008). Dunes, heathlands, coastal forests. \"Cold Hawaii\" for surfing. Deer and eagles.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://nationalparkthy.dk/english/", mapsUrl: "https://maps.google.com/?q=Thy+National+Park+Denmark" },

  { id: "poi-picos", cat: "nature", name: "Parco Nazionale Picos de Europa", nameEn: "Picos de Europa National Park", lat: 43.1500, lng: -4.8000, country: "🇪🇸", city: "Picos de Europa", nearDay: "g46",
    desc: "Montagne calcaree spettacolari nel nord della Spagna. Funivia Fuente Dé (1.823m), gole del Cares, avvoltoi, camosci.",
    descEn: "Spectacular limestone mountains in northern Spain. Fuente Dé cable car (1,823m), Cares gorge, vultures, chamois.",
    price: "Ingresso gratuito, funivia €17", priceEn: "Free entry, cable car €17",
    url: "https://parquenacionalpicoseuropa.es/english/", mapsUrl: "https://maps.google.com/?q=Picos+de+Europa+National+Park" },

  { id: "poi-cap-creus", cat: "nature", name: "Parco Naturale Cap de Creus", nameEn: "Cap de Creus Natural Park", lat: 42.3190, lng: 3.3160, country: "🇪🇸", city: "Cap de Creus", nearDay: "g50",
    desc: "Il punto più orientale della penisola iberica. Scogliere vulcaniche, calette nascoste, paesaggio che ispirò Dalí.",
    descEn: "The easternmost point of the Iberian Peninsula. Volcanic cliffs, hidden coves, landscape that inspired Dalí.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://parcsnaturals.gencat.cat/en/cap-de-creus/", mapsUrl: "https://maps.google.com/?q=Cap+de+Creus+Natural+Park" },

  { id: "poi-calanques", cat: "nature", name: "Parco Nazionale Calanques", nameEn: "Calanques National Park", lat: 43.2100, lng: 5.4500, country: "🇫🇷", city: "Marseille", nearDay: "g51",
    desc: "Fiordi mediterranei tra Marsiglia e Cassis. Scogliere bianche, acque turchesi, sentieri costieri. Accesso limitato in estate.",
    descEn: "Mediterranean fjords between Marseille and Cassis. White cliffs, turquoise waters, coastal trails. Limited summer access.",
    price: "Ingresso gratuito (prenotazione estiva)", priceEn: "Free entry (summer booking required)",
    url: "https://www.calanques-parcnational.fr/en", mapsUrl: "https://maps.google.com/?q=Parc+National+des+Calanques" },

  { id: "poi-cinque-terre", cat: "nature", name: "Parco Nazionale Cinque Terre", nameEn: "Cinque Terre National Park", lat: 44.1280, lng: 9.7100, country: "🇮🇹", city: "Cinque Terre", nearDay: "g52",
    desc: "5 borghi colorati sulla costa ligure (UNESCO). Sentieri tra vigneti terrazzati, mare cristallino. Tra Côte d'Azur e Genova.",
    descEn: "5 colourful villages on the Ligurian coast (UNESCO). Trails through terraced vineyards, crystal sea. Between Côte d'Azur and Genoa.",
    price: "Cinque Terre Card €16/giorno", priceEn: "Cinque Terre Card €16/day",
    url: "https://www.parconazionale5terre.it/en/", mapsUrl: "https://maps.google.com/?q=Cinque+Terre+National+Park" }
];

// ─── v2.58: Single canonical haversine — shared across all modules ───
// All IIFE-local copies in app.js delegate here via window._haversineKm.
// Prevents silent divergence if one copy is patched and others are not.
window._haversineKm = function(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── v2.63: TRIP_META — single source of truth for all UI date/duration strings ───
// Generated from TRIP_START and TRIP_DAYS. Every file that displays dates uses this.
// Update ONLY data.js when the trip dates change — everything else auto-updates.
(function() {
  var s = TRIP_START;
  var e = TRIP_END;
  var days = TRIP_DAYS;

  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtIT(d) {
    var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                  'luglio','agosto','settembre','ottobre','novembre','dicembre'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }
  function fmtEN(d) {
    var months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function fmtShort(d) {
    return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear();
  }

  window.TRIP_META = {
    days:        days,
    // Italian
    startIT:     fmtIT(s),                              // "25 giugno 2026"
    endIT:       fmtIT(e),                              // "18 agosto 2026"
    rangeIT:     fmtIT(s) + ' – ' + fmtIT(e),          // "25 giugno 2026 – 18 agosto 2026"
    shortRangeIT: pad(s.getDate())+'/'+pad(s.getMonth()+1)+' → '+pad(e.getDate())+'/'+pad(e.getMonth()+1),
    daysIT:      days + ' giorni',                      // "55 giorni"
    summaryIT:   days + ' giorni · 13 paesi · 12.000 km',
    periodIT:    fmtShort(s) + ' (pomeriggio) → ' + fmtShort(e) + ' (sera) — ' + days + ' giorni',
    // English
    startEN:     fmtEN(s),                              // "June 25, 2026"
    endEN:       fmtEN(e),                              // "August 18, 2026"
    rangeEN:     fmtEN(s) + ' – ' + fmtEN(e),
    shortRangeEN: pad(s.getDate())+'/'+pad(s.getMonth()+1)+' → '+pad(e.getDate())+'/'+pad(e.getMonth()+1),
    daysEN:      days + ' days',
    summaryEN:   days + ' days · 13 countries · 12,000 km',
    periodEN:    fmtShort(s) + ' (afternoon) → ' + fmtShort(e) + ' (evening) — ' + days + ' days',
  };
})();
