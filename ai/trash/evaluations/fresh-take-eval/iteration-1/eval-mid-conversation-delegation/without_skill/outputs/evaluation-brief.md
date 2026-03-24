# Evaluation Brief: Subtree Caching vs Stale Data in the Lit Renderer

## Who You Are Talking To

The Semantic UI Next framework authors. They have deep expertise in UI framework design and have built a 50K-star open source project. Treat them as peers.

## Background

Semantic UI Next is a ground-up rewrite of a major UI component framework. It includes a custom templating language, a signals-based reactivity system, and a rendering layer that compiles templates to Lit `html` tagged template literals via an intermediate AST representation.

The rendering pipeline works like this:

1. A component's template is parsed into an AST.
2. `LitRenderer.render()` walks the AST and produces a Lit `TemplateResult`.
3. Control-flow nodes (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`) become Lit `AsyncDirective` instances that manage their own reactive subscriptions.
4. Content inside control-flow blocks is rendered via `renderContent()`, which creates child `LitRenderer` instances (called "subtrees") and stores them in a `renderTrees` cache keyed by `hashCode({ ast })`.
5. Data flows from parent to child subtrees via a shared mutable `data` object. The data object contains a mix of wrapped functions (getters) and plain values.

## The Problem

There are two interacting bugs. Solving one makes the other worse.

### Bug 1: Async blocks lose resolved state on parent re-render

When a `{#rerender}` block re-fires (because its watched signal changed), it calls `this.condition.content()` which calls `renderContent()`. Previously, `renderContent()` always created a **new** `LitRenderer` for the subtree, producing a **new** Lit `TemplateResult`. Lit treats a new template result from a different template as a structural change, so it tears down the old DOM and all its directives, then creates new ones. This means any `{#async}` directive inside that subtree starts fresh in the "loading" state, causing a visible flash even though the resolved data may still be valid.

**The attempted fix:** Cache subtree `LitRenderer` instances in `renderTrees` using `WeakRef`, keyed by `hashCode({ ast })`. On subsequent renders, `renderContent()` returns the cached renderer's `litTemplate` via `cachedRender()` instead of creating a new one. Since it's the same `TemplateResult` object, Lit patches the existing DOM in place. The `AsyncDirective` instances survive, keeping their resolved state.

This is implemented and mostly works. See `renderContent()` at line 689 of `renderer.js`.

### Bug 2: Cached subtrees show stale content when data changes

The cache fix introduced a second problem. In the nav-menu component (and reproduced in test case #10 "Nested Each with Highlights"), nested `{#each}` loops display search results with highlighted text. When the search term changes:

1. The outer each re-evaluates `getGroups()`, which returns new plain objects with different `highlight` properties.
2. The inner each calls `renderContent()` for each item.
3. Because the AST hasn't changed (only the data), `renderContent()` finds the cached subtree and calls `cachedRender(data)`.
4. `cachedRender()` calls `updateData()` to mutate the shared data object, then `bumpDataVersion()` to increment a `dataVersion` signal.
5. Any `reactiveData` directive that called `this.dataVersion.get()` in its value function (see `evaluateExpression()` line 387) re-fires, re-evaluating its expression against the updated data.

**The staleness problem:** The each item data (`{entry.highlight.before}`, `{entry.highlight.match}`, etc.) comes from plain objects, not Signals. The data is passed through wrapped getter functions, but those getters close over the data object reference at creation time. When `updateData()` patches `this.data`, the getters for *nested* properties like `entry.highlight.before` still resolve from the old closed-over object because `entry` is a new object from `getGroups()` that was placed on `this.data` via spread, not via signal mutation.

**The `dataVersion` band-aid:** A `dataVersion` signal was added to force all `reactiveData` directives to re-read their values. This is a global bump -- every expression in every cached subtree re-evaluates when *any* data changes, regardless of whether the specific data it depends on actually changed. This causes:

- Over-firing: O(N * M) re-evaluations where N is number of cached subtrees and M is expressions per subtree, even when only one subtree's data changed.
- Cascading bumps: `bumpDataVersion()` recursively walks all `renderTrees` and bumps their versions too (line 84-91), propagating through the entire subtree hierarchy.

### Why per-key dirty tracking gets complicated

The exploration into per-key versioning would assign each cache entry its own version signal, only bumping it when *that* entry's data actually changed. But this breaks down because:

1. The cache key is `hashCode({ ast })` -- it identifies the *template shape*, not the data instance. Two items in an `{#each}` with the same template structure produce the same `hashCode({ ast })`. The `key` parameter distinguishes them (`hashCode({ ast, key })`), but the key comes from the each directive's item ID, which may itself change across data updates.
2. Determining "did this entry's data change" requires deep comparison, which is expensive and still may not be correct for function-valued data.
3. Subtrees that `inheritsData` need to transitively know about parent changes, creating a dependency graph that mirrors what the reactivity system already does.

## The Core Tension

The system has two concerns pulling in opposite directions:

**Concern A: DOM stability.** Lit directives (especially `AsyncDirective`) hold state. Returning a new `TemplateResult` from a different template destroys that state. The subtree cache exists to return the *same* template result so Lit patches in place.

**Concern B: Data freshness.** The data flowing into subtrees is plain objects, not reactive signals. The template system was designed so that `renderContent()` creates a fresh renderer with fresh data closures each time. Caching the renderer means those closures go stale.

## Key Files

All paths relative to repository root.

| File | Role |
|------|------|
| `packages/renderer/src/lit/renderer.js` | `LitRenderer` class -- AST walker, subtree cache, `renderContent()`, `cachedRender()`, `bumpDataVersion()`, `updateData()` |
| `packages/renderer/src/lit/directives/reactive-data.js` | `ReactiveDataDirective` -- renders `{expression}` values, creates a `Reaction` per expression |
| `packages/renderer/src/lit/directives/reactive-each.js` | `ReactiveEachDirective` -- handles `{#each}`, uses Lit's `repeat()`, creates items via `renderContent()` |
| `packages/renderer/src/lit/directives/reactive-rerender.js` | `ReactiveRerenderDirective` -- handles `{#rerender}`, watches signals, re-calls `content()` |
| `packages/renderer/src/lit/directives/reactive-async.js` | `ReactiveAsyncDirective` -- handles `{#async}`, manages promise lifecycle with generation counter |
| `packages/renderer/src/lit/directives/reactive-conditional.js` | `ReactiveConditionalDirective` -- handles `{#if}/{else}` |
| `packages/renderer/src/lit/directives/render-template.js` | `RenderTemplateDirective` -- handles `{>template}` sub-template rendering |
| `packages/reactivity/src/signal.js` | `Signal` class with dependency tracking, mutation helpers |
| `packages/reactivity/src/reaction.js` | `Reaction` class -- the computation unit that re-runs when dependencies change |
| `packages/reactivity/src/dependency.js` | `Dependency` class -- subscriber tracking |
| `packages/reactivity/src/scheduler.js` | `Scheduler` -- microtask-based flush queue |

## Key Mechanisms to Understand

### How `renderContent()` caching works (renderer.js:689-710)

```js
renderContent({ ast, data, key, isSVG = this.isSVG } = {}) {
  const contentID = LitRenderer.getID({ ast, key, isSVG });
  const treeRef = this.renderTrees[contentID];
  const existingTree = treeRef ? treeRef.deref() : undefined;

  if (existingTree) {
    return existingTree.cachedRender(data);  // returns same litTemplate
  }

  const tree = new LitRenderer({ ast, data, isSVG, ... });
  this.renderTrees[contentID] = new WeakRef(tree);
  return tree.render();  // creates new litTemplate
}
```

### How `dataVersion` propagates (renderer.js:83-92)

```js
bumpDataVersion() {
  this.dataVersion.increment();
  each(this.renderTrees, (ref) => {
    const tree = ref.deref();
    if (tree?.inheritsData) {
      tree.updateData(this.data);
      tree.bumpDataVersion();  // recursive
    }
  });
}
```

### How expressions read `dataVersion` (renderer.js:386-389)

```js
literalValue: () => {
  this.dataVersion.get();  // creates reactive dependency
  return this.lookupTokenValue(expression, this.data);
},
```

### How each items get their data (reactive-each.js:93-97)

```js
getTemplate(item, indexOrKey, collectionType) {
  const templateData = this.getEachData(item, indexOrKey, ...);
  const key = this.getItemID(item, indexOrKey, ...);
  return this.eachCondition.content(templateData, key);
  // content() calls renderContent() which hits the cache
}
```

## Concrete Reproduction: Test Case #10

The test component at `docs/src/components/SubtreeCachingTest/` reproduces the problem. Test #10 ("Nested Each with Highlights"):

1. Two groups, each with entries. Clicking "Cycle Search" filters entries and adds `highlight` objects with `before`, `match`, `after` properties.
2. Search cycle: none -> "se" -> "set" -> none.
3. On "se": entries filter to "Select", "Search", "Settings", "Setup Guide" with "Se"/"se" highlighted.
4. On "set": should narrow to "Settings" with "Set" highlighted.
5. **Bug**: With stale caches, the highlight text doesn't update -- old `before`/`match`/`after` values persist because the cached subtree's data closures still reference the previous iteration's objects.

## What We Need From You

Evaluate this problem independently. Specifically:

1. **Architectural diagnosis**: Is the subtree cache the right approach at all? Or is there a better way to preserve directive state across re-renders without caching the entire `LitRenderer`?

2. **Alternative approaches**: Consider whether the problem could be solved at a different layer:
   - At the Lit directive level (e.g., keyed directive instances that persist across template re-creation)
   - At the data layer (e.g., making each-item data reactive so signals handle the updates naturally)
   - At the renderer level (e.g., structural sharing of template results)
   - At the template compilation level

3. **If the cache approach is fundamentally right**, what's the correct granularity for invalidation? The current `dataVersion` signal is too coarse. Per-key tracking is too complex. Is there a middle ground?

4. **Constraints to respect**:
   - The reactivity system (Signal/Reaction/Dependency) is stable and well-tested. Changes here have wide blast radius.
   - Lit is the rendering backend. We can't change how Lit handles `TemplateResult` identity.
   - The template language supports arbitrary nesting of control-flow blocks. Any solution must compose.
   - Performance matters: this framework renders complex UI component libraries. O(N*M) re-evaluation on every data change is not acceptable.

Do not feel bound by the approaches already tried. If the entire caching strategy is wrong, say so and explain what should replace it.
