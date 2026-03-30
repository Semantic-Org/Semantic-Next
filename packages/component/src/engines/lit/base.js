import { $ } from '@semantic-ui/query';
import {
  camelToKebab,
  each,
  isFunction,
  isServer,
} from '@semantic-ui/utils';
import { LitElement, noChange } from 'lit';

import { adjustPropertyFromAttribute } from '../../helpers/adjust-property-from-attribute.js';
import {
  createSettingsProxy,
  getProperties,
  getPropertySettings,
  getSettingsFromConfig,
  getUIClasses,
  isDarkMode,
  setDefaultSettings,
} from '../../component-helpers.js';

/*
  Lit-backed web component base class.
  Reads component-specific config from static `config`, same contract
  as WebComponentBase. Lit-specific lifecycle (willUpdate, render
  returning TemplateResult) lives here.
*/

class LitWebComponentBase extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: false };

  static hydrationReady = false;

  constructor() {
    super();
    this.renderCallbacks = [];
    this.ensureHydration();

    const { css, componentSpec, defaultSettings, resolvedProperties } = this.constructor.config || {};
    this.css = css;
    this.componentSpec = componentSpec;
    if (resolvedProperties) {
      this.settings = this.createSettingsProxy();
    }
    if (defaultSettings) {
      this.setDefaultSettings({ defaultSettings, componentSpec });
    }
    else {
      this.defaultSettings = {};
    }
  }

  ensureHydration() {
    if (!LitWebComponentBase.hydrationReady) {
      LitWebComponentBase.hydrationReady = true;
      if (globalThis.litElementHydrateSupport
        && !Object.getOwnPropertyDescriptor(LitElement, 'observedAttributes')) {
        globalThis.litElementHydrateSupport({ LitElement });
      }
    }
  }

  /*******************************
        Lit Lifecycle
  *******************************/

  connectedCallback() {
    super.connectedCallback();
  }

  willUpdate() {
    if (isServer) {
      this.triggerAttributeChange();
    }
    if (!this.template) {
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
    }
    super.willUpdate();
  }

  updated() {
    super.updated();
    each(this.renderCallbacks, (callback) => callback());
  }

  render() {
    const { renderingEngine } = this.constructor.config || {};
    const data = {
      ...this.getData(),
      ...this.tpl,
    };
    if (renderingEngine === 'native' && this.nativeRendered) {
      this.template.render(data);
      return noChange;
    }
    const html = this.template.render(data);
    if (renderingEngine === 'native') {
      this.nativeRendered = true;
    }
    return html;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.template) {
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
    this.constructor.template?.onDestroyed();
  }

  /*******************************
      Settings / Template Data
  *******************************/

  getSettings() {
    const { componentSpec, resolvedProperties } = this.constructor.config || {};
    return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
  }

  setSetting(name, value) {
    this[name] = value;
  }

  getData() {
    const { componentSpec, resolvedProperties, plural } = this.constructor.config || {};
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

  attributeChangedCallback(attribute, oldValue, newValue) {
    super.attributeChangedCallback(attribute, oldValue, newValue);
    const { resolvedProperties, componentSpec, onAttributeChanged } = this.constructor.config || {};
    if (!resolvedProperties) {
      return;
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

  triggerAttributeChange() {
    const { resolvedProperties, componentSpec } = this.constructor.config || {};
    if (!resolvedProperties) {
      return;
    }
    each(resolvedProperties, (propSettings, property) => {
      const attribute = camelToKebab(property);
      let newValue = this[property];
      if (!propSettings.alias && attribute && newValue === true) {
        this.setAttribute(attribute, '');
      }
      adjustPropertyFromAttribute({
        el: this,
        attribute,
        properties: resolvedProperties,
        attributeValue: newValue,
        componentSpec,
      });
    });
  }

  /*******************************
      Property Configuration
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

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  setDefaultSettings(options) {
    setDefaultSettings(this, options);
  }

  getSettingsFromConfig(options) {
    return getSettingsFromConfig(this, options);
  }

  createSettingsProxy() {
    return createSettingsProxy(this);
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

  $(selector, { root = this?.renderRoot || this.shadowRoot } = {}) {
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

export { LitWebComponentBase };
export { LitWebComponentBase as WebComponentBase };
