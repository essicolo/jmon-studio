/**
 * JMON-Native Minimalism Examples
 *
 * This file demonstrates minimalistic composition using the JMON-native API.
 */

import { Scale } from "../src/algorithms/theory/harmony/Scale.js";
import { isorhythm } from "../src/algorithms/theory/rhythm/isorhythm.js";
import {
  MinimalismProcess,
  Tintinnabuli,
} from "../src/algorithms/generative/minimalism/MinimalismProcess.js";
import { Voice } from "../src/algorithms/theory/harmony/Voice.js";
import { notesToTrack } from "../src/algorithms/utils/jmon-timing.js";
import * as jmonUtils from "../src/utils/jmon-utils.js";

console.log("=== JMON-Native Minimalism Examples ===\n");

// Helper function to display JMON scores
function displayJmonScore(data, title = "Score") {
  console.log(`=== ${title} ===`);

  // Handle different input types
  let notes;
  if (Array.isArray(data) && data[0]?.pitch !== undefined) {
    // Already JMON notes
    notes = data;
  } else if (Array.isArray(data) && Array.isArray(data[0])) {
    // Multiple sequences - show first one
    notes = data[0];
  } else {
    console.log("Unknown data format:", typeof data);
    return;
  }

  // Display first few notes
  const displayCount = Math.min(8, notes.length);
  notes.slice(0, displayCount).forEach((note, i) => {
    console.log(
      `  ${
        i + 1
      }: Pitch ${note.pitch}, Duration ${note.duration}, Time ${note.time}`,
    );
  });

  if (notes.length > displayCount) {
    console.log(`  ... (${notes.length - displayCount} more notes)`);
  }

  console.log("");
  return notes;
}

// =============================================================================
// EXAMPLE 1: JMON-Native Isorhythm
// =============================================================================

console.log("=== EXAMPLE 1: JMON-Native Isorhythm ===");

// Generate C major scale
const scale = new Scale("C", "major");
const pitchesCMajor = scale.generate({ start: 60, length: 8 }); // C4 to C5
console.log("C Major Scale Pitches:", pitchesCMajor);

// Basic isorhythm
const durations = [1, 1, 2];
const solfege = isorhythm(pitchesCMajor, durations);
console.log(solfege);

// More complex isorhythm
const complexDurations = [2, 1, 1, 2, 2, 1];
const complexSolfege = isorhythm(pitchesCMajor, complexDurations);
console.log(complexSolfege);

// Composition example
const trackPitches = [68, 64, 71, 69, 75, 73]; // E major notes
const trackDurations = [1, 0.5, 0.25, 0.5, 1, 0.75, 0.5, 0.5, 1, 2];
const trackNotes = isorhythm(trackPitches, trackDurations);
displayJmonScore(trackNotes, "E Major Composition");

// =============================================================================
// EXAMPLE 2: JMON-Native Minimalism Processes (Enhanced)
// =============================================================================

console.log("=== EXAMPLE 2: JMON-Native Minimalism Processes (Enhanced) ===");

// Additive forward process with custom timing
const additiveForward = new MinimalismProcess({
  operation: "additive",
  direction: "forward",
  repetition: 1,
}).generate(solfege.slice(0, 3)); // Use first 3 notes for clarity
console.log(additiveForward);

displayJmonScore(additiveForward, "Additive Forward Process");

// Generate complete JMON track directly
const forwardTrack = new MinimalismProcess({
  operation: "additive",
  direction: "forward",
  repetition: 0,
}).generateTrack(solfege.slice(0, 4), {
  label: "additive-melody",
  midiChannel: 0,
  synth: { type: "Synth", options: { envelope: { attack: 0.1 } } },
});
console.log(
  `Generated complete JMON track: "${forwardTrack.label}" with ${forwardTrack.notes.length} notes\n`,
);

// Additive backward process
const additiveBackward = new MinimalismProcess({
  operation: "additive",
  direction: "backward",
  repetition: 0,
}).generate(solfege.slice(0, 4));
displayJmonScore(additiveBackward, "Additive Backward Process");

// Subtractive processes with repetition
const subtractiveForward = new MinimalismProcess({
  operation: "subtractive",
  direction: "forward",
  repetition: 1,
}).generate(solfege.slice(0, 5));
displayJmonScore(
  subtractiveForward,
  "Subtractive Forward Process (with repetition)",
);

