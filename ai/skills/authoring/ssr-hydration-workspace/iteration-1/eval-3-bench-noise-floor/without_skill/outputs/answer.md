# Why a 6 ms hydration bench can't see your improvement

Short version: at ~6 ms duration, the bench is running below the resolution floor of the CI runner. The noise floor isn't `±28%` because tachometer is misconfigured — it's that wide because absolute per-sample jitter is roughly constant (~2 ms σ on the GHA runners this repo uses) and `±X%` is just `(constant ms) / (your duration)`. Fix the noise floor by making the bench longer in absolute time, not by tuning tachometer.

## The math the reporter is using

The bench reporter at `/home/jack/semantic/next/tools/ci/bench/reporter/reporter.js` encodes the model explicitly (lines 49–90):

```js
const NOISE_FLOOR = 2;           // percent — matches autoSampleConditions
const SIGMA_ABS_MS = 2;          // empirical per-sample σ on GHA runners

function expectedNoisePp(meanMs) {
  // From SE-of-the-difference of two means at n=50, z=1.96:
  //   abs_CI_width ≈ 2 * 1.96 * sqrt(2) * σ / sqrt(50) ≈ 0.784 * σ
  //   pct_width   = abs_CI_width / mean * 100
  return (0.784 * SIGMA_ABS_MS) / meanMs * 100;
}
```

Plug in `σ = 2 ms`, `mean = 6 ms`:

- `abs_CI_width ≈ 0.784 × 2 = 1.568 ms`
- `pct_width = 1.568 / 6 × 100 ≈ 26%`  → reported as **±13%** (half-width on each side)

You're seeing **±28%** observed. That is `~2.1×` the duration-derived expected width — right at the boundary of what the reporter classifies as `noise-floor-limited` vs `unsure` (`NOISE_RATIO_TOLERANCE = 2` at line 62). So tachometer is honest: at this duration, on these runners, the measurement can't see anything smaller than roughly ±15–30% of the mean. A 1 ms improvement on a 6 ms bench is well below that.

This is exactly why your CI is "no meaningful change" — `NOISE_FLOOR = 2`% (line 49) demands the CI live entirely outside `[-2%, +2%]` to be classified `faster`/`slower`. Your CI straddles ±2% wider than the noise floor allows it to resolve, so the reporter buckets it into `noise-floor-limited` (file `reporter.js`, lines 220–225):

```js
function classify([low, high], ratio) {
  if (high < -NOISE_FLOOR) { return 'faster'; }
  if (low > NOISE_FLOOR)   { return 'slower'; }
  if (low > -NOISE_FLOOR && high < NOISE_FLOOR) { return 'within-noise'; }
  return ratio <= NOISE_RATIO_TOLERANCE ? 'noise-floor-limited' : 'unsure';
}
```

## The "Too Fast to Measure Precisely" bucket exists for this exact case

When you read the rendered comment, your bench should be sitting under `🔍 Unsure → Too Fast to Measure Precisely`. The header copy (rendered from `reporter.js` lines 384–402) literally says:

> On benches this short, system jitter (scheduling, GC, JIT) masks sub-4% changes; larger deltas still resolve cleanly.

That row exists specifically to tell the author "this isn't a verdict, this is a 'your bench is too short' diagnostic." Don't trust the noise classification as a refutation of your fix — trust it as a request to amplify the bench.

## What the existing benches do — copy this pattern

The existing hydrate bench at `/home/jack/semantic/next/packages/component/bench/tachometer/bench-hydrate.js` already runs at `n=1000` items (line 99: `const itemsForMount = makeItems(1000)`), not 100. Recent main-history numbers confirm what that buys you:

| metric | mean | predicted ±% half-width | resolves? |
|---|---|---|---|
| `hydrate-helper-100-mount` | 7.4 ms | ±10.6% | borderline |
| `hydrate-each-100-mount` | 13.7 ms | ±5.7% | yes |
| `hydrate-each-100` | 12.6 ms | ±6.2% | yes |
| `hydrate-helper-100-state-change` | 16.2 ms | ±4.8% | yes |

Source: `/home/jack/semantic/next/tools/ci/bench/reporter/bench-history.json` (the `271be03` commit entry near line 1584).

