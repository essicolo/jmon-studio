# Interactive Genetic Algorithm Music Composition in Observable

This guide demonstrates how to create and evolve musical phrases using genetic algorithms in Observable notebooks. The Darwin class enables real-time evolution of musical content based on customizable fitness criteria.

## Setup

Import the necessary libraries and modules:

```javascript
jmon = require("jmon-studio@latest")
```

```javascript
import * as Plot from "@observablehq/plot"
```

## 1. Initial Musical Material

Define your starting musical phrase:

```javascript
viewof initialPhrase = {
  const examples = {
    "Twinkle Twinkle Little Star": [
      [60, 1.0, 0.0], [60, 1.0, 1.0], [67, 1.0, 2.0], [67, 1.0, 3.0],
      [69, 1.0, 4.0], [69, 1.0, 5.0], [67, 2.0, 6.0], [65, 1.0, 8.0],
      [65, 1.0, 9.0], [64, 1.0, 10.0], [64, 1.0, 11.0], [62, 1.0, 12.0],
      [62, 1.0, 13.0], [60, 2.0, 14.0]
    ],
    "Simple Scale": [
      [60, 1.0, 0.0], [62, 1.0, 1.0], [64, 1.0, 2.0], [65, 1.0, 3.0],
      [67, 1.0, 4.0], [69, 1.0, 5.0], [71, 1.0, 6.0], [72, 1.0, 7.0]
    ],
    "Custom Pattern": [
      [60, 0.5, 0.0], [67, 0.5, 0.5], [64, 1.0, 1.0], [69, 0.5, 2.0],
      [65, 0.5, 2.5], [62, 1.0, 3.0]
    ]
  };
  
  const form = html`
    <div style="padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Initial Musical Phrase</h3>
      <label>
        Select example: 
        <select name="example">
          ${Object.keys(examples).map(key => `<option value="${key}">${key}</option>`)}
        </select>
      </label>
      <br><br>
      <label>
        Or enter custom phrase (JSON format):<br>
        <textarea name="custom" rows="4" cols="50" placeholder="[[60,1.0,0.0], [67,1.0,1.0], ...]"></textarea>
      </label>
      <br><br>
      <button type="button">Set Phrase</button>
    </div>
  `;
  
  const button = form.querySelector('button');
  const select = form.querySelector('select[name="example"]');
  const textarea = form.querySelector('textarea[name="custom"]');
  
  button.onclick = () => {
    let phrase;
    if (textarea.value.trim()) {
      try {
        phrase = JSON.parse(textarea.value);
      } catch (e) {
        alert('Invalid JSON format');
        return;
      }
    } else {
      phrase = examples[select.value];
    }
    
    form.value = phrase;
    form.dispatchEvent(new CustomEvent("input"));
  };
  
  // Set initial value
  form.value = examples["Twinkle Twinkle Little Star"];
  
  return form;
}
```

## 2. Evolution Parameters

Configure the genetic algorithm parameters:

