// the registry by package name, so a bundle per entry reads the one the root writes
import { getComponent } from '@semantic-ui/component';
import { each, isString, parseHTML, unescapeHTML } from '@semantic-ui/utils';

import { resolveAttributeAliases } from '../component-helpers.js';

const MAX_DEPTH = 10;

// a custom element name as the browser registers one, lowercase with a hyphen
const CUSTOM_TAG = /^[a-z][a-z0-9]*-/;

/*
  Phase 2 of SSR: read the rendered HTML into a tree, look every custom element tag up in the
  component registry, and recursively render the registered ones as DSD in place. The tree's
  spans splice the original string, so everything not expanded passes through byte for byte,
  and a tag inside script or style text is text.

  Input:  '<div><ui-icon icon="home"></ui-icon></div>'
  Output: '<div><ui-icon icon="home"><template shadowrootmode="open">...</template></ui-icon></div>'

  The `renderFn` parameter breaks the circular dependency with renderToString.
*/
export function expandCustomElements(html, { depth = 0, hydrate = true, renderFn, assignSlots = false } = {}) {
  // a fragment means the client renderer ran
  if (!isString(html)) {
    throw new TypeError(
      'expandCustomElements: the template rendered on the client renderer, not to a string. Set Template.isServer = true to render in a browser',
    );
  }
  if (depth >= MAX_DEPTH) { return html; }

  let result = '';
  let cursor = 0;

  const expand = (nodes) => {
    each(nodes, (node) => {
      if (node.type !== 'element') { return; }
      if (!CUSTOM_TAG.test(node.name)) {
        expand(node.children);
        return;
      }
      // an unregistered custom element passes through whole, its children with it
      const ComponentClass = getComponent(node.name);
      if (!ComponentClass) { return; }

      // Astro pre-renders child components before passing them as slot content to parents
      const children = html.slice(node.innerStart, node.innerEnd);
      if (children.trimStart().startsWith('<template shadowrootmode')) { return; }

      const rendered = renderFn(ComponentClass, deserializeAttrs(node.attributes, ComponentClass), {
        // the DSD path leaves slot assignment to the browser, the flat path has no browser
        slots: children ? (assignSlots ? slotsFrom(node, html) : { default: children }) : null,
        depth: depth + 1,
        hydrate,
      });
      result += html.slice(cursor, node.start) + rendered;
      cursor = node.end;
    });
  };

  expand(parseHTML(html));
  return result + html.slice(cursor);
}

/*
  Convert the attributes as written to typed values using the component's
  property definitions.
*/
function deserializeAttrs(attributes, ComponentClass) {
  const resolvedProperties = ComponentClass.config?.resolvedProperties || ComponentClass.properties || {};
  const attrs = {};

  each(attributes, ({ name, value }) => {
    // Convert kebab attribute names to camelCase property names
    const propName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const rawValue = value === null ? true : unescapeHTML(value);

    const propConfig = resolvedProperties[propName] || resolvedProperties[name];

    // Use fromAttribute converter if available
    if (propConfig?.converter?.fromAttribute && isString(rawValue)) {
      attrs[propName] = propConfig.converter.fromAttribute(rawValue);
    }
    else {
      attrs[propName] = rawValue;
    }
  });

  // Resolve option attributes (e.g. tiny → size="tiny")
  resolveAttributeAliases(attrs, ComponentClass.config?.componentSpec);

  return attrs;
}

/*
  Assign an element's children to its slots the way the browser would: a top-level
  child carrying slot="name" is that slot's content, everything else the default's.
  Elements stay whole, so a slot attribute deeper down belongs to its own element.
*/
function slotsFrom(element, html) {
  const slots = {};
  each(element.children, (child) => {
    const slot = child.type === 'element' ? child.attributes.find((attribute) => attribute.name === 'slot') : null;
    const name = slot && isString(slot.value) ? slot.value : 'default';
    const content = html.slice(child.start, child.end);
    if (content) {
      slots[name] = (slots[name] || '') + content;
    }
  });
  return slots;
}
