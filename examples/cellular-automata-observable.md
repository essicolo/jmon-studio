# Cellular Automata for Musical Composition in Observable

Interactive notebook for generating music from cellular automata patterns using visual strip selection.

## Overview

This notebook demonstrates how to:
1. Generate cellular automata evolution patterns
2. Visually select interesting strips for musical conversion
3. Preview the musical result before committing
4. Create complete JMON compositions

## 1. Setup and Imports

```js
// Import JMON Studio Observable tools
import {ObservableCATools, extractCASequence, createJMONTrack} from "https://cdn.jsdelivr.net/npm/jmon-studio/src/algorithms/visualization/cellular-automata/ObservableCATools.js"

// Import core JMON Studio components
import {CellularAutomata} from "https://cdn.jsdelivr.net/npm/jmon-studio/src/algorithms/generative/cellular-automata/CellularAutomata.js"
```

## 2. Rule Explorer

First, let's explore different cellular automata rules to see their patterns:

```js
// Rule selector with interesting rules
viewof caRule = Inputs.select([
  {name: "Rule 30 (Chaotic)", value: 30},
  {name: "Rule 54 (Symmetric)", value: 54}, 
  {name: "Rule 110 (Complex)", value: 110},
  {name: "Rule 150 (Triangular)", value: 150},
  {name: "Rule 184 (Traffic)", value: 184}
], {
  label: "Select CA Rule:",
  format: d => d.name,
  value: {name: "Rule 150 (Triangular)", value: 150}
})
```

```js
// Width and generation controls
viewof caWidth = Inputs.range([50, 300], {
  label: "CA Width:",
  step: 10,
  value: 200
})

viewof caGenerations = Inputs.range([50, 200], {
  label: "Generations:",
  step: 10,
  value: 120
})
```

## 3. Generate Cellular Automata

```js
// Create CA instance with selected parameters
ca = new CellularAutomata({
  width: caWidth,
  ruleNumber: caRule.value,
  initialState: Array(caWidth).fill(0).map((_, i) => i === Math.floor(caWidth/2) ? 1 : 0)
})

// Generate evolution
ca_history = ca.generate(caGenerations)
```

```js
// Display CA information
md`**Generated Cellular Automata:**
- **Rule:** ${caRule.name}  
- **Width:** ${ca_history[0].length} cells
- **Generations:** ${ca_history.length}
- **Density:** ${(ca_history.flat().reduce((sum, cell) => sum + cell, 0) / (ca_history.length * ca_history[0].length) * 100).toFixed(1)}% active cells
- **Pattern complexity:** ${ca_history.length > 100 ? 'High' : ca_history.length > 50 ? 'Medium' : 'Low'}`
```

## 4. Quick CA Visualization

```js
// Static visualization of the CA pattern
Plot.plot({
  width: 800,
  height: 400,
  title: `${caRule.name} Evolution`,
  x: { 
    label: "Cell Position",
    domain: [0, ca_history[0].length]
  },
  y: { 
    label: "Generation", 
    reverse: true,
    domain: [0, ca_history.length]
  },
  marks: [
    Plot.rect(
      ca_history.flatMap((generation, genIndex) => 
        generation.map((cell, cellIndex) => ({ 
          generation: genIndex, 
          cell: cellIndex, 
          value: cell 
        }))
      ).filter(d => d.value === 1),
      {
        x: "cell",
        y: "generation", 
        width: 1,
        height: 1,
        fill: "black"
      }
    )
  ]
})
```

## 5. Interactive Strip Selection

**Instructions:** Click and drag horizontally on the CA pattern below to select strips that will become musical tracks. Each strip will be highlighted with a different color.

```js
// Interactive strip selector - the main tool!
viewof selectedStrips = ObservableCATools.createStripSelector(ca_history, {
  width: 800,
  height: 400,
  maxStrips: 5,
  stripColors: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"]
})
```

```js
// Show selected strips data
selectedStrips.strips.length > 0 
  ? md`**Selected Strips:** ${selectedStrips.strips.map((s, i) => `Strip ${i+1}: [${s[0]}, ${s[1]}] (${s[1] - s[0] + 1} cells wide)`).join(' • ')}`
  : md`*No strips selected yet - click and drag on the pattern above*`
```

