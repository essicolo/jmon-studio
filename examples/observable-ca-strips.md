# Cellular Automata Strip Selection for Musical Composition

This Observable notebook demonstrates how to visually identify and select strips from cellular automata evolution patterns for musical use with JMON Studio.

## 1. Import Required Libraries

```js
// Import JMON Studio CA tools for Observable
import {ObservableCATools, extractCASequence, createJMONTrack} from "https://cdn.jsdelivr.net/npm/jmon-studio/src/algorithms/visualization/cellular-automata/ObservableCATools.js"

// Import JMON Studio core components
import {CellularAutomata} from "https://cdn.jsdelivr.net/npm/jmon-studio/src/algorithms/generative/cellular-automata/CellularAutomata.js"
```

## 2. Generate Cellular Automata Evolution

```js
// Create cellular automata instance
ca = new CellularAutomata({
  width: 200,
  ruleNumber: 150, // Rule 150 creates interesting triangular patterns
  initialState: Array(200).fill(0).map((_, i) => i === 100 ? 1 : 0) // Single cell in center
})

// Generate evolution over 100 generations
ca_history = ca.generate(100)
```

```js
// Display basic information about the CA
md`**Cellular Automata Generated:**
- Rule: ${ca.ruleNumber}
- Width: ${ca_history[0].length} cells
- Generations: ${ca_history.length}
- Total active cells: ${ca_history.flat().reduce((sum, cell) => sum + cell, 0)}`
```

## 3. Interactive Strip Selection

This is where the magic happens! Click and drag on the cellular automata visualization below to select strips that will become musical tracks.

```js
// Interactive strip selector - this creates a viewof input
viewof selectedStrips = ObservableCATools.createStripSelector(ca_history, {
  width: 700,
  height: 350,
  maxStrips: 4,
  stripColors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"] 
})
```

```js
// Show selected strips data
selectedStrips
```

## 4. Visualize Selected Strips

```js
// Create a clean visualization showing the CA with highlighted strips
ObservableCATools.createStripHighlightPlot(ca_history, selectedStrips.strips, {
  width: 700,
  height: 350,
  title: `Cellular Automata Rule ${ca.ruleNumber} with ${selectedStrips.strips.length} Selected Strips`
})
```

## 5. Musical Preview

See how your selected strips will sound as musical sequences:

```js
// Generate musical preview data
musicalPreview = ObservableCATools.previewMusicalSequences(ca_history, selectedStrips.strips, {
  scale: [60, 62, 63, 65, 67, 68, 70], // C major scale starting at middle C
  durations: [0.25, 0.5, 1, 0.5], // Rhythmic pattern
  maxPreviewLength: 30 // Preview first 30 generations
})
```

```js
// Visualize the musical preview
ObservableCATools.createMusicalPreviewPlot(musicalPreview, {
  width: 700,
  height: 300,
  title: "Musical Preview - Piano Roll Style"
})
```

```js
// Show musical data summary
md`**Musical Preview Summary:**
${musicalPreview.map((seq, i) => 
  `- **Strip ${i + 1}** [${seq.stripRange[0]}, ${seq.stripRange[1]}]: ${seq.notes.length} notes, ${seq.totalDuration.toFixed(2)} beats duration`
).join('\n')}`
```

## 6. Generate JMON Tracks

Convert your selected strips into full JMON tracks ready for playback or export:

```js
// Extract complete musical sequences from selected strips
jmonTracks = selectedStrips.strips.map((strip, index) => {
  const [start, end] = strip;
  
  // Extract sequence with full CA history (not just preview)
  const sequence = extractCASequence(ca_history, start, end, {
    scale: [48, 50, 51, 53, 55, 56, 58], // C minor scale, lower octave
    durations: [0.5, 0.5, 1, 2, 1, 1, 0.5, 1.5] // Varied rhythm pattern
  });
  
  // Create JMON track
  return createJMONTrack(sequence, {
    label: `ca-rule${ca.ruleNumber}-strip${index + 1}`,
    midiChannel: index,
    synth: {
      type: ['Synth', 'AMSynth', 'FMSynth', 'PluckSynth'][index % 4],
      options: { 
        envelope: { 
          attack: 0.1 + index * 0.05, 
          release: 0.8 + index * 0.3 
        } 
      }
    }
  });
})
```

