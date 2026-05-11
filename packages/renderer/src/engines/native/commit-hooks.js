import { isArray, isPlainObject } from '@semantic-ui/utils';

/*

  Helpers for the position-aware block dispatch refactor.

  renderASTToString walks an AST + data context and returns a string. It is
  the attribute-position counterpart to renderAST — used when a block lands
  inside an attribute value and its content needs to be serialized rather
  than rendered as DOM. Mirrors ServerRenderer.renderNodes minus the
  data-sui-bind tag tracking (no element scanning inside an attribute
  value).

  makePlace constructs the `bag.place(content)` closure that text-position
  block dispatch uses to swap region content. It owns the child-scope +
  renderAST + region.setContent sequence every block writes by hand today,
  plus reference-equality dedup so the same matched branch doesn't re-fire
  a DOM swap. Block authors using the `compute` shorthand never call this
  directly; defineBlock invokes it from render and update.

*/

// Sentinel for "no content placed yet" — distinct from any AST array
// reference and from null/undefined so the first call always commits.
const PLACE_INIT = Symbol('place:init');

// Wrapper marker for "this value should be parsed as HTML and inserted
// as a sibling sequence" — distinguished from AST arrays (rendered via
// renderAST) and primitives (written to a text node). Compute returns
// `unsafeHTML(value)` from a block when it wants place to parse-and-insert.
const UNSAFE_HTML = Symbol('place:unsafeHTML');
export function unsafeHTML(value) {
  return { [UNSAFE_HTML]: value };
}

function isUnsafeHTML(content) {
  return content != null && typeof content === 'object' && UNSAFE_HTML in content;
}

// Construct a {place, match} pair for a text-position block.
//
// place(content) — public, exposed on the bag. Polymorphic on content
// shape:
//   • AST array (Array.isArray) — render via renderAST + region.setContent
//     with a fresh child scope. Region-managing blocks (conditional,
//     rerender, template) use this path.
//   • unsafeHTML wrapper ({ [UNSAFE_HTML]: 'html string' }) — parse value
//     as HTML, replace region.ownedNodes with the parsed nodes. Mirror of
//     the existing unsafeHTML expression path.
//   • null / undefined — clear the region.
//   • Any other value (primitive) — coerce to string, write into a
//     reactive text node that lives inside the region as its single owned
//     node. The text node is created lazily on first primitive place().
// Reference equality dedups across all shapes — unchanged content
// no-ops. region.setContent (when place eventually swaps shape) clears
// region.childScopes, disposing any hydrate scope hydrateInto pushed.
//
// match(content) — internal, called by defineBlock from hydrate's return
// value. Records "the DOM already matches this content" without
// performing a DOM op, so the first compute-driven update after
// hydration dedups against the server DOM instead of triggering a
// wasteful re-render.
export function makePlace({ region, scope, renderer, data, isSVG }) {
  let lastContent = PLACE_INIT;
  let lastChildScope = null;
  let valueTextNode = null;

  function clearOwnedSiblings() {
    for (const n of region.ownedNodes) { n.remove(); }
    region.ownedNodes = [];
    if (region.endAnchor) { region.endAnchor.remove(); }
  }

  function place(content) {
    if (content === lastContent) { return; }
    lastContent = content;

    if (lastChildScope) {
      lastChildScope.dispose();
      lastChildScope = null;
    }

    if (content == null) {
      // Reset the value text node so a later primitive place() starts fresh.
      valueTextNode = null;
      region.clear();
      return;
    }

    if (isUnsafeHTML(content)) {
      // HTML payload — parse and insert after the anchor.
      valueTextNode = null;
      clearOwnedSiblings();
      const html = content[UNSAFE_HTML];
      const str = html == null ? '' : String(html);
      if (str) {
        const parsed = renderer.parseHTML(str);
        const nodes = [...parsed.childNodes];
        region.anchor.after(parsed);
        region.ownedNodes = nodes;
        region.placeEndAnchor();
      }
      return;
    }

    if (Array.isArray(content)) {
      valueTextNode = null;
      const childScope = scope.child();
      lastChildScope = childScope;
      const fragment = renderer.readAST({ ast: content, scope: childScope, data, isSVG });
      region.setContent(fragment, childScope);
      return;
    }

    // Primitive value (string / number / boolean). Write to a reactive
    // text node owned by the region. Create lazily.
    const str = String(content);
    if (!valueTextNode || valueTextNode.parentNode == null) {
      clearOwnedSiblings();
      valueTextNode = document.createTextNode(str);
      region.anchor.after(valueTextNode);
      region.ownedNodes = [valueTextNode];
      region.placeEndAnchor();
    }
    else if (valueTextNode.data !== str) {
      valueTextNode.data = str;
    }
  }

  function match(content) {
    lastContent = content;
  }

  return { place, match };
}

// Coerce an evaluated expression value to its attribute-value string form.
// Objects/arrays are JSON-stringified; null/undefined become empty string;
// everything else is String()'d.
function stringifyAttrValue(value) {
  if (value == null) { return ''; }
  if (isArray(value) || isPlainObject(value)) {
    try {
      return JSON.stringify(value);
    }
    catch (e) {
      return String(value);
    }
  }
  return String(value);
}

// Walk an AST array and produce a string by evaluating each node against
// the data context. Supports html, expression, and the value-producing
// block types (if, rerender). Throws for block types whose semantics don't
// reduce to "render to a string" — each/async/svg/slot/template — so the
// failure surfaces at the offending syntax rather than as silent garbage.
//
// `renderer` provides `lookupExpression(expr, data)` for expression
// evaluation; both the client Renderer and ServerRenderer satisfy this.
export function renderASTToString(ast, data, renderer) {
  let out = '';
  for (const node of ast) {
    switch (node.type) {
      case 'html':
        out += node.html;
        break;
      case 'expression': {
        const value = renderer.lookupExpression(node.value, data);
        if (node.unsafeHTML) {
          out += value == null ? '' : String(value);
        }
        else {
          out += stringifyAttrValue(value);
        }
        break;
      }
      case 'if':
        out += renderConditionalToString(node, data, renderer);
        break;
      case 'rerender':
        out += node.content ? renderASTToString(node.content, data, renderer) : '';
        break;
      case 'each':
      case 'async':
      case 'template':
      case 'svg':
      case 'slot':
        throw new Error(
          `{#${node.type}} cannot be rendered inside an attribute value. `
            + 'Use a method or computed signal that returns a string.',
        );
      default:
        // Unknown node type — skip (defensive default; compiler shouldn't emit these).
        break;
    }
  }
  return out;
}

// Branch matching for {#if} mirrors blocks/conditional.js but returns the
// matched branch's content rather than rendering it. Used by renderASTToString
// to recurse into the branch's AST.
function renderConditionalToString(node, data, renderer) {
  if (renderer.lookupExpression(node.condition, data) && node.content) {
    return renderASTToString(node.content, data, renderer);
  }
  if (node.branches) {
    for (const branch of node.branches) {
      if (branch.type === 'elseif') {
        if (renderer.lookupExpression(branch.condition, data)) {
          return renderASTToString(branch.content, data, renderer);
        }
      }
      else if (branch.type === 'else') {
        return renderASTToString(branch.content, data, renderer);
      }
    }
  }
  return '';
}
