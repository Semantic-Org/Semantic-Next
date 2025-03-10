import { unsafeCSS } from 'lit';
import { each, noop, isServer, isClient, camelToKebab, kebabToCamel } from '@semantic-ui/utils';
import { TemplateCompiler, Template } from '@semantic-ui/templating';

import { adoptStylesheet } from './helpers/adopt-stylesheet.js';
import { adjustPropertyFromAttribute } from './helpers/adjust-property-from-attribute.js';
import { WebComponentBase } from './web-component.js';

export const defineComponent = ({
  template = '',
  ast,
  css = '',
  pageCSS = '',
  tagName,
  delegatesFocus = false,
  templateName = kebabToCamel(tagName),

  createComponent = noop,
  events = {}, // event bindings
  keys = {}, // key bindings

  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onThemeChanged = noop,
  onAttributeChanged = noop,

  defaultSettings = {},
  defaultState = {},

  subTemplates = {},

  renderingEngine,
  properties, // allow overriding web component properties

  // only used by components that provide a spec
  componentSpec = false,
  plural = false,
  singularTag,
} = {}) => {


  // AST shared across instances
  if(!ast) {
    const compiler = new TemplateCompiler(template);
    ast = compiler.compile();
  }

  // to support SSR we need to include all subtemplate css in base template
  each(subTemplates, (template) => {
    if (template.css) {
      css += template.css;
    }
  });

  // allow component to assign page css associated with the component
  // this will only be added once when the component is defined
  if(pageCSS) {
    adoptStylesheet(pageCSS);
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
    keys,
    defaultState,
    subTemplates,
    onCreated,
    onRendered,
    onDestroyed,
    onThemeChanged,
    createComponent,
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

      static template = litTemplate;

      static properties = WebComponentBase.getProperties({
        properties,
        componentSpec,
        defaultSettings,
      });

      defaultSettings = {};

      constructor() {
        super();
        this.css = css;
        this.componentSpec = componentSpec;
        this.settings = this.createSettingsProxy({componentSpec, properties: webComponent.properties});
        this.setDefaultSettings({defaultSettings, componentSpec});
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
      }

      triggerAttributeChange() {
        each(webComponent.properties, (propSettings, property) => {
          const attribute = camelToKebab(property);

          let newValue = this[property];
          // this is necessary to handle how lit handles boolean attributes
          // otherwise you get <ui-button primary="true">
          if(!propSettings.alias && attribute && newValue === true) {
            this.setAttribute(attribute, '');
          }
          adjustPropertyFromAttribute({
            el: this,
            attribute,
            properties: webComponent.properties,
            attributeValue: newValue,
            componentSpec
          });
        });
      }

      willUpdate() {
        if(isServer) {
          // property change callbacks wont call on SSR
          // we need this to get proper settings for server render
          this.triggerAttributeChange();
        }
        if(!this.template) {
          this.template = litTemplate.clone({
            data: this.getData(),
            element: this,
            renderRoot: this.renderRoot,
          });
          if(!this.template.initialized) {
            this.template.initialize();
          }
          // make this easier to access in dom
          this.component = this.template.instance;
          this.dataContext = this.template.data;
        }
        super.willUpdate();
      }

      firstUpdated() {
        super.firstUpdated();
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
        adjustPropertyFromAttribute({
          el: this,
          attribute,
          attributeValue: newValue,
          properties: webComponent.properties,
          oldValue,
          componentSpec
        });
        this.call(onAttributeChanged, { args: [attribute, oldValue, newValue], });
      }

      /*******************************
                  Settings
      *******************************/


      getSettings() {
        return this.getSettingsFromConfig({componentSpec, properties: webComponent.properties });
      }
      setSetting(name, value) {
        this[name] = value;
      }

      getData() {
        let settings = this.getSettings();
        let data = {
          ...settings,
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
    if(isClient && customElements.get(tagName)) {
      return webComponent;
    }
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : litTemplate;
};
