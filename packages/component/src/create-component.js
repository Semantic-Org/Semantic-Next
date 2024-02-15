import { unsafeCSS } from 'lit';
import {
  unique,
  each,
  noop,
  kebabToCamel,
  get,
  reverseKeys,
} from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { LitTemplate } from './lit/template.js';
import { WebComponentBase } from './web-component.js';

export const createComponent = ({
  renderer = 'lit',

  template = '',
  css = false,
  spec = false,
  templateName,
  tagName,

  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onAttributeChanged = noop,

  subTemplates = [],

  beforeRendered = noop,
} = {}) => {
  // AST shared across instances
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();

  /*
    We can choose either to render this component as a web component
    or as a naked template. In the case of a naked template this is typically
    a sub template of another web component
  */
  let litTemplate = new LitTemplate({
    templateName: templateName || kebabToCamel(tagName),
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

      static get properties() {
        // not yet implemented
        return {};
      }

      constructor() {
        super();

        this.css = css;

        this.tpl = litTemplate.tpl;
        this.template = litTemplate;
        this.renderCallbacks = [];
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
        litTemplate.attach(this.renderRoot);
        this.call(beforeRendered);
      }

      firstUpdated() {
        super.firstUpdated();
        this.call(onRendered);
      }

      updated() {
        each(this.renderCallbacks, (callback) => callback());
      }

      addRenderCallback(callback) {
        this.renderCallbacks.push(callback);
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
        this.call(onMoved);
      }

      attributeChangedCallback(attribute, oldValue, newValue) {
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
          if (property == 'class' || !propSettings.observe) {
            return;
          }
          settings[property] = this[property];
          if (!settings[this[property]]) {
            settings[this[property]] = true;
          }
        });
        return settings;
      }

      getUIClasses() {
        const classes = [];
        each(webComponent.properties, (settings, property) => {
          if (property == 'class' || !settings.observe) {
            return;
          }
          classes.push(this[property]);
        });
        const classString = unique(classes).filter(Boolean).join(' ');
        return classString;
      }

      getDataContext() {
        return {
          ...this.tpl,
          ...this.getSettings(),
          ui: this.getUIClasses(),
        };
      }

      render() {
        const html = litTemplate.render(this.getDataContext());
        return html;
      }
    };
    customElements.define(tagName, webComponent);
  }

  return tagName ? webComponent : litTemplate;
};
