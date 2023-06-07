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
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/lib/query.js
  var Query = class {
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
      return new Query(selector, elements);
    }
    parent() {
      const parents = Array.from(this).map((el) => el.parentElement).filter(Boolean);
      return new Query(null, parents);
    }
    closest(selector) {
      const closest = Array.from(this).map((el) => {
        let parent = el.parentElement;
        while (parent && !parent.matches(selector)) {
          parent = parent.parentElement;
        }
        return parent;
      }).filter(Boolean);
      return new Query(null, closest);
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
      console.log(`The attribute ${name} changed from ${oldValue} to ${newValue}`);
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
      const $defaultContent = this.$$(`[slot="${defaultSlotName}"]`);
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

  // src/button/button-definition.js
  var ButtonDefinition = {
    /*******************************
               Definition
    *******************************/
    uiType: "element",
    name: "Button",
    description: "A button indicates possible user action",
    tagName: "button",
    /*******************************
               Singular
    *******************************/
    /*-------------------
            Types
    --------------------*/
    types: [
      {
        name: "Emphasis",
        description: "A button can be formatted to show different levels of emphasis",
        adoptionLevel: 1,
        options: [
          {
            name: "Primary",
            attribute: "primary",
            description: "This button should appear to be emphasized as the first action that should be taken over other options."
          },
          {
            name: "Secondary",
            attribute: "secondary",
            description: "This button should appear to be emphasized as a secondary option that should appear after other options"
          }
        ]
      },
      {
        name: "Icon Only",
        description: "A button can appear with only an icon",
        adoptionLevel: 2,
        looseCoupling: true,
        couplesWith: ["icon"],
        options: [
          {
            name: "Icon Only",
            attribute: "icon"
          }
        ],
        distinctHTML: true
      },
      {
        name: "Labeled",
        description: "A button can appear specially formatted to attach to a label element",
        adoptionLevel: 3,
        looseCoupling: true,
        couplesWith: ["label"],
        options: [
          {
            name: "Labeled",
            attribute: "labeled",
            description: "A button can be formatted so that a label appears to the right"
          },
          {
            name: "Left Labeled",
            attribute: "left-labeled",
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
            attribute: "labeled",
            description: "A button can be formatted so that the icon appears to the right"
          },
          {
            name: "Left Labeled",
            attribute: "left-labeled",
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
            attribute: "animated",
            description: "A button can be formatted to animate hidden content horizontally"
          },
          {
            name: "Vertical Animated",
            attribute: "vertical-animated",
            description: "A button can be formatted to animate hidden content vertically"
          },
          {
            name: "Fade Animated",
            attribute: "vertical-animated",
            description: "A button can be formatted to fade in hidden content"
          }
        ],
        distinctHTML: true
      }
    ],
    /*-------------------
           States
    --------------------*/
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
    /*-------------------
          Variations
    --------------------*/
    variations: [
      {
        name: "Basic",
        description: "A button can be formatted to appear deemphasized over other elements in the page.",
        options: [
          {
            name: "Basic",
            attribute: "basic",
            description: "A button can appear slightly less pronounced."
          },
          {
            name: "Very Basic",
            attribute: "very-basic",
            description: "A button can appear to be much less pronounced."
          }
        ]
      },
      {
        name: "Inverted",
        description: "A button can be formatted to appear on dark backgrounds.",
        options: [
          {
            name: "Inverted",
            attribute: "inverted"
          }
        ]
      }
    ],
    /*******************************
                Plural
    *******************************/
    supportsPlural: true,
    pluralName: "Buttons",
    pluralTagName: "buttons",
    pluralDescription: "Buttons can exist together as a group"
  };

  // src/button/button.html
  var button_default = '<div class="button">\n  <slot name="text" default></slot>\n</div>\n';

  // src/button/button.css
  var button_default2 = ".button {\n  cursor: pointer;\n  display: inline-block;\n\n  min-height: 1em;\n  font-size: var(--medium);\n\n  outline: none;\n  border: none;\n  vertical-align: var(--vertical-align);\n  background: var(--background);\n  color: var(--text-color);\n\n  font-family: var(--font-family);\n\n  margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n  padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n\n  text-transform: var(--text-transform);\n  text-shadow: var(--text-shadow);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  font-style: normal;\n  text-align: center;\n  text-decoration: none;\n\n  border-radius: var(--border-radius);\n  box-shadow: var(--box-shadow);\n\n  user-select: none;\n  transition: var(--transition);\n  will-change: var(--will-change);\n\n  -webkit-tap-highlight-color: var(--tap-color);\n\n  outline: none;\n}\n";

  // src/button.js
  var UIButton = class extends SUIComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "defaultSettings", {
        one: "two"
      });
      __publicField(this, "definition", ButtonDefinition);
      __publicField(this, "template", button_default);
      __publicField(this, "css", button_default2);
    }
    static get observedAttributes() {
      return getAttributesFromUIDefinition(ButtonDefinition);
    }
    initialize(settings) {
    }
  };
  customElements.define("ui-button", UIButton);
})();
//# sourceMappingURL=semantic-ui.js.map
