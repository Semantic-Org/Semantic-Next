import { resolveAttributeAliases } from './component-helpers.js';
import { getComponent } from './component-registry.js';

const MAX_DEPTH = 10;

/*
  Phase 2 of SSR: scan rendered HTML for custom element tags,
  look them up in the component registry, and recursively render
  their shadow DOM as DSD.

  Input:  '<div><ui-icon icon="home"></ui-icon></div>'
  Output: '<div><ui-icon icon="home"><template shadowrootmode="open">...</template></ui-icon></div>'

  Custom element tags are identified by containing a hyphen (per spec).
  Only tags registered in the component registry are expanded.
  The `renderFn` parameter breaks the circular dependency with renderToString.
*/
export function expandCustomElements(html, { depth = 0, renderFn } = {}) {
  if (depth >= MAX_DEPTH) { return html; }

  let result = '';
  let pos = 0;

  while (pos < html.length) {
    const tagStart = findNextCustomElement(html, pos);
    if (tagStart === -1) {
      result += html.slice(pos);
      break;
    }

    // Copy everything before the custom element
    result += html.slice(pos, tagStart);

    // Parse the opening tag
    const openTag = parseOpenTag(html, tagStart);
    if (!openTag) {
      // Malformed — pass through the '<' and continue
      result += html[tagStart];
      pos = tagStart + 1;
      continue;
    }

    const ComponentClass = getComponent(openTag.tagName);
    if (!ComponentClass) {
      // Not a registered component — pass through as-is
      result += html.slice(tagStart, openTag.end);
      pos = openTag.end;
      // If not self-closing, find and pass through the closing tag too
      if (!openTag.selfClosing) {
        const close = findClosingTag(html, openTag.end, openTag.tagName);
        result += html.slice(openTag.end, close.end);
        pos = close.end;
      }
      continue;
    }

    // Extract children (light DOM content between open and close tags)
    let children = '';
    let afterElement;
    if (openTag.selfClosing) {
      afterElement = openTag.end;
    }
    else {
      const close = findClosingTag(html, openTag.end, openTag.tagName);
      children = html.slice(openTag.end, close.start);
      afterElement = close.end;
    }

    // Skip elements that already have a DSD — Astro pre-renders child
    // components before passing them as slot content to parents
    if (children.trimStart().startsWith('<template shadowrootmode')) {
      result += html.slice(tagStart, afterElement);
      pos = afterElement;
      continue;
    }

    // Convert parsed attributes to a props object using the component's property types
    const attrs = deserializeAttrs(openTag.attrs, ComponentClass);

    const rendered = renderFn(ComponentClass, attrs, {
      slots: children ? { default: children } : null,
      depth: depth + 1,
    });

    result += rendered;
    pos = afterElement;
  }

  return result;
}

/*
  Find the start position of the next custom element tag (contains a hyphen).
  Skips HTML comments and non-custom-element tags.
*/
function findNextCustomElement(html, start) {
  let pos = start;
  while (pos < html.length) {
    const idx = html.indexOf('<', pos);
    if (idx === -1) { return -1; }

    // Skip comments
    if (html.startsWith('<!--', idx)) {
      const end = html.indexOf('-->', idx + 4);
      pos = end === -1 ? html.length : end + 3;
      continue;
    }

    // Skip closing tags
    if (html[idx + 1] === '/') {
      pos = idx + 2;
      continue;
    }

    // Try to read a tag name
    const nameMatch = html.slice(idx + 1).match(/^([a-z][a-z0-9]*-[a-z0-9-]*)/);
    if (nameMatch) {
      return idx;
    }

    pos = idx + 1;
  }
  return -1;
}

