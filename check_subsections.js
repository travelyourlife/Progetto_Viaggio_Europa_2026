var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Focus on the Trekking section which has items that should be in day order
console.log('═══ Trekking Section ═══');
var trekStart = html.indexOf('Trekking — Sentieri');
var trekEnd = html.indexOf('<h2', trekStart + 100);
var trek = html.substring(trekStart, trekEnd);

// Split by h3 sub-sections
var trekH3s = trek.split(/<h3[^>]*>/);
trekH3s.shift();
trekH3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    console.log('  ' + (ok ? '✅' : '❌') + ' ' + title + ': ' + nums.join(', '));
  }
});

// Noleggi section
console.log('\n═══ Noleggi Section ═══');
var nolStart = html.indexOf('Noleggi Outdoor');
var nolEnd = html.indexOf('<h2', nolStart + 100);
var nol = html.substring(nolStart, nolEnd);

var nolH3s = nol.split(/<h3[^>]*>/);
nolH3s.shift();
nolH3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    console.log('  ' + (ok ? '✅' : '❌') + ' ' + title + ': ' + nums.join(', '));
  }
});

// Drone section
console.log('\n═══ Drone Section ═══');
var droneStart = html.indexOf('Drone — Regolamenti');
var droneEnd = html.indexOf('<h2', droneStart + 100);
var drone = html.substring(droneStart, droneEnd);

var droneH3s = drone.split(/<h3[^>]*>/);
droneH3s.shift();
droneH3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    console.log('  ' + (ok ? '✅' : '❌') + ' ' + title + ': ' + nums.join(', '));
  }
});
// Also check top-level items (paragraphs with day refs)
var droneTopRefs = drone.split(/<h3/)[0].match(/href="#g\d+"/g);
if (droneTopRefs && droneTopRefs.length > 1) {
  var droneNums = droneTopRefs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
  var droneSorted = droneNums.slice().sort(function(a, b) { return a - b; });
  var droneOk = JSON.stringify(droneNums) === JSON.stringify(droneSorted);
  console.log('  ' + (droneOk ? '✅' : '❌') + ' (top-level): ' + droneNums.join(', '));
}

// inReach section
console.log('\n═══ inReach Section ═══');
var irStart = html.indexOf('inReach — Copertura');
if (irStart === -1) irStart = html.indexOf('inReach');
var irEnd = html.indexOf('<h2', irStart + 100);
var ir = html.substring(irStart, irEnd);

var irH3s = ir.split(/<h3[^>]*>/);
irH3s.shift();
irH3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    console.log('  ' + (ok ? '✅' : '❌') + ' ' + title + ': ' + nums.join(', '));
  }
});

// Cultura Libri section
console.log('\n═══ Cultura Libri Section ═══');
var libriStart = html.indexOf('Libri, Film e Podcast');
var libriEnd = html.indexOf('<h2', libriStart + 100);
var libri = html.substring(libriStart, libriEnd);

// This section is organized by media type (books, films, podcasts), not by day
// Day references are "when to read/watch" suggestions - cross-references
var libriH3s = libri.split(/<h3[^>]*>/);
libriH3s.shift();
libriH3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    console.log('  ℹ️  ' + title + ': ' + nums.join(', ') + ' (cross-refs by topic)');
  }
});
