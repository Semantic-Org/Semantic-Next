import { unsafeCSS, isServer } from 'lit';
import { unique, each, noop, kebabToCamel, inArray, isString, isBoolean, get } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { extractComponentSpec } from './helpers/extract-component-spec.js';
import { adjustSettingFromAttribute } from './helpers/adjust-setting-from-attribute.js';

import { LitTemplate } from './lit/template.js';
import { WebComponentBase } from './web-component.js';

export const createComponent = ({
  renderer = 'lit',

  template = '',
  css = false,
  spec = false,
  tagName,
  templateName = kebabToCamel(tagName),

  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onAttributeChanged = noop,

  properties, // allow overriding properties for lit
  settings = spec?.settings, // settings for js functionality like callbacks etc

  subTemplates = [],

  beforeRendered = noop,
} = {}) => {
  // AST shared across instances
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();

  // specs include a lot of metadata not necessary for powering the component
  // we want to extract the relevent content and then use that portion.
  let componentSpec;
  if (spec) {
    componentSpec = extractComponentSpec(spec);
  }

  // we normally attach this using DOM APIs conditionaly on render
  // but in SSR we need to just include it naively
  if (isServer) {
    each(subTemplates, (template) => {
      if (template.css) {
        css += template.css;
      }
    });
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
        this.template = litTemplate.clone({
          data: this.getData(),
          element: this,
          renderRoot: this.renderRoot,
        });
        this.tpl = this.template.tpl;
        if(isServer) {
          each(webComponent.properties, (propSettings, property) => {
            this.attributeChangedCallback(property, undefined, this[property]);
          });
        }
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
        adjustSettingFromAttribute(this, attribute, newValue, componentSpec);
        this.call(onAttributeChanged, { args: [attribute, oldValue, newValue], });
      }


      getSettings() {
        let settings = {};
        each(webComponent.properties, (propSettings, property) => {
          if (property == 'class' || settings.observe === false) {
            return;
          }
          if(componentSpec && !get(componentSpec.settings, property) && get(componentSpec.reverseSettings, property)) {
            // this property is used to lookup a setting like 'large' -> sizing
            // we dont record this into settings
            return;
          }
          const setting = this[property] || this.defaultSettings[property];
          if(setting !== undefined) {
            settings[property] = setting;
          }
          // boolean attribute case
          if (spec && settings[this[property]] !== undefined) {
            settings[this[property]] = true;
          }
        });
        if(tagName == 'ui-button') {
          console.log(settings);
        }
        return settings;
      }

      getUIClasses() {
        if (!spec) {
          return;
        }
        const classes = [];
        each(webComponent.properties, (settings, property) => {
          if (property == 'class' || settings.observe === false) {
            return;
          }
          if(componentSpec && !get(componentSpec.settings, property) && get(componentSpec.reverseSettings, property)) {
            return;
          }
          const value = this[property];
          // if the setting has a string value use that as class name
          // i.e. sizing='large' => 'large'
          if(isString(value) && value) {
            classes.push(value);
            if(componentSpec.attributeClasses.includes(property)) {
              classes.push(property);
            }
          }

          // otherwise if this is a boolean property push the property name
          // i.e. <button primary="true" => 'primary'
          else if(isBoolean(value) || value === '') {
            classes.push(property);
          }

        });
        const ignoredValues = ['true', 'false'];
        const classString = unique(classes)
          .filter(value => value && !inArray(value, ignoredValues))
          .join(' ');
        return classString;
      }

      getData() {
        let data = {
          ...this.getSettings(),
        };
        if (spec) {
          data.ui = this.getUIClasses();
        }
        return data;
      }

      render() {
        const html = this.template.render({
          ...this.tpl,
          ...this.getData(),
        });
        return html;
      }
    };
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : litTemplate;
};
