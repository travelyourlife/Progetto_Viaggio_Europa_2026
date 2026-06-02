var fs = require('fs');
var content = fs.readFileSync('data.js', 'utf8');
// Remove 'use strict' and wrap to extract POI_ATTIVITA
content = content.replace(/^'use strict';?\s*/, '');
var fn = new Function(content + '\nreturn POI_ATTIVITA;');
var POI_ATTIVITA = fn();

var cats = ['museum', 'viewpoint', 'festival', 'spa', 'nature', 'market', 'park'];
cats.forEach(function(cat) {
  var items = POI_ATTIVITA.filter(function(p) { return p.cat === cat; });
  var nums = items.map(function(p) { return parseInt(p.nearDay.replace('g', '')); });
  var sorted = nums.slice().sort(function(a, b) { return a - b; });
  var ok = JSON.stringify(nums) === JSON.stringify(sorted);
  console.log(cat.toUpperCase() + ' (' + items.length + '): ' + (ok ? 'OK ordinato' : 'NON ordinato'));
  if (!ok) {
    console.log('  Attuale: ' + nums.join(', '));
    console.log('  Atteso:  ' + sorted.join(', '));
  }
});
