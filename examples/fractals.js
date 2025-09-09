/**
 * JMON-Native Fractals Examples
 *
 * This file demonstrates the three main types of fractals available in JMON Studio:
 * 1. Cellular Automata (1D Wolfram rules with strip extraction for music)
 * 2. Mandelbrot Set (complex fractal with zoom capabilities) 
 * 3. Logistic Map (chaotic dynamics and bifurcation diagrams)
 *
 * All examples include both visualization capabilities and musical applications,
 * converting fractal patterns into JMON-compatible musical sequences.
 */

import { Scale } from '../src/algorithms/theory/harmony/Scale.js';
import { CellularAutomata } from '../src/algorithms/generative/cellular-automata/CellularAutomata.js';
import { Mandelbrot } from '../src/algorithms/generative/fractals/Mandelbrot.js';
import { LogisticMap } from '../src/algorithms/generative/fractals/LogisticMap.js';
import { FractalVisualizer } from '../src/algorithms/visualization/fractals/FractalVisualizer.js';
import { 
  notesToTrack,
  offsetToBarsBeatsTicks,
  DEFAULT_TIMING_CONFIG 
} from '../src/algorithms/utils/jmon-timing.js';

console.log('=== JMON-Native Fractals Examples ===\n');
console.log('Exploring cellular automata, Mandelbrot sets, and logistic maps!\n');

// =============================================================================
// EXAMPLE 1: Cellular Automata - Xenakis-inspired Rock Band Composition
// =============================================================================

console.log('=== EXAMPLE 1: Cellular Automata for Rock Band ===');
console.log('Creating a 1:13 minute rock composition using CA rules...\n');

// Demonstrate various CA rules first
const demoRules = [18, 22, 30, 45, 54, 60, 73, 102, 105, 110, 126, 150];
const demoWidth = 20;
const demoIterations = 10;

console.log('Demonstrating different CA rules:');
demoRules.forEach(rule => {
  const ca = new CellularAutomata({
    width: demoWidth,
    ruleNumber: rule,
    initialState: FractalVisualizer.createCenterInitialState(demoWidth)
  });
  
  const history = ca.generate(demoIterations);
  const density = history.map(gen => 
    gen.reduce((sum, cell) => sum + cell, 0) / gen.length
  ).reduce((sum, d) => sum + d, 0) / history.length;
  
  console.log(`  Rule ${rule}: Average density ${density.toFixed(3)}`);
});

console.log('');

// Main composition using Rule 150 for guitar and bass
console.log('Generating main composition tracks...');

const ca1Rule = 150;
const width1 = 200;
const length1 = 136;
const init1 = FractalVisualizer.createCenterInitialState(width1);

const ca1 = new CellularAutomata({
  width: width1,
  ruleNumber: ca1Rule,
  initialState: init1
});

const ca1History = ca1.generate(length1);
console.log(`Generated CA evolution: ${ca1History.length} generations × ${width1} cells`);

// Extract strips for guitar and bass
const strips1 = [[97, 103], [85, 92]]; // Guitar and bass strips
const extractedStrips1 = FractalVisualizer.extractStrips(ca1History, strips1);

console.log(`Extracted ${extractedStrips1.length} strips:`);
console.log(`  Guitar strip: positions ${strips1[0][0]}-${strips1[0][1]}`);
console.log(`  Bass strip: positions ${strips1[1][0]}-${strips1[1][1]}`);

// Convert to musical sequences
const cMinorScale = new Scale('C', 'minor').generate({ start: 48, length: 7 });
console.log('C Minor Scale:', cMinorScale);

function caStripToSequence(strip, scale, durations) {
  const sequence = [];
  let currentTime = 0;
  
  for (let genIndex = 0; genIndex < strip.length; genIndex++) {
    const generation = strip[genIndex];
    const activeCells = [];
    
    // Find active cells in this generation
    for (let cellIndex = 0; cellIndex < generation.length; cellIndex++) {
      if (generation[cellIndex] === 1) {
        activeCells.push(cellIndex);
      }
    }
    
    if (activeCells.length > 0) {
      // Create notes for active cells
      activeCells.forEach(cellIndex => {
        const scaleIndex = cellIndex % scale.length;
        const pitch = scale[scaleIndex];
        const duration = durations[genIndex % durations.length];
        
        sequence.push({
          pitch,
          duration,
          time: currentTime
        });
      });
      
      currentTime += durations[genIndex % durations.length];
    } else {
      // Add rest
      currentTime += durations[genIndex % durations.length];
    }
  }
  
  return sequence;
}

// Create guitar track
const guitarDurations = [0.5, 0.5, 1, 2, 1, 1, 0.5, 1.5];
const guitarSequence = caStripToSequence(extractedStrips1[0], cMinorScale, guitarDurations);

