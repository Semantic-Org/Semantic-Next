import { $ } from '@semantic-ui/query';
import {
  isFunction,
} from '@semantic-ui/utils';

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
*/

class WebComponentBase extends HTMLElement {

  constructor() {
    super();
    this.renderCallbacks = [];
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
    // Destroy prototype
    this.constructor.template?.onDestroyed();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    // Type conversion handled by property accessors set up in defineComponent.
    // Subclass overrides this to call adjustPropertyFromAttribute + onAttributeChanged.
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
           Properties
  *******************************/

  static getProperties(options) {
    return getProperties(options);
  }

  static getPropertySettings(options) {
    return getPropertySettings(options);
  }

  /*******************************
      Settings / Template Data
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
