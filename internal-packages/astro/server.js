/*
  Astro server renderer for Semantic UI components.

  Checks if a component is an SUI web component (has a prototype Template),
  then calls renderToString to produce Declarative Shadow DOM HTML.
*/

import { renderToString } from '@semantic-ui/renderer';
import { TemplateHelpers } from '@semantic-ui/templating';
import { camelToKebab, each, isFunction } from '@semantic-ui/utils';

import { Signal } from '@semantic-ui/reactivity';

export default {
  check(Component) {
    return Component?.template?.ast !== undefined;
  },

  renderToStaticMarkup(Component, props, slotted) {
    const protoTemplate = Component.template;
    const config = Component.config || {};
    const tagName = Component.tagName;

    // Build data context from props + defaults
    const defaultSettings = config.defaultSettings || {};
    const data = { ...defaultSettings, ...props };

    // Compute {ui} classes if spec-driven
    if (config.componentSpec) {
      data.ui = computeUIClasses(Component, config, data);
    }

    // Initialize state as Signals
    const state = {};
    if (protoTemplate.defaultState) {
      each(protoTemplate.defaultState, (stateConfig, name) => {
        const initialValue = data[name] !== undefined
          ? data[name]
          : (stateConfig?.value ?? stateConfig);
        state[name] = new Signal(initialValue, stateConfig?.options);
        data[name] = state[name];
      });
    }

    // Run createComponent if present
    if (isFunction(protoTemplate.createComponent)) {
      const instance = {};
      const noop = () => {};
      const params = {
        el: undefined,
        self: instance,
        tpl: instance,
        component: instance,
        $: () => ({ length: 0, on: noop, off: noop }),
        $$: () => ({ length: 0 }),
        reaction: noop,
        signal: (value, options) => new Signal(value, options),
        afterFlush: noop,
        nonreactive: (fn) => fn(),
        flush: noop,
        data,
        settings: data,
        state,
        isServer: true,
        isClient: false,
        isHydrating: false,
        isRendered: () => false,
        rerender: noop,
        dispatchEvent: noop,
        attachEvent: noop,
        bindKey: noop,
        unbindKey: noop,
        interval: noop,
        timeout: noop,
        abortSignal: { addEventListener: noop },
        helpers: TemplateHelpers,
        template: null,
        templateName: protoTemplate.templateName || '',
        templates: new Map(),
        findTemplate: () => undefined,
        findParent: () => undefined,
        findChild: () => undefined,
        findChildren: () => [],
        get darkMode() {
          return undefined;
        },
      };

      const result = protoTemplate.createComponent.call(instance, params) || {};
      Object.assign(instance, result);

      if (isFunction(instance.initialize)) {
        params.self = instance;
        params.tpl = instance;
        params.component = instance;
        instance.initialize.call(instance, params);
      }

      // Fire onCreated
      if (isFunction(protoTemplate.onCreatedCallback)) {
        protoTemplate.onCreatedCallback.call(undefined, params);
      }

      Object.assign(data, instance);
    }

    // Render to DSD HTML
    const dsd = renderToString({
      ast: protoTemplate.ast,
      data,
      css: config.css || protoTemplate.css || '',
      subTemplates: protoTemplate.subTemplates || {},
      helpers: TemplateHelpers,
    });

    // Build the full element HTML with attributes
    const attrs = serializeAttributes(props, config);
    const slotHTML = serializeSlots(slotted);

    return {
      html: `<${tagName}${attrs}>${dsd}${slotHTML}</${tagName}>`,
    };
  },
};

function serializeAttributes(props, config) {
  const resolvedProperties = config.resolvedProperties || {};
  const parts = [];

  each(props, (value, key) => {
    if (value === undefined || value === null) { return; }
    if (isFunction(value)) { return; }
    const attrName = camelToKebab(key);
    if (typeof value === 'boolean') {
      if (value) { parts.push(attrName); }
    }
    else {
      parts.push(`${attrName}="${String(value).replace(/"/g, '&quot;')}"`);
    }
  });

  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

function serializeSlots(slotted) {
  if (!slotted) { return ''; }
  let html = '';
  each(slotted, (content, name) => {
    if (name === 'default') {
      html += content;
    }
    else {
      html += `<span slot="${name}">${content}</span>`;
    }
  });
  return html;
}

function computeUIClasses(Component, config, data) {
  // Simplified UI class computation for SSR
  // Full version lives in component-helpers.js
  const { componentSpec, resolvedProperties } = config;
  if (!componentSpec) { return ''; }

  const classes = [];
  each(resolvedProperties, (propConfig, propName) => {
    const value = data[propName];
    if (value === undefined || value === null || value === false) { return; }
    if (propConfig.alias) {
      // Option attribute — the prop name IS the class
      if (value === true || value === propName) {
        classes.push(propName);
      }
    }
    else if (typeof value === 'boolean' && value) {
      classes.push(propName);
    }
    else if (typeof value === 'string' && value) {
      classes.push(value);
    }
  });

  return classes.join(' ') + (classes.length ? ' ' : '');
}
