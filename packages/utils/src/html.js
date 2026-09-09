import { each } from './loops.js';
import { isArray, isObject, isString } from './types.js';

/*-------------------
        HTML
--------------------*/

// the spec's two element sets, held once here for every scanner in the framework
export const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export const rawTextElements = new Set([
  'script',
  'style',
  'textarea',
  'title',
  'xmp',
  'iframe',
  'noembed',
  'noframes',
  'plaintext',
]);

export const indentLines = (text, spaces = 2) => {
  if (!isString(text)) {
    return '';
  }
  const indent = ' '.repeat(spaces);
  return text.split('\n').map(line => `${indent}${line}`).join('\n');
};

const OPENING_TAG_RE = /<(\w+)/;

export const indentHTML = (html, options = {}) => {
  const {
    indent = '  ',
    startLevel = 0,
    trimEmptyLines = true,
  } = options;

  if (!isString(html)) {
    return '';
  }

  let depth = startLevel;
  const lines = html
    .split('\n')
    .map(line => line.trim())
    .filter(line => !trimEmptyLines || line.length > 0);

  return lines
    .map(line => {
      // Handle closing tags - decrease depth before indenting
      if (line.startsWith('</')) {
        depth = Math.max(0, depth - 1);
      }

      const indented = indent.repeat(depth) + line;

      // Handle opening tags - increase depth after indenting
      if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('<!--')) {
        const isSelfClosing = line.endsWith('/>');
        const tagMatch = line.match(OPENING_TAG_RE);
        const tag = tagMatch?.[1];
        const isVoid = tag && voidElements.has(tag);
        const hasClosingTag = tag && line.includes(`</${tag}>`);

        if (!isSelfClosing && !isVoid && !hasClosingTag) {
          depth++;
        }
      }

      return indented;
    })
    .join('\n');
};

/*-------------------
       Parsing
--------------------*/

/*
  markup read as written into plain nodes with source spans: names, attributes, quotes and
  entities untouched, no browser recovery, never a throw, and no byte dropped. a tag the source
  leaves unterminated stays text, a close tag with no open element stays text
*/

// the scanner is an index loop over the text, one visit per character, with text runs and
// quoted values skipped by indexOf
const TAB = 9,
  NEWLINE = 10,
  FORM_FEED = 12,
  RETURN = 13,
  SPACE = 32,
  BANG = 33,
  QUOTE = 34,
  APOS = 39,
  DASH = 45,
  SLASH = 47,
  EQUALS = 61,
  GREATER = 62,
  QUESTION = 63,
  UPPER_A = 65,
  UPPER_Z = 90,
  LOWER_A = 97,
  LOWER_Z = 122;

// vertical tab is not html whitespace, the usual 9..13 range gets that wrong
const isSpace = (code) => code === SPACE || code === NEWLINE || code === TAB || code === RETURN || code === FORM_FEED;
const isLetter = (code) => (code >= LOWER_A && code <= LOWER_Z) || (code >= UPPER_A && code <= UPPER_Z);
const endsName = (code) => isSpace(code) || code === GREATER || code === SLASH;
// a quote never ends a name, the spec keeps it as a name character
const endsAttributeName = (code) => endsName(code) || code === EQUALS;

const DOCTYPE = 'doctype';
const isDoctypeAt = (html, position) => {
  for (let index = 0; index < DOCTYPE.length; index++) {
    if ((html.charCodeAt(position + index) | 32) !== DOCTYPE.charCodeAt(index)) { return false; }
  }
  return true;
};

// the close tag of a raw text element, matched without case, or -1 when the content runs out
const findRawTextClose = (html, from, name) => {
  const width = name.length;
  let position = from;
  while ((position = html.indexOf('</', position)) !== -1) {
    let same = 0;
    while (same < width && (html.charCodeAt(position + 2 + same) | 32) === name.charCodeAt(same)) { same++; }
    if (same === width && endsName(html.charCodeAt(position + 2 + width))) { return position; }
    position += 2;
  }
  return -1;
};

// the attributes and the end of an open tag, read from just after its name, null when the
// source runs out before the tag closes
const openTagFrom = (html, position) => {
  const length = html.length;
  const attributes = [];
  while (position < length) {
    const code = html.charCodeAt(position);
    if (isSpace(code)) {
      position++;
      continue;
    }
    if (code === GREATER) { return { attributes, end: position + 1, selfClosing: false }; }
    if (code === SLASH && html.charCodeAt(position + 1) === GREATER) {
      return { attributes, end: position + 2, selfClosing: true };
    }
    // a stray slash is the one byte the spec drops inside a tag
    if (code === SLASH) {
      position++;
      continue;
    }
    // whatever else stands here starts the name, an = or a quote included
    const nameStart = position++;
    while (position < length && !endsAttributeName(html.charCodeAt(position))) { position++; }
    const name = html.slice(nameStart, position);
    let scan = position;
    while (scan < length && isSpace(html.charCodeAt(scan))) { scan++; }
    if (html.charCodeAt(scan) !== EQUALS) {
      attributes.push({ name, value: null, quote: '' });
      continue;
    }
    scan++;
    while (scan < length && isSpace(html.charCodeAt(scan))) { scan++; }
    const opener = html.charCodeAt(scan);
    if (opener === QUOTE || opener === APOS) {
      const quote = opener === QUOTE ? '"' : "'";
      const close = html.indexOf(quote, scan + 1);
      attributes.push({ name, value: html.slice(scan + 1, close === -1 ? length : close), quote });
      position = close === -1 ? length : close + 1;
    }
    else {
      const valueStart = scan;
      while (scan < length && !isSpace(html.charCodeAt(scan)) && html.charCodeAt(scan) !== GREATER) { scan++; }
      attributes.push({ name, value: html.slice(valueStart, scan), quote: '' });
      position = scan;
    }
  }
  return null;
};

