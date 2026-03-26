# Context Extraction: Subtree State Preservation During Re-renders

## Problem Knowledge (Transfer)

### Architecture Facts

- **Renderer structure:** `LitRenderer` converts an AST (from the template compiler) into Lit `html` tagged template literals. Each AST node type dispatches to a handler: `evaluateConditional`, `evaluateEach`, `evaluateAsync`, `evaluateRerender`, etc.
- **Subtree rendering:** `renderContent()` creates child `LitRenderer` instances for nested content blocks (each item bodies, conditional branches, async resolved content, rerender blocks). These are stored as `WeakRef` entries in a `renderTrees` map keyed by `hashCode({ ast })` (optionally including a `key` for each items).
- **Directive lifecycle:** Each block type (`{#each}`, `{#if}`, `{#async}`, `{#rerender}`) is implemented as a Lit `AsyncDirective`. These directives create a `Reaction` on first render, then return `noChange` on subsequent `render()` calls — relying on the reaction to push updates via `this.setValue()`.
- **Data flow:** Data is a plain object passed through the renderer hierarchy. Child renderers receive a merged data context from the parent. Data values are either raw values or wrapped functions (getters) that are evaluated inside reactive reactions.
- **Reactivity mechanism:** A `dataVersion` signal on each `LitRenderer` is bumped when data changes. Expression directives (`reactiveData`) call `this.dataVersion.get()` inside their reaction callbacks, which makes them re-fire when data is updated.
- **The `dataVersion` propagation:** `bumpDataVersion()` walks all `renderTrees`, calling `updateData()` and `bumpDataVersion()` recursively on children that have `inheritsData: true`.

### Constraints Identified

- **AST identity is not unique per call site.** The same AST subtree structure (same template snippet) can appear multiple times in a render — for example, the body of an `{#each}` loop produces one AST definition but N instantiations. The `key` parameter in `renderContent()` disambiguates these.
- **Lit directives have identity tied to DOM position.** When Lit tears down and recreates a directive (because the template result structure changes), the directive instance is destroyed. Any state held on the directive (reaction, resolved async value, generation counter) is lost.
- **Async directives track resolution state internally.** `ReactiveAsyncDirective` maintains `state`, `resolvedValue`, `error`, and `generation` on the directive instance. If the instance is destroyed, resolution state is lost and the block re-enters the loading state.
- **Data in `{#each}` item contexts is plain objects, not signals.** Each item data (`{ [as]: item, index: i }`) is spread into the data context as plain values. Changes to the source collection don't update existing item data through fine-grained reactivity — they rely on the each directive re-evaluating and producing new template results.
- **`dataVersion` is a single signal per `LitRenderer` instance.** When bumped, every expression directive that reads `dataVersion` in that subtree re-evaluates, regardless of whether its specific data actually changed.
- **`renderContent()` uses `cachedRender()` for existing subtrees.** `cachedRender()` calls `updateData()` then `bumpDataVersion()`, then returns the previously-built `litTemplate` without re-running `readAST`. This means the Lit template structure is stable (same `TemplateResult` identity), which allows Lit to patch in place.
- **Reactions self-clean on disconnect.** All directives stop their reactions in `disconnected()` and rely on the next `render()` call to recreate them.

### Symptoms (Observable Behaviors)

1. **Async blocks inside rerender blocks lose resolved state when the rerender triggers.** When a `{#rerender}` block re-fires (because its watched expression changed), it calls `this.condition.content()` which calls `renderContent()`. If the subtree renderer doesn't exist in the cache (or was garbage collected), a fresh `LitRenderer` is created, producing a new `TemplateResult`. Lit sees a different template structure and tears down the old directive tree, destroying the `ReactiveAsyncDirective` instance and its resolved state.

2. **Stale content in `{#each}` loops when the source collection is filtered.** In a search/filter scenario, the each directive re-evaluates its `over()` expression and produces new template results for matching items. But if subtree renderers are cached by AST hash, the cached renderer still holds old data in its data context. The `updateData()` call updates top-level data properties, but nested item-specific data (the `as` variable, `index`) may not reflect the new collection state.

3. **Over-firing of expression re-evaluations.** Bumping `dataVersion` on a parent `LitRenderer` propagates to all inheriting child renderers, causing every `reactiveData` directive in every cached subtree to re-fire its reaction — even when only one item's data actually changed. This is O(N * M) where N is the number of cached subtrees and M is the number of expressions per subtree.

### Success Criteria

- Async blocks nested inside rerender blocks maintain their resolved state across re-renders when the async expression itself hasn't changed.
- Each loops with filtered/searched data show correct, up-to-date content for each item — no stale highlights or outdated item data.
- Data changes propagate only to the subtrees and expressions that actually depend on the changed values, not to all expressions globally.
- The solution works with the existing Lit directive model and doesn't require changes to the reactivity core.

---

## Solution Momentum (Isolate — Do NOT Transfer)

### Approaches Attempted
- Added `renderTrees` WeakRef cache in `renderContent()` keyed by `hashCode({ ast })` — partially works but causes stale data in each loops.
- Bumped `dataVersion` signal in `updateData()` to force reactions to re-fire — causes over-firing across all cached subtrees.
- Explored per-key dirty tracking where each cache entry gets its own version signal — abandoned as too complex and unclear if correct direction.

### Current Hypothesis
- The issue is that `dataVersion` granularity is too coarse — need per-key or per-subtree versioning.

### Emotional/Narrowing Language Detected
- "We've been going in circles" — indicates frustration and possible tunnel vision on the caching direction.
- "per-key dirty tracking... it's getting complicated" — narrowing toward invalidation-based caching when other categories of solutions may exist.

### Diagnosis to Isolate
- "The issue is that `dataVersion` is too coarse" — this frames the problem as a granularity problem within a caching strategy. The actual problem may be structural.
