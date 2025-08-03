"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Periodic = void 0;
const base_1 = require("./base");
class Periodic extends base_1.Kernel {
    constructor(lengthScale = 1.0, periodicity = 1.0, variance = 1.0) {
        super({ length_scale: lengthScale, periodicity, variance });
        this.lengthScale = lengthScale;
        this.periodicity = periodicity;
        this.variance = variance;
    }
    compute(x1, x2) {
        const distance = this.euclideanDistance(x1, x2);
        const sinTerm = Math.sin(Math.PI * distance / this.periodicity);
        return this.variance * Math.exp(-2 * Math.pow(sinTerm / this.lengthScale, 2));
    }
    getParams() {
        return {
            length_scale: this.lengthScale,
            periodicity: this.periodicity,
            variance: this.variance,
        };
    }
}
exports.Periodic = Periodic;
//# sourceMappingURL=periodic.js.map