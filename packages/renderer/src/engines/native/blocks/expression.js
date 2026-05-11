import { isBlockClose, isBlockOpen, isExpressionMarker } from '../../../build-html-string.js';
import { registerBlock } from './registry.js';

/*

  Text-position expression dispatch. Routes through the block registry so
  every AST node type (expression, rawText, if, each, async, rerender,
  template) reaches the renderer through one primitive: getBlock(type).

  Attribute-position expressions are NOT dispatched here — they're walked
  by bindAttribute in attribute-binding.js as part of an attribute's
  combined parts evaluation (one Reaction owns the full attribute string
  regardless of how many markers it contains). bindAttribute handles both
  expression and block-type markers in that position.

  Bind vs hydrate share their reactive cores; the only differences are
  where the anchor/textNode comes from (fresh-created vs adopted from
  server DOM) and whether the first Reaction run writes to the DOM.

*/

// Reaction body: reactive textNode.data writes. skipFirstWrite is set
// during hydration so the server's text isn't overwritten on first run;
// the expression read still registers Signal deps.
function wireTextReaction({ scope, textNode, exprNode, data, renderer, skipFirstWrite }) {
  scope.reaction(textNode, (comp) => {
    const value = renderer.lookupExpression(exprNode.value, data);
    if (skipFirstWrite && comp.firstRun) { return; }
    textNode.data = value ?? '';
  });
}

// Reaction body: re-parse HTML, replace ownedNodes after an anchor.
// skipFirstWrite is set during hydration (server bytes are trusted, so the
// first run only registers deps).
function wireUnsafeHTMLReaction({ scope, anchor, ownedNodes, exprNode, data, renderer, skipFirstWrite }) {
  scope.reaction(anchor, (comp) => {
    const value = renderer.lookupExpression(exprNode.value, data);
    if (skipFirstWrite && comp.firstRun) { return; }
    for (const n of ownedNodes) { n.remove(); }
    ownedNodes.length = 0;
    if (value != null && value !== '') {
      const parsed = renderer.parseHTML(String(value));
      const nodes = [...parsed.childNodes];
      anchor.after(parsed);
      ownedNodes.push(...nodes);
    }
  });
}

// Collect server-rendered sibling nodes after `comment` until the next sui
// marker. These nodes are the unsafeHTML payload the server emitted; we
// adopt them into the ownedNodes array so the hydrating Reaction can
// replace them on subsequent updates.
function collectServerSiblings(comment) {
  const collected = [];
  let next = comment.nextSibling;
  while (
    next && !(next.nodeType === Node.COMMENT_NODE
      && (isExpressionMarker(next.data) || isBlockOpen(next.data) || isBlockClose(next.data)))
  ) {
    collected.push(next);
    next = next.nextSibling;
  }
  return collected;
}

// Fresh text-expression mount. Three shapes:
//   unsafeHTML   — parse value as HTML, replace owned nodes on each run
//   literalValue — static text node, no reaction (one-shot at mount)
//   default      — reactive text node, update .data on each run
function bindTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;

  if (exprNode.unsafeHTML) {
    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);
    const ownedNodes = [];
    wireUnsafeHTMLReaction({ scope, anchor, ownedNodes, exprNode, data, renderer, skipFirstWrite: false });
    return;
  }

  if (exprNode.literalValue) {
    const value = renderer.evaluator.lookupTokenValue(exprNode.value, data);
    const textNode = document.createTextNode(value ?? '');
    comment.parentNode.replaceChild(textNode, comment);
    return;
  }

  const textNode = document.createTextNode('');
  comment.parentNode.replaceChild(textNode, comment);
  wireTextReaction({ scope, textNode, exprNode, data, renderer, skipFirstWrite: false });
}

// Hydrating text-expression — adopts server-rendered DOM rather than
// rebuilding. The server output merges VALUE with any following static
// text into one text node; split at the boundary so the reactive node
// covers only the value portion.
function hydrateTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;

  if (exprNode.unsafeHTML) {
    const ownedNodes = collectServerSiblings(comment);
    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);
    wireUnsafeHTMLReaction({ scope, anchor, ownedNodes, exprNode, data, renderer, skipFirstWrite: true });
    return;
  }

  const nextNode = comment.nextSibling;
  let textNode;
  if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
    const serverValue = String(renderer.lookupExpression(exprNode.value, data) ?? '');
    if (nextNode.data.length > serverValue.length && nextNode.data.startsWith(serverValue)) {
      nextNode.splitText(serverValue.length);
    }
    textNode = nextNode;
    comment.remove();
  }
  else {
    textNode = document.createTextNode('');
    comment.replaceWith(textNode);
  }
  wireTextReaction({ scope, textNode, exprNode, data, renderer, skipFirstWrite: true });
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