## 6. Strip Highlight Visualization

```js
// Clean visualization showing selected strips
selectedStrips.strips.length > 0 
  ? ObservableCATools.createStripHighlightPlot(ca_history, selectedStrips.strips, {
      width: 800,
      height: 400,
      title: `${caRule.name} with ${selectedStrips.strips.length} Selected Musical Strips`
    })
  : md`*Select strips above to see highlighted visualization*`
```

## 7. Musical Scale Configuration

```js
// Musical scale selector
viewof musicalScale = Inputs.select([
  { name: "C Major Pentatonic", scale: [60, 62, 65, 67, 69] },
  { name: "C Minor Pentatonic", scale: [60, 63, 65, 67, 70] },
  { name: "C Major", scale: [60, 62, 64, 65, 67, 69, 71] },
  { name: "C Minor", scale: [60, 62, 63, 65, 67, 68, 70] },
  { name: "Dorian", scale: [60, 62, 63, 65, 67, 69, 70] },
  { name: "Phrygian", scale: [60, 61, 63, 65, 67, 68, 70] },
  { name: "Blues", scale: [60, 63, 65, 66, 67, 70, 72] },
  { name: "Chromatic", scale: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71] }
], {
  label: "Musical Scale:",
  format: d => d.name,
  value: { name: "C Minor Pentatonic", scale: [60, 63, 65, 67, 70] }
})
```

```js
// Rhythm pattern selector  
viewof rhythmPattern = Inputs.select([
  { name: "Even Quarter Notes", pattern: [1, 1, 1, 1] },
  { name: "Syncopated", pattern: [0.5, 0.5, 1, 0.5, 1.5] },
  { name: "Triplets", pattern: [0.33, 0.33, 0.34, 1] },
  { name: "Complex", pattern: [0.25, 0.5, 1, 2, 1, 0.5, 0.75] },
  { name: "Minimalist", pattern: [2, 2, 1, 1] }
], {
  label: "Rhythm Pattern:",
  format: d => d.name,
  value: { name: "Syncopated", pattern: [0.5, 0.5, 1, 0.5, 1.5] }
})
```

## 8. Musical Preview

```js
// Generate musical preview (first 40 generations for responsiveness)
musicalPreview = selectedStrips.strips.length > 0
  ? ObservableCATools.previewMusicalSequences(ca_history, selectedStrips.strips, {
      scale: musicalScale.scale,
      durations: rhythmPattern.pattern,
      maxPreviewLength: 40
    })
  : []
```

```js
// Musical preview visualization
musicalPreview.length > 0 
  ? ObservableCATools.createMusicalPreviewPlot(musicalPreview, {
      width: 800,
      height: 350,
      title: `Musical Preview - ${musicalScale.name} Scale with ${rhythmPattern.name} Rhythm`
    })
  : md`*Select strips to see musical preview*`
```

```js
// Musical preview summary
musicalPreview.length > 0 
  ? md`**Preview Summary:**
${musicalPreview.map((seq, i) => 
  `- **Strip ${i + 1}** [${seq.stripRange[0]}, ${seq.stripRange[1]}]: ${seq.notes.length} notes, ${seq.totalDuration.toFixed(2)} beats (${(seq.totalDuration / 4).toFixed(1)} measures)`
).join('\n')}

**Total preview duration:** ${Math.max(...musicalPreview.map(s => s.totalDuration)).toFixed(2)} beats`
  : ""
```

## 9. Generate Complete JMON Tracks

```js
// Generate full JMON tracks from selected strips
jmonTracks = selectedStrips.strips.length > 0 
  ? selectedStrips.strips.map((strip, index) => {
      const [start, end] = strip;
      
      // Extract complete sequence (all generations)
      const sequence = extractCASequence(ca_history, start, end, {
        scale: musicalScale.scale,
        durations: rhythmPattern.pattern
      });
      
      // Create JMON track with appropriate synth
      const synthTypes = ['Synth', 'AMSynth', 'FMSynth', 'PluckSynth', 'MonoSynth'];
      
      return createJMONTrack(sequence, {
        label: `ca-rule${caRule.value}-strip${index + 1}`,
        midiChannel: index,
        synth: {
          type: synthTypes[index % synthTypes.length],
          options: { 
            envelope: { 
              attack: 0.05 + index * 0.03, 
              decay: 0.1,
              sustain: 0.8,
              release: 0.5 + index * 0.2 
            },
            oscillator: {
              type: ['sine', 'square', 'triangle', 'sawtooth'][index % 4]
            }
          }
        }
      });
    })
  : []
```

