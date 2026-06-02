var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');
var issues = [];

console.log('═══ tab-attivita internal ordering ═══');
var start = html.indexOf('id="tab-attivita"');
var end = html.indexOf('id="tab-luoghi"');
var attivita = html.substring(start, end);

// Split by h2 to get each sub-section
var h2s = attivita.split(/<h2[^>]*>/);
h2s.shift(); // remove content before first h2

h2s.forEach(function(section, idx) {
  var titleMatch = section.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : 'Section ' + idx;
  
  // Find all href="#gN" references
  var refs = section.match(/href="#g\d+"/g);
  if (refs && refs.length > 2) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    if (ok) {
      console.log('  ✅ ' + title + ' (' + nums.length + ' refs)');
    } else {
      console.log('  ❌ ' + title);
      console.log('     Attuale: ' + nums.join(', '));
      console.log('     Atteso:  ' + sorted.join(', '));
      issues.push('attivita: ' + title);
    }
  }
});

console.log('\n═══ tab-cibo internal ordering ═══');
start = html.indexOf('id="tab-cibo"');
end = html.indexOf('id="tab-attivita"');
var cibo = html.substring(start, end);

// Split by h2
var ciboH2s = cibo.split(/<h2[^>]*>/);
ciboH2s.shift();

ciboH2s.forEach(function(section, idx) {
  var titleMatch = section.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : 'Section ' + idx;
  
  var refs = section.match(/href="#g\d+"/g);
  if (refs && refs.length > 2) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    if (ok) {
      console.log('  ✅ ' + title + ' (' + nums.length + ' refs)');
    } else {
      console.log('  ❌ ' + title);
      console.log('     Attuale: ' + nums.join(', '));
      console.log('     Atteso:  ' + sorted.join(', '));
      issues.push('cibo: ' + title);
    }
  }
});

console.log('\n═══ tab-cultura internal ordering ═══');
start = html.indexOf('id="tab-cultura"');
end = html.indexOf('id="tab-diario"');
var cultura = html.substring(start, end);

var cultH2s = cultura.split(/<h2[^>]*>/);
cultH2s.shift();

cultH2s.forEach(function(section, idx) {
  var titleMatch = section.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : 'Section ' + idx;
  
  var refs = section.match(/href="#g\d+"/g);
  if (refs && refs.length > 2) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    if (ok) {
      console.log('  ✅ ' + title + ' (' + nums.length + ' refs)');
    } else {
      console.log('  ❌ ' + title);
      console.log('     Attuale: ' + nums.join(', '));
      console.log('     Atteso:  ' + sorted.join(', '));
      issues.push('cultura: ' + title);
    }
  }
});

console.log('\n═══ tab-luoghi internal ordering ═══');
start = html.indexOf('id="tab-luoghi"');
end = html.indexOf('id="tab-piano"');
var luoghi = html.substring(start, end);

var luoghiH2s = luoghi.split(/<h2[^>]*>/);
luoghiH2s.shift();

luoghiH2s.forEach(function(section, idx) {
  var titleMatch = section.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : 'Section ' + idx;
  
  var refs = section.match(/href="#g\d+"/g);
  if (refs && refs.length > 2) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    if (ok) {
      console.log('  ✅ ' + title + ' (' + nums.length + ' refs)');
    } else {
      console.log('  ❌ ' + title);
      console.log('     Attuale: ' + nums.join(', '));
      console.log('     Atteso:  ' + sorted.join(', '));
      issues.push('luoghi: ' + title);
    }
  }
});

// Summary
console.log('\n═══════════════════════════════');
if (issues.length === 0) {
  console.log('✅ TUTTO IN ORDINE');
} else {
  console.log('❌ PROBLEMI (' + issues.length + '):');
  issues.forEach(function(i) { console.log('  • ' + i); });
}
