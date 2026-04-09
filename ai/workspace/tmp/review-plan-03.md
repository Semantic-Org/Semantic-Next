# Review: Plan 03 — Separate Initialize from Attach + Clarify Abort Controller Lifecycles

**Score: Agree**

The plan correctly identifies two real problems and proposes reasonable fixes for both. There are two issues that need resolution before implementation.

---

## Evaluation

### 1. Is `this.abortSignal` the right signal to expose in callParams?

**Yes, unambiguously.** The plan's analysis is precise.

There are two abort lifecycles in Template:

| Controller | Created | Aborted | Purpose |
|---|---|---|---|
| `this.abortController` / `this.abortSignal` | Constructor (line 80-81) | `onDestroyed` (line 230) | Template lifetime — timers, fetch, anything that should die with the component |
| `this.eventController` | `attachEvents()` (line 512) | `removeEvents()` (line 620) | Event binding — DOM listeners that re-bind on reattach |

Consumers of `this.abortSignal` (the lifecycle signal):
- `createInterval()` (line 967) — `this.abortSignal.addEventListener('abort', () => clearInterval(id))`
- `createTimeout()` (line 972) — `this.abortSignal.addEventListener('abort', () => clearTimeout(id))`
- These are already correct. Timers die with the component, not with event rebinding.

Consumers of `this.eventController` (the event controller):
- `attachEvents()` — every `$(…).on()` call passes `{ abortController: this.eventController }`
- `bindKeys()` (line 639) — key handlers use `{ abortController: this.eventController }`
- `attachEvent()` (line 871) — the instance method for user-authored external event bindings
- `removeEvents()` (line 620) — calls `this.eventController.abort()`
- These are all internal plumbing that user code never touches directly.

The current `callParams` exposes BOTH:
- Line 289: `abortSignal: this.abortSignal` — **correct lifecycle, always valid**
- Line 307: `abortController: this.eventController` — **wrong lifecycle, always undefined when captured**

The plan to remove `abortController` and keep only `abortSignal` is correct. Exposing an `AbortSignal` (not `AbortController`) is the right choice: it prevents user code from aborting the template lifecycle externally, and `AbortSignal` is what all consuming APIs (`fetch`, `addEventListener`, `wait`, `debounce`) actually accept.

### 2. Does `AbortSignal.addEventListener('abort', ...)` work? Memory leak risk?

**Yes, it works.** `AbortSignal` extends `EventTarget` and supports `addEventListener('abort', ...)`. This is the standard pattern (MDN, WHATWG spec).

**Memory leak concern is real but manageable.** The plan proposes registering a listener on `this.abortSignal` inside `attachEvents()`:

```js
this.abortSignal.addEventListener('abort', () => {
  this.eventController.abort();
});
```

If `attachEvents()` is called multiple times (DOM reattach cycles), each call registers a new listener on the lifecycle signal. These listeners hold references to `this.eventController` (the old one from previous cycles). However:

- `this.abortSignal` lives for the component lifetime. When it aborts (in `onDestroyed`), all listeners fire and are then eligible for GC.
- The number of reattach cycles for a typical component is small (usually 0-1).
- The listeners are tiny closures.

**Recommendation:** Use `{ once: true }` would be wrong here since reattach creates new controllers. Instead, the cascade listener should be registered with the signal option of the *event controller itself* so it auto-removes when events are torn down:

```js
this.abortSignal.addEventListener('abort', () => {
  this.eventController.abort();
}, { signal: this.eventController.signal });
```

This way, when `removeEvents()` aborts `this.eventController`, the cascade listener is automatically removed. On next `attachEvents()`, a fresh listener is registered for the fresh controller. Zero accumulation.

### 3. Will `clone()` without `renderRoot` + explicit `initialize()` produce the same state?

**Yes, with one caveat.**

Current hydrate path:
1. `clone({ data, element, renderRoot })` — constructor runs, sets properties, then calls `this.attach(renderRoot)` (line 101-103)
2. `attach()` calls `this.initialize()` (line 329-331) — creates renderer, component instance, callParams, fires onCreated
3. `attach()` then sets `this.renderRoot`, calls `attachEvents()`, `bindKeys()` (lines 337-343)
4. Back in `hydrate()`: accesses `this.template.instance`, `this.template.getDataContext()`

Proposed path:
1. `clone({ data, element })` — constructor runs, sets properties, skips `attach()` since no renderRoot
2. `this.template.initialize()` — same as above
3. Hydration work happens
4. `this.template.attach(this.renderRoot)` — sets renderRoot, attachEvents, bindKeys

