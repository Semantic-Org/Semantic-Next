import { camelToKebab, each, isServer } from '@semantic-ui/utils';
import { getUIClasses } from './component-helpers.js';

/*
  Server-side render a component to a DSD HTML string.

  Usage:
    import { defineComponent, renderToString } from '@semantic-ui/component';

    const MyCard = defineComponent({ tagName: 'my-card', template, css, ... });
    const html = renderToString(MyCard, { title: 'Hello' });
    // → <my-card><template shadowrootmode="open"><style>...</style>...</template></my-card>

  The component definition is shared between server and client.
  On the client, the browser parses the DSD, creates the shadow root,
  and connectedCallback hydrates it with reactive bindings.
*/

export function renderToString(ComponentClass, attrs = {}, children = '') {
  const tagName = ComponentClass.componentTagName;
  if (!tagName) {
    throw new Error('renderToString requires a component with a tagName');
  }

  const proto = ComponentClass.template;
  if (!proto) {
    throw new Error(`Component ${tagName} has no template`);
  }

  const css = ComponentClass.config?.css || '';
  const defaultSettings = ComponentClass.config?.defaultSettings || {};
  const componentSpec = ComponentClass.config?.componentSpec;
  const resolvedProperties = ComponentClass.config?.resolvedProperties || ComponentClass.properties;

  // Merge attributes with defaults
  const data = { ...defaultSettings, ...attrs };

  // Compute {ui} class string for spec-driven components
  if (componentSpec) {
    data.ui = getUIClasses(data, { componentSpec, properties: resolvedProperties });
  }

  // Clone prototype template with the data context.
  // Force native engine — ServerRenderer handles string output.
  const template = proto.clone({ data, renderingEngine: 'native' });

  // Provide settings for createComponent — no web component element in SSR,
  // so the Template won't have settings from an element or subtemplate proxy.
  template.settings = data;

  template.initialize();
  const html = template.render();

  // Suppress deferred lifecycle callbacks (onRendered, etc.) —
  // they expect a DOM element which doesn't exist in string rendering.
  // The render is complete; no further callbacks should fire.
  template.onRendered = () => {};
  template.onDestroyed = () => {};

  // Build attribute string for the outer element
  const attrString = serializeAttrs(attrs);

  // Wrap in DSD — slotted content goes in the light DOM after the template
  return `<${tagName}${attrString}>`
    + `<template shadowrootmode="open">`
    + (css ? `<style>${css}</style>` : '')
    + html
    + `</template>`
    + children
    + `</${tagName}>`;
}

function serializeAttrs(attrs) {
  let result = '';
  each(attrs, (value, key) => {
    // Only serialize primitive values as HTML attributes
    if (typeof value === 'string') {
      result += ` ${camelToKebab(key)}="${escapeAttr(value)}"`;
    }
    else if (typeof value === 'number') {
      result += ` ${camelToKebab(key)}="${value}"`;
    }
    else if (value === true) {
      result += ` ${camelToKebab(key)}`;
    }
    // Skip false, null, undefined, objects, functions
  });
  return result;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
