# Problem Brief: Subtree Caching in the Semantic UI Renderer

## Context for a Fresh Agent

You are looking at the rendering layer of Semantic UI's component framework. The renderer (`LitRenderer`) walks an AST and produces Lit tagged template literals. Structural directives (`{#if}`, `{#each}`, `{#rerender}`, `{#async}`) render their content blocks as **subtrees** — separate `LitRenderer` instances created via `renderContent()`.

The branch `feat/cache-subtrees` has been an ongoing effort to make these subtrees survive across parent re-renders instead of being recreated each time.

---

## The Core Problem

When a structural directive's Reaction fires (e.g., a signal changes that an `{#each}` depends on), the directive re-evaluates its content. Each content callback (e.g., `this.eachCondition.content(templateData, key)`) calls back into `LitRenderer.renderContent()`, which creates a new `LitRenderer` child to walk the subtree's AST and produce a new Lit TemplateResult.

**The problem:** every time a parent directive re-renders, the subtree's content is reconstructed from scratch — new `LitRenderer`, new AST walk, and critically, the old Lit directives (inside the subtree) are destroyed and new ones are created. Each of those inner directives creates its own `Reaction`. This means:

1. **Async blocks lose resolved state.** An `{#async}` inside an `{#each}` or `{#rerender}` has resolved its promise and is showing data. Parent re-renders, new `ReactiveAsyncDirective` is created, state resets to `loading`, promise fires again. User sees a flash back to loading state.

2. **Unnecessary DOM churn.** The subtree DOM is torn down and rebuilt even when the subtree content hasn't conceptually changed — only the parent's decision about *whether* to show it changed.

3. **Reaction proliferation.** Each re-render creates new `Reaction` instances for every directive in the subtree. The old ones get cleaned up via Lit's `disconnected()`, but the allocation/deallocation cycle is wasteful.

---

## What Has Been Tried (Current Branch State)

The branch has made several changes to address this. Here is what currently exists:

### 1. Subtree caching via `renderContent()` (renderer.js)

`renderContent()` now caches child `LitRenderer` instances in a `renderTrees` map keyed by content ID (hash of AST + optional key). On subsequent calls, if a cached tree exists, it returns `cachedRender(data)` instead of creating a new `LitRenderer`:

```js
renderContent({ ast, data, key, isSVG = this.isSVG } = {}) {
    const contentID = LitRenderer.getID({ ast, key, isSVG });
    const treeRef = this.renderTrees[contentID];
    const existingTree = treeRef ? treeRef.deref() : undefined;
    if (existingTree) {
        return existingTree.cachedRender(data);
    }
    // ... create new tree
}
```

`cachedRender()` updates data and bumps `dataVersion` but returns the *existing* `litTemplate` — no AST re-walk.

### 2. `dataVersion` signal for downstream reactivity (renderer.js)

A `dataVersion` Signal was added to each `LitRenderer`. When data changes, `bumpDataVersion()` increments it and propagates to child trees. The `reactiveData` directive's value/literalValue closures now read `this.dataVersion.get()`, which means they register a dependency on it. This lets data changes from the parent trigger re-evaluation of expressions in cached subtrees without recreating the subtree.

### 3. Directive reaction reuse (all directives)

All four structural directives were changed to return `noChange` when `render()` is called with an existing reaction, instead of stopping and recreating the reaction:

```js
render(condition) {
    this.condition = condition;
    if (this.reaction) {
        return noChange;  // was: this.reaction.stop(); this.reaction = null;
    }
    // ... create reaction
}
```

This preserves directive state across Lit re-renders (when the parent's Lit TemplateResult is re-committed).

### 4. Each-item keying (renderer.js + reactive-each.js)

`{#each}` now passes a per-item key to `renderContent()`, so each loop iteration gets a distinct content ID. This prevents items from colliding in the cache.

---

## Where It's Stuck

The previous agents (and the framework author) have identified that the current approach works for many cases but breaks down in specific scenarios. The test component at `docs/src/components/SubtreeCachingTest/` covers 16 test cases. Here are the known problem areas:

### Problem A: Async inside structural directives

Test case 1: `{#rerender darkMode} {#async formatMessage as msg} ...`. When `darkMode` toggles, the rerender directive fires, calls `content()`, which calls `renderContent()`. The cached subtree returns the old Lit template via `cachedRender()`. But the `{#async}` directive inside that subtree has already resolved. The `dataVersion` bump correctly triggers `reactiveData` directives to re-evaluate their expressions, but the `reactiveAsync` directive's expression closure captures the parent data — when `dataVersion` changes, does it correctly cause the async directive's Reaction to re-fire and re-fetch?

The tension: `cachedRender()` returns the existing `litTemplate` without re-walking the AST. This means the `reactiveAsync` directive's `render()` method is NOT called again (it was only called once during the initial AST walk). Its Reaction watches its expression, and if that expression accesses Signals, it will re-fire. But the expression callback was created during `evaluateAsync()` and closes over `data` — the question is whether `this.data` (the renderer's live data reference) plus `dataVersion.get()` in the expression closures is sufficient to trigger re-evaluation.

### Problem B: Content ID collisions in nested structures

