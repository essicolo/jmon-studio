/**
 * Genetic Algorithm Examples - Musical Evolution with Darwin
 * 
 * This example demonstrates the evolution of musical phrases using genetic algorithms,
 * closely following the Python djalgo Darwin class example with "Twinkle Twinkle Little Star"
 */

import jmon from '../src/index.js';

console.log('=== JMON Genetic Algorithm Examples ===\n');
console.log('Evolving musical phrases through natural selection!\n');

// === EXAMPLE 1: Twinkle Twinkle Little Star Evolution ===
console.log('=== EXAMPLE 1: Twinkle Twinkle Little Star Evolution ===');

// Define the initial phrase: Twinkle Twinkle Little Star in C major
const twinkleTwinkleLittleStar = [
  [60, 1.0, 0.0],   // C (twin)
  [60, 1.0, 1.0],   // C (kle)
  [67, 1.0, 2.0],   // G (twin)
  [67, 1.0, 3.0],   // G (kle)
  [69, 1.0, 4.0],   // A (lit)
  [69, 1.0, 5.0],   // A (tle)
  [67, 2.0, 6.0],   // G (star)
  [65, 1.0, 8.0],   // F (how)
  [65, 1.0, 9.0],   // F (I)
  [64, 1.0, 10.0],  // E (won)
  [64, 1.0, 11.0],  // E (der)
  [62, 1.0, 12.0],  // D (what)
  [62, 1.0, 13.0],  // D (you)
  [60, 2.0, 14.0],  // C (are)
];

console.log('Initial musical phrase: Twinkle Twinkle Little Star');
console.log('Notes:', twinkleTwinkleLittleStar.length);
console.log('Duration:', twinkleTwinkleLittleStar.reduce((sum, note) => Math.max(sum, note[2] + note[1]), 0), 'beats');

// Create C major scale for fitness evaluation
const cMajorScale = new jmon.theory.harmony.Scale('C', 'major');
console.log('Scale:', cMajorScale.generate({ length: 8 }));

// Analyze initial phrase
console.log('\nInitial phrase analysis:');
const initialPitches = twinkleTwinkleLittleStar.map(note => note[0]);
const initialDurations = twinkleTwinkleLittleStar.map(note => note[1]);

const pitchIndex = new jmon.analysis.MusicalIndex(initialPitches);
const durationIndex = new jmon.analysis.MusicalIndex(initialDurations);

const initialMetrics = {
  giniPitch: pitchIndex.gini(),
  giniDuration: durationIndex.gini(),
  balancePitch: pitchIndex.balance(),
  balanceDuration: durationIndex.balance(),
  motifPitch: pitchIndex.motif(),
  motifDuration: durationIndex.motif(),
  dissonance: pitchIndex.dissonance(cMajorScale.generate({ length: 8 })),
  rhythmic: durationIndex.rhythmic(4),
  rest: pitchIndex.restProportion()
};

console.log('  Gini (pitch):', initialMetrics.giniPitch.toFixed(3));
console.log('  Gini (rhythm):', initialMetrics.giniDuration.toFixed(3)); 
console.log('  Balance (pitch):', initialMetrics.balancePitch.toFixed(3));
console.log('  Balance (rhythm):', initialMetrics.balanceDuration.toFixed(3));
console.log('  Motif (pitch):', initialMetrics.motifPitch.toFixed(3));
console.log('  Motif (rhythm):', initialMetrics.motifDuration.toFixed(3));
console.log('  Dissonance:', initialMetrics.dissonance.toFixed(3));
console.log('  Rhythmic fit:', initialMetrics.rhythmic.toFixed(3));
console.log('  Rest proportion:', initialMetrics.rest.toFixed(3));

// Set up evolutionary parameters
const evolutionConfig = {
  initialPhrases: [twinkleTwinkleLittleStar],
  mutationRate: 0.05,
  populationSize: 200,
  scale: cMajorScale.generate({ length: 8 }),
  measureLength: 4,
  timeResolution: [0.25, 4],
  seed: 111,
  
  // Custom weights emphasizing different aspects
  weights: {
    gini: [1.0, 1.0, 0.0],
    balance: [1.0, 1.0, 0.0],
    motif: [10.0, 1.0, 0.0],      // Emphasize pitch motifs
    dissonance: [1.0, 0.0, 0.0],
    rhythmic: [0.0, 10.0, 0.0],   // Emphasize rhythmic fitness
    rest: [1.0, 0.0, 0.0]
  },
  
  // Target values for evolution
  targets: {
    gini: [0.2, 0.5, 0.0],      // More diversity in pitch, moderate in rhythm
    balance: [0.5, 0.1, 0.0],   // Good balance in pitch, tight rhythm
    motif: [0.8, 0.5, 0.0],     // Strong motifs
    dissonance: [0.05, 0.0, 0.0], // Low dissonance
    rhythmic: [0.0, 1.0, 0.0],  // Perfect rhythmic alignment  
    rest: [0.0, 0.0, 0.0]       // No rests
  }
};

