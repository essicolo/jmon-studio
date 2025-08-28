import { Scale, Progression, MusicTheoryConstants, Voice, Ornament } from '../src/algorithms/theory/harmony/index.js';
import { cdeToMidi } from '../src/algorithms/utils.js';

/**
 * Test Suite for Harmony Module
 */

// Test MusicTheoryConstants
console.log('Testing MusicTheoryConstants...');
const constants = new MusicTheoryConstants();
console.assert(constants.chromatic_scale.length === 12, 'Chromatic scale should have 12 notes');
console.assert(constants.scale_intervals.major.length === 7, 'Major scale should have 7 intervals');
console.assert(MusicTheoryConstants.convertFlatToSharp('Bb') === 'A#', 'Flat to sharp conversion failed');
console.log('✅ MusicTheoryConstants tests passed');

// Test Scale class
console.log('\nTesting Scale class...');
try {
    const cMajor = new Scale('C', 'major');
    console.assert(cMajor.tonic === 'C', 'Scale tonic should be C');
    console.assert(cMajor.mode === 'major', 'Scale mode should be major');
    
    const scaleNotes = cMajor.generate();
    console.assert(Array.isArray(scaleNotes), 'Scale.generate() should return array');
    console.assert(scaleNotes.length > 0, 'Scale should contain notes');
    console.assert(scaleNotes.includes(60), 'C major scale should include C4 (MIDI 60)');
    console.log('✅ Scale tests passed');
} catch (error) {
    console.error('❌ Scale test failed:', error.message);
}

// Test Progression class
console.log('\nTesting Progression class...');
try {
    const prog = new Progression('C4', 'P5', 'chords', [3, 3, 1]);
    const circle = prog.computeCircle();
    console.assert(circle.major.length === 3, 'Major roots should have 3 elements');
    console.assert(circle.minor.length === 3, 'Minor roots should have 3 elements');
    console.assert(circle.diminished.length === 1, 'Diminished roots should have 1 element');
    
    const chord = prog.generateChord(60, 'major'); // C major chord
    console.assert(chord.length === 3, 'Major chord should have 3 notes');
    console.assert(chord.includes(60), 'C major chord should include C');
    console.assert(chord.includes(64), 'C major chord should include E');
    console.assert(chord.includes(67), 'C major chord should include G');
    
    const progression = prog.generate(4);
    console.assert(progression.length === 4, 'Progression should have 4 chords');
    console.log('✅ Progression tests passed');
} catch (error) {
    console.error('❌ Progression test failed:', error.message);
}

// Test Voice class
console.log('\nTesting Voice class...');
try {
    const voice = new Voice('major', 'C', [0, 2, 4]);
    console.assert(voice.tonic === 'C', 'Voice tonic should be C');
    console.assert(Array.isArray(voice.degrees), 'Voice degrees should be array');
    console.assert(voice.degrees.length === 3, 'Voice should have 3 degrees');
    
    // Test chord generation
    const testNotes = [[60, 1, 0], [64, 1, 1], [67, 1, 2]]; // C, E, G
    const chords = voice.generate(testNotes);
    console.assert(Array.isArray(chords), 'Voice.generate() should return array');
    console.assert(chords.length === testNotes.length, 'Should generate chord for each note');
    console.log('✅ Voice tests passed');
} catch (error) {
    console.error('❌ Voice test failed:', error.message);
}

// Test Ornament class
console.log('\nTesting Ornament class...');
try {
    const ornament = new Ornament('trill', 'C', 'major', 1.0, 'acciaccatura', null, 0.125);
    const testNotes = [[60, 2, 0], [64, 2, 2]]; // Two quarter notes
    
    const ornamentedNotes = ornament.generate(testNotes, 0);
    console.assert(Array.isArray(ornamentedNotes), 'Ornament.generate() should return array');
    console.assert(ornamentedNotes.length > testNotes.length, 'Ornamented notes should be more than original');
    console.log('✅ Ornament tests passed');
} catch (error) {
    console.error('❌ Ornament test failed:', error.message);
}

console.log('\n🎵 All harmony tests completed!');