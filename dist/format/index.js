"use strict";
/**
 * JMON Format - Complete format conversion and display utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.JmonToneClass = exports.jmon = exports.JmonTone = void 0;
// Core JMON format conversion (TypeScript)
var JmonTone_1 = require("./JmonTone");
Object.defineProperty(exports, "JmonTone", { enumerable: true, get: function () { return JmonTone_1.JmonTone; } });
// Re-export for convenience
const JmonTone_2 = require("./JmonTone");
// Convenience exports
exports.jmon = {
    // Core format (always available)
    JmonTone: JmonTone_2.JmonTone,
    // Note: Other format utilities (ABC, MIDI, SuperCollider, Display) 
    // are available as separate UMD modules that can be loaded in browser environments
    // They are included in the package but need to be loaded separately due to 
    // their dependencies on browser-specific APIs
};
exports.format = exports.jmon;
// Direct exports for convenience
var JmonTone_3 = require("./JmonTone");
Object.defineProperty(exports, "JmonToneClass", { enumerable: true, get: function () { return JmonTone_3.JmonTone; } });
//# sourceMappingURL=index.js.map