// Create bass track with lower octave
const bassScale = new Scale('C', 'minor').generate({ start: 36, length: 7 });
const bassDurations = [1, 1, 2, 0.5, 0.5, 0.5, 0.5, 2];
const bassSequence = caStripToSequence(extractedStrips1[1], bassScale, bassDurations);

// Convert to JMON tracks
const guitarTrack = notesToTrack(guitarSequence, {
  label: 'ca-guitar',
  midiChannel: 0,
  synth: {
    type: 'FMSynth',
    options: { envelope: { attack: 0.1, release: 0.8 } }
  }
});

const bassTrack = notesToTrack(bassSequence, {
  label: 'ca-bass',
  midiChannel: 1,
  synth: {
    type: 'MonoSynth', 
    options: { envelope: { attack: 0.01, release: 1.2 } }
  }
});

console.log(`Created guitar track: ${guitarTrack.notes.length} notes`);
console.log(`Created bass track: ${bassTrack.notes.length} notes`);

// Generate drums using Rule 18 with random initial state
console.log('\nGenerating drum track using Rule 18...');

const ca2Rule = 18;
const width2 = 200;
const length2 = 136;

// Create random initial state with 10% density
const init2 = Array.from({ length: width2 }, () => Math.random() > 0.9 ? 1 : 0);

const ca2 = new CellularAutomata({
  width: width2,
  ruleNumber: ca2Rule,
  initialState: init2
});

const ca2History = ca2.generate(length2);
const drumStrips = [[110, 116]]; // Single strip for drums
const extractedDrumStrips = FractalVisualizer.extractStrips(ca2History, drumStrips);

// Create drum sequence with mapped drum sounds
const drumMapping = {
  0: 36, // Kick
  1: 38, // Snare
  2: 42, // Hi-hat
  3: 46, // Open hi-hat
  4: 49, // Crash
  5: 51, // Ride
  6: 47  // Low tom
};

function caStripToDrums(strip, drumMapping) {
  const sequence = [];
  let currentTime = 0;
  const duration = 1; // Quarter note drums
  
  for (const generation of strip) {
    const activeCells = [];
    
    for (let i = 0; i < generation.length; i++) {
      if (generation[i] === 1) {
        activeCells.push(i);
      }
    }
    
    if (activeCells.length > 0) {
      // Map each active cell to a drum sound
      activeCells.forEach(cellIndex => {
        const drumIndex = cellIndex % Object.keys(drumMapping).length;
        const pitch = drumMapping[drumIndex];
        
        sequence.push({
          pitch,
          duration,
          time: currentTime
        });
      });
    }
    
    currentTime += duration;
  }
  
  return sequence;
}

const drumSequence = caStripToDrums(extractedDrumStrips[0], drumMapping);

const drumTrack = notesToTrack(drumSequence, {
  label: 'ca-drums',
  midiChannel: 9, // Standard drum channel
  synth: {
    type: 'NoiseSynth',
    options: { envelope: { attack: 0.001, release: 0.2 } }
  }
});

console.log(`Created drum track: ${drumTrack.notes.length} notes`);

console.log('');

// =============================================================================
// EXAMPLE 2: Mandelbrot Set - Fractal Melodies 
// =============================================================================

console.log('=== EXAMPLE 2: Mandelbrot Set Musical Sequences ===');

// Create Mandelbrot generator with different zoom levels
const mandelbrotConfigs = [
  { 
    name: 'Overview',
    options: { width: 20, height: 20, xMin: -2.0, xMax: 1.0, yMin: -1.5, yMax: 1.5, maxIterations: 100 }
  },
  { 
    name: 'Zoomed',
    options: { width: 20, height: 20, xMin: -1.5, xMax: -1.0, yMin: 0, yMax: 0.5, maxIterations: 200 }
  },
  { 
    name: 'Deep Zoom',
    options: { width: 20, height: 20, xMin: -1.150, xMax: -1.145, yMin: 0.275, yMax: 0.280, maxIterations: 500 }
  }
];

console.log('Generating Mandelbrot sequences at different zoom levels...');

const mandelbrotTracks = [];

