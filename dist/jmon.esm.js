function Jn(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var Fe = { exports: {} }, It = {}, $e = {}, Te = {}, Ot = {}, qt = {}, Dt = {}, ir;
function Mt() {
  return ir || (ir = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.regexpCode = o.getEsmExportName = o.getProperty = o.safeStringify = o.stringify = o.strConcat = o.addCodeArg = o.str = o._ = o.nil = o._Code = o.Name = o.IDENTIFIER = o._CodeOrName = void 0;
    class e {
    }
    o._CodeOrName = e, o.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(c) {
        if (super(), !o.IDENTIFIER.test(c))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = c;
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
      constructor(c) {
        super(), this._items = typeof c == "string" ? [c] : c;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const c = this._items[0];
        return c === "" || c === '""';
      }
      get str() {
        var c;
        return (c = this._str) !== null && c !== void 0 ? c : this._str = this._items.reduce((f, m) => `${f}${m}`, "");
      }
      get names() {
        var c;
        return (c = this._names) !== null && c !== void 0 ? c : this._names = this._items.reduce((f, m) => (m instanceof t && (f[m.str] = (f[m.str] || 0) + 1), f), {});
      }
    }
    o._Code = r, o.nil = new r("");
    function n(d, ...c) {
      const f = [d[0]];
      let m = 0;
      for (; m < c.length; )
        a(f, c[m]), f.push(d[++m]);
      return new r(f);
    }
    o._ = n;
    const i = new r("+");
    function s(d, ...c) {
      const f = [S(d[0])];
      let m = 0;
      for (; m < c.length; )
        f.push(i), a(f, c[m]), f.push(i, S(d[++m]));
      return l(f), new r(f);
    }
    o.str = s;
    function a(d, c) {
      c instanceof r ? d.push(...c._items) : c instanceof t ? d.push(c) : d.push(w(c));
    }
    o.addCodeArg = a;
    function l(d) {
      let c = 1;
      for (; c < d.length - 1; ) {
        if (d[c] === i) {
          const f = u(d[c - 1], d[c + 1]);
          if (f !== void 0) {
            d.splice(c - 1, 3, f);
            continue;
          }
          d[c++] = "+";
        }
        c++;
      }
    }
    function u(d, c) {
      if (c === '""')
        return d;
      if (d === '""')
        return c;
      if (typeof d == "string")
        return c instanceof t || d[d.length - 1] !== '"' ? void 0 : typeof c != "string" ? `${d.slice(0, -1)}${c}"` : c[0] === '"' ? d.slice(0, -1) + c.slice(1) : void 0;
      if (typeof c == "string" && c[0] === '"' && !(d instanceof t))
        return `"${d}${c.slice(1)}`;
    }
    function p(d, c) {
      return c.emptyStr() ? d : d.emptyStr() ? c : s`${d}${c}`;
    }
    o.strConcat = p;
    function w(d) {
      return typeof d == "number" || typeof d == "boolean" || d === null ? d : S(Array.isArray(d) ? d.join(",") : d);
    }
    function _(d) {
      return new r(S(d));
    }
    o.stringify = _;
    function S(d) {
      return JSON.stringify(d).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    o.safeStringify = S;
    function E(d) {
      return typeof d == "string" && o.IDENTIFIER.test(d) ? new r(`.${d}`) : n`[${d}]`;
    }
    o.getProperty = E;
    function b(d) {
      if (typeof d == "string" && o.IDENTIFIER.test(d))
        return new r(`${d}`);
      throw new Error(`CodeGen: invalid export name: ${d}, use explicit $id name mapping`);
    }
    o.getEsmExportName = b;
    function h(d) {
      return new r(d.toString());
    }
    o.regexpCode = h;
  })(Dt)), Dt;
}
var xt = {}, or;
function sr() {
  return or || (or = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.ValueScope = o.ValueScopeName = o.Scope = o.varKinds = o.UsedValueState = void 0;
    const e = Mt();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var r;
    (function(l) {
      l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
    })(r || (o.UsedValueState = r = {})), o.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class n {
      constructor({ prefixes: u, parent: p } = {}) {
        this._names = {}, this._prefixes = u, this._parent = p;
      }
      toName(u) {
        return u instanceof e.Name ? u : this.name(u);
      }
      name(u) {
        return new e.Name(this._newName(u));
      }
      _newName(u) {
        const p = this._names[u] || this._nameGroup(u);
        return `${u}${p.index++}`;
      }
      _nameGroup(u) {
        var p, w;
        if (!((w = (p = this._parent) === null || p === void 0 ? void 0 : p._prefixes) === null || w === void 0) && w.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    o.Scope = n;
    class i extends e.Name {
      constructor(u, p) {
        super(p), this.prefix = u;
      }
      setValue(u, { property: p, itemIndex: w }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(p)}[${w}]`;
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
      value(u, p) {
        var w;
        if (p.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(u), { prefix: S } = _, E = (w = p.key) !== null && w !== void 0 ? w : p.ref;
        let b = this._values[S];
        if (b) {
          const c = b.get(E);
          if (c)
            return c;
        } else
          b = this._values[S] = /* @__PURE__ */ new Map();
        b.set(E, _);
        const h = this._scope[S] || (this._scope[S] = []), d = h.length;
        return h[d] = p.ref, _.setValue(p, { property: S, itemIndex: d }), _;
      }
      getValue(u, p) {
        const w = this._values[u];
        if (w)
          return w.get(p);
      }
      scopeRefs(u, p = this._values) {
        return this._reduceValues(p, (w) => {
          if (w.scopePath === void 0)
            throw new Error(`CodeGen: name "${w}" has no value`);
          return (0, e._)`${u}${w.scopePath}`;
        });
      }
      scopeCode(u = this._values, p, w) {
        return this._reduceValues(u, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, p, w);
      }
      _reduceValues(u, p, w = {}, _) {
        let S = e.nil;
        for (const E in u) {
          const b = u[E];
          if (!b)
            continue;
          const h = w[E] = w[E] || /* @__PURE__ */ new Map();
          b.forEach((d) => {
            if (h.has(d))
              return;
            h.set(d, r.Started);
            let c = p(d);
            if (c) {
              const f = this.opts.es5 ? o.varKinds.var : o.varKinds.const;
              S = (0, e._)`${S}${f} ${d} = ${c};${this.opts._n}`;
            } else if (c = _?.(d))
              S = (0, e._)`${S}${c}${this.opts._n}`;
            else
              throw new t(d);
            h.set(d, r.Completed);
          });
        }
        return S;
      }
    }
    o.ValueScope = a;
  })(xt)), xt;
}
var ar;
function Y() {
  return ar || (ar = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.or = o.and = o.not = o.CodeGen = o.operators = o.varKinds = o.ValueScopeName = o.ValueScope = o.Scope = o.Name = o.regexpCode = o.stringify = o.getProperty = o.nil = o.strConcat = o.str = o._ = void 0;
    const e = Mt(), t = sr();
    var r = Mt();
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
    var n = sr();
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
      optimizeNames(y, M) {
        return this;
      }
    }
    class s extends i {
      constructor(y, M, A) {
        super(), this.varKind = y, this.name = M, this.rhs = A;
      }
      render({ es5: y, _n: M }) {
        const A = y ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${A} ${this.name}${F};` + M;
      }
      optimizeNames(y, M) {
        if (y[this.name.str])
          return this.rhs && (this.rhs = H(this.rhs, y, M)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(y, M, A) {
        super(), this.lhs = y, this.rhs = M, this.sideEffects = A;
      }
      render({ _n: y }) {
        return `${this.lhs} = ${this.rhs};` + y;
      }
      optimizeNames(y, M) {
        if (!(this.lhs instanceof e.Name && !y[this.lhs.str] && !this.sideEffects))
          return this.rhs = H(this.rhs, y, M), this;
      }
      get names() {
        const y = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return L(y, this.rhs);
      }
    }
    class l extends a {
      constructor(y, M, A, F) {
        super(y, A, F), this.op = M;
      }
      render({ _n: y }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + y;
      }
    }
    class u extends i {
      constructor(y) {
        super(), this.label = y, this.names = {};
      }
      render({ _n: y }) {
        return `${this.label}:` + y;
      }
    }
    class p extends i {
      constructor(y) {
        super(), this.label = y, this.names = {};
      }
      render({ _n: y }) {
        return `break${this.label ? ` ${this.label}` : ""};` + y;
      }
    }
    class w extends i {
      constructor(y) {
        super(), this.error = y;
      }
      render({ _n: y }) {
        return `throw ${this.error};` + y;
      }
      get names() {
        return this.error.names;
      }
    }
    class _ extends i {
      constructor(y) {
        super(), this.code = y;
      }
      render({ _n: y }) {
        return `${this.code};` + y;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(y, M) {
        return this.code = H(this.code, y, M), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class S extends i {
      constructor(y = []) {
        super(), this.nodes = y;
      }
      render(y) {
        return this.nodes.reduce((M, A) => M + A.render(y), "");
      }
      optimizeNodes() {
        const { nodes: y } = this;
        let M = y.length;
        for (; M--; ) {
          const A = y[M].optimizeNodes();
          Array.isArray(A) ? y.splice(M, 1, ...A) : A ? y[M] = A : y.splice(M, 1);
        }
        return y.length > 0 ? this : void 0;
      }
      optimizeNames(y, M) {
        const { nodes: A } = this;
        let F = A.length;
        for (; F--; ) {
          const G = A[F];
          G.optimizeNames(y, M) || (ce(y, G.names), A.splice(F, 1));
        }
        return A.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((y, M) => B(y, M.names), {});
      }
    }
    class E extends S {
      render(y) {
        return "{" + y._n + super.render(y) + "}" + y._n;
      }
    }
    class b extends S {
    }
    class h extends E {
    }
    h.kind = "else";
    class d extends E {
      constructor(y, M) {
        super(M), this.condition = y;
      }
      render(y) {
        let M = `if(${this.condition})` + super.render(y);
        return this.else && (M += "else " + this.else.render(y)), M;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const y = this.condition;
        if (y === !0)
          return this.nodes;
        let M = this.else;
        if (M) {
          const A = M.optimizeNodes();
          M = this.else = Array.isArray(A) ? new h(A) : A;
        }
        if (M)
          return y === !1 ? M instanceof d ? M : M.nodes : this.nodes.length ? this : new d(me(y), M instanceof d ? [M] : M.nodes);
        if (!(y === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(y, M) {
        var A;
        if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(y, M), !!(super.optimizeNames(y, M) || this.else))
          return this.condition = H(this.condition, y, M), this;
      }
      get names() {
        const y = super.names;
        return L(y, this.condition), this.else && B(y, this.else.names), y;
      }
    }
    d.kind = "if";
    class c extends E {
    }
    c.kind = "for";
    class f extends c {
      constructor(y) {
        super(), this.iteration = y;
      }
      render(y) {
        return `for(${this.iteration})` + super.render(y);
      }
      optimizeNames(y, M) {
        if (super.optimizeNames(y, M))
          return this.iteration = H(this.iteration, y, M), this;
      }
      get names() {
        return B(super.names, this.iteration.names);
      }
    }
    class m extends c {
      constructor(y, M, A, F) {
        super(), this.varKind = y, this.name = M, this.from = A, this.to = F;
      }
      render(y) {
        const M = y.es5 ? t.varKinds.var : this.varKind, { name: A, from: F, to: G } = this;
        return `for(${M} ${A}=${F}; ${A}<${G}; ${A}++)` + super.render(y);
      }
      get names() {
        const y = L(super.names, this.from);
        return L(y, this.to);
      }
    }
    class v extends c {
      constructor(y, M, A, F) {
        super(), this.loop = y, this.varKind = M, this.name = A, this.iterable = F;
      }
      render(y) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(y);
      }
      optimizeNames(y, M) {
        if (super.optimizeNames(y, M))
          return this.iterable = H(this.iterable, y, M), this;
      }
      get names() {
        return B(super.names, this.iterable.names);
      }
    }
    class g extends E {
      constructor(y, M, A) {
        super(), this.name = y, this.args = M, this.async = A;
      }
      render(y) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(y);
      }
    }
    g.kind = "func";
    class $ extends S {
      render(y) {
        return "return " + super.render(y);
      }
    }
    $.kind = "return";
    class k extends E {
      render(y) {
        let M = "try" + super.render(y);
        return this.catch && (M += this.catch.render(y)), this.finally && (M += this.finally.render(y)), M;
      }
      optimizeNodes() {
        var y, M;
        return super.optimizeNodes(), (y = this.catch) === null || y === void 0 || y.optimizeNodes(), (M = this.finally) === null || M === void 0 || M.optimizeNodes(), this;
      }
      optimizeNames(y, M) {
        var A, F;
        return super.optimizeNames(y, M), (A = this.catch) === null || A === void 0 || A.optimizeNames(y, M), (F = this.finally) === null || F === void 0 || F.optimizeNames(y, M), this;
      }
      get names() {
        const y = super.names;
        return this.catch && B(y, this.catch.names), this.finally && B(y, this.finally.names), y;
      }
    }
    class j extends E {
      constructor(y) {
        super(), this.error = y;
      }
      render(y) {
        return `catch(${this.error})` + super.render(y);
      }
    }
    j.kind = "catch";
    class D extends E {
      render(y) {
        return "finally" + super.render(y);
      }
    }
    D.kind = "finally";
    class V {
      constructor(y, M = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...M, _n: M.lines ? `
` : "" }, this._extScope = y, this._scope = new t.Scope({ parent: y }), this._nodes = [new b()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(y) {
        return this._scope.name(y);
      }
      // reserves unique name in the external scope
      scopeName(y) {
        return this._extScope.name(y);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(y, M) {
        const A = this._extScope.value(y, M);
        return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
      }
      getScopeValue(y, M) {
        return this._extScope.getValue(y, M);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(y) {
        return this._extScope.scopeRefs(y, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(y, M, A, F) {
        const G = this._scope.toName(M);
        return A !== void 0 && F && (this._constants[G.str] = A), this._leafNode(new s(y, G, A)), G;
      }
      // `const` declaration (`var` in es5 mode)
      const(y, M, A) {
        return this._def(t.varKinds.const, y, M, A);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(y, M, A) {
        return this._def(t.varKinds.let, y, M, A);
      }
      // `var` declaration with optional assignment
      var(y, M, A) {
        return this._def(t.varKinds.var, y, M, A);
      }
      // assignment code
      assign(y, M, A) {
        return this._leafNode(new a(y, M, A));
      }
      // `+=` code
      add(y, M) {
        return this._leafNode(new l(y, o.operators.ADD, M));
      }
      // appends passed SafeExpr to code or executes Block
      code(y) {
        return typeof y == "function" ? y() : y !== e.nil && this._leafNode(new _(y)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...y) {
        const M = ["{"];
        for (const [A, F] of y)
          M.length > 1 && M.push(","), M.push(A), (A !== F || this.opts.es5) && (M.push(":"), (0, e.addCodeArg)(M, F));
        return M.push("}"), new e._Code(M);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(y, M, A) {
        if (this._blockNode(new d(y)), M && A)
          this.code(M).else().code(A).endIf();
        else if (M)
          this.code(M).endIf();
        else if (A)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(y) {
        return this._elseNode(new d(y));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(d, h);
      }
      _for(y, M) {
        return this._blockNode(y), M && this.code(M).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(y, M) {
        return this._for(new f(y), M);
      }
      // `for` statement for a range of values
      forRange(y, M, A, F, G = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Q = this._scope.toName(y);
        return this._for(new m(G, Q, M, A), () => F(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(y, M, A, F = t.varKinds.const) {
        const G = this._scope.toName(y);
        if (this.opts.es5) {
          const Q = M instanceof e.Name ? M : this.var("_arr", M);
          return this.forRange("_i", 0, (0, e._)`${Q}.length`, (W) => {
            this.var(G, (0, e._)`${Q}[${W}]`), A(G);
          });
        }
        return this._for(new v("of", F, G, M), () => A(G));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(y, M, A, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(y, (0, e._)`Object.keys(${M})`, A);
        const G = this._scope.toName(y);
        return this._for(new v("in", F, G, M), () => A(G));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(c);
      }
      // `label` statement
      label(y) {
        return this._leafNode(new u(y));
      }
      // `break` statement
      break(y) {
        return this._leafNode(new p(y));
      }
      // `return` statement
      return(y) {
        const M = new $();
        if (this._blockNode(M), this.code(y), M.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode($);
      }
      // `try` statement
      try(y, M, A) {
        if (!M && !A)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new k();
        if (this._blockNode(F), this.code(y), M) {
          const G = this.name("e");
          this._currNode = F.catch = new j(G), M(G);
        }
        return A && (this._currNode = F.finally = new D(), this.code(A)), this._endBlockNode(j, D);
      }
      // `throw` statement
      throw(y) {
        return this._leafNode(new w(y));
      }
      // start self-balancing block
      block(y, M) {
        return this._blockStarts.push(this._nodes.length), y && this.code(y).endBlock(M), this;
      }
      // end the current self-balancing block
      endBlock(y) {
        const M = this._blockStarts.pop();
        if (M === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const A = this._nodes.length - M;
        if (A < 0 || y !== void 0 && A !== y)
          throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${y} expected`);
        return this._nodes.length = M, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(y, M = e.nil, A, F) {
        return this._blockNode(new g(y, M, A)), F && this.code(F).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(g);
      }
      optimize(y = 1) {
        for (; y-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(y) {
        return this._currNode.nodes.push(y), this;
      }
      _blockNode(y) {
        this._currNode.nodes.push(y), this._nodes.push(y);
      }
      _endBlockNode(y, M) {
        const A = this._currNode;
        if (A instanceof y || M && A instanceof M)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${M ? `${y.kind}/${M.kind}` : y.kind}"`);
      }
      _elseNode(y) {
        const M = this._currNode;
        if (!(M instanceof d))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = M.else = y, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const y = this._nodes;
        return y[y.length - 1];
      }
      set _currNode(y) {
        const M = this._nodes;
        M[M.length - 1] = y;
      }
    }
    o.CodeGen = V;
    function B(R, y) {
      for (const M in y)
        R[M] = (R[M] || 0) + (y[M] || 0);
      return R;
    }
    function L(R, y) {
      return y instanceof e._CodeOrName ? B(R, y.names) : R;
    }
    function H(R, y, M) {
      if (R instanceof e.Name)
        return A(R);
      if (!F(R))
        return R;
      return new e._Code(R._items.reduce((G, Q) => (Q instanceof e.Name && (Q = A(Q)), Q instanceof e._Code ? G.push(...Q._items) : G.push(Q), G), []));
      function A(G) {
        const Q = M[G.str];
        return Q === void 0 || y[G.str] !== 1 ? G : (delete y[G.str], Q);
      }
      function F(G) {
        return G instanceof e._Code && G._items.some((Q) => Q instanceof e.Name && y[Q.str] === 1 && M[Q.str] !== void 0);
      }
    }
    function ce(R, y) {
      for (const M in y)
        R[M] = (R[M] || 0) - (y[M] || 0);
    }
    function me(R) {
      return typeof R == "boolean" || typeof R == "number" || R === null ? !R : (0, e._)`!${I(R)}`;
    }
    o.not = me;
    const ye = N(o.operators.AND);
    function ee(...R) {
      return R.reduce(ye);
    }
    o.and = ee;
    const z = N(o.operators.OR);
    function q(...R) {
      return R.reduce(z);
    }
    o.or = q;
    function N(R) {
      return (y, M) => y === e.nil ? M : M === e.nil ? y : (0, e._)`${I(y)} ${R} ${I(M)}`;
    }
    function I(R) {
      return R instanceof e.Name ? R : (0, e._)`(${R})`;
    }
  })(qt)), qt;
}
var J = {}, cr;
function Z() {
  if (cr) return J;
  cr = 1, Object.defineProperty(J, "__esModule", { value: !0 }), J.checkStrictMode = J.getErrorPath = J.Type = J.useFunc = J.setEvaluated = J.evaluatedPropsToName = J.mergeEvaluated = J.eachItem = J.unescapeJsonPointer = J.escapeJsonPointer = J.escapeFragment = J.unescapeFragment = J.schemaRefOrVal = J.schemaHasRulesButRef = J.schemaHasRules = J.checkUnknownRules = J.alwaysValidSchema = J.toHash = void 0;
  const o = Y(), e = Mt();
  function t(v) {
    const g = {};
    for (const $ of v)
      g[$] = !0;
    return g;
  }
  J.toHash = t;
  function r(v, g) {
    return typeof g == "boolean" ? g : Object.keys(g).length === 0 ? !0 : (n(v, g), !i(g, v.self.RULES.all));
  }
  J.alwaysValidSchema = r;
  function n(v, g = v.schema) {
    const { opts: $, self: k } = v;
    if (!$.strictSchema || typeof g == "boolean")
      return;
    const j = k.RULES.keywords;
    for (const D in g)
      j[D] || m(v, `unknown keyword: "${D}"`);
  }
  J.checkUnknownRules = n;
  function i(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const $ in v)
      if (g[$])
        return !0;
    return !1;
  }
  J.schemaHasRules = i;
  function s(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const $ in v)
      if ($ !== "$ref" && g.all[$])
        return !0;
    return !1;
  }
  J.schemaHasRulesButRef = s;
  function a({ topSchemaRef: v, schemaPath: g }, $, k, j) {
    if (!j) {
      if (typeof $ == "number" || typeof $ == "boolean")
        return $;
      if (typeof $ == "string")
        return (0, o._)`${$}`;
    }
    return (0, o._)`${v}${g}${(0, o.getProperty)(k)}`;
  }
  J.schemaRefOrVal = a;
  function l(v) {
    return w(decodeURIComponent(v));
  }
  J.unescapeFragment = l;
  function u(v) {
    return encodeURIComponent(p(v));
  }
  J.escapeFragment = u;
  function p(v) {
    return typeof v == "number" ? `${v}` : v.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  J.escapeJsonPointer = p;
  function w(v) {
    return v.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  J.unescapeJsonPointer = w;
  function _(v, g) {
    if (Array.isArray(v))
      for (const $ of v)
        g($);
    else
      g(v);
  }
  J.eachItem = _;
  function S({ mergeNames: v, mergeToName: g, mergeValues: $, resultToName: k }) {
    return (j, D, V, B) => {
      const L = V === void 0 ? D : V instanceof o.Name ? (D instanceof o.Name ? v(j, D, V) : g(j, D, V), V) : D instanceof o.Name ? (g(j, V, D), D) : $(D, V);
      return B === o.Name && !(L instanceof o.Name) ? k(j, L) : L;
    };
  }
  J.mergeEvaluated = {
    props: S({
      mergeNames: (v, g, $) => v.if((0, o._)`${$} !== true && ${g} !== undefined`, () => {
        v.if((0, o._)`${g} === true`, () => v.assign($, !0), () => v.assign($, (0, o._)`${$} || {}`).code((0, o._)`Object.assign(${$}, ${g})`));
      }),
      mergeToName: (v, g, $) => v.if((0, o._)`${$} !== true`, () => {
        g === !0 ? v.assign($, !0) : (v.assign($, (0, o._)`${$} || {}`), b(v, $, g));
      }),
      mergeValues: (v, g) => v === !0 ? !0 : { ...v, ...g },
      resultToName: E
    }),
    items: S({
      mergeNames: (v, g, $) => v.if((0, o._)`${$} !== true && ${g} !== undefined`, () => v.assign($, (0, o._)`${g} === true ? true : ${$} > ${g} ? ${$} : ${g}`)),
      mergeToName: (v, g, $) => v.if((0, o._)`${$} !== true`, () => v.assign($, g === !0 ? !0 : (0, o._)`${$} > ${g} ? ${$} : ${g}`)),
      mergeValues: (v, g) => v === !0 ? !0 : Math.max(v, g),
      resultToName: (v, g) => v.var("items", g)
    })
  };
  function E(v, g) {
    if (g === !0)
      return v.var("props", !0);
    const $ = v.var("props", (0, o._)`{}`);
    return g !== void 0 && b(v, $, g), $;
  }
  J.evaluatedPropsToName = E;
  function b(v, g, $) {
    Object.keys($).forEach((k) => v.assign((0, o._)`${g}${(0, o.getProperty)(k)}`, !0));
  }
  J.setEvaluated = b;
  const h = {};
  function d(v, g) {
    return v.scopeValue("func", {
      ref: g,
      code: h[g.code] || (h[g.code] = new e._Code(g.code))
    });
  }
  J.useFunc = d;
  var c;
  (function(v) {
    v[v.Num = 0] = "Num", v[v.Str = 1] = "Str";
  })(c || (J.Type = c = {}));
  function f(v, g, $) {
    if (v instanceof o.Name) {
      const k = g === c.Num;
      return $ ? k ? (0, o._)`"[" + ${v} + "]"` : (0, o._)`"['" + ${v} + "']"` : k ? (0, o._)`"/" + ${v}` : (0, o._)`"/" + ${v}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return $ ? (0, o.getProperty)(v).toString() : "/" + p(v);
  }
  J.getErrorPath = f;
  function m(v, g, $ = v.opts.strictSchema) {
    if ($) {
      if (g = `strict mode: ${g}`, $ === !0)
        throw new Error(g);
      v.self.logger.warn(g);
    }
  }
  return J.checkStrictMode = m, J;
}
var Le = {}, lr;
function Me() {
  if (lr) return Le;
  lr = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
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
  return Le.default = e, Le;
}
var ur;
function Nt() {
  return ur || (ur = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.extendErrors = o.resetErrorsCount = o.reportExtraError = o.reportError = o.keyword$DataError = o.keywordError = void 0;
    const e = Y(), t = Z(), r = Me();
    o.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, o.keyword$DataError = {
      message: ({ keyword: h, schemaType: d }) => d ? (0, e.str)`"${h}" keyword must be ${d} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, d = o.keywordError, c, f) {
      const { it: m } = h, { gen: v, compositeRule: g, allErrors: $ } = m, k = w(h, d, c);
      f ?? (g || $) ? l(v, k) : u(m, (0, e._)`[${k}]`);
    }
    o.reportError = n;
    function i(h, d = o.keywordError, c) {
      const { it: f } = h, { gen: m, compositeRule: v, allErrors: g } = f, $ = w(h, d, c);
      l(m, $), v || g || u(f, r.default.vErrors);
    }
    o.reportExtraError = i;
    function s(h, d) {
      h.assign(r.default.errors, d), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(d, () => h.assign((0, e._)`${r.default.vErrors}.length`, d), () => h.assign(r.default.vErrors, null)));
    }
    o.resetErrorsCount = s;
    function a({ gen: h, keyword: d, schemaValue: c, data: f, errsCount: m, it: v }) {
      if (m === void 0)
        throw new Error("ajv implementation error");
      const g = h.name("err");
      h.forRange("i", m, r.default.errors, ($) => {
        h.const(g, (0, e._)`${r.default.vErrors}[${$}]`), h.if((0, e._)`${g}.instancePath === undefined`, () => h.assign((0, e._)`${g}.instancePath`, (0, e.strConcat)(r.default.instancePath, v.errorPath))), h.assign((0, e._)`${g}.schemaPath`, (0, e.str)`${v.errSchemaPath}/${d}`), v.opts.verbose && (h.assign((0, e._)`${g}.schema`, c), h.assign((0, e._)`${g}.data`, f));
      });
    }
    o.extendErrors = a;
    function l(h, d) {
      const c = h.const("err", d);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${c}]`), (0, e._)`${r.default.vErrors}.push(${c})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function u(h, d) {
      const { gen: c, validateName: f, schemaEnv: m } = h;
      m.$async ? c.throw((0, e._)`new ${h.ValidationError}(${d})`) : (c.assign((0, e._)`${f}.errors`, d), c.return(!1));
    }
    const p = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function w(h, d, c) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, d, c);
    }
    function _(h, d, c = {}) {
      const { gen: f, it: m } = h, v = [
        S(m, c),
        E(h, c)
      ];
      return b(h, d, v), f.object(...v);
    }
    function S({ errorPath: h }, { instancePath: d }) {
      const c = d ? (0, e.str)`${h}${(0, t.getErrorPath)(d, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, c)];
    }
    function E({ keyword: h, it: { errSchemaPath: d } }, { schemaPath: c, parentSchema: f }) {
      let m = f ? d : (0, e.str)`${d}/${h}`;
      return c && (m = (0, e.str)`${m}${(0, t.getErrorPath)(c, t.Type.Str)}`), [p.schemaPath, m];
    }
    function b(h, { params: d, message: c }, f) {
      const { keyword: m, data: v, schemaValue: g, it: $ } = h, { opts: k, propertyName: j, topSchemaRef: D, schemaPath: V } = $;
      f.push([p.keyword, m], [p.params, typeof d == "function" ? d(h) : d || (0, e._)`{}`]), k.messages && f.push([p.message, typeof c == "function" ? c(h) : c]), k.verbose && f.push([p.schema, g], [p.parentSchema, (0, e._)`${D}${V}`], [r.default.data, v]), j && f.push([p.propertyName, j]);
    }
  })(Ot)), Ot;
}
var dr;
function Wn() {
  if (dr) return Te;
  dr = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.boolOrEmptySchema = Te.topBoolOrEmptySchema = void 0;
  const o = Nt(), e = Y(), t = Me(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: l, schema: u, validateName: p } = a;
    u === !1 ? s(a, !1) : typeof u == "object" && u.$async === !0 ? l.return(t.default.data) : (l.assign((0, e._)`${p}.errors`, null), l.return(!0));
  }
  Te.topBoolOrEmptySchema = n;
  function i(a, l) {
    const { gen: u, schema: p } = a;
    p === !1 ? (u.var(l, !1), s(a)) : u.var(l, !0);
  }
  Te.boolOrEmptySchema = i;
  function s(a, l) {
    const { gen: u, data: p } = a, w = {
      gen: u,
      keyword: "false schema",
      data: p,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, o.reportError)(w, r, void 0, l);
  }
  return Te;
}
var he = {}, ke = {}, fr;
function wn() {
  if (fr) return ke;
  fr = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.getRules = ke.isJSONType = void 0;
  const o = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(o);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  ke.isJSONType = t;
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
  return ke.getRules = r, ke;
}
var _e = {}, hr;
function $n() {
  if (hr) return _e;
  hr = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.shouldUseRule = _e.shouldUseGroup = _e.schemaHasRulesForType = void 0;
  function o({ schema: r, self: n }, i) {
    const s = n.RULES.types[i];
    return s && s !== !0 && e(r, s);
  }
  _e.schemaHasRulesForType = o;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  _e.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((s) => r[s] !== void 0));
  }
  return _e.shouldUseRule = t, _e;
}
var pr;
function Tt() {
  if (pr) return he;
  pr = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.reportTypeError = he.checkDataTypes = he.checkDataType = he.coerceAndCheckDataType = he.getJSONTypes = he.getSchemaTypes = he.DataType = void 0;
  const o = wn(), e = $n(), t = Nt(), r = Y(), n = Z();
  var i;
  (function(c) {
    c[c.Correct = 0] = "Correct", c[c.Wrong = 1] = "Wrong";
  })(i || (he.DataType = i = {}));
  function s(c) {
    const f = a(c.type);
    if (f.includes("null")) {
      if (c.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!f.length && c.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      c.nullable === !0 && f.push("null");
    }
    return f;
  }
  he.getSchemaTypes = s;
  function a(c) {
    const f = Array.isArray(c) ? c : c ? [c] : [];
    if (f.every(o.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  he.getJSONTypes = a;
  function l(c, f) {
    const { gen: m, data: v, opts: g } = c, $ = p(f, g.coerceTypes), k = f.length > 0 && !($.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(c, f[0]));
    if (k) {
      const j = E(f, v, g.strictNumbers, i.Wrong);
      m.if(j, () => {
        $.length ? w(c, f, $) : h(c);
      });
    }
    return k;
  }
  he.coerceAndCheckDataType = l;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function p(c, f) {
    return f ? c.filter((m) => u.has(m) || f === "array" && m === "array") : [];
  }
  function w(c, f, m) {
    const { gen: v, data: g, opts: $ } = c, k = v.let("dataType", (0, r._)`typeof ${g}`), j = v.let("coerced", (0, r._)`undefined`);
    $.coerceTypes === "array" && v.if((0, r._)`${k} == 'object' && Array.isArray(${g}) && ${g}.length == 1`, () => v.assign(g, (0, r._)`${g}[0]`).assign(k, (0, r._)`typeof ${g}`).if(E(f, g, $.strictNumbers), () => v.assign(j, g))), v.if((0, r._)`${j} !== undefined`);
    for (const V of m)
      (u.has(V) || V === "array" && $.coerceTypes === "array") && D(V);
    v.else(), h(c), v.endIf(), v.if((0, r._)`${j} !== undefined`, () => {
      v.assign(g, j), _(c, j);
    });
    function D(V) {
      switch (V) {
        case "string":
          v.elseIf((0, r._)`${k} == "number" || ${k} == "boolean"`).assign(j, (0, r._)`"" + ${g}`).elseIf((0, r._)`${g} === null`).assign(j, (0, r._)`""`);
          return;
        case "number":
          v.elseIf((0, r._)`${k} == "boolean" || ${g} === null
              || (${k} == "string" && ${g} && ${g} == +${g})`).assign(j, (0, r._)`+${g}`);
          return;
        case "integer":
          v.elseIf((0, r._)`${k} === "boolean" || ${g} === null
              || (${k} === "string" && ${g} && ${g} == +${g} && !(${g} % 1))`).assign(j, (0, r._)`+${g}`);
          return;
        case "boolean":
          v.elseIf((0, r._)`${g} === "false" || ${g} === 0 || ${g} === null`).assign(j, !1).elseIf((0, r._)`${g} === "true" || ${g} === 1`).assign(j, !0);
          return;
        case "null":
          v.elseIf((0, r._)`${g} === "" || ${g} === 0 || ${g} === false`), v.assign(j, null);
          return;
        case "array":
          v.elseIf((0, r._)`${k} === "string" || ${k} === "number"
              || ${k} === "boolean" || ${g} === null`).assign(j, (0, r._)`[${g}]`);
      }
    }
  }
  function _({ gen: c, parentData: f, parentDataProperty: m }, v) {
    c.if((0, r._)`${f} !== undefined`, () => c.assign((0, r._)`${f}[${m}]`, v));
  }
  function S(c, f, m, v = i.Correct) {
    const g = v === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let $;
    switch (c) {
      case "null":
        return (0, r._)`${f} ${g} null`;
      case "array":
        $ = (0, r._)`Array.isArray(${f})`;
        break;
      case "object":
        $ = (0, r._)`${f} && typeof ${f} == "object" && !Array.isArray(${f})`;
        break;
      case "integer":
        $ = k((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        $ = k();
        break;
      default:
        return (0, r._)`typeof ${f} ${g} ${c}`;
    }
    return v === i.Correct ? $ : (0, r.not)($);
    function k(j = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, j, m ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  he.checkDataType = S;
  function E(c, f, m, v) {
    if (c.length === 1)
      return S(c[0], f, m, v);
    let g;
    const $ = (0, n.toHash)(c);
    if ($.array && $.object) {
      const k = (0, r._)`typeof ${f} != "object"`;
      g = $.null ? k : (0, r._)`!${f} || ${k}`, delete $.null, delete $.array, delete $.object;
    } else
      g = r.nil;
    $.number && delete $.integer;
    for (const k in $)
      g = (0, r.and)(g, S(k, f, m, v));
    return g;
  }
  he.checkDataTypes = E;
  const b = {
    message: ({ schema: c }) => `must be ${c}`,
    params: ({ schema: c, schemaValue: f }) => typeof c == "string" ? (0, r._)`{type: ${c}}` : (0, r._)`{type: ${f}}`
  };
  function h(c) {
    const f = d(c);
    (0, t.reportError)(f, b);
  }
  he.reportTypeError = h;
  function d(c) {
    const { gen: f, data: m, schema: v } = c, g = (0, n.schemaRefOrVal)(c, v, "type");
    return {
      gen: f,
      keyword: "type",
      data: m,
      schema: v.type,
      schemaCode: g,
      schemaValue: g,
      parentSchema: v,
      params: {},
      it: c
    };
  }
  return he;
}
var Ce = {}, mr;
function Yn() {
  if (mr) return Ce;
  mr = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.assignDefaults = void 0;
  const o = Y(), e = Z();
  function t(n, i) {
    const { properties: s, items: a } = n.schema;
    if (i === "object" && s)
      for (const l in s)
        r(n, l, s[l].default);
    else i === "array" && Array.isArray(a) && a.forEach((l, u) => r(n, u, l.default));
  }
  Ce.assignDefaults = t;
  function r(n, i, s) {
    const { gen: a, compositeRule: l, data: u, opts: p } = n;
    if (s === void 0)
      return;
    const w = (0, o._)`${u}${(0, o.getProperty)(i)}`;
    if (l) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${w}`);
      return;
    }
    let _ = (0, o._)`${w} === undefined`;
    p.useDefaults === "empty" && (_ = (0, o._)`${_} || ${w} === null || ${w} === ""`), a.if(_, (0, o._)`${w} = ${(0, o.stringify)(s)}`);
  }
  return Ce;
}
var be = {}, ne = {}, yr;
function we() {
  if (yr) return ne;
  yr = 1, Object.defineProperty(ne, "__esModule", { value: !0 }), ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
  const o = Y(), e = Z(), t = Me(), r = Z();
  function n(c, f) {
    const { gen: m, data: v, it: g } = c;
    m.if(p(m, v, f, g.opts.ownProperties), () => {
      c.setParams({ missingProperty: (0, o._)`${f}` }, !0), c.error();
    });
  }
  ne.checkReportMissingProp = n;
  function i({ gen: c, data: f, it: { opts: m } }, v, g) {
    return (0, o.or)(...v.map(($) => (0, o.and)(p(c, f, $, m.ownProperties), (0, o._)`${g} = ${$}`)));
  }
  ne.checkMissingProp = i;
  function s(c, f) {
    c.setParams({ missingProperty: f }, !0), c.error();
  }
  ne.reportMissingProp = s;
  function a(c) {
    return c.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, o._)`Object.prototype.hasOwnProperty`
    });
  }
  ne.hasPropFunc = a;
  function l(c, f, m) {
    return (0, o._)`${a(c)}.call(${f}, ${m})`;
  }
  ne.isOwnProperty = l;
  function u(c, f, m, v) {
    const g = (0, o._)`${f}${(0, o.getProperty)(m)} !== undefined`;
    return v ? (0, o._)`${g} && ${l(c, f, m)}` : g;
  }
  ne.propertyInData = u;
  function p(c, f, m, v) {
    const g = (0, o._)`${f}${(0, o.getProperty)(m)} === undefined`;
    return v ? (0, o.or)(g, (0, o.not)(l(c, f, m))) : g;
  }
  ne.noPropertyInData = p;
  function w(c) {
    return c ? Object.keys(c).filter((f) => f !== "__proto__") : [];
  }
  ne.allSchemaProperties = w;
  function _(c, f) {
    return w(f).filter((m) => !(0, e.alwaysValidSchema)(c, f[m]));
  }
  ne.schemaProperties = _;
  function S({ schemaCode: c, data: f, it: { gen: m, topSchemaRef: v, schemaPath: g, errorPath: $ }, it: k }, j, D, V) {
    const B = V ? (0, o._)`${c}, ${f}, ${v}${g}` : f, L = [
      [t.default.instancePath, (0, o.strConcat)(t.default.instancePath, $)],
      [t.default.parentData, k.parentData],
      [t.default.parentDataProperty, k.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    k.opts.dynamicRef && L.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const H = (0, o._)`${B}, ${m.object(...L)}`;
    return D !== o.nil ? (0, o._)`${j}.call(${D}, ${H})` : (0, o._)`${j}(${H})`;
  }
  ne.callValidateCode = S;
  const E = (0, o._)`new RegExp`;
  function b({ gen: c, it: { opts: f } }, m) {
    const v = f.unicodeRegExp ? "u" : "", { regExp: g } = f.code, $ = g(m, v);
    return c.scopeValue("pattern", {
      key: $.toString(),
      ref: $,
      code: (0, o._)`${g.code === "new RegExp" ? E : (0, r.useFunc)(c, g)}(${m}, ${v})`
    });
  }
  ne.usePattern = b;
  function h(c) {
    const { gen: f, data: m, keyword: v, it: g } = c, $ = f.name("valid");
    if (g.allErrors) {
      const j = f.let("valid", !0);
      return k(() => f.assign(j, !1)), j;
    }
    return f.var($, !0), k(() => f.break()), $;
    function k(j) {
      const D = f.const("len", (0, o._)`${m}.length`);
      f.forRange("i", 0, D, (V) => {
        c.subschema({
          keyword: v,
          dataProp: V,
          dataPropType: e.Type.Num
        }, $), f.if((0, o.not)($), j);
      });
    }
  }
  ne.validateArray = h;
  function d(c) {
    const { gen: f, schema: m, keyword: v, it: g } = c;
    if (!Array.isArray(m))
      throw new Error("ajv implementation error");
    if (m.some((D) => (0, e.alwaysValidSchema)(g, D)) && !g.opts.unevaluated)
      return;
    const k = f.let("valid", !1), j = f.name("_valid");
    f.block(() => m.forEach((D, V) => {
      const B = c.subschema({
        keyword: v,
        schemaProp: V,
        compositeRule: !0
      }, j);
      f.assign(k, (0, o._)`${k} || ${j}`), c.mergeValidEvaluated(B, j) || f.if((0, o.not)(k));
    })), c.result(k, () => c.reset(), () => c.error(!0));
  }
  return ne.validateUnion = d, ne;
}
var gr;
function Qn() {
  if (gr) return be;
  gr = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.validateKeywordUsage = be.validSchemaType = be.funcKeywordCode = be.macroKeywordCode = void 0;
  const o = Y(), e = Me(), t = we(), r = Nt();
  function n(_, S) {
    const { gen: E, keyword: b, schema: h, parentSchema: d, it: c } = _, f = S.macro.call(c.self, h, d, c), m = u(E, b, f);
    c.opts.validateSchema !== !1 && c.self.validateSchema(f, !0);
    const v = E.name("valid");
    _.subschema({
      schema: f,
      schemaPath: o.nil,
      errSchemaPath: `${c.errSchemaPath}/${b}`,
      topSchemaRef: m,
      compositeRule: !0
    }, v), _.pass(v, () => _.error(!0));
  }
  be.macroKeywordCode = n;
  function i(_, S) {
    var E;
    const { gen: b, keyword: h, schema: d, parentSchema: c, $data: f, it: m } = _;
    l(m, S);
    const v = !f && S.compile ? S.compile.call(m.self, d, c, m) : S.validate, g = u(b, h, v), $ = b.let("valid");
    _.block$data($, k), _.ok((E = S.valid) !== null && E !== void 0 ? E : $);
    function k() {
      if (S.errors === !1)
        V(), S.modifying && s(_), B(() => _.error());
      else {
        const L = S.async ? j() : D();
        S.modifying && s(_), B(() => a(_, L));
      }
    }
    function j() {
      const L = b.let("ruleErrs", null);
      return b.try(() => V((0, o._)`await `), (H) => b.assign($, !1).if((0, o._)`${H} instanceof ${m.ValidationError}`, () => b.assign(L, (0, o._)`${H}.errors`), () => b.throw(H))), L;
    }
    function D() {
      const L = (0, o._)`${g}.errors`;
      return b.assign(L, null), V(o.nil), L;
    }
    function V(L = S.async ? (0, o._)`await ` : o.nil) {
      const H = m.opts.passContext ? e.default.this : e.default.self, ce = !("compile" in S && !f || S.schema === !1);
      b.assign($, (0, o._)`${L}${(0, t.callValidateCode)(_, g, H, ce)}`, S.modifying);
    }
    function B(L) {
      var H;
      b.if((0, o.not)((H = S.valid) !== null && H !== void 0 ? H : $), L);
    }
  }
  be.funcKeywordCode = i;
  function s(_) {
    const { gen: S, data: E, it: b } = _;
    S.if(b.parentData, () => S.assign(E, (0, o._)`${b.parentData}[${b.parentDataProperty}]`));
  }
  function a(_, S) {
    const { gen: E } = _;
    E.if((0, o._)`Array.isArray(${S})`, () => {
      E.assign(e.default.vErrors, (0, o._)`${e.default.vErrors} === null ? ${S} : ${e.default.vErrors}.concat(${S})`).assign(e.default.errors, (0, o._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function l({ schemaEnv: _ }, S) {
    if (S.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, S, E) {
    if (E === void 0)
      throw new Error(`keyword "${S}" failed to compile`);
    return _.scopeValue("keyword", typeof E == "function" ? { ref: E } : { ref: E, code: (0, o.stringify)(E) });
  }
  function p(_, S, E = !1) {
    return !S.length || S.some((b) => b === "array" ? Array.isArray(_) : b === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == b || E && typeof _ > "u");
  }
  be.validSchemaType = p;
  function w({ schema: _, opts: S, self: E, errSchemaPath: b }, h, d) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(d) : h.keyword !== d)
      throw new Error("ajv implementation error");
    const c = h.dependencies;
    if (c?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${d}: ${c.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[d])) {
      const m = `keyword "${d}" value is invalid at path "${b}": ` + E.errorsText(h.validateSchema.errors);
      if (S.validateSchema === "log")
        E.logger.error(m);
      else
        throw new Error(m);
    }
  }
  return be.validateKeywordUsage = w, be;
}
var Pe = {}, vr;
function Xn() {
  if (vr) return Pe;
  vr = 1, Object.defineProperty(Pe, "__esModule", { value: !0 }), Pe.extendSubschemaMode = Pe.extendSubschemaData = Pe.getSubschema = void 0;
  const o = Y(), e = Z();
  function t(i, { keyword: s, schemaProp: a, schema: l, schemaPath: u, errSchemaPath: p, topSchemaRef: w }) {
    if (s !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (s !== void 0) {
      const _ = i.schema[s];
      return a === void 0 ? {
        schema: _,
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}`
      } : {
        schema: _[a],
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}${(0, o.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (l !== void 0) {
      if (u === void 0 || p === void 0 || w === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: u,
        topSchemaRef: w,
        errSchemaPath: p
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Pe.getSubschema = t;
  function r(i, s, { dataProp: a, dataPropType: l, data: u, dataTypes: p, propertyName: w }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = s;
    if (a !== void 0) {
      const { errorPath: E, dataPathArr: b, opts: h } = s, d = _.let("data", (0, o._)`${s.data}${(0, o.getProperty)(a)}`, !0);
      S(d), i.errorPath = (0, o.str)`${E}${(0, e.getErrorPath)(a, l, h.jsPropertySyntax)}`, i.parentDataProperty = (0, o._)`${a}`, i.dataPathArr = [...b, i.parentDataProperty];
    }
    if (u !== void 0) {
      const E = u instanceof o.Name ? u : _.let("data", u, !0);
      S(E), w !== void 0 && (i.propertyName = w);
    }
    p && (i.dataTypes = p);
    function S(E) {
      i.data = E, i.dataLevel = s.dataLevel + 1, i.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), i.parentData = s.data, i.dataNames = [...s.dataNames, E];
    }
  }
  Pe.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: s, jtdMetadata: a, compositeRule: l, createErrors: u, allErrors: p }) {
    l !== void 0 && (i.compositeRule = l), u !== void 0 && (i.createErrors = u), p !== void 0 && (i.allErrors = p), i.jtdDiscriminator = s, i.jtdMetadata = a;
  }
  return Pe.extendSubschemaMode = n, Pe;
}
var pe = {}, Vt, br;
function _n() {
  return br || (br = 1, Vt = function o(e, t) {
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
  }), Vt;
}
var zt = { exports: {} }, wr;
function Zn() {
  if (wr) return zt.exports;
  wr = 1;
  var o = zt.exports = function(r, n, i) {
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
  function e(r, n, i, s, a, l, u, p, w, _) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      n(s, a, l, u, p, w, _);
      for (var S in s) {
        var E = s[S];
        if (Array.isArray(E)) {
          if (S in o.arrayKeywords)
            for (var b = 0; b < E.length; b++)
              e(r, n, i, E[b], a + "/" + S + "/" + b, l, a, S, s, b);
        } else if (S in o.propsKeywords) {
          if (E && typeof E == "object")
            for (var h in E)
              e(r, n, i, E[h], a + "/" + S + "/" + t(h), l, a, S, s, h);
        } else (S in o.keywords || r.allKeys && !(S in o.skipKeywords)) && e(r, n, i, E, a + "/" + S, l, a, S, s);
      }
      i(s, a, l, u, p, w, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return zt.exports;
}
var $r;
function Rt() {
  if ($r) return pe;
  $r = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.getSchemaRefs = pe.resolveUrl = pe.normalizeId = pe._getFullPath = pe.getFullPath = pe.inlineRef = void 0;
  const o = Z(), e = _n(), t = Zn(), r = /* @__PURE__ */ new Set([
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
  function n(b, h = !0) {
    return typeof b == "boolean" ? !0 : h === !0 ? !s(b) : h ? a(b) <= h : !1;
  }
  pe.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function s(b) {
    for (const h in b) {
      if (i.has(h))
        return !0;
      const d = b[h];
      if (Array.isArray(d) && d.some(s) || typeof d == "object" && s(d))
        return !0;
    }
    return !1;
  }
  function a(b) {
    let h = 0;
    for (const d in b) {
      if (d === "$ref")
        return 1 / 0;
      if (h++, !r.has(d) && (typeof b[d] == "object" && (0, o.eachItem)(b[d], (c) => h += a(c)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function l(b, h = "", d) {
    d !== !1 && (h = w(h));
    const c = b.parse(h);
    return u(b, c);
  }
  pe.getFullPath = l;
  function u(b, h) {
    return b.serialize(h).split("#")[0] + "#";
  }
  pe._getFullPath = u;
  const p = /#\/?$/;
  function w(b) {
    return b ? b.replace(p, "") : "";
  }
  pe.normalizeId = w;
  function _(b, h, d) {
    return d = w(d), b.resolve(h, d);
  }
  pe.resolveUrl = _;
  const S = /^[a-z_][-a-z0-9._]*$/i;
  function E(b, h) {
    if (typeof b == "boolean")
      return {};
    const { schemaId: d, uriResolver: c } = this.opts, f = w(b[d] || h), m = { "": f }, v = l(c, f, !1), g = {}, $ = /* @__PURE__ */ new Set();
    return t(b, { allKeys: !0 }, (D, V, B, L) => {
      if (L === void 0)
        return;
      const H = v + V;
      let ce = m[L];
      typeof D[d] == "string" && (ce = me.call(this, D[d])), ye.call(this, D.$anchor), ye.call(this, D.$dynamicAnchor), m[V] = ce;
      function me(ee) {
        const z = this.opts.uriResolver.resolve;
        if (ee = w(ce ? z(ce, ee) : ee), $.has(ee))
          throw j(ee);
        $.add(ee);
        let q = this.refs[ee];
        return typeof q == "string" && (q = this.refs[q]), typeof q == "object" ? k(D, q.schema, ee) : ee !== w(H) && (ee[0] === "#" ? (k(D, g[ee], ee), g[ee] = D) : this.refs[ee] = H), ee;
      }
      function ye(ee) {
        if (typeof ee == "string") {
          if (!S.test(ee))
            throw new Error(`invalid anchor "${ee}"`);
          me.call(this, `#${ee}`);
        }
      }
    }), g;
    function k(D, V, B) {
      if (V !== void 0 && !e(D, V))
        throw j(B);
    }
    function j(D) {
      return new Error(`reference "${D}" resolves to more than one schema`);
    }
  }
  return pe.getSchemaRefs = E, pe;
}
var _r;
function At() {
  if (_r) return $e;
  _r = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.getData = $e.KeywordCxt = $e.validateFunctionCode = void 0;
  const o = Wn(), e = Tt(), t = $n(), r = Tt(), n = Yn(), i = Qn(), s = Xn(), a = Y(), l = Me(), u = Rt(), p = Z(), w = Nt();
  function _(P) {
    if (v(P) && ($(P), m(P))) {
      h(P);
      return;
    }
    S(P, () => (0, o.topBoolOrEmptySchema)(P));
  }
  $e.validateFunctionCode = _;
  function S({ gen: P, validateName: T, schema: C, schemaEnv: O, opts: x }, U) {
    x.code.es5 ? P.func(T, (0, a._)`${l.default.data}, ${l.default.valCxt}`, O.$async, () => {
      P.code((0, a._)`"use strict"; ${c(C, x)}`), b(P, x), P.code(U);
    }) : P.func(T, (0, a._)`${l.default.data}, ${E(x)}`, O.$async, () => P.code(c(C, x)).code(U));
  }
  function E(P) {
    return (0, a._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${P.dynamicRef ? (0, a._)`, ${l.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function b(P, T) {
    P.if(l.default.valCxt, () => {
      P.var(l.default.instancePath, (0, a._)`${l.default.valCxt}.${l.default.instancePath}`), P.var(l.default.parentData, (0, a._)`${l.default.valCxt}.${l.default.parentData}`), P.var(l.default.parentDataProperty, (0, a._)`${l.default.valCxt}.${l.default.parentDataProperty}`), P.var(l.default.rootData, (0, a._)`${l.default.valCxt}.${l.default.rootData}`), T.dynamicRef && P.var(l.default.dynamicAnchors, (0, a._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      P.var(l.default.instancePath, (0, a._)`""`), P.var(l.default.parentData, (0, a._)`undefined`), P.var(l.default.parentDataProperty, (0, a._)`undefined`), P.var(l.default.rootData, l.default.data), T.dynamicRef && P.var(l.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(P) {
    const { schema: T, opts: C, gen: O } = P;
    S(P, () => {
      C.$comment && T.$comment && L(P), D(P), O.let(l.default.vErrors, null), O.let(l.default.errors, 0), C.unevaluated && d(P), k(P), H(P);
    });
  }
  function d(P) {
    const { gen: T, validateName: C } = P;
    P.evaluated = T.const("evaluated", (0, a._)`${C}.evaluated`), T.if((0, a._)`${P.evaluated}.dynamicProps`, () => T.assign((0, a._)`${P.evaluated}.props`, (0, a._)`undefined`)), T.if((0, a._)`${P.evaluated}.dynamicItems`, () => T.assign((0, a._)`${P.evaluated}.items`, (0, a._)`undefined`));
  }
  function c(P, T) {
    const C = typeof P == "object" && P[T.schemaId];
    return C && (T.code.source || T.code.process) ? (0, a._)`/*# sourceURL=${C} */` : a.nil;
  }
  function f(P, T) {
    if (v(P) && ($(P), m(P))) {
      g(P, T);
      return;
    }
    (0, o.boolOrEmptySchema)(P, T);
  }
  function m({ schema: P, self: T }) {
    if (typeof P == "boolean")
      return !P;
    for (const C in P)
      if (T.RULES.all[C])
        return !0;
    return !1;
  }
  function v(P) {
    return typeof P.schema != "boolean";
  }
  function g(P, T) {
    const { schema: C, gen: O, opts: x } = P;
    x.$comment && C.$comment && L(P), V(P), B(P);
    const U = O.const("_errs", l.default.errors);
    k(P, U), O.var(T, (0, a._)`${U} === ${l.default.errors}`);
  }
  function $(P) {
    (0, p.checkUnknownRules)(P), j(P);
  }
  function k(P, T) {
    if (P.opts.jtd)
      return me(P, [], !1, T);
    const C = (0, e.getSchemaTypes)(P.schema), O = (0, e.coerceAndCheckDataType)(P, C);
    me(P, C, !O, T);
  }
  function j(P) {
    const { schema: T, errSchemaPath: C, opts: O, self: x } = P;
    T.$ref && O.ignoreKeywordsWithRef && (0, p.schemaHasRulesButRef)(T, x.RULES) && x.logger.warn(`$ref: keywords ignored in schema at path "${C}"`);
  }
  function D(P) {
    const { schema: T, opts: C } = P;
    T.default !== void 0 && C.useDefaults && C.strictSchema && (0, p.checkStrictMode)(P, "default is ignored in the schema root");
  }
  function V(P) {
    const T = P.schema[P.opts.schemaId];
    T && (P.baseId = (0, u.resolveUrl)(P.opts.uriResolver, P.baseId, T));
  }
  function B(P) {
    if (P.schema.$async && !P.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function L({ gen: P, schemaEnv: T, schema: C, errSchemaPath: O, opts: x }) {
    const U = C.$comment;
    if (x.$comment === !0)
      P.code((0, a._)`${l.default.self}.logger.log(${U})`);
    else if (typeof x.$comment == "function") {
      const X = (0, a.str)`${O}/$comment`, te = P.scopeValue("root", { ref: T.root });
      P.code((0, a._)`${l.default.self}.opts.$comment(${U}, ${X}, ${te}.schema)`);
    }
  }
  function H(P) {
    const { gen: T, schemaEnv: C, validateName: O, ValidationError: x, opts: U } = P;
    C.$async ? T.if((0, a._)`${l.default.errors} === 0`, () => T.return(l.default.data), () => T.throw((0, a._)`new ${x}(${l.default.vErrors})`)) : (T.assign((0, a._)`${O}.errors`, l.default.vErrors), U.unevaluated && ce(P), T.return((0, a._)`${l.default.errors} === 0`));
  }
  function ce({ gen: P, evaluated: T, props: C, items: O }) {
    C instanceof a.Name && P.assign((0, a._)`${T}.props`, C), O instanceof a.Name && P.assign((0, a._)`${T}.items`, O);
  }
  function me(P, T, C, O) {
    const { gen: x, schema: U, data: X, allErrors: te, opts: oe, self: le } = P, { RULES: se } = le;
    if (U.$ref && (oe.ignoreKeywordsWithRef || !(0, p.schemaHasRulesButRef)(U, se))) {
      x.block(() => F(P, "$ref", se.all.$ref.definition));
      return;
    }
    oe.jtd || ee(P, T), x.block(() => {
      for (const ue of se.rules)
        ae(ue);
      ae(se.post);
    });
    function ae(ue) {
      (0, t.shouldUseGroup)(U, ue) && (ue.type ? (x.if((0, r.checkDataType)(ue.type, X, oe.strictNumbers)), ye(P, ue), T.length === 1 && T[0] === ue.type && C && (x.else(), (0, r.reportTypeError)(P)), x.endIf()) : ye(P, ue), te || x.if((0, a._)`${l.default.errors} === ${O || 0}`));
    }
  }
  function ye(P, T) {
    const { gen: C, schema: O, opts: { useDefaults: x } } = P;
    x && (0, n.assignDefaults)(P, T.type), C.block(() => {
      for (const U of T.rules)
        (0, t.shouldUseRule)(O, U) && F(P, U.keyword, U.definition, T.type);
    });
  }
  function ee(P, T) {
    P.schemaEnv.meta || !P.opts.strictTypes || (z(P, T), P.opts.allowUnionTypes || q(P, T), N(P, P.dataTypes));
  }
  function z(P, T) {
    if (T.length) {
      if (!P.dataTypes.length) {
        P.dataTypes = T;
        return;
      }
      T.forEach((C) => {
        R(P.dataTypes, C) || M(P, `type "${C}" not allowed by context "${P.dataTypes.join(",")}"`);
      }), y(P, T);
    }
  }
  function q(P, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && M(P, "use allowUnionTypes to allow union type keyword");
  }
  function N(P, T) {
    const C = P.self.RULES.all;
    for (const O in C) {
      const x = C[O];
      if (typeof x == "object" && (0, t.shouldUseRule)(P.schema, x)) {
        const { type: U } = x.definition;
        U.length && !U.some((X) => I(T, X)) && M(P, `missing type "${U.join(",")}" for keyword "${O}"`);
      }
    }
  }
  function I(P, T) {
    return P.includes(T) || T === "number" && P.includes("integer");
  }
  function R(P, T) {
    return P.includes(T) || T === "integer" && P.includes("number");
  }
  function y(P, T) {
    const C = [];
    for (const O of P.dataTypes)
      R(T, O) ? C.push(O) : T.includes("integer") && O === "number" && C.push("integer");
    P.dataTypes = C;
  }
  function M(P, T) {
    const C = P.schemaEnv.baseId + P.errSchemaPath;
    T += ` at "${C}" (strictTypes)`, (0, p.checkStrictMode)(P, T, P.opts.strictTypes);
  }
  class A {
    constructor(T, C, O) {
      if ((0, i.validateKeywordUsage)(T, C, O), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = O, this.data = T.data, this.schema = T.schema[O], this.$data = C.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, p.schemaRefOrVal)(T, this.schema, O, this.$data), this.schemaType = C.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = C, this.$data)
        this.schemaCode = T.gen.const("vSchema", W(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, C.schemaType, C.allowUndefined))
        throw new Error(`${O} value must be ${JSON.stringify(C.schemaType)}`);
      ("code" in C ? C.trackErrors : C.errors !== !1) && (this.errsCount = T.gen.const("_errs", l.default.errors));
    }
    result(T, C, O) {
      this.failResult((0, a.not)(T), C, O);
    }
    failResult(T, C, O) {
      this.gen.if(T), O ? O() : this.error(), C ? (this.gen.else(), C(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(T, C) {
      this.failResult((0, a.not)(T), void 0, C);
    }
    fail(T) {
      if (T === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(T), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(T) {
      if (!this.$data)
        return this.fail(T);
      const { schemaCode: C } = this;
      this.fail((0, a._)`${C} !== undefined && (${(0, a.or)(this.invalid$data(), T)})`);
    }
    error(T, C, O) {
      if (C) {
        this.setParams(C), this._error(T, O), this.setParams({});
        return;
      }
      this._error(T, O);
    }
    _error(T, C) {
      (T ? w.reportExtraError : w.reportError)(this, this.def.error, C);
    }
    $dataError() {
      (0, w.reportError)(this, this.def.$dataError || w.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, w.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(T) {
      this.allErrors || this.gen.if(T);
    }
    setParams(T, C) {
      C ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, C, O = a.nil) {
      this.gen.block(() => {
        this.check$data(T, O), C();
      });
    }
    check$data(T = a.nil, C = a.nil) {
      if (!this.$data)
        return;
      const { gen: O, schemaCode: x, schemaType: U, def: X } = this;
      O.if((0, a.or)((0, a._)`${x} === undefined`, C)), T !== a.nil && O.assign(T, !0), (U.length || X.validateSchema) && (O.elseIf(this.invalid$data()), this.$dataError(), T !== a.nil && O.assign(T, !1)), O.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: C, schemaType: O, def: x, it: U } = this;
      return (0, a.or)(X(), te());
      function X() {
        if (O.length) {
          if (!(C instanceof a.Name))
            throw new Error("ajv implementation error");
          const oe = Array.isArray(O) ? O : [O];
          return (0, a._)`${(0, r.checkDataTypes)(oe, C, U.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function te() {
        if (x.validateSchema) {
          const oe = T.scopeValue("validate$data", { ref: x.validateSchema });
          return (0, a._)`!${oe}(${C})`;
        }
        return a.nil;
      }
    }
    subschema(T, C) {
      const O = (0, s.getSubschema)(this.it, T);
      (0, s.extendSubschemaData)(O, this.it, T), (0, s.extendSubschemaMode)(O, T);
      const x = { ...this.it, ...O, items: void 0, props: void 0 };
      return f(x, C), x;
    }
    mergeEvaluated(T, C) {
      const { it: O, gen: x } = this;
      O.opts.unevaluated && (O.props !== !0 && T.props !== void 0 && (O.props = p.mergeEvaluated.props(x, T.props, O.props, C)), O.items !== !0 && T.items !== void 0 && (O.items = p.mergeEvaluated.items(x, T.items, O.items, C)));
    }
    mergeValidEvaluated(T, C) {
      const { it: O, gen: x } = this;
      if (O.opts.unevaluated && (O.props !== !0 || O.items !== !0))
        return x.if(C, () => this.mergeEvaluated(T, a.Name)), !0;
    }
  }
  $e.KeywordCxt = A;
  function F(P, T, C, O) {
    const x = new A(P, C, T);
    "code" in C ? C.code(x, O) : x.$data && C.validate ? (0, i.funcKeywordCode)(x, C) : "macro" in C ? (0, i.macroKeywordCode)(x, C) : (C.compile || C.validate) && (0, i.funcKeywordCode)(x, C);
  }
  const G = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function W(P, { dataLevel: T, dataNames: C, dataPathArr: O }) {
    let x, U;
    if (P === "")
      return l.default.rootData;
    if (P[0] === "/") {
      if (!G.test(P))
        throw new Error(`Invalid JSON-pointer: ${P}`);
      x = P, U = l.default.rootData;
    } else {
      const le = Q.exec(P);
      if (!le)
        throw new Error(`Invalid JSON-pointer: ${P}`);
      const se = +le[1];
      if (x = le[2], x === "#") {
        if (se >= T)
          throw new Error(oe("property/index", se));
        return O[T - se];
      }
      if (se > T)
        throw new Error(oe("data", se));
      if (U = C[T - se], !x)
        return U;
    }
    let X = U;
    const te = x.split("/");
    for (const le of te)
      le && (U = (0, a._)`${U}${(0, a.getProperty)((0, p.unescapeJsonPointer)(le))}`, X = (0, a._)`${X} && ${U}`);
    return X;
    function oe(le, se) {
      return `Cannot access ${le} ${se} levels up, current level is ${T}`;
    }
  }
  return $e.getData = W, $e;
}
var Ue = {}, Pr;
function Wt() {
  if (Pr) return Ue;
  Pr = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  class o extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Ue.default = o, Ue;
}
var Ge = {}, Sr;
function jt() {
  if (Sr) return Ge;
  Sr = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const o = Rt();
  class e extends Error {
    constructor(r, n, i, s) {
      super(s || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, o.resolveUrl)(r, n, i), this.missingSchema = (0, o.normalizeId)((0, o.getFullPath)(r, this.missingRef));
    }
  }
  return Ge.default = e, Ge;
}
var ge = {}, Er;
function Yt() {
  if (Er) return ge;
  Er = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.resolveSchema = ge.getCompilingSchema = ge.resolveRef = ge.compileSchema = ge.SchemaEnv = void 0;
  const o = Y(), e = Wt(), t = Me(), r = Rt(), n = Z(), i = At();
  class s {
    constructor(d) {
      var c;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof d.schema == "object" && (f = d.schema), this.schema = d.schema, this.schemaId = d.schemaId, this.root = d.root || this, this.baseId = (c = d.baseId) !== null && c !== void 0 ? c : (0, r.normalizeId)(f?.[d.schemaId || "$id"]), this.schemaPath = d.schemaPath, this.localRefs = d.localRefs, this.meta = d.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  ge.SchemaEnv = s;
  function a(h) {
    const d = p.call(this, h);
    if (d)
      return d;
    const c = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: m } = this.opts.code, { ownProperties: v } = this.opts, g = new o.CodeGen(this.scope, { es5: f, lines: m, ownProperties: v });
    let $;
    h.$async && ($ = g.scopeValue("Error", {
      ref: e.default,
      code: (0, o._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const k = g.scopeName("validate");
    h.validateName = k;
    const j = {
      gen: g,
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
      topSchemaRef: g.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, o.stringify)(h.schema) } : { ref: h.schema }),
      validateName: k,
      ValidationError: $,
      schema: h.schema,
      schemaEnv: h,
      rootId: c,
      baseId: h.baseId || c,
      schemaPath: o.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, o._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(j), g.optimize(this.opts.code.optimize);
      const V = g.toString();
      D = `${g.scopeRefs(t.default.scope)}return ${V}`, this.opts.code.process && (D = this.opts.code.process(D, h));
      const L = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(k, { ref: L }), L.errors = null, L.schema = h.schema, L.schemaEnv = h, h.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: k, validateCode: V, scopeValues: g._values }), this.opts.unevaluated) {
        const { props: H, items: ce } = j;
        L.evaluated = {
          props: H instanceof o.Name ? void 0 : H,
          items: ce instanceof o.Name ? void 0 : ce,
          dynamicProps: H instanceof o.Name,
          dynamicItems: ce instanceof o.Name
        }, L.source && (L.source.evaluated = (0, o.stringify)(L.evaluated));
      }
      return h.validate = L, h;
    } catch (V) {
      throw delete h.validate, delete h.validateName, D && this.logger.error("Error compiling schema, function code:", D), V;
    } finally {
      this._compilations.delete(h);
    }
  }
  ge.compileSchema = a;
  function l(h, d, c) {
    var f;
    c = (0, r.resolveUrl)(this.opts.uriResolver, d, c);
    const m = h.refs[c];
    if (m)
      return m;
    let v = _.call(this, h, c);
    if (v === void 0) {
      const g = (f = h.localRefs) === null || f === void 0 ? void 0 : f[c], { schemaId: $ } = this.opts;
      g && (v = new s({ schema: g, schemaId: $, root: h, baseId: d }));
    }
    if (v !== void 0)
      return h.refs[c] = u.call(this, v);
  }
  ge.resolveRef = l;
  function u(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function p(h) {
    for (const d of this._compilations)
      if (w(d, h))
        return d;
  }
  ge.getCompilingSchema = p;
  function w(h, d) {
    return h.schema === d.schema && h.root === d.root && h.baseId === d.baseId;
  }
  function _(h, d) {
    let c;
    for (; typeof (c = this.refs[d]) == "string"; )
      d = c;
    return c || this.schemas[d] || S.call(this, h, d);
  }
  function S(h, d) {
    const c = this.opts.uriResolver.parse(d), f = (0, r._getFullPath)(this.opts.uriResolver, c);
    let m = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === m)
      return b.call(this, c, h);
    const v = (0, r.normalizeId)(f), g = this.refs[v] || this.schemas[v];
    if (typeof g == "string") {
      const $ = S.call(this, h, g);
      return typeof $?.schema != "object" ? void 0 : b.call(this, c, $);
    }
    if (typeof g?.schema == "object") {
      if (g.validate || a.call(this, g), v === (0, r.normalizeId)(d)) {
        const { schema: $ } = g, { schemaId: k } = this.opts, j = $[k];
        return j && (m = (0, r.resolveUrl)(this.opts.uriResolver, m, j)), new s({ schema: $, schemaId: k, root: h, baseId: m });
      }
      return b.call(this, c, g);
    }
  }
  ge.resolveSchema = S;
  const E = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function b(h, { baseId: d, schema: c, root: f }) {
    var m;
    if (((m = h.fragment) === null || m === void 0 ? void 0 : m[0]) !== "/")
      return;
    for (const $ of h.fragment.slice(1).split("/")) {
      if (typeof c == "boolean")
        return;
      const k = c[(0, n.unescapeFragment)($)];
      if (k === void 0)
        return;
      c = k;
      const j = typeof c == "object" && c[this.opts.schemaId];
      !E.has($) && j && (d = (0, r.resolveUrl)(this.opts.uriResolver, d, j));
    }
    let v;
    if (typeof c != "boolean" && c.$ref && !(0, n.schemaHasRulesButRef)(c, this.RULES)) {
      const $ = (0, r.resolveUrl)(this.opts.uriResolver, d, c.$ref);
      v = S.call(this, f, $);
    }
    const { schemaId: g } = this.opts;
    if (v = v || new s({ schema: c, schemaId: g, root: f, baseId: d }), v.schema !== v.root.schema)
      return v;
  }
  return ge;
}
const ei = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ti = "Meta-schema for $data reference (JSON AnySchema extension proposal)", ri = "object", ni = ["$data"], ii = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, oi = !1, si = {
  $id: ei,
  description: ti,
  type: ri,
  required: ni,
  properties: ii,
  additionalProperties: oi
};
var Be = {}, Ie = { exports: {} }, Ft, Mr;
function ai() {
  return Mr || (Mr = 1, Ft = {
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
  }), Ft;
}
var Lt, Tr;
function ci() {
  if (Tr) return Lt;
  Tr = 1;
  const { HEX: o } = ai(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(b) {
    if (a(b, ".") < 3)
      return { host: b, isIPV4: !1 };
    const h = b.match(e) || [], [d] = h;
    return d ? { host: s(d, "."), isIPV4: !0 } : { host: b, isIPV4: !1 };
  }
  function r(b, h = !1) {
    let d = "", c = !0;
    for (const f of b) {
      if (o[f] === void 0) return;
      f !== "0" && c === !0 && (c = !1), c || (d += f);
    }
    return h && d.length === 0 && (d = "0"), d;
  }
  function n(b) {
    let h = 0;
    const d = { error: !1, address: "", zone: "" }, c = [], f = [];
    let m = !1, v = !1, g = !1;
    function $() {
      if (f.length) {
        if (m === !1) {
          const k = r(f);
          if (k !== void 0)
            c.push(k);
          else
            return d.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let k = 0; k < b.length; k++) {
      const j = b[k];
      if (!(j === "[" || j === "]"))
        if (j === ":") {
          if (v === !0 && (g = !0), !$())
            break;
          if (h++, c.push(":"), h > 7) {
            d.error = !0;
            break;
          }
          k - 1 >= 0 && b[k - 1] === ":" && (v = !0);
          continue;
        } else if (j === "%") {
          if (!$())
            break;
          m = !0;
        } else {
          f.push(j);
          continue;
        }
    }
    return f.length && (m ? d.zone = f.join("") : g ? c.push(f.join("")) : c.push(r(f))), d.address = c.join(""), d;
  }
  function i(b) {
    if (a(b, ":") < 2)
      return { host: b, isIPV6: !1 };
    const h = n(b);
    if (h.error)
      return { host: b, isIPV6: !1 };
    {
      let d = h.address, c = h.address;
      return h.zone && (d += "%" + h.zone, c += "%25" + h.zone), { host: d, escapedHost: c, isIPV6: !0 };
    }
  }
  function s(b, h) {
    let d = "", c = !0;
    const f = b.length;
    for (let m = 0; m < f; m++) {
      const v = b[m];
      v === "0" && c ? (m + 1 <= f && b[m + 1] === h || m + 1 === f) && (d += v, c = !1) : (v === h ? c = !0 : c = !1, d += v);
    }
    return d;
  }
  function a(b, h) {
    let d = 0;
    for (let c = 0; c < b.length; c++)
      b[c] === h && d++;
    return d;
  }
  const l = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, p = /^\/\.\.(?:\/|$)/u, w = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(b) {
    const h = [];
    for (; b.length; )
      if (b.match(l))
        b = b.replace(l, "");
      else if (b.match(u))
        b = b.replace(u, "/");
      else if (b.match(p))
        b = b.replace(p, "/"), h.pop();
      else if (b === "." || b === "..")
        b = "";
      else {
        const d = b.match(w);
        if (d) {
          const c = d[0];
          b = b.slice(c.length), h.push(c);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function S(b, h) {
    const d = h !== !0 ? escape : unescape;
    return b.scheme !== void 0 && (b.scheme = d(b.scheme)), b.userinfo !== void 0 && (b.userinfo = d(b.userinfo)), b.host !== void 0 && (b.host = d(b.host)), b.path !== void 0 && (b.path = d(b.path)), b.query !== void 0 && (b.query = d(b.query)), b.fragment !== void 0 && (b.fragment = d(b.fragment)), b;
  }
  function E(b) {
    const h = [];
    if (b.userinfo !== void 0 && (h.push(b.userinfo), h.push("@")), b.host !== void 0) {
      let d = unescape(b.host);
      const c = t(d);
      if (c.isIPV4)
        d = c.host;
      else {
        const f = i(c.host);
        f.isIPV6 === !0 ? d = `[${f.escapedHost}]` : d = b.host;
      }
      h.push(d);
    }
    return (typeof b.port == "number" || typeof b.port == "string") && (h.push(":"), h.push(String(b.port))), h.length ? h.join("") : void 0;
  }
  return Lt = {
    recomposeAuthority: E,
    normalizeComponentEncoding: S,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Lt;
}
var Ut, kr;
function li() {
  if (kr) return Ut;
  kr = 1;
  const o = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function t(c) {
    return typeof c.secure == "boolean" ? c.secure : String(c.scheme).toLowerCase() === "wss";
  }
  function r(c) {
    return c.host || (c.error = c.error || "HTTP URIs must have a host."), c;
  }
  function n(c) {
    const f = String(c.scheme).toLowerCase() === "https";
    return (c.port === (f ? 443 : 80) || c.port === "") && (c.port = void 0), c.path || (c.path = "/"), c;
  }
  function i(c) {
    return c.secure = t(c), c.resourceName = (c.path || "/") + (c.query ? "?" + c.query : ""), c.path = void 0, c.query = void 0, c;
  }
  function s(c) {
    if ((c.port === (t(c) ? 443 : 80) || c.port === "") && (c.port = void 0), typeof c.secure == "boolean" && (c.scheme = c.secure ? "wss" : "ws", c.secure = void 0), c.resourceName) {
      const [f, m] = c.resourceName.split("?");
      c.path = f && f !== "/" ? f : void 0, c.query = m, c.resourceName = void 0;
    }
    return c.fragment = void 0, c;
  }
  function a(c, f) {
    if (!c.path)
      return c.error = "URN can not be parsed", c;
    const m = c.path.match(e);
    if (m) {
      const v = f.scheme || c.scheme || "urn";
      c.nid = m[1].toLowerCase(), c.nss = m[2];
      const g = `${v}:${f.nid || c.nid}`, $ = d[g];
      c.path = void 0, $ && (c = $.parse(c, f));
    } else
      c.error = c.error || "URN can not be parsed.";
    return c;
  }
  function l(c, f) {
    const m = f.scheme || c.scheme || "urn", v = c.nid.toLowerCase(), g = `${m}:${f.nid || v}`, $ = d[g];
    $ && (c = $.serialize(c, f));
    const k = c, j = c.nss;
    return k.path = `${v || f.nid}:${j}`, f.skipEscape = !0, k;
  }
  function u(c, f) {
    const m = c;
    return m.uuid = m.nss, m.nss = void 0, !f.tolerant && (!m.uuid || !o.test(m.uuid)) && (m.error = m.error || "UUID is not valid."), m;
  }
  function p(c) {
    const f = c;
    return f.nss = (c.uuid || "").toLowerCase(), f;
  }
  const w = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, _ = {
    scheme: "https",
    domainHost: w.domainHost,
    parse: r,
    serialize: n
  }, S = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: s
  }, E = {
    scheme: "wss",
    domainHost: S.domainHost,
    parse: S.parse,
    serialize: S.serialize
  }, d = {
    http: w,
    https: _,
    ws: S,
    wss: E,
    urn: {
      scheme: "urn",
      parse: a,
      serialize: l,
      skipNormalize: !0
    },
    "urn:uuid": {
      scheme: "urn:uuid",
      parse: u,
      serialize: p,
      skipNormalize: !0
    }
  };
  return Ut = d, Ut;
}
var Nr;
function ui() {
  if (Nr) return Ie.exports;
  Nr = 1;
  const { normalizeIPv6: o, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = ci(), i = li();
  function s(h, d) {
    return typeof h == "string" ? h = p(E(h, d), d) : typeof h == "object" && (h = E(p(h, d), d)), h;
  }
  function a(h, d, c) {
    const f = Object.assign({ scheme: "null" }, c), m = l(E(h, f), E(d, f), f, !0);
    return p(m, { ...f, skipEscape: !0 });
  }
  function l(h, d, c, f) {
    const m = {};
    return f || (h = E(p(h, c), c), d = E(p(d, c), c)), c = c || {}, !c.tolerant && d.scheme ? (m.scheme = d.scheme, m.userinfo = d.userinfo, m.host = d.host, m.port = d.port, m.path = t(d.path || ""), m.query = d.query) : (d.userinfo !== void 0 || d.host !== void 0 || d.port !== void 0 ? (m.userinfo = d.userinfo, m.host = d.host, m.port = d.port, m.path = t(d.path || ""), m.query = d.query) : (d.path ? (d.path.charAt(0) === "/" ? m.path = t(d.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? m.path = "/" + d.path : h.path ? m.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + d.path : m.path = d.path, m.path = t(m.path)), m.query = d.query) : (m.path = h.path, d.query !== void 0 ? m.query = d.query : m.query = h.query), m.userinfo = h.userinfo, m.host = h.host, m.port = h.port), m.scheme = h.scheme), m.fragment = d.fragment, m;
  }
  function u(h, d, c) {
    return typeof h == "string" ? (h = unescape(h), h = p(n(E(h, c), !0), { ...c, skipEscape: !0 })) : typeof h == "object" && (h = p(n(h, !0), { ...c, skipEscape: !0 })), typeof d == "string" ? (d = unescape(d), d = p(n(E(d, c), !0), { ...c, skipEscape: !0 })) : typeof d == "object" && (d = p(n(d, !0), { ...c, skipEscape: !0 })), h.toLowerCase() === d.toLowerCase();
  }
  function p(h, d) {
    const c = {
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
    }, f = Object.assign({}, d), m = [], v = i[(f.scheme || c.scheme || "").toLowerCase()];
    v && v.serialize && v.serialize(c, f), c.path !== void 0 && (f.skipEscape ? c.path = unescape(c.path) : (c.path = escape(c.path), c.scheme !== void 0 && (c.path = c.path.split("%3A").join(":")))), f.reference !== "suffix" && c.scheme && m.push(c.scheme, ":");
    const g = r(c);
    if (g !== void 0 && (f.reference !== "suffix" && m.push("//"), m.push(g), c.path && c.path.charAt(0) !== "/" && m.push("/")), c.path !== void 0) {
      let $ = c.path;
      !f.absolutePath && (!v || !v.absolutePath) && ($ = t($)), g === void 0 && ($ = $.replace(/^\/\//u, "/%2F")), m.push($);
    }
    return c.query !== void 0 && m.push("?", c.query), c.fragment !== void 0 && m.push("#", c.fragment), m.join("");
  }
  const w = Array.from({ length: 127 }, (h, d) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(d)));
  function _(h) {
    let d = 0;
    for (let c = 0, f = h.length; c < f; ++c)
      if (d = h.charCodeAt(c), d > 126 || w[d])
        return !0;
    return !1;
  }
  const S = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function E(h, d) {
    const c = Object.assign({}, d), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, m = h.indexOf("%") !== -1;
    let v = !1;
    c.reference === "suffix" && (h = (c.scheme ? c.scheme + ":" : "") + "//" + h);
    const g = h.match(S);
    if (g) {
      if (f.scheme = g[1], f.userinfo = g[3], f.host = g[4], f.port = parseInt(g[5], 10), f.path = g[6] || "", f.query = g[7], f.fragment = g[8], isNaN(f.port) && (f.port = g[5]), f.host) {
        const k = e(f.host);
        if (k.isIPV4 === !1) {
          const j = o(k.host);
          f.host = j.host.toLowerCase(), v = j.isIPV6;
        } else
          f.host = k.host, v = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", c.reference && c.reference !== "suffix" && c.reference !== f.reference && (f.error = f.error || "URI is not a " + c.reference + " reference.");
      const $ = i[(c.scheme || f.scheme || "").toLowerCase()];
      if (!c.unicodeSupport && (!$ || !$.unicodeSupport) && f.host && (c.domainHost || $ && $.domainHost) && v === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (k) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + k;
        }
      (!$ || $ && !$.skipNormalize) && (m && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), m && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), $ && $.parse && $.parse(f, c);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const b = {
    SCHEMES: i,
    normalize: s,
    resolve: a,
    resolveComponents: l,
    equal: u,
    serialize: p,
    parse: E
  };
  return Ie.exports = b, Ie.exports.default = b, Ie.exports.fastUri = b, Ie.exports;
}
var Rr;
function di() {
  if (Rr) return Be;
  Rr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const o = ui();
  return o.code = 'require("ajv/dist/runtime/uri").default', Be.default = o, Be;
}
var Ar;
function fi() {
  return Ar || (Ar = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.CodeGen = o.Name = o.nil = o.stringify = o.str = o._ = o.KeywordCxt = void 0;
    var e = At();
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
    const r = Wt(), n = jt(), i = wn(), s = Yt(), a = Y(), l = Rt(), u = Tt(), p = Z(), w = si, _ = di(), S = (q, N) => new RegExp(q, N);
    S.code = "new RegExp";
    const E = ["removeAdditional", "useDefaults", "coerceTypes"], b = /* @__PURE__ */ new Set([
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
    }, d = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, c = 200;
    function f(q) {
      var N, I, R, y, M, A, F, G, Q, W, P, T, C, O, x, U, X, te, oe, le, se, ae, ue, re, K;
      const ie = q.strict, fe = (N = q.code) === null || N === void 0 ? void 0 : N.optimize, ve = fe === !0 || fe === void 0 ? 1 : fe || 0, je = (R = (I = q.code) === null || I === void 0 ? void 0 : I.regExp) !== null && R !== void 0 ? R : S, xe = (y = q.uriResolver) !== null && y !== void 0 ? y : _.default;
      return {
        strictSchema: (A = (M = q.strictSchema) !== null && M !== void 0 ? M : ie) !== null && A !== void 0 ? A : !0,
        strictNumbers: (G = (F = q.strictNumbers) !== null && F !== void 0 ? F : ie) !== null && G !== void 0 ? G : !0,
        strictTypes: (W = (Q = q.strictTypes) !== null && Q !== void 0 ? Q : ie) !== null && W !== void 0 ? W : "log",
        strictTuples: (T = (P = q.strictTuples) !== null && P !== void 0 ? P : ie) !== null && T !== void 0 ? T : "log",
        strictRequired: (O = (C = q.strictRequired) !== null && C !== void 0 ? C : ie) !== null && O !== void 0 ? O : !1,
        code: q.code ? { ...q.code, optimize: ve, regExp: je } : { optimize: ve, regExp: je },
        loopRequired: (x = q.loopRequired) !== null && x !== void 0 ? x : c,
        loopEnum: (U = q.loopEnum) !== null && U !== void 0 ? U : c,
        meta: (X = q.meta) !== null && X !== void 0 ? X : !0,
        messages: (te = q.messages) !== null && te !== void 0 ? te : !0,
        inlineRefs: (oe = q.inlineRefs) !== null && oe !== void 0 ? oe : !0,
        schemaId: (le = q.schemaId) !== null && le !== void 0 ? le : "$id",
        addUsedSchema: (se = q.addUsedSchema) !== null && se !== void 0 ? se : !0,
        validateSchema: (ae = q.validateSchema) !== null && ae !== void 0 ? ae : !0,
        validateFormats: (ue = q.validateFormats) !== null && ue !== void 0 ? ue : !0,
        unicodeRegExp: (re = q.unicodeRegExp) !== null && re !== void 0 ? re : !0,
        int32range: (K = q.int32range) !== null && K !== void 0 ? K : !0,
        uriResolver: xe
      };
    }
    class m {
      constructor(N = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), N = this.opts = { ...N, ...f(N) };
        const { es5: I, lines: R } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: b, es5: I, lines: R }), this.logger = B(N.logger);
        const y = N.validateFormats;
        N.validateFormats = !1, this.RULES = (0, i.getRules)(), v.call(this, h, N, "NOT SUPPORTED"), v.call(this, d, N, "DEPRECATED", "warn"), this._metaOpts = D.call(this), N.formats && k.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), N.keywords && j.call(this, N.keywords), typeof N.meta == "object" && this.addMetaSchema(N.meta), $.call(this), N.validateFormats = y;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: N, meta: I, schemaId: R } = this.opts;
        let y = w;
        R === "id" && (y = { ...w }, y.id = y.$id, delete y.$id), I && N && this.addMetaSchema(y, y[R], !1);
      }
      defaultMeta() {
        const { meta: N, schemaId: I } = this.opts;
        return this.opts.defaultMeta = typeof N == "object" ? N[I] || N : void 0;
      }
      validate(N, I) {
        let R;
        if (typeof N == "string") {
          if (R = this.getSchema(N), !R)
            throw new Error(`no schema with key or ref "${N}"`);
        } else
          R = this.compile(N);
        const y = R(I);
        return "$async" in R || (this.errors = R.errors), y;
      }
      compile(N, I) {
        const R = this._addSchema(N, I);
        return R.validate || this._compileSchemaEnv(R);
      }
      compileAsync(N, I) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: R } = this.opts;
        return y.call(this, N, I);
        async function y(W, P) {
          await M.call(this, W.$schema);
          const T = this._addSchema(W, P);
          return T.validate || A.call(this, T);
        }
        async function M(W) {
          W && !this.getSchema(W) && await y.call(this, { $ref: W }, !0);
        }
        async function A(W) {
          try {
            return this._compileSchemaEnv(W);
          } catch (P) {
            if (!(P instanceof n.default))
              throw P;
            return F.call(this, P), await G.call(this, P.missingSchema), A.call(this, W);
          }
        }
        function F({ missingSchema: W, missingRef: P }) {
          if (this.refs[W])
            throw new Error(`AnySchema ${W} is loaded but ${P} cannot be resolved`);
        }
        async function G(W) {
          const P = await Q.call(this, W);
          this.refs[W] || await M.call(this, P.$schema), this.refs[W] || this.addSchema(P, W, I);
        }
        async function Q(W) {
          const P = this._loading[W];
          if (P)
            return P;
          try {
            return await (this._loading[W] = R(W));
          } finally {
            delete this._loading[W];
          }
        }
      }
      // Adds schema to the instance
      addSchema(N, I, R, y = this.opts.validateSchema) {
        if (Array.isArray(N)) {
          for (const A of N)
            this.addSchema(A, void 0, R, y);
          return this;
        }
        let M;
        if (typeof N == "object") {
          const { schemaId: A } = this.opts;
          if (M = N[A], M !== void 0 && typeof M != "string")
            throw new Error(`schema ${A} must be string`);
        }
        return I = (0, l.normalizeId)(I || M), this._checkUnique(I), this.schemas[I] = this._addSchema(N, R, I, y, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(N, I, R = this.opts.validateSchema) {
        return this.addSchema(N, I, !0, R), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(N, I) {
        if (typeof N == "boolean")
          return !0;
        let R;
        if (R = N.$schema, R !== void 0 && typeof R != "string")
          throw new Error("$schema must be a string");
        if (R = R || this.opts.defaultMeta || this.defaultMeta(), !R)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const y = this.validate(R, N);
        if (!y && I) {
          const M = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(M);
          else
            throw new Error(M);
        }
        return y;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(N) {
        let I;
        for (; typeof (I = g.call(this, N)) == "string"; )
          N = I;
        if (I === void 0) {
          const { schemaId: R } = this.opts, y = new s.SchemaEnv({ schema: {}, schemaId: R });
          if (I = s.resolveSchema.call(this, y, N), !I)
            return;
          this.refs[N] = I;
        }
        return I.validate || this._compileSchemaEnv(I);
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
            const I = g.call(this, N);
            return typeof I == "object" && this._cache.delete(I.schema), delete this.schemas[N], delete this.refs[N], this;
          }
          case "object": {
            const I = N;
            this._cache.delete(I);
            let R = N[this.opts.schemaId];
            return R && (R = (0, l.normalizeId)(R), delete this.schemas[R], delete this.refs[R]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(N) {
        for (const I of N)
          this.addKeyword(I);
        return this;
      }
      addKeyword(N, I) {
        let R;
        if (typeof N == "string")
          R = N, typeof I == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), I.keyword = R);
        else if (typeof N == "object" && I === void 0) {
          if (I = N, R = I.keyword, Array.isArray(R) && !R.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (H.call(this, R, I), !I)
          return (0, p.eachItem)(R, (M) => ce.call(this, M)), this;
        ye.call(this, I);
        const y = {
          ...I,
          type: (0, u.getJSONTypes)(I.type),
          schemaType: (0, u.getJSONTypes)(I.schemaType)
        };
        return (0, p.eachItem)(R, y.type.length === 0 ? (M) => ce.call(this, M, y) : (M) => y.type.forEach((A) => ce.call(this, M, y, A))), this;
      }
      getKeyword(N) {
        const I = this.RULES.all[N];
        return typeof I == "object" ? I.definition : !!I;
      }
      // Remove keyword
      removeKeyword(N) {
        const { RULES: I } = this;
        delete I.keywords[N], delete I.all[N];
        for (const R of I.rules) {
          const y = R.rules.findIndex((M) => M.keyword === N);
          y >= 0 && R.rules.splice(y, 1);
        }
        return this;
      }
      // Add format
      addFormat(N, I) {
        return typeof I == "string" && (I = new RegExp(I)), this.formats[N] = I, this;
      }
      errorsText(N = this.errors, { separator: I = ", ", dataVar: R = "data" } = {}) {
        return !N || N.length === 0 ? "No errors" : N.map((y) => `${R}${y.instancePath} ${y.message}`).reduce((y, M) => y + I + M);
      }
      $dataMetaSchema(N, I) {
        const R = this.RULES.all;
        N = JSON.parse(JSON.stringify(N));
        for (const y of I) {
          const M = y.split("/").slice(1);
          let A = N;
          for (const F of M)
            A = A[F];
          for (const F in R) {
            const G = R[F];
            if (typeof G != "object")
              continue;
            const { $data: Q } = G.definition, W = A[F];
            Q && W && (A[F] = z(W));
          }
        }
        return N;
      }
      _removeAllSchemas(N, I) {
        for (const R in N) {
          const y = N[R];
          (!I || I.test(R)) && (typeof y == "string" ? delete N[R] : y && !y.meta && (this._cache.delete(y.schema), delete N[R]));
        }
      }
      _addSchema(N, I, R, y = this.opts.validateSchema, M = this.opts.addUsedSchema) {
        let A;
        const { schemaId: F } = this.opts;
        if (typeof N == "object")
          A = N[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof N != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let G = this._cache.get(N);
        if (G !== void 0)
          return G;
        R = (0, l.normalizeId)(A || R);
        const Q = l.getSchemaRefs.call(this, N, R);
        return G = new s.SchemaEnv({ schema: N, schemaId: F, meta: I, baseId: R, localRefs: Q }), this._cache.set(G.schema, G), M && !R.startsWith("#") && (R && this._checkUnique(R), this.refs[R] = G), y && this.validateSchema(N, !0), G;
      }
      _checkUnique(N) {
        if (this.schemas[N] || this.refs[N])
          throw new Error(`schema with key or id "${N}" already exists`);
      }
      _compileSchemaEnv(N) {
        if (N.meta ? this._compileMetaSchema(N) : s.compileSchema.call(this, N), !N.validate)
          throw new Error("ajv implementation error");
        return N.validate;
      }
      _compileMetaSchema(N) {
        const I = this.opts;
        this.opts = this._metaOpts;
        try {
          s.compileSchema.call(this, N);
        } finally {
          this.opts = I;
        }
      }
    }
    m.ValidationError = r.default, m.MissingRefError = n.default, o.default = m;
    function v(q, N, I, R = "error") {
      for (const y in q) {
        const M = y;
        M in N && this.logger[R](`${I}: option ${y}. ${q[M]}`);
      }
    }
    function g(q) {
      return q = (0, l.normalizeId)(q), this.schemas[q] || this.refs[q];
    }
    function $() {
      const q = this.opts.schemas;
      if (q)
        if (Array.isArray(q))
          this.addSchema(q);
        else
          for (const N in q)
            this.addSchema(q[N], N);
    }
    function k() {
      for (const q in this.opts.formats) {
        const N = this.opts.formats[q];
        N && this.addFormat(q, N);
      }
    }
    function j(q) {
      if (Array.isArray(q)) {
        this.addVocabulary(q);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const N in q) {
        const I = q[N];
        I.keyword || (I.keyword = N), this.addKeyword(I);
      }
    }
    function D() {
      const q = { ...this.opts };
      for (const N of E)
        delete q[N];
      return q;
    }
    const V = { log() {
    }, warn() {
    }, error() {
    } };
    function B(q) {
      if (q === !1)
        return V;
      if (q === void 0)
        return console;
      if (q.log && q.warn && q.error)
        return q;
      throw new Error("logger must implement log, warn and error methods");
    }
    const L = /^[a-z_$][a-z0-9_$:-]*$/i;
    function H(q, N) {
      const { RULES: I } = this;
      if ((0, p.eachItem)(q, (R) => {
        if (I.keywords[R])
          throw new Error(`Keyword ${R} is already defined`);
        if (!L.test(R))
          throw new Error(`Keyword ${R} has invalid name`);
      }), !!N && N.$data && !("code" in N || "validate" in N))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ce(q, N, I) {
      var R;
      const y = N?.post;
      if (I && y)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: M } = this;
      let A = y ? M.post : M.rules.find(({ type: G }) => G === I);
      if (A || (A = { type: I, rules: [] }, M.rules.push(A)), M.keywords[q] = !0, !N)
        return;
      const F = {
        keyword: q,
        definition: {
          ...N,
          type: (0, u.getJSONTypes)(N.type),
          schemaType: (0, u.getJSONTypes)(N.schemaType)
        }
      };
      N.before ? me.call(this, A, F, N.before) : A.rules.push(F), M.all[q] = F, (R = N.implements) === null || R === void 0 || R.forEach((G) => this.addKeyword(G));
    }
    function me(q, N, I) {
      const R = q.rules.findIndex((y) => y.keyword === I);
      R >= 0 ? q.rules.splice(R, 0, N) : (q.rules.push(N), this.logger.warn(`rule ${I} is not defined`));
    }
    function ye(q) {
      let { metaSchema: N } = q;
      N !== void 0 && (q.$data && this.opts.$data && (N = z(N)), q.validateSchema = this.compile(N, !0));
    }
    const ee = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function z(q) {
      return { anyOf: [q, ee] };
    }
  })(It)), It;
}
var Ke = {}, He = {}, Je = {}, jr;
function hi() {
  if (jr) return Je;
  jr = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const o = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Je.default = o, Je;
}
var Se = {}, Cr;
function pi() {
  if (Cr) return Se;
  Cr = 1, Object.defineProperty(Se, "__esModule", { value: !0 }), Se.callRef = Se.getValidate = void 0;
  const o = jt(), e = we(), t = Y(), r = Me(), n = Yt(), i = Z(), s = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: p, schema: w, it: _ } = u, { baseId: S, schemaEnv: E, validateName: b, opts: h, self: d } = _, { root: c } = E;
      if ((w === "#" || w === "#/") && S === c.baseId)
        return m();
      const f = n.resolveRef.call(d, c, S, w);
      if (f === void 0)
        throw new o.default(_.opts.uriResolver, S, w);
      if (f instanceof n.SchemaEnv)
        return v(f);
      return g(f);
      function m() {
        if (E === c)
          return l(u, b, E, E.$async);
        const $ = p.scopeValue("root", { ref: c });
        return l(u, (0, t._)`${$}.validate`, c, c.$async);
      }
      function v($) {
        const k = a(u, $);
        l(u, k, $, $.$async);
      }
      function g($) {
        const k = p.scopeValue("schema", h.code.source === !0 ? { ref: $, code: (0, t.stringify)($) } : { ref: $ }), j = p.name("valid"), D = u.subschema({
          schema: $,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: k,
          errSchemaPath: w
        }, j);
        u.mergeEvaluated(D), u.ok(j);
      }
    }
  };
  function a(u, p) {
    const { gen: w } = u;
    return p.validate ? w.scopeValue("validate", { ref: p.validate }) : (0, t._)`${w.scopeValue("wrapper", { ref: p })}.validate`;
  }
  Se.getValidate = a;
  function l(u, p, w, _) {
    const { gen: S, it: E } = u, { allErrors: b, schemaEnv: h, opts: d } = E, c = d.passContext ? r.default.this : t.nil;
    _ ? f() : m();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const $ = S.let("valid");
      S.try(() => {
        S.code((0, t._)`await ${(0, e.callValidateCode)(u, p, c)}`), g(p), b || S.assign($, !0);
      }, (k) => {
        S.if((0, t._)`!(${k} instanceof ${E.ValidationError})`, () => S.throw(k)), v(k), b || S.assign($, !1);
      }), u.ok($);
    }
    function m() {
      u.result((0, e.callValidateCode)(u, p, c), () => g(p), () => v(p));
    }
    function v($) {
      const k = (0, t._)`${$}.errors`;
      S.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${k} : ${r.default.vErrors}.concat(${k})`), S.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function g($) {
      var k;
      if (!E.opts.unevaluated)
        return;
      const j = (k = w?.validate) === null || k === void 0 ? void 0 : k.evaluated;
      if (E.props !== !0)
        if (j && !j.dynamicProps)
          j.props !== void 0 && (E.props = i.mergeEvaluated.props(S, j.props, E.props));
        else {
          const D = S.var("props", (0, t._)`${$}.evaluated.props`);
          E.props = i.mergeEvaluated.props(S, D, E.props, t.Name);
        }
      if (E.items !== !0)
        if (j && !j.dynamicItems)
          j.items !== void 0 && (E.items = i.mergeEvaluated.items(S, j.items, E.items));
        else {
          const D = S.var("items", (0, t._)`${$}.evaluated.items`);
          E.items = i.mergeEvaluated.items(S, D, E.items, t.Name);
        }
    }
  }
  return Se.callRef = l, Se.default = s, Se;
}
var Ir;
function mi() {
  if (Ir) return He;
  Ir = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const o = hi(), e = pi(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    o.default,
    e.default
  ];
  return He.default = t, He;
}
var We = {}, Ye = {}, Or;
function yi() {
  if (Or) return Ye;
  Or = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
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
      const { keyword: s, data: a, schemaCode: l } = i;
      i.fail$data((0, o._)`${a} ${t[s].fail} ${l} || isNaN(${a})`);
    }
  };
  return Ye.default = n, Ye;
}
var Qe = {}, qr;
function gi() {
  if (qr) return Qe;
  qr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
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
      const { gen: n, data: i, schemaCode: s, it: a } = r, l = a.opts.multipleOfPrecision, u = n.let("res"), p = l ? (0, o._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${l}` : (0, o._)`${u} !== parseInt(${u})`;
      r.fail$data((0, o._)`(${s} === 0 || (${u} = ${i}/${s}, ${p}))`);
    }
  };
  return Qe.default = t, Qe;
}
var Xe = {}, Ze = {}, Dr;
function vi() {
  if (Dr) return Ze;
  Dr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  function o(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return Ze.default = o, o.code = 'require("ajv/dist/runtime/ucs2length").default', Ze;
}
var xr;
function bi() {
  if (xr) return Xe;
  xr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const o = Y(), e = Z(), t = vi(), n = {
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
      const { keyword: s, data: a, schemaCode: l, it: u } = i, p = s === "maxLength" ? o.operators.GT : o.operators.LT, w = u.opts.unicode === !1 ? (0, o._)`${a}.length` : (0, o._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, o._)`${w} ${p} ${l}`);
    }
  };
  return Xe.default = n, Xe;
}
var et = {}, Vr;
function wi() {
  if (Vr) return et;
  Vr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const o = we(), e = Y(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: s, schema: a, schemaCode: l, it: u } = n, p = u.opts.unicodeRegExp ? "u" : "", w = s ? (0, e._)`(new RegExp(${l}, ${p}))` : (0, o.usePattern)(n, a);
      n.fail$data((0, e._)`!${w}.test(${i})`);
    }
  };
  return et.default = r, et;
}
var tt = {}, zr;
function $i() {
  if (zr) return tt;
  zr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
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
  return tt.default = t, tt;
}
var rt = {}, Fr;
function _i() {
  if (Fr) return rt;
  Fr = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const o = we(), e = Y(), t = Z(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: s, schema: a, schemaCode: l, data: u, $data: p, it: w } = i, { opts: _ } = w;
      if (!p && a.length === 0)
        return;
      const S = a.length >= _.loopRequired;
      if (w.allErrors ? E() : b(), _.strictRequired) {
        const c = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const m of a)
          if (c?.[m] === void 0 && !f.has(m)) {
            const v = w.schemaEnv.baseId + w.errSchemaPath, g = `required property "${m}" is not defined at "${v}" (strictRequired)`;
            (0, t.checkStrictMode)(w, g, w.opts.strictRequired);
          }
      }
      function E() {
        if (S || p)
          i.block$data(e.nil, h);
        else
          for (const c of a)
            (0, o.checkReportMissingProp)(i, c);
      }
      function b() {
        const c = s.let("missing");
        if (S || p) {
          const f = s.let("valid", !0);
          i.block$data(f, () => d(c, f)), i.ok(f);
        } else
          s.if((0, o.checkMissingProp)(i, a, c)), (0, o.reportMissingProp)(i, c), s.else();
      }
      function h() {
        s.forOf("prop", l, (c) => {
          i.setParams({ missingProperty: c }), s.if((0, o.noPropertyInData)(s, u, c, _.ownProperties), () => i.error());
        });
      }
      function d(c, f) {
        i.setParams({ missingProperty: c }), s.forOf(c, l, () => {
          s.assign(f, (0, o.propertyInData)(s, u, c, _.ownProperties)), s.if((0, e.not)(f), () => {
            i.error(), s.break();
          });
        }, e.nil);
      }
    }
  };
  return rt.default = n, rt;
}
var nt = {}, Lr;
function Pi() {
  if (Lr) return nt;
  Lr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
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
  return nt.default = t, nt;
}
var it = {}, ot = {}, Ur;
function Qt() {
  if (Ur) return ot;
  Ur = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const o = _n();
  return o.code = 'require("ajv/dist/runtime/equal").default', ot.default = o, ot;
}
var Gr;
function Si() {
  if (Gr) return it;
  Gr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const o = Tt(), e = Y(), t = Z(), r = Qt(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: s, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${s} are identical)`,
      params: ({ params: { i: s, j: a } }) => (0, e._)`{i: ${s}, j: ${a}}`
    },
    code(s) {
      const { gen: a, data: l, $data: u, schema: p, parentSchema: w, schemaCode: _, it: S } = s;
      if (!u && !p)
        return;
      const E = a.let("valid"), b = w.items ? (0, o.getSchemaTypes)(w.items) : [];
      s.block$data(E, h, (0, e._)`${_} === false`), s.ok(E);
      function h() {
        const m = a.let("i", (0, e._)`${l}.length`), v = a.let("j");
        s.setParams({ i: m, j: v }), a.assign(E, !0), a.if((0, e._)`${m} > 1`, () => (d() ? c : f)(m, v));
      }
      function d() {
        return b.length > 0 && !b.some((m) => m === "object" || m === "array");
      }
      function c(m, v) {
        const g = a.name("item"), $ = (0, o.checkDataTypes)(b, g, S.opts.strictNumbers, o.DataType.Wrong), k = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${m}--;`, () => {
          a.let(g, (0, e._)`${l}[${m}]`), a.if($, (0, e._)`continue`), b.length > 1 && a.if((0, e._)`typeof ${g} == "string"`, (0, e._)`${g} += "_"`), a.if((0, e._)`typeof ${k}[${g}] == "number"`, () => {
            a.assign(v, (0, e._)`${k}[${g}]`), s.error(), a.assign(E, !1).break();
          }).code((0, e._)`${k}[${g}] = ${m}`);
        });
      }
      function f(m, v) {
        const g = (0, t.useFunc)(a, r.default), $ = a.name("outer");
        a.label($).for((0, e._)`;${m}--;`, () => a.for((0, e._)`${v} = ${m}; ${v}--;`, () => a.if((0, e._)`${g}(${l}[${m}], ${l}[${v}])`, () => {
          s.error(), a.assign(E, !1).break($);
        })));
      }
    }
  };
  return it.default = i, it;
}
var st = {}, Br;
function Ei() {
  if (Br) return st;
  Br = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const o = Y(), e = Z(), t = Qt(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: l, schemaCode: u, schema: p } = i;
      l || p && typeof p == "object" ? i.fail$data((0, o._)`!${(0, e.useFunc)(s, t.default)}(${a}, ${u})`) : i.fail((0, o._)`${p} !== ${a}`);
    }
  };
  return st.default = n, st;
}
var at = {}, Kr;
function Mi() {
  if (Kr) return at;
  Kr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const o = Y(), e = Z(), t = Qt(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: l, schema: u, schemaCode: p, it: w } = i;
      if (!l && u.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = u.length >= w.opts.loopEnum;
      let S;
      const E = () => S ?? (S = (0, e.useFunc)(s, t.default));
      let b;
      if (_ || l)
        b = s.let("valid"), i.block$data(b, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const c = s.const("vSchema", p);
        b = (0, o.or)(...u.map((f, m) => d(c, m)));
      }
      i.pass(b);
      function h() {
        s.assign(b, !1), s.forOf("v", p, (c) => s.if((0, o._)`${E()}(${a}, ${c})`, () => s.assign(b, !0).break()));
      }
      function d(c, f) {
        const m = u[f];
        return typeof m == "object" && m !== null ? (0, o._)`${E()}(${a}, ${c}[${f}])` : (0, o._)`${a} === ${m}`;
      }
    }
  };
  return at.default = n, at;
}
var Hr;
function Ti() {
  if (Hr) return We;
  Hr = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const o = yi(), e = gi(), t = bi(), r = wi(), n = $i(), i = _i(), s = Pi(), a = Si(), l = Ei(), u = Mi(), p = [
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
    l.default,
    u.default
  ];
  return We.default = p, We;
}
var ct = {}, Re = {}, Jr;
function Pn() {
  if (Jr) return Re;
  Jr = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.validateAdditionalItems = void 0;
  const o = Y(), e = Z(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, o.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, o._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: s, it: a } = i, { items: l } = s;
      if (!Array.isArray(l)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      n(i, l);
    }
  };
  function n(i, s) {
    const { gen: a, schema: l, data: u, keyword: p, it: w } = i;
    w.items = !0;
    const _ = a.const("len", (0, o._)`${u}.length`);
    if (l === !1)
      i.setParams({ len: s.length }), i.pass((0, o._)`${_} <= ${s.length}`);
    else if (typeof l == "object" && !(0, e.alwaysValidSchema)(w, l)) {
      const E = a.var("valid", (0, o._)`${_} <= ${s.length}`);
      a.if((0, o.not)(E), () => S(E)), i.ok(E);
    }
    function S(E) {
      a.forRange("i", s.length, _, (b) => {
        i.subschema({ keyword: p, dataProp: b, dataPropType: e.Type.Num }, E), w.allErrors || a.if((0, o.not)(E), () => a.break());
      });
    }
  }
  return Re.validateAdditionalItems = n, Re.default = r, Re;
}
var lt = {}, Ae = {}, Wr;
function Sn() {
  if (Wr) return Ae;
  Wr = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.validateTuple = void 0;
  const o = Y(), e = Z(), t = we(), r = {
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
    const { gen: l, parentSchema: u, data: p, keyword: w, it: _ } = i;
    b(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(l, a.length, _.items));
    const S = l.name("valid"), E = l.const("len", (0, o._)`${p}.length`);
    a.forEach((h, d) => {
      (0, e.alwaysValidSchema)(_, h) || (l.if((0, o._)`${E} > ${d}`, () => i.subschema({
        keyword: w,
        schemaProp: d,
        dataProp: d
      }, S)), i.ok(S));
    });
    function b(h) {
      const { opts: d, errSchemaPath: c } = _, f = a.length, m = f === h.minItems && (f === h.maxItems || h[s] === !1);
      if (d.strictTuples && !m) {
        const v = `"${w}" is ${f}-tuple, but minItems or maxItems/${s} are not specified or different at path "${c}"`;
        (0, e.checkStrictMode)(_, v, d.strictTuples);
      }
    }
  }
  return Ae.validateTuple = n, Ae.default = r, Ae;
}
var Yr;
function ki() {
  if (Yr) return lt;
  Yr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const o = Sn(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, o.validateTuple)(t, "items")
  };
  return lt.default = e, lt;
}
var ut = {}, Qr;
function Ni() {
  if (Qr) return ut;
  Qr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const o = Y(), e = Z(), t = we(), r = Pn(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, o.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, o._)`{limit: ${s}}`
    },
    code(s) {
      const { schema: a, parentSchema: l, it: u } = s, { prefixItems: p } = l;
      u.items = !0, !(0, e.alwaysValidSchema)(u, a) && (p ? (0, r.validateAdditionalItems)(s, p) : s.ok((0, t.validateArray)(s)));
    }
  };
  return ut.default = i, ut;
}
var dt = {}, Xr;
function Ri() {
  if (Xr) return dt;
  Xr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const o = Y(), e = Z(), r = {
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
      const { gen: i, schema: s, parentSchema: a, data: l, it: u } = n;
      let p, w;
      const { minContains: _, maxContains: S } = a;
      u.opts.next ? (p = _ === void 0 ? 1 : _, w = S) : p = 1;
      const E = i.const("len", (0, o._)`${l}.length`);
      if (n.setParams({ min: p, max: w }), w === void 0 && p === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (w !== void 0 && p > w) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, s)) {
        let f = (0, o._)`${E} >= ${p}`;
        w !== void 0 && (f = (0, o._)`${f} && ${E} <= ${w}`), n.pass(f);
        return;
      }
      u.items = !0;
      const b = i.name("valid");
      w === void 0 && p === 1 ? d(b, () => i.if(b, () => i.break())) : p === 0 ? (i.let(b, !0), w !== void 0 && i.if((0, o._)`${l}.length > 0`, h)) : (i.let(b, !1), h()), n.result(b, () => n.reset());
      function h() {
        const f = i.name("_valid"), m = i.let("count", 0);
        d(f, () => i.if(f, () => c(m)));
      }
      function d(f, m) {
        i.forRange("i", 0, E, (v) => {
          n.subschema({
            keyword: "contains",
            dataProp: v,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), m();
        });
      }
      function c(f) {
        i.code((0, o._)`${f}++`), w === void 0 ? i.if((0, o._)`${f} >= ${p}`, () => i.assign(b, !0).break()) : (i.if((0, o._)`${f} > ${w}`, () => i.assign(b, !1).break()), p === 1 ? i.assign(b, !0) : i.if((0, o._)`${f} >= ${p}`, () => i.assign(b, !0)));
      }
    }
  };
  return dt.default = r, dt;
}
var Gt = {}, Zr;
function Ai() {
  return Zr || (Zr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.validateSchemaDeps = o.validatePropertyDeps = o.error = void 0;
    const e = Y(), t = Z(), r = we();
    o.error = {
      message: ({ params: { property: l, depsCount: u, deps: p } }) => {
        const w = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${w} ${p} when property ${l} is present`;
      },
      params: ({ params: { property: l, depsCount: u, deps: p, missingProperty: w } }) => (0, e._)`{property: ${l},
    missingProperty: ${w},
    depsCount: ${u},
    deps: ${p}}`
      // TODO change to reference
    };
    const n = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: o.error,
      code(l) {
        const [u, p] = i(l);
        s(l, u), a(l, p);
      }
    };
    function i({ schema: l }) {
      const u = {}, p = {};
      for (const w in l) {
        if (w === "__proto__")
          continue;
        const _ = Array.isArray(l[w]) ? u : p;
        _[w] = l[w];
      }
      return [u, p];
    }
    function s(l, u = l.schema) {
      const { gen: p, data: w, it: _ } = l;
      if (Object.keys(u).length === 0)
        return;
      const S = p.let("missing");
      for (const E in u) {
        const b = u[E];
        if (b.length === 0)
          continue;
        const h = (0, r.propertyInData)(p, w, E, _.opts.ownProperties);
        l.setParams({
          property: E,
          depsCount: b.length,
          deps: b.join(", ")
        }), _.allErrors ? p.if(h, () => {
          for (const d of b)
            (0, r.checkReportMissingProp)(l, d);
        }) : (p.if((0, e._)`${h} && (${(0, r.checkMissingProp)(l, b, S)})`), (0, r.reportMissingProp)(l, S), p.else());
      }
    }
    o.validatePropertyDeps = s;
    function a(l, u = l.schema) {
      const { gen: p, data: w, keyword: _, it: S } = l, E = p.name("valid");
      for (const b in u)
        (0, t.alwaysValidSchema)(S, u[b]) || (p.if(
          (0, r.propertyInData)(p, w, b, S.opts.ownProperties),
          () => {
            const h = l.subschema({ keyword: _, schemaProp: b }, E);
            l.mergeValidEvaluated(h, E);
          },
          () => p.var(E, !0)
          // TODO var
        ), l.ok(E));
    }
    o.validateSchemaDeps = a, o.default = n;
  })(Gt)), Gt;
}
var ft = {}, en;
function ji() {
  if (en) return ft;
  en = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const o = Y(), e = Z(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, o._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: i, schema: s, data: a, it: l } = n;
      if ((0, e.alwaysValidSchema)(l, s))
        return;
      const u = i.name("valid");
      i.forIn("key", a, (p) => {
        n.setParams({ propertyName: p }), n.subschema({
          keyword: "propertyNames",
          data: p,
          dataTypes: ["string"],
          propertyName: p,
          compositeRule: !0
        }, u), i.if((0, o.not)(u), () => {
          n.error(!0), l.allErrors || i.break();
        });
      }), n.ok(u);
    }
  };
  return ft.default = r, ft;
}
var ht = {}, tn;
function En() {
  if (tn) return ht;
  tn = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const o = we(), e = Y(), t = Me(), r = Z(), i = {
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
      const { gen: a, schema: l, parentSchema: u, data: p, errsCount: w, it: _ } = s;
      if (!w)
        throw new Error("ajv implementation error");
      const { allErrors: S, opts: E } = _;
      if (_.props = !0, E.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, l))
        return;
      const b = (0, o.allSchemaProperties)(u.properties), h = (0, o.allSchemaProperties)(u.patternProperties);
      d(), s.ok((0, e._)`${w} === ${t.default.errors}`);
      function d() {
        a.forIn("key", p, (g) => {
          !b.length && !h.length ? m(g) : a.if(c(g), () => m(g));
        });
      }
      function c(g) {
        let $;
        if (b.length > 8) {
          const k = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          $ = (0, o.isOwnProperty)(a, k, g);
        } else b.length ? $ = (0, e.or)(...b.map((k) => (0, e._)`${g} === ${k}`)) : $ = e.nil;
        return h.length && ($ = (0, e.or)($, ...h.map((k) => (0, e._)`${(0, o.usePattern)(s, k)}.test(${g})`))), (0, e.not)($);
      }
      function f(g) {
        a.code((0, e._)`delete ${p}[${g}]`);
      }
      function m(g) {
        if (E.removeAdditional === "all" || E.removeAdditional && l === !1) {
          f(g);
          return;
        }
        if (l === !1) {
          s.setParams({ additionalProperty: g }), s.error(), S || a.break();
          return;
        }
        if (typeof l == "object" && !(0, r.alwaysValidSchema)(_, l)) {
          const $ = a.name("valid");
          E.removeAdditional === "failing" ? (v(g, $, !1), a.if((0, e.not)($), () => {
            s.reset(), f(g);
          })) : (v(g, $), S || a.if((0, e.not)($), () => a.break()));
        }
      }
      function v(g, $, k) {
        const j = {
          keyword: "additionalProperties",
          dataProp: g,
          dataPropType: r.Type.Str
        };
        k === !1 && Object.assign(j, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), s.subschema(j, $);
      }
    }
  };
  return ht.default = i, ht;
}
var pt = {}, rn;
function Ci() {
  if (rn) return pt;
  rn = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const o = At(), e = we(), t = Z(), r = En(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, parentSchema: l, data: u, it: p } = i;
      p.opts.removeAdditional === "all" && l.additionalProperties === void 0 && r.default.code(new o.KeywordCxt(p, r.default, "additionalProperties"));
      const w = (0, e.allSchemaProperties)(a);
      for (const h of w)
        p.definedProperties.add(h);
      p.opts.unevaluated && w.length && p.props !== !0 && (p.props = t.mergeEvaluated.props(s, (0, t.toHash)(w), p.props));
      const _ = w.filter((h) => !(0, t.alwaysValidSchema)(p, a[h]));
      if (_.length === 0)
        return;
      const S = s.name("valid");
      for (const h of _)
        E(h) ? b(h) : (s.if((0, e.propertyInData)(s, u, h, p.opts.ownProperties)), b(h), p.allErrors || s.else().var(S, !0), s.endIf()), i.it.definedProperties.add(h), i.ok(S);
      function E(h) {
        return p.opts.useDefaults && !p.compositeRule && a[h].default !== void 0;
      }
      function b(h) {
        i.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, S);
      }
    }
  };
  return pt.default = n, pt;
}
var mt = {}, nn;
function Ii() {
  if (nn) return mt;
  nn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const o = we(), e = Y(), t = Z(), r = Z(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, data: l, parentSchema: u, it: p } = i, { opts: w } = p, _ = (0, o.allSchemaProperties)(a), S = _.filter((m) => (0, t.alwaysValidSchema)(p, a[m]));
      if (_.length === 0 || S.length === _.length && (!p.opts.unevaluated || p.props === !0))
        return;
      const E = w.strictSchema && !w.allowMatchingProperties && u.properties, b = s.name("valid");
      p.props !== !0 && !(p.props instanceof e.Name) && (p.props = (0, r.evaluatedPropsToName)(s, p.props));
      const { props: h } = p;
      d();
      function d() {
        for (const m of _)
          E && c(m), p.allErrors ? f(m) : (s.var(b, !0), f(m), s.if(b));
      }
      function c(m) {
        for (const v in E)
          new RegExp(m).test(v) && (0, t.checkStrictMode)(p, `property ${v} matches pattern ${m} (use allowMatchingProperties)`);
      }
      function f(m) {
        s.forIn("key", l, (v) => {
          s.if((0, e._)`${(0, o.usePattern)(i, m)}.test(${v})`, () => {
            const g = S.includes(m);
            g || i.subschema({
              keyword: "patternProperties",
              schemaProp: m,
              dataProp: v,
              dataPropType: r.Type.Str
            }, b), p.opts.unevaluated && h !== !0 ? s.assign((0, e._)`${h}[${v}]`, !0) : !g && !p.allErrors && s.if((0, e.not)(b), () => s.break());
          });
        });
      }
    }
  };
  return mt.default = n, mt;
}
var yt = {}, on;
function Oi() {
  if (on) return yt;
  on = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const o = Z(), e = {
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
  return yt.default = e, yt;
}
var gt = {}, sn;
function qi() {
  if (sn) return gt;
  sn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: we().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return gt.default = e, gt;
}
var vt = {}, an;
function Di() {
  if (an) return vt;
  an = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const o = Y(), e = Z(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, o._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: i, schema: s, parentSchema: a, it: l } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      if (l.opts.discriminator && a.discriminator)
        return;
      const u = s, p = i.let("valid", !1), w = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: w }), i.block(S), n.result(p, () => n.reset(), () => n.error(!0));
      function S() {
        u.forEach((E, b) => {
          let h;
          (0, e.alwaysValidSchema)(l, E) ? i.var(_, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: b,
            compositeRule: !0
          }, _), b > 0 && i.if((0, o._)`${_} && ${p}`).assign(p, !1).assign(w, (0, o._)`[${w}, ${b}]`).else(), i.if(_, () => {
            i.assign(p, !0), i.assign(w, b), h && n.mergeEvaluated(h, o.Name);
          });
        });
      }
    }
  };
  return vt.default = r, vt;
}
var bt = {}, cn;
function xi() {
  if (cn) return bt;
  cn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const o = Z(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const s = r.name("valid");
      n.forEach((a, l) => {
        if ((0, o.alwaysValidSchema)(i, a))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: l }, s);
        t.ok(s), t.mergeEvaluated(u);
      });
    }
  };
  return bt.default = e, bt;
}
var wt = {}, ln;
function Vi() {
  if (ln) return wt;
  ln = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const o = Y(), e = Z(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, o.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, o._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: s, parentSchema: a, it: l } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(l, '"if" without "then" and "else" is ignored');
      const u = n(l, "then"), p = n(l, "else");
      if (!u && !p)
        return;
      const w = s.let("valid", !0), _ = s.name("_valid");
      if (S(), i.reset(), u && p) {
        const b = s.let("ifClause");
        i.setParams({ ifClause: b }), s.if(_, E("then", b), E("else", b));
      } else u ? s.if(_, E("then")) : s.if((0, o.not)(_), E("else"));
      i.pass(w, () => i.error(!0));
      function S() {
        const b = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(b);
      }
      function E(b, h) {
        return () => {
          const d = i.subschema({ keyword: b }, _);
          s.assign(w, _), i.mergeValidEvaluated(d, w), h ? s.assign(h, (0, o._)`${b}`) : i.setParams({ ifClause: b });
        };
      }
    }
  };
  function n(i, s) {
    const a = i.schema[s];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return wt.default = r, wt;
}
var $t = {}, un;
function zi() {
  if (un) return $t;
  un = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const o = Z(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, o.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return $t.default = e, $t;
}
var dn;
function Fi() {
  if (dn) return ct;
  dn = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const o = Pn(), e = ki(), t = Sn(), r = Ni(), n = Ri(), i = Ai(), s = ji(), a = En(), l = Ci(), u = Ii(), p = Oi(), w = qi(), _ = Di(), S = xi(), E = Vi(), b = zi();
  function h(d = !1) {
    const c = [
      // any
      p.default,
      w.default,
      _.default,
      S.default,
      E.default,
      b.default,
      // object
      s.default,
      a.default,
      i.default,
      l.default,
      u.default
    ];
    return d ? c.push(e.default, r.default) : c.push(o.default, t.default), c.push(n.default), c;
  }
  return ct.default = h, ct;
}
var _t = {}, Pt = {}, fn;
function Li() {
  if (fn) return Pt;
  fn = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
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
      const { gen: i, data: s, $data: a, schema: l, schemaCode: u, it: p } = r, { opts: w, errSchemaPath: _, schemaEnv: S, self: E } = p;
      if (!w.validateFormats)
        return;
      a ? b() : h();
      function b() {
        const d = i.scopeValue("formats", {
          ref: E.formats,
          code: w.code.formats
        }), c = i.const("fDef", (0, o._)`${d}[${u}]`), f = i.let("fType"), m = i.let("format");
        i.if((0, o._)`typeof ${c} == "object" && !(${c} instanceof RegExp)`, () => i.assign(f, (0, o._)`${c}.type || "string"`).assign(m, (0, o._)`${c}.validate`), () => i.assign(f, (0, o._)`"string"`).assign(m, c)), r.fail$data((0, o.or)(v(), g()));
        function v() {
          return w.strictSchema === !1 ? o.nil : (0, o._)`${u} && !${m}`;
        }
        function g() {
          const $ = S.$async ? (0, o._)`(${c}.async ? await ${m}(${s}) : ${m}(${s}))` : (0, o._)`${m}(${s})`, k = (0, o._)`(typeof ${m} == "function" ? ${$} : ${m}.test(${s}))`;
          return (0, o._)`${m} && ${m} !== true && ${f} === ${n} && !${k}`;
        }
      }
      function h() {
        const d = E.formats[l];
        if (!d) {
          v();
          return;
        }
        if (d === !0)
          return;
        const [c, f, m] = g(d);
        c === n && r.pass($());
        function v() {
          if (w.strictSchema === !1) {
            E.logger.warn(k());
            return;
          }
          throw new Error(k());
          function k() {
            return `unknown format "${l}" ignored in schema at path "${_}"`;
          }
        }
        function g(k) {
          const j = k instanceof RegExp ? (0, o.regexpCode)(k) : w.code.formats ? (0, o._)`${w.code.formats}${(0, o.getProperty)(l)}` : void 0, D = i.scopeValue("formats", { key: l, ref: k, code: j });
          return typeof k == "object" && !(k instanceof RegExp) ? [k.type || "string", k.validate, (0, o._)`${D}.validate`] : ["string", k, D];
        }
        function $() {
          if (typeof d == "object" && !(d instanceof RegExp) && d.async) {
            if (!S.$async)
              throw new Error("async format in sync schema");
            return (0, o._)`await ${m}(${s})`;
          }
          return typeof f == "function" ? (0, o._)`${m}(${s})` : (0, o._)`${m}.test(${s})`;
        }
      }
    }
  };
  return Pt.default = t, Pt;
}
var hn;
function Ui() {
  if (hn) return _t;
  hn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const e = [Li().default];
  return _t.default = e, _t;
}
var Ne = {}, pn;
function Gi() {
  return pn || (pn = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.contentVocabulary = Ne.metadataVocabulary = void 0, Ne.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ne.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ne;
}
var mn;
function Bi() {
  if (mn) return Ke;
  mn = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const o = mi(), e = Ti(), t = Fi(), r = Ui(), n = Gi(), i = [
    o.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Ke.default = i, Ke;
}
var St = {}, Oe = {}, yn;
function Ki() {
  if (yn) return Oe;
  yn = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.DiscrError = void 0;
  var o;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(o || (Oe.DiscrError = o = {})), Oe;
}
var gn;
function Hi() {
  if (gn) return St;
  gn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const o = Y(), e = Ki(), t = Yt(), r = jt(), n = Z(), s = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: l } }) => a === e.DiscrError.Tag ? `tag "${l}" must be string` : `value of tag "${l}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: l, tagName: u } }) => (0, o._)`{error: ${a}, tag: ${u}, tagValue: ${l}}`
    },
    code(a) {
      const { gen: l, data: u, schema: p, parentSchema: w, it: _ } = a, { oneOf: S } = w;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const E = p.propertyName;
      if (typeof E != "string")
        throw new Error("discriminator: requires propertyName");
      if (p.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!S)
        throw new Error("discriminator: requires oneOf keyword");
      const b = l.let("valid", !1), h = l.const("tag", (0, o._)`${u}${(0, o.getProperty)(E)}`);
      l.if((0, o._)`typeof ${h} == "string"`, () => d(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: E })), a.ok(b);
      function d() {
        const m = f();
        l.if(!1);
        for (const v in m)
          l.elseIf((0, o._)`${h} === ${v}`), l.assign(b, c(m[v]));
        l.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: E }), l.endIf();
      }
      function c(m) {
        const v = l.name("valid"), g = a.subschema({ keyword: "oneOf", schemaProp: m }, v);
        return a.mergeEvaluated(g, o.Name), v;
      }
      function f() {
        var m;
        const v = {}, g = k(w);
        let $ = !0;
        for (let V = 0; V < S.length; V++) {
          let B = S[V];
          if (B?.$ref && !(0, n.schemaHasRulesButRef)(B, _.self.RULES)) {
            const H = B.$ref;
            if (B = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, H), B instanceof t.SchemaEnv && (B = B.schema), B === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, H);
          }
          const L = (m = B?.properties) === null || m === void 0 ? void 0 : m[E];
          if (typeof L != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${E}"`);
          $ = $ && (g || k(B)), j(L, V);
        }
        if (!$)
          throw new Error(`discriminator: "${E}" must be required`);
        return v;
        function k({ required: V }) {
          return Array.isArray(V) && V.includes(E);
        }
        function j(V, B) {
          if (V.const)
            D(V.const, B);
          else if (V.enum)
            for (const L of V.enum)
              D(L, B);
          else
            throw new Error(`discriminator: "properties/${E}" must have "const" or "enum"`);
        }
        function D(V, B) {
          if (typeof V != "string" || V in v)
            throw new Error(`discriminator: "${E}" values must be unique strings`);
          v[V] = B;
        }
      }
    }
  };
  return St.default = s, St;
}
const Ji = "http://json-schema.org/draft-07/schema#", Wi = "http://json-schema.org/draft-07/schema#", Yi = "Core schema meta-schema", Qi = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Xi = ["object", "boolean"], Zi = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, eo = {
  $schema: Ji,
  $id: Wi,
  title: Yi,
  definitions: Qi,
  type: Xi,
  properties: Zi,
  default: !0
};
var vn;
function to() {
  return vn || (vn = 1, (function(o, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = fi(), r = Bi(), n = Hi(), i = eo, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class l extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const E = this.opts.$data ? this.$dataMetaSchema(i, s) : i;
        this.addMetaSchema(E, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = l, o.exports = e = l, o.exports.Ajv = l, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = l;
    var u = At();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var p = Y();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return p._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return p.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return p.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return p.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return p.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return p.CodeGen;
    } });
    var w = Wt();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return w.default;
    } });
    var _ = jt();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(Fe, Fe.exports)), Fe.exports;
}
var ro = to();
const no = /* @__PURE__ */ Jn(ro), io = "http://json-schema.org/draft-07/schema#", oo = "JMON Composition (Multi-Track, Extended)", so = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values should use the bars:beats:ticks format (e.g., '2:1:240') for precise musical timing. This format is independent of BPM and follows professional DAW standards.", ao = "object", co = ["format", "version", "bpm", "tracks"], lo = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '2:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '4:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format where the global loop should end (e.g., '8:0:0')."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0', '1:3.5:240'). Preferred format for precise musical timing."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"number","description":"Legacy: Time in beats (deprecated, use bars:beats:ticks format instead)."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), uo = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, fo = !1, ho = {
  $schema: io,
  title: oo,
  description: so,
  type: ao,
  required: co,
  properties: lo,
  definitions: uo,
  additionalProperties: fo
};
function po(o) {
  const e = typeof o == "string" ? parseInt(o, 10) : o;
  if (!Number.isFinite(e)) return String(o);
  const r = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(e % 12 + 12) % 12], n = Math.floor(e / 12) - 1;
  return `${r}${n}`;
}
function Mn(o) {
  return !o || !Array.isArray(o.audioGraph) || o.audioGraph.forEach((e) => {
    try {
      if (!e || e.type !== "Sampler") return;
      const t = e.options || {}, r = t.urls;
      if (!r || typeof r != "object") return;
      const n = {};
      Object.keys(r).forEach((i) => {
        const s = String(i);
        let a = s;
        /^\d+$/.test(s) && (a = po(parseInt(s, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), o;
}
class Xt {
  constructor(e = ho) {
    this.ajv = new no({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e));
    Mn(t);
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
class de {
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
class Tn {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = de.convertFlatToSharp(e);
    if (!de.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${de.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(de.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(de.scale_intervals).join(", ")}'.`);
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
    const t = de.scale_intervals[this.mode];
    if (!t)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof e.start == "string" && (e.start = de.noteNameToMidi(e.start)), typeof e.end == "string" && (e.end = de.noteNameToMidi(e.end));
    const r = e.start ?? 60;
    if (de.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const i = (a, l) => {
      const u = l % t.length, p = Math.floor(l / t.length) * 12, w = t[u];
      return a + w + p;
    }, s = [];
    if (e.end !== void 0)
      for (let a = 0; ; a++) {
        const l = i(r, a);
        if (l > e.end) break;
        s.push(l);
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
    const e = de.scale_intervals[this.mode];
    if (!e) return [];
    const t = de.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const n = (t + r) % 12;
      return de.chromatic_scale[n];
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
function mo(o) {
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
function kn(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function Nn(o) {
  return Math.floor(o / 12) - 1;
}
function yo(o) {
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
function Jt(o, e, t) {
  typeof o == "string" && (o = De(o)), typeof t == "string" && (t = De(t));
  const r = e.indexOf(t);
  if (e.includes(o))
    return e.indexOf(o) - r;
  {
    const n = kn(o, e), i = e.indexOf(n), s = i > 0 ? i - 1 : i, a = e[s], l = n - o, u = o - a, p = l + u;
    if (p === 0) return i - r;
    const w = 1 - l / p, _ = 1 - u / p, S = i - r, E = s - r;
    return S * w + E * _;
  }
}
function go(o, e, t) {
  const r = e.indexOf(t), n = Math.round(r + o);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), s = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], l = e[s], u = s - n, p = n - i, w = u + p;
    if (w === 0)
      return (l + a) / 2;
    const _ = 1 - u / w, S = 1 - p / w;
    return l * _ + a * S;
  }
}
function Rn(o) {
  o.length > 0 && o[0].length === 2 && (o = o.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of o)
    e.push([r, n, t]), t += n;
  return e;
}
function An(o, e = 0) {
  const t = [...o].sort((i, s) => i[2] - s[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [s, a, l] = i, u = e + l;
    if (u > r) {
      const w = [null, u - r, r - e];
      n.push(w);
    }
    n.push(i), r = Math.max(r, u + a);
  }
  return n;
}
function jn(o) {
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
function vo(o) {
  return jn(An(o));
}
function De(o) {
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
function bo(o) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(o / 12) - 1, r = o % 12;
  return e[r] + t.toString();
}
function wo(o, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, s] of o)
    t.push([n, i, r]), r += i;
  return t;
}
function $o(o) {
  return o.every((e) => Array.isArray(e)) ? "list of tuples" : o.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function _o(o, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...o), s = n !== null ? n : Math.max(...o);
  return i === s ? new Array(o.length).fill((e + t) / 2) : o.map(
    (a) => (a - i) * (t - e) / (s - i) + e
  );
}
function Cn(o, e) {
  return o.map(([t, r, n]) => [t, r, n + e]);
}
function Po(o, e, t) {
  const r = [];
  for (const [n, i, s] of o) {
    const a = Math.round(s / t) * t, l = (Math.floor(a / e) + 1) * e;
    let u = Math.round(i / t) * t;
    u = Math.min(u, l - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function So(o, e) {
  const r = o.filter(([a, , l]) => a !== null && l !== null).sort((a, l) => a[2] - l[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, s = [];
  for (let a = 0; a < i; a++) {
    const l = a * e;
    let u = null, p = 1 / 0;
    for (const [w, , _] of r) {
      const S = l - _;
      if (S >= 0 && S < p && (p = S, u = w), _ > l) break;
    }
    u !== null && s.push(u);
  }
  return s;
}
function Eo(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function Mo(o, e) {
  return 60 / e * o;
}
function* To(o = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * o, [o, e] = [e, o + e];
}
function ko(o, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(o)) {
    const s = [];
    for (let a = 0; a < e; a++) {
      const l = a * t, u = Cn(i, l);
      s.push(...u);
    }
    r[n] = s;
  }
  return r;
}
const No = {
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
}, Ro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: jn,
  cdeToMidi: De,
  checkInput: $o,
  fibonacci: To,
  fillGapsWithRests: An,
  findClosestPitchAtMeasureStart: So,
  getDegreeFromPitch: Jt,
  getOctave: Nn,
  getPitchFromDegree: go,
  getSharp: yo,
  instrumentMapping: No,
  midiToCde: bo,
  noOverlap: wo,
  offsetTrack: Cn,
  qlToSeconds: Mo,
  quantizeNotes: Po,
  repairNotes: vo,
  repeatPolyloops: ko,
  roundToList: kn,
  scaleList: _o,
  setOffsetsAccordingToDurations: Rn,
  tracksToDict: mo,
  tune: Eo
}, Symbol.toStringTag, { value: "Module" }));
class Ao extends de {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = De(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
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
    const { major: r, minor: n, diminished: i } = this.computeCircle(), s = [r, n, i], a = ["major", "minor", "diminished"], l = [];
    for (let u = 0; u < e; u++) {
      const p = this.weightedRandomChoice(this.weights);
      if (s[p].length > 0) {
        const w = s[p][Math.floor(Math.random() * s[p].length)], _ = a[p], S = Array.isArray(w) ? w[0] : w, E = this.generateChord(S, _);
        l.push(E);
      }
    }
    return l;
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
class jo extends de {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new Tn(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = Nn(e), r = this.tonic + t.toString(), n = De(r), i = this.scale.map((l) => Jt(l, this.scale, n)), s = Math.round(Jt(e, this.scale, n)), a = [];
    for (const l of this.degrees) {
      const u = s + l, p = i.indexOf(u);
      p !== -1 && a.push(this.scale[p]);
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
      n = e.map((l) => {
        const u = t[s % t.length], p = [l, u, a];
        return a += u, s++, p;
      });
    }
    const i = n.map(([s, a, l]) => [this.pitchToChord(s), a, l]);
    if (r) {
      const s = [];
      for (const [a, l, u] of i) {
        const p = l / a.length;
        a.forEach((w, _) => {
          s.push([w, p, u + _ * p]);
        });
      }
      return s;
    } else
      return i;
  }
}
const bn = {
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
class Zt {
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
    }, i = bn[t];
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
    const t = bn[e.type];
    if (!t)
      throw new Error(`Unknown ornament type: ${e.type}`);
    this.type = e.type, this.params = {
      ...t.defaultParams,
      ...e.parameters
    }, e.tonic && e.mode ? (this.tonicIndex = de.chromatic_scale.indexOf(e.tonic), this.scale = this.generateScale(e.tonic, e.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(e, t) {
    const r = de.scale_intervals[t], n = de.chromatic_scale.indexOf(e), i = r.map((a) => (n + a) % 12), s = [];
    for (let a = -1; a < 10; a++)
      for (const l of i) {
        const u = 12 * a + l;
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
    const r = e[t], n = Zt.validateOrnament(r, this.type, this.params);
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
      const l = i * 0.125, u = { pitch: n, duration: i, time: s + l };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: l, time: s },
        u,
        ...e.slice(t + 1)
      ];
    } else {
      const l = i / 2, u = { pitch: n, duration: l, time: s + l };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: l, time: s },
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
    let l = s;
    const u = this.params.by || 1, p = this.params.trillRate || 0.125;
    let w;
    if (this.scale && this.scale.includes(n)) {
      const S = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      w = this.scale[S];
    } else
      w = n + u;
    for (; l < s + i; ) {
      const _ = s + i - l, S = Math.min(p, _ / 2);
      if (_ >= S * 2)
        a.push({ pitch: n, duration: S, time: l }), a.push({ pitch: w, duration: S, time: l + S }), l += 2 * S;
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
    let l;
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n) + Math.round(a);
      l = this.scale[_] || n + a;
    } else
      l = n + a;
    const u = i / 3, p = [
      { pitch: n, duration: u, time: s },
      { pitch: l, duration: u, time: s + u },
      { pitch: n, duration: u, time: s + 2 * u }
    ];
    return [
      ...e.slice(0, t),
      ...p,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a turn
   */
  addTurn(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = i / 4;
    let l, u;
    if (this.scale && this.scale.includes(n)) {
      const w = this.scale.indexOf(n);
      l = this.scale[w + 1] || n + 2, u = this.scale[w - 1] || n - 2;
    } else
      l = n + 2, u = n - 2;
    const p = [
      { pitch: n, duration: a, time: s },
      { pitch: l, duration: a, time: s + a },
      { pitch: n, duration: a, time: s + 2 * a },
      { pitch: u, duration: a, time: s + 3 * a }
    ];
    return [
      ...e.slice(0, t),
      ...p,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add an arpeggio
   */
  addArpeggio(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, { arpeggioDegrees: a, direction: l = "up" } = this.params;
    if (!a || !Array.isArray(a))
      return e;
    const u = [];
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n);
      u.push(...a.map((S) => this.scale[_ + S] || n + S));
    } else
      u.push(...a.map((_) => n + _));
    l === "down" && u.reverse(), l === "both" && u.push(...u.slice(0, -1).reverse());
    const p = i / u.length, w = u.map((_, S) => ({
      pitch: _,
      duration: p,
      time: s + S * p
    }));
    return [
      ...e.slice(0, t),
      ...w,
      ...e.slice(t + 1)
    ];
  }
}
const Bt = {
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
class Ct {
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
    const s = Bt[t];
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
      const i = Bt[n];
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
    return Object.entries(Bt).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function In(o, e, t, r) {
  return Ct.addArticulation(o, e, t, r);
}
function On(o, e) {
  return Ct.removeArticulation(o, e);
}
function Co(o) {
  return Ct.validateSequence(o);
}
const Io = In, Oo = On, qo = {
  Scale: Tn,
  Progression: Ao,
  Voice: jo,
  Ornament: Zt,
  Articulation: Ct,
  addArticulation: In,
  addOrnament: Io,
  // Include the alias
  removeArticulation: On,
  removeOrnament: Oo,
  // Include the alias
  validateArticulations: Co
};
class Do {
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
    return new xo(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class xo {
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
      const t = Math.floor(Math.random() * (e.length - 1)), [r, n] = e[t], s = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - n, a = this.durations.filter((l) => l <= s);
      if (a.length > 0) {
        const l = a[Math.floor(Math.random() * a.length)];
        e[t] = [l, n];
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
        a = this.mutate(a), a.sort((l, u) => l[1] - u[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function Vo(o, e) {
  const t = o.map((a) => Array.isArray(a) || typeof a == "object" && a.length ? a[0] : a), r = zo(t.length, e.length), n = [], i = [];
  for (let a = 0; a < r; a++)
    n.push(t[a % t.length]), i.push(e[a % e.length]);
  const s = n.map((a, l) => [a, i[l], 1]);
  return Rn(s);
}
function zo(o, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(o * e) / t(o, e);
}
function Fo(o, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of o) {
    const s = e[n % e.length];
    t.push([i, s, r]), r += s, n++;
  }
  return t;
}
const Lo = {
  Rhythm: Do,
  isorhythm: Vo,
  beatcycle: Fo
};
class Uo {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class Ee {
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
    return new Ee(e, t);
  }
  static from2DArray(e) {
    return new Ee(e);
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
    return new Ee(e);
  }
  clone() {
    return new Ee(this.data);
  }
  toArray() {
    return this.data.map((e) => [...e]);
  }
}
function Kt(o) {
  return Array.isArray(o[0]) ? Ee.from2DArray(o) : Ee.from2DArray([o]);
}
function Go(o) {
  if (o.rows !== o.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = o.rows, t = Ee.zeros(e, e);
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
class Bo {
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
    this.XTrain = Kt(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = Go(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = Kt(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      i[a] = 0;
      for (let l = 0; l < this.XTrain.rows; l++)
        i[a] += n.get(l, a) * this.alphaVector[l];
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
    const r = Kt(e), n = this.predict(e, !0);
    if (!n.std)
      throw new Error("Standard deviation computation failed");
    const i = [];
    for (let s = 0; s < t; s++) {
      const a = new Array(r.rows);
      for (let l = 0; l < r.rows; l++) {
        const u = n.mean[l], p = n.std[l];
        a[l] = u + p * this.sampleStandardNormal();
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
      let l = 0;
      for (let p = 0; p < a.length; p++)
        l += a[p] * a[p];
      const u = i - l;
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
class Ko {
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
    return (await import("./CAVisualizer-CmIzAtiX.mjs")).CAVisualizer.plotEvolution(this.getHistory(), e);
  }
  /**
   * Create Observable Plot visualization of current generation
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotGeneration(e) {
    return (await import("./CAVisualizer-CmIzAtiX.mjs")).CAVisualizer.plotGeneration(this.getCurrentState(), e);
  }
  /**
   * Create Observable Plot density visualization
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotDensity(e) {
    return (await import("./CAVisualizer-CmIzAtiX.mjs")).CAVisualizer.plotDensity(this.getHistory(), e);
  }
}
class kt {
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
      const a = s.map((l, u) => {
        if (!l || typeof l != "object")
          throw new Error(`Note ${u} in loop "${n}" must be an object`);
        if (l.pitch !== null && (typeof l.pitch != "number" || l.pitch < 0 || l.pitch > 127))
          throw new Error(`Note ${u} in loop "${n}" has invalid pitch: ${l.pitch}`);
        if (typeof l.time != "number" || l.time < 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid time: ${l.time}`);
        if (typeof l.duration != "number" || l.duration <= 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid duration: ${l.duration}`);
        return {
          pitch: l.pitch,
          time: l.time,
          duration: l.duration,
          velocity: typeof l.velocity == "number" ? Math.max(0, Math.min(1, l.velocity)) : 0.8
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
    return new kt({ [e.label || "Track"]: e }, t);
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
    i.forEach((u, p) => {
      if (u) {
        const w = p * a, _ = r[p % r.length];
        s.push({
          pitch: _,
          duration: a * 0.8,
          time: w,
          velocity: 0.8
        });
      }
    });
    const l = {
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
    return new kt({ [l.label]: l }, e);
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
        const l = s.count, u = a.count - s.count;
        r = [
          { pattern: [...a.pattern, ...s.pattern], count: l }
        ], u > 0 && r.push({ pattern: a.pattern, count: u });
      } else {
        const l = a.count, u = s.count - a.count;
        r = [
          { pattern: [...s.pattern, ...a.pattern], count: l }
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
    const { LoopVisualizer: n } = await import("./LoopVisualizer-DS22P85c.mjs");
    return n.plotLoops(
      this.loops,
      this.measureLength,
      e,
      t,
      r
    );
  }
}
class qn {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((w, _) => ({ value: w, weight: n[_] })).sort((w, _) => w.value - _.value), s = i.map((w) => w.value), a = i.map((w) => w.weight), l = a.reduce((w, _) => w + _, 0);
    let u = 0, p = 0;
    for (let w = 0; w < r; w++) {
      const _ = a.slice(0, w + 1).reduce((S, E) => S + E, 0);
      u += a[w] * (2 * _ - a[w] - l) * s[w], p += a[w] * s[w] * l;
    }
    return p === 0 ? 0 : u / p;
  }
  /**
   * Calculate center of mass (balance point) of a sequence
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Balance point
   */
  static balance(e, t) {
    if (e.length === 0) return 0;
    const r = t || Array(e.length).fill(1), n = e.reduce((s, a, l) => s + a * r[l], 0), i = r.reduce((s, a) => s + a, 0);
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, n = t || Math.floor(r / 2), i = [], s = e.reduce((l, u) => l + u, 0) / r, a = e.reduce((l, u) => l + Math.pow(u - s, 2), 0) / r;
    for (let l = 0; l <= n; l++) {
      let u = 0;
      for (let p = 0; p < r - l; p++)
        u += (e[p] - s) * (e[p + l] - s);
      u /= r - l, i.push(a === 0 ? 0 : u / a);
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
class Ho {
  constructor(e = {}) {
    this.options = {
      populationSize: e.populationSize || 50,
      generations: e.generations || 100,
      mutationRate: e.mutationRate || 0.1,
      crossoverRate: e.crossoverRate || 0.8,
      elitismRate: e.elitismRate || 0.1,
      fitnessWeights: {
        gini: 0.2,
        balance: 0.15,
        motif: 0.25,
        dissonance: 0.2,
        rhythmic: 0.2,
        ...e.fitnessWeights
      },
      scale: e.scale || [0, 2, 4, 5, 7, 9, 11],
      // C major
      durations: e.durations || ["4n", "8n", "2n", "16n"],
      lengthRange: e.lengthRange || [8, 16]
    }, this.population = [], this.generation = 0, this.bestFitness = -1 / 0, this.bestIndividual = null;
  }
  /**
   * Initialize random population
   */
  initializePopulation() {
    this.population = [];
    for (let e = 0; e < this.options.populationSize; e++) {
      const t = this.createRandomIndividual();
      this.population.push(t);
    }
    this.evaluatePopulation();
  }
  /**
   * Run the genetic algorithm
   */
  evolve() {
    this.initializePopulation();
    for (let e = 0; e < this.options.generations; e++) {
      this.generation = e;
      const t = this.createNextGeneration();
      this.population = t, this.evaluatePopulation();
      const r = this.getBestIndividual();
      r.fitness > this.bestFitness && (this.bestFitness = r.fitness, this.bestIndividual = { ...r });
    }
    return this.getBestIndividual();
  }
  /**
   * Create a random individual
   */
  createRandomIndividual() {
    const e = Math.floor(Math.random() * (this.options.lengthRange[1] - this.options.lengthRange[0] + 1)) + this.options.lengthRange[0], t = [];
    let r = 0;
    for (let n = 0; n < e; n++) {
      const i = this.randomPitch(), s = this.randomDuration();
      t.push({
        note: i,
        time: `${Math.floor(r)}:${Math.floor(r % 1 * 4)}:0`,
        // Simple time format
        duration: s,
        velocity: Math.random() * 0.5 + 0.5
        // 0.5 to 1.0
      }), r += this.parseDuration(s);
    }
    return {
      genes: t,
      fitness: 0,
      age: 0
    };
  }
  /**
   * Generate random pitch from scale
   */
  randomPitch() {
    const e = Math.floor(Math.random() * 3) + 4, t = this.options.scale[Math.floor(Math.random() * this.options.scale.length)];
    return 12 * e + t;
  }
  /**
   * Generate random duration
   */
  randomDuration() {
    return this.options.durations[Math.floor(Math.random() * this.options.durations.length)];
  }
  /**
   * Parse duration to numeric value (simplified)
   */
  parseDuration(e) {
    return {
      "1n": 4,
      "2n": 2,
      "4n": 1,
      "8n": 0.5,
      "16n": 0.25,
      "32n": 0.125
    }[e] || 1;
  }
  /**
   * Evaluate fitness for all individuals
   */
  evaluatePopulation() {
    for (const e of this.population)
      e.fitness = this.calculateFitness(e.genes);
    this.population.sort((e, t) => t.fitness - e.fitness);
  }
  /**
   * Calculate fitness using weighted musical analysis metrics
   */
  calculateFitness(e) {
    const t = qn.analyze(e, { scale: this.options.scale });
    let r = 0;
    const n = this.options.fitnessWeights;
    r += (n.gini || 0) * (1 - t.gini), r += (n.balance || 0) * (1 - Math.abs(t.balance - 60) / 60), r += (n.motif || 0) * t.motif, r += (n.dissonance || 0) * (1 - t.dissonance), r += (n.rhythmic || 0) * t.rhythmic;
    const i = e.length;
    return (i < this.options.lengthRange[0] || i > this.options.lengthRange[1]) && (r *= 0.5), Math.max(0, r);
  }
  /**
   * Create next generation through selection, crossover, and mutation
   */
  createNextGeneration() {
    const e = [], t = Math.floor(this.options.populationSize * this.options.elitismRate);
    for (let r = 0; r < t; r++) {
      const n = { ...this.population[r] };
      n.age++, e.push(n);
    }
    for (; e.length < this.options.populationSize; ) {
      const r = this.selectParent(), n = this.selectParent();
      let i, s;
      Math.random() < this.options.crossoverRate ? [i, s] = this.crossover(r, n) : (i = { ...r }, s = { ...n }), Math.random() < this.options.mutationRate && this.mutate(i), Math.random() < this.options.mutationRate && this.mutate(s), i.age = 0, s.age = 0, e.push(i), e.length < this.options.populationSize && e.push(s);
    }
    return e;
  }
  /**
   * Tournament selection
   */
  selectParent() {
    const t = [];
    for (let r = 0; r < 3; r++) {
      const n = Math.floor(Math.random() * this.population.length);
      t.push(this.population[n]);
    }
    return t.sort((r, n) => n.fitness - r.fitness), { ...t[0] };
  }
  /**
   * Single-point crossover
   */
  crossover(e, t) {
    const r = Math.min(e.genes.length, t.genes.length), n = Math.floor(Math.random() * r), i = {
      genes: [
        ...e.genes.slice(0, n),
        ...t.genes.slice(n)
      ],
      fitness: 0,
      age: 0
    }, s = {
      genes: [
        ...t.genes.slice(0, n),
        ...e.genes.slice(n)
      ],
      fitness: 0,
      age: 0
    };
    return [i, s];
  }
  /**
   * Mutate an individual
   */
  mutate(e) {
    const t = e.genes, r = Math.random();
    if (r < 0.3) {
      const n = Math.floor(Math.random() * t.length);
      t[n].pitch = this.randomPitch();
    } else if (r < 0.6) {
      const n = Math.floor(Math.random() * t.length);
      t[n].duration = this.randomDuration();
    } else if (r < 0.8) {
      const n = Math.floor(Math.random() * t.length);
      t[n].velocity = Math.random() * 0.5 + 0.5;
    } else if (Math.random() < 0.5 && t.length < this.options.lengthRange[1]) {
      const n = Math.floor(Math.random() * (t.length + 1)), i = {
        pitch: this.randomPitch(),
        time: "0:0:0",
        // Will be recalculated
        duration: this.randomDuration(),
        velocity: Math.random() * 0.5 + 0.5
      };
      t.splice(n, 0, i);
    } else if (t.length > this.options.lengthRange[0]) {
      const n = Math.floor(Math.random() * t.length);
      t.splice(n, 1);
    }
    this.recalculateTiming(e);
  }
  /**
   * Recalculate note timing after mutations
   */
  recalculateTiming(e) {
    let t = 0;
    for (const r of e.genes)
      r.time = `${Math.floor(t)}:${Math.floor(t % 1 * 4)}:0`, t += this.parseDuration(r.duration);
  }
  /**
   * Get the best individual from current population
   */
  getBestIndividual() {
    return { ...this.population[0] };
  }
  /**
   * Get population statistics
   */
  getStatistics() {
    const e = this.population.map((i) => i.fitness), t = e.reduce((i, s) => i + s, 0) / e.length, r = Math.max(...e), n = Math.min(...e);
    return {
      generation: this.generation,
      avgFitness: t,
      maxFitness: r,
      minFitness: n,
      bestAllTime: this.bestFitness,
      populationSize: this.population.length
    };
  }
  /**
   * Set custom fitness function
   */
  setCustomFitness(e) {
    this.calculateFitness = e;
  }
}
class Jo {
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
    return n.map((l) => {
      const u = (l - i) / a, p = Math.floor(u * t.length * r), w = Math.floor(p / t.length), _ = p % t.length;
      return 60 + w * 12 + t[_];
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
      const l = (a - n) / s, u = Math.floor(l * t.length), p = Math.max(0, Math.min(u, t.length - 1));
      return t[p];
    });
  }
  /**
   * Map walk to velocities
   */
  mapToVelocity(e = 0, t = 0.3, r = 1) {
    const n = this.getProjection(e);
    if (n.length === 0) return [];
    const i = Math.min(...n), a = Math.max(...n) - i || 1;
    return n.map((l) => {
      const u = (l - i) / a;
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
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, l = t * (e[s] - i);
      i += a + l, i = Math.max(this.options.bounds[0], Math.min(this.options.bounds[1], i)), n.push(i);
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
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((u) => Math.pow(u - t, 2)), s = i.reduce((u, p) => u + p, 0) / i.length;
    let a = 0;
    for (let u = 1; u < e.length; u++)
      a += Math.abs(e[u] - e[u - 1]);
    const l = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: n,
      meanSquaredDisplacement: s,
      totalDistance: a,
      fractalDimension: l
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
}
class Wo {
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
    let i = 0, s = r - 1, a = 0, l = n - 1;
    for (; i <= s && a <= l; ) {
      for (let u = a; u <= l; u++)
        t.push(e[i][u]);
      i++;
      for (let u = i; u <= s; u++)
        t.push(e[u][l]);
      if (l--, i <= s) {
        for (let u = l; u >= a; u--)
          t.push(e[s][u]);
        s--;
      }
      if (a <= l) {
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
      const l = (a - n) / s, u = Math.floor(l * t.length * r), p = Math.floor(u / t.length), w = u % t.length;
      return 60 + p * 12 + t[w];
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
      const a = (s - r) / i, l = Math.floor(a * t.length), u = Math.max(0, Math.min(l, t.length - 1));
      return 1 / t[u];
    });
  }
}
class Yo {
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
      const l = e + a * s, u = this.r;
      this.r = l;
      const p = this.generate();
      this.r = u;
      const w = p.slice(-50);
      for (const _ of w)
        n.push(l), i.push(_);
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
        let l = 0;
        for (let u = 0; u < e; u++)
          u !== a && (l += t * (n[u] - n[a]));
        s[a] = this.r * n[a] * (1 - n[a]) + l, s[a] = Math.max(0, Math.min(1, s[a]));
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
class Qo {
  operation;
  direction;
  repetition;
  sequence = [];
  constructor(e) {
    const { operation: t, direction: r, repetition: n } = e;
    if (!["additive", "subtractive"].includes(t))
      throw new Error("Invalid operation. Choose 'additive' or 'subtractive'.");
    if (!["forward", "backward", "inward", "outward"].includes(r))
      throw new Error("Invalid direction. Choose 'forward', 'backward', 'inward' or 'outward'.");
    if (n < 0 || !Number.isInteger(n))
      throw new Error("Invalid repetition value. Must be an integer greater than or equal to 0.");
    this.operation = t, this.direction = r, this.repetition = n;
  }
  /**
   * Generate processed sequence based on operation and direction
   */
  generate(e) {
    this.sequence = e;
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
    return this.adjustOffsets(t);
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
}
class Xo {
  tChord;
  direction;
  rank;
  isAlternate;
  currentDirection;
  constructor(e, t = "down", r = 0) {
    if (!["up", "down", "any", "alternate"].includes(t))
      throw new Error("Invalid direction. Choose 'up', 'down', 'any' or 'alternate'.");
    if (this.tChord = e, this.isAlternate = t === "alternate", this.currentDirection = this.isAlternate ? "up" : t, this.direction = t, !Number.isInteger(r) || r < 0)
      throw new Error("Rank must be a non-negative integer.");
    this.rank = Math.min(r, e.length - 1), this.rank >= e.length && console.warn("Rank exceeds the length of the t-chord. Using last note of the t-chord.");
  }
  /**
   * Generate t-voice from m-voice sequence
   */
  generate(e) {
    const t = [];
    for (const r of e) {
      if (r.pitch === void 0) {
        t.push({
          ...r,
          pitch: void 0
        });
        continue;
      }
      const n = r.pitch, s = this.tChord.map((u) => u - n).map((u, p) => ({ index: p, value: u })).sort((u, p) => Math.abs(u.value) - Math.abs(p.value));
      let a = this.rank, l;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const u = s.filter(
          ({ value: p }) => this.currentDirection === "up" ? p >= 0 : p <= 0
        );
        if (u.length === 0)
          l = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          a >= u.length && (a = u.length - 1);
          const p = u[a].index;
          l = this.tChord[p];
        }
      } else {
        a >= s.length && (a = s.length - 1);
        const u = s[a].index;
        l = this.tChord[u];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up"), t.push({
        ...r,
        pitch: l
      });
    }
    return t;
  }
}
const Zo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: qn
}, Symbol.toStringTag, { value: "Module" })), es = {
  harmony: qo,
  rhythm: Lo,
  motifs: {
    MotifBank: Uo
  }
}, ts = {
  theory: de
}, rs = {
  gaussian: {
    Regressor: Bo
  },
  automata: {
    Cellular: Ko
  },
  loops: kt,
  genetic: {
    Algorithm: Ho
  },
  walks: {
    Random: Jo
  },
  fractals: {
    Mandelbrot: Wo,
    LogisticMap: Yo
  },
  minimalism: {
    Process: Qo,
    Tintinnabuli: Xo
  }
}, ns = {
  ...Zo
}, is = {
  ...Ro
}, qe = {
  theory: es,
  constants: ts,
  generative: rs,
  analysis: ns,
  utils: is
};
class Ht {
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
function Dn(o, e = {}) {
  try {
    Mn(o);
  } catch {
  }
  const n = new Ht(e).convert(o).map((_, S) => ({
    originalTrackIndex: S,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: _.label },
    synthConfig: { type: _.type || "PolySynth" },
    partEvents: _.part || []
  })), i = o.metadata?.tempo || o.bpm || 120, [s, a] = (o.timeSignature || "4/4").split("/").map((_) => parseInt(_, 10)), l = isFinite(s) ? s : 4;
  let u = 0;
  n.forEach((_) => {
    _.partEvents && _.partEvents.length > 0 && _.partEvents.forEach((S) => {
      const E = Ht.parseBBTToBeats(S.time, l), b = Ht.parseDurationToBeats(S.duration, l), h = E + b;
      h > u && (u = h);
    });
  });
  const p = 60 / i, w = u * p;
  return {
    tracks: n,
    metadata: {
      totalDuration: w,
      tempo: i
    }
  };
}
function er(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error("[PLAYER] Invalid composition:", o), new Error("Composition must be a valid JMON object");
  const {
    autoplay: t = !1,
    showDebug: r = !1,
    customInstruments: n = {},
    autoMultivoice: i = !0,
    maxVoices: s = 4
  } = e;
  if (!o.sequences && !o.tracks)
    throw console.error("[PLAYER] No sequences or tracks found in composition:", o), new Error("Composition must have sequences or tracks");
  const a = o.tracks || o.sequences || [];
  if (!Array.isArray(a))
    throw console.error("[PLAYER] Tracks/sequences must be an array:", a), new Error("Tracks/sequences must be an array");
  const l = o.bpm || 120, p = Dn(o, { autoMultivoice: i, maxVoices: s, showDebug: r }), { tracks: w, metadata: _ } = p;
  let S = _.totalDuration;
  const E = {
    background: "#FFFFFF",
    primary: "#333",
    secondary: "#F0F0F0",
    text: "#000000",
    lightText: "#666666",
    border: "#CCCCCC"
  }, b = document.createElement("div");
  b.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${E.background};
        color: ${E.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${E.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    `;
  const h = document.createElement("div");
  h.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        font-family: 'PT Sans', sans-serif;
    `;
  const d = document.createElement("div");
  d.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 60%;
    `;
  const c = document.createElement("div");
  c.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const f = ["Sampler", "PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"], m = o.tracks || o.sequences || [], v = [];
  m.forEach((P, T) => {
    const C = w.find((X) => X.originalTrackIndex === T)?.analysis;
    C?.hasGlissando && console.warn(`Track ${P.label || P.name || T + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const O = document.createElement("div");
    O.style.cssText = `
            margin-bottom: 8px;
        `;
    const x = document.createElement("label");
    x.textContent = P.name || P.label || `Track ${T + 1}`, x.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${E.text};
            display: block;
            margin-bottom: 8px;
            font-weight: normal;
        `;
    const U = document.createElement("select");
    U.style.cssText = `
            padding: 4px;
            border: 1px solid ${E.secondary};
            border-radius: 4px;
            background-color: ${E.background};
            color: ${E.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            outline: none;
        `, f.forEach((X) => {
      const te = document.createElement("option");
      te.value = X, te.textContent = X, o.tracks?.[T]?.synthRef && X === "Sampler" && (te.selected = !0), C?.hasGlissando && (X === "PolySynth" || X === "DuoSynth") && (te.disabled = !0, te.textContent += " (mono only for glissando)"), U.appendChild(te);
    }), v.push(U), O.append(x, U), c.appendChild(O);
  }), d.appendChild(c);
  const g = document.createElement("div");
  g.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 35%;
    `;
  const $ = document.createElement("div");
  $.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
    `;
  const k = document.createElement("label");
  k.textContent = "Tempo", k.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 8px;
        color: ${E.text};
    `;
  const j = document.createElement("input");
  j.type = "number", j.min = 60, j.max = 240, j.value = l, j.style.cssText = `
        padding: 4px;
        border: 1px solid ${E.secondary};
        border-radius: 4px;
        background-color: ${E.background};
        color: ${E.text};
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
    `, $.append(k, j), g.appendChild($);
  const D = document.createElement("div");
  D.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
  const V = document.createElement("div");
  V.textContent = "0:00", V.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${E.text};
        min-width: 40px;
        text-align: center;
    `;
  const B = document.createElement("div");
  B.textContent = "0:00", B.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${E.text};
        min-width: 40px;
        text-align: center;
    `;
  const L = document.createElement("input");
  L.type = "range", L.min = 0, L.max = 100, L.value = 0, L.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${E.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const H = document.createElement("button");
  H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', H.style.cssText = `
        width: 40px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 50%;
        background-color: ${E.primary};
        color: ${E.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px 0px 10px;
    `;
  const ce = document.createElement("div");
  ce.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${E.lightText};
        margin: 0px 0px 0px 10px;
    `, D.append(V, L, B, H);
  const me = document.createElement("div");
  me.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;
  const ye = document.createElement("button");
  ye.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', ye.style.cssText = `
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
  const ee = document.createElement("button");
  ee.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', ee.style.cssText = `
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
    `, me.append(ye, ee), h.append(d, g), b.append(h, D, ce, me);
  let z, q = !1, N = [], I = [], R = [], y = null;
  const M = o.tracks || o.sequences || [], A = () => {
    if (!z || !o.audioGraph || !Array.isArray(o.audioGraph)) return null;
    const P = {}, T = (C) => {
      const O = {};
      return Object.entries(C || {}).forEach(([x, U]) => {
        let X = x;
        if (typeof x == "number" || /^\d+$/.test(String(x)))
          try {
            X = z.Frequency(parseInt(x, 10), "midi").toNote();
          } catch {
          }
        O[X] = U;
      }), O;
    };
    try {
      return o.audioGraph.forEach((C) => {
        const { id: O, type: x, options: U = {}, target: X } = C;
        if (!O || !x) return;
        let te = null;
        if (x === "Sampler") {
          const oe = T(U.urls);
          let le, se;
          const ae = new Promise((re, K) => {
            le = re, se = K;
          }), ue = {
            urls: oe,
            onload: () => le && le(),
            onerror: (re) => {
              console.error(`[PLAYER] Sampler load error for ${O}:`, re), se && se(re);
            }
          };
          U.baseUrl && (ue.baseUrl = U.baseUrl);
          try {
            console.log(`[PLAYER] Building Sampler ${O} with urls:`, oe, "baseUrl:", ue.baseUrl || "(none)"), te = new z.Sampler(ue).toDestination();
          } catch (re) {
            console.error("[PLAYER] Failed to create Sampler:", re), te = null;
          }
          R.push(ae), te && U.envelope && U.envelope.enabled && (typeof U.envelope.attack == "number" && (te.attack = U.envelope.attack), typeof U.envelope.release == "number" && (te.release = U.envelope.release));
        } else if ([
          "Synth",
          "PolySynth",
          "MonoSynth",
          "AMSynth",
          "FMSynth",
          "DuoSynth",
          "PluckSynth",
          "NoiseSynth"
        ].includes(x))
          try {
            te = new z[x](U).toDestination();
          } catch (oe) {
            console.warn(`[PLAYER] Failed to create ${x} from audioGraph, using PolySynth:`, oe), te = new z.PolySynth().toDestination();
          }
        else x === "Destination" && (P[O] = z.Destination);
        te && (P[O] = te);
      }), P;
    } catch (C) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", C), null;
    }
  }, F = (P) => `${Math.floor(P / 60)}:${Math.floor(P % 60).toString().padStart(2, "0")}`;
  B.textContent = F(S);
  const G = async () => {
    if (typeof window < "u") {
      if (!window.Tone)
        try {
          if (typeof require < "u")
            window.Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js");
          else {
            const P = await import("https://unpkg.com/tone@14.8.49/build/Tone.js");
            window.Tone = P.default || P;
          }
        } catch (P) {
          return console.warn("Could not auto-load Tone.js:", P.message), console.log("To use the player, load Tone.js manually first:"), console.log('Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js")'), !1;
        }
      if (window.Tone) {
        z = window.Tone;
        try {
          return (z.context.state === "suspended" || z.context.state === "interrupted") && await z.context.resume(), z.context.state !== "running" && (await z.start(), navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && await new Promise((P) => setTimeout(P, 100))), z.context.state === "running";
        } catch (P) {
          return console.error("[PLAYER] Failed to initialize audio context:", P), !1;
        }
      }
    }
    return console.warn("Tone.js not available"), !1;
  }, Q = () => {
    if (z) {
      if (!y && (y = A(), y)) {
        const P = Object.keys(y).filter((T) => y[T] && y[T].name === "Sampler");
        P.length > 0 && console.log("[PLAYER] Using audioGraph Samplers for tracks with synthRef:", P);
      }
      N.forEach((P) => {
        if (!y || !Object.values(y).includes(P))
          try {
            P.dispose();
          } catch {
          }
      }), I.forEach((P) => {
        P.stop(), P.dispose();
      }), N = [], I = [], console.log("[PLAYER] Converted tracks:", w.length), w.forEach((P) => {
        const { originalTrackIndex: T, voiceIndex: C, totalVoices: O, trackInfo: x, synthConfig: U, partEvents: X } = P, oe = (M[T] || {}).synthRef, le = 60 / _.tempo, se = (X || []).map((re) => {
          const K = typeof re.time == "number" ? re.time * le : re.time, ie = typeof re.duration == "number" ? re.duration * le : re.duration;
          return { ...re, time: K, duration: ie };
        });
        let ae = null;
        if (oe && y && y[oe])
          ae = y[oe];
        else {
          const re = v[T] ? v[T].value : U.type;
          try {
            const K = U.reason === "glissando_compatibility" ? U.type : re;
            ae = new z[K]().toDestination(), U.reason === "glissando_compatibility" && C === 0 && console.warn(`[MULTIVOICE] Using ${K} instead of ${U.original} for glissando in ${x.label}`);
          } catch (K) {
            console.warn(`Failed to create ${re}, using PolySynth:`, K), ae = new z.PolySynth().toDestination();
          }
        }
        N.push(ae), O > 1 && console.log(`[MULTIVOICE] Track "${x.label}" voice ${C + 1}: ${X.length} notes`);
        const ue = new z.Part((re, K) => {
          if (Array.isArray(K.pitch))
            K.pitch.forEach((ie) => {
              let fe = "C4";
              typeof ie == "number" ? fe = z.Frequency(ie, "midi").toNote() : typeof ie == "string" ? fe = ie : Array.isArray(ie) && typeof ie[0] == "string" && (fe = ie[0]), ae.triggerAttackRelease(fe, K.duration, re);
            });
          else if (K.articulation === "glissando" && K.glissTarget !== void 0) {
            let ie = typeof K.pitch == "number" ? z.Frequency(K.pitch, "midi").toNote() : K.pitch, fe = typeof K.glissTarget == "number" ? z.Frequency(K.glissTarget, "midi").toNote() : K.glissTarget;
            console.log("[PLAYER] Glissando", { fromNote: ie, toNote: fe, duration: K.duration, time: re }), console.log("[PLAYER] Glissando effect starting from", ie, "to", fe), ae.triggerAttack(ie, re, K.velocity || 0.8);
            const ve = z.Frequency(ie).toFrequency(), je = z.Frequency(fe).toFrequency(), xe = 1200 * Math.log2(je / ve);
            if (ae.detune && ae.detune.setValueAtTime && ae.detune.linearRampToValueAtTime)
              ae.detune.setValueAtTime(0, re), ae.detune.linearRampToValueAtTime(xe, re + K.duration), console.log("[PLAYER] Applied detune glissando:", xe, "cents over", K.duration, "beats");
            else {
              const Ln = z.Frequency(ie).toMidi(), Un = z.Frequency(fe).toMidi(), Ve = Math.max(3, Math.abs(Un - Ln)), nr = K.duration / Ve;
              for (let ze = 1; ze < Ve; ze++) {
                const Gn = ze / (Ve - 1), Bn = ve * Math.pow(je / ve, Gn), Kn = z.Frequency(Bn).toNote(), Hn = re + ze * nr;
                ae.triggerAttackRelease(Kn, nr * 0.8, Hn, (K.velocity || 0.8) * 0.7);
              }
              console.log("[PLAYER] Applied chromatic glissando with", Ve, "steps");
            }
            ae.triggerRelease(re + K.duration);
          } else {
            let ie = "C4";
            typeof K.pitch == "number" ? ie = z.Frequency(K.pitch, "midi").toNote() : typeof K.pitch == "string" ? ie = K.pitch : Array.isArray(K.pitch) && typeof K.pitch[0] == "string" && (ie = K.pitch[0]);
            let fe = K.duration, ve = K.velocity || 0.8;
            K.articulation === "staccato" && (fe = K.duration * 0.5), K.articulation === "accent" && (ve = Math.min(ve * 2, 1)), K.articulation === "tenuto" && (fe = K.duration * 1.5, ve = Math.min(ve * 1.3, 1)), ae.triggerAttackRelease(ie, fe, re, ve);
          }
        }, se);
        ue.start(0), I.push(ue);
      }), z.Transport.bpm.value = _.tempo, z.Transport.loopEnd = S, z.Transport.loop = !0, z.Transport.stop(), z.Transport.position = 0, B.textContent = F(S);
    }
  }, W = () => {
    if (z && q) {
      const P = typeof z.Transport.loopEnd == "number" ? z.Transport.loopEnd : z.Time(z.Transport.loopEnd).toSeconds(), T = z.Transport.seconds % P, C = T / P * 100;
      L.value = Math.min(C, 100), V.textContent = F(T), B.textContent = F(P), z.Transport.state === "started" && q ? requestAnimationFrame(W) : z.Transport.state === "stopped" && (z.Transport.seconds = 0, L.value = 0, V.textContent = F(0), q = !1, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  if (H.addEventListener("click", async () => {
    if (!z)
      if (await G())
        Q();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (q)
      z.Transport.stop(), q = !1, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
    else {
      if (z.context.state !== "running" && (await z.start(), console.log("[PLAYER] Audio context started:", z.context.state)), N.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), Q()), z.Transport.stop(), z.Transport.position = 0, console.log("[PLAYER] Transport state before start:", z.Transport.state), console.log("[PLAYER] Transport position reset to:", z.Transport.position), console.log("[PLAYER] Audio context state:", z.context.state), console.log("[PLAYER] Parts count:", I.length), console.log("[PLAYER] Synths count:", N.length), y) {
        const P = Object.values(y).filter((T) => T && T.name === "Sampler");
        if (P.length > 0 && R.length > 0) {
          console.log(`[PLAYER] Waiting for ${P.length} sampler(s) to load...`);
          try {
            await Promise.all(R), console.log("[PLAYER] All samplers loaded.");
          } catch (T) {
            console.warn("[PLAYER] Sampler load wait error:", T);
            return;
          }
        }
      }
      z.Transport.start(), q = !0, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', W();
    }
  }), L.addEventListener("input", () => {
    if (z && S > 0) {
      const P = L.value / 100 * S;
      z.Transport.seconds = P, V.textContent = F(P);
    }
  }), j.addEventListener("change", () => {
    const P = parseInt(j.value);
    z && P >= 60 && P <= 240 ? z.Transport.bpm.value = P : j.value = z ? z.Transport.bpm.value : l;
  }), v.forEach((P) => {
    P.addEventListener("change", () => {
      z && N.length > 0 && Q();
    });
  }), ye.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), ee.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  }), typeof window < "u" && window.Tone && G().then(() => {
    Q(), t && setTimeout(() => {
      H.click();
    }, 500);
  }), t && !window.Tone) {
    const P = setInterval(() => {
      window.Tone && (clearInterval(P), setTimeout(() => {
        H.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(P);
    }, 1e4);
  }
  return b;
}
function tr(o, e = 0.25, t = "nearest") {
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
function xn(o, { grid: e = 0.25, fields: t = ["time", "duration"], mode: r = "nearest" } = {}) {
  return Array.isArray(o) ? o.map((n) => {
    const i = { ...n };
    return t.forEach((s) => {
      typeof i[s] == "number" && (i[s] = tr(i[s], e, r));
    }), i;
  }) : o;
}
function Vn(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.notes) ? o : {
    ...o,
    notes: xn(o.notes, { grid: e, fields: ["time", "duration"], mode: t })
  };
}
function os(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.tracks) ? o : {
    ...o,
    tracks: o.tracks.map((r) => Vn(r, { grid: e, mode: t }))
  };
}
function zn(o, e = 0.25) {
  const t = Math.round(1 / e), r = Math.round(o / e);
  return r <= 0 || r === t ? "" : r % t === 0 ? String(r / t) : `${r}/${t}`;
}
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: zn,
  quantize: tr,
  quantizeComposition: os,
  quantizeEvents: xn,
  quantizeTrack: Vn
}, Symbol.toStringTag, { value: "Module" }));
class ss {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new Xt(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(e);
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
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, s = r[2] || 0, a = 60 / t, l = a * 4, u = a / 480;
      return n * l + i * a + s * u;
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
    const n = e.timeSignature || "4/4", [i, s] = n.split("/").map(Number), a = i * (4 / s), l = t.measuresPerLine || 4, u = t.lineBreaks || [], p = t.renderMode || "merged", w = t.trackIndex || 0, _ = !!t.hideRests, S = t.showArticulations !== !1, E = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (E.length === 0) return r;
    const b = (() => {
      let d = 0;
      return E.forEach((c) => {
        const f = c.notes || c;
        Array.isArray(f) && f.forEach((m) => {
          const v = typeof m.time == "number" ? m.time : 0, g = typeof m.duration == "number" ? m.duration : 1, $ = v + g;
          $ > d && (d = $);
        });
      }), d;
    })(), h = Math.max(1, Math.ceil(b / a));
    if (p === "tracks" && E.length > 1)
      r += "%%score {", E.forEach((d, c) => {
        c > 0 && (r += " | "), r += `${c + 1}`;
      }), r += `}
`, E.forEach((d, c) => {
        const f = d.notes || d;
        if (f.length === 0) return;
        const m = c + 1, v = d.label || `Track ${c + 1}`, g = v.length > 12 ? v.substring(0, 10) + ".." : v, $ = d.instrument ? ` [${d.instrument}]` : "";
        r += `V:${m} name="${v}${$}" snm="${g}"
`;
        const k = f.filter((D) => D.pitch !== void 0).sort((D, V) => (D.time || 0) - (V.time || 0)), { abcNotesStr: j } = this.convertNotesToAbc(k, a, l, u, { hideRests: _, showArticulations: S, padMeasures: h });
        j.trim() && (r += j + `
`);
      });
    else if (p === "drums") {
      r += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const d = t.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, c = (g) => {
        const $ = (g || "").toLowerCase();
        for (const k of Object.keys(d))
          if ($.includes(k)) return d[k];
        return "E";
      }, f = [];
      E.forEach((g) => {
        const $ = g.notes || g, k = g.label || "", j = c(k);
        ($ || []).forEach((D) => {
          D.pitch !== void 0 && f.push({
            time: typeof D.time == "number" ? D.time : 0,
            duration: typeof D.duration == "number" ? D.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: j,
            articulation: D.articulation
          });
        });
      });
      const m = f.sort((g, $) => (g.time || 0) - ($.time || 0)), { abcNotesStr: v } = this.convertNotesToAbc(m, a, l, u, { hideRests: _, showArticulations: S, padMeasures: h });
      v.trim() && (r += v + `
`);
    } else if (p === "single") {
      const d = E[w];
      if (d) {
        const f = (d.notes || d).filter((v) => v.pitch !== void 0).sort((v, g) => (v.time || 0) - (g.time || 0)), { abcNotesStr: m } = this.convertNotesToAbc(f, a, l, u, { hideRests: _, showArticulations: S, padMeasures: h });
        m.trim() && (r += m + `
`);
      }
    } else {
      const d = [];
      E.forEach((m) => {
        (m.notes || m).forEach((g) => {
          g.pitch !== void 0 && d.push(g);
        });
      });
      const c = d.sort((m, v) => (m.time || 0) - (v.time || 0)), { abcNotesStr: f } = this.convertNotesToAbc(c, a, l, u, { hideRests: _, showArticulations: S, padMeasures: h });
      f.trim() && (r += f + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}) {
    let s = "", a = 0, l = 0, u = 0, p = 0;
    const w = options?.quantizeBeats || 0.25, _ = 1e-6, S = (m) => tr(m, w, "nearest"), E = (m) => zn(m, w), b = (m) => {
      s += m + " ";
    }, h = () => {
      for (; a >= t - 1e-9; )
        b("|"), a -= t, l++, u++, (n.includes(l) || u >= r) && (s += `
`, u = 0);
    }, d = (m, { forceVisible: v = !1 } = {}) => {
      let g = m;
      for (; g > 0; ) {
        const $ = t - a, k = S(Math.min(g, $));
        let j = i.hideRests && !v ? "x" : "z";
        j += E(k), b(j), a = S(a + k), h(), g = S(g - k);
      }
    };
    for (const m of e) {
      const v = typeof m.time == "number" ? S(m.time) : 0, g = typeof m.duration == "number" ? S(m.duration) : 1, $ = S(v - p);
      $ > _ && d($);
      let k = "z";
      if (typeof m.pitch == "number") {
        const D = m.pitch, V = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], B = Math.floor(D / 12) - 1, L = D % 12;
        k = V[L].replace("#", "^"), B >= 4 ? (k = k.toLowerCase(), B > 4 && (k += "'".repeat(B - 4))) : B < 4 && (k = k.toUpperCase(), B < 3 && (k += ",".repeat(3 - B)));
      } else typeof m.pitch == "string" ? k = m.pitch : m.pitch === null && (k = i.hideRests ? "x" : "z");
      let j = k;
      j += E(g), i.showArticulations && (m.articulation === "staccato" && (j += "."), m.articulation === "accent" && (j += ">"), m.articulation === "tenuto" && (j += "-"), m.articulation === "marcato" && (j += "^")), b(j), a = S(a + g), h(), p = S(v + g);
    }
    const c = i.padMeasures || 0;
    for (; l < c; ) {
      const m = S(t - a);
      m > _ && d(m, { forceVisible: !0 }), b("|"), a = 0, l++;
    }
    const f = s.trim();
    return f && !f.endsWith("|") && (s += "|"), { abcNotesStr: s };
  }
}
function Fn(o, e = {}) {
  return ss.convertToAbc(o, e);
}
class rr {
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
          noteName: typeof i.pitch == "number" ? rr.midiToNoteName(i.pitch) : i.pitch,
          time: i.time,
          duration: i.duration,
          velocity: i.velocity || 0.8,
          articulation: i.articulation || null
        }))
      }))
    };
  }
}
function as(o) {
  return rr.convert(o);
}
function cs(o, e = {}) {
  return {
    sampleRate: e.sampleRate || 44100,
    duration: e.duration || 10,
    channels: e.channels || 1,
    bpm: o.bpm || 120,
    notes: o.tracks?.flatMap((t) => t.notes) || []
  };
}
class ls {
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
function us(o) {
  return ls.convert(o);
}
function ds(o) {
  return new Xt().validateAndNormalize(o);
}
function fs(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error("[RENDER] Invalid JMON object:", o), new Error("render() requires a valid JMON object");
  return !o.sequences && !o.tracks && !o.format && console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), er(o, e);
}
function hs(o, e = {}) {
  const t = { autoplay: !0, ...e };
  return er(o, t);
}
function ps(o, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: s = {}
  } = e, a = Fn(o, s), l = document.createElement("div");
  l.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const u = document.createElement("div");
  if (u.id = `rendered-score-${Date.now()}`, u.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, l.appendChild(u), n) {
    const p = document.createElement("details");
    p.style.marginTop = "15px";
    const w = document.createElement("summary");
    w.textContent = "ABC Notation (click to expand)", w.style.cursor = "pointer", p.appendChild(w);
    const _ = document.createElement("pre");
    _.textContent = a, _.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, p.appendChild(_), l.appendChild(p);
  }
  if (typeof ABCJS < "u")
    try {
      const p = r || null, w = { responsive: i, scale: t };
      p && (w.staffwidth = p), ABCJS.renderAbc(u, a, w), setTimeout(() => {
        if (u.children.length === 0 || u.innerHTML.trim() === "")
          try {
            ABCJS.renderAbc(u, a), u.children.length === 0 && (u.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + a + "</pre>");
          } catch {
            u.innerHTML = "<p>Error with alternative rendering</p><pre>" + a + "</pre>";
          }
      }, 200);
    } catch (p) {
      console.error("Error rendering with ABCJS:", p), u.innerHTML = "<p>Error rendering notation</p><pre>" + a + "</pre>";
    }
  else
    u.innerHTML = "<p>ABCJS not available - showing text notation only</p><pre>" + a + "</pre>";
  return l;
}
const ms = {
  // Core functionality
  render: fs,
  play: hs,
  score: ps,
  validate: ds,
  // Core formats and players
  createPlayer: er,
  // Converters
  converters: {
    abc: Fn,
    midi: as,
    tonejs: Dn,
    wav: cs,
    supercollider: us
  },
  // Theory and algorithms
  theory: qe.theory,
  generative: qe.generative,
  analysis: qe.analysis,
  constants: qe.constants,
  // Utils
  utils: {
    ...qe.utils,
    JmonValidator: Xt,
    // Expose utility helpers
    quantize: (o, e, t) => Promise.resolve().then(() => Et).then((r) => r.quantize(o, e, t)),
    quantizeEvents: async (o, e) => (await Promise.resolve().then(() => Et)).quantizeEvents(o, e),
    quantizeTrack: async (o, e) => (await Promise.resolve().then(() => Et)).quantizeTrack(o, e),
    quantizeComposition: async (o, e) => (await Promise.resolve().then(() => Et)).quantizeComposition(o, e)
  },
  VERSION: "1.0.0"
}, ys = {
  loops: {
    async plotLoops(o, e = 4, t = 1 / 4, r = null, n = {}) {
      const { LoopVisualizer: i } = await import("./LoopVisualizer-DS22P85c.mjs");
      return i.plotLoops(o, e, t, r, n);
    }
  }
};
ms.visualization = ys;
export {
  ms as default,
  ms as jm
};
