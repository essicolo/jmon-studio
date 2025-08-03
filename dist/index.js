"use strict";
/**
 * JMON Studio - Complete music composition and algorithmic generation library
 *
 * Combines JMON format conversion with powerful algorithmic composition tools
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.dj = exports.jmon = exports.JmonTone = exports.default = void 0;
// Format exports
var JmonTone_1 = require("./format/JmonTone");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return JmonTone_1.JmonTone; } });
var JmonTone_2 = require("./format/JmonTone");
Object.defineProperty(exports, "JmonTone", { enumerable: true, get: function () { return JmonTone_2.JmonTone; } });
// Algorithm exports (re-export from djalgojs)
__exportStar(require("./algorithms"), exports);
// Type exports
__exportStar(require("./types/jmon"), exports);
// Convenience grouped exports
const JmonTone_3 = require("./format/JmonTone");
const algorithms_1 = require("./algorithms");
exports.jmon = {
    JmonTone: JmonTone_3.JmonTone,
    // Add other format exports when converted
};
exports.dj = algorithms_1.dj;
exports.VERSION = '1.0.0';
//# sourceMappingURL=index.js.map