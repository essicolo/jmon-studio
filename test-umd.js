const jm = require('./index.js');

console.log('=== JMON Studio Structure Test ===');
console.log('Version:', jm.VERSION);
console.log();

console.log('Top-level structure:');
console.log('- jmon:', Object.keys(jm.jmon));
console.log('- dj:', Object.keys(jm.dj));
console.log('- viz:', Object.keys(jm.viz));
console.log('- Direct access: JmonTone:', !!jm.JmonTone, ', Scale:', !!jm.Scale);
console.log();

// Test JMON format tools
console.log('=== JMON Format Tools ===');
console.log('MIDI conversion:', jm.jmon.JmonTone.midiNoteToNoteName(60));
console.log('Format identifier:', jm.jmon.JmonTone.FORMAT_IDENTIFIER);
console.log();

// Test algorithm tools
console.log('=== Algorithm Tools ===');
const scale = new jm.dj.Scale('C', 'major');
console.log('Scale notes:', scale.getNotes());
console.log();

// Test direct access
console.log('=== Direct Access ===');
const directScale = new jm.Scale('D', 'major');
console.log('Direct scale notes:', directScale.getNotes());
console.log();

// Test fractals
console.log('=== Fractals ===');
console.log('Fractals available:', Object.keys(jm.dj.Fractals));
console.log();

console.log('✓ Structure looks clean and organized!');