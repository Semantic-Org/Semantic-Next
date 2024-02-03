// packages/component/src/styles.js
var scopeStyles = (css, scopeSelector = "") => {
  scopeSelector = scopeSelector.toLowerCase();
  const style = document.createElement("style");
  const scopeRule = (rule, scopeSelector2) => {
    const modifiedSelector = `${scopeSelector2} ${rule.selectorText}`;
    return `${modifiedSelector} { ${rule.style.cssText} }`;
  };
  document.head.appendChild(style);
  style.appendChild(document.createTextNode(css));
  const sheet = style.sheet;
  let modifiedRules = [];
  for (let i5 = 0; i5 < sheet.cssRules.length; i5++) {
    let rule = sheet.cssRules[i5];
    switch (rule.type) {
      case CSSRule.STYLE_RULE:
        modifiedRules.push(scopeRule(rule, scopeSelector));
        break;
      case CSSRule.MEDIA_RULE:
      case CSSRule.SUPPORTS_RULE:
        let scopedInnerRules = [];
        Array.from(rule.cssRules).forEach((innerRule) => {
          scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
        });
        modifiedRules.push(`@${rule.name} ${rule.conditionText} { ${scopedInnerRules.join(" ")} }`);
        break;
      default:
        modifiedRules.push(rule.cssText);
        break;
    }
  }
  document.head.removeChild(style);
  const scopedCSS = modifiedRules.join("\n");
  return scopedCSS;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e6, o6) {
    if (this._$cssResult$ = true, o6 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e6;
  }
  get styleSheet() {
    let t5 = this.o;
    const s6 = this.t;
    if (e && void 0 === t5) {
      const e6 = void 0 !== s6 && 1 === s6.length;
      e6 && (t5 = o.get(s6)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s6, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var S = (s6, o6) => {
  if (e)
    s6.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else
    for (const e6 of o6) {
      const o7 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e6.cssText, s6.appendChild(o7);
    }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e6 = "";
  for (const s6 of t6.cssRules)
    e6 += s6.cssText;
  return r(e6);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s6) => t5;
var u = { toAttribute(t5, s6) {
  switch (s6) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s6) {
  let i5 = t5;
  switch (s6) {
    case Boolean:
      i5 = null !== t5;
      break;
    case Number:
      i5 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t5);
      } catch (t6) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t5, s6) => !i2(t5, s6);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s6 = y) {
    if (s6.state && (s6.attribute = false), this._$Ei(), this.elementProperties.set(t5, s6), !s6.noAccessor) {
      const i5 = Symbol(), r7 = this.getPropertyDescriptor(t5, i5, s6);
      void 0 !== r7 && e2(this.prototype, t5, r7);
    }
  }
  static getPropertyDescriptor(t5, s6, i5) {
    const { get: e6, set: h5 } = r2(this.prototype, t5) ?? { get() {
      return this[s6];
    }, set(t6) {
      this[s6] = t6;
    } };
    return { get() {
      return e6?.call(this);
    }, set(s7) {
      const r7 = e6?.call(this);
      h5.call(this, s7), this.requestUpdate(t5, r7, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s6 = [...h(t6), ...o2(t6)];
      for (const i5 of s6)
        this.createProperty(i5, t6[i5]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s6 = litPropertyMetadata.get(t5);
      if (void 0 !== s6)
        for (const [t6, i5] of s6)
          this.elementProperties.set(t6, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s6] of this.elementProperties) {
      const i5 = this._$Eu(t6, s6);
      void 0 !== i5 && this._$Eh.set(i5, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s6) {
    const i5 = [];
    if (Array.isArray(s6)) {
      const e6 = new Set(s6.flat(1 / 0).reverse());
      for (const s7 of e6)
        i5.unshift(c(s7));
    } else
      void 0 !== s6 && i5.push(c(s6));
    return i5;
  }
  static _$Eu(t5, s6) {
    const i5 = s6.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s6 = this.constructor.elementProperties;
    for (const i5 of s6.keys())
      this.hasOwnProperty(i5) && (t5.set(i5, this[i5]), delete this[i5]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s6, i5) {
    this._$AK(t5, i5);
  }
  _$EC(t5, s6) {
    const i5 = this.constructor.elementProperties.get(t5), e6 = this.constructor._$Eu(t5, i5);
    if (void 0 !== e6 && true === i5.reflect) {
      const r7 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s6, i5.type);
      this._$Em = t5, null == r7 ? this.removeAttribute(e6) : this.setAttribute(e6, r7), this._$Em = null;
    }
  }
  _$AK(t5, s6) {
    const i5 = this.constructor, e6 = i5._$Eh.get(t5);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t6 = i5.getPropertyOptions(e6), r7 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e6, this[e6] = r7.fromAttribute(s6, t6.type), this._$Em = null;
    }
  }
  requestUpdate(t5, s6, i5) {
    if (void 0 !== t5) {
      if (i5 ??= this.constructor.getPropertyOptions(t5), !(i5.hasChanged ?? f)(this[t5], s6))
        return;
      this.P(t5, s6, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t5, s6, i5) {
    this._$AL.has(t5) || this._$AL.set(t5, s6), true === i5.reflect && this._$Em !== t5 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t5);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t7, s7] of this._$Ep)
          this[t7] = s7;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0)
        for (const [s7, i5] of t6)
          true !== i5.wrapped || this._$AL.has(s7) || void 0 === this[s7] || this.P(s7, this[s7], i5);
    }
    let t5 = false;
    const s6 = this._$AL;
    try {
      t5 = this.shouldUpdate(s6), t5 ? (this.willUpdate(s6), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s6)) : this._$EU();
    } catch (s7) {
      throw t5 = false, this._$EU(), s7;
    }
    t5 && this._$AE(s6);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Ej &&= this._$Ej.forEach((t6) => this._$EC(t6, this[t6])), this._$EU();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.4");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${(Math.random() + "").slice(9)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var a2 = Array.isArray;
var u2 = (t5) => a2(t5) || "function" == typeof t5?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t5) => (i5, ...s6) => ({ _$litType$: t5, strings: i5, values: s6 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t5, i5) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i5) : i5;
}
var P = (t5, i5) => {
  const s6 = t5.length - 1, o6 = [];
  let r7, l3 = 2 === i5 ? "<svg>" : "", c6 = f2;
  for (let i6 = 0; i6 < s6; i6++) {
    const s7 = t5[i6];
    let a3, u5, d3 = -1, y3 = 0;
    for (; y3 < s7.length && (c6.lastIndex = y3, u5 = c6.exec(s7), null !== u5); )
      y3 = c6.lastIndex, c6 === f2 ? "!--" === u5[1] ? c6 = v : void 0 !== u5[1] ? c6 = _ : void 0 !== u5[2] ? ($.test(u5[2]) && (r7 = RegExp("</" + u5[2], "g")), c6 = m) : void 0 !== u5[3] && (c6 = m) : c6 === m ? ">" === u5[0] ? (c6 = r7 ?? f2, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c6.lastIndex - u5[2].length, a3 = u5[1], c6 = void 0 === u5[3] ? m : '"' === u5[3] ? g : p2) : c6 === g || c6 === p2 ? c6 = m : c6 === v || c6 === _ ? c6 = f2 : (c6 = m, r7 = void 0);
    const x2 = c6 === m && t5[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c6 === f2 ? s7 + n3 : d3 >= 0 ? (o6.push(a3), s7.slice(0, d3) + e3 + s7.slice(d3) + h2 + x2) : s7 + h2 + (-2 === d3 ? i6 : x2);
  }
  return [C(t5, l3 + (t5[s6] || "<?>") + (2 === i5 ? "</svg>" : "")), o6];
};
var V = class _V {
  constructor({ strings: t5, _$litType$: s6 }, n5) {
    let r7;
    this.parts = [];
    let c6 = 0, a3 = 0;
    const u5 = t5.length - 1, d3 = this.parts, [f5, v3] = P(t5, s6);
    if (this.el = _V.createElement(f5, n5), E.currentNode = this.el.content, 2 === s6) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r7 = E.nextNode()) && d3.length < u5; ) {
      if (1 === r7.nodeType) {
        if (r7.hasAttributes())
          for (const t6 of r7.getAttributeNames())
            if (t6.endsWith(e3)) {
              const i5 = v3[a3++], s7 = r7.getAttribute(t6).split(h2), e6 = /([.?@])?(.*)/.exec(i5);
              d3.push({ type: 1, index: c6, name: e6[2], strings: s7, ctor: "." === e6[1] ? k : "?" === e6[1] ? H : "@" === e6[1] ? I : R }), r7.removeAttribute(t6);
            } else
              t6.startsWith(h2) && (d3.push({ type: 6, index: c6 }), r7.removeAttribute(t6));
        if ($.test(r7.tagName)) {
          const t6 = r7.textContent.split(h2), s7 = t6.length - 1;
          if (s7 > 0) {
            r7.textContent = i3 ? i3.emptyScript : "";
            for (let i5 = 0; i5 < s7; i5++)
              r7.append(t6[i5], l2()), E.nextNode(), d3.push({ type: 2, index: ++c6 });
            r7.append(t6[s7], l2());
          }
        }
      } else if (8 === r7.nodeType)
        if (r7.data === o3)
          d3.push({ type: 2, index: c6 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r7.data.indexOf(h2, t6 + 1)); )
            d3.push({ type: 7, index: c6 }), t6 += h2.length - 1;
        }
      c6++;
    }
  }
  static createElement(t5, i5) {
    const s6 = r3.createElement("template");
    return s6.innerHTML = t5, s6;
  }
};
function N(t5, i5, s6 = t5, e6) {
  if (i5 === w)
    return i5;
  let h5 = void 0 !== e6 ? s6._$Co?.[e6] : s6._$Cl;
  const o6 = c3(i5) ? void 0 : i5._$litDirective$;
  return h5?.constructor !== o6 && (h5?._$AO?.(false), void 0 === o6 ? h5 = void 0 : (h5 = new o6(t5), h5._$AT(t5, s6, e6)), void 0 !== e6 ? (s6._$Co ??= [])[e6] = h5 : s6._$Cl = h5), void 0 !== h5 && (i5 = N(t5, h5._$AS(t5, i5.values), h5, e6)), i5;
}
var S2 = class {
  constructor(t5, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i5 }, parts: s6 } = this._$AD, e6 = (t5?.creationScope ?? r3).importNode(i5, true);
    E.currentNode = e6;
    let h5 = E.nextNode(), o6 = 0, n5 = 0, l3 = s6[0];
    for (; void 0 !== l3; ) {
      if (o6 === l3.index) {
        let i6;
        2 === l3.type ? i6 = new M(h5, h5.nextSibling, this, t5) : 1 === l3.type ? i6 = new l3.ctor(h5, l3.name, l3.strings, this, t5) : 6 === l3.type && (i6 = new L(h5, this, t5)), this._$AV.push(i6), l3 = s6[++n5];
      }
      o6 !== l3?.index && (h5 = E.nextNode(), o6++);
    }
    return E.currentNode = r3, e6;
  }
  p(t5) {
    let i5 = 0;
    for (const s6 of this._$AV)
      void 0 !== s6 && (void 0 !== s6.strings ? (s6._$AI(t5, s6, i5), i5 += s6.strings.length - 2) : s6._$AI(t5[i5])), i5++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i5, s6, e6) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s6, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t5?.nodeType && (t5 = i5.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i5 = this) {
    t5 = N(this, t5, i5), c3(t5) ? t5 === T || null == t5 || "" === t5 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t5 !== this._$AH && t5 !== w && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : u2(t5) ? this.k(t5) : this._(t5);
  }
  S(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.S(t5));
  }
  _(t5) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(r3.createTextNode(t5)), this._$AH = t5;
  }
  $(t5) {
    const { values: i5, _$litType$: s6 } = t5, e6 = "number" == typeof s6 ? this._$AC(t5) : (void 0 === s6.el && (s6.el = V.createElement(C(s6.h, s6.h[0]), this.options)), s6);
    if (this._$AH?._$AD === e6)
      this._$AH.p(i5);
    else {
      const t6 = new S2(e6, this), s7 = t6.u(this.options);
      t6.p(i5), this.T(s7), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i5 = A.get(t5.strings);
    return void 0 === i5 && A.set(t5.strings, i5 = new V(t5)), i5;
  }
  k(t5) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s6, e6 = 0;
    for (const h5 of t5)
      e6 === i5.length ? i5.push(s6 = new _M(this.S(l2()), this.S(l2()), this, this.options)) : s6 = i5[e6], s6._$AI(h5), e6++;
    e6 < i5.length && (this._$AR(s6 && s6._$AB.nextSibling, e6), i5.length = e6);
  }
  _$AR(t5 = this._$AA.nextSibling, i5) {
    for (this._$AP?.(false, true, i5); t5 && t5 !== this._$AB; ) {
      const i6 = t5.nextSibling;
      t5.remove(), t5 = i6;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i5, s6, e6, h5) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e6, this.options = h5, s6.length > 2 || "" !== s6[0] || "" !== s6[1] ? (this._$AH = Array(s6.length - 1).fill(new String()), this.strings = s6) : this._$AH = T;
  }
  _$AI(t5, i5 = this, s6, e6) {
    const h5 = this.strings;
    let o6 = false;
    if (void 0 === h5)
      t5 = N(this, t5, i5, 0), o6 = !c3(t5) || t5 !== this._$AH && t5 !== w, o6 && (this._$AH = t5);
    else {
      const e7 = t5;
      let n5, r7;
      for (t5 = h5[0], n5 = 0; n5 < h5.length - 1; n5++)
        r7 = N(this, e7[s6 + n5], i5, n5), r7 === w && (r7 = this._$AH[n5]), o6 ||= !c3(r7) || r7 !== this._$AH[n5], r7 === T ? t5 = T : t5 !== T && (t5 += (r7 ?? "") + h5[n5 + 1]), this._$AH[n5] = r7;
    }
    o6 && !e6 && this.j(t5);
  }
  j(t5) {
    t5 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === T ? void 0 : t5;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== T);
  }
};
var I = class extends R {
  constructor(t5, i5, s6, e6, h5) {
    super(t5, i5, s6, e6, h5), this.type = 5;
  }
  _$AI(t5, i5 = this) {
    if ((t5 = N(this, t5, i5, 0) ?? T) === w)
      return;
    const s6 = this._$AH, e6 = t5 === T && s6 !== T || t5.capture !== s6.capture || t5.once !== s6.once || t5.passive !== s6.passive, h5 = t5 !== T && (s6 === T || e6);
    e6 && this.element.removeEventListener(this.name, this, s6), h5 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var L = class {
  constructor(t5, i5, s6) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s6;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N(this, t5);
  }
};
var z = { P: e3, A: h2, C: o3, M: 1, L: P, R: S2, D: u2, V: N, I: M, H: R, N: H, U: I, B: k, F: L };
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.2");
var j = (t5, i5, s6) => {
  const e6 = s6?.renderBefore ?? i5;
  let h5 = e6._$litPart$;
  if (void 0 === h5) {
    const t6 = s6?.renderBefore ?? null;
    e6._$litPart$ = h5 = new M(i5.insertBefore(l2(), t6), t6, void 0, s6 ?? {});
  }
  return h5._$AI(t5), h5;
};

// node_modules/lit-element/lit-element.js
var s3 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t5 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t5.firstChild, t5;
  }
  update(t5) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = j(i5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return w;
  }
};
s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
var r4 = globalThis.litElementPolyfillSupport;
r4?.({ LitElement: s3 });
(globalThis.litElementVersions ??= []).push("4.0.4");

