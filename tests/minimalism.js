/**
 * Minimalism Techniques Example for JMON Studio
 * =============================================
 * This file demonstrates minimalistic composition techniques similar to those
 * available in the Djalgo Python library, implemented using JMON Studio.
 * 
 * Techniques covered:
 * 1. Isorhythms - mapping durations to pitches
 * 2. Additive/Subtractive processes - gradual build-up and reduction
 * 3. Shuffling - randomizing pitch order while maintaining rhythm
 * 4. Tintinnabuli - Arvo Pärt's compositional technique
 * 5. Complete composition combining all techniques
 */

// Import utilities from jmon-studio - using the existing API
const { midiToCde, cdeToMidi } = require('../src/algorithms/utils.js');
const { Tonejs } = require('../src/converters/tonejs.js');
const { Scale } = require('../src/algorithms/theory/harmony/Scale.js');

// Use the existing conversion functions from jmon-studio
const midiToNote = midiToCde;
const noteToMidi = cdeToMidi;

/**
 * Convert duration to ticks and bars:beats:ticks using Tone.js converter
 */
function durationToTicks(duration) {
    // Standard PPQ (pulses per quarter) is 480
    const beats = Tonejs.parseDurationToBeats(duration);
    return beats * 480; // Convert beats to ticks
}

function ticksToBarsBeatsSixteenths(ticks) {
    const ticksPerQuarter = 480;
    const ticksPerBar = ticksPerQuarter * 4; // 4/4 time
    
    const bars = Math.floor(ticks / ticksPerBar);
    const remainingTicks = ticks % ticksPerBar;
    const beats = Math.floor(remainingTicks / ticksPerQuarter);
    const remainingTicksAfterBeats = remainingTicks % ticksPerQuarter;
    
    return `${bars}:${beats}:${remainingTicksAfterBeats}`;
}

function barsBeatsSixteenthsToTicks(timeStr) {
    // Use Tone.js parser to convert BBT to beats, then to ticks
    const beats = Tonejs.parseBBTToBeats(timeStr);
    return beats * 480;
}

// ==========================================
// 1. ISORHYTHMS
// ==========================================

function demonstrateIsorhythms() {
    console.log('\n=== ISORHYTHM EXAMPLES ===\n');
    
    // Example 1: Simple solfège with uniform durations
    // Use the Scale class from jmon-studio
    const scale = new Scale('C', 'major');
    const cMajorMidi = scale.generate().slice(0, 8); // Get first octave
    const cMajorScale = cMajorMidi.map(midi => midiToNote(midi));
    const uniformDurations = Array(8).fill('8n'); // All eighth notes
    
    const solfege = {
        type: 'jmon',
        version: '1.0',
        tracks: [{
            name: 'Solfège',
            notes: cMajorScale.map((pitch, i) => ({
                pitch: pitch,
                duration: uniformDurations[i],
                time: `0:${i}:0`
            }))
        }]
    };
    
    console.log('Simple Solfège (C Major Scale):');
    console.log(JSON.stringify(solfege.tracks[0].notes.slice(0, 4), null, 2));
    
    // Example 2: Isorhythm with non-matching lengths
    const isorhythmDurations = ['4n', '8n', '8n']; // Pattern repeats
    const isorhythmNotes = [];
    let currentTime = 0;
    
    for (let i = 0; i < 24; i++) { // Create 24 notes total
        const pitch = cMajorScale[i % cMajorScale.length];
        const duration = isorhythmDurations[i % isorhythmDurations.length];
        
        isorhythmNotes.push({
            pitch: pitch,
            duration: duration,
            time: ticksToBarsBeatsSixteenths(currentTime)
        });
        
        currentTime += durationToTicks(duration);
    }
    
    const isorhythm = {
        type: 'jmon',
        version: '1.0',
        tracks: [{
            name: 'Isorhythm Pattern',
            notes: isorhythmNotes
        }]
    };
    
    console.log('\nIsorhythm with 8 pitches and 3 durations:');
    console.log('First 6 notes:', JSON.stringify(isorhythm.tracks[0].notes.slice(0, 6), null, 2));
    
    return { solfege, isorhythm };
}

// ==========================================
// 2. ADDITIVE AND SUBTRACTIVE PROCESSES
// ==========================================

