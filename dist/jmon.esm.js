function Nn(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var De = { exports: {} }, At = {}, ye = {}, Ee = {}, Rt = {}, Nt = {}, It = {}, Yt;
function $t() {
  return Yt || (Yt = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.regexpCode = s.getEsmExportName = s.getProperty = s.safeStringify = s.stringify = s.strConcat = s.addCodeArg = s.str = s._ = s.nil = s._Code = s.Name = s.IDENTIFIER = s._CodeOrName = void 0;
    class e {
    }
    s._CodeOrName = e, s.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(c) {
        if (super(), !s.IDENTIFIER.test(c))
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
    s.Name = t;
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
        return (c = this._str) !== null && c !== void 0 ? c : this._str = this._items.reduce((h, y) => `${h}${y}`, "");
      }
      get names() {
        var c;
        return (c = this._names) !== null && c !== void 0 ? c : this._names = this._items.reduce((h, y) => (y instanceof t && (h[y.str] = (h[y.str] || 0) + 1), h), {});
      }
    }
    s._Code = r, s.nil = new r("");
    function n(d, ...c) {
      const h = [d[0]];
      let y = 0;
      for (; y < c.length; )
        a(h, c[y]), h.push(d[++y]);
      return new r(h);
    }
    s._ = n;
    const i = new r("+");
    function o(d, ...c) {
      const h = [$(d[0])];
      let y = 0;
      for (; y < c.length; )
        h.push(i), a(h, c[y]), h.push(i, $(d[++y]));
      return l(h), new r(h);
    }
    s.str = o;
    function a(d, c) {
      c instanceof r ? d.push(...c._items) : c instanceof t ? d.push(c) : d.push(w(c));
    }
    s.addCodeArg = a;
    function l(d) {
      let c = 1;
      for (; c < d.length - 1; ) {
        if (d[c] === i) {
          const h = u(d[c - 1], d[c + 1]);
          if (h !== void 0) {
            d.splice(c - 1, 3, h);
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
      return c.emptyStr() ? d : d.emptyStr() ? c : o`${d}${c}`;
    }
    s.strConcat = p;
    function w(d) {
      return typeof d == "number" || typeof d == "boolean" || d === null ? d : $(Array.isArray(d) ? d.join(",") : d);
    }
    function _(d) {
      return new r($(d));
    }
    s.stringify = _;
    function $(d) {
      return JSON.stringify(d).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    s.safeStringify = $;
    function E(d) {
      return typeof d == "string" && s.IDENTIFIER.test(d) ? new r(`.${d}`) : n`[${d}]`;
    }
    s.getProperty = E;
    function b(d) {
      if (typeof d == "string" && s.IDENTIFIER.test(d))
        return new r(`${d}`);
      throw new Error(`CodeGen: invalid export name: ${d}, use explicit $id name mapping`);
    }
    s.getEsmExportName = b;
    function f(d) {
      return new r(d.toString());
    }
    s.regexpCode = f;
  })(It)), It;
}
var Ct = {}, Xt;
function Qt() {
  return Xt || (Xt = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.ValueScope = s.ValueScopeName = s.Scope = s.varKinds = s.UsedValueState = void 0;
    const e = $t();
    class t extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var r;
    (function(l) {
      l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
    })(r || (s.UsedValueState = r = {})), s.varKinds = {
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
    s.Scope = n;
    class i extends e.Name {
      constructor(u, p) {
        super(p), this.prefix = u;
      }
      setValue(u, { property: p, itemIndex: w }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(p)}[${w}]`;
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
      value(u, p) {
        var w;
        if (p.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(u), { prefix: $ } = _, E = (w = p.key) !== null && w !== void 0 ? w : p.ref;
        let b = this._values[$];
        if (b) {
          const c = b.get(E);
          if (c)
            return c;
        } else
          b = this._values[$] = /* @__PURE__ */ new Map();
        b.set(E, _);
        const f = this._scope[$] || (this._scope[$] = []), d = f.length;
        return f[d] = p.ref, _.setValue(p, { property: $, itemIndex: d }), _;
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
        let $ = e.nil;
        for (const E in u) {
          const b = u[E];
          if (!b)
            continue;
          const f = w[E] = w[E] || /* @__PURE__ */ new Map();
          b.forEach((d) => {
            if (f.has(d))
              return;
            f.set(d, r.Started);
            let c = p(d);
            if (c) {
              const h = this.opts.es5 ? s.varKinds.var : s.varKinds.const;
              $ = (0, e._)`${$}${h} ${d} = ${c};${this.opts._n}`;
            } else if (c = _?.(d))
              $ = (0, e._)`${$}${c}${this.opts._n}`;
            else
              throw new t(d);
            f.set(d, r.Completed);
          });
        }
        return $;
      }
    }
    s.ValueScope = a;
  })(Ct)), Ct;
}
var Zt;
function X() {
  return Zt || (Zt = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.or = s.and = s.not = s.CodeGen = s.operators = s.varKinds = s.ValueScopeName = s.ValueScope = s.Scope = s.Name = s.regexpCode = s.stringify = s.getProperty = s.nil = s.strConcat = s.str = s._ = void 0;
    const e = $t(), t = Qt();
    var r = $t();
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
    var n = Qt();
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
      optimizeNames(m, P) {
        return this;
      }
    }
    class o extends i {
      constructor(m, P, N) {
        super(), this.varKind = m, this.name = P, this.rhs = N;
      }
      render({ es5: m, _n: P }) {
        const N = m ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${N} ${this.name}${F};` + P;
      }
      optimizeNames(m, P) {
        if (m[this.name.str])
          return this.rhs && (this.rhs = Y(this.rhs, m, P)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(m, P, N) {
        super(), this.lhs = m, this.rhs = P, this.sideEffects = N;
      }
      render({ _n: m }) {
        return `${this.lhs} = ${this.rhs};` + m;
      }
      optimizeNames(m, P) {
        if (!(this.lhs instanceof e.Name && !m[this.lhs.str] && !this.sideEffects))
          return this.rhs = Y(this.rhs, m, P), this;
      }
      get names() {
        const m = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return U(m, this.rhs);
      }
    }
    class l extends a {
      constructor(m, P, N, F) {
        super(m, N, F), this.op = P;
      }
      render({ _n: m }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + m;
      }
    }
    class u extends i {
      constructor(m) {
        super(), this.label = m, this.names = {};
      }
      render({ _n: m }) {
        return `${this.label}:` + m;
      }
    }
    class p extends i {
      constructor(m) {
        super(), this.label = m, this.names = {};
      }
      render({ _n: m }) {
        return `break${this.label ? ` ${this.label}` : ""};` + m;
      }
    }
    class w extends i {
      constructor(m) {
        super(), this.error = m;
      }
      render({ _n: m }) {
        return `throw ${this.error};` + m;
      }
      get names() {
        return this.error.names;
      }
    }
    class _ extends i {
      constructor(m) {
        super(), this.code = m;
      }
      render({ _n: m }) {
        return `${this.code};` + m;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(m, P) {
        return this.code = Y(this.code, m, P), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class $ extends i {
      constructor(m = []) {
        super(), this.nodes = m;
      }
      render(m) {
        return this.nodes.reduce((P, N) => P + N.render(m), "");
      }
      optimizeNodes() {
        const { nodes: m } = this;
        let P = m.length;
        for (; P--; ) {
          const N = m[P].optimizeNodes();
          Array.isArray(N) ? m.splice(P, 1, ...N) : N ? m[P] = N : m.splice(P, 1);
        }
        return m.length > 0 ? this : void 0;
      }
      optimizeNames(m, P) {
        const { nodes: N } = this;
        let F = N.length;
        for (; F--; ) {
          const z = N[F];
          z.optimizeNames(m, P) || (ne(m, z.names), N.splice(F, 1));
        }
        return N.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((m, P) => B(m, P.names), {});
      }
    }
    class E extends $ {
      render(m) {
        return "{" + m._n + super.render(m) + "}" + m._n;
      }
    }
    class b extends $ {
    }
    class f extends E {
    }
    f.kind = "else";
    class d extends E {
      constructor(m, P) {
        super(P), this.condition = m;
      }
      render(m) {
        let P = `if(${this.condition})` + super.render(m);
        return this.else && (P += "else " + this.else.render(m)), P;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const m = this.condition;
        if (m === !0)
          return this.nodes;
        let P = this.else;
        if (P) {
          const N = P.optimizeNodes();
          P = this.else = Array.isArray(N) ? new f(N) : N;
        }
        if (P)
          return m === !1 ? P instanceof d ? P : P.nodes : this.nodes.length ? this : new d(ce(m), P instanceof d ? [P] : P.nodes);
        if (!(m === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(m, P) {
        var N;
        if (this.else = (N = this.else) === null || N === void 0 ? void 0 : N.optimizeNames(m, P), !!(super.optimizeNames(m, P) || this.else))
          return this.condition = Y(this.condition, m, P), this;
      }
      get names() {
        const m = super.names;
        return U(m, this.condition), this.else && B(m, this.else.names), m;
      }
    }
    d.kind = "if";
    class c extends E {
    }
    c.kind = "for";
    class h extends c {
      constructor(m) {
        super(), this.iteration = m;
      }
      render(m) {
        return `for(${this.iteration})` + super.render(m);
      }
      optimizeNames(m, P) {
        if (super.optimizeNames(m, P))
          return this.iteration = Y(this.iteration, m, P), this;
      }
      get names() {
        return B(super.names, this.iteration.names);
      }
    }
    class y extends c {
      constructor(m, P, N, F) {
        super(), this.varKind = m, this.name = P, this.from = N, this.to = F;
      }
      render(m) {
        const P = m.es5 ? t.varKinds.var : this.varKind, { name: N, from: F, to: z } = this;
        return `for(${P} ${N}=${F}; ${N}<${z}; ${N}++)` + super.render(m);
      }
      get names() {
        const m = U(super.names, this.from);
        return U(m, this.to);
      }
    }
    class v extends c {
      constructor(m, P, N, F) {
        super(), this.loop = m, this.varKind = P, this.name = N, this.iterable = F;
      }
      render(m) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(m);
      }
      optimizeNames(m, P) {
        if (super.optimizeNames(m, P))
          return this.iterable = Y(this.iterable, m, P), this;
      }
      get names() {
        return B(super.names, this.iterable.names);
      }
    }
    class g extends E {
      constructor(m, P, N) {
        super(), this.name = m, this.args = P, this.async = N;
      }
      render(m) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(m);
      }
    }
    g.kind = "func";
    class S extends $ {
      render(m) {
        return "return " + super.render(m);
      }
    }
    S.kind = "return";
    class A extends E {
      render(m) {
        let P = "try" + super.render(m);
        return this.catch && (P += this.catch.render(m)), this.finally && (P += this.finally.render(m)), P;
      }
      optimizeNodes() {
        var m, P;
        return super.optimizeNodes(), (m = this.catch) === null || m === void 0 || m.optimizeNodes(), (P = this.finally) === null || P === void 0 || P.optimizeNodes(), this;
      }
      optimizeNames(m, P) {
        var N, F;
        return super.optimizeNames(m, P), (N = this.catch) === null || N === void 0 || N.optimizeNames(m, P), (F = this.finally) === null || F === void 0 || F.optimizeNames(m, P), this;
      }
      get names() {
        const m = super.names;
        return this.catch && B(m, this.catch.names), this.finally && B(m, this.finally.names), m;
      }
    }
    class j extends E {
      constructor(m) {
        super(), this.error = m;
      }
      render(m) {
        return `catch(${this.error})` + super.render(m);
      }
    }
    j.kind = "catch";
    class D extends E {
      render(m) {
        return "finally" + super.render(m);
      }
    }
    D.kind = "finally";
    class V {
      constructor(m, P = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...P, _n: P.lines ? `
` : "" }, this._extScope = m, this._scope = new t.Scope({ parent: m }), this._nodes = [new b()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(m) {
        return this._scope.name(m);
      }
      // reserves unique name in the external scope
      scopeName(m) {
        return this._extScope.name(m);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(m, P) {
        const N = this._extScope.value(m, P);
        return (this._values[N.prefix] || (this._values[N.prefix] = /* @__PURE__ */ new Set())).add(N), N;
      }
      getScopeValue(m, P) {
        return this._extScope.getValue(m, P);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(m) {
        return this._extScope.scopeRefs(m, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(m, P, N, F) {
        const z = this._scope.toName(P);
        return N !== void 0 && F && (this._constants[z.str] = N), this._leafNode(new o(m, z, N)), z;
      }
      // `const` declaration (`var` in es5 mode)
      const(m, P, N) {
        return this._def(t.varKinds.const, m, P, N);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(m, P, N) {
        return this._def(t.varKinds.let, m, P, N);
      }
      // `var` declaration with optional assignment
      var(m, P, N) {
        return this._def(t.varKinds.var, m, P, N);
      }
      // assignment code
      assign(m, P, N) {
        return this._leafNode(new a(m, P, N));
      }
      // `+=` code
      add(m, P) {
        return this._leafNode(new l(m, s.operators.ADD, P));
      }
      // appends passed SafeExpr to code or executes Block
      code(m) {
        return typeof m == "function" ? m() : m !== e.nil && this._leafNode(new _(m)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...m) {
        const P = ["{"];
        for (const [N, F] of m)
          P.length > 1 && P.push(","), P.push(N), (N !== F || this.opts.es5) && (P.push(":"), (0, e.addCodeArg)(P, F));
        return P.push("}"), new e._Code(P);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(m, P, N) {
        if (this._blockNode(new d(m)), P && N)
          this.code(P).else().code(N).endIf();
        else if (P)
          this.code(P).endIf();
        else if (N)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(m) {
        return this._elseNode(new d(m));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(d, f);
      }
      _for(m, P) {
        return this._blockNode(m), P && this.code(P).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(m, P) {
        return this._for(new h(m), P);
      }
      // `for` statement for a range of values
      forRange(m, P, N, F, z = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const J = this._scope.toName(m);
        return this._for(new y(z, J, P, N), () => F(J));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(m, P, N, F = t.varKinds.const) {
        const z = this._scope.toName(m);
        if (this.opts.es5) {
          const J = P instanceof e.Name ? P : this.var("_arr", P);
          return this.forRange("_i", 0, (0, e._)`${J}.length`, (H) => {
            this.var(z, (0, e._)`${J}[${H}]`), N(z);
          });
        }
        return this._for(new v("of", F, z, P), () => N(z));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(m, P, N, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(m, (0, e._)`Object.keys(${P})`, N);
        const z = this._scope.toName(m);
        return this._for(new v("in", F, z, P), () => N(z));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(c);
      }
      // `label` statement
      label(m) {
        return this._leafNode(new u(m));
      }
      // `break` statement
      break(m) {
        return this._leafNode(new p(m));
      }
      // `return` statement
      return(m) {
        const P = new S();
        if (this._blockNode(P), this.code(m), P.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(S);
      }
      // `try` statement
      try(m, P, N) {
        if (!P && !N)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new A();
        if (this._blockNode(F), this.code(m), P) {
          const z = this.name("e");
          this._currNode = F.catch = new j(z), P(z);
        }
        return N && (this._currNode = F.finally = new D(), this.code(N)), this._endBlockNode(j, D);
      }
      // `throw` statement
      throw(m) {
        return this._leafNode(new w(m));
      }
      // start self-balancing block
      block(m, P) {
        return this._blockStarts.push(this._nodes.length), m && this.code(m).endBlock(P), this;
      }
      // end the current self-balancing block
      endBlock(m) {
        const P = this._blockStarts.pop();
        if (P === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const N = this._nodes.length - P;
        if (N < 0 || m !== void 0 && N !== m)
          throw new Error(`CodeGen: wrong number of nodes: ${N} vs ${m} expected`);
        return this._nodes.length = P, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(m, P = e.nil, N, F) {
        return this._blockNode(new g(m, P, N)), F && this.code(F).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(g);
      }
      optimize(m = 1) {
        for (; m-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(m) {
        return this._currNode.nodes.push(m), this;
      }
      _blockNode(m) {
        this._currNode.nodes.push(m), this._nodes.push(m);
      }
      _endBlockNode(m, P) {
        const N = this._currNode;
        if (N instanceof m || P && N instanceof P)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${P ? `${m.kind}/${P.kind}` : m.kind}"`);
      }
      _elseNode(m) {
        const P = this._currNode;
        if (!(P instanceof d))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = P.else = m, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const m = this._nodes;
        return m[m.length - 1];
      }
      set _currNode(m) {
        const P = this._nodes;
        P[P.length - 1] = m;
      }
    }
    s.CodeGen = V;
    function B(R, m) {
      for (const P in m)
        R[P] = (R[P] || 0) + (m[P] || 0);
      return R;
    }
    function U(R, m) {
      return m instanceof e._CodeOrName ? B(R, m.names) : R;
    }
    function Y(R, m, P) {
      if (R instanceof e.Name)
        return N(R);
      if (!F(R))
        return R;
      return new e._Code(R._items.reduce((z, J) => (J instanceof e.Name && (J = N(J)), J instanceof e._Code ? z.push(...J._items) : z.push(J), z), []));
      function N(z) {
        const J = P[z.str];
        return J === void 0 || m[z.str] !== 1 ? z : (delete m[z.str], J);
      }
      function F(z) {
        return z instanceof e._Code && z._items.some((J) => J instanceof e.Name && m[J.str] === 1 && P[J.str] !== void 0);
      }
    }
    function ne(R, m) {
      for (const P in m)
        R[P] = (R[P] || 0) - (m[P] || 0);
    }
    function ce(R) {
      return typeof R == "boolean" || typeof R == "number" || R === null ? !R : (0, e._)`!${C(R)}`;
    }
    s.not = ce;
    const de = k(s.operators.AND);
    function x(...R) {
      return R.reduce(de);
    }
    s.and = x;
    const ae = k(s.operators.OR);
    function q(...R) {
      return R.reduce(ae);
    }
    s.or = q;
    function k(R) {
      return (m, P) => m === e.nil ? P : P === e.nil ? m : (0, e._)`${C(m)} ${R} ${C(P)}`;
    }
    function C(R) {
      return R instanceof e.Name ? R : (0, e._)`(${R})`;
    }
  })(Nt)), Nt;
}
var W = {}, er;
function ee() {
  if (er) return W;
  er = 1, Object.defineProperty(W, "__esModule", { value: !0 }), W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
  const s = X(), e = $t();
  function t(v) {
    const g = {};
    for (const S of v)
      g[S] = !0;
    return g;
  }
  W.toHash = t;
  function r(v, g) {
    return typeof g == "boolean" ? g : Object.keys(g).length === 0 ? !0 : (n(v, g), !i(g, v.self.RULES.all));
  }
  W.alwaysValidSchema = r;
  function n(v, g = v.schema) {
    const { opts: S, self: A } = v;
    if (!S.strictSchema || typeof g == "boolean")
      return;
    const j = A.RULES.keywords;
    for (const D in g)
      j[D] || y(v, `unknown keyword: "${D}"`);
  }
  W.checkUnknownRules = n;
  function i(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const S in v)
      if (g[S])
        return !0;
    return !1;
  }
  W.schemaHasRules = i;
  function o(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const S in v)
      if (S !== "$ref" && g.all[S])
        return !0;
    return !1;
  }
  W.schemaHasRulesButRef = o;
  function a({ topSchemaRef: v, schemaPath: g }, S, A, j) {
    if (!j) {
      if (typeof S == "number" || typeof S == "boolean")
        return S;
      if (typeof S == "string")
        return (0, s._)`${S}`;
    }
    return (0, s._)`${v}${g}${(0, s.getProperty)(A)}`;
  }
  W.schemaRefOrVal = a;
  function l(v) {
    return w(decodeURIComponent(v));
  }
  W.unescapeFragment = l;
  function u(v) {
    return encodeURIComponent(p(v));
  }
  W.escapeFragment = u;
  function p(v) {
    return typeof v == "number" ? `${v}` : v.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  W.escapeJsonPointer = p;
  function w(v) {
    return v.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  W.unescapeJsonPointer = w;
  function _(v, g) {
    if (Array.isArray(v))
      for (const S of v)
        g(S);
    else
      g(v);
  }
  W.eachItem = _;
  function $({ mergeNames: v, mergeToName: g, mergeValues: S, resultToName: A }) {
    return (j, D, V, B) => {
      const U = V === void 0 ? D : V instanceof s.Name ? (D instanceof s.Name ? v(j, D, V) : g(j, D, V), V) : D instanceof s.Name ? (g(j, V, D), D) : S(D, V);
      return B === s.Name && !(U instanceof s.Name) ? A(j, U) : U;
    };
  }
  W.mergeEvaluated = {
    props: $({
      mergeNames: (v, g, S) => v.if((0, s._)`${S} !== true && ${g} !== undefined`, () => {
        v.if((0, s._)`${g} === true`, () => v.assign(S, !0), () => v.assign(S, (0, s._)`${S} || {}`).code((0, s._)`Object.assign(${S}, ${g})`));
      }),
      mergeToName: (v, g, S) => v.if((0, s._)`${S} !== true`, () => {
        g === !0 ? v.assign(S, !0) : (v.assign(S, (0, s._)`${S} || {}`), b(v, S, g));
      }),
      mergeValues: (v, g) => v === !0 ? !0 : { ...v, ...g },
      resultToName: E
    }),
    items: $({
      mergeNames: (v, g, S) => v.if((0, s._)`${S} !== true && ${g} !== undefined`, () => v.assign(S, (0, s._)`${g} === true ? true : ${S} > ${g} ? ${S} : ${g}`)),
      mergeToName: (v, g, S) => v.if((0, s._)`${S} !== true`, () => v.assign(S, g === !0 ? !0 : (0, s._)`${S} > ${g} ? ${S} : ${g}`)),
      mergeValues: (v, g) => v === !0 ? !0 : Math.max(v, g),
      resultToName: (v, g) => v.var("items", g)
    })
  };
  function E(v, g) {
    if (g === !0)
      return v.var("props", !0);
    const S = v.var("props", (0, s._)`{}`);
    return g !== void 0 && b(v, S, g), S;
  }
  W.evaluatedPropsToName = E;
  function b(v, g, S) {
    Object.keys(S).forEach((A) => v.assign((0, s._)`${g}${(0, s.getProperty)(A)}`, !0));
  }
  W.setEvaluated = b;
  const f = {};
  function d(v, g) {
    return v.scopeValue("func", {
      ref: g,
      code: f[g.code] || (f[g.code] = new e._Code(g.code))
    });
  }
  W.useFunc = d;
  var c;
  (function(v) {
    v[v.Num = 0] = "Num", v[v.Str = 1] = "Str";
  })(c || (W.Type = c = {}));
  function h(v, g, S) {
    if (v instanceof s.Name) {
      const A = g === c.Num;
      return S ? A ? (0, s._)`"[" + ${v} + "]"` : (0, s._)`"['" + ${v} + "']"` : A ? (0, s._)`"/" + ${v}` : (0, s._)`"/" + ${v}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return S ? (0, s.getProperty)(v).toString() : "/" + p(v);
  }
  W.getErrorPath = h;
  function y(v, g, S = v.opts.strictSchema) {
    if (S) {
      if (g = `strict mode: ${g}`, S === !0)
        throw new Error(g);
      v.self.logger.warn(g);
    }
  }
  return W.checkStrictMode = y, W;
}
var xe = {}, tr;
function _e() {
  if (tr) return xe;
  tr = 1, Object.defineProperty(xe, "__esModule", { value: !0 });
  const s = X(), e = {
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
  return xe.default = e, xe;
}
var rr;
function St() {
  return rr || (rr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.extendErrors = s.resetErrorsCount = s.reportExtraError = s.reportError = s.keyword$DataError = s.keywordError = void 0;
    const e = X(), t = ee(), r = _e();
    s.keywordError = {
      message: ({ keyword: f }) => (0, e.str)`must pass "${f}" keyword validation`
    }, s.keyword$DataError = {
      message: ({ keyword: f, schemaType: d }) => d ? (0, e.str)`"${f}" keyword must be ${d} ($data)` : (0, e.str)`"${f}" keyword is invalid ($data)`
    };
    function n(f, d = s.keywordError, c, h) {
      const { it: y } = f, { gen: v, compositeRule: g, allErrors: S } = y, A = w(f, d, c);
      h ?? (g || S) ? l(v, A) : u(y, (0, e._)`[${A}]`);
    }
    s.reportError = n;
    function i(f, d = s.keywordError, c) {
      const { it: h } = f, { gen: y, compositeRule: v, allErrors: g } = h, S = w(f, d, c);
      l(y, S), v || g || u(h, r.default.vErrors);
    }
    s.reportExtraError = i;
    function o(f, d) {
      f.assign(r.default.errors, d), f.if((0, e._)`${r.default.vErrors} !== null`, () => f.if(d, () => f.assign((0, e._)`${r.default.vErrors}.length`, d), () => f.assign(r.default.vErrors, null)));
    }
    s.resetErrorsCount = o;
    function a({ gen: f, keyword: d, schemaValue: c, data: h, errsCount: y, it: v }) {
      if (y === void 0)
        throw new Error("ajv implementation error");
      const g = f.name("err");
      f.forRange("i", y, r.default.errors, (S) => {
        f.const(g, (0, e._)`${r.default.vErrors}[${S}]`), f.if((0, e._)`${g}.instancePath === undefined`, () => f.assign((0, e._)`${g}.instancePath`, (0, e.strConcat)(r.default.instancePath, v.errorPath))), f.assign((0, e._)`${g}.schemaPath`, (0, e.str)`${v.errSchemaPath}/${d}`), v.opts.verbose && (f.assign((0, e._)`${g}.schema`, c), f.assign((0, e._)`${g}.data`, h));
      });
    }
    s.extendErrors = a;
    function l(f, d) {
      const c = f.const("err", d);
      f.if((0, e._)`${r.default.vErrors} === null`, () => f.assign(r.default.vErrors, (0, e._)`[${c}]`), (0, e._)`${r.default.vErrors}.push(${c})`), f.code((0, e._)`${r.default.errors}++`);
    }
    function u(f, d) {
      const { gen: c, validateName: h, schemaEnv: y } = f;
      y.$async ? c.throw((0, e._)`new ${f.ValidationError}(${d})`) : (c.assign((0, e._)`${h}.errors`, d), c.return(!1));
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
    function w(f, d, c) {
      const { createErrors: h } = f.it;
      return h === !1 ? (0, e._)`{}` : _(f, d, c);
    }
    function _(f, d, c = {}) {
      const { gen: h, it: y } = f, v = [
        $(y, c),
        E(f, c)
      ];
      return b(f, d, v), h.object(...v);
    }
    function $({ errorPath: f }, { instancePath: d }) {
      const c = d ? (0, e.str)`${f}${(0, t.getErrorPath)(d, t.Type.Str)}` : f;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, c)];
    }
    function E({ keyword: f, it: { errSchemaPath: d } }, { schemaPath: c, parentSchema: h }) {
      let y = h ? d : (0, e.str)`${d}/${f}`;
      return c && (y = (0, e.str)`${y}${(0, t.getErrorPath)(c, t.Type.Str)}`), [p.schemaPath, y];
    }
    function b(f, { params: d, message: c }, h) {
      const { keyword: y, data: v, schemaValue: g, it: S } = f, { opts: A, propertyName: j, topSchemaRef: D, schemaPath: V } = S;
      h.push([p.keyword, y], [p.params, typeof d == "function" ? d(f) : d || (0, e._)`{}`]), A.messages && h.push([p.message, typeof c == "function" ? c(f) : c]), A.verbose && h.push([p.schema, g], [p.parentSchema, (0, e._)`${D}${V}`], [r.default.data, v]), j && h.push([p.propertyName, j]);
    }
  })(Rt)), Rt;
}
var nr;
function In() {
  if (nr) return Ee;
  nr = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.boolOrEmptySchema = Ee.topBoolOrEmptySchema = void 0;
  const s = St(), e = X(), t = _e(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: l, schema: u, validateName: p } = a;
    u === !1 ? o(a, !1) : typeof u == "object" && u.$async === !0 ? l.return(t.default.data) : (l.assign((0, e._)`${p}.errors`, null), l.return(!0));
  }
  Ee.topBoolOrEmptySchema = n;
  function i(a, l) {
    const { gen: u, schema: p } = a;
    p === !1 ? (u.var(l, !1), o(a)) : u.var(l, !0);
  }
  Ee.boolOrEmptySchema = i;
  function o(a, l) {
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
    (0, s.reportError)(w, r, void 0, l);
  }
  return Ee;
}
var oe = {}, Me = {}, ir;
function pn() {
  if (ir) return Me;
  ir = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.getRules = Me.isJSONType = void 0;
  const s = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(s);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  Me.isJSONType = t;
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
  return Me.getRules = r, Me;
}
var ge = {}, sr;
function mn() {
  if (sr) return ge;
  sr = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.shouldUseRule = ge.shouldUseGroup = ge.schemaHasRulesForType = void 0;
  function s({ schema: r, self: n }, i) {
    const o = n.RULES.types[i];
    return o && o !== !0 && e(r, o);
  }
  ge.schemaHasRulesForType = s;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  ge.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((o) => r[o] !== void 0));
  }
  return ge.shouldUseRule = t, ge;
}
var or;
function _t() {
  if (or) return oe;
  or = 1, Object.defineProperty(oe, "__esModule", { value: !0 }), oe.reportTypeError = oe.checkDataTypes = oe.checkDataType = oe.coerceAndCheckDataType = oe.getJSONTypes = oe.getSchemaTypes = oe.DataType = void 0;
  const s = pn(), e = mn(), t = St(), r = X(), n = ee();
  var i;
  (function(c) {
    c[c.Correct = 0] = "Correct", c[c.Wrong = 1] = "Wrong";
  })(i || (oe.DataType = i = {}));
  function o(c) {
    const h = a(c.type);
    if (h.includes("null")) {
      if (c.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!h.length && c.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      c.nullable === !0 && h.push("null");
    }
    return h;
  }
  oe.getSchemaTypes = o;
  function a(c) {
    const h = Array.isArray(c) ? c : c ? [c] : [];
    if (h.every(s.isJSONType))
      return h;
    throw new Error("type must be JSONType or JSONType[]: " + h.join(","));
  }
  oe.getJSONTypes = a;
  function l(c, h) {
    const { gen: y, data: v, opts: g } = c, S = p(h, g.coerceTypes), A = h.length > 0 && !(S.length === 0 && h.length === 1 && (0, e.schemaHasRulesForType)(c, h[0]));
    if (A) {
      const j = E(h, v, g.strictNumbers, i.Wrong);
      y.if(j, () => {
        S.length ? w(c, h, S) : f(c);
      });
    }
    return A;
  }
  oe.coerceAndCheckDataType = l;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function p(c, h) {
    return h ? c.filter((y) => u.has(y) || h === "array" && y === "array") : [];
  }
  function w(c, h, y) {
    const { gen: v, data: g, opts: S } = c, A = v.let("dataType", (0, r._)`typeof ${g}`), j = v.let("coerced", (0, r._)`undefined`);
    S.coerceTypes === "array" && v.if((0, r._)`${A} == 'object' && Array.isArray(${g}) && ${g}.length == 1`, () => v.assign(g, (0, r._)`${g}[0]`).assign(A, (0, r._)`typeof ${g}`).if(E(h, g, S.strictNumbers), () => v.assign(j, g))), v.if((0, r._)`${j} !== undefined`);
    for (const V of y)
      (u.has(V) || V === "array" && S.coerceTypes === "array") && D(V);
    v.else(), f(c), v.endIf(), v.if((0, r._)`${j} !== undefined`, () => {
      v.assign(g, j), _(c, j);
    });
    function D(V) {
      switch (V) {
        case "string":
          v.elseIf((0, r._)`${A} == "number" || ${A} == "boolean"`).assign(j, (0, r._)`"" + ${g}`).elseIf((0, r._)`${g} === null`).assign(j, (0, r._)`""`);
          return;
        case "number":
          v.elseIf((0, r._)`${A} == "boolean" || ${g} === null
              || (${A} == "string" && ${g} && ${g} == +${g})`).assign(j, (0, r._)`+${g}`);
          return;
        case "integer":
          v.elseIf((0, r._)`${A} === "boolean" || ${g} === null
              || (${A} === "string" && ${g} && ${g} == +${g} && !(${g} % 1))`).assign(j, (0, r._)`+${g}`);
          return;
        case "boolean":
          v.elseIf((0, r._)`${g} === "false" || ${g} === 0 || ${g} === null`).assign(j, !1).elseIf((0, r._)`${g} === "true" || ${g} === 1`).assign(j, !0);
          return;
        case "null":
          v.elseIf((0, r._)`${g} === "" || ${g} === 0 || ${g} === false`), v.assign(j, null);
          return;
        case "array":
          v.elseIf((0, r._)`${A} === "string" || ${A} === "number"
              || ${A} === "boolean" || ${g} === null`).assign(j, (0, r._)`[${g}]`);
      }
    }
  }
  function _({ gen: c, parentData: h, parentDataProperty: y }, v) {
    c.if((0, r._)`${h} !== undefined`, () => c.assign((0, r._)`${h}[${y}]`, v));
  }
  function $(c, h, y, v = i.Correct) {
    const g = v === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let S;
    switch (c) {
      case "null":
        return (0, r._)`${h} ${g} null`;
      case "array":
        S = (0, r._)`Array.isArray(${h})`;
        break;
      case "object":
        S = (0, r._)`${h} && typeof ${h} == "object" && !Array.isArray(${h})`;
        break;
      case "integer":
        S = A((0, r._)`!(${h} % 1) && !isNaN(${h})`);
        break;
      case "number":
        S = A();
        break;
      default:
        return (0, r._)`typeof ${h} ${g} ${c}`;
    }
    return v === i.Correct ? S : (0, r.not)(S);
    function A(j = r.nil) {
      return (0, r.and)((0, r._)`typeof ${h} == "number"`, j, y ? (0, r._)`isFinite(${h})` : r.nil);
    }
  }
  oe.checkDataType = $;
  function E(c, h, y, v) {
    if (c.length === 1)
      return $(c[0], h, y, v);
    let g;
    const S = (0, n.toHash)(c);
    if (S.array && S.object) {
      const A = (0, r._)`typeof ${h} != "object"`;
      g = S.null ? A : (0, r._)`!${h} || ${A}`, delete S.null, delete S.array, delete S.object;
    } else
      g = r.nil;
    S.number && delete S.integer;
    for (const A in S)
      g = (0, r.and)(g, $(A, h, y, v));
    return g;
  }
  oe.checkDataTypes = E;
  const b = {
    message: ({ schema: c }) => `must be ${c}`,
    params: ({ schema: c, schemaValue: h }) => typeof c == "string" ? (0, r._)`{type: ${c}}` : (0, r._)`{type: ${h}}`
  };
  function f(c) {
    const h = d(c);
    (0, t.reportError)(h, b);
  }
  oe.reportTypeError = f;
  function d(c) {
    const { gen: h, data: y, schema: v } = c, g = (0, n.schemaRefOrVal)(c, v, "type");
    return {
      gen: h,
      keyword: "type",
      data: y,
      schema: v.type,
      schemaCode: g,
      schemaValue: g,
      parentSchema: v,
      params: {},
      it: c
    };
  }
  return oe;
}
var Ce = {}, ar;
function Cn() {
  if (ar) return Ce;
  ar = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.assignDefaults = void 0;
  const s = X(), e = ee();
  function t(n, i) {
    const { properties: o, items: a } = n.schema;
    if (i === "object" && o)
      for (const l in o)
        r(n, l, o[l].default);
    else i === "array" && Array.isArray(a) && a.forEach((l, u) => r(n, u, l.default));
  }
  Ce.assignDefaults = t;
  function r(n, i, o) {
    const { gen: a, compositeRule: l, data: u, opts: p } = n;
    if (o === void 0)
      return;
    const w = (0, s._)`${u}${(0, s.getProperty)(i)}`;
    if (l) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${w}`);
      return;
    }
    let _ = (0, s._)`${w} === undefined`;
    p.useDefaults === "empty" && (_ = (0, s._)`${_} || ${w} === null || ${w} === ""`), a.if(_, (0, s._)`${w} = ${(0, s.stringify)(o)}`);
  }
  return Ce;
}
var pe = {}, te = {}, cr;
function me() {
  if (cr) return te;
  cr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const s = X(), e = ee(), t = _e(), r = ee();
  function n(c, h) {
    const { gen: y, data: v, it: g } = c;
    y.if(p(y, v, h, g.opts.ownProperties), () => {
      c.setParams({ missingProperty: (0, s._)`${h}` }, !0), c.error();
    });
  }
  te.checkReportMissingProp = n;
  function i({ gen: c, data: h, it: { opts: y } }, v, g) {
    return (0, s.or)(...v.map((S) => (0, s.and)(p(c, h, S, y.ownProperties), (0, s._)`${g} = ${S}`)));
  }
  te.checkMissingProp = i;
  function o(c, h) {
    c.setParams({ missingProperty: h }, !0), c.error();
  }
  te.reportMissingProp = o;
  function a(c) {
    return c.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, s._)`Object.prototype.hasOwnProperty`
    });
  }
  te.hasPropFunc = a;
  function l(c, h, y) {
    return (0, s._)`${a(c)}.call(${h}, ${y})`;
  }
  te.isOwnProperty = l;
  function u(c, h, y, v) {
    const g = (0, s._)`${h}${(0, s.getProperty)(y)} !== undefined`;
    return v ? (0, s._)`${g} && ${l(c, h, y)}` : g;
  }
  te.propertyInData = u;
  function p(c, h, y, v) {
    const g = (0, s._)`${h}${(0, s.getProperty)(y)} === undefined`;
    return v ? (0, s.or)(g, (0, s.not)(l(c, h, y))) : g;
  }
  te.noPropertyInData = p;
  function w(c) {
    return c ? Object.keys(c).filter((h) => h !== "__proto__") : [];
  }
  te.allSchemaProperties = w;
  function _(c, h) {
    return w(h).filter((y) => !(0, e.alwaysValidSchema)(c, h[y]));
  }
  te.schemaProperties = _;
  function $({ schemaCode: c, data: h, it: { gen: y, topSchemaRef: v, schemaPath: g, errorPath: S }, it: A }, j, D, V) {
    const B = V ? (0, s._)`${c}, ${h}, ${v}${g}` : h, U = [
      [t.default.instancePath, (0, s.strConcat)(t.default.instancePath, S)],
      [t.default.parentData, A.parentData],
      [t.default.parentDataProperty, A.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    A.opts.dynamicRef && U.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const Y = (0, s._)`${B}, ${y.object(...U)}`;
    return D !== s.nil ? (0, s._)`${j}.call(${D}, ${Y})` : (0, s._)`${j}(${Y})`;
  }
  te.callValidateCode = $;
  const E = (0, s._)`new RegExp`;
  function b({ gen: c, it: { opts: h } }, y) {
    const v = h.unicodeRegExp ? "u" : "", { regExp: g } = h.code, S = g(y, v);
    return c.scopeValue("pattern", {
      key: S.toString(),
      ref: S,
      code: (0, s._)`${g.code === "new RegExp" ? E : (0, r.useFunc)(c, g)}(${y}, ${v})`
    });
  }
  te.usePattern = b;
  function f(c) {
    const { gen: h, data: y, keyword: v, it: g } = c, S = h.name("valid");
    if (g.allErrors) {
      const j = h.let("valid", !0);
      return A(() => h.assign(j, !1)), j;
    }
    return h.var(S, !0), A(() => h.break()), S;
    function A(j) {
      const D = h.const("len", (0, s._)`${y}.length`);
      h.forRange("i", 0, D, (V) => {
        c.subschema({
          keyword: v,
          dataProp: V,
          dataPropType: e.Type.Num
        }, S), h.if((0, s.not)(S), j);
      });
    }
  }
  te.validateArray = f;
  function d(c) {
    const { gen: h, schema: y, keyword: v, it: g } = c;
    if (!Array.isArray(y))
      throw new Error("ajv implementation error");
    if (y.some((D) => (0, e.alwaysValidSchema)(g, D)) && !g.opts.unevaluated)
      return;
    const A = h.let("valid", !1), j = h.name("_valid");
    h.block(() => y.forEach((D, V) => {
      const B = c.subschema({
        keyword: v,
        schemaProp: V,
        compositeRule: !0
      }, j);
      h.assign(A, (0, s._)`${A} || ${j}`), c.mergeValidEvaluated(B, j) || h.if((0, s.not)(A));
    })), c.result(A, () => c.reset(), () => c.error(!0));
  }
  return te.validateUnion = d, te;
}
var lr;
function jn() {
  if (lr) return pe;
  lr = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.validateKeywordUsage = pe.validSchemaType = pe.funcKeywordCode = pe.macroKeywordCode = void 0;
  const s = X(), e = _e(), t = me(), r = St();
  function n(_, $) {
    const { gen: E, keyword: b, schema: f, parentSchema: d, it: c } = _, h = $.macro.call(c.self, f, d, c), y = u(E, b, h);
    c.opts.validateSchema !== !1 && c.self.validateSchema(h, !0);
    const v = E.name("valid");
    _.subschema({
      schema: h,
      schemaPath: s.nil,
      errSchemaPath: `${c.errSchemaPath}/${b}`,
      topSchemaRef: y,
      compositeRule: !0
    }, v), _.pass(v, () => _.error(!0));
  }
  pe.macroKeywordCode = n;
  function i(_, $) {
    var E;
    const { gen: b, keyword: f, schema: d, parentSchema: c, $data: h, it: y } = _;
    l(y, $);
    const v = !h && $.compile ? $.compile.call(y.self, d, c, y) : $.validate, g = u(b, f, v), S = b.let("valid");
    _.block$data(S, A), _.ok((E = $.valid) !== null && E !== void 0 ? E : S);
    function A() {
      if ($.errors === !1)
        V(), $.modifying && o(_), B(() => _.error());
      else {
        const U = $.async ? j() : D();
        $.modifying && o(_), B(() => a(_, U));
      }
    }
    function j() {
      const U = b.let("ruleErrs", null);
      return b.try(() => V((0, s._)`await `), (Y) => b.assign(S, !1).if((0, s._)`${Y} instanceof ${y.ValidationError}`, () => b.assign(U, (0, s._)`${Y}.errors`), () => b.throw(Y))), U;
    }
    function D() {
      const U = (0, s._)`${g}.errors`;
      return b.assign(U, null), V(s.nil), U;
    }
    function V(U = $.async ? (0, s._)`await ` : s.nil) {
      const Y = y.opts.passContext ? e.default.this : e.default.self, ne = !("compile" in $ && !h || $.schema === !1);
      b.assign(S, (0, s._)`${U}${(0, t.callValidateCode)(_, g, Y, ne)}`, $.modifying);
    }
    function B(U) {
      var Y;
      b.if((0, s.not)((Y = $.valid) !== null && Y !== void 0 ? Y : S), U);
    }
  }
  pe.funcKeywordCode = i;
  function o(_) {
    const { gen: $, data: E, it: b } = _;
    $.if(b.parentData, () => $.assign(E, (0, s._)`${b.parentData}[${b.parentDataProperty}]`));
  }
  function a(_, $) {
    const { gen: E } = _;
    E.if((0, s._)`Array.isArray(${$})`, () => {
      E.assign(e.default.vErrors, (0, s._)`${e.default.vErrors} === null ? ${$} : ${e.default.vErrors}.concat(${$})`).assign(e.default.errors, (0, s._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function l({ schemaEnv: _ }, $) {
    if ($.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, $, E) {
    if (E === void 0)
      throw new Error(`keyword "${$}" failed to compile`);
    return _.scopeValue("keyword", typeof E == "function" ? { ref: E } : { ref: E, code: (0, s.stringify)(E) });
  }
  function p(_, $, E = !1) {
    return !$.length || $.some((b) => b === "array" ? Array.isArray(_) : b === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == b || E && typeof _ > "u");
  }
  pe.validSchemaType = p;
  function w({ schema: _, opts: $, self: E, errSchemaPath: b }, f, d) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(d) : f.keyword !== d)
      throw new Error("ajv implementation error");
    const c = f.dependencies;
    if (c?.some((h) => !Object.prototype.hasOwnProperty.call(_, h)))
      throw new Error(`parent schema must have dependencies of ${d}: ${c.join(",")}`);
    if (f.validateSchema && !f.validateSchema(_[d])) {
      const y = `keyword "${d}" value is invalid at path "${b}": ` + E.errorsText(f.validateSchema.errors);
      if ($.validateSchema === "log")
        E.logger.error(y);
      else
        throw new Error(y);
    }
  }
  return pe.validateKeywordUsage = w, pe;
}
var ve = {}, ur;
function qn() {
  if (ur) return ve;
  ur = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.extendSubschemaMode = ve.extendSubschemaData = ve.getSubschema = void 0;
  const s = X(), e = ee();
  function t(i, { keyword: o, schemaProp: a, schema: l, schemaPath: u, errSchemaPath: p, topSchemaRef: w }) {
    if (o !== void 0 && l !== void 0)
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
  ve.getSubschema = t;
  function r(i, o, { dataProp: a, dataPropType: l, data: u, dataTypes: p, propertyName: w }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = o;
    if (a !== void 0) {
      const { errorPath: E, dataPathArr: b, opts: f } = o, d = _.let("data", (0, s._)`${o.data}${(0, s.getProperty)(a)}`, !0);
      $(d), i.errorPath = (0, s.str)`${E}${(0, e.getErrorPath)(a, l, f.jsPropertySyntax)}`, i.parentDataProperty = (0, s._)`${a}`, i.dataPathArr = [...b, i.parentDataProperty];
    }
    if (u !== void 0) {
      const E = u instanceof s.Name ? u : _.let("data", u, !0);
      $(E), w !== void 0 && (i.propertyName = w);
    }
    p && (i.dataTypes = p);
    function $(E) {
      i.data = E, i.dataLevel = o.dataLevel + 1, i.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), i.parentData = o.data, i.dataNames = [...o.dataNames, E];
    }
  }
  ve.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: l, createErrors: u, allErrors: p }) {
    l !== void 0 && (i.compositeRule = l), u !== void 0 && (i.createErrors = u), p !== void 0 && (i.allErrors = p), i.jtdDiscriminator = o, i.jtdMetadata = a;
  }
  return ve.extendSubschemaMode = n, ve;
}
var ue = {}, jt, dr;
function yn() {
  return dr || (dr = 1, jt = function s(e, t) {
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
  }), jt;
}
var qt = { exports: {} }, hr;
function On() {
  if (hr) return qt.exports;
  hr = 1;
  var s = qt.exports = function(r, n, i) {
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
  function e(r, n, i, o, a, l, u, p, w, _) {
    if (o && typeof o == "object" && !Array.isArray(o)) {
      n(o, a, l, u, p, w, _);
      for (var $ in o) {
        var E = o[$];
        if (Array.isArray(E)) {
          if ($ in s.arrayKeywords)
            for (var b = 0; b < E.length; b++)
              e(r, n, i, E[b], a + "/" + $ + "/" + b, l, a, $, o, b);
        } else if ($ in s.propsKeywords) {
          if (E && typeof E == "object")
            for (var f in E)
              e(r, n, i, E[f], a + "/" + $ + "/" + t(f), l, a, $, o, f);
        } else ($ in s.keywords || r.allKeys && !($ in s.skipKeywords)) && e(r, n, i, E, a + "/" + $, l, a, $, o);
      }
      i(o, a, l, u, p, w, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return qt.exports;
}
var fr;
function Pt() {
  if (fr) return ue;
  fr = 1, Object.defineProperty(ue, "__esModule", { value: !0 }), ue.getSchemaRefs = ue.resolveUrl = ue.normalizeId = ue._getFullPath = ue.getFullPath = ue.inlineRef = void 0;
  const s = ee(), e = yn(), t = On(), r = /* @__PURE__ */ new Set([
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
  function n(b, f = !0) {
    return typeof b == "boolean" ? !0 : f === !0 ? !o(b) : f ? a(b) <= f : !1;
  }
  ue.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(b) {
    for (const f in b) {
      if (i.has(f))
        return !0;
      const d = b[f];
      if (Array.isArray(d) && d.some(o) || typeof d == "object" && o(d))
        return !0;
    }
    return !1;
  }
  function a(b) {
    let f = 0;
    for (const d in b) {
      if (d === "$ref")
        return 1 / 0;
      if (f++, !r.has(d) && (typeof b[d] == "object" && (0, s.eachItem)(b[d], (c) => f += a(c)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function l(b, f = "", d) {
    d !== !1 && (f = w(f));
    const c = b.parse(f);
    return u(b, c);
  }
  ue.getFullPath = l;
  function u(b, f) {
    return b.serialize(f).split("#")[0] + "#";
  }
  ue._getFullPath = u;
  const p = /#\/?$/;
  function w(b) {
    return b ? b.replace(p, "") : "";
  }
  ue.normalizeId = w;
  function _(b, f, d) {
    return d = w(d), b.resolve(f, d);
  }
  ue.resolveUrl = _;
  const $ = /^[a-z_][-a-z0-9._]*$/i;
  function E(b, f) {
    if (typeof b == "boolean")
      return {};
    const { schemaId: d, uriResolver: c } = this.opts, h = w(b[d] || f), y = { "": h }, v = l(c, h, !1), g = {}, S = /* @__PURE__ */ new Set();
    return t(b, { allKeys: !0 }, (D, V, B, U) => {
      if (U === void 0)
        return;
      const Y = v + V;
      let ne = y[U];
      typeof D[d] == "string" && (ne = ce.call(this, D[d])), de.call(this, D.$anchor), de.call(this, D.$dynamicAnchor), y[V] = ne;
      function ce(x) {
        const ae = this.opts.uriResolver.resolve;
        if (x = w(ne ? ae(ne, x) : x), S.has(x))
          throw j(x);
        S.add(x);
        let q = this.refs[x];
        return typeof q == "string" && (q = this.refs[q]), typeof q == "object" ? A(D, q.schema, x) : x !== w(Y) && (x[0] === "#" ? (A(D, g[x], x), g[x] = D) : this.refs[x] = Y), x;
      }
      function de(x) {
        if (typeof x == "string") {
          if (!$.test(x))
            throw new Error(`invalid anchor "${x}"`);
          ce.call(this, `#${x}`);
        }
      }
    }), g;
    function A(D, V, B) {
      if (V !== void 0 && !e(D, V))
        throw j(B);
    }
    function j(D) {
      return new Error(`reference "${D}" resolves to more than one schema`);
    }
  }
  return ue.getSchemaRefs = E, ue;
}
var pr;
function Et() {
  if (pr) return ye;
  pr = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.getData = ye.KeywordCxt = ye.validateFunctionCode = void 0;
  const s = In(), e = _t(), t = mn(), r = _t(), n = Cn(), i = jn(), o = qn(), a = X(), l = _e(), u = Pt(), p = ee(), w = St();
  function _(M) {
    if (v(M) && (S(M), y(M))) {
      f(M);
      return;
    }
    $(M, () => (0, s.topBoolOrEmptySchema)(M));
  }
  ye.validateFunctionCode = _;
  function $({ gen: M, validateName: T, schema: I, schemaEnv: O, opts: L }, K) {
    L.code.es5 ? M.func(T, (0, a._)`${l.default.data}, ${l.default.valCxt}`, O.$async, () => {
      M.code((0, a._)`"use strict"; ${c(I, L)}`), b(M, L), M.code(K);
    }) : M.func(T, (0, a._)`${l.default.data}, ${E(L)}`, O.$async, () => M.code(c(I, L)).code(K));
  }
  function E(M) {
    return (0, a._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${M.dynamicRef ? (0, a._)`, ${l.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function b(M, T) {
    M.if(l.default.valCxt, () => {
      M.var(l.default.instancePath, (0, a._)`${l.default.valCxt}.${l.default.instancePath}`), M.var(l.default.parentData, (0, a._)`${l.default.valCxt}.${l.default.parentData}`), M.var(l.default.parentDataProperty, (0, a._)`${l.default.valCxt}.${l.default.parentDataProperty}`), M.var(l.default.rootData, (0, a._)`${l.default.valCxt}.${l.default.rootData}`), T.dynamicRef && M.var(l.default.dynamicAnchors, (0, a._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      M.var(l.default.instancePath, (0, a._)`""`), M.var(l.default.parentData, (0, a._)`undefined`), M.var(l.default.parentDataProperty, (0, a._)`undefined`), M.var(l.default.rootData, l.default.data), T.dynamicRef && M.var(l.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function f(M) {
    const { schema: T, opts: I, gen: O } = M;
    $(M, () => {
      I.$comment && T.$comment && U(M), D(M), O.let(l.default.vErrors, null), O.let(l.default.errors, 0), I.unevaluated && d(M), A(M), Y(M);
    });
  }
  function d(M) {
    const { gen: T, validateName: I } = M;
    M.evaluated = T.const("evaluated", (0, a._)`${I}.evaluated`), T.if((0, a._)`${M.evaluated}.dynamicProps`, () => T.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), T.if((0, a._)`${M.evaluated}.dynamicItems`, () => T.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function c(M, T) {
    const I = typeof M == "object" && M[T.schemaId];
    return I && (T.code.source || T.code.process) ? (0, a._)`/*# sourceURL=${I} */` : a.nil;
  }
  function h(M, T) {
    if (v(M) && (S(M), y(M))) {
      g(M, T);
      return;
    }
    (0, s.boolOrEmptySchema)(M, T);
  }
  function y({ schema: M, self: T }) {
    if (typeof M == "boolean")
      return !M;
    for (const I in M)
      if (T.RULES.all[I])
        return !0;
    return !1;
  }
  function v(M) {
    return typeof M.schema != "boolean";
  }
  function g(M, T) {
    const { schema: I, gen: O, opts: L } = M;
    L.$comment && I.$comment && U(M), V(M), B(M);
    const K = O.const("_errs", l.default.errors);
    A(M, K), O.var(T, (0, a._)`${K} === ${l.default.errors}`);
  }
  function S(M) {
    (0, p.checkUnknownRules)(M), j(M);
  }
  function A(M, T) {
    if (M.opts.jtd)
      return ce(M, [], !1, T);
    const I = (0, e.getSchemaTypes)(M.schema), O = (0, e.coerceAndCheckDataType)(M, I);
    ce(M, I, !O, T);
  }
  function j(M) {
    const { schema: T, errSchemaPath: I, opts: O, self: L } = M;
    T.$ref && O.ignoreKeywordsWithRef && (0, p.schemaHasRulesButRef)(T, L.RULES) && L.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function D(M) {
    const { schema: T, opts: I } = M;
    T.default !== void 0 && I.useDefaults && I.strictSchema && (0, p.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function V(M) {
    const T = M.schema[M.opts.schemaId];
    T && (M.baseId = (0, u.resolveUrl)(M.opts.uriResolver, M.baseId, T));
  }
  function B(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function U({ gen: M, schemaEnv: T, schema: I, errSchemaPath: O, opts: L }) {
    const K = I.$comment;
    if (L.$comment === !0)
      M.code((0, a._)`${l.default.self}.logger.log(${K})`);
    else if (typeof L.$comment == "function") {
      const ie = (0, a.str)`${O}/$comment`, re = M.scopeValue("root", { ref: T.root });
      M.code((0, a._)`${l.default.self}.opts.$comment(${K}, ${ie}, ${re}.schema)`);
    }
  }
  function Y(M) {
    const { gen: T, schemaEnv: I, validateName: O, ValidationError: L, opts: K } = M;
    I.$async ? T.if((0, a._)`${l.default.errors} === 0`, () => T.return(l.default.data), () => T.throw((0, a._)`new ${L}(${l.default.vErrors})`)) : (T.assign((0, a._)`${O}.errors`, l.default.vErrors), K.unevaluated && ne(M), T.return((0, a._)`${l.default.errors} === 0`));
  }
  function ne({ gen: M, evaluated: T, props: I, items: O }) {
    I instanceof a.Name && M.assign((0, a._)`${T}.props`, I), O instanceof a.Name && M.assign((0, a._)`${T}.items`, O);
  }
  function ce(M, T, I, O) {
    const { gen: L, schema: K, data: ie, allErrors: re, opts: G, self: Q } = M, { RULES: Z } = Q;
    if (K.$ref && (G.ignoreKeywordsWithRef || !(0, p.schemaHasRulesButRef)(K, Z))) {
      L.block(() => F(M, "$ref", Z.all.$ref.definition));
      return;
    }
    G.jtd || x(M, T), L.block(() => {
      for (const le of Z.rules)
        se(le);
      se(Z.post);
    });
    function se(le) {
      (0, t.shouldUseGroup)(K, le) && (le.type ? (L.if((0, r.checkDataType)(le.type, ie, G.strictNumbers)), de(M, le), T.length === 1 && T[0] === le.type && I && (L.else(), (0, r.reportTypeError)(M)), L.endIf()) : de(M, le), re || L.if((0, a._)`${l.default.errors} === ${O || 0}`));
    }
  }
  function de(M, T) {
    const { gen: I, schema: O, opts: { useDefaults: L } } = M;
    L && (0, n.assignDefaults)(M, T.type), I.block(() => {
      for (const K of T.rules)
        (0, t.shouldUseRule)(O, K) && F(M, K.keyword, K.definition, T.type);
    });
  }
  function x(M, T) {
    M.schemaEnv.meta || !M.opts.strictTypes || (ae(M, T), M.opts.allowUnionTypes || q(M, T), k(M, M.dataTypes));
  }
  function ae(M, T) {
    if (T.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = T;
        return;
      }
      T.forEach((I) => {
        R(M.dataTypes, I) || P(M, `type "${I}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), m(M, T);
    }
  }
  function q(M, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && P(M, "use allowUnionTypes to allow union type keyword");
  }
  function k(M, T) {
    const I = M.self.RULES.all;
    for (const O in I) {
      const L = I[O];
      if (typeof L == "object" && (0, t.shouldUseRule)(M.schema, L)) {
        const { type: K } = L.definition;
        K.length && !K.some((ie) => C(T, ie)) && P(M, `missing type "${K.join(",")}" for keyword "${O}"`);
      }
    }
  }
  function C(M, T) {
    return M.includes(T) || T === "number" && M.includes("integer");
  }
  function R(M, T) {
    return M.includes(T) || T === "integer" && M.includes("number");
  }
  function m(M, T) {
    const I = [];
    for (const O of M.dataTypes)
      R(T, O) ? I.push(O) : T.includes("integer") && O === "number" && I.push("integer");
    M.dataTypes = I;
  }
  function P(M, T) {
    const I = M.schemaEnv.baseId + M.errSchemaPath;
    T += ` at "${I}" (strictTypes)`, (0, p.checkStrictMode)(M, T, M.opts.strictTypes);
  }
  class N {
    constructor(T, I, O) {
      if ((0, i.validateKeywordUsage)(T, I, O), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = O, this.data = T.data, this.schema = T.schema[O], this.$data = I.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, p.schemaRefOrVal)(T, this.schema, O, this.$data), this.schemaType = I.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = I, this.$data)
        this.schemaCode = T.gen.const("vSchema", H(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, I.schemaType, I.allowUndefined))
        throw new Error(`${O} value must be ${JSON.stringify(I.schemaType)}`);
      ("code" in I ? I.trackErrors : I.errors !== !1) && (this.errsCount = T.gen.const("_errs", l.default.errors));
    }
    result(T, I, O) {
      this.failResult((0, a.not)(T), I, O);
    }
    failResult(T, I, O) {
      this.gen.if(T), O ? O() : this.error(), I ? (this.gen.else(), I(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
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
    error(T, I, O) {
      if (I) {
        this.setParams(I), this._error(T, O), this.setParams({});
        return;
      }
      this._error(T, O);
    }
    _error(T, I) {
      (T ? w.reportExtraError : w.reportError)(this, this.def.error, I);
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
    setParams(T, I) {
      I ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, I, O = a.nil) {
      this.gen.block(() => {
        this.check$data(T, O), I();
      });
    }
    check$data(T = a.nil, I = a.nil) {
      if (!this.$data)
        return;
      const { gen: O, schemaCode: L, schemaType: K, def: ie } = this;
      O.if((0, a.or)((0, a._)`${L} === undefined`, I)), T !== a.nil && O.assign(T, !0), (K.length || ie.validateSchema) && (O.elseIf(this.invalid$data()), this.$dataError(), T !== a.nil && O.assign(T, !1)), O.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: I, schemaType: O, def: L, it: K } = this;
      return (0, a.or)(ie(), re());
      function ie() {
        if (O.length) {
          if (!(I instanceof a.Name))
            throw new Error("ajv implementation error");
          const G = Array.isArray(O) ? O : [O];
          return (0, a._)`${(0, r.checkDataTypes)(G, I, K.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function re() {
        if (L.validateSchema) {
          const G = T.scopeValue("validate$data", { ref: L.validateSchema });
          return (0, a._)`!${G}(${I})`;
        }
        return a.nil;
      }
    }
    subschema(T, I) {
      const O = (0, o.getSubschema)(this.it, T);
      (0, o.extendSubschemaData)(O, this.it, T), (0, o.extendSubschemaMode)(O, T);
      const L = { ...this.it, ...O, items: void 0, props: void 0 };
      return h(L, I), L;
    }
    mergeEvaluated(T, I) {
      const { it: O, gen: L } = this;
      O.opts.unevaluated && (O.props !== !0 && T.props !== void 0 && (O.props = p.mergeEvaluated.props(L, T.props, O.props, I)), O.items !== !0 && T.items !== void 0 && (O.items = p.mergeEvaluated.items(L, T.items, O.items, I)));
    }
    mergeValidEvaluated(T, I) {
      const { it: O, gen: L } = this;
      if (O.opts.unevaluated && (O.props !== !0 || O.items !== !0))
        return L.if(I, () => this.mergeEvaluated(T, a.Name)), !0;
    }
  }
  ye.KeywordCxt = N;
  function F(M, T, I, O) {
    const L = new N(M, I, T);
    "code" in I ? I.code(L, O) : L.$data && I.validate ? (0, i.funcKeywordCode)(L, I) : "macro" in I ? (0, i.macroKeywordCode)(L, I) : (I.compile || I.validate) && (0, i.funcKeywordCode)(L, I);
  }
  const z = /^\/(?:[^~]|~0|~1)*$/, J = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(M, { dataLevel: T, dataNames: I, dataPathArr: O }) {
    let L, K;
    if (M === "")
      return l.default.rootData;
    if (M[0] === "/") {
      if (!z.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      L = M, K = l.default.rootData;
    } else {
      const Q = J.exec(M);
      if (!Q)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const Z = +Q[1];
      if (L = Q[2], L === "#") {
        if (Z >= T)
          throw new Error(G("property/index", Z));
        return O[T - Z];
      }
      if (Z > T)
        throw new Error(G("data", Z));
      if (K = I[T - Z], !L)
        return K;
    }
    let ie = K;
    const re = L.split("/");
    for (const Q of re)
      Q && (K = (0, a._)`${K}${(0, a.getProperty)((0, p.unescapeJsonPointer)(Q))}`, ie = (0, a._)`${ie} && ${K}`);
    return ie;
    function G(Q, Z) {
      return `Cannot access ${Q} ${Z} levels up, current level is ${T}`;
    }
  }
  return ye.getData = H, ye;
}
var Ve = {}, mr;
function Kt() {
  if (mr) return Ve;
  mr = 1, Object.defineProperty(Ve, "__esModule", { value: !0 });
  class s extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Ve.default = s, Ve;
}
var Fe = {}, yr;
function Mt() {
  if (yr) return Fe;
  yr = 1, Object.defineProperty(Fe, "__esModule", { value: !0 });
  const s = Pt();
  class e extends Error {
    constructor(r, n, i, o) {
      super(o || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, s.resolveUrl)(r, n, i), this.missingSchema = (0, s.normalizeId)((0, s.getFullPath)(r, this.missingRef));
    }
  }
  return Fe.default = e, Fe;
}
var fe = {}, gr;
function Bt() {
  if (gr) return fe;
  gr = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.resolveSchema = fe.getCompilingSchema = fe.resolveRef = fe.compileSchema = fe.SchemaEnv = void 0;
  const s = X(), e = Kt(), t = _e(), r = Pt(), n = ee(), i = Et();
  class o {
    constructor(d) {
      var c;
      this.refs = {}, this.dynamicAnchors = {};
      let h;
      typeof d.schema == "object" && (h = d.schema), this.schema = d.schema, this.schemaId = d.schemaId, this.root = d.root || this, this.baseId = (c = d.baseId) !== null && c !== void 0 ? c : (0, r.normalizeId)(h?.[d.schemaId || "$id"]), this.schemaPath = d.schemaPath, this.localRefs = d.localRefs, this.meta = d.meta, this.$async = h?.$async, this.refs = {};
    }
  }
  fe.SchemaEnv = o;
  function a(f) {
    const d = p.call(this, f);
    if (d)
      return d;
    const c = (0, r.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: h, lines: y } = this.opts.code, { ownProperties: v } = this.opts, g = new s.CodeGen(this.scope, { es5: h, lines: y, ownProperties: v });
    let S;
    f.$async && (S = g.scopeValue("Error", {
      ref: e.default,
      code: (0, s._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const A = g.scopeName("validate");
    f.validateName = A;
    const j = {
      gen: g,
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
      topSchemaRef: g.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, s.stringify)(f.schema) } : { ref: f.schema }),
      validateName: A,
      ValidationError: S,
      schema: f.schema,
      schemaEnv: f,
      rootId: c,
      baseId: f.baseId || c,
      schemaPath: s.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, s._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(f), (0, i.validateFunctionCode)(j), g.optimize(this.opts.code.optimize);
      const V = g.toString();
      D = `${g.scopeRefs(t.default.scope)}return ${V}`, this.opts.code.process && (D = this.opts.code.process(D, f));
      const U = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(A, { ref: U }), U.errors = null, U.schema = f.schema, U.schemaEnv = f, f.$async && (U.$async = !0), this.opts.code.source === !0 && (U.source = { validateName: A, validateCode: V, scopeValues: g._values }), this.opts.unevaluated) {
        const { props: Y, items: ne } = j;
        U.evaluated = {
          props: Y instanceof s.Name ? void 0 : Y,
          items: ne instanceof s.Name ? void 0 : ne,
          dynamicProps: Y instanceof s.Name,
          dynamicItems: ne instanceof s.Name
        }, U.source && (U.source.evaluated = (0, s.stringify)(U.evaluated));
      }
      return f.validate = U, f;
    } catch (V) {
      throw delete f.validate, delete f.validateName, D && this.logger.error("Error compiling schema, function code:", D), V;
    } finally {
      this._compilations.delete(f);
    }
  }
  fe.compileSchema = a;
  function l(f, d, c) {
    var h;
    c = (0, r.resolveUrl)(this.opts.uriResolver, d, c);
    const y = f.refs[c];
    if (y)
      return y;
    let v = _.call(this, f, c);
    if (v === void 0) {
      const g = (h = f.localRefs) === null || h === void 0 ? void 0 : h[c], { schemaId: S } = this.opts;
      g && (v = new o({ schema: g, schemaId: S, root: f, baseId: d }));
    }
    if (v !== void 0)
      return f.refs[c] = u.call(this, v);
  }
  fe.resolveRef = l;
  function u(f) {
    return (0, r.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : a.call(this, f);
  }
  function p(f) {
    for (const d of this._compilations)
      if (w(d, f))
        return d;
  }
  fe.getCompilingSchema = p;
  function w(f, d) {
    return f.schema === d.schema && f.root === d.root && f.baseId === d.baseId;
  }
  function _(f, d) {
    let c;
    for (; typeof (c = this.refs[d]) == "string"; )
      d = c;
    return c || this.schemas[d] || $.call(this, f, d);
  }
  function $(f, d) {
    const c = this.opts.uriResolver.parse(d), h = (0, r._getFullPath)(this.opts.uriResolver, c);
    let y = (0, r.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && h === y)
      return b.call(this, c, f);
    const v = (0, r.normalizeId)(h), g = this.refs[v] || this.schemas[v];
    if (typeof g == "string") {
      const S = $.call(this, f, g);
      return typeof S?.schema != "object" ? void 0 : b.call(this, c, S);
    }
    if (typeof g?.schema == "object") {
      if (g.validate || a.call(this, g), v === (0, r.normalizeId)(d)) {
        const { schema: S } = g, { schemaId: A } = this.opts, j = S[A];
        return j && (y = (0, r.resolveUrl)(this.opts.uriResolver, y, j)), new o({ schema: S, schemaId: A, root: f, baseId: y });
      }
      return b.call(this, c, g);
    }
  }
  fe.resolveSchema = $;
  const E = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function b(f, { baseId: d, schema: c, root: h }) {
    var y;
    if (((y = f.fragment) === null || y === void 0 ? void 0 : y[0]) !== "/")
      return;
    for (const S of f.fragment.slice(1).split("/")) {
      if (typeof c == "boolean")
        return;
      const A = c[(0, n.unescapeFragment)(S)];
      if (A === void 0)
        return;
      c = A;
      const j = typeof c == "object" && c[this.opts.schemaId];
      !E.has(S) && j && (d = (0, r.resolveUrl)(this.opts.uriResolver, d, j));
    }
    let v;
    if (typeof c != "boolean" && c.$ref && !(0, n.schemaHasRulesButRef)(c, this.RULES)) {
      const S = (0, r.resolveUrl)(this.opts.uriResolver, d, c.$ref);
      v = $.call(this, h, S);
    }
    const { schemaId: g } = this.opts;
    if (v = v || new o({ schema: c, schemaId: g, root: h, baseId: d }), v.schema !== v.root.schema)
      return v;
  }
  return fe;
}
const Dn = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", xn = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Vn = "object", Fn = ["$data"], zn = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Ln = !1, Un = {
  $id: Dn,
  description: xn,
  type: Vn,
  required: Fn,
  properties: zn,
  additionalProperties: Ln
};
var ze = {}, je = { exports: {} }, Ot, vr;
function Gn() {
  return vr || (vr = 1, Ot = {
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
  }), Ot;
}
var Dt, br;
function Kn() {
  if (br) return Dt;
  br = 1;
  const { HEX: s } = Gn(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(b) {
    if (a(b, ".") < 3)
      return { host: b, isIPV4: !1 };
    const f = b.match(e) || [], [d] = f;
    return d ? { host: o(d, "."), isIPV4: !0 } : { host: b, isIPV4: !1 };
  }
  function r(b, f = !1) {
    let d = "", c = !0;
    for (const h of b) {
      if (s[h] === void 0) return;
      h !== "0" && c === !0 && (c = !1), c || (d += h);
    }
    return f && d.length === 0 && (d = "0"), d;
  }
  function n(b) {
    let f = 0;
    const d = { error: !1, address: "", zone: "" }, c = [], h = [];
    let y = !1, v = !1, g = !1;
    function S() {
      if (h.length) {
        if (y === !1) {
          const A = r(h);
          if (A !== void 0)
            c.push(A);
          else
            return d.error = !0, !1;
        }
        h.length = 0;
      }
      return !0;
    }
    for (let A = 0; A < b.length; A++) {
      const j = b[A];
      if (!(j === "[" || j === "]"))
        if (j === ":") {
          if (v === !0 && (g = !0), !S())
            break;
          if (f++, c.push(":"), f > 7) {
            d.error = !0;
            break;
          }
          A - 1 >= 0 && b[A - 1] === ":" && (v = !0);
          continue;
        } else if (j === "%") {
          if (!S())
            break;
          y = !0;
        } else {
          h.push(j);
          continue;
        }
    }
    return h.length && (y ? d.zone = h.join("") : g ? c.push(h.join("")) : c.push(r(h))), d.address = c.join(""), d;
  }
  function i(b) {
    if (a(b, ":") < 2)
      return { host: b, isIPV6: !1 };
    const f = n(b);
    if (f.error)
      return { host: b, isIPV6: !1 };
    {
      let d = f.address, c = f.address;
      return f.zone && (d += "%" + f.zone, c += "%25" + f.zone), { host: d, escapedHost: c, isIPV6: !0 };
    }
  }
  function o(b, f) {
    let d = "", c = !0;
    const h = b.length;
    for (let y = 0; y < h; y++) {
      const v = b[y];
      v === "0" && c ? (y + 1 <= h && b[y + 1] === f || y + 1 === h) && (d += v, c = !1) : (v === f ? c = !0 : c = !1, d += v);
    }
    return d;
  }
  function a(b, f) {
    let d = 0;
    for (let c = 0; c < b.length; c++)
      b[c] === f && d++;
    return d;
  }
  const l = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, p = /^\/\.\.(?:\/|$)/u, w = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(b) {
    const f = [];
    for (; b.length; )
      if (b.match(l))
        b = b.replace(l, "");
      else if (b.match(u))
        b = b.replace(u, "/");
      else if (b.match(p))
        b = b.replace(p, "/"), f.pop();
      else if (b === "." || b === "..")
        b = "";
      else {
        const d = b.match(w);
        if (d) {
          const c = d[0];
          b = b.slice(c.length), f.push(c);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return f.join("");
  }
  function $(b, f) {
    const d = f !== !0 ? escape : unescape;
    return b.scheme !== void 0 && (b.scheme = d(b.scheme)), b.userinfo !== void 0 && (b.userinfo = d(b.userinfo)), b.host !== void 0 && (b.host = d(b.host)), b.path !== void 0 && (b.path = d(b.path)), b.query !== void 0 && (b.query = d(b.query)), b.fragment !== void 0 && (b.fragment = d(b.fragment)), b;
  }
  function E(b) {
    const f = [];
    if (b.userinfo !== void 0 && (f.push(b.userinfo), f.push("@")), b.host !== void 0) {
      let d = unescape(b.host);
      const c = t(d);
      if (c.isIPV4)
        d = c.host;
      else {
        const h = i(c.host);
        h.isIPV6 === !0 ? d = `[${h.escapedHost}]` : d = b.host;
      }
      f.push(d);
    }
    return (typeof b.port == "number" || typeof b.port == "string") && (f.push(":"), f.push(String(b.port))), f.length ? f.join("") : void 0;
  }
  return Dt = {
    recomposeAuthority: E,
    normalizeComponentEncoding: $,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Dt;
}
var xt, wr;
function Bn() {
  if (wr) return xt;
  wr = 1;
  const s = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function t(c) {
    return typeof c.secure == "boolean" ? c.secure : String(c.scheme).toLowerCase() === "wss";
  }
  function r(c) {
    return c.host || (c.error = c.error || "HTTP URIs must have a host."), c;
  }
  function n(c) {
    const h = String(c.scheme).toLowerCase() === "https";
    return (c.port === (h ? 443 : 80) || c.port === "") && (c.port = void 0), c.path || (c.path = "/"), c;
  }
  function i(c) {
    return c.secure = t(c), c.resourceName = (c.path || "/") + (c.query ? "?" + c.query : ""), c.path = void 0, c.query = void 0, c;
  }
  function o(c) {
    if ((c.port === (t(c) ? 443 : 80) || c.port === "") && (c.port = void 0), typeof c.secure == "boolean" && (c.scheme = c.secure ? "wss" : "ws", c.secure = void 0), c.resourceName) {
      const [h, y] = c.resourceName.split("?");
      c.path = h && h !== "/" ? h : void 0, c.query = y, c.resourceName = void 0;
    }
    return c.fragment = void 0, c;
  }
  function a(c, h) {
    if (!c.path)
      return c.error = "URN can not be parsed", c;
    const y = c.path.match(e);
    if (y) {
      const v = h.scheme || c.scheme || "urn";
      c.nid = y[1].toLowerCase(), c.nss = y[2];
      const g = `${v}:${h.nid || c.nid}`, S = d[g];
      c.path = void 0, S && (c = S.parse(c, h));
    } else
      c.error = c.error || "URN can not be parsed.";
    return c;
  }
  function l(c, h) {
    const y = h.scheme || c.scheme || "urn", v = c.nid.toLowerCase(), g = `${y}:${h.nid || v}`, S = d[g];
    S && (c = S.serialize(c, h));
    const A = c, j = c.nss;
    return A.path = `${v || h.nid}:${j}`, h.skipEscape = !0, A;
  }
  function u(c, h) {
    const y = c;
    return y.uuid = y.nss, y.nss = void 0, !h.tolerant && (!y.uuid || !s.test(y.uuid)) && (y.error = y.error || "UUID is not valid."), y;
  }
  function p(c) {
    const h = c;
    return h.nss = (c.uuid || "").toLowerCase(), h;
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
  }, $ = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: o
  }, E = {
    scheme: "wss",
    domainHost: $.domainHost,
    parse: $.parse,
    serialize: $.serialize
  }, d = {
    http: w,
    https: _,
    ws: $,
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
  return xt = d, xt;
}
var $r;
function Hn() {
  if ($r) return je.exports;
  $r = 1;
  const { normalizeIPv6: s, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = Kn(), i = Bn();
  function o(f, d) {
    return typeof f == "string" ? f = p(E(f, d), d) : typeof f == "object" && (f = E(p(f, d), d)), f;
  }
  function a(f, d, c) {
    const h = Object.assign({ scheme: "null" }, c), y = l(E(f, h), E(d, h), h, !0);
    return p(y, { ...h, skipEscape: !0 });
  }
  function l(f, d, c, h) {
    const y = {};
    return h || (f = E(p(f, c), c), d = E(p(d, c), c)), c = c || {}, !c.tolerant && d.scheme ? (y.scheme = d.scheme, y.userinfo = d.userinfo, y.host = d.host, y.port = d.port, y.path = t(d.path || ""), y.query = d.query) : (d.userinfo !== void 0 || d.host !== void 0 || d.port !== void 0 ? (y.userinfo = d.userinfo, y.host = d.host, y.port = d.port, y.path = t(d.path || ""), y.query = d.query) : (d.path ? (d.path.charAt(0) === "/" ? y.path = t(d.path) : ((f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0) && !f.path ? y.path = "/" + d.path : f.path ? y.path = f.path.slice(0, f.path.lastIndexOf("/") + 1) + d.path : y.path = d.path, y.path = t(y.path)), y.query = d.query) : (y.path = f.path, d.query !== void 0 ? y.query = d.query : y.query = f.query), y.userinfo = f.userinfo, y.host = f.host, y.port = f.port), y.scheme = f.scheme), y.fragment = d.fragment, y;
  }
  function u(f, d, c) {
    return typeof f == "string" ? (f = unescape(f), f = p(n(E(f, c), !0), { ...c, skipEscape: !0 })) : typeof f == "object" && (f = p(n(f, !0), { ...c, skipEscape: !0 })), typeof d == "string" ? (d = unescape(d), d = p(n(E(d, c), !0), { ...c, skipEscape: !0 })) : typeof d == "object" && (d = p(n(d, !0), { ...c, skipEscape: !0 })), f.toLowerCase() === d.toLowerCase();
  }
  function p(f, d) {
    const c = {
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
    }, h = Object.assign({}, d), y = [], v = i[(h.scheme || c.scheme || "").toLowerCase()];
    v && v.serialize && v.serialize(c, h), c.path !== void 0 && (h.skipEscape ? c.path = unescape(c.path) : (c.path = escape(c.path), c.scheme !== void 0 && (c.path = c.path.split("%3A").join(":")))), h.reference !== "suffix" && c.scheme && y.push(c.scheme, ":");
    const g = r(c);
    if (g !== void 0 && (h.reference !== "suffix" && y.push("//"), y.push(g), c.path && c.path.charAt(0) !== "/" && y.push("/")), c.path !== void 0) {
      let S = c.path;
      !h.absolutePath && (!v || !v.absolutePath) && (S = t(S)), g === void 0 && (S = S.replace(/^\/\//u, "/%2F")), y.push(S);
    }
    return c.query !== void 0 && y.push("?", c.query), c.fragment !== void 0 && y.push("#", c.fragment), y.join("");
  }
  const w = Array.from({ length: 127 }, (f, d) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(d)));
  function _(f) {
    let d = 0;
    for (let c = 0, h = f.length; c < h; ++c)
      if (d = f.charCodeAt(c), d > 126 || w[d])
        return !0;
    return !1;
  }
  const $ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function E(f, d) {
    const c = Object.assign({}, d), h = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, y = f.indexOf("%") !== -1;
    let v = !1;
    c.reference === "suffix" && (f = (c.scheme ? c.scheme + ":" : "") + "//" + f);
    const g = f.match($);
    if (g) {
      if (h.scheme = g[1], h.userinfo = g[3], h.host = g[4], h.port = parseInt(g[5], 10), h.path = g[6] || "", h.query = g[7], h.fragment = g[8], isNaN(h.port) && (h.port = g[5]), h.host) {
        const A = e(h.host);
        if (A.isIPV4 === !1) {
          const j = s(A.host);
          h.host = j.host.toLowerCase(), v = j.isIPV6;
        } else
          h.host = A.host, v = !0;
      }
      h.scheme === void 0 && h.userinfo === void 0 && h.host === void 0 && h.port === void 0 && h.query === void 0 && !h.path ? h.reference = "same-document" : h.scheme === void 0 ? h.reference = "relative" : h.fragment === void 0 ? h.reference = "absolute" : h.reference = "uri", c.reference && c.reference !== "suffix" && c.reference !== h.reference && (h.error = h.error || "URI is not a " + c.reference + " reference.");
      const S = i[(c.scheme || h.scheme || "").toLowerCase()];
      if (!c.unicodeSupport && (!S || !S.unicodeSupport) && h.host && (c.domainHost || S && S.domainHost) && v === !1 && _(h.host))
        try {
          h.host = URL.domainToASCII(h.host.toLowerCase());
        } catch (A) {
          h.error = h.error || "Host's domain name can not be converted to ASCII: " + A;
        }
      (!S || S && !S.skipNormalize) && (y && h.scheme !== void 0 && (h.scheme = unescape(h.scheme)), y && h.host !== void 0 && (h.host = unescape(h.host)), h.path && (h.path = escape(unescape(h.path))), h.fragment && (h.fragment = encodeURI(decodeURIComponent(h.fragment)))), S && S.parse && S.parse(h, c);
    } else
      h.error = h.error || "URI can not be parsed.";
    return h;
  }
  const b = {
    SCHEMES: i,
    normalize: o,
    resolve: a,
    resolveComponents: l,
    equal: u,
    serialize: p,
    parse: E
  };
  return je.exports = b, je.exports.default = b, je.exports.fastUri = b, je.exports;
}
var _r;
function Wn() {
  if (_r) return ze;
  _r = 1, Object.defineProperty(ze, "__esModule", { value: !0 });
  const s = Hn();
  return s.code = 'require("ajv/dist/runtime/uri").default', ze.default = s, ze;
}
var Sr;
function Jn() {
  return Sr || (Sr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.CodeGen = s.Name = s.nil = s.stringify = s.str = s._ = s.KeywordCxt = void 0;
    var e = Et();
    Object.defineProperty(s, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = X();
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
    const r = Kt(), n = Mt(), i = pn(), o = Bt(), a = X(), l = Pt(), u = _t(), p = ee(), w = Un, _ = Wn(), $ = (q, k) => new RegExp(q, k);
    $.code = "new RegExp";
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
    }, d = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, c = 200;
    function h(q) {
      var k, C, R, m, P, N, F, z, J, H, M, T, I, O, L, K, ie, re, G, Q, Z, se, le, ke, Ne;
      const Se = q.strict, be = (k = q.code) === null || k === void 0 ? void 0 : k.optimize, Ie = be === !0 || be === void 0 ? 1 : be || 0, Pe = (R = (C = q.code) === null || C === void 0 ? void 0 : C.regExp) !== null && R !== void 0 ? R : $, kt = (m = q.uriResolver) !== null && m !== void 0 ? m : _.default;
      return {
        strictSchema: (N = (P = q.strictSchema) !== null && P !== void 0 ? P : Se) !== null && N !== void 0 ? N : !0,
        strictNumbers: (z = (F = q.strictNumbers) !== null && F !== void 0 ? F : Se) !== null && z !== void 0 ? z : !0,
        strictTypes: (H = (J = q.strictTypes) !== null && J !== void 0 ? J : Se) !== null && H !== void 0 ? H : "log",
        strictTuples: (T = (M = q.strictTuples) !== null && M !== void 0 ? M : Se) !== null && T !== void 0 ? T : "log",
        strictRequired: (O = (I = q.strictRequired) !== null && I !== void 0 ? I : Se) !== null && O !== void 0 ? O : !1,
        code: q.code ? { ...q.code, optimize: Ie, regExp: Pe } : { optimize: Ie, regExp: Pe },
        loopRequired: (L = q.loopRequired) !== null && L !== void 0 ? L : c,
        loopEnum: (K = q.loopEnum) !== null && K !== void 0 ? K : c,
        meta: (ie = q.meta) !== null && ie !== void 0 ? ie : !0,
        messages: (re = q.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (G = q.inlineRefs) !== null && G !== void 0 ? G : !0,
        schemaId: (Q = q.schemaId) !== null && Q !== void 0 ? Q : "$id",
        addUsedSchema: (Z = q.addUsedSchema) !== null && Z !== void 0 ? Z : !0,
        validateSchema: (se = q.validateSchema) !== null && se !== void 0 ? se : !0,
        validateFormats: (le = q.validateFormats) !== null && le !== void 0 ? le : !0,
        unicodeRegExp: (ke = q.unicodeRegExp) !== null && ke !== void 0 ? ke : !0,
        int32range: (Ne = q.int32range) !== null && Ne !== void 0 ? Ne : !0,
        uriResolver: kt
      };
    }
    class y {
      constructor(k = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), k = this.opts = { ...k, ...h(k) };
        const { es5: C, lines: R } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: b, es5: C, lines: R }), this.logger = B(k.logger);
        const m = k.validateFormats;
        k.validateFormats = !1, this.RULES = (0, i.getRules)(), v.call(this, f, k, "NOT SUPPORTED"), v.call(this, d, k, "DEPRECATED", "warn"), this._metaOpts = D.call(this), k.formats && A.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), k.keywords && j.call(this, k.keywords), typeof k.meta == "object" && this.addMetaSchema(k.meta), S.call(this), k.validateFormats = m;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: k, meta: C, schemaId: R } = this.opts;
        let m = w;
        R === "id" && (m = { ...w }, m.id = m.$id, delete m.$id), C && k && this.addMetaSchema(m, m[R], !1);
      }
      defaultMeta() {
        const { meta: k, schemaId: C } = this.opts;
        return this.opts.defaultMeta = typeof k == "object" ? k[C] || k : void 0;
      }
      validate(k, C) {
        let R;
        if (typeof k == "string") {
          if (R = this.getSchema(k), !R)
            throw new Error(`no schema with key or ref "${k}"`);
        } else
          R = this.compile(k);
        const m = R(C);
        return "$async" in R || (this.errors = R.errors), m;
      }
      compile(k, C) {
        const R = this._addSchema(k, C);
        return R.validate || this._compileSchemaEnv(R);
      }
      compileAsync(k, C) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: R } = this.opts;
        return m.call(this, k, C);
        async function m(H, M) {
          await P.call(this, H.$schema);
          const T = this._addSchema(H, M);
          return T.validate || N.call(this, T);
        }
        async function P(H) {
          H && !this.getSchema(H) && await m.call(this, { $ref: H }, !0);
        }
        async function N(H) {
          try {
            return this._compileSchemaEnv(H);
          } catch (M) {
            if (!(M instanceof n.default))
              throw M;
            return F.call(this, M), await z.call(this, M.missingSchema), N.call(this, H);
          }
        }
        function F({ missingSchema: H, missingRef: M }) {
          if (this.refs[H])
            throw new Error(`AnySchema ${H} is loaded but ${M} cannot be resolved`);
        }
        async function z(H) {
          const M = await J.call(this, H);
          this.refs[H] || await P.call(this, M.$schema), this.refs[H] || this.addSchema(M, H, C);
        }
        async function J(H) {
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
      addSchema(k, C, R, m = this.opts.validateSchema) {
        if (Array.isArray(k)) {
          for (const N of k)
            this.addSchema(N, void 0, R, m);
          return this;
        }
        let P;
        if (typeof k == "object") {
          const { schemaId: N } = this.opts;
          if (P = k[N], P !== void 0 && typeof P != "string")
            throw new Error(`schema ${N} must be string`);
        }
        return C = (0, l.normalizeId)(C || P), this._checkUnique(C), this.schemas[C] = this._addSchema(k, R, C, m, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(k, C, R = this.opts.validateSchema) {
        return this.addSchema(k, C, !0, R), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(k, C) {
        if (typeof k == "boolean")
          return !0;
        let R;
        if (R = k.$schema, R !== void 0 && typeof R != "string")
          throw new Error("$schema must be a string");
        if (R = R || this.opts.defaultMeta || this.defaultMeta(), !R)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const m = this.validate(R, k);
        if (!m && C) {
          const P = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(P);
          else
            throw new Error(P);
        }
        return m;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(k) {
        let C;
        for (; typeof (C = g.call(this, k)) == "string"; )
          k = C;
        if (C === void 0) {
          const { schemaId: R } = this.opts, m = new o.SchemaEnv({ schema: {}, schemaId: R });
          if (C = o.resolveSchema.call(this, m, k), !C)
            return;
          this.refs[k] = C;
        }
        return C.validate || this._compileSchemaEnv(C);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(k) {
        if (k instanceof RegExp)
          return this._removeAllSchemas(this.schemas, k), this._removeAllSchemas(this.refs, k), this;
        switch (typeof k) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const C = g.call(this, k);
            return typeof C == "object" && this._cache.delete(C.schema), delete this.schemas[k], delete this.refs[k], this;
          }
          case "object": {
            const C = k;
            this._cache.delete(C);
            let R = k[this.opts.schemaId];
            return R && (R = (0, l.normalizeId)(R), delete this.schemas[R], delete this.refs[R]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(k) {
        for (const C of k)
          this.addKeyword(C);
        return this;
      }
      addKeyword(k, C) {
        let R;
        if (typeof k == "string")
          R = k, typeof C == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), C.keyword = R);
        else if (typeof k == "object" && C === void 0) {
          if (C = k, R = C.keyword, Array.isArray(R) && !R.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (Y.call(this, R, C), !C)
          return (0, p.eachItem)(R, (P) => ne.call(this, P)), this;
        de.call(this, C);
        const m = {
          ...C,
          type: (0, u.getJSONTypes)(C.type),
          schemaType: (0, u.getJSONTypes)(C.schemaType)
        };
        return (0, p.eachItem)(R, m.type.length === 0 ? (P) => ne.call(this, P, m) : (P) => m.type.forEach((N) => ne.call(this, P, m, N))), this;
      }
      getKeyword(k) {
        const C = this.RULES.all[k];
        return typeof C == "object" ? C.definition : !!C;
      }
      // Remove keyword
      removeKeyword(k) {
        const { RULES: C } = this;
        delete C.keywords[k], delete C.all[k];
        for (const R of C.rules) {
          const m = R.rules.findIndex((P) => P.keyword === k);
          m >= 0 && R.rules.splice(m, 1);
        }
        return this;
      }
      // Add format
      addFormat(k, C) {
        return typeof C == "string" && (C = new RegExp(C)), this.formats[k] = C, this;
      }
      errorsText(k = this.errors, { separator: C = ", ", dataVar: R = "data" } = {}) {
        return !k || k.length === 0 ? "No errors" : k.map((m) => `${R}${m.instancePath} ${m.message}`).reduce((m, P) => m + C + P);
      }
      $dataMetaSchema(k, C) {
        const R = this.RULES.all;
        k = JSON.parse(JSON.stringify(k));
        for (const m of C) {
          const P = m.split("/").slice(1);
          let N = k;
          for (const F of P)
            N = N[F];
          for (const F in R) {
            const z = R[F];
            if (typeof z != "object")
              continue;
            const { $data: J } = z.definition, H = N[F];
            J && H && (N[F] = ae(H));
          }
        }
        return k;
      }
      _removeAllSchemas(k, C) {
        for (const R in k) {
          const m = k[R];
          (!C || C.test(R)) && (typeof m == "string" ? delete k[R] : m && !m.meta && (this._cache.delete(m.schema), delete k[R]));
        }
      }
      _addSchema(k, C, R, m = this.opts.validateSchema, P = this.opts.addUsedSchema) {
        let N;
        const { schemaId: F } = this.opts;
        if (typeof k == "object")
          N = k[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof k != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let z = this._cache.get(k);
        if (z !== void 0)
          return z;
        R = (0, l.normalizeId)(N || R);
        const J = l.getSchemaRefs.call(this, k, R);
        return z = new o.SchemaEnv({ schema: k, schemaId: F, meta: C, baseId: R, localRefs: J }), this._cache.set(z.schema, z), P && !R.startsWith("#") && (R && this._checkUnique(R), this.refs[R] = z), m && this.validateSchema(k, !0), z;
      }
      _checkUnique(k) {
        if (this.schemas[k] || this.refs[k])
          throw new Error(`schema with key or id "${k}" already exists`);
      }
      _compileSchemaEnv(k) {
        if (k.meta ? this._compileMetaSchema(k) : o.compileSchema.call(this, k), !k.validate)
          throw new Error("ajv implementation error");
        return k.validate;
      }
      _compileMetaSchema(k) {
        const C = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, k);
        } finally {
          this.opts = C;
        }
      }
    }
    y.ValidationError = r.default, y.MissingRefError = n.default, s.default = y;
    function v(q, k, C, R = "error") {
      for (const m in q) {
        const P = m;
        P in k && this.logger[R](`${C}: option ${m}. ${q[P]}`);
      }
    }
    function g(q) {
      return q = (0, l.normalizeId)(q), this.schemas[q] || this.refs[q];
    }
    function S() {
      const q = this.opts.schemas;
      if (q)
        if (Array.isArray(q))
          this.addSchema(q);
        else
          for (const k in q)
            this.addSchema(q[k], k);
    }
    function A() {
      for (const q in this.opts.formats) {
        const k = this.opts.formats[q];
        k && this.addFormat(q, k);
      }
    }
    function j(q) {
      if (Array.isArray(q)) {
        this.addVocabulary(q);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const k in q) {
        const C = q[k];
        C.keyword || (C.keyword = k), this.addKeyword(C);
      }
    }
    function D() {
      const q = { ...this.opts };
      for (const k of E)
        delete q[k];
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
    const U = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Y(q, k) {
      const { RULES: C } = this;
      if ((0, p.eachItem)(q, (R) => {
        if (C.keywords[R])
          throw new Error(`Keyword ${R} is already defined`);
        if (!U.test(R))
          throw new Error(`Keyword ${R} has invalid name`);
      }), !!k && k.$data && !("code" in k || "validate" in k))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ne(q, k, C) {
      var R;
      const m = k?.post;
      if (C && m)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: P } = this;
      let N = m ? P.post : P.rules.find(({ type: z }) => z === C);
      if (N || (N = { type: C, rules: [] }, P.rules.push(N)), P.keywords[q] = !0, !k)
        return;
      const F = {
        keyword: q,
        definition: {
          ...k,
          type: (0, u.getJSONTypes)(k.type),
          schemaType: (0, u.getJSONTypes)(k.schemaType)
        }
      };
      k.before ? ce.call(this, N, F, k.before) : N.rules.push(F), P.all[q] = F, (R = k.implements) === null || R === void 0 || R.forEach((z) => this.addKeyword(z));
    }
    function ce(q, k, C) {
      const R = q.rules.findIndex((m) => m.keyword === C);
      R >= 0 ? q.rules.splice(R, 0, k) : (q.rules.push(k), this.logger.warn(`rule ${C} is not defined`));
    }
    function de(q) {
      let { metaSchema: k } = q;
      k !== void 0 && (q.$data && this.opts.$data && (k = ae(k)), q.validateSchema = this.compile(k, !0));
    }
    const x = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ae(q) {
      return { anyOf: [q, x] };
    }
  })(At)), At;
}
var Le = {}, Ue = {}, Ge = {}, Pr;
function Yn() {
  if (Pr) return Ge;
  Pr = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const s = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Ge.default = s, Ge;
}
var we = {}, Er;
function Xn() {
  if (Er) return we;
  Er = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.callRef = we.getValidate = void 0;
  const s = Mt(), e = me(), t = X(), r = _e(), n = Bt(), i = ee(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: p, schema: w, it: _ } = u, { baseId: $, schemaEnv: E, validateName: b, opts: f, self: d } = _, { root: c } = E;
      if ((w === "#" || w === "#/") && $ === c.baseId)
        return y();
      const h = n.resolveRef.call(d, c, $, w);
      if (h === void 0)
        throw new s.default(_.opts.uriResolver, $, w);
      if (h instanceof n.SchemaEnv)
        return v(h);
      return g(h);
      function y() {
        if (E === c)
          return l(u, b, E, E.$async);
        const S = p.scopeValue("root", { ref: c });
        return l(u, (0, t._)`${S}.validate`, c, c.$async);
      }
      function v(S) {
        const A = a(u, S);
        l(u, A, S, S.$async);
      }
      function g(S) {
        const A = p.scopeValue("schema", f.code.source === !0 ? { ref: S, code: (0, t.stringify)(S) } : { ref: S }), j = p.name("valid"), D = u.subschema({
          schema: S,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: A,
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
  we.getValidate = a;
  function l(u, p, w, _) {
    const { gen: $, it: E } = u, { allErrors: b, schemaEnv: f, opts: d } = E, c = d.passContext ? r.default.this : t.nil;
    _ ? h() : y();
    function h() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const S = $.let("valid");
      $.try(() => {
        $.code((0, t._)`await ${(0, e.callValidateCode)(u, p, c)}`), g(p), b || $.assign(S, !0);
      }, (A) => {
        $.if((0, t._)`!(${A} instanceof ${E.ValidationError})`, () => $.throw(A)), v(A), b || $.assign(S, !1);
      }), u.ok(S);
    }
    function y() {
      u.result((0, e.callValidateCode)(u, p, c), () => g(p), () => v(p));
    }
    function v(S) {
      const A = (0, t._)`${S}.errors`;
      $.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${A} : ${r.default.vErrors}.concat(${A})`), $.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function g(S) {
      var A;
      if (!E.opts.unevaluated)
        return;
      const j = (A = w?.validate) === null || A === void 0 ? void 0 : A.evaluated;
      if (E.props !== !0)
        if (j && !j.dynamicProps)
          j.props !== void 0 && (E.props = i.mergeEvaluated.props($, j.props, E.props));
        else {
          const D = $.var("props", (0, t._)`${S}.evaluated.props`);
          E.props = i.mergeEvaluated.props($, D, E.props, t.Name);
        }
      if (E.items !== !0)
        if (j && !j.dynamicItems)
          j.items !== void 0 && (E.items = i.mergeEvaluated.items($, j.items, E.items));
        else {
          const D = $.var("items", (0, t._)`${S}.evaluated.items`);
          E.items = i.mergeEvaluated.items($, D, E.items, t.Name);
        }
    }
  }
  return we.callRef = l, we.default = o, we;
}
var Mr;
function Qn() {
  if (Mr) return Ue;
  Mr = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  const s = Yn(), e = Xn(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    s.default,
    e.default
  ];
  return Ue.default = t, Ue;
}
var Ke = {}, Be = {}, Tr;
function Zn() {
  if (Tr) return Be;
  Tr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const s = X(), e = s.operators, t = {
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
      const { keyword: o, data: a, schemaCode: l } = i;
      i.fail$data((0, s._)`${a} ${t[o].fail} ${l} || isNaN(${a})`);
    }
  };
  return Be.default = n, Be;
}
var He = {}, kr;
function ei() {
  if (kr) return He;
  kr = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const s = X(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, s._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: n, data: i, schemaCode: o, it: a } = r, l = a.opts.multipleOfPrecision, u = n.let("res"), p = l ? (0, s._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${l}` : (0, s._)`${u} !== parseInt(${u})`;
      r.fail$data((0, s._)`(${o} === 0 || (${u} = ${i}/${o}, ${p}))`);
    }
  };
  return He.default = t, He;
}
var We = {}, Je = {}, Ar;
function ti() {
  if (Ar) return Je;
  Ar = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  function s(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return Je.default = s, s.code = 'require("ajv/dist/runtime/ucs2length").default', Je;
}
var Rr;
function ri() {
  if (Rr) return We;
  Rr = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = ti(), n = {
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
      const { keyword: o, data: a, schemaCode: l, it: u } = i, p = o === "maxLength" ? s.operators.GT : s.operators.LT, w = u.opts.unicode === !1 ? (0, s._)`${a}.length` : (0, s._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, s._)`${w} ${p} ${l}`);
    }
  };
  return We.default = n, We;
}
var Ye = {}, Nr;
function ni() {
  if (Nr) return Ye;
  Nr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const s = me(), e = X(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: o, schema: a, schemaCode: l, it: u } = n, p = u.opts.unicodeRegExp ? "u" : "", w = o ? (0, e._)`(new RegExp(${l}, ${p}))` : (0, s.usePattern)(n, a);
      n.fail$data((0, e._)`!${w}.test(${i})`);
    }
  };
  return Ye.default = r, Ye;
}
var Xe = {}, Ir;
function ii() {
  if (Ir) return Xe;
  Ir = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const s = X(), t = {
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
  return Xe.default = t, Xe;
}
var Qe = {}, Cr;
function si() {
  if (Cr) return Qe;
  Cr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const s = me(), e = X(), t = ee(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: o, schema: a, schemaCode: l, data: u, $data: p, it: w } = i, { opts: _ } = w;
      if (!p && a.length === 0)
        return;
      const $ = a.length >= _.loopRequired;
      if (w.allErrors ? E() : b(), _.strictRequired) {
        const c = i.parentSchema.properties, { definedProperties: h } = i.it;
        for (const y of a)
          if (c?.[y] === void 0 && !h.has(y)) {
            const v = w.schemaEnv.baseId + w.errSchemaPath, g = `required property "${y}" is not defined at "${v}" (strictRequired)`;
            (0, t.checkStrictMode)(w, g, w.opts.strictRequired);
          }
      }
      function E() {
        if ($ || p)
          i.block$data(e.nil, f);
        else
          for (const c of a)
            (0, s.checkReportMissingProp)(i, c);
      }
      function b() {
        const c = o.let("missing");
        if ($ || p) {
          const h = o.let("valid", !0);
          i.block$data(h, () => d(c, h)), i.ok(h);
        } else
          o.if((0, s.checkMissingProp)(i, a, c)), (0, s.reportMissingProp)(i, c), o.else();
      }
      function f() {
        o.forOf("prop", l, (c) => {
          i.setParams({ missingProperty: c }), o.if((0, s.noPropertyInData)(o, u, c, _.ownProperties), () => i.error());
        });
      }
      function d(c, h) {
        i.setParams({ missingProperty: c }), o.forOf(c, l, () => {
          o.assign(h, (0, s.propertyInData)(o, u, c, _.ownProperties)), o.if((0, e.not)(h), () => {
            i.error(), o.break();
          });
        }, e.nil);
      }
    }
  };
  return Qe.default = n, Qe;
}
var Ze = {}, jr;
function oi() {
  if (jr) return Ze;
  jr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const s = X(), t = {
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
  return Ze.default = t, Ze;
}
var et = {}, tt = {}, qr;
function Ht() {
  if (qr) return tt;
  qr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const s = yn();
  return s.code = 'require("ajv/dist/runtime/equal").default', tt.default = s, tt;
}
var Or;
function ai() {
  if (Or) return et;
  Or = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const s = _t(), e = X(), t = ee(), r = Ht(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: o, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${o} are identical)`,
      params: ({ params: { i: o, j: a } }) => (0, e._)`{i: ${o}, j: ${a}}`
    },
    code(o) {
      const { gen: a, data: l, $data: u, schema: p, parentSchema: w, schemaCode: _, it: $ } = o;
      if (!u && !p)
        return;
      const E = a.let("valid"), b = w.items ? (0, s.getSchemaTypes)(w.items) : [];
      o.block$data(E, f, (0, e._)`${_} === false`), o.ok(E);
      function f() {
        const y = a.let("i", (0, e._)`${l}.length`), v = a.let("j");
        o.setParams({ i: y, j: v }), a.assign(E, !0), a.if((0, e._)`${y} > 1`, () => (d() ? c : h)(y, v));
      }
      function d() {
        return b.length > 0 && !b.some((y) => y === "object" || y === "array");
      }
      function c(y, v) {
        const g = a.name("item"), S = (0, s.checkDataTypes)(b, g, $.opts.strictNumbers, s.DataType.Wrong), A = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${y}--;`, () => {
          a.let(g, (0, e._)`${l}[${y}]`), a.if(S, (0, e._)`continue`), b.length > 1 && a.if((0, e._)`typeof ${g} == "string"`, (0, e._)`${g} += "_"`), a.if((0, e._)`typeof ${A}[${g}] == "number"`, () => {
            a.assign(v, (0, e._)`${A}[${g}]`), o.error(), a.assign(E, !1).break();
          }).code((0, e._)`${A}[${g}] = ${y}`);
        });
      }
      function h(y, v) {
        const g = (0, t.useFunc)(a, r.default), S = a.name("outer");
        a.label(S).for((0, e._)`;${y}--;`, () => a.for((0, e._)`${v} = ${y}; ${v}--;`, () => a.if((0, e._)`${g}(${l}[${y}], ${l}[${v}])`, () => {
          o.error(), a.assign(E, !1).break(S);
        })));
      }
    }
  };
  return et.default = i, et;
}
var rt = {}, Dr;
function ci() {
  if (Dr) return rt;
  Dr = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = Ht(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, s._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: l, schemaCode: u, schema: p } = i;
      l || p && typeof p == "object" ? i.fail$data((0, s._)`!${(0, e.useFunc)(o, t.default)}(${a}, ${u})`) : i.fail((0, s._)`${p} !== ${a}`);
    }
  };
  return rt.default = n, rt;
}
var nt = {}, xr;
function li() {
  if (xr) return nt;
  xr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = Ht(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, s._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: l, schema: u, schemaCode: p, it: w } = i;
      if (!l && u.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = u.length >= w.opts.loopEnum;
      let $;
      const E = () => $ ?? ($ = (0, e.useFunc)(o, t.default));
      let b;
      if (_ || l)
        b = o.let("valid"), i.block$data(b, f);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const c = o.const("vSchema", p);
        b = (0, s.or)(...u.map((h, y) => d(c, y)));
      }
      i.pass(b);
      function f() {
        o.assign(b, !1), o.forOf("v", p, (c) => o.if((0, s._)`${E()}(${a}, ${c})`, () => o.assign(b, !0).break()));
      }
      function d(c, h) {
        const y = u[h];
        return typeof y == "object" && y !== null ? (0, s._)`${E()}(${a}, ${c}[${h}])` : (0, s._)`${a} === ${y}`;
      }
    }
  };
  return nt.default = n, nt;
}
var Vr;
function ui() {
  if (Vr) return Ke;
  Vr = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const s = Zn(), e = ei(), t = ri(), r = ni(), n = ii(), i = si(), o = oi(), a = ai(), l = ci(), u = li(), p = [
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
    l.default,
    u.default
  ];
  return Ke.default = p, Ke;
}
var it = {}, Ae = {}, Fr;
function gn() {
  if (Fr) return Ae;
  Fr = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.validateAdditionalItems = void 0;
  const s = X(), e = ee(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, s.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, s._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: o, it: a } = i, { items: l } = o;
      if (!Array.isArray(l)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      n(i, l);
    }
  };
  function n(i, o) {
    const { gen: a, schema: l, data: u, keyword: p, it: w } = i;
    w.items = !0;
    const _ = a.const("len", (0, s._)`${u}.length`);
    if (l === !1)
      i.setParams({ len: o.length }), i.pass((0, s._)`${_} <= ${o.length}`);
    else if (typeof l == "object" && !(0, e.alwaysValidSchema)(w, l)) {
      const E = a.var("valid", (0, s._)`${_} <= ${o.length}`);
      a.if((0, s.not)(E), () => $(E)), i.ok(E);
    }
    function $(E) {
      a.forRange("i", o.length, _, (b) => {
        i.subschema({ keyword: p, dataProp: b, dataPropType: e.Type.Num }, E), w.allErrors || a.if((0, s.not)(E), () => a.break());
      });
    }
  }
  return Ae.validateAdditionalItems = n, Ae.default = r, Ae;
}
var st = {}, Re = {}, zr;
function vn() {
  if (zr) return Re;
  zr = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.validateTuple = void 0;
  const s = X(), e = ee(), t = me(), r = {
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
    const { gen: l, parentSchema: u, data: p, keyword: w, it: _ } = i;
    b(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(l, a.length, _.items));
    const $ = l.name("valid"), E = l.const("len", (0, s._)`${p}.length`);
    a.forEach((f, d) => {
      (0, e.alwaysValidSchema)(_, f) || (l.if((0, s._)`${E} > ${d}`, () => i.subschema({
        keyword: w,
        schemaProp: d,
        dataProp: d
      }, $)), i.ok($));
    });
    function b(f) {
      const { opts: d, errSchemaPath: c } = _, h = a.length, y = h === f.minItems && (h === f.maxItems || f[o] === !1);
      if (d.strictTuples && !y) {
        const v = `"${w}" is ${h}-tuple, but minItems or maxItems/${o} are not specified or different at path "${c}"`;
        (0, e.checkStrictMode)(_, v, d.strictTuples);
      }
    }
  }
  return Re.validateTuple = n, Re.default = r, Re;
}
var Lr;
function di() {
  if (Lr) return st;
  Lr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const s = vn(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, s.validateTuple)(t, "items")
  };
  return st.default = e, st;
}
var ot = {}, Ur;
function hi() {
  if (Ur) return ot;
  Ur = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = me(), r = gn(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, s.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, s._)`{limit: ${o}}`
    },
    code(o) {
      const { schema: a, parentSchema: l, it: u } = o, { prefixItems: p } = l;
      u.items = !0, !(0, e.alwaysValidSchema)(u, a) && (p ? (0, r.validateAdditionalItems)(o, p) : o.ok((0, t.validateArray)(o)));
    }
  };
  return ot.default = i, ot;
}
var at = {}, Gr;
function fi() {
  if (Gr) return at;
  Gr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
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
      const { gen: i, schema: o, parentSchema: a, data: l, it: u } = n;
      let p, w;
      const { minContains: _, maxContains: $ } = a;
      u.opts.next ? (p = _ === void 0 ? 1 : _, w = $) : p = 1;
      const E = i.const("len", (0, s._)`${l}.length`);
      if (n.setParams({ min: p, max: w }), w === void 0 && p === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (w !== void 0 && p > w) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, o)) {
        let h = (0, s._)`${E} >= ${p}`;
        w !== void 0 && (h = (0, s._)`${h} && ${E} <= ${w}`), n.pass(h);
        return;
      }
      u.items = !0;
      const b = i.name("valid");
      w === void 0 && p === 1 ? d(b, () => i.if(b, () => i.break())) : p === 0 ? (i.let(b, !0), w !== void 0 && i.if((0, s._)`${l}.length > 0`, f)) : (i.let(b, !1), f()), n.result(b, () => n.reset());
      function f() {
        const h = i.name("_valid"), y = i.let("count", 0);
        d(h, () => i.if(h, () => c(y)));
      }
      function d(h, y) {
        i.forRange("i", 0, E, (v) => {
          n.subschema({
            keyword: "contains",
            dataProp: v,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, h), y();
        });
      }
      function c(h) {
        i.code((0, s._)`${h}++`), w === void 0 ? i.if((0, s._)`${h} >= ${p}`, () => i.assign(b, !0).break()) : (i.if((0, s._)`${h} > ${w}`, () => i.assign(b, !1).break()), p === 1 ? i.assign(b, !0) : i.if((0, s._)`${h} >= ${p}`, () => i.assign(b, !0)));
      }
    }
  };
  return at.default = r, at;
}
var Vt = {}, Kr;
function pi() {
  return Kr || (Kr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.validateSchemaDeps = s.validatePropertyDeps = s.error = void 0;
    const e = X(), t = ee(), r = me();
    s.error = {
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
      error: s.error,
      code(l) {
        const [u, p] = i(l);
        o(l, u), a(l, p);
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
    function o(l, u = l.schema) {
      const { gen: p, data: w, it: _ } = l;
      if (Object.keys(u).length === 0)
        return;
      const $ = p.let("missing");
      for (const E in u) {
        const b = u[E];
        if (b.length === 0)
          continue;
        const f = (0, r.propertyInData)(p, w, E, _.opts.ownProperties);
        l.setParams({
          property: E,
          depsCount: b.length,
          deps: b.join(", ")
        }), _.allErrors ? p.if(f, () => {
          for (const d of b)
            (0, r.checkReportMissingProp)(l, d);
        }) : (p.if((0, e._)`${f} && (${(0, r.checkMissingProp)(l, b, $)})`), (0, r.reportMissingProp)(l, $), p.else());
      }
    }
    s.validatePropertyDeps = o;
    function a(l, u = l.schema) {
      const { gen: p, data: w, keyword: _, it: $ } = l, E = p.name("valid");
      for (const b in u)
        (0, t.alwaysValidSchema)($, u[b]) || (p.if(
          (0, r.propertyInData)(p, w, b, $.opts.ownProperties),
          () => {
            const f = l.subschema({ keyword: _, schemaProp: b }, E);
            l.mergeValidEvaluated(f, E);
          },
          () => p.var(E, !0)
          // TODO var
        ), l.ok(E));
    }
    s.validateSchemaDeps = a, s.default = n;
  })(Vt)), Vt;
}
var ct = {}, Br;
function mi() {
  if (Br) return ct;
  Br = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, s._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: i, schema: o, data: a, it: l } = n;
      if ((0, e.alwaysValidSchema)(l, o))
        return;
      const u = i.name("valid");
      i.forIn("key", a, (p) => {
        n.setParams({ propertyName: p }), n.subschema({
          keyword: "propertyNames",
          data: p,
          dataTypes: ["string"],
          propertyName: p,
          compositeRule: !0
        }, u), i.if((0, s.not)(u), () => {
          n.error(!0), l.allErrors || i.break();
        });
      }), n.ok(u);
    }
  };
  return ct.default = r, ct;
}
var lt = {}, Hr;
function bn() {
  if (Hr) return lt;
  Hr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const s = me(), e = X(), t = _e(), r = ee(), i = {
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
      const { gen: a, schema: l, parentSchema: u, data: p, errsCount: w, it: _ } = o;
      if (!w)
        throw new Error("ajv implementation error");
      const { allErrors: $, opts: E } = _;
      if (_.props = !0, E.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, l))
        return;
      const b = (0, s.allSchemaProperties)(u.properties), f = (0, s.allSchemaProperties)(u.patternProperties);
      d(), o.ok((0, e._)`${w} === ${t.default.errors}`);
      function d() {
        a.forIn("key", p, (g) => {
          !b.length && !f.length ? y(g) : a.if(c(g), () => y(g));
        });
      }
      function c(g) {
        let S;
        if (b.length > 8) {
          const A = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          S = (0, s.isOwnProperty)(a, A, g);
        } else b.length ? S = (0, e.or)(...b.map((A) => (0, e._)`${g} === ${A}`)) : S = e.nil;
        return f.length && (S = (0, e.or)(S, ...f.map((A) => (0, e._)`${(0, s.usePattern)(o, A)}.test(${g})`))), (0, e.not)(S);
      }
      function h(g) {
        a.code((0, e._)`delete ${p}[${g}]`);
      }
      function y(g) {
        if (E.removeAdditional === "all" || E.removeAdditional && l === !1) {
          h(g);
          return;
        }
        if (l === !1) {
          o.setParams({ additionalProperty: g }), o.error(), $ || a.break();
          return;
        }
        if (typeof l == "object" && !(0, r.alwaysValidSchema)(_, l)) {
          const S = a.name("valid");
          E.removeAdditional === "failing" ? (v(g, S, !1), a.if((0, e.not)(S), () => {
            o.reset(), h(g);
          })) : (v(g, S), $ || a.if((0, e.not)(S), () => a.break()));
        }
      }
      function v(g, S, A) {
        const j = {
          keyword: "additionalProperties",
          dataProp: g,
          dataPropType: r.Type.Str
        };
        A === !1 && Object.assign(j, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(j, S);
      }
    }
  };
  return lt.default = i, lt;
}
var ut = {}, Wr;
function yi() {
  if (Wr) return ut;
  Wr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const s = Et(), e = me(), t = ee(), r = bn(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, parentSchema: l, data: u, it: p } = i;
      p.opts.removeAdditional === "all" && l.additionalProperties === void 0 && r.default.code(new s.KeywordCxt(p, r.default, "additionalProperties"));
      const w = (0, e.allSchemaProperties)(a);
      for (const f of w)
        p.definedProperties.add(f);
      p.opts.unevaluated && w.length && p.props !== !0 && (p.props = t.mergeEvaluated.props(o, (0, t.toHash)(w), p.props));
      const _ = w.filter((f) => !(0, t.alwaysValidSchema)(p, a[f]));
      if (_.length === 0)
        return;
      const $ = o.name("valid");
      for (const f of _)
        E(f) ? b(f) : (o.if((0, e.propertyInData)(o, u, f, p.opts.ownProperties)), b(f), p.allErrors || o.else().var($, !0), o.endIf()), i.it.definedProperties.add(f), i.ok($);
      function E(f) {
        return p.opts.useDefaults && !p.compositeRule && a[f].default !== void 0;
      }
      function b(f) {
        i.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, $);
      }
    }
  };
  return ut.default = n, ut;
}
var dt = {}, Jr;
function gi() {
  if (Jr) return dt;
  Jr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const s = me(), e = X(), t = ee(), r = ee(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, data: l, parentSchema: u, it: p } = i, { opts: w } = p, _ = (0, s.allSchemaProperties)(a), $ = _.filter((y) => (0, t.alwaysValidSchema)(p, a[y]));
      if (_.length === 0 || $.length === _.length && (!p.opts.unevaluated || p.props === !0))
        return;
      const E = w.strictSchema && !w.allowMatchingProperties && u.properties, b = o.name("valid");
      p.props !== !0 && !(p.props instanceof e.Name) && (p.props = (0, r.evaluatedPropsToName)(o, p.props));
      const { props: f } = p;
      d();
      function d() {
        for (const y of _)
          E && c(y), p.allErrors ? h(y) : (o.var(b, !0), h(y), o.if(b));
      }
      function c(y) {
        for (const v in E)
          new RegExp(y).test(v) && (0, t.checkStrictMode)(p, `property ${v} matches pattern ${y} (use allowMatchingProperties)`);
      }
      function h(y) {
        o.forIn("key", l, (v) => {
          o.if((0, e._)`${(0, s.usePattern)(i, y)}.test(${v})`, () => {
            const g = $.includes(y);
            g || i.subschema({
              keyword: "patternProperties",
              schemaProp: y,
              dataProp: v,
              dataPropType: r.Type.Str
            }, b), p.opts.unevaluated && f !== !0 ? o.assign((0, e._)`${f}[${v}]`, !0) : !g && !p.allErrors && o.if((0, e.not)(b), () => o.break());
          });
        });
      }
    }
  };
  return dt.default = n, dt;
}
var ht = {}, Yr;
function vi() {
  if (Yr) return ht;
  Yr = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const s = ee(), e = {
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
  return ht.default = e, ht;
}
var ft = {}, Xr;
function bi() {
  if (Xr) return ft;
  Xr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: me().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return ft.default = e, ft;
}
var pt = {}, Qr;
function wi() {
  if (Qr) return pt;
  Qr = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, s._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: i, schema: o, parentSchema: a, it: l } = n;
      if (!Array.isArray(o))
        throw new Error("ajv implementation error");
      if (l.opts.discriminator && a.discriminator)
        return;
      const u = o, p = i.let("valid", !1), w = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: w }), i.block($), n.result(p, () => n.reset(), () => n.error(!0));
      function $() {
        u.forEach((E, b) => {
          let f;
          (0, e.alwaysValidSchema)(l, E) ? i.var(_, !0) : f = n.subschema({
            keyword: "oneOf",
            schemaProp: b,
            compositeRule: !0
          }, _), b > 0 && i.if((0, s._)`${_} && ${p}`).assign(p, !1).assign(w, (0, s._)`[${w}, ${b}]`).else(), i.if(_, () => {
            i.assign(p, !0), i.assign(w, b), f && n.mergeEvaluated(f, s.Name);
          });
        });
      }
    }
  };
  return pt.default = r, pt;
}
var mt = {}, Zr;
function $i() {
  if (Zr) return mt;
  Zr = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = ee(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const o = r.name("valid");
      n.forEach((a, l) => {
        if ((0, s.alwaysValidSchema)(i, a))
          return;
        const u = t.subschema({ keyword: "allOf", schemaProp: l }, o);
        t.ok(o), t.mergeEvaluated(u);
      });
    }
  };
  return mt.default = e, mt;
}
var yt = {}, en;
function _i() {
  if (en) return yt;
  en = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, s.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, s._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: o, parentSchema: a, it: l } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(l, '"if" without "then" and "else" is ignored');
      const u = n(l, "then"), p = n(l, "else");
      if (!u && !p)
        return;
      const w = o.let("valid", !0), _ = o.name("_valid");
      if ($(), i.reset(), u && p) {
        const b = o.let("ifClause");
        i.setParams({ ifClause: b }), o.if(_, E("then", b), E("else", b));
      } else u ? o.if(_, E("then")) : o.if((0, s.not)(_), E("else"));
      i.pass(w, () => i.error(!0));
      function $() {
        const b = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(b);
      }
      function E(b, f) {
        return () => {
          const d = i.subschema({ keyword: b }, _);
          o.assign(w, _), i.mergeValidEvaluated(d, w), f ? o.assign(f, (0, s._)`${b}`) : i.setParams({ ifClause: b });
        };
      }
    }
  };
  function n(i, o) {
    const a = i.schema[o];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return yt.default = r, yt;
}
var gt = {}, tn;
function Si() {
  if (tn) return gt;
  tn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const s = ee(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, s.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return gt.default = e, gt;
}
var rn;
function Pi() {
  if (rn) return it;
  rn = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const s = gn(), e = di(), t = vn(), r = hi(), n = fi(), i = pi(), o = mi(), a = bn(), l = yi(), u = gi(), p = vi(), w = bi(), _ = wi(), $ = $i(), E = _i(), b = Si();
  function f(d = !1) {
    const c = [
      // any
      p.default,
      w.default,
      _.default,
      $.default,
      E.default,
      b.default,
      // object
      o.default,
      a.default,
      i.default,
      l.default,
      u.default
    ];
    return d ? c.push(e.default, r.default) : c.push(s.default, t.default), c.push(n.default), c;
  }
  return it.default = f, it;
}
var vt = {}, bt = {}, nn;
function Ei() {
  if (nn) return bt;
  nn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const s = X(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, s._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: o, $data: a, schema: l, schemaCode: u, it: p } = r, { opts: w, errSchemaPath: _, schemaEnv: $, self: E } = p;
      if (!w.validateFormats)
        return;
      a ? b() : f();
      function b() {
        const d = i.scopeValue("formats", {
          ref: E.formats,
          code: w.code.formats
        }), c = i.const("fDef", (0, s._)`${d}[${u}]`), h = i.let("fType"), y = i.let("format");
        i.if((0, s._)`typeof ${c} == "object" && !(${c} instanceof RegExp)`, () => i.assign(h, (0, s._)`${c}.type || "string"`).assign(y, (0, s._)`${c}.validate`), () => i.assign(h, (0, s._)`"string"`).assign(y, c)), r.fail$data((0, s.or)(v(), g()));
        function v() {
          return w.strictSchema === !1 ? s.nil : (0, s._)`${u} && !${y}`;
        }
        function g() {
          const S = $.$async ? (0, s._)`(${c}.async ? await ${y}(${o}) : ${y}(${o}))` : (0, s._)`${y}(${o})`, A = (0, s._)`(typeof ${y} == "function" ? ${S} : ${y}.test(${o}))`;
          return (0, s._)`${y} && ${y} !== true && ${h} === ${n} && !${A}`;
        }
      }
      function f() {
        const d = E.formats[l];
        if (!d) {
          v();
          return;
        }
        if (d === !0)
          return;
        const [c, h, y] = g(d);
        c === n && r.pass(S());
        function v() {
          if (w.strictSchema === !1) {
            E.logger.warn(A());
            return;
          }
          throw new Error(A());
          function A() {
            return `unknown format "${l}" ignored in schema at path "${_}"`;
          }
        }
        function g(A) {
          const j = A instanceof RegExp ? (0, s.regexpCode)(A) : w.code.formats ? (0, s._)`${w.code.formats}${(0, s.getProperty)(l)}` : void 0, D = i.scopeValue("formats", { key: l, ref: A, code: j });
          return typeof A == "object" && !(A instanceof RegExp) ? [A.type || "string", A.validate, (0, s._)`${D}.validate`] : ["string", A, D];
        }
        function S() {
          if (typeof d == "object" && !(d instanceof RegExp) && d.async) {
            if (!$.$async)
              throw new Error("async format in sync schema");
            return (0, s._)`await ${y}(${o})`;
          }
          return typeof h == "function" ? (0, s._)`${y}(${o})` : (0, s._)`${y}.test(${o})`;
        }
      }
    }
  };
  return bt.default = t, bt;
}
var sn;
function Mi() {
  if (sn) return vt;
  sn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const e = [Ei().default];
  return vt.default = e, vt;
}
var Te = {}, on;
function Ti() {
  return on || (on = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.contentVocabulary = Te.metadataVocabulary = void 0, Te.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Te.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Te;
}
var an;
function ki() {
  if (an) return Le;
  an = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const s = Qn(), e = ui(), t = Pi(), r = Mi(), n = Ti(), i = [
    s.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return Le.default = i, Le;
}
var wt = {}, qe = {}, cn;
function Ai() {
  if (cn) return qe;
  cn = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.DiscrError = void 0;
  var s;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(s || (qe.DiscrError = s = {})), qe;
}
var ln;
function Ri() {
  if (ln) return wt;
  ln = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const s = X(), e = Ai(), t = Bt(), r = Mt(), n = ee(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: l } }) => a === e.DiscrError.Tag ? `tag "${l}" must be string` : `value of tag "${l}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: l, tagName: u } }) => (0, s._)`{error: ${a}, tag: ${u}, tagValue: ${l}}`
    },
    code(a) {
      const { gen: l, data: u, schema: p, parentSchema: w, it: _ } = a, { oneOf: $ } = w;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const E = p.propertyName;
      if (typeof E != "string")
        throw new Error("discriminator: requires propertyName");
      if (p.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!$)
        throw new Error("discriminator: requires oneOf keyword");
      const b = l.let("valid", !1), f = l.const("tag", (0, s._)`${u}${(0, s.getProperty)(E)}`);
      l.if((0, s._)`typeof ${f} == "string"`, () => d(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: f, tagName: E })), a.ok(b);
      function d() {
        const y = h();
        l.if(!1);
        for (const v in y)
          l.elseIf((0, s._)`${f} === ${v}`), l.assign(b, c(y[v]));
        l.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: f, tagName: E }), l.endIf();
      }
      function c(y) {
        const v = l.name("valid"), g = a.subschema({ keyword: "oneOf", schemaProp: y }, v);
        return a.mergeEvaluated(g, s.Name), v;
      }
      function h() {
        var y;
        const v = {}, g = A(w);
        let S = !0;
        for (let V = 0; V < $.length; V++) {
          let B = $[V];
          if (B?.$ref && !(0, n.schemaHasRulesButRef)(B, _.self.RULES)) {
            const Y = B.$ref;
            if (B = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, Y), B instanceof t.SchemaEnv && (B = B.schema), B === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, Y);
          }
          const U = (y = B?.properties) === null || y === void 0 ? void 0 : y[E];
          if (typeof U != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${E}"`);
          S = S && (g || A(B)), j(U, V);
        }
        if (!S)
          throw new Error(`discriminator: "${E}" must be required`);
        return v;
        function A({ required: V }) {
          return Array.isArray(V) && V.includes(E);
        }
        function j(V, B) {
          if (V.const)
            D(V.const, B);
          else if (V.enum)
            for (const U of V.enum)
              D(U, B);
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
  return wt.default = o, wt;
}
const Ni = "http://json-schema.org/draft-07/schema#", Ii = "http://json-schema.org/draft-07/schema#", Ci = "Core schema meta-schema", ji = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, qi = ["object", "boolean"], Oi = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Di = {
  $schema: Ni,
  $id: Ii,
  title: Ci,
  definitions: ji,
  type: qi,
  properties: Oi,
  default: !0
};
var un;
function xi() {
  return un || (un = 1, (function(s, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Jn(), r = ki(), n = Ri(), i = Di, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class l extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const E = this.opts.$data ? this.$dataMetaSchema(i, o) : i;
        this.addMetaSchema(E, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = l, s.exports = e = l, s.exports.Ajv = l, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = l;
    var u = Et();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var p = X();
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
    var w = Kt();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return w.default;
    } });
    var _ = Mt();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(De, De.exports)), De.exports;
}
var Vi = xi();
const Fi = /* @__PURE__ */ Nn(Vi), zi = "http://json-schema.org/draft-07/schema#", Li = "JMON Composition (Multi-Track, Extended)", Ui = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values should use the bars:beats:ticks format (e.g., '2:1:240') for precise musical timing. This format is independent of BPM and follows professional DAW standards.", Gi = "object", Ki = ["format", "version", "bpm", "sequences"], Bi = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmonTone","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '2:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '4:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format where the global loop should end (e.g., '8:0:0')."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"sequences":{"type":"array","description":"Musical sequences (tracks or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0', '1:3.5:240'). Preferred format for precise musical timing."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"number","description":"Legacy: Time in beats (deprecated, use bars:beats:ticks format instead)."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","description":"Articulation (e.g., 'staccato', 'accent')."},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"sequences":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all sequences unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all sequences."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Hi = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, Wi = !1, Ji = [{ description: "Basic modulation example with pitch bend and modulation wheel", composition: { format: "jmonTone", version: "1.0", bpm: 120, synthConfig: { type: "Synth", modulationTarget: "filter" }, audioGraph: [{ id: "master", type: "Destination", options: {} }], connections: [], sequences: [{ label: "Modulation Demo", notes: [{ pitch: "C4", time: "0:0:0", duration: "2n", velocity: 0.8, modulations: [{ type: "pitchBend", value: -4096, time: "0:0:0" }, { type: "pitchBend", value: 4096, time: "0:1.5:0" }] }, { pitch: "G4", time: "0:2:0", duration: "2n", velocity: 0.8, modulations: [{ type: "cc", controller: 1, value: 0, time: "0:0:0" }, { type: "cc", controller: 1, value: 127, time: "0:1.5:0" }] }] }] } }, { description: "Multi-level automation example with interpolation", composition: { format: "jmonTone", version: "1.0", bpm: 120, audioGraph: [{ id: "master", type: "Destination", options: {} }, { id: "reverb", type: "Reverb", options: { wet: 0.3 } }], connections: [["reverb", "master"]], automation: { enabled: !0, global: [{ id: "master-volume", name: "Master Volume", target: "synth.volume", level: "global", range: [0, 1], interpolation: "cubic", anchorPoints: [{ time: "0:0:0", value: 0 }, { time: "2:0:0", value: 0.8 }, { time: "6:0:0", value: 0.6 }, { time: "8:0:0", value: 0 }] }], sequences: { lead: [{ id: "lead-filter", name: "Lead Filter Sweep", target: "synth.filter.frequency", level: "sequence", sequenceId: "lead", range: [200, 8e3], interpolation: "daw", anchorPoints: [{ time: "0:0:0", value: 200, tangent: 0 }, { time: "1:0:0", value: 2e3, tangent: 1.5 }, { time: "3:0:0", value: 8e3, tangent: 0 }] }] } }, sequences: [{ label: "lead", notes: [{ pitch: "C4", time: "0:0:0", duration: "1n", velocity: 0.8 }, { pitch: "E4", time: "1:0:0", duration: "1n", velocity: 0.7 }, { pitch: "G4", time: "2:0:0", duration: "1n", velocity: 0.9 }] }] } }, { description: "Vibrato modulation example", composition: { format: "jmonTone", version: "1.0", bpm: 120, audioGraph: [{ id: "master", type: "Destination", options: {} }], connections: [], sequences: [{ label: "Vibrato Demo", synth: { type: "Synth", modulationTarget: "vibrato" }, notes: [{ pitch: "A4", time: "0:0:0", duration: "1n", velocity: 0.8, modulations: [{ type: "cc", controller: 1, value: 0, time: "0:0:0" }, { type: "cc", controller: 1, value: 127, time: "0:3:0" }] }] }] } }], Yi = {
  $schema: zi,
  title: Li,
  description: Ui,
  type: Gi,
  required: Ki,
  properties: Bi,
  definitions: Hi,
  additionalProperties: Wi,
  examples: Ji
};
class Wt {
  constructor(e = Yi) {
    this.ajv = new Fi({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e)), r = this.validate(t);
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
class Xi {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new Wt(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(e);
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
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, o = r[2] || 0, a = 60 / t, l = a * 4, u = a / 480;
      return n * l + i * a + o * u;
    }
    if (e.match(/^\d+[nthq]$/)) {
      const r = parseInt(e), n = e.slice(-1), i = 60 / t;
      switch (n) {
        case "n":
          return i * (4 / r);
        // note values
        case "t":
          return i * (4 / r) * (2 / 3);
        // triplets
        case "h":
          return i * 2;
        // half note
        case "q":
          return i;
        // quarter note
        default:
          return i;
      }
    }
    return parseFloat(e) || 0;
  }
  /**
   * Convert a jmon composition to ABC notation
   * @param {Object} composition - jmon composition object or any compatible format
   * @returns {string} ABC notation string
   */
  static convertToAbc(e) {
    const t = { ...e };
    e.tracks && !e.sequences && (t.sequences = e.tracks.map((n) => ({
      ...n,
      notes: n.sequence || n.notes || []
    })));
    let r = "";
    if (r += this.generateAbcHeader(t), t.sequences && t.sequences.length > 1) {
      t.sequences.forEach((i, o) => {
        r += `V:${o + 1} name="${i.label || `Voice ${o + 1}`}"
`;
      });
      const n = "%%score " + t.sequences.map((i, o) => `V:${o + 1}`).join(" ");
      r += n + `
`;
    }
    return t.sequences && t.sequences.length > 0 && (t.sequences.length > 1 ? r += this.generateMultiVoiceAbc(t) : r += this.generateSingleVoiceAbc(t.sequences[0], t)), r;
  }
  /**
   * Generate ABC header section
   * @param {Object} composition - jmon composition
   * @returns {string} ABC header
   */
  static generateAbcHeader(e) {
    let t = "";
    t += `X:1
`;
    const r = e.metadata?.name || "Untitled";
    t += `T:${r}
`, e.metadata?.author && (t += `C:${e.metadata.author}
`), e.metadata?.description && (t += `N:${e.metadata.description}
`), t += `S:Generated from jmon format
`;
    const n = e.timeSignature || "4/4";
    t += `M:${n}
`, t += `L:1/4
`;
    const i = e.bpm || 120;
    t += `Q:1/4=${i}
`, e.tempoMap && e.tempoMap.length > 0 && (t += `% Tempo changes:
`, e.tempoMap.forEach((a) => {
      t += `% Time ${a.time}: ${a.bpm} BPM
`;
    }));
    const o = e.keySignature || "C";
    return t += `K:${this.convertKeySignature(o)}
`, e.keySignatureMap && e.keySignatureMap.length > 0 && (t += `% Key changes:
`, e.keySignatureMap.forEach((a) => {
      t += `% Time ${a.time}: ${this.convertKeySignature(a.keySignature)}
`;
    })), t;
  }
  /**
   * Convert jmon key signature to ABC key signature
   * @param {string} keySignature - jmon key signature (e.g., 'C', 'Am', 'F#')
   * @returns {string} ABC key signature
   */
  static convertKeySignature(e) {
    return {
      C: "C",
      G: "G",
      D: "D",
      A: "A",
      E: "E",
      B: "B",
      "F#": "F#",
      "C#": "C#",
      F: "F",
      Bb: "Bb",
      Eb: "Eb",
      Ab: "Ab",
      Db: "Db",
      Gb: "Gb",
      Cb: "Cb",
      // Minor keys
      Am: "Am",
      Em: "Em",
      Bm: "Bm",
      "F#m": "F#m",
      "C#m": "C#m",
      "G#m": "G#m",
      "D#m": "D#m",
      "A#m": "A#m",
      Dm: "Dm",
      Gm: "Gm",
      Cm: "Cm",
      Fm: "Fm",
      Bbm: "Bbm",
      Ebm: "Ebm",
      Abm: "Abm"
    }[e] || "C";
  }
  /**
   * Generate single voice ABC notation
   * @param {Object} sequence - jmon sequence
   * @param {Object} composition - full composition for context
   * @returns {string} ABC notation
   */
  static generateSingleVoiceAbc(e, t) {
    let r = "";
    return [...e.notes].sort((i, o) => {
      const a = this.parseTimeString(i.time, t.bpm || 120), l = this.parseTimeString(o.time, t.bpm || 120);
      return a - l;
    }).forEach((i, o) => {
      o > 0 && (r += " "), r += this.convertNoteToAbcSimple(i, t);
    }), r += " |]", r;
  }
  /**
   * Convert a single note pitch to ABC notation
   * @param {string} pitch - note pitch (e.g., "C4", "D#5")
   * @returns {string} ABC note
   */
  static convertSingleNoteToAbc(e) {
    if (!e || typeof e != "string") return "C";
    const t = e.match(/^([A-Ga-g])([#b]?)(\d+)$/);
    if (!t) return "C";
    const [, r, n, i] = t, o = parseInt(i);
    let a = r.toUpperCase();
    if (n === "#" && (a = "^" + a), n === "b" && (a = "_" + a), o <= 3) {
      a = a.toUpperCase();
      for (let l = 3; l > o; l--)
        a += ",";
    } else if (o >= 5) {
      a = a.toLowerCase();
      for (let l = 5; l <= o; l++)
        a += "'";
    } else o === 4 && (a = a.toUpperCase());
    return a;
  }
  /**
   * Simple note conversion without complex formatting
   */
  static convertNoteToAbcSimple(e, t) {
    let r = "";
    if (e.articulation === "glissando" && e.glissTarget !== void 0) {
      const i = this.convertSingleNoteToAbc(e.pitch);
      let o = e.duration;
      return typeof e.duration == "string" && (o = this.parseTimeString(e.duration, t.bpm || 120)), r = `${i}!slide!${this.durationToAbcNotation(o, t.bpm || 120)}`, r;
    }
    Array.isArray(e.pitch) ? (r += "[", e.pitch.forEach((i, o) => {
      o > 0 && (r += ""), r += this.convertSingleNoteToAbc(i);
    }), r += "]") : r += this.convertSingleNoteToAbc(e.pitch);
    let n = e.duration;
    if (typeof e.duration == "string" && (n = this.parseTimeString(e.duration, t.bpm || 120)), r += this.durationToAbcNotation(n, t.bpm || 120), e.articulation && e.articulation !== "glissando")
      switch (e.articulation) {
        case "staccato":
          r = `${r}!staccato!`;
          break;
        case "accent":
          r = `${r}!accent!`;
          break;
        case "tenuto":
          r = `${r}!tenuto!`;
          break;
      }
    return r;
  }
  /**
   * Generate multi-voice ABC notation
   * @param {Object} composition - jmon composition
   * @returns {string} ABC notation
   */
  static generateMultiVoiceAbc(e) {
    let t = "";
    return e.sequences.forEach((r, n) => {
      t += `V:${n + 1} name="${r.label || `Voice ${n + 1}`}"
`, t += this.generateSingleVoiceAbc(r, e), t += `
`;
    }), t;
  }
  /**
   * Convert duration to ABC notation
   * @param {number} duration - duration in seconds
   * @param {number} bpm - beats per minute
   * @returns {string} ABC duration notation
   */
  static durationToAbcNotation(e, t) {
    const r = e;
    if (Math.abs(r - 4) < 0.1) return "4";
    if (Math.abs(r - 2) < 0.1) return "2";
    if (Math.abs(r - 1) < 0.1) return "";
    if (Math.abs(r - 0.5) < 0.1) return "/2";
    if (Math.abs(r - 0.25) < 0.1) return "/4";
    if (Math.abs(r - 0.125) < 0.1) return "/8";
    if (Math.abs(r - 1.5) < 0.1) return "3/2";
    if (Math.abs(r - 0.75) < 0.1) return "3/4";
    if (Math.abs(r - 3) < 0.1) return "3";
    if (Math.abs(r - 2 / 3) < 0.1) return "2/3";
    if (Math.abs(r - 1 / 3) < 0.1) return "/3";
    const n = Math.round(r * 8);
    return n === 8 ? "" : `${n}/8`;
  }
  /**
   * Convert duration to ABC rest notation
   * @param {number} duration - rest duration in seconds
   * @param {number} bpm - beats per minute
   * @returns {string} ABC rest notation
   */
  static durationToAbcRest(e, t) {
    return "z" + this.durationToAbcNotation(e, t);
  }
  /**
   * Export ABC notation as downloadable file
   * @param {string} abc - ABC notation string
   * @param {string} filename - filename for download
   */
  static exportAbcAsFile(e, t = "composition.abc") {
    const r = new Blob([e], { type: "text/plain" }), n = URL.createObjectURL(r), i = document.createElement("a");
    i.href = n, i.download = t, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL(n);
  }
  /**
   * Convert jmon composition to ABC and download
   * @param {Object} composition - jmon composition
   * @param {string} filename - Optional filename
   */
  static convertAndDownload(e, t) {
    try {
      const r = this.convertToAbc(e), n = t || `${e.metadata?.name || "composition"}.abc`;
      return this.exportAbcAsFile(r, n), console.log(`✅ ABC file "${n}" exported successfully`), r;
    } catch (r) {
      throw console.error("❌ Error converting to ABC:", r), r;
    }
  }
  /**
   * Analyze jmon composition for ABC conversion compatibility
   * @param {Object} composition - jmon composition
   * @returns {Object} Analysis report
   */
  static analyzeForAbc(e) {
    const t = {
      voices: e.sequences?.length || 0,
      totalNotes: 0,
      chords: 0,
      microtuning: 0,
      modulations: 0,
      tempoChanges: e.tempoMap?.length || 0,
      keyChanges: e.keySignatureMap?.length || 0,
      warnings: [],
      recommendations: []
    };
    return e.sequences && e.sequences.forEach((r, n) => {
      t.totalNotes += r.notes?.length || 0, r.notes?.forEach((i) => {
        Array.isArray(i.note) && t.chords++, i.microtuning && t.microtuning++, i.modulations && (t.modulations += i.modulations.length);
      }), r.effects && r.effects.length > 0 && t.warnings.push(`Voice ${n + 1} (${r.label}): Effects not supported in ABC notation`);
    }), t.microtuning > 0 && t.recommendations.push("Consider using standard tuning for better ABC compatibility"), t.modulations > 0 && t.recommendations.push("Modulations will be converted to ornaments - review output for accuracy"), e.audioGraph && e.audioGraph.length > 1 && t.warnings.push("Audio routing and synthesis parameters will be lost in ABC conversion"), t;
  }
  /**
   * Generate ABC notation with lyrics from annotations
   * @param {Object} composition - jmon composition with annotations or any compatible format
   * @returns {string} ABC notation with lyrics
   */
  static convertWithLyrics(e) {
    const t = e;
    let r = this.convertToAbc(e);
    if (t.annotations && Array.isArray(t.annotations)) {
      const n = t.annotations.filter((o) => o.type === "lyric").sort((o, a) => {
        const l = this.parseTimeString(o.time, t.bpm || 120), u = this.parseTimeString(a.time, t.bpm || 120);
        return l - u;
      });
      n.length > 0 && (r += `
w: `, n.forEach((o, a) => {
        a > 0 && (r += " "), r += o.text;
      }), r += `
`);
      const i = t.annotations.filter((o) => o.type === "marker" || o.type === "rehearsal").sort((o, a) => {
        const l = this.parseTimeString(o.time, t.bpm || 120), u = this.parseTimeString(a.time, t.bpm || 120);
        return l - u;
      });
      i.length > 0 && (r += `
% Rehearsal marks and markers:
`, i.forEach((o) => {
        r += `% Time ${o.time}: ${o.text}
`;
      }));
    }
    return r;
  }
}
function Qi(s) {
  return Xi.convertToAbc(s);
}
class Zi {
  static VERSION = "1.0";
  static FORMAT_IDENTIFIER = "jmonTone";
  /**
   * Convert a jmon composition to ABC notation (static import for browser ESM)
   * @param {Object} composition - JMON composition object
   * @returns {Promise<string>} ABC notation string
   */
  static async convertToAbc(e) {
    return Qi(e);
  }
  /**
   * Create a player UI for a jmon composition
   * Note: Use the main export `createPlayer` from jmon-studio instead
   * @param {Object} composition - JMON composition object
   * @param {Object} [options={}] - Player options
   * @returns {Object} Player instance
   * @deprecated Use createPlayer from main jmon-studio export instead
   */
  static createPlayer(e, t = {}) {
    if (console.warn("JmonTone.createPlayer is deprecated. Use createPlayer from main jmon-studio export instead."), typeof createPlayer < "u")
      return createPlayer(e, t);
    throw new Error("createPlayer not available. Import createPlayer directly from jmon-studio.");
  }
  /**
   * Convert MIDI note number to note name (e.g., 60 -> "C4")
   * @param {number} midiNote - MIDI note number (0-127)
   * @returns {string} Note name
   */
  static midiNoteToNoteName(e) {
    if (typeof e != "number" || e < 0 || e > 127)
      return console.warn(`Invalid MIDI note number: ${e}. Must be 0-127.`), "C4";
    const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], r = Math.floor(e / 12) - 1, n = e % 12;
    return t[n] + r;
  }
  /**
   * Convert note name to MIDI note number (e.g., "C4" -> 60)
   * @param {string} noteName - Note name (e.g., "C4", "F#3")
   * @returns {number} MIDI note number
   */
  static noteNameToMidiNote(e) {
    try {
      const t = /^([A-Ga-g])([#b]?)(-?\d+)$/, r = e.match(t);
      if (!r)
        return console.warn(`Invalid note name: ${e}`), 60;
      const [, n, i, o] = r, a = parseInt(o, 10);
      let u = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11
      }[n.toUpperCase()];
      return i === "#" ? u += 1 : i === "b" && (u -= 1), Math.max(0, Math.min(127, (a + 1) * 12 + u));
    } catch (t) {
      return console.error(`Error converting note name ${e}:`, t), 60;
    }
  }
  /**
   * Process pitch input (can be string, number, or array)
   * @param {string|number|Array<string|number>} pitch - Pitch input
   * @returns {string|Array<string>} Processed pitch(es)
   */
  static processPitchInput(e) {
    return Array.isArray(e) ? e.map((t) => this.processPitchInput(t)) : typeof e == "number" ? this.midiNoteToNoteName(e) : e;
  }
  /**
   * Parse time string to seconds
   * @param {string|number} timeString - Time string or number
   * @param {number} [bpm=120] - Beats per minute
   * @returns {number} Time in seconds
   */
  static parseTimeString(e, t = 120) {
    if (typeof e == "number")
      return e;
    try {
      if (e.endsWith("n")) {
        const n = parseInt(e.slice(0, -1)), i = 60 / t;
        return 4 / n * i;
      }
      if (e.endsWith("n.")) {
        const n = parseInt(e.slice(0, -2)), i = 60 / t;
        return 4 / n * i * 1.5;
      }
      if (e.endsWith("m")) {
        const n = parseFloat(e.slice(0, -1)), i = 60 / t * 4;
        return n * i;
      }
      if (e.endsWith("s"))
        return parseFloat(e.slice(0, -1));
      const r = parseFloat(e);
      return isNaN(r) ? (console.warn(`Cannot parse time string: ${e}`), 0) : r;
    } catch (r) {
      return console.error(`Error parsing time string ${e}:`, r), 0;
    }
  }
  /**
   * Validate JMON composition format
   * @param {Object} composition - Composition to validate
   * @returns {JmonValidationResult} Validation result
   */
  static validateComposition(e) {
    const t = [], r = [];
    return e ? (e.format ? e.format !== this.FORMAT_IDENTIFIER && t.push({
      field: "format",
      message: `Invalid format: expected "${this.FORMAT_IDENTIFIER}", got "${e.format}"`,
      value: e.format
    }) : t.push({ field: "format", message: "Format field is required" }), e.version || r.push("Version field is recommended"), !e.tracks || !Array.isArray(e.tracks) ? t.push({ field: "tracks", message: "Tracks array is required" }) : e.tracks.length === 0 ? r.push("Composition has no tracks") : e.tracks.forEach((n, i) => {
      (!n.sequence || !Array.isArray(n.sequence)) && t.push({
        field: `tracks[${i}].sequence`,
        message: "Track sequence array is required"
      });
    }), {
      valid: t.length === 0,
      errors: t,
      warnings: r
    }) : (t.push({ field: "composition", message: "Composition object is required" }), { valid: !1, errors: t, warnings: r });
  }
  /**
   * Create a Tone.js synth instance
   * @param {string} type - Synth type
   * @param {Object} [options={}] - Synth options
   * @returns {Object|null} Tone.js synth instance or null
   */
  static createSynth(e, t = {}) {
    if (typeof window < "u" && window.Tone) {
      const r = window.Tone;
      try {
        switch (e) {
          case "Synth":
            return new r.Synth(t);
          case "PolySynth":
            return new r.PolySynth(t);
          case "MonoSynth":
            return new r.MonoSynth(t);
          case "AMSynth":
            return new r.AMSynth(t);
          case "FMSynth":
            return new r.FMSynth(t);
          case "DuoSynth":
            return new r.DuoSynth(t);
          case "PluckSynth":
            return new r.PluckSynth(t);
          case "NoiseSynth":
            return new r.NoiseSynth(t);
          default:
            return console.warn(`Unknown synth type: ${e}, using Synth`), new r.Synth(t);
        }
      } catch (n) {
        return console.error(`Error creating ${e}:`, n), new r.Synth();
      }
    } else
      return console.warn("Tone.js not available. Cannot create synth."), null;
  }
  /**
   * Basic composition playback (requires Tone.js)
   * @param {JmonComposition} composition - JMON composition
   * @param {Object} [options={}] - Playback options
   * @returns {Promise<void>}
   */
  static async playComposition(e, t = {}) {
    const r = this.validateComposition(e);
    if (!r.valid) {
      console.error("Invalid composition:", r.errors);
      return;
    }
    if (typeof window < "u" && window.Tone) {
      const n = window.Tone;
      n.context.state !== "running" && await n.start(), e.tracks && Array.isArray(e.tracks) && e.tracks.forEach((i, o) => {
        const a = this.createSynth(i.instrument?.type || "Synth", i.instrument);
        a && (a.toDestination(), i.sequence?.forEach((l) => {
          const u = this.processPitchInput(l.pitch || "C4"), p = this.parseTimeString(l.time ?? 0, e.bpm || 120), w = this.parseTimeString(l.duration, e.bpm || 120);
          Array.isArray(u) ? u.forEach((_) => {
            a.triggerAttackRelease(_, w, `+${p}`);
          }) : a.triggerAttackRelease(u, w, `+${p}`);
        }));
      });
    } else
      console.warn("Tone.js not available. Cannot play composition.");
  }
}
class he {
  static chromatic_scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
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
    return {
      Bb: "A#",
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      "B-": "A#",
      "D-": "C#",
      "E-": "D#",
      "G-": "F#",
      "A-": "G#"
    }[e] || e;
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
class Ut {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = he.convertFlatToSharp(e);
    if (!he.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${he.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(he.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(he.scale_intervals).join(", ")}'.`);
    this.mode = t;
  }
  /**
   * Generate a scale starting from a specific octave with n notes
   * @param {number} octave - The starting octave (0-10)
   * @param {number} length - Number of notes to generate
   * @returns {Array} Array of MIDI note numbers representing the scale
   */
  generate(e = 4, t) {
    const r = he.scale_intervals[this.mode];
    if (!r)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    const n = he.chromatic_scale.indexOf(this.tonic);
    if (n === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const i = r.map((l) => {
      const u = (n + l) % 12;
      return 60 + (e - 4) * 12 + u;
    });
    if (t === void 0)
      return i;
    const o = [];
    let a = e;
    for (let l = 0; l < t; l++) {
      const u = l % r.length;
      u === 0 && l > 0 && a++;
      const p = r[u], w = (n + p) % 12, _ = 60 + (a - 4) * 12 + w;
      o.push(_);
    }
    return o;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const e = he.scale_intervals[this.mode];
    if (!e) return [];
    const t = he.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const n = (t + r) % 12;
      return he.chromatic_scale[n];
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
function es(s) {
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
function wn(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function $n(s) {
  return Math.floor(s / 12) - 1;
}
function ts(s) {
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
function Gt(s, e, t) {
  typeof s == "string" && (s = Oe(s)), typeof t == "string" && (t = Oe(t));
  const r = e.indexOf(t);
  if (e.includes(s))
    return e.indexOf(s) - r;
  {
    const n = wn(s, e), i = e.indexOf(n), o = i > 0 ? i - 1 : i, a = e[o], l = n - s, u = s - a, p = l + u;
    if (p === 0) return i - r;
    const w = 1 - l / p, _ = 1 - u / p, $ = i - r, E = o - r;
    return $ * w + E * _;
  }
}
function rs(s, e, t) {
  const r = e.indexOf(t), n = Math.round(r + s);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), o = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], l = e[o], u = o - n, p = n - i, w = u + p;
    if (w === 0)
      return (l + a) / 2;
    const _ = 1 - u / w, $ = 1 - p / w;
    return l * _ + a * $;
  }
}
function _n(s) {
  s.length > 0 && s[0].length === 2 && (s = s.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of s)
    e.push([r, n, t]), t += n;
  return e;
}
function Sn(s, e = 0) {
  const t = [...s].sort((i, o) => i[2] - o[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [o, a, l] = i, u = e + l;
    if (u > r) {
      const w = [null, u - r, r - e];
      n.push(w);
    }
    n.push(i), r = Math.max(r, u + a);
  }
  return n;
}
function Pn(s) {
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
function ns(s) {
  return Pn(Sn(s));
}
function Oe(s) {
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
function is(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(s / 12) - 1, r = s % 12;
  return e[r] + t.toString();
}
function ss(s, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, o] of s)
    t.push([n, i, r]), r += i;
  return t;
}
function os(s) {
  return s.every((e) => Array.isArray(e)) ? "list of tuples" : s.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function as(s, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...s), o = n !== null ? n : Math.max(...s);
  return i === o ? new Array(s.length).fill((e + t) / 2) : s.map(
    (a) => (a - i) * (t - e) / (o - i) + e
  );
}
function En(s, e) {
  return s.map(([t, r, n]) => [t, r, n + e]);
}
function cs(s, e, t) {
  const r = [];
  for (const [n, i, o] of s) {
    const a = Math.round(o / t) * t, l = (Math.floor(a / e) + 1) * e;
    let u = Math.round(i / t) * t;
    u = Math.min(u, l - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function ls(s, e) {
  const r = s.filter(([a, , l]) => a !== null && l !== null).sort((a, l) => a[2] - l[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, o = [];
  for (let a = 0; a < i; a++) {
    const l = a * e;
    let u = null, p = 1 / 0;
    for (const [w, , _] of r) {
      const $ = l - _;
      if ($ >= 0 && $ < p && (p = $, u = w), _ > l) break;
    }
    u !== null && o.push(u);
  }
  return o;
}
function us(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function ds(s, e) {
  return 60 / e * s;
}
function* hs(s = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * s, [s, e] = [e, s + e];
}
function fs(s, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(s)) {
    const o = [];
    for (let a = 0; a < e; a++) {
      const l = a * t, u = En(i, l);
      o.push(...u);
    }
    r[n] = o;
  }
  return r;
}
const ps = {
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
}, dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: Pn,
  cdeToMidi: Oe,
  checkInput: os,
  fibonacci: hs,
  fillGapsWithRests: Sn,
  findClosestPitchAtMeasureStart: ls,
  getDegreeFromPitch: Gt,
  getOctave: $n,
  getPitchFromDegree: rs,
  getSharp: ts,
  instrumentMapping: ps,
  midiToCde: is,
  noOverlap: ss,
  offsetTrack: En,
  qlToSeconds: ds,
  quantizeNotes: cs,
  repairNotes: ns,
  repeatPolyloops: fs,
  roundToList: wn,
  scaleList: as,
  setOffsetsAccordingToDurations: _n,
  tracksToDict: es,
  tune: us
}, Symbol.toStringTag, { value: "Module" }));
class ms extends he {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = Oe(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
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
    const { major: r, minor: n, diminished: i } = this.computeCircle(), o = [r, n, i], a = ["major", "minor", "diminished"], l = [];
    for (let u = 0; u < e; u++) {
      const p = this.weightedRandomChoice(this.weights);
      if (o[p].length > 0) {
        const w = o[p][Math.floor(Math.random() * o[p].length)], _ = a[p], $ = Array.isArray(w) ? w[0] : w, E = this.generateChord($, _);
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
class Mn extends he {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new Ut(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = $n(e), r = this.tonic + t.toString(), n = Oe(r), i = this.scale.map((l) => Gt(l, this.scale, n)), o = Math.round(Gt(e, this.scale, n)), a = [];
    for (const l of this.degrees) {
      const u = o + l, p = i.indexOf(u);
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
      let o = 0, a = 0;
      n = e.map((l) => {
        const u = t[o % t.length], p = [l, u, a];
        return a += u, o++, p;
      });
    }
    const i = n.map(([o, a, l]) => [this.pitchToChord(o), a, l]);
    if (r) {
      const o = [];
      for (const [a, l, u] of i) {
        const p = l / a.length;
        a.forEach((w, _) => {
          o.push([w, p, u + _ * p]);
        });
      }
      return o;
    } else
      return i;
  }
}
class ys extends he {
  /**
   * Initialize an Ornament object
   * @param {string} type - The type of ornament ('grace_note', 'trill', 'mordent', 'arpeggio', 'turn', 'slide')
   * @param {string} tonic - The tonic note for the scale
   * @param {string} mode - The type of scale to generate
   * @param {number} by - The pitch step for the trill (default: 1.0)
   * @param {string} graceNoteType - Type of grace note ('acciaccatura' or 'appoggiatura')
   * @param {Array} gracePitches - List of pitches for the grace note
   * @param {number} trillRate - Duration of each individual note in the trill (default: 0.125)
   * @param {Array} arpeggioDegrees - Degrees in the scale to run the arpeggio
   * @param {number} slideLength - Length of the slide (default: 4.0)
   */
  constructor(e = "grace_note", t = null, r = null, n = 1, i = "acciaccatura", o = null, a = 0.125, l = null, u = 4) {
    super(), this.type = e, this.by = n, this.graceNoteType = i, this.gracePitches = o, this.trillRate = a, this.slideLength = u, t && r ? (this.tonicIndex = this.chromatic_scale.indexOf(t), this.scale = this.generateScale(t, r), l ? this.arpeggioVoice = new Mn(r, t, l) : this.arpeggioVoice = null) : (this.scale = null, this.arpeggioVoice = null);
  }
  /**
   * Generate a complete scale based on tonic and mode
   * @param {string} tonic - The tonic note for the scale
   * @param {string} mode - The type of scale to generate
   * @returns {Array} Array of MIDI notes for the complete scale
   */
  generateScale(e, t) {
    const n = this.scale_intervals[t].map((o) => (this.tonicIndex + o) % 12), i = [];
    for (let o = -1; o < 10; o++)
      for (const a of n) {
        const l = 12 * o + a;
        l >= 0 && l <= 127 && i.push(l);
      }
    return i;
  }
  /**
   * Add a grace note to a specified note
   * @param {Array} notes - The list of notes to be processed
   * @param {number} noteIndex - The index of the note to add grace note to
   * @returns {Array} The list of notes with the grace note added
   */
  addGraceNote(e, t) {
    const [r, n, i] = e[t], o = this.gracePitches ? this.gracePitches[Math.floor(Math.random() * this.gracePitches.length)] : r + 1;
    let a;
    if (this.graceNoteType === "acciaccatura") {
      const l = n * 0.125, u = [r, n, i + l];
      a = [
        ...e.slice(0, t),
        [o, l, i],
        u,
        ...e.slice(t + 1)
      ];
    } else if (this.graceNoteType === "appoggiatura") {
      const l = n / 2, u = [r, l, i + l];
      a = [
        ...e.slice(0, t),
        [o, l, i],
        u,
        ...e.slice(t + 1)
      ];
    } else
      a = e;
    return a;
  }
  /**
   * Add a trill ornament by alternating between original pitch and step above
   * @param {Array} notes - The list of notes to be processed
   * @param {number} noteIndex - The index of the note to add trill to
   * @returns {Array} The list of notes with the trill applied
   */
  addTrill(e, t) {
    const [r, n, i] = e[t], o = [];
    let a = i, l;
    if (this.scale && this.scale.includes(r)) {
      const p = (this.scale.indexOf(r) + Math.round(this.by)) % this.scale.length;
      l = this.scale[p];
    } else
      l = r + this.by;
    for (; a < i + n; ) {
      const u = i + n - a, p = Math.min(this.trillRate, u / 2);
      if (u >= p * 2)
        o.push([r, p, a]), o.push([l, p, a + p]), a += 2 * p;
      else
        break;
    }
    return [
      ...e.slice(0, t),
      ...o,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a mordent ornament
   * @param {Array} notes - The list of notes to be processed  
   * @param {number} noteIndex - The index of the note to add mordent to
   * @returns {Array} The list of notes with the mordent applied
   */
  addMordent(e, t) {
    const [r, n, i] = e[t];
    let o;
    if (this.scale && this.scale.includes(r)) {
      const p = this.scale.indexOf(r) + Math.round(this.by);
      o = this.scale[p] || r + this.by;
    } else
      o = r + this.by;
    const a = n / 3, l = [
      [r, a, i],
      [o, a, i + a],
      [r, a, i + 2 * a]
    ];
    return [
      ...e.slice(0, t),
      ...l,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Generate the ornament on the specified notes
   * @param {Array} notes - The list of notes to be processed
   * @param {number} noteIndex - The index of the note to ornament (random if null)
   * @returns {Array} The list of notes with the ornamentation applied
   */
  generate(e, t = null) {
    if (!Array.isArray(e) || e.length === 0 || (t === null && (t = Math.floor(Math.random() * e.length)), t < 0 || t >= e.length))
      return e;
    switch (this.type) {
      case "grace_note":
        return this.addGraceNote(e, t);
      case "trill":
        return this.addTrill(e, t);
      case "mordent":
        return this.addMordent(e, t);
      // Add other ornament types as needed
      default:
        return e;
    }
  }
}
class Tt {
  /**
   * Available articulation types and their requirements
   */
  static ARTICULATION_TYPES = {
    // Simple articulations (direct property assignment)
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
    // Complex articulations (require API with parameters)
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
    const o = this.ARTICULATION_TYPES[t];
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
      const i = this.ARTICULATION_TYPES[n];
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
    return Object.entries(this.ARTICULATION_TYPES).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function Ft(s, e, t, r) {
  return Tt.addArticulation(s, e, t, r);
}
function zt(s, e) {
  return Tt.removeArticulation(s, e);
}
function gs(s) {
  return Tt.validateSequence(s);
}
class hn {
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
    return new vs(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class vs {
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
      const t = Math.floor(Math.random() * (e.length - 1)), [r, n] = e[t], o = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - n, a = this.durations.filter((l) => l <= o);
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
        const i = this.selectParent(), o = this.selectParent();
        let a = this.crossover(i, o);
        a = this.mutate(a), a.sort((l, u) => l[1] - u[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function bs(s, e) {
  const t = s.map((a) => Array.isArray(a) || typeof a == "object" && a.length ? a[0] : a), r = ws(t.length, e.length), n = [], i = [];
  for (let a = 0; a < r; a++)
    n.push(t[a % t.length]), i.push(e[a % e.length]);
  const o = n.map((a, l) => [a, i[l], 1]);
  return _n(o);
}
function ws(s, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(s * e) / t(s, e);
}
function $s(s, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of s) {
    const o = e[n % e.length];
    t.push([i, o, r]), r += o, n++;
  }
  return t;
}
class _s {
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
function Lt(s) {
  return Array.isArray(s[0]) ? $e.from2DArray(s) : $e.from2DArray([s]);
}
function Ss(s) {
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
class Ps {
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
    this.XTrain = Lt(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = Ss(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = Lt(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      i[a] = 0;
      for (let l = 0; l < this.XTrain.rows; l++)
        i[a] += n.get(l, a) * this.alphaVector[l];
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
    const r = Lt(e), n = this.predict(e, !0);
    if (!n.std)
      throw new Error("Standard deviation computation failed");
    const i = [];
    for (let o = 0; o < t; o++) {
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
      const i = this.kernel.compute(e.getRow(n), e.getRow(n)), o = t.getColumn(n), a = this.forwardSubstitution(this.L, o);
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
    return (await import("./CAVisualizer-DexuwBpG.mjs")).CAVisualizer.plotEvolution(this.getHistory(), e);
  }
  /**
   * Create Observable Plot visualization of current generation
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotGeneration(e) {
    return (await import("./CAVisualizer-DexuwBpG.mjs")).CAVisualizer.plotGeneration(this.getCurrentState(), e);
  }
  /**
   * Create Observable Plot density visualization
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotDensity(e) {
    return (await import("./CAVisualizer-DexuwBpG.mjs")).CAVisualizer.plotDensity(this.getHistory(), e);
  }
}
class fn {
  static midiToNoteName(e) {
    return `MIDI_${e}`;
  }
  static timeToMusicalTime(e) {
    return `${e}`;
  }
}
class Ms {
  config;
  currentTime = 0;
  rotationAngles = /* @__PURE__ */ new Map();
  constructor(e) {
    this.config = e, this.config.layers.forEach((t) => {
      this.rotationAngles.set(t.label, 0);
    });
  }
  /**
   * Create a simple polyloop layer from rhythmic pattern
   */
  static fromRhythm(e, t = [60], r = {}) {
    const {
      instrument: n = "synth",
      color: i = "steelblue",
      label: o = "Polyloop",
      speed: a = 1,
      radius: l = 0.8
    } = r, u = e.reduce((_, $) => _ + $, 0), p = [];
    let w = 0;
    return e.forEach((_, $) => {
      const E = _ / u * 360;
      p.push({
        angle: w,
        radius: l,
        active: _ > 0,
        pitch: _ > 0 ? t[$ % t.length] : void 0,
        velocity: 0.8,
        instrument: n
      }), w += E;
    }), {
      points: p,
      color: i,
      label: o,
      instrument: n,
      divisions: e.length,
      speed: a
    };
  }
  /**
   * Create polyloop layer from Euclidean rhythm
   */
  static euclidean(e, t, r = [60], n = {}) {
    const {
      instrument: i = "synth",
      color: o = "steelblue",
      label: a = `Euclidean ${t}/${e}`,
      speed: l = 1,
      radius: u = 0.8
    } = n, p = this.generateEuclideanRhythm(e, t), w = [];
    return p.forEach((_, $) => {
      const E = $ / e * 360;
      w.push({
        angle: E,
        radius: u,
        active: _,
        pitch: _ ? r[$ % r.length] : void 0,
        velocity: 0.8,
        instrument: i
      });
    }), {
      points: w,
      color: o,
      label: a,
      instrument: i,
      divisions: e,
      speed: l
    };
  }
  /**
   * Generate Euclidean rhythm pattern
   */
  static generateEuclideanRhythm(e, t) {
    if (t >= e)
      return Array(e).fill(!0);
    const r = Array(e).fill(!1), n = e / t;
    for (let i = 0; i < t; i++) {
      const o = Math.round(i * n) % e;
      r[o] = !0;
    }
    return r;
  }
  /**
   * Create polyloop with mathematical function
   */
  static fromFunction(e, t = 16, r = [60, 72], n = {}) {
    const {
      instrument: i = "synth",
      color: o = "purple",
      label: a = "Function Polyloop",
      speed: l = 1,
      activeThreshold: u = 0.5
    } = n, p = [], [w, _] = r;
    for (let $ = 0; $ < t; $++) {
      const E = $ / t * 360, b = E * Math.PI / 180, f = e(b), d = Math.abs(f) % 1;
      p.push({
        angle: E,
        radius: 0.3 + d * 0.5,
        // Vary radius based on function
        active: d > u,
        pitch: Math.round(w + d * (_ - w)),
        velocity: 0.5 + d * 0.5,
        instrument: i
      });
    }
    return {
      points: p,
      color: o,
      label: a,
      instrument: i,
      divisions: t,
      speed: l
    };
  }
  /**
   * Advance time and calculate triggers
   */
  step(e) {
    this.currentTime += e;
    const t = [];
    return this.config.layers.forEach((r) => {
      const i = ((this.rotationAngles.get(r.label) || 0) + e * r.speed * 360) % 360;
      this.rotationAngles.set(r.label, i), r.points.forEach((o) => {
        if (!o.active) return;
        Math.abs(i - o.angle) < r.speed * 360 * e + 1 && t.push({
          time: this.currentTime,
          layer: r.label,
          point: o,
          angle: i
        });
      });
    }), t;
  }
  /**
   * Generate a sequence of triggers for a given duration
   */
  generateSequence(e, t = 16) {
    const r = 1 / t, n = Math.floor(e / r), i = [];
    this.currentTime = 0, this.resetRotations();
    for (let o = 0; o < n; o++) {
      const a = this.step(r);
      i.push(...a);
    }
    return i;
  }
  /**
   * Reset all rotation angles
   */
  resetRotations() {
    this.config.layers.forEach((e) => {
      this.rotationAngles.set(e.label, 0);
    }), this.currentTime = 0;
  }
  /**
   * Convert triggers to JMON sequences
   */
  toJMonSequences(e = 4) {
    const t = this.generateSequence(e), r = /* @__PURE__ */ new Map();
    t.forEach((i) => {
      r.has(i.layer) || r.set(i.layer, []), r.get(i.layer).push(i);
    });
    const n = [];
    return r.forEach((i, o) => {
      const a = i.map((l) => ({
        pitch: fn.midiToNoteName(l.point.pitch || 60),
        time: fn.timeToMusicalTime(l.time),
        duration: "8n",
        // Default duration
        velocity: l.point.velocity || 0.8
      }));
      n.push({
        label: o,
        notes: a,
        synth: {
          type: "Synth",
          options: {
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
          }
        }
      });
    }), n;
  }
  /**
   * Get current state for visualization
   */
  getVisualizationState() {
    return {
      layers: this.config.layers,
      rotationAngles: new Map(this.rotationAngles),
      currentTime: this.currentTime
    };
  }
  /**
   * Add a new layer to the polyloop
   */
  addLayer(e) {
    this.config.layers.push(e), this.rotationAngles.set(e.label, 0);
  }
  /**
   * Remove a layer from the polyloop
   */
  removeLayer(e) {
    const t = this.config.layers.findIndex((r) => r.label === e);
    return t !== -1 ? (this.config.layers.splice(t, 1), this.rotationAngles.delete(e), !0) : !1;
  }
  /**
   * Create Observable Plot visualization of the polyloop
   */
  async plot(e) {
    const { PolyloopVisualizer: t } = await import("./PolyloopVisualizer-D67OIUED.mjs");
    return t.plotPolyloop(this.config.layers, e);
  }
  /**
   * Create Observable Plot timeline visualization
   */
  async plotTimeline(e = 8, t) {
    const { PolyloopVisualizer: r } = await import("./PolyloopVisualizer-D67OIUED.mjs");
    return r.plotTimeline(this.config.layers, e, t);
  }
  /**
   * Create animated visualization frames
   */
  async plotAnimated(e = 12, t) {
    const { PolyloopVisualizer: r } = await import("./PolyloopVisualizer-D67OIUED.mjs");
    return r.plotAnimated(this.config.layers, e, t);
  }
}
class Ts {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((w, _) => ({ value: w, weight: n[_] })).sort((w, _) => w.value - _.value), o = i.map((w) => w.value), a = i.map((w) => w.weight), l = a.reduce((w, _) => w + _, 0);
    let u = 0, p = 0;
    for (let w = 0; w < r; w++) {
      const _ = a.slice(0, w + 1).reduce(($, E) => $ + E, 0);
      u += a[w] * (2 * _ - a[w] - l) * o[w], p += a[w] * o[w] * l;
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
    const r = t || Array(e.length).fill(1), n = e.reduce((o, a, l) => o + a * r[l], 0), i = r.reduce((o, a) => o + a, 0);
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, n = t || Math.floor(r / 2), i = [], o = e.reduce((l, u) => l + u, 0) / r, a = e.reduce((l, u) => l + Math.pow(u - o, 2), 0) / r;
    for (let l = 0; l <= n; l++) {
      let u = 0;
      for (let p = 0; p < r - l; p++)
        u += (e[p] - o) * (e[p + l] - o);
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
class ks {
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
      const i = this.randomPitch(), o = this.randomDuration();
      t.push({
        note: i,
        time: `${Math.floor(r)}:${Math.floor(r % 1 * 4)}:0`,
        // Simple time format
        duration: o,
        velocity: Math.random() * 0.5 + 0.5
        // 0.5 to 1.0
      }), r += this.parseDuration(o);
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
    const t = Ts.analyze(e, { scale: this.options.scale });
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
      let i, o;
      Math.random() < this.options.crossoverRate ? [i, o] = this.crossover(r, n) : (i = { ...r }, o = { ...n }), Math.random() < this.options.mutationRate && this.mutate(i), Math.random() < this.options.mutationRate && this.mutate(o), i.age = 0, o.age = 0, e.push(i), e.length < this.options.populationSize && e.push(o);
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
    }, o = {
      genes: [
        ...t.genes.slice(0, n),
        ...e.genes.slice(n)
      ],
      fitness: 0,
      age: 0
    };
    return [i, o];
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
    const e = this.population.map((i) => i.fitness), t = e.reduce((i, o) => i + o, 0) / e.length, r = Math.max(...e), n = Math.min(...e);
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
class As {
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
    const n = Math.min(...r), o = Math.max(...r) - n || 1;
    return r.map((a) => {
      const l = (a - n) / o, u = Math.floor(l * t.length), p = Math.max(0, Math.min(u, t.length - 1));
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
    for (let o = 0; o < e.length; o++) {
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, l = t * (e[o] - i);
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
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((u) => Math.pow(u - t, 2)), o = i.reduce((u, p) => u + p, 0) / i.length;
    let a = 0;
    for (let u = 1; u < e.length; u++)
      a += Math.abs(e[u] - e[u - 1]);
    const l = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: n,
      meanSquaredDisplacement: o,
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
class Rs {
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
    let i = 0, o = r - 1, a = 0, l = n - 1;
    for (; i <= o && a <= l; ) {
      for (let u = a; u <= l; u++)
        t.push(e[i][u]);
      i++;
      for (let u = i; u <= o; u++)
        t.push(e[u][l]);
      if (l--, i <= o) {
        for (let u = l; u >= a; u--)
          t.push(e[o][u]);
        o--;
      }
      if (a <= l) {
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
      const l = (a - n) / o, u = Math.floor(l * t.length * r), p = Math.floor(u / t.length), w = u % t.length;
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
    return e.map((o) => {
      const a = (o - r) / i, l = Math.floor(a * t.length), u = Math.max(0, Math.min(l, t.length - 1));
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
    const n = [], i = [], o = (t - e) / r;
    for (let a = 0; a < r; a++) {
      const l = e + a * o, u = this.r;
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
        let l = 0;
        for (let u = 0; u < e; u++)
          u !== a && (l += t * (n[u] - n[a]));
        o[a] = this.r * n[a] * (1 - n[a]) + l, o[a] = Math.max(0, Math.min(1, o[a]));
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
class Is {
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
const Cs = {
  // Harmony namespace
  harmony: {
    // Core Theory Classes
    MusicTheoryConstants: he,
    Scale: Ut,
    Progression: ms,
    Voice: Mn,
    Ornament: ys,
    // Articulation System
    Articulation: Tt,
    addArticulation: Ft,
    addOrnament: Ft,
    // Alias for compatibility
    removeArticulation: zt,
    removeOrnament: zt,
    // Alias for compatibility
    validateArticulations: gs
  },
  // Rhythm namespace
  rhythm: {
    Rhythm: hn,
    isorhythm: bs,
    beatcycle: $s
  },
  // Utility functions
  utils: {
    ...dn
  },
  // Generative algorithms
  generative: {
    MotifBank: _s,
    GaussianProcess: Ps,
    CellularAutomata: Es,
    Polyloop: Ms,
    GeneticAlgorithm: ks,
    RandomWalk: As,
    Fractals: { Mandelbrot: Rs, LogisticMap: Ns },
    MinimalismProcess: Is
  },
  // Backward compatibility - expose some functions at root level too
  Scale: Ut,
  Rhythm: hn,
  addArticulation: Ft,
  removeArticulation: zt,
  ...dn
};
class js {
  constructor(e = {}) {
    this.options = {
      autoMultivoice: e.autoMultivoice ?? !0,
      maxVoices: e.maxVoices || 4,
      showDebug: e.showDebug || !1,
      ...e
    };
  }
  /**
   * Convert JMON composition to Tone.js tracks with multivoice support
   */
  convert(e) {
    if (!e || typeof e != "object")
      throw console.error("[CONVERTER] Invalid composition:", e), new Error("Composition must be a valid object");
    const t = e.tracks || e.sequences || [];
    if (!Array.isArray(t))
      throw console.error("[CONVERTER] Tracks must be an array, got:", typeof t, t), new Error(`Expected tracks to be an array, got ${typeof t}`);
    console.log("[CONVERTER] Processing", t.length, "tracks");
    const r = [];
    return t.forEach((n, i) => {
      const o = n.sequence || n.notes || [], a = this.analyzeTrack(o), l = this.splitIntoVoices(o);
      l.forEach((u, p) => {
        const w = {
          originalTrackIndex: i,
          voiceIndex: p,
          totalVoices: l.length,
          trackInfo: {
            label: n.label || n.name || `Track ${i + 1}`,
            originalTrack: n
          },
          notes: u,
          analysis: a,
          synthConfig: this.getSynthConfig(n, a, p),
          partEvents: this.createPartEvents(u)
        };
        r.push(w);
      });
    }), {
      tracks: r,
      metadata: {
        tempo: e.bpm || 120,
        totalDuration: this.calculateTotalDuration(e),
        originalComposition: e
      }
    };
  }
  /**
   * Analyze track for special requirements
   */
  analyzeTrack(e) {
    return {
      hasGlissando: e.some((t) => t.articulation === "glissando"),
      hasChords: e.some((t) => Array.isArray(t.pitch)),
      hasOverlaps: this.detectOverlaps(e),
      noteCount: e.length,
      timeRange: this.getTimeRange(e)
    };
  }
  /**
   * Detect overlapping notes in a sequence
   */
  detectOverlaps(e) {
    if (e.length < 2) return !1;
    const t = [...e].sort((r, n) => (parseFloat(r.time) || 0) - (parseFloat(n.time) || 0));
    for (let r = 1; r < t.length; r++) {
      const n = t[r - 1], i = t[r], a = (parseFloat(n.time) || 0) + (parseFloat(n.duration) || 0.5);
      if ((parseFloat(i.time) || 0) < a)
        return !0;
    }
    return !1;
  }
  /**
   * Split notes into voices for overlapping playback
   */
  splitIntoVoices(e) {
    if (!this.options.autoMultivoice || e.length === 0)
      return [e];
    const t = this.options.maxVoices, r = Array(t).fill(null).map(() => []), n = Array(t).fill(0), i = [...e].sort((a, l) => (parseFloat(a.time) || 0) - (parseFloat(l.time) || 0));
    for (const a of i) {
      const l = parseFloat(a.time) || 0, u = parseFloat(a.duration) || 0.5, p = l + u;
      let w = 0;
      for (let _ = 0; _ < t; _++)
        if (n[_] <= l) {
          w = _;
          break;
        }
      n[w] > l && (w = n.indexOf(Math.min(...n)), this.options.showDebug && console.warn(`[MULTIVOICE] Note overlap detected at time ${l}, assigning to voice ${w}`)), r[w].push(a), n[w] = p;
    }
    const o = r.filter((a) => a.length > 0);
    return o.length > 1 && this.options.showDebug && console.log(`[MULTIVOICE] Split track into ${o.length} voices to handle overlapping notes`), o.length > 0 ? o : [e];
  }
  /**
   * Get synth configuration for a voice
   */
  getSynthConfig(e, t, r) {
    const n = e.instrument?.type || "PolySynth";
    return t.hasGlissando && (n === "PolySynth" || n === "DuoSynth") ? (r === 0 && this.options.showDebug && console.warn(`[MULTIVOICE] Using Synth instead of ${n} for glissando in ${e.label || "track"}`), {
      type: "Synth",
      reason: "glissando_compatibility",
      original: n
    }) : {
      type: n,
      reason: "user_selected",
      original: n
    };
  }
  /**
   * Create Tone.js Part events from notes
   */
  createPartEvents(e) {
    return e.map((t) => {
      const r = parseFloat(t.time) || 0, n = parseFloat(t.duration) || 0.5;
      return [r, {
        pitch: t.pitch,
        duration: n,
        articulation: t.articulation,
        velocity: t.velocity || 0.8,
        glissTarget: t.glissTarget,
        modulations: t.modulations,
        microtuning: t.microtuning
      }];
    });
  }
  /**
   * Calculate total duration of composition
   */
  calculateTotalDuration(e) {
    const r = (e.tracks || e.sequences || []).flatMap((a) => a.sequence || a.notes || []);
    if (r.length === 0) return 0;
    const n = Math.max(...r.map((a) => {
      const l = parseFloat(a.time) || 0, u = parseFloat(a.duration) || 0.5;
      return l + u;
    })), o = 60 / (e.bpm || 120);
    return n * o;
  }
  /**
   * Get time range of notes
   */
  getTimeRange(e) {
    if (e.length === 0) return { start: 0, end: 0 };
    const t = e.map((n) => parseFloat(n.time) || 0), r = e.map((n) => (parseFloat(n.time) || 0) + (parseFloat(n.duration) || 0.5));
    return {
      start: Math.min(...t),
      end: Math.max(...r)
    };
  }
}
function qs(s, e = {}) {
  return new js(e).convert(s);
}
function Tn(s, e = {}) {
  if (!s || typeof s != "object")
    throw console.error("[PLAYER] Invalid composition:", s), new Error("Composition must be a valid JMON object");
  if (!s.sequences && !s.tracks)
    throw console.error("[PLAYER] No sequences or tracks found in composition:", s), new Error("Composition must have sequences or tracks");
  const t = s.tracks || s.sequences || [];
  if (!Array.isArray(t))
    throw console.error("[PLAYER] Tracks/sequences must be an array:", t), new Error("Tracks/sequences must be an array");
  console.log("[PLAYER] Processing composition with", t.length, "tracks");
  const {
    tempo: r = s.bpm || 120,
    showDebug: n = !1,
    customInstruments: i = {},
    autoMultivoice: o = !0,
    // Automatically create multiple synths for overlapping notes
    maxVoices: a = 4
    // Maximum voices per track
  } = e, u = qs(s, { autoMultivoice: o, maxVoices: a, showDebug: n }), { tracks: p, metadata: w } = u;
  let _ = w.totalDuration;
  const $ = {
    background: "#FFFFFF",
    primary: "#333",
    secondary: "#F0F0F0",
    accent: "#333",
    text: "#000000",
    lightText: "#666666",
    border: "#CCCCCC"
  }, E = document.createElement("div");
  E.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${$.background};
        color: ${$.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${$.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    `;
  const b = document.createElement("div");
  b.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    `;
  const f = document.createElement("div");
  f.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 48%;
        justify-content: space-between;
    `;
  const d = document.createElement("div");
  d.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const c = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"], h = s.tracks || s.sequences || [], y = [];
  h.forEach((N, F) => {
    const z = p.find((T) => T.originalTrackIndex === F)?.analysis;
    z?.hasGlissando && console.warn(`Track ${N.label || N.name || F + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const J = document.createElement("div");
    J.style.cssText = `
            margin-bottom: 8px;
        `;
    const H = document.createElement("label");
    H.textContent = N.name || N.label || `Track ${F + 1}`, H.style.cssText = `
            font-size: 12px;
            color: ${$.text};
            display: block;
            margin-bottom: 2px;
        `;
    const M = document.createElement("select");
    M.style.cssText = `
            padding: 4px;
            border: 1px solid ${$.secondary};
            border-radius: 4px;
            background-color: ${$.background};
            color: ${$.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
        `, c.forEach((T) => {
      const I = document.createElement("option");
      I.value = T, I.textContent = T, z?.hasGlissando && (T === "PolySynth" || T === "DuoSynth") && (I.disabled = !0, I.textContent += " (mono only for glissando)"), M.appendChild(I);
    }), y.push(M), J.append(H, M), d.appendChild(J);
  }), f.appendChild(d);
  const v = document.createElement("div");
  v.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 48%;
        justify-content: space-between;
    `;
  const g = document.createElement("div");
  g.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
    `;
  const S = document.createElement("label");
  S.textContent = "Tempo", S.style.cssText = `
        font-size: 14px;
        margin-bottom: 5px;
        color: ${$.text};
    `;
  const A = document.createElement("input");
  A.type = "number", A.min = 60, A.max = 240, A.value = r, A.style.cssText = `
        padding: 8px;
        border: 1px solid ${$.secondary};
        border-radius: 6px;
        background-color: ${$.background};
        color: ${$.text};
        font-size: 14px;
        text-align: center;
        width: 100%;
        height: 36px;
    `, g.append(S, A), v.appendChild(g);
  const j = document.createElement("div");
  j.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
    `;
  const D = document.createElement("input");
  D.type = "range", D.min = 0, D.max = 100, D.value = 0, D.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${$.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const V = document.createElement("button");
  V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', V.style.cssText = `
        width: 40px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 50%;
        background-color: ${$.primary};
        color: ${$.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px 0px 10px;
    `;
  const B = document.createElement("div");
  B.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${$.lightText};
        margin: 0px 0px 0px 10px;
    `;
  const U = document.createElement("span");
  U.textContent = "0:00";
  const Y = document.createElement("span");
  Y.textContent = "0:00", B.append(U, " / ", Y), j.append(D, V);
  const ne = document.createElement("div");
  ne.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;
  const ce = document.createElement("button");
  ce.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', ce.style.cssText = `
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        background-color: ${$.accent};
        color: ${$.background};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
  const de = document.createElement("button");
  de.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', de.style.cssText = `
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        background-color: ${$.accent};
        color: ${$.background};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `, ne.append(ce, de), b.append(f, v), E.append(b, j, B, ne);
  let x, ae = !1, q = [], k = [];
  const C = (N) => `${Math.floor(N / 60)}:${Math.floor(N % 60).toString().padStart(2, "0")}`, R = async () => {
    if (typeof window < "u") {
      if (!window.Tone)
        try {
          if (typeof require < "u")
            window.Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js");
          else {
            const N = await import("https://unpkg.com/tone@14.8.49/build/Tone.js");
            window.Tone = N.default || N;
          }
        } catch (N) {
          return console.warn("Could not auto-load Tone.js:", N.message), console.log("To use the player, load Tone.js manually first:"), console.log('Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js")'), !1;
        }
      if (window.Tone)
        return x = window.Tone, x.context.state !== "running" && (await x.start(), console.log("[PLAYER] Audio context started:", x.context.state)), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, m = () => {
    if (!x) return;
    console.log("[PLAYER] Cleaning up existing synths:", q.length, "parts:", k.length), q.forEach((z) => z.dispose()), k.forEach((z) => {
      z.stop(), z.dispose();
    }), q = [], k = [], p.forEach((z) => {
      const { originalTrackIndex: J, voiceIndex: H, totalVoices: M, trackInfo: T, synthConfig: I, partEvents: O } = z, L = y[J] ? y[J].value : I.type;
      let K;
      try {
        const re = I.reason === "glissando_compatibility" ? I.type : L;
        K = new x[re]().toDestination(), I.reason === "glissando_compatibility" && H === 0 && console.warn(`[MULTIVOICE] Using ${re} instead of ${I.original} for glissando in ${T.label}`);
      } catch (re) {
        console.warn(`Failed to create ${L}, using PolySynth:`, re), K = new x.PolySynth().toDestination();
      }
      q.push(K), M > 1 && console.log(`[MULTIVOICE] Track "${T.label}" voice ${H + 1}: ${O.length} notes`), console.log("[PLAYER] Part events array:", O);
      const ie = new x.Part((re, G) => {
        if (console.log("[PLAYER] Note event", {
          time: re,
          pitch: G.pitch,
          duration: G.duration,
          articulation: G.articulation,
          velocity: G.velocity,
          glissTarget: G.glissTarget
        }), Array.isArray(G.pitch))
          G.pitch.forEach((Q) => {
            let Z = "C4";
            typeof Q == "number" ? Z = x.Frequency(Q, "midi").toNote() : typeof Q == "string" ? Z = Q : Array.isArray(Q) && typeof Q[0] == "string" && (Z = Q[0]), console.log("[PLAYER] Chord note", { noteName: Z, duration: G.duration, time: re }), K.triggerAttackRelease(Z, G.duration, re);
          });
        else if (G.articulation === "glissando" && G.glissTarget !== void 0) {
          let Q = typeof G.pitch == "number" ? x.Frequency(G.pitch, "midi").toNote() : G.pitch, Z = typeof G.glissTarget == "number" ? x.Frequency(G.glissTarget, "midi").toNote() : G.glissTarget;
          console.log("[PLAYER] Glissando", { fromNote: Q, toNote: Z, duration: G.duration, time: re }), console.log("[PLAYER] Glissando effect starting from", Q, "to", Z), K.triggerAttack(Q, re, G.velocity || 0.8);
          const se = x.Frequency(Q).toFrequency(), le = x.Frequency(Z).toFrequency(), ke = 1200 * Math.log2(le / se);
          if (K.detune && K.detune.setValueAtTime && K.detune.linearRampToValueAtTime)
            K.detune.setValueAtTime(0, re), K.detune.linearRampToValueAtTime(ke, re + G.duration), console.log("[PLAYER] Applied detune glissando:", ke, "cents over", G.duration, "beats");
          else {
            const Ne = x.Frequency(Q).toMidi(), Se = x.Frequency(Z).toMidi(), be = Math.max(3, Math.abs(Se - Ne)), Ie = G.duration / be;
            for (let Pe = 1; Pe < be; Pe++) {
              const kt = Pe / (be - 1), kn = se * Math.pow(le / se, kt), An = x.Frequency(kn).toNote(), Rn = re + Pe * Ie;
              K.triggerAttackRelease(An, Ie * 0.8, Rn, (G.velocity || 0.8) * 0.7);
            }
            console.log("[PLAYER] Applied chromatic glissando with", be, "steps");
          }
          K.triggerRelease(re + G.duration);
        } else {
          let Q = "C4";
          typeof G.pitch == "number" ? Q = x.Frequency(G.pitch, "midi").toNote() : typeof G.pitch == "string" ? Q = G.pitch : Array.isArray(G.pitch) && typeof G.pitch[0] == "string" && (Q = G.pitch[0]);
          let Z = G.duration, se = G.velocity || 0.8;
          G.articulation === "staccato" && (Z = G.duration * 0.5), G.articulation === "accent" && (se = Math.min(se * 2, 1)), G.articulation === "tenuto" && (Z = G.duration * 1.5, se = Math.min(se * 1.3, 1)), console.log("[PLAYER] Single note", { noteName: Q, noteDuration: Z, time: re, noteVelocity: se }), K.triggerAttackRelease(Q, Z, re, se);
        }
      }, O);
      ie.start(0), console.log(`[PLAYER] Part created for voice ${H + 1} with ${O.length} notes, started at time 0`), k.push(ie);
    }), console.log("[PLAYER] Total duration from converter:", _, "seconds"), x.Transport.bpm.value = w.tempo;
    const N = 60 / w.tempo, F = _ / N;
    x.Transport.loopEnd = F, console.log("[PLAYER] Transport loop end set to", F, "beats"), x.Transport.loop = !0, x.Transport.stop(), x.Transport.position = 0, console.log("[PLAYER] Transport fully reset - position:", x.Transport.position, "state:", x.Transport.state), Y.textContent = C(_);
  }, P = () => {
    if (x && ae) {
      const N = x.Transport.seconds / _ * 100;
      D.value = Math.min(N, 100), U.textContent = C(x.Transport.seconds), x.Transport.state === "started" && ae ? requestAnimationFrame(P) : x.Transport.state === "stopped" && (x.Transport.seconds = 0, D.value = 0, U.textContent = C(0), ae = !1, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  return V.addEventListener("click", async () => {
    if (console.log("[PLAYER] Play button clicked, isPlaying:", ae, "Tone available:", !!x), !x)
      if (console.log("[PLAYER] Initializing Tone.js..."), await R())
        m();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    ae ? (console.log("[PLAYER] Stopping transport..."), x.Transport.stop(), ae = !1, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>') : (console.log("[PLAYER] Starting transport..."), q.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), m()), x.Transport.stop(), x.Transport.position = 0, console.log("[PLAYER] Transport state before start:", x.Transport.state), console.log("[PLAYER] Transport position reset to:", x.Transport.position), console.log("[PLAYER] Audio context state:", x.context.state), console.log("[PLAYER] Parts count:", k.length), console.log("[PLAYER] Synths count:", q.length), x.Transport.start(), ae = !0, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', P());
  }), D.addEventListener("input", () => {
    if (x && _ > 0) {
      const N = D.value / 100 * _;
      x.Transport.seconds = N, U.textContent = C(N);
    }
  }), A.addEventListener("change", () => {
    const N = parseInt(A.value);
    x && N >= 60 && N <= 240 ? x.Transport.bpm.value = N : A.value = x ? x.Transport.bpm.value : r;
  }), y.forEach((N) => {
    N.addEventListener("change", () => {
      x && q.length > 0 && m();
    });
  }), ce.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), de.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  }), typeof window < "u" && window.Tone && R().then(() => m()), E;
}
function Os(s) {
  return new Wt().validateAndNormalize(s);
}
function Jt(s) {
  if (!s || typeof s != "object")
    throw console.error("[RENDER] Invalid JMON object:", s), new Error("render() requires a valid JMON object");
  return !s.sequences && !s.tracks && !s.format && (console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), s = {
    format: "jmonTone",
    version: "1.0",
    bpm: s.bpm || 120,
    sequences: s.sequences || s.tracks || []
  }), Tn(s);
}
function Ds(s) {
  const e = Jt(s);
  return setTimeout(() => {
    const t = e.querySelector('button[aria-label="Play"]') || e.querySelector("button");
    t && t.click();
  }, 100), e;
}
function xs(s) {
  return Jt(s);
}
const Vs = {
  // Main functions expected by Observable
  render: Jt,
  play: Ds,
  score: xs,
  validateJmon: Os,
  // Structured namespaces
  dj: Cs,
  // Core classes and utilities
  JmonTone: Zi,
  JmonValidator: Wt,
  createPlayer: Tn,
  // Version
  VERSION: "1.0.0"
}, Fs = "1.0.0";
export {
  Zi as JmonTone,
  Wt as JmonValidator,
  Fs as VERSION,
  Tn as createPlayer,
  Vs as default,
  Cs as dj,
  Ds as play,
  Jt as render,
  xs as score,
  Os as validateJmon
};