Note even `hydrate-helper-100-mount` at 7.4 ms is the noisiest of the four because it's the shortest. The larger ones are the ones that resolve cleanly. **You want to be ≥ 30 ms** (predicted ±2.6%) to comfortably clear the ±2% noise floor — that's the inflection point where small changes get classified.

The `bench-todo.js` author at `/home/jack/semantic/next/packages/component/bench/tachometer/bench-todo.js` calls this strategy out explicitly in line comments:

- Line 275: `// 20 alternating toggle-all invocations on a 100-item list — amplified // so the measurement clears the σ≈2ms per-sample noise floor on CI.`
- Line 290: `// Each position's ~10ms per-delete workload clears the σ≈2ms floor.`
- Line 361: `// List scaled to 500 (250 marked completed) so the single clearCompleted // operation is large enough to clear the σ≈2ms per-sample noise floor.`
- Line 333–335: `// 10× loop (vs 5× for the front/back variants) — middle removal's // O(N/2) scan has wider per-sample variance, so 5× landed at ~74ms // with observed CI straddling ±2%. 10× brings it to ~148ms / ±1%.`

These are the same change you should make.

## Concrete options for your bench, ranked

**1. Scale the workload up (preferred).** Move from 100 items to whatever clears 30 ms in absolute time. For pure hydration, that's typically 500–1000 items in this repo. If your fix is in per-item work (e.g. `hydrateInnerContent`, `adoptServerItems`), 1000 items multiplies its weight by 10× without changing what you're measuring. Keep the metric name describing items measured, not items rendered, if you want comparability — but in this repo most names already include the count (e.g. `hydrate-each-100` actually mounts 1000 items per the comment at line 99).

**2. Loop the operation N times inside one `performance.measure` window.** This is what `toggle-all-20` and `remove-10-middle` do. If hydration itself isn't loopable (you only mount once), then loop the *follow-up data change* that exercises the codepath you fixed. The existing bench does this already with `hydrate-each-100` — measures the post-mount `setItems(...)` call rather than mount itself.

**3. Add a separate amplified metric instead of replacing.** Keep the realistic 100-item bench for human readability of the duration, and add a 1000-item variant with the same shape for measurement precision. Both metrics ship; the reporter handles either.

**4. Don't bump `sampleSize` — diminishing returns.** Going from `sampleSize: 50` to `200` only narrows the CI by `√(50/200) = 0.5×`. So 4× the wall-clock time gets you from ±28% to ±14%. Compare to scaling the workload 5× (6ms → 30ms), which gets you from ±28% to ±5% with no extra wall-clock cost. Sample-size tuning is the wrong knob for short benches.

**5. Don't tighten `autoSampleConditions`.** Currently `["2%"]` — that's the *target* CI width for tachometer's auto-sampler. Tightening it to `["1%"]` just makes tachometer keep sampling until either it converges (it can't, because the underlying jitter is absolute-constant, not relative) or it hits `timeout: 3` minutes and gives up with the same wide CI. The `tachometer-todo.json` non-CI variant uses `["0%", "10%"]` which means "sample until <10% relative width OR a 0% target" — also wrong choice for short benches. Width comes from duration, not from sample count beyond a point.

## Verifying your fix saved time at all

If you want to know whether the fix is real before investing in bench amplification:

- Run the bench locally with `--manual` or via the CI HTML harness, open DevTools, and use the Performance panel — a 1 ms saving on a 6 ms operation is visible in a flame graph even when it's invisible to tachometer at n=50.
- Add a `console.time('hydrate')` / `console.timeEnd('hydrate')` around the codepath, run it 10 times locally, eyeball the median — if you see 5 ms vs 6 ms consistently, the fix is real and the bench is just under-resolved.

Then commit the bench amplification as a separate change so the perf comment on your fix's PR can show a `faster` row instead of `noise-floor-limited`.

## Summary

The noise floor is wide because `1.568 ms / 6 ms ≈ 26%`. That's not a bug or a tachometer config issue — it's the duration-derived statistical floor for the σ ≈ 2 ms per-sample jitter on this runner, and the reporter at `tools/ci/bench/reporter/reporter.js` documents it explicitly. The fix is to amplify the bench duration to ≥ 30 ms (loop the op, scale items, or both), exactly as the existing `bench-todo.js` and `bench-hydrate.js` already do. Don't reach for `sampleSize` or `autoSampleConditions` — neither addresses the underlying `(constant ms) / duration` problem.
