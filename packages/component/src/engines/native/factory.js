import { camelToKebab, each, inArray } from '@semantic-ui/utils';
import { WebComponentBase } from './base.js';

/*
  Factory that creates a web component class for the standard rendering path.
  Same shape as createLitComponent — sets static config on the generated class.
  All lifecycle logic lives on WebComponentBase.
*/

export function createComponent({
  prototypeTemplate,
  resolvedProperties,
  css,
  delegatesFocus,
  componentSpec,
  defaultSettings,
  plural,
  onAttributeChanged,
}) {
  const component = class extends WebComponentBase {};

  component.template = prototypeTemplate;
  component.delegatesFocus = delegatesFocus;
  component.config = {
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
    Object.defineProperty(component.prototype, propName, {
      get() {
        return this.propertyStore.get(propName);
      },
      set(value) {
        const old = this.propertyStore.get(propName);
        this.propertyStore.set(propName, value);
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
