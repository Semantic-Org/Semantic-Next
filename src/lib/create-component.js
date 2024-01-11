import { LitElement, unsafeCSS, html } from 'lit';
import { UIComponent } from './ui-component';
import { attachEvents } from './attach-events';
import { TemplateCompiler } from './template/compiler';
import { extend, noop, isObject, isFunction } from './utils';

export const createComponent = (name, { 
  type = 'element', 
  css = false, 
  template = '',
  definition = false, 
  events = {},
  defineElement = true,
  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
} = {}) => {

  
  // create class
  let thisComponent = class ThisComponent extends UIComponent {

    static get styles() {
      return unsafeCSS(css);
    }

    // callback when initialized
    constructor() {
      super();

      // extend class with obj literal
      if(isFunction(onCreated)) {
        let tpl = onCreated.call(this, this.tpl, this.$);
        extend(this, tpl);

        // to make it easier we only pass template instance around to functions
        this.tpl = tpl;

        // compile template
        const compiler = new TemplateCompiler(template, tpl);
        const ast = compiler.compile();
        console.log(ast);
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
        onRendered.apply(this);
      }
    }

    // callback if removed from dom
    disconnectedCallback() {
      super.disconnectedCallback();
      if(isFunction(onDestroyed)) {
        onDestroyed.apply(this);
      }
    }

    // callback if moves doc
    adoptedCallback() {
      super.adoptedCallback();
      if(isFunction(onMoved)) {
        onMoved.apply(this);
      }
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if(isFunction(this.onAttributeChanged)) {
        this.on?.settingChanged.call(this, {
          attribute, oldValue, newValue
        });
      }
    }

    render() {
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
