import { $ } from '@semantic-ui/query';
import {
  isFunction,
  isServer,
  kebabToCamel,
} from '@semantic-ui/utils';

import { adjustPropertyFromAttribute } from './helpers/adjust-property-from-attribute.js';
import {
  createSettingsProxy,
  getProperties,
  getPropertySettings,
  getSettingsFromConfig,
  getUIClasses,
  isDarkMode,
  setDefaultSettings,
} from './component-helpers.js';

/*
  Standard web component base class — extends HTMLElement directly.
  No framework dependencies. Shared logic lives in component-helpers.js.

  Component-specific config is stored as static _config on the generated
  subclass by the factory in create-component.js. Methods here read from
  _config so factories don't need to define inline methods.
*/

class WebComponentBase extends HTMLElement {

  constructor() {
    super();
    this.renderCallbacks = [];

    const { css, componentSpec, defaultSettings, resolvedProperties } = this.constructor._config || {};
    this.css = css;
    this.componentSpec = componentSpec;
    if (resolvedProperties) {
      this.settings = this.createSettingsProxy({ componentSpec, properties: resolvedProperties });
    }
    if (defaultSettings) {
      this.setDefaultSettings({ defaultSettings, componentSpec });
    }
    else {
      this.defaultSettings = {};
    }
    this.updateComplete = new Promise(r => { this._resolveUpdate = r; });
  }

  connectedCallback() {
    if (this.template) {
      return;
    }

    if (!this.shadowRoot) {
      this.attachShadow({
        mode: 'open',
        delegatesFocus: this.constructor._delegatesFocus || false,
      });
    }
    this.renderRoot = this.shadowRoot;

    // Adopt styles
    if (this.css) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(this.css);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // Clone prototype template, initialize, render once
    const prototypeTemplate = this.constructor.template;
    this.template = prototypeTemplate.clone({
      data: this.getData(),
      element: this,
      renderRoot: this.renderRoot,
    });
    if (!this.template.initialized) {
      this.template.initialize();
    }
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();

    const fragment = this.template.render(this.getData());
    this.shadowRoot.append(fragment);

    this._resolveUpdate?.();
  }

  disconnectedCallback() {
    if (this.template) {
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
    this.constructor.template?.onDestroyed();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    const { resolvedProperties, componentSpec, onAttributeChanged } = this.constructor._config || {};
    if (!resolvedProperties) {
      return;
    }

    const propName = kebabToCamel(attribute);
    const config = resolvedProperties[propName];
    if (config?.converter?.fromAttribute) {
      newValue = config.converter.fromAttribute(newValue, config.type);
    }
    if (config && !config.noAccessor) {
      this[propName] = newValue;
    }

    adjustPropertyFromAttribute({
      el: this,
      attribute,
      attributeValue: newValue,
      properties: resolvedProperties,
      oldValue,
      componentSpec,
    });
    if (onAttributeChanged) {
      this.call(onAttributeChanged, { args: [attribute, oldValue, newValue] });
    }
  }

  requestUpdate() {
    if (this._updateScheduled) {
      return;
    }
    this._updateScheduled = true;
    this.updateComplete = new Promise(r => { this._resolveUpdate = r; });
    queueMicrotask(() => {
      this._updateScheduled = false;
      if (this.template) {
        this.template.render(this.getData());
      }
      this._resolveUpdate?.();
    });
  }

  /*******************************
      Settings / Template Data
  *******************************/

  getSettings() {
    const { componentSpec, resolvedProperties } = this.constructor._config || {};
    return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
  }

  setSetting(name, value) {
    this[name] = value;
  }

  getData() {
    const { componentSpec, resolvedProperties, plural } = this.constructor._config || {};
    let data = {
      ...this.getSettings(),
    };
    if (!isServer) {
      data.darkMode = this.isDarkMode();
    }
    if (componentSpec) {
      data.ui = this.getUIClasses({ componentSpec, properties: resolvedProperties });
    }
    if (plural) {
      data.plural = true;
    }
    return data;
  }

  /*******************************
           Static Helpers
  *******************************/

  static getProperties(options) {
    return getProperties(options);
  }

  static getPropertySettings(options) {
    return getPropertySettings(options);
  }

  /*******************************
      Instance Helpers
  *******************************/

  setDefaultSettings(options) {
    setDefaultSettings(this, options);
  }

  getSettingsFromConfig(options) {
    return getSettingsFromConfig(this, options);
  }

  createSettingsProxy(options) {
    return createSettingsProxy(this, options);
  }

  getUIClasses(options) {
    return getUIClasses(this, options);
  }

  isDarkMode() {
    return isDarkMode(this);
  }

  /*******************************
            DOM Helpers
  *******************************/

  $(selector, { root = this.renderRoot || this.shadowRoot } = {}) {
    if (!root) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, { root });
  }

  $$(selector) {
    return $(selector, { root: this.originalDOM.content });
  }

  call(
    func,
    { firstArg, additionalArgs, args = [this.component, this.$.bind(this)] } = {},
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