// packages/utils/src/utils.js
var fatal = (message, {
  errorType = Error,
  metadata = {},
  onError = null,
  removeStackLines = 1
} = {}) => {
  const error = new errorType(message);
  Object.assign(error, metadata);
  if (error.stack) {
    const stackLines = error.stack.split("\n");
    stackLines.splice(1, removeStackLines);
    error.stack = stackLines.join("\n");
  }
  const throwError = () => {
    if (typeof onError === "function") {
      onError(error);
    }
    throw error;
  };
  if (typeof queueMicrotask === "function") {
    queueMicrotask(throwError);
  } else {
    setTimeout(throwError, 0);
  }
};
var isObject = (x2) => {
  return typeof x2 == "object";
};
var isString = (x2) => {
  return typeof x2 == "string";
};
var isArray = (x2) => {
  return Array.isArray(x2);
};
var isBinary = (x2) => {
  return !!(typeof Uint8Array !== "undefined" && x2 instanceof Uint8Array);
};
var isFunction = (x2) => {
  return typeof x2 == "function" || false;
};
var isArguments = function(obj) {
  return !!(obj && get(obj, "callee"));
};
var formatDate = function(date, format) {
  const pad = (n5) => n5 < 10 ? "0" + n5 : n5;
  const dateMap = {
    "YYYY": date.getFullYear(),
    "YY": date.getFullYear().toString().slice(-2),
    "MMMM": date.toLocaleString("default", { month: "long" }),
    "MMM": date.toLocaleString("default", { month: "short" }),
    "MM": pad(date.getMonth() + 1),
    "M": date.getMonth() + 1,
    "DD": pad(date.getDate()),
    "D": date.getDate(),
    "Do": date.getDate() + ["th", "st", "nd", "rd"][((date.getDate() + 90) % 100 - 10) % 10 - 1] || "th",
    "dddd": date.toLocaleString("default", { weekday: "long" }),
    "ddd": date.toLocaleString("default", { weekday: "short" }),
    "HH": pad(date.getHours()),
    "h": date.getHours() % 12 || 12,
    "mm": pad(date.getMinutes()),
    "ss": pad(date.getSeconds()),
    "a": date.getHours() >= 12 ? "pm" : "am"
  };
  const formatMap = {
    "LT": "h:mm a",
    "LTS": "h:mm:ss a",
    "L": "MM/DD/YYYY",
    "l": "M/D/YYYY",
    "LL": "MMMM D, YYYY",
    "ll": "MMM D, YYYY",
    "LLL": "MMMM D, YYYY h:mm a",
    "lll": "MMM D, YYYY h:mm a",
    "LLLL": "dddd, MMMM D, YYYY h:mm a",
    "llll": "ddd, MMM D, YYYY h:mm a"
  };
  const expandedFormat = formatMap[format] || format;
  return expandedFormat.replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|h|mm|ss|a)\b/g, (match) => {
    return dateMap[match];
  }).replace(/\[(.*?)\]/g, (match, p1) => p1);
};
var noop = function() {
};
var wrapFunction = (x2) => {
  return isFunction(x2) ? x2 : () => x2;
};
var kebabToCamel = (str = "") => {
  return str.replace(/-./g, (m3) => m3[1].toUpperCase());
};
var toTitleCase = (str = "") => {
  return str.replace(/\b(\w)/g, (match, capture) => capture.toUpperCase()).replace(/\b(\w+)\b/g, (match) => match.toLowerCase()).replace(/\b(\w)/g, (match) => match.toUpperCase());
};
var unique = (arr) => {
  return Array.from(new Set(arr));
};
var last = function(array, n5, guard) {
  if (!Array.isArray(array)) {
    return;
  }
  if (!n5 || guard) {
    return array[array.length - 1];
  } else {
    return slice.call(array, Math.max(array.length - n5, 0));
  }
};
var keys = (obj) => {
  return Object.keys(obj);
};
var mapObject = function(obj, callback) {
  const objKeys = keys(obj).reverse();
  const length = objKeys.length;
  let index = objKeys.length;
  let newObj = {};
  while (index--) {
    const thisKey = objKeys[index];
    newObj[thisKey] = callback(obj[thisKey], thisKey);
  }
  return newObj;
};
var extend = (obj, ...sources) => {
  sources.forEach((source) => {
    let descriptor, prop;
    if (source) {
      for (prop in source) {
        descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (descriptor === void 0) {
          obj[prop] = source[prop];
        } else {
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
};
var get = function(obj, string = "") {
  string = string.replace(/^\./, "").replace(/\[(\w+)\]/g, ".$1");
  const stringParts = string.split(".");
  for (let index = 0, length = stringParts.length; index < length; ++index) {
    const part = stringParts[index];
    if (!!obj && part in obj) {
      obj = obj[part];
    } else {
      return;
    }
  }
  return obj;
};
var hasProperty = (obj, prop) => {
  return Object.hasOwn.call(obj, prop);
};
var reverseKeys = (obj) => {
  const newObj = {};
  const pushValue = (key, value) => {
    if (isArray(newObj[key])) {
      newObj[key].push(value);
    } else if (newObj[key]) {
      newObj[key] = [newObj[key], value];
    } else {
      newObj[key] = value;
    }
  };
  Object.keys(obj).forEach((key) => {
    if (isArray(obj[key])) {
      each(obj[key], (subKey) => {
        pushValue(subKey, key);
      });
    } else {
      pushValue(obj[key], key);
    }
  });
  return newObj;
};
var clone = (obj) => {
  let ret;
  if (!isObject(obj)) {
    return obj;
  }
  if (obj === null) {
    return null;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(clone);
  }
  if (isArguments(obj)) {
    return Array.from(obj).map(clone);
  }
  if (isFunction(obj.clone)) {
    return obj.clone();
  }
  ret = {};
  keys(obj).forEach((key) => {
    ret[key] = clone(obj[key]);
  });
  return ret;
};
var each = (obj, func, context) => {
  if (obj === null) {
    return obj;
  }
  let createCallback = (context2, func2) => {
    if (context2 === void 0) {
      return func2;
    } else {
      return (value, index, collection) => {
        return func2.call(context2, value, index, collection);
      };
    }
  };
  let iteratee = createCallback(context, func);
  let i5;
  if (obj.length === +obj.length) {
    for (i5 = 0; i5 < obj.length; ++i5) {
      iteratee(obj[i5], i5, obj);
    }
  } else {
    let objKeys = keys(obj);
    for (i5 = 0; i5 < objKeys.length; ++i5) {
      iteratee(obj[objKeys[i5]], objKeys[i5], obj);
    }
  }
  return obj;
};
var escapeRegExp = function(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};
function hashCode(input) {
  let str;
  if (input && input.toString === Object.prototype.toString && typeof input === "object") {
    try {
      str = JSON.stringify(input);
    } catch (error) {
      console.error("Error serializing input", error);
      return 0;
    }
  } else {
    str = input.toString();
  }
  const seed = 305419896;
  const murmurhash = (key, seed2) => {
    let remainder, bytes, h1, h1b, c1, c1b, c22, c2b, k1, i5;
    remainder = key.length & 3;
    bytes = key.length - remainder;
    h1 = seed2;
    c1 = 3432918353;
    c22 = 461845907;
    i5 = 0;
    while (i5 < bytes) {
      k1 = key.charCodeAt(i5) & 255 | (key.charCodeAt(++i5) & 255) << 8 | (key.charCodeAt(++i5) & 255) << 16 | (key.charCodeAt(++i5) & 255) << 24;
      ++i5;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c22 + (((k1 >>> 16) * c22 & 65535) << 16) & 4294967295;
      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
      h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
    }
    k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i5 + 2) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(i5 + 1) & 255) << 8;
      case 1:
        k1 ^= key.charCodeAt(i5) & 255;
        k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = (k1 & 65535) * c22 + (((k1 >>> 16) * c22 & 65535) << 16) & 4294967295;
        h1 ^= k1;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
  };
  const prettify = (num) => {
    if (num === 0)
      return "0";
    let result = "";
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (num > 0) {
      result = chars[num % chars.length] + result;
      num = Math.floor(num / chars.length);
    }
    return result;
  };
  let hash;
  hash = murmurhash(str, seed);
  hash = prettify(hash);
  return hash;
}
var isEqual = (a3, b3, options) => {
  let i5;
  const keyOrderSensitive = !!(options && options.keyOrderSensitive);
  if (a3 === b3) {
    return true;
  }
  if (Number.isNaN(a3) && Number.isNaN(b3)) {
    return true;
  }
  if (!a3 || !b3) {
    return false;
  }
  if (!(isObject(a3) && isObject(b3))) {
    return false;
  }
  if (a3 instanceof Date && b3 instanceof Date) {
    return a3.valueOf() === b3.valueOf();
  }
  if (isBinary(a3) && isBinary(b3)) {
    if (a3.length !== b3.length) {
      return false;
    }
    for (i5 = 0; i5 < a3.length; i5++) {
      if (a3[i5] !== b3[i5]) {
        return false;
      }
    }
    return true;
  }
  if (isFunction(a3.equals)) {
    return a3.equals(b3, options);
  }
  if (isFunction(b3.equals)) {
    return b3.equals(a3, options);
  }
  if (a3 instanceof Array) {
    if (!(b3 instanceof Array)) {
      return false;
    }
    if (a3.length !== b3.length) {
      return false;
    }
    for (i5 = 0; i5 < a3.length; i5++) {
      if (!isEqual(a3[i5], b3[i5], options)) {
        return false;
      }
    }
    return true;
  }
  let ret;
  const aKeys = keys(a3);
  const bKeys = keys(b3);
  if (keyOrderSensitive) {
    i5 = 0;
    ret = aKeys.every((key) => {
      if (i5 >= bKeys.length) {
        return false;
      }
      if (key !== bKeys[i5]) {
        return false;
      }
      if (!isEqual(a3[key], b3[bKeys[i5]], options)) {
        return false;
      }
      i5++;
      return true;
    });
  } else {
    i5 = 0;
    ret = aKeys.every((key) => {
      if (!hasProperty(b3, key)) {
        return false;
      }
      if (!isEqual(a3[key], b3[key], options)) {
        return false;
      }
      i5++;
      return true;
    });
  }
  return ret && i5 === bKeys.length;
};

// packages/templating/src/scanner.js
var Scanner = class _Scanner {
  static DEBUG_MODE = true;
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.runCount = 0;
  }
  matches(regex) {
    return regex.test(this.rest());
  }
  rest() {
    return this.input.slice(this.pos);
  }
  isEOF() {
    this.runCount++;
    return this.pos >= this.input.length;
  }
  // get character at current position
  peek() {
    return this.input.charAt(this.pos);
  }
  consume(pattern) {
    const regex = typeof pattern === "string" ? new RegExp(escapeRegExp(pattern)) : new RegExp(pattern);
    const substring = this.input.substring(this.pos);
    const match = regex.exec(substring);
    if (match && match.index === 0) {
      this.pos += match[0].length;
      return match[0];
    }
    return null;
  }
  consumeUntil(pattern) {
    const regex = typeof pattern === "string" ? new RegExp(escapeRegExp(pattern)) : new RegExp(pattern);
    const match = regex.exec(this.input.substring(this.pos));
    if (!match) {
      const consumedText2 = this.input.substr(this.pos);
      this.pos = this.input.length;
      return consumedText2;
    }
    const consumedText = this.input.substring(this.pos, this.pos + match.index);
    this.pos += match.index;
    return consumedText;
  }
  returnTo(pattern) {
    if (!pattern) {
      return;
    }
    const regex = typeof pattern === "string" ? new RegExp(escapeRegExp(pattern), "gm") : new RegExp(pattern, "gm");
    let lastMatch = null;
    let match;
    const substring = this.input.substring(0, this.pos);
    while ((match = regex.exec(substring)) !== null) {
      lastMatch = match;
    }
    if (lastMatch) {
      const consumedText = this.input.substring(0, lastMatch.index);
      this.pos = lastMatch.index;
      return consumedText;
    }
    return;
  }
  fatal(msg) {
    msg = msg || "Parse error";
    const lines = this.input.split("\n");
    let lineNumber = 0;
    let charCount = 0;
    for (const line of lines) {
      if (charCount + line.length + 1 > this.pos) {
        break;
      }
      charCount += line.length + 1;
      lineNumber++;
    }
    const linesBefore = 5;
    const linesAfter = 5;
    const startLine = Math.max(0, lineNumber - linesBefore);
    const endLine = Math.min(lines.length, lineNumber + linesAfter + 1);
    const contextLines = lines.slice(startLine, endLine);
    const consoleMsg = contextLines.map((line, idx) => {
      const isErrLine = lineNumber - startLine === idx;
      return `%c${line}`;
    }).join("\n");
    const normalStyle = "color: grey";
    const errorStyle = "color: red; font-weight: bold";
    if (_Scanner.DEBUG_MODE && document.body) {
      let errorHTML = "";
      each(contextLines, (line, index) => {
        const style = index < linesBefore || index > linesBefore ? normalStyle : errorStyle;
        errorHTML += `<div style="${style}">${line}</div>`;
      });
      const html = `
        <div style="padding: 1rem; font-size: 14px;">
          <h2>Could not render template</h2>
          <h3>${msg}</h3>
          <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${errorHTML}</pre></code>
        </div>
      `;
      document.body.innerHTML = html;
    }
    console.error(
      msg + "\n" + consoleMsg,
      ...contextLines.map((_2, idx) => lineNumber - startLine === idx ? errorStyle : normalStyle)
    );
    const e6 = new Error(msg);
    throw e6;
  }
};

// packages/templating/src/compiler.js
var TemplateCompiler = class _TemplateCompiler {
  constructor(template) {
    this.template = template || "";
  }
  static tagRegExp = {
    IF: /^{{\s*#if\s+/,
    ELSEIF: /^{{\s*else\s*if\s+/,
    ELSE: /^{{\s*else\s*/,
    EACH: /^{{\s*#each\s+/,
    CLOSE_IF: /^{{\s*\/(if)\s*/,
    CLOSE_EACH: /^{{\s*\/(each)\s*/,
    SLOT: /^{{\s*slot\s*/,
    TEMPLATE: /^{{>\s*/,
    HTML_EXPRESSION: /^{{{\s*/,
    EXPRESSION: /^{{\s*/
  };
  static templateRegExp = {
    verbose: {
      keyword: /^template\W/g,
      properties: /(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms
    },
    standard: /(\w.*?)($|\s)/mg,
    dataObject: /(\w+)\s*:\s*([^,}]+)/g
    // parses { one: 'two' }
  };
  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  compile(template = this.template) {
    template = template.trim();
    const scanner = new Scanner(template);
    const tagRegExp = _TemplateCompiler.tagRegExp;
    const parseTag = (scanner2) => {
      for (let type in tagRegExp) {
        if (scanner2.matches(tagRegExp[type])) {
          scanner2.consume(tagRegExp[type]);
          const content = this.getValue(scanner2.consumeUntil("}}").trim());
          scanner2.consume("}}");
          return { type, content };
        }
      }
      return null;
    };
    const ast = [];
    const stack = [];
    let contentBranch = null;
    let conditionStack = [];
    let contentStack = [];
    while (!scanner.isEOF()) {
      const tag = parseTag(scanner);
      const lastNode = last(stack);
      const conditionTarget = last(conditionStack);
      const contentTarget = contentBranch?.content || lastNode || ast;
      if (tag) {
        let newNode = {
          type: tag.type.toLowerCase()
        };
        switch (tag.type) {
          case "IF":
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
              branches: []
            };
            contentTarget.push(newNode);
            conditionStack.push(newNode);
            contentStack.push(newNode);
            contentBranch = newNode;
            break;
          case "ELSEIF":
            newNode = {
              ...newNode,
              condition: tag.content,
              content: []
            };
            if (!conditionTarget) {
              scanner.returnTo(starts.ELSEIF);
              scanner.fatal("{{elseif}} encountered without matching if condition");
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;
          case "ELSE":
            newNode = {
              ...newNode,
              content: []
            };
            if (!conditionTarget) {
              scanner.returnTo(starts.ELSE);
              scanner.fatal("{{else}} encountered without matching if condition");
              break;
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;
          case "HTML_EXPRESSION":
            newNode = {
              ...newNode,
              type: "expression",
              unsafeHTML: true,
              value: tag.content
            };
            contentTarget.push(newNode);
            scanner.consume("}");
            break;
          case "EXPRESSION":
            newNode = {
              ...newNode,
              value: tag.content
            };
            contentTarget.push(newNode);
            break;
          case "TEMPLATE":
            const templateInfo = this.parseTemplateString(tag.content);
            newNode = {
              ...newNode,
              ...templateInfo
            };
            contentTarget.push(newNode);
            break;
          case "SLOT":
            newNode = {
              ...newNode,
              name: tag.content
            };
            contentTarget.push(newNode);
            break;
          case "CLOSE_IF":
            if (conditionStack.length == 0) {
              scanner.returnTo(starts.CLOSE_IF);
              scanner.fatal("{{/if}} close tag found without open if tag");
            }
            stack.pop();
            contentStack.pop();
            conditionStack.pop();
            contentBranch = last(contentStack);
            break;
          case "EACH":
            const contentParts = tag.content.split(" in ");
            let iterateOver;
            let iterateAs;
            if (contentParts.length > 1) {
              iterateAs = contentParts[0].trim();
              iterateOver = contentParts[1].trim();
            } else {
              iterateOver = contentParts[0].trim();
            }
            newNode = {
              ...newNode,
              as: iterateAs,
              over: iterateOver,
              content: []
            };
            contentTarget.push(newNode);
            contentBranch = newNode;
            break;
          case "CLOSE_EACH":
            stack.pop();
            contentBranch = last(contentStack);
            break;
        }
      } else {
        const OPEN_TAG = /\{\{/;
        const html = scanner.consumeUntil(OPEN_TAG);
        if (html) {
          const htmlNode = { type: "html", html };
          contentTarget.push(htmlNode);
        }
      }
    }
    return ast;
  }
  getValue(expression) {
    if (expression == "true") {
      return true;
    } else if (expression == "false") {
      return false;
    } else if (!Number.isNaN(parseFloat(expression, 10))) {
      return +expression;
    }
    return expression;
  }
  parseTemplateString(expression = "") {
    const regExp = _TemplateCompiler.templateRegExp;
    let templateInfo = {};
    if (regExp.verbose.keyword.exec(expression)) {
      const matches = [...expression.matchAll(regExp.verbose.properties)];
      each(matches, (match, index) => {
        const property = match[1];
        const value = this.getObjectFromString(match[2]);
        templateInfo[property] = value;
      });
    } else {
      let data = {};
      const matches = [...expression.matchAll(regExp.standard)];
      each(matches, (match, index) => {
        if (index == 0) {
          templateInfo.name = `'${match[0].trim()}'`;
        } else {
          const parts = match[0].split("=");
          if (parts.length) {
            let name = parts[0].trim();
            let value = parts[1].trim();
            data[name] = value;
          }
        }
      });
      templateInfo.data = data;
    }
    return templateInfo;
  }
  getObjectFromString(objectString = "") {
    const regex = _TemplateCompiler.templateRegExp.dataObject;
    const obj = {};
    let match;
    let isObject2 = false;
    while ((match = regex.exec(objectString)) !== null) {
      isObject2 = true;
      obj[match[1]] = match[2].trim();
    }
    return isObject2 ? obj : objectString.trim();
  }
};

// node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t5) => (...e6) => ({ _$litDirective$: t5, values: e6 });
var i4 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e6, i5) {
    this._$Ct = t5, this._$AM = e6, this._$Ci = i5;
  }
  _$AS(t5, e6) {
    return this.update(t5, e6);
  }
  update(t5, e6) {
    return this.render(...e6);
  }
};

// node_modules/lit-html/directive-helpers.js
var { I: t4 } = z;
var f3 = (o6) => void 0 === o6.strings;
var s4 = () => document.createComment("");
var r5 = (o6, i5, n5) => {
  const e6 = o6._$AA.parentNode, l3 = void 0 === i5 ? o6._$AB : i5._$AA;
  if (void 0 === n5) {
    const i6 = e6.insertBefore(s4(), l3), c6 = e6.insertBefore(s4(), l3);
    n5 = new t4(i6, c6, o6, o6.options);
  } else {
    const t5 = n5._$AB.nextSibling, i6 = n5._$AM, c6 = i6 !== o6;
    if (c6) {
      let t6;
      n5._$AQ?.(o6), n5._$AM = o6, void 0 !== n5._$AP && (t6 = o6._$AU) !== i6._$AU && n5._$AP(t6);
    }
    if (t5 !== l3 || c6) {
      let o7 = n5._$AA;
      for (; o7 !== t5; ) {
        const t6 = o7.nextSibling;
        e6.insertBefore(o7, l3), o7 = t6;
      }
    }
  }
  return n5;
};
var v2 = (o6, t5, i5 = o6) => (o6._$AI(t5, i5), o6);
var u3 = {};
var m2 = (o6, t5 = u3) => o6._$AH = t5;
var p3 = (o6) => o6._$AH;
var h3 = (o6) => {
  o6._$AP?.(false, true);
  let t5 = o6._$AA;
  const i5 = o6._$AB.nextSibling;
  for (; t5 !== i5; ) {
    const o7 = t5.nextSibling;
    t5.remove(), t5 = o7;
  }
};

// node_modules/lit-html/async-directive.js
var s5 = (i5, t5) => {
  const e6 = i5._$AN;
  if (void 0 === e6)
    return false;
  for (const i6 of e6)
    i6._$AO?.(t5, false), s5(i6, t5);
  return true;
};
var o4 = (i5) => {
  let t5, e6;
  do {
    if (void 0 === (t5 = i5._$AM))
      break;
    e6 = t5._$AN, e6.delete(i5), i5 = t5;
  } while (0 === e6?.size);
};
var r6 = (i5) => {
  for (let t5; t5 = i5._$AM; i5 = t5) {
    let e6 = t5._$AN;
    if (void 0 === e6)
      t5._$AN = e6 = /* @__PURE__ */ new Set();
    else if (e6.has(i5))
      break;
    e6.add(i5), c4(t5);
  }
};
function h4(i5) {
  void 0 !== this._$AN ? (o4(this), this._$AM = i5, r6(this)) : this._$AM = i5;
}
function n4(i5, t5 = false, e6 = 0) {
  const r7 = this._$AH, h5 = this._$AN;
  if (void 0 !== h5 && 0 !== h5.size)
    if (t5)
      if (Array.isArray(r7))
        for (let i6 = e6; i6 < r7.length; i6++)
          s5(r7[i6], false), o4(r7[i6]);
      else
        null != r7 && (s5(r7, false), o4(r7));
    else
      s5(this, i5);
}
var c4 = (i5) => {
  i5.type == t3.CHILD && (i5._$AP ??= n4, i5._$AQ ??= h4);
};
var f4 = class extends i4 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i5, t5, e6) {
    super._$AT(i5, t5, e6), r6(this), this.isConnected = i5._$AU;
  }
  _$AO(i5, t5 = true) {
    i5 !== this.isConnected && (this.isConnected = i5, i5 ? this.reconnected?.() : this.disconnected?.()), t5 && (s5(this, i5), o4(this));
  }
  setValue(t5) {
    if (f3(this._$Ct))
      this._$Ct._$AI(t5, this);
    else {
      const i5 = [...this._$Ct._$AH];
      i5[this._$Ci] = t5, this._$Ct._$AI(i5, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};

// packages/reactivity/src/dependency.js
var Dependency = class {
  constructor() {
    this.subscribers = /* @__PURE__ */ new Set();
  }
  depend() {
    if (Reaction.current) {
      this.subscribers.add(Reaction.current);
      Reaction.current.dependencies.add(this);
    }
  }
  changed() {
    this.subscribers.forEach((subscriber) => subscriber.invalidate());
  }
  cleanUp(reaction) {
    this.subscribers.delete(reaction);
  }
  unsubscribe(reaction) {
    this.subscribers.delete(reaction);
  }
};

// packages/reactivity/src/reaction.js
var Reaction = class _Reaction {
  static current = null;
  static pendingReactions = /* @__PURE__ */ new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;
  static create(callback) {
    const reaction = new _Reaction(callback);
    reaction.run();
    return reaction;
  }
  static scheduleFlush() {
    if (!_Reaction.isFlushScheduled) {
      _Reaction.isFlushScheduled = true;
      if (typeof queueMicrotask === "function") {
        queueMicrotask(() => _Reaction.flush());
      } else {
        Promise.resolve().then(() => _Reaction.flush());
      }
    }
  }
  static flush() {
    _Reaction.isFlushScheduled = false;
    _Reaction.pendingReactions.forEach((reaction) => reaction.run());
    _Reaction.pendingReactions.clear();
    _Reaction.afterFlushCallbacks.forEach((callback) => callback());
    _Reaction.afterFlushCallbacks = [];
  }
  static afterFlush(callback) {
    _Reaction.afterFlushCallbacks.push(callback);
  }
  constructor(callback) {
    this.callback = callback;
    this.dependencies = /* @__PURE__ */ new Set();
    this.boundRun = this.run.bind(this);
    this.firstRun = true;
    this.active = true;
  }
  run() {
    if (!this.active) {
      return;
    }
    _Reaction.current = this;
    this.dependencies.forEach((dep) => dep.cleanUp(this));
    this.dependencies.clear();
    this.callback(this);
    this.firstRun = false;
    _Reaction.current = null;
    _Reaction.pendingReactions.delete(this);
  }
  invalidate() {
    this.active = true;
    _Reaction.pendingReactions.add(this);
    _Reaction.scheduleFlush();
  }
  stop() {
    if (!this.active)
      return;
    this.active = false;
    this.dependencies.forEach((dep) => dep.unsubscribe(this));
  }
  /*
    Makes sure anything called inside this function does not trigger reactions
  */
  static nonreactive(func) {
    const previousReaction = _Reaction.current;
    _Reaction.current = null;
    try {
      return func();
    } finally {
      _Reaction.current = previousReaction;
    }
  }
  /*
    Makes sure function doesnt rerun when values dont change
  */
  static guard(f5) {
    if (!_Reaction.current) {
      return f5();
    }
    let dep = new Dependency();
    let value, newValue;
    const comp = new _Reaction(() => {
      newValue = f5();
      if (!comp.firstRun && !isEqual(newValue, value)) {
        console.log("dep changed", value);
        dep.changed();
      }
      value = clone(newValue);
    });
    comp.run();
    dep.depend();
    return value;
  }
};

// packages/reactivity/src/reactive-var.js
var ReactiveVar = class _ReactiveVar {
  constructor(initialValue, equalityFunction) {
    this.currentValue = clone(initialValue);
    this.dependency = new Dependency();
    this.equalityFunction = equalityFunction || _ReactiveVar.equalityFunction;
  }
  static equalityFunction = (a3, b3) => {
    return isEqual(a3, b3);
  };
  get value() {
    this.dependency.depend();
    const value = this.currentValue;
    return Array.isArray(value) || typeof value == "object" ? clone(value) : value;
  }
  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = clone(newValue);
      this.dependency.changed();
    }
  }
  get() {
    return this.value;
  }
  set(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.value = newValue;
      this.dependency.changed();
    }
  }
  subscribe(callback) {
    const reaction = Reaction.create(() => {
      callback(this._value);
    });
    return () => reaction.stop();
  }
  peek() {
    const currentReaction = Reaction.current;
    Reaction.current = null;
    const value = this._value;
    Reaction.current = currentReaction;
    return value;
  }
  addListener(listener) {
    this._listeners.add(listener);
  }
  removeListener(listener) {
    this._listeners.delete(listener);
  }
  // array helpers
  push(value) {
    let arr = this.value;
    arr.push(value);
    this.set(arr);
  }
  unshift(value) {
    let arr = this.value;
    arr.unshift(value);
    this.set(arr);
  }
  splice(...args) {
    let arr = this.value;
    arr.splice(...args);
    this.set(arr);
  }
  setItem(index, value) {
    let arr = this.value;
    arr[index] = value;
    this.set(arr);
  }
  removeItem(index) {
    let arr = this.value;
    arr.splice(index, 1);
    this.set(arr);
  }
  toggle() {
    return this.set(!this.value);
  }
};

// packages/templating/src/watch.js
var WatchDirective = class extends f4 {
  __reactiveVar;
  __dispose = function() {
  };
  render(reactiveVar) {
    if (!reactiveVar) {
      return;
    }
    if (reactiveVar !== this.__reactiveVar) {
      this.__dispose?.();
      this.__reactiveVar = reactiveVar;
      let updateFromLit = true;
      this.__dispose = reactiveVar.subscribe((value) => {
        if (updateFromLit === false) {
          this.setValue(value);
        }
      });
      updateFromLit = false;
    }
    return reactiveVar.peek();
  }
  disconnected() {
    this.__dispose?.();
  }
  reconnected() {
    this.__dispose = this.__reactiveVar?.subscribe((value) => {
      this.setValue(value);
    });
  }
};
var watch = e4(WatchDirective);

// packages/query/src/query.js
var Query = class _Query {
  constructor(selector, root = document) {
    let elements = [];
    if (!selector) {
      return;
    }
    if (Array.isArray(selector)) {
      elements = selector;
    } else if (typeof selector === "string") {
      elements = root.querySelectorAll(selector);
    } else if (selector instanceof Element || selector instanceof Document || selector === window || selector instanceof DocumentFragment) {
      elements = [selector];
    } else if (selector instanceof NodeList) {
      elements = selector;
    }
    this.length = elements.length;
    Object.assign(this, elements);
  }
  find(selector) {
    const elements = Array.from(this).flatMap((el) => Array.from(el.querySelectorAll(selector)));
    return new _Query(elements);
  }
  parent(selector) {
    const parents = Array.from(this).map((el) => el.parentElement).filter(Boolean);
    return selector ? new _Query(parents).filter(selector) : new _Query(parents);
  }
  children(selector) {
    const allChildren = Array.from(this).flatMap((el) => Array.from(el.children));
    const filteredChildren = selector ? allChildren.filter((child) => child.matches(selector)) : allChildren;
    return new _Query(filteredChildren);
  }
  filter(selectorOrFunction) {
    let filteredElements = [];
    if (typeof selectorOrFunction === "string") {
      filteredElements = Array.from(this).filter((el) => el.matches(selectorOrFunction));
    } else if (typeof selectorOrFunction === "function") {
      filteredElements = Array.from(this).filter(selectorOrFunction);
    }
    return new _Query(filteredElements);
  }
  not(selector) {
    const filteredElements = Array.from(this).filter((el) => !el.matches(selector));
    return new _Query(filteredElements);
  }
  closest(selector) {
    const closest = Array.from(this).map((el) => el.closest(selector)).filter(Boolean);
    return new _Query(closest);
  }
  // uses abort signals <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
  on(event, targetSelectorOrHandler, handler, abortController = new AbortController()) {
    this._eventHandlers = this._eventHandlers || [];
    const eventHandlers = [];
    const signal = abortController.signal;
    Array.from(this).forEach((el) => {
      const eventListener = (e6) => {
        if (typeof targetSelectorOrHandler === "function") {
          targetSelectorOrHandler.call(el, e6);
        } else {
          for (let target = e6.target; target && target !== el; target = target.parentNode) {
            if (target.matches(targetSelectorOrHandler)) {
              handler.call(target, e6);
              break;
            }
          }
        }
      };
      el.addEventListener(event, eventListener, { signal });
      const eventHandler = {
        el,
        event,
        eventListener,
        abortController,
        delegated: typeof targetSelectorOrHandler === "string",
        originalHandler: handler
      };
      eventHandlers.push(eventHandler);
    });
    this._eventHandlers.push(...eventHandlers);
    return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
  }
  off(event, handler) {
    if (this._eventHandlers) {
      this._eventHandlers = this._eventHandlers.filter((eventHandler) => {
        if (eventHandler.event === event && (!handler || eventHandler.handler === handler || eventHandler.originalHandler === handler)) {
          eventHandler.el.removeEventListener(event, eventHandler.handler);
          return false;
        }
        return true;
      });
    }
    return this;
  }
  remove() {
    Array.from(this).forEach((el) => el.remove());
    return this;
  }
  addClass(classNames) {
    const classesToAdd = classNames.split(" ");
    Array.from(this).forEach((el) => el.classList.add(...classesToAdd));
    return this;
  }
  removeClass(classNames) {
    const classesToRemove = classNames.split(" ");
    Array.from(this).forEach((el) => el.classList.remove(...classesToRemove));
    return this;
  }
  html(newHTML) {
    if (newHTML !== void 0) {
      Array.from(this).forEach((el) => el.innerHTML = newHTML);
      return this;
    } else if (this.length) {
      return this[0].innerHTML;
    }
  }
  outerHTML(newHTML) {
    if (newHTML !== void 0) {
      Array.from(this).forEach((el) => el.outerHTML = newHTML);
      return this;
    } else if (this.length) {
      return this[0].outerHTML;
    }
  }
  text(newText) {
    if (newText !== void 0) {
      Array.from(this).forEach((el) => el.textContent = newText);
      return this;
    } else {
      return Array.from(this).map((el) => this.getTextContentRecursive(el.childNodes)).join("");
    }
  }
  value(newValue) {
    if (newValue !== void 0) {
      Array.from(this).forEach((el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
          el.value = newValue;
        }
      });
      return this;
    } else {
      return Array.from(this).map((el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
          return el.value;
        }
        return void 0;
      });
    }
  }
  // alias
  val(...args) {
    return this.value(...args);
  }
  // Helper function to recursively get text content
  getTextContentRecursive(nodes) {
    return Array.from(nodes).map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
      } else if (node.nodeName === "SLOT") {
        const slotNodes = node.assignedNodes({ flatten: true });
        return this.getTextContentRecursive(slotNodes);
      } else {
        return this.getTextContentRecursive(node.childNodes);
      }
    }).join("");
  }
  css(property, value) {
    if (typeof property === "object") {
      Object.entries(property).forEach(([prop, val]) => {
        Array.from(this).forEach((el) => el.style[prop] = val);
      });
    } else if (value !== void 0) {
      Array.from(this).forEach((el) => el.style[property] = value);
    } else if (this.length) {
      return this[0].style[property];
    }
    return this;
  }
  attr(attribute, value) {
    if (typeof attribute === "object") {
      Object.entries(attribute).forEach(([attr, val]) => {
        Array.from(this).forEach((el) => el.setAttribute(attr, val));
      });
    } else if (value !== void 0) {
      Array.from(this).forEach((el) => el.setAttribute(attribute, value));
    } else if (this.length) {
      return this[0].getAttribute(attribute);
    }
    return this;
  }
  removeAttr(attributeName) {
    Array.from(this).forEach((el) => el.removeAttribute(attributeName));
    return this;
  }
  each(callback) {
    Array.from(this).forEach((el, index) => {
      callback.call(el, new _Query(el), index);
    });
    return this;
  }
  get(index) {
    if (index !== void 0) {
      return this[index];
    } else {
      return Array.from(this);
    }
  }
  eq(index) {
    return new _Query(this[index]);
  }
  // non jquery variant to return only immediate text node
  textNode() {
    return Array.from(this).map((el) => {
      return Array.from(el.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.nodeValue).join("");
    }).join("");
  }
};

// packages/query/src/index.js
function $2(selector, root = document) {
  return new Query(selector, root);
}

// node_modules/lit-html/directives/unsafe-html.js
var e5 = class extends i4 {
  constructor(i5) {
    if (super(i5), this.it = T, i5.type !== t3.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r7) {
    if (r7 === T || null == r7)
      return this._t = void 0, this.it = r7;
    if (r7 === w)
      return r7;
    if ("string" != typeof r7)
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r7 === this.it)
      return this._t;
    this.it = r7;
    const s6 = [r7];
    return s6.raw = s6, this._t = { _$litType$: this.constructor.resultType, strings: s6, values: [] };
  }
};
e5.directiveName = "unsafeHTML", e5.resultType = 1;
var o5 = e4(e5);

// packages/component/src/lit/directives/reactive-data.js
var ReactiveData = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }
  render(computeFunc, settings) {
    if (this.reaction) {
      this.reaction.stop();
    }
    let value;
    this.reaction = Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      value = computeFunc();
      if (settings.unsafeHTML) {
        value = o5(value);
      }
      if (!comp.firstRun) {
        this.setValue(value);
      }
    });
    return value;
  }
  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
  reconnected() {
  }
};
var reactiveData = e4(ReactiveData);

// packages/component/src/lit/directives/reactive-conditional.js
var ReactiveConditionalDirective = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }
  render(conditional) {
    if (this.reaction) {
      this.reaction.stop();
    }
    let html = T;
    this.reaction = Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      if (conditional.condition()) {
        html = conditional.content();
      } else if (conditional.branches?.length) {
        let match = false;
        each(conditional.branches, (branch) => {
          if (!match && branch.type == "elseif" && branch.condition()) {
            match = true;
            html = branch.content();
          } else if (!match && branch.type == "else") {
            match = true;
            html = branch.content();
          }
        });
      } else {
        html = w;
      }
      if (!comp.firstRun) {
        this.setValue(html);
      }
      return html;
    });
    return html;
  }
  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
  reconnected() {
  }
};
var reactiveConditional = e4(ReactiveConditionalDirective);

// node_modules/lit-html/directives/repeat.js
var u4 = (e6, s6, t5) => {
  const r7 = /* @__PURE__ */ new Map();
  for (let l3 = s6; l3 <= t5; l3++)
    r7.set(e6[l3], l3);
  return r7;
};
var c5 = e4(class extends i4 {
  constructor(e6) {
    if (super(e6), e6.type !== t3.CHILD)
      throw Error("repeat() can only be used in text expressions");
  }
  dt(e6, s6, t5) {
    let r7;
    void 0 === t5 ? t5 = s6 : void 0 !== s6 && (r7 = s6);
    const l3 = [], o6 = [];
    let i5 = 0;
    for (const s7 of e6)
      l3[i5] = r7 ? r7(s7, i5) : i5, o6[i5] = t5(s7, i5), i5++;
    return { values: o6, keys: l3 };
  }
  render(e6, s6, t5) {
    return this.dt(e6, s6, t5).values;
  }
  update(s6, [t5, r7, c6]) {
    const d3 = p3(s6), { values: p4, keys: a3 } = this.dt(t5, r7, c6);
    if (!Array.isArray(d3))
      return this.ut = a3, p4;
    const h5 = this.ut ??= [], v3 = [];
    let m3, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
    for (; x2 <= j2 && k2 <= w2; )
      if (null === d3[x2])
        x2++;
      else if (null === d3[j2])
        j2--;
      else if (h5[x2] === a3[k2])
        v3[k2] = v2(d3[x2], p4[k2]), x2++, k2++;
      else if (h5[j2] === a3[w2])
        v3[w2] = v2(d3[j2], p4[w2]), j2--, w2--;
      else if (h5[x2] === a3[w2])
        v3[w2] = v2(d3[x2], p4[w2]), r5(s6, v3[w2 + 1], d3[x2]), x2++, w2--;
      else if (h5[j2] === a3[k2])
        v3[k2] = v2(d3[j2], p4[k2]), r5(s6, d3[x2], d3[j2]), j2--, k2++;
      else if (void 0 === m3 && (m3 = u4(a3, k2, w2), y3 = u4(h5, x2, j2)), m3.has(h5[x2]))
        if (m3.has(h5[j2])) {
          const e6 = y3.get(a3[k2]), t6 = void 0 !== e6 ? d3[e6] : null;
          if (null === t6) {
            const e7 = r5(s6, d3[x2]);
            v2(e7, p4[k2]), v3[k2] = e7;
          } else
            v3[k2] = v2(t6, p4[k2]), r5(s6, d3[x2], t6), d3[e6] = null;
          k2++;
        } else
          h3(d3[j2]), j2--;
      else
        h3(d3[x2]), x2++;
    for (; k2 <= w2; ) {
      const e6 = r5(s6, v3[w2 + 1]);
      v2(e6, p4[k2]), v3[k2++] = e6;
    }
    for (; x2 <= j2; ) {
      const e6 = d3[x2++];
      null !== e6 && h3(e6);
    }
    return this.ut = a3, m2(s6, v3), w;
  }
});

// packages/component/src/lit/directives/reactive-each.js
var ReactiveEachDirective = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.parts = /* @__PURE__ */ new Map();
  }
  render(eachCondition, data) {
    const initialRender = this.createRepeat(eachCondition, data);
    if (!this.reaction) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }
        const items = this.getItems(eachCondition);
        if (comp.firstRun) {
          return;
        }
        const render = this.createRepeat(eachCondition, data, items);
        this.setValue(render);
      });
    }
    return initialRender;
  }
  getItems(eachCondition) {
    let items = eachCondition.over() || [];
    items = items.map((item) => {
      if (isObject(item)) {
        item._id = item._id || hashCode(item);
      }
      return item;
    });
    return items;
  }
  createRepeat(eachCondition, data, items = this.getItems(eachCondition)) {
    if (!items?.length) {
      return T;
    }
    return c5(items, this.getPartID, (item, index) => {
      let part = this.parts.get(this.getPartID(item));
      if (false) {
        return part;
      } else {
        part = this.getPartContent(item, index, data, eachCondition);
        this.parts.set(this.getPartID(item), part);
      }
      return part;
    });
  }
  getPartContent(item, index, data, eachCondition) {
    let eachData = this.prepareEachData(item, index, data, eachCondition.as);
    return eachCondition.content(eachData);
  }
  getPartID(item) {
    if (isObject(item)) {
      return item._id || item.id || item.key || item.hash || hashCode(item);
    }
    if (isString) {
      return item;
    }
  }
  prepareEachData(item, index, data, alias) {
    return alias ? {
      ...data,
      [alias]: item,
      "@index": index
    } : {
      ...data,
      ...item,
      "@index": index
    };
  }
  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
};
var reactiveEach = e4(ReactiveEachDirective);

// packages/component/src/lit/directives/render-template.js
var RenderTemplate = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options.host.renderRoot;
    this.template = null;
    this.part = null;
  }
  render({ getTemplateName, subTemplates, data, parentTemplate }) {
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    const cloneTemplate = () => {
      const templateName = getTemplateName();
      if (this.template && this.templateName == templateName) {
        return false;
      }
      this.templateName = templateName;
      const template = subTemplates[templateName];
      if (!template) {
        fatal(`Could not find template named "${getTemplateName()}`, subTemplates);
      }
      this.template = template.clone({ data: unpackData(data) });
      return true;
    };
    const attachTemplate = () => {
      const { parentNode, startNode, endNode } = this.part;
      const renderRoot = this.part.options.host?.renderRoot;
      this.template.attach(renderRoot, { parentNode, startNode, endNode });
      if (parentTemplate) {
        this.template.setParent(parentTemplate);
      }
    };
    const renderTemplate2 = () => {
      let html = this.template.render();
      setTimeout(() => {
        this.template.onRendered();
      }, 0);
      return html;
    };
    Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      const isCloned = cloneTemplate();
      if (!comp.firstRun) {
        attachTemplate();
        if (!isCloned) {
          this.template.setDataContext(unpackData(data));
        }
        this.setValue(renderTemplate2());
      }
    });
    cloneTemplate();
    attachTemplate();
    this.template.setDataContext(unpackData(data));
    return renderTemplate2();
  }
  update(part, renderSettings) {
    this.part = part;
    return this.render.apply(this, renderSettings);
  }
  reconnected() {
  }
  disconnected() {
    if (this.template) {
      this.template.onDestroyed();
    }
  }
};
var renderTemplate = e4(RenderTemplate);

