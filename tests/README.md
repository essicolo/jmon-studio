# Minimalism Examples for jmon-studio

This directory contains examples that demonstrate minimalistic composition techniques using jmon-studio, inspired by the Djalgo Python library.

## Files

### `minimalism-jmon.js` ⭐ **RECOMMENDED**
JMON-native examples demonstrating the updated, coherent API:

1. **Isorhythms** - Mapping durations to pitches with pattern repetition
2. **Additive and Subtractive Processes** - Growing and shrinking melodic patterns
3. **Tintinnabuli** - Arvo Pärt-style counterpoint technique  
4. **JMON Utilities** - Official format helpers and conversions
5. **Complex Compositions** - Multi-track arrangements with proper timing
6. **Backwards Compatibility** - Legacy format support

### `minimalism.js` (Legacy)
Original examples with format conversion workarounds. Kept for reference but superseded by the JMON-native approach.

### `test-minimalism.js`
Simple test script that verifies all the minimalism algorithms are working correctly.

## Running the Examples

```bash
# Run the JMON-native examples (recommended)
node examples/minimalism-jmon.js

# Run the basic tests
node examples/test-minimalism.js

# Run the legacy examples (with format conversions)
# node examples/minimalism.js
```

## Minimalism Techniques Explained

### 1. Isorhythm
Creates rhythmic patterns by cycling through lists of pitches and durations independently. When the lengths don't match, interesting patterns emerge as the cycles phase in and out of alignment.

Example:
```javascript
const pitches = [60, 64, 67, 72]; // C, E, G, C5
const durations = [1, 0.5, 0.5];   // Quarter, eighth, eighth
const melody = isorhythm(pitches, durations);
```

### 2. Additive and Subtractive Processes
- **Additive Forward**: Starts with first note, then first two, then first three, etc.
- **Additive Backward**: Starts with last note, then last two, etc.
- **Subtractive Forward**: Starts with full melody, removes first note, then first two, etc.
- **Subtractive Backward**: Starts with full melody, removes last note, then last two, etc.

```javascript
const process = new MinimalismProcess({
  operation: 'additive',
  direction: 'forward',
  repetition: 0
});
const result = process.generate(melody);
```

### 3. Tintinnabuli
Creates a harmonic voice (t-voice) that follows a main melody (m-voice) by selecting pitches from a chord based on proximity and direction rules.

```javascript
const tintinnabuli = new Tintinnabuli(
  [60, 64, 67], // C major triad
  'up',         // direction: 'up', 'down', 'any', 'alternate'
  1             // rank (position in filtered chord)
);
const tVoice = tintinnabuli.generate(melody);
```

### 4. Voice Harmonization
Generates chords based on scale degrees for each note in a melody.

```javascript
const voice = new Voice('major', 'C', [0, 2, 4]); // Major triads
const chords = voice.generate(pitches);
```

## Format Conversion Helpers

The examples include helper functions to convert between different note formats:

- `tuplesToObjects(tuples)` - Converts `[pitch, duration, offset]` arrays to `{pitch, duration, offset}` objects
- `objectsToTuples(objects)` - Converts objects back to tuple format
- `shufflePitches(sequence, seed)` - Shuffles pitches while preserving rhythm

## Integration with jmon-studio

These examples demonstrate how to:

1. Generate musical scales using the `Scale` class
2. Create rhythmic patterns with `isorhythm` (now JMON-native)
3. Apply minimalist transformations with `MinimalismProcess` and `Tintinnabuli` (now JMON-native)
4. Generate harmonic accompaniment with `Voice`
5. Use official JMON utilities (`jm.utils.jmon.*`) for format management
6. Combine multiple techniques to create complex compositions

All algorithms now output JMON-compliant notes with proper "bars:beats:ticks" timing, eliminating the need for format conversion. The results work seamlessly with the full jmon-studio ecosystem for playback, visualization, and format conversion to ABC notation, MIDI, WAV, etc.

## New JMON-Native API

### Official JMON Utilities

The jmon-studio now includes official utilities under `jm.utils.jmon`:

```javascript
// Time conversion
jm.utils.jmon.beatsToTime(4.5)      // "1:0:240"
jm.utils.jmon.timeToBeats("1:2:240") // 6.5 beats

// JMON creation
jm.utils.jmon.createPart(notes, "Track Name")
jm.utils.jmon.createComposition([part1, part2], metadata)

// Format conversion (for legacy compatibility)
jm.utils.jmon.tuplesToJmon(tuples)  // Convert [pitch,dur,offset] to JMON
jm.utils.jmon.jmonToTuples(notes)   // Convert JMON to legacy tuples

// Sequence manipulation
jm.utils.jmon.offsetNotes(notes, 4)          // Offset by 4 beats
jm.utils.jmon.concatenateSequences([seq1, seq2]) // Sequential
jm.utils.jmon.combineSequences([seq1, seq2])     // Parallel
```

### Updated Algorithms

All minimalism algorithms now work natively with JMON:

```javascript
// isorhythm now returns JMON notes by default
const notes = isorhythm([60, 64, 67], [1, 0.5, 0.5]);
// Result: [{ pitch: 60, duration: 1, time: "0:0:0" }, ...]

// MinimalismProcess accepts and returns JMON notes
const process = new MinimalismProcess({ operation: 'additive', direction: 'forward' });
const result = process.generate(notes); // JMON in, JMON out

// Tintinnabuli works with JMON notes
const tintinnabuli = new Tintinnabuli([60, 64, 67], 'up', 1);
const tVoice = tintinnabuli.generate(notes); // JMON in, JMON out
```

## Historical Context

These techniques are inspired by:

- **Steve Reich** - Additive and subtractive processes, phasing
- **Arvo Pärt** - Tintinnabuli technique
- **Terry Riley** - Repetitive structures and cycles
- **Philip Glass** - Additive processes and rhythmic cycles

The implementation follows the patterns established in the Djalgo Python library, adapted for JavaScript and the jmon-studio ecosystem.
