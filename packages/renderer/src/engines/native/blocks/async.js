import { nonreactive, resource } from '@semantic-ui/reactivity';
import { each, isPlainObject } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { markScopeRange } from '../scope-context.js';
import { registerBlock } from './registry.js';

/*

  {#async ...} — three-state construct (loading / success / error) backed by a
  Resource. The expression runs as the resource's fetcher, so its reads re-fire
  the fetch and the value holds last-good through a refetch. Overlap concurrency
  matches what the block always did: a re-fire starts its fetch immediately and
  the newest run's settle wins, template expressions can't thread an abort signal.
  The block's own reaction reads the faces and renders the branch that matches.

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

// empty fills have no inside to resolve — and stamping one would land the
// END jump on the anchor itself, masking the owner stamp of a later fill
function stampAsyncScope(region, data) {
  if (region.ownedNodes.length === 0) { return; }
  markScopeRange(region.anchor, region.endAnchor || region.getLastNode(), { data });
}

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

const asyncBlock = defineBlock({
  name: 'async',
  syntax: (node) => `{#async ${node.expression}}`,

  // Recovery only when the template includes an error branch. No errorContent
  // means there's nothing useful to render on a sync expression throw — let
  // it propagate.
  shouldRecover: (node) => Boolean(node.errorContent?.length),

  create() {
    return { resource: null, syncThrew: false };
  },

  // the resource owns expression evaluation, its backing reaction tracks the
  // reads. created nonreactive so the block's own re-runs can't tear it down,
  // destroy() owns the teardown instead
  ensureResource({ self, node, lookupExpression }) {
    if (self.resource === null) {
      self.resource = nonreactive(() =>
        resource(() => {
          self.syncThrew = false;
          try {
            return lookupExpression(node.expression);
          }
          catch (error) {
            // flagged so a synchronous throw with no error branch stays loud
            self.syncThrew = true;
            throw error;
          }
        }, { concurrency: 'overlap' })
      );
    }
    return self.resource;
  },

  renderState(ctx, ast, extraData = {}) {
    const { data, scope, region, renderAST, childContext, isSVG } = ctx;
    const stateScope = scope.child();
    const fragment = renderAST({
      ast,
      data: childContext(data, extraData),
      scope: stateScope,
      isSVG,
    });
    region.setContent(fragment, stateScope);
    stampAsyncScope(region, extraData);
  },

  // face-driven branch chooser. the face reads register on the block's own
  // reaction, so a flip re-runs update() without re-evaluating the expression
  renderCurrent(ctx, { preservePending = false } = {}) {
    const { node, self } = ctx;
    const handle = self.resource;
    if (handle.loading) {
      if (preservePending) { return; }
      if (node.loadingContent?.length) {
        this.renderState(ctx, node.loadingContent);
      }
      else if (handle.settled && node.content?.length) {
        // re-show the held value while a new fetch is in flight
        this.renderState(ctx, node.content, createSuccessDataContext(node, handle.get()));
      }
      return;
    }
    const error = handle.error;
    if (error !== undefined) {
      if (node.errorContent?.length) {
        const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
        this.renderState(ctx, node.errorContent, errorData);
      }
      else if (self.syncThrew) {
        throw error;
      }
      return;
    }
    if (!handle.settled) { return; }
    if (node.content?.length) {
      this.renderState(ctx, node.content, createSuccessDataContext(node, handle.get()));
    }
  },

  render(ctx) {
    this.ensureResource(ctx);
    this.renderCurrent(ctx);
  },

  hydrate(ctx) {
    this.ensureResource(ctx);
    // pending keeps the server's loadingContent in place, a sync settle
    // re-renders because the server emitted loading that no longer matches
    this.renderCurrent(ctx, { preservePending: true });
  },

  update(ctx) {
    this.renderCurrent(ctx);
  },

  destroy(ctx) {
    ctx.self.resource?.stop();
  },

  // Sync throws in expression evaluation route here through the block's
  // reaction; promise rejections land in the error face. Both render the
  // same errorContent path.
  error({ err, ...ctx }) {
    const { node } = ctx;
    if (!node.errorContent?.length) { return; }
    const errorData = node.errorAs ? { [node.errorAs]: err } : { this: err };
    this.renderState(ctx, node.errorContent, errorData);
  },
  // No evaluateText: async cannot operate in raw-text contexts (promise
  // lifecycle needs per-invocation state and DOM region tracking the text
  // walker doesn't provide). The walker throws when it encounters a block
  // without evaluateText — see renderer.js evaluateRawTextNodes.
});

registerBlock('async', asyncBlock);

export default asyncBlock;
