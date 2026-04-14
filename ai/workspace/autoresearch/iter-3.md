# Iteration 3: In-place snapshot refresh — eliminate per-reconcile allocation in phase 3

## Hypothesis
iter-2's `rec.propsSnapshot = snapshotProps(item)` allocated a fresh wrapper every reconcile on any path that ran (both `if` branch and `else if` branch). For toggle-all specifically, every item goes through the mutation-detected path → 1000 allocations/reconcile, dominating the +30pp regression. Replace with a single `refreshSnapshotAndDetect(snap, item)` that both diffs and overwrites props in place on an already-allocated `snap` object. Allocation happens once (at first-seen) and stays fixed thereafter.

## Change
```diff
- function snapshotProps(item) { ... allocates new {} every call }
- function propsChanged(snap, item) { ... walks keys, no side effects }

+ function createSnapshot(item) { ... single allocation site }
+ function refreshSnapshotAndDetect(snap, item) {
+   // One pass: compare snap[k] vs item[k], overwrite on diff, return changed.
+   let changed = false;
+   for (const k in item) {
+     if (!hasOwn(item, k)) continue;
+     if (snap[k] !== item[k]) { changed = true; snap[k] = item[k]; }
+     else if (!(k in snap)) { changed = true; snap[k] = item[k]; }
+   }
+   return changed;
+ }

  // Phase 3 else-if branch:
- else if (propsChanged(rec.propsSnapshot, item)) {
-   rec.itemSignal.notify();
-   rec.propsSnapshot = snapshotProps(item);   // re-allocates
- }
+ else if (refreshSnapshotAndDetect(rec.propsSnapshot, item)) {
+   rec.itemSignal.notify();
+   // Snapshot already updated in place — no allocation.
+ }
```

Renderer tests: 920 passed / 4 skipped (green).

## Measurement (iter-0 → iter-3)

### CI (`tachometer-ci.json`)
| Benchmark | iter-0 | iter-2 | iter-3 | Δ vs iter-0 |
|---|---|---|---|---|
| create-1k | -2.1% | -2.8% | -2.6% | -0.5pp |
| create-10k | unsure +0.1% | unsure +0.1% | unsure +0.3% | +0.2pp |
| append-1k | +6.4% | -15.3% | -14.8% | -21.2pp ✓ |
| **update-10th** | +14.1% | -51.7% | **-50.5%** | **-64.6pp ✓** |
| select | -14.3% | -9.7% | -9.1% | +5.2pp (toward main) |
| swap-rows | +5.3% | -23.1% | -23.0% | -28.3pp ✓ |
| **clear** | +31.1% | unsure +9.7% | unsure **+2.3%** | -28.8pp ✓ |

### TodoMVC macro (`tachometer-ci-todo.json`)
| Benchmark | iter-0 | iter-2 | iter-3 | Δ vs iter-0 |
|---|---|---|---|---|
| bulk-add-50 | +11.8% | +6.4% | unsure +2.7% | -9.1pp ✓ |
| bulk-add-200 | unsure +0.4% | +3.0% | unsure +1.7% | +1.3pp |
| add-20 | unsure +0.5% | unsure -0.6% | unsure +0.3% | -0.2pp |
| toggle-10 | unsure -0.3% | unsure +1.7% | unsure -0.5% | -0.2pp |
| **toggle-all** | unsure +0.2% | +30.2% | **+26.7%** | **+26.5pp ✗** |
| remove-5-front | unsure -1.0% | -3.6% | -5.0% | -4.0pp |
| remove-5-middle | unsure -2.7% | +4.8% | +2.7% | **+5.4pp ✗** |
| remove-5-back | unsure -0.4% | unsure +0.1% | unsure +0.3% | +0.7pp |
| clear-completed | unsure -0.2% | -10.8% | unsure -1.0% | -0.8pp |

### TodoMVC micro (`tachometer-ci-todo-micro.json`)
| Benchmark | iter-0 | iter-2 | iter-3 | Δ vs iter-0 |
|---|---|---|---|---|
| toggle-first | unsure +5.4% | -42.9% | **-41.5%** | **-46.9pp ✓** |
| toggle-last | unsure +0.5% | -39.2% | **-36.6%** | **-37.1pp ✓** |
| toggle-middle | unsure -2.6% | -29.1% | -27.7% | -25.1pp ✓ |
| remove-first | unsure -3.9% | unsure +4.1% | unsure +5.1% | **+9.0pp ✗** |
| remove-middle | unsure -2.3% | -17.3% | -12.7% | -10.4pp ✓ |
| remove-last | +19.7% | unsure +3.0% | +14.5% | -5.2pp (but still regressed) |
| filter-active | unsure +0.4% | +6.1% | unsure +5.2% | +4.8pp (borderline) |
| filter-completed | unsure -0.4% | unsure +6.3% | unsure -1.8% | -1.4pp (improved) |
| filter-all | +6.3% | unsure +5.3% | unsure +1.4% | -4.9pp ✓ |
| edit-start | -5.4% | unsure +0.6% | unsure -0.7% | **+4.7pp ✗** (still confident-faster) |
| edit-save | unsure -0.9% | -14.1% | -10.0% | -9.1pp ✓ |

## Verdict
- [x] **Keep as best-known, continue iterating on residual regressions.** iter-3 maintains nearly every iter-2 win while narrowing the toggle-all gap (+30.2 → +26.7, 3.5pp improvement) and flipping filter-* confidence intervals back toward zero. Update-10th stays at -50.5%. Clear goes from confident +9.7% to unsure +2.3% (material improvement).

### Remaining gate violations vs iter-0 (>3pp worse)
- `todo/toggle-all` +26.7pp (still huge)
- `todo/remove-5-middle` +5.4pp (smaller than iter-2's +7.5)
- `todo-micro/remove-first` +9.0pp (unchanged from iter-2)
- `todo-micro/remove-last` +14.5% (still regressed; was +19.7% at iter-0, so actually -5pp improvement, but still over gate)
- `todo-micro/edit-start` +4.7pp (confident-faster became unsure, edge of gate)

## Root cause analysis
The toggle-all regression remaining after eliminating allocation suggests the cost is in the **`for (k in item)` loop iteration itself**, not GC. At ~3 keys per item × 1000 items per reconcile, the O(N×K) work is ~3000 hidden-class property-access operations per reconcile. Even at ~1ns per op, that's 3ms — approximately matches the 2.52ms gap between main (9.41ms) and iter-3 (11.93ms).

For filter-*, remove-*: these hit the `if` branch (item ref or index changed). iter-3 still allocates a fresh snap via `createSnapshot` in that branch — to be fixed in iter-4.

## Next hypothesis seed (iter-4)
Refresh the snap in place in the `if` branch too. Already drafted but not tested — eliminates the remaining per-reconcile allocations in filter-* / remove-* paths. If that doesn't close remove-first's +9pp gap, the cost is not allocation but the same loop-iteration overhead as toggle-all.

An alternative angle: for toggle-all, the ~3ms `for (k in item)` overhead is irreducible in this scheme. Consider a cheaper "is item dirty" signal: a `Symbol` monotonic counter on the item (polyfill via WeakMap keyed by item → version), bumped by user code on mutation. Phase 3 compares `rec.seenVersion !== item[VERSION]` in O(1) — no iteration, no allocation. But this imposes a new protocol on user code (or requires a Proxy layer), which changes framework-level ergonomics.

## Decision for this session
- Promote iter-3 worktree state to best-known: copy `iter-3-*.json` → `best-*.json`.
- Attempt iter-4 (in-place refresh in `if` branch) as a cheap increment.
