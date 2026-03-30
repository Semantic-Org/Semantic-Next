import { camelToKebab, each, inArray } from '@semantic-ui/utils';
import { WebComponentBase } from './web-component.js';

/*
  Factory that creates a web component class for the standard rendering path.
  The returned class extends WebComponentBase (HTMLElement) with per-component
  static config, property accessors, and observedAttributes.
*/

export function createComponent({
  prototypeTemplate, resolvedProperties, css, delegatesFocus,
  componentSpec, defaultSettings, plural,
  onAttributeChanged,
}) {
  const component = class extends WebComponentBase {};

  // Static config — read by WebComponentBase methods
  component.template = prototypeTemplate;
  component._delegatesFocus = delegatesFocus;
  component._config = {
    resolvedProperties,
    componentSpec,
    defaultSettings,
    css,
    plural,
    onAttributeChanged,
  };
  component.properties = resolvedProperties;

  // observedAttributes — must be set before customElements.define()
  const observedAttrs = [];
  each(resolvedProperties, (config, propName) => {
    if (config.attribute !== false && !config.alias) {
      observedAttrs.push(camelToKebab(propName));
    }
  });
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

  return component;
}
