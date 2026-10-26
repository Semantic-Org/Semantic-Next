import { camelToKebab, each } from '@semantic-ui/utils';

import { defineAccessors } from '../../component-helpers.js';
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

  // accessors must exist before customElements.define()
  defineAccessors(component.prototype, resolvedProperties);

  return component;
}