```javascript
viewof evolutionParams = {
  const form = html`
    <div style="padding: 15px; border: 1px solid #ccc; border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h3>Population Settings</h3>
        <label>Population Size: <input name="populationSize" type="range" min="20" max="500" value="100" style="width: 100%;"></label>
        <span>${form?.populationSize?.value || 100}</span><br>
        
        <label>Mutation Rate: <input name="mutationRate" type="range" min="0.01" max="0.2" step="0.01" value="0.05" style="width: 100%;"></label>
        <span>${((form?.mutationRate?.value || 0.05) * 100).toFixed(0)}%</span><br>
        
        <label>Generations: <input name="generations" type="range" min="10" max="200" value="50" style="width: 100%;"></label>
        <span>${form?.generations?.value || 50}</span><br>
        
        <label>Selection Size: <input name="selectionSize" type="range" min="5" max="50" value="10" style="width: 100%;"></label>
        <span>${form?.selectionSize?.value || 10}</span>
      </div>
      
      <div>
        <h3>Musical Scale</h3>
        <label>
          Scale: 
          <select name="scale" style="width: 100%;">
            <option value="major">C Major</option>
            <option value="minor">C Minor</option>
            <option value="dorian">C Dorian</option>
            <option value="pentatonic">C Pentatonic</option>
            <option value="chromatic">Chromatic</option>
          </select>
        </label><br><br>
        
        <label>Time Resolution:</label><br>
        <label>Min Duration: <input name="minDuration" type="number" min="0.125" max="2" step="0.125" value="0.25" style="width: 60px;"></label>
        <label>Max Duration: <input name="maxDuration" type="number" min="1" max="8" step="0.5" value="4" style="width: 60px;"></label><br>
        
        <label>Measure Length: <input name="measureLength" type="number" min="2" max="8" value="4" style="width: 60px;"></label>
      </div>
    </div>
  `;
  
  // Update display values
  form.addEventListener("input", () => {
    const spans = form.querySelectorAll('span');
    spans[0].textContent = form.populationSize.value;
    spans[1].textContent = (form.mutationRate.value * 100).toFixed(0) + '%';
    spans[2].textContent = form.generations.value;
    spans[3].textContent = form.selectionSize.value;
    
    const scaleMap = {
      major: [60, 62, 64, 65, 67, 69, 71, 72],
      minor: [60, 62, 63, 65, 67, 68, 70, 72],
      dorian: [60, 62, 63, 65, 67, 69, 70, 72],
      pentatonic: [60, 62, 64, 67, 69, 72],
      chromatic: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]
    };
    
    form.value = {
      populationSize: +form.populationSize.value,
      mutationRate: +form.mutationRate.value,
      generations: +form.generations.value,
      selectionSize: +form.selectionSize.value,
      scale: scaleMap[form.scale.value],
      scaleName: form.scale.value,
      timeResolution: [+form.minDuration.value, +form.maxDuration.value],
      measureLength: +form.measureLength.value
    };
  });
  
  // Trigger initial update
  form.dispatchEvent(new CustomEvent("input"));
  
  return form;
}
```

## 3. Fitness Target Configuration

Set target values for musical evolution:

```javascript
viewof fitnessTargets = {
  const form = html`
    <div style="padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Fitness Targets & Weights</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; font-size: 12px;">
        <div><strong>Metric</strong></div>
        <div><strong>Pitch Target</strong></div>
        <div><strong>Duration Target</strong></div>
        <div><strong>Weight</strong></div>
        
        <div>Gini Diversity:</div>
        <div><input name="gini_pitch" type="number" min="0" max="1" step="0.05" value="0.2" style="width: 60px;"></div>
        <div><input name="gini_duration" type="number" min="0" max="1" step="0.05" value="0.5" style="width: 60px;"></div>
        <div><input name="gini_weight" type="range" min="0" max="20" value="5" style="width: 80px;"></div>
        
        <div>Balance:</div>
        <div><input name="balance_pitch" type="number" min="0" max="1" step="0.05" value="0.5" style="width: 60px;"></div>
        <div><input name="balance_duration" type="number" min="0" max="1" step="0.05" value="0.1" style="width: 60px;"></div>
        <div><input name="balance_weight" type="range" min="0" max="20" value="3" style="width: 80px;"></div>
        
        <div>Motif Strength:</div>
        <div><input name="motif_pitch" type="number" min="0" max="1" step="0.05" value="0.8" style="width: 60px;"></div>
        <div><input name="motif_duration" type="number" min="0" max="1" step="0.05" value="0.5" style="width: 60px;"></div>
        <div><input name="motif_weight" type="range" min="0" max="20" value="15" style="width: 80px;"></div>
        
        <div>Dissonance:</div>
        <div><input name="dissonance_pitch" type="number" min="0" max="1" step="0.05" value="0.05" style="width: 60px;"></div>
        <div><input name="dissonance_duration" type="number" min="0" max="1" step="0.05" value="0" style="width: 60px;"></div>
        <div><input name="dissonance_weight" type="range" min="0" max="20" value="8" style="width: 80px;"></div>
        
        <div>Rhythmic Fit:</div>
        <div><input name="rhythmic_pitch" type="number" min="0" max="1" step="0.05" value="0" style="width: 60px;"></div>
        <div><input name="rhythmic_duration" type="number" min="0" max="1" step="0.05" value="1.0" style="width: 60px;"></div>
        <div><input name="rhythmic_weight" type="range" min="0" max="20" value="10" style="width: 80px;"></div>
      </div>
    </div>
  `;
  
  form.addEventListener("input", () => {
    form.value = {
      targets: {
        gini: [+form.gini_pitch.value, +form.gini_duration.value, 0],
        balance: [+form.balance_pitch.value, +form.balance_duration.value, 0],
        motif: [+form.motif_pitch.value, +form.motif_duration.value, 0],
        dissonance: [+form.dissonance_pitch.value, +form.dissonance_duration.value, 0],
        rhythmic: [+form.rhythmic_pitch.value, +form.rhythmic_duration.value, 0],
        rest: [0, 0, 0]
      },
      weights: {
        gini: [+form.gini_weight.value, +form.gini_weight.value, 0],
        balance: [+form.balance_weight.value, +form.balance_weight.value, 0],
        motif: [+form.motif_weight.value, +form.motif_weight.value, 0],
        dissonance: [+form.dissonance_weight.value, 0, 0],
        rhythmic: [0, +form.rhythmic_weight.value, 0],
        rest: [1, 0, 0]
      }
    };
  });
  
  // Trigger initial update
  form.dispatchEvent(new CustomEvent("input"));
  
  return form;
}
```

