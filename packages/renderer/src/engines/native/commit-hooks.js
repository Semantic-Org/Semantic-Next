import { isArray, isPlainObject } from '@semantic-ui/utils';

/*

  Helpers for the position-aware block dispatch refactor.

  renderASTToString walks an AST + data context and returns a string. It is
  the attribute-position counterpart to renderAST — used when a block lands
  inside an attribute value and its content needs to be serialized rather
  than rendered as DOM. Mirrors ServerRenderer.renderNodes minus the
  data-sui-bind tag tracking (no element scanning inside an attribute
  value).

*/

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
