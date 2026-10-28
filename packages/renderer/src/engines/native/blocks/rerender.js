import { Signal } from '@semantic-ui/reactivity';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#rerender} / {#guard} — both compile to AST node.type === 'rerender'.
  rerender sets node.expression and rebuilds on every wake, a signal the
  expression read or the coarse channel, the value is never compared. guard
  sets node.key and rebuilds only when the key's value changed, by the same
  equality a signal uses to decide it changed.

*/

// the reads register on the block's own reaction, so a signal wakes it the same way a
// coarse pass does, and a function key is invoked
function readKeys({ node, lookupExpression }) {
  if (node.expression) {
    lookupExpression(node.expression);
  }
  return node.key ? lookupExpression(node.key) : undefined;
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

  create() {
    return { key: undefined, equality: Signal.equality };
  },

  render(ctx) {
    ctx.self.key = readKeys(ctx);
    renderContent(ctx);
  },

  hydrate(ctx) {
    ctx.self.key = readKeys(ctx);
    const { node, region, hydrateInto } = ctx;
    if (region.ownedNodes.length > 0 && node.content) {
      hydrateInto({ innerAST: node.content });
    }
  },

  update(ctx) {
    const key = readKeys(ctx);
    if (ctx.node.key && ctx.self.equality(key, ctx.self.key)) {
      return;
    }
    ctx.self.key = key;
    renderContent(ctx);
  },

  evaluateText({ node, data, renderer }) {
    return renderer.evaluateRawTextNodes(node.content, data);
  },
});

registerBlock('rerender', rerender);

export default rerender;
