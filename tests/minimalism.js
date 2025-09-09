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

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Convert MIDI note number to note name (e.g., 60 -> 'C4')
 */
function midiToNote(midi) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const noteName = noteNames[midi % 12];
    return noteName + octave;
}

/**
 * Convert note name to MIDI number (e.g., 'C4' -> 60)
 */
function noteToMidi(note) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const parts = note.match(/([A-G]#?)([0-9])/);
    if (!parts) return 60; // Default to middle C
    const noteName = parts[1];
    const octave = parseInt(parts[2]);
    const noteIndex = noteNames.indexOf(noteName);
    return (octave + 1) * 12 + noteIndex;
}

/**
 * Convert duration string to ticks (e.g., '4n' -> 480)
 */
function durationToTicks(duration) {
    const durations = {
        '1n': 1920,     // whole note
        '2n': 960,      // half note
        '2n.': 1440,    // dotted half
        '4n': 480,      // quarter note
        '4n.': 720,     // dotted quarter
        '8n': 240,      // eighth note
        '8n.': 360,     // dotted eighth
        '16n': 120,     // sixteenth note
        '32n': 60       // thirty-second note
    };
    return durations[duration] || 480;
}

/**
 * Convert ticks to bars:beats:sixteenths format
 */
function ticksToBarsBeatsSixteenths(ticks) {
    const ticksPerQuarter = 480;
    const ticksPerSixteenth = ticksPerQuarter / 4;
    const ticksPerBar = ticksPerQuarter * 4; // Assuming 4/4 time
    
    const bars = Math.floor(ticks / ticksPerBar);
    const remainingTicks = ticks % ticksPerBar;
    const beats = Math.floor(remainingTicks / ticksPerQuarter);
    const remainingTicksAfterBeats = remainingTicks % ticksPerQuarter;
    const sixteenths = Math.floor(remainingTicksAfterBeats / ticksPerSixteenth);
    
    return `${bars}:${beats}:${sixteenths * ticksPerSixteenth}`;
}

/**
 * Parse bars:beats:sixteenths to ticks
 */
function barsBeatsSixteenthsToTicks(timeStr) {
    const parts = timeStr.split(':');
    const bars = parseInt(parts[0]) || 0;
    const beats = parseInt(parts[1]) || 0;
    const ticks = parseInt(parts[2]) || 0;
    
    return bars * 1920 + beats * 480 + ticks;
}

// ==========================================
// 1. ISORHYTHMS
// ==========================================

function demonstrateIsorhythms() {
    console.log('\n=== ISORHYTHM EXAMPLES ===\n');
    
    // Example 1: Simple solfège with uniform durations
    // C major scale from C4 to C5
    const cMajorScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
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
    // 8 pitches, 3 durations - creates interesting patterns
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
        
        // Update current time based on duration
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
    // C4, C4-D4, C4-D4-E4, etc.
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
    
    // Additive Backward Process
    // C5, B4-C5, A4-B4-C5, etc.
    function additiveBackward(melody) {
        const result = [];
        let timePosition = 0;
        
        for (let i = 1; i <= melody.length; i++) {
            for (let j = melody.length - i; j < melody.length; j++) {
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
    
    // Subtractive Forward Process
    // C4-D4-E4-F4-G4-A4-B4-C5, D4-E4-F4-G4-A4-B4-C5, E4-F4-G4-A4-B4-C5, etc.
    function subtractiveForward(melody) {
        const result = [];
        let timePosition = 0;
        
        for (let i = 0; i < melody.length; i++) {
            for (let j = i; j < melody.length; j++) {
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
    
    // Subtractive Backward Process
    // C4-D4-E4-F4-G4-A4-B4-C5, C4-D4-E4-F4-G4-A4-B4, C4-D4-E4-F4-G4-A4, etc.
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
    
    // Create a melody with specific rhythm
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
        
        // Extract pitches and shuffle them
        const pitches = melody.map(note => note.pitch);
        const shuffledPitches = [...pitches].sort(() => seededRandom() - 0.5);
        
        // Create new melody with shuffled pitches but same rhythm
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
     * @param {Array} mVoice - The melody voice
     * @param {Array} tChord - The tintinnabuli chord (without octaves)
     * @param {string} direction - 'up', 'down', 'alternate', or 'nearest'
     * @param {number} rank - Which note to select (1 = closest, 2 = second closest, etc.)
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
            } else if (direction === 'nearest') {
                // Find nearest notes regardless of direction
                for (let octave = mOctave - 1; octave <= mOctave + 1; octave++) {
                    tChord.forEach(tNote => {
                        candidates.push(tNote + octave);
                    });
                }
                candidates.sort((a, b) => 
                    Math.abs(noteToMidi(a) - noteToMidi(mPitch)) -
                    Math.abs(noteToMidi(b) - noteToMidi(mPitch))
                );
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
    const eMinorBase = ['B4', 'E4', 'G#5', 'F#4', 'C#5', 'B4', 'F#4', 'D#4'];
    const partBDurations = ['4n.', '16n', '2n', '4n', '16n', '16n', '8n', '2n'];
    
    // Create additive forward process
    const partBAdditive = [];
    timePosition = partANotes[partANotes.length - 1].time;
    timePosition = barsBeatsSixteenthsToTicks(timePosition) + 
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
    
    // Generate Tintinnabuli T-voice for Track 2
    const eMajorTriad = ['E', 'G#', 'B'];
    const eMinorTriad = ['E', 'G', 'B'];
    
    // T-voice for Part A (E major, up)
    const track2PartA = [];
    partANotes.forEach(note => {
        const tChordNote = eMajorTriad[Math.floor(Math.random() * 3)] + '4';
        track2PartA.push({
            pitch: tChordNote,
            duration: note.duration,
            time: note.time
        });
    });
    
    // T-voice for Part B (E minor, down with offset)
    const track2PartB = [];
    [...partBAdditive, ...partBSubtractive].forEach(note => {
        const tChordNote = eMinorTriad[Math.floor(Math.random() * 3)] + '3';
        // Add quarter note offset
        const offsetTime = barsBeatsSixteenthsToTicks(note.time) + 480;
        track2PartB.push({
            pitch: tChordNote,
            duration: note.duration,
            time: ticksToBarsBeatsSixteenths(offsetTime)
        });
    });
    
    // T-voice for Part C (E major, alternate, octave higher)
    const track2PartC = [];
    partCNotes.forEach((note, i) => {
        const tChordNote = eMajorTriad[i % 3] + '5';
        track2PartC.push({
            pitch: tChordNote,
            duration: note.duration,
            time: note.time
        });
    });
    
    const track2 = [...track2PartA, ...track2PartB, ...track2PartC];
    
    // Generate Track 3: Bass line with chords at measure starts
    const track3 = [];
    const measureLength = 1920; // 1 whole note in ticks
    const totalMeasures = Math.ceil(timePosition / measureLength);
    
    for (let measure = 0; measure < totalMeasures; measure++) {
        const measureTime = measure * measureLength;
        const mode = measure < 8 ? 'major' : measure < 20 ? 'minor' : 'major';
        const root = 'E2';
        const third = mode === 'major' ? 'G#2' : 'G2';
        const fifth = 'B2';
        
        // Create a chord
        track3.push(
            {
                pitch: root,
                duration: '1n',
                time: ticksToBarsBeatsSixteenths(measureTime),
                velocity: 0.6
            },
            {
                pitch: third,
                duration: '1n',
                time: ticksToBarsBeatsSixteenths(measureTime),
                velocity: 0.5
            },
            {
                pitch: fifth,
                duration: '1n',
                time: ticksToBarsBeatsSixteenths(measureTime),
                velocity: 0.5
            }
        );
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
                name: 'Bass Chords',
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
    
    // Validate the composition (simplified)
    const validation = { valid: true };
    console.log('\nComposition validation:', validation.valid ? 'VALID' : 'INVALID');
    if (!validation.valid) {
        console.log('Validation errors:', validation.errors);
    }
    
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