## 4. Evolution Control & Monitoring

Real-time evolution with progress monitoring:

```javascript
viewof evolutionControl = {
  if (!initialPhrase || !evolutionParams || !fitnessTargets) {
    return html`<div>Configure parameters above first</div>`;
  }
  
  const container = html`
    <div style="padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Evolution Control</h3>
      <button id="start" style="padding: 10px 20px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 4px;">
        🧬 Start Evolution
      </button>
      <button id="pause" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;" disabled>
        ⏸ Pause
      </button>
      <button id="reset" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">
        🔄 Reset
      </button>
      
      <div id="status" style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <div><strong>Status:</strong> <span id="statusText">Ready to evolve</span></div>
        <div><strong>Generation:</strong> <span id="generation">0</span> / ${evolutionParams.generations}</div>
        <div><strong>Best Fitness:</strong> <span id="bestFitness">-</span></div>
        <div><strong>Population Fitness:</strong> <span id="avgFitness">-</span></div>
      </div>
      
      <div id="progress" style="width: 100%; background: #ddd; border-radius: 4px; height: 20px; overflow: hidden;">
        <div id="progressBar" style="width: 0%; background: #4CAF50; height: 100%; transition: width 0.3s;"></div>
      </div>
    </div>
  `;
  
  let darwin = null;
  let evolutionInterval = null;
  let currentGeneration = 0;
  let evolutionData = { scores: [], individuals: [], generations: 0 };
  
  const statusText = container.querySelector('#statusText');
  const generationSpan = container.querySelector('#generation');
  const bestFitnessSpan = container.querySelector('#bestFitness');
  const avgFitnessSpan = container.querySelector('#avgFitness');
  const progressBar = container.querySelector('#progressBar');
  
  const startBtn = container.querySelector('#start');
  const pauseBtn = container.querySelector('#pause');
  const resetBtn = container.querySelector('#reset');
  
  startBtn.onclick = () => {
    if (!darwin) {
      // Initialize Darwin
      const config = {
        initialPhrases: [initialPhrase],
        populationSize: evolutionParams.populationSize,
        mutationRate: evolutionParams.mutationRate,
        scale: evolutionParams.scale,
        measureLength: evolutionParams.measureLength,
        timeResolution: evolutionParams.timeResolution,
        weights: fitnessTargets.weights,
        targets: fitnessTargets.targets,
        seed: Math.floor(Math.random() * 1000)
      };
      
      darwin = new jmon.generative.genetic.Darwin(config);
    }
    
    statusText.textContent = 'Evolving...';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    evolutionInterval = setInterval(() => {
      if (currentGeneration >= evolutionParams.generations) {
        pauseBtn.click();
        return;
      }
      
      const stats = darwin.evolve(evolutionParams.selectionSize);
      currentGeneration = stats.generation;
      
      // Update UI
      generationSpan.textContent = currentGeneration;
      bestFitnessSpan.textContent = stats.bestFitness.toFixed(3);
      avgFitnessSpan.textContent = stats.averageFitness.toFixed(3);
      
      const progress = (currentGeneration / evolutionParams.generations) * 100;
      progressBar.style.width = progress + '%';
      
      // Store evolution data
      evolutionData.scores.push(stats.bestFitness);
      evolutionData.individuals.push(darwin.getBestIndividual());
      evolutionData.generations = currentGeneration;
      
      // Update container value for reactivity
      container.value = {
        darwin,
        evolutionData,
        currentGeneration,
        isComplete: currentGeneration >= evolutionParams.generations
      };
      container.dispatchEvent(new CustomEvent("input"));
      
      if (currentGeneration >= evolutionParams.generations) {
        statusText.textContent = 'Evolution complete!';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    }, 100); // Evolution speed: 10 generations per second
  };
  
  pauseBtn.onclick = () => {
    if (evolutionInterval) {
      clearInterval(evolutionInterval);
      evolutionInterval = null;
    }
    statusText.textContent = 'Paused';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  };
  
  resetBtn.onclick = () => {
    if (evolutionInterval) {
      clearInterval(evolutionInterval);
      evolutionInterval = null;
    }
    darwin = null;
    currentGeneration = 0;
    evolutionData = { scores: [], individuals: [], generations: 0 };
    
    statusText.textContent = 'Ready to evolve';
    generationSpan.textContent = '0';
    bestFitnessSpan.textContent = '-';
    avgFitnessSpan.textContent = '-';
    progressBar.style.width = '0%';
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    container.value = null;
    container.dispatchEvent(new CustomEvent("input"));
  };
  
  return container;
}
```

