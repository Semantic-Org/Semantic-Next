import { Template, TemplateCompiler } from '@semantic-ui/templating';
import { adoptStylesheet, each, isClient, kebabToCamel, noop } from '@semantic-ui/utils';

import { getProperties } from './component-helpers.js';
import { createComponent } from './create-component.js';
import { createLitComponent } from './create-lit-component.js';

export const defineComponent = ({
  template = '',
  ast,
  css = '',
  pageCSS = '',
  tagName,
  delegatesFocus = false,
  templateName = kebabToCamel(tagName),

  createComponent: createComponentFn = noop,
  events = {},
  keys = {},

  onCreated = noop,
  onRendered = noop,
  onDestroyed = noop,
  onThemeChanged = noop,
  onAttributeChanged = noop,

  defaultSettings = {},
  defaultState = {},

  subTemplates = {},

  renderingEngine,
  properties,

  componentSpec = false,
  plural = false,
  singularTag,
} = {}) => {

  const isLit = renderingEngine === 'lit';
  if (!renderingEngine) {
    renderingEngine = isLit ? 'lit' : 'native';
  }

  if (!ast) {
    const compiler = new TemplateCompiler(template);
    ast = compiler.compile();
  }

  each(subTemplates, (template) => {
    if (template.css) {
      css += template.css;
    }
  });

  if (pageCSS) {
    adoptStylesheet(pageCSS);
  }

  let prototypeTemplate = new Template({
    templateName,
    isPrototype: true,
    renderingEngine,
    ast,
    css,
    events,
    keys,
    defaultState,
    defaultSettings: tagName ? undefined : defaultSettings,
    subTemplates,
    onCreated,
    onRendered,
    onDestroyed,
    onThemeChanged,
    createComponent: createComponentFn,
  });
  let webComponent;

  if (tagName) {
    const resolvedProperties = getProperties({
      properties,
      componentSpec,
      defaultSettings,
    });

    const factory = isLit ? createLitComponent : createComponent;
    webComponent = factory({
      prototypeTemplate, resolvedProperties, css, delegatesFocus,
      componentSpec, defaultSettings, plural,
      onAttributeChanged, renderingEngine,
    });

    if (isClient && customElements.get(tagName)) {
      return webComponent;
    }
    customElements.define(tagName, webComponent);
  }
  return tagName ? webComponent : prototypeTemplate;
};
