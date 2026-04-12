import { Reaction } from '@semantic-ui/reactivity';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#rerender} / {#guard} — both compile to AST node.type === 'rerender'.
  Guard sets node.key (deep-equality-gated re-render); rerender sets
  node.expression (any-signal-change re-render). Both are handled here.

  Behavior:
  • render: register deps + render node.content into a child scope
  • hydrate: adopt server-rendered DOM, register deps, no DOM work
    (inner markers are pre-hydrated by Renderer.hydrateBlockDirective
    before dispatch — this will move to the block in step 3)
  • update: re-register deps, rebuild content fresh into a new child scope

  Reaction.guard wraps node.key reads so the reaction only re-fires on
  value change (stable-key semantics), while node.expression uses plain
  lookupExpression so any signal change triggers re-render.

*/

const rerender = defineBlock({
  name: 'rerender',

  create({ renderer }) {
    // Capture the evaluator so hooks can call lookupTokenValue for the
    // single-token node.key path. The 9-key hook bag doesn't expose
    // lookupTokenValue; this is the create() seam the plan names.
    return { evaluator: renderer.evaluator };
  },

  render({ node, data, scope, region, renderAST, lookupExpression, self }) {
    if (node.key) {
      Reaction.guard(() => self.evaluator.lookupTokenValue(node.key, data));
    }
    if (node.expression) {
      lookupExpression(node.expression);
    }

    const childScope = scope.child();
    const fragment = renderAST({ ast: node.content, scope: childScope });
    region.setContent(fragment, childScope);
  },

  hydrate({ node, data, scope, region, lookupExpression, hydrateInnerContent, self }) {
    if (node.key) {
      Reaction.guard(() => self.evaluator.lookupTokenValue(node.key, data));
    }
    if (node.expression) {
      lookupExpression(node.expression);
    }

    // Adopt server DOM: hydrate inner markers against node.content, then move
    // nodes into the region so setContent can replace them on updates.
    // hydrateInnerContent rebuilds region.ownedNodes in-place with the
    // hydrated references; the subsequent fragment insertion moves those
    // same nodes into the DOM after the region's anchor.
    if (region.ownedNodes.length > 0 && node.content) {
      const innerScope = scope.child();
      region.childScopes.push(innerScope);
      hydrateInnerContent({ ownedNodes: region.ownedNodes, innerAST: node.content, data, scope: innerScope });
      const frag = document.createDocumentFragment();
      for (const n of region.ownedNodes) { frag.appendChild(n); }
      region.anchor.after(frag);
    }
  },

  update({ node, data, scope, region, renderAST, lookupExpression, self }) {
    if (node.key) {
      Reaction.guard(() => self.evaluator.lookupTokenValue(node.key, data));
    }
    if (node.expression) {
      lookupExpression(node.expression);
    }

    const childScope = scope.child();
    const fragment = renderAST({ ast: node.content, scope: childScope });
    region.setContent(fragment, childScope);
  },
});

registerBlock('rerender', rerender);

export default rerender;
