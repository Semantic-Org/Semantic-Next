# Why your hydrate bench can't see the win, and what to change

## The short version

A 6ms tachometer bench on shared GitHub Actions runners is below the resolution floor by physics, not by configuration. The runner has roughly **2ms of irreducible per-sample jitter** (OS scheduling, GC, JIT recompiles, shared CPU). At 6ms mean duration, that 2ms shows up as `~2/6 ≈ 33%` relative noise — which is exactly what you're seeing in your `±28%` floor. No knob in `tachometer-ci-*.json` will narrow that. **You need to lengthen the bench.**

The fix isn't to retune `sampleSize` or `autoSampleConditions`. The fix is to scale up the workload until the mean duration is in the 20–100ms range, where 2ms of jitter becomes 2–10% relative noise and a real per-hydrate improvement of even a few percent can clear the resolution floor.

---

## Why the floor is wide — the underlying math

GHA shared runners have a roughly constant absolute timing variance of σ≈2ms per sample (this is calibrated into the in-house bench reporter as `sigma_abs_ms: 2`). Tachometer reports a 95% confidence interval, and CI width scales as `~σ/√N` in absolute terms but as `~σ/(mean × √N)` in relative terms.

So at fixed `sampleSize: 50` (the default), and σ_abs=2ms:

| Bench mean | Expected relative CI width | What the reporter does on zero-delta |
|------------|----------------------------|--------------------------------------|
| 2 ms       | ~±50%                      | "Too Fast to Measure Precisely"      |
| 6 ms       | ~±28%  ← **you are here**  | "Too Fast to Measure Precisely"      |
| 20 ms      | ~±5–8%                     | Resolves real >10% deltas            |
| 50 ms      | ~±2–4%                     | Sits right at the ±2% floor          |
| 100 ms     | ~±1–2%                     | Tight; surfaces real ~2% regressions |

Your `±28%` matches the 6ms row, which is the noise floor giving its honest verdict: at this duration, tachometer cannot distinguish a 5% real improvement from runner jitter. "No meaningful change" here means *unresolved*, not *unchanged*.

The reporter formalizes this in two distinct buckets under `🔍 Unsure`:

- **Inconclusive** — observed CI width > 2× the expected width for that duration. More samples might help, or the bench has unusual variance.
- **Too Fast to Measure Precisely** — observed CI width ≈ expected width for that duration. Physics-limited; sampling longer won't help.

A 6ms bench landing at ±28% is the canonical Too Fast case. Expected width and observed width agree — there's nothing to investigate about the bench's variance, and there's nothing more to extract from the data without changing the workload.

---

## Why "just bump sampleSize" is the wrong instinct

CI width does narrow as `1/√N`. So to halve a `±28%` floor you'd need `4×` the samples (200 instead of 50), and to drop it to `±5%` you'd need roughly `~30×` more samples (~1500). That's:

- Hours of CI wall-clock per bench (the matrix job has a 10-minute hard cap).
- A `timeout: 3` minute auto-sample cap, which would simply abort.
- Burns runner cost across every PR for a single metric.

The repo's bench config is calibrated against this tradeoff. From `tachometer-ci-hydrate.json`:

```json
{ "sampleSize": 50, "timeout": 3, "autoSampleConditions": ["2%"] }
```

These knobs are documented in `ai/skills/contributing/extend-bench-suite.md` as **"don't change without a reason"** — they're the floor that makes the matrix fit in CI budget. The right move is on the workload side.

---

## Concrete fix for your bench — amplify the per-hydrate work

Look at the existing hydrate bench at `/home/jack/semantic/next/packages/component/bench/tachometer/bench-hydrate.js`. Its `hydrate-each-100-mount` and `hydrate-each-100` measurements work in tachometer because they hydrate **1000 items**, not 100 (the metric name is misleading; line 99 reads `makeItems(1000)`). That's deliberate — at 1000 items the mount window lands in the resolvable range.

For a 100-item list whose per-item hydrate cost is ~60µs, you have three scaling options ranked by preference:

### 1. Loop the hydrate operation N times in one measure window (preferred)

If your fix is in the per-component hydrate path (not the per-item path), repeat the whole component mount cycle inside one `performance.measure` boundary:

```js
performance.mark(startMark('hydrate-mycomp-50x'));
for (let i = 0; i < 50; i++) {
  const fresh = ssrMyComponent(items100);   // fresh DSD string, no caching across iterations
  container.setHTMLUnsafe(fresh);
  await drainMicrotasks();
  await flush();
  container.innerHTML = '';
}
performance.measure('hydrate-mycomp-50x', startMark('hydrate-mycomp-50x'));
```

