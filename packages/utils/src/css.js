import { hashCode } from './crypto.js';
import { isServer } from './environment.js';
import { each } from './loops.js';
import { isArray, isPlainObject, isString } from './types.js';

/*-------------------
      CSS Prefixing
--------------------*/

/*
  Adds vendor prefixes to CSS properties that still require them in modern browsers.
  Only properties that need prefixes within a ~2yr support window are included.
  This list should shrink over time as browsers adopt unprefixed standards.
*/

const prefixRules = [
  // Still prefixed in Safari
  { prop: 'user-select', prefix: '-webkit-' },
  { prop: 'backdrop-filter', prefix: '-webkit-' },
  { prop: 'print-color-adjust', prefix: '-webkit-' },

  // Still prefixed in Firefox
  { prop: 'text-size-adjust', prefix: '-moz-' },
];

const prefixMap = {};
for (const rule of prefixRules) {
  prefixMap[rule.prop] = rule.prefix;
}

const propNames = prefixRules.map(r => r.prop.replace(/-/g, '\\-'));
const propPattern = new RegExp(`^(\\s*)(${propNames.join('|')})\\s*:(.*)$`);
const propQuickTest = new RegExp(`(${propNames.join('|')})\\s*:`);

export const prefixCSS = (css) => {
  if (!css) {
    return css;
  }
  // skip split/join when CSS has no prefixable properties
  if (!propQuickTest.test(css)) {
    return css;
  }
  const lines = css.split('\n');
  const result = [];
  for (const line of lines) {
    const match = line.match(propPattern);
    if (match) {
      const indent = match[1];
      const prop = match[2];
      const value = match[3];
      const prefix = prefixMap[prop];
      if (prefix && !line.trimStart().startsWith('-')) {
        result.push(`${indent}${prefix}${prop}:${value}`);
      }
    }
    result.push(line);
  }
  return result.join('\n');
};

/*-------------------
      CSS Parsing
--------------------*/

/*
  a stylesheet read into plain nodes with nesting as written. a rule holds its selectors and its
  children in source order, declarations and nested blocks alike. a block at-rule holds its name and
  prelude with the same children, a statement at-rule (@import, @layer a, b;) no body at all.
  what ends a head decides what it was: { opens a block, ; or } closes a declaration or a statement,
  so no at-rule name is special-cased. comments are dropped, nothing throws, and a sheet that stops
  parsing reads as far as it goes, the way a browser recovers
*/

const SPACE = 32,
  QUOTE = 34,
  HASH = 35,
  AMP = 38,
  APOS = 39,
  LPAREN = 40,
  RPAREN = 41,
  STAR = 42,
  COMMA = 44,
  DOT = 46,
  SLASH = 47,
  COLON = 58,
  SEMI = 59,
  AT = 64,
  LBRACKET = 91,
  BACKSLASH = 92,
  RBRACKET = 93,
  OPEN = 123,
  PIPE = 124,
  CLOSE = 125,
  NEWLINE = 10;

const IMPORTANT = /\s*!\s*important$/i;
const AT_NAME = /^@[-\w]*/;
const WHITESPACE = /\s+/g;

// keyframe selectors are offsets, never elements, so a keyframes block never sits under a selector
const isKeyframes = (name) => name.endsWith('keyframes');

// the scanners are index loops over the text, one visit per character

// past the string opened at index, or at its unescaped newline (the spec's bad-string), or end
const skipString = (text, index, end) => {
  const quote = text.charCodeAt(index++);
  while (index < end) {
    const code = text.charCodeAt(index++);
    if (code === quote) {
      return index;
    }
    if (code === BACKSLASH) {
      index++;
    }
    else if (code === NEWLINE) {
      return index - 1;
    }
  }
  return end;
};

const skipComment = (text, index, end) => {
  const close = text.indexOf('*/', index + 2);
  return close < 0 ? end : close + 2;
};

// the index of the bracket closing the one at index, strings skipped, end when it never closes
const closingIndex = (text, index, end, open, close) => {
  let depth = 0;
  while (index < end) {
    const code = text.charCodeAt(index);
    if (code === QUOTE || code === APOS) {
      index = skipString(text, index, end);
      continue;
    }
    if (code === open) {
      depth++;
    }
    else if (code === close && --depth === 0) {
      return index;
    }
    index++;
  }
  return end;
};

