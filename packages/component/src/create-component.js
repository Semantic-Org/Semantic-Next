import { unsafeCSS } from 'lit';
import { unique, isServer, each, noop, kebabToCamel, get, reverseKeys } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

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

  properties = null, // allow overriding properties for lit
  settings = {}, // a list of properties which we can use to infer type

  subTemplates = [],

  beforeRendered = noop,
} = {}) => {
  // AST shared across instances
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();

  // we normally attach this using DOM APIs conditionaly on render
  // but in SSR we need to just include it naively
  if (isServer()) {
    each(subTemplates, (template) => {
      if (template.css) {
        css += template.css;
      }
    });
  }

  /*
    We can choose either to render this component as a web component
    or as a naked template. In the case of a naked template this is typically
    a sub template of another web component
  */
  let litTemplate = new LitTemplate({
    templateName: templateName,
    prototype: true,
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

      static properties =
        properties || WebComponentBase.getProperties(settings);

      settings = {};

      constructor() {
        super();

        this.css = css;
        this.setDefaultSettings(settings);
        this.tpl = litTemplate.tpl;
        this.template = litTemplate;
        this.template.setElement(this);
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
        console.log('connected', this.menu);
        litTemplate.attach(this.renderRoot);
        this.call(beforeRendered);
      }

      firstUpdated() {
        super.firstUpdated();
        console.log('first updated', this.menu);
        litTemplate.setDataContext(this.getDataContext());
        // nothing for now
      }

      willUpdate() {
        super.willUpdate();
        // nothing for now
      }

      updated() {
        super.updated();
        console.log('updated', this.menu);
        // nothing for now
      }

      // callback if removed from dom
      disconnectedCallback() {
        super.disconnectedCallback();
        litTemplate.onDestroyed();
        this.call(onDestroyed);
      }

      // callback if moves doc
      adoptedCallback() {
        super.adoptedCallback();
        console.log('adopted', this.menu);
        this.call(onMoved);
      }

      attributeChangedCallback(attribute, oldValue, newValue) {
        console.log('attr change callback');
        this.adjustSettingFromAttribute(attribute, newValue);
        this.call(onAttributeChanged, {
          args: [attribute, oldValue, newValue],
        });
        super.attributeChangedCallback(attribute, oldValue, newValue);
      }

      /*
        Semantic UI supports 3 dialects to support this we
        check if attribute is a setting and reflect the value

        <ui-button size="large"> // verbose
        <ui-button large> // concise
        <ui-button class="large"> // classic
      */
      adjustSettingFromAttribute(attribute, value) {
        if (spec) {
          if (attribute == 'class') {
            // syntax <ui-button class="large primary"></ui-button>
            each(value.split(' '), (className) => {
              this.adjustSettingFromAttribute(className);
            });
          }
          else if (get(spec?.attribute, attribute)) {
            // we dont need to set anything here obj reflection handles this
          }
          else {
            // go from large -> size, or primary -> emphasis
            // we reverse obj key/value then check lookup
            const setting = get(reverseKeys(spec.settings), attribute);
            if (setting) {
              const oldValue = this[setting];
              const newValue = attribute;
              this[setting] = newValue;
              this.attributeChangedCallback(setting, oldValue, newValue);
            }
          }
        }
      }

      getSettings() {
        const settings = {};
        each(webComponent.properties, (propSettings, property) => {
          if (property == 'class' || propSettings.observe === false) {
            return;
          }
          settings[property] = this[property];
          if (spec && !settings[this[property]]) {
            settings[this[property]] = true;
          }
        });
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
          classes.push(this[property]);
        });
        const classString = unique(classes).filter(Boolean).join(' ');
        return classString;
      }

      getDataContext() {
        let data = {
          ...this.tpl,
          ...this.getSettings(),
        };
        if (spec) {
          data.ui = this.getUIClasses();
        }
        return data;
      }

      render() {
        console.log('render', this.menu);
        const html = litTemplate.render(this.getDataContext());
        return html;
      }
    };
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : litTemplate;
};
