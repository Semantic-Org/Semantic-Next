# Lazy Hydration Analysis

## Current Architecture

### What happens today (native base class)

`connectedCallback` in `engines/native/base.js` takes one of two paths:

1. **DSD hydration path** (server-rendered content exists in shadowRoot):
   - Stylesheet adoption (sync)
   - Deferred one rAF: `template.clone()` -> `initialize()` -> `buildHTMLString()` -> `hydrateMarkers()` -> `onRendered()`
   - During rAF deferral: `el.component`, `el.dataContext`, `el.template` are all **undefined**

2. **Full render path** (no server content):
   - `attachShadow()`, stylesheet adoption
   - Synchronous: `template.clone()` -> `initialize()` -> `render()` -> `shadowRoot.append(fragment)`
   - `el.component` is available immediately after `connectedCallback` returns

### Why the rAF exists in the hydration path

The comment explains: "DSD means the visual is already correct -- defer the expensive hydration wiring so the browser can paint and respond to input." This is Chesterton's fence -- it exists because the user can already see the rendered content (the browser parsed DSD), so deferring the JS wiring lets the browser paint first. The rAF costs nothing visually but gives the browser a chance to lay out and paint all the DSD content before JS executes.

### What the `ssr` attribute does

Components rendered with `hydrate: false` get an `ssr` attribute. In `connectedCallback`, `this.hasAttribute('ssr')` causes an early return -- the component never self-hydrates. This is for static SSR pages where JS is loaded for other components but these specific elements don't need interactivity. This is NOT lazy hydration; it's "never hydrate."

### The `_hydrating` guard in the constructor

When `this.shadowRoot` exists at construction time (DSD), `this._hydrating = true` is set. This suppresses `requestUpdate()` calls triggered by attribute parsing (the browser fires `attributeChangedCallback` for every server-rendered attribute before `connectedCallback`). Without this guard, each attribute would schedule a re-render of content that doesn't exist yet.

## Contracts That Break Under Deferred Hydration

### 1. `el.component` (CRITICAL)

**Current contract:** After `connectedCallback` completes (or after the `rendered` event for DSD path), `el.component` is the object returned by `createComponent`. It is the primary API surface for programmatic interaction.

**Who depends on it:**
- `panels.js` line 145-152: `panel.component.initialized.get()`, `panel.component.setInitialized()` -- parent queries children's component instances during its own initialization
- `panel.js` line 20: `panel?.component.getNaturalSize(...)` -- sibling access
- `global-search.js` line 41: `$('ui-modal').component().show()` -- cross-component invocation
- `global-search.js` line 46: `$('ui-modal').get(0).component.hide()` -- same pattern
- `mobile-menu-toggle.js` line 9: `$('mobile-menu', { root: document }).component()` -- document-wide query
- `query.js` line 2573: `this.map(el => el.component).filter(Boolean)` -- the Query `.component()` helper

**Risk under lazy hydration:** If a component is off-screen and unhydrated, `el.component` is `undefined`. Any code doing `$('ui-modal').component().show()` throws a TypeError. The Query `.component()` helper filters out `undefined` values so it would return `undefined` instead of the expected component instance.

### 2. `el.dataContext` (HIGH)

Same lifecycle as `el.component`. Set during `hydrate()` / `fullRender()`. Code accessing `el.dataContext.someSignal.get()` would fail on unhydrated elements.

### 3. `el.settings` (LOW RISK)

The settings proxy is created in the **constructor**, not during hydration. It's available immediately because `createSettingsProxy` is called when `resolvedProperties` exists in the config. Property setters also work because they're defined by the factory on the prototype. So `el.color = 'red'` works even before hydration -- the value is stored in `propertyStore`. The risk is that setting a property triggers `requestUpdate()` (via the factory setter), which calls `template.render()` -- but `this.template` is undefined before hydration, so `requestUpdate` is a no-op. The value is stored but no reactive update happens until hydration.