console.log('\nInitializing Darwin genetic algorithm...');
const darwin = new jmon.generative.genetic.Darwin(evolutionConfig);

console.log(`Population size: ${darwin.populationSize}`);
console.log(`Mutation rate: ${darwin.mutationRate}`);
console.log(`Initial fitness: ${darwin.fitness(twinkleTwinkleLittleStar).toFixed(3)}`);

// Evolve for multiple generations
console.log('\nEvolving for 100 generations...');
const evolutionStats = [];

for (let generation = 0; generation < 100; generation++) {
  const stats = darwin.evolve(10); // Select top 10 for breeding
  evolutionStats.push(stats);
  
  if (generation % 20 === 0 || generation === 99) {
    console.log(`Generation ${generation}: Best fitness = ${stats.bestFitness.toFixed(3)}, Avg fitness = ${stats.averageFitness.toFixed(3)}`);
  }
}

// Analyze the evolved phrase
console.log('\n=== Evolution Results ===');
const finalPhrase = darwin.getBestIndividual();
const evolutionHistory = darwin.getEvolutionHistory();

console.log('Final phrase length:', finalPhrase.length);
console.log('Evolution generations:', evolutionHistory.generations);
console.log('Final fitness score:', evolutionHistory.scores[evolutionHistory.scores.length - 1].toFixed(3));
console.log('Initial fitness score:', evolutionHistory.scores[0].toFixed(3));
console.log('Fitness improvement:', 
  ((evolutionHistory.scores[evolutionHistory.scores.length - 1] - evolutionHistory.scores[0]) / evolutionHistory.scores[0] * 100).toFixed(1) + '%');

// Analyze final phrase metrics
console.log('\nFinal phrase analysis:');
const finalPitches = finalPhrase.map(note => note[0]);
const finalDurations = finalPhrase.map(note => note[1]);

const finalPitchIndex = new jmon.analysis.MusicalIndex(finalPitches);
const finalDurationIndex = new jmon.analysis.MusicalIndex(finalDurations);

const finalMetrics = {
  giniPitch: finalPitchIndex.gini(),
  giniDuration: finalDurationIndex.gini(),
  balancePitch: finalPitchIndex.balance(),
  balanceDuration: finalDurationIndex.balance(),
  motifPitch: finalPitchIndex.motif(),
  motifDuration: finalDurationIndex.motif(),
  dissonance: finalPitchIndex.dissonance(cMajorScale.generate({ length: 8 })),
  rhythmic: finalDurationIndex.rhythmic(4),
  rest: finalPitchIndex.restProportion()
};

console.log('  Gini (pitch):', finalMetrics.giniPitch.toFixed(3), 
  `(target: ${evolutionConfig.targets.gini[0]}, Δ: ${(finalMetrics.giniPitch - initialMetrics.giniPitch).toFixed(3)})`);
console.log('  Gini (rhythm):', finalMetrics.giniDuration.toFixed(3),
  `(target: ${evolutionConfig.targets.gini[1]}, Δ: ${(finalMetrics.giniDuration - initialMetrics.giniDuration).toFixed(3)})`);
console.log('  Balance (pitch):', finalMetrics.balancePitch.toFixed(3),
  `(target: ${evolutionConfig.targets.balance[0]}, Δ: ${(finalMetrics.balancePitch - initialMetrics.balancePitch).toFixed(3)})`);
console.log('  Balance (rhythm):', finalMetrics.balanceDuration.toFixed(3),
  `(target: ${evolutionConfig.targets.balance[1]}, Δ: ${(finalMetrics.balanceDuration - initialMetrics.balanceDuration).toFixed(3)})`);
console.log('  Motif (pitch):', finalMetrics.motifPitch.toFixed(3),
  `(target: ${evolutionConfig.targets.motif[0]}, Δ: ${(finalMetrics.motifPitch - initialMetrics.motifPitch).toFixed(3)})`);
