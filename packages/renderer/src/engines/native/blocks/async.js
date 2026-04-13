import { each, isPlainObject, isPromise } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#async ...} — three-state construct (loading / success / error). The
  generation counter on self discards stale promise resolutions: each
  re-evaluation bumps self.generation, and pending .then/.catch callbacks
  bail out if their captured generation is less than the current one.

  States:
  • sync value            → render node.content with success data context
  • pending promise       → render node.loadingContent (fresh mount/update)
                           server preserves its rendered loadingContent on hydrate
  • resolved promise      → render node.content with value
  • rejected promise      → render node.errorContent with error (or no-op if absent)

  Data context shape for success comes from createSuccessDataContext:
  • node.as          → { [node.as]: value }
  • node.parts       → { ...destructured props, [node.rest]: restObj }
  • neither          → { this: value }

*/

function createSuccessDataContext(node, value) {
  if (node.as) { return { [node.as]: value }; }
  if (node.parts && isPlainObject(value)) {
    const data = {};
    each(node.parts, (prop) => {
      if (prop in value) { data[prop] = value[prop]; }
    });
    if (node.rest) {
      const restObj = { ...value };
      each(node.parts, (prop) => delete restObj[prop]);
      data[node.rest] = restObj;
    }
    return data;
  }
  return { this: value };
}

// Shared helper invoked from render/update: evaluates the expression,
// fans out to loading/success/error based on result shape. On hydrate the
// server already rendered the current state, so we skip the synchronous
// loadingContent re-render (see hydrate hook).
function evaluateAndRender(ctx, { skipLoadingRender = false } = {}) {
  const { node, data, scope, region, renderAST, lookupExpression, self, isSVG } = ctx;
  const result = lookupExpression(node.expression);
  const currentGen = ++self.generation;

  const renderState = (ast, extraData = {}) => {
    const stateScope = scope.child();
    const fragment = renderAST({
      ast,
      data: { ...data, ...extraData },
      scope: stateScope,
      isSVG,
    });
    region.setContent(fragment, stateScope);
  };

  if (isPromise(result)) {
    if (!skipLoadingRender) {
      if (node.loadingContent?.length) {
        renderState(node.loadingContent);
      }
      else if (self.hasResolved && node.content?.length) {
        renderState(node.content, createSuccessDataContext(node, self.resolvedValue));
      }
    }

    result.then((value) => {
      if (currentGen < self.generation) { return; }
      self.resolvedValue = value;
      self.hasResolved = true;
      renderState(node.content, createSuccessDataContext(node, value));
    }).catch((error) => {
      if (currentGen < self.generation) { return; }
      if (node.errorContent?.length) {
        const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
        renderState(node.errorContent, errorData);
      }
    });
  }
  else {
    self.resolvedValue = result;
    self.hasResolved = true;
    renderState(node.content, createSuccessDataContext(node, result));
  }
}

function renderErrorState(ctx, err) {
  const { node, data, scope, region, renderAST, isSVG } = ctx;
  if (!node.errorContent?.length) { return; }
  const stateScope = scope.child();
  const errorData = node.errorAs ? { [node.errorAs]: err } : { this: err };
  const fragment = renderAST({
    ast: node.errorContent,
    data: { ...data, ...errorData },
    scope: stateScope,
    isSVG,
  });
  region.setContent(fragment, stateScope);
}

const asyncBlock = defineBlock({
  name: 'async',

  // Recovery only when the template includes an error branch. No errorContent
  // means there's nothing useful to render on a sync expression throw — let
  // it propagate.
  shouldRecover: (node) => Boolean(node.errorContent?.length),

  create() {
    return { generation: 0, hasResolved: false, resolvedValue: null };
  },

  render(ctx) {
    evaluateAndRender(ctx);
  },

  hydrate(ctx) {
    // Server rendered the current state; preserve it if the expression is
    // still a promise. Sync values re-render with success (server used
    // loadingContent).
    evaluateAndRender(ctx, { skipLoadingRender: true });
  },

  update(ctx) {
    evaluateAndRender(ctx);
  },

  // Sync throws in expression evaluation route here; promise rejections are
  // handled inside evaluateAndRender's .catch. Both end up rendering the
  // same errorContent path.
  error({ err, ...ctx }) {
    renderErrorState(ctx, err);
  },
});

registerBlock('async', asyncBlock);

export default asyncBlock;
