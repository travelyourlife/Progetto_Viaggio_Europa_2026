var fs = require('fs');
var content = fs.readFileSync('wiki-links.js', 'utf8');
var fn = new Function(content + '\nreturn WIKI_LINKS;');
var wl = fn();
var keys = Object.keys(wl);
var nums = keys.map(function(k) { return parseInt(k.replace('g', '')); });
var sorted = nums.slice().sort(function(a, b) { return a - b; });
var ok = JSON.stringify(nums) === JSON.stringify(sorted);
console.log('WIKI_LINKS keys (' + keys.length + '): ' + (ok ? 'OK' : 'FAIL'));
if (!ok) {
  for (var i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) {
      console.log('  Break: g' + nums[i - 1] + ' -> g' + nums[i]);
    }
  }
}
