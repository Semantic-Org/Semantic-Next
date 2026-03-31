import { getEngine } from '@semantic-ui/renderer';
import { Template, TemplateCompiler } from '@semantic-ui/templating';
import { adoptStylesheet, each, fatal, isClient, kebabToCamel, noop } from '@semantic-ui/utils';

import { getProperties } from './component-helpers.js';

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

  renderingEngine = 'native',
  properties,

  componentSpec = false,
  plural = false,
  singularTag,
} = {}) => {

  // Resolve engine: accepts an engine object or a string name from the registry
  const engine = typeof renderingEngine === 'object'
    ? renderingEngine
    : getEngine(renderingEngine);

  if (!engine) {
    fatal(`Rendering engine "${renderingEngine}" not registered.`
      + ` Import from '@semantic-ui/component' (registers native) or add the engine manually.`);
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

    const factory = engine.factory;
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
