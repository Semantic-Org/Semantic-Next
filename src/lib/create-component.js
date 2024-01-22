import { unsafeCSS, html } from 'lit';
import { UIComponent } from './ui-component';
import { attachEvents } from './attach-events';
import { TemplateCompiler } from './template/compiler';
import { LitRenderer } from './template/lit-renderer';
import { extend, noop, isObject, isFunction } from './utils';

export const createComponent = (tagName, {
  type = 'element', 
  css = false, 
  template = '',
  spec = false,
  events = {},
  defineElement = true,
  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
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

      // store details
      this.ast = ast;
      this.css = css;
      this.template = template;

      // store callbacks
      this.onCreated = onCreated;
      this.onRendered = onRendered;
      this.onDestroyed = onDestroyed;

      let tpl;
      if(isFunction(createInstance)) {

        this.tpl = {};
        tpl = createInstance.call(this, this.tpl, this.$);

        /*
          We want to keep this separate for housekeeping passing the
          DOM node around is cumbersome since it obscures most of the
          implementation for the particular UI component due to random DOM attrs
        */
        extend(this.tpl, tpl);

      }
      this.renderer = new LitRenderer({ast, data: tpl, litElement: this });

      if(isFunction(onCreated)) {
        onCreated.call(this, this.tpl, this.$);
      }
    }

    // callback when added to dom
    connectedCallback() {
      super.connectedCallback();
      attachEvents({
        el: this,
        events
      });
      if(isFunction(onRendered)) {
        onRendered.call(this, this.tpl, this.$);
      }
    }

    // callback if removed from dom
    disconnectedCallback() {
      super.disconnectedCallback();
      if(isFunction(onDestroyed)) {
        onDestroyed.call(this, this.tpl, this.$);
      }
    }

    // callback if moves doc
    adoptedCallback() {
      super.adoptedCallback();
      if(isFunction(onMoved)) {
        onMoved.call(this, this.tpl, this.$);
      }
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if(isFunction(this.onAttributeChanged)) {
        this.onAttributeChanged.call(this, {
          attribute, oldValue, newValue
        });
      }
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
