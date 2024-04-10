import { unsafeCSS } from 'lit';
import { each, noop, isServer, kebabToCamel } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { adoptStylesheet } from './helpers/adopt-stylesheet.js';
import { adjustSettingFromAttribute } from './helpers/adjust-setting-from-attribute.js';

import { LitTemplate } from './lit/template.js';
import { WebComponentBase } from './web-component.js';


export const createComponent = ({
  renderer = 'lit',

  template = '',
  css = false,
  lightCSS = false,
  componentSpec = false,
  tagName,
  delegateFocus = false,
  templateName = kebabToCamel(tagName),

  plural = false,
  singularTag,

  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onAttributeChanged = noop,

  properties, // allow overriding properties for lit
  settings, // settings for js functionality like callbacks etc

  subTemplates = [],

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
    Create Component Returns Either a LitTemplate or WebComponent
    LitTemplates are created as a prototype that can be cloned when instantiated
  */
  let litTemplate = new LitTemplate({
    templateName: templateName,
    isPrototype: true,
    ast,
    css,
    events,
    subTemplates,
    onCreated,
    onRendered,
    onDestroyed,
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
        this.setDefaultSettings(settings);
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
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
        let data = {
          ...this.getSettings({componentSpec, properties: webComponent.properties }),
          ...this.getContent({componentSpec}),
          plural
        };
        if (componentSpec) {
          data.ui = this.getUIClasses({componentSpec, properties: webComponent.properties });
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
