# GM Instruments Example - High-Quality Sampled Instruments

This example demonstrates how to use the new General MIDI (GM) sampled instruments in JMON Studio, powered by the FluidR3 soundfont via jsDelivr CDN.

## Observable/StarBoard Setup

```javascript
// 1. Load Tone.js
Tone = await require("tone@14.8.49")

// 2. Load JMON Studio with cache busting
jm = {
  const { default: jm } = await import(
    `https://essicolo.github.io/jmon-studio/dist/jmon.esm.js?v=${Date.now()}`
  );
  return jm;
}

// 3. Create a multi-track composition showcasing different instrument families
ensemble_piece = {
  const composition = {
    meta: {
      title: "GM Instruments Showcase",
      composer: "JMON Studio Demo"
    },
    bpm: 120,
    keySignature: "C",
    timeSignature: "4/4",
    tracks: [
      {
        label: "Piano Melody",
        notes: [
          // Simple C major scale melody
          { pitch: 60, duration: 0.5, time: 0 },   // C4
          { pitch: 62, duration: 0.5, time: 0.5 }, // D4
          { pitch: 64, duration: 0.5, time: 1 },   // E4
          { pitch: 65, duration: 0.5, time: 1.5 }, // F4
          { pitch: 67, duration: 0.5, time: 2 },   // G4
          { pitch: 69, duration: 0.5, time: 2.5 }, // A4
          { pitch: 71, duration: 0.5, time: 3 },   // B4
          { pitch: 72, duration: 1, time: 3.5 },   // C5
        ]
      },
      {
        label: "String Section",
        notes: [
          // Harmonic accompaniment
          { pitch: 48, duration: 2, time: 0 },     // C3
          { pitch: 52, duration: 2, time: 0 },     // E3
          { pitch: 55, duration: 2, time: 0 },     // G3
          { pitch: 53, duration: 2, time: 2 },     // F3
          { pitch: 57, duration: 2, time: 2 },     // A3
          { pitch: 60, duration: 2, time: 2 },     // C4
        ]
      },
      {
        label: "Bass Line",
        notes: [
          // Simple bass line
          { pitch: 36, duration: 1, time: 0 },     // C2
          { pitch: 36, duration: 1, time: 1 },     // C2
          { pitch: 41, duration: 1, time: 2 },     // F2
          { pitch: 41, duration: 1, time: 3 },     // F2
        ]
      },
      {
        label: "Trumpet Accent",
        notes: [
          // Trumpet flourish
          { pitch: 72, duration: 0.25, time: 3.5 }, // C5
          { pitch: 76, duration: 0.25, time: 3.75 }, // E5
          { pitch: 79, duration: 0.5, time: 4 },    // G5
        ]
      }
    ]
  };
  
  return composition;
}

// 4. Create the player with Tone.js
player = jm.play(ensemble_piece, { Tone })

// The player will now show organized dropdown menus:
// 
// Track "Piano Melody":
//   📁 Synthesizers
//      - PolySynth ✓ (default)
//      - Synth
//      - AMSynth
//      - etc.
//   📁 Piano
//      - Acoustic Grand Piano
//      - Bright Acoustic Piano
//      - Electric Piano 1
//      - Harpsichord
//   📁 Strings
//      - Violin
//      - Cello
//      - etc.
//   📁 Bass, Brass, Guitar, Organ, Woodwinds...

