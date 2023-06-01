import { $ } from './query.js';

import {
  extend,
  isString,
  wrapFunction
} from './utils.js';

class SUIComponent extends HTMLElement {

  /*******************************
              Lifecycle
  *******************************/

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
  }

  connectedCallback() {
    this.initializeComponent();
  }

  /*******************************
           Initialization
  *******************************/

  initializeComponent() {
    this.setTemplate(this.templateString);

    this.bindEvents();
    this.initializeSettings();

    if(this.template) {
      this.setTemplate(this.template);
    }

    if(this.css) {
      this.addCSS(this.css);
    }

    // allow each component to specify its own initialize
    if (this.initialize) {
      this.initialize(this.settings);
    }

    // we allow a slot to be specified as default so it
    // can default to the text node for a simpler use case
    this.handleDefaultSlot();
  }

  handleDefaultSlot() {
    const $defaultSlot = this.$('slot[default]');
    const defaultSlotName = $defaultSlot.attr('name');
    const $defaultContent = this.$$(`[slot="${defaultSlotName}"]`);
    if($defaultSlot.length && !$defaultContent.length) {
      const defaultContent = this.textContent;
      this.textContent = '';
      $defaultSlot.html(defaultContent);
    }
  }

  bindEvents() {
    this.addEventListener('initializeSettings', (event) => {
      const userSettings = event.details;
      const defaultSettings = this.defaultSettings || {};
      const settings = extend(defaultSettings, userSettings);
      this.settings = settings;
    });
  }

  initializeSettings(settings) {
    if(!settings) {
      settings = this.getAttribute('settings') || {};
    }
    // user specified a global function
    if(isString(settings)) {
      wrapFunction(window[settings])();
    }
    this.dispatchCustomEvent('initializeSettings', settings);
  }

  /*******************************
            Templating
  *******************************/

  setTemplate(templateString) {
    /*
      Not fully implemented eventually will handle
    */
    this.shadowRoot.innerHTML = templateString;
  }

  /*******************************
              Styles
  *******************************/

  addCSS(styleContent) {
    const style = document.createElement('style');
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
    // Query is a simply $ jQuery like wrapper for
    // chaining utility functions on DOM nodes
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
    return this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail,
      ...eventData
    }));
  }

}

export { SUIComponent };
