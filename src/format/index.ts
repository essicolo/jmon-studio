/**
 * JMON Format - Complete format conversion and display utilities
 */

// Core JMON format conversion (TypeScript)
export { JmonTone } from './JmonTone';

// Re-export for convenience
import { JmonTone } from './JmonTone';

// Convenience exports
export const jmon = {
    // Core format (always available)
    JmonTone,
    
    // Note: Other format utilities (ABC, MIDI, SuperCollider, Display) 
    // are available as separate UMD modules that can be loaded in browser environments
    // They are included in the package but need to be loaded separately due to 
    // their dependencies on browser-specific APIs
};

// Direct exports for convenience
export { JmonTone as JmonToneClass } from './JmonTone';

// Note: jmon-abc.js, jmon-display.js, jmon-midi.js, jmon-supercollider.js, and jmon-setup.js
// are included in the package as UMD modules for browser use
export { jmon as format };