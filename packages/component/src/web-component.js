import { LitElement } from 'lit';
import { each, isFunction, isNumber, isString, isPlainObject, keys, isBoolean, isArray, flatten } from '@semantic-ui/utils';
import { $ } from '@semantic-ui/query';

import { scopeStyles } from './helpers/scope-styles.js';

/*
  This extends the base Lit element class
  to handle rendering slots to light dom
  as well as applying scoped styles to light DOM
  and several useful helpers for querying DOM
*/

class WebComponentBase extends LitElement {

  // for use with light dom rendering
  static scopedStyleSheet = null;

  // for use with variable hoisting
  static nestedStylesheet = null;

  constructor() {
    super();
    this.useLight = false;
    this.renderCallbacks = [];
  }

  createRenderRoot() {
    this.useLight = this.getAttribute('expose') !== null;
    if (this.useLight) {
      this.addLightScopedCSS(this.tagName, this.css);
      this.storeOriginalContent.apply(this);
      return this;
    }
    else {
      const renderRoot = super.createRenderRoot(this.css);
      return renderRoot;
    }
  }

  updated() {
    super.updated();
    if (this.useLight) {
      this.slotLightContent();
    }
    each(this.renderCallbacks, (callback) => callback());
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  /*******************************
         Light DOM Rendering
  *******************************/

  /* Modifies shadow dom rules to be scoped to component tag */
  addLightScopedCSS(scopeSelector, css) {
    if (!this.scopedStyleSheet) {
      const scopedCSS = scopeStyles(css, scopeSelector);
      this.scopedStyleSheet = new CSSStyleSheet();
      this.scopedStyleSheet.replaceSync(scopedCSS);
    }
    // we add a new stylesheet to document scoped to component name
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

  slotLightContent() {
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
        // default slot takes all DOM content that is not slotted
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

  /*******************************
         Settings / Attrs
  *******************************/

  setDefaultSettings(settings = {}) {
    this.defaultSettings = settings;
    each(settings, (setting, name) => {
      if (setting?.default !== undefined) {
        this.defaultSettings[name] = setting.default;
      }
      else {
        this.defaultSettings[name] = setting;
      }
    });
  }

  static getProperties({ properties = {}, settings, componentSpec }) {
    if (keys(properties).length) {
      return properties;
    }
    if (componentSpec) {
      properties.class = {
        type: String,
      };
      each(componentSpec.settings, (valueArrays, setting) => {
        properties[setting] = WebComponentBase.mapSettingToProperty(setting);
      });
      each(componentSpec.reverseSettings, (valueArray, reverseSetting) => {
        properties[reverseSetting] = { type: String, reflect: false };
      });
    }
    if (settings) {
      each(settings, (setting, name) => {
        // expert mode
        if (setting?.type) {
          properties[name] = settings;
        }
        else {
          properties[name] = WebComponentBase.mapSettingToProperty(setting);
        }
      });
    }
    return properties;
  }

  static mapSettingToProperty(setting) {
    let property;
    if (isString(setting)) {
      property = {
        type: String,
        attribute: true,
      };
    }
    else if (isNumber(setting)) {
      property = {
        type: Number,
        attribute: true,
      };
    }
    else if (isBoolean(setting)) {
      property = {
        type: Boolean,
        attribute: true,
      };
    }
    else if (isArray(setting)) {
      property = {
        type: Array,
        attribute: true,
        reflect: false,
      };
    }
    else if (isPlainObject(setting)) {
      property = {
        type: Object,
        attribute: true,
        reflect: false,
      };
    }
    else if (isFunction(setting)) {
      property = {
        type: Function,
        attribute: false,
        reflect: false,
      };
    }
    else {
      property = {
        type: String,
        attribute: true,
      };
    }
    //property.hasChanged = isEqual;
    return property;
  }

  /*******************************
           DOM Helpers
  *******************************/

  // Rendered DOM (either shadow or regular)
  $(selector, root = this?.renderRoot) {
    if (!this.renderRoot) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, this?.renderRoot);
  }

  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $(selector, this.originalDOM.content);
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
}

export { WebComponentBase };
