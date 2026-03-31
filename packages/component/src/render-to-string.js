import { camelToKebab, each, isFunction, kebabToCamel } from '@semantic-ui/utils';
import { getUIClasses } from './component-helpers.js';
import { expandCustomElements } from './expand-custom-elements.js';

/*
  Server-side render a component to a DSD HTML string.

  Usage:
    import { defineComponent, renderToString } from '@semantic-ui/component';

    const MyCard = defineComponent({ tagName: 'my-card', template, css, ... });
    const html = renderToString(MyCard, { title: 'Hello' });
    // → <my-card title="Hello"><template shadowrootmode="open"><style>...</style>...</template></my-card>

  The component definition is shared between server and client.
  On the client, the browser parses the DSD, creates the shadow root,
  and connectedCallback hydrates it with reactive bindings.
*/

export function renderToString(ComponentClass, attrs = {}, { slots = null, depth = 0 } = {}) {
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
  const resolvedProperties = ComponentClass.config?.resolvedProperties || ComponentClass.properties || {};

  // Normalize kebab-case attribute names to camelCase property names
  const normalizedAttrs = {};
  each(attrs, (value, key) => {
    normalizedAttrs[kebabToCamel(key)] = value;
  });

  // Merge attributes with defaults
  const data = { ...defaultSettings, ...normalizedAttrs };

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

  let html = template.render();

  // Phase 2: expand nested custom elements recursively
  html = expandCustomElements(html, { depth, renderFn: renderToString });

  // Build attribute string from props using property converters
  const attrString = serializeAttrs(normalizedAttrs, resolvedProperties);

  // Build slot HTML for light DOM
  const slotHTML = serializeSlots(slots);

  // Wrap in DSD
  return `<${tagName}${attrString}>`
    + `<template shadowrootmode="open">`
    + (css ? `<style>${css}</style>` : '')
    + html
    + `</template>`
    + slotHTML
    + `</${tagName}>`;
}

/*
  Serialize attributes using the property type system.
  Uses toAttribute converters when available, falls back to sensible defaults.
*/
function serializeAttrs(attrs, resolvedProperties) {
  const parts = [];

  each(attrs, (value, key) => {
    if (value === undefined || value === null) { return; }
    if (isFunction(value)) { return; }

    const propConfig = resolvedProperties[key];

    // Skip property-only values (attribute: false)
    if (propConfig?.attribute === false) { return; }

    // Use property converter if available
    const toAttribute = propConfig?.converter?.toAttribute;
    if (toAttribute) {
      const attrValue = toAttribute(value);
      if (attrValue === null || attrValue === undefined) { return; }
      const attrName = camelToKebab(key);
      if (attrValue === '') {
        parts.push(attrName);
      }
      else {
        parts.push(`${attrName}="${escapeAttr(String(attrValue))}"`);
      }
      return;
    }

    // Default serialization for types without explicit converters
    const attrName = camelToKebab(key);
    if (typeof value === 'boolean') {
      if (value) { parts.push(attrName); }
    }
    else if (typeof value === 'string') {
      parts.push(`${attrName}="${escapeAttr(value)}"`);
    }
    else if (typeof value === 'number') {
      parts.push(`${attrName}="${value}"`);
    }
    else if (typeof value === 'object') {
      parts.push(`${attrName}="${escapeAttr(JSON.stringify(value))}"`);
    }
  });

  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

/*
  Serialize slotted content for light DOM.
  Named slots get a wrapper element with the slot attribute.
*/
function serializeSlots(slots) {
  if (!slots) { return ''; }
  let html = '';
  each(slots, (content, name) => {
    if (!content) { return; }
    if (name === 'default') {
      html += content;
    }
    else {
      html += `<span slot="${name}">${content}</span>`;
    }
  });
  return html;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