The component state after step 2 is identical in both paths: `instance`, `state`, `renderer`, `callParams` are all created by `initialize()`, not by `attach()`. The only difference is timing of `attachEvents()` / `bindKeys()`, which is the entire point of the change.

**The caveat:** In the current path, `attach()` is called from the constructor, which means `attach()` runs *before* the caller sets `this.template._isHydrating = true` (line 126 in base.js). In the proposed path, `initialize()` fires `onCreated()` (line 322), which dispatches a DOM event only when `!this._isHydrating` (line 201). Since `_isHydrating` is not yet set when `initialize()` runs in either path, this behavior is unchanged. The plan correctly sets `_isHydrating` after clone (base.js line 126) but before hydration work — the `onCreated` callback fires regardless in both paths, which is correct.

**One subtlety the plan should note:** `attach()` is `async` (line 325) due to `adoptStylesheet()`. The constructor at line 102 calls `this.attach(renderRoot)` without `await`, making it fire-and-forget. The proposed `this.template.attach(this.renderRoot)` in hydrate would also be fire-and-forget (hydrate is not async). This is fine because `adoptStylesheet` is only relevant for subtemplates with `attachStyles: true`, not web components (which use `adoptStylesheet` directly in `connectedCallback`).

### 4. Do subtemplates already use explicit `initialize()` then `attach()`?

**Confirmed.** Both `createSubtemplate()` and `hydrateSubtemplate()` in renderer.js use the pattern:

`createSubtemplate()` (lines 873-897):
```js
currentInstance = template.clone({ ... }); // no renderRoot
currentInstance.initialize();              // explicit
const templateFragment = currentInstance.render();
region.setContent(templateFragment);
currentInstance.attach(renderRoot, { ... }); // explicit, after render
```

`hydrateSubtemplate()` (lines 930-981):
```js
currentInstance = template.clone({ ... }); // no renderRoot
currentInstance.initialize();              // explicit
// ... hydrate inner markers ...
currentInstance.rendered = true;
currentInstance.attach(renderRoot, { ... }); // explicit, after hydration
```

The proposed hydrate path in base.js exactly mirrors `hydrateSubtemplate()`. This alignment is sound.

### 5. Breaking change: zero first-party consumers of `abortController` from callParams?

**Confirmed.** Searching `src/` (all first-party components) for both `abortController` and `abortSignal` destructured from callback params yields zero matches. No first-party component uses either property from callParams.

The TypeScript type definitions (`packages/templating/types/template.d.ts` line 393) document `abortController: AbortController` as a public API. The example in the JSDoc shows `fetch('/api/data', { signal: abortController.signal })`. This needs to be updated to `abortSignal: AbortSignal` with `fetch('/api/data', { signal: abortSignal })`.

The property was always `undefined` at construction time (captured as a plain value before `attachEvents()` creates `eventController`), so any downstream code relying on it was already broken. The rename from a broken property to a working one is a net improvement even if it technically breaks the type signature.

---

## Issues to Address

### Issue 1: Cascade listener accumulation (minor)

As described in point 2, register the cascade listener with the event controller's own signal to auto-clean:

```js
this.abortSignal.addEventListener('abort', () => {
  this.eventController.abort();
}, { signal: this.eventController.signal });
```

### Issue 2: The plan already shows `abortSignal` in `callParams` at line 289 — it was already implemented

Looking at the current source, `callParams` already has `abortSignal: this.abortSignal` at line 289. This was added in a prior commit. The plan references the old state where only `abortController: this.eventController` existed at line 307. The remaining work is:

1. **Remove** `abortController: this.eventController` from `callParams` (line 307) and `buildCallParams()` (line 851) — these are the broken/undefined properties
2. **Keep** the existing `abortSignal: this.abortSignal` at line 289 and 838 — already correct
3. Add the cascade listener in `attachEvents()`
4. Separate initialize from attach in the hydrate path
5. Update the TypeScript types

The plan's description of "change `abortController: this.eventController` to `abortSignal: this.abortSignal`" is misleading since `abortSignal` already exists. The actual change is just removing the dead `abortController` property.

---

## Summary

The plan is architecturally sound. The two-controller model (lifecycle vs. events) is correctly identified, the proposed separation of initialize from attach mirrors existing subtemplate patterns, and the breaking change has zero real-world impact since the broken property was always undefined. The two issues above are minor refinements, not structural problems.