/*
  Parse an opening tag starting at `pos`.
  Returns { tagName, attrs: { key: value }, end, selfClosing } or null.
*/
function parseOpenTag(html, pos) {
  // Read tag name
  const nameMatch = html.slice(pos + 1).match(/^([a-z][a-z0-9]*-[a-z0-9-]*)/);
  if (!nameMatch) { return null; }

  const tagName = nameMatch[1];
  let i = pos + 1 + tagName.length;
  const attrs = {};

  // Parse attributes until we hit > or />
  while (i < html.length) {
    // Skip whitespace
    while (i < html.length && /\s/.test(html[i])) { i++; }

    // End of tag?
    if (html[i] === '>') {
      return { tagName, attrs, end: i + 1, selfClosing: false };
    }
    if (html[i] === '/' && html[i + 1] === '>') {
      return { tagName, attrs, end: i + 2, selfClosing: true };
    }

    // Read attribute name
    const attrStart = i;
    while (i < html.length && !/[\s=/>]/.test(html[i])) { i++; }
    const attrName = html.slice(attrStart, i);
    if (!attrName) { break; }

    // Skip whitespace
    while (i < html.length && /\s/.test(html[i])) { i++; }

    // No value — boolean attribute
    if (html[i] !== '=') {
      attrs[attrName] = true;
      continue;
    }

    // Skip '='
    i++;
    while (i < html.length && /\s/.test(html[i])) { i++; }

    // Read value
    const quote = html[i];
    if (quote === '"' || quote === "'") {
      i++; // skip opening quote
      const valueStart = i;
      while (i < html.length && html[i] !== quote) { i++; }
      attrs[attrName] = unescapeAttr(html.slice(valueStart, i));
      i++; // skip closing quote
    }
    else {
      // Unquoted value
      const valueStart = i;
      while (i < html.length && !/[\s>]/.test(html[i])) { i++; }
      attrs[attrName] = unescapeAttr(html.slice(valueStart, i));
    }
  }

  return null; // Reached end of string without closing >
}

/*
  Find the matching closing tag, handling nested elements of the same tag name.
  Returns { start, end } where start is the '<' of </tagName> and end is after '>'.
*/
function findClosingTag(html, start, tagName) {
  let depth = 1;
  let pos = start;
  const openPattern = `<${tagName}`;
  const closePattern = `</${tagName}`;

  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf(openPattern, pos);
    const nextClose = html.indexOf(closePattern, pos);

    if (nextClose === -1) {
      // No closing tag found — treat rest of string as content
      return { start: html.length, end: html.length };
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Check it's actually a tag open (not just a substring match)
      const charAfter = html[nextOpen + openPattern.length];
      if (charAfter && /[\s/>]/.test(charAfter)) {
        depth++;
      }
      pos = nextOpen + openPattern.length;
    }
    else {
      // Check it's actually a tag close
      const charAfter = html[nextClose + closePattern.length];
      if (charAfter && /[\s>]/.test(charAfter)) {
        depth--;
        if (depth === 0) {
          const closeEnd = html.indexOf('>', nextClose) + 1;
          return { start: nextClose, end: closeEnd || html.length };
        }
      }
      pos = nextClose + closePattern.length;
    }
  }

  return { start: html.length, end: html.length };
}

/*
  Convert parsed attribute strings to typed values using the component's
  property definitions.
*/
function deserializeAttrs(rawAttrs, ComponentClass) {
  const resolvedProperties = ComponentClass.config?.resolvedProperties || ComponentClass.properties || {};
  const attrs = {};

  for (const [attrName, rawValue] of Object.entries(rawAttrs)) {
    // Convert kebab attribute names to camelCase property names
    const propName = attrName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    const propConfig = resolvedProperties[propName] || resolvedProperties[attrName];

    // Use fromAttribute converter if available
    if (propConfig?.converter?.fromAttribute && typeof rawValue === 'string') {
      attrs[propName] = propConfig.converter.fromAttribute(rawValue);
    }
    else {
      attrs[propName] = rawValue;
    }
  }

  // Resolve option attributes (e.g. tiny → size="tiny")
  resolveAttributeAliases(attrs, ComponentClass.config?.componentSpec);

  return attrs;
}

/*
  Unescape HTML attribute entities.
*/
function unescapeAttr(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}
