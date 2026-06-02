var fs = require('fs');
var content = fs.readFileSync('data.js', 'utf8');
content = content.replace(/^'use strict';?\s*/, '');
var fn = new Function(content + '\nreturn { POI_ATTIVITA: POI_ATTIVITA, itinerario: itinerario, regioni: regioni, giorniTabIndex: giorniTabIndex };');
var data = fn();

var issues = [];

// 1. POI_ATTIVITA by category (already checked but re-verify)
console.log('═══ POI_ATTIVITA (per categoria) ═══');
var cats = ['museum', 'viewpoint', 'festival', 'spa', 'nature', 'market', 'park'];
cats.forEach(function(cat) {
  var items = data.POI_ATTIVITA.filter(function(p) { return p.cat === cat; });
  var nums = items.map(function(p) { return parseInt(p.nearDay.replace('g', '')); });
  var sorted = nums.slice().sort(function(a, b) { return a - b; });
  var ok = JSON.stringify(nums) === JSON.stringify(sorted);
  console.log('  ' + cat + ' (' + items.length + '): ' + (ok ? '✅' : '❌'));
  if (!ok) {
    issues.push('POI_ATTIVITA.' + cat);
    console.log('    Attuale: ' + nums.join(', '));
    console.log('    Atteso:  ' + sorted.join(', '));
  }
});

// 2. itinerario (should be g0, g1, g2, ... in order)
console.log('\n═══ itinerario ═══');
if (data.itinerario && data.itinerario.length) {
  var tappeNums = data.itinerario.map(function(t) { return parseInt(t.id.replace('g', '')); });
  var tappeSorted = tappeNums.slice().sort(function(a, b) { return a - b; });
  var tappeOk = JSON.stringify(tappeNums) === JSON.stringify(tappeSorted);
  console.log('  itinerario (' + data.itinerario.length + '): ' + (tappeOk ? '✅ ordinato g0→g' + tappeNums[tappeNums.length-1] : '❌'));
  if (!tappeOk) {
    issues.push('itinerario');
    for (var i = 1; i < tappeNums.length; i++) {
      if (tappeNums[i] < tappeNums[i-1]) {
        console.log('    Break at index ' + i + ': g' + tappeNums[i-1] + ' → g' + tappeNums[i]);
      }
    }
  }
}

// 2b. regioni (check day ranges are in order)
console.log('\n═══ regioni ═══');
if (data.regioni && data.regioni.length) {
  var regDays = data.regioni.map(function(r) { return r.from || r.start || 0; });
  var regSorted = regDays.slice().sort(function(a, b) { return a - b; });
  var regOk = JSON.stringify(regDays) === JSON.stringify(regSorted);
  console.log('  regioni (' + data.regioni.length + '): ' + (regOk ? '✅' : '❌'));
  if (!regOk) {
    issues.push('regioni');
    console.log('    Attuale: ' + regDays.join(', '));
  }
}

// 2c. giorniTabIndex
console.log('\n═══ giorniTabIndex ═══');
if (data.giorniTabIndex && data.giorniTabIndex.length) {
  var gtiNums = data.giorniTabIndex.map(function(g) { return typeof g === 'object' ? (g.day || g.id || 0) : parseInt(String(g).replace('g','')); });
  console.log('  giorniTabIndex (' + data.giorniTabIndex.length + ' entries): first=' + JSON.stringify(data.giorniTabIndex[0]).substring(0,60));
}

// 3. Check WIKI_LINKS ordering
console.log('\n═══ WIKI_LINKS ═══');
if (data.WIKI_LINKS && data.WIKI_LINKS.length) {
  // Group by day
  var wikiByDay = {};
  data.WIKI_LINKS.forEach(function(w) {
    if (!wikiByDay[w.day]) wikiByDay[w.day] = [];
    wikiByDay[w.day].push(w);
  });
  var wikiDays = Object.keys(wikiByDay).map(function(d) { return parseInt(d.replace('g', '')); });
  var wikiDaysSorted = wikiDays.slice().sort(function(a, b) { return a - b; });
  // Check if wiki_links are in day order overall
  var allWikiDays = data.WIKI_LINKS.map(function(w) { return parseInt(w.day.replace('g', '')); });
  var prevDay = -1;
  var wikiOk = true;
  for (var i = 0; i < allWikiDays.length; i++) {
    if (allWikiDays[i] < prevDay) { wikiOk = false; break; }
    prevDay = allWikiDays[i];
  }
  console.log('  WIKI_LINKS (' + data.WIKI_LINKS.length + ' entries, ' + wikiDays.length + ' days): ' + (wikiOk ? '✅' : '❌'));
  if (!wikiOk) {
    issues.push('WIKI_LINKS');
    console.log('    Break at index ' + i + ': day g' + allWikiDays[i-1] + ' → g' + allWikiDays[i]);
  }
} else {
  console.log('  (not found in data.js)');
}

// 4. Check HTML sections for day references in order
console.log('\n═══ HTML day-reference ordering (index.html) ═══');
var html = fs.readFileSync('index.html', 'utf8');

// Check tab-riepilogo (Itinerario) - should have g0..g54 in order
var riepilogoMatch = html.match(/<section id="tab-riepilogo"[\s\S]*?<\/section>/);
if (riepilogoMatch) {
  var riepilogo = riepilogoMatch[0];
  var dayHeaders = riepilogo.match(/id="g\d+"/g);
  if (dayHeaders) {
    var dayNums = dayHeaders.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
    var daySorted = dayNums.slice().sort(function(a, b) { return a - b; });
    var dayOk = JSON.stringify(dayNums) === JSON.stringify(daySorted);
    console.log('  tab-riepilogo day headers (' + dayNums.length + '): ' + (dayOk ? '✅' : '❌'));
    if (!dayOk) {
      issues.push('tab-riepilogo day order');
      for (var i = 1; i < dayNums.length; i++) {
        if (dayNums[i] < dayNums[i-1]) {
          console.log('    Break: g' + dayNums[i-1] + ' → g' + dayNums[i]);
        }
      }
    }
  }
}

