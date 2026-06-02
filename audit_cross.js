var fs = require('fs');

// Load all data sources
var dataContent = fs.readFileSync('data.js', 'utf8');
var dataFn = new Function(dataContent + '\nreturn { POI_ATTIVITA: POI_ATTIVITA, itinerario: itinerario, regioni: regioni, giorniTabIndex: giorniTabIndex };');
var data = dataFn();

var wikiContent = fs.readFileSync('wiki-links.js', 'utf8');
var wikiFn = new Function(wikiContent + '\nreturn WIKI_LINKS;');
var WIKI_LINKS = wikiFn();

var wcContent = fs.readFileSync('weather-coords.js', 'utf8');
var wcFn = new Function(wcContent + '\nreturn TRIP_COORDS;');
var TRIP_COORDS = wcFn();

var html = fs.readFileSync('index.html', 'utf8');
var htmlEn = fs.readFileSync('index_en.html', 'utf8');

var issues = [];
var warnings = [];

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  AUDIT CROSS-REFERENCE, COERENZA E DUPLICATI        ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════
// 1. POI_ATTIVITA DUPLICATES
// ═══════════════════════════════════════════════════════
console.log('═══ 1. POI_ATTIVITA — Duplicati ═══');

// Check duplicate IDs
var poiIds = {};
var poiNames = {};
data.POI_ATTIVITA.forEach(function(p) {
  if (poiIds[p.id]) {
    issues.push('POI ID duplicato: ' + p.id);
    console.log('  ❌ ID duplicato: ' + p.id);
  }
  poiIds[p.id] = p;
  
  var key = p.name.toLowerCase().trim();
  if (poiNames[key]) {
    // Same name, different category?
    if (poiNames[key].cat !== p.cat) {
      warnings.push('POI nome simile in categorie diverse: "' + p.name + '" (' + p.cat + ') vs (' + poiNames[key].cat + ')');
      console.log('  ⚠️  Nome simile categorie diverse: "' + p.name + '" → ' + p.cat + ' vs ' + poiNames[key].cat);
    } else {
      issues.push('POI nome duplicato stessa categoria: "' + p.name + '" (' + p.cat + ')');
      console.log('  ❌ Nome duplicato: "' + p.name + '" (' + p.cat + ')');
    }
  }
  poiNames[key] = p;
});

// Check for very similar names (Levenshtein-like)
var poiList = data.POI_ATTIVITA;
for (var i = 0; i < poiList.length; i++) {
  for (var j = i + 1; j < poiList.length; j++) {
    var a = poiList[i].name.toLowerCase();
    var b = poiList[j].name.toLowerCase();
    // Check if one contains the other (potential duplicate)
    if (a.length > 5 && b.length > 5) {
      if (a.indexOf(b) !== -1 || b.indexOf(a) !== -1) {
        if (poiList[i].cat === poiList[j].cat) {
          warnings.push('POI nomi contenuti: "' + poiList[i].name + '" / "' + poiList[j].name + '" (' + poiList[i].cat + ')');
          console.log('  ⚠️  Nomi contenuti: "' + poiList[i].name + '" / "' + poiList[j].name + '"');
        }
      }
    }
    // Check same coordinates (within 0.01 degree ~ 1km)
    if (Math.abs(poiList[i].lat - poiList[j].lat) < 0.01 && Math.abs(poiList[i].lng - poiList[j].lng) < 0.01) {
      if (poiList[i].cat === poiList[j].cat) {
        warnings.push('POI stesse coordinate (~1km): "' + poiList[i].name + '" / "' + poiList[j].name + '" (' + poiList[i].cat + ')');
        console.log('  ⚠️  Stesse coordinate: "' + poiList[i].name + '" / "' + poiList[j].name + '" [' + poiList[i].lat + ',' + poiList[i].lng + ']');
      }
    }
  }
}
if (!issues.length && !warnings.length) console.log('  ✅ Nessun duplicato');

// ═══════════════════════════════════════════════════════
// 2. CROSS-REFERENCE: POI nearDay vs itinerario
// ═══════════════════════════════════════════════════════
console.log('\n═══ 2. POI nearDay vs itinerario — Coerenza ═══');
var itinIds = data.itinerario.map(function(t) { return t.id; });
data.POI_ATTIVITA.forEach(function(p) {
  if (itinIds.indexOf(p.nearDay) === -1) {
    issues.push('POI "' + p.name + '" ha nearDay=' + p.nearDay + ' che non esiste in itinerario');
    console.log('  ❌ "' + p.name + '" nearDay=' + p.nearDay + ' non trovato in itinerario');
  }
});
if (!issues.filter(function(i) { return i.indexOf('nearDay') !== -1; }).length) {
  console.log('  ✅ Tutti i nearDay corrispondono a tappe valide');
}

