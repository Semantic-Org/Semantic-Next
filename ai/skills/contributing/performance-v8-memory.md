---
title: V8 Memory, GC, and Scheduling
description: How V8 allocates and reclaims memory, and how the JS task/microtask queue interacts with that. Covers generational GC (Scavenger, MinorMS, concurrent marking), Conservative Stack Scanning (productionized 2024), pointer compression, Static Roots, allocation patterns for reactive hot paths (closures, pooling, fresh allocation), WeakRef and FinalizationRegistry semantics and timing, Map / Set / WeakMap / object-as-map, structuredClone, Proxy on hot paths, microtask queue (queueMicrotask vs Promise.resolve.then), await cost, Promise.withResolvers, AbortSignal.any / .timeout. Load for GC, lifetime, or scheduling questions.
keywords: [garbage collection, GC, Scavenger, MinorMS, conservative stack scanning, concurrent marking, pointer compression, static roots, allocation, closure allocation, escape analysis, WeakRef, FinalizationRegistry, WeakMap, structuredClone, Proxy, microtask, queueMicrotask, Promise, await, async, Promise.withResolvers, AbortSignal, AbortSignal.any, AbortSignal.timeout, requestAnimationFrame]
audience: authoring
skill: performance-v8-memory
type: skill
---

# V8 Memory, GC, and Scheduling

> **Skill:** `performance-v8-memory`
> **Purpose:** What's cheap to allocate, what survives into old generation, how the microtask queue works, and what async patterns cost in 2026.

**Golden rule: Young-generation allocation is cheap. Surviving into old generation is what you pay for. Optimize for short lifetimes, not for avoiding allocation entirely.**

Current as of Chrome 138, May 2026.

---

## Generational GC in 2026

V8's heap is generational: small **young generation** (new space) + larger **old generation**. Most allocations are short-lived and die young; survivors get *promoted* to old gen. This is the **generational hypothesis**, and it remains the foundational fact behind V8's allocation cost model.

| Collector | Scope | Notes |
|-----------|-------|-------|
| **Scavenger** (parallel copying) | Young gen | Stop-the-world, parallel. Historical default. Pauses typically a few milliseconds. |
| **MinorMS** (Minor Mark-Sweep) | Young gen | Mark-sweep + Conservative Stack Scanning. Productionized through 2024 (V8 bug 12612). V8 picks between Scavenger and MinorMS via internal heuristics. |
| **Major GC** | Whole heap | Most marking runs **concurrently** on a worker thread (v8.dev/blog/concurrent-marking, 2018, improved through 2024). Main-thread finalization pause typically <10 ms. |

### Conservative Stack Scanning (CSS)

Removes the requirement that embedders (Blink, Node) maintain precise GC stack frames for V8 references. Every word on the C++ stack is treated as a potential pointer and verified via inner-pointer resolution into V8 page headers. V8 bug 13257.

✅ Short, predictable young-gen pauses regardless of call depth.

### Allocation cost

Young-gen allocation is a bump-pointer in the active page; cost is a handful of instructions per allocation. Old-gen survival is the expensive part — you pay marking and sweeping cost proportional to old-gen size.

---

## Allocation patterns for hot reactive paths

✅ **Allocate fresh** — short-lived objects die in young gen at trivial cost.

❌ Don't allocate per `get()` call returning a fresh object — that's per-read garbage in an effect that runs 60×/sec.

✅ Return stored values directly. Use immutability conventions instead of cloning.

✅ Reuse pre-allocated arrays by clearing with `arr.length = 0` (cheap, does not free, does not re-allocate the backing store).

✅ Class instances with methods on the prototype — methods are shared (one Function on the prototype), `this` carries per-instance context.

❌ Per-row fresh closures when the closure is created and disposed many times per second:

```js
// ❌ Fresh closure per row, per render
rows.forEach(row => effect(() => updateCell(row, cell)));

// ✅ Shared method via class instance
class RowEffect {
  run() { updateCell(this.row, this.cell); }
}
```

### Pooling vs fresh allocation

Pooling small short-lived objects is **generally a loss in 2026 V8**. You pay for indirection, you keep the pool alive in old space, you defeat the generational hypothesis.

✅ Pool when:
- Objects are large (>1KB).
- Objects hold native handles (Worker, OffscreenCanvas, WebGL buffers).
- Profiling shows allocation as a top cost.

❌ Otherwise allocate fresh and rely on the Scavenger.

---

## Pointer compression and Static Roots

V8 uses **pointer compression** on 64-bit platforms (v8.dev/blog/pointer-compression, Mar 2020): each V8 reference is a 32-bit offset into a 4 GB isolate region. Saves ~40% of heap. Cost: V8 isolates capped at 4 GB. Not framework-tunable.

**Static Roots** (v8.dev/blog/static-roots, Feb 2024) gave compile-time constant addresses to "immortal immovable" roots (`undefined`, `null`, `true`, `false`, the empty string, root shapes, common builtins). Optimized code touching these constants can encode them as immediates. Free win; nothing to do.

---

## WeakRef and FinalizationRegistry

Both shipped Chrome 84. The semantics matter:

⚠ **`WeakRef.deref()` may return an object that's also being collected concurrently.** Once you deref, the object is strongly held until the next microtask checkpoint — by spec design.

⚠ **FinalizationRegistry callbacks are not synchronous with collection.** They are queued and fire some time later, batched, typically at the next microtask checkpoint or later. **Not guaranteed to fire at all** — if the embedder shuts down before processing the queue, the callback never runs.

❌ Do not rely on FinalizationRegistry for correctness.
✅ Use it only for opportunistic cleanup of native handles or per-object caches whose loss is acceptable.
✅ For deterministic cleanup, use explicit disposal — `using` / `await using`. See `performance-v8-recent-features`.

