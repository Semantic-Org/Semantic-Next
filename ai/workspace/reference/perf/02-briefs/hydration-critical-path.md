## Task: Evaluate the hydration critical path — what work is necessary synchronously vs. what can be deferred

Read all source files listed below before answering. Evaluate the current code, not git history.

### Architecture Overview

This is a web component framework with server-side rendering (SSR) via Declarative Shadow DOM (DSD). The browser parses DSD before JavaScript loads, so the user sees styled content immediately. When JS loads and `customElements.define()` runs, each component's `connectedCallback` detects the existing shadow root and hydrates — wiring reactive bindings to the server-rendered DOM instead of re-rendering.

The hydration lifecycle in `WebComponentBase.connectedCallback()` → `hydrate()`:

1. `getData()` — builds the component's data context from settings, spec, properties
2. `prototypeTemplate.clone({ data, element, renderRoot })` — creates a per-instance Template
   - The Template constructor, when given `renderRoot`, calls `attach(renderRoot)`
   - `attach()` calls `initialize()` if not yet initialized
   - `initialize()` runs `createComponent()`, creates the Renderer instance, builds lifecycle closures, creates a state-watching Reaction, builds the `callParams` object, fires `onCreated`
   - `attach()` then calls `attachEvents()` and `bindKeys()`
3. Build hydration entries from AST (cached on prototype after first instance)
4. `hydrateMarkers()` — walks the server DOM, wires Reactions to existing nodes
5. `removeMarkers()` — walks shadow root, removes all hydration comment markers

### Empirical Measurements (1000-item card list component, VM with 8 CPUs)

Total `hydrate()`: ~23ms

| Phase | Time |
|-------|------|
| clone (includes initialize + attach + attachEvents) | 2.4ms |
| hydrateMarkers | 13.7ms |
| removeMarkers | 6.4ms |

From Chrome DevTools flamechart analysis at 1000 items:
- `attachEvents`: 0.9ms — iterates event definitions, parses event strings, sets up shadow root delegation
- `hashCode` (fnv1a): 1.4ms — called in Renderer constructor, hashes AST + data context
- `removeMarkers` (TreeWalker + node.remove): 5-6ms

### Concrete Observations

1. The component's shadow root already contains correctly rendered content from the server. The user can see and read the content before hydration runs.
2. `attachEvents()` sets up event delegation on the shadow root.
3. `removeMarkers()` removes comment nodes used as hydration anchors.
4. `hashCode` in the Renderer constructor hashes the entire AST and data context through fnv1a.
5. The `callParams` object constructed in `initialize()` includes ~20 `.bind()` calls.
6. A state-watching Reaction is created in `initialize()` that depends on every Signal in `this.state`.

### Questions — Evaluate Independently

**Question 1:** Before evaluating what could change, explain why the current hydration lifecycle is ordered the way it is. What constraints drive the current sequencing? Then: what is the minimum set of operations that must complete synchronously for the component to be functionally correct? Consider: what breaks if a setting is changed programmatically immediately after hydration? What breaks if the user interacts 50ms later?

**Question 2:** The Template constructor's behavior changes based on whether `renderRoot` is passed — it triggers the full `attach()` → `initialize()` chain. Is there a way to restructure the hydration path to separate "create the template and wire reactivity" from "set up events, keys, and other interactive machinery"? What are the ordering constraints?

**Question 3:** What is the cost model of `Reaction.create()` — both creating the Reaction object and running it for the first time? During hydration, several Reactions are created that evaluate on firstRun purely to register Signal dependencies. Is there a cheaper way to establish these dependency relationships?

**Question 4:** Are there any operations in the current hydration path that are redundant — work done during hydration that duplicates work the server already did, or work done synchronously that could be done lazily on first access?

### Source Files to Read
- `packages/component/src/engines/native/base.js` — WebComponentBase: connectedCallback, hydrate, fullRender, getData
- `packages/templating/src/template.js` — Template class: constructor, initialize, attach, clone, render, callParams
- `packages/renderer/src/engines/native/renderer.js` — Renderer class: constructor, hydrateMarkers
- `packages/renderer/src/engines/native/reaction-scope.js` — ReactionScope
- `packages/reactivity/src/reaction.js` — Reaction.create
- `packages/reactivity/src/dependency.js` — Dependency.depend
- `packages/renderer/test/browser/ssr-hydration.test.js` — Hydration tests. If something about the current ordering seems unnecessary, check whether tests reveal constraints.
