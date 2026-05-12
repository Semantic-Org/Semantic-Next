import { registerBlock } from './registry.js';

/*

  Raw-text content binding. Synthesized by buildHTMLString for content
  inside <script>, <style>, <textarea>, <title> — elements whose content
  the HTML parser treats as text, not markup, so comment markers and
  per-expression text nodes can't exist inside them. The marker
  (`<!--sui-rawtext:v1:N-->`) sits AFTER the element; this block walks
  back to the element and wires a Reaction that recomputes its
  textContent on each tick.

  Not a region-managing block — no DynamicRegion, no hydrate (server
  emits the resolved textContent directly), no lifecycle beyond the one
  Reaction. Registered via the same registry as other blocks so dispatch
  uniformly routes through getBlock(type).

*/

const rawText = function rawText({ comment, entry, data, scope, renderer }) {
  // Walk back to find the raw-text element. Text nodes / whitespace
  // between are siblings created by parsing — skip them.
  let element = comment.previousSibling;
  while (element && element.nodeType !== Node.ELEMENT_NODE) {
    element = element.previousSibling;
  }
  if (!element) {
    comment.remove();
    return;
  }
  comment.remove();
  scope.reaction(element, () => {
    element.textContent = renderer.evaluateRawTextNodes(entry.nodes, data);
  });
};

registerBlock('rawText', rawText);

export default rawText;