// ═══════════════════════════════════════════════════════
// 3. CROSS-REFERENCE: POI country vs itinerario country
// ═══════════════════════════════════════════════════════
console.log('\n═══ 3. POI country vs itinerario — Coerenza geografica ═══');
// Build day→country map from itinerario
var dayCountry = {};
data.itinerario.forEach(function(t) {
  dayCountry[t.id] = t.country || t.flag || '';
});
var geoMismatches = 0;
data.POI_ATTIVITA.forEach(function(p) {
  var itinCountry = dayCountry[p.nearDay] || '';
  if (p.country && itinCountry && p.country !== itinCountry) {
    // This might be OK for border areas or detours
    warnings.push('POI "' + p.name + '" (' + p.country + ') su giorno ' + p.nearDay + ' che è in ' + itinCountry);
    geoMismatches++;
  }
});
if (geoMismatches > 0) {
  console.log('  ⚠️  ' + geoMismatches + ' POI con paese diverso dal giorno (possibili deviazioni)');
} else {
  console.log('  ✅ Tutti i POI nel paese corretto per il giorno');
}

// ═══════════════════════════════════════════════════════
// 4. WIKI_LINKS vs itinerario
// ═══════════════════════════════════════════════════════
console.log('\n═══ 4. WIKI_LINKS vs itinerario — Completezza ═══');
var wikiKeys = Object.keys(WIKI_LINKS);
var missingWiki = [];
itinIds.forEach(function(id) {
  if (wikiKeys.indexOf(id) === -1) {
    missingWiki.push(id);
  }
});
if (missingWiki.length) {
  console.log('  ⚠️  Giorni senza WIKI_LINKS: ' + missingWiki.join(', '));
  warnings.push('Giorni senza wiki links: ' + missingWiki.join(', '));
} else {
  console.log('  ✅ Tutti i giorni hanno wiki links');
}

// ═══════════════════════════════════════════════════════
// 5. TRIP_COORDS vs itinerario
// ═══════════════════════════════════════════════════════
console.log('\n═══ 5. TRIP_COORDS vs itinerario — Completezza ═══');
if (TRIP_COORDS.length !== data.itinerario.length) {
  issues.push('TRIP_COORDS ha ' + TRIP_COORDS.length + ' entries ma itinerario ha ' + data.itinerario.length);
  console.log('  ❌ Lunghezza diversa: TRIP_COORDS=' + TRIP_COORDS.length + ' vs itinerario=' + data.itinerario.length);
} else {
  console.log('  ✅ Stessa lunghezza (' + TRIP_COORDS.length + ')');
}

// Check city names match between TRIP_COORDS and itinerario
var cityMismatches = [];
for (var i = 0; i < Math.min(TRIP_COORDS.length, data.itinerario.length); i++) {
  var coordCity = TRIP_COORDS[i].city.toLowerCase();
  var itinCity = (data.itinerario[i].city || data.itinerario[i].name || '').toLowerCase();
  // Loose match - just check if one contains the other or first word matches
  var coordFirst = coordCity.split(/[\s,\/]/)[0];
  var itinFirst = itinCity.split(/[\s,\/]/)[0];
  if (coordFirst !== itinFirst && coordCity.indexOf(itinFirst) === -1 && itinCity.indexOf(coordFirst) === -1) {
    cityMismatches.push('G' + i + ': TRIP_COORDS="' + TRIP_COORDS[i].city + '" vs itinerario="' + (data.itinerario[i].city || data.itinerario[i].name) + '"');
  }
}
if (cityMismatches.length) {
  console.log('  ⚠️  ' + cityMismatches.length + ' possibili mismatch città:');
  cityMismatches.forEach(function(m) { console.log('    ' + m); });
  cityMismatches.forEach(function(m) { warnings.push(m); });
} else {
  console.log('  ✅ Città corrispondono');
}

// ═══════════════════════════════════════════════════════
// 6. HTML internal links — broken anchors
// ═══════════════════════════════════════════════════════
console.log('\n═══ 6. Link interni HTML — Ancore rotte ═══');
// Extract all href="#xxx" and check if id="xxx" exists
var hrefMatches = html.match(/href="#[^"]+"/g) || [];
var idMatches = html.match(/id="[^"]+"/g) || [];
var allIds = {};
idMatches.forEach(function(m) {
  var id = m.match(/id="([^"]+)"/)[1];
  allIds[id] = true;
});

