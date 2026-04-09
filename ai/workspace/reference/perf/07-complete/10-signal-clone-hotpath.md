# Plan: Disable Signal Cloning on Internal Framework Signals

## Status
**In diff.** Already applied to `dataVersion` and `itemSignal` in the current working branch.

## Dependencies
None. Standalone.

## Problem

`Signal.get()` calls `maybeClone()` on every read — deep cloning arrays and objects to prevent external mutation. `Signal.set()` runs `isEqual()` (deep equality) then `maybeClone()`. This is a safety net for user-facing Signals where external code might hold a reference and mutate the value.

Internal framework Signals don't need this:
- `dataVersion` is a monotonic integer counter. Cloning a number is a no-op but the function call overhead + type checks still exist. Equality checking is conceptually wrong — this counter should always notify.
- `itemSignal` in each-loops holds the per-item data context object. It's created and managed entirely by the renderer. No external code holds a reference to mutate.

## Changes Already in Diff

### `renderer.js` — dataVersion
```js
// Before
this.dataVersion = new Signal(0);

// After
this.dataVersion = new Signal(0, { allowClone: false, isEqual: noop });
```

### `renderer.js` — itemSignal in createEach (~line 628)
```js
// Before
const itemSignal = new Signal(eachData);

// After
const itemSignal = new Signal(eachData, { allowClone: false, isEqual: noop });
```

### `renderer.js` — itemSignal in hydrateEach (~line 1645)
```js
// Before
const itemSignal = new Signal(eachData);

// After
const itemSignal = new Signal(eachData, { allowClone: false, equalityFunction: noop });
```

### Also in diff: Set-based key lookup in createEach (~line 593)
```js
// Before — O(N) per key
if (!newKeys.includes(key)) {

// After — O(1) per key
const newKeySet = new Set(newKeys);
if (!newKeySet.has(key)) {
```

## Note
The `hydrateEach` itemSignal uses `equalityFunction` while `createEach` uses `isEqual` — verify these are the same option name in the Signal constructor to keep them consistent.

## Complexity
Category 2 — already done. Verify no regressions in existing tests.
