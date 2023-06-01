import { Query } from './query.js';
import { TemplateProcessor } from './template-processor.js'
import {
  ReactiveVar,
  CreateReaction,
  AvoidReaction
} from './reactive.js'

class SUIComponent extends HTMLElement {

  /*******************************
              Lifecycle
  *******************************/

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.reactiveVars = new Map();
    this.reactionsToRun = new Map();
    this.createScopedStyle();
  }

  connectedCallback() {
    this.setTemplate(this.templateString);

    if (this.initialize) {
      this.initialize();
    }

    const settingsFunctionName = this.getAttribute('settings');
    if (window[settingsFunctionName]) {
      this.initialize(window[settingsFunctionName]());
    }

  }

  initialize(settings) {
    const event = new CustomEvent('initializeSettings', {
      detail: settings
    });
    this.shadowRoot.dispatchEvent(event);
  }

  /*******************************
            Templating
  *******************************/

  setTemplate(templateString) {
    this.templateString = templateString;
    const template = new TemplateProcessor(templateString, this)
    const ast = template.parse();
    console.log(ast);
    this.shadowRoot.innerHTML = html;
    //templateProcessor.processBindings(this.shadowRoot, context);
  }

  /*******************************
              Styles
  *******************************/

  createScopedStyle(styleContent) {
    const style = document.createElement('style');
    style.textContent = styleContent;
    this.shadowRoot.appendChild(style);
  }

  /*******************************
         Settings / Attrs
  *******************************/

  initializeSettings() {
    this.addEventListener('initializeSettings', (e) => {
      const defaultSettings = this.defaultSettings || {};
      Object.assign(this.settings, {
        ...defaultSettings,
        ...userSettings
      });
    });
  }

  get defaultSettings() {
    return {};
  }

  setAttributeBindings(attributeBindings) {
    attributeBindings.forEach((binding) => {
      const { attribute, property } = binding;
      this.reactiveVars.get(property).onChange(() => {
        this.setAttribute(attribute, this[property]);
      });
    });
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

  $(selector) {
    const elements = this.queryAllScoped(selector);
    return new Query(elements);
  }

  /*******************************
              Events
  *******************************/

  dispatchCustomEvent(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

}

export { SUIComponent };