// Check tab-cibo for day ordering
var ciboMatch = html.match(/<section id="tab-cibo"[\s\S]*?<\/section>/);
if (ciboMatch) {
  var cibo = ciboMatch[0];
  // Look for href="#gN" patterns to see if they're in order
  var ciboRefs = cibo.match(/href="#g\d+"/g);
  if (ciboRefs) {
    var ciboNums = ciboRefs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    // For cibo, references might not be strictly ordered (cross-references)
    // But section headers should be
    var ciboHeaders = cibo.match(/id="cibo-g\d+"|id="food-g\d+"/g);
    if (ciboHeaders) {
      var ciboHeaderNums = ciboHeaders.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
      var ciboSorted = ciboHeaderNums.slice().sort(function(a, b) { return a - b; });
      var ciboOk = JSON.stringify(ciboHeaderNums) === JSON.stringify(ciboSorted);
      console.log('  tab-cibo section headers (' + ciboHeaderNums.length + '): ' + (ciboOk ? '✅' : '❌'));
      if (!ciboOk) issues.push('tab-cibo headers');
    }
  }
}

// Check tab-cultura for day ordering
var culturaMatch = html.match(/<section id="tab-cultura"[\s\S]*?<\/section>/);
if (culturaMatch) {
  var cultura = culturaMatch[0];
  var culturaHeaders = cultura.match(/id="cultura-g\d+"|id="cult-g\d+"/g);
  if (culturaHeaders) {
    var cultNums = culturaHeaders.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
    var cultSorted = cultNums.slice().sort(function(a, b) { return a - b; });
    var cultOk = JSON.stringify(cultNums) === JSON.stringify(cultSorted);
    console.log('  tab-cultura section headers (' + cultNums.length + '): ' + (cultOk ? '✅' : '❌'));
    if (!cultOk) issues.push('tab-cultura headers');
  }
}

// Check tab-attivita for day ordering
var attivitaMatch = html.match(/<section id="tab-attivita"[\s\S]*?<\/section>/);
if (attivitaMatch) {
  var attivita = attivitaMatch[0];
  var attHeaders = attivita.match(/id="att-g\d+"|id="attivita-g\d+"/g);
  if (attHeaders) {
    var attNums = attHeaders.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
    var attSorted = attNums.slice().sort(function(a, b) { return a - b; });
    var attOk = JSON.stringify(attNums) === JSON.stringify(attSorted);
    console.log('  tab-attivita section headers (' + attNums.length + '): ' + (attOk ? '✅' : '❌'));
    if (!attOk) issues.push('tab-attivita headers');
  }
}

// 5. Check weather-coords.js ordering
console.log('\n═══ weather-coords.js ═══');
try {
  var wcContent = fs.readFileSync('weather-coords.js', 'utf8');
  wcContent = wcContent.replace(/^'use strict';?\s*/, '');
  var wcFn = new Function(wcContent + '\nreturn typeof WEATHER_COORDS !== "undefined" ? WEATHER_COORDS : null;');
  var wc = wcFn();
  if (wc && wc.length) {
    var wcDays = wc.map(function(w) { return parseInt(w.day.replace('g', '')); });
    var wcSorted = wcDays.slice().sort(function(a, b) { return a - b; });
    var wcOk = JSON.stringify(wcDays) === JSON.stringify(wcSorted);
    console.log('  WEATHER_COORDS (' + wc.length + '): ' + (wcOk ? '✅' : '❌'));
    if (!wcOk) {
      issues.push('WEATHER_COORDS');
      for (var i = 1; i < wcDays.length; i++) {
        if (wcDays[i] < wcDays[i-1]) {
          console.log('    Break at index ' + i + ': g' + wcDays[i-1] + ' → g' + wcDays[i]);
        }
      }
    }
  }
} catch(e) { console.log('  (error reading: ' + e.message + ')'); }

// 6. Check wiki-links.js ordering
console.log('\n═══ wiki-links.js ═══');
try {
  var wlContent = fs.readFileSync('wiki-links.js', 'utf8');
  wlContent = wlContent.replace(/^'use strict';?\s*/, '');
  var wlFn = new Function(wlContent + '\nreturn typeof WIKI_LINKS !== "undefined" ? WIKI_LINKS : null;');
  var wl = wlFn();
  if (wl && wl.length) {
    var wlDays = wl.map(function(w) { return parseInt(w.day.replace('g', '')); });
    var prevD = -1; var wlOk = true; var wlBreak = -1;
    for (var i = 0; i < wlDays.length; i++) {
      if (wlDays[i] < prevD) { wlOk = false; wlBreak = i; break; }
      prevD = wlDays[i];
    }
    console.log('  WIKI_LINKS (' + wl.length + '): ' + (wlOk ? '✅' : '❌'));
    if (!wlOk) {
      issues.push('WIKI_LINKS (wiki-links.js)');
      console.log('    Break at index ' + wlBreak + ': day g' + wlDays[wlBreak-1] + ' → g' + wlDays[wlBreak]);
    }
  }
} catch(e) { console.log('  (error reading: ' + e.message + ')'); }

// Summary
console.log('\n═══════════════════════════════');
if (issues.length === 0) {
  console.log('✅ TUTTO IN ORDINE — nessun problema trovato');
} else {
  console.log('❌ PROBLEMI TROVATI (' + issues.length + '):');
  issues.forEach(function(i) { console.log('  • ' + i); });
}
