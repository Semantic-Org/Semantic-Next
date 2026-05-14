import { camelToKebab, each } from '@semantic-ui/utils';
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

  // observedAttributes must be set before customElements.define()
  const observedAttrs = new Set();
  each(resolvedProperties, (config, propName) => {
    if (config.alias) {
      observedAttrs.add(propName);
    }
    else if (config.attribute !== false) {
      observedAttrs.add(camelToKebab(propName));
    }
  });
  Object.defineProperty(component, 'observedAttributes', {
    get: () => [...observedAttrs],
  });

  // Property accessors — must be set before customElements.define()
  each(resolvedProperties, (config, propName) => {
    if (config.noAccessor) {
      return;
    }
    Object.defineProperty(component.prototype, propName, {
      get() {
        return this.properties.get(propName);
      },
      set(value) {
        const old = this.properties.get(propName);
        this.properties.set(propName, value);
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
