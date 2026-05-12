import { isArray, isPlainObject } from '@semantic-ui/utils';

/*

  Position-aware block dispatch helpers:
    • makePlace — region-block place/match pair with reference-equality
      dedup (consumed by defineBlock's compute synthesis).
    • renderASTToString — serializer for blocks that land inside an
      attribute value (no DOM, must be a string).
    • unsafeHTML / UNSAFE_HTML — marker pair for value-block compute that
      emits an HTML string (consumed by define-block's unsafeHTML body).

*/

// Sentinel for "no content placed yet" — distinct from any AST array
// reference and from null/undefined so the first call always commits.
const PLACE_INIT = Symbol('place:init');

export const UNSAFE_HTML = Symbol('place:unsafeHTML');
export function unsafeHTML(value) {
  return { [UNSAFE_HTML]: value };
}

// Construct a {place, match} pair for a text-position region block.
//
// place(content) — public, exposed on the bag. content is an AST array
// (rendered via renderAST + region.setContent against a fresh child
// scope) or null (region.clear). Reference equality dedups —
// unchanged content no-ops. region.setContent clears region.childScopes,
// disposing any hydrate scope hydrateInto pushed.
//
// match(content) — internal, called by defineBlock from hydrate's
// return value. Records "the DOM already matches this content" without
// performing a DOM op, so the first compute-driven update after
// hydration dedups against the server DOM instead of triggering a
// wasteful re-render.
export function makePlace({ region, scope, renderer, data, isSVG }) {
  let lastContent = PLACE_INIT;
  let lastChildScope = null;

  function place(content) {
    if (content === lastContent) { return; }
    lastContent = content;

    if (lastChildScope) {
      lastChildScope.dispose();
      lastChildScope = null;
    }

    if (content == null) {
      region.clear();
      return;
    }

    const childScope = scope.child();
    lastChildScope = childScope;
    const fragment = renderer.readAST({ ast: content, scope: childScope, data, isSVG });
    region.setContent(fragment, childScope);
  }

  function match(content) {
    lastContent = content;
  }

  return { place, match };
}

// Coerce an evaluated expression value to its attribute-value string form.
// Objects/arrays are JSON-stringified; null/undefined become empty string;
// everything else is String()'d.
export function stringifyAttrValue(value) {
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
