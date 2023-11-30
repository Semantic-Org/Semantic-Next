var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

// src/button/button.css
var button_default = '/* src/button/css/content/button.css */\n.button {\n  cursor: pointer;\n  display: inline-block;\n  min-height: 1em;\n  font-size: var(--medium);\n  outline: none;\n  border: none;\n  vertical-align: var(--vertical-align);\n  background: var(--background);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n  padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n  text-transform: var(--text-transform);\n  text-shadow: var(--text-shadow);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  font-style: normal;\n  text-align: center;\n  text-decoration: none;\n  border-radius: var(--border-radius);\n  box-shadow: var(--box-shadow);\n  -webkit-user-select: none;\n  -moz-user-select: -moz-none;\n  -ms-user-select: none;\n  user-select: none;\n  transition: var(--transition);\n  will-change: var(--will-change);\n  -webkit-tap-highlight-color: var(--tap-color);\n  outline: none;\n}\n\n/* src/button/css/states/hover.css */\n.button:hover {\n  background-color: var(--hover-background-color);\n  background-image: var(--hover-background-image);\n  box-shadow: var(--hover-box-shadow);\n  color: var(--hover-color);\n}\n.button:hover .icon {\n  opacity: var(--hover-icon-opacity);\n}\n\n/* src/button/css/states/focus.css */\n.button:focus {\n  background-color: var(--focus-background-color);\n  color: var(--focus-color);\n  background-image: var(--focus-background-image) !important;\n  box-shadow: var(--focus-box-shadow) !important;\n}\n.button:focus .icon {\n  opacity: var(--icon-focus-opacity);\n}\n\n/* src/button/css/states/pressed.css */\n.button:active,\n.active.button:active {\n  background-color: var(--pressed-background-color);\n  background-image: var(--pressed-background-image);\n  color: var(--pressed-color);\n  box-shadow: var(--pressed-box-shadow);\n}\n\n/* src/button/css/states/active.css */\n.ui.active.button {\n  background-color: var(--active-background-color);\n  background-image: var(--active-background-image);\n  box-shadow: var(--active-box-shadow);\n  color: var(--active-color);\n}\n.ui.active.button:hover {\n  background-color: var(--active-hover-background-color);\n  background-image: var(--active-hover-background-image);\n  color: var(--active-hover-color);\n  box-shadow: var(--active-hover-box-shadow);\n}\n.ui.active.button:active {\n  background-color: var(--active-down-background-color);\n  background-image: var(--active-down-background-image);\n  color: var(--active-down-color);\n  box-shadow: var(--active-down-box-shadow);\n}\n\n/* src/button/css/states/disabled.css */\n.disabled.button,\n.disabled.button:hover,\n.disabled.active.button {\n  cursor: default;\n  pointer-events: none !important;\n  opacity: var(--disabled-opacity) !important;\n  background-image: var(--disabled-background-image) !important;\n  box-shadow: var(--disabled-background-image) !important;\n}\n\n/* src/button/css/states/loading.css */\n.loading.button {\n  position: relative;\n  cursor: default;\n  text-shadow: none !important;\n  color: transparent !important;\n  opacity: var(--loading-opacity);\n  pointer-events: var(--loading-pointer-events);\n  transition: var(--loading-transition);\n}\n.loading.button:before {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  border-radius: var(--circular-radius);\n  border: var(--loader-line-width) solid var(--inverted-loader-fill-color);\n}\n.loading.button:after {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  animation: button-spin var(--loader-speed-linear);\n  animation-iteration-count: infinite;\n  border-radius: var(--circular-radius);\n  border-color: var(--inverted-loader-line-color) transparent transparent;\n  border-style: solid;\n  border-width: var(--loader-line-width);\n  box-shadow: 0px 0px 0px 1px transparent;\n}\n@keyframes button-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/* src/button/css/button.css */\n';

// src/button/button.html
var button_default2 = '<div class="button" part="button">\n  {{#if text}}\n    <span class="text" part="text" class="{{getClassNames}}">\n      <slot name="text" default></slot>\n    </span>\n  {{elseif conditionTwo}}\n    <span class="two">\n  {{elseif conditionThree}}\n    <span class="three">\n  {{else}}\n    <span class="four"></span>\n  {{/if}}\n  {{#if icon}}\n    <slot name="icon"></slot>\n  {{/if}}\n</div>\n';