// packages/component/src/lit/helpers.js
var Helpers = {
  is: (a3, b3) => {
    return a3 == b3;
  },
  not: (a3) => {
    return !a3;
  },
  maybe(expr, trueCondition = "", falseCondition = "") {
    return expr ? trueCondition : falseCondition;
  },
  activeIf: (expr) => {
    return Helpers.maybe(expr, "active", "");
  },
  selectedIf: (expr) => {
    return Helpers.maybe(expr, "selected", "");
  },
  capitalize: (text) => {
    return toTitleCase(text);
  },
  titleCase: (text) => {
    return toTitleCase(text);
  },
  disabledIf: (expr) => {
    return Helpers.maybe(expr, "disabled", "");
  },
  checkedIf: (expr) => {
    return Helpers.maybe(expr, "checked", "");
  },
  isEqual: (a3, b3) => {
    return a3 == b3;
  },
  maybePlural(value, plural = "s") {
    return value == 1 ? "" : plural;
  },
  isNotEqual: (a3, b3) => {
    return a3 != b3;
  },
  isExactlyEqual: (a3, b3) => {
    return a3 === b3;
  },
  isNotExactlyEqual: (a3, b3) => {
    return a3 !== b3;
  },
  greaterThan: (a3, b3) => {
    return a3 > b3;
  },
  lessThan: (a3, b3) => {
    return a3 < b3;
  },
  greaterThanEquals: (a3, b3) => {
    return a3 >= b3;
  },
  lessThanEquals: (a3, b3) => {
    return a3 <= b3;
  },
  numberFromIndex: (a3) => {
    return a3 + 1;
  },
  formatDate: (date = /* @__PURE__ */ new Date(), format = "L") => {
    return formatDate(date, format);
  },
  formatDateTime: (date = /* @__PURE__ */ new Date(), format = "LLL") => {
    return formatDate(date, format);
  },
  formatDateTimeSeconds: (date = /* @__PURE__ */ new Date(), format = "LTS") => {
    return formatDate(date, format);
  },
  object: ({ obj }) => {
    return obj;
  },
  log(...args) {
    console.log(...args);
  },
  debugger: () => {
    debugger;
  }
};