// =============================================================================
// EXAMPLE 3: Enhanced JMON-Native Tintinnabuli
// =============================================================================

console.log("=== EXAMPLE 3: Enhanced JMON-Native Tintinnabuli ===");

// Create tintinnabuli with custom timing configuration
const tintinnabuli = new Tintinnabuli(
  [60, 64, 67], // C major triad (lower octave)
  "down", // direction
  0, // rank
  { timeSignature: [4, 4], ticksPerQuarterNote: 480, beatsPerBar: 4 },
);
const tVoice = tintinnabuli.generate(solfege.slice(0, 6));
console.log(tVoice);

// Demonstrate different tintinnabuli directions
const directionsExample = ["up", "down", "alternate", "any"];
directionsExample.forEach((direction) => {
  const tint = new Tintinnabuli([60, 64, 67], direction, 0);
  const result = tint.generate(solfege.slice(0, 4));
  console.log(`${direction} direction - first note: pitch ${result[0].pitch}`);
});
console.log("");

// Show both voices together with timing
console.log("=== M-Voice and T-Voice Timing Comparison ===");
console.log("M-Voice (first 4 notes):");
solfege.slice(0, 4).forEach((note, i) => {
  console.log(
    `  ${
      i + 1
    }: Pitch ${note.pitch}, Time ${note.time}, Duration ${note.duration}`,
  );
});

console.log("T-Voice (first 4 notes):");
tVoice.slice(0, 4).forEach((note, i) => {
  console.log(
    `  ${
      i + 1
    }: Pitch ${note.pitch}, Time ${note.time}, Duration ${note.duration}`,
  );
});
console.log("");

// =============================================================================
// EXAMPLE 4: Enhanced JMON Utilities and Track Generation
// =============================================================================

console.log("=== EXAMPLE 4: Enhanced JMON Utilities and Track Generation ===");

// Use the new notesToTrack utility from timing utilities
const modernPart1 = notesToTrack(solfege, {
  label: "solfege-melody",
  midiChannel: 0,
  synth: {
    type: "Synth",
    options: { envelope: { attack: 0.05, release: 1.2 } },
  },
});
console.log(
  `Created modern JMON part: "${modernPart1.label}" with ${modernPart1.notes.length} notes`,
);

// Create T-voice part with different synth
const tVoicePart = notesToTrack(tVoice, {
  label: "tintinnabuli-harmony",
  midiChannel: 1,
  synth: { type: "PolySynth", options: { polyphony: 4 } },
});
console.log(
  `Created T-voice part: "${tVoicePart.label}" with ${tVoicePart.notes.length} notes`,
);

// Demonstrate numeric timing with different time signatures
console.log("\n=== Numeric Timing Examples ===");
const timeSignatures = [
  { sig: [4, 4], name: "4/4 time" },
  { sig: [3, 4], name: "3/4 time" },
  { sig: [7, 8], name: "7/8 time" },
  { sig: [5, 4], name: "5/4 time" },
];

timeSignatures.forEach(({ sig, name }) => {
  const [num, denom] = sig;
  const beatsPerBar = (num * 4) / denom;
  const testBeats = 5.75;
  const barNumber = Math.floor(testBeats / beatsPerBar);
  const beatInBar = testBeats % beatsPerBar;
  console.log(`${name}: ${testBeats} quarter notes = bar ${barNumber}, beat ${beatInBar.toFixed(2)}`);
});
console.log("");

// Create a complete composition
const composition = {
  title: "Enhanced Minimalism Study",
  composer: "JMON Studio Algorithm",
  timeSignature: "4/4",
  tempoMap: [{ time: 0, tempo: 120 }],
  keySignatureMap: [{ time: 0, keySignature: "C" }],
  tracks: [modernPart1, tVoicePart],
};

console.log("Created complete JMON composition:");
console.log(`- Title: "${composition.title}"`);
console.log(`- Tracks: ${composition.tracks.length}`);
composition.tracks.forEach((track, i) => {
  console.log(
    `  Track ${
      i + 1
    }: "${track.label}" (${track.notes.length} notes, MIDI ch. ${track.midiChannel})`,
  );
});
console.log("");