// src/lib/query.js
var Query = class _Query {
  constructor(selector, root) {
    if (!selector) {
      return;
    }
    const elements = root.querySelectorAll(selector);
    this.length = elements.length;
    Object.assign(this, elements);
  }
  find(selector) {
    const elements = Array.from(this).flatMap((el) => Array.from(el.querySelectorAll(selector)));
    return new _Query(selector, elements);
  }
  parent() {
    const parents = Array.from(this).map((el) => el.parentElement).filter(Boolean);
    return new _Query(null, parents);
  }
  closest(selector) {
    const closest = Array.from(this).map((el) => {
      let parent = el.parentElement;
      while (parent && !parent.matches(selector)) {
        parent = parent.parentElement;
      }
      return parent;
    }).filter(Boolean);
    return new _Query(null, closest);
  }
  on(event, handler) {
    Array.from(this).forEach((el) => el.addEventListener(event, handler));
    return this;
  }
  remove() {
    Array.from(this).forEach((el) => el.remove());
    return this;
  }
  html(newHtml) {
    if (newHtml !== void 0) {
      Array.from(this).forEach((el) => el.innerHTML = newHtml);
      return this;
    } else if (this.length) {
      return this[0].innerHTML;
    }
  }
  text(newText) {
    if (newText !== void 0) {
      Array.from(this).forEach((el) => el.textContent = newText);
      return this;
    } else if (this.length) {
      return this[0].textContent;
    }
  }
  css(property, value) {
    if (value !== void 0) {
      Array.from(this).forEach((el) => el.style[property] = value);
      return this;
    } else if (this.length) {
      return this[0].style[property];
    }
  }
  attr(attribute, value) {
    if (value !== void 0) {
      Array.from(this).forEach((el) => el.setAttribute(attribute, value));
      return this;
    } else if (this.length) {
      return this[0].getAttribute(attribute);
    }
  }
};
function $(selector, root = document) {
  return new Query(selector, root);
}

// src/lib/utils.js
var keys = (obj) => {
  return Object.keys(obj);
};
var unique = (arr) => {
  return Array.from(new Set(arr));
};
var filterEmpty = (arr) => {
  return arr.filter((val) => val);
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
  let i2;
  if (obj.length === +obj.length) {
    for (i2 = 0; i2 < obj.length; ++i2) {
      iteratee(obj[i2], i2, obj);
    }
  } else {
    let objKeys = keys(obj);
    for (i2 = 0; i2 < objKeys.length; ++i2) {
      iteratee(obj[objKeys[i2]], objKeys[i2], obj);
    }
  }
  return obj;
};
var firstMatch = (array = [], evaluator) => {
  let result;
  each(array, (value, name) => {
    const shouldReturn = evaluator(value, name);
    if (!result && shouldReturn == true) {
      result = value;
    }
  });
  return result;
};
var inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
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
var get = function(object, string = "") {
  string = string.replace(/^\./, "").replace(/\[(\w+)\]/g, ".$1");
  const stringParts = string.split(".");
  for (let index = 0, length = stringParts.length; index < length; ++index) {
    const part = stringParts[index];
    if (!!object && part in object) {
      object = object[part];
    } else {
      return;
    }
  }
  return object;
};

// src/lib/sui-helpers.js
var convertStringifiedSettings = (value, { emptyStringIsTruthy = false } = {}) => {
  if (emptyStringIsTruthy && value === "") {
    return true;
  }
  if (value === "true" || value === true) {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value == "undefined" || value == "null" || value === null) {
    return void 0;
  }
  return value;
};
var getSettingValue = (element, name = "sizing", definition = element == null ? void 0 : element.definition) => {
  const attrValue = convertStringifiedSettings(element.getAttribute(name), {
    emptyStringIsTruthy: true
  });
  return attrValue === void 0 ? element[name] : attrValue;
};
var getDefinitionParts = (type) => {
  const typeParts = {
    element: ["types", "variations", "states"]
  };
  return get(typeParts, type) || [];
};
var getUISettings = (element, definition = element == null ? void 0 : element.definition) => {
  const settings = {};
  const definitionParts = getDefinitionParts(definition.uiType);
  each(definitionParts, (part) => {
    const definitionPart = definition[part];
    each(definitionPart, (definitionSlice) => {
      let attribute = definitionSlice.attribute || (definitionSlice.name || "").toLowerCase();
      let value = getSettingValue(element, attribute);
      let classNames = [...element.classList];
      let options = definitionSlice.options || [definitionSlice.options].filter(Boolean);
      if (value == void 0 && options.length) {
        const match = firstMatch(options, (option) => getSettingValue(element, option.value));
        value = match == null ? void 0 : match.value;
      }
      if (value == void 0 && classNames.length) {
        const optionValues = options.map((option) => option.value);
        if (optionValues.length) {
          value = firstMatch(classNames, (className) => inArray(className, optionValues));
        }
      }
      if (value) {
        settings[attribute] = value;
      }
    });
  });
  return settings;
};
var getAllowedAttributes = (definition) => {
  let attributes = [];
  let getAttributes = function(type) {
    if (type.attribute) {
      attributes.push(type.attribute);
    }
    let options = type.options || [type].filter(Boolean);
    each(options, (option) => {
      if (option.value) {
        attributes.push(option.value);
      }
    });
  };
  each(definition.types, getAttributes);
  each(definition.variations, getAttributes);
  each(definition.states, getAttributes);
  attributes = unique(filterEmpty(attributes));
  return attributes;
};

