// packages/component/src/styles.js
var scopeStyles = (css, scopeSelector = '') => {
  scopeSelector = scopeSelector.toLowerCase();
  const style = document.createElement('style');
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
        modifiedRules.push(
          `@${rule.name} ${rule.conditionText} { ${scopedInnerRules.join(
            ' '
          )} }`
        );
        break;
      default:
        modifiedRules.push(rule.cssText);
        break;
    }
  }
  document.head.removeChild(style);
  const scopedCSS = modifiedRules.join('\n');
  return scopedCSS;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e =
  t.ShadowRoot &&
  (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e6, o7) {
    if (((this._$cssResult$ = true), o7 !== s))
      throw Error(
        'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
      );
    (this.cssText = t5), (this.t = e6);
  }
  get styleSheet() {
    let t5 = this.o;
    const s6 = this.t;
    if (e && void 0 === t5) {
      const e6 = void 0 !== s6 && 1 === s6.length;
      e6 && (t5 = o.get(s6)),
        void 0 === t5 &&
          ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText),
          e6 && o.set(s6, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n('string' == typeof t5 ? t5 : t5 + '', void 0, s);
var S = (s6, o7) => {
  if (e)
    s6.adoptedStyleSheets = o7.map((t5) =>
      t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet
    );
  else
    for (const e6 of o7) {
      const o8 = document.createElement('style'),
        n5 = t.litNonce;
      void 0 !== n5 && o8.setAttribute('nonce', n5),
        (o8.textContent = e6.cssText),
        s6.appendChild(o8);
    }
};
var c = e
  ? (t5) => t5
  : (t5) =>
      t5 instanceof CSSStyleSheet
        ? ((t6) => {
            let e6 = '';
            for (const s6 of t6.cssRules) e6 += s6.cssText;
            return r(e6);
          })(t5)
        : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var {
  is: i2,
  defineProperty: e2,
  getOwnPropertyDescriptor: r2,
  getOwnPropertyNames: h,
  getOwnPropertySymbols: o2,
  getPrototypeOf: n2,
} = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : '';
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s6) => t5;
var u = {
  toAttribute(t5, s6) {
    switch (s6) {
      case Boolean:
        t5 = t5 ? l : null;
        break;
      case Object:
      case Array:
        t5 = null == t5 ? t5 : JSON.stringify(t5);
    }
    return t5;
  },
  fromAttribute(t5, s6) {
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
  },
};
var f = (t5, s6) => !i2(t5, s6);
var y = {
  attribute: true,
  type: String,
  converter: u,
  reflect: false,
  hasChanged: f,
};
(Symbol.metadata ??= Symbol('metadata')),
  (a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap());
var b = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s6 = y) {
    if (
      (s6.state && (s6.attribute = false),
      this._$Ei(),
      this.elementProperties.set(t5, s6),
      !s6.noAccessor)
    ) {
      const i5 = Symbol(),
        r7 = this.getPropertyDescriptor(t5, i5, s6);
      void 0 !== r7 && e2(this.prototype, t5, r7);
    }
  }
  static getPropertyDescriptor(t5, s6, i5) {
    const { get: e6, set: h5 } = r2(this.prototype, t5) ?? {
      get() {
        return this[s6];
      },
      set(t6) {
        this[s6] = t6;
      },
    };
    return {
      get() {
        return e6?.call(this);
      },
      set(s7) {
        const r7 = e6?.call(this);
        h5.call(this, s7), this.requestUpdate(t5, r7, i5);
      },
      configurable: true,
      enumerable: true,
    };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d('elementProperties'))) return;
    const t5 = n2(this);
    t5.finalize(),
      void 0 !== t5.l && (this.l = [...t5.l]),
      (this.elementProperties = new Map(t5.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(d('finalized'))) return;
    if (
      ((this.finalized = true),
      this._$Ei(),
      this.hasOwnProperty(d('properties')))
    ) {
      const t6 = this.properties,
        s6 = [...h(t6), ...o2(t6)];
      for (const i5 of s6) this.createProperty(i5, t6[i5]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s6 = litPropertyMetadata.get(t5);
      if (void 0 !== s6)
        for (const [t6, i5] of s6) this.elementProperties.set(t6, i5);
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
      for (const s7 of e6) i5.unshift(c(s7));
    }
    else void 0 !== s6 && i5.push(c(s6));
    return i5;
  }
  static _$Eu(t5, s6) {
    const i5 = s6.attribute;
    return false === i5
      ? void 0
      : 'string' == typeof i5
      ? i5
      : 'string' == typeof t5
      ? t5.toLowerCase()
      : void 0;
  }
  constructor() {
    super(),
      (this._$Ep = void 0),
      (this.isUpdatePending = false),
      (this.hasUpdated = false),
      (this._$Em = null),
      this._$Ev();
  }
  _$Ev() {
    (this._$ES = new Promise((t5) => (this.enableUpdating = t5))),
      (this._$AL = /* @__PURE__ */ new Map()),
      this._$E_(),
      this.requestUpdate(),
      this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t5),
      void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(),
      s6 = this.constructor.elementProperties;
    for (const i5 of s6.keys())
      this.hasOwnProperty(i5) && (t5.set(i5, this[i5]), delete this[i5]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 =
      this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    (this.renderRoot ??= this.createRenderRoot()),
      this.enableUpdating(true),
      this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {}
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s6, i5) {
    this._$AK(t5, i5);
  }
  _$EC(t5, s6) {
    const i5 = this.constructor.elementProperties.get(t5),
      e6 = this.constructor._$Eu(t5, i5);
    if (void 0 !== e6 && true === i5.reflect) {
      const r7 = (
        void 0 !== i5.converter?.toAttribute ? i5.converter : u
      ).toAttribute(s6, i5.type);
      (this._$Em = t5),
        null == r7 ? this.removeAttribute(e6) : this.setAttribute(e6, r7),
        (this._$Em = null);
    }
  }
  _$AK(t5, s6) {
    const i5 = this.constructor,
      e6 = i5._$Eh.get(t5);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t6 = i5.getPropertyOptions(e6),
        r7 =
          'function' == typeof t6.converter
            ? { fromAttribute: t6.converter }
            : void 0 !== t6.converter?.fromAttribute
            ? t6.converter
            : u;
      (this._$Em = e6),
        (this[e6] = r7.fromAttribute(s6, t6.type)),
        (this._$Em = null);
    }
  }
  requestUpdate(t5, s6, i5) {
    if (void 0 !== t5) {
      if (
        ((i5 ??= this.constructor.getPropertyOptions(t5)),
        !(i5.hasChanged ?? f)(this[t5], s6))
      )
        return;
      this.P(t5, s6, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t5, s6, i5) {
    this._$AL.has(t5) || this._$AL.set(t5, s6),
      true === i5.reflect &&
        this._$Em !== t5 &&
        (this._$Ej ??= /* @__PURE__ */ new Set()).add(t5);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && (await t5), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
        for (const [t7, s7] of this._$Ep) this[t7] = s7;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0)
        for (const [s7, i5] of t6)
          true !== i5.wrapped ||
            this._$AL.has(s7) ||
            void 0 === this[s7] ||
            this.P(s7, this[s7], i5);
    }
    let t5 = false;
    const s6 = this._$AL;
    try {
      (t5 = this.shouldUpdate(s6)),
        t5
          ? (this.willUpdate(s6),
            this._$EO?.forEach((t6) => t6.hostUpdate?.()),
            this.update(s6))
          : this._$EU();
    } catch (s7) {
      throw ((t5 = false), this._$EU(), s7);
    }
    t5 && this._$AE(s6);
  }
  willUpdate(t5) {}
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()),
      this.hasUpdated || ((this.hasUpdated = true), this.firstUpdated(t5)),
      this.updated(t5);
  }
  _$EU() {
    (this._$AL = /* @__PURE__ */ new Map()), (this.isUpdatePending = false);
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
    (this._$Ej &&= this._$Ej.forEach((t6) => this._$EC(t6, this[t6]))),
      this._$EU();
  }
  updated(t5) {}
  firstUpdated(t5) {}
};
(b.elementStyles = []),
  (b.shadowRootOptions = { mode: 'open' }),
  (b[d('elementProperties')] = /* @__PURE__ */ new Map()),
  (b[d('finalized')] = /* @__PURE__ */ new Map()),
  p?.({ ReactiveElement: b }),
  (a.reactiveElementVersions ??= []).push('2.0.4');

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy('lit-html', { createHTML: (t5) => t5 }) : void 0;
var e3 = '$lit$';
var h2 = `lit$${(Math.random() + '').slice(9)}$`;
var o3 = '?' + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment('');
var c3 = (t5) =>
  null === t5 || ('object' != typeof t5 && 'function' != typeof t5);
