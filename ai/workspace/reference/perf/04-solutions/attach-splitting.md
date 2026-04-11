# Template.attach() Splitting Analysis

## Current Architecture

`Template.attach()` chains three operations as one unit:

```js
async attach(renderRoot, { parentNode, startNode, endNode } = {}) {
  if (!this.initialized) this.initialize();
  if (this.renderRoot == renderRoot) return;
  this.renderRoot = renderRoot;
  this.parentNode = parentNode;
  this.startNode = startNode;
  this.endNode = endNode;
  this.attachEvents();   // event delegation + MutationObserver for theme
  this.bindKeys();       // document-level keydown/keyup listeners
  if (this.attachStyles) await this.adoptStylesheet();
}
```

### Why it exists as a single unit

`attach()` gates on `renderRoot` — it's the moment when the template becomes anchored to a live DOM tree. Events and keys both need `renderRoot` and `parentNode` to function (event delegation binds to `renderRoot`, `isNodeInTemplate()` uses `parentNode`/`startNode`/`endNode` for hit-testing). Combining them ensures the template is never in a half-wired state where reactivity works but interaction doesn't.

## Caller Inventory

### 1. WebComponentBase.hydrate() — via constructor

```
prototypeTemplate.clone({ data, element, renderRoot })
  → constructor sees renderRoot → calls this.attach(renderRoot)
    → initialize() (since !this.initialized)
    → attachEvents()
    → bindKeys()
```

The clone() in hydrate() passes `renderRoot`, which triggers the constructor path (template.js:102). This means `initialize()` + `attach()` run synchronously during clone, before `hydrateMarkers()`.

**What hydration actually needs from attach():**
- `this.renderRoot` / `this.parentNode` assigned (used by `isNodeInTemplate()` for event hit-testing later)
- `this.eventController` created (referenced as `abortController` in `callParams`, though not called during hydration itself)
- Events and keys wired

**What it does NOT need immediately:**
- Event delegation to be active (no user interaction can occur during the synchronous hydration path — the rAF already ran, and the JS thread is busy)
- Key bindings active (same reasoning)

### 2. WebComponentBase.fullRender() — via constructor

Same constructor path as hydration. Events need to be wired before `render()` returns because `render()` calls `onRendered` via setTimeout(0), and user interaction can begin after the microtask completes.

**Timing:** `fullRender()` is synchronous and the component is not visible until the call stack unwinds. Events could technically be deferred by a microtask or rAF without observable difference.

### 3. Native renderer — createSubtemplate()

```
currentInstance.initialize();
const templateFragment = currentInstance.render();
region.setContent(templateFragment);
currentInstance.attach(renderRoot, { parentNode, startNode, endNode });
```

Explicit `attach()` after both `initialize()` and `render()`. Events need the DOM to exist for delegation, so this ordering is correct. No splitting needed here — the caller already controls the sequencing.

### 4. Native renderer — hydrateSubtemplate()

```
currentInstance.initialize();
// ... hydrate inner markers ...
currentInstance.rendered = true;
currentInstance.attach(renderRoot, { parentNode, startNode, endNode });
```

Same explicit pattern. attach() runs after hydration completes. No splitting needed.

### 5. Lit render-template directive

```
attachTemplate() {
  this.template.setElement(element);
  this.template.attach(renderRoot, { element, parentNode, startNode, endNode });
  if (this.parentTemplate) this.template.setParent(this.parentTemplate);
}
```

Called from `renderTemplate()` on every Lit render cycle. The `attach()` early-returns on `this.renderRoot == renderRoot` for subsequent calls, so events are only wired once.

## Cost Analysis

### What `attachEvents()` does

For each key in the `events` object:
1. Creates one `AbortController` (cheap — no DOM operation)
2. Optionally creates a `MutationObserver` on `document.documentElement` if `onThemeChanged` is defined (DOM operation, ~0.05ms)
3. Parses each event string (string operations, negligible)
4. For delegated events: `$(this.renderRoot).on(eventName, selector, handler)` — one `addEventListener` call per event name on the shadow root
5. For iOS touch workaround: `$(selector, { root }).on(eventName, noop)` — queries + adds noop listeners

For a typical component like `menu-item` (2 events): ~0.1-0.2ms
For a complex component like `global-search` (6+ events): ~0.3-0.5ms

At 1000 items, if each item is a component with events, the cost is:
- Simple (2 events): ~100-200ms total
- But these are typically web components with their own shadow roots, not subtemplates

For subtemplates (the `{>child}` pattern), events are per-subtemplate-instance. This is the multiplied case.

### What `bindKeys()` does

1. Checks `Object.keys(keys).length == 0` — returns early if no keys (most components)
2. If keys exist: two `addEventListener('keydown'/'keyup', ...)` calls on `document`