// =============================================================================
// EXAMPLE 5: Multi-Track Minimalist Composition
// =============================================================================

console.log("=== EXAMPLE 5: Multi-Track Minimalist Composition ===");

// Create different melody lines with JMON note objects
const melody1 = isorhythm([60, 64, 67, 72], [1, 1, 0.5, 1.5]);
const melody2 = isorhythm([67, 71, 74, 79], [0.5, 0.5, 1, 2]);

// Apply different minimalism processes with various configurations
const process1 = new MinimalismProcess({
  operation: "additive",
  direction: "forward",
  repetition: 1,
  timingConfig: {
    timeSignature: [4, 4],
    ticksPerQuarterNote: 480,
    beatsPerBar: 4,
  },
});

const process2 = new MinimalismProcess({
  operation: "subtractive",
  direction: "inward",
  repetition: 0,
  timingConfig: {
    timeSignature: [4, 4],
    ticksPerQuarterNote: 480,
    beatsPerBar: 4,
  },
});

// Generate complete tracks directly
const melodicTrack1 = process1.generateTrack(melody1, {
  label: "additive-melody",
  midiChannel: 0,
  synth: {
    type: "Synth",
    options: {
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
    },
  },
});

const melodicTrack2 = process2.generateTrack(melody2, {
  label: "subtractive-melody",
  midiChannel: 1,
  synth: { type: "AMSynth", options: { harmonicity: 3, modulationIndex: 10 } },
});

// Create tintinnabuli harmonies with different configurations
const harmony1 = new Tintinnabuli(
  [60, 64, 67],
  "up",
  0,
  { timeSignature: [4, 4], ticksPerQuarterNote: 480, beatsPerBar: 4 },
).generate(melody1);

const harmony2 = new Tintinnabuli(
  [67, 71, 74],
  "alternate",
  1,
  { timeSignature: [4, 4], ticksPerQuarterNote: 480, beatsPerBar: 4 },
).generate(melody2);

// Create harmony tracks
const harmonyTrack1 = notesToTrack(harmony1, {
  label: "tintinnabuli-1",
  midiChannel: 2,
  synth: { type: "PolySynth", options: { polyphony: 6 } },
});

const harmonyTrack2 = notesToTrack(harmony2, {
  label: "tintinnabuli-2",
  midiChannel: 3,
  synth: { type: "FMSynth", options: { harmonicity: 2, modulationIndex: 5 } },
});

// Create comprehensive composition
const multiTrackComposition = {
  title: "Multi-Track Minimalist Study",
  composer: "JMON Studio Enhanced Algorithm",
  timeSignature: "4/4",
  tempoMap: [{ time: 0, tempo: 100 }],
  keySignatureMap: [{ time: 0, keySignature: "C" }],
  synthConfig: {
    type: "Synth",
    options: {
      envelope: {
        enabled: true,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.8,
        release: 0.3,
      },
    },
  },
  tracks: [melodicTrack1, melodicTrack2, harmonyTrack1, harmonyTrack2],
};

console.log("Multi-track composition created:");
console.log(`- Title: "${multiTrackComposition.title}"`);
console.log(`- Total tracks: ${multiTrackComposition.tracks.length}`);
multiTrackComposition.tracks.forEach((track, i) => {
  console.log(
    `  Track ${
      i + 1
    }: "${track.label}" (${track.notes.length} notes, ${track.synth.type})`,
  );
});

// Calculate total duration
const allNoteTimes = multiTrackComposition.tracks.flatMap((track) =>
  track.notes.map((note) => note.time)
);
console.log(
  `- Sample time values: ${
    allNoteTimes.slice(0, 5).map((t) => `"${t}"`).join(", ")
  }...`,
);
console.log("");

// =============================================================================
// EXAMPLE 6: Harmonic Voicing and Chord Generation
// =============================================================================

console.log("=== EXAMPLE 6: Harmonic Voicing and Chord Generation ===");

// Create voice for different modes and tonics
const cMajorVoice = new Voice("major", "C", [0, 2, 4]); // Triads
const aMajoVoice = new Voice("major", "A", [0, 2, 4, 6]); // Seventh chords
const dMinorVoice = new Voice("minor", "D", [0, 2, 4]); // Minor triads

