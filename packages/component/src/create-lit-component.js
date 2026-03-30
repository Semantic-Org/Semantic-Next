import { camelToKebab, each, isServer } from '@semantic-ui/utils';
import { noChange, unsafeCSS } from 'lit';

import { adjustPropertyFromAttribute } from './helpers/adjust-property-from-attribute.js';
import { LitWebComponentBase } from './lit-web-component.js';

/*
  Factory that creates a web component class for the Lit rendering path.
  All Lit-specific imports and lifecycle are isolated here.
*/

export function createLitComponent({
  prototypeTemplate, resolvedProperties, css, delegatesFocus,
  componentSpec, defaultSettings, plural,
  onAttributeChanged: onAttributeChangedCallback,
  renderingEngine,
}) {
  const component = class extends LitWebComponentBase {
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
