# Event Controller Ordering Analysis

## Summary

**Verdict: Bug — silent, currently unexploitable, blocks hydration splitting.**

`callParams.abortController` is permanently `undefined` for the lifetime of every Template instance. This is not intentional loose coupling — it is a straightforward ordering error where a cached property snapshot is taken before the value it captures exists.

## Call Sequence (both fullRender and hydrate paths)

```
constructor()
  └─ this.abortController = new AbortController()   // line 80 — template lifetime controller
  └─ if (renderRoot) this.attach(renderRoot)         // line 101

attach()
  ├─ this.initialize()                               // line 329
  │    ├─ this.callParams = { ... }                  // line 278
  │    │    ├─ abortSignal: this.abortSignal         // ✅ set in constructor (line 81)
  │    │    └─ abortController: this.eventController // ❌ undefined — not created yet
  │    └─ this.onCreated()                           // line 322 — user code can run
  └─ this.attachEvents()                             // line 342
       └─ this.eventController = new AbortController() // line 512 — too late
```

The cached `callParams` object is a value snapshot (line 307):
```js
abortController: this.eventController,  // captures undefined
```

This is not a getter. It freezes whatever `this.eventController` is at `initialize()` time, which is always `undefined`.

`buildCallParams()` (line 851) has the identical issue — same value capture, same ordering.

## Two Distinct AbortControllers

The template has two separate abort mechanisms that serve different purposes:

| Property | Created | Aborted | Purpose |
|---|---|---|---|
| `this.abortController` / `this.abortSignal` | Constructor (line 80) | `onDestroyed` (line 230) | Template lifetime — timers (`interval`, `timeout`) listen on its signal |
| `this.eventController` | `attachEvents()` (line 512) | `removeEvents()` (line 621), also `onDestroyed` via `removeEvents()` | Event lifetime — all DOM event listeners use it for bulk cleanup |

Both are aborted during `onDestroyed`, but they serve different lifecycle scopes. The event controller is recreated each time `attachEvents()` runs (line 508 calls `removeEvents()` first), while the template abort controller is created once and never replaced.

## What `callParams.abortController` Was Meant To Expose

The name `abortController` in callParams maps to `this.eventController`, and the `attachEvent()` method (line 869-875) uses `this.eventController` directly:

```js
attachEvent(selector, eventName, eventHandler, ...) {
  return $(selector, document, querySettings).on(eventName, eventHandler, {
    abortController: this.eventController,  // reads this.eventController live
    ...
  });
}
```

The intent is clear: give user code a handle to the event controller so they can pass it to `$.on()` or other APIs for automatic cleanup when the template is destroyed. The guide (events.mdx line 245) documents this: "All events attached with `attachEvent` will automatically be removed when the component is destroyed using `abortController`."

## Why It Hasn't Been Caught

1. **No first-party component destructures `abortController` from callParams.** Zero matches in `src/`. Every component that needs event cleanup uses `attachEvent` (which reads `this.eventController` live and works correctly).

2. **`attachEvent` works fine.** It's a bound method that reads `this.eventController` at call time, which is always after `attachEvents()` has run. The method was the correct API design — the callParams property is the redundant/broken one.

3. **`abortSignal` works fine.** The template-level `abortSignal` (for timers) is set in the constructor and always valid.

4. **No test covers `callParams.abortController`.** The test suite covers event cleanup through component destroy lifecycle, not direct controller access.

## Impact Assessment

**Current impact: None.** No code path reads `callParams.abortController`. Every real usage goes through `attachEvent()`.

**Future impact: Medium.** This becomes a real bug if:
- A downstream user destructures `abortController` from a callback (as the API surface implies they can)
- The hydration path is split to defer `attachEvents()` — the gap between `initialize()` and event attachment would widen, making the `undefined` window more relevant

## Recommendation: Make `abortController` a getter on `callParams`

Change line 307 from a value capture to a getter:

```js
// Before (captures undefined at callParams construction time)
abortController: this.eventController,

// After (reads live value when accessed)
get abortController() {
  return template.eventController;
},
```

Apply the same change to `buildCallParams()` at line 851.

**Why a getter, not moving `eventController` creation earlier:**
- `attachEvents()` intentionally calls `removeEvents()` first (line 508), aborting any existing controller before creating a fresh one. This reset-and-recreate pattern is deliberate — it supports re-attachment after DOM moves.
- Creating `eventController` in the constructor or `initialize()` would mean the first `attachEvents()` call immediately aborts the controller that `callParams` holds. The getter avoids this by always returning the current live value.
- A getter has zero runtime cost (property access is the same speed as reading an object property — V8 optimizes getter access on plain objects).

**What this eliminates:**
- The `undefined` window between `initialize()` and `attachEvents()`
- Any future ordering sensitivity if hydration splits the initialization sequence
- A subtle API contract violation where a documented parameter is silently `undefined`

**What this preserves:**
- The existing two-controller architecture (template lifetime vs event lifetime)
- The `attachEvents()` reset-and-recreate pattern
- All existing behavior — `attachEvent()` already works, and no code currently reads the broken property