## 5. Real-time Fitness Evolution Plot

```javascript
Plot.plot({
  title: "Fitness Evolution Over Generations",
  width: 800,
  height: 300,
  x: { label: "Generation" },
  y: { label: "Fitness Score" },
  marks: [
    Plot.line(
      evolutionControl?.evolutionData?.scores?.map((score, i) => ({ generation: i, fitness: score })) || [],
      { x: "generation", y: "fitness", stroke: "#1f77b4", strokeWidth: 2 }
    ),
    Plot.dot(
      evolutionControl?.evolutionData?.scores?.map((score, i) => ({ generation: i, fitness: score })) || [],
      { x: "generation", y: "fitness", fill: "#1f77b4", r: 3 }
    )
  ]
})
```

## 6. Musical Results Comparison

Display and play the evolved musical phrase:

```javascript
musicalResults = {
  if (!evolutionControl?.darwin) return null;
  
  const bestIndividual = evolutionControl.darwin.getBestIndividual();
  if (!bestIndividual) return null;
  
  // Analyze initial phrase
  const initialPitches = initialPhrase.map(note => note[0]);
  const initialDurations = initialPhrase.map(note => note[1]);
  
  const initialPitchIndex = new jmon.analysis.MusicalIndex(initialPitches);
  const initialDurationIndex = new jmon.analysis.MusicalIndex(initialDurations);
  
  const initialMetrics = {
    giniPitch: initialPitchIndex.gini(),
    giniDuration: initialDurationIndex.gini(),
    balancePitch: initialPitchIndex.balance(),
    balanceDuration: initialDurationIndex.balance(),
    motifPitch: initialPitchIndex.motif(),
    motifDuration: initialDurationIndex.motif(),
    dissonance: initialPitchIndex.dissonance(evolutionParams.scale),
    rhythmic: initialDurationIndex.rhythmic(evolutionParams.measureLength)
  };
  
  // Analyze evolved phrase
  const finalPitches = bestIndividual.map(note => note[0]);
  const finalDurations = bestIndividual.map(note => note[1]);
  
  const finalPitchIndex = new jmon.analysis.MusicalIndex(finalPitches);
  const finalDurationIndex = new jmon.analysis.MusicalIndex(finalDurations);
  
  const finalMetrics = {
    giniPitch: finalPitchIndex.gini(),
    giniDuration: finalDurationIndex.gini(),
    balancePitch: finalPitchIndex.balance(),
    balanceDuration: finalDurationIndex.balance(),
    motifPitch: finalPitchIndex.motif(),
    motifDuration: finalDurationIndex.motif(),
    dissonance: finalPitchIndex.dissonance(evolutionParams.scale),
    rhythmic: finalDurationIndex.rhythmic(evolutionParams.measureLength)
  };
  
  return { initialMetrics, finalMetrics, bestIndividual };
}
```

```javascript
// Musical metrics comparison chart
musicalResults ? Plot.plot({
  title: "Musical Metrics: Initial vs Evolved",
  width: 900,
  height: 400,
  x: { label: "Musical Metrics" },
  y: { label: "Metric Value" },
  color: { legend: true },
  marks: [
    Plot.barY(
      Object.keys(musicalResults.initialMetrics).map(key => ({
        metric: key,
        value: musicalResults.initialMetrics[key],
        type: "Initial"
      })),
      { x: "metric", y: "value", fill: "type", fillOpacity: 0.8 }
    ),
    Plot.barY(
      Object.keys(musicalResults.finalMetrics).map(key => ({
        metric: key,
        value: musicalResults.finalMetrics[key],
        type: "Evolved"
      })),
      { x: "metric", y: "value", fill: "type", fillOpacity: 0.8 }
    )
  ]
}) : html`<div>Run evolution to see results</div>`
```