// whitespace runs outside strings become one space, a string keeps its own
const collapseSpace = (text) => {
  if (text.indexOf('"') < 0 && text.indexOf("'") < 0) {
    return text.replace(WHITESPACE, ' ');
  }
  const end = text.length;
  let collapsed = '';
  let start = 0;
  let index = 0;
  while (index < end) {
    const code = text.charCodeAt(index);
    if (code === QUOTE || code === APOS) {
      const close = skipString(text, index, end);
      collapsed += text.slice(start, index).replace(WHITESPACE, ' ') + text.slice(index, close);
      start = index = close;
    }
    else if (code === BACKSLASH) {
      index += 2;
    }
    else {
      index++;
    }
  }
  return collapsed + text.slice(start).replace(WHITESPACE, ' ');
};

const splitSelectors = (text) => {
  if (text.indexOf(',') < 0) {
    return text ? [text] : [];
  }
  const selectors = [];
  const end = text.length;
  let index = 0;
  let start = 0;
  let depth = 0;
  const push = (to) => {
    const selector = text.slice(start, to).trim();
    if (selector) {
      selectors.push(selector);
    }
  };
  while (index < end) {
    const code = text.charCodeAt(index);
    if (code === QUOTE || code === APOS) {
      index = skipString(text, index, end);
      continue;
    }
    if (code === BACKSLASH) {
      index += 2;
      continue;
    }
    if (code === LPAREN || code === LBRACKET) {
      depth++;
    }
    else if (code === RPAREN || code === RBRACKET) {
      depth = Math.max(depth - 1, 0);
    }
    else if (code === COMMA && depth === 0) {
      push(index);
      start = index + 1;
    }
    index++;
  }
  push(end);
  return selectors;
};

const atNode = (head, children) => {
  const [at] = AT_NAME.exec(head);
  const name = at.slice(1);
  const prelude = head.slice(at.length).trim();
  return children ? { type: 'at-rule', name, prelude, children } : { type: 'at-rule', name, prelude };
};

const declarationFrom = (head) => {
  const colon = head.indexOf(':');
  if (colon < 0) {
    return null;
  }
  let value = head.slice(colon + 1).trim();
  const bang = IMPORTANT.exec(value);
  if (bang) {
    value = value.slice(0, bang.index);
  }
  return { type: 'declaration', property: head.slice(0, colon).trim(), value, important: !!bang };
};

export const parseCSS = (css, { flatten = false } = {}) => {
  const nodes = [];
  if (!isString(css)) {
    return nodes;
  }
  const length = css.length;
  let index = 0;

  const skipSpace = () => {
    while (index < length) {
      const code = css.charCodeAt(index);
      if (code <= SPACE) {
        index++;
      }
      else if (code === SLASH && css.charCodeAt(index + 1) === STAR) {
        index = skipComment(css, index, length);
      }
      else {
        break;
      }
    }
  };

  // the text up to the next top-level { ; or } with comments cut out, the cursor left on that character
  const readHead = () => {
    let head = '';
    let start = index;
    let depth = 0;
    while (index < length) {
      const code = css.charCodeAt(index);
      if (code === QUOTE || code === APOS) {
        index = skipString(css, index, length);
      }
      else if (code === SLASH && css.charCodeAt(index + 1) === STAR) {
        head += css.slice(start, index);
        index = skipComment(css, index, length);
        // a comment is a token boundary, so one space keeps the tokens apart where none was written
        if (head.charCodeAt(head.length - 1) <= SPACE) {
          while (index < length && css.charCodeAt(index) <= SPACE) {
            index++;
          }
        }
        else if (head && index < length && css.charCodeAt(index) > SPACE) {
          head += ' ';
        }
        start = index;
      }
      else if (code === BACKSLASH) {
        index += 2;
      }
      else if (code === LPAREN) {
        depth++;
        index++;
      }
      else if (code === RPAREN) {
        depth = Math.max(depth - 1, 0);
        index++;
      }
      else if (depth === 0 && (code === OPEN || code === SEMI || code === CLOSE)) {
        break;
      }
      else {
        index++;
      }
    }
    return (head + css.slice(start, index)).trim();
  };

  // top marks the sheet's own level, where a bare declaration has no rule to belong to
  const parseBlock = (children, top = false) => {
    for (;;) {
      skipSpace();
      if (index >= length) {
        return;
      }
      if (css.charCodeAt(index) === CLOSE) {
        index++;
        return;
      }
      const head = readHead();
      const terminator = index < length ? css.charCodeAt(index++) : CLOSE;
      const isAt = head.charCodeAt(0) === AT;
      if (terminator === OPEN) {
        const text = collapseSpace(head);
        const node = isAt ? atNode(text, []) : { type: 'rule', selectors: splitSelectors(text), children: [] };
        parseBlock(node.children);
        children.push(node);
      }
      else {
        if (isAt) {
          children.push(atNode(collapseSpace(head)));
        }
        else if (!top) {
          const declaration = declarationFrom(head);
          if (declaration) {
            children.push(declaration);
          }
        }
        if (terminator === CLOSE) {
          return;
        }
      }
    }
  };

  // a stray } at the top level ends one pass and the next resumes after it, one typo costs one brace
  while (index < length) {
    parseBlock(nodes, true);
  }
  return flatten ? flattenNodes(nodes) : nodes;
};