A 6ms × 50 ≈ 300ms window pushes you into "<±1%" territory. The reporter will resolve any real per-hydrate delta down to ~2%. Suffix the metric name with the iteration count (`hydrate-mycomp-50x`) per the naming convention so reviewers know it's amplified.

**Caveat:** make each iteration genuinely independent. Re-use the same SSR HTML string (precompute it once outside the loop) so the SSR cost isn't included, but generate a fresh container or `setHTMLUnsafe` call so prototype caches (`_hydrationEntries` is cached on the prototype after the first hydrate — see `ssr-hydration.md` Phase 5) don't make iterations 2..N artificially cheap. The first iteration measures cold-cache, the rest measure warm-cache. If your fix targets the warm path, throw away the first iteration's contribution by warming once before `performance.mark`.

### 2. Scale the list itself

If your fix is per-item (e.g., a faster `hydrateInnerContent`, marker walk, or attribute parallel-walk), 100 items × ~60µs = ~6ms. Bump to **1000 items × ~60µs = ~60ms** and you sit comfortably above the floor:

```js
const items = makeItems(1000);
const dsdHTML = ssrList(items);
performance.mark(startMark('hydrate-mycomp-1k'));
container.setHTMLUnsafe(dsdHTML);
await drainMicrotasks();
await flush();
performance.measure('hydrate-mycomp-1k', startMark('hydrate-mycomp-1k'));
```

This is what `bench-hydrate.js` already does for the each-block mount path.

### 3. Split the measurement window

Sometimes the work you're optimizing is one phase of a larger hydrate cycle, and amplifying the whole cycle hides your delta in the unaffected phases. In that case, split into two measures:

- `hydrate-mycomp-mount-1k` — DSD parse + connectedCallback + the hydrate microtask
- `hydrate-mycomp-rebind-1k` — first state mutation that re-fires Reactions (uses `hasHydrated` adoption path)

`bench-hydrate.js` does exactly this with its mount vs. helper-state-change pair (lines 99–122). Each window is independently resolvable, and a fix targeting one path won't be diluted by the other.

---

## What to change in your config

Almost certainly nothing. After amplifying the workload, leave `sampleSize: 50`, `autoSampleConditions: ["2%"]`, and `timeout: 3` alone — they're the floor the matrix is calibrated against. Just add the new `entryName` to **both** the `this-change` and `tip-of-tree` measurement arrays in `tachometer-ci-hydrate.json` (or whichever config you're extending).

If after amplifying your bench is still showing wide CIs at >2× the expected width for its new duration, *then* something is wrong with the bench itself — likely:

- Per-iteration GC pause varying by allocation pattern
- Async work bleeding past `await flush()` (the mount cycle includes a `requestAnimationFrame` that strips data-sui-bind markers post-hydrate — make sure your final `flush()` covers it)
- An accidental cache hit on iteration 2..N (see caveat in option 1)

That'd land in the reporter's `Inconclusive` bucket (observed/expected ratio > 2), at which point investigate the bench setup.

---

## How to verify before pushing

From the bench skill, the local verification flow:

```sh
cd packages/component/bench/tachometer
node build-ci.js current
node build-ci.js baseline       # same source both sides — zero-delta dry run
npx tachometer --config tachometer-ci-hydrate.json
```

A clean, zero-delta dry run on a workload sized into the 20–100ms range should report a CI width comfortably below ±5%. If your dry-run width is still wide, you haven't amplified enough — duration matters more than sample count.

---

## TL;DR for the PR comment / commit message

> The bench's mean duration was ~6ms, which puts it below the resolution floor on shared GHA runners (σ≈2ms absolute jitter → ~±28% relative). Tachometer's `±28%` "no meaningful change" verdict is the noise floor giving its honest answer, not evidence the fix doesn't help. Amplifying the workload to a ~60ms+ mean (either by looping the hydrate cycle 10–50× per measure window or by scaling the list to 1k items) brings it into the resolvable range where a real per-hydrate delta of even a few percent will land in the Faster section. The `sampleSize`/`autoSampleConditions`/`timeout` knobs are calibrated against CI budget and shouldn't be the lever here.

---

## Reference files

- `/home/jack/semantic/next/ai/skills/contributing/extend-bench-suite.md` — duration target table, naming conventions, knobs
- `/home/jack/semantic/next/ai/skills/contributing/read-bench-report.md` — Inconclusive vs Too Fast to Measure Precisely buckets, expected_noise_pp/observed_noise_ratio fields
- `/home/jack/semantic/next/packages/component/bench/tachometer/bench-hydrate.js` — canonical hydrate bench using 1000 items + split mount/state-change windows
- `/home/jack/semantic/next/packages/component/bench/tachometer/tachometer-ci-hydrate.json` — the standard knob set (`50`/`3`/`["2%"]`)
