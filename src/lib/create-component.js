import { unsafeCSS, html } from 'lit';
import { UIComponent } from './ui-component';
import { attachEvents } from './attach-events';
import { TemplateCompiler } from './template/compiler';
import { LitRenderer } from './template/lit-renderer';
import { extend, noop, isObject, isFunction } from './utils';

export const createComponent = (name, { 
  type = 'element', 
  css = false, 
  template = '',
  definition = false, 
  events = {},
  defineElement = true,
  createInstance = noop,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
} = {}) => {

  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();
  
  // create class
  let thisComponent = class ThisComponent extends UIComponent {

    static get styles() {
      return unsafeCSS(css);
    }

    constructor() {
      super();

      // AST is shared across instances
      this.ast = ast;

      this.renderer = new LitRenderer();

      if(isFunction(createInstance)) {

        let tpl = createInstance.call(this, this.tpl, this.$);
        extend(this, tpl);

        /*
          We want to keep this separate for housekeeping passing the
          DOM node around is cumbersome since it obscures most of the
          implementation for the particular UI component due to random DOM attrs
        */
        this.tpl = tpl;

      }

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

      this.renderer.render(this.ast, this.tpl);

      // ;)
      const strings = [ template ];
      strings.raw = [String.raw({ raw: template })];
      return html(strings, []);
    }

    onCreated;
    onRendered;
    onDestroyed;

  };

  if(defineElement) {
    customElements.define(name, thisComponent);
  }

};
