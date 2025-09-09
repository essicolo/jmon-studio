/**
 * JMON-Native Walks Examples with Plotly Visualizations
 *
 * This file demonstrates various algorithmic walks with comprehensive plotting,
 * similar to the original Python Marimo notebook. It showcases:
 * 1. Random walks with branching and merging (Chain)
 * 2. Gaussian Process-based walks (KernelGenerator)  
 * 3. Phasor/harmonic oscillation walks (Phasor, PhasorSystem)
 * 4. Fibonacci sequence walks
 * 
 * All algorithms use numeric time format (quarter notes) for MIDI compatibility.
 * Plots are generated using Plotly.js for rich interactive visualizations.
 */

import { Scale } from '../src/algorithms/theory/harmony/Scale.js';
import { isorhythm } from '../src/algorithms/theory/rhythm/isorhythm.js';
import { Chain } from '../src/algorithms/generative/walks/Chain.js';
import { Phasor, PhasorSystem } from '../src/algorithms/generative/walks/PhasorWalk.js';
import { KernelGenerator } from '../src/algorithms/generative/gaussian-processes/Kernel.js';
import { fibonacci } from '../src/algorithms/utils.js';
import { notesToTrack } from '../src/algorithms/utils/jmon-timing.js';
import { PlotRenderer } from '../src/algorithms/visualization/plots/PlotRenderer.js';

console.log('=== JMON-Native Walks Examples with Plotly Visualizations ===\n');
console.log('Exploring random walks, Gaussian processes, phasor motion, and Fibonacci sequences!\n');

// =============================================================================
// EXAMPLE 1: Understanding Probability Distributions
// =============================================================================

console.log('=== EXAMPLE 1: Understanding Probability Distributions ===');

/**
 * Generate normal distribution data
 */