// packages/component/src/lit/renderer.js
var LitRenderer = class _LitRenderer {
  static helpers = Helpers;
  static addHelper(name, helper) {
    _LitRenderer.helpers[name] = helper;
  }
  constructor({
    ast,
    data,
    subTemplates
  }) {
    this.ast = ast || "";
    this.data = data;
    this.subTemplates = subTemplates;
    this.resetHTML();
  }
  resetHTML() {
    this.html = [];
    this.html.raw = [];
    this.expressions = [];
  }
  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  render({
    ast = this.ast,
    data = this.data
  } = {}) {
    this.resetHTML();
    this.readAST({ ast, data });
    this.clearTemp();
    this.litTemplate = x.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }
  readAST({
    ast = this.ast,
    data = this.data
  } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case "html":
          this.addHTML(node.html);
          break;
        case "expression":
          const value = this.evaluateExpression(node.value, data, {
            unsafeHTML: node.unsafeHTML,
            asDirective: true
          });
          this.addValue(value);
          break;
        case "if":
          this.addValue(this.evaluateConditional(node, data));
          break;
        case "each":
          this.addValue(this.evaluateEach(node, data));
          break;
        case "template":
          this.addValue(this.evaluateTemplate(node, data));
          break;
        case "slot":
          if (node.name) {
            this.addHTML(`<slot name="${node.name}"></slot>`);
          } else {
            this.addHTML(`<slot></slot>`);
          }
          break;
      }
    });
  }
  /*
    The conditional directive takes an if condition and branches
    but does not have access to LitRenderer and evaluateExpression
    so we have to pass through functions that do this
  */
  evaluateConditional(node, data) {
    const directiveMap = (value, key) => {
      if (key == "branches") {
        return value.map((branch) => mapObject(branch, directiveMap));
      }
      if (key == "condition") {
        return () => this.evaluateExpression(value, data);
      }
      if (key == "content") {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }
  evaluateEach(node, data) {
    const directiveMap = (value, key) => {
      if (key == "over") {
        return () => this.evaluateExpression(value, data);
      }
      if (key == "content") {
        return (eachData) => this.renderContent({ ast: value, data: eachData });
      }
      return value;
    };
    let eachArguments = mapObject(node, directiveMap);
    return reactiveEach(eachArguments, data);
  }
  evaluateTemplate(node, data = {}) {
    const getValue = (value) => this.evaluateExpression(value, data);
    const getTemplateName = () => getValue(node.name);
    const staticValues = mapObject(node.data || {}, (value) => {
      return () => Reaction.nonreactive(() => getValue(value));
    });
    const reactiveValues = mapObject(node.reactiveData || {}, (value) => {
      return () => getValue(value);
    });
    const templateData = {
      ...staticValues,
      ...reactiveValues
    };
    return renderTemplate({
      subTemplates: this.subTemplates,
      getTemplateName,
      data: templateData,
      parentTemplate: data
    });
  }
  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(expression, data = this.data, { asDirective = false, unsafeHTML = false } = {}) {
    if (typeof expression === "string") {
      if (asDirective) {
        return reactiveData(() => this.lookupExpressionValue(expression, data), { unsafeHTML });
      } else {
        return this.lookupExpressionValue(expression, data);
      }
    }
    return expression;
  }
  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  // i.e. {{format sayWord 'balloon' 'dog'}} => format(sayWord('balloon', 'dog'))
  lookupExpressionValue(expressionString = "", data = {}, { unsafeHTML = false } = {}) {
    const stringRegExp = /^\'(.*)\'$/;
    const stringMatches = expressionString.match(stringRegExp);
    if (stringMatches && stringMatches.length > 0) {
      return stringMatches[1];
    }
    const expressions = expressionString.split(" ").reverse();
    let funcArguments = [];
    let result;
    each(expressions, (expression, index) => {
      const getDeepValue = (obj, path) => path.split(".").reduce((acc, part) => {
        const current = wrapFunction(acc)();
        return current[part];
      }, obj);
      const getContext = () => {
        const path = expression.split(".").slice(0, -1).join(".");
        const context = getDeepValue(data, path);
        return context;
      };
      let dataValue = getDeepValue(data, expression);
      const helper = _LitRenderer.helpers[expression];
      if (!dataValue && isFunction(helper)) {
        dataValue = helper;
      }
      let stringMatches2;
      if (isFunction(dataValue)) {
        const boundFunc = dataValue.bind(getContext());
        result = boundFunc(...funcArguments);
      } else if (dataValue !== void 0) {
        result = dataValue?.constructor.name === "_ReactiveVar" ? dataValue.value : dataValue;
      } else if ((stringMatches2 = stringRegExp.exec(expression)) !== null && stringMatches2.length > 1) {
        result = stringMatches2[1];
      } else if (!Number.isNaN(parseFloat(expression))) {
        result = Number(expression);
      } else {
        result = void 0;
      }
      funcArguments.unshift(result);
    });
    return result;
  }
  addHTML(html) {
    if (this.lastHTML) {
      const lastHTML = this.html.pop();
      html = `${lastHTML}${html}`;
    }
    this.html.push(html);
    this.html.raw.push(String.raw({ raw: html }));
    this.lastHTML = true;
  }
  addHTMLSpacer() {
    this.addHTML("");
  }
  addValue(expression) {
    this.addHTMLSpacer();
    this.expressions.push(expression);
    this.lastHTML = false;
    this.addHTMLSpacer();
  }
  // subtrees are rendered as separate contexts
  renderContent({ ast, data, subTemplates }) {
    return new _LitRenderer({ ast, data, subTemplates: this.subTemplates }).render();
  }
  clearTemp() {
    delete this.lastHTML;
  }
};

// packages/component/src/lit/template.js
var LitTemplate = class UITemplate {
  static templateCount = 0;
  constructor({
    templateName,
    ast,
    template,
    data,
    css,
    events: events3,
    subTemplates,
    createInstance: createInstance3,
    parentTemplate,
    // the parent template when nested
    onCreated: onCreated3 = noop,
    onRendered = noop,
    onDestroyed: onDestroyed2 = noop
  }) {
    if (!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }
    this.events = events3;
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.templateName = templateName || this.getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createInstance = createInstance3;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed2;
    this.onCreatedCallback = onCreated3;
  }
  setDataContext(data) {
    this.data = data;
    this.tpl.data = data;
  }
  // when rendered as a partial/subtemplate
  setParent(parentTemplate) {
    return this.parentTemplate = parentTemplate;
  }
  getGenericTemplateName() {
    LitTemplate.templateCount++;
    return `Anonymous #${LitTemplate.templateCount}`;
  }
  initialize() {
    let tpl = this;
    if (isFunction(this.createInstance)) {
      this.tpl = {};
      tpl = this.call(this.createInstance);
      extend(this.tpl, tpl);
    }
    this.tpl.reaction = this.reaction;
    this.tpl.data = this.data;
    this.tpl.$ = this.$;
    this.tpl.templateName = this.templateName;
    this.tpl.parent = () => this.parentTemplate;
    this.onCreated = () => {
      this.call(this.onCreatedCallback.bind(this));
    };
    this.onFirstRender = () => {
      this.call(this.onFirstRenderCallback.bind(this));
    };
    this.onRendered = () => {
      this.call(this.onRenderedCallback.bind(this));
    };
    this.onDestroyed = () => {
      this.rendered = false;
      this.clearReactions();
      this.removeEvents();
      this.call(this.onDestroyedCallback.bind(this));
    };
    this.initialized = true;
    this.renderer = new LitRenderer({
      ast: this.ast,
      data: this.getDataContext(),
      subTemplates: this.subTemplates
    });
    this.onCreated();
  }
  async attach(renderRoot, { parentNode = renderRoot, startNode, endNode } = {}) {
    if (!this.initialized) {
      this.initialize();
    }
    if (this.renderRoot == renderRoot) {
      return;
    }
    this.renderRoot = renderRoot;
    this.parentNode = parentNode;
    this.startNode = startNode;
    this.endNode = endNode;
    this.attachEvents();
    await this.attachStyles();
  }
  getDataContext() {
    return {
      ...this.tpl,
      ...this.data
    };
  }
  async attachStyles() {
    if (!this.css) {
      return;
    }
    if (!this.renderRoot || !this.renderRoot.adoptedStyleSheets) {
      return;
    }
    const cssString = this.css;
    if (!this.stylesheet) {
      this.stylesheet = new CSSStyleSheet();
      await this.stylesheet.replace(cssString);
    }
    let styles = Array.from(this.renderRoot.adoptedStyleSheets);
    let hasStyles = styles.some((style) => isEqual(style.cssRules, this.stylesheet.cssRules));
    if (!hasStyles) {
      this.renderRoot.adoptedStyleSheets = [...this.renderRoot.adoptedStyleSheets, this.stylesheet];
    }
  }
  clone(settings) {
    const defaultSettings = {
      templateName: this.templateName,
      ast: this.ast,
      css: this.css,
      events: this.events,
      subTemplates: this.subTemplates,
      onCreated: this.onCreatedCallback,
      onRendered: this.onRenderedCallback,
      onDestroyed: this.onDestroyedCallback,
      createInstance: this.createInstance
    };
    return new LitTemplate({
      ...defaultSettings,
      ...settings
    });
  }
  attachEvents(events3 = this.events) {
    if (!this.parentNode || !this.renderRoot) {
      fatal("You must set a parent before attaching events");
    }
    this.removeEvents();
    const parseEventString = (eventString) => {
      const parts = eventString.split(" ");
      const eventName = parts[0];
      parts.shift();
      const selector = parts.join(" ");
      return { eventName, selector };
    };
    this.eventController = new AbortController();
    each(events3, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;
      $2(this.renderRoot).on(eventName, selector, (event) => {
        if (!this.isNodeInTemplate(event.target)) {
          return;
        }
        const boundEvent = eventHandler.bind(event.target);
        template.call(boundEvent, { firstArg: event, additionalArgs: [event.target.dataset] });
      }, this.eventController);
    });
  }
  removeEvents() {
    if (this.eventController) {
      this.eventController.abort();
    }
  }
  // Find the direct child of the renderRoot that is an ancestor of the event.target
  // then confirm position
  isNodeInTemplate(node) {
    const getRootChild = (node2) => {
      while (node2 && node2.parentNode !== this.parentNode) {
        node2 = node2.parentNode;
      }
      return node2;
    };
    const isNodeInRange = (node2, startNode = this.startNode, endNode = this.endNode) => {
      if (!startNode || !endNode) {
        return true;
      }
      const startComparison = startNode.compareDocumentPosition(node2);
      const endComparison = endNode.compareDocumentPosition(node2);
      const isAfterStart = (startComparison & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const isBeforeEnd = (endComparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
      return isAfterStart && isBeforeEnd;
    };
    return isNodeInRange(getRootChild(node));
  }
  render(additionalData = {}) {
    if (!this.initialized) {
      this.initialize();
    }
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData
      }
    });
    if (!this.rendered) {
      setTimeout(this.onRendered, 0);
    }
    this.rendered = true;
    return html;
  }
  /*******************************
           DOM Helpers
  *******************************/
  // Rendered DOM (either shadow or regular)
  $(selector, root = this.renderRoot) {
    if (!root) {
      root = document;
    }
    if (root == this.renderRoot) {
      return $2(selector, root).filter((node) => this.isNodeInTemplate(node));
    } else {
      return $2(selector, root);
    }
  }
  // calls callback if defined with consistent params and this context
  call(func, { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}) {
    if (firstArg) {
      args.unshift(firstArg);
    }
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    if (isFunction(func)) {
      return func.apply(this, args);
    }
  }
  /*******************************
           Reactive Helpers
  *******************************/
  reaction(reaction) {
    if (!this.reactions) {
      this.reactions = [];
    }
    this.reactions.push(Reaction.create(reaction));
  }
  clearReactions() {
    each(this.reactions || [], (comp) => comp.stop());
  }
};

