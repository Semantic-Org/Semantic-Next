import { unsafeCSS } from 'lit';

import { extend, unique, each, noop, get, reverseKeys } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { LitTemplate } from './lit/template.js';

import { WebComponentBase } from './web-component.js';
import { attachEvents } from './events.js';


// placeholder for testing out spec
/*const FAKE_SPEC = {
  settings: {
    size: ['mini', 'tiny', 'small', 'medium', 'large', 'huge', 'massive'],
    emphasis: ['primary', 'secondary'],
    icon: ['icon'],
    labeled: ['right-labeled', ['labeled', 'left-labeled']]
  }
};
*/
export const createComponent = ({
  renderer = 'lit',

  template = '',
  css = false,
  spec = false,
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
    ast,
    css,
    subTemplates,
    createInstance
  });
  let webComponent;

  if(tagName) {

    /*
      Web Component Base is the static portion of the web component which
      doesnt change based off component configuration
    */
    webComponent = class UIWebComponent extends WebComponentBase {

      static get styles() {
        return unsafeCSS(css);
      }

      static get properties() {
        // this will be dynamic
        return {};
        /*
          // attrs
          size: { type: String, observe: true, reflect: false },
          emphasis: { type: String, observe: true, reflect: false },

          // example of value -> attr
          small: { type: Boolean, reflect: false },
          large: { type: Boolean, reflect: false },
          primary: { type: Boolean, reflect: false },
          secondary: { type: Boolean, reflect: false },
          class: { type: String }
        };
        */
      }

      constructor() {
        super();

        this.css = css;

        let tpl;
        if(litTemplate.tpl) {

          this.tpl = {};
          tpl = litTemplate.tpl;
          extend(this.tpl, tpl);

        }
        this.renderer = litTemplate.renderer;
        this.call(onCreated);
      }

      // callback when added to dom
      connectedCallback() {
        super.connectedCallback();
        attachEvents({
          el: this,
          events
        });
        this.call(beforeRendered);
      }

      firstUpdated() {
        super.firstUpdated();
        this.call(onRendered);
      }

      // callback if removed from dom
      disconnectedCallback() {
        super.disconnectedCallback();
        this.call(onDestroyed);
      }

      // callback if moves doc
      adoptedCallback() {
        super.adoptedCallback();
        this.call(onMoved);
      }

      attributeChangedCallback(attribute, oldValue, newValue) {
        this.adjustSettingFromAttribute(attribute, newValue);
        this.call(onAttributeChanged, { args: [attribute, oldValue, newValue] });
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
        const spec = FAKE_SPEC; // TESTING FOR NOW
        if(attribute == 'class') {
          // this is syntax <ui-button class="large primary"></ui-button>
          each(value.split(' '), className => {
            this.adjustSettingFromAttribute(className);
          });
        }
        else if(get(spec.attribute, attribute)) {
          // we dont need to set anything here obj reflection handles this
        }
        else {
          // go from large -> size, or primary -> emphasis
          // we reverse obj key/value then check lookup
          const setting = get(reverseKeys(spec.settings), attribute);
          if(setting) {
            const oldValue = this[setting];
            this[setting] = attribute;
            this.attributeChangedCallback(setting, oldValue, attribute);
          }
        }
      }

      getSettings() {
        const settings = {};
        each(webComponent.properties, (propSettings, property) => {
          if(property == 'class' || !propSettings.observe) {
            return;
          }
          settings[property] = this[property];
          if(!settings[this[property]]) {
            settings[this[property]] = true;
          }
        });
        return settings;
      }

      getUIClasses() {
        const classes = [];
        each(webComponent.properties, (settings, property) => {
          if(property == 'class' || !settings.observe) {
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
        const html = litTemplate.renderWithData(this.getDataContext());
        return html;
      }


    };
    customElements.define(tagName, webComponent);
  }

  return (tagName)
    ? webComponent
    : litTemplate
  ;

};
