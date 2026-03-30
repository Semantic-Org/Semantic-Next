import { Template, TemplateCompiler } from '@semantic-ui/templating';
import { adoptStylesheet, camelToKebab, each, inArray, isClient, isEqual, isServer, isFunction, kebabToCamel, noop } from '@semantic-ui/utils';
import { noChange, unsafeCSS } from 'lit';

import { adjustPropertyFromAttribute } from './helpers/adjust-property-from-attribute.js';
import { getProperties } from './component-helpers.js';
import { WebComponentBase } from './web-component.js';
import { LitWebComponentBase } from './lit-web-component.js';

export const defineComponent = ({
  template = '',
  ast,
  css = '',
  pageCSS = '',
  tagName,
  delegatesFocus = false,
  templateName = kebabToCamel(tagName),

  createComponent = function() {},
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

  const isLit = renderingEngine === 'lit';

  // Default rendering engine: standard path uses native, Lit path uses lit
  if (!renderingEngine) {
    renderingEngine = isLit ? 'lit' : 'native';
  }

  // AST shared across instances
  if (!ast) {
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
  if (pageCSS) {
    adoptStylesheet(pageCSS);
  }

  /*
    Create Component Returns Either a Template or WebComponent
    Templates are created as a prototype that can be cloned when instantiated
  */

  let prototypeTemplate = new Template({
    templateName: templateName,
    isPrototype: true,
    renderingEngine,
    ast,
    css,
    events,
    keys,
    defaultState,
    // web components handle settings via base class — only subtemplates need defaultSettings on Template
    defaultSettings: tagName ? undefined : defaultSettings,
    subTemplates,
    onCreated,
    onRendered,
    onDestroyed,
    onThemeChanged,
    createComponent,
  });
  let webComponent;

  if (tagName) {

    const resolvedProperties = getProperties({
      properties,
      componentSpec,
      defaultSettings,
    });

    if (isLit) {
      webComponent = createLitComponent({
        prototypeTemplate, resolvedProperties, css, delegatesFocus,
        componentSpec, defaultSettings, plural,
        onAttributeChanged, renderingEngine,
      });
    }
    else {
      webComponent = createStandardComponent({
        prototypeTemplate, resolvedProperties, css, delegatesFocus,
        componentSpec, defaultSettings, plural,
        onAttributeChanged,
      });
    }

    if (isClient && customElements.get(tagName)) {
      return webComponent;
    }
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : prototypeTemplate;
};

/*******************************
      Standard Component
      (extends HTMLElement)
*******************************/

function createStandardComponent({
  prototypeTemplate, resolvedProperties, css, delegatesFocus,
  componentSpec, defaultSettings, plural,
  onAttributeChanged: onAttributeChangedCallback,
}) {

  const component = class extends WebComponentBase {
    static template = prototypeTemplate;
    static _delegatesFocus = delegatesFocus;

    defaultSettings = {};

    constructor() {
      super();
      this.css = css;
      this.componentSpec = componentSpec;
      this.settings = this.createSettingsProxy({ componentSpec, properties: resolvedProperties });
      this.setDefaultSettings({ defaultSettings, componentSpec });

      // Initialize updateComplete for pre-connect awaits
      this.updateComplete = new Promise(r => { this._resolveUpdate = r; });
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      // Convert via property accessor (which calls requestUpdate)
      const propName = kebabToCamel(attribute);
      const config = resolvedProperties[propName];
      if (config?.converter?.fromAttribute) {
        newValue = config.converter.fromAttribute(newValue, config.type);
      }
      if (config && !config.noAccessor) {
        this[propName] = newValue;
      }

      adjustPropertyFromAttribute({
        el: this,
        attribute,
        attributeValue: newValue,
        properties: resolvedProperties,
        oldValue,
        componentSpec,
      });
      this.call(onAttributeChangedCallback, { args: [attribute, oldValue, newValue] });
    }

    getSettings() {
      return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
    }

    setSetting(name, value) {
      this[name] = value;
    }

    getData() {
      let data = {
        ...this.getSettings(),
      };
      if (!isServer) {
        data.darkMode = this.isDarkMode();
      }
      if (componentSpec) {
        data.ui = this.getUIClasses({ componentSpec, properties: resolvedProperties });
      }
      if (plural === true) {
        data.plural = true;
      }
      return data;
    }
  };

  // observedAttributes — must be set before customElements.define()
  const observedAttrs = [];
  each(resolvedProperties, (config, propName) => {
    if (config.attribute !== false && !config.alias) {
      observedAttrs.push(camelToKebab(propName));
    }
  });
  // Include alias attributes (kebab versions of camelCase names)
  each(resolvedProperties, (config, propName) => {
    if (config.alias) {
      const attr = config.attribute || camelToKebab(propName);
      if (!inArray(attr, observedAttrs)) {
        observedAttrs.push(attr);
      }
    }
  });
  Object.defineProperty(component, 'observedAttributes', {
    get: () => observedAttrs,
  });

  // Property accessors — must be set before customElements.define()
  each(resolvedProperties, (config, propName) => {
    if (config.noAccessor) {
      return;
    }
    const privateProp = `__${propName}`;
    Object.defineProperty(component.prototype, propName, {
      get() {
        return this[privateProp];
      },
      set(value) {
        const old = this[privateProp];
        this[privateProp] = value;
        if (!config.hasChanged || config.hasChanged(value, old)) {
          this.requestUpdate();
        }
      },
      configurable: true,
      enumerable: true,
    });
  });

  // Store properties for external access
  component.properties = resolvedProperties;

  return component;
}

/*******************************
      Lit Component
      (extends LitElement)
*******************************/

function createLitComponent({
  prototypeTemplate, resolvedProperties, css, delegatesFocus,
  componentSpec, defaultSettings, plural,
  onAttributeChanged: onAttributeChangedCallback,
  renderingEngine,
}) {
  const BaseClass = LitWebComponentBase;

  const component = class extends BaseClass {
    static get styles() {
      return unsafeCSS(css);
    }

    static template = prototypeTemplate;

    static properties = resolvedProperties;

    static shadowRootOptions = { ...this.shadowRootOptions, delegatesFocus };

    defaultSettings = {};

    constructor() {
      super();
      this.css = css;
      this.componentSpec = componentSpec;
      this.settings = this.createSettingsProxy({ componentSpec, properties: resolvedProperties });
      this.setDefaultSettings({ defaultSettings, componentSpec });
    }

    connectedCallback() {
      super.connectedCallback();
    }

    triggerAttributeChange() {
      each(resolvedProperties, (propSettings, property) => {
        const attribute = camelToKebab(property);
        let newValue = this[property];
        if (!propSettings.alias && attribute && newValue === true) {
          this.setAttribute(attribute, '');
        }
        adjustPropertyFromAttribute({
          el: this,
          attribute,
          properties: resolvedProperties,
          attributeValue: newValue,
          componentSpec,
        });
      });
    }

    willUpdate() {
      if (isServer) {
        this.triggerAttributeChange();
      }
      if (!this.template) {
        this.template = prototypeTemplate.clone({
          data: this.getData(),
          element: this,
          renderRoot: this.renderRoot,
        });
        if (!this.template.initialized) {
          this.template.initialize();
        }
        this.component = this.template.instance;
        this.dataContext = this.template.getDataContext();
      }
      super.willUpdate();
    }

    firstUpdated() {
      super.firstUpdated();
    }

    updated() {
      super.updated();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this.template) {
        this.template.onDestroyed();
        delete this.template;
        delete this.component;
        delete this.dataContext;
      }
      prototypeTemplate.onDestroyed();
    }

    adoptedCallback() {
      super.adoptedCallback();
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      super.attributeChangedCallback(attribute, oldValue, newValue);
      adjustPropertyFromAttribute({
        el: this,
        attribute,
        attributeValue: newValue,
        properties: resolvedProperties,
        oldValue,
        componentSpec,
      });
      this.call(onAttributeChangedCallback, { args: [attribute, oldValue, newValue] });
    }

    getSettings() {
      return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
    }

    setSetting(name, value) {
      this[name] = value;
    }

    getData() {
      let data = {
        ...this.getSettings(),
      };
      if (!isServer) {
        data.darkMode = this.isDarkMode();
      }
      if (componentSpec) {
        data.ui = this.getUIClasses({ componentSpec, properties: resolvedProperties });
      }
      if (plural === true) {
        data.plural = true;
      }
      return data;
    }

    render() {
      const data = {
        ...this.getData(),
        ...this.tpl,
      };
      // Native renderer: after first render, Reactions handle all DOM updates.
      // Return noChange so Lit leaves the DOM alone.
      if (renderingEngine === 'native' && this._nativeRendered) {
        this.template.render(data);
        return noChange;
      }
      const html = this.template.render(data);
      if (renderingEngine === 'native') {
        this._nativeRendered = true;
      }
      return html;
    }
  };

  component.properties = resolvedProperties;
  return component;
}
