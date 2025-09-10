function gi(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var Ye = { exports: {} }, Bt = {}, Te = {}, Ce = {}, Ut = {}, Kt = {}, Jt = {}, wr;
function qt() {
  return wr || (wr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.regexpCode = o.getEsmExportName = o.getProperty = o.safeStringify = o.stringify = o.strConcat = o.addCodeArg = o.str = o._ = o.nil = o._Code = o.Name = o.IDENTIFIER = o._CodeOrName = void 0;
    class e {
    }
    o._CodeOrName = e, o.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(l) {
        if (super(), !o.IDENTIFIER.test(l))
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
    o.Name = t;
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
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((f, g) => `${f}${g}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((f, g) => (g instanceof t && (f[g.str] = (f[g.str] || 0) + 1), f), {});
      }
    }
    o._Code = r, o.nil = new r("");
    function n(p, ...l) {
      const f = [p[0]];
      let g = 0;
      for (; g < l.length; )
        a(f, l[g]), f.push(p[++g]);
      return new r(f);
    }
    o._ = n;
    const i = new r("+");
    function s(p, ...l) {
      const f = [w(p[0])];
      let g = 0;
      for (; g < l.length; )
        f.push(i), a(f, l[g]), f.push(i, w(p[++g]));
      return c(f), new r(f);
    }
    o.str = s;
    function a(p, l) {
      l instanceof r ? p.push(...l._items) : l instanceof t ? p.push(l) : p.push(y(l));
    }
    o.addCodeArg = a;
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
      return l.emptyStr() ? p : p.emptyStr() ? l : s`${p}${l}`;
    }
    o.strConcat = d;
    function y(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : w(Array.isArray(p) ? p.join(",") : p);
    }
    function $(p) {
      return new r(w(p));
    }
    o.stringify = $;
    function w(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    o.safeStringify = w;
    function S(p) {
      return typeof p == "string" && o.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    o.getProperty = S;
    function m(p) {
      if (typeof p == "string" && o.IDENTIFIER.test(p))
        return new r(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    o.getEsmExportName = m;
    function h(p) {
      return new r(p.toString());
    }
    o.regexpCode = h;
  })(Jt)), Jt;
}
var Ht = {}, _r;
function $r() {
  return _r || (_r = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.ValueScope = o.ValueScopeName = o.Scope = o.varKinds = o.UsedValueState = void 0;
    const e = qt();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (o.UsedValueState = r = {})), o.varKinds = {
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
        var d, y;
        if (!((y = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || y === void 0) && y.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    o.Scope = n;
    class i extends e.Name {
      constructor(u, d) {
        super(d), this.prefix = u;
      }
      setValue(u, { property: d, itemIndex: y }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(d)}[${y}]`;
      }
    }
    o.ValueScopeName = i;
    const s = (0, e._)`\n`;
    class a extends n {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? s : e.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new i(u, this._newName(u));
      }
      value(u, d) {
        var y;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const $ = this.toName(u), { prefix: w } = $, S = (y = d.key) !== null && y !== void 0 ? y : d.ref;
        let m = this._values[w];
        if (m) {
          const l = m.get(S);
          if (l)
            return l;
        } else
          m = this._values[w] = /* @__PURE__ */ new Map();
        m.set(S, $);
        const h = this._scope[w] || (this._scope[w] = []), p = h.length;
        return h[p] = d.ref, $.setValue(d, { property: w, itemIndex: p }), $;
      }
      getValue(u, d) {
        const y = this._values[u];
        if (y)
          return y.get(d);
      }
      scopeRefs(u, d = this._values) {
        return this._reduceValues(d, (y) => {
          if (y.scopePath === void 0)
            throw new Error(`CodeGen: name "${y}" has no value`);
          return (0, e._)`${u}${y.scopePath}`;
        });
      }
      scopeCode(u = this._values, d, y) {
        return this._reduceValues(u, ($) => {
          if ($.value === void 0)
            throw new Error(`CodeGen: name "${$}" has no value`);
          return $.value.code;
        }, d, y);
      }
      _reduceValues(u, d, y = {}, $) {
        let w = e.nil;
        for (const S in u) {
          const m = u[S];
          if (!m)
            continue;
          const h = y[S] = y[S] || /* @__PURE__ */ new Map();
          m.forEach((p) => {
            if (h.has(p))
              return;
            h.set(p, r.Started);
            let l = d(p);
            if (l) {
              const f = this.opts.es5 ? o.varKinds.var : o.varKinds.const;
              w = (0, e._)`${w}${f} ${p} = ${l};${this.opts._n}`;
            } else if (l = $?.(p))
              w = (0, e._)`${w}${l}${this.opts._n}`;
            else
              throw new t(p);
            h.set(p, r.Completed);
          });
        }
        return w;
      }
    }
    o.ValueScope = a;
  })(Ht)), Ht;
}
var Sr;
function Y() {
  return Sr || (Sr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.or = o.and = o.not = o.CodeGen = o.operators = o.varKinds = o.ValueScopeName = o.ValueScope = o.Scope = o.Name = o.regexpCode = o.stringify = o.getProperty = o.nil = o.strConcat = o.str = o._ = void 0;
    const e = qt(), t = $r();
    var r = qt();
    Object.defineProperty(o, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(o, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(o, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(o, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(o, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(o, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(o, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(o, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var n = $r();
    Object.defineProperty(o, "Scope", { enumerable: !0, get: function() {
      return n.Scope;
    } }), Object.defineProperty(o, "ValueScope", { enumerable: !0, get: function() {
      return n.ValueScope;
    } }), Object.defineProperty(o, "ValueScopeName", { enumerable: !0, get: function() {
      return n.ValueScopeName;
    } }), Object.defineProperty(o, "varKinds", { enumerable: !0, get: function() {
      return n.varKinds;
    } }), o.operators = {
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
    class s extends i {
      constructor(v, E, O) {
        super(), this.varKind = v, this.name = E, this.rhs = O;
      }
      render({ es5: v, _n: E }) {
        const O = v ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${O} ${this.name}${F};` + E;
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
      constructor(v, E, O) {
        super(), this.lhs = v, this.rhs = E, this.sideEffects = O;
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
      constructor(v, E, O, F) {
        super(v, O, F), this.op = E;
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
    class y extends i {
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
    class $ extends i {
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
        return this.nodes.reduce((E, O) => E + O.render(v), "");
      }
      optimizeNodes() {
        const { nodes: v } = this;
        let E = v.length;
        for (; E--; ) {
          const O = v[E].optimizeNodes();
          Array.isArray(O) ? v.splice(E, 1, ...O) : O ? v[E] = O : v.splice(E, 1);
        }
        return v.length > 0 ? this : void 0;
      }
      optimizeNames(v, E) {
        const { nodes: O } = this;
        let F = O.length;
        for (; F--; ) {
          const L = O[F];
          L.optimizeNames(v, E) || (ne(v, L.names), O.splice(F, 1));
        }
        return O.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((v, E) => G(v, E.names), {});
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
          const O = E.optimizeNodes();
          E = this.else = Array.isArray(O) ? new h(O) : O;
        }
        if (E)
          return v === !1 ? E instanceof p ? E : E.nodes : this.nodes.length ? this : new p(ye(v), E instanceof p ? [E] : E.nodes);
        if (!(v === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(v, E) {
        var O;
        if (this.else = (O = this.else) === null || O === void 0 ? void 0 : O.optimizeNames(v, E), !!(super.optimizeNames(v, E) || this.else))
          return this.condition = K(this.condition, v, E), this;
      }
      get names() {
        const v = super.names;
        return B(v, this.condition), this.else && G(v, this.else.names), v;
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
        return G(super.names, this.iteration.names);
      }
    }
    class g extends l {
      constructor(v, E, O, F) {
        super(), this.varKind = v, this.name = E, this.from = O, this.to = F;
      }
      render(v) {
        const E = v.es5 ? t.varKinds.var : this.varKind, { name: O, from: F, to: L } = this;
        return `for(${E} ${O}=${F}; ${O}<${L}; ${O}++)` + super.render(v);
      }
      get names() {
        const v = B(super.names, this.from);
        return B(v, this.to);
      }
    }
    class _ extends l {
      constructor(v, E, O, F) {
        super(), this.loop = v, this.varKind = E, this.name = O, this.iterable = F;
      }
      render(v) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(v);
      }
      optimizeNames(v, E) {
        if (super.optimizeNames(v, E))
          return this.iterable = K(this.iterable, v, E), this;
      }
      get names() {
        return G(super.names, this.iterable.names);
      }
    }
    class b extends S {
      constructor(v, E, O) {
        super(), this.name = v, this.args = E, this.async = O;
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
    class k extends S {
      render(v) {
        let E = "try" + super.render(v);
        return this.catch && (E += this.catch.render(v)), this.finally && (E += this.finally.render(v)), E;
      }
      optimizeNodes() {
        var v, E;
        return super.optimizeNodes(), (v = this.catch) === null || v === void 0 || v.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(v, E) {
        var O, F;
        return super.optimizeNames(v, E), (O = this.catch) === null || O === void 0 || O.optimizeNames(v, E), (F = this.finally) === null || F === void 0 || F.optimizeNames(v, E), this;
      }
      get names() {
        const v = super.names;
        return this.catch && G(v, this.catch.names), this.finally && G(v, this.finally.names), v;
      }
    }
    class I extends S {
      constructor(v) {
        super(), this.error = v;
      }
      render(v) {
        return `catch(${this.error})` + super.render(v);
      }
    }
    I.kind = "catch";
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
        const O = this._extScope.value(v, E);
        return (this._values[O.prefix] || (this._values[O.prefix] = /* @__PURE__ */ new Set())).add(O), O;
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
      _def(v, E, O, F) {
        const L = this._scope.toName(E);
        return O !== void 0 && F && (this._constants[L.str] = O), this._leafNode(new s(v, L, O)), L;
      }
      // `const` declaration (`var` in es5 mode)
      const(v, E, O) {
        return this._def(t.varKinds.const, v, E, O);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(v, E, O) {
        return this._def(t.varKinds.let, v, E, O);
      }
      // `var` declaration with optional assignment
      var(v, E, O) {
        return this._def(t.varKinds.var, v, E, O);
      }
      // assignment code
      assign(v, E, O) {
        return this._leafNode(new a(v, E, O));
      }
      // `+=` code
      add(v, E) {
        return this._leafNode(new c(v, o.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(v) {
        return typeof v == "function" ? v() : v !== e.nil && this._leafNode(new $(v)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...v) {
        const E = ["{"];
        for (const [O, F] of v)
          E.length > 1 && E.push(","), E.push(O), (O !== F || this.opts.es5) && (E.push(":"), (0, e.addCodeArg)(E, F));
        return E.push("}"), new e._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(v, E, O) {
        if (this._blockNode(new p(v)), E && O)
          this.code(E).else().code(O).endIf();
        else if (E)
          this.code(E).endIf();
        else if (O)
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
      forRange(v, E, O, F, L = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Z = this._scope.toName(v);
        return this._for(new g(L, Z, E, O), () => F(Z));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(v, E, O, F = t.varKinds.const) {
        const L = this._scope.toName(v);
        if (this.opts.es5) {
          const Z = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${Z}.length`, (H) => {
            this.var(L, (0, e._)`${Z}[${H}]`), O(L);
          });
        }
        return this._for(new _("of", F, L, E), () => O(L));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(v, E, O, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(v, (0, e._)`Object.keys(${E})`, O);
        const L = this._scope.toName(v);
        return this._for(new _("in", F, L, E), () => O(L));
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
      try(v, E, O) {
        if (!E && !O)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new k();
        if (this._blockNode(F), this.code(v), E) {
          const L = this.name("e");
          this._currNode = F.catch = new I(L), E(L);
        }
        return O && (this._currNode = F.finally = new D(), this.code(O)), this._endBlockNode(I, D);
      }
      // `throw` statement
      throw(v) {
        return this._leafNode(new y(v));
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
        const O = this._nodes.length - E;
        if (O < 0 || v !== void 0 && O !== v)
          throw new Error(`CodeGen: wrong number of nodes: ${O} vs ${v} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(v, E = e.nil, O, F) {
        return this._blockNode(new b(v, E, O)), F && this.code(F).endFunc(), this;
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
        const O = this._currNode;
        if (O instanceof v || E && O instanceof E)
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
    o.CodeGen = z;
    function G(R, v) {
      for (const E in v)
        R[E] = (R[E] || 0) + (v[E] || 0);
      return R;
    }
    function B(R, v) {
      return v instanceof e._CodeOrName ? G(R, v.names) : R;
    }
    function K(R, v, E) {
      if (R instanceof e.Name)
        return O(R);
      if (!F(R))
        return R;
      return new e._Code(R._items.reduce((L, Z) => (Z instanceof e.Name && (Z = O(Z)), Z instanceof e._Code ? L.push(...Z._items) : L.push(Z), L), []));
      function O(L) {
        const Z = E[L.str];
        return Z === void 0 || v[L.str] !== 1 ? L : (delete v[L.str], Z);
      }
      function F(L) {
        return L instanceof e._Code && L._items.some((Z) => Z instanceof e.Name && v[Z.str] === 1 && E[Z.str] !== void 0);
      }
    }
    function ne(R, v) {
      for (const E in v)
        R[E] = (R[E] || 0) - (v[E] || 0);
    }
    function ye(R) {
      return typeof R == "boolean" || typeof R == "number" || R === null ? !R : (0, e._)`!${q(R)}`;
    }
    o.not = ye;
    const ve = A(o.operators.AND);
    function re(...R) {
      return R.reduce(ve);
    }
    o.and = re;
    const be = A(o.operators.OR);
    function T(...R) {
      return R.reduce(be);
    }
    o.or = T;
    function A(R) {
      return (v, E) => v === e.nil ? E : E === e.nil ? v : (0, e._)`${q(v)} ${R} ${q(E)}`;
    }
    function q(R) {
      return R instanceof e.Name ? R : (0, e._)`(${R})`;
    }
  })(Kt)), Kt;
}
var W = {}, Pr;
function te() {
  if (Pr) return W;
  Pr = 1, Object.defineProperty(W, "__esModule", { value: !0 }), W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
  const o = Y(), e = qt();
  function t(_) {
    const b = {};
    for (const P of _)
      b[P] = !0;
    return b;
  }
  W.toHash = t;
  function r(_, b) {
    return typeof b == "boolean" ? b : Object.keys(b).length === 0 ? !0 : (n(_, b), !i(b, _.self.RULES.all));
  }
  W.alwaysValidSchema = r;
  function n(_, b = _.schema) {
    const { opts: P, self: k } = _;
    if (!P.strictSchema || typeof b == "boolean")
      return;
    const I = k.RULES.keywords;
    for (const D in b)
      I[D] || g(_, `unknown keyword: "${D}"`);
  }
  W.checkUnknownRules = n;
  function i(_, b) {
    if (typeof _ == "boolean")
      return !_;
    for (const P in _)
      if (b[P])
        return !0;
    return !1;
  }
  W.schemaHasRules = i;
  function s(_, b) {
    if (typeof _ == "boolean")
      return !_;
    for (const P in _)
      if (P !== "$ref" && b.all[P])
        return !0;
    return !1;
  }
  W.schemaHasRulesButRef = s;
  function a({ topSchemaRef: _, schemaPath: b }, P, k, I) {
    if (!I) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, o._)`${P}`;
    }
    return (0, o._)`${_}${b}${(0, o.getProperty)(k)}`;
  }
  W.schemaRefOrVal = a;
  function c(_) {
    return y(decodeURIComponent(_));
  }
  W.unescapeFragment = c;
  function u(_) {
    return encodeURIComponent(d(_));
  }
  W.escapeFragment = u;
  function d(_) {
    return typeof _ == "number" ? `${_}` : _.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  W.escapeJsonPointer = d;
  function y(_) {
    return _.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  W.unescapeJsonPointer = y;
  function $(_, b) {
    if (Array.isArray(_))
      for (const P of _)
        b(P);
    else
      b(_);
  }
  W.eachItem = $;
  function w({ mergeNames: _, mergeToName: b, mergeValues: P, resultToName: k }) {
    return (I, D, z, G) => {
      const B = z === void 0 ? D : z instanceof o.Name ? (D instanceof o.Name ? _(I, D, z) : b(I, D, z), z) : D instanceof o.Name ? (b(I, z, D), D) : P(D, z);
      return G === o.Name && !(B instanceof o.Name) ? k(I, B) : B;
    };
  }
  W.mergeEvaluated = {
    props: w({
      mergeNames: (_, b, P) => _.if((0, o._)`${P} !== true && ${b} !== undefined`, () => {
        _.if((0, o._)`${b} === true`, () => _.assign(P, !0), () => _.assign(P, (0, o._)`${P} || {}`).code((0, o._)`Object.assign(${P}, ${b})`));
      }),
      mergeToName: (_, b, P) => _.if((0, o._)`${P} !== true`, () => {
        b === !0 ? _.assign(P, !0) : (_.assign(P, (0, o._)`${P} || {}`), m(_, P, b));
      }),
      mergeValues: (_, b) => _ === !0 ? !0 : { ..._, ...b },
      resultToName: S
    }),
    items: w({
      mergeNames: (_, b, P) => _.if((0, o._)`${P} !== true && ${b} !== undefined`, () => _.assign(P, (0, o._)`${b} === true ? true : ${P} > ${b} ? ${P} : ${b}`)),
      mergeToName: (_, b, P) => _.if((0, o._)`${P} !== true`, () => _.assign(P, b === !0 ? !0 : (0, o._)`${P} > ${b} ? ${P} : ${b}`)),
      mergeValues: (_, b) => _ === !0 ? !0 : Math.max(_, b),
      resultToName: (_, b) => _.var("items", b)
    })
  };
  function S(_, b) {
    if (b === !0)
      return _.var("props", !0);
    const P = _.var("props", (0, o._)`{}`);
    return b !== void 0 && m(_, P, b), P;
  }
  W.evaluatedPropsToName = S;
  function m(_, b, P) {
    Object.keys(P).forEach((k) => _.assign((0, o._)`${b}${(0, o.getProperty)(k)}`, !0));
  }
  W.setEvaluated = m;
  const h = {};
  function p(_, b) {
    return _.scopeValue("func", {
      ref: b,
      code: h[b.code] || (h[b.code] = new e._Code(b.code))
    });
  }
  W.useFunc = p;
  var l;
  (function(_) {
    _[_.Num = 0] = "Num", _[_.Str = 1] = "Str";
  })(l || (W.Type = l = {}));
  function f(_, b, P) {
    if (_ instanceof o.Name) {
      const k = b === l.Num;
      return P ? k ? (0, o._)`"[" + ${_} + "]"` : (0, o._)`"['" + ${_} + "']"` : k ? (0, o._)`"/" + ${_}` : (0, o._)`"/" + ${_}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, o.getProperty)(_).toString() : "/" + d(_);
  }
  W.getErrorPath = f;
  function g(_, b, P = _.opts.strictSchema) {
    if (P) {
      if (b = `strict mode: ${b}`, P === !0)
        throw new Error(b);
      _.self.logger.warn(b);
    }
  }
  return W.checkStrictMode = g, W;
}
var Qe = {}, Er;
function Re() {
  if (Er) return Qe;
  Er = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const o = Y(), e = {
    // validation function arguments
    data: new o.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new o.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new o.Name("instancePath"),
    parentData: new o.Name("parentData"),
    parentDataProperty: new o.Name("parentDataProperty"),
    rootData: new o.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new o.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new o.Name("vErrors"),
    // null or array of validation errors
    errors: new o.Name("errors"),
    // counter of validation errors
    this: new o.Name("this"),
    // "globals"
    self: new o.Name("self"),
    scope: new o.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new o.Name("json"),
    jsonPos: new o.Name("jsonPos"),
    jsonLen: new o.Name("jsonLen"),
    jsonPart: new o.Name("jsonPart")
  };
  return Qe.default = e, Qe;
}
var Mr;
function zt() {
  return Mr || (Mr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.extendErrors = o.resetErrorsCount = o.reportExtraError = o.reportError = o.keyword$DataError = o.keywordError = void 0;
    const e = Y(), t = te(), r = Re();
    o.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, o.keyword$DataError = {
      message: ({ keyword: h, schemaType: p }) => p ? (0, e.str)`"${h}" keyword must be ${p} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, p = o.keywordError, l, f) {
      const { it: g } = h, { gen: _, compositeRule: b, allErrors: P } = g, k = y(h, p, l);
      f ?? (b || P) ? c(_, k) : u(g, (0, e._)`[${k}]`);
    }
    o.reportError = n;
    function i(h, p = o.keywordError, l) {
      const { it: f } = h, { gen: g, compositeRule: _, allErrors: b } = f, P = y(h, p, l);
      c(g, P), _ || b || u(f, r.default.vErrors);
    }
    o.reportExtraError = i;
    function s(h, p) {
      h.assign(r.default.errors, p), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(p, () => h.assign((0, e._)`${r.default.vErrors}.length`, p), () => h.assign(r.default.vErrors, null)));
    }
    o.resetErrorsCount = s;
    function a({ gen: h, keyword: p, schemaValue: l, data: f, errsCount: g, it: _ }) {
      if (g === void 0)
        throw new Error("ajv implementation error");
      const b = h.name("err");
      h.forRange("i", g, r.default.errors, (P) => {
        h.const(b, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${b}.instancePath === undefined`, () => h.assign((0, e._)`${b}.instancePath`, (0, e.strConcat)(r.default.instancePath, _.errorPath))), h.assign((0, e._)`${b}.schemaPath`, (0, e.str)`${_.errSchemaPath}/${p}`), _.opts.verbose && (h.assign((0, e._)`${b}.schema`, l), h.assign((0, e._)`${b}.data`, f));
      });
    }
    o.extendErrors = a;
    function c(h, p) {
      const l = h.const("err", p);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${l}]`), (0, e._)`${r.default.vErrors}.push(${l})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function u(h, p) {
      const { gen: l, validateName: f, schemaEnv: g } = h;
      g.$async ? l.throw((0, e._)`new ${h.ValidationError}(${p})`) : (l.assign((0, e._)`${f}.errors`, p), l.return(!1));
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
    function y(h, p, l) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : $(h, p, l);
    }
    function $(h, p, l = {}) {
      const { gen: f, it: g } = h, _ = [
        w(g, l),
        S(h, l)
      ];
      return m(h, p, _), f.object(..._);
    }
    function w({ errorPath: h }, { instancePath: p }) {
      const l = p ? (0, e.str)`${h}${(0, t.getErrorPath)(p, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, l)];
    }
    function S({ keyword: h, it: { errSchemaPath: p } }, { schemaPath: l, parentSchema: f }) {
      let g = f ? p : (0, e.str)`${p}/${h}`;
      return l && (g = (0, e.str)`${g}${(0, t.getErrorPath)(l, t.Type.Str)}`), [d.schemaPath, g];
    }
    function m(h, { params: p, message: l }, f) {
      const { keyword: g, data: _, schemaValue: b, it: P } = h, { opts: k, propertyName: I, topSchemaRef: D, schemaPath: z } = P;
      f.push([d.keyword, g], [d.params, typeof p == "function" ? p(h) : p || (0, e._)`{}`]), k.messages && f.push([d.message, typeof l == "function" ? l(h) : l]), k.verbose && f.push([d.schema, b], [d.parentSchema, (0, e._)`${D}${z}`], [r.default.data, _]), I && f.push([d.propertyName, I]);
    }
  })(Ut)), Ut;
}
var Tr;
function yi() {
  if (Tr) return Ce;
  Tr = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.boolOrEmptySchema = Ce.topBoolOrEmptySchema = void 0;
  const o = zt(), e = Y(), t = Re(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: c, schema: u, validateName: d } = a;
    u === !1 ? s(a, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${d}.errors`, null), c.return(!0));
  }
  Ce.topBoolOrEmptySchema = n;
  function i(a, c) {
    const { gen: u, schema: d } = a;
    d === !1 ? (u.var(c, !1), s(a)) : u.var(c, !0);
  }
  Ce.boolOrEmptySchema = i;
  function s(a, c) {
    const { gen: u, data: d } = a, y = {
      gen: u,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, o.reportError)(y, r, void 0, c);
  }
  return Ce;
}
var pe = {}, je = {}, kr;
function xn() {
  if (kr) return je;
  kr = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.getRules = je.isJSONType = void 0;
  const o = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(o);
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
var ke = {}, Ar;
function Dn() {
  if (Ar) return ke;
  Ar = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.shouldUseRule = ke.shouldUseGroup = ke.schemaHasRulesForType = void 0;
  function o({ schema: r, self: n }, i) {
    const s = n.RULES.types[i];
    return s && s !== !0 && e(r, s);
  }
  ke.schemaHasRulesForType = o;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  ke.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((s) => r[s] !== void 0));
  }
  return ke.shouldUseRule = t, ke;
}
var Nr;
function xt() {
  if (Nr) return pe;
  Nr = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.reportTypeError = pe.checkDataTypes = pe.checkDataType = pe.coerceAndCheckDataType = pe.getJSONTypes = pe.getSchemaTypes = pe.DataType = void 0;
  const o = xn(), e = Dn(), t = zt(), r = Y(), n = te();
  var i;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(i || (pe.DataType = i = {}));
  function s(l) {
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
  pe.getSchemaTypes = s;
  function a(l) {
    const f = Array.isArray(l) ? l : l ? [l] : [];
    if (f.every(o.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  pe.getJSONTypes = a;
  function c(l, f) {
    const { gen: g, data: _, opts: b } = l, P = d(f, b.coerceTypes), k = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(l, f[0]));
    if (k) {
      const I = S(f, _, b.strictNumbers, i.Wrong);
      g.if(I, () => {
        P.length ? y(l, f, P) : h(l);
      });
    }
    return k;
  }
  pe.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(l, f) {
    return f ? l.filter((g) => u.has(g) || f === "array" && g === "array") : [];
  }
  function y(l, f, g) {
    const { gen: _, data: b, opts: P } = l, k = _.let("dataType", (0, r._)`typeof ${b}`), I = _.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && _.if((0, r._)`${k} == 'object' && Array.isArray(${b}) && ${b}.length == 1`, () => _.assign(b, (0, r._)`${b}[0]`).assign(k, (0, r._)`typeof ${b}`).if(S(f, b, P.strictNumbers), () => _.assign(I, b))), _.if((0, r._)`${I} !== undefined`);
    for (const z of g)
      (u.has(z) || z === "array" && P.coerceTypes === "array") && D(z);
    _.else(), h(l), _.endIf(), _.if((0, r._)`${I} !== undefined`, () => {
      _.assign(b, I), $(l, I);
    });
    function D(z) {
      switch (z) {
        case "string":
          _.elseIf((0, r._)`${k} == "number" || ${k} == "boolean"`).assign(I, (0, r._)`"" + ${b}`).elseIf((0, r._)`${b} === null`).assign(I, (0, r._)`""`);
          return;
        case "number":
          _.elseIf((0, r._)`${k} == "boolean" || ${b} === null
              || (${k} == "string" && ${b} && ${b} == +${b})`).assign(I, (0, r._)`+${b}`);
          return;
        case "integer":
          _.elseIf((0, r._)`${k} === "boolean" || ${b} === null
              || (${k} === "string" && ${b} && ${b} == +${b} && !(${b} % 1))`).assign(I, (0, r._)`+${b}`);
          return;
        case "boolean":
          _.elseIf((0, r._)`${b} === "false" || ${b} === 0 || ${b} === null`).assign(I, !1).elseIf((0, r._)`${b} === "true" || ${b} === 1`).assign(I, !0);
          return;
        case "null":
          _.elseIf((0, r._)`${b} === "" || ${b} === 0 || ${b} === false`), _.assign(I, null);
          return;
        case "array":
          _.elseIf((0, r._)`${k} === "string" || ${k} === "number"
              || ${k} === "boolean" || ${b} === null`).assign(I, (0, r._)`[${b}]`);
      }
    }
  }
  function $({ gen: l, parentData: f, parentDataProperty: g }, _) {
    l.if((0, r._)`${f} !== undefined`, () => l.assign((0, r._)`${f}[${g}]`, _));
  }
  function w(l, f, g, _ = i.Correct) {
    const b = _ === i.Correct ? r.operators.EQ : r.operators.NEQ;
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
        P = k((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        P = k();
        break;
      default:
        return (0, r._)`typeof ${f} ${b} ${l}`;
    }
    return _ === i.Correct ? P : (0, r.not)(P);
    function k(I = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, I, g ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  pe.checkDataType = w;
  function S(l, f, g, _) {
    if (l.length === 1)
      return w(l[0], f, g, _);
    let b;
    const P = (0, n.toHash)(l);
    if (P.array && P.object) {
      const k = (0, r._)`typeof ${f} != "object"`;
      b = P.null ? k : (0, r._)`!${f} || ${k}`, delete P.null, delete P.array, delete P.object;
    } else
      b = r.nil;
    P.number && delete P.integer;
    for (const k in P)
      b = (0, r.and)(b, w(k, f, g, _));
    return b;
  }
  pe.checkDataTypes = S;
  const m = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: f }) => typeof l == "string" ? (0, r._)`{type: ${l}}` : (0, r._)`{type: ${f}}`
  };
  function h(l) {
    const f = p(l);
    (0, t.reportError)(f, m);
  }
  pe.reportTypeError = h;
  function p(l) {
    const { gen: f, data: g, schema: _ } = l, b = (0, n.schemaRefOrVal)(l, _, "type");
    return {
      gen: f,
      keyword: "type",
      data: g,
      schema: _.type,
      schemaCode: b,
      schemaValue: b,
      parentSchema: _,
      params: {},
      it: l
    };
  }
  return pe;
}
var Le = {}, Rr;
function vi() {
  if (Rr) return Le;
  Rr = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.assignDefaults = void 0;
  const o = Y(), e = te();
  function t(n, i) {
    const { properties: s, items: a } = n.schema;
    if (i === "object" && s)
      for (const c in s)
        r(n, c, s[c].default);
    else i === "array" && Array.isArray(a) && a.forEach((c, u) => r(n, u, c.default));
  }
  Le.assignDefaults = t;
  function r(n, i, s) {
    const { gen: a, compositeRule: c, data: u, opts: d } = n;
    if (s === void 0)
      return;
    const y = (0, o._)`${u}${(0, o.getProperty)(i)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${y}`);
      return;
    }
    let $ = (0, o._)`${y} === undefined`;
    d.useDefaults === "empty" && ($ = (0, o._)`${$} || ${y} === null || ${y} === ""`), a.if($, (0, o._)`${y} = ${(0, o.stringify)(s)}`);
  }
  return Le;
}
var $e = {}, se = {}, Cr;
function Se() {
  if (Cr) return se;
  Cr = 1, Object.defineProperty(se, "__esModule", { value: !0 }), se.validateUnion = se.validateArray = se.usePattern = se.callValidateCode = se.schemaProperties = se.allSchemaProperties = se.noPropertyInData = se.propertyInData = se.isOwnProperty = se.hasPropFunc = se.reportMissingProp = se.checkMissingProp = se.checkReportMissingProp = void 0;
  const o = Y(), e = te(), t = Re(), r = te();
  function n(l, f) {
    const { gen: g, data: _, it: b } = l;
    g.if(d(g, _, f, b.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, o._)`${f}` }, !0), l.error();
    });
  }
  se.checkReportMissingProp = n;
  function i({ gen: l, data: f, it: { opts: g } }, _, b) {
    return (0, o.or)(..._.map((P) => (0, o.and)(d(l, f, P, g.ownProperties), (0, o._)`${b} = ${P}`)));
  }
  se.checkMissingProp = i;
  function s(l, f) {
    l.setParams({ missingProperty: f }, !0), l.error();
  }
  se.reportMissingProp = s;
  function a(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, o._)`Object.prototype.hasOwnProperty`
    });
  }
  se.hasPropFunc = a;
  function c(l, f, g) {
    return (0, o._)`${a(l)}.call(${f}, ${g})`;
  }
  se.isOwnProperty = c;
  function u(l, f, g, _) {
    const b = (0, o._)`${f}${(0, o.getProperty)(g)} !== undefined`;
    return _ ? (0, o._)`${b} && ${c(l, f, g)}` : b;
  }
  se.propertyInData = u;
  function d(l, f, g, _) {
    const b = (0, o._)`${f}${(0, o.getProperty)(g)} === undefined`;
    return _ ? (0, o.or)(b, (0, o.not)(c(l, f, g))) : b;
  }
  se.noPropertyInData = d;
  function y(l) {
    return l ? Object.keys(l).filter((f) => f !== "__proto__") : [];
  }
  se.allSchemaProperties = y;
  function $(l, f) {
    return y(f).filter((g) => !(0, e.alwaysValidSchema)(l, f[g]));
  }
  se.schemaProperties = $;
  function w({ schemaCode: l, data: f, it: { gen: g, topSchemaRef: _, schemaPath: b, errorPath: P }, it: k }, I, D, z) {
    const G = z ? (0, o._)`${l}, ${f}, ${_}${b}` : f, B = [
      [t.default.instancePath, (0, o.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, k.parentData],
      [t.default.parentDataProperty, k.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    k.opts.dynamicRef && B.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const K = (0, o._)`${G}, ${g.object(...B)}`;
    return D !== o.nil ? (0, o._)`${I}.call(${D}, ${K})` : (0, o._)`${I}(${K})`;
  }
  se.callValidateCode = w;
  const S = (0, o._)`new RegExp`;
  function m({ gen: l, it: { opts: f } }, g) {
    const _ = f.unicodeRegExp ? "u" : "", { regExp: b } = f.code, P = b(g, _);
    return l.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, o._)`${b.code === "new RegExp" ? S : (0, r.useFunc)(l, b)}(${g}, ${_})`
    });
  }
  se.usePattern = m;
  function h(l) {
    const { gen: f, data: g, keyword: _, it: b } = l, P = f.name("valid");
    if (b.allErrors) {
      const I = f.let("valid", !0);
      return k(() => f.assign(I, !1)), I;
    }
    return f.var(P, !0), k(() => f.break()), P;
    function k(I) {
      const D = f.const("len", (0, o._)`${g}.length`);
      f.forRange("i", 0, D, (z) => {
        l.subschema({
          keyword: _,
          dataProp: z,
          dataPropType: e.Type.Num
        }, P), f.if((0, o.not)(P), I);
      });
    }
  }
  se.validateArray = h;
  function p(l) {
    const { gen: f, schema: g, keyword: _, it: b } = l;
    if (!Array.isArray(g))
      throw new Error("ajv implementation error");
    if (g.some((D) => (0, e.alwaysValidSchema)(b, D)) && !b.opts.unevaluated)
      return;
    const k = f.let("valid", !1), I = f.name("_valid");
    f.block(() => g.forEach((D, z) => {
      const G = l.subschema({
        keyword: _,
        schemaProp: z,
        compositeRule: !0
      }, I);
      f.assign(k, (0, o._)`${k} || ${I}`), l.mergeValidEvaluated(G, I) || f.if((0, o.not)(k));
    })), l.result(k, () => l.reset(), () => l.error(!0));
  }
  return se.validateUnion = p, se;
}
var jr;
function bi() {
  if (jr) return $e;
  jr = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.validateKeywordUsage = $e.validSchemaType = $e.funcKeywordCode = $e.macroKeywordCode = void 0;
  const o = Y(), e = Re(), t = Se(), r = zt();
  function n($, w) {
    const { gen: S, keyword: m, schema: h, parentSchema: p, it: l } = $, f = w.macro.call(l.self, h, p, l), g = u(S, m, f);
    l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
    const _ = S.name("valid");
    $.subschema({
      schema: f,
      schemaPath: o.nil,
      errSchemaPath: `${l.errSchemaPath}/${m}`,
      topSchemaRef: g,
      compositeRule: !0
    }, _), $.pass(_, () => $.error(!0));
  }
  $e.macroKeywordCode = n;
  function i($, w) {
    var S;
    const { gen: m, keyword: h, schema: p, parentSchema: l, $data: f, it: g } = $;
    c(g, w);
    const _ = !f && w.compile ? w.compile.call(g.self, p, l, g) : w.validate, b = u(m, h, _), P = m.let("valid");
    $.block$data(P, k), $.ok((S = w.valid) !== null && S !== void 0 ? S : P);
    function k() {
      if (w.errors === !1)
        z(), w.modifying && s($), G(() => $.error());
      else {
        const B = w.async ? I() : D();
        w.modifying && s($), G(() => a($, B));
      }
    }
    function I() {
      const B = m.let("ruleErrs", null);
      return m.try(() => z((0, o._)`await `), (K) => m.assign(P, !1).if((0, o._)`${K} instanceof ${g.ValidationError}`, () => m.assign(B, (0, o._)`${K}.errors`), () => m.throw(K))), B;
    }
    function D() {
      const B = (0, o._)`${b}.errors`;
      return m.assign(B, null), z(o.nil), B;
    }
    function z(B = w.async ? (0, o._)`await ` : o.nil) {
      const K = g.opts.passContext ? e.default.this : e.default.self, ne = !("compile" in w && !f || w.schema === !1);
      m.assign(P, (0, o._)`${B}${(0, t.callValidateCode)($, b, K, ne)}`, w.modifying);
    }
    function G(B) {
      var K;
      m.if((0, o.not)((K = w.valid) !== null && K !== void 0 ? K : P), B);
    }
  }
  $e.funcKeywordCode = i;
  function s($) {
    const { gen: w, data: S, it: m } = $;
    w.if(m.parentData, () => w.assign(S, (0, o._)`${m.parentData}[${m.parentDataProperty}]`));
  }
  function a($, w) {
    const { gen: S } = $;
    S.if((0, o._)`Array.isArray(${w})`, () => {
      S.assign(e.default.vErrors, (0, o._)`${e.default.vErrors} === null ? ${w} : ${e.default.vErrors}.concat(${w})`).assign(e.default.errors, (0, o._)`${e.default.vErrors}.length`), (0, r.extendErrors)($);
    }, () => $.error());
  }
  function c({ schemaEnv: $ }, w) {
    if (w.async && !$.$async)
      throw new Error("async keyword in sync schema");
  }
  function u($, w, S) {
    if (S === void 0)
      throw new Error(`keyword "${w}" failed to compile`);
    return $.scopeValue("keyword", typeof S == "function" ? { ref: S } : { ref: S, code: (0, o.stringify)(S) });
  }
  function d($, w, S = !1) {
    return !w.length || w.some((m) => m === "array" ? Array.isArray($) : m === "object" ? $ && typeof $ == "object" && !Array.isArray($) : typeof $ == m || S && typeof $ > "u");
  }
  $e.validSchemaType = d;
  function y({ schema: $, opts: w, self: S, errSchemaPath: m }, h, p) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(p) : h.keyword !== p)
      throw new Error("ajv implementation error");
    const l = h.dependencies;
    if (l?.some((f) => !Object.prototype.hasOwnProperty.call($, f)))
      throw new Error(`parent schema must have dependencies of ${p}: ${l.join(",")}`);
    if (h.validateSchema && !h.validateSchema($[p])) {
      const g = `keyword "${p}" value is invalid at path "${m}": ` + S.errorsText(h.validateSchema.errors);
      if (w.validateSchema === "log")
        S.logger.error(g);
      else
        throw new Error(g);
    }
  }
  return $e.validateKeywordUsage = y, $e;
}
var Ae = {}, Or;
function wi() {
  if (Or) return Ae;
  Or = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.extendSubschemaMode = Ae.extendSubschemaData = Ae.getSubschema = void 0;
  const o = Y(), e = te();
  function t(i, { keyword: s, schemaProp: a, schema: c, schemaPath: u, errSchemaPath: d, topSchemaRef: y }) {
    if (s !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (s !== void 0) {
      const $ = i.schema[s];
      return a === void 0 ? {
        schema: $,
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}`
      } : {
        schema: $[a],
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}${(0, o.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (u === void 0 || d === void 0 || y === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: y,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ae.getSubschema = t;
  function r(i, s, { dataProp: a, dataPropType: c, data: u, dataTypes: d, propertyName: y }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: $ } = s;
    if (a !== void 0) {
      const { errorPath: S, dataPathArr: m, opts: h } = s, p = $.let("data", (0, o._)`${s.data}${(0, o.getProperty)(a)}`, !0);
      w(p), i.errorPath = (0, o.str)`${S}${(0, e.getErrorPath)(a, c, h.jsPropertySyntax)}`, i.parentDataProperty = (0, o._)`${a}`, i.dataPathArr = [...m, i.parentDataProperty];
    }
    if (u !== void 0) {
      const S = u instanceof o.Name ? u : $.let("data", u, !0);
      w(S), y !== void 0 && (i.propertyName = y);
    }
    d && (i.dataTypes = d);
    function w(S) {
      i.data = S, i.dataLevel = s.dataLevel + 1, i.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), i.parentData = s.data, i.dataNames = [...s.dataNames, S];
    }
  }
  Ae.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: s, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), u !== void 0 && (i.createErrors = u), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = s, i.jtdMetadata = a;
  }
  return Ae.extendSubschemaMode = n, Ae;
}
var ge = {}, Wt, Ir;
function zn() {
  return Ir || (Ir = 1, Wt = function o(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var r, n, i;
      if (Array.isArray(e)) {
        if (r = e.length, r != t.length) return !1;
        for (n = r; n-- !== 0; )
          if (!o(e[n], t[n])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (i = Object.keys(e), r = i.length, r !== Object.keys(t).length) return !1;
      for (n = r; n-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, i[n])) return !1;
      for (n = r; n-- !== 0; ) {
        var s = i[n];
        if (!o(e[s], t[s])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), Wt;
}
var Yt = { exports: {} }, qr;
function _i() {
  if (qr) return Yt.exports;
  qr = 1;
  var o = Yt.exports = function(r, n, i) {
    typeof n == "function" && (i = n, n = {}), i = n.cb || i;
    var s = typeof i == "function" ? i : i.pre || function() {
    }, a = i.post || function() {
    };
    e(n, s, a, r, "", r);
  };
  o.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, o.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, o.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, o.skipKeywords = {
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
  function e(r, n, i, s, a, c, u, d, y, $) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      n(s, a, c, u, d, y, $);
      for (var w in s) {
        var S = s[w];
        if (Array.isArray(S)) {
          if (w in o.arrayKeywords)
            for (var m = 0; m < S.length; m++)
              e(r, n, i, S[m], a + "/" + w + "/" + m, c, a, w, s, m);
        } else if (w in o.propsKeywords) {
          if (S && typeof S == "object")
            for (var h in S)
              e(r, n, i, S[h], a + "/" + w + "/" + t(h), c, a, w, s, h);
        } else (w in o.keywords || r.allKeys && !(w in o.skipKeywords)) && e(r, n, i, S, a + "/" + w, c, a, w, s);
      }
      i(s, a, c, u, d, y, $);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Yt.exports;
}
var xr;
function Vt() {
  if (xr) return ge;
  xr = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.getSchemaRefs = ge.resolveUrl = ge.normalizeId = ge._getFullPath = ge.getFullPath = ge.inlineRef = void 0;
  const o = te(), e = zn(), t = _i(), r = /* @__PURE__ */ new Set([
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
    return typeof m == "boolean" ? !0 : h === !0 ? !s(m) : h ? a(m) <= h : !1;
  }
  ge.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function s(m) {
    for (const h in m) {
      if (i.has(h))
        return !0;
      const p = m[h];
      if (Array.isArray(p) && p.some(s) || typeof p == "object" && s(p))
        return !0;
    }
    return !1;
  }
  function a(m) {
    let h = 0;
    for (const p in m) {
      if (p === "$ref")
        return 1 / 0;
      if (h++, !r.has(p) && (typeof m[p] == "object" && (0, o.eachItem)(m[p], (l) => h += a(l)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function c(m, h = "", p) {
    p !== !1 && (h = y(h));
    const l = m.parse(h);
    return u(m, l);
  }
  ge.getFullPath = c;
  function u(m, h) {
    return m.serialize(h).split("#")[0] + "#";
  }
  ge._getFullPath = u;
  const d = /#\/?$/;
  function y(m) {
    return m ? m.replace(d, "") : "";
  }
  ge.normalizeId = y;
  function $(m, h, p) {
    return p = y(p), m.resolve(h, p);
  }
  ge.resolveUrl = $;
  const w = /^[a-z_][-a-z0-9._]*$/i;
  function S(m, h) {
    if (typeof m == "boolean")
      return {};
    const { schemaId: p, uriResolver: l } = this.opts, f = y(m[p] || h), g = { "": f }, _ = c(l, f, !1), b = {}, P = /* @__PURE__ */ new Set();
    return t(m, { allKeys: !0 }, (D, z, G, B) => {
      if (B === void 0)
        return;
      const K = _ + z;
      let ne = g[B];
      typeof D[p] == "string" && (ne = ye.call(this, D[p])), ve.call(this, D.$anchor), ve.call(this, D.$dynamicAnchor), g[z] = ne;
      function ye(re) {
        const be = this.opts.uriResolver.resolve;
        if (re = y(ne ? be(ne, re) : re), P.has(re))
          throw I(re);
        P.add(re);
        let T = this.refs[re];
        return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? k(D, T.schema, re) : re !== y(K) && (re[0] === "#" ? (k(D, b[re], re), b[re] = D) : this.refs[re] = K), re;
      }
      function ve(re) {
        if (typeof re == "string") {
          if (!w.test(re))
            throw new Error(`invalid anchor "${re}"`);
          ye.call(this, `#${re}`);
        }
      }
    }), b;
    function k(D, z, G) {
      if (z !== void 0 && !e(D, z))
        throw I(G);
    }
    function I(D) {
      return new Error(`reference "${D}" resolves to more than one schema`);
    }
  }
  return ge.getSchemaRefs = S, ge;
}
var Dr;
function Lt() {
  if (Dr) return Te;
  Dr = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.getData = Te.KeywordCxt = Te.validateFunctionCode = void 0;
  const o = yi(), e = xt(), t = Dn(), r = xt(), n = vi(), i = bi(), s = wi(), a = Y(), c = Re(), u = Vt(), d = te(), y = zt();
  function $(M) {
    if (_(M) && (P(M), g(M))) {
      h(M);
      return;
    }
    w(M, () => (0, o.topBoolOrEmptySchema)(M));
  }
  Te.validateFunctionCode = $;
  function w({ gen: M, validateName: C, schema: N, schemaEnv: j, opts: x }, V) {
    x.code.es5 ? M.func(C, (0, a._)`${c.default.data}, ${c.default.valCxt}`, j.$async, () => {
      M.code((0, a._)`"use strict"; ${l(N, x)}`), m(M, x), M.code(V);
    }) : M.func(C, (0, a._)`${c.default.data}, ${S(x)}`, j.$async, () => M.code(l(N, x)).code(V));
  }
  function S(M) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${M.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function m(M, C) {
    M.if(c.default.valCxt, () => {
      M.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), M.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), M.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), M.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), C.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      M.var(c.default.instancePath, (0, a._)`""`), M.var(c.default.parentData, (0, a._)`undefined`), M.var(c.default.parentDataProperty, (0, a._)`undefined`), M.var(c.default.rootData, c.default.data), C.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(M) {
    const { schema: C, opts: N, gen: j } = M;
    w(M, () => {
      N.$comment && C.$comment && B(M), D(M), j.let(c.default.vErrors, null), j.let(c.default.errors, 0), N.unevaluated && p(M), k(M), K(M);
    });
  }
  function p(M) {
    const { gen: C, validateName: N } = M;
    M.evaluated = C.const("evaluated", (0, a._)`${N}.evaluated`), C.if((0, a._)`${M.evaluated}.dynamicProps`, () => C.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), C.if((0, a._)`${M.evaluated}.dynamicItems`, () => C.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function l(M, C) {
    const N = typeof M == "object" && M[C.schemaId];
    return N && (C.code.source || C.code.process) ? (0, a._)`/*# sourceURL=${N} */` : a.nil;
  }
  function f(M, C) {
    if (_(M) && (P(M), g(M))) {
      b(M, C);
      return;
    }
    (0, o.boolOrEmptySchema)(M, C);
  }
  function g({ schema: M, self: C }) {
    if (typeof M == "boolean")
      return !M;
    for (const N in M)
      if (C.RULES.all[N])
        return !0;
    return !1;
  }
  function _(M) {
    return typeof M.schema != "boolean";
  }
  function b(M, C) {
    const { schema: N, gen: j, opts: x } = M;
    x.$comment && N.$comment && B(M), z(M), G(M);
    const V = j.const("_errs", c.default.errors);
    k(M, V), j.var(C, (0, a._)`${V} === ${c.default.errors}`);
  }
  function P(M) {
    (0, d.checkUnknownRules)(M), I(M);
  }
  function k(M, C) {
    if (M.opts.jtd)
      return ye(M, [], !1, C);
    const N = (0, e.getSchemaTypes)(M.schema), j = (0, e.coerceAndCheckDataType)(M, N);
    ye(M, N, !j, C);
  }
  function I(M) {
    const { schema: C, errSchemaPath: N, opts: j, self: x } = M;
    C.$ref && j.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(C, x.RULES) && x.logger.warn(`$ref: keywords ignored in schema at path "${N}"`);
  }
  function D(M) {
    const { schema: C, opts: N } = M;
    C.default !== void 0 && N.useDefaults && N.strictSchema && (0, d.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function z(M) {
    const C = M.schema[M.opts.schemaId];
    C && (M.baseId = (0, u.resolveUrl)(M.opts.uriResolver, M.baseId, C));
  }
  function G(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function B({ gen: M, schemaEnv: C, schema: N, errSchemaPath: j, opts: x }) {
    const V = N.$comment;
    if (x.$comment === !0)
      M.code((0, a._)`${c.default.self}.logger.log(${V})`);
    else if (typeof x.$comment == "function") {
      const Q = (0, a.str)`${j}/$comment`, ee = M.scopeValue("root", { ref: C.root });
      M.code((0, a._)`${c.default.self}.opts.$comment(${V}, ${Q}, ${ee}.schema)`);
    }
  }
  function K(M) {
    const { gen: C, schemaEnv: N, validateName: j, ValidationError: x, opts: V } = M;
    N.$async ? C.if((0, a._)`${c.default.errors} === 0`, () => C.return(c.default.data), () => C.throw((0, a._)`new ${x}(${c.default.vErrors})`)) : (C.assign((0, a._)`${j}.errors`, c.default.vErrors), V.unevaluated && ne(M), C.return((0, a._)`${c.default.errors} === 0`));
  }
  function ne({ gen: M, evaluated: C, props: N, items: j }) {
    N instanceof a.Name && M.assign((0, a._)`${C}.props`, N), j instanceof a.Name && M.assign((0, a._)`${C}.items`, j);
  }
  function ye(M, C, N, j) {
    const { gen: x, schema: V, data: Q, allErrors: ee, opts: oe, self: ie } = M, { RULES: ce } = ie;
    if (V.$ref && (oe.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(V, ce))) {
      x.block(() => F(M, "$ref", ce.all.$ref.definition));
      return;
    }
    oe.jtd || re(M, C), x.block(() => {
      for (const ue of ce.rules)
        me(ue);
      me(ce.post);
    });
    function me(ue) {
      (0, t.shouldUseGroup)(V, ue) && (ue.type ? (x.if((0, r.checkDataType)(ue.type, Q, oe.strictNumbers)), ve(M, ue), C.length === 1 && C[0] === ue.type && N && (x.else(), (0, r.reportTypeError)(M)), x.endIf()) : ve(M, ue), ee || x.if((0, a._)`${c.default.errors} === ${j || 0}`));
    }
  }
  function ve(M, C) {
    const { gen: N, schema: j, opts: { useDefaults: x } } = M;
    x && (0, n.assignDefaults)(M, C.type), N.block(() => {
      for (const V of C.rules)
        (0, t.shouldUseRule)(j, V) && F(M, V.keyword, V.definition, C.type);
    });
  }
  function re(M, C) {
    M.schemaEnv.meta || !M.opts.strictTypes || (be(M, C), M.opts.allowUnionTypes || T(M, C), A(M, M.dataTypes));
  }
  function be(M, C) {
    if (C.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = C;
        return;
      }
      C.forEach((N) => {
        R(M.dataTypes, N) || E(M, `type "${N}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), v(M, C);
    }
  }
  function T(M, C) {
    C.length > 1 && !(C.length === 2 && C.includes("null")) && E(M, "use allowUnionTypes to allow union type keyword");
  }
  function A(M, C) {
    const N = M.self.RULES.all;
    for (const j in N) {
      const x = N[j];
      if (typeof x == "object" && (0, t.shouldUseRule)(M.schema, x)) {
        const { type: V } = x.definition;
        V.length && !V.some((Q) => q(C, Q)) && E(M, `missing type "${V.join(",")}" for keyword "${j}"`);
      }
    }
  }
  function q(M, C) {
    return M.includes(C) || C === "number" && M.includes("integer");
  }
  function R(M, C) {
    return M.includes(C) || C === "integer" && M.includes("number");
  }
  function v(M, C) {
    const N = [];
    for (const j of M.dataTypes)
      R(C, j) ? N.push(j) : C.includes("integer") && j === "number" && N.push("integer");
    M.dataTypes = N;
  }
  function E(M, C) {
    const N = M.schemaEnv.baseId + M.errSchemaPath;
    C += ` at "${N}" (strictTypes)`, (0, d.checkStrictMode)(M, C, M.opts.strictTypes);
  }
  class O {
    constructor(C, N, j) {
      if ((0, i.validateKeywordUsage)(C, N, j), this.gen = C.gen, this.allErrors = C.allErrors, this.keyword = j, this.data = C.data, this.schema = C.schema[j], this.$data = N.$data && C.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(C, this.schema, j, this.$data), this.schemaType = N.schemaType, this.parentSchema = C.schema, this.params = {}, this.it = C, this.def = N, this.$data)
        this.schemaCode = C.gen.const("vSchema", H(this.$data, C));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, N.schemaType, N.allowUndefined))
        throw new Error(`${j} value must be ${JSON.stringify(N.schemaType)}`);
      ("code" in N ? N.trackErrors : N.errors !== !1) && (this.errsCount = C.gen.const("_errs", c.default.errors));
    }
    result(C, N, j) {
      this.failResult((0, a.not)(C), N, j);
    }
    failResult(C, N, j) {
      this.gen.if(C), j ? j() : this.error(), N ? (this.gen.else(), N(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(C, N) {
      this.failResult((0, a.not)(C), void 0, N);
    }
    fail(C) {
      if (C === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(C), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(C) {
      if (!this.$data)
        return this.fail(C);
      const { schemaCode: N } = this;
      this.fail((0, a._)`${N} !== undefined && (${(0, a.or)(this.invalid$data(), C)})`);
    }
    error(C, N, j) {
      if (N) {
        this.setParams(N), this._error(C, j), this.setParams({});
        return;
      }
      this._error(C, j);
    }
    _error(C, N) {
      (C ? y.reportExtraError : y.reportError)(this, this.def.error, N);
    }
    $dataError() {
      (0, y.reportError)(this, this.def.$dataError || y.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, y.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(C) {
      this.allErrors || this.gen.if(C);
    }
    setParams(C, N) {
      N ? Object.assign(this.params, C) : this.params = C;
    }
    block$data(C, N, j = a.nil) {
      this.gen.block(() => {
        this.check$data(C, j), N();
      });
    }
    check$data(C = a.nil, N = a.nil) {
      if (!this.$data)
        return;
      const { gen: j, schemaCode: x, schemaType: V, def: Q } = this;
      j.if((0, a.or)((0, a._)`${x} === undefined`, N)), C !== a.nil && j.assign(C, !0), (V.length || Q.validateSchema) && (j.elseIf(this.invalid$data()), this.$dataError(), C !== a.nil && j.assign(C, !1)), j.else();
    }
    invalid$data() {
      const { gen: C, schemaCode: N, schemaType: j, def: x, it: V } = this;
      return (0, a.or)(Q(), ee());
      function Q() {
        if (j.length) {
          if (!(N instanceof a.Name))
            throw new Error("ajv implementation error");
          const oe = Array.isArray(j) ? j : [j];
          return (0, a._)`${(0, r.checkDataTypes)(oe, N, V.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function ee() {
        if (x.validateSchema) {
          const oe = C.scopeValue("validate$data", { ref: x.validateSchema });
          return (0, a._)`!${oe}(${N})`;
        }
        return a.nil;
      }
    }
    subschema(C, N) {
      const j = (0, s.getSubschema)(this.it, C);
      (0, s.extendSubschemaData)(j, this.it, C), (0, s.extendSubschemaMode)(j, C);
      const x = { ...this.it, ...j, items: void 0, props: void 0 };
      return f(x, N), x;
    }
    mergeEvaluated(C, N) {
      const { it: j, gen: x } = this;
      j.opts.unevaluated && (j.props !== !0 && C.props !== void 0 && (j.props = d.mergeEvaluated.props(x, C.props, j.props, N)), j.items !== !0 && C.items !== void 0 && (j.items = d.mergeEvaluated.items(x, C.items, j.items, N)));
    }
    mergeValidEvaluated(C, N) {
      const { it: j, gen: x } = this;
      if (j.opts.unevaluated && (j.props !== !0 || j.items !== !0))
        return x.if(N, () => this.mergeEvaluated(C, a.Name)), !0;
    }
  }
  Te.KeywordCxt = O;
  function F(M, C, N, j) {
    const x = new O(M, N, C);
    "code" in N ? N.code(x, j) : x.$data && N.validate ? (0, i.funcKeywordCode)(x, N) : "macro" in N ? (0, i.macroKeywordCode)(x, N) : (N.compile || N.validate) && (0, i.funcKeywordCode)(x, N);
  }
  const L = /^\/(?:[^~]|~0|~1)*$/, Z = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(M, { dataLevel: C, dataNames: N, dataPathArr: j }) {
    let x, V;
    if (M === "")
      return c.default.rootData;
    if (M[0] === "/") {
      if (!L.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      x = M, V = c.default.rootData;
    } else {
      const ie = Z.exec(M);
      if (!ie)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const ce = +ie[1];
      if (x = ie[2], x === "#") {
        if (ce >= C)
          throw new Error(oe("property/index", ce));
        return j[C - ce];
      }
      if (ce > C)
        throw new Error(oe("data", ce));
      if (V = N[C - ce], !x)
        return V;
    }
    let Q = V;
    const ee = x.split("/");
    for (const ie of ee)
      ie && (V = (0, a._)`${V}${(0, a.getProperty)((0, d.unescapeJsonPointer)(ie))}`, Q = (0, a._)`${Q} && ${V}`);
    return Q;
    function oe(ie, ce) {
      return `Cannot access ${ie} ${ce} levels up, current level is ${C}`;
    }
  }
  return Te.getData = H, Te;
}
var Xe = {}, zr;
function or() {
  if (zr) return Xe;
  zr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  class o extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Xe.default = o, Xe;
}
var Ze = {}, Vr;
function Ft() {
  if (Vr) return Ze;
  Vr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const o = Vt();
  class e extends Error {
    constructor(r, n, i, s) {
      super(s || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, o.resolveUrl)(r, n, i), this.missingSchema = (0, o.normalizeId)((0, o.getFullPath)(r, this.missingRef));
    }
  }
  return Ze.default = e, Ze;
}
var we = {}, Lr;
function sr() {
  if (Lr) return we;
  Lr = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.resolveSchema = we.getCompilingSchema = we.resolveRef = we.compileSchema = we.SchemaEnv = void 0;
  const o = Y(), e = or(), t = Re(), r = Vt(), n = te(), i = Lt();
  class s {
    constructor(p) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof p.schema == "object" && (f = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (l = p.baseId) !== null && l !== void 0 ? l : (0, r.normalizeId)(f?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  we.SchemaEnv = s;
  function a(h) {
    const p = d.call(this, h);
    if (p)
      return p;
    const l = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: g } = this.opts.code, { ownProperties: _ } = this.opts, b = new o.CodeGen(this.scope, { es5: f, lines: g, ownProperties: _ });
    let P;
    h.$async && (P = b.scopeValue("Error", {
      ref: e.default,
      code: (0, o._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const k = b.scopeName("validate");
    h.validateName = k;
    const I = {
      gen: b,
      allErrors: this.opts.allErrors,
      data: t.default.data,
      parentData: t.default.parentData,
      parentDataProperty: t.default.parentDataProperty,
      dataNames: [t.default.data],
      dataPathArr: [o.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: b.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, o.stringify)(h.schema) } : { ref: h.schema }),
      validateName: k,
      ValidationError: P,
      schema: h.schema,
      schemaEnv: h,
      rootId: l,
      baseId: h.baseId || l,
      schemaPath: o.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, o._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(I), b.optimize(this.opts.code.optimize);
      const z = b.toString();
      D = `${b.scopeRefs(t.default.scope)}return ${z}`, this.opts.code.process && (D = this.opts.code.process(D, h));
      const B = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(k, { ref: B }), B.errors = null, B.schema = h.schema, B.schemaEnv = h, h.$async && (B.$async = !0), this.opts.code.source === !0 && (B.source = { validateName: k, validateCode: z, scopeValues: b._values }), this.opts.unevaluated) {
        const { props: K, items: ne } = I;
        B.evaluated = {
          props: K instanceof o.Name ? void 0 : K,
          items: ne instanceof o.Name ? void 0 : ne,
          dynamicProps: K instanceof o.Name,
          dynamicItems: ne instanceof o.Name
        }, B.source && (B.source.evaluated = (0, o.stringify)(B.evaluated));
      }
      return h.validate = B, h;
    } catch (z) {
      throw delete h.validate, delete h.validateName, D && this.logger.error("Error compiling schema, function code:", D), z;
    } finally {
      this._compilations.delete(h);
    }
  }
  we.compileSchema = a;
  function c(h, p, l) {
    var f;
    l = (0, r.resolveUrl)(this.opts.uriResolver, p, l);
    const g = h.refs[l];
    if (g)
      return g;
    let _ = $.call(this, h, l);
    if (_ === void 0) {
      const b = (f = h.localRefs) === null || f === void 0 ? void 0 : f[l], { schemaId: P } = this.opts;
      b && (_ = new s({ schema: b, schemaId: P, root: h, baseId: p }));
    }
    if (_ !== void 0)
      return h.refs[l] = u.call(this, _);
  }
  we.resolveRef = c;
  function u(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function d(h) {
    for (const p of this._compilations)
      if (y(p, h))
        return p;
  }
  we.getCompilingSchema = d;
  function y(h, p) {
    return h.schema === p.schema && h.root === p.root && h.baseId === p.baseId;
  }
  function $(h, p) {
    let l;
    for (; typeof (l = this.refs[p]) == "string"; )
      p = l;
    return l || this.schemas[p] || w.call(this, h, p);
  }
  function w(h, p) {
    const l = this.opts.uriResolver.parse(p), f = (0, r._getFullPath)(this.opts.uriResolver, l);
    let g = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === g)
      return m.call(this, l, h);
    const _ = (0, r.normalizeId)(f), b = this.refs[_] || this.schemas[_];
    if (typeof b == "string") {
      const P = w.call(this, h, b);
      return typeof P?.schema != "object" ? void 0 : m.call(this, l, P);
    }
    if (typeof b?.schema == "object") {
      if (b.validate || a.call(this, b), _ === (0, r.normalizeId)(p)) {
        const { schema: P } = b, { schemaId: k } = this.opts, I = P[k];
        return I && (g = (0, r.resolveUrl)(this.opts.uriResolver, g, I)), new s({ schema: P, schemaId: k, root: h, baseId: g });
      }
      return m.call(this, l, b);
    }
  }
  we.resolveSchema = w;
  const S = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function m(h, { baseId: p, schema: l, root: f }) {
    var g;
    if (((g = h.fragment) === null || g === void 0 ? void 0 : g[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const k = l[(0, n.unescapeFragment)(P)];
      if (k === void 0)
        return;
      l = k;
      const I = typeof l == "object" && l[this.opts.schemaId];
      !S.has(P) && I && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, I));
    }
    let _;
    if (typeof l != "boolean" && l.$ref && !(0, n.schemaHasRulesButRef)(l, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, p, l.$ref);
      _ = w.call(this, f, P);
    }
    const { schemaId: b } = this.opts;
    if (_ = _ || new s({ schema: l, schemaId: b, root: f, baseId: p }), _.schema !== _.root.schema)
      return _;
  }
  return we;
}
const $i = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Si = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Pi = "object", Ei = ["$data"], Mi = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Ti = !1, ki = {
  $id: $i,
  description: Si,
  type: Pi,
  required: Ei,
  properties: Mi,
  additionalProperties: Ti
};
var et = {}, Fe = { exports: {} }, Qt, Fr;
function Ai() {
  return Fr || (Fr = 1, Qt = {
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
  }), Qt;
}
var Xt, Gr;
function Ni() {
  if (Gr) return Xt;
  Gr = 1;
  const { HEX: o } = Ai(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(m) {
    if (a(m, ".") < 3)
      return { host: m, isIPV4: !1 };
    const h = m.match(e) || [], [p] = h;
    return p ? { host: s(p, "."), isIPV4: !0 } : { host: m, isIPV4: !1 };
  }
  function r(m, h = !1) {
    let p = "", l = !0;
    for (const f of m) {
      if (o[f] === void 0) return;
      f !== "0" && l === !0 && (l = !1), l || (p += f);
    }
    return h && p.length === 0 && (p = "0"), p;
  }
  function n(m) {
    let h = 0;
    const p = { error: !1, address: "", zone: "" }, l = [], f = [];
    let g = !1, _ = !1, b = !1;
    function P() {
      if (f.length) {
        if (g === !1) {
          const k = r(f);
          if (k !== void 0)
            l.push(k);
          else
            return p.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let k = 0; k < m.length; k++) {
      const I = m[k];
      if (!(I === "[" || I === "]"))
        if (I === ":") {
          if (_ === !0 && (b = !0), !P())
            break;
          if (h++, l.push(":"), h > 7) {
            p.error = !0;
            break;
          }
          k - 1 >= 0 && m[k - 1] === ":" && (_ = !0);
          continue;
        } else if (I === "%") {
          if (!P())
            break;
          g = !0;
        } else {
          f.push(I);
          continue;
        }
    }
    return f.length && (g ? p.zone = f.join("") : b ? l.push(f.join("")) : l.push(r(f))), p.address = l.join(""), p;
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
  function s(m, h) {
    let p = "", l = !0;
    const f = m.length;
    for (let g = 0; g < f; g++) {
      const _ = m[g];
      _ === "0" && l ? (g + 1 <= f && m[g + 1] === h || g + 1 === f) && (p += _, l = !1) : (_ === h ? l = !0 : l = !1, p += _);
    }
    return p;
  }
  function a(m, h) {
    let p = 0;
    for (let l = 0; l < m.length; l++)
      m[l] === h && p++;
    return p;
  }
  const c = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, y = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function $(m) {
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
        const p = m.match(y);
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
  return Xt = {
    recomposeAuthority: S,
    normalizeComponentEncoding: w,
    removeDotSegments: $,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Xt;
}
var Zt, Br;
function Ri() {
  if (Br) return Zt;
  Br = 1;
  const o = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
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
  function s(l) {
    if ((l.port === (t(l) ? 443 : 80) || l.port === "") && (l.port = void 0), typeof l.secure == "boolean" && (l.scheme = l.secure ? "wss" : "ws", l.secure = void 0), l.resourceName) {
      const [f, g] = l.resourceName.split("?");
      l.path = f && f !== "/" ? f : void 0, l.query = g, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function a(l, f) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const g = l.path.match(e);
    if (g) {
      const _ = f.scheme || l.scheme || "urn";
      l.nid = g[1].toLowerCase(), l.nss = g[2];
      const b = `${_}:${f.nid || l.nid}`, P = p[b];
      l.path = void 0, P && (l = P.parse(l, f));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function c(l, f) {
    const g = f.scheme || l.scheme || "urn", _ = l.nid.toLowerCase(), b = `${g}:${f.nid || _}`, P = p[b];
    P && (l = P.serialize(l, f));
    const k = l, I = l.nss;
    return k.path = `${_ || f.nid}:${I}`, f.skipEscape = !0, k;
  }
  function u(l, f) {
    const g = l;
    return g.uuid = g.nss, g.nss = void 0, !f.tolerant && (!g.uuid || !o.test(g.uuid)) && (g.error = g.error || "UUID is not valid."), g;
  }
  function d(l) {
    const f = l;
    return f.nss = (l.uuid || "").toLowerCase(), f;
  }
  const y = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, $ = {
    scheme: "https",
    domainHost: y.domainHost,
    parse: r,
    serialize: n
  }, w = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: s
  }, S = {
    scheme: "wss",
    domainHost: w.domainHost,
    parse: w.parse,
    serialize: w.serialize
  }, p = {
    http: y,
    https: $,
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
  return Zt = p, Zt;
}
var Ur;
function Ci() {
  if (Ur) return Fe.exports;
  Ur = 1;
  const { normalizeIPv6: o, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = Ni(), i = Ri();
  function s(h, p) {
    return typeof h == "string" ? h = d(S(h, p), p) : typeof h == "object" && (h = S(d(h, p), p)), h;
  }
  function a(h, p, l) {
    const f = Object.assign({ scheme: "null" }, l), g = c(S(h, f), S(p, f), f, !0);
    return d(g, { ...f, skipEscape: !0 });
  }
  function c(h, p, l, f) {
    const g = {};
    return f || (h = S(d(h, l), l), p = S(d(p, l), l)), l = l || {}, !l.tolerant && p.scheme ? (g.scheme = p.scheme, g.userinfo = p.userinfo, g.host = p.host, g.port = p.port, g.path = t(p.path || ""), g.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (g.userinfo = p.userinfo, g.host = p.host, g.port = p.port, g.path = t(p.path || ""), g.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? g.path = t(p.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? g.path = "/" + p.path : h.path ? g.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + p.path : g.path = p.path, g.path = t(g.path)), g.query = p.query) : (g.path = h.path, p.query !== void 0 ? g.query = p.query : g.query = h.query), g.userinfo = h.userinfo, g.host = h.host, g.port = h.port), g.scheme = h.scheme), g.fragment = p.fragment, g;
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
    }, f = Object.assign({}, p), g = [], _ = i[(f.scheme || l.scheme || "").toLowerCase()];
    _ && _.serialize && _.serialize(l, f), l.path !== void 0 && (f.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), f.reference !== "suffix" && l.scheme && g.push(l.scheme, ":");
    const b = r(l);
    if (b !== void 0 && (f.reference !== "suffix" && g.push("//"), g.push(b), l.path && l.path.charAt(0) !== "/" && g.push("/")), l.path !== void 0) {
      let P = l.path;
      !f.absolutePath && (!_ || !_.absolutePath) && (P = t(P)), b === void 0 && (P = P.replace(/^\/\//u, "/%2F")), g.push(P);
    }
    return l.query !== void 0 && g.push("?", l.query), l.fragment !== void 0 && g.push("#", l.fragment), g.join("");
  }
  const y = Array.from({ length: 127 }, (h, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function $(h) {
    let p = 0;
    for (let l = 0, f = h.length; l < f; ++l)
      if (p = h.charCodeAt(l), p > 126 || y[p])
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
    }, g = h.indexOf("%") !== -1;
    let _ = !1;
    l.reference === "suffix" && (h = (l.scheme ? l.scheme + ":" : "") + "//" + h);
    const b = h.match(w);
    if (b) {
      if (f.scheme = b[1], f.userinfo = b[3], f.host = b[4], f.port = parseInt(b[5], 10), f.path = b[6] || "", f.query = b[7], f.fragment = b[8], isNaN(f.port) && (f.port = b[5]), f.host) {
        const k = e(f.host);
        if (k.isIPV4 === !1) {
          const I = o(k.host);
          f.host = I.host.toLowerCase(), _ = I.isIPV6;
        } else
          f.host = k.host, _ = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== f.reference && (f.error = f.error || "URI is not a " + l.reference + " reference.");
      const P = i[(l.scheme || f.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (l.domainHost || P && P.domainHost) && _ === !1 && $(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (k) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + k;
        }
      (!P || P && !P.skipNormalize) && (g && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), g && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, l);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const m = {
    SCHEMES: i,
    normalize: s,
    resolve: a,
    resolveComponents: c,
    equal: u,
    serialize: d,
    parse: S
  };
  return Fe.exports = m, Fe.exports.default = m, Fe.exports.fastUri = m, Fe.exports;
}
var Kr;
function ji() {
  if (Kr) return et;
  Kr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const o = Ci();
  return o.code = 'require("ajv/dist/runtime/uri").default', et.default = o, et;
}
var Jr;
function Oi() {
  return Jr || (Jr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.CodeGen = o.Name = o.nil = o.stringify = o.str = o._ = o.KeywordCxt = void 0;
    var e = Lt();
    Object.defineProperty(o, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = Y();
    Object.defineProperty(o, "_", { enumerable: !0, get: function() {
      return t._;
    } }), Object.defineProperty(o, "str", { enumerable: !0, get: function() {
      return t.str;
    } }), Object.defineProperty(o, "stringify", { enumerable: !0, get: function() {
      return t.stringify;
    } }), Object.defineProperty(o, "nil", { enumerable: !0, get: function() {
      return t.nil;
    } }), Object.defineProperty(o, "Name", { enumerable: !0, get: function() {
      return t.Name;
    } }), Object.defineProperty(o, "CodeGen", { enumerable: !0, get: function() {
      return t.CodeGen;
    } });
    const r = or(), n = Ft(), i = xn(), s = sr(), a = Y(), c = Vt(), u = xt(), d = te(), y = ki, $ = ji(), w = (T, A) => new RegExp(T, A);
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
    function f(T) {
      var A, q, R, v, E, O, F, L, Z, H, M, C, N, j, x, V, Q, ee, oe, ie, ce, me, ue, le, J;
      const de = T.strict, X = (A = T.code) === null || A === void 0 ? void 0 : A.optimize, U = X === !0 || X === void 0 ? 1 : X || 0, ae = (R = (q = T.code) === null || q === void 0 ? void 0 : q.regExp) !== null && R !== void 0 ? R : w, he = (v = T.uriResolver) !== null && v !== void 0 ? v : $.default;
      return {
        strictSchema: (O = (E = T.strictSchema) !== null && E !== void 0 ? E : de) !== null && O !== void 0 ? O : !0,
        strictNumbers: (L = (F = T.strictNumbers) !== null && F !== void 0 ? F : de) !== null && L !== void 0 ? L : !0,
        strictTypes: (H = (Z = T.strictTypes) !== null && Z !== void 0 ? Z : de) !== null && H !== void 0 ? H : "log",
        strictTuples: (C = (M = T.strictTuples) !== null && M !== void 0 ? M : de) !== null && C !== void 0 ? C : "log",
        strictRequired: (j = (N = T.strictRequired) !== null && N !== void 0 ? N : de) !== null && j !== void 0 ? j : !1,
        code: T.code ? { ...T.code, optimize: U, regExp: ae } : { optimize: U, regExp: ae },
        loopRequired: (x = T.loopRequired) !== null && x !== void 0 ? x : l,
        loopEnum: (V = T.loopEnum) !== null && V !== void 0 ? V : l,
        meta: (Q = T.meta) !== null && Q !== void 0 ? Q : !0,
        messages: (ee = T.messages) !== null && ee !== void 0 ? ee : !0,
        inlineRefs: (oe = T.inlineRefs) !== null && oe !== void 0 ? oe : !0,
        schemaId: (ie = T.schemaId) !== null && ie !== void 0 ? ie : "$id",
        addUsedSchema: (ce = T.addUsedSchema) !== null && ce !== void 0 ? ce : !0,
        validateSchema: (me = T.validateSchema) !== null && me !== void 0 ? me : !0,
        validateFormats: (ue = T.validateFormats) !== null && ue !== void 0 ? ue : !0,
        unicodeRegExp: (le = T.unicodeRegExp) !== null && le !== void 0 ? le : !0,
        int32range: (J = T.int32range) !== null && J !== void 0 ? J : !0,
        uriResolver: he
      };
    }
    class g {
      constructor(A = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), A = this.opts = { ...A, ...f(A) };
        const { es5: q, lines: R } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: m, es5: q, lines: R }), this.logger = G(A.logger);
        const v = A.validateFormats;
        A.validateFormats = !1, this.RULES = (0, i.getRules)(), _.call(this, h, A, "NOT SUPPORTED"), _.call(this, p, A, "DEPRECATED", "warn"), this._metaOpts = D.call(this), A.formats && k.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), A.keywords && I.call(this, A.keywords), typeof A.meta == "object" && this.addMetaSchema(A.meta), P.call(this), A.validateFormats = v;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: A, meta: q, schemaId: R } = this.opts;
        let v = y;
        R === "id" && (v = { ...y }, v.id = v.$id, delete v.$id), q && A && this.addMetaSchema(v, v[R], !1);
      }
      defaultMeta() {
        const { meta: A, schemaId: q } = this.opts;
        return this.opts.defaultMeta = typeof A == "object" ? A[q] || A : void 0;
      }
      validate(A, q) {
        let R;
        if (typeof A == "string") {
          if (R = this.getSchema(A), !R)
            throw new Error(`no schema with key or ref "${A}"`);
        } else
          R = this.compile(A);
        const v = R(q);
        return "$async" in R || (this.errors = R.errors), v;
      }
      compile(A, q) {
        const R = this._addSchema(A, q);
        return R.validate || this._compileSchemaEnv(R);
      }
      compileAsync(A, q) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: R } = this.opts;
        return v.call(this, A, q);
        async function v(H, M) {
          await E.call(this, H.$schema);
          const C = this._addSchema(H, M);
          return C.validate || O.call(this, C);
        }
        async function E(H) {
          H && !this.getSchema(H) && await v.call(this, { $ref: H }, !0);
        }
        async function O(H) {
          try {
            return this._compileSchemaEnv(H);
          } catch (M) {
            if (!(M instanceof n.default))
              throw M;
            return F.call(this, M), await L.call(this, M.missingSchema), O.call(this, H);
          }
        }
        function F({ missingSchema: H, missingRef: M }) {
          if (this.refs[H])
            throw new Error(`AnySchema ${H} is loaded but ${M} cannot be resolved`);
        }
        async function L(H) {
          const M = await Z.call(this, H);
          this.refs[H] || await E.call(this, M.$schema), this.refs[H] || this.addSchema(M, H, q);
        }
        async function Z(H) {
          const M = this._loading[H];
          if (M)
            return M;
          try {
            return await (this._loading[H] = R(H));
          } finally {
            delete this._loading[H];
          }
        }
      }
      // Adds schema to the instance
      addSchema(A, q, R, v = this.opts.validateSchema) {
        if (Array.isArray(A)) {
          for (const O of A)
            this.addSchema(O, void 0, R, v);
          return this;
        }
        let E;
        if (typeof A == "object") {
          const { schemaId: O } = this.opts;
          if (E = A[O], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${O} must be string`);
        }
        return q = (0, c.normalizeId)(q || E), this._checkUnique(q), this.schemas[q] = this._addSchema(A, R, q, v, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(A, q, R = this.opts.validateSchema) {
        return this.addSchema(A, q, !0, R), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(A, q) {
        if (typeof A == "boolean")
          return !0;
        let R;
        if (R = A.$schema, R !== void 0 && typeof R != "string")
          throw new Error("$schema must be a string");
        if (R = R || this.opts.defaultMeta || this.defaultMeta(), !R)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const v = this.validate(R, A);
        if (!v && q) {
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
        let q;
        for (; typeof (q = b.call(this, A)) == "string"; )
          A = q;
        if (q === void 0) {
          const { schemaId: R } = this.opts, v = new s.SchemaEnv({ schema: {}, schemaId: R });
          if (q = s.resolveSchema.call(this, v, A), !q)
            return;
          this.refs[A] = q;
        }
        return q.validate || this._compileSchemaEnv(q);
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
            const q = b.call(this, A);
            return typeof q == "object" && this._cache.delete(q.schema), delete this.schemas[A], delete this.refs[A], this;
          }
          case "object": {
            const q = A;
            this._cache.delete(q);
            let R = A[this.opts.schemaId];
            return R && (R = (0, c.normalizeId)(R), delete this.schemas[R], delete this.refs[R]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(A) {
        for (const q of A)
          this.addKeyword(q);
        return this;
      }
      addKeyword(A, q) {
        let R;
        if (typeof A == "string")
          R = A, typeof q == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), q.keyword = R);
        else if (typeof A == "object" && q === void 0) {
          if (q = A, R = q.keyword, Array.isArray(R) && !R.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (K.call(this, R, q), !q)
          return (0, d.eachItem)(R, (E) => ne.call(this, E)), this;
        ve.call(this, q);
        const v = {
          ...q,
          type: (0, u.getJSONTypes)(q.type),
          schemaType: (0, u.getJSONTypes)(q.schemaType)
        };
        return (0, d.eachItem)(R, v.type.length === 0 ? (E) => ne.call(this, E, v) : (E) => v.type.forEach((O) => ne.call(this, E, v, O))), this;
      }
      getKeyword(A) {
        const q = this.RULES.all[A];
        return typeof q == "object" ? q.definition : !!q;
      }
      // Remove keyword
      removeKeyword(A) {
        const { RULES: q } = this;
        delete q.keywords[A], delete q.all[A];
        for (const R of q.rules) {
          const v = R.rules.findIndex((E) => E.keyword === A);
          v >= 0 && R.rules.splice(v, 1);
        }
        return this;
      }
      // Add format
      addFormat(A, q) {
        return typeof q == "string" && (q = new RegExp(q)), this.formats[A] = q, this;
      }
      errorsText(A = this.errors, { separator: q = ", ", dataVar: R = "data" } = {}) {
        return !A || A.length === 0 ? "No errors" : A.map((v) => `${R}${v.instancePath} ${v.message}`).reduce((v, E) => v + q + E);
      }
      $dataMetaSchema(A, q) {
        const R = this.RULES.all;
        A = JSON.parse(JSON.stringify(A));
        for (const v of q) {
          const E = v.split("/").slice(1);
          let O = A;
          for (const F of E)
            O = O[F];
          for (const F in R) {
            const L = R[F];
            if (typeof L != "object")
              continue;
            const { $data: Z } = L.definition, H = O[F];
            Z && H && (O[F] = be(H));
          }
        }
        return A;
      }
      _removeAllSchemas(A, q) {
        for (const R in A) {
          const v = A[R];
          (!q || q.test(R)) && (typeof v == "string" ? delete A[R] : v && !v.meta && (this._cache.delete(v.schema), delete A[R]));
        }
      }
      _addSchema(A, q, R, v = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let O;
        const { schemaId: F } = this.opts;
        if (typeof A == "object")
          O = A[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof A != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let L = this._cache.get(A);
        if (L !== void 0)
          return L;
        R = (0, c.normalizeId)(O || R);
        const Z = c.getSchemaRefs.call(this, A, R);
        return L = new s.SchemaEnv({ schema: A, schemaId: F, meta: q, baseId: R, localRefs: Z }), this._cache.set(L.schema, L), E && !R.startsWith("#") && (R && this._checkUnique(R), this.refs[R] = L), v && this.validateSchema(A, !0), L;
      }
      _checkUnique(A) {
        if (this.schemas[A] || this.refs[A])
          throw new Error(`schema with key or id "${A}" already exists`);
      }
      _compileSchemaEnv(A) {
        if (A.meta ? this._compileMetaSchema(A) : s.compileSchema.call(this, A), !A.validate)
          throw new Error("ajv implementation error");
        return A.validate;
      }
      _compileMetaSchema(A) {
        const q = this.opts;
        this.opts = this._metaOpts;
        try {
          s.compileSchema.call(this, A);
        } finally {
          this.opts = q;
        }
      }
    }
    g.ValidationError = r.default, g.MissingRefError = n.default, o.default = g;
    function _(T, A, q, R = "error") {
      for (const v in T) {
        const E = v;
        E in A && this.logger[R](`${q}: option ${v}. ${T[E]}`);
      }
    }
    function b(T) {
      return T = (0, c.normalizeId)(T), this.schemas[T] || this.refs[T];
    }
    function P() {
      const T = this.opts.schemas;
      if (T)
        if (Array.isArray(T))
          this.addSchema(T);
        else
          for (const A in T)
            this.addSchema(T[A], A);
    }
    function k() {
      for (const T in this.opts.formats) {
        const A = this.opts.formats[T];
        A && this.addFormat(T, A);
      }
    }
    function I(T) {
      if (Array.isArray(T)) {
        this.addVocabulary(T);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const A in T) {
        const q = T[A];
        q.keyword || (q.keyword = A), this.addKeyword(q);
      }
    }
    function D() {
      const T = { ...this.opts };
      for (const A of S)
        delete T[A];
      return T;
    }
    const z = { log() {
    }, warn() {
    }, error() {
    } };
    function G(T) {
      if (T === !1)
        return z;
      if (T === void 0)
        return console;
      if (T.log && T.warn && T.error)
        return T;
      throw new Error("logger must implement log, warn and error methods");
    }
    const B = /^[a-z_$][a-z0-9_$:-]*$/i;
    function K(T, A) {
      const { RULES: q } = this;
      if ((0, d.eachItem)(T, (R) => {
        if (q.keywords[R])
          throw new Error(`Keyword ${R} is already defined`);
        if (!B.test(R))
          throw new Error(`Keyword ${R} has invalid name`);
      }), !!A && A.$data && !("code" in A || "validate" in A))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ne(T, A, q) {
      var R;
      const v = A?.post;
      if (q && v)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let O = v ? E.post : E.rules.find(({ type: L }) => L === q);
      if (O || (O = { type: q, rules: [] }, E.rules.push(O)), E.keywords[T] = !0, !A)
        return;
      const F = {
        keyword: T,
        definition: {
          ...A,
          type: (0, u.getJSONTypes)(A.type),
          schemaType: (0, u.getJSONTypes)(A.schemaType)
        }
      };
      A.before ? ye.call(this, O, F, A.before) : O.rules.push(F), E.all[T] = F, (R = A.implements) === null || R === void 0 || R.forEach((L) => this.addKeyword(L));
    }
    function ye(T, A, q) {
      const R = T.rules.findIndex((v) => v.keyword === q);
      R >= 0 ? T.rules.splice(R, 0, A) : (T.rules.push(A), this.logger.warn(`rule ${q} is not defined`));
    }
    function ve(T) {
      let { metaSchema: A } = T;
      A !== void 0 && (T.$data && this.opts.$data && (A = be(A)), T.validateSchema = this.compile(A, !0));
    }
    const re = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function be(T) {
      return { anyOf: [T, re] };
    }
  })(Bt)), Bt;
}
var tt = {}, rt = {}, nt = {}, Hr;
function Ii() {
  if (Hr) return nt;
  Hr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const o = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return nt.default = o, nt;
}
var Ne = {}, Wr;
function qi() {
  if (Wr) return Ne;
  Wr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.callRef = Ne.getValidate = void 0;
  const o = Ft(), e = Se(), t = Y(), r = Re(), n = sr(), i = te(), s = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: d, schema: y, it: $ } = u, { baseId: w, schemaEnv: S, validateName: m, opts: h, self: p } = $, { root: l } = S;
      if ((y === "#" || y === "#/") && w === l.baseId)
        return g();
      const f = n.resolveRef.call(p, l, w, y);
      if (f === void 0)
        throw new o.default($.opts.uriResolver, w, y);
      if (f instanceof n.SchemaEnv)
        return _(f);
      return b(f);
      function g() {
        if (S === l)
          return c(u, m, S, S.$async);
        const P = d.scopeValue("root", { ref: l });
        return c(u, (0, t._)`${P}.validate`, l, l.$async);
      }
      function _(P) {
        const k = a(u, P);
        c(u, k, P, P.$async);
      }
      function b(P) {
        const k = d.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), I = d.name("valid"), D = u.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: k,
          errSchemaPath: y
        }, I);
        u.mergeEvaluated(D), u.ok(I);
      }
    }
  };
  function a(u, d) {
    const { gen: y } = u;
    return d.validate ? y.scopeValue("validate", { ref: d.validate }) : (0, t._)`${y.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Ne.getValidate = a;
  function c(u, d, y, $) {
    const { gen: w, it: S } = u, { allErrors: m, schemaEnv: h, opts: p } = S, l = p.passContext ? r.default.this : t.nil;
    $ ? f() : g();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = w.let("valid");
      w.try(() => {
        w.code((0, t._)`await ${(0, e.callValidateCode)(u, d, l)}`), b(d), m || w.assign(P, !0);
      }, (k) => {
        w.if((0, t._)`!(${k} instanceof ${S.ValidationError})`, () => w.throw(k)), _(k), m || w.assign(P, !1);
      }), u.ok(P);
    }
    function g() {
      u.result((0, e.callValidateCode)(u, d, l), () => b(d), () => _(d));
    }
    function _(P) {
      const k = (0, t._)`${P}.errors`;
      w.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${k} : ${r.default.vErrors}.concat(${k})`), w.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function b(P) {
      var k;
      if (!S.opts.unevaluated)
        return;
      const I = (k = y?.validate) === null || k === void 0 ? void 0 : k.evaluated;
      if (S.props !== !0)
        if (I && !I.dynamicProps)
          I.props !== void 0 && (S.props = i.mergeEvaluated.props(w, I.props, S.props));
        else {
          const D = w.var("props", (0, t._)`${P}.evaluated.props`);
          S.props = i.mergeEvaluated.props(w, D, S.props, t.Name);
        }
      if (S.items !== !0)
        if (I && !I.dynamicItems)
          I.items !== void 0 && (S.items = i.mergeEvaluated.items(w, I.items, S.items));
        else {
          const D = w.var("items", (0, t._)`${P}.evaluated.items`);
          S.items = i.mergeEvaluated.items(w, D, S.items, t.Name);
        }
    }
  }
  return Ne.callRef = c, Ne.default = s, Ne;
}
var Yr;
function xi() {
  if (Yr) return rt;
  Yr = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const o = Ii(), e = qi(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    o.default,
    e.default
  ];
  return rt.default = t, rt;
}
var it = {}, ot = {}, Qr;
function Di() {
  if (Qr) return ot;
  Qr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const o = Y(), e = o.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, r = {
    message: ({ keyword: i, schemaCode: s }) => (0, o.str)`must be ${t[i].okStr} ${s}`,
    params: ({ keyword: i, schemaCode: s }) => (0, o._)`{comparison: ${t[i].okStr}, limit: ${s}}`
  }, n = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(i) {
      const { keyword: s, data: a, schemaCode: c } = i;
      i.fail$data((0, o._)`${a} ${t[s].fail} ${c} || isNaN(${a})`);
    }
  };
  return ot.default = n, ot;
}
var st = {}, Xr;
function zi() {
  if (Xr) return st;
  Xr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const o = Y(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, o._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: n, data: i, schemaCode: s, it: a } = r, c = a.opts.multipleOfPrecision, u = n.let("res"), d = c ? (0, o._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${c}` : (0, o._)`${u} !== parseInt(${u})`;
      r.fail$data((0, o._)`(${s} === 0 || (${u} = ${i}/${s}, ${d}))`);
    }
  };
  return st.default = t, st;
}
var at = {}, ct = {}, Zr;
function Vi() {
  if (Zr) return ct;
  Zr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  function o(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return ct.default = o, o.code = 'require("ajv/dist/runtime/ucs2length").default', ct;
}
var en;
function Li() {
  if (en) return at;
  en = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const o = Y(), e = te(), t = Vi(), n = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: s }) {
        const a = i === "maxLength" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${a} than ${s} characters`;
      },
      params: ({ schemaCode: i }) => (0, o._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: s, data: a, schemaCode: c, it: u } = i, d = s === "maxLength" ? o.operators.GT : o.operators.LT, y = u.opts.unicode === !1 ? (0, o._)`${a}.length` : (0, o._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, o._)`${y} ${d} ${c}`);
    }
  };
  return at.default = n, at;
}
var lt = {}, tn;
function Fi() {
  if (tn) return lt;
  tn = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const o = Se(), e = Y(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: s, schema: a, schemaCode: c, it: u } = n, d = u.opts.unicodeRegExp ? "u" : "", y = s ? (0, e._)`(new RegExp(${c}, ${d}))` : (0, o.usePattern)(n, a);
      n.fail$data((0, e._)`!${y}.test(${i})`);
    }
  };
  return lt.default = r, lt;
}
var ut = {}, rn;
function Gi() {
  if (rn) return ut;
  rn = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const o = Y(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxProperties" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${i} than ${n} properties`;
      },
      params: ({ schemaCode: r }) => (0, o._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: s } = r, a = n === "maxProperties" ? o.operators.GT : o.operators.LT;
      r.fail$data((0, o._)`Object.keys(${i}).length ${a} ${s}`);
    }
  };
  return ut.default = t, ut;
}
var dt = {}, nn;
function Bi() {
  if (nn) return dt;
  nn = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const o = Se(), e = Y(), t = te(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: s, schema: a, schemaCode: c, data: u, $data: d, it: y } = i, { opts: $ } = y;
      if (!d && a.length === 0)
        return;
      const w = a.length >= $.loopRequired;
      if (y.allErrors ? S() : m(), $.strictRequired) {
        const l = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const g of a)
          if (l?.[g] === void 0 && !f.has(g)) {
            const _ = y.schemaEnv.baseId + y.errSchemaPath, b = `required property "${g}" is not defined at "${_}" (strictRequired)`;
            (0, t.checkStrictMode)(y, b, y.opts.strictRequired);
          }
      }
      function S() {
        if (w || d)
          i.block$data(e.nil, h);
        else
          for (const l of a)
            (0, o.checkReportMissingProp)(i, l);
      }
      function m() {
        const l = s.let("missing");
        if (w || d) {
          const f = s.let("valid", !0);
          i.block$data(f, () => p(l, f)), i.ok(f);
        } else
          s.if((0, o.checkMissingProp)(i, a, l)), (0, o.reportMissingProp)(i, l), s.else();
      }
      function h() {
        s.forOf("prop", c, (l) => {
          i.setParams({ missingProperty: l }), s.if((0, o.noPropertyInData)(s, u, l, $.ownProperties), () => i.error());
        });
      }
      function p(l, f) {
        i.setParams({ missingProperty: l }), s.forOf(l, c, () => {
          s.assign(f, (0, o.propertyInData)(s, u, l, $.ownProperties)), s.if((0, e.not)(f), () => {
            i.error(), s.break();
          });
        }, e.nil);
      }
    }
  };
  return dt.default = n, dt;
}
var ht = {}, on;
function Ui() {
  if (on) return ht;
  on = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const o = Y(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxItems" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${i} than ${n} items`;
      },
      params: ({ schemaCode: r }) => (0, o._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: s } = r, a = n === "maxItems" ? o.operators.GT : o.operators.LT;
      r.fail$data((0, o._)`${i}.length ${a} ${s}`);
    }
  };
  return ht.default = t, ht;
}
var ft = {}, pt = {}, sn;
function ar() {
  if (sn) return pt;
  sn = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const o = zn();
  return o.code = 'require("ajv/dist/runtime/equal").default', pt.default = o, pt;
}
var an;
function Ki() {
  if (an) return ft;
  an = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const o = xt(), e = Y(), t = te(), r = ar(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: s, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${s} are identical)`,
      params: ({ params: { i: s, j: a } }) => (0, e._)`{i: ${s}, j: ${a}}`
    },
    code(s) {
      const { gen: a, data: c, $data: u, schema: d, parentSchema: y, schemaCode: $, it: w } = s;
      if (!u && !d)
        return;
      const S = a.let("valid"), m = y.items ? (0, o.getSchemaTypes)(y.items) : [];
      s.block$data(S, h, (0, e._)`${$} === false`), s.ok(S);
      function h() {
        const g = a.let("i", (0, e._)`${c}.length`), _ = a.let("j");
        s.setParams({ i: g, j: _ }), a.assign(S, !0), a.if((0, e._)`${g} > 1`, () => (p() ? l : f)(g, _));
      }
      function p() {
        return m.length > 0 && !m.some((g) => g === "object" || g === "array");
      }
      function l(g, _) {
        const b = a.name("item"), P = (0, o.checkDataTypes)(m, b, w.opts.strictNumbers, o.DataType.Wrong), k = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${g}--;`, () => {
          a.let(b, (0, e._)`${c}[${g}]`), a.if(P, (0, e._)`continue`), m.length > 1 && a.if((0, e._)`typeof ${b} == "string"`, (0, e._)`${b} += "_"`), a.if((0, e._)`typeof ${k}[${b}] == "number"`, () => {
            a.assign(_, (0, e._)`${k}[${b}]`), s.error(), a.assign(S, !1).break();
          }).code((0, e._)`${k}[${b}] = ${g}`);
        });
      }
      function f(g, _) {
        const b = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${g}--;`, () => a.for((0, e._)`${_} = ${g}; ${_}--;`, () => a.if((0, e._)`${b}(${c}[${g}], ${c}[${_}])`, () => {
          s.error(), a.assign(S, !1).break(P);
        })));
      }
    }
  };
  return ft.default = i, ft;
}
var mt = {}, cn;
function Ji() {
  if (cn) return mt;
  cn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const o = Y(), e = te(), t = ar(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schemaCode: u, schema: d } = i;
      c || d && typeof d == "object" ? i.fail$data((0, o._)`!${(0, e.useFunc)(s, t.default)}(${a}, ${u})`) : i.fail((0, o._)`${d} !== ${a}`);
    }
  };
  return mt.default = n, mt;
}
var gt = {}, ln;
function Hi() {
  if (ln) return gt;
  ln = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const o = Y(), e = te(), t = ar(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schema: u, schemaCode: d, it: y } = i;
      if (!c && u.length === 0)
        throw new Error("enum must have non-empty array");
      const $ = u.length >= y.opts.loopEnum;
      let w;
      const S = () => w ?? (w = (0, e.useFunc)(s, t.default));
      let m;
      if ($ || c)
        m = s.let("valid"), i.block$data(m, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const l = s.const("vSchema", d);
        m = (0, o.or)(...u.map((f, g) => p(l, g)));
      }
      i.pass(m);
      function h() {
        s.assign(m, !1), s.forOf("v", d, (l) => s.if((0, o._)`${S()}(${a}, ${l})`, () => s.assign(m, !0).break()));
      }
      function p(l, f) {
        const g = u[f];
        return typeof g == "object" && g !== null ? (0, o._)`${S()}(${a}, ${l}[${f}])` : (0, o._)`${a} === ${g}`;
      }
    }
  };
  return gt.default = n, gt;
}
var un;
function Wi() {
  if (un) return it;
  un = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const o = Di(), e = zi(), t = Li(), r = Fi(), n = Gi(), i = Bi(), s = Ui(), a = Ki(), c = Ji(), u = Hi(), d = [
    // number
    o.default,
    e.default,
    // string
    t.default,
    r.default,
    // object
    n.default,
    i.default,
    // array
    s.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    u.default
  ];
  return it.default = d, it;
}
var yt = {}, Ie = {}, dn;
function Vn() {
  if (dn) return Ie;
  dn = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.validateAdditionalItems = void 0;
  const o = Y(), e = te(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, o.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, o._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: s, it: a } = i, { items: c } = s;
      if (!Array.isArray(c)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      n(i, c);
    }
  };
  function n(i, s) {
    const { gen: a, schema: c, data: u, keyword: d, it: y } = i;
    y.items = !0;
    const $ = a.const("len", (0, o._)`${u}.length`);
    if (c === !1)
      i.setParams({ len: s.length }), i.pass((0, o._)`${$} <= ${s.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(y, c)) {
      const S = a.var("valid", (0, o._)`${$} <= ${s.length}`);
      a.if((0, o.not)(S), () => w(S)), i.ok(S);
    }
    function w(S) {
      a.forRange("i", s.length, $, (m) => {
        i.subschema({ keyword: d, dataProp: m, dataPropType: e.Type.Num }, S), y.allErrors || a.if((0, o.not)(S), () => a.break());
      });
    }
  }
  return Ie.validateAdditionalItems = n, Ie.default = r, Ie;
}
var vt = {}, qe = {}, hn;
function Ln() {
  if (hn) return qe;
  hn = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.validateTuple = void 0;
  const o = Y(), e = te(), t = Se(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: s, it: a } = i;
      if (Array.isArray(s))
        return n(i, "additionalItems", s);
      a.items = !0, !(0, e.alwaysValidSchema)(a, s) && i.ok((0, t.validateArray)(i));
    }
  };
  function n(i, s, a = i.schema) {
    const { gen: c, parentSchema: u, data: d, keyword: y, it: $ } = i;
    m(u), $.opts.unevaluated && a.length && $.items !== !0 && ($.items = e.mergeEvaluated.items(c, a.length, $.items));
    const w = c.name("valid"), S = c.const("len", (0, o._)`${d}.length`);
    a.forEach((h, p) => {
      (0, e.alwaysValidSchema)($, h) || (c.if((0, o._)`${S} > ${p}`, () => i.subschema({
        keyword: y,
        schemaProp: p,
        dataProp: p
      }, w)), i.ok(w));
    });
    function m(h) {
      const { opts: p, errSchemaPath: l } = $, f = a.length, g = f === h.minItems && (f === h.maxItems || h[s] === !1);
      if (p.strictTuples && !g) {
        const _ = `"${y}" is ${f}-tuple, but minItems or maxItems/${s} are not specified or different at path "${l}"`;
        (0, e.checkStrictMode)($, _, p.strictTuples);
      }
    }
  }
  return qe.validateTuple = n, qe.default = r, qe;
}
var fn;
function Yi() {
  if (fn) return vt;
  fn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const o = Ln(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, o.validateTuple)(t, "items")
  };
  return vt.default = e, vt;
}
var bt = {}, pn;
function Qi() {
  if (pn) return bt;
  pn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const o = Y(), e = te(), t = Se(), r = Vn(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, o.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, o._)`{limit: ${s}}`
    },
    code(s) {
      const { schema: a, parentSchema: c, it: u } = s, { prefixItems: d } = c;
      u.items = !0, !(0, e.alwaysValidSchema)(u, a) && (d ? (0, r.validateAdditionalItems)(s, d) : s.ok((0, t.validateArray)(s)));
    }
  };
  return bt.default = i, bt;
}
var wt = {}, mn;
function Xi() {
  if (mn) return wt;
  mn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const o = Y(), e = te(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: n, max: i } }) => i === void 0 ? (0, o.str)`must contain at least ${n} valid item(s)` : (0, o.str)`must contain at least ${n} and no more than ${i} valid item(s)`,
      params: ({ params: { min: n, max: i } }) => i === void 0 ? (0, o._)`{minContains: ${n}}` : (0, o._)`{minContains: ${n}, maxContains: ${i}}`
    },
    code(n) {
      const { gen: i, schema: s, parentSchema: a, data: c, it: u } = n;
      let d, y;
      const { minContains: $, maxContains: w } = a;
      u.opts.next ? (d = $ === void 0 ? 1 : $, y = w) : d = 1;
      const S = i.const("len", (0, o._)`${c}.length`);
      if (n.setParams({ min: d, max: y }), y === void 0 && d === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (y !== void 0 && d > y) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, s)) {
        let f = (0, o._)`${S} >= ${d}`;
        y !== void 0 && (f = (0, o._)`${f} && ${S} <= ${y}`), n.pass(f);
        return;
      }
      u.items = !0;
      const m = i.name("valid");
      y === void 0 && d === 1 ? p(m, () => i.if(m, () => i.break())) : d === 0 ? (i.let(m, !0), y !== void 0 && i.if((0, o._)`${c}.length > 0`, h)) : (i.let(m, !1), h()), n.result(m, () => n.reset());
      function h() {
        const f = i.name("_valid"), g = i.let("count", 0);
        p(f, () => i.if(f, () => l(g)));
      }
      function p(f, g) {
        i.forRange("i", 0, S, (_) => {
          n.subschema({
            keyword: "contains",
            dataProp: _,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), g();
        });
      }
      function l(f) {
        i.code((0, o._)`${f}++`), y === void 0 ? i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0).break()) : (i.if((0, o._)`${f} > ${y}`, () => i.assign(m, !1).break()), d === 1 ? i.assign(m, !0) : i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0)));
      }
    }
  };
  return wt.default = r, wt;
}
var er = {}, gn;
function Zi() {
  return gn || (gn = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.validateSchemaDeps = o.validatePropertyDeps = o.error = void 0;
    const e = Y(), t = te(), r = Se();
    o.error = {
      message: ({ params: { property: c, depsCount: u, deps: d } }) => {
        const y = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${y} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: u, deps: d, missingProperty: y } }) => (0, e._)`{property: ${c},
    missingProperty: ${y},
    depsCount: ${u},
    deps: ${d}}`
      // TODO change to reference
    };
    const n = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: o.error,
      code(c) {
        const [u, d] = i(c);
        s(c, u), a(c, d);
      }
    };
    function i({ schema: c }) {
      const u = {}, d = {};
      for (const y in c) {
        if (y === "__proto__")
          continue;
        const $ = Array.isArray(c[y]) ? u : d;
        $[y] = c[y];
      }
      return [u, d];
    }
    function s(c, u = c.schema) {
      const { gen: d, data: y, it: $ } = c;
      if (Object.keys(u).length === 0)
        return;
      const w = d.let("missing");
      for (const S in u) {
        const m = u[S];
        if (m.length === 0)
          continue;
        const h = (0, r.propertyInData)(d, y, S, $.opts.ownProperties);
        c.setParams({
          property: S,
          depsCount: m.length,
          deps: m.join(", ")
        }), $.allErrors ? d.if(h, () => {
          for (const p of m)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${h} && (${(0, r.checkMissingProp)(c, m, w)})`), (0, r.reportMissingProp)(c, w), d.else());
      }
    }
    o.validatePropertyDeps = s;
    function a(c, u = c.schema) {
      const { gen: d, data: y, keyword: $, it: w } = c, S = d.name("valid");
      for (const m in u)
        (0, t.alwaysValidSchema)(w, u[m]) || (d.if(
          (0, r.propertyInData)(d, y, m, w.opts.ownProperties),
          () => {
            const h = c.subschema({ keyword: $, schemaProp: m }, S);
            c.mergeValidEvaluated(h, S);
          },
          () => d.var(S, !0)
          // TODO var
        ), c.ok(S));
    }
    o.validateSchemaDeps = a, o.default = n;
  })(er)), er;
}
var _t = {}, yn;
function eo() {
  if (yn) return _t;
  yn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const o = Y(), e = te(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, o._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: i, schema: s, data: a, it: c } = n;
      if ((0, e.alwaysValidSchema)(c, s))
        return;
      const u = i.name("valid");
      i.forIn("key", a, (d) => {
        n.setParams({ propertyName: d }), n.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, u), i.if((0, o.not)(u), () => {
          n.error(!0), c.allErrors || i.break();
        });
      }), n.ok(u);
    }
  };
  return _t.default = r, _t;
}
var $t = {}, vn;
function Fn() {
  if (vn) return $t;
  vn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const o = Se(), e = Y(), t = Re(), r = te(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: s }) => (0, e._)`{additionalProperty: ${s.additionalProperty}}`
    },
    code(s) {
      const { gen: a, schema: c, parentSchema: u, data: d, errsCount: y, it: $ } = s;
      if (!y)
        throw new Error("ajv implementation error");
      const { allErrors: w, opts: S } = $;
      if ($.props = !0, S.removeAdditional !== "all" && (0, r.alwaysValidSchema)($, c))
        return;
      const m = (0, o.allSchemaProperties)(u.properties), h = (0, o.allSchemaProperties)(u.patternProperties);
      p(), s.ok((0, e._)`${y} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (b) => {
          !m.length && !h.length ? g(b) : a.if(l(b), () => g(b));
        });
      }
      function l(b) {
        let P;
        if (m.length > 8) {
          const k = (0, r.schemaRefOrVal)($, u.properties, "properties");
          P = (0, o.isOwnProperty)(a, k, b);
        } else m.length ? P = (0, e.or)(...m.map((k) => (0, e._)`${b} === ${k}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((k) => (0, e._)`${(0, o.usePattern)(s, k)}.test(${b})`))), (0, e.not)(P);
      }
      function f(b) {
        a.code((0, e._)`delete ${d}[${b}]`);
      }
      function g(b) {
        if (S.removeAdditional === "all" || S.removeAdditional && c === !1) {
          f(b);
          return;
        }
        if (c === !1) {
          s.setParams({ additionalProperty: b }), s.error(), w || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)($, c)) {
          const P = a.name("valid");
          S.removeAdditional === "failing" ? (_(b, P, !1), a.if((0, e.not)(P), () => {
            s.reset(), f(b);
          })) : (_(b, P), w || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function _(b, P, k) {
        const I = {
          keyword: "additionalProperties",
          dataProp: b,
          dataPropType: r.Type.Str
        };
        k === !1 && Object.assign(I, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), s.subschema(I, P);
      }
    }
  };
  return $t.default = i, $t;
}
var St = {}, bn;
function to() {
  if (bn) return St;
  bn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const o = Lt(), e = Se(), t = te(), r = Fn(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, parentSchema: c, data: u, it: d } = i;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new o.KeywordCxt(d, r.default, "additionalProperties"));
      const y = (0, e.allSchemaProperties)(a);
      for (const h of y)
        d.definedProperties.add(h);
      d.opts.unevaluated && y.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(s, (0, t.toHash)(y), d.props));
      const $ = y.filter((h) => !(0, t.alwaysValidSchema)(d, a[h]));
      if ($.length === 0)
        return;
      const w = s.name("valid");
      for (const h of $)
        S(h) ? m(h) : (s.if((0, e.propertyInData)(s, u, h, d.opts.ownProperties)), m(h), d.allErrors || s.else().var(w, !0), s.endIf()), i.it.definedProperties.add(h), i.ok(w);
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
  return St.default = n, St;
}
var Pt = {}, wn;
function ro() {
  if (wn) return Pt;
  wn = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
  const o = Se(), e = Y(), t = te(), r = te(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, data: c, parentSchema: u, it: d } = i, { opts: y } = d, $ = (0, o.allSchemaProperties)(a), w = $.filter((g) => (0, t.alwaysValidSchema)(d, a[g]));
      if ($.length === 0 || w.length === $.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const S = y.strictSchema && !y.allowMatchingProperties && u.properties, m = s.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(s, d.props));
      const { props: h } = d;
      p();
      function p() {
        for (const g of $)
          S && l(g), d.allErrors ? f(g) : (s.var(m, !0), f(g), s.if(m));
      }
      function l(g) {
        for (const _ in S)
          new RegExp(g).test(_) && (0, t.checkStrictMode)(d, `property ${_} matches pattern ${g} (use allowMatchingProperties)`);
      }
      function f(g) {
        s.forIn("key", c, (_) => {
          s.if((0, e._)`${(0, o.usePattern)(i, g)}.test(${_})`, () => {
            const b = w.includes(g);
            b || i.subschema({
              keyword: "patternProperties",
              schemaProp: g,
              dataProp: _,
              dataPropType: r.Type.Str
            }, m), d.opts.unevaluated && h !== !0 ? s.assign((0, e._)`${h}[${_}]`, !0) : !b && !d.allErrors && s.if((0, e.not)(m), () => s.break());
          });
        });
      }
    }
  };
  return Pt.default = n, Pt;
}
var Et = {}, _n;
function no() {
  if (_n) return Et;
  _n = 1, Object.defineProperty(Et, "__esModule", { value: !0 });
  const o = te(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if ((0, o.alwaysValidSchema)(i, n)) {
        t.fail();
        return;
      }
      const s = r.name("valid");
      t.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, s), t.failResult(s, () => t.reset(), () => t.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Et.default = e, Et;
}
var Mt = {}, $n;
function io() {
  if ($n) return Mt;
  $n = 1, Object.defineProperty(Mt, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Se().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Mt.default = e, Mt;
}
var Tt = {}, Sn;
function oo() {
  if (Sn) return Tt;
  Sn = 1, Object.defineProperty(Tt, "__esModule", { value: !0 });
  const o = Y(), e = te(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, o._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: i, schema: s, parentSchema: a, it: c } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const u = s, d = i.let("valid", !1), y = i.let("passing", null), $ = i.name("_valid");
      n.setParams({ passing: y }), i.block(w), n.result(d, () => n.reset(), () => n.error(!0));
      function w() {
        u.forEach((S, m) => {
          let h;
          (0, e.alwaysValidSchema)(c, S) ? i.var($, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: m,
            compositeRule: !0
          }, $), m > 0 && i.if((0, o._)`${$} && ${d}`).assign(d, !1).assign(y, (0, o._)`[${y}, ${m}]`).else(), i.if($, () => {
            i.assign(d, !0), i.assign(y, m), h && n.mergeEvaluated(h, o.Name);
          });
        });
      }
    }
  };
  return Tt.default = r, Tt;
}
var kt = {}, Pn;
function so() {
  if (Pn) return kt;
  Pn = 1, Object.defineProperty(kt, "__esModule", { value: !0 });
  const o = te(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const s = r.name("valid");
      n.forEach((a, c) => {
        if ((0, o.alwaysValidSchema)(i, a))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: c }, s);
        t.ok(s), t.mergeEvaluated(u);
      });
    }
  };
  return kt.default = e, kt;
}
var At = {}, En;
function ao() {
  if (En) return At;
  En = 1, Object.defineProperty(At, "__esModule", { value: !0 });
  const o = Y(), e = te(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, o.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, o._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: s, parentSchema: a, it: c } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const u = n(c, "then"), d = n(c, "else");
      if (!u && !d)
        return;
      const y = s.let("valid", !0), $ = s.name("_valid");
      if (w(), i.reset(), u && d) {
        const m = s.let("ifClause");
        i.setParams({ ifClause: m }), s.if($, S("then", m), S("else", m));
      } else u ? s.if($, S("then")) : s.if((0, o.not)($), S("else"));
      i.pass(y, () => i.error(!0));
      function w() {
        const m = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, $);
        i.mergeEvaluated(m);
      }
      function S(m, h) {
        return () => {
          const p = i.subschema({ keyword: m }, $);
          s.assign(y, $), i.mergeValidEvaluated(p, y), h ? s.assign(h, (0, o._)`${m}`) : i.setParams({ ifClause: m });
        };
      }
    }
  };
  function n(i, s) {
    const a = i.schema[s];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return At.default = r, At;
}
var Nt = {}, Mn;
function co() {
  if (Mn) return Nt;
  Mn = 1, Object.defineProperty(Nt, "__esModule", { value: !0 });
  const o = te(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, o.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return Nt.default = e, Nt;
}
var Tn;
function lo() {
  if (Tn) return yt;
  Tn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const o = Vn(), e = Yi(), t = Ln(), r = Qi(), n = Xi(), i = Zi(), s = eo(), a = Fn(), c = to(), u = ro(), d = no(), y = io(), $ = oo(), w = so(), S = ao(), m = co();
  function h(p = !1) {
    const l = [
      // any
      d.default,
      y.default,
      $.default,
      w.default,
      S.default,
      m.default,
      // object
      s.default,
      a.default,
      i.default,
      c.default,
      u.default
    ];
    return p ? l.push(e.default, r.default) : l.push(o.default, t.default), l.push(n.default), l;
  }
  return yt.default = h, yt;
}
var Rt = {}, Ct = {}, kn;
function uo() {
  if (kn) return Ct;
  kn = 1, Object.defineProperty(Ct, "__esModule", { value: !0 });
  const o = Y(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, o._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: s, $data: a, schema: c, schemaCode: u, it: d } = r, { opts: y, errSchemaPath: $, schemaEnv: w, self: S } = d;
      if (!y.validateFormats)
        return;
      a ? m() : h();
      function m() {
        const p = i.scopeValue("formats", {
          ref: S.formats,
          code: y.code.formats
        }), l = i.const("fDef", (0, o._)`${p}[${u}]`), f = i.let("fType"), g = i.let("format");
        i.if((0, o._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => i.assign(f, (0, o._)`${l}.type || "string"`).assign(g, (0, o._)`${l}.validate`), () => i.assign(f, (0, o._)`"string"`).assign(g, l)), r.fail$data((0, o.or)(_(), b()));
        function _() {
          return y.strictSchema === !1 ? o.nil : (0, o._)`${u} && !${g}`;
        }
        function b() {
          const P = w.$async ? (0, o._)`(${l}.async ? await ${g}(${s}) : ${g}(${s}))` : (0, o._)`${g}(${s})`, k = (0, o._)`(typeof ${g} == "function" ? ${P} : ${g}.test(${s}))`;
          return (0, o._)`${g} && ${g} !== true && ${f} === ${n} && !${k}`;
        }
      }
      function h() {
        const p = S.formats[c];
        if (!p) {
          _();
          return;
        }
        if (p === !0)
          return;
        const [l, f, g] = b(p);
        l === n && r.pass(P());
        function _() {
          if (y.strictSchema === !1) {
            S.logger.warn(k());
            return;
          }
          throw new Error(k());
          function k() {
            return `unknown format "${c}" ignored in schema at path "${$}"`;
          }
        }
        function b(k) {
          const I = k instanceof RegExp ? (0, o.regexpCode)(k) : y.code.formats ? (0, o._)`${y.code.formats}${(0, o.getProperty)(c)}` : void 0, D = i.scopeValue("formats", { key: c, ref: k, code: I });
          return typeof k == "object" && !(k instanceof RegExp) ? [k.type || "string", k.validate, (0, o._)`${D}.validate`] : ["string", k, D];
        }
        function P() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!w.$async)
              throw new Error("async format in sync schema");
            return (0, o._)`await ${g}(${s})`;
          }
          return typeof f == "function" ? (0, o._)`${g}(${s})` : (0, o._)`${g}.test(${s})`;
        }
      }
    }
  };
  return Ct.default = t, Ct;
}
var An;
function ho() {
  if (An) return Rt;
  An = 1, Object.defineProperty(Rt, "__esModule", { value: !0 });
  const e = [uo().default];
  return Rt.default = e, Rt;
}
var Oe = {}, Nn;
function fo() {
  return Nn || (Nn = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.contentVocabulary = Oe.metadataVocabulary = void 0, Oe.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Oe.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Oe;
}
var Rn;
function po() {
  if (Rn) return tt;
  Rn = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const o = xi(), e = Wi(), t = lo(), r = ho(), n = fo(), i = [
    o.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return tt.default = i, tt;
}
var jt = {}, Ge = {}, Cn;
function mo() {
  if (Cn) return Ge;
  Cn = 1, Object.defineProperty(Ge, "__esModule", { value: !0 }), Ge.DiscrError = void 0;
  var o;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(o || (Ge.DiscrError = o = {})), Ge;
}
var jn;
function go() {
  if (jn) return jt;
  jn = 1, Object.defineProperty(jt, "__esModule", { value: !0 });
  const o = Y(), e = mo(), t = sr(), r = Ft(), n = te(), s = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: u } }) => (0, o._)`{error: ${a}, tag: ${u}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: u, schema: d, parentSchema: y, it: $ } = a, { oneOf: w } = y;
      if (!$.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const S = d.propertyName;
      if (typeof S != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!w)
        throw new Error("discriminator: requires oneOf keyword");
      const m = c.let("valid", !1), h = c.const("tag", (0, o._)`${u}${(0, o.getProperty)(S)}`);
      c.if((0, o._)`typeof ${h} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: S })), a.ok(m);
      function p() {
        const g = f();
        c.if(!1);
        for (const _ in g)
          c.elseIf((0, o._)`${h} === ${_}`), c.assign(m, l(g[_]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: S }), c.endIf();
      }
      function l(g) {
        const _ = c.name("valid"), b = a.subschema({ keyword: "oneOf", schemaProp: g }, _);
        return a.mergeEvaluated(b, o.Name), _;
      }
      function f() {
        var g;
        const _ = {}, b = k(y);
        let P = !0;
        for (let z = 0; z < w.length; z++) {
          let G = w[z];
          if (G?.$ref && !(0, n.schemaHasRulesButRef)(G, $.self.RULES)) {
            const K = G.$ref;
            if (G = t.resolveRef.call($.self, $.schemaEnv.root, $.baseId, K), G instanceof t.SchemaEnv && (G = G.schema), G === void 0)
              throw new r.default($.opts.uriResolver, $.baseId, K);
          }
          const B = (g = G?.properties) === null || g === void 0 ? void 0 : g[S];
          if (typeof B != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${S}"`);
          P = P && (b || k(G)), I(B, z);
        }
        if (!P)
          throw new Error(`discriminator: "${S}" must be required`);
        return _;
        function k({ required: z }) {
          return Array.isArray(z) && z.includes(S);
        }
        function I(z, G) {
          if (z.const)
            D(z.const, G);
          else if (z.enum)
            for (const B of z.enum)
              D(B, G);
          else
            throw new Error(`discriminator: "properties/${S}" must have "const" or "enum"`);
        }
        function D(z, G) {
          if (typeof z != "string" || z in _)
            throw new Error(`discriminator: "${S}" values must be unique strings`);
          _[z] = G;
        }
      }
    }
  };
  return jt.default = s, jt;
}
const yo = "http://json-schema.org/draft-07/schema#", vo = "http://json-schema.org/draft-07/schema#", bo = "Core schema meta-schema", wo = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, _o = ["object", "boolean"], $o = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, So = {
  $schema: yo,
  $id: vo,
  title: bo,
  definitions: wo,
  type: _o,
  properties: $o,
  default: !0
};
var On;
function Po() {
  return On || (On = 1, (function(o, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Oi(), r = po(), n = go(), i = So, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((S) => this.addVocabulary(S)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const S = this.opts.$data ? this.$dataMetaSchema(i, s) : i;
        this.addMetaSchema(S, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = c, o.exports = e = c, o.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
    var u = Lt();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var d = Y();
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
    var y = or();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return y.default;
    } });
    var $ = Ft();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return $.default;
    } });
  })(Ye, Ye.exports)), Ye.exports;
}
var Eo = Po();
const Mo = /* @__PURE__ */ gi(Eo), To = "http://json-schema.org/draft-07/schema#", ko = "JMON Composition (Multi-Track, Extended)", Ao = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values use numeric format in quarter notes (e.g., 4.5) for MIDI compatibility and algorithmic processing. The bars:beats:ticks format is available for display and conversion purposes only.", No = "object", Ro = ["format", "version", "tempo", "tracks"], Co = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"tempo":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute (BPM)."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 8.0 for beat 1 of bar 3 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '2:0:0')."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","tempo"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 16.0 for beat 1 of bar 5 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '4:0:0')."}],"description":"The time point for the tempo change."},"tempo":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"number","description":"Offset in quarter notes for when playback should start (e.g., 2.0 for beat 3)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0')."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"oneOf":[{"type":"number","description":"End time in quarter notes where the global loop should end (e.g., 32.0 for bar 9 in 4/4)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '8:0:0')."}],"description":"Where the global loop should end."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"title":{"type":"string","description":"Title of the composition."},"composer":{"type":"string","description":"Composer of the music."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 4.5 for beat 1.5 of bar 2 in 4/4). Primary format for MIDI compatibility."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0', '1:3.5:240')."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), jo = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, Oo = !1, Io = {
  $schema: To,
  title: ko,
  description: Ao,
  type: No,
  required: Ro,
  properties: Co,
  definitions: jo,
  additionalProperties: Oo
};
function qo(o) {
  const e = typeof o == "string" ? parseInt(o, 10) : o;
  if (!Number.isFinite(e)) return String(o);
  const r = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(e % 12 + 12) % 12], n = Math.floor(e / 12) - 1;
  return `${r}${n}`;
}
function Gn(o) {
  return !o || !Array.isArray(o.audioGraph) || o.audioGraph.forEach((e) => {
    try {
      if (!e || e.type !== "Sampler") return;
      const t = e.options || {}, r = t.urls;
      if (!r || typeof r != "object") return;
      const n = {};
      Object.keys(r).forEach((i) => {
        const s = String(i);
        let a = s;
        /^\d+$/.test(s) && (a = qo(parseInt(s, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), o;
}
class cr {
  constructor(e = Io) {
    this.ajv = new Mo({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e));
    Gn(t);
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
class fe {
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
    const [, r, n] = t, i = this.convertFlatToSharp(r), s = this.chromatic_scale.indexOf(i);
    if (s === -1)
      throw new Error(`Invalid note name: ${r}`);
    return s + (parseInt(n) + 1) * 12;
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
class Bn {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = fe.convertFlatToSharp(e);
    if (!fe.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${fe.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(fe.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(fe.scale_intervals).join(", ")}'.`);
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
    const t = fe.scale_intervals[this.mode];
    if (!t)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof e.start == "string" && (e.start = fe.noteNameToMidi(e.start)), typeof e.end == "string" && (e.end = fe.noteNameToMidi(e.end));
    const r = e.start ?? 60;
    if (fe.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const i = (a, c) => {
      const u = c % t.length, d = Math.floor(c / t.length) * 12, y = t[u];
      return a + y + d;
    }, s = [];
    if (e.end !== void 0)
      for (let a = 0; ; a++) {
        const c = i(r, a);
        if (c > e.end) break;
        s.push(c);
      }
    else if (e.length)
      for (let a = 0; a < e.length; a++)
        s.push(i(r, a));
    else
      return t.map((a) => r + a);
    return s;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const e = fe.scale_intervals[this.mode];
    if (!e) return [];
    const t = fe.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const n = (t + r) % 12;
      return fe.chromatic_scale[n];
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
function xo(o) {
  if (typeof o == "object" && !Array.isArray(o))
    return o;
  if (Array.isArray(o)) {
    if (o.length === 0)
      return {};
    if (o.every((t) => Array.isArray(t) && t.length === 3))
      return { "track 1": o };
    const e = {};
    return o.forEach((t, r) => {
      e[`track ${r + 1}`] = t;
    }), e;
  }
  throw new Error("Input must be a list or dict of tracks.");
}
function Un(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function Kn(o) {
  return Math.floor(o / 12) - 1;
}
function Do(o) {
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
  }[o] || o;
}
function ir(o, e, t) {
  typeof o == "string" && (o = Ue(o)), typeof t == "string" && (t = Ue(t));
  const r = e.indexOf(t);
  if (e.includes(o))
    return e.indexOf(o) - r;
  {
    const n = Un(o, e), i = e.indexOf(n), s = i > 0 ? i - 1 : i, a = e[s], c = n - o, u = o - a, d = c + u;
    if (d === 0) return i - r;
    const y = 1 - c / d, $ = 1 - u / d, w = i - r, S = s - r;
    return w * y + S * $;
  }
}
function zo(o, e, t) {
  const r = e.indexOf(t), n = Math.round(r + o);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), s = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], c = e[s], u = s - n, d = n - i, y = u + d;
    if (y === 0)
      return (c + a) / 2;
    const $ = 1 - u / y, w = 1 - d / y;
    return c * $ + a * w;
  }
}
function Jn(o) {
  o.length > 0 && o[0].length === 2 && (o = o.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of o)
    e.push([r, n, t]), t += n;
  return e;
}
function Hn(o, e = 0) {
  const t = [...o].sort((i, s) => i[2] - s[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [s, a, c] = i, u = e + c;
    if (u > r) {
      const y = [null, u - r, r - e];
      n.push(y);
    }
    n.push(i), r = Math.max(r, u + a);
  }
  return n;
}
function Wn(o) {
  o.sort((e, t) => e[2] - t[2]);
  for (let e = 0; e < o.length - 1; e++) {
    const t = o[e], r = o[e + 1];
    if (t[2] + t[1] > r[2]) {
      const i = r[2] - t[2];
      o[e] = [t[0], i, t[2]];
    }
  }
  return o;
}
function Vo(o) {
  return Wn(Hn(o));
}
function Ue(o) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B"
  };
  let r = 4, n = o;
  if (o.includes("b")) {
    const a = o.slice(0, -1);
    t[a] && (n = t[a] + o.slice(-1));
  }
  let i;
  return n.length > 2 || n.length === 2 && !isNaN(n[1]) ? (i = n.slice(0, -1), r = parseInt(n.slice(-1))) : i = n[0], 12 * (r + 1) + e.indexOf(i);
}
function Lo(o) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(o / 12) - 1, r = o % 12;
  return e[r] + t.toString();
}
function Fo(o, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, s] of o)
    t.push([n, i, r]), r += i;
  return t;
}
function Go(o) {
  return o.every((e) => Array.isArray(e)) ? "list of tuples" : o.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function Bo(o, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...o), s = n !== null ? n : Math.max(...o);
  return i === s ? new Array(o.length).fill((e + t) / 2) : o.map(
    (a) => (a - i) * (t - e) / (s - i) + e
  );
}
function Yn(o, e) {
  return o.map(([t, r, n]) => [t, r, n + e]);
}
function Uo(o, e, t) {
  const r = [];
  for (const [n, i, s] of o) {
    const a = Math.round(s / t) * t, c = (Math.floor(a / e) + 1) * e;
    let u = Math.round(i / t) * t;
    u = Math.min(u, c - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function Ko(o, e) {
  const r = o.filter(([a, , c]) => a !== null && c !== null).sort((a, c) => a[2] - c[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, s = [];
  for (let a = 0; a < i; a++) {
    const c = a * e;
    let u = null, d = 1 / 0;
    for (const [y, , $] of r) {
      const w = c - $;
      if (w >= 0 && w < d && (d = w, u = y), $ > c) break;
    }
    u !== null && s.push(u);
  }
  return s;
}
function Jo(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function Ho(o, e) {
  return 60 / e * o;
}
function* Wo(o = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * o, [o, e] = [e, o + e];
}
function Yo(o, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(o)) {
    const s = [];
    for (let a = 0; a < e; a++) {
      const c = a * t, u = Yn(i, c);
      s.push(...u);
    }
    r[n] = s;
  }
  return r;
}
const Qo = {
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
}, Xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: Wn,
  cdeToMidi: Ue,
  checkInput: Go,
  fibonacci: Wo,
  fillGapsWithRests: Hn,
  findClosestPitchAtMeasureStart: Ko,
  getDegreeFromPitch: ir,
  getOctave: Kn,
  getPitchFromDegree: zo,
  getSharp: Do,
  instrumentMapping: Qo,
  midiToCde: Lo,
  noOverlap: Fo,
  offsetTrack: Yn,
  qlToSeconds: Ho,
  quantizeNotes: Uo,
  repairNotes: Vo,
  repeatPolyloops: Yo,
  roundToList: Un,
  scaleList: Bo,
  setOffsetsAccordingToDurations: Jn,
  tracksToDict: xo,
  tune: Jo
}, Symbol.toStringTag, { value: "Module" }));
class Zo extends fe {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = Ue(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
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
    }[t] || [0, 4, 7]).map((s) => e + s).map((s) => s > 127 ? s - 12 : s);
  }
  /**
   * Generate a musical progression
   * @param {number} length - The length of the progression in number of chords (default: 4)
   * @param {number} seed - The seed value for the random number generator
   * @returns {Array} Array of chord arrays representing the progression
   */
  generate(e = 4, t = null) {
    t !== null && (Math.seedrandom = t);
    const { major: r, minor: n, diminished: i } = this.computeCircle(), s = [r, n, i], a = ["major", "minor", "diminished"], c = [];
    for (let u = 0; u < e; u++) {
      const d = this.weightedRandomChoice(this.weights);
      if (s[d].length > 0) {
        const y = s[d][Math.floor(Math.random() * s[d].length)], $ = a[d], w = Array.isArray(y) ? y[0] : y, S = this.generateChord(w, $);
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
class es extends fe {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new Bn(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = Kn(e), r = this.tonic + t.toString(), n = Ue(r), i = this.scale.map((c) => ir(c, this.scale, n)), s = Math.round(ir(e, this.scale, n)), a = [];
    for (const c of this.degrees) {
      const u = s + c, d = i.indexOf(u);
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
      let s = 0, a = 0;
      n = e.map((c) => {
        const u = t[s % t.length], d = [c, u, a];
        return a += u, s++, d;
      });
    }
    const i = n.map(([s, a, c]) => [this.pitchToChord(s), a, c]);
    if (r) {
      const s = [];
      for (const [a, c, u] of i) {
        const d = c / a.length;
        a.forEach((y, $) => {
          s.push([y, d, u + $ * d]);
        });
      }
      return s;
    } else
      return i;
  }
}
const In = {
  grace_note: {
    requiredParams: ["graceNoteType"],
    optionalParams: ["gracePitches"],
    conflicts: [],
    description: "Single note before the main note",
    defaultParams: {
      graceNoteType: "acciaccatura"
    },
    validate: (o, e) => ["acciaccatura", "appoggiatura"].includes(e.graceNoteType) ? e.gracePitches && !Array.isArray(e.gracePitches) ? { valid: !1, error: "gracePitches must be an array of pitches" } : { valid: !0 } : { valid: !1, error: "graceNoteType must be either acciaccatura or appoggiatura" }
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
    validate: (o, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "trill step (by) must be a number" } : e.trillRate && typeof e.trillRate != "number" ? { valid: !1, error: "trillRate must be a number" } : { valid: !0 }
  },
  mordent: {
    requiredParams: [],
    optionalParams: ["by"],
    conflicts: ["trill"],
    description: "Quick alternation with note above or below",
    defaultParams: {
      by: 1
    },
    validate: (o, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "mordent step (by) must be a number" } : { valid: !0 }
  },
  turn: {
    requiredParams: [],
    optionalParams: ["scale"],
    conflicts: [],
    description: "Melodic turn around the main note",
    validate: (o, e) => e.scale && typeof e.scale != "string" ? { valid: !1, error: "scale must be a string" } : { valid: !0 }
  },
  arpeggio: {
    requiredParams: ["arpeggioDegrees"],
    optionalParams: ["direction"],
    conflicts: [],
    description: "Notes played in sequence",
    defaultParams: {
      direction: "up"
    },
    validate: (o, e) => Array.isArray(e.arpeggioDegrees) ? e.direction && !["up", "down", "both"].includes(e.direction) ? { valid: !1, error: "direction must be up, down, or both" } : { valid: !0 } : { valid: !1, error: "arpeggioDegrees must be an array" }
  }
};
class lr {
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
    }, i = In[t];
    if (!i)
      return n.errors.push(`Unknown ornament type: ${t}`), n;
    if (i.requiredParams) {
      for (const s of i.requiredParams)
        if (!(s in r))
          return n.errors.push(`Missing required parameter '${s}' for ${t}`), n;
    }
    if (i.minDuration && n.warnings.push(`Duration check not implemented for ${t}`), e.ornaments && i.conflicts) {
      const s = e.ornaments.filter((a) => i.conflicts.includes(a.type)).map((a) => a.type);
      if (s.length > 0)
        return n.errors.push(`${t} conflicts with existing ornaments: ${s.join(", ")}`), n;
    }
    if (i.validate) {
      const s = i.validate(e, r);
      if (!s.valid)
        return n.errors.push(s.error), n;
    }
    return n.valid = !0, n;
  }
  /**
   * Create a new ornament instance with validation
   * @param {Object} options - Ornament configuration
   */
  constructor(e) {
    const t = In[e.type];
    if (!t)
      throw new Error(`Unknown ornament type: ${e.type}`);
    this.type = e.type, this.params = {
      ...t.defaultParams,
      ...e.parameters
    }, e.tonic && e.mode ? (this.tonicIndex = fe.chromatic_scale.indexOf(e.tonic), this.scale = this.generateScale(e.tonic, e.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(e, t) {
    const r = fe.scale_intervals[t], n = fe.chromatic_scale.indexOf(e), i = r.map((a) => (n + a) % 12), s = [];
    for (let a = -1; a < 10; a++)
      for (const c of i) {
        const u = 12 * a + c;
        u >= 0 && u <= 127 && s.push(u);
      }
    return s;
  }
  /**
   * Apply the ornament to notes
   */
  apply(e, t = null) {
    if (!Array.isArray(e) || e.length === 0 || (t === null && (t = Math.floor(Math.random() * e.length)), t < 0 || t >= e.length))
      return e;
    const r = e[t], n = lr.validateOrnament(r, this.type, this.params);
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
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = this.params.gracePitches ? this.params.gracePitches[Math.floor(Math.random() * this.params.gracePitches.length)] : n + 1;
    if (this.params.graceNoteType === "acciaccatura") {
      const c = i * 0.125, u = { pitch: n, duration: i, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        u,
        ...e.slice(t + 1)
      ];
    } else {
      const c = i / 2, u = { pitch: n, duration: c, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        u,
        ...e.slice(t + 1)
      ];
    }
  }
  /**
   * Add a trill
   */
  addTrill(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = [];
    let c = s;
    const u = this.params.by || 1, d = this.params.trillRate || 0.125;
    let y;
    if (this.scale && this.scale.includes(n)) {
      const w = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      y = this.scale[w];
    } else
      y = n + u;
    for (; c < s + i; ) {
      const $ = s + i - c, w = Math.min(d, $ / 2);
      if ($ >= w * 2)
        a.push({ pitch: n, duration: w, time: c }), a.push({ pitch: y, duration: w, time: c + w }), c += 2 * w;
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
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = this.params.by || 1;
    let c;
    if (this.scale && this.scale.includes(n)) {
      const $ = this.scale.indexOf(n) + Math.round(a);
      c = this.scale[$] || n + a;
    } else
      c = n + a;
    const u = i / 3, d = [
      { pitch: n, duration: u, time: s },
      { pitch: c, duration: u, time: s + u },
      { pitch: n, duration: u, time: s + 2 * u }
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
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = i / 4;
    let c, u;
    if (this.scale && this.scale.includes(n)) {
      const y = this.scale.indexOf(n);
      c = this.scale[y + 1] || n + 2, u = this.scale[y - 1] || n - 2;
    } else
      c = n + 2, u = n - 2;
    const d = [
      { pitch: n, duration: a, time: s },
      { pitch: c, duration: a, time: s + a },
      { pitch: n, duration: a, time: s + 2 * a },
      { pitch: u, duration: a, time: s + 3 * a }
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
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, { arpeggioDegrees: a, direction: c = "up" } = this.params;
    if (!a || !Array.isArray(a))
      return e;
    const u = [];
    if (this.scale && this.scale.includes(n)) {
      const $ = this.scale.indexOf(n);
      u.push(...a.map((w) => this.scale[$ + w] || n + w));
    } else
      u.push(...a.map(($) => n + $));
    c === "down" && u.reverse(), c === "both" && u.push(...u.slice(0, -1).reverse());
    const d = i / u.length, y = u.map(($, w) => ({
      pitch: $,
      duration: d,
      time: s + w * d
    }));
    return [
      ...e.slice(0, t),
      ...y,
      ...e.slice(t + 1)
    ];
  }
}
const tr = {
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
class Gt {
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
    const s = tr[t];
    if (!s)
      return i.errors.push(`Unknown articulation type: ${t}`), i;
    const a = e[r];
    return !a || typeof a != "object" ? (i.errors.push(`Invalid note at index ${r}`), i) : s.complex ? this._addComplexArticulation(a, t, s, n, i) : (a.articulation = t, i.success = !0, i);
  }
  /**
   * Add complex articulation with parameter validation and synchronization
   */
  static _addComplexArticulation(e, t, r, n, i) {
    if (r.requiredParams) {
      for (const s of r.requiredParams)
        if (!(s in n))
          return i.errors.push(`Missing required parameter '${s}' for ${t}`), i;
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
      (s) => !(s.type === "pitch" && s.subtype === t)
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
      (s) => !(s.type === "amplitude" && (s.subtype === "crescendo" || s.subtype === "diminuendo"))
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
      const i = tr[n];
      i && i.complex && (r.modulations = r.modulations.filter((s) => s.subtype !== n), r.modulations.length === 0 && delete r.modulations);
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
    return Object.entries(tr).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function Qn(o, e, t, r) {
  return Gt.addArticulation(o, e, t, r);
}
function Xn(o, e) {
  return Gt.removeArticulation(o, e);
}
function ts(o) {
  return Gt.validateSequence(o);
}
const rs = Qn, ns = Xn, is = {
  Scale: Bn,
  Progression: Zo,
  Voice: es,
  Ornament: lr,
  Articulation: Gt,
  addArticulation: Qn,
  addOrnament: rs,
  // Include the alias
  removeArticulation: Xn,
  removeOrnament: ns,
  // Include the alias
  validateArticulations: ts
};
class os {
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
    let i = 0, s = 0;
    for (; i < this.measureLength && s < r; ) {
      const a = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (i + a > this.measureLength) {
        s++;
        continue;
      }
      if (Math.random() < t) {
        s++;
        continue;
      }
      n.push([a, i]), i += a, s++;
    }
    return s >= r && console.warn("Max iterations reached. The sum of the durations may not equal the measure length."), n;
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
    return new ss(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class ss {
  constructor(e, t, r, n, i, s) {
    e !== null && (Math.seedrandom = e), this.populationSize = t, this.measureLength = r, this.maxGenerations = n, this.mutationRate = i, this.durations = s, this.population = this.initializePopulation();
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
      const t = Math.floor(Math.random() * (e.length - 1)), [r, n] = e[t], s = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - n, a = this.durations.filter((c) => c <= s);
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
        const i = this.selectParent(), s = this.selectParent();
        let a = this.crossover(i, s);
        a = this.mutate(a), a.sort((c, u) => c[1] - u[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function Ee(o, e = 4, t = 480) {
  const r = Math.floor(o / e), n = o - r * e, i = Math.floor(n), s = n - i, a = Math.round(s * t);
  return `${r}:${i}:${a}`;
}
function De(o, e = 4, t = 480) {
  if (typeof o == "number") return o;
  if (typeof o != "string") return 0;
  const r = o.split(":").map((a) => parseFloat(a || "0")), [n = 0, i = 0, s = 0] = r;
  return n * e + i + s / t;
}
function Zn(o, e = "Untitled Part", t = {}) {
  const r = ur(o);
  return {
    name: e,
    notes: r,
    ...t
  };
}
function as(o, e = {}) {
  const t = o.map((n, i) => Array.isArray(n) ? Zn(n, `Track ${i + 1}`) : n.name && n.notes ? {
    ...n,
    notes: ur(n.notes)
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
function ur(o) {
  return Array.isArray(o) ? o.map((e, t) => {
    if (Array.isArray(e)) {
      const [r, n, i = 0] = e;
      return {
        pitch: r,
        duration: n,
        time: Ee(i)
      };
    }
    if (typeof e == "object" && e !== null) {
      const { pitch: r, duration: n } = e;
      let i = "0:0:0";
      return typeof e.time == "string" ? i = e.time : typeof e.time == "number" ? i = Ee(e.time) : typeof e.offset == "number" && (i = Ee(e.offset)), {
        pitch: r,
        duration: n,
        time: i,
        // Preserve other properties
        ...Object.fromEntries(
          Object.entries(e).filter(
            ([s]) => !["time", "offset"].includes(s)
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
function cs(o) {
  return o.map(([e, t, r = 0]) => ({
    pitch: e,
    duration: t,
    time: Ee(r)
  }));
}
function ls(o) {
  return o.map((e) => [
    e.pitch,
    e.duration,
    De(e.time)
  ]);
}
function us(o, e = 1, t = 0) {
  let r = t;
  return o.map((n) => {
    const i = {
      pitch: n,
      duration: e,
      time: Ee(r)
    };
    return r += e, i;
  });
}
function ei(o, e) {
  return o.map((t) => ({
    ...t,
    time: Ee(De(t.time) + e)
  }));
}
function ds(o) {
  if (o.length === 0) return [];
  const e = [];
  let t = 0;
  for (const r of o) {
    const n = ei(r, t);
    e.push(...n);
    const i = n.map(
      (s) => De(s.time) + s.duration
    );
    t = Math.max(...i, t);
  }
  return e;
}
function hs(o) {
  return o.flat();
}
function fs(o) {
  if (o.length === 0) return { start: 0, end: 0, duration: 0 };
  const e = o.map((i) => De(i.time)), t = o.map((i) => De(i.time) + i.duration), r = Math.min(...e), n = Math.max(...t);
  return {
    start: r,
    end: n,
    duration: n - r,
    startTime: Ee(r),
    endTime: Ee(n)
  };
}
const ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: Ee,
  combineSequences: hs,
  concatenateSequences: ds,
  createComposition: as,
  createPart: Zn,
  createScale: us,
  getTimingInfo: fs,
  jmonToTuples: ls,
  normalizeNotes: ur,
  offsetNotes: ei,
  timeToBeats: De,
  tuplesToJmon: cs
}, Symbol.toStringTag, { value: "Module" }));
function ms(o, e, t = {}) {
  const r = o.map((u) => Array.isArray(u) || typeof u == "object" && u.length ? u[0] : u), n = gs(r.length, e.length), i = [], s = [];
  for (let u = 0; u < n; u++)
    i.push(r[u % r.length]), s.push(e[u % e.length]);
  const a = i.map((u, d) => [u, s[d], 1]), c = Jn(a);
  return t.legacy ? c : c.map(([u, d, y]) => ({
    pitch: u,
    duration: d,
    time: t.useStringTime ? Ee(y) : y
  }));
}
function gs(o, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(o * e) / t(o, e);
}
function ys(o, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of o) {
    const s = e[n % e.length];
    t.push([i, s, r]), r += s, n++;
  }
  return t;
}
const vs = {
  Rhythm: os,
  isorhythm: ms,
  beatcycle: ys
};
class bs {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class Pe {
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
    return new Pe(e, t);
  }
  static from2DArray(e) {
    return new Pe(e);
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
    return new Pe(e);
  }
  clone() {
    return new Pe(this.data);
  }
  toArray() {
    return this.data.map((e) => [...e]);
  }
}
function rr(o) {
  return Array.isArray(o[0]) ? Pe.from2DArray(o) : Pe.from2DArray([o]);
}
function ti(o) {
  if (o.rows !== o.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = o.rows, t = Pe.zeros(e, e);
  for (let r = 0; r < e; r++)
    for (let n = 0; n <= r; n++)
      if (r === n) {
        let i = 0;
        for (let a = 0; a < n; a++)
          i += t.get(n, a) * t.get(n, a);
        const s = o.get(n, n) - i;
        if (s <= 0)
          throw new Error(`Matrix is not positive definite at position (${n}, ${n})`);
        t.set(n, n, Math.sqrt(s));
      } else {
        let i = 0;
        for (let s = 0; s < n; s++)
          i += t.get(r, s) * t.get(n, s);
        t.set(r, n, (o.get(r, n) - i) / t.get(n, n));
      }
  return t;
}
class ws {
  constructor(e = {}) {
    this.params = { ...e };
  }
  call(e, t) {
    const r = t || e, n = Pe.zeros(e.rows, r.rows);
    for (let i = 0; i < e.rows; i++)
      for (let s = 0; s < r.rows; s++)
        n.set(i, s, this.compute(e.getRow(i), r.getRow(s)));
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
class ri {
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
    this.XTrain = rr(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = ti(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = rr(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      i[a] = 0;
      for (let c = 0; c < this.XTrain.rows; c++)
        i[a] += n.get(c, a) * this.alphaVector[c];
    }
    const s = { mean: i };
    if (t) {
      const a = this.computeStd(r, n);
      s.std = a;
    }
    return s;
  }
  sampleY(e, t = 1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before sampling");
    const r = rr(e), n = this.predict(e, !0);
    if (!n.std)
      throw new Error("Standard deviation computation failed");
    const i = [];
    for (let s = 0; s < t; s++) {
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
      const i = this.kernel.compute(e.getRow(n), e.getRow(n)), s = t.getColumn(n), a = this.forwardSubstitution(this.L, s);
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
      for (let s = 0; s < i; s++)
        n[i] -= e.get(i, s) * n[s];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  backSubstitution(e, t) {
    const r = e.rows, n = new Array(r);
    for (let i = r - 1; i >= 0; i--) {
      n[i] = t[i];
      for (let s = i + 1; s < r; s++)
        n[i] -= e.get(s, i) * n[s];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  sampleStandardNormal() {
    const e = Math.random(), t = Math.random();
    return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * t);
  }
}
class qn extends ws {
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
function _s(o = 0, e = 1) {
  const t = Math.random(), r = Math.random(), n = Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * r);
  return o + e * n;
}
function $s(o, e) {
  const t = o.length, r = ti(e), n = Array.from({ length: t }, () => _s()), i = new Array(t);
  for (let s = 0; s < t; s++) {
    i[s] = o[s];
    for (let a = 0; a <= s; a++)
      i[s] += r.get(s, a) * n[a];
  }
  return i;
}
const Me = {
  timeSignature: [4, 4],
  // 4/4 time
  ticksPerQuarterNote: 480,
  // Standard MIDI resolution
  beatsPerBar: 4
  // Derived from time signature
};
function Ve(o, e = Me) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = n * 4 / i, a = Math.floor(o / s), c = o % s, u = Math.floor(c), d = c - u, y = Math.round(d * r);
  return `${a}:${u}:${y}`;
}
function dr(o, e = Me) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = o.split(":");
  if (s.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${o}`);
  const a = parseInt(s[0], 10), c = parseFloat(s[1]), u = parseInt(s[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(u))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${o}`);
  const d = n * 4 / i;
  return a * d + c + u / r;
}
function Ss(o, e = Me, t = !0) {
  return o.map((r) => {
    const n = { ...r };
    if (r.offset !== void 0 && (n.time = r.offset, delete n.offset), typeof r.time == "string" && r.time.includes(":") && (n.time = dr(r.time, e)), typeof r.duration == "number" && !t) {
      const i = r.duration;
      i === 1 ? n.duration = "4n" : i === 0.5 ? n.duration = "8n" : i === 0.25 ? n.duration = "16n" : i === 2 ? n.duration = "2n" : i === 4 && (n.duration = "1n");
    }
    return n;
  });
}
function Je(o, e = {}) {
  const {
    label: t = "track",
    midiChannel: r = 0,
    synth: n = { type: "Synth" },
    timingConfig: i = Me,
    keepNumericDuration: s = !0
    // Default to numeric for MIDI consistency
  } = e, a = Ss(o, i, s);
  return {
    label: t,
    midiChannel: r,
    synth: n,
    notes: a
  };
}
class Ps {
  data;
  lengthScale;
  amplitude;
  noiseLevel;
  walkAround;
  timingConfig;
  isFitted;
  gpr;
  constructor(e = [], t = 1, r = 1, n = 0.1, i = !1, s = Me) {
    this.data = [...e], this.lengthScale = t, this.amplitude = r, this.noiseLevel = n, this.walkAround = i, this.timingConfig = s, this.isFitted = !1, this.gpr = null;
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
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, s = e.noiseLevel || this.noiseLevel;
    e.useStringTime;
    const a = [];
    for (let c = 0; c < r; c++) {
      const u = Array.from({ length: t }, (m, h) => [h]), d = new Pe(u), $ = new qn(n, i).call(d);
      for (let m = 0; m < $.rows; m++)
        $.set(m, m, $.get(m, m) + s);
      let w = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && (w = new Array(t).fill(this.walkAround));
      const S = $s(w, $);
      a.push(S);
    }
    return r === 1 ? a[0] : a;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, s = this.data.map((m) => [m[0]]), a = this.data.map((m) => m[1]), c = new qn(n, i);
    this.gpr = new ri(c);
    try {
      this.gpr.fit(s, a), this.isFitted = !0;
    } catch (m) {
      throw new Error(`Failed to fit Gaussian Process: ${m.message}`);
    }
    const u = Math.min(...this.data.map((m) => m[0])), y = (Math.max(...this.data.map((m) => m[0])) - u) / (t - 1), $ = Array.from({ length: t }, (m, h) => [u + h * y]), w = this.gpr.sampleY($, r), S = $.map((m) => m[0]);
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
      mapToScale: s = null,
      scaleRange: a = [60, 72],
      quantize: c = !1
    } = n, u = [];
    let d = 0;
    const y = Array.isArray(e[0]) ? e : [e], $ = r || Array.from({ length: y[0].length }, (w, S) => S);
    for (let w = 0; w < y[0].length; w++) {
      const S = t[w % t.length], m = r ? $[w] : d, h = y.map((l) => {
        let f = l[w];
        if (s) {
          const g = Math.min(...l), b = Math.max(...l) - g || 1, P = (f - g) / b, k = Math.floor(P * s.length), I = Math.max(0, Math.min(k, s.length - 1));
          f = s[I];
        } else {
          const g = Math.min(...l), b = Math.max(...l) - g || 1, P = (f - g) / b;
          f = a[0] + P * (a[1] - a[0]);
        }
        return c && (f = Math.round(f)), f;
      }), p = h.length === 1 ? h[0] : h;
      u.push({
        pitch: p,
        duration: S,
        time: i ? Ve(m, this.timingConfig) : m
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
      const [s, a] = r;
      i = this.toJmonNotes(a, n, s, e);
    } else
      i = this.toJmonNotes(r, n, null, e);
    return Je(i, {
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
class Es {
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
      const r = this.state[(t - 1 + this.width) % this.width], n = this.state[t], i = this.state[(t + 1) % this.width], s = `${r}${n}${i}`;
      e[t] = this.rules[s] || 0;
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
class Dt {
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
      e.forEach((i, s) => {
        const a = i?.label || `Loop ${s + 1}`;
        n[a] = i;
      }), e = n;
    }
    if (typeof e != "object" || Object.keys(e).length === 0)
      throw new Error("Loops must be a non-empty object or array");
    this.loops = {};
    for (const [n, i] of Object.entries(e)) {
      if (!i)
        throw new Error(`Loop data for "${n}" is null or undefined`);
      const s = Array.isArray(i) ? i : i.notes || [];
      if (!Array.isArray(s))
        throw new Error(`Notes for loop "${n}" must be an array`);
      const a = s.map((c, u) => {
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
    const n = [...e].sort((i, s) => i.time - s.time);
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
    return new Dt({ [e.label || "Track"]: e }, t);
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
    const i = this.generateEuclideanRhythm(e, t), s = [], a = 1;
    i.forEach((u, d) => {
      if (u) {
        const y = d * a, $ = r[d % r.length];
        s.push({
          pitch: $,
          duration: a * 0.8,
          time: y,
          velocity: 0.8
        });
      }
    });
    const c = {
      label: n || `Euclidean ${t}/${e}`,
      notes: s,
      synth: {
        type: "Synth",
        options: {
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
        }
      }
    };
    return new Dt({ [c.label]: c }, e);
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
      const [s, a] = r;
      if (s.count <= a.count) {
        const c = s.count, u = a.count - s.count;
        r = [
          { pattern: [...a.pattern, ...s.pattern], count: c }
        ], u > 0 && r.push({ pattern: a.pattern, count: u });
      } else {
        const c = a.count, u = s.count - a.count;
        r = [
          { pattern: [...s.pattern, ...a.pattern], count: c }
        ], u > 0 && r.push({ pattern: s.pattern, count: u });
      }
    }
    const n = r[0], i = [];
    for (let s = 0; s < n.count; s++)
      i.push(...n.pattern);
    return i.map((s) => s === 1);
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
class It {
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
    const e = [...this.sequence].sort((i, s) => i - s), t = e.length;
    let r = 0;
    for (let i = 0; i < t; i++)
      r += (2 * (i + 1) - t - 1) * e[i];
    const n = e.reduce((i, s) => i + s, 0);
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
      for (let s = 0; s <= this.sequence.length - i; s++) {
        const a = this.sequence.slice(s, s + i).join(",");
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
    const n = this.sequence.reduce((i, s) => i + s, 0);
    for (const i of this.sequence) {
      const s = t + i, a = Math.floor(t / e), c = Math.floor(s / e);
      if (a !== c) {
        const u = e - t % e;
        u < i && u > 0 && (r += Math.min(u, i - u));
      }
      t = s;
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
    const e = this.sequence.reduce((s, a) => s + a, 0) / this.sequence.length, t = this.sequence.reduce((s, a) => s + Math.pow(a - e, 2), 0) / this.sequence.length, r = Math.sqrt(t), n = Math.min(...this.sequence), i = Math.max(...this.sequence);
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
    let s = 0, a = 0;
    for (const [c, u] of Object.entries(n)) {
      const d = i[c];
      if (typeof u == "number" && typeof d == "number") {
        const y = Math.max(Math.abs(u), Math.abs(d), 1), $ = 1 - Math.abs(u - d) / y;
        s += $, a++;
      }
    }
    return a === 0 ? 0 : s / a;
  }
}
class Ms {
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
      scale: s = null,
      measureLength: a = 4,
      timeResolution: c = [0.125, 4],
      weights: u = null,
      targets: d = null,
      seed: y = null
    } = e;
    this.initialPhrases = t, this.mutationRate = r, this.populationSize = n, this.scale = s, this.measureLength = a, this.timeResolution = c, y !== null ? (this.seed = y, this.randomState = this.createSeededRandom(y)) : this.randomState = Math;
    const $ = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = $.filter(
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
      const s = this.gaussianSpare;
      return this.gaussianSpare = void 0, e + t * s;
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
    const r = t.reduce((i, s) => i + s, 0);
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
      const a = new It(t);
      i.gini_pitch = a.gini(), i.balance_pitch = a.balance(), i.motif_pitch = a.motif(), this.scale && (i.dissonance_pitch = a.dissonance(this.scale));
    }
    if (r.length > 0) {
      const a = new It(r);
      i.gini_duration = a.gini(), i.balance_duration = a.balance(), i.motif_duration = a.motif(), i.rhythmic = a.rhythmic(this.measureLength);
    }
    if (n.length > 0) {
      const a = new It(n);
      i.gini_offset = a.gini(), i.balance_offset = a.balance(), i.motif_offset = a.motif();
    }
    const s = t.filter((a) => a == null).length / t.length;
    return i.rest = s, i;
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
      const s = this.weights[n];
      for (let a = 0; a < 3; a++) {
        const c = a === 0 ? `${n}_pitch` : a === 1 ? `${n}_duration` : `${n}_offset`, u = t[c] || 0, d = i[a], y = s[a];
        if (y > 0 && d !== void 0) {
          const $ = Math.max(Math.abs(d), 1), w = 1 - Math.abs(u - d) / $;
          r += Math.max(0, w) * y;
        }
      }
    }
    if (this.weights.rest[0] > 0) {
      const n = t.rest || 0, i = this.targets.rest[0], s = 1 - Math.abs(n - i) / Math.max(i, 1);
      r += Math.max(0, s) * this.weights.rest[0];
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
      let [s, a, c] = i;
      this.randomState.random() < t && (s = this.mutationProbabilities.pitch()), this.randomState.random() < t && (a = this.mutationProbabilities.duration()), this.randomState.random() < t && this.mutationProbabilities.rest() === null && (s = null);
      const u = n;
      n += a, r.push([s, a, u]);
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
    const r = Math.min(e.length, t.length), n = Math.floor(this.randomState.random() * r), i = Math.floor(this.randomState.random() * r), [s, a] = [Math.min(n, i), Math.max(n, i)], c = [];
    for (let d = 0; d < s; d++)
      d < e.length && c.push([...e[d]]);
    for (let d = s; d < a; d++)
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
      const i = this.randomState.choice(t), s = this.randomState.choice(t), a = this.crossover([...i], [...s]), c = this.mutate(a);
      n.push(c);
    }
    return this.population = n, this.generationCount++, {
      generation: this.generationCount,
      bestFitness: r,
      averageFitness: t.reduce((i, s) => i + this.fitness(s), 0) / t.length,
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
      const s = this.evolve(t);
      n.push(s), r && r(s, i, e);
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
class Ts {
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
          for (let s = 0; s < this.options.dimensions; s++)
            e[r].position[s] = (e[r].position[s] + e[n].position[s]) / 2, e[r].velocity[s] = (e[r].velocity[s] + e[n].velocity[s]) / 2;
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
      const u = (c - i) / a, d = Math.floor(u * t.length * r), y = Math.floor(d / t.length), $ = d % t.length;
      return 60 + y * 12 + t[$];
    });
  }
  /**
   * Map walk to rhythmic durations
   */
  mapToRhythm(e = 0, t = [0.25, 0.5, 1, 2]) {
    const r = this.getProjection(e);
    if (r.length === 0) return [];
    const n = Math.min(...r), s = Math.max(...r) - n || 1;
    return r.map((a) => {
      const c = (a - n) / s, u = Math.floor(c * t.length), d = Math.max(0, Math.min(u, t.length - 1));
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
    for (let s = 0; s < e.length; s++) {
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, c = t * (e[s] - i);
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
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((u) => Math.pow(u - t, 2)), s = i.reduce((u, d) => u + d, 0) / i.length;
    let a = 0;
    for (let u = 1; u < e.length; u++)
      a += Math.abs(e[u] - e[u - 1]);
    const c = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: n,
      meanSquaredDisplacement: s,
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
      timingConfig: n = Me,
      dimension: i = 0,
      mapToScale: s = null,
      scaleRange: a = [60, 72]
    } = t, c = this.getProjection(i), u = [];
    let d = 0;
    for (let y = 0; y < c.length; y++) {
      const $ = e[y % e.length];
      let w = c[y];
      if (s) {
        const S = Math.min(...c), h = Math.max(...c) - S || 1, p = (w - S) / h, l = Math.floor(p * s.length), f = Math.max(0, Math.min(l, s.length - 1));
        w = s[f];
      } else
        w = this.mapToScale([c], s || [60, 62, 64, 65, 67, 69, 71])[0][y];
      u.push({
        pitch: w,
        duration: $,
        time: r ? Ve(d, n) : d
      }), d += $;
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
    return Je(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
}
class ks {
  walkRange;
  walkStart;
  walkProbability;
  roundTo;
  branchingProbability;
  mergingProbability;
  timingConfig;
  constructor(e = {}) {
    this.walkRange = e.walkRange || null, this.walkStart = e.walkStart !== void 0 ? e.walkStart : this.walkRange ? Math.floor((this.walkRange[1] - this.walkRange[0]) / 2) + this.walkRange[0] : 0, this.walkProbability = e.walkProbability || [-1, 0, 1], this.roundTo = e.roundTo !== void 0 ? e.roundTo : null, this.branchingProbability = e.branchingProbability || 0, this.mergingProbability = e.mergingProbability || 0, this.timingConfig = e.timingConfig || Me;
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
    for (let s = 1; s < e; s++) {
      const a = [...i], c = [];
      for (let u = 0; u < i.length; u++) {
        const d = n[u], y = i[u];
        if (y === null) {
          d && (d[s] = null);
          continue;
        }
        const $ = this.generateStep(r);
        let w = y + $;
        if (isNaN(w) && (w = y), this.walkRange !== null && (w < this.walkRange[0] ? w = this.walkRange[0] : w > this.walkRange[1] && (w = this.walkRange[1])), isNaN(w) && (w = this.walkStart), d && (d[s] = w), a[u] = w, r() < this.branchingProbability) {
          const S = this.createBranch(n[u], s), m = this.generateStep(r);
          let h = y + m;
          isNaN(h) && (h = y), this.walkRange !== null && (h < this.walkRange[0] ? h = this.walkRange[0] : h > this.walkRange[1] && (h = this.walkRange[1])), isNaN(h) && (h = this.walkStart), S[s] = h, c.push(S), a.push(h);
        }
      }
      n.push(...c), i = a, i = this.handleMerging(n, i, s, r);
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
    const s = Math.sqrt(-2 * Math.log(n)) * Math.cos(2 * Math.PI * i), a = e + t * s;
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
    for (let s = 0; s < t.length; s++)
      if (t[s] !== null)
        for (let a = s + 1; a < t.length; a++) {
          if (t[a] === null) continue;
          const c = this.roundTo !== null ? this.roundTo : 1e-3;
          if (Math.abs(t[s] - t[a]) <= c && n() < this.mergingProbability && (i[a] = null, e[a]))
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
    let s = 0, a = 0;
    const c = Math.max(...e.map((u) => u.length));
    for (let u = 0; u < c; u++) {
      const d = e.map((y) => y[u]).filter((y) => y !== null);
      if (d.length > 0) {
        const y = t[a % t.length], $ = d.length === 1 ? d[0] : d;
        i.push({
          pitch: $,
          duration: y,
          time: n ? Ve(s, this.timingConfig) : s
        }), s += y, a++;
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
    return Je(i, {
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
      const i = this.getPosition(n), s = this.getDistanceFromOrigin(n), a = this.getAngleFromOrigin(n);
      r.push({
        time: n,
        position: i,
        distance: s,
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
class hr {
  phasors;
  timingConfig;
  constructor(e = Me) {
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
      const s = r[i], a = this.createMusicalTrack(s, i, t);
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
      useDistance: s = !0,
      useAngle: a = !1,
      quantizeToScale: c = null,
      timingConfig: u = this.timingConfig,
      useStringTime: d = !1
    } = r, y = [];
    for (const $ of e) {
      let w, S;
      if (s) {
        const m = Math.max(0, Math.min(1, $.distance / 10));
        w = n[0] + m * (n[1] - n[0]);
      } else
        w = n[0] + $.angle / 360 * (n[1] - n[0]);
      if (a)
        S = i[0] + $.angle / 360 * (i[1] - i[0]);
      else {
        const m = Math.max(0, Math.min(1, $.distance / 10));
        S = i[1] - m * (i[1] - i[0]);
      }
      if (c) {
        const m = Math.floor((w - n[0]) / (n[1] - n[0]) * c.length), h = Math.max(0, Math.min(m, c.length - 1));
        w = c[h];
      } else
        w = Math.round(w);
      y.push({
        pitch: w,
        duration: S,
        time: d ? Ve($.time, u) : $.time,
        phasorData: {
          distance: $.distance,
          angle: $.angle,
          position: $.position
        }
      });
    }
    return y;
  }
  /**
   * Generate JMON tracks directly from phasor motion
   */
  generateTracks(e, t = {}, r = {}) {
    const n = this.mapToMusic(e, t), i = [];
    return n.forEach((s, a) => {
      const c = Je(s, {
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
    const e = new hr(), t = new xe(0.2, 5, 0), r = new xe(0.3, 3, Math.PI / 2), n = new xe(0.1, 8, Math.PI);
    t.addSubPhasor(n);
    const i = new xe(2, 1, 0, [t, r]), s = new xe(3.5, 0.6, Math.PI / 3);
    return e.addPhasor(i), e.addPhasor(s), e;
  }
  /**
   * Generate time array with linear spacing
   */
  static generateTimeArray(e = 0, t = 10, r = 100) {
    const n = [], i = (t - e) / (r - 1);
    for (let s = 0; s < r; s++)
      n.push(e + s * i);
    return n;
  }
}
class As {
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
        const i = this.xMin + n / this.width * (this.xMax - this.xMin), s = this.yMin + t / this.height * (this.yMax - this.yMin), a = this.mandelbrotIterations({ real: i, imaginary: s });
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
    let i = 0, s = r - 1, a = 0, c = n - 1;
    for (; i <= s && a <= c; ) {
      for (let u = a; u <= c; u++)
        t.push(e[i][u]);
      i++;
      for (let u = i; u <= s; u++)
        t.push(e[u][c]);
      if (c--, i <= s) {
        for (let u = c; u >= a; u--)
          t.push(e[s][u]);
        s--;
      }
      if (a <= c) {
        for (let u = s; u >= i; u--)
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
    for (const s of e)
      s[i] !== void 0 && r.push(s[i]);
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
    const n = Math.min(...e), s = Math.max(...e) - n || 1;
    return e.map((a) => {
      const c = (a - n) / s, u = Math.floor(c * t.length * r), d = Math.floor(u / t.length), y = u % t.length;
      return 60 + d * 12 + t[y];
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
    return e.map((s) => {
      const a = (s - r) / i, c = Math.floor(a * t.length), u = Math.max(0, Math.min(c, t.length - 1));
      return 1 / t[u];
    });
  }
}
class Ns {
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
    const n = [], i = [], s = (t - e) / r;
    for (let a = 0; a < r; a++) {
      const c = e + a * s, u = this.r;
      this.r = c;
      const d = this.generate();
      this.r = u;
      const y = d.slice(-50);
      for (const $ of y)
        n.push(c), i.push($);
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
      const i = Math.floor(n * t.length * r), s = Math.floor(i / t.length), a = i % t.length;
      return 60 + s * 12 + t[a];
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
      for (let s = n; s < Math.min(e.length, n * 3); s++)
        if (Math.abs(e[s] - e[s - n]) > t) {
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
      const s = [...n];
      for (let a = 0; a < e; a++) {
        let c = 0;
        for (let u = 0; u < e; u++)
          u !== a && (c += t * (n[u] - n[a]));
        s[a] = this.r * n[a] * (1 - n[a]) + c, s[a] = Math.max(0, Math.min(1, s[a]));
      }
      if (n.splice(0, e, ...s), i >= this.skipTransient)
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
class Rs {
  operation;
  direction;
  repetition;
  timingConfig;
  sequence = [];
  constructor(e) {
    const { operation: t, direction: r, repetition: n, timingConfig: i = Me } = e;
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
        const i = this.sequence.slice(0, r + 1), s = this.sequence.slice(t - r - 1);
        n = [...i, ...s];
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
        const s = this.sequence.slice(r - i, n + i + 1);
        for (let a = 0; a <= this.repetition; a++)
          e.push(...s);
      }
    } else {
      const r = Math.floor(t / 2);
      for (let n = 0; n <= r; n++) {
        const i = this.sequence.slice(r - n, r + n + 1);
        for (let s = 0; s <= this.repetition; s++)
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
        for (let s = 0; s <= this.repetition; s++)
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
    return Ve(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : dr(e, this.timingConfig);
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
    return e.map(({ pitch: r, duration: n, offset: i, ...s }) => {
      const { time: a, ...c } = s;
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
    return Je(r, {
      timingConfig: this.timingConfig,
      ...t
    });
  }
}
class Cs {
  tChord;
  direction;
  rank;
  isAlternate;
  currentDirection;
  timingConfig;
  constructor(e, t = "down", r = 0, n = Me) {
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
      const s = i.pitch, c = this.tChord.map((S) => S - s).map((S, m) => ({ index: m, value: S })).sort((S, m) => Math.abs(S.value) - Math.abs(m.value));
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
      const { offset: y, time: $, ...w } = i;
      n.push({
        ...w,
        pitch: d,
        time: t ? this.beatsToTime(y) : y
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
    return Ve(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : dr(e, this.timingConfig);
  }
}
class js {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((y, $) => ({ value: y, weight: n[$] })).sort((y, $) => y.value - $.value), s = i.map((y) => y.value), a = i.map((y) => y.weight), c = a.reduce((y, $) => y + $, 0);
    let u = 0, d = 0;
    for (let y = 0; y < r; y++) {
      const $ = a.slice(0, y + 1).reduce((w, S) => w + S, 0);
      u += a[y] * (2 * $ - a[y] - c) * s[y], d += a[y] * s[y] * c;
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
    const r = t || Array(e.length).fill(1), n = e.reduce((s, a, c) => s + a * r[c], 0), i = r.reduce((s, a) => s + a, 0);
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, n = t || Math.floor(r / 2), i = [], s = e.reduce((c, u) => c + u, 0) / r, a = e.reduce((c, u) => c + Math.pow(u - s, 2), 0) / r;
    for (let c = 0; c <= n; c++) {
      let u = 0;
      for (let d = 0; d < r - c; d++)
        u += (e[d] - s) * (e[d + c] - s);
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
    for (let s = 0; s <= e.length - t; s++) {
      const a = e.slice(s, s + t).join(",");
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
      const s = i * t, a = Math.round(s);
      Math.abs(s - a) <= n && r++;
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
        const i = e[n] / e[n - 1], s = Math.abs(i - t);
        r += 1 / (1 + s);
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
    for (let s = 1; s < e.length; s++) {
      const a = e[s] - e[s - 1];
      a > 0 ? t.push(1) : a < 0 ? t.push(-1) : t.push(0);
    }
    const r = { up: 0, down: 0, same: 0 };
    for (const s of t)
      s > 0 ? r.up++ : s < 0 ? r.down++ : r.same++;
    const n = t.length;
    return -[r.up / n, r.down / n, r.same / n].filter((s) => s > 0).reduce((s, a) => s + a * Math.log2(a), 0);
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
    const r = t.reduce((i, s) => i + s, 0) / t.length;
    return t.reduce((i, s) => i + Math.pow(s - r, 2), 0) / t.length;
  }
  /**
   * Calculate note density (notes per unit time)
   * @param {JMonNote[]} notes - Array of notes
   * @param {number} [timeWindow=1] - Time window for density calculation
   * @returns {number} Note density
   */
  static density(e, t = 1) {
    if (e.length === 0) return 0;
    const r = e.map((a) => typeof a.time == "string" ? parseFloat(a.time) || 0 : a.time || 0), n = Math.min(...r), s = Math.max(...r) - n || 1;
    return e.length / (s / t);
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
    const r = t.reduce((i, s) => i + s, 0) / t.length;
    return t.reduce((i, s) => i + Math.pow(s - r, 2), 0) / t.length;
  }
  /**
   * Comprehensive analysis of a musical sequence
   * @param {JMonNote[]} notes - Array of notes to analyze
   * @param {AnalysisOptions} [options={}] - Analysis options
   * @returns {AnalysisResult} Analysis results
   */
  static analyze(e, t = {}) {
    const { scale: r = [0, 2, 4, 5, 7, 9, 11] } = t, n = e.map((s) => typeof s.note == "number" ? s.note : typeof s.note == "string" ? 60 : Array.isArray(s.note) ? s.note[0] : 60), i = e.map((s) => typeof s.time == "number" ? s.time : parseFloat(s.time) || 0);
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
const Os = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: js,
  MusicalIndex: It
}, Symbol.toStringTag, { value: "Module" })), Is = {
  harmony: is,
  rhythm: vs,
  motifs: {
    MotifBank: bs
  }
}, qs = {
  theory: fe
}, xs = {
  gaussian: {
    Regressor: ri,
    Kernel: Ps
  },
  automata: {
    Cellular: Es
  },
  loops: Dt,
  genetic: {
    Darwin: Ms
  },
  walks: {
    Random: Ts,
    Chain: ks,
    Phasor: {
      Vector: xe,
      System: hr
    }
  },
  fractals: {
    Mandelbrot: As,
    LogisticMap: Ns
  },
  minimalism: {
    Process: Rs,
    Tintinnabuli: Cs
  }
}, Ds = {
  ...Os
}, zs = {
  ...Xo
}, Be = {
  theory: Is,
  constants: qs,
  generative: xs,
  analysis: Ds,
  utils: zs
};
class nr {
  constructor(e = {}) {
    this.options = e;
  }
  // Parse bars:beats:ticks -> beats (supports fractional beats)
  static parseBBTToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    const n = e.match(/^(\d+):(\d+(?:\.\d+)?):(\d+)$/);
    if (!n) return 0;
    const i = parseInt(n[1], 10), s = parseFloat(n[2]), a = parseInt(n[3], 10);
    return i * t + s + a / r;
  }
  // Parse note value (e.g., 4n, 8n, 8t) or BBT to beats
  static parseDurationToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    if (/^\d+:\d+(?:\.\d+)?:\d+$/.test(e))
      return this.parseBBTToBeats(e, t, r);
    const n = e.match(/^(\d+)(n|t)$/);
    if (n) {
      const i = parseInt(n[1], 10), s = n[2];
      if (s === "n")
        return 4 / i;
      if (s === "t")
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
function ni(o, e = {}) {
  try {
    Gn(o);
  } catch {
  }
  const n = new nr(e).convert(o).map(($, w) => ({
    originalTrackIndex: w,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: $.label },
    synthConfig: { type: $.type || "PolySynth" },
    partEvents: $.part || []
  })), i = o.tempo || o.metadata?.tempo || o.bpm || 120, [s, a] = (o.timeSignature || "4/4").split("/").map(($) => parseInt($, 10)), c = isFinite(s) ? s : 4;
  let u = 0;
  n.forEach(($) => {
    $.partEvents && $.partEvents.length > 0 && $.partEvents.forEach((w) => {
      const S = nr.parseBBTToBeats(w.time, c), m = nr.parseDurationToBeats(w.duration, c), h = S + m;
      h > u && (u = h);
    });
  });
  const d = 60 / i, y = u * d;
  return console.log(`[TONEJS] Duration calc: totalBeats=${u.toFixed(2)} beats = ${y.toFixed(2)}s - loop ends exactly when last note finishes`), {
    tracks: n,
    metadata: {
      totalDuration: y,
      // Use total duration - loop should end when last note finishes
      tempo: i
    }
  };
}
const ze = {
  // Piano Family
  0: { name: "Acoustic Grand Piano", folder: "acoustic_grand_piano-mp3" },
  1: { name: "Bright Acoustic Piano", folder: "bright_acoustic_piano-mp3" },
  2: { name: "Electric Grand Piano", folder: "electric_grand_piano-mp3" },
  3: { name: "Honky-tonk Piano", folder: "honkytonk_piano-mp3" },
  4: { name: "Electric Piano 1", folder: "electric_piano_1-mp3" },
  5: { name: "Electric Piano 2", folder: "electric_piano_2-mp3" },
  6: { name: "Harpsichord", folder: "harpsichord-mp3" },
  7: { name: "Clavinet", folder: "clavinet-mp3" },
  // Chromatic Percussion
  8: { name: "Celesta", folder: "celesta-mp3" },
  9: { name: "Glockenspiel", folder: "glockenspiel-mp3" },
  10: { name: "Music Box", folder: "music_box-mp3" },
  11: { name: "Vibraphone", folder: "vibraphone-mp3" },
  12: { name: "Marimba", folder: "marimba-mp3" },
  13: { name: "Xylophone", folder: "xylophone-mp3" },
  14: { name: "Tubular Bells", folder: "tubular_bells-mp3" },
  15: { name: "Dulcimer", folder: "dulcimer-mp3" },
  // Organ
  16: { name: "Drawbar Organ", folder: "drawbar_organ-mp3" },
  17: { name: "Percussive Organ", folder: "percussive_organ-mp3" },
  18: { name: "Rock Organ", folder: "rock_organ-mp3" },
  19: { name: "Church Organ", folder: "church_organ-mp3" },
  20: { name: "Reed Organ", folder: "reed_organ-mp3" },
  21: { name: "Accordion", folder: "accordion-mp3" },
  22: { name: "Harmonica", folder: "harmonica-mp3" },
  23: { name: "Tango Accordion", folder: "tango_accordion-mp3" },
  // Guitar
  24: { name: "Acoustic Guitar (nylon)", folder: "acoustic_guitar_nylon-mp3" },
  25: { name: "Acoustic Guitar (steel)", folder: "acoustic_guitar_steel-mp3" },
  26: { name: "Electric Guitar (jazz)", folder: "electric_guitar_jazz-mp3" },
  27: { name: "Electric Guitar (clean)", folder: "electric_guitar_clean-mp3" },
  28: { name: "Electric Guitar (muted)", folder: "electric_guitar_muted-mp3" },
  29: { name: "Overdriven Guitar", folder: "overdriven_guitar-mp3" },
  30: { name: "Distortion Guitar", folder: "distortion_guitar-mp3" },
  31: { name: "Guitar Harmonics", folder: "guitar_harmonics-mp3" },
  // Bass
  32: { name: "Acoustic Bass", folder: "acoustic_bass-mp3" },
  33: { name: "Electric Bass (finger)", folder: "electric_bass_finger-mp3" },
  34: { name: "Electric Bass (pick)", folder: "electric_bass_pick-mp3" },
  35: { name: "Fretless Bass", folder: "fretless_bass-mp3" },
  36: { name: "Slap Bass 1", folder: "slap_bass_1-mp3" },
  37: { name: "Slap Bass 2", folder: "slap_bass_2-mp3" },
  38: { name: "Synth Bass 1", folder: "synth_bass_1-mp3" },
  39: { name: "Synth Bass 2", folder: "synth_bass_2-mp3" },
  // Strings
  40: { name: "Violin", folder: "violin-mp3" },
  41: { name: "Viola", folder: "viola-mp3" },
  42: { name: "Cello", folder: "cello-mp3" },
  43: { name: "Contrabass", folder: "contrabass-mp3" },
  44: { name: "Tremolo Strings", folder: "tremolo_strings-mp3" },
  45: { name: "Pizzicato Strings", folder: "pizzicato_strings-mp3" },
  46: { name: "Orchestral Harp", folder: "orchestral_harp-mp3" },
  47: { name: "Timpani", folder: "timpani-mp3" },
  // Popular selections for common use
  48: { name: "String Ensemble 1", folder: "string_ensemble_1-mp3" },
  49: { name: "String Ensemble 2", folder: "string_ensemble_2-mp3" },
  56: { name: "Trumpet", folder: "trumpet-mp3" },
  57: { name: "Trombone", folder: "trombone-mp3" },
  58: { name: "Tuba", folder: "tuba-mp3" },
  64: { name: "Soprano Sax", folder: "soprano_sax-mp3" },
  65: { name: "Alto Sax", folder: "alto_sax-mp3" },
  66: { name: "Tenor Sax", folder: "tenor_sax-mp3" },
  67: { name: "Baritone Sax", folder: "baritone_sax-mp3" },
  68: { name: "Oboe", folder: "oboe-mp3" },
  69: { name: "English Horn", folder: "english_horn-mp3" },
  70: { name: "Bassoon", folder: "bassoon-mp3" },
  71: { name: "Clarinet", folder: "clarinet-mp3" },
  72: { name: "Piccolo", folder: "piccolo-mp3" },
  73: { name: "Flute", folder: "flute-mp3" },
  74: { name: "Recorder", folder: "recorder-mp3" }
}, fr = [
  "https://raw.githubusercontent.com/jmonlabs/midi-js-soundfonts/gh-pages/FluidR3_GM",
  "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM"
];
function Ke(o, e = fr[0], t = [21, 108], r = "complete") {
  const n = ze[o];
  if (!n)
    return console.warn(
      `GM program ${o} not found, using Acoustic Grand Piano`
    ), Ke(0, e, t);
  const i = {}, [s, a] = t;
  let c = [];
  switch (r) {
    case "minimal":
      for (let u = s; u <= a; u += 12)
        c.push(u);
      c.push(60);
      break;
    case "balanced":
      for (let u = s; u <= a; u += 4)
        c.push(u);
      [60, 64, 67].forEach((u) => {
        u >= s && u <= a && !c.includes(u) && c.push(u);
      });
      break;
    case "quality":
      for (let u = s; u <= a; u += 3)
        c.push(u);
      break;
    case "complete":
      for (let u = s; u <= a; u++)
        c.push(u);
      break;
    default:
      return console.warn(`Unknown sampling strategy '${r}', using 'balanced'`), Ke(o, e, t, "balanced");
  }
  c = [...new Set(c)].sort((u, d) => u - d);
  for (const u of c) {
    const d = Ls(u);
    i[d] = Vs(n.folder, d, e);
  }
  return console.log(
    `[GM INSTRUMENT] Generated ${Object.keys(i).length} sample URLs for ${n.name} (${r} strategy)`
  ), i;
}
function Vs(o, e, t) {
  return `${t}/${o}/${e}.mp3`;
}
function Ls(o) {
  const e = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B"
  ], t = Math.floor(o / 12) - 1, r = o % 12;
  return `${e[r]}${t}`;
}
function ii(o) {
  const e = o.toLowerCase().trim();
  for (const [t, r] of Object.entries(ze))
    if (r.name.toLowerCase() === e)
      return parseInt(t, 10);
  for (const [t, r] of Object.entries(ze)) {
    const n = r.name.toLowerCase();
    if (n.includes(e) || e.includes(n.split(" ")[0]))
      return parseInt(t, 10);
  }
  return null;
}
function Fs(o, e, t = {}, r = "destination") {
  let n;
  if (typeof e == "string") {
    if (n = ii(e), n === null) {
      console.warn(`GM instrument "${e}" not found. Available instruments:`);
      const d = Object.values(ze).map((y) => y.name).slice(0, 10);
      console.warn(`Examples: ${d.join(", ")}...`), console.warn("Using Acoustic Grand Piano as fallback"), n = 0;
    }
  } else
    n = e;
  if (!ze[n]) return null;
  const {
    baseUrl: s = fr[0],
    noteRange: a = [21, 108],
    // Complete MIDI range for maximum quality
    envelope: c = { attack: 0.1, release: 1 },
    strategy: u = "complete"
    // Use complete sampling by default
  } = t;
  return {
    id: o,
    type: "Sampler",
    options: {
      urls: Ke(n, s, a, u),
      baseUrl: "",
      // URLs are already complete
      envelope: {
        enabled: !0,
        attack: c.attack,
        release: c.release
      }
    },
    target: r
  };
}
function oi() {
  return [
    // Piano & Keys
    { program: 0, name: "Acoustic Grand Piano", category: "Piano" },
    { program: 1, name: "Bright Acoustic Piano", category: "Piano" },
    { program: 4, name: "Electric Piano 1", category: "Piano" },
    { program: 6, name: "Harpsichord", category: "Piano" },
    // Strings
    { program: 40, name: "Violin", category: "Strings" },
    { program: 42, name: "Cello", category: "Strings" },
    { program: 48, name: "String Ensemble 1", category: "Strings" },
    // Brass
    { program: 56, name: "Trumpet", category: "Brass" },
    { program: 57, name: "Trombone", category: "Brass" },
    // Woodwinds
    { program: 65, name: "Alto Sax", category: "Woodwinds" },
    { program: 71, name: "Clarinet", category: "Woodwinds" },
    { program: 73, name: "Flute", category: "Woodwinds" },
    // Guitar & Bass
    { program: 24, name: "Acoustic Guitar (nylon)", category: "Guitar" },
    { program: 25, name: "Acoustic Guitar (steel)", category: "Guitar" },
    { program: 33, name: "Electric Bass (finger)", category: "Bass" },
    // Organ & Accordion
    { program: 16, name: "Drawbar Organ", category: "Organ" },
    { program: 21, name: "Accordion", category: "Organ" }
  ];
}
function pr(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error("[PLAYER] Invalid composition:", o), new Error("Composition must be a valid JMON object");
  const {
    autoplay: t = !1,
    showDebug: r = !1,
    customInstruments: n = {},
    autoMultivoice: i = !0,
    maxVoices: s = 4,
    Tone: a = null
  } = e;
  if (!o.sequences && !o.tracks)
    throw console.error("[PLAYER] No sequences or tracks found in composition:", o), new Error("Composition must have sequences or tracks");
  const c = o.tracks || o.sequences || [];
  if (!Array.isArray(c))
    throw console.error("[PLAYER] Tracks/sequences must be an array:", c), new Error("Tracks/sequences must be an array");
  const u = o.tempo || o.bpm || 120, y = ni(o, { autoMultivoice: i, maxVoices: s, showDebug: r }), { tracks: $, metadata: w } = y;
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
  const g = oi(), _ = o.tracks || [], b = [];
  _.forEach((N, j) => {
    const x = $.find((le) => le.originalTrackIndex === j)?.analysis;
    x?.hasGlissando && console.warn(`Track ${N.label || N.name || j + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const V = document.createElement("div");
    V.style.cssText = `
            margin-bottom: 8px;
        `;
    const Q = document.createElement("label");
    Q.textContent = N.label || `Track ${j + 1}`, Q.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${m.text};
            display: block;
            margin-bottom: 8px;
            font-weight: normal;
        `;
    const ee = document.createElement("select");
    ee.style.cssText = `
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
        `;
    const oe = document.createElement("optgroup");
    oe.label = "Synthesizers";
    const ie = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"], ce = o.audioGraph || [];
    if (Array.isArray(ce) && ce.length > 0) {
      const le = o.tracks?.[j]?.synthRef;
      ce.forEach((J) => {
        if (J.id && J.type && J.type !== "Destination") {
          const de = document.createElement("option");
          de.value = `AudioGraph: ${J.id}`, de.textContent = J.id, le === J.id && (de.selected = !0), oe.appendChild(de);
        }
      });
    }
    ie.forEach((le) => {
      const J = document.createElement("option");
      J.value = le, J.textContent = le, (x?.hasGlissando && le === "Synth" || !x?.hasGlissando && !o.tracks?.[j]?.synthRef && le === "PolySynth") && (J.selected = !0), x?.hasGlissando && (le === "PolySynth" || le === "DuoSynth") && (J.disabled = !0, J.textContent += " (mono only for glissando)"), oe.appendChild(J);
    }), ee.appendChild(oe);
    const me = document.createElement("optgroup");
    me.label = "Sampled Instruments";
    const ue = {};
    g.forEach((le) => {
      ue[le.category] || (ue[le.category] = []), ue[le.category].push(le);
    }), Object.keys(ue).sort().forEach((le) => {
      const J = document.createElement("optgroup");
      J.label = le, ue[le].forEach((de) => {
        const X = document.createElement("option");
        X.value = `GM: ${de.name}`, X.textContent = de.name, x?.hasGlissando && (X.disabled = !0, X.textContent += " (not suitable for glissando)"), J.appendChild(X);
      }), ee.appendChild(J);
    }), b.push(ee), V.append(Q, ee), f.appendChild(V);
  }), l.appendChild(f);
  const P = document.createElement("div");
  P.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 35%;
    `;
  const k = document.createElement("div");
  k.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
    `;
  const I = document.createElement("label");
  I.textContent = "Tempo", I.style.cssText = `
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
    `, k.append(I, D), P.appendChild(k);
  const z = document.createElement("div");
  z.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
  const G = document.createElement("div");
  G.textContent = "0:00", G.style.cssText = `
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
  const ne = document.createElement("button");
  ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', ne.style.cssText = `
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
    `, z.append(G, K, B, ne);
  const ve = document.createElement("div");
  ve.style.cssText = `
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
  const be = document.createElement("button");
  be.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', be.style.cssText = `
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
    `, ve.append(re, be), p.append(l, P), h.append(p, z, ye, ve);
  let T, A = !1, q = [], R = [], v = [], E = null;
  const O = o.tracks || [], F = () => {
    if (!T || !o.audioGraph || !Array.isArray(o.audioGraph)) return null;
    const N = {}, j = (x) => {
      const V = {};
      return Object.entries(x || {}).forEach(([Q, ee]) => {
        let oe = Q;
        if (typeof Q == "number" || /^\d+$/.test(String(Q)))
          try {
            oe = T.Frequency(parseInt(Q, 10), "midi").toNote();
          } catch {
          }
        V[oe] = ee;
      }), V;
    };
    try {
      return o.audioGraph.forEach((x) => {
        const { id: V, type: Q, options: ee = {}, target: oe } = x;
        if (!V || !Q) return;
        let ie = null;
        if (Q === "Sampler") {
          const ce = j(ee.urls);
          let me, ue;
          const le = new Promise((de, X) => {
            me = de, ue = X;
          }), J = {
            urls: ce,
            onload: () => me && me(),
            onerror: (de) => {
              console.error(`[PLAYER] Sampler load error for ${V}:`, de), ue && ue(de);
            }
          };
          ee.baseUrl && (J.baseUrl = ee.baseUrl);
          try {
            console.log(`[PLAYER] Building Sampler ${V} with urls:`, ce, "baseUrl:", J.baseUrl || "(none)"), ie = new T.Sampler(J).toDestination();
          } catch (de) {
            console.error("[PLAYER] Failed to create Sampler:", de), ie = null;
          }
          v.push(le), ie && ee.envelope && ee.envelope.enabled && (typeof ee.envelope.attack == "number" && (ie.attack = ee.envelope.attack), typeof ee.envelope.release == "number" && (ie.release = ee.envelope.release));
        } else if ([
          "Synth",
          "PolySynth",
          "MonoSynth",
          "AMSynth",
          "FMSynth",
          "DuoSynth",
          "PluckSynth",
          "NoiseSynth"
        ].includes(Q))
          try {
            ie = new T[Q](ee).toDestination();
          } catch (ce) {
            console.warn(`[PLAYER] Failed to create ${Q} from audioGraph, using PolySynth:`, ce), ie = new T.PolySynth().toDestination();
          }
        else Q === "Destination" && (N[V] = T.Destination);
        ie && (N[V] = ie);
      }), N;
    } catch (x) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", x), null;
    }
  }, L = (N) => `${Math.floor(N / 60)}:${Math.floor(N % 60).toString().padStart(2, "0")}`;
  B.textContent = L(S);
  const Z = async () => {
    if (typeof window < "u") {
      const N = a || window.Tone || (typeof T < "u" ? T : null);
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
                const V = await import("https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js");
                if (window.Tone = V.default || V.Tone || V, !window.Tone || !window.Tone.PolySynth)
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
      const j = window.Tone || N;
      if (j)
        return T = j, console.log("[PLAYER] Available Tone constructors:", {
          PolySynth: typeof T.PolySynth,
          Synth: typeof T.Synth,
          Part: typeof T.Part,
          Transport: typeof T.Transport,
          start: typeof T.start,
          context: !!T.context
        }), console.log("[PLAYER] Tone.js initialized, context state:", T.context ? T.context.state : "no context"), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, H = () => {
    if (!T) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const N = [];
    if (T.PolySynth || N.push("PolySynth"), T.Synth || N.push("Synth"), T.Part || N.push("Part"), T.Transport || N.push("Transport"), N.length > 0) {
      console.error("[PLAYER] Tone.js is missing required constructors:", N), console.error("[PLAYER] Available Tone properties:", Object.keys(T).filter((j) => typeof T[j] == "function").slice(0, 20)), console.error("[PLAYER] Tone object:", T), console.error("[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually.");
      return;
    }
    if (!E && (E = F(), E)) {
      const j = Object.keys(E).filter((x) => E[x] && E[x].name === "Sampler");
      j.length > 0 && console.log("[PLAYER] Using audioGraph Samplers for tracks with synthRef:", j);
    }
    console.log("[PLAYER] Cleaning up existing audio...", { synths: q.length, parts: R.length }), T.Transport.stop(), T.Transport.position = 0, R.forEach((j, x) => {
      try {
        j.stop();
      } catch (V) {
        console.warn(`[PLAYER] Failed to stop part ${x}:`, V);
      }
    }), R.forEach((j, x) => {
      try {
        j.dispose();
      } catch (V) {
        console.warn(`[PLAYER] Failed to dispose part ${x}:`, V);
      }
    }), q.forEach((j, x) => {
      if (!E || !Object.values(E).includes(j))
        try {
          j.disconnect && typeof j.disconnect == "function" && j.disconnect(), j.dispose();
        } catch (V) {
          console.warn(`[PLAYER] Failed to dispose synth ${x}:`, V);
        }
    }), q = [], R = [], console.log("[PLAYER] Audio cleanup completed"), console.log("[PLAYER] Converted tracks:", $.length), $.forEach((j) => {
      const { originalTrackIndex: x, voiceIndex: V, totalVoices: Q, trackInfo: ee, synthConfig: oe, partEvents: ie } = j, me = (O[x] || {}).synthRef, ue = 60 / w.tempo, le = (ie || []).map((X) => {
        const U = typeof X.time == "number" ? X.time * ue : X.time, ae = typeof X.duration == "number" ? X.duration * ue : X.duration;
        return { ...X, time: U, duration: ae };
      });
      let J = null;
      if (me && E && E[me])
        J = E[me];
      else {
        const X = b[x] ? b[x].value : oe.type;
        try {
          if (X.startsWith("AudioGraph: ")) {
            const U = X.substring(12);
            if (E && E[U])
              J = E[U], console.log(`[PLAYER] Using audioGraph instrument: ${U}`);
            else
              throw new Error(`AudioGraph instrument ${U} not found`);
          } else if (X.startsWith("GM: ")) {
            const U = X.substring(4), ae = g.find((he) => he.name === U);
            if (ae) {
              console.log(`[PLAYER] Loading GM instrument: ${U}`);
              const he = Ke(ae.program, fr[0], [36, 84], "balanced");
              console.log(`[PLAYER] Loading GM instrument ${U} with ${Object.keys(he).length} samples`), console.log("[PLAYER] Sample notes:", Object.keys(he).sort()), J = new T.Sampler({
                urls: he,
                onload: () => console.log(`[PLAYER] GM instrument ${U} loaded successfully`),
                onerror: (_e) => {
                  console.error(`[PLAYER] Failed to load GM instrument ${U}:`, _e);
                }
              }).toDestination();
            } else
              throw new Error(`GM instrument ${U} not found`);
          } else {
            const U = oe.reason === "glissando_compatibility" ? oe.type : X;
            if (!T[U] || typeof T[U] != "function")
              throw new Error(`Tone.${U} is not a constructor`);
            J = new T[U]().toDestination(), oe.reason === "glissando_compatibility" && V === 0 && console.warn(`[MULTIVOICE] Using ${U} instead of ${oe.original} for glissando in ${ee.label}`);
          }
        } catch (U) {
          console.warn(`Failed to create ${X}, using PolySynth:`, U);
          try {
            if (!T.PolySynth || typeof T.PolySynth != "function")
              throw new Error("Tone.PolySynth is not available");
            J = new T.PolySynth().toDestination();
          } catch (ae) {
            console.error("Fatal: Cannot create any synth, Tone.js may not be properly loaded:", ae);
            return;
          }
        }
      }
      q.push(J), Q > 1 && console.log(`[MULTIVOICE] Track "${ee.label}" voice ${V + 1}: ${ie.length} notes`);
      const de = new T.Part((X, U) => {
        if (Array.isArray(U.pitch))
          U.pitch.forEach((ae) => {
            let he = "C4";
            typeof ae == "number" ? he = T.Frequency(ae, "midi").toNote() : typeof ae == "string" ? he = ae : Array.isArray(ae) && typeof ae[0] == "string" && (he = ae[0]), J.triggerAttackRelease(he, U.duration, X);
          });
        else if (U.articulation === "glissando" && U.glissTarget !== void 0) {
          let ae = typeof U.pitch == "number" ? T.Frequency(U.pitch, "midi").toNote() : U.pitch, he = typeof U.glissTarget == "number" ? T.Frequency(U.glissTarget, "midi").toNote() : U.glissTarget;
          console.log("[PLAYER] Glissando", { fromNote: ae, toNote: he, duration: U.duration, time: X }), console.log("[PLAYER] Glissando effect starting from", ae, "to", he), J.triggerAttack(ae, X, U.velocity || 0.8);
          const _e = T.Frequency(ae).toFrequency(), yr = T.Frequency(he).toFrequency(), vr = 1200 * Math.log2(yr / _e);
          if (J.detune && J.detune.setValueAtTime && J.detune.linearRampToValueAtTime)
            J.detune.setValueAtTime(0, X), J.detune.linearRampToValueAtTime(vr, X + U.duration), console.log("[PLAYER] Applied detune glissando:", vr, "cents over", U.duration, "beats");
          else {
            const ui = T.Frequency(ae).toMidi(), di = T.Frequency(he).toMidi(), He = Math.max(3, Math.abs(di - ui)), br = U.duration / He;
            for (let We = 1; We < He; We++) {
              const hi = We / (He - 1), fi = _e * Math.pow(yr / _e, hi), pi = T.Frequency(fi).toNote(), mi = X + We * br;
              J.triggerAttackRelease(pi, br * 0.8, mi, (U.velocity || 0.8) * 0.7);
            }
            console.log("[PLAYER] Applied chromatic glissando with", He, "steps");
          }
          J.triggerRelease(X + U.duration);
        } else {
          let ae = "C4";
          typeof U.pitch == "number" ? ae = T.Frequency(U.pitch, "midi").toNote() : typeof U.pitch == "string" ? ae = U.pitch : Array.isArray(U.pitch) && typeof U.pitch[0] == "string" && (ae = U.pitch[0]);
          let he = U.duration, _e = U.velocity || 0.8;
          U.articulation === "staccato" && (he = U.duration * 0.5), U.articulation === "accent" && (_e = Math.min(_e * 2, 1)), U.articulation === "tenuto" && (he = U.duration * 1.5, _e = Math.min(_e * 1.3, 1)), J.triggerAttackRelease(ae, he, X, _e);
        }
      }, le);
      R.push(de);
    }), T.Transport.bpm.value = w.tempo, T.Transport.loopEnd = S, T.Transport.loop = !0, T.Transport.stop(), T.Transport.position = 0, B.textContent = L(S);
  }, M = () => {
    if (T && A) {
      const N = typeof T.Transport.loopEnd == "number" ? T.Transport.loopEnd : T.Time(T.Transport.loopEnd).toSeconds(), j = T.Transport.seconds % N, x = j / N * 100;
      K.value = Math.min(x, 100), G.textContent = L(j), B.textContent = L(N), T.Transport.state === "started" && A ? requestAnimationFrame(M) : T.Transport.state === "stopped" && (T.Transport.seconds = 0, K.value = 0, G.textContent = L(0), A = !1, ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  ne.addEventListener("click", async () => {
    if (!T)
      if (await Z())
        H();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (A)
      console.log("[PLAYER] Stopping playback..."), T.Transport.stop(), T.Transport.cancel(), R.forEach((N, j) => {
        try {
          N.stop();
        } catch (x) {
          console.warn(`[PLAYER] Failed to stop part ${j} during playback stop:`, x);
        }
      }), A = !1, ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback stopped and cleaned up");
    else {
      if ((!T.context || T.context.state !== "running") && (await T.start(), console.log("[PLAYER] Audio context started:", T.context ? T.context.state : "unknown")), q.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), H()), T.Transport.stop(), T.Transport.position = 0, console.log("[PLAYER] Transport state before start:", T.Transport.state), console.log("[PLAYER] Transport position reset to:", T.Transport.position), console.log("[PLAYER] Audio context state:", T.context ? T.context.state : "unknown"), console.log("[PLAYER] Parts count:", R.length), console.log("[PLAYER] Synths count:", q.length), E) {
        const N = Object.values(E).filter((j) => j && j.name === "Sampler");
        if (N.length > 0 && v.length > 0) {
          console.log(`[PLAYER] Waiting for ${N.length} sampler(s) to load...`);
          try {
            await Promise.all(v), console.log("[PLAYER] All samplers loaded.");
          } catch (j) {
            console.warn("[PLAYER] Sampler load wait error:", j);
            return;
          }
        }
      }
      if (R.length === 0) {
        console.error("[PLAYER] No parts available to start. This usually means setupAudio() failed."), console.error("[PLAYER] Try refreshing the page or check if Tone.js is properly loaded.");
        return;
      }
      R.forEach((N, j) => {
        if (!N || typeof N.start != "function") {
          console.error(`[PLAYER] Part ${j} is invalid:`, N);
          return;
        }
        try {
          N.start(0);
        } catch (x) {
          console.error(`[PLAYER] Failed to start part ${j}:`, x);
        }
      }), T.Transport.start(), A = !0, ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', M();
    }
  }), K.addEventListener("input", () => {
    if (T && S > 0) {
      const N = K.value / 100 * S;
      T.Transport.seconds = N, G.textContent = L(N);
    }
  }), D.addEventListener("change", () => {
    const N = parseInt(D.value);
    T && N >= 60 && N <= 240 ? (console.log(`[PLAYER] Tempo changed to ${N} BPM`), T.Transport.bpm.value = N, console.log(`[PLAYER] Tempo changed to ${N} BPM`)) : D.value = T ? T.Transport.bpm.value : u;
  }), b.forEach((N) => {
    N.addEventListener("change", () => {
      if (T && q.length > 0) {
        console.log("[PLAYER] Synthesizer selection changed, reinitializing audio...");
        const j = A;
        A && (T.Transport.stop(), A = !1), H(), j ? setTimeout(() => {
          T.Transport.start(), A = !0, ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>';
        }, 100) : ne.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
      }
    });
  }), re.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), be.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  });
  const C = typeof window < "u" && window.Tone || (typeof T < "u" ? T : null);
  if (C && Z().then(() => {
    H(), t && setTimeout(() => {
      ne.click();
    }, 500);
  }), t && !C) {
    const N = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof T < "u" ? T : null)) && (clearInterval(N), setTimeout(() => {
        ne.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(N);
    }, 1e4);
  }
  return h;
}
function mr(o, e = 0.25, t = "nearest") {
  if (typeof o != "number" || !isFinite(o)) return o;
  const r = o / e;
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
function si(o, { grid: e = 0.25, fields: t = ["time", "duration"], mode: r = "nearest" } = {}) {
  return Array.isArray(o) ? o.map((n) => {
    const i = { ...n };
    return t.forEach((s) => {
      typeof i[s] == "number" && (i[s] = mr(i[s], e, r));
    }), i;
  }) : o;
}
function ai(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.notes) ? o : {
    ...o,
    notes: si(o.notes, { grid: e, fields: ["time", "duration"], mode: t })
  };
}
function Gs(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.tracks) ? o : {
    ...o,
    tracks: o.tracks.map((r) => ai(r, { grid: e, mode: t }))
  };
}
function ci(o, e = 0.25) {
  const t = Math.round(1 / e), r = Math.round(o / e);
  return r <= 0 || r === t ? "" : r % t === 0 ? String(r / t) : `${r}/${t}`;
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: ci,
  quantize: mr,
  quantizeComposition: Gs,
  quantizeEvents: si,
  quantizeTrack: ai
}, Symbol.toStringTag, { value: "Module" }));
class Bs {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new cr(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(e);
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
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, s = r[2] || 0, a = 60 / t, c = a * 4, u = a / 480;
      return n * c + i * a + s * u;
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
    r += `T:${e.metadata?.title || e.metadata?.name || e.meta?.title || e.meta?.name || e.label || "Untitled"}
`;
    const n = e.metadata?.composer || e.metadata?.author || e.meta?.composer || e.meta?.author;
    n && (r += `C:${n}
`), r += `M:${e.timeSignature || "4/4"}
`, r += `L:1/4
`, r += `Q:1/4=${e.tempo || e.bpm || 120}
`, r += `K:${e.keySignature || "C"}
`;
    const i = e.timeSignature || "4/4", [s, a] = i.split("/").map(Number), c = s * (4 / a), u = t.measuresPerLine || 4, d = t.lineBreaks || [], y = t.renderMode || "merged", $ = t.trackIndex || 0, w = !!t.hideRests, S = t.showArticulations !== !1, m = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (m.length === 0) return r;
    const h = (() => {
      let l = 0;
      return m.forEach((f) => {
        const g = f.notes || f;
        Array.isArray(g) && g.forEach((_) => {
          const b = typeof _.time == "number" ? _.time : 0, P = typeof _.duration == "number" ? _.duration : 1, k = b + P;
          k > l && (l = k);
        });
      }), l;
    })(), p = Math.max(1, Math.ceil(h / c));
    if (y === "tracks" && m.length > 1)
      r += "%%score {", m.forEach((l, f) => {
        f > 0 && (r += " | "), r += `${f + 1}`;
      }), r += `}
`, m.forEach((l, f) => {
        const g = l.notes || l;
        if (g.length === 0) return;
        const _ = f + 1, b = l.label || `Track ${f + 1}`, P = b.length > 12 ? b.substring(0, 10) + ".." : b, k = l.instrument ? ` [${l.instrument}]` : "";
        r += `V:${_} name="${b}${k}" snm="${P}"
`;
        const I = g.filter((z) => z.pitch !== void 0).sort((z, G) => (z.time || 0) - (G.time || 0)), { abcNotesStr: D } = this.convertNotesToAbc(I, c, u, d, { hideRests: w, showArticulations: S, padMeasures: p });
        D.trim() && (r += D + `
`);
      });
    else if (y === "drums") {
      r += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const l = t.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, f = (P) => {
        const k = (P || "").toLowerCase();
        for (const I of Object.keys(l))
          if (k.includes(I)) return l[I];
        return "E";
      }, g = [];
      m.forEach((P) => {
        const k = P.notes || P, I = P.label || "", D = f(I);
        (k || []).forEach((z) => {
          z.pitch !== void 0 && g.push({
            time: typeof z.time == "number" ? z.time : 0,
            duration: typeof z.duration == "number" ? z.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: D,
            articulation: z.articulation
          });
        });
      });
      const _ = g.sort((P, k) => (P.time || 0) - (k.time || 0)), { abcNotesStr: b } = this.convertNotesToAbc(_, c, u, d, { hideRests: w, showArticulations: S, padMeasures: p });
      b.trim() && (r += b + `
`);
    } else if (y === "single") {
      const l = m[$];
      if (l) {
        const g = (l.notes || l).filter((b) => b.pitch !== void 0).sort((b, P) => (b.time || 0) - (P.time || 0)), { abcNotesStr: _ } = this.convertNotesToAbc(g, c, u, d, { hideRests: w, showArticulations: S, padMeasures: p });
        _.trim() && (r += _ + `
`);
      }
    } else {
      const l = [];
      m.forEach((_) => {
        (_.notes || _).forEach((P) => {
          P.pitch !== void 0 && l.push(P);
        });
      });
      const f = l.sort((_, b) => (_.time || 0) - (b.time || 0)), { abcNotesStr: g } = this.convertNotesToAbc(f, c, u, d, { hideRests: w, showArticulations: S, padMeasures: p });
      g.trim() && (r += g + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}) {
    let s = "", a = 0, c = 0, u = 0, d = 0;
    const y = i?.quantizeBeats || 0.25, $ = 1e-6, w = (g) => mr(g, y, "nearest"), S = (g) => ci(g, y), m = (g) => {
      s += g + " ";
    }, h = () => {
      for (; a >= t - 1e-9; )
        m("|"), a -= t, c++, u++, (n.includes(c) || u >= r) && (s += `
`, u = 0);
    }, p = (g, { forceVisible: _ = !1 } = {}) => {
      let b = g;
      for (; b > 0; ) {
        const P = t - a, k = w(Math.min(b, P));
        let I = i.hideRests && !_ ? "x" : "z";
        I += S(k), m(I), a = w(a + k), h(), b = w(b - k);
      }
    };
    for (const g of e) {
      const _ = typeof g.time == "number" ? w(g.time) : 0, b = typeof g.duration == "number" ? w(g.duration) : 1, P = w(_ - d);
      P > $ && p(P);
      let k = "z";
      if (typeof g.pitch == "number") {
        const D = g.pitch, z = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], G = Math.floor(D / 12) - 1, B = D % 12;
        k = z[B].replace("#", "^"), G >= 4 ? (k = k.toLowerCase(), G > 4 && (k += "'".repeat(G - 4))) : G < 4 && (k = k.toUpperCase(), G < 3 && (k += ",".repeat(3 - G)));
      } else typeof g.pitch == "string" ? k = g.pitch : g.pitch === null && (k = i.hideRests ? "x" : "z");
      let I = k;
      I += S(b), i.showArticulations && (g.articulation === "staccato" && (I += "."), g.articulation === "accent" && (I += ">"), g.articulation === "tenuto" && (I += "-"), g.articulation === "marcato" && (I += "^")), m(I), a = w(a + b), h(), d = w(_ + b);
    }
    const l = i.padMeasures || 0;
    for (; c < l; ) {
      const g = w(t - a);
      g > $ && p(g, { forceVisible: !0 }), m("|"), a = 0, c++;
    }
    const f = s.trim();
    return f && !f.endsWith("|") && (s += "|"), { abcNotesStr: s };
  }
}
function li(o, e = {}) {
  return Bs.convertToAbc(o, e);
}
class gr {
  static midiToNoteName(e) {
    const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], r = Math.floor(e / 12) - 1, n = e % 12;
    return t[n] + r;
  }
  static convert(e) {
    const t = e.tempo || e.bpm || 120, r = e.tracks || [];
    return {
      header: {
        bpm: t,
        timeSignature: e.timeSignature || "4/4"
      },
      tracks: r.map((n) => ({
        label: n.label,
        notes: n.notes.map((i) => ({
          pitch: i.pitch,
          noteName: typeof i.pitch == "number" ? gr.midiToNoteName(i.pitch) : i.pitch,
          time: i.time,
          duration: i.duration,
          velocity: i.velocity || 0.8,
          articulation: i.articulation || null
        }))
      }))
    };
  }
}
function Us(o) {
  return gr.convert(o);
}
function Ks(o, e = {}) {
  return {
    sampleRate: e.sampleRate || 44100,
    duration: e.duration || 10,
    channels: e.channels || 1,
    tempo: o.tempo || o.bpm || 120,
    notes: o.tracks?.flatMap((t) => t.notes) || []
  };
}
class Js {
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
function Hs(o) {
  return Js.convert(o);
}
function Ws(o) {
  return new cr().validateAndNormalize(o);
}
function Ys(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error("[RENDER] Invalid JMON object:", o), new Error("render() requires a valid JMON object");
  return !o.sequences && !o.tracks && !o.format && console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), pr(o, e);
}
function Qs(o, e = {}) {
  const t = { autoplay: !1, ...e };
  return pr(o, t);
}
async function Xs(o, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: s = {},
    ABCJS: a = null,
    abcjs: c = null,
    // Support lowercase alias
    autoload: u = !0
  } = e, d = li(o, s), y = document.createElement("div");
  y.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const $ = document.createElement("div");
  if ($.id = `rendered-score-${Date.now()}`, $.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, y.appendChild($), n) {
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
		`, S.appendChild(h), y.appendChild(S);
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
      S && (m.staffwidth = S), w.renderAbc($, d, m), setTimeout(() => {
        if ($.children.length === 0 || $.innerHTML.trim() === "")
          try {
            w.renderAbc($, d), $.children.length === 0 && ($.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + d + "</pre>");
          } catch {
            $.innerHTML = "<p>Error with alternative rendering</p><pre>" + d + "</pre>";
          }
      }, 200);
    } catch (S) {
      console.error("[SCORE] Error rendering with ABCJS:", S), $.innerHTML = "<p>Error rendering notation</p><pre>" + d + "</pre>";
    }
  else {
    const S = u ? "ABCJS not available and auto-loading failed - showing text notation only" : "ABCJS not provided and auto-loading disabled - showing text notation only";
    $.innerHTML = `<p>${S}</p><pre>` + d + "</pre>", !w && u && (console.log("[SCORE] To use visual score rendering, try:"), console.log('ABCJS = await require("abcjs"), then jm.score(composition, { ABCJS })'));
  }
  return y;
}
const Zs = {
  // Core functionality
  render: Ys,
  play: Qs,
  score: Xs,
  validate: Ws,
  // Core formats and players
  createPlayer: pr,
  // Converters
  converters: {
    abc: li,
    midi: Us,
    tonejs: ni,
    wav: Ks,
    supercollider: Hs
  },
  // Theory and algorithms
  theory: Be.theory,
  generative: Be.generative,
  analysis: Be.analysis,
  constants: Be.constants,
  // Utils
  utils: {
    ...Be.utils,
    JmonValidator: cr,
    // Expose utility helpers
    quantize: (o, e, t) => Promise.resolve().then(() => Ot).then((r) => r.quantize(o, e, t)),
    quantizeEvents: async (o, e) => (await Promise.resolve().then(() => Ot)).quantizeEvents(o, e),
    quantizeTrack: async (o, e) => (await Promise.resolve().then(() => Ot)).quantizeTrack(o, e),
    quantizeComposition: async (o, e) => (await Promise.resolve().then(() => Ot)).quantizeComposition(o, e),
    // JMON utilities - official format helpers
    jmon: ps
  },
  // GM Instruments
  instruments: {
    GM_INSTRUMENTS: ze,
    generateSamplerUrls: Ke,
    createGMInstrumentNode: Fs,
    findGMProgramByName: ii,
    getPopularInstruments: oi
  },
  VERSION: "1.0.0"
}, ea = {
  loops: {
    async plotLoops(o, e = 4, t = 1 / 4, r = null, n = {}) {
      const { LoopVisualizer: i } = await import("./LoopVisualizer-DS22P85c.js");
      return i.plotLoops(o, e, t, r, n);
    }
  }
};
Zs.visualization = ea;
export {
  Zs as default,
  Zs as jm
};
