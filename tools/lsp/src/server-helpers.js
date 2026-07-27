/*
  Pure helper functions extracted from server.js for testability.
  These are the core logic for context detection, word extraction,
  and documentation formatting — no LSP connection dependencies.
*/

import { getBlock, getSectionKeywords, hasClosingTag } from './block-registry.js';

const blockJoiners = {
  each: ['in', 'as'],
  async: ['as'],
};

// {#name} and {/name} in either bracket syntax, {{#each}} matches on its inner brace
const blockTagPattern = /\{\s*(#|\/)(\w+)/g;

// Leading keyword of a tag: optional # or / marker, then the keyword itself
const tagKeywordPattern = /^(\s*)([#/]?)(else\s+if|[A-Za-z]\w*)/;

// A name followed directly by ( is a JS call, so its arguments split on commas
const callNamePattern = /^[A-Za-z_$][\w$]*$/;

// A bare operator token means the tag holds a JS expression rather than a
// Lisp call, the same split ExpressionEvaluator makes when it classifies one
const operatorTokenPattern = /^[+\-*/%=<>!&|?:~^]+$/;

/*
  Determines what kind of completion context the cursor is in.
*/
export function getCompletionContext(text, offset) {
  let braceDepth = 0;
  let j = offset - 1;
  while (j >= 0) {
    if (text[j] === '}') { braceDepth++; }
    if (text[j] === '{') {
      braceDepth--;
      if (braceDepth < 0) {
        // We're inside a { } expression
        const afterBrace = text.substring(j + 1, offset).trimStart();

        if (afterBrace.startsWith('#')) {
          // {# or {#partial → show block names
          // {#if condition → past the keyword, show expressions
          const blockMatch = afterBrace.match(/^#(\w*)/);
          const keyword = blockMatch?.[1] || '';
          const afterKeyword = afterBrace.substring(1 + keyword.length);
          if (!afterKeyword.match(/\s/)) {
            // Still typing the keyword: {# or {#if (no space yet)
            return { type: 'block' };
          }
          // Past the keyword — check for block-specific joining keywords
          const blockPrefix = afterKeyword.match(/(\w*)$/)?.[1] || '';
          const joiners = blockJoiners[keyword];
          if (joiners) {
            const args = afterKeyword.trimStart();
            // Check if a joiner keyword has already been typed
            const hasJoiner = joiners.some(j => new RegExp(`\\b${j}\\b`).test(args));
            if (!hasJoiner) {
              // {#each item | or {#each item, i | → suggest joiners
              // But not right after comma: {#each item,| → naming index variable
              const endsWithComma = /,\s*$/.test(args.substring(0, args.length - blockPrefix.length));
              if (!endsWithComma) {
                const tokens = args.split(/[\s,]+/).filter(Boolean);
                if (tokens.length >= 1) {
                  return { type: 'block-joiner', keyword, joiners, prefix: blockPrefix };
                }
              }
            }
          }
          return { type: 'expression', prefix: blockPrefix };
        }
        if (afterBrace.startsWith('>')) {
          const refMatch = afterBrace.match(/^>\s*(\w*)/);
          const refName = refMatch?.[1] || '';
          const afterRef = afterBrace.substring(1 + (refMatch?.[0].length - 1 || 0));
          if (!afterRef.match(/\s/)) {
            // Still typing the name: {> or {>slo
            return { type: 'reference' };
          }
          // Past the name — context depends on what was referenced
          if (refName === 'slot') {
            // {>slot name} — no key=value syntax, just an optional slot name
            return { type: 'none' };
          }
          // {>templateName key=value} or {>template name='x'}
          const refPrefix = afterRef.match(/(\w*)$/)?.[1] || '';
          return { type: 'expression', prefix: refPrefix };
        }
        // Extract the current word being typed for filtering
        const prefix = afterBrace.match(/(\w*)$/)?.[1] || '';
        const context = { type: 'expression', prefix };
        // A bare word at the start of a tag can still be a section keyword
        // ({is}, {loading}) when the enclosing block accepts one
        if (afterBrace === prefix) {
          const sections = getSectionKeywords(getOpenBlocks(text, j).at(-1));
          if (sections.length) { context.sections = sections; }
        }
        return context;
      }
    }
    j--;
  }

  // Check if inside an HTML tag
  const beforeCursor = text.substring(Math.max(0, offset - 200), offset);

  // @event binding
  if (beforeCursor.match(/@\w*$/)) {
    return { type: 'event-binding' };
  }

  // Inside an attribute value: <ui-button size="|
  const attrValueMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*?([\w-]+)\s*=\s*["']([^"']*)$/);
  if (attrValueMatch) {
    return {
      type: 'attribute-value',
      tagName: attrValueMatch[1],
      attributeName: attrValueMatch[2],
    };
  }

  // Inside a tag but not in an attribute value: <ui-button |
  const tagMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*$/);
  if (tagMatch) {
    return { type: 'html-attribute', tagName: tagMatch[1] };
  }

  // After <: tag name completion
  if (beforeCursor.match(/<[\w-]*$/)) {
    return { type: 'html-tag' };
  }

  return { type: 'none' };
}

/*
  Block tags open at an offset, outermost first. A pragmatic scan that counts
  open and close tags rather than parsing, which is enough to tell whether the
  cursor sits inside a {#match} or {#async} body.
*/
export function getOpenBlocks(text, offset) {
  const stack = [];
  blockTagPattern.lastIndex = 0;
  let match;
  while ((match = blockTagPattern.exec(text)) !== null) {
    if (match.index >= offset) { break; }
    const [, marker, name] = match;
    if (marker === '#') {
      if (hasClosingTag(name)) { stack.push(name); }
      continue;
    }
    const opened = stack.lastIndexOf(name);
    if (opened !== -1) { stack.length = opened; }
  }
  return stack;
}

/*
  Block-scope variables visible at an offset: each aliases, async resolved
  values, and error bindings. The values are unknowable statically, but what
  each name corresponds to is not, so completions and hover surface that
  provenance. An inner binding wins a name, matching how the renderer layers
  data contexts.
*/
export function getScopeVariables(text, offset) {
  const frames = [];
  blockTagPattern.lastIndex = 0;
  let match;
  while ((match = blockTagPattern.exec(text)) !== null) {
    if (match.index >= offset) { break; }
    const [, marker, name] = match;
    if (marker === '#') {
      if (hasClosingTag(name)) {
        frames.push({ name, start: match.index, content: readTagContent(text, blockTagPattern.lastIndex) });
      }
      continue;
    }
    const opened = frames.map(frame => frame.name).lastIndexOf(name);
    if (opened !== -1) { frames.length = opened; }
  }

  const variables = new Map();
  const add = (name, description, tag) => {
    if (name && /^[A-Za-z_$][\w$]*$/.test(name)) {
      variables.set(name, { name, description, tag });
    }
  };

  const lastAsync = frames.findLast?.(frame => frame.name === 'async')
    ?? [...frames].reverse().find(frame => frame.name === 'async');

  for (const frame of frames) {
    const tag = `{#${frame.name} ${frame.content.trim()}}`;
    if (frame.name === 'each') {
      const { as, indexAs, over } = parseIteratorBinding(frame.content);
      // an aliasless each spreads the item into context and binds it as `this`
      add(as || 'this', `current item of \`${over}\``, tag);
      if (indexAs) {
        add(indexAs, `index (or key) of \`${over}\``, tag);
      }
      else {
        // getEachData names the implicit binding index for arrays, key for objects
        add('index', `index in \`${over}\` (implicit for arrays)`, tag);
        add('key', `key in \`${over}\` (implicit for objects)`, tag);
      }
    }
    if (frame.name === 'async') {
      const { expression, names, rest } = parseAsyncBinding(frame.content);
      const destructured = names.length > 1 || rest;
      for (const name of names) {
        add(
          name,
          destructured
            ? `destructured from the resolved value of \`${expression}\``
            : `resolved value of \`${expression}\``,
          tag,
        );
      }
      add(rest, `remaining properties of the resolved value of \`${expression}\``, tag);
      // section bindings apply to the innermost async only
      if (frame === lastAsync) {
        const section = lastSectionBinding(text, frame.start, offset);
        if (section) {
          add(section.binding, `error thrown by \`${expression}\``, `{${section.keyword} as ${section.binding}}`);
        }
      }
    }
  }
  return [...variables.values()];
}

/* mirrors TemplateCompiler.parseIteratorString: item[, index] in over / over as item[, index] */
function parseIteratorBinding(content) {
  const inParts = content.split(' in ');
  const asParts = content.split(' as ');
  let bindings;
  let over;
  if (inParts.length > 1) {
    over = inParts.slice(1).join(' in ').trim();
    bindings = inParts[0];
  }
  else if (asParts.length > 1) {
    over = asParts[0].trim();
    bindings = asParts.slice(1).join(' as ');
  }
  else {
    return { over: content.trim() };
  }
  const [as, indexAs] = bindings.split(',').map(part => part.trim());
  return { as, indexAs, over };
}

/* mirrors TemplateCompiler.parseAsyncString: expr as name / expr as {a, b, ...rest} */
function parseAsyncBinding(content) {
  const asParts = content.split(' as ');
  const expression = asParts[0].trim();
  if (asParts.length < 2) { return { expression, names: [], rest: null }; }
  const target = asParts.slice(1).join(' as ').trim();
  if (!target.startsWith('{')) { return { expression, names: [target], rest: null }; }
  const names = [];
  let rest = null;
  for (const part of target.replace(/^\{|\}$/g, '').split(',').map(p => p.trim()).filter(Boolean)) {
    if (part.startsWith('...')) { rest = part.slice(3).trim(); }
    else { names.push(part); }
  }
  return { expression, names, rest };
}

/* the async section the offset sits in, when it binds an error alias */
function lastSectionBinding(text, from, offset) {
  const sectionPattern = /\{\s*(before|loading|error|catch)\b([^}]*)\}/g;
  const body = text.substring(from, offset);
  let match;
  let last = null;
  while ((match = sectionPattern.exec(body)) !== null) {
    last = match;
  }
  if (!last || (last[1] !== 'error' && last[1] !== 'catch')) { return null; }
  const binding = last[2].match(/\bas\s+([A-Za-z_$][\w$]*)/)?.[1];
  return binding ? { keyword: last[1], binding } : null;
}

/* tag content from just past the keyword to its balanced closing brace */
function readTagContent(text, from) {
  let depth = 1;
  for (let i = from; i < text.length; i++) {
    if (text[i] === '{') { depth++; }
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) { return text.substring(from, i); }
    }
  }
  return text.substring(from);
}

/*
  The block keyword an offset lands on, with the tag as written so hover can
  echo it back. Section keywords only resolve inside a parent that accepts
  them, which keeps {is a b} the equality helper everywhere outside {#match}.
*/
export function getBlockKeywordAtOffset(text, offset) {
  const start = text.lastIndexOf('{', offset);
  if (start === -1 || text.substring(start + 1, offset).includes('}')) { return null; }

  const match = text.substring(start + 1).match(tagKeywordPattern);
  if (!match) { return null; }
  const [, leading, marker, name] = match;

  const keywordStart = start + 1 + leading.length;
  if (offset < keywordStart || offset > keywordStart + marker.length + name.length) { return null; }

  const block = getBlock(name);
  if (!block) { return null; }

  if (marker) {
    return block.type === 'block' ? { name, tag: `{${marker}${name}}` } : null;
  }
  if (block.type !== 'section') { return null; }
  return block.parents.includes(getOpenBlocks(text, start).at(-1)) ? { name, tag: `{${name}}` } : null;
}

/*
  The innermost call an offset sits inside, with the index of the argument under
  the cursor. Lisp arguments separate on whitespace and a parenthesized call
  separates on commas, mirroring how ExpressionEvaluator tokenizes both forms.
  The name is returned unchecked — the caller decides whether it is a helper.
*/
export function getHelperCallAtOffset(text, offset) {
  const open = findExpressionStart(text, offset);
  if (open === -1) { return null; }

  let start = open + 1;
  const tag = text.substring(start, offset);
  // {>name key=value} carries settings rather than helper arguments
  if (tag.trimStart().startsWith('>')) { return null; }

  const match = tag.match(tagKeywordPattern);
  if (match) {
    const [, leading, marker, keyword] = match;
    if (marker === '/') { return null; }
    const block = getBlock(keyword);
    const isSection = block?.type === 'section' && block.parents.includes(getOpenBlocks(text, open).at(-1));
    // {#if hasAny items} and {else if hasAny items} still call a helper, so the
    // tag keyword is stepped over rather than read as the call
    if (marker === '#' || isSection) {
      start += leading.length + marker.length + keyword.length;
    }
  }

  const stack = [{ name: null, args: 0, commas: false, invalid: false }];
  let token = '';
  let quote = null;

  const endToken = () => {
    const frame = stack.at(-1);
    if (token && !frame.commas) {
      if (operatorTokenPattern.test(token)) { frame.invalid = true; }
      else if (frame.name === null) { frame.name = token; }
      else { frame.args++; }
    }
    token = '';
  };

  for (let i = start; i < offset; i++) {
    const char = text[i];
    if (quote) {
      token += char;
      if (char === quote) { quote = null; }
    }
    else if (char === "'" || char === '"') {
      quote = char;
      token += char;
    }
    else if (char === '(') {
      const name = callNamePattern.test(token) ? token : null;
      if (!name) { endToken(); }
      token = '';
      stack.push({ name, args: 0, commas: name !== null, invalid: false });
    }
    else if (char === ')') {
      endToken();
      if (stack.length > 1) {
        stack.pop();
        // a finished call counts as one completed argument of its parent, and
        // in head position it leaves nothing for the parent to be a call of
        const parent = stack.at(-1);
        if (!parent.commas) {
          if (parent.name === null) { parent.invalid = true; }
          else { parent.args++; }
        }
      }
    }
    else if (char === ',') {
      endToken();
      const frame = stack.at(-1);
      if (frame.commas) { frame.args++; }
    }
    else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      endToken();
    }
    else {
      token += char;
    }
  }

  const frame = stack.at(-1);
  if (!frame.name || frame.invalid) { return null; }
  return { name: frame.name, argIndex: frame.args };
}

// The unmatched { opening the expression an offset sits in
function findExpressionStart(text, offset) {
  let depth = 0;
  for (let i = offset - 1; i >= 0; i--) {
    if (text[i] === '}') { depth++; }
    else if (text[i] === '{') {
      if (depth === 0) { return i; }
      depth--;
    }
  }
  return -1;
}

export function getWordAtOffset(text, offset) {
  let start = offset;
  let end = offset;
  while (start > 0 && /[\w.]/.test(text[start - 1])) { start--; }
  while (end < text.length && /[\w.]/.test(text[end])) { end++; }
  const word = text.substring(start, end);
  // Strip dots from edges
  return word.replace(/^\.+|\.+$/g, '') || null;
}

/*
  The single path segment under the cursor: hovering fruit in {fruit.taste}
  yields fruit. Only a head segment can name a binding, helper, or field —
  anything after a dot is a property access on it.
*/
export function getIdentifierAtOffset(text, offset) {
  let start = offset;
  let end = offset;
  while (start > 0 && /[\w$]/.test(text[start - 1])) { start--; }
  while (end < text.length && /[\w$]/.test(text[end])) { end++; }
  if (start === end) { return null; }
  return { name: text.substring(start, end), head: text[start - 1] !== '.' };
}

export function formatAttributeDoc(attr, meta, spec) {
  let doc = '';
  if (meta.name) { doc += `**${meta.name}**\n\n`; }
  if (meta.description) { doc += `${meta.description}\n\n`; }
  const type = spec.propertyTypes[attr];
  if (type) { doc += `Type: \`${type}\`\n\n`; }
  const values = spec.allowedValues[attr];
  if (values?.length) { doc += `Values: ${values.map(v => `\`${v}\``).join(', ')}\n\n`; }
  if (meta.exampleCode) {
    const example = Array.isArray(meta.exampleCode) ? meta.exampleCode[0] : meta.exampleCode;
    doc += `\`\`\`html\n${example.trim()}\n\`\`\``;
  }
  return doc;
}
