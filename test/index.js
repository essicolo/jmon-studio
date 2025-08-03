const jmonStudio = require('../src/index.js');

console.log('Testing JMON Studio package...');

// Test basic exports
console.log('✓ Package loaded');
console.log('✓ Version:', jmonStudio.VERSION);

// Test format exports
if (jmonStudio.jmonTone) {
    console.log('✓ jmonTone available');
} else {
    console.log('✗ jmonTone missing');
}

if (jmonStudio.JmonToAbc) {
    console.log('✓ JmonToAbc available');
} else {
    console.log('✗ JmonToAbc missing');
}

// Test algorithm exports
if (jmonStudio.Scale) {
    console.log('✓ Scale available');
} else {
    console.log('✗ Scale missing');
}

if (jmonStudio.RandomWalk) {
    console.log('✓ RandomWalk available');
} else {
    console.log('✗ RandomWalk missing');
}

// Test convenience objects
console.log('✓ jmon object:', Object.keys(jmonStudio.jmon));
console.log('✓ dj object:', Object.keys(jmonStudio.dj));

console.log('\nJMON Studio test complete!');