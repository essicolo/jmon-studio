let g = null, T = !1;
async function x() {
  if (T) return g;
  T = !0;
  try {
    if (typeof window < "u" && window.Plotly)
      return g = window.Plotly, g;
    if (typeof window > "u") {
      const a = await import("plotly.js");
      return g = a.default || a, g;
    }
    return null;
  } catch {
    return console.warn("Plotly.js not available. Visualization methods will return placeholder data."), null;
  }
}
class z {
  /**
   * Plot loops using polar coordinate system, matching Python implementation
   * Works with JMON-compliant loop data
   */
  static async plotLoops(a, l = 4, e = 1 / 4, o = null, t = {}) {
    const {
      container: n = "loop-plot",
      title: d = "Loop Visualization"
    } = t, s = Object.values(a), r = o || this.generateColors(s.length), c = [];
    s.forEach((i, h) => {
      if (!i.notes || i.notes.length === 0) return;
      const y = i.notes.filter((u) => u.pitch !== null);
      if (y.length === 0) return;
      y.forEach((u) => {
        const b = u.time / l * 360, m = u.duration / l * 360, $ = this.generateArcPoints(b, m, 50), j = Array(50).fill(s.length - h - 1);
        c.push({
          type: "scatterpolar",
          r: j,
          theta: $,
          mode: "lines",
          line: {
            color: "rgba(60, 60, 60, 0.65)",
            width: 8
          },
          name: `${i.label} Duration`,
          showlegend: !1
        }), [b, (b + m) % 360].forEach((P) => {
          c.push({
            type: "scatterpolar",
            r: [s.length - h - 0.9, s.length - h - 1.1],
            theta: [P, P],
            mode: "lines",
            line: {
              color: "Black",
              width: 3
            },
            name: `${i.label} Markers`,
            showlegend: !1
          });
        });
      });
      const p = y.map((u) => u.time / l * 360);
      p.length > 1 && (p.push(p[0]), c.push({
        type: "scatterpolar",
        r: Array(p.length).fill(s.length - h - 1),
        theta: p,
        mode: "lines",
        line: {
          color: "rgba(0, 0, 0, 0.65)",
          width: 1
        },
        fill: "toself",
        fillcolor: r[h % r.length],
        name: i.label,
        showlegend: !1
      }));
    });
    const f = this.generateTickValues(l, e), M = this.generateTickLabels(l, e), A = s.map((i) => i.label), v = {
      title: { text: d },
      polar: {
        radialaxis: {
          visible: !0,
          range: [s.length, -0.1],
          tickvals: Array.from({ length: s.length }, (i, h) => h),
          ticktext: A
        },
        angularaxis: {
          tickvals: f,
          ticktext: M,
          direction: "clockwise",
          rotation: 90
        }
      },
      template: "none",
      showlegend: !1
    }, V = {
      responsive: !0,
      displayModeBar: !0
    }, k = await x();
    if (!k)
      throw new Error("Plotly.js not available for visualization");
    return k.newPlot(n, c, v, V);
  }
  /**
   * Generate equally spaced colors using HSV color space
   */
  static generateColors(a) {
    const l = [];
    for (let e = 0; e < a; e++) {
      const o = e / a, t = this.hsvToRgb(o, 1, 1);
      l.push(`rgba(${Math.round(t.r * 255)}, ${Math.round(t.g * 255)}, ${Math.round(t.b * 255)}, 0.5)`);
    }
    return l;
  }
  /**
   * Convert HSV to RGB color space
   */
  static hsvToRgb(a, l, e) {
    let o, t, n;
    const d = Math.floor(a * 6), s = a * 6 - d, r = e * (1 - l), c = e * (1 - s * l), f = e * (1 - (1 - s) * l);
    switch (d % 6) {
      case 0:
        o = e, t = f, n = r;
        break;
      case 1:
        o = c, t = e, n = r;
        break;
      case 2:
        o = r, t = e, n = f;
        break;
      case 3:
        o = r, t = c, n = e;
        break;
      case 4:
        o = f, t = r, n = e;
        break;
      case 5:
        o = e, t = r, n = c;
        break;
      default:
        o = t = n = 0;
    }
    return { r: o, g: t, b: n };
  }
  /**
   * Generate arc points for smooth curves
   */
  static generateArcPoints(a, l, e) {
    const o = [];
    for (let t = 0; t < e; t++) {
      const n = a + t / (e - 1) * l;
      o.push(n % 360);
    }
    return o;
  }
  /**
   * Generate tick values for angular axis
   */
  static generateTickValues(a, l) {
    const e = [], o = Math.floor(a / l);
    for (let t = 0; t < o; t++)
      e.push(t * 360 / o);
    return e;
  }
  /**
   * Generate tick labels for angular axis
   */
  static generateTickLabels(a, l) {
    const e = [], o = Math.floor(a / l);
    for (let t = 0; t < o; t++) {
      const n = t * l % a;
      e.push(n.toString());
    }
    return e;
  }
}
export {
  z as LoopVisualizer
};