// node_modules/lit-html/lit-html.js
var t = globalThis;
var i = t.trustedTypes;
var s = i ? i.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0;
var e = "$lit$";
var h = "lit$".concat((Math.random() + "").slice(9), "$");
var o = "?" + h;
var n = "<".concat(o, ">");
var r = document;
var l = () => r.createComment("");
var c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2;
var a = Array.isArray;
var u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]);
var d = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(">|".concat(d, "(?:([^\\s\"'>=/]+)(").concat(d, "*=").concat(d, "*(?:[^ 	\n\f\r\"'`<>=]|(\"|')|))|$)"), "g");
var p = /'/g;
var g = /"/g;
var $2 = /^(?:script|style|textarea|title)$/i;
var y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 });
var x = y(1);
var b = y(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r.createTreeWalker(r, 129);
function C(t2, i2) {
  if (!Array.isArray(t2) || !t2.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s ? s.createHTML(i2) : i2;
}
var P = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y2 = 0;
    for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2); )
      y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($2.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 != null ? r2 : f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [C(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : "")), o2];
};
var V = class _V {
  constructor({ strings: t2, _$litType$: s2 }, n2) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = P(t2, s2);
    if (this.el = _V.createElement(f2, n2), E.currentNode = this.el.content, 2 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = E.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes())
          for (const t3 of r2.getAttributeNames())
            if (t3.endsWith(e)) {
              const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
              d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? k : "?" === e2[1] ? H : "@" === e2[1] ? I : R }), r2.removeAttribute(t3);
            } else
              t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($2.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i ? i.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++)
              r2.append(t3[i2], l()), E.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType)
        if (r2.data === o)
          d2.push({ type: 2, index: c2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); )
            d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
        }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r.createElement("template");
    return s2.innerHTML = t2, s2;
  }
};
function N(t2, i2, s2 = t2, e2) {
  var _a3, _b, _c;
  if (i2 === w)
    return i2;
  let h2 = void 0 !== e2 ? (_a3 = s2._$Co) == null ? void 0 : _a3[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? ((_c = s2._$Co) != null ? _c : s2._$Co = [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = N(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
var S = class {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    var _a3;
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((_a3 = t2 == null ? void 0 : t2.creationScope) != null ? _a3 : r).importNode(i2, true);
    E.currentNode = e2;
    let h2 = E.nextNode(), o2 = 0, n2 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new M(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new L(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n2];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = E.nextNode(), o2++);
    }
    return E.currentNode = r, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV)
      void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
};
var M = class _M {
  get _$AU() {
    var _a3, _b;
    return (_b = (_a3 = this._$AM) == null ? void 0 : _a3._$AU) != null ? _b : this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    var _a3;
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (_a3 = e2 == null ? void 0 : e2.isConnected) != null ? _a3 : true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = N(this, t2, i2), c(t2) ? t2 === T || null == t2 || "" === t2 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t2 !== this._$AH && t2 !== w && this._(t2) : void 0 !== t2._$litType$ ? this.g(t2) : void 0 !== t2.nodeType ? this.$(t2) : u(t2) ? this.T(t2) : this._(t2);
  }
  k(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  $(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.k(t2));
  }
  _(t2) {
    this._$AH !== T && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.$(r.createTextNode(t2)), this._$AH = t2;
  }
  g(t2) {
    var _a3;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = V.createElement(C(s2.h, s2.h[0]), this.options)), s2);
    if (((_a3 = this._$AH) == null ? void 0 : _a3._$AD) === e2)
      this._$AH.p(i2);
    else {
      const t3 = new S(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.$(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new V(t2)), i2;
  }
  T(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2)
      e2 === i2.length ? i2.push(s2 = new _M(this.k(l()), this.k(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a3;
    for ((_a3 = this._$AP) == null ? void 0 : _a3.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a3;
    void 0 === this._$AM && (this._$Cv = t2, (_a3 = this._$AP) == null ? void 0 : _a3.call(this, t2));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = T;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2)
      t2 = N(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== w, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n2, r2;
      for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++)
        r2 = N(this, e3[s2 + n2], i2, n2), r2 === w && (r2 = this._$AH[n2]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n2]), r2 === T ? t2 = T : t2 !== T && (t2 += (r2 != null ? r2 : "") + h2[n2 + 1]), this._$AH[n2] = r2;
    }
    o2 && !e2 && this.O(t2);
  }
  O(t2) {
    t2 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 != null ? t2 : "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(t2) {
    this.element[this.name] = t2 === T ? void 0 : t2;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== T);
  }
};
var I = class extends R {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    var _a3;
    if ((t2 = (_a3 = N(this, t2, i2, 0)) != null ? _a3 : T) === w)
      return;
    const s2 = this._$AH, e2 = t2 === T && s2 !== T || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== T && (s2 === T || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a3, _b;
    "function" == typeof this._$AH ? this._$AH.call((_b = (_a3 = this.options) == null ? void 0 : _a3.host) != null ? _b : this.element, t2) : this._$AH.handleEvent(t2);
  }
};
var L = class {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    N(this, t2);
  }
};
var Z = t.litHtmlPolyfillSupport;
var _a;
Z == null ? void 0 : Z(V, M), ((_a = t.litHtmlVersions) != null ? _a : t.litHtmlVersions = []).push("3.1.0");
var j = (t2, i2, s2) => {
  var _a3, _b;
  const e2 = (_a3 = s2 == null ? void 0 : s2.renderBefore) != null ? _a3 : i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (_b = s2 == null ? void 0 : s2.renderBefore) != null ? _b : null;
    e2._$litPart$ = h2 = new M(i2.insertBefore(l(), t3), t3, void 0, s2 != null ? s2 : {});
  }
  return h2._$AI(t2), h2;
};

