import { camelToKebab, each, escapeHTML, isFunction } from '@semantic-ui/utils';
import { expandCustomElements } from './expand-custom-elements.js';
import { createServerTemplate } from './server-template.js';

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

export function renderToString(ComponentClass, attrs = {}, { slots = null, depth = 0, hydrate = true } = {}) {
  const tagName = ComponentClass.componentTagName;
  if (!tagName) {
    throw new Error('renderToString requires a component with a tagName');
  }
  const { template, normalizedAttrs, resolvedProperties, css } = createServerTemplate(ComponentClass, attrs);

  let html = template.render();

  // Phase 2: expand nested custom elements recursively
  html = expandCustomElements(html, { depth, hydrate, renderFn: renderToString });

  // Build attribute string from props using property converters
  const attrString = serializeAttrs(normalizedAttrs, resolvedProperties);

  // Build slot HTML for light DOM, expanding any nested custom elements
  let slotHTML = serializeSlots(slots);
  if (slotHTML) {
    slotHTML = expandCustomElements(slotHTML, { depth: depth + 1, hydrate, renderFn: renderToString });
  }

  // Wrap in DSD — when hydrate is false, mark as `ssr` so the component
  // doesn't self-hydrate when another instance loads the JS on the page.
  const ssrAttr = hydrate ? '' : ' ssr';
  return `<${tagName}${ssrAttr}${attrString}>`
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
        parts.push(`${attrName}="${escapeHTML(String(attrValue))}"`);
      }
      return;
    }

    // Default serialization for types without explicit converters
    const attrName = camelToKebab(key);
    if (typeof value === 'boolean') {
      if (value) { parts.push(attrName); }
    }
    else if (typeof value === 'string') {
      parts.push(`${attrName}="${escapeHTML(value)}"`);
    }
    else if (typeof value === 'number') {
      parts.push(`${attrName}="${value}"`);
    }
    else if (typeof value === 'object') {
      parts.push(`${attrName}="${escapeHTML(JSON.stringify(value))}"`);
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
