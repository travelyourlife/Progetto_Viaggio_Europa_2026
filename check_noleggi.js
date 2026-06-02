var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Extract Noleggi section
var start = html.indexOf('id="noleggi"');
var end = html.indexOf('<h2', start + 100);
var noleggi = html.substring(start, end);

// Split by h3
var h3s = noleggi.split(/<h3[^>]*>/);
h3s.shift();

h3s.forEach(function(sub) {
  var titleMatch = sub.match(/^([^<]+)/);
  var title = titleMatch ? titleMatch[1].trim().substring(0, 50) : '?';
  
  // Find all day references in table rows
  var refs = sub.match(/href="#g\d+"/g);
  if (refs && refs.length > 1) {
    var nums = refs.map(function(r) { return parseInt(r.match(/\d+/)[0]); });
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    var ok = JSON.stringify(nums) === JSON.stringify(sorted);
    console.log((ok ? '✅' : '❌') + ' ' + title + ' (' + nums.length + ' refs)');
    if (!ok) {
      console.log('   Attuale: ' + nums.join(', '));
      console.log('   Atteso:  ' + sorted.join(', '));
    }
  } else {
    console.log('ℹ️  ' + title + ' (0-1 refs)');
  }
});
