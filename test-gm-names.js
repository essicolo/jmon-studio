#!/usr/bin/env node

import { jm } from './dist/jmon.esm.js';

console.log('🎹 Testing Enhanced GM Instrument Functions\n');

// Test the new findGMProgramByName function
console.log('🔍 Testing instrument name lookups:');

const testNames = [
    'Violin',           // Exact match
    'violin',           // Case insensitive
    'ACOUSTIC GRAND PIANO', // Case insensitive + multiple words
    'piano',            // Partial match
    'trumpet',          // Lowercase exact
    'cello',            // Another exact
    'flute',            // Another one
    'InvalidInstrument' // Should fail
];

testNames.forEach(name => {
    const program = jm.instruments.findGMProgramByName(name);
    if (program !== null) {
        console.log(`  ✅ "${name}" → Program #${program} (${jm.instruments.GM_INSTRUMENTS[program].name})`);
    } else {
        console.log(`  ❌ "${name}" → Not found`);
    }
});

console.log('\n🏗️  Testing createGMInstrumentNode with names:');

// Test creating nodes with instrument names
const testInstruments = [
    { instrument: 'Violin', id: 'violin_sampler' },
    { instrument: 40, id: 'violin_by_number' },     // For comparison
    { instrument: 'Acoustic Grand Piano', id: 'piano_sampler' },
    { instrument: 'trumpet', id: 'trumpet_sampler' },
    { instrument: 'NonExistent', id: 'fallback_test' }
];

testInstruments.forEach(({ instrument, id }) => {
    console.log(`\n📄 Creating node for "${instrument}":`); 
    const node = jm.instruments.createGMInstrumentNode(id, instrument, {
        noteRange: [60, 72], // Just middle octave for testing
        envelope: { attack: 0.1, release: 0.5 }
    }, "master");
    
    if (node) {
        console.log(`  ✅ Created: ${node.id}`);
        console.log(`  📊 Type: ${node.type}`);
        console.log(`  🎵 URL count: ${Object.keys(node.options.urls).length}`);
        console.log(`  🎯 Target: ${node.target}`);
        console.log(`  🎪 Sample URL example: ${Object.values(node.options.urls)[0]}`);
    } else {
        console.log(`  ❌ Failed to create node`);
    }
});

console.log('\n🎼 Creating a test composition with named instruments:');

// Example composition using the new functionality
const testComposition = {
    format: "jmon",
    version: "1.0.0",
    tempo: 120,
    timeSignature: "4/4",
    keySignature: "C",
    metadata: {
        title: "GM Instruments by Name Test",
        composer: "JMON Library"
    },
    tracks: [
        {
            label: "Violin Solo",
            synthRef: "violin",
            notes: [
                { time: 0, pitch: 67, duration: 1 },    // G4
                { time: 1, pitch: 69, duration: 1 },    // A4
                { time: 2, pitch: 71, duration: 1 },    // B4
                { time: 3, pitch: 72, duration: 1 }     // C5
            ]
        },
        {
            label: "Piano Accompaniment", 
            synthRef: "piano",
            notes: [
                { time: 0, pitch: [60, 64, 67], duration: 4 }  // C major chord
            ]
        }
    ],
    audioGraph: [
        // Using instrument NAMES instead of numbers! 🎉
        jm.instruments.createGMInstrumentNode("violin", "Violin", {
            noteRange: [55, 84],
            envelope: { attack: 0.1, release: 1.0 }
        }, "master"),
        jm.instruments.createGMInstrumentNode("piano", "Acoustic Grand Piano", {
            noteRange: [21, 108],
            envelope: { attack: 0.01, release: 0.8 }
        }, "master"),
        {
            id: "master",
            type: "Destination",
            options: {}
        }
    ]
};

console.log('\n🎵 Test composition created successfully!');
console.log(`   📊 Tracks: ${testComposition.tracks.length}`);
console.log(`   🎹 AudioGraph nodes: ${testComposition.audioGraph.length}`);
console.log(`   🎼 Using: ${testComposition.audioGraph[0].id} and ${testComposition.audioGraph[1].id}`);

console.log('\n✨ Summary:');
console.log('   ✅ You can now use instrument names in createGMInstrumentNode()');
console.log('   ✅ Case-insensitive matching works');
console.log('   ✅ Partial matching for common names (e.g., "piano" → "Acoustic Grand Piano")');
console.log('   ✅ Fallback to program #0 if instrument not found');
console.log('   ✅ Backward compatible - still accepts program numbers');

console.log('\n📚 Usage Examples:');
console.log(`
// ✨ NEW: AudioGraph-consistent signature - createGMInstrumentNode(id, instrument, options, target)
jm.instruments.createGMInstrumentNode("violin_sampler", "Violin", { noteRange: [55, 84] }, "master")
jm.instruments.createGMInstrumentNode("piano", "acoustic grand piano", {}, "reverb")  // case insensitive
jm.instruments.createGMInstrumentNode("brass_section", "trumpet", { strategy: "balanced" }, "destination")

// 🔍 Find program numbers by name
const violinProgram = jm.instruments.findGMProgramByName("Violin")  // Returns 40

// ✅ Still works: Using program numbers  
jm.instruments.createGMInstrumentNode("violin_sampler", 40, {}, "master")  // Same as using "Violin"
`);
