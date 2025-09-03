import * as utils from '../src/algorithms/utils.js';

/**
 * Test Suite for Utils Module
 */

// Test cdeToMidi and midiToCde conversion
console.log('Testing MIDI conversion functions...');
try {
    const testCases = [
        ['C4', 60],
        ['A4', 69],
        ['C#4', 61],
        ['Bb4', 70],
        ['F#3', 54]
    ];
    
    for (const [cde, expectedMidi] of testCases) {
        const midi = utils.cdeToMidi(cde);
        console.assert(midi === expectedMidi, `${cde} should convert to MIDI ${expectedMidi}, got ${midi}`);
        
        const backToCde = utils.midiToCde(midi);
        // Note: conversion may use sharp instead of flat
        const expectedCdeSharp = cde.replace('Bb', 'A#').replace('Eb', 'D#').replace('Gb', 'F#').replace('Ab', 'G#').replace('Db', 'C#');
        console.assert(
            backToCde === expectedCdeSharp,
            `MIDI ${midi} should convert back to ${expectedCdeSharp}, got ${backToCde}`
        );
    }
    console.log('✅ MIDI conversion tests passed');
} catch (error) {
    console.error('❌ MIDI conversion test failed:', error.message);
}

// Test setOffsetsAccordingToDurations
console.log('\nTesting setOffsetsAccordingToDurations...');
try {
    const notes = [[60, 1, 0], [64, 0.5, 0], [67, 2, 0]];
    const result = utils.setOffsetsAccordingToDurations(notes);
    
    console.assert(result[0][2] === 0, 'First note should start at 0');
    console.assert(result[1][2] === 1, 'Second note should start at 1'); // After first note duration
    console.assert(result[2][2] === 1.5, 'Third note should start at 1.5'); // After second note duration
    console.log('✅ setOffsetsAccordingToDurations test passed');
} catch (error) {
    console.error('❌ setOffsetsAccordingToDurations test failed:', error.message);
}

// Test roundToList
console.log('\nTesting roundToList...');
try {
    const scale = [60, 62, 64, 65, 67, 69, 71]; // C major scale
    
    console.assert(utils.roundToList(61, scale) === 60, 'Should round 61 to 60');
    console.assert(utils.roundToList(63, scale) === 62, 'Should round 63 to 62');
    console.assert(utils.roundToList(63.7, scale) === 64, 'Should round 63.7 to 64');
    console.assert(utils.roundToList(60, scale) === 60, 'Should keep exact matches');
    
    console.log('✅ roundToList test passed');
} catch (error) {
    console.error('❌ roundToList test failed:', error.message);
}

// Test offsetTrack
console.log('\nTesting offsetTrack...');
try {
    const track = [[60, 1, 0], [64, 1, 1], [67, 1, 2]];
    const offsetBy = 2;
    const result = utils.offsetTrack(track, offsetBy);
    
    console.assert(result[0][2] === 2, 'First note should be offset by 2');
    console.assert(result[1][2] === 3, 'Second note should be offset by 2');
    console.assert(result[2][2] === 4, 'Third note should be offset by 2');
    
    // Ensure pitch and duration unchanged
    console.assert(result[0][0] === 60, 'Pitch should remain unchanged');
    console.assert(result[0][1] === 1, 'Duration should remain unchanged');
    
    console.log('✅ offsetTrack test passed');
} catch (error) {
    console.error('❌ offsetTrack test failed:', error.message);
}

// Test scaleList
console.log('\nTesting scaleList...');
try {
    const numbers = [1, 2, 3, 4, 5];
    const scaled = utils.scaleList(numbers, 10, 20);
    
    console.assert(scaled[0] === 10, 'Minimum should scale to 10');
    console.assert(scaled[4] === 20, 'Maximum should scale to 20');
    console.assert(scaled[2] === 15, 'Middle value should scale to 15');
    
    // Test with constant values
    const constant = [5, 5, 5];
    const scaledConstant = utils.scaleList(constant, 10, 20);
    console.assert(scaledConstant.every(val => val === 15), 'Constant values should scale to middle');
    
    console.log('✅ scaleList test passed');
} catch (error) {
    console.error('❌ scaleList test failed:', error.message);
}

