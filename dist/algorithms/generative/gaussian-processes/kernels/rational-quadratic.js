"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RationalQuadratic = void 0;
const base_1 = require("./base");
class RationalQuadratic extends base_1.Kernel {
    constructor(lengthScale = 1.0, alpha = 1.0, variance = 1.0) {
        super({ length_scale: lengthScale, alpha, variance });
        this.lengthScale = lengthScale;
        this.alpha = alpha;
        this.variance = variance;
    }
    compute(x1, x2) {
        const distanceSquared = this.squaredEuclideanDistance(x1, x2);
        const term = 1 + distanceSquared / (2 * this.alpha * Math.pow(this.lengthScale, 2));
        return this.variance * Math.pow(term, -this.alpha);
    }
    getParams() {
        return {
            length_scale: this.lengthScale,
            alpha: this.alpha,
            variance: this.variance,
        };
    }
}
exports.RationalQuadratic = RationalQuadratic;
//# sourceMappingURL=rational-quadratic.js.map