console.log('  Motif (rhythm):', finalMetrics.motifDuration.toFixed(3),
  `(target: ${evolutionConfig.targets.motif[1]}, Δ: ${(finalMetrics.motifDuration - initialMetrics.motifDuration).toFixed(3)})`);
console.log('  Dissonance:', finalMetrics.dissonance.toFixed(3),
  `(target: ${evolutionConfig.targets.dissonance[0]}, Δ: ${(finalMetrics.dissonance - initialMetrics.dissonance).toFixed(3)})`);
console.log('  Rhythmic fit:', finalMetrics.rhythmic.toFixed(3),
  `(target: ${evolutionConfig.targets.rhythmic[1]}, Δ: ${(finalMetrics.rhythmic - initialMetrics.rhythmic).toFixed(3)})`);

// Show pitch evolution
console.log('\nPitch evolution comparison:');
console.log('Initial pitches:', initialPitches.join(', '));
console.log('Final pitches:  ', finalPitches.join(', '));

// Create JMON tracks for comparison
console.log('\n=== JMON Track Creation ===');

function createJMONTrack(phrase, label) {
  return {
    label,
    notes: phrase.map(([pitch, duration, time]) => ({
      pitch: pitch,
      time: time,
      duration: duration
    }))
  };
}

const originalTrack = createJMONTrack(twinkleTwinkleLittleStar, 'original-twinkle');
const evolvedTrack = createJMONTrack(finalPhrase, 'evolved-twinkle');

console.log('Original track:', originalTrack.notes.length, 'notes');
console.log('Evolved track:', evolvedTrack.notes.length, 'notes');

// === EXAMPLE 2: Multiple Population Evolution ===
console.log('\n=== EXAMPLE 2: Population Diversity Analysis ===');

const populationStats = darwin.getPopulationStats();
console.log('Population statistics:');
console.log('  Size:', populationStats.populationSize);
console.log('  Mean fitness:', populationStats.meanFitness.toFixed(3));
console.log('  Std deviation:', populationStats.standardDeviation.toFixed(3));
console.log('  Min fitness:', populationStats.minFitness.toFixed(3));
console.log('  Max fitness:', populationStats.maxFitness.toFixed(3));
console.log('  Fitness range:', (populationStats.maxFitness - populationStats.minFitness).toFixed(3));

// === EXAMPLE 3: Different Evolution Targets ===
console.log('\n=== EXAMPLE 3: Alternative Evolution Targets ===');

// Create a version optimized for rhythmic complexity
const rhythmicConfig = {
  ...evolutionConfig,
  targets: {
    gini: [0.8, 0.8, 0.0],      // High diversity
    balance: [0.2, 0.3, 0.0],   // Less balanced (more variation)
    motif: [0.3, 0.2, 0.0],     // Fewer motifs (more unpredictable)
    dissonance: [0.1, 0.0, 0.0], // Some dissonance allowed
    rhythmic: [0.0, 0.8, 0.0],  // Good but not perfect rhythm
    rest: [0.05, 0.0, 0.0]      // Small amount of rests
  },
  populationSize: 100,
  seed: 222
};

console.log('Creating rhythmically complex variation...');
const rhythmicDarwin = new jmon.generative.genetic.Darwin(rhythmicConfig);

// Evolve for fewer generations
for (let generation = 0; generation < 50; generation++) {
  rhythmicDarwin.evolve(5);
}

const rhythmicPhrase = rhythmicDarwin.getBestIndividual();
const rhythmicHistory = rhythmicDarwin.getEvolutionHistory();

console.log('Rhythmic variation results:');
console.log('  Phrase length:', rhythmicPhrase.length);
console.log('  Final fitness:', rhythmicHistory.scores[rhythmicHistory.scores.length - 1].toFixed(3));
console.log('  Pitches:', rhythmicPhrase.map(note => note[0]).join(', '));

// === EXAMPLE 4: Fitness Evolution Visualization Data ===
console.log('\n=== EXAMPLE 4: Evolution Statistics ===');

const fitnessProgress = evolutionHistory.scores;
const generations = Array.from({length: fitnessProgress.length}, (_, i) => i);