// Create a simple melody to harmonize
const simpleMelody = [60, 62, 64, 65, 67]; // C4, D4, E4, F4, G4
console.log("Original melody (MIDI pitches):", simpleMelody);

// Create a rhythmic melody for better beat analysis
const rhythmicSimpleMelody = [
  { pitch: 60, duration: 1, time: 0 }, // C4 on downbeat
  { pitch: 62, duration: 0.5, time: 1 }, // D4 on weak beat
  { pitch: 64, duration: 0.5, time: 1.5 }, // E4 on upbeat
  { pitch: 65, duration: 1, time: 2 }, // F4 on strong beat
  { pitch: 67, duration: 1, time: 3 }, // G4 on weak beat
];

console.log("\n--- Beat-Aware Chord Generation ---");
// Analyze beat positions first
const analyzedMelody = detectBeatPositions(rhythmicSimpleMelody);
console.log("Beat position analysis:");
analyzedMelody.forEach((note, i) => {
  console.log(
    `  Note ${
      i + 1
    }: pitch=${note.pitch}, time=${note.time}, beatStrength=${note.beatStrength}`,
  );
});

// Apply selective voicing - only harmonize strong beats
const selectiveChords = applySelectiveVoicing(
  rhythmicSimpleMelody,
  cMajorVoice,
  ["downbeat", "strong"],
);
console.log("\nSelective chord generation (downbeats + strong beats only):");
selectiveChords.forEach((note, i) => {
  const pitchDisplay = Array.isArray(note.pitch)
    ? `[${note.pitch.join(", ")}]`
    : note.pitch;
  console.log(
    `  Note ${i + 1}: ${pitchDisplay} (${note.beatStrength}, ${
      note.isHarmonized ? "HARMONIZED" : "melody"
    })`,
  );
});

// For comparison, show full harmonization
const fullChords = cMajorVoice.generate(
  rhythmicSimpleMelody.map((n) => n.pitch),
  rhythmicSimpleMelody.map((n) => n.duration),
  false,
);
console.log("\nFull harmonization (every note):");
fullChords.slice(0, 3).forEach((chord, i) => {
  const [pitches, duration, offset] = chord;
  console.log(
    `  Chord ${i + 1}: [${
      pitches.join(", ")
    }] (duration: ${duration}, offset: ${offset})`,
  );
});

// Convert chord progression to JMON notes for minimalism processing
function chordsToJmonNotes(chordArray) {
  return chordArray.map(([pitches, duration, offset]) => ({
    pitch: pitches, // Array of pitches for chord
    duration,
    time: offset,
  }));
}

// Convert arpeggios to JMON notes
function arpeggiosToJmonNotes(arpArray) {
  return arpArray.map(([pitch, duration, offset]) => ({
    pitch,
    duration,
    time: offset,
  }));
}

// Beat position detector for intelligent voicing
function detectBeatPositions(notes, timeSignature = [4, 4]) {
  const [numerator, denominator] = timeSignature;
  const beatsPerBar = (numerator * 4) / denominator;

  return notes.map((note) => {
    const time = typeof note.time === "number"
      ? note.time
      : parseFloat(note.time) || 0;
    const barPosition = time % beatsPerBar;
    const beatNumber = Math.floor(barPosition);
    const subBeatPosition = barPosition - beatNumber;

    // Classify beat strength
    let beatStrength;
    if (barPosition === 0) {
      beatStrength = "downbeat"; // Strongest beat (beat 1)
    } else if (subBeatPosition < 0.1) {
      // On-beat positions
      if (beatNumber % 2 === 0) {
        beatStrength = "strong"; // Strong beats (beat 3 in 4/4)
      } else {
        beatStrength = "weak"; // Weak beats (beats 2, 4 in 4/4)
      }
    } else if (Math.abs(subBeatPosition - 0.5) < 0.1) {
      beatStrength = "upbeat"; // 8th note upbeat (halfway between beats)
    } else {
      beatStrength = "offbeat"; // Other off-beat positions
    }

    return {
      ...note,
      beatPosition: barPosition,
      beatNumber,
      subBeatPosition,
      beatStrength,
    };
  });
}

