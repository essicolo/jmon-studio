# Mandelbrot Fractal Music Composition in Observable

This guide demonstrates how to create music from Mandelbrot fractal sequences using the jmon-studio library in Observable notebooks. The Mandelbrot set provides rich mathematical patterns perfect for algorithmic composition.

## Setup

First, import the necessary libraries and modules:

```javascript
jmon = require("jmon-studio@latest")
```

```javascript
import { ObservableMandelbrotTools, createMandelbrotTrack } from "jmon-studio/src/algorithms/visualization/fractals/ObservableMandelbrotTools.js"
```

## 1. Generate Mandelbrot Fractal Data

Create the foundational fractal data with customizable parameters:

```javascript
viewof mandelbrotConfig = {
  const form = html`
    <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Mandelbrot Configuration</h3>
      <label>Width: <input name="width" type="range" min="32" max="128" value="64"></label><br>
      <label>Height: <input name="height" type="range" min="32" max="128" value="64"></label><br>
      <label>Max Iterations: <input name="maxIterations" type="range" min="50" max="300" value="100"></label><br>
      <label>X Min: <input name="xMin" type="number" value="-2.5" step="0.1"></label><br>
      <label>X Max: <input name="xMax" type="number" value="1.0" step="0.1"></label><br>
      <label>Y Min: <input name="yMin" type="number" value="-1.25" step="0.1"></label><br>
      <label>Y Max: <input name="yMax" type="number" value="1.25" step="0.1"></label><br>
      <button type="button">Generate Mandelbrot</button>
    </div>
  `;
  
  const button = form.querySelector('button');
  
  button.onclick = () => {
    const config = {
      width: +form.width.value,
      height: +form.height.value,
      maxIterations: +form.maxIterations.value,
      xMin: +form.xMin.value,
      xMax: +form.xMax.value,
      yMin: +form.yMin.value,
      yMax: +form.yMax.value
    };
    form.value = config;
    form.dispatchEvent(new CustomEvent("input"));
  };
  
  // Set initial value
  form.value = {
    width: 64, height: 64, maxIterations: 100,
    xMin: -2.5, xMax: 1.0, yMin: -1.25, yMax: 1.25
  };
  
  return form;
}
```

```javascript
mandelbrotData = {
  if (!mandelbrotConfig) return [];
  
  const { width, height, maxIterations, xMin, xMax, yMin, yMax } = mandelbrotConfig;
  const fractal = new jmon.algorithms.fractals.Mandelbrot(width, height, maxIterations);
  
  return fractal.generateFractal(xMin, xMax, yMin, yMax);
}
```

## 2. Interactive Mandelbrot Visualization

Display the fractal with an interactive heatmap:

```javascript
ObservableMandelbrotTools.createInteractiveMandelbrotPlot(mandelbrotData, {
  width: 500,
  height: 500,
  title: "Mandelbrot Set Visualization",
  colorScheme: "plasma",
  ...mandelbrotConfig
})
```

## 3. Interactive Sequence Path Selection

Create an interactive tool to select extraction paths from the Mandelbrot fractal:

```javascript
viewof selectedPaths = {
  if (!mandelbrotData.length) {
    return html`<div>Generate Mandelbrot data first</div>`;
  }
  
  const selector = ObservableMandelbrotTools.createSequenceSelector(mandelbrotData, {
    width: 600,
    height: 400,
    maxPaths: 4,
    pathColors: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"],
    ...mandelbrotConfig
  });
  
  selector.addEventListener("pathchange", (e) => {
    selector.value = e.detail;
    selector.dispatchEvent(new CustomEvent("input"));
  });
  
  return selector;
}
```

## 4. Path Information Display

Show detailed information about selected paths:

```javascript
pathInfo = {
  if (!selectedPaths?.paths?.length) {
    return html`<div style="padding: 10px; color: #666;">
      No paths selected. Click extraction methods above to select up to 4 paths.
    </div>`;
  }
  
  return html`
    <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      <h3>Selected Paths (${selectedPaths.paths.length})</h3>
      ${selectedPaths.paths.map((path, i) => html`
        <div style="margin: 10px 0; padding: 5px; border-left: 4px solid ${path.color};">
          <strong>${path.type.charAt(0).toUpperCase() + path.type.slice(1)}</strong>
          <br>Length: ${path.sequence.length} values
          <br>Range: ${Math.min(...path.sequence)} - ${Math.max(...path.sequence)}
          <br>First 10 values: ${path.sequence.slice(0, 10).join(', ')}${path.sequence.length > 10 ? '...' : ''}
        </div>
      `)}
    </div>
  `;
}
```

## 5. Musical Scale and Configuration

Configure musical parameters for sequence conversion:

