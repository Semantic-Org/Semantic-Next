# Review: Plan 12 — Hydration Batching with Yielding

**Score: disagree**

---

## Analysis

### 1. Async rAF callbacks and timing guarantees

The "simple per-component yield" at the bottom of the plan is:

```js
requestAnimationFrame(async () => {
  this.hydrate(prototypeTemplate);
  if (globalThis.scheduler?.yield) await scheduler.yield();
});
```

This is subtly wrong in a way the plan does not address. `requestAnimationFrame` expects a synchronous callback. When you pass an async function, the browser does not await the returned Promise. The rAF completes the moment the first `await` is hit — the browser considers the callback "done" and proceeds to composite/paint. The continuation after `await scheduler.yield()` runs as a microtask/task later.

For the simple per-component version, this is mostly harmless because `this.hydrate()` runs synchronously *before* the first `await`. The `await scheduler.yield()` after it is effectively dead code — hydration already finished, there's nothing left to yield *from*. Each component gets its own rAF, each rAF runs one synchronous `hydrate()`, and the yield at the end just delays... nothing. It provides zero benefit.

For this to actually help, the yield would need to happen *between* hydrations, which requires the shared queue approach. But the shared queue has its own problems (see below).

### 2. Queue completeness: do all components enqueue before the first rAF fires?

Yes, but with an important caveat.

When the browser parses SSR HTML, it upgrades custom elements synchronously as it encounters them. All `connectedCallback` calls happen during this synchronous parsing pass. `requestAnimationFrame` callbacks cannot fire until the current task (parsing) completes and the browser reaches a rendering opportunity. So all components will have enqueued before the first rAF fires.

However, this guarantee holds only for the initial parse. If components are added dynamically (e.g., via client-side routing or lazy loading), they would enqueue *after* the queue has started draining. The plan's code does handle this (the `hydrationScheduled` flag prevents scheduling a second rAF, and new entries are appended to the array being iterated), but iterating a growing array with a for-loop using `.length` could process late arrivals in the same batch — which is probably fine but should be documented.

**The plan correctly identifies this as a non-issue for the initial load case.** The queue will be complete.

### 3. Parent-child `findChild` breakage severity: HIGH

This is the most serious issue and the plan underestimates it.

`findChildTemplates` (template.js:1078) traverses the DOM looking for `child.component`:

```js
if (child.component && isMatch(child.component)) {
  result.push({ ...child.component, ...child.dataContext });
}
```

`el.component` is set in `hydrate()` at base.js:127. This means a component must have been hydrated for `findChild` to see it.

`onCreated` fires during `prototypeTemplate.clone()` (called within `hydrate()`), which calls `Template.initialize()`, which calls `this.onCreated()` at template.js:322. So `onCreated` fires *during* hydration, not after it.

With the batched queue, the execution order for a parent with three children would be:

1. **Batch 1** (size 5): Parent hydrates. During `clone()`, `onCreated` fires. If `onCreated` calls `findChild('panel')`, it traverses the DOM. The child `<ui-panel>` elements exist in the DOM (server-rendered), but `child.component` is `undefined` because those children haven't hydrated yet — they're still in the queue. **`findChild` returns `undefined`.**

2. **Batch 2**: Children hydrate, setting their `component`. But the parent's `onCreated` already ran.

This is not a theoretical concern. The plan itself acknowledges it ("a panels component querying its children in `onCreated`"). The Semantic UI component library has components like accordion, tab, menu, and dropdown that are specifically designed as parent-child compositions. If any of these use `findChild` in `onCreated` (which is the natural place to set up parent-child relationships), they break silently.

The plan says "el.component timing becomes less predictable" as if it's a minor inconvenience. In reality, **it violates the ordering invariant that components hydrate in a single synchronous batch**, which is what makes parent-child queries work today. All rAF callbacks for a given frame run synchronously in sequence. Today, *all* hydrations complete in that single synchronous rAF pass, so by the time any `onRendered` fires (via `setTimeout`), every component on the page is hydrated. Introducing async yielding *within* the rAF destroys this.

### 4. Overlapping rAF / hydration work

Yes, this is a real risk. When the rAF callback is async and yields, the browser does not wait for the Promise to resolve before scheduling the next animation frame. The browser's frame lifecycle is:

1. Run rAF callbacks (synchronous portion)
2. Style/layout/paint
3. Next frame: run rAF callbacks again

If `processHydrationQueue` yields via `await scheduler.yield()`, the browser considers the rAF callback complete at the `await` point. The continuation runs as a separate task. Meanwhile, the next frame's rAF callbacks can fire. If any new component enqueues a rAF during this gap, you could get overlapping hydration work.

The plan's `hydrationScheduled` flag prevents double-scheduling, but the deeper issue is that async-in-rAF is an impedance mismatch. rAF is a synchronous API and async patterns inside it don't compose well with the browser's frame lifecycle.

