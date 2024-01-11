import { LitElement, unsafeCSS } from 'lit';
import { isFunction, isObject, extend } from './utils';
import { $ } from './query';

class UIComponent extends LitElement {

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
    return $(selector, this?.shadowRoot);
  }

  // DOM
  $$(selector) {
    return $(selector, this);
  }

}

export { UIComponent };
