# Evaluation Brief: Subtree Rendering Strategy in Lit-Based Renderer

Read the source files listed at the bottom of this document before answering. Read ALL of them in full. Answer all questions with detailed analysis grounded in the actual code. Assume the existing implementation can be improved through first-principles thinking. Do not accept the current approach as given — challenge its assumptions, identify where it may be overengineered or underengineered, and propose alternatives if you see better paths. Be contrarian where the evidence supports it.

---

## Architecture Overview

Semantic UI uses a custom renderer built on top of Lit (the `lit` library's tagged template literal system and directive infrastructure). The renderer translates an AST (produced by a separate template compiler) into Lit `TemplateResult` objects that Lit then renders to the DOM.

The central class is `LitRenderer`. A single `LitRenderer` instance holds an AST, a data context, and produces a `TemplateResult` via its `render()` method. The `render()` method walks the AST, building up parallel arrays of static HTML strings and dynamic expression values, then passes them to Lit's `html` or `svg` tagged template literal function.

Reactive updates are handled by Lit's directive system. Three key directives — `ReactiveEachDirective`, `ReactiveConditionalDirective`, and `ReactiveAsyncDirective` — extend Lit's `AsyncDirective`. Each creates a `Reaction` (from the framework's reactivity package) on first render. When signals change, the reaction fires, the directive computes new content, and calls `this.setValue()` to push updates to Lit.

The reactivity system consists of `Signal` (observable values with dependency tracking) and `Reaction` (computations that re-run when their signal dependencies change). Signals auto-track when read inside a `Reaction.create()` callback.

## Subtree Rendering

When the renderer encounters a block-level construct in the AST — a conditional (`{#if}`), a loop (`{#each}`), an async block (`{#async}`), or a snippet/sub-template call — it delegates rendering to `renderContent()`. This method creates a child `LitRenderer` instance for that AST subtree. The child renderer runs its own `render()` call and produces its own `TemplateResult`.

The parent stores these child renderers in `this.renderTrees`, an object keyed by a content ID derived from hashing the AST. The child instances are wrapped in `WeakRef` so they can be garbage collected if the DOM they render into is removed.

On subsequent calls to `renderContent()` with the same content ID, the existing child renderer is retrieved and its `cachedRender()` method is called instead of creating a new renderer. `cachedRender()` updates the child's data and returns the previously-produced `TemplateResult` without re-walking the AST.

## Data Propagation

The data context is a plain object that gets mutated in place. When a parent's data changes (e.g., new settings from the component), `setData()` is called, which mutates the object and then propagates changes to child renderers via `updateSubtreeData()`. Children marked with `inheritsData: true` receive the updates.

There is also a `dataVersion` signal — a simple counter that gets incremented whenever data changes. Reactive expressions read `dataVersion.get()` inside their getter closures, which creates a dependency. When `dataVersion` increments, those reactions re-fire. The increment cascades: bumping a parent's `dataVersion` also bumps all inheriting children's versions.

## The `each` Directive and Lit's `repeat()`

The `{#each}` construct uses Lit's built-in `repeat()` directive for DOM reconciliation. `repeat()` takes an array, a key function, and a template function. It handles keyed reordering, insertion, and removal of DOM nodes efficiently. Each item's template function calls `renderContent()` on the parent renderer, which creates (or retrieves) a child `LitRenderer` for that item.

The key function (`getItemID`) derives identity from object properties like `_id`, `id`, `key`, `hash`, or falls back to the array index.

## Concrete Problems

1. **When the same AST subtree appears at multiple call sites with different data contexts, the content ID (derived solely from AST hash) is identical.** This means distinct rendering contexts can collide on the same cache slot. For `{#each}`, the renderer passes an additional `key` parameter to disambiguate, but this mechanism only applies to that one construct.

2. **Child renderer references are held via `WeakRef`, making cache availability non-deterministic.** A renderer may be garbage collected between render cycles, forcing a full re-creation on the next pass. The performance characteristics of the subtree system depend on GC behavior, which varies across engines and memory pressure scenarios.

3. **Data propagation uses object mutation plus a version counter signal rather than fine-grained signal tracking.** This means any data change bumps the version for the entire tree, causing all reactive expressions in all children to re-evaluate — even expressions that don't depend on the changed data.

4. **Each directive already creates its own `Reaction` that tracks signal dependencies.** The directives use `Reaction.create()` which handles fine-grained dependency tracking automatically. Meanwhile, the `dataVersion` counter is a coarse-grained notification mechanism layered on top. These two systems overlap in purpose.

5. **When a parent re-renders (e.g., from `setData()`), it calls `render()` which rebuilds the AST walk.** But if child renderers exist in `renderTrees`, `renderContent()` returns cached results via `cachedRender()`. The parent still pays the cost of walking the full AST — the savings come only from skipping child AST walks and preserving their `TemplateResult` identity.

## Questions — Evaluate Independently

**Question 1:** Is caching child `LitRenderer` instances necessary at all? What would happen if `renderContent()` always created a fresh `LitRenderer` and called `render()`? What are the actual costs — and are those costs meaningful in practice given that Lit's own diffing handles DOM reconciliation?

**Question 2:** The reactive directives (`ReactiveEachDirective`, `ReactiveConditionalDirective`, `ReactiveAsyncDirective`) each create a `Reaction` that tracks signal dependencies and calls `this.setValue()` on changes. Given that these directives already handle fine-grained reactivity, what role does the subtree caching actually play in the update path? Is there a simpler architecture where the directives alone handle all reactivity without the renderer needing to cache subtrees?

**Question 3:** The `dataVersion` signal is a coarse-grained mechanism that notifies all reactive expressions in the tree when any data changes. Is this necessary, or could the existing signal/reaction system handle data propagation without it? What would the architecture look like if `dataVersion` were removed?

**Question 4:** `WeakRef` storage means cache misses are unpredictable. What are the actual tradeoffs between `WeakRef` (non-deterministic GC), strong references (potential memory leaks if subtrees are removed), and no caching at all? Is there a lifecycle hook in Lit's directive system that could provide deterministic cleanup instead?

**Question 5:** The parent renderer re-walks its entire AST on every `render()` call even when child results are cached. Is the parent-level AST walk itself a meaningful cost? Could the problem be reframed as making the parent's `render()` cheaper or unnecessary rather than caching its children?

## Source Files to Read

- `packages/renderer/src/lit/renderer.js`
- `packages/renderer/src/lit/directives/reactive-each.js`
- `packages/renderer/src/lit/directives/reactive-conditional.js`
- `packages/renderer/src/lit/directives/reactive-async.js`
- `packages/reactivity/src/signal.js`
- `packages/reactivity/src/reaction.js`