// Apply voicing selectively based on beat positions
function applySelectiveVoicing(
  melody,
  voice,
  beatFilter = ["downbeat", "strong"],
) {
  const analyzedMelody = detectBeatPositions(melody);

  return analyzedMelody.map((note) => {
    if (beatFilter.includes(note.beatStrength)) {
      // Apply voicing to notes on selected beats
      const chord = voice.pitchToChord(note.pitch);
      return {
        ...note,
        pitch: chord, // Convert to chord
        isHarmonized: true,
      };
    } else {
      // Keep original note for other beat positions
      return {
        ...note,
        isHarmonized: false,
      };
    }
  });
}

// Convert beat-aware selective chords to JMON
const jmonSelectiveChords = selectiveChords.map((note) => ({
  pitch: note.pitch,
  duration: note.duration,
  time: note.time,
  beatStrength: note.beatStrength,
  isHarmonized: note.isHarmonized,
}));

// Also create arpeggios from upbeat notes only
const upbeatNotes = rhythmicSimpleMelody.filter((note) => {
  const analyzed = detectBeatPositions([note])[0];
  return analyzed.beatStrength === "upbeat";
});
const arpeggios = upbeatNotes.length > 0
  ? cMajorVoice.generate(
    upbeatNotes.map((n) => n.pitch),
    upbeatNotes.map((n) => n.duration),
    true,
  )
  : [];
const jmonArpeggios = arpeggiosToJmonNotes(arpeggios);

console.log("\n--- Beat-Aware JMON Conversion ---");
console.log(
  "First selective chord (harmonized):",
  JSON.stringify(jmonSelectiveChords.find((n) => n.isHarmonized), null, 2),
);
if (jmonArpeggios.length > 0) {
  console.log(
    "First upbeat arpeggio note:",
    JSON.stringify(jmonArpeggios[0], null, 2),
  );
}

// Apply minimalism processes to beat-aware harmonized notes only
console.log("\n--- Minimalism Processing on Beat-Aware Harmony ---");
const harmonizedOnly = jmonSelectiveChords.filter((note) => note.isHarmonized);
let processedChords = [];

if (harmonizedOnly.length > 0) {
  const chordMinimalism = new MinimalismProcess({
    operation: "additive",
    direction: "forward",
    repetition: 1,
  });

  processedChords = chordMinimalism.generate(harmonizedOnly);
  console.log(
    `Processed ${processedChords.length} harmonic events from ${harmonizedOnly.length} harmonized notes`,
  );
  console.log(
    "First processed harmony:",
    JSON.stringify(processedChords[0], null, 2),
  );
} else {
  console.log("No harmonized notes to process with minimalism");
}

// Create tracks with beat-aware approach
let harmonicTrack, arpeggioTrack;

if (harmonizedOnly.length > 0 && processedChords.length > 0) {
  // Create harmonic track from beat-aware selective harmonization
  harmonicTrack = notesToTrack(processedChords, {
    label: "beat-aware-harmony",
    midiChannel: 4,
    synth: {
      type: "PolySynth",
      options: {
        polyphony: 8,
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.5 },
      },
    },
  });
  console.log(
    `\nCreated beat-aware harmonic track: "${harmonicTrack.label}" with ${harmonicTrack.notes.length} notes`,
  );
}

// Create arpeggio track from upbeat notes only
if (jmonArpeggios.length > 0) {
  arpeggioTrack = notesToTrack(jmonArpeggios, {
    label: "upbeat-arpeggios",
    midiChannel: 5,
    synth: {
      type: "PluckSynth",
      options: {
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.9,
      },
    },
  });
  console.log(
    `Created upbeat arpeggio track: "${arpeggioTrack.label}" with ${arpeggioTrack.notes.length} notes`,
  );
}

// Also create a melody-only track for non-harmonized notes
const melodyOnly = jmonSelectiveChords.filter((note) => !note.isHarmonized);
const melodyTrack = notesToTrack(melodyOnly, {
  label: "selective-melody",
  midiChannel: 3,
  synth: {
    type: "Synth",
    options: {
      envelope: { attack: 0.02, release: 0.5 },
    },
  },
});
console.log(
  `Created melody-only track: "${melodyTrack.label}" with ${melodyTrack.notes.length} notes`,
);