mandelbrotConfigs.forEach((config, index) => {
  console.log(`\nProcessing ${config.name} view...`);
  
  const mandelbrot = new Mandelbrot(config.options);
  
  // Extract diagonal sequence  
  const diagonalSequence = mandelbrot.extractSequence('diagonal');
  console.log(`  Diagonal sequence length: ${diagonalSequence.length}`);
  console.log(`  Iteration range: ${Math.min(...diagonalSequence)} - ${Math.max(...diagonalSequence)}`);
  
  // Map to G major scale
  const gMajorScale = new Scale('G', 'major').generate({ start: 48, length: 21 });
  const mappedPitches = mandelbrot.mapToScale(diagonalSequence, [0, 2, 4, 5, 7, 9, 11], 3);
  
  // Create rhythmic pattern
  const rhythmDurations = [0.5, 0.5, 1, 2, 1];
  const mandelbrotNotes = mappedPitches.map((pitch, i) => ({
    pitch,
    duration: rhythmDurations[i % rhythmDurations.length],
    time: i * 0.75 // Overlap slightly for legato effect
  }));
  
  const track = notesToTrack(mandelbrotNotes, {
    label: `mandelbrot-${config.name.toLowerCase()}`,
    midiChannel: index + 2,
    synth: {
      type: ['Synth', 'AMSynth', 'FMSynth'][index],
      options: { 
        envelope: { 
          attack: 0.1 + index * 0.1, 
          release: 1.0 + index * 0.5 
        } 
      }
    }
  });
  
  mandelbrotTracks.push(track);
  console.log(`  Created track: ${track.notes.length} notes`);
});

console.log('');

// =============================================================================
// EXAMPLE 3: Logistic Map - Chaos and Musical Patterns
// =============================================================================

console.log('=== EXAMPLE 3: Logistic Map Chaos Sequences ===');

// Demonstrate different chaotic regimes
const logisticConfigs = [
  { name: 'Periodic', r: 3.2, regime: 'periodic' },
  { name: 'Edge of Chaos', r: 3.57, regime: 'edge' },
  { name: 'Chaotic', r: 3.9, regime: 'chaotic' }
];

console.log('Generating sequences from different chaotic regimes...');

const logisticTracks = [];

logisticConfigs.forEach((config, index) => {
  console.log(`\nProcessing ${config.name} regime (r=${config.r})...`);
  
  const logisticMap = new LogisticMap({ 
    r: config.r,
    iterations: 50,
    skipTransient: 10
  });
  
  const sequence = logisticMap.generate();
  console.log(`  Generated ${sequence.length} values`);
  console.log(`  Range: ${Math.min(...sequence).toFixed(4)} - ${Math.max(...sequence).toFixed(4)}`);
  
  // Detect cycles
  const cycles = logisticMap.detectCycles(sequence);
  if (cycles.length > 0) {
    console.log(`  Detected cycles: periods ${cycles.join(', ')}`);
  } else {
    console.log(`  No clear cycles detected (chaotic)`);
  }
  
  // Map to musical parameters
  const gMajorScale = new Scale('G', 'major').generate({ start: 60, length: 14 });
  const pitches = logisticMap.mapToScale(sequence, [0, 2, 4, 5, 7, 9, 11], 2);
  const durations = logisticMap.mapToRhythm(sequence, [0.5, 0.5, 1, 2, 1]);
  const velocities = logisticMap.mapToVelocity(sequence, 0.5, 1.0);
  
  // Create notes
  const logisticNotes = pitches.map((pitch, i) => ({
    pitch,
    duration: durations[i],
    time: i * 0.5, // Fixed time spacing
    velocity: velocities[i]
  }));
  
  const track = notesToTrack(logisticNotes, {
    label: `logistic-${config.name.toLowerCase()}`,
    midiChannel: index + 5,
    synth: {
      type: 'PluckSynth',
      options: { 
        attackNoise: 0.1 + index * 0.1,
        dampening: 2000 + index * 1000,
        resonance: 0.8 + index * 0.1
      }
    }
  });
  
  logisticTracks.push(track);
  console.log(`  Created track: ${track.notes.length} notes`);
});

// Generate bifurcation data for visualization
console.log('\nGenerating bifurcation diagram data...');
const bifurcationMap = new LogisticMap();
const bifurcationData = bifurcationMap.bifurcationDiagram(2.8, 4.0, 100); // Reduced resolution
console.log(`Generated bifurcation data: ${bifurcationData.r.length} points`);

console.log('');

// =============================================================================
// EXAMPLE 4: Advanced CA Patterns - Rotating Drum Patterns
// =============================================================================

console.log('=== EXAMPLE 4: Advanced CA Drum Patterns ===');

// Create multiple CA instances for different drum instruments
const drumRules = [30, 54, 150];
const instrumentNames = ['kick', 'snare', 'hat'];
const drumWidth = 12;
const drumGenerations = 8;

console.log('Generating rotating CA drum patterns...');

const drumCAs = drumRules.map((rule, index) => {
  // Create random initial state with different densities
  const density = [0.3, 0.25, 0.4][index];
  const initialState = Array.from({ length: drumWidth }, 
    () => Math.random() < density ? 1 : 0
  );
  
  const ca = new CellularAutomata({
    width: drumWidth,
    ruleNumber: rule,
    initialState
  });
  
  const history = ca.generate(drumGenerations);
  console.log(`  ${instrumentNames[index]}: Rule ${rule}, ${history.length} generations`);
  
  return { name: instrumentNames[index], history, rule };
});