function demonstrateProcesses() {
    console.log('\n=== ADDITIVE/SUBTRACTIVE PROCESSES ===\n');
    
    const baseMelody = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    
    // Additive Forward Process
    function additiveForward(melody) {
        const result = [];
        let timePosition = 0;
        
        for (let i = 1; i <= melody.length; i++) {
            for (let j = 0; j < i; j++) {
                result.push({
                    pitch: melody[j],
                    duration: '8n',
                    time: ticksToBarsBeatsSixteenths(timePosition)
                });
                timePosition += 240; // 8n = 240 ticks
            }
        }
        return result;
    }
    
    // Subtractive Backward Process
    function subtractiveBackward(melody) {
        const result = [];
        let timePosition = 0;
        
        for (let i = melody.length; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                result.push({
                    pitch: melody[j],
                    duration: '8n',
                    time: ticksToBarsBeatsSixteenths(timePosition)
                });
                timePosition += 240;
            }
        }
        return result;
    }
    
    const additiveF = {
        type: 'jmon',
        version: '1.0',
        tracks: [{
            name: 'Additive Forward',
            notes: additiveForward(baseMelody)
        }]
    };
    
    const subtractiveB = {
        type: 'jmon',
        version: '1.0',
        tracks: [{
            name: 'Subtractive Backward',
            notes: subtractiveBackward(baseMelody)
        }]
    };
    
    console.log('Additive Forward Process - First 10 notes:');
    console.log(additiveF.tracks[0].notes.slice(0, 10).map(n => n.pitch).join(', '));
    
    console.log('\nSubtractive Backward Process - First 10 notes:');
    console.log(subtractiveB.tracks[0].notes.slice(0, 10).map(n => n.pitch).join(', '));
    
    return { additiveF, subtractiveB };
}

// ==========================================
// 3. SHUFFLING
// ==========================================

function demonstrateShuffling() {
    console.log('\n=== SHUFFLING EXAMPLE ===\n');
    
    const originalMelody = [
        { pitch: 'E4', duration: '4n.' },
        { pitch: 'G4', duration: '16n' },
        { pitch: 'A4', duration: '2n' },
        { pitch: 'F#4', duration: '4n' },
        { pitch: 'B4', duration: '16n' },
        { pitch: 'G4', duration: '16n' },
        { pitch: 'E5', duration: '8n' },
        { pitch: 'D4', duration: '2n' }
    ];
    
    // Shuffle pitches while maintaining rhythm
    function shufflePitches(melody, seed = 42) {
        // Simple seeded random number generator
        const seededRandom = (function(seed) {
            let value = seed;
            return function() {
                value = (value * 16807) % 2147483647;
                return (value - 1) / 2147483646;
            };
        })(seed);
        
        const pitches = melody.map(note => note.pitch);
        const shuffledPitches = [...pitches].sort(() => seededRandom() - 0.5);
        
        let timePosition = 0;
        const shuffledMelody = melody.map((note, i) => {
            const newNote = {
                pitch: shuffledPitches[i],
                duration: note.duration,
                time: ticksToBarsBeatsSixteenths(timePosition)
            };
            timePosition += durationToTicks(note.duration);
            return newNote;
        });
        
        return shuffledMelody;
    }
    
    const shuffled = {
        type: 'jmon',
        version: '1.0',
        tracks: [{
            name: 'Shuffled Pitches',
            notes: shufflePitches(originalMelody, 38745638)
        }]
    };
    
    console.log('Original pitches:', originalMelody.map(n => n.pitch).join(', '));
    console.log('Shuffled pitches:', shuffled.tracks[0].notes.map(n => n.pitch).join(', '));
    
    return shuffled;
}

// ==========================================
// 4. TINTINNABULI
// ==========================================

