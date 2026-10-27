import { guard } from '@semantic-ui/reactivity';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#rerender} / {#guard} — both compile to AST node.type === 'rerender'.
  rerender sets node.expression and rebuilds whenever anything the expression
  read fires, the value is never compared. guard sets node.key and rebuilds
  only when the key's value changed, by deep equality.

*/

// both read through lookupExpression so a function key is invoked and a plain key
// updated through the coarse channel reaches the block
function trackDeps({ node, lookupExpression }) {
  if (node.key) {
    guard(() => lookupExpression(node.key));
  }
  if (node.expression) {
    lookupExpression(node.expression);
  }
}

function renderContent({ node, scope, region, renderAST }) {
  const childScope = scope.child();
  const fragment = renderAST({ ast: node.content, scope: childScope });
  region.setContent(fragment, childScope);
}

const rerender = defineBlock({
  name: 'rerender',
  syntax: (node) =>
    node.expression
      ? `{#rerender ${node.expression}}`
      : node.key
      ? `{#guard ${node.key}}`
      : '{#rerender}',

  render(ctx) {
    trackDeps(ctx);
    renderContent(ctx);
  },

  hydrate(ctx) {
    trackDeps(ctx);
    const { node, region, hydrateInto } = ctx;
    if (region.ownedNodes.length > 0 && node.content) {
      hydrateInto({ innerAST: node.content });
    }
  },

  update(ctx) {
    trackDeps(ctx);
    renderContent(ctx);
  },

  evaluateText({ node, data, renderer }) {
    return renderer.evaluateRawTextNodes(node.content, data);
  },
});

registerBlock('rerender', rerender);

export default rerender;
