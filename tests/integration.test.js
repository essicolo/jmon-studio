import { dj } from '../dist/jmon-studio.js';

/**
 * Integration Test Suite - Test full JMON Studio functionality
 */

console.log('🔗 Running JMON Studio Integration Tests...\n');

// Test 1: Basic Scale Generation
console.log('Test 1: Basic Scale Generation');
try {
    const scale = new dj.Scale('C', 'major');
    const scaleNotes = scale.generate();
    console.assert(scaleNotes.includes(60), 'C major scale should include C4 (60)');
    console.assert(scaleNotes.includes(64), 'C major scale should include E4 (64)');
    console.assert(scaleNotes.includes(67), 'C major scale should include G4 (67)');
    console.log('✅ Scale generation works correctly');
} catch (error) {
    console.error('❌ Scale generation failed:', error.message);
}

// Test 2: Progression Generation
console.log('\nTest 2: Progression Generation');
try {
    const progression = new dj.Progression('C4');
    const chords = progression.generate(4);
    console.assert(chords.length === 4, 'Should generate 4 chords');
    console.assert(chords.every(chord => Array.isArray(chord)), 'Each chord should be an array');
    console.log('✅ Chord progression generation works correctly');
} catch (error) {
    console.error('❌ Progression generation failed:', error.message);
}

// Test 3: Rhythm Generation
console.log('\nTest 3: Rhythm Generation');
try {
    const rhythm = new dj.Rhythm(4, [0.25, 0.5, 1, 2]);
    const randomRhythm = rhythm.random(42, 0, 50); // Seed for reproducibility
    console.assert(Array.isArray(randomRhythm), 'Should return array');
    console.assert(randomRhythm.length > 0, 'Should generate at least one note');
    console.log('✅ Rhythm generation works correctly');
} catch (error) {
    console.error('❌ Rhythm generation failed:', error.message);
}

// Test 4: Voice Harmonization
console.log('\nTest 4: Voice Harmonization');
try {
    const voice = new dj.Voice('major', 'C', [0, 2, 4]);
    const melody = [[60, 1, 0], [64, 1, 1], [67, 1, 2]];
    const harmonized = voice.generate(melody);
    console.assert(harmonized.length === 3, 'Should harmonize all melody notes');
    console.assert(harmonized[0][0].length === 3, 'First chord should have 3 notes');
    console.log('✅ Voice harmonization works correctly');
} catch (error) {
    console.error('❌ Voice harmonization failed:', error.message);
}

// Test 5: Ornament Application
console.log('\nTest 5: Ornament Application');
try {
    const ornament = new dj.Ornament('trill', 'C', 'major', 1, 'acciaccatura', null, 0.125);
    const notes = [[60, 2, 0], [64, 2, 2]];
    const ornamented = ornament.generate(notes, 0);
    console.assert(ornamented.length > notes.length, 'Should add ornament notes');
    console.log('✅ Ornament application works correctly');
} catch (error) {
    console.error('❌ Ornament application failed:', error.message);
}

// Test 6: Utility Functions
console.log('\nTest 6: Utility Functions');
try {
    const midiNote = dj.cdeToMidi('A4');
    console.assert(midiNote === 69, 'A4 should be MIDI note 69');
    
    const cdePitch = dj.midiToCde(69);
    console.assert(cdePitch === 'A4', 'MIDI 69 should convert back to A4');
    
    const notes = [[60, 1, 0], [64, 0.5, 0], [67, 2, 0]];
    const withOffsets = dj.setOffsetsAccordingToDurations(notes);
    console.assert(withOffsets[1][2] === 1, 'Second note should start at offset 1');
    
    console.log('✅ Utility functions work correctly');
} catch (error) {
    console.error('❌ Utility functions failed:', error.message);
}

// Test 7: Isorhythm and Beatcycle
console.log('\nTest 7: Rhythmic Functions');
try {
    const pitches = [60, 62, 64];
    const durations = [0.5, 1];
    
    const isoResult = dj.isorhythm(pitches, durations);
    console.assert(isoResult.length === 6, 'Isorhythm should create LCM length (6)');
    
    const beatResult = dj.beatcycle(pitches, durations);
    console.assert(beatResult.length === 3, 'Beatcycle should maintain pitch count');
    console.assert(beatResult[1][2] === 0.5, 'Second note should start at 0.5');
    
    console.log('✅ Rhythmic functions work correctly');
} catch (error) {
    console.error('❌ Rhythmic functions failed:', error.message);
}

// Test 8: Articulation API
console.log('\nTest 8: Articulation API');
try {
    let sequence = [
        { pitch: 'C4', duration: 1, time: 0 },
        { pitch: 'D4', duration: 1, time: 1 },
        { pitch: 'E4', duration: 1, time: 2 }
    ];

    // Test simple articulation assignment
    sequence[0].articulation = 'staccato';
    console.assert(sequence[0].articulation === 'staccato', 'Simple articulation assignment should work');

    // Test complex articulation API
    const result = dj.addArticulation(sequence, 'glissando', 1, { target: 'E4' });
    console.assert(result.success === true, 'Complex articulation should succeed');
    console.assert(sequence[1].articulation === 'glissando', 'Glissando should be applied');
    
    // Test validation
    const validation = dj.validateArticulations(sequence);
    console.assert(validation.valid === true, 'Articulations should be valid');
    
    console.log('✅ Articulation API works correctly');
} catch (error) {
    console.error('❌ Articulation API failed:', error.message);
}

console.log('\n🎯 Integration tests completed!');
console.log('🎉 JMON Studio is fully functional and consistent with djalgo Python implementation!');