---

## Map / Set / WeakMap / object-as-map

| Choice | When |
|--------|------|
| **`Map`** | Dynamic keys, iteration order matters (Maps preserve insertion order; so do Sets), or keys are non-string. Hash table internally; O(1) lookup. |
| **Plain object** | Small, known, fixed set of identifier-like keys. The object is a struct, not a dictionary. |
| **`WeakMap`** | Must avoid holding strong refs to keys. Cost is roughly `Map` + per-GC bookkeeping. Much code that used WeakMap for per-instance state can now use `#field`. |
| **`WeakSet`** | Set analog of WeakMap. |

❌ The 2015-era "use a plain object as a Map for speed" advice is dead.

Map/Set iteration walks the insertion-order linked list, not the hash bucket array — O(n) with reasonable cache locality.

---

## structuredClone

Spec primitive for deep cloning (Chrome 98+, stable everywhere by 2024). Handles `Map`, `Set`, `ArrayBuffer`, TypedArrays, `Date`, `RegExp`, `Blob`, `File`, `ImageData`, `DOMException`, etc.

✅ Use for state intended to survive into `IndexedDB` or be sent over `postMessage` — same serialization format.
⚠ For pure JS object trees you control (no transferables, no problematic cycles), a hand-written clone may be faster — it's a Blink/V8 boundary call.

---

## Proxy on hot paths

V8 specialized some `Proxy` paths in v8.dev/blog/optimizing-proxies (Oct 2017). Modern Maglev does **not** aggressively specialize through Proxies — every property access goes through trap dispatch.

❌ Do not put a Proxy on a hot path.
✅ Proxies are appropriate for the framework's *authoring layer* (e.g., Vue-style "make this object reactive by wrapping in a Proxy").
✅ Solid-style explicit `signal()` accessor approaches avoid the per-access trap cost — this is one reason they top the js-framework-benchmark.

---

## The microtask queue

Microtasks run after the current synchronous turn completes and drain fully before the next task. FIFO.

| Primitive | Use |
|-----------|-----|
| `queueMicrotask(fn)` | ✅ Slightly cheaper than `Promise.resolve().then(fn)` — no Promise allocation. Prefer for framework scheduling primitives. |
| `Promise.resolve().then(fn)` | Equivalent semantically; allocates a Promise. |
| `requestAnimationFrame(fn)` | For paint-synchronized work, not reactive flushing. Don't conflate. |
| `setTimeout(fn, 0)` | A *macrotask*, not a microtask. Runs after the next paint, not after the current synchronous turn. |

### await cost

Since v8.dev/blog/fast-async (2018), `await` on an already-settled Promise no longer requires an extra microtask hop. Each `await` queues a microtask + reschedules the async function via its generator-like state machine.

❌ Avoid `await` inside the reactive hot path.
✅ Effects, getters, setters should be plain functions. Async only at the outer boundaries (user-triggered I/O, route loads, suspense).

---

## Promise.withResolvers (Chrome 119, Oct 2023)

```js
const { promise, resolve, reject } = Promise.withResolvers();
```

✅ Replaces the deferred pattern. Useful for event-driven code resolving from outside the executor — common in reactive scheduling.

---

## AbortSignal.any and AbortSignal.timeout

- **`AbortSignal.timeout(ms)`** (Chrome 103, July 2022) — fires after `ms` milliseconds.
- **`AbortSignal.any([sig1, sig2, ...])`** (Chrome 116, August 2023) — fires when any input signal fires.

✅ Right pattern for composite cancellation: "abort if user navigates OR timeout elapses OR parent disposed." Cheap; use freely.

---

## Async function frames

Each `async` function call allocates a generator-like state machine to hold the suspended state.

❌ Don't make reactive primitives async.
✅ Boundary code (fetches, navigations) is the right place for async.

---

## Quick Reference

```js
// ✅ Cheap pre-allocated reusable array
const queue = [];
function flush() {
  for (const fn of queue) fn();
  queue.length = 0;  // clear without re-allocation
}

// ✅ Microtask flush for reactive scheduling
let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => { scheduled = false; flush(); });
}

// ✅ Composite cancellation
const ctrl = AbortSignal.any([
  userAbortSignal,
  AbortSignal.timeout(5000),
]);

// ✅ Explicit disposal (Chrome 134+)
{
  using sub = effect(() => { /* … */ });
  // sub[Symbol.dispose]() at scope exit
}

// ❌ FinalizationRegistry for correctness
const fr = new FinalizationRegistry(handle => releaseHandle(handle));
fr.register(obj, nativeHandle);  // may or may not fire
```

---

## Primary sources

- v8.dev/blog/concurrent-marking — 2018, applies with subsequent improvements
- v8.dev/blog/pointer-compression — Mar 2020
- v8.dev/blog/static-roots — Feb 2024
- v8.dev/blog/retrofitting-temporal-memory-safety-on-c++ — covers CSS work
- v8.dev/blog/fast-async — 2018
- v8.dev/blog/optimizing-proxies — Oct 2017
- V8 bug 12612 (MinorMS productionization)
- V8 bug 13257 (Conservative stack scanning)

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the broader perf model. |
| **Object Model** | `use_skill('performance-v8-object-model')` | Allocation shape affects what survives into old gen and whether Proxies/Maps matter. |
| **Recent Features** | `use_skill('performance-v8-recent-features')` | For `using`/`await using` deterministic disposal details. |
| **Stale Advice** | `use_skill('performance-v8-stale-advice')` | Verify remembered rules about closures, pooling, or async cost. |
