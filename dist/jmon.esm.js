function di(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var He = { exports: {} }, Lt = {}, Me = {}, Ce = {}, Ut = {}, Bt = {}, Gt = {}, gr;
function It() {
  return gr || (gr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.regexpCode = s.getEsmExportName = s.getProperty = s.safeStringify = s.stringify = s.strConcat = s.addCodeArg = s.str = s._ = s.nil = s._Code = s.Name = s.IDENTIFIER = s._CodeOrName = void 0;
    class e {
    }
    s._CodeOrName = e, s.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(l) {
        if (super(), !s.IDENTIFIER.test(l))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    s.Name = t;
    class r extends e {
      constructor(l) {
        super(), this._items = typeof l == "string" ? [l] : l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const l = this._items[0];
        return l === "" || l === '""';
      }
      get str() {
        var l;
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((f, y) => `${f}${y}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((f, y) => (y instanceof t && (f[y.str] = (f[y.str] || 0) + 1), f), {});
      }
    }
    s._Code = r, s.nil = new r("");
    function n(p, ...l) {
      const f = [p[0]];
      let y = 0;
      for (; y < l.length; )
        a(f, l[y]), f.push(p[++y]);
      return new r(f);
    }
    s._ = n;
    const i = new r("+");
    function o(p, ...l) {
      const f = [w(p[0])];
      let y = 0;
      for (; y < l.length; )
        f.push(i), a(f, l[y]), f.push(i, w(p[++y]));
      return c(f), new r(f);
    }
    s.str = o;
    function a(p, l) {
      l instanceof r ? p.push(...l._items) : l instanceof t ? p.push(l) : p.push(g(l));
    }
    s.addCodeArg = a;
    function c(p) {
      let l = 1;
      for (; l < p.length - 1; ) {
        if (p[l] === i) {
          const f = u(p[l - 1], p[l + 1]);
          if (f !== void 0) {
            p.splice(l - 1, 3, f);
            continue;
          }
          p[l++] = "+";
        }
        l++;
      }
    }
    function u(p, l) {
      if (l === '""')
        return p;
      if (p === '""')
        return l;
      if (typeof p == "string")
        return l instanceof t || p[p.length - 1] !== '"' ? void 0 : typeof l != "string" ? `${p.slice(0, -1)}${l}"` : l[0] === '"' ? p.slice(0, -1) + l.slice(1) : void 0;
      if (typeof l == "string" && l[0] === '"' && !(p instanceof t))
        return `"${p}${l.slice(1)}`;
    }
    function d(p, l) {
      return l.emptyStr() ? p : p.emptyStr() ? l : o`${p}${l}`;
    }
    s.strConcat = d;
    function g(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : w(Array.isArray(p) ? p.join(",") : p);
    }
    function _(p) {
      return new r(w(p));
    }
    s.stringify = _;
    function w(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    s.safeStringify = w;
    function S(p) {
      return typeof p == "string" && s.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    s.getProperty = S;
    function m(p) {
      if (typeof p == "string" && s.IDENTIFIER.test(p))
        return new r(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    s.getEsmExportName = m;
    function h(p) {
      return new r(p.toString());
    }
    s.regexpCode = h;
  })(Gt)), Gt;
}
var Kt = {}, vr;
function br() {
  return vr || (vr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.ValueScope = s.ValueScopeName = s.Scope = s.varKinds = s.UsedValueState = void 0;
    const e = It();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (s.UsedValueState = r = {})), s.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class n {
      constructor({ prefixes: u, parent: d } = {}) {
        this._names = {}, this._prefixes = u, this._parent = d;
      }
      toName(u) {
        return u instanceof e.Name ? u : this.name(u);
      }
      name(u) {
        return new e.Name(this._newName(u));
      }
      _newName(u) {
        const d = this._names[u] || this._nameGroup(u);
        return `${u}${d.index++}`;
      }
      _nameGroup(u) {
        var d, g;
        if (!((g = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || g === void 0) && g.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    s.Scope = n;
    class i extends e.Name {
      constructor(u, d) {
        super(d), this.prefix = u;
      }
      setValue(u, { property: d, itemIndex: g }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(d)}[${g}]`;
      }
    }
    s.ValueScopeName = i;
    const o = (0, e._)`\n`;
    class a extends n {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : e.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new i(u, this._newName(u));
      }
      value(u, d) {
        var g;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(u), { prefix: w } = _, S = (g = d.key) !== null && g !== void 0 ? g : d.ref;
        let m = this._values[w];
        if (m) {
          const l = m.get(S);
          if (l)
            return l;
        } else
          m = this._values[w] = /* @__PURE__ */ new Map();
        m.set(S, _);
        const h = this._scope[w] || (this._scope[w] = []), p = h.length;
        return h[p] = d.ref, _.setValue(d, { property: w, itemIndex: p }), _;
      }
      getValue(u, d) {
        const g = this._values[u];
        if (g)
          return g.get(d);
      }
      scopeRefs(u, d = this._values) {
        return this._reduceValues(d, (g) => {
          if (g.scopePath === void 0)
            throw new Error(`CodeGen: name "${g}" has no value`);
          return (0, e._)`${u}${g.scopePath}`;
        });
      }
      scopeCode(u = this._values, d, g) {
        return this._reduceValues(u, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, d, g);
      }
      _reduceValues(u, d, g = {}, _) {
        let w = e.nil;
        for (const S in u) {
          const m = u[S];
          if (!m)
            continue;
          const h = g[S] = g[S] || /* @__PURE__ */ new Map();
          m.forEach((p) => {
            if (h.has(p))
              return;
            h.set(p, r.Started);
            let l = d(p);
            if (l) {
              const f = this.opts.es5 ? s.varKinds.var : s.varKinds.const;
              w = (0, e._)`${w}${f} ${p} = ${l};${this.opts._n}`;
            } else if (l = _?.(p))
              w = (0, e._)`${w}${l}${this.opts._n}`;
            else
              throw new t(p);
            h.set(p, r.Completed);
          });
        }
        return w;
      }
    }
    s.ValueScope = a;
  })(Kt)), Kt;
}
var wr;
function W() {
  return wr || (wr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.or = s.and = s.not = s.CodeGen = s.operators = s.varKinds = s.ValueScopeName = s.ValueScope = s.Scope = s.Name = s.regexpCode = s.stringify = s.getProperty = s.nil = s.strConcat = s.str = s._ = void 0;
    const e = It(), t = br();
    var r = It();
    Object.defineProperty(s, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(s, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(s, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(s, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(s, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(s, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(s, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(s, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var n = br();
    Object.defineProperty(s, "Scope", { enumerable: !0, get: function() {
      return n.Scope;
    } }), Object.defineProperty(s, "ValueScope", { enumerable: !0, get: function() {
      return n.ValueScope;
    } }), Object.defineProperty(s, "ValueScopeName", { enumerable: !0, get: function() {
      return n.ValueScopeName;
    } }), Object.defineProperty(s, "varKinds", { enumerable: !0, get: function() {
      return n.varKinds;
    } }), s.operators = {
      GT: new e._Code(">"),
      GTE: new e._Code(">="),
      LT: new e._Code("<"),
      LTE: new e._Code("<="),
      EQ: new e._Code("==="),
      NEQ: new e._Code("!=="),
      NOT: new e._Code("!"),
      OR: new e._Code("||"),
      AND: new e._Code("&&"),
      ADD: new e._Code("+")
    };
    class i {
      optimizeNodes() {
        return this;
      }
      optimizeNames(v, E) {
        return this;
      }
    }
    class o extends i {
      constructor(v, E, j) {
        super(), this.varKind = v, this.name = E, this.rhs = j;
      }
      render({ es5: v, _n: E }) {
        const j = v ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${j} ${this.name}${F};` + E;
      }
      optimizeNames(v, E) {
        if (v[this.name.str])
          return this.rhs && (this.rhs = K(this.rhs, v, E)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(v, E, j) {
        super(), this.lhs = v, this.rhs = E, this.sideEffects = j;
      }
      render({ _n: v }) {
        return `${this.lhs} = ${this.rhs};` + v;
      }
      optimizeNames(v, E) {
        if (!(this.lhs instanceof e.Name && !v[this.lhs.str] && !this.sideEffects))
          return this.rhs = K(this.rhs, v, E), this;
      }
      get names() {
        const v = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return B(v, this.rhs);
      }
    }
    class c extends a {
      constructor(v, E, j, F) {
        super(v, j, F), this.op = E;
      }
      render({ _n: v }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + v;
      }
    }
    class u extends i {
      constructor(v) {
        super(), this.label = v, this.names = {};
      }
      render({ _n: v }) {
        return `${this.label}:` + v;
      }
    }
    class d extends i {
      constructor(v) {
        super(), this.label = v, this.names = {};
      }
      render({ _n: v }) {
        return `break${this.label ? ` ${this.label}` : ""};` + v;
      }
    }
    class g extends i {
      constructor(v) {
        super(), this.error = v;
      }
      render({ _n: v }) {
        return `throw ${this.error};` + v;
      }
      get names() {
        return this.error.names;
      }
    }
    class _ extends i {
      constructor(v) {
        super(), this.code = v;
      }
      render({ _n: v }) {
        return `${this.code};` + v;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(v, E) {
        return this.code = K(this.code, v, E), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class w extends i {
      constructor(v = []) {
        super(), this.nodes = v;
      }
      render(v) {
        return this.nodes.reduce((E, j) => E + j.render(v), "");
      }
      optimizeNodes() {
        const { nodes: v } = this;
        let E = v.length;
        for (; E--; ) {
          const j = v[E].optimizeNodes();
          Array.isArray(j) ? v.splice(E, 1, ...j) : j ? v[E] = j : v.splice(E, 1);
        }
        return v.length > 0 ? this : void 0;
      }
      optimizeNames(v, E) {
        const { nodes: j } = this;
        let F = j.length;
        for (; F--; ) {
          const V = j[F];
          V.optimizeNames(v, E) || (se(v, V.names), j.splice(F, 1));
        }
        return j.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((v, E) => U(v, E.names), {});
      }
    }
    class S extends w {
      render(v) {
        return "{" + v._n + super.render(v) + "}" + v._n;
      }
    }
    class m extends w {
    }
    class h extends S {
    }
    h.kind = "else";
    class p extends S {
      constructor(v, E) {
        super(E), this.condition = v;
      }
      render(v) {
        let E = `if(${this.condition})` + super.render(v);
        return this.else && (E += "else " + this.else.render(v)), E;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const v = this.condition;
        if (v === !0)
          return this.nodes;
        let E = this.else;
        if (E) {
          const j = E.optimizeNodes();
          E = this.else = Array.isArray(j) ? new h(j) : j;
        }
        if (E)
          return v === !1 ? E instanceof p ? E : E.nodes : this.nodes.length ? this : new p(ye(v), E instanceof p ? [E] : E.nodes);
        if (!(v === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(v, E) {
        var j;
        if (this.else = (j = this.else) === null || j === void 0 ? void 0 : j.optimizeNames(v, E), !!(super.optimizeNames(v, E) || this.else))
          return this.condition = K(this.condition, v, E), this;
      }
      get names() {
        const v = super.names;
        return B(v, this.condition), this.else && U(v, this.else.names), v;
      }
    }
    p.kind = "if";
    class l extends S {
    }
    l.kind = "for";
    class f extends l {
      constructor(v) {
        super(), this.iteration = v;
      }
      render(v) {
        return `for(${this.iteration})` + super.render(v);
      }
      optimizeNames(v, E) {
        if (super.optimizeNames(v, E))
          return this.iteration = K(this.iteration, v, E), this;
      }
      get names() {
        return U(super.names, this.iteration.names);
      }
    }
    class y extends l {
      constructor(v, E, j, F) {
        super(), this.varKind = v, this.name = E, this.from = j, this.to = F;
      }
      render(v) {
        const E = v.es5 ? t.varKinds.var : this.varKind, { name: j, from: F, to: V } = this;
        return `for(${E} ${j}=${F}; ${j}<${V}; ${j}++)` + super.render(v);
      }
      get names() {
        const v = B(super.names, this.from);
        return B(v, this.to);
      }
    }
    class $ extends l {
      constructor(v, E, j, F) {
        super(), this.loop = v, this.varKind = E, this.name = j, this.iterable = F;
      }
      render(v) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(v);
      }
      optimizeNames(v, E) {
        if (super.optimizeNames(v, E))
          return this.iterable = K(this.iterable, v, E), this;
      }
      get names() {
        return U(super.names, this.iterable.names);
      }
    }
    class b extends S {
      constructor(v, E, j) {
        super(), this.name = v, this.args = E, this.async = j;
      }
      render(v) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(v);
      }
    }
    b.kind = "func";
    class P extends w {
      render(v) {
        return "return " + super.render(v);
      }
    }
    P.kind = "return";
    class T extends S {
      render(v) {
        let E = "try" + super.render(v);
        return this.catch && (E += this.catch.render(v)), this.finally && (E += this.finally.render(v)), E;
      }
      optimizeNodes() {
        var v, E;
        return super.optimizeNodes(), (v = this.catch) === null || v === void 0 || v.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(v, E) {
        var j, F;
        return super.optimizeNames(v, E), (j = this.catch) === null || j === void 0 || j.optimizeNames(v, E), (F = this.finally) === null || F === void 0 || F.optimizeNames(v, E), this;
      }
      get names() {
        const v = super.names;
        return this.catch && U(v, this.catch.names), this.finally && U(v, this.finally.names), v;
      }
    }
    class q extends S {
      constructor(v) {
        super(), this.error = v;
      }
      render(v) {
        return `catch(${this.error})` + super.render(v);
      }
    }
    q.kind = "catch";
    class D extends S {
      render(v) {
        return "finally" + super.render(v);
      }
    }
    D.kind = "finally";
    class z {
      constructor(v, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = v, this._scope = new t.Scope({ parent: v }), this._nodes = [new m()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(v) {
        return this._scope.name(v);
      }
      // reserves unique name in the external scope
      scopeName(v) {
        return this._extScope.name(v);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(v, E) {
        const j = this._extScope.value(v, E);
        return (this._values[j.prefix] || (this._values[j.prefix] = /* @__PURE__ */ new Set())).add(j), j;
      }
      getScopeValue(v, E) {
        return this._extScope.getValue(v, E);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(v) {
        return this._extScope.scopeRefs(v, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(v, E, j, F) {
        const V = this._scope.toName(E);
        return j !== void 0 && F && (this._constants[V.str] = j), this._leafNode(new o(v, V, j)), V;
      }
      // `const` declaration (`var` in es5 mode)
      const(v, E, j) {
        return this._def(t.varKinds.const, v, E, j);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(v, E, j) {
        return this._def(t.varKinds.let, v, E, j);
      }
      // `var` declaration with optional assignment
      var(v, E, j) {
        return this._def(t.varKinds.var, v, E, j);
      }
      // assignment code
      assign(v, E, j) {
        return this._leafNode(new a(v, E, j));
      }
      // `+=` code
      add(v, E) {
        return this._leafNode(new c(v, s.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(v) {
        return typeof v == "function" ? v() : v !== e.nil && this._leafNode(new _(v)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...v) {
        const E = ["{"];
        for (const [j, F] of v)
          E.length > 1 && E.push(","), E.push(j), (j !== F || this.opts.es5) && (E.push(":"), (0, e.addCodeArg)(E, F));
        return E.push("}"), new e._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(v, E, j) {
        if (this._blockNode(new p(v)), E && j)
          this.code(E).else().code(j).endIf();
        else if (E)
          this.code(E).endIf();
        else if (j)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(v) {
        return this._elseNode(new p(v));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, h);
      }
      _for(v, E) {
        return this._blockNode(v), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(v, E) {
        return this._for(new f(v), E);
      }
      // `for` statement for a range of values
      forRange(v, E, j, F, V = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Q = this._scope.toName(v);
        return this._for(new y(V, Q, E, j), () => F(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(v, E, j, F = t.varKinds.const) {
        const V = this._scope.toName(v);
        if (this.opts.es5) {
          const Q = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${Q}.length`, (J) => {
            this.var(V, (0, e._)`${Q}[${J}]`), j(V);
          });
        }
        return this._for(new $("of", F, V, E), () => j(V));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(v, E, j, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(v, (0, e._)`Object.keys(${E})`, j);
        const V = this._scope.toName(v);
        return this._for(new $("in", F, V, E), () => j(V));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(l);
      }
      // `label` statement
      label(v) {
        return this._leafNode(new u(v));
      }
      // `break` statement
      break(v) {
        return this._leafNode(new d(v));
      }
      // `return` statement
      return(v) {
        const E = new P();
        if (this._blockNode(E), this.code(v), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(P);
      }
      // `try` statement
      try(v, E, j) {
        if (!E && !j)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new T();
        if (this._blockNode(F), this.code(v), E) {
          const V = this.name("e");
          this._currNode = F.catch = new q(V), E(V);
        }
        return j && (this._currNode = F.finally = new D(), this.code(j)), this._endBlockNode(q, D);
      }
      // `throw` statement
      throw(v) {
        return this._leafNode(new g(v));
      }
      // start self-balancing block
      block(v, E) {
        return this._blockStarts.push(this._nodes.length), v && this.code(v).endBlock(E), this;
      }
      // end the current self-balancing block
      endBlock(v) {
        const E = this._blockStarts.pop();
        if (E === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const j = this._nodes.length - E;
        if (j < 0 || v !== void 0 && j !== v)
          throw new Error(`CodeGen: wrong number of nodes: ${j} vs ${v} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(v, E = e.nil, j, F) {
        return this._blockNode(new b(v, E, j)), F && this.code(F).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(b);
      }
      optimize(v = 1) {
        for (; v-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(v) {
        return this._currNode.nodes.push(v), this;
      }
      _blockNode(v) {
        this._currNode.nodes.push(v), this._nodes.push(v);
      }
      _endBlockNode(v, E) {
        const j = this._currNode;
        if (j instanceof v || E && j instanceof E)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${E ? `${v.kind}/${E.kind}` : v.kind}"`);
      }
      _elseNode(v) {
        const E = this._currNode;
        if (!(E instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = E.else = v, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const v = this._nodes;
        return v[v.length - 1];
      }
      set _currNode(v) {
        const E = this._nodes;
        E[E.length - 1] = v;
      }
    }
    s.CodeGen = z;
    function U(C, v) {
      for (const E in v)
        C[E] = (C[E] || 0) + (v[E] || 0);
      return C;
    }
    function B(C, v) {
      return v instanceof e._CodeOrName ? U(C, v.names) : C;
    }
    function K(C, v, E) {
      if (C instanceof e.Name)
        return j(C);
      if (!F(C))
        return C;
      return new e._Code(C._items.reduce((V, Q) => (Q instanceof e.Name && (Q = j(Q)), Q instanceof e._Code ? V.push(...Q._items) : V.push(Q), V), []));
      function j(V) {
        const Q = E[V.str];
        return Q === void 0 || v[V.str] !== 1 ? V : (delete v[V.str], Q);
      }
      function F(V) {
        return V instanceof e._Code && V._items.some((Q) => Q instanceof e.Name && v[Q.str] === 1 && E[Q.str] !== void 0);
      }
    }
    function se(C, v) {
      for (const E in v)
        C[E] = (C[E] || 0) - (v[E] || 0);
    }
    function ye(C) {
      return typeof C == "boolean" || typeof C == "number" || C === null ? !C : (0, e._)`!${O(C)}`;
    }
    s.not = ye;
    const ge = A(s.operators.AND);
    function re(...C) {
      return C.reduce(ge);
    }
    s.and = re;
    const ve = A(s.operators.OR);
    function k(...C) {
      return C.reduce(ve);
    }
    s.or = k;
    function A(C) {
      return (v, E) => v === e.nil ? E : E === e.nil ? v : (0, e._)`${O(v)} ${C} ${O(E)}`;
    }
    function O(C) {
      return C instanceof e.Name ? C : (0, e._)`(${C})`;
    }
  })(Bt)), Bt;
}
var H = {}, $r;
function te() {
  if ($r) return H;
  $r = 1, Object.defineProperty(H, "__esModule", { value: !0 }), H.checkStrictMode = H.getErrorPath = H.Type = H.useFunc = H.setEvaluated = H.evaluatedPropsToName = H.mergeEvaluated = H.eachItem = H.unescapeJsonPointer = H.escapeJsonPointer = H.escapeFragment = H.unescapeFragment = H.schemaRefOrVal = H.schemaHasRulesButRef = H.schemaHasRules = H.checkUnknownRules = H.alwaysValidSchema = H.toHash = void 0;
  const s = W(), e = It();
  function t($) {
    const b = {};
    for (const P of $)
      b[P] = !0;
    return b;
  }
  H.toHash = t;
  function r($, b) {
    return typeof b == "boolean" ? b : Object.keys(b).length === 0 ? !0 : (n($, b), !i(b, $.self.RULES.all));
  }
  H.alwaysValidSchema = r;
  function n($, b = $.schema) {
    const { opts: P, self: T } = $;
    if (!P.strictSchema || typeof b == "boolean")
      return;
    const q = T.RULES.keywords;
    for (const D in b)
      q[D] || y($, `unknown keyword: "${D}"`);
  }
  H.checkUnknownRules = n;
  function i($, b) {
    if (typeof $ == "boolean")
      return !$;
    for (const P in $)
      if (b[P])
        return !0;
    return !1;
  }
  H.schemaHasRules = i;
  function o($, b) {
    if (typeof $ == "boolean")
      return !$;
    for (const P in $)
      if (P !== "$ref" && b.all[P])
        return !0;
    return !1;
  }
  H.schemaHasRulesButRef = o;
  function a({ topSchemaRef: $, schemaPath: b }, P, T, q) {
    if (!q) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, s._)`${P}`;
    }
    return (0, s._)`${$}${b}${(0, s.getProperty)(T)}`;
  }
  H.schemaRefOrVal = a;
  function c($) {
    return g(decodeURIComponent($));
  }
  H.unescapeFragment = c;
  function u($) {
    return encodeURIComponent(d($));
  }
  H.escapeFragment = u;
  function d($) {
    return typeof $ == "number" ? `${$}` : $.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  H.escapeJsonPointer = d;
  function g($) {
    return $.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  H.unescapeJsonPointer = g;
  function _($, b) {
    if (Array.isArray($))
      for (const P of $)
        b(P);
    else
      b($);
  }
  H.eachItem = _;
  function w({ mergeNames: $, mergeToName: b, mergeValues: P, resultToName: T }) {
    return (q, D, z, U) => {
      const B = z === void 0 ? D : z instanceof s.Name ? (D instanceof s.Name ? $(q, D, z) : b(q, D, z), z) : D instanceof s.Name ? (b(q, z, D), D) : P(D, z);
      return U === s.Name && !(B instanceof s.Name) ? T(q, B) : B;
    };
  }
  H.mergeEvaluated = {
    props: w({
      mergeNames: ($, b, P) => $.if((0, s._)`${P} !== true && ${b} !== undefined`, () => {
        $.if((0, s._)`${b} === true`, () => $.assign(P, !0), () => $.assign(P, (0, s._)`${P} || {}`).code((0, s._)`Object.assign(${P}, ${b})`));
      }),
      mergeToName: ($, b, P) => $.if((0, s._)`${P} !== true`, () => {
        b === !0 ? $.assign(P, !0) : ($.assign(P, (0, s._)`${P} || {}`), m($, P, b));
      }),
      mergeValues: ($, b) => $ === !0 ? !0 : { ...$, ...b },
      resultToName: S
    }),
    items: w({
      mergeNames: ($, b, P) => $.if((0, s._)`${P} !== true && ${b} !== undefined`, () => $.assign(P, (0, s._)`${b} === true ? true : ${P} > ${b} ? ${P} : ${b}`)),
      mergeToName: ($, b, P) => $.if((0, s._)`${P} !== true`, () => $.assign(P, b === !0 ? !0 : (0, s._)`${P} > ${b} ? ${P} : ${b}`)),
      mergeValues: ($, b) => $ === !0 ? !0 : Math.max($, b),
      resultToName: ($, b) => $.var("items", b)
    })
  };
  function S($, b) {
    if (b === !0)
      return $.var("props", !0);
    const P = $.var("props", (0, s._)`{}`);
    return b !== void 0 && m($, P, b), P;
  }
  H.evaluatedPropsToName = S;
  function m($, b, P) {
    Object.keys(P).forEach((T) => $.assign((0, s._)`${b}${(0, s.getProperty)(T)}`, !0));
  }
  H.setEvaluated = m;
  const h = {};
  function p($, b) {
    return $.scopeValue("func", {
      ref: b,
      code: h[b.code] || (h[b.code] = new e._Code(b.code))
    });
  }
  H.useFunc = p;
  var l;
  (function($) {
    $[$.Num = 0] = "Num", $[$.Str = 1] = "Str";
  })(l || (H.Type = l = {}));
  function f($, b, P) {
    if ($ instanceof s.Name) {
      const T = b === l.Num;
      return P ? T ? (0, s._)`"[" + ${$} + "]"` : (0, s._)`"['" + ${$} + "']"` : T ? (0, s._)`"/" + ${$}` : (0, s._)`"/" + ${$}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, s.getProperty)($).toString() : "/" + d($);
  }
  H.getErrorPath = f;
  function y($, b, P = $.opts.strictSchema) {
    if (P) {
      if (b = `strict mode: ${b}`, P === !0)
        throw new Error(b);
      $.self.logger.warn(b);
    }
  }
  return H.checkStrictMode = y, H;
}
var We = {}, _r;
function Ne() {
  if (_r) return We;
  _r = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const s = W(), e = {
    // validation function arguments
    data: new s.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new s.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new s.Name("instancePath"),
    parentData: new s.Name("parentData"),
    parentDataProperty: new s.Name("parentDataProperty"),
    rootData: new s.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new s.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new s.Name("vErrors"),
    // null or array of validation errors
    errors: new s.Name("errors"),
    // counter of validation errors
    this: new s.Name("this"),
    // "globals"
    self: new s.Name("self"),
    scope: new s.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new s.Name("json"),
    jsonPos: new s.Name("jsonPos"),
    jsonLen: new s.Name("jsonLen"),
    jsonPart: new s.Name("jsonPart")
  };
  return We.default = e, We;
}
var Sr;
function xt() {
  return Sr || (Sr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.extendErrors = s.resetErrorsCount = s.reportExtraError = s.reportError = s.keyword$DataError = s.keywordError = void 0;
    const e = W(), t = te(), r = Ne();
    s.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, s.keyword$DataError = {
      message: ({ keyword: h, schemaType: p }) => p ? (0, e.str)`"${h}" keyword must be ${p} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, p = s.keywordError, l, f) {
      const { it: y } = h, { gen: $, compositeRule: b, allErrors: P } = y, T = g(h, p, l);
      f ?? (b || P) ? c($, T) : u(y, (0, e._)`[${T}]`);
    }
    s.reportError = n;
    function i(h, p = s.keywordError, l) {
      const { it: f } = h, { gen: y, compositeRule: $, allErrors: b } = f, P = g(h, p, l);
      c(y, P), $ || b || u(f, r.default.vErrors);
    }
    s.reportExtraError = i;
    function o(h, p) {
      h.assign(r.default.errors, p), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(p, () => h.assign((0, e._)`${r.default.vErrors}.length`, p), () => h.assign(r.default.vErrors, null)));
    }
    s.resetErrorsCount = o;
    function a({ gen: h, keyword: p, schemaValue: l, data: f, errsCount: y, it: $ }) {
      if (y === void 0)
        throw new Error("ajv implementation error");
      const b = h.name("err");
      h.forRange("i", y, r.default.errors, (P) => {
        h.const(b, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${b}.instancePath === undefined`, () => h.assign((0, e._)`${b}.instancePath`, (0, e.strConcat)(r.default.instancePath, $.errorPath))), h.assign((0, e._)`${b}.schemaPath`, (0, e.str)`${$.errSchemaPath}/${p}`), $.opts.verbose && (h.assign((0, e._)`${b}.schema`, l), h.assign((0, e._)`${b}.data`, f));
      });
    }
    s.extendErrors = a;
    function c(h, p) {
      const l = h.const("err", p);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${l}]`), (0, e._)`${r.default.vErrors}.push(${l})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function u(h, p) {
      const { gen: l, validateName: f, schemaEnv: y } = h;
      y.$async ? l.throw((0, e._)`new ${h.ValidationError}(${p})`) : (l.assign((0, e._)`${f}.errors`, p), l.return(!1));
    }
    const d = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function g(h, p, l) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, p, l);
    }
    function _(h, p, l = {}) {
      const { gen: f, it: y } = h, $ = [
        w(y, l),
        S(h, l)
      ];
      return m(h, p, $), f.object(...$);
    }
    function w({ errorPath: h }, { instancePath: p }) {
      const l = p ? (0, e.str)`${h}${(0, t.getErrorPath)(p, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, l)];
    }
    function S({ keyword: h, it: { errSchemaPath: p } }, { schemaPath: l, parentSchema: f }) {
      let y = f ? p : (0, e.str)`${p}/${h}`;
      return l && (y = (0, e.str)`${y}${(0, t.getErrorPath)(l, t.Type.Str)}`), [d.schemaPath, y];
    }
    function m(h, { params: p, message: l }, f) {
      const { keyword: y, data: $, schemaValue: b, it: P } = h, { opts: T, propertyName: q, topSchemaRef: D, schemaPath: z } = P;
      f.push([d.keyword, y], [d.params, typeof p == "function" ? p(h) : p || (0, e._)`{}`]), T.messages && f.push([d.message, typeof l == "function" ? l(h) : l]), T.verbose && f.push([d.schema, b], [d.parentSchema, (0, e._)`${D}${z}`], [r.default.data, $]), q && f.push([d.propertyName, q]);
    }
  })(Ut)), Ut;
}
var Pr;
function hi() {
  if (Pr) return Ce;
  Pr = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.boolOrEmptySchema = Ce.topBoolOrEmptySchema = void 0;
  const s = xt(), e = W(), t = Ne(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: c, schema: u, validateName: d } = a;
    u === !1 ? o(a, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${d}.errors`, null), c.return(!0));
  }
  Ce.topBoolOrEmptySchema = n;
  function i(a, c) {
    const { gen: u, schema: d } = a;
    d === !1 ? (u.var(c, !1), o(a)) : u.var(c, !0);
  }
  Ce.boolOrEmptySchema = i;
  function o(a, c) {
    const { gen: u, data: d } = a, g = {
      gen: u,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, s.reportError)(g, r, void 0, c);
  }
  return Ce;
}
var de = {}, je = {}, Er;
function In() {
  if (Er) return je;
  Er = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.getRules = je.isJSONType = void 0;
  const s = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(s);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  je.isJSONType = t;
  function r() {
    const n = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...n, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, n.number, n.string, n.array, n.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return je.getRules = r, je;
}
var Te = {}, Mr;
function qn() {
  if (Mr) return Te;
  Mr = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.shouldUseRule = Te.shouldUseGroup = Te.schemaHasRulesForType = void 0;
  function s({ schema: r, self: n }, i) {
    const o = n.RULES.types[i];
    return o && o !== !0 && e(r, o);
  }
  Te.schemaHasRulesForType = s;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  Te.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((o) => r[o] !== void 0));
  }
  return Te.shouldUseRule = t, Te;
}
var Tr;
function qt() {
  if (Tr) return de;
  Tr = 1, Object.defineProperty(de, "__esModule", { value: !0 }), de.reportTypeError = de.checkDataTypes = de.checkDataType = de.coerceAndCheckDataType = de.getJSONTypes = de.getSchemaTypes = de.DataType = void 0;
  const s = In(), e = qn(), t = xt(), r = W(), n = te();
  var i;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(i || (de.DataType = i = {}));
  function o(l) {
    const f = a(l.type);
    if (f.includes("null")) {
      if (l.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!f.length && l.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      l.nullable === !0 && f.push("null");
    }
    return f;
  }
  de.getSchemaTypes = o;
  function a(l) {
    const f = Array.isArray(l) ? l : l ? [l] : [];
    if (f.every(s.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  de.getJSONTypes = a;
  function c(l, f) {
    const { gen: y, data: $, opts: b } = l, P = d(f, b.coerceTypes), T = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(l, f[0]));
    if (T) {
      const q = S(f, $, b.strictNumbers, i.Wrong);
      y.if(q, () => {
        P.length ? g(l, f, P) : h(l);
      });
    }
    return T;
  }
  de.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(l, f) {
    return f ? l.filter((y) => u.has(y) || f === "array" && y === "array") : [];
  }
  function g(l, f, y) {
    const { gen: $, data: b, opts: P } = l, T = $.let("dataType", (0, r._)`typeof ${b}`), q = $.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && $.if((0, r._)`${T} == 'object' && Array.isArray(${b}) && ${b}.length == 1`, () => $.assign(b, (0, r._)`${b}[0]`).assign(T, (0, r._)`typeof ${b}`).if(S(f, b, P.strictNumbers), () => $.assign(q, b))), $.if((0, r._)`${q} !== undefined`);
    for (const z of y)
      (u.has(z) || z === "array" && P.coerceTypes === "array") && D(z);
    $.else(), h(l), $.endIf(), $.if((0, r._)`${q} !== undefined`, () => {
      $.assign(b, q), _(l, q);
    });
    function D(z) {
      switch (z) {
        case "string":
          $.elseIf((0, r._)`${T} == "number" || ${T} == "boolean"`).assign(q, (0, r._)`"" + ${b}`).elseIf((0, r._)`${b} === null`).assign(q, (0, r._)`""`);
          return;
        case "number":
          $.elseIf((0, r._)`${T} == "boolean" || ${b} === null
              || (${T} == "string" && ${b} && ${b} == +${b})`).assign(q, (0, r._)`+${b}`);
          return;
        case "integer":
          $.elseIf((0, r._)`${T} === "boolean" || ${b} === null
              || (${T} === "string" && ${b} && ${b} == +${b} && !(${b} % 1))`).assign(q, (0, r._)`+${b}`);
          return;
        case "boolean":
          $.elseIf((0, r._)`${b} === "false" || ${b} === 0 || ${b} === null`).assign(q, !1).elseIf((0, r._)`${b} === "true" || ${b} === 1`).assign(q, !0);
          return;
        case "null":
          $.elseIf((0, r._)`${b} === "" || ${b} === 0 || ${b} === false`), $.assign(q, null);
          return;
        case "array":
          $.elseIf((0, r._)`${T} === "string" || ${T} === "number"
              || ${T} === "boolean" || ${b} === null`).assign(q, (0, r._)`[${b}]`);
      }
    }
  }
  function _({ gen: l, parentData: f, parentDataProperty: y }, $) {
    l.if((0, r._)`${f} !== undefined`, () => l.assign((0, r._)`${f}[${y}]`, $));
  }
  function w(l, f, y, $ = i.Correct) {
    const b = $ === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let P;
    switch (l) {
      case "null":
        return (0, r._)`${f} ${b} null`;
      case "array":
        P = (0, r._)`Array.isArray(${f})`;
        break;
      case "object":
        P = (0, r._)`${f} && typeof ${f} == "object" && !Array.isArray(${f})`;
        break;
      case "integer":
        P = T((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        P = T();
        break;
      default:
        return (0, r._)`typeof ${f} ${b} ${l}`;
    }
    return $ === i.Correct ? P : (0, r.not)(P);
    function T(q = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, q, y ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  de.checkDataType = w;
  function S(l, f, y, $) {
    if (l.length === 1)
      return w(l[0], f, y, $);
    let b;
    const P = (0, n.toHash)(l);
    if (P.array && P.object) {
      const T = (0, r._)`typeof ${f} != "object"`;
      b = P.null ? T : (0, r._)`!${f} || ${T}`, delete P.null, delete P.array, delete P.object;
    } else
      b = r.nil;
    P.number && delete P.integer;
    for (const T in P)
      b = (0, r.and)(b, w(T, f, y, $));
    return b;
  }
  de.checkDataTypes = S;
  const m = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: f }) => typeof l == "string" ? (0, r._)`{type: ${l}}` : (0, r._)`{type: ${f}}`
  };
  function h(l) {
    const f = p(l);
    (0, t.reportError)(f, m);
  }
  de.reportTypeError = h;
  function p(l) {
    const { gen: f, data: y, schema: $ } = l, b = (0, n.schemaRefOrVal)(l, $, "type");
    return {
      gen: f,
      keyword: "type",
      data: y,
      schema: $.type,
      schemaCode: b,
      schemaValue: b,
      parentSchema: $,
      params: {},
      it: l
    };
  }
  return de;
}
var Ve = {}, kr;
function fi() {
  if (kr) return Ve;
  kr = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.assignDefaults = void 0;
  const s = W(), e = te();
  function t(n, i) {
    const { properties: o, items: a } = n.schema;
    if (i === "object" && o)
      for (const c in o)
        r(n, c, o[c].default);
    else i === "array" && Array.isArray(a) && a.forEach((c, u) => r(n, u, c.default));
  }
  Ve.assignDefaults = t;
  function r(n, i, o) {
    const { gen: a, compositeRule: c, data: u, opts: d } = n;
    if (o === void 0)
      return;
    const g = (0, s._)`${u}${(0, s.getProperty)(i)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${g}`);
      return;
    }
    let _ = (0, s._)`${g} === undefined`;
    d.useDefaults === "empty" && (_ = (0, s._)`${_} || ${g} === null || ${g} === ""`), a.if(_, (0, s._)`${g} = ${(0, s.stringify)(o)}`);
  }
  return Ve;
}
var we = {}, ie = {}, Ar;
function $e() {
  if (Ar) return ie;
  Ar = 1, Object.defineProperty(ie, "__esModule", { value: !0 }), ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
  const s = W(), e = te(), t = Ne(), r = te();
  function n(l, f) {
    const { gen: y, data: $, it: b } = l;
    y.if(d(y, $, f, b.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, s._)`${f}` }, !0), l.error();
    });
  }
  ie.checkReportMissingProp = n;
  function i({ gen: l, data: f, it: { opts: y } }, $, b) {
    return (0, s.or)(...$.map((P) => (0, s.and)(d(l, f, P, y.ownProperties), (0, s._)`${b} = ${P}`)));
  }
  ie.checkMissingProp = i;
  function o(l, f) {
    l.setParams({ missingProperty: f }, !0), l.error();
  }
  ie.reportMissingProp = o;
  function a(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, s._)`Object.prototype.hasOwnProperty`
    });
  }
  ie.hasPropFunc = a;
  function c(l, f, y) {
    return (0, s._)`${a(l)}.call(${f}, ${y})`;
  }
  ie.isOwnProperty = c;
  function u(l, f, y, $) {
    const b = (0, s._)`${f}${(0, s.getProperty)(y)} !== undefined`;
    return $ ? (0, s._)`${b} && ${c(l, f, y)}` : b;
  }
  ie.propertyInData = u;
  function d(l, f, y, $) {
    const b = (0, s._)`${f}${(0, s.getProperty)(y)} === undefined`;
    return $ ? (0, s.or)(b, (0, s.not)(c(l, f, y))) : b;
  }
  ie.noPropertyInData = d;
  function g(l) {
    return l ? Object.keys(l).filter((f) => f !== "__proto__") : [];
  }
  ie.allSchemaProperties = g;
  function _(l, f) {
    return g(f).filter((y) => !(0, e.alwaysValidSchema)(l, f[y]));
  }
  ie.schemaProperties = _;
  function w({ schemaCode: l, data: f, it: { gen: y, topSchemaRef: $, schemaPath: b, errorPath: P }, it: T }, q, D, z) {
    const U = z ? (0, s._)`${l}, ${f}, ${$}${b}` : f, B = [
      [t.default.instancePath, (0, s.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, T.parentData],
      [t.default.parentDataProperty, T.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    T.opts.dynamicRef && B.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const K = (0, s._)`${U}, ${y.object(...B)}`;
    return D !== s.nil ? (0, s._)`${q}.call(${D}, ${K})` : (0, s._)`${q}(${K})`;
  }
  ie.callValidateCode = w;
  const S = (0, s._)`new RegExp`;
  function m({ gen: l, it: { opts: f } }, y) {
    const $ = f.unicodeRegExp ? "u" : "", { regExp: b } = f.code, P = b(y, $);
    return l.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, s._)`${b.code === "new RegExp" ? S : (0, r.useFunc)(l, b)}(${y}, ${$})`
    });
  }
  ie.usePattern = m;
  function h(l) {
    const { gen: f, data: y, keyword: $, it: b } = l, P = f.name("valid");
    if (b.allErrors) {
      const q = f.let("valid", !0);
      return T(() => f.assign(q, !1)), q;
    }
    return f.var(P, !0), T(() => f.break()), P;
    function T(q) {
      const D = f.const("len", (0, s._)`${y}.length`);
      f.forRange("i", 0, D, (z) => {
        l.subschema({
          keyword: $,
          dataProp: z,
          dataPropType: e.Type.Num
        }, P), f.if((0, s.not)(P), q);
      });
    }
  }
  ie.validateArray = h;
  function p(l) {
    const { gen: f, schema: y, keyword: $, it: b } = l;
    if (!Array.isArray(y))
      throw new Error("ajv implementation error");
    if (y.some((D) => (0, e.alwaysValidSchema)(b, D)) && !b.opts.unevaluated)
      return;
    const T = f.let("valid", !1), q = f.name("_valid");
    f.block(() => y.forEach((D, z) => {
      const U = l.subschema({
        keyword: $,
        schemaProp: z,
        compositeRule: !0
      }, q);
      f.assign(T, (0, s._)`${T} || ${q}`), l.mergeValidEvaluated(U, q) || f.if((0, s.not)(T));
    })), l.result(T, () => l.reset(), () => l.error(!0));
  }
  return ie.validateUnion = p, ie;
}
var Nr;
function pi() {
  if (Nr) return we;
  Nr = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.validateKeywordUsage = we.validSchemaType = we.funcKeywordCode = we.macroKeywordCode = void 0;
  const s = W(), e = Ne(), t = $e(), r = xt();
  function n(_, w) {
    const { gen: S, keyword: m, schema: h, parentSchema: p, it: l } = _, f = w.macro.call(l.self, h, p, l), y = u(S, m, f);
    l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
    const $ = S.name("valid");
    _.subschema({
      schema: f,
      schemaPath: s.nil,
      errSchemaPath: `${l.errSchemaPath}/${m}`,
      topSchemaRef: y,
      compositeRule: !0
    }, $), _.pass($, () => _.error(!0));
  }
  we.macroKeywordCode = n;
  function i(_, w) {
    var S;
    const { gen: m, keyword: h, schema: p, parentSchema: l, $data: f, it: y } = _;
    c(y, w);
    const $ = !f && w.compile ? w.compile.call(y.self, p, l, y) : w.validate, b = u(m, h, $), P = m.let("valid");
    _.block$data(P, T), _.ok((S = w.valid) !== null && S !== void 0 ? S : P);
    function T() {
      if (w.errors === !1)
        z(), w.modifying && o(_), U(() => _.error());
      else {
        const B = w.async ? q() : D();
        w.modifying && o(_), U(() => a(_, B));
      }
    }
    function q() {
      const B = m.let("ruleErrs", null);
      return m.try(() => z((0, s._)`await `), (K) => m.assign(P, !1).if((0, s._)`${K} instanceof ${y.ValidationError}`, () => m.assign(B, (0, s._)`${K}.errors`), () => m.throw(K))), B;
    }
    function D() {
      const B = (0, s._)`${b}.errors`;
      return m.assign(B, null), z(s.nil), B;
    }
    function z(B = w.async ? (0, s._)`await ` : s.nil) {
      const K = y.opts.passContext ? e.default.this : e.default.self, se = !("compile" in w && !f || w.schema === !1);
      m.assign(P, (0, s._)`${B}${(0, t.callValidateCode)(_, b, K, se)}`, w.modifying);
    }
    function U(B) {
      var K;
      m.if((0, s.not)((K = w.valid) !== null && K !== void 0 ? K : P), B);
    }
  }
  we.funcKeywordCode = i;
  function o(_) {
    const { gen: w, data: S, it: m } = _;
    w.if(m.parentData, () => w.assign(S, (0, s._)`${m.parentData}[${m.parentDataProperty}]`));
  }
  function a(_, w) {
    const { gen: S } = _;
    S.if((0, s._)`Array.isArray(${w})`, () => {
      S.assign(e.default.vErrors, (0, s._)`${e.default.vErrors} === null ? ${w} : ${e.default.vErrors}.concat(${w})`).assign(e.default.errors, (0, s._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function c({ schemaEnv: _ }, w) {
    if (w.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, w, S) {
    if (S === void 0)
      throw new Error(`keyword "${w}" failed to compile`);
    return _.scopeValue("keyword", typeof S == "function" ? { ref: S } : { ref: S, code: (0, s.stringify)(S) });
  }
  function d(_, w, S = !1) {
    return !w.length || w.some((m) => m === "array" ? Array.isArray(_) : m === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == m || S && typeof _ > "u");
  }
  we.validSchemaType = d;
  function g({ schema: _, opts: w, self: S, errSchemaPath: m }, h, p) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(p) : h.keyword !== p)
      throw new Error("ajv implementation error");
    const l = h.dependencies;
    if (l?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${p}: ${l.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[p])) {
      const y = `keyword "${p}" value is invalid at path "${m}": ` + S.errorsText(h.validateSchema.errors);
      if (w.validateSchema === "log")
        S.logger.error(y);
      else
        throw new Error(y);
    }
  }
  return we.validateKeywordUsage = g, we;
}
var ke = {}, Rr;
function mi() {
  if (Rr) return ke;
  Rr = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.extendSubschemaMode = ke.extendSubschemaData = ke.getSubschema = void 0;
  const s = W(), e = te();
  function t(i, { keyword: o, schemaProp: a, schema: c, schemaPath: u, errSchemaPath: d, topSchemaRef: g }) {
    if (o !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const _ = i.schema[o];
      return a === void 0 ? {
        schema: _,
        schemaPath: (0, s._)`${i.schemaPath}${(0, s.getProperty)(o)}`,
        errSchemaPath: `${i.errSchemaPath}/${o}`
      } : {
        schema: _[a],
        schemaPath: (0, s._)`${i.schemaPath}${(0, s.getProperty)(o)}${(0, s.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${o}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (u === void 0 || d === void 0 || g === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: g,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  ke.getSubschema = t;
  function r(i, o, { dataProp: a, dataPropType: c, data: u, dataTypes: d, propertyName: g }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = o;
    if (a !== void 0) {
      const { errorPath: S, dataPathArr: m, opts: h } = o, p = _.let("data", (0, s._)`${o.data}${(0, s.getProperty)(a)}`, !0);
      w(p), i.errorPath = (0, s.str)`${S}${(0, e.getErrorPath)(a, c, h.jsPropertySyntax)}`, i.parentDataProperty = (0, s._)`${a}`, i.dataPathArr = [...m, i.parentDataProperty];
    }
    if (u !== void 0) {
      const S = u instanceof s.Name ? u : _.let("data", u, !0);
      w(S), g !== void 0 && (i.propertyName = g);
    }
    d && (i.dataTypes = d);
    function w(S) {
      i.data = S, i.dataLevel = o.dataLevel + 1, i.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), i.parentData = o.data, i.dataNames = [...o.dataNames, S];
    }
  }
  ke.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), u !== void 0 && (i.createErrors = u), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = o, i.jtdMetadata = a;
  }
  return ke.extendSubschemaMode = n, ke;
}
var fe = {}, Jt, Cr;
function On() {
  return Cr || (Cr = 1, Jt = function s(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var r, n, i;
      if (Array.isArray(e)) {
        if (r = e.length, r != t.length) return !1;
        for (n = r; n-- !== 0; )
          if (!s(e[n], t[n])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (i = Object.keys(e), r = i.length, r !== Object.keys(t).length) return !1;
      for (n = r; n-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, i[n])) return !1;
      for (n = r; n-- !== 0; ) {
        var o = i[n];
        if (!s(e[o], t[o])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), Jt;
}
var Ht = { exports: {} }, jr;
function yi() {
  if (jr) return Ht.exports;
  jr = 1;
  var s = Ht.exports = function(r, n, i) {
    typeof n == "function" && (i = n, n = {}), i = n.cb || i;
    var o = typeof i == "function" ? i : i.pre || function() {
    }, a = i.post || function() {
    };
    e(n, o, a, r, "", r);
  };
  s.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, s.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, s.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, s.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(r, n, i, o, a, c, u, d, g, _) {
    if (o && typeof o == "object" && !Array.isArray(o)) {
      n(o, a, c, u, d, g, _);
      for (var w in o) {
        var S = o[w];
        if (Array.isArray(S)) {
          if (w in s.arrayKeywords)
            for (var m = 0; m < S.length; m++)
              e(r, n, i, S[m], a + "/" + w + "/" + m, c, a, w, o, m);
        } else if (w in s.propsKeywords) {
          if (S && typeof S == "object")
            for (var h in S)
              e(r, n, i, S[h], a + "/" + w + "/" + t(h), c, a, w, o, h);
        } else (w in s.keywords || r.allKeys && !(w in s.skipKeywords)) && e(r, n, i, S, a + "/" + w, c, a, w, o);
      }
      i(o, a, c, u, d, g, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ht.exports;
}
var Ir;
function Dt() {
  if (Ir) return fe;
  Ir = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.getSchemaRefs = fe.resolveUrl = fe.normalizeId = fe._getFullPath = fe.getFullPath = fe.inlineRef = void 0;
  const s = te(), e = On(), t = yi(), r = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function n(m, h = !0) {
    return typeof m == "boolean" ? !0 : h === !0 ? !o(m) : h ? a(m) <= h : !1;
  }
  fe.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(m) {
    for (const h in m) {
      if (i.has(h))
        return !0;
      const p = m[h];
      if (Array.isArray(p) && p.some(o) || typeof p == "object" && o(p))
        return !0;
    }
    return !1;
  }
  function a(m) {
    let h = 0;
    for (const p in m) {
      if (p === "$ref")
        return 1 / 0;
      if (h++, !r.has(p) && (typeof m[p] == "object" && (0, s.eachItem)(m[p], (l) => h += a(l)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function c(m, h = "", p) {
    p !== !1 && (h = g(h));
    const l = m.parse(h);
    return u(m, l);
  }
  fe.getFullPath = c;
  function u(m, h) {
    return m.serialize(h).split("#")[0] + "#";
  }
  fe._getFullPath = u;
  const d = /#\/?$/;
  function g(m) {
    return m ? m.replace(d, "") : "";
  }
  fe.normalizeId = g;
  function _(m, h, p) {
    return p = g(p), m.resolve(h, p);
  }
  fe.resolveUrl = _;
  const w = /^[a-z_][-a-z0-9._]*$/i;
  function S(m, h) {
    if (typeof m == "boolean")
      return {};
    const { schemaId: p, uriResolver: l } = this.opts, f = g(m[p] || h), y = { "": f }, $ = c(l, f, !1), b = {}, P = /* @__PURE__ */ new Set();
    return t(m, { allKeys: !0 }, (D, z, U, B) => {
      if (B === void 0)
        return;
      const K = $ + z;
      let se = y[B];
      typeof D[p] == "string" && (se = ye.call(this, D[p])), ge.call(this, D.$anchor), ge.call(this, D.$dynamicAnchor), y[z] = se;
      function ye(re) {
        const ve = this.opts.uriResolver.resolve;
        if (re = g(se ? ve(se, re) : re), P.has(re))
          throw q(re);
        P.add(re);
        let k = this.refs[re];
        return typeof k == "string" && (k = this.refs[k]), typeof k == "object" ? T(D, k.schema, re) : re !== g(K) && (re[0] === "#" ? (T(D, b[re], re), b[re] = D) : this.refs[re] = K), re;
      }
      function ge(re) {
        if (typeof re == "string") {
          if (!w.test(re))
            throw new Error(`invalid anchor "${re}"`);
          ye.call(this, `#${re}`);
        }
      }
    }), b;
    function T(D, z, U) {
      if (z !== void 0 && !e(D, z))
        throw q(U);
    }
    function q(D) {
      return new Error(`reference "${D}" resolves to more than one schema`);
    }
  }
  return fe.getSchemaRefs = S, fe;
}
var qr;
function zt() {
  if (qr) return Me;
  qr = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.getData = Me.KeywordCxt = Me.validateFunctionCode = void 0;
  const s = hi(), e = qt(), t = qn(), r = qt(), n = fi(), i = pi(), o = mi(), a = W(), c = Ne(), u = Dt(), d = te(), g = xt();
  function _(M) {
    if ($(M) && (P(M), y(M))) {
      h(M);
      return;
    }
    w(M, () => (0, s.topBoolOrEmptySchema)(M));
  }
  Me.validateFunctionCode = _;
  function w({ gen: M, validateName: R, schema: N, schemaEnv: I, opts: x }, L) {
    x.code.es5 ? M.func(R, (0, a._)`${c.default.data}, ${c.default.valCxt}`, I.$async, () => {
      M.code((0, a._)`"use strict"; ${l(N, x)}`), m(M, x), M.code(L);
    }) : M.func(R, (0, a._)`${c.default.data}, ${S(x)}`, I.$async, () => M.code(l(N, x)).code(L));
  }
  function S(M) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${M.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function m(M, R) {
    M.if(c.default.valCxt, () => {
      M.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), M.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), M.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), M.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), R.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      M.var(c.default.instancePath, (0, a._)`""`), M.var(c.default.parentData, (0, a._)`undefined`), M.var(c.default.parentDataProperty, (0, a._)`undefined`), M.var(c.default.rootData, c.default.data), R.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(M) {
    const { schema: R, opts: N, gen: I } = M;
    w(M, () => {
      N.$comment && R.$comment && B(M), D(M), I.let(c.default.vErrors, null), I.let(c.default.errors, 0), N.unevaluated && p(M), T(M), K(M);
    });
  }
  function p(M) {
    const { gen: R, validateName: N } = M;
    M.evaluated = R.const("evaluated", (0, a._)`${N}.evaluated`), R.if((0, a._)`${M.evaluated}.dynamicProps`, () => R.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), R.if((0, a._)`${M.evaluated}.dynamicItems`, () => R.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function l(M, R) {
    const N = typeof M == "object" && M[R.schemaId];
    return N && (R.code.source || R.code.process) ? (0, a._)`/*# sourceURL=${N} */` : a.nil;
  }
  function f(M, R) {
    if ($(M) && (P(M), y(M))) {
      b(M, R);
      return;
    }
    (0, s.boolOrEmptySchema)(M, R);
  }
  function y({ schema: M, self: R }) {
    if (typeof M == "boolean")
      return !M;
    for (const N in M)
      if (R.RULES.all[N])
        return !0;
    return !1;
  }
  function $(M) {
    return typeof M.schema != "boolean";
  }
  function b(M, R) {
    const { schema: N, gen: I, opts: x } = M;
    x.$comment && N.$comment && B(M), z(M), U(M);
    const L = I.const("_errs", c.default.errors);
    T(M, L), I.var(R, (0, a._)`${L} === ${c.default.errors}`);
  }
  function P(M) {
    (0, d.checkUnknownRules)(M), q(M);
  }
  function T(M, R) {
    if (M.opts.jtd)
      return ye(M, [], !1, R);
    const N = (0, e.getSchemaTypes)(M.schema), I = (0, e.coerceAndCheckDataType)(M, N);
    ye(M, N, !I, R);
  }
  function q(M) {
    const { schema: R, errSchemaPath: N, opts: I, self: x } = M;
    R.$ref && I.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(R, x.RULES) && x.logger.warn(`$ref: keywords ignored in schema at path "${N}"`);
  }
  function D(M) {
    const { schema: R, opts: N } = M;
    R.default !== void 0 && N.useDefaults && N.strictSchema && (0, d.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function z(M) {
    const R = M.schema[M.opts.schemaId];
    R && (M.baseId = (0, u.resolveUrl)(M.opts.uriResolver, M.baseId, R));
  }
  function U(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function B({ gen: M, schemaEnv: R, schema: N, errSchemaPath: I, opts: x }) {
    const L = N.$comment;
    if (x.$comment === !0)
      M.code((0, a._)`${c.default.self}.logger.log(${L})`);
    else if (typeof x.$comment == "function") {
      const Y = (0, a.str)`${I}/$comment`, Z = M.scopeValue("root", { ref: R.root });
      M.code((0, a._)`${c.default.self}.opts.$comment(${L}, ${Y}, ${Z}.schema)`);
    }
  }
  function K(M) {
    const { gen: R, schemaEnv: N, validateName: I, ValidationError: x, opts: L } = M;
    N.$async ? R.if((0, a._)`${c.default.errors} === 0`, () => R.return(c.default.data), () => R.throw((0, a._)`new ${x}(${c.default.vErrors})`)) : (R.assign((0, a._)`${I}.errors`, c.default.vErrors), L.unevaluated && se(M), R.return((0, a._)`${c.default.errors} === 0`));
  }
  function se({ gen: M, evaluated: R, props: N, items: I }) {
    N instanceof a.Name && M.assign((0, a._)`${R}.props`, N), I instanceof a.Name && M.assign((0, a._)`${R}.items`, I);
  }
  function ye(M, R, N, I) {
    const { gen: x, schema: L, data: Y, allErrors: Z, opts: X, self: ne } = M, { RULES: ee } = ne;
    if (L.$ref && (X.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(L, ee))) {
      x.block(() => F(M, "$ref", ee.all.$ref.definition));
      return;
    }
    X.jtd || re(M, R), x.block(() => {
      for (const le of ee.rules)
        pe(le);
      pe(ee.post);
    });
    function pe(le) {
      (0, t.shouldUseGroup)(L, le) && (le.type ? (x.if((0, r.checkDataType)(le.type, Y, X.strictNumbers)), ge(M, le), R.length === 1 && R[0] === le.type && N && (x.else(), (0, r.reportTypeError)(M)), x.endIf()) : ge(M, le), Z || x.if((0, a._)`${c.default.errors} === ${I || 0}`));
    }
  }
  function ge(M, R) {
    const { gen: N, schema: I, opts: { useDefaults: x } } = M;
    x && (0, n.assignDefaults)(M, R.type), N.block(() => {
      for (const L of R.rules)
        (0, t.shouldUseRule)(I, L) && F(M, L.keyword, L.definition, R.type);
    });
  }
  function re(M, R) {
    M.schemaEnv.meta || !M.opts.strictTypes || (ve(M, R), M.opts.allowUnionTypes || k(M, R), A(M, M.dataTypes));
  }
  function ve(M, R) {
    if (R.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = R;
        return;
      }
      R.forEach((N) => {
        C(M.dataTypes, N) || E(M, `type "${N}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), v(M, R);
    }
  }
  function k(M, R) {
    R.length > 1 && !(R.length === 2 && R.includes("null")) && E(M, "use allowUnionTypes to allow union type keyword");
  }
  function A(M, R) {
    const N = M.self.RULES.all;
    for (const I in N) {
      const x = N[I];
      if (typeof x == "object" && (0, t.shouldUseRule)(M.schema, x)) {
        const { type: L } = x.definition;
        L.length && !L.some((Y) => O(R, Y)) && E(M, `missing type "${L.join(",")}" for keyword "${I}"`);
      }
    }
  }
  function O(M, R) {
    return M.includes(R) || R === "number" && M.includes("integer");
  }
  function C(M, R) {
    return M.includes(R) || R === "integer" && M.includes("number");
  }
  function v(M, R) {
    const N = [];
    for (const I of M.dataTypes)
      C(R, I) ? N.push(I) : R.includes("integer") && I === "number" && N.push("integer");
    M.dataTypes = N;
  }
  function E(M, R) {
    const N = M.schemaEnv.baseId + M.errSchemaPath;
    R += ` at "${N}" (strictTypes)`, (0, d.checkStrictMode)(M, R, M.opts.strictTypes);
  }
  class j {
    constructor(R, N, I) {
      if ((0, i.validateKeywordUsage)(R, N, I), this.gen = R.gen, this.allErrors = R.allErrors, this.keyword = I, this.data = R.data, this.schema = R.schema[I], this.$data = N.$data && R.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(R, this.schema, I, this.$data), this.schemaType = N.schemaType, this.parentSchema = R.schema, this.params = {}, this.it = R, this.def = N, this.$data)
        this.schemaCode = R.gen.const("vSchema", J(this.$data, R));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, N.schemaType, N.allowUndefined))
        throw new Error(`${I} value must be ${JSON.stringify(N.schemaType)}`);
      ("code" in N ? N.trackErrors : N.errors !== !1) && (this.errsCount = R.gen.const("_errs", c.default.errors));
    }
    result(R, N, I) {
      this.failResult((0, a.not)(R), N, I);
    }
    failResult(R, N, I) {
      this.gen.if(R), I ? I() : this.error(), N ? (this.gen.else(), N(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(R, N) {
      this.failResult((0, a.not)(R), void 0, N);
    }
    fail(R) {
      if (R === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(R), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(R) {
      if (!this.$data)
        return this.fail(R);
      const { schemaCode: N } = this;
      this.fail((0, a._)`${N} !== undefined && (${(0, a.or)(this.invalid$data(), R)})`);
    }
    error(R, N, I) {
      if (N) {
        this.setParams(N), this._error(R, I), this.setParams({});
        return;
      }
      this._error(R, I);
    }
    _error(R, N) {
      (R ? g.reportExtraError : g.reportError)(this, this.def.error, N);
    }
    $dataError() {
      (0, g.reportError)(this, this.def.$dataError || g.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, g.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(R) {
      this.allErrors || this.gen.if(R);
    }
    setParams(R, N) {
      N ? Object.assign(this.params, R) : this.params = R;
    }
    block$data(R, N, I = a.nil) {
      this.gen.block(() => {
        this.check$data(R, I), N();
      });
    }
    check$data(R = a.nil, N = a.nil) {
      if (!this.$data)
        return;
      const { gen: I, schemaCode: x, schemaType: L, def: Y } = this;
      I.if((0, a.or)((0, a._)`${x} === undefined`, N)), R !== a.nil && I.assign(R, !0), (L.length || Y.validateSchema) && (I.elseIf(this.invalid$data()), this.$dataError(), R !== a.nil && I.assign(R, !1)), I.else();
    }
    invalid$data() {
      const { gen: R, schemaCode: N, schemaType: I, def: x, it: L } = this;
      return (0, a.or)(Y(), Z());
      function Y() {
        if (I.length) {
          if (!(N instanceof a.Name))
            throw new Error("ajv implementation error");
          const X = Array.isArray(I) ? I : [I];
          return (0, a._)`${(0, r.checkDataTypes)(X, N, L.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function Z() {
        if (x.validateSchema) {
          const X = R.scopeValue("validate$data", { ref: x.validateSchema });
          return (0, a._)`!${X}(${N})`;
        }
        return a.nil;
      }
    }
    subschema(R, N) {
      const I = (0, o.getSubschema)(this.it, R);
      (0, o.extendSubschemaData)(I, this.it, R), (0, o.extendSubschemaMode)(I, R);
      const x = { ...this.it, ...I, items: void 0, props: void 0 };
      return f(x, N), x;
    }
    mergeEvaluated(R, N) {
      const { it: I, gen: x } = this;
      I.opts.unevaluated && (I.props !== !0 && R.props !== void 0 && (I.props = d.mergeEvaluated.props(x, R.props, I.props, N)), I.items !== !0 && R.items !== void 0 && (I.items = d.mergeEvaluated.items(x, R.items, I.items, N)));
    }
    mergeValidEvaluated(R, N) {
      const { it: I, gen: x } = this;
      if (I.opts.unevaluated && (I.props !== !0 || I.items !== !0))
        return x.if(N, () => this.mergeEvaluated(R, a.Name)), !0;
    }
  }
  Me.KeywordCxt = j;
  function F(M, R, N, I) {
    const x = new j(M, N, R);
    "code" in N ? N.code(x, I) : x.$data && N.validate ? (0, i.funcKeywordCode)(x, N) : "macro" in N ? (0, i.macroKeywordCode)(x, N) : (N.compile || N.validate) && (0, i.funcKeywordCode)(x, N);
  }
  const V = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function J(M, { dataLevel: R, dataNames: N, dataPathArr: I }) {
    let x, L;
    if (M === "")
      return c.default.rootData;
    if (M[0] === "/") {
      if (!V.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      x = M, L = c.default.rootData;
    } else {
      const ne = Q.exec(M);
      if (!ne)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const ee = +ne[1];
      if (x = ne[2], x === "#") {
        if (ee >= R)
          throw new Error(X("property/index", ee));
        return I[R - ee];
      }
      if (ee > R)
        throw new Error(X("data", ee));
      if (L = N[R - ee], !x)
        return L;
    }
    let Y = L;
    const Z = x.split("/");
    for (const ne of Z)
      ne && (L = (0, a._)`${L}${(0, a.getProperty)((0, d.unescapeJsonPointer)(ne))}`, Y = (0, a._)`${Y} && ${L}`);
    return Y;
    function X(ne, ee) {
      return `Cannot access ${ne} ${ee} levels up, current level is ${R}`;
    }
  }
  return Me.getData = J, Me;
}
var Ye = {}, Or;
function nr() {
  if (Or) return Ye;
  Or = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  class s extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Ye.default = s, Ye;
}
var Qe = {}, xr;
function Vt() {
  if (xr) return Qe;
  xr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const s = Dt();
  class e extends Error {
    constructor(r, n, i, o) {
      super(o || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, s.resolveUrl)(r, n, i), this.missingSchema = (0, s.normalizeId)((0, s.getFullPath)(r, this.missingRef));
    }
  }
  return Qe.default = e, Qe;
}
var be = {}, Dr;
function ir() {
  if (Dr) return be;
  Dr = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.resolveSchema = be.getCompilingSchema = be.resolveRef = be.compileSchema = be.SchemaEnv = void 0;
  const s = W(), e = nr(), t = Ne(), r = Dt(), n = te(), i = zt();
  class o {
    constructor(p) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof p.schema == "object" && (f = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (l = p.baseId) !== null && l !== void 0 ? l : (0, r.normalizeId)(f?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  be.SchemaEnv = o;
  function a(h) {
    const p = d.call(this, h);
    if (p)
      return p;
    const l = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: y } = this.opts.code, { ownProperties: $ } = this.opts, b = new s.CodeGen(this.scope, { es5: f, lines: y, ownProperties: $ });
    let P;
    h.$async && (P = b.scopeValue("Error", {
      ref: e.default,
      code: (0, s._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const T = b.scopeName("validate");
    h.validateName = T;
    const q = {
      gen: b,
      allErrors: this.opts.allErrors,
      data: t.default.data,
      parentData: t.default.parentData,
      parentDataProperty: t.default.parentDataProperty,
      dataNames: [t.default.data],
      dataPathArr: [s.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: b.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, s.stringify)(h.schema) } : { ref: h.schema }),
      validateName: T,
      ValidationError: P,
      schema: h.schema,
      schemaEnv: h,
      rootId: l,
      baseId: h.baseId || l,
      schemaPath: s.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, s._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(q), b.optimize(this.opts.code.optimize);
      const z = b.toString();
      D = `${b.scopeRefs(t.default.scope)}return ${z}`, this.opts.code.process && (D = this.opts.code.process(D, h));
      const B = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(T, { ref: B }), B.errors = null, B.schema = h.schema, B.schemaEnv = h, h.$async && (B.$async = !0), this.opts.code.source === !0 && (B.source = { validateName: T, validateCode: z, scopeValues: b._values }), this.opts.unevaluated) {
        const { props: K, items: se } = q;
        B.evaluated = {
          props: K instanceof s.Name ? void 0 : K,
          items: se instanceof s.Name ? void 0 : se,
          dynamicProps: K instanceof s.Name,
          dynamicItems: se instanceof s.Name
        }, B.source && (B.source.evaluated = (0, s.stringify)(B.evaluated));
      }
      return h.validate = B, h;
    } catch (z) {
      throw delete h.validate, delete h.validateName, D && this.logger.error("Error compiling schema, function code:", D), z;
    } finally {
      this._compilations.delete(h);
    }
  }
  be.compileSchema = a;
  function c(h, p, l) {
    var f;
    l = (0, r.resolveUrl)(this.opts.uriResolver, p, l);
    const y = h.refs[l];
    if (y)
      return y;
    let $ = _.call(this, h, l);
    if ($ === void 0) {
      const b = (f = h.localRefs) === null || f === void 0 ? void 0 : f[l], { schemaId: P } = this.opts;
      b && ($ = new o({ schema: b, schemaId: P, root: h, baseId: p }));
    }
    if ($ !== void 0)
      return h.refs[l] = u.call(this, $);
  }
  be.resolveRef = c;
  function u(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function d(h) {
    for (const p of this._compilations)
      if (g(p, h))
        return p;
  }
  be.getCompilingSchema = d;
  function g(h, p) {
    return h.schema === p.schema && h.root === p.root && h.baseId === p.baseId;
  }
  function _(h, p) {
    let l;
    for (; typeof (l = this.refs[p]) == "string"; )
      p = l;
    return l || this.schemas[p] || w.call(this, h, p);
  }
  function w(h, p) {
    const l = this.opts.uriResolver.parse(p), f = (0, r._getFullPath)(this.opts.uriResolver, l);
    let y = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === y)
      return m.call(this, l, h);
    const $ = (0, r.normalizeId)(f), b = this.refs[$] || this.schemas[$];
    if (typeof b == "string") {
      const P = w.call(this, h, b);
      return typeof P?.schema != "object" ? void 0 : m.call(this, l, P);
    }
    if (typeof b?.schema == "object") {
      if (b.validate || a.call(this, b), $ === (0, r.normalizeId)(p)) {
        const { schema: P } = b, { schemaId: T } = this.opts, q = P[T];
        return q && (y = (0, r.resolveUrl)(this.opts.uriResolver, y, q)), new o({ schema: P, schemaId: T, root: h, baseId: y });
      }
      return m.call(this, l, b);
    }
  }
  be.resolveSchema = w;
  const S = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function m(h, { baseId: p, schema: l, root: f }) {
    var y;
    if (((y = h.fragment) === null || y === void 0 ? void 0 : y[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const T = l[(0, n.unescapeFragment)(P)];
      if (T === void 0)
        return;
      l = T;
      const q = typeof l == "object" && l[this.opts.schemaId];
      !S.has(P) && q && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, q));
    }
    let $;
    if (typeof l != "boolean" && l.$ref && !(0, n.schemaHasRulesButRef)(l, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, p, l.$ref);
      $ = w.call(this, f, P);
    }
    const { schemaId: b } = this.opts;
    if ($ = $ || new o({ schema: l, schemaId: b, root: f, baseId: p }), $.schema !== $.root.schema)
      return $;
  }
  return be;
}
const gi = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", vi = "Meta-schema for $data reference (JSON AnySchema extension proposal)", bi = "object", wi = ["$data"], $i = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, _i = !1, Si = {
  $id: gi,
  description: vi,
  type: bi,
  required: wi,
  properties: $i,
  additionalProperties: _i
};
var Xe = {}, Fe = { exports: {} }, Wt, zr;
function Pi() {
  return zr || (zr = 1, Wt = {
    HEX: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    }
  }), Wt;
}
var Yt, Vr;
function Ei() {
  if (Vr) return Yt;
  Vr = 1;
  const { HEX: s } = Pi(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(m) {
    if (a(m, ".") < 3)
      return { host: m, isIPV4: !1 };
    const h = m.match(e) || [], [p] = h;
    return p ? { host: o(p, "."), isIPV4: !0 } : { host: m, isIPV4: !1 };
  }
  function r(m, h = !1) {
    let p = "", l = !0;
    for (const f of m) {
      if (s[f] === void 0) return;
      f !== "0" && l === !0 && (l = !1), l || (p += f);
    }
    return h && p.length === 0 && (p = "0"), p;
  }
  function n(m) {
    let h = 0;
    const p = { error: !1, address: "", zone: "" }, l = [], f = [];
    let y = !1, $ = !1, b = !1;
    function P() {
      if (f.length) {
        if (y === !1) {
          const T = r(f);
          if (T !== void 0)
            l.push(T);
          else
            return p.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let T = 0; T < m.length; T++) {
      const q = m[T];
      if (!(q === "[" || q === "]"))
        if (q === ":") {
          if ($ === !0 && (b = !0), !P())
            break;
          if (h++, l.push(":"), h > 7) {
            p.error = !0;
            break;
          }
          T - 1 >= 0 && m[T - 1] === ":" && ($ = !0);
          continue;
        } else if (q === "%") {
          if (!P())
            break;
          y = !0;
        } else {
          f.push(q);
          continue;
        }
    }
    return f.length && (y ? p.zone = f.join("") : b ? l.push(f.join("")) : l.push(r(f))), p.address = l.join(""), p;
  }
  function i(m) {
    if (a(m, ":") < 2)
      return { host: m, isIPV6: !1 };
    const h = n(m);
    if (h.error)
      return { host: m, isIPV6: !1 };
    {
      let p = h.address, l = h.address;
      return h.zone && (p += "%" + h.zone, l += "%25" + h.zone), { host: p, escapedHost: l, isIPV6: !0 };
    }
  }
  function o(m, h) {
    let p = "", l = !0;
    const f = m.length;
    for (let y = 0; y < f; y++) {
      const $ = m[y];
      $ === "0" && l ? (y + 1 <= f && m[y + 1] === h || y + 1 === f) && (p += $, l = !1) : ($ === h ? l = !0 : l = !1, p += $);
    }
    return p;
  }
  function a(m, h) {
    let p = 0;
    for (let l = 0; l < m.length; l++)
      m[l] === h && p++;
    return p;
  }
  const c = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, g = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(m) {
    const h = [];
    for (; m.length; )
      if (m.match(c))
        m = m.replace(c, "");
      else if (m.match(u))
        m = m.replace(u, "/");
      else if (m.match(d))
        m = m.replace(d, "/"), h.pop();
      else if (m === "." || m === "..")
        m = "";
      else {
        const p = m.match(g);
        if (p) {
          const l = p[0];
          m = m.slice(l.length), h.push(l);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function w(m, h) {
    const p = h !== !0 ? escape : unescape;
    return m.scheme !== void 0 && (m.scheme = p(m.scheme)), m.userinfo !== void 0 && (m.userinfo = p(m.userinfo)), m.host !== void 0 && (m.host = p(m.host)), m.path !== void 0 && (m.path = p(m.path)), m.query !== void 0 && (m.query = p(m.query)), m.fragment !== void 0 && (m.fragment = p(m.fragment)), m;
  }
  function S(m) {
    const h = [];
    if (m.userinfo !== void 0 && (h.push(m.userinfo), h.push("@")), m.host !== void 0) {
      let p = unescape(m.host);
      const l = t(p);
      if (l.isIPV4)
        p = l.host;
      else {
        const f = i(l.host);
        f.isIPV6 === !0 ? p = `[${f.escapedHost}]` : p = m.host;
      }
      h.push(p);
    }
    return (typeof m.port == "number" || typeof m.port == "string") && (h.push(":"), h.push(String(m.port))), h.length ? h.join("") : void 0;
  }
  return Yt = {
    recomposeAuthority: S,
    normalizeComponentEncoding: w,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Yt;
}
var Qt, Fr;
function Mi() {
  if (Fr) return Qt;
  Fr = 1;
  const s = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function t(l) {
    return typeof l.secure == "boolean" ? l.secure : String(l.scheme).toLowerCase() === "wss";
  }
  function r(l) {
    return l.host || (l.error = l.error || "HTTP URIs must have a host."), l;
  }
  function n(l) {
    const f = String(l.scheme).toLowerCase() === "https";
    return (l.port === (f ? 443 : 80) || l.port === "") && (l.port = void 0), l.path || (l.path = "/"), l;
  }
  function i(l) {
    return l.secure = t(l), l.resourceName = (l.path || "/") + (l.query ? "?" + l.query : ""), l.path = void 0, l.query = void 0, l;
  }
  function o(l) {
    if ((l.port === (t(l) ? 443 : 80) || l.port === "") && (l.port = void 0), typeof l.secure == "boolean" && (l.scheme = l.secure ? "wss" : "ws", l.secure = void 0), l.resourceName) {
      const [f, y] = l.resourceName.split("?");
      l.path = f && f !== "/" ? f : void 0, l.query = y, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function a(l, f) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const y = l.path.match(e);
    if (y) {
      const $ = f.scheme || l.scheme || "urn";
      l.nid = y[1].toLowerCase(), l.nss = y[2];
      const b = `${$}:${f.nid || l.nid}`, P = p[b];
      l.path = void 0, P && (l = P.parse(l, f));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function c(l, f) {
    const y = f.scheme || l.scheme || "urn", $ = l.nid.toLowerCase(), b = `${y}:${f.nid || $}`, P = p[b];
    P && (l = P.serialize(l, f));
    const T = l, q = l.nss;
    return T.path = `${$ || f.nid}:${q}`, f.skipEscape = !0, T;
  }
  function u(l, f) {
    const y = l;
    return y.uuid = y.nss, y.nss = void 0, !f.tolerant && (!y.uuid || !s.test(y.uuid)) && (y.error = y.error || "UUID is not valid."), y;
  }
  function d(l) {
    const f = l;
    return f.nss = (l.uuid || "").toLowerCase(), f;
  }
  const g = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, _ = {
    scheme: "https",
    domainHost: g.domainHost,
    parse: r,
    serialize: n
  }, w = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: o
  }, S = {
    scheme: "wss",
    domainHost: w.domainHost,
    parse: w.parse,
    serialize: w.serialize
  }, p = {
    http: g,
    https: _,
    ws: w,
    wss: S,
    urn: {
      scheme: "urn",
      parse: a,
      serialize: c,
      skipNormalize: !0
    },
    "urn:uuid": {
      scheme: "urn:uuid",
      parse: u,
      serialize: d,
      skipNormalize: !0
    }
  };
  return Qt = p, Qt;
}
var Lr;
function Ti() {
  if (Lr) return Fe.exports;
  Lr = 1;
  const { normalizeIPv6: s, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = Ei(), i = Mi();
  function o(h, p) {
    return typeof h == "string" ? h = d(S(h, p), p) : typeof h == "object" && (h = S(d(h, p), p)), h;
  }
  function a(h, p, l) {
    const f = Object.assign({ scheme: "null" }, l), y = c(S(h, f), S(p, f), f, !0);
    return d(y, { ...f, skipEscape: !0 });
  }
  function c(h, p, l, f) {
    const y = {};
    return f || (h = S(d(h, l), l), p = S(d(p, l), l)), l = l || {}, !l.tolerant && p.scheme ? (y.scheme = p.scheme, y.userinfo = p.userinfo, y.host = p.host, y.port = p.port, y.path = t(p.path || ""), y.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (y.userinfo = p.userinfo, y.host = p.host, y.port = p.port, y.path = t(p.path || ""), y.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? y.path = t(p.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? y.path = "/" + p.path : h.path ? y.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + p.path : y.path = p.path, y.path = t(y.path)), y.query = p.query) : (y.path = h.path, p.query !== void 0 ? y.query = p.query : y.query = h.query), y.userinfo = h.userinfo, y.host = h.host, y.port = h.port), y.scheme = h.scheme), y.fragment = p.fragment, y;
  }
  function u(h, p, l) {
    return typeof h == "string" ? (h = unescape(h), h = d(n(S(h, l), !0), { ...l, skipEscape: !0 })) : typeof h == "object" && (h = d(n(h, !0), { ...l, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = d(n(S(p, l), !0), { ...l, skipEscape: !0 })) : typeof p == "object" && (p = d(n(p, !0), { ...l, skipEscape: !0 })), h.toLowerCase() === p.toLowerCase();
  }
  function d(h, p) {
    const l = {
      host: h.host,
      scheme: h.scheme,
      userinfo: h.userinfo,
      port: h.port,
      path: h.path,
      query: h.query,
      nid: h.nid,
      nss: h.nss,
      uuid: h.uuid,
      fragment: h.fragment,
      reference: h.reference,
      resourceName: h.resourceName,
      secure: h.secure,
      error: ""
    }, f = Object.assign({}, p), y = [], $ = i[(f.scheme || l.scheme || "").toLowerCase()];
    $ && $.serialize && $.serialize(l, f), l.path !== void 0 && (f.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), f.reference !== "suffix" && l.scheme && y.push(l.scheme, ":");
    const b = r(l);
    if (b !== void 0 && (f.reference !== "suffix" && y.push("//"), y.push(b), l.path && l.path.charAt(0) !== "/" && y.push("/")), l.path !== void 0) {
      let P = l.path;
      !f.absolutePath && (!$ || !$.absolutePath) && (P = t(P)), b === void 0 && (P = P.replace(/^\/\//u, "/%2F")), y.push(P);
    }
    return l.query !== void 0 && y.push("?", l.query), l.fragment !== void 0 && y.push("#", l.fragment), y.join("");
  }
  const g = Array.from({ length: 127 }, (h, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function _(h) {
    let p = 0;
    for (let l = 0, f = h.length; l < f; ++l)
      if (p = h.charCodeAt(l), p > 126 || g[p])
        return !0;
    return !1;
  }
  const w = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function S(h, p) {
    const l = Object.assign({}, p), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, y = h.indexOf("%") !== -1;
    let $ = !1;
    l.reference === "suffix" && (h = (l.scheme ? l.scheme + ":" : "") + "//" + h);
    const b = h.match(w);
    if (b) {
      if (f.scheme = b[1], f.userinfo = b[3], f.host = b[4], f.port = parseInt(b[5], 10), f.path = b[6] || "", f.query = b[7], f.fragment = b[8], isNaN(f.port) && (f.port = b[5]), f.host) {
        const T = e(f.host);
        if (T.isIPV4 === !1) {
          const q = s(T.host);
          f.host = q.host.toLowerCase(), $ = q.isIPV6;
        } else
          f.host = T.host, $ = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== f.reference && (f.error = f.error || "URI is not a " + l.reference + " reference.");
      const P = i[(l.scheme || f.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (l.domainHost || P && P.domainHost) && $ === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (T) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + T;
        }
      (!P || P && !P.skipNormalize) && (y && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), y && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, l);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const m = {
    SCHEMES: i,
    normalize: o,
    resolve: a,
    resolveComponents: c,
    equal: u,
    serialize: d,
    parse: S
  };
  return Fe.exports = m, Fe.exports.default = m, Fe.exports.fastUri = m, Fe.exports;
}
var Ur;
function ki() {
  if (Ur) return Xe;
  Ur = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const s = Ti();
  return s.code = 'require("ajv/dist/runtime/uri").default', Xe.default = s, Xe;
}
var Br;
function Ai() {
  return Br || (Br = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.CodeGen = s.Name = s.nil = s.stringify = s.str = s._ = s.KeywordCxt = void 0;
    var e = zt();
    Object.defineProperty(s, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = W();
    Object.defineProperty(s, "_", { enumerable: !0, get: function() {
      return t._;
    } }), Object.defineProperty(s, "str", { enumerable: !0, get: function() {
      return t.str;
    } }), Object.defineProperty(s, "stringify", { enumerable: !0, get: function() {
      return t.stringify;
    } }), Object.defineProperty(s, "nil", { enumerable: !0, get: function() {
      return t.nil;
    } }), Object.defineProperty(s, "Name", { enumerable: !0, get: function() {
      return t.Name;
    } }), Object.defineProperty(s, "CodeGen", { enumerable: !0, get: function() {
      return t.CodeGen;
    } });
    const r = nr(), n = Vt(), i = In(), o = ir(), a = W(), c = Dt(), u = qt(), d = te(), g = Si, _ = ki(), w = (k, A) => new RegExp(k, A);
    w.code = "new RegExp";
    const S = ["removeAdditional", "useDefaults", "coerceTypes"], m = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), h = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, p = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, l = 200;
    function f(k) {
      var A, O, C, v, E, j, F, V, Q, J, M, R, N, I, x, L, Y, Z, X, ne, ee, pe, le, Re, ce;
      const me = k.strict, oe = (A = k.code) === null || A === void 0 ? void 0 : A.optimize, G = oe === !0 || oe === void 0 ? 1 : oe || 0, ae = (C = (O = k.code) === null || O === void 0 ? void 0 : O.regExp) !== null && C !== void 0 ? C : w, he = (v = k.uriResolver) !== null && v !== void 0 ? v : _.default;
      return {
        strictSchema: (j = (E = k.strictSchema) !== null && E !== void 0 ? E : me) !== null && j !== void 0 ? j : !0,
        strictNumbers: (V = (F = k.strictNumbers) !== null && F !== void 0 ? F : me) !== null && V !== void 0 ? V : !0,
        strictTypes: (J = (Q = k.strictTypes) !== null && Q !== void 0 ? Q : me) !== null && J !== void 0 ? J : "log",
        strictTuples: (R = (M = k.strictTuples) !== null && M !== void 0 ? M : me) !== null && R !== void 0 ? R : "log",
        strictRequired: (I = (N = k.strictRequired) !== null && N !== void 0 ? N : me) !== null && I !== void 0 ? I : !1,
        code: k.code ? { ...k.code, optimize: G, regExp: ae } : { optimize: G, regExp: ae },
        loopRequired: (x = k.loopRequired) !== null && x !== void 0 ? x : l,
        loopEnum: (L = k.loopEnum) !== null && L !== void 0 ? L : l,
        meta: (Y = k.meta) !== null && Y !== void 0 ? Y : !0,
        messages: (Z = k.messages) !== null && Z !== void 0 ? Z : !0,
        inlineRefs: (X = k.inlineRefs) !== null && X !== void 0 ? X : !0,
        schemaId: (ne = k.schemaId) !== null && ne !== void 0 ? ne : "$id",
        addUsedSchema: (ee = k.addUsedSchema) !== null && ee !== void 0 ? ee : !0,
        validateSchema: (pe = k.validateSchema) !== null && pe !== void 0 ? pe : !0,
        validateFormats: (le = k.validateFormats) !== null && le !== void 0 ? le : !0,
        unicodeRegExp: (Re = k.unicodeRegExp) !== null && Re !== void 0 ? Re : !0,
        int32range: (ce = k.int32range) !== null && ce !== void 0 ? ce : !0,
        uriResolver: he
      };
    }
    class y {
      constructor(A = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), A = this.opts = { ...A, ...f(A) };
        const { es5: O, lines: C } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: m, es5: O, lines: C }), this.logger = U(A.logger);
        const v = A.validateFormats;
        A.validateFormats = !1, this.RULES = (0, i.getRules)(), $.call(this, h, A, "NOT SUPPORTED"), $.call(this, p, A, "DEPRECATED", "warn"), this._metaOpts = D.call(this), A.formats && T.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), A.keywords && q.call(this, A.keywords), typeof A.meta == "object" && this.addMetaSchema(A.meta), P.call(this), A.validateFormats = v;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: A, meta: O, schemaId: C } = this.opts;
        let v = g;
        C === "id" && (v = { ...g }, v.id = v.$id, delete v.$id), O && A && this.addMetaSchema(v, v[C], !1);
      }
      defaultMeta() {
        const { meta: A, schemaId: O } = this.opts;
        return this.opts.defaultMeta = typeof A == "object" ? A[O] || A : void 0;
      }
      validate(A, O) {
        let C;
        if (typeof A == "string") {
          if (C = this.getSchema(A), !C)
            throw new Error(`no schema with key or ref "${A}"`);
        } else
          C = this.compile(A);
        const v = C(O);
        return "$async" in C || (this.errors = C.errors), v;
      }
      compile(A, O) {
        const C = this._addSchema(A, O);
        return C.validate || this._compileSchemaEnv(C);
      }
      compileAsync(A, O) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: C } = this.opts;
        return v.call(this, A, O);
        async function v(J, M) {
          await E.call(this, J.$schema);
          const R = this._addSchema(J, M);
          return R.validate || j.call(this, R);
        }
        async function E(J) {
          J && !this.getSchema(J) && await v.call(this, { $ref: J }, !0);
        }
        async function j(J) {
          try {
            return this._compileSchemaEnv(J);
          } catch (M) {
            if (!(M instanceof n.default))
              throw M;
            return F.call(this, M), await V.call(this, M.missingSchema), j.call(this, J);
          }
        }
        function F({ missingSchema: J, missingRef: M }) {
          if (this.refs[J])
            throw new Error(`AnySchema ${J} is loaded but ${M} cannot be resolved`);
        }
        async function V(J) {
          const M = await Q.call(this, J);
          this.refs[J] || await E.call(this, M.$schema), this.refs[J] || this.addSchema(M, J, O);
        }
        async function Q(J) {
          const M = this._loading[J];
          if (M)
            return M;
          try {
            return await (this._loading[J] = C(J));
          } finally {
            delete this._loading[J];
          }
        }
      }
      // Adds schema to the instance
      addSchema(A, O, C, v = this.opts.validateSchema) {
        if (Array.isArray(A)) {
          for (const j of A)
            this.addSchema(j, void 0, C, v);
          return this;
        }
        let E;
        if (typeof A == "object") {
          const { schemaId: j } = this.opts;
          if (E = A[j], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${j} must be string`);
        }
        return O = (0, c.normalizeId)(O || E), this._checkUnique(O), this.schemas[O] = this._addSchema(A, C, O, v, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(A, O, C = this.opts.validateSchema) {
        return this.addSchema(A, O, !0, C), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(A, O) {
        if (typeof A == "boolean")
          return !0;
        let C;
        if (C = A.$schema, C !== void 0 && typeof C != "string")
          throw new Error("$schema must be a string");
        if (C = C || this.opts.defaultMeta || this.defaultMeta(), !C)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const v = this.validate(C, A);
        if (!v && O) {
          const E = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(E);
          else
            throw new Error(E);
        }
        return v;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(A) {
        let O;
        for (; typeof (O = b.call(this, A)) == "string"; )
          A = O;
        if (O === void 0) {
          const { schemaId: C } = this.opts, v = new o.SchemaEnv({ schema: {}, schemaId: C });
          if (O = o.resolveSchema.call(this, v, A), !O)
            return;
          this.refs[A] = O;
        }
        return O.validate || this._compileSchemaEnv(O);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(A) {
        if (A instanceof RegExp)
          return this._removeAllSchemas(this.schemas, A), this._removeAllSchemas(this.refs, A), this;
        switch (typeof A) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const O = b.call(this, A);
            return typeof O == "object" && this._cache.delete(O.schema), delete this.schemas[A], delete this.refs[A], this;
          }
          case "object": {
            const O = A;
            this._cache.delete(O);
            let C = A[this.opts.schemaId];
            return C && (C = (0, c.normalizeId)(C), delete this.schemas[C], delete this.refs[C]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(A) {
        for (const O of A)
          this.addKeyword(O);
        return this;
      }
      addKeyword(A, O) {
        let C;
        if (typeof A == "string")
          C = A, typeof O == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), O.keyword = C);
        else if (typeof A == "object" && O === void 0) {
          if (O = A, C = O.keyword, Array.isArray(C) && !C.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (K.call(this, C, O), !O)
          return (0, d.eachItem)(C, (E) => se.call(this, E)), this;
        ge.call(this, O);
        const v = {
          ...O,
          type: (0, u.getJSONTypes)(O.type),
          schemaType: (0, u.getJSONTypes)(O.schemaType)
        };
        return (0, d.eachItem)(C, v.type.length === 0 ? (E) => se.call(this, E, v) : (E) => v.type.forEach((j) => se.call(this, E, v, j))), this;
      }
      getKeyword(A) {
        const O = this.RULES.all[A];
        return typeof O == "object" ? O.definition : !!O;
      }
      // Remove keyword
      removeKeyword(A) {
        const { RULES: O } = this;
        delete O.keywords[A], delete O.all[A];
        for (const C of O.rules) {
          const v = C.rules.findIndex((E) => E.keyword === A);
          v >= 0 && C.rules.splice(v, 1);
        }
        return this;
      }
      // Add format
      addFormat(A, O) {
        return typeof O == "string" && (O = new RegExp(O)), this.formats[A] = O, this;
      }
      errorsText(A = this.errors, { separator: O = ", ", dataVar: C = "data" } = {}) {
        return !A || A.length === 0 ? "No errors" : A.map((v) => `${C}${v.instancePath} ${v.message}`).reduce((v, E) => v + O + E);
      }
      $dataMetaSchema(A, O) {
        const C = this.RULES.all;
        A = JSON.parse(JSON.stringify(A));
        for (const v of O) {
          const E = v.split("/").slice(1);
          let j = A;
          for (const F of E)
            j = j[F];
          for (const F in C) {
            const V = C[F];
            if (typeof V != "object")
              continue;
            const { $data: Q } = V.definition, J = j[F];
            Q && J && (j[F] = ve(J));
          }
        }
        return A;
      }
      _removeAllSchemas(A, O) {
        for (const C in A) {
          const v = A[C];
          (!O || O.test(C)) && (typeof v == "string" ? delete A[C] : v && !v.meta && (this._cache.delete(v.schema), delete A[C]));
        }
      }
      _addSchema(A, O, C, v = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let j;
        const { schemaId: F } = this.opts;
        if (typeof A == "object")
          j = A[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof A != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let V = this._cache.get(A);
        if (V !== void 0)
          return V;
        C = (0, c.normalizeId)(j || C);
        const Q = c.getSchemaRefs.call(this, A, C);
        return V = new o.SchemaEnv({ schema: A, schemaId: F, meta: O, baseId: C, localRefs: Q }), this._cache.set(V.schema, V), E && !C.startsWith("#") && (C && this._checkUnique(C), this.refs[C] = V), v && this.validateSchema(A, !0), V;
      }
      _checkUnique(A) {
        if (this.schemas[A] || this.refs[A])
          throw new Error(`schema with key or id "${A}" already exists`);
      }
      _compileSchemaEnv(A) {
        if (A.meta ? this._compileMetaSchema(A) : o.compileSchema.call(this, A), !A.validate)
          throw new Error("ajv implementation error");
        return A.validate;
      }
      _compileMetaSchema(A) {
        const O = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, A);
        } finally {
          this.opts = O;
        }
      }
    }
    y.ValidationError = r.default, y.MissingRefError = n.default, s.default = y;
    function $(k, A, O, C = "error") {
      for (const v in k) {
        const E = v;
        E in A && this.logger[C](`${O}: option ${v}. ${k[E]}`);
      }
    }
    function b(k) {
      return k = (0, c.normalizeId)(k), this.schemas[k] || this.refs[k];
    }
    function P() {
      const k = this.opts.schemas;
      if (k)
        if (Array.isArray(k))
          this.addSchema(k);
        else
          for (const A in k)
            this.addSchema(k[A], A);
    }
    function T() {
      for (const k in this.opts.formats) {
        const A = this.opts.formats[k];
        A && this.addFormat(k, A);
      }
    }
    function q(k) {
      if (Array.isArray(k)) {
        this.addVocabulary(k);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const A in k) {
        const O = k[A];
        O.keyword || (O.keyword = A), this.addKeyword(O);
      }
    }
    function D() {
      const k = { ...this.opts };
      for (const A of S)
        delete k[A];
      return k;
    }
    const z = { log() {
    }, warn() {
    }, error() {
    } };
    function U(k) {
      if (k === !1)
        return z;
      if (k === void 0)
        return console;
      if (k.log && k.warn && k.error)
        return k;
      throw new Error("logger must implement log, warn and error methods");
    }
    const B = /^[a-z_$][a-z0-9_$:-]*$/i;
    function K(k, A) {
      const { RULES: O } = this;
      if ((0, d.eachItem)(k, (C) => {
        if (O.keywords[C])
          throw new Error(`Keyword ${C} is already defined`);
        if (!B.test(C))
          throw new Error(`Keyword ${C} has invalid name`);
      }), !!A && A.$data && !("code" in A || "validate" in A))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function se(k, A, O) {
      var C;
      const v = A?.post;
      if (O && v)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let j = v ? E.post : E.rules.find(({ type: V }) => V === O);
      if (j || (j = { type: O, rules: [] }, E.rules.push(j)), E.keywords[k] = !0, !A)
        return;
      const F = {
        keyword: k,
        definition: {
          ...A,
          type: (0, u.getJSONTypes)(A.type),
          schemaType: (0, u.getJSONTypes)(A.schemaType)
        }
      };
      A.before ? ye.call(this, j, F, A.before) : j.rules.push(F), E.all[k] = F, (C = A.implements) === null || C === void 0 || C.forEach((V) => this.addKeyword(V));
    }
    function ye(k, A, O) {
      const C = k.rules.findIndex((v) => v.keyword === O);
      C >= 0 ? k.rules.splice(C, 0, A) : (k.rules.push(A), this.logger.warn(`rule ${O} is not defined`));
    }
    function ge(k) {
      let { metaSchema: A } = k;
      A !== void 0 && (k.$data && this.opts.$data && (A = ve(A)), k.validateSchema = this.compile(A, !0));
    }
    const re = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ve(k) {
      return { anyOf: [k, re] };
    }
  })(Lt)), Lt;
}
var Ze = {}, et = {}, tt = {}, Gr;
function Ni() {
  if (Gr) return tt;
  Gr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const s = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return tt.default = s, tt;
}
var Ae = {}, Kr;
function Ri() {
  if (Kr) return Ae;
  Kr = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.callRef = Ae.getValidate = void 0;
  const s = Vt(), e = $e(), t = W(), r = Ne(), n = ir(), i = te(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: d, schema: g, it: _ } = u, { baseId: w, schemaEnv: S, validateName: m, opts: h, self: p } = _, { root: l } = S;
      if ((g === "#" || g === "#/") && w === l.baseId)
        return y();
      const f = n.resolveRef.call(p, l, w, g);
      if (f === void 0)
        throw new s.default(_.opts.uriResolver, w, g);
      if (f instanceof n.SchemaEnv)
        return $(f);
      return b(f);
      function y() {
        if (S === l)
          return c(u, m, S, S.$async);
        const P = d.scopeValue("root", { ref: l });
        return c(u, (0, t._)`${P}.validate`, l, l.$async);
      }
      function $(P) {
        const T = a(u, P);
        c(u, T, P, P.$async);
      }
      function b(P) {
        const T = d.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), q = d.name("valid"), D = u.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: T,
          errSchemaPath: g
        }, q);
        u.mergeEvaluated(D), u.ok(q);
      }
    }
  };
  function a(u, d) {
    const { gen: g } = u;
    return d.validate ? g.scopeValue("validate", { ref: d.validate }) : (0, t._)`${g.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Ae.getValidate = a;
  function c(u, d, g, _) {
    const { gen: w, it: S } = u, { allErrors: m, schemaEnv: h, opts: p } = S, l = p.passContext ? r.default.this : t.nil;
    _ ? f() : y();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = w.let("valid");
      w.try(() => {
        w.code((0, t._)`await ${(0, e.callValidateCode)(u, d, l)}`), b(d), m || w.assign(P, !0);
      }, (T) => {
        w.if((0, t._)`!(${T} instanceof ${S.ValidationError})`, () => w.throw(T)), $(T), m || w.assign(P, !1);
      }), u.ok(P);
    }
    function y() {
      u.result((0, e.callValidateCode)(u, d, l), () => b(d), () => $(d));
    }
    function $(P) {
      const T = (0, t._)`${P}.errors`;
      w.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${T} : ${r.default.vErrors}.concat(${T})`), w.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function b(P) {
      var T;
      if (!S.opts.unevaluated)
        return;
      const q = (T = g?.validate) === null || T === void 0 ? void 0 : T.evaluated;
      if (S.props !== !0)
        if (q && !q.dynamicProps)
          q.props !== void 0 && (S.props = i.mergeEvaluated.props(w, q.props, S.props));
        else {
          const D = w.var("props", (0, t._)`${P}.evaluated.props`);
          S.props = i.mergeEvaluated.props(w, D, S.props, t.Name);
        }
      if (S.items !== !0)
        if (q && !q.dynamicItems)
          q.items !== void 0 && (S.items = i.mergeEvaluated.items(w, q.items, S.items));
        else {
          const D = w.var("items", (0, t._)`${P}.evaluated.items`);
          S.items = i.mergeEvaluated.items(w, D, S.items, t.Name);
        }
    }
  }
  return Ae.callRef = c, Ae.default = o, Ae;
}
var Jr;
function Ci() {
  if (Jr) return et;
  Jr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const s = Ni(), e = Ri(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    s.default,
    e.default
  ];
  return et.default = t, et;
}
var rt = {}, nt = {}, Hr;
function ji() {
  if (Hr) return nt;
  Hr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const s = W(), e = s.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, r = {
    message: ({ keyword: i, schemaCode: o }) => (0, s.str)`must be ${t[i].okStr} ${o}`,
    params: ({ keyword: i, schemaCode: o }) => (0, s._)`{comparison: ${t[i].okStr}, limit: ${o}}`
  }, n = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(i) {
      const { keyword: o, data: a, schemaCode: c } = i;
      i.fail$data((0, s._)`${a} ${t[o].fail} ${c} || isNaN(${a})`);
    }
  };
  return nt.default = n, nt;
}
var it = {}, Wr;
function Ii() {
  if (Wr) return it;
  Wr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const s = W(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, s._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: n, data: i, schemaCode: o, it: a } = r, c = a.opts.multipleOfPrecision, u = n.let("res"), d = c ? (0, s._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${c}` : (0, s._)`${u} !== parseInt(${u})`;
      r.fail$data((0, s._)`(${o} === 0 || (${u} = ${i}/${o}, ${d}))`);
    }
  };
  return it.default = t, it;
}
var st = {}, ot = {}, Yr;
function qi() {
  if (Yr) return ot;
  Yr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  function s(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return ot.default = s, s.code = 'require("ajv/dist/runtime/ucs2length").default', ot;
}
var Qr;
function Oi() {
  if (Qr) return st;
  Qr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const s = W(), e = te(), t = qi(), n = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: o }) {
        const a = i === "maxLength" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${a} than ${o} characters`;
      },
      params: ({ schemaCode: i }) => (0, s._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: o, data: a, schemaCode: c, it: u } = i, d = o === "maxLength" ? s.operators.GT : s.operators.LT, g = u.opts.unicode === !1 ? (0, s._)`${a}.length` : (0, s._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, s._)`${g} ${d} ${c}`);
    }
  };
  return st.default = n, st;
}
var at = {}, Xr;
function xi() {
  if (Xr) return at;
  Xr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const s = $e(), e = W(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: o, schema: a, schemaCode: c, it: u } = n, d = u.opts.unicodeRegExp ? "u" : "", g = o ? (0, e._)`(new RegExp(${c}, ${d}))` : (0, s.usePattern)(n, a);
      n.fail$data((0, e._)`!${g}.test(${i})`);
    }
  };
  return at.default = r, at;
}
var ct = {}, Zr;
function Di() {
  if (Zr) return ct;
  Zr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const s = W(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxProperties" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${i} than ${n} properties`;
      },
      params: ({ schemaCode: r }) => (0, s._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: o } = r, a = n === "maxProperties" ? s.operators.GT : s.operators.LT;
      r.fail$data((0, s._)`Object.keys(${i}).length ${a} ${o}`);
    }
  };
  return ct.default = t, ct;
}
var lt = {}, en;
function zi() {
  if (en) return lt;
  en = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const s = $e(), e = W(), t = te(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: o, schema: a, schemaCode: c, data: u, $data: d, it: g } = i, { opts: _ } = g;
      if (!d && a.length === 0)
        return;
      const w = a.length >= _.loopRequired;
      if (g.allErrors ? S() : m(), _.strictRequired) {
        const l = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const y of a)
          if (l?.[y] === void 0 && !f.has(y)) {
            const $ = g.schemaEnv.baseId + g.errSchemaPath, b = `required property "${y}" is not defined at "${$}" (strictRequired)`;
            (0, t.checkStrictMode)(g, b, g.opts.strictRequired);
          }
      }
      function S() {
        if (w || d)
          i.block$data(e.nil, h);
        else
          for (const l of a)
            (0, s.checkReportMissingProp)(i, l);
      }
      function m() {
        const l = o.let("missing");
        if (w || d) {
          const f = o.let("valid", !0);
          i.block$data(f, () => p(l, f)), i.ok(f);
        } else
          o.if((0, s.checkMissingProp)(i, a, l)), (0, s.reportMissingProp)(i, l), o.else();
      }
      function h() {
        o.forOf("prop", c, (l) => {
          i.setParams({ missingProperty: l }), o.if((0, s.noPropertyInData)(o, u, l, _.ownProperties), () => i.error());
        });
      }
      function p(l, f) {
        i.setParams({ missingProperty: l }), o.forOf(l, c, () => {
          o.assign(f, (0, s.propertyInData)(o, u, l, _.ownProperties)), o.if((0, e.not)(f), () => {
            i.error(), o.break();
          });
        }, e.nil);
      }
    }
  };
  return lt.default = n, lt;
}
var ut = {}, tn;
function Vi() {
  if (tn) return ut;
  tn = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const s = W(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxItems" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${i} than ${n} items`;
      },
      params: ({ schemaCode: r }) => (0, s._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: o } = r, a = n === "maxItems" ? s.operators.GT : s.operators.LT;
      r.fail$data((0, s._)`${i}.length ${a} ${o}`);
    }
  };
  return ut.default = t, ut;
}
var dt = {}, ht = {}, rn;
function sr() {
  if (rn) return ht;
  rn = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const s = On();
  return s.code = 'require("ajv/dist/runtime/equal").default', ht.default = s, ht;
}
var nn;
function Fi() {
  if (nn) return dt;
  nn = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const s = qt(), e = W(), t = te(), r = sr(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: o, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${o} are identical)`,
      params: ({ params: { i: o, j: a } }) => (0, e._)`{i: ${o}, j: ${a}}`
    },
    code(o) {
      const { gen: a, data: c, $data: u, schema: d, parentSchema: g, schemaCode: _, it: w } = o;
      if (!u && !d)
        return;
      const S = a.let("valid"), m = g.items ? (0, s.getSchemaTypes)(g.items) : [];
      o.block$data(S, h, (0, e._)`${_} === false`), o.ok(S);
      function h() {
        const y = a.let("i", (0, e._)`${c}.length`), $ = a.let("j");
        o.setParams({ i: y, j: $ }), a.assign(S, !0), a.if((0, e._)`${y} > 1`, () => (p() ? l : f)(y, $));
      }
      function p() {
        return m.length > 0 && !m.some((y) => y === "object" || y === "array");
      }
      function l(y, $) {
        const b = a.name("item"), P = (0, s.checkDataTypes)(m, b, w.opts.strictNumbers, s.DataType.Wrong), T = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${y}--;`, () => {
          a.let(b, (0, e._)`${c}[${y}]`), a.if(P, (0, e._)`continue`), m.length > 1 && a.if((0, e._)`typeof ${b} == "string"`, (0, e._)`${b} += "_"`), a.if((0, e._)`typeof ${T}[${b}] == "number"`, () => {
            a.assign($, (0, e._)`${T}[${b}]`), o.error(), a.assign(S, !1).break();
          }).code((0, e._)`${T}[${b}] = ${y}`);
        });
      }
      function f(y, $) {
        const b = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${y}--;`, () => a.for((0, e._)`${$} = ${y}; ${$}--;`, () => a.if((0, e._)`${b}(${c}[${y}], ${c}[${$}])`, () => {
          o.error(), a.assign(S, !1).break(P);
        })));
      }
    }
  };
  return dt.default = i, dt;
}
var ft = {}, sn;
function Li() {
  if (sn) return ft;
  sn = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const s = W(), e = te(), t = sr(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, s._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: c, schemaCode: u, schema: d } = i;
      c || d && typeof d == "object" ? i.fail$data((0, s._)`!${(0, e.useFunc)(o, t.default)}(${a}, ${u})`) : i.fail((0, s._)`${d} !== ${a}`);
    }
  };
  return ft.default = n, ft;
}
var pt = {}, on;
function Ui() {
  if (on) return pt;
  on = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const s = W(), e = te(), t = sr(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, s._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: c, schema: u, schemaCode: d, it: g } = i;
      if (!c && u.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = u.length >= g.opts.loopEnum;
      let w;
      const S = () => w ?? (w = (0, e.useFunc)(o, t.default));
      let m;
      if (_ || c)
        m = o.let("valid"), i.block$data(m, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const l = o.const("vSchema", d);
        m = (0, s.or)(...u.map((f, y) => p(l, y)));
      }
      i.pass(m);
      function h() {
        o.assign(m, !1), o.forOf("v", d, (l) => o.if((0, s._)`${S()}(${a}, ${l})`, () => o.assign(m, !0).break()));
      }
      function p(l, f) {
        const y = u[f];
        return typeof y == "object" && y !== null ? (0, s._)`${S()}(${a}, ${l}[${f}])` : (0, s._)`${a} === ${y}`;
      }
    }
  };
  return pt.default = n, pt;
}
var an;
function Bi() {
  if (an) return rt;
  an = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const s = ji(), e = Ii(), t = Oi(), r = xi(), n = Di(), i = zi(), o = Vi(), a = Fi(), c = Li(), u = Ui(), d = [
    // number
    s.default,
    e.default,
    // string
    t.default,
    r.default,
    // object
    n.default,
    i.default,
    // array
    o.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    u.default
  ];
  return rt.default = d, rt;
}
var mt = {}, qe = {}, cn;
function xn() {
  if (cn) return qe;
  cn = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.validateAdditionalItems = void 0;
  const s = W(), e = te(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, s.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, s._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: o, it: a } = i, { items: c } = o;
      if (!Array.isArray(c)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      n(i, c);
    }
  };
  function n(i, o) {
    const { gen: a, schema: c, data: u, keyword: d, it: g } = i;
    g.items = !0;
    const _ = a.const("len", (0, s._)`${u}.length`);
    if (c === !1)
      i.setParams({ len: o.length }), i.pass((0, s._)`${_} <= ${o.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(g, c)) {
      const S = a.var("valid", (0, s._)`${_} <= ${o.length}`);
      a.if((0, s.not)(S), () => w(S)), i.ok(S);
    }
    function w(S) {
      a.forRange("i", o.length, _, (m) => {
        i.subschema({ keyword: d, dataProp: m, dataPropType: e.Type.Num }, S), g.allErrors || a.if((0, s.not)(S), () => a.break());
      });
    }
  }
  return qe.validateAdditionalItems = n, qe.default = r, qe;
}
var yt = {}, Oe = {}, ln;
function Dn() {
  if (ln) return Oe;
  ln = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.validateTuple = void 0;
  const s = W(), e = te(), t = $e(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: o, it: a } = i;
      if (Array.isArray(o))
        return n(i, "additionalItems", o);
      a.items = !0, !(0, e.alwaysValidSchema)(a, o) && i.ok((0, t.validateArray)(i));
    }
  };
  function n(i, o, a = i.schema) {
    const { gen: c, parentSchema: u, data: d, keyword: g, it: _ } = i;
    m(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(c, a.length, _.items));
    const w = c.name("valid"), S = c.const("len", (0, s._)`${d}.length`);
    a.forEach((h, p) => {
      (0, e.alwaysValidSchema)(_, h) || (c.if((0, s._)`${S} > ${p}`, () => i.subschema({
        keyword: g,
        schemaProp: p,
        dataProp: p
      }, w)), i.ok(w));
    });
    function m(h) {
      const { opts: p, errSchemaPath: l } = _, f = a.length, y = f === h.minItems && (f === h.maxItems || h[o] === !1);
      if (p.strictTuples && !y) {
        const $ = `"${g}" is ${f}-tuple, but minItems or maxItems/${o} are not specified or different at path "${l}"`;
        (0, e.checkStrictMode)(_, $, p.strictTuples);
      }
    }
  }
  return Oe.validateTuple = n, Oe.default = r, Oe;
}
var un;
function Gi() {
  if (un) return yt;
  un = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const s = Dn(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, s.validateTuple)(t, "items")
  };
  return yt.default = e, yt;
}
var gt = {}, dn;
function Ki() {
  if (dn) return gt;
  dn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const s = W(), e = te(), t = $e(), r = xn(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, s.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, s._)`{limit: ${o}}`
    },
    code(o) {
      const { schema: a, parentSchema: c, it: u } = o, { prefixItems: d } = c;
      u.items = !0, !(0, e.alwaysValidSchema)(u, a) && (d ? (0, r.validateAdditionalItems)(o, d) : o.ok((0, t.validateArray)(o)));
    }
  };
  return gt.default = i, gt;
}
var vt = {}, hn;
function Ji() {
  if (hn) return vt;
  hn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const s = W(), e = te(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: n, max: i } }) => i === void 0 ? (0, s.str)`must contain at least ${n} valid item(s)` : (0, s.str)`must contain at least ${n} and no more than ${i} valid item(s)`,
      params: ({ params: { min: n, max: i } }) => i === void 0 ? (0, s._)`{minContains: ${n}}` : (0, s._)`{minContains: ${n}, maxContains: ${i}}`
    },
    code(n) {
      const { gen: i, schema: o, parentSchema: a, data: c, it: u } = n;
      let d, g;
      const { minContains: _, maxContains: w } = a;
      u.opts.next ? (d = _ === void 0 ? 1 : _, g = w) : d = 1;
      const S = i.const("len", (0, s._)`${c}.length`);
      if (n.setParams({ min: d, max: g }), g === void 0 && d === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (g !== void 0 && d > g) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, o)) {
        let f = (0, s._)`${S} >= ${d}`;
        g !== void 0 && (f = (0, s._)`${f} && ${S} <= ${g}`), n.pass(f);
        return;
      }
      u.items = !0;
      const m = i.name("valid");
      g === void 0 && d === 1 ? p(m, () => i.if(m, () => i.break())) : d === 0 ? (i.let(m, !0), g !== void 0 && i.if((0, s._)`${c}.length > 0`, h)) : (i.let(m, !1), h()), n.result(m, () => n.reset());
      function h() {
        const f = i.name("_valid"), y = i.let("count", 0);
        p(f, () => i.if(f, () => l(y)));
      }
      function p(f, y) {
        i.forRange("i", 0, S, ($) => {
          n.subschema({
            keyword: "contains",
            dataProp: $,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), y();
        });
      }
      function l(f) {
        i.code((0, s._)`${f}++`), g === void 0 ? i.if((0, s._)`${f} >= ${d}`, () => i.assign(m, !0).break()) : (i.if((0, s._)`${f} > ${g}`, () => i.assign(m, !1).break()), d === 1 ? i.assign(m, !0) : i.if((0, s._)`${f} >= ${d}`, () => i.assign(m, !0)));
      }
    }
  };
  return vt.default = r, vt;
}
var Xt = {}, fn;
function Hi() {
  return fn || (fn = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.validateSchemaDeps = s.validatePropertyDeps = s.error = void 0;
    const e = W(), t = te(), r = $e();
    s.error = {
      message: ({ params: { property: c, depsCount: u, deps: d } }) => {
        const g = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${g} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: u, deps: d, missingProperty: g } }) => (0, e._)`{property: ${c},
    missingProperty: ${g},
    depsCount: ${u},
    deps: ${d}}`
      // TODO change to reference
    };
    const n = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: s.error,
      code(c) {
        const [u, d] = i(c);
        o(c, u), a(c, d);
      }
    };
    function i({ schema: c }) {
      const u = {}, d = {};
      for (const g in c) {
        if (g === "__proto__")
          continue;
        const _ = Array.isArray(c[g]) ? u : d;
        _[g] = c[g];
      }
      return [u, d];
    }
    function o(c, u = c.schema) {
      const { gen: d, data: g, it: _ } = c;
      if (Object.keys(u).length === 0)
        return;
      const w = d.let("missing");
      for (const S in u) {
        const m = u[S];
        if (m.length === 0)
          continue;
        const h = (0, r.propertyInData)(d, g, S, _.opts.ownProperties);
        c.setParams({
          property: S,
          depsCount: m.length,
          deps: m.join(", ")
        }), _.allErrors ? d.if(h, () => {
          for (const p of m)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${h} && (${(0, r.checkMissingProp)(c, m, w)})`), (0, r.reportMissingProp)(c, w), d.else());
      }
    }
    s.validatePropertyDeps = o;
    function a(c, u = c.schema) {
      const { gen: d, data: g, keyword: _, it: w } = c, S = d.name("valid");
      for (const m in u)
        (0, t.alwaysValidSchema)(w, u[m]) || (d.if(
          (0, r.propertyInData)(d, g, m, w.opts.ownProperties),
          () => {
            const h = c.subschema({ keyword: _, schemaProp: m }, S);
            c.mergeValidEvaluated(h, S);
          },
          () => d.var(S, !0)
          // TODO var
        ), c.ok(S));
    }
    s.validateSchemaDeps = a, s.default = n;
  })(Xt)), Xt;
}
var bt = {}, pn;
function Wi() {
  if (pn) return bt;
  pn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const s = W(), e = te(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, s._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: i, schema: o, data: a, it: c } = n;
      if ((0, e.alwaysValidSchema)(c, o))
        return;
      const u = i.name("valid");
      i.forIn("key", a, (d) => {
        n.setParams({ propertyName: d }), n.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, u), i.if((0, s.not)(u), () => {
          n.error(!0), c.allErrors || i.break();
        });
      }), n.ok(u);
    }
  };
  return bt.default = r, bt;
}
var wt = {}, mn;
function zn() {
  if (mn) return wt;
  mn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const s = $e(), e = W(), t = Ne(), r = te(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: o }) => (0, e._)`{additionalProperty: ${o.additionalProperty}}`
    },
    code(o) {
      const { gen: a, schema: c, parentSchema: u, data: d, errsCount: g, it: _ } = o;
      if (!g)
        throw new Error("ajv implementation error");
      const { allErrors: w, opts: S } = _;
      if (_.props = !0, S.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, c))
        return;
      const m = (0, s.allSchemaProperties)(u.properties), h = (0, s.allSchemaProperties)(u.patternProperties);
      p(), o.ok((0, e._)`${g} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (b) => {
          !m.length && !h.length ? y(b) : a.if(l(b), () => y(b));
        });
      }
      function l(b) {
        let P;
        if (m.length > 8) {
          const T = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          P = (0, s.isOwnProperty)(a, T, b);
        } else m.length ? P = (0, e.or)(...m.map((T) => (0, e._)`${b} === ${T}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((T) => (0, e._)`${(0, s.usePattern)(o, T)}.test(${b})`))), (0, e.not)(P);
      }
      function f(b) {
        a.code((0, e._)`delete ${d}[${b}]`);
      }
      function y(b) {
        if (S.removeAdditional === "all" || S.removeAdditional && c === !1) {
          f(b);
          return;
        }
        if (c === !1) {
          o.setParams({ additionalProperty: b }), o.error(), w || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(_, c)) {
          const P = a.name("valid");
          S.removeAdditional === "failing" ? ($(b, P, !1), a.if((0, e.not)(P), () => {
            o.reset(), f(b);
          })) : ($(b, P), w || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function $(b, P, T) {
        const q = {
          keyword: "additionalProperties",
          dataProp: b,
          dataPropType: r.Type.Str
        };
        T === !1 && Object.assign(q, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(q, P);
      }
    }
  };
  return wt.default = i, wt;
}
var $t = {}, yn;
function Yi() {
  if (yn) return $t;
  yn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const s = zt(), e = $e(), t = te(), r = zn(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, parentSchema: c, data: u, it: d } = i;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new s.KeywordCxt(d, r.default, "additionalProperties"));
      const g = (0, e.allSchemaProperties)(a);
      for (const h of g)
        d.definedProperties.add(h);
      d.opts.unevaluated && g.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(o, (0, t.toHash)(g), d.props));
      const _ = g.filter((h) => !(0, t.alwaysValidSchema)(d, a[h]));
      if (_.length === 0)
        return;
      const w = o.name("valid");
      for (const h of _)
        S(h) ? m(h) : (o.if((0, e.propertyInData)(o, u, h, d.opts.ownProperties)), m(h), d.allErrors || o.else().var(w, !0), o.endIf()), i.it.definedProperties.add(h), i.ok(w);
      function S(h) {
        return d.opts.useDefaults && !d.compositeRule && a[h].default !== void 0;
      }
      function m(h) {
        i.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, w);
      }
    }
  };
  return $t.default = n, $t;
}
var _t = {}, gn;
function Qi() {
  if (gn) return _t;
  gn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const s = $e(), e = W(), t = te(), r = te(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, data: c, parentSchema: u, it: d } = i, { opts: g } = d, _ = (0, s.allSchemaProperties)(a), w = _.filter((y) => (0, t.alwaysValidSchema)(d, a[y]));
      if (_.length === 0 || w.length === _.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const S = g.strictSchema && !g.allowMatchingProperties && u.properties, m = o.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(o, d.props));
      const { props: h } = d;
      p();
      function p() {
        for (const y of _)
          S && l(y), d.allErrors ? f(y) : (o.var(m, !0), f(y), o.if(m));
      }
      function l(y) {
        for (const $ in S)
          new RegExp(y).test($) && (0, t.checkStrictMode)(d, `property ${$} matches pattern ${y} (use allowMatchingProperties)`);
      }
      function f(y) {
        o.forIn("key", c, ($) => {
          o.if((0, e._)`${(0, s.usePattern)(i, y)}.test(${$})`, () => {
            const b = w.includes(y);
            b || i.subschema({
              keyword: "patternProperties",
              schemaProp: y,
              dataProp: $,
              dataPropType: r.Type.Str
            }, m), d.opts.unevaluated && h !== !0 ? o.assign((0, e._)`${h}[${$}]`, !0) : !b && !d.allErrors && o.if((0, e.not)(m), () => o.break());
          });
        });
      }
    }
  };
  return _t.default = n, _t;
}
var St = {}, vn;
function Xi() {
  if (vn) return St;
  vn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const s = te(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if ((0, s.alwaysValidSchema)(i, n)) {
        t.fail();
        return;
      }
      const o = r.name("valid");
      t.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o), t.failResult(o, () => t.reset(), () => t.error());
    },
    error: { message: "must NOT be valid" }
  };
  return St.default = e, St;
}
var Pt = {}, bn;
function Zi() {
  if (bn) return Pt;
  bn = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: $e().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Pt.default = e, Pt;
}
var Et = {}, wn;
function es() {
  if (wn) return Et;
  wn = 1, Object.defineProperty(Et, "__esModule", { value: !0 });
  const s = W(), e = te(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, s._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: i, schema: o, parentSchema: a, it: c } = n;
      if (!Array.isArray(o))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const u = o, d = i.let("valid", !1), g = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: g }), i.block(w), n.result(d, () => n.reset(), () => n.error(!0));
      function w() {
        u.forEach((S, m) => {
          let h;
          (0, e.alwaysValidSchema)(c, S) ? i.var(_, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: m,
            compositeRule: !0
          }, _), m > 0 && i.if((0, s._)`${_} && ${d}`).assign(d, !1).assign(g, (0, s._)`[${g}, ${m}]`).else(), i.if(_, () => {
            i.assign(d, !0), i.assign(g, m), h && n.mergeEvaluated(h, s.Name);
          });
        });
      }
    }
  };
  return Et.default = r, Et;
}
var Mt = {}, $n;
function ts() {
  if ($n) return Mt;
  $n = 1, Object.defineProperty(Mt, "__esModule", { value: !0 });
  const s = te(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const o = r.name("valid");
      n.forEach((a, c) => {
        if ((0, s.alwaysValidSchema)(i, a))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: c }, o);
        t.ok(o), t.mergeEvaluated(u);
      });
    }
  };
  return Mt.default = e, Mt;
}
var Tt = {}, _n;
function rs() {
  if (_n) return Tt;
  _n = 1, Object.defineProperty(Tt, "__esModule", { value: !0 });
  const s = W(), e = te(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, s.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, s._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: o, parentSchema: a, it: c } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const u = n(c, "then"), d = n(c, "else");
      if (!u && !d)
        return;
      const g = o.let("valid", !0), _ = o.name("_valid");
      if (w(), i.reset(), u && d) {
        const m = o.let("ifClause");
        i.setParams({ ifClause: m }), o.if(_, S("then", m), S("else", m));
      } else u ? o.if(_, S("then")) : o.if((0, s.not)(_), S("else"));
      i.pass(g, () => i.error(!0));
      function w() {
        const m = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(m);
      }
      function S(m, h) {
        return () => {
          const p = i.subschema({ keyword: m }, _);
          o.assign(g, _), i.mergeValidEvaluated(p, g), h ? o.assign(h, (0, s._)`${m}`) : i.setParams({ ifClause: m });
        };
      }
    }
  };
  function n(i, o) {
    const a = i.schema[o];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return Tt.default = r, Tt;
}
var kt = {}, Sn;
function ns() {
  if (Sn) return kt;
  Sn = 1, Object.defineProperty(kt, "__esModule", { value: !0 });
  const s = te(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, s.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return kt.default = e, kt;
}
var Pn;
function is() {
  if (Pn) return mt;
  Pn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = xn(), e = Gi(), t = Dn(), r = Ki(), n = Ji(), i = Hi(), o = Wi(), a = zn(), c = Yi(), u = Qi(), d = Xi(), g = Zi(), _ = es(), w = ts(), S = rs(), m = ns();
  function h(p = !1) {
    const l = [
      // any
      d.default,
      g.default,
      _.default,
      w.default,
      S.default,
      m.default,
      // object
      o.default,
      a.default,
      i.default,
      c.default,
      u.default
    ];
    return p ? l.push(e.default, r.default) : l.push(s.default, t.default), l.push(n.default), l;
  }
  return mt.default = h, mt;
}
var At = {}, Nt = {}, En;
function ss() {
  if (En) return Nt;
  En = 1, Object.defineProperty(Nt, "__esModule", { value: !0 });
  const s = W(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, s._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: o, $data: a, schema: c, schemaCode: u, it: d } = r, { opts: g, errSchemaPath: _, schemaEnv: w, self: S } = d;
      if (!g.validateFormats)
        return;
      a ? m() : h();
      function m() {
        const p = i.scopeValue("formats", {
          ref: S.formats,
          code: g.code.formats
        }), l = i.const("fDef", (0, s._)`${p}[${u}]`), f = i.let("fType"), y = i.let("format");
        i.if((0, s._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => i.assign(f, (0, s._)`${l}.type || "string"`).assign(y, (0, s._)`${l}.validate`), () => i.assign(f, (0, s._)`"string"`).assign(y, l)), r.fail$data((0, s.or)($(), b()));
        function $() {
          return g.strictSchema === !1 ? s.nil : (0, s._)`${u} && !${y}`;
        }
        function b() {
          const P = w.$async ? (0, s._)`(${l}.async ? await ${y}(${o}) : ${y}(${o}))` : (0, s._)`${y}(${o})`, T = (0, s._)`(typeof ${y} == "function" ? ${P} : ${y}.test(${o}))`;
          return (0, s._)`${y} && ${y} !== true && ${f} === ${n} && !${T}`;
        }
      }
      function h() {
        const p = S.formats[c];
        if (!p) {
          $();
          return;
        }
        if (p === !0)
          return;
        const [l, f, y] = b(p);
        l === n && r.pass(P());
        function $() {
          if (g.strictSchema === !1) {
            S.logger.warn(T());
            return;
          }
          throw new Error(T());
          function T() {
            return `unknown format "${c}" ignored in schema at path "${_}"`;
          }
        }
        function b(T) {
          const q = T instanceof RegExp ? (0, s.regexpCode)(T) : g.code.formats ? (0, s._)`${g.code.formats}${(0, s.getProperty)(c)}` : void 0, D = i.scopeValue("formats", { key: c, ref: T, code: q });
          return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, s._)`${D}.validate`] : ["string", T, D];
        }
        function P() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!w.$async)
              throw new Error("async format in sync schema");
            return (0, s._)`await ${y}(${o})`;
          }
          return typeof f == "function" ? (0, s._)`${y}(${o})` : (0, s._)`${y}.test(${o})`;
        }
      }
    }
  };
  return Nt.default = t, Nt;
}
var Mn;
function os() {
  if (Mn) return At;
  Mn = 1, Object.defineProperty(At, "__esModule", { value: !0 });
  const e = [ss().default];
  return At.default = e, At;
}
var Ie = {}, Tn;
function as() {
  return Tn || (Tn = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.contentVocabulary = Ie.metadataVocabulary = void 0, Ie.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ie.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ie;
}
var kn;
function cs() {
  if (kn) return Ze;
  kn = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const s = Ci(), e = Bi(), t = is(), r = os(), n = as(), i = [
    s.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Ze.default = i, Ze;
}
var Rt = {}, Le = {}, An;
function ls() {
  if (An) return Le;
  An = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.DiscrError = void 0;
  var s;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(s || (Le.DiscrError = s = {})), Le;
}
var Nn;
function us() {
  if (Nn) return Rt;
  Nn = 1, Object.defineProperty(Rt, "__esModule", { value: !0 });
  const s = W(), e = ls(), t = ir(), r = Vt(), n = te(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: u } }) => (0, s._)`{error: ${a}, tag: ${u}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: u, schema: d, parentSchema: g, it: _ } = a, { oneOf: w } = g;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const S = d.propertyName;
      if (typeof S != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!w)
        throw new Error("discriminator: requires oneOf keyword");
      const m = c.let("valid", !1), h = c.const("tag", (0, s._)`${u}${(0, s.getProperty)(S)}`);
      c.if((0, s._)`typeof ${h} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: S })), a.ok(m);
      function p() {
        const y = f();
        c.if(!1);
        for (const $ in y)
          c.elseIf((0, s._)`${h} === ${$}`), c.assign(m, l(y[$]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: S }), c.endIf();
      }
      function l(y) {
        const $ = c.name("valid"), b = a.subschema({ keyword: "oneOf", schemaProp: y }, $);
        return a.mergeEvaluated(b, s.Name), $;
      }
      function f() {
        var y;
        const $ = {}, b = T(g);
        let P = !0;
        for (let z = 0; z < w.length; z++) {
          let U = w[z];
          if (U?.$ref && !(0, n.schemaHasRulesButRef)(U, _.self.RULES)) {
            const K = U.$ref;
            if (U = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, K), U instanceof t.SchemaEnv && (U = U.schema), U === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, K);
          }
          const B = (y = U?.properties) === null || y === void 0 ? void 0 : y[S];
          if (typeof B != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${S}"`);
          P = P && (b || T(U)), q(B, z);
        }
        if (!P)
          throw new Error(`discriminator: "${S}" must be required`);
        return $;
        function T({ required: z }) {
          return Array.isArray(z) && z.includes(S);
        }
        function q(z, U) {
          if (z.const)
            D(z.const, U);
          else if (z.enum)
            for (const B of z.enum)
              D(B, U);
          else
            throw new Error(`discriminator: "properties/${S}" must have "const" or "enum"`);
        }
        function D(z, U) {
          if (typeof z != "string" || z in $)
            throw new Error(`discriminator: "${S}" values must be unique strings`);
          $[z] = U;
        }
      }
    }
  };
  return Rt.default = o, Rt;
}
const ds = "http://json-schema.org/draft-07/schema#", hs = "http://json-schema.org/draft-07/schema#", fs = "Core schema meta-schema", ps = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, ms = ["object", "boolean"], ys = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, gs = {
  $schema: ds,
  $id: hs,
  title: fs,
  definitions: ps,
  type: ms,
  properties: ys,
  default: !0
};
var Rn;
function vs() {
  return Rn || (Rn = 1, (function(s, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Ai(), r = cs(), n = us(), i = gs, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((S) => this.addVocabulary(S)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const S = this.opts.$data ? this.$dataMetaSchema(i, o) : i;
        this.addMetaSchema(S, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = c, s.exports = e = c, s.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
    var u = zt();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var d = W();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return d._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return d.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return d.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return d.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return d.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return d.CodeGen;
    } });
    var g = nr();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return g.default;
    } });
    var _ = Vt();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(He, He.exports)), He.exports;
}
var bs = vs();
const ws = /* @__PURE__ */ di(bs), $s = "http://json-schema.org/draft-07/schema#", _s = "JMON Composition (Multi-Track, Extended)", Ss = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values use numeric format in quarter notes (e.g., 4.5) for MIDI compatibility and algorithmic processing. The bars:beats:ticks format is available for display and conversion purposes only.", Ps = "object", Es = ["format", "version", "bpm", "tracks"], Ms = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 8.0 for beat 1 of bar 3 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '2:0:0')."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 16.0 for beat 1 of bar 5 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '4:0:0')."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"number","description":"Offset in quarter notes for when playback should start (e.g., 2.0 for beat 3)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0')."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"oneOf":[{"type":"number","description":"End time in quarter notes where the global loop should end (e.g., 32.0 for bar 9 in 4/4)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '8:0:0')."}],"description":"Where the global loop should end."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 4.5 for beat 1.5 of bar 2 in 4/4). Primary format for MIDI compatibility."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0', '1:3.5:240')."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Ts = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, ks = !1, As = {
  $schema: $s,
  title: _s,
  description: Ss,
  type: Ps,
  required: Es,
  properties: Ms,
  definitions: Ts,
  additionalProperties: ks
};
function Ns(s) {
  const e = typeof s == "string" ? parseInt(s, 10) : s;
  if (!Number.isFinite(e)) return String(s);
  const r = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(e % 12 + 12) % 12], n = Math.floor(e / 12) - 1;
  return `${r}${n}`;
}
function Vn(s) {
  return !s || !Array.isArray(s.audioGraph) || s.audioGraph.forEach((e) => {
    try {
      if (!e || e.type !== "Sampler") return;
      const t = e.options || {}, r = t.urls;
      if (!r || typeof r != "object") return;
      const n = {};
      Object.keys(r).forEach((i) => {
        const o = String(i);
        let a = o;
        /^\d+$/.test(o) && (a = Ns(parseInt(o, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), s;
}
class or {
  constructor(e = As) {
    this.ajv = new ws({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e));
    Vn(t);
    const r = this.validate(t);
    return {
      valid: r,
      errors: this.validate.errors || null,
      normalized: r ? t : null
    };
  }
  /**
   * Utilitaire pour obtenir une version toujours "propre" (valide ou corrigée)
   * @param {Object} jmonObj
   * @returns {Object} normalized JMON (ou null si non réparable)
   */
  getValidJmon(e) {
    const { valid: t, normalized: r } = this.validateAndNormalize(e);
    return t ? r : null;
  }
}
class ue {
  static chromatic_scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  static flat_to_sharp = {
    Bb: "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    "B♭": "A#",
    "D♭": "C#",
    "E♭": "D#",
    "G♭": "F#",
    "A♭": "G#",
    "B-": "A#",
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#"
  };
  static scale_intervals = {
    major: [0, 2, 4, 5, 7, 9, 11],
    // Ionian
    minor: [0, 2, 3, 5, 7, 8, 10],
    // Aeolian
    diminished: [0, 2, 3, 5, 6, 8, 9, 11],
    "major pentatonic": [0, 2, 4, 7, 9],
    "minor pentatonic": [0, 3, 5, 7, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
    "harmonic minor": [0, 2, 3, 5, 7, 8, 11],
    "melodic minor ascending": [0, 2, 3, 5, 7, 9, 11],
    "melodic minor descending": [0, 2, 3, 5, 7, 8, 10]
    // same as natural minor
  };
  static intervals = {
    P1: 0,
    m2: 1,
    M2: 2,
    m3: 3,
    M3: 4,
    P4: 5,
    P5: 7,
    m6: 8,
    M6: 9,
    m7: 10,
    M7: 11,
    P8: 12
  };
  /**
   * Convert flat notes to their equivalent sharp notes
   * @param {string} note - The note to convert
   * @returns {string} The converted note or original if no conversion needed
   */
  static convertFlatToSharp(e) {
    return this.flat_to_sharp[e] || e;
  }
  /**
   * Convert note name with octave to MIDI number
   * @param {string} noteName - Note name with octave (e.g. 'C4', 'F#5', 'Bb3')
   * @returns {number} MIDI note number
   */
  static noteNameToMidi(e) {
    const t = e.match(/^([A-G][#b♭-]?)(-?\d+)$/);
    if (!t)
      throw new Error(`Invalid note name format: ${e}`);
    const [, r, n] = t, i = this.convertFlatToSharp(r), o = this.chromatic_scale.indexOf(i);
    if (o === -1)
      throw new Error(`Invalid note name: ${r}`);
    return o + (parseInt(n) + 1) * 12;
  }
  /**
   * Convert MIDI number to note name
   * @param {number} midiNumber - MIDI note number
   * @param {boolean} [preferFlat=false] - Whether to prefer flat notation
   * @returns {string} Note name with octave (e.g. 'C4', 'F#5')
   */
  static midiToNoteName(e, t = !1) {
    const r = Math.floor(e / 12) - 1, n = e % 12;
    return `${this.chromatic_scale[n]}${r}`;
  }
  /**
   * Returns the intervals for a triad based on the given scale intervals
   * @param {Array} scale - Scale intervals
   * @returns {Array} Triad intervals [root, third, fifth]
   */
  static scaleToTriad(e) {
    return [e[0], e[2], e[4]];
  }
}
class Fn {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = ue.convertFlatToSharp(e);
    if (!ue.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${ue.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(ue.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(ue.scale_intervals).join(", ")}'.`);
    this.mode = t;
  }
  /**
  * Generate a scale with flexible start/end points
  * @param {Object} options - Configuration object
  * @param {number|string} [options.start] - Starting MIDI note number or note name (e.g. 'C4')
  * @param {number|string} [options.end] - Ending MIDI note number or note name
  * @param {number} [options.length] - Number of notes to generate
  * @returns {Array} Array of MIDI note numbers representing the scale
  */
  generate(e = {}) {
    const t = ue.scale_intervals[this.mode];
    if (!t)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof e.start == "string" && (e.start = ue.noteNameToMidi(e.start)), typeof e.end == "string" && (e.end = ue.noteNameToMidi(e.end));
    const r = e.start ?? 60;
    if (ue.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const i = (a, c) => {
      const u = c % t.length, d = Math.floor(c / t.length) * 12, g = t[u];
      return a + g + d;
    }, o = [];
    if (e.end !== void 0)
      for (let a = 0; ; a++) {
        const c = i(r, a);
        if (c > e.end) break;
        o.push(c);
      }
    else if (e.length)
      for (let a = 0; a < e.length; a++)
        o.push(i(r, a));
    else
      return t.map((a) => r + a);
    return o;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const e = ue.scale_intervals[this.mode];
    if (!e) return [];
    const t = ue.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const n = (t + r) % 12;
      return ue.chromatic_scale[n];
    });
  }
  /**
   * Check if a given pitch is in the scale
   * @param {number} pitch - MIDI note number
   * @returns {boolean} True if the pitch class is in the scale
   */
  isInScale(e) {
    const t = e % 12;
    return this.generate().map((n) => n % 12).includes(t);
  }
}
function Rs(s) {
  if (typeof s == "object" && !Array.isArray(s))
    return s;
  if (Array.isArray(s)) {
    if (s.length === 0)
      return {};
    if (s.every((t) => Array.isArray(t) && t.length === 3))
      return { "track 1": s };
    const e = {};
    return s.forEach((t, r) => {
      e[`track ${r + 1}`] = t;
    }), e;
  }
  throw new Error("Input must be a list or dict of tracks.");
}
function Ln(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function Un(s) {
  return Math.floor(s / 12) - 1;
}
function Cs(s) {
  return {
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#",
    "B-": "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#"
  }[s] || s;
}
function rr(s, e, t) {
  typeof s == "string" && (s = Be(s)), typeof t == "string" && (t = Be(t));
  const r = e.indexOf(t);
  if (e.includes(s))
    return e.indexOf(s) - r;
  {
    const n = Ln(s, e), i = e.indexOf(n), o = i > 0 ? i - 1 : i, a = e[o], c = n - s, u = s - a, d = c + u;
    if (d === 0) return i - r;
    const g = 1 - c / d, _ = 1 - u / d, w = i - r, S = o - r;
    return w * g + S * _;
  }
}
function js(s, e, t) {
  const r = e.indexOf(t), n = Math.round(r + s);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), o = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], c = e[o], u = o - n, d = n - i, g = u + d;
    if (g === 0)
      return (c + a) / 2;
    const _ = 1 - u / g, w = 1 - d / g;
    return c * _ + a * w;
  }
}
function Bn(s) {
  s.length > 0 && s[0].length === 2 && (s = s.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of s)
    e.push([r, n, t]), t += n;
  return e;
}
function Gn(s, e = 0) {
  const t = [...s].sort((i, o) => i[2] - o[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [o, a, c] = i, u = e + c;
    if (u > r) {
      const g = [null, u - r, r - e];
      n.push(g);
    }
    n.push(i), r = Math.max(r, u + a);
  }
  return n;
}
function Kn(s) {
  s.sort((e, t) => e[2] - t[2]);
  for (let e = 0; e < s.length - 1; e++) {
    const t = s[e], r = s[e + 1];
    if (t[2] + t[1] > r[2]) {
      const i = r[2] - t[2];
      s[e] = [t[0], i, t[2]];
    }
  }
  return s;
}
function Is(s) {
  return Kn(Gn(s));
}
function Be(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B"
  };
  let r = 4, n = s;
  if (s.includes("b")) {
    const a = s.slice(0, -1);
    t[a] && (n = t[a] + s.slice(-1));
  }
  let i;
  return n.length > 2 || n.length === 2 && !isNaN(n[1]) ? (i = n.slice(0, -1), r = parseInt(n.slice(-1))) : i = n[0], 12 * (r + 1) + e.indexOf(i);
}
function qs(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(s / 12) - 1, r = s % 12;
  return e[r] + t.toString();
}
function Os(s, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, o] of s)
    t.push([n, i, r]), r += i;
  return t;
}
function xs(s) {
  return s.every((e) => Array.isArray(e)) ? "list of tuples" : s.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function Ds(s, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...s), o = n !== null ? n : Math.max(...s);
  return i === o ? new Array(s.length).fill((e + t) / 2) : s.map(
    (a) => (a - i) * (t - e) / (o - i) + e
  );
}
function Jn(s, e) {
  return s.map(([t, r, n]) => [t, r, n + e]);
}
function zs(s, e, t) {
  const r = [];
  for (const [n, i, o] of s) {
    const a = Math.round(o / t) * t, c = (Math.floor(a / e) + 1) * e;
    let u = Math.round(i / t) * t;
    u = Math.min(u, c - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function Vs(s, e) {
  const r = s.filter(([a, , c]) => a !== null && c !== null).sort((a, c) => a[2] - c[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, o = [];
  for (let a = 0; a < i; a++) {
    const c = a * e;
    let u = null, d = 1 / 0;
    for (const [g, , _] of r) {
      const w = c - _;
      if (w >= 0 && w < d && (d = w, u = g), _ > c) break;
    }
    u !== null && o.push(u);
  }
  return o;
}
function Fs(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function Ls(s, e) {
  return 60 / e * s;
}
function* Us(s = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * s, [s, e] = [e, s + e];
}
function Bs(s, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(s)) {
    const o = [];
    for (let a = 0; a < e; a++) {
      const c = a * t, u = Jn(i, c);
      o.push(...u);
    }
    r[n] = o;
  }
  return r;
}
const Gs = {
  "Acoustic Grand Piano": 0,
  "Bright Acoustic Piano": 1,
  "Electric Grand Piano": 2,
  "Honky-tonk Piano": 3,
  "Electric Piano 1": 4,
  "Electric Piano 2": 5,
  Harpsichord: 6,
  Clavinet: 7,
  // ... (full mapping truncated for brevity, but would include all 128 instruments)
  Gunshot: 127
}, Ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: Kn,
  cdeToMidi: Be,
  checkInput: xs,
  fibonacci: Us,
  fillGapsWithRests: Gn,
  findClosestPitchAtMeasureStart: Vs,
  getDegreeFromPitch: rr,
  getOctave: Un,
  getPitchFromDegree: js,
  getSharp: Cs,
  instrumentMapping: Gs,
  midiToCde: qs,
  noOverlap: Os,
  offsetTrack: Jn,
  qlToSeconds: Ls,
  quantizeNotes: zs,
  repairNotes: Is,
  repeatPolyloops: Bs,
  roundToList: Ln,
  scaleList: Ds,
  setOffsetsAccordingToDurations: Bn,
  tracksToDict: Rs,
  tune: Fs
}, Symbol.toStringTag, { value: "Module" }));
class Js extends ue {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = Be(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
      throw new Error(`Select a circleOf among ${Object.keys(this.intervals).join(", ")}.`);
    if (!["chords", "pitches"].includes(this.type))
      throw new Error("Type must either be 'pitches' or 'chords'.");
  }
  /**
   * Compute chords based on the circle of fifths, thirds, etc., within the specified radius
   * @returns {Object} Object containing major, minor, and diminished chord roots
   */
  computeCircle() {
    const e = this.intervals[this.circleOf], t = [this.tonicMidi];
    for (let r = 0; r < Math.max(...this.radius); r++) {
      const n = (t[t.length - 1] + e) % 12 + Math.floor(t[t.length - 1] / 12) * 12;
      t.push(n);
    }
    return {
      major: t.slice(0, this.radius[0]),
      minor: t.slice(0, this.radius[1]),
      diminished: t.slice(0, this.radius[2])
    };
  }
  /**
   * Generate a chord based on root MIDI note and chord type
   * @param {number} rootNoteMidi - The root MIDI note of the chord
   * @param {string} chordType - The type of chord ('major', 'minor', 'diminished')
   * @returns {Array} Array of MIDI notes representing the chord
   */
  generateChord(e, t) {
    return ({
      major: [0, 4, 7],
      minor: [0, 3, 7],
      diminished: [0, 3, 6]
    }[t] || [0, 4, 7]).map((o) => e + o).map((o) => o > 127 ? o - 12 : o);
  }
  /**
   * Generate a musical progression
   * @param {number} length - The length of the progression in number of chords (default: 4)
   * @param {number} seed - The seed value for the random number generator
   * @returns {Array} Array of chord arrays representing the progression
   */
  generate(e = 4, t = null) {
    t !== null && (Math.seedrandom = t);
    const { major: r, minor: n, diminished: i } = this.computeCircle(), o = [r, n, i], a = ["major", "minor", "diminished"], c = [];
    for (let u = 0; u < e; u++) {
      const d = this.weightedRandomChoice(this.weights);
      if (o[d].length > 0) {
        const g = o[d][Math.floor(Math.random() * o[d].length)], _ = a[d], w = Array.isArray(g) ? g[0] : g, S = this.generateChord(w, _);
        c.push(S);
      }
    }
    return c;
  }
  /**
   * Weighted random choice helper
   * @param {Array} weights - Array of weights
   * @returns {number} Selected index
   */
  weightedRandomChoice(e) {
    const t = e.reduce((n, i) => n + i, 0);
    let r = Math.random() * t;
    for (let n = 0; n < e.length; n++)
      if (r -= e[n], r <= 0)
        return n;
    return e.length - 1;
  }
}
class Hs extends ue {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new Fn(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = Un(e), r = this.tonic + t.toString(), n = Be(r), i = this.scale.map((c) => rr(c, this.scale, n)), o = Math.round(rr(e, this.scale, n)), a = [];
    for (const c of this.degrees) {
      const u = o + c, d = i.indexOf(u);
      d !== -1 && a.push(this.scale[d]);
    }
    return a;
  }
  /**
   * Generate chords or arpeggios based on the given notes
   * @param {Array} notes - The notes to generate chords or arpeggios from
   * @param {Array} durations - The durations of each note (optional)
   * @param {boolean} arpeggios - If true, generate arpeggios instead of chords (default: false)
   * @returns {Array} The generated chords or arpeggios
   */
  generate(e, t = null, r = !1) {
    if (!Array.isArray(e) || e.length === 0)
      return [];
    let n = e;
    if (typeof e[0] == "number") {
      t === null && (t = [1]);
      let o = 0, a = 0;
      n = e.map((c) => {
        const u = t[o % t.length], d = [c, u, a];
        return a += u, o++, d;
      });
    }
    const i = n.map(([o, a, c]) => [this.pitchToChord(o), a, c]);
    if (r) {
      const o = [];
      for (const [a, c, u] of i) {
        const d = c / a.length;
        a.forEach((g, _) => {
          o.push([g, d, u + _ * d]);
        });
      }
      return o;
    } else
      return i;
  }
}
const Cn = {
  grace_note: {
    requiredParams: ["graceNoteType"],
    optionalParams: ["gracePitches"],
    conflicts: [],
    description: "Single note before the main note",
    defaultParams: {
      graceNoteType: "acciaccatura"
    },
    validate: (s, e) => ["acciaccatura", "appoggiatura"].includes(e.graceNoteType) ? e.gracePitches && !Array.isArray(e.gracePitches) ? { valid: !1, error: "gracePitches must be an array of pitches" } : { valid: !0 } : { valid: !1, error: "graceNoteType must be either acciaccatura or appoggiatura" }
  },
  trill: {
    requiredParams: [],
    optionalParams: ["by", "trillRate"],
    conflicts: ["mordent"],
    minDuration: "8n",
    description: "Rapid alternation between main note and auxiliary note",
    defaultParams: {
      by: 1,
      trillRate: 0.125
    },
    validate: (s, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "trill step (by) must be a number" } : e.trillRate && typeof e.trillRate != "number" ? { valid: !1, error: "trillRate must be a number" } : { valid: !0 }
  },
  mordent: {
    requiredParams: [],
    optionalParams: ["by"],
    conflicts: ["trill"],
    description: "Quick alternation with note above or below",
    defaultParams: {
      by: 1
    },
    validate: (s, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "mordent step (by) must be a number" } : { valid: !0 }
  },
  turn: {
    requiredParams: [],
    optionalParams: ["scale"],
    conflicts: [],
    description: "Melodic turn around the main note",
    validate: (s, e) => e.scale && typeof e.scale != "string" ? { valid: !1, error: "scale must be a string" } : { valid: !0 }
  },
  arpeggio: {
    requiredParams: ["arpeggioDegrees"],
    optionalParams: ["direction"],
    conflicts: [],
    description: "Notes played in sequence",
    defaultParams: {
      direction: "up"
    },
    validate: (s, e) => Array.isArray(e.arpeggioDegrees) ? e.direction && !["up", "down", "both"].includes(e.direction) ? { valid: !1, error: "direction must be up, down, or both" } : { valid: !0 } : { valid: !1, error: "arpeggioDegrees must be an array" }
  }
};
class ar {
  /**
   * Validate ornament parameters and compatibility
   * @param {Object} note - The note to apply the ornament to
   * @param {string} type - The type of ornament
   * @param {Object} params - Parameters for the ornament
   * @returns {Object} Validation result with success status and any messages
   */
  static validateOrnament(e, t, r = {}) {
    const n = {
      valid: !1,
      warnings: [],
      errors: []
    }, i = Cn[t];
    if (!i)
      return n.errors.push(`Unknown ornament type: ${t}`), n;
    if (i.requiredParams) {
      for (const o of i.requiredParams)
        if (!(o in r))
          return n.errors.push(`Missing required parameter '${o}' for ${t}`), n;
    }
    if (i.minDuration && n.warnings.push(`Duration check not implemented for ${t}`), e.ornaments && i.conflicts) {
      const o = e.ornaments.filter((a) => i.conflicts.includes(a.type)).map((a) => a.type);
      if (o.length > 0)
        return n.errors.push(`${t} conflicts with existing ornaments: ${o.join(", ")}`), n;
    }
    if (i.validate) {
      const o = i.validate(e, r);
      if (!o.valid)
        return n.errors.push(o.error), n;
    }
    return n.valid = !0, n;
  }
  /**
   * Create a new ornament instance with validation
   * @param {Object} options - Ornament configuration
   */
  constructor(e) {
    const t = Cn[e.type];
    if (!t)
      throw new Error(`Unknown ornament type: ${e.type}`);
    this.type = e.type, this.params = {
      ...t.defaultParams,
      ...e.parameters
    }, e.tonic && e.mode ? (this.tonicIndex = ue.chromatic_scale.indexOf(e.tonic), this.scale = this.generateScale(e.tonic, e.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(e, t) {
    const r = ue.scale_intervals[t], n = ue.chromatic_scale.indexOf(e), i = r.map((a) => (n + a) % 12), o = [];
    for (let a = -1; a < 10; a++)
      for (const c of i) {
        const u = 12 * a + c;
        u >= 0 && u <= 127 && o.push(u);
      }
    return o;
  }
  /**
   * Apply the ornament to notes
   */
  apply(e, t = null) {
    if (!Array.isArray(e) || e.length === 0 || (t === null && (t = Math.floor(Math.random() * e.length)), t < 0 || t >= e.length))
      return e;
    const r = e[t], n = ar.validateOrnament(r, this.type, this.params);
    if (!n.valid)
      return console.warn(`Ornament validation failed: ${n.errors.join(", ")}`), e;
    switch (this.type) {
      case "grace_note":
        return this.addGraceNote(e, t);
      case "trill":
        return this.addTrill(e, t);
      case "mordent":
        return this.addMordent(e, t);
      case "turn":
        return this.addTurn(e, t);
      case "arpeggio":
        return this.addArpeggio(e, t);
      default:
        return e;
    }
  }
  /**
   * Add a grace note
   */
  addGraceNote(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, o = r.time, a = this.params.gracePitches ? this.params.gracePitches[Math.floor(Math.random() * this.params.gracePitches.length)] : n + 1;
    if (this.params.graceNoteType === "acciaccatura") {
      const c = i * 0.125, u = { pitch: n, duration: i, time: o + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: o },
        u,
        ...e.slice(t + 1)
      ];
    } else {
      const c = i / 2, u = { pitch: n, duration: c, time: o + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: o },
        u,
        ...e.slice(t + 1)
      ];
    }
  }
  /**
   * Add a trill
   */
  addTrill(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, o = r.time, a = [];
    let c = o;
    const u = this.params.by || 1, d = this.params.trillRate || 0.125;
    let g;
    if (this.scale && this.scale.includes(n)) {
      const w = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      g = this.scale[w];
    } else
      g = n + u;
    for (; c < o + i; ) {
      const _ = o + i - c, w = Math.min(d, _ / 2);
      if (_ >= w * 2)
        a.push({ pitch: n, duration: w, time: c }), a.push({ pitch: g, duration: w, time: c + w }), c += 2 * w;
      else
        break;
    }
    return [
      ...e.slice(0, t),
      ...a,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a mordent
   */
  addMordent(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, o = r.time, a = this.params.by || 1;
    let c;
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n) + Math.round(a);
      c = this.scale[_] || n + a;
    } else
      c = n + a;
    const u = i / 3, d = [
      { pitch: n, duration: u, time: o },
      { pitch: c, duration: u, time: o + u },
      { pitch: n, duration: u, time: o + 2 * u }
    ];
    return [
      ...e.slice(0, t),
      ...d,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a turn
   */
  addTurn(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, o = r.time, a = i / 4;
    let c, u;
    if (this.scale && this.scale.includes(n)) {
      const g = this.scale.indexOf(n);
      c = this.scale[g + 1] || n + 2, u = this.scale[g - 1] || n - 2;
    } else
      c = n + 2, u = n - 2;
    const d = [
      { pitch: n, duration: a, time: o },
      { pitch: c, duration: a, time: o + a },
      { pitch: n, duration: a, time: o + 2 * a },
      { pitch: u, duration: a, time: o + 3 * a }
    ];
    return [
      ...e.slice(0, t),
      ...d,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add an arpeggio
   */
  addArpeggio(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, o = r.time, { arpeggioDegrees: a, direction: c = "up" } = this.params;
    if (!a || !Array.isArray(a))
      return e;
    const u = [];
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n);
      u.push(...a.map((w) => this.scale[_ + w] || n + w));
    } else
      u.push(...a.map((_) => n + _));
    c === "down" && u.reverse(), c === "both" && u.push(...u.slice(0, -1).reverse());
    const d = i / u.length, g = u.map((_, w) => ({
      pitch: _,
      duration: d,
      time: o + w * d
    }));
    return [
      ...e.slice(0, t),
      ...g,
      ...e.slice(t + 1)
    ];
  }
}
const Zt = {
  // Simple articulations
  staccato: {
    complex: !1,
    description: "Shortens note duration to ~50%"
  },
  accent: {
    complex: !1,
    description: "Increases note velocity/emphasis"
  },
  tenuto: {
    complex: !1,
    description: "Holds note for full duration with emphasis"
  },
  legato: {
    complex: !1,
    description: "Smooth connection between notes"
  },
  marcato: {
    complex: !1,
    description: "Strong accent with slight separation"
  },
  // Complex articulations
  glissando: {
    complex: !0,
    requiredParams: ["target"],
    description: "Smooth slide from note to target pitch"
  },
  portamento: {
    complex: !0,
    requiredParams: ["target"],
    optionalParams: ["curve", "speed"],
    description: "Expressive slide between pitches"
  },
  bend: {
    complex: !0,
    requiredParams: ["amount"],
    optionalParams: ["curve", "returnToOriginal"],
    description: "Pitch bend up or down in cents"
  },
  vibrato: {
    complex: !0,
    optionalParams: ["rate", "depth", "delay"],
    description: "Periodic pitch variation"
  },
  tremolo: {
    complex: !0,
    optionalParams: ["rate", "depth"],
    description: "Rapid volume variation"
  },
  crescendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume increase"
  },
  diminuendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume decrease"
  }
};
class Ft {
  /**
   * Add articulation to a note in a sequence
   * @param {Array} sequence - The note sequence
   * @param {string} articulationType - Type of articulation
   * @param {number} noteIndex - Index of note to articulate
   * @param {Object} params - Parameters for complex articulations
   * @returns {Object} Result with success status and any warnings
   */
  static addArticulation(e, t, r, n = {}) {
    const i = {
      success: !1,
      warnings: [],
      errors: []
    };
    if (!Array.isArray(e))
      return i.errors.push("Sequence must be an array"), i;
    if (r < 0 || r >= e.length)
      return i.errors.push(`Note index ${r} out of bounds (sequence length: ${e.length})`), i;
    const o = Zt[t];
    if (!o)
      return i.errors.push(`Unknown articulation type: ${t}`), i;
    const a = e[r];
    return !a || typeof a != "object" ? (i.errors.push(`Invalid note at index ${r}`), i) : o.complex ? this._addComplexArticulation(a, t, o, n, i) : (a.articulation = t, i.success = !0, i);
  }
  /**
   * Add complex articulation with parameter validation and synchronization
   */
  static _addComplexArticulation(e, t, r, n, i) {
    if (r.requiredParams) {
      for (const o of r.requiredParams)
        if (!(o in n))
          return i.errors.push(`Missing required parameter '${o}' for ${t}`), i;
    }
    switch (t) {
      case "glissando":
      case "portamento":
        return this._applyGlissando(e, t, n, i);
      case "bend":
        return this._applyBend(e, n, i);
      case "vibrato":
        return this._applyVibrato(e, n, i);
      case "tremolo":
        return this._applyTremolo(e, n, i);
      case "crescendo":
      case "diminuendo":
        return this._applyDynamicChange(e, t, n, i);
      default:
        return i.errors.push(`Complex articulation ${t} not implemented`), i;
    }
  }
  /**
   * Apply glissando/portamento articulation
   */
  static _applyGlissando(e, t, r, n) {
    e.articulation = t, e.glissTarget = r.target, e.modulations || (e.modulations = []);
    const i = {
      type: "pitch",
      subtype: t,
      target: r.target,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return r.speed !== void 0 && (i.speed = r.speed), e.modulations = e.modulations.filter(
      (o) => !(o.type === "pitch" && o.subtype === t)
    ), e.modulations.push(i), n.success = !0, n.warnings.push(`Added ${t} modulation synchronized with articulation`), n;
  }
  /**
   * Apply pitch bend articulation
   */
  static _applyBend(e, t, r) {
    e.articulation = "bend", e.modulations || (e.modulations = []);
    const n = {
      type: "pitch",
      subtype: "bend",
      amount: t.amount,
      // in cents
      curve: t.curve || "linear",
      timing: t.returnToOriginal ? "note_duration" : "sustain",
      returnToOriginal: t.returnToOriginal ?? !0
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "pitch" && i.subtype === "bend")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added pitch bend modulation synchronized with articulation"), r;
  }
  /**
   * Apply vibrato articulation
   */
  static _applyVibrato(e, t, r) {
    e.articulation = "vibrato", e.modulations || (e.modulations = []);
    const n = {
      type: "pitch",
      subtype: "vibrato",
      rate: t.rate || 5,
      // Hz
      depth: t.depth || 50,
      // cents
      delay: t.delay || 0,
      // seconds
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "pitch" && i.subtype === "vibrato")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added vibrato modulation synchronized with articulation"), r;
  }
  /**
   * Apply tremolo articulation
   */
  static _applyTremolo(e, t, r) {
    e.articulation = "tremolo", e.modulations || (e.modulations = []);
    const n = {
      type: "amplitude",
      subtype: "tremolo",
      rate: t.rate || 8,
      // Hz
      depth: t.depth || 0.3,
      // 0-1
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "amplitude" && i.subtype === "tremolo")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added tremolo modulation synchronized with articulation"), r;
  }
  /**
   * Apply dynamic change (crescendo/diminuendo)
   */
  static _applyDynamicChange(e, t, r, n) {
    e.articulation = t, e.modulations || (e.modulations = []);
    const i = {
      type: "amplitude",
      subtype: t,
      startVelocity: e.velocity || 0.8,
      endVelocity: r.endVelocity,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (o) => !(o.type === "amplitude" && (o.subtype === "crescendo" || o.subtype === "diminuendo"))
    ), e.modulations.push(i), n.success = !0, n.warnings.push(`Added ${t} modulation synchronized with articulation`), n;
  }
  /**
   * Remove articulation from a note
   */
  static removeArticulation(e, t) {
    if (!Array.isArray(e) || t < 0 || t >= e.length)
      return { success: !1, error: "Invalid sequence or note index" };
    const r = e[t];
    if (!r || typeof r != "object")
      return { success: !1, error: "Invalid note" };
    const n = r.articulation;
    if (delete r.articulation, delete r.glissTarget, r.modulations && n) {
      const i = Zt[n];
      i && i.complex && (r.modulations = r.modulations.filter((o) => o.subtype !== n), r.modulations.length === 0 && delete r.modulations);
    }
    return {
      success: !0,
      removed: n,
      message: `Removed ${n} articulation and related modulations`
    };
  }
  /**
   * Validate articulation consistency in a sequence
   */
  static validateSequence(e) {
    const t = [];
    return e.forEach((r, n) => {
      if (r.articulation) {
        const i = this.ARTICULATION_TYPES[r.articulation];
        if (!i) {
          t.push({
            type: "unknown_articulation",
            noteIndex: n,
            articulation: r.articulation,
            message: `Unknown articulation type: ${r.articulation}`
          });
          return;
        }
        r.articulation === "glissando" && !r.glissTarget && t.push({
          type: "missing_parameter",
          noteIndex: n,
          articulation: r.articulation,
          message: "Glissando missing glissTarget parameter"
        }), i.complex && r.modulations && (r.modulations.some(
          (a) => a.subtype === r.articulation
        ) || t.push({
          type: "modulation_sync",
          noteIndex: n,
          articulation: r.articulation,
          message: `Complex articulation ${r.articulation} should have corresponding modulation`
        }));
      }
    }), {
      valid: t.length === 0,
      issues: t
    };
  }
  /**
   * Get available articulation types with descriptions
   */
  static getAvailableTypes() {
    return Object.entries(Zt).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function Hn(s, e, t, r) {
  return Ft.addArticulation(s, e, t, r);
}
function Wn(s, e) {
  return Ft.removeArticulation(s, e);
}
function Ws(s) {
  return Ft.validateSequence(s);
}
const Ys = Hn, Qs = Wn, Xs = {
  Scale: Fn,
  Progression: Js,
  Voice: Hs,
  Ornament: ar,
  Articulation: Ft,
  addArticulation: Hn,
  addOrnament: Ys,
  // Include the alias
  removeArticulation: Wn,
  removeOrnament: Qs,
  // Include the alias
  validateArticulations: Ws
};
class Zs {
  /**
   * Constructs all the necessary attributes for the Rhythm object
   * @param {number} measureLength - The length of the measure
   * @param {Array} durations - The durations of the notes
   */
  constructor(e, t) {
    this.measureLength = e, this.durations = t;
  }
  /**
   * Generate a random rhythm as a list of (duration, offset) tuples
   * @param {number} seed - Random seed for reproducibility
   * @param {number} restProbability - Probability of a rest (0-1)
   * @param {number} maxIter - Maximum number of iterations
   * @returns {Array} Array of [duration, offset] tuples representing the rhythm
   */
  random(e = null, t = 0, r = 100) {
    e !== null && (Math.seedrandom = e);
    const n = [];
    let i = 0, o = 0;
    for (; i < this.measureLength && o < r; ) {
      const a = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (i + a > this.measureLength) {
        o++;
        continue;
      }
      if (Math.random() < t) {
        o++;
        continue;
      }
      n.push([a, i]), i += a, o++;
    }
    return o >= r && console.warn("Max iterations reached. The sum of the durations may not equal the measure length."), n;
  }
  /**
   * Executes the Darwinian evolution algorithm to generate the best rhythm
   * @param {number} seed - Random seed for reproducibility
   * @param {number} populationSize - Number of rhythms in each generation
   * @param {number} maxGenerations - Maximum number of generations
   * @param {number} mutationRate - Probability of mutation (0-1)
   * @returns {Array} The best rhythm found after evolution
   */
  darwin(e = null, t = 10, r = 50, n = 0.1) {
    return new eo(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class eo {
  constructor(e, t, r, n, i, o) {
    e !== null && (Math.seedrandom = e), this.populationSize = t, this.measureLength = r, this.maxGenerations = n, this.mutationRate = i, this.durations = o, this.population = this.initializePopulation();
  }
  /**
   * Initialize a population of random rhythms
   */
  initializePopulation() {
    const e = [];
    for (let t = 0; t < this.populationSize; t++)
      e.push(this.createRandomRhythm());
    return e;
  }
  /**
   * Create a random rhythm ensuring it respects the measure length
   * @returns {Array} Array of [duration, offset] tuples
   */
  createRandomRhythm() {
    const e = [];
    let t = 0;
    for (; t < this.measureLength; ) {
      const r = this.measureLength - t, n = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (n <= r)
        e.push([n, t]), t += n;
      else
        break;
    }
    return e;
  }
  /**
   * Evaluate the fitness of a rhythm
   * @param {Array} rhythm - The rhythm to evaluate
   * @returns {number} Fitness score (lower is better)
   */
  evaluateFitness(e) {
    const t = e.reduce((r, n) => r + n[0], 0);
    return Math.abs(this.measureLength - t);
  }
  /**
   * Select a parent using simple random selection with fitness bias
   * @returns {Array} Selected parent rhythm
   */
  selectParent() {
    const e = this.population[Math.floor(Math.random() * this.population.length)], t = this.population[Math.floor(Math.random() * this.population.length)];
    return this.evaluateFitness(e) < this.evaluateFitness(t) ? e : t;
  }
  /**
   * Perform crossover between two parents
   * @param {Array} parent1 - First parent rhythm
   * @param {Array} parent2 - Second parent rhythm
   * @returns {Array} Child rhythm
   */
  crossover(e, t) {
    if (e.length === 0 || t.length === 0)
      return e.length > 0 ? [...e] : [...t];
    const r = Math.floor(Math.random() * (e.length - 1)) + 1, n = [...e.slice(0, r), ...t.slice(r)];
    return this.ensureMeasureLength(n);
  }
  /**
   * Ensure rhythm respects measure length
   * @param {Array} rhythm - The rhythm to adjust
   * @returns {Array} Adjusted rhythm
   */
  ensureMeasureLength(e) {
    return e.reduce((r, n) => r + n[0], 0) > this.measureLength && e.length > 0 && e.pop(), e;
  }
  /**
   * Mutate a rhythm with certain probability
   * @param {Array} rhythm - The rhythm to mutate
   * @returns {Array} Mutated rhythm
   */
  mutate(e) {
    if (Math.random() < this.mutationRate && e.length > 1) {
      const t = Math.floor(Math.random() * (e.length - 1)), [r, n] = e[t], o = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - n, a = this.durations.filter((c) => c <= o);
      if (a.length > 0) {
        const c = a[Math.floor(Math.random() * a.length)];
        e[t] = [c, n];
      }
    }
    return e;
  }
  /**
   * Execute the genetic algorithm
   * @returns {Array} Best rhythm found, sorted by offset
   */
  generate() {
    for (let t = 0; t < this.maxGenerations; t++) {
      const r = [];
      for (let n = 0; n < this.populationSize; n++) {
        const i = this.selectParent(), o = this.selectParent();
        let a = this.crossover(i, o);
        a = this.mutate(a), a.sort((c, u) => c[1] - u[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function Se(s, e = 4, t = 480) {
  const r = Math.floor(s / e), n = s - r * e, i = Math.floor(n), o = n - i, a = Math.round(o * t);
  return `${r}:${i}:${a}`;
}
function De(s, e = 4, t = 480) {
  if (typeof s == "number") return s;
  if (typeof s != "string") return 0;
  const r = s.split(":").map((a) => parseFloat(a || "0")), [n = 0, i = 0, o = 0] = r;
  return n * e + i + o / t;
}
function Yn(s, e = "Untitled Part", t = {}) {
  const r = cr(s);
  return {
    name: e,
    notes: r,
    ...t
  };
}
function to(s, e = {}) {
  const t = s.map((n, i) => Array.isArray(n) ? Yn(n, `Track ${i + 1}`) : n.name && n.notes ? {
    ...n,
    notes: cr(n.notes)
  } : n), r = {
    format: "jmon",
    version: "1.0",
    bpm: e.bpm || 120,
    keySignature: e.keySignature || "C",
    timeSignature: e.timeSignature || "4/4",
    tracks: t,
    ...e
  };
  return delete r.metadata?.bpm, delete r.metadata?.keySignature, delete r.metadata?.timeSignature, r;
}
function cr(s) {
  return Array.isArray(s) ? s.map((e, t) => {
    if (Array.isArray(e)) {
      const [r, n, i = 0] = e;
      return {
        pitch: r,
        duration: n,
        time: Se(i)
      };
    }
    if (typeof e == "object" && e !== null) {
      const { pitch: r, duration: n } = e;
      let i = "0:0:0";
      return typeof e.time == "string" ? i = e.time : typeof e.time == "number" ? i = Se(e.time) : typeof e.offset == "number" && (i = Se(e.offset)), {
        pitch: r,
        duration: n,
        time: i,
        // Preserve other properties
        ...Object.fromEntries(
          Object.entries(e).filter(
            ([o]) => !["time", "offset"].includes(o)
          )
        )
      };
    }
    return console.warn(`Unexpected note format at index ${t}:`, e), {
      pitch: 60,
      // Default to middle C
      duration: 1,
      time: "0:0:0"
    };
  }) : [];
}
function ro(s) {
  return s.map(([e, t, r = 0]) => ({
    pitch: e,
    duration: t,
    time: Se(r)
  }));
}
function no(s) {
  return s.map((e) => [
    e.pitch,
    e.duration,
    De(e.time)
  ]);
}
function io(s, e = 1, t = 0) {
  let r = t;
  return s.map((n) => {
    const i = {
      pitch: n,
      duration: e,
      time: Se(r)
    };
    return r += e, i;
  });
}
function Qn(s, e) {
  return s.map((t) => ({
    ...t,
    time: Se(De(t.time) + e)
  }));
}
function so(s) {
  if (s.length === 0) return [];
  const e = [];
  let t = 0;
  for (const r of s) {
    const n = Qn(r, t);
    e.push(...n);
    const i = n.map(
      (o) => De(o.time) + o.duration
    );
    t = Math.max(...i, t);
  }
  return e;
}
function oo(s) {
  return s.flat();
}
function ao(s) {
  if (s.length === 0) return { start: 0, end: 0, duration: 0 };
  const e = s.map((i) => De(i.time)), t = s.map((i) => De(i.time) + i.duration), r = Math.min(...e), n = Math.max(...t);
  return {
    start: r,
    end: n,
    duration: n - r,
    startTime: Se(r),
    endTime: Se(n)
  };
}
const co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: Se,
  combineSequences: oo,
  concatenateSequences: so,
  createComposition: to,
  createPart: Yn,
  createScale: io,
  getTimingInfo: ao,
  jmonToTuples: no,
  normalizeNotes: cr,
  offsetNotes: Qn,
  timeToBeats: De,
  tuplesToJmon: ro
}, Symbol.toStringTag, { value: "Module" }));
function lo(s, e, t = {}) {
  const r = s.map((u) => Array.isArray(u) || typeof u == "object" && u.length ? u[0] : u), n = uo(r.length, e.length), i = [], o = [];
  for (let u = 0; u < n; u++)
    i.push(r[u % r.length]), o.push(e[u % e.length]);
  const a = i.map((u, d) => [u, o[d], 1]), c = Bn(a);
  return t.legacy ? c : c.map(([u, d, g]) => ({
    pitch: u,
    duration: d,
    time: t.useStringTime ? Se(g) : g
  }));
}
function uo(s, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(s * e) / t(s, e);
}
function ho(s, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of s) {
    const o = e[n % e.length];
    t.push([i, o, r]), r += o, n++;
  }
  return t;
}
const fo = {
  Rhythm: Zs,
  isorhythm: lo,
  beatcycle: ho
};
class po {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class _e {
  data;
  // rows: number;
  // columns: number;
  constructor(e, t) {
    if (typeof e == "number") {
      if (t === void 0)
        throw new Error("Columns parameter required when creating matrix from dimensions");
      this.rows = e, this.columns = t, this.data = Array(this.rows).fill(0).map(() => Array(this.columns).fill(0));
    } else
      this.data = e.map((r) => [...r]), this.rows = this.data.length, this.columns = this.data[0]?.length || 0;
  }
  static zeros(e, t) {
    return new _e(e, t);
  }
  static from2DArray(e) {
    return new _e(e);
  }
  get(e, t) {
    if (e < 0 || e >= this.rows || t < 0 || t >= this.columns)
      throw new Error(`Index out of bounds: (${e}, ${t})`);
    return this.data[e][t];
  }
  set(e, t, r) {
    if (e < 0 || e >= this.rows || t < 0 || t >= this.columns)
      throw new Error(`Index out of bounds: (${e}, ${t})`);
    this.data[e][t] = r;
  }
  getRow(e) {
    if (e < 0 || e >= this.rows)
      throw new Error(`Row index out of bounds: ${e}`);
    return [...this.data[e]];
  }
  getColumn(e) {
    if (e < 0 || e >= this.columns)
      throw new Error(`Column index out of bounds: ${e}`);
    return this.data.map((t) => t[e]);
  }
  transpose() {
    const e = Array(this.columns).fill(0).map(() => Array(this.rows).fill(0));
    for (let t = 0; t < this.rows; t++)
      for (let r = 0; r < this.columns; r++)
        e[r][t] = this.data[t][r];
    return new _e(e);
  }
  clone() {
    return new _e(this.data);
  }
  toArray() {
    return this.data.map((e) => [...e]);
  }
}
function er(s) {
  return Array.isArray(s[0]) ? _e.from2DArray(s) : _e.from2DArray([s]);
}
function Xn(s) {
  if (s.rows !== s.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = s.rows, t = _e.zeros(e, e);
  for (let r = 0; r < e; r++)
    for (let n = 0; n <= r; n++)
      if (r === n) {
        let i = 0;
        for (let a = 0; a < n; a++)
          i += t.get(n, a) * t.get(n, a);
        const o = s.get(n, n) - i;
        if (o <= 0)
          throw new Error(`Matrix is not positive definite at position (${n}, ${n})`);
        t.set(n, n, Math.sqrt(o));
      } else {
        let i = 0;
        for (let o = 0; o < n; o++)
          i += t.get(r, o) * t.get(n, o);
        t.set(r, n, (s.get(r, n) - i) / t.get(n, n));
      }
  return t;
}
class mo {
  constructor(e = {}) {
    this.params = { ...e };
  }
  call(e, t) {
    const r = t || e, n = _e.zeros(e.rows, r.rows);
    for (let i = 0; i < e.rows; i++)
      for (let o = 0; o < r.rows; o++)
        n.set(i, o, this.compute(e.getRow(i), r.getRow(o)));
    return n;
  }
  // compute(x1, x2) { throw new Error('Not implemented'); }
  getParams() {
    return { ...this.params };
  }
  setParams(e) {
    Object.assign(this.params, e);
  }
  euclideanDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return Math.sqrt(r);
  }
  squaredEuclideanDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return r;
  }
}
class Zn {
  kernel;
  alpha;
  XTrain;
  yTrain;
  L;
  alphaVector;
  constructor(e, t = {}) {
    this.kernel = e, this.alpha = t.alpha || 1e-10;
  }
  fit(e, t) {
    this.XTrain = er(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = Xn(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = er(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      i[a] = 0;
      for (let c = 0; c < this.XTrain.rows; c++)
        i[a] += n.get(c, a) * this.alphaVector[c];
    }
    const o = { mean: i };
    if (t) {
      const a = this.computeStd(r, n);
      o.std = a;
    }
    return o;
  }
  sampleY(e, t = 1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before sampling");
    const r = er(e), n = this.predict(e, !0);
    if (!n.std)
      throw new Error("Standard deviation computation failed");
    const i = [];
    for (let o = 0; o < t; o++) {
      const a = new Array(r.rows);
      for (let c = 0; c < r.rows; c++) {
        const u = n.mean[c], d = n.std[c];
        a[c] = u + d * this.sampleStandardNormal();
      }
      i.push(a);
    }
    return i;
  }
  logMarginalLikelihood() {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before computing log marginal likelihood");
    let e = 0;
    for (let t = 0; t < this.yTrain.length; t++)
      e -= 0.5 * this.yTrain[t] * this.alphaVector[t];
    for (let t = 0; t < this.L.rows; t++)
      e -= Math.log(this.L.get(t, t));
    return e -= 0.5 * this.yTrain.length * Math.log(2 * Math.PI), e;
  }
  computeStd(e, t) {
    if (!this.L)
      throw new Error("Cholesky decomposition not available");
    const r = new Array(e.rows);
    for (let n = 0; n < e.rows; n++) {
      const i = this.kernel.compute(e.getRow(n), e.getRow(n)), o = t.getColumn(n), a = this.forwardSubstitution(this.L, o);
      let c = 0;
      for (let d = 0; d < a.length; d++)
        c += a[d] * a[d];
      const u = i - c;
      r[n] = Math.sqrt(Math.max(0, u));
    }
    return r;
  }
  solveCholesky(e, t) {
    const r = this.forwardSubstitution(e, t);
    return this.backSubstitution(e, r);
  }
  forwardSubstitution(e, t) {
    const r = e.rows, n = new Array(r);
    for (let i = 0; i < r; i++) {
      n[i] = t[i];
      for (let o = 0; o < i; o++)
        n[i] -= e.get(i, o) * n[o];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  backSubstitution(e, t) {
    const r = e.rows, n = new Array(r);
    for (let i = r - 1; i >= 0; i--) {
      n[i] = t[i];
      for (let o = i + 1; o < r; o++)
        n[i] -= e.get(o, i) * n[o];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  sampleStandardNormal() {
    const e = Math.random(), t = Math.random();
    return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * t);
  }
}
class jn extends mo {
  constructor(e = 1, t = 1) {
    super({ length_scale: e, variance: t }), this.lengthScale = e, this.variance = t;
  }
  compute(e, t) {
    const r = this.euclideanDistance(e, t);
    return this.variance * Math.exp(-0.5 * Math.pow(r / this.lengthScale, 2));
  }
  getParams() {
    return {
      length_scale: this.lengthScale,
      variance: this.variance
    };
  }
}
function yo(s = 0, e = 1) {
  const t = Math.random(), r = Math.random(), n = Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * r);
  return s + e * n;
}
function go(s, e) {
  const t = s.length, r = Xn(e), n = Array.from({ length: t }, () => yo()), i = new Array(t);
  for (let o = 0; o < t; o++) {
    i[o] = s[o];
    for (let a = 0; a <= o; a++)
      i[o] += r.get(o, a) * n[a];
  }
  return i;
}
const Pe = {
  timeSignature: [4, 4],
  // 4/4 time
  ticksPerQuarterNote: 480,
  // Standard MIDI resolution
  beatsPerBar: 4
  // Derived from time signature
};
function ze(s, e = Pe) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = n * 4 / i, a = Math.floor(s / o), c = s % o, u = Math.floor(c), d = c - u, g = Math.round(d * r);
  return `${a}:${u}:${g}`;
}
function lr(s, e = Pe) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = s.split(":");
  if (o.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${s}`);
  const a = parseInt(o[0], 10), c = parseFloat(o[1]), u = parseInt(o[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(u))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${s}`);
  const d = n * 4 / i;
  return a * d + c + u / r;
}
function vo(s, e = Pe, t = !0) {
  return s.map((r) => {
    const n = { ...r };
    if (r.offset !== void 0 && (n.time = r.offset, delete n.offset), typeof r.time == "string" && r.time.includes(":") && (n.time = lr(r.time, e)), typeof r.duration == "number" && !t) {
      const i = r.duration;
      i === 1 ? n.duration = "4n" : i === 0.5 ? n.duration = "8n" : i === 0.25 ? n.duration = "16n" : i === 2 ? n.duration = "2n" : i === 4 && (n.duration = "1n");
    }
    return n;
  });
}
function Ge(s, e = {}) {
  const {
    label: t = "track",
    midiChannel: r = 0,
    synth: n = { type: "Synth" },
    timingConfig: i = Pe,
    keepNumericDuration: o = !0
    // Default to numeric for MIDI consistency
  } = e, a = vo(s, i, o);
  return {
    label: t,
    midiChannel: r,
    synth: n,
    notes: a
  };
}
class bo {
  data;
  lengthScale;
  amplitude;
  noiseLevel;
  walkAround;
  timingConfig;
  isFitted;
  gpr;
  constructor(e = [], t = 1, r = 1, n = 0.1, i = !1, o = Pe) {
    this.data = [...e], this.lengthScale = t, this.amplitude = r, this.noiseLevel = n, this.walkAround = i, this.timingConfig = o, this.isFitted = !1, this.gpr = null;
  }
  generate(e = {}) {
    e.length, e.nsamples;
    const t = e.seed;
    return e.useStringTime, t !== void 0 && (Math.seedrandom = this.seededRandom(t)), this.data.length > 0 && Array.isArray(this.data[0]) ? this.generateFitted(e) : this.generateUnfitted(e);
  }
  /**
   * Generate from unfitted Gaussian Process
   */
  generateUnfitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, o = e.noiseLevel || this.noiseLevel;
    e.useStringTime;
    const a = [];
    for (let c = 0; c < r; c++) {
      const u = Array.from({ length: t }, (m, h) => [h]), d = new _e(u), _ = new jn(n, i).call(d);
      for (let m = 0; m < _.rows; m++)
        _.set(m, m, _.get(m, m) + o);
      let w = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && (w = new Array(t).fill(this.walkAround));
      const S = go(w, _);
      a.push(S);
    }
    return r === 1 ? a[0] : a;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, o = this.data.map((m) => [m[0]]), a = this.data.map((m) => m[1]), c = new jn(n, i);
    this.gpr = new Zn(c);
    try {
      this.gpr.fit(o, a), this.isFitted = !0;
    } catch (m) {
      throw new Error(`Failed to fit Gaussian Process: ${m.message}`);
    }
    const u = Math.min(...this.data.map((m) => m[0])), g = (Math.max(...this.data.map((m) => m[0])) - u) / (t - 1), _ = Array.from({ length: t }, (m, h) => [u + h * g]), w = this.gpr.sampleY(_, r), S = _.map((m) => m[0]);
    return r === 1 ? [S, w[0]] : [S, w];
  }
  rbfKernel(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return this.amplitude * Math.exp(-r / (2 * Math.pow(this.lengthScale, 2)));
  }
  setData(e) {
    this.data = [...e];
  }
  getData() {
    return [...this.data];
  }
  setLengthScale(e) {
    this.lengthScale = e;
  }
  setAmplitude(e) {
    this.amplitude = e;
  }
  setNoiseLevel(e) {
    this.noiseLevel = e;
  }
  /**
   * Convert GP samples to JMON notes
   * @param {Array|Array<Array>} samples - GP samples (single array or array of arrays)
   * @param {Array} durations - Duration sequence
   * @param {Array} timePoints - Time points (for fitted GP)
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e, t = [1], r = null, n = {}) {
    const {
      useStringTime: i = !1,
      mapToScale: o = null,
      scaleRange: a = [60, 72],
      quantize: c = !1
    } = n, u = [];
    let d = 0;
    const g = Array.isArray(e[0]) ? e : [e], _ = r || Array.from({ length: g[0].length }, (w, S) => S);
    for (let w = 0; w < g[0].length; w++) {
      const S = t[w % t.length], m = r ? _[w] : d, h = g.map((l) => {
        let f = l[w];
        if (o) {
          const y = Math.min(...l), b = Math.max(...l) - y || 1, P = (f - y) / b, T = Math.floor(P * o.length), q = Math.max(0, Math.min(T, o.length - 1));
          f = o[q];
        } else {
          const y = Math.min(...l), b = Math.max(...l) - y || 1, P = (f - y) / b;
          f = a[0] + P * (a[1] - a[0]);
        }
        return c && (f = Math.round(f)), f;
      }), p = h.length === 1 ? h[0] : h;
      u.push({
        pitch: p,
        duration: S,
        time: i ? ze(m, this.timingConfig) : m
      }), r || (d += S);
    }
    return u;
  }
  /**
   * Generate JMON track directly from GP
   * @param {Object} options - Generation options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e = {}, t = {}) {
    const r = this.generate(e), n = e.durations || [1];
    let i;
    if (this.isFitted || this.data.length > 0 && Array.isArray(this.data[0])) {
      const [o, a] = r;
      i = this.toJmonNotes(a, n, o, e);
    } else
      i = this.toJmonNotes(r, n, null, e);
    return Ge(i, {
      label: "gaussian-process",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...t
    });
  }
  /**
   * Simple seeded random number generator
   */
  seededRandom(e) {
    return function() {
      return e = (e * 9301 + 49297) % 233280, e / 233280;
    };
  }
}
class wo {
  /**
   * @param {CellularAutomataOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.width = e.width || 51, this.ruleNumber = e.ruleNumber || 30, this.initialState = e.initialState || this.generateRandomInitialState(), this.state = [...this.initialState], this.rules = this.loadRules(this.ruleNumber), this.history = [];
  }
  /**
   * Generate cellular automaton evolution
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Evolution history
   */
  generate(e) {
    this.history = [], this.state = [...this.initialState], this.history.push([...this.state]);
    for (let t = 0; t < e; t++)
      this.updateState(), this.history.push([...this.state]);
    return this.history;
  }
  /**
   * Generate cellular automaton evolution with binary output
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Binary evolution history
   */
  generate01(e) {
    return this.generate(e).map((r) => r.map((n) => n > 0 ? 1 : 0));
  }
  /**
   * Load rules based on rule number
   * @param {number} ruleNumber - Rule number (0-255)
   * @returns {CellularAutomataRule} Rule mapping
   */
  loadRules(e) {
    const t = e.toString(2).padStart(8, "0"), r = {}, n = ["111", "110", "101", "100", "011", "010", "001", "000"];
    for (let i = 0; i < 8; i++)
      r[n[i]] = parseInt(t[i], 10);
    return r;
  }
  /**
   * Update the current state based on rules
   */
  updateState() {
    const e = new Array(this.width);
    for (let t = 0; t < this.width; t++) {
      const r = this.state[(t - 1 + this.width) % this.width], n = this.state[t], i = this.state[(t + 1) % this.width], o = `${r}${n}${i}`;
      e[t] = this.rules[o] || 0;
    }
    this.state = e;
  }
  /**
   * Validate strips matrix format
   * @param {Matrix2D} strips - Matrix to validate
   * @returns {boolean} Whether the matrix is valid
   */
  validateStrips(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    const t = e[0]?.length;
    return t ? e.every(
      (r) => Array.isArray(r) && r.length === t && r.every((n) => typeof n == "number" && (n === 0 || n === 1))
    ) : !1;
  }
  /**
   * Validate values array
   * @param {number[]} values - Values to validate
   * @returns {boolean} Whether the values are valid
   */
  validateValues(e) {
    return Array.isArray(e) && e.length === this.width && e.every((t) => typeof t == "number" && (t === 0 || t === 1));
  }
  /**
   * Set initial state
   * @param {number[]} state - New initial state
   */
  setInitialState(e) {
    if (this.validateValues(e))
      this.initialState = [...e], this.state = [...e];
    else
      throw new Error("Invalid initial state");
  }
  /**
   * Set rule number
   * @param {number} ruleNumber - New rule number (0-255)
   */
  setRuleNumber(e) {
    if (e >= 0 && e <= 255)
      this.ruleNumber = e, this.rules = this.loadRules(e);
    else
      throw new Error("Rule number must be between 0 and 255");
  }
  /**
   * Get evolution history
   * @returns {Matrix2D} Copy of evolution history
   */
  getHistory() {
    return this.history.map((e) => [...e]);
  }
  /**
   * Get current state
   * @returns {number[]} Copy of current state
   */
  getCurrentState() {
    return [...this.state];
  }
  /**
   * Generate random initial state with single center cell
   * @returns {number[]} Initial state array
   */
  generateRandomInitialState() {
    const e = new Array(this.width).fill(0);
    return e[Math.floor(this.width / 2)] = 1, e;
  }
  /**
   * Generate completely random state
   * @returns {number[]} Random state array
   */
  generateRandomState() {
    return Array.from({ length: this.width }, () => Math.random() > 0.5 ? 1 : 0);
  }
  /**
   * Get plot data
   * @returns {Object} Plot data with dimensions
   */
  plot() {
    return {
      data: this.getHistory(),
      width: this.width,
      height: this.history.length
    };
  }
  /**
   * Create Observable Plot visualization of CA evolution
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotEvolution(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotEvolution(this.getHistory(), e);
  }
  /**
   * Create Observable Plot visualization of current generation
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotGeneration(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotGeneration(this.getCurrentState(), e);
  }
  /**
   * Create Observable Plot density visualization
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotDensity(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotDensity(this.getHistory(), e);
  }
}
class Ot {
  /**
   * Initializes a Loop object.
   * 
   * @param {Object|Array} loops - Dictionary or array of JMON tracks. Each track has notes: [{pitch, duration, time, velocity}, ...]
   * @param {number} measureLength - The length of a measure in beats. Defaults to 4.
   * @param {boolean} insertRests - Whether to insert rests. Defaults to true.
   */
  constructor(e, t = 4, r = !0) {
    if (!e)
      throw new Error("Loops parameter is required");
    if (typeof t != "number" || t <= 0)
      throw new Error("measureLength must be a positive number");
    if (typeof r != "boolean")
      throw new Error("insertRests must be a boolean");
    if (this.measureLength = t, Array.isArray(e)) {
      if (e.length === 0)
        throw new Error("Loops array cannot be empty");
      const n = {};
      e.forEach((i, o) => {
        const a = i?.label || `Loop ${o + 1}`;
        n[a] = i;
      }), e = n;
    }
    if (typeof e != "object" || Object.keys(e).length === 0)
      throw new Error("Loops must be a non-empty object or array");
    this.loops = {};
    for (const [n, i] of Object.entries(e)) {
      if (!i)
        throw new Error(`Loop data for "${n}" is null or undefined`);
      const o = Array.isArray(i) ? i : i.notes || [];
      if (!Array.isArray(o))
        throw new Error(`Notes for loop "${n}" must be an array`);
      const a = o.map((c, u) => {
        if (!c || typeof c != "object")
          throw new Error(`Note ${u} in loop "${n}" must be an object`);
        if (c.pitch !== null && (typeof c.pitch != "number" || c.pitch < 0 || c.pitch > 127))
          throw new Error(`Note ${u} in loop "${n}" has invalid pitch: ${c.pitch}`);
        if (typeof c.time != "number" || c.time < 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid time: ${c.time}`);
        if (typeof c.duration != "number" || c.duration <= 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid duration: ${c.duration}`);
        return {
          pitch: c.pitch,
          time: c.time,
          duration: c.duration,
          velocity: typeof c.velocity == "number" ? Math.max(0, Math.min(1, c.velocity)) : 0.8
        };
      });
      this.loops[n] = {
        label: i.label || n,
        notes: r ? this.fillGapsWithRests(a) : a,
        synth: i.synth || {
          type: "Synth",
          options: {
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
          }
        }
      };
    }
  }
  /**
   * Fill gaps between notes with rests (JMON format)
   */
  fillGapsWithRests(e) {
    if (e.length === 0) return e;
    const t = [];
    let r = 0;
    const n = [...e].sort((i, o) => i.time - o.time);
    for (const i of n)
      i.time > r && t.push({
        pitch: null,
        // null indicates rest
        duration: i.time - r,
        time: r,
        velocity: 0
      }), t.push({
        pitch: i.pitch,
        duration: i.duration,
        time: i.time,
        velocity: i.velocity || 0.8
      }), r = i.time + i.duration;
    return t;
  }
  /**
   * Create a loop from a single JMON track
   */
  static fromTrack(e, t = 4) {
    if ((e.notes || []).length === 0)
      throw new Error("Track must have notes to create loop");
    return new Ot({ [e.label || "Track"]: e }, t);
  }
  /**
   * Create loop from Euclidean rhythm (JMON format)
   */
  static euclidean(e, t, r = [60], n = null) {
    if (typeof e != "number" || e <= 0 || !Number.isInteger(e))
      throw new Error("beats must be a positive integer");
    if (typeof t != "number" || t < 0 || !Number.isInteger(t))
      throw new Error("pulses must be a non-negative integer");
    if (t > e)
      throw new Error("pulses cannot be greater than beats");
    if (!Array.isArray(r) || r.length === 0)
      throw new Error("pitches must be a non-empty array");
    const i = this.generateEuclideanRhythm(e, t), o = [], a = 1;
    i.forEach((u, d) => {
      if (u) {
        const g = d * a, _ = r[d % r.length];
        o.push({
          pitch: _,
          duration: a * 0.8,
          time: g,
          velocity: 0.8
        });
      }
    });
    const c = {
      label: n || `Euclidean ${t}/${e}`,
      notes: o,
      synth: {
        type: "Synth",
        options: {
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
        }
      }
    };
    return new Ot({ [c.label]: c }, e);
  }
  /**
   * Generate Euclidean rhythm pattern using Bjorklund algorithm
   * This creates the most even distribution of pulses across beats
   */
  static generateEuclideanRhythm(e, t) {
    if (t === 0)
      return Array(e).fill(!1);
    if (t >= e)
      return Array(e).fill(!0);
    let r = [
      { pattern: [1], count: t },
      // Groups with pulses
      { pattern: [0], count: e - t }
      // Groups without pulses
    ];
    for (; r.length > 1; ) {
      const [o, a] = r;
      if (o.count <= a.count) {
        const c = o.count, u = a.count - o.count;
        r = [
          { pattern: [...a.pattern, ...o.pattern], count: c }
        ], u > 0 && r.push({ pattern: a.pattern, count: u });
      } else {
        const c = a.count, u = o.count - a.count;
        r = [
          { pattern: [...o.pattern, ...a.pattern], count: c }
        ], u > 0 && r.push({ pattern: o.pattern, count: u });
      }
    }
    const n = r[0], i = [];
    for (let o = 0; o < n.count; o++)
      i.push(...n.pattern);
    return i.map((o) => o === 1);
  }
  /**
   * Get loops as JMON tracks (already in JMON format)
   */
  toJMonSequences() {
    return Object.values(this.loops);
  }
  /**
   * Simple plotting method matching Python implementation
   */
  async plot(e = 1 / 4, t = null, r = {}) {
    const { LoopVisualizer: n } = await import("./LoopVisualizer-DS22P85c.js");
    return n.plotLoops(
      this.loops,
      this.measureLength,
      e,
      t,
      r
    );
  }
}
class jt {
  /**
   * Create a musical index analyzer for a sequence
   * @param {Array} sequence - Array of musical values (pitches, durations, etc.)
   */
  constructor(e) {
    this.sequence = e.filter((t) => t != null), this.originalSequence = e;
  }
  /**
   * Calculate Gini coefficient (measure of inequality/diversity)
   * 0 = perfect equality, 1 = maximum inequality
   * @returns {number} Gini coefficient
   */
  gini() {
    if (this.sequence.length === 0) return 0;
    const e = [...this.sequence].sort((i, o) => i - o), t = e.length;
    let r = 0;
    for (let i = 0; i < t; i++)
      r += (2 * (i + 1) - t - 1) * e[i];
    const n = e.reduce((i, o) => i + o, 0);
    return n === 0 ? 0 : r / (t * n);
  }
  /**
   * Calculate balance (measure of how evenly distributed values are around the mean)
   * Lower values indicate better balance around the center
   * @returns {number} Balance metric
   */
  balance() {
    if (this.sequence.length === 0) return 0;
    const e = this.sequence.reduce((r, n) => r + n, 0) / this.sequence.length, t = this.sequence.reduce((r, n) => r + Math.pow(n - e, 2), 0) / this.sequence.length;
    return e === 0 ? 0 : Math.sqrt(t) / Math.abs(e);
  }
  /**
   * Calculate motif strength (measure of repetitive patterns)
   * Higher values indicate stronger motif presence
   * @param {number} maxMotifLength - Maximum motif length to consider
   * @returns {number} Motif strength
   */
  motif(e = 4) {
    if (this.sequence.length < 2) return 0;
    const t = /* @__PURE__ */ new Map();
    let r = 0;
    for (let i = 2; i <= Math.min(e, this.sequence.length); i++)
      for (let o = 0; o <= this.sequence.length - i; o++) {
        const a = this.sequence.slice(o, o + i).join(",");
        t.set(a, (t.get(a) || 0) + 1), r++;
      }
    let n = 0;
    for (const i of t.values())
      i > 1 && (n += i * i);
    return r === 0 ? 0 : n / r;
  }
  /**
   * Calculate dissonance relative to a musical scale
   * 0 = all notes in scale, higher values = more dissonance
   * @param {Array} scale - Array of pitches considered consonant
   * @returns {number} Dissonance level
   */
  dissonance(e) {
    if (!e || e.length === 0 || this.sequence.length === 0) return 0;
    const t = new Set(e.map((n) => n % 12));
    let r = 0;
    for (const n of this.sequence)
      if (n != null) {
        const i = n % 12;
        t.has(i) || r++;
      }
    return r / this.sequence.length;
  }
  /**
   * Calculate rhythmic fitness (how well durations fit within measure boundaries)
   * 1 = perfect fit, lower values = poor rhythmic alignment
   * @param {number} measureLength - Length of a measure in beats
   * @returns {number} Rhythmic fitness
   */
  rhythmic(e = 4) {
    if (this.sequence.length === 0) return 0;
    let t = 0, r = 0;
    const n = this.sequence.reduce((i, o) => i + o, 0);
    for (const i of this.sequence) {
      const o = t + i, a = Math.floor(t / e), c = Math.floor(o / e);
      if (a !== c) {
        const u = e - t % e;
        u < i && u > 0 && (r += Math.min(u, i - u));
      }
      t = o;
    }
    return n === 0 ? 0 : 1 - r / n;
  }
  /**
   * Calculate proportion of rests in the sequence
   * @returns {number} Proportion of rests (0-1)
   */
  restProportion() {
    return this.originalSequence.length === 0 ? 0 : this.originalSequence.filter((t) => t == null).length / this.originalSequence.length;
  }
  /**
   * Calculate all metrics at once for efficiency
   * @param {Array} scale - Musical scale for dissonance calculation
   * @param {number} measureLength - Measure length for rhythmic analysis
   * @returns {Object} All calculated metrics
   */
  calculateAll(e = null, t = 4) {
    return {
      gini: this.gini(),
      balance: this.balance(),
      motif: this.motif(),
      dissonance: e ? this.dissonance(e) : 0,
      rhythmic: this.rhythmic(t),
      rest: this.restProportion()
    };
  }
  /**
   * Calculate statistical properties of the sequence
   * @returns {Object} Statistical properties
   */
  getStats() {
    if (this.sequence.length === 0)
      return { mean: 0, std: 0, min: 0, max: 0, range: 0 };
    const e = this.sequence.reduce((o, a) => o + a, 0) / this.sequence.length, t = this.sequence.reduce((o, a) => o + Math.pow(a - e, 2), 0) / this.sequence.length, r = Math.sqrt(t), n = Math.min(...this.sequence), i = Math.max(...this.sequence);
    return {
      mean: e,
      std: r,
      min: n,
      max: i,
      range: i - n
    };
  }
  /**
   * Compare two sequences and return similarity score
   * @param {MusicalIndex} other - Another MusicalIndex to compare with
   * @param {Array} scale - Scale for dissonance comparison
   * @param {number} measureLength - Measure length for rhythmic comparison
   * @returns {number} Similarity score (0-1, higher is more similar)
   */
  similarity(e, t = null, r = 4) {
    const n = this.calculateAll(t, r), i = e.calculateAll(t, r);
    let o = 0, a = 0;
    for (const [c, u] of Object.entries(n)) {
      const d = i[c];
      if (typeof u == "number" && typeof d == "number") {
        const g = Math.max(Math.abs(u), Math.abs(d), 1), _ = 1 - Math.abs(u - d) / g;
        o += _, a++;
      }
    }
    return a === 0 ? 0 : o / a;
  }
}
class $o {
  /**
   * Initialize the Darwin genetic algorithm
   * @param {Object} config - Configuration object
   */
  constructor(e = {}) {
    const {
      initialPhrases: t = [],
      mutationRate: r = 0.05,
      populationSize: n = 50,
      mutationProbabilities: i = null,
      scale: o = null,
      measureLength: a = 4,
      timeResolution: c = [0.125, 4],
      weights: u = null,
      targets: d = null,
      seed: g = null
    } = e;
    this.initialPhrases = t, this.mutationRate = r, this.populationSize = n, this.scale = o, this.measureLength = a, this.timeResolution = c, g !== null ? (this.seed = g, this.randomState = this.createSeededRandom(g)) : this.randomState = Math;
    const _ = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = _.filter(
      (w) => w >= c[0] && w <= Math.min(c[1], a)
    ), this.mutationProbabilities = i || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const w = this.possibleDurations.map((S, m) => Math.pow(2, -m));
        return this.weightedChoice(this.possibleDurations, w);
      },
      rest: () => this.randomState.random() < 0.02 ? null : 1
    }, this.weights = u || {
      gini: [1, 1, 0],
      // [pitch, duration, offset]
      balance: [1, 1, 0],
      motif: [10, 1, 0],
      dissonance: [1, 0, 0],
      rhythmic: [0, 10, 0],
      rest: [1, 0, 0]
    }, this.targets = d || {
      gini: [0.05, 0.5, 0],
      balance: [0.1, 0.1, 0],
      motif: [1, 1, 0],
      dissonance: [0, 0, 0],
      rhythmic: [0, 1, 0],
      rest: [0, 0, 0]
    }, this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Create a seeded random number generator
   * @param {number} seed - Random seed
   * @returns {Object} Random number generator with seeded methods
   */
  createSeededRandom(e) {
    let t = e;
    const r = () => (t = (t * 9301 + 49297) % 233280, t / 233280);
    return {
      random: r,
      choice: (n) => n[Math.floor(r() * n.length)],
      sample: (n, i) => [...n].sort(() => r() - 0.5).slice(0, i)
    };
  }
  /**
   * Generate Gaussian random number using Box-Muller transform
   * @param {number} mean - Mean of distribution
   * @param {number} stdDev - Standard deviation
   * @returns {number} Gaussian random number
   */
  gaussianRandom(e = 0, t = 1) {
    if (this.gaussianSpare !== void 0) {
      const o = this.gaussianSpare;
      return this.gaussianSpare = void 0, e + t * o;
    }
    const r = this.randomState.random(), n = this.randomState.random(), i = t * Math.sqrt(-2 * Math.log(r));
    return this.gaussianSpare = i * Math.cos(2 * Math.PI * n), e + i * Math.sin(2 * Math.PI * n);
  }
  /**
   * Choose random element from array with weights
   * @param {Array} choices - Array of choices
   * @param {Array} weights - Array of weights
   * @returns {*} Weighted random choice
   */
  weightedChoice(e, t) {
    const r = t.reduce((i, o) => i + o, 0);
    let n = this.randomState.random() * r;
    for (let i = 0; i < e.length; i++)
      if (n -= t[i], n <= 0)
        return e[i];
    return e[e.length - 1];
  }
  /**
   * Initialize population by mutating initial phrases
   * @returns {Array} Initial population
   */
  initializePopulation() {
    const e = [], t = Math.floor(this.populationSize / this.initialPhrases.length);
    for (const r of this.initialPhrases)
      for (let n = 0; n < t; n++)
        e.push(this.mutate(r, 0));
    for (; e.length < this.populationSize; ) {
      const r = this.randomState.choice(this.initialPhrases);
      e.push(this.mutate(r, 0));
    }
    return e;
  }
  /**
   * Calculate fitness components for a musical phrase
   * @param {Array} phrase - Musical phrase as [pitch, duration, offset] tuples
   * @returns {Object} Fitness components
   */
  calculateFitnessComponents(e) {
    if (e.length === 0) return {};
    const t = e.map((a) => a[0]), r = e.map((a) => a[1]), n = e.map((a) => a[2]), i = {};
    if (t.length > 0) {
      const a = new jt(t);
      i.gini_pitch = a.gini(), i.balance_pitch = a.balance(), i.motif_pitch = a.motif(), this.scale && (i.dissonance_pitch = a.dissonance(this.scale));
    }
    if (r.length > 0) {
      const a = new jt(r);
      i.gini_duration = a.gini(), i.balance_duration = a.balance(), i.motif_duration = a.motif(), i.rhythmic = a.rhythmic(this.measureLength);
    }
    if (n.length > 0) {
      const a = new jt(n);
      i.gini_offset = a.gini(), i.balance_offset = a.balance(), i.motif_offset = a.motif();
    }
    const o = t.filter((a) => a == null).length / t.length;
    return i.rest = o, i;
  }
  /**
   * Calculate fitness score for a musical phrase
   * @param {Array} phrase - Musical phrase
   * @returns {number} Fitness score
   */
  fitness(e) {
    const t = this.calculateFitnessComponents(e);
    let r = 0;
    for (const [n, i] of Object.entries(this.targets)) {
      const o = this.weights[n];
      for (let a = 0; a < 3; a++) {
        const c = a === 0 ? `${n}_pitch` : a === 1 ? `${n}_duration` : `${n}_offset`, u = t[c] || 0, d = i[a], g = o[a];
        if (g > 0 && d !== void 0) {
          const _ = Math.max(Math.abs(d), 1), w = 1 - Math.abs(u - d) / _;
          r += Math.max(0, w) * g;
        }
      }
    }
    if (this.weights.rest[0] > 0) {
      const n = t.rest || 0, i = this.targets.rest[0], o = 1 - Math.abs(n - i) / Math.max(i, 1);
      r += Math.max(0, o) * this.weights.rest[0];
    }
    return r;
  }
  /**
   * Mutate a musical phrase
   * @param {Array} phrase - Original phrase
   * @param {number} rate - Mutation rate (null to use default)
   * @returns {Array} Mutated phrase
   */
  mutate(e, t = null) {
    t === null && (t = this.mutationRate);
    const r = [];
    let n = 0;
    for (const i of e) {
      let [o, a, c] = i;
      this.randomState.random() < t && (o = this.mutationProbabilities.pitch()), this.randomState.random() < t && (a = this.mutationProbabilities.duration()), this.randomState.random() < t && this.mutationProbabilities.rest() === null && (o = null);
      const u = n;
      n += a, r.push([o, a, u]);
    }
    return r;
  }
  /**
   * Select top performers from population
   * @param {number} k - Number of individuals to select
   * @returns {Array} Selected phrases
   */
  select(e = 25) {
    const t = this.population.map((r) => ({
      phrase: r,
      fitness: this.fitness(r)
    }));
    return t.sort((r, n) => n.fitness - r.fitness), t.slice(0, e).map((r) => r.phrase);
  }
  /**
   * Crossover (breed) two parent phrases
   * @param {Array} parent1 - First parent phrase
   * @param {Array} parent2 - Second parent phrase
   * @returns {Array} Child phrase
   */
  crossover(e, t) {
    if (e.length === 0 || t.length === 0)
      return e.length > 0 ? [...e] : [...t];
    const r = Math.min(e.length, t.length), n = Math.floor(this.randomState.random() * r), i = Math.floor(this.randomState.random() * r), [o, a] = [Math.min(n, i), Math.max(n, i)], c = [];
    for (let d = 0; d < o; d++)
      d < e.length && c.push([...e[d]]);
    for (let d = o; d < a; d++)
      d < t.length && c.push([...t[d]]);
    for (let d = a; d < Math.max(e.length, t.length); d++)
      d < e.length ? c.push([...e[d]]) : d < t.length && c.push([...t[d]]);
    let u = 0;
    for (let d = 0; d < c.length; d++)
      c[d][2] = u, u += c[d][1];
    return c;
  }
  /**
   * Evolve the population for one generation
   * @param {number} k - Number of parents to select
   * @param {number} restRate - Rate for introducing rests (unused, kept for compatibility)
   * @returns {Object} Evolution statistics
   */
  evolve(e = 25) {
    const t = this.select(e), r = this.fitness(t[0]);
    this.bestIndividuals.push([...t[0]]), this.bestScores.push(r);
    const n = [];
    for (; n.length < this.populationSize; ) {
      const i = this.randomState.choice(t), o = this.randomState.choice(t), a = this.crossover([...i], [...o]), c = this.mutate(a);
      n.push(c);
    }
    return this.population = n, this.generationCount++, {
      generation: this.generationCount,
      bestFitness: r,
      averageFitness: t.reduce((i, o) => i + this.fitness(o), 0) / t.length,
      populationSize: this.populationSize
    };
  }
  /**
   * Evolve for multiple generations
   * @param {number} generations - Number of generations to evolve
   * @param {number} k - Number of parents per generation
   * @param {Function} callback - Optional callback for progress updates
   * @returns {Array} Array of evolution statistics
   */
  evolveGenerations(e, t = 25, r = null) {
    const n = [];
    for (let i = 0; i < e; i++) {
      const o = this.evolve(t);
      n.push(o), r && r(o, i, e);
    }
    return n;
  }
  /**
   * Get the current best individual
   * @returns {Array} Best musical phrase
   */
  getBestIndividual() {
    return this.bestIndividuals.length > 0 ? [...this.bestIndividuals[this.bestIndividuals.length - 1]] : null;
  }
  /**
   * Get evolution history
   * @returns {Object} Evolution history with individuals and scores
   */
  getEvolutionHistory() {
    return {
      individuals: this.bestIndividuals.map((e) => [...e]),
      scores: [...this.bestScores],
      generations: this.generationCount
    };
  }
  /**
   * Reset the evolution state
   */
  reset() {
    this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Get population statistics
   * @returns {Object} Population statistics
   */
  getPopulationStats() {
    const e = this.population.map((n) => this.fitness(n)), t = e.reduce((n, i) => n + i, 0) / e.length, r = e.reduce((n, i) => n + Math.pow(i - t, 2), 0) / e.length;
    return {
      populationSize: this.population.length,
      meanFitness: t,
      standardDeviation: Math.sqrt(r),
      minFitness: Math.min(...e),
      maxFitness: Math.max(...e),
      generation: this.generationCount
    };
  }
}
class _o {
  options;
  walkers;
  history;
  constructor(e = {}) {
    this.options = {
      length: e.length || 100,
      dimensions: e.dimensions || 1,
      stepSize: e.stepSize || 1,
      bounds: e.bounds || [-100, 100],
      branchProbability: e.branchProbability || 0.05,
      mergeProbability: e.mergeProbability || 0.02,
      attractorStrength: e.attractorStrength || 0,
      attractorPosition: e.attractorPosition || Array(e.dimensions || 1).fill(0)
    }, this.walkers = [], this.history = [];
  }
  /**
   * Generate random walk sequence
   */
  generate(e) {
    this.initialize(e), this.history = [];
    for (let t = 0; t < this.options.length; t++)
      this.updateWalkers(), this.recordState(), this.handleBranching(), this.handleMerging();
    return this.history;
  }
  /**
   * Initialize walker(s)
   */
  initialize(e) {
    const t = e || Array(this.options.dimensions).fill(0);
    this.walkers = [{
      position: [...t],
      velocity: Array(this.options.dimensions).fill(0),
      branches: [],
      age: 0,
      active: !0
    }];
  }
  /**
   * Update all active walkers
   */
  updateWalkers() {
    for (const e of this.walkers)
      if (e.active) {
        for (let t = 0; t < this.options.dimensions; t++) {
          const r = (Math.random() - 0.5) * 2 * this.options.stepSize;
          let n = 0;
          if (this.options.attractorStrength > 0) {
            const i = e.position[t] - this.options.attractorPosition[t];
            n = -this.options.attractorStrength * i;
          }
          e.velocity[t] = e.velocity[t] * 0.9 + r + n, e.position[t] += e.velocity[t], e.position[t] < this.options.bounds[0] ? (e.position[t] = this.options.bounds[0], e.velocity[t] *= -0.5) : e.position[t] > this.options.bounds[1] && (e.position[t] = this.options.bounds[1], e.velocity[t] *= -0.5);
        }
        e.age++;
      }
  }
  /**
   * Record current state of all walkers
   */
  recordState() {
    const e = this.walkers.filter((t) => t.active);
    if (e.length > 0) {
      const t = Array(this.options.dimensions).fill(0);
      for (const r of e)
        for (let n = 0; n < this.options.dimensions; n++)
          t[n] += r.position[n];
      for (let r = 0; r < this.options.dimensions; r++)
        t[r] /= e.length;
      this.history.push([...t]);
    }
  }
  /**
   * Handle branching (walker splitting)
   */
  handleBranching() {
    const e = [];
    for (const t of this.walkers)
      if (t.active && Math.random() < this.options.branchProbability) {
        const r = {
          position: [...t.position],
          velocity: t.velocity.map((n) => n + (Math.random() - 0.5) * this.options.stepSize),
          branches: [],
          age: 0,
          active: !0
        };
        e.push(r), t.branches.push(r);
      }
    this.walkers.push(...e);
  }
  /**
   * Handle merging (walker combining)
   */
  handleMerging() {
    if (this.walkers.length <= 1) return;
    const e = this.walkers.filter((r) => r.active), t = this.options.stepSize * 2;
    for (let r = 0; r < e.length; r++)
      for (let n = r + 1; n < e.length; n++)
        if (Math.random() < this.options.mergeProbability && this.calculateDistance(e[r].position, e[n].position) < t) {
          for (let o = 0; o < this.options.dimensions; o++)
            e[r].position[o] = (e[r].position[o] + e[n].position[o]) / 2, e[r].velocity[o] = (e[r].velocity[o] + e[n].velocity[o]) / 2;
          e[n].active = !1;
        }
    this.walkers = this.walkers.filter((r) => r.active);
  }
  /**
   * Calculate Euclidean distance between two positions
   */
  calculateDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return Math.sqrt(r);
  }
  /**
   * Get 1D projection of multi-dimensional walk
   */
  getProjection(e = 0) {
    return this.history.map((t) => t[e] || 0);
  }
  /**
   * Map walk to musical scale
   */
  mapToScale(e = 0, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    const n = this.getProjection(e);
    if (n.length === 0) return [];
    const i = Math.min(...n), a = Math.max(...n) - i || 1;
    return n.map((c) => {
      const u = (c - i) / a, d = Math.floor(u * t.length * r), g = Math.floor(d / t.length), _ = d % t.length;
      return 60 + g * 12 + t[_];
    });
  }
  /**
   * Map walk to rhythmic durations
   */
  mapToRhythm(e = 0, t = [0.25, 0.5, 1, 2]) {
    const r = this.getProjection(e);
    if (r.length === 0) return [];
    const n = Math.min(...r), o = Math.max(...r) - n || 1;
    return r.map((a) => {
      const c = (a - n) / o, u = Math.floor(c * t.length), d = Math.max(0, Math.min(u, t.length - 1));
      return t[d];
    });
  }
  /**
   * Map walk to velocities
   */
  mapToVelocity(e = 0, t = 0.3, r = 1) {
    const n = this.getProjection(e);
    if (n.length === 0) return [];
    const i = Math.min(...n), a = Math.max(...n) - i || 1;
    return n.map((c) => {
      const u = (c - i) / a;
      return t + u * (r - t);
    });
  }
  /**
   * Generate correlated walk (walk that follows another walk with some correlation)
   */
  generateCorrelated(e, t = 0.5, r = 0) {
    if (e.length === 0) return [];
    const n = [];
    let i = 0;
    for (let o = 0; o < e.length; o++) {
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, c = t * (e[o] - i);
      i += a + c, i = Math.max(this.options.bounds[0], Math.min(this.options.bounds[1], i)), n.push(i);
    }
    return n;
  }
  /**
   * Analyze walk properties
   */
  analyze() {
    if (this.history.length < 2)
      return {
        meanDisplacement: 0,
        meanSquaredDisplacement: 0,
        totalDistance: 0,
        fractalDimension: 0
      };
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((u) => Math.pow(u - t, 2)), o = i.reduce((u, d) => u + d, 0) / i.length;
    let a = 0;
    for (let u = 1; u < e.length; u++)
      a += Math.abs(e[u] - e[u - 1]);
    const c = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: n,
      meanSquaredDisplacement: o,
      totalDistance: a,
      fractalDimension: c
    };
  }
  /**
   * Get current walker states
   */
  getWalkerStates() {
    return this.walkers.map((e) => ({ ...e }));
  }
  /**
   * Reset the walk generator
   */
  reset() {
    this.walkers = [], this.history = [];
  }
  /**
   * Convert walk to JMON notes
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e = [1], t = {}) {
    const {
      useStringTime: r = !1,
      timingConfig: n = Pe,
      dimension: i = 0,
      mapToScale: o = null,
      scaleRange: a = [60, 72]
    } = t, c = this.getProjection(i), u = [];
    let d = 0;
    for (let g = 0; g < c.length; g++) {
      const _ = e[g % e.length];
      let w = c[g];
      if (o) {
        const S = Math.min(...c), h = Math.max(...c) - S || 1, p = (w - S) / h, l = Math.floor(p * o.length), f = Math.max(0, Math.min(l, o.length - 1));
        w = o[f];
      } else
        w = this.mapToScale([c], o || [60, 62, 64, 65, 67, 69, 71])[0][g];
      u.push({
        pitch: w,
        duration: _,
        time: r ? ze(d, n) : d
      }), d += _;
    }
    return u;
  }
  /**
   * Generate JMON track directly from walk
   * @param {Array} startPosition - Starting position
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Generation and conversion options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e, t = [1], r = {}, n = {}) {
    this.generate(e);
    const i = this.toJmonNotes(t, r);
    return Ge(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
}
class So {
  walkRange;
  walkStart;
  walkProbability;
  roundTo;
  branchingProbability;
  mergingProbability;
  timingConfig;
  constructor(e = {}) {
    this.walkRange = e.walkRange || null, this.walkStart = e.walkStart !== void 0 ? e.walkStart : this.walkRange ? Math.floor((this.walkRange[1] - this.walkRange[0]) / 2) + this.walkRange[0] : 0, this.walkProbability = e.walkProbability || [-1, 0, 1], this.roundTo = e.roundTo !== void 0 ? e.roundTo : null, this.branchingProbability = e.branchingProbability || 0, this.mergingProbability = e.mergingProbability || 0, this.timingConfig = e.timingConfig || Pe;
  }
  /**
   * Generate random walk sequence(s) with branching and merging
   * @param {number} length - Length of the walk
   * @param {number} seed - Random seed for reproducibility
   * @returns {Array<Array>} Array of walk sequences (branches)
   */
  generate(e, t) {
    let r = Math.random;
    t !== void 0 && (r = this.createSeededRandom(t));
    const n = [this.initializeWalk(e)];
    let i = [this.walkStart];
    for (let o = 1; o < e; o++) {
      const a = [...i], c = [];
      for (let u = 0; u < i.length; u++) {
        const d = n[u], g = i[u];
        if (g === null) {
          d && (d[o] = null);
          continue;
        }
        const _ = this.generateStep(r);
        let w = g + _;
        if (isNaN(w) && (w = g), this.walkRange !== null && (w < this.walkRange[0] ? w = this.walkRange[0] : w > this.walkRange[1] && (w = this.walkRange[1])), isNaN(w) && (w = this.walkStart), d && (d[o] = w), a[u] = w, r() < this.branchingProbability) {
          const S = this.createBranch(n[u], o), m = this.generateStep(r);
          let h = g + m;
          isNaN(h) && (h = g), this.walkRange !== null && (h < this.walkRange[0] ? h = this.walkRange[0] : h > this.walkRange[1] && (h = this.walkRange[1])), isNaN(h) && (h = this.walkStart), S[o] = h, c.push(S), a.push(h);
        }
      }
      n.push(...c), i = a, i = this.handleMerging(n, i, o, r);
    }
    return n;
  }
  /**
   * Generate a single step according to the probability distribution
   */
  generateStep(e = Math.random) {
    if (Array.isArray(this.walkProbability))
      return this.walkProbability[Math.floor(e() * this.walkProbability.length)];
    if (typeof this.walkProbability == "object" && this.walkProbability.mean !== void 0 && this.walkProbability.std !== void 0) {
      let t = this.generateNormal(this.walkProbability.mean, this.walkProbability.std, e);
      return this.roundTo !== null && (t = parseFloat(t.toFixed(this.roundTo))), t;
    }
    return [-1, 0, 1][Math.floor(e() * 3)];
  }
  /**
   * Generate a sample from normal distribution
   */
  generateNormal(e, t, r = Math.random) {
    let n, i;
    do
      n = r();
    while (n === 0);
    i = r();
    const o = Math.sqrt(-2 * Math.log(n)) * Math.cos(2 * Math.PI * i), a = e + t * o;
    return isNaN(a) ? e : a;
  }
  /**
   * Initialize a new walk with null values
   */
  initializeWalk(e) {
    const t = new Array(e);
    t[0] = this.walkStart;
    for (let r = 1; r < e; r++)
      t[r] = null;
    return t;
  }
  /**
   * Create a branch from an existing walk
   */
  createBranch(e, t) {
    const r = new Array(e.length);
    for (let n = 0; n < t; n++)
      r[n] = null;
    for (let n = t; n < r.length; n++)
      r[n] = null;
    return r;
  }
  /**
   * Handle merging of walks that collide
   */
  handleMerging(e, t, r, n = Math.random) {
    const i = [...t];
    for (let o = 0; o < t.length; o++)
      if (t[o] !== null)
        for (let a = o + 1; a < t.length; a++) {
          if (t[a] === null) continue;
          const c = this.roundTo !== null ? this.roundTo : 1e-3;
          if (Math.abs(t[o] - t[a]) <= c && n() < this.mergingProbability && (i[a] = null, e[a]))
            for (let u = r; u < e[a].length; u++)
              e[a][u] = null;
        }
    return i;
  }
  /**
   * Convert walk sequences to JMON notes
   * @param {Array<Array>} walks - Walk sequences
   * @param {Array} durations - Duration sequence to map to
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e, t = [1], r = {}) {
    const n = r.useStringTime || !1, i = [];
    let o = 0, a = 0;
    const c = Math.max(...e.map((u) => u.length));
    for (let u = 0; u < c; u++) {
      const d = e.map((g) => g[u]).filter((g) => g !== null);
      if (d.length > 0) {
        const g = t[a % t.length], _ = d.length === 1 ? d[0] : d;
        i.push({
          pitch: _,
          duration: g,
          time: n ? ze(o, this.timingConfig) : o
        }), o += g, a++;
      }
    }
    return i;
  }
  /**
   * Generate a JMON track directly from walk
   * @param {number} length - Walk length
   * @param {Array} durations - Duration sequence
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e, t = [1], r = {}) {
    const n = this.generate(e, r.seed), i = this.toJmonNotes(n, t, r);
    return Ge(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...r
    });
  }
  /**
   * Map walk values to a musical scale
   * @param {Array<Array>} walks - Walk sequences  
   * @param {Array} scale - Scale to map to
   * @returns {Array<Array>} Walks mapped to scale
   */
  mapToScale(e, t = [60, 62, 64, 65, 67, 69, 71]) {
    return e.map((r) => r.map((n) => {
      if (n === null) return null;
      const i = this.walkRange[0], a = this.walkRange[1] - i, c = (n - i) / a, u = Math.floor(c * t.length), d = Math.max(0, Math.min(u, t.length - 1));
      return t[d];
    }));
  }
  /**
   * Create a seeded random number generator
   */
  createSeededRandom(e) {
    let t = Math.abs(e) || 1;
    return function() {
      t = (t * 9301 + 49297) % 233280;
      const r = t / 233280;
      return Math.max(1e-7, Math.min(0.9999999, r));
    };
  }
}
class xe {
  distance;
  frequency;
  phase;
  subPhasors;
  center;
  constructor(e = 1, t = 1, r = 0, n = []) {
    this.distance = e, this.frequency = t, this.phase = r, this.subPhasors = n || [], this.center = { x: 0, y: 0 };
  }
  /**
   * Add a sub-phasor to this phasor (like epicycles)
   */
  addSubPhasor(e) {
    this.subPhasors.push(e);
  }
  /**
   * Calculate position at given time
   */
  getPosition(e) {
    const t = this.frequency * e + this.phase, r = this.center.x + this.distance * Math.cos(t), n = this.center.y + this.distance * Math.sin(t);
    return { x: r, y: n, angle: t, distance: this.distance };
  }
  /**
   * Calculate distance from origin
   */
  getDistanceFromOrigin(e) {
    const t = this.getPosition(e);
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }
  /**
   * Calculate angle from origin in degrees
   */
  getAngleFromOrigin(e) {
    const t = this.getPosition(e);
    let r = Math.atan2(t.y, t.x) * 180 / Math.PI;
    return r < 0 && (r += 360), r;
  }
  /**
   * Simulate this phasor and all its sub-phasors
   */
  simulate(e, t = { x: 0, y: 0 }) {
    this.center = t;
    const r = [];
    for (const n of e) {
      const i = this.getPosition(n), o = this.getDistanceFromOrigin(n), a = this.getAngleFromOrigin(n);
      r.push({
        time: n,
        position: i,
        distance: o,
        angle: a,
        phasor: this
      });
      for (const c of this.subPhasors) {
        c.center = i;
        const u = c.simulate([n], i);
        r.push(...u);
      }
    }
    return r;
  }
}
class ur {
  phasors;
  timingConfig;
  constructor(e = Pe) {
    this.phasors = [], this.timingConfig = e;
  }
  /**
   * Add a phasor to the system
   */
  addPhasor(e) {
    this.phasors.push(e);
  }
  /**
   * Simulate all phasors and sub-phasors in the system
   */
  simulate(e) {
    const t = [];
    for (const r of this.phasors) {
      const n = r.simulate(e);
      t.push(n);
    }
    return t;
  }
  /**
   * Get a flattened list of all phasors (primary + sub-phasors)
   */
  getAllPhasors() {
    const e = [];
    for (const t of this.phasors)
      e.push(t), this.collectSubPhasors(t, e);
    return e;
  }
  /**
   * Recursively collect all sub-phasors
   */
  collectSubPhasors(e, t) {
    for (const r of e.subPhasors)
      t.push(r), this.collectSubPhasors(r, t);
  }
  /**
   * Map phasor motion to musical parameters
   */
  mapToMusic(e, t = {}) {
    const r = this.simulate(e), n = [];
    for (let i = 0; i < r.length; i++) {
      const o = r[i], a = this.createMusicalTrack(o, i, t);
      n.push(a);
    }
    return n;
  }
  /**
   * Create a musical track from phasor motion
   */
  createMusicalTrack(e, t, r = {}) {
    const {
      pitchRange: n = [40, 80],
      durationRange: i = [0.25, 2],
      useDistance: o = !0,
      useAngle: a = !1,
      quantizeToScale: c = null,
      timingConfig: u = this.timingConfig,
      useStringTime: d = !1
    } = r, g = [];
    for (const _ of e) {
      let w, S;
      if (o) {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        w = n[0] + m * (n[1] - n[0]);
      } else
        w = n[0] + _.angle / 360 * (n[1] - n[0]);
      if (a)
        S = i[0] + _.angle / 360 * (i[1] - i[0]);
      else {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        S = i[1] - m * (i[1] - i[0]);
      }
      if (c) {
        const m = Math.floor((w - n[0]) / (n[1] - n[0]) * c.length), h = Math.max(0, Math.min(m, c.length - 1));
        w = c[h];
      } else
        w = Math.round(w);
      g.push({
        pitch: w,
        duration: S,
        time: d ? ze(_.time, u) : _.time,
        phasorData: {
          distance: _.distance,
          angle: _.angle,
          position: _.position
        }
      });
    }
    return g;
  }
  /**
   * Generate JMON tracks directly from phasor motion
   */
  generateTracks(e, t = {}, r = {}) {
    const n = this.mapToMusic(e, t), i = [];
    return n.forEach((o, a) => {
      const c = Ge(o, {
        label: `phasor-${a + 1}`,
        midiChannel: a % 16,
        synth: { type: "Synth" },
        ...r
      });
      i.push(c);
    }), i;
  }
  /**
   * Create complex harmonic patterns with sub-phasors (epicycles)
   */
  static createComplexSystem() {
    const e = new ur(), t = new xe(0.2, 5, 0), r = new xe(0.3, 3, Math.PI / 2), n = new xe(0.1, 8, Math.PI);
    t.addSubPhasor(n);
    const i = new xe(2, 1, 0, [t, r]), o = new xe(3.5, 0.6, Math.PI / 3);
    return e.addPhasor(i), e.addPhasor(o), e;
  }
  /**
   * Generate time array with linear spacing
   */
  static generateTimeArray(e = 0, t = 10, r = 100) {
    const n = [], i = (t - e) / (r - 1);
    for (let o = 0; o < r; o++)
      n.push(e + o * i);
    return n;
  }
}
class Po {
  /**
   * @param {MandelbrotOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.width = e.width || 100, this.height = e.height || 100, this.maxIterations = e.maxIterations || 100, this.xMin = e.xMin || -2.5, this.xMax = e.xMax || 1.5, this.yMin = e.yMin || -2, this.yMax = e.yMax || 2;
  }
  /**
   * Generate Mandelbrot set data
   * @returns {number[][]} 2D array of iteration counts
   */
  generate() {
    const e = [];
    for (let t = 0; t < this.height; t++) {
      const r = [];
      for (let n = 0; n < this.width; n++) {
        const i = this.xMin + n / this.width * (this.xMax - this.xMin), o = this.yMin + t / this.height * (this.yMax - this.yMin), a = this.mandelbrotIterations({ real: i, imaginary: o });
        r.push(a);
      }
      e.push(r);
    }
    return e;
  }
  /**
   * Extract sequence from Mandelbrot data using various methods
   * @param {'diagonal'|'border'|'spiral'|'column'|'row'} [method='diagonal'] - Extraction method
   * @param {number} [index=0] - Index for column/row extraction
   * @returns {number[]} Extracted sequence
   */
  extractSequence(e = "diagonal", t = 0) {
    const r = this.generate();
    switch (e) {
      case "diagonal":
        return this.extractDiagonal(r);
      case "border":
        return this.extractBorder(r);
      case "spiral":
        return this.extractSpiral(r);
      case "column":
        return this.extractColumn(r, t);
      case "row":
        return this.extractRow(r, t);
      default:
        return this.extractDiagonal(r);
    }
  }
  /**
   * Calculate Mandelbrot iterations for a complex point
   * @param {ComplexPoint} c - Complex point to test
   * @returns {number} Number of iterations before escape
   */
  mandelbrotIterations(e) {
    let t = { real: 0, imaginary: 0 };
    for (let r = 0; r < this.maxIterations; r++) {
      const n = t.real * t.real - t.imaginary * t.imaginary + e.real, i = 2 * t.real * t.imaginary + e.imaginary;
      if (t.real = n, t.imaginary = i, t.real * t.real + t.imaginary * t.imaginary > 4)
        return r;
    }
    return this.maxIterations;
  }
  /**
   * Extract diagonal sequence
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Diagonal sequence
   */
  extractDiagonal(e) {
    const t = [], r = Math.min(e.length, e[0]?.length || 0);
    for (let n = 0; n < r; n++)
      t.push(e[n][n]);
    return t;
  }
  /**
   * Extract border sequence (clockwise)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Border sequence
   */
  extractBorder(e) {
    const t = [], r = e.length, n = e[0]?.length || 0;
    if (r === 0 || n === 0) return t;
    for (let i = 0; i < n; i++)
      t.push(e[0][i]);
    for (let i = 1; i < r; i++)
      t.push(e[i][n - 1]);
    if (r > 1)
      for (let i = n - 2; i >= 0; i--)
        t.push(e[r - 1][i]);
    if (n > 1)
      for (let i = r - 2; i > 0; i--)
        t.push(e[i][0]);
    return t;
  }
  /**
   * Extract spiral sequence (from outside to inside)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Spiral sequence
   */
  extractSpiral(e) {
    const t = [], r = e.length, n = e[0]?.length || 0;
    if (r === 0 || n === 0) return t;
    let i = 0, o = r - 1, a = 0, c = n - 1;
    for (; i <= o && a <= c; ) {
      for (let u = a; u <= c; u++)
        t.push(e[i][u]);
      i++;
      for (let u = i; u <= o; u++)
        t.push(e[u][c]);
      if (c--, i <= o) {
        for (let u = c; u >= a; u--)
          t.push(e[o][u]);
        o--;
      }
      if (a <= c) {
        for (let u = o; u >= i; u--)
          t.push(e[u][a]);
        a++;
      }
    }
    return t;
  }
  /**
   * Extract specific column
   * @param {number[][]} data - 2D fractal data
   * @param {number} columnIndex - Column index to extract
   * @returns {number[]} Column sequence
   */
  extractColumn(e, t) {
    const r = [], n = e[0]?.length || 0, i = Math.max(0, Math.min(t, n - 1));
    for (const o of e)
      o[i] !== void 0 && r.push(o[i]);
    return r;
  }
  /**
   * Extract specific row
   * @param {number[][]} data - 2D fractal data
   * @param {number} rowIndex - Row index to extract
   * @returns {number[]} Row sequence
   */
  extractRow(e, t) {
    const r = Math.max(0, Math.min(t, e.length - 1));
    return e[r] ? [...e[r]] : [];
  }
  /**
   * Map fractal values to musical scale
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(e, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    if (e.length === 0) return [];
    const n = Math.min(...e), o = Math.max(...e) - n || 1;
    return e.map((a) => {
      const c = (a - n) / o, u = Math.floor(c * t.length * r), d = Math.floor(u / t.length), g = u % t.length;
      return 60 + d * 12 + t[g];
    });
  }
  /**
   * Generate rhythmic pattern from fractal data
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [subdivisions=[1, 2, 4, 8, 16]] - Rhythmic subdivisions
   * @returns {number[]} Rhythmic durations
   */
  mapToRhythm(e, t = [1, 2, 4, 8, 16]) {
    if (e.length === 0) return [];
    const r = Math.min(...e), i = Math.max(...e) - r || 1;
    return e.map((o) => {
      const a = (o - r) / i, c = Math.floor(a * t.length), u = Math.max(0, Math.min(c, t.length - 1));
      return 1 / t[u];
    });
  }
}
class Eo {
  /**
   * @param {LogisticMapOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.r = e.r || 3.8, this.x0 = e.x0 || 0.5, this.iterations = e.iterations || 1e3, this.skipTransient = e.skipTransient || 100;
  }
  /**
   * Generate logistic map sequence
   * @returns {number[]} Generated sequence
   */
  generate() {
    const e = [];
    let t = this.x0;
    for (let r = 0; r < this.iterations + this.skipTransient; r++)
      t = this.r * t * (1 - t), r >= this.skipTransient && e.push(t);
    return e;
  }
  /**
   * Generate bifurcation data for different r values
   * @param {number} [rMin=2.5] - Minimum r value
   * @param {number} [rMax=4.0] - Maximum r value
   * @param {number} [rSteps=1000] - Number of r steps
   * @returns {Object} Bifurcation data with r and x arrays
   */
  bifurcationDiagram(e = 2.5, t = 4, r = 1e3) {
    const n = [], i = [], o = (t - e) / r;
    for (let a = 0; a < r; a++) {
      const c = e + a * o, u = this.r;
      this.r = c;
      const d = this.generate();
      this.r = u;
      const g = d.slice(-50);
      for (const _ of g)
        n.push(c), i.push(_);
    }
    return { r: n, x: i };
  }
  /**
   * Map chaotic values to musical scale
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(e, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    return e.length === 0 ? [] : e.map((n) => {
      const i = Math.floor(n * t.length * r), o = Math.floor(i / t.length), a = i % t.length;
      return 60 + o * 12 + t[a];
    });
  }
  /**
   * Map to rhythmic durations
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [durations=[0.25, 0.5, 1, 2]] - Duration values
   * @returns {number[]} Rhythm sequence
   */
  mapToRhythm(e, t = [0.25, 0.5, 1, 2]) {
    return e.length === 0 ? [] : e.map((r) => {
      const n = Math.floor(r * t.length), i = Math.max(0, Math.min(n, t.length - 1));
      return t[i];
    });
  }
  /**
   * Map to velocities
   * @param {number[]} sequence - Chaotic sequence
   * @param {number} [minVel=0.3] - Minimum velocity
   * @param {number} [maxVel=1.0] - Maximum velocity
   * @returns {number[]} Velocity sequence
   */
  mapToVelocity(e, t = 0.3, r = 1) {
    if (e.length === 0) return [];
    const n = r - t;
    return e.map((i) => t + i * n);
  }
  /**
   * Detect periodic cycles in the sequence
   * @param {number[]} sequence - Sequence to analyze
   * @param {number} [tolerance=0.01] - Tolerance for cycle detection
   * @returns {number[]} Detected cycle periods
   */
  detectCycles(e, t = 0.01) {
    const r = [];
    for (let n = 1; n <= Math.floor(e.length / 2); n++) {
      let i = !0;
      for (let o = n; o < Math.min(e.length, n * 3); o++)
        if (Math.abs(e[o] - e[o - n]) > t) {
          i = !1;
          break;
        }
      i && r.push(n);
    }
    return r;
  }
  /**
   * Calculate Lyapunov exponent (measure of chaos)
   * @param {number} [iterations=10000] - Number of iterations for calculation
   * @returns {number} Lyapunov exponent
   */
  lyapunovExponent(e = 1e4) {
    let t = this.x0, r = 0;
    for (let n = 0; n < e; n++) {
      const i = this.r * (1 - 2 * t);
      r += Math.log(Math.abs(i)), t = this.r * t * (1 - t);
    }
    return r / e;
  }
  /**
   * Generate multiple correlated sequences
   * @param {number} [numSequences=2] - Number of sequences to generate
   * @param {number} [coupling=0.1] - Coupling strength between sequences
   * @returns {number[][]} Array of coupled sequences
   */
  generateCoupled(e = 2, t = 0.1) {
    const r = Array(e).fill(null).map(() => []), n = Array(e).fill(this.x0);
    for (let i = 0; i < this.iterations + this.skipTransient; i++) {
      const o = [...n];
      for (let a = 0; a < e; a++) {
        let c = 0;
        for (let u = 0; u < e; u++)
          u !== a && (c += t * (n[u] - n[a]));
        o[a] = this.r * n[a] * (1 - n[a]) + c, o[a] = Math.max(0, Math.min(1, o[a]));
      }
      if (n.splice(0, e, ...o), i >= this.skipTransient)
        for (let a = 0; a < e; a++)
          r[a].push(n[a]);
    }
    return r;
  }
  /**
   * Apply different chaotic regimes
   * @param {'periodic'|'chaotic'|'edge'|'custom'} regime - Regime type
   * @param {number} [customR] - Custom r value for 'custom' regime
   */
  setRegime(e, t) {
    switch (e) {
      case "periodic":
        this.r = 3.2;
        break;
      case "chaotic":
        this.r = 3.9;
        break;
      case "edge":
        this.r = 3.57;
        break;
      case "custom":
        t !== void 0 && (this.r = Math.max(0, Math.min(4, t)));
        break;
    }
  }
  /**
   * Get current parameters
   * @returns {LogisticMapOptions} Current configuration
   */
  getParameters() {
    return {
      r: this.r,
      x0: this.x0,
      iterations: this.iterations,
      skipTransient: this.skipTransient
    };
  }
}
class Mo {
  operation;
  direction;
  repetition;
  timingConfig;
  sequence = [];
  constructor(e) {
    const { operation: t, direction: r, repetition: n, timingConfig: i = Pe } = e;
    if (!["additive", "subtractive"].includes(t))
      throw new Error("Invalid operation. Choose 'additive' or 'subtractive'.");
    if (!["forward", "backward", "inward", "outward"].includes(r))
      throw new Error("Invalid direction. Choose 'forward', 'backward', 'inward' or 'outward'.");
    if (n < 0 || !Number.isInteger(n))
      throw new Error("Invalid repetition value. Must be an integer greater than or equal to 0.");
    this.operation = t, this.direction = r, this.repetition = n, this.timingConfig = i;
  }
  /**
   * Generate processed sequence based on operation and direction
   * Accepts either:
   * - JMON note objects: { pitch, duration, time }
   * - Legacy objects: { pitch, duration, offset }
   * - Legacy tuples: [pitch, duration, offset]
   * Returns: JMON note objects with numeric time (quarter notes)
   */
  generate(e) {
    this.sequence = this.normalizeInput(e);
    let t;
    if (this.operation === "additive" && this.direction === "forward")
      t = this.additiveForward();
    else if (this.operation === "additive" && this.direction === "backward")
      t = this.additiveBackward();
    else if (this.operation === "additive" && this.direction === "inward")
      t = this.additiveInward();
    else if (this.operation === "additive" && this.direction === "outward")
      t = this.additiveOutward();
    else if (this.operation === "subtractive" && this.direction === "forward")
      t = this.subtractiveForward();
    else if (this.operation === "subtractive" && this.direction === "backward")
      t = this.subtractiveBackward();
    else if (this.operation === "subtractive" && this.direction === "inward")
      t = this.subtractiveInward();
    else if (this.operation === "subtractive" && this.direction === "outward")
      t = this.subtractiveOutward();
    else
      throw new Error("Invalid operation/direction combination");
    const r = this.adjustOffsets(t);
    return this.toJmonNotes(r, !1);
  }
  additiveForward() {
    const e = [];
    for (let t = 0; t < this.sequence.length; t++) {
      const r = this.sequence.slice(0, t + 1);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  additiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(t - 1);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  additiveInward() {
    const e = [], t = this.sequence.length;
    for (let r = 0; r < Math.ceil(t / 2); r++) {
      let n;
      if (r < t - r - 1) {
        const i = this.sequence.slice(0, r + 1), o = this.sequence.slice(t - r - 1);
        n = [...i, ...o];
      } else
        n = [...this.sequence];
      for (let i = 0; i <= this.repetition; i++)
        e.push(...n);
    }
    return e;
  }
  additiveOutward() {
    const e = [], t = this.sequence.length;
    if (t % 2 === 0) {
      const r = Math.floor(t / 2) - 1, n = Math.floor(t / 2);
      for (let i = 0; i < t / 2; i++) {
        const o = this.sequence.slice(r - i, n + i + 1);
        for (let a = 0; a <= this.repetition; a++)
          e.push(...o);
      }
    } else {
      const r = Math.floor(t / 2);
      for (let n = 0; n <= r; n++) {
        const i = this.sequence.slice(r - n, r + n + 1);
        for (let o = 0; o <= this.repetition; o++)
          e.push(...i);
      }
    }
    return e;
  }
  subtractiveForward() {
    const e = [];
    for (let t = 0; t < this.sequence.length; t++) {
      const r = this.sequence.slice(t);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  subtractiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(0, t);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  subtractiveInward() {
    const e = [], t = this.sequence.length, r = Math.floor(t / 2);
    for (let n = 0; n <= this.repetition; n++)
      e.push(...this.sequence);
    for (let n = 1; n <= r; n++) {
      const i = this.sequence.slice(n, t - n);
      if (i.length > 0)
        for (let o = 0; o <= this.repetition; o++)
          e.push(...i);
    }
    return e;
  }
  subtractiveOutward() {
    const e = [];
    let t = [...this.sequence];
    for (let r = 0; r <= this.repetition; r++)
      e.push(...t);
    for (; t.length > 2; ) {
      t = t.slice(1, -1);
      for (let r = 0; r <= this.repetition; r++)
        e.push(...t);
    }
    return e;
  }
  // Normalize heterogenous inputs into objects with pitch, duration, offset (beats)
  normalizeInput(e) {
    return Array.isArray(e) ? Array.isArray(e[0]) ? e.map(([t, r, n = 0]) => ({ pitch: t, duration: r, offset: n })) : e.map((t) => {
      const r = t.pitch, n = t.duration;
      let i = 0;
      return typeof t.offset == "number" ? i = t.offset : typeof t.time == "number" ? i = t.time : typeof t.time == "string" && (i = this.timeToBeats(t.time)), { ...t, pitch: r, duration: n, offset: i };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(e) {
    return ze(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : lr(e, this.timingConfig);
  }
  // After process, recalc offsets sequentially in beats
  adjustOffsets(e) {
    let t = 0;
    return e.map((r) => {
      const n = {
        ...r,
        offset: t
      };
      return t += r.duration, n;
    });
  }
  // Produce JMON notes: { pitch, duration, time }
  // Always use numeric time in quarter notes (like pitch: 60, time: 4.5)
  toJmonNotes(e, t = !1) {
    return e.map(({ pitch: r, duration: n, offset: i, ...o }) => {
      const { time: a, ...c } = o;
      return {
        pitch: r,
        duration: n,
        time: t ? this.beatsToTime(i) : i,
        ...c
      };
    });
  }
  /**
   * Generate and convert to JMON track format
   * @param {Array} sequence - Input sequence
   * @param {Object} trackOptions - Track configuration options
   * @param {boolean} trackOptions.useStringTime - Use bars:beats:ticks strings for display (default: numeric)
   * @returns {Object} JMON track object
   */
  generateTrack(e, t = {}) {
    const r = this.generate(e);
    return Ge(r, {
      timingConfig: this.timingConfig,
      ...t
    });
  }
}
class To {
  tChord;
  direction;
  rank;
  isAlternate;
  currentDirection;
  timingConfig;
  constructor(e, t = "down", r = 0, n = Pe) {
    if (!["up", "down", "any", "alternate"].includes(t))
      throw new Error("Invalid direction. Choose 'up', 'down', 'any' or 'alternate'.");
    if (this.tChord = e, this.isAlternate = t === "alternate", this.currentDirection = this.isAlternate ? "up" : t, this.direction = t, this.timingConfig = n, !Number.isInteger(r) || r < 0)
      throw new Error("Rank must be a non-negative integer.");
    this.rank = Math.min(r, e.length - 1), this.rank >= e.length && console.warn("Rank exceeds the length of the t-chord. Using last note of the t-chord.");
  }
  /**
   * Generate t-voice from m-voice sequence
   * Accepts: JMON notes, legacy objects, or tuples
   * Returns: JMON notes with numeric time (quarter notes)
   * @param {Array} sequence - Input sequence
   * @param {boolean} useStringTime - Whether to use bars:beats:ticks strings for display (default: false)
   */
  generate(e, t = !1) {
    const r = this.normalizeInput(e), n = [];
    for (const i of r) {
      if (i.pitch === void 0) {
        const { offset: S, time: m, ...h } = i;
        n.push({
          ...h,
          pitch: void 0,
          time: t ? this.beatsToTime(S) : S
        });
        continue;
      }
      const o = i.pitch, c = this.tChord.map((S) => S - o).map((S, m) => ({ index: m, value: S })).sort((S, m) => Math.abs(S.value) - Math.abs(m.value));
      let u = this.rank, d;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const S = c.filter(
          ({ value: m }) => this.currentDirection === "up" ? m >= 0 : m <= 0
        );
        if (S.length === 0)
          d = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          u >= S.length && (u = S.length - 1);
          const m = S[u].index;
          d = this.tChord[m];
        }
      } else {
        u >= c.length && (u = c.length - 1);
        const S = c[u].index;
        d = this.tChord[S];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: g, time: _, ...w } = i;
      n.push({
        ...w,
        pitch: d,
        time: t ? this.beatsToTime(g) : g
      });
    }
    return n;
  }
  // Normalize input like MinimalismProcess
  normalizeInput(e) {
    return Array.isArray(e) ? Array.isArray(e[0]) ? e.map(([t, r, n = 0]) => ({ pitch: t, duration: r, offset: n })) : e.map((t) => {
      const r = t.pitch, n = t.duration;
      let i = 0;
      return typeof t.offset == "number" ? i = t.offset : typeof t.time == "number" ? i = t.time : typeof t.time == "string" && (i = this.timeToBeats(t.time)), { ...t, pitch: r, duration: n, offset: i };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(e) {
    return ze(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : lr(e, this.timingConfig);
  }
}
class ko {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((g, _) => ({ value: g, weight: n[_] })).sort((g, _) => g.value - _.value), o = i.map((g) => g.value), a = i.map((g) => g.weight), c = a.reduce((g, _) => g + _, 0);
    let u = 0, d = 0;
    for (let g = 0; g < r; g++) {
      const _ = a.slice(0, g + 1).reduce((w, S) => w + S, 0);
      u += a[g] * (2 * _ - a[g] - c) * o[g], d += a[g] * o[g] * c;
    }
    return d === 0 ? 0 : u / d;
  }
  /**
   * Calculate center of mass (balance point) of a sequence
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Balance point
   */
  static balance(e, t) {
    if (e.length === 0) return 0;
    const r = t || Array(e.length).fill(1), n = e.reduce((o, a, c) => o + a * r[c], 0), i = r.reduce((o, a) => o + a, 0);
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, n = t || Math.floor(r / 2), i = [], o = e.reduce((c, u) => c + u, 0) / r, a = e.reduce((c, u) => c + Math.pow(u - o, 2), 0) / r;
    for (let c = 0; c <= n; c++) {
      let u = 0;
      for (let d = 0; d < r - c; d++)
        u += (e[d] - o) * (e[d + c] - o);
      u /= r - c, i.push(a === 0 ? 0 : u / a);
    }
    return i;
  }
  /**
   * Detect and score musical motifs
   * @param {number[]} values - Values to analyze
   * @param {number} [patternLength=3] - Length of patterns to detect
   * @returns {number} Motif score
   */
  static motif(e, t = 3) {
    if (e.length < t * 2) return 0;
    const r = /* @__PURE__ */ new Map();
    for (let o = 0; o <= e.length - t; o++) {
      const a = e.slice(o, o + t).join(",");
      r.set(a, (r.get(a) || 0) + 1);
    }
    const n = Math.max(...r.values()), i = r.size;
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate dissonance/scale conformity
   * @param {number[]} pitches - MIDI pitch values
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Scale to check against
   * @returns {number} Dissonance score (0-1)
   */
  static dissonance(e, t = [0, 2, 4, 5, 7, 9, 11]) {
    if (e.length === 0) return 0;
    let r = 0;
    for (const n of e) {
      const i = (n % 12 + 12) % 12;
      t.includes(i) && r++;
    }
    return 1 - r / e.length;
  }
  /**
   * Calculate rhythmic fit to a grid
   * @param {number[]} onsets - Onset times
   * @param {number} [gridDivision=16] - Grid division
   * @returns {number} Rhythmic alignment score
   */
  static rhythmic(e, t = 16) {
    if (e.length === 0) return 0;
    let r = 0;
    const n = 0.1;
    for (const i of e) {
      const o = i * t, a = Math.round(o);
      Math.abs(o - a) <= n && r++;
    }
    return r / e.length;
  }
  /**
   * Calculate Fibonacci/golden ratio index
   * @param {number[]} values - Values to analyze
   * @returns {number} Fibonacci index
   */
  static fibonacciIndex(e) {
    if (e.length < 2) return 0;
    const t = (1 + Math.sqrt(5)) / 2;
    let r = 0;
    for (let n = 1; n < e.length; n++)
      if (e[n - 1] !== 0) {
        const i = e[n] / e[n - 1], o = Math.abs(i - t);
        r += 1 / (1 + o);
      }
    return r / (e.length - 1);
  }
  /**
   * Calculate syncopation (off-beat emphasis)
   * @param {number[]} onsets - Onset times
   * @param {number} [beatDivision=4] - Beat division
   * @returns {number} Syncopation score
   */
  static syncopation(e, t = 4) {
    if (e.length === 0) return 0;
    let r = 0;
    for (const n of e) {
      const i = n * t % 1;
      i > 0.2 && i < 0.8 && Math.abs(i - 0.5) > 0.2 && r++;
    }
    return r / e.length;
  }
  /**
   * Calculate contour entropy (melodic direction randomness)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Contour entropy
   */
  static contourEntropy(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let o = 1; o < e.length; o++) {
      const a = e[o] - e[o - 1];
      a > 0 ? t.push(1) : a < 0 ? t.push(-1) : t.push(0);
    }
    const r = { up: 0, down: 0, same: 0 };
    for (const o of t)
      o > 0 ? r.up++ : o < 0 ? r.down++ : r.same++;
    const n = t.length;
    return -[r.up / n, r.down / n, r.same / n].filter((o) => o > 0).reduce((o, a) => o + a * Math.log2(a), 0);
  }
  /**
   * Calculate interval variance (pitch stability)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Interval variance
   */
  static intervalVariance(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let i = 1; i < e.length; i++)
      t.push(Math.abs(e[i] - e[i - 1]));
    const r = t.reduce((i, o) => i + o, 0) / t.length;
    return t.reduce((i, o) => i + Math.pow(o - r, 2), 0) / t.length;
  }
  /**
   * Calculate note density (notes per unit time)
   * @param {JMonNote[]} notes - Array of notes
   * @param {number} [timeWindow=1] - Time window for density calculation
   * @returns {number} Note density
   */
  static density(e, t = 1) {
    if (e.length === 0) return 0;
    const r = e.map((a) => typeof a.time == "string" ? parseFloat(a.time) || 0 : a.time || 0), n = Math.min(...r), o = Math.max(...r) - n || 1;
    return e.length / (o / t);
  }
  /**
   * Calculate gap variance (timing consistency)
   * @param {number[]} onsets - Onset times
   * @returns {number} Gap variance
   */
  static gapVariance(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let i = 1; i < e.length; i++)
      t.push(e[i] - e[i - 1]);
    const r = t.reduce((i, o) => i + o, 0) / t.length;
    return t.reduce((i, o) => i + Math.pow(o - r, 2), 0) / t.length;
  }
  /**
   * Comprehensive analysis of a musical sequence
   * @param {JMonNote[]} notes - Array of notes to analyze
   * @param {AnalysisOptions} [options={}] - Analysis options
   * @returns {AnalysisResult} Analysis results
   */
  static analyze(e, t = {}) {
    const { scale: r = [0, 2, 4, 5, 7, 9, 11] } = t, n = e.map((o) => typeof o.note == "number" ? o.note : typeof o.note == "string" ? 60 : Array.isArray(o.note) ? o.note[0] : 60), i = e.map((o) => typeof o.time == "number" ? o.time : parseFloat(o.time) || 0);
    return {
      gini: this.gini(n),
      balance: this.balance(n),
      motif: this.motif(n),
      dissonance: this.dissonance(n, r),
      rhythmic: this.rhythmic(i),
      fibonacciIndex: this.fibonacciIndex(n),
      syncopation: this.syncopation(i),
      contourEntropy: this.contourEntropy(n),
      intervalVariance: this.intervalVariance(n),
      density: this.density(e),
      gapVariance: this.gapVariance(i)
    };
  }
}
const Ao = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: ko,
  MusicalIndex: jt
}, Symbol.toStringTag, { value: "Module" })), No = {
  harmony: Xs,
  rhythm: fo,
  motifs: {
    MotifBank: po
  }
}, Ro = {
  theory: ue
}, Co = {
  gaussian: {
    Regressor: Zn,
    Kernel: bo
  },
  automata: {
    Cellular: wo
  },
  loops: Ot,
  genetic: {
    Darwin: $o
  },
  walks: {
    Random: _o,
    Chain: So,
    Phasor: {
      Vector: xe,
      System: ur
    }
  },
  fractals: {
    Mandelbrot: Po,
    LogisticMap: Eo
  },
  minimalism: {
    Process: Mo,
    Tintinnabuli: To
  }
}, jo = {
  ...Ao
}, Io = {
  ...Ks
}, Ue = {
  theory: No,
  constants: Ro,
  generative: Co,
  analysis: jo,
  utils: Io
};
class tr {
  constructor(e = {}) {
    this.options = e;
  }
  // Parse bars:beats:ticks -> beats (supports fractional beats)
  static parseBBTToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    const n = e.match(/^(\d+):(\d+(?:\.\d+)?):(\d+)$/);
    if (!n) return 0;
    const i = parseInt(n[1], 10), o = parseFloat(n[2]), a = parseInt(n[3], 10);
    return i * t + o + a / r;
  }
  // Parse note value (e.g., 4n, 8n, 8t) or BBT to beats
  static parseDurationToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    if (/^\d+:\d+(?:\.\d+)?:\d+$/.test(e))
      return this.parseBBTToBeats(e, t, r);
    const n = e.match(/^(\d+)(n|t)$/);
    if (n) {
      const i = parseInt(n[1], 10), o = n[2];
      if (o === "n")
        return 4 / i;
      if (o === "t")
        return 4 / i * (2 / 3);
    }
    return 0;
  }
  convert(e) {
    return (e.tracks || []).map((r) => ({
      label: r.label,
      type: "PolySynth",
      // Default type for the current player
      part: (r.notes || []).map((n) => ({
        time: n.time,
        pitch: n.pitch,
        duration: n.duration,
        velocity: n.velocity || 0.8
      }))
    }));
  }
}
function ei(s, e = {}) {
  try {
    Vn(s);
  } catch {
  }
  const n = new tr(e).convert(s).map((_, w) => ({
    originalTrackIndex: w,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: _.label },
    synthConfig: { type: _.type || "PolySynth" },
    partEvents: _.part || []
  })), i = s.metadata?.tempo || s.bpm || 120, [o, a] = (s.timeSignature || "4/4").split("/").map((_) => parseInt(_, 10)), c = isFinite(o) ? o : 4;
  let u = 0;
  n.forEach((_) => {
    _.partEvents && _.partEvents.length > 0 && _.partEvents.forEach((w) => {
      const S = tr.parseBBTToBeats(w.time, c), m = tr.parseDurationToBeats(w.duration, c), h = S + m;
      h > u && (u = h);
    });
  });
  const d = 60 / i, g = u * d;
  return {
    tracks: n,
    metadata: {
      totalDuration: g,
      tempo: i
    }
  };
}
function dr(s, e = {}) {
  if (!s || typeof s != "object")
    throw console.error("[PLAYER] Invalid composition:", s), new Error("Composition must be a valid JMON object");
  const {
    autoplay: t = !1,
    showDebug: r = !1,
    customInstruments: n = {},
    autoMultivoice: i = !0,
    maxVoices: o = 4,
    Tone: a = null
  } = e;
  if (!s.sequences && !s.tracks)
    throw console.error("[PLAYER] No sequences or tracks found in composition:", s), new Error("Composition must have sequences or tracks");
  const c = s.tracks || s.sequences || [];
  if (!Array.isArray(c))
    throw console.error("[PLAYER] Tracks/sequences must be an array:", c), new Error("Tracks/sequences must be an array");
  const u = s.bpm || 120, g = ei(s, { autoMultivoice: i, maxVoices: o, showDebug: r }), { tracks: _, metadata: w } = g;
  let S = w.totalDuration;
  const m = {
    background: "#FFFFFF",
    primary: "#333",
    secondary: "#F0F0F0",
    text: "#000000",
    lightText: "#666666",
    border: "#CCCCCC"
  }, h = document.createElement("div");
  h.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${m.background};
        color: ${m.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${m.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    `;
  const p = document.createElement("div");
  p.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        font-family: 'PT Sans', sans-serif;
    `;
  const l = document.createElement("div");
  l.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 60%;
    `;
  const f = document.createElement("div");
  f.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const y = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"];
  s.audioGraph && s.audioGraph.some((N) => N.type === "Sampler") && y.unshift("Sampler");
  const $ = s.tracks || s.sequences || [], b = [];
  $.forEach((N, I) => {
    const x = _.find((X) => X.originalTrackIndex === I)?.analysis;
    x?.hasGlissando && console.warn(`Track ${N.label || N.name || I + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const L = document.createElement("div");
    L.style.cssText = `
            margin-bottom: 8px;
        `;
    const Y = document.createElement("label");
    Y.textContent = N.name || N.label || `Track ${I + 1}`, Y.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${m.text};
            display: block;
            margin-bottom: 8px;
            font-weight: normal;
        `;
    const Z = document.createElement("select");
    Z.style.cssText = `
            padding: 4px;
            border: 1px solid ${m.secondary};
            border-radius: 4px;
            background-color: ${m.background};
            color: ${m.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            outline: none;
        `, y.forEach((X, ne) => {
      const ee = document.createElement("option");
      ee.value = X, ee.textContent = X, (s.tracks?.[I]?.synthRef && X === "Sampler" || x?.hasGlissando && X === "Synth" || !x?.hasGlissando && !s.tracks?.[I]?.synthRef && X === "PolySynth") && (ee.selected = !0), x?.hasGlissando && (X === "PolySynth" || X === "DuoSynth") && (ee.disabled = !0, ee.textContent += " (mono only for glissando)"), Z.appendChild(ee);
    }), b.push(Z), L.append(Y, Z), f.appendChild(L);
  }), l.appendChild(f);
  const P = document.createElement("div");
  P.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 35%;
    `;
  const T = document.createElement("div");
  T.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
    `;
  const q = document.createElement("label");
  q.textContent = "Tempo", q.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 8px;
        color: ${m.text};
    `;
  const D = document.createElement("input");
  D.type = "number", D.min = 60, D.max = 240, D.value = u, D.style.cssText = `
        padding: 4px;
        border: 1px solid ${m.secondary};
        border-radius: 4px;
        background-color: ${m.background};
        color: ${m.text};
        font-size: 12px;
        text-align: center;
        width: 100%;
        height: 28px;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
        outline: none;
    `, T.append(q, D), P.appendChild(T);
  const z = document.createElement("div");
  z.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
  const U = document.createElement("div");
  U.textContent = "0:00", U.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const B = document.createElement("div");
  B.textContent = "0:00", B.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const K = document.createElement("input");
  K.type = "range", K.min = 0, K.max = 100, K.value = 0, K.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${m.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const se = document.createElement("button");
  se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', se.style.cssText = `
        width: 40px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 50%;
        background-color: ${m.primary};
        color: ${m.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px 0px 10px;
    `;
  const ye = document.createElement("div");
  ye.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${m.lightText};
        margin: 0px 0px 0px 10px;
    `, z.append(U, K, B, se);
  const ge = document.createElement("div");
  ge.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;
  const re = document.createElement("button");
  re.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', re.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
    `;
  const ve = document.createElement("button");
  ve.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', ve.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
    `, ge.append(re, ve), p.append(l, P), h.append(p, z, ye, ge);
  let k, A = !1, O = [], C = [], v = [], E = null;
  const j = s.tracks || s.sequences || [], F = () => {
    if (!k || !s.audioGraph || !Array.isArray(s.audioGraph)) return null;
    const N = {}, I = (x) => {
      const L = {};
      return Object.entries(x || {}).forEach(([Y, Z]) => {
        let X = Y;
        if (typeof Y == "number" || /^\d+$/.test(String(Y)))
          try {
            X = k.Frequency(parseInt(Y, 10), "midi").toNote();
          } catch {
          }
        L[X] = Z;
      }), L;
    };
    try {
      return s.audioGraph.forEach((x) => {
        const { id: L, type: Y, options: Z = {}, target: X } = x;
        if (!L || !Y) return;
        let ne = null;
        if (Y === "Sampler") {
          const ee = I(Z.urls);
          let pe, le;
          const Re = new Promise((me, oe) => {
            pe = me, le = oe;
          }), ce = {
            urls: ee,
            onload: () => pe && pe(),
            onerror: (me) => {
              console.error(`[PLAYER] Sampler load error for ${L}:`, me), le && le(me);
            }
          };
          Z.baseUrl && (ce.baseUrl = Z.baseUrl);
          try {
            console.log(`[PLAYER] Building Sampler ${L} with urls:`, ee, "baseUrl:", ce.baseUrl || "(none)"), ne = new k.Sampler(ce).toDestination();
          } catch (me) {
            console.error("[PLAYER] Failed to create Sampler:", me), ne = null;
          }
          v.push(Re), ne && Z.envelope && Z.envelope.enabled && (typeof Z.envelope.attack == "number" && (ne.attack = Z.envelope.attack), typeof Z.envelope.release == "number" && (ne.release = Z.envelope.release));
        } else if ([
          "Synth",
          "PolySynth",
          "MonoSynth",
          "AMSynth",
          "FMSynth",
          "DuoSynth",
          "PluckSynth",
          "NoiseSynth"
        ].includes(Y))
          try {
            ne = new k[Y](Z).toDestination();
          } catch (ee) {
            console.warn(`[PLAYER] Failed to create ${Y} from audioGraph, using PolySynth:`, ee), ne = new k.PolySynth().toDestination();
          }
        else Y === "Destination" && (N[L] = k.Destination);
        ne && (N[L] = ne);
      }), N;
    } catch (x) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", x), null;
    }
  }, V = (N) => `${Math.floor(N / 60)}:${Math.floor(N % 60).toString().padStart(2, "0")}`;
  B.textContent = V(S);
  const Q = async () => {
    if (typeof window < "u") {
      const N = a || window.Tone || (typeof k < "u" ? k : null);
      if (N)
        console.log("[PLAYER] Using existing Tone.js, version:", N.version || "unknown"), window.Tone = N;
      else
        try {
          if (typeof require < "u") {
            console.log("[PLAYER] Loading Tone.js via require()...");
            const x = await require("tone@14.8.49/build/Tone.js");
            window.Tone = x.default || x.Tone || x;
          } else {
            console.log("[PLAYER] Loading Tone.js via import()...");
            const x = await import("https://esm.sh/tone@14.8.49");
            window.Tone = x.default || x.Tone || x;
          }
          if (!window.Tone || typeof window.Tone != "object" || !window.Tone.PolySynth) {
            console.warn("[PLAYER] First load attempt failed, trying alternative CDN...");
            try {
              const x = await import("https://cdn.skypack.dev/tone@14.8.49");
              if (window.Tone = x.default || x.Tone || x, !window.Tone || !window.Tone.PolySynth)
                throw new Error("Alternative CDN also failed");
            } catch {
              console.warn("[PLAYER] Alternative CDN failed, trying jsdelivr...");
              try {
                const L = await import("https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js");
                if (window.Tone = L.default || L.Tone || L, !window.Tone || !window.Tone.PolySynth)
                  throw new Error("All CDN attempts failed");
              } catch {
                throw new Error("Loaded Tone.js but got invalid object from all CDNs");
              }
            }
          }
          console.log("[PLAYER] Tone.js loaded successfully, version:", window.Tone.version || "unknown");
        } catch (x) {
          return console.warn("Could not auto-load Tone.js:", x.message), console.log("To use the player, load Tone.js manually first using one of these methods:"), console.log('Method 1: Tone = await require("tone@14.8.49/build/Tone.js")'), console.log('Method 2: Tone = await import("https://esm.sh/tone@14.8.49").then(m => m.default)'), console.log('Method 3: Tone = await import("https://cdn.skypack.dev/tone@14.8.49").then(m => m.default)'), !1;
        }
      const I = window.Tone || N;
      if (I)
        return k = I, console.log("[PLAYER] Available Tone constructors:", {
          PolySynth: typeof k.PolySynth,
          Synth: typeof k.Synth,
          Part: typeof k.Part,
          Transport: typeof k.Transport,
          start: typeof k.start,
          context: !!k.context
        }), console.log("[PLAYER] Tone.js initialized, context state:", k.context ? k.context.state : "no context"), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, J = () => {
    if (!k) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const N = [];
    if (k.PolySynth || N.push("PolySynth"), k.Synth || N.push("Synth"), k.Part || N.push("Part"), k.Transport || N.push("Transport"), N.length > 0) {
      console.error("[PLAYER] Tone.js is missing required constructors:", N), console.error("[PLAYER] Available Tone properties:", Object.keys(k).filter((I) => typeof k[I] == "function").slice(0, 20)), console.error("[PLAYER] Tone object:", k), console.error("[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually.");
      return;
    }
    if (!E && (E = F(), E)) {
      const I = Object.keys(E).filter((x) => E[x] && E[x].name === "Sampler");
      I.length > 0 && console.log("[PLAYER] Using audioGraph Samplers for tracks with synthRef:", I);
    }
    O.forEach((I) => {
      if (!E || !Object.values(E).includes(I))
        try {
          I.dispose();
        } catch {
        }
    }), C.forEach((I) => {
      I.stop(), I.dispose();
    }), O = [], C = [], console.log("[PLAYER] Converted tracks:", _.length), _.forEach((I) => {
      const { originalTrackIndex: x, voiceIndex: L, totalVoices: Y, trackInfo: Z, synthConfig: X, partEvents: ne } = I, pe = (j[x] || {}).synthRef, le = 60 / w.tempo, Re = (ne || []).map((oe) => {
        const G = typeof oe.time == "number" ? oe.time * le : oe.time, ae = typeof oe.duration == "number" ? oe.duration * le : oe.duration;
        return { ...oe, time: G, duration: ae };
      });
      let ce = null;
      if (pe && E && E[pe])
        ce = E[pe];
      else {
        const oe = b[x] ? b[x].value : X.type;
        try {
          const G = X.reason === "glissando_compatibility" ? X.type : oe;
          if (!k[G] || typeof k[G] != "function")
            throw new Error(`Tone.${G} is not a constructor`);
          ce = new k[G]().toDestination(), X.reason === "glissando_compatibility" && L === 0 && console.warn(`[MULTIVOICE] Using ${G} instead of ${X.original} for glissando in ${Z.label}`);
        } catch (G) {
          console.warn(`Failed to create ${oe}, using PolySynth:`, G);
          try {
            if (!k.PolySynth || typeof k.PolySynth != "function")
              throw new Error("Tone.PolySynth is not available");
            ce = new k.PolySynth().toDestination();
          } catch (ae) {
            console.error("Fatal: Cannot create any synth, Tone.js may not be properly loaded:", ae);
            return;
          }
        }
      }
      O.push(ce), Y > 1 && console.log(`[MULTIVOICE] Track "${Z.label}" voice ${L + 1}: ${ne.length} notes`);
      const me = new k.Part((oe, G) => {
        if (Array.isArray(G.pitch))
          G.pitch.forEach((ae) => {
            let he = "C4";
            typeof ae == "number" ? he = k.Frequency(ae, "midi").toNote() : typeof ae == "string" ? he = ae : Array.isArray(ae) && typeof ae[0] == "string" && (he = ae[0]), ce.triggerAttackRelease(he, G.duration, oe);
          });
        else if (G.articulation === "glissando" && G.glissTarget !== void 0) {
          let ae = typeof G.pitch == "number" ? k.Frequency(G.pitch, "midi").toNote() : G.pitch, he = typeof G.glissTarget == "number" ? k.Frequency(G.glissTarget, "midi").toNote() : G.glissTarget;
          console.log("[PLAYER] Glissando", { fromNote: ae, toNote: he, duration: G.duration, time: oe }), console.log("[PLAYER] Glissando effect starting from", ae, "to", he), ce.triggerAttack(ae, oe, G.velocity || 0.8);
          const Ee = k.Frequency(ae).toFrequency(), pr = k.Frequency(he).toFrequency(), mr = 1200 * Math.log2(pr / Ee);
          if (ce.detune && ce.detune.setValueAtTime && ce.detune.linearRampToValueAtTime)
            ce.detune.setValueAtTime(0, oe), ce.detune.linearRampToValueAtTime(mr, oe + G.duration), console.log("[PLAYER] Applied detune glissando:", mr, "cents over", G.duration, "beats");
          else {
            const si = k.Frequency(ae).toMidi(), oi = k.Frequency(he).toMidi(), Ke = Math.max(3, Math.abs(oi - si)), yr = G.duration / Ke;
            for (let Je = 1; Je < Ke; Je++) {
              const ai = Je / (Ke - 1), ci = Ee * Math.pow(pr / Ee, ai), li = k.Frequency(ci).toNote(), ui = oe + Je * yr;
              ce.triggerAttackRelease(li, yr * 0.8, ui, (G.velocity || 0.8) * 0.7);
            }
            console.log("[PLAYER] Applied chromatic glissando with", Ke, "steps");
          }
          ce.triggerRelease(oe + G.duration);
        } else {
          let ae = "C4";
          typeof G.pitch == "number" ? ae = k.Frequency(G.pitch, "midi").toNote() : typeof G.pitch == "string" ? ae = G.pitch : Array.isArray(G.pitch) && typeof G.pitch[0] == "string" && (ae = G.pitch[0]);
          let he = G.duration, Ee = G.velocity || 0.8;
          G.articulation === "staccato" && (he = G.duration * 0.5), G.articulation === "accent" && (Ee = Math.min(Ee * 2, 1)), G.articulation === "tenuto" && (he = G.duration * 1.5, Ee = Math.min(Ee * 1.3, 1)), ce.triggerAttackRelease(ae, he, oe, Ee);
        }
      }, Re);
      C.push(me);
    }), k.Transport.bpm.value = w.tempo, k.Transport.loopEnd = S, k.Transport.loop = !0, k.Transport.stop(), k.Transport.position = 0, B.textContent = V(S);
  }, M = () => {
    if (k && A) {
      const N = typeof k.Transport.loopEnd == "number" ? k.Transport.loopEnd : k.Time(k.Transport.loopEnd).toSeconds(), I = k.Transport.seconds % N, x = I / N * 100;
      K.value = Math.min(x, 100), U.textContent = V(I), B.textContent = V(N), k.Transport.state === "started" && A ? requestAnimationFrame(M) : k.Transport.state === "stopped" && (k.Transport.seconds = 0, K.value = 0, U.textContent = V(0), A = !1, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  se.addEventListener("click", async () => {
    if (!k)
      if (await Q())
        J();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (A)
      k.Transport.stop(), C.forEach((N) => {
        N.stop();
      }), A = !1, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
    else {
      if ((!k.context || k.context.state !== "running") && (await k.start(), console.log("[PLAYER] Audio context started:", k.context ? k.context.state : "unknown")), O.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), J()), k.Transport.stop(), k.Transport.position = 0, console.log("[PLAYER] Transport state before start:", k.Transport.state), console.log("[PLAYER] Transport position reset to:", k.Transport.position), console.log("[PLAYER] Audio context state:", k.context ? k.context.state : "unknown"), console.log("[PLAYER] Parts count:", C.length), console.log("[PLAYER] Synths count:", O.length), E) {
        const N = Object.values(E).filter((I) => I && I.name === "Sampler");
        if (N.length > 0 && v.length > 0) {
          console.log(`[PLAYER] Waiting for ${N.length} sampler(s) to load...`);
          try {
            await Promise.all(v), console.log("[PLAYER] All samplers loaded.");
          } catch (I) {
            console.warn("[PLAYER] Sampler load wait error:", I);
            return;
          }
        }
      }
      if (C.length === 0) {
        console.error("[PLAYER] No parts available to start. This usually means setupAudio() failed."), console.error("[PLAYER] Try refreshing the page or check if Tone.js is properly loaded.");
        return;
      }
      C.forEach((N, I) => {
        if (!N || typeof N.start != "function") {
          console.error(`[PLAYER] Part ${I} is invalid:`, N);
          return;
        }
        try {
          N.start(0);
        } catch (x) {
          console.error(`[PLAYER] Failed to start part ${I}:`, x);
        }
      }), k.Transport.start(), A = !0, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', M();
    }
  }), K.addEventListener("input", () => {
    if (k && S > 0) {
      const N = K.value / 100 * S;
      k.Transport.seconds = N, U.textContent = V(N);
    }
  }), D.addEventListener("change", () => {
    const N = parseInt(D.value);
    k && N >= 60 && N <= 240 ? k.Transport.bpm.value = N : D.value = k ? k.Transport.bpm.value : u;
  }), b.forEach((N) => {
    N.addEventListener("change", () => {
      k && O.length > 0 && J();
    });
  }), re.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), ve.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  });
  const R = typeof window < "u" && window.Tone || (typeof k < "u" ? k : null);
  if (R && Q().then(() => {
    J(), t && setTimeout(() => {
      se.click();
    }, 500);
  }), t && !R) {
    const N = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof k < "u" ? k : null)) && (clearInterval(N), setTimeout(() => {
        se.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(N);
    }, 1e4);
  }
  return h;
}
function hr(s, e = 0.25, t = "nearest") {
  if (typeof s != "number" || !isFinite(s)) return s;
  const r = s / e;
  let n;
  switch (t) {
    case "floor":
      n = Math.floor(r);
      break;
    case "ceil":
      n = Math.ceil(r);
      break;
    case "nearest":
    default:
      n = Math.round(r);
  }
  return n * e;
}
function ti(s, { grid: e = 0.25, fields: t = ["time", "duration"], mode: r = "nearest" } = {}) {
  return Array.isArray(s) ? s.map((n) => {
    const i = { ...n };
    return t.forEach((o) => {
      typeof i[o] == "number" && (i[o] = hr(i[o], e, r));
    }), i;
  }) : s;
}
function ri(s, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !s || !Array.isArray(s.notes) ? s : {
    ...s,
    notes: ti(s.notes, { grid: e, fields: ["time", "duration"], mode: t })
  };
}
function qo(s, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !s || !Array.isArray(s.tracks) ? s : {
    ...s,
    tracks: s.tracks.map((r) => ri(r, { grid: e, mode: t }))
  };
}
function ni(s, e = 0.25) {
  const t = Math.round(1 / e), r = Math.round(s / e);
  return r <= 0 || r === t ? "" : r % t === 0 ? String(r / t) : `${r}/${t}`;
}
const Ct = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: ni,
  quantize: hr,
  quantizeComposition: qo,
  quantizeEvents: ti,
  quantizeTrack: ri
}, Symbol.toStringTag, { value: "Module" }));
class Oo {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new or(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(e);
    if (!r)
      throw console.warn("JMON non valide pour conversion ABC:", i), new Error("JMON non valide");
    return this.convertToAbc(n);
  }
  /**
   * Helper function to parse time strings with fallback
   * @param {string|number} timeString - time value
   * @param {number} bpm - beats per minute
   * @returns {number} parsed time in seconds
   */
  static parseTimeString(e, t) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    try {
      if (jmonTone && jmonTone._parseTimeString)
        return jmonTone._parseTimeString(e, t);
    } catch {
    }
    if (e.includes(":")) {
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, o = r[2] || 0, a = 60 / t, c = a * 4, u = a / 480;
      return n * c + i * a + o * u;
    }
    if (e.match(/^\d+[nthq]$/)) {
      const r = parseInt(e), n = e.slice(-1), i = 60 / t;
      switch (n) {
        case "n":
          return i * (4 / r);
        case "t":
          return i * (4 / r) * (2 / 3);
        case "h":
          return i * 2;
        case "q":
          return i;
        default:
          return i;
      }
    }
    return parseFloat(e) || 0;
  }
  static convertToAbc(e, t = {}) {
    let r = `X:1
`;
    r += `T:${e.metadata?.title || e.metadata?.name || e.label || "Untitled"}
`, r += `M:${e.timeSignature || "4/4"}
`, r += `L:1/4
`, r += `Q:1/4=${e.bpm || 120}
`, r += `K:${e.keySignature || "C"}
`;
    const n = e.timeSignature || "4/4", [i, o] = n.split("/").map(Number), a = i * (4 / o), c = t.measuresPerLine || 4, u = t.lineBreaks || [], d = t.renderMode || "merged", g = t.trackIndex || 0, _ = !!t.hideRests, w = t.showArticulations !== !1, S = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (S.length === 0) return r;
    const m = (() => {
      let p = 0;
      return S.forEach((l) => {
        const f = l.notes || l;
        Array.isArray(f) && f.forEach((y) => {
          const $ = typeof y.time == "number" ? y.time : 0, b = typeof y.duration == "number" ? y.duration : 1, P = $ + b;
          P > p && (p = P);
        });
      }), p;
    })(), h = Math.max(1, Math.ceil(m / a));
    if (d === "tracks" && S.length > 1)
      r += "%%score {", S.forEach((p, l) => {
        l > 0 && (r += " | "), r += `${l + 1}`;
      }), r += `}
`, S.forEach((p, l) => {
        const f = p.notes || p;
        if (f.length === 0) return;
        const y = l + 1, $ = p.label || `Track ${l + 1}`, b = $.length > 12 ? $.substring(0, 10) + ".." : $, P = p.instrument ? ` [${p.instrument}]` : "";
        r += `V:${y} name="${$}${P}" snm="${b}"
`;
        const T = f.filter((D) => D.pitch !== void 0).sort((D, z) => (D.time || 0) - (z.time || 0)), { abcNotesStr: q } = this.convertNotesToAbc(T, a, c, u, { hideRests: _, showArticulations: w, padMeasures: h });
        q.trim() && (r += q + `
`);
      });
    else if (d === "drums") {
      r += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const p = t.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, l = (b) => {
        const P = (b || "").toLowerCase();
        for (const T of Object.keys(p))
          if (P.includes(T)) return p[T];
        return "E";
      }, f = [];
      S.forEach((b) => {
        const P = b.notes || b, T = b.label || "", q = l(T);
        (P || []).forEach((D) => {
          D.pitch !== void 0 && f.push({
            time: typeof D.time == "number" ? D.time : 0,
            duration: typeof D.duration == "number" ? D.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: q,
            articulation: D.articulation
          });
        });
      });
      const y = f.sort((b, P) => (b.time || 0) - (P.time || 0)), { abcNotesStr: $ } = this.convertNotesToAbc(y, a, c, u, { hideRests: _, showArticulations: w, padMeasures: h });
      $.trim() && (r += $ + `
`);
    } else if (d === "single") {
      const p = S[g];
      if (p) {
        const f = (p.notes || p).filter(($) => $.pitch !== void 0).sort(($, b) => ($.time || 0) - (b.time || 0)), { abcNotesStr: y } = this.convertNotesToAbc(f, a, c, u, { hideRests: _, showArticulations: w, padMeasures: h });
        y.trim() && (r += y + `
`);
      }
    } else {
      const p = [];
      S.forEach((y) => {
        (y.notes || y).forEach((b) => {
          b.pitch !== void 0 && p.push(b);
        });
      });
      const l = p.sort((y, $) => (y.time || 0) - ($.time || 0)), { abcNotesStr: f } = this.convertNotesToAbc(l, a, c, u, { hideRests: _, showArticulations: w, padMeasures: h });
      f.trim() && (r += f + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}) {
    let o = "", a = 0, c = 0, u = 0, d = 0;
    const g = options?.quantizeBeats || 0.25, _ = 1e-6, w = (y) => hr(y, g, "nearest"), S = (y) => ni(y, g), m = (y) => {
      o += y + " ";
    }, h = () => {
      for (; a >= t - 1e-9; )
        m("|"), a -= t, c++, u++, (n.includes(c) || u >= r) && (o += `
`, u = 0);
    }, p = (y, { forceVisible: $ = !1 } = {}) => {
      let b = y;
      for (; b > 0; ) {
        const P = t - a, T = w(Math.min(b, P));
        let q = i.hideRests && !$ ? "x" : "z";
        q += S(T), m(q), a = w(a + T), h(), b = w(b - T);
      }
    };
    for (const y of e) {
      const $ = typeof y.time == "number" ? w(y.time) : 0, b = typeof y.duration == "number" ? w(y.duration) : 1, P = w($ - d);
      P > _ && p(P);
      let T = "z";
      if (typeof y.pitch == "number") {
        const D = y.pitch, z = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], U = Math.floor(D / 12) - 1, B = D % 12;
        T = z[B].replace("#", "^"), U >= 4 ? (T = T.toLowerCase(), U > 4 && (T += "'".repeat(U - 4))) : U < 4 && (T = T.toUpperCase(), U < 3 && (T += ",".repeat(3 - U)));
      } else typeof y.pitch == "string" ? T = y.pitch : y.pitch === null && (T = i.hideRests ? "x" : "z");
      let q = T;
      q += S(b), i.showArticulations && (y.articulation === "staccato" && (q += "."), y.articulation === "accent" && (q += ">"), y.articulation === "tenuto" && (q += "-"), y.articulation === "marcato" && (q += "^")), m(q), a = w(a + b), h(), d = w($ + b);
    }
    const l = i.padMeasures || 0;
    for (; c < l; ) {
      const y = w(t - a);
      y > _ && p(y, { forceVisible: !0 }), m("|"), a = 0, c++;
    }
    const f = o.trim();
    return f && !f.endsWith("|") && (o += "|"), { abcNotesStr: o };
  }
}
function ii(s, e = {}) {
  return Oo.convertToAbc(s, e);
}
class fr {
  static midiToNoteName(e) {
    const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], r = Math.floor(e / 12) - 1, n = e % 12;
    return t[n] + r;
  }
  static convert(e) {
    const t = e.bpm || 120, r = e.tracks || [];
    return {
      header: {
        bpm: t,
        timeSignature: e.timeSignature || "4/4"
      },
      tracks: r.map((n) => ({
        label: n.label,
        notes: n.notes.map((i) => ({
          pitch: i.pitch,
          noteName: typeof i.pitch == "number" ? fr.midiToNoteName(i.pitch) : i.pitch,
          time: i.time,
          duration: i.duration,
          velocity: i.velocity || 0.8,
          articulation: i.articulation || null
        }))
      }))
    };
  }
}
function xo(s) {
  return fr.convert(s);
}
function Do(s, e = {}) {
  return {
    sampleRate: e.sampleRate || 44100,
    duration: e.duration || 10,
    channels: e.channels || 1,
    bpm: s.bpm || 120,
    notes: s.tracks?.flatMap((t) => t.notes) || []
  };
}
class zo {
  static convert(e) {
    let r = `// SuperCollider script generated from JMON
// Title: ${e.metadata?.name || "Untitled"}
`;
    return (e.tracks?.[0]?.notes || []).forEach((i) => {
      r += `Synth("default", ["freq", ${i.pitch}, "dur", ${i.duration}]);
`;
    }), r;
  }
}
function Vo(s) {
  return zo.convert(s);
}
function Fo(s) {
  return new or().validateAndNormalize(s);
}
function Lo(s, e = {}) {
  if (!s || typeof s != "object")
    throw console.error("[RENDER] Invalid JMON object:", s), new Error("render() requires a valid JMON object");
  return !s.sequences && !s.tracks && !s.format && console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), dr(s, e);
}
function Uo(s, e = {}) {
  const t = { autoplay: !1, ...e };
  return dr(s, t);
}
async function Bo(s, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: o = {},
    ABCJS: a = null,
    abcjs: c = null,
    // Support lowercase alias
    autoload: u = !0
  } = e, d = ii(s, o), g = document.createElement("div");
  g.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const _ = document.createElement("div");
  if (_.id = `rendered-score-${Date.now()}`, _.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, g.appendChild(_), n) {
    const S = document.createElement("details");
    S.style.marginTop = "15px";
    const m = document.createElement("summary");
    m.textContent = "ABC Notation (click to expand)", m.style.cursor = "pointer", S.appendChild(m);
    const h = document.createElement("pre");
    h.textContent = d, h.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, S.appendChild(h), g.appendChild(S);
  }
  let w = a || c || typeof window < "u" && window.ABCJS || (typeof ABCJS < "u" ? ABCJS : null);
  if (!w && u)
    try {
      if (typeof require < "u")
        console.log("[SCORE] Loading ABCJS via require()..."), w = await require("abcjs");
      else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const S = await import("https://cdn.skypack.dev/abcjs");
        w = S.default || S;
      }
      if (!w || !w.renderAbc) {
        console.warn("[SCORE] First load attempt failed, trying alternative CDN...");
        try {
          const S = await import("https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js");
          if (w = S.default || S.ABCJS || typeof window < "u" && window.ABCJS, !w || !w.renderAbc)
            throw new Error("Alternative CDN also failed");
        } catch (S) {
          console.warn("[SCORE] Could not auto-load ABCJS:", S.message), w = null;
        }
      }
      w && (console.log("[SCORE] ABCJS loaded successfully, version:", w.version || "unknown"), typeof window < "u" && (window.ABCJS = w));
    } catch (S) {
      console.warn("[SCORE] Could not auto-load ABCJS:", S.message), console.log("[SCORE] To use score rendering, load ABCJS manually first:"), console.log('Method 1: ABCJS = await require("abcjs")'), console.log('Method 2: ABCJS = await import("https://cdn.skypack.dev/abcjs").then(m => m.default)'), w = null;
    }
  if (w && w.renderAbc)
    try {
      const S = r || null, m = { responsive: i, scale: t };
      S && (m.staffwidth = S), w.renderAbc(_, d, m), setTimeout(() => {
        if (_.children.length === 0 || _.innerHTML.trim() === "")
          try {
            w.renderAbc(_, d), _.children.length === 0 && (_.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + d + "</pre>");
          } catch {
            _.innerHTML = "<p>Error with alternative rendering</p><pre>" + d + "</pre>";
          }
      }, 200);
    } catch (S) {
      console.error("[SCORE] Error rendering with ABCJS:", S), _.innerHTML = "<p>Error rendering notation</p><pre>" + d + "</pre>";
    }
  else {
    const S = u ? "ABCJS not available and auto-loading failed - showing text notation only" : "ABCJS not provided and auto-loading disabled - showing text notation only";
    _.innerHTML = `<p>${S}</p><pre>` + d + "</pre>", !w && u && (console.log("[SCORE] To use visual score rendering, try:"), console.log('ABCJS = await require("abcjs"), then jm.score(composition, { ABCJS })'));
  }
  return g;
}
const Go = {
  // Core functionality
  render: Lo,
  play: Uo,
  score: Bo,
  validate: Fo,
  // Core formats and players
  createPlayer: dr,
  // Converters
  converters: {
    abc: ii,
    midi: xo,
    tonejs: ei,
    wav: Do,
    supercollider: Vo
  },
  // Theory and algorithms
  theory: Ue.theory,
  generative: Ue.generative,
  analysis: Ue.analysis,
  constants: Ue.constants,
  // Utils
  utils: {
    ...Ue.utils,
    JmonValidator: or,
    // Expose utility helpers
    quantize: (s, e, t) => Promise.resolve().then(() => Ct).then((r) => r.quantize(s, e, t)),
    quantizeEvents: async (s, e) => (await Promise.resolve().then(() => Ct)).quantizeEvents(s, e),
    quantizeTrack: async (s, e) => (await Promise.resolve().then(() => Ct)).quantizeTrack(s, e),
    quantizeComposition: async (s, e) => (await Promise.resolve().then(() => Ct)).quantizeComposition(s, e),
    // JMON utilities - official format helpers
    jmon: co
  },
  VERSION: "1.0.0"
}, Ko = {
  loops: {
    async plotLoops(s, e = 4, t = 1 / 4, r = null, n = {}) {
      const { LoopVisualizer: i } = await import("./LoopVisualizer-DS22P85c.js");
      return i.plotLoops(s, e, t, r, n);
    }
  }
};
Go.visualization = Ko;
export {
  Go as default,
  Go as jm
};