/*
  nesting flattened the way a preprocessor writes it: & becomes the parent, a selector without & a
  descendant, a list times a list, an at-rule inside a rule lifts out with the rule rebuilt inside it.
  every node is new and every rule keeps its declarations and their written order
*/

// the child split at every & outside a string, null when it has none. an escaped \& is a literal
const segmentsAtAmpersands = (selector) => {
  const end = selector.length;
  let segments = null;
  let start = 0;
  let index = 0;
  while (index < end) {
    const code = selector.charCodeAt(index);
    if (code === QUOTE || code === APOS) {
      index = skipString(selector, index, end);
    }
    else if (code === BACKSLASH) {
      index += 2;
    }
    else {
      if (code === AMP) {
        (segments ??= []).push(selector.slice(start, index));
        start = index + 1;
      }
      index++;
    }
  }
  if (segments) {
    segments.push(selector.slice(start));
  }
  return segments;
};

// a parent list times a child list, parent-major. every & in a child takes each parent in turn, so
// `& + &` under `.a, .b` multiplies out to four, the way :is() and a preprocessor read it
const combineSelectors = (parents, children) => {
  const selectors = [];
  const segments = children.map(segmentsAtAmpersands);
  each(parents, (parent) => {
    each(children, (child, at) => {
      const parts = segments[at];
      if (!parts) {
        selectors.push(`${parent} ${child}`);
        return;
      }
      let combos = [parts[0] + parent + parts[1]];
      for (let next = 2; next < parts.length; next++) {
        const grown = [];
        each(combos, (prefix) => {
          each(parents, (other) => {
            grown.push(prefix + other + parts[next]);
          });
        });
        combos = grown;
      }
      selectors.push(...combos);
    });
  });
  return selectors;
};

// parents is the enclosing rule's selector list, null at the top and inside a top-level at-rule
const flattenNodes = (nodes, parents = null, flat = []) => {
  let run = null;
  // each run of declarations between nested blocks is one rule for the parent, in the order written
  const flush = () => {
    if (run) {
      flat.push({ type: 'rule', selectors: parents.slice(), children: run });
      run = null;
    }
  };
  each(nodes, (node) => {
    if (node.type === 'declaration') {
      if (parents) {
        (run ??= []).push({ ...node });
      }
      else {
        flat.push({ ...node });
      }
    }
    else if (node.type === 'rule') {
      flush();
      const selectors = parents ? combineSelectors(parents, node.selectors) : node.selectors.slice();
      if (node.children.length === 0) {
        flat.push({ type: 'rule', selectors, children: [] });
      }
      else {
        flattenNodes(node.children, selectors, flat);
      }
    }
    else {
      flush();
      const inside = isKeyframes(node.name) ? null : parents;
      flat.push(node.children ? { ...node, children: flattenNodes(node.children, inside) } : { ...node });
    }
  });
  flush();
  return flat;
};

export const stringifyCSS = (nodes, { indent = '  ' } = {}) => {
  const lines = [];
  const write = (list, pad) => {
    each(list, (node) => {
      if (!isPlainObject(node)) {
        return;
      }
      if (node.type === 'declaration') {
        lines.push(`${pad}${node.property}: ${node.value}${node.important ? ' !important' : ''};`);
        return;
      }
      const head = node.type === 'rule'
        ? node.selectors.join(', ')
        : node.prelude
        ? `@${node.name} ${node.prelude}`
        : `@${node.name}`;
      if (node.type === 'at-rule' && !node.children) {
        lines.push(`${pad}${head};`);
        return;
      }
      lines.push(`${pad}${head} {`);
      write(node.children, pad + indent);
      lines.push(`${pad}}`);
    });
  };
  if (isArray(nodes)) {
    write(nodes, '');
  }
  return lines.join('\n');
};

/*
  Selectors Level 4 specificity as [ids, classes, elements]. a comma inside the walked range keeps the
  more specific side, so one walk serves a whole selector and the argument list of :is() :not() :has()
*/

