(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

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
  var keys = function(obj) {
    return Object.keys(obj);
  };
  var unique = function(arr) {
    return Array.from(new Set(arr));
  };
  var removeUndefined = function(arr) {
    return arr.filter((val) => val);
  };
  var each = function(obj, func, context) {
    if (obj === null) {
      return obj;
    }
    let createCallback = function(context2, func2) {
      if (context2 === void 0) {
        return func2;
      } else {
        return function(value, index, collection) {
          return func2.call(context2, value, index, collection);
        };
      }
    };
    let iteratee = createCallback(context, func);
    let i;
    if (obj.length === +obj.length) {
      for (i = 0; i < obj.length; ++i) {
        iteratee(obj[i], i, obj);
      }
    } else {
      let objKeys = keys(obj);
      for (i = 0; i < objKeys.length; ++i) {
        iteratee(obj[objKeys[i]], objKeys[i], obj);
      }
    }
    return obj;
  };
  var isString = function(str) {
    return typeof str == "string";
  };
  var isFunction = function(obj) {
    return typeof obj == "function" || false;
  };
  var wrapFunction = function(x) {
    return isFunction(x) ? x : () => x;
  };
  var extend = function(obj, ...sources) {
    sources.forEach(function(source) {
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

  // src/lib/sui-helpers.js
  var getAttributesFromUIDefinition = (definition) => {
    let attributes = [];
    let getAttributes = function(type) {
      let options = type.options || [type];
      each(options, (option) => {
        if (option.attribute) {
          attributes.push(option.attribute);
        }
      });
    };
    each(definition.types, getAttributes);
    each(definition.variations, getAttributes);
    each(definition.states, getAttributes);
    attributes = unique(attributes);
    attributes = removeUndefined(attributes);
    return attributes;
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
      console.log("The attribute ".concat(name, " changed from ").concat(oldValue, " to ").concat(newValue));
    }
    /*******************************
             Initialization
    *******************************/
    initializeComponent() {
      this.setTemplate(this.templateString);
      this.bindEvents();
      this.initializeSettings();
      if (this.template) {
        this.setTemplate(this.template);
      }
      if (this.css) {
        this.addCSS(this.css);
      }
      if (this.definition) {
        this.bindAttributes();
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
      if (!settings) {
        settings = this.getAttribute("settings") || {};
      }
      if (isString(settings)) {
        wrapFunction(window[settings])();
      }
      this.dispatchCustomEvent("initializeSettings", settings);
    }
    /*******************************
              Templating
    *******************************/
    setTemplate(templateString) {
      this.shadowRoot.innerHTML = templateString;
    }
    /*******************************
                Styles
    *******************************/
    addCSS(styleContent) {
      const style = document.createElement("style");
      style.textContent = styleContent;
      this.shadowRoot.appendChild(style);
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
    getAttributesFromUIDefinition(definition) {
      return getAttributesFromUIDefinition(definition);
    }
  };
})();