## 7. Pitch Evolution Visualization

```javascript
evolutionControl?.evolutionData?.individuals ? Plot.plot({
  title: "Pitch Evolution Over Generations",
  width: 1000,
  height: 400,
  x: { label: "Note Position" },
  y: { label: "MIDI Pitch" },
  color: { legend: true, scheme: "viridis" },
  marks: [
    // Show every 5th generation to avoid overcrowding
    ...evolutionControl.evolutionData.individuals
      .filter((_, i) => i % 5 === 0 || i === evolutionControl.evolutionData.individuals.length - 1)
      .map((individual, idx) =>
        Plot.line(
          individual.map((note, noteIdx) => ({
            position: noteIdx,
            pitch: note[0],
            generation: idx * 5
          })),
          {
            x: "position",
            y: "pitch",
            stroke: "generation",
            strokeWidth: idx === evolutionControl.evolutionData.individuals.length - 1 ? 3 : 1,
            strokeOpacity: idx === evolutionControl.evolutionData.individuals.length - 1 ? 1 : 0.3
          }
        )
      )
  ]
}) : html`<div>Run evolution to see pitch evolution</div>`
```

## 8. JMON Composition Generation

Create playable JMON tracks:

```javascript
jmonComposition = {
  if (!musicalResults) return null;
  
  const createTrack = (phrase, label, channel = 0) => ({
    label,
    midiChannel: channel,
    synth: {
      type: channel === 0 ? 'Synth' : 'FMSynth',
      options: {
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
      }
    },
    notes: phrase.map(([pitch, duration, time]) => ({
      pitch,
      time,
      duration
    }))
  });
  
  return {
    meta: {
      title: "Evolved Musical Phrase",
      description: `Generated using genetic algorithms with ${evolutionParams.generations} generations`,
      composer: "JMON Darwin Genetic Algorithm",
      created: new Date().toISOString(),
      bpm: 120,
      keySignature: `${evolutionParams.scaleName} scale`,
      evolutionParameters: {
        generations: evolutionControl.currentGeneration,
        populationSize: evolutionParams.populationSize,
        mutationRate: evolutionParams.mutationRate,
        finalFitness: evolutionControl.evolutionData.scores[evolutionControl.evolutionData.scores.length - 1]
      }
    },
    tracks: [
      createTrack(initialPhrase, 'original', 0),
      createTrack(musicalResults.bestIndividual, 'evolved', 1)
    ]
  };
}
```

## 9. Audio Playback

Play the evolved composition:

```javascript
playbackControl = {
  if (!jmonComposition) return html`<div>No composition to play</div>`;
  
  const container = html`
    <div style="padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>🎵 Playback Control</h3>
      <button id="play" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px;">
        ▶ Play Composition
      </button>
      <button id="playOriginal" style="padding: 10px 20px; margin-left: 10px; background: #ff7f0e; color: white; border: none; border-radius: 4px;">
        ▶ Play Original Only
      </button>
      <button id="playEvolved" style="padding: 10px 20px; margin-left: 10px; background: #1f77b4; color: white; border: none; border-radius: 4px;">
        ▶ Play Evolved Only
      </button>
      <button id="download" style="padding: 10px 20px; margin-left: 10px; background: #666; color: white; border: none; border-radius: 4px;">
        💾 Download JMON
      </button>
      
      <div id="playStatus" style="margin-top: 10px; font-style: italic;"></div>
    </div>
  `;
  
  const status = container.querySelector('#playStatus');
  
  container.querySelector('#play').onclick = async () => {
    try {
      status.textContent = 'Playing full composition...';
      await jmon.play(jmonComposition);
      status.textContent = 'Playback completed';
    } catch (err) {
      status.textContent = \`Error: \${err.message}\`;
    }
  };
  
  container.querySelector('#playOriginal').onclick = async () => {
    try {
      status.textContent = 'Playing original phrase...';
      const originalOnly = { ...jmonComposition, tracks: [jmonComposition.tracks[0]] };
      await jmon.play(originalOnly);
      status.textContent = 'Original playback completed';
    } catch (err) {
      status.textContent = \`Error: \${err.message}\`;
    }
  };
  
  container.querySelector('#playEvolved').onclick = async () => {
    try {
      status.textContent = 'Playing evolved phrase...';
      const evolvedOnly = { ...jmonComposition, tracks: [jmonComposition.tracks[1]] };
      await jmon.play(evolvedOnly);
      status.textContent = 'Evolved playback completed';
    } catch (err) {
      status.textContent = \`Error: \${err.message}\`;
    }
  };
  
  container.querySelector('#download').onclick = () => {
    const blob = new Blob([JSON.stringify(jmonComposition, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evolved-composition.json';
    a.click();
    status.textContent = 'JMON composition downloaded';
  };
  
  return container;
}
```