const AS_ARGUMENT = new Set(['is', 'not', 'has', 'matches']);
const LEGACY_PSEUDO_ELEMENTS = new Set(['before', 'after', 'first-line', 'first-letter']);
const NTH_OF = /^\s*(?:[-+\d\sn]+|even|odd)\s+of\s+/i;

const isIdentCode = (code) =>
  code >= 128 || code === 45 || code === 95 || (code >= 48 && code <= 57) || (code >= 65 && code <= 90)
  || (code >= 97 && code <= 122);

const identEnd = (text, index, end) => {
  while (index < end) {
    const code = text.charCodeAt(index);
    if (code === BACKSLASH) {
      index += 2;
    }
    else if (isIdentCode(code)) {
      index++;
    }
    else {
      break;
    }
  }
  return index;
};

const moreSpecific = (left, right) => (left[0] - right[0] || left[1] - right[1] || left[2] - right[2]) > 0;

const specificityOf = (text, index, end) => {
  let ids = 0;
  let classes = 0;
  let elements = 0;
  let best = null;
  const add = (from, to) => {
    const [moreIds, moreClasses, moreElements] = specificityOf(text, from, to);
    ids += moreIds;
    classes += moreClasses;
    elements += moreElements;
  };
  while (index < end) {
    const code = text.charCodeAt(index);
    if (code === HASH) {
      ids++;
      index = identEnd(text, index + 1, end);
    }
    else if (code === DOT) {
      classes++;
      index = identEnd(text, index + 1, end);
    }
    else if (code === LBRACKET) {
      classes++;
      index = closingIndex(text, index, end, LBRACKET, RBRACKET) + 1;
    }
    else if (code === COLON) {
      const element = text.charCodeAt(index + 1) === COLON;
      const nameStart = element ? index + 2 : index + 1;
      index = identEnd(text, nameStart, end);
      const name = text.slice(nameStart, index).toLowerCase();
      let argStart = 0;
      let argEnd = 0;
      if (text.charCodeAt(index) === LPAREN) {
        argStart = index + 1;
        argEnd = closingIndex(text, index, end, LPAREN, RPAREN);
        index = argEnd + 1;
      }
      if (element) {
        elements++;
        if (name === 'slotted' && argStart) {
          add(argStart, argEnd);
        }
      }
      else if (AS_ARGUMENT.has(name)) {
        if (argStart) {
          add(argStart, argEnd);
        }
      }
      else if (LEGACY_PSEUDO_ELEMENTS.has(name)) {
        elements++;
      }
      else if (name !== 'where') {
        classes++;
        if (argStart && (name === 'host' || name === 'host-context')) {
          add(argStart, argEnd);
        }
        else if (argStart && (name === 'nth-child' || name === 'nth-last-child')) {
          const of = NTH_OF.exec(text.slice(argStart, argEnd));
          if (of) {
            add(argStart + of[0].length, argEnd);
          }
        }
      }
    }
    else if (code === COMMA) {
      if (!best || moreSpecific([ids, classes, elements], best)) {
        best = [ids, classes, elements];
      }
      ids = classes = elements = 0;
      index++;
    }
    else if (code === QUOTE || code === APOS) {
      index = skipString(text, index, end);
    }
    else if (code === LPAREN) {
      index = closingIndex(text, index, end, LPAREN, RPAREN) + 1;
    }
    else if (isIdentCode(code) || code === BACKSLASH) {
      const next = identEnd(text, index, end);
      // a namespace prefix (svg|circle) names nothing
      if (text.charCodeAt(next) !== PIPE) {
        elements++;
      }
      index = next;
    }
    else {
      index++;
    }
  }
  const last = [ids, classes, elements];
  return best && !moreSpecific(last, best) ? best : last;
};

export const selectorSpecificity = (selector) =>
  isString(selector) ? specificityOf(selector, 0, selector.length) : [0, 0, 0];

/*-------------------
         CSS
--------------------*/

