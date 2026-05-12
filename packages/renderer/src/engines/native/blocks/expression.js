import { isBlockClose, isBlockOpen, isExpressionMarker } from '../../../build-html-string.js';
import { unsafeHTML } from '../commit-hooks.js';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  Expression block — text-position dispatch.

  Opts into defineBlock's lean value-emitter path via `type: 'value'`. The
  renderer skips DynamicRegion allocation for this shape; the dispatch
  manages a single anchor text node (which IS the value text node in the
  primitive case) and an ownedNodes list for unsafeHTML payloads.

  Compute has two node-flag branches plus a default path:
    • unsafeHTML   — wrap evaluated value as `unsafeHTML(value)`; the
                     dispatch parses the string as HTML and inserts the
                     parsed nodes as ownedNodes after the anchor.
    • literalValue — read via lookupTokenValue (no auto-invoke for
                     functions). Used by `{#fn handler}` so the function
                     reference isn't called for its return value.
    • default      — read via renderer.lookupExpression; return as a
                     primitive; the dispatch writes anchor.data.

  Attribute-position expressions are NOT dispatched here — they're walked
  by bindAttribute in attribute-binding.js as part of an attribute's
  combined parts evaluation. One Reaction owns the full attribute string
  regardless of how many markers it contains.

*/

const expression = defineBlock({
  name: 'expression',
  type: 'value',
  syntax: (node) => `{${node.value}}`,

  // {#fn marker} returns a function reference as-is. There's no path that
  // reads a Signal during compute, so the dispatch skips Reaction wiring
  // entirely for these markers.
  static: (node) => Boolean(node.literalValue),

  // No `create` hook — renderer.evaluator is reached directly via the bag.
  // The literalValue path uses `lookupTokenValue` because it doesn't
  // auto-invoke functions (needed for `{#fn handler}` and event-binding
  // shapes where the value is a function reference, not its call result).
  compute({ node, data, renderer }) {
    if (node.literalValue) {
      return renderer.evaluator.lookupTokenValue(node.value, data);
    }
    const value = renderer.lookupExpression(node.value, data);
    if (node.unsafeHTML) {
      return unsafeHTML(value);
    }
    return value;
  },

  // Hydrate adopts the server-rendered DOM rather than rebuilding. Returns
  // { anchor, ownedNodes } — anchor becomes the dispatch's reactive text
  // node; ownedNodes (unsafeHTML only) tracks the parsed payload for
  // replacement on update.
  //
  // For default text expressions the server emits `<!--sui:v1:N-->VALUE`
  // where VALUE may merge with following static text into one text node —
  // we split at the boundary so the reactive node covers only VALUE. For
  // unsafeHTML the server emitted the parsed HTML payload as siblings; we
  // collect them as ownedNodes and replace the comment with an empty
  // positional anchor.
  hydrate({ node, data, renderer, comment }) {
    if (node.literalValue) {
      const value = renderer.evaluator.lookupTokenValue(node.value, data);
      const anchor = this.adoptValueTextNode(comment, String(value ?? ''));
      return { anchor, ownedNodes: null };
    }

    if (node.unsafeHTML) {
      const ownedNodes = this.collectServerSiblings(comment);
      const anchor = document.createTextNode('');
      comment.parentNode.replaceChild(anchor, comment);
      return { anchor, ownedNodes };
    }

    const serverValue = String(renderer.lookupExpression(node.value, data) ?? '');
    const anchor = this.adoptValueTextNode(comment, serverValue);
    return { anchor, ownedNodes: null };
  },

  // Walk forward from `from` collecting siblings until the next sui marker
  // (open block, close block, or expression). These are the server-emitted
  // payload nodes belonging to the current expression.
  collectServerSiblings(from) {
    const collected = [];
    let next = from.nextSibling;
    while (
      next && !(next.nodeType === Node.COMMENT_NODE
        && (isExpressionMarker(next.data) || isBlockOpen(next.data) || isBlockClose(next.data)))
    ) {
      collected.push(next);
      next = next.nextSibling;
    }
    return collected;
  },

  // Adopt (or create) the text node that holds this expression's value,
  // replacing the comment marker. For server-hydrated cases, the text
  // node sits right after the comment and may include trailing static
  // text — split at the serverValue boundary so the reactive node covers
  // only the value.
  adoptValueTextNode(comment, serverValue) {
    const nextNode = comment.nextSibling;
    let textNode;
    if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
      if (nextNode.data.length > serverValue.length && nextNode.data.startsWith(serverValue)) {
        nextNode.splitText(serverValue.length);
      }
      textNode = nextNode;
      comment.remove();
    }
    else {
      textNode = document.createTextNode(serverValue);
      comment.replaceWith(textNode);
    }
    return textNode;
  },
});

registerBlock('expression', expression);

export default expression;