// Demonstrate different beat-aware voicing strategies
console.log("\n--- Beat-Aware Voicing Strategies ---");

const testMelody = [
  { pitch: 67, duration: 0.5, time: 0 }, // G4 on downbeat
  { pitch: 69, duration: 0.5, time: 0.5 }, // A4 on upbeat
  { pitch: 65, duration: 1, time: 1 }, // F4 on weak beat
  { pitch: 64, duration: 1, time: 2 }, // E4 on strong beat
];

const voicingStrategies = [
  {
    filter: ["downbeat"],
    voice: new Voice("major", "C", [0, 2, 4]),
    name: "Downbeat-Only Triads (Traditional)",
  },
  {
    filter: ["upbeat", "offbeat"],
    voice: new Voice("major", "C", [0, 2, 4, 6]),
    name: "Upbeat Sevenths (Jazz/Syncopated)",
  },
  {
    filter: ["downbeat", "strong"],
    voice: new Voice("minor", "A", [0, 2, 4]),
    name: "Strong Beats Minor (Classical)",
  },
  {
    filter: ["weak"],
    voice: new Voice("dorian", "D", [0, 2, 4, 6, 8]),
    name: "Weak Beat Extensions (Modern)",
  },
];

voicingStrategies.forEach(({ filter, voice, name }) => {
  console.log(`\n${name}:`);
  const result = applySelectiveVoicing(testMelody, voice, filter);
  result.forEach((note, i) => {
    const pitchDisplay = Array.isArray(note.pitch)
      ? `[${note.pitch.join(", ")}]`
      : note.pitch;
    const status = note.isHarmonized ? "HARMONIZED" : "melody";
    console.log(`  ${pitchDisplay} (${note.beatStrength}, ${status})`);
  });
});

// Create a complex beat-aware harmonic minimalism composition
console.log("\n--- Complex Beat-Aware Harmonic Minimalism ---");
const melodyLine = isorhythm([60, 64, 67, 72], [1, 0.5, 0.75, 1.25]);

// Apply beat-aware voicing strategy: downbeats get full harmony, upbeats get arpeggios
const analyzedIsorhythm = detectBeatPositions(melodyLine);
const downbeatHarmony = applySelectiveVoicing(melodyLine, cMajorVoice, [
  "downbeat",
]);
const upbeatMelody = melodyLine.filter((note) => {
  const analysis = detectBeatPositions([note])[0];
  return analysis.beatStrength === "upbeat";
});

// Create arpeggiated harmony for upbeats
const upbeatArpeggios = upbeatMelody.length > 0
  ? cMajorVoice.generate(
    upbeatMelody.map((n) => n.pitch),
    upbeatMelody.map((n) => n.duration),
    true,
  )
  : [];

console.log("Beat analysis of isorhythm melody:");
analyzedIsorhythm.forEach((note, i) => {
  console.log(
    `  Note ${
      i + 1
    }: pitch=${note.pitch}, time=${note.time}, strength=${note.beatStrength}`,
  );
});

// Convert to JMON and apply tintinnabuli to harmonized notes only
const harmonizedDownbeats = downbeatHarmony.filter((n) => n.isHarmonized);
const baseHarmony = harmonizedDownbeats.map((note) => ({
  pitch: Array.isArray(note.pitch) ? note.pitch : [note.pitch],
  duration: note.duration,
  time: note.time,
}));

// Apply tintinnabuli to the melody line (not the harmony)
const tintinnabuliHarmony = new Tintinnabuli([60, 64, 67, 72], "alternate", 1)
  .generate(melodyLine);

// Create final beat-aware harmonic composition tracks
const tracks = [
  // Original melody line
  notesToTrack(melodyLine, {
    label: "lead-melody",
    midiChannel: 0,
    synth: { type: "Synth", options: { envelope: { attack: 0.02 } } },
  }),
  // Tintinnabuli counter-harmony (always present)
  notesToTrack(tintinnabuliHarmony, {
    label: "tintinnabuli-counter",
    midiChannel: 1,
    synth: { type: "FMSynth", options: { harmonicity: 3 } },
  }),
];

