import { isBlockClose, isBlockOpen, isExpressionMarker } from '../../../build-html-string.js';
import { unsafeHTML } from '../commit-hooks.js';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  Expression block — text-position dispatch.

  Every text-position `{expression}` reaches the renderer through this
  block via the standard defineBlock contract: framework constructs a
  DynamicRegion, wires the outer Reaction, calls compute → place. No
  separate "value-emitting" dispatch shape — the bag.place primitive is
  polymorphic on content type (primitive → text-node write; unsafeHTML
  wrapper → parse-and-insert; AST array → renderAST + setContent).

  Three node flags compute branches on:
    • unsafeHTML  — wrap evaluated value as `unsafeHTML(value)`; place
                    parses the string as HTML and inserts the parsed
                    nodes as region.ownedNodes.
    • literalValue — read via lookupTokenValue (no auto-invoke for
                    functions). Used by `{#fn handler}` so the function
                    reference isn't called for its return value.
    • default     — read via lookupExpression; return as a primitive;
                    place writes a single owned text node.

  Attribute-position expressions are NOT dispatched here — they're walked
  by bindAttribute in attribute-binding.js as part of an attribute's
  combined parts evaluation. One Reaction owns the full attribute string
  regardless of how many markers it contains.

*/

const expression = defineBlock({
  name: 'expression',
  syntax: (node) => `{${node.value}}`,

  compute({ node, data, renderer, lookupExpression }) {
    if (node.literalValue) {
      return renderer.evaluator.lookupTokenValue(node.value, data);
    }
    const value = lookupExpression(node.value);
    if (node.unsafeHTML) {
      return unsafeHTML(value);
    }
    return value;
  },

  // Hydrate adopts the server-rendered DOM rather than rebuilding. For
  // default text expressions the server emits `<!--sui:v1:N-->VALUE` and
  // the text node may concatenate VALUE with following static text — we
  // split at the server-value boundary so the reactive node covers only
  // VALUE. For unsafeHTML the server emitted the parsed HTML payload as
  // siblings; we adopt them via region.ownedNodes. The matched content
  // is returned so defineBlock primes place via match() — first
  // compute-driven update tick then dedups instead of re-rendering.
  hydrate({ node, data, region, renderer, lookupExpression }) {
    if (node.literalValue) {
      // One-shot; nothing reactive to set up. Adopt the server text node
      // (or create one if missing) so place finds it on later writes.
      const value = renderer.evaluator.lookupTokenValue(node.value, data);
      this.adoptValueTextNode(region, String(value ?? ''));
      return value;
    }

    if (node.unsafeHTML) {
      // Collect server-emitted siblings up to the next sui marker as
      // ownedNodes. place's unsafeHTML branch clears/replaces ownedNodes
      // on subsequent writes; pre-populating here is the adopt step.
      region.ownedNodes = this.collectServerSiblings(region.anchor);
      if (region.ownedNodes.length > 0) { region.placeEndAnchor(); }
      return unsafeHTML(lookupExpression(node.value));
    }

    const serverValue = String(lookupExpression(node.value) ?? '');
    this.adoptValueTextNode(region, serverValue);
    return serverValue;
  },

  // ---- helpers ----

  // Walk forward from `anchor` collecting siblings until the next sui
  // marker (open block, close block, or expression). These are the
  // server-emitted payload nodes belonging to the current region.
  collectServerSiblings(anchor) {
    const collected = [];
    let next = anchor.nextSibling;
    while (
      next && !(next.nodeType === Node.COMMENT_NODE
        && (isExpressionMarker(next.data) || isBlockOpen(next.data) || isBlockClose(next.data)))
    ) {
      collected.push(next);
      next = next.nextSibling;
    }
    return collected;
  },

  // Find or create the single text node that holds this expression's
  // value. For server-hydrated cases, the server's text node sits right
  // after the anchor and may include trailing static text — split at the
  // serverValue boundary so the reactive node covers only the value.
  adoptValueTextNode(region, serverValue) {
    const nextNode = region.anchor.nextSibling;
    let textNode;
    if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
      if (nextNode.data.length > serverValue.length && nextNode.data.startsWith(serverValue)) {
        nextNode.splitText(serverValue.length);
      }
      textNode = nextNode;
    }
    else {
      textNode = document.createTextNode(serverValue);
      region.anchor.after(textNode);
    }
    region.ownedNodes = [textNode];
    region.placeEndAnchor();
  },
});

registerBlock('expression', expression);

export default expression;
