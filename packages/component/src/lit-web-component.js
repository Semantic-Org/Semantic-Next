import { $ } from '@semantic-ui/query';
import {
  each,
  isFunction,
} from '@semantic-ui/utils';
import { LitElement } from 'lit';

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
  Lit-backed web component base class.
  Used when renderingEngine is 'lit' (the default for backwards compatibility).
  Shared logic lives in component-helpers.js.
*/

class LitWebComponentBase extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: false };

  static hydrationReady = false;

  constructor() {
    super();
    this.renderCallbacks = [];
    this.ensureHydration();
  }

  // Lit checks for hydration support at module evaluation time, but module
  // load order isn't guaranteed in production builds. Re-apply the patches
  // here to catch cases where lit-element evaluated first.
  ensureHydration() {
    if (!LitWebComponentBase.hydrationReady) {
      LitWebComponentBase.hydrationReady = true;
      if (globalThis.litElementHydrateSupport
        && !Object.getOwnPropertyDescriptor(LitElement, 'observedAttributes')) {
        globalThis.litElementHydrateSupport({ LitElement });
      }
    }
  }

  updated() {
    super.updated();
    each(this.renderCallbacks, (callback) => callback());
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  /*******************************
           Lit Properties
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

  // Rendered DOM (either shadow or regular)
  $(selector, { root = this?.renderRoot || this.shadowRoot } = {}) {
    if (!root) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, { root });
  }

  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $(selector, { root: this.originalDOM.content });
  }

  // calls callback if defined with consistent params and this context
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

// Re-export as WebComponentBase for backwards compatibility
export { LitWebComponentBase as WebComponentBase };
