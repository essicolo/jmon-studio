// Articulations Demo - "Mary Had a Little Lamb" with various articulations
// Extended version to showcase all articulation types

const baseMelody = {
  format: "jmon",
  version: "1.0.0",
  bpm: 100,
  timeSignature: "4/4",
  keySignature: "C",
  metadata: { 
    title: "Mary Had a Little Lamb",
    composer: "Traditional"
  },
  tracks: [
    {
      label: "Base Melody",
      notes: [
        // Mary had a little lamb (simple articulations)
        {pitch: 64, duration: 1.0, time: 0.0},   // E - Mary (staccato)
        {pitch: 62, duration: 1.0, time: 1.0},   // D - had (accent)
        {pitch: 60, duration: 1.0, time: 2.0},   // C - a (tenuto)
        {pitch: 62, duration: 1.0, time: 3.0},   // D - little (legato)
        {pitch: 64, duration: 1.0, time: 4.0},   // E - lamb (marcato)
        {pitch: 64, duration: 1.0, time: 5.0},   // E
        {pitch: 64, duration: 2.0, time: 6.0},   // E (long note)
        
        // Little lamb, little lamb (complex articulations)
        {pitch: 62, duration: 1.0, time: 8.0},   // D - Little (vibrato)
        {pitch: 62, duration: 1.0, time: 9.0},   // D - lamb (tremolo)
        {pitch: 62, duration: 2.0, time: 10.0},  // D (long note with crescendo)
        {pitch: 64, duration: 1.0, time: 12.0},  // E - little (bend)
        {pitch: 67, duration: 1.0, time: 13.0},  // G - lamb (glissando down)
        {pitch: 67, duration: 2.0, time: 14.0},  // G (long note with diminuendo)
        
        // Mary had a little lamb (more complex articulations)
        {pitch: 64, duration: 1.0, time: 16.0},  // E - Mary (portamento to D)
        {pitch: 62, duration: 1.0, time: 17.0},  // D - had (vibrato)
        {pitch: 60, duration: 1.0, time: 18.0},  // C - a (bend up)
        {pitch: 62, duration: 1.0, time: 19.0},  // D - little (tremolo)
        {pitch: 64, duration: 1.0, time: 20.0},  // E - lamb (glissando up)
        {pitch: 64, duration: 1.0, time: 21.0},  // E (staccato)
        {pitch: 64, duration: 1.0, time: 22.0},  // E (accent)
        {pitch: 62, duration: 1.0, time: 23.0},  // D (tenuto)
        {pitch: 62, duration: 1.0, time: 24.0},  // D (vibrato)
        {pitch: 64, duration: 1.0, time: 25.0},  // E (marcato)
        {pitch: 67, duration: 4.0, time: 26.0}   // G (final note with crescendo then diminuendo)
      ]
    }
  ]
};

// Apply articulations using the API
let articulatedNotes = [...baseMelody.tracks[0].notes];

console.log('Applying articulations to Mary Had a Little Lamb...');

// Simple articulations (first phrase)
jm.theory.harmony.addArticulation(articulatedNotes, 'staccato', 0);
jm.theory.harmony.addArticulation(articulatedNotes, 'accent', 1);
jm.theory.harmony.addArticulation(articulatedNotes, 'tenuto', 2);
jm.theory.harmony.addArticulation(articulatedNotes, 'legato', 3);
jm.theory.harmony.addArticulation(articulatedNotes, 'marcato', 4);

// Complex articulations (second phrase)
jm.theory.harmony.addArticulation(articulatedNotes, 'vibrato', 7, {
  rate: 6,    // Hz
  depth: 40,  // cents
  delay: 0.1  // seconds
});

jm.theory.harmony.addArticulation(articulatedNotes, 'tremolo', 8, {
  rate: 10,   // Hz
  depth: 0.4  // 0-1
});

jm.theory.harmony.addArticulation(articulatedNotes, 'crescendo', 9, {
  endVelocity: 0.9,
  curve: 'exponential'
});

jm.theory.harmony.addArticulation(articulatedNotes, 'bend', 11, {
  amount: 100,        // cents (semitone up)
  curve: 'linear',
  returnToOriginal: true
});

jm.theory.harmony.addArticulation(articulatedNotes, 'glissando', 12, {
  target: 60,         // Glide down to C
  curve: 'linear'
});

jm.theory.harmony.addArticulation(articulatedNotes, 'diminuendo', 13, {
  endVelocity: 0.3,
  curve: 'linear'
});

// More complex articulations (third phrase)
jm.theory.harmony.addArticulation(articulatedNotes, 'portamento', 14, {
  target: 62,         // Slide to D
  curve: 'exponential',
  speed: 0.5
});

jm.theory.harmony.addArticulation(articulatedNotes, 'vibrato', 15, {
  rate: 5,
  depth: 30,
  delay: 0
});

jm.theory.harmony.addArticulation(articulatedNotes, 'bend', 16, {
  amount: 50,         // Quarter tone up
  returnToOriginal: false
});

jm.theory.harmony.addArticulation(articulatedNotes, 'tremolo', 17, {
  rate: 12,
  depth: 0.6
});

jm.theory.harmony.addArticulation(articulatedNotes, 'glissando', 18, {
  target: 69,         // Glide up to A
  curve: 'exponential'
});

// Final phrase with mixed articulations
jm.theory.harmony.addArticulation(articulatedNotes, 'staccato', 19);
jm.theory.harmony.addArticulation(articulatedNotes, 'accent', 20);
jm.theory.harmony.addArticulation(articulatedNotes, 'tenuto', 21);
jm.theory.harmony.addArticulation(articulatedNotes, 'vibrato', 22, {
  rate: 7,
  depth: 50
});
jm.theory.harmony.addArticulation(articulatedNotes, 'marcato', 23);

// Final note with complex dynamics
jm.theory.harmony.addArticulation(articulatedNotes, 'crescendo', 24, {
  endVelocity: 0.95,
  curve: 'exponential'
});

// Create the final articulated piece
const maryWithArticulations = {
  ...baseMelody,
  metadata: {
    title: "Mary Had a Little Lamb (with Articulations)",
    composer: "Traditional (articulated with API)"
  },
  tracks: [
    {
      label: "Articulated Melody",
      notes: articulatedNotes
    }
  ]
};

console.log('Articulated piece created with', articulatedNotes.length, 'notes');

// Display the player
document.getElementById('player-container').appendChild(
    jm.play(maryWithArticulations, { autoplay: false })
);

// Display the score
document.getElementById('score-container').appendChild(
    jm.score(maryWithArticulations)
);

// Log information about articulations applied
console.log('Articulation types demonstrated:');
console.log('Simple Articulations:');
console.log('  - Staccato: Shortened notes');
console.log('  - Accent: Emphasized attacks');
console.log('  - Tenuto: Full duration with emphasis');
console.log('  - Legato: Smooth connections');
console.log('  - Marcato: Strong accents with separation');

console.log('Complex Articulations:');
console.log('  - Vibrato: Pitch oscillation with rate/depth control');
console.log('  - Tremolo: Volume oscillation');
console.log('  - Glissando: Smooth pitch slides');
console.log('  - Portamento: Expressive pitch slides');
console.log('  - Bend: Pitch bends with return options');
console.log('  - Crescendo: Gradual volume increase');
console.log('  - Diminuendo: Gradual volume decrease');

// Show the ABC notation with line breaks
const abcNotation = jm.converters.abc(maryWithArticulations, {
    measuresPerLine: 4,
    lineBreaks: [8, 16]
});
console.log('ABC notation with articulations:', abcNotation);