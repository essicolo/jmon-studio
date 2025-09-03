let v = null;
class E {
  /**
   * Create a polar radar chart visualization of polyloops using Plotly.js
   * Mirrors the functionality of the Python implementation
   */
  static plotPolyloop(o, a = {}) {
    const {
      pulse: e = 1 / 4,
      colors: s,
      measureLength: t = 4,
      container: n = "polyloop-plot",
      title: h = "Polyloop Visualization"
    } = a, r = s || this.generateColors(o.length), l = [], i = o.map((c) => c.label);
    o.forEach((c, g) => {
      const k = c.points.filter((p) => p.active);
      if (k.length !== 0 && (k.forEach((p) => {
        const d = p.angle, w = this.calculateDuration(p, c, t) * 360 / t, y = this.generateArcPoints(d, w, 100), M = Array(100).fill(o.length - g - 1);
        l.push({
          type: "scatterpolar",
          r: M,
          theta: y,
          mode: "lines",
          line: {
            color: "rgba(60, 60, 60, 0.65)",
            width: 8
          },
          name: `${c.label} Duration`,
          showlegend: !1
        }), [d, (d + w) % 360].forEach((x) => {
          l.push({
            type: "scatterpolar",
            r: [o.length - g - 0.9, o.length - g - 1.1],
            theta: [x, x],
            mode: "lines",
            line: {
              color: "Black",
              width: 3
            },
            name: `${c.label} Start/End`,
            showlegend: !1
          });
        });
      }), k.length > 0)) {
        const p = k.map((d) => d.angle);
        p.push(p[0]), l.push({
          type: "scatterpolar",
          r: Array(p.length).fill(o.length - g - 1),
          theta: p,
          mode: "lines",
          line: {
            color: "rgba(0, 0, 0, 0.65)",
            width: 1
          },
          fill: "toself",
          fillcolor: r[g % r.length],
          name: c.label,
          showlegend: !0
        });
      }
    });
    const u = [...l].reverse(), T = this.generateTickValues(t, e), P = this.generateTickLabels(t, e), m = Array.from({ length: o.length }, (c, g) => g), b = {
      title: { text: h },
      polar: {
        radialaxis: {
          visible: !0,
          range: [o.length, -0.1],
          tickvals: m,
          ticktext: i
        },
        angularaxis: {
          tickvals: T,
          ticktext: P,
          direction: "clockwise",
          rotation: 90
        }
      },
      template: "none",
      showlegend: !0,
      annotations: [{
        x: 0.5,
        y: 0.5,
        text: "�",
        showarrow: !1,
        font: {
          size: 30,
          color: "White"
        },
        xref: "paper",
        yref: "paper"
      }]
    }, f = {
      responsive: !0,
      displayModeBar: !0
    };
    return v.newPlot(n, u, b, f);
  }
  /**
   * Generate equally spaced colors using HSV color space
   */
  static generateColors(o) {
    const a = [];
    for (let e = 0; e < o; e++) {
      const s = e / o, t = this.hsvToRgb(s, 1, 1);
      a.push(`rgba(${Math.round(t.r * 255)}, ${Math.round(t.g * 255)}, ${Math.round(t.b * 255)}, 0.5)`);
    }
    return a;
  }
  /**
   * Convert HSV to RGB color space
   */
  static hsvToRgb(o, a, e) {
    let s, t, n;
    const h = Math.floor(o * 6), r = o * 6 - h, l = e * (1 - a), i = e * (1 - r * a), u = e * (1 - (1 - r) * a);
    switch (h % 6) {
      case 0:
        s = e, t = u, n = l;
        break;
      case 1:
        s = i, t = e, n = l;
        break;
      case 2:
        s = l, t = e, n = u;
        break;
      case 3:
        s = l, t = i, n = e;
        break;
      case 4:
        s = u, t = l, n = e;
        break;
      case 5:
        s = e, t = l, n = i;
        break;
      default:
        s = t = n = 0;
    }
    return { r: s, g: t, b: n };
  }
  /**
   * Generate arc points for smooth curves
   */
  static generateArcPoints(o, a, e) {
    const s = [];
    for (let t = 0; t < e; t++) {
      const n = o + t / (e - 1) * a;
      s.push(n % 360);
    }
    return s;
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
    const e = [], s = Math.floor(o / a);
    for (let t = 0; t < s; t++)
      e.push(t * 360 / s);
    return e;
  }
  /**
   * Generate tick labels for angular axis
   */
  static generateTickLabels(o, a) {
    const e = [], s = Math.floor(o / a);
    for (let t = 0; t < s; t++) {
      const n = t * a % o;
      e.push(n.toString());
    }
    return e;
  }
  /**
   * Create a timeline visualization of the polyloop triggers
   */
  static plotTimeline(o, a = 8, e = {}) {
    const {
      container: s = "polyloop-timeline",
      title: t = "Polyloop Timeline",
      colors: n
    } = e, h = n || this.generateColors(o.length), r = [];
    o.forEach((u, T) => {
      const P = u.points.filter((f) => f.active), m = [], b = [];
      P.forEach((f) => {
        const c = f.angle / 360 * 4;
        m.push(c), b.push(f.pitch || 60);
      }), m.length > 0 && r.push({
        type: "scatter",
        x: m,
        y: b,
        mode: "markers",
        marker: {
          color: h[T % h.length],
          size: 10
        },
        name: u.label
      });
    });
    const l = {
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
    }, i = {
      responsive: !0,
      displayModeBar: !0
    };
    return v.newPlot(s, r, l, i);
  }
  /**
   * Create animated frames of the polyloop visualization
   */
  static plotAnimated(o, a = 12, e = {}) {
    const s = [];
    for (let t = 0; t < a; t++) {
      const n = t / a * 360, h = o.map((l) => ({
        ...l,
        points: l.points.map((i) => ({
          ...i,
          angle: (i.angle + n * l.speed) % 360
        }))
      })), r = {
        ...e,
        container: `${e.container || "polyloop-plot"}-frame-${t}`,
        title: `${e.title || "Polyloop"} - Frame ${t + 1}`
      };
      s.push(this.plotPolyloop(h, r));
    }
    return Promise.all(s);
  }
  /**
   * Convert polyloop data to format compatible with Python implementation
   */
  static convertToPolyloopData(o) {
    const a = {};
    return o.forEach((e) => {
      const s = e.points.map((t) => [
        t.active && t.pitch || null,
        4 / e.divisions,
        // duration
        t.angle / 360 * 4
        // offset in beats
      ]);
      a[e.label] = s;
    }), a;
  }
}
export {
  E as PolyloopVisualizer
};
