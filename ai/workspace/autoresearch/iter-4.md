# Iteration 4: Extend in-place snapshot refresh to the `if` branch too

## Hypothesis
iter-3's `if` branch (item ref changed OR index shifted) still reallocates the snapshot via `rec.propsSnapshot = createSnapshot(item)` on every hit. On `filter-*` (new item refs for everything) and `remove-*` / `remove-5-*` (index shifts) this fires on ~every record. Reusing the existing `snap` object with `refreshSnapshotAndDetect` (which iter-3 uses in the else-if branch) should cut one allocation per record per hot reconcile.

## Change
```diff
  if (rec.item !== item || rec.index !== i) {
    rec.itemSignal.set(getEachData(item, i, collectionType, node));
    rec.item = item;
    rec.index = i;
-   rec.propsSnapshot = createSnapshot(item);
+   if (rec.propsSnapshot !== null && typeof rec.propsSnapshot === 'object'
+       && item !== null && typeof item === 'object') {
+     refreshSnapshotAndDetect(rec.propsSnapshot, item);
+   }
+   else {
+     rec.propsSnapshot = createSnapshot(item);
+   }
  }
```

Renderer tests: 920 passed / 4 skipped (green).

## Measurement (vs iter-0, iter-3 for reference)

### CI (`tachometer-ci.json`)
| Benchmark | iter-0 | iter-3 | iter-4 | Δ (iter-4 − iter-3) |
|---|---|---|---|---|
| create-1k | -2.1% | -2.6% | unsure -1.2% | +1.4pp (noise) |
| create-10k | unsure +0.1% | unsure +0.3% | +0.9% | +0.6pp |
| append-1k | +6.4% | -14.8% | -16.9% | -2.1pp ✓ |
| update-10th | +14.1% | -50.5% | -49.5% | +1.0pp (noise) |
| select | -14.3% | -9.1% | -14.2% | -5.1pp ✓ (recovered to baseline) |
| swap-rows | +5.3% | -23.0% | -24.2% | -1.2pp ✓ |
| clear | +31.1% | unsure +2.3% | unsure -1.4% | -3.7pp ✓ |

### TodoMVC macro (`tachometer-ci-todo.json`)
| Benchmark | iter-0 | iter-3 | iter-4 | Δ (iter-4 − iter-3) |
|---|---|---|---|---|
| bulk-add-50 | +11.8% | unsure +2.7% | unsure +4.5% | +1.8pp |
| bulk-add-200 | unsure +0.4% | unsure +1.7% | unsure +1.8% | +0.1pp |
| add-20 | unsure +0.5% | unsure +0.3% | unsure -0.5% | -0.8pp |
| toggle-10 | unsure -0.3% | unsure -0.5% | unsure +0.1% | +0.6pp |
| **toggle-all** | unsure +0.2% | **+26.7%** | **+29.1%** | +2.4pp (noise) |
| remove-5-front | unsure -1.0% | -5.0% | -2.9% | +2.1pp |
| remove-5-middle | unsure -2.7% | +2.7% | +2.4% | -0.3pp (flat) |
| remove-5-back | unsure -0.4% | unsure +0.3% | unsure +3.9% | +3.6pp (noisy) |
| clear-completed | unsure -0.2% | unsure -1.0% | -9.4% | -8.4pp ✓ |

### TodoMVC micro (`tachometer-ci-todo-micro.json`)
| Benchmark | iter-0 | iter-3 | iter-4 | Δ (iter-4 − iter-3) |
|---|---|---|---|---|
| toggle-first | unsure +5.4% | -41.5% | **-48.0%** | **-6.5pp** ✓ |
| toggle-last | unsure +0.5% | -36.6% | **-46.9%** | **-10.3pp** ✓ |
| toggle-middle | unsure -2.6% | -27.7% | -31.6% | -3.9pp ✓ |
| **remove-first** | unsure -3.9% | unsure +5.1% | unsure +0.7% | **-4.4pp ✓** (no longer over gate) |
| remove-middle | unsure -2.3% | -12.7% | -15.9% | -3.2pp ✓ |
| **remove-last** | +19.7% | +14.5% | unsure +0.2% | **-14.3pp ✓** (closed) |
| filter-active | unsure +0.4% | unsure +5.2% | unsure -2.6% | -7.8pp ✓ |
| filter-completed | unsure -0.4% | unsure -1.8% | unsure -1.1% | +0.7pp |
| filter-all | +6.3% | unsure +1.4% | unsure -0.2% | -1.6pp |
| **edit-start** | -5.4% | unsure -0.7% | **+7.2%** | **+7.9pp ✗ new regression** |
| edit-save | unsure -0.9% | -10.0% | -19.5% | -9.5pp ✓ |

## Verdict
- [x] **Partial win, not cleanly better than iter-3.** iter-4 is a strict improvement on `todo-micro` for `remove-*`, `filter-*`, and `toggle-first/last/middle`, effectively closing `remove-first` and `remove-last` gate violations. But it introduces a new `edit-start` regression (+7.9pp vs iter-3) and pushes `toggle-all` further (~+2.4pp, plausibly noise). The net trade-off is positive on volume (6-7 wins vs 2-3 losses) but the magnitudes are similar. Given the primary targets are already all closed at iter-3, the extra risk of sign-flips doesn't seem worth it.

Worktree has been restored to iter-3 state before writing this report.

## What I'd try next if continuing
1. **Isolate edit-start's regression** — it sets `state.editingId.set(id)`, which doesn't touch the each's items array directly. The regression in iter-4 suggests the extra branch in the `if` check is slightly more expensive than the unconditional `createSnapshot` on the thin path, OR the snapshot object's hidden class churn matters.
2. **Alternative path: replace `rec.propsSnapshot` with a `rec.itemVersion` counter** seeded at first reconcile. In the `else if` branch, iterate keys but stop at first mismatch; bump version + notify. Might be a simpler state machine.
3. **Accept current result.** All 5 primary targets are closed at iter-3; toggle-all's residual ~26pp regression looks like an irreducible cost of the mechanism on this specific benchmark unless the compiler can flag per-binding property-reads up front.
