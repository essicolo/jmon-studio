function di(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Je = { exports: {} }, Lt = {}, Me = {}, Ce = {}, Ut = {}, Gt = {}, Bt = {}, gr;
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
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((h, m) => `${h}${m}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((h, m) => (m instanceof t && (h[m.str] = (h[m.str] || 0) + 1), h), {});
      }
    }
    s._Code = r, s.nil = new r("");
    function n(p, ...l) {
      const h = [p[0]];
      let m = 0;
      for (; m < l.length; )
        a(h, l[m]), h.push(p[++m]);
      return new r(h);
    }
    s._ = n;
    const i = new r("+");
    function o(p, ...l) {
      const h = [$(p[0])];
      let m = 0;
      for (; m < l.length; )
        h.push(i), a(h, l[m]), h.push(i, $(p[++m]));
      return c(h), new r(h);
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
          const h = u(p[l - 1], p[l + 1]);
          if (h !== void 0) {
            p.splice(l - 1, 3, h);
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
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : $(Array.isArray(p) ? p.join(",") : p);
    }
    function _(p) {
      return new r($(p));
    }
    s.stringify = _;
    function $(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    s.safeStringify = $;
    function P(p) {
      return typeof p == "string" && s.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    s.getProperty = P;
    function y(p) {
      if (typeof p == "string" && s.IDENTIFIER.test(p))
        return new r(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    s.getEsmExportName = y;
    function f(p) {
      return new r(p.toString());
    }
    s.regexpCode = f;
  })(Bt)), Bt;
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
        const _ = this.toName(u), { prefix: $ } = _, P = (g = d.key) !== null && g !== void 0 ? g : d.ref;
        let y = this._values[$];
        if (y) {
          const l = y.get(P);
          if (l)
            return l;
        } else
          y = this._values[$] = /* @__PURE__ */ new Map();
        y.set(P, _);
        const f = this._scope[$] || (this._scope[$] = []), p = f.length;
        return f[p] = d.ref, _.setValue(d, { property: $, itemIndex: p }), _;
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
        let $ = e.nil;
        for (const P in u) {
          const y = u[P];
          if (!y)
            continue;
          const f = g[P] = g[P] || /* @__PURE__ */ new Map();
          y.forEach((p) => {
            if (f.has(p))
              return;
            f.set(p, r.Started);
            let l = d(p);
            if (l) {
              const h = this.opts.es5 ? s.varKinds.var : s.varKinds.const;
              $ = (0, e._)`${$}${h} ${p} = ${l};${this.opts._n}`;
            } else if (l = _?.(p))
              $ = (0, e._)`${$}${l}${this.opts._n}`;
            else
              throw new t(p);
            f.set(p, r.Completed);
          });
        }
        return $;
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
        return G(v, this.rhs);
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
    class $ extends i {
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
    class P extends $ {
      render(v) {
        return "{" + v._n + super.render(v) + "}" + v._n;
      }
    }
    class y extends $ {
    }
    class f extends P {
    }
    f.kind = "else";
    class p extends P {
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
          E = this.else = Array.isArray(j) ? new f(j) : j;
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
        return G(v, this.condition), this.else && U(v, this.else.names), v;
      }
    }
    p.kind = "if";
    class l extends P {
    }
    l.kind = "for";
    class h extends l {
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
    class m extends l {
      constructor(v, E, j, F) {
        super(), this.varKind = v, this.name = E, this.from = j, this.to = F;
      }
      render(v) {
        const E = v.es5 ? t.varKinds.var : this.varKind, { name: j, from: F, to: V } = this;
        return `for(${E} ${j}=${F}; ${j}<${V}; ${j}++)` + super.render(v);
      }
      get names() {
        const v = G(super.names, this.from);
        return G(v, this.to);
      }
    }
    class w extends l {
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
    class b extends P {
      constructor(v, E, j) {
        super(), this.name = v, this.args = E, this.async = j;
      }
      render(v) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(v);
      }
    }
    b.kind = "func";
    class S extends $ {
      render(v) {
        return "return " + super.render(v);
      }
    }
    S.kind = "return";
    class T extends P {
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
    class q extends P {
      constructor(v) {
        super(), this.error = v;
      }
      render(v) {
        return `catch(${this.error})` + super.render(v);
      }
    }
    q.kind = "catch";
    class D extends P {
      render(v) {
        return "finally" + super.render(v);
      }
    }
    D.kind = "finally";
    class z {
      constructor(v, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = v, this._scope = new t.Scope({ parent: v }), this._nodes = [new y()];
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
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, f);
      }
      _for(v, E) {
        return this._blockNode(v), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(v, E) {
        return this._for(new h(v), E);
      }
      // `for` statement for a range of values
      forRange(v, E, j, F, V = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Q = this._scope.toName(v);
        return this._for(new m(V, Q, E, j), () => F(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(v, E, j, F = t.varKinds.const) {
        const V = this._scope.toName(v);
        if (this.opts.es5) {
          const Q = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${Q}.length`, (H) => {
            this.var(V, (0, e._)`${Q}[${H}]`), j(V);
          });
        }
        return this._for(new w("of", F, V, E), () => j(V));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(v, E, j, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(v, (0, e._)`Object.keys(${E})`, j);
        const V = this._scope.toName(v);
        return this._for(new w("in", F, V, E), () => j(V));
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
        const E = new S();
        if (this._blockNode(E), this.code(v), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(S);
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
    function G(C, v) {
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
    const ge = N(s.operators.AND);
    function re(...C) {
      return C.reduce(ge);
    }
    s.and = re;
    const ve = N(s.operators.OR);
    function k(...C) {
      return C.reduce(ve);
    }
    s.or = k;
    function N(C) {
      return (v, E) => v === e.nil ? E : E === e.nil ? v : (0, e._)`${O(v)} ${C} ${O(E)}`;
    }
    function O(C) {
      return C instanceof e.Name ? C : (0, e._)`(${C})`;
    }
  })(Gt)), Gt;
}
var J = {}, $r;
function te() {
  if ($r) return J;
  $r = 1, Object.defineProperty(J, "__esModule", { value: !0 }), J.checkStrictMode = J.getErrorPath = J.Type = J.useFunc = J.setEvaluated = J.evaluatedPropsToName = J.mergeEvaluated = J.eachItem = J.unescapeJsonPointer = J.escapeJsonPointer = J.escapeFragment = J.unescapeFragment = J.schemaRefOrVal = J.schemaHasRulesButRef = J.schemaHasRules = J.checkUnknownRules = J.alwaysValidSchema = J.toHash = void 0;
  const s = W(), e = It();
  function t(w) {
    const b = {};
    for (const S of w)
      b[S] = !0;
    return b;
  }
  J.toHash = t;
  function r(w, b) {
    return typeof b == "boolean" ? b : Object.keys(b).length === 0 ? !0 : (n(w, b), !i(b, w.self.RULES.all));
  }
  J.alwaysValidSchema = r;
  function n(w, b = w.schema) {
    const { opts: S, self: T } = w;
    if (!S.strictSchema || typeof b == "boolean")
      return;
    const q = T.RULES.keywords;
    for (const D in b)
      q[D] || m(w, `unknown keyword: "${D}"`);
  }
  J.checkUnknownRules = n;
  function i(w, b) {
    if (typeof w == "boolean")
      return !w;
    for (const S in w)
      if (b[S])
        return !0;
    return !1;
  }
  J.schemaHasRules = i;
  function o(w, b) {
    if (typeof w == "boolean")
      return !w;
    for (const S in w)
      if (S !== "$ref" && b.all[S])
        return !0;
    return !1;
  }
  J.schemaHasRulesButRef = o;
  function a({ topSchemaRef: w, schemaPath: b }, S, T, q) {
    if (!q) {
      if (typeof S == "number" || typeof S == "boolean")
        return S;
      if (typeof S == "string")
        return (0, s._)`${S}`;
    }
    return (0, s._)`${w}${b}${(0, s.getProperty)(T)}`;
  }
  J.schemaRefOrVal = a;
  function c(w) {
    return g(decodeURIComponent(w));
  }
  J.unescapeFragment = c;
  function u(w) {
    return encodeURIComponent(d(w));
  }
  J.escapeFragment = u;
  function d(w) {
    return typeof w == "number" ? `${w}` : w.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  J.escapeJsonPointer = d;
  function g(w) {
    return w.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  J.unescapeJsonPointer = g;
  function _(w, b) {
    if (Array.isArray(w))
      for (const S of w)
        b(S);
    else
      b(w);
  }
  J.eachItem = _;
  function $({ mergeNames: w, mergeToName: b, mergeValues: S, resultToName: T }) {
    return (q, D, z, U) => {
      const G = z === void 0 ? D : z instanceof s.Name ? (D instanceof s.Name ? w(q, D, z) : b(q, D, z), z) : D instanceof s.Name ? (b(q, z, D), D) : S(D, z);
      return U === s.Name && !(G instanceof s.Name) ? T(q, G) : G;
    };
  }
  J.mergeEvaluated = {
    props: $({
      mergeNames: (w, b, S) => w.if((0, s._)`${S} !== true && ${b} !== undefined`, () => {
        w.if((0, s._)`${b} === true`, () => w.assign(S, !0), () => w.assign(S, (0, s._)`${S} || {}`).code((0, s._)`Object.assign(${S}, ${b})`));
      }),
      mergeToName: (w, b, S) => w.if((0, s._)`${S} !== true`, () => {
        b === !0 ? w.assign(S, !0) : (w.assign(S, (0, s._)`${S} || {}`), y(w, S, b));
      }),
      mergeValues: (w, b) => w === !0 ? !0 : { ...w, ...b },
      resultToName: P
    }),
    items: $({
      mergeNames: (w, b, S) => w.if((0, s._)`${S} !== true && ${b} !== undefined`, () => w.assign(S, (0, s._)`${b} === true ? true : ${S} > ${b} ? ${S} : ${b}`)),
      mergeToName: (w, b, S) => w.if((0, s._)`${S} !== true`, () => w.assign(S, b === !0 ? !0 : (0, s._)`${S} > ${b} ? ${S} : ${b}`)),
      mergeValues: (w, b) => w === !0 ? !0 : Math.max(w, b),
      resultToName: (w, b) => w.var("items", b)
    })
  };
  function P(w, b) {
    if (b === !0)
      return w.var("props", !0);
    const S = w.var("props", (0, s._)`{}`);
    return b !== void 0 && y(w, S, b), S;
  }
  J.evaluatedPropsToName = P;
  function y(w, b, S) {
    Object.keys(S).forEach((T) => w.assign((0, s._)`${b}${(0, s.getProperty)(T)}`, !0));
  }
  J.setEvaluated = y;
  const f = {};
  function p(w, b) {
    return w.scopeValue("func", {
      ref: b,
      code: f[b.code] || (f[b.code] = new e._Code(b.code))
    });
  }
  J.useFunc = p;
  var l;
  (function(w) {
    w[w.Num = 0] = "Num", w[w.Str = 1] = "Str";
  })(l || (J.Type = l = {}));
  function h(w, b, S) {
    if (w instanceof s.Name) {
      const T = b === l.Num;
      return S ? T ? (0, s._)`"[" + ${w} + "]"` : (0, s._)`"['" + ${w} + "']"` : T ? (0, s._)`"/" + ${w}` : (0, s._)`"/" + ${w}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return S ? (0, s.getProperty)(w).toString() : "/" + d(w);
  }
  J.getErrorPath = h;
  function m(w, b, S = w.opts.strictSchema) {
    if (S) {
      if (b = `strict mode: ${b}`, S === !0)
        throw new Error(b);
      w.self.logger.warn(b);
    }
  }
  return J.checkStrictMode = m, J;
}
var We = {}, _r;
function Ae() {
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
var Pr;
function xt() {
  return Pr || (Pr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.extendErrors = s.resetErrorsCount = s.reportExtraError = s.reportError = s.keyword$DataError = s.keywordError = void 0;
    const e = W(), t = te(), r = Ae();
    s.keywordError = {
      message: ({ keyword: f }) => (0, e.str)`must pass "${f}" keyword validation`
    }, s.keyword$DataError = {
      message: ({ keyword: f, schemaType: p }) => p ? (0, e.str)`"${f}" keyword must be ${p} ($data)` : (0, e.str)`"${f}" keyword is invalid ($data)`
    };
    function n(f, p = s.keywordError, l, h) {
      const { it: m } = f, { gen: w, compositeRule: b, allErrors: S } = m, T = g(f, p, l);
      h ?? (b || S) ? c(w, T) : u(m, (0, e._)`[${T}]`);
    }
    s.reportError = n;
    function i(f, p = s.keywordError, l) {
      const { it: h } = f, { gen: m, compositeRule: w, allErrors: b } = h, S = g(f, p, l);
      c(m, S), w || b || u(h, r.default.vErrors);
    }
    s.reportExtraError = i;
    function o(f, p) {
      f.assign(r.default.errors, p), f.if((0, e._)`${r.default.vErrors} !== null`, () => f.if(p, () => f.assign((0, e._)`${r.default.vErrors}.length`, p), () => f.assign(r.default.vErrors, null)));
    }
    s.resetErrorsCount = o;
    function a({ gen: f, keyword: p, schemaValue: l, data: h, errsCount: m, it: w }) {
      if (m === void 0)
        throw new Error("ajv implementation error");
      const b = f.name("err");
      f.forRange("i", m, r.default.errors, (S) => {
        f.const(b, (0, e._)`${r.default.vErrors}[${S}]`), f.if((0, e._)`${b}.instancePath === undefined`, () => f.assign((0, e._)`${b}.instancePath`, (0, e.strConcat)(r.default.instancePath, w.errorPath))), f.assign((0, e._)`${b}.schemaPath`, (0, e.str)`${w.errSchemaPath}/${p}`), w.opts.verbose && (f.assign((0, e._)`${b}.schema`, l), f.assign((0, e._)`${b}.data`, h));
      });
    }
    s.extendErrors = a;
    function c(f, p) {
      const l = f.const("err", p);
      f.if((0, e._)`${r.default.vErrors} === null`, () => f.assign(r.default.vErrors, (0, e._)`[${l}]`), (0, e._)`${r.default.vErrors}.push(${l})`), f.code((0, e._)`${r.default.errors}++`);
    }
    function u(f, p) {
      const { gen: l, validateName: h, schemaEnv: m } = f;
      m.$async ? l.throw((0, e._)`new ${f.ValidationError}(${p})`) : (l.assign((0, e._)`${h}.errors`, p), l.return(!1));
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
    function g(f, p, l) {
      const { createErrors: h } = f.it;
      return h === !1 ? (0, e._)`{}` : _(f, p, l);
    }
    function _(f, p, l = {}) {
      const { gen: h, it: m } = f, w = [
        $(m, l),
        P(f, l)
      ];
      return y(f, p, w), h.object(...w);
    }
    function $({ errorPath: f }, { instancePath: p }) {
      const l = p ? (0, e.str)`${f}${(0, t.getErrorPath)(p, t.Type.Str)}` : f;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, l)];
    }
    function P({ keyword: f, it: { errSchemaPath: p } }, { schemaPath: l, parentSchema: h }) {
      let m = h ? p : (0, e.str)`${p}/${f}`;
      return l && (m = (0, e.str)`${m}${(0, t.getErrorPath)(l, t.Type.Str)}`), [d.schemaPath, m];
    }
    function y(f, { params: p, message: l }, h) {
      const { keyword: m, data: w, schemaValue: b, it: S } = f, { opts: T, propertyName: q, topSchemaRef: D, schemaPath: z } = S;
      h.push([d.keyword, m], [d.params, typeof p == "function" ? p(f) : p || (0, e._)`{}`]), T.messages && h.push([d.message, typeof l == "function" ? l(f) : l]), T.verbose && h.push([d.schema, b], [d.parentSchema, (0, e._)`${D}${z}`], [r.default.data, w]), q && h.push([d.propertyName, q]);
    }
  })(Ut)), Ut;
}
var Sr;
function hi() {
  if (Sr) return Ce;
  Sr = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.boolOrEmptySchema = Ce.topBoolOrEmptySchema = void 0;
  const s = xt(), e = W(), t = Ae(), r = {
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
    const h = a(l.type);
    if (h.includes("null")) {
      if (l.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!h.length && l.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      l.nullable === !0 && h.push("null");
    }
    return h;
  }
  de.getSchemaTypes = o;
  function a(l) {
    const h = Array.isArray(l) ? l : l ? [l] : [];
    if (h.every(s.isJSONType))
      return h;
    throw new Error("type must be JSONType or JSONType[]: " + h.join(","));
  }
  de.getJSONTypes = a;
  function c(l, h) {
    const { gen: m, data: w, opts: b } = l, S = d(h, b.coerceTypes), T = h.length > 0 && !(S.length === 0 && h.length === 1 && (0, e.schemaHasRulesForType)(l, h[0]));
    if (T) {
      const q = P(h, w, b.strictNumbers, i.Wrong);
      m.if(q, () => {
        S.length ? g(l, h, S) : f(l);
      });
    }
    return T;
  }
  de.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(l, h) {
    return h ? l.filter((m) => u.has(m) || h === "array" && m === "array") : [];
  }
  function g(l, h, m) {
    const { gen: w, data: b, opts: S } = l, T = w.let("dataType", (0, r._)`typeof ${b}`), q = w.let("coerced", (0, r._)`undefined`);
    S.coerceTypes === "array" && w.if((0, r._)`${T} == 'object' && Array.isArray(${b}) && ${b}.length == 1`, () => w.assign(b, (0, r._)`${b}[0]`).assign(T, (0, r._)`typeof ${b}`).if(P(h, b, S.strictNumbers), () => w.assign(q, b))), w.if((0, r._)`${q} !== undefined`);
    for (const z of m)
      (u.has(z) || z === "array" && S.coerceTypes === "array") && D(z);
    w.else(), f(l), w.endIf(), w.if((0, r._)`${q} !== undefined`, () => {
      w.assign(b, q), _(l, q);
    });
    function D(z) {
      switch (z) {
        case "string":
          w.elseIf((0, r._)`${T} == "number" || ${T} == "boolean"`).assign(q, (0, r._)`"" + ${b}`).elseIf((0, r._)`${b} === null`).assign(q, (0, r._)`""`);
          return;
        case "number":
          w.elseIf((0, r._)`${T} == "boolean" || ${b} === null
              || (${T} == "string" && ${b} && ${b} == +${b})`).assign(q, (0, r._)`+${b}`);
          return;
        case "integer":
          w.elseIf((0, r._)`${T} === "boolean" || ${b} === null
              || (${T} === "string" && ${b} && ${b} == +${b} && !(${b} % 1))`).assign(q, (0, r._)`+${b}`);
          return;
        case "boolean":
          w.elseIf((0, r._)`${b} === "false" || ${b} === 0 || ${b} === null`).assign(q, !1).elseIf((0, r._)`${b} === "true" || ${b} === 1`).assign(q, !0);
          return;
        case "null":
          w.elseIf((0, r._)`${b} === "" || ${b} === 0 || ${b} === false`), w.assign(q, null);
          return;
        case "array":
          w.elseIf((0, r._)`${T} === "string" || ${T} === "number"
              || ${T} === "boolean" || ${b} === null`).assign(q, (0, r._)`[${b}]`);
      }
    }
  }
  function _({ gen: l, parentData: h, parentDataProperty: m }, w) {
    l.if((0, r._)`${h} !== undefined`, () => l.assign((0, r._)`${h}[${m}]`, w));
  }
  function $(l, h, m, w = i.Correct) {
    const b = w === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let S;
    switch (l) {
      case "null":
        return (0, r._)`${h} ${b} null`;
      case "array":
        S = (0, r._)`Array.isArray(${h})`;
        break;
      case "object":
        S = (0, r._)`${h} && typeof ${h} == "object" && !Array.isArray(${h})`;
        break;
      case "integer":
        S = T((0, r._)`!(${h} % 1) && !isNaN(${h})`);
        break;
      case "number":
        S = T();
        break;
      default:
        return (0, r._)`typeof ${h} ${b} ${l}`;
    }
    return w === i.Correct ? S : (0, r.not)(S);
    function T(q = r.nil) {
      return (0, r.and)((0, r._)`typeof ${h} == "number"`, q, m ? (0, r._)`isFinite(${h})` : r.nil);
    }
  }
  de.checkDataType = $;
  function P(l, h, m, w) {
    if (l.length === 1)
      return $(l[0], h, m, w);
    let b;
    const S = (0, n.toHash)(l);
    if (S.array && S.object) {
      const T = (0, r._)`typeof ${h} != "object"`;
      b = S.null ? T : (0, r._)`!${h} || ${T}`, delete S.null, delete S.array, delete S.object;
    } else
      b = r.nil;
    S.number && delete S.integer;
    for (const T in S)
      b = (0, r.and)(b, $(T, h, m, w));
    return b;
  }
  de.checkDataTypes = P;
  const y = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: h }) => typeof l == "string" ? (0, r._)`{type: ${l}}` : (0, r._)`{type: ${h}}`
  };
  function f(l) {
    const h = p(l);
    (0, t.reportError)(h, y);
  }
  de.reportTypeError = f;
  function p(l) {
    const { gen: h, data: m, schema: w } = l, b = (0, n.schemaRefOrVal)(l, w, "type");
    return {
      gen: h,
      keyword: "type",
      data: m,
      schema: w.type,
      schemaCode: b,
      schemaValue: b,
      parentSchema: w,
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
var we = {}, ie = {}, Nr;
function $e() {
  if (Nr) return ie;
  Nr = 1, Object.defineProperty(ie, "__esModule", { value: !0 }), ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
  const s = W(), e = te(), t = Ae(), r = te();
  function n(l, h) {
    const { gen: m, data: w, it: b } = l;
    m.if(d(m, w, h, b.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, s._)`${h}` }, !0), l.error();
    });
  }
  ie.checkReportMissingProp = n;
  function i({ gen: l, data: h, it: { opts: m } }, w, b) {
    return (0, s.or)(...w.map((S) => (0, s.and)(d(l, h, S, m.ownProperties), (0, s._)`${b} = ${S}`)));
  }
  ie.checkMissingProp = i;
  function o(l, h) {
    l.setParams({ missingProperty: h }, !0), l.error();
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
  function c(l, h, m) {
    return (0, s._)`${a(l)}.call(${h}, ${m})`;
  }
  ie.isOwnProperty = c;
  function u(l, h, m, w) {
    const b = (0, s._)`${h}${(0, s.getProperty)(m)} !== undefined`;
    return w ? (0, s._)`${b} && ${c(l, h, m)}` : b;
  }
  ie.propertyInData = u;
  function d(l, h, m, w) {
    const b = (0, s._)`${h}${(0, s.getProperty)(m)} === undefined`;
    return w ? (0, s.or)(b, (0, s.not)(c(l, h, m))) : b;
  }
  ie.noPropertyInData = d;
  function g(l) {
    return l ? Object.keys(l).filter((h) => h !== "__proto__") : [];
  }
  ie.allSchemaProperties = g;
  function _(l, h) {
    return g(h).filter((m) => !(0, e.alwaysValidSchema)(l, h[m]));
  }
  ie.schemaProperties = _;
  function $({ schemaCode: l, data: h, it: { gen: m, topSchemaRef: w, schemaPath: b, errorPath: S }, it: T }, q, D, z) {
    const U = z ? (0, s._)`${l}, ${h}, ${w}${b}` : h, G = [
      [t.default.instancePath, (0, s.strConcat)(t.default.instancePath, S)],
      [t.default.parentData, T.parentData],
      [t.default.parentDataProperty, T.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    T.opts.dynamicRef && G.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const K = (0, s._)`${U}, ${m.object(...G)}`;
    return D !== s.nil ? (0, s._)`${q}.call(${D}, ${K})` : (0, s._)`${q}(${K})`;
  }
  ie.callValidateCode = $;
  const P = (0, s._)`new RegExp`;
  function y({ gen: l, it: { opts: h } }, m) {
    const w = h.unicodeRegExp ? "u" : "", { regExp: b } = h.code, S = b(m, w);
    return l.scopeValue("pattern", {
      key: S.toString(),
      ref: S,
      code: (0, s._)`${b.code === "new RegExp" ? P : (0, r.useFunc)(l, b)}(${m}, ${w})`
    });
  }
  ie.usePattern = y;
  function f(l) {
    const { gen: h, data: m, keyword: w, it: b } = l, S = h.name("valid");
    if (b.allErrors) {
      const q = h.let("valid", !0);
      return T(() => h.assign(q, !1)), q;
    }
    return h.var(S, !0), T(() => h.break()), S;
    function T(q) {
      const D = h.const("len", (0, s._)`${m}.length`);
      h.forRange("i", 0, D, (z) => {
        l.subschema({
          keyword: w,
          dataProp: z,
          dataPropType: e.Type.Num
        }, S), h.if((0, s.not)(S), q);
      });
    }
  }
  ie.validateArray = f;
  function p(l) {
    const { gen: h, schema: m, keyword: w, it: b } = l;
    if (!Array.isArray(m))
      throw new Error("ajv implementation error");
    if (m.some((D) => (0, e.alwaysValidSchema)(b, D)) && !b.opts.unevaluated)
      return;
    const T = h.let("valid", !1), q = h.name("_valid");
    h.block(() => m.forEach((D, z) => {
      const U = l.subschema({
        keyword: w,
        schemaProp: z,
        compositeRule: !0
      }, q);
      h.assign(T, (0, s._)`${T} || ${q}`), l.mergeValidEvaluated(U, q) || h.if((0, s.not)(T));
    })), l.result(T, () => l.reset(), () => l.error(!0));
  }
  return ie.validateUnion = p, ie;
}
var Ar;
function pi() {
  if (Ar) return we;
  Ar = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.validateKeywordUsage = we.validSchemaType = we.funcKeywordCode = we.macroKeywordCode = void 0;
  const s = W(), e = Ae(), t = $e(), r = xt();
  function n(_, $) {
    const { gen: P, keyword: y, schema: f, parentSchema: p, it: l } = _, h = $.macro.call(l.self, f, p, l), m = u(P, y, h);
    l.opts.validateSchema !== !1 && l.self.validateSchema(h, !0);
    const w = P.name("valid");
    _.subschema({
      schema: h,
      schemaPath: s.nil,
      errSchemaPath: `${l.errSchemaPath}/${y}`,
      topSchemaRef: m,
      compositeRule: !0
    }, w), _.pass(w, () => _.error(!0));
  }
  we.macroKeywordCode = n;
  function i(_, $) {
    var P;
    const { gen: y, keyword: f, schema: p, parentSchema: l, $data: h, it: m } = _;
    c(m, $);
    const w = !h && $.compile ? $.compile.call(m.self, p, l, m) : $.validate, b = u(y, f, w), S = y.let("valid");
    _.block$data(S, T), _.ok((P = $.valid) !== null && P !== void 0 ? P : S);
    function T() {
      if ($.errors === !1)
        z(), $.modifying && o(_), U(() => _.error());
      else {
        const G = $.async ? q() : D();
        $.modifying && o(_), U(() => a(_, G));
      }
    }
    function q() {
      const G = y.let("ruleErrs", null);
      return y.try(() => z((0, s._)`await `), (K) => y.assign(S, !1).if((0, s._)`${K} instanceof ${m.ValidationError}`, () => y.assign(G, (0, s._)`${K}.errors`), () => y.throw(K))), G;
    }
    function D() {
      const G = (0, s._)`${b}.errors`;
      return y.assign(G, null), z(s.nil), G;
    }
    function z(G = $.async ? (0, s._)`await ` : s.nil) {
      const K = m.opts.passContext ? e.default.this : e.default.self, se = !("compile" in $ && !h || $.schema === !1);
      y.assign(S, (0, s._)`${G}${(0, t.callValidateCode)(_, b, K, se)}`, $.modifying);
    }
    function U(G) {
      var K;
      y.if((0, s.not)((K = $.valid) !== null && K !== void 0 ? K : S), G);
    }
  }
  we.funcKeywordCode = i;
  function o(_) {
    const { gen: $, data: P, it: y } = _;
    $.if(y.parentData, () => $.assign(P, (0, s._)`${y.parentData}[${y.parentDataProperty}]`));
  }
  function a(_, $) {
    const { gen: P } = _;
    P.if((0, s._)`Array.isArray(${$})`, () => {
      P.assign(e.default.vErrors, (0, s._)`${e.default.vErrors} === null ? ${$} : ${e.default.vErrors}.concat(${$})`).assign(e.default.errors, (0, s._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function c({ schemaEnv: _ }, $) {
    if ($.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, $, P) {
    if (P === void 0)
      throw new Error(`keyword "${$}" failed to compile`);
    return _.scopeValue("keyword", typeof P == "function" ? { ref: P } : { ref: P, code: (0, s.stringify)(P) });
  }
  function d(_, $, P = !1) {
    return !$.length || $.some((y) => y === "array" ? Array.isArray(_) : y === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == y || P && typeof _ > "u");
  }
  we.validSchemaType = d;
  function g({ schema: _, opts: $, self: P, errSchemaPath: y }, f, p) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(p) : f.keyword !== p)
      throw new Error("ajv implementation error");
    const l = f.dependencies;
    if (l?.some((h) => !Object.prototype.hasOwnProperty.call(_, h)))
      throw new Error(`parent schema must have dependencies of ${p}: ${l.join(",")}`);
    if (f.validateSchema && !f.validateSchema(_[p])) {
      const m = `keyword "${p}" value is invalid at path "${y}": ` + P.errorsText(f.validateSchema.errors);
      if ($.validateSchema === "log")
        P.logger.error(m);
      else
        throw new Error(m);
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
      const { errorPath: P, dataPathArr: y, opts: f } = o, p = _.let("data", (0, s._)`${o.data}${(0, s.getProperty)(a)}`, !0);
      $(p), i.errorPath = (0, s.str)`${P}${(0, e.getErrorPath)(a, c, f.jsPropertySyntax)}`, i.parentDataProperty = (0, s._)`${a}`, i.dataPathArr = [...y, i.parentDataProperty];
    }
    if (u !== void 0) {
      const P = u instanceof s.Name ? u : _.let("data", u, !0);
      $(P), g !== void 0 && (i.propertyName = g);
    }
    d && (i.dataTypes = d);
    function $(P) {
      i.data = P, i.dataLevel = o.dataLevel + 1, i.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), i.parentData = o.data, i.dataNames = [...o.dataNames, P];
    }
  }
  ke.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), u !== void 0 && (i.createErrors = u), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = o, i.jtdMetadata = a;
  }
  return ke.extendSubschemaMode = n, ke;
}
var fe = {}, Ht, Cr;
function On() {
  return Cr || (Cr = 1, Ht = function s(e, t) {
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
  }), Ht;
}
var Jt = { exports: {} }, jr;
function yi() {
  if (jr) return Jt.exports;
  jr = 1;
  var s = Jt.exports = function(r, n, i) {
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
      for (var $ in o) {
        var P = o[$];
        if (Array.isArray(P)) {
          if ($ in s.arrayKeywords)
            for (var y = 0; y < P.length; y++)
              e(r, n, i, P[y], a + "/" + $ + "/" + y, c, a, $, o, y);
        } else if ($ in s.propsKeywords) {
          if (P && typeof P == "object")
            for (var f in P)
              e(r, n, i, P[f], a + "/" + $ + "/" + t(f), c, a, $, o, f);
        } else ($ in s.keywords || r.allKeys && !($ in s.skipKeywords)) && e(r, n, i, P, a + "/" + $, c, a, $, o);
      }
      i(o, a, c, u, d, g, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Jt.exports;
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
  function n(y, f = !0) {
    return typeof y == "boolean" ? !0 : f === !0 ? !o(y) : f ? a(y) <= f : !1;
  }
  fe.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(y) {
    for (const f in y) {
      if (i.has(f))
        return !0;
      const p = y[f];
      if (Array.isArray(p) && p.some(o) || typeof p == "object" && o(p))
        return !0;
    }
    return !1;
  }
  function a(y) {
    let f = 0;
    for (const p in y) {
      if (p === "$ref")
        return 1 / 0;
      if (f++, !r.has(p) && (typeof y[p] == "object" && (0, s.eachItem)(y[p], (l) => f += a(l)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function c(y, f = "", p) {
    p !== !1 && (f = g(f));
    const l = y.parse(f);
    return u(y, l);
  }
  fe.getFullPath = c;
  function u(y, f) {
    return y.serialize(f).split("#")[0] + "#";
  }
  fe._getFullPath = u;
  const d = /#\/?$/;
  function g(y) {
    return y ? y.replace(d, "") : "";
  }
  fe.normalizeId = g;
  function _(y, f, p) {
    return p = g(p), y.resolve(f, p);
  }
  fe.resolveUrl = _;
  const $ = /^[a-z_][-a-z0-9._]*$/i;
  function P(y, f) {
    if (typeof y == "boolean")
      return {};
    const { schemaId: p, uriResolver: l } = this.opts, h = g(y[p] || f), m = { "": h }, w = c(l, h, !1), b = {}, S = /* @__PURE__ */ new Set();
    return t(y, { allKeys: !0 }, (D, z, U, G) => {
      if (G === void 0)
        return;
      const K = w + z;
      let se = m[G];
      typeof D[p] == "string" && (se = ye.call(this, D[p])), ge.call(this, D.$anchor), ge.call(this, D.$dynamicAnchor), m[z] = se;
      function ye(re) {
        const ve = this.opts.uriResolver.resolve;
        if (re = g(se ? ve(se, re) : re), S.has(re))
          throw q(re);
        S.add(re);
        let k = this.refs[re];
        return typeof k == "string" && (k = this.refs[k]), typeof k == "object" ? T(D, k.schema, re) : re !== g(K) && (re[0] === "#" ? (T(D, b[re], re), b[re] = D) : this.refs[re] = K), re;
      }
      function ge(re) {
        if (typeof re == "string") {
          if (!$.test(re))
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
  return fe.getSchemaRefs = P, fe;
}
var qr;
function zt() {
  if (qr) return Me;
  qr = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.getData = Me.KeywordCxt = Me.validateFunctionCode = void 0;
  const s = hi(), e = qt(), t = qn(), r = qt(), n = fi(), i = pi(), o = mi(), a = W(), c = Ae(), u = Dt(), d = te(), g = xt();
  function _(M) {
    if (w(M) && (S(M), m(M))) {
      f(M);
      return;
    }
    $(M, () => (0, s.topBoolOrEmptySchema)(M));
  }
  Me.validateFunctionCode = _;
  function $({ gen: M, validateName: R, schema: A, schemaEnv: I, opts: x }, L) {
    x.code.es5 ? M.func(R, (0, a._)`${c.default.data}, ${c.default.valCxt}`, I.$async, () => {
      M.code((0, a._)`"use strict"; ${l(A, x)}`), y(M, x), M.code(L);
    }) : M.func(R, (0, a._)`${c.default.data}, ${P(x)}`, I.$async, () => M.code(l(A, x)).code(L));
  }
  function P(M) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${M.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function y(M, R) {
    M.if(c.default.valCxt, () => {
      M.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), M.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), M.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), M.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), R.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      M.var(c.default.instancePath, (0, a._)`""`), M.var(c.default.parentData, (0, a._)`undefined`), M.var(c.default.parentDataProperty, (0, a._)`undefined`), M.var(c.default.rootData, c.default.data), R.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function f(M) {
    const { schema: R, opts: A, gen: I } = M;
    $(M, () => {
      A.$comment && R.$comment && G(M), D(M), I.let(c.default.vErrors, null), I.let(c.default.errors, 0), A.unevaluated && p(M), T(M), K(M);
    });
  }
  function p(M) {
    const { gen: R, validateName: A } = M;
    M.evaluated = R.const("evaluated", (0, a._)`${A}.evaluated`), R.if((0, a._)`${M.evaluated}.dynamicProps`, () => R.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), R.if((0, a._)`${M.evaluated}.dynamicItems`, () => R.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function l(M, R) {
    const A = typeof M == "object" && M[R.schemaId];
    return A && (R.code.source || R.code.process) ? (0, a._)`/*# sourceURL=${A} */` : a.nil;
  }
  function h(M, R) {
    if (w(M) && (S(M), m(M))) {
      b(M, R);
      return;
    }
    (0, s.boolOrEmptySchema)(M, R);
  }
  function m({ schema: M, self: R }) {
    if (typeof M == "boolean")
      return !M;
    for (const A in M)
      if (R.RULES.all[A])
        return !0;
    return !1;
  }
  function w(M) {
    return typeof M.schema != "boolean";
  }
  function b(M, R) {
    const { schema: A, gen: I, opts: x } = M;
    x.$comment && A.$comment && G(M), z(M), U(M);
    const L = I.const("_errs", c.default.errors);
    T(M, L), I.var(R, (0, a._)`${L} === ${c.default.errors}`);
  }
  function S(M) {
    (0, d.checkUnknownRules)(M), q(M);
  }
  function T(M, R) {
    if (M.opts.jtd)
      return ye(M, [], !1, R);
    const A = (0, e.getSchemaTypes)(M.schema), I = (0, e.coerceAndCheckDataType)(M, A);
    ye(M, A, !I, R);
  }
  function q(M) {
    const { schema: R, errSchemaPath: A, opts: I, self: x } = M;
    R.$ref && I.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(R, x.RULES) && x.logger.warn(`$ref: keywords ignored in schema at path "${A}"`);
  }
  function D(M) {
    const { schema: R, opts: A } = M;
    R.default !== void 0 && A.useDefaults && A.strictSchema && (0, d.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function z(M) {
    const R = M.schema[M.opts.schemaId];
    R && (M.baseId = (0, u.resolveUrl)(M.opts.uriResolver, M.baseId, R));
  }
  function U(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function G({ gen: M, schemaEnv: R, schema: A, errSchemaPath: I, opts: x }) {
    const L = A.$comment;
    if (x.$comment === !0)
      M.code((0, a._)`${c.default.self}.logger.log(${L})`);
    else if (typeof x.$comment == "function") {
      const Y = (0, a.str)`${I}/$comment`, Z = M.scopeValue("root", { ref: R.root });
      M.code((0, a._)`${c.default.self}.opts.$comment(${L}, ${Y}, ${Z}.schema)`);
    }
  }
  function K(M) {
    const { gen: R, schemaEnv: A, validateName: I, ValidationError: x, opts: L } = M;
    A.$async ? R.if((0, a._)`${c.default.errors} === 0`, () => R.return(c.default.data), () => R.throw((0, a._)`new ${x}(${c.default.vErrors})`)) : (R.assign((0, a._)`${I}.errors`, c.default.vErrors), L.unevaluated && se(M), R.return((0, a._)`${c.default.errors} === 0`));
  }
  function se({ gen: M, evaluated: R, props: A, items: I }) {
    A instanceof a.Name && M.assign((0, a._)`${R}.props`, A), I instanceof a.Name && M.assign((0, a._)`${R}.items`, I);
  }
  function ye(M, R, A, I) {
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
      (0, t.shouldUseGroup)(L, le) && (le.type ? (x.if((0, r.checkDataType)(le.type, Y, X.strictNumbers)), ge(M, le), R.length === 1 && R[0] === le.type && A && (x.else(), (0, r.reportTypeError)(M)), x.endIf()) : ge(M, le), Z || x.if((0, a._)`${c.default.errors} === ${I || 0}`));
    }
  }
  function ge(M, R) {
    const { gen: A, schema: I, opts: { useDefaults: x } } = M;
    x && (0, n.assignDefaults)(M, R.type), A.block(() => {
      for (const L of R.rules)
        (0, t.shouldUseRule)(I, L) && F(M, L.keyword, L.definition, R.type);
    });
  }
  function re(M, R) {
    M.schemaEnv.meta || !M.opts.strictTypes || (ve(M, R), M.opts.allowUnionTypes || k(M, R), N(M, M.dataTypes));
  }
  function ve(M, R) {
    if (R.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = R;
        return;
      }
      R.forEach((A) => {
        C(M.dataTypes, A) || E(M, `type "${A}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), v(M, R);
    }
  }
  function k(M, R) {
    R.length > 1 && !(R.length === 2 && R.includes("null")) && E(M, "use allowUnionTypes to allow union type keyword");
  }
  function N(M, R) {
    const A = M.self.RULES.all;
    for (const I in A) {
      const x = A[I];
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
    const A = [];
    for (const I of M.dataTypes)
      C(R, I) ? A.push(I) : R.includes("integer") && I === "number" && A.push("integer");
    M.dataTypes = A;
  }
  function E(M, R) {
    const A = M.schemaEnv.baseId + M.errSchemaPath;
    R += ` at "${A}" (strictTypes)`, (0, d.checkStrictMode)(M, R, M.opts.strictTypes);
  }
  class j {
    constructor(R, A, I) {
      if ((0, i.validateKeywordUsage)(R, A, I), this.gen = R.gen, this.allErrors = R.allErrors, this.keyword = I, this.data = R.data, this.schema = R.schema[I], this.$data = A.$data && R.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(R, this.schema, I, this.$data), this.schemaType = A.schemaType, this.parentSchema = R.schema, this.params = {}, this.it = R, this.def = A, this.$data)
        this.schemaCode = R.gen.const("vSchema", H(this.$data, R));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, A.schemaType, A.allowUndefined))
        throw new Error(`${I} value must be ${JSON.stringify(A.schemaType)}`);
      ("code" in A ? A.trackErrors : A.errors !== !1) && (this.errsCount = R.gen.const("_errs", c.default.errors));
    }
    result(R, A, I) {
      this.failResult((0, a.not)(R), A, I);
    }
    failResult(R, A, I) {
      this.gen.if(R), I ? I() : this.error(), A ? (this.gen.else(), A(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(R, A) {
      this.failResult((0, a.not)(R), void 0, A);
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
      const { schemaCode: A } = this;
      this.fail((0, a._)`${A} !== undefined && (${(0, a.or)(this.invalid$data(), R)})`);
    }
    error(R, A, I) {
      if (A) {
        this.setParams(A), this._error(R, I), this.setParams({});
        return;
      }
      this._error(R, I);
    }
    _error(R, A) {
      (R ? g.reportExtraError : g.reportError)(this, this.def.error, A);
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
    setParams(R, A) {
      A ? Object.assign(this.params, R) : this.params = R;
    }
    block$data(R, A, I = a.nil) {
      this.gen.block(() => {
        this.check$data(R, I), A();
      });
    }
    check$data(R = a.nil, A = a.nil) {
      if (!this.$data)
        return;
      const { gen: I, schemaCode: x, schemaType: L, def: Y } = this;
      I.if((0, a.or)((0, a._)`${x} === undefined`, A)), R !== a.nil && I.assign(R, !0), (L.length || Y.validateSchema) && (I.elseIf(this.invalid$data()), this.$dataError(), R !== a.nil && I.assign(R, !1)), I.else();
    }
    invalid$data() {
      const { gen: R, schemaCode: A, schemaType: I, def: x, it: L } = this;
      return (0, a.or)(Y(), Z());
      function Y() {
        if (I.length) {
          if (!(A instanceof a.Name))
            throw new Error("ajv implementation error");
          const X = Array.isArray(I) ? I : [I];
          return (0, a._)`${(0, r.checkDataTypes)(X, A, L.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function Z() {
        if (x.validateSchema) {
          const X = R.scopeValue("validate$data", { ref: x.validateSchema });
          return (0, a._)`!${X}(${A})`;
        }
        return a.nil;
      }
    }
    subschema(R, A) {
      const I = (0, o.getSubschema)(this.it, R);
      (0, o.extendSubschemaData)(I, this.it, R), (0, o.extendSubschemaMode)(I, R);
      const x = { ...this.it, ...I, items: void 0, props: void 0 };
      return h(x, A), x;
    }
    mergeEvaluated(R, A) {
      const { it: I, gen: x } = this;
      I.opts.unevaluated && (I.props !== !0 && R.props !== void 0 && (I.props = d.mergeEvaluated.props(x, R.props, I.props, A)), I.items !== !0 && R.items !== void 0 && (I.items = d.mergeEvaluated.items(x, R.items, I.items, A)));
    }
    mergeValidEvaluated(R, A) {
      const { it: I, gen: x } = this;
      if (I.opts.unevaluated && (I.props !== !0 || I.items !== !0))
        return x.if(A, () => this.mergeEvaluated(R, a.Name)), !0;
    }
  }
  Me.KeywordCxt = j;
  function F(M, R, A, I) {
    const x = new j(M, A, R);
    "code" in A ? A.code(x, I) : x.$data && A.validate ? (0, i.funcKeywordCode)(x, A) : "macro" in A ? (0, i.macroKeywordCode)(x, A) : (A.compile || A.validate) && (0, i.funcKeywordCode)(x, A);
  }
  const V = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(M, { dataLevel: R, dataNames: A, dataPathArr: I }) {
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
      if (L = A[R - ee], !x)
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
  return Me.getData = H, Me;
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
  const s = W(), e = nr(), t = Ae(), r = Dt(), n = te(), i = zt();
  class o {
    constructor(p) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let h;
      typeof p.schema == "object" && (h = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (l = p.baseId) !== null && l !== void 0 ? l : (0, r.normalizeId)(h?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = h?.$async, this.refs = {};
    }
  }
  be.SchemaEnv = o;
  function a(f) {
    const p = d.call(this, f);
    if (p)
      return p;
    const l = (0, r.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: h, lines: m } = this.opts.code, { ownProperties: w } = this.opts, b = new s.CodeGen(this.scope, { es5: h, lines: m, ownProperties: w });
    let S;
    f.$async && (S = b.scopeValue("Error", {
      ref: e.default,
      code: (0, s._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const T = b.scopeName("validate");
    f.validateName = T;
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
      topSchemaRef: b.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, s.stringify)(f.schema) } : { ref: f.schema }),
      validateName: T,
      ValidationError: S,
      schema: f.schema,
      schemaEnv: f,
      rootId: l,
      baseId: f.baseId || l,
      schemaPath: s.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, s._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(f), (0, i.validateFunctionCode)(q), b.optimize(this.opts.code.optimize);
      const z = b.toString();
      D = `${b.scopeRefs(t.default.scope)}return ${z}`, this.opts.code.process && (D = this.opts.code.process(D, f));
      const G = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(T, { ref: G }), G.errors = null, G.schema = f.schema, G.schemaEnv = f, f.$async && (G.$async = !0), this.opts.code.source === !0 && (G.source = { validateName: T, validateCode: z, scopeValues: b._values }), this.opts.unevaluated) {
        const { props: K, items: se } = q;
        G.evaluated = {
          props: K instanceof s.Name ? void 0 : K,
          items: se instanceof s.Name ? void 0 : se,
          dynamicProps: K instanceof s.Name,
          dynamicItems: se instanceof s.Name
        }, G.source && (G.source.evaluated = (0, s.stringify)(G.evaluated));
      }
      return f.validate = G, f;
    } catch (z) {
      throw delete f.validate, delete f.validateName, D && this.logger.error("Error compiling schema, function code:", D), z;
    } finally {
      this._compilations.delete(f);
    }
  }
  be.compileSchema = a;
  function c(f, p, l) {
    var h;
    l = (0, r.resolveUrl)(this.opts.uriResolver, p, l);
    const m = f.refs[l];
    if (m)
      return m;
    let w = _.call(this, f, l);
    if (w === void 0) {
      const b = (h = f.localRefs) === null || h === void 0 ? void 0 : h[l], { schemaId: S } = this.opts;
      b && (w = new o({ schema: b, schemaId: S, root: f, baseId: p }));
    }
    if (w !== void 0)
      return f.refs[l] = u.call(this, w);
  }
  be.resolveRef = c;
  function u(f) {
    return (0, r.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : a.call(this, f);
  }
  function d(f) {
    for (const p of this._compilations)
      if (g(p, f))
        return p;
  }
  be.getCompilingSchema = d;
  function g(f, p) {
    return f.schema === p.schema && f.root === p.root && f.baseId === p.baseId;
  }
  function _(f, p) {
    let l;
    for (; typeof (l = this.refs[p]) == "string"; )
      p = l;
    return l || this.schemas[p] || $.call(this, f, p);
  }
  function $(f, p) {
    const l = this.opts.uriResolver.parse(p), h = (0, r._getFullPath)(this.opts.uriResolver, l);
    let m = (0, r.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && h === m)
      return y.call(this, l, f);
    const w = (0, r.normalizeId)(h), b = this.refs[w] || this.schemas[w];
    if (typeof b == "string") {
      const S = $.call(this, f, b);
      return typeof S?.schema != "object" ? void 0 : y.call(this, l, S);
    }
    if (typeof b?.schema == "object") {
      if (b.validate || a.call(this, b), w === (0, r.normalizeId)(p)) {
        const { schema: S } = b, { schemaId: T } = this.opts, q = S[T];
        return q && (m = (0, r.resolveUrl)(this.opts.uriResolver, m, q)), new o({ schema: S, schemaId: T, root: f, baseId: m });
      }
      return y.call(this, l, b);
    }
  }
  be.resolveSchema = $;
  const P = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function y(f, { baseId: p, schema: l, root: h }) {
    var m;
    if (((m = f.fragment) === null || m === void 0 ? void 0 : m[0]) !== "/")
      return;
    for (const S of f.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const T = l[(0, n.unescapeFragment)(S)];
      if (T === void 0)
        return;
      l = T;
      const q = typeof l == "object" && l[this.opts.schemaId];
      !P.has(S) && q && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, q));
    }
    let w;
    if (typeof l != "boolean" && l.$ref && !(0, n.schemaHasRulesButRef)(l, this.RULES)) {
      const S = (0, r.resolveUrl)(this.opts.uriResolver, p, l.$ref);
      w = $.call(this, h, S);
    }
    const { schemaId: b } = this.opts;
    if (w = w || new o({ schema: l, schemaId: b, root: h, baseId: p }), w.schema !== w.root.schema)
      return w;
  }
  return be;
}
const gi = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", vi = "Meta-schema for $data reference (JSON AnySchema extension proposal)", bi = "object", wi = ["$data"], $i = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, _i = !1, Pi = {
  $id: gi,
  description: vi,
  type: bi,
  required: wi,
  properties: $i,
  additionalProperties: _i
};
var Xe = {}, Fe = { exports: {} }, Wt, zr;
function Si() {
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
  const { HEX: s } = Si(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(y) {
    if (a(y, ".") < 3)
      return { host: y, isIPV4: !1 };
    const f = y.match(e) || [], [p] = f;
    return p ? { host: o(p, "."), isIPV4: !0 } : { host: y, isIPV4: !1 };
  }
  function r(y, f = !1) {
    let p = "", l = !0;
    for (const h of y) {
      if (s[h] === void 0) return;
      h !== "0" && l === !0 && (l = !1), l || (p += h);
    }
    return f && p.length === 0 && (p = "0"), p;
  }
  function n(y) {
    let f = 0;
    const p = { error: !1, address: "", zone: "" }, l = [], h = [];
    let m = !1, w = !1, b = !1;
    function S() {
      if (h.length) {
        if (m === !1) {
          const T = r(h);
          if (T !== void 0)
            l.push(T);
          else
            return p.error = !0, !1;
        }
        h.length = 0;
      }
      return !0;
    }
    for (let T = 0; T < y.length; T++) {
      const q = y[T];
      if (!(q === "[" || q === "]"))
        if (q === ":") {
          if (w === !0 && (b = !0), !S())
            break;
          if (f++, l.push(":"), f > 7) {
            p.error = !0;
            break;
          }
          T - 1 >= 0 && y[T - 1] === ":" && (w = !0);
          continue;
        } else if (q === "%") {
          if (!S())
            break;
          m = !0;
        } else {
          h.push(q);
          continue;
        }
    }
    return h.length && (m ? p.zone = h.join("") : b ? l.push(h.join("")) : l.push(r(h))), p.address = l.join(""), p;
  }
  function i(y) {
    if (a(y, ":") < 2)
      return { host: y, isIPV6: !1 };
    const f = n(y);
    if (f.error)
      return { host: y, isIPV6: !1 };
    {
      let p = f.address, l = f.address;
      return f.zone && (p += "%" + f.zone, l += "%25" + f.zone), { host: p, escapedHost: l, isIPV6: !0 };
    }
  }
  function o(y, f) {
    let p = "", l = !0;
    const h = y.length;
    for (let m = 0; m < h; m++) {
      const w = y[m];
      w === "0" && l ? (m + 1 <= h && y[m + 1] === f || m + 1 === h) && (p += w, l = !1) : (w === f ? l = !0 : l = !1, p += w);
    }
    return p;
  }
  function a(y, f) {
    let p = 0;
    for (let l = 0; l < y.length; l++)
      y[l] === f && p++;
    return p;
  }
  const c = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, g = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(y) {
    const f = [];
    for (; y.length; )
      if (y.match(c))
        y = y.replace(c, "");
      else if (y.match(u))
        y = y.replace(u, "/");
      else if (y.match(d))
        y = y.replace(d, "/"), f.pop();
      else if (y === "." || y === "..")
        y = "";
      else {
        const p = y.match(g);
        if (p) {
          const l = p[0];
          y = y.slice(l.length), f.push(l);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return f.join("");
  }
  function $(y, f) {
    const p = f !== !0 ? escape : unescape;
    return y.scheme !== void 0 && (y.scheme = p(y.scheme)), y.userinfo !== void 0 && (y.userinfo = p(y.userinfo)), y.host !== void 0 && (y.host = p(y.host)), y.path !== void 0 && (y.path = p(y.path)), y.query !== void 0 && (y.query = p(y.query)), y.fragment !== void 0 && (y.fragment = p(y.fragment)), y;
  }
  function P(y) {
    const f = [];
    if (y.userinfo !== void 0 && (f.push(y.userinfo), f.push("@")), y.host !== void 0) {
      let p = unescape(y.host);
      const l = t(p);
      if (l.isIPV4)
        p = l.host;
      else {
        const h = i(l.host);
        h.isIPV6 === !0 ? p = `[${h.escapedHost}]` : p = y.host;
      }
      f.push(p);
    }
    return (typeof y.port == "number" || typeof y.port == "string") && (f.push(":"), f.push(String(y.port))), f.length ? f.join("") : void 0;
  }
  return Yt = {
    recomposeAuthority: P,
    normalizeComponentEncoding: $,
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
    const h = String(l.scheme).toLowerCase() === "https";
    return (l.port === (h ? 443 : 80) || l.port === "") && (l.port = void 0), l.path || (l.path = "/"), l;
  }
  function i(l) {
    return l.secure = t(l), l.resourceName = (l.path || "/") + (l.query ? "?" + l.query : ""), l.path = void 0, l.query = void 0, l;
  }
  function o(l) {
    if ((l.port === (t(l) ? 443 : 80) || l.port === "") && (l.port = void 0), typeof l.secure == "boolean" && (l.scheme = l.secure ? "wss" : "ws", l.secure = void 0), l.resourceName) {
      const [h, m] = l.resourceName.split("?");
      l.path = h && h !== "/" ? h : void 0, l.query = m, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function a(l, h) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const m = l.path.match(e);
    if (m) {
      const w = h.scheme || l.scheme || "urn";
      l.nid = m[1].toLowerCase(), l.nss = m[2];
      const b = `${w}:${h.nid || l.nid}`, S = p[b];
      l.path = void 0, S && (l = S.parse(l, h));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function c(l, h) {
    const m = h.scheme || l.scheme || "urn", w = l.nid.toLowerCase(), b = `${m}:${h.nid || w}`, S = p[b];
    S && (l = S.serialize(l, h));
    const T = l, q = l.nss;
    return T.path = `${w || h.nid}:${q}`, h.skipEscape = !0, T;
  }
  function u(l, h) {
    const m = l;
    return m.uuid = m.nss, m.nss = void 0, !h.tolerant && (!m.uuid || !s.test(m.uuid)) && (m.error = m.error || "UUID is not valid."), m;
  }
  function d(l) {
    const h = l;
    return h.nss = (l.uuid || "").toLowerCase(), h;
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
  }, $ = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: o
  }, P = {
    scheme: "wss",
    domainHost: $.domainHost,
    parse: $.parse,
    serialize: $.serialize
  }, p = {
    http: g,
    https: _,
    ws: $,
    wss: P,
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
  function o(f, p) {
    return typeof f == "string" ? f = d(P(f, p), p) : typeof f == "object" && (f = P(d(f, p), p)), f;
  }
  function a(f, p, l) {
    const h = Object.assign({ scheme: "null" }, l), m = c(P(f, h), P(p, h), h, !0);
    return d(m, { ...h, skipEscape: !0 });
  }
  function c(f, p, l, h) {
    const m = {};
    return h || (f = P(d(f, l), l), p = P(d(p, l), l)), l = l || {}, !l.tolerant && p.scheme ? (m.scheme = p.scheme, m.userinfo = p.userinfo, m.host = p.host, m.port = p.port, m.path = t(p.path || ""), m.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (m.userinfo = p.userinfo, m.host = p.host, m.port = p.port, m.path = t(p.path || ""), m.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? m.path = t(p.path) : ((f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0) && !f.path ? m.path = "/" + p.path : f.path ? m.path = f.path.slice(0, f.path.lastIndexOf("/") + 1) + p.path : m.path = p.path, m.path = t(m.path)), m.query = p.query) : (m.path = f.path, p.query !== void 0 ? m.query = p.query : m.query = f.query), m.userinfo = f.userinfo, m.host = f.host, m.port = f.port), m.scheme = f.scheme), m.fragment = p.fragment, m;
  }
  function u(f, p, l) {
    return typeof f == "string" ? (f = unescape(f), f = d(n(P(f, l), !0), { ...l, skipEscape: !0 })) : typeof f == "object" && (f = d(n(f, !0), { ...l, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = d(n(P(p, l), !0), { ...l, skipEscape: !0 })) : typeof p == "object" && (p = d(n(p, !0), { ...l, skipEscape: !0 })), f.toLowerCase() === p.toLowerCase();
  }
  function d(f, p) {
    const l = {
      host: f.host,
      scheme: f.scheme,
      userinfo: f.userinfo,
      port: f.port,
      path: f.path,
      query: f.query,
      nid: f.nid,
      nss: f.nss,
      uuid: f.uuid,
      fragment: f.fragment,
      reference: f.reference,
      resourceName: f.resourceName,
      secure: f.secure,
      error: ""
    }, h = Object.assign({}, p), m = [], w = i[(h.scheme || l.scheme || "").toLowerCase()];
    w && w.serialize && w.serialize(l, h), l.path !== void 0 && (h.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), h.reference !== "suffix" && l.scheme && m.push(l.scheme, ":");
    const b = r(l);
    if (b !== void 0 && (h.reference !== "suffix" && m.push("//"), m.push(b), l.path && l.path.charAt(0) !== "/" && m.push("/")), l.path !== void 0) {
      let S = l.path;
      !h.absolutePath && (!w || !w.absolutePath) && (S = t(S)), b === void 0 && (S = S.replace(/^\/\//u, "/%2F")), m.push(S);
    }
    return l.query !== void 0 && m.push("?", l.query), l.fragment !== void 0 && m.push("#", l.fragment), m.join("");
  }
  const g = Array.from({ length: 127 }, (f, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function _(f) {
    let p = 0;
    for (let l = 0, h = f.length; l < h; ++l)
      if (p = f.charCodeAt(l), p > 126 || g[p])
        return !0;
    return !1;
  }
  const $ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function P(f, p) {
    const l = Object.assign({}, p), h = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, m = f.indexOf("%") !== -1;
    let w = !1;
    l.reference === "suffix" && (f = (l.scheme ? l.scheme + ":" : "") + "//" + f);
    const b = f.match($);
    if (b) {
      if (h.scheme = b[1], h.userinfo = b[3], h.host = b[4], h.port = parseInt(b[5], 10), h.path = b[6] || "", h.query = b[7], h.fragment = b[8], isNaN(h.port) && (h.port = b[5]), h.host) {
        const T = e(h.host);
        if (T.isIPV4 === !1) {
          const q = s(T.host);
          h.host = q.host.toLowerCase(), w = q.isIPV6;
        } else
          h.host = T.host, w = !0;
      }
      h.scheme === void 0 && h.userinfo === void 0 && h.host === void 0 && h.port === void 0 && h.query === void 0 && !h.path ? h.reference = "same-document" : h.scheme === void 0 ? h.reference = "relative" : h.fragment === void 0 ? h.reference = "absolute" : h.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== h.reference && (h.error = h.error || "URI is not a " + l.reference + " reference.");
      const S = i[(l.scheme || h.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!S || !S.unicodeSupport) && h.host && (l.domainHost || S && S.domainHost) && w === !1 && _(h.host))
        try {
          h.host = URL.domainToASCII(h.host.toLowerCase());
        } catch (T) {
          h.error = h.error || "Host's domain name can not be converted to ASCII: " + T;
        }
      (!S || S && !S.skipNormalize) && (m && h.scheme !== void 0 && (h.scheme = unescape(h.scheme)), m && h.host !== void 0 && (h.host = unescape(h.host)), h.path && (h.path = escape(unescape(h.path))), h.fragment && (h.fragment = encodeURI(decodeURIComponent(h.fragment)))), S && S.parse && S.parse(h, l);
    } else
      h.error = h.error || "URI can not be parsed.";
    return h;
  }
  const y = {
    SCHEMES: i,
    normalize: o,
    resolve: a,
    resolveComponents: c,
    equal: u,
    serialize: d,
    parse: P
  };
  return Fe.exports = y, Fe.exports.default = y, Fe.exports.fastUri = y, Fe.exports;
}
var Ur;
function ki() {
  if (Ur) return Xe;
  Ur = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const s = Ti();
  return s.code = 'require("ajv/dist/runtime/uri").default', Xe.default = s, Xe;
}
var Gr;
function Ni() {
  return Gr || (Gr = 1, (function(s) {
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
    const r = nr(), n = Vt(), i = In(), o = ir(), a = W(), c = Dt(), u = qt(), d = te(), g = Pi, _ = ki(), $ = (k, N) => new RegExp(k, N);
    $.code = "new RegExp";
    const P = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
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
    ]), f = {
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
    function h(k) {
      var N, O, C, v, E, j, F, V, Q, H, M, R, A, I, x, L, Y, Z, X, ne, ee, pe, le, Re, ce;
      const me = k.strict, oe = (N = k.code) === null || N === void 0 ? void 0 : N.optimize, B = oe === !0 || oe === void 0 ? 1 : oe || 0, ae = (C = (O = k.code) === null || O === void 0 ? void 0 : O.regExp) !== null && C !== void 0 ? C : $, he = (v = k.uriResolver) !== null && v !== void 0 ? v : _.default;
      return {
        strictSchema: (j = (E = k.strictSchema) !== null && E !== void 0 ? E : me) !== null && j !== void 0 ? j : !0,
        strictNumbers: (V = (F = k.strictNumbers) !== null && F !== void 0 ? F : me) !== null && V !== void 0 ? V : !0,
        strictTypes: (H = (Q = k.strictTypes) !== null && Q !== void 0 ? Q : me) !== null && H !== void 0 ? H : "log",
        strictTuples: (R = (M = k.strictTuples) !== null && M !== void 0 ? M : me) !== null && R !== void 0 ? R : "log",
        strictRequired: (I = (A = k.strictRequired) !== null && A !== void 0 ? A : me) !== null && I !== void 0 ? I : !1,
        code: k.code ? { ...k.code, optimize: B, regExp: ae } : { optimize: B, regExp: ae },
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
    class m {
      constructor(N = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), N = this.opts = { ...N, ...h(N) };
        const { es5: O, lines: C } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: y, es5: O, lines: C }), this.logger = U(N.logger);
        const v = N.validateFormats;
        N.validateFormats = !1, this.RULES = (0, i.getRules)(), w.call(this, f, N, "NOT SUPPORTED"), w.call(this, p, N, "DEPRECATED", "warn"), this._metaOpts = D.call(this), N.formats && T.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), N.keywords && q.call(this, N.keywords), typeof N.meta == "object" && this.addMetaSchema(N.meta), S.call(this), N.validateFormats = v;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: N, meta: O, schemaId: C } = this.opts;
        let v = g;
        C === "id" && (v = { ...g }, v.id = v.$id, delete v.$id), O && N && this.addMetaSchema(v, v[C], !1);
      }
      defaultMeta() {
        const { meta: N, schemaId: O } = this.opts;
        return this.opts.defaultMeta = typeof N == "object" ? N[O] || N : void 0;
      }
      validate(N, O) {
        let C;
        if (typeof N == "string") {
          if (C = this.getSchema(N), !C)
            throw new Error(`no schema with key or ref "${N}"`);
        } else
          C = this.compile(N);
        const v = C(O);
        return "$async" in C || (this.errors = C.errors), v;
      }
      compile(N, O) {
        const C = this._addSchema(N, O);
        return C.validate || this._compileSchemaEnv(C);
      }
      compileAsync(N, O) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: C } = this.opts;
        return v.call(this, N, O);
        async function v(H, M) {
          await E.call(this, H.$schema);
          const R = this._addSchema(H, M);
          return R.validate || j.call(this, R);
        }
        async function E(H) {
          H && !this.getSchema(H) && await v.call(this, { $ref: H }, !0);
        }
        async function j(H) {
          try {
            return this._compileSchemaEnv(H);
          } catch (M) {
            if (!(M instanceof n.default))
              throw M;
            return F.call(this, M), await V.call(this, M.missingSchema), j.call(this, H);
          }
        }
        function F({ missingSchema: H, missingRef: M }) {
          if (this.refs[H])
            throw new Error(`AnySchema ${H} is loaded but ${M} cannot be resolved`);
        }
        async function V(H) {
          const M = await Q.call(this, H);
          this.refs[H] || await E.call(this, M.$schema), this.refs[H] || this.addSchema(M, H, O);
        }
        async function Q(H) {
          const M = this._loading[H];
          if (M)
            return M;
          try {
            return await (this._loading[H] = C(H));
          } finally {
            delete this._loading[H];
          }
        }
      }
      // Adds schema to the instance
      addSchema(N, O, C, v = this.opts.validateSchema) {
        if (Array.isArray(N)) {
          for (const j of N)
            this.addSchema(j, void 0, C, v);
          return this;
        }
        let E;
        if (typeof N == "object") {
          const { schemaId: j } = this.opts;
          if (E = N[j], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${j} must be string`);
        }
        return O = (0, c.normalizeId)(O || E), this._checkUnique(O), this.schemas[O] = this._addSchema(N, C, O, v, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(N, O, C = this.opts.validateSchema) {
        return this.addSchema(N, O, !0, C), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(N, O) {
        if (typeof N == "boolean")
          return !0;
        let C;
        if (C = N.$schema, C !== void 0 && typeof C != "string")
          throw new Error("$schema must be a string");
        if (C = C || this.opts.defaultMeta || this.defaultMeta(), !C)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const v = this.validate(C, N);
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
      getSchema(N) {
        let O;
        for (; typeof (O = b.call(this, N)) == "string"; )
          N = O;
        if (O === void 0) {
          const { schemaId: C } = this.opts, v = new o.SchemaEnv({ schema: {}, schemaId: C });
          if (O = o.resolveSchema.call(this, v, N), !O)
            return;
          this.refs[N] = O;
        }
        return O.validate || this._compileSchemaEnv(O);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(N) {
        if (N instanceof RegExp)
          return this._removeAllSchemas(this.schemas, N), this._removeAllSchemas(this.refs, N), this;
        switch (typeof N) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const O = b.call(this, N);
            return typeof O == "object" && this._cache.delete(O.schema), delete this.schemas[N], delete this.refs[N], this;
          }
          case "object": {
            const O = N;
            this._cache.delete(O);
            let C = N[this.opts.schemaId];
            return C && (C = (0, c.normalizeId)(C), delete this.schemas[C], delete this.refs[C]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(N) {
        for (const O of N)
          this.addKeyword(O);
        return this;
      }
      addKeyword(N, O) {
        let C;
        if (typeof N == "string")
          C = N, typeof O == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), O.keyword = C);
        else if (typeof N == "object" && O === void 0) {
          if (O = N, C = O.keyword, Array.isArray(C) && !C.length)
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
      getKeyword(N) {
        const O = this.RULES.all[N];
        return typeof O == "object" ? O.definition : !!O;
      }
      // Remove keyword
      removeKeyword(N) {
        const { RULES: O } = this;
        delete O.keywords[N], delete O.all[N];
        for (const C of O.rules) {
          const v = C.rules.findIndex((E) => E.keyword === N);
          v >= 0 && C.rules.splice(v, 1);
        }
        return this;
      }
      // Add format
      addFormat(N, O) {
        return typeof O == "string" && (O = new RegExp(O)), this.formats[N] = O, this;
      }
      errorsText(N = this.errors, { separator: O = ", ", dataVar: C = "data" } = {}) {
        return !N || N.length === 0 ? "No errors" : N.map((v) => `${C}${v.instancePath} ${v.message}`).reduce((v, E) => v + O + E);
      }
      $dataMetaSchema(N, O) {
        const C = this.RULES.all;
        N = JSON.parse(JSON.stringify(N));
        for (const v of O) {
          const E = v.split("/").slice(1);
          let j = N;
          for (const F of E)
            j = j[F];
          for (const F in C) {
            const V = C[F];
            if (typeof V != "object")
              continue;
            const { $data: Q } = V.definition, H = j[F];
            Q && H && (j[F] = ve(H));
          }
        }
        return N;
      }
      _removeAllSchemas(N, O) {
        for (const C in N) {
          const v = N[C];
          (!O || O.test(C)) && (typeof v == "string" ? delete N[C] : v && !v.meta && (this._cache.delete(v.schema), delete N[C]));
        }
      }
      _addSchema(N, O, C, v = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let j;
        const { schemaId: F } = this.opts;
        if (typeof N == "object")
          j = N[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof N != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let V = this._cache.get(N);
        if (V !== void 0)
          return V;
        C = (0, c.normalizeId)(j || C);
        const Q = c.getSchemaRefs.call(this, N, C);
        return V = new o.SchemaEnv({ schema: N, schemaId: F, meta: O, baseId: C, localRefs: Q }), this._cache.set(V.schema, V), E && !C.startsWith("#") && (C && this._checkUnique(C), this.refs[C] = V), v && this.validateSchema(N, !0), V;
      }
      _checkUnique(N) {
        if (this.schemas[N] || this.refs[N])
          throw new Error(`schema with key or id "${N}" already exists`);
      }
      _compileSchemaEnv(N) {
        if (N.meta ? this._compileMetaSchema(N) : o.compileSchema.call(this, N), !N.validate)
          throw new Error("ajv implementation error");
        return N.validate;
      }
      _compileMetaSchema(N) {
        const O = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, N);
        } finally {
          this.opts = O;
        }
      }
    }
    m.ValidationError = r.default, m.MissingRefError = n.default, s.default = m;
    function w(k, N, O, C = "error") {
      for (const v in k) {
        const E = v;
        E in N && this.logger[C](`${O}: option ${v}. ${k[E]}`);
      }
    }
    function b(k) {
      return k = (0, c.normalizeId)(k), this.schemas[k] || this.refs[k];
    }
    function S() {
      const k = this.opts.schemas;
      if (k)
        if (Array.isArray(k))
          this.addSchema(k);
        else
          for (const N in k)
            this.addSchema(k[N], N);
    }
    function T() {
      for (const k in this.opts.formats) {
        const N = this.opts.formats[k];
        N && this.addFormat(k, N);
      }
    }
    function q(k) {
      if (Array.isArray(k)) {
        this.addVocabulary(k);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const N in k) {
        const O = k[N];
        O.keyword || (O.keyword = N), this.addKeyword(O);
      }
    }
    function D() {
      const k = { ...this.opts };
      for (const N of P)
        delete k[N];
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
    const G = /^[a-z_$][a-z0-9_$:-]*$/i;
    function K(k, N) {
      const { RULES: O } = this;
      if ((0, d.eachItem)(k, (C) => {
        if (O.keywords[C])
          throw new Error(`Keyword ${C} is already defined`);
        if (!G.test(C))
          throw new Error(`Keyword ${C} has invalid name`);
      }), !!N && N.$data && !("code" in N || "validate" in N))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function se(k, N, O) {
      var C;
      const v = N?.post;
      if (O && v)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let j = v ? E.post : E.rules.find(({ type: V }) => V === O);
      if (j || (j = { type: O, rules: [] }, E.rules.push(j)), E.keywords[k] = !0, !N)
        return;
      const F = {
        keyword: k,
        definition: {
          ...N,
          type: (0, u.getJSONTypes)(N.type),
          schemaType: (0, u.getJSONTypes)(N.schemaType)
        }
      };
      N.before ? ye.call(this, j, F, N.before) : j.rules.push(F), E.all[k] = F, (C = N.implements) === null || C === void 0 || C.forEach((V) => this.addKeyword(V));
    }
    function ye(k, N, O) {
      const C = k.rules.findIndex((v) => v.keyword === O);
      C >= 0 ? k.rules.splice(C, 0, N) : (k.rules.push(N), this.logger.warn(`rule ${O} is not defined`));
    }
    function ge(k) {
      let { metaSchema: N } = k;
      N !== void 0 && (k.$data && this.opts.$data && (N = ve(N)), k.validateSchema = this.compile(N, !0));
    }
    const re = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ve(k) {
      return { anyOf: [k, re] };
    }
  })(Lt)), Lt;
}
var Ze = {}, et = {}, tt = {}, Br;
function Ai() {
  if (Br) return tt;
  Br = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const s = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return tt.default = s, tt;
}
var Ne = {}, Kr;
function Ri() {
  if (Kr) return Ne;
  Kr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.callRef = Ne.getValidate = void 0;
  const s = Vt(), e = $e(), t = W(), r = Ae(), n = ir(), i = te(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: d, schema: g, it: _ } = u, { baseId: $, schemaEnv: P, validateName: y, opts: f, self: p } = _, { root: l } = P;
      if ((g === "#" || g === "#/") && $ === l.baseId)
        return m();
      const h = n.resolveRef.call(p, l, $, g);
      if (h === void 0)
        throw new s.default(_.opts.uriResolver, $, g);
      if (h instanceof n.SchemaEnv)
        return w(h);
      return b(h);
      function m() {
        if (P === l)
          return c(u, y, P, P.$async);
        const S = d.scopeValue("root", { ref: l });
        return c(u, (0, t._)`${S}.validate`, l, l.$async);
      }
      function w(S) {
        const T = a(u, S);
        c(u, T, S, S.$async);
      }
      function b(S) {
        const T = d.scopeValue("schema", f.code.source === !0 ? { ref: S, code: (0, t.stringify)(S) } : { ref: S }), q = d.name("valid"), D = u.subschema({
          schema: S,
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
  Ne.getValidate = a;
  function c(u, d, g, _) {
    const { gen: $, it: P } = u, { allErrors: y, schemaEnv: f, opts: p } = P, l = p.passContext ? r.default.this : t.nil;
    _ ? h() : m();
    function h() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const S = $.let("valid");
      $.try(() => {
        $.code((0, t._)`await ${(0, e.callValidateCode)(u, d, l)}`), b(d), y || $.assign(S, !0);
      }, (T) => {
        $.if((0, t._)`!(${T} instanceof ${P.ValidationError})`, () => $.throw(T)), w(T), y || $.assign(S, !1);
      }), u.ok(S);
    }
    function m() {
      u.result((0, e.callValidateCode)(u, d, l), () => b(d), () => w(d));
    }
    function w(S) {
      const T = (0, t._)`${S}.errors`;
      $.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${T} : ${r.default.vErrors}.concat(${T})`), $.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function b(S) {
      var T;
      if (!P.opts.unevaluated)
        return;
      const q = (T = g?.validate) === null || T === void 0 ? void 0 : T.evaluated;
      if (P.props !== !0)
        if (q && !q.dynamicProps)
          q.props !== void 0 && (P.props = i.mergeEvaluated.props($, q.props, P.props));
        else {
          const D = $.var("props", (0, t._)`${S}.evaluated.props`);
          P.props = i.mergeEvaluated.props($, D, P.props, t.Name);
        }
      if (P.items !== !0)
        if (q && !q.dynamicItems)
          q.items !== void 0 && (P.items = i.mergeEvaluated.items($, q.items, P.items));
        else {
          const D = $.var("items", (0, t._)`${S}.evaluated.items`);
          P.items = i.mergeEvaluated.items($, D, P.items, t.Name);
        }
    }
  }
  return Ne.callRef = c, Ne.default = o, Ne;
}
var Hr;
function Ci() {
  if (Hr) return et;
  Hr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const s = Ai(), e = Ri(), t = [
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
var rt = {}, nt = {}, Jr;
function ji() {
  if (Jr) return nt;
  Jr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
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
      const $ = a.length >= _.loopRequired;
      if (g.allErrors ? P() : y(), _.strictRequired) {
        const l = i.parentSchema.properties, { definedProperties: h } = i.it;
        for (const m of a)
          if (l?.[m] === void 0 && !h.has(m)) {
            const w = g.schemaEnv.baseId + g.errSchemaPath, b = `required property "${m}" is not defined at "${w}" (strictRequired)`;
            (0, t.checkStrictMode)(g, b, g.opts.strictRequired);
          }
      }
      function P() {
        if ($ || d)
          i.block$data(e.nil, f);
        else
          for (const l of a)
            (0, s.checkReportMissingProp)(i, l);
      }
      function y() {
        const l = o.let("missing");
        if ($ || d) {
          const h = o.let("valid", !0);
          i.block$data(h, () => p(l, h)), i.ok(h);
        } else
          o.if((0, s.checkMissingProp)(i, a, l)), (0, s.reportMissingProp)(i, l), o.else();
      }
      function f() {
        o.forOf("prop", c, (l) => {
          i.setParams({ missingProperty: l }), o.if((0, s.noPropertyInData)(o, u, l, _.ownProperties), () => i.error());
        });
      }
      function p(l, h) {
        i.setParams({ missingProperty: l }), o.forOf(l, c, () => {
          o.assign(h, (0, s.propertyInData)(o, u, l, _.ownProperties)), o.if((0, e.not)(h), () => {
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
      const { gen: a, data: c, $data: u, schema: d, parentSchema: g, schemaCode: _, it: $ } = o;
      if (!u && !d)
        return;
      const P = a.let("valid"), y = g.items ? (0, s.getSchemaTypes)(g.items) : [];
      o.block$data(P, f, (0, e._)`${_} === false`), o.ok(P);
      function f() {
        const m = a.let("i", (0, e._)`${c}.length`), w = a.let("j");
        o.setParams({ i: m, j: w }), a.assign(P, !0), a.if((0, e._)`${m} > 1`, () => (p() ? l : h)(m, w));
      }
      function p() {
        return y.length > 0 && !y.some((m) => m === "object" || m === "array");
      }
      function l(m, w) {
        const b = a.name("item"), S = (0, s.checkDataTypes)(y, b, $.opts.strictNumbers, s.DataType.Wrong), T = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${m}--;`, () => {
          a.let(b, (0, e._)`${c}[${m}]`), a.if(S, (0, e._)`continue`), y.length > 1 && a.if((0, e._)`typeof ${b} == "string"`, (0, e._)`${b} += "_"`), a.if((0, e._)`typeof ${T}[${b}] == "number"`, () => {
            a.assign(w, (0, e._)`${T}[${b}]`), o.error(), a.assign(P, !1).break();
          }).code((0, e._)`${T}[${b}] = ${m}`);
        });
      }
      function h(m, w) {
        const b = (0, t.useFunc)(a, r.default), S = a.name("outer");
        a.label(S).for((0, e._)`;${m}--;`, () => a.for((0, e._)`${w} = ${m}; ${w}--;`, () => a.if((0, e._)`${b}(${c}[${m}], ${c}[${w}])`, () => {
          o.error(), a.assign(P, !1).break(S);
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
      let $;
      const P = () => $ ?? ($ = (0, e.useFunc)(o, t.default));
      let y;
      if (_ || c)
        y = o.let("valid"), i.block$data(y, f);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const l = o.const("vSchema", d);
        y = (0, s.or)(...u.map((h, m) => p(l, m)));
      }
      i.pass(y);
      function f() {
        o.assign(y, !1), o.forOf("v", d, (l) => o.if((0, s._)`${P()}(${a}, ${l})`, () => o.assign(y, !0).break()));
      }
      function p(l, h) {
        const m = u[h];
        return typeof m == "object" && m !== null ? (0, s._)`${P()}(${a}, ${l}[${h}])` : (0, s._)`${a} === ${m}`;
      }
    }
  };
  return pt.default = n, pt;
}
var an;
function Gi() {
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
      const P = a.var("valid", (0, s._)`${_} <= ${o.length}`);
      a.if((0, s.not)(P), () => $(P)), i.ok(P);
    }
    function $(P) {
      a.forRange("i", o.length, _, (y) => {
        i.subschema({ keyword: d, dataProp: y, dataPropType: e.Type.Num }, P), g.allErrors || a.if((0, s.not)(P), () => a.break());
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
    y(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(c, a.length, _.items));
    const $ = c.name("valid"), P = c.const("len", (0, s._)`${d}.length`);
    a.forEach((f, p) => {
      (0, e.alwaysValidSchema)(_, f) || (c.if((0, s._)`${P} > ${p}`, () => i.subschema({
        keyword: g,
        schemaProp: p,
        dataProp: p
      }, $)), i.ok($));
    });
    function y(f) {
      const { opts: p, errSchemaPath: l } = _, h = a.length, m = h === f.minItems && (h === f.maxItems || f[o] === !1);
      if (p.strictTuples && !m) {
        const w = `"${g}" is ${h}-tuple, but minItems or maxItems/${o} are not specified or different at path "${l}"`;
        (0, e.checkStrictMode)(_, w, p.strictTuples);
      }
    }
  }
  return Oe.validateTuple = n, Oe.default = r, Oe;
}
var un;
function Bi() {
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
function Hi() {
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
      const { minContains: _, maxContains: $ } = a;
      u.opts.next ? (d = _ === void 0 ? 1 : _, g = $) : d = 1;
      const P = i.const("len", (0, s._)`${c}.length`);
      if (n.setParams({ min: d, max: g }), g === void 0 && d === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (g !== void 0 && d > g) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, o)) {
        let h = (0, s._)`${P} >= ${d}`;
        g !== void 0 && (h = (0, s._)`${h} && ${P} <= ${g}`), n.pass(h);
        return;
      }
      u.items = !0;
      const y = i.name("valid");
      g === void 0 && d === 1 ? p(y, () => i.if(y, () => i.break())) : d === 0 ? (i.let(y, !0), g !== void 0 && i.if((0, s._)`${c}.length > 0`, f)) : (i.let(y, !1), f()), n.result(y, () => n.reset());
      function f() {
        const h = i.name("_valid"), m = i.let("count", 0);
        p(h, () => i.if(h, () => l(m)));
      }
      function p(h, m) {
        i.forRange("i", 0, P, (w) => {
          n.subschema({
            keyword: "contains",
            dataProp: w,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, h), m();
        });
      }
      function l(h) {
        i.code((0, s._)`${h}++`), g === void 0 ? i.if((0, s._)`${h} >= ${d}`, () => i.assign(y, !0).break()) : (i.if((0, s._)`${h} > ${g}`, () => i.assign(y, !1).break()), d === 1 ? i.assign(y, !0) : i.if((0, s._)`${h} >= ${d}`, () => i.assign(y, !0)));
      }
    }
  };
  return vt.default = r, vt;
}
var Xt = {}, fn;
function Ji() {
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
      const $ = d.let("missing");
      for (const P in u) {
        const y = u[P];
        if (y.length === 0)
          continue;
        const f = (0, r.propertyInData)(d, g, P, _.opts.ownProperties);
        c.setParams({
          property: P,
          depsCount: y.length,
          deps: y.join(", ")
        }), _.allErrors ? d.if(f, () => {
          for (const p of y)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${f} && (${(0, r.checkMissingProp)(c, y, $)})`), (0, r.reportMissingProp)(c, $), d.else());
      }
    }
    s.validatePropertyDeps = o;
    function a(c, u = c.schema) {
      const { gen: d, data: g, keyword: _, it: $ } = c, P = d.name("valid");
      for (const y in u)
        (0, t.alwaysValidSchema)($, u[y]) || (d.if(
          (0, r.propertyInData)(d, g, y, $.opts.ownProperties),
          () => {
            const f = c.subschema({ keyword: _, schemaProp: y }, P);
            c.mergeValidEvaluated(f, P);
          },
          () => d.var(P, !0)
          // TODO var
        ), c.ok(P));
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
  const s = $e(), e = W(), t = Ae(), r = te(), i = {
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
      const { allErrors: $, opts: P } = _;
      if (_.props = !0, P.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, c))
        return;
      const y = (0, s.allSchemaProperties)(u.properties), f = (0, s.allSchemaProperties)(u.patternProperties);
      p(), o.ok((0, e._)`${g} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (b) => {
          !y.length && !f.length ? m(b) : a.if(l(b), () => m(b));
        });
      }
      function l(b) {
        let S;
        if (y.length > 8) {
          const T = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          S = (0, s.isOwnProperty)(a, T, b);
        } else y.length ? S = (0, e.or)(...y.map((T) => (0, e._)`${b} === ${T}`)) : S = e.nil;
        return f.length && (S = (0, e.or)(S, ...f.map((T) => (0, e._)`${(0, s.usePattern)(o, T)}.test(${b})`))), (0, e.not)(S);
      }
      function h(b) {
        a.code((0, e._)`delete ${d}[${b}]`);
      }
      function m(b) {
        if (P.removeAdditional === "all" || P.removeAdditional && c === !1) {
          h(b);
          return;
        }
        if (c === !1) {
          o.setParams({ additionalProperty: b }), o.error(), $ || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(_, c)) {
          const S = a.name("valid");
          P.removeAdditional === "failing" ? (w(b, S, !1), a.if((0, e.not)(S), () => {
            o.reset(), h(b);
          })) : (w(b, S), $ || a.if((0, e.not)(S), () => a.break()));
        }
      }
      function w(b, S, T) {
        const q = {
          keyword: "additionalProperties",
          dataProp: b,
          dataPropType: r.Type.Str
        };
        T === !1 && Object.assign(q, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(q, S);
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
      for (const f of g)
        d.definedProperties.add(f);
      d.opts.unevaluated && g.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(o, (0, t.toHash)(g), d.props));
      const _ = g.filter((f) => !(0, t.alwaysValidSchema)(d, a[f]));
      if (_.length === 0)
        return;
      const $ = o.name("valid");
      for (const f of _)
        P(f) ? y(f) : (o.if((0, e.propertyInData)(o, u, f, d.opts.ownProperties)), y(f), d.allErrors || o.else().var($, !0), o.endIf()), i.it.definedProperties.add(f), i.ok($);
      function P(f) {
        return d.opts.useDefaults && !d.compositeRule && a[f].default !== void 0;
      }
      function y(f) {
        i.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, $);
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
      const { gen: o, schema: a, data: c, parentSchema: u, it: d } = i, { opts: g } = d, _ = (0, s.allSchemaProperties)(a), $ = _.filter((m) => (0, t.alwaysValidSchema)(d, a[m]));
      if (_.length === 0 || $.length === _.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const P = g.strictSchema && !g.allowMatchingProperties && u.properties, y = o.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(o, d.props));
      const { props: f } = d;
      p();
      function p() {
        for (const m of _)
          P && l(m), d.allErrors ? h(m) : (o.var(y, !0), h(m), o.if(y));
      }
      function l(m) {
        for (const w in P)
          new RegExp(m).test(w) && (0, t.checkStrictMode)(d, `property ${w} matches pattern ${m} (use allowMatchingProperties)`);
      }
      function h(m) {
        o.forIn("key", c, (w) => {
          o.if((0, e._)`${(0, s.usePattern)(i, m)}.test(${w})`, () => {
            const b = $.includes(m);
            b || i.subschema({
              keyword: "patternProperties",
              schemaProp: m,
              dataProp: w,
              dataPropType: r.Type.Str
            }, y), d.opts.unevaluated && f !== !0 ? o.assign((0, e._)`${f}[${w}]`, !0) : !b && !d.allErrors && o.if((0, e.not)(y), () => o.break());
          });
        });
      }
    }
  };
  return _t.default = n, _t;
}
var Pt = {}, vn;
function Xi() {
  if (vn) return Pt;
  vn = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
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
  return Pt.default = e, Pt;
}
var St = {}, bn;
function Zi() {
  if (bn) return St;
  bn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: $e().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return St.default = e, St;
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
      n.setParams({ passing: g }), i.block($), n.result(d, () => n.reset(), () => n.error(!0));
      function $() {
        u.forEach((P, y) => {
          let f;
          (0, e.alwaysValidSchema)(c, P) ? i.var(_, !0) : f = n.subschema({
            keyword: "oneOf",
            schemaProp: y,
            compositeRule: !0
          }, _), y > 0 && i.if((0, s._)`${_} && ${d}`).assign(d, !1).assign(g, (0, s._)`[${g}, ${y}]`).else(), i.if(_, () => {
            i.assign(d, !0), i.assign(g, y), f && n.mergeEvaluated(f, s.Name);
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
      if ($(), i.reset(), u && d) {
        const y = o.let("ifClause");
        i.setParams({ ifClause: y }), o.if(_, P("then", y), P("else", y));
      } else u ? o.if(_, P("then")) : o.if((0, s.not)(_), P("else"));
      i.pass(g, () => i.error(!0));
      function $() {
        const y = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(y);
      }
      function P(y, f) {
        return () => {
          const p = i.subschema({ keyword: y }, _);
          o.assign(g, _), i.mergeValidEvaluated(p, g), f ? o.assign(f, (0, s._)`${y}`) : i.setParams({ ifClause: y });
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
var kt = {}, Pn;
function ns() {
  if (Pn) return kt;
  Pn = 1, Object.defineProperty(kt, "__esModule", { value: !0 });
  const s = te(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, s.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return kt.default = e, kt;
}
var Sn;
function is() {
  if (Sn) return mt;
  Sn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = xn(), e = Bi(), t = Dn(), r = Ki(), n = Hi(), i = Ji(), o = Wi(), a = zn(), c = Yi(), u = Qi(), d = Xi(), g = Zi(), _ = es(), $ = ts(), P = rs(), y = ns();
  function f(p = !1) {
    const l = [
      // any
      d.default,
      g.default,
      _.default,
      $.default,
      P.default,
      y.default,
      // object
      o.default,
      a.default,
      i.default,
      c.default,
      u.default
    ];
    return p ? l.push(e.default, r.default) : l.push(s.default, t.default), l.push(n.default), l;
  }
  return mt.default = f, mt;
}
var Nt = {}, At = {}, En;
function ss() {
  if (En) return At;
  En = 1, Object.defineProperty(At, "__esModule", { value: !0 });
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
      const { gen: i, data: o, $data: a, schema: c, schemaCode: u, it: d } = r, { opts: g, errSchemaPath: _, schemaEnv: $, self: P } = d;
      if (!g.validateFormats)
        return;
      a ? y() : f();
      function y() {
        const p = i.scopeValue("formats", {
          ref: P.formats,
          code: g.code.formats
        }), l = i.const("fDef", (0, s._)`${p}[${u}]`), h = i.let("fType"), m = i.let("format");
        i.if((0, s._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => i.assign(h, (0, s._)`${l}.type || "string"`).assign(m, (0, s._)`${l}.validate`), () => i.assign(h, (0, s._)`"string"`).assign(m, l)), r.fail$data((0, s.or)(w(), b()));
        function w() {
          return g.strictSchema === !1 ? s.nil : (0, s._)`${u} && !${m}`;
        }
        function b() {
          const S = $.$async ? (0, s._)`(${l}.async ? await ${m}(${o}) : ${m}(${o}))` : (0, s._)`${m}(${o})`, T = (0, s._)`(typeof ${m} == "function" ? ${S} : ${m}.test(${o}))`;
          return (0, s._)`${m} && ${m} !== true && ${h} === ${n} && !${T}`;
        }
      }
      function f() {
        const p = P.formats[c];
        if (!p) {
          w();
          return;
        }
        if (p === !0)
          return;
        const [l, h, m] = b(p);
        l === n && r.pass(S());
        function w() {
          if (g.strictSchema === !1) {
            P.logger.warn(T());
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
        function S() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!$.$async)
              throw new Error("async format in sync schema");
            return (0, s._)`await ${m}(${o})`;
          }
          return typeof h == "function" ? (0, s._)`${m}(${o})` : (0, s._)`${m}.test(${o})`;
        }
      }
    }
  };
  return At.default = t, At;
}
var Mn;
function os() {
  if (Mn) return Nt;
  Mn = 1, Object.defineProperty(Nt, "__esModule", { value: !0 });
  const e = [ss().default];
  return Nt.default = e, Nt;
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
  const s = Ci(), e = Gi(), t = is(), r = os(), n = as(), i = [
    s.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Ze.default = i, Ze;
}
var Rt = {}, Le = {}, Nn;
function ls() {
  if (Nn) return Le;
  Nn = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.DiscrError = void 0;
  var s;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(s || (Le.DiscrError = s = {})), Le;
}
var An;
function us() {
  if (An) return Rt;
  An = 1, Object.defineProperty(Rt, "__esModule", { value: !0 });
  const s = W(), e = ls(), t = ir(), r = Vt(), n = te(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: u } }) => (0, s._)`{error: ${a}, tag: ${u}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: u, schema: d, parentSchema: g, it: _ } = a, { oneOf: $ } = g;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const P = d.propertyName;
      if (typeof P != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!$)
        throw new Error("discriminator: requires oneOf keyword");
      const y = c.let("valid", !1), f = c.const("tag", (0, s._)`${u}${(0, s.getProperty)(P)}`);
      c.if((0, s._)`typeof ${f} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: f, tagName: P })), a.ok(y);
      function p() {
        const m = h();
        c.if(!1);
        for (const w in m)
          c.elseIf((0, s._)`${f} === ${w}`), c.assign(y, l(m[w]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: f, tagName: P }), c.endIf();
      }
      function l(m) {
        const w = c.name("valid"), b = a.subschema({ keyword: "oneOf", schemaProp: m }, w);
        return a.mergeEvaluated(b, s.Name), w;
      }
      function h() {
        var m;
        const w = {}, b = T(g);
        let S = !0;
        for (let z = 0; z < $.length; z++) {
          let U = $[z];
          if (U?.$ref && !(0, n.schemaHasRulesButRef)(U, _.self.RULES)) {
            const K = U.$ref;
            if (U = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, K), U instanceof t.SchemaEnv && (U = U.schema), U === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, K);
          }
          const G = (m = U?.properties) === null || m === void 0 ? void 0 : m[P];
          if (typeof G != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${P}"`);
          S = S && (b || T(U)), q(G, z);
        }
        if (!S)
          throw new Error(`discriminator: "${P}" must be required`);
        return w;
        function T({ required: z }) {
          return Array.isArray(z) && z.includes(P);
        }
        function q(z, U) {
          if (z.const)
            D(z.const, U);
          else if (z.enum)
            for (const G of z.enum)
              D(G, U);
          else
            throw new Error(`discriminator: "properties/${P}" must have "const" or "enum"`);
        }
        function D(z, U) {
          if (typeof z != "string" || z in w)
            throw new Error(`discriminator: "${P}" values must be unique strings`);
          w[z] = U;
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
    const t = Ni(), r = cs(), n = us(), i = gs, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((P) => this.addVocabulary(P)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const P = this.opts.$data ? this.$dataMetaSchema(i, o) : i;
        this.addMetaSchema(P, a, !1), this.refs["http://json-schema.org/schema"] = a;
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
  })(Je, Je.exports)), Je.exports;
}
var bs = vs();
const ws = /* @__PURE__ */ di(bs), $s = "http://json-schema.org/draft-07/schema#", _s = "JMON Composition (Multi-Track, Extended)", Ps = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values use numeric format in quarter notes (e.g., 4.5) for MIDI compatibility and algorithmic processing. The bars:beats:ticks format is available for display and conversion purposes only.", Ss = "object", Es = ["format", "version", "bpm", "tracks"], Ms = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 8.0 for beat 1 of bar 3 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '2:0:0')."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 16.0 for beat 1 of bar 5 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '4:0:0')."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"number","description":"Offset in quarter notes for when playback should start (e.g., 2.0 for beat 3)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0')."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"oneOf":[{"type":"number","description":"End time in quarter notes where the global loop should end (e.g., 32.0 for bar 9 in 4/4)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '8:0:0')."}],"description":"Where the global loop should end."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 4.5 for beat 1.5 of bar 2 in 4/4). Primary format for MIDI compatibility."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0', '1:3.5:240')."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Ts = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, ks = !1, Ns = {
  $schema: $s,
  title: _s,
  description: Ps,
  type: Ss,
  required: Es,
  properties: Ms,
  definitions: Ts,
  additionalProperties: ks
};
function As(s) {
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
        /^\d+$/.test(o) && (a = As(parseInt(o, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), s;
}
class or {
  constructor(e = Ns) {
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
  typeof s == "string" && (s = Ge(s)), typeof t == "string" && (t = Ge(t));
  const r = e.indexOf(t);
  if (e.includes(s))
    return e.indexOf(s) - r;
  {
    const n = Ln(s, e), i = e.indexOf(n), o = i > 0 ? i - 1 : i, a = e[o], c = n - s, u = s - a, d = c + u;
    if (d === 0) return i - r;
    const g = 1 - c / d, _ = 1 - u / d, $ = i - r, P = o - r;
    return $ * g + P * _;
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
    const _ = 1 - u / g, $ = 1 - d / g;
    return c * _ + a * $;
  }
}
function Gn(s) {
  s.length > 0 && s[0].length === 2 && (s = s.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of s)
    e.push([r, n, t]), t += n;
  return e;
}
function Bn(s, e = 0) {
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
  return Kn(Bn(s));
}
function Ge(s) {
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
function Hn(s, e) {
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
      const $ = c - _;
      if ($ >= 0 && $ < d && (d = $, u = g), _ > c) break;
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
function Gs(s, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(s)) {
    const o = [];
    for (let a = 0; a < e; a++) {
      const c = a * t, u = Hn(i, c);
      o.push(...u);
    }
    r[n] = o;
  }
  return r;
}
const Bs = {
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
  cdeToMidi: Ge,
  checkInput: xs,
  fibonacci: Us,
  fillGapsWithRests: Bn,
  findClosestPitchAtMeasureStart: Vs,
  getDegreeFromPitch: rr,
  getOctave: Un,
  getPitchFromDegree: js,
  getSharp: Cs,
  instrumentMapping: Bs,
  midiToCde: qs,
  noOverlap: Os,
  offsetTrack: Hn,
  qlToSeconds: Ls,
  quantizeNotes: zs,
  repairNotes: Is,
  repeatPolyloops: Gs,
  roundToList: Ln,
  scaleList: Ds,
  setOffsetsAccordingToDurations: Gn,
  tracksToDict: Rs,
  tune: Fs
}, Symbol.toStringTag, { value: "Module" }));
class Hs extends ue {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = Ge(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
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
        const g = o[d][Math.floor(Math.random() * o[d].length)], _ = a[d], $ = Array.isArray(g) ? g[0] : g, P = this.generateChord($, _);
        c.push(P);
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
class Js extends ue {
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
    const t = Un(e), r = this.tonic + t.toString(), n = Ge(r), i = this.scale.map((c) => rr(c, this.scale, n)), o = Math.round(rr(e, this.scale, n)), a = [];
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
      const $ = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      g = this.scale[$];
    } else
      g = n + u;
    for (; c < o + i; ) {
      const _ = o + i - c, $ = Math.min(d, _ / 2);
      if (_ >= $ * 2)
        a.push({ pitch: n, duration: $, time: c }), a.push({ pitch: g, duration: $, time: c + $ }), c += 2 * $;
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
      u.push(...a.map(($) => this.scale[_ + $] || n + $));
    } else
      u.push(...a.map((_) => n + _));
    c === "down" && u.reverse(), c === "both" && u.push(...u.slice(0, -1).reverse());
    const d = i / u.length, g = u.map((_, $) => ({
      pitch: _,
      duration: d,
      time: o + $ * d
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
function Jn(s, e, t, r) {
  return Ft.addArticulation(s, e, t, r);
}
function Wn(s, e) {
  return Ft.removeArticulation(s, e);
}
function Ws(s) {
  return Ft.validateSequence(s);
}
const Ys = Jn, Qs = Wn, Xs = {
  Scale: Fn,
  Progression: Hs,
  Voice: Js,
  Ornament: ar,
  Articulation: Ft,
  addArticulation: Jn,
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
function Pe(s, e = 4, t = 480) {
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
        time: Pe(i)
      };
    }
    if (typeof e == "object" && e !== null) {
      const { pitch: r, duration: n } = e;
      let i = "0:0:0";
      return typeof e.time == "string" ? i = e.time : typeof e.time == "number" ? i = Pe(e.time) : typeof e.offset == "number" && (i = Pe(e.offset)), {
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
    time: Pe(r)
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
      time: Pe(r)
    };
    return r += e, i;
  });
}
function Qn(s, e) {
  return s.map((t) => ({
    ...t,
    time: Pe(De(t.time) + e)
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
    startTime: Pe(r),
    endTime: Pe(n)
  };
}
const co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: Pe,
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
  const a = i.map((u, d) => [u, o[d], 1]), c = Gn(a);
  return t.legacy ? c : c.map(([u, d, g]) => ({
    pitch: u,
    duration: d,
    time: t.useStringTime ? Pe(g) : g
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
const Se = {
  timeSignature: [4, 4],
  // 4/4 time
  ticksPerQuarterNote: 480,
  // Standard MIDI resolution
  beatsPerBar: 4
  // Derived from time signature
};
function ze(s, e = Se) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = n * 4 / i, a = Math.floor(s / o), c = s % o, u = Math.floor(c), d = c - u, g = Math.round(d * r);
  return `${a}:${u}:${g}`;
}
function lr(s, e = Se) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = s.split(":");
  if (o.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${s}`);
  const a = parseInt(o[0], 10), c = parseFloat(o[1]), u = parseInt(o[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(u))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${s}`);
  const d = n * 4 / i;
  return a * d + c + u / r;
}
function vo(s, e = Se, t = !0) {
  return s.map((r) => {
    const n = { ...r };
    if (r.offset !== void 0 && (n.time = r.offset, delete n.offset), typeof r.time == "string" && r.time.includes(":") && (n.time = lr(r.time, e)), typeof r.duration == "number" && !t) {
      const i = r.duration;
      i === 1 ? n.duration = "4n" : i === 0.5 ? n.duration = "8n" : i === 0.25 ? n.duration = "16n" : i === 2 ? n.duration = "2n" : i === 4 && (n.duration = "1n");
    }
    return n;
  });
}
function Be(s, e = {}) {
  const {
    label: t = "track",
    midiChannel: r = 0,
    synth: n = { type: "Synth" },
    timingConfig: i = Se,
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
  constructor(e = [], t = 1, r = 1, n = 0.1, i = !1, o = Se) {
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
      const u = Array.from({ length: t }, (y, f) => [f]), d = new _e(u), _ = new jn(n, i).call(d);
      for (let y = 0; y < _.rows; y++)
        _.set(y, y, _.get(y, y) + o);
      let $ = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && ($ = new Array(t).fill(this.walkAround));
      const P = go($, _);
      a.push(P);
    }
    return r === 1 ? a[0] : a;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, o = this.data.map((y) => [y[0]]), a = this.data.map((y) => y[1]), c = new jn(n, i);
    this.gpr = new Zn(c);
    try {
      this.gpr.fit(o, a), this.isFitted = !0;
    } catch (y) {
      throw new Error(`Failed to fit Gaussian Process: ${y.message}`);
    }
    const u = Math.min(...this.data.map((y) => y[0])), g = (Math.max(...this.data.map((y) => y[0])) - u) / (t - 1), _ = Array.from({ length: t }, (y, f) => [u + f * g]), $ = this.gpr.sampleY(_, r), P = _.map((y) => y[0]);
    return r === 1 ? [P, $[0]] : [P, $];
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
    const g = Array.isArray(e[0]) ? e : [e], _ = r || Array.from({ length: g[0].length }, ($, P) => P);
    for (let $ = 0; $ < g[0].length; $++) {
      const P = t[$ % t.length], y = r ? _[$] : d, f = g.map((l) => {
        let h = l[$];
        if (o) {
          const m = Math.min(...l), b = Math.max(...l) - m || 1, S = (h - m) / b, T = Math.floor(S * o.length), q = Math.max(0, Math.min(T, o.length - 1));
          h = o[q];
        } else {
          const m = Math.min(...l), b = Math.max(...l) - m || 1, S = (h - m) / b;
          h = a[0] + S * (a[1] - a[0]);
        }
        return c && (h = Math.round(h)), h;
      }), p = f.length === 1 ? f[0] : f;
      u.push({
        pitch: p,
        duration: P,
        time: i ? ze(y, this.timingConfig) : y
      }), r || (d += P);
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
    return Be(i, {
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
      ($) => $ >= c[0] && $ <= Math.min(c[1], a)
    ), this.mutationProbabilities = i || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const $ = this.possibleDurations.map((P, y) => Math.pow(2, -y));
        return this.weightedChoice(this.possibleDurations, $);
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
          const _ = Math.max(Math.abs(d), 1), $ = 1 - Math.abs(u - d) / _;
          r += Math.max(0, $) * g;
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
      timingConfig: n = Se,
      dimension: i = 0,
      mapToScale: o = null,
      scaleRange: a = [60, 72]
    } = t, c = this.getProjection(i), u = [];
    let d = 0;
    for (let g = 0; g < c.length; g++) {
      const _ = e[g % e.length];
      let $ = c[g];
      if (o) {
        const P = Math.min(...c), f = Math.max(...c) - P || 1, p = ($ - P) / f, l = Math.floor(p * o.length), h = Math.max(0, Math.min(l, o.length - 1));
        $ = o[h];
      } else
        $ = this.mapToScale([c], o || [60, 62, 64, 65, 67, 69, 71])[0][g];
      u.push({
        pitch: $,
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
    return Be(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
}
class Po {
  walkRange;
  walkStart;
  walkProbability;
  roundTo;
  branchingProbability;
  mergingProbability;
  timingConfig;
  constructor(e = {}) {
    this.walkRange = e.walkRange || null, this.walkStart = e.walkStart !== void 0 ? e.walkStart : this.walkRange ? Math.floor((this.walkRange[1] - this.walkRange[0]) / 2) + this.walkRange[0] : 0, this.walkProbability = e.walkProbability || [-1, 0, 1], this.roundTo = e.roundTo !== void 0 ? e.roundTo : null, this.branchingProbability = e.branchingProbability || 0, this.mergingProbability = e.mergingProbability || 0, this.timingConfig = e.timingConfig || Se;
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
        let $ = g + _;
        if (isNaN($) && ($ = g), this.walkRange !== null && ($ < this.walkRange[0] ? $ = this.walkRange[0] : $ > this.walkRange[1] && ($ = this.walkRange[1])), isNaN($) && ($ = this.walkStart), d && (d[o] = $), a[u] = $, r() < this.branchingProbability) {
          const P = this.createBranch(n[u], o), y = this.generateStep(r);
          let f = g + y;
          isNaN(f) && (f = g), this.walkRange !== null && (f < this.walkRange[0] ? f = this.walkRange[0] : f > this.walkRange[1] && (f = this.walkRange[1])), isNaN(f) && (f = this.walkStart), P[o] = f, c.push(P), a.push(f);
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
    return Be(i, {
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
  constructor(e = Se) {
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
      let $, P;
      if (o) {
        const y = Math.max(0, Math.min(1, _.distance / 10));
        $ = n[0] + y * (n[1] - n[0]);
      } else
        $ = n[0] + _.angle / 360 * (n[1] - n[0]);
      if (a)
        P = i[0] + _.angle / 360 * (i[1] - i[0]);
      else {
        const y = Math.max(0, Math.min(1, _.distance / 10));
        P = i[1] - y * (i[1] - i[0]);
      }
      if (c) {
        const y = Math.floor(($ - n[0]) / (n[1] - n[0]) * c.length), f = Math.max(0, Math.min(y, c.length - 1));
        $ = c[f];
      } else
        $ = Math.round($);
      g.push({
        pitch: $,
        duration: P,
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
      const c = Be(o, {
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
class So {
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
    const { operation: t, direction: r, repetition: n, timingConfig: i = Se } = e;
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
    return Be(r, {
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
  constructor(e, t = "down", r = 0, n = Se) {
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
        const { offset: P, time: y, ...f } = i;
        n.push({
          ...f,
          pitch: void 0,
          time: t ? this.beatsToTime(P) : P
        });
        continue;
      }
      const o = i.pitch, c = this.tChord.map((P) => P - o).map((P, y) => ({ index: y, value: P })).sort((P, y) => Math.abs(P.value) - Math.abs(y.value));
      let u = this.rank, d;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const P = c.filter(
          ({ value: y }) => this.currentDirection === "up" ? y >= 0 : y <= 0
        );
        if (P.length === 0)
          d = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          u >= P.length && (u = P.length - 1);
          const y = P[u].index;
          d = this.tChord[y];
        }
      } else {
        u >= c.length && (u = c.length - 1);
        const P = c[u].index;
        d = this.tChord[P];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: g, time: _, ...$ } = i;
      n.push({
        ...$,
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
      const _ = a.slice(0, g + 1).reduce(($, P) => $ + P, 0);
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
const No = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: ko,
  MusicalIndex: jt
}, Symbol.toStringTag, { value: "Module" })), Ao = {
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
    Chain: Po,
    Phasor: {
      Vector: xe,
      System: ur
    }
  },
  fractals: {
    Mandelbrot: So,
    LogisticMap: Eo
  },
  minimalism: {
    Process: Mo,
    Tintinnabuli: To
  }
}, jo = {
  ...No
}, Io = {
  ...Ks
}, Ue = {
  theory: Ao,
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
  const n = new tr(e).convert(s).map((_, $) => ({
    originalTrackIndex: $,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: _.label },
    synthConfig: { type: _.type || "PolySynth" },
    partEvents: _.part || []
  })), i = s.metadata?.tempo || s.bpm || 120, [o, a] = (s.timeSignature || "4/4").split("/").map((_) => parseInt(_, 10)), c = isFinite(o) ? o : 4;
  let u = 0;
  n.forEach((_) => {
    _.partEvents && _.partEvents.length > 0 && _.partEvents.forEach(($) => {
      const P = tr.parseBBTToBeats($.time, c), y = tr.parseDurationToBeats($.duration, c), f = P + y;
      f > u && (u = f);
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
  const u = s.bpm || 120, g = ei(s, { autoMultivoice: i, maxVoices: o, showDebug: r }), { tracks: _, metadata: $ } = g;
  let P = $.totalDuration;
  const y = {
    background: "#FFFFFF",
    primary: "#333",
    secondary: "#F0F0F0",
    text: "#000000",
    lightText: "#666666",
    border: "#CCCCCC"
  }, f = document.createElement("div");
  f.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${y.background};
        color: ${y.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${y.border};
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
  const h = document.createElement("div");
  h.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const m = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"];
  s.audioGraph && s.audioGraph.some((A) => A.type === "Sampler") && m.unshift("Sampler");
  const w = s.tracks || s.sequences || [], b = [];
  w.forEach((A, I) => {
    const x = _.find((X) => X.originalTrackIndex === I)?.analysis;
    x?.hasGlissando && console.warn(`Track ${A.label || A.name || I + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const L = document.createElement("div");
    L.style.cssText = `
            margin-bottom: 8px;
        `;
    const Y = document.createElement("label");
    Y.textContent = A.name || A.label || `Track ${I + 1}`, Y.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${y.text};
            display: block;
            margin-bottom: 8px;
            font-weight: normal;
        `;
    const Z = document.createElement("select");
    Z.style.cssText = `
            padding: 4px;
            border: 1px solid ${y.secondary};
            border-radius: 4px;
            background-color: ${y.background};
            color: ${y.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            outline: none;
        `, m.forEach((X, ne) => {
      const ee = document.createElement("option");
      ee.value = X, ee.textContent = X, (s.tracks?.[I]?.synthRef && X === "Sampler" || x?.hasGlissando && X === "Synth" || !x?.hasGlissando && !s.tracks?.[I]?.synthRef && X === "PolySynth") && (ee.selected = !0), x?.hasGlissando && (X === "PolySynth" || X === "DuoSynth") && (ee.disabled = !0, ee.textContent += " (mono only for glissando)"), Z.appendChild(ee);
    }), b.push(Z), L.append(Y, Z), h.appendChild(L);
  }), l.appendChild(h);
  const S = document.createElement("div");
  S.style.cssText = `
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
        color: ${y.text};
    `;
  const D = document.createElement("input");
  D.type = "number", D.min = 60, D.max = 240, D.value = u, D.style.cssText = `
        padding: 4px;
        border: 1px solid ${y.secondary};
        border-radius: 4px;
        background-color: ${y.background};
        color: ${y.text};
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
    `, T.append(q, D), S.appendChild(T);
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
        color: ${y.text};
        min-width: 40px;
        text-align: center;
    `;
  const G = document.createElement("div");
  G.textContent = "0:00", G.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${y.text};
        min-width: 40px;
        text-align: center;
    `;
  const K = document.createElement("input");
  K.type = "range", K.min = 0, K.max = 100, K.value = 0, K.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${y.secondary};
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
        background-color: ${y.primary};
        color: ${y.background};
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
        color: ${y.lightText};
        margin: 0px 0px 0px 10px;
    `, z.append(U, K, G, se);
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
    `, ge.append(re, ve), p.append(l, S), f.append(p, z, ye, ge);
  let k, N = !1, O = [], C = [], v = [], E = null;
  const j = s.tracks || s.sequences || [], F = () => {
    if (!k || !s.audioGraph || !Array.isArray(s.audioGraph)) return null;
    const A = {}, I = (x) => {
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
        else Y === "Destination" && (A[L] = k.Destination);
        ne && (A[L] = ne);
      }), A;
    } catch (x) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", x), null;
    }
  }, V = (A) => `${Math.floor(A / 60)}:${Math.floor(A % 60).toString().padStart(2, "0")}`;
  G.textContent = V(P);
  const Q = async () => {
    if (typeof window < "u") {
      const A = a || window.Tone || (typeof k < "u" ? k : null);
      if (A)
        console.log("[PLAYER] Using existing Tone.js, version:", A.version || "unknown"), window.Tone = A;
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
      const I = window.Tone || A;
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
  }, H = () => {
    if (!k) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const A = [];
    if (k.PolySynth || A.push("PolySynth"), k.Synth || A.push("Synth"), k.Part || A.push("Part"), k.Transport || A.push("Transport"), A.length > 0) {
      console.error("[PLAYER] Tone.js is missing required constructors:", A), console.error("[PLAYER] Available Tone properties:", Object.keys(k).filter((I) => typeof k[I] == "function").slice(0, 20)), console.error("[PLAYER] Tone object:", k), console.error("[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually.");
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
      const { originalTrackIndex: x, voiceIndex: L, totalVoices: Y, trackInfo: Z, synthConfig: X, partEvents: ne } = I, pe = (j[x] || {}).synthRef, le = 60 / $.tempo, Re = (ne || []).map((oe) => {
        const B = typeof oe.time == "number" ? oe.time * le : oe.time, ae = typeof oe.duration == "number" ? oe.duration * le : oe.duration;
        return { ...oe, time: B, duration: ae };
      });
      let ce = null;
      if (pe && E && E[pe])
        ce = E[pe];
      else {
        const oe = b[x] ? b[x].value : X.type;
        try {
          const B = X.reason === "glissando_compatibility" ? X.type : oe;
          if (!k[B] || typeof k[B] != "function")
            throw new Error(`Tone.${B} is not a constructor`);
          ce = new k[B]().toDestination(), X.reason === "glissando_compatibility" && L === 0 && console.warn(`[MULTIVOICE] Using ${B} instead of ${X.original} for glissando in ${Z.label}`);
        } catch (B) {
          console.warn(`Failed to create ${oe}, using PolySynth:`, B);
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
      const me = new k.Part((oe, B) => {
        if (Array.isArray(B.pitch))
          B.pitch.forEach((ae) => {
            let he = "C4";
            typeof ae == "number" ? he = k.Frequency(ae, "midi").toNote() : typeof ae == "string" ? he = ae : Array.isArray(ae) && typeof ae[0] == "string" && (he = ae[0]), ce.triggerAttackRelease(he, B.duration, oe);
          });
        else if (B.articulation === "glissando" && B.glissTarget !== void 0) {
          let ae = typeof B.pitch == "number" ? k.Frequency(B.pitch, "midi").toNote() : B.pitch, he = typeof B.glissTarget == "number" ? k.Frequency(B.glissTarget, "midi").toNote() : B.glissTarget;
          console.log("[PLAYER] Glissando", { fromNote: ae, toNote: he, duration: B.duration, time: oe }), console.log("[PLAYER] Glissando effect starting from", ae, "to", he), ce.triggerAttack(ae, oe, B.velocity || 0.8);
          const Ee = k.Frequency(ae).toFrequency(), pr = k.Frequency(he).toFrequency(), mr = 1200 * Math.log2(pr / Ee);
          if (ce.detune && ce.detune.setValueAtTime && ce.detune.linearRampToValueAtTime)
            ce.detune.setValueAtTime(0, oe), ce.detune.linearRampToValueAtTime(mr, oe + B.duration), console.log("[PLAYER] Applied detune glissando:", mr, "cents over", B.duration, "beats");
          else {
            const si = k.Frequency(ae).toMidi(), oi = k.Frequency(he).toMidi(), Ke = Math.max(3, Math.abs(oi - si)), yr = B.duration / Ke;
            for (let He = 1; He < Ke; He++) {
              const ai = He / (Ke - 1), ci = Ee * Math.pow(pr / Ee, ai), li = k.Frequency(ci).toNote(), ui = oe + He * yr;
              ce.triggerAttackRelease(li, yr * 0.8, ui, (B.velocity || 0.8) * 0.7);
            }
            console.log("[PLAYER] Applied chromatic glissando with", Ke, "steps");
          }
          ce.triggerRelease(oe + B.duration);
        } else {
          let ae = "C4";
          typeof B.pitch == "number" ? ae = k.Frequency(B.pitch, "midi").toNote() : typeof B.pitch == "string" ? ae = B.pitch : Array.isArray(B.pitch) && typeof B.pitch[0] == "string" && (ae = B.pitch[0]);
          let he = B.duration, Ee = B.velocity || 0.8;
          B.articulation === "staccato" && (he = B.duration * 0.5), B.articulation === "accent" && (Ee = Math.min(Ee * 2, 1)), B.articulation === "tenuto" && (he = B.duration * 1.5, Ee = Math.min(Ee * 1.3, 1)), ce.triggerAttackRelease(ae, he, oe, Ee);
        }
      }, Re);
      C.push(me);
    }), k.Transport.bpm.value = $.tempo, k.Transport.loopEnd = P, k.Transport.loop = !0, k.Transport.stop(), k.Transport.position = 0, G.textContent = V(P);
  }, M = () => {
    if (k && N) {
      const A = typeof k.Transport.loopEnd == "number" ? k.Transport.loopEnd : k.Time(k.Transport.loopEnd).toSeconds(), I = k.Transport.seconds % A, x = I / A * 100;
      K.value = Math.min(x, 100), U.textContent = V(I), G.textContent = V(A), k.Transport.state === "started" && N ? requestAnimationFrame(M) : k.Transport.state === "stopped" && (k.Transport.seconds = 0, K.value = 0, U.textContent = V(0), N = !1, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  se.addEventListener("click", async () => {
    if (!k)
      if (await Q())
        H();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (N)
      k.Transport.stop(), C.forEach((A) => {
        A.stop();
      }), N = !1, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
    else {
      if ((!k.context || k.context.state !== "running") && (await k.start(), console.log("[PLAYER] Audio context started:", k.context ? k.context.state : "unknown")), O.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), H()), k.Transport.stop(), k.Transport.position = 0, console.log("[PLAYER] Transport state before start:", k.Transport.state), console.log("[PLAYER] Transport position reset to:", k.Transport.position), console.log("[PLAYER] Audio context state:", k.context ? k.context.state : "unknown"), console.log("[PLAYER] Parts count:", C.length), console.log("[PLAYER] Synths count:", O.length), E) {
        const A = Object.values(E).filter((I) => I && I.name === "Sampler");
        if (A.length > 0 && v.length > 0) {
          console.log(`[PLAYER] Waiting for ${A.length} sampler(s) to load...`);
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
      C.forEach((A, I) => {
        if (!A || typeof A.start != "function") {
          console.error(`[PLAYER] Part ${I} is invalid:`, A);
          return;
        }
        try {
          A.start(0);
        } catch (x) {
          console.error(`[PLAYER] Failed to start part ${I}:`, x);
        }
      }), k.Transport.start(), N = !0, se.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', M();
    }
  }), K.addEventListener("input", () => {
    if (k && P > 0) {
      const A = K.value / 100 * P;
      k.Transport.seconds = A, U.textContent = V(A);
    }
  }), D.addEventListener("change", () => {
    const A = parseInt(D.value);
    k && A >= 60 && A <= 240 ? k.Transport.bpm.value = A : D.value = k ? k.Transport.bpm.value : u;
  }), b.forEach((A) => {
    A.addEventListener("change", () => {
      k && O.length > 0 && H();
    });
  }), re.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), ve.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  });
  const R = typeof window < "u" && window.Tone || (typeof k < "u" ? k : null);
  if (R && Q().then(() => {
    H(), t && setTimeout(() => {
      se.click();
    }, 500);
  }), t && !R) {
    const A = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof k < "u" ? k : null)) && (clearInterval(A), setTimeout(() => {
        se.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(A);
    }, 1e4);
  }
  return f;
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
    const n = e.timeSignature || "4/4", [i, o] = n.split("/").map(Number), a = i * (4 / o), c = t.measuresPerLine || 4, u = t.lineBreaks || [], d = t.renderMode || "merged", g = t.trackIndex || 0, _ = !!t.hideRests, $ = t.showArticulations !== !1, P = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (P.length === 0) return r;
    const y = (() => {
      let p = 0;
      return P.forEach((l) => {
        const h = l.notes || l;
        Array.isArray(h) && h.forEach((m) => {
          const w = typeof m.time == "number" ? m.time : 0, b = typeof m.duration == "number" ? m.duration : 1, S = w + b;
          S > p && (p = S);
        });
      }), p;
    })(), f = Math.max(1, Math.ceil(y / a));
    if (d === "tracks" && P.length > 1)
      r += "%%score {", P.forEach((p, l) => {
        l > 0 && (r += " | "), r += `${l + 1}`;
      }), r += `}
`, P.forEach((p, l) => {
        const h = p.notes || p;
        if (h.length === 0) return;
        const m = l + 1, w = p.label || `Track ${l + 1}`, b = w.length > 12 ? w.substring(0, 10) + ".." : w, S = p.instrument ? ` [${p.instrument}]` : "";
        r += `V:${m} name="${w}${S}" snm="${b}"
`;
        const T = h.filter((D) => D.pitch !== void 0).sort((D, z) => (D.time || 0) - (z.time || 0)), { abcNotesStr: q } = this.convertNotesToAbc(T, a, c, u, { hideRests: _, showArticulations: $, padMeasures: f });
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
        const S = (b || "").toLowerCase();
        for (const T of Object.keys(p))
          if (S.includes(T)) return p[T];
        return "E";
      }, h = [];
      P.forEach((b) => {
        const S = b.notes || b, T = b.label || "", q = l(T);
        (S || []).forEach((D) => {
          D.pitch !== void 0 && h.push({
            time: typeof D.time == "number" ? D.time : 0,
            duration: typeof D.duration == "number" ? D.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: q,
            articulation: D.articulation
          });
        });
      });
      const m = h.sort((b, S) => (b.time || 0) - (S.time || 0)), { abcNotesStr: w } = this.convertNotesToAbc(m, a, c, u, { hideRests: _, showArticulations: $, padMeasures: f });
      w.trim() && (r += w + `
`);
    } else if (d === "single") {
      const p = P[g];
      if (p) {
        const h = (p.notes || p).filter((w) => w.pitch !== void 0).sort((w, b) => (w.time || 0) - (b.time || 0)), { abcNotesStr: m } = this.convertNotesToAbc(h, a, c, u, { hideRests: _, showArticulations: $, padMeasures: f });
        m.trim() && (r += m + `
`);
      }
    } else {
      const p = [];
      P.forEach((m) => {
        (m.notes || m).forEach((b) => {
          b.pitch !== void 0 && p.push(b);
        });
      });
      const l = p.sort((m, w) => (m.time || 0) - (w.time || 0)), { abcNotesStr: h } = this.convertNotesToAbc(l, a, c, u, { hideRests: _, showArticulations: $, padMeasures: f });
      h.trim() && (r += h + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}) {
    let o = "", a = 0, c = 0, u = 0, d = 0;
    const g = options?.quantizeBeats || 0.25, _ = 1e-6, $ = (m) => hr(m, g, "nearest"), P = (m) => ni(m, g), y = (m) => {
      o += m + " ";
    }, f = () => {
      for (; a >= t - 1e-9; )
        y("|"), a -= t, c++, u++, (n.includes(c) || u >= r) && (o += `
`, u = 0);
    }, p = (m, { forceVisible: w = !1 } = {}) => {
      let b = m;
      for (; b > 0; ) {
        const S = t - a, T = $(Math.min(b, S));
        let q = i.hideRests && !w ? "x" : "z";
        q += P(T), y(q), a = $(a + T), f(), b = $(b - T);
      }
    };
    for (const m of e) {
      const w = typeof m.time == "number" ? $(m.time) : 0, b = typeof m.duration == "number" ? $(m.duration) : 1, S = $(w - d);
      S > _ && p(S);
      let T = "z";
      if (typeof m.pitch == "number") {
        const D = m.pitch, z = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], U = Math.floor(D / 12) - 1, G = D % 12;
        T = z[G].replace("#", "^"), U >= 4 ? (T = T.toLowerCase(), U > 4 && (T += "'".repeat(U - 4))) : U < 4 && (T = T.toUpperCase(), U < 3 && (T += ",".repeat(3 - U)));
      } else typeof m.pitch == "string" ? T = m.pitch : m.pitch === null && (T = i.hideRests ? "x" : "z");
      let q = T;
      q += P(b), i.showArticulations && (m.articulation === "staccato" && (q += "."), m.articulation === "accent" && (q += ">"), m.articulation === "tenuto" && (q += "-"), m.articulation === "marcato" && (q += "^")), y(q), a = $(a + b), f(), d = $(w + b);
    }
    const l = i.padMeasures || 0;
    for (; c < l; ) {
      const m = $(t - a);
      m > _ && p(m, { forceVisible: !0 }), y("|"), a = 0, c++;
    }
    const h = o.trim();
    return h && !h.endsWith("|") && (o += "|"), { abcNotesStr: o };
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
function Go(s, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: o = {}
  } = e, a = ii(s, o), c = document.createElement("div");
  c.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const u = document.createElement("div");
  if (u.id = `rendered-score-${Date.now()}`, u.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, c.appendChild(u), n) {
    const d = document.createElement("details");
    d.style.marginTop = "15px";
    const g = document.createElement("summary");
    g.textContent = "ABC Notation (click to expand)", g.style.cursor = "pointer", d.appendChild(g);
    const _ = document.createElement("pre");
    _.textContent = a, _.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, d.appendChild(_), c.appendChild(d);
  }
  if (typeof ABCJS < "u")
    try {
      const d = r || null, g = { responsive: i, scale: t };
      d && (g.staffwidth = d), ABCJS.renderAbc(u, a, g), setTimeout(() => {
        if (u.children.length === 0 || u.innerHTML.trim() === "")
          try {
            ABCJS.renderAbc(u, a), u.children.length === 0 && (u.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + a + "</pre>");
          } catch {
            u.innerHTML = "<p>Error with alternative rendering</p><pre>" + a + "</pre>";
          }
      }, 200);
    } catch (d) {
      console.error("Error rendering with ABCJS:", d), u.innerHTML = "<p>Error rendering notation</p><pre>" + a + "</pre>";
    }
  else
    u.innerHTML = "<p>ABCJS not available - showing text notation only</p><pre>" + a + "</pre>";
  return c;
}
const Bo = {
  // Core functionality
  render: Lo,
  play: Uo,
  score: Go,
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
Bo.visualization = Ko;
export {
  Bo as default,
  Bo as jm
};