var a2 = Array.isArray;
var u2 = (t5) => a2(t5) || 'function' == typeof t5?.[Symbol.iterator];
var d2 = '[ 	\n\f\r]';
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(
  `>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
  'g'
);
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 =
  (t5) =>
  (i5, ...s6) => ({ _$litType$: t5, strings: i5, values: s6 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for('lit-noChange');
var T = Symbol.for('lit-nothing');
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t5, i5) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty('raw'))
    throw Error('invalid template strings array');
  return void 0 !== s2 ? s2.createHTML(i5) : i5;
}
var P = (t5, i5) => {
  const s6 = t5.length - 1,
    o7 = [];
  let r7,
    l3 = 2 === i5 ? '<svg>' : '',
    c5 = f2;
  for (let i6 = 0; i6 < s6; i6++) {
    const s7 = t5[i6];
    let a3,
      u4,
      d3 = -1,
      y3 = 0;
    for (
      ;
      y3 < s7.length && ((c5.lastIndex = y3), (u4 = c5.exec(s7)), null !== u4);

    )
      (y3 = c5.lastIndex),
        c5 === f2
          ? '!--' === u4[1]
            ? (c5 = v)
            : void 0 !== u4[1]
            ? (c5 = _)
            : void 0 !== u4[2]
            ? ($.test(u4[2]) && (r7 = RegExp('</' + u4[2], 'g')), (c5 = m))
            : void 0 !== u4[3] && (c5 = m)
          : c5 === m
          ? '>' === u4[0]
            ? ((c5 = r7 ?? f2), (d3 = -1))
            : void 0 === u4[1]
            ? (d3 = -2)
            : ((d3 = c5.lastIndex - u4[2].length),
              (a3 = u4[1]),
              (c5 = void 0 === u4[3] ? m : '"' === u4[3] ? g : p2))
          : c5 === g || c5 === p2
          ? (c5 = m)
          : c5 === v || c5 === _
          ? (c5 = f2)
          : ((c5 = m), (r7 = void 0));
    const x2 = c5 === m && t5[i6 + 1].startsWith('/>') ? ' ' : '';
    l3 +=
      c5 === f2
        ? s7 + n3
        : d3 >= 0
        ? (o7.push(a3), s7.slice(0, d3) + e3 + s7.slice(d3) + h2 + x2)
        : s7 + h2 + (-2 === d3 ? i6 : x2);
  }
  return [C(t5, l3 + (t5[s6] || '<?>') + (2 === i5 ? '</svg>' : '')), o7];
};
var V = class _V {
  constructor({ strings: t5, _$litType$: s6 }, n5) {
    let r7;
    this.parts = [];
    let c5 = 0,
      a3 = 0;
    const u4 = t5.length - 1,
      d3 = this.parts,
      [f5, v3] = P(t5, s6);
    if (
      ((this.el = _V.createElement(f5, n5)),
      (E.currentNode = this.el.content),
      2 === s6)
    ) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r7 = E.nextNode()) && d3.length < u4; ) {
      if (1 === r7.nodeType) {
        if (r7.hasAttributes())
          for (const t6 of r7.getAttributeNames())
            if (t6.endsWith(e3)) {
              const i5 = v3[a3++],
                s7 = r7.getAttribute(t6).split(h2),
                e6 = /([.?@])?(.*)/.exec(i5);
              d3.push({
                type: 1,
                index: c5,
                name: e6[2],
                strings: s7,
                ctor:
                  '.' === e6[1] ? k : '?' === e6[1] ? H : '@' === e6[1] ? I : R,
              }),
                r7.removeAttribute(t6);
            }
            else
              t6.startsWith(h2) &&
                (d3.push({ type: 6, index: c5 }), r7.removeAttribute(t6));
        if ($.test(r7.tagName)) {
          const t6 = r7.textContent.split(h2),
            s7 = t6.length - 1;
          if (s7 > 0) {
            r7.textContent = i3 ? i3.emptyScript : '';
            for (let i5 = 0; i5 < s7; i5++)
              r7.append(t6[i5], l2()),
                E.nextNode(),
                d3.push({ type: 2, index: ++c5 });
            r7.append(t6[s7], l2());
          }
        }
      }
      else if (8 === r7.nodeType)
        if (r7.data === o3) d3.push({ type: 2, index: c5 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r7.data.indexOf(h2, t6 + 1)); )
            d3.push({ type: 7, index: c5 }), (t6 += h2.length - 1);
        }
      c5++;
    }
  }
  static createElement(t5, i5) {
    const s6 = r3.createElement('template');
    return (s6.innerHTML = t5), s6;
  }
};
function N(t5, i5, s6 = t5, e6) {
  if (i5 === w) return i5;
  let h5 = void 0 !== e6 ? s6._$Co?.[e6] : s6._$Cl;
  const o7 = c3(i5) ? void 0 : i5._$litDirective$;
  return (
    h5?.constructor !== o7 &&
      (h5?._$AO?.(false),
      void 0 === o7 ? (h5 = void 0) : ((h5 = new o7(t5)), h5._$AT(t5, s6, e6)),
      void 0 !== e6 ? ((s6._$Co ??= [])[e6] = h5) : (s6._$Cl = h5)),
    void 0 !== h5 && (i5 = N(t5, h5._$AS(t5, i5.values), h5, e6)),
    i5
  );
}
var S2 = class {
  constructor(t5, i5) {
    (this._$AV = []), (this._$AN = void 0), (this._$AD = t5), (this._$AM = i5);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const {
        el: { content: i5 },
        parts: s6,
      } = this._$AD,
      e6 = (t5?.creationScope ?? r3).importNode(i5, true);
    E.currentNode = e6;
    let h5 = E.nextNode(),
      o7 = 0,
      n5 = 0,
      l3 = s6[0];
    for (; void 0 !== l3; ) {
      if (o7 === l3.index) {
        let i6;
        2 === l3.type
          ? (i6 = new M(h5, h5.nextSibling, this, t5))
          : 1 === l3.type
          ? (i6 = new l3.ctor(h5, l3.name, l3.strings, this, t5))
          : 6 === l3.type && (i6 = new L(h5, this, t5)),
          this._$AV.push(i6),
          (l3 = s6[++n5]);
      }
      o7 !== l3?.index && ((h5 = E.nextNode()), o7++);
    }
    return (E.currentNode = r3), e6;
  }
  p(t5) {
    let i5 = 0;
    for (const s6 of this._$AV)
      void 0 !== s6 &&
        (void 0 !== s6.strings
          ? (s6._$AI(t5, s6, i5), (i5 += s6.strings.length - 2))
          : s6._$AI(t5[i5])),
        i5++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i5, s6, e6) {
    (this.type = 2),
      (this._$AH = T),
      (this._$AN = void 0),
      (this._$AA = t5),
      (this._$AB = i5),
      (this._$AM = s6),
      (this.options = e6),
      (this._$Cv = e6?.isConnected ?? true);
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
    (t5 = N(this, t5, i5)),
      c3(t5)
        ? t5 === T || null == t5 || '' === t5
          ? (this._$AH !== T && this._$AR(), (this._$AH = T))
          : t5 !== this._$AH && t5 !== w && this._(t5)
        : void 0 !== t5._$litType$
        ? this.$(t5)
        : void 0 !== t5.nodeType
        ? this.T(t5)
        : u2(t5)
        ? this.k(t5)
        : this._(t5);
  }
  S(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), (this._$AH = this.S(t5)));
  }
  _(t5) {
    this._$AH !== T && c3(this._$AH)
      ? (this._$AA.nextSibling.data = t5)
      : this.T(r3.createTextNode(t5)),
      (this._$AH = t5);
  }
  $(t5) {
    const { values: i5, _$litType$: s6 } = t5,
      e6 =
        'number' == typeof s6
          ? this._$AC(t5)
          : (void 0 === s6.el &&
              (s6.el = V.createElement(C(s6.h, s6.h[0]), this.options)),
            s6);
    if (this._$AH?._$AD === e6) this._$AH.p(i5);
    else {
      const t6 = new S2(e6, this),
        s7 = t6.u(this.options);
      t6.p(i5), this.T(s7), (this._$AH = t6);
    }
  }
  _$AC(t5) {
    let i5 = A.get(t5.strings);
    return void 0 === i5 && A.set(t5.strings, (i5 = new V(t5))), i5;
  }
  k(t5) {
    a2(this._$AH) || ((this._$AH = []), this._$AR());
    const i5 = this._$AH;
    let s6,
      e6 = 0;
    for (const h5 of t5)
      e6 === i5.length
        ? i5.push((s6 = new _M(this.S(l2()), this.S(l2()), this, this.options)))
        : (s6 = i5[e6]),
        s6._$AI(h5),
        e6++;
    e6 < i5.length &&
      (this._$AR(s6 && s6._$AB.nextSibling, e6), (i5.length = e6));
  }
  _$AR(t5 = this._$AA.nextSibling, i5) {
    for (this._$AP?.(false, true, i5); t5 && t5 !== this._$AB; ) {
      const i6 = t5.nextSibling;
      t5.remove(), (t5 = i6);
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && ((this._$Cv = t5), this._$AP?.(t5));
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
    (this.type = 1),
      (this._$AH = T),
      (this._$AN = void 0),
      (this.element = t5),
      (this.name = i5),
      (this._$AM = e6),
      (this.options = h5),
      s6.length > 2 || '' !== s6[0] || '' !== s6[1]
        ? ((this._$AH = Array(s6.length - 1).fill(new String())),
          (this.strings = s6))
        : (this._$AH = T);
  }
  _$AI(t5, i5 = this, s6, e6) {
    const h5 = this.strings;
    let o7 = false;
    if (void 0 === h5)
      (t5 = N(this, t5, i5, 0)),
        (o7 = !c3(t5) || (t5 !== this._$AH && t5 !== w)),
        o7 && (this._$AH = t5);
    else {
      const e7 = t5;
      let n5, r7;
      for (t5 = h5[0], n5 = 0; n5 < h5.length - 1; n5++)
        (r7 = N(this, e7[s6 + n5], i5, n5)),
          r7 === w && (r7 = this._$AH[n5]),
          (o7 ||= !c3(r7) || r7 !== this._$AH[n5]),
          r7 === T ? (t5 = T) : t5 !== T && (t5 += (r7 ?? '') + h5[n5 + 1]),
          (this._$AH[n5] = r7);
    }
    o7 && !e6 && this.j(t5);
  }
  j(t5) {
    t5 === T
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, t5 ?? '');
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t5) {
    this.element[this.name] = t5 === T ? void 0 : t5;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== T);
  }
};
var I = class extends R {
  constructor(t5, i5, s6, e6, h5) {
    super(t5, i5, s6, e6, h5), (this.type = 5);
  }
  _$AI(t5, i5 = this) {
    if ((t5 = N(this, t5, i5, 0) ?? T) === w) return;
    const s6 = this._$AH,
      e6 =
        (t5 === T && s6 !== T) ||
        t5.capture !== s6.capture ||
        t5.once !== s6.once ||
        t5.passive !== s6.passive,
      h5 = t5 !== T && (s6 === T || e6);
    e6 && this.element.removeEventListener(this.name, this, s6),
      h5 && this.element.addEventListener(this.name, this, t5),
      (this._$AH = t5);
  }
  handleEvent(t5) {
    'function' == typeof this._$AH
      ? this._$AH.call(this.options?.host ?? this.element, t5)
      : this._$AH.handleEvent(t5);
  }
};
var L = class {
  constructor(t5, i5, s6) {
    (this.element = t5),
      (this.type = 6),
      (this._$AN = void 0),
      (this._$AM = i5),
      (this.options = s6);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N(this, t5);
  }
};
var z = {
  P: e3,
  A: h2,
  C: o3,
  M: 1,
  L: P,
  R: S2,
  D: u2,
  V: N,
  I: M,
  H: R,
  N: H,
  U: I,
  B: k,
  F: L,
};
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push('3.1.2');
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
    super(...arguments),
      (this.renderOptions = { host: this }),
      (this._$Do = void 0);
  }
  createRenderRoot() {
    const t5 = super.createRenderRoot();
    return (this.renderOptions.renderBefore ??= t5.firstChild), t5;
  }
  update(t5) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t5),
      (this._$Do = j(i5, this.renderRoot, this.renderOptions));
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
(s3._$litElement$ = true),
  (s3[('finalized', 'finalized')] = true),
  globalThis.litElementHydrateSupport?.({ LitElement: s3 });
var r4 = globalThis.litElementPolyfillSupport;
r4?.({ LitElement: s3 });
(globalThis.litElementVersions ??= []).push('4.0.4');

// packages/utils/src/utils.js
var fatal = (
  message,
  {
    errorType = Error,
    metadata = {},
    onError = null,
    removeStackLines = 1,
  } = {}
) => {
  const error = new errorType(message);
  Object.assign(error, metadata);
  if (error.stack) {
    const stackLines = error.stack.split('\n');
    stackLines.splice(1, removeStackLines);
    error.stack = stackLines.join('\n');
  }
  const throwError = () => {
    if (typeof onError === 'function') {
      onError(error);
    }
    throw error;
  };
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(throwError);
  }
  else {
    setTimeout(throwError, 0);
  }
};
var isObject = (x2) => {
  return x2 !== null && typeof x2 == 'object';
};
var isString = (x2) => {
  return typeof x2 == 'string';
};
var isDOM = (element) => {
  return (
    element instanceof Element ||
    element instanceof Document ||
    element === window ||
    element instanceof DocumentFragment
  );
};
var isArray = (x2) => {
  return Array.isArray(x2);
};
var isFunction = (x2) => {
  return typeof x2 == 'function' || false;
};
var formatDate = function (date, format) {
  const pad = (n5) => (n5 < 10 ? '0' + n5 : n5);
  const dateMap = {
    YYYY: date.getFullYear(),
    YY: date.getFullYear().toString().slice(-2),
    MMMM: date.toLocaleString('default', { month: 'long' }),
    MMM: date.toLocaleString('default', { month: 'short' }),
    MM: pad(date.getMonth() + 1),
    M: date.getMonth() + 1,
    DD: pad(date.getDate()),
    D: date.getDate(),
    Do:
      date.getDate() +
        ['th', 'st', 'nd', 'rd'][
          ((((date.getDate() + 90) % 100) - 10) % 10) - 1
        ] || 'th',
    dddd: date.toLocaleString('default', { weekday: 'long' }),
    ddd: date.toLocaleString('default', { weekday: 'short' }),
    HH: pad(date.getHours()),
    h: date.getHours() % 12 || 12,
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    a: date.getHours() >= 12 ? 'pm' : 'am',
  };
  const formatMap = {
    LT: 'h:mm a',
    LTS: 'h:mm:ss a',
    L: 'MM/DD/YYYY',
    l: 'M/D/YYYY',
    LL: 'MMMM D, YYYY',
    ll: 'MMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm a',
    lll: 'MMM D, YYYY h:mm a',
    LLLL: 'dddd, MMMM D, YYYY h:mm a',
    llll: 'ddd, MMM D, YYYY h:mm a',
  };
  const expandedFormat = formatMap[format] || format;
  return expandedFormat
    .replace(
      /\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|h|mm|ss|a)\b/g,
      (match) => {
        return dateMap[match];
      }
    )
    .replace(/\[(.*?)\]/g, (match, p1) => p1);
};
var noop = function () {};
var wrapFunction = (x2) => {
  return isFunction(x2) ? x2 : () => x2;
};
var kebabToCamel = (str = '') => {
  return str.replace(/-./g, (m3) => m3[1].toUpperCase());
};
var capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var toTitleCase = (str = '') => {
  const stopWords = [
    'the',
    'a',
    'an',
    'and',
    'but',
    'for',
    'at',
    'by',
    'from',
    'to',
    'in',
    'on',
    'of',
    'or',
    'nor',
    'with',
    'as',
  ];
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !stopWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};
var unique = (arr) => {
  return Array.from(new Set(arr));
};
var last = (array, number = 1) => {
  const { length } = array;
  if (!length) return;
  if (number === 1) {
    return array[length - 1];
  }
  else {
    return array.slice(Math.max(length - number, 0));
  }
};
var findIndex = (array, callback) => {
  let matchedIndex = -1;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      matchedIndex = index;
      return false;
    }
  });
  return matchedIndex;
};
var remove = (array, callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);
  const index = findIndex(array, callback);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};
var inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
};
var keys = (obj) => {
  return Object.keys(obj);
};
var mapObject = function (obj, callback) {
  const objKeys = keys(obj).reverse();
  const length = objKeys.length;
  let index = length;
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
        }
        else {
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
};
var get = function (obj, string = '') {
  string = string.replace(/^\./, '').replace(/\[(\w+)\]/g, '.$1');
  const stringParts = string.split('.');
  for (let index = 0, length = stringParts.length; index < length; ++index) {
    const part = stringParts[index];
    if (obj !== null && typeof obj === 'object' && part in obj) {
      obj = obj[part];
    }
    else {
      return void 0;
    }
  }
  return obj;
};
var reverseKeys = (obj) => {
  const newObj = {};
  const pushValue = (key, value) => {
    if (isArray(newObj[key])) {
      newObj[key].push(value);
    }
    else if (newObj[key]) {
      newObj[key] = [newObj[key], value];
    }
    else {
      newObj[key] = value;
    }
  };
  Object.keys(obj).forEach((key) => {
    if (isArray(obj[key])) {
      each(obj[key], (subKey) => {
        pushValue(subKey, key);
      });
    }
    else {
      pushValue(obj[key], key);
    }
  });
  return newObj;
};
var clone = (src, seen = /* @__PURE__ */ new Map()) => {
  if (!src || typeof src !== 'object') return src;
  if (seen.has(src)) return seen.get(src);
  let copy;
  if (src.nodeType && 'cloneNode' in src) {
    copy = src.cloneNode(true);
    seen.set(src, copy);
  }
  else if (src instanceof Date) {
    copy = new Date(src.getTime());
    seen.set(src, copy);
  }
  else if (src instanceof RegExp) {
    copy = new RegExp(src);
    seen.set(src, copy);
  }
  else if (Array.isArray(src)) {
    copy = new Array(src.length);
    seen.set(src, copy);
    for (let i5 = 0; i5 < src.length; i5++) copy[i5] = clone(src[i5], seen);
  }
  else if (src instanceof Map) {
    copy = /* @__PURE__ */ new Map();
    seen.set(src, copy);
    for (const [k2, v3] of src.entries()) copy.set(k2, clone(v3, seen));
  }
  else if (src instanceof Set) {
    copy = /* @__PURE__ */ new Set();
    seen.set(src, copy);
    for (const v3 of src) copy.add(clone(v3, seen));
  }
  else if (src instanceof Object) {
    copy = {};
    seen.set(src, copy);
    for (const [k2, v3] of Object.entries(src)) copy[k2] = clone(v3, seen);
  }
  return copy;
};
var each = (obj, func, context) => {
  if (obj === null) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;
  if (Array.isArray(obj)) {
    for (let i5 = 0; i5 < obj.length; ++i5) {
      if (iteratee(obj[i5], i5, obj) === false) {
        break;
      }
    }
  }
  else if (isObject(obj)) {
    const objKeys = Object.keys(obj);
    for (const key of objKeys) {
      if (iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
  }
  return obj;
};
var escapeRegExp = function (string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};
var prettifyID = (num) => {
  num = parseInt(num, 10);
  if (num === 0) return '0';
  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (num > 0) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  return result;
};
function hashCode(input) {
  let str;
  if (
    input &&
    input.toString === Object.prototype.toString &&
    typeof input === 'object'
  ) {
    try {
      str = JSON.stringify(input);
    } catch (error) {
      console.error('Error serializing input', error);
      return 0;
    }
  }
  else {
    str = input.toString();
  }
  const seed = 305419896;
  const murmurhash = (key, seed2) => {
    let h1 = seed2;
    const c1 = 3432918353;
    const c22 = 461845907;
    const round = (k2) => {
      k2 = (k2 * c1) & 4294967295;
      k2 = (k2 << 15) | (k2 >>> 17);
      k2 = (k2 * c22) & 4294967295;
      h1 ^= k2;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = (h1 * 5 + 3864292196) & 4294967295;
    };
    for (let i5 = 0; i5 < key.length; i5 += 4) {
      let k2 =
        (key.charCodeAt(i5) & 255) |
        ((key.charCodeAt(i5 + 1) & 255) << 8) |
        ((key.charCodeAt(i5 + 2) & 255) << 16) |
        ((key.charCodeAt(i5 + 3) & 255) << 24);
      round(k2);
    }
    let k1 = 0;
    switch (key.length & 3) {
      case 3:
        k1 ^= (key.charCodeAt(key.length - 1) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(key.length - 2) & 255) << 8;
      case 1:
        k1 ^= key.charCodeAt(key.length - 3) & 255;
        round(k1);
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (h1 * 2246822507) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = (h1 * 3266489909) & 4294967295;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
  };
  let hash;
  hash = murmurhash(str, seed);
  hash = prettifyID(hash);
  return hash;
}
var generateID = () => {
  const num = Math.random() * 1e15;
  return prettifyID(num);
};
var isEqual = (a3, b3, options = {}) => {
  if (a3 === b3) return true;
  if (a3 && b3 && typeof a3 == 'object' && typeof b3 == 'object') {
    if (a3.constructor !== b3.constructor) return false;
    let length, i5, keys2;
    if (Array.isArray(a3)) {
      length = a3.length;
      if (length != b3.length) return false;
      for (i5 = length; i5-- !== 0; ) {
        if (!isEqual(a3[i5], b3[i5])) {
          return false;
        }
      }
      return true;
    }
    if (a3 instanceof Map && b3 instanceof Map) {
      if (a3.size !== b3.size) return false;
      for (i5 of a3.entries()) {
        if (!b3.has(i5[0])) {
          return false;
        }
      }
      for (i5 of a3.entries()) {
        if (!isEqual(i5[1], b3.get(i5[0]))) {
          return false;
        }
      }
      return true;
    }
    if (a3 instanceof Set && b3 instanceof Set) {
      if (a3.size !== b3.size) return false;
      for (i5 of a3.entries()) {
        if (!b3.has(i5[0])) {
          return false;
        }
      }
      return true;
    }
    if (ArrayBuffer.isView(a3) && ArrayBuffer.isView(b3)) {
      length = a3.length;
      if (length != b3.length) return false;
      for (i5 = length; i5-- !== 0; ) {
        if (a3[i5] !== b3[i5]) {
          return false;
        }
      }
      return true;
    }
    if (a3.constructor === RegExp) {
      return a3.source === b3.source && a3.flags === b3.flags;
    }
    if (a3.valueOf !== Object.prototype.valueOf) {
      return a3.valueOf() === b3.valueOf();
    }
    if (a3.toString !== Object.prototype.toString) {
      return a3.toString() === b3.toString();
    }
    keys2 = Object.keys(a3);
    length = keys2.length;
    if (length !== Object.keys(b3).length) return false;
    for (i5 = length; i5-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b3, keys2[i5])) return false;
    }
    for (i5 = length; i5-- !== 0; ) {
      let key = keys2[i5];
      if (!isEqual(a3[key], b3[key])) return false;
    }
    return true;
  }
  return a3 !== a3 && b3 !== b3;
};

// packages/templating/src/scanner.js
var Scanner = class _Scanner {
  static DEBUG_MODE = true;
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }
  matches(regex) {
    return regex.test(this.rest());
  }
  rest() {
    return this.input.slice(this.pos);
  }
  isEOF() {
    return this.pos >= this.input.length;
  }
  // get character at current position
  peek() {
    return this.input.charAt(this.pos);
  }
  consume(pattern) {
    const regex =
      typeof pattern === 'string'
        ? new RegExp(escapeRegExp(pattern))
        : new RegExp(pattern);
    const substring = this.input.substring(this.pos);
    const match = regex.exec(substring);
    if (match && match.index === 0) {
      this.pos += match[0].length;
      return match[0];
    }
    return null;
  }
  consumeUntil(pattern) {
    const regex =
      typeof pattern === 'string'
        ? new RegExp(escapeRegExp(pattern))
        : new RegExp(pattern);
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
    const regex =
      typeof pattern === 'string'
        ? new RegExp(escapeRegExp(pattern), 'gm')
        : new RegExp(pattern, 'gm');
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
  getContext() {
    let insideTag = false;
    let attributeName = '';
    let i5 = this.pos - 1;
    let tagPos;
    while (i5 >= 0) {
      if (this.input[i5] === '>') break;
      if (this.input[i5] === '<') {
        insideTag = true;
        tagPos = i5;
        break;
      }
      i5--;
    }
    if (insideTag) {
      const tagText = this.input.substring(tagPos, this.pos);
      const attrPattern = /([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/;
      const attrMatch = tagText.match(attrPattern);
      const attrName = attrMatch ? attrMatch[1] : '';
      const booleanAttributes = [
        'allowfullscreen',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'inert',
        'ismap',
        'itemscope',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected',
      ];
      let booleanAttribute = false;
      if (booleanAttributes.includes(attrName)) {
        booleanAttribute = true;
      }
      else {
        const quotedAttrPattern = /([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/;
        const quotedAttrMatch = tagText.match(quotedAttrPattern);
        const quotedAttrName = quotedAttrMatch ? quotedAttrMatch[1] : '';
        booleanAttribute = attrName !== quotedAttrName;
      }
      if (attrName) {
        return {
          insideTag: true,
          attribute: attrName,
          booleanAttribute,
        };
      }
    }
    return {
      insideTag,
    };
  }
  fatal(msg) {
    msg = msg || 'Parse error';
    const lines = this.input.split('\n');
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
    const consoleMsg = contextLines
      .map((line, idx) => {
        const isErrLine = lineNumber - startLine === idx;
        return `%c${line}`;
      })
      .join('\n');
    const normalStyle = 'color: grey';
    const errorStyle = 'color: red; font-weight: bold';
    if (_Scanner.DEBUG_MODE) {
      if (globalThis.document) {
        let errorHTML = '';
        each(contextLines, (line, index) => {
          const style =
            index < linesBefore || index > linesBefore
              ? normalStyle
              : errorStyle;
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
        msg + '\n' + consoleMsg,
        ...contextLines.map((_2, idx) =>
          lineNumber - startLine === idx ? errorStyle : normalStyle
        )
      );
      const e6 = new Error(msg);
      throw e6;
    }
  }
};

// packages/templating/src/compiler.js
var TemplateCompiler = class _TemplateCompiler {
  constructor(template) {
    this.template = template || '';
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
    EXPRESSION: /^{{\s*/,
  };
  static templateRegExp = {
    verbose: {
      keyword: /^template\W/g,
      properties: /(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,
    },
    standard: /(\w.*?)($|\s)/gm,
    dataObject: /(\w+)\s*:\s*([^,}]+)/g,
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
          const context = scanner2.getContext();
          scanner2.consume(tagRegExp[type]);
          const content = this.getValue(scanner2.consumeUntil('}}').trim());
          scanner2.consume('}}');
          return { type, content, ...context };
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
          type: tag.type.toLowerCase(),
        };
        switch (tag.type) {
          case 'IF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
              branches: [],
            };
            contentTarget.push(newNode);
            conditionStack.push(newNode);
            contentStack.push(newNode);
            contentBranch = newNode;
            break;
          case 'ELSEIF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
            };
            if (!conditionTarget) {
              scanner.returnTo(tagRegExp.ELSEIF);
              scanner.fatal(
                '{{elseif}} encountered without matching if condition'
              );
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;
          case 'ELSE':
            newNode = {
              ...newNode,
              content: [],
            };
            if (!conditionTarget) {
              scanner.returnTo(tagRegExp.ELSE);
              scanner.fatal(
                '{{else}} encountered without matching if condition'
              );
              break;
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;
          case 'HTML_EXPRESSION':
            newNode = {
              ...newNode,
              type: 'expression',
              unsafeHTML: true,
              value: tag.content,
            };
            contentTarget.push(newNode);
            scanner.consume('}');
            break;
          case 'EXPRESSION':
            newNode = {
              ...newNode,
              value: tag.content,
            };
            if (tag.booleanAttribute) {
              newNode.ifDefined = true;
            }
            contentTarget.push(newNode);
            break;
          case 'TEMPLATE':
            const templateInfo = this.parseTemplateString(tag.content);
            newNode = {
              ...newNode,
              ...templateInfo,
            };
            contentTarget.push(newNode);
            break;
          case 'SLOT':
            newNode = {
              ...newNode,
              name: tag.content,
            };
            contentTarget.push(newNode);
            break;
          case 'CLOSE_IF':
            if (conditionStack.length == 0) {
              scanner.returnTo(tagRegExp.CLOSE_IF);
              scanner.fatal('{{/if}} close tag found without open if tag');
            }
            stack.pop();
            contentStack.pop();
            conditionStack.pop();
            contentBranch = last(contentStack);
            break;
          case 'EACH':
            const contentParts = tag.content.split(' in ');
            let iterateOver;
            let iterateAs;
            if (contentParts.length > 1) {
              iterateAs = contentParts[0].trim();
              iterateOver = contentParts[1].trim();
            }
            else {
              iterateOver = contentParts[0].trim();
            }
            newNode = {
              ...newNode,
              over: iterateOver,
              content: [],
            };
            if (iterateAs) {
              newNode.as = iterateAs;
            }
            contentTarget.push(newNode);
            contentBranch = newNode;
            break;
          case 'CLOSE_EACH':
            stack.pop();
            contentBranch = last(contentStack);
            break;
        }
      }
      else {
        const OPEN_TAG = /\{\{/;
        const html = scanner.consumeUntil(OPEN_TAG);
        if (html) {
          const htmlNode = { type: 'html', html };
          contentTarget.push(htmlNode);
        }
      }
    }
    return ast;
  }
  getValue(expression) {
    if (expression == 'true') {
      return true;
    }
    else if (expression == 'false') {
      return false;
    }
    else if (!Number.isNaN(parseFloat(expression, 10))) {
      return +expression;
    }
    return expression;
  }
  parseTemplateString(expression = '') {
    const regExp = _TemplateCompiler.templateRegExp;
    let templateInfo = {};
    if (regExp.verbose.keyword.exec(expression)) {
      const matches = [...expression.matchAll(regExp.verbose.properties)];
      each(matches, (match, index) => {
        const property = match[1];
        const value = this.getObjectFromString(match[2]);
        templateInfo[property] = value;
      });
    }
    else {
      let data = {};
      const matches = [...expression.matchAll(regExp.standard)];
      each(matches, (match, index) => {
        if (index == 0) {
          templateInfo.name = `'${match[0].trim()}'`;
        }
        else {
          const parts = match[0].split('=');
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
  getObjectFromString(objectString = '') {
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

// packages/query/src/query.js
var Query = class _Query {
  static eventHandlers = [];
  constructor(selector, root = document) {
    let elements = [];
    if (!selector) {
      return;
    }
    if (isArray(selector)) {
      elements = selector;
    }
    else if (isString(selector)) {
      elements = root.querySelectorAll(selector);
    }
    else if (isDOM(selector)) {
      elements = [selector];
    }
    else if (selector instanceof NodeList) {
      elements = selector;
    }
    this.length = elements.length;
    Object.assign(this, elements);
  }
  removeAllEvents() {
    _Query._eventHandlers = [];
  }
  find(selector) {
    const elements = Array.from(this).flatMap((el) =>
      Array.from(el.querySelectorAll(selector))
    );
    return new _Query(elements);
  }
  parent(selector) {
    const parents = Array.from(this)
      .map((el) => el.parentElement)
      .filter(Boolean);
    return selector
      ? new _Query(parents).filter(selector)
      : new _Query(parents);
  }
  children(selector) {
    const allChildren = Array.from(this).flatMap((el) =>
      Array.from(el.children)
    );
    const filteredChildren = selector
      ? allChildren.filter((child) => child.matches(selector))
      : allChildren;
    return new _Query(filteredChildren);
  }
  filter(selectorOrFunction) {
    let filteredElements = [];
    if (typeof selectorOrFunction === 'string') {
      filteredElements = Array.from(this).filter((el) =>
        el.matches(selectorOrFunction)
      );
    }
    else if (typeof selectorOrFunction === 'function') {
      filteredElements = Array.from(this).filter(selectorOrFunction);
    }
    return new _Query(filteredElements);
  }
  not(selector) {
    const filteredElements = Array.from(this).filter(
      (el) => !el.matches(selector)
    );
    return new _Query(filteredElements);
  }
  closest(selector) {
    const closest = Array.from(this)
      .map((el) => el.closest(selector))
      .filter(Boolean);
    return new _Query(closest);
  }
  on(event, targetSelectorOrHandler, handlerOrOptions, options) {
    const eventHandlers = [];
    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    }
    else if (isString(targetSelectorOrHandler)) {
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    }
    else if (isFunction(targetSelectorOrHandler)) {
      handler = targetSelectorOrHandler;
    }
    const abortController = options?.abortController || new AbortController();
    const signal = abortController.signal;
    Array.from(this).forEach((el) => {
      let delegateHandler;
      if (targetSelector) {
        delegateHandler = (e6) => {
          for (
            let target = e6.target;
            target && target !== el;
            target = target.parentNode
          ) {
            if (target.matches(targetSelector)) {
              handler.call(target, e6);
              break;
            }
          }
        };
      }
      el.addEventListener(event, delegateHandler || handler, { signal });
      const eventHandler = {
        el,
        event,
        eventListener: delegateHandler || handler,
        abortController,
        delegated: targetSelector !== void 0,
        handler,
        abort: () => abortController.abort(),
      };
      eventHandlers.push(eventHandler);
    });
    if (!_Query._eventHandlers) {
      _Query._eventHandlers = [];
    }
    _Query._eventHandlers.push(...eventHandlers);
    return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
  }
  off(event, handler) {
    _Query._eventHandlers = _Query._eventHandlers.filter((eventHandler) => {
      if (
        eventHandler.event === event &&
        (!handler ||
          handler?.eventListener == eventHandler.eventListener ||
          eventHandler.eventListener === handler ||
          eventHandler.handler === handler)
      ) {
        eventHandler.el.removeEventListener(event, eventHandler.eventListener);
        return false;
      }
      return true;
    });
    return this;
  }
  remove() {
    Array.from(this).forEach((el) => el.remove());
    return this;
  }
  addClass(classNames) {
    const classesToAdd = classNames.split(' ');
    Array.from(this).forEach((el) => el.classList.add(...classesToAdd));
    return this;
  }
  hasClass(className) {
    return Array.from(this).some((el) => el.classList.contains(className));
  }
  removeClass(classNames) {
    const classesToRemove = classNames.split(' ');
    Array.from(this).forEach((el) => el.classList.remove(...classesToRemove));
    return this;
  }
  html(newHTML) {
    if (newHTML !== void 0) {
      Array.from(this).forEach((el) => (el.innerHTML = newHTML));
      return this;
    }
    else if (this.length) {
      return this[0].innerHTML;
    }
  }
  outerHTML(newHTML) {
    if (newHTML !== void 0) {
      Array.from(this).forEach((el) => (el.outerHTML = newHTML));
      return this;
    }
    else if (this.length) {
      return this[0].outerHTML;
    }
  }
  text(newText) {
    if (newText !== void 0) {
      Array.from(this).forEach((el) => (el.textContent = newText));
      return this;
    }
    else {
      const childNodes = (el) => {
        return el.nodeName === 'SLOT'
          ? el.assignedNodes({ flatten: true })
          : el.childNodes;
      };
      const values = Array.from(this).map((el) =>
        this.getTextContentRecursive(childNodes(el))
      );
      return values.length > 1 ? values : values[0];
    }
  }
  // Helper function to recursively get text content
  getTextContentRecursive(nodes) {
    return Array.from(nodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
        else if (node.nodeName === 'SLOT') {
          const slotNodes = node.assignedNodes({ flatten: true });
          return this.getTextContentRecursive(slotNodes);
        }
        else {
          return this.getTextContentRecursive(node.childNodes);
        }
      })
      .join('')
      .trim();
  }
  value(newValue) {
    if (newValue !== void 0) {
      Array.from(this).forEach((el) => {
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          el.value = newValue;
        }
      });
      return this;
    }
    else {
      const values = Array.from(this).map((el) => {
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          return el.value;
        }
        return void 0;
      });
      return values.length > 1 ? values : values[0];
    }
  }
  // alias
  val(...args) {
    return this.value(...args);
  }
  css(property, value) {
    if (typeof property === 'object') {
      Object.entries(property).forEach(([prop, val]) => {
        Array.from(this).forEach((el) => (el.style[prop] = val));
      });
    }
    else if (value !== void 0) {
      Array.from(this).forEach((el) => (el.style[property] = value));
    }
    else if (this.length) {
      const properties = Array.from(this).map((el) => el.style[property]);
      return properties.length > 1 ? properties : properties[0];
    }
    return this;
  }
  attr(attribute, value) {
    if (typeof attribute === 'object') {
      Object.entries(attribute).forEach(([attr, val]) => {
        Array.from(this).forEach((el) => el.setAttribute(attr, val));
      });
    }
    else if (value !== void 0) {
      Array.from(this).forEach((el) => el.setAttribute(attribute, value));
    }
    else if (this.length) {
      const attributes = Array.from(this).map((el) =>
        el.getAttribute(attribute)
      );
      return attributes.length > 1 ? attributes : attributes[0];
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
    }
    else {
      return Array.from(this);
    }
  }
  eq(index) {
    return new _Query(this[index]);
  }
  // non jquery variant to return only immediate text node
  textNode() {
    return Array.from(this)
      .map((el) => {
        return Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.nodeValue)
          .join('');
      })
      .join('');
  }
  focus() {
    return this[0].focus();
  }
  blur() {
    return this[0].blur();
  }
};

// packages/query/src/index.js
function $2(selector, root = document) {
  return new Query(selector, root);
}

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
  changed(context) {
    this.subscribers.forEach((subscriber) => subscriber.invalidate(context));
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
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => _Reaction.flush());
      }
      else {
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
  invalidate(context) {
    this.active = true;
    if (context) {
      this.context = context;
    }
    _Reaction.pendingReactions.add(this);
    _Reaction.scheduleFlush();
  }
  stop() {
    if (!this.active) return;
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
        dep.changed();
      }
      value = clone(newValue);
    });
    comp.run();
    dep.depend();
    return value;
  }
  static getSource() {
    if (
      !_Reaction.current ||
      !_Reaction.current.context ||
      !_Reaction.current.context.trace
    ) {
      console.log('No source available or no current reaction.');
      return;
    }
    let trace = _Reaction.current.context.trace;
    trace = trace.split('\n').slice(2).join('\n');
    trace = `Reaction triggered by:
${trace}`;
    console.info(trace);
    return trace;
  }
};

// node_modules/lit-html/directive.js
var t3 = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6,
};
var e4 =
  (t5) =>
  (...e6) => ({ _$litDirective$: t5, values: e6 });
var i4 = class {
  constructor(t5) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e6, i5) {
    (this._$Ct = t5), (this._$AM = e6), (this._$Ci = i5);
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
var f3 = (o7) => void 0 === o7.strings;
var s4 = () => document.createComment('');
var r5 = (o7, i5, n5) => {
  const e6 = o7._$AA.parentNode,
    l3 = void 0 === i5 ? o7._$AB : i5._$AA;
  if (void 0 === n5) {
    const i6 = e6.insertBefore(s4(), l3),
      c5 = e6.insertBefore(s4(), l3);
    n5 = new t4(i6, c5, o7, o7.options);
  }
  else {
    const t5 = n5._$AB.nextSibling,
      i6 = n5._$AM,
      c5 = i6 !== o7;
    if (c5) {
      let t6;
      n5._$AQ?.(o7),
        (n5._$AM = o7),
        void 0 !== n5._$AP && (t6 = o7._$AU) !== i6._$AU && n5._$AP(t6);
    }
    if (t5 !== l3 || c5) {
      let o8 = n5._$AA;
      for (; o8 !== t5; ) {
        const t6 = o8.nextSibling;
        e6.insertBefore(o8, l3), (o8 = t6);
      }
    }
  }
  return n5;
};
var v2 = (o7, t5, i5 = o7) => (o7._$AI(t5, i5), o7);
var u3 = {};
var m2 = (o7, t5 = u3) => (o7._$AH = t5);
var p3 = (o7) => o7._$AH;
var h3 = (o7) => {
  o7._$AP?.(false, true);
  let t5 = o7._$AA;
  const i5 = o7._$AB.nextSibling;
  for (; t5 !== i5; ) {
    const o8 = t5.nextSibling;
    t5.remove(), (t5 = o8);
  }
};

// node_modules/lit-html/async-directive.js
var s5 = (i5, t5) => {
  const e6 = i5._$AN;
  if (void 0 === e6) return false;
  for (const i6 of e6) i6._$AO?.(t5, false), s5(i6, t5);
  return true;
};
var o4 = (i5) => {
  let t5, e6;
  do {
    if (void 0 === (t5 = i5._$AM)) break;
    (e6 = t5._$AN), e6.delete(i5), (i5 = t5);
  } while (0 === e6?.size);
};
var r6 = (i5) => {
  for (let t5; (t5 = i5._$AM); i5 = t5) {
    let e6 = t5._$AN;
    if (void 0 === e6) t5._$AN = e6 = /* @__PURE__ */ new Set();
    else if (e6.has(i5)) break;
    e6.add(i5), c4(t5);
  }
};
function h4(i5) {
  void 0 !== this._$AN
    ? (o4(this), (this._$AM = i5), r6(this))
    : (this._$AM = i5);
}
function n4(i5, t5 = false, e6 = 0) {
  const r7 = this._$AH,
    h5 = this._$AN;
  if (void 0 !== h5 && 0 !== h5.size)
    if (t5)
      if (Array.isArray(r7))
        for (let i6 = e6; i6 < r7.length; i6++) s5(r7[i6], false), o4(r7[i6]);
      else null != r7 && (s5(r7, false), o4(r7));
    else s5(this, i5);
}
var c4 = (i5) => {
  i5.type == t3.CHILD && ((i5._$AP ??= n4), (i5._$AQ ??= h4));
};
var f4 = class extends i4 {
  constructor() {
    super(...arguments), (this._$AN = void 0);
  }
  _$AT(i5, t5, e6) {
    super._$AT(i5, t5, e6), r6(this), (this.isConnected = i5._$AU);
  }
  _$AO(i5, t5 = true) {
    i5 !== this.isConnected &&
      ((this.isConnected = i5),
      i5 ? this.reconnected?.() : this.disconnected?.()),
      t5 && (s5(this, i5), o4(this));
  }
  setValue(t5) {
    if (f3(this._$Ct)) this._$Ct._$AI(t5, this);
    else {
      const i5 = [...this._$Ct._$AH];
      (i5[this._$Ci] = t5), this._$Ct._$AI(i5, this, 0);
    }
  }
  disconnected() {}
  reconnected() {}
};

// node_modules/lit-html/directives/unsafe-html.js
var e5 = class extends i4 {
  constructor(i5) {
    if ((super(i5), (this.it = T), i5.type !== t3.CHILD))
      throw Error(
        this.constructor.directiveName + '() can only be used in child bindings'
      );
  }
  render(r7) {
    if (r7 === T || null == r7) return (this._t = void 0), (this.it = r7);
    if (r7 === w) return r7;
    if ('string' != typeof r7)
      throw Error(
        this.constructor.directiveName + '() called with a non-string value'
      );
    if (r7 === this.it) return this._t;
    this.it = r7;
    const s6 = [r7];
    return (
      (s6.raw = s6),
      (this._t = {
        _$litType$: this.constructor.resultType,
        strings: s6,
        values: [],
      })
    );
  }
};
(e5.directiveName = 'unsafeHTML'), (e5.resultType = 1);
var o5 = e4(e5);

// node_modules/lit-html/directives/if-defined.js
var o6 = (o7) => o7 ?? T;

// packages/component/src/lit/directives/reactive-data.js
var ReactiveData = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }
  render(computeFunc, settings = {}) {
    if (this.reaction) {
      this.reaction.stop();
    }
    const getValue = (value2) => {
      let reactiveValue = computeFunc();
      if (settings.ifDefined) {
        if (inArray(reactiveValue, [void 0, null, false, 0])) {
          return o6(void 0);
        }
      }
      return reactiveValue;
    };
    let value;
    this.reaction = Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      value = getValue();
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
  reconnected() {}
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
      }
      else if (conditional.branches?.length) {
        let match = false;
        each(conditional.branches, (branch) => {
          if (!match && branch.type == 'elseif' && branch.condition()) {
            match = true;
            html = branch.content();
          }
          else if (!match && branch.type == 'else') {
            match = true;
            html = branch.content();
          }
        });
      }
      else {
        html = T;
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
  reconnected() {}
};
var reactiveConditional = e4(ReactiveConditionalDirective);

// packages/component/src/lit/directives/reactive-each.js
var generateMap = (list, start, end) => {
  const map = /* @__PURE__ */ new Map();
  for (let i5 = start; i5 <= end; i5++) {
    map.set(list[i5], i5);
  }
  return map;
};
var ReactiveEachDirective = class extends f4 {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.part = null;
    this.eachCondition = null;
    this.host = partInfo.options.host;
    this.initialized = false;
    this.childParts = [];
    this.templateCachedIndex = /* @__PURE__ */ new Map();
    this.templateCachedData = /* @__PURE__ */ new Map();
    this.templateCache = /* @__PURE__ */ new Map();
  }
  render(eachCondition, data) {
    this.eachCondition = eachCondition;
    if (!this.reaction) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return T;
        }
        const items = this.getItems(eachCondition);
        this.updateItems(items);
      });
    }
    return this.getValuesAndKeys().values.map(
      (value, index) => value(index).content
    );
  }
  update(part, settings) {
    this.part = part;
    return this.render.apply(this, settings);
  }
  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
  getItems() {
    let items = this.eachCondition.over() || [];
    items = items.map((item) => {
      if (isObject(item)) {
        item._id = item._id || hashCode(item);
      }
      return item;
    });
    return items;
  }
  getValuesAndKeys(items = this.getItems()) {
    const keys2 = [];
    const values = [];
    each(items, (item, index) => {
      keys2[index] = this.getItemID(item, index);
      values[index] = (passedIndex) => {
        return this.getTemplate(item, passedIndex);
      };
    });
    return {
      values,
      keys: keys2,
    };
  }
  getItemID(item, index) {
    if (isObject(item)) {
      return item._id || item.id || item.key || item.hash || index;
    }
    if (isString) {
      return item;
    }
    return index;
  }
  getEachData(item, index, alias) {
    return alias
      ? { [alias]: item, '@index': index }
      : { ...item, '@index': index };
  }
  getTemplate(item, index) {
    let eachData = this.getEachData(item, index, this.eachCondition.as);
    const itemID = this.getItemID(item, index);
    const sameIndex = this.templateCachedIndex.get(itemID) == index;
    const sameData = isEqual(this.templateCachedData.get(itemID), eachData);
    if (sameIndex && sameData) {
      return {
        cached: true,
        content: this.templateCache.get(itemID),
      };
    }
    else {
      const content = this.eachCondition.content(eachData);
      this.templateCachedIndex.set(itemID, index);
      this.templateCachedData.set(itemID, clone(eachData));
      this.templateCache.set(itemID, content);
      return {
        cached: false,
        content,
      };
    }
  }
  /*
    Adapted from Lit's Repeat Directive
    The key difference is we dont want to rerender templates (call content())
    if the position doesnt move.
  */
  updateItems(items = this.getItems()) {
    const containerPart = this.part;
    const oldParts = p3(containerPart);
    const { values: newValues, keys: newKeys } = this.getValuesAndKeys(items);
    if (!Array.isArray(oldParts)) {
      this._itemKeys = newKeys;
      return newValues;
    }
    const oldKeys = (this._itemKeys ??= []);
    const newParts = [];
    let newKeyToIndexMap;
    let oldKeyToIndexMap;
    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1;
    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        oldHead++;
      }
      else if (oldParts[oldTail] === null) {
        oldTail--;
      }
      else if (oldKeys[oldHead] === newKeys[newHead]) {
        const template = newValues[newHead](newHead);
        if (template.cached) {
          newParts[newHead] = oldParts[oldHead];
        }
        else {
          newParts[newHead] = v2(oldParts[oldHead], template.content);
        }
        oldHead++;
        newHead++;
      }
      else if (oldKeys[oldTail] === newKeys[newTail]) {
        newParts[newTail] = v2(
          oldParts[oldTail],
          newValues[newTail](newTail).content
        );
        oldTail--;
        newTail--;
      }
      else if (oldKeys[oldHead] === newKeys[newTail]) {
        newParts[newTail] = v2(
          oldParts[oldHead],
          newValues[newTail](newTail).content
        );
        r5(containerPart, newParts[newTail + 1], oldParts[oldHead]);
        oldHead++;
        newTail--;
      }
      else if (oldKeys[oldTail] === newKeys[newHead]) {
        newParts[newHead] = v2(
          oldParts[oldTail],
          newValues[newHead](newHead).content
        );
        r5(containerPart, oldParts[oldHead], oldParts[oldTail]);
        oldTail--;
        newHead++;
      }
      else {
        if (newKeyToIndexMap === void 0) {
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }
        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          h3(oldParts[oldHead]);
          oldHead++;
        }
        else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          h3(oldParts[oldTail]);
          oldTail--;
        }
        else {
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== void 0 ? oldParts[oldIndex] : null;
          if (oldPart === null) {
            const newPart = r5(containerPart, oldParts[oldHead]);
            v2(newPart, newValues[newHead](newHead).content);
            newParts[newHead] = newPart;
          }
          else {
            newParts[newHead] = v2(
              oldPart,
              newValues[newHead](newHead).content
            );
            r5(containerPart, oldParts[oldHead], oldPart);
            oldParts[oldIndex] = null;
          }
          newHead++;
        }
      }
    }
    while (newHead <= newTail) {
      const newPart = r5(containerPart, newParts[newTail + 1]);
      v2(newPart, newValues[newHead]().content);
      newParts[newHead++] = newPart;
    }
    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];
      if (oldPart !== null) {
        h3(oldPart);
      }
    }
    this._itemKeys = newKeys;
    m2(containerPart, newParts);
    return w;
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
        fatal(
          `Could not find template named "${getTemplateName()}`,
          subTemplates
        );
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
  update(part, settings) {
    this.part = part;
    return this.render.apply(this, settings);
  }
  reconnected() {}
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
  maybe(expr, trueClass = '', falseClass = '') {
    return expr ? trueClass + ' ' : falseClass;
  },
  activeIf: (expr) => {
    return Helpers.maybe(expr, 'active', '');
  },
  selectedIf: (expr) => {
    return Helpers.maybe(expr, 'selected', '');
  },
  capitalize: (text = '') => {
    return capitalize(text);
  },
  titleCase: (text = '') => {
    return toTitleCase(text);
  },
  disabledIf: (expr) => {
    return Helpers.maybe(expr, 'disabled', '');
  },
  checkedIf: (expr) => {
    return Helpers.maybe(expr, 'checked', '');
  },
  isEqual: (a3, b3) => {
    return a3 == b3;
  },
  maybePlural(value, plural = 's') {
    return value == 1 ? '' : plural;
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
  formatDate: (date = /* @__PURE__ */ new Date(), format = 'L') => {
    return formatDate(date, format);
  },
  formatDateTime: (date = /* @__PURE__ */ new Date(), format = 'LLL') => {
    return formatDate(date, format);
  },
  formatDateTimeSeconds: (
    date = /* @__PURE__ */ new Date(),
    format = 'LTS'
  ) => {
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
  },
  reactiveDebug() {
    Reaction.getSource();
    debugger;
  },
  guard: Reaction.guard,
  nonreactive: Reaction.nonreactive,
};

