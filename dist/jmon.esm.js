function jn(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var xe = { exports: {} }, Nt = {}, ye = {}, Ee = {}, At = {}, jt = {}, It = {}, Jt;
function $t() {
  return Jt || (Jt = 1, (function(s) {
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
        return (c = this._str) !== null && c !== void 0 ? c : this._str = this._items.reduce((f, y) => `${f}${y}`, "");
      }
      get names() {
        var c;
        return (c = this._names) !== null && c !== void 0 ? c : this._names = this._items.reduce((f, y) => (y instanceof t && (f[y.str] = (f[y.str] || 0) + 1), f), {});
      }
    }
    s._Code = r, s.nil = new r("");
    function i(u, ...c) {
      const f = [u[0]];
      let y = 0;
      for (; y < c.length; )
        a(f, c[y]), f.push(u[++y]);
      return new r(f);
    }
    s._ = i;
    const n = new r("+");
    function o(u, ...c) {
      const f = [$(u[0])];
      let y = 0;
      for (; y < c.length; )
        f.push(n), a(f, c[y]), f.push(n, $(u[++y]));
      return l(f), new r(f);
    }
    s.str = o;
    function a(u, c) {
      c instanceof r ? u.push(...c._items) : c instanceof t ? u.push(c) : u.push(w(c));
    }
    s.addCodeArg = a;
    function l(u) {
      let c = 1;
      for (; c < u.length - 1; ) {
        if (u[c] === n) {
          const f = d(u[c - 1], u[c + 1]);
          if (f !== void 0) {
            u.splice(c - 1, 3, f);
            continue;
          }
          u[c++] = "+";
        }
        c++;
      }
    }
    function d(u, c) {
      if (c === '""')
        return u;
      if (u === '""')
        return c;
      if (typeof u == "string")
        return c instanceof t || u[u.length - 1] !== '"' ? void 0 : typeof c != "string" ? `${u.slice(0, -1)}${c}"` : c[0] === '"' ? u.slice(0, -1) + c.slice(1) : void 0;
      if (typeof c == "string" && c[0] === '"' && !(u instanceof t))
        return `"${u}${c.slice(1)}`;
    }
    function p(u, c) {
      return c.emptyStr() ? u : u.emptyStr() ? c : o`${u}${c}`;
    }
    s.strConcat = p;
    function w(u) {
      return typeof u == "number" || typeof u == "boolean" || u === null ? u : $(Array.isArray(u) ? u.join(",") : u);
    }
    function _(u) {
      return new r($(u));
    }
    s.stringify = _;
    function $(u) {
      return JSON.stringify(u).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    s.safeStringify = $;
    function E(u) {
      return typeof u == "string" && s.IDENTIFIER.test(u) ? new r(`.${u}`) : i`[${u}]`;
    }
    s.getProperty = E;
    function b(u) {
      if (typeof u == "string" && s.IDENTIFIER.test(u))
        return new r(`${u}`);
      throw new Error(`CodeGen: invalid export name: ${u}, use explicit $id name mapping`);
    }
    s.getEsmExportName = b;
    function h(u) {
      return new r(u.toString());
    }
    s.regexpCode = h;
  })(It)), It;
}
var Ot = {}, Yt;
function Xt() {
  return Yt || (Yt = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.ValueScope = s.ValueScopeName = s.Scope = s.varKinds = s.UsedValueState = void 0;
    const e = $t();
    class t extends Error {
      constructor(d) {
        super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
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
    class i {
      constructor({ prefixes: d, parent: p } = {}) {
        this._names = {}, this._prefixes = d, this._parent = p;
      }
      toName(d) {
        return d instanceof e.Name ? d : this.name(d);
      }
      name(d) {
        return new e.Name(this._newName(d));
      }
      _newName(d) {
        const p = this._names[d] || this._nameGroup(d);
        return `${d}${p.index++}`;
      }
      _nameGroup(d) {
        var p, w;
        if (!((w = (p = this._parent) === null || p === void 0 ? void 0 : p._prefixes) === null || w === void 0) && w.has(d) || this._prefixes && !this._prefixes.has(d))
          throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
        return this._names[d] = { prefix: d, index: 0 };
      }
    }
    s.Scope = i;
    class n extends e.Name {
      constructor(d, p) {
        super(p), this.prefix = d;
      }
      setValue(d, { property: p, itemIndex: w }) {
        this.value = d, this.scopePath = (0, e._)`.${new e.Name(p)}[${w}]`;
      }
    }
    s.ValueScopeName = n;
    const o = (0, e._)`\n`;
    class a extends i {
      constructor(d) {
        super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : e.nil };
      }
      get() {
        return this._scope;
      }
      name(d) {
        return new n(d, this._newName(d));
      }
      value(d, p) {
        var w;
        if (p.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(d), { prefix: $ } = _, E = (w = p.key) !== null && w !== void 0 ? w : p.ref;
        let b = this._values[$];
        if (b) {
          const c = b.get(E);
          if (c)
            return c;
        } else
          b = this._values[$] = /* @__PURE__ */ new Map();
        b.set(E, _);
        const h = this._scope[$] || (this._scope[$] = []), u = h.length;
        return h[u] = p.ref, _.setValue(p, { property: $, itemIndex: u }), _;
      }
      getValue(d, p) {
        const w = this._values[d];
        if (w)
          return w.get(p);
      }
      scopeRefs(d, p = this._values) {
        return this._reduceValues(p, (w) => {
          if (w.scopePath === void 0)
            throw new Error(`CodeGen: name "${w}" has no value`);
          return (0, e._)`${d}${w.scopePath}`;
        });
      }
      scopeCode(d = this._values, p, w) {
        return this._reduceValues(d, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, p, w);
      }
      _reduceValues(d, p, w = {}, _) {
        let $ = e.nil;
        for (const E in d) {
          const b = d[E];
          if (!b)
            continue;
          const h = w[E] = w[E] || /* @__PURE__ */ new Map();
          b.forEach((u) => {
            if (h.has(u))
              return;
            h.set(u, r.Started);
            let c = p(u);
            if (c) {
              const f = this.opts.es5 ? s.varKinds.var : s.varKinds.const;
              $ = (0, e._)`${$}${f} ${u} = ${c};${this.opts._n}`;
            } else if (c = _?.(u))
              $ = (0, e._)`${$}${c}${this.opts._n}`;
            else
              throw new t(u);
            h.set(u, r.Completed);
          });
        }
        return $;
      }
    }
    s.ValueScope = a;
  })(Ot)), Ot;
}
var Qt;
function X() {
  return Qt || (Qt = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.or = s.and = s.not = s.CodeGen = s.operators = s.varKinds = s.ValueScopeName = s.ValueScope = s.Scope = s.Name = s.regexpCode = s.stringify = s.getProperty = s.nil = s.strConcat = s.str = s._ = void 0;
    const e = $t(), t = Xt();
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
    var i = Xt();
    Object.defineProperty(s, "Scope", { enumerable: !0, get: function() {
      return i.Scope;
    } }), Object.defineProperty(s, "ValueScope", { enumerable: !0, get: function() {
      return i.ValueScope;
    } }), Object.defineProperty(s, "ValueScopeName", { enumerable: !0, get: function() {
      return i.ValueScopeName;
    } }), Object.defineProperty(s, "varKinds", { enumerable: !0, get: function() {
      return i.varKinds;
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
    class n {
      optimizeNodes() {
        return this;
      }
      optimizeNames(m, S) {
        return this;
      }
    }
    class o extends n {
      constructor(m, S, A) {
        super(), this.varKind = m, this.name = S, this.rhs = A;
      }
      render({ es5: m, _n: S }) {
        const A = m ? t.varKinds.var : this.varKind, z = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${A} ${this.name}${z};` + S;
      }
      optimizeNames(m, S) {
        if (m[this.name.str])
          return this.rhs && (this.rhs = Y(this.rhs, m, S)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends n {
      constructor(m, S, A) {
        super(), this.lhs = m, this.rhs = S, this.sideEffects = A;
      }
      render({ _n: m }) {
        return `${this.lhs} = ${this.rhs};` + m;
      }
      optimizeNames(m, S) {
        if (!(this.lhs instanceof e.Name && !m[this.lhs.str] && !this.sideEffects))
          return this.rhs = Y(this.rhs, m, S), this;
      }
      get names() {
        const m = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return U(m, this.rhs);
      }
    }
    class l extends a {
      constructor(m, S, A, z) {
        super(m, A, z), this.op = S;
      }
      render({ _n: m }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + m;
      }
    }
    class d extends n {
      constructor(m) {
        super(), this.label = m, this.names = {};
      }
      render({ _n: m }) {
        return `${this.label}:` + m;
      }
    }
    class p extends n {
      constructor(m) {
        super(), this.label = m, this.names = {};
      }
      render({ _n: m }) {
        return `break${this.label ? ` ${this.label}` : ""};` + m;
      }
    }
    class w extends n {
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
    class _ extends n {
      constructor(m) {
        super(), this.code = m;
      }
      render({ _n: m }) {
        return `${this.code};` + m;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(m, S) {
        return this.code = Y(this.code, m, S), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class $ extends n {
      constructor(m = []) {
        super(), this.nodes = m;
      }
      render(m) {
        return this.nodes.reduce((S, A) => S + A.render(m), "");
      }
      optimizeNodes() {
        const { nodes: m } = this;
        let S = m.length;
        for (; S--; ) {
          const A = m[S].optimizeNodes();
          Array.isArray(A) ? m.splice(S, 1, ...A) : A ? m[S] = A : m.splice(S, 1);
        }
        return m.length > 0 ? this : void 0;
      }
      optimizeNames(m, S) {
        const { nodes: A } = this;
        let z = A.length;
        for (; z--; ) {
          const F = A[z];
          F.optimizeNames(m, S) || (ne(m, F.names), A.splice(z, 1));
        }
        return A.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((m, S) => H(m, S.names), {});
      }
    }
    class E extends $ {
      render(m) {
        return "{" + m._n + super.render(m) + "}" + m._n;
      }
    }
    class b extends $ {
    }
    class h extends E {
    }
    h.kind = "else";
    class u extends E {
      constructor(m, S) {
        super(S), this.condition = m;
      }
      render(m) {
        let S = `if(${this.condition})` + super.render(m);
        return this.else && (S += "else " + this.else.render(m)), S;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const m = this.condition;
        if (m === !0)
          return this.nodes;
        let S = this.else;
        if (S) {
          const A = S.optimizeNodes();
          S = this.else = Array.isArray(A) ? new h(A) : A;
        }
        if (S)
          return m === !1 ? S instanceof u ? S : S.nodes : this.nodes.length ? this : new u(le(m), S instanceof u ? [S] : S.nodes);
        if (!(m === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(m, S) {
        var A;
        if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(m, S), !!(super.optimizeNames(m, S) || this.else))
          return this.condition = Y(this.condition, m, S), this;
      }
      get names() {
        const m = super.names;
        return U(m, this.condition), this.else && H(m, this.else.names), m;
      }
    }
    u.kind = "if";
    class c extends E {
    }
    c.kind = "for";
    class f extends c {
      constructor(m) {
        super(), this.iteration = m;
      }
      render(m) {
        return `for(${this.iteration})` + super.render(m);
      }
      optimizeNames(m, S) {
        if (super.optimizeNames(m, S))
          return this.iteration = Y(this.iteration, m, S), this;
      }
      get names() {
        return H(super.names, this.iteration.names);
      }
    }
    class y extends c {
      constructor(m, S, A, z) {
        super(), this.varKind = m, this.name = S, this.from = A, this.to = z;
      }
      render(m) {
        const S = m.es5 ? t.varKinds.var : this.varKind, { name: A, from: z, to: F } = this;
        return `for(${S} ${A}=${z}; ${A}<${F}; ${A}++)` + super.render(m);
      }
      get names() {
        const m = U(super.names, this.from);
        return U(m, this.to);
      }
    }
    class v extends c {
      constructor(m, S, A, z) {
        super(), this.loop = m, this.varKind = S, this.name = A, this.iterable = z;
      }
      render(m) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(m);
      }
      optimizeNames(m, S) {
        if (super.optimizeNames(m, S))
          return this.iterable = Y(this.iterable, m, S), this;
      }
      get names() {
        return H(super.names, this.iterable.names);
      }
    }
    class g extends E {
      constructor(m, S, A) {
        super(), this.name = m, this.args = S, this.async = A;
      }
      render(m) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(m);
      }
    }
    g.kind = "func";
    class P extends $ {
      render(m) {
        return "return " + super.render(m);
      }
    }
    P.kind = "return";
    class R extends E {
      render(m) {
        let S = "try" + super.render(m);
        return this.catch && (S += this.catch.render(m)), this.finally && (S += this.finally.render(m)), S;
      }
      optimizeNodes() {
        var m, S;
        return super.optimizeNodes(), (m = this.catch) === null || m === void 0 || m.optimizeNodes(), (S = this.finally) === null || S === void 0 || S.optimizeNodes(), this;
      }
      optimizeNames(m, S) {
        var A, z;
        return super.optimizeNames(m, S), (A = this.catch) === null || A === void 0 || A.optimizeNames(m, S), (z = this.finally) === null || z === void 0 || z.optimizeNames(m, S), this;
      }
      get names() {
        const m = super.names;
        return this.catch && H(m, this.catch.names), this.finally && H(m, this.finally.names), m;
      }
    }
    class O extends E {
      constructor(m) {
        super(), this.error = m;
      }
      render(m) {
        return `catch(${this.error})` + super.render(m);
      }
    }
    O.kind = "catch";
    class D extends E {
      render(m) {
        return "finally" + super.render(m);
      }
    }
    D.kind = "finally";
    class V {
      constructor(m, S = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...S, _n: S.lines ? `
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
      scopeValue(m, S) {
        const A = this._extScope.value(m, S);
        return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
      }
      getScopeValue(m, S) {
        return this._extScope.getValue(m, S);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(m) {
        return this._extScope.scopeRefs(m, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(m, S, A, z) {
        const F = this._scope.toName(S);
        return A !== void 0 && z && (this._constants[F.str] = A), this._leafNode(new o(m, F, A)), F;
      }
      // `const` declaration (`var` in es5 mode)
      const(m, S, A) {
        return this._def(t.varKinds.const, m, S, A);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(m, S, A) {
        return this._def(t.varKinds.let, m, S, A);
      }
      // `var` declaration with optional assignment
      var(m, S, A) {
        return this._def(t.varKinds.var, m, S, A);
      }
      // assignment code
      assign(m, S, A) {
        return this._leafNode(new a(m, S, A));
      }
      // `+=` code
      add(m, S) {
        return this._leafNode(new l(m, s.operators.ADD, S));
      }
      // appends passed SafeExpr to code or executes Block
      code(m) {
        return typeof m == "function" ? m() : m !== e.nil && this._leafNode(new _(m)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...m) {
        const S = ["{"];
        for (const [A, z] of m)
          S.length > 1 && S.push(","), S.push(A), (A !== z || this.opts.es5) && (S.push(":"), (0, e.addCodeArg)(S, z));
        return S.push("}"), new e._Code(S);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(m, S, A) {
        if (this._blockNode(new u(m)), S && A)
          this.code(S).else().code(A).endIf();
        else if (S)
          this.code(S).endIf();
        else if (A)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(m) {
        return this._elseNode(new u(m));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(u, h);
      }
      _for(m, S) {
        return this._blockNode(m), S && this.code(S).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(m, S) {
        return this._for(new f(m), S);
      }
      // `for` statement for a range of values
      forRange(m, S, A, z, F = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const J = this._scope.toName(m);
        return this._for(new y(F, J, S, A), () => z(J));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(m, S, A, z = t.varKinds.const) {
        const F = this._scope.toName(m);
        if (this.opts.es5) {
          const J = S instanceof e.Name ? S : this.var("_arr", S);
          return this.forRange("_i", 0, (0, e._)`${J}.length`, (B) => {
            this.var(F, (0, e._)`${J}[${B}]`), A(F);
          });
        }
        return this._for(new v("of", z, F, S), () => A(F));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(m, S, A, z = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(m, (0, e._)`Object.keys(${S})`, A);
        const F = this._scope.toName(m);
        return this._for(new v("in", z, F, S), () => A(F));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(c);
      }
      // `label` statement
      label(m) {
        return this._leafNode(new d(m));
      }
      // `break` statement
      break(m) {
        return this._leafNode(new p(m));
      }
      // `return` statement
      return(m) {
        const S = new P();
        if (this._blockNode(S), this.code(m), S.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(P);
      }
      // `try` statement
      try(m, S, A) {
        if (!S && !A)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const z = new R();
        if (this._blockNode(z), this.code(m), S) {
          const F = this.name("e");
          this._currNode = z.catch = new O(F), S(F);
        }
        return A && (this._currNode = z.finally = new D(), this.code(A)), this._endBlockNode(O, D);
      }
      // `throw` statement
      throw(m) {
        return this._leafNode(new w(m));
      }
      // start self-balancing block
      block(m, S) {
        return this._blockStarts.push(this._nodes.length), m && this.code(m).endBlock(S), this;
      }
      // end the current self-balancing block
      endBlock(m) {
        const S = this._blockStarts.pop();
        if (S === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const A = this._nodes.length - S;
        if (A < 0 || m !== void 0 && A !== m)
          throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${m} expected`);
        return this._nodes.length = S, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(m, S = e.nil, A, z) {
        return this._blockNode(new g(m, S, A)), z && this.code(z).endFunc(), this;
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
      _endBlockNode(m, S) {
        const A = this._currNode;
        if (A instanceof m || S && A instanceof S)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${S ? `${m.kind}/${S.kind}` : m.kind}"`);
      }
      _elseNode(m) {
        const S = this._currNode;
        if (!(S instanceof u))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = S.else = m, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const m = this._nodes;
        return m[m.length - 1];
      }
      set _currNode(m) {
        const S = this._nodes;
        S[S.length - 1] = m;
      }
    }
    s.CodeGen = V;
    function H(N, m) {
      for (const S in m)
        N[S] = (N[S] || 0) + (m[S] || 0);
      return N;
    }
    function U(N, m) {
      return m instanceof e._CodeOrName ? H(N, m.names) : N;
    }
    function Y(N, m, S) {
      if (N instanceof e.Name)
        return A(N);
      if (!z(N))
        return N;
      return new e._Code(N._items.reduce((F, J) => (J instanceof e.Name && (J = A(J)), J instanceof e._Code ? F.push(...J._items) : F.push(J), F), []));
      function A(F) {
        const J = S[F.str];
        return J === void 0 || m[F.str] !== 1 ? F : (delete m[F.str], J);
      }
      function z(F) {
        return F instanceof e._Code && F._items.some((J) => J instanceof e.Name && m[J.str] === 1 && S[J.str] !== void 0);
      }
    }
    function ne(N, m) {
      for (const S in m)
        N[S] = (N[S] || 0) - (m[S] || 0);
    }
    function le(N) {
      return typeof N == "boolean" || typeof N == "number" || N === null ? !N : (0, e._)`!${I(N)}`;
    }
    s.not = le;
    const fe = T(s.operators.AND);
    function x(...N) {
      return N.reduce(fe);
    }
    s.and = x;
    const ce = T(s.operators.OR);
    function q(...N) {
      return N.reduce(ce);
    }
    s.or = q;
    function T(N) {
      return (m, S) => m === e.nil ? S : S === e.nil ? m : (0, e._)`${I(m)} ${N} ${I(S)}`;
    }
    function I(N) {
      return N instanceof e.Name ? N : (0, e._)`(${N})`;
    }
  })(jt)), jt;
}
var W = {}, Zt;
function ee() {
  if (Zt) return W;
  Zt = 1, Object.defineProperty(W, "__esModule", { value: !0 }), W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
  const s = X(), e = $t();
  function t(v) {
    const g = {};
    for (const P of v)
      g[P] = !0;
    return g;
  }
  W.toHash = t;
  function r(v, g) {
    return typeof g == "boolean" ? g : Object.keys(g).length === 0 ? !0 : (i(v, g), !n(g, v.self.RULES.all));
  }
  W.alwaysValidSchema = r;
  function i(v, g = v.schema) {
    const { opts: P, self: R } = v;
    if (!P.strictSchema || typeof g == "boolean")
      return;
    const O = R.RULES.keywords;
    for (const D in g)
      O[D] || y(v, `unknown keyword: "${D}"`);
  }
  W.checkUnknownRules = i;
  function n(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const P in v)
      if (g[P])
        return !0;
    return !1;
  }
  W.schemaHasRules = n;
  function o(v, g) {
    if (typeof v == "boolean")
      return !v;
    for (const P in v)
      if (P !== "$ref" && g.all[P])
        return !0;
    return !1;
  }
  W.schemaHasRulesButRef = o;
  function a({ topSchemaRef: v, schemaPath: g }, P, R, O) {
    if (!O) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, s._)`${P}`;
    }
    return (0, s._)`${v}${g}${(0, s.getProperty)(R)}`;
  }
  W.schemaRefOrVal = a;
  function l(v) {
    return w(decodeURIComponent(v));
  }
  W.unescapeFragment = l;
  function d(v) {
    return encodeURIComponent(p(v));
  }
  W.escapeFragment = d;
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
      for (const P of v)
        g(P);
    else
      g(v);
  }
  W.eachItem = _;
  function $({ mergeNames: v, mergeToName: g, mergeValues: P, resultToName: R }) {
    return (O, D, V, H) => {
      const U = V === void 0 ? D : V instanceof s.Name ? (D instanceof s.Name ? v(O, D, V) : g(O, D, V), V) : D instanceof s.Name ? (g(O, V, D), D) : P(D, V);
      return H === s.Name && !(U instanceof s.Name) ? R(O, U) : U;
    };
  }
  W.mergeEvaluated = {
    props: $({
      mergeNames: (v, g, P) => v.if((0, s._)`${P} !== true && ${g} !== undefined`, () => {
        v.if((0, s._)`${g} === true`, () => v.assign(P, !0), () => v.assign(P, (0, s._)`${P} || {}`).code((0, s._)`Object.assign(${P}, ${g})`));
      }),
      mergeToName: (v, g, P) => v.if((0, s._)`${P} !== true`, () => {
        g === !0 ? v.assign(P, !0) : (v.assign(P, (0, s._)`${P} || {}`), b(v, P, g));
      }),
      mergeValues: (v, g) => v === !0 ? !0 : { ...v, ...g },
      resultToName: E
    }),
    items: $({
      mergeNames: (v, g, P) => v.if((0, s._)`${P} !== true && ${g} !== undefined`, () => v.assign(P, (0, s._)`${g} === true ? true : ${P} > ${g} ? ${P} : ${g}`)),
      mergeToName: (v, g, P) => v.if((0, s._)`${P} !== true`, () => v.assign(P, g === !0 ? !0 : (0, s._)`${P} > ${g} ? ${P} : ${g}`)),
      mergeValues: (v, g) => v === !0 ? !0 : Math.max(v, g),
      resultToName: (v, g) => v.var("items", g)
    })
  };
  function E(v, g) {
    if (g === !0)
      return v.var("props", !0);
    const P = v.var("props", (0, s._)`{}`);
    return g !== void 0 && b(v, P, g), P;
  }
  W.evaluatedPropsToName = E;
  function b(v, g, P) {
    Object.keys(P).forEach((R) => v.assign((0, s._)`${g}${(0, s.getProperty)(R)}`, !0));
  }
  W.setEvaluated = b;
  const h = {};
  function u(v, g) {
    return v.scopeValue("func", {
      ref: g,
      code: h[g.code] || (h[g.code] = new e._Code(g.code))
    });
  }
  W.useFunc = u;
  var c;
  (function(v) {
    v[v.Num = 0] = "Num", v[v.Str = 1] = "Str";
  })(c || (W.Type = c = {}));
  function f(v, g, P) {
    if (v instanceof s.Name) {
      const R = g === c.Num;
      return P ? R ? (0, s._)`"[" + ${v} + "]"` : (0, s._)`"['" + ${v} + "']"` : R ? (0, s._)`"/" + ${v}` : (0, s._)`"/" + ${v}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, s.getProperty)(v).toString() : "/" + p(v);
  }
  W.getErrorPath = f;
  function y(v, g, P = v.opts.strictSchema) {
    if (P) {
      if (g = `strict mode: ${g}`, P === !0)
        throw new Error(g);
      v.self.logger.warn(g);
    }
  }
  return W.checkStrictMode = y, W;
}
var Ve = {}, er;
function $e() {
  if (er) return Ve;
  er = 1, Object.defineProperty(Ve, "__esModule", { value: !0 });
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
  return Ve.default = e, Ve;
}
var tr;
function St() {
  return tr || (tr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.extendErrors = s.resetErrorsCount = s.reportExtraError = s.reportError = s.keyword$DataError = s.keywordError = void 0;
    const e = X(), t = ee(), r = $e();
    s.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, s.keyword$DataError = {
      message: ({ keyword: h, schemaType: u }) => u ? (0, e.str)`"${h}" keyword must be ${u} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function i(h, u = s.keywordError, c, f) {
      const { it: y } = h, { gen: v, compositeRule: g, allErrors: P } = y, R = w(h, u, c);
      f ?? (g || P) ? l(v, R) : d(y, (0, e._)`[${R}]`);
    }
    s.reportError = i;
    function n(h, u = s.keywordError, c) {
      const { it: f } = h, { gen: y, compositeRule: v, allErrors: g } = f, P = w(h, u, c);
      l(y, P), v || g || d(f, r.default.vErrors);
    }
    s.reportExtraError = n;
    function o(h, u) {
      h.assign(r.default.errors, u), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(u, () => h.assign((0, e._)`${r.default.vErrors}.length`, u), () => h.assign(r.default.vErrors, null)));
    }
    s.resetErrorsCount = o;
    function a({ gen: h, keyword: u, schemaValue: c, data: f, errsCount: y, it: v }) {
      if (y === void 0)
        throw new Error("ajv implementation error");
      const g = h.name("err");
      h.forRange("i", y, r.default.errors, (P) => {
        h.const(g, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${g}.instancePath === undefined`, () => h.assign((0, e._)`${g}.instancePath`, (0, e.strConcat)(r.default.instancePath, v.errorPath))), h.assign((0, e._)`${g}.schemaPath`, (0, e.str)`${v.errSchemaPath}/${u}`), v.opts.verbose && (h.assign((0, e._)`${g}.schema`, c), h.assign((0, e._)`${g}.data`, f));
      });
    }
    s.extendErrors = a;
    function l(h, u) {
      const c = h.const("err", u);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${c}]`), (0, e._)`${r.default.vErrors}.push(${c})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function d(h, u) {
      const { gen: c, validateName: f, schemaEnv: y } = h;
      y.$async ? c.throw((0, e._)`new ${h.ValidationError}(${u})`) : (c.assign((0, e._)`${f}.errors`, u), c.return(!1));
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
    function w(h, u, c) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, u, c);
    }
    function _(h, u, c = {}) {
      const { gen: f, it: y } = h, v = [
        $(y, c),
        E(h, c)
      ];
      return b(h, u, v), f.object(...v);
    }
    function $({ errorPath: h }, { instancePath: u }) {
      const c = u ? (0, e.str)`${h}${(0, t.getErrorPath)(u, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, c)];
    }
    function E({ keyword: h, it: { errSchemaPath: u } }, { schemaPath: c, parentSchema: f }) {
      let y = f ? u : (0, e.str)`${u}/${h}`;
      return c && (y = (0, e.str)`${y}${(0, t.getErrorPath)(c, t.Type.Str)}`), [p.schemaPath, y];
    }
    function b(h, { params: u, message: c }, f) {
      const { keyword: y, data: v, schemaValue: g, it: P } = h, { opts: R, propertyName: O, topSchemaRef: D, schemaPath: V } = P;
      f.push([p.keyword, y], [p.params, typeof u == "function" ? u(h) : u || (0, e._)`{}`]), R.messages && f.push([p.message, typeof c == "function" ? c(h) : c]), R.verbose && f.push([p.schema, g], [p.parentSchema, (0, e._)`${D}${V}`], [r.default.data, v]), O && f.push([p.propertyName, O]);
    }
  })(At)), At;
}
var rr;
function In() {
  if (rr) return Ee;
  rr = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.boolOrEmptySchema = Ee.topBoolOrEmptySchema = void 0;
  const s = St(), e = X(), t = $e(), r = {
    message: "boolean schema is false"
  };
  function i(a) {
    const { gen: l, schema: d, validateName: p } = a;
    d === !1 ? o(a, !1) : typeof d == "object" && d.$async === !0 ? l.return(t.default.data) : (l.assign((0, e._)`${p}.errors`, null), l.return(!0));
  }
  Ee.topBoolOrEmptySchema = i;
  function n(a, l) {
    const { gen: d, schema: p } = a;
    p === !1 ? (d.var(l, !1), o(a)) : d.var(l, !0);
  }
  Ee.boolOrEmptySchema = n;
  function o(a, l) {
    const { gen: d, data: p } = a, w = {
      gen: d,
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
var ae = {}, Me = {}, nr;
function dn() {
  if (nr) return Me;
  nr = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.getRules = Me.isJSONType = void 0;
  const s = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(s);
  function t(i) {
    return typeof i == "string" && e.has(i);
  }
  Me.isJSONType = t;
  function r() {
    const i = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...i, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, i.number, i.string, i.array, i.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Me.getRules = r, Me;
}
var ge = {}, ir;
function fn() {
  if (ir) return ge;
  ir = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.shouldUseRule = ge.shouldUseGroup = ge.schemaHasRulesForType = void 0;
  function s({ schema: r, self: i }, n) {
    const o = i.RULES.types[n];
    return o && o !== !0 && e(r, o);
  }
  ge.schemaHasRulesForType = s;
  function e(r, i) {
    return i.rules.some((n) => t(r, n));
  }
  ge.shouldUseGroup = e;
  function t(r, i) {
    var n;
    return r[i.keyword] !== void 0 || ((n = i.definition.implements) === null || n === void 0 ? void 0 : n.some((o) => r[o] !== void 0));
  }
  return ge.shouldUseRule = t, ge;
}
var sr;
function Pt() {
  if (sr) return ae;
  sr = 1, Object.defineProperty(ae, "__esModule", { value: !0 }), ae.reportTypeError = ae.checkDataTypes = ae.checkDataType = ae.coerceAndCheckDataType = ae.getJSONTypes = ae.getSchemaTypes = ae.DataType = void 0;
  const s = dn(), e = fn(), t = St(), r = X(), i = ee();
  var n;
  (function(c) {
    c[c.Correct = 0] = "Correct", c[c.Wrong = 1] = "Wrong";
  })(n || (ae.DataType = n = {}));
  function o(c) {
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
  ae.getSchemaTypes = o;
  function a(c) {
    const f = Array.isArray(c) ? c : c ? [c] : [];
    if (f.every(s.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  ae.getJSONTypes = a;
  function l(c, f) {
    const { gen: y, data: v, opts: g } = c, P = p(f, g.coerceTypes), R = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(c, f[0]));
    if (R) {
      const O = E(f, v, g.strictNumbers, n.Wrong);
      y.if(O, () => {
        P.length ? w(c, f, P) : h(c);
      });
    }
    return R;
  }
  ae.coerceAndCheckDataType = l;
  const d = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function p(c, f) {
    return f ? c.filter((y) => d.has(y) || f === "array" && y === "array") : [];
  }
  function w(c, f, y) {
    const { gen: v, data: g, opts: P } = c, R = v.let("dataType", (0, r._)`typeof ${g}`), O = v.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && v.if((0, r._)`${R} == 'object' && Array.isArray(${g}) && ${g}.length == 1`, () => v.assign(g, (0, r._)`${g}[0]`).assign(R, (0, r._)`typeof ${g}`).if(E(f, g, P.strictNumbers), () => v.assign(O, g))), v.if((0, r._)`${O} !== undefined`);
    for (const V of y)
      (d.has(V) || V === "array" && P.coerceTypes === "array") && D(V);
    v.else(), h(c), v.endIf(), v.if((0, r._)`${O} !== undefined`, () => {
      v.assign(g, O), _(c, O);
    });
    function D(V) {
      switch (V) {
        case "string":
          v.elseIf((0, r._)`${R} == "number" || ${R} == "boolean"`).assign(O, (0, r._)`"" + ${g}`).elseIf((0, r._)`${g} === null`).assign(O, (0, r._)`""`);
          return;
        case "number":
          v.elseIf((0, r._)`${R} == "boolean" || ${g} === null
              || (${R} == "string" && ${g} && ${g} == +${g})`).assign(O, (0, r._)`+${g}`);
          return;
        case "integer":
          v.elseIf((0, r._)`${R} === "boolean" || ${g} === null
              || (${R} === "string" && ${g} && ${g} == +${g} && !(${g} % 1))`).assign(O, (0, r._)`+${g}`);
          return;
        case "boolean":
          v.elseIf((0, r._)`${g} === "false" || ${g} === 0 || ${g} === null`).assign(O, !1).elseIf((0, r._)`${g} === "true" || ${g} === 1`).assign(O, !0);
          return;
        case "null":
          v.elseIf((0, r._)`${g} === "" || ${g} === 0 || ${g} === false`), v.assign(O, null);
          return;
        case "array":
          v.elseIf((0, r._)`${R} === "string" || ${R} === "number"
              || ${R} === "boolean" || ${g} === null`).assign(O, (0, r._)`[${g}]`);
      }
    }
  }
  function _({ gen: c, parentData: f, parentDataProperty: y }, v) {
    c.if((0, r._)`${f} !== undefined`, () => c.assign((0, r._)`${f}[${y}]`, v));
  }
  function $(c, f, y, v = n.Correct) {
    const g = v === n.Correct ? r.operators.EQ : r.operators.NEQ;
    let P;
    switch (c) {
      case "null":
        return (0, r._)`${f} ${g} null`;
      case "array":
        P = (0, r._)`Array.isArray(${f})`;
        break;
      case "object":
        P = (0, r._)`${f} && typeof ${f} == "object" && !Array.isArray(${f})`;
        break;
      case "integer":
        P = R((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        P = R();
        break;
      default:
        return (0, r._)`typeof ${f} ${g} ${c}`;
    }
    return v === n.Correct ? P : (0, r.not)(P);
    function R(O = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, O, y ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  ae.checkDataType = $;
  function E(c, f, y, v) {
    if (c.length === 1)
      return $(c[0], f, y, v);
    let g;
    const P = (0, i.toHash)(c);
    if (P.array && P.object) {
      const R = (0, r._)`typeof ${f} != "object"`;
      g = P.null ? R : (0, r._)`!${f} || ${R}`, delete P.null, delete P.array, delete P.object;
    } else
      g = r.nil;
    P.number && delete P.integer;
    for (const R in P)
      g = (0, r.and)(g, $(R, f, y, v));
    return g;
  }
  ae.checkDataTypes = E;
  const b = {
    message: ({ schema: c }) => `must be ${c}`,
    params: ({ schema: c, schemaValue: f }) => typeof c == "string" ? (0, r._)`{type: ${c}}` : (0, r._)`{type: ${f}}`
  };
  function h(c) {
    const f = u(c);
    (0, t.reportError)(f, b);
  }
  ae.reportTypeError = h;
  function u(c) {
    const { gen: f, data: y, schema: v } = c, g = (0, i.schemaRefOrVal)(c, v, "type");
    return {
      gen: f,
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
  return ae;
}
var Ie = {}, or;
function On() {
  if (or) return Ie;
  or = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.assignDefaults = void 0;
  const s = X(), e = ee();
  function t(i, n) {
    const { properties: o, items: a } = i.schema;
    if (n === "object" && o)
      for (const l in o)
        r(i, l, o[l].default);
    else n === "array" && Array.isArray(a) && a.forEach((l, d) => r(i, d, l.default));
  }
  Ie.assignDefaults = t;
  function r(i, n, o) {
    const { gen: a, compositeRule: l, data: d, opts: p } = i;
    if (o === void 0)
      return;
    const w = (0, s._)`${d}${(0, s.getProperty)(n)}`;
    if (l) {
      (0, e.checkStrictMode)(i, `default is ignored for: ${w}`);
      return;
    }
    let _ = (0, s._)`${w} === undefined`;
    p.useDefaults === "empty" && (_ = (0, s._)`${_} || ${w} === null || ${w} === ""`), a.if(_, (0, s._)`${w} = ${(0, s.stringify)(o)}`);
  }
  return Ie;
}
var pe = {}, te = {}, ar;
function me() {
  if (ar) return te;
  ar = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const s = X(), e = ee(), t = $e(), r = ee();
  function i(c, f) {
    const { gen: y, data: v, it: g } = c;
    y.if(p(y, v, f, g.opts.ownProperties), () => {
      c.setParams({ missingProperty: (0, s._)`${f}` }, !0), c.error();
    });
  }
  te.checkReportMissingProp = i;
  function n({ gen: c, data: f, it: { opts: y } }, v, g) {
    return (0, s.or)(...v.map((P) => (0, s.and)(p(c, f, P, y.ownProperties), (0, s._)`${g} = ${P}`)));
  }
  te.checkMissingProp = n;
  function o(c, f) {
    c.setParams({ missingProperty: f }, !0), c.error();
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
  function l(c, f, y) {
    return (0, s._)`${a(c)}.call(${f}, ${y})`;
  }
  te.isOwnProperty = l;
  function d(c, f, y, v) {
    const g = (0, s._)`${f}${(0, s.getProperty)(y)} !== undefined`;
    return v ? (0, s._)`${g} && ${l(c, f, y)}` : g;
  }
  te.propertyInData = d;
  function p(c, f, y, v) {
    const g = (0, s._)`${f}${(0, s.getProperty)(y)} === undefined`;
    return v ? (0, s.or)(g, (0, s.not)(l(c, f, y))) : g;
  }
  te.noPropertyInData = p;
  function w(c) {
    return c ? Object.keys(c).filter((f) => f !== "__proto__") : [];
  }
  te.allSchemaProperties = w;
  function _(c, f) {
    return w(f).filter((y) => !(0, e.alwaysValidSchema)(c, f[y]));
  }
  te.schemaProperties = _;
  function $({ schemaCode: c, data: f, it: { gen: y, topSchemaRef: v, schemaPath: g, errorPath: P }, it: R }, O, D, V) {
    const H = V ? (0, s._)`${c}, ${f}, ${v}${g}` : f, U = [
      [t.default.instancePath, (0, s.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, R.parentData],
      [t.default.parentDataProperty, R.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    R.opts.dynamicRef && U.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const Y = (0, s._)`${H}, ${y.object(...U)}`;
    return D !== s.nil ? (0, s._)`${O}.call(${D}, ${Y})` : (0, s._)`${O}(${Y})`;
  }
  te.callValidateCode = $;
  const E = (0, s._)`new RegExp`;
  function b({ gen: c, it: { opts: f } }, y) {
    const v = f.unicodeRegExp ? "u" : "", { regExp: g } = f.code, P = g(y, v);
    return c.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, s._)`${g.code === "new RegExp" ? E : (0, r.useFunc)(c, g)}(${y}, ${v})`
    });
  }
  te.usePattern = b;
  function h(c) {
    const { gen: f, data: y, keyword: v, it: g } = c, P = f.name("valid");
    if (g.allErrors) {
      const O = f.let("valid", !0);
      return R(() => f.assign(O, !1)), O;
    }
    return f.var(P, !0), R(() => f.break()), P;
    function R(O) {
      const D = f.const("len", (0, s._)`${y}.length`);
      f.forRange("i", 0, D, (V) => {
        c.subschema({
          keyword: v,
          dataProp: V,
          dataPropType: e.Type.Num
        }, P), f.if((0, s.not)(P), O);
      });
    }
  }
  te.validateArray = h;
  function u(c) {
    const { gen: f, schema: y, keyword: v, it: g } = c;
    if (!Array.isArray(y))
      throw new Error("ajv implementation error");
    if (y.some((D) => (0, e.alwaysValidSchema)(g, D)) && !g.opts.unevaluated)
      return;
    const R = f.let("valid", !1), O = f.name("_valid");
    f.block(() => y.forEach((D, V) => {
      const H = c.subschema({
        keyword: v,
        schemaProp: V,
        compositeRule: !0
      }, O);
      f.assign(R, (0, s._)`${R} || ${O}`), c.mergeValidEvaluated(H, O) || f.if((0, s.not)(R));
    })), c.result(R, () => c.reset(), () => c.error(!0));
  }
  return te.validateUnion = u, te;
}
var cr;
function qn() {
  if (cr) return pe;
  cr = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.validateKeywordUsage = pe.validSchemaType = pe.funcKeywordCode = pe.macroKeywordCode = void 0;
  const s = X(), e = $e(), t = me(), r = St();
  function i(_, $) {
    const { gen: E, keyword: b, schema: h, parentSchema: u, it: c } = _, f = $.macro.call(c.self, h, u, c), y = d(E, b, f);
    c.opts.validateSchema !== !1 && c.self.validateSchema(f, !0);
    const v = E.name("valid");
    _.subschema({
      schema: f,
      schemaPath: s.nil,
      errSchemaPath: `${c.errSchemaPath}/${b}`,
      topSchemaRef: y,
      compositeRule: !0
    }, v), _.pass(v, () => _.error(!0));
  }
  pe.macroKeywordCode = i;
  function n(_, $) {
    var E;
    const { gen: b, keyword: h, schema: u, parentSchema: c, $data: f, it: y } = _;
    l(y, $);
    const v = !f && $.compile ? $.compile.call(y.self, u, c, y) : $.validate, g = d(b, h, v), P = b.let("valid");
    _.block$data(P, R), _.ok((E = $.valid) !== null && E !== void 0 ? E : P);
    function R() {
      if ($.errors === !1)
        V(), $.modifying && o(_), H(() => _.error());
      else {
        const U = $.async ? O() : D();
        $.modifying && o(_), H(() => a(_, U));
      }
    }
    function O() {
      const U = b.let("ruleErrs", null);
      return b.try(() => V((0, s._)`await `), (Y) => b.assign(P, !1).if((0, s._)`${Y} instanceof ${y.ValidationError}`, () => b.assign(U, (0, s._)`${Y}.errors`), () => b.throw(Y))), U;
    }
    function D() {
      const U = (0, s._)`${g}.errors`;
      return b.assign(U, null), V(s.nil), U;
    }
    function V(U = $.async ? (0, s._)`await ` : s.nil) {
      const Y = y.opts.passContext ? e.default.this : e.default.self, ne = !("compile" in $ && !f || $.schema === !1);
      b.assign(P, (0, s._)`${U}${(0, t.callValidateCode)(_, g, Y, ne)}`, $.modifying);
    }
    function H(U) {
      var Y;
      b.if((0, s.not)((Y = $.valid) !== null && Y !== void 0 ? Y : P), U);
    }
  }
  pe.funcKeywordCode = n;
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
  function d(_, $, E) {
    if (E === void 0)
      throw new Error(`keyword "${$}" failed to compile`);
    return _.scopeValue("keyword", typeof E == "function" ? { ref: E } : { ref: E, code: (0, s.stringify)(E) });
  }
  function p(_, $, E = !1) {
    return !$.length || $.some((b) => b === "array" ? Array.isArray(_) : b === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == b || E && typeof _ > "u");
  }
  pe.validSchemaType = p;
  function w({ schema: _, opts: $, self: E, errSchemaPath: b }, h, u) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(u) : h.keyword !== u)
      throw new Error("ajv implementation error");
    const c = h.dependencies;
    if (c?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${u}: ${c.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[u])) {
      const y = `keyword "${u}" value is invalid at path "${b}": ` + E.errorsText(h.validateSchema.errors);
      if ($.validateSchema === "log")
        E.logger.error(y);
      else
        throw new Error(y);
    }
  }
  return pe.validateKeywordUsage = w, pe;
}
var ve = {}, lr;
function Cn() {
  if (lr) return ve;
  lr = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.extendSubschemaMode = ve.extendSubschemaData = ve.getSubschema = void 0;
  const s = X(), e = ee();
  function t(n, { keyword: o, schemaProp: a, schema: l, schemaPath: d, errSchemaPath: p, topSchemaRef: w }) {
    if (o !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const _ = n.schema[o];
      return a === void 0 ? {
        schema: _,
        schemaPath: (0, s._)`${n.schemaPath}${(0, s.getProperty)(o)}`,
        errSchemaPath: `${n.errSchemaPath}/${o}`
      } : {
        schema: _[a],
        schemaPath: (0, s._)`${n.schemaPath}${(0, s.getProperty)(o)}${(0, s.getProperty)(a)}`,
        errSchemaPath: `${n.errSchemaPath}/${o}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (l !== void 0) {
      if (d === void 0 || p === void 0 || w === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: d,
        topSchemaRef: w,
        errSchemaPath: p
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  ve.getSubschema = t;
  function r(n, o, { dataProp: a, dataPropType: l, data: d, dataTypes: p, propertyName: w }) {
    if (d !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = o;
    if (a !== void 0) {
      const { errorPath: E, dataPathArr: b, opts: h } = o, u = _.let("data", (0, s._)`${o.data}${(0, s.getProperty)(a)}`, !0);
      $(u), n.errorPath = (0, s.str)`${E}${(0, e.getErrorPath)(a, l, h.jsPropertySyntax)}`, n.parentDataProperty = (0, s._)`${a}`, n.dataPathArr = [...b, n.parentDataProperty];
    }
    if (d !== void 0) {
      const E = d instanceof s.Name ? d : _.let("data", d, !0);
      $(E), w !== void 0 && (n.propertyName = w);
    }
    p && (n.dataTypes = p);
    function $(E) {
      n.data = E, n.dataLevel = o.dataLevel + 1, n.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), n.parentData = o.data, n.dataNames = [...o.dataNames, E];
    }
  }
  ve.extendSubschemaData = r;
  function i(n, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: l, createErrors: d, allErrors: p }) {
    l !== void 0 && (n.compositeRule = l), d !== void 0 && (n.createErrors = d), p !== void 0 && (n.allErrors = p), n.jtdDiscriminator = o, n.jtdMetadata = a;
  }
  return ve.extendSubschemaMode = i, ve;
}
var de = {}, qt, ur;
function hn() {
  return ur || (ur = 1, qt = function s(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var r, i, n;
      if (Array.isArray(e)) {
        if (r = e.length, r != t.length) return !1;
        for (i = r; i-- !== 0; )
          if (!s(e[i], t[i])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (n = Object.keys(e), r = n.length, r !== Object.keys(t).length) return !1;
      for (i = r; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, n[i])) return !1;
      for (i = r; i-- !== 0; ) {
        var o = n[i];
        if (!s(e[o], t[o])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), qt;
}
var Ct = { exports: {} }, dr;
function Dn() {
  if (dr) return Ct.exports;
  dr = 1;
  var s = Ct.exports = function(r, i, n) {
    typeof i == "function" && (n = i, i = {}), n = i.cb || n;
    var o = typeof n == "function" ? n : n.pre || function() {
    }, a = n.post || function() {
    };
    e(i, o, a, r, "", r);
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
  function e(r, i, n, o, a, l, d, p, w, _) {
    if (o && typeof o == "object" && !Array.isArray(o)) {
      i(o, a, l, d, p, w, _);
      for (var $ in o) {
        var E = o[$];
        if (Array.isArray(E)) {
          if ($ in s.arrayKeywords)
            for (var b = 0; b < E.length; b++)
              e(r, i, n, E[b], a + "/" + $ + "/" + b, l, a, $, o, b);
        } else if ($ in s.propsKeywords) {
          if (E && typeof E == "object")
            for (var h in E)
              e(r, i, n, E[h], a + "/" + $ + "/" + t(h), l, a, $, o, h);
        } else ($ in s.keywords || r.allKeys && !($ in s.skipKeywords)) && e(r, i, n, E, a + "/" + $, l, a, $, o);
      }
      n(o, a, l, d, p, w, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ct.exports;
}
var fr;
function Et() {
  if (fr) return de;
  fr = 1, Object.defineProperty(de, "__esModule", { value: !0 }), de.getSchemaRefs = de.resolveUrl = de.normalizeId = de._getFullPath = de.getFullPath = de.inlineRef = void 0;
  const s = ee(), e = hn(), t = Dn(), r = /* @__PURE__ */ new Set([
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
  function i(b, h = !0) {
    return typeof b == "boolean" ? !0 : h === !0 ? !o(b) : h ? a(b) <= h : !1;
  }
  de.inlineRef = i;
  const n = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(b) {
    for (const h in b) {
      if (n.has(h))
        return !0;
      const u = b[h];
      if (Array.isArray(u) && u.some(o) || typeof u == "object" && o(u))
        return !0;
    }
    return !1;
  }
  function a(b) {
    let h = 0;
    for (const u in b) {
      if (u === "$ref")
        return 1 / 0;
      if (h++, !r.has(u) && (typeof b[u] == "object" && (0, s.eachItem)(b[u], (c) => h += a(c)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function l(b, h = "", u) {
    u !== !1 && (h = w(h));
    const c = b.parse(h);
    return d(b, c);
  }
  de.getFullPath = l;
  function d(b, h) {
    return b.serialize(h).split("#")[0] + "#";
  }
  de._getFullPath = d;
  const p = /#\/?$/;
  function w(b) {
    return b ? b.replace(p, "") : "";
  }
  de.normalizeId = w;
  function _(b, h, u) {
    return u = w(u), b.resolve(h, u);
  }
  de.resolveUrl = _;
  const $ = /^[a-z_][-a-z0-9._]*$/i;
  function E(b, h) {
    if (typeof b == "boolean")
      return {};
    const { schemaId: u, uriResolver: c } = this.opts, f = w(b[u] || h), y = { "": f }, v = l(c, f, !1), g = {}, P = /* @__PURE__ */ new Set();
    return t(b, { allKeys: !0 }, (D, V, H, U) => {
      if (U === void 0)
        return;
      const Y = v + V;
      let ne = y[U];
      typeof D[u] == "string" && (ne = le.call(this, D[u])), fe.call(this, D.$anchor), fe.call(this, D.$dynamicAnchor), y[V] = ne;
      function le(x) {
        const ce = this.opts.uriResolver.resolve;
        if (x = w(ne ? ce(ne, x) : x), P.has(x))
          throw O(x);
        P.add(x);
        let q = this.refs[x];
        return typeof q == "string" && (q = this.refs[q]), typeof q == "object" ? R(D, q.schema, x) : x !== w(Y) && (x[0] === "#" ? (R(D, g[x], x), g[x] = D) : this.refs[x] = Y), x;
      }
      function fe(x) {
        if (typeof x == "string") {
          if (!$.test(x))
            throw new Error(`invalid anchor "${x}"`);
          le.call(this, `#${x}`);
        }
      }
    }), g;
    function R(D, V, H) {
      if (V !== void 0 && !e(D, V))
        throw O(H);
    }
    function O(D) {
      return new Error(`reference "${D}" resolves to more than one schema`);
    }
  }
  return de.getSchemaRefs = E, de;
}
var hr;
function Mt() {
  if (hr) return ye;
  hr = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.getData = ye.KeywordCxt = ye.validateFunctionCode = void 0;
  const s = In(), e = Pt(), t = fn(), r = Pt(), i = On(), n = qn(), o = Cn(), a = X(), l = $e(), d = Et(), p = ee(), w = St();
  function _(M) {
    if (v(M) && (P(M), y(M))) {
      h(M);
      return;
    }
    $(M, () => (0, s.topBoolOrEmptySchema)(M));
  }
  ye.validateFunctionCode = _;
  function $({ gen: M, validateName: k, schema: j, schemaEnv: C, opts: L }, K) {
    L.code.es5 ? M.func(k, (0, a._)`${l.default.data}, ${l.default.valCxt}`, C.$async, () => {
      M.code((0, a._)`"use strict"; ${c(j, L)}`), b(M, L), M.code(K);
    }) : M.func(k, (0, a._)`${l.default.data}, ${E(L)}`, C.$async, () => M.code(c(j, L)).code(K));
  }
  function E(M) {
    return (0, a._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${M.dynamicRef ? (0, a._)`, ${l.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function b(M, k) {
    M.if(l.default.valCxt, () => {
      M.var(l.default.instancePath, (0, a._)`${l.default.valCxt}.${l.default.instancePath}`), M.var(l.default.parentData, (0, a._)`${l.default.valCxt}.${l.default.parentData}`), M.var(l.default.parentDataProperty, (0, a._)`${l.default.valCxt}.${l.default.parentDataProperty}`), M.var(l.default.rootData, (0, a._)`${l.default.valCxt}.${l.default.rootData}`), k.dynamicRef && M.var(l.default.dynamicAnchors, (0, a._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      M.var(l.default.instancePath, (0, a._)`""`), M.var(l.default.parentData, (0, a._)`undefined`), M.var(l.default.parentDataProperty, (0, a._)`undefined`), M.var(l.default.rootData, l.default.data), k.dynamicRef && M.var(l.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(M) {
    const { schema: k, opts: j, gen: C } = M;
    $(M, () => {
      j.$comment && k.$comment && U(M), D(M), C.let(l.default.vErrors, null), C.let(l.default.errors, 0), j.unevaluated && u(M), R(M), Y(M);
    });
  }
  function u(M) {
    const { gen: k, validateName: j } = M;
    M.evaluated = k.const("evaluated", (0, a._)`${j}.evaluated`), k.if((0, a._)`${M.evaluated}.dynamicProps`, () => k.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), k.if((0, a._)`${M.evaluated}.dynamicItems`, () => k.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function c(M, k) {
    const j = typeof M == "object" && M[k.schemaId];
    return j && (k.code.source || k.code.process) ? (0, a._)`/*# sourceURL=${j} */` : a.nil;
  }
  function f(M, k) {
    if (v(M) && (P(M), y(M))) {
      g(M, k);
      return;
    }
    (0, s.boolOrEmptySchema)(M, k);
  }
  function y({ schema: M, self: k }) {
    if (typeof M == "boolean")
      return !M;
    for (const j in M)
      if (k.RULES.all[j])
        return !0;
    return !1;
  }
  function v(M) {
    return typeof M.schema != "boolean";
  }
  function g(M, k) {
    const { schema: j, gen: C, opts: L } = M;
    L.$comment && j.$comment && U(M), V(M), H(M);
    const K = C.const("_errs", l.default.errors);
    R(M, K), C.var(k, (0, a._)`${K} === ${l.default.errors}`);
  }
  function P(M) {
    (0, p.checkUnknownRules)(M), O(M);
  }
  function R(M, k) {
    if (M.opts.jtd)
      return le(M, [], !1, k);
    const j = (0, e.getSchemaTypes)(M.schema), C = (0, e.coerceAndCheckDataType)(M, j);
    le(M, j, !C, k);
  }
  function O(M) {
    const { schema: k, errSchemaPath: j, opts: C, self: L } = M;
    k.$ref && C.ignoreKeywordsWithRef && (0, p.schemaHasRulesButRef)(k, L.RULES) && L.logger.warn(`$ref: keywords ignored in schema at path "${j}"`);
  }
  function D(M) {
    const { schema: k, opts: j } = M;
    k.default !== void 0 && j.useDefaults && j.strictSchema && (0, p.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function V(M) {
    const k = M.schema[M.opts.schemaId];
    k && (M.baseId = (0, d.resolveUrl)(M.opts.uriResolver, M.baseId, k));
  }
  function H(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function U({ gen: M, schemaEnv: k, schema: j, errSchemaPath: C, opts: L }) {
    const K = j.$comment;
    if (L.$comment === !0)
      M.code((0, a._)`${l.default.self}.logger.log(${K})`);
    else if (typeof L.$comment == "function") {
      const ie = (0, a.str)`${C}/$comment`, re = M.scopeValue("root", { ref: k.root });
      M.code((0, a._)`${l.default.self}.opts.$comment(${K}, ${ie}, ${re}.schema)`);
    }
  }
  function Y(M) {
    const { gen: k, schemaEnv: j, validateName: C, ValidationError: L, opts: K } = M;
    j.$async ? k.if((0, a._)`${l.default.errors} === 0`, () => k.return(l.default.data), () => k.throw((0, a._)`new ${L}(${l.default.vErrors})`)) : (k.assign((0, a._)`${C}.errors`, l.default.vErrors), K.unevaluated && ne(M), k.return((0, a._)`${l.default.errors} === 0`));
  }
  function ne({ gen: M, evaluated: k, props: j, items: C }) {
    j instanceof a.Name && M.assign((0, a._)`${k}.props`, j), C instanceof a.Name && M.assign((0, a._)`${k}.items`, C);
  }
  function le(M, k, j, C) {
    const { gen: L, schema: K, data: ie, allErrors: re, opts: G, self: Q } = M, { RULES: Z } = Q;
    if (K.$ref && (G.ignoreKeywordsWithRef || !(0, p.schemaHasRulesButRef)(K, Z))) {
      L.block(() => z(M, "$ref", Z.all.$ref.definition));
      return;
    }
    G.jtd || x(M, k), L.block(() => {
      for (const ue of Z.rules)
        oe(ue);
      oe(Z.post);
    });
    function oe(ue) {
      (0, t.shouldUseGroup)(K, ue) && (ue.type ? (L.if((0, r.checkDataType)(ue.type, ie, G.strictNumbers)), fe(M, ue), k.length === 1 && k[0] === ue.type && j && (L.else(), (0, r.reportTypeError)(M)), L.endIf()) : fe(M, ue), re || L.if((0, a._)`${l.default.errors} === ${C || 0}`));
    }
  }
  function fe(M, k) {
    const { gen: j, schema: C, opts: { useDefaults: L } } = M;
    L && (0, i.assignDefaults)(M, k.type), j.block(() => {
      for (const K of k.rules)
        (0, t.shouldUseRule)(C, K) && z(M, K.keyword, K.definition, k.type);
    });
  }
  function x(M, k) {
    M.schemaEnv.meta || !M.opts.strictTypes || (ce(M, k), M.opts.allowUnionTypes || q(M, k), T(M, M.dataTypes));
  }
  function ce(M, k) {
    if (k.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = k;
        return;
      }
      k.forEach((j) => {
        N(M.dataTypes, j) || S(M, `type "${j}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), m(M, k);
    }
  }
  function q(M, k) {
    k.length > 1 && !(k.length === 2 && k.includes("null")) && S(M, "use allowUnionTypes to allow union type keyword");
  }
  function T(M, k) {
    const j = M.self.RULES.all;
    for (const C in j) {
      const L = j[C];
      if (typeof L == "object" && (0, t.shouldUseRule)(M.schema, L)) {
        const { type: K } = L.definition;
        K.length && !K.some((ie) => I(k, ie)) && S(M, `missing type "${K.join(",")}" for keyword "${C}"`);
      }
    }
  }
  function I(M, k) {
    return M.includes(k) || k === "number" && M.includes("integer");
  }
  function N(M, k) {
    return M.includes(k) || k === "integer" && M.includes("number");
  }
  function m(M, k) {
    const j = [];
    for (const C of M.dataTypes)
      N(k, C) ? j.push(C) : k.includes("integer") && C === "number" && j.push("integer");
    M.dataTypes = j;
  }
  function S(M, k) {
    const j = M.schemaEnv.baseId + M.errSchemaPath;
    k += ` at "${j}" (strictTypes)`, (0, p.checkStrictMode)(M, k, M.opts.strictTypes);
  }
  class A {
    constructor(k, j, C) {
      if ((0, n.validateKeywordUsage)(k, j, C), this.gen = k.gen, this.allErrors = k.allErrors, this.keyword = C, this.data = k.data, this.schema = k.schema[C], this.$data = j.$data && k.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, p.schemaRefOrVal)(k, this.schema, C, this.$data), this.schemaType = j.schemaType, this.parentSchema = k.schema, this.params = {}, this.it = k, this.def = j, this.$data)
        this.schemaCode = k.gen.const("vSchema", B(this.$data, k));
      else if (this.schemaCode = this.schemaValue, !(0, n.validSchemaType)(this.schema, j.schemaType, j.allowUndefined))
        throw new Error(`${C} value must be ${JSON.stringify(j.schemaType)}`);
      ("code" in j ? j.trackErrors : j.errors !== !1) && (this.errsCount = k.gen.const("_errs", l.default.errors));
    }
    result(k, j, C) {
      this.failResult((0, a.not)(k), j, C);
    }
    failResult(k, j, C) {
      this.gen.if(k), C ? C() : this.error(), j ? (this.gen.else(), j(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(k, j) {
      this.failResult((0, a.not)(k), void 0, j);
    }
    fail(k) {
      if (k === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(k), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(k) {
      if (!this.$data)
        return this.fail(k);
      const { schemaCode: j } = this;
      this.fail((0, a._)`${j} !== undefined && (${(0, a.or)(this.invalid$data(), k)})`);
    }
    error(k, j, C) {
      if (j) {
        this.setParams(j), this._error(k, C), this.setParams({});
        return;
      }
      this._error(k, C);
    }
    _error(k, j) {
      (k ? w.reportExtraError : w.reportError)(this, this.def.error, j);
    }
    $dataError() {
      (0, w.reportError)(this, this.def.$dataError || w.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, w.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(k) {
      this.allErrors || this.gen.if(k);
    }
    setParams(k, j) {
      j ? Object.assign(this.params, k) : this.params = k;
    }
    block$data(k, j, C = a.nil) {
      this.gen.block(() => {
        this.check$data(k, C), j();
      });
    }
    check$data(k = a.nil, j = a.nil) {
      if (!this.$data)
        return;
      const { gen: C, schemaCode: L, schemaType: K, def: ie } = this;
      C.if((0, a.or)((0, a._)`${L} === undefined`, j)), k !== a.nil && C.assign(k, !0), (K.length || ie.validateSchema) && (C.elseIf(this.invalid$data()), this.$dataError(), k !== a.nil && C.assign(k, !1)), C.else();
    }
    invalid$data() {
      const { gen: k, schemaCode: j, schemaType: C, def: L, it: K } = this;
      return (0, a.or)(ie(), re());
      function ie() {
        if (C.length) {
          if (!(j instanceof a.Name))
            throw new Error("ajv implementation error");
          const G = Array.isArray(C) ? C : [C];
          return (0, a._)`${(0, r.checkDataTypes)(G, j, K.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function re() {
        if (L.validateSchema) {
          const G = k.scopeValue("validate$data", { ref: L.validateSchema });
          return (0, a._)`!${G}(${j})`;
        }
        return a.nil;
      }
    }
    subschema(k, j) {
      const C = (0, o.getSubschema)(this.it, k);
      (0, o.extendSubschemaData)(C, this.it, k), (0, o.extendSubschemaMode)(C, k);
      const L = { ...this.it, ...C, items: void 0, props: void 0 };
      return f(L, j), L;
    }
    mergeEvaluated(k, j) {
      const { it: C, gen: L } = this;
      C.opts.unevaluated && (C.props !== !0 && k.props !== void 0 && (C.props = p.mergeEvaluated.props(L, k.props, C.props, j)), C.items !== !0 && k.items !== void 0 && (C.items = p.mergeEvaluated.items(L, k.items, C.items, j)));
    }
    mergeValidEvaluated(k, j) {
      const { it: C, gen: L } = this;
      if (C.opts.unevaluated && (C.props !== !0 || C.items !== !0))
        return L.if(j, () => this.mergeEvaluated(k, a.Name)), !0;
    }
  }
  ye.KeywordCxt = A;
  function z(M, k, j, C) {
    const L = new A(M, j, k);
    "code" in j ? j.code(L, C) : L.$data && j.validate ? (0, n.funcKeywordCode)(L, j) : "macro" in j ? (0, n.macroKeywordCode)(L, j) : (j.compile || j.validate) && (0, n.funcKeywordCode)(L, j);
  }
  const F = /^\/(?:[^~]|~0|~1)*$/, J = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function B(M, { dataLevel: k, dataNames: j, dataPathArr: C }) {
    let L, K;
    if (M === "")
      return l.default.rootData;
    if (M[0] === "/") {
      if (!F.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      L = M, K = l.default.rootData;
    } else {
      const Q = J.exec(M);
      if (!Q)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const Z = +Q[1];
      if (L = Q[2], L === "#") {
        if (Z >= k)
          throw new Error(G("property/index", Z));
        return C[k - Z];
      }
      if (Z > k)
        throw new Error(G("data", Z));
      if (K = j[k - Z], !L)
        return K;
    }
    let ie = K;
    const re = L.split("/");
    for (const Q of re)
      Q && (K = (0, a._)`${K}${(0, a.getProperty)((0, p.unescapeJsonPointer)(Q))}`, ie = (0, a._)`${ie} && ${K}`);
    return ie;
    function G(Q, Z) {
      return `Cannot access ${Q} ${Z} levels up, current level is ${k}`;
    }
  }
  return ye.getData = B, ye;
}
var ze = {}, pr;
function Gt() {
  if (pr) return ze;
  pr = 1, Object.defineProperty(ze, "__esModule", { value: !0 });
  class s extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return ze.default = s, ze;
}
var Fe = {}, mr;
function kt() {
  if (mr) return Fe;
  mr = 1, Object.defineProperty(Fe, "__esModule", { value: !0 });
  const s = Et();
  class e extends Error {
    constructor(r, i, n, o) {
      super(o || `can't resolve reference ${n} from id ${i}`), this.missingRef = (0, s.resolveUrl)(r, i, n), this.missingSchema = (0, s.normalizeId)((0, s.getFullPath)(r, this.missingRef));
    }
  }
  return Fe.default = e, Fe;
}
var he = {}, yr;
function Kt() {
  if (yr) return he;
  yr = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.resolveSchema = he.getCompilingSchema = he.resolveRef = he.compileSchema = he.SchemaEnv = void 0;
  const s = X(), e = Gt(), t = $e(), r = Et(), i = ee(), n = Mt();
  class o {
    constructor(u) {
      var c;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof u.schema == "object" && (f = u.schema), this.schema = u.schema, this.schemaId = u.schemaId, this.root = u.root || this, this.baseId = (c = u.baseId) !== null && c !== void 0 ? c : (0, r.normalizeId)(f?.[u.schemaId || "$id"]), this.schemaPath = u.schemaPath, this.localRefs = u.localRefs, this.meta = u.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  he.SchemaEnv = o;
  function a(h) {
    const u = p.call(this, h);
    if (u)
      return u;
    const c = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: y } = this.opts.code, { ownProperties: v } = this.opts, g = new s.CodeGen(this.scope, { es5: f, lines: y, ownProperties: v });
    let P;
    h.$async && (P = g.scopeValue("Error", {
      ref: e.default,
      code: (0, s._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const R = g.scopeName("validate");
    h.validateName = R;
    const O = {
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
      topSchemaRef: g.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, s.stringify)(h.schema) } : { ref: h.schema }),
      validateName: R,
      ValidationError: P,
      schema: h.schema,
      schemaEnv: h,
      rootId: c,
      baseId: h.baseId || c,
      schemaPath: s.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, s._)`""`,
      opts: this.opts,
      self: this
    };
    let D;
    try {
      this._compilations.add(h), (0, n.validateFunctionCode)(O), g.optimize(this.opts.code.optimize);
      const V = g.toString();
      D = `${g.scopeRefs(t.default.scope)}return ${V}`, this.opts.code.process && (D = this.opts.code.process(D, h));
      const U = new Function(`${t.default.self}`, `${t.default.scope}`, D)(this, this.scope.get());
      if (this.scope.value(R, { ref: U }), U.errors = null, U.schema = h.schema, U.schemaEnv = h, h.$async && (U.$async = !0), this.opts.code.source === !0 && (U.source = { validateName: R, validateCode: V, scopeValues: g._values }), this.opts.unevaluated) {
        const { props: Y, items: ne } = O;
        U.evaluated = {
          props: Y instanceof s.Name ? void 0 : Y,
          items: ne instanceof s.Name ? void 0 : ne,
          dynamicProps: Y instanceof s.Name,
          dynamicItems: ne instanceof s.Name
        }, U.source && (U.source.evaluated = (0, s.stringify)(U.evaluated));
      }
      return h.validate = U, h;
    } catch (V) {
      throw delete h.validate, delete h.validateName, D && this.logger.error("Error compiling schema, function code:", D), V;
    } finally {
      this._compilations.delete(h);
    }
  }
  he.compileSchema = a;
  function l(h, u, c) {
    var f;
    c = (0, r.resolveUrl)(this.opts.uriResolver, u, c);
    const y = h.refs[c];
    if (y)
      return y;
    let v = _.call(this, h, c);
    if (v === void 0) {
      const g = (f = h.localRefs) === null || f === void 0 ? void 0 : f[c], { schemaId: P } = this.opts;
      g && (v = new o({ schema: g, schemaId: P, root: h, baseId: u }));
    }
    if (v !== void 0)
      return h.refs[c] = d.call(this, v);
  }
  he.resolveRef = l;
  function d(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function p(h) {
    for (const u of this._compilations)
      if (w(u, h))
        return u;
  }
  he.getCompilingSchema = p;
  function w(h, u) {
    return h.schema === u.schema && h.root === u.root && h.baseId === u.baseId;
  }
  function _(h, u) {
    let c;
    for (; typeof (c = this.refs[u]) == "string"; )
      u = c;
    return c || this.schemas[u] || $.call(this, h, u);
  }
  function $(h, u) {
    const c = this.opts.uriResolver.parse(u), f = (0, r._getFullPath)(this.opts.uriResolver, c);
    let y = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === y)
      return b.call(this, c, h);
    const v = (0, r.normalizeId)(f), g = this.refs[v] || this.schemas[v];
    if (typeof g == "string") {
      const P = $.call(this, h, g);
      return typeof P?.schema != "object" ? void 0 : b.call(this, c, P);
    }
    if (typeof g?.schema == "object") {
      if (g.validate || a.call(this, g), v === (0, r.normalizeId)(u)) {
        const { schema: P } = g, { schemaId: R } = this.opts, O = P[R];
        return O && (y = (0, r.resolveUrl)(this.opts.uriResolver, y, O)), new o({ schema: P, schemaId: R, root: h, baseId: y });
      }
      return b.call(this, c, g);
    }
  }
  he.resolveSchema = $;
  const E = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function b(h, { baseId: u, schema: c, root: f }) {
    var y;
    if (((y = h.fragment) === null || y === void 0 ? void 0 : y[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof c == "boolean")
        return;
      const R = c[(0, i.unescapeFragment)(P)];
      if (R === void 0)
        return;
      c = R;
      const O = typeof c == "object" && c[this.opts.schemaId];
      !E.has(P) && O && (u = (0, r.resolveUrl)(this.opts.uriResolver, u, O));
    }
    let v;
    if (typeof c != "boolean" && c.$ref && !(0, i.schemaHasRulesButRef)(c, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, u, c.$ref);
      v = $.call(this, f, P);
    }
    const { schemaId: g } = this.opts;
    if (v = v || new o({ schema: c, schemaId: g, root: f, baseId: u }), v.schema !== v.root.schema)
      return v;
  }
  return he;
}
const xn = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Vn = "Meta-schema for $data reference (JSON AnySchema extension proposal)", zn = "object", Fn = ["$data"], Ln = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Un = !1, Gn = {
  $id: xn,
  description: Vn,
  type: zn,
  required: Fn,
  properties: Ln,
  additionalProperties: Un
};
var Le = {}, Oe = { exports: {} }, Dt, gr;
function Kn() {
  return gr || (gr = 1, Dt = {
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
  }), Dt;
}
var xt, vr;
function Hn() {
  if (vr) return xt;
  vr = 1;
  const { HEX: s } = Kn(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(b) {
    if (a(b, ".") < 3)
      return { host: b, isIPV4: !1 };
    const h = b.match(e) || [], [u] = h;
    return u ? { host: o(u, "."), isIPV4: !0 } : { host: b, isIPV4: !1 };
  }
  function r(b, h = !1) {
    let u = "", c = !0;
    for (const f of b) {
      if (s[f] === void 0) return;
      f !== "0" && c === !0 && (c = !1), c || (u += f);
    }
    return h && u.length === 0 && (u = "0"), u;
  }
  function i(b) {
    let h = 0;
    const u = { error: !1, address: "", zone: "" }, c = [], f = [];
    let y = !1, v = !1, g = !1;
    function P() {
      if (f.length) {
        if (y === !1) {
          const R = r(f);
          if (R !== void 0)
            c.push(R);
          else
            return u.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let R = 0; R < b.length; R++) {
      const O = b[R];
      if (!(O === "[" || O === "]"))
        if (O === ":") {
          if (v === !0 && (g = !0), !P())
            break;
          if (h++, c.push(":"), h > 7) {
            u.error = !0;
            break;
          }
          R - 1 >= 0 && b[R - 1] === ":" && (v = !0);
          continue;
        } else if (O === "%") {
          if (!P())
            break;
          y = !0;
        } else {
          f.push(O);
          continue;
        }
    }
    return f.length && (y ? u.zone = f.join("") : g ? c.push(f.join("")) : c.push(r(f))), u.address = c.join(""), u;
  }
  function n(b) {
    if (a(b, ":") < 2)
      return { host: b, isIPV6: !1 };
    const h = i(b);
    if (h.error)
      return { host: b, isIPV6: !1 };
    {
      let u = h.address, c = h.address;
      return h.zone && (u += "%" + h.zone, c += "%25" + h.zone), { host: u, escapedHost: c, isIPV6: !0 };
    }
  }
  function o(b, h) {
    let u = "", c = !0;
    const f = b.length;
    for (let y = 0; y < f; y++) {
      const v = b[y];
      v === "0" && c ? (y + 1 <= f && b[y + 1] === h || y + 1 === f) && (u += v, c = !1) : (v === h ? c = !0 : c = !1, u += v);
    }
    return u;
  }
  function a(b, h) {
    let u = 0;
    for (let c = 0; c < b.length; c++)
      b[c] === h && u++;
    return u;
  }
  const l = /^\.\.?\//u, d = /^\/\.(?:\/|$)/u, p = /^\/\.\.(?:\/|$)/u, w = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(b) {
    const h = [];
    for (; b.length; )
      if (b.match(l))
        b = b.replace(l, "");
      else if (b.match(d))
        b = b.replace(d, "/");
      else if (b.match(p))
        b = b.replace(p, "/"), h.pop();
      else if (b === "." || b === "..")
        b = "";
      else {
        const u = b.match(w);
        if (u) {
          const c = u[0];
          b = b.slice(c.length), h.push(c);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function $(b, h) {
    const u = h !== !0 ? escape : unescape;
    return b.scheme !== void 0 && (b.scheme = u(b.scheme)), b.userinfo !== void 0 && (b.userinfo = u(b.userinfo)), b.host !== void 0 && (b.host = u(b.host)), b.path !== void 0 && (b.path = u(b.path)), b.query !== void 0 && (b.query = u(b.query)), b.fragment !== void 0 && (b.fragment = u(b.fragment)), b;
  }
  function E(b) {
    const h = [];
    if (b.userinfo !== void 0 && (h.push(b.userinfo), h.push("@")), b.host !== void 0) {
      let u = unescape(b.host);
      const c = t(u);
      if (c.isIPV4)
        u = c.host;
      else {
        const f = n(c.host);
        f.isIPV6 === !0 ? u = `[${f.escapedHost}]` : u = b.host;
      }
      h.push(u);
    }
    return (typeof b.port == "number" || typeof b.port == "string") && (h.push(":"), h.push(String(b.port))), h.length ? h.join("") : void 0;
  }
  return xt = {
    recomposeAuthority: E,
    normalizeComponentEncoding: $,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: n,
    stringArrayToHexStripped: r
  }, xt;
}
var Vt, br;
function Bn() {
  if (br) return Vt;
  br = 1;
  const s = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function t(c) {
    return typeof c.secure == "boolean" ? c.secure : String(c.scheme).toLowerCase() === "wss";
  }
  function r(c) {
    return c.host || (c.error = c.error || "HTTP URIs must have a host."), c;
  }
  function i(c) {
    const f = String(c.scheme).toLowerCase() === "https";
    return (c.port === (f ? 443 : 80) || c.port === "") && (c.port = void 0), c.path || (c.path = "/"), c;
  }
  function n(c) {
    return c.secure = t(c), c.resourceName = (c.path || "/") + (c.query ? "?" + c.query : ""), c.path = void 0, c.query = void 0, c;
  }
  function o(c) {
    if ((c.port === (t(c) ? 443 : 80) || c.port === "") && (c.port = void 0), typeof c.secure == "boolean" && (c.scheme = c.secure ? "wss" : "ws", c.secure = void 0), c.resourceName) {
      const [f, y] = c.resourceName.split("?");
      c.path = f && f !== "/" ? f : void 0, c.query = y, c.resourceName = void 0;
    }
    return c.fragment = void 0, c;
  }
  function a(c, f) {
    if (!c.path)
      return c.error = "URN can not be parsed", c;
    const y = c.path.match(e);
    if (y) {
      const v = f.scheme || c.scheme || "urn";
      c.nid = y[1].toLowerCase(), c.nss = y[2];
      const g = `${v}:${f.nid || c.nid}`, P = u[g];
      c.path = void 0, P && (c = P.parse(c, f));
    } else
      c.error = c.error || "URN can not be parsed.";
    return c;
  }
  function l(c, f) {
    const y = f.scheme || c.scheme || "urn", v = c.nid.toLowerCase(), g = `${y}:${f.nid || v}`, P = u[g];
    P && (c = P.serialize(c, f));
    const R = c, O = c.nss;
    return R.path = `${v || f.nid}:${O}`, f.skipEscape = !0, R;
  }
  function d(c, f) {
    const y = c;
    return y.uuid = y.nss, y.nss = void 0, !f.tolerant && (!y.uuid || !s.test(y.uuid)) && (y.error = y.error || "UUID is not valid."), y;
  }
  function p(c) {
    const f = c;
    return f.nss = (c.uuid || "").toLowerCase(), f;
  }
  const w = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: i
  }, _ = {
    scheme: "https",
    domainHost: w.domainHost,
    parse: r,
    serialize: i
  }, $ = {
    scheme: "ws",
    domainHost: !0,
    parse: n,
    serialize: o
  }, E = {
    scheme: "wss",
    domainHost: $.domainHost,
    parse: $.parse,
    serialize: $.serialize
  }, u = {
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
      parse: d,
      serialize: p,
      skipNormalize: !0
    }
  };
  return Vt = u, Vt;
}
var wr;
function Wn() {
  if (wr) return Oe.exports;
  wr = 1;
  const { normalizeIPv6: s, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: i } = Hn(), n = Bn();
  function o(h, u) {
    return typeof h == "string" ? h = p(E(h, u), u) : typeof h == "object" && (h = E(p(h, u), u)), h;
  }
  function a(h, u, c) {
    const f = Object.assign({ scheme: "null" }, c), y = l(E(h, f), E(u, f), f, !0);
    return p(y, { ...f, skipEscape: !0 });
  }
  function l(h, u, c, f) {
    const y = {};
    return f || (h = E(p(h, c), c), u = E(p(u, c), c)), c = c || {}, !c.tolerant && u.scheme ? (y.scheme = u.scheme, y.userinfo = u.userinfo, y.host = u.host, y.port = u.port, y.path = t(u.path || ""), y.query = u.query) : (u.userinfo !== void 0 || u.host !== void 0 || u.port !== void 0 ? (y.userinfo = u.userinfo, y.host = u.host, y.port = u.port, y.path = t(u.path || ""), y.query = u.query) : (u.path ? (u.path.charAt(0) === "/" ? y.path = t(u.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? y.path = "/" + u.path : h.path ? y.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + u.path : y.path = u.path, y.path = t(y.path)), y.query = u.query) : (y.path = h.path, u.query !== void 0 ? y.query = u.query : y.query = h.query), y.userinfo = h.userinfo, y.host = h.host, y.port = h.port), y.scheme = h.scheme), y.fragment = u.fragment, y;
  }
  function d(h, u, c) {
    return typeof h == "string" ? (h = unescape(h), h = p(i(E(h, c), !0), { ...c, skipEscape: !0 })) : typeof h == "object" && (h = p(i(h, !0), { ...c, skipEscape: !0 })), typeof u == "string" ? (u = unescape(u), u = p(i(E(u, c), !0), { ...c, skipEscape: !0 })) : typeof u == "object" && (u = p(i(u, !0), { ...c, skipEscape: !0 })), h.toLowerCase() === u.toLowerCase();
  }
  function p(h, u) {
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
    }, f = Object.assign({}, u), y = [], v = n[(f.scheme || c.scheme || "").toLowerCase()];
    v && v.serialize && v.serialize(c, f), c.path !== void 0 && (f.skipEscape ? c.path = unescape(c.path) : (c.path = escape(c.path), c.scheme !== void 0 && (c.path = c.path.split("%3A").join(":")))), f.reference !== "suffix" && c.scheme && y.push(c.scheme, ":");
    const g = r(c);
    if (g !== void 0 && (f.reference !== "suffix" && y.push("//"), y.push(g), c.path && c.path.charAt(0) !== "/" && y.push("/")), c.path !== void 0) {
      let P = c.path;
      !f.absolutePath && (!v || !v.absolutePath) && (P = t(P)), g === void 0 && (P = P.replace(/^\/\//u, "/%2F")), y.push(P);
    }
    return c.query !== void 0 && y.push("?", c.query), c.fragment !== void 0 && y.push("#", c.fragment), y.join("");
  }
  const w = Array.from({ length: 127 }, (h, u) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(u)));
  function _(h) {
    let u = 0;
    for (let c = 0, f = h.length; c < f; ++c)
      if (u = h.charCodeAt(c), u > 126 || w[u])
        return !0;
    return !1;
  }
  const $ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function E(h, u) {
    const c = Object.assign({}, u), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, y = h.indexOf("%") !== -1;
    let v = !1;
    c.reference === "suffix" && (h = (c.scheme ? c.scheme + ":" : "") + "//" + h);
    const g = h.match($);
    if (g) {
      if (f.scheme = g[1], f.userinfo = g[3], f.host = g[4], f.port = parseInt(g[5], 10), f.path = g[6] || "", f.query = g[7], f.fragment = g[8], isNaN(f.port) && (f.port = g[5]), f.host) {
        const R = e(f.host);
        if (R.isIPV4 === !1) {
          const O = s(R.host);
          f.host = O.host.toLowerCase(), v = O.isIPV6;
        } else
          f.host = R.host, v = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", c.reference && c.reference !== "suffix" && c.reference !== f.reference && (f.error = f.error || "URI is not a " + c.reference + " reference.");
      const P = n[(c.scheme || f.scheme || "").toLowerCase()];
      if (!c.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (c.domainHost || P && P.domainHost) && v === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (R) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + R;
        }
      (!P || P && !P.skipNormalize) && (y && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), y && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, c);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const b = {
    SCHEMES: n,
    normalize: o,
    resolve: a,
    resolveComponents: l,
    equal: d,
    serialize: p,
    parse: E
  };
  return Oe.exports = b, Oe.exports.default = b, Oe.exports.fastUri = b, Oe.exports;
}
var _r;
function Jn() {
  if (_r) return Le;
  _r = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const s = Wn();
  return s.code = 'require("ajv/dist/runtime/uri").default', Le.default = s, Le;
}
var $r;
function Yn() {
  return $r || ($r = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.CodeGen = s.Name = s.nil = s.stringify = s.str = s._ = s.KeywordCxt = void 0;
    var e = Mt();
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
    const r = Gt(), i = kt(), n = dn(), o = Kt(), a = X(), l = Et(), d = Pt(), p = ee(), w = Gn, _ = Jn(), $ = (q, T) => new RegExp(q, T);
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
    }, u = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, c = 200;
    function f(q) {
      var T, I, N, m, S, A, z, F, J, B, M, k, j, C, L, K, ie, re, G, Q, Z, oe, ue, Te, Ae;
      const Pe = q.strict, be = (T = q.code) === null || T === void 0 ? void 0 : T.optimize, je = be === !0 || be === void 0 ? 1 : be || 0, Se = (N = (I = q.code) === null || I === void 0 ? void 0 : I.regExp) !== null && N !== void 0 ? N : $, Rt = (m = q.uriResolver) !== null && m !== void 0 ? m : _.default;
      return {
        strictSchema: (A = (S = q.strictSchema) !== null && S !== void 0 ? S : Pe) !== null && A !== void 0 ? A : !0,
        strictNumbers: (F = (z = q.strictNumbers) !== null && z !== void 0 ? z : Pe) !== null && F !== void 0 ? F : !0,
        strictTypes: (B = (J = q.strictTypes) !== null && J !== void 0 ? J : Pe) !== null && B !== void 0 ? B : "log",
        strictTuples: (k = (M = q.strictTuples) !== null && M !== void 0 ? M : Pe) !== null && k !== void 0 ? k : "log",
        strictRequired: (C = (j = q.strictRequired) !== null && j !== void 0 ? j : Pe) !== null && C !== void 0 ? C : !1,
        code: q.code ? { ...q.code, optimize: je, regExp: Se } : { optimize: je, regExp: Se },
        loopRequired: (L = q.loopRequired) !== null && L !== void 0 ? L : c,
        loopEnum: (K = q.loopEnum) !== null && K !== void 0 ? K : c,
        meta: (ie = q.meta) !== null && ie !== void 0 ? ie : !0,
        messages: (re = q.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (G = q.inlineRefs) !== null && G !== void 0 ? G : !0,
        schemaId: (Q = q.schemaId) !== null && Q !== void 0 ? Q : "$id",
        addUsedSchema: (Z = q.addUsedSchema) !== null && Z !== void 0 ? Z : !0,
        validateSchema: (oe = q.validateSchema) !== null && oe !== void 0 ? oe : !0,
        validateFormats: (ue = q.validateFormats) !== null && ue !== void 0 ? ue : !0,
        unicodeRegExp: (Te = q.unicodeRegExp) !== null && Te !== void 0 ? Te : !0,
        int32range: (Ae = q.int32range) !== null && Ae !== void 0 ? Ae : !0,
        uriResolver: Rt
      };
    }
    class y {
      constructor(T = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...f(T) };
        const { es5: I, lines: N } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: b, es5: I, lines: N }), this.logger = H(T.logger);
        const m = T.validateFormats;
        T.validateFormats = !1, this.RULES = (0, n.getRules)(), v.call(this, h, T, "NOT SUPPORTED"), v.call(this, u, T, "DEPRECATED", "warn"), this._metaOpts = D.call(this), T.formats && R.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && O.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), P.call(this), T.validateFormats = m;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: T, meta: I, schemaId: N } = this.opts;
        let m = w;
        N === "id" && (m = { ...w }, m.id = m.$id, delete m.$id), I && T && this.addMetaSchema(m, m[N], !1);
      }
      defaultMeta() {
        const { meta: T, schemaId: I } = this.opts;
        return this.opts.defaultMeta = typeof T == "object" ? T[I] || T : void 0;
      }
      validate(T, I) {
        let N;
        if (typeof T == "string") {
          if (N = this.getSchema(T), !N)
            throw new Error(`no schema with key or ref "${T}"`);
        } else
          N = this.compile(T);
        const m = N(I);
        return "$async" in N || (this.errors = N.errors), m;
      }
      compile(T, I) {
        const N = this._addSchema(T, I);
        return N.validate || this._compileSchemaEnv(N);
      }
      compileAsync(T, I) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: N } = this.opts;
        return m.call(this, T, I);
        async function m(B, M) {
          await S.call(this, B.$schema);
          const k = this._addSchema(B, M);
          return k.validate || A.call(this, k);
        }
        async function S(B) {
          B && !this.getSchema(B) && await m.call(this, { $ref: B }, !0);
        }
        async function A(B) {
          try {
            return this._compileSchemaEnv(B);
          } catch (M) {
            if (!(M instanceof i.default))
              throw M;
            return z.call(this, M), await F.call(this, M.missingSchema), A.call(this, B);
          }
        }
        function z({ missingSchema: B, missingRef: M }) {
          if (this.refs[B])
            throw new Error(`AnySchema ${B} is loaded but ${M} cannot be resolved`);
        }
        async function F(B) {
          const M = await J.call(this, B);
          this.refs[B] || await S.call(this, M.$schema), this.refs[B] || this.addSchema(M, B, I);
        }
        async function J(B) {
          const M = this._loading[B];
          if (M)
            return M;
          try {
            return await (this._loading[B] = N(B));
          } finally {
            delete this._loading[B];
          }
        }
      }
      // Adds schema to the instance
      addSchema(T, I, N, m = this.opts.validateSchema) {
        if (Array.isArray(T)) {
          for (const A of T)
            this.addSchema(A, void 0, N, m);
          return this;
        }
        let S;
        if (typeof T == "object") {
          const { schemaId: A } = this.opts;
          if (S = T[A], S !== void 0 && typeof S != "string")
            throw new Error(`schema ${A} must be string`);
        }
        return I = (0, l.normalizeId)(I || S), this._checkUnique(I), this.schemas[I] = this._addSchema(T, N, I, m, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(T, I, N = this.opts.validateSchema) {
        return this.addSchema(T, I, !0, N), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(T, I) {
        if (typeof T == "boolean")
          return !0;
        let N;
        if (N = T.$schema, N !== void 0 && typeof N != "string")
          throw new Error("$schema must be a string");
        if (N = N || this.opts.defaultMeta || this.defaultMeta(), !N)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const m = this.validate(N, T);
        if (!m && I) {
          const S = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(S);
          else
            throw new Error(S);
        }
        return m;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(T) {
        let I;
        for (; typeof (I = g.call(this, T)) == "string"; )
          T = I;
        if (I === void 0) {
          const { schemaId: N } = this.opts, m = new o.SchemaEnv({ schema: {}, schemaId: N });
          if (I = o.resolveSchema.call(this, m, T), !I)
            return;
          this.refs[T] = I;
        }
        return I.validate || this._compileSchemaEnv(I);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(T) {
        if (T instanceof RegExp)
          return this._removeAllSchemas(this.schemas, T), this._removeAllSchemas(this.refs, T), this;
        switch (typeof T) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const I = g.call(this, T);
            return typeof I == "object" && this._cache.delete(I.schema), delete this.schemas[T], delete this.refs[T], this;
          }
          case "object": {
            const I = T;
            this._cache.delete(I);
            let N = T[this.opts.schemaId];
            return N && (N = (0, l.normalizeId)(N), delete this.schemas[N], delete this.refs[N]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(T) {
        for (const I of T)
          this.addKeyword(I);
        return this;
      }
      addKeyword(T, I) {
        let N;
        if (typeof T == "string")
          N = T, typeof I == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), I.keyword = N);
        else if (typeof T == "object" && I === void 0) {
          if (I = T, N = I.keyword, Array.isArray(N) && !N.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (Y.call(this, N, I), !I)
          return (0, p.eachItem)(N, (S) => ne.call(this, S)), this;
        fe.call(this, I);
        const m = {
          ...I,
          type: (0, d.getJSONTypes)(I.type),
          schemaType: (0, d.getJSONTypes)(I.schemaType)
        };
        return (0, p.eachItem)(N, m.type.length === 0 ? (S) => ne.call(this, S, m) : (S) => m.type.forEach((A) => ne.call(this, S, m, A))), this;
      }
      getKeyword(T) {
        const I = this.RULES.all[T];
        return typeof I == "object" ? I.definition : !!I;
      }
      // Remove keyword
      removeKeyword(T) {
        const { RULES: I } = this;
        delete I.keywords[T], delete I.all[T];
        for (const N of I.rules) {
          const m = N.rules.findIndex((S) => S.keyword === T);
          m >= 0 && N.rules.splice(m, 1);
        }
        return this;
      }
      // Add format
      addFormat(T, I) {
        return typeof I == "string" && (I = new RegExp(I)), this.formats[T] = I, this;
      }
      errorsText(T = this.errors, { separator: I = ", ", dataVar: N = "data" } = {}) {
        return !T || T.length === 0 ? "No errors" : T.map((m) => `${N}${m.instancePath} ${m.message}`).reduce((m, S) => m + I + S);
      }
      $dataMetaSchema(T, I) {
        const N = this.RULES.all;
        T = JSON.parse(JSON.stringify(T));
        for (const m of I) {
          const S = m.split("/").slice(1);
          let A = T;
          for (const z of S)
            A = A[z];
          for (const z in N) {
            const F = N[z];
            if (typeof F != "object")
              continue;
            const { $data: J } = F.definition, B = A[z];
            J && B && (A[z] = ce(B));
          }
        }
        return T;
      }
      _removeAllSchemas(T, I) {
        for (const N in T) {
          const m = T[N];
          (!I || I.test(N)) && (typeof m == "string" ? delete T[N] : m && !m.meta && (this._cache.delete(m.schema), delete T[N]));
        }
      }
      _addSchema(T, I, N, m = this.opts.validateSchema, S = this.opts.addUsedSchema) {
        let A;
        const { schemaId: z } = this.opts;
        if (typeof T == "object")
          A = T[z];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof T != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let F = this._cache.get(T);
        if (F !== void 0)
          return F;
        N = (0, l.normalizeId)(A || N);
        const J = l.getSchemaRefs.call(this, T, N);
        return F = new o.SchemaEnv({ schema: T, schemaId: z, meta: I, baseId: N, localRefs: J }), this._cache.set(F.schema, F), S && !N.startsWith("#") && (N && this._checkUnique(N), this.refs[N] = F), m && this.validateSchema(T, !0), F;
      }
      _checkUnique(T) {
        if (this.schemas[T] || this.refs[T])
          throw new Error(`schema with key or id "${T}" already exists`);
      }
      _compileSchemaEnv(T) {
        if (T.meta ? this._compileMetaSchema(T) : o.compileSchema.call(this, T), !T.validate)
          throw new Error("ajv implementation error");
        return T.validate;
      }
      _compileMetaSchema(T) {
        const I = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, T);
        } finally {
          this.opts = I;
        }
      }
    }
    y.ValidationError = r.default, y.MissingRefError = i.default, s.default = y;
    function v(q, T, I, N = "error") {
      for (const m in q) {
        const S = m;
        S in T && this.logger[N](`${I}: option ${m}. ${q[S]}`);
      }
    }
    function g(q) {
      return q = (0, l.normalizeId)(q), this.schemas[q] || this.refs[q];
    }
    function P() {
      const q = this.opts.schemas;
      if (q)
        if (Array.isArray(q))
          this.addSchema(q);
        else
          for (const T in q)
            this.addSchema(q[T], T);
    }
    function R() {
      for (const q in this.opts.formats) {
        const T = this.opts.formats[q];
        T && this.addFormat(q, T);
      }
    }
    function O(q) {
      if (Array.isArray(q)) {
        this.addVocabulary(q);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const T in q) {
        const I = q[T];
        I.keyword || (I.keyword = T), this.addKeyword(I);
      }
    }
    function D() {
      const q = { ...this.opts };
      for (const T of E)
        delete q[T];
      return q;
    }
    const V = { log() {
    }, warn() {
    }, error() {
    } };
    function H(q) {
      if (q === !1)
        return V;
      if (q === void 0)
        return console;
      if (q.log && q.warn && q.error)
        return q;
      throw new Error("logger must implement log, warn and error methods");
    }
    const U = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Y(q, T) {
      const { RULES: I } = this;
      if ((0, p.eachItem)(q, (N) => {
        if (I.keywords[N])
          throw new Error(`Keyword ${N} is already defined`);
        if (!U.test(N))
          throw new Error(`Keyword ${N} has invalid name`);
      }), !!T && T.$data && !("code" in T || "validate" in T))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ne(q, T, I) {
      var N;
      const m = T?.post;
      if (I && m)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: S } = this;
      let A = m ? S.post : S.rules.find(({ type: F }) => F === I);
      if (A || (A = { type: I, rules: [] }, S.rules.push(A)), S.keywords[q] = !0, !T)
        return;
      const z = {
        keyword: q,
        definition: {
          ...T,
          type: (0, d.getJSONTypes)(T.type),
          schemaType: (0, d.getJSONTypes)(T.schemaType)
        }
      };
      T.before ? le.call(this, A, z, T.before) : A.rules.push(z), S.all[q] = z, (N = T.implements) === null || N === void 0 || N.forEach((F) => this.addKeyword(F));
    }
    function le(q, T, I) {
      const N = q.rules.findIndex((m) => m.keyword === I);
      N >= 0 ? q.rules.splice(N, 0, T) : (q.rules.push(T), this.logger.warn(`rule ${I} is not defined`));
    }
    function fe(q) {
      let { metaSchema: T } = q;
      T !== void 0 && (q.$data && this.opts.$data && (T = ce(T)), q.validateSchema = this.compile(T, !0));
    }
    const x = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ce(q) {
      return { anyOf: [q, x] };
    }
  })(Nt)), Nt;
}
var Ue = {}, Ge = {}, Ke = {}, Pr;
function Xn() {
  if (Pr) return Ke;
  Pr = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const s = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Ke.default = s, Ke;
}
var we = {}, Sr;
function Qn() {
  if (Sr) return we;
  Sr = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.callRef = we.getValidate = void 0;
  const s = kt(), e = me(), t = X(), r = $e(), i = Kt(), n = ee(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(d) {
      const { gen: p, schema: w, it: _ } = d, { baseId: $, schemaEnv: E, validateName: b, opts: h, self: u } = _, { root: c } = E;
      if ((w === "#" || w === "#/") && $ === c.baseId)
        return y();
      const f = i.resolveRef.call(u, c, $, w);
      if (f === void 0)
        throw new s.default(_.opts.uriResolver, $, w);
      if (f instanceof i.SchemaEnv)
        return v(f);
      return g(f);
      function y() {
        if (E === c)
          return l(d, b, E, E.$async);
        const P = p.scopeValue("root", { ref: c });
        return l(d, (0, t._)`${P}.validate`, c, c.$async);
      }
      function v(P) {
        const R = a(d, P);
        l(d, R, P, P.$async);
      }
      function g(P) {
        const R = p.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), O = p.name("valid"), D = d.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: R,
          errSchemaPath: w
        }, O);
        d.mergeEvaluated(D), d.ok(O);
      }
    }
  };
  function a(d, p) {
    const { gen: w } = d;
    return p.validate ? w.scopeValue("validate", { ref: p.validate }) : (0, t._)`${w.scopeValue("wrapper", { ref: p })}.validate`;
  }
  we.getValidate = a;
  function l(d, p, w, _) {
    const { gen: $, it: E } = d, { allErrors: b, schemaEnv: h, opts: u } = E, c = u.passContext ? r.default.this : t.nil;
    _ ? f() : y();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = $.let("valid");
      $.try(() => {
        $.code((0, t._)`await ${(0, e.callValidateCode)(d, p, c)}`), g(p), b || $.assign(P, !0);
      }, (R) => {
        $.if((0, t._)`!(${R} instanceof ${E.ValidationError})`, () => $.throw(R)), v(R), b || $.assign(P, !1);
      }), d.ok(P);
    }
    function y() {
      d.result((0, e.callValidateCode)(d, p, c), () => g(p), () => v(p));
    }
    function v(P) {
      const R = (0, t._)`${P}.errors`;
      $.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${R} : ${r.default.vErrors}.concat(${R})`), $.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function g(P) {
      var R;
      if (!E.opts.unevaluated)
        return;
      const O = (R = w?.validate) === null || R === void 0 ? void 0 : R.evaluated;
      if (E.props !== !0)
        if (O && !O.dynamicProps)
          O.props !== void 0 && (E.props = n.mergeEvaluated.props($, O.props, E.props));
        else {
          const D = $.var("props", (0, t._)`${P}.evaluated.props`);
          E.props = n.mergeEvaluated.props($, D, E.props, t.Name);
        }
      if (E.items !== !0)
        if (O && !O.dynamicItems)
          O.items !== void 0 && (E.items = n.mergeEvaluated.items($, O.items, E.items));
        else {
          const D = $.var("items", (0, t._)`${P}.evaluated.items`);
          E.items = n.mergeEvaluated.items($, D, E.items, t.Name);
        }
    }
  }
  return we.callRef = l, we.default = o, we;
}
var Er;
function Zn() {
  if (Er) return Ge;
  Er = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const s = Xn(), e = Qn(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    s.default,
    e.default
  ];
  return Ge.default = t, Ge;
}
var He = {}, Be = {}, Mr;
function ei() {
  if (Mr) return Be;
  Mr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const s = X(), e = s.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, r = {
    message: ({ keyword: n, schemaCode: o }) => (0, s.str)`must be ${t[n].okStr} ${o}`,
    params: ({ keyword: n, schemaCode: o }) => (0, s._)`{comparison: ${t[n].okStr}, limit: ${o}}`
  }, i = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(n) {
      const { keyword: o, data: a, schemaCode: l } = n;
      n.fail$data((0, s._)`${a} ${t[o].fail} ${l} || isNaN(${a})`);
    }
  };
  return Be.default = i, Be;
}
var We = {}, kr;
function ti() {
  if (kr) return We;
  kr = 1, Object.defineProperty(We, "__esModule", { value: !0 });
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
      const { gen: i, data: n, schemaCode: o, it: a } = r, l = a.opts.multipleOfPrecision, d = i.let("res"), p = l ? (0, s._)`Math.abs(Math.round(${d}) - ${d}) > 1e-${l}` : (0, s._)`${d} !== parseInt(${d})`;
      r.fail$data((0, s._)`(${o} === 0 || (${d} = ${n}/${o}, ${p}))`);
    }
  };
  return We.default = t, We;
}
var Je = {}, Ye = {}, Tr;
function ri() {
  if (Tr) return Ye;
  Tr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  function s(e) {
    const t = e.length;
    let r = 0, i = 0, n;
    for (; i < t; )
      r++, n = e.charCodeAt(i++), n >= 55296 && n <= 56319 && i < t && (n = e.charCodeAt(i), (n & 64512) === 56320 && i++);
    return r;
  }
  return Ye.default = s, s.code = 'require("ajv/dist/runtime/ucs2length").default', Ye;
}
var Rr;
function ni() {
  if (Rr) return Je;
  Rr = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = ri(), i = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: o }) {
        const a = n === "maxLength" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${a} than ${o} characters`;
      },
      params: ({ schemaCode: n }) => (0, s._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: o, data: a, schemaCode: l, it: d } = n, p = o === "maxLength" ? s.operators.GT : s.operators.LT, w = d.opts.unicode === !1 ? (0, s._)`${a}.length` : (0, s._)`${(0, e.useFunc)(n.gen, t.default)}(${a})`;
      n.fail$data((0, s._)`${w} ${p} ${l}`);
    }
  };
  return Je.default = i, Je;
}
var Xe = {}, Nr;
function ii() {
  if (Nr) return Xe;
  Nr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const s = me(), e = X(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: i }) => (0, e.str)`must match pattern "${i}"`,
      params: ({ schemaCode: i }) => (0, e._)`{pattern: ${i}}`
    },
    code(i) {
      const { data: n, $data: o, schema: a, schemaCode: l, it: d } = i, p = d.opts.unicodeRegExp ? "u" : "", w = o ? (0, e._)`(new RegExp(${l}, ${p}))` : (0, s.usePattern)(i, a);
      i.fail$data((0, e._)`!${w}.test(${n})`);
    }
  };
  return Xe.default = r, Xe;
}
var Qe = {}, Ar;
function si() {
  if (Ar) return Qe;
  Ar = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const s = X(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: i }) {
        const n = r === "maxProperties" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${n} than ${i} properties`;
      },
      params: ({ schemaCode: r }) => (0, s._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: i, data: n, schemaCode: o } = r, a = i === "maxProperties" ? s.operators.GT : s.operators.LT;
      r.fail$data((0, s._)`Object.keys(${n}).length ${a} ${o}`);
    }
  };
  return Qe.default = t, Qe;
}
var Ze = {}, jr;
function oi() {
  if (jr) return Ze;
  jr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const s = me(), e = X(), t = ee(), i = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: n } }) => (0, e.str)`must have required property '${n}'`,
      params: ({ params: { missingProperty: n } }) => (0, e._)`{missingProperty: ${n}}`
    },
    code(n) {
      const { gen: o, schema: a, schemaCode: l, data: d, $data: p, it: w } = n, { opts: _ } = w;
      if (!p && a.length === 0)
        return;
      const $ = a.length >= _.loopRequired;
      if (w.allErrors ? E() : b(), _.strictRequired) {
        const c = n.parentSchema.properties, { definedProperties: f } = n.it;
        for (const y of a)
          if (c?.[y] === void 0 && !f.has(y)) {
            const v = w.schemaEnv.baseId + w.errSchemaPath, g = `required property "${y}" is not defined at "${v}" (strictRequired)`;
            (0, t.checkStrictMode)(w, g, w.opts.strictRequired);
          }
      }
      function E() {
        if ($ || p)
          n.block$data(e.nil, h);
        else
          for (const c of a)
            (0, s.checkReportMissingProp)(n, c);
      }
      function b() {
        const c = o.let("missing");
        if ($ || p) {
          const f = o.let("valid", !0);
          n.block$data(f, () => u(c, f)), n.ok(f);
        } else
          o.if((0, s.checkMissingProp)(n, a, c)), (0, s.reportMissingProp)(n, c), o.else();
      }
      function h() {
        o.forOf("prop", l, (c) => {
          n.setParams({ missingProperty: c }), o.if((0, s.noPropertyInData)(o, d, c, _.ownProperties), () => n.error());
        });
      }
      function u(c, f) {
        n.setParams({ missingProperty: c }), o.forOf(c, l, () => {
          o.assign(f, (0, s.propertyInData)(o, d, c, _.ownProperties)), o.if((0, e.not)(f), () => {
            n.error(), o.break();
          });
        }, e.nil);
      }
    }
  };
  return Ze.default = i, Ze;
}
var et = {}, Ir;
function ai() {
  if (Ir) return et;
  Ir = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const s = X(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: i }) {
        const n = r === "maxItems" ? "more" : "fewer";
        return (0, s.str)`must NOT have ${n} than ${i} items`;
      },
      params: ({ schemaCode: r }) => (0, s._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: i, data: n, schemaCode: o } = r, a = i === "maxItems" ? s.operators.GT : s.operators.LT;
      r.fail$data((0, s._)`${n}.length ${a} ${o}`);
    }
  };
  return et.default = t, et;
}
var tt = {}, rt = {}, Or;
function Ht() {
  if (Or) return rt;
  Or = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const s = hn();
  return s.code = 'require("ajv/dist/runtime/equal").default', rt.default = s, rt;
}
var qr;
function ci() {
  if (qr) return tt;
  qr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const s = Pt(), e = X(), t = ee(), r = Ht(), n = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: o, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${o} are identical)`,
      params: ({ params: { i: o, j: a } }) => (0, e._)`{i: ${o}, j: ${a}}`
    },
    code(o) {
      const { gen: a, data: l, $data: d, schema: p, parentSchema: w, schemaCode: _, it: $ } = o;
      if (!d && !p)
        return;
      const E = a.let("valid"), b = w.items ? (0, s.getSchemaTypes)(w.items) : [];
      o.block$data(E, h, (0, e._)`${_} === false`), o.ok(E);
      function h() {
        const y = a.let("i", (0, e._)`${l}.length`), v = a.let("j");
        o.setParams({ i: y, j: v }), a.assign(E, !0), a.if((0, e._)`${y} > 1`, () => (u() ? c : f)(y, v));
      }
      function u() {
        return b.length > 0 && !b.some((y) => y === "object" || y === "array");
      }
      function c(y, v) {
        const g = a.name("item"), P = (0, s.checkDataTypes)(b, g, $.opts.strictNumbers, s.DataType.Wrong), R = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${y}--;`, () => {
          a.let(g, (0, e._)`${l}[${y}]`), a.if(P, (0, e._)`continue`), b.length > 1 && a.if((0, e._)`typeof ${g} == "string"`, (0, e._)`${g} += "_"`), a.if((0, e._)`typeof ${R}[${g}] == "number"`, () => {
            a.assign(v, (0, e._)`${R}[${g}]`), o.error(), a.assign(E, !1).break();
          }).code((0, e._)`${R}[${g}] = ${y}`);
        });
      }
      function f(y, v) {
        const g = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${y}--;`, () => a.for((0, e._)`${v} = ${y}; ${v}--;`, () => a.if((0, e._)`${g}(${l}[${y}], ${l}[${v}])`, () => {
          o.error(), a.assign(E, !1).break(P);
        })));
      }
    }
  };
  return tt.default = n, tt;
}
var nt = {}, Cr;
function li() {
  if (Cr) return nt;
  Cr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = Ht(), i = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: n }) => (0, s._)`{allowedValue: ${n}}`
    },
    code(n) {
      const { gen: o, data: a, $data: l, schemaCode: d, schema: p } = n;
      l || p && typeof p == "object" ? n.fail$data((0, s._)`!${(0, e.useFunc)(o, t.default)}(${a}, ${d})`) : n.fail((0, s._)`${p} !== ${a}`);
    }
  };
  return nt.default = i, nt;
}
var it = {}, Dr;
function ui() {
  if (Dr) return it;
  Dr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = Ht(), i = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: n }) => (0, s._)`{allowedValues: ${n}}`
    },
    code(n) {
      const { gen: o, data: a, $data: l, schema: d, schemaCode: p, it: w } = n;
      if (!l && d.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = d.length >= w.opts.loopEnum;
      let $;
      const E = () => $ ?? ($ = (0, e.useFunc)(o, t.default));
      let b;
      if (_ || l)
        b = o.let("valid"), n.block$data(b, h);
      else {
        if (!Array.isArray(d))
          throw new Error("ajv implementation error");
        const c = o.const("vSchema", p);
        b = (0, s.or)(...d.map((f, y) => u(c, y)));
      }
      n.pass(b);
      function h() {
        o.assign(b, !1), o.forOf("v", p, (c) => o.if((0, s._)`${E()}(${a}, ${c})`, () => o.assign(b, !0).break()));
      }
      function u(c, f) {
        const y = d[f];
        return typeof y == "object" && y !== null ? (0, s._)`${E()}(${a}, ${c}[${f}])` : (0, s._)`${a} === ${y}`;
      }
    }
  };
  return it.default = i, it;
}
var xr;
function di() {
  if (xr) return He;
  xr = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const s = ei(), e = ti(), t = ni(), r = ii(), i = si(), n = oi(), o = ai(), a = ci(), l = li(), d = ui(), p = [
    // number
    s.default,
    e.default,
    // string
    t.default,
    r.default,
    // object
    i.default,
    n.default,
    // array
    o.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    l.default,
    d.default
  ];
  return He.default = p, He;
}
var st = {}, Re = {}, Vr;
function pn() {
  if (Vr) return Re;
  Vr = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.validateAdditionalItems = void 0;
  const s = X(), e = ee(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: n } }) => (0, s.str)`must NOT have more than ${n} items`,
      params: ({ params: { len: n } }) => (0, s._)`{limit: ${n}}`
    },
    code(n) {
      const { parentSchema: o, it: a } = n, { items: l } = o;
      if (!Array.isArray(l)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      i(n, l);
    }
  };
  function i(n, o) {
    const { gen: a, schema: l, data: d, keyword: p, it: w } = n;
    w.items = !0;
    const _ = a.const("len", (0, s._)`${d}.length`);
    if (l === !1)
      n.setParams({ len: o.length }), n.pass((0, s._)`${_} <= ${o.length}`);
    else if (typeof l == "object" && !(0, e.alwaysValidSchema)(w, l)) {
      const E = a.var("valid", (0, s._)`${_} <= ${o.length}`);
      a.if((0, s.not)(E), () => $(E)), n.ok(E);
    }
    function $(E) {
      a.forRange("i", o.length, _, (b) => {
        n.subschema({ keyword: p, dataProp: b, dataPropType: e.Type.Num }, E), w.allErrors || a.if((0, s.not)(E), () => a.break());
      });
    }
  }
  return Re.validateAdditionalItems = i, Re.default = r, Re;
}
var ot = {}, Ne = {}, zr;
function mn() {
  if (zr) return Ne;
  zr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.validateTuple = void 0;
  const s = X(), e = ee(), t = me(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(n) {
      const { schema: o, it: a } = n;
      if (Array.isArray(o))
        return i(n, "additionalItems", o);
      a.items = !0, !(0, e.alwaysValidSchema)(a, o) && n.ok((0, t.validateArray)(n));
    }
  };
  function i(n, o, a = n.schema) {
    const { gen: l, parentSchema: d, data: p, keyword: w, it: _ } = n;
    b(d), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(l, a.length, _.items));
    const $ = l.name("valid"), E = l.const("len", (0, s._)`${p}.length`);
    a.forEach((h, u) => {
      (0, e.alwaysValidSchema)(_, h) || (l.if((0, s._)`${E} > ${u}`, () => n.subschema({
        keyword: w,
        schemaProp: u,
        dataProp: u
      }, $)), n.ok($));
    });
    function b(h) {
      const { opts: u, errSchemaPath: c } = _, f = a.length, y = f === h.minItems && (f === h.maxItems || h[o] === !1);
      if (u.strictTuples && !y) {
        const v = `"${w}" is ${f}-tuple, but minItems or maxItems/${o} are not specified or different at path "${c}"`;
        (0, e.checkStrictMode)(_, v, u.strictTuples);
      }
    }
  }
  return Ne.validateTuple = i, Ne.default = r, Ne;
}
var Fr;
function fi() {
  if (Fr) return ot;
  Fr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const s = mn(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, s.validateTuple)(t, "items")
  };
  return ot.default = e, ot;
}
var at = {}, Lr;
function hi() {
  if (Lr) return at;
  Lr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const s = X(), e = ee(), t = me(), r = pn(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, s.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, s._)`{limit: ${o}}`
    },
    code(o) {
      const { schema: a, parentSchema: l, it: d } = o, { prefixItems: p } = l;
      d.items = !0, !(0, e.alwaysValidSchema)(d, a) && (p ? (0, r.validateAdditionalItems)(o, p) : o.ok((0, t.validateArray)(o)));
    }
  };
  return at.default = n, at;
}
var ct = {}, Ur;
function pi() {
  if (Ur) return ct;
  Ur = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: i, max: n } }) => n === void 0 ? (0, s.str)`must contain at least ${i} valid item(s)` : (0, s.str)`must contain at least ${i} and no more than ${n} valid item(s)`,
      params: ({ params: { min: i, max: n } }) => n === void 0 ? (0, s._)`{minContains: ${i}}` : (0, s._)`{minContains: ${i}, maxContains: ${n}}`
    },
    code(i) {
      const { gen: n, schema: o, parentSchema: a, data: l, it: d } = i;
      let p, w;
      const { minContains: _, maxContains: $ } = a;
      d.opts.next ? (p = _ === void 0 ? 1 : _, w = $) : p = 1;
      const E = n.const("len", (0, s._)`${l}.length`);
      if (i.setParams({ min: p, max: w }), w === void 0 && p === 0) {
        (0, e.checkStrictMode)(d, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (w !== void 0 && p > w) {
        (0, e.checkStrictMode)(d, '"minContains" > "maxContains" is always invalid'), i.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(d, o)) {
        let f = (0, s._)`${E} >= ${p}`;
        w !== void 0 && (f = (0, s._)`${f} && ${E} <= ${w}`), i.pass(f);
        return;
      }
      d.items = !0;
      const b = n.name("valid");
      w === void 0 && p === 1 ? u(b, () => n.if(b, () => n.break())) : p === 0 ? (n.let(b, !0), w !== void 0 && n.if((0, s._)`${l}.length > 0`, h)) : (n.let(b, !1), h()), i.result(b, () => i.reset());
      function h() {
        const f = n.name("_valid"), y = n.let("count", 0);
        u(f, () => n.if(f, () => c(y)));
      }
      function u(f, y) {
        n.forRange("i", 0, E, (v) => {
          i.subschema({
            keyword: "contains",
            dataProp: v,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), y();
        });
      }
      function c(f) {
        n.code((0, s._)`${f}++`), w === void 0 ? n.if((0, s._)`${f} >= ${p}`, () => n.assign(b, !0).break()) : (n.if((0, s._)`${f} > ${w}`, () => n.assign(b, !1).break()), p === 1 ? n.assign(b, !0) : n.if((0, s._)`${f} >= ${p}`, () => n.assign(b, !0)));
      }
    }
  };
  return ct.default = r, ct;
}
var zt = {}, Gr;
function mi() {
  return Gr || (Gr = 1, (function(s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.validateSchemaDeps = s.validatePropertyDeps = s.error = void 0;
    const e = X(), t = ee(), r = me();
    s.error = {
      message: ({ params: { property: l, depsCount: d, deps: p } }) => {
        const w = d === 1 ? "property" : "properties";
        return (0, e.str)`must have ${w} ${p} when property ${l} is present`;
      },
      params: ({ params: { property: l, depsCount: d, deps: p, missingProperty: w } }) => (0, e._)`{property: ${l},
    missingProperty: ${w},
    depsCount: ${d},
    deps: ${p}}`
      // TODO change to reference
    };
    const i = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: s.error,
      code(l) {
        const [d, p] = n(l);
        o(l, d), a(l, p);
      }
    };
    function n({ schema: l }) {
      const d = {}, p = {};
      for (const w in l) {
        if (w === "__proto__")
          continue;
        const _ = Array.isArray(l[w]) ? d : p;
        _[w] = l[w];
      }
      return [d, p];
    }
    function o(l, d = l.schema) {
      const { gen: p, data: w, it: _ } = l;
      if (Object.keys(d).length === 0)
        return;
      const $ = p.let("missing");
      for (const E in d) {
        const b = d[E];
        if (b.length === 0)
          continue;
        const h = (0, r.propertyInData)(p, w, E, _.opts.ownProperties);
        l.setParams({
          property: E,
          depsCount: b.length,
          deps: b.join(", ")
        }), _.allErrors ? p.if(h, () => {
          for (const u of b)
            (0, r.checkReportMissingProp)(l, u);
        }) : (p.if((0, e._)`${h} && (${(0, r.checkMissingProp)(l, b, $)})`), (0, r.reportMissingProp)(l, $), p.else());
      }
    }
    s.validatePropertyDeps = o;
    function a(l, d = l.schema) {
      const { gen: p, data: w, keyword: _, it: $ } = l, E = p.name("valid");
      for (const b in d)
        (0, t.alwaysValidSchema)($, d[b]) || (p.if(
          (0, r.propertyInData)(p, w, b, $.opts.ownProperties),
          () => {
            const h = l.subschema({ keyword: _, schemaProp: b }, E);
            l.mergeValidEvaluated(h, E);
          },
          () => p.var(E, !0)
          // TODO var
        ), l.ok(E));
    }
    s.validateSchemaDeps = a, s.default = i;
  })(zt)), zt;
}
var lt = {}, Kr;
function yi() {
  if (Kr) return lt;
  Kr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: i }) => (0, s._)`{propertyName: ${i.propertyName}}`
    },
    code(i) {
      const { gen: n, schema: o, data: a, it: l } = i;
      if ((0, e.alwaysValidSchema)(l, o))
        return;
      const d = n.name("valid");
      n.forIn("key", a, (p) => {
        i.setParams({ propertyName: p }), i.subschema({
          keyword: "propertyNames",
          data: p,
          dataTypes: ["string"],
          propertyName: p,
          compositeRule: !0
        }, d), n.if((0, s.not)(d), () => {
          i.error(!0), l.allErrors || n.break();
        });
      }), i.ok(d);
    }
  };
  return lt.default = r, lt;
}
var ut = {}, Hr;
function yn() {
  if (Hr) return ut;
  Hr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const s = me(), e = X(), t = $e(), r = ee(), n = {
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
      const { gen: a, schema: l, parentSchema: d, data: p, errsCount: w, it: _ } = o;
      if (!w)
        throw new Error("ajv implementation error");
      const { allErrors: $, opts: E } = _;
      if (_.props = !0, E.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, l))
        return;
      const b = (0, s.allSchemaProperties)(d.properties), h = (0, s.allSchemaProperties)(d.patternProperties);
      u(), o.ok((0, e._)`${w} === ${t.default.errors}`);
      function u() {
        a.forIn("key", p, (g) => {
          !b.length && !h.length ? y(g) : a.if(c(g), () => y(g));
        });
      }
      function c(g) {
        let P;
        if (b.length > 8) {
          const R = (0, r.schemaRefOrVal)(_, d.properties, "properties");
          P = (0, s.isOwnProperty)(a, R, g);
        } else b.length ? P = (0, e.or)(...b.map((R) => (0, e._)`${g} === ${R}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((R) => (0, e._)`${(0, s.usePattern)(o, R)}.test(${g})`))), (0, e.not)(P);
      }
      function f(g) {
        a.code((0, e._)`delete ${p}[${g}]`);
      }
      function y(g) {
        if (E.removeAdditional === "all" || E.removeAdditional && l === !1) {
          f(g);
          return;
        }
        if (l === !1) {
          o.setParams({ additionalProperty: g }), o.error(), $ || a.break();
          return;
        }
        if (typeof l == "object" && !(0, r.alwaysValidSchema)(_, l)) {
          const P = a.name("valid");
          E.removeAdditional === "failing" ? (v(g, P, !1), a.if((0, e.not)(P), () => {
            o.reset(), f(g);
          })) : (v(g, P), $ || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function v(g, P, R) {
        const O = {
          keyword: "additionalProperties",
          dataProp: g,
          dataPropType: r.Type.Str
        };
        R === !1 && Object.assign(O, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(O, P);
      }
    }
  };
  return ut.default = n, ut;
}
var dt = {}, Br;
function gi() {
  if (Br) return dt;
  Br = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const s = Mt(), e = me(), t = ee(), r = yn(), i = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(n) {
      const { gen: o, schema: a, parentSchema: l, data: d, it: p } = n;
      p.opts.removeAdditional === "all" && l.additionalProperties === void 0 && r.default.code(new s.KeywordCxt(p, r.default, "additionalProperties"));
      const w = (0, e.allSchemaProperties)(a);
      for (const h of w)
        p.definedProperties.add(h);
      p.opts.unevaluated && w.length && p.props !== !0 && (p.props = t.mergeEvaluated.props(o, (0, t.toHash)(w), p.props));
      const _ = w.filter((h) => !(0, t.alwaysValidSchema)(p, a[h]));
      if (_.length === 0)
        return;
      const $ = o.name("valid");
      for (const h of _)
        E(h) ? b(h) : (o.if((0, e.propertyInData)(o, d, h, p.opts.ownProperties)), b(h), p.allErrors || o.else().var($, !0), o.endIf()), n.it.definedProperties.add(h), n.ok($);
      function E(h) {
        return p.opts.useDefaults && !p.compositeRule && a[h].default !== void 0;
      }
      function b(h) {
        n.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, $);
      }
    }
  };
  return dt.default = i, dt;
}
var ft = {}, Wr;
function vi() {
  if (Wr) return ft;
  Wr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const s = me(), e = X(), t = ee(), r = ee(), i = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(n) {
      const { gen: o, schema: a, data: l, parentSchema: d, it: p } = n, { opts: w } = p, _ = (0, s.allSchemaProperties)(a), $ = _.filter((y) => (0, t.alwaysValidSchema)(p, a[y]));
      if (_.length === 0 || $.length === _.length && (!p.opts.unevaluated || p.props === !0))
        return;
      const E = w.strictSchema && !w.allowMatchingProperties && d.properties, b = o.name("valid");
      p.props !== !0 && !(p.props instanceof e.Name) && (p.props = (0, r.evaluatedPropsToName)(o, p.props));
      const { props: h } = p;
      u();
      function u() {
        for (const y of _)
          E && c(y), p.allErrors ? f(y) : (o.var(b, !0), f(y), o.if(b));
      }
      function c(y) {
        for (const v in E)
          new RegExp(y).test(v) && (0, t.checkStrictMode)(p, `property ${v} matches pattern ${y} (use allowMatchingProperties)`);
      }
      function f(y) {
        o.forIn("key", l, (v) => {
          o.if((0, e._)`${(0, s.usePattern)(n, y)}.test(${v})`, () => {
            const g = $.includes(y);
            g || n.subschema({
              keyword: "patternProperties",
              schemaProp: y,
              dataProp: v,
              dataPropType: r.Type.Str
            }, b), p.opts.unevaluated && h !== !0 ? o.assign((0, e._)`${h}[${v}]`, !0) : !g && !p.allErrors && o.if((0, e.not)(b), () => o.break());
          });
        });
      }
    }
  };
  return ft.default = i, ft;
}
var ht = {}, Jr;
function bi() {
  if (Jr) return ht;
  Jr = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const s = ee(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: r, schema: i, it: n } = t;
      if ((0, s.alwaysValidSchema)(n, i)) {
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
var pt = {}, Yr;
function wi() {
  if (Yr) return pt;
  Yr = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: me().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return pt.default = e, pt;
}
var mt = {}, Xr;
function _i() {
  if (Xr) return mt;
  Xr = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: i }) => (0, s._)`{passingSchemas: ${i.passing}}`
    },
    code(i) {
      const { gen: n, schema: o, parentSchema: a, it: l } = i;
      if (!Array.isArray(o))
        throw new Error("ajv implementation error");
      if (l.opts.discriminator && a.discriminator)
        return;
      const d = o, p = n.let("valid", !1), w = n.let("passing", null), _ = n.name("_valid");
      i.setParams({ passing: w }), n.block($), i.result(p, () => i.reset(), () => i.error(!0));
      function $() {
        d.forEach((E, b) => {
          let h;
          (0, e.alwaysValidSchema)(l, E) ? n.var(_, !0) : h = i.subschema({
            keyword: "oneOf",
            schemaProp: b,
            compositeRule: !0
          }, _), b > 0 && n.if((0, s._)`${_} && ${p}`).assign(p, !1).assign(w, (0, s._)`[${w}, ${b}]`).else(), n.if(_, () => {
            n.assign(p, !0), n.assign(w, b), h && i.mergeEvaluated(h, s.Name);
          });
        });
      }
    }
  };
  return mt.default = r, mt;
}
var yt = {}, Qr;
function $i() {
  if (Qr) return yt;
  Qr = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const s = ee(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: i, it: n } = t;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const o = r.name("valid");
      i.forEach((a, l) => {
        if ((0, s.alwaysValidSchema)(n, a))
          return;
        const d = t.subschema({ keyword: "allOf", schemaProp: l }, o);
        t.ok(o), t.mergeEvaluated(d);
      });
    }
  };
  return yt.default = e, yt;
}
var gt = {}, Zr;
function Pi() {
  if (Zr) return gt;
  Zr = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const s = X(), e = ee(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: n }) => (0, s.str)`must match "${n.ifClause}" schema`,
      params: ({ params: n }) => (0, s._)`{failingKeyword: ${n.ifClause}}`
    },
    code(n) {
      const { gen: o, parentSchema: a, it: l } = n;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(l, '"if" without "then" and "else" is ignored');
      const d = i(l, "then"), p = i(l, "else");
      if (!d && !p)
        return;
      const w = o.let("valid", !0), _ = o.name("_valid");
      if ($(), n.reset(), d && p) {
        const b = o.let("ifClause");
        n.setParams({ ifClause: b }), o.if(_, E("then", b), E("else", b));
      } else d ? o.if(_, E("then")) : o.if((0, s.not)(_), E("else"));
      n.pass(w, () => n.error(!0));
      function $() {
        const b = n.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        n.mergeEvaluated(b);
      }
      function E(b, h) {
        return () => {
          const u = n.subschema({ keyword: b }, _);
          o.assign(w, _), n.mergeValidEvaluated(u, w), h ? o.assign(h, (0, s._)`${b}`) : n.setParams({ ifClause: b });
        };
      }
    }
  };
  function i(n, o) {
    const a = n.schema[o];
    return a !== void 0 && !(0, e.alwaysValidSchema)(n, a);
  }
  return gt.default = r, gt;
}
var vt = {}, en;
function Si() {
  if (en) return vt;
  en = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const s = ee(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: i }) {
      r.if === void 0 && (0, s.checkStrictMode)(i, `"${t}" without "if" is ignored`);
    }
  };
  return vt.default = e, vt;
}
var tn;
function Ei() {
  if (tn) return st;
  tn = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const s = pn(), e = fi(), t = mn(), r = hi(), i = pi(), n = mi(), o = yi(), a = yn(), l = gi(), d = vi(), p = bi(), w = wi(), _ = _i(), $ = $i(), E = Pi(), b = Si();
  function h(u = !1) {
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
      n.default,
      l.default,
      d.default
    ];
    return u ? c.push(e.default, r.default) : c.push(s.default, t.default), c.push(i.default), c;
  }
  return st.default = h, st;
}
var bt = {}, wt = {}, rn;
function Mi() {
  if (rn) return wt;
  rn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const s = X(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, s.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, s._)`{format: ${r}}`
    },
    code(r, i) {
      const { gen: n, data: o, $data: a, schema: l, schemaCode: d, it: p } = r, { opts: w, errSchemaPath: _, schemaEnv: $, self: E } = p;
      if (!w.validateFormats)
        return;
      a ? b() : h();
      function b() {
        const u = n.scopeValue("formats", {
          ref: E.formats,
          code: w.code.formats
        }), c = n.const("fDef", (0, s._)`${u}[${d}]`), f = n.let("fType"), y = n.let("format");
        n.if((0, s._)`typeof ${c} == "object" && !(${c} instanceof RegExp)`, () => n.assign(f, (0, s._)`${c}.type || "string"`).assign(y, (0, s._)`${c}.validate`), () => n.assign(f, (0, s._)`"string"`).assign(y, c)), r.fail$data((0, s.or)(v(), g()));
        function v() {
          return w.strictSchema === !1 ? s.nil : (0, s._)`${d} && !${y}`;
        }
        function g() {
          const P = $.$async ? (0, s._)`(${c}.async ? await ${y}(${o}) : ${y}(${o}))` : (0, s._)`${y}(${o})`, R = (0, s._)`(typeof ${y} == "function" ? ${P} : ${y}.test(${o}))`;
          return (0, s._)`${y} && ${y} !== true && ${f} === ${i} && !${R}`;
        }
      }
      function h() {
        const u = E.formats[l];
        if (!u) {
          v();
          return;
        }
        if (u === !0)
          return;
        const [c, f, y] = g(u);
        c === i && r.pass(P());
        function v() {
          if (w.strictSchema === !1) {
            E.logger.warn(R());
            return;
          }
          throw new Error(R());
          function R() {
            return `unknown format "${l}" ignored in schema at path "${_}"`;
          }
        }
        function g(R) {
          const O = R instanceof RegExp ? (0, s.regexpCode)(R) : w.code.formats ? (0, s._)`${w.code.formats}${(0, s.getProperty)(l)}` : void 0, D = n.scopeValue("formats", { key: l, ref: R, code: O });
          return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, s._)`${D}.validate`] : ["string", R, D];
        }
        function P() {
          if (typeof u == "object" && !(u instanceof RegExp) && u.async) {
            if (!$.$async)
              throw new Error("async format in sync schema");
            return (0, s._)`await ${y}(${o})`;
          }
          return typeof f == "function" ? (0, s._)`${y}(${o})` : (0, s._)`${y}.test(${o})`;
        }
      }
    }
  };
  return wt.default = t, wt;
}
var nn;
function ki() {
  if (nn) return bt;
  nn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const e = [Mi().default];
  return bt.default = e, bt;
}
var ke = {}, sn;
function Ti() {
  return sn || (sn = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.contentVocabulary = ke.metadataVocabulary = void 0, ke.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], ke.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), ke;
}
var on;
function Ri() {
  if (on) return Ue;
  on = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  const s = Zn(), e = di(), t = Ei(), r = ki(), i = Ti(), n = [
    s.default,
    e.default,
    (0, t.default)(),
    r.default,
    i.metadataVocabulary,
    i.contentVocabulary
  ];
  return Ue.default = n, Ue;
}
var _t = {}, qe = {}, an;
function Ni() {
  if (an) return qe;
  an = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.DiscrError = void 0;
  var s;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(s || (qe.DiscrError = s = {})), qe;
}
var cn;
function Ai() {
  if (cn) return _t;
  cn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const s = X(), e = Ni(), t = Kt(), r = kt(), i = ee(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: l } }) => a === e.DiscrError.Tag ? `tag "${l}" must be string` : `value of tag "${l}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: l, tagName: d } }) => (0, s._)`{error: ${a}, tag: ${d}, tagValue: ${l}}`
    },
    code(a) {
      const { gen: l, data: d, schema: p, parentSchema: w, it: _ } = a, { oneOf: $ } = w;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const E = p.propertyName;
      if (typeof E != "string")
        throw new Error("discriminator: requires propertyName");
      if (p.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!$)
        throw new Error("discriminator: requires oneOf keyword");
      const b = l.let("valid", !1), h = l.const("tag", (0, s._)`${d}${(0, s.getProperty)(E)}`);
      l.if((0, s._)`typeof ${h} == "string"`, () => u(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: E })), a.ok(b);
      function u() {
        const y = f();
        l.if(!1);
        for (const v in y)
          l.elseIf((0, s._)`${h} === ${v}`), l.assign(b, c(y[v]));
        l.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: E }), l.endIf();
      }
      function c(y) {
        const v = l.name("valid"), g = a.subschema({ keyword: "oneOf", schemaProp: y }, v);
        return a.mergeEvaluated(g, s.Name), v;
      }
      function f() {
        var y;
        const v = {}, g = R(w);
        let P = !0;
        for (let V = 0; V < $.length; V++) {
          let H = $[V];
          if (H?.$ref && !(0, i.schemaHasRulesButRef)(H, _.self.RULES)) {
            const Y = H.$ref;
            if (H = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, Y), H instanceof t.SchemaEnv && (H = H.schema), H === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, Y);
          }
          const U = (y = H?.properties) === null || y === void 0 ? void 0 : y[E];
          if (typeof U != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${E}"`);
          P = P && (g || R(H)), O(U, V);
        }
        if (!P)
          throw new Error(`discriminator: "${E}" must be required`);
        return v;
        function R({ required: V }) {
          return Array.isArray(V) && V.includes(E);
        }
        function O(V, H) {
          if (V.const)
            D(V.const, H);
          else if (V.enum)
            for (const U of V.enum)
              D(U, H);
          else
            throw new Error(`discriminator: "properties/${E}" must have "const" or "enum"`);
        }
        function D(V, H) {
          if (typeof V != "string" || V in v)
            throw new Error(`discriminator: "${E}" values must be unique strings`);
          v[V] = H;
        }
      }
    }
  };
  return _t.default = o, _t;
}
const ji = "http://json-schema.org/draft-07/schema#", Ii = "http://json-schema.org/draft-07/schema#", Oi = "Core schema meta-schema", qi = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Ci = ["object", "boolean"], Di = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, xi = {
  $schema: ji,
  $id: Ii,
  title: Oi,
  definitions: qi,
  type: Ci,
  properties: Di,
  default: !0
};
var ln;
function Vi() {
  return ln || (ln = 1, (function(s, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Yn(), r = Ri(), i = Ai(), n = xi, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class l extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(i.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const E = this.opts.$data ? this.$dataMetaSchema(n, o) : n;
        this.addMetaSchema(E, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = l, s.exports = e = l, s.exports.Ajv = l, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = l;
    var d = Mt();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return d.KeywordCxt;
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
    var w = Gt();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return w.default;
    } });
    var _ = kt();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(xe, xe.exports)), xe.exports;
}
var zi = Vi();
const Fi = /* @__PURE__ */ jn(zi), Li = "http://json-schema.org/draft-07/schema#", Ui = "JMON Composition (Multi-Track, Extended)", Gi = "A declarative music format supporting synthesis, MIDI, score notation, key changes, arbitrary metadata, annotations, and custom presets. Time values should use the bars:beats:ticks format (e.g., '2:1:240') for precise musical timing. This format is independent of BPM and follows professional DAW standards.", Ki = "object", Hi = ["format", "version", "bpm", "tracks"], Bi = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '2:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","bpm"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '4:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"The time point for the tempo change."},"bpm":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format where the global loop should end (e.g., '8:0:0')."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"name":{"type":"string","description":"Name of the composition."},"author":{"type":"string","description":"Author or composer."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '0:2:0', '1:3.5:240'). Preferred format for precise musical timing."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"number","description":"Legacy: Time in beats (deprecated, use bars:beats:ticks format instead)."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Wi = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, Ji = !1, Yi = {
  $schema: Li,
  title: Ui,
  description: Gi,
  type: Ki,
  required: Hi,
  properties: Bi,
  definitions: Wi,
  additionalProperties: Ji
};
class gn {
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
class se {
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
    const [, r, i] = t, n = this.convertFlatToSharp(r), o = this.chromatic_scale.indexOf(n);
    if (o === -1)
      throw new Error(`Invalid note name: ${r}`);
    return o + (parseInt(i) + 1) * 12;
  }
  /**
   * Convert MIDI number to note name
   * @param {number} midiNumber - MIDI note number
   * @param {boolean} [preferFlat=false] - Whether to prefer flat notation
   * @returns {string} Note name with octave (e.g. 'C4', 'F#5')
   */
  static midiToNoteName(e, t = !1) {
    const r = Math.floor(e / 12) - 1, i = e % 12;
    return `${this.chromatic_scale[i]}${r}`;
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
class vn {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = se.convertFlatToSharp(e);
    if (!se.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${se.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(se.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(se.scale_intervals).join(", ")}'.`);
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
    const t = se.scale_intervals[this.mode];
    if (!t)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof e.start == "string" && (e.start = se.noteNameToMidi(e.start)), typeof e.end == "string" && (e.end = se.noteNameToMidi(e.end));
    const r = e.start ?? 60;
    if (se.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const n = (a, l) => {
      const d = l % t.length, p = Math.floor(l / t.length) * 12, w = t[d];
      return a + w + p;
    }, o = [];
    if (e.end !== void 0)
      for (let a = 0; ; a++) {
        const l = n(r, a);
        if (l > e.end) break;
        o.push(l);
      }
    else if (e.length)
      for (let a = 0; a < e.length; a++)
        o.push(n(r, a));
    else
      return t.map((a) => r + a);
    return o;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const e = se.scale_intervals[this.mode];
    if (!e) return [];
    const t = se.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const i = (t + r) % 12;
      return se.chromatic_scale[i];
    });
  }
  /**
   * Check if a given pitch is in the scale
   * @param {number} pitch - MIDI note number
   * @returns {boolean} True if the pitch class is in the scale
   */
  isInScale(e) {
    const t = e % 12;
    return this.generate().map((i) => i % 12).includes(t);
  }
}
function Xi(s) {
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
function bn(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function wn(s) {
  return Math.floor(s / 12) - 1;
}
function Qi(s) {
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
function Ut(s, e, t) {
  typeof s == "string" && (s = De(s)), typeof t == "string" && (t = De(t));
  const r = e.indexOf(t);
  if (e.includes(s))
    return e.indexOf(s) - r;
  {
    const i = bn(s, e), n = e.indexOf(i), o = n > 0 ? n - 1 : n, a = e[o], l = i - s, d = s - a, p = l + d;
    if (p === 0) return n - r;
    const w = 1 - l / p, _ = 1 - d / p, $ = n - r, E = o - r;
    return $ * w + E * _;
  }
}
function Zi(s, e, t) {
  const r = e.indexOf(t), i = Math.round(r + s);
  if (i >= 0 && i < e.length)
    return e[i];
  {
    const n = Math.max(0, Math.min(i, e.length - 1)), o = Math.min(e.length - 1, Math.max(i, 0)), a = e[n], l = e[o], d = o - i, p = i - n, w = d + p;
    if (w === 0)
      return (l + a) / 2;
    const _ = 1 - d / w, $ = 1 - p / w;
    return l * _ + a * $;
  }
}
function _n(s) {
  s.length > 0 && s[0].length === 2 && (s = s.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, i, n] of s)
    e.push([r, i, t]), t += i;
  return e;
}
function $n(s, e = 0) {
  const t = [...s].sort((n, o) => n[2] - o[2]);
  let r = 0;
  const i = [];
  for (const n of t) {
    const [o, a, l] = n, d = e + l;
    if (d > r) {
      const w = [null, d - r, r - e];
      i.push(w);
    }
    i.push(n), r = Math.max(r, d + a);
  }
  return i;
}
function Pn(s) {
  s.sort((e, t) => e[2] - t[2]);
  for (let e = 0; e < s.length - 1; e++) {
    const t = s[e], r = s[e + 1];
    if (t[2] + t[1] > r[2]) {
      const n = r[2] - t[2];
      s[e] = [t[0], n, t[2]];
    }
  }
  return s;
}
function es(s) {
  return Pn($n(s));
}
function De(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B"
  };
  let r = 4, i = s;
  if (s.includes("b")) {
    const a = s.slice(0, -1);
    t[a] && (i = t[a] + s.slice(-1));
  }
  let n;
  return i.length > 2 || i.length === 2 && !isNaN(i[1]) ? (n = i.slice(0, -1), r = parseInt(i.slice(-1))) : n = i[0], 12 * (r + 1) + e.indexOf(n);
}
function ts(s) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(s / 12) - 1, r = s % 12;
  return e[r] + t.toString();
}
function rs(s, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [i, n, o] of s)
    t.push([i, n, r]), r += n;
  return t;
}
function ns(s) {
  return s.every((e) => Array.isArray(e)) ? "list of tuples" : s.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function is(s, e, t, r = null, i = null) {
  const n = r !== null ? r : Math.min(...s), o = i !== null ? i : Math.max(...s);
  return n === o ? new Array(s.length).fill((e + t) / 2) : s.map(
    (a) => (a - n) * (t - e) / (o - n) + e
  );
}
function Sn(s, e) {
  return s.map(([t, r, i]) => [t, r, i + e]);
}
function ss(s, e, t) {
  const r = [];
  for (const [i, n, o] of s) {
    const a = Math.round(o / t) * t, l = (Math.floor(a / e) + 1) * e;
    let d = Math.round(n / t) * t;
    d = Math.min(d, l - a), d > 0 && r.push([i, d, a]);
  }
  return r;
}
function os(s, e) {
  const r = s.filter(([a, , l]) => a !== null && l !== null).sort((a, l) => a[2] - l[2]), i = Math.max(...r.map(([, , a]) => a)), n = Math.floor(i / e) + 1, o = [];
  for (let a = 0; a < n; a++) {
    const l = a * e;
    let d = null, p = 1 / 0;
    for (const [w, , _] of r) {
      const $ = l - _;
      if ($ >= 0 && $ < p && (p = $, d = w), _ > l) break;
    }
    d !== null && o.push(d);
  }
  return o;
}
function as(s, e) {
  return e.reduce(
    (t, r) => Math.abs(r - s) < Math.abs(t - s) ? r : t
  );
}
function cs(s, e) {
  return 60 / e * s;
}
function* ls(s = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * s, [s, e] = [e, s + e];
}
function us(s, e, t) {
  const r = {};
  for (const [i, n] of Object.entries(s)) {
    const o = [];
    for (let a = 0; a < e; a++) {
      const l = a * t, d = Sn(n, l);
      o.push(...d);
    }
    r[i] = o;
  }
  return r;
}
const ds = {
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
}, fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: Pn,
  cdeToMidi: De,
  checkInput: ns,
  fibonacci: ls,
  fillGapsWithRests: $n,
  findClosestPitchAtMeasureStart: os,
  getDegreeFromPitch: Ut,
  getOctave: wn,
  getPitchFromDegree: Zi,
  getSharp: Qi,
  instrumentMapping: ds,
  midiToCde: ts,
  noOverlap: rs,
  offsetTrack: Sn,
  qlToSeconds: cs,
  quantizeNotes: ss,
  repairNotes: es,
  repeatPolyloops: us,
  roundToList: bn,
  scaleList: is,
  setOffsetsAccordingToDurations: _n,
  tracksToDict: Xi,
  tune: as
}, Symbol.toStringTag, { value: "Module" }));
class hs extends se {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", i = [3, 3, 1], n = null) {
    if (super(), this.tonicMidi = De(e), this.circleOf = t, this.type = r, this.radius = i, this.weights = n || i, !Object.keys(this.intervals).includes(this.circleOf))
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
      const i = (t[t.length - 1] + e) % 12 + Math.floor(t[t.length - 1] / 12) * 12;
      t.push(i);
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
    const { major: r, minor: i, diminished: n } = this.computeCircle(), o = [r, i, n], a = ["major", "minor", "diminished"], l = [];
    for (let d = 0; d < e; d++) {
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
    const t = e.reduce((i, n) => i + n, 0);
    let r = Math.random() * t;
    for (let i = 0; i < e.length; i++)
      if (r -= e[i], r <= 0)
        return i;
    return e.length - 1;
  }
}
class ps extends se {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new vn(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = wn(e), r = this.tonic + t.toString(), i = De(r), n = this.scale.map((l) => Ut(l, this.scale, i)), o = Math.round(Ut(e, this.scale, i)), a = [];
    for (const l of this.degrees) {
      const d = o + l, p = n.indexOf(d);
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
    let i = e;
    if (typeof e[0] == "number") {
      t === null && (t = [1]);
      let o = 0, a = 0;
      i = e.map((l) => {
        const d = t[o % t.length], p = [l, d, a];
        return a += d, o++, p;
      });
    }
    const n = i.map(([o, a, l]) => [this.pitchToChord(o), a, l]);
    if (r) {
      const o = [];
      for (const [a, l, d] of n) {
        const p = l / a.length;
        a.forEach((w, _) => {
          o.push([w, p, d + _ * p]);
        });
      }
      return o;
    } else
      return n;
  }
}
const un = {
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
class Bt {
  /**
   * Validate ornament parameters and compatibility
   * @param {Object} note - The note to apply the ornament to
   * @param {string} type - The type of ornament
   * @param {Object} params - Parameters for the ornament
   * @returns {Object} Validation result with success status and any messages
   */
  static validateOrnament(e, t, r = {}) {
    const i = {
      valid: !1,
      warnings: [],
      errors: []
    }, n = un[t];
    if (!n)
      return i.errors.push(`Unknown ornament type: ${t}`), i;
    if (n.requiredParams) {
      for (const o of n.requiredParams)
        if (!(o in r))
          return i.errors.push(`Missing required parameter '${o}' for ${t}`), i;
    }
    if (n.minDuration && i.warnings.push(`Duration check not implemented for ${t}`), e.ornaments && n.conflicts) {
      const o = e.ornaments.filter((a) => n.conflicts.includes(a.type)).map((a) => a.type);
      if (o.length > 0)
        return i.errors.push(`${t} conflicts with existing ornaments: ${o.join(", ")}`), i;
    }
    if (n.validate) {
      const o = n.validate(e, r);
      if (!o.valid)
        return i.errors.push(o.error), i;
    }
    return i.valid = !0, i;
  }
  /**
   * Create a new ornament instance with validation
   * @param {Object} options - Ornament configuration
   */
  constructor(e) {
    const t = un[e.type];
    if (!t)
      throw new Error(`Unknown ornament type: ${e.type}`);
    this.type = e.type, this.params = {
      ...t.defaultParams,
      ...e.parameters
    }, e.tonic && e.mode ? (this.tonicIndex = se.chromatic_scale.indexOf(e.tonic), this.scale = this.generateScale(e.tonic, e.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(e, t) {
    const r = se.scale_intervals[t], i = se.chromatic_scale.indexOf(e), n = r.map((a) => (i + a) % 12), o = [];
    for (let a = -1; a < 10; a++)
      for (const l of n) {
        const d = 12 * a + l;
        d >= 0 && d <= 127 && o.push(d);
      }
    return o;
  }
  /**
   * Apply the ornament to notes
   */
  apply(e, t = null) {
    if (!Array.isArray(e) || e.length === 0 || (t === null && (t = Math.floor(Math.random() * e.length)), t < 0 || t >= e.length))
      return e;
    const r = e[t], i = Bt.validateOrnament(r, this.type, this.params);
    if (!i.valid)
      return console.warn(`Ornament validation failed: ${i.errors.join(", ")}`), e;
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
    const [r, i, n] = e[t], o = this.params.gracePitches ? this.params.gracePitches[Math.floor(Math.random() * this.params.gracePitches.length)] : r + 1;
    if (this.params.graceNoteType === "acciaccatura") {
      const a = i * 0.125, l = [r, i, n + a];
      return [
        ...e.slice(0, t),
        [o, a, n],
        l,
        ...e.slice(t + 1)
      ];
    } else {
      const a = i / 2, l = [r, a, n + a];
      return [
        ...e.slice(0, t),
        [o, a, n],
        l,
        ...e.slice(t + 1)
      ];
    }
  }
  /**
   * Add a trill
   */
  addTrill(e, t) {
    const [r, i, n] = e[t], o = [];
    let a = n;
    const l = this.params.by || 1, d = this.params.trillRate || 0.125;
    let p;
    if (this.scale && this.scale.includes(r)) {
      const _ = (this.scale.indexOf(r) + Math.round(l)) % this.scale.length;
      p = this.scale[_];
    } else
      p = r + l;
    for (; a < n + i; ) {
      const w = n + i - a, _ = Math.min(d, w / 2);
      if (w >= _ * 2)
        o.push([r, _, a]), o.push([p, _, a + _]), a += 2 * _;
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
   * Add a mordent
   */
  addMordent(e, t) {
    const [r, i, n] = e[t], o = this.params.by || 1;
    let a;
    if (this.scale && this.scale.includes(r)) {
      const w = this.scale.indexOf(r) + Math.round(o);
      a = this.scale[w] || r + o;
    } else
      a = r + o;
    const l = i / 3, d = [
      [r, l, n],
      [a, l, n + l],
      [r, l, n + 2 * l]
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
    const [r, i, n] = e[t], o = i / 4;
    let a, l;
    if (this.scale && this.scale.includes(r)) {
      const p = this.scale.indexOf(r);
      a = this.scale[p + 1] || r + 2, l = this.scale[p - 1] || r - 2;
    } else
      a = r + 2, l = r - 2;
    const d = [
      [r, o, n],
      [a, o, n + o],
      [r, o, n + 2 * o],
      [l, o, n + 3 * o]
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
    const [r, i, n] = e[t], { arpeggioDegrees: o, direction: a = "up" } = this.params;
    if (!o || !Array.isArray(o))
      return e;
    const l = [];
    if (this.scale && this.scale.includes(r)) {
      const w = this.scale.indexOf(r);
      l.push(...o.map((_) => this.scale[w + _] || r + _));
    } else
      l.push(...o.map((w) => r + w));
    a === "down" && l.reverse(), a === "both" && l.push(...l.slice(0, -1).reverse());
    const d = i / l.length, p = l.map((w, _) => [
      w,
      d,
      n + _ * d
    ]);
    return [
      ...e.slice(0, t),
      ...p,
      ...e.slice(t + 1)
    ];
  }
}
const Ft = {
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
class Tt {
  /**
   * Add articulation to a note in a sequence
   * @param {Array} sequence - The note sequence
   * @param {string} articulationType - Type of articulation
   * @param {number} noteIndex - Index of note to articulate
   * @param {Object} params - Parameters for complex articulations
   * @returns {Object} Result with success status and any warnings
   */
  static addArticulation(e, t, r, i = {}) {
    const n = {
      success: !1,
      warnings: [],
      errors: []
    };
    if (!Array.isArray(e))
      return n.errors.push("Sequence must be an array"), n;
    if (r < 0 || r >= e.length)
      return n.errors.push(`Note index ${r} out of bounds (sequence length: ${e.length})`), n;
    const o = Ft[t];
    if (!o)
      return n.errors.push(`Unknown articulation type: ${t}`), n;
    const a = e[r];
    return !a || typeof a != "object" ? (n.errors.push(`Invalid note at index ${r}`), n) : o.complex ? this._addComplexArticulation(a, t, o, i, n) : (a.articulation = t, n.success = !0, n);
  }
  /**
   * Add complex articulation with parameter validation and synchronization
   */
  static _addComplexArticulation(e, t, r, i, n) {
    if (r.requiredParams) {
      for (const o of r.requiredParams)
        if (!(o in i))
          return n.errors.push(`Missing required parameter '${o}' for ${t}`), n;
    }
    switch (t) {
      case "glissando":
      case "portamento":
        return this._applyGlissando(e, t, i, n);
      case "bend":
        return this._applyBend(e, i, n);
      case "vibrato":
        return this._applyVibrato(e, i, n);
      case "tremolo":
        return this._applyTremolo(e, i, n);
      case "crescendo":
      case "diminuendo":
        return this._applyDynamicChange(e, t, i, n);
      default:
        return n.errors.push(`Complex articulation ${t} not implemented`), n;
    }
  }
  /**
   * Apply glissando/portamento articulation
   */
  static _applyGlissando(e, t, r, i) {
    e.articulation = t, e.glissTarget = r.target, e.modulations || (e.modulations = []);
    const n = {
      type: "pitch",
      subtype: t,
      target: r.target,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return r.speed !== void 0 && (n.speed = r.speed), e.modulations = e.modulations.filter(
      (o) => !(o.type === "pitch" && o.subtype === t)
    ), e.modulations.push(n), i.success = !0, i.warnings.push(`Added ${t} modulation synchronized with articulation`), i;
  }
  /**
   * Apply pitch bend articulation
   */
  static _applyBend(e, t, r) {
    e.articulation = "bend", e.modulations || (e.modulations = []);
    const i = {
      type: "pitch",
      subtype: "bend",
      amount: t.amount,
      // in cents
      curve: t.curve || "linear",
      timing: t.returnToOriginal ? "note_duration" : "sustain",
      returnToOriginal: t.returnToOriginal ?? !0
    };
    return e.modulations = e.modulations.filter(
      (n) => !(n.type === "pitch" && n.subtype === "bend")
    ), e.modulations.push(i), r.success = !0, r.warnings.push("Added pitch bend modulation synchronized with articulation"), r;
  }
  /**
   * Apply vibrato articulation
   */
  static _applyVibrato(e, t, r) {
    e.articulation = "vibrato", e.modulations || (e.modulations = []);
    const i = {
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
      (n) => !(n.type === "pitch" && n.subtype === "vibrato")
    ), e.modulations.push(i), r.success = !0, r.warnings.push("Added vibrato modulation synchronized with articulation"), r;
  }
  /**
   * Apply tremolo articulation
   */
  static _applyTremolo(e, t, r) {
    e.articulation = "tremolo", e.modulations || (e.modulations = []);
    const i = {
      type: "amplitude",
      subtype: "tremolo",
      rate: t.rate || 8,
      // Hz
      depth: t.depth || 0.3,
      // 0-1
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (n) => !(n.type === "amplitude" && n.subtype === "tremolo")
    ), e.modulations.push(i), r.success = !0, r.warnings.push("Added tremolo modulation synchronized with articulation"), r;
  }
  /**
   * Apply dynamic change (crescendo/diminuendo)
   */
  static _applyDynamicChange(e, t, r, i) {
    e.articulation = t, e.modulations || (e.modulations = []);
    const n = {
      type: "amplitude",
      subtype: t,
      startVelocity: e.velocity || 0.8,
      endVelocity: r.endVelocity,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (o) => !(o.type === "amplitude" && (o.subtype === "crescendo" || o.subtype === "diminuendo"))
    ), e.modulations.push(n), i.success = !0, i.warnings.push(`Added ${t} modulation synchronized with articulation`), i;
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
    const i = r.articulation;
    if (delete r.articulation, delete r.glissTarget, r.modulations && i) {
      const n = Ft[i];
      n && n.complex && (r.modulations = r.modulations.filter((o) => o.subtype !== i), r.modulations.length === 0 && delete r.modulations);
    }
    return {
      success: !0,
      removed: i,
      message: `Removed ${i} articulation and related modulations`
    };
  }
  /**
   * Validate articulation consistency in a sequence
   */
  static validateSequence(e) {
    const t = [];
    return e.forEach((r, i) => {
      if (r.articulation) {
        const n = this.ARTICULATION_TYPES[r.articulation];
        if (!n) {
          t.push({
            type: "unknown_articulation",
            noteIndex: i,
            articulation: r.articulation,
            message: `Unknown articulation type: ${r.articulation}`
          });
          return;
        }
        r.articulation === "glissando" && !r.glissTarget && t.push({
          type: "missing_parameter",
          noteIndex: i,
          articulation: r.articulation,
          message: "Glissando missing glissTarget parameter"
        }), n.complex && r.modulations && (r.modulations.some(
          (a) => a.subtype === r.articulation
        ) || t.push({
          type: "modulation_sync",
          noteIndex: i,
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
    return Object.entries(Ft).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function En(s, e, t, r) {
  return Tt.addArticulation(s, e, t, r);
}
function Mn(s, e) {
  return Tt.removeArticulation(s, e);
}
function ms(s) {
  return Tt.validateSequence(s);
}
const ys = En, gs = Mn, vs = {
  Scale: vn,
  Progression: hs,
  Voice: ps,
  Ornament: Bt,
  Articulation: Tt,
  addArticulation: En,
  addOrnament: ys,
  // Include the alias
  removeArticulation: Mn,
  removeOrnament: gs,
  // Include the alias
  validateArticulations: ms
};
class bs {
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
    const i = [];
    let n = 0, o = 0;
    for (; n < this.measureLength && o < r; ) {
      const a = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (n + a > this.measureLength) {
        o++;
        continue;
      }
      if (Math.random() < t) {
        o++;
        continue;
      }
      i.push([a, n]), n += a, o++;
    }
    return o >= r && console.warn("Max iterations reached. The sum of the durations may not equal the measure length."), i;
  }
  /**
   * Executes the Darwinian evolution algorithm to generate the best rhythm
   * @param {number} seed - Random seed for reproducibility
   * @param {number} populationSize - Number of rhythms in each generation
   * @param {number} maxGenerations - Maximum number of generations
   * @param {number} mutationRate - Probability of mutation (0-1)
   * @returns {Array} The best rhythm found after evolution
   */
  darwin(e = null, t = 10, r = 50, i = 0.1) {
    return new ws(
      e,
      t,
      this.measureLength,
      r,
      i,
      this.durations
    ).generate();
  }
}
class ws {
  constructor(e, t, r, i, n, o) {
    e !== null && (Math.seedrandom = e), this.populationSize = t, this.measureLength = r, this.maxGenerations = i, this.mutationRate = n, this.durations = o, this.population = this.initializePopulation();
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
      const r = this.measureLength - t, i = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (i <= r)
        e.push([i, t]), t += i;
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
    const t = e.reduce((r, i) => r + i[0], 0);
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
    const r = Math.floor(Math.random() * (e.length - 1)) + 1, i = [...e.slice(0, r), ...t.slice(r)];
    return this.ensureMeasureLength(i);
  }
  /**
   * Ensure rhythm respects measure length
   * @param {Array} rhythm - The rhythm to adjust
   * @returns {Array} Adjusted rhythm
   */
  ensureMeasureLength(e) {
    return e.reduce((r, i) => r + i[0], 0) > this.measureLength && e.length > 0 && e.pop(), e;
  }
  /**
   * Mutate a rhythm with certain probability
   * @param {Array} rhythm - The rhythm to mutate
   * @returns {Array} Mutated rhythm
   */
  mutate(e) {
    if (Math.random() < this.mutationRate && e.length > 1) {
      const t = Math.floor(Math.random() * (e.length - 1)), [r, i] = e[t], o = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - i, a = this.durations.filter((l) => l <= o);
      if (a.length > 0) {
        const l = a[Math.floor(Math.random() * a.length)];
        e[t] = [l, i];
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
      for (let i = 0; i < this.populationSize; i++) {
        const n = this.selectParent(), o = this.selectParent();
        let a = this.crossover(n, o);
        a = this.mutate(a), a.sort((l, d) => l[1] - d[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function _s(s, e) {
  const t = s.map((a) => Array.isArray(a) || typeof a == "object" && a.length ? a[0] : a), r = $s(t.length, e.length), i = [], n = [];
  for (let a = 0; a < r; a++)
    i.push(t[a % t.length]), n.push(e[a % e.length]);
  const o = i.map((a, l) => [a, n[l], 1]);
  return _n(o);
}
function $s(s, e) {
  const t = (r, i) => i === 0 ? r : t(i, r % i);
  return Math.abs(s * e) / t(s, e);
}
function Ps(s, e) {
  const t = [];
  let r = 0, i = 0;
  for (const n of s) {
    const o = e[i % e.length];
    t.push([n, o, r]), r += o, i++;
  }
  return t;
}
const Ss = {
  Rhythm: bs,
  isorhythm: _s,
  beatcycle: Ps
};
class Es {
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
function Lt(s) {
  return Array.isArray(s[0]) ? _e.from2DArray(s) : _e.from2DArray([s]);
}
function Ms(s) {
  if (s.rows !== s.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = s.rows, t = _e.zeros(e, e);
  for (let r = 0; r < e; r++)
    for (let i = 0; i <= r; i++)
      if (r === i) {
        let n = 0;
        for (let a = 0; a < i; a++)
          n += t.get(i, a) * t.get(i, a);
        const o = s.get(i, i) - n;
        if (o <= 0)
          throw new Error(`Matrix is not positive definite at position (${i}, ${i})`);
        t.set(i, i, Math.sqrt(o));
      } else {
        let n = 0;
        for (let o = 0; o < i; o++)
          n += t.get(r, o) * t.get(i, o);
        t.set(r, i, (s.get(r, i) - n) / t.get(i, i));
      }
  return t;
}
class ks {
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
    for (let i = 0; i < r.rows; i++)
      r.set(i, i, r.get(i, i) + this.alpha);
    try {
      this.L = Ms(r);
    } catch (i) {
      throw new Error(`Failed to compute Cholesky decomposition: ${i instanceof Error ? i.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = Lt(e), i = this.kernel.call(this.XTrain, r), n = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      n[a] = 0;
      for (let l = 0; l < this.XTrain.rows; l++)
        n[a] += i.get(l, a) * this.alphaVector[l];
    }
    const o = { mean: n };
    if (t) {
      const a = this.computeStd(r, i);
      o.std = a;
    }
    return o;
  }
  sampleY(e, t = 1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before sampling");
    const r = Lt(e), i = this.predict(e, !0);
    if (!i.std)
      throw new Error("Standard deviation computation failed");
    const n = [];
    for (let o = 0; o < t; o++) {
      const a = new Array(r.rows);
      for (let l = 0; l < r.rows; l++) {
        const d = i.mean[l], p = i.std[l];
        a[l] = d + p * this.sampleStandardNormal();
      }
      n.push(a);
    }
    return n;
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
    for (let i = 0; i < e.rows; i++) {
      const n = this.kernel.compute(e.getRow(i), e.getRow(i)), o = t.getColumn(i), a = this.forwardSubstitution(this.L, o);
      let l = 0;
      for (let p = 0; p < a.length; p++)
        l += a[p] * a[p];
      const d = n - l;
      r[i] = Math.sqrt(Math.max(0, d));
    }
    return r;
  }
  solveCholesky(e, t) {
    const r = this.forwardSubstitution(e, t);
    return this.backSubstitution(e, r);
  }
  forwardSubstitution(e, t) {
    const r = e.rows, i = new Array(r);
    for (let n = 0; n < r; n++) {
      i[n] = t[n];
      for (let o = 0; o < n; o++)
        i[n] -= e.get(n, o) * i[o];
      i[n] /= e.get(n, n);
    }
    return i;
  }
  backSubstitution(e, t) {
    const r = e.rows, i = new Array(r);
    for (let n = r - 1; n >= 0; n--) {
      i[n] = t[n];
      for (let o = n + 1; o < r; o++)
        i[n] -= e.get(o, n) * i[o];
      i[n] /= e.get(n, n);
    }
    return i;
  }
  sampleStandardNormal() {
    const e = Math.random(), t = Math.random();
    return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * t);
  }
}
class Ts {
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
    return this.generate(e).map((r) => r.map((i) => i > 0 ? 1 : 0));
  }
  /**
   * Load rules based on rule number
   * @param {number} ruleNumber - Rule number (0-255)
   * @returns {CellularAutomataRule} Rule mapping
   */
  loadRules(e) {
    const t = e.toString(2).padStart(8, "0"), r = {}, i = ["111", "110", "101", "100", "011", "010", "001", "000"];
    for (let n = 0; n < 8; n++)
      r[i[n]] = parseInt(t[n], 10);
    return r;
  }
  /**
   * Update the current state based on rules
   */
  updateState() {
    const e = new Array(this.width);
    for (let t = 0; t < this.width; t++) {
      const r = this.state[(t - 1 + this.width) % this.width], i = this.state[t], n = this.state[(t + 1) % this.width], o = `${r}${i}${n}`;
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
      (r) => Array.isArray(r) && r.length === t && r.every((i) => typeof i == "number" && (i === 0 || i === 1))
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
class Rs {
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
      instrument: i = "synth",
      color: n = "steelblue",
      label: o = "Polyloop",
      speed: a = 1,
      radius: l = 0.8
    } = r, d = e.reduce((_, $) => _ + $, 0), p = [];
    let w = 0;
    return e.forEach((_, $) => {
      const E = _ / d * 360;
      p.push({
        angle: w,
        radius: l,
        active: _ > 0,
        pitch: _ > 0 ? t[$ % t.length] : void 0,
        velocity: 0.8,
        instrument: i
      }), w += E;
    }), {
      points: p,
      color: n,
      label: o,
      instrument: i,
      divisions: e.length,
      speed: a
    };
  }
  /**
   * Create polyloop layer from Euclidean rhythm
   */
  static euclidean(e, t, r = [60], i = {}) {
    const {
      instrument: n = "synth",
      color: o = "steelblue",
      label: a = `Euclidean ${t}/${e}`,
      speed: l = 1,
      radius: d = 0.8
    } = i, p = this.generateEuclideanRhythm(e, t), w = [];
    return p.forEach((_, $) => {
      const E = $ / e * 360;
      w.push({
        angle: E,
        radius: d,
        active: _,
        pitch: _ ? r[$ % r.length] : void 0,
        velocity: 0.8,
        instrument: n
      });
    }), {
      points: w,
      color: o,
      label: a,
      instrument: n,
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
    const r = Array(e).fill(!1), i = e / t;
    for (let n = 0; n < t; n++) {
      const o = Math.round(n * i) % e;
      r[o] = !0;
    }
    return r;
  }
  /**
   * Create polyloop with mathematical function
   */
  static fromFunction(e, t = 16, r = [60, 72], i = {}) {
    const {
      instrument: n = "synth",
      color: o = "purple",
      label: a = "Function Polyloop",
      speed: l = 1,
      activeThreshold: d = 0.5
    } = i, p = [], [w, _] = r;
    for (let $ = 0; $ < t; $++) {
      const E = $ / t * 360, b = E * Math.PI / 180, h = e(b), u = Math.abs(h) % 1;
      p.push({
        angle: E,
        radius: 0.3 + u * 0.5,
        // Vary radius based on function
        active: u > d,
        pitch: Math.round(w + u * (_ - w)),
        velocity: 0.5 + u * 0.5,
        instrument: n
      });
    }
    return {
      points: p,
      color: o,
      label: a,
      instrument: n,
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
      const n = ((this.rotationAngles.get(r.label) || 0) + e * r.speed * 360) % 360;
      this.rotationAngles.set(r.label, n), r.points.forEach((o) => {
        if (!o.active) return;
        Math.abs(n - o.angle) < r.speed * 360 * e + 1 && t.push({
          time: this.currentTime,
          layer: r.label,
          point: o,
          angle: n
        });
      });
    }), t;
  }
  /**
   * Generate a sequence of triggers for a given duration
   */
  generateSequence(e, t = 16) {
    const r = 1 / t, i = Math.floor(e / r), n = [];
    this.currentTime = 0, this.resetRotations();
    for (let o = 0; o < i; o++) {
      const a = this.step(r);
      n.push(...a);
    }
    return n;
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
    t.forEach((n) => {
      r.has(n.layer) || r.set(n.layer, []), r.get(n.layer).push(n);
    });
    const i = [];
    return r.forEach((n, o) => {
      const a = n.map((l) => ({
        pitch: typeof l.point.pitch == "number" ? l.point.pitch : 60,
        time: l.time,
        duration: "8n",
        // Default duration
        velocity: l.point.velocity || 0.8
      }));
      i.push({
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
    }), i;
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
class kn {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, i = t || Array(r).fill(1), n = e.map((w, _) => ({ value: w, weight: i[_] })).sort((w, _) => w.value - _.value), o = n.map((w) => w.value), a = n.map((w) => w.weight), l = a.reduce((w, _) => w + _, 0);
    let d = 0, p = 0;
    for (let w = 0; w < r; w++) {
      const _ = a.slice(0, w + 1).reduce(($, E) => $ + E, 0);
      d += a[w] * (2 * _ - a[w] - l) * o[w], p += a[w] * o[w] * l;
    }
    return p === 0 ? 0 : d / p;
  }
  /**
   * Calculate center of mass (balance point) of a sequence
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Balance point
   */
  static balance(e, t) {
    if (e.length === 0) return 0;
    const r = t || Array(e.length).fill(1), i = e.reduce((o, a, l) => o + a * r[l], 0), n = r.reduce((o, a) => o + a, 0);
    return n === 0 ? 0 : i / n;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, i = t || Math.floor(r / 2), n = [], o = e.reduce((l, d) => l + d, 0) / r, a = e.reduce((l, d) => l + Math.pow(d - o, 2), 0) / r;
    for (let l = 0; l <= i; l++) {
      let d = 0;
      for (let p = 0; p < r - l; p++)
        d += (e[p] - o) * (e[p + l] - o);
      d /= r - l, n.push(a === 0 ? 0 : d / a);
    }
    return n;
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
    const i = Math.max(...r.values()), n = r.size;
    return n === 0 ? 0 : i / n;
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
    for (const i of e) {
      const n = (i % 12 + 12) % 12;
      t.includes(n) && r++;
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
    const i = 0.1;
    for (const n of e) {
      const o = n * t, a = Math.round(o);
      Math.abs(o - a) <= i && r++;
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
    for (let i = 1; i < e.length; i++)
      if (e[i - 1] !== 0) {
        const n = e[i] / e[i - 1], o = Math.abs(n - t);
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
    for (const i of e) {
      const n = i * t % 1;
      n > 0.2 && n < 0.8 && Math.abs(n - 0.5) > 0.2 && r++;
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
    const i = t.length;
    return -[r.up / i, r.down / i, r.same / i].filter((o) => o > 0).reduce((o, a) => o + a * Math.log2(a), 0);
  }
  /**
   * Calculate interval variance (pitch stability)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Interval variance
   */
  static intervalVariance(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let n = 1; n < e.length; n++)
      t.push(Math.abs(e[n] - e[n - 1]));
    const r = t.reduce((n, o) => n + o, 0) / t.length;
    return t.reduce((n, o) => n + Math.pow(o - r, 2), 0) / t.length;
  }
  /**
   * Calculate note density (notes per unit time)
   * @param {JMonNote[]} notes - Array of notes
   * @param {number} [timeWindow=1] - Time window for density calculation
   * @returns {number} Note density
   */
  static density(e, t = 1) {
    if (e.length === 0) return 0;
    const r = e.map((a) => typeof a.time == "string" ? parseFloat(a.time) || 0 : a.time || 0), i = Math.min(...r), o = Math.max(...r) - i || 1;
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
    for (let n = 1; n < e.length; n++)
      t.push(e[n] - e[n - 1]);
    const r = t.reduce((n, o) => n + o, 0) / t.length;
    return t.reduce((n, o) => n + Math.pow(o - r, 2), 0) / t.length;
  }
  /**
   * Comprehensive analysis of a musical sequence
   * @param {JMonNote[]} notes - Array of notes to analyze
   * @param {AnalysisOptions} [options={}] - Analysis options
   * @returns {AnalysisResult} Analysis results
   */
  static analyze(e, t = {}) {
    const { scale: r = [0, 2, 4, 5, 7, 9, 11] } = t, i = e.map((o) => typeof o.note == "number" ? o.note : typeof o.note == "string" ? 60 : Array.isArray(o.note) ? o.note[0] : 60), n = e.map((o) => typeof o.time == "number" ? o.time : parseFloat(o.time) || 0);
    return {
      gini: this.gini(i),
      balance: this.balance(i),
      motif: this.motif(i),
      dissonance: this.dissonance(i, r),
      rhythmic: this.rhythmic(n),
      fibonacciIndex: this.fibonacciIndex(i),
      syncopation: this.syncopation(n),
      contourEntropy: this.contourEntropy(i),
      intervalVariance: this.intervalVariance(i),
      density: this.density(e),
      gapVariance: this.gapVariance(n)
    };
  }
}
class Ns {
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
    for (let i = 0; i < e; i++) {
      const n = this.randomPitch(), o = this.randomDuration();
      t.push({
        note: n,
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
    const t = kn.analyze(e, { scale: this.options.scale });
    let r = 0;
    const i = this.options.fitnessWeights;
    r += (i.gini || 0) * (1 - t.gini), r += (i.balance || 0) * (1 - Math.abs(t.balance - 60) / 60), r += (i.motif || 0) * t.motif, r += (i.dissonance || 0) * (1 - t.dissonance), r += (i.rhythmic || 0) * t.rhythmic;
    const n = e.length;
    return (n < this.options.lengthRange[0] || n > this.options.lengthRange[1]) && (r *= 0.5), Math.max(0, r);
  }
  /**
   * Create next generation through selection, crossover, and mutation
   */
  createNextGeneration() {
    const e = [], t = Math.floor(this.options.populationSize * this.options.elitismRate);
    for (let r = 0; r < t; r++) {
      const i = { ...this.population[r] };
      i.age++, e.push(i);
    }
    for (; e.length < this.options.populationSize; ) {
      const r = this.selectParent(), i = this.selectParent();
      let n, o;
      Math.random() < this.options.crossoverRate ? [n, o] = this.crossover(r, i) : (n = { ...r }, o = { ...i }), Math.random() < this.options.mutationRate && this.mutate(n), Math.random() < this.options.mutationRate && this.mutate(o), n.age = 0, o.age = 0, e.push(n), e.length < this.options.populationSize && e.push(o);
    }
    return e;
  }
  /**
   * Tournament selection
   */
  selectParent() {
    const t = [];
    for (let r = 0; r < 3; r++) {
      const i = Math.floor(Math.random() * this.population.length);
      t.push(this.population[i]);
    }
    return t.sort((r, i) => i.fitness - r.fitness), { ...t[0] };
  }
  /**
   * Single-point crossover
   */
  crossover(e, t) {
    const r = Math.min(e.genes.length, t.genes.length), i = Math.floor(Math.random() * r), n = {
      genes: [
        ...e.genes.slice(0, i),
        ...t.genes.slice(i)
      ],
      fitness: 0,
      age: 0
    }, o = {
      genes: [
        ...t.genes.slice(0, i),
        ...e.genes.slice(i)
      ],
      fitness: 0,
      age: 0
    };
    return [n, o];
  }
  /**
   * Mutate an individual
   */
  mutate(e) {
    const t = e.genes, r = Math.random();
    if (r < 0.3) {
      const i = Math.floor(Math.random() * t.length);
      t[i].pitch = this.randomPitch();
    } else if (r < 0.6) {
      const i = Math.floor(Math.random() * t.length);
      t[i].duration = this.randomDuration();
    } else if (r < 0.8) {
      const i = Math.floor(Math.random() * t.length);
      t[i].velocity = Math.random() * 0.5 + 0.5;
    } else if (Math.random() < 0.5 && t.length < this.options.lengthRange[1]) {
      const i = Math.floor(Math.random() * (t.length + 1)), n = {
        pitch: this.randomPitch(),
        time: "0:0:0",
        // Will be recalculated
        duration: this.randomDuration(),
        velocity: Math.random() * 0.5 + 0.5
      };
      t.splice(i, 0, n);
    } else if (t.length > this.options.lengthRange[0]) {
      const i = Math.floor(Math.random() * t.length);
      t.splice(i, 1);
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
    const e = this.population.map((n) => n.fitness), t = e.reduce((n, o) => n + o, 0) / e.length, r = Math.max(...e), i = Math.min(...e);
    return {
      generation: this.generation,
      avgFitness: t,
      maxFitness: r,
      minFitness: i,
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
          let i = 0;
          if (this.options.attractorStrength > 0) {
            const n = e.position[t] - this.options.attractorPosition[t];
            i = -this.options.attractorStrength * n;
          }
          e.velocity[t] = e.velocity[t] * 0.9 + r + i, e.position[t] += e.velocity[t], e.position[t] < this.options.bounds[0] ? (e.position[t] = this.options.bounds[0], e.velocity[t] *= -0.5) : e.position[t] > this.options.bounds[1] && (e.position[t] = this.options.bounds[1], e.velocity[t] *= -0.5);
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
        for (let i = 0; i < this.options.dimensions; i++)
          t[i] += r.position[i];
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
          velocity: t.velocity.map((i) => i + (Math.random() - 0.5) * this.options.stepSize),
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
      for (let i = r + 1; i < e.length; i++)
        if (Math.random() < this.options.mergeProbability && this.calculateDistance(e[r].position, e[i].position) < t) {
          for (let o = 0; o < this.options.dimensions; o++)
            e[r].position[o] = (e[r].position[o] + e[i].position[o]) / 2, e[r].velocity[o] = (e[r].velocity[o] + e[i].velocity[o]) / 2;
          e[i].active = !1;
        }
    this.walkers = this.walkers.filter((r) => r.active);
  }
  /**
   * Calculate Euclidean distance between two positions
   */
  calculateDistance(e, t) {
    let r = 0;
    for (let i = 0; i < e.length; i++)
      r += Math.pow(e[i] - t[i], 2);
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
    const i = this.getProjection(e);
    if (i.length === 0) return [];
    const n = Math.min(...i), a = Math.max(...i) - n || 1;
    return i.map((l) => {
      const d = (l - n) / a, p = Math.floor(d * t.length * r), w = Math.floor(p / t.length), _ = p % t.length;
      return 60 + w * 12 + t[_];
    });
  }
  /**
   * Map walk to rhythmic durations
   */
  mapToRhythm(e = 0, t = [0.25, 0.5, 1, 2]) {
    const r = this.getProjection(e);
    if (r.length === 0) return [];
    const i = Math.min(...r), o = Math.max(...r) - i || 1;
    return r.map((a) => {
      const l = (a - i) / o, d = Math.floor(l * t.length), p = Math.max(0, Math.min(d, t.length - 1));
      return t[p];
    });
  }
  /**
   * Map walk to velocities
   */
  mapToVelocity(e = 0, t = 0.3, r = 1) {
    const i = this.getProjection(e);
    if (i.length === 0) return [];
    const n = Math.min(...i), a = Math.max(...i) - n || 1;
    return i.map((l) => {
      const d = (l - n) / a;
      return t + d * (r - t);
    });
  }
  /**
   * Generate correlated walk (walk that follows another walk with some correlation)
   */
  generateCorrelated(e, t = 0.5, r = 0) {
    if (e.length === 0) return [];
    const i = [];
    let n = 0;
    for (let o = 0; o < e.length; o++) {
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, l = t * (e[o] - n);
      n += a + l, n = Math.max(this.options.bounds[0], Math.min(this.options.bounds[1], n)), i.push(n);
    }
    return i;
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
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], i = Math.abs(r - t), n = e.map((d) => Math.pow(d - t, 2)), o = n.reduce((d, p) => d + p, 0) / n.length;
    let a = 0;
    for (let d = 1; d < e.length; d++)
      a += Math.abs(e[d] - e[d - 1]);
    const l = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: i,
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
class js {
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
      for (let i = 0; i < this.width; i++) {
        const n = this.xMin + i / this.width * (this.xMax - this.xMin), o = this.yMin + t / this.height * (this.yMax - this.yMin), a = this.mandelbrotIterations({ real: n, imaginary: o });
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
      const i = t.real * t.real - t.imaginary * t.imaginary + e.real, n = 2 * t.real * t.imaginary + e.imaginary;
      if (t.real = i, t.imaginary = n, t.real * t.real + t.imaginary * t.imaginary > 4)
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
    for (let i = 0; i < r; i++)
      t.push(e[i][i]);
    return t;
  }
  /**
   * Extract border sequence (clockwise)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Border sequence
   */
  extractBorder(e) {
    const t = [], r = e.length, i = e[0]?.length || 0;
    if (r === 0 || i === 0) return t;
    for (let n = 0; n < i; n++)
      t.push(e[0][n]);
    for (let n = 1; n < r; n++)
      t.push(e[n][i - 1]);
    if (r > 1)
      for (let n = i - 2; n >= 0; n--)
        t.push(e[r - 1][n]);
    if (i > 1)
      for (let n = r - 2; n > 0; n--)
        t.push(e[n][0]);
    return t;
  }
  /**
   * Extract spiral sequence (from outside to inside)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Spiral sequence
   */
  extractSpiral(e) {
    const t = [], r = e.length, i = e[0]?.length || 0;
    if (r === 0 || i === 0) return t;
    let n = 0, o = r - 1, a = 0, l = i - 1;
    for (; n <= o && a <= l; ) {
      for (let d = a; d <= l; d++)
        t.push(e[n][d]);
      n++;
      for (let d = n; d <= o; d++)
        t.push(e[d][l]);
      if (l--, n <= o) {
        for (let d = l; d >= a; d--)
          t.push(e[o][d]);
        o--;
      }
      if (a <= l) {
        for (let d = o; d >= n; d--)
          t.push(e[d][a]);
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
    const r = [], i = e[0]?.length || 0, n = Math.max(0, Math.min(t, i - 1));
    for (const o of e)
      o[n] !== void 0 && r.push(o[n]);
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
    const i = Math.min(...e), o = Math.max(...e) - i || 1;
    return e.map((a) => {
      const l = (a - i) / o, d = Math.floor(l * t.length * r), p = Math.floor(d / t.length), w = d % t.length;
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
    const r = Math.min(...e), n = Math.max(...e) - r || 1;
    return e.map((o) => {
      const a = (o - r) / n, l = Math.floor(a * t.length), d = Math.max(0, Math.min(l, t.length - 1));
      return 1 / t[d];
    });
  }
}
class Is {
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
    const i = [], n = [], o = (t - e) / r;
    for (let a = 0; a < r; a++) {
      const l = e + a * o, d = this.r;
      this.r = l;
      const p = this.generate();
      this.r = d;
      const w = p.slice(-50);
      for (const _ of w)
        i.push(l), n.push(_);
    }
    return { r: i, x: n };
  }
  /**
   * Map chaotic values to musical scale
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(e, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    return e.length === 0 ? [] : e.map((i) => {
      const n = Math.floor(i * t.length * r), o = Math.floor(n / t.length), a = n % t.length;
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
      const i = Math.floor(r * t.length), n = Math.max(0, Math.min(i, t.length - 1));
      return t[n];
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
    const i = r - t;
    return e.map((n) => t + n * i);
  }
  /**
   * Detect periodic cycles in the sequence
   * @param {number[]} sequence - Sequence to analyze
   * @param {number} [tolerance=0.01] - Tolerance for cycle detection
   * @returns {number[]} Detected cycle periods
   */
  detectCycles(e, t = 0.01) {
    const r = [];
    for (let i = 1; i <= Math.floor(e.length / 2); i++) {
      let n = !0;
      for (let o = i; o < Math.min(e.length, i * 3); o++)
        if (Math.abs(e[o] - e[o - i]) > t) {
          n = !1;
          break;
        }
      n && r.push(i);
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
    for (let i = 0; i < e; i++) {
      const n = this.r * (1 - 2 * t);
      r += Math.log(Math.abs(n)), t = this.r * t * (1 - t);
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
    const r = Array(e).fill(null).map(() => []), i = Array(e).fill(this.x0);
    for (let n = 0; n < this.iterations + this.skipTransient; n++) {
      const o = [...i];
      for (let a = 0; a < e; a++) {
        let l = 0;
        for (let d = 0; d < e; d++)
          d !== a && (l += t * (i[d] - i[a]));
        o[a] = this.r * i[a] * (1 - i[a]) + l, o[a] = Math.max(0, Math.min(1, o[a]));
      }
      if (i.splice(0, e, ...o), n >= this.skipTransient)
        for (let a = 0; a < e; a++)
          r[a].push(i[a]);
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
class Os {
  operation;
  direction;
  repetition;
  sequence = [];
  constructor(e) {
    const { operation: t, direction: r, repetition: i } = e;
    if (!["additive", "subtractive"].includes(t))
      throw new Error("Invalid operation. Choose 'additive' or 'subtractive'.");
    if (!["forward", "backward", "inward", "outward"].includes(r))
      throw new Error("Invalid direction. Choose 'forward', 'backward', 'inward' or 'outward'.");
    if (i < 0 || !Number.isInteger(i))
      throw new Error("Invalid repetition value. Must be an integer greater than or equal to 0.");
    this.operation = t, this.direction = r, this.repetition = i;
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
      for (let i = 0; i <= this.repetition; i++)
        e.push(...r);
    }
    return e;
  }
  additiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(t - 1);
      for (let i = 0; i <= this.repetition; i++)
        e.push(...r);
    }
    return e;
  }
  additiveInward() {
    const e = [], t = this.sequence.length;
    for (let r = 0; r < Math.ceil(t / 2); r++) {
      let i;
      if (r < t - r - 1) {
        const n = this.sequence.slice(0, r + 1), o = this.sequence.slice(t - r - 1);
        i = [...n, ...o];
      } else
        i = [...this.sequence];
      for (let n = 0; n <= this.repetition; n++)
        e.push(...i);
    }
    return e;
  }
  additiveOutward() {
    const e = [], t = this.sequence.length;
    if (t % 2 === 0) {
      const r = Math.floor(t / 2) - 1, i = Math.floor(t / 2);
      for (let n = 0; n < t / 2; n++) {
        const o = this.sequence.slice(r - n, i + n + 1);
        for (let a = 0; a <= this.repetition; a++)
          e.push(...o);
      }
    } else {
      const r = Math.floor(t / 2);
      for (let i = 0; i <= r; i++) {
        const n = this.sequence.slice(r - i, r + i + 1);
        for (let o = 0; o <= this.repetition; o++)
          e.push(...n);
      }
    }
    return e;
  }
  subtractiveForward() {
    const e = [];
    for (let t = 0; t < this.sequence.length; t++) {
      const r = this.sequence.slice(t);
      for (let i = 0; i <= this.repetition; i++)
        e.push(...r);
    }
    return e;
  }
  subtractiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(0, t);
      for (let i = 0; i <= this.repetition; i++)
        e.push(...r);
    }
    return e;
  }
  subtractiveInward() {
    const e = [], t = this.sequence.length, r = Math.floor(t / 2);
    for (let i = 0; i <= this.repetition; i++)
      e.push(...this.sequence);
    for (let i = 1; i <= r; i++) {
      const n = this.sequence.slice(i, t - i);
      if (n.length > 0)
        for (let o = 0; o <= this.repetition; o++)
          e.push(...n);
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
      const i = {
        ...r,
        offset: t
      };
      return t += r.duration, i;
    });
  }
}
class qs {
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
      const i = r.pitch, o = this.tChord.map((d) => d - i).map((d, p) => ({ index: p, value: d })).sort((d, p) => Math.abs(d.value) - Math.abs(p.value));
      let a = this.rank, l;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const d = o.filter(
          ({ value: p }) => this.currentDirection === "up" ? p >= 0 : p <= 0
        );
        if (d.length === 0)
          l = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          a >= d.length && (a = d.length - 1);
          const p = d[a].index;
          l = this.tChord[p];
        }
      } else {
        a >= o.length && (a = o.length - 1);
        const d = o[a].index;
        l = this.tChord[d];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up"), t.push({
        ...r,
        pitch: l
      });
    }
    return t;
  }
}
const Cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: kn
}, Symbol.toStringTag, { value: "Module" })), Ds = {
  harmony: vs,
  rhythm: Ss,
  motifs: {
    MotifBank: Es
  }
}, xs = {
  theory: se
}, Vs = {
  gaussian: {
    Regressor: ks
  },
  automata: {
    Cellular: Ts
  },
  loops: {
    Poly: Rs
  },
  genetic: {
    Algorithm: Ns
  },
  walks: {
    Random: As
  },
  fractals: {
    Mandelbrot: js,
    LogisticMap: Is
  },
  minimalism: {
    Process: Os,
    Tintinnabuli: qs
  }
}, zs = {
  ...Cs
}, Fs = {
  ...fs
}, Ce = {
  theory: Ds,
  constants: xs,
  generative: Vs,
  analysis: zs,
  utils: Fs
};
class Ls {
  constructor(e = {}) {
    this.options = e;
  }
  convert(e) {
    return (e.tracks || []).map((r) => ({
      label: r.label,
      part: r.notes.map((i) => ({
        time: i.time,
        note: i.pitch,
        duration: i.duration,
        velocity: i.velocity || 0.8
      }))
    }));
  }
}
function Us(s, e = {}) {
  return new Ls(e).convert(s);
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
    showDebug: i = !1,
    customInstruments: n = {},
    autoMultivoice: o = !0,
    // Automatically create multiple synths for overlapping notes
    maxVoices: a = 4
    // Maximum voices per track
  } = e, d = Us(s, { autoMultivoice: o, maxVoices: a, showDebug: i }), { tracks: p, metadata: w } = d;
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
  const h = document.createElement("div");
  h.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 48%;
        justify-content: space-between;
    `;
  const u = document.createElement("div");
  u.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
  const c = ["PolySynth", "Synth", "AMSynth", "DuoSynth", "FMSynth", "MembraneSynth", "MetalSynth", "MonoSynth", "PluckSynth"], f = s.tracks || s.sequences || [], y = [];
  f.forEach((A, z) => {
    const F = p.find((k) => k.originalTrackIndex === z)?.analysis;
    F?.hasGlissando && console.warn(`Track ${A.label || A.name || z + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
    const J = document.createElement("div");
    J.style.cssText = `
            margin-bottom: 8px;
        `;
    const B = document.createElement("label");
    B.textContent = A.name || A.label || `Track ${z + 1}`, B.style.cssText = `
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
        `, c.forEach((k) => {
      const j = document.createElement("option");
      j.value = k, j.textContent = k, F?.hasGlissando && (k === "PolySynth" || k === "DuoSynth") && (j.disabled = !0, j.textContent += " (mono only for glissando)"), M.appendChild(j);
    }), y.push(M), J.append(B, M), u.appendChild(J);
  }), h.appendChild(u);
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
  const P = document.createElement("label");
  P.textContent = "Tempo", P.style.cssText = `
        font-size: 14px;
        margin-bottom: 5px;
        color: ${$.text};
    `;
  const R = document.createElement("input");
  R.type = "number", R.min = 60, R.max = 240, R.value = r, R.style.cssText = `
        padding: 8px;
        border: 1px solid ${$.secondary};
        border-radius: 6px;
        background-color: ${$.background};
        color: ${$.text};
        font-size: 14px;
        text-align: center;
        width: 100%;
        height: 36px;
    `, g.append(P, R), v.appendChild(g);
  const O = document.createElement("div");
  O.style.cssText = `
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
  const H = document.createElement("div");
  H.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${$.lightText};
        margin: 0px 0px 0px 10px;
    `;
  const U = document.createElement("span");
  U.textContent = "0:00";
  const Y = document.createElement("span");
  Y.textContent = "0:00", H.append(U, " / ", Y), O.append(D, V);
  const ne = document.createElement("div");
  ne.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;
  const le = document.createElement("button");
  le.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', le.style.cssText = `
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
  const fe = document.createElement("button");
  fe.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', fe.style.cssText = `
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
    `, ne.append(le, fe), b.append(h, v), E.append(b, O, H, ne);
  let x, ce = !1, q = [], T = [];
  const I = (A) => `${Math.floor(A / 60)}:${Math.floor(A % 60).toString().padStart(2, "0")}`, N = async () => {
    if (typeof window < "u") {
      if (!window.Tone)
        try {
          if (typeof require < "u")
            window.Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js");
          else {
            const A = await import("https://unpkg.com/tone@14.8.49/build/Tone.js");
            window.Tone = A.default || A;
          }
        } catch (A) {
          return console.warn("Could not auto-load Tone.js:", A.message), console.log("To use the player, load Tone.js manually first:"), console.log('Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js")'), !1;
        }
      if (window.Tone)
        return x = window.Tone, x.context.state !== "running" && (await x.start(), console.log("[PLAYER] Audio context started:", x.context.state)), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, m = () => {
    if (!x) return;
    console.log("[PLAYER] Cleaning up existing synths:", q.length, "parts:", T.length), q.forEach((F) => F.dispose()), T.forEach((F) => {
      F.stop(), F.dispose();
    }), q = [], T = [], p.forEach((F) => {
      const { originalTrackIndex: J, voiceIndex: B, totalVoices: M, trackInfo: k, synthConfig: j, partEvents: C } = F, L = y[J] ? y[J].value : j.type;
      let K;
      try {
        const re = j.reason === "glissando_compatibility" ? j.type : L;
        K = new x[re]().toDestination(), j.reason === "glissando_compatibility" && B === 0 && console.warn(`[MULTIVOICE] Using ${re} instead of ${j.original} for glissando in ${k.label}`);
      } catch (re) {
        console.warn(`Failed to create ${L}, using PolySynth:`, re), K = new x.PolySynth().toDestination();
      }
      q.push(K), M > 1 && console.log(`[MULTIVOICE] Track "${k.label}" voice ${B + 1}: ${C.length} notes`), console.log("[PLAYER] Part events array:", C);
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
          const oe = x.Frequency(Q).toFrequency(), ue = x.Frequency(Z).toFrequency(), Te = 1200 * Math.log2(ue / oe);
          if (K.detune && K.detune.setValueAtTime && K.detune.linearRampToValueAtTime)
            K.detune.setValueAtTime(0, re), K.detune.linearRampToValueAtTime(Te, re + G.duration), console.log("[PLAYER] Applied detune glissando:", Te, "cents over", G.duration, "beats");
          else {
            const Ae = x.Frequency(Q).toMidi(), Pe = x.Frequency(Z).toMidi(), be = Math.max(3, Math.abs(Pe - Ae)), je = G.duration / be;
            for (let Se = 1; Se < be; Se++) {
              const Rt = Se / (be - 1), Rn = oe * Math.pow(ue / oe, Rt), Nn = x.Frequency(Rn).toNote(), An = re + Se * je;
              K.triggerAttackRelease(Nn, je * 0.8, An, (G.velocity || 0.8) * 0.7);
            }
            console.log("[PLAYER] Applied chromatic glissando with", be, "steps");
          }
          K.triggerRelease(re + G.duration);
        } else {
          let Q = "C4";
          typeof G.pitch == "number" ? Q = x.Frequency(G.pitch, "midi").toNote() : typeof G.pitch == "string" ? Q = G.pitch : Array.isArray(G.pitch) && typeof G.pitch[0] == "string" && (Q = G.pitch[0]);
          let Z = G.duration, oe = G.velocity || 0.8;
          G.articulation === "staccato" && (Z = G.duration * 0.5), G.articulation === "accent" && (oe = Math.min(oe * 2, 1)), G.articulation === "tenuto" && (Z = G.duration * 1.5, oe = Math.min(oe * 1.3, 1)), console.log("[PLAYER] Single note", { noteName: Q, noteDuration: Z, time: re, noteVelocity: oe }), K.triggerAttackRelease(Q, Z, re, oe);
        }
      }, C);
      ie.start(0), console.log(`[PLAYER] Part created for voice ${B + 1} with ${C.length} notes, started at time 0`), T.push(ie);
    }), console.log("[PLAYER] Total duration from converter:", _, "seconds"), x.Transport.bpm.value = w.tempo;
    const A = 60 / w.tempo, z = _ / A;
    x.Transport.loopEnd = z, console.log("[PLAYER] Transport loop end set to", z, "beats"), x.Transport.loop = !0, x.Transport.stop(), x.Transport.position = 0, console.log("[PLAYER] Transport fully reset - position:", x.Transport.position, "state:", x.Transport.state), Y.textContent = I(_);
  }, S = () => {
    if (x && ce) {
      const A = x.Transport.seconds / _ * 100;
      D.value = Math.min(A, 100), U.textContent = I(x.Transport.seconds), x.Transport.state === "started" && ce ? requestAnimationFrame(S) : x.Transport.state === "stopped" && (x.Transport.seconds = 0, D.value = 0, U.textContent = I(0), ce = !1, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
    }
  };
  return V.addEventListener("click", async () => {
    if (console.log("[PLAYER] Play button clicked, isPlaying:", ce, "Tone available:", !!x), !x)
      if (console.log("[PLAYER] Initializing Tone.js..."), await N())
        m();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    ce ? (console.log("[PLAYER] Stopping transport..."), x.Transport.stop(), ce = !1, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>') : (console.log("[PLAYER] Starting transport..."), q.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), m()), x.Transport.stop(), x.Transport.position = 0, console.log("[PLAYER] Transport state before start:", x.Transport.state), console.log("[PLAYER] Transport position reset to:", x.Transport.position), console.log("[PLAYER] Audio context state:", x.context.state), console.log("[PLAYER] Parts count:", T.length), console.log("[PLAYER] Synths count:", q.length), x.Transport.start(), ce = !0, V.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', S());
  }), D.addEventListener("input", () => {
    if (x && _ > 0) {
      const A = D.value / 100 * _;
      x.Transport.seconds = A, U.textContent = I(A);
    }
  }), R.addEventListener("change", () => {
    const A = parseInt(R.value);
    x && A >= 60 && A <= 240 ? x.Transport.bpm.value = A : R.value = x ? x.Transport.bpm.value : r;
  }), y.forEach((A) => {
    A.addEventListener("change", () => {
      x && q.length > 0 && m();
    });
  }), le.addEventListener("click", () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }), fe.addEventListener("click", () => {
    console.log("WAV download - requires WAV generator implementation");
  }), typeof window < "u" && window.Tone && N().then(() => m()), E;
}
function Gs(s) {
  return new gn().validateAndNormalize(s);
}
function Wt(s) {
  if (!s || typeof s != "object")
    throw console.error("[RENDER] Invalid JMON object:", s), new Error("render() requires a valid JMON object");
  return !s.sequences && !s.tracks && !s.format && console.warn("[RENDER] Object does not appear to be JMON format, attempting normalization"), Tn(s);
}
function Ks(s) {
  const e = Wt(s);
  return setTimeout(() => {
    const t = e.querySelector('button[aria-label="Play"]') || e.querySelector("button");
    t && t.click();
  }, 100), e;
}
function Hs(s) {
  return Wt(s);
}
const Bs = {
  // Core functionality
  render: Wt,
  play: Ks,
  score: Hs,
  validate: Gs,
  // Core formats and players
  createPlayer: Tn,
  // Theory and algorithms
  theory: Ce.theory,
  generative: Ce.generative,
  analysis: Ce.analysis,
  constants: Ce.constants,
  // Utils
  utils: {
    ...Ce.utils,
    JmonValidator: gn
  },
  VERSION: "1.0.0"
};
export {
  Bs as default,
  Bs as jm
};