### 4. `findParent` / `findChild` (HIGH)

`Template.findParentTemplate` walks the DOM tree looking for ancestors with `component` set. `Template.findChildTemplates` walks shadow children checking `child.component`. If a parent or child hasn't hydrated, these traversals skip it. The `panel.js` / `panels.js` pattern (child finds parent to register with it) would silently fail.

### 5. `Template.renderedTemplates` (MEDIUM)

Templates register themselves in a global Map during `onCreated` (called at the end of `initialize()`). `findTemplate('uiPanels')` would return nothing if that component hasn't hydrated. This is a lookup table for cross-component communication.

### 6. Lifecycle events (MEDIUM)

`created`, `rendered`, `destroyed` events are dispatched via `$(this.element).dispatchEvent()`. Code that does `$(el).onNext('rendered')` to coordinate timing would never resolve for an unhydrated component. The test suite uses this pattern extensively.

## Cost Analysis

### Per-component hydration cost (from the existing perf instrumentation)

The `hydrate()` method in base.js has detailed `performance.now()` instrumentation already. The breakdown stored in `globalThis.__hydTiming`:

- `getData()` -- build settings/state data context
- `template.clone()` -- clone prototype template (creates new Template instance, reactive state, signals)
- `template.initialize()` -- runs `createComponent`, sets up Reactions, builds callParams, fires `onCreated`
- `buildHTMLString()` -- produce entries array (AST walk, string assembly)
- `hydrateMarkers()` -- TreeWalker passes, set up Reactions for each binding
- `removeMarkers()` -- final comment node cleanup

For a typical spec-driven primitive (e.g., `ui-button` with 5-8 spec attributes):
- `clone()` + `initialize()` dominate: Signal creation, Proxy setup, createComponent execution
- `hydrateMarkers()` scales with binding count (each Reaction is a Signal subscription + DOM write)
- `buildHTMLString()` is cached on the prototype after first hydration (`prototypeTemplate._hydrationEntries`)

### Page-level impact estimate

A typical docs page with 20-50 components:
- **Above the fold (visible):** ~5-15 components (nav, header, hero, first content section)
- **Below the fold:** ~10-35 components (examples, code blocks, more content sections)

If hydration costs ~2-5ms per component (template clone + initialize + marker binding), 50 components = 100-250ms total blocking time. Deferring the 30 below-fold components saves 60-150ms of main thread work during initial load.

However: the current DSD path already defers hydration by one rAF. All 50 components fire `connectedCallback` synchronously during DOM parsing, but the actual hydration work runs in the next animation frame. This means the browser DOES get a chance to paint the DSD content before any hydration runs. The 50 hydrations then batch into a single rAF callback (they all schedule into the same frame).