### 5. Simpler `isInputPending`-only approach (no queue)

The plan already mentions `isInputPending` as an alternative within the queue, but a simpler version is possible: **each component keeps its own rAF but checks `isInputPending` before committing to hydration.**

However, `isInputPending()` has been deprecated in Chrome (removed in Chrome 130). It was part of a short-lived experiment. The plan's browser support table lists it as Chrome 87+ but doesn't note the deprecation. This disqualifies any approach that depends on it.

---

## Core Problem with This Plan

The plan conflates two different things:

1. **Breaking a long synchronous task into smaller tasks** (good goal)
2. **Making the rAF callback async** (problematic mechanism)

The real question is: do you actually have a problem? The plan says 50 components at 2-5ms each = 100-250ms. But the plan itself is positioned as "implement after plans 01-04, 08-09 land." If those plans reduce per-component hydration from 5ms to 0.5ms (which is their stated goal), then 50 components = 25ms, which is well within a single frame budget on a 60fps target (16ms) and trivially within the 50ms "long task" threshold at worst.

The plan acknowledges this ("The faster individual hydrations are, the less yielding matters") but doesn't follow the logic to its conclusion: **if the prerequisite optimizations succeed, this plan becomes unnecessary and its complexity becomes pure downside.**

---

## Alternative Approach

If yielding is still needed after the other optimizations land, here is a simpler design that preserves all invariants:

### Approach: Deadline-aware synchronous batching (no async, no queue)

Keep the current architecture (each component schedules its own rAF). But track total hydration time within the rAF and, if a budget is exceeded, defer remaining components to the *next* rAF — synchronously, without async/await.

```js
// Shared across all components
let hydrationBudgetExceeded = false;
let hydrationFrameId = null;

connectedCallback() {
  // ... existing code ...
  if (hasServerContent && this.canHydrate()) {
    const doHydrate = () => {
      if (hydrationBudgetExceeded) {
        // This frame's budget is spent — wait for next frame
        requestAnimationFrame(doHydrate);
        return;
      }
      const start = performance.now();
      this.hydrate(prototypeTemplate);
      const elapsed = performance.now() - start;
      // If this hydration alone took >4ms, signal that remaining
      // components in this frame should defer
      if (elapsed > 4) {
        hydrationBudgetExceeded = true;
        // Reset at the start of the next frame
        requestAnimationFrame(() => { hydrationBudgetExceeded = false; });
      }
    };
    requestAnimationFrame(doHydrate);
  }
}
```

**Why this is better:**

- **No async.** All rAF callbacks remain synchronous. No impedance mismatch with the browser's frame lifecycle.
- **No shared queue.** Each component manages itself. No new global state to coordinate.
- **Preserves ordering within a frame.** Components that hydrate in the same rAF all complete synchronously. Parent-child queries work as long as parent and children are in the same frame.
- **Self-regulating.** If hydrations are fast (post-optimization), the budget is never exceeded and all components hydrate in one frame — zero overhead. The mechanism only activates when there's actually a problem.
- **No deprecated APIs.** Uses only `performance.now()` and `requestAnimationFrame`.

The main tradeoff is that parent-child pairs could still be split across frames if the parent's hydration exceeds the budget. But this is strictly better than the plan's approach where batching guarantees nothing about parent-child co-location. You could add a refinement: components mark themselves as "must hydrate with parent" and the budget check skips them.

A more sophisticated version could use a shared timestamp rather than a boolean flag:

```js
let frameHydrationStart = 0;
const BUDGET_MS = 8; // half a frame

// In each component's rAF:
if (!frameHydrationStart) {
  frameHydrationStart = performance.now();
  requestAnimationFrame(() => { frameHydrationStart = 0; });
}
if (performance.now() - frameHydrationStart > BUDGET_MS) {
  requestAnimationFrame(doHydrate); // defer to next frame
  return;
}
this.hydrate(prototypeTemplate);
```

This gives a global per-frame budget without a centralized queue.

---

## Summary

| Criterion | Assessment |
|-----------|-----------|
| Async rAF correctness | Problematic — browser doesn't await, frame lifecycle mismatch |
| Queue completeness | Correct for initial parse, fragile for dynamic additions |
| Parent-child breakage | Severe — `findChild` in `onCreated` silently returns nothing |
| Overlapping work | Possible — async rAF continuations interleave with next frame |
| `isInputPending` viability | Dead — API deprecated and removed in Chrome 130 |
| Necessity after prereqs | Likely unnecessary if plans 01-04/08-09 succeed |

The plan introduces a shared mutable queue, async rAF callbacks, and cross-component coordination to solve a problem that may not exist after the prerequisite optimizations land. If it does exist, a simpler deadline-aware approach preserves all existing invariants without any of these risks.
