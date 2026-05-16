/*
  Shared HTML string assembly — used by both the client renderer
  (which parses the string into DOM and binds markers) and the
  server renderer (which evaluates markers inline as strings).

  Pure function: all dependencies passed in, no instance state.
*/

export const ATTR_MARKER_PREFIX = '__sui';
export const ATTR_MARKER_SUFFIX = '__';

// Versioned so client can detect server/client mismatches at hydrate time.
export const MARKER_VERSION = 'v1';

export const COMMENT_MARKER = `sui:${MARKER_VERSION}:`;
export const BLOCK_MARKER = `sui-block:${MARKER_VERSION}:`;
export const RAW_TEXT_MARKER = `sui-rawtext:${MARKER_VERSION}:`;

// Prefix only — full close marker is `/sui-block:v1:N[:bX]`. Version match
// is enforced at the open marker so `startsWith` callers compare without it.
export const BLOCK_CLOSE_PREFIX = '/sui-block:';

// Sentinel for {#if} main-body in branchIndex serialization — branches
// array indexes from 0 for {:elseif}/{:else}, so 1000 reserves a value
// above any plausible branch count.
export const MAIN_BRANCH_INDEX = 1000;

// Stamped on elements with dynamic bindings so the client can wire
// Reactions without a reference-DOM walk. Encoding: `attr=N[,attr=N]*`
// where N is the first-entry ID. Name prefixes: `.prop` for property
// bindings, `@event` for event listeners; boolean attrs use the bare
// name (classification.type === 'boolean' on the entry).
export const DATA_SUI_BIND = 'data-sui-bind';

// Closing-marker payload. `branchIndex` is the only reserved suffix.
export function formatBlockClose(id, meta) {
  let s = `${BLOCK_CLOSE_PREFIX}${MARKER_VERSION}:${id}`;
  if (meta && meta.branchIndex !== undefined) {
    s += `:b${meta.branchIndex}`;
  }
  return s;
}

// `bN` (signed integer) → branchIndex. Strict digit suffix so future
// reserved prefixes like `block`/`bypass` don't accidentally clobber.
// Allows the `-1` sentinel emitted when no conditional branch matched.
const META_BRANCH_RE = /^b(-?\d+)$/;
export function parseServerMeta(commentData, target) {
  for (const part of commentData.split(':')) {
    const m = META_BRANCH_RE.exec(part);
    if (m) {
      target.branchIndex = +m[1];
    }
  }
}

export function isBlockOpen(commentData) {
  return commentData.startsWith(BLOCK_MARKER);
}
export function isBlockClose(commentData) {
  return commentData.startsWith(BLOCK_CLOSE_PREFIX);
}
export function isExpressionMarker(commentData) {
  return commentData.startsWith(COMMENT_MARKER);
}
export function isRawTextMarker(commentData) {
  return commentData.startsWith(RAW_TEXT_MARKER);
}
export function parseBlockOpenID(commentData) {
  return +commentData.slice(BLOCK_MARKER.length);
}
export function parseExpressionID(commentData) {
  return +commentData.slice(COMMENT_MARKER.length);
}
export function parseRawTextID(commentData) {
  return +commentData.slice(RAW_TEXT_MARKER.length);
}

// Compiled once — `lastIndex` is reset manually per use so the regex can
// be reused across parse calls without cross-talk.
const ATTR_MARKER_RE = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');

// Split an attribute value like `card __sui0__` or `foo __sui1__ bar __sui2__`
// into static/dynamic parts. Used by render-path binding and the hydrate
// lookup via entries[id].attributeParts.
export function parseAttributeParts(attrValue) {
  const parts = [];
  const markerIDs = [];
  let lastIndex = 0;
  let match;
  ATTR_MARKER_RE.lastIndex = 0;
  while ((match = ATTR_MARKER_RE.exec(attrValue)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ static: attrValue.slice(lastIndex, match.index) });
    }
    const markerID = +match[1];
    parts.push({ markerID });
    markerIDs.push(markerID);
    lastIndex = ATTR_MARKER_RE.lastIndex;
  }
  if (lastIndex < attrValue.length) {
    parts.push({ static: attrValue.slice(lastIndex) });
  }
  return { parts, markerIDs };
}