// packages/component/src/web-component.js
var WebComponentBase = class extends s3 {
  // for use with light dom rendering
  static scopedStyleSheet = null;
  useLight = false;
  createRenderRoot() {
    this.useLight = this.getAttribute("expose") !== null;
    if (this.useLight) {
      this.applyScopedStyles(this.tagName, this.css);
      this.storeOriginalContent.apply(this);
      return this;
    } else {
      const renderRoot = super.createRenderRoot(this.css);
      return renderRoot;
    }
  }
  applyScopedStyles(scopeSelector, css) {
    if (!this.scopedStyleSheet) {
      const scopedCSS = scopeStyles(css, scopeSelector);
      this.scopedStyleSheet = new CSSStyleSheet();
      this.scopedStyleSheet.replaceSync(scopedCSS);
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.scopedStyleSheet];
  }
  storeOriginalContent() {
    this.originalDOM = document.createElement("template");
    this.originalDOM.innerHTML = this.innerHTML;
    this.innerHTML = "";
  }
  slotContent() {
    const $slots = this.$("slot");
    $slots.each(($slot) => {
      let html;
      if ($slot.attr("name")) {
        let slotName = $slot.attr("name");
        const $slotContent = this.$$(`[slot="${slotName}"]`);
        if ($slotContent.length) {
          html = $slotContent.outerHTML();
        }
      } else {
        const $originalDOM = this.$$(this.originalDOM.content);
        const $defaultContent = $originalDOM.children().not("[slot]");
        const defaultHTML = $defaultContent.html() || "";
        const defaultText = $originalDOM.textNode() || "";
        html = defaultHTML + defaultText;
      }
      if ($slot && html) {
        $slot.html(html);
      }
    });
  }
  firstUpdated() {
    super.firstUpdated();
  }
  updated() {
    super.updated();
    if (this.useLight) {
      this.slotContent();
    }
  }
  /*******************************
         Settings / Attrs
  *******************************/
  get defaultSettings() {
    return {};
  }
  /*******************************
           DOM Helpers
  *******************************/
  // Rendered DOM (either shadow or regular)
  $(selector, root = this?.renderRoot) {
    if (!this.renderRoot) {
      console.error("Cannot query DOM until element has rendered.");
    }
    return $2(selector, this?.renderRoot);
  }
  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $2(selector, this.originalDOM.content);
  }
  // Query parent DOM
  $$$(selector) {
    return $2(selector, document);
  }
  // calls callback if defined with consistent params and this context
  call(func, { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}) {
    if (firstArg) {
      args.unshift(firstArg);
    }
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    if (isFunction(func)) {
      return func.apply(this, args);
    }
  }
};

