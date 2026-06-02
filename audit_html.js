var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');
var issues = [];

console.log('═══ HTML Section Day-Order Audit ═══\n');

// Helper: extract section between two tab IDs
function getSection(startId, endId) {
  var s = html.indexOf('id="' + startId + '"');
  var e = endId ? html.indexOf('id="' + endId + '"') : html.length;
  if (s === -1) return '';
  return html.substring(s, e > s ? e : html.length);
}

// 1. tab-riepilogo: check id="gN" anchors
var riepilogo = getSection('tab-riepilogo', 'tab-giorni');
var dayAnchors = riepilogo.match(/id="g\d+"/g);
if (dayAnchors) {
  var nums = dayAnchors.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
  var sorted = nums.slice().sort(function(a, b) { return a - b; });
  var ok = JSON.stringify(nums) === JSON.stringify(sorted);
  console.log('tab-riepilogo day anchors (' + nums.length + '): ' + (ok ? '✅' : '❌'));
  if (!ok) {
    issues.push('tab-riepilogo');
    for (var i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i - 1]) console.log('  Break: g' + nums[i - 1] + ' → g' + nums[i]);
    }
  }
}

// 2. tab-giorni: check day blocks
var giorni = getSection('tab-giorni', 'tab-cultura');
var gAnchors = giorni.match(/id="g\d+"/g);
if (gAnchors) {
  var gNums = gAnchors.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
  var gSorted = gNums.slice().sort(function(a, b) { return a - b; });
  var gOk = JSON.stringify(gNums) === JSON.stringify(gSorted);
  console.log('tab-giorni day anchors (' + gNums.length + '): ' + (gOk ? '✅' : '❌'));
  if (!gOk) {
    issues.push('tab-giorni');
    for (var i = 1; i < gNums.length; i++) {
      if (gNums[i] < gNums[i - 1]) console.log('  Break: g' + gNums[i - 1] + ' → g' + gNums[i]);
    }
  }
} else {
  console.log('tab-giorni: no id="gN" anchors found (rendered by JS)');
}

// 3. tab-cibo: check country/region section headers
var cibo = getSection('tab-cibo', 'tab-attivita');
// Cibo is organized by country, not by day. Check href="#gN" references are locally ordered
var ciboH3s = cibo.match(/<h3[^>]*id="[^"]*"[^>]*>/g);
console.log('tab-cibo: organized by country (' + (ciboH3s ? ciboH3s.length : 0) + ' h3 sections) — N/A for day order');

// 4. tab-cultura: check country section headers
var cultura = getSection('tab-cultura', 'tab-diario');
var cultH2s = cultura.match(/<h2[^>]*id="[^"]*"[^>]*>/g);
console.log('tab-cultura: organized by country (' + (cultH2s ? cultH2s.length : 0) + ' h2 sections) — N/A for day order');

// 5. tab-attivita: check href="#gN" references within each sub-section
var attivita = getSection('tab-attivita', 'tab-luoghi');
var attH2s = attivita.match(/<h2[^>]*id="[^"]*"[^>]*>/g);
console.log('tab-attivita: ' + (attH2s ? attH2s.length : 0) + ' h2 sections');
// Check if day references within attivita are ordered
var attDayRefs = attivita.match(/href="#g\d+"/g);
if (attDayRefs) {
  var attNums = attDayRefs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
  // These are cross-references, not necessarily ordered. Skip strict check.
  console.log('  (' + attNums.length + ' day cross-references — cross-refs, not sequential)');
}

