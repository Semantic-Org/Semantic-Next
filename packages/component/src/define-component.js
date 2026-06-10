import { getEngine } from '@semantic-ui/renderer';
import { TemplateCompiler } from '@semantic-ui/compiler';
// direct import avoids circular chunk dependency between component ↔ templating
import { Template } from '@semantic-ui/templating/template';
import { adoptStylesheet, each, fatal, identity, isClient, kebabToCamel, noop } from '@semantic-ui/utils';

import { getProperties } from './component-helpers.js';
import { registerComponent } from './component-registry.js';

// user css can make whitespace significant, keep the template intact when it might
const WHITESPACE_SENSITIVE_CSS = /white-space(?:-collapse)?\s*:\s*(?:pre|preserve|break-spaces)/;

export const defineComponent = ({
  template = '',
  ast,
  preserveWhitespace = false,
  css = '',
  pageCSS = '',
  tagName,
  delegatesFocus = false,
  templateName = kebabToCamel(tagName),

  createComponent: createComponentFn = identity,
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
    ast = compiler.compile(template, { preserveWhitespace: preserveWhitespace || WHITESPACE_SENSITIVE_CSS.test(css) });
  }

  each(subTemplates, (subTemplate, name) => {
    // support syntactic sugar obj literal subtemplates
    if (!(subTemplate instanceof Template)) {
      subTemplates[name] = defineComponent(subTemplate);
    }
    // use subtemplate css which includes its own subtemplates
    if (subTemplates[name].css) {
      css += subTemplates[name].css;
    }
  });

  if (pageCSS) {
    adoptStylesheet(pageCSS);
  }

  let prototypeTemplate = new Template({
    templateName,
    isPrototype: true,
    renderingEngine,
    template,
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

    // Store tagName on the class for SSR renderToString
    webComponent.componentTagName = tagName;
    webComponent.toDefinition = () => prototypeTemplate.toDefinition();
    registerComponent(tagName, webComponent);

    if (isClient && customElements.get(tagName)) {
      return webComponent;
    }
    if (isClient) {
      customElements.define(tagName, webComponent);
    }
  }
  return tagName ? webComponent : prototypeTemplate;
};