var brokenLinks = [];
var checkedHrefs = {};
hrefMatches.forEach(function(m) {
  var href = m.match(/href="#([^"]+)"/)[1];
  if (checkedHrefs[href]) return;
  checkedHrefs[href] = true;
  // Skip JS-rendered anchors (gN days rendered by JS, poi-list-* rendered by JS)
  if (href.match(/^g\d+$/) && parseInt(href.replace('g', '')) <= 53) return; // day anchors rendered by JS
  if (!allIds[href]) {
    brokenLinks.push(href);
  }
});
if (brokenLinks.length) {
  console.log('  ❌ ' + brokenLinks.length + ' link interni senza ancora:');
  brokenLinks.forEach(function(l) { console.log('    #' + l); });
  brokenLinks.forEach(function(l) { issues.push('Link rotto: #' + l); });
} else {
  console.log('  ✅ Tutti i link interni hanno ancora corrispondente');
}

// ═══════════════════════════════════════════════════════
// 7. POI referenced in itinerario text
// ═══════════════════════════════════════════════════════
console.log('\n═══ 7. POI cross-reference con itinerario ═══');
// Check if POI names appear in the itinerario descriptions
var poiNotReferenced = [];
data.POI_ATTIVITA.forEach(function(p) {
  // Check if the POI name or a key part appears in the HTML near its day
  var searchName = p.name.split(' ').slice(0, 2).join(' '); // first 2 words
  if (searchName.length < 4) searchName = p.name;
  // Just check if it's mentioned anywhere in the HTML
  if (html.indexOf(searchName) === -1 && html.indexOf(p.id) === -1) {
    poiNotReferenced.push(p.name + ' (' + p.cat + ', ' + p.nearDay + ')');
  }
});
if (poiNotReferenced.length) {
  console.log('  ℹ️  ' + poiNotReferenced.length + ' POI non referenziati altrove nell\'HTML:');
  poiNotReferenced.slice(0, 10).forEach(function(p) { console.log('    ' + p); });
  if (poiNotReferenced.length > 10) console.log('    ... e altri ' + (poiNotReferenced.length - 10));
} else {
  console.log('  ✅ Tutti i POI referenziati nell\'HTML');
}

// ═══════════════════════════════════════════════════════
// 8. Duplicate content between POI and HTML static sections
// ═══════════════════════════════════════════════════════
console.log('\n═══ 8. Contenuto duplicato POI vs HTML statico ═══');
// Check if any POI content is also hardcoded in HTML (should have been migrated)
var staticDuplicates = [];
data.POI_ATTIVITA.forEach(function(p) {
  // Check for the POI name appearing in a static card/list outside of poi-list containers
  var nameEscaped = p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var regex = new RegExp('<(?:li|div|p)[^>]*>[^<]*' + nameEscaped, 'i');
  // Only flag if it appears in tab-luoghi but NOT inside a poi-list div
  var luoghiStart = html.indexOf('id="tab-luoghi"');
  var luoghiEnd = html.indexOf('id="tab-piano"');
  var luoghi = html.substring(luoghiStart, luoghiEnd);
  if (luoghi.indexOf(p.name) !== -1 && luoghi.indexOf('poi-list-') !== -1) {
    // Check if it's in a static section (not in a poi-list div)
    var poiListSection = 'poi-list-' + p.cat;
    var inPoiList = luoghi.indexOf(poiListSection) !== -1;
    // If the name appears outside poi-list containers, it's a duplicate
    var beforePoiList = luoghi.substring(0, luoghi.indexOf(poiListSection));
    if (beforePoiList.indexOf(p.name) !== -1) {
      staticDuplicates.push(p.name + ' (' + p.cat + ')');
    }
  }
});
if (staticDuplicates.length) {
  console.log('  ⚠️  ' + staticDuplicates.length + ' POI ancora presenti come HTML statico:');
  staticDuplicates.forEach(function(d) { console.log('    ' + d); });
} else {
  console.log('  ✅ Nessun contenuto duplicato POI/HTML');
}

// ═══════════════════════════════════════════════════════
// 9. itinerario internal consistency
// ═══════════════════════════════════════════════════════
console.log('\n═══ 9. itinerario — Consistenza interna ═══');
// Check for duplicate IDs
var itinIdSet = {};
var itinDups = [];
data.itinerario.forEach(function(t) {
  if (itinIdSet[t.id]) itinDups.push(t.id);
  itinIdSet[t.id] = true;
});
if (itinDups.length) {
  issues.push('itinerario ID duplicati: ' + itinDups.join(', '));
  console.log('  ❌ ID duplicati: ' + itinDups.join(', '));
} else {
  console.log('  ✅ Nessun ID duplicato');
}

