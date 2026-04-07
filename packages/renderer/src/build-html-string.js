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

export function buildHTMLString(ast, snippets = {}) {
  let htmlString = '';
  const entries = []; // { id, type, node, classification }
  let htmlBuffer = ''; // accumulated HTML for binding classification

  const processNodes = (nodes) => {
    for (const node of nodes) {
      switch (node.type) {
        case 'html':
          htmlString += node.html;
          htmlBuffer += node.html;
          break;

        case 'expression': {
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
          // Flatten SVG content inline — the outer <svg> tag is in a preceding html node
          processNodes(node.content);
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
          // Block-level directives: if, each, async, rerender, template
          const id = entries.length;
          htmlString += `<!--${BLOCK_MARKER}${id}-->`;
          entries.push({ id, type: node.type, node });
          break;
        }
      }
    }
  };

  processNodes(ast);
  return { htmlString, entries, snippets };
}