function demonstrateTintinnabuli() {
    console.log('\n=== TINTINNABULI EXAMPLE ===\n');
    
    // M-voice (melody)
    const mVoice = [
        { pitch: 'C4', duration: '4n' },
        { pitch: 'D4', duration: '4n' },
        { pitch: 'E4', duration: '4n' },
        { pitch: 'F4', duration: '4n' },
        { pitch: 'G4', duration: '4n' },
        { pitch: 'A4', duration: '4n' },
        { pitch: 'B4', duration: '4n' },
        { pitch: 'C5', duration: '4n' }
    ];
    
    // T-chord (C major triad)
    const tChord = ['C', 'E', 'G'];
    
    /**
     * Generate T-voice using tintinnabuli technique
     */
    function generateTintinnabuli(mVoice, tChord, direction = 'up', rank = 1) {
        const tVoice = [];
        let alternateUp = true;
        
        mVoice.forEach((note, index) => {
            const mPitch = note.pitch;
            const mNote = mPitch.slice(0, -1);
            const mOctave = parseInt(mPitch.slice(-1));
            
            // Find T-chord notes in the appropriate direction
            let candidates = [];
            
            if (direction === 'up' || (direction === 'alternate' && alternateUp)) {
                // Find notes above or equal to M-voice pitch
                for (let octave = mOctave - 1; octave <= mOctave + 2; octave++) {
                    tChord.forEach(tNote => {
                        const candidate = tNote + octave;
                        if (noteToMidi(candidate) >= noteToMidi(mPitch)) {
                            candidates.push(candidate);
                        }
                    });
                }
                candidates.sort((a, b) => noteToMidi(a) - noteToMidi(b));
            } else if (direction === 'down' || (direction === 'alternate' && !alternateUp)) {
                // Find notes below or equal to M-voice pitch
                for (let octave = mOctave + 1; octave >= mOctave - 2; octave--) {
                    tChord.forEach(tNote => {
                        const candidate = tNote + octave;
                        if (noteToMidi(candidate) <= noteToMidi(mPitch)) {
                            candidates.push(candidate);
                        }
                    });
                }
                candidates.sort((a, b) => noteToMidi(b) - noteToMidi(a));
            }
            
            // Select the note at the specified rank
            const selectedPitch = candidates[Math.min(rank - 1, candidates.length - 1)] || mPitch;
            
            tVoice.push({
                pitch: selectedPitch,
                duration: note.duration,
                time: note.time
            });
            
            if (direction === 'alternate') {
                alternateUp = !alternateUp;
            }
        });
        
        return tVoice;
    }
    
    // Add time information to M-voice
    let timePosition = 0;
    mVoice.forEach(note => {
        note.time = ticksToBarsBeatsSixteenths(timePosition);
        timePosition += durationToTicks(note.duration);
    });
    
    const tVoiceUp = generateTintinnabuli(mVoice, tChord, 'up', 1);
    
    const tintinnabuli = {
        type: 'jmon',
        version: '1.0',
        tracks: [
            {
                name: 'M-voice',
                notes: mVoice
            },
            {
                name: 'T-voice (up)',
                notes: tVoiceUp
            }
        ]
    };
    
    console.log('M-voice:', mVoice.map(n => n.pitch).join(', '));
    console.log('T-voice (C major triad, up, rank 1):', tVoiceUp.map(n => n.pitch).join(', '));
    
    return tintinnabuli;
}

// ==========================================
// 5. COMPLETE COMPOSITION
// ==========================================

