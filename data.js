'use strict';
// ═══════════════════════════════════════════════════════════════
// data.js — Unica fonte di verità per Viaggio Europa 2026 V4.8
// ═══════════════════════════════════════════════════════════════

var TRIP_START = new Date('2026-06-26T00:00:00');
var TRIP_END = new Date('2026-08-18T23:59:59');
var TRIP_DAYS = 54;

// Tab order for swipe navigation (shared between app.js sections)
var TAB_ORDER = ['home', 'riepilogo', 'giorni', 'posizione', 'diario', 'cibo', 'cultura', 'attivita', 'piano', 'zaino', 'chat'];

// Owner UIDs — only these can write to Firebase
var OWNER_UIDS = ['RxlVlsfeaEeSwFUVYbKQujEsbBo1', 'QzXokvLGw2VgEAp4OTdgcmRTBPC3'];

// ─── Itinerario completo (54 giorni) ───
// Ogni entry alimenta: tabella, timeline, mappa, countdown
var itinerario = [
  {"id": "g0", "label": "G0", "labelEn": "D0", "data": "26/06", "tragitto": "Selvazzano ➔ Leoben", "tragittoEn": "Selvazzano ➔ Leoben", "km": "350", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇮🇹➔🇦🇹", "note": "Partenza pomeriggio, notte a Leoben — dove tutto è iniziato 🌒", "noteEn": "Departure afternoon, night in Leoben — where it all began 🌒", "mapsUrl": "https://maps.google.com/?q=Leoben+Austria", "mapsLabel": "📍 Leoben", "iconsText": "🌒", "icons": [], "region": 0, "desc": "Partenza pomeriggio, notte a Leoben — dove tutto è iniziato 🌒", "descEn": "Departure afternoon, night in Leoben — where it all began 🌒", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Leoben+Austria", "text": "📍 Leoben", "target": "_blank"}]},
  {"id": "g1", "label": "G1", "labelEn": "D1", "data": "27/06", "tragitto": "Leoben ➔ Vienna", "tragittoEn": "Leoben ➔ Vienna", "km": "150", "ore": "1h 45m", "oreEn": "1h 45m", "paesi": "🇦🇹", "note": "Amici a Vienna. Prater o Haus der Musik", "noteEn": "Friends in Vienna. Prater or Haus der Musik", "mapsUrl": "https://maps.google.com/?q=Prater+Wien", "mapsLabel": "📍 Prater Wien", "iconsText": "♨️ ♨️ Terme Wien", "icons": [{"href": "#a1", "text": "♨️ ♨️ Terme Wien"}], "region": 0, "desc": "Amici a Vienna. Prater o Haus der Musik", "descEn": "Friends in Vienna. Prater or Haus der Musik", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Prater+Wien", "text": "📍 Prater Wien", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a1", "text": "♨️ ♨️ Terme Wien"}]},
  {"id": "g2", "label": "G2", "labelEn": "D2", "data": "28/06", "tragitto": "Vienna ➔ Varsavia", "tragittoEn": "Vienna ➔ Warsaw", "km": "670", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇦🇹➔🇨🇿➔🇵🇱", "note": "Sosta Brno. Parco Fontane (⚠️ dom: no show serale)", "noteEn": "Stop in Brno. Fountain Park (⚠️ Sun: no evening show)", "mapsUrl": "https://maps.google.com/?q=Multimedia+Fountain+Park+Warsaw", "mapsLabel": "📍 Multimedia Fountain Warsaw", "iconsText": "➕ ➕ Europa C.", "icons": [{"href": "#b1", "text": "➕ ➕ Europa C."}], "region": 1, "desc": "Sosta Brno. Parco Fontane (⚠️ dom: no show serale)", "descEn": "Stop in Brno. Fountain Park (⚠️ Sun: no evening show)", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Multimedia+Fountain+Park+Warsaw", "text": "📍 Multimedia Fountain Warsaw", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b1", "text": "➕ ➕ Europa C."}]},
  {"id": "g3", "label": "G3", "labelEn": "D3", "data": "29/06", "tragitto": "Varsavia ➔ Vilnius", "tragittoEn": "Warsaw ➔ Vilnius", "km": "470", "ore": "6h 30m", "oreEn": "6h 30m", "paesi": "🇵🇱➔🇱🇹", "note": "Bernardinai Garden, Uzupis", "noteEn": "Bernardinai Garden, Uzupis", "mapsUrl": "https://maps.google.com/?q=Bernardine+Garden+Vilnius", "mapsLabel": "📍 Bernardine Garden Vilnius", "iconsText": "➕ ➕ Baltici", "icons": [{"href": "#b2", "text": "➕ ➕ Baltici"}], "region": 1, "desc": "Bernardinai Garden, Uzupis", "descEn": "Bernardinai Garden, Uzupis", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bernardine+Garden+Vilnius", "text": "📍 Bernardine Garden Vilnius", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b2", "text": "➕ ➕ Baltici"}]},
  {"id": "g4", "label": "G4", "labelEn": "D4", "data": "30/06", "tragitto": "Vilnius ➔ Riga", "tragittoEn": "Vilnius ➔ Riga", "km": "345", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇱🇹➔🇱🇻", "note": "Collina delle Croci. Motor Museum", "noteEn": "Hill of Crosses. Motor Museum", "mapsUrl": "https://maps.google.com/?q=56.0153,23.4161", "mapsLabel": "📍 Hill of Crosses Siauliai", "iconsText": "➕ ➕ Baltici", "icons": [{"href": "#b2", "text": "➕ ➕ Baltici"}], "region": 1, "desc": "Collina delle Croci. Motor Museum", "descEn": "Hill of Crosses. Motor Museum", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=56.0153,23.4161", "text": "📍 Hill of Crosses Siauliai", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b2", "text": "➕ ➕ Baltici"}]},
  {"id": "g5", "label": "G5", "labelEn": "D5", "data": "01/07", "tragitto": "Riga ➔ Tallinn", "tragittoEn": "Riga ➔ Tallinn", "km": "310", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇱🇻➔🇪🇪", "note": "🛣️ Via Baltica. Lennusadam", "noteEn": "🛣️ Via Baltica. Lennusadam", "mapsUrl": "https://maps.google.com/?q=Lennusadam+Seaplane+Harbour+Tallinn", "mapsLabel": "📍 Seaplane Harbour Tallinn", "iconsText": "➕ ➕ Baltici", "icons": [{"href": "#b2", "text": "➕ ➕ Baltici"}], "region": 1, "desc": "🛣️ Via Baltica. Lennusadam", "descEn": "🛣️ Via Baltica. Lennusadam", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Lennusadam+Seaplane+Harbour+Tallinn", "text": "📍 Seaplane Harbour Tallinn", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b2", "text": "➕ ➕ Baltici"}]},
  {"id": "g6", "label": "G6", "labelEn": "D6", "data": "02/07", "tragitto": "Tallinn ➔ Lappeenranta", "tragittoEn": "Tallinn ➔ Lappeenranta", "km": "250", "ore": "3h + trag.", "oreEn": "3h + ferry", "paesi": "🇪🇪➔🇫🇮", "note": "Traghetto 2h. Piazza Mercato Helsinki", "noteEn": "2h ferry. Helsinki Market Square", "mapsUrl": "https://maps.google.com/?q=Kauppatori+Helsinki", "mapsLabel": "📍 Market Square Helsinki", "iconsText": "➕ ➕ Finlandia", "icons": [{"href": "#b3", "text": "➕ ➕ Finlandia"}], "region": 2, "desc": "Traghetto 2h. Piazza Mercato Helsinki", "descEn": "2h ferry. Helsinki Market Square", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Kauppatori+Helsinki", "text": "📍 Market Square Helsinki", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b3", "text": "➕ ➕ Finlandia"}]},
  {"id": "g7", "label": "G7", "labelEn": "D7", "data": "03/07", "tragitto": "Lappeenranta ➔ Punkaharju", "tragittoEn": "Lappeenranta ➔ Punkaharju", "km": "100", "ore": "1h 30m", "oreEn": "1h 30m", "paesi": "🇫🇮", "note": "🛣️ Punkaharju Ridge Road", "noteEn": "🛣️ Punkaharju Ridge Road", "mapsUrl": "https://maps.google.com/?q=61.7667,29.3833", "mapsLabel": "📍 Punkaharju Ridge Road", "iconsText": "🎣", "icons": [], "region": 2, "desc": "🛣️ Punkaharju Ridge Road", "descEn": "🛣️ Punkaharju Ridge Road", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=61.7667,29.3833", "text": "📍 Punkaharju Ridge Road", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g8", "label": "G8", "labelEn": "D8", "data": "04/07", "tragitto": "Regione dei Laghi", "tragittoEn": "Lake District", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇫🇮", "note": "Canoa, pesca, sauna nel bosco", "noteEn": "Canoeing, fishing, forest sauna", "mapsUrl": "https://maps.google.com/?q=Saimaa+Lake+Finland", "mapsLabel": "📍 Saimaa Lake Finland", "iconsText": "♨️ ♨️ Sauna \n🎣", "icons": [{"href": "#a2", "text": "♨️ ♨️ Sauna"}], "region": 2, "desc": "Canoa, pesca, sauna nel bosco", "descEn": "Canoeing, fishing, forest sauna", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Saimaa+Lake+Finland", "text": "📍 Saimaa Lake Finland", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a2", "text": "♨️ ♨️ Sauna"}]},
  {"id": "g9", "label": "G9", "labelEn": "D9", "data": "05/07", "tragitto": "Laghi ➔ Oulu", "tragittoEn": "Lakes ➔ Oulu", "km": "450", "ore": "5h 30m", "oreEn": "5h 30m", "paesi": "🇫🇮", "note": "Risalita foreste boreali", "noteEn": "Climbing boreal forests", "mapsUrl": "https://maps.google.com/?q=Oulu+Finland", "mapsLabel": "📍 Oulu", "iconsText": "➕ ➕ Finlandia", "icons": [{"href": "#b3", "text": "➕ ➕ Finlandia"}], "region": 2, "desc": "Risalita foreste boreali", "descEn": "Climbing boreal forests", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Oulu+Finland", "text": "📍 Oulu", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b3", "text": "➕ ➕ Finlandia"}]},
  {"id": "g10", "label": "G10", "labelEn": "D10", "data": "06/07", "tragitto": "Oulu ➔ Ranua", "tragittoEn": "Oulu ➔ Ranua", "km": "160", "ore": "2h", "oreEn": "2h", "paesi": "🇫🇮", "note": "⭐ Ranua Wildlife Park", "noteEn": "⭐ Ranua Wildlife Park", "mapsUrl": "https://maps.google.com/?q=Ranua+Wildlife+Park", "mapsLabel": "📍 Ranua Resort", "iconsText": "—", "icons": [], "region": 2, "desc": "⭐ Ranua Wildlife Park", "descEn": "⭐ Ranua Wildlife Park", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Ranua+Wildlife+Park", "text": "📍 Ranua Resort", "target": "_blank"}]},
  {"id": "g11", "label": "G11", "labelEn": "D11", "data": "07/07", "tragitto": "Ranua ➔ Rovaniemi", "tragittoEn": "Ranua ➔ Rovaniemi", "km": "80", "ore": "1h", "oreEn": "1h", "paesi": "🇫🇮", "note": "Foto al Circolo Polare", "noteEn": "Photo at the Arctic Circle", "mapsUrl": "https://maps.google.com/?q=66.5436,25.8473", "mapsLabel": "📍 Santa Claus Village", "iconsText": "—", "icons": [], "region": 2, "desc": "Foto al Circolo Polare", "descEn": "Photo at the Arctic Circle", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=66.5436,25.8473", "text": "📍 Santa Claus Village", "target": "_blank"}]},
  {"id": "g12", "label": "G12", "labelEn": "D12", "data": "08/07", "tragitto": "Rovaniemi", "tragittoEn": "Rovaniemi", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇫🇮", "note": "⭐ Santa Claus Village + Arktikum", "noteEn": "⭐ Santa Claus Village + Arktikum", "mapsUrl": "https://maps.google.com/?q=Santa+Claus+Village+Rovaniemi", "mapsLabel": "📍 Santa Claus Main Office", "iconsText": "🎣", "icons": [], "region": 2, "desc": "⭐ Santa Claus Village + Arktikum", "descEn": "⭐ Santa Claus Village + Arktikum", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Santa+Claus+Village+Rovaniemi", "text": "📍 Santa Claus Main Office", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g13", "label": "G13", "labelEn": "D13", "data": "09/07", "tragitto": "Rovaniemi ➔ Inari", "tragittoEn": "Rovaniemi ➔ Inari", "km": "330", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇫🇮", "note": "Museo Siida. Renne", "noteEn": "Siida Museum. Reindeer", "mapsUrl": "https://maps.google.com/?q=69.0714,27.0142", "mapsLabel": "📍 Siida Museum Inari", "iconsText": "🎣", "icons": [], "region": 2, "desc": "Museo Siida. Renne", "descEn": "Siida Museum. Reindeer", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.0714,27.0142", "text": "📍 Siida Museum Inari", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g14", "label": "G14", "labelEn": "D14", "data": "10/07", "tragitto": "Inari ➔ Kilpisjärvi", "tragittoEn": "Inari ➔ Kilpisjärvi", "km": "300", "ore": "4h", "oreEn": "4h", "paesi": "🇫🇮", "note": "Treriksröset", "noteEn": "Treriksröset", "mapsUrl": "https://maps.google.com/?q=69.0485,20.7890", "mapsLabel": "📍 Kilpisjärvi", "iconsText": "🎣", "icons": [], "region": 2, "desc": "Treriksröset", "descEn": "Treriksröset", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.0485,20.7890", "text": "📍 Kilpisjärvi", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g15", "label": "G15", "labelEn": "D15", "data": "11/07", "tragitto": "Kilpisjärvi ➔ Tromsø", "tragittoEn": "Kilpisjärvi ➔ Tromsø", "km": "160", "ore": "2h 30m", "oreEn": "2h 30m", "paesi": "🇫🇮➔🇳🇴", "note": "Fjellheisen, Polaria", "noteEn": "Fjellheisen, Polaria", "mapsUrl": "https://maps.google.com/?q=Fjellheisen+Tromsø", "mapsLabel": "📍 Fjellheisen Tromsø", "iconsText": "♨️ ♨️ Pust \n🎣", "icons": [{"href": "#a3", "text": "♨️ ♨️ Pust"}], "region": 3, "desc": "Fjellheisen, Polaria", "descEn": "Fjellheisen, Polaria", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Fjellheisen+Tromsø", "text": "📍 Fjellheisen Tromsø", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a3", "text": "♨️ ♨️ Pust"}]},
  {"id": "g16", "label": "G16", "labelEn": "D16", "data": "12/07", "tragitto": "Tromsø ➔ Senja", "tragittoEn": "Tromsø ➔ Senja", "km": "170", "ore": "3h", "oreEn": "3h", "paesi": "🇳🇴", "note": "🛣️ Senja National Tourist Route. Tungeneset, Segla", "noteEn": "🛣️ Senja National Tourist Route. Tungeneset, Segla", "mapsUrl": "https://maps.google.com/?q=69.2950,17.0500", "mapsLabel": "📍 Tungeneset Senja", "iconsText": "🎣", "icons": [], "region": 3, "desc": "🛣️ Senja National Tourist Route. Tungeneset, Segla", "descEn": "🛣️ Senja National Tourist Route. Tungeneset, Segla", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.2950,17.0500", "text": "📍 Tungeneset Senja", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g17", "label": "G17", "labelEn": "D17", "data": "13/07", "tragitto": "Senja ➔ Andenes", "tragittoEn": "Senja ➔ Andenes", "km": "200", "ore": "4h", "oreEn": "4h", "paesi": "🇳🇴", "note": "🛣️ Andøya NTR. Ingresso Vesterålen", "noteEn": "🛣️ Andøya NTR. Entrance to Vesterålen", "mapsUrl": "https://maps.google.com/?q=69.3267,16.1317", "mapsLabel": "📍 Andenes Lighthouse", "iconsText": "🎣", "icons": [], "region": 3, "desc": "🛣️ Andøya NTR. Ingresso Vesterålen", "descEn": "🛣️ Andøya NTR. Entrance to Vesterålen", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.3267,16.1317", "text": "📍 Andenes Lighthouse", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g18", "label": "G18", "labelEn": "D18", "data": "14/07", "tragitto": "Andenes", "tragittoEn": "Andenes", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "⭐ Safari Balene + Space Center", "noteEn": "⭐ Whale Safari + Space Center", "mapsUrl": "https://maps.google.com/?q=69.3250,16.1300", "mapsLabel": "📍 Whale Safari Andenes", "iconsText": "🎣", "icons": [], "region": 3, "desc": "⭐ Safari Balene + Space Center", "descEn": "⭐ Whale Safari + Space Center", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=69.3250,16.1300", "text": "📍 Whale Safari Andenes", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g19", "label": "G19", "labelEn": "D19", "data": "15/07", "tragitto": "Andenes ➔ Svolvær", "tragittoEn": "Andenes ➔ Svolvær", "km": "210", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇳🇴", "note": "🛣️ Lofoten (E10) NTR. Ingresso Lofoten", "noteEn": "🛣️ Lofoten (E10) NTR. Entrance to Lofoten", "mapsUrl": "https://maps.google.com/?q=Svolvær+Lofoten", "mapsLabel": "📍 Svolvær", "iconsText": "🎣", "icons": [], "region": 3, "desc": "🛣️ Lofoten (E10) NTR. Ingresso Lofoten", "descEn": "🛣️ Lofoten (E10) NTR. Entrance to Lofoten", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Svolvær+Lofoten", "text": "📍 Svolvær", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g20", "label": "G20", "labelEn": "D20", "data": "16/07", "tragitto": "Svolvær ➔ Henningsvær", "tragittoEn": "Svolvær ➔ Henningsvær", "km": "30", "ore": "1h", "oreEn": "1h", "paesi": "🇳🇴", "note": "⭐ Reinebringen + Henningsvær", "noteEn": "⭐ Reinebringen + Henningsvær", "mapsUrl": "https://maps.google.com/?q=Henningsvær+Lofoten", "mapsLabel": "📍 Henningsvær", "iconsText": "🎣", "icons": [], "region": 3, "desc": "⭐ Reinebringen + Henningsvær", "descEn": "⭐ Reinebringen + Henningsvær", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Henningsvær+Lofoten", "text": "📍 Henningsvær", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g21", "label": "G21", "labelEn": "D21", "data": "17/07", "tragitto": "Lofoten (Spiagge)", "tragittoEn": "Lofoten (Beaches)", "km": "50", "ore": "1h", "oreEn": "1h", "paesi": "🇳🇴", "note": "Haukland e Ramberg", "noteEn": "Haukland and Ramberg", "mapsUrl": "https://maps.google.com/?q=68.2500,13.5833", "mapsLabel": "📍 Haukland Beach", "iconsText": "🎣", "icons": [], "region": 3, "desc": "Haukland e Ramberg", "descEn": "Haukland and Ramberg", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=68.2500,13.5833", "text": "📍 Haukland Beach", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g22", "label": "G22", "labelEn": "D22", "data": "18/07", "tragitto": "Lofoten (Reine)", "tragittoEn": "Lofoten (Reine)", "km": "40", "ore": "1h", "oreEn": "1h", "paesi": "🇳🇴", "note": "Kayak nel fiordo", "noteEn": "Kayak in the fjord", "mapsUrl": "https://maps.google.com/?q=Reine+Lofoten", "mapsLabel": "📍 Reine Lofoten", "iconsText": "🎣", "icons": [], "region": 3, "desc": "Kayak nel fiordo", "descEn": "Kayak in the fjord", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Reine+Lofoten", "text": "📍 Reine Lofoten", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g23", "label": "G23", "labelEn": "D23", "data": "19/07", "tragitto": "Lofoten (Relax)", "tragittoEn": "Lofoten (Relax)", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Nusfjord + Viking Museum", "noteEn": "Nusfjord + Viking Museum", "mapsUrl": "https://maps.google.com/?q=68.0333,13.3500", "mapsLabel": "📍 Nusfjord", "iconsText": "🎣", "icons": [], "region": 3, "desc": "Nusfjord + Viking Museum", "descEn": "Nusfjord + Viking Museum", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=68.0333,13.3500", "text": "📍 Nusfjord", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g24", "label": "G24", "labelEn": "D24", "data": "20/07", "tragitto": "Lofoten ➔ Mo i Rana", "tragittoEn": "Lofoten ➔ Mo i Rana", "km": "400", "ore": "5h + trag.", "oreEn": "5h + ferry", "paesi": "🇳🇴", "note": "⛴️ Moskenes–Bodø + Arctic Circle", "noteEn": "⛴️ Moskenes–Bodø + Arctic Circle", "mapsUrl": "https://maps.google.com/?q=66.5633,15.3117", "mapsLabel": "📍 Arctic Circle Centre", "iconsText": "➕ ➕ Norvegia N", "icons": [{"href": "#b4", "text": "➕ ➕ Norvegia N"}], "region": 3, "desc": "⛴️ Moskenes–Bodø + Arctic Circle", "descEn": "⛴️ Moskenes–Bodø + Arctic Circle", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=66.5633,15.3117", "text": "📍 Arctic Circle Centre", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b4", "text": "➕ ➕ Norvegia N"}]},
  {"id": "g25", "label": "G25", "labelEn": "D25", "data": "21/07", "tragitto": "Mo i Rana ➔ Trondheim", "tragittoEn": "Mo i Rana ➔ Trondheim", "km": "480", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇳🇴", "note": "🛣️ Helgelandskysten. Ghiacciaio Svartisen", "noteEn": "🛣️ Helgelandskysten. Svartisen Glacier", "mapsUrl": "https://maps.google.com/?q=Nidaros+Cathedral+Trondheim", "mapsLabel": "📍 Nidaros Cathedral", "iconsText": "—", "icons": [], "region": 3, "desc": "🛣️ Helgelandskysten. Ghiacciaio Svartisen", "descEn": "🛣️ Helgelandskysten. Svartisen Glacier", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Nidaros+Cathedral+Trondheim", "text": "📍 Nidaros Cathedral", "target": "_blank"}]},
  {"id": "g26", "label": "G26", "labelEn": "D26", "data": "22/07", "tragitto": "Trondheim", "tragittoEn": "Trondheim", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Cattedrale Nidaros + Bakklandet", "noteEn": "Nidaros Cathedral + Bakklandet", "mapsUrl": "https://maps.google.com/?q=Bakklandet+Trondheim", "mapsLabel": "📍 Bakklandet", "iconsText": "🎣", "icons": [], "region": 3, "desc": "Cattedrale Nidaros + Bakklandet", "descEn": "Nidaros Cathedral + Bakklandet", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bakklandet+Trondheim", "text": "📍 Bakklandet", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g27", "label": "G27", "labelEn": "D27", "data": "23/07", "tragitto": "Trondheim ➔ Molde", "tragittoEn": "Trondheim ➔ Molde", "km": "320", "ore": "5h 30m", "oreEn": "5h 30m", "paesi": "🇳🇴", "note": "⭐ Atlantic Road", "noteEn": "⭐ Atlantic Road", "mapsUrl": "https://maps.google.com/?q=63.0167,7.3500", "mapsLabel": "📍 Atlanterhavsveien", "iconsText": "🎣", "icons": [], "region": 3, "desc": "⭐ Atlantic Road", "descEn": "⭐ Atlantic Road", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=63.0167,7.3500", "text": "📍 Atlanterhavsveien", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g28", "label": "G28", "labelEn": "D28", "data": "24/07", "tragitto": "Molde ➔ Geiranger", "tragittoEn": "Molde ➔ Geiranger", "km": "180", "ore": "4h", "oreEn": "4h", "paesi": "🇳🇴", "note": "⭐ Trollstigen + Geiranger", "noteEn": "⭐ Trollstigen + Geiranger", "mapsUrl": "https://maps.google.com/?q=62.4567,7.6700", "mapsLabel": "📍 Trollstigen", "iconsText": "➕ ➕ Norvegia C", "icons": [{"href": "#b5", "text": "➕ ➕ Norvegia C"}], "region": 3, "desc": "⭐ Trollstigen + Geiranger", "descEn": "⭐ Trollstigen + Geiranger", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=62.4567,7.6700", "text": "📍 Trollstigen", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b5", "text": "➕ ➕ Norvegia C"}]},
  {"id": "g29", "label": "G29", "labelEn": "D29", "data": "25/07", "tragitto": "Geiranger ➔ Bergen", "tragittoEn": "Geiranger ➔ Bergen", "km": "380", "ore": "7h", "oreEn": "7h", "paesi": "🇳🇴", "note": "🛣️ Hardanger NTR. Fiordi panoramici", "noteEn": "🛣️ Hardanger NTR. Panoramic fjords", "mapsUrl": "https://maps.google.com/?q=Bryggen+Bergen", "mapsLabel": "📍 Bryggen Bergen", "iconsText": "➕ ➕ Norvegia C", "icons": [{"href": "#b5", "text": "➕ ➕ Norvegia C"}], "region": 3, "desc": "🛣️ Hardanger NTR. Fiordi panoramici", "descEn": "🛣️ Hardanger NTR. Panoramic fjords", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Bryggen+Bergen", "text": "📍 Bryggen Bergen", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b5", "text": "➕ ➕ Norvegia C"}]},
  {"id": "g30", "label": "G30", "labelEn": "D30", "data": "26/07", "tragitto": "Bergen", "tragittoEn": "Bergen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇳🇴", "note": "Mercato Pesce + Fløibanen", "noteEn": "Fish Market + Fløibanen", "mapsUrl": "https://maps.google.com/?q=Fløibanen+Bergen", "mapsLabel": "📍 Fløibanen", "iconsText": "🎣", "icons": [], "region": 3, "desc": "Mercato Pesce + Fløibanen", "descEn": "Fish Market + Fløibanen", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Fløibanen+Bergen", "text": "📍 Fløibanen", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g31", "label": "G31", "labelEn": "D31", "data": "27/07", "tragitto": "Bergen ➔ Stavanger", "tragittoEn": "Bergen ➔ Stavanger", "km": "210", "ore": "5h", "oreEn": "5h", "paesi": "🇳🇴", "note": "Traghetti interni", "noteEn": "Internal ferries", "mapsUrl": "https://maps.google.com/?q=Stavanger+Norway", "mapsLabel": "📍 Stavanger", "iconsText": "—", "icons": [], "region": 3, "desc": "Traghetti interni", "descEn": "Internal ferries", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Stavanger+Norway", "text": "📍 Stavanger", "target": "_blank"}]},
  {"id": "g32", "label": "G32", "labelEn": "D32", "data": "28/07", "tragitto": "Stavanger ➔ Kristiansand", "tragittoEn": "Stavanger ➔ Kristiansand", "km": "230", "ore": "4h", "oreEn": "4h", "paesi": "🇳🇴", "note": "⭐ Preikestolen", "noteEn": "⭐ Preikestolen", "mapsUrl": "https://maps.google.com/?q=58.9863,6.1885", "mapsLabel": "📍 Preikestolen Trailhead", "iconsText": "—", "icons": [], "region": 3, "desc": "⭐ Preikestolen", "descEn": "⭐ Preikestolen", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=58.9863,6.1885", "text": "📍 Preikestolen Trailhead", "target": "_blank"}]},
  {"id": "g33", "label": "G33", "labelEn": "D33", "data": "29/07", "tragitto": "K.sand ➔ Copenhagen", "tragittoEn": "K.sand ➔ Copenhagen", "km": "470", "ore": "5h + trag.", "oreEn": "5h + ferry", "paesi": "🇳🇴➔🇩🇰", "note": "⛴️ Color Line + Nyhavn", "noteEn": "⛴️ Color Line + Nyhavn", "mapsUrl": "https://maps.google.com/?q=Nyhavn+Copenhagen", "mapsLabel": "📍 Nyhavn", "iconsText": "➕ ➕ Danimarca", "icons": [{"href": "#b6", "text": "➕ ➕ Danimarca"}], "region": 4, "desc": "⛴️ Color Line + Nyhavn", "descEn": "⛴️ Color Line + Nyhavn", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Nyhavn+Copenhagen", "text": "📍 Nyhavn", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b6", "text": "➕ ➕ Danimarca"}]},
  {"id": "g34", "label": "G34", "labelEn": "D34", "data": "30/07", "tragitto": "Copenhagen", "tragittoEn": "Copenhagen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Tivoli + canali", "noteEn": "⭐ Tivoli + canals", "mapsUrl": "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen", "mapsLabel": "📍 Tivoli Gardens", "iconsText": "—", "icons": [], "region": 4, "desc": "⭐ Tivoli + canali", "descEn": "⭐ Tivoli + canals", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen", "text": "📍 Tivoli Gardens", "target": "_blank"}]},
  {"id": "g35", "label": "G35", "labelEn": "D35", "data": "31/07", "tragitto": "Copenhagen", "tragittoEn": "Copenhagen", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Experimentarium", "noteEn": "⭐ Experimentarium", "mapsUrl": "https://maps.google.com/?q=Reffen+Copenhagen+Street+Food", "mapsLabel": "📍 Reffen", "iconsText": "—", "icons": [], "region": 4, "desc": "⭐ Experimentarium", "descEn": "⭐ Experimentarium", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Reffen+Copenhagen+Street+Food", "text": "📍 Reffen", "target": "_blank"}]},
  {"id": "g36", "label": "G36", "labelEn": "D36", "data": "01/08", "tragitto": "Copenhagen ➔ Billund", "tragittoEn": "Copenhagen ➔ Billund", "km": "260", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇩🇰", "note": "🛣️ Ponte Storebælt. Odense", "noteEn": "🛣️ Storebælt Bridge. Odense", "mapsUrl": "https://maps.google.com/?q=LEGO+House+Billund", "mapsLabel": "📍 LEGO House", "iconsText": "➕ ➕ Danimarca", "icons": [{"href": "#b6", "text": "➕ ➕ Danimarca"}], "region": 4, "desc": "🛣️ Ponte Storebælt. Odense", "descEn": "🛣️ Storebælt Bridge. Odense", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=LEGO+House+Billund", "text": "📍 LEGO House", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b6", "text": "➕ ➕ Danimarca"}]},
  {"id": "g37", "label": "G37", "labelEn": "D37", "data": "02/08", "tragitto": "Legoland", "tragittoEn": "Legoland", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ Legoland", "noteEn": "⭐ Legoland", "mapsUrl": "https://maps.google.com/?q=Legoland+Billund", "mapsLabel": "📍 Legoland Billund", "iconsText": "—", "icons": [], "region": 4, "desc": "⭐ Legoland", "descEn": "⭐ Legoland", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Legoland+Billund", "text": "📍 Legoland Billund", "target": "_blank"}]},
  {"id": "g38", "label": "G38", "labelEn": "D38", "data": "03/08", "tragitto": "LEGO House + Lalandia", "tragittoEn": "LEGO House + Lalandia", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇩🇰", "note": "⭐ LEGO House", "noteEn": "⭐ LEGO House", "mapsUrl": "https://maps.google.com/?q=LEGO+House+Billund", "mapsLabel": "📍 LEGO House Billund", "iconsText": "♨️ ♨️ Aquadome", "icons": [{"href": "#a4", "text": "♨️ ♨️ Aquadome"}], "region": 5, "desc": "⭐ LEGO House", "descEn": "⭐ LEGO House", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=LEGO+House+Billund", "text": "📍 LEGO House Billund", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a4", "text": "♨️ ♨️ Aquadome"}]},
  {"id": "g39", "label": "G39", "labelEn": "D39", "data": "04/08", "tragitto": "Billund ➔ Brema", "tragittoEn": "Billund ➔ Bremen", "km": "330", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇩🇰➔🇩🇪", "note": "🛣️ Margueritruten. Ribe + Musicanti", "noteEn": "🛣️ Marguerite Route. Ribe + Musicians", "mapsUrl": "https://maps.google.com/?q=Town+Musicians+of+Bremen+Statue", "mapsLabel": "📍 Bremen Musicians", "iconsText": "—", "icons": [], "region": 5, "desc": "🛣️ Margueritruten. Ribe + Musicanti", "descEn": "🛣️ Marguerite Route. Ribe + Musicians", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Town+Musicians+of+Bremen+Statue", "text": "📍 Bremen Musicians", "target": "_blank"}]},
  {"id": "g40", "label": "G40", "labelEn": "D40", "data": "05/08", "tragitto": "Brema ➔ Amiens", "tragittoEn": "Bremen ➔ Amiens", "km": "670", "ore": "7h 30m", "oreEn": "7h 30m", "paesi": "🇩🇪➔🇫🇷", "note": "Cattedrale + Hortillonnages", "noteEn": "Cathedral + Hortillonnages", "mapsUrl": "https://maps.google.com/?q=Amiens+Cathedral", "mapsLabel": "📍 Amiens Cathedral", "iconsText": "—", "icons": [], "region": 5, "desc": "Cattedrale + Hortillonnages", "descEn": "Cathedral + Hortillonnages", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Amiens+Cathedral", "text": "📍 Amiens Cathedral", "target": "_blank"}]},
  {"id": "g41", "label": "G41", "labelEn": "D41", "data": "06/08", "tragitto": "Amiens ➔ Loira", "tragittoEn": "Amiens ➔ Loire", "km": "350", "ore": "4h 30m", "oreEn": "4h 30m", "paesi": "🇫🇷", "note": "Arrivo Valle dei Re", "noteEn": "Arrival in the Valley of the Kings", "mapsUrl": "https://maps.google.com/?q=Château+d'Amboise", "mapsLabel": "📍 Amboise", "iconsText": "—", "icons": [], "region": 5, "desc": "Arrivo Valle dei Re", "descEn": "Arrival in the Valley of the Kings", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Château+d'Amboise", "text": "📍 Amboise", "target": "_blank"}]},
  {"id": "g42", "label": "G42", "labelEn": "D42", "data": "07/08", "tragitto": "Castelli della Loira", "tragittoEn": "Loire Castles", "km": "50", "ore": "1h", "oreEn": "1h", "paesi": "🇫🇷", "note": "⭐ Clos Lucé + Chenonceau", "noteEn": "⭐ Clos Lucé + Chenonceau", "mapsUrl": "https://maps.google.com/?q=Clos+Lucé+Amboise", "mapsLabel": "📍 Clos Lucé", "iconsText": "➕ ➕ Francia \n🎣", "icons": [{"href": "#b7", "text": "➕ ➕ Francia"}], "region": 5, "desc": "⭐ Clos Lucé + Chenonceau", "descEn": "⭐ Clos Lucé + Chenonceau", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Clos+Lucé+Amboise", "text": "📍 Clos Lucé", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b7", "text": "➕ ➕ Francia"}]},
  {"id": "g43", "label": "G43", "labelEn": "D43", "data": "08/08", "tragitto": "Loira ➔ San Sebastián", "tragittoEn": "Loire ➔ San Sebastián", "km": "600", "ore": "6h 30m", "oreEn": "6h 30m", "paesi": "🇫🇷➔🇪🇸", "note": "⭐ Gaztelugatxe + Pintxos", "noteEn": "⭐ Gaztelugatxe + Pintxos", "mapsUrl": "https://maps.google.com/?q=Zurriola+Beach+San+Sebastian", "mapsLabel": "📍 Zurriola Beach", "iconsText": "♨️ ♨️ La Perla \n🎣", "icons": [{"href": "#a5", "text": "♨️ ♨️ La Perla"}], "region": 6, "desc": "⭐ Gaztelugatxe + Pintxos", "descEn": "⭐ Gaztelugatxe + Pintxos", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Zurriola+Beach+San+Sebastian", "text": "📍 Zurriola Beach", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a5", "text": "♨️ ♨️ La Perla"}]},
  {"id": "g44", "label": "G44", "labelEn": "D44", "data": "09/08", "tragitto": "San Sebastián ➔ Bilbao", "tragittoEn": "San Sebastián ➔ Bilbao", "km": "100", "ore": "1h 30m", "oreEn": "1h 30m", "paesi": "🇪🇸", "note": "⭐ Guggenheim Bilbao", "noteEn": "⭐ Guggenheim Bilbao", "mapsUrl": "https://maps.google.com/?q=Guggenheim+Museum+Bilbao", "mapsLabel": "📍 Guggenheim Bilbao", "iconsText": "🎣", "icons": [], "region": 6, "desc": "⭐ Guggenheim Bilbao", "descEn": "⭐ Guggenheim Bilbao", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Guggenheim+Museum+Bilbao", "text": "📍 Guggenheim Bilbao", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g45", "label": "G45", "labelEn": "D45", "data": "10/08", "tragitto": "Bilbao ➔ Picos de Europa", "tragittoEn": "Bilbao ➔ Picos de Europa", "km": "180", "ore": "2h 30m", "oreEn": "2h 30m", "paesi": "🇪🇸", "note": "⭐ Fuente Dé + Picos", "noteEn": "⭐ Fuente Dé + Picos", "mapsUrl": "https://maps.google.com/?q=43.1500,-4.8000", "mapsLabel": "📍 Fuente Dé", "iconsText": "♨️ ♨️ La Hermida \n ➕ ➕ Spagna N \n🎣", "icons": [{"href": "#a6", "text": "♨️ ♨️ La Hermida"}, {"href": "#b8", "text": "➕ ➕ Spagna N"}], "region": 6, "desc": "⭐ Fuente Dé + Picos", "descEn": "⭐ Fuente Dé + Picos", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=43.1500,-4.8000", "text": "📍 Fuente Dé", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#a6", "text": "♨️ ♨️ La Hermida"}, {"type": "tag", "class": "hot", "href": "#b8", "text": "➕ ➕ Spagna N"}]},
  {"id": "g46", "label": "G46", "labelEn": "D46", "data": "11/08", "tragitto": "Picos ➔ Palencia", "tragittoEn": "Picos ➔ Palencia", "km": "200", "ore": "3h", "oreEn": "3h", "paesi": "🇪🇸", "note": "Arrivo + sopralluogo spot eclissi", "noteEn": "Arrival + eclipse spot inspection", "mapsUrl": "https://maps.google.com/?q=Palencia+Spain", "mapsLabel": "📍 Palencia", "iconsText": "➕ ➕ Spagna N \n ♨️ ♨️ Castilla", "icons": [{"href": "#b8", "text": "➕ ➕ Spagna N"}, {"href": "#a7", "text": "♨️ ♨️ Castilla"}], "region": 6, "desc": "Arrivo + sopralluogo spot eclissi", "descEn": "Arrival + eclipse spot inspection", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Palencia+Spain", "text": "📍 Palencia", "target": "_blank"}, {"type": "tag", "class": "hot", "href": "#b8", "text": "➕ ➕ Spagna N"}, {"type": "tag", "class": "hot", "href": "#a7", "text": "♨️ ♨️ Castilla"}]},
  {"id": "g47", "label": "G47", "labelEn": "D47", "data": "12/08", "tragitto": "🌒 ECLISSI TOTALE", "tragittoEn": "🌒 TOTAL ECLIPSE", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇪🇸", "note": "⭐⭐⭐ ECLISSI TOTALE", "noteEn": "⭐⭐⭐ TOTAL ECLIPSE", "mapsUrl": "https://maps.google.com/?q=Palencia+Spain", "mapsLabel": "📍 Palencia, Spain", "iconsText": "—", "icons": [], "region": 6, "desc": "⭐⭐⭐ ECLISSI TOTALE", "descEn": "⭐⭐⭐ TOTAL ECLIPSE", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Palencia+Spain", "text": "📍 Palencia, Spain", "target": "_blank"}]},
  {"id": "g48", "label": "G48", "labelEn": "D48", "data": "13/08", "tragitto": "Palencia ➔ Costa Brava", "tragittoEn": "Palencia ➔ Costa Brava", "km": "720", "ore": "8h 30m", "oreEn": "8h 30m", "paesi": "🇪🇸", "note": "Cadaqués, Cap de Creus", "noteEn": "Cadaqués, Cap de Creus", "mapsUrl": "https://maps.google.com/?q=Costa+Brava+Spain", "mapsLabel": "📍 Costa Brava", "iconsText": "➕ ➕ Rientro \n🎣", "icons": [{"href": "#b9", "text": "➕ ➕ Rientro"}], "region": 6, "desc": "Cadaqués, Cap de Creus", "descEn": "Cadaqués, Cap de Creus", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Costa+Brava+Spain", "text": "📍 Costa Brava", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b9", "text": "➕ ➕ Rientro"}]},
  {"id": "g49", "label": "G49", "labelEn": "D49", "data": "14/08", "tragitto": "Costa Brava (relax)", "tragittoEn": "Costa Brava (relax)", "km": "30", "ore": "—", "oreEn": "—", "paesi": "🇪🇸", "note": "Cadaqués, Cap de Creus, spiagge", "noteEn": "Cadaqués, Cap de Creus, beaches", "mapsUrl": "https://maps.google.com/?q=Cadaqués+Spain", "mapsLabel": "📍 Cadaqués", "iconsText": "🎣", "icons": [], "region": 6, "desc": "Cadaqués, Cap de Creus, spiagge", "descEn": "Cadaqués, Cap de Creus, beaches", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Cadaqués+Spain", "text": "📍 Cadaqués", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g50", "label": "G50", "labelEn": "D50", "data": "15/08", "tragitto": "Costa Brava ➔ C. Azzurra", "tragittoEn": "Costa Brava ➔ C. Azzurra", "km": "560", "ore": "6h", "oreEn": "6h", "paesi": "🇪🇸➔🇫🇷", "note": "Mare (o Camargue)", "noteEn": "Sea (or Camargue)", "mapsUrl": "https://maps.google.com/?q=Côte+d'Azur+France", "mapsLabel": "📍 Cote d'Azur", "iconsText": "➕ ➕ Rientro \n🎣", "icons": [{"href": "#b9", "text": "➕ ➕ Rientro"}], "region": 6, "desc": "Mare (o Camargue)", "descEn": "Sea (or Camargue)", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Côte+d'Azur+France", "text": "📍 Cote d'Azur", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b9", "text": "➕ ➕ Rientro"}]},
  {"id": "g51", "label": "G51", "labelEn": "D51", "data": "16/08", "tragitto": "C. Azzurra ➔ Genova", "tragittoEn": "C. Azzurra ➔ Genoa", "km": "200", "ore": "4h", "oreEn": "4h", "paesi": "🇫🇷➔🇮🇹", "note": "⭐ Acquario di Genova", "noteEn": "⭐ Genoa Aquarium", "mapsUrl": "https://maps.google.com/?q=Acquario+di+Genova", "mapsLabel": "📍 Acquario di Genova", "iconsText": "➕ ➕ Rientro", "icons": [{"href": "#b9", "text": "➕ ➕ Rientro"}], "region": 7, "desc": "⭐ Acquario di Genova", "descEn": "⭐ Genoa Aquarium", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Acquario+di+Genova", "text": "📍 Acquario di Genova", "target": "_blank"}, {"type": "tag", "class": "alt", "href": "#b9", "text": "➕ ➕ Rientro"}]},
  {"id": "g52", "label": "G52", "labelEn": "D52", "data": "17/08", "tragitto": "Genova", "tragittoEn": "Genoa", "km": "0", "ore": "—", "oreEn": "—", "paesi": "🇮🇹", "note": "Porto Antico + Galata + Boccadasse", "noteEn": "Old Port + Galata + Boccadasse", "mapsUrl": "https://maps.google.com/?q=Porto+Antico+Genova", "mapsLabel": "📍 Porto Antico Genova", "iconsText": "🎣", "icons": [], "region": 7, "desc": "Porto Antico + Galata + Boccadasse", "descEn": "Old Port + Galata + Boccadasse", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Porto+Antico+Genova", "text": "📍 Porto Antico Genova", "target": "_blank"}, {"type": "tag-plain", "class": "alt", "text": "🎣"}]},
  {"id": "g53", "label": "G53", "labelEn": "D53", "data": "18/08", "tragitto": "Genova ➔ Selvazzano", "tragittoEn": "Genoa ➔ Selvazzano", "km": "300", "ore": "3h 30m", "oreEn": "3h 30m", "paesi": "🇮🇹", "note": "Rientro a casa", "noteEn": "Return home", "mapsUrl": "https://maps.google.com/?q=Selvazzano+Dentro+Padova", "mapsLabel": "📍 Selvazzano Dentro", "iconsText": "—", "icons": [], "region": 7, "desc": "Rientro a casa", "descEn": "Return home", "bottom": [{"type": "link", "href": "https://maps.google.com/?q=Selvazzano+Dentro+Padova", "text": "📍 Selvazzano Dentro", "target": "_blank"}]}
];

// ─── Regioni per la timeline mobile ───
var regioni = [
  {"label": "🇦🇹 Europa Centrale", "labelEn": "🇦🇹 Central Europe", "startDay": "g0", "endDay": "g1"},
  {"label": "🇱🇹🇱🇻🇪🇪 Paesi Baltici", "labelEn": "🇱🇹🇱🇻🇪🇪 Baltic States", "startDay": "g2", "endDay": "g5"},
  {"label": "🇫🇮 Finlandia & Lapponia", "labelEn": "🇫🇮 Finland & Lapland", "startDay": "g6", "endDay": "g14"},
  {"label": "🇳🇴 Norvegia", "labelEn": "🇳🇴 Norway", "startDay": "g15", "endDay": "g32"},
  {"label": "🇩🇰 Danimarca", "labelEn": "🇩🇰 Denmark", "startDay": "g33", "endDay": "g37"},
  {"label": "🇩🇪🇫🇷 Germania & Francia", "labelEn": "🇩🇪🇫🇷 Germany & France", "startDay": "g38", "endDay": "g42"},
  {"label": "🇪🇸 Spagna", "labelEn": "🇪🇸 Spain", "startDay": "g43", "endDay": "g50"},
  {"label": "🇫🇷🇮🇹 Rientro", "labelEn": "🇫🇷🇮🇹 Return", "startDay": "g51", "endDay": "g53"}
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
var firebaseConfig = {
  apiKey: "AIzaSyCuUYGu_5PlIlDbxwYsFYL5y4OmoGehzzg",
  authDomain: "viaggio-europa-2026.firebaseapp.com",
  databaseURL: "https://viaggio-europa-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "viaggio-europa-2026",
  storageBucket: "viaggio-europa-2026.firebasestorage.app",
  messagingSenderId: "859844907239",
  appId: "1:859844907239:web:f226b10961df1fe66fd242"
};

var VAPID_KEY = 'BBW43ENkLgM_oXOaCCyo_m3voilbfw2fdlqjtopognVCmyiGXAibwedF94Og56uQdh61lvLqokMfleROBYhYkis';

// ─── POI: Parchi Divertimento, Mercati, Parchi Nazionali ───
// Categorie: "park" = Parchi divertimento, "market" = Mercati, "nature" = Parchi nazionali
var POI_ATTIVITA = [
  // ═══ PARCHI DIVERTIMENTO ═══
  { id: "poi-prater", cat: "park", name: "Wiener Prater", nameEn: "Vienna Prater", lat: 48.2134, lng: 16.4042, country: "🇦🇹", nearDay: "g1",
    desc: "Parco divertimenti storico (1897). Ruota panoramica Riesenrad, 250+ attrazioni. Ingresso gratuito, singole attrazioni a pagamento.",
    descEn: "Historic amusement park (1897). Giant Ferris wheel Riesenrad, 250+ rides. Free entry, pay per ride.",
    price: "Ingresso gratuito, giostre €3-6", priceEn: "Free entry, rides €3-6",
    url: "https://www.praterwien.com", mapsUrl: "https://maps.google.com/?q=Wurstelprater+Vienna" },

  { id: "poi-linnanmaki", cat: "park", name: "Linnanmäki", nameEn: "Linnanmäki", lat: 60.1878, lng: 24.9400, country: "🇫🇮", nearDay: "g6",
    desc: "Il parco divertimenti più antico e popolare della Finlandia (1950). 40+ attrazioni, ingresso gratuito. Ricavato va in beneficenza.",
    descEn: "Finland's oldest and most popular amusement park (1950). 40+ rides, free entry. Profits go to charity.",
    price: "Ingresso gratuito, braccialetto giostre ~€44", priceEn: "Free entry, ride wristband ~€44",
    url: "https://www.linnanmaki.fi/en/", mapsUrl: "https://maps.google.com/?q=Linnanmäki+Helsinki" },

  { id: "poi-ranua", cat: "park", name: "Ranua Wildlife Park", nameEn: "Ranua Wildlife Park", lat: 65.9300, lng: 26.5100, country: "🇫🇮", nearDay: "g10",
    desc: "Zoo artico con 50 specie boreali: orsi polari, linci, lupi, ghiottoni. Unico zoo con orsi polari in Finlandia.",
    descEn: "Arctic zoo with 50 boreal species: polar bears, lynx, wolves, wolverines. Only zoo with polar bears in Finland.",
    price: "Adulti €22, bambini €18", priceEn: "Adults €22, children €18",
    url: "https://www.ranuazoo.com/en/", mapsUrl: "https://maps.google.com/?q=Ranua+Wildlife+Park" },

  { id: "poi-santapark", cat: "park", name: "SantaPark", nameEn: "SantaPark", lat: 66.5436, lng: 25.8473, country: "🇫🇮", nearDay: "g12",
    desc: "Grotta sotterranea di Babbo Natale a Rovaniemi. Attività per famiglie, Ice Gallery, Elf School.",
    descEn: "Underground Santa Claus cave in Rovaniemi. Family activities, Ice Gallery, Elf School.",
    price: "Adulti €39, bambini €33", priceEn: "Adults €39, children €33",
    url: "https://santaparkarcticworld.com/santapark/", mapsUrl: "https://maps.google.com/?q=SantaPark+Rovaniemi" },

  { id: "poi-polaria", cat: "park", name: "Polaria", nameEn: "Polaria", lat: 69.6480, lng: 18.9570, country: "🇳🇴", nearDay: "g15",
    desc: "Acquario artico a Tromsø. Foche barbute, cinema panoramico, esposizioni su clima artico.",
    descEn: "Arctic aquarium in Tromsø. Bearded seals, panoramic cinema, Arctic climate exhibitions.",
    price: "Adulti NOK 180, bambini NOK 90", priceEn: "Adults NOK 180, children NOK 90",
    url: "https://www.polaria.no/en/", mapsUrl: "https://maps.google.com/?q=Polaria+Tromsø" },

  { id: "poi-kristiansand", cat: "park", name: "Kristiansand Dyrepark", nameEn: "Kristiansand Zoo", lat: 58.1850, lng: 8.0700, country: "🇳🇴", nearDay: "g32",
    desc: "Zoo e parco divertimenti #1 in Norvegia. Mondo di Cardamom, Kaptein Sabeltann, animali da 5 continenti.",
    descEn: "Norway's #1 zoo and theme park. Cardamom Town, Captain Sabertooth, animals from 5 continents.",
    price: "Adulti NOK 499, bambini NOK 399", priceEn: "Adults NOK 499, children NOK 399",
    url: "https://www.dyreparken.no/english/", mapsUrl: "https://maps.google.com/?q=Dyreparken+Kristiansand" },

  { id: "poi-tivoli", cat: "park", name: "Tivoli Gardens", nameEn: "Tivoli Gardens", lat: 55.6736, lng: 12.5681, country: "🇩🇰", nearDay: "g34",
    desc: "Storico parco divertimenti di Copenhagen (1843). 30+ attrazioni, giardini, concerti. Secondo parco più antico al mondo.",
    descEn: "Historic Copenhagen amusement park (1843). 30+ rides, gardens, concerts. Second oldest park in the world.",
    price: "Ingresso DKK 155, giostre extra", priceEn: "Entry DKK 155, rides extra",
    url: "https://www.tivoli.dk/en/", mapsUrl: "https://maps.google.com/?q=Tivoli+Gardens+Copenhagen" },

  { id: "poi-legoland", cat: "park", name: "Legoland Billund", nameEn: "Legoland Billund", lat: 55.7354, lng: 9.1268, country: "🇩🇰", nearDay: "g37",
    desc: "Il Legoland originale (1968). 50+ attrazioni, Miniland con monumenti in LEGO, aree tematiche per tutte le età.",
    descEn: "The original Legoland (1968). 50+ rides, Miniland with LEGO monuments, themed areas for all ages.",
    price: "DKK 449 online, bambini <2 gratis", priceEn: "DKK 449 online, children <2 free",
    url: "https://www.legoland.dk/en/", mapsUrl: "https://maps.google.com/?q=Legoland+Billund" },

  { id: "poi-lalandia", cat: "park", name: "Lalandia Aquadome", nameEn: "Lalandia Aquadome", lat: 55.7300, lng: 9.1200, country: "🇩🇰", nearDay: "g38",
    desc: "Il parco acquatico più grande della Scandinavia. Scivoli, piscina onde, area bambini, wellness. Clima tropicale tutto l'anno.",
    descEn: "Scandinavia's largest waterpark. Slides, wave pool, kids area, wellness. Tropical climate year-round.",
    price: "DKK 249/giorno (ospiti resort gratis)", priceEn: "DKK 249/day (resort guests free)",
    url: "https://www.lalandia.dk/en/billund/go-exploring/the-aquadome", mapsUrl: "https://maps.google.com/?q=Lalandia+Billund" },

  { id: "poi-heidepark", cat: "park", name: "Heide Park Resort", nameEn: "Heide Park Resort", lat: 53.0244, lng: 9.8781, country: "🇩🇪", nearDay: "g39",
    desc: "Il più grande parco divertimenti della Germania del nord. Colossos (montagna russa in legno), Krake, Flug der Dämonen.",
    descEn: "Northern Germany's largest theme park. Colossos (wooden coaster), Krake, Flug der Dämonen.",
    price: "€52 online, bambini <3 gratis", priceEn: "€52 online, children <3 free",
    url: "https://www.heide-park.de/en/", mapsUrl: "https://maps.google.com/?q=Heide+Park+Soltau" },

  { id: "poi-futuroscope", cat: "park", name: "Futuroscope", nameEn: "Futuroscope", lat: 46.6683, lng: 0.3678, country: "🇫🇷", nearDay: "g41",
    desc: "Parco tematico sulla tecnologia e multimedia vicino a Poitiers. Attrazioni immersive, cinema 4D, realtà virtuale.",
    descEn: "Technology and multimedia theme park near Poitiers. Immersive attractions, 4D cinema, virtual reality.",
    price: "€42 adulti, €36 bambini", priceEn: "€42 adults, €36 children",
    url: "https://www.futuroscope.com/en", mapsUrl: "https://maps.google.com/?q=Futuroscope+Poitiers" },

  { id: "poi-acquario-genova", cat: "park", name: "Acquario di Genova", nameEn: "Genoa Aquarium", lat: 44.4097, lng: 8.9268, country: "🇮🇹", nearDay: "g51",
    desc: "Il più grande acquario d'Europa. 70 vasche, 12.000 animali, 600 specie. Delfini, squali, pinguini.",
    descEn: "Europe's largest aquarium. 70 tanks, 12,000 animals, 600 species. Dolphins, sharks, penguins.",
    price: "€29 adulti, €21 bambini", priceEn: "€29 adults, €21 children",
    url: "https://www.acquariodigenova.it/en/", mapsUrl: "https://maps.google.com/?q=Acquario+di+Genova" },

  // ═══ MERCATI ═══
  { id: "poi-naschmarkt", cat: "market", name: "Naschmarkt", nameEn: "Naschmarkt", lat: 48.1988, lng: 16.3630, country: "🇦🇹", nearDay: "g1",
    desc: "Il mercato più famoso di Vienna (dal 1780). 120+ bancarelle: spezie, formaggi, olive, ristoranti etnici. Mercatino delle pulci il sabato.",
    descEn: "Vienna's most famous market (since 1780). 120+ stalls: spices, cheeses, olives, ethnic restaurants. Flea market on Saturdays.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.wien.info/en/shopping-wining-dining/markets/naschmarkt", mapsUrl: "https://maps.google.com/?q=Naschmarkt+Vienna" },

  { id: "poi-hala-mirowska", cat: "market", name: "Hala Mirowska", nameEn: "Hala Mirowska", lat: 52.2380, lng: 20.9920, country: "🇵🇱", nearDay: "g2",
    desc: "Storico mercato coperto di Varsavia (1901). Frutta, verdura, carne, formaggi locali. Atmosfera autentica polacca.",
    descEn: "Historic covered market in Warsaw (1901). Fruits, vegetables, meat, local cheeses. Authentic Polish atmosphere.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://halamirowska.pl", mapsUrl: "https://maps.google.com/?q=Hala+Mirowska+Warsaw" },

  { id: "poi-hales-market", cat: "market", name: "Halės Turgus", nameEn: "Halės Market", lat: 54.6730, lng: 25.2830, country: "🇱🇹", nearDay: "g3",
    desc: "Il mercato centrale di Vilnius. Prodotti freschi lituani, pane nero, formaggi cagliati, miele. Sezione gastronomia moderna.",
    descEn: "Vilnius central market. Fresh Lithuanian products, black bread, curd cheese, honey. Modern gastronomy section.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.halesturgus.lt", mapsUrl: "https://maps.google.com/?q=Halės+Turgus+Vilnius" },

  { id: "poi-riga-central", cat: "market", name: "Mercato Centrale di Riga", nameEn: "Riga Central Market", lat: 56.9422, lng: 24.1131, country: "🇱🇻", nearDay: "g4",
    desc: "Il mercato più grande d'Europa (UNESCO). 5 padiglioni in ex-hangar Zeppelin. Pesce, carne, latticini, verdure, gastronomia.",
    descEn: "Europe's largest market (UNESCO). 5 pavilions in former Zeppelin hangars. Fish, meat, dairy, vegetables, gastronomy.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.centraltirgus.lv/en/", mapsUrl: "https://maps.google.com/?q=Riga+Central+Market" },

  { id: "poi-balti-jaam", cat: "market", name: "Balti Jaama Turg", nameEn: "Balti Jaam Market", lat: 59.4400, lng: 24.7370, country: "🇪🇪", nearDay: "g5",
    desc: "Mercato moderno di Tallinn vicino alla stazione. Street food, prodotti locali estoni, artigianato, bar sul rooftop.",
    descEn: "Modern Tallinn market near the station. Street food, local Estonian products, crafts, rooftop bar.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://astfrm.ee/en/", mapsUrl: "https://maps.google.com/?q=Balti+Jaama+Turg+Tallinn" },

  { id: "poi-kauppatori", cat: "market", name: "Kauppatori", nameEn: "Helsinki Market Square", lat: 60.1675, lng: 24.9525, country: "🇫🇮", nearDay: "g6",
    desc: "Piazza del mercato sul porto di Helsinki. Pesce fresco, frutti di bosco, artigianato finlandese. Old Market Hall adiacente.",
    descEn: "Market square on Helsinki harbour. Fresh fish, berries, Finnish crafts. Adjacent Old Market Hall.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.myhelsinki.fi/en/see-and-do/sights/market-square", mapsUrl: "https://maps.google.com/?q=Kauppatori+Helsinki" },

  { id: "poi-bergen-fish", cat: "market", name: "Fisketorget Bergen", nameEn: "Bergen Fish Market", lat: 60.3943, lng: 5.3259, country: "🇳🇴", nearDay: "g30",
    desc: "Storico mercato del pesce di Bergen (dal 1200). Granchio reale, salmone, gamberoni. Anche indoor con ristoranti.",
    descEn: "Historic Bergen fish market (since 1200). King crab, salmon, prawns. Also indoor with restaurants.",
    price: "Ingresso libero, piatti €15-30", priceEn: "Free entry, dishes €15-30",
    url: "https://www.visitbergen.com/things-to-do/fish-market-in-bergen-p822253", mapsUrl: "https://maps.google.com/?q=Fisketorget+Bergen" },

  { id: "poi-torvehallerne", cat: "market", name: "Torvehallerne", nameEn: "Torvehallerne", lat: 55.6839, lng: 12.5711, country: "🇩🇰", nearDay: "g34",
    desc: "Food hall di Copenhagen con 60+ bancarelle gourmet. Smørrebrød, pasticceria danese, caffè specialty, prodotti nordici.",
    descEn: "Copenhagen food hall with 60+ gourmet stalls. Smørrebrød, Danish pastries, specialty coffee, Nordic products.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://torvehallernekbh.dk/en/", mapsUrl: "https://maps.google.com/?q=Torvehallerne+Copenhagen" },

  { id: "poi-reffen", cat: "market", name: "Reffen Street Food", nameEn: "Reffen Street Food", lat: 55.6930, lng: 12.6100, country: "🇩🇰", nearDay: "g35",
    desc: "Il più grande mercato street food all'aperto dei Paesi Nordici. 50+ cucine dal mondo, birre artigianali, vista sul porto.",
    descEn: "The largest outdoor street food market in the Nordics. 50+ world cuisines, craft beers, harbour views.",
    price: "Ingresso libero, piatti DKK 80-130", priceEn: "Free entry, dishes DKK 80-130",
    url: "https://reframetheworld.com/en/reffen/", mapsUrl: "https://maps.google.com/?q=Reffen+Copenhagen" },

  { id: "poi-bretxa", cat: "market", name: "Mercado de la Bretxa", nameEn: "La Bretxa Market", lat: 43.3240, lng: -1.9870, country: "🇪🇸", nearDay: "g43",
    desc: "Mercato storico di San Sebastián (1870). Pesce fresco del Cantabrico, pintxos, prodotti baschi. Nel cuore della Parte Vieja.",
    descEn: "Historic San Sebastián market (1870). Fresh Cantabrian fish, pintxos, Basque products. In the heart of Parte Vieja.",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.donostia.eus/ataria/es/web/mercadodelabretxa", mapsUrl: "https://maps.google.com/?q=Mercado+de+la+Bretxa+San+Sebastian" },

  { id: "poi-mercato-orientale", cat: "market", name: "Mercato Orientale", nameEn: "Mercato Orientale", lat: 44.4072, lng: 8.9422, country: "🇮🇹", nearDay: "g52",
    desc: "Il mercato coperto più grande di Genova. Pesto fresco, focaccia, pesce, frutta. Food court al piano superiore (MOG).",
    descEn: "Genoa's largest covered market. Fresh pesto, focaccia, fish, fruit. Food court upstairs (MOG).",
    price: "Ingresso libero", priceEn: "Free entry",
    url: "https://www.moggenova.it", mapsUrl: "https://maps.google.com/?q=Mercato+Orientale+Genova" },

  // ═══ PARCHI NAZIONALI ═══
  { id: "poi-abisko", cat: "nature", name: "Parco Nazionale di Abisko", nameEn: "Abisko National Park", lat: 68.3500, lng: 18.8300, country: "🇸🇪", nearDay: "g15",
    desc: "Parco nazionale svedese in Lapponia (1909). Paesaggio montano artico, foreste di betulle, aurora boreale. Kungsleden trail. Deviazione da Tromsø (~200 km).",
    descEn: "Swedish national park in Lapland (1909). Arctic mountain landscape, birch forests, northern lights. Kungsleden trail. Detour from Tromsø (~200 km).",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.sverigesnationalparker.se/en/parks/abisko-national-park/", mapsUrl: "https://maps.google.com/?q=Abisko+National+Park+Sweden" },

  { id: "poi-lemmenjoki", cat: "nature", name: "Parco Nazionale Lemmenjoki", nameEn: "Lemmenjoki National Park", lat: 68.8500, lng: 26.0000, country: "🇫🇮", nearDay: "g13",
    desc: "La più grande riserva naturale della Finlandia (2.850 km²). Foreste vergini, fiumi per canoa, cercatori d'oro, cultura Sámi.",
    descEn: "Finland's largest nature reserve (2,850 km²). Virgin forests, rivers for canoeing, gold panners, Sámi culture.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.nationalparks.fi/lemmenjoki", mapsUrl: "https://maps.google.com/?q=Lemmenjoki+National+Park" },

  { id: "poi-urho-kekkonen", cat: "nature", name: "Parco Nazionale Urho Kekkonen", nameEn: "Urho Kekkonen National Park", lat: 68.3000, lng: 28.0000, country: "🇫🇮", nearDay: "g13",
    desc: "Secondo parco più grande della Finlandia (2.550 km²). Tundra, foreste di pini, renne selvatiche. Sentieri segnalati e wilderness huts.",
    descEn: "Finland's second largest park (2,550 km²). Tundra, pine forests, wild reindeer. Marked trails and wilderness huts.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.nationalparks.fi/urhokekkonennp", mapsUrl: "https://maps.google.com/?q=Urho+Kekkonen+National+Park" },

  { id: "poi-anderdalen", cat: "nature", name: "Parco Nazionale Ånderdalen", nameEn: "Ånderdalen National Park", lat: 69.1000, lng: 16.9500, country: "🇳🇴", nearDay: "g16",
    desc: "Unico parco nazionale dell'isola di Senja. Foreste costiere, laghi alpini, alci. Sentieri facili per famiglie.",
    descEn: "Senja island's only national park. Coastal forests, alpine lakes, moose. Easy family-friendly trails.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/anderdalen-national-park/200284/", mapsUrl: "https://maps.google.com/?q=Ånderdalen+National+Park+Senja" },

  { id: "poi-jotunheimen", cat: "nature", name: "Parco Nazionale Jotunheimen", nameEn: "Jotunheimen National Park", lat: 61.5000, lng: 8.3670, country: "🇳🇴", nearDay: "g28",
    desc: "\"Casa dei Giganti\": il parco più popolare della Norvegia. Le 2 montagne più alte del nord Europa, cresta Besseggen, ghiacciai.",
    descEn: "\"Home of the Giants\": Norway's most popular park. Northern Europe's 2 highest peaks, Besseggen ridge, glaciers.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://jotunheimen.com/", mapsUrl: "https://maps.google.com/?q=Jotunheimen+National+Park" },

  { id: "poi-hardangervidda", cat: "nature", name: "Parco Nazionale Hardangervidda", nameEn: "Hardangervidda National Park", lat: 60.1000, lng: 7.5000, country: "🇳🇴", nearDay: "g29",
    desc: "Il più grande parco nazionale della Norvegia (3.422 km²). Altopiano più grande d'Europa, renne selvatiche, cascate spettacolari.",
    descEn: "Norway's largest national park (3,422 km²). Europe's largest mountain plateau, wild reindeer, spectacular waterfalls.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/hardangervidda-national-park/186814/", mapsUrl: "https://maps.google.com/?q=Hardangervidda+National+Park" },

  { id: "poi-folgefonna", cat: "nature", name: "Parco Nazionale Folgefonna", nameEn: "Folgefonna National Park", lat: 60.0500, lng: 6.3500, country: "🇳🇴", nearDay: "g29",
    desc: "Terzo ghiacciaio più grande della Norvegia. Escursioni sul ghiacciaio, kayak nei fiordi, cascate. Tra Bergen e Hardanger.",
    descEn: "Norway's third largest glacier. Glacier hikes, fjord kayaking, waterfalls. Between Bergen and Hardanger.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://www.visitnorway.com/listings/folgefonna-national-park/186815/", mapsUrl: "https://maps.google.com/?q=Folgefonna+National+Park" },

  { id: "poi-thy", cat: "nature", name: "Parco Nazionale Thy", nameEn: "Thy National Park", lat: 56.9500, lng: 8.3500, country: "🇩🇰", nearDay: "g36",
    desc: "Il primo parco nazionale della Danimarca (2008). Dune, brughiere, foreste costiere. \"Cold Hawaii\" per il surf. Cervi e aquile.",
    descEn: "Denmark's first national park (2008). Dunes, heathlands, coastal forests. \"Cold Hawaii\" for surfing. Deer and eagles.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://nationalparkthy.dk/english/", mapsUrl: "https://maps.google.com/?q=Thy+National+Park+Denmark" },

  { id: "poi-picos", cat: "nature", name: "Parco Nazionale Picos de Europa", nameEn: "Picos de Europa National Park", lat: 43.1500, lng: -4.8000, country: "🇪🇸", nearDay: "g45",
    desc: "Montagne calcaree spettacolari nel nord della Spagna. Funivia Fuente Dé (1.823m), gole del Cares, avvoltoi, camosci.",
    descEn: "Spectacular limestone mountains in northern Spain. Fuente Dé cable car (1,823m), Cares gorge, vultures, chamois.",
    price: "Ingresso gratuito, funivia €17", priceEn: "Free entry, cable car €17",
    url: "https://parquenacionalpicoseuropa.es/english/", mapsUrl: "https://maps.google.com/?q=Picos+de+Europa+National+Park" },

  { id: "poi-cap-creus", cat: "nature", name: "Parco Naturale Cap de Creus", nameEn: "Cap de Creus Natural Park", lat: 42.3190, lng: 3.3160, country: "🇪🇸", nearDay: "g49",
    desc: "Il punto più orientale della penisola iberica. Scogliere vulcaniche, calette nascoste, paesaggio che ispirò Dalí.",
    descEn: "The easternmost point of the Iberian Peninsula. Volcanic cliffs, hidden coves, landscape that inspired Dalí.",
    price: "Ingresso gratuito", priceEn: "Free entry",
    url: "https://parcsnaturals.gencat.cat/en/cap-de-creus/", mapsUrl: "https://maps.google.com/?q=Cap+de+Creus+Natural+Park" },

  { id: "poi-calanques", cat: "nature", name: "Parco Nazionale Calanques", nameEn: "Calanques National Park", lat: 43.2100, lng: 5.4500, country: "🇫🇷", nearDay: "g50",
    desc: "Fiordi mediterranei tra Marsiglia e Cassis. Scogliere bianche, acque turchesi, sentieri costieri. Accesso limitato in estate.",
    descEn: "Mediterranean fjords between Marseille and Cassis. White cliffs, turquoise waters, coastal trails. Limited summer access.",
    price: "Ingresso gratuito (prenotazione estiva)", priceEn: "Free entry (summer booking required)",
    url: "https://www.calanques-parcnational.fr/en", mapsUrl: "https://maps.google.com/?q=Parc+National+des+Calanques" },

  { id: "poi-cinque-terre", cat: "nature", name: "Parco Nazionale Cinque Terre", nameEn: "Cinque Terre National Park", lat: 44.1280, lng: 9.7100, country: "🇮🇹", nearDay: "g51",
    desc: "5 borghi colorati sulla costa ligure (UNESCO). Sentieri tra vigneti terrazzati, mare cristallino. Tra Côte d'Azur e Genova.",
    descEn: "5 colourful villages on the Ligurian coast (UNESCO). Trails through terraced vineyards, crystal sea. Between Côte d'Azur and Genoa.",
    price: "Cinque Terre Card €16/giorno", priceEn: "Cinque Terre Card €16/day",
    url: "https://www.parconazionale5terre.it/en/", mapsUrl: "https://maps.google.com/?q=Cinque+Terre+National+Park" }
];