// Add downbeat harmony track if we have harmonized notes
if (baseHarmony.length > 0) {
  tracks.push(notesToTrack(baseHarmony, {
    label: "downbeat-chords",
    midiChannel: 2,
    synth: { type: "PolySynth", options: { polyphony: 6 } },
  }));
}

// Add upbeat arpeggios if they exist
if (upbeatArpeggios.length > 0) {
  tracks.push(notesToTrack(arpeggiosToJmonNotes(upbeatArpeggios), {
    label: "upbeat-arpeggios",
    midiChannel: 3,
    synth: { type: "PluckSynth", options: { resonance: 0.8 } },
  }));
}

const harmonicComposition = {
  title: "Beat-Aware Minimalist Harmonic Study",
  composer: "JMON Studio Beat-Aware Voicing Algorithm",
  timeSignature: "4/4",
  tempoMap: [{ time: 0, tempo: 96 }],
  keySignatureMap: [{ time: 0, keySignature: "C" }],
  tracks,
};

console.log("\nHarmonic composition created:");
console.log(`- Title: "${harmonicComposition.title}"`);
console.log(`- Tracks: ${harmonicComposition.tracks.length}`);
harmonicComposition.tracks.forEach((track, i) => {
  console.log(
    `  Track ${
      i + 1
    }: "${track.label}" (${track.notes.length} notes, ${track.synth.type})`,
  );
});

// =============================================================================
// Beat-Aware Voicing Demonstration
// =============================================================================

console.log("\n--- Beat-Aware Voicing ---");

// Create a melody with varied timing
const rhythmicMelody = [
  { pitch: 60, duration: 0.5, time: 0 }, // C4 on downbeat
  { pitch: 62, duration: 0.5, time: 0.5 }, // D4 on upbeat
  { pitch: 64, duration: 1, time: 1 }, // E4 on beat 2
  { pitch: 65, duration: 0.5, time: 2 }, // F4 on beat 3 (strong)
  { pitch: 67, duration: 0.5, time: 2.5 }, // G4 on upbeat
  { pitch: 69, duration: 1, time: 3 }, // A4 on beat 4 (weak)
  { pitch: 72, duration: 1, time: 4 }, // C5 on next downbeat
];

// Analyze beat positions
const analyzedRhythmicMelody = detectBeatPositions(rhythmicMelody);
console.log("Beat position analysis:");
analyzedRhythmicMelody.forEach((note, i) => {
  console.log(
    `  Note ${i + 1}: pitch=${note.pitch}, time=${note.time}, ` +
      `beatPos=${note.beatPosition.toFixed(2)}, strength=${note.beatStrength}`,
  );
});

// Apply voicing only to downbeats and strong beats
console.log("\n--- Selective Voicing (Downbeats + Strong Beats Only) ---");
const selectivelyVoiced = applySelectiveVoicing(rhythmicMelody, cMajorVoice, [
  "downbeat",
  "strong",
]);
selectivelyVoiced.forEach((note, i) => {
  const pitchDisplay = Array.isArray(note.pitch)
    ? `[${note.pitch.join(", ")}]`
    : note.pitch;
  console.log(
    `  Note ${i + 1}: ${pitchDisplay} (${note.beatStrength}, ` +
      `${note.isHarmonized ? "HARMONIZED" : "melody only"})`,
  );
});

// Apply voicing only to upbeats for syncopated harmony
console.log("\n--- Syncopated Voicing (Upbeats Only) ---");
const syncopatedVoicing = applySelectiveVoicing(rhythmicMelody, cMajorVoice, [
  "upbeat",
  "offbeat",
]);
syncopatedVoicing.forEach((note, i) => {
  const pitchDisplay = Array.isArray(note.pitch)
    ? `[${note.pitch.join(", ")}]`
    : note.pitch;
  console.log(
    `  Note ${i + 1}: ${pitchDisplay} (${note.beatStrength}, ` +
      `${note.isHarmonized ? "HARMONIZED" : "melody only"})`,
  );
});

// Create tracks with beat-aware voicing
const downbeatVoicingTrack = notesToTrack(
  selectivelyVoiced.map((note) => ({
    pitch: note.pitch,
    duration: note.duration,
    time: note.time,
  })),
  {
    label: "beat-aware-harmony",
    midiChannel: 6,
    synth: {
      type: "PolySynth",
      options: {
        polyphony: 4,
        envelope: { attack: 0.05, release: 0.8 },
      },
    },
  },
);