## 10. Evolution Summary

Display comprehensive evolution statistics:

```javascript
evolutionSummary = {
  if (!evolutionControl?.evolutionData?.scores?.length) {
    return html`<div>Run evolution to see summary</div>`;
  }
  
  const scores = evolutionControl.evolutionData.scores;
  const initialFitness = scores[0];
  const finalFitness = scores[scores.length - 1];
  const bestFitness = Math.max(...scores);
  const improvementPercentage = ((finalFitness - initialFitness) / initialFitness * 100);
  
  // Find convergence point
  let convergenceGeneration = scores.length;
  for (let i = scores.length - 1; i > 0; i--) {
    if (Math.abs(scores[i] - scores[i - 1]) > 0.001) {
      convergenceGeneration = i + 1;
      break;
    }
  }
  
  return html`
    <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; border-radius: 10px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: white;">🧬 Evolution Summary</h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                  gap: 15px; margin: 15px 0;">
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px;">
          <div style="font-size: 24px; font-weight: bold;">${scores.length}</div>
          <div style="font-size: 14px; opacity: 0.9;">Generations Completed</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px;">
          <div style="font-size: 24px; font-weight: bold;">${finalFitness.toFixed(3)}</div>
          <div style="font-size: 14px; opacity: 0.9;">Final Fitness</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px;">
          <div style="font-size: 24px; font-weight: bold;">${improvementPercentage.toFixed(1)}%</div>
          <div style="font-size: 14px; opacity: 0.9;">Fitness Improvement</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px;">
          <div style="font-size: 24px; font-weight: bold;">${convergenceGeneration}</div>
          <div style="font-size: 14px; opacity: 0.9;">Convergence Generation</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; font-size: 14px; opacity: 0.9;">
        <p><strong>Initial Fitness:</strong> ${initialFitness.toFixed(3)} → <strong>Best Fitness:</strong> ${bestFitness.toFixed(3)}</p>
        <p><strong>Population:</strong> ${evolutionParams.populationSize} individuals, <strong>Mutation Rate:</strong> ${(evolutionParams.mutationRate * 100).toFixed(1)}%</p>
        <p><strong>Scale:</strong> ${evolutionParams.scaleName}, <strong>Phrase Length:</strong> ${musicalResults?.bestIndividual?.length || 0} notes</p>
      </div>
    </div>
  `;
}
```

## Usage Instructions

1. **Configure Initial Material**: Choose or enter your starting musical phrase
2. **Set Evolution Parameters**: Adjust population size, mutation rate, generations, and musical scale  
3. **Define Fitness Targets**: Set desired values for musical metrics (diversity, balance, motif strength, etc.)
4. **Start Evolution**: Click "Start Evolution" and watch real-time progress
5. **Monitor Progress**: View fitness evolution plots and pitch development in real-time
6. **Analyze Results**: Compare initial vs evolved musical metrics
7. **Play & Export**: Listen to both original and evolved versions, download JMON compositions

## Advanced Features

### Real-time Parameter Adjustment
You can pause evolution, adjust parameters, and resume to explore different evolutionary paths.

### Multiple Evolution Runs
Reset and run with different random seeds to explore the solution space.

### Custom Fitness Functions
Modify the fitness targets and weights to guide evolution toward specific musical goals.

### Interactive Visualization
All plots update in real-time during evolution, providing immediate feedback on the algorithmic process.

This interactive approach demonstrates how genetic algorithms can be used for creative musical exploration, combining mathematical optimization with artistic expression in an intuitive, visual environment.