```javascript
viewof musicalConfig = {
  const form = html`
    <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Musical Configuration</h3>
      <label>Scale: 
        <select name="scale">
          <option value="major">C Major</option>
          <option value="minor">C Minor</option>
          <option value="pentatonic">C Pentatonic</option>
          <option value="chromatic">Chromatic</option>
          <option value="dorian">C Dorian</option>
        </select>
      </label><br>
      <label>Base Octave: <input name="baseOctave" type="range" min="3" max="6" value="4"></label> (${form?.baseOctave?.value || 4})<br>
      <label>Max Sequence Length: <input name="maxLength" type="range" min="8" max="64" value="32"></label> (${form?.maxLength?.value || 32})<br>
      <label>Tempo Factor: <input name="tempoFactor" type="range" min="0.5" max="3" step="0.1" value="1"></label> (${form?.tempoFactor?.value || 1}x)<br>
    </div>
  `;
  
  const getScale = (scaleName, baseOctave) => {
    const base = baseOctave * 12;
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11].map(n => base + n + 60),
      minor: [0, 2, 3, 5, 7, 8, 10].map(n => base + n + 60),
      pentatonic: [0, 2, 4, 7, 9].map(n => base + n + 60),
      chromatic: Array.from({length: 12}, (_, i) => base + i + 60),
      dorian: [0, 2, 3, 5, 7, 9, 10].map(n => base + n + 60)
    };
    return scales[scaleName] || scales.major;
  };
  
  form.addEventListener("input", () => {
    const scale = getScale(form.scale.value, +form.baseOctave.value);
    form.value = {
      scale,
      scaleName: form.scale.value,
      baseOctave: +form.baseOctave.value,
      maxLength: +form.maxLength.value,
      tempoFactor: +form.tempoFactor.value,
      durations: [0.5, 0.75, 1, 0.25].map(d => d * +form.tempoFactor.value)
    };
  });
  
  // Initial value
  form.value = {
    scale: getScale("major", 4),
    scaleName: "major",
    baseOctave: 4,
    maxLength: 32,
    tempoFactor: 1,
    durations: [0.5, 0.75, 1, 0.25]
  };
  
  return form;
}
```

## 6. Musical Sequence Preview

Convert fractal paths to musical sequences and visualize:

```javascript
musicalSequences = {
  if (!selectedPaths?.paths?.length || !musicalConfig) {
    return [];
  }
  
  return ObservableMandelbrotTools.previewMusicalSequences(selectedPaths.paths, {
    scale: musicalConfig.scale,
    durations: musicalConfig.durations,
    maxLength: musicalConfig.maxLength
  });
}
```

```javascript
ObservableMandelbrotTools.createMusicalPreviewPlot(musicalSequences, {
  width: 800,
  height: 400,
  title: "Mandelbrot Musical Sequences Preview"
})
```

## 7. Musical Sequence Details

Display detailed musical information:

```javascript
musicalDetails = {
  if (!musicalSequences.length) {
    return html`<div style="color: #666;">No musical sequences generated</div>`;
  }
  
  return html`
    <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      <h3>Musical Sequence Details</h3>
      ${musicalSequences.map(seq => html`
        <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 3px;">
          <h4 style="color: #333; margin-top: 0;">
            ${seq.pathType.charAt(0).toUpperCase() + seq.pathType.slice(1)} Path
            <span style="font-size: 0.8em; color: #666;">(${seq.notes.length} notes, ${seq.totalDuration.toFixed(2)} beats)</span>
          </h4>
          
          <div style="font-family: monospace; font-size: 12px; margin: 10px 0;">
            <strong>MIDI Notes:</strong> ${seq.notes.slice(0, 8).map(n => n.pitch).join(', ')}${seq.notes.length > 8 ? '...' : ''}<br>
            <strong>Durations:</strong> ${seq.notes.slice(0, 8).map(n => n.duration).join(', ')}${seq.notes.length > 8 ? '...' : ''}<br>
            <strong>Times:</strong> ${seq.notes.slice(0, 8).map(n => n.time.toFixed(2)).join(', ')}${seq.notes.length > 8 ? '...' : ''}
          </div>
        </div>
      `)}
    </div>
  `;
}
```

## 8. Generate JMON Tracks

Create JMON-compatible tracks from the musical sequences:

```javascript
jmonTracks = {
  if (!musicalSequences.length) return [];
  
  return musicalSequences.map((seq, i) => {
    const trackConfig = {
      label: `mandelbrot-${seq.pathType}`,
      midiChannel: i,
      synth: {
        type: i === 0 ? 'Synth' : i === 1 ? 'FMSynth' : i === 2 ? 'AMSynth' : 'PluckSynth',
        options: {
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 1 }
        }
      }
    };
    
    return createMandelbrotTrack(seq.notes, trackConfig);
  });
}
```

## 9. Complete JMON Composition

Assemble the final composition:

```javascript
mandelbrotComposition = {
  if (!jmonTracks.length) {
    return { 
      meta: { title: "No Mandelbrot composition - select paths first" },
      tracks: []
    };
  }
  
  return {
    meta: {
      title: "Mandelbrot Fractal Composition",
      description: "Generated from Mandelbrot set patterns",
      composer: "jmon-studio fractal algorithms",
      created: new Date().toISOString(),
      parameters: {
        fractal: mandelbrotConfig,
        musical: {
          scale: musicalConfig.scaleName,
          baseOctave: musicalConfig.baseOctave,
          tempoFactor: musicalConfig.tempoFactor
        },
        paths: selectedPaths.paths.map(p => ({
          type: p.type,
          sequenceLength: p.sequence.length
        }))
      }
    },
    tracks: jmonTracks
  };
}
```

