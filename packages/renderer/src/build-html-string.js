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

// Marker for raw text element content (script, style, textarea, title)
export const RAW_TEXT_MARKER = `sui-rawtext:${MARKER_VERSION}:`;

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

export function buildHTMLString(ast, snippets = {}, { isSVG: initialSVG = false } = {}) {
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
  return { htmlString, entries, snippets };
}