// src/lib/templating.js
var _a2;
var TemplateCompiler = class {
  constructor(template, context) {
    this.template = template || "";
    this.context = context || {};
  }
  compile() {
    const ast = [];
    const parts = this.template.split(/({{#if.*?}}|{{elseif.*?}}|{{else}}|{{\/if}})/).filter(Boolean);
    let currentCondition = null;
    let currentBranch = null;
    for (const part of parts) {
      if (part.startsWith("{{#if")) {
        currentCondition = {
          type: "if",
          branches: [{
            condition: part.match(/{{#if (.*?)}}/)[1],
            content: []
          }]
        };
        currentBranch = currentCondition.branches[0];
        ast.push(currentCondition);
      } else if (part.startsWith("{{elseif")) {
        currentBranch = {
          condition: part.match(/{{elseif (.*?)}}/)[1],
          content: []
        };
        currentCondition.branches.push(currentBranch);
      } else if (part === "{{else}}") {
        currentBranch = { condition: null, content: [] };
        currentCondition.branches.push(currentBranch);
      } else if (part === "{{/if}}") {
        currentCondition = null;
      } else {
        const node = {
          type: "html",
          string: this.transformInterpolations(part)
        };
        if (currentBranch) {
          currentBranch.content.push(node);
        } else {
          ast.push(node);
        }
      }
    }
    return ast;
  }
  render(element) {
    const ast = this.compile();
    const result = this.generateLitTemplate(ast);
    console.log("res", result);
    j(element, result);
  }
  transformInterpolations(htmlString) {
    return htmlString.replace(/{{(.*?)}}/g, (_2, expr) => "${this.context.".concat(expr.trim(), "}"));
  }
  generateLitTemplate(ast) {
    const templateParts = ast.flatMap((node) => {
      if (node.type === "if") {
        return this.processConditionalNode(node);
      } else if (node.type === "html") {
        return this.processHtmlNode(node.string);
      }
      return "";
    }).filter((part) => part);
    console.log(templateParts);
    return x(_a2 || (_a2 = __template(["", ""])), templateParts);
  }
  processConditionalNode(node) {
    for (const branch of node.branches) {
      if (branch.condition === null || this.evaluateCondition(branch.condition)) {
        return this.generateLitTemplate(branch.content);
      }
    }
    return null;
  }
  processHtmlNode(htmlString) {
    const processedString = htmlString.replace(/{{(.*?)}}/g, (_2, expr) => {
      const expressionValue = this.accessContextProperty(expr.trim());
      return expressionValue;
    });
    return x([processedString]);
  }
  evaluateCondition(condition) {
    try {
      const result = this.accessContextProperty(condition);
      return Boolean(result);
    } catch (error) {
      return false;
    }
  }
  accessContextProperty(expression) {
    return expression.split(".").reduce((context, prop) => {
      return context[prop];
    }, this.context);
  }
};

// src/lib/sui-component.js
var SUIComponent = class extends HTMLElement {
  /*******************************
              Lifecycle
  *******************************/
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
  }
  connectedCallback() {
    this.initializeComponent();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this[name] || oldValue !== newValue) {
      this[name] = newValue;
    }
  }
  /*******************************
           Initialization
  *******************************/
  initializeComponent() {
    this.setTemplate(this.templateString);
    this.bindEvents();
    this.initializeSettings();
    if (this.css) {
      this.addCSS(this.css);
    }
    if (this.definition) {
      this.bindAttributes();
    }
    if (this.template) {
      this.setTemplate(this.template);
    }
    if (this.initialize) {
      this.initialize(this.settings);
    }
    this.handleDefaultSlot();
  }
  bindAttributes() {
  }
  handleDefaultSlot() {
    const $defaultSlot = this.$("slot[default]");
    const defaultSlotName = $defaultSlot.attr("name");
    const $defaultContent = this.$$('[slot="'.concat(defaultSlotName, '"]'));
    if ($defaultSlot.length && !$defaultContent.length) {
      const defaultContent = this.textContent;
      this.textContent = "";
      $defaultSlot.html(defaultContent);
    }
  }
  bindEvents() {
    this.addEventListener("initializeSettings", (event) => {
      const userSettings = event.details;
      const defaultSettings = this.defaultSettings || {};
      const settings = extend(defaultSettings, userSettings);
      this.settings = settings;
    });
  }
  initializeSettings(settings) {
    settings = getUISettings(this);
    this.dispatchCustomEvent("initializeSettings", settings);
  }
  /*******************************
            Templating
  *******************************/
  setTemplate(templateString) {
    templateString = '\n  {{#if text}}\n    <span class="text" part="text" class="{{getClassNames}}">\n      <slot name="text" default></slot>\n    </span>\n  {{elseif conditionTwo}}\n    <span class="two">\n  {{elseif conditionThree}}\n    <span class="three">\n  {{else}}\n    <span class="four"></span>\n  {{/if}}\n  {{#if icon}}\n    <slot name="icon"></slot>\n  {{/if}}';
    const compiler = new TemplateCompiler(templateString, this);
    compiler.render(this);
  }
  /*******************************
              Styles
  *******************************/
  addCSS(styleContent) {
    if ("adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype) {
      if (!this.stylesheet) {
        this.stylesheet = new CSSStyleSheet();
        this.stylesheet.replaceSync(styleContent);
      }
      this.shadowRoot.adoptedStyleSheets = [this.stylesheet];
    } else {
      const style = document.createElement("style");
      style.textContent = styleContent;
      this.shadowRoot.appendChild(style);
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
  /*******************************
              Utils
  *******************************/
  dispatchCustomEvent(eventName, detail = {}, eventData = {}) {
    return this.dispatchEvent(new CustomEvent(eventName, __spreadValues({
      bubbles: true,
      composed: true,
      detail
    }, eventData)));
  }
  getAllowedAttributes(definition) {
    return getAllowedAttributes(definition);
  }
};

// src/button/definition/definition.json
var definition_default = {
  uiType: "element",
  name: "Button",
  description: "A button indicates possible user action",
  tagName: "button",
  types: [
    {
      name: "Emphasis",
      attribute: "emphasis",
      description: "A button can be formatted to show different levels of emphasis",
      adoptionLevel: 1,
      options: [
        {
          name: "Primary",
          value: "primary",
          description: "This button should appear to be emphasized as the first action that should be taken over other options."
        },
        {
          name: "Secondary",
          value: "secondary",
          description: "This button should appear to be emphasized as a secondary option that should appear after other options"
        }
      ]
    },
    {
      name: "Icon",
      attribute: "icon",
      description: "A button can appear with an icon",
      adoptionLevel: 2,
      looseCoupling: true,
      couplesWith: [
        "icon"
      ],
      distinctHTML: true
    },
    {
      name: "Labeled",
      attribute: "labeled",
      description: "A button can appear specially formatted to attach to a label element",
      adoptionLevel: 3,
      looseCoupling: true,
      couplesWith: [
        "label"
      ],
      options: [
        {
          name: "Labeled",
          value: [
            "labeled",
            "right-labeled"
          ],
          description: "A button can be formatted so that a label appears to the right"
        },
        {
          name: "Left Labeled",
          value: "left-labeled",
          description: "A button can be formatted so that a label appears to the left"
        }
      ],
      distinctHTML: true
    },
    {
      name: "Labeled Icon",
      description: "A button can be formatted so that the icon appears separately.",
      looseCoupling: true,
      adoptionLevel: 3,
      options: [
        {
          name: "Labeled",
          value: "labeled",
          description: "A button can be formatted so that the icon appears to the right"
        },
        {
          name: "Left Labeled",
          value: "left-labeled",
          description: "A button can be formatted so that the icon appears to the left"
        }
      ],
      distinctHTML: true
    },
    {
      name: "Animated",
      description: "A button can animate to show hidden content",
      adoptionLevel: 5,
      options: [
        {
          name: "Animated",
          value: "animated",
          description: "A button can be formatted to animate hidden content horizontally"
        },
        {
          name: "Vertical Animated",
          value: "vertical-animated",
          description: "A button can be formatted to animate hidden content vertically"
        },
        {
          name: "Fade Animated",
          value: "vertical-animated",
          description: "A button can be formatted to fade in hidden content"
        }
      ],
      distinctHTML: true
    }
  ],
  states: [
    {
      name: "Active",
      attribute: "active",
      description: "A button can show it is currently the active user selection"
    },
    {
      name: "Disabled",
      attribute: "disabled",
      description: "A button can show it is currently unable to be interacted with"
    },
    {
      name: "Loading",
      attribute: "loading",
      description: "A button can show a loading indicator"
    }
  ],
  variations: [
    {
      name: "Styling",
      value: "styling",
      description: "A button can be formatted to appear de-emphasized over other elements in the page.",
      options: [
        {
          name: "Basic",
          value: "basic",
          description: "A button can appear slightly less pronounced."
        },
        {
          name: "Very Basic",
          value: "very-basic",
          description: "A button can appear to be much less pronounced."
        }
      ]
    },
    {
      name: "Size",
      value: "size",
      description: "A button can vary in size",
      options: [
        {
          name: "Mini",
          value: "mini",
          description: "An element can appear extremely small"
        },
        {
          name: "Tiny",
          value: "tiny",
          description: "An element can appear very small"
        },
        {
          name: "Small",
          value: "small",
          description: "An element can appear small"
        },
        {
          name: "Medium",
          value: "medium",
          description: "An element can appear normal sized"
        },
        {
          name: "Large",
          value: "large",
          description: "An element can appear larger than normal"
        },
        {
          name: "Big",
          value: "big",
          description: "An element can appear much larger than normal"
        },
        {
          name: "Huge",
          value: "huge",
          description: "An element can appear very much larger than normal"
        },
        {
          name: "Massive",
          value: "massive",
          description: "An element can appear extremely larger than normal"
        }
      ]
    },
    {
      name: "Inverted",
      description: "A button can be formatted to appear on dark backgrounds.",
      attribute: "inverted"
    }
  ],
  supportsPlural: true,
  pluralName: "Buttons",
  pluralTagName: "buttons",
  pluralDescription: "Buttons can exist together as a group"
};

// src/button/button.js
var UIButton = class extends SUIComponent {
  constructor() {
    super(...arguments);
    __publicField(this, "defaultSettings", {
      one: "two"
    });
    __publicField(this, "definition", definition_default);
    __publicField(this, "template", button_default2);
    __publicField(this, "css", button_default);
  }
  static get observedAttributes() {
    return getAllowedAttributes(definition_default);
  }
  initialize(settings) {
  }
  render() {
  }
};
customElements.define("ui-button", UIButton);
export {
  UIButton
};
/*! Bundled license information:

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=semantic-ui.js.map