// Calculate statistics
const bestFitness = Math.max(...fitnessProgress);
const avgFitness = fitnessProgress.reduce((sum, f) => sum + f, 0) / fitnessProgress.length;
const fitnessVariance = fitnessProgress.reduce((sum, f) => sum + Math.pow(f - avgFitness, 2), 0) / fitnessProgress.length;

console.log('Fitness evolution statistics:');
console.log('  Best fitness achieved:', bestFitness.toFixed(3));
console.log('  Average fitness:', avgFitness.toFixed(3));
console.log('  Fitness variance:', fitnessVariance.toFixed(3));
console.log('  Final convergence rate:', 
  ((fitnessProgress[fitnessProgress.length - 1] - fitnessProgress[fitnessProgress.length - 10]) / 10).toFixed(4), 'per generation');

// Show fitness progress in groups
console.log('\nFitness progress (every 10 generations):');
for (let i = 0; i < fitnessProgress.length; i += 10) {
  const generationGroup = generations.slice(i, i + 10);
  const fitnessGroup = fitnessProgress.slice(i, i + 10);
  const avgGroupFitness = fitnessGroup.reduce((sum, f) => sum + f, 0) / fitnessGroup.length;
  console.log(`  Gen ${generationGroup[0]}-${generationGroup[generationGroup.length - 1]}: avg=${avgGroupFitness.toFixed(3)} max=${Math.max(...fitnessGroup).toFixed(3)}`);
}

// === EXAMPLE 5: Complete Composition Generation ===
console.log('\n=== EXAMPLE 5: Complete JMON Composition ===');

const composition = {
  meta: {
    title: 'Evolved Twinkle Variations',
    description: 'Musical evolution using genetic algorithms',
    composer: 'JMON Darwin Genetic Algorithm',
    created: new Date().toISOString(),
    bpm: 120,
    keySignature: 'C major',
    timeSignature: '4/4',
    evolutionParameters: {
      generations: evolutionHistory.generations,
      populationSize: evolutionConfig.populationSize,
      mutationRate: evolutionConfig.mutationRate,
      finalFitness: evolutionHistory.scores[evolutionHistory.scores.length - 1]
    }
  },
  tracks: [
    {
      label: 'original-melody',
      midiChannel: 0,
      synth: {
        type: 'Synth',
        options: {
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
        }
      },
      notes: originalTrack.notes
    },
    {
      label: 'evolved-melody', 
      midiChannel: 1,
      synth: {
        type: 'FMSynth',
        options: {
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 }
        }
      },
      notes: evolvedTrack.notes.map(note => ({
        ...note,
        time: note.time + 20 // Offset by 20 beats
      }))
    },
    {
      label: 'rhythmic-variation',
      midiChannel: 2, 
      synth: {
        type: 'PluckSynth',
        options: {
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 }
        }
      },
      notes: createJMONTrack(rhythmicPhrase, 'rhythmic').notes.map(note => ({
        ...note,
        time: note.time + 40 // Offset by 40 beats
      }))
    }
  ]
};

console.log('Generated composition:');
console.log('  Title:', composition.meta.title);
console.log('  Tracks:', composition.tracks.length);
console.log('  Total notes:', composition.tracks.reduce((sum, track) => sum + track.notes.length, 0));
console.log('  Total duration:', Math.max(...composition.tracks.flatMap(track => 
    track.notes.map(note => note.time + note.duration))), 'beats');

// Calculate composition statistics
const totalDuration = Math.max(...composition.tracks.flatMap(track => 
  track.notes.map(note => note.time + note.duration)));
const measuresCount = Math.ceil(totalDuration / 4);
const estimatedSeconds = (totalDuration / 4) * (60 / composition.meta.bpm) * 4; // 4/4 time

console.log('  Measures:', measuresCount);
console.log('  Estimated duration:', estimatedSeconds.toFixed(1), 'seconds');

console.log('\n=== Genetic Algorithm Summary ===');
console.log('✅ Successfully evolved Twinkle Twinkle Little Star through genetic algorithms');
console.log('✅ Implemented fitness evaluation with musical metrics');
console.log('✅ Demonstrated population evolution over 100+ generations');
console.log('✅ Created multiple evolutionary variants with different targets');
console.log('✅ Generated complete JMON composition with evolved tracks');
console.log('✅ Provided comprehensive evolution statistics and analysis');

console.log('\n🧬 Darwin genetic algorithm implementation complete!');
console.log('🎵 Musical evolution through natural selection achieved!');

export { composition, evolutionHistory, initialMetrics, finalMetrics };