// HTML raw text elements — browser treats content as text, not markup
export const RAW_TEXT_OPEN = /\<(script|style|textarea|title)[\s>]/gi;
export const RAW_TEXT_CLOSE = /\<\/(script|style|textarea|title)\s*\>/i;

// precompute per-tag close regexes so we don't allocate one per html chunk scan
const RAW_TEXT_CLOSE_BY_TAG = {
  script: /<\/script\s*>/i,
  style: /<\/style\s*>/i,
  textarea: /<\/textarea\s*>/i,
  title: /<\/title\s*>/i,
};

// shared by buildHTMLString and the server renderer so both flip into raw-text mode at the same boundary
// callers can pass a full buffer or just the new chunk — the function only needs the substring covering the last open tag to decide
export function isInsideRawText(buffer) {
  // last open wins — earlier raw-text elements may already be closed
  // exec loop (not matchAll) to avoid per-call iterator allocation in the hot path
  RAW_TEXT_OPEN.lastIndex = 0;
  let lastMatch = null;
  let match;
  while ((match = RAW_TEXT_OPEN.exec(buffer)) !== null) {
    lastMatch = match;
  }
  if (!lastMatch) { return false; }
  const tagName = lastMatch[1].toLowerCase();
  const tagEnd = buffer.indexOf('>', lastMatch.index);
  if (tagEnd === -1) { return false; }
  return !RAW_TEXT_CLOSE_BY_TAG[tagName].test(buffer.slice(tagEnd));
}

/*******************************
    Binding Classification
*******************************/

