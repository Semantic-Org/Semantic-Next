/*

  Sample block — the canonical reference for authoring a new block.

  Not registered, not imported, not exercised by tests. Copy it, rename,
  fill in semantics, then add `registerBlock(name, ...)` + a side-effect
  import in blocks/index.js.

  A block is the dispatch for one AST node type. The compiler emits
  `{ type: 'thing', ... }` for `{#thing}` constructs; the renderer looks
  it up via `getBlock(node.type)(ctx)`. defineBlock wraps a config object
  into that dispatch — full lifecycle (create, render-or-hydrate, update,
  destroy), error recovery, and a DynamicRegion for the DOM slice.

  Config shape (framework-known fields):

    name              required. Header in error logs.
    syntax(node)      optional. Template-source one-liner for logs.
    shouldRecover(node)  optional. Per-node gate for try/catch wrapping.
    create(ctx)       optional. Per-instance setup; returns `self`.
    compute(bag)      shorthand for render+update — returns content AST,
                      framework calls bag.place(compute(bag)) on each
                      tick. Use when both reduce to "pick content, place".
    render(bag)       first mount when compute doesn't fit.
    update(bag)       signal-driven re-tick when compute doesn't fit.
    hydrate(bag)      first mount when server DOM exists. Adopt via
                      bag.hydrateInto({ innerAST }); return matched
                      content so the first update dedups against it.
    destroy(bag)      teardown. Only for resources outside region/scope.
    error(bag)        replacement when a hook throws; bag adds hook + err.
    evaluateText(bag) raw-text fallback (<script>, <style>, <textarea>,
                      <title>); returns a string concatenated into
                      textContent.

  Hooks are invoked as `config.hook(bag)` so `this === config` — author
  helpers on the same object are reachable as `this.helperName(...)`.

  Bag fields:
    node, data, scope, region, isSVG, serverMeta, self,
    place(content)          — dedup-ed AST placement (null clears)
    lookupExpression(expr)  — evaluate + register signal deps
    renderAST({...})        — produce a DocumentFragment
    hydrateInto({...})      — adopt server DOM in the region
    hydrateInnerContent({...}) — adopt without re-anchoring
    childContext(parent, extras) — child data context

*/

import { defineBlock } from '../define-block.js';
// import { registerBlock } from './registry.js';   // intentionally not imported

// Example 1 — compute-shorthand shape (most blocks).
// {#thing expr}content{/thing} picks one of two content variants based
// on `expr`. Demonstrates compute + helper + explicit hydrate.

const sample = defineBlock({
  name: 'thing',
  syntax: (node) => `{#thing ${node.expression}}`,

  // Per-instance state. Stashed on `self` for hot hooks; create receives
  // the full ctx (including renderer) so renderer internals you need
  // repeatedly land here once.
  create({ renderer }) {
    return {
      evaluator: renderer.evaluator,
    };
  },

  // Author helper. Reached from hooks as `this.selectVariant(...)`.
  // Returns a stable AST array reference so bag.place's reference-equality
  // dedup works (same input → same array → no DOM op on update).
  selectVariant(node, lookupExpression) {
    const truthy = lookupExpression(node.expression);
    return truthy ? node.content : node.elseContent;
  },

  // compute synthesizes render + update. Framework calls bag.place(compute(bag))
  // on first mount and on every subsequent signal-driven tick. lookupExpression
  // reads inside compute register the relevant Signal deps on the outer Reaction.
  compute({ node, lookupExpression }) {
    return this.selectVariant(node, lookupExpression);
  },

  // Hydrate has a distinct contract: adopt server DOM, don't rebuild. Returning
  // the matched content lets the framework dedup the first compute-driven update
  // tick against it (so we don't re-render over server bytes when nothing changed).
  hydrate({ node, region, lookupExpression, hydrateInto }) {
    const matched = this.selectVariant(node, lookupExpression);
    if (region.ownedNodes.length > 0 && matched) {
      hydrateInto({ innerAST: matched });
    }
    return matched;
  },

  // Raw-text fallback for <script>/<style>/<textarea>/<title>. Throw or
  // return a string. Omit for blocks that don't make sense in raw text
  // (async, each); the walker will throw on encounter.
  evaluateText({ node, data, renderer }) {
    const truthy = renderer.lookupExpression(node.expression, data);
    const content = truthy ? node.content : node.elseContent;
    return content ? renderer.evaluateRawTextNodes(content, data) : '';
  },
});

// Example 2 — explicit render/update when compute doesn't fit.
// Blocks like each (keyed reconciliation), async (promise state machine),
// or rerender (always-rebuild) can't synthesize update from compute —
// their render and update bodies genuinely differ. Sketch:
//
//   defineBlock({
//     name: 'manualLifecycle',
//     create({ renderer }) { return { items: [] }; },
//     render({ node, data, scope, region, renderAST, self }) {
//       // build from scratch, allocate per-item state, etc.
//       const childScope = scope.child();
//       const fragment = renderAST({ ast: node.content, scope: childScope });
//       region.setContent(fragment, childScope);
//     },
//     update({ node, data, region, self }) {
//       // reconcile against self.items rather than rebuilding from scratch
//     },
//     hydrate({ region, hydrateInto }) {
//       hydrateInto({ innerAST: node.content });
//       // no return — this block doesn't use compute, so no need to record on place
//     },
//     destroy({ self }) {
//       // release external resources only — region/scope cleanup is automatic
//     },
//   });

/*
  NOT REGISTERED. A real block ends with:

    registerBlock('thing', sample);

  and an import in blocks/index.js so the registration runs at startup.
  This file omits both so it stays purely documentary.
*/

export default sample;
