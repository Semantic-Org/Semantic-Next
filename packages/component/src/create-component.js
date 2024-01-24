import { unsafeCSS, html } from 'lit';

import { extend, unique, each, noop, isObject, get, isFunction, reverseKeys } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { LitRenderer } from './lit/renderer';

import { UIComponent } from './ui-component';
import { attachEvents } from './events';


// placeholder for testing
const spec = {
  settings: {
    size: ['mini', 'tiny', 'small', 'medium', 'large', 'huge', 'massive'],
    emphasis: ['primary', 'secondary'],
    icon: ['icon'],
    labeled: ['right-labeled', ['labeled', 'left-labeled']]
  }
};

export const createComponent = (tagName, {
  renderer = 'lit',

  template = '',
  css = false,
  spec2 = false,
  defineElement = true,

  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onAttributeChanged = noop,

  beforeRendered = noop,

} = {}) => {

  // AST shared across instances
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();
  
  // create class
  let thisComponent = class ThisComponent extends UIComponent {

    static get styles() {
      return unsafeCSS(css);
    }

    static get properties() {
      return {
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
    }

    constructor() {
      super();

      this.css = css;

      let tpl;
      if(isFunction(createInstance)) {

        this.tpl = {};
        tpl = this.call(createInstance);

        /*
          We want to keep this separate for housekeeping passing the
          DOM node around is cumbersome since it obscures most of the
          implementation for the particular UI component due to random DOM attrs
        */
        extend(this.tpl, tpl);

      }
      this.renderer = new LitRenderer({ast, data: tpl, litElement: this });
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
      each(thisComponent.properties, (propSettings, property) => {
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
      each(thisComponent.properties, (settings, property) => {
        if(property == 'class' || !settings.observe) {
          return;
        }
        classes.push(this[property]);
      });
      const classString = unique(classes).filter(Boolean).join(' ');
      return classString;
    }

    render() {
      const html = this.renderer.render({
        data: {
          ...this.tpl,
          ...this.getSettings(),
          ui: this.getUIClasses(),
        }
      });
      return html;
    }

  };

  if(defineElement) {
    customElements.define(tagName, thisComponent);
  }

};
