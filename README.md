# jmon-studio

Complete JMON (JSON Music Object Notation) studio: format conversion, algorithmic composition, and music visualization.

Combines the power of **jmon-format** and **djalgojs** into a single, comprehensive package for musical composition and algorithmic generation.

## Installation

```bash
npm install jmon-studio
```

## Quick Start

```javascript
const jmonStudio = require('jmon-studio');

// Use JMON format conversion
const composition = { /* your JMON composition */ };
const validation = jmonStudio.JmonTone.validateComposition(composition);

// Use algorithmic composition
const scale = new jmonStudio.Scale('C', 'major');
const polyloop = new jmonStudio.Polyloop(16, 4);

// Convenience objects
const { jmon, dj } = jmonStudio;
```

## Features

### 🎵 **JMON Format Conversion**
- **JmonTone**: Core format validation and Tone.js integration
- **ABC Notation**: Convert JMON to ABC notation (jmon-abc.js)
- **MIDI**: MIDI file conversion utilities (jmon-midi.js)
- **Display**: Visualization and playback functions (jmon-display.js)
- **SuperCollider**: Integration with SuperCollider (jmon-supercollider.js)

### 🤖 **Algorithmic Composition**
- **Music Theory**: Scales, progressions, harmony, rhythm
- **Generative Algorithms**: Fractals, cellular automata, genetic algorithms
- **AI/ML**: Gaussian processes, random walks
- **Minimalism**: Process-based composition techniques

### 📊 **Analysis & Utilities**
- Musical analysis tools
- Format conversion utilities
- Mathematical utilities for music

## Usage Examples

### Basic JMON Operations
```javascript
// Convert MIDI note to name
const noteName = jmonStudio.JmonTone.midiNoteToNoteName(60); // "C4"

// Validate composition
const result = jmonStudio.JmonTone.validateComposition(myComposition);
```

### Algorithmic Composition
```javascript
// Create a scale
const scale = new jmonStudio.Scale('D', 'dorian');
const notes = scale.getNotes();

// Generate with cellular automata
const ca = new jmonStudio.CellularAutomata();
const pattern = ca.generate();

// Create polyrhythmic loops
const polyloop = new jmonStudio.Polyloop(16, 3);
const rhythm = polyloop.generate();
```

### Convenience Objects
```javascript
const { dj } = require('jmon-studio');

// All algorithms available under dj.*
const mandelbrot = new dj.Fractals.Mandelbrot();
const genetic = new dj.GeneticAlgorithm();
```

## Observable Integration

Perfect for use in Observable notebooks:

```javascript
jm = require("jmon-studio@latest")

// Use immediately
scale = new jm.Scale('C', 'major')
composition = jm.JmonTone.validateComposition(data)
```

## Package Structure

- **Format**: `jmon.*` - JMON format conversion and validation
- **Algorithms**: `dj.*` - All algorithmic composition tools
- **Direct exports**: All classes available at top level

## License

MIT

## Links

- [GitHub Repository](https://github.com/jmonlabs/jmon-studio)
- [Issues](https://github.com/jmonlabs/jmon-studio/issues)