// packages/component/src/lit/renderer.js
var LitRenderer = class _LitRenderer {
  static helpers = Helpers;
  static addHelper(name, helper) {
    _LitRenderer.helpers[name] = helper;
  }
  constructor({ ast, data, subTemplates }) {
    this.ast = ast || '';
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
  render({ ast = this.ast, data = this.data } = {}) {
    this.resetHTML();
    this.readAST({ ast, data });
    this.clearTemp();
    this.litTemplate = x.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }
  readAST({ ast = this.ast, data = this.data } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case 'html':
          this.addHTML(node.html);
          break;
        case 'expression':
          const value = this.evaluateExpression(node.value, data, {
            unsafeHTML: node.unsafeHTML,
            ifDefined: node.ifDefined,
            asDirective: true,
          });
          this.addValue(value);
          break;
        case 'if':
          this.addValue(this.evaluateConditional(node, data));
          break;
        case 'each':
          this.addValue(this.evaluateEach(node, data));
          break;
        case 'template':
          this.addValue(this.evaluateTemplate(node, data));
          break;
        case 'slot':
          if (node.name) {
            this.addHTML(`<slot name="${node.name}"></slot>`);
          }
          else {
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
      if (key == 'branches') {
        return value.map((branch) => mapObject(branch, directiveMap));
      }
      if (key == 'condition') {
        return () => this.evaluateExpression(value, data);
      }
      if (key == 'content') {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }
  evaluateEach(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value, data);
          return computedValue;
        };
      }
      if (key == 'content') {
        return (eachData) => {
          return this.renderContent({
            ast: value,
            data: { ...data, ...eachData },
          });
        };
      }
      return value;
    };
    let eachArguments = mapObject(node, directiveMap);
    return reactiveEach(eachArguments, data);
  }
  evaluateTemplate(node, data = {}) {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString, data);
      return value;
    };
    const getTemplateName = () => getValue(node.name);
    const staticValues = mapObject(node.data || {}, (value) => {
      return () => Reaction.nonreactive(() => getValue(value));
    });
    const reactiveValues = mapObject(node.reactiveData || {}, (value) => {
      return () => getValue(value);
    });
    const templateData = {
      ...staticValues,
      ...reactiveValues,
    };
    return renderTemplate({
      subTemplates: this.subTemplates,
      getTemplateName,
      data: templateData,
      parentTemplate: data,
    });
  }
  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(
    expression,
    data = this.data,
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {}
  ) {
    if (typeof expression === 'string') {
      if (asDirective) {
        return reactiveData(
          () => this.lookupExpressionValue(expression, data),
          { ifDefined, unsafeHTML }
        );
      }
      else {
        return this.lookupExpressionValue(expression, data);
      }
    }
    return expression;
  }
  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  // i.e. {{format sayWord 'balloon' 'dog'}} => format(sayWord('balloon', 'dog'))
  lookupExpressionValue(
    expressionString = '',
    data = {},
    { unsafeHTML = false } = {}
  ) {
    const stringRegExp = /^\'(.*)\'$/;
    const stringMatches = expressionString.match(stringRegExp);
    if (stringMatches && stringMatches.length > 0) {
      return stringMatches[1];
    }
    const expressions = expressionString.split(' ').reverse();
    let funcArguments = [];
    let result;
    each(expressions, (expression, index) => {
      const getDeepValue = (obj, path) =>
        path.split('.').reduce((acc, part) => {
          const current = wrapFunction(acc)();
          if (current == void 0) {
            fatal(`Error evaluating expression "${expressionString}"`);
          }
          return current[part];
        }, obj);
      const getContext = () => {
        const path = expression.split('.').slice(0, -1).join('.');
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
      }
      else if (dataValue !== void 0) {
        result =
          dataValue?.constructor.name === '_ReactiveVar'
            ? dataValue.value
            : dataValue;
      }
      else if (
        (stringMatches2 = stringRegExp.exec(expression)) !== null &&
        stringMatches2.length > 1
      ) {
        result = stringMatches2[1];
      }
      else if (!Number.isNaN(parseFloat(expression))) {
        result = Number(expression);
      }
      else {
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
    this.addHTML('');
  }
  addValue(expression) {
    this.addHTMLSpacer();
    this.expressions.push(expression);
    this.lastHTML = false;
    this.addHTMLSpacer();
  }
  // subtrees are rendered as separate contexts
  renderContent({ ast, data, subTemplates }) {
    return new _LitRenderer({
      ast,
      data,
      subTemplates: this.subTemplates,
    }).render();
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
    events: events2,
    subTemplates,
    createInstance: createInstance2,
    parentTemplate,
    // the parent template when nested
    prototype = false,
    onCreated: onCreated2 = noop,
    onRendered = noop,
    onDestroyed = noop,
  }) {
    if (!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }
    this.events = events2;
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.templateName = templateName || this.getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createInstance = createInstance2;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
    this.onCreatedCallback = onCreated2;
    this.id = generateID();
    this.isPrototype = prototype;
    LitTemplate.addTemplate(this);
  }
  setDataContext(data) {
    this.data = data;
    this.tpl.data = data;
    this.rendered = false;
  }
  // when rendered as a partial/subtemplate
  setParent(parentTemplate) {
    parentTemplate._childTemplates.push(this);
    this.parentTemplate = parentTemplate;
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
    if (isFunction(tpl.initialize)) {
      this.call(tpl.initialize.bind(this));
    }
    this.tpl.data = this.data;
    this.tpl._childTemplates = [];
    this.tpl.$ = this.$.bind(this);
    this.tpl.$$ = this.$$.bind(this);
    this.tpl.templateName = this.templateName;
    this.tpl.findTemplate = LitTemplate.findTemplate;
    this.tpl.parent = (templateName) =>
      LitTemplate.findParentTemplate(this, templateName);
    this.tpl.child = (templateName) =>
      LitTemplate.findChildTemplate(this, templateName);
    this.tpl.children = (templateName) =>
      LitTemplate.findChildTemplates(this, templateName);
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
      LitTemplate.removeTemplate(this);
      this.rendered = false;
      this.clearReactions();
      this.removeEvents();
      this.call(this.onDestroyedCallback.bind(this));
    };
    this.initialized = true;
    this.renderer = new LitRenderer({
      ast: this.ast,
      data: this.getDataContext(),
      subTemplates: this.subTemplates,
    });
    this.onCreated();
  }
  async attach(
    renderRoot,
    { parentNode = renderRoot, startNode, endNode } = {}
  ) {
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
      ...this.data,
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
    let hasStyles = styles.some((style) =>
      isEqual(style.cssRules, this.stylesheet.cssRules)
    );
    if (!hasStyles) {
      this.renderRoot.adoptedStyleSheets = [
        ...this.renderRoot.adoptedStyleSheets,
        this.stylesheet,
      ];
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
      createInstance: this.createInstance,
    };
    return new LitTemplate({
      ...defaultSettings,
      ...settings,
    });
  }
  attachEvents(events2 = this.events) {
    if (!this.parentNode || !this.renderRoot) {
      fatal('You must set a parent before attaching events');
    }
    this.removeEvents();
    const parseEventString = (eventString) => {
      const parts = eventString.split(' ');
      let eventName = parts[0];
      parts.shift();
      const selector = parts.join(' ');
      const bubbleMap = {
        blur: 'focusout',
        focus: 'focusin',
        //change: 'input',
        load: 'DOMContentLoaded',
        unload: 'beforeunload',
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
      };
      if (bubbleMap[eventName]) {
        eventName = bubbleMap[eventName];
      }
      return { eventName, selector };
    };
    this.eventController = new AbortController();
    each(events2, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;
      $2(this.renderRoot).on(
        eventName,
        selector,
        (event) => {
          if (!this.isNodeInTemplate(event.target)) {
            return;
          }
          if (
            (eventName === 'mouseover' || eventName === 'mouseout') &&
            event.relatedTarget &&
            event.target.contains(event.relatedTarget)
          ) {
            return;
          }
          const boundEvent = eventHandler.bind(event.target);
          template.call(boundEvent, {
            firstArg: event,
            additionalArgs: [event.target.dataset],
          });
        },
        { abortController: this.eventController }
      );
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
    const isNodeInRange = (
      node2,
      startNode = this.startNode,
      endNode = this.endNode
    ) => {
      if (!startNode || !endNode) {
        return true;
      }
      if (node2 === null) {
        return;
      }
      const startComparison = startNode.compareDocumentPosition(node2);
      const endComparison = endNode.compareDocumentPosition(node2);
      const isAfterStart =
        (startComparison & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const isBeforeEnd =
        (endComparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
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
        ...additionalData,
      },
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
  $(selector, root = this.renderRoot, { filterTemplate = true } = {}) {
    if (!root) {
      root = document;
    }
    if (root == this.renderRoot) {
      const $results = $2(selector, root);
      return filterTemplate
        ? $results.filter((node) => this.isNodeInTemplate(node))
        : $results;
    }
    else {
      return $2(selector, root);
    }
  }
  $$(selector) {
    return this.$(selector, this.renderRoot, { filterTemplate: false });
  }
  // calls callback if defined with consistent params and this context
  call(
    func,
    { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}
  ) {
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
  static renderedTemplates = /* @__PURE__ */ new Map();
  static addTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates =
      LitTemplate.renderedTemplates.get(template.templateName) || [];
    templates.push(template);
    LitTemplate.renderedTemplates.set(template.templateName, templates);
  }
  static removeTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates =
      LitTemplate.renderedTemplates.get(template.templateName) || [];
    remove(templates, template);
    LitTemplate.renderedTemplates.set(templates);
  }
  static getTemplates(templateName) {
    let templates = LitTemplate.renderedTemplates.get(templateName) || [];
    if (templates.length > 1) {
      return templates;
    }
    if (templates.length == 1) {
      return templates[0];
    }
  }
  static findTemplate(templateName) {
    return LitTemplate.getTemplates(templateName)[0];
  }
  static findParentTemplate(template, templateName) {
    let match;
    if (templateName) {
      while (template) {
        template = template.parentTemplate;
        if (template?.templateName == templateName) {
          match = template;
          break;
        }
      }
      return match;
    }
    return template.parentTemplate;
  }
  static findChildTemplates(template, templateName) {
    let result = [];
    function search(template2, templateName2) {
      if (template2.templateName === templateName2) {
        result.push(template2.tpl);
      }
      if (template2.tpl._childTemplates) {
        template2.tpl._childTemplates.forEach((childTemplate) => {
          search(childTemplate, templateName2);
        });
      }
    }
    search(template, templateName);
    return result;
  }
  static findChildTemplate(template, templateName) {
    return LitTemplate.findChildTemplates(template, templateName)[0];
  }
};

// packages/component/src/web-component.js
var WebComponentBase = class extends s3 {
  // for use with light dom rendering
  static scopedStyleSheet = null;
  useLight = false;
  createRenderRoot() {
    this.useLight = this.getAttribute('expose') !== null;
    console.log(this.menu);
    if (this.useLight) {
      this.applyScopedStyles(this.tagName, this.css);
      this.storeOriginalContent.apply(this);
      return this;
    }
    else {
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
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      this.scopedStyleSheet,
    ];
  }
  storeOriginalContent() {
    this.originalDOM = document.createElement('template');
    this.originalDOM.innerHTML = this.innerHTML;
    this.innerHTML = '';
  }
  slotContent() {
    const $slots = this.$('slot');
    $slots.each(($slot) => {
      let html;
      if ($slot.attr('name')) {
        let slotName = $slot.attr('name');
        const $slotContent = this.$$(`[slot="${slotName}"]`);
        if ($slotContent.length) {
          html = $slotContent.outerHTML();
        }
      }
      else {
        const $originalDOM = this.$$(this.originalDOM.content);
        const $defaultContent = $originalDOM.children().not('[slot]');
        const defaultHTML = $defaultContent.html() || '';
        const defaultText = $originalDOM.textNode() || '';
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
      console.error('Cannot query DOM until element has rendered.');
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
  call(
    func,
    { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}
  ) {
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
  renderer = 'lit',
  template = '',
  css = false,
  spec = false,
  templateName,
  tagName,
  events: events2 = {},
  createInstance: createInstance2 = noop,
  onCreated: onCreated2 = noop,
  onRendered = noop,
  onDestroyed = noop,
  onAttributeChanged = noop,
  subTemplates = [],
  beforeRendered = noop,
} = {}) => {
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();
  let litTemplate = new LitTemplate({
    templateName: templateName || kebabToCamel(tagName),
    prototype: true,
    ast,
    css,
    events: events2,
    subTemplates,
    onCreated: onCreated2,
    onRendered,
    onDestroyed,
    createInstance: createInstance2,
  });
  let webComponent;
  if (tagName) {
    webComponent = class UIWebComponent extends WebComponentBase {
      static get styles() {
        return r(css);
      }
      static get properties() {
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
        litTemplate.onDestroyed();
        this.call(onDestroyed);
      }
      // callback if moves doc
      adoptedCallback() {
        super.adoptedCallback();
        this.call(onMoved);
      }
      attributeChangedCallback(attribute, oldValue, newValue) {
        this.adjustSettingFromAttribute(attribute, newValue);
        this.call(onAttributeChanged, {
          args: [attribute, oldValue, newValue],
        });
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
        if (spec) {
          if (attribute == 'class') {
            each(value.split(' '), (className) => {
              this.adjustSettingFromAttribute(className);
            });
          }
          else if (get(spec?.attribute, attribute)) {
          }
          else {
            const setting = get(reverseKeys(spec.settings), attribute);
            if (setting) {
              const oldValue = this[setting];
              const newValue = attribute;
              this[setting] = newValue;
              this.attributeChangedCallback(setting, oldValue, newValue);
            }
          }
        }
      }
      getSettings() {
        const settings = {};
        each(webComponent.properties, (propSettings, property) => {
          if (property == 'class' || !propSettings.observe) {
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
          if (property == 'class' || !settings.observe) {
            return;
          }
          classes.push(this[property]);
        });
        const classString = unique(classes).filter(Boolean).join(' ');
        return classString;
      }
      getDataContext() {
        return {
          ...this.tpl,
          ...this.getSettings(),
          ui: this.getUIClasses(),
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

// src/button/button.css
var button_default =
  '/* src/button/css/content/button.css */\n@layer component {\n  .button {\n    cursor: pointer;\n    display: inline-block;\n    min-height: 1em;\n    font-size: var(--medium);\n    border: none;\n    vertical-align: var(--vertical-align);\n    background: var(--background);\n    color: var(--text-color);\n    font-family: var(--font-family);\n    margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n    padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n    text-transform: var(--text-transform);\n    text-shadow: var(--text-shadow);\n    font-weight: var(--font-weight);\n    line-height: var(--line-height);\n    font-style: normal;\n    text-align: center;\n    text-decoration: none;\n    border-radius: var(--border-radius);\n    box-shadow: var(--box-shadow);\n    user-select: none;\n    transition: var(--transition);\n    will-change: var(--will-change);\n    -webkit-tap-highlight-color: var(--tap-color);\n    outline: none;\n  }\n}\n\n/* src/button/css/group/buttons.css */\n@layer component {\n  .buttons {\n    display: inline-flex;\n    flex-direction: row;\n    font-size: 0em;\n    vertical-align: baseline;\n    margin: var(--vertical-margin) var(--horizontal-margin) 0em 0em;\n  }\n  :scope:not(.basic):not(.inverted) {\n    box-shadow: var(--group-box-shadow);\n  }\n  &::after {\n    content: ".";\n    display: block;\n    height: 0;\n    clear: both;\n    visibility: hidden;\n  }\n  .buttons .button {\n    flex: 1 0 auto;\n    border-radius: 0em;\n    margin: var(--group-button-offset);\n  }\n  .buttons > .button:not(.basic):not(.inverted),\n  .buttons:not(.basic):not(.inverted) > .button {\n    box-shadow: var(--group-button-box-shadow);\n  }\n  .buttons .button:first-child {\n    border-left: none;\n    margin-left: 0em;\n    border-top-left-radius: var(--border-radius);\n    border-bottom-left-radius: var(--border-radius);\n  }\n  .buttons .button:last-child {\n    border-top-right-radius: var(--border-radius);\n    border-bottom-right-radius: var(--border-radius);\n  }\n}\n\n/* src/button/css/types/animated.css */\n@layer component {\n  .animated.button {\n    position: relative;\n    overflow: hidden;\n    padding-right: 0em !important;\n    vertical-align: var(--animated-vertical-align);\n    z-index: var(--animated-z-index);\n  }\n  .animated.button .content {\n    will-change: transform, opacity;\n  }\n  .animated.button .visible.content {\n    position: relative;\n    margin-right: var(--horizontal-padding);\n  }\n  .animated.button .hidden.content {\n    position: absolute;\n    width: 100%;\n  }\n  .animated.button .visible.content,\n  .animated.button .hidden.content {\n    transition: right var(--animation-duration) var(--animation-easing) 0s;\n  }\n  .animated.button .visible.content {\n    left: auto;\n    right: 0%;\n  }\n  .animated.button .hidden.content {\n    top: 50%;\n    left: auto;\n    right: -100%;\n    margin-top: calc(var(--line-height) / 2 * -1);\n  }\n  .animated.button:focus .visible.content,\n  .animated.button:hover .visible.content {\n    left: auto;\n    right: 200%;\n  }\n  .animated.button:focus .hidden.content,\n  .animated.button:hover .hidden.content {\n    left: auto;\n    right: 0%;\n  }\n  .vertical.animated.button .visible.content,\n  .vertical.animated.button .hidden.content {\n    transition: top var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);\n  }\n  .vertical.animated.button .visible.content {\n    transform: translateY(0%);\n    right: auto;\n  }\n  .vertical.animated.button .hidden.content {\n    top: -50%;\n    left: 0%;\n    right: auto;\n  }\n  .vertical.animated.button:focus .visible.content,\n  .vertical.animated.button:hover .visible.content {\n    transform: translateY(200%);\n    right: auto;\n  }\n  .vertical.animated.button:focus .hidden.content,\n  .vertical.animated.button:hover .hidden.content {\n    top: 50%;\n    right: auto;\n  }\n  .fade.animated.button .visible.content,\n  .fade.animated.button .hidden.content {\n    transition: opacity var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);\n  }\n  .fade.animated.button .visible.content {\n    left: auto;\n    right: auto;\n    opacity: 1;\n    transform: scale(1);\n  }\n  .fade.animated.button .hidden.content {\n    opacity: 0;\n    left: 0%;\n    right: auto;\n    transform: scale(var(--fade-scale-high));\n  }\n  .fade.animated.button:focus .visible.content,\n  .fade.animated.button:hover .visible.content {\n    left: auto;\n    right: auto;\n    opacity: 0;\n    transform: scale(var(--fade-scale-low));\n  }\n  .fade.animated.button:focus .hidden.content,\n  .fade.animated.button:hover .hidden.content {\n    left: 0%;\n    right: auto;\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n/* src/button/css/types/emphasis.css */\n@layer component {\n  .primary.buttons .button,\n  .primary.button {\n    background-color: var(--primary-color);\n    color: var(--primary-text-color);\n    text-shadow: var(--primary-text-shadow);\n    background-image: var(--primary-background-image);\n  }\n  .primary.button {\n    box-shadow: var(--primary-box-shadow);\n  }\n  .primary.buttons .button:hover,\n  .primary.button:hover {\n    background-color: var(--primary-color-hover);\n    color: var(--primary-text-color);\n    text-shadow: var(--primary-text-shadow);\n  }\n  .primary.buttons .button:focus,\n  .primary.button:focus {\n    background-color: var(--primary-color-focus);\n    color: var(--primary-text-color);\n    text-shadow: var(--primary-text-shadow);\n  }\n  .primary.buttons .button:active,\n  .primary.button:active {\n    background-color: var(--primary-color-down);\n    color: var(--primary-text-color);\n    text-shadow: var(--primary-text-shadow);\n  }\n  .primary.buttons .active.button,\n  .primary.buttons .active.button:active,\n  .primary.active.button,\n  .primary.button .active.button:active {\n    background-color: var(--primary-color-active);\n    color: var(--primary-text-color);\n    text-shadow: var(--primary-text-shadow);\n  }\n  .secondary.buttons .button,\n  .secondary.button {\n    background-color: var(--secondary-color);\n    color: var(--secondary-text-color);\n    text-shadow: var(--secondary-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .secondary.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .secondary.buttons .button:hover,\n  .secondary.button:hover {\n    background-color: var(--secondary-color-hover);\n    color: var(--secondary-text-color);\n    text-shadow: var(--secondary-text-shadow);\n  }\n  .secondary.buttons .button:focus,\n  .secondary.button:focus {\n    background-color: var(--secondary-color-focus);\n    color: var(--secondary-text-color);\n    text-shadow: var(--secondary-text-shadow);\n  }\n  .secondary.buttons .button:active,\n  .secondary.button:active {\n    background-color: var(--secondary-color-down);\n    color: var(--secondary-text-color);\n    text-shadow: var(--secondary-text-shadow);\n  }\n  .secondary.buttons .active.button,\n  .secondary.buttons .active.button:active,\n  .secondary.active.button,\n  .secondary.button .active.button:active {\n    background-color: var(--secondary-color-active);\n    color: var(--secondary-text-color);\n    text-shadow: var(--secondary-text-shadow);\n  }\n}\n\n/* src/button/css/types/icon.css */\n@layer component {\n  .icon.buttons .button,\n  .icon.button {\n    padding: var(--vertical-padding) var(--vertical-padding) (var(--vertical-padding) + var(--shadow-offset));\n  }\n  .icon.buttons .button > .icon,\n  .icon.button > .icon {\n    opacity: var(--icon-button-opacity);\n    margin: 0em !important;\n    vertical-align: top;\n  }\n}\n\n/* src/button/css/types/labeled.css */\n@layer component {\n  .labeled.button:not(.icon) {\n    display: inline-flex;\n    flex-direction: row;\n    background: none !important;\n    padding: 0px !important;\n    border: none !important;\n    box-shadow: none !important;\n  }\n  .labeled.button > .button {\n    margin: 0px;\n  }\n  .labeled.button > .label {\n    display: flex;\n    align-items: var(--labeled-label-align);\n    margin: 0px 0px 0px var(--labeled-label-border-offset) !important;\n    padding: var(--labeled-label-padding);\n    font-size: var(--labeled-label-font-size);\n    border-color: var(--labeled-label-border-color);\n  }\n  .labeled.button > .tag.label::before {\n    width: var(--labeled-tag-label-size);\n    height: var(--labeled-tag-label-size);\n  }\n  .labeled.button:not([class*="left labeled"]) > .button {\n    border-top-right-radius: 0px;\n    border-bottom-right-radius: 0px;\n  }\n  .labeled.button:not([class*="left labeled"]) > .label {\n    border-top-left-radius: 0px;\n    border-bottom-left-radius: 0px;\n  }\n  [class*="left labeled"].button > .button {\n    border-top-left-radius: 0px;\n    border-bottom-left-radius: 0px;\n  }\n  [class*="left labeled"].button > .label {\n    border-top-right-radius: 0px;\n    border-bottom-right-radius: 0px;\n  }\n}\n\n/* src/button/css/types/labeled-icon.css */\n@layer component {\n  .labeled.icon.buttons .button,\n  .labeled.icon.button {\n    position: relative;\n    padding-left: var(--labeled-icon-padding) !important;\n    padding-right: var(--horizontal-padding) !important;\n  }\n  .labeled.icon.buttons > .button > .icon,\n  .labeled.icon.button > .icon {\n    position: absolute;\n    height: 100%;\n    line-height: 1;\n    border-radius: 0px;\n    border-top-left-radius: inherit;\n    border-bottom-left-radius: inherit;\n    text-align: center;\n    margin: var(--labeled-icon-margin);\n    width: var(--labeled-icon-width);\n    background-color: var(--labeled-icon-background-color);\n    color: var(--labeled-icon-color);\n    box-shadow: var(--labeled-icon-left-shadow);\n  }\n  .labeled.icon.buttons > .button > .icon,\n  .labeled.icon.button > .icon {\n    top: 0em;\n    left: 0em;\n  }\n  [class*="right labeled"].icon.button {\n    padding-right: var(--labeled-icon-padding) !important;\n    padding-left: var(--horizontal-padding) !important;\n  }\n  [class*="right labeled"].icon.button > .icon {\n    left: auto;\n    right: 0em;\n    border-radius: 0px;\n    border-top-right-radius: inherit;\n    border-bottom-right-radius: inherit;\n    box-shadow: var(--labeled-icon-right-shadow);\n  }\n  .labeled.icon.buttons > .button > .icon::before,\n  .labeled.icon.button > .icon::before,\n  .labeled.icon.buttons > .button > .icon::after,\n  .labeled.icon.button > .icon::after {\n    display: block;\n    position: absolute;\n    width: 100%;\n    top: 50%;\n    text-align: center;\n    transform: translateY(-50%);\n  }\n  .labeled.icon.button > .icon.loading {\n    animation: none;\n  }\n  .labeled.icon.button > .icon.loading::before {\n    animation: labeled-button-icon-loading var(--loading-icon-duration) linear infinite;\n  }\n  @keyframes labeled-button-icon-loading {\n    from {\n      transform: translateY(-50%) rotate(0deg);\n    }\n    to {\n      transform: translateY(-50%) rotate(360deg);\n    }\n  }\n  .labeled.icon.buttons .button > .icon {\n    border-radius: 0em;\n  }\n  .labeled.icon.buttons .button:first-child > .icon {\n    border-top-left-radius: var(--border-radius);\n    border-bottom-left-radius: var(--border-radius);\n  }\n  .labeled.icon.buttons .button:last-child > .icon {\n    border-top-right-radius: var(--border-radius);\n    border-bottom-right-radius: var(--border-radius);\n  }\n  .vertical.labeled.icon.buttons .button:first-child > .icon {\n    border-radius: 0em;\n    border-top-left-radius: var(--border-radius);\n  }\n  .vertical.labeled.icon.buttons .button:last-child > .icon {\n    border-radius: 0em;\n    border-bottom-left-radius: var(--border-radius);\n  }\n  .fluid[class*="left labeled"].icon.button,\n  .fluid[class*="right labeled"].icon.button {\n    padding-left: var(--horizontal-padding) !important;\n    padding-right: var(--horizontal-padding) !important;\n  }\n}\n\n/* src/button/css/types/toggle.css */\n@layer component {\n  .toggle.buttons .active.button,\n  .buttons .button.toggle.active,\n  .button.toggle.active {\n    background-color: var(--positive-color) !important;\n    box-shadow: none !important;\n    text-shadow: var(--inverted-text-shadow);\n    color: var(--inverted-text-color) !important;\n  }\n  .button.toggle.active:hover {\n    background-color: var(--positive-color-hover) !important;\n    text-shadow: var(--inverted-text-shadow);\n    color: var(--inverted-text-color) !important;\n  }\n}\n\n/* src/button/css/states/hover.css */\n@layer component {\n  .button:hover {\n    background-color: var(--hover-background-color);\n    background-image: var(--hover-background-image);\n    box-shadow: var(--hover-box-shadow);\n    color: var(--hover-color);\n  }\n  .button:hover .icon {\n    opacity: var(--hover-icon-opacity);\n  }\n}\n\n/* src/button/css/states/focus.css */\n@layer component {\n  .button:focus {\n    background-color: var(--focus-background-color);\n    color: var(--focus-color);\n    background-image: var(--focus-background-image) !important;\n    box-shadow: var(--focus-box-shadow) !important;\n  }\n  .button:focus .icon {\n    opacity: var(--icon-focus-opacity);\n  }\n}\n\n/* src/button/css/states/pressed.css */\n@layer component {\n  .button:active,\n  .active.button:active {\n    background-color: var(--pressed-background-color);\n    background-image: var(--pressed-background-image);\n    color: var(--pressed-color);\n    box-shadow: var(--pressed-box-shadow);\n  }\n}\n\n/* src/button/css/states/active.css */\n@layer component {\n  .active.button {\n    background-color: var(--active-background-color);\n    background-image: var(--active-background-image);\n    box-shadow: var(--active-box-shadow);\n    color: var(--active-color);\n  }\n  .active.button:hover {\n    background-color: var(--active-hover-background-color);\n    background-image: var(--active-hover-background-image);\n    color: var(--active-hover-color);\n    box-shadow: var(--active-hover-box-shadow);\n  }\n  .active.button:active {\n    background-color: var(--active-down-background-color);\n    background-image: var(--active-down-background-image);\n    color: var(--active-down-color);\n    box-shadow: var(--active-down-box-shadow);\n  }\n}\n\n/* src/button/css/states/disabled.css */\n@layer component {\n  .disabled.button,\n  .disabled.button:hover,\n  .disabled.active.button {\n    cursor: default;\n    pointer-events: none !important;\n    opacity: var(--disabled-opacity) !important;\n    background-image: var(--disabled-background-image) !important;\n    box-shadow: var(--disabled-background-image) !important;\n  }\n}\n\n/* src/button/css/states/loading.css */\n@layer component {\n  .loading.button {\n    position: relative;\n    cursor: default;\n    text-shadow: none !important;\n    color: transparent !important;\n    opacity: var(--loading-opacity);\n    pointer-events: var(--loading-pointer-events);\n    transition: var(--loading-transition);\n  }\n  .loading.button::before {\n    position: absolute;\n    content: "";\n    top: 50%;\n    left: 50%;\n    margin: var(--loader-margin);\n    width: var(--loader-size);\n    height: var(--loader-size);\n    border-radius: var(--circular-radius);\n    border: var(--loader-line-width) solid var(--inverted-loader-fill-color);\n  }\n  .loading.button::after {\n    position: absolute;\n    content: "";\n    top: 50%;\n    left: 50%;\n    margin: var(--loader-margin);\n    width: var(--loader-size);\n    height: var(--loader-size);\n    animation: button-spin var(--loader-speed-linear);\n    animation-iteration-count: infinite;\n    border-radius: var(--circular-radius);\n    border-color: var(--inverted-loader-line-color) transparent transparent;\n    border-style: solid;\n    border-width: var(--loader-line-width);\n    box-shadow: 0px 0px 0px 1px transparent;\n  }\n  @keyframes button-spin {\n    from {\n      transform: rotate(0deg);\n    }\n    to {\n      transform: rotate(360deg);\n    }\n  }\n}\n\n/* src/button/css/variations/basic.css */\n@layer component {\n  .basic.buttons .button,\n  .basic.button {\n    background: var(--basic-background) !important;\n    color: var(--basic-text-color) !important;\n    font-weight: var(--basic-font-weight);\n    border-radius: var(--basic-border-radius);\n    text-transform: var(--basic-text-transform);\n    text-shadow: none !important;\n    box-shadow: var(--basic-box-shadow);\n  }\n  .basic.buttons {\n    box-shadow: var(--basic-group-box-shadow);\n    border: var(--basic-group-border);\n    border-radius: var(--border-radius);\n  }\n  .basic.buttons .button {\n    border-radius: 0em;\n  }\n  .basic.buttons .button:hover,\n  .basic.button:hover {\n    background: var(--basic-hover-background) !important;\n    color: var(--basic-hover-text-color) !important;\n    box-shadow: var(--basic-hover-box-shadow);\n  }\n  .basic.buttons .button:focus,\n  .basic.button:focus {\n    background: var(--basic-focus-background) !important;\n    color: var(--basic-focus-text-color) !important;\n    box-shadow: var(--basic-focus-box-shadow);\n  }\n  .basic.buttons .button:active,\n  .basic.button:active {\n    background: var(--basic-down-background) !important;\n    color: var(--basic-down-text-color) !important;\n    box-shadow: var(--basic-down-box-shadow);\n  }\n  .basic.buttons .active.button,\n  .basic.active.button {\n    background: var(--basic-active-background) !important;\n    box-shadow: var(--basic-active-box-shadow) !important;\n    color: var(--basic-active-text-color) !important;\n  }\n  .basic.buttons .active.button:hover,\n  .basic.active.button:hover {\n    background-color: var(--transparent-black);\n  }\n  .basic.buttons .button:hover {\n    box-shadow: var(--basic-hover-box-shadow) inset;\n  }\n  .basic.buttons .button:active {\n    box-shadow: var(--basic-down-box-shadow) inset;\n  }\n  .basic.buttons .active.button {\n    box-shadow: var(--basic-active-box-shadow) !important;\n  }\n  .basic.inverted.buttons .button,\n  .basic.inverted.button {\n    background-color: transparent !important;\n    color: var(--off-white) !important;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n  }\n  .basic.inverted.buttons .button:hover,\n  .basic.inverted.button:hover {\n    color: var(--white) !important;\n    box-shadow: var(--basic-inverted-hover-box-shadow) !important;\n  }\n  .basic.inverted.buttons .button:focus,\n  .basic.inverted.button:focus {\n    color: var(--white) !important;\n    box-shadow: var(--basic-inverted-focus-box-shadow) !important;\n  }\n  .basic.inverted.buttons .button:active,\n  .basic.inverted.button:active {\n    background-color: var(--transparent-white) !important;\n    color: var(--white) !important;\n    box-shadow: var(--basic-inverted-down-box-shadow) !important;\n  }\n  .basic.inverted.buttons .active.button,\n  .basic.inverted.active.button {\n    background-color: var(--transparent-white);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    box-shadow: var(--basic-inverted-active-box-shadow);\n  }\n  .basic.inverted.buttons .active.button:hover,\n  .basic.inverted.active.button:hover {\n    background-color: var(--strong-transparent-white);\n    box-shadow: var(--basic-inverted-hover-box-shadow) !important;\n  }\n  .basic.buttons .button {\n    border-left: var(--basic-group-border);\n    box-shadow: none;\n  }\n  .basic.vertical.buttons .button {\n    border-left: none;\n  }\n  .basic.vertical.buttons .button {\n    border-left-width: 0px;\n    border-top: var(--basic-group-border);\n  }\n  .basic.vertical.buttons .button:first-child {\n    border-top-width: 0px;\n  }\n}\n\n/* src/button/css/variations/attached.css */\n@layer component {\n  .attached.button {\n    position: relative;\n    display: block;\n    margin: 0em;\n    border-radius: 0em;\n    box-shadow: var(--attached-box-shadow) !important;\n  }\n  .attached.top.button {\n    border-radius: var(--border-radius) var(--border-radius) 0em 0em;\n  }\n  .attached.bottom.button {\n    border-radius: 0em 0em var(--border-radius) var(--border-radius);\n  }\n  .left.attached.button {\n    display: inline-block;\n    border-left: none;\n    text-align: right;\n    padding-right: var(--attached-horizontal-padding);\n    border-radius: var(--border-radius) 0em 0em var(--border-radius);\n  }\n  .right.attached.button {\n    display: inline-block;\n    text-align: left;\n    padding-left: var(--attached-horizontal-padding);\n    border-radius: 0em var(--border-radius) var(--border-radius) 0em;\n  }\n  .attached.buttons {\n    position: relative;\n    display: flex;\n    border-radius: 0em;\n    width: auto !important;\n    z-index: var(--attached-z-index);\n    margin-left: var(--attached-offset);\n    margin-right: var(--attached-offset);\n  }\n  .attached.buttons .button {\n    margin: 0em;\n  }\n  .attached.buttons .button:first-child {\n    border-radius: 0em;\n  }\n  .attached.buttons .button:last-child {\n    border-radius: 0em;\n  }\n  [class*="top attached"].buttons {\n    margin-bottom: var(--attached-offset);\n    border-radius: var(--border-radius) var(--border-radius) 0em 0em;\n  }\n  [class*="top attached"].buttons .button:first-child {\n    border-radius: var(--border-radius) 0em 0em 0em;\n  }\n  [class*="top attached"].buttons .button:last-child {\n    border-radius: 0em var(--border-radius) 0em 0em;\n  }\n  [class*="bottom attached"].buttons {\n    margin-top: var(--attached-offset);\n    border-radius: 0em 0em var(--border-radius) var(--border-radius);\n  }\n  [class*="bottom attached"].buttons .button:first-child {\n    border-radius: 0em 0em 0em var(--border-radius);\n  }\n  [class*="bottom attached"].buttons .button:last-child {\n    border-radius: 0em 0em var(--border-radius) 0em;\n  }\n  [class*="left attached"].buttons {\n    display: inline-flex;\n    margin-right: 0em;\n    margin-left: var(--attached-offset);\n    border-radius: 0em var(--border-radius) var(--border-radius) 0em;\n  }\n  [class*="left attached"].buttons .button:first-child {\n    margin-left: var(--attached-offset);\n    border-radius: 0em var(--border-radius) 0em 0em;\n  }\n  [class*="left attached"].buttons .button:last-child {\n    margin-left: var(--attached-offset);\n    border-radius: 0em 0em var(--border-radius) 0em;\n  }\n  [class*="right attached"].buttons {\n    display: inline-flex;\n    margin-left: 0em;\n    margin-right: var(--attached-offset);\n    border-radius: var(--border-radius) 0em 0em var(--border-radius);\n  }\n  [class*="right attached"].buttons .button:first-child {\n    margin-left: var(--attached-offset);\n    border-radius: var(--border-radius) 0em 0em 0em;\n  }\n  [class*="right attached"].buttons .button:last-child {\n    margin-left: var(--attached-offset);\n    border-radius: 0em 0em 0em var(--border-radius);\n  }\n}\n\n/* src/button/css/variations/circular.css */\n@layer component {\n  .circular.button {\n    border-radius: 10em;\n  }\n  .circular.button > .icon {\n    width: 1em;\n    vertical-align: baseline;\n  }\n}\n\n/* src/button/css/variations/colored.css */\n@layer component {\n  .black.buttons .button,\n  .black.button {\n    background-color: var(--black);\n    color: var(--black-text-color);\n    text-shadow: var(--black-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .black.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .black.buttons .button:hover,\n  .black.button:hover {\n    background-color: var(--black-hover);\n    color: var(--black-text-color);\n    text-shadow: var(--black-text-shadow);\n  }\n  .black.buttons .button:focus,\n  .black.button:focus {\n    background-color: var(--black-focus);\n    color: var(--black-text-color);\n    text-shadow: var(--black-text-shadow);\n  }\n  .black.buttons .button:active,\n  .black.button:active {\n    background-color: var(--black-down);\n    color: var(--black-text-color);\n    text-shadow: var(--black-text-shadow);\n  }\n  .black.buttons .active.button,\n  .black.buttons .active.button:active,\n  .black.active.button,\n  .black.button .active.button:active {\n    background-color: var(--black-active);\n    color: var(--black-text-color);\n    text-shadow: var(--black-text-shadow);\n  }\n  .basic.black.buttons .button,\n  .basic.black.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--black) inset !important;\n    color: var(--black) !important;\n  }\n  .basic.black.buttons .button:hover,\n  .basic.black.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-hover) inset !important;\n    color: var(--black-hover) !important;\n  }\n  .basic.black.buttons .button:focus,\n  .basic.black.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-focus) inset !important;\n    color: var(--black-hover) !important;\n  }\n  .basic.black.buttons .active.button,\n  .basic.black.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-active) inset !important;\n    color: var(--black-down) !important;\n  }\n  .basic.black.buttons .button:active,\n  .basic.black.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-down) inset !important;\n    color: var(--black-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.black.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.black.buttons .button,\n  .inverted.black.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;\n    color: var(--inverted-text-color);\n  }\n  .inverted.black.buttons .button:hover,\n  .inverted.black.button:hover,\n  .inverted.black.buttons .button:focus,\n  .inverted.black.button:focus,\n  .inverted.black.buttons .button.active,\n  .inverted.black.button.active,\n  .inverted.black.buttons .button:active,\n  .inverted.black.button:active {\n    box-shadow: none !important;\n    color: var(--light-black-text-color);\n  }\n  .inverted.black.buttons .button:hover,\n  .inverted.black.button:hover {\n    background-color: var(--light-black-hover);\n  }\n  .inverted.black.buttons .button:focus,\n  .inverted.black.button:focus {\n    background-color: var(--light-black-focus);\n  }\n  .inverted.black.buttons .active.button,\n  .inverted.black.active.button {\n    background-color: var(--light-black-active);\n  }\n  .inverted.black.buttons .button:active,\n  .inverted.black.button:active {\n    background-color: var(--light-black-down);\n  }\n  .inverted.black.basic.buttons .button,\n  .inverted.black.buttons .basic.button,\n  .inverted.black.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.black.basic.buttons .button:hover,\n  .inverted.black.buttons .basic.button:hover,\n  .inverted.black.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-hover) inset !important;\n    color: var(--white) !important;\n  }\n  .inverted.black.basic.buttons .button:focus,\n  .inverted.black.basic.buttons .button:focus,\n  .inverted.black.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-focus) inset !important;\n    color: var(--light-black) !important;\n  }\n  .inverted.black.basic.buttons .active.button,\n  .inverted.black.buttons .basic.active.button,\n  .inverted.black.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-active) inset !important;\n    color: var(--white) !important;\n  }\n  .inverted.black.basic.buttons .button:active,\n  .inverted.black.buttons .basic.button:active,\n  .inverted.black.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-down) inset !important;\n    color: var(--white) !important;\n  }\n  .grey.buttons .button,\n  .grey.button {\n    background-color: var(--grey);\n    color: var(--grey-text-color);\n    text-shadow: var(--grey-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .grey.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .grey.buttons .button:hover,\n  .grey.button:hover {\n    background-color: var(--grey-hover);\n    color: var(--grey-text-color);\n    text-shadow: var(--grey-text-shadow);\n  }\n  .grey.buttons .button:focus,\n  .grey.button:focus {\n    background-color: var(--grey-focus);\n    color: var(--grey-text-color);\n    text-shadow: var(--grey-text-shadow);\n  }\n  .grey.buttons .button:active,\n  .grey.button:active {\n    background-color: var(--grey-down);\n    color: var(--grey-text-color);\n    text-shadow: var(--grey-text-shadow);\n  }\n  .grey.buttons .active.button,\n  .grey.buttons .active.button:active,\n  .grey.active.button,\n  .grey.button .active.button:active {\n    background-color: var(--grey-active);\n    color: var(--grey-text-color);\n    text-shadow: var(--grey-text-shadow);\n  }\n  .basic.grey.buttons .button,\n  .basic.grey.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--grey) inset !important;\n    color: var(--grey) !important;\n  }\n  .basic.grey.buttons .button:hover,\n  .basic.grey.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-hover) inset !important;\n    color: var(--grey-hover) !important;\n  }\n  .basic.grey.buttons .button:focus,\n  .basic.grey.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-focus) inset !important;\n    color: var(--grey-hover) !important;\n  }\n  .basic.grey.buttons .active.button,\n  .basic.grey.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-active) inset !important;\n    color: var(--grey-down) !important;\n  }\n  .basic.grey.buttons .button:active,\n  .basic.grey.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-down) inset !important;\n    color: var(--grey-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.grey.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.grey.buttons .button,\n  .inverted.grey.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;\n    color: var(--inverted-text-color);\n  }\n  .inverted.grey.buttons .button:hover,\n  .inverted.grey.button:hover,\n  .inverted.grey.buttons .button:focus,\n  .inverted.grey.button:focus,\n  .inverted.grey.buttons .button.active,\n  .inverted.grey.button.active,\n  .inverted.grey.buttons .button:active,\n  .inverted.grey.button:active {\n    box-shadow: none !important;\n    color: var(--light-grey-text-color);\n  }\n  .inverted.grey.buttons .button:hover,\n  .inverted.grey.button:hover {\n    background-color: var(--light-grey-hover);\n  }\n  .inverted.grey.buttons .button:focus,\n  .inverted.grey.button:focus {\n    background-color: var(--light-grey-focus);\n  }\n  .inverted.grey.buttons .active.button,\n  .inverted.grey.active.button {\n    background-color: var(--light-grey-active);\n  }\n  .inverted.grey.buttons .button:active,\n  .inverted.grey.button:active {\n    background-color: var(--light-grey-down);\n  }\n  .inverted.grey.basic.buttons .button,\n  .inverted.grey.buttons .basic.button,\n  .inverted.grey.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.grey.basic.buttons .button:hover,\n  .inverted.grey.buttons .basic.button:hover,\n  .inverted.grey.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-hover) inset !important;\n    color: var(--white) !important;\n  }\n  .inverted.grey.basic.buttons .button:focus,\n  .inverted.grey.basic.buttons .button:focus,\n  .inverted.grey.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-focus) inset !important;\n    color: var(--light-grey) !important;\n  }\n  .inverted.grey.basic.buttons .active.button,\n  .inverted.grey.buttons .basic.active.button,\n  .inverted.grey.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-active) inset !important;\n    color: var(--white) !important;\n  }\n  .inverted.grey.basic.buttons .button:active,\n  .inverted.grey.buttons .basic.button:active,\n  .inverted.grey.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-down) inset !important;\n    color: var(--white) !important;\n  }\n  .brown.buttons .button,\n  .brown.button {\n    background-color: var(--brown);\n    color: var(--brown-text-color);\n    text-shadow: var(--brown-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .brown.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .brown.buttons .button:hover,\n  .brown.button:hover {\n    background-color: var(--brown-hover);\n    color: var(--brown-text-color);\n    text-shadow: var(--brown-text-shadow);\n  }\n  .brown.buttons .button:focus,\n  .brown.button:focus {\n    background-color: var(--brown-focus);\n    color: var(--brown-text-color);\n    text-shadow: var(--brown-text-shadow);\n  }\n  .brown.buttons .button:active,\n  .brown.button:active {\n    background-color: var(--brown-down);\n    color: var(--brown-text-color);\n    text-shadow: var(--brown-text-shadow);\n  }\n  .brown.buttons .active.button,\n  .brown.buttons .active.button:active,\n  .brown.active.button,\n  .brown.button .active.button:active {\n    background-color: var(--brown-active);\n    color: var(--brown-text-color);\n    text-shadow: var(--brown-text-shadow);\n  }\n  .basic.brown.buttons .button,\n  .basic.brown.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--brown) inset !important;\n    color: var(--brown) !important;\n  }\n  .basic.brown.buttons .button:hover,\n  .basic.brown.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-hover) inset !important;\n    color: var(--brown-hover) !important;\n  }\n  .basic.brown.buttons .button:focus,\n  .basic.brown.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-focus) inset !important;\n    color: var(--brown-hover) !important;\n  }\n  .basic.brown.buttons .active.button,\n  .basic.brown.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-active) inset !important;\n    color: var(--brown-down) !important;\n  }\n  .basic.brown.buttons .button:active,\n  .basic.brown.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-down) inset !important;\n    color: var(--brown-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.brown.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.brown.buttons .button,\n  .inverted.brown.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown) inset !important;\n    color: var(--light-brown);\n  }\n  .inverted.brown.buttons .button:hover,\n  .inverted.brown.button:hover,\n  .inverted.brown.buttons .button:focus,\n  .inverted.brown.button:focus,\n  .inverted.brown.buttons .button.active,\n  .inverted.brown.button.active,\n  .inverted.brown.buttons .button:active,\n  .inverted.brown.button:active {\n    box-shadow: none !important;\n    color: var(--light-brown-text-color);\n  }\n  .inverted.brown.buttons .button:hover,\n  .inverted.brown.button:hover {\n    background-color: var(--light-brown-hover);\n  }\n  .inverted.brown.buttons .button:focus,\n  .inverted.brown.button:focus {\n    background-color: var(--light-brown-focus);\n  }\n  .inverted.brown.buttons .active.button,\n  .inverted.brown.active.button {\n    background-color: var(--light-brown-active);\n  }\n  .inverted.brown.buttons .button:active,\n  .inverted.brown.button:active {\n    background-color: var(--light-brown-down);\n  }\n  .inverted.brown.basic.buttons .button,\n  .inverted.brown.buttons .basic.button,\n  .inverted.brown.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.brown.basic.buttons .button:hover,\n  .inverted.brown.buttons .basic.button:hover,\n  .inverted.brown.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-hover) inset !important;\n    color: var(--light-brown) !important;\n  }\n  .inverted.brown.basic.buttons .button:focus,\n  .inverted.brown.basic.buttons .button:focus,\n  .inverted.brown.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-focus) inset !important;\n    color: var(--light-brown) !important;\n  }\n  .inverted.brown.basic.buttons .active.button,\n  .inverted.brown.buttons .basic.active.button,\n  .inverted.brown.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-active) inset !important;\n    color: var(--light-brown) !important;\n  }\n  .inverted.brown.basic.buttons .button:active,\n  .inverted.brown.buttons .basic.button:active,\n  .inverted.brown.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-down) inset !important;\n    color: var(--light-brown) !important;\n  }\n  .blue.buttons .button,\n  .blue.button {\n    background-color: var(--blue);\n    color: var(--blue-text-color);\n    text-shadow: var(--blue-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .blue.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .blue.buttons .button:hover,\n  .blue.button:hover {\n    background-color: var(--blue-hover);\n    color: var(--blue-text-color);\n    text-shadow: var(--blue-text-shadow);\n  }\n  .blue.buttons .button:focus,\n  .blue.button:focus {\n    background-color: var(--blue-focus);\n    color: var(--blue-text-color);\n    text-shadow: var(--blue-text-shadow);\n  }\n  .blue.buttons .button:active,\n  .blue.button:active {\n    background-color: var(--blue-down);\n    color: var(--blue-text-color);\n    text-shadow: var(--blue-text-shadow);\n  }\n  .blue.buttons .active.button,\n  .blue.buttons .active.button:active,\n  .blue.active.button,\n  .blue.button .active.button:active {\n    background-color: var(--blue-active);\n    color: var(--blue-text-color);\n    text-shadow: var(--blue-text-shadow);\n  }\n  .basic.blue.buttons .button,\n  .basic.blue.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--blue) inset !important;\n    color: var(--blue) !important;\n  }\n  .basic.blue.buttons .button:hover,\n  .basic.blue.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-hover) inset !important;\n    color: var(--blue-hover) !important;\n  }\n  .basic.blue.buttons .button:focus,\n  .basic.blue.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-focus) inset !important;\n    color: var(--blue-hover) !important;\n  }\n  .basic.blue.buttons .active.button,\n  .basic.blue.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-active) inset !important;\n    color: var(--blue-down) !important;\n  }\n  .basic.blue.buttons .button:active,\n  .basic.blue.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-down) inset !important;\n    color: var(--blue-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.blue.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.blue.buttons .button,\n  .inverted.blue.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue) inset !important;\n    color: var(--light-blue);\n  }\n  .inverted.blue.buttons .button:hover,\n  .inverted.blue.button:hover,\n  .inverted.blue.buttons .button:focus,\n  .inverted.blue.button:focus,\n  .inverted.blue.buttons .button.active,\n  .inverted.blue.button.active,\n  .inverted.blue.buttons .button:active,\n  .inverted.blue.button:active {\n    box-shadow: none !important;\n    color: var(--light-blue-text-color);\n  }\n  .inverted.blue.buttons .button:hover,\n  .inverted.blue.button:hover {\n    background-color: var(--light-blue-hover);\n  }\n  .inverted.blue.buttons .button:focus,\n  .inverted.blue.button:focus {\n    background-color: var(--light-blue-focus);\n  }\n  .inverted.blue.buttons .active.button,\n  .inverted.blue.active.button {\n    background-color: var(--light-blue-active);\n  }\n  .inverted.blue.buttons .button:active,\n  .inverted.blue.button:active {\n    background-color: var(--light-blue-down);\n  }\n  .inverted.blue.basic.buttons .button,\n  .inverted.blue.buttons .basic.button,\n  .inverted.blue.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.blue.basic.buttons .button:hover,\n  .inverted.blue.buttons .basic.button:hover,\n  .inverted.blue.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-hover) inset !important;\n    color: var(--light-blue) !important;\n  }\n  .inverted.blue.basic.buttons .button:focus,\n  .inverted.blue.basic.buttons .button:focus,\n  .inverted.blue.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-focus) inset !important;\n    color: var(--light-blue) !important;\n  }\n  .inverted.blue.basic.buttons .active.button,\n  .inverted.blue.buttons .basic.active.button,\n  .inverted.blue.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-active) inset !important;\n    color: var(--light-blue) !important;\n  }\n  .inverted.blue.basic.buttons .button:active,\n  .inverted.blue.buttons .basic.button:active,\n  .inverted.blue.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-down) inset !important;\n    color: var(--light-blue) !important;\n  }\n  .green.buttons .button,\n  .green.button {\n    background-color: var(--green);\n    color: var(--green-text-color);\n    text-shadow: var(--green-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .green.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .green.buttons .button:hover,\n  .green.button:hover {\n    background-color: var(--green-hover);\n    color: var(--green-text-color);\n    text-shadow: var(--green-text-shadow);\n  }\n  .green.buttons .button:focus,\n  .green.button:focus {\n    background-color: var(--green-focus);\n    color: var(--green-text-color);\n    text-shadow: var(--green-text-shadow);\n  }\n  .green.buttons .button:active,\n  .green.button:active {\n    background-color: var(--green-down);\n    color: var(--green-text-color);\n    text-shadow: var(--green-text-shadow);\n  }\n  .green.buttons .active.button,\n  .green.buttons .active.button:active,\n  .green.active.button,\n  .green.button .active.button:active {\n    background-color: var(--green-active);\n    color: var(--green-text-color);\n    text-shadow: var(--green-text-shadow);\n  }\n  .basic.green.buttons .button,\n  .basic.green.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--green) inset !important;\n    color: var(--green) !important;\n  }\n  .basic.green.buttons .button:hover,\n  .basic.green.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-hover) inset !important;\n    color: var(--green-hover) !important;\n  }\n  .basic.green.buttons .button:focus,\n  .basic.green.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-focus) inset !important;\n    color: var(--green-hover) !important;\n  }\n  .basic.green.buttons .active.button,\n  .basic.green.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-active) inset !important;\n    color: var(--green-down) !important;\n  }\n  .basic.green.buttons .button:active,\n  .basic.green.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-down) inset !important;\n    color: var(--green-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.green.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.green.buttons .button,\n  .inverted.green.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green) inset !important;\n    color: var(--light-green);\n  }\n  .inverted.green.buttons .button:hover,\n  .inverted.green.button:hover,\n  .inverted.green.buttons .button:focus,\n  .inverted.green.button:focus,\n  .inverted.green.buttons .button.active,\n  .inverted.green.button.active,\n  .inverted.green.buttons .button:active,\n  .inverted.green.button:active {\n    box-shadow: none !important;\n    color: var(--green-text-color);\n  }\n  .inverted.green.buttons .button:hover,\n  .inverted.green.button:hover {\n    background-color: var(--light-green-hover);\n  }\n  .inverted.green.buttons .button:focus,\n  .inverted.green.button:focus {\n    background-color: var(--light-green-focus);\n  }\n  .inverted.green.buttons .active.button,\n  .inverted.green.active.button {\n    background-color: var(--light-green-active);\n  }\n  .inverted.green.buttons .button:active,\n  .inverted.green.button:active {\n    background-color: var(--light-green-down);\n  }\n  .inverted.green.basic.buttons .button,\n  .inverted.green.buttons .basic.button,\n  .inverted.green.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.green.basic.buttons .button:hover,\n  .inverted.green.buttons .basic.button:hover,\n  .inverted.green.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-hover) inset !important;\n    color: var(--light-green) !important;\n  }\n  .inverted.green.basic.buttons .button:focus,\n  .inverted.green.basic.buttons .button:focus,\n  .inverted.green.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-focus) inset !important;\n    color: var(--light-green) !important;\n  }\n  .inverted.green.basic.buttons .active.button,\n  .inverted.green.buttons .basic.active.button,\n  .inverted.green.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-active) inset !important;\n    color: var(--light-green) !important;\n  }\n  .inverted.green.basic.buttons .button:active,\n  .inverted.green.buttons .basic.button:active,\n  .inverted.green.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-down) inset !important;\n    color: var(--light-green) !important;\n  }\n  .orange.buttons .button,\n  .orange.button {\n    background-color: var(--orange);\n    color: var(--orange-text-color);\n    text-shadow: var(--orange-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .orange.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .orange.buttons .button:hover,\n  .orange.button:hover {\n    background-color: var(--orange-hover);\n    color: var(--orange-text-color);\n    text-shadow: var(--orange-text-shadow);\n  }\n  .orange.buttons .button:focus,\n  .orange.button:focus {\n    background-color: var(--orange-focus);\n    color: var(--orange-text-color);\n    text-shadow: var(--orange-text-shadow);\n  }\n  .orange.buttons .button:active,\n  .orange.button:active {\n    background-color: var(--orange-down);\n    color: var(--orange-text-color);\n    text-shadow: var(--orange-text-shadow);\n  }\n  .orange.buttons .active.button,\n  .orange.buttons .active.button:active,\n  .orange.active.button,\n  .orange.button .active.button:active {\n    background-color: var(--orange-active);\n    color: var(--orange-text-color);\n    text-shadow: var(--orange-text-shadow);\n  }\n  .basic.orange.buttons .button,\n  .basic.orange.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--orange) inset !important;\n    color: var(--orange) !important;\n  }\n  .basic.orange.buttons .button:hover,\n  .basic.orange.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-hover) inset !important;\n    color: var(--orange-hover) !important;\n  }\n  .basic.orange.buttons .button:focus,\n  .basic.orange.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-focus) inset !important;\n    color: var(--orange-hover) !important;\n  }\n  .basic.orange.buttons .active.button,\n  .basic.orange.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-active) inset !important;\n    color: var(--orange-down) !important;\n  }\n  .basic.orange.buttons .button:active,\n  .basic.orange.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-down) inset !important;\n    color: var(--orange-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.orange.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.orange.buttons .button,\n  .inverted.orange.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange) inset !important;\n    color: var(--light-orange);\n  }\n  .inverted.orange.buttons .button:hover,\n  .inverted.orange.button:hover,\n  .inverted.orange.buttons .button:focus,\n  .inverted.orange.button:focus,\n  .inverted.orange.buttons .button.active,\n  .inverted.orange.button.active,\n  .inverted.orange.buttons .button:active,\n  .inverted.orange.button:active {\n    box-shadow: none !important;\n    color: var(--light-orange-text-color);\n  }\n  .inverted.orange.buttons .button:hover,\n  .inverted.orange.button:hover {\n    background-color: var(--light-orange-hover);\n  }\n  .inverted.orange.buttons .button:focus,\n  .inverted.orange.button:focus {\n    background-color: var(--light-orange-focus);\n  }\n  .inverted.orange.buttons .active.button,\n  .inverted.orange.active.button {\n    background-color: var(--light-orange-active);\n  }\n  .inverted.orange.buttons .button:active,\n  .inverted.orange.button:active {\n    background-color: var(--light-orange-down);\n  }\n  .inverted.orange.basic.buttons .button,\n  .inverted.orange.buttons .basic.button,\n  .inverted.orange.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.orange.basic.buttons .button:hover,\n  .inverted.orange.buttons .basic.button:hover,\n  .inverted.orange.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-hover) inset !important;\n    color: var(--light-orange) !important;\n  }\n  .inverted.orange.basic.buttons .button:focus,\n  .inverted.orange.basic.buttons .button:focus,\n  .inverted.orange.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-focus) inset !important;\n    color: var(--light-orange) !important;\n  }\n  .inverted.orange.basic.buttons .active.button,\n  .inverted.orange.buttons .basic.active.button,\n  .inverted.orange.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-active) inset !important;\n    color: var(--light-orange) !important;\n  }\n  .inverted.orange.basic.buttons .button:active,\n  .inverted.orange.buttons .basic.button:active,\n  .inverted.orange.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-down) inset !important;\n    color: var(--light-orange) !important;\n  }\n  .pink.buttons .button,\n  .pink.button {\n    background-color: var(--pink);\n    color: var(--pink-text-color);\n    text-shadow: var(--pink-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .pink.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .pink.buttons .button:hover,\n  .pink.button:hover {\n    background-color: var(--pink-hover);\n    color: var(--pink-text-color);\n    text-shadow: var(--pink-text-shadow);\n  }\n  .pink.buttons .button:focus,\n  .pink.button:focus {\n    background-color: var(--pink-focus);\n    color: var(--pink-text-color);\n    text-shadow: var(--pink-text-shadow);\n  }\n  .pink.buttons .button:active,\n  .pink.button:active {\n    background-color: var(--pink-down);\n    color: var(--pink-text-color);\n    text-shadow: var(--pink-text-shadow);\n  }\n  .pink.buttons .active.button,\n  .pink.buttons .active.button:active,\n  .pink.active.button,\n  .pink.button .active.button:active {\n    background-color: var(--pink-active);\n    color: var(--pink-text-color);\n    text-shadow: var(--pink-text-shadow);\n  }\n  .basic.pink.buttons .button,\n  .basic.pink.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--pink) inset !important;\n    color: var(--pink) !important;\n  }\n  .basic.pink.buttons .button:hover,\n  .basic.pink.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-hover) inset !important;\n    color: var(--pink-hover) !important;\n  }\n  .basic.pink.buttons .button:focus,\n  .basic.pink.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-focus) inset !important;\n    color: var(--pink-hover) !important;\n  }\n  .basic.pink.buttons .active.button,\n  .basic.pink.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-active) inset !important;\n    color: var(--pink-down) !important;\n  }\n  .basic.pink.buttons .button:active,\n  .basic.pink.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-down) inset !important;\n    color: var(--pink-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.pink.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.pink.buttons .button,\n  .inverted.pink.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink) inset !important;\n    color: var(--light-pink);\n  }\n  .inverted.pink.buttons .button:hover,\n  .inverted.pink.button:hover,\n  .inverted.pink.buttons .button:focus,\n  .inverted.pink.button:focus,\n  .inverted.pink.buttons .button.active,\n  .inverted.pink.button.active,\n  .inverted.pink.buttons .button:active,\n  .inverted.pink.button:active {\n    box-shadow: none !important;\n    color: var(--light-pink-text-color);\n  }\n  .inverted.pink.buttons .button:hover,\n  .inverted.pink.button:hover {\n    background-color: var(--light-pink-hover);\n  }\n  .inverted.pink.buttons .button:focus,\n  .inverted.pink.button:focus {\n    background-color: var(--light-pink-focus);\n  }\n  .inverted.pink.buttons .active.button,\n  .inverted.pink.active.button {\n    background-color: var(--light-pink-active);\n  }\n  .inverted.pink.buttons .button:active,\n  .inverted.pink.button:active {\n    background-color: var(--light-pink-down);\n  }\n  .inverted.pink.basic.buttons .button,\n  .inverted.pink.buttons .basic.button,\n  .inverted.pink.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.pink.basic.buttons .button:hover,\n  .inverted.pink.buttons .basic.button:hover,\n  .inverted.pink.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-hover) inset !important;\n    color: var(--light-pink) !important;\n  }\n  .inverted.pink.basic.buttons .button:focus,\n  .inverted.pink.basic.buttons .button:focus,\n  .inverted.pink.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-focus) inset !important;\n    color: var(--light-pink) !important;\n  }\n  .inverted.pink.basic.buttons .active.button,\n  .inverted.pink.buttons .basic.active.button,\n  .inverted.pink.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-active) inset !important;\n    color: var(--light-pink) !important;\n  }\n  .inverted.pink.basic.buttons .button:active,\n  .inverted.pink.buttons .basic.button:active,\n  .inverted.pink.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-down) inset !important;\n    color: var(--light-pink) !important;\n  }\n  .violet.buttons .button,\n  .violet.button {\n    background-color: var(--violet);\n    color: var(--violet-text-color);\n    text-shadow: var(--violet-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .violet.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .violet.buttons .button:hover,\n  .violet.button:hover {\n    background-color: var(--violet-hover);\n    color: var(--violet-text-color);\n    text-shadow: var(--violet-text-shadow);\n  }\n  .violet.buttons .button:focus,\n  .violet.button:focus {\n    background-color: var(--violet-focus);\n    color: var(--violet-text-color);\n    text-shadow: var(--violet-text-shadow);\n  }\n  .violet.buttons .button:active,\n  .violet.button:active {\n    background-color: var(--violet-down);\n    color: var(--violet-text-color);\n    text-shadow: var(--violet-text-shadow);\n  }\n  .violet.buttons .active.button,\n  .violet.buttons .active.button:active,\n  .violet.active.button,\n  .violet.button .active.button:active {\n    background-color: var(--violet-active);\n    color: var(--violet-text-color);\n    text-shadow: var(--violet-text-shadow);\n  }\n  .basic.violet.buttons .button,\n  .basic.violet.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--violet) inset !important;\n    color: var(--violet) !important;\n  }\n  .basic.violet.buttons .button:hover,\n  .basic.violet.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-hover) inset !important;\n    color: var(--violet-hover) !important;\n  }\n  .basic.violet.buttons .button:focus,\n  .basic.violet.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-focus) inset !important;\n    color: var(--violet-hover) !important;\n  }\n  .basic.violet.buttons .active.button,\n  .basic.violet.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-active) inset !important;\n    color: var(--violet-down) !important;\n  }\n  .basic.violet.buttons .button:active,\n  .basic.violet.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-down) inset !important;\n    color: var(--violet-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.violet.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.violet.buttons .button,\n  .inverted.violet.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet) inset !important;\n    color: var(--light-violet);\n  }\n  .inverted.violet.buttons .button:hover,\n  .inverted.violet.button:hover,\n  .inverted.violet.buttons .button:focus,\n  .inverted.violet.button:focus,\n  .inverted.violet.buttons .button.active,\n  .inverted.violet.button.active,\n  .inverted.violet.buttons .button:active,\n  .inverted.violet.button:active {\n    box-shadow: none !important;\n    color: var(--light-violet-text-color);\n  }\n  .inverted.violet.buttons .button:hover,\n  .inverted.violet.button:hover {\n    background-color: var(--light-violet-hover);\n  }\n  .inverted.violet.buttons .button:focus,\n  .inverted.violet.button:focus {\n    background-color: var(--light-violet-focus);\n  }\n  .inverted.violet.buttons .active.button,\n  .inverted.violet.active.button {\n    background-color: var(--light-violet-active);\n  }\n  .inverted.violet.buttons .button:active,\n  .inverted.violet.button:active {\n    background-color: var(--light-violet-down);\n  }\n  .inverted.violet.basic.buttons .button,\n  .inverted.violet.buttons .basic.button,\n  .inverted.violet.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.violet.basic.buttons .button:hover,\n  .inverted.violet.buttons .basic.button:hover,\n  .inverted.violet.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-hover) inset !important;\n    color: var(--light-violet) !important;\n  }\n  .inverted.violet.basic.buttons .button:focus,\n  .inverted.violet.basic.buttons .button:focus,\n  .inverted.violet.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-focus) inset !important;\n    color: var(--light-violet) !important;\n  }\n  .inverted.violet.basic.buttons .active.button,\n  .inverted.violet.buttons .basic.active.button,\n  .inverted.violet.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-active) inset !important;\n    color: var(--light-violet) !important;\n  }\n  .inverted.violet.basic.buttons .button:active,\n  .inverted.violet.buttons .basic.button:active,\n  .inverted.violet.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-down) inset !important;\n    color: var(--light-violet) !important;\n  }\n  .purple.buttons .button,\n  .purple.button {\n    background-color: var(--purple);\n    color: var(--purple-text-color);\n    text-shadow: var(--purple-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .purple.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .purple.buttons .button:hover,\n  .purple.button:hover {\n    background-color: var(--purple-hover);\n    color: var(--purple-text-color);\n    text-shadow: var(--purple-text-shadow);\n  }\n  .purple.buttons .button:focus,\n  .purple.button:focus {\n    background-color: var(--purple-focus);\n    color: var(--purple-text-color);\n    text-shadow: var(--purple-text-shadow);\n  }\n  .purple.buttons .button:active,\n  .purple.button:active {\n    background-color: var(--purple-down);\n    color: var(--purple-text-color);\n    text-shadow: var(--purple-text-shadow);\n  }\n  .purple.buttons .active.button,\n  .purple.buttons .active.button:active,\n  .purple.active.button,\n  .purple.button .active.button:active {\n    background-color: var(--purple-active);\n    color: var(--purple-text-color);\n    text-shadow: var(--purple-text-shadow);\n  }\n  .basic.purple.buttons .button,\n  .basic.purple.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--purple) inset !important;\n    color: var(--purple) !important;\n  }\n  .basic.purple.buttons .button:hover,\n  .basic.purple.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-hover) inset !important;\n    color: var(--purple-hover) !important;\n  }\n  .basic.purple.buttons .button:focus,\n  .basic.purple.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-focus) inset !important;\n    color: var(--purple-hover) !important;\n  }\n  .basic.purple.buttons .active.button,\n  .basic.purple.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-active) inset !important;\n    color: var(--purple-down) !important;\n  }\n  .basic.purple.buttons .button:active,\n  .basic.purple.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-down) inset !important;\n    color: var(--purple-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.purple.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.purple.buttons .button,\n  .inverted.purple.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple) inset !important;\n    color: var(--light-purple);\n  }\n  .inverted.purple.buttons .button:hover,\n  .inverted.purple.button:hover,\n  .inverted.purple.buttons .button:focus,\n  .inverted.purple.button:focus,\n  .inverted.purple.buttons .button.active,\n  .inverted.purple.button.active,\n  .inverted.purple.buttons .button:active,\n  .inverted.purple.button:active {\n    box-shadow: none !important;\n    color: var(--light-purple-text-color);\n  }\n  .inverted.purple.buttons .button:hover,\n  .inverted.purple.button:hover {\n    background-color: var(--light-purple-hover);\n  }\n  .inverted.purple.buttons .button:focus,\n  .inverted.purple.button:focus {\n    background-color: var(--light-purple-focus);\n  }\n  .inverted.purple.buttons .active.button,\n  .inverted.purple.active.button {\n    background-color: var(--light-purple-active);\n  }\n  .inverted.purple.buttons .button:active,\n  .inverted.purple.button:active {\n    background-color: var(--light-purple-down);\n  }\n  .inverted.purple.basic.buttons .button,\n  .inverted.purple.buttons .basic.button,\n  .inverted.purple.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.purple.basic.buttons .button:hover,\n  .inverted.purple.buttons .basic.button:hover,\n  .inverted.purple.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-hover) inset !important;\n    color: var(--light-purple) !important;\n  }\n  .inverted.purple.basic.buttons .button:focus,\n  .inverted.purple.basic.buttons .button:focus,\n  .inverted.purple.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-focus) inset !important;\n    color: var(--light-purple) !important;\n  }\n  .inverted.purple.basic.buttons .active.button,\n  .inverted.purple.buttons .basic.active.button,\n  .inverted.purple.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-active) inset !important;\n    color: var(--light-purple) !important;\n  }\n  .inverted.purple.basic.buttons .button:active,\n  .inverted.purple.buttons .basic.button:active,\n  .inverted.purple.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-down) inset !important;\n    color: var(--light-purple) !important;\n  }\n  .red.buttons .button,\n  .red.button {\n    background-color: var(--red);\n    color: var(--red-text-color);\n    text-shadow: var(--red-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .red.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .red.buttons .button:hover,\n  .red.button:hover {\n    background-color: var(--red-hover);\n    color: var(--red-text-color);\n    text-shadow: var(--red-text-shadow);\n  }\n  .red.buttons .button:focus,\n  .red.button:focus {\n    background-color: var(--red-focus);\n    color: var(--red-text-color);\n    text-shadow: var(--red-text-shadow);\n  }\n  .red.buttons .button:active,\n  .red.button:active {\n    background-color: var(--red-down);\n    color: var(--red-text-color);\n    text-shadow: var(--red-text-shadow);\n  }\n  .red.buttons .active.button,\n  .red.buttons .active.button:active,\n  .red.active.button,\n  .red.button .active.button:active {\n    background-color: var(--red-active);\n    color: var(--red-text-color);\n    text-shadow: var(--red-text-shadow);\n  }\n  .basic.red.buttons .button,\n  .basic.red.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--red) inset !important;\n    color: var(--red) !important;\n  }\n  .basic.red.buttons .button:hover,\n  .basic.red.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-hover) inset !important;\n    color: var(--red-hover) !important;\n  }\n  .basic.red.buttons .button:focus,\n  .basic.red.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-focus) inset !important;\n    color: var(--red-hover) !important;\n  }\n  .basic.red.buttons .active.button,\n  .basic.red.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-active) inset !important;\n    color: var(--red-down) !important;\n  }\n  .basic.red.buttons .button:active,\n  .basic.red.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-down) inset !important;\n    color: var(--red-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.red.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.red.buttons .button,\n  .inverted.red.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red) inset !important;\n    color: var(--light-red);\n  }\n  .inverted.red.buttons .button:hover,\n  .inverted.red.button:hover,\n  .inverted.red.buttons .button:focus,\n  .inverted.red.button:focus,\n  .inverted.red.buttons .button.active,\n  .inverted.red.button.active,\n  .inverted.red.buttons .button:active,\n  .inverted.red.button:active {\n    box-shadow: none !important;\n    color: var(--light-red-text-color);\n  }\n  .inverted.red.buttons .button:hover,\n  .inverted.red.button:hover {\n    background-color: var(--light-red-hover);\n  }\n  .inverted.red.buttons .button:focus,\n  .inverted.red.button:focus {\n    background-color: var(--light-red-focus);\n  }\n  .inverted.red.buttons .active.button,\n  .inverted.red.active.button {\n    background-color: var(--light-red-active);\n  }\n  .inverted.red.buttons .button:active,\n  .inverted.red.button:active {\n    background-color: var(--light-red-down);\n  }\n  .inverted.red.basic.buttons .button,\n  .inverted.red.buttons .basic.button,\n  .inverted.red.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.red.basic.buttons .button:hover,\n  .inverted.red.buttons .basic.button:hover,\n  .inverted.red.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-hover) inset !important;\n    color: var(--light-red) !important;\n  }\n  .inverted.red.basic.buttons .button:focus,\n  .inverted.red.basic.buttons .button:focus,\n  .inverted.red.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-focus) inset !important;\n    color: var(--light-red) !important;\n  }\n  .inverted.red.basic.buttons .active.button,\n  .inverted.red.buttons .basic.active.button,\n  .inverted.red.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-active) inset !important;\n    color: var(--light-red) !important;\n  }\n  .inverted.red.basic.buttons .button:active,\n  .inverted.red.buttons .basic.button:active,\n  .inverted.red.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-down) inset !important;\n    color: var(--light-red) !important;\n  }\n  .teal.buttons .button,\n  .teal.button {\n    background-color: var(--teal);\n    color: var(--teal-text-color);\n    text-shadow: var(--teal-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .teal.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .teal.buttons .button:hover,\n  .teal.button:hover {\n    background-color: var(--teal-hover);\n    color: var(--teal-text-color);\n    text-shadow: var(--teal-text-shadow);\n  }\n  .teal.buttons .button:focus,\n  .teal.button:focus {\n    background-color: var(--teal-focus);\n    color: var(--teal-text-color);\n    text-shadow: var(--teal-text-shadow);\n  }\n  .teal.buttons .button:active,\n  .teal.button:active {\n    background-color: var(--teal-down);\n    color: var(--teal-text-color);\n    text-shadow: var(--teal-text-shadow);\n  }\n  .teal.buttons .active.button,\n  .teal.buttons .active.button:active,\n  .teal.active.button,\n  .teal.button .active.button:active {\n    background-color: var(--teal-active);\n    color: var(--teal-text-color);\n    text-shadow: var(--teal-text-shadow);\n  }\n  .basic.teal.buttons .button,\n  .basic.teal.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--teal) inset !important;\n    color: var(--teal) !important;\n  }\n  .basic.teal.buttons .button:hover,\n  .basic.teal.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-hover) inset !important;\n    color: var(--teal-hover) !important;\n  }\n  .basic.teal.buttons .button:focus,\n  .basic.teal.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-focus) inset !important;\n    color: var(--teal-hover) !important;\n  }\n  .basic.teal.buttons .active.button,\n  .basic.teal.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-active) inset !important;\n    color: var(--teal-down) !important;\n  }\n  .basic.teal.buttons .button:active,\n  .basic.teal.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-down) inset !important;\n    color: var(--teal-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.teal.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.teal.buttons .button,\n  .inverted.teal.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal) inset !important;\n    color: var(--light-teal);\n  }\n  .inverted.teal.buttons .button:hover,\n  .inverted.teal.button:hover,\n  .inverted.teal.buttons .button:focus,\n  .inverted.teal.button:focus,\n  .inverted.teal.buttons .button.active,\n  .inverted.teal.button.active,\n  .inverted.teal.buttons .button:active,\n  .inverted.teal.button:active {\n    box-shadow: none !important;\n    color: var(--light-teal-text-color);\n  }\n  .inverted.teal.buttons .button:hover,\n  .inverted.teal.button:hover {\n    background-color: var(--light-teal-hover);\n  }\n  .inverted.teal.buttons .button:focus,\n  .inverted.teal.button:focus {\n    background-color: var(--light-teal-focus);\n  }\n  .inverted.teal.buttons .active.button,\n  .inverted.teal.active.button {\n    background-color: var(--light-teal-active);\n  }\n  .inverted.teal.buttons .button:active,\n  .inverted.teal.button:active {\n    background-color: var(--light-teal-down);\n  }\n  .inverted.teal.basic.buttons .button,\n  .inverted.teal.buttons .basic.button,\n  .inverted.teal.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.teal.basic.buttons .button:hover,\n  .inverted.teal.buttons .basic.button:hover,\n  .inverted.teal.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-hover) inset !important;\n    color: var(--light-teal) !important;\n  }\n  .inverted.teal.basic.buttons .button:focus,\n  .inverted.teal.basic.buttons .button:focus,\n  .inverted.teal.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-focus) inset !important;\n    color: var(--light-teal) !important;\n  }\n  .inverted.teal.basic.buttons .active.button,\n  .inverted.teal.buttons .basic.active.button,\n  .inverted.teal.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-active) inset !important;\n    color: var(--light-teal) !important;\n  }\n  .inverted.teal.basic.buttons .button:active,\n  .inverted.teal.buttons .basic.button:active,\n  .inverted.teal.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-down) inset !important;\n    color: var(--light-teal) !important;\n  }\n  .olive.buttons .button,\n  .olive.button {\n    background-color: var(--olive);\n    color: var(--olive-text-color);\n    text-shadow: var(--olive-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .olive.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .olive.buttons .button:hover,\n  .olive.button:hover {\n    background-color: var(--olive-hover);\n    color: var(--olive-text-color);\n    text-shadow: var(--olive-text-shadow);\n  }\n  .olive.buttons .button:focus,\n  .olive.button:focus {\n    background-color: var(--olive-focus);\n    color: var(--olive-text-color);\n    text-shadow: var(--olive-text-shadow);\n  }\n  .olive.buttons .button:active,\n  .olive.button:active {\n    background-color: var(--olive-down);\n    color: var(--olive-text-color);\n    text-shadow: var(--olive-text-shadow);\n  }\n  .olive.buttons .active.button,\n  .olive.buttons .active.button:active,\n  .olive.active.button,\n  .olive.button .active.button:active {\n    background-color: var(--olive-active);\n    color: var(--olive-text-color);\n    text-shadow: var(--olive-text-shadow);\n  }\n  .basic.olive.buttons .button,\n  .basic.olive.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--olive) inset !important;\n    color: var(--olive) !important;\n  }\n  .basic.olive.buttons .button:hover,\n  .basic.olive.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-hover) inset !important;\n    color: var(--olive-hover) !important;\n  }\n  .basic.olive.buttons .button:focus,\n  .basic.olive.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-focus) inset !important;\n    color: var(--olive-hover) !important;\n  }\n  .basic.olive.buttons .active.button,\n  .basic.olive.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-active) inset !important;\n    color: var(--olive-down) !important;\n  }\n  .basic.olive.buttons .button:active,\n  .basic.olive.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-down) inset !important;\n    color: var(--olive-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.olive.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.olive.buttons .button,\n  .inverted.olive.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive) inset !important;\n    color: var(--light-olive);\n  }\n  .inverted.olive.buttons .button:hover,\n  .inverted.olive.button:hover,\n  .inverted.olive.buttons .button:focus,\n  .inverted.olive.button:focus,\n  .inverted.olive.buttons .button.active,\n  .inverted.olive.button.active,\n  .inverted.olive.buttons .button:active,\n  .inverted.olive.button:active {\n    box-shadow: none !important;\n    color: var(--light-olive-text-color);\n  }\n  .inverted.olive.buttons .button:hover,\n  .inverted.olive.button:hover {\n    background-color: var(--light-olive-hover);\n  }\n  .inverted.olive.buttons .button:focus,\n  .inverted.olive.button:focus {\n    background-color: var(--light-olive-focus);\n  }\n  .inverted.olive.buttons .active.button,\n  .inverted.olive.active.button {\n    background-color: var(--light-olive-active);\n  }\n  .inverted.olive.buttons .button:active,\n  .inverted.olive.button:active {\n    background-color: var(--light-olive-down);\n  }\n  .inverted.olive.basic.buttons .button,\n  .inverted.olive.buttons .basic.button,\n  .inverted.olive.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.olive.basic.buttons .button:hover,\n  .inverted.olive.buttons .basic.button:hover,\n  .inverted.olive.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-hover) inset !important;\n    color: var(--light-olive) !important;\n  }\n  .inverted.olive.basic.buttons .button:focus,\n  .inverted.olive.basic.buttons .button:focus,\n  .inverted.olive.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-focus) inset !important;\n    color: var(--light-olive) !important;\n  }\n  .inverted.olive.basic.buttons .active.button,\n  .inverted.olive.buttons .basic.active.button,\n  .inverted.olive.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-active) inset !important;\n    color: var(--light-olive) !important;\n  }\n  .inverted.olive.basic.buttons .button:active,\n  .inverted.olive.buttons .basic.button:active,\n  .inverted.olive.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-down) inset !important;\n    color: var(--light-olive) !important;\n  }\n  .yellow.buttons .button,\n  .yellow.button {\n    background-color: var(--yellow);\n    color: var(--yellow-text-color);\n    text-shadow: var(--yellow-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .yellow.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .yellow.buttons .button:hover,\n  .yellow.button:hover {\n    background-color: var(--yellow-hover);\n    color: var(--yellow-text-color);\n    text-shadow: var(--yellow-text-shadow);\n  }\n  .yellow.buttons .button:focus,\n  .yellow.button:focus {\n    background-color: var(--yellow-focus);\n    color: var(--yellow-text-color);\n    text-shadow: var(--yellow-text-shadow);\n  }\n  .yellow.buttons .button:active,\n  .yellow.button:active {\n    background-color: var(--yellow-down);\n    color: var(--yellow-text-color);\n    text-shadow: var(--yellow-text-shadow);\n  }\n  .yellow.buttons .active.button,\n  .yellow.buttons .active.button:active,\n  .yellow.active.button,\n  .yellow.button .active.button:active {\n    background-color: var(--yellow-active);\n    color: var(--yellow-text-color);\n    text-shadow: var(--yellow-text-shadow);\n  }\n  .basic.yellow.buttons .button,\n  .basic.yellow.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--yellow) inset !important;\n    color: var(--yellow) !important;\n  }\n  .basic.yellow.buttons .button:hover,\n  .basic.yellow.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-hover) inset !important;\n    color: var(--yellow-hover) !important;\n  }\n  .basic.yellow.buttons .button:focus,\n  .basic.yellow.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-focus) inset !important;\n    color: var(--yellow-hover) !important;\n  }\n  .basic.yellow.buttons .active.button,\n  .basic.yellow.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-active) inset !important;\n    color: var(--yellow-down) !important;\n  }\n  .basic.yellow.buttons .button:active,\n  .basic.yellow.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-down) inset !important;\n    color: var(--yellow-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.yellow.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n  .inverted.yellow.buttons .button,\n  .inverted.yellow.button {\n    background-color: transparent;\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow) inset !important;\n    color: var(--light-yellow);\n  }\n  .inverted.yellow.buttons .button:hover,\n  .inverted.yellow.button:hover,\n  .inverted.yellow.buttons .button:focus,\n  .inverted.yellow.button:focus,\n  .inverted.yellow.buttons .button.active,\n  .inverted.yellow.button.active,\n  .inverted.yellow.buttons .button:active,\n  .inverted.yellow.button:active {\n    box-shadow: none !important;\n    color: var(--light-yellow-text-color);\n  }\n  .inverted.yellow.buttons .button:hover,\n  .inverted.yellow.button:hover {\n    background-color: var(--light-yellow-hover);\n  }\n  .inverted.yellow.buttons .button:focus,\n  .inverted.yellow.button:focus {\n    background-color: var(--light-yellow-focus);\n  }\n  .inverted.yellow.buttons .active.button,\n  .inverted.yellow.active.button {\n    background-color: var(--light-yellow-active);\n  }\n  .inverted.yellow.buttons .button:active,\n  .inverted.yellow.button:active {\n    background-color: var(--light-yellow-down);\n  }\n  .inverted.yellow.basic.buttons .button,\n  .inverted.yellow.buttons .basic.button,\n  .inverted.yellow.basic.button {\n    background-color: transparent;\n    box-shadow: var(--basic-inverted-box-shadow) !important;\n    color: var(--white) !important;\n  }\n  .inverted.yellow.basic.buttons .button:hover,\n  .inverted.yellow.buttons .basic.button:hover,\n  .inverted.yellow.basic.button:hover {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-hover) inset !important;\n    color: var(--light-yellow) !important;\n  }\n  .inverted.yellow.basic.buttons .button:focus,\n  .inverted.yellow.basic.buttons .button:focus,\n  .inverted.yellow.basic.button:focus {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-focus) inset !important;\n    color: var(--light-yellow) !important;\n  }\n  .inverted.yellow.basic.buttons .active.button,\n  .inverted.yellow.buttons .basic.active.button,\n  .inverted.yellow.basic.active.button {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-active) inset !important;\n    color: var(--light-yellow) !important;\n  }\n  .inverted.yellow.basic.buttons .button:active,\n  .inverted.yellow.buttons .basic.button:active,\n  .inverted.yellow.basic.button:active {\n    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-down) inset !important;\n    color: var(--light-yellow) !important;\n  }\n}\n\n/* src/button/css/variations/compact.css */\n@layer component {\n  .compact.buttons .button,\n  .compact.button {\n    padding: var(--compact-vertical-padding) var(--compact-horizontal-padding) (var(--compact-vertical-padding) + var(--shadow-offset));\n  }\n  .compact.icon.buttons .button,\n  .compact.icon.button {\n    padding: var(--compact-vertical-padding) var(--compact-vertical-padding) (var(--compact-vertical-padding) + var(--shadow-offset));\n  }\n  .compact.labeled.icon.buttons .button,\n  .compact.labeled.icon.button {\n    padding: var(--compact-vertical-padding) (var(--compact-horizontal-padding) + var(--labeled-icon-width)) (var(--compact-vertical-padding) + var(--shadow-offset));\n  }\n}\n\n/* src/button/css/variations/floated.css */\n@layer component {\n  [class*="left floated"].buttons,\n  [class*="left floated"].button {\n    float: left;\n    margin-left: 0em;\n    margin-right: var(--floated-margin);\n  }\n  [class*="right floated"].buttons,\n  [class*="right floated"].button {\n    float: right;\n    margin-right: 0em;\n    margin-left: var(--floated-margin);\n  }\n}\n\n/* src/button/css/variations/fluid.css */\n@layer component {\n  .fluid.buttons,\n  .fluid.button {\n    width: 100%;\n  }\n  .fluid.button {\n    display: block;\n  }\n  .two.buttons {\n    width: 100%;\n  }\n  .two.buttons > .button {\n    width: 50%;\n  }\n  .three.buttons {\n    width: 100%;\n  }\n  .three.buttons > .button {\n    width: 33.333%;\n  }\n  .four.buttons {\n    width: 100%;\n  }\n  .four.buttons > .button {\n    width: 25%;\n  }\n  .five.buttons {\n    width: 100%;\n  }\n  .five.buttons > .button {\n    width: 20%;\n  }\n  .six.buttons {\n    width: 100%;\n  }\n  .six.buttons > .button {\n    width: 16.666%;\n  }\n  .seven.buttons {\n    width: 100%;\n  }\n  .seven.buttons > .button {\n    width: 14.285%;\n  }\n  .eight.buttons {\n    width: 100%;\n  }\n  .eight.buttons > .button {\n    width: 12.500%;\n  }\n  .nine.buttons {\n    width: 100%;\n  }\n  .nine.buttons > .button {\n    width: 11.11%;\n  }\n  .ten.buttons {\n    width: 100%;\n  }\n  .ten.buttons > .button {\n    width: 10%;\n  }\n  .eleven.buttons {\n    width: 100%;\n  }\n  .eleven.buttons > .button {\n    width: 9.09%;\n  }\n  .twelve.buttons {\n    width: 100%;\n  }\n  .twelve.buttons > .button {\n    width: 8.3333%;\n  }\n  .fluid.vertical.buttons,\n  .fluid.vertical.buttons > .button {\n    display: flex;\n    width: auto;\n  }\n  .two.vertical.buttons > .button {\n    height: 50%;\n  }\n  .three.vertical.buttons > .button {\n    height: 33.333%;\n  }\n  .four.vertical.buttons > .button {\n    height: 25%;\n  }\n  .five.vertical.buttons > .button {\n    height: 20%;\n  }\n  .six.vertical.buttons > .button {\n    height: 16.666%;\n  }\n  .seven.vertical.buttons > .button {\n    height: 14.285%;\n  }\n  .eight.vertical.buttons > .button {\n    height: 12.500%;\n  }\n  .nine.vertical.buttons > .button {\n    height: 11.11%;\n  }\n  .ten.vertical.buttons > .button {\n    height: 10%;\n  }\n  .eleven.vertical.buttons > .button {\n    height: 9.09%;\n  }\n  .twelve.vertical.buttons > .button {\n    height: 8.3333%;\n  }\n}\n\n/* src/button/css/variations/negative.css */\n@layer component {\n  .negative.buttons .button,\n  .negative.button {\n    background-color: var(--negative-color);\n    color: var(--negative-text-color);\n    text-shadow: var(--negative-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .negative.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .negative.buttons .button:hover,\n  .negative.button:hover {\n    background-color: var(--negative-color-hover);\n    color: var(--negative-text-color);\n    text-shadow: var(--negative-text-shadow);\n  }\n  .negative.buttons .button:focus,\n  .negative.button:focus {\n    background-color: var(--negative-color-focus);\n    color: var(--negative-text-color);\n    text-shadow: var(--negative-text-shadow);\n  }\n  .negative.buttons .button:active,\n  .negative.button:active {\n    background-color: var(--negative-color-down);\n    color: var(--negative-text-color);\n    text-shadow: var(--negative-text-shadow);\n  }\n  .negative.buttons .active.button,\n  .negative.buttons .active.button:active,\n  .negative.active.button,\n  .negative.button .active.button:active {\n    background-color: var(--negative-color-active);\n    color: var(--negative-text-color);\n    text-shadow: var(--negative-text-shadow);\n  }\n  .basic.negative.buttons .button,\n  .basic.negative.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--negative-color) inset !important;\n    color: var(--negative-color) !important;\n  }\n  .basic.negative.buttons .button:hover,\n  .basic.negative.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-hover) inset !important;\n    color: var(--negative-color-hover) !important;\n  }\n  .basic.negative.buttons .button:focus,\n  .basic.negative.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-focus) inset !important;\n    color: var(--negative-color-hover) !important;\n  }\n  .basic.negative.buttons .active.button,\n  .basic.negative.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-active) inset !important;\n    color: var(--negative-color-down) !important;\n  }\n  .basic.negative.buttons .button:active,\n  .basic.negative.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-down) inset !important;\n    color: var(--negative-color-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.primary.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n}\n\n/* src/button/css/variations/positive.css */\n@layer component {\n  .positive.buttons .button,\n  .positive.button {\n    background-color: var(--positive-color);\n    color: var(--positive-text-color);\n    text-shadow: var(--positive-text-shadow);\n    background-image: var(--colored-background-image);\n  }\n  .positive.button {\n    box-shadow: var(--colored-box-shadow);\n  }\n  .positive.buttons .button:hover,\n  .positive.button:hover {\n    background-color: var(--positive-color-hover);\n    color: var(--positive-text-color);\n    text-shadow: var(--positive-text-shadow);\n  }\n  .positive.buttons .button:focus,\n  .positive.button:focus {\n    background-color: var(--positive-color-focus);\n    color: var(--positive-text-color);\n    text-shadow: var(--positive-text-shadow);\n  }\n  .positive.buttons .button:active,\n  .positive.button:active {\n    background-color: var(--positive-color-down);\n    color: var(--positive-text-color);\n    text-shadow: var(--positive-text-shadow);\n  }\n  .positive.buttons .active.button,\n  .positive.buttons .active.button:active,\n  .positive.active.button,\n  .positive.button .active.button:active {\n    background-color: var(--positive-color-active);\n    color: var(--positive-text-color);\n    text-shadow: var(--positive-text-shadow);\n  }\n  .basic.positive.buttons .button,\n  .basic.positive.button {\n    box-shadow: 0px 0px 0px var(--basic-border-size) var(--positive-color) inset !important;\n    color: var(--positive-color) !important;\n  }\n  .basic.positive.buttons .button:hover,\n  .basic.positive.button:hover {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-hover) inset !important;\n    color: var(--positive-color-hover) !important;\n  }\n  .basic.positive.buttons .button:focus,\n  .basic.positive.button:focus {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-focus) inset !important;\n    color: var(--positive-color-hover) !important;\n  }\n  .basic.positive.buttons .active.button,\n  .basic.positive.active.button {\n    background: transparent !important;\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-active) inset !important;\n    color: var(--positive-color-down) !important;\n  }\n  .basic.positive.buttons .button:active,\n  .basic.positive.button:active {\n    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-down) inset !important;\n    color: var(--positive-color-down) !important;\n  }\n  .buttons:not(.vertical) > .basic.primary.button:not(:first-child) {\n    margin-left: var(--basic-colored-border-size);\n  }\n}\n\n/* src/button/css/variations/sizing.css */\n@layer component {\n  .mini.buttons .button,\n  .mini.buttons .or,\n  .mini.button {\n    font-size: var(--mini);\n  }\n  .tiny.buttons .button,\n  .tiny.buttons .or,\n  .tiny.button {\n    font-size: var(--tiny);\n  }\n  .small.buttons .button,\n  .small.buttons .or,\n  .small.button {\n    font-size: var(--small);\n  }\n  .buttons .button,\n  .buttons .or,\n  .button {\n    font-size: var(--medium);\n  }\n  .large.buttons .button,\n  .large.buttons .or,\n  .large.button {\n    font-size: var(--large);\n  }\n  .big.buttons .button,\n  .big.buttons .or,\n  .big.button {\n    font-size: var(--big);\n  }\n  .huge.buttons .button,\n  .huge.buttons .or,\n  .huge.button {\n    font-size: var(--huge);\n  }\n  .massive.buttons .button,\n  .massive.buttons .or,\n  .massive.button {\n    font-size: var(--massive);\n  }\n}\n\n/* src/button/css/variations/social.css */\n@layer component {\n  .facebook.button {\n    background-color: var(--facebook-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .facebook.button:hover {\n    background-color: var(--facebook-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .facebook.button:active {\n    background-color: var(--facebook-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .twitter.button {\n    background-color: var(--twitter-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .twitter.button:hover {\n    background-color: var(--twitter-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .twitter.button:active {\n    background-color: var(--twitter-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .google.plus.button {\n    background-color: var(--google-plus-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .google.plus.button:hover {\n    background-color: var(--google-plus-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .google.plus.button:active {\n    background-color: var(--google-plus-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .linkedin.button {\n    background-color: var(--linked-in-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .linkedin.button:hover {\n    background-color: var(--linked-in-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .linkedin.button:active {\n    background-color: var(--linked-in-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .youtube.button {\n    background-color: var(--youtube-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .youtube.button:hover {\n    background-color: var(--youtube-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .youtube.button:active {\n    background-color: var(--youtube-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .instagram.button {\n    background-color: var(--instagram-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .instagram.button:hover {\n    background-color: var(--instagram-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .instagram.button:active {\n    background-color: var(--instagram-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .pinterest.button {\n    background-color: var(--pinterest-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .pinterest.button:hover {\n    background-color: var(--pinterest-hover-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .pinterest.button:active {\n    background-color: var(--pinterest-down-color);\n    color: var(--inverted-text-color);\n    text-shadow: var(--inverted-text-shadow);\n  }\n  .vk.button {\n    background-color: var(--vk-color);\n    color: var(--white);\n    background-image: var(--colored-background-image);\n    box-shadow: var(--colored-box-shadow);\n  }\n  .vk.button:hover {\n    background-color: var(--vk-hover-color);\n    color: var(--white);\n  }\n  .vk.button:active {\n    background-color: var(--vk-down-color);\n    color: var(--white);\n  }\n}\n\n/* src/button/css/variations/vertical.css */\n@layer component {\n  .vertical.buttons {\n    display: inline-flex;\n    flex-direction: column;\n  }\n  .vertical.buttons .button {\n    display: block;\n    float: none;\n    width: 100%;\n    margin: var(--vertical-group-offset);\n    box-shadow: var(--vertical-box-shadow);\n    border-radius: 0em;\n  }\n  .vertical.buttons .button:first-child {\n    border-top-left-radius: var(--border-radius);\n    border-top-right-radius: var(--border-radius);\n  }\n  .vertical.buttons .button:last-child {\n    margin-bottom: 0px;\n    border-bottom-left-radius: var(--border-radius);\n    border-bottom-right-radius: var(--border-radius);\n  }\n  .vertical.buttons .button:only-child {\n    border-radius: var(--border-radius);\n  }\n}\n\n/* src/button/css/button.css */\n';

// src/button/button.html
var button_default2 = '<div class="{{ui}} button">\n  {{slot}}\n</div>\n';

// src/button/spec/spec.js
var ButtonSpec = {
  /*******************************
             Definition
  *******************************/
  uiType: 'element',
  name: 'Button',
  description: 'A button indicates possible user action',
  tagName: 'button',
  /*******************************
             Singular
  *******************************/
  content: [
    {
      name: 'Text',
      looseCoupling: true,
      couplesWith: ['icon'],
      slot: 'icon',
      description: 'A button can can contain text content',
    },
    {
      name: 'Icon',
      looseCoupling: true,
      couplesWith: ['icon'],
      slot: 'icon',
      description: 'A button can be formatted to include an icon',
    },
    {
      name: 'Label',
      looseCoupling: true,
      couplesWith: ['label'],
      slot: 'label',
      description: 'A button can be formatted to include a label',
    },
    {
      name: 'Or',
      slot: 'or',
      description:
        'A button group can be formatted to show a conditional choice',
    },
  ],
  /*-------------------
          Types
  --------------------*/
  types: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description:
        'A button can be formatted to show different levels of emphasis',
      adoptionLevel: 1,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description:
            'This button should appear to be emphasized as the first action that should be taken over other options.',
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description:
            'This button should appear to be emphasized as a secondary option that should appear after other options',
        },
      ],
    },
    {
      name: 'Icon',
      attribute: 'icon',
      description: 'A button can appear with an icon',
      adoptionLevel: 2,
      looseCoupling: true,
      couplesWith: ['icon'],
      distinctHTML: true,
    },
    {
      name: 'Labeled',
      attribute: 'labeled',
      description:
        'A button can appear specially formatted to attach to a label element',
      adoptionLevel: 3,
      looseCoupling: true,
      couplesWith: ['label'],
      options: [
        {
          name: 'Labeled',
          value: ['labeled', 'right-labeled'],
          description:
            'A button can be formatted so that a label appears to the right',
        },
        {
          name: 'Left Labeled',
          value: 'left-labeled',
          description:
            'A button can be formatted so that a label appears to the left',
        },
      ],
      distinctHTML: true,
    },
    {
      name: 'Labeled Icon',
      description:
        'A button can be formatted so that the icon appears separately.',
      looseCoupling: true,
      adoptionLevel: 3,
      options: [
        {
          name: 'Labeled',
          value: 'labeled',
          description:
            'A button can be formatted so that the icon appears to the right',
        },
        {
          name: 'Left Labeled',
          value: 'left-labeled',
          description:
            'A button can be formatted so that the icon appears to the left',
        },
      ],
      distinctHTML: true,
    },
    {
      name: 'Toggle',
      description: 'A button can be formatted to emphasize its active state',
      adoptionLevel: 3,
      options: [
        {
          name: 'Toggle',
          value: true,
          description:
            'A button can be formatted to animate hidden content horizontally',
        },
      ],
      distinctHTML: true,
    },
    {
      name: 'Animated',
      description: 'A button can animate to show hidden content',
      adoptionLevel: 5,
      options: [
        {
          name: 'Animated',
          value: 'animated',
          description:
            'A button can be formatted to animate hidden content horizontally',
        },
        {
          name: 'Vertical Animated',
          value: 'vertical-animated',
          description:
            'A button can be formatted to animate hidden content vertically',
        },
        {
          name: 'Fade Animated',
          value: 'vertical-animated',
          description: 'A button can be formatted to fade in hidden content',
        },
      ],
      distinctHTML: true,
    },
  ],
  /*-------------------
         States
  --------------------*/
  states: [
    {
      name: 'Hover',
      attribute: 'hover',
      description: 'A button can show it is currently hovered',
    },
    {
      name: 'Focus',
      attribute: 'focus',
      description: 'A button can show it is currently focused by the keyboard',
    },
    {
      name: 'Active',
      attribute: 'active',
      description: 'A button can show it is currently the activated',
    },
    {
      name: 'Disabled',
      attribute: 'disabled',
      description:
        'A button can show it is currently unable to be interacted with',
    },
    {
      name: 'Loading',
      attribute: 'loading',
      description: 'A button can show a loading indicator',
    },
  ],
  /*-------------------
        Variations
  --------------------*/
  variations: [
    {
      name: 'Attached',
      value: 'attached',
      description: 'A button can be attached',
      adoptionLevel: 2,
      options: [
        {
          name: 'Attached',
          value: 'attached',
          description: 'A button can appear attached both above and below',
        },
        {
          name: 'Bottom Attached',
          value: 'bottom-attached',
          description:
            'A button can appear attached to the bottom of other content',
        },
        {
          name: 'Top Attached',
          value: 'top-attached',
          description:
            'A button can appear attached to the top of other content',
        },
        {
          name: 'Left Attached',
          value: 'left-attached',
          description:
            'A button can appear attached to the left of other content',
        },
        {
          name: 'Right Attached',
          value: 'right-attached',
          description:
            'A button can appear attached to the right of other content',
        },
      ],
    },
    {
      name: 'Basic',
      value: 'styling',
      description:
        'A button can be formatted to appear de-emphasized over other elements in the page.',
      adoptionLevel: 3,
      options: [
        {
          name: 'Basic',
          value: 'basic',
          description: 'A button can appear slightly less pronounced.',
        },
        {
          name: 'Very Basic',
          value: 'very-basic',
          description: 'A button can appear to be much less pronounced.',
        },
      ],
    },
    {
      name: 'Circular',
      value: 'circular',
      description: 'A button can be formatted to appear circular.',
      adoptionLevel: 3,
      options: [
        {
          name: 'Circular',
          value: true,
        },
      ],
    },
    {
      name: 'Colored',
      value: 'color',
      description: 'A button can be colored',
      adoptionLevel: 3,
      options: [
        {
          name: 'Red',
          value: 'red',
          description: 'A button can be red',
        },
        {
          name: 'Orange',
          value: 'orange',
          description: 'A button can be orange',
        },
        {
          name: 'Yellow',
          value: 'yellow',
          description: 'A button can be yellow',
        },
        {
          name: 'Olive',
          value: 'olive',
          description: 'A button can be olive',
        },
        {
          name: 'Green',
          value: 'green',
          description: 'A button can be green',
        },
        {
          name: 'Teal',
          value: 'teal',
          description: 'A button can be teal',
        },
        {
          name: 'Blue',
          value: 'blue',
          description: 'A button can be blue',
        },
        {
          name: 'Violet',
          value: 'violet',
          description: 'A button can be violet',
        },
        {
          name: 'Purple',
          value: 'purple',
          description: 'A button can be purple',
        },
        {
          name: 'Pink',
          value: 'pink',
          description: 'A button can be pink',
        },
        {
          name: 'Brown',
          value: 'brown',
          description: 'A button can be brown',
        },
        {
          name: 'Grey',
          value: 'grey',
          description: 'A button can be grey',
        },
        {
          name: 'Black',
          value: 'black',
          description: 'A button can be black',
        },
      ],
    },
    {
      name: 'Compact',
      value: 'compact',
      adoptionLevel: 3,
      description:
        'A button can reduce its padding to fit into tighter spaces without adjusting its font size',
      options: [
        {
          name: 'Compact',
          value: 'compact',
          description: 'A button can reduce its padding size slightly.',
        },
        {
          name: 'Very Compact',
          value: 'very-compact',
          description: 'A button can reduce its padding size greatly.',
        },
      ],
    },
    {
      name: 'Social Site',
      value: 'social',
      adoptionLevel: 5,
      description:
        'A button can appear formatted with the brand colors of a social website',
      options: [
        {
          name: 'Facebook',
          value: 'facebook',
          description: 'A button can link to facebook',
        },
        {
          name: 'Twitter',
          value: 'twitter',
          description: 'A button can link to twitter',
        },
        {
          name: 'Google Plus',
          value: 'google plus',
          description: 'A button can link to google plus',
        },
        {
          name: 'Vk',
          value: 'vk',
          description: 'A button can link to vk',
        },
        {
          name: 'Linkedin',
          value: 'linkedin',
          description: 'A button can link to linkedin',
        },
        {
          name: 'Instagram',
          value: 'instagram',
          description: 'A button can link to instagram',
        },
        {
          name: 'Youtube',
          value: 'youtube',
          description: 'A button can link to youtube',
        },
      ],
    },
    {
      name: 'Positive',
      value: 'positive',
      adoptionLevel: 2,
      description:
        'A button can appear to be associated with a positive action',
      options: [
        {
          name: 'Positive',
          value: 'positive',
          description: 'A button be positive.',
        },
        {
          name: 'Subtle Positive',
          value: 'subtle-positive',
          description: 'A button can subtly hint at a positive action',
        },
      ],
    },
    {
      name: 'Negative',
      value: 'negative',
      adoptionLevel: 2,
      description:
        'A button can appear to be associated with a negative action',
      options: [
        {
          name: 'Negative',
          value: 'negative',
          description: 'A button be negative.',
        },
        {
          name: 'Subtle Negative',
          value: 'subtle-negative',
          description: 'A button can subtly hint at a negative action',
        },
      ],
    },
    {
      name: 'Floated',
      value: 'floated',
      adoptionLevel: 1,
      description:
        'A button can be aligned to the left or right of its container',
      options: [
        {
          name: 'Left Floated',
          value: ['left-floated'],
          description: 'A button can appear to the left of content.',
        },
        {
          name: 'Right Floated',
          value: 'right-floated',
          description: 'A button can appear to the right of content.',
        },
      ],
    },
    {
      name: 'Fluid',
      value: 'fluid',
      adoptionLevel: 1,
      description: 'A button can take the width of its container',
    },
    {
      name: 'Size',
      value: 'size',
      adoptionLevel: 1,
      description: 'A button can vary in size',
      options: [
        {
          name: 'Mini',
          value: 'mini',
          description: 'An element can appear extremely small',
        },
        {
          name: 'Tiny',
          value: 'tiny',
          description: 'An element can appear very small',
        },
        {
          name: 'Small',
          value: 'small',
          description: 'An element can appear small',
        },
        {
          name: 'Medium',
          value: 'medium',
          description: 'An element can appear normal sized',
        },
        {
          name: 'Large',
          value: 'large',
          description: 'An element can appear larger than normal',
        },
        {
          name: 'Big',
          value: 'big',
          description: 'An element can appear much larger than normal',
        },
        {
          name: 'Huge',
          value: 'huge',
          description: 'An element can appear very much larger than normal',
        },
        {
          name: 'Massive',
          value: 'massive',
          description: 'An element can appear extremely larger than normal',
        },
      ],
    },
    {
      name: 'Inverted',
      description: 'A button can be formatted to appear on dark backgrounds',
      adoptionLevel: 2,
      attribute: 'inverted',
    },
  ],
  /*******************************
              Plural
  *******************************/
  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'buttons',
  pluralDescription: 'Buttons can exist together as a group',
  pluralVariations: [
    'inverted',
    'size',
    'floated',
    'compact',
    'colored',
    'attached',
  ],
};

// src/button/button.js
var createInstance = (tpl, $3) => ({});
var onCreated = (tpl) => {};
var events = {
  'click .button'(event, tpl, $3) {},
};
var UIButton = createComponent({
  tagName: 'ui-button',
  spec: ButtonSpec,
  template: button_default2,
  css: button_default,
  createInstance,
  onCreated,
  events,
});
export { UIButton };
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

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=semantic-ui.js.map