export function analyzePosition(html) {
  let lastOpen = html.lastIndexOf('<');
  let lastClose = html.lastIndexOf('>');

  if (lastOpen <= lastClose) {
    return { type: 'text', insideTag: false, attribute: '', quoted: false };
  }

  const tagFragment = html.slice(lastOpen);

  // Check for .prop= or @event= prefixed attributes
  const specialMatch = tagFragment.match(/\s([.@])([\w-]+)\s*=\s*(['"]?)$/);
  if (specialMatch) {
    const prefix = specialMatch[1];
    const name = specialMatch[2];
    return {
      type: prefix === '.' ? 'property' : 'event',
      insideTag: true,
      attribute: name,
      quoted: specialMatch[3] === '"' || specialMatch[3] === "'",
    };
  }

  const attrMatch = tagFragment.match(/\s([\w-]+)\s*=\s*(['"]?)$/);
  if (attrMatch) {
    const name = attrMatch[1];
    const quoted = attrMatch[2] === '"' || attrMatch[2] === "'";
    return {
      type: quoted ? 'attribute' : 'boolean',
      insideTag: true,
      attribute: name,
      quoted,
    };
  }

  return { type: 'attribute', insideTag: true, attribute: '', quoted: false };
}

/*******************************
    HTML String Assembly
*******************************/

export function buildHTMLString(ast, { snippets = {}, isSVG: initialSVG = false } = {}) {
  let htmlString = '';
  const entries = []; // { id, type, node, classification }
  let htmlBuffer = ''; // accumulated HTML for binding classification

  // SVG context tracking — block entries inside SVG need isSVG
  // so the renderer parses fragments with the correct namespace.
  // initialSVG propagates context when called from within an SVG block.
  let insideSVG = initialSVG;

  // Raw text element tracking — inside <script>, <style>, etc.
  // the browser treats content as text, not markup, so comment
  // markers would become literal text instead of DOM nodes.
  let insideRawText = false;
  let rawTextNodes = null; // collected AST nodes for the raw text content

  // when inside raw-text, marker must land right after the close tag (not at chunk end)
  // since the AST often combines `</style>` with following siblings into one html node
  const appendHtml = (html) => {
    if (insideRawText) {
      const closeMatch = html.match(RAW_TEXT_CLOSE);
      if (closeMatch) {
        const splitAt = closeMatch.index + closeMatch[0].length;
        const beforeClose = html.slice(0, splitAt);
        htmlString += beforeClose;
        htmlBuffer += beforeClose;
        const id = entries.length;
        htmlString += `<!--${RAW_TEXT_MARKER}${id}-->`;
        entries.push({ id, type: 'rawText', nodes: rawTextNodes });
        insideRawText = false;
        rawTextNodes = null;
        // the remainder (after </style>) may itself open another raw-text element
        appendHtml(html.slice(splitAt));
        return;
      }
      htmlString += html;
      htmlBuffer += html;
      return;
    }
    htmlString += html;
    htmlBuffer += html;
    // buffer-wide scan — raw-text opening tags can be split across html chunks by attribute expressions like `<textarea placeholder="{x}">`, so the `<tag` and its `>` may live in different chunks
    if (isInsideRawText(htmlBuffer)) {
      insideRawText = true;
      rawTextNodes = [];
    }
  };

  const processNodes = (nodes) => {
    for (const node of nodes) {
      switch (node.type) {
        case 'html':
          appendHtml(node.html);
          break;

        case 'expression': {
          if (insideRawText) {
            const classification = analyzePosition(htmlBuffer);
            if (classification.insideTag) {
              // Attribute on the raw text element itself — handle normally
              const id = entries.length;
              htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
              entries.push({ id, type: 'expression', node, classification });
            }
            else {
              // Content inside raw text — collect, don't emit marker
              rawTextNodes.push(node);
            }
            break;
          }
          const id = entries.length;
          const classification = analyzePosition(htmlBuffer);

          if (classification.insideTag) {
            // Attribute position — string token
            htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
          }
          else {
            // Text position — comment marker
            htmlString += `<!--${COMMENT_MARKER}${id}-->`;
          }
          entries.push({ id, type: 'expression', node, classification });
          break;
        }

        case 'svg': {
          // Flatten SVG content inline — the outer <svg> tag is in a preceding html node.
          // Track SVG context so block entries know they need SVG namespace parsing.
          const wasSVG = insideSVG;
          insideSVG = true;
          processNodes(node.content);
          insideSVG = wasSVG;
          break;
        }

        case 'snippet':
          // Snippet definitions don't produce HTML — the renderer
          // collects them from the AST during construction.
          break;

        case 'slot': {
          if (node.name) {
            htmlString += `<slot name="${node.name}"></slot>`;
          }
          else {
            htmlString += '<slot></slot>';
          }
          break;
        }

        default: {
          if (insideRawText) {
            // Block inside raw text — collect, don't emit marker
            rawTextNodes.push(node);
            break;
          }
          // Attribute-position blocks emit the same __suiN__ shape as
          // attribute-position expressions so they share the attribute-
          // binding path — comment markers in an attribute value become
          // literal text, not Comment nodes.
          const id = entries.length;
          const classification = analyzePosition(htmlBuffer);
          if (classification.insideTag) {
            htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
          }
          else {
            htmlString += `<!--${BLOCK_MARKER}${id}-->`;
          }
          const entry = { id, type: node.type, node, classification };
          if (insideSVG) { entry.isSVG = true; }
          entries.push(entry);
          break;
        }
      }
    }
  };

  processNodes(ast);
  populateAttributeBindings(htmlString, entries);
  return { htmlString, entries, snippets };
}

// Attach `attributeParts` to the first entry of each attribute whose value
// carries one or more markers. `parts` covers the full value (alternating
// static/dynamic segments) so bindAttribute can reconstruct the
// interpolation in one pass. The hydration path resolves the binding via
// `data-sui-bind` → first entry → entry.attributeParts.
const ATTR_WITH_MARKER_RE = /\s(?:[.@]?[\w:-]+)\s*=\s*(?:"([^"]*__sui\d+__[^"]*)"|([^\s"'>]*__sui\d+__[^\s"'>]*))/g;

function populateAttributeBindings(htmlString, entries) {
  ATTR_WITH_MARKER_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_WITH_MARKER_RE.exec(htmlString)) !== null) {
    const attrValue = match[1] !== undefined ? match[1] : match[2];
    const { parts, markerIDs } = parseAttributeParts(attrValue);
    if (markerIDs.length === 0) { continue; }
    const entry = entries[markerIDs[0]];
    if (!entry) { continue; }
    entry.attributeParts = parts;
  }
}