## 10. Play and Export

Create playback and export options:

```javascript
playback = {
  if (!mandelbrotComposition.tracks?.length) {
    return html`<div style="color: #666;">No composition to play - generate tracks first</div>`;
  }
  
  const div = html`
    <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Playback & Export</h3>
      <button id="play">▶ Play Composition</button>
      <button id="stop">⏹ Stop</button>
      <button id="download">💾 Download JMON</button>
      <button id="downloadMidi">🎵 Download MIDI</button>
      <div id="status" style="margin-top: 10px; font-size: 12px; color: #666;"></div>
    </div>
  `;
  
  let isPlaying = false;
  const status = div.querySelector('#status');
  
  div.querySelector('#play').onclick = async () => {
    if (isPlaying) return;
    
    try {
      isPlaying = true;
      status.textContent = 'Playing...';
      await jmon.play(mandelbrotComposition);
      status.textContent = 'Playback completed';
      isPlaying = false;
    } catch (err) {
      status.textContent = `Playback error: ${err.message}`;
      isPlaying = false;
    }
  };
  
  div.querySelector('#stop').onclick = () => {
    // Note: stopping requires access to Tone.Transport which isn't directly exposed
    status.textContent = 'Stop requested';
    isPlaying = false;
  };
  
  div.querySelector('#download').onclick = () => {
    const blob = new Blob([JSON.stringify(mandelbrotComposition, null, 2)], 
                         { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mandelbrot-composition.json';
    a.click();
    status.textContent = 'JMON file downloaded';
  };
  
  div.querySelector('#downloadMidi').onclick = async () => {
    try {
      const midiData = jmon.converters.jmonToMidi(mandelbrotComposition);
      const blob = new Blob([midiData], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mandelbrot-composition.mid';
      a.click();
      status.textContent = 'MIDI file downloaded';
    } catch (err) {
      status.textContent = `MIDI export error: ${err.message}`;
    }
  };
  
  return div;
}
```

## 11. Composition Summary

Display final composition statistics:

```javascript
compositionSummary = {
  if (!mandelbrotComposition.tracks?.length) {
    return html`<div style="color: #666;">No composition generated</div>`;
  }
  
  const totalNotes = mandelbrotComposition.tracks.reduce((sum, track) => sum + (track.notes?.length || 0), 0);
  const totalDuration = Math.max(...mandelbrotComposition.tracks.map(track => 
    Math.max(...(track.notes || []).map(note => note.time + note.duration), 0)
  ));
  
  return html`
    <div style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: white;">🎵 Mandelbrot Composition Summary</h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                  gap: 15px; margin: 15px 0;">
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px;">
          <div style="font-size: 24px; font-weight: bold;">${mandelbrotComposition.tracks.length}</div>
          <div style="font-size: 12px; opacity: 0.8;">Tracks</div>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px;">
          <div style="font-size: 24px; font-weight: bold;">${totalNotes}</div>
          <div style="font-size: 12px; opacity: 0.8;">Total Notes</div>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px;">
          <div style="font-size: 24px; font-weight: bold;">${totalDuration.toFixed(1)}s</div>
          <div style="font-size: 12px; opacity: 0.8;">Duration</div>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px;">
          <div style="font-size: 24px; font-weight: bold;">${mandelbrotConfig?.width}×${mandelbrotConfig?.height}</div>
          <div style="font-size: 12px; opacity: 0.8;">Fractal Resolution</div>
        </div>
      </div>
      
      <div style="font-size: 12px; opacity: 0.9; margin-top: 10px;">
        <strong>Paths:</strong> ${selectedPaths?.paths?.map(p => p.type).join(', ') || 'none'}<br>
        <strong>Scale:</strong> ${musicalConfig?.scaleName || 'none'} (Octave ${musicalConfig?.baseOctave || 4})<br>
        <strong>Generated:</strong> ${new Date().toLocaleString()}
      </div>
    </div>
  `;
}
```

## Usage Instructions

1. **Generate Fractal**: Adjust the Mandelbrot parameters and click "Generate Mandelbrot"
2. **Select Paths**: Click the extraction method buttons to select up to 4 different sequence paths
3. **Configure Music**: Choose scale, octave, and timing parameters
4. **Preview**: View the musical sequences in the preview plot
5. **Play**: Use the playback controls to hear your composition
6. **Export**: Download as JMON or MIDI files for use in other applications

## Advanced Techniques

### Custom Sequence Extraction
Create your own extraction methods by extending the `ObservableMandelbrotTools` class.

### Multi-layered Compositions
Generate multiple Mandelbrot sets with different parameters and combine their sequences.

### Rhythmic Patterns
Use the iteration count patterns to drive rhythmic elements, not just pitch.

### Harmonic Analysis
Analyze the mathematical properties of your fractal sequences to understand their musical characteristics.

This interactive approach allows for real-time exploration of how mathematical fractal patterns translate into musical structures, providing both educational insights and creative composition tools.