function generateNormalDistribution(mean = 0, std = 1, points = 100) {
  const x = [];
  const y = [];
  const range = 4;
  
  for (let i = 0; i < points; i++) {
    const xi = -range + (2 * range * i) / (points - 1);
    const yi = (1 / (std * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((xi - mean) / std, 2));
    x.push(xi);
    y.push(yi);
  }
  
  return { x, y };
}

/**
 * Generate uniform distribution data
 */
function generateUniformDistribution(min = -2, max = 2, points = 100) {
  const x = [];
  const y = [];
  const height = 1 / (max - min);
  
  for (let i = 0; i < points; i++) {
    const xi = -4 + (8 * i) / (points - 1);
    const yi = (xi >= min && xi <= max) ? height : 0;
    x.push(xi);
    y.push(yi);
  }
  
  return { x, y };
}

/**
 * Generate discrete distribution data
 */
function generateDiscreteDistribution() {
  return {
    x: ['Folk', 'Classical', 'Punk Rock', 'Jazz'],
    y: [0.15, 0.30, 0.10, 0.45]
  };
}

/**
 * Generate Poisson distribution data
 */
function generatePoissonDistribution(lambda = 3, maxK = 10) {
  const x = [];
  const y = [];
  
  for (let k = 0; k < maxK; k++) {
    x.push(k);
    // Poisson PMF: P(X=k) = (e^(-λ) * λ^k) / k!
    let factorial = 1;
    for (let i = 1; i <= k; i++) {
      factorial *= i;
    }
    const prob = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial;
    y.push(prob);
  }
  
  return { x, y };
}

// Generate distribution data
const normalData = generateNormalDistribution(0, 1);
const uniformData = generateUniformDistribution(-1, 1);
const discreteData = generateDiscreteDistribution();
const poissonData = generatePoissonDistribution(3);

// Create plots (these will work in browser environments with Plotly)
try {
  console.log('Generating probability distribution plots...');
  
  await PlotRenderer.line(normalData, {
    title: 'Normal Distribution',
    xTitle: 'Value',
    yTitle: 'Probability Density',
    color: 'blue'
  }, 'normal-plot');
  
  await PlotRenderer.line(uniformData, {
    title: 'Uniform Distribution',
    xTitle: 'Value', 
    yTitle: 'Probability Density',
    color: 'green'
  }, 'uniform-plot');
  
  await PlotRenderer.bar(discreteData, {
    title: 'Discrete Distribution (Music Genres)',
    xTitle: 'Genre',
    yTitle: 'Probability',
    color: 'orange'
  }, 'discrete-plot');
  
  await PlotRenderer.bar(poissonData, {
    title: 'Poisson Distribution',
    xTitle: 'k',
    yTitle: 'Probability',
    color: 'red'
  }, 'poisson-plot');
  
  console.log('✓ Probability distribution plots generated successfully');
} catch (error) {
  console.log('📊 Plot data generated (Plotly.js not available for rendering)');
  console.log('- Normal distribution:', normalData.y.slice(0, 5), '...');
  console.log('- Uniform distribution:', uniformData.y.slice(0, 5), '...');
  console.log('- Discrete distribution:', discreteData);
  console.log('- Poisson distribution:', poissonData.y.slice(0, 5), '...');
}

console.log('');

// =============================================================================
// EXAMPLE 2: Random Walks with Branching and Visualization
// =============================================================================

console.log('=== EXAMPLE 2: Random Walks with Branching and Visualization ===');

// Create a C Major scale for mapping
const cMajorScale = new Scale('C', 'major').generate({ start: 60, length: 8 });
console.log('C Major Scale:', cMajorScale);

// Create random walk through MIDI pitch range (C2 to C8)
const pitchWalk = new Chain({
  walkRange: [36, 108], // C2 to C8
  walkStart: 60,        // Start at C4
  walkProbability: { mean: 0, std: 2 }, // Normal distribution steps
  roundTo: 0,           // Round to integers (MIDI notes)
  branchingProbability: 0.1,
  mergingProbability: 0.05
});

const walkSequences = pitchWalk.generate(20, 42); // Use seed for reproducibility
console.log(`\nGenerated ${walkSequences.length} walk branches:`);
walkSequences.forEach((walk, i) => {
  const validNotes = walk.filter(note => note !== null);
  console.log(`  Branch ${i + 1}: ${validNotes.length} notes, range: ${Math.min(...validNotes)} - ${Math.max(...validNotes)}`);
});

// Prepare data for multi-line plot
const walkPlotData = walkSequences.map((walk, i) => ({
  x: walk.map((_, index) => index).filter((_, j) => walk[j] !== null),
  y: walk.filter(note => note !== null),
  name: `Branch ${i + 1}`
}));

// Create multi-line plot for random walks
try {
  await PlotRenderer.multiLine(walkPlotData, {
    title: 'Random Walks with Branching and Merging',
    xTitle: 'Time Step',
    yTitle: 'MIDI Pitch',
    width: 800,
    height: 500
  }, 'walks-plot');
  
  console.log('✓ Random walks visualization created');
} catch (error) {
  console.log('📊 Random walks data generated (visualization not available)');
  walkPlotData.forEach((branch, i) => {
    console.log(`  Branch ${i + 1} sample: [${branch.y.slice(0, 5).join(', ')}, ...]`);
  });
}

// Convert to JMON notes with different rhythmic patterns for each branch
const rhythmSets = [
  [0.125, 0.25, 0.5, 1, 2],
  [1, 2],
  [0.25, 0.5, 1],
  [0.5, 1, 1.5],
  [1, 1, 2]
];

const walkTracks = [];
walkSequences.slice(0, Math.min(3, walkSequences.length)).forEach((walk, i) => {
  const durations = rhythmSets[i % rhythmSets.length];
  const notes = [];
  let currentTime = 0;
  
  walk.forEach((pitch, j) => {
    if (pitch !== null) {
      const duration = durations[j % durations.length];
      notes.push({ pitch, duration, time: currentTime });
      currentTime += duration;
    }
  });
  
  const track = notesToTrack(notes, {
    label: `random-walk-${i + 1}`,
    midiChannel: i,
    synth: { 
      type: ['Synth', 'AMSynth', 'FMSynth'][i],
      options: { envelope: { release: 1.0 + i * 0.3 } }
    }
  });
  
  walkTracks.push(track);
});

console.log('\nCreated random walk tracks:');
walkTracks.forEach(track => {
  console.log(`  ${track.label}: ${track.notes.length} notes, ${track.synth.type}`);
});

console.log('');

// =============================================================================
// EXAMPLE 3: Gaussian Process Walks with Multiple Parameters
// =============================================================================

console.log('=== EXAMPLE 3: Gaussian Process Walks (Unfitted) ===');

// Create different GP configurations to demonstrate various wave characteristics
const gpConfigs = [
  { lengthScale: 0.1, amplitude: 0.1, label: 'Short waves, low amplitude' },
  { lengthScale: 1.0, amplitude: 1.0, label: 'Medium waves, medium amplitude' },
  { lengthScale: 10.0, amplitude: 10.0, label: 'Long waves, high amplitude' },
  { lengthScale: 100.0, amplitude: 0.1, label: 'Very long waves, low amplitude' }
];

const gpPlotData = [];
const sampleLength = 100;
const nSamples = 3;

gpConfigs.forEach(config => {
  const gp = new KernelGenerator([], config.lengthScale, config.amplitude);
  
  for (let sample = 0; sample < nSamples; sample++) {
    const [timePoints, samples] = gp.generate({
      length: sampleLength,
      nsamples: 1,
      seed: 42 + sample
    });
    
    gpPlotData.push({
      x: Array.from({length: sampleLength}, (_, i) => i),
      y: samples,
      name: `${config.label} - Sample ${sample + 1}`,
      config: config.label
    });
  }
});

// Create visualization for different GP parameters
try {
  // Group data by configuration for cleaner visualization
  const groupedData = {};
  gpPlotData.forEach(data => {
    if (!groupedData[data.config]) {
      groupedData[data.config] = [];
    }
    groupedData[data.config].push(data);
  });
  
  // Create separate plots for each configuration
  for (const [configName, datasets] of Object.entries(groupedData)) {
    await PlotRenderer.multiLine(datasets, {
      title: `Gaussian Process: ${configName}`,
      xTitle: 'Time Step',
      yTitle: 'Value',
      width: 600,
      height: 400
    }, `gp-${configName.replace(/\s+/g, '-').toLowerCase()}`);
  }
  
  console.log('✓ Gaussian Process visualizations created');
} catch (error) {
  console.log('📊 Gaussian Process data generated (visualization not available)');
  gpConfigs.forEach((config, i) => {
    console.log(`  ${config.label}: Sample range ±${config.amplitude.toFixed(1)}`);
  });
}

// Use GP to generate musical content
console.log('\nGenerating musical content from Gaussian Processes...');

const bBluesScale = new Scale('Bb', 'minor pentatonic').generate({ start: 46, length: 14 });
console.log('Bb Minor Pentatonic Scale:', bBluesScale);

// Generate blues-style tracks using GP
const bluesGP = new KernelGenerator([], 2.0, 3.0);
const gpSamples = bluesGP.generate({
  length: 16,
  nsamples: 3,
  seed: 100
});

// For unfitted GP, gpSamples is an array of arrays
const bluesTracks = gpSamples.map((sample, trackIndex) => {
  // Map GP values to scale indices
  const notes = sample.map((value, i) => {
    // Normalize GP value to scale index range
    const scaleIndex = Math.max(0, Math.min(bBluesScale.length - 1, 
      Math.round((value + 3) / 6 * (bBluesScale.length - 1))));
    const pitch = bBluesScale[scaleIndex];
    const duration = [0.25, 0.5, 1, 2][i % 4]; // Varied durations
    const time = i; // Simple time progression
    
    return { pitch, duration, time };
  });
  
  return notesToTrack(notes, {
    label: `gp-blues-${trackIndex + 1}`,
    midiChannel: trackIndex + 3,
    synth: { 
      type: 'PluckSynth',
      options: { resonance: 0.9 - trackIndex * 0.1 }
    }
  });
});

console.log('Created GP blues tracks:');
bluesTracks.forEach(track => {
  console.log(`  ${track.label}: ${track.notes.length} notes`);
});

console.log('');

// =============================================================================
// EXAMPLE 4: Fitted Gaussian Process - Pachelbel's Canon Variations
// =============================================================================

console.log('=== EXAMPLE 4: Fitted Gaussian Process - Pachelbel Variations ===');

// Define Pachelbel's progression in D major
const dMajorScale = new Scale('D', 'major').generate({ start: 50, length: 15 });
console.log('D Major Scale:', dMajorScale);

// Pachelbel's Canon progression
const pachelbelProgression = ['D4', 'A3', 'Bm3', 'F#3', 'G3', 'D3', 'G3', 'A3'];
const pachelbelMidi = [62, 57, 59, 54, 55, 50, 55, 57]; // Approximate MIDI values

// Convert to scale indices for GP training
const progressionIndices = pachelbelMidi.map(midi => {
  const scaleIndex = dMajorScale.findIndex(note => note === midi);
  return scaleIndex !== -1 ? scaleIndex : 0;
});

// Create training data [time, scaleIndex]
const trainingData = progressionIndices.map((index, i) => [i * 2, index]); // 2-beat intervals
console.log('Pachelbel training data (time, scale_index):');
trainingData.forEach((point, i) => {
  console.log(`  ${pachelbelProgression[i]}: [${point[0]}, ${point[1]}]`);
});

// Create fitted GP
const pachelbelGP = new KernelGenerator(trainingData, 1.0, 2.0);
const [fittedTimes, fittedSamples] = pachelbelGP.generate({
  length: 32,
  nsamples: 3,
  seed: 50
});

console.log(`Generated ${fittedSamples.length} Pachelbel variations with ${fittedSamples[0].length} points each`);

// Visualize fitted GP results
try {
  const fittedPlotData = fittedSamples.map((sample, i) => ({
    x: fittedTimes,
    y: sample,
    name: `Variation ${i + 1}`
  }));
  
  // Add original data points
  fittedPlotData.push({
    x: trainingData.map(point => point[0]),
    y: trainingData.map(point => point[1]),
    name: 'Original Progression',
    mode: 'markers'
  });
  
  await PlotRenderer.multiLine(fittedPlotData, {
    title: 'Pachelbel Canon Variations (Fitted Gaussian Process)',
    xTitle: 'Time (quarter notes)',
    yTitle: 'Scale Index',
    width: 800,
    height: 500
  }, 'pachelbel-fitted-gp');
  
  console.log('✓ Pachelbel variations visualization created');
} catch (error) {
  console.log('📊 Pachelbel variations data generated (visualization not available)');
  fittedSamples.forEach((variation, i) => {
    console.log(`  Variation ${i + 1} sample: [${variation.slice(0, 5).map(v => v.toFixed(2)).join(', ')}, ...]`);
  });
}

// Convert fitted GP to musical tracks
const pachelbelTracks = fittedSamples.map((sample, trackIndex) => {
  const notes = [];
  let currentTime = 0;
  const durations = [0.25, 0.5, 1, 2];
  
  sample.forEach((value, i) => {
    // Map to scale index and clamp to valid range
    const scaleIndex = Math.max(0, Math.min(dMajorScale.length - 1, Math.round(value)));
    const pitch = dMajorScale[scaleIndex];
    const duration = durations[i % durations.length];
    
    notes.push({ pitch, duration, time: currentTime });
    currentTime += duration;
  });
  
  return notesToTrack(notes, {
    label: `pachelbel-var-${trackIndex + 1}`,
    midiChannel: trackIndex + 6,
    synth: { 
      type: ['Synth', 'FMSynth', 'AMSynth'][trackIndex],
      options: { envelope: { attack: 0.1, release: 1.5 } }
    }
  });
});

console.log('Created Pachelbel variation tracks:');
pachelbelTracks.forEach(track => {
  console.log(`  ${track.label}: ${track.notes.length} notes`);
});

console.log('');

// =============================================================================
// EXAMPLE 5: Phasor Walks - Harmonic Oscillation
// =============================================================================

console.log('=== EXAMPLE 5: Phasor Walks - Harmonic Oscillation ===');

// Create a complex harmonic system
const highFreqPhasor = new Phasor(
  0.1,    // distance (amplitude)
  1.5,    // frequency
  Math.PI / 4  // phase
);

const midFreqPhasor = new Phasor(
  0.5,    // distance
  3.0,    // frequency 
  0,      // phase
  [highFreqPhasor]  // sub-phasors
);

const basePhasor = new Phasor(
  2.0,    // distance
  1.0,    // frequency
  0,      // phase
  [midFreqPhasor]  // sub-phasors
);

const phasorSystem = new PhasorSystem();
phasorSystem.addPhasor(basePhasor);

console.log('Created phasor system with base -> mid -> high frequency hierarchy');

// Simulate phasor motion
const phasorTimes = Array.from({length: 100}, (_, i) => i * 0.1);
const phasorResults = phasorSystem.simulate(phasorTimes);

console.log(`Simulated harmonic motion for ${phasorResults.length} phasor components`);

// Visualize phasor motion
try {
  for (let objIndex = 0; objIndex < phasorResults.length; objIndex++) {
    const phasorData = phasorResults[objIndex];
    const distances = phasorData.map(r => r.distance);
    const angles = phasorData.map(r => r.angle);
    
    // Distance plot
    await PlotRenderer.line({ x: phasorTimes, y: distances }, {
      title: `Phasor ${objIndex + 1} - Amplitude from Center`,
      xTitle: 'Time',
      yTitle: 'Distance',
      color: ['blue', 'green', 'red'][objIndex]
    }, `phasor-distance-${objIndex}`);
    
    // Angle plot
    await PlotRenderer.line({ x: phasorTimes, y: angles }, {
      title: `Phasor ${objIndex + 1} - Phase Angle`,
      xTitle: 'Time', 
      yTitle: 'Angle (degrees)',
      color: ['blue', 'green', 'red'][objIndex]
    }, `phasor-angle-${objIndex}`);
  }
  
  console.log('✓ Phasor motion visualizations created');
} catch (error) {
  console.log('📊 Phasor motion data generated (visualization not available)');
  phasorResults.forEach((phasorData, i) => {
    const distances = phasorData.map(r => r.distance);
    const angles = phasorData.map(r => r.angle);
    console.log(`  Phasor ${i + 1}: distance range ${distances[0].toFixed(2)} - ${Math.max(...distances).toFixed(2)}`);
    console.log(`  Phasor ${i + 1}: angle range ${Math.min(...angles).toFixed(1)}° - ${Math.max(...angles).toFixed(1)}°`);
  });
}

// Convert phasor motion to music
const phasorTracks = phasorResults.map((phasorData, objIndex) => {
  const notes = [];
  
  // Use distance for pitch (mapped to scale) and angle for timing
  const scale = new Scale('E', 'minor').generate({ start: 52, length: 10 });
  
  phasorData.forEach((result, i) => {
    if (i < phasorData.length - 1) {
      // Map distance to scale index
      const normalizedDistance = Math.max(0, Math.min(1, result.distance / 3.0));
      const scaleIndex = Math.floor(normalizedDistance * (scale.length - 1));
      const pitch = scale[scaleIndex];
      
      // Use angle change for duration
      const nextResult = phasorData[i + 1];
      const angleDiff = Math.abs(nextResult.angle - result.angle);
      const duration = 0.25 + (angleDiff / 360) * 2; // 0.25 to 2.25 beats
      const time = result.time * 4; // Scale time appropriately
      
      notes.push({ pitch, duration, time });
    }
  });
  
  return notesToTrack(notes, {
    label: `phasor-${['base', 'mid', 'high'][objIndex]}`,
    midiChannel: objIndex + 9,
    synth: {
      type: ['Synth', 'FMSynth', 'PluckSynth'][objIndex],
      options: { envelope: { attack: 0.1, release: 0.8 + objIndex * 0.4 } }
    }
  });
});

console.log('Created phasor motion tracks:');
phasorTracks.forEach(track => {
  console.log(`  ${track.label}: ${track.notes.length} notes`);
});

console.log('');

// =============================================================================
// EXAMPLE 6: Fibonacci Sequences in Music
// =============================================================================

console.log('=== EXAMPLE 6: Fibonacci Sequences in Music ===');

// Generate Fibonacci sequence
const fibGen = fibonacci();
const fibNumbers = [];
for (let i = 0; i < 30; i++) {
  fibNumbers.push(fibGen.next().value);
}

console.log('First 15 Fibonacci numbers:', fibNumbers.slice(0, 15));

// Apply modulo operation to get scale degrees
const fibDegrees = fibNumbers.map(num => num % 7);
console.log('Fibonacci degrees (mod 7):', fibDegrees.slice(0, 15));

// Visualize Fibonacci sequences
try {
  // Raw Fibonacci numbers (first 20 to avoid huge values)
  await PlotRenderer.line(
    { x: Array.from({length: 20}, (_, i) => i), y: fibNumbers.slice(0, 20) },
    {
      title: 'Fibonacci Sequence (Raw Numbers)',
      xTitle: 'Index',
      yTitle: 'Fibonacci Number',
      color: 'purple'
    },
    'fibonacci-raw'
  );
  
  // Fibonacci degrees (modulo 7)
  await PlotRenderer.line(
    { x: Array.from({length: 30}, (_, i) => i), y: fibDegrees },
    {
      title: 'Fibonacci Sequence (Modulo 7 - Scale Degrees)',
      xTitle: 'Index',
      yTitle: 'Scale Degree',
      color: 'orange'
    },
    'fibonacci-degrees'
  );
  
  console.log('✓ Fibonacci sequence visualizations created');
} catch (error) {
  console.log('📊 Fibonacci sequence data generated (visualization not available)');
  console.log('  Raw Fibonacci sample:', fibNumbers.slice(0, 10));
  console.log('  Degrees sample:', fibDegrees.slice(0, 10));
}

// Convert Fibonacci to musical notes
const fibScale = new Scale('C', 'major').generate({ start: 60, length: 8 });
const fibPitches = fibDegrees.map(degree => fibScale[degree]);

console.log('Fibonacci pitches (first 10):', fibPitches.slice(0, 10));

// Create rhythmic pattern for Fibonacci melody
const fibDurations = [1, 0.25, 0.25, 0.5, 2]; // Interesting rhythmic cycle
const fibNotes = [];
let currentTime = 0;

fibPitches.forEach((pitch, i) => {
  const duration = fibDurations[i % fibDurations.length];
  fibNotes.push({ pitch, duration, time: currentTime });
  currentTime += duration;
});

const fibonacciTrack = notesToTrack(fibNotes, {
  label: 'fibonacci-melody',
  midiChannel: 12,
  synth: {
    type: 'PluckSynth',
    options: { resonance: 0.8, dampening: 4000 }
  }
});

console.log(`Created Fibonacci melody track with ${fibonacciTrack.notes.length} notes`);

console.log('');

// =============================================================================
// SUMMARY: Complete Multi-Track Composition
// =============================================================================

console.log('=== SUMMARY: Complete Multi-Track Composition ===');

// Combine selected tracks into a full composition
const fullComposition = {
  format: 'jmon',
  version: '1.0.0',
  bpm: 110,
  timeSignature: '4/4',
  keySignature: 'C',
  metadata: {
    name: 'Algorithmic Walks Showcase',
    composer: 'JMON Studio Walk Algorithms',
    description: 'A comprehensive demonstration of random walks, Gaussian processes, phasor motion, and Fibonacci sequences in music'
  },
  tracks: [
    // Random walks (first 2 branches)
    ...walkTracks.slice(0, 2),
    // Gaussian process blues (first track)
    bluesTracks[0],
    // Pachelbel variations (first track)
    pachelbelTracks[0],
    // Phasor motion (all components)
    ...phasorTracks,
    // Fibonacci melody
    fibonacciTrack
  ]
};

console.log('\n🎼 Complete Algorithmic Walks Composition:');
console.log(`- Title: "${fullComposition.metadata.name}"`);
console.log(`- Total tracks: ${fullComposition.tracks.length}`);
console.log(`- BPM: ${fullComposition.bpm}`);
console.log(`- Key: ${fullComposition.keySignature} ${fullComposition.timeSignature}`);

console.log('\nTrack breakdown:');
fullComposition.tracks.forEach((track, i) => {
  console.log(`  ${i + 1}. "${track.label}" - ${track.notes.length} notes (${track.synth.type}, CH${track.midiChannel})`);
});

// Calculate total composition length
const maxEndTime = Math.max(...fullComposition.tracks.map(track => 
  Math.max(...track.notes.map(note => note.time + note.duration))
));

console.log(`\n⏱️  Total composition length: ${maxEndTime.toFixed(2)} quarter notes (${(maxEndTime / 4).toFixed(1)} measures in 4/4)`);

console.log('\n=== Visualization Summary ===');
console.log('Generated plots demonstrate:');
console.log('  ✓ Probability distributions (Normal, Uniform, Discrete, Poisson)');
console.log('  ✓ Random walks with branching and merging');
console.log('  ✓ Gaussian process variations with different parameters');
console.log('  ✓ Fitted Gaussian process (Pachelbel Canon variations)');
console.log('  ✓ Phasor harmonic motion (amplitude and phase angle over time)');
console.log('  ✓ Fibonacci sequences (raw numbers and scale degrees)');

console.log('\n🎵 All walks successfully integrated into JMON format with numeric timing!');
console.log('📊 Interactive visualizations available in Plotly.js-enabled environments.');

// Export the composition for potential use
if (typeof window !== 'undefined') {
  window.algorithmic_walks_composition = fullComposition;
  console.log('\n💾 Composition exported to window.algorithmic_walks_composition');
}