// packages/component/src/create-component.js
var createComponent = ({
  renderer = "lit",
  template = "",
  css = false,
  spec = false,
  templateName,
  tagName,
  events: events3 = {},
  createInstance: createInstance3 = noop,
  onCreated: onCreated3 = noop,
  onRendered = noop,
  onDestroyed: onDestroyed2 = noop,
  onAttributeChanged = noop,
  subTemplates = [],
  beforeRendered = noop
} = {}) => {
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();
  let FAKE_SPEC;
  if (tagName == "ui-button") {
    FAKE_SPEC = {
      settings: {
        size: ["mini", "tiny", "small", "medium", "large", "huge", "massive"],
        emphasis: ["primary", "secondary"],
        icon: ["icon"],
        labeled: ["right-labeled", ["labeled", "left-labeled"]]
      }
    };
  }
  let litTemplate = new LitTemplate({
    templateName: templateName || kebabToCamel(tagName),
    ast,
    css,
    events: events3,
    subTemplates,
    onCreated: onCreated3,
    onRendered,
    onDestroyed: onDestroyed2,
    createInstance: createInstance3
  });
  let webComponent;
  if (tagName) {
    webComponent = class UIWebComponent extends WebComponentBase {
      static get styles() {
        return r(css);
      }
      static get properties() {
        if (tagName == "ui-button") {
          return {
            // attrs
            size: { type: String, observe: true, reflect: false },
            emphasis: { type: String, observe: true, reflect: false },
            // example of value -> attr
            small: { type: Boolean, reflect: false },
            large: { type: Boolean, reflect: false },
            primary: { type: Boolean, reflect: false },
            secondary: { type: Boolean, reflect: false },
            class: { type: String }
          };
        }
        return {};
      }
      constructor() {
        super();
        this.css = css;
        this.tpl = litTemplate.tpl;
        this.template = litTemplate;
        this.renderCallbacks = [];
      }
      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
        litTemplate.attach(this.renderRoot);
        this.call(beforeRendered);
      }
      firstUpdated() {
        super.firstUpdated();
        this.call(onRendered);
      }
      updated() {
        each(this.renderCallbacks, (callback) => callback());
      }
      addRenderCallback(callback) {
        this.renderCallbacks.push(callback);
      }
      // callback if removed from dom
      disconnectedCallback() {
        super.disconnectedCallback();
        litTemplate.removeEvents();
        this.call(onDestroyed2);
      }
      // callback if moves doc
      adoptedCallback() {
        super.adoptedCallback();
        this.call(onMoved);
      }
      attributeChangedCallback(attribute, oldValue, newValue) {
        this.adjustSettingFromAttribute(attribute, newValue);
        this.call(onAttributeChanged, { args: [attribute, oldValue, newValue] });
        super.attributeChangedCallback(attribute, oldValue, newValue);
      }
      /*
              Semantic UI supports 3 dialects to support this we
              check if attribute is a setting and reflect the value
      
              <ui-button size="large"> // verbose
              <ui-button large> // concise
              <ui-button class="large"> // classic
            */
      adjustSettingFromAttribute(attribute, value) {
        const spec2 = FAKE_SPEC;
        if (attribute == "class") {
          each(value.split(" "), (className) => {
            this.adjustSettingFromAttribute(className);
          });
        } else if (get(spec2.attribute, attribute)) {
        } else {
          const setting = get(reverseKeys(spec2.settings), attribute);
          if (setting) {
            const oldValue = this[setting];
            this[setting] = attribute;
            this.attributeChangedCallback(setting, oldValue, attribute);
          }
        }
      }
      getSettings() {
        const settings = {};
        each(webComponent.properties, (propSettings, property) => {
          if (property == "class" || !propSettings.observe) {
            return;
          }
          settings[property] = this[property];
          if (!settings[this[property]]) {
            settings[this[property]] = true;
          }
        });
        return settings;
      }
      getUIClasses() {
        const classes = [];
        each(webComponent.properties, (settings, property) => {
          if (property == "class" || !settings.observe) {
            return;
          }
          classes.push(this[property]);
        });
        const classString = unique(classes).filter(Boolean).join(" ");
        return classString;
      }
      getDataContext() {
        return {
          ...this.tpl,
          ...this.getSettings(),
          ui: this.getUIClasses()
        };
      }
      render() {
        const html = litTemplate.render(this.getDataContext());
        return html;
      }
    };
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : litTemplate;
};

