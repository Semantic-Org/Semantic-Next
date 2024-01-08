import { LitElement, unsafeCSS } from 'lit';
import { isFunction, wrapFunction, isArray } from './utils';

class UIComponent extends LitElement {

  /*******************************
              Lifecycle
  *******************************/

  // callback when initialized
  constructor() {
    super();
    // easier to understand
    if(isFunction(this.on?.created)) {
      this.on?.created();
    }
  }

  // callback when added to dom
  connectedCallback() {
    super.connectedCallback();
    if(isFunction(this.on?.rendered)) {
      this.on?.rendered();
    }
  }

  // callback if removed from dom
  disconnectedCallback() {
    if(isFunction(this.on?.destroyed)) {
      this.on?.created();
    }
  }

  // callback if moves doc
  adoptedCallback() {
    if(isFunction(this.on?.moved)) {
      this.on?.moved();
    }
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    console.log('attribute change: ', name, newVal);
    if(isFunction(this.on?.settingChanged)) {
      this.on?.settingChanged.call(this, {
        attribute, oldValue, newValue
      });
    }
  }

  /*
    SUI lets you specify if you want to use light dom via attribute
  */
  createRenderRoot() {
    const useLight = false;
    if(useLight) {
      return this;
    }
    else {
      const renderRoot = super.createRenderRoot();
      return renderRoot;
    }
  }

  /*******************************
              CSS
  *******************************/

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
    // Query is a simply $ jQuery like wrapper for
    // chaining utility functions on DOM nodes
    return $(selector, this.shadowRoot);
  }

  // DOM
  $$(selector) {
    return $(selector, this);
  }

}

export { UIComponent };
