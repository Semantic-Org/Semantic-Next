# Task: Cross-Cutting Fine-Grained Reactive Data Context

Read the architecture overview, then read ALL source files listed at the bottom of this document. Answer the questions with detailed analysis grounded in the actual code. Evaluate independently — the questions are genuinely open, not rhetorical.

## Architecture Overview

Semantic UI Next is a templating + reactivity framework. Its native renderer ships three mechanisms that pass data from a parent reactive scope into a child rendering context:

1. **Each-item data** — inside `{#each item in items}`, per-item DOM has its own reactive data so bindings like `{item.name}` react when an item's data changes. Lives in `packages/renderer/src/engines/native/blocks/each.js`.

2. **Subtemplate verbose data** — `{>template name='child' data=obj reactiveData={a: exprA, b: exprB}}` pushes values computed in the parent into a child Template instance. Lives in `packages/renderer/src/engines/native/blocks/template.js` (subtemplate branch of `hydrate`/`render`/`update`, plus the `unpackNodeData` helper in that file).

3. **Snippet arguments** — `{>snippet label=exprLabel status=exprStatus}` where snippets render inline using the same renderer as the parent but with a per-invocation data context. Lives in the same file, snippet branch (see `buildSnippetProxy`).

In contrast, **flat** component templates (templates that don't cross these three boundaries) read state from per-field `Signal` instances on a state object. Reading `state.foo.get()` tracks only `state.foo`'s Dependency; changing `state.bar.set(...)` does not invalidate `state.foo`-reading expressions. This behavior is asserted by the existing `sibling expressions in flat template` tests in `subtree-spurious.test.js`.

## Reactivity Primitives

- `Signal` (`packages/reactivity/src/signal.js`) — holds a single value; `value` getter / `get()` tracks the current Reaction; `set()`/`.value = …` invalidates subscribers when the new value differs by the equality function.
- `Dependency` (`packages/reactivity/src/dependency.js`) — lower-level. `depend()` subscribes the current Reaction; `changed()` invalidates all subscribers.
- `Reaction` (`packages/reactivity/src/reaction.js`) — a tracked computation.
- `renderer.dataDep` — a per-renderer `Dependency` used for coarse "data changed" propagation. `renderer.bumpDataVersion()` fires `dataDep.changed()`.

## Expression Evaluation and Tracking

`renderer.lookupExpression(expression, data)` in `packages/renderer/src/engines/native/renderer.js` is the main expression-evaluation entry from inside a Reaction. It calls `this.dataDep.depend()` conditionally (only when `receivesData === true`) before delegating to `evaluator.lookupExpressionValue()`. Inside the evaluator, reading signals via their `.get()` tracks per-Signal deps as expected.

## Observed Behavior (Symptoms)

1. In `{#each item in filteredItems}`, filtering to a subset causes every surviving item's **every** reactive expression to re-evaluate, even when the item's data content is unchanged. In flame charts this manifests as ~N × M expression evaluations on a single filter keystroke, where N is visible items and M is reactive bindings per item.

2. A subtemplate invocation `{>template data=X reactiveData={a: exprA, b: exprB}}` where only `exprA`'s source signal changes still re-evaluates **every** subtemplate inner expression (including those reading only `b`). Empirically verified via the `it.skip`-marked `reactiveData per-key granularity` test in `packages/renderer/test/browser/subtree-spurious.test.js`.

3. A snippet invocation `{>snippet label=exprLabel status=exprStatus}` where only `exprLabel`'s source signal changes still re-evaluates inner expressions that read `status`. Empirically verified via the `snippet args per-key granularity` test in the same file (also currently `it.skip`).

Flat components do **not** exhibit this — the `sibling expressions in flat template` tests cover that case and pass.

## Invariants Any Solution Must Preserve

- Existing keyed reconciliation in `{#each}` — the per-item `startMarker`/`endMarker` text-node pair identity that `reconcile` in `each.js` uses to move/remove items — must keep working.
- Hydration correctness: a mutation after SSR+hydrate must still produce the correct final DOM.
- The snippet parent-data fallthrough pattern (accessing parent signals/state from inside a snippet that wasn't declared as an arg) must keep working — snippets read `{parentState}` the same as their enclosing component does.
- The `itemContextProxies` WeakSet registration in `each.js` (exported as `isItemContext`) is consumed by `template.js`'s `unpackNodeData` to decide whether to wrap subtemplate data lookups in `Reaction.nonreactive`. Whatever semantic this encodes must survive.
- All tests under `packages/renderer/test/browser/subtree-*.test.js` must stay green. The currently-skipped `it.skip` tests for fine-grained granularity should become passing (that is how the solution is verified).

## Questions — Evaluate Independently

**Question 1:** Is the current coarseness a necessary consequence of something structural in the renderer / Template lifecycle, or is it an artifact of how `bumpDataVersion` / `Signal.notify()` are being used at these three sites? If the latter, what is the minimum change — either to the reactivity primitives or to how the renderer wires them — that would achieve per-property granularity?

**Question 2:** Could a shared abstraction serve all three sites (each-items, subtemplate reactiveData, snippet args), or are their lifecycle differences severe enough that each needs its own mechanism? Specifically consider: each-items go through `reconcile` on every parent update; subtemplates have their own `Template` instance and `setDataContext`/`bumpDataVersion` lifecycle; snippets are inlined and have no independent lifecycle.

**Question 3:** What's the minimum-surface way to introduce this without disturbing the existing block decomposition (`defineBlock`) contract? Blocks should be self-contained modules — does the primitive live in `reactive-data.js`, in a new file, in the reactivity package, or does it need to thread through `define-block.js`?

**Question 4:** Are there existing patterns in the reactivity package (or elsewhere in the codebase) that already do something analogous that could be reused rather than introducing a new primitive? For example: `Signal.derive`, `Signal.computed`, `Reaction.guard`, the Scheduler's batching, something the Lit engine does that the native engine doesn't, anything in `@semantic-ui/reactivity` that isn't being exercised here.

**Question 5:** What correctness hazards should a fine-grained replacement anticipate? Specifically address:
- (a) Inner expressions that read a property that wasn't present when the context was created (late-declared properties).
- (b) Inner expressions that read properties conditionally (only in some branches of a ternary, only when `isDev`, etc.).
- (c) Nested blocks — `{#each}` inside `{#if}` inside `{>snippet}` — where multiple data-context layers compose.
- (d) Spread or computed property access (`{>snippet ...data}`, `this[dynamicKey]`, `Object.keys(data)`).
- (e) Mutation in place (an item's existing property changes to a new value without the item reference changing) — the current `reconcile` handles this with a `Signal.notify()` branch; a property-level scheme needs an equivalent.

## Deliverable

Write your analysis to `ai/workspace/fine-grained-data-context-report-{N}.md` (pick `-a`, `-b`, `-c`, etc. if multiple agents run). Propose a concrete primitive — its shape (object / class / function), its API surface, where it lives in the codebase, and how each of the three sites is rewired to use it. Include pseudocode for the primitive and pseudocode for the three adoption sites.

## Source Files to Read

- `packages/renderer/src/engines/native/blocks/each.js`
- `packages/renderer/src/engines/native/blocks/template.js`
- `packages/renderer/src/engines/native/reactive-data.js`
- `packages/renderer/src/engines/native/renderer.js`
- `packages/renderer/src/engines/native/define-block.js`
- `packages/reactivity/src/signal.js`
- `packages/reactivity/src/dependency.js`
- `packages/reactivity/src/reaction.js`
- `packages/renderer/src/expression-evaluator.js`
- `packages/templating/src/template.js` (particularly the path from `setDataContext` → `render` → `bumpDataVersion`)
- `packages/renderer/test/browser/subtree-spurious.test.js` (especially the `it.skip`-marked tests and the flat-template tests that already pass)

Do not read git history or diffs — evaluate only the current code state.
