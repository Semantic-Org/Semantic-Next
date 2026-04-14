# Iteration 1: Replace phase-3 notify with unconditional `itemSignal.set()` + let `isEqual` gate the notify

## Hypothesis
The `fresh` flag + `notify()` branch in `each.js` reconcile phase 3 exists because `Signal.set` short-circuits on `a === b`. If we instead build a fresh **wrapper** object every reconcile and call `itemSignal.set(newWrapper)` unconditionally, the signal's deep-equality check (`isEqual`) should detect in-place mutations (through the spread-copied wrapper props) without needing a `notify()`. Bonus: one-branch loop, no hidden-class transition on `rec.fresh`.

## Change
```diff
- if (rec.item !== item || rec.index !== i) {
-   rec.itemSignal.set(getEachData(item, i, collectionType, node));
-   rec.item = item;
-   rec.index = i;
- }
- else if (typeof item === 'object' && !rec.fresh) {
-   rec.itemSignal.notify();
- }
- rec.fresh = false;
+ rec.itemSignal.set(getEachData(item, i, collectionType, node));
+ rec.item = item;
+ rec.index = i;
```
(And removed the `fresh: true` field from `createRecord`.)

## Measurement
- Not measured. Rejected at the test gate before tachometer.

## Verdict
- [x] **Revert** — breaks `subtree-caching.test.js §8 "should update conditional branches when item data changes"`.

## Why it failed
The `{#each item in items}` form uses `as = 'item'`, which makes `getEachData` produce a **shallow wrapper** of shape `{ item: <itemRef>, index: i }`. When the test mutates `items[0].active` in place (keeping the same itemRef), the new wrapper is structurally `{ item: itemRef, index: 0 }` — byte-identical to the previous wrapper because both point at the same `itemRef`. `isEqual` walks `wrapper.item` → reference-equal → returns `true`. No notify. The conditional inside the each never re-evaluates.

The no-`as` form (`{...item, this: item, index: i}`) spreads the item's enumerable props directly into the wrapper, so in-place mutations *would* be visible to `isEqual`. But the `as` form is the one the tests lock in, and both must stay correct.

This is the exact reason the `else if (typeof item === 'object') notify()` branch exists: for the `as` case where shallow-equality of the wrapper can't see deep mutation, notify is the only channel. The `fresh` flag was added to skip that notify on the first reconcile only (where subscribers just ran and don't need another wakeup).

## Next hypothesis seed
Rebuild the wrapper such that its top-level shape *reflects* item props, regardless of `as`. Two options:
1. Always spread — wrapper becomes `{ ...item, [as]: item, [indexAs]: i }` even when `as` is set. Item props become top-level on the wrapper, `isEqual` sees them. Cost: template expressions now resolve `{item.label}` through proxy get → itemSignal.value → wrapper.item.label (unchanged), while `{label}` would accidentally resolve to the spread top-level prop (need to verify that's not hit).
2. Track item-version via a counter in the record (`rec.itemVersion` bumped on mutation detection), compare to item's version. Requires external version tracking — not portable to user items.

Option 1 is cleaner but risks template-binding behavior change. Need to read the templating's proxy behavior to know if top-level spread of item props will be observed.

Alternative: keep the `fresh` optimization (it's load-bearing) but find a cheaper replacement for the phase-3 notify that skips waking bindings whose content didn't change. One such: maintain a per-item "last-seen" shallow clone in the record; compare shallow on each reconcile; notify only when a top-level prop changed. Same as Signal's deep-equality but stored in the record so we don't pay Signal's clone-on-set overhead for unchanged items.
