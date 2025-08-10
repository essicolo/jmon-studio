const jmonStudio = require('../dist/index.js');

console.log('Testing JMON Studio package...');

// Test basic exports
console.log('✓ Package loaded');
console.log('✓ Version:', jmonStudio.VERSION);

// Test format exports
if (jmonStudio.JmonTone) {
    console.log('✓ JmonTone available');
    console.log('  - VERSION:', jmonStudio.JmonTone.VERSION);
    console.log('  - FORMAT_IDENTIFIER:', jmonStudio.JmonTone.FORMAT_IDENTIFIER);
} else {
    console.log('✗ JmonTone missing');
}

// Test algorithm exports
const algorithmTests = [
    'Scale', 'Progression', 'Voice', 'Rhythm', 'MotifBank',
    'GaussianProcessRegressor', 'CellularAutomata', 'Polyloop',
    'GeneticAlgorithm', 'RandomWalk', 'Mandelbrot', 'LogisticMap'
];

algorithmTests.forEach(name => {
    if (jmonStudio[name]) {
        console.log(`✓ ${name} available`);
    } else {
        console.log(`✗ ${name} missing`);
    }
});

// Test convenience objects
console.log('✓ jmon object keys:', Object.keys(jmonStudio.jmon));
console.log('✓ dj object keys:', Object.keys(jmonStudio.dj));

// Test a simple JMON conversion
try {
    const midiNote = jmonStudio.JmonTone.midiNoteToNoteName(60);
    console.log('✓ MIDI conversion test:', midiNote === 'C4' ? 'PASS' : 'FAIL');
} catch (error) {
    console.log('✗ MIDI conversion failed:', error.message);
}

console.log('\nJMON Studio test complete!');