/*
  Astro server renderer for Semantic UI components.

  Checks if a component is an SUI web component (has a prototype Template),
  then calls renderToString to produce Declarative Shadow DOM HTML.
*/

import { ServerRenderer } from '@semantic-ui/renderer';
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
    const tagName = Component.componentTagName || Component.tagName;

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

    // Render to DSD HTML via ServerRenderer
    const css = config.css || protoTemplate.css || '';
    const renderer = new ServerRenderer({
      ast: protoTemplate.ast,
      data,
      subTemplates: protoTemplate.subTemplates || {},
      helpers: TemplateHelpers,
    });
    const renderedHTML = renderer.render();

    // Serialize complex props (arrays, objects) as JSON inside the DSD.
    // The component reads this during hydration so settings are available
    // before initialization — HTML attributes can only carry primitives.
    const complexProps = serializeComplexProps(props);
    const propsScript = complexProps
      ? `<script type="application/json" data-ssr-props>${complexProps}</script>`
      : '';

    const dsd = `<template shadowrootmode="open">${
      css ? `<style>${css}</style>` : ''
    }${propsScript}${renderedHTML}</template>`;

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

    // Use property converter if available (mirrors Lit's toAttribute pattern)
    const propConfig = resolvedProperties[key];
    const toAttribute = propConfig?.converter?.toAttribute;
    if (toAttribute) {
      const attrValue = toAttribute(value);
      if (attrValue !== null && attrValue !== undefined) {
        parts.push(`${camelToKebab(key)}="${String(attrValue).replace(/"/g, '&quot;')}"`);
      }
      return;
    }

    // Non-serializable values (arrays, objects) go via JSON script tag
    if (typeof value === 'object') { return; }

    const attrName = camelToKebab(key);
    if (typeof value === 'boolean') {
      if (value) { parts.push(attrName); }
    }
    else if (typeof value === 'string' || typeof value === 'number') {
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

function serializeComplexProps(props) {
  const complex = {};
  let hasComplex = false;
  each(props, (value, key) => {
    if (value === undefined || value === null) { return; }
    if (isFunction(value)) { return; }
    if (typeof value === 'object') {
      complex[key] = value;
      hasComplex = true;
    }
  });
  if (!hasComplex) { return null; }
  return JSON.stringify(complex).replace(/<\/script/gi, '<\\/script');
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