const syncopatedVoicingTrack = notesToTrack(
  syncopatedVoicing.map((note) => ({
    pitch: note.pitch,
    duration: note.duration,
    time: note.time,
  })),
  {
    label: "syncopated-harmony",
    midiChannel: 7,
    synth: {
      type: "FMSynth",
      options: {
        harmonicity: 4,
        modulationIndex: 8,
      },
    },
  },
);

console.log(`\nCreated beat-aware tracks:`);
console.log(
  `- "${downbeatVoicingTrack.label}" with ${downbeatVoicingTrack.notes.length} notes`,
);
console.log(
  `- "${syncopatedVoicingTrack.label}" with ${syncopatedVoicingTrack.notes.length} notes`,
);

console.log("");

// =============================================================================
// EXAMPLE 7: Input Format Flexibility and Validation
// =============================================================================

console.log("=== EXAMPLE 7: Input Format Flexibility and Validation ===");

// Demonstrate that minimalism processes accept various input formats
const mixedInputs = [
  // JMON note objects
  { pitch: 60, duration: "4n", time: 0 },
  // Legacy objects with numeric offset
  { pitch: 64, duration: 1, offset: 1 },
  // JMON with bars:beats:ticks time
  { pitch: 67, duration: "4n", time: "0:2:0" },
];

// Tuples (legacy format)
const tupleLegacy = [[72, 1, 0], [76, 0.5, 1], [79, 0.5, 1.5]];

console.log("Processing mixed input formats...");
const mixedProcess = new MinimalismProcess({
  operation: "additive",
  direction: "forward",
  repetition: 0,
});

// Process mixed objects - all get converted to JMON format
const processedMixed = mixedProcess.generate(mixedInputs);
console.log("Mixed objects processed (first 3):");
processedMixed.slice(0, 3).forEach((note, i) => {
  console.log(
    `  ${
      i + 1
    }: pitch=${note.pitch}, duration=${note.duration}, time="${note.time}"`,
  );
});

// Process tuples - also get converted to JMON format
const processedTuples = mixedProcess.generate(tupleLegacy);
console.log("\nTuples processed (all):");
processedTuples.forEach((note, i) => {
  console.log(
    `  ${
      i + 1
    }: pitch=${note.pitch}, duration=${note.duration}, time="${note.time}"`,
  );
});

// Show time format validation
console.log("\n=== Time Format Validation Examples ===");
const testTimes = ["0:1:240", "1:0:0", "0:2:480", "2:3:120"];
testTimes.forEach((timeStr) => {
  const process = new MinimalismProcess({
    operation: "additive",
    direction: "forward",
    repetition: 0,
  });
  const beats = process.timeToBeats(timeStr);
  const backToTime = process.beatsToTime(beats);
  console.log(`"${timeStr}" → ${beats} beats → "${backToTime}"`);
});

console.log("\n=== All Examples Completed Successfully! ===");
console.log(
  "The enhanced JMON-native minimalism API with beat-aware voicing now features:",
);
console.log(
  "  ✓ Complete bars:beats:ticks timing support with configurable time signatures",
);
console.log("  ✓ Direct JMON track generation with generateTrack() method");
console.log(
  "  ✓ Centralized timing utilities for consistency across algorithms",
);
console.log(
  "  ✓ Mixed input format support (JMON objects, legacy objects, tuples)",
);
console.log("  ✓ Enhanced tintinnabuli with configurable timing");
console.log("  ✓ Beat-aware voicing with intelligent harmonic placement");
console.log(
  "  ✓ Rhythmic analysis for downbeat/upbeat/strong/weak beat detection",
);
console.log(
  "  ✓ Selective harmonization strategies (traditional, jazz, modern)",
);
console.log(
  "  ✓ Integration of voicing, minimalism, and tintinnabuli algorithms",
);
console.log("  ✓ Full integration with JMON composition ecosystem");
console.log("  ✓ Professional DAW-compatible time representations");
console.log(
  "\nThis addresses both format impedance mismatch AND provides intelligent musical voicing!",
);