**The real question is not "does off-screen hydration block paint" (it doesn't, thanks to rAF deferral) but "does it block interactivity after paint."** The answer is yes -- those 100-250ms of hydration in the rAF prevent the browser from handling click/scroll events until complete.

## Approach Evaluation

### Option A: IntersectionObserver + interaction listener (proposed)

Defer hydration until the component enters the viewport or receives user interaction.

**Pros:**
- Eliminates hydration cost for off-screen components entirely
- Could save 60-150ms of post-paint blocking time on content-heavy pages

**Cons:**
- Breaks `el.component` contract -- any programmatic access to an unhydrated component fails silently or throws
- Breaks parent-child coordination patterns (panels, modal)
- Breaks `findParent`/`findChild`/`findTemplate` lookups
- Requires every consumer to handle "component might not exist yet"
- IntersectionObserver has its own overhead: each registration is ~0.1ms, and the callback fires on the main thread
- For 30 off-screen components, IO setup = ~3ms -- small but nonzero
- Race condition: user scrolls fast, component enters viewport while hydration of another component is running

### Option B: requestIdleCallback batching (alternative)

Instead of deferring indefinitely, batch hydration into idle periods using the existing `idleCallback` utility in `@semantic-ui/utils`.

**Pros:**
- Eventually all components hydrate (contracts satisfied within ~50-100ms of idle time)
- No IntersectionObserver overhead
- No broken API contracts (just delayed)
- Simple implementation: replace `requestAnimationFrame` with a priority queue

**Cons:**
- Still blocks when the main thread is busy (rIC can be starved)
- "Eventually consistent" `el.component` is still a footgun
- No actual page payload reduction -- all JS still runs, just later

### Option C: Prioritized hydration queue (recommended approach, if pursued)

Split hydration into two tiers without changing the contract:

1. **Immediate tier:** Components with active event listeners, components queried by other components (`findParent` targets), components with programmatic API usage patterns
2. **Deferred tier:** Pure display components (spec-driven primitives with no `createComponent` or only static `createComponent`)

Detection heuristic: If `createComponent` is defined AND returns methods, the component is interactive. If `createComponent` is absent or returns only data, it's display-only.

**Pros:**
- Display-only components (buttons, labels, icons, dividers, containers) are the majority on docs pages -- typically 60-80% of components
- Their hydration is cheap AND safe to defer because nobody calls `.component.doSomething()` on a `ui-label`
- Interactive components (modal, panels, search) hydrate immediately -- no broken contracts

**Cons:**
- Heuristic can be wrong -- a display component might be queried by a parent
- Additional complexity in the factory/base class

## Recommendation: Not pursued at this time

**Rationale:**

1. **The existing rAF deferral already solves the paint problem.** DSD content is visible instantly. The user sees the page before any hydration runs. This is the high-value win that SSR + DSD already delivers.

2. **The post-paint blocking window (100-250ms for 50 components) is real but not critical.** This is comparable to React hydration on similar-complexity pages. The native renderer's hydration is already 33% faster than Lit. The ROI of lazy hydration is marginal relative to the contract breakage risk.

3. **The contract surface is too wide.** Five distinct APIs (`el.component`, `el.dataContext`, `findParent`, `findChild`, `Template.renderedTemplates`) plus Query's `.component()` helper all assume hydration has completed. Making these lazy-safe requires either:
   - A Promise-based API (`await el.whenHydrated()`) -- breaks synchronous call sites
   - Auto-hydration on access (`el.component` getter triggers hydration) -- unpredictable timing, hidden performance cliffs
   - Both of these are worse than the problem they solve

4. **The real optimization target is hydration speed, not hydration timing.** The SSR plan already identifies the path: cache `_hydrationEntries` on the prototype (done), then move to WASM for string operations. A 2x speedup in `hydrateMarkers` would reduce the 100-250ms window to 50-125ms -- more impactful than lazy hydration and zero risk to contracts.

5. **If pursued later, opt-in per-component is the only safe shape.** A `hydration: 'lazy'` option in `defineComponent` that the component author explicitly chooses, with documentation that `el.component` is unavailable until hydration. This puts the contract tradeoff in the hands of the person who knows whether the component needs immediate programmatic access. But even this should wait until there's empirical evidence that post-paint hydration time is a user-facing problem on real pages.

## What to do instead

1. **Profile real docs pages** with the existing `globalThis.__hydTiming` instrumentation to get actual numbers. The estimates above are theoretical.
2. **Optimize `hydrateMarkers` itself** -- the parallel walker approach, the `buildHTMLString` call during attribute hydration, and the Reaction creation loop are all candidates for micro-optimization.
3. **Batch rAF hydrations with yielding** -- instead of running all 50 hydrations in one rAF, yield to the browser every N components (e.g., hydrate 5, yield via `setTimeout(0)`, hydrate 5 more). This keeps the visual painted AND keeps the main thread responsive. This is a much safer version of "lazy hydration" that preserves all contracts.

Option 3 (rAF batching with yielding) is the recommendation if post-paint interactivity is measured as a real problem. It preserves all contracts, requires no API changes, and can be implemented entirely within `connectedCallback` using a shared hydration queue.
