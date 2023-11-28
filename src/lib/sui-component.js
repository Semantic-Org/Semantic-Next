import { $ } from './query';
import { extend, isString, wrapFunction } from './utils';
import { getUISettings, getAllowedAttributes } from './sui-helpers';

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

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`The attribute ${name} changed from ${oldValue} to ${newValue}`);
    // Perform any actions needed when the attribute changes
  }

  /*******************************
           Initialization
  *******************************/

  initializeComponent() {
    this.setTemplate(this.templateString);

    this.bindEvents();
    this.initializeSettings();

    // handle rendering the Shadow DOM for the component
    if(this.template) {
      this.setTemplate(this.template);
    }

    // inject CSS for component
    if(this.css) {
      this.addCSS(this.css);
    }

    // update props when attributes update
    if(this.definition) {
      this.bindAttributes();
    }

    // allow each component to specify its own initialize
    if (this.initialize) {
      this.initialize(this.settings);
    }

    // populate default slot with content
    this.handleDefaultSlot();
  }

  bindAttributes() {

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
    settings = getUISettings(this);
    this.dispatchCustomEvent('initializeSettings', settings);
  }

  /*******************************
            Templating
  *******************************/

  setTemplate(templateString) {
    /*
      Not fully implemented eventually will handle if/else
    */
    this.shadowRoot.innerHTML = templateString;
  }

  /*******************************
              Styles
  *******************************/
  addCSS(styleContent) {
    if('adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype) {
      if(!this.stylesheet) {
        this.stylesheet = new CSSStyleSheet();
        this.stylesheet.replaceSync(styleContent);
      }
      this.shadowRoot.adoptedStyleSheets = [this.stylesheet];
    }
    else {
      const style = document.createElement('style');
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

  getAllowedAttributes(definition) {
    return getAllowedAttributes(definition);
  }

}

export * from './sui-helpers';
export { SUIComponent };
