# Plan: Separate Initialize from Attach + Clarify Abort Controller Lifecycles

## Dependencies
None. Standalone architectural change. Complements plan 02 (deferred marker removal) by establishing the pattern of deferred post-hydration work, but neither blocks the other.

## Problem

### Attach coupling
The hydration path passes `renderRoot` to `clone()`, which triggers `attach()` from the Template constructor, which chains `initialize()` → `attachEvents()` → `bindKeys()` in one synchronous unit. Hydration only needs `initialize()` synchronously (to create the Renderer, component instance, and state Reactions). Event wiring can happen after marker hydration completes.

The native renderer's `createSubtemplate()` and `hydrateSubtemplate()` already use the correct pattern: explicit `initialize()`, then work, then explicit `attach()`. The top-level hydration path should match.

### Abort controller conflation
Two distinct lifecycles are represented by AbortControllers:

1. **Template lifetime** — `this.abortController` / `this.abortSignal`, created in the Template constructor (line 80-81). Used for timers (`interval`, `timeout`) and anything that should end when the component is destroyed. Dies in `onDestroyed`.

2. **Event binding** — `this.eventController`, created in `attachEvents()` (line 512). Used for DOM event listeners. Dies in `removeEvents()`, reborn on re-attachment (e.g., DOM moves). Can cycle independently of the template lifetime.

The current code exposes `abortController: this.eventController` in `callParams` (line 307). This is:
- **Always `undefined`** — `callParams` is built during `initialize()`, before `attachEvents()` creates `eventController`. The value is captured, not live.
- **The wrong controller** — user code using `callParams.abortController` for timers or fetch cleanup would get the event controller, which is killed and recreated on event re-attachment. A timer set in `createComponent` would silently lose its abort signal after a DOM move.

## Solution

### Step 1: Separate initialize from attach in the hydration path

In `base.js hydrate()`, stop passing `renderRoot` to `clone()`. Call `initialize()` explicitly, do the hydration work, then call `attach()` after:

```js
hydrate(prototypeTemplate) {
  // ...
  this.template = prototypeTemplate.clone({
    data,
    element: this,
    // No renderRoot — don't trigger attach() from constructor
  });
  this.template.initialize();

  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();

  // ... hydrate markers ...

  this.template.rendered = true;
  this._hydrating = false;

  // Attach events after hydration completes
  this.template.attach(this.renderRoot);
}
```

This aligns top-level hydration with the subtemplate pattern that already exists in the native renderer.

### Step 2: Expose the lifecycle signal in callParams, not the event controller

In `template.js`, change `callParams` to expose the template lifetime signal:

```js
// Before (line 307) — captures undefined, wrong controller
abortController: this.eventController,

// After — plain value, always valid, correct lifecycle
abortSignal: this.abortSignal,
```

`this.abortSignal` is created in the Template constructor (line 81) and never changes. It's a plain property on `callParams` — no getter, fully inspectable in console.

Note: this changes `callParams.abortController` (an AbortController) to `callParams.abortSignal` (an AbortSignal). The signal is what consumers actually need — you pass signals to `fetch`, `addEventListener`, `setTimeout` etc. Exposing the controller lets callers abort the template from user code, which is not the intended API. Apply the same change to `buildCallParams()` (line 851).

### Step 3: Event controller chains to lifecycle signal

In `attachEvents()`, when creating the event controller, register it to abort when the lifecycle signal fires:

```js
attachEvents(events = this.events) {
  // ...
  this.removeEvents();
  this.eventController = new AbortController();

  // Cascade: if the template lifetime ends, abort events too
  this.abortSignal.addEventListener('abort', () => {
    this.eventController.abort();
  });

  // ... rest unchanged, uses this.eventController for event listeners ...
}
```

This makes the relationship explicit: event binding is a child of the component lifecycle. Lifecycle end cascades to event cleanup. Events can cycle independently (DOM moves) without affecting the lifecycle.

### Step 4: Update attachEvent() instance method

The `attachEvent()` method (line 869) currently uses `this.eventController` directly — this is correct and doesn't change. User code calling `attachEvent()` from callbacks gets event-scoped cleanup automatically.

## Files to Change

| File | Change |
|------|--------|
| `packages/component/src/engines/native/base.js` | Hydration path: don't pass `renderRoot` to `clone()`, call `initialize()` then `attach()` explicitly |
| `packages/templating/src/template.js` | `callParams`: replace `abortController: this.eventController` with `abortSignal: this.abortSignal`. Same in `buildCallParams()`. Add cascade in `attachEvents()` |

## What This Fixes

1. **`callParams.abortSignal` is always valid** — available from `initialize()`, never `undefined`, correct lifecycle
2. **Inspectable** — plain value on a plain object, no getter indirection
3. **Correct semantics** — timers and fetch use the lifecycle signal (lives with the component), DOM events use the event controller (lives with attachment)
4. **Hydration path aligns with subtemplate pattern** — explicit `initialize()` → work → `attach()`
5. **DOM move safety** — re-attaching events (which creates a new event controller) doesn't kill the lifecycle signal that timers depend on

## Breaking Change Assessment

`callParams.abortController` → `callParams.abortSignal` is a rename + type change. Searching `src/` shows zero first-party components destructure `abortController` from callParams. All event cleanup uses `attachEvent()` which reads `this.eventController` directly. The risk is downstream users who may use the documented but broken property — since it was always `undefined`, any such code was already non-functional.

## Review Contentions

> **Cascade listener cleanup.** The `this.abortSignal.addEventListener('abort', ...)` call in `attachEvents()` must pass `{ signal: this.eventController.signal }` as the listener option. Without this, the abort listener accumulates on the lifecycle signal across reattach cycles (detach → reattach creates a new eventController but the old listener remains). The eventController's own signal auto-removes the listener when events are torn down.

> **`abortSignal` already exists in callParams.** Line 289 of template.js already has `abortSignal: this.abortSignal`. The actual work is removing the dead `abortController: this.eventController` at line 307 (and `buildCallParams()` at line 851), not adding a new property. Verify before implementing.

> **TypeScript types need updating.** `packages/templating/types/template.d.ts` line 393 references the old `abortController` property. Must be updated to match.

## Complexity
Category 3 — moderate. Two files, clear transformation, but touches lifecycle ordering and a public API surface (`callParams`). Needs careful test verification that the lifecycle cascade works correctly for create → attach → detach → reattach → destroy sequences.