```js
// Display JMON tracks summary
md`**Generated JMON Tracks:**
${jmonTracks.map((track, i) => 
  `- **${track.label}**: ${track.notes.length} notes, Channel ${track.midiChannel}, ${track.synth.type}`
).join('\n')}`
```

## 7. Complete JMON Composition

```js
// Create complete JMON composition
fractalComposition = {
  format: 'jmon',
  version: '1.0.0',
  tempo: 120,
  timeSignature: '4/4',
  keySignature: 'C',
  metadata: {
    title: `CA Rule ${ca.ruleNumber} Musical Composition`,
    composer: 'JMON Studio Observable Notebook',
    description: `Musical composition generated from Cellular Automata Rule ${ca.ruleNumber} with ${selectedStrips.strips.length} selected strips`,
    generatedFrom: `CA Rule ${ca.ruleNumber}, strips: ${selectedStrips.strips.map(s => `[${s[0]}, ${s[1]}]`).join(', ')}`
  },
  tracks: jmonTracks
}
```

```js
// Display composition summary
md`**🎼 Complete JMON Composition:**
- **Title:** "${fractalComposition.metadata.title}"
- **Tracks:** ${fractalComposition.tracks.length}
- **Total Notes:** ${fractalComposition.tracks.reduce((sum, track) => sum + track.notes.length, 0)}
- **BPM:** ${fractalComposition.bpm}
- **Key:** ${fractalComposition.keySignature} ${fractalComposition.timeSignature}

**Generated from strips:** ${fractalComposition.metadata.generatedFrom}`
```

## 8. Advanced Usage Examples

### Different CA Rules

Try different cellular automata rules to see how they affect the musical patterns:

```js
// Rule selector
viewof selectedRule = Inputs.select([30, 54, 110, 150, 184], {
  label: "CA Rule:",
  value: 150
})
```

```js
// Generate CA with selected rule
rule_ca = new CellularAutomata({
  width: 150,
  ruleNumber: selectedRule,
  initialState: Array(150).fill(0).map((_, i) => i === 75 ? 1 : 0)
})

rule_ca_history = rule_ca.generate(80)
```

```js
// Quick visualization of the rule
Plot.plot({
  width: 600,
  height: 300,
  title: `Cellular Automata Rule ${selectedRule}`,
  x: { label: "Cell Position" },
  y: { label: "Generation", reverse: true },
  marks: [
    Plot.rect(
      rule_ca_history.flatMap((gen, generation) => 
        gen.map((cell, position) => ({ generation, position, value: cell }))
      ).filter(d => d.value === 1),
      {
        x: "position",
        y: "generation",
        width: 1,
        height: 1,
        fill: "black"
      }
    )
  ]
})
```

### Musical Scale Variations

```js
// Scale selector
viewof musicalScale = Inputs.select([
  { name: "C Major", scale: [60, 62, 64, 65, 67, 69, 71] },
  { name: "C Minor", scale: [60, 62, 63, 65, 67, 68, 70] },
  { name: "Pentatonic", scale: [60, 62, 65, 67, 69] },
  { name: "Blues", scale: [60, 63, 65, 66, 67, 70] },
  { name: "Dorian", scale: [60, 62, 63, 65, 67, 69, 70] }
], {
  label: "Musical Scale:",
  format: d => d.name,
  value: { name: "C Major", scale: [60, 62, 64, 65, 67, 69, 71] }
})
```

## Usage Instructions

1. **Run the cells above** to generate a cellular automata evolution
2. **Click and drag** on the interactive CA visualization to select strips  
3. **Watch the preview** to see how your strips will sound musically
4. **Generate JMON tracks** from your selected strips
5. **Experiment** with different CA rules and musical scales

### Tips for Strip Selection:

- **Dense areas** create more active musical passages
- **Sparse areas** create rhythmic, punctuated patterns  
- **Diagonal patterns** often create interesting melodic contours
- **Vertical patterns** create harmonic clusters
- **Try 2-4 strips** for a balanced composition

### Musical Mapping:

- Each **active cell** in a strip becomes a **note**
- **Horizontal position** within strip determines **pitch** (mapped to scale)
- **Generation number** affects **timing** and **rhythm**
- **Multiple active cells** in same generation create **chords**

The JMON tracks generated can be used with Tone.js for playback, exported to MIDI, or converted to other formats supported by JMON Studio.
