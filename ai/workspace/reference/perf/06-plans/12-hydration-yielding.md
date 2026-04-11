# Plan: Hydration Batching with Yielding

## Dependencies
None. Standalone. Complements all other hydration optimizations — the faster each individual hydration is, the more components fit in each batch before yielding.

## Problem

All SSR-hydrated components on a page fire `connectedCallback` synchronously during DOM parsing. Each schedules hydration into a `requestAnimationFrame`. The rAF callback runs all hydrations sequentially in a single frame — a long task that blocks input handling.

For 50 components at ~2-5ms each: 100-250ms of uninterruptible main thread work. The user can see the DSD content (it painted before the rAF), but cannot click, scroll, or type until all hydrations complete.

Lazy hydration (deferring some components entirely) was rejected because it breaks the `el.component` contract and four other APIs that assume hydration has completed. The contract surface is too wide to make lazy-safe.

## Solution

Break the hydration batch into chunks with yielding between them. All components hydrate, all contracts are preserved, but the browser gets opportunities to process input between chunks.

### Yield mechanism

Use `scheduler.yield()` where available (Chrome 129+), fall back to `setTimeout(fn, 0)`:

```js
const yieldToMain = () => {
  if (globalThis.scheduler?.yield) {
    return scheduler.yield();
  }
  return new Promise(resolve => setTimeout(resolve, 0));
};
```

`scheduler.yield()` is better than `setTimeout(0)` because it puts the continuation at the front of the task queue — other framework work resumes before unrelated tasks. With `setTimeout(0)`, input events and other tasks can interleave, which is fine but less predictable.

### Hydration queue

Instead of each component independently scheduling a rAF, use a shared hydration queue:

```js
// Shared across all components on the page
const hydrationQueue = [];
let hydrationScheduled = false;

function enqueueHydration(component, prototypeTemplate) {
  hydrationQueue.push({ component, prototypeTemplate });
  if (!hydrationScheduled) {
    hydrationScheduled = true;
    requestAnimationFrame(() => processHydrationQueue());
  }
}

async function processHydrationQueue() {
  const batchSize = 5; // tune based on measurement
  for (let i = 0; i < hydrationQueue.length; i++) {
    const { component, prototypeTemplate } = hydrationQueue[i];
    if (component.isConnected) {
      component.hydrate(prototypeTemplate);
    }
    // Yield after every batch
    if ((i + 1) % batchSize === 0 && i + 1 < hydrationQueue.length) {
      await yieldToMain();
    }
  }
  hydrationQueue.length = 0;
  hydrationScheduled = false;
}
```

### Alternative: yield on input pending

Instead of fixed batch sizes, yield only when the browser has pending input:

```js
async function processHydrationQueue() {
  for (let i = 0; i < hydrationQueue.length; i++) {
    const { component, prototypeTemplate } = hydrationQueue[i];
    if (component.isConnected) {
      component.hydrate(prototypeTemplate);
    }
    // Only yield if there's actual input waiting
    if (navigator.scheduling?.isInputPending?.() || 
        (i + 1) % 10 === 0) { // fallback: yield every 10 regardless
      await yieldToMain();
    }
  }
  hydrationQueue.length = 0;
  hydrationScheduled = false;
}
```

`isInputPending()` avoids yielding when there's nothing to yield to — no wasted `setTimeout` roundtrips on an idle page. Falls back to fixed batching where unsupported.

## What This Preserves
- **All contracts.** Every component hydrates. `el.component` is available after the queue drains. `findParent`, `findChild`, `Template.renderedTemplates` all work.
- **O(1) per-component hydration cost.** Each individual hydration is unchanged.
- **DSD paint-first.** The rAF deferral is preserved — content is visible before any hydration runs.

## What This Changes
- **`el.component` timing becomes less predictable.** Component A might hydrate before Component B on the same page, depending on queue order and batch boundaries. Code that assumes all sibling components are hydrated simultaneously (e.g., a panels component querying its children in `onCreated`) might see partially-hydrated siblings.
- **Queue ordering.** Components enqueue in DOM parsing order (connectedCallback order). This is deterministic but may not match developer expectations if components depend on each other.