// examples/todo-list/todo-item.html
var todo_item_default = '<li class="{{maybeCompleted}}todo-item">\n  <input class="toggle" type="checkbox">\n  <label>{{item.text}}</label>\n  <button class="destroy"></button>\n</li>\n';

// examples/todo-list/todo-item.css
var todo_item_default2 = '.todo-list li .toggle {\n    text-align: center;\n    width: 40px;\n    height: auto;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    margin: auto 0;\n    border: none;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none\n}\n\n.todo-list li .toggle {\n    opacity: 0\n}\n\n.todo-list li .toggle+label {\n    background-image: url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E);\n    background-repeat: no-repeat;\n    background-position: center left\n}\n\n.todo-list li .toggle:checked+label {\n    background-image: url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E)\n}\n\n.todo-list li label {\n    overflow-wrap: break-word;\n    padding: 15px 15px 15px 60px;\n    display: block;\n    line-height: 1.2;\n    transition: color .4s;\n    font-weight: 400;\n    color: #484848\n}\n\n.todo-list li.completed label {\n    color: #949494;\n    text-decoration: line-through\n}\n\n.todo-list li .destroy {\n    display: none;\n    position: absolute;\n    top: 0;\n    right: 10px;\n    bottom: 0;\n    width: 40px;\n    height: 40px;\n    margin: auto 0;\n    font-size: 30px;\n    color: #949494;\n    transition: color .2s ease-out\n}\n\n.todo-list li .destroy:hover,.todo-list li .destroy:focus {\n    color: #c18585\n}\n\n.todo-list li .destroy:after {\n    content: "\xD7";\n    display: block;\n    height: 100%;\n    line-height: 1.1\n}\n\n.todo-list li:hover .destroy {\n    display: block\n}\n\n.todo-list li .edit {\n    display: none\n}\n\n.todo-list li.editing:last-child {\n    margin-bottom: -1px\n}\n';

// examples/todo-list/todo-item.js
var createInstance = (tpl, $3) => ({
  toggleCompleted() {
    todos[tpl.data.index].completed = !todos[tpl.data.index].completed;
    tpl.parent().todos.set(todos);
  },
  maybeCompleted() {
    const completed = tpl.data.item.completed;
    console.log(completed);
    return completed ? "completed " : "";
  },
  removeTodo() {
    tpl.parent().todos.removeItem(tpl.data.index);
  }
});
var onCreated = (tpl, $3) => {
  console.log("created", tpl.data);
};
var events = {
  "change label"(event, tpl) {
    tpl.toggleCompleted();
  },
  "click .destroy"(event, tpl) {
    tpl.removeTodo();
  }
};
var todoItem = createComponent({
  templateName: "todoItem",
  template: todo_item_default,
  css: todo_item_default2,
  createInstance,
  onCreated,
  events
});

// examples/todo-list/todo-list.html
var todo_list_default = `<header class="header">
  <h1>Todos</h1>
  <input type="text" class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?">
  <div class="select-all"></div>
</header>
<main class="main">
  <div class="toggle-all-container">
    <input class="toggle-all" type="checkbox"/>
    <label class="toggle-all-label" htmlFor="toggle-all">Toggle All Input</label>
  </div>
  <ul class="todo-list">
    {{#each item in getVisibleTodos}}
      {{> template
        name='todoItem'
        reactiveData={
          item: item,
          index: @index
        }
      }}
    {{/each}}
  </ul>
</main>
<footer class="footer">
  <span class="todo-count">
    {{getIncomplete.length}} item{{maybeS getIncomplete.length}} left
  </span>
  <ul class="filters">
    {{#each filter in filters}}
      <li>
        {{#if isActiveFilter filter}}
          <a class="selected">
            {{capitalize filter}}
          </a>
        {{else}}
          {{#if is route 'all'}
            <a href="#/">
              All
            </a>
          {{else}}
            <a href="#/{{filter}}">
              {{capitalize filter}}
            </a>
          {{/if}}
        {{/if}}
      </li>
    {{/each}}
  </ul>
  {{#if hasAnyCompleted}}
    <div class="clear-completed">Clear Completed</div>
  {{/if}}
</footer>
`;

