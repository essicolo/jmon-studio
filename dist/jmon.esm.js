function ci(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var He = { exports: {} }, Ft = {}, Pe = {}, Ne = {}, Lt = {}, Ut = {}, Gt = {}, pr;
function It() {
  return pr || (pr = 1, (function(s) {
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
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((f, m) => `${f}${m}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((f, m) => (m instanceof t && (f[m.str] = (f[m.str] || 0) + 1), f), {});
      }
    }
    s._Code = r, s.nil = new r("");
    function n(p, ...l) {
      const f = [p[0]];
      let m = 0;
      for (; m < l.length; )
        a(f, l[m]), f.push(p[++m]);
      return new r(f);
    }
    s._ = n;
    const i = new r("+");
    function o(p, ...l) {
      const f = [$(p[0])];
      let m = 0;
      for (; m < l.length; )
        f.push(i), a(f, l[m]), f.push(i, $(p[++m]));
      return c(f), new r(f);
    }
    s.str = o;
    function a(p, l) {
      l instanceof r ? p.push(...l._items) : l instanceof t ? p.push(l) : p.push(v(l));
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
    function v(p) {
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
    function S(p) {
      return typeof p == "string" && s.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    s.getProperty = S;
    function g(p) {
      if (typeof p == "string" && s.IDENTIFIER.test(p))
        return new r(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    s.getEsmExportName = g;
    function h(p) {
      return new r(p.toString());
    }
    s.regexpCode = h;
  })(Gt)), Gt;
}
var Bt = {}, mr;
function yr() {
  return mr || (mr = 1, (function(s) {
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
        var d, v;
        if (!((v = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || v === void 0) && v.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    s.Scope = n;
    class i extends e.Name {
      constructor(u, d) {
        super(d), this.prefix = u;
      }
      setValue(u, { property: d, itemIndex: v }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(d)}[${v}]`;
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
        var v;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(u), { prefix: $ } = _, S = (v = d.key) !== null && v !== void 0 ? v : d.ref;
        let g = this._values[$];
        if (g) {
          const l = g.get(S);
          if (l)
            return l;
        } else
          g = this._values[$] = /* @__PURE__ */ new Map();
        g.set(S, _);
        const h = this._scope[$] || (this._scope[$] = []), p = h.length;
        return h[p] = d.ref, _.setValue(d, { property: $, itemIndex: p }), _;
      }
      getValue(u, d) {
        const v = this._values[u];
        if (v)
          return v.get(d);
      }
      scopeRefs(u, d = this._values) {
        return this._reduceValues(d, (v) => {
          if (v.scopePath === void 0)
            throw new Error(`CodeGen: name "${v}" has no value`);
          return (0, e._)`${u}${v.scopePath}`;
        });
      }
      scopeCode(u = this._values, d, v) {
        return this._reduceValues(u, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, d, v);
      }
      _reduceValues(u, d, v = {}, _) {
        let $ = e.nil;
        for (const S in u) {
          const g = u[S];
          if (!g)
            continue;
          const h = v[S] = v[S] || /* @__PURE__ */ new Map();
          g.forEach((p) => {
            if (h.has(p))
              return;
            h.set(p, r.Started);
            let l = d(p);
            if (l) {
              const f = this.opts.es5 ? s.varKinds.var : s.varKinds.const;
              $ = (0, e._)`${$}${f} ${p} = ${l};${this.opts._n}`;
            } else if (l = _?.(p))
              $ = (0, e._)`${$}${l}${this.opts._n}`;
            else
              throw new t(p);
            h.set(p, r.Completed);
          });
        }
        return $;
      }
    }
    s.ValueScope = a;
  })(Bt)), Bt;
}
var gr;
function Y() {
  return gr || (gr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.or = s.and = s.not = s.CodeGen = s.operators = s.varKinds = s.ValueScopeName = s.ValueScope = s.Scope = s.Name = s.regexpCode = s.stringify = s.getProperty = s.nil = s.strConcat = s.str = s._ = void 0;
    const e = It(), t = yr();
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
    var n = yr();
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
      optimizeNames(y, E) {
        return this;
      }
    }
    class o extends i {
      constructor(y, E, R) {
        super(), this.varKind = y, this.name = E, this.rhs = R;
      }
      render({ es5: y, _n: E }) {
        const R = y ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${R} ${this.name}${F};` + E;
      }
      optimizeNames(y, E) {
        if (y[this.name.str])
          return this.rhs && (this.rhs = H(this.rhs, y, E)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(y, E, R) {
        super(), this.lhs = y, this.rhs = E, this.sideEffects = R;
      }
      render({ _n: y }) {
        return `${this.lhs} = ${this.rhs};` + y;
      }
      optimizeNames(y, E) {
        if (!(this.lhs instanceof e.Name && !y[this.lhs.str] && !this.sideEffects))
          return this.rhs = H(this.rhs, y, E), this;
      }
      get names() {
        const y = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return L(y, this.rhs);
      }
    }
    class c extends a {
      constructor(y, E, R, F) {
        super(y, R, F), this.op = E;
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
    class d extends i {
      constructor(y) {
        super(), this.label = y, this.names = {};
      }
      render({ _n: y }) {
        return `break${this.label ? ` ${this.label}` : ""};` + y;
      }
    }
    class v extends i {
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
      optimizeNames(y, E) {
        return this.code = H(this.code, y, E), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class $ extends i {
      constructor(y = []) {
        super(), this.nodes = y;
      }
      render(y) {
        return this.nodes.reduce((E, R) => E + R.render(y), "");
      }
      optimizeNodes() {
        const { nodes: y } = this;
        let E = y.length;
        for (; E--; ) {
          const R = y[E].optimizeNodes();
          Array.isArray(R) ? y.splice(E, 1, ...R) : R ? y[E] = R : y.splice(E, 1);
        }
        return y.length > 0 ? this : void 0;
      }
      optimizeNames(y, E) {
        const { nodes: R } = this;
        let F = R.length;
        for (; F--; ) {
          const G = R[F];
          G.optimizeNames(y, E) || (ce(y, G.names), R.splice(F, 1));
        }
        return R.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((y, E) => B(y, E.names), {});
      }
    }
    class S extends $ {
      render(y) {
        return "{" + y._n + super.render(y) + "}" + y._n;
      }
    }
    class g extends $ {
    }
    class h extends S {
    }
    h.kind = "else";
    class p extends S {
      constructor(y, E) {
        super(E), this.condition = y;
      }
      render(y) {
        let E = `if(${this.condition})` + super.render(y);
        return this.else && (E += "else " + this.else.render(y)), E;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const y = this.condition;
        if (y === !0)
          return this.nodes;
        let E = this.else;
        if (E) {
          const R = E.optimizeNodes();
          E = this.else = Array.isArray(R) ? new h(R) : R;
        }
        if (E)
          return y === !1 ? E instanceof p ? E : E.nodes : this.nodes.length ? this : new p(me(y), E instanceof p ? [E] : E.nodes);
        if (!(y === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(y, E) {
        var R;
        if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(y, E), !!(super.optimizeNames(y, E) || this.else))
          return this.condition = H(this.condition, y, E), this;
      }
      get names() {
        const y = super.names;
        return L(y, this.condition), this.else && B(y, this.else.names), y;
      }
    }
    p.kind = "if";
    class l extends S {
    }
    l.kind = "for";
    class f extends l {
      constructor(y) {
        super(), this.iteration = y;
      }
      render(y) {
        return `for(${this.iteration})` + super.render(y);
      }
      optimizeNames(y, E) {
        if (super.optimizeNames(y, E))
          return this.iteration = H(this.iteration, y, E), this;
      }
      get names() {
        return B(super.names, this.iteration.names);
      }
    }
    class m extends l {
      constructor(y, E, R, F) {
        super(), this.varKind = y, this.name = E, this.from = R, this.to = F;
      }
      render(y) {
        const E = y.es5 ? t.varKinds.var : this.varKind, { name: R, from: F, to: G } = this;
        return `for(${E} ${R}=${F}; ${R}<${G}; ${R}++)` + super.render(y);
      }
      get names() {
        const y = L(super.names, this.from);
        return L(y, this.to);
      }
    }
    class w extends l {
      constructor(y, E, R, F) {
        super(), this.loop = y, this.varKind = E, this.name = R, this.iterable = F;
      }
      render(y) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(y);
      }
      optimizeNames(y, E) {
        if (super.optimizeNames(y, E))
          return this.iterable = H(this.iterable, y, E), this;
      }
      get names() {
        return B(super.names, this.iterable.names);
      }
    }
    class b extends S {
      constructor(y, E, R) {
        super(), this.name = y, this.args = E, this.async = R;
      }
      render(y) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(y);
      }
    }
    b.kind = "func";
    class P extends $ {
      render(y) {
        return "return " + super.render(y);
      }
    }
    P.kind = "return";
    class k extends S {
      render(y) {
        let E = "try" + super.render(y);
        return this.catch && (E += this.catch.render(y)), this.finally && (E += this.finally.render(y)), E;
      }
      optimizeNodes() {
        var y, E;
        return super.optimizeNodes(), (y = this.catch) === null || y === void 0 || y.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(y, E) {
        var R, F;
        return super.optimizeNames(y, E), (R = this.catch) === null || R === void 0 || R.optimizeNames(y, E), (F = this.finally) === null || F === void 0 || F.optimizeNames(y, E), this;
      }
      get names() {
        const y = super.names;
        return this.catch && B(y, this.catch.names), this.finally && B(y, this.finally.names), y;
      }
    }
    class C extends S {
      constructor(y) {
        super(), this.error = y;
      }
      render(y) {
        return `catch(${this.error})` + super.render(y);
      }
    }
    C.kind = "catch";
    class x extends S {
      render(y) {
        return "finally" + super.render(y);
      }
    }
    x.kind = "finally";
    class z {
      constructor(y, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = y, this._scope = new t.Scope({ parent: y }), this._nodes = [new g()];
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
      scopeValue(y, E) {
        const R = this._extScope.value(y, E);
        return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
      }
      getScopeValue(y, E) {
        return this._extScope.getValue(y, E);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(y) {
        return this._extScope.scopeRefs(y, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(y, E, R, F) {
        const G = this._scope.toName(E);
        return R !== void 0 && F && (this._constants[G.str] = R), this._leafNode(new o(y, G, R)), G;
      }
      // `const` declaration (`var` in es5 mode)
      const(y, E, R) {
        return this._def(t.varKinds.const, y, E, R);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(y, E, R) {
        return this._def(t.varKinds.let, y, E, R);
      }
      // `var` declaration with optional assignment
      var(y, E, R) {
        return this._def(t.varKinds.var, y, E, R);
      }
      // assignment code
      assign(y, E, R) {
        return this._leafNode(new a(y, E, R));
      }
      // `+=` code
      add(y, E) {
        return this._leafNode(new c(y, s.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(y) {
        return typeof y == "function" ? y() : y !== e.nil && this._leafNode(new _(y)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...y) {
        const E = ["{"];
        for (const [R, F] of y)
          E.length > 1 && E.push(","), E.push(R), (R !== F || this.opts.es5) && (E.push(":"), (0, e.addCodeArg)(E, F));
        return E.push("}"), new e._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(y, E, R) {
        if (this._blockNode(new p(y)), E && R)
          this.code(E).else().code(R).endIf();
        else if (E)
          this.code(E).endIf();
        else if (R)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(y) {
        return this._elseNode(new p(y));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, h);
      }
      _for(y, E) {
        return this._blockNode(y), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(y, E) {
        return this._for(new f(y), E);
      }
      // `for` statement for a range of values
      forRange(y, E, R, F, G = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Q = this._scope.toName(y);
        return this._for(new m(G, Q, E, R), () => F(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(y, E, R, F = t.varKinds.const) {
        const G = this._scope.toName(y);
        if (this.opts.es5) {
          const Q = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${Q}.length`, (W) => {
            this.var(G, (0, e._)`${Q}[${W}]`), R(G);
          });
        }
        return this._for(new w("of", F, G, E), () => R(G));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(y, E, R, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(y, (0, e._)`Object.keys(${E})`, R);
        const G = this._scope.toName(y);
        return this._for(new w("in", F, G, E), () => R(G));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(l);
      }
      // `label` statement
      label(y) {
        return this._leafNode(new u(y));
      }
      // `break` statement
      break(y) {
        return this._leafNode(new d(y));
      }
      // `return` statement
      return(y) {
        const E = new P();
        if (this._blockNode(E), this.code(y), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(P);
      }
      // `try` statement
      try(y, E, R) {
        if (!E && !R)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new k();
        if (this._blockNode(F), this.code(y), E) {
          const G = this.name("e");
          this._currNode = F.catch = new C(G), E(G);
        }
        return R && (this._currNode = F.finally = new x(), this.code(R)), this._endBlockNode(C, x);
      }
      // `throw` statement
      throw(y) {
        return this._leafNode(new v(y));
      }
      // start self-balancing block
      block(y, E) {
        return this._blockStarts.push(this._nodes.length), y && this.code(y).endBlock(E), this;
      }
      // end the current self-balancing block
      endBlock(y) {
        const E = this._blockStarts.pop();
        if (E === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const R = this._nodes.length - E;
        if (R < 0 || y !== void 0 && R !== y)
          throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${y} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(y, E = e.nil, R, F) {
        return this._blockNode(new b(y, E, R)), F && this.code(F).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(b);
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
      _endBlockNode(y, E) {
        const R = this._currNode;
        if (R instanceof y || E && R instanceof E)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${E ? `${y.kind}/${E.kind}` : y.kind}"`);
      }
      _elseNode(y) {
        const E = this._currNode;
        if (!(E instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = E.else = y, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const y = this._nodes;
        return y[y.length - 1];
      }
      set _currNode(y) {
        const E = this._nodes;
        E[E.length - 1] = y;
      }
    }
    s.CodeGen = z;
    function B(A, y) {
      for (const E in y)
        A[E] = (A[E] || 0) + (y[E] || 0);
      return A;
    }
    function L(A, y) {
      return y instanceof e._CodeOrName ? B(A, y.names) : A;
    }
    function H(A, y, E) {
      if (A instanceof e.Name)
        return R(A);
      if (!F(A))
        return A;
      return new e._Code(A._items.reduce((G, Q) => (Q instanceof e.Name && (Q = R(Q)), Q instanceof e._Code ? G.push(...Q._items) : G.push(Q), G), []));
      function R(G) {
        const Q = E[G.str];
        return Q === void 0 || y[G.str] !== 1 ? G : (delete y[G.str], Q);
      }
      function F(G) {
        return G instanceof e._Code && G._items.some((Q) => Q instanceof e.Name && y[Q.str] === 1 && E[Q.str] !== void 0);
      }
    }
    function ce(A, y) {
      for (const E in y)
        A[E] = (A[E] || 0) - (y[E] || 0);
    }
    function me(A) {
      return typeof A == "boolean" || typeof A == "number" || A === null ? !A : (0, e._)`!${j(A)}`;
    }
    s.not = me;
    const ye = N(s.operators.AND);
    function ee(...A) {
      return A.reduce(ye);
    }
    s.and = ee;
    const V = N(s.operators.OR);
    function O(...A) {
      return A.reduce(V);
    }
    s.or = O;
    function N(A) {
      return (y, E) => y === e.nil ? E : E === e.nil ? y : (0, e._)`${j(y)} ${A} ${j(E)}`;
    }
    function j(A) {
      return A instanceof e.Name ? A : (0, e._)`(${A})`;
    }
  })(Ut)), Ut;
}
var J = {}, vr;
function Z() {
  if (vr) return J;
  vr = 1, Object.defineProperty(J, "__esModule", { value: !0 }), J.checkStrictMode = J.getErrorPath = J.Type = J.useFunc = J.setEvaluated = J.evaluatedPropsToName = J.mergeEvaluated = J.eachItem = J.unescapeJsonPointer = J.escapeJsonPointer = J.escapeFragment = J.unescapeFragment = J.schemaRefOrVal = J.schemaHasRulesButRef = J.schemaHasRules = J.checkUnknownRules = J.alwaysValidSchema = J.toHash = void 0;
  const s = Y(), e = It();
  function t(w) {
    const b = {};
    for (const P of w)
      b[P] = !0;
    return b;
  }
  J.toHash = t;
  function r(w, b) {
    return typeof b == "boolean" ? b : Object.keys(b).length === 0 ? !0 : (n(w, b), !i(b, w.self.RULES.all));
  }
  J.alwaysValidSchema = r;
  function n(w, b = w.schema) {
    const { opts: P, self: k } = w;
    if (!P.strictSchema || typeof b == "boolean")
      return;
    const C = k.RULES.keywords;
    for (const x in b)
      C[x] || m(w, `unknown keyword: "${x}"`);
  }
  J.checkUnknownRules = n;
  function i(w, b) {
    if (typeof w == "boolean")
      return !w;
    for (const P in w)
      if (b[P])
        return !0;
    return !1;
  }
  J.schemaHasRules = i;
  function o(w, b) {
    if (typeof w == "boolean")
      return !w;
    for (const P in w)
      if (P !== "$ref" && b.all[P])
        return !0;
    return !1;
  }
  J.schemaHasRulesButRef = o;
  function a({ topSchemaRef: w, schemaPath: b }, P, k, C) {
    if (!C) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, s._)`${P}`;
    }
    return (0, s._)`${w}${b}${(0, s.getProperty)(k)}`;
  }
  J.schemaRefOrVal = a;
  function c(w) {
    return v(decodeURIComponent(w));
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
  function v(w) {
    return w.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  J.unescapeJsonPointer = v;
  function _(w, b) {
    if (Array.isArray(w))
      for (const P of w)
        b(P);
    else
      b(w);
  }
  J.eachItem = _;
  function $({ mergeNames: w, mergeToName: b, mergeValues: P, resultToName: k }) {
    return (C, x, z, B) => {
      const L = z === void 0 ? x : z instanceof s.Name ? (x instanceof s.Name ? w(C, x, z) : b(C, x, z), z) : x instanceof s.Name ? (b(C, z, x), x) : P(x, z);
      return B === s.Name && !(L instanceof s.Name) ? k(C, L) : L;
    };
  }
  J.mergeEvaluated = {
    props: $({
      mergeNames: (w, b, P) => w.if((0, s._)`${P} !== true && ${b} !== undefined`, () => {
        w.if((0, s._)`${b} === true`, () => w.assign(P, !0), () => w.assign(P, (0, s._)`${P} || {}`).code((0, s._)`Object.assign(${P}, ${b})`));
      }),
      mergeToName: (w, b, P) => w.if((0, s._)`${P} !== true`, () => {
        b === !0 ? w.assign(P, !0) : (w.assign(P, (0, s._)`${P} || {}`), g(w, P, b));
      }),
      mergeValues: (w, b) => w === !0 ? !0 : { ...w, ...b },
      resultToName: S
    }),
    items: $({
      mergeNames: (w, b, P) => w.if((0, s._)`${P} !== true && ${b} !== undefined`, () => w.assign(P, (0, s._)`${b} === true ? true : ${P} > ${b} ? ${P} : ${b}`)),
      mergeToName: (w, b, P) => w.if((0, s._)`${P} !== true`, () => w.assign(P, b === !0 ? !0 : (0, s._)`${P} > ${b} ? ${P} : ${b}`)),
      mergeValues: (w, b) => w === !0 ? !0 : Math.max(w, b),
      resultToName: (w, b) => w.var("items", b)
    })
  };
  function S(w, b) {
    if (b === !0)
      return w.var("props", !0);
    const P = w.var("props", (0, s._)`{}`);
    return b !== void 0 && g(w, P, b), P;
  }
  J.evaluatedPropsToName = S;
  function g(w, b, P) {
    Object.keys(P).forEach((k) => w.assign((0, s._)`${b}${(0, s.getProperty)(k)}`, !0));
  }
  J.setEvaluated = g;
  const h = {};
  function p(w, b) {
    return w.scopeValue("func", {
      ref: b,
      code: h[b.code] || (h[b.code] = new e._Code(b.code))
    });
  }
  J.useFunc = p;
  var l;
  (function(w) {
    w[w.Num = 0] = "Num", w[w.Str = 1] = "Str";
  })(l || (J.Type = l = {}));
  function f(w, b, P) {
    if (w instanceof s.Name) {
      const k = b === l.Num;
      return P ? k ? (0, s._)`"[" + ${w} + "]"` : (0, s._)`"['" + ${w} + "']"` : k ? (0, s._)`"/" + ${w}` : (0, s._)`"/" + ${w}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, s.getProperty)(w).toString() : "/" + d(w);
  }
  J.getErrorPath = f;
  function m(w, b, P = w.opts.strictSchema) {
    if (P) {
      if (b = `strict mode: ${b}`, P === !0)
        throw new Error(b);
      w.self.logger.warn(b);
    }
  }
  return J.checkStrictMode = m, J;
}
var Je = {}, br;
function ke() {
  if (br) return Je;
  br = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const s = Y(), e = {
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
  return Je.default = e, Je;
}
var wr;
function Ot() {
  return wr || (wr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.extendErrors = s.resetErrorsCount = s.reportExtraError = s.reportError = s.keyword$DataError = s.keywordError = void 0;
    const e = Y(), t = Z(), r = ke();
    s.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, s.keyword$DataError = {
      message: ({ keyword: h, schemaType: p }) => p ? (0, e.str)`"${h}" keyword must be ${p} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, p = s.keywordError, l, f) {
      const { it: m } = h, { gen: w, compositeRule: b, allErrors: P } = m, k = v(h, p, l);
      f ?? (b || P) ? c(w, k) : u(m, (0, e._)`[${k}]`);
    }
    s.reportError = n;
    function i(h, p = s.keywordError, l) {
      const { it: f } = h, { gen: m, compositeRule: w, allErrors: b } = f, P = v(h, p, l);
      c(m, P), w || b || u(f, r.default.vErrors);
    }
    s.reportExtraError = i;
    function o(h, p) {
      h.assign(r.default.errors, p), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(p, () => h.assign((0, e._)`${r.default.vErrors}.length`, p), () => h.assign(r.default.vErrors, null)));
    }
    s.resetErrorsCount = o;
    function a({ gen: h, keyword: p, schemaValue: l, data: f, errsCount: m, it: w }) {
      if (m === void 0)
        throw new Error("ajv implementation error");
      const b = h.name("err");
      h.forRange("i", m, r.default.errors, (P) => {
        h.const(b, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${b}.instancePath === undefined`, () => h.assign((0, e._)`${b}.instancePath`, (0, e.strConcat)(r.default.instancePath, w.errorPath))), h.assign((0, e._)`${b}.schemaPath`, (0, e.str)`${w.errSchemaPath}/${p}`), w.opts.verbose && (h.assign((0, e._)`${b}.schema`, l), h.assign((0, e._)`${b}.data`, f));
      });
    }
    s.extendErrors = a;
    function c(h, p) {
      const l = h.const("err", p);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${l}]`), (0, e._)`${r.default.vErrors}.push(${l})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function u(h, p) {
      const { gen: l, validateName: f, schemaEnv: m } = h;
      m.$async ? l.throw((0, e._)`new ${h.ValidationError}(${p})`) : (l.assign((0, e._)`${f}.errors`, p), l.return(!1));
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
    function v(h, p, l) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, p, l);
    }
    function _(h, p, l = {}) {
      const { gen: f, it: m } = h, w = [
        $(m, l),
        S(h, l)
      ];
      return g(h, p, w), f.object(...w);
    }
    function $({ errorPath: h }, { instancePath: p }) {
      const l = p ? (0, e.str)`${h}${(0, t.getErrorPath)(p, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, l)];
    }
    function S({ keyword: h, it: { errSchemaPath: p } }, { schemaPath: l, parentSchema: f }) {
      let m = f ? p : (0, e.str)`${p}/${h}`;
      return l && (m = (0, e.str)`${m}${(0, t.getErrorPath)(l, t.Type.Str)}`), [d.schemaPath, m];
    }
    function g(h, { params: p, message: l }, f) {
      const { keyword: m, data: w, schemaValue: b, it: P } = h, { opts: k, propertyName: C, topSchemaRef: x, schemaPath: z } = P;
      f.push([d.keyword, m], [d.params, typeof p == "function" ? p(h) : p || (0, e._)`{}`]), k.messages && f.push([d.message, typeof l == "function" ? l(h) : l]), k.verbose && f.push([d.schema, b], [d.parentSchema, (0, e._)`${x}${z}`], [r.default.data, w]), C && f.push([d.propertyName, C]);
    }
  })(Lt)), Lt;
}
var $r;
function li() {
  if ($r) return Ne;
  $r = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.boolOrEmptySchema = Ne.topBoolOrEmptySchema = void 0;
  const s = Ot(), e = Y(), t = ke(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: c, schema: u, validateName: d } = a;
    u === !1 ? o(a, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${d}.errors`, null), c.return(!0));
  }
  Ne.topBoolOrEmptySchema = n;
  function i(a, c) {
    const { gen: u, schema: d } = a;
    d === !1 ? (u.var(c, !1), o(a)) : u.var(c, !0);
  }
  Ne.boolOrEmptySchema = i;
  function o(a, c) {
    const { gen: u, data: d } = a, v = {
      gen: u,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, s.reportError)(v, r, void 0, c);
  }
  return Ne;
}
var fe = {}, Ae = {}, _r;
function Rn() {
  if (_r) return Ae;
  _r = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.getRules = Ae.isJSONType = void 0;
  const s = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(s);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  Ae.isJSONType = t;
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
  return Ae.getRules = r, Ae;
}
var Me = {}, Sr;
function Cn() {
  if (Sr) return Me;
  Sr = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.shouldUseRule = Me.shouldUseGroup = Me.schemaHasRulesForType = void 0;
  function s({ schema: r, self: n }, i) {
    const o = n.RULES.types[i];
    return o && o !== !0 && e(r, o);
  }
  Me.schemaHasRulesForType = s;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  Me.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((o) => r[o] !== void 0));
  }
  return Me.shouldUseRule = t, Me;
}
var Pr;
function jt() {
  if (Pr) return fe;
  Pr = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.reportTypeError = fe.checkDataTypes = fe.checkDataType = fe.coerceAndCheckDataType = fe.getJSONTypes = fe.getSchemaTypes = fe.DataType = void 0;
  const s = Rn(), e = Cn(), t = Ot(), r = Y(), n = Z();
  var i;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(i || (fe.DataType = i = {}));
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
  fe.getSchemaTypes = o;
  function a(l) {
    const f = Array.isArray(l) ? l : l ? [l] : [];
    if (f.every(s.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  fe.getJSONTypes = a;
  function c(l, f) {
    const { gen: m, data: w, opts: b } = l, P = d(f, b.coerceTypes), k = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(l, f[0]));
    if (k) {
      const C = S(f, w, b.strictNumbers, i.Wrong);
      m.if(C, () => {
        P.length ? v(l, f, P) : h(l);
      });
    }
    return k;
  }
  fe.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(l, f) {
    return f ? l.filter((m) => u.has(m) || f === "array" && m === "array") : [];
  }
  function v(l, f, m) {
    const { gen: w, data: b, opts: P } = l, k = w.let("dataType", (0, r._)`typeof ${b}`), C = w.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && w.if((0, r._)`${k} == 'object' && Array.isArray(${b}) && ${b}.length == 1`, () => w.assign(b, (0, r._)`${b}[0]`).assign(k, (0, r._)`typeof ${b}`).if(S(f, b, P.strictNumbers), () => w.assign(C, b))), w.if((0, r._)`${C} !== undefined`);
    for (const z of m)
      (u.has(z) || z === "array" && P.coerceTypes === "array") && x(z);
    w.else(), h(l), w.endIf(), w.if((0, r._)`${C} !== undefined`, () => {
      w.assign(b, C), _(l, C);
    });
    function x(z) {
      switch (z) {
        case "string":
          w.elseIf((0, r._)`${k} == "number" || ${k} == "boolean"`).assign(C, (0, r._)`"" + ${b}`).elseIf((0, r._)`${b} === null`).assign(C, (0, r._)`""`);
          return;
        case "number":
          w.elseIf((0, r._)`${k} == "boolean" || ${b} === null
              || (${k} == "string" && ${b} && ${b} == +${b})`).assign(C, (0, r._)`+${b}`);
          return;
        case "integer":
          w.elseIf((0, r._)`${k} === "boolean" || ${b} === null
              || (${k} === "string" && ${b} && ${b} == +${b} && !(${b} % 1))`).assign(C, (0, r._)`+${b}`);
          return;
        case "boolean":
          w.elseIf((0, r._)`${b} === "false" || ${b} === 0 || ${b} === null`).assign(C, !1).elseIf((0, r._)`${b} === "true" || ${b} === 1`).assign(C, !0);
          return;
        case "null":
          w.elseIf((0, r._)`${b} === "" || ${b} === 0 || ${b} === false`), w.assign(C, null);
          return;
        case "array":
          w.elseIf((0, r._)`${k} === "string" || ${k} === "number"
              || ${k} === "boolean" || ${b} === null`).assign(C, (0, r._)`[${b}]`);
      }
    }
  }
  function _({ gen: l, parentData: f, parentDataProperty: m }, w) {
    l.if((0, r._)`${f} !== undefined`, () => l.assign((0, r._)`${f}[${m}]`, w));
  }
  function $(l, f, m, w = i.Correct) {
    const b = w === i.Correct ? r.operators.EQ : r.operators.NEQ;
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
    return w === i.Correct ? P : (0, r.not)(P);
    function k(C = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, C, m ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  fe.checkDataType = $;
  function S(l, f, m, w) {
    if (l.length === 1)
      return $(l[0], f, m, w);
    let b;
    const P = (0, n.toHash)(l);
    if (P.array && P.object) {
      const k = (0, r._)`typeof ${f} != "object"`;
      b = P.null ? k : (0, r._)`!${f} || ${k}`, delete P.null, delete P.array, delete P.object;
    } else
      b = r.nil;
    P.number && delete P.integer;
    for (const k in P)
      b = (0, r.and)(b, $(k, f, m, w));
    return b;
  }
  fe.checkDataTypes = S;
  const g = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: f }) => typeof l == "string" ? (0, r._)`{type: ${l}}` : (0, r._)`{type: ${f}}`
  };
  function h(l) {
    const f = p(l);
    (0, t.reportError)(f, g);
  }
  fe.reportTypeError = h;
  function p(l) {
    const { gen: f, data: m, schema: w } = l, b = (0, n.schemaRefOrVal)(l, w, "type");
    return {
      gen: f,
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
  return fe;
}
var De = {}, Mr;
function ui() {
  if (Mr) return De;
  Mr = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.assignDefaults = void 0;
  const s = Y(), e = Z();
  function t(n, i) {
    const { properties: o, items: a } = n.schema;
    if (i === "object" && o)
      for (const c in o)
        r(n, c, o[c].default);
    else i === "array" && Array.isArray(a) && a.forEach((c, u) => r(n, u, c.default));
  }
  De.assignDefaults = t;
  function r(n, i, o) {
    const { gen: a, compositeRule: c, data: u, opts: d } = n;
    if (o === void 0)
      return;
    const v = (0, s._)`${u}${(0, s.getProperty)(i)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${v}`);
      return;
    }
    let _ = (0, s._)`${v} === undefined`;
    d.useDefaults === "empty" && (_ = (0, s._)`${_} || ${v} === null || ${v} === ""`), a.if(_, (0, s._)`${v} = ${(0, s.stringify)(o)}`);
  }
  return De;
}
var be = {}, ne = {}, Er;
function we() {
  if (Er) return ne;
  Er = 1, Object.defineProperty(ne, "__esModule", { value: !0 }), ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
  const s = Y(), e = Z(), t = ke(), r = Z();
  function n(l, f) {
    const { gen: m, data: w, it: b } = l;
    m.if(d(m, w, f, b.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, s._)`${f}` }, !0), l.error();
    });
  }
  ne.checkReportMissingProp = n;
  function i({ gen: l, data: f, it: { opts: m } }, w, b) {
    return (0, s.or)(...w.map((P) => (0, s.and)(d(l, f, P, m.ownProperties), (0, s._)`${b} = ${P}`)));
  }
  ne.checkMissingProp = i;
  function o(l, f) {
    l.setParams({ missingProperty: f }, !0), l.error();
  }
  ne.reportMissingProp = o;
  function a(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, s._)`Object.prototype.hasOwnProperty`
    });
  }
  ne.hasPropFunc = a;
  function c(l, f, m) {
    return (0, s._)`${a(l)}.call(${f}, ${m})`;
  }
  ne.isOwnProperty = c;
  function u(l, f, m, w) {
    const b = (0, s._)`${f}${(0, s.getProperty)(m)} !== undefined`;
    return w ? (0, s._)`${b} && ${c(l, f, m)}` : b;
  }
  ne.propertyInData = u;
  function d(l, f, m, w) {
    const b = (0, s._)`${f}${(0, s.getProperty)(m)} === undefined`;
    return w ? (0, s.or)(b, (0, s.not)(c(l, f, m))) : b;
  }
  ne.noPropertyInData = d;
  function v(l) {
    return l ? Object.keys(l).filter((f) => f !== "__proto__") : [];
  }
  ne.allSchemaProperties = v;
  function _(l, f) {
    return v(f).filter((m) => !(0, e.alwaysValidSchema)(l, f[m]));
  }
  ne.schemaProperties = _;
  function $({ schemaCode: l, data: f, it: { gen: m, topSchemaRef: w, schemaPath: b, errorPath: P }, it: k }, C, x, z) {
    const B = z ? (0, s._)`${l}, ${f}, ${w}${b}` : f, L = [
      [t.default.instancePath, (0, s.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, k.parentData],
      [t.default.parentDataProperty, k.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    k.opts.dynamicRef && L.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const H = (0, s._)`${B}, ${m.object(...L)}`;
    return x !== s.nil ? (0, s._)`${C}.call(${x}, ${H})` : (0, s._)`${C}(${H})`;
  }
  ne.callValidateCode = $;
  const S = (0, s._)`new RegExp`;
  function g({ gen: l, it: { opts: f } }, m) {
    const w = f.unicodeRegExp ? "u" : "", { regExp: b } = f.code, P = b(m, w);
    return l.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, s._)`${b.code === "new RegExp" ? S : (0, r.useFunc)(l, b)}(${m}, ${w})`
    });
  }
  ne.usePattern = g;
  function h(l) {
    const { gen: f, data: m, keyword: w, it: b } = l, P = f.name("valid");
    if (b.allErrors) {
      const C = f.let("valid", !0);
      return k(() => f.assign(C, !1)), C;
    }
    return f.var(P, !0), k(() => f.break()), P;
    function k(C) {
      const x = f.const("len", (0, s._)`${m}.length`);
      f.forRange("i", 0, x, (z) => {
        l.subschema({
          keyword: w,
          dataProp: z,
          dataPropType: e.Type.Num
        }, P), f.if((0, s.not)(P), C);
      });
    }
  }
  ne.validateArray = h;
  function p(l) {
    const { gen: f, schema: m, keyword: w, it: b } = l;
    if (!Array.isArray(m))
      throw new Error("ajv implementation error");
    if (m.some((x) => (0, e.alwaysValidSchema)(b, x)) && !b.opts.unevaluated)
      return;
    const k = f.let("valid", !1), C = f.name("_valid");
    f.block(() => m.forEach((x, z) => {
      const B = l.subschema({
        keyword: w,
        schemaProp: z,
        compositeRule: !0
      }, C);
      f.assign(k, (0, s._)`${k} || ${C}`), l.mergeValidEvaluated(B, C) || f.if((0, s.not)(k));
    })), l.result(k, () => l.reset(), () => l.error(!0));
  }
  return ne.validateUnion = p, ne;
}
var Tr;
function di() {
  if (Tr) return be;
  Tr = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.validateKeywordUsage = be.validSchemaType = be.funcKeywordCode = be.macroKeywordCode = void 0;
  const s = Y(), e = ke(), t = we(), r = Ot();
  function n(_, $) {
    const { gen: S, keyword: g, schema: h, parentSchema: p, it: l } = _, f = $.macro.call(l.self, h, p, l), m = u(S, g, f);
    l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
    const w = S.name("valid");
    _.subschema({
      schema: f,
      schemaPath: s.nil,
      errSchemaPath: `${l.errSchemaPath}/${g}`,
      topSchemaRef: m,
      compositeRule: !0
    }, w), _.pass(w, () => _.error(!0));
  }
  be.macroKeywordCode = n;
  function i(_, $) {
    var S;
    const { gen: g, keyword: h, schema: p, parentSchema: l, $data: f, it: m } = _;
    c(m, $);
    const w = !f && $.compile ? $.compile.call(m.self, p, l, m) : $.validate, b = u(g, h, w), P = g.let("valid");
    _.block$data(P, k), _.ok((S = $.valid) !== null && S !== void 0 ? S : P);
    function k() {
      if ($.errors === !1)
        z(), $.modifying && o(_), B(() => _.error());
      else {
        const L = $.async ? C() : x();
        $.modifying && o(_), B(() => a(_, L));
      }
    }
    function C() {
      const L = g.let("ruleErrs", null);
      return g.try(() => z((0, s._)`await `), (H) => g.assign(P, !1).if((0, s._)`${H} instanceof ${m.ValidationError}`, () => g.assign(L, (0, s._)`${H}.errors`), () => g.throw(H))), L;
    }
    function x() {
      const L = (0, s._)`${b}.errors`;
      return g.assign(L, null), z(s.nil), L;
    }
    function z(L = $.async ? (0, s._)`await ` : s.nil) {
      const H = m.opts.passContext ? e.default.this : e.default.self, ce = !("compile" in $ && !f || $.schema === !1);
      g.assign(P, (0, s._)`${L}${(0, t.callValidateCode)(_, b, H, ce)}`, $.modifying);
    }
    function B(L) {
      var H;
      g.if((0, s.not)((H = $.valid) !== null && H !== void 0 ? H : P), L);
    }
  }
  be.funcKeywordCode = i;
  function o(_) {
    const { gen: $, data: S, it: g } = _;
    $.if(g.parentData, () => $.assign(S, (0, s._)`${g.parentData}[${g.parentDataProperty}]`));
  }
  function a(_, $) {
    const { gen: S } = _;
    S.if((0, s._)`Array.isArray(${$})`, () => {
      S.assign(e.default.vErrors, (0, s._)`${e.default.vErrors} === null ? ${$} : ${e.default.vErrors}.concat(${$})`).assign(e.default.errors, (0, s._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function c({ schemaEnv: _ }, $) {
    if ($.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, $, S) {
    if (S === void 0)
      throw new Error(`keyword "${$}" failed to compile`);
    return _.scopeValue("keyword", typeof S == "function" ? { ref: S } : { ref: S, code: (0, s.stringify)(S) });
  }
  function d(_, $, S = !1) {
    return !$.length || $.some((g) => g === "array" ? Array.isArray(_) : g === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == g || S && typeof _ > "u");
  }
  be.validSchemaType = d;
  function v({ schema: _, opts: $, self: S, errSchemaPath: g }, h, p) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(p) : h.keyword !== p)
      throw new Error("ajv implementation error");
    const l = h.dependencies;
    if (l?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${p}: ${l.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[p])) {
      const m = `keyword "${p}" value is invalid at path "${g}": ` + S.errorsText(h.validateSchema.errors);
      if ($.validateSchema === "log")
        S.logger.error(m);
      else
        throw new Error(m);
    }
  }
  return be.validateKeywordUsage = v, be;
}
var Ee = {}, kr;
function hi() {
  if (kr) return Ee;
  kr = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.extendSubschemaMode = Ee.extendSubschemaData = Ee.getSubschema = void 0;
  const s = Y(), e = Z();
  function t(i, { keyword: o, schemaProp: a, schema: c, schemaPath: u, errSchemaPath: d, topSchemaRef: v }) {
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
      if (u === void 0 || d === void 0 || v === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: v,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ee.getSubschema = t;
  function r(i, o, { dataProp: a, dataPropType: c, data: u, dataTypes: d, propertyName: v }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = o;
    if (a !== void 0) {
      const { errorPath: S, dataPathArr: g, opts: h } = o, p = _.let("data", (0, s._)`${o.data}${(0, s.getProperty)(a)}`, !0);
      $(p), i.errorPath = (0, s.str)`${S}${(0, e.getErrorPath)(a, c, h.jsPropertySyntax)}`, i.parentDataProperty = (0, s._)`${a}`, i.dataPathArr = [...g, i.parentDataProperty];
    }
    if (u !== void 0) {
      const S = u instanceof s.Name ? u : _.let("data", u, !0);
      $(S), v !== void 0 && (i.propertyName = v);
    }
    d && (i.dataTypes = d);
    function $(S) {
      i.data = S, i.dataLevel = o.dataLevel + 1, i.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), i.parentData = o.data, i.dataNames = [...o.dataNames, S];
    }
  }
  Ee.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), u !== void 0 && (i.createErrors = u), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = o, i.jtdMetadata = a;
  }
  return Ee.extendSubschemaMode = n, Ee;
}
var pe = {}, Kt, Nr;
function In() {
  return Nr || (Nr = 1, Kt = function s(e, t) {
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
  }), Kt;
}
var Ht = { exports: {} }, Ar;
function fi() {
  if (Ar) return Ht.exports;
  Ar = 1;
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
  function e(r, n, i, o, a, c, u, d, v, _) {
    if (o && typeof o == "object" && !Array.isArray(o)) {
      n(o, a, c, u, d, v, _);
      for (var $ in o) {
        var S = o[$];
        if (Array.isArray(S)) {
          if ($ in s.arrayKeywords)
            for (var g = 0; g < S.length; g++)
              e(r, n, i, S[g], a + "/" + $ + "/" + g, c, a, $, o, g);
        } else if ($ in s.propsKeywords) {
          if (S && typeof S == "object")
            for (var h in S)
              e(r, n, i, S[h], a + "/" + $ + "/" + t(h), c, a, $, o, h);
        } else ($ in s.keywords || r.allKeys && !($ in s.skipKeywords)) && e(r, n, i, S, a + "/" + $, c, a, $, o);
      }
      i(o, a, c, u, d, v, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ht.exports;
}
var Rr;
function xt() {
  if (Rr) return pe;
  Rr = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.getSchemaRefs = pe.resolveUrl = pe.normalizeId = pe._getFullPath = pe.getFullPath = pe.inlineRef = void 0;
  const s = Z(), e = In(), t = fi(), r = /* @__PURE__ */ new Set([
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
  function n(g, h = !0) {
    return typeof g == "boolean" ? !0 : h === !0 ? !o(g) : h ? a(g) <= h : !1;
  }
  pe.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(g) {
    for (const h in g) {
      if (i.has(h))
        return !0;
      const p = g[h];
      if (Array.isArray(p) && p.some(o) || typeof p == "object" && o(p))
        return !0;
    }
    return !1;
  }
  function a(g) {
    let h = 0;
    for (const p in g) {
      if (p === "$ref")
        return 1 / 0;
      if (h++, !r.has(p) && (typeof g[p] == "object" && (0, s.eachItem)(g[p], (l) => h += a(l)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function c(g, h = "", p) {
    p !== !1 && (h = v(h));
    const l = g.parse(h);
    return u(g, l);
  }
  pe.getFullPath = c;
  function u(g, h) {
    return g.serialize(h).split("#")[0] + "#";
  }
  pe._getFullPath = u;
  const d = /#\/?$/;
  function v(g) {
    return g ? g.replace(d, "") : "";
  }
  pe.normalizeId = v;
  function _(g, h, p) {
    return p = v(p), g.resolve(h, p);
  }
  pe.resolveUrl = _;
  const $ = /^[a-z_][-a-z0-9._]*$/i;
  function S(g, h) {
    if (typeof g == "boolean")
      return {};
    const { schemaId: p, uriResolver: l } = this.opts, f = v(g[p] || h), m = { "": f }, w = c(l, f, !1), b = {}, P = /* @__PURE__ */ new Set();
    return t(g, { allKeys: !0 }, (x, z, B, L) => {
      if (L === void 0)
        return;
      const H = w + z;
      let ce = m[L];
      typeof x[p] == "string" && (ce = me.call(this, x[p])), ye.call(this, x.$anchor), ye.call(this, x.$dynamicAnchor), m[z] = ce;
      function me(ee) {
        const V = this.opts.uriResolver.resolve;
        if (ee = v(ce ? V(ce, ee) : ee), P.has(ee))
          throw C(ee);
        P.add(ee);
        let O = this.refs[ee];
        return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? k(x, O.schema, ee) : ee !== v(H) && (ee[0] === "#" ? (k(x, b[ee], ee), b[ee] = x) : this.refs[ee] = H), ee;
      }
      function ye(ee) {
        if (typeof ee == "string") {
          if (!$.test(ee))
            throw new Error(`invalid anchor "${ee}"`);
          me.call(this, `#${ee}`);
        }
      }
    }), b;
    function k(x, z, B) {
      if (z !== void 0 && !e(x, z))
        throw C(B);
    }
    function C(x) {
      return new Error(`reference "${x}" resolves to more than one schema`);
    }
  }
  return pe.getSchemaRefs = S, pe;
}
var Cr;
function Dt() {
  if (Cr) return Pe;
  Cr = 1, Object.defineProperty(Pe, "__esModule", { value: !0 }), Pe.getData = Pe.KeywordCxt = Pe.validateFunctionCode = void 0;
  const s = li(), e = jt(), t = Cn(), r = jt(), n = ui(), i = di(), o = hi(), a = Y(), c = ke(), u = xt(), d = Z(), v = Ot();
  function _(M) {
    if (w(M) && (P(M), m(M))) {
      h(M);
      return;
    }
    $(M, () => (0, s.topBoolOrEmptySchema)(M));
  }
  Pe.validateFunctionCode = _;
  function $({ gen: M, validateName: T, schema: I, schemaEnv: q, opts: D }, U) {
    D.code.es5 ? M.func(T, (0, a._)`${c.default.data}, ${c.default.valCxt}`, q.$async, () => {
      M.code((0, a._)`"use strict"; ${l(I, D)}`), g(M, D), M.code(U);
    }) : M.func(T, (0, a._)`${c.default.data}, ${S(D)}`, q.$async, () => M.code(l(I, D)).code(U));
  }
  function S(M) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${M.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function g(M, T) {
    M.if(c.default.valCxt, () => {
      M.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), M.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), M.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), M.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), T.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      M.var(c.default.instancePath, (0, a._)`""`), M.var(c.default.parentData, (0, a._)`undefined`), M.var(c.default.parentDataProperty, (0, a._)`undefined`), M.var(c.default.rootData, c.default.data), T.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(M) {
    const { schema: T, opts: I, gen: q } = M;
    $(M, () => {
      I.$comment && T.$comment && L(M), x(M), q.let(c.default.vErrors, null), q.let(c.default.errors, 0), I.unevaluated && p(M), k(M), H(M);
    });
  }
  function p(M) {
    const { gen: T, validateName: I } = M;
    M.evaluated = T.const("evaluated", (0, a._)`${I}.evaluated`), T.if((0, a._)`${M.evaluated}.dynamicProps`, () => T.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), T.if((0, a._)`${M.evaluated}.dynamicItems`, () => T.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function l(M, T) {
    const I = typeof M == "object" && M[T.schemaId];
    return I && (T.code.source || T.code.process) ? (0, a._)`/*# sourceURL=${I} */` : a.nil;
  }
  function f(M, T) {
    if (w(M) && (P(M), m(M))) {
      b(M, T);
      return;
    }
    (0, s.boolOrEmptySchema)(M, T);
  }
  function m({ schema: M, self: T }) {
    if (typeof M == "boolean")
      return !M;
    for (const I in M)
      if (T.RULES.all[I])
        return !0;
    return !1;
  }
  function w(M) {
    return typeof M.schema != "boolean";
  }
  function b(M, T) {
    const { schema: I, gen: q, opts: D } = M;
    D.$comment && I.$comment && L(M), z(M), B(M);
    const U = q.const("_errs", c.default.errors);
    k(M, U), q.var(T, (0, a._)`${U} === ${c.default.errors}`);
  }
  function P(M) {
    (0, d.checkUnknownRules)(M), C(M);
  }
  function k(M, T) {
    if (M.opts.jtd)
      return me(M, [], !1, T);
    const I = (0, e.getSchemaTypes)(M.schema), q = (0, e.coerceAndCheckDataType)(M, I);
    me(M, I, !q, T);
  }
  function C(M) {
    const { schema: T, errSchemaPath: I, opts: q, self: D } = M;
    T.$ref && q.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(T, D.RULES) && D.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function x(M) {
    const { schema: T, opts: I } = M;
    T.default !== void 0 && I.useDefaults && I.strictSchema && (0, d.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function z(M) {
    const T = M.schema[M.opts.schemaId];
    T && (M.baseId = (0, u.resolveUrl)(M.opts.uriResolver, M.baseId, T));
  }
  function B(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function L({ gen: M, schemaEnv: T, schema: I, errSchemaPath: q, opts: D }) {
    const U = I.$comment;
    if (D.$comment === !0)
      M.code((0, a._)`${c.default.self}.logger.log(${U})`);
    else if (typeof D.$comment == "function") {
      const X = (0, a.str)`${q}/$comment`, te = M.scopeValue("root", { ref: T.root });
      M.code((0, a._)`${c.default.self}.opts.$comment(${U}, ${X}, ${te}.schema)`);
    }
  }
  function H(M) {
    const { gen: T, schemaEnv: I, validateName: q, ValidationError: D, opts: U } = M;
    I.$async ? T.if((0, a._)`${c.default.errors} === 0`, () => T.return(c.default.data), () => T.throw((0, a._)`new ${D}(${c.default.vErrors})`)) : (T.assign((0, a._)`${q}.errors`, c.default.vErrors), U.unevaluated && ce(M), T.return((0, a._)`${c.default.errors} === 0`));
  }
  function ce({ gen: M, evaluated: T, props: I, items: q }) {
    I instanceof a.Name && M.assign((0, a._)`${T}.props`, I), q instanceof a.Name && M.assign((0, a._)`${T}.items`, q);
  }
  function me(M, T, I, q) {
    const { gen: D, schema: U, data: X, allErrors: te, opts: se, self: le } = M, { RULES: oe } = le;
    if (U.$ref && (se.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(U, oe))) {
      D.block(() => F(M, "$ref", oe.all.$ref.definition));
      return;
    }
    se.jtd || ee(M, T), D.block(() => {
      for (const ue of oe.rules)
        ae(ue);
      ae(oe.post);
    });
    function ae(ue) {
      (0, t.shouldUseGroup)(U, ue) && (ue.type ? (D.if((0, r.checkDataType)(ue.type, X, se.strictNumbers)), ye(M, ue), T.length === 1 && T[0] === ue.type && I && (D.else(), (0, r.reportTypeError)(M)), D.endIf()) : ye(M, ue), te || D.if((0, a._)`${c.default.errors} === ${q || 0}`));
    }
  }
  function ye(M, T) {
    const { gen: I, schema: q, opts: { useDefaults: D } } = M;
    D && (0, n.assignDefaults)(M, T.type), I.block(() => {
      for (const U of T.rules)
        (0, t.shouldUseRule)(q, U) && F(M, U.keyword, U.definition, T.type);
    });
  }
  function ee(M, T) {
    M.schemaEnv.meta || !M.opts.strictTypes || (V(M, T), M.opts.allowUnionTypes || O(M, T), N(M, M.dataTypes));
  }
  function V(M, T) {
    if (T.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = T;
        return;
      }
      T.forEach((I) => {
        A(M.dataTypes, I) || E(M, `type "${I}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), y(M, T);
    }
  }
  function O(M, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && E(M, "use allowUnionTypes to allow union type keyword");
  }
  function N(M, T) {
    const I = M.self.RULES.all;
    for (const q in I) {
      const D = I[q];
      if (typeof D == "object" && (0, t.shouldUseRule)(M.schema, D)) {
        const { type: U } = D.definition;
        U.length && !U.some((X) => j(T, X)) && E(M, `missing type "${U.join(",")}" for keyword "${q}"`);
      }
    }
  }
  function j(M, T) {
    return M.includes(T) || T === "number" && M.includes("integer");
  }
  function A(M, T) {
    return M.includes(T) || T === "integer" && M.includes("number");
  }
  function y(M, T) {
    const I = [];
    for (const q of M.dataTypes)
      A(T, q) ? I.push(q) : T.includes("integer") && q === "number" && I.push("integer");
    M.dataTypes = I;
  }
  function E(M, T) {
    const I = M.schemaEnv.baseId + M.errSchemaPath;
    T += ` at "${I}" (strictTypes)`, (0, d.checkStrictMode)(M, T, M.opts.strictTypes);
  }
  class R {
    constructor(T, I, q) {
      if ((0, i.validateKeywordUsage)(T, I, q), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = q, this.data = T.data, this.schema = T.schema[q], this.$data = I.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(T, this.schema, q, this.$data), this.schemaType = I.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = I, this.$data)
        this.schemaCode = T.gen.const("vSchema", W(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, I.schemaType, I.allowUndefined))
        throw new Error(`${q} value must be ${JSON.stringify(I.schemaType)}`);
      ("code" in I ? I.trackErrors : I.errors !== !1) && (this.errsCount = T.gen.const("_errs", c.default.errors));
    }
    result(T, I, q) {
      this.failResult((0, a.not)(T), I, q);
    }
    failResult(T, I, q) {
      this.gen.if(T), q ? q() : this.error(), I ? (this.gen.else(), I(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(T, I) {
      this.failResult((0, a.not)(T), void 0, I);
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
      const { schemaCode: I } = this;
      this.fail((0, a._)`${I} !== undefined && (${(0, a.or)(this.invalid$data(), T)})`);
    }
    error(T, I, q) {
      if (I) {
        this.setParams(I), this._error(T, q), this.setParams({});
        return;
      }
      this._error(T, q);
    }
    _error(T, I) {
      (T ? v.reportExtraError : v.reportError)(this, this.def.error, I);
    }
    $dataError() {
      (0, v.reportError)(this, this.def.$dataError || v.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, v.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(T) {
      this.allErrors || this.gen.if(T);
    }
    setParams(T, I) {
      I ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, I, q = a.nil) {
      this.gen.block(() => {
        this.check$data(T, q), I();
      });
    }
    check$data(T = a.nil, I = a.nil) {
      if (!this.$data)
        return;
      const { gen: q, schemaCode: D, schemaType: U, def: X } = this;
      q.if((0, a.or)((0, a._)`${D} === undefined`, I)), T !== a.nil && q.assign(T, !0), (U.length || X.validateSchema) && (q.elseIf(this.invalid$data()), this.$dataError(), T !== a.nil && q.assign(T, !1)), q.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: I, schemaType: q, def: D, it: U } = this;
      return (0, a.or)(X(), te());
      function X() {
        if (q.length) {
          if (!(I instanceof a.Name))
            throw new Error("ajv implementation error");
          const se = Array.isArray(q) ? q : [q];
          return (0, a._)`${(0, r.checkDataTypes)(se, I, U.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function te() {
        if (D.validateSchema) {
          const se = T.scopeValue("validate$data", { ref: D.validateSchema });
          return (0, a._)`!${se}(${I})`;
        }
        return a.nil;
      }
    }
    subschema(T, I) {
      const q = (0, o.getSubschema)(this.it, T);
      (0, o.extendSubschemaData)(q, this.it, T), (0, o.extendSubschemaMode)(q, T);
      const D = { ...this.it, ...q, items: void 0, props: void 0 };
      return f(D, I), D;
    }
    mergeEvaluated(T, I) {
      const { it: q, gen: D } = this;
      q.opts.unevaluated && (q.props !== !0 && T.props !== void 0 && (q.props = d.mergeEvaluated.props(D, T.props, q.props, I)), q.items !== !0 && T.items !== void 0 && (q.items = d.mergeEvaluated.items(D, T.items, q.items, I)));
    }
    mergeValidEvaluated(T, I) {
      const { it: q, gen: D } = this;
      if (q.opts.unevaluated && (q.props !== !0 || q.items !== !0))
        return D.if(I, () => this.mergeEvaluated(T, a.Name)), !0;
    }
  }
  Pe.KeywordCxt = R;
  function F(M, T, I, q) {
    const D = new R(M, I, T);
    "code" in I ? I.code(D, q) : D.$data && I.validate ? (0, i.funcKeywordCode)(D, I) : "macro" in I ? (0, i.macroKeywordCode)(D, I) : (I.compile || I.validate) && (0, i.funcKeywordCode)(D, I);
  }
  const G = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function W(M, { dataLevel: T, dataNames: I, dataPathArr: q }) {
    let D, U;
    if (M === "")
      return c.default.rootData;
    if (M[0] === "/") {
      if (!G.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      D = M, U = c.default.rootData;
    } else {
      const le = Q.exec(M);
      if (!le)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const oe = +le[1];
      if (D = le[2], D === "#") {
        if (oe >= T)
          throw new Error(se("property/index", oe));
        return q[T - oe];
      }
      if (oe > T)
        throw new Error(se("data", oe));
      if (U = I[T - oe], !D)
        return U;
    }
    let X = U;
    const te = D.split("/");
    for (const le of te)
      le && (U = (0, a._)`${U}${(0, a.getProperty)((0, d.unescapeJsonPointer)(le))}`, X = (0, a._)`${X} && ${U}`);
    return X;
    function se(le, oe) {
      return `Cannot access ${le} ${oe} levels up, current level is ${T}`;
    }
  }
  return Pe.getData = W, Pe;
}
var We = {}, Ir;
function rr() {
  if (Ir) return We;
  Ir = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  class s extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return We.default = s, We;
}
var Ye = {}, jr;
function zt() {
  if (jr) return Ye;
  jr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const s = xt();
  class e extends Error {
    constructor(r, n, i, o) {
      super(o || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, s.resolveUrl)(r, n, i), this.missingSchema = (0, s.normalizeId)((0, s.getFullPath)(r, this.missingRef));
    }
  }
  return Ye.default = e, Ye;
}
var ge = {}, qr;
function nr() {
  if (qr) return ge;
  qr = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.resolveSchema = ge.getCompilingSchema = ge.resolveRef = ge.compileSchema = ge.SchemaEnv = void 0;
  const s = Y(), e = rr(), t = ke(), r = xt(), n = Z(), i = Dt();
  class o {
    constructor(p) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof p.schema == "object" && (f = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (l = p.baseId) !== null && l !== void 0 ? l : (0, r.normalizeId)(f?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  ge.SchemaEnv = o;
  function a(h) {
    const p = d.call(this, h);
    if (p)
      return p;
    const l = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: m } = this.opts.code, { ownProperties: w } = this.opts, b = new s.CodeGen(this.scope, { es5: f, lines: m, ownProperties: w });
    let P;
    h.$async && (P = b.scopeValue("Error", {
      ref: e.default,
      code: (0, s._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const k = b.scopeName("validate");
    h.validateName = k;
    const C = {
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
      validateName: k,
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
    let x;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(C), b.optimize(this.opts.code.optimize);
      const z = b.toString();
      x = `${b.scopeRefs(t.default.scope)}return ${z}`, this.opts.code.process && (x = this.opts.code.process(x, h));
      const L = new Function(`${t.default.self}`, `${t.default.scope}`, x)(this, this.scope.get());
      if (this.scope.value(k, { ref: L }), L.errors = null, L.schema = h.schema, L.schemaEnv = h, h.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: k, validateCode: z, scopeValues: b._values }), this.opts.unevaluated) {
        const { props: H, items: ce } = C;
        L.evaluated = {
          props: H instanceof s.Name ? void 0 : H,
          items: ce instanceof s.Name ? void 0 : ce,
          dynamicProps: H instanceof s.Name,
          dynamicItems: ce instanceof s.Name
        }, L.source && (L.source.evaluated = (0, s.stringify)(L.evaluated));
      }
      return h.validate = L, h;
    } catch (z) {
      throw delete h.validate, delete h.validateName, x && this.logger.error("Error compiling schema, function code:", x), z;
    } finally {
      this._compilations.delete(h);
    }
  }
  ge.compileSchema = a;
  function c(h, p, l) {
    var f;
    l = (0, r.resolveUrl)(this.opts.uriResolver, p, l);
    const m = h.refs[l];
    if (m)
      return m;
    let w = _.call(this, h, l);
    if (w === void 0) {
      const b = (f = h.localRefs) === null || f === void 0 ? void 0 : f[l], { schemaId: P } = this.opts;
      b && (w = new o({ schema: b, schemaId: P, root: h, baseId: p }));
    }
    if (w !== void 0)
      return h.refs[l] = u.call(this, w);
  }
  ge.resolveRef = c;
  function u(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function d(h) {
    for (const p of this._compilations)
      if (v(p, h))
        return p;
  }
  ge.getCompilingSchema = d;
  function v(h, p) {
    return h.schema === p.schema && h.root === p.root && h.baseId === p.baseId;
  }
  function _(h, p) {
    let l;
    for (; typeof (l = this.refs[p]) == "string"; )
      p = l;
    return l || this.schemas[p] || $.call(this, h, p);
  }
  function $(h, p) {
    const l = this.opts.uriResolver.parse(p), f = (0, r._getFullPath)(this.opts.uriResolver, l);
    let m = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === m)
      return g.call(this, l, h);
    const w = (0, r.normalizeId)(f), b = this.refs[w] || this.schemas[w];
    if (typeof b == "string") {
      const P = $.call(this, h, b);
      return typeof P?.schema != "object" ? void 0 : g.call(this, l, P);
    }
    if (typeof b?.schema == "object") {
      if (b.validate || a.call(this, b), w === (0, r.normalizeId)(p)) {
        const { schema: P } = b, { schemaId: k } = this.opts, C = P[k];
        return C && (m = (0, r.resolveUrl)(this.opts.uriResolver, m, C)), new o({ schema: P, schemaId: k, root: h, baseId: m });
      }
      return g.call(this, l, b);
    }
  }
  ge.resolveSchema = $;
  const S = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function g(h, { baseId: p, schema: l, root: f }) {
    var m;
    if (((m = h.fragment) === null || m === void 0 ? void 0 : m[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const k = l[(0, n.unescapeFragment)(P)];
      if (k === void 0)
        return;
      l = k;
      const C = typeof l == "object" && l[this.opts.schemaId];
      !S.has(P) && C && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, C));
    }
    let w;
    if (typeof l != "boolean" && l.$ref && !(0, n.schemaHasRulesButRef)(l, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, p, l.$ref);
      w = $.call(this, f, P);
    }
    const { schemaId: b } = this.opts;
    if (w = w || new o({ schema: l, schemaId: b, root: f, baseId: p }), w.schema !== w.root.schema)
      return w;
  }
  return ge;
}
const pi = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", mi = "Meta-schema for $data reference (JSON AnySchema extension proposal)", yi = "object", gi = ["$data"], vi = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, bi = !1, wi = {
  $id: pi,
  description: mi,
  type: yi,
  required: gi,
  properties: vi,
  additionalProperties: bi
};
var Qe = {}, ze = { exports: {} }, Jt, Or;
function $i() {
  return Or || (Or = 1, Jt = {
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
  }), Jt;
}
var Wt, xr;
function _i() {
  if (xr) return Wt;
  xr = 1;
  const { HEX: s } = $i(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(g) {
    if (a(g, ".") < 3)
      return { host: g, isIPV4: !1 };
    const h = g.match(e) || [], [p] = h;
    return p ? { host: o(p, "."), isIPV4: !0 } : { host: g, isIPV4: !1 };
  }
  function r(g, h = !1) {
    let p = "", l = !0;
    for (const f of g) {
      if (s[f] === void 0) return;
      f !== "0" && l === !0 && (l = !1), l || (p += f);
    }
    return h && p.length === 0 && (p = "0"), p;
  }
  function n(g) {
    let h = 0;
    const p = { error: !1, address: "", zone: "" }, l = [], f = [];
    let m = !1, w = !1, b = !1;
    function P() {
      if (f.length) {
        if (m === !1) {
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
    for (let k = 0; k < g.length; k++) {
      const C = g[k];
      if (!(C === "[" || C === "]"))
        if (C === ":") {
          if (w === !0 && (b = !0), !P())
            break;
          if (h++, l.push(":"), h > 7) {
            p.error = !0;
            break;
          }
          k - 1 >= 0 && g[k - 1] === ":" && (w = !0);
          continue;
        } else if (C === "%") {
          if (!P())
            break;
          m = !0;
        } else {
          f.push(C);
          continue;
        }
    }
    return f.length && (m ? p.zone = f.join("") : b ? l.push(f.join("")) : l.push(r(f))), p.address = l.join(""), p;
  }
  function i(g) {
    if (a(g, ":") < 2)
      return { host: g, isIPV6: !1 };
    const h = n(g);
    if (h.error)
      return { host: g, isIPV6: !1 };
    {
      let p = h.address, l = h.address;
      return h.zone && (p += "%" + h.zone, l += "%25" + h.zone), { host: p, escapedHost: l, isIPV6: !0 };
    }
  }
  function o(g, h) {
    let p = "", l = !0;
    const f = g.length;
    for (let m = 0; m < f; m++) {
      const w = g[m];
      w === "0" && l ? (m + 1 <= f && g[m + 1] === h || m + 1 === f) && (p += w, l = !1) : (w === h ? l = !0 : l = !1, p += w);
    }
    return p;
  }
  function a(g, h) {
    let p = 0;
    for (let l = 0; l < g.length; l++)
      g[l] === h && p++;
    return p;
  }
  const c = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, v = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(g) {
    const h = [];
    for (; g.length; )
      if (g.match(c))
        g = g.replace(c, "");
      else if (g.match(u))
        g = g.replace(u, "/");
      else if (g.match(d))
        g = g.replace(d, "/"), h.pop();
      else if (g === "." || g === "..")
        g = "";
      else {
        const p = g.match(v);
        if (p) {
          const l = p[0];
          g = g.slice(l.length), h.push(l);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function $(g, h) {
    const p = h !== !0 ? escape : unescape;
    return g.scheme !== void 0 && (g.scheme = p(g.scheme)), g.userinfo !== void 0 && (g.userinfo = p(g.userinfo)), g.host !== void 0 && (g.host = p(g.host)), g.path !== void 0 && (g.path = p(g.path)), g.query !== void 0 && (g.query = p(g.query)), g.fragment !== void 0 && (g.fragment = p(g.fragment)), g;
  }
  function S(g) {
    const h = [];
    if (g.userinfo !== void 0 && (h.push(g.userinfo), h.push("@")), g.host !== void 0) {
      let p = unescape(g.host);
      const l = t(p);
      if (l.isIPV4)
        p = l.host;
      else {
        const f = i(l.host);
        f.isIPV6 === !0 ? p = `[${f.escapedHost}]` : p = g.host;
      }
      h.push(p);
    }
    return (typeof g.port == "number" || typeof g.port == "string") && (h.push(":"), h.push(String(g.port))), h.length ? h.join("") : void 0;
  }
  return Wt = {
    recomposeAuthority: S,
    normalizeComponentEncoding: $,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Wt;
}
var Yt, Dr;
function Si() {
  if (Dr) return Yt;
  Dr = 1;
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
      const [f, m] = l.resourceName.split("?");
      l.path = f && f !== "/" ? f : void 0, l.query = m, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function a(l, f) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const m = l.path.match(e);
    if (m) {
      const w = f.scheme || l.scheme || "urn";
      l.nid = m[1].toLowerCase(), l.nss = m[2];
      const b = `${w}:${f.nid || l.nid}`, P = p[b];
      l.path = void 0, P && (l = P.parse(l, f));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function c(l, f) {
    const m = f.scheme || l.scheme || "urn", w = l.nid.toLowerCase(), b = `${m}:${f.nid || w}`, P = p[b];
    P && (l = P.serialize(l, f));
    const k = l, C = l.nss;
    return k.path = `${w || f.nid}:${C}`, f.skipEscape = !0, k;
  }
  function u(l, f) {
    const m = l;
    return m.uuid = m.nss, m.nss = void 0, !f.tolerant && (!m.uuid || !s.test(m.uuid)) && (m.error = m.error || "UUID is not valid."), m;
  }
  function d(l) {
    const f = l;
    return f.nss = (l.uuid || "").toLowerCase(), f;
  }
  const v = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, _ = {
    scheme: "https",
    domainHost: v.domainHost,
    parse: r,
    serialize: n
  }, $ = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: o
  }, S = {
    scheme: "wss",
    domainHost: $.domainHost,
    parse: $.parse,
    serialize: $.serialize
  }, p = {
    http: v,
    https: _,
    ws: $,
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
  return Yt = p, Yt;
}
var zr;
function Pi() {
  if (zr) return ze.exports;
  zr = 1;
  const { normalizeIPv6: s, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = _i(), i = Si();
  function o(h, p) {
    return typeof h == "string" ? h = d(S(h, p), p) : typeof h == "object" && (h = S(d(h, p), p)), h;
  }
  function a(h, p, l) {
    const f = Object.assign({ scheme: "null" }, l), m = c(S(h, f), S(p, f), f, !0);
    return d(m, { ...f, skipEscape: !0 });
  }
  function c(h, p, l, f) {
    const m = {};
    return f || (h = S(d(h, l), l), p = S(d(p, l), l)), l = l || {}, !l.tolerant && p.scheme ? (m.scheme = p.scheme, m.userinfo = p.userinfo, m.host = p.host, m.port = p.port, m.path = t(p.path || ""), m.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (m.userinfo = p.userinfo, m.host = p.host, m.port = p.port, m.path = t(p.path || ""), m.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? m.path = t(p.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? m.path = "/" + p.path : h.path ? m.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + p.path : m.path = p.path, m.path = t(m.path)), m.query = p.query) : (m.path = h.path, p.query !== void 0 ? m.query = p.query : m.query = h.query), m.userinfo = h.userinfo, m.host = h.host, m.port = h.port), m.scheme = h.scheme), m.fragment = p.fragment, m;
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
    }, f = Object.assign({}, p), m = [], w = i[(f.scheme || l.scheme || "").toLowerCase()];
    w && w.serialize && w.serialize(l, f), l.path !== void 0 && (f.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), f.reference !== "suffix" && l.scheme && m.push(l.scheme, ":");
    const b = r(l);
    if (b !== void 0 && (f.reference !== "suffix" && m.push("//"), m.push(b), l.path && l.path.charAt(0) !== "/" && m.push("/")), l.path !== void 0) {
      let P = l.path;
      !f.absolutePath && (!w || !w.absolutePath) && (P = t(P)), b === void 0 && (P = P.replace(/^\/\//u, "/%2F")), m.push(P);
    }
    return l.query !== void 0 && m.push("?", l.query), l.fragment !== void 0 && m.push("#", l.fragment), m.join("");
  }
  const v = Array.from({ length: 127 }, (h, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function _(h) {
    let p = 0;
    for (let l = 0, f = h.length; l < f; ++l)
      if (p = h.charCodeAt(l), p > 126 || v[p])
        return !0;
    return !1;
  }
  const $ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function S(h, p) {
    const l = Object.assign({}, p), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, m = h.indexOf("%") !== -1;
    let w = !1;
    l.reference === "suffix" && (h = (l.scheme ? l.scheme + ":" : "") + "//" + h);
    const b = h.match($);
    if (b) {
      if (f.scheme = b[1], f.userinfo = b[3], f.host = b[4], f.port = parseInt(b[5], 10), f.path = b[6] || "", f.query = b[7], f.fragment = b[8], isNaN(f.port) && (f.port = b[5]), f.host) {
        const k = e(f.host);
        if (k.isIPV4 === !1) {
          const C = s(k.host);
          f.host = C.host.toLowerCase(), w = C.isIPV6;
        } else
          f.host = k.host, w = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== f.reference && (f.error = f.error || "URI is not a " + l.reference + " reference.");
      const P = i[(l.scheme || f.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (l.domainHost || P && P.domainHost) && w === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (k) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + k;
        }
      (!P || P && !P.skipNormalize) && (m && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), m && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, l);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const g = {
    SCHEMES: i,
    normalize: o,
    resolve: a,
    resolveComponents: c,
    equal: u,
    serialize: d,
    parse: S
  };
  return ze.exports = g, ze.exports.default = g, ze.exports.fastUri = g, ze.exports;
}
var Vr;
function Mi() {
  if (Vr) return Qe;
  Vr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const s = Pi();
  return s.code = 'require("ajv/dist/runtime/uri").default', Qe.default = s, Qe;
}
var Fr;
function Ei() {
  return Fr || (Fr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.CodeGen = s.Name = s.nil = s.stringify = s.str = s._ = s.KeywordCxt = void 0;
    var e = Dt();
    Object.defineProperty(s, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = Y();
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
    const r = rr(), n = zt(), i = Rn(), o = nr(), a = Y(), c = xt(), u = jt(), d = Z(), v = wi, _ = Mi(), $ = (O, N) => new RegExp(O, N);
    $.code = "new RegExp";
    const S = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
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
    function f(O) {
      var N, j, A, y, E, R, F, G, Q, W, M, T, I, q, D, U, X, te, se, le, oe, ae, ue, re, K;
      const ie = O.strict, he = (N = O.code) === null || N === void 0 ? void 0 : N.optimize, ve = he === !0 || he === void 0 ? 1 : he || 0, xe = (A = (j = O.code) === null || j === void 0 ? void 0 : j.regExp) !== null && A !== void 0 ? A : $, Ge = (y = O.uriResolver) !== null && y !== void 0 ? y : _.default;
      return {
        strictSchema: (R = (E = O.strictSchema) !== null && E !== void 0 ? E : ie) !== null && R !== void 0 ? R : !0,
        strictNumbers: (G = (F = O.strictNumbers) !== null && F !== void 0 ? F : ie) !== null && G !== void 0 ? G : !0,
        strictTypes: (W = (Q = O.strictTypes) !== null && Q !== void 0 ? Q : ie) !== null && W !== void 0 ? W : "log",
        strictTuples: (T = (M = O.strictTuples) !== null && M !== void 0 ? M : ie) !== null && T !== void 0 ? T : "log",
        strictRequired: (q = (I = O.strictRequired) !== null && I !== void 0 ? I : ie) !== null && q !== void 0 ? q : !1,
        code: O.code ? { ...O.code, optimize: ve, regExp: xe } : { optimize: ve, regExp: xe },
        loopRequired: (D = O.loopRequired) !== null && D !== void 0 ? D : l,
        loopEnum: (U = O.loopEnum) !== null && U !== void 0 ? U : l,
        meta: (X = O.meta) !== null && X !== void 0 ? X : !0,
        messages: (te = O.messages) !== null && te !== void 0 ? te : !0,
        inlineRefs: (se = O.inlineRefs) !== null && se !== void 0 ? se : !0,
        schemaId: (le = O.schemaId) !== null && le !== void 0 ? le : "$id",
        addUsedSchema: (oe = O.addUsedSchema) !== null && oe !== void 0 ? oe : !0,
        validateSchema: (ae = O.validateSchema) !== null && ae !== void 0 ? ae : !0,
        validateFormats: (ue = O.validateFormats) !== null && ue !== void 0 ? ue : !0,
        unicodeRegExp: (re = O.unicodeRegExp) !== null && re !== void 0 ? re : !0,
        int32range: (K = O.int32range) !== null && K !== void 0 ? K : !0,
        uriResolver: Ge
      };
    }
    class m {
      constructor(N = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), N = this.opts = { ...N, ...f(N) };
        const { es5: j, lines: A } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: g, es5: j, lines: A }), this.logger = B(N.logger);
        const y = N.validateFormats;
        N.validateFormats = !1, this.RULES = (0, i.getRules)(), w.call(this, h, N, "NOT SUPPORTED"), w.call(this, p, N, "DEPRECATED", "warn"), this._metaOpts = x.call(this), N.formats && k.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), N.keywords && C.call(this, N.keywords), typeof N.meta == "object" && this.addMetaSchema(N.meta), P.call(this), N.validateFormats = y;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: N, meta: j, schemaId: A } = this.opts;
        let y = v;
        A === "id" && (y = { ...v }, y.id = y.$id, delete y.$id), j && N && this.addMetaSchema(y, y[A], !1);
      }
      defaultMeta() {
        const { meta: N, schemaId: j } = this.opts;
        return this.opts.defaultMeta = typeof N == "object" ? N[j] || N : void 0;
      }
      validate(N, j) {
        let A;
        if (typeof N == "string") {
          if (A = this.getSchema(N), !A)
            throw new Error(`no schema with key or ref "${N}"`);
        } else
          A = this.compile(N);
        const y = A(j);
        return "$async" in A || (this.errors = A.errors), y;
      }
      compile(N, j) {
        const A = this._addSchema(N, j);
        return A.validate || this._compileSchemaEnv(A);
      }
      compileAsync(N, j) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: A } = this.opts;
        return y.call(this, N, j);
        async function y(W, M) {
          await E.call(this, W.$schema);
          const T = this._addSchema(W, M);
          return T.validate || R.call(this, T);
        }
        async function E(W) {
          W && !this.getSchema(W) && await y.call(this, { $ref: W }, !0);
        }
        async function R(W) {
          try {
            return this._compileSchemaEnv(W);
          } catch (M) {
            if (!(M instanceof n.default))
              throw M;
            return F.call(this, M), await G.call(this, M.missingSchema), R.call(this, W);
          }
        }
        function F({ missingSchema: W, missingRef: M }) {
          if (this.refs[W])
            throw new Error(`AnySchema ${W} is loaded but ${M} cannot be resolved`);
        }
        async function G(W) {
          const M = await Q.call(this, W);
          this.refs[W] || await E.call(this, M.$schema), this.refs[W] || this.addSchema(M, W, j);
        }
        async function Q(W) {
          const M = this._loading[W];
          if (M)
            return M;
          try {
            return await (this._loading[W] = A(W));
          } finally {
            delete this._loading[W];
          }
        }
      }
      // Adds schema to the instance
      addSchema(N, j, A, y = this.opts.validateSchema) {
        if (Array.isArray(N)) {
          for (const R of N)
            this.addSchema(R, void 0, A, y);
          return this;
        }
        let E;
        if (typeof N == "object") {
          const { schemaId: R } = this.opts;
          if (E = N[R], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${R} must be string`);
        }
        return j = (0, c.normalizeId)(j || E), this._checkUnique(j), this.schemas[j] = this._addSchema(N, A, j, y, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(N, j, A = this.opts.validateSchema) {
        return this.addSchema(N, j, !0, A), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(N, j) {
        if (typeof N == "boolean")
          return !0;
        let A;
        if (A = N.$schema, A !== void 0 && typeof A != "string")
          throw new Error("$schema must be a string");
        if (A = A || this.opts.defaultMeta || this.defaultMeta(), !A)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const y = this.validate(A, N);
        if (!y && j) {
          const E = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(E);
          else
            throw new Error(E);
        }
        return y;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(N) {
        let j;
        for (; typeof (j = b.call(this, N)) == "string"; )
          N = j;
        if (j === void 0) {
          const { schemaId: A } = this.opts, y = new o.SchemaEnv({ schema: {}, schemaId: A });
          if (j = o.resolveSchema.call(this, y, N), !j)
            return;
          this.refs[N] = j;
        }
        return j.validate || this._compileSchemaEnv(j);
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
            const j = b.call(this, N);
            return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[N], delete this.refs[N], this;
          }
          case "object": {
            const j = N;
            this._cache.delete(j);
            let A = N[this.opts.schemaId];
            return A && (A = (0, c.normalizeId)(A), delete this.schemas[A], delete this.refs[A]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(N) {
        for (const j of N)
          this.addKeyword(j);
        return this;
      }
      addKeyword(N, j) {
        let A;
        if (typeof N == "string")
          A = N, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = A);
        else if (typeof N == "object" && j === void 0) {
          if (j = N, A = j.keyword, Array.isArray(A) && !A.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (H.call(this, A, j), !j)
          return (0, d.eachItem)(A, (E) => ce.call(this, E)), this;
        ye.call(this, j);
        const y = {
          ...j,
          type: (0, u.getJSONTypes)(j.type),
          schemaType: (0, u.getJSONTypes)(j.schemaType)
        };
        return (0, d.eachItem)(A, y.type.length === 0 ? (E) => ce.call(this, E, y) : (E) => y.type.forEach((R) => ce.call(this, E, y, R))), this;
      }
      getKeyword(N) {
        const j = this.RULES.all[N];
        return typeof j == "object" ? j.definition : !!j;
      }
      // Remove keyword
      removeKeyword(N) {
        const { RULES: j } = this;
        delete j.keywords[N], delete j.all[N];
        for (const A of j.rules) {
          const y = A.rules.findIndex((E) => E.keyword === N);
          y >= 0 && A.rules.splice(y, 1);
        }
        return this;
      }
      // Add format
      addFormat(N, j) {
        return typeof j == "string" && (j = new RegExp(j)), this.formats[N] = j, this;
      }
      errorsText(N = this.errors, { separator: j = ", ", dataVar: A = "data" } = {}) {
        return !N || N.length === 0 ? "No errors" : N.map((y) => `${A}${y.instancePath} ${y.message}`).reduce((y, E) => y + j + E);
      }
      $dataMetaSchema(N, j) {
        const A = this.RULES.all;
        N = JSON.parse(JSON.stringify(N));
        for (const y of j) {
          const E = y.split("/").slice(1);
          let R = N;
          for (const F of E)
            R = R[F];
          for (const F in A) {
            const G = A[F];
            if (typeof G != "object")
              continue;
            const { $data: Q } = G.definition, W = R[F];
            Q && W && (R[F] = V(W));
          }
        }
        return N;
      }
      _removeAllSchemas(N, j) {
        for (const A in N) {
          const y = N[A];
          (!j || j.test(A)) && (typeof y == "string" ? delete N[A] : y && !y.meta && (this._cache.delete(y.schema), delete N[A]));
        }
      }
      _addSchema(N, j, A, y = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let R;
        const { schemaId: F } = this.opts;
        if (typeof N == "object")
          R = N[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof N != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let G = this._cache.get(N);
        if (G !== void 0)
          return G;
        A = (0, c.normalizeId)(R || A);
        const Q = c.getSchemaRefs.call(this, N, A);
        return G = new o.SchemaEnv({ schema: N, schemaId: F, meta: j, baseId: A, localRefs: Q }), this._cache.set(G.schema, G), E && !A.startsWith("#") && (A && this._checkUnique(A), this.refs[A] = G), y && this.validateSchema(N, !0), G;
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
        const j = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, N);
        } finally {
          this.opts = j;
        }
      }
    }
    m.ValidationError = r.default, m.MissingRefError = n.default, s.default = m;
    function w(O, N, j, A = "error") {
      for (const y in O) {
        const E = y;
        E in N && this.logger[A](`${j}: option ${y}. ${O[E]}`);
      }
    }
    function b(O) {
      return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
    }
    function P() {
      const O = this.opts.schemas;
      if (O)
        if (Array.isArray(O))
          this.addSchema(O);
        else
          for (const N in O)
            this.addSchema(O[N], N);
    }
    function k() {
      for (const O in this.opts.formats) {
        const N = this.opts.formats[O];
        N && this.addFormat(O, N);
      }
    }
    function C(O) {
      if (Array.isArray(O)) {
        this.addVocabulary(O);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const N in O) {
        const j = O[N];
        j.keyword || (j.keyword = N), this.addKeyword(j);
      }
    }
    function x() {
      const O = { ...this.opts };
      for (const N of S)
        delete O[N];
      return O;
    }
    const z = { log() {
    }, warn() {
    }, error() {
    } };
    function B(O) {
      if (O === !1)
        return z;
      if (O === void 0)
        return console;
      if (O.log && O.warn && O.error)
        return O;
      throw new Error("logger must implement log, warn and error methods");
    }
    const L = /^[a-z_$][a-z0-9_$:-]*$/i;
    function H(O, N) {
      const { RULES: j } = this;
      if ((0, d.eachItem)(O, (A) => {
        if (j.keywords[A])
          throw new Error(`Keyword ${A} is already defined`);
        if (!L.test(A))
          throw new Error(`Keyword ${A} has invalid name`);
      }), !!N && N.$data && !("code" in N || "validate" in N))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ce(O, N, j) {
      var A;
      const y = N?.post;
      if (j && y)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let R = y ? E.post : E.rules.find(({ type: G }) => G === j);
      if (R || (R = { type: j, rules: [] }, E.rules.push(R)), E.keywords[O] = !0, !N)
        return;
      const F = {
        keyword: O,
        definition: {
          ...N,
          type: (0, u.getJSONTypes)(N.type),
          schemaType: (0, u.getJSONTypes)(N.schemaType)
        }
      };
      N.before ? me.call(this, R, F, N.before) : R.rules.push(F), E.all[O] = F, (A = N.implements) === null || A === void 0 || A.forEach((G) => this.addKeyword(G));
    }
    function me(O, N, j) {
      const A = O.rules.findIndex((y) => y.keyword === j);
      A >= 0 ? O.rules.splice(A, 0, N) : (O.rules.push(N), this.logger.warn(`rule ${j} is not defined`));
    }
    function ye(O) {
      let { metaSchema: N } = O;
      N !== void 0 && (O.$data && this.opts.$data && (N = V(N)), O.validateSchema = this.compile(N, !0));
    }
    const ee = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function V(O) {
      return { anyOf: [O, ee] };
    }
  })(Ft)), Ft;
}
var Xe = {}, Ze = {}, et = {}, Lr;
function Ti() {
  if (Lr) return et;
  Lr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const s = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return et.default = s, et;
}
var Te = {}, Ur;
function ki() {
  if (Ur) return Te;
  Ur = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.callRef = Te.getValidate = void 0;
  const s = zt(), e = we(), t = Y(), r = ke(), n = nr(), i = Z(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: d, schema: v, it: _ } = u, { baseId: $, schemaEnv: S, validateName: g, opts: h, self: p } = _, { root: l } = S;
      if ((v === "#" || v === "#/") && $ === l.baseId)
        return m();
      const f = n.resolveRef.call(p, l, $, v);
      if (f === void 0)
        throw new s.default(_.opts.uriResolver, $, v);
      if (f instanceof n.SchemaEnv)
        return w(f);
      return b(f);
      function m() {
        if (S === l)
          return c(u, g, S, S.$async);
        const P = d.scopeValue("root", { ref: l });
        return c(u, (0, t._)`${P}.validate`, l, l.$async);
      }
      function w(P) {
        const k = a(u, P);
        c(u, k, P, P.$async);
      }
      function b(P) {
        const k = d.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), C = d.name("valid"), x = u.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: k,
          errSchemaPath: v
        }, C);
        u.mergeEvaluated(x), u.ok(C);
      }
    }
  };
  function a(u, d) {
    const { gen: v } = u;
    return d.validate ? v.scopeValue("validate", { ref: d.validate }) : (0, t._)`${v.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Te.getValidate = a;
  function c(u, d, v, _) {
    const { gen: $, it: S } = u, { allErrors: g, schemaEnv: h, opts: p } = S, l = p.passContext ? r.default.this : t.nil;
    _ ? f() : m();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = $.let("valid");
      $.try(() => {
        $.code((0, t._)`await ${(0, e.callValidateCode)(u, d, l)}`), b(d), g || $.assign(P, !0);
      }, (k) => {
        $.if((0, t._)`!(${k} instanceof ${S.ValidationError})`, () => $.throw(k)), w(k), g || $.assign(P, !1);
      }), u.ok(P);
    }
    function m() {
      u.result((0, e.callValidateCode)(u, d, l), () => b(d), () => w(d));
    }
    function w(P) {
      const k = (0, t._)`${P}.errors`;
      $.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${k} : ${r.default.vErrors}.concat(${k})`), $.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function b(P) {
      var k;
      if (!S.opts.unevaluated)
        return;
      const C = (k = v?.validate) === null || k === void 0 ? void 0 : k.evaluated;
      if (S.props !== !0)
        if (C && !C.dynamicProps)
          C.props !== void 0 && (S.props = i.mergeEvaluated.props($, C.props, S.props));
        else {
          const x = $.var("props", (0, t._)`${P}.evaluated.props`);
          S.props = i.mergeEvaluated.props($, x, S.props, t.Name);
        }
      if (S.items !== !0)
        if (C && !C.dynamicItems)
          C.items !== void 0 && (S.items = i.mergeEvaluated.items($, C.items, S.items));
        else {
          const x = $.var("items", (0, t._)`${P}.evaluated.items`);
          S.items = i.mergeEvaluated.items($, x, S.items, t.Name);
        }
    }
  }
  return Te.callRef = c, Te.default = o, Te;
}
var Gr;
function Ni() {
  if (Gr) return Ze;
  Gr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const s = Ti(), e = ki(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    s.default,
    e.default
  ];
  return Ze.default = t, Ze;
}
var tt = {}, rt = {}, Br;
function Ai() {
  if (Br) return rt;
  Br = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const s = Y(), e = s.operators, t = {
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
  return rt.default = n, rt;
}
var nt = {}, Kr;
function Ri() {
  if (Kr) return nt;
  Kr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const s = Y(), t = {
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
  return nt.default = t, nt;
}
var it = {}, st = {}, Hr;
function Ci() {
  if (Hr) return st;
  Hr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  function s(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return st.default = s, s.code = 'require("ajv/dist/runtime/ucs2length").default', st;
}
var Jr;
function Ii() {
  if (Jr) return it;
  Jr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const s = Y(), e = Z(), t = Ci(), n = {
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
      const { keyword: o, data: a, schemaCode: c, it: u } = i, d = o === "maxLength" ? s.operators.GT : s.operators.LT, v = u.opts.unicode === !1 ? (0, s._)`${a}.length` : (0, s._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, s._)`${v} ${d} ${c}`);
    }
  };
  return it.default = n, it;
}
var ot = {}, Wr;
function ji() {
  if (Wr) return ot;
  Wr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const s = we(), e = Y(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: o, schema: a, schemaCode: c, it: u } = n, d = u.opts.unicodeRegExp ? "u" : "", v = o ? (0, e._)`(new RegExp(${c}, ${d}))` : (0, s.usePattern)(n, a);
      n.fail$data((0, e._)`!${v}.test(${i})`);
    }
  };
  return ot.default = r, ot;
}
var at = {}, Yr;
function qi() {
  if (Yr) return at;
  Yr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const s = Y(), t = {
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
  return at.default = t, at;
}
var ct = {}, Qr;
function Oi() {
  if (Qr) return ct;
  Qr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const s = we(), e = Y(), t = Z(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: o, schema: a, schemaCode: c, data: u, $data: d, it: v } = i, { opts: _ } = v;
      if (!d && a.length === 0)
        return;
      const $ = a.length >= _.loopRequired;
      if (v.allErrors ? S() : g(), _.strictRequired) {
        const l = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const m of a)
          if (l?.[m] === void 0 && !f.has(m)) {
            const w = v.schemaEnv.baseId + v.errSchemaPath, b = `required property "${m}" is not defined at "${w}" (strictRequired)`;
            (0, t.checkStrictMode)(v, b, v.opts.strictRequired);
          }
      }
      function S() {
        if ($ || d)
          i.block$data(e.nil, h);
        else
          for (const l of a)
            (0, s.checkReportMissingProp)(i, l);
      }
      function g() {
        const l = o.let("missing");
        if ($ || d) {
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
  return ct.default = n, ct;
}
var lt = {}, Xr;
function xi() {
  if (Xr) return lt;
  Xr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const s = Y(), t = {
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
  return lt.default = t, lt;
}
var ut = {}, dt = {}, Zr;
function ir() {
  if (Zr) return dt;
  Zr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const s = In();
  return s.code = 'require("ajv/dist/runtime/equal").default', dt.default = s, dt;
}
var en;
function Di() {
  if (en) return ut;
  en = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const s = jt(), e = Y(), t = Z(), r = ir(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: o, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${o} are identical)`,
      params: ({ params: { i: o, j: a } }) => (0, e._)`{i: ${o}, j: ${a}}`
    },
    code(o) {
      const { gen: a, data: c, $data: u, schema: d, parentSchema: v, schemaCode: _, it: $ } = o;
      if (!u && !d)
        return;
      const S = a.let("valid"), g = v.items ? (0, s.getSchemaTypes)(v.items) : [];
      o.block$data(S, h, (0, e._)`${_} === false`), o.ok(S);
      function h() {
        const m = a.let("i", (0, e._)`${c}.length`), w = a.let("j");
        o.setParams({ i: m, j: w }), a.assign(S, !0), a.if((0, e._)`${m} > 1`, () => (p() ? l : f)(m, w));
      }
      function p() {
        return g.length > 0 && !g.some((m) => m === "object" || m === "array");
      }
      function l(m, w) {
        const b = a.name("item"), P = (0, s.checkDataTypes)(g, b, $.opts.strictNumbers, s.DataType.Wrong), k = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${m}--;`, () => {
          a.let(b, (0, e._)`${c}[${m}]`), a.if(P, (0, e._)`continue`), g.length > 1 && a.if((0, e._)`typeof ${b} == "string"`, (0, e._)`${b} += "_"`), a.if((0, e._)`typeof ${k}[${b}] == "number"`, () => {
            a.assign(w, (0, e._)`${k}[${b}]`), o.error(), a.assign(S, !1).break();
          }).code((0, e._)`${k}[${b}] = ${m}`);
        });
      }
      function f(m, w) {
        const b = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${m}--;`, () => a.for((0, e._)`${w} = ${m}; ${w}--;`, () => a.if((0, e._)`${b}(${c}[${m}], ${c}[${w}])`, () => {
          o.error(), a.assign(S, !1).break(P);
        })));
      }
    }
  };
  return ut.default = i, ut;
}
var ht = {}, tn;
function zi() {
  if (tn) return ht;
  tn = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const s = Y(), e = Z(), t = ir(), n = {
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
  return ht.default = n, ht;
}
var ft = {}, rn;
function Vi() {
  if (rn) return ft;
  rn = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const s = Y(), e = Z(), t = ir(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, s._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: c, schema: u, schemaCode: d, it: v } = i;
      if (!c && u.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = u.length >= v.opts.loopEnum;
      let $;
      const S = () => $ ?? ($ = (0, e.useFunc)(o, t.default));
      let g;
      if (_ || c)
        g = o.let("valid"), i.block$data(g, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const l = o.const("vSchema", d);
        g = (0, s.or)(...u.map((f, m) => p(l, m)));
      }
      i.pass(g);
      function h() {
        o.assign(g, !1), o.forOf("v", d, (l) => o.if((0, s._)`${S()}(${a}, ${l})`, () => o.assign(g, !0).break()));
      }
      function p(l, f) {
        const m = u[f];
        return typeof m == "object" && m !== null ? (0, s._)`${S()}(${a}, ${l}[${f}])` : (0, s._)`${a} === ${m}`;
      }
    }
  };
  return ft.default = n, ft;
}
var nn;
function Fi() {
  if (nn) return tt;
  nn = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const s = Ai(), e = Ri(), t = Ii(), r = ji(), n = qi(), i = Oi(), o = xi(), a = Di(), c = zi(), u = Vi(), d = [
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
  return tt.default = d, tt;
}
var pt = {}, Ce = {}, sn;
function jn() {
  if (sn) return Ce;
  sn = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.validateAdditionalItems = void 0;
  const s = Y(), e = Z(), r = {
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
    const { gen: a, schema: c, data: u, keyword: d, it: v } = i;
    v.items = !0;
    const _ = a.const("len", (0, s._)`${u}.length`);
    if (c === !1)
      i.setParams({ len: o.length }), i.pass((0, s._)`${_} <= ${o.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(v, c)) {
      const S = a.var("valid", (0, s._)`${_} <= ${o.length}`);
      a.if((0, s.not)(S), () => $(S)), i.ok(S);
    }
    function $(S) {
      a.forRange("i", o.length, _, (g) => {
        i.subschema({ keyword: d, dataProp: g, dataPropType: e.Type.Num }, S), v.allErrors || a.if((0, s.not)(S), () => a.break());
      });
    }
  }
  return Ce.validateAdditionalItems = n, Ce.default = r, Ce;
}
var mt = {}, Ie = {}, on;
function qn() {
  if (on) return Ie;
  on = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.validateTuple = void 0;
  const s = Y(), e = Z(), t = we(), r = {
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
    const { gen: c, parentSchema: u, data: d, keyword: v, it: _ } = i;
    g(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(c, a.length, _.items));
    const $ = c.name("valid"), S = c.const("len", (0, s._)`${d}.length`);
    a.forEach((h, p) => {
      (0, e.alwaysValidSchema)(_, h) || (c.if((0, s._)`${S} > ${p}`, () => i.subschema({
        keyword: v,
        schemaProp: p,
        dataProp: p
      }, $)), i.ok($));
    });
    function g(h) {
      const { opts: p, errSchemaPath: l } = _, f = a.length, m = f === h.minItems && (f === h.maxItems || h[o] === !1);
      if (p.strictTuples && !m) {
        const w = `"${v}" is ${f}-tuple, but minItems or maxItems/${o} are not specified or different at path "${l}"`;
        (0, e.checkStrictMode)(_, w, p.strictTuples);
      }
    }
  }
  return Ie.validateTuple = n, Ie.default = r, Ie;
}
var an;
function Li() {
  if (an) return mt;
  an = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = qn(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, s.validateTuple)(t, "items")
  };
  return mt.default = e, mt;
}
var yt = {}, cn;
function Ui() {
  if (cn) return yt;
  cn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const s = Y(), e = Z(), t = we(), r = jn(), i = {
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
  return yt.default = i, yt;
}
var gt = {}, ln;
function Gi() {
  if (ln) return gt;
  ln = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const s = Y(), e = Z(), r = {
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
      let d, v;
      const { minContains: _, maxContains: $ } = a;
      u.opts.next ? (d = _ === void 0 ? 1 : _, v = $) : d = 1;
      const S = i.const("len", (0, s._)`${c}.length`);
      if (n.setParams({ min: d, max: v }), v === void 0 && d === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (v !== void 0 && d > v) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, o)) {
        let f = (0, s._)`${S} >= ${d}`;
        v !== void 0 && (f = (0, s._)`${f} && ${S} <= ${v}`), n.pass(f);
        return;
      }
      u.items = !0;
      const g = i.name("valid");
      v === void 0 && d === 1 ? p(g, () => i.if(g, () => i.break())) : d === 0 ? (i.let(g, !0), v !== void 0 && i.if((0, s._)`${c}.length > 0`, h)) : (i.let(g, !1), h()), n.result(g, () => n.reset());
      function h() {
        const f = i.name("_valid"), m = i.let("count", 0);
        p(f, () => i.if(f, () => l(m)));
      }
      function p(f, m) {
        i.forRange("i", 0, S, (w) => {
          n.subschema({
            keyword: "contains",
            dataProp: w,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), m();
        });
      }
      function l(f) {
        i.code((0, s._)`${f}++`), v === void 0 ? i.if((0, s._)`${f} >= ${d}`, () => i.assign(g, !0).break()) : (i.if((0, s._)`${f} > ${v}`, () => i.assign(g, !1).break()), d === 1 ? i.assign(g, !0) : i.if((0, s._)`${f} >= ${d}`, () => i.assign(g, !0)));
      }
    }
  };
  return gt.default = r, gt;
}
var Qt = {}, un;
function Bi() {
  return un || (un = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.validateSchemaDeps = s.validatePropertyDeps = s.error = void 0;
    const e = Y(), t = Z(), r = we();
    s.error = {
      message: ({ params: { property: c, depsCount: u, deps: d } }) => {
        const v = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${v} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: u, deps: d, missingProperty: v } }) => (0, e._)`{property: ${c},
    missingProperty: ${v},
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
      for (const v in c) {
        if (v === "__proto__")
          continue;
        const _ = Array.isArray(c[v]) ? u : d;
        _[v] = c[v];
      }
      return [u, d];
    }
    function o(c, u = c.schema) {
      const { gen: d, data: v, it: _ } = c;
      if (Object.keys(u).length === 0)
        return;
      const $ = d.let("missing");
      for (const S in u) {
        const g = u[S];
        if (g.length === 0)
          continue;
        const h = (0, r.propertyInData)(d, v, S, _.opts.ownProperties);
        c.setParams({
          property: S,
          depsCount: g.length,
          deps: g.join(", ")
        }), _.allErrors ? d.if(h, () => {
          for (const p of g)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${h} && (${(0, r.checkMissingProp)(c, g, $)})`), (0, r.reportMissingProp)(c, $), d.else());
      }
    }
    s.validatePropertyDeps = o;
    function a(c, u = c.schema) {
      const { gen: d, data: v, keyword: _, it: $ } = c, S = d.name("valid");
      for (const g in u)
        (0, t.alwaysValidSchema)($, u[g]) || (d.if(
          (0, r.propertyInData)(d, v, g, $.opts.ownProperties),
          () => {
            const h = c.subschema({ keyword: _, schemaProp: g }, S);
            c.mergeValidEvaluated(h, S);
          },
          () => d.var(S, !0)
          // TODO var
        ), c.ok(S));
    }
    s.validateSchemaDeps = a, s.default = n;
  })(Qt)), Qt;
}
var vt = {}, dn;
function Ki() {
  if (dn) return vt;
  dn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const s = Y(), e = Z(), r = {
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
  return vt.default = r, vt;
}
var bt = {}, hn;
function On() {
  if (hn) return bt;
  hn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const s = we(), e = Y(), t = ke(), r = Z(), i = {
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
      const { gen: a, schema: c, parentSchema: u, data: d, errsCount: v, it: _ } = o;
      if (!v)
        throw new Error("ajv implementation error");
      const { allErrors: $, opts: S } = _;
      if (_.props = !0, S.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, c))
        return;
      const g = (0, s.allSchemaProperties)(u.properties), h = (0, s.allSchemaProperties)(u.patternProperties);
      p(), o.ok((0, e._)`${v} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (b) => {
          !g.length && !h.length ? m(b) : a.if(l(b), () => m(b));
        });
      }
      function l(b) {
        let P;
        if (g.length > 8) {
          const k = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          P = (0, s.isOwnProperty)(a, k, b);
        } else g.length ? P = (0, e.or)(...g.map((k) => (0, e._)`${b} === ${k}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((k) => (0, e._)`${(0, s.usePattern)(o, k)}.test(${b})`))), (0, e.not)(P);
      }
      function f(b) {
        a.code((0, e._)`delete ${d}[${b}]`);
      }
      function m(b) {
        if (S.removeAdditional === "all" || S.removeAdditional && c === !1) {
          f(b);
          return;
        }
        if (c === !1) {
          o.setParams({ additionalProperty: b }), o.error(), $ || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(_, c)) {
          const P = a.name("valid");
          S.removeAdditional === "failing" ? (w(b, P, !1), a.if((0, e.not)(P), () => {
            o.reset(), f(b);
          })) : (w(b, P), $ || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function w(b, P, k) {
        const C = {
          keyword: "additionalProperties",
          dataProp: b,
          dataPropType: r.Type.Str
        };
        k === !1 && Object.assign(C, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(C, P);
      }
    }
  };
  return bt.default = i, bt;
}
var wt = {}, fn;
function Hi() {
  if (fn) return wt;
  fn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const s = Dt(), e = we(), t = Z(), r = On(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, parentSchema: c, data: u, it: d } = i;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new s.KeywordCxt(d, r.default, "additionalProperties"));
      const v = (0, e.allSchemaProperties)(a);
      for (const h of v)
        d.definedProperties.add(h);
      d.opts.unevaluated && v.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(o, (0, t.toHash)(v), d.props));
      const _ = v.filter((h) => !(0, t.alwaysValidSchema)(d, a[h]));
      if (_.length === 0)
        return;
      const $ = o.name("valid");
      for (const h of _)
        S(h) ? g(h) : (o.if((0, e.propertyInData)(o, u, h, d.opts.ownProperties)), g(h), d.allErrors || o.else().var($, !0), o.endIf()), i.it.definedProperties.add(h), i.ok($);
      function S(h) {
        return d.opts.useDefaults && !d.compositeRule && a[h].default !== void 0;
      }
      function g(h) {
        i.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, $);
      }
    }
  };
  return wt.default = n, wt;
}
var $t = {}, pn;
function Ji() {
  if (pn) return $t;
  pn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const s = we(), e = Y(), t = Z(), r = Z(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, data: c, parentSchema: u, it: d } = i, { opts: v } = d, _ = (0, s.allSchemaProperties)(a), $ = _.filter((m) => (0, t.alwaysValidSchema)(d, a[m]));
      if (_.length === 0 || $.length === _.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const S = v.strictSchema && !v.allowMatchingProperties && u.properties, g = o.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(o, d.props));
      const { props: h } = d;
      p();
      function p() {
        for (const m of _)
          S && l(m), d.allErrors ? f(m) : (o.var(g, !0), f(m), o.if(g));
      }
      function l(m) {
        for (const w in S)
          new RegExp(m).test(w) && (0, t.checkStrictMode)(d, `property ${w} matches pattern ${m} (use allowMatchingProperties)`);
      }
      function f(m) {
        o.forIn("key", c, (w) => {
          o.if((0, e._)`${(0, s.usePattern)(i, m)}.test(${w})`, () => {
            const b = $.includes(m);
            b || i.subschema({
              keyword: "patternProperties",
              schemaProp: m,
              dataProp: w,
              dataPropType: r.Type.Str
            }, g), d.opts.unevaluated && h !== !0 ? o.assign((0, e._)`${h}[${w}]`, !0) : !b && !d.allErrors && o.if((0, e.not)(g), () => o.break());
          });
        });
      }
    }
  };
  return $t.default = n, $t;
}
var _t = {}, mn;
function Wi() {
  if (mn) return _t;
  mn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const s = Z(), e = {
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
  return _t.default = e, _t;
}
var St = {}, yn;
function Yi() {
  if (yn) return St;
  yn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: we().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return St.default = e, St;
}
var Pt = {}, gn;
function Qi() {
  if (gn) return Pt;
  gn = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
  const s = Y(), e = Z(), r = {
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
      const u = o, d = i.let("valid", !1), v = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: v }), i.block($), n.result(d, () => n.reset(), () => n.error(!0));
      function $() {
        u.forEach((S, g) => {
          let h;
          (0, e.alwaysValidSchema)(c, S) ? i.var(_, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: g,
            compositeRule: !0
          }, _), g > 0 && i.if((0, s._)`${_} && ${d}`).assign(d, !1).assign(v, (0, s._)`[${v}, ${g}]`).else(), i.if(_, () => {
            i.assign(d, !0), i.assign(v, g), h && n.mergeEvaluated(h, s.Name);
          });
        });
      }
    }
  };
  return Pt.default = r, Pt;
}
var Mt = {}, vn;
function Xi() {
  if (vn) return Mt;
  vn = 1, Object.defineProperty(Mt, "__esModule", { value: !0 });
  const s = Z(), e = {
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
var Et = {}, bn;
function Zi() {
  if (bn) return Et;
  bn = 1, Object.defineProperty(Et, "__esModule", { value: !0 });
  const s = Y(), e = Z(), r = {
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
      const v = o.let("valid", !0), _ = o.name("_valid");
      if ($(), i.reset(), u && d) {
        const g = o.let("ifClause");
        i.setParams({ ifClause: g }), o.if(_, S("then", g), S("else", g));
      } else u ? o.if(_, S("then")) : o.if((0, s.not)(_), S("else"));
      i.pass(v, () => i.error(!0));
      function $() {
        const g = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(g);
      }
      function S(g, h) {
        return () => {
          const p = i.subschema({ keyword: g }, _);
          o.assign(v, _), i.mergeValidEvaluated(p, v), h ? o.assign(h, (0, s._)`${g}`) : i.setParams({ ifClause: g });
        };
      }
    }
  };
  function n(i, o) {
    const a = i.schema[o];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return Et.default = r, Et;
}
var Tt = {}, wn;
function es() {
  if (wn) return Tt;
  wn = 1, Object.defineProperty(Tt, "__esModule", { value: !0 });
  const s = Z(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, s.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return Tt.default = e, Tt;
}
var $n;
function ts() {
  if ($n) return pt;
  $n = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const s = jn(), e = Li(), t = qn(), r = Ui(), n = Gi(), i = Bi(), o = Ki(), a = On(), c = Hi(), u = Ji(), d = Wi(), v = Yi(), _ = Qi(), $ = Xi(), S = Zi(), g = es();
  function h(p = !1) {
    const l = [
      // any
      d.default,
      v.default,
      _.default,
      $.default,
      S.default,
      g.default,
      // object
      o.default,
      a.default,
      i.default,
      c.default,
      u.default
    ];
    return p ? l.push(e.default, r.default) : l.push(s.default, t.default), l.push(n.default), l;
  }
  return pt.default = h, pt;
}
var kt = {}, Nt = {}, _n;
function rs() {
  if (_n) return Nt;
  _n = 1, Object.defineProperty(Nt, "__esModule", { value: !0 });
  const s = Y(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, s._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: o, $data: a, schema: c, schemaCode: u, it: d } = r, { opts: v, errSchemaPath: _, schemaEnv: $, self: S } = d;
      if (!v.validateFormats)
        return;
      a ? g() : h();
      function g() {
        const p = i.scopeValue("formats", {
          ref: S.formats,
          code: v.code.formats
        }), l = i.const("fDef", (0, s._)`${p}[${u}]`), f = i.let("fType"), m = i.let("format");
        i.if((0, s._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => i.assign(f, (0, s._)`${l}.type || "string"`).assign(m, (0, s._)`${l}.validate`), () => i.assign(f, (0, s._)`"string"`).assign(m, l)), r.fail$data((0, s.or)(w(), b()));
        function w() {
          return v.strictSchema === !1 ? s.nil : (0, s._)`${u} && !${m}`;
        }
        function b() {
          const P = $.$async ? (0, s._)`(${l}.async ? await ${m}(${o}) : ${m}(${o}))` : (0, s._)`${m}(${o})`, k = (0, s._)`(typeof ${m} == "function" ? ${P} : ${m}.test(${o}))`;
          return (0, s._)`${m} && ${m} !== true && ${f} === ${n} && !${k}`;
        }
      }
      function h() {
        const p = S.formats[c];
        if (!p) {
          w();
          return;
        }
        if (p === !0)
          return;
        const [l, f, m] = b(p);
        l === n && r.pass(P());
        function w() {
          if (v.strictSchema === !1) {
            S.logger.warn(k());
            return;
          }
          throw new Error(k());
          function k() {
            return `unknown format "${c}" ignored in schema at path "${_}"`;
          }
        }
        function b(k) {
          const C = k instanceof RegExp ? (0, s.regexpCode)(k) : v.code.formats ? (0, s._)`${v.code.formats}${(0, s.getProperty)(c)}` : void 0, x = i.scopeValue("formats", { key: c, ref: k, code: C });
          return typeof k == "object" && !(k instanceof RegExp) ? [k.type || "string", k.validate, (0, s._)`${x}.validate`] : ["string", k, x];
        }
        function P() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!$.$async)
              throw new Error("async format in sync schema");
            return (0, s._)`await ${m}(${o})`;
          }
          return typeof f == "function" ? (0, s._)`${m}(${o})` : (0, s._)`${m}.test(${o})`;
        }
      }
    }
  };
  return Nt.default = t, Nt;
}
var Sn;
function ns() {
  if (Sn) return kt;
  Sn = 1, Object.defineProperty(kt, "__esModule", { value: !0 });
  const e = [rs().default];
  return kt.default = e, kt;
}
var Re = {}, Pn;
function is() {
  return Pn || (Pn = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.contentVocabulary = Re.metadataVocabulary = void 0, Re.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Re.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Re;
}
var Mn;
function ss() {
  if (Mn) return Xe;
  Mn = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const s = Ni(), e = Fi(), t = ts(), r = ns(), n = is(), i = [
    s.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Xe.default = i, Xe;
}
var At = {}, Ve = {}, En;
function os() {
  if (En) return Ve;
  En = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.DiscrError = void 0;
  var s;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(s || (Ve.DiscrError = s = {})), Ve;
}
var Tn;
function as() {
  if (Tn) return At;
  Tn = 1, Object.defineProperty(At, "__esModule", { value: !0 });
  const s = Y(), e = os(), t = nr(), r = zt(), n = Z(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: u } }) => (0, s._)`{error: ${a}, tag: ${u}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: u, schema: d, parentSchema: v, it: _ } = a, { oneOf: $ } = v;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const S = d.propertyName;
      if (typeof S != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!$)
        throw new Error("discriminator: requires oneOf keyword");
      const g = c.let("valid", !1), h = c.const("tag", (0, s._)`${u}${(0, s.getProperty)(S)}`);
      c.if((0, s._)`typeof ${h} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: S })), a.ok(g);
      function p() {
        const m = f();
        c.if(!1);
        for (const w in m)
          c.elseIf((0, s._)`${h} === ${w}`), c.assign(g, l(m[w]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: S }), c.endIf();
      }
      function l(m) {
        const w = c.name("valid"), b = a.subschema({ keyword: "oneOf", schemaProp: m }, w);
        return a.mergeEvaluated(b, s.Name), w;
      }
      function f() {
        var m;
        const w = {}, b = k(v);
        let P = !0;
        for (let z = 0; z < $.length; z++) {
          let B = $[z];
          if (B?.$ref && !(0, n.schemaHasRulesButRef)(B, _.self.RULES)) {
            const H = B.$ref;
            if (B = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, H), B instanceof t.SchemaEnv && (B = B.schema), B === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, H);
          }
          const L = (m = B?.properties) === null || m === void 0 ? void 0 : m[S];
          if (typeof L != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${S}"`);
          P = P && (b || k(B)), C(L, z);
        }
        if (!P)
          throw new Error(`discriminator: "${S}" must be required`);
        return w;
        function k({ required: z }) {
          return Array.isArray(z) && z.includes(S);
        }
        function C(z, B) {
          if (z.const)
            x(z.const, B);
          else if (z.enum)
            for (const L of z.enum)
              x(L, B);
          else
            throw new Error(`discriminator: "properties/${S}" must have "const" or "enum"`);
        }
        function x(z, B) {
          if (typeof z != "string" || z in w)
            throw new Error(`discriminator: "${S}" values must be unique strings`);
          w[z] = B;
        }
      }
    }
  };
  return At.default = o, At;
}
const cs = "http://json-schema.org/draft-07/schema#", ls = "http://json-schema.org/draft-07/schema#", us = "Core schema meta-schema", ds = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, hs = ["object", "boolean"], fs = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, ps = {
  $schema: cs,
  $id: ls,
  title: us,
  definitions: ds,
  type: hs,
  properties: fs,
  default: !0
};
var kn;
function ms() {
  return kn || (kn = 1, (function(s, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Ei(), r = ss(), n = as(), i = ps, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
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
    var u = Dt();
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
    var v = rr();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return v.default;
    } });
    var _ = zt();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(He, He.exports)), He.exports;
}
var ys = ms();
const gs = /* @__PURE__ */ ci(ys), vs = "http://json-schema.org/draft-07/schema#", bs = "JMON Composition (Multi-Track, Extended)", ws = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values use numeric format in quarter notes (e.g., 4.5) for MIDI compatibility and algorithmic processing. The bars:beats:ticks format is available for display and conversion purposes only.", $s = "object", _s = ["format", "version", "bpm", "tracks"], Ss = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 8.0 for beat 1 of bar 3 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '2:0:0')."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 16.0 for beat 1 of bar 5 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '4:0:0')."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"number","description":"Offset in quarter notes for when playback should start (e.g., 2.0 for beat 3)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0')."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"oneOf":[{"type":"number","description":"End time in quarter notes where the global loop should end (e.g., 32.0 for bar 9 in 4/4)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '8:0:0')."}],"description":"Where the global loop should end."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 4.5 for beat 1.5 of bar 2 in 4/4). Primary format for MIDI compatibility."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0', '1:3.5:240')."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Ps = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, Ms = !1, Es = {
  $schema: vs,
  title: bs,
  description: ws,
  type: $s,
  required: _s,
  properties: Ss,
  definitions: Ps,
  additionalProperties: Ms
};
function Ts(s) {
  const e = typeof s == "string" ? parseInt(s, 10) : s;
  if (!Number.isFinite(e)) return String(s);
  const r = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(e % 12 + 12) % 12], n = Math.floor(e / 12) - 1;
  return `${r}${n}`;
}
function xn(s) {
  return !s || !Array.isArray(s.audioGraph) || s.audioGraph.forEach((e) => {
    try {
      if (!e || e.type !== "Sampler") return;
      const t = e.options || {}, r = t.urls;
      if (!r || typeof r != "object") return;
      const n = {};
      Object.keys(r).forEach((i) => {
        const o = String(i);
        let a = o;
        /^\d+$/.test(o) && (a = Ts(parseInt(o, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), s;
}
class sr {
  constructor(e = Es) {
    this.ajv = new gs({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e));
    xn(t);
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
class Dn {
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
    const i = (a, c) => {
      const u = c % t.length, d = Math.floor(c / t.length) * 12, v = t[u];
      return a + v + d;
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
function ks(s) {
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
function zn(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function Vn(s) {
  return Math.floor(s / 12) - 1;
}
function Ns(s) {
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
function tr(s, e, t) {
  typeof s == "string" && (s = Le(s)), typeof t == "string" && (t = Le(t));
  const r = e.indexOf(t);
  if (e.includes(s))
    return e.indexOf(s) - r;
  {
    const n = zn(s, e), i = e.indexOf(n), o = i > 0 ? i - 1 : i, a = e[o], c = n - s, u = s - a, d = c + u;
    if (d === 0) return i - r;
    const v = 1 - c / d, _ = 1 - u / d, $ = i - r, S = o - r;
    return $ * v + S * _;
  }
}
function As(s, e, t) {
  const r = e.indexOf(t), n = Math.round(r + s);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), o = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], c = e[o], u = o - n, d = n - i, v = u + d;
    if (v === 0)
      return (c + a) / 2;
    const _ = 1 - u / v, $ = 1 - d / v;
    return c * _ + a * $;
  }
}
function Fn(s) {
  s.length > 0 && s[0].length === 2 && (s = s.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of s)
    e.push([r, n, t]), t += n;
  return e;
}
function Ln(s, e = 0) {
  const t = [...s].sort((i, o) => i[2] - o[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [o, a, c] = i, u = e + c;
    if (u > r) {
      const v = [null, u - r, r - e];
      n.push(v);
    }
    n.push(i), r = Math.max(r, u + a);
  }
  return n;
}
function Un(s) {
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
function Rs(s) {
  return Un(Ln(s));
}
function Le(s) {
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
function Cs(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(s / 12) - 1, r = s % 12;
  return e[r] + t.toString();
}
function Is(s, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, o] of s)
    t.push([n, i, r]), r += i;
  return t;
}
function js(s) {
  return s.every((e) => Array.isArray(e)) ? "list of tuples" : s.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function qs(s, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...s), o = n !== null ? n : Math.max(...s);
  return i === o ? new Array(s.length).fill((e + t) / 2) : s.map(
    (a) => (a - i) * (t - e) / (o - i) + e
  );
}
function Gn(s, e) {
  return s.map(([t, r, n]) => [t, r, n + e]);
}
function Os(s, e, t) {
  const r = [];
  for (const [n, i, o] of s) {
    const a = Math.round(o / t) * t, c = (Math.floor(a / e) + 1) * e;
    let u = Math.round(i / t) * t;
    u = Math.min(u, c - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function xs(s, e) {
  const r = s.filter(([a, , c]) => a !== null && c !== null).sort((a, c) => a[2] - c[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, o = [];
  for (let a = 0; a < i; a++) {
    const c = a * e;
    let u = null, d = 1 / 0;
    for (const [v, , _] of r) {
      const $ = c - _;
      if ($ >= 0 && $ < d && (d = $, u = v), _ > c) break;
    }
    u !== null && o.push(u);
  }
  return o;
}
function Ds(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function zs(s, e) {
  return 60 / e * s;
}
function* Vs(s = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * s, [s, e] = [e, s + e];
}
function Fs(s, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(s)) {
    const o = [];
    for (let a = 0; a < e; a++) {
      const c = a * t, u = Gn(i, c);
      o.push(...u);
    }
    r[n] = o;
  }
  return r;
}
const Ls = {
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
}, Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: Un,
  cdeToMidi: Le,
  checkInput: js,
  fibonacci: Vs,
  fillGapsWithRests: Ln,
  findClosestPitchAtMeasureStart: xs,
  getDegreeFromPitch: tr,
  getOctave: Vn,
  getPitchFromDegree: As,
  getSharp: Ns,
  instrumentMapping: Ls,
  midiToCde: Cs,
  noOverlap: Is,
  offsetTrack: Gn,
  qlToSeconds: zs,
  quantizeNotes: Os,
  repairNotes: Rs,
  repeatPolyloops: Fs,
  roundToList: zn,
  scaleList: qs,
  setOffsetsAccordingToDurations: Fn,
  tracksToDict: ks,
  tune: Ds
}, Symbol.toStringTag, { value: "Module" }));
class Gs extends de {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = Le(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
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
        const v = o[d][Math.floor(Math.random() * o[d].length)], _ = a[d], $ = Array.isArray(v) ? v[0] : v, S = this.generateChord($, _);
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
class Bs extends de {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new Dn(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = Vn(e), r = this.tonic + t.toString(), n = Le(r), i = this.scale.map((c) => tr(c, this.scale, n)), o = Math.round(tr(e, this.scale, n)), a = [];
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
        a.forEach((v, _) => {
          o.push([v, d, u + _ * d]);
        });
      }
      return o;
    } else
      return i;
  }
}
const Nn = {
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
class or {
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
    }, i = Nn[t];
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
    const t = Nn[e.type];
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
    const r = de.scale_intervals[t], n = de.chromatic_scale.indexOf(e), i = r.map((a) => (n + a) % 12), o = [];
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
    const r = e[t], n = or.validateOrnament(r, this.type, this.params);
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
    let v;
    if (this.scale && this.scale.includes(n)) {
      const $ = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      v = this.scale[$];
    } else
      v = n + u;
    for (; c < o + i; ) {
      const _ = o + i - c, $ = Math.min(d, _ / 2);
      if (_ >= $ * 2)
        a.push({ pitch: n, duration: $, time: c }), a.push({ pitch: v, duration: $, time: c + $ }), c += 2 * $;
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
      const v = this.scale.indexOf(n);
      c = this.scale[v + 1] || n + 2, u = this.scale[v - 1] || n - 2;
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
    const d = i / u.length, v = u.map((_, $) => ({
      pitch: _,
      duration: d,
      time: o + $ * d
    }));
    return [
      ...e.slice(0, t),
      ...v,
      ...e.slice(t + 1)
    ];
  }
}
const Xt = {
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
class Vt {
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
    const o = Xt[t];
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
      const i = Xt[n];
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
    return Object.entries(Xt).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function Bn(s, e, t, r) {
  return Vt.addArticulation(s, e, t, r);
}
function Kn(s, e) {
  return Vt.removeArticulation(s, e);
}
function Ks(s) {
  return Vt.validateSequence(s);
}
const Hs = Bn, Js = Kn, Ws = {
  Scale: Dn,
  Progression: Gs,
  Voice: Bs,
  Ornament: or,
  Articulation: Vt,
  addArticulation: Bn,
  addOrnament: Hs,
  // Include the alias
  removeArticulation: Kn,
  removeOrnament: Js,
  // Include the alias
  validateArticulations: Ks
};
class Ys {
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
    return new Qs(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class Qs {
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
function _e(s, e = 4, t = 480) {
  const r = Math.floor(s / e), n = s - r * e, i = Math.floor(n), o = n - i, a = Math.round(o * t);
  return `${r}:${i}:${a}`;
}
function qe(s, e = 4, t = 480) {
  if (typeof s == "number") return s;
  if (typeof s != "string") return 0;
  const r = s.split(":").map((a) => parseFloat(a || "0")), [n = 0, i = 0, o = 0] = r;
  return n * e + i + o / t;
}
function Hn(s, e = "Untitled Part", t = {}) {
  const r = ar(s);
  return {
    name: e,
    notes: r,
    ...t
  };
}
function Xs(s, e = {}) {
  const t = s.map((n, i) => Array.isArray(n) ? Hn(n, `Track ${i + 1}`) : n.name && n.notes ? {
    ...n,
    notes: ar(n.notes)
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
function ar(s) {
  return Array.isArray(s) ? s.map((e, t) => {
    if (Array.isArray(e)) {
      const [r, n, i = 0] = e;
      return {
        pitch: r,
        duration: n,
        time: _e(i)
      };
    }
    if (typeof e == "object" && e !== null) {
      const { pitch: r, duration: n } = e;
      let i = "0:0:0";
      return typeof e.time == "string" ? i = e.time : typeof e.time == "number" ? i = _e(e.time) : typeof e.offset == "number" && (i = _e(e.offset)), {
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
function Zs(s) {
  return s.map(([e, t, r = 0]) => ({
    pitch: e,
    duration: t,
    time: _e(r)
  }));
}
function eo(s) {
  return s.map((e) => [
    e.pitch,
    e.duration,
    qe(e.time)
  ]);
}
function to(s, e = 1, t = 0) {
  let r = t;
  return s.map((n) => {
    const i = {
      pitch: n,
      duration: e,
      time: _e(r)
    };
    return r += e, i;
  });
}
function Jn(s, e) {
  return s.map((t) => ({
    ...t,
    time: _e(qe(t.time) + e)
  }));
}
function ro(s) {
  if (s.length === 0) return [];
  const e = [];
  let t = 0;
  for (const r of s) {
    const n = Jn(r, t);
    e.push(...n);
    const i = n.map(
      (o) => qe(o.time) + o.duration
    );
    t = Math.max(...i, t);
  }
  return e;
}
function no(s) {
  return s.flat();
}
function io(s) {
  if (s.length === 0) return { start: 0, end: 0, duration: 0 };
  const e = s.map((i) => qe(i.time)), t = s.map((i) => qe(i.time) + i.duration), r = Math.min(...e), n = Math.max(...t);
  return {
    start: r,
    end: n,
    duration: n - r,
    startTime: _e(r),
    endTime: _e(n)
  };
}
const so = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: _e,
  combineSequences: no,
  concatenateSequences: ro,
  createComposition: Xs,
  createPart: Hn,
  createScale: to,
  getTimingInfo: io,
  jmonToTuples: eo,
  normalizeNotes: ar,
  offsetNotes: Jn,
  timeToBeats: qe,
  tuplesToJmon: Zs
}, Symbol.toStringTag, { value: "Module" }));
function oo(s, e, t = {}) {
  const r = s.map((u) => Array.isArray(u) || typeof u == "object" && u.length ? u[0] : u), n = ao(r.length, e.length), i = [], o = [];
  for (let u = 0; u < n; u++)
    i.push(r[u % r.length]), o.push(e[u % e.length]);
  const a = i.map((u, d) => [u, o[d], 1]), c = Fn(a);
  return t.legacy ? c : c.map(([u, d, v]) => ({
    pitch: u,
    duration: d,
    time: t.useStringTime ? _e(v) : v
  }));
}
function ao(s, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(s * e) / t(s, e);
}
function co(s, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of s) {
    const o = e[n % e.length];
    t.push([i, o, r]), r += o, n++;
  }
  return t;
}
const lo = {
  Rhythm: Ys,
  isorhythm: oo,
  beatcycle: co
};
class uo {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class $e {
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
    return new $e(e, t);
  }
  static from2DArray(e) {
    return new $e(e);
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
    return new $e(e);
  }
  clone() {
    return new $e(this.data);
  }
  toArray() {
    return this.data.map((e) => [...e]);
  }
}
function Zt(s) {
  return Array.isArray(s[0]) ? $e.from2DArray(s) : $e.from2DArray([s]);
}
function Wn(s) {
  if (s.rows !== s.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = s.rows, t = $e.zeros(e, e);
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
class ho {
  constructor(e = {}) {
    this.params = { ...e };
  }
  call(e, t) {
    const r = t || e, n = $e.zeros(e.rows, r.rows);
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
class Yn {
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
    this.XTrain = Zt(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = Wn(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = Zt(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
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
    const r = Zt(e), n = this.predict(e, !0);
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
class An extends ho {
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
function fo(s = 0, e = 1) {
  const t = Math.random(), r = Math.random(), n = Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * r);
  return s + e * n;
}
function po(s, e) {
  const t = s.length, r = Wn(e), n = Array.from({ length: t }, () => fo()), i = new Array(t);
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
function Oe(s, e = Se) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = n * 4 / i, a = Math.floor(s / o), c = s % o, u = Math.floor(c), d = c - u, v = Math.round(d * r);
  return `${a}:${u}:${v}`;
}
function cr(s, e = Se) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, o = s.split(":");
  if (o.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${s}`);
  const a = parseInt(o[0], 10), c = parseFloat(o[1]), u = parseInt(o[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(u))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${s}`);
  const d = n * 4 / i;
  return a * d + c + u / r;
}
function mo(s, e = Se, t = !0) {
  return s.map((r) => {
    const n = { ...r };
    if (r.offset !== void 0 && (n.time = r.offset, delete n.offset), typeof r.time == "string" && r.time.includes(":") && (n.time = cr(r.time, e)), typeof r.duration == "number" && !t) {
      const i = r.duration;
      i === 1 ? n.duration = "4n" : i === 0.5 ? n.duration = "8n" : i === 0.25 ? n.duration = "16n" : i === 2 ? n.duration = "2n" : i === 4 && (n.duration = "1n");
    }
    return n;
  });
}
function Ue(s, e = {}) {
  const {
    label: t = "track",
    midiChannel: r = 0,
    synth: n = { type: "Synth" },
    timingConfig: i = Se,
    keepNumericDuration: o = !0
    // Default to numeric for MIDI consistency
  } = e, a = mo(s, i, o);
  return {
    label: t,
    midiChannel: r,
    synth: n,
    notes: a
  };
}
class yo {
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
      const u = Array.from({ length: t }, (g, h) => [h]), d = new $e(u), _ = new An(n, i).call(d);
      for (let g = 0; g < _.rows; g++)
        _.set(g, g, _.get(g, g) + o);
      let $ = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && ($ = new Array(t).fill(this.walkAround));
      const S = po($, _);
      a.push(S);
    }
    return r === 1 ? a[0] : a;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, o = this.data.map((g) => [g[0]]), a = this.data.map((g) => g[1]), c = new An(n, i);
    this.gpr = new Yn(c);
    try {
      this.gpr.fit(o, a), this.isFitted = !0;
    } catch (g) {
      throw new Error(`Failed to fit Gaussian Process: ${g.message}`);
    }
    const u = Math.min(...this.data.map((g) => g[0])), v = (Math.max(...this.data.map((g) => g[0])) - u) / (t - 1), _ = Array.from({ length: t }, (g, h) => [u + h * v]), $ = this.gpr.sampleY(_, r), S = _.map((g) => g[0]);
    return r === 1 ? [S, $[0]] : [S, $];
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
    const v = Array.isArray(e[0]) ? e : [e], _ = r || Array.from({ length: v[0].length }, ($, S) => S);
    for (let $ = 0; $ < v[0].length; $++) {
      const S = t[$ % t.length], g = r ? _[$] : d, h = v.map((l) => {
        let f = l[$];
        if (o) {
          const m = Math.min(...l), b = Math.max(...l) - m || 1, P = (f - m) / b, k = Math.floor(P * o.length), C = Math.max(0, Math.min(k, o.length - 1));
          f = o[C];
        } else {
          const m = Math.min(...l), b = Math.max(...l) - m || 1, P = (f - m) / b;
          f = a[0] + P * (a[1] - a[0]);
        }
        return c && (f = Math.round(f)), f;
      }), p = h.length === 1 ? h[0] : h;
      u.push({
        pitch: p,
        duration: S,
        time: i ? Oe(g, this.timingConfig) : g
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
    return Ue(i, {
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
class go {
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
class qt {
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
    return new qt({ [e.label || "Track"]: e }, t);
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
        const v = d * a, _ = r[d % r.length];
        o.push({
          pitch: _,
          duration: a * 0.8,
          time: v,
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
    return new qt({ [c.label]: c }, e);
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
class Ct {
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
        const v = Math.max(Math.abs(u), Math.abs(d), 1), _ = 1 - Math.abs(u - d) / v;
        o += _, a++;
      }
    }
    return a === 0 ? 0 : o / a;
  }
}
class vo {
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
      seed: v = null
    } = e;
    this.initialPhrases = t, this.mutationRate = r, this.populationSize = n, this.scale = o, this.measureLength = a, this.timeResolution = c, v !== null ? (this.seed = v, this.randomState = this.createSeededRandom(v)) : this.randomState = Math;
    const _ = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = _.filter(
      ($) => $ >= c[0] && $ <= Math.min(c[1], a)
    ), this.mutationProbabilities = i || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const $ = this.possibleDurations.map((S, g) => Math.pow(2, -g));
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
      const a = new Ct(t);
      i.gini_pitch = a.gini(), i.balance_pitch = a.balance(), i.motif_pitch = a.motif(), this.scale && (i.dissonance_pitch = a.dissonance(this.scale));
    }
    if (r.length > 0) {
      const a = new Ct(r);
      i.gini_duration = a.gini(), i.balance_duration = a.balance(), i.motif_duration = a.motif(), i.rhythmic = a.rhythmic(this.measureLength);
    }
    if (n.length > 0) {
      const a = new Ct(n);
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
        const c = a === 0 ? `${n}_pitch` : a === 1 ? `${n}_duration` : `${n}_offset`, u = t[c] || 0, d = i[a], v = o[a];
        if (v > 0 && d !== void 0) {
          const _ = Math.max(Math.abs(d), 1), $ = 1 - Math.abs(u - d) / _;
          r += Math.max(0, $) * v;
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
class bo {
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
      const u = (c - i) / a, d = Math.floor(u * t.length * r), v = Math.floor(d / t.length), _ = d % t.length;
      return 60 + v * 12 + t[_];
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
    for (let v = 0; v < c.length; v++) {
      const _ = e[v % e.length];
      let $ = c[v];
      if (o) {
        const S = Math.min(...c), h = Math.max(...c) - S || 1, p = ($ - S) / h, l = Math.floor(p * o.length), f = Math.max(0, Math.min(l, o.length - 1));
        $ = o[f];
      } else
        $ = this.mapToScale([c], o || [60, 62, 64, 65, 67, 69, 71])[0][v];
      u.push({
        pitch: $,
        duration: _,
        time: r ? Oe(d, n) : d
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
    return Ue(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
}
class wo {
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
        const d = n[u], v = i[u];
        if (v === null) {
          d && (d[o] = null);
          continue;
        }
        const _ = this.generateStep(r);
        let $ = v + _;
        if (isNaN($) && ($ = v), this.walkRange !== null && ($ < this.walkRange[0] ? $ = this.walkRange[0] : $ > this.walkRange[1] && ($ = this.walkRange[1])), isNaN($) && ($ = this.walkStart), d && (d[o] = $), a[u] = $, r() < this.branchingProbability) {
          const S = this.createBranch(n[u], o), g = this.generateStep(r);
          let h = v + g;
          isNaN(h) && (h = v), this.walkRange !== null && (h < this.walkRange[0] ? h = this.walkRange[0] : h > this.walkRange[1] && (h = this.walkRange[1])), isNaN(h) && (h = this.walkStart), S[o] = h, c.push(S), a.push(h);
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
      const d = e.map((v) => v[u]).filter((v) => v !== null);
      if (d.length > 0) {
        const v = t[a % t.length], _ = d.length === 1 ? d[0] : d;
        i.push({
          pitch: _,
          duration: v,
          time: n ? Oe(o, this.timingConfig) : o
        }), o += v, a++;
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
    return Ue(i, {
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
class je {
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
class lr {
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
    } = r, v = [];
    for (const _ of e) {
      let $, S;
      if (o) {
        const g = Math.max(0, Math.min(1, _.distance / 10));
        $ = n[0] + g * (n[1] - n[0]);
      } else
        $ = n[0] + _.angle / 360 * (n[1] - n[0]);
      if (a)
        S = i[0] + _.angle / 360 * (i[1] - i[0]);
      else {
        const g = Math.max(0, Math.min(1, _.distance / 10));
        S = i[1] - g * (i[1] - i[0]);
      }
      if (c) {
        const g = Math.floor(($ - n[0]) / (n[1] - n[0]) * c.length), h = Math.max(0, Math.min(g, c.length - 1));
        $ = c[h];
      } else
        $ = Math.round($);
      v.push({
        pitch: $,
        duration: S,
        time: d ? Oe(_.time, u) : _.time,
        phasorData: {
          distance: _.distance,
          angle: _.angle,
          position: _.position
        }
      });
    }
    return v;
  }
  /**
   * Generate JMON tracks directly from phasor motion
   */
  generateTracks(e, t = {}, r = {}) {
    const n = this.mapToMusic(e, t), i = [];
    return n.forEach((o, a) => {
      const c = Ue(o, {
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
    const e = new lr(), t = new je(0.2, 5, 0), r = new je(0.3, 3, Math.PI / 2), n = new je(0.1, 8, Math.PI);
    t.addSubPhasor(n);
    const i = new je(2, 1, 0, [t, r]), o = new je(3.5, 0.6, Math.PI / 3);
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
class $o {
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
      const c = (a - n) / o, u = Math.floor(c * t.length * r), d = Math.floor(u / t.length), v = u % t.length;
      return 60 + d * 12 + t[v];
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
class _o {
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
      const v = d.slice(-50);
      for (const _ of v)
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
class So {
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
    return Oe(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : cr(e, this.timingConfig);
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
    return Ue(r, {
      timingConfig: this.timingConfig,
      ...t
    });
  }
}
class Po {
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
        const { offset: S, time: g, ...h } = i;
        n.push({
          ...h,
          pitch: void 0,
          time: t ? this.beatsToTime(S) : S
        });
        continue;
      }
      const o = i.pitch, c = this.tChord.map((S) => S - o).map((S, g) => ({ index: g, value: S })).sort((S, g) => Math.abs(S.value) - Math.abs(g.value));
      let u = this.rank, d;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const S = c.filter(
          ({ value: g }) => this.currentDirection === "up" ? g >= 0 : g <= 0
        );
        if (S.length === 0)
          d = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          u >= S.length && (u = S.length - 1);
          const g = S[u].index;
          d = this.tChord[g];
        }
      } else {
        u >= c.length && (u = c.length - 1);
        const S = c[u].index;
        d = this.tChord[S];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: v, time: _, ...$ } = i;
      n.push({
        ...$,
        pitch: d,
        time: t ? this.beatsToTime(v) : v
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
    return Oe(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : cr(e, this.timingConfig);
  }
}
class Mo {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((v, _) => ({ value: v, weight: n[_] })).sort((v, _) => v.value - _.value), o = i.map((v) => v.value), a = i.map((v) => v.weight), c = a.reduce((v, _) => v + _, 0);
    let u = 0, d = 0;
    for (let v = 0; v < r; v++) {
      const _ = a.slice(0, v + 1).reduce(($, S) => $ + S, 0);
      u += a[v] * (2 * _ - a[v] - c) * o[v], d += a[v] * o[v] * c;
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
const Eo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: Mo,
  MusicalIndex: Ct
}, Symbol.toStringTag, { value: "Module" })), To = {
  harmony: Ws,
  rhythm: lo,
  motifs: {
    MotifBank: uo
  }
}, ko = {
  theory: de
}, No = {
  gaussian: {
    Regressor: Yn,
    Kernel: yo
  },
  automata: {
    Cellular: go
  },
  loops: qt,
  genetic: {
    Darwin: vo
  },
  walks: {
    Random: bo,
    Chain: wo,
    Phasor: {
      Vector: je,
      System: lr
    }
  },
  fractals: {
    Mandelbrot: $o,
    LogisticMap: _o
  },
  minimalism: {
    Process: So,
    Tintinnabuli: Po
  }
}, Ao = {
  ...Eo
}, Ro = {
  ...Us
}, Fe = {
  theory: To,
  constants: ko,
  generative: No,
  analysis: Ao,
  utils: Ro
};
class er {
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
function Qn(s, e = {}) {
  try {
    xn(s);
  } catch {
  }
  const n = new er(e).convert(s).map((_, $) => ({
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
      const S = er.parseBBTToBeats($.time, c), g = er.parseDurationToBeats($.duration, c), h = S + g;
      h > u && (u = h);
    });
  });
  const d = 60 / i, v = u * d;
  return {
    tracks: n,
    metadata: {
      totalDuration: v,
      tempo: i
    }
  };
}
function ur(s, e = {}) {
  if (!s || typeof s != "object")
    throw console.error("[PLAYER] Invalid composition:", s), new Error("Composition must be a valid JMON object");
  const {
    autoplay: t = !1,
    showDebug: r = !1,
    customInstruments: n = {},
    autoMultivoice: i = !0,
    maxVoices: o = 4
  } = e;
  if (!s.sequences && !s.tracks)
    throw console.error("[PLAYER] No sequences or tracks found in composition:", s), new Error("Composition must have sequences or tracks");
  const a = s.tracks || s.sequences || [];
  if (!Array.isArray(a))
    throw console.error("[PLAYER] Tracks/sequences must be an array:", a), new Error("Tracks/sequences must be an array");
  const c = s.bpm || 120, d = Qn(s, { autoMultivoice: i, maxVoices: o, showDebug: r }), { tracks: v, metadata: _ } = d;
  let $ = _.totalDuration;
  const S = {
    background: "#FFFFFF",
    primary: "#333",
    secondary: "#F0F0F0",
    text: "#000000",
    lightText: "#666666",
    border: "#CCCCCC"
  }, g = document.createElement("div");
  g.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${S.background};
        color: ${S.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${S.border};
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
  const p = document.createElement("div");
  p.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 60%;
    `;
  const l = document.createElement("div");
  l.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const f = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"];
  s.audioGraph && s.audioGraph.some((M) => M.type === "Sampler") && f.unshift("Sampler");
  const m = s.tracks || s.sequences || [], w = [];
  m.forEach((M, T) => {
    const I = v.find((X) => X.originalTrackIndex === T)?.analysis;
    I?.hasGlissando && console.warn(`Track ${M.label || M.name || T + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const q = document.createElement("div");
    q.style.cssText = `
            margin-bottom: 8px;
        `;
    const D = document.createElement("label");
    D.textContent = M.name || M.label || `Track ${T + 1}`, D.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${S.text};
            display: block;
            margin-bottom: 8px;
            font-weight: normal;
        `;
    const U = document.createElement("select");
    U.style.cssText = `
            padding: 4px;
            border: 1px solid ${S.secondary};
            border-radius: 4px;
            background-color: ${S.background};
            color: ${S.text};
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
      te.value = X, te.textContent = X, s.tracks?.[T]?.synthRef && X === "Sampler" && (te.selected = !0), I?.hasGlissando && (X === "PolySynth" || X === "DuoSynth") && (te.disabled = !0, te.textContent += " (mono only for glissando)"), U.appendChild(te);
    }), w.push(U), q.append(D, U), l.appendChild(q);
  }), p.appendChild(l);
  const b = document.createElement("div");
  b.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 35%;
    `;
  const P = document.createElement("div");
  P.style.cssText = `
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
        color: ${S.text};
    `;
  const C = document.createElement("input");
  C.type = "number", C.min = 60, C.max = 240, C.value = c, C.style.cssText = `
        padding: 4px;
        border: 1px solid ${S.secondary};
        border-radius: 4px;
        background-color: ${S.background};
        color: ${S.text};
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
    `, P.append(k, C), b.appendChild(P);
  const x = document.createElement("div");
  x.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
  const z = document.createElement("div");
  z.textContent = "0:00", z.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${S.text};
        min-width: 40px;
        text-align: center;
    `;
  const B = document.createElement("div");
  B.textContent = "0:00", B.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${S.text};
        min-width: 40px;
        text-align: center;
    `;
  const L = document.createElement("input");
  L.type = "range", L.min = 0, L.max = 100, L.value = 0, L.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${S.secondary};
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
        background-color: ${S.primary};
        color: ${S.background};
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
        color: ${S.lightText};
        margin: 0px 0px 0px 10px;
    `, x.append(z, L, B, H);
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
    `, me.append(ye, ee), h.append(p, b), g.append(h, x, ce, me);
  let V, O = !1, N = [], j = [], A = [], y = null;
  const E = s.tracks || s.sequences || [], R = () => {
    if (!V || !s.audioGraph || !Array.isArray(s.audioGraph)) return null;
    const M = {}, T = (I) => {
      const q = {};
      return Object.entries(I || {}).forEach(([D, U]) => {
        let X = D;
        if (typeof D == "number" || /^\d+$/.test(String(D)))
          try {
            X = V.Frequency(parseInt(D, 10), "midi").toNote();
          } catch {
          }
        q[X] = U;
      }), q;
    };
    try {
      return s.audioGraph.forEach((I) => {
        const { id: q, type: D, options: U = {}, target: X } = I;
        if (!q || !D) return;
        let te = null;
        if (D === "Sampler") {
          const se = T(U.urls);
          let le, oe;
          const ae = new Promise((re, K) => {
            le = re, oe = K;
          }), ue = {
            urls: se,
            onload: () => le && le(),
            onerror: (re) => {
              console.error(`[PLAYER] Sampler load error for ${q}:`, re), oe && oe(re);
            }
          };
          U.baseUrl && (ue.baseUrl = U.baseUrl);
          try {
            console.log(`[PLAYER] Building Sampler ${q} with urls:`, se, "baseUrl:", ue.baseUrl || "(none)"), te = new V.Sampler(ue).toDestination();
          } catch (re) {
            console.error("[PLAYER] Failed to create Sampler:", re), te = null;
          }
          A.push(ae), te && U.envelope && U.envelope.enabled && (typeof U.envelope.attack == "number" && (te.attack = U.envelope.attack), typeof U.envelope.release == "number" && (te.release = U.envelope.release));
        } else if ([
          "Synth",
          "PolySynth",
          "MonoSynth",
          "AMSynth",
          "FMSynth",
          "DuoSynth",
          "PluckSynth",
          "NoiseSynth"
        ].includes(D))
          try {
            te = new V[D](U).toDestination();
          } catch (se) {
            console.warn(`[PLAYER] Failed to create ${D} from audioGraph, using PolySynth:`, se), te = new V.PolySynth().toDestination();
          }
        else D === "Destination" && (M[q] = V.Destination);
        te && (M[q] = te);
      }), M;
    } catch (I) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", I), null;
    }
  }, F = (M) => `${Math.floor(M / 60)}:${Math.floor(M % 60).toString().padStart(2, "0")}`;
  B.textContent = F($);
  const G = async () => {
    if (typeof window < "u") {
      if (!window.Tone)
        try {
          if (typeof require < "u")
            window.Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js");
          else {
            const M = await import("https://unpkg.com/tone@14.8.49/build/Tone.js");
            window.Tone = M.default || M;
          }
        } catch (M) {
          return console.warn("Could not auto-load Tone.js:", M.message), console.log("To use the player, load Tone.js manually first:"), console.log('Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js")'), !1;
        }
      if (window.Tone) {
        V = window.Tone;
        try {
          return (V.context.state === "suspended" || V.context.state === "interrupted") && await V.context.resume(), V.context.state !== "running" && (await V.start(), navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && await new Promise((M) => setTimeout(M, 100))), V.context.state === "running";
        } catch (M) {
          return console.error("[PLAYER] Failed to initialize audio context:", M), !1;
        }
      }
    }
    return console.warn("Tone.js not available"), !1;
  }, Q = () => {
    if (V) {
      if (!y && (y = R(), y)) {
        const M = Object.keys(y).filter((T) => y[T] && y[T].name === "Sampler");
        M.length > 0 && console.log("[PLAYER] Using audioGraph Samplers for tracks with synthRef:", M);
      }
      N.forEach((M) => {
        if (!y || !Object.values(y).includes(M))
          try {
            M.dispose();
          } catch {
          }
      }), j.forEach((M) => {
        M.stop(), M.dispose();
      }), N = [], j = [], console.log("[PLAYER] Converted tracks:", v.length), v.forEach((M) => {
        const { originalTrackIndex: T, voiceIndex: I, totalVoices: q, trackInfo: D, synthConfig: U, partEvents: X } = M, se = (E[T] || {}).synthRef, le = 60 / _.tempo, oe = (X || []).map((re) => {
          const K = typeof re.time == "number" ? re.time * le : re.time, ie = typeof re.duration == "number" ? re.duration * le : re.duration;
          return { ...re, time: K, duration: ie };
        });
        let ae = null;
        if (se && y && y[se])
          ae = y[se];
        else {
          const re = w[T] ? w[T].value : U.type;
          try {
            const K = U.reason === "glissando_compatibility" ? U.type : re;
            ae = new V[K]().toDestination(), U.reason === "glissando_compatibility" && I === 0 && console.warn(`[MULTIVOICE] Using ${K} instead of ${U.original} for glissando in ${D.label}`);
          } catch (K) {
            console.warn(`Failed to create ${re}, using PolySynth:`, K), ae = new V.PolySynth().toDestination();
          }
        }
        N.push(ae), q > 1 && console.log(`[MULTIVOICE] Track "${D.label}" voice ${I + 1}: ${X.length} notes`);
        const ue = new V.Part((re, K) => {
          if (Array.isArray(K.pitch))
            K.pitch.forEach((ie) => {
              let he = "C4";
              typeof ie == "number" ? he = V.Frequency(ie, "midi").toNote() : typeof ie == "string" ? he = ie : Array.isArray(ie) && typeof ie[0] == "string" && (he = ie[0]), ae.triggerAttackRelease(he, K.duration, re);
            });
          else if (K.articulation === "glissando" && K.glissTarget !== void 0) {
            let ie = typeof K.pitch == "number" ? V.Frequency(K.pitch, "midi").toNote() : K.pitch, he = typeof K.glissTarget == "number" ? V.Frequency(K.glissTarget, "midi").toNote() : K.glissTarget;
            console.log("[PLAYER] Glissando", { fromNote: ie, toNote: he, duration: K.duration, time: re }), console.log("[PLAYER] Glissando effect starting from", ie, "to", he), ae.triggerAttack(ie, re, K.velocity || 0.8);
            const ve = V.Frequency(ie).toFrequency(), xe = V.Frequency(he).toFrequency(), Ge = 1200 * Math.log2(xe / ve);
            if (ae.detune && ae.detune.setValueAtTime && ae.detune.linearRampToValueAtTime)
              ae.detune.setValueAtTime(0, re), ae.detune.linearRampToValueAtTime(Ge, re + K.duration), console.log("[PLAYER] Applied detune glissando:", Ge, "cents over", K.duration, "beats");
            else {
              const ri = V.Frequency(ie).toMidi(), ni = V.Frequency(he).toMidi(), Be = Math.max(3, Math.abs(ni - ri)), fr = K.duration / Be;
              for (let Ke = 1; Ke < Be; Ke++) {
                const ii = Ke / (Be - 1), si = ve * Math.pow(xe / ve, ii), oi = V.Frequency(si).toNote(), ai = re + Ke * fr;
                ae.triggerAttackRelease(oi, fr * 0.8, ai, (K.velocity || 0.8) * 0.7);
              }
              console.log("[PLAYER] Applied chromatic glissando with", Be, "steps");
            }
            ae.triggerRelease(re + K.duration);
          } else {
            let ie = "C4";
            typeof K.pitch == "number" ? ie = V.Frequency(K.pitch, "midi").toNote() : typeof K.pitch == "string" ? ie = K.pitch : Array.isArray(K.pitch) && typeof K.pitch[0] == "string" && (ie = K.pitch[0]);
            let he = K.duration, ve = K.velocity || 0.8;
            K.articulation === "staccato" && (he = K.duration * 0.5), K.articulation === "accent" && (ve = Math.min(ve * 2, 1)), K.articulation === "tenuto" && (he = K.duration * 1.5, ve = Math.min(ve * 1.3, 1)), ae.triggerAttackRelease(ie, he, re, ve);
          }
        }, oe);
        j.push(ue);
      }), V.Transport.bpm.value = _.tempo, V.Transport.loopEnd = $, V.Transport.loop = !0, V.Transport.stop(), V.Transport.position = 0, B.textContent = F($);
    }
  }, W = () => {
    if (V && O) {
      const M = typeof V.Transport.loopEnd == "number" ? V.Transport.loopEnd : V.Time(V.Transport.loopEnd).toSeconds(), T = V.Transport.seconds % M, I = T / M * 100;
      L.value = Math.min(I, 100), z.textContent = F(T), B.textContent = F(M), V.Transport.state === "started" && O ? requestAnimationFrame(W) : V.Transport.state === "stopped" && (V.Transport.seconds = 0, L.value = 0, z.textContent = F(0), O = !1, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  if (H.addEventListener("click", async () => {
    if (!V)
      if (await G())
        Q();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (O)
      V.Transport.stop(), j.forEach((M) => {
        M.stop();
      }), O = !1, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
    else {
      if (V.context.state !== "running" && (await V.start(), console.log("[PLAYER] Audio context started:", V.context.state)), N.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), Q()), V.Transport.stop(), V.Transport.position = 0, console.log("[PLAYER] Transport state before start:", V.Transport.state), console.log("[PLAYER] Transport position reset to:", V.Transport.position), console.log("[PLAYER] Audio context state:", V.context.state), console.log("[PLAYER] Parts count:", j.length), console.log("[PLAYER] Synths count:", N.length), y) {
        const M = Object.values(y).filter((T) => T && T.name === "Sampler");
        if (M.length > 0 && A.length > 0) {
          console.log(`[PLAYER] Waiting for ${M.length} sampler(s) to load...`);
          try {
            await Promise.all(A), console.log("[PLAYER] All samplers loaded.");
          } catch (T) {
            console.warn("[PLAYER] Sampler load wait error:", T);
            return;
          }
        }
      }
      j.forEach((M) => {
        M.start(0);
      }), V.Transport.start(), O = !0, H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', W();
    }
  }), L.addEventListener("input", () => {
    if (V && $ > 0) {
      const M = L.value / 100 * $;
      V.Transport.seconds = M, z.textContent = F(M);
    }
  }), C.addEventListener("change", () => {
    const M = parseInt(C.value);
    V && M >= 60 && M <= 240 ? V.Transport.bpm.value = M : C.value = V ? V.Transport.bpm.value : c;
  }), w.forEach((M) => {
    M.addEventListener("change", () => {
      V && N.length > 0 && Q();
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
    const M = setInterval(() => {
      window.Tone && (clearInterval(M), setTimeout(() => {
        H.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(M);
    }, 1e4);
  }
  return g;
}
function dr(s, e = 0.25, t = "nearest") {
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
function Xn(s, { grid: e = 0.25, fields: t = ["time", "duration"], mode: r = "nearest" } = {}) {
  return Array.isArray(s) ? s.map((n) => {
    const i = { ...n };
    return t.forEach((o) => {
      typeof i[o] == "number" && (i[o] = dr(i[o], e, r));
    }), i;
  }) : s;
}
function Zn(s, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !s || !Array.isArray(s.notes) ? s : {
    ...s,
    notes: Xn(s.notes, { grid: e, fields: ["time", "duration"], mode: t })
  };
}
function Co(s, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !s || !Array.isArray(s.tracks) ? s : {
    ...s,
    tracks: s.tracks.map((r) => Zn(r, { grid: e, mode: t }))
  };
}
function ei(s, e = 0.25) {
  const t = Math.round(1 / e), r = Math.round(s / e);
  return r <= 0 || r === t ? "" : r % t === 0 ? String(r / t) : `${r}/${t}`;
}
const Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: ei,
  quantize: dr,
  quantizeComposition: Co,
  quantizeEvents: Xn,
  quantizeTrack: Zn
}, Symbol.toStringTag, { value: "Module" }));
class Io {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new sr(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(e);
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
    const n = e.timeSignature || "4/4", [i, o] = n.split("/").map(Number), a = i * (4 / o), c = t.measuresPerLine || 4, u = t.lineBreaks || [], d = t.renderMode || "merged", v = t.trackIndex || 0, _ = !!t.hideRests, $ = t.showArticulations !== !1, S = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (S.length === 0) return r;
    const g = (() => {
      let p = 0;
      return S.forEach((l) => {
        const f = l.notes || l;
        Array.isArray(f) && f.forEach((m) => {
          const w = typeof m.time == "number" ? m.time : 0, b = typeof m.duration == "number" ? m.duration : 1, P = w + b;
          P > p && (p = P);
        });
      }), p;
    })(), h = Math.max(1, Math.ceil(g / a));
    if (d === "tracks" && S.length > 1)
      r += "%%score {", S.forEach((p, l) => {
        l > 0 && (r += " | "), r += `${l + 1}`;
      }), r += `}
`, S.forEach((p, l) => {
        const f = p.notes || p;
        if (f.length === 0) return;
        const m = l + 1, w = p.label || `Track ${l + 1}`, b = w.length > 12 ? w.substring(0, 10) + ".." : w, P = p.instrument ? ` [${p.instrument}]` : "";
        r += `V:${m} name="${w}${P}" snm="${b}"
`;
        const k = f.filter((x) => x.pitch !== void 0).sort((x, z) => (x.time || 0) - (z.time || 0)), { abcNotesStr: C } = this.convertNotesToAbc(k, a, c, u, { hideRests: _, showArticulations: $, padMeasures: h });
        C.trim() && (r += C + `
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
        for (const k of Object.keys(p))
          if (P.includes(k)) return p[k];
        return "E";
      }, f = [];
      S.forEach((b) => {
        const P = b.notes || b, k = b.label || "", C = l(k);
        (P || []).forEach((x) => {
          x.pitch !== void 0 && f.push({
            time: typeof x.time == "number" ? x.time : 0,
            duration: typeof x.duration == "number" ? x.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: C,
            articulation: x.articulation
          });
        });
      });
      const m = f.sort((b, P) => (b.time || 0) - (P.time || 0)), { abcNotesStr: w } = this.convertNotesToAbc(m, a, c, u, { hideRests: _, showArticulations: $, padMeasures: h });
      w.trim() && (r += w + `
`);
    } else if (d === "single") {
      const p = S[v];
      if (p) {
        const f = (p.notes || p).filter((w) => w.pitch !== void 0).sort((w, b) => (w.time || 0) - (b.time || 0)), { abcNotesStr: m } = this.convertNotesToAbc(f, a, c, u, { hideRests: _, showArticulations: $, padMeasures: h });
        m.trim() && (r += m + `
`);
      }
    } else {
      const p = [];
      S.forEach((m) => {
        (m.notes || m).forEach((b) => {
          b.pitch !== void 0 && p.push(b);
        });
      });
      const l = p.sort((m, w) => (m.time || 0) - (w.time || 0)), { abcNotesStr: f } = this.convertNotesToAbc(l, a, c, u, { hideRests: _, showArticulations: $, padMeasures: h });
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
    const v = options?.quantizeBeats || 0.25, _ = 1e-6, $ = (m) => dr(m, v, "nearest"), S = (m) => ei(m, v), g = (m) => {
      o += m + " ";
    }, h = () => {
      for (; a >= t - 1e-9; )
        g("|"), a -= t, c++, u++, (n.includes(c) || u >= r) && (o += `
`, u = 0);
    }, p = (m, { forceVisible: w = !1 } = {}) => {
      let b = m;
      for (; b > 0; ) {
        const P = t - a, k = $(Math.min(b, P));
        let C = i.hideRests && !w ? "x" : "z";
        C += S(k), g(C), a = $(a + k), h(), b = $(b - k);
      }
    };
    for (const m of e) {
      const w = typeof m.time == "number" ? $(m.time) : 0, b = typeof m.duration == "number" ? $(m.duration) : 1, P = $(w - d);
      P > _ && p(P);
      let k = "z";
      if (typeof m.pitch == "number") {
        const x = m.pitch, z = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], B = Math.floor(x / 12) - 1, L = x % 12;
        k = z[L].replace("#", "^"), B >= 4 ? (k = k.toLowerCase(), B > 4 && (k += "'".repeat(B - 4))) : B < 4 && (k = k.toUpperCase(), B < 3 && (k += ",".repeat(3 - B)));
      } else typeof m.pitch == "string" ? k = m.pitch : m.pitch === null && (k = i.hideRests ? "x" : "z");
      let C = k;
      C += S(b), i.showArticulations && (m.articulation === "staccato" && (C += "."), m.articulation === "accent" && (C += ">"), m.articulation === "tenuto" && (C += "-"), m.articulation === "marcato" && (C += "^")), g(C), a = $(a + b), h(), d = $(w + b);
    }
    const l = i.padMeasures || 0;
    for (; c < l; ) {
      const m = $(t - a);
      m > _ && p(m, { forceVisible: !0 }), g("|"), a = 0, c++;
    }
    const f = o.trim();
    return f && !f.endsWith("|") && (o += "|"), { abcNotesStr: o };
  }
}
function ti(s, e = {}) {
  return Io.convertToAbc(s, e);
}
class hr {
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
          noteName: typeof i.pitch == "number" ? hr.midiToNoteName(i.pitch) : i.pitch,
          time: i.time,
          duration: i.duration,
          velocity: i.velocity || 0.8,
          articulation: i.articulation || null
        }))
      }))
    };
  }
}
function jo(s) {
  return hr.convert(s);
}
function qo(s, e = {}) {
  return {
    sampleRate: e.sampleRate || 44100,
    duration: e.duration || 10,
    channels: e.channels || 1,
    bpm: s.bpm || 120,
    notes: s.tracks?.flatMap((t) => t.notes) || []
  };
}
class Oo {
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
function xo(s) {
  return Oo.convert(s);
}
function Do(s) {
  return new sr().validateAndNormalize(s);
}
function zo(s, e = {}) {
  if (!s || typeof s != "object")
    throw console.error("[RENDER] Invalid JMON object:", s), new Error("render() requires a valid JMON object");
  return !s.sequences && !s.tracks && !s.format && console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), ur(s, e);
}
function Vo(s, e = {}) {
  const t = { autoplay: !1, ...e };
  return ur(s, t);
}
function Fo(s, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: o = {}
  } = e, a = ti(s, o), c = document.createElement("div");
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
    const v = document.createElement("summary");
    v.textContent = "ABC Notation (click to expand)", v.style.cursor = "pointer", d.appendChild(v);
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
      const d = r || null, v = { responsive: i, scale: t };
      d && (v.staffwidth = d), ABCJS.renderAbc(u, a, v), setTimeout(() => {
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
const Lo = {
  // Core functionality
  render: zo,
  play: Vo,
  score: Fo,
  validate: Do,
  // Core formats and players
  createPlayer: ur,
  // Converters
  converters: {
    abc: ti,
    midi: jo,
    tonejs: Qn,
    wav: qo,
    supercollider: xo
  },
  // Theory and algorithms
  theory: Fe.theory,
  generative: Fe.generative,
  analysis: Fe.analysis,
  constants: Fe.constants,
  // Utils
  utils: {
    ...Fe.utils,
    JmonValidator: sr,
    // Expose utility helpers
    quantize: (s, e, t) => Promise.resolve().then(() => Rt).then((r) => r.quantize(s, e, t)),
    quantizeEvents: async (s, e) => (await Promise.resolve().then(() => Rt)).quantizeEvents(s, e),
    quantizeTrack: async (s, e) => (await Promise.resolve().then(() => Rt)).quantizeTrack(s, e),
    quantizeComposition: async (s, e) => (await Promise.resolve().then(() => Rt)).quantizeComposition(s, e),
    // JMON utilities - official format helpers
    jmon: so
  },
  VERSION: "1.0.0"
}, Uo = {
  loops: {
    async plotLoops(s, e = 4, t = 1 / 4, r = null, n = {}) {
      const { LoopVisualizer: i } = await import("./LoopVisualizer-DS22P85c.js");
      return i.plotLoops(s, e, t, r, n);
    }
  }
};
Lo.visualization = Uo;
export {
  Lo as default,
  Lo as jm
};
