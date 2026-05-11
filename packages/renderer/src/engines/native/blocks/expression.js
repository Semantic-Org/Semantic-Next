import { isBlockClose, isBlockOpen, isExpressionMarker } from '../../../build-html-string.js';
import { registerBlock } from './registry.js';

/*

  Text-position expression dispatch. Routes through the block registry
  so every AST node type (expression, rawText, if, each, async, rerender,
  template) reaches the renderer through one primitive: getBlock(type).

  Attribute-position expressions are NOT dispatched here — they're walked
  by bindAttribute in attribute-binding.js as part of an attribute's combined
  parts evaluation (one Reaction owns the full attribute string regardless
  of how many markers it contains). bindAttribute handles both expression
  and block-type markers in that position via evaluateMarkerToString.

*/

// Fresh text-expression mount. Three shapes:
// • unsafeHTML  — parse value as HTML, replace owned nodes on each run
// • literalValue — static text node, no reaction (one-shot at mount)
// • default      — reactive text node, update .data on each run
function bindTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;
  const parent = comment.parentNode;

  if (exprNode.unsafeHTML) {
    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);
    const ownedNodes = [];
    scope.reaction(anchor, () => {
      for (const n of ownedNodes) { n.remove(); }
      ownedNodes.length = 0;
      const value = renderer.lookupExpression(exprNode.value, data);
      if (value != null && value !== '') {
        const parsed = renderer.parseHTML(String(value));
        const nodes = [...parsed.childNodes];
        anchor.after(parsed);
        ownedNodes.push(...nodes);
      }
    });
    return;
  }

  if (exprNode.literalValue) {
    const value = renderer.evaluator.lookupTokenValue(exprNode.value, data);
    const textNode = document.createTextNode(value ?? '');
    parent.replaceChild(textNode, comment);
    return;
  }

  const textNode = document.createTextNode('');
  parent.replaceChild(textNode, comment);
  scope.reaction(textNode, () => {
    const value = renderer.lookupExpression(exprNode.value, data);
    textNode.data = value ?? '';
  });
}

// Hydrating text-expression — adopts server-rendered DOM rather than
// rebuilding. The server output merges VALUE with any following static
// text into one text node; split at the boundary so the reactive node
// covers only the value portion.
function hydrateTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;

  if (exprNode.unsafeHTML) {
    const ownedNodes = [];
    let next = comment.nextSibling;
    while (
      next && !(next.nodeType === Node.COMMENT_NODE
        && (isExpressionMarker(next.data) || isBlockOpen(next.data) || isBlockClose(next.data)))
    ) {
      ownedNodes.push(next);
      next = next.nextSibling;
    }
    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);
    scope.reaction(anchor, (comp) => {
      const value = renderer.lookupExpression(exprNode.value, data);
      if (comp.firstRun) { return; } // server DOM trusted; skip reparse
      for (const n of ownedNodes) { n.remove(); }
      ownedNodes.length = 0;
      if (value != null && value !== '') {
        const parsed = renderer.parseHTML(String(value));
        const nodes = [...parsed.childNodes];
        anchor.after(parsed);
        ownedNodes.push(...nodes);
      }
    });
    return;
  }

  const nextNode = comment.nextSibling;
  let textNode;
  if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
    const serverValue = String(renderer.lookupExpression(exprNode.value, data) ?? '');
    const fullText = nextNode.data;
    if (fullText.length > serverValue.length && fullText.startsWith(serverValue)) {
      nextNode.splitText(serverValue.length);
    }
    textNode = nextNode;
    comment.remove();
  }
  else {
    textNode = document.createTextNode('');
    comment.replaceWith(textNode);
  }
  scope.reaction(textNode, (comp) => {
    if (comp.firstRun) {
      renderer.lookupExpression(exprNode.value, data);
      return;
    }
    const value = renderer.lookupExpression(exprNode.value, data);
    textNode.data = value ?? '';
  });
}

const expression = function expression({ comment, entry, data, scope, renderer, hydrating }) {
  if (hydrating) {
    hydrateTextExpression({ comment, entry, data, scope, renderer });
    return;
  }
  bindTextExpression({ comment, entry, data, scope, renderer });
};

registerBlock('expression', expression);

export default expression;
