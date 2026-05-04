/*
  Shared HTML string assembly — used by both the client renderer
  (which parses the string into DOM and binds markers) and the
  server renderer (which evaluates markers inline as strings).

  Pure function: all dependencies passed in, no instance state.
*/

// Marker for expression placeholders in attribute values
export const ATTR_MARKER_PREFIX = '__sui';
export const ATTR_MARKER_SUFFIX = '__';

// Versioned markers — client checks version on hydration,
// falls back to full render on mismatch
export const MARKER_VERSION = 'v1';

// Marker for text-position expressions (comment nodes)
export const COMMENT_MARKER = `sui:${MARKER_VERSION}:`;

// Marker for block-level directive positions
export const BLOCK_MARKER = `sui-block:${MARKER_VERSION}:`;

// Prefix for closing block markers — version-stripped because version
// match is enforced at the open marker; the close just balances depth.
// Read sites use this for `startsWith` checks.
export const BLOCK_CLOSE_PREFIX = '/sui-block:';

// Build a closing block marker comment data string. `meta.branchIndex`
// is the only reserved suffix today (conditional block); future suffixes
// can be added here without touching write/parse sites.
export function formatBlockClose(id, meta) {
  let s = `/sui-block:${MARKER_VERSION}:${id}`;
  if (meta && meta.branchIndex !== undefined) {
    s += `:b${meta.branchIndex}`;
  }
  return s;
}

// Parse trailing metadata from a closing block marker into target.
// Reserved suffixes (after the version segment):
//   bN  → branchIndex (which branch the {#if}/{:elseif}/{:else} server picked)
// Unknown segments are ignored. Mutates target in place.
export function parseServerMeta(commentData, target) {
  for (const part of commentData.split(':')) {
    if (part.startsWith('b')) {
      target.branchIndex = parseInt(part.slice(1));
    }
  }
}

// Marker for raw text element content (script, style, textarea, title)
export const RAW_TEXT_MARKER = `sui-rawtext:${MARKER_VERSION}:`;

// Attribute stamped by the server on elements with dynamic bindings so the
// client can wire Reactions without reconstructing a reference DOM from the
// AST (eliminates the parallel-TreeWalker dance in hydrateAttributes).
// Encoding: `attr=N[,attr=N]*` where N is the first-entry ID for that
// attribute. Name prefixes: `.prop` property, `@event` event, `?attr`
// boolean. Entries[N].attributeBinding carries full parts + classification,
// so the data-sui-bind string stays minimal and all static/multi-expression
// metadata lives on the prototype-cached entries array.
export const DATA_SUI_BIND = 'data-sui-bind';

// Sentinel branchIndex for the main {#if} body. Branches array is indexed
// from 0 ({:elseif}/{:else}); 1000 reserves a value above any plausible
// branch count to mean "main body matched". Persisted on the closing block
// marker as `:b1000` for hydration mismatch detection.
export const MAIN_BRANCH_INDEX = 1000;

// Compiled once — `lastIndex` is reset manually per use so the regex can
// be reused across parse calls without cross-talk.
const ATTR_MARKER_RE = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');

// Split an attribute value like `card __sui0__` or `foo __sui1__ bar __sui2__`
// into static/dynamic parts. Used by both render-path binding and hydrate
// lookup via entries[id].attributeBinding.
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
    const markerID = parseInt(match[1]);
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
const RAW_TEXT_OPEN = /\<(script|style|textarea|title)[\s>]/i;
const RAW_TEXT_CLOSE = /\<\/(script|style|textarea|title)\s*\>/i;

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

  // Check if buffer has entered/exited a raw text element after html node
  const updateRawTextState = (html) => {
    if (!insideRawText) {
      // Check if we just entered a raw text element (the > that closes its opening tag)
      const openMatch = html.match(RAW_TEXT_OPEN);
      if (openMatch) {
        // Confirm the tag has been closed with >
        const tagStart = html.lastIndexOf('<' + openMatch[1]);
        if (tagStart !== -1 && html.indexOf('>', tagStart) !== -1) {
          insideRawText = true;
          rawTextNodes = [];
        }
      }
    }
    else {
      // Check if we just exited
      if (RAW_TEXT_CLOSE.test(html)) {
        // Emit the raw text marker AFTER the closing tag
        const id = entries.length;
        htmlString += `<!--${RAW_TEXT_MARKER}${id}-->`;
        entries.push({ id, type: 'rawText', nodes: rawTextNodes });
        insideRawText = false;
        rawTextNodes = null;
      }
    }
  };

  const processNodes = (nodes) => {
    for (const node of nodes) {
      switch (node.type) {
        case 'html':
          htmlString += node.html;
          htmlBuffer += node.html;
          updateRawTextState(htmlBuffer);
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
          // Block-level directives: if, each, async, rerender, template
          const id = entries.length;
          htmlString += `<!--${BLOCK_MARKER}${id}-->`;
          const entry = { id, type: node.type, node };
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

// After the AST walk completes, scan the emitted htmlString for every
// attribute value that contains one or more `__sui{id}__` markers and
// attach an `attributeBinding` record to the FIRST entry in that
// attribute's marker set.
//
// attributeBinding = { rawAttrName, parts, markerIDs }
//   rawAttrName: attribute as written in the template, with optional
//                `.` / `@` prefix for property/event bindings. Boolean
//                and regular attributes share the plain name — callers
//                disambiguate via `entries[id].classification.type`.
//   parts:       output of parseAttributeParts; alternating
//                `{static}` and `{markerID}` entries covering the whole
//                attribute value (including statics between/around
//                multiple markers).
//   markerIDs:   entry IDs for every expression inside this attribute,
//                in document order. First ID is the "representative"
//                that `data-sui-bind` on the server references.
//
// Subsequent entries in markerIDs (the non-first ones for a
// multi-expression attribute) are reachable via the first entry's
// attributeBinding. The hydration path processes each attribute once
// via the first entry; bindAttribute handles the multi-expression
// reaction internally using the full parts array.
const ATTR_WITH_MARKER_RE = /\s([.@]?[\w:-]+)\s*=\s*(?:"([^"]*__sui\d+__[^"]*)"|([^\s"'>]*__sui\d+__[^\s"'>]*))/g;

function populateAttributeBindings(htmlString, entries) {
  ATTR_WITH_MARKER_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_WITH_MARKER_RE.exec(htmlString)) !== null) {
    const rawAttrName = match[1];
    const attrValue = match[2] !== undefined ? match[2] : match[3];
    const { parts, markerIDs } = parseAttributeParts(attrValue);
    if (markerIDs.length === 0) { continue; }
    const entry = entries[markerIDs[0]];
    if (!entry) { continue; }
    // firstMarkerID is markerIDs[0] but can differ from parts[0].markerID
    // when the attribute leads with static text (e.g. `class="card {x}"`).
    // Stored once so reactive-data.js's bindAttribute doesn't `parts.find`
    // on every binding setup.
    entry.attributeBinding = { rawAttrName, parts, markerIDs, firstMarkerID: markerIDs[0] };
  }
}
