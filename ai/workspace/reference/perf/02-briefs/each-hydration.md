## Task: Evaluate how {#each} blocks are hydrated and the tradeoffs of the current approach vs. fine-grained per-item hydration

Read all source files listed below before answering. Evaluate the current code, not git history.

### Architecture Overview

This framework uses per-expression reactivity — each `{expression}` in a template gets its own `Reaction` that independently tracks Signal dependencies and updates its DOM position when a dependency changes. There is no component-level re-render or virtual DOM diff. This is the core rendering model for client-rendered content.

During SSR, the server renders the full template including `{#each}` loops, producing HTML with hydration markers for every expression inside every iteration.

During hydration, the client wires Reactions to the existing server-rendered DOM. For most block directives (`{#if}`, `{#async}`, `{#rerender}`), the hydration path:
1. Collects DOM nodes between the block's open/close markers
2. Recursively hydrates inner markers within those nodes (wiring per-expression Reactions)
3. Creates a Reaction for the block condition itself (to handle future changes)

### How {#each} Hydration Currently Works

`{#each}` takes a different path. In `hydrateEach`:

```js
scope.track(Reaction.create((comp) => {
  const rawItems = this.eval(node.over, data) || [];
  // ... normalize items ...
  if (comp.firstRun) {
    return; // server content is correct, skip
  }
  // Full teardown and re-render of all items via readAST
}));
```

On firstRun, the Reaction evaluates the collection expression (to register a dependency on it), then returns. No per-item Reactions are wired. The server-rendered DOM stays as-is.

On subsequent runs (when the collection changes), the entire list is torn down and re-rendered from scratch using `readAST`. This creates fresh per-item DOM with full per-expression Reactions — the same path as client rendering.

The `getServerRenderedAST()` helper returns `null` for `each` blocks, which means `hydrateInnerContent()` is never called for the each's content. Inner markers (text expressions, attribute bindings, nested conditionals, snippets) within each items are not wired with Reactions during hydration.

### For comparison: how client-rendered {#each} works

When `createEach` renders on the client (non-hydration path):
- Each item gets an `itemSignal` (a Signal holding the item's data context)
- Each item's DOM is rendered via `readAST` with a Proxy that reads from `itemSignal`
- Item Reactions track `itemSignal` — when item data changes, only that item's expressions re-evaluate
- Items are keyed for efficient add/remove/reorder without full list re-render

### Empirical Observations

Testing with a 1000-item card list component with search filtering:
- Hydration correctly shows all 1000 items (server DOM is preserved)
- Typing a search query successfully filters the list (the each Reaction fires, tears down all DOM, re-renders matching items)
- After the first filter operation, the list has full per-item Reactions (because it was re-rendered via `readAST`)
- Only 6 `eval()` calls happen during hydration of 1000 items — the each block registers one dependency, plus a few top-level expressions. The ~8000 expressions inside the 1000 items are not evaluated.

### Concrete Observations

1. A 1000-item list has ~8 expressions per item = ~8000 total expressions. None of these have Reactions after hydration. The first list mutation causes a full DOM rebuild of all visible items.
2. For lists that never change after initial render (static data tables, server-rendered article lists), no per-item Reactions fire during the component's lifetime.
3. For interactive lists (search, sort, filter, pagination), the first interaction pays the full cost of re-rendering all visible items from scratch. Subsequent interactions benefit from the keyed per-item Reactions created during that first re-render.
4. The each block's closing marker includes no per-item metadata — there's no item count, no key list, no way for the client to know what the server rendered without re-evaluating the collection.

### Questions — Evaluate Independently

**Question 1:** The current each hydration strategy is deliberately different from other block directives. Before proposing changes, explain *why* the current approach might have been chosen. What are its advantages? Then evaluate: what are the different strategies for hydrating list content, and what does each optimize for?

**Question 2:** Is there a middle ground between "no per-item Reactions" and "full per-item hydration"? For example: wiring only the each-level Reaction during hydration (current approach), but making the first mutation smarter — reusing existing DOM nodes and wiring Reactions to them instead of tearing down and rebuilding via `readAST`.

**Question 3:** The client-rendered each uses keyed reconciliation (`getItemID`, `itemMap`). During hydration, there's no `itemMap` — just flat DOM nodes between markers. If per-item hydration were implemented, how would the client establish the key-to-DOM mapping from the server-rendered content?

**Question 4:** How do other frameworks (Solid, Svelte, Qwik, Marko) handle hydration of server-rendered lists? What can be learned from their approaches?

### Source Files to Read
- `packages/renderer/src/engines/native/renderer.js` — Renderer: hydrateEach, createEach, hydrateBlockDirective, getServerRenderedAST, createItemDataProxy, getItemID, getEachData
- `packages/renderer/src/engines/native/server.js` — ServerRenderer: renderEach
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion
- `packages/renderer/src/engines/native/reaction-scope.js` — ReactionScope
- `packages/reactivity/src/signal.js` — Signal class (item signals, equality, clone)
- `packages/renderer/test/browser/ssr-hydration.test.js` — Hydration tests, including each-specific cases. If something about the current design seems odd, check whether tests reveal constraints that aren't obvious from the implementation alone.
- `packages/renderer/test/browser/subtree-each.test.js` — Each loop behavior tests
