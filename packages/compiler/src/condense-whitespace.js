import { isArray } from '@semantic-ui/utils';

/*
  Whitespace condensing over the compiled AST, after optimizeAST.

  The language rule, not a neutrality claim: cross-line whitespace between
  tag or block boundaries is formatting and is removed — same-line spacing
  is content and survives. Runs touching text or an expression collapse to
  a single space (that part is rendering-neutral under normal `white-space`,
  so {first}\n{last} reads "first last"). Inline siblings split across
  lines lose their word break; keep them on one line or use &#32;.

  Working post-parse keeps the grammar defined once: block markers like
  {else} or {loading} never reach this pass — the parser consumed them
  into content arrays, so their whitespace is array-edge whitespace and
  classification is node structure. Only html chunks need scanning, and
  scanner state (open tag, quote, raw-text element) threads across chunks
  because they split mid-tag at attribute expressions: `<tr class="` {x} `">`.
*/

// raw-text elements whose content is never condensed
const RAW_TEXT_TAGS = new Set(['pre', 'textarea', 'script', 'style']);

// boundary-checked close so </press-thing> can't end a <pre> region
const RAW_TEXT_CLOSE = {
  pre: /<\/pre\s*>/gi,
  textarea: /<\/textarea\s*>/gi,
  script: /<\/script\s*>/gi,
  style: /<\/style\s*>/gi,
};

// every content array a block node may render
const ALTERNATIVE_PROPS = ['content', 'elseContent', 'loadingContent', 'errorContent'];

export function condenseWhitespace(ast) {
  condenseLevel(ast, { inTag: false, quote: null, rawText: null, pendingRawText: null });
  return ast;
}

function condenseLevel(nodes, state) {
  const edges = new Map();
  for (const node of nodes) {
    if (node.type === 'html') {
      const startClean = !state.rawText && !state.inTag;
      node.html = condenseString(node.html, state);
      edges.set(node, { startClean, endClean: !state.rawText && !state.inTag });
    }
    else {
      const entryState = { ...state };
      for (const prop of ALTERNATIVE_PROPS) {
        if (isArray(node[prop])) {
          condenseLevel(node[prop], state);
          Object.assign(state, entryState);
        }
      }
      if (isArray(node.branches)) {
        for (const branch of node.branches) {
          if (isArray(branch.content)) {
            condenseLevel(branch.content, state);
            Object.assign(state, entryState);
          }
        }
      }
    }
  }
  resolveEdges(nodes, edges);
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].type === 'html' && nodes[i].html === '') {
      nodes.splice(i, 1);
    }
  }
}

function isWhitespaceChar(ch) {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

function condenseString(html, state) {
  let out = '';
  let i = 0;
  const len = html.length;
  let lastWasTagEnd = false;

  while (i < len) {
    if (state.rawText) {
      const closeRegExp = RAW_TEXT_CLOSE[state.rawText];
      closeRegExp.lastIndex = i;
      const closeMatch = closeRegExp.exec(html);
      if (!closeMatch) {
        return out + html.slice(i);
      }
      out += html.slice(i, closeMatch.index);
      i = closeMatch.index;
      state.rawText = null;
      lastWasTagEnd = false;
      continue;
    }

    if (state.inTag) {
      // resume a tag left open by a previous chunk (attribute expressions)
      const ch = html[i];
      out += ch;
      i++;
      if (state.quote) {
        if (ch === state.quote) {
          state.quote = null;
        }
      }
      else if (ch === '"' || ch === "'") {
        state.quote = ch;
      }
      else if (ch === '>') {
        state.inTag = false;
        lastWasTagEnd = true;
        if (state.pendingRawText && out[out.length - 2] !== '/') {
          state.rawText = state.pendingRawText;
        }
        state.pendingRawText = null;
      }
      continue;
    }

    const ch = html[i];

    if (ch === '<') {
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        const stop = end === -1 ? len : end + 3;
        out += html.slice(i, stop);
        i = stop;
        lastWasTagEnd = true;
        continue;
      }
      const start = i;
      i++;
      let closed = false;
      while (i < len) {
        const c = html[i];
        i++;
        if (state.quote) {
          if (c === state.quote) {
            state.quote = null;
          }
        }
        else if (c === '"' || c === "'") {
          state.quote = c;
        }
        else if (c === '>') {
          closed = true;
          break;
        }
      }
      const tag = html.slice(start, i);
      out += tag;
      const nameMatch = /^<([a-zA-Z][\w-]*)/.exec(tag);
      const rawName = nameMatch && RAW_TEXT_TAGS.has(nameMatch[1].toLowerCase())
        ? nameMatch[1].toLowerCase()
        : null;
      if (closed) {
        lastWasTagEnd = true;
        if (rawName && !tag.endsWith('/>')) {
          state.rawText = rawName;
        }
      }
      else {
        state.inTag = true;
        state.pendingRawText = rawName;
      }
      continue;
    }

    if (isWhitespaceChar(ch)) {
      let j = i;
      let hasNewline = false;
      while (j < len && isWhitespaceChar(html[j])) {
        if (html[j] === '\n' || html[j] === '\r') {
          hasNewline = true;
        }
        j++;
      }
      if (out.length === 0 || j === len) {
        // chunk edge: the neighbor node decides, in resolveEdges
        out += html.slice(i, j);
      }
      else if (hasNewline && lastWasTagEnd && html[j] === '<') {
        // cross-line run between tags is formatting, drop it
      }
      else {
        out += ' ';
      }
      i = j;
      continue;
    }

    out += ch;
    lastWasTagEnd = false;
    i++;
  }
  return out;
}

function resolveEdges(nodes, edges) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type !== 'html') {
      continue;
    }
    const edge = edges.get(node);
    if (!edge) {
      continue;
    }

    if (/^\s*$/.test(node.html)) {
      if (!edge.startClean || !edge.endClean) {
        continue;
      }
      const removable = /[\n\r]/.test(node.html)
        && isBoundary(nodes, i, -1)
        && isBoundary(nodes, i, 1);
      node.html = removable ? '' : ' ';
      continue;
    }

    if (edge.startClean) {
      const lead = /^\s+/.exec(node.html);
      if (lead) {
        // both sides must be boundaries: the neighbor outside, a tag inside
        const removable = /[\n\r]/.test(lead[0])
          && isBoundary(nodes, i, -1)
          && node.html[lead[0].length] === '<';
        node.html = (removable ? '' : ' ') + node.html.slice(lead[0].length);
      }
    }
    if (edge.endClean) {
      const tail = /\s+$/.exec(node.html);
      if (tail) {
        const removable = /[\n\r]/.test(tail[0])
          && isBoundary(nodes, i, 1)
          && node.html[node.html.length - tail[0].length - 1] === '>';
        node.html = node.html.slice(0, -tail[0].length) + (removable ? '' : ' ');
      }
    }
  }
}

// whether the neighbor in `direction` presents a tag or block boundary.
// content-array edges are boundaries: the block's own anchors bracket them.
function isBoundary(nodes, index, direction) {
  const neighbor = nodes[index + direction];
  if (!neighbor) {
    return true;
  }
  if (neighbor.type === 'expression') {
    return false;
  }
  if (neighbor.type === 'html') {
    const edgeChar = direction === -1
      ? neighbor.html[neighbor.html.length - 1]
      : neighbor.html[0];
    return direction === -1 ? edgeChar === '>' : edgeChar === '<';
  }
  // block nodes (if/each/async/rerender) and element nodes are structural
  return true;
}
