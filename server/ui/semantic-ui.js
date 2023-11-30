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

// src/button/button.css
var button_default = '/* src/button/css/content/button.css */\n.button {\n  cursor: pointer;\n  display: inline-block;\n  min-height: 1em;\n  font-size: var(--medium);\n  outline: none;\n  border: none;\n  vertical-align: var(--vertical-align);\n  background: var(--background);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n  padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n  text-transform: var(--text-transform);\n  text-shadow: var(--text-shadow);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  font-style: normal;\n  text-align: center;\n  text-decoration: none;\n  border-radius: var(--border-radius);\n  box-shadow: var(--box-shadow);\n  -webkit-user-select: none;\n  -moz-user-select: -moz-none;\n  -ms-user-select: none;\n  user-select: none;\n  transition: var(--transition);\n  will-change: var(--will-change);\n  -webkit-tap-highlight-color: var(--tap-color);\n  outline: none;\n}\n\n/* src/button/css/states/hover.css */\n.button:hover {\n  background-color: var(--hover-background-color);\n  background-image: var(--hover-background-image);\n  box-shadow: var(--hover-box-shadow);\n  color: var(--hover-color);\n}\n.button:hover .icon {\n  opacity: var(--hover-icon-opacity);\n}\n\n/* src/button/css/states/focus.css */\n.button:focus {\n  background-color: var(--focus-background-color);\n  color: var(--focus-color);\n  background-image: var(--focus-background-image) !important;\n  box-shadow: var(--focus-box-shadow) !important;\n}\n.button:focus .icon {\n  opacity: var(--icon-focus-opacity);\n}\n\n/* src/button/css/states/pressed.css */\n.button:active,\n.active.button:active {\n  background-color: var(--pressed-background-color);\n  background-image: var(--pressed-background-image);\n  color: var(--pressed-color);\n  box-shadow: var(--pressed-box-shadow);\n}\n\n/* src/button/css/states/active.css */\n.ui.active.button {\n  background-color: var(--active-background-color);\n  background-image: var(--active-background-image);\n  box-shadow: var(--active-box-shadow);\n  color: var(--active-color);\n}\n.ui.active.button:hover {\n  background-color: var(--active-hover-background-color);\n  background-image: var(--active-hover-background-image);\n  color: var(--active-hover-color);\n  box-shadow: var(--active-hover-box-shadow);\n}\n.ui.active.button:active {\n  background-color: var(--active-down-background-color);\n  background-image: var(--active-down-background-image);\n  color: var(--active-down-color);\n  box-shadow: var(--active-down-box-shadow);\n}\n\n/* src/button/css/states/disabled.css */\n.disabled.button,\n.disabled.button:hover,\n.disabled.active.button {\n  cursor: default;\n  pointer-events: none !important;\n  opacity: var(--disabled-opacity) !important;\n  background-image: var(--disabled-background-image) !important;\n  box-shadow: var(--disabled-background-image) !important;\n}\n\n/* src/button/css/states/loading.css */\n.loading.button {\n  position: relative;\n  cursor: default;\n  text-shadow: none !important;\n  color: transparent !important;\n  opacity: var(--loading-opacity);\n  pointer-events: var(--loading-pointer-events);\n  transition: var(--loading-transition);\n}\n.loading.button:before {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  border-radius: var(--circular-radius);\n  border: var(--loader-line-width) solid var(--inverted-loader-fill-color);\n}\n.loading.button:after {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  animation: button-spin var(--loader-speed-linear);\n  animation-iteration-count: infinite;\n  border-radius: var(--circular-radius);\n  border-color: var(--inverted-loader-line-color) transparent transparent;\n  border-style: solid;\n  border-width: var(--loader-line-width);\n  box-shadow: 0px 0px 0px 1px transparent;\n}\n@keyframes button-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/* src/button/css/button.css */\n';

// src/button/button.html
var button_default2 = '<div class="button" part="button">\n  <span class="text" part="text">\n    <slot name="text" default></slot>\n  </span>\n  <slot name="icon"></slot>\n</div>\n';

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
    settings = getUISettings(this);
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
};
customElements.define("ui-button", UIButton);
export {
  UIButton
};
//# sourceMappingURL=semantic-ui.js.map