// 5. Try different instrument combinations:
//    - Set "Piano Melody" → Piano → "Acoustic Grand Piano"
//    - Set "String Section" → Strings → "String Ensemble 1" 
//    - Set "Bass Line" → Bass → "Electric Bass (finger)"
//    - Set "Trumpet Accent" → Brass → "Trumpet"
```

## What Happens Behind the Scenes

When you select a sampled instrument like "Acoustic Grand Piano":

1. **Automatic URL Generation**: The system generates URLs for all piano samples:
   ```javascript
   // Generated automatically:
   urls: {
     "A0": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/acoustic_grand_piano-mp3/A0.mp3",
     "As0": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/acoustic_grand_piano-mp3/As0.mp3",
     "B0": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/acoustic_grand_piano-mp3/B0.mp3",
     // ... continues for all notes A0 to C8 (88 piano keys)
   }
   ```

2. **Tone.js Sampler Creation**: Creates a `Tone.Sampler` with all the URLs:
   ```javascript
   synth = new Tone.Sampler({
     urls: samplerUrls,
     onload: () => console.log('GM instrument loaded'),
     onerror: (error) => console.error('Loading failed:', error)
   }).toDestination();
   ```

3. **Network Efficiency**: Samples are loaded on-demand from jsDelivr CDN, cached by the browser.

## Available Instrument Categories

### Piano (4 options)
- **Acoustic Grand Piano**: Classic concert grand
- **Bright Acoustic Piano**: Brighter, more percussive piano  
- **Electric Piano 1**: Rhodes-style electric piano
- **Harpsichord**: Baroque plucked keyboard

### Strings (3 options)  
- **Violin**: Solo violin samples
- **Cello**: Rich, warm cello tones
- **String Ensemble 1**: Orchestral string section

### Brass (2 options)
- **Trumpet**: Bright, heroic brass sound
- **Trombone**: Deep, sliding brass

### Woodwinds (3 options)
- **Alto Sax**: Smooth, jazzy saxophone
- **Clarinet**: Woody, expressive wind sound  
- **Flute**: Light, airy woodwind

### Guitar (2 options)
- **Acoustic Guitar (nylon)**: Classical guitar fingerpicking
- **Acoustic Guitar (steel)**: Bright steel-string strumming

### Bass (1 option)
- **Electric Bass (finger)**: Classic fingered electric bass

### Organ (2 options)  
- **Drawbar Organ**: Hammond-style organ
- **Accordion**: Traditional accordion squeeze-box

## Advanced Example - Programmatic Instrument Selection

```javascript
// Create a composition with specific instrument assignments
orchestral_demo = {
  const composition = {
    meta: { title: "Auto-Instrument Demo" },
    bpm: 100,
    tracks: [
      {
        label: "Lead Violin",
        // This will default to "Violin" if user selects from Strings category
        notes: [
          { pitch: 67, duration: 1, time: 0 },
          { pitch: 69, duration: 1, time: 1 },
          { pitch: 71, duration: 2, time: 2 }
        ]
      },
      {
        label: "Piano Accompaniment", 
        notes: [
          { pitch: 48, duration: 0.5, time: 0 },
          { pitch: 52, duration: 0.5, time: 0.5 },
          { pitch: 55, duration: 0.5, time: 1 }
        ]
      }
    ]
  };
  
  return composition;
}

// Create player
orchestral_player = jm.play(orchestral_demo, { Tone })

// Users can now select:
// Lead Violin: Strings → Violin (realistic violin samples)
// Piano Accompaniment: Piano → Acoustic Grand Piano (concert grand samples)
```

## Key Benefits

1. **High Quality**: FluidR3 is a professional-grade soundfont used in many commercial applications
2. **Zero Configuration**: Just select from dropdown - all URL mapping happens automatically  
3. **CDN Hosted**: Fast, reliable delivery via jsDelivr
4. **Browser Cached**: Samples are cached after first load
5. **Full Range**: Each instrument covers the full playable range (typically 88+ samples)
6. **Organized UI**: Clean categorization prevents overwhelming dropdown menus

## Performance Notes

- **First Load**: Instruments may take 1-2 seconds to load all samples on first use
- **Network Usage**: Each instrument downloads ~50-200 samples (varies by instrument range)  
- **Memory**: Samples stay in browser memory until page refresh
- **Fallback**: If sample loading fails, player falls back to PolySynth automatically

Try it out and hear the difference! 🎼✨
