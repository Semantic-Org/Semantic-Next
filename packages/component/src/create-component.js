import { unsafeCSS, html } from 'lit';

import { extend, noop, isObject, isFunction } from '@semantic-ui/utils';
import { TemplateCompiler } from '@semantic-ui/templating';

import { LitRenderer } from './lit/renderer';

import { UIComponent } from './ui-component';
import { attachEvents } from './events';

export const createComponent = (tagName, {
  type = 'element', 
  renderer = 'lit',

  template = '',
  css = false,
  spec = false,
  defineElement = true,

  events = {},

  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,

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

    constructor() {
      super();

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
      this.call(onAttributeChanged);
    }

    render() {
      const html = this.renderer.render();
      return html;
    }

  };

  if(defineElement) {
    customElements.define(tagName, thisComponent);
  }

};