// Test fillGapsWithRests
console.log('\nTesting fillGapsWithRests...');
try {
    const notes = [[60, 1, 0], [64, 1, 2]]; // Gap between offset 1 and 2
    const result = utils.fillGapsWithRests(notes);
    
    console.assert(result.length === 3, 'Should add one rest');
    console.assert(result[1][0] === null, 'Rest should have null pitch');
    console.assert(result[1][1] === 1, 'Rest should have duration 1');
    console.assert(result[1][2] === 1, 'Rest should start at offset 1');
    
    console.log('✅ fillGapsWithRests test passed');
} catch (error) {
    console.error('❌ fillGapsWithRests test failed:', error.message);
}

// Test adjustNoteDurationsToPreventOverlaps
console.log('\nTesting adjustNoteDurationsToPreventOverlaps...');
try {
    const notes = [[60, 2, 0], [64, 1, 1]]; // First note overlaps with second
    const result = utils.adjustNoteDurationsToPreventOverlaps([...notes]); // Copy to avoid mutation
    
    console.assert(result[0][1] === 1, 'First note duration should be reduced to 1');
    console.assert(result[1][1] === 1, 'Second note duration should remain unchanged');
    
    console.log('✅ adjustNoteDurationsToPreventOverlaps test passed');
} catch (error) {
    console.error('❌ adjustNoteDurationsToPreventOverlaps test failed:', error.message);
}

// Test fibonacci generator
console.log('\nTesting fibonacci generator...');
try {
    const fib = utils.fibonacci();
    const firstTen = [];
    for (let i = 0; i < 10; i++) {
        firstTen.push(fib.next().value);
    }
    
    const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    console.assert(
        firstTen.every((val, i) => val === expected[i]),
        `Fibonacci sequence should match expected values: ${firstTen} vs ${expected}`
    );
    
    // Test with base and scale
    const fibScaled = utils.fibonacci(0, 1, 10, 2);
    const firstThreeScaled = [
        fibScaled.next().value,
        fibScaled.next().value,
        fibScaled.next().value
    ];
    console.assert(firstThreeScaled[0] === 10, 'Scaled fibonacci should start with base + scale * 0 = 10');
    console.assert(firstThreeScaled[1] === 12, 'Second should be base + scale * 1 = 12');
    console.assert(firstThreeScaled[2] === 12, 'Third should be base + scale * 1 = 12');
    
    console.log('✅ fibonacci generator test passed');
} catch (error) {
    console.error('❌ fibonacci generator test failed:', error.message);
}

// Test qlToSeconds
console.log('\nTesting qlToSeconds...');
try {
    // At 120 BPM, a quarter note = 0.5 seconds
    console.assert(utils.qlToSeconds(1, 120) === 0.5, 'Quarter note at 120 BPM should be 0.5 seconds');
    console.assert(utils.qlToSeconds(2, 120) === 1, 'Half note at 120 BPM should be 1 second');
    console.assert(utils.qlToSeconds(1, 60) === 1, 'Quarter note at 60 BPM should be 1 second');
    
    console.log('✅ qlToSeconds test passed');
} catch (error) {
    console.error('❌ qlToSeconds test failed:', error.message);
}

// Test tracksToDict
console.log('\nTesting tracksToDict...');
try {
    // Test with single track (list of notes)
    const singleTrack = [[60, 1, 0], [64, 1, 1]];
    const dictFromSingle = utils.tracksToDict(singleTrack);
    console.assert(
        typeof dictFromSingle === 'object' && dictFromSingle['track 1'],
        'Single track should become dict with "track 1"'
    );
    
    // Test with array of tracks
    const multiTracks = [singleTrack, [[67, 1, 0]]];
    const dictFromMulti = utils.tracksToDict(multiTracks);
    console.assert(
        dictFromMulti['track 1'] && dictFromMulti['track 2'],
        'Multi tracks should become dict with numbered tracks'
    );
    
    // Test with existing dict (should pass through)
    const existingDict = { 'bass': [[60, 1, 0]], 'melody': [[67, 1, 0]] };
    const passThrough = utils.tracksToDict(existingDict);
    console.assert(passThrough === existingDict, 'Existing dict should pass through unchanged');
    
    console.log('✅ tracksToDict test passed');
} catch (error) {
    console.error('❌ tracksToDict test failed:', error.message);
}

console.log('\n🔧 All utils tests completed!');