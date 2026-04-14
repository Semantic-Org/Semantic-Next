# Tachometer per-commit deltas — PR #137 (`perf/native`)

Each cell is the measured percent change for that commit vs. the `main` tip-of-tree,
as reported by tachometer in the PR's Benchmarks workflow artifacts. Negative = faster,
positive = slower. `unsure (±N%)` means the 95% confidence interval straddled zero;
the parenthesized number is the midpoint. `~0%` is within half a percent.

Filter: a benchmark is included only if its midpoint delta moved by at least 10 percentage
points across commits, or flipped hard between confidently-faster and confidently-slower.

17 of PR #137's 22 commits had a Benchmarks workflow run with retrievable artifacts; the
remaining 5 commits either had their run superseded or didn't finish. 3 suites
(ci, todo, todo-micro), 22 benchmarks shown out of 27 total.

## JS Framework Benchmark (`renderer-tachometer-ci`)

| Commit | append-1k | clear | create-10k | create-1k | select | update-10th |
|---|---|---|---|---|---|---|
| `56554b4` Harness: findings on perf | +16% | +26% | +18% | +22% | +69% | -6% |
| `5bb6ae3` Perf: Plan 04 — server-embedded data-sui-bind for at... | -1% | unsure (-4%) | -1% | ~0% | unsure (-2%) | ~0% |
| `631253a` Perf: Plan 02 — defer removeMarkers() to requestAnim... | ~0% | unsure (+1%) | ~0% | ~0% | unsure (+2%) | ~0% |
| `d82e282` Perf: Plan 08 — single-pass walker in bindMarkers + ... | ~0% | unsure (-6%) | ~0% | ~0% | -43% | unsure (-2%) |
| `9071884` Perf: Plan 09 — per-item markers + DOM-reusing first... | +2% | ~0% | ~0% | -1% | -38% | -3% |
| `7771ebc` Docs: Plan 12 evaluation — hydration yielding deferred | ~0% | ~0% | ~0% | ~0% | -42% | ~0% |
| `9afaefd` Docs: Final Vercel prod measurements across perf plans | +2% | unsure (-4%) | ~0% | -1% | -44% | unsure (-1%) |
| `7be0553` Docs: Correct perf summary framing | unsure (+1%) | unsure (-7%) | ~0% | ~0% | -41% | -2% |
| `c34bb20` Docs: Apples-to-apples main re-measurement | +1% | ~0% | -1% | ~0% | -40% | unsure (+2%) |
| `782d01b` Bug: Plan 09 — stringify item keys so adoption actua... | unsure (+3%) | unsure (+9%) | ~0% | ~0% | -39% | ~0% |
| `fa64933` Test: Document reactiveData fine-granularity gap (sk... | ~0% | unsure (-5%) | ~0% | ~0% | -43% | -2% |
| `2f8a211` Fix flamechart issue with context | -5% | unsure (-3%) | ~0% | ~0% | -41% | ~0% |
| `deb712c` Perf: Skip itemSignal.notify on freshly-created each... | -14% | -20% | -16% | -19% | -38% | +31% |
| `53e6b7f` Docs: Archive hydration-perf-pass + add fine-grained... | -14% | -11% | -16% | -19% | -39% | +27% |
| `3f9988c` Docs: Flip plan ordering — signal-performance before... | -13% | -32% | -17% | -20% | -41% | +35% |
| `ff609ec` Docs: Note in-place-mutation contract for each phase... | -14% | -36% | -16% | -19% | -40% | +32% |
| `11adcca` Perf: Specialize defineBlock reaction callback | -13% | -6% | -16% | -19% | -42% | +35% |

## TodoMVC macro (`renderer-tachometer-ci-todo`)

| Commit | bulk-add-200 | bulk-add-50 | remove-5-back | remove-5-front | remove-5-middle | toggle-all |
|---|---|---|---|---|---|---|
| `56554b4` Harness: findings on perf | +28% | +25% | -5% | -5% | -6% | -7% |
| `5bb6ae3` Perf: Plan 04 — server-embedded data-sui-bind for at... | ~0% | ~0% | unsure (-2%) | ~0% | unsure (-2%) | ~0% |
| `631253a` Perf: Plan 02 — defer removeMarkers() to requestAnim... | ~0% | ~0% | unsure (+1%) | ~0% | ~0% | ~0% |
| `d82e282` Perf: Plan 08 — single-pass walker in bindMarkers + ... | -1% | ~0% | ~0% | ~0% | ~0% | ~0% |
| `9071884` Perf: Plan 09 — per-item markers + DOM-reusing first... | ~0% | ~0% | unsure (+1%) | ~0% | unsure (-1%) | unsure (+1%) |
| `7771ebc` Docs: Plan 12 evaluation — hydration yielding deferred | ~0% | ~0% | ~0% | ~0% | ~0% | unsure (-2%) |
| `9afaefd` Docs: Final Vercel prod measurements across perf plans | ~0% | ~0% | ~0% | ~0% | ~0% | ~0% |
| `7be0553` Docs: Correct perf summary framing | ~0% | ~0% | +4% | ~0% | unsure (-1%) | unsure (+2%) |
| `c34bb20` Docs: Apples-to-apples main re-measurement | ~0% | -2% | ~0% | ~0% | unsure (-1%) | ~0% |
| `782d01b` Bug: Plan 09 — stringify item keys so adoption actua... | ~0% | ~0% | ~0% | ~0% | ~0% | +3% |
| `fa64933` Test: Document reactiveData fine-granularity gap (sk... | ~0% | ~0% | ~0% | ~0% | ~0% | +3% |
| `2f8a211` Fix flamechart issue with context | ~0% | +2% | unsure (-2%) | ~0% | ~0% | ~0% |
| `deb712c` Perf: Skip itemSignal.notify on freshly-created each... | -22% | -17% | unsure (+1%) | +6% | -3% | +6% |
| `53e6b7f` Docs: Archive hydration-perf-pass + add fine-grained... | -22% | -18% | +3% | +6% | ~0% | +6% |
| `3f9988c` Docs: Flip plan ordering — signal-performance before... | -22% | -18% | unsure (+1%) | +4% | unsure (-1%) | +5% |
| `ff609ec` Docs: Note in-place-mutation contract for each phase... | -21% | -18% | +8% | +3% | -3% | +2% |
| `11adcca` Perf: Specialize defineBlock reaction callback | -20% | -17% | +11% | +7% | +8% | +8% |

## TodoMVC micro (`renderer-tachometer-ci-todo-micro`)

| Commit | edit-save | edit-start | filter-all | filter-completed | remove-first | remove-last | remove-middle | toggle-first | toggle-last | toggle-middle |
|---|---|---|---|---|---|---|---|---|---|---|
| `56554b4` Harness: findings on perf | ~0% | unsure (+1%) | +29% | +31% | -9% | unsure (-3%) | +13% | +10% | -11% | +5% |
| `5bb6ae3` Perf: Plan 04 — server-embedded data-sui-bind for at... | ~0% | ~0% | ~0% | ~0% | unsure (+2%) | unsure (-1%) | ~0% | ~0% | ~0% | ~0% |
| `631253a` Perf: Plan 02 — defer removeMarkers() to requestAnim... | unsure (-2%) | unsure (-1%) | ~0% | unsure (-1%) | unsure (+2%) | ~0% | ~0% | unsure (+1%) | ~0% | unsure (-2%) |
| `d82e282` Perf: Plan 08 — single-pass walker in bindMarkers + ... | unsure (-2%) | ~0% | ~0% | ~0% | -5% | unsure (-2%) | unsure (+4%) | -1% | unsure (-1%) | unsure (+2%) |
| `9071884` Perf: Plan 09 — per-item markers + DOM-reusing first... | unsure (-1%) | unsure (-1%) | ~0% | ~0% | unsure (-2%) | unsure (+2%) | unsure (+2%) | ~0% | ~0% | ~0% |
| `7771ebc` Docs: Plan 12 evaluation — hydration yielding deferred | ~0% | unsure (-1%) | ~0% | unsure (-1%) | unsure (-1%) | ~0% | ~0% | -2% | ~0% | unsure (+1%) |
| `9afaefd` Docs: Final Vercel prod measurements across perf plans | unsure (+2%) | ~0% | ~0% | ~0% | -3% | ~0% | unsure (+4%) | ~0% | ~0% | ~0% |
| `7be0553` Docs: Correct perf summary framing | unsure (+2%) | ~0% | ~0% | -1% | -3% | ~0% | unsure (+3%) | unsure (-1%) | ~0% | ~0% |
| `c34bb20` Docs: Apples-to-apples main re-measurement | ~0% | unsure (+1%) | -1% | ~0% | ~0% | ~0% | ~0% | unsure (-1%) | ~0% | unsure (-1%) |
| `782d01b` Bug: Plan 09 — stringify item keys so adoption actua... | unsure (-2%) | ~0% | ~0% | ~0% | -4% | ~0% | unsure (+3%) | ~0% | ~0% | ~0% |
| `fa64933` Test: Document reactiveData fine-granularity gap (sk... | ~0% | unsure (-2%) | ~0% | ~0% | ~0% | ~0% | unsure (-1%) | ~0% | ~0% | ~0% |
| `2f8a211` Fix flamechart issue with context | +2% | unsure (+2%) | -1% | ~0% | unsure (-3%) | unsure (+3%) | ~0% | -2% | unsure (-2%) | ~0% |
| `deb712c` Perf: Skip itemSignal.notify on freshly-created each... | +9% | +6% | -21% | -19% | -6% | +2% | -3% | -8% | +17% | -5% |
| `53e6b7f` Docs: Archive hydration-perf-pass + add fine-grained... | +7% | +7% | -21% | -20% | -5% | +3% | ~0% | -9% | +17% | -5% |
| `3f9988c` Docs: Flip plan ordering — signal-performance before... | +5% | +5% | -20% | -19% | ~0% | +3% | unsure (-1%) | -8% | +18% | -4% |
| `ff609ec` Docs: Note in-place-mutation contract for each phase... | +7% | +4% | -20% | -19% | ~0% | unsure (+1%) | +6% | -8% | +19% | unsure (-2%) |
| `11adcca` Perf: Specialize defineBlock reaction callback | +4% | +9% | -24% | -21% | +15% | +12% | -13% | -10% | +11% | -6% |

## Key inflection points

Commits that moved at least one benchmark midpoint by >=15pp from the preceding run.
Arrows show `previous-delta -> new-delta` vs. main.

**`5bb6ae3` — Perf: Plan 04 — server-embedded data-sui-bind for attribute hydration**
- `ci/select` improved by 71pp (+69% -> -2%)
- `todo-micro/filter-completed` improved by 30pp (+31% -> +1%)
- `ci/clear` improved by 30pp (+26% -> -4%)
- `todo-micro/filter-all` improved by 29pp (+29% -> +0%)
- `todo/bulk-add-200` improved by 28pp (+28% -> -0%)
- `todo/bulk-add-50` improved by 25pp (+25% -> -0%)
- `ci/create-1k` improved by 22pp (+22% -> -0%)
- `ci/create-10k` improved by 18pp (+18% -> -1%)
- `ci/append-1k` improved by 17pp (+16% -> -1%)

**`d82e282` — Perf: Plan 08 — single-pass walker in bindMarkers + fast-path depth fix**
- `ci/select` improved by 45pp (+2% -> -43%)

**`deb712c` — Perf: Skip itemSignal.notify on freshly-created each records**
- `ci/update-10th` regressed by 32pp (-0% -> +31%)
- `todo/bulk-add-200` improved by 22pp (-0% -> -22%)
- `todo-micro/filter-all` improved by 20pp (-1% -> -21%)
- `todo-micro/toggle-last` regressed by 19pp (-2% -> +17%)
- `todo/bulk-add-50` improved by 19pp (+2% -> -17%)
- `ci/create-1k` improved by 19pp (-1% -> -19%)
- `todo-micro/filter-completed` improved by 18pp (-1% -> -19%)
- `ci/clear` improved by 17pp (-3% -> -20%)
- `ci/create-10k` improved by 16pp (-0% -> -16%)

**`3f9988c` — Docs: Flip plan ordering — signal-performance before fine-grained**
- `ci/clear` improved by 21pp (-11% -> -32%)

**`11adcca` — Perf: Specialize defineBlock reaction callback**
- `ci/clear` regressed by 30pp (-36% -> -6%)
- `todo-micro/remove-middle` improved by 19pp (+6% -> -13%)
