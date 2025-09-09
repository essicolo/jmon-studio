let d = null, E = !1;
async function D() {
  if (E) return d;
  E = !0;
  try {
    if (typeof window < "u" && window.Plotly)
      return d = window.Plotly, d;
    if (typeof window > "u") {
      const o = await import("plotly.js");
      return d = o.default || o, d;
    }
    return null;
  } catch {
    return console.warn("Plotly.js not available. Visualization methods will return placeholder data."), null;
  }
}
class C {
  /**
   * Create a polar radar chart visualization of loops using Plotly.js
   * Mirrors the functionality of the Python implementation
   */
  static async plotLoop(o, a = {}) {
    const {
      pulse: e = 1 / 4,
      colors: n,
      measureLength: t = 4,
      container: l = "loop-plot",
      title: u = "Loop Visualization"
    } = a, r = n || this.generateColors(o.length), s = [], p = o.map((h) => h.label);
    o.forEach((h, g) => {
      const T = h.points.filter((i) => i.active);
      if (T.length !== 0 && (T.forEach((i) => {
        const k = i.angle, M = this.calculateDuration(i, h, t) * 360 / t, L = this.generateArcPoints(k, M, 100), A = Array(100).fill(o.length - g - 1);
        s.push({
          type: "scatterpolar",
          r: A,
          theta: L,
          mode: "lines",
          line: {
            color: "rgba(60, 60, 60, 0.65)",
            width: 8
          },
          name: `${h.label} Duration`,
          showlegend: !1
        }), [k, (k + M) % 360].forEach((x) => {
          s.push({
            type: "scatterpolar",
            r: [o.length - g - 0.9, o.length - g - 1.1],
            theta: [x, x],
            mode: "lines",
            line: {
              color: "Black",
              width: 3
            },
            name: `${h.label} Start/End`,
            showlegend: !1
          });
        });
      }), T.length > 0)) {
        const i = T.map((k) => k.angle);
        i.push(i[0]), s.push({
          type: "scatterpolar",
          r: Array(i.length).fill(o.length - g - 1),
          theta: i,
          mode: "lines",
          line: {
            color: "rgba(0, 0, 0, 0.65)",
            width: 1
          },
          fill: "toself",
          fillcolor: r[g % r.length],
          name: h.label,
          showlegend: !1
        });
      }
    });
    const c = [...s].reverse(), P = this.generateTickValues(t, e), v = this.generateTickLabels(t, e), b = Array.from({ length: o.length }, (h, g) => g), m = {
      title: { text: u },
      polar: {
        radialaxis: {
          visible: !0,
          range: [o.length, -0.1],
          tickvals: b,
          ticktext: p
        },
        angularaxis: {
          tickvals: P,
          ticktext: v,
          direction: "clockwise",
          rotation: 90
        }
      },
      template: "none",
      showlegend: !1
    }, f = {
      responsive: !0,
      displayModeBar: !0
    }, w = await D();
    if (!w)
      throw new Error("Plotly.js not available for visualization");
    return w.newPlot(l, c, m, f);
  }
  /**
   * Generate equally spaced colors using HSV color space
   */
  static generateColors(o) {
    const a = [];
    for (let e = 0; e < o; e++) {
      const n = e / o, t = this.hsvToRgb(n, 1, 1);
      a.push(`rgba(${Math.round(t.r * 255)}, ${Math.round(t.g * 255)}, ${Math.round(t.b * 255)}, 0.5)`);
    }
    return a;
  }
  /**
   * Convert HSV to RGB color space
   */
  static hsvToRgb(o, a, e) {
    let n, t, l;
    const u = Math.floor(o * 6), r = o * 6 - u, s = e * (1 - a), p = e * (1 - r * a), c = e * (1 - (1 - r) * a);
    switch (u % 6) {
      case 0:
        n = e, t = c, l = s;
        break;
      case 1:
        n = p, t = e, l = s;
        break;
      case 2:
        n = s, t = e, l = c;
        break;
      case 3:
        n = s, t = p, l = e;
        break;
      case 4:
        n = c, t = s, l = e;
        break;
      case 5:
        n = e, t = s, l = p;
        break;
      default:
        n = t = l = 0;
    }
    return { r: n, g: t, b: l };
  }
  /**
   * Generate arc points for smooth curves
   */
  static generateArcPoints(o, a, e) {
    const n = [];
    for (let t = 0; t < e; t++) {
      const l = o + t / (e - 1) * a;
      n.push(l % 360);
    }
    return n;
  }
  /**
   * Calculate duration for a point (simplified for this implementation)
   */
  static calculateDuration(o, a, e) {
    return e / a.divisions;
  }
  /**
   * Generate tick values for angular axis
   */
  static generateTickValues(o, a) {
    const e = [], n = Math.floor(o / a);
    for (let t = 0; t < n; t++)
      e.push(t * 360 / n);
    return e;
  }
  /**
   * Generate tick labels for angular axis
   */
  static generateTickLabels(o, a) {
    const e = [], n = Math.floor(o / a);
    for (let t = 0; t < n; t++) {
      const l = t * a % o;
      e.push(l.toString());
    }
    return e;
  }
  /**
   * Create a timeline visualization of the loop triggers
   */
  static plotTimeline(o, a = 8, e = {}) {
    const {
      container: n = "loop-timeline",
      title: t = "Loop Timeline",
      colors: l
    } = e, u = l || this.generateColors(o.length), r = [];
    o.forEach((c, P) => {
      const v = c.points.filter((f) => f.active), b = [], m = [];
      v.forEach((f) => {
        const w = f.angle / 360 * 4;
        b.push(w), m.push(f.pitch || 60);
      }), b.length > 0 && r.push({
        type: "scatter",
        x: b,
        y: m,
        mode: "markers",
        marker: {
          color: u[P % u.length],
          size: 10
        },
        name: c.label
      });
    });
    const s = {
      title: { text: t },
      xaxis: {
        title: "Time (beats)",
        range: [0, a]
      },
      yaxis: {
        title: "Pitch (MIDI)",
        range: [20, 120]
      },
      showlegend: !0
    }, p = {
      responsive: !0,
      displayModeBar: !0
    };
    return d.newPlot(n, r, s, p);
  }
  /**
   * Convert loop data to format compatible with Python implementation
   */
  static convertToLoopData(o) {
    const a = {};
    return o.forEach((e) => {
      const n = e.points.map((t) => [
        t.active && t.pitch || null,
        4 / e.divisions,
        // duration
        t.angle / 360 * 4
        // offset in beats
      ]);
      a[e.label] = n;
    }), a;
  }
}
export {
  C as LoopVisualizer
};
