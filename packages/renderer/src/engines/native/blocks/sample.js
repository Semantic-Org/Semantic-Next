/*

  Sample block — reference shape for agents writing a new block.

  Not registered. Not imported from index.js. Not exercised by tests. This
  file exists solely to memorialize the patterns a real block needs and the
  decisions behind them. Read this end-to-end before touching the others.

  WHY A NEW BLOCK NEEDS DEFINEBLOCK INSTEAD OF AN INLINE SWITCH IN RENDERER

  Every {#thing} construct compiles to an AST node with type === 'thing'
  and lands here at dispatch time. defineBlock() returns a dispatch function
  that owns the full lifecycle (create → render | hydrate → update* →
  destroy) including error machinery and the breadcrumb path. Inline
  switches in renderer.js predate this and are the thing the refactor was
  retiring; don't add new cases to that switch.

  WHEN TO ADD A NEW BLOCK

  When the construct needs a DOM region of its own — a slice of nodes whose
  lifecycle is independent of the surrounding template (mount/unmount,
  reactive boundaries, hydration claim). If the construct is a pure
  expression with no region, dispatch via the registry as `'expression'`, not a
  block.

*/

import { defineBlock } from '../define-block.js';
// import { registerBlock } from './registry.js';   // intentionally not imported

const sample = defineBlock({
  // The name appears in the structured error log header. Match the AST
  // node.type the compiler produces for this construct.
  name: 'sample',

  /*
    syntax(node) — optional. Returns the template-source representation of
    this block instance for the error log. One-liner per block; the
    log header becomes `[sui] {name} {syntax(node)}`. Skip if you don't
    need the per-instance attribution — the header falls back to just the
    block name.
  */
  syntax: (node) => `{#sample ${node.expression}}`,

  /*
    shouldRecover(node) — optional. Gates whether the dispatch wraps each
    hook in try/catch. Return false for AST shapes that can't usefully
    recover (e.g., async with no errorContent — there's nothing to render
    on a throw, so let it propagate loudly). Default: recover when the
    block has an error hook.
  */
  shouldRecover: (node) => Boolean(node.errorContent?.length),

  /*
    create(ctx) — called once per block instance. Returns the per-instance
    state object that subsequent hooks see as `self`. The full dispatch
    context (renderer included) is only passed to create(); other hooks get
    the smaller "bag" (see below). This is the seam for stashing renderer
    internals onto self so hot hooks don't reach through scope.

    Two-level context: dispatch-level bag → hook-level bag.
    Stash here:                       Read in render/update:
      self.evaluator = renderer.evaluator     self.evaluator
      self.snippets  = renderer.snippets      self.snippets
      ...

    DO NOT mutate the input context. DO NOT rely on properties that aren't
    documented in the dispatch ctx — they can change without notice.
  */
  create({ renderer }) {
    return {
      evaluator: renderer.evaluator,
      // Initialize any state used across hooks. Keep this small — anything
      // you stash here lives until destroy(). Closures captured here are
      // GC-eligible only when self goes out of scope.
      generation: 0,
      lastValue: null,
    };
  },

  /*
    SHORTHAND: compute(bag) → content
    ---------------------------------
    When render and update have the same body — select content based on
    data, return the AST to render — `compute` collapses both into one
    function. Framework synthesizes `render(bag) → bag.place(compute(bag))`
    and `update(bag) → bag.place(compute(bag))`. bag.place handles the
    child-scope allocation + renderAST + region.setContent sequence and
    dedups via reference equality on the returned content (same AST
    reference → no DOM op).

    Use compute when the block always rebuilds-on-change (conditional,
    match-style branching). Don't use compute when:
      • render-vs-update semantics genuinely differ (each: build vs
        reconcile; async: initial state vs promise-resolution)
      • the block needs to mutate-in-place rather than rebuild
      • dedup is wrong (rerender: forces re-render on every dep change)

    `bag.place(null)` clears the region. `bag.place.prime(content)` sets
    lastContent without performing the DOM op — used in hydrate after
    adopting server DOM so the first compute-driven update post-hydrate
    dedups correctly.

    Example (the simplest possible compute block):

      compute({ node, lookupExpression }) {
        return lookupExpression(node.condition) ? node.content : null;
      }

    Authors who want compute's brevity but a different dedup strategy
    can return a wrapper object — reference equality compares the
    wrapper, not the inner AST.

    The sample below uses explicit render/hydrate/update to show the
    full surface. For a single-body block, replace render+update with a
    compute hook.
  */

  /*
    render(bag) — first mount on the client (no server-rendered DOM to
    adopt). The bag has node, data, scope, region, isSVG, serverMeta,
    self, plus the closures lookupExpression / renderAST / place /
    hydrateInnerContent / hydrateInto. Use them; don't pull from
    anywhere else.

    Pattern: build a fragment via renderAST(), put it in the region via
    region.setContent(fragment, optionalChildScope). The region owns DOM
    cleanup; the child scope owns reaction cleanup. Or use bag.place to
    delegate both — it's region.setContent(renderAST(content, childScope),
    childScope) packaged with dedup.

    Reactivity: any lookupExpression() call inside this hook registers
    deps on the current Reaction (the one defineBlock created around all
    hooks). When tracked signals change, update() fires — never render()
    again on the same instance.
  */
  render({ node, data, scope, region, renderAST, lookupExpression, childContext, self }) {
    const value = lookupExpression(node.expression);
    self.lastValue = value;
    self.generation++;

    const childScope = scope.child();
    const fragment = renderAST({
      ast: node.content,
      data: childContext(data, { sampleValue: value }),
      scope: childScope,
    });
    region.setContent(fragment, childScope);
  },

  /*
    hydrate(bag) — adopt server-rendered DOM instead of building from
    scratch. The region.ownedNodes array is pre-populated with the slice
    of DOM the server emitted between this block's opening and closing
    markers. Your job:

      1. Register the same Signal deps render() would (so update() fires
         later) — usually a single lookupExpression() call on the same
         expression render() reads.
      2. Hand the inner content to hydrateInto() — it creates the child
         scope, walks inner markers, reattaches into the region, and
         sets region.endAnchor.
      3. If the block also uses `compute`, prime bag.place with the
         matched content via `bag.place.prime(content)` so the first
         compute-driven update post-hydrate dedups (avoids an
         unnecessary server-DOM swap when nothing changed).

    DO NOT call renderAST() from hydrate — that builds fresh DOM and
    discards the server's. The whole point of hydrate is to keep the
    server's bytes. hydrate stays as an explicit hook even when render
    and update are synthesized from `compute` — its contract is
    structurally different and can't be unified.

    serverMeta contains anything the ServerRenderer wrote into the
    closing block marker (see parseServerMeta in build-html-string.js
    for the prefix scheme). Use it for branch selection, key recovery,
    etc.
  */
  hydrate({ node, data, region, lookupExpression, hydrateInto, childContext, self }) {
    const value = lookupExpression(node.expression);
    self.lastValue = value;
    self.generation++;

    if (region.ownedNodes.length > 0 && node.content) {
      hydrateInto({ innerAST: node.content, data: childContext(data, { sampleValue: value }) });
    }
  },

  /*
    update(bag) — fires on every reaction tick after first render/hydrate.
    Same bag shape as render, plus self carries forward across ticks.

    Decide here whether to:
      • mutate in place (cheap — preferred for value swaps)
      • rebuild via region.setContent() with a fresh child scope
        (correct when the AST shape inside might change, e.g., {#if}
        switching branches)

    Don't dispose self; defineBlock owns its lifetime via destroy().
  */
  update({ node, data, scope, region, renderAST, lookupExpression, childContext, self }) {
    const value = lookupExpression(node.expression);
    if (value === self.lastValue) { return; } // common bail-out
    self.lastValue = value;
    self.generation++;

    const childScope = scope.child();
    const fragment = renderAST({
      ast: node.content,
      data: childContext(data, { sampleValue: value }),
      scope: childScope,
    });
    region.setContent(fragment, childScope);
  },

  /*
    destroy(bag) — fires when the parent scope disposes (template
    unmounted, parent block re-rendered, etc.). The reaction is already
    being torn down; region.clear() runs after this returns. You only need
    to release things defineBlock can't reach: external listeners,
    timers, manually-attached DOM outside the region, etc.

    Throws here propagate. Stranding sibling cleanup is the deliberate
    trade — silent recovery hides destroy bugs harder than DOM leaks do.
  */
  destroy({ self }) {
    // Release anything attached outside the region or scope here.
    // self.timer && clearInterval(self.timer);
    void self;
  },

  /*
    error({ err, hook, ...bag }) — optional. When defined AND wantsRecovery
    is true, takes over after a hook throws. The bag is extended with
    { hook, err } telling you which hook threw and why. Decide what to
    render — typically an error template or a fallback fragment.

    If you don't define error(), the default-isolate path runs:
    region.clear() + comp.stop() so the failed instance stops re-firing.

    Throws inside error() are not recovered — they propagate and the
    breadcrumb fires for the error hook. Don't throw from here.
  */
  error({ err, hook, region, scope, renderAST, node }) {
    if (!node.errorContent?.length) {
      region.clear();
      return;
    }
    const errorScope = scope.child();
    const fragment = renderAST({
      ast: node.errorContent,
      data: { error: err, errorHook: hook },
      scope: errorScope,
    });
    region.setContent(fragment, errorScope);
  },

  /*
    evaluateText({ node, data, renderer }) — optional. Defines how this
    block behaves inside raw-text contexts: <script>, <style>, <textarea>,
    <title>. These elements parse content as text, not markup; there's
    no live DOM, no comment markers, no reactive regions. The walker
    calls evaluateText synchronously and concatenates the returned string
    into textContent.

    DECISION TREE — do you implement evaluateText for your block?

      Implement when the block's semantics reduce cleanly to "recompute
      textContent each tick":
        • {#if}        — pick a branch, recurse via evaluateRawTextNodes
        • {#each}      — loop, recurse per item
        • {>name}      — expand snippet/template, recurse
        • {#rerender}  — re-evaluate deps, recurse on content

      Don't implement when the block needs an asynchronous lifecycle, a
      live DOM region, or per-invocation state the text walker can't
      provide:
        • {#async}     — promise lifecycle can't survive textContent.

      The walker throws when it encounters a block without evaluateText
      ("{#name} cannot be rendered inside raw-text contexts ..."), so
      misuse surfaces as a hard error at render time. No silent no-ops,
      no per-block warning machinery.

    The renderer argument exposes evaluateRawTextNodes(nodes, data) for
    recursing into child AST. Use it instead of reimplementing the walker.
  */
  evaluateText({ node, data, renderer }) {
    const value = renderer.lookupExpression(node.expression, data);
    void value;
    return renderer.evaluateRawTextNodes(node.content, data);
  },
});

/*
  NOT REGISTERED. A real block ends with:

    registerBlock('sample', sample);

  and is added to blocks/index.js so the side-effect import wires it into
  the registry at startup. This file omits both so it stays purely
  documentary. Copy this file, rename it, fill in real semantics, add the
  registerBlock call, and add the import to index.js.
*/

export default sample;
