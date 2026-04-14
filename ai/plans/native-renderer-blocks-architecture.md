# Native Renderer Block Architecture

> **Terminology note:** the paired-syntax template constructs (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`, `{>template}`, `{#snippet}`) are called **blocks** throughout this plan. Matches SUI's existing internal naming (`bindBlockDirective` already uses "block" as the noun), matches how users describe them ("if block", "each block"), and avoids "directive" which means attribute-level constructs in Vue/Lit/Angular.

## Goal

Decompose the native renderer's 1700-line monolith into self-contained block modules using a `defineBlock` pattern that mirrors `defineComponent`. Each block type becomes its own file with standardized lifecycle hooks. Hydration collapses from separate methods into an initialization mode within the same block.

## Design

### `defineBlock` — the block contract

Parallels `defineComponent`: a single function call with a config object. Named lifecycle hooks, each receiving the same destructured args — take what you need.

```js
export default defineBlock({
  name: 'conditional',

  create({ node }) {
    return { branchIndex: -1 };
  },

  render({ self, node, scope, region, evaluate, renderAST }) {
    const result = self.getBranch();
    self.branchIndex = result.matchIndex;
    if (result.contentAST) {
      const branchScope = scope.child();
      region.setContent(renderAST(result.contentAST, branchScope), branchScope);
    }
  },

  hydrate({ self, node, serverMeta, evaluate }) {
    self.branchIndex = serverMeta?.branchIndex ?? -1;
    evaluate(node.condition); // register dependencies, trust server DOM
  },

  update({ self, node, scope, region, evaluate, renderAST }) {
    // default could just call this.render() for simple cases
    const result = self.getBranch();
    if (result.matchIndex !== self.branchIndex) {
      self.branchIndex = result.matchIndex;
      if (result.contentAST) {
        const branchScope = scope.child();
        region.setContent(renderAST(result.contentAST, branchScope), branchScope);
      }
      else {
        region.clear();
      }
    }
  },

  destroy({ region }) {
    region.clear();
  },

  // Optional — if defined, fully owns recovery. If omitted, defineBlock
  // clears the region and continues (structured log emitted either way).
  error({ err, region }) {
    region.clear();
  },
});
```

Note: `branchIndex` / `branchScope` here refer to which condition branch (if/elseif/else) matched inside the conditional block — a legitimate use of "branch" for control-flow within a block. Unrelated to the old `defineBranch` abstraction name.

### Lifecycle hooks

| Hook | When | Inside Reaction | Purpose |
|------|------|-----------------|---------|
| `create(ctx)` | Once, before mount | No | Return `self` — per-instance state |
| `render(ctx)` | First Reaction run (client render) | Yes | Build initial DOM from AST |
| `hydrate(ctx)` | First Reaction run (server content exists) | Yes | Adopt existing DOM, register dependencies |
| `update(ctx)` | Subsequent Reaction runs | Yes | React to signal changes. Defaults to `render` if not provided |
| `destroy(ctx)` | Scope disposal | No | Cleanup |
| `error(ctx)` | Any hook throws | No | Optional — custom recovery. Omit to clear the region and continue. |

All hooks receive the same destructured context — the SUI pattern of "here's everything, take what you need":

```
node, data, scope, region, isSVG, serverMeta, self,
evaluate, renderAST, lookupExpression, lookupToken,
dataDep, subTemplates, snippets, template, notifyUpdate,
report
```

The `error` hook additionally receives `{ hook, err }` — which lifecycle hook threw and the caught exception.

### Infrastructure (`defineBlock` implementation)

`defineBlock` returns a function the renderer calls. The function:
1. Creates `DynamicRegion` from the marker
2. Calls `create()` to build `self`
3. Builds the context bag with `self` + renderer capabilities (`evaluate`, `renderAST`, `report`, etc.)
4. Wires a `scope.reaction` — **sets `context: { message, block: definition.name, node }` on the reaction automatically**, calls `setTrace()`, then firstRun → `render()` or `hydrate()`, subsequent runs → `update()`
5. Wires `scope.onDispose` → `destroy()`
6. Wraps every hook call in try/catch — on throw, emits a structured agent-readable log and calls `error(ctx)` if defined (else clears the region and continues)

The block author never touches `scope.reaction`, `DynamicRegion`, `comp.firstRun`, `Reaction.setContext`, or `try/catch` around hook calls. Reference for the shape of the abstraction: `packages/renderer/src/engines/lit/directives/render-template.js` — hand-written lit directive with targeted `addContext` usage, clean method decomposition, and small surface area. Native version strips the lit-specific glue (AsyncDirective, part handling, setValue) and substitutes `DynamicRegion` / `ReactionScope`.

### Reactivity tracing & runtime error output

The goal for this section is simple: **actionable, high-SNR feedback that an agent writing components can consume to iterate.** AST handles compile errors; this plan handles runtime throws. Every design choice filters through *"would this help an agent debug without adding noise?"*

**Tracing.** `defineBlock` sets `reaction.context` at creation — no block-author boilerplate:

```js
Reaction.create(run, {
  context: {
    message: `${definition.name}: {#${node.type} ${node.expression ?? ''}}`,
    block: definition.name,
    node,
  },
});
reaction.setTrace();
```

Today's native blocks drop this context (regression from the lit renderer — see `packages/renderer/src/engines/lit/directives/reactive-conditional.js:23-26` and `render-template.js:70-74`). Baking it into `defineBlock` restores and standardizes it for free.

**`evaluate` stays silent on undefined.** `{maybeUndefined}` is a legitimate pattern — optional attributes, not-yet-loaded data, helpers that sometimes resolve. Auto-warning on every unresolved lookup would drown the signal. No framework-level reporter function in the hook context — keeps the API surface small and keeps the bundle tight.

**Uncaught throws.** Each hook body is wrapped in try/catch by `defineBlock`. On throw:

1. **Emit a structured log** (dev-only, see format below).
2. **Call the `error` hook** if the block defines one — it fully owns recovery. Otherwise clear the region and continue. Hydrate is the one exception: on throw it falls through to full client render, since server DOM is untrustworthy if `hydrate()` threw.

No per-hook defaults matrix, no secondary reporter channel. Single default, single structured log, one opt-in hook.

**Structured log format.** Agent-iteration is the forcing function: the output has to be parseable without heuristics. Three primary lines, one resolution block, one collapsed stack:

```
🔴 conditional  {#if user.profile.name}
  Cannot read properties of undefined (reading 'name')
  resolution:
    user         → { id: 42 }
    user.profile → undefined  ← failed here
  ▸ stack
```

| Part | Purpose |
|---|---|
| **block + expression** | Orients the agent in one line. Expression string is findable by grep in a 50-line template — no location number needed. |
| **error message** | The JS error itself. |
| **resolution block** | The "aha" signal. Walks the path the evaluator traversed and shows where it hit undefined. Far more actionable than dumping full state. Evaluator already walks the path — capture the trail on failure. |
| **collapsed stack** | Available via `console.groupCollapsed` for the 10% case. Not primary. |

Deliberately omitted: template location (would require line/col tracking on AST nodes — hurts the AST's human-readable SNR, not worth it), full data snapshot (noisy — state can be 30+ keys), hook name (inferable), framework-internal stack frames (filtered).

**Block-author `report(field, expression, message, { data, severity } = {})`.**

Available in every hook context for block authors to flag edge cases the compiler can't catch and the data won't reveal at read time — `{#each undefined}` hitting a soft fallback, malformed AST shapes from a compiler bug, deprecated usage patterns, etc. Shares the structured formatter with the uncaught-throw path; dev-only (`isDevelopment`-guarded, tree-shakes to ~0 bytes in prod). Incremental dev cost ~300-500 bytes min+gz.

Output uses the same shape as the throw log, with a `🟡` prefix (vs `🔴` for throws):

```
🟡 each  {#each items}
  iterable: expected array, got object
  current value: { id: 42 }
  ▸ stack
```

Dedups per-(block, field, expression) across re-renders so a broken signal doesn't spam the console.

**Usage guidance.** Use `report()` only when the block detects a problem the template compiler wouldn't catch and that the data wouldn't reveal at read time. **Not for routine undefined handling** — `{maybeUndefined}` is a legitimate pattern, and noisy reports defeat the SNR principle this section is built on.

**Natural fit:** `{#async}` with its `{error as e}` branch is already user-facing error handling. Its `error` hook renders the catch branch. No generalization to other blocks — async is the only block where runtime failure is a legitimate user-level state to render UI for.

**Layering.** This plan owns Layer 2 (block errors) and Layer 0 (reactivity tracing — infra already exists in `Reaction`/`Scheduler`, we just plumb it through `defineBlock`). Layer 1 (evaluator error shape) is plan 2f. Layer 3 (user-facing error handling) is live today in async's `{error as e}` branch; no generalization planned.

### Renderer dispatch

`bindBlockDirective` and `hydrateBlockDirective` (current code) collapse into one path:

```js
const block = blocks[node.type];
block(ctx);
```

The hydration distinction moves inside: `region.ownedNodes.length > 0` determines whether `hydrate()` or `render()` is called on firstRun. The renderer just pre-collects `ownedNodes` and `serverMeta` from the DOM before dispatching — that collection logic stays in the renderer since it's DOM walking, not block behavior.

Dispatch symbol renames: `bindBlockDirective` → `bindBlock`, `hydrateBlockDirective` → `hydrateBlock` (and both collapse to the single dispatch above).

### File structure

```
packages/renderer/src/engines/native/
├── renderer.js           — AST walk, parseHTML, marker dispatch, text/attr bindings
├── define-block.js       — the defineBlock infrastructure (lifecycle, reaction, tracing, try/catch)
├── dynamic-region.js     — unchanged
├── reaction-scope.js     — needs a context-passing signature update (see "Structural concerns")
├── blocks/
│   ├── conditional.js
│   ├── each.js
│   ├── async.js
│   ├── rerender.js
│   ├── subtemplate.js
│   └── snippet.js        — non-lifecycle path (see "Structural concerns")
```

LOC budgets are deliberately omitted. Estimating line counts before writing code is speculative — the lit renderer (hand-authored) is the reference shape: ~500 lines of core plus short per-block modules. Native target is equal or smaller once lit-specific glue (AsyncDirective / part handling / setValue) is replaced with native's region/scope API.

### What stays in the renderer

- `readAST` / `parseHTML` / `buildHTMLString` — core pipeline
- `parseAttributeParts` / `bindAttributeExpression` — attribute bindings
- `bindTextExpression` / `hydrateTextExpression` — text bindings
- `hydrateMarkers` / `hydrateAttributes` — hydration DOM walking and marker collection
- Expression evaluator setup, data management, `setData` / `bumpDataVersion`

The renderer becomes an orchestrator — it walks the AST, collects markers, and dispatches to blocks. Each block is a self-contained lifecycle.

## Structural concerns

These are findings from a critique pass against the current `renderer.js` that needed explicit resolution in the plan — not open questions, decisions baked in:

**Snippets are not a `defineBlock` block.** `createSnippet` in today's renderer has no `DynamicRegion`, no reaction, no lifecycle — it's a dispatcher-map mutation plus a data-proxy plus `readAST`. Forcing it into the hook contract adds boilerplate for nothing. `snippet.js` lives alongside block modules but exports a plain function rather than a `defineBlock` call. The `{#snippet}` definition site registers the snippet in the dispatcher map; invocation sites (`{>snippet}`) go through the subtemplate block.

**Hydration moves into the `hydrate` hook per block.** The critique found that today's `hydrateBlockDirective` pre-computes `getServerRenderedAST` and recurses into `hydrateInnerContent` *before* dispatch — which keeps block structure in the renderer. The cleaner answer is the reverse: each block's `hydrate` hook walks its own subtree. The renderer's job is identifying marker boundaries and handing the owned DOM to the block; everything past the boundary is block-owned. This matches the "self-contained lifecycle" framing and removes the pre-dispatch special-casing per node type. Cost: the inner-marker walking pattern appears in each block's hydrate hook rather than once in the renderer — mitigated by a shared helper in `define-block.js` that any hydrate hook can call.

**Async post-resolution routing goes through a reaction rerun.** The critique flagged that promise `.then/.catch` callbacks in the current async block run outside any hook and escape the error machinery. Resolution: the async block stores promise state on `self`, and `.then/.catch` trigger a reaction rerun by setting a signal. The rerun re-enters `update()` normally, where the try/catch + error hook apply uniformly. No special post-resolution path, no error-machinery gap.

**`ReactionScope` signature change.** `reaction-scope.js:16` currently passes no context to `Reaction.create`. Needs a third-arg shape so `defineBlock` can wire `{ message, block, node }` automatically. Minor API addition; documented here to avoid it being a surprise at execution time.

**`__isItemProxy` marker is a workaround that the `{#each}` rewrite supersedes.** The critique identified an implicit contract between `subtemplate` and `each` via `__isItemProxy`. The each block is getting a rewrite as part of this plan anyway — the proxy hack goes away. Not preserved across the refactor.

## Open Questions

- **Text and attribute bindings**: these aren't blocks — they're inline bindings. Should they get the same `defineBlock` treatment, or is the extracted `bindAttributeExpression` method sufficient? They're simpler (no lifecycle, no DynamicRegion) so the function approach may be fine. Runtime failures in these bindings are handled by the evaluator's own error surfacing (plan 2f).

- **Re-throw escalation policy.** When the `error` hook itself throws, what happens? Options: swallow and log, bubble to Scheduler flush boundary (Signal Performance's planned work), crash the tree. Lean: log + swallow in prod, re-throw in dev for visibility.

- **Structured log channel.** `console.group` is the default output. Future possibility: a programmatic subscription hook for test harnesses and tooling. Not needed for this plan — keep the format forward-compatible so a future channel can emit the same structured record without API churn.

- **Resolution trail capture.** The "aha" block requires the evaluator to retain the walk trail when a lookup fails. `getDeepDataValue` already walks segment-by-segment (`packages/renderer/src/expression-evaluator.js:311-345`); the addition is capturing `{ segment, resolved }` pairs on the failure path. Small cost, only taken on throw. Verify it doesn't regress the hot path during implementation.

## Dependencies

None. This is a pure refactor of the native renderer internals. No API changes, no new features.

## Status

**Scope: `initial` (close to `scoped`).** Design fully mapped through pair discussion. Core refactor shape (`defineBlock`, lifecycle hooks, dispatch collapse) is concrete. Runtime error path — tracing auto-wire, structured agent-readable log, `report()` + `error` hook — is locked to a trimmed, bundle-conscious shape oriented around agentic iteration.

Implementation details to resolve during execution: exact `DynamicRegion` signature changes (if any), hydrate-inner-content placement (see Open Questions), text/attribute binding treatment.