// Convert CA patterns to drum sequences by flattening
function caToFlatDrumPattern(history, pitch) {
  const sequence = [];
  let currentTime = 0;
  const beatDuration = 0.25; // Sixteenth notes
  
  // Flatten CA history into a single sequence
  for (const generation of history) {
    for (const cell of generation) {
      if (cell === 1) {
        sequence.push({
          pitch,
          duration: beatDuration,
          time: currentTime
        });
      }
      currentTime += beatDuration;
    }
  }
  
  return sequence;
}

// Create drum tracks from flattened CA patterns
const advancedDrumTracks = drumCAs.map((ca, index) => {
  const drumPitches = [36, 38, 42]; // Kick, snare, hi-hat
  const sequence = caToFlatDrumPattern(ca.history, drumPitches[index]);
  
  const track = notesToTrack(sequence, {
    label: `ca-advanced-${ca.name}`,
    midiChannel: 9,
    synth: {
      type: 'NoiseSynth',
      options: { 
        envelope: { 
          attack: 0.001, 
          release: [0.1, 0.05, 0.02][index] // Different decay times
        } 
      }
    }
  });
  
  console.log(`  ${ca.name}: ${track.notes.length} hits`);
  return track;
});

console.log('');

// =============================================================================
// SUMMARY: Complete Fractal Music Composition
// =============================================================================

console.log('=== SUMMARY: Complete Fractal Music Composition ===');

// Combine all tracks into a comprehensive composition
const allTracks = [
  ...mandelbrotTracks,
  ...logisticTracks,
  guitarTrack,
  bassTrack,
  drumTrack,
  ...advancedDrumTracks
];

const fractalComposition = {
  format: 'jmon',
  version: '1.0.0',
  bpm: 120,
  timeSignature: '4/4',
  keySignature: 'C',
  metadata: {
    name: 'Fractal Symphony',
    composer: 'JMON Studio Fractal Algorithms',
    description: 'A comprehensive composition using cellular automata, Mandelbrot sets, and logistic maps',
    tags: ['fractal', 'algorithmic', 'experimental', 'mathematical-music']
  },
  tracks: allTracks
};

console.log(`\n🎼 Complete Fractal Composition:`);
console.log(`- Title: "${fractalComposition.metadata.name}"`);
console.log(`- Total tracks: ${fractalComposition.tracks.length}`);
console.log(`- BPM: ${fractalComposition.bpm}`);
console.log(`- Key: ${fractalComposition.keySignature} ${fractalComposition.timeSignature}`);

console.log('\nTrack breakdown:');
fractalComposition.tracks.forEach((track, i) => {
  console.log(`  ${i + 1}. "${track.label}" - ${track.notes.length} notes (${track.synth.type}, CH${track.midiChannel})`);
});

// Calculate total composition length
const maxEndTime = Math.max(...fractalComposition.tracks.map(track => 
  Math.max(...track.notes.map(note => note.time + note.duration))
));

console.log(`\n⏱️  Total composition length: ${maxEndTime.toFixed(2)} quarter notes (${(maxEndTime / 4).toFixed(1)} measures)`);

console.log('\n=== Fractal Visualization Summary ===');
console.log('Generated fractal patterns demonstrate:');
console.log('  ✓ Cellular Automata evolution with musical strip extraction');
console.log('  ✓ Mandelbrot set sequences at multiple zoom levels'); 
console.log('  ✓ Logistic map chaos across different regimes');
console.log('  ✓ Bifurcation diagram data for complex dynamics');
console.log('  ✓ Advanced CA patterns for rhythmic generation');

console.log('\n🎵 All fractals successfully integrated into JMON format!');
console.log('🎨 Visualizations available through FractalVisualizer class methods.');

// Export the composition for potential use
if (typeof window !== 'undefined') {
  window.fractal_composition = fractalComposition;
  console.log('\n💾 Composition exported to window.fractal_composition');
}

console.log('\n=== Advanced Usage Examples ===');
console.log('For interactive visualization, use:');
console.log('  FractalVisualizer.plotMandelbrot() - High-res Mandelbrot visualization');
console.log('  FractalVisualizer.plotLogisticMap() - Bifurcation diagrams');  
console.log('  FractalVisualizer.plotCellularAutomata() - CA evolution plots');
console.log('  FractalVisualizer.renderMandelbrotCanvas() - Direct Canvas rendering for performance');
console.log('  FractalVisualizer.renderCACanvas() - Canvas-based CA visualization');

console.log('\nExample Canvas usage (browser environment):');
console.log(`  const canvas = FractalVisualizer.createCanvas(400, 400);
  FractalVisualizer.renderMandelbrotCanvas(
    canvas, -2.5, 1.0, -1.25, 1.25, 400, 100, 'plasma'
  );
  document.body.appendChild(canvas);`);

console.log('\n✨ Fractal music generation complete! ✨');
