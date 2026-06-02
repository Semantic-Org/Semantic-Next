import { guard } from '@semantic-ui/reactivity';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#rerender} / {#guard} — both compile to AST node.type === 'rerender'.
  Guard sets node.key (deep-equality-gated re-render via guard);
  rerender sets node.expression (any-signal-change re-render via plain
  lookupExpression).

*/

function trackDeps({ node, data, lookupExpression, self }) {
  if (node.key) {
    guard(() => self.evaluator.lookupTokenValue(node.key, data));
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

  create({ renderer }) {
    // Capture evaluator so hooks can call lookupTokenValue for the
    // single-token node.key path — the hook bag doesn't expose it.
    return { evaluator: renderer.evaluator };
  },

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