function createComposition() {
    console.log('\n=== COMPLETE MINIMALIST COMPOSITION ===\n');
    
    // Part A: Isorhythm in E major
    const eMajorPitches = ['G#4', 'E4', 'B4', 'A4', 'C#5', 'B4'];
    const partADurations = ['4n', '8n', '16n', '8n', '4n', '8n.', '8n', '8n', '4n', '2n'];
    
    const partANotes = [];
    let timePosition = 0;
    
    for (let i = 0; i < 30; i++) {
        partANotes.push({
            pitch: eMajorPitches[i % eMajorPitches.length],
            duration: partADurations[i % partADurations.length],
            time: ticksToBarsBeatsSixteenths(timePosition)
        });
        timePosition += durationToTicks(partADurations[i % partADurations.length]);
    }
    
    // Part B: Additive process followed by subtractive process in E minor
    const eMinorBase = ['B4', 'E4', 'G5', 'F#4', 'C#5', 'B4', 'F#4', 'D#4'];
    const partBDurations = ['4n.', '16n', '2n', '4n', '16n', '16n', '8n', '2n'];
    
    // Create additive forward process
    const partBAdditive = [];
    timePosition = barsBeatsSixteenthsToTicks(partANotes[partANotes.length - 1].time) + 
                   durationToTicks(partANotes[partANotes.length - 1].duration);
    
    for (let i = 1; i <= eMinorBase.length; i++) {
        for (let j = 0; j < i; j++) {
            partBAdditive.push({
                pitch: eMinorBase[j],
                duration: partBDurations[j % partBDurations.length],
                time: ticksToBarsBeatsSixteenths(timePosition)
            });
            timePosition += durationToTicks(partBDurations[j % partBDurations.length]);
        }
    }
    
    // Create subtractive backward process
    const partBSubtractive = [];
    for (let i = eMinorBase.length; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            partBSubtractive.push({
                pitch: eMinorBase[j],
                duration: partBDurations[j % partBDurations.length],
                time: ticksToBarsBeatsSixteenths(timePosition)
            });
            timePosition += durationToTicks(partBDurations[j % partBDurations.length]);
        }
    }
    
    // Part C: Shuffled version of Part A
    const partCShuffled = [...eMajorPitches].sort(() => Math.random() - 0.5);
    const partCNotes = [];
    
    for (let i = 0; i < 30; i++) {
        partCNotes.push({
            pitch: partCShuffled[i % partCShuffled.length],
            duration: partADurations[i % partADurations.length],
            time: ticksToBarsBeatsSixteenths(timePosition)
        });
        timePosition += durationToTicks(partADurations[i % partADurations.length]);
    }
    
    // Combine all parts into Track 1
    const track1 = [...partANotes, ...partBAdditive, ...partBSubtractive, ...partCNotes];
    
    // Generate simplified T-voice for Track 2
    const track2 = track1.map((note, i) => {
        const chordNotes = i < 30 ? ['E4', 'G#4', 'B4'] : 
                          i < 66 ? ['E3', 'G3', 'B3'] : 
                                   ['E5', 'G#5', 'B5'];
        return {
            pitch: chordNotes[i % 3],
            duration: note.duration,
            time: note.time
        };
    });
    
    // Generate Track 3: Bass line
    const track3 = [];
    const measureLength = 1920; // 1 whole note in ticks
    const totalMeasures = Math.ceil(timePosition / measureLength);
    
    for (let measure = 0; measure < totalMeasures; measure++) {
        const measureTime = measure * measureLength;
        const root = measure % 4 === 0 ? 'E2' : 'B2';
        
        track3.push({
            pitch: root,
            duration: '1n',
            time: ticksToBarsBeatsSixteenths(measureTime),
            velocity: 0.6
        });
    }
    
    // Create the final JMON composition
    const composition = {
        type: 'jmon',
        version: '1.0',
        metadata: {
            title: 'Minimalist Composition in E',
            composer: 'JMON Studio Example',
            tempo: 120
        },
        tracks: [
            {
                name: 'Melody (M-voice)',
                instrument: 'piano',
                notes: track1
            },
            {
                name: 'Tintinnabuli (T-voice)',
                instrument: 'strings',
                notes: track2
            },
            {
                name: 'Bass',
                instrument: 'bass',
                notes: track3
            }
        ]
    };
    
    console.log('Complete composition created with:');
    console.log(`- Track 1 (Melody): ${track1.length} notes`);
    console.log(`- Track 2 (Tintinnabuli): ${track2.length} notes`);
    console.log(`- Track 3 (Bass): ${track3.length} notes`);
    console.log(`- Total duration: ${totalMeasures} measures`);
    
    return composition;
}

// ==========================================
// MAIN EXECUTION
// ==========================================

async function main() {
    console.log('=====================================');
    console.log('JMON Studio Minimalism Techniques');
    console.log('=====================================');
    
    // Run all demonstrations
    const { solfege, isorhythm } = demonstrateIsorhythms();
    const { additiveF, subtractiveB } = demonstrateProcesses();
    const shuffled = demonstrateShuffling();
    const tintinnabuli = demonstrateTintinnabuli();
    const composition = createComposition();
    
    console.log('\n=== SUMMARY ===');
    console.log('Successfully demonstrated:');
    console.log('✓ Isorhythms - mapping durations to pitches');
    console.log('✓ Additive/Subtractive processes - gradual melodic evolution');
    console.log('✓ Shuffling - randomizing pitch order');
    console.log('✓ Tintinnabuli - Arvo Pärt compositional technique');
    console.log('✓ Complete minimalist composition combining all techniques');
    
    // Export examples for potential playback or further processing
    return {
        examples: {
            solfege,
            isorhythm,
            additiveForward: additiveF,
            subtractiveBackward: subtractiveB,
            shuffled,
            tintinnabuli
        },
        composition
    };
}

// Run if executed directly
if (require.main === module) {
    main().then(result => {
        console.log('\n✅ All minimalism examples completed successfully!');
        
        // Optionally save the composition to a file
        const fs = require('fs');
        const outputPath = './tests/output/minimalist-composition.json';
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync('./tests/output')) {
            fs.mkdirSync('./tests/output', { recursive: true });
        }
        
        fs.writeFileSync(
            outputPath,
            JSON.stringify(result.composition, null, 2)
        );
        console.log(`\nComposition saved to: ${outputPath}`);
    }).catch(error => {
        console.error('Error running minimalism examples:', error);
        process.exit(1);
    });
}

module.exports = { main };
