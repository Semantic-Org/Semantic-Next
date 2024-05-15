import { unsafeCSS } from 'lit';
import { each, noop, isServer, kebabToCamel, proxyObject } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { TemplateCompiler, Template } from '@semantic-ui/templating';

import { adoptStylesheet } from './helpers/adopt-stylesheet.js';
import { adjustSettingFromAttribute } from './helpers/adjust-setting-from-attribute.js';
import { WebComponentBase } from './web-component.js';


export const createComponent = ({
  template = '',
  css = false,
  lightCSS = false,
  componentSpec = false,
  tagName,
  delegatesFocus = false,
  templateName = kebabToCamel(tagName),

  plural = false,
  singularTag,

  state = {},
  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onThemeChanged = noop,
  onAttributeChanged = noop,

  properties, // allow overriding properties
  settings, // settings for js functionality like callbacks etc

  subTemplates = {},
  renderingEngine,
  beforeRendered = noop,
} = {}) => {

  // AST shared across instances
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();

  // to support SSR we need to include all subtemplate css in base template
  each(subTemplates, (template) => {
    if (template.css) {
      css += template.css;
    }
  });

  if(lightCSS) {
    adoptStylesheet(lightCSS);
  }

  /*
    Create Component Returns Either a Template or WebComponent
    Templates are created as a prototype that can be cloned when instantiated
  */
  let litTemplate = new Template({
    templateName: templateName,
    isPrototype: true,
    renderingEngine,
    ast,
    css,
    events,
    subTemplates,
    onCreated,
    onRendered,
    onDestroyed,
    onThemeChanged,
    createInstance,
  });
  let webComponent;

  if (tagName) {
    /*
      Web Component Base is the static portion of the web component which
      doesnt change based off component configuration
    */
    webComponent = class UIWebComponent extends WebComponentBase {

      static get styles() {
        return unsafeCSS(css);
      }

      static properties = WebComponentBase.getProperties({
        properties,
        componentSpec,
        settings,
      });

      defaultSettings = {};

      constructor() {
        super();
        this.css = css;
        this.settings = this.createSettingsProxy({componentSpec, properties: webComponent.properties});
        this.state = this.createReactiveState(state);
        this.setDefaultSettings(settings);
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
      }

      createRenderRoot() {
        this.useLight = this.getAttribute('expose') !== null;
        if (this.useLight) {
          this.addLightCSS(webComponent, 'light', this.css, { scopeSelector: this.tagName });
          this.storeOriginalContent.apply(this);
          return this;
        }
        else {
          const renderRoot = super.createRenderRoot(this.css);
          return renderRoot;
        }
      }

      willUpdate() {
        super.willUpdate();
        if(!this.template) {
          this.template = litTemplate.clone({
            data: this.getData(),
            element: this,
            renderRoot: this.renderRoot,
          });
          // just to be safe
          if(!this.template.initialized) {
            this.template.initialize();
          }
          this.tpl = this.template.tpl;
        }
        // property change callbacks wont call on SSR
        if(isServer) {
          each(webComponent.properties, (propSettings, property) => {
            const newValue = this[property];
            adjustSettingFromAttribute(this, property, newValue, componentSpec);
          });
        }
      }

      firstUpdated() {
        super.firstUpdated();
        // shared variations are passed through to singular
        /*this.watchSlottedContent({
          singularTag,
          componentSpec,
          properties: webComponent.properties
        });*/
      }

      updated() {
        super.updated();
      }

      // callback if removed from dom
      disconnectedCallback() {
        super.disconnectedCallback();
        if(this.template) {
          this.template.onDestroyed(); // destroy instance
        }
        litTemplate.onDestroyed(); // destroy prototype
      }

      // callback if moves doc
      adoptedCallback() {
        super.adoptedCallback();
        this.call(onMoved);
      }

      attributeChangedCallback(attribute, oldValue, newValue) {
        super.attributeChangedCallback(attribute, oldValue, newValue);
        adjustSettingFromAttribute(this, attribute, newValue, componentSpec);
        this.call(onAttributeChanged, { args: [attribute, oldValue, newValue], });
      }

      getData() {
        let settings = this.getSettings({componentSpec, properties: webComponent.properties });
        let data = {
          ...settings,
          ...this.getContent({componentSpec}),
          ...this.state,
        };
        if (!isServer) {
          data.darkMode = this.isDarkMode();
        }
        if (componentSpec) {
          data.ui = this.getUIClasses({componentSpec, properties: webComponent.properties });
        }
        if(plural === true) {
          data.plural = true;
        }
        return data;
      }

      render() {
        const data = {
          ...this.getData(),
          ...this.tpl,
        };
        const html = this.template.render(data);
        return html;
      }
    };
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : litTemplate;
};