When the same AST subtree appears in multiple contexts (e.g., the same `{#if}` template inside different `{#each}` iterations), the content ID based on `hashCode({ ast })` will be identical. The `key` parameter added for `{#each}` items helps, but only at one level. Nested structures (each-inside-each, if-inside-each) may still collide.

### Problem C: The data closure problem

The `evaluateConditional`, `evaluateEach`, `evaluateRerender`, and `evaluateAsync` methods create closures during the initial AST walk:

```js
if (key == 'content') {
    return () => this.renderContent({ ast: value, data });
}
```

The `data` variable here is captured at closure creation time. When the parent updates, `cachedRender()` updates `this.data` (the renderer's data object), but the closure captured a *specific* `data` reference from when the AST was walked. If `data` is later replaced (not mutated in place), the closure sees stale data.

The `updateData()` method mutates the existing object rather than replacing it, which partially addresses this. But `evaluateEach` does `data = { ...this.data, ...eachData }` — creating a NEW object each time the content callback is invoked. This new object is what gets passed to `renderContent()`. On a cache hit, `cachedRender(data)` calls `updateData(data)` which mutates the cached tree's data in place. But any closures inside THAT subtree captured the previous `data` reference...

This is a layered closure-over-mutable-state problem that gets more complex with each level of nesting.

### Problem D: Architectural tension

There are three possible "homes" for the fix, each with tradeoffs:

1. **Renderer-level caching** (current approach): Cache the `LitRenderer` and reuse its `litTemplate`. Pro: minimal directive changes. Con: the data propagation problem is subtle and hard to get right for all nesting patterns.

2. **Directive-level statefulness**: Make each structural directive cache its own rendered subtrees internally. Pro: each directive knows its own semantics (e.g., `{#each}` knows about keys, `{#async}` knows about promise state). Con: duplicates caching logic across directives, and the subtree is still a `LitRenderer` created via `renderContent()`.

3. **Reactivity-level persistence**: Make Reactions survive directive destruction/recreation. Instead of `disconnected()` killing the Reaction, persist it and reconnect when a new directive instance is created for the same position. Pro: completely transparent to directives. Con: requires a way to associate Reactions with DOM positions, which is Lit-internal territory.

---

## Key Files

All paths relative to repo root (`/home/jack/semantic/next/`):

| File | Role |
|------|------|
| `packages/renderer/src/lit/renderer.js` | LitRenderer — AST walk, subtree creation, caching |
| `packages/renderer/src/lit/directives/reactive-data.js` | `{expression}` bindings |
| `packages/renderer/src/lit/directives/reactive-conditional.js` | `{#if}` directive |
| `packages/renderer/src/lit/directives/reactive-each.js` | `{#each}` directive |
| `packages/renderer/src/lit/directives/reactive-rerender.js` | `{#rerender}` / `{#guard}` directive |
| `packages/renderer/src/lit/directives/reactive-async.js` | `{#async}` directive |
| `packages/renderer/src/lit/directives/render-template.js` | `{>template}` subtemplates |
| `packages/reactivity/src/reaction.js` | Reaction class |
| `packages/reactivity/src/scheduler.js` | Microtask flush scheduler |
| `packages/component/src/web-component.js` | WebComponentBase (LitElement extension) |
| `docs/src/components/SubtreeCachingTest/` | 16-case test component |
| `ai/authoring/render-pipeline.md` | Full render pipeline documentation |

---

## How to Approach This

1. **Read the render pipeline doc** at `ai/authoring/render-pipeline.md` — it explains the four-stage pipeline and the tagged-template-literal bridge pattern that makes the renderer unusual.

2. **Use `list_skills` via MCP** to load `render-pipeline` and `mental-model` skills — they contain framework conventions that cannot be inferred from code.

3. **Study the test component** at `docs/src/components/SubtreeCachingTest/` — it is a systematic test harness covering: async-inside-rerender, stale promises, computed values in rerender, nested rerenders, each with filter/duplicates/empty toggle, conditionals inside each, external signals controlling conditionals in each, nested each, three-level nesting, snippets, async per-item in each, guard blocks, and SVG/HTML with shared data.

4. **Trace a specific failing case end-to-end.** The most instructive one is test case 1 (async inside rerender). Walk the exact sequence: signal changes → Reaction fires → directive's callback invoked → `content()` called → `renderContent()` → cache hit or miss → what happens to the `{#async}` directive inside.

5. **Consider whether the `dataVersion` Signal approach is the right propagation mechanism.** It was added to solve the problem of data changes not reaching cached subtrees. But it's a broad hammer — every data change bumps every subtree's version, causing every expression in every cached subtree to re-evaluate. Is there a more surgical approach?

6. **The framework author is available and expert.** Before implementing, share your analysis and proposed direction. They have deep knowledge of why decisions were made and can validate or redirect quickly.

---

## What Success Looks Like

All 16 test cases in the test component work correctly with `useSubtreeCache = true`:
- Async blocks preserve resolved state across parent re-renders (no flash to loading)
- Each loops correctly update when their data source changes
- Nested structures (each-in-rerender, if-in-each, each-in-each) produce correct output
- Guard blocks correctly suppress re-renders for equivalent outputs
- No Reaction leaks (reactions are properly cleaned up when elements disconnect)
- No regression when `useSubtreeCache = false` (the old behavior should still work)
