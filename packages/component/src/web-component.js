import { LitElement } from 'lit';
import { each, isFunction, isNumber, isString, isPlainObject, isBoolean, isArray, isEqual } from '@semantic-ui/utils';
import { $ } from '@semantic-ui/query';

import { scopeStyles } from './styles';

/*
  This extends the base Lit element class
  to handle rendering slots to light dom
  as well as applying scoped styles to light DOM
  and several useful helpers for querying DOM
*/

class WebComponentBase extends LitElement {
  // for use with light dom rendering
  static scopedStyleSheet = null;

  constructor() {
    super();
    this.useLight = false;
    this.renderCallbacks = [];
  }

  createRenderRoot() {
    this.useLight = this.getAttribute('expose') !== null;
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

  firstUpdated() {
    super.firstUpdated();
  }

  updated() {
    super.updated();
    if (this.useLight) {
      this.slotContent();
    }
    each(this.renderCallbacks, (callback) => callback());
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  /*******************************
         Settings / Attrs
  *******************************/

  setDefaultSettings(settings) {
    this.settings = settings;
    each(settings, (setting, name) => {
      if (setting?.default) {
        this.settings[name] = setting.default;
      }
      else {
        this.settings[name] = setting;
      }
    });
  }

  static getProperties(settings = {}) {
    const properties = {};
    each(settings, (setting, name) => {
      // expert mode
      if (setting?.type) {
        properties[name] = settings;
      }
      else {
        properties[name] = WebComponentBase.mapSettingToProperty(setting);
      }
    });
    return properties;
  }

  static mapSettingToProperty(setting) {
    let property;
    if (isString(setting)) {
      property = {
        type: String,
      };
    }
    else if (isNumber(setting)) {
      property = {
        type: Number,
      };
    }
    else if (isBoolean(setting)) {
      property = {
        type: Boolean,
      };
    }
    else if (isArray(setting)) {
      property = {
        type: Array,
        attribute: false,
        reflect: false,
      };
    }
    else if (isPlainObject(setting)) {
      property = {
        type: Object,
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
