var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/button/button.css
var button_default = '/* src/button/css/content/button.css */\n.button {\n  cursor: pointer;\n  display: inline-block;\n  min-height: 1em;\n  font-size: var(--medium);\n  outline: none;\n  border: none;\n  vertical-align: var(--vertical-align);\n  background: var(--background);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n  padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n  text-transform: var(--text-transform);\n  text-shadow: var(--text-shadow);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  font-style: normal;\n  text-align: center;\n  text-decoration: none;\n  border-radius: var(--border-radius);\n  box-shadow: var(--box-shadow);\n  -webkit-user-select: none;\n  -moz-user-select: -moz-none;\n  -ms-user-select: none;\n  user-select: none;\n  transition: var(--transition);\n  will-change: var(--will-change);\n  -webkit-tap-highlight-color: var(--tap-color);\n  outline: none;\n}\n\n/* src/button/css/states/hover.css */\n.button:hover {\n  background-color: var(--hover-background-color);\n  background-image: var(--hover-background-image);\n  box-shadow: var(--hover-box-shadow);\n  color: var(--hover-color);\n}\n.button:hover .icon {\n  opacity: var(--hover-icon-opacity);\n}\n\n/* src/button/css/states/focus.css */\n.button:focus {\n  background-color: var(--focus-background-color);\n  color: var(--focus-color);\n  background-image: var(--focus-background-image) !important;\n  box-shadow: var(--focus-box-shadow) !important;\n}\n.button:focus .icon {\n  opacity: var(--icon-focus-opacity);\n}\n\n/* src/button/css/states/pressed.css */\n.button:active,\n.active.button:active {\n  background-color: var(--pressed-background-color);\n  background-image: var(--pressed-background-image);\n  color: var(--pressed-color);\n  box-shadow: var(--pressed-box-shadow);\n}\n\n/* src/button/css/states/active.css */\n.active.button {\n  background-color: var(--active-background-color);\n  background-image: var(--active-background-image);\n  box-shadow: var(--active-box-shadow);\n  color: var(--active-color);\n}\n.active.button:hover {\n  background-color: var(--active-hover-background-color);\n  background-image: var(--active-hover-background-image);\n  color: var(--active-hover-color);\n  box-shadow: var(--active-hover-box-shadow);\n}\n.active.button:active {\n  background-color: var(--active-down-background-color);\n  background-image: var(--active-down-background-image);\n  color: var(--active-down-color);\n  box-shadow: var(--active-down-box-shadow);\n}\n\n/* src/button/css/states/disabled.css */\n.disabled.button,\n.disabled.button:hover,\n.disabled.active.button {\n  cursor: default;\n  pointer-events: none !important;\n  opacity: var(--disabled-opacity) !important;\n  background-image: var(--disabled-background-image) !important;\n  box-shadow: var(--disabled-background-image) !important;\n}\n\n/* src/button/css/states/loading.css */\n.loading.button {\n  position: relative;\n  cursor: default;\n  text-shadow: none !important;\n  color: transparent !important;\n  opacity: var(--loading-opacity);\n  pointer-events: var(--loading-pointer-events);\n  transition: var(--loading-transition);\n}\n.loading.button:before {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  border-radius: var(--circular-radius);\n  border: var(--loader-line-width) solid var(--inverted-loader-fill-color);\n}\n.loading.button:after {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  animation: button-spin var(--loader-speed-linear);\n  animation-iteration-count: infinite;\n  border-radius: var(--circular-radius);\n  border-color: var(--inverted-loader-line-color) transparent transparent;\n  border-style: solid;\n  border-width: var(--loader-line-width);\n  box-shadow: 0px 0px 0px 1px transparent;\n}\n@keyframes button-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/* src/button/css/types/emphasis.css */\n.primary.buttons .button,\n.primary.button {\n  background-color: var(--primary-color);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n  background-image: var(--primary-background-image);\n}\n.primary.button {\n  box-shadow: var(--primary-box-shadow);\n}\n.primary.buttons .button:hover,\n.primary.button:hover {\n  background-color: var(--primary-color-hover);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .button:focus,\n.primary.button:focus {\n  background-color: var(--primary-color-focus);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .button:active,\n.primary.button:active {\n  background-color: var(--primary-color-down);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .active.button,\n.primary.buttons .active.button:active,\n.primary.active.button,\n.primary.button .active.button:active {\n  background-color: var(--primary-color-active);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n\n/* src/button/css/button.css */\n';

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t4, e5, o4) {
    if (this._$cssResult$ = true, o4 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e5;
  }
  get styleSheet() {
    let t4 = this.o;
    const s4 = this.t;
    if (e && void 0 === t4) {
      const e5 = void 0 !== s4 && 1 === s4.length;
      e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var S = (s4, o4) => {
  if (e)
    s4.adoptedStyleSheets = o4.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
  else
    for (const e5 of o4) {
      const o5 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o5.setAttribute("nonce", n5), o5.textContent = e5.cssText, s4.appendChild(o5);
    }
};
var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e5 = "";
  for (const s4 of t5.cssRules)
    e5 += s4.cssText;
  return r(e5);
})(t4) : t4;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t4, s4) => t4;
var u = { toAttribute(t4, s4) {
  switch (s4) {
    case Boolean:
      t4 = t4 ? l : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, s4) {
  let i4 = t4;
  switch (s4) {
    case Boolean:
      i4 = null !== t4;
      break;
    case Number:
      i4 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        i4 = JSON.parse(t4);
      } catch (t5) {
        i4 = null;
      }
  }
  return i4;
} };
var f = (t4, s4) => !i2(t4, s4);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t4) {
    this._$Ei(), (this.l ??= []).push(t4);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t4, s4 = y) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.elementProperties.set(t4, s4), !s4.noAccessor) {
      const i4 = Symbol(), r5 = this.getPropertyDescriptor(t4, i4, s4);
      void 0 !== r5 && e2(this.prototype, t4, r5);
    }
  }
  static getPropertyDescriptor(t4, s4, i4) {
    const { get: e5, set: h3 } = r2(this.prototype, t4) ?? { get() {
      return this[s4];
    }, set(t5) {
      this[s4] = t5;
    } };
    return { get() {
      return e5?.call(this);
    }, set(s5) {
      const r5 = e5?.call(this);
      h3.call(this, s5), this.requestUpdate(t4, r5, i4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t4 = n2(this);
    t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t5 = this.properties, s4 = [...h(t5), ...o2(t5)];
      for (const i4 of s4)
        this.createProperty(i4, t5[i4]);
    }
    const t4 = this[Symbol.metadata];
    if (null !== t4) {
      const s4 = litPropertyMetadata.get(t4);
      if (void 0 !== s4)
        for (const [t5, i4] of s4)
          this.elementProperties.set(t5, i4);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t5, s4] of this.elementProperties) {
      const i4 = this._$Eu(t5, s4);
      void 0 !== i4 && this._$Eh.set(i4, t5);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i4 = [];
    if (Array.isArray(s4)) {
      const e5 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e5)
        i4.unshift(c(s5));
    } else
      void 0 !== s4 && i4.push(c(s4));
    return i4;
  }
  static _$Eu(t4, s4) {
    const i4 = s4.attribute;
    return false === i4 ? void 0 : "string" == typeof i4 ? i4 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$Eg = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$ES(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
  }
  addController(t4) {
    (this._$E_ ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
  }
  removeController(t4) {
    this._$E_?.delete(t4);
  }
  _$ES() {
    const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i4 of s4.keys())
      this.hasOwnProperty(i4) && (t4.set(i4, this[i4]), delete this[i4]);
    t4.size > 0 && (this._$Ep = t4);
  }
  createRenderRoot() {
    const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t4, this.constructor.elementStyles), t4;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$E_?.forEach((t4) => t4.hostConnected?.());
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    this._$E_?.forEach((t4) => t4.hostDisconnected?.());
  }
  attributeChangedCallback(t4, s4, i4) {
    this._$AK(t4, i4);
  }
  _$EO(t4, s4) {
    const i4 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i4);
    if (void 0 !== e5 && true === i4.reflect) {
      const r5 = (void 0 !== i4.converter?.toAttribute ? i4.converter : u).toAttribute(s4, i4.type);
      this._$Em = t4, null == r5 ? this.removeAttribute(e5) : this.setAttribute(e5, r5), this._$Em = null;
    }
  }
  _$AK(t4, s4) {
    const i4 = this.constructor, e5 = i4._$Eh.get(t4);
    if (void 0 !== e5 && this._$Em !== e5) {
      const t5 = i4.getPropertyOptions(e5), r5 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
      this._$Em = e5, this[e5] = r5.fromAttribute(s4, t5.type), this._$Em = null;
    }
  }
  requestUpdate(t4, s4, i4, e5 = false, r5) {
    if (void 0 !== t4) {
      if (i4 ??= this.constructor.getPropertyOptions(t4), !(i4.hasChanged ?? f)(e5 ? r5 : this[t4], s4))
        return;
      this.C(t4, s4, i4);
    }
    false === this.isUpdatePending && (this._$Eg = this._$EP());
  }
  C(t4, s4, i4) {
    this._$AL.has(t4) || this._$AL.set(t4, s4), true === i4.reflect && this._$Em !== t4 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t4);
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$Eg;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t6, s5] of this._$Ep)
          this[t6] = s5;
        this._$Ep = void 0;
      }
      const t5 = this.constructor.elementProperties;
      if (t5.size > 0)
        for (const [s5, i4] of t5)
          true !== i4.wrapped || this._$AL.has(s5) || void 0 === this[s5] || this.C(s5, this[s5], i4);
    }
    let t4 = false;
    const s4 = this._$AL;
    try {
      t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$E_?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$ET();
    } catch (s5) {
      throw t4 = false, this._$ET(), s5;
    }
    t4 && this._$AE(s4);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    this._$E_?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this._$Ej &&= this._$Ej.forEach((t5) => this._$EO(t5, this[t5])), this._$ET();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${(Math.random() + "").slice(9)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var a2 = Array.isArray;
var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $2 = /^(?:script|style|textarea|title)$/i;
var y2 = (t4) => (i4, ...s4) => ({ _$litType$: t4, strings: i4, values: s4 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t4, i4) {
  if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i4) : i4;
}
var P = (t4, i4) => {
  const s4 = t4.length - 1, o4 = [];
  let r5, l3 = 2 === i4 ? "<svg>" : "", c4 = f2;
  for (let i5 = 0; i5 < s4; i5++) {
    const s5 = t4[i5];
    let a3, u3, d3 = -1, y3 = 0;
    for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); )
      y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($2.test(u3[2]) && (r5 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r5 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r5 = void 0);
    const x2 = c4 === m && t4[i5 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o4.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i5 : x2);
  }
  return [C(t4, l3 + (t4[s4] || "<?>") + (2 === i4 ? "</svg>" : "")), o4];
};
var V = class _V {
  constructor({ strings: t4, _$litType$: s4 }, n5) {
    let r5;
    this.parts = [];
    let c4 = 0, a3 = 0;
    const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = P(t4, s4);
    if (this.el = _V.createElement(f3, n5), E.currentNode = this.el.content, 2 === s4) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r5 = E.nextNode()) && d3.length < u3; ) {
      if (1 === r5.nodeType) {
        if (r5.hasAttributes())
          for (const t5 of r5.getAttributeNames())
            if (t5.endsWith(e3)) {
              const i4 = v2[a3++], s5 = r5.getAttribute(t5).split(h2), e5 = /([.?@])?(.*)/.exec(i4);
              d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: "." === e5[1] ? k : "?" === e5[1] ? H : "@" === e5[1] ? I : R }), r5.removeAttribute(t5);
            } else
              t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r5.removeAttribute(t5));
        if ($2.test(r5.tagName)) {
          const t5 = r5.textContent.split(h2), s5 = t5.length - 1;
          if (s5 > 0) {
            r5.textContent = i3 ? i3.emptyScript : "";
            for (let i4 = 0; i4 < s5; i4++)
              r5.append(t5[i4], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
            r5.append(t5[s5], l2());
          }
        }
      } else if (8 === r5.nodeType)
        if (r5.data === o3)
          d3.push({ type: 2, index: c4 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = r5.data.indexOf(h2, t5 + 1)); )
            d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
        }
      c4++;
    }
  }
  static createElement(t4, i4) {
    const s4 = r3.createElement("template");
    return s4.innerHTML = t4, s4;
  }
};
function N(t4, i4, s4 = t4, e5) {
  if (i4 === w)
    return i4;
  let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
  const o4 = c3(i4) ? void 0 : i4._$litDirective$;
  return h3?.constructor !== o4 && (h3?._$AO?.(false), void 0 === o4 ? h3 = void 0 : (h3 = new o4(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i4 = N(t4, h3._$AS(t4, i4.values), h3, e5)), i4;
}
var S2 = class {
  constructor(t4, i4) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    const { el: { content: i4 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? r3).importNode(i4, true);
    E.currentNode = e5;
    let h3 = E.nextNode(), o4 = 0, n5 = 0, l3 = s4[0];
    for (; void 0 !== l3; ) {
      if (o4 === l3.index) {
        let i5;
        2 === l3.type ? i5 = new M(h3, h3.nextSibling, this, t4) : 1 === l3.type ? i5 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : 6 === l3.type && (i5 = new L(h3, this, t4)), this._$AV.push(i5), l3 = s4[++n5];
      }
      o4 !== l3?.index && (h3 = E.nextNode(), o4++);
    }
    return E.currentNode = r3, e5;
  }
  p(t4) {
    let i4 = 0;
    for (const s4 of this._$AV)
      void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i4), i4 += s4.strings.length - 2) : s4._$AI(t4[i4])), i4++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t4, i4, s4, e5) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === t4?.nodeType && (t4 = i4.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i4 = this) {
    t4 = N(this, t4, i4), c3(t4) ? t4 === T || null == t4 || "" === t4 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t4 !== this._$AH && t4 !== w && this._(t4) : void 0 !== t4._$litType$ ? this.g(t4) : void 0 !== t4.nodeType ? this.$(t4) : u2(t4) ? this.T(t4) : this._(t4);
  }
  k(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  $(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.k(t4));
  }
  _(t4) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.$(r3.createTextNode(t4)), this._$AH = t4;
  }
  g(t4) {
    const { values: i4, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = V.createElement(C(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e5)
      this._$AH.p(i4);
    else {
      const t5 = new S2(e5, this), s5 = t5.u(this.options);
      t5.p(i4), this.$(s5), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i4 = A.get(t4.strings);
    return void 0 === i4 && A.set(t4.strings, i4 = new V(t4)), i4;
  }
  T(t4) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s4, e5 = 0;
    for (const h3 of t4)
      e5 === i4.length ? i4.push(s4 = new _M(this.k(l2()), this.k(l2()), this, this.options)) : s4 = i4[e5], s4._$AI(h3), e5++;
    e5 < i4.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i4.length = e5);
  }
  _$AR(t4 = this._$AA.nextSibling, i4) {
    for (this._$AP?.(false, true, i4); t4 && t4 !== this._$AB; ) {
      const i5 = t4.nextSibling;
      t4.remove(), t4 = i5;
    }
  }
  setConnected(t4) {
    void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i4, s4, e5, h3) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = T;
  }
  _$AI(t4, i4 = this, s4, e5) {
    const h3 = this.strings;
    let o4 = false;
    if (void 0 === h3)
      t4 = N(this, t4, i4, 0), o4 = !c3(t4) || t4 !== this._$AH && t4 !== w, o4 && (this._$AH = t4);
    else {
      const e6 = t4;
      let n5, r5;
      for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++)
        r5 = N(this, e6[s4 + n5], i4, n5), r5 === w && (r5 = this._$AH[n5]), o4 ||= !c3(r5) || r5 !== this._$AH[n5], r5 === T ? t4 = T : t4 !== T && (t4 += (r5 ?? "") + h3[n5 + 1]), this._$AH[n5] = r5;
    }
    o4 && !e5 && this.O(t4);
  }
  O(t4) {
    t4 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(t4) {
    this.element[this.name] = t4 === T ? void 0 : t4;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== T);
  }
};
var I = class extends R {
  constructor(t4, i4, s4, e5, h3) {
    super(t4, i4, s4, e5, h3), this.type = 5;
  }
  _$AI(t4, i4 = this) {
    if ((t4 = N(this, t4, i4, 0) ?? T) === w)
      return;
    const s4 = this._$AH, e5 = t4 === T && s4 !== T || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== T && (s4 === T || e5);
    e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var L = class {
  constructor(t4, i4, s4) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    N(this, t4);
  }
};
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.0");
var j = (t4, i4, s4) => {
  const e5 = s4?.renderBefore ?? i4;
  let h3 = e5._$litPart$;
  if (void 0 === h3) {
    const t5 = s4?.renderBefore ?? null;
    e5._$litPart$ = h3 = new M(i4.insertBefore(l2(), t5), t5, void 0, s4 ?? {});
  }
  return h3._$AI(t4), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t4 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t4.firstChild, t4;
  }
  update(t4) {
    const i4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = j(i4, this.renderRoot, this.renderOptions);
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
(globalThis.litElementVersions ??= []).push("4.0.2");

// src/lib/utils.js
var isFunction = (obj) => {
  return typeof obj == "function" || false;
};

// src/lib/ui-component.js
var UIComponent = class extends s3 {
  /*******************************
              Lifecycle
  *******************************/
  // callback when initialized
  constructor() {
    super();
    if (isFunction(this.on?.created)) {
      this.on?.created();
    }
  }
  // callback when added to dom
  connectedCallback() {
    super.connectedCallback();
    if (isFunction(this.on?.rendered)) {
      this.on?.rendered();
    }
  }
  // callback if removed from dom
  disconnectedCallback() {
    if (isFunction(this.on?.destroyed)) {
      this.on?.created();
    }
  }
  // callback if moves doc
  adoptedCallback() {
    if (isFunction(this.on?.moved)) {
      this.on?.moved();
    }
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    console.log("attribute change: ", name, newVal);
    if (isFunction(this.on?.settingChanged)) {
      this.on?.settingChanged.call(this, {
        attribute,
        oldValue,
        newValue
      });
    }
  }
  /*
    SUI lets you specify if you want to use light dom via attribute
  */
  createRenderRoot() {
    const useLight = false;
    if (useLight) {
      return this;
    } else {
      const renderRoot = super.createRenderRoot();
      return renderRoot;
    }
  }
  /*******************************
              CSS
  *******************************/
  /*******************************
         Settings / Attrs
  *******************************/
  get defaultSettings() {
    return {};
  }
  /*******************************
           DOM Helpers
  *******************************/
  queryScoped(selector) {
    return this.shadowRoot.querySelector(selector);
  }
  queryAllScoped(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }
  // Shadow DOM
  $(selector) {
    return $(selector, this.shadowRoot);
  }
  // DOM
  $$(selector) {
    return $(selector, this);
  }
};

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t4) => (e5, o4) => {
  void 0 !== o4 ? o4.addInitializer(() => {
    customElements.define(t4, e5);
  }) : customElements.define(t4, e5);
};

// src/button/button.ts
var UIButton = class extends UIComponent {
  static get styles() {
    return r(button_default);
  }
  static get properties() {
    return {};
  }
  settings = {
    size: "medium",
    icon: false
  };
  on = {
    created() {
      console.log("on created");
    },
    settingChanged(...params) {
      console.log("on attribute change", params);
    },
    rendered() {
      console.log("on render");
    },
    moved() {
      console.log("moved from DOM");
    },
    destroyed() {
      console.log("on destroy");
    }
  };
  template() {
    console.log("template");
  }
  render() {
    console.log("html", x);
    return x`
      <div class="primary button" name="button" tabindex="0">
        <slot name="icon"></slot>
        <span class="text" name="text">
          <slot></slot>
        </span>
        <slot name="label"></slot>
      </div>
    `;
  }
};
UIButton = __decorateClass([
  t3("ui-button")
], UIButton);
export {
  UIButton
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

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=semantic-ui.js.map
