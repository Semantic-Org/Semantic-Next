# Iteration 2: Shallow props snapshot per record — skip phase-3 `notify` for items whose own enumerable props didn't change

## Hypothesis
update-10th fires `rec.itemSignal.notify()` for every retained same-ref item (900 of 1000 on each reconcile with `state.items.set(peek().map(...))` and `equalityFunction: () => false`). The notify wakes every per-item binding — ~5,400 reaction re-runs for a 100-changed-item mutation. Replace the unconditional notify with a prop-change check: snapshot each item's own enumerable top-level props on first reconcile, compare on subsequent reconciles, only notify when a prop actually differs. Preserves `subtree-caching §8` because the test mutates a top-level prop (`item.active`).

## Change (at the commit this report measured)

```diff
- fresh: true,
+ propsSnapshot: null,

+ function snapshotProps(item) { for (k in item) snap[k] = item[k]; return snap; }
+ function propsChanged(snap, item) { /* walks snap keys and item keys, returns true on any diff or key set change */ }

  // Phase 3:
  for (i = 0..N) {
    if (rec.item !== item || rec.index !== i) {
      rec.itemSignal.set(getEachData(...));
      rec.item = item; rec.index = i;
+     rec.propsSnapshot = snapshotProps(item);
    }
-   else if (typeof item === 'object' && !rec.fresh) {
-     rec.itemSignal.notify();
-   }
-   rec.fresh = false;
+   else if (typeof item === 'object' && item !== null) {
+     if (rec.propsSnapshot === null) { rec.propsSnapshot = snapshotProps(item); }
+     else if (propsChanged(rec.propsSnapshot, item)) {
+       rec.itemSignal.notify();
+       rec.propsSnapshot = snapshotProps(item);   // re-allocates every time
+     }
+   }
  }
```

Renderer tests: 920 passed / 4 skipped (green).

## Measurement
- `iter-2-ci.json`, `iter-2-todo.json`, `iter-2-todo-micro.json`

### CI (`renderer-tachometer-ci`)
| Benchmark | iter-0 | iter-2 | Δ (iter-2 − iter-0) |
|---|---|---|---|
| create-1k | -2.1% | -2.8% | -0.7pp |
| create-10k | unsure +0.1% | unsure +0.1% | 0pp |
| append-1k | +6.4% | **-15.3%** | **-21.7pp** ✓ |
| **update-10th** | +14.1% | **-51.7%** | **-65.8pp** ✓ |
| select | -14.3% | -9.7% | +4.6pp (moved toward main) |
| swap-rows | +5.3% | **-23.1%** | **-28.4pp** ✓ |
| clear | +31.1% | unsure +9.7% | -21.4pp ✓ |

### TodoMVC macro (`renderer-tachometer-ci-todo`)
| Benchmark | iter-0 | iter-2 | Δ |
|---|---|---|---|
| bulk-add-50 | +11.8% | +6.4% | -5.4pp ✓ |
| bulk-add-200 | unsure +0.4% | +3.0% | +2.6pp (borderline) |
| add-20 | unsure +0.5% | unsure -0.6% | -1.1pp |
| toggle-10 | unsure -0.3% | unsure +1.7% | +2.0pp |
| **toggle-all** | unsure +0.2% | **+30.2%** | **+30.0pp** ✗ |
| remove-5-front | unsure -1.0% | -3.6% | -2.6pp |
| remove-5-middle | unsure -2.7% | +4.8% | **+7.5pp** ✗ |
| remove-5-back | unsure -0.4% | unsure +0.1% | +0.5pp |
| clear-completed | unsure -0.2% | -10.8% | -10.6pp ✓ |

### TodoMVC micro (`renderer-tachometer-ci-todo-micro`)
| Benchmark | iter-0 | iter-2 | Δ |
|---|---|---|---|
| toggle-first | unsure +5.4% | **-42.9%** | **-48.3pp** ✓ |
| toggle-last | unsure +0.5% | **-39.2%** | **-39.7pp** ✓ |
| toggle-middle | unsure -2.6% | -29.1% | -26.5pp ✓ |
| remove-first | unsure -3.9% | unsure +4.1% | **+8.0pp** ✗ |
| remove-middle | unsure -2.3% | -17.3% | -15.0pp ✓ |
| remove-last | +19.7% | unsure +3.0% | -16.7pp ✓ |
| filter-active | unsure +0.4% | +6.1% | **+5.7pp** ✗ |
| filter-completed | unsure -0.4% | unsure +6.3% | **+6.7pp** ✗ |
| filter-all | +6.3% | unsure +5.3% | -1.0pp |
| edit-start | -5.4% | unsure +0.6% | **+6.0pp** ✗ |
| edit-save | unsure -0.9% | -14.1% | -13.2pp ✓ |

## Verdict
- [ ] Keep (many primary wins)
- [x] **Refine — continue to iter-3** with in-place snapshot refresh. The update-10th and toggle-* wins are huge and genuinely close the primary regressions the task lists. But iter-2 trips the regression gate on ≥6 non-target benchmarks: `toggle-all +30pp`, `remove-5-middle +7.5pp`, `remove-first +8.0pp`, `filter-active +5.7pp`, `filter-completed +6.7pp`, `edit-start +6.0pp`. Nearly all of these are mutations-over-stable-refs or key-shift paths where phase 3's `createSnapshot` allocation (`rec.propsSnapshot = snapshotProps(item)`) runs 1000×/reconcile. Fix: allocate the snapshot once per record (at first-reconcile) and overwrite props in place on subsequent reconciles.

## Root cause of the regressions

`toggle-all` mutates every item's `.completed` in place via `setArrayProperty`. Phase 3: same-ref check → propsChanged detects `.completed` differs (correct) → `notify()` (correct) → `rec.propsSnapshot = snapshotProps(item)` (new cost: 1000 allocations + 4000 prop writes per reconcile, on top of the notify that was already firing). Baseline was `rec.fresh = false` — one boolean write per item. Allocation dominates when ~every item mutates.

`filter-*` changes the items source (different list slice), so all records either get reused with a new item ref or are replaced. The `if (rec.item !== item)` branch runs for each record → `rec.propsSnapshot = snapshotProps(item)` — same allocation cost.

`remove-5-middle` and `remove-first`: splicing 5 items from the middle shifts every item's *index* downstream. The `if (... rec.index !== i)` branch is taken for every shifted record → snapshot alloc again.

Common thread: every `if` branch in phase 3 reallocates the snapshot. This is the dominant new cost on all shift/mutate-heavy benchmarks.

## Already applied: iter-3's fix
In-place `refreshSnapshotAndDetect(snap, item)` that both compares and overwrites in one `for (k in item)` pass, zero allocation after initial setup. Already implemented in the worktree; next step is to rebuild and re-measure.
