/*

  Sample block — the canonical reference for authoring a new block.

  Not registered. Not imported from index.js. Not exercised by tests. This
  file exists solely to memorialize what a block looks like end-to-end.
  Copy it, rename, fill in real semantics, and add the registerBlock call
  + side-effect import in blocks/index.js.

  ================================================================
  WHAT A BLOCK IS
  ================================================================

  Every {#thing} construct compiles to an AST node with type === 'thing'
  and arrives at the renderer's dispatch via the block registry:

      getBlock(node.type)(ctx)

  A block's job is to produce DOM (or update existing DOM) for its slice
  of the AST and keep that DOM reactive against the live signal graph.
  defineBlock() wraps a config object into a dispatch function that owns
  the full lifecycle — create, render-or-hydrate at mount, update on
  signal changes, destroy at teardown — plus error machinery and a
  region for the block's DOM.

  ================================================================
  WHEN TO ADD ONE
  ================================================================

  Add a block when a construct needs a DOM slice with its own lifecycle:
  mount/unmount, reactive boundary, hydration claim. Pure inline values
  with no region are handled by the expression block (already registered
  as `'expression'`) — most {expression} usage doesn't need a new block.

  ================================================================
  THE CONFIG SHAPE
  ================================================================

  Recognized fields — the framework knows these by name:

    Identity / diagnostics
      name              required. Appears in the structured error log header.
      syntax(node)      optional. One-liner that renders the template-source
                        form for the log header.
      shouldRecover(node)  optional. Per-node gate for try/catch wrapping.

    State
      create(ctx)       optional. Per-instance setup. Receives the full
                        dispatch ctx (including renderer); other hooks get
                        the smaller bag. Stash anything hot hooks need into
                        the returned `self` object.

    Body (pick one shape)
      compute(bag)      shorthand. Returns the AST array to place. Framework
                        synthesizes render and update as `bag.place(compute(bag))`.
                        Use when render and update both reduce to "pick
                        content, place it" and content is stable per matched
                        branch (dedup via reference equality).
      render(bag)       first mount. Build DOM, call `bag.place(content)` or
                        wire it directly via `bag.region`.
      update(bag)       fires on each signal-driven re-tick after first mount.

    Hydration
      hydrate(bag)      first mount when server-rendered DOM exists. Adopt
                        the DOM via `bag.hydrateInto({ innerAST })`, return
                        the matched content AST so the framework records it
                        on `bag.place` (so the first compute-driven update
                        dedups instead of re-rendering over server bytes).

    Lifecycle
      destroy(bag)      optional. Fires when the parent scope disposes. Only
                        needed for resources outside the region/scope —
                        external listeners, timers, manually-attached DOM.

    Error machinery
      error(bag)        optional. Replacement rendering when a hook throws.
                        bag is extended with { hook, err }.

    Raw-text contexts
      evaluateText(bag) optional. Defines behavior inside <script>, <style>,
                        <textarea>, <title>. The walker calls it synchronously
                        and concatenates the returned string into textContent.

  Helper methods / fields outside the recognized list are author code. The
  framework invokes hooks as `config.hook(bag)` so `this === config` inside
  each hook; helpers are reachable as `this.helperName(...)`. See
  blocks/conditional.js (`selectBranch`) for a worked example.

  ================================================================
  THE BAG
  ================================================================

  Hooks receive a bag with these closures (read; don't reach elsewhere):

    node                the AST node for this block instance
    data                current data context
    scope               ReactionScope for this block's reactivity + cleanup
    region              DynamicRegion the block owns (text-position only)
    isSVG               SVG namespace flag
    serverMeta          payload from the closing block marker (e.g. branchIndex)
    self                per-instance state returned by create()
    place(content)      framework-owned text-position placement; dedups via
                        reference equality; null clears the region
    lookupExpression    (expr) => evaluated value, registers Signal deps on
                        the surrounding Reaction
    renderAST           ({ ast, scope?, data?, isSVG? }) => DocumentFragment
    hydrateInto         ({ innerAST, data?, scope?, asChild? }) — adopt
                        server DOM in the region; wires per-marker Reactions
                        against the existing bytes
    hydrateInnerContent ({ ownedNodes, innerAST, data?, scope? }) — adopt
                        without re-anchoring (less common)
    childContext        (parent, extras) => child data context

  Inside render/update/hydrate/destroy/error: `this === config`. Helpers on
  the config (this file's `selectMatchingThing` below) are reachable via
  `this.helperName(...)`.

  ================================================================
  V8 NOTES
  ================================================================

  defineBlock builds the config once at module load. All dispatches share
  that same object, so `this`'s shape is stable across every hook call —
  inline caches resolve `this.helperName` to the underlying function on the
  first call and stay monomorphic. Same goes for hot bag fields. Keep the
  config flat; don't mutate it after construction.

*/

import { defineBlock } from '../define-block.js';
// import { registerBlock } from './registry.js';   // intentionally not imported

// ============================================================
// EXAMPLE: the compute-shorthand shape (most blocks)
// ============================================================
//
// Hypothetical block: {#thing expr}content{/thing} — picks one of two
// content variants based on `expr`. Demonstrates compute + a helper +
// explicit hydrate.

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

// ============================================================
// EXAMPLE 2: explicit render/update when compute doesn't fit
// ============================================================
//
// Blocks like each (keyed reconciliation), async (promise state machine),
// or rerender (always-rebuild semantics) can't synthesize update from
// compute. Their render and update bodies genuinely differ. Sketch:
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
