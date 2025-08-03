"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBF = void 0;
const base_1 = require("./base");
class RBF extends base_1.Kernel {
    constructor(lengthScale = 1.0, variance = 1.0) {
        super({ length_scale: lengthScale, variance });
        this.lengthScale = lengthScale;
        this.variance = variance;
    }
    compute(x1, x2) {
        const distance = this.euclideanDistance(x1, x2);
        return this.variance * Math.exp(-0.5 * Math.pow(distance / this.lengthScale, 2));
    }
    getParams() {
        return {
            length_scale: this.lengthScale,
            variance: this.variance,
        };
    }
}
exports.RBF = RBF;
//# sourceMappingURL=rbf.js.map