Cost: negligible when no keys are defined (early return). Only `global-search` and `nav-menu` define keys among first-party components.

### The 0.9ms at 1000 items claim

This likely reflects subtemplates inside an `{#each}` where each subtemplate has a few events. Each `attachEvents()` call does:
- 1 AbortController creation
- N `addEventListener` calls (where N = number of event strings)
- N string parsing operations
- Potentially N `$()` queries for the iOS touch workaround

At 1000 iterations with 2 events each: 2000 addEventListener calls + 2000 query operations + 1000 AbortController creations. 0.9ms is plausible.

## Evaluation of Proposed Solutions

### Option A: Split attach() into attachReactivity() + attachInteractivity()

**Problem:** There is no "reactivity" work in `attach()`. The reactivity (Reactions, Signals) is set up in `initialize()`. `attach()` is purely about interactivity (events, keys, styles). Splitting it would create a misleading API.

**Verdict:** Misframed. Not recommended.

### Option B: Pass `deferEvents` option to attach()

```js
attach(renderRoot, { deferEvents = false, ... } = {}) {
  // ... assign renderRoot, parentNode, etc.
  if (deferEvents) {
    requestAnimationFrame(() => {
      this.attachEvents();
      this.bindKeys();
    });
  } else {
    this.attachEvents();
    this.bindKeys();
  }
}
```

**Pros:** Minimal API change. Only hydration path passes `deferEvents: true`.
**Cons:** Creates a window where the component is visible but non-interactive. For hydration this is acceptable (the component was already non-interactive server HTML). For subtemplates in an `{#each}`, deferring might cause a missed first-click if the user interacts during the rAF gap.

**Verdict:** Reasonable for the hydration path only. But the hydration path is already inside a rAF (base.js:89), so the events would be deferred to a second rAF — that's 32ms of non-interactivity in the worst case. Acceptable for SSR.

### Option C: Constructor option `autoAttach: false`

**Problem:** The constructor already supports not passing `renderRoot` (template.js:101-103). The explicit callers (native renderer subtemplates, Lit directive) already don't pass it. Only the `clone()` calls from WebComponentBase pass `renderRoot`. This option would just move the `if (renderRoot)` check to the caller.

**Verdict:** Redundant with existing behavior. Not recommended.

### Option D: Move eventController creation to initialize()

Currently `eventController` is created inside `attachEvents()` (template.js:512). But `callParams` (built during `initialize()`) references it as `abortController: this.eventController` (template.js:308). On the first `initialize()` call, `this.eventController` is `undefined`, so `callParams.abortController` is `undefined`.

This is actually a latent issue: any code in `createComponent` that tries to use `abortController` from the call params will get `undefined` because `eventController` hasn't been created yet.

**Verdict:** This is a correctness fix, not a performance optimization. Should be done regardless.

## Recommendation

**Do one targeted thing: defer events during hydration by not passing `renderRoot` to clone().**

The hydration path in `WebComponentBase.hydrate()` currently passes `renderRoot` to `clone()`, which triggers the constructor path into `attach()` (and therefore `attachEvents()` + `bindKeys()`). Instead:

```js
hydrate(prototypeTemplate) {
  // ...
  this.template = prototypeTemplate.clone({
    data,
    element: this,
    // Don't pass renderRoot — avoid immediate event wiring
  });

  this.template._isHydrating = true;
  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();

  // ... hydrate markers ...

  this.template._isHydrating = false;
  this.template.rendered = true;
  this._hydrating = false;

  // Wire events after hydration completes
  this.template.attach(this.renderRoot);

  // ...
}
```

This mirrors what the native renderer's `createSubtemplate()` and `hydrateSubtemplate()` already do: explicit `initialize()`, then work, then explicit `attach()`.

### Why this works

1. `clone()` without `renderRoot` still calls `initialize()` (because no `renderRoot` means `attach()` is never called, but `initialize()` runs when needed — at template.js:329 during `attach()`, or at the first `render()` call). Wait — actually, looking more carefully:

   - Constructor (template.js:101-103): `if (renderRoot) { this.attach(renderRoot); }` — this triggers `attach()` → `initialize()`.
   - Without `renderRoot`, `initialize()` is never called during construction.
   - `hydrate()` never calls `this.template.render()` — it wires markers directly.
   - So we need to call `initialize()` explicitly.

Revised approach:

```js
hydrate(prototypeTemplate) {
  this.template = prototypeTemplate.clone({
    data,
    element: this,
    // No renderRoot — defer event wiring
  });

  // Initialize reactivity and createComponent (but not events)
  this.template.initialize();

  this.template._isHydrating = true;
  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();

  // ... hydrate markers ...

  this.template._isHydrating = false;
  this.template.rendered = true;
  this._hydrating = false;

  // Now wire events — DOM is ready, hydration is complete
  this.template.attach(this.renderRoot);
}
```

But wait — this is exactly what happens today. The constructor calls `this.attach(renderRoot)`, which calls `this.initialize()` (since `!this.initialized`), then does event wiring. The sequence is:

**Current:** constructor → attach() → initialize() → attachEvents() → bindKeys()
**Proposed:** constructor → (nothing) → explicit initialize() → hydrate markers → explicit attach() → attachEvents() → bindKeys()

The difference: events are wired *after* marker hydration instead of *before*. This saves nothing in total work — the same addEventListener calls happen. The only win is if we further defer `attach()` to a rAF:

```js
// Wire events on next frame — hydrated DOM is already interactive-looking
requestAnimationFrame(() => {
  this.template.attach(this.renderRoot);
});
```

### Estimated savings

For a **single component** hydration: negligible. The 0.9ms figure requires 1000 subtemplate items.

For **subtemplate hydration inside `{#each}`**: the native renderer's `hydrateSubtemplate()` already calls `attach()` explicitly after hydration. This is the real multiplied path. To defer here:

```js
// In renderer.js hydrateSubtemplate():
// Instead of immediate attach, defer
requestAnimationFrame(() => {
  currentInstance.attach(renderRoot, { ... });
});
```

But this risks a race: the Reaction wired at line 983 may fire before events are attached, causing a re-render that expects the event controller to exist.

### The real bottleneck

The `eventController` is referenced in `callParams` as `abortController`. If `attachEvents()` hasn't run, `callParams.abortController` is `undefined`. Any code that uses `abortController` in event handlers after a reactive update but before `attachEvents()` runs would fail silently.

However — looking at `callParams` more carefully (template.js:308): `abortController: this.eventController` — this is captured at `initialize()` time, not lazily. So it's `undefined` until `attachEvents()` creates the controller. This means deferring `attachEvents()` would leave `callParams.abortController` permanently `undefined` unless we update it after.

## Final Recommendation

**Move `eventController` creation to `initialize()`, then defer `attach()` in the hydration path.**

### Step 1: Create eventController during initialize() (correctness fix)

In `template.js`, move the AbortController creation from `attachEvents()` to `initialize()`:

```js
initialize() {
  // ... existing code ...
  this.eventController = new AbortController();
  // ... callParams now gets a valid abortController ...
}
```

And in `attachEvents()`, remove the creation but keep the abort-and-recreate pattern:

```js
attachEvents(events = this.events) {
  if (!this.parentNode || !this.renderRoot) {
    fatal('You must set a parent before attaching events');
  }
  this.removeEvents();
  // Recreate controller for this event binding cycle
  this.eventController = new AbortController();
  // Update callParams reference
  if (this.callParams) {
    this.callParams.abortController = this.eventController;
  }
  // ... rest unchanged ...
}
```

### Step 2: Defer attach() after hydration in WebComponentBase

```js
hydrate(prototypeTemplate) {
  // ...
  this.template = prototypeTemplate.clone({
    data,
    element: this,
    // No renderRoot — separates initialize from event wiring
  });
  this.template.initialize();

  this.template._isHydrating = true;
  // ... hydrate markers ...
  this.template._isHydrating = false;
  this.template.rendered = true;
  this._hydrating = false;

  // Attach events after hydration — deferred to next frame
  // so the browser can process input from the initial paint
  requestAnimationFrame(() => {
    this.template.attach(this.renderRoot);
  });
}
```

### Step 3: No changes needed for subtemplates

The native renderer's `createSubtemplate()` and `hydrateSubtemplate()` already call `attach()` explicitly and synchronously after the work completes. Deferring these would be risky (Reaction race) and the per-component cost is small (~0.1ms). The multiplied cost only matters in the `{#each}` hydration path, where all 1000 items are processed in one synchronous batch before any rAF fires — so deferring individual `attach()` calls wouldn't help within that batch anyway.

### Expected improvement

- **Hydration of single component:** ~0.1-0.5ms saved (events deferred past the critical hydration path)
- **Hydration of component with 1000 subtemplate items:** 0ms saved (subtemplate attach is already explicit, and the synchronous batch runs before any rAF)
- **Correctness:** `callParams.abortController` is no longer `undefined` during `createComponent` callbacks

### Honest assessment

The 0.9ms figure for 1000 items is real but small relative to the total hydration cost. The deferral helps Time-to-Interactive for the top-level component but doesn't reduce total work. The main value of this change is:

1. **Correctness**: fixing the `eventController` being `undefined` in `callParams`
2. **Architecture**: aligning the hydration path with the subtemplate pattern (explicit `initialize()` then explicit `attach()`)
3. **Future-proofing**: once event deferral is established, individual subtemplate `attach()` calls could be batched and deferred as a group in a later optimization