// Check all required fields present
var missingFields = [];
data.itinerario.forEach(function(t) {
  if (!t.id) missingFields.push(t.id + ': manca id');
  if (!t.city && !t.name) missingFields.push(t.id + ': manca city/name');
});
if (missingFields.length) {
  console.log('  ❌ Campi mancanti: ' + missingFields.join('; '));
} else {
  console.log('  ✅ Tutti i campi richiesti presenti');
}

// ═══════════════════════════════════════════════════════
// 10. POI URLs — check for empty or duplicate URLs
// ═══════════════════════════════════════════════════════
console.log('\n═══ 10. POI URLs — Validità ═══');
var emptyUrls = [];
var dupUrls = {};
data.POI_ATTIVITA.forEach(function(p) {
  if (!p.url || p.url === '') {
    emptyUrls.push(p.name + ' (' + p.cat + ')');
  } else {
    if (dupUrls[p.url]) {
      warnings.push('URL duplicato: ' + p.url + ' → "' + dupUrls[p.url] + '" e "' + p.name + '"');
      console.log('  ⚠️  URL duplicato: ' + p.url);
      console.log('       → "' + dupUrls[p.url] + '" e "' + p.name + '"');
    }
    dupUrls[p.url] = p.name;
  }
  if (!p.mapsUrl || p.mapsUrl === '') {
    emptyUrls.push(p.name + ' (' + p.cat + ') — mapsUrl vuoto');
  }
});
if (emptyUrls.length) {
  console.log('  ⚠️  ' + emptyUrls.length + ' URL vuoti:');
  emptyUrls.forEach(function(u) { console.log('    ' + u); });
  emptyUrls.forEach(function(u) { warnings.push('URL vuoto: ' + u); });
} else {
  console.log('  ✅ Tutti i POI hanno URL e mapsUrl');
}

// ═══════════════════════════════════════════════════════
// 11. Cross-check: Cinque Terre appears in both viewpoint and nature
// ═══════════════════════════════════════════════════════
console.log('\n═══ 11. POI cross-categoria — Potenziali sovrapposizioni ═══');
// Find POIs that share very similar coordinates across different categories
var crossCatOverlaps = [];
for (var i = 0; i < poiList.length; i++) {
  for (var j = i + 1; j < poiList.length; j++) {
    if (poiList[i].cat !== poiList[j].cat) {
      if (Math.abs(poiList[i].lat - poiList[j].lat) < 0.02 && Math.abs(poiList[i].lng - poiList[j].lng) < 0.02) {
        crossCatOverlaps.push('"' + poiList[i].name + '" (' + poiList[i].cat + ') ↔ "' + poiList[j].name + '" (' + poiList[j].cat + ')');
      }
    }
  }
}
if (crossCatOverlaps.length) {
  console.log('  ℹ️  ' + crossCatOverlaps.length + ' POI vicini in categorie diverse (possibili complementari):');
  crossCatOverlaps.forEach(function(o) { console.log('    ' + o); });
} else {
  console.log('  ✅ Nessuna sovrapposizione cross-categoria');
}

// ═══════════════════════════════════════════════════════
// 12. regioni vs itinerario — day ranges match
// ═══════════════════════════════════════════════════════
console.log('\n═══ 12. regioni vs itinerario — Copertura giorni ═══');
var coveredDays = {};
data.regioni.forEach(function(r) {
  for (var d = r.from; d <= r.to; d++) {
    if (coveredDays[d]) {
      warnings.push('Giorno ' + d + ' coperto da più regioni');
    }
    coveredDays[d] = r.name || r.label;
  }
});
var uncoveredDays = [];
for (var d = 0; d < data.itinerario.length; d++) {
  if (!coveredDays[d]) uncoveredDays.push('g' + d);
}
if (uncoveredDays.length) {
  console.log('  ⚠️  Giorni non coperti da regioni: ' + uncoveredDays.join(', '));
  warnings.push('Giorni non coperti: ' + uncoveredDays.join(', '));
} else {
  console.log('  ✅ Tutti i giorni coperti da una regione');
}

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║  RIEPILOGO AUDIT                                     ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('  Errori (da correggere): ' + issues.length);
console.log('  Avvisi (da valutare):   ' + warnings.length);
if (issues.length) {
  console.log('\n  ❌ ERRORI:');
  issues.forEach(function(i) { console.log('    • ' + i); });
}
if (warnings.length) {
  console.log('\n  ⚠️  AVVISI:');
  warnings.forEach(function(w) { console.log('    • ' + w); });
}