export const parseHTML = (html, { closeOnSlash = true } = {}) => {
  if (!isString(html)) { return []; }
  const length = html.length;
  const root = [];
  const stack = [];
  let siblings = root;
  let cursor = 0;
  let textStart = 0;

  const flushText = (to) => {
    if (to > textStart) {
      siblings.push({
        type: 'text',
        value: html.slice(textStart, to),
        start: textStart,
        end: to,
      });
    }
  };

  while (cursor < length) {
    const tagStart = html.indexOf('<', cursor);
    if (tagStart === -1) { break; }
    const lead = html.charCodeAt(tagStart + 1);

    if (lead === BANG || lead === QUESTION) {
      if (lead === BANG && html.charCodeAt(tagStart + 2) === DASH && html.charCodeAt(tagStart + 3) === DASH) {
        // from the dashes themselves, so <!--> and <!---> read as the empty comments the spec makes them
        const close = html.indexOf('-->', tagStart + 2);
        const end = close === -1 ? length : close + 3;
        flushText(tagStart);
        siblings.push({
          type: 'comment',
          value: html.slice(tagStart + 4, close === -1 ? length : close),
          start: tagStart,
          end,
        });
        cursor = textStart = end;
      }
      else if (lead === BANG && isDoctypeAt(html, tagStart + 2)) {
        const close = html.indexOf('>', tagStart + 2);
        const end = close === -1 ? length : close + 1;
        flushText(tagStart);
        siblings.push({
          type: 'doctype',
          value: html.slice(tagStart + 2, close === -1 ? length : close),
          start: tagStart,
          end,
        });
        cursor = textStart = end;
      }
      else {
        // cdata and processing instructions are not html, their bytes stay in the text run
        const close = html.indexOf('>', tagStart + 2);
        cursor = close === -1 ? length : close + 1;
      }
      continue;
    }

    if (lead === SLASH) {
      let position = tagStart + 2;
      let depth = -1;
      if (isLetter(html.charCodeAt(position))) {
        while (position < length && !endsName(html.charCodeAt(position))) { position++; }
        const lowerName = html.slice(tagStart + 2, position).toLowerCase();
        depth = stack.length - 1;
        while (depth >= 0 && stack[depth].lowerName !== lowerName) { depth--; }
      }
      const close = html.indexOf('>', position);
      if (depth < 0 || close === -1) {
        cursor = close === -1 ? length : close + 1;
        continue;
      }
      flushText(tagStart);
      for (let index = stack.length - 1; index > depth; index--) {
        stack[index].node.innerEnd = stack[index].node.end = tagStart;
      }
      const node = stack[depth].node;
      node.innerEnd = tagStart;
      node.end = close + 1;
      stack.length = depth;
      siblings = depth === 0 ? root : stack[depth - 1].node.children;
      cursor = textStart = close + 1;
      continue;
    }

    if (!isLetter(lead)) {
      cursor = tagStart + 1;
      continue;
    }

    let position = tagStart + 1;
    while (position < length && !endsName(html.charCodeAt(position))) { position++; }
    const name = html.slice(tagStart + 1, position);
    const tag = openTagFrom(html, position);
    if (tag === null) { break; }

    const lowerName = name.toLowerCase();
    // every field set at construction so all elements share one shape
    const node = {
      type: 'element',
      name,
      attributes: tag.attributes,
      children: [],
      selfClosing: tag.selfClosing,
      start: tagStart,
      end: tag.end,
      innerStart: tag.end,
      innerEnd: tag.end,
    };
    flushText(tagStart);
    siblings.push(node);
    cursor = textStart = tag.end;
    // browsers ignore /> on a non-void element, template and svg authors mean it
    if (voidElements.has(lowerName) || (tag.selfClosing && closeOnSlash)) { continue; }

    if (rawTextElements.has(lowerName)) {
      const close = lowerName === 'plaintext' ? -1 : findRawTextClose(html, tag.end, lowerName);
      const closeEnd = close === -1 ? -1 : html.indexOf('>', close + 2);
      const innerEnd = closeEnd === -1 ? length : close;
      if (innerEnd > tag.end) {
        node.children.push({ type: 'text', value: html.slice(tag.end, innerEnd), start: tag.end, end: innerEnd });
      }
      node.innerEnd = innerEnd;
      node.end = closeEnd === -1 ? length : closeEnd + 1;
      cursor = textStart = node.end;
      continue;
    }

    stack.push({ node, lowerName });
    siblings = node.children;
  }

  flushText(length);
  each(stack, ({ node }) => {
    node.innerEnd = node.end = length;
  });
  return root;
};

export const stringifyHTML = (nodes) => {
  const list = isArray(nodes) ? nodes : isObject(nodes) ? [nodes] : [];
  let html = '';
  each(list, (node) => {
    if (!isObject(node)) { return; }
    if (node.type === 'text') {
      html += node.value;
      return;
    }
    if (node.type === 'comment') {
      html += `<!--${node.value}-->`;
      return;
    }
    if (node.type === 'doctype') {
      html += `<!${node.value}>`;
      return;
    }
    if (node.type !== 'element') { return; }
    html += `<${node.name}`;
    each(node.attributes, ({ name, value, quote = '' }) => {
      html += value == null ? ` ${name}` : ` ${name}=${quote}${value}${quote}`;
    });
    const children = isArray(node.children) ? node.children : [];
    if (node.selfClosing && children.length === 0) {
      html += ' />';
      return;
    }
    html += '>';
    if (children.length) { html += stringifyHTML(children); }
    // the source close tag is not kept, so it is respelled from the open tag
    if (!voidElements.has(node.name.toLowerCase())) { html += `</${node.name}>`; }
  });
  return html;
};
