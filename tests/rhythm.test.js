import { Rhythm, isorhythm, beatcycle } from '../src/algorithms/theory/rhythm/index.js';

/**
 * Test Suite for Rhythm Module
 */

// Test isorhythm function
console.log('Testing isorhythm function...');
try {
    const pitches = [60, 64, 67]; // C, E, G
    const durations = [1, 0.5]; // Quarter note, eighth note
    
    const result = isorhythm(pitches, durations);
    console.assert(Array.isArray(result), 'isorhythm should return array');
    console.assert(result.length === 6, 'isorhythm should create LCM length sequence'); // LCM(3,2) = 6
    console.assert(result.every(note => note.length === 3), 'Each note should be [pitch, duration, offset]');
    
    // Check that pitches cycle correctly
    console.assert(result[0][0] === 60, 'First note should be C');
    console.assert(result[3][0] === 60, 'Fourth note should be C again');
    
    // Check that durations cycle correctly
    console.assert(result[0][1] === 1, 'First note should have duration 1');
    console.assert(result[1][1] === 0.5, 'Second note should have duration 0.5');
    console.assert(result[2][1] === 1, 'Third note should have duration 1');
    
    console.log('✅ isorhythm tests passed');
} catch (error) {
    console.error('❌ isorhythm test failed:', error.message);
}

// Test beatcycle function
console.log('\nTesting beatcycle function...');
try {
    const pitches = [60, 62, 64, 65]; // C, D, E, F
    const durations = [0.5, 1]; // Eighth, quarter
    
    const result = beatcycle(pitches, durations);
    console.assert(Array.isArray(result), 'beatcycle should return array');
    console.assert(result.length === 4, 'beatcycle should maintain pitch array length');
    
    // Check offset calculation
    console.assert(result[0][2] === 0, 'First note should start at 0');
    console.assert(result[1][2] === 0.5, 'Second note should start at 0.5');
    console.assert(result[2][2] === 1.5, 'Third note should start at 1.5'); // 0.5 + 1
    console.assert(result[3][2] === 2, 'Fourth note should start at 2'); // 1.5 + 0.5
    
    // Check duration cycling
    console.assert(result[0][1] === 0.5, 'First note duration should be 0.5');
    console.assert(result[1][1] === 1, 'Second note duration should be 1');
    console.assert(result[2][1] === 0.5, 'Third note duration should be 0.5');
    console.assert(result[3][1] === 1, 'Fourth note duration should be 1');
    
    console.log('✅ beatcycle tests passed');
} catch (error) {
    console.error('❌ beatcycle test failed:', error.message);
}

// Test Rhythm class
console.log('\nTesting Rhythm class...');
try {
    const rhythm = new Rhythm(4, [0.25, 0.5, 1]); // 4/4 measure with various note values
    console.assert(rhythm.measureLength === 4, 'Measure length should be 4');
    console.assert(Array.isArray(rhythm.durations), 'Durations should be array');
    
    // Test random rhythm generation
    const randomRhythm = rhythm.random(12345, 0, 50); // With seed for reproducibility
    console.assert(Array.isArray(randomRhythm), 'random() should return array');
    console.assert(randomRhythm.length > 0, 'Should generate at least one note');
    
    // Check that all notes are valid [duration, offset] pairs
    console.assert(
        randomRhythm.every(note => Array.isArray(note) && note.length === 2),
        'Each rhythm element should be [duration, offset]'
    );
    
    // Test genetic algorithm (darwin method)
    const geneticRhythm = rhythm.darwin(12345, 5, 10, 0.1); // Small population for speed
    console.assert(Array.isArray(geneticRhythm), 'darwin() should return array');
    console.assert(
        geneticRhythm.every(note => Array.isArray(note) && note.length === 2),
        'Each genetic rhythm element should be [duration, offset]'
    );
    
    console.log('✅ Rhythm class tests passed');
} catch (error) {
    console.error('❌ Rhythm class test failed:', error.message);
}

console.log('\n🥁 All rhythm tests completed!');