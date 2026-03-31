import { camelToKebab, each } from '@semantic-ui/utils';

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

export function renderToString(ComponentClass, attrs = {}) {
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

  // Merge attributes with defaults
  const data = { ...defaultSettings, ...attrs };

  // Clone prototype template with the data context
  const template = proto.clone({ data });
  template.initialize();
  const html = template.render();

  // Build attribute string for the outer element
  const attrString = serializeAttrs(attrs);

  // Wrap in DSD
  return `<${tagName}${attrString}>`
    + `<template shadowrootmode="open">`
    + (css ? `<style>${css}</style>` : '')
    + html
    + `</template>`
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
