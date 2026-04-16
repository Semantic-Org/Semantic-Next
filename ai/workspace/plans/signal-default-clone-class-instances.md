---
title: Signal.defaultClone — preserve class-instance prototypes
status: Filed followup (not blocking)
source: ai/workspace/plans/signal-safety-v2.md — Item 8
---

# Signal.defaultClone — preserve class-instance prototypes

## Context

`Signal.defaultClone = clone;` at `packages/reactivity/src/signal.js`. Under `reference`-mode `mutate()`, the code snapshots the current value before the mutation callback:

```js
const before = this.cloneFunction(this.currentValue);
```

For a class-instance value, the default `clone` utility (`packages/utils/src/cloning.js:91-104`) strips the prototype unless `preserveNonCloneable: true` is passed. So `before` is a plain object with copied own-keys, not an instance of the original class.

## Effect

Today, accidentally correct:
- `isEqual(before, this.currentValue)` uses `getProto` check (`packages/utils/src/equality.js:41`) — the proto mismatch makes it return false
- Therefore `mutate()` always calls `notify()` when the fn returned undefined — the intended behavior for a class-instance mutate
- So the observable semantic is right

But the snapshot itself is corrupted: a user-supplied `equalityFunction` inspecting `before` sees a prototype-stripped plain object, not the class instance they passed in. That violates the documented `mutate(fn)` contract.

## Fix options

1. **Preserve class instances during clone**: `Signal.defaultClone = (v) => clone(v, { preserveNonCloneable: true })`. Callers who want the default prototype-stripping behavior can still pass their own `cloneFunction`.
2. **Skip the `before` snapshot for non-plain types**: in `mutate()`'s `reference`/`none` branch, check `isPlainObject || isArray` before cloning. For non-plain types, skip the equality gate and always notify. Matches the current accidental behavior but makes it explicit.

Option 1 is simpler and makes user-supplied equalityFunctions work correctly. Option 2 is a tighter perf path but doesn't fix the snapshot contract.

## Urgency

Low. Latent issue — reactivity still fires correctly by accident. Only matters for custom `equalityFunction` callers on class-instance signals. No known bug reports.

## Not included in this branch

Kept out of `perf/signal-safety-v2-finalize` scope per the Item 8 disposition in `signal-safety-v2.md`.