export const adoptStylesheet = (css, adoptedElement, {
  hash,
  cacheStylesheet = true,
} = {}) => {
  if (isServer) {
    return;
  }
  hash = hash ?? hashCode(css);
  if (!adoptedElement) {
    adoptedElement = document;
  }

  // If adoptedElement doesn't support adoptedStyleSheets, get its root node
  if (!adoptedElement?.adoptedStyleSheets && adoptedElement?.getRootNode) {
    adoptedElement = adoptedElement.getRootNode();
  }

  if (!adoptedElement.cssHashes) {
    adoptedElement.cssHashes = new Set();
  }
  // already added
  if (adoptedElement.cssHashes.has(hash)) {
    return;
  }

  adoptedElement.cssHashes.add(hash);

  let stylesheet;

  if (cacheStylesheet && document.cachedStylesheets && document.cachedStylesheets[hash]) {
    // reuse stylesheet if cached
    stylesheet = document.cachedStylesheets[hash];
  }
  else {
    // otherwise create from scratch
    stylesheet = new CSSStyleSheet();
    stylesheet.id = hash;
    stylesheet.replaceSync(css);
  }

  // store stylesheet globally in cache for reuse if specified
  if (cacheStylesheet) {
    if (!document.cachedStylesheets) {
      document.cachedStylesheets = {};
    }
    document.cachedStylesheets[hash] = stylesheet;
  }

  // adopt this stylesheet after others
  adoptedElement.adoptedStyleSheets.push(stylesheet);
};

export const extractCSS = (selector, source = document, { returnText = false, exactMatch = false } = {}) => {
  selector = selector.toLowerCase();

  const matchesSelector = (ruleSelector) => {
    if (!ruleSelector) { return false; }
    const lowercased = ruleSelector.toLowerCase();
    return exactMatch ? lowercased === selector : lowercased.includes(selector);
  };

  const newStyleSheet = new CSSStyleSheet();

  // Handle different source types
  let styleSheets;
  if (isString(source)) {
    // Raw CSS text - parse and extract
    const tempSheet = new CSSStyleSheet();
    tempSheet.replaceSync(source);
    styleSheets = [tempSheet];
  }
  else if (source?.cssRules) {
    // Single stylesheet
    styleSheets = [source];
  }
  else if (source?.styleSheets) {
    // Document or element with styleSheets
    styleSheets = source.styleSheets;
  }
  else if (source?.adoptedStyleSheets) {
    // Document with adoptedStyleSheets
    styleSheets = source.adoptedStyleSheets;
  }
  else if (isArray(source)) {
    // Array of stylesheets
    styleSheets = source;
  }
  else {
    // Default to document
    styleSheets = document.styleSheets;
  }

  const wrappers = [];
  const extractFromRules = (rules) => {
    each(rules, (rule) => {
      if (matchesSelector(rule.selectorText)) {
        let cssText = rule.cssText;
        for (let i = wrappers.length - 1; i >= 0; i--) {
          cssText = `${wrappers[i]} { ${cssText} }`;
        }
        newStyleSheet.insertRule(cssText, newStyleSheet.cssRules.length);
      }
      if (rule.cssRules?.length) {
        // Only at-rules need wrapping — nested style rules already have resolved selectors
        const isAtRule = !rule.selectorText;
        if (isAtRule) {
          wrappers.push(rule.cssText.substring(0, rule.cssText.indexOf('{')).trim());
        }
        extractFromRules(rule.cssRules);
        if (isAtRule) {
          wrappers.pop();
        }
      }
    });
  };

  each(styleSheets, (sheet) => {
    try {
      extractFromRules(sheet.cssRules);
    }
    catch (err) {
      console.error('Error accessing stylesheet:', err);
    }
  });

  return returnText
    ? Array.from(newStyleSheet.cssRules).map(rule => rule.cssText).join('\n')
    : newStyleSheet;
};

export const scopeStyles = (css, scopeSelector = '', { replaceHost = false, appendToRootElements = true } = {}) => {
  scopeSelector = scopeSelector.trim();

  const scope = (selector) => {
    if (!scopeSelector) {
      return selector;
    }
    if (replaceHost && selector.includes(':host')) {
      return selector
        .replace(/:host\(([^)]+)\)/g, `${scopeSelector}$1`) // :host(.class) -> .scope.class
        .replace(/:host/g, scopeSelector); // :host -> .scope
    }
    const lower = selector.toLowerCase();
    if (appendToRootElements && (lower === 'html' || lower === 'body')) {
      return `${selector} ${scopeSelector}`;
    }
    return `${scopeSelector} ${selector}`;
  };

  // nested rules read relative to their parent, so only the outermost selector takes the scope
  const walk = (nodes) => {
    each(nodes, (node) => {
      if (node.type === 'rule') {
        node.selectors = node.selectors.map(scope);
      }
      else if (node.children && !isKeyframes(node.name)) {
        walk(node.children);
      }
    });
  };

  const nodes = parseCSS(css);
  walk(nodes);
  return stringifyCSS(nodes);
};