## Tradeoffs
- **Batch size tuning.** Too small (1) = too many yields, overhead dominates. Too large (50) = same as no yielding. The `isInputPending` approach avoids this tuning problem.
- **Async hydration queue.** The queue processor is async (uses `await`). This means hydration completion is no longer synchronous within the rAF — code that assumes "after this rAF, everything is hydrated" would break. Need to verify no framework internals make this assumption.

## Browser Support
| API | Chrome | Firefox | Safari |
|-----|--------|---------|--------|
| `scheduler.yield()` | 129+ | No | No |
| `scheduler.postTask()` | 94+ | No | No |
| `isInputPending()` | 87+ | No | No |
| `setTimeout(fn, 0)` | All | All | All |

All bleeding-edge APIs have `setTimeout(0)` as the universal fallback. Progressive enhancement — use the best available, degrade gracefully.

## Call Site

One line in `base.js:86`:
```js
// Current
requestAnimationFrame(() => this.hydrate(prototypeTemplate));
```

The simplest version yields after each component:
```js
requestAnimationFrame(async () => {
  this.hydrate(prototypeTemplate);
  if (globalThis.scheduler?.yield) await scheduler.yield();
});
```

The batched version needs a shared queue (small utility). The `isInputPending` version adds adaptive yielding. These are progressive levels of sophistication — start simple, add complexity only if measurement demands it.

## Files to Change

| File | Change |
|------|--------|
| `packages/component/src/engines/native/base.js:86` | Replace rAF callback with yielding variant |
| `packages/utils/src/browser.js` | Optional: `yieldToMain` utility alongside existing `idleCallback` |

## Complexity
Category 2 for the simple per-component yield. Category 3 for the batched queue with `isInputPending`.

## Review Contentions

> **Async rAF is an impedance mismatch.** The browser does not await an async rAF callback — it considers the callback "done" at the first `await`. The "simple per-component yield" (`hydrate()` then `await scheduler.yield()`) is effectively dead code — hydration finishes before the yield. For yielding to help, it must happen *between* hydrations, which forces the shared queue approach.

> **`isInputPending` is deprecated.** Removed in Chrome 130. The adaptive yielding variant in this plan is not viable. Remove from the plan.

> **Parent-child breakage is severe.** `findChildTemplates` traverses the DOM checking `child.component`, set during `hydrate()`. If a parent hydrates in batch 1 and calls `findChild` in `onCreated`, children in batch 2 have `component === undefined`. For composition components (accordion, tabs, menu, dropdown), this is a silent contract violation, not a minor timing nuisance.

> **Overlapping hydration.** The browser schedules the next rAF independently of async continuations from the previous rAF. Two batches could run concurrently.

> **Alternative: Deadline-aware synchronous batching.** Each component keeps its own rAF. A shared per-frame time budget is tracked via `performance.now()`. Each component's rAF checks the budget before starting hydration — if exceeded, it defers to the next rAF. No async, no shared queue, no new coordination. All components within a frame hydrate synchronously, preserving parent-child invariants. Components that overflow the budget get the next frame.

> **This plan may be unnecessary.** If prerequisite plans 01-04 and 08-09 reduce per-component hydration to sub-millisecond, 50 components = ~25ms total, within acceptable thresholds without yielding.

## Status
**Needs further analysis.** The async rAF approach is broken. The deadline-aware synchronous batching alternative is promising but unvalidated. Long frames are a real concern but this should be revisited after the foundational optimizations land and we can measure actual page-level hydration budgets.

## When to Implement
After the other hydration speed optimizations (plans 01-04, 08-09) land. The faster individual hydrations are, the less yielding matters — and the more components fit per batch. Measure post-paint interactivity on real doc pages first to confirm the problem exists at the scale that justifies this complexity.
