# Auto-research session — SUMMARY (iter-3 best-known)

See individual iter-N.md files for per-iteration reasoning and measurements.
Full narrative and gate-violation analysis is in the final agent message
returned to the caller.

## Iterations
- `iter-0.md` — baseline capture
- `iter-1.md` — unconditional `itemSignal.set` — rejected (breaks §8)
- `iter-2.md` — shallow snapshot + alloc-on-change — partial (toggle-all +30pp)
- `iter-3.md` — in-place refresh via `refreshSnapshotAndDetect` — **best-known**
- `iter-4.md` — (in progress at time of write) in-place in `if` branch too

## Primary targets (all closed at iter-3)
| Benchmark | iter-0 | iter-3 |
|---|---|---|
| ci/update-10th | +14.1% | -50.5% |
| todo-micro/toggle-last | +0.5% unsure | -36.6% |
| todo/remove-5-back | -0.4% unsure | +0.3% unsure |
| todo-micro/edit-save | -0.9% unsure | -10.0% |
| todo-micro/remove-middle | -2.3% unsure | -12.7% |

## Gate violations (non-target benches >3pp worse than baseline at iter-3)
| Benchmark | iter-0 | iter-3 | Δ |
|---|---|---|---|
| todo/toggle-all | +0.2% unsure | +26.7% | +26.5pp |
| todo-micro/remove-first | -3.9% unsure | +5.1% unsure | +9.0pp |
| todo/remove-5-middle | -2.7% unsure | +2.7% | +5.4pp |
| todo-micro/edit-start | -5.4% | -0.7% unsure | +4.7pp |

## Artifacts
- `iter-{0,1,2,3,4}-{ci,todo,todo-micro}.json`
- `best-{ci,todo,todo-micro}.json` (iter-3 copies, promoted after iter-3)
- `iter-{0,1,2,3,4}.md`
- `each.baseline.js` — pre-iter-1 each.js
- `each.best-iter3.js` — iter-3 each.js
- `parse.mjs` — tachometer JSON → table