// examples/todo-list/todo-list.css
var todo_list_default2 = 'h1 {\n  position: absolute;\n  top: -140px;\n  width: 100%;\n  font-size: 80px;\n  font-weight: 200;\n  text-align: center;\n  color: #b83f45;\n  text-rendering: optimizeLegibility;\n}\n\n.new-todo {\n  padding: 16px 16px 16px 60px;\n  height: 65px;\n  border: none;\n  background: rgba(0, 0, 0, 0.003);\n  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);\n}\n\n.visually-hidden {\n    border: 0;\n    clip: rect(0 0 0 0);\n    clip-path: inset(50%);\n    height: 1px;\n    width: 1px;\n    margin: -1px;\n    padding: 0;\n    overflow: hidden;\n    position: absolute;\n    white-space: nowrap\n}\n\n.toggle-all {\n    width: 40px!important;\n    height: 60px!important;\n    right: auto!important\n}\n\n.toggle-all-label {\n    pointer-events: none\n}\n\nhtml,body {\n    margin: 0;\n    padding: 0\n}\n\nbutton {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    background: none;\n    font-size: 100%;\n    vertical-align: baseline;\n    font-family: inherit;\n    font-weight: inherit;\n    color: inherit;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale\n}\n\nbody {\n    font: 14px Helvetica Neue,Helvetica,Arial,sans-serif;\n    line-height: 1.4em;\n    background: #f5f5f5;\n    color: #111;\n    min-width: 230px;\n    max-width: 550px;\n    margin: 0 auto;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    font-weight: 300\n}\n\n.hidden {\n    display: none\n}\n\n.todoapp {\n    background: #fff;\n    margin: 130px 0 40px;\n    position: relative;\n    box-shadow: 0 2px 4px #0003,0 25px 50px #0000001a\n}\n\n.todoapp input::-webkit-input-placeholder {\n    font-style: italic;\n    font-weight: 400;\n    color: #0006\n}\n\n.todoapp input::-moz-placeholder {\n    font-style: italic;\n    font-weight: 400;\n    color: #0006\n}\n\n.todoapp input::input-placeholder {\n    font-style: italic;\n    font-weight: 400;\n    color: #0006\n}\n\n.todoapp h1 {\n    position: absolute;\n    top: -140px;\n    width: 100%;\n    font-size: 80px;\n    font-weight: 200;\n    text-align: center;\n    color: #b83f45;\n    -webkit-text-rendering: optimizeLegibility;\n    -moz-text-rendering: optimizeLegibility;\n    text-rendering: optimizeLegibility\n}\n\n.new-todo,.edit {\n    position: relative;\n    margin: 0;\n    width: 100%;\n    font-size: 24px;\n    font-family: inherit;\n    font-weight: inherit;\n    line-height: 1.4em;\n    color: inherit;\n    padding: 6px;\n    border: 1px solid #999;\n    box-shadow: inset 0 -1px 5px #0003;\n    box-sizing: border-box;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale\n}\n\n.new-todo {\n    padding: 16px 16px 16px 60px;\n    height: 65px;\n    border: none;\n    background: rgba(0,0,0,.003);\n    box-shadow: inset 0 -2px 1px #00000008\n}\n\n.main {\n    position: relative;\n    z-index: 2;\n    border-top: 1px solid #e6e6e6\n}\n\n.toggle-all {\n    width: 1px;\n    height: 1px;\n    border: none;\n    opacity: 0;\n    position: absolute;\n    right: 100%;\n    bottom: 100%\n}\n\n.toggle-all+label {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 45px;\n    height: 65px;\n    font-size: 0;\n    position: absolute;\n    top: -65px;\n    left: -0\n}\n\n.toggle-all+label:before {\n    content: "\u276F";\n    display: inline-block;\n    font-size: 22px;\n    color: #949494;\n    padding: 10px 27px;\n    -webkit-transform: rotate(90deg);\n    transform: rotate(90deg)\n}\n\n.toggle-all:checked+label:before {\n    color: #484848\n}\n\n.todo-list {\n    margin: 0;\n    padding: 0;\n    list-style: none\n}\n\n.todo-list li {\n    position: relative;\n    font-size: 24px;\n    border-bottom: 1px solid #ededed\n}\n\n.todo-list li:last-child {\n    border-bottom: none\n}\n\n.todo-list li.editing {\n    border-bottom: none;\n    padding: 0\n}\n\n.todo-list li.editing .edit {\n    display: block;\n    width: calc(100% - 43px);\n    padding: 12px 16px;\n    margin: 0 0 0 43px\n}\n\n.todo-list li.editing .view {\n    display: none\n}\n\n.footer {\n    padding: 10px 15px;\n    height: 20px;\n    text-align: center;\n    font-size: 15px;\n    border-top: 1px solid #e6e6e6\n}\n\n.footer:before {\n    content: "";\n    position: absolute;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    height: 50px;\n    overflow: hidden;\n    box-shadow: 0 1px 1px #0003,0 8px 0 -3px #f6f6f6,0 9px 1px -3px #0003,0 16px 0 -6px #f6f6f6,0 17px 2px -6px #0003\n}\n\n.todo-count {\n    float: left;\n    text-align: left\n}\n\n.todo-count strong {\n    font-weight: 300\n}\n\n.filters {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n    position: absolute;\n    right: 0;\n    left: 0\n}\n\n.filters li {\n    display: inline\n}\n\n.filters li a {\n    color: inherit;\n    margin: 3px;\n    padding: 3px 7px;\n    text-decoration: none;\n    border: 1px solid transparent;\n    border-radius: 3px\n}\n\n.filters li a:hover {\n    border-color: #db7676\n}\n\n.filters li a.selected {\n    border-color: #ce4646\n}\n\n.clear-completed,html .clear-completed:active {\n    float: right;\n    position: relative;\n    line-height: 19px;\n    text-decoration: none;\n    cursor: pointer\n}\n\n.clear-completed:hover {\n    text-decoration: underline\n}\n\n.info {\n    margin: 65px auto 0;\n    color: #4d4d4d;\n    font-size: 11px;\n    text-shadow: 0 1px 0 rgba(255,255,255,.5);\n    text-align: center\n}\n\n.info p {\n    line-height: 1\n}\n\n.info a {\n    color: inherit;\n    text-decoration: none;\n    font-weight: 400\n}\n\n.info a:hover {\n    text-decoration: underline\n}\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n    .toggle-all,.todo-list li .toggle {\n        background:none\n    }\n\n    .todo-list li .toggle {\n        height: 40px\n    }\n}\n\n@media (max-width: 430px) {\n    .footer {\n        height:50px\n    }\n\n    .filters {\n        bottom: 10px\n    }\n}\n\n:focus,.toggle:focus+label,.toggle-all:focus+label {\n    box-shadow: 0 0 2px 2px #cf7d7d;\n    outline: 0\n}\n\nhr {\n    margin: 20px 0;\n    border: 0;\n    border-top: 1px dashed #c5c5c5;\n    border-bottom: 1px dashed #f7f7f7\n}\n\n.learn a {\n    font-weight: 400;\n    text-decoration: none;\n    color: #b83f45\n}\n\n.learn a:hover {\n    text-decoration: underline;\n    color: #787e7e\n}\n\n.learn h3,.learn h4,.learn h5 {\n    margin: 10px 0;\n    font-weight: 500;\n    line-height: 1.2;\n    color: #000\n}\n\n.learn h3 {\n    font-size: 24px\n}\n\n.learn h4 {\n    font-size: 18px\n}\n\n.learn h5 {\n    margin-bottom: 0;\n    font-size: 14px\n}\n\n.learn ul {\n    padding: 0;\n    margin: 0 0 30px 25px\n}\n\n.learn li {\n    line-height: 20px\n}\n\n.learn p {\n    font-size: 15px;\n    font-weight: 300;\n    line-height: 1.3;\n    margin-top: 0;\n    margin-bottom: 0\n}\n\n#issue-count {\n    display: none\n}\n\n.quote {\n    border: none;\n    margin: 20px 0 60px\n}\n\n.quote p {\n    font-style: italic\n}\n\n.quote p:before {\n    content: "\u201C";\n    font-size: 50px;\n    opacity: .15;\n    position: absolute;\n    top: -20px;\n    left: 3px\n}\n\n.quote p:after {\n    content: "\u201D";\n    font-size: 50px;\n    opacity: .15;\n    position: absolute;\n    bottom: -42px;\n    right: 3px\n}\n\n.quote footer {\n    position: absolute;\n    bottom: -40px;\n    right: 0\n}\n\n.quote footer img {\n    border-radius: 3px\n}\n\n.quote footer a {\n    margin-left: 5px;\n    vertical-align: middle\n}\n\n.speech-bubble {\n    position: relative;\n    padding: 10px;\n    background: rgba(0,0,0,.04);\n    border-radius: 5px\n}\n\n.speech-bubble:after {\n    content: "";\n    position: absolute;\n    top: 100%;\n    right: 30px;\n    border: 13px solid transparent;\n    border-top-color: #0000000a\n}\n\n.learn-bar>.learn {\n    position: absolute;\n    width: 272px;\n    top: 8px;\n    left: -300px;\n    padding: 10px;\n    border-radius: 5px;\n    background-color: #fff9;\n    transition-property: left;\n    transition-duration: .5s\n}\n\n@media (min-width: 899px) {\n    .learn-bar {\n        width:auto;\n        padding-left: 300px\n    }\n\n    .learn-bar>.learn {\n        left: 8px\n    }\n}\n';

// examples/todo-list/todo-list.js
var createInstance2 = (tpl, $3) => ({
  todos: new ReactiveVar([{ text: "Test 123", completed: false }]),
  filter: new ReactiveVar("all"),
  allSelected: new ReactiveVar(false),
  filters: [
    "all",
    "active",
    "complete"
  ],
  getVisibleTodos() {
    const filter = tpl.filter.get();
    return tpl.todos.get().filter((todo) => {
      if (filter == "active") {
        return !todo.completed;
      } else if (filter == "complete") {
        return todo.completed;
      }
      return true;
    });
  },
  selectAll() {
    tpl.todos.set(each(tpl.todos.value, (todo) => todo.completed = true));
  },
  selectNone() {
    tpl.todos.set(each(tpl.todos.value, (todo) => todo.completed = false));
  },
  getIncomplete() {
    return tpl.todos.value.filter((todo) => !todo.completed);
  },
  addTodo(text) {
    tpl.todos.push({
      text,
      completed: false
    });
  },
  hasAnyCompleted() {
    return tpl.todos.value.some((todo) => todo.completed);
  },
  calculateSelection() {
    tpl.reaction((comp) => {
      if (tpl.allSelected.get()) {
        tpl.selectAll();
      } else {
        tpl.selectNone();
      }
    });
  },
  isActiveFilter(filter) {
    return tpl.filter.get() == filter;
  },
  clearCompleted() {
    tpl.todos.set(todos.filter((todo) => todo.completed));
  },
  // handle state
  addRouter() {
    tpl.hashEvent = $3(window).on("hashchange", (event) => {
      let filter = window.location.hash.substring(2);
      tpl.filter.set(filter);
    });
  },
  removeRouter() {
    $3(window).off(tpl.hashEvent);
  }
});
var onCreated2 = (tpl) => {
  tpl.calculateSelection();
  tpl.addRouter();
};
var onDestroyed = (tpl) => {
  tpl.removeRouter();
};
var events2 = {
  "keydown input.new-todo"(event, tpl, $3) {
    if (event.key === "Enter") {
      tpl.addTodo($3(this).val());
    }
  },
  "change .toggle-all"(event, tpl, $3) {
    $3(event.target).attr("checked", !$3(event.target).attr("checked"));
    tpl.allSelected.toggle();
  },
  "click .filters"(event, tpl, $3, data) {
    tpl.filter.set(data.filter);
  },
  "click .clear-completed"(event, tpl) {
    tpl.clearCompleted();
  }
};
var TodoList = createComponent({
  tagName: "todo-list",
  subTemplates: {
    todoItem
  },
  template: todo_list_default,
  css: todo_list_default2,
  createInstance: createInstance2,
  onCreated: onCreated2,
  onDestroyed,
  events: events2
});
export {
  TodoList
};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=todo-list.js.map