```js
// JMON tracks summary
jmonTracks.length > 0 
  ? md`**Generated JMON Tracks:**
${jmonTracks.map((track, i) => 
  `- **${track.label}**: ${track.notes.length} notes, Ch.${track.midiChannel}, ${track.synth.type} (${track.synth.options.oscillator.type} wave)`
).join('\n')}

**Total composition notes:** ${jmonTracks.reduce((sum, track) => sum + track.notes.length, 0)}`
  : md`*No tracks generated - select strips first*`
```

## 10. Complete JMON Composition

```js
// Create complete JMON composition object
fractalComposition = jmonTracks.length > 0 
  ? {
      format: 'jmon',
      version: '1.0.0',
      bpm: 120,
      timeSignature: '4/4',
      keySignature: 'C',
      metadata: {
        name: `Cellular Automata ${caRule.name} Composition`,
        composer: 'JMON Studio Observable',
        description: `Musical composition generated from ${caRule.name} using ${selectedStrips.strips.length} selected strips`,
        scale: musicalScale.name,
        rhythm: rhythmPattern.name,
        generatedFrom: `CA Rule ${caRule.value}, strips: ${selectedStrips.strips.map(s => `[${s[0]}, ${s[1]}]`).join(', ')}`,
        totalDuration: Math.max(...jmonTracks.map(track => 
          Math.max(...track.notes.map(note => note.time + note.duration))
        ))
      },
      tracks: jmonTracks
    }
  : null
```

```js
// Composition summary
fractalComposition
  ? md`## 🎼 Generated Composition

**"${fractalComposition.metadata.name}"**

- **Tracks:** ${fractalComposition.tracks.length} 
- **Total Notes:** ${fractalComposition.tracks.reduce((sum, track) => sum + track.notes.length, 0)}
- **Duration:** ${fractalComposition.metadata.totalDuration.toFixed(1)} beats (${(fractalComposition.metadata.totalDuration / 4).toFixed(1)} measures)
- **BPM:** ${fractalComposition.bpm}
- **Scale:** ${fractalComposition.metadata.scale}
- **Rhythm:** ${fractalComposition.metadata.rhythm}

**Generated from:** ${fractalComposition.metadata.generatedFrom}

---

### Export Options:
- Copy the \`fractalComposition\` object for use with Tone.js
- Export to MIDI using JMON Studio converters  
- Use with Observable Audio for immediate playback`
  : md`*Generate strips and tracks to see composition summary*`
```

## 11. Usage Tips

### Strip Selection Strategy:
- **Dense regions** → Rich musical textures with many simultaneous notes
- **Sparse regions** → Rhythmic, punctuated patterns  
- **Diagonal patterns** → Melodic lines with pitch contour
- **Vertical clusters** → Harmonic chord progressions
- **Edge regions** → Often have interesting boundary effects

### Musical Considerations:
- **2-3 strips** work well for melody + harmony
- **4-5 strips** create rich ensemble textures
- **Wide strips** (20+ cells) → Complex harmonies
- **Narrow strips** (5-10 cells) → Focused melodic lines

### CA Rule Characteristics:
- **Rule 30:** Chaotic, good for unpredictable rhythms
- **Rule 54:** Symmetric, creates balanced musical phrases
- **Rule 110:** Complex but structured, interesting for counterpoint
- **Rule 150:** Triangular patterns, good for melodic sequences
- **Rule 184:** Traffic-like flows, creates wave-like musical motion

### Performance Tips:
- Start with **Rule 150** and **C Minor Pentatonic** for pleasant results
- Use **Syncopated** rhythm for more interesting timing
- Try different **strip widths** for varied musical density
- **Preview** before generating full tracks to save computation

---

*This notebook demonstrates the power of visual pattern recognition in algorithmic composition. The cellular automata patterns that look musically interesting often translate into compelling musical sequences!*
