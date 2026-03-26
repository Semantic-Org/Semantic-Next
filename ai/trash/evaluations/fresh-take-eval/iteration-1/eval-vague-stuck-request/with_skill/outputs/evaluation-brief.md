# Evaluation Brief: Subtree Lifecycle in Structural Directives

Read the source files listed at the bottom of this document before answering. Evaluate the current architecture and answer the questions independently, grounding your analysis in the actual code.

Do not read git history or diffs -- evaluate only the current code state.

---

## Architecture Overview

The Semantic UI renderer (`LitRenderer`) converts an AST into Lit `TemplateResult` objects. The AST contains nodes for HTML, expressions, and structural blocks (`if`, `each`, `rerender`, `async`). Each structural block type has a corresponding Lit `AsyncDirective` subclass that manages reactivity for that block.

When the renderer encounters a structural block, it wraps the block's content AST in a closure and passes it to the directive. The directive calls this closure to produce rendered output. The closure invokes `renderContent()` on the parent `LitRenderer`, which creates a child `LitRenderer` instance for the content subtree.

The system has a signals-based reactivity layer. `Signal` holds a value and tracks dependencies. `Reaction` wraps a callback that re-runs when any Signal it accessed changes. `Scheduler` batches pending Reactions and flushes them via microtask.

## Subtree Rendering

`renderContent()` is the bridge between parent and child renderers. It:

1. Computes a content ID by hashing the AST and an optional key
2. Checks `this.renderTrees` (a map of content IDs to `WeakRef<LitRenderer>`) for an existing child renderer
3. If found and still alive, calls `cachedRender(data)` which returns the existing `litTemplate` without re-running `readAST`
4. If not found, creates a new `LitRenderer`, stores it as a `WeakRef`, and calls `render()`

Data flows to subtrees through `bumpDataVersion()`, which increments a `dataVersion` Signal on the renderer and recursively propagates to child renderers that have `inheritsData: true`.

## Directive Pattern

All four structural directives follow the same lifecycle pattern:

- **First `render()` call**: Create a `Reaction` that watches for reactive changes. The Reaction calls the content closure and uses `this.setValue()` to push new content into Lit's rendering pipeline.
- **Subsequent `render()` calls**: Return `noChange` because the Reaction handles updates internally.
- **`disconnected()`**: Stop the Reaction, null the reference.
- **`reconnected()`**: No-op. The Reaction is recreated on the next `render()` call.

The `async` directive has additional state: it manages a `loading`/`success`/`error` state machine and a `generation` counter for promise race condition handling.

## Concrete Problems

1. **Lost async state on parent re-render**: When a parent structural directive (e.g., `rerender`) re-renders its content, the `async` directive within that content may lose its resolved value and revert to the loading state, even though the underlying data has not changed.

2. **Redundant subtree reconstruction**: When a directive's Reaction fires and calls its content closure, `renderContent()` may create a new child `LitRenderer` if the previous one's `WeakRef` has been collected. This produces a fresh `TemplateResult` with new directive instances inside it, each of which creates new Reactions.

3. **Cascading Reaction allocation**: Each time a subtree is freshly rendered (rather than cache-hit), every structural directive and reactive expression within that subtree allocates a new Reaction. For deeply nested templates or large `each` loops, this multiplies the number of active Reactions in the system.

4. **WeakRef fragility for state preservation**: The `renderTrees` cache uses `WeakRef`, which means the garbage collector can collect child renderers at any time. While this prevents memory leaks, it means the cache provides no guarantee of state preservation between render cycles -- the child renderer (and its cached `litTemplate`) may simply not be there when needed.

5. **Data propagation to collected subtrees**: `bumpDataVersion()` walks `renderTrees` and calls `updateData` on each child renderer via `WeakRef.deref()`. If a child has been garbage collected, it silently falls out of the propagation tree with no recovery mechanism.

## Questions -- Evaluate Independently

**Question 1:** What is the actual relationship between the Lit directive lifecycle (`render()`, `disconnected()`, `reconnected()`, `setValue()`) and the `renderContent()` / `WeakRef` cache? When a directive calls `setValue()` with new content, does Lit preserve the directive instances inside that content, or does it recreate them? How does this interact with the WeakRef-based caching?

**Question 2:** Is the `WeakRef`-based caching in `renderTrees` achieving its intended purpose? Under what conditions will the GC collect a child renderer that is still logically "in use" (i.e., its rendered output is still in the DOM)? Is there a fundamental tension between using `WeakRef` for memory safety and needing deterministic state preservation?

**Question 3:** When a structural directive's Reaction fires and it calls its content closure (which calls `renderContent()`), what determines whether the output is a "same" `TemplateResult` from Lit's perspective vs. a "new" one? Does Lit diff at the template-identity level or the content level? What are the implications for nested directive preservation?

**Question 4:** The `async` directive maintains internal state (`state`, `resolvedValue`, `generation`) on the directive instance. If the parent produces a new `TemplateResult` that causes Lit to create a new `ReactiveAsyncDirective` instance, this state is lost. Is there a way to decouple the async resolution state from the directive instance's lifecycle, and where would that state naturally live?

**Question 5:** Each structural directive creates exactly one `Reaction` per directive instance. If directive instances are recreated due to parent re-renders, the old Reaction is stopped (via `disconnected()`) and a new one is created. What is the actual cost of this -- both in terms of the Reaction teardown/setup and in terms of the dependency graph being rebuilt? Is this cost significant enough to justify architectural changes, or is it an acceptable overhead?

## Source Files to Read

- `packages/renderer/src/lit/renderer.js`
- `packages/renderer/src/lit/directives/reactive-data.js`
- `packages/renderer/src/lit/directives/reactive-each.js`
- `packages/renderer/src/lit/directives/reactive-conditional.js`
- `packages/renderer/src/lit/directives/reactive-rerender.js`
- `packages/renderer/src/lit/directives/reactive-async.js`
- `packages/reactivity/src/signal.js`
- `packages/reactivity/src/reaction.js`
- `packages/reactivity/src/scheduler.js`
