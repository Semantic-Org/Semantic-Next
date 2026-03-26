## Task: Evaluate strategies for preserving directive state across re-renders in a Lit-based template renderer

Read all source files listed at the bottom of this document before answering. Ground your analysis in the actual code, not assumptions.

### Architecture Overview

Semantic UI uses a custom template renderer (`LitRenderer`) that converts an AST (produced by a template compiler) into Lit `html` tagged template literals. The renderer handles several block types — conditionals (`{#if}`), iteration (`{#each}`), async resolution (`{#async}`), and reactive re-render triggers (`{#rerender}`) — each implemented as a Lit `AsyncDirective`.

The rendering model is hierarchical: when the renderer encounters a block node in the AST, it creates a child `LitRenderer` instance via `renderContent()` to render that block's inner content. These child renderers produce their own `TemplateResult` objects, which are composed into the parent's template.

### Directive Lifecycle and State

Each block directive (`ReactiveEachDirective`, `ReactiveConditionalDirective`, `ReactiveAsyncDirective`, `ReactiveRerenderDirective`) follows a pattern:

1. On first `render()` call, create a `Reaction` that watches for reactive changes
2. On subsequent `render()` calls, return `noChange` — the reaction handles updates by calling `this.setValue()`
3. On `disconnected()`, stop the reaction and null it out

This means directive instances hold state that persists across reactive updates (e.g., `ReactiveAsyncDirective` tracks `state`, `resolvedValue`, `generation`). If Lit tears down a directive instance and creates a new one (because the parent template structure changed), that state is lost.

### Data Flow

Data flows through the renderer hierarchy as a plain object. When a block needs its own data scope (each item data, async resolved values), the child data is merged with the parent data: `{ ...parentData, ...blockData }`.

Expression bindings in templates are implemented via `ReactiveDataDirective`, which creates a reaction that evaluates the expression. To trigger re-evaluation when data changes, the renderer maintains a `dataVersion` signal. Expression reactions call `this.dataVersion.get()`, subscribing to it. When data is updated, `dataVersion` is incremented, causing all subscribed expression reactions to re-fire.

Data in `{#each}` item contexts is plain objects (not signals). Each item gets `{ [as]: item, index: i }` spread into the data context. The each directive uses Lit's `repeat()` with key functions for efficient DOM reuse.

### Subtree Rendering

`renderContent()` is the central function for rendering nested content. It creates a child `LitRenderer`, stores it as a `WeakRef` in a `renderTrees` map keyed by a hash of the AST (and optionally a key), and returns the rendered template. On subsequent calls with the same AST hash, it finds the existing child renderer and calls `cachedRender()`, which updates the data and returns the previously-built `litTemplate` without re-running `readAST`.

This means the `TemplateResult` identity is stable for cached subtrees — Lit sees the same template and patches in place rather than tearing down and recreating directives.

### Concrete Problems

1. **Directive state loss on re-render.** When a `{#rerender}` block fires, it calls `renderContent()` for its inner AST. If the child `LitRenderer` is not found in the cache (or was garbage collected), a new renderer produces a new `TemplateResult`. Lit interprets this as a structural change and destroys the old directive tree. Any stateful directive inside the block — such as an `{#async}` block that has already resolved — loses its state and restarts from scratch (e.g., re-enters loading state, re-fires the async expression).

2. **Stale item content in filtered/searched lists.** In a component with `{#each}` over a filtered collection (e.g., nav-menu with search), items display outdated content after the filter changes. The item-level data (text with search highlights, filtered item properties) doesn't reflect the current filter state. This happens despite the each directive re-evaluating and calling `renderContent()` for each item.

3. **Excessive re-evaluation propagation.** When data changes on a parent renderer, every expression directive in every child subtree re-evaluates — even when a specific subtree's relevant data hasn't changed. This is observable as unnecessary computation proportional to (number of subtrees) * (number of expressions per subtree), regardless of how targeted the actual data change was.

### Questions — Evaluate Independently

**Question 1:** What is the fundamental tension between preserving directive state across re-renders and ensuring data freshness in child renderers? Is it possible to achieve both simultaneously within Lit's directive model, or does one necessarily compromise the other?

**Question 2:** The renderer uses plain objects for data contexts rather than fine-grained reactive primitives (signals) at the data-property level. What are the implications of this design choice for the problems described above? Would a different data propagation model change the tradeoffs?

**Question 3:** `renderContent()` currently serves dual roles — it is the factory for new subtree renderers AND the lookup mechanism for cached ones. How does this dual role interact with the problems described? Are there alternative decompositions of these responsibilities?

**Question 4:** The `{#each}` directive uses Lit's `repeat()` with key functions. How does `repeat()`'s own DOM recycling interact with the renderer's subtree caching in `renderContent()`? Could there be conflicting assumptions about which layer "owns" item identity and lifecycle?

### Source Files to Read

- `packages/renderer/src/lit/renderer.js` — Core `LitRenderer` class with `renderContent()`, `cachedRender()`, `bumpDataVersion()`, data management
- `packages/renderer/src/lit/directives/reactive-data.js` — Expression binding directive, subscribes to `dataVersion`
- `packages/renderer/src/lit/directives/reactive-each.js` — Each loop directive, uses `repeat()`, calls `renderContent()` per item
- `packages/renderer/src/lit/directives/reactive-conditional.js` — Conditional directive, evaluates branches
- `packages/renderer/src/lit/directives/reactive-rerender.js` — Rerender directive, re-evaluates content on reactive changes
- `packages/renderer/src/lit/directives/reactive-async.js` — Async directive, tracks resolution state internally
- `packages/renderer/src/lit/directives/render-template.js` — Sub-template rendering directive
- `packages/reactivity/src/signal.js` — Signal implementation with dependency tracking
- `packages/reactivity/src/reaction.js` — Reaction system (computation tracking, scheduling, guard)