// 6. tab-luoghi: check POI sections are in correct order (already verified via JS)
var luoghi = getSection('tab-luoghi', 'tab-piano');
var luoghiH2s = luoghi.match(/<h2[^>]*id="[^"]*"[^>]*>/g);
if (luoghiH2s) {
  var luoghiIds = luoghiH2s.map(function(h) { return h.match(/id="([^"]*)"/)[1]; });
  console.log('tab-luoghi h2 order: ' + luoghiIds.join(' → '));
}

// 7. wiki-links.js
console.log('\n═══ wiki-links.js ═══');
try {
  var wlContent = fs.readFileSync('wiki-links.js', 'utf8');
  wlContent = wlContent.replace(/^'use strict';?\s*/, '');
  var wlFn = new Function(wlContent + '\nreturn WIKI_LINKS;');
  var wl = wlFn();
  if (wl && wl.length) {
    var wlDays = wl.map(function(w) { return parseInt(w.day.replace('g', '')); });
    var prevD = -1;
    var wlOk = true;
    var wlBreakIdx = -1;
    for (var i = 0; i < wlDays.length; i++) {
      if (wlDays[i] < prevD) { wlOk = false; wlBreakIdx = i; break; }
      prevD = wlDays[i];
    }
    console.log('WIKI_LINKS (' + wl.length + ' entries): ' + (wlOk ? '✅' : '❌'));
    if (!wlOk) {
      issues.push('WIKI_LINKS');
      console.log('  Break at index ' + wlBreakIdx + ': day g' + wlDays[wlBreakIdx - 1] + ' → g' + wlDays[wlBreakIdx]);
    }
  }
} catch (e) { console.log('  (error: ' + e.message + ')'); }

// 8. weather-coords.js
console.log('\n═══ weather-coords.js ═══');
try {
  var wcContent = fs.readFileSync('weather-coords.js', 'utf8');
  wcContent = wcContent.replace(/^'use strict';?\s*/, '');
  var wcFn = new Function(wcContent + '\nreturn WEATHER_COORDS;');
  var wc = wcFn();
  if (wc && wc.length) {
    var wcDays = wc.map(function(w) { return parseInt(w.day.replace('g', '')); });
    var wcSorted = wcDays.slice().sort(function(a, b) { return a - b; });
    var wcOk = JSON.stringify(wcDays) === JSON.stringify(wcSorted);
    console.log('WEATHER_COORDS (' + wc.length + ' entries): ' + (wcOk ? '✅' : '❌'));
    if (!wcOk) {
      issues.push('WEATHER_COORDS');
      for (var i = 1; i < wcDays.length; i++) {
        if (wcDays[i] < wcDays[i - 1]) console.log('  Break: g' + wcDays[i - 1] + ' → g' + wcDays[i]);
      }
    }
  }
} catch (e) { console.log('  (error: ' + e.message + ')'); }

// 9. Check index_en.html same structure
console.log('\n═══ index_en.html ═══');
var htmlEn = fs.readFileSync('index_en.html', 'utf8');
var riepilogoEn = htmlEn.substring(htmlEn.indexOf('id="tab-riepilogo"'), htmlEn.indexOf('id="tab-giorni"'));
var dayAnchorsEn = riepilogoEn.match(/id="g\d+"/g);
if (dayAnchorsEn) {
  var numsEn = dayAnchorsEn.map(function(h) { return parseInt(h.match(/\d+/)[0]); });
  var sortedEn = numsEn.slice().sort(function(a, b) { return a - b; });
  var okEn = JSON.stringify(numsEn) === JSON.stringify(sortedEn);
  console.log('index_en tab-riepilogo (' + numsEn.length + ' anchors): ' + (okEn ? '✅' : '❌'));
  if (!okEn) {
    issues.push('index_en.html tab-riepilogo');
    for (var i = 1; i < numsEn.length; i++) {
      if (numsEn[i] < numsEn[i - 1]) console.log('  Break: g' + numsEn[i - 1] + ' → g' + numsEn[i]);
    }
  }
}

// Check index_en luoghi
var luoghiEn = htmlEn.substring(htmlEn.indexOf('id="tab-luoghi"'), htmlEn.indexOf('id="tab-piano"'));
var luoghiH2sEn = luoghiEn.match(/<h2[^>]*id="[^"]*"[^>]*>/g);
if (luoghiH2sEn) {
  var luoghiIdsEn = luoghiH2sEn.map(function(h) { return h.match(/id="([^"]*)"/)[1]; });
  console.log('index_en tab-luoghi h2 order: ' + luoghiIdsEn.join(' → '));
}

// Summary
console.log('\n═══════════════════════════════');
if (issues.length === 0) {
  console.log('✅ TUTTO IN ORDINE');
} else {
  console.log('❌ PROBLEMI (' + issues.length + '):');
  issues.forEach(function(i) { console.log('  • ' + i); });
}
