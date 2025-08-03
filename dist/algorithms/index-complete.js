"use strict";
// Complete djalgojs bundle with both algorithms and visualization
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.viz = exports.dj = void 0;
// Re-export all core functionality
__exportStar(require("./index-no-viz"), exports);
// Export all core functionality as dj
const core = __importStar(require("./index-no-viz"));
exports.dj = core;
// Helper function to get Plotly instance
const getPlotly = () => {
    const Plotly = globalThis.Plotly || window?.Plotly;
    if (typeof Plotly === 'undefined') {
        throw new Error('Plotly.js must be loaded globally before using visualization functions');
    }
    return Plotly;
};
// Export visualization as viz (expects global Plotly)
exports.viz = {
    scatter(x, y, element, title = 'Scatter Plot') {
        const Plotly = getPlotly();
        const data = [{
                x, y,
                mode: 'markers',
                type: 'scatter'
            }];
        const layout = {
            title: { text: title },
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' }
        };
        return Plotly.newPlot(element, data, layout);
    },
    line(x, y, element, title = 'Line Plot') {
        const Plotly = getPlotly();
        const data = [{
                x, y,
                mode: 'lines',
                type: 'scatter'
            }];
        const layout = {
            title: { text: title },
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' }
        };
        return Plotly.newPlot(element, data, layout);
    },
    polyloop(layers, element, title = 'Polyloop') {
        const Plotly = getPlotly();
        const traces = layers.map((layer, i) => ({
            r: layer.values || layer.durations || [1],
            theta: layer.angles || layer.positions || [0],
            mode: 'markers',
            type: 'scatterpolar',
            name: `Layer ${i + 1}`,
            marker: {
                size: 8,
                opacity: 0.7
            }
        }));
        const layout = {
            title: { text: title },
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, Math.max(...layers.flatMap(l => l.values || l.durations || [1]))]
                }
            }
        };
        return Plotly.newPlot(element, traces, layout);
    }
};
//# sourceMappingURL=index-complete.js.map