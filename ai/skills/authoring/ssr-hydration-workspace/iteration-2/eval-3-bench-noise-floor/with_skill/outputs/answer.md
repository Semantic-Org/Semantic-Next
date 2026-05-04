# Why your 6ms hydrate bench can't see the fix — and what to change

## Short answer

A ±28% noise floor on a 6ms bench means tachometer is correctly reporting that the measurement *cannot resolve* changes smaller than ~28%. This isn't a tachometer bug, a sample-size problem, or a config-tuning problem — it is the physical floor of what a 6ms wall-clock bench can detect on a CI runner. Your fix may be very real; the bench is simply too short to see it.

The fix is **not** to crank `sampleSize` or tighten `autoSampleConditions`. The fix is to **amplify per-sample work** so the bench duration moves into a band where small relative changes survive the absolute jitter floor.

---

## Why the floor is ±28%

Per-sample timing jitter on a CI runner — OS scheduling, GC pauses, JIT recompilations — is roughly **constant in absolute terms**, typically σ≈1-2ms. Relative noise is `absolute_jitter / bench_duration`, so it scales inversely with how long the bench takes:

| Bench duration | Expected relative noise floor |
|---|---|
| ~2ms  | ±10-20% |
| ~6ms  | ~±25-30% (your bench) |
| ~10ms | ±2-5% |
| ~50ms+ | ±1% or tighter |

At 6ms, ~2ms of absolute jitter is ~33% relative — exactly where your ±28% lives. The reporter's `Expected Noise` column predicts this from duration, and your bench's CI width matches it. That's the diagnostic signal: **observed CI ≈ expected noise floor → bench is noise-floor-limited, not under-sampled.**

Why this is not a sampling problem:
- The 95% CI is built from sample variance. Tachometer's `autoSampleConditions` only controls the *resolution it chases* — it doesn't relax the CI itself. Asking for ±1% on a 6ms bench means tachometer keeps sampling until it hits `timeout`, then gives up "Unsure."
- Sample-size scaling is √N. To halve a CI you need 4× samples, and per-config wall-clock time grows accordingly. Even pushing `sampleSize` to 200+ would only narrow the CI within the noise floor — it would not push *below* it. The floor is a function of duration, not sample count.

---

## What to change about the bench

Increase per-sample work until duration is in the ±2-5% band (~10ms+), ideally toward ±1% (~50ms+). Three knobs, in order of preference:

### 1. Bump item count (most reliable)

The canonical hydrate bench at `packages/component/bench/tachometer/bench-hydrate.js` uses **1000 items**, not 100, despite the metric being named `hydrate-each-100`. The name is historical; the size was chosen to push the measure window past the noise floor. A 100-item list typically produces a 5-10ms hydrate; a 1000-item list pushes it into the 50-100ms range where ±1% becomes resolvable.

If you copied the `-100` naming from another bench, leave the metric name alone — what matters is that the per-sample workload is large enough.

### 2. Split mount vs. first-data-change into separate windows

The canonical bench measures hydration in two distinct `performance.measure` windows:

- `hydrate-each-100-mount` — DSD parse + `connectedCallback` + the hydrate microtask + the post-hydrate rAF. This catches regressions that move per-item wiring earlier (e.g. an eager `adoptServerItems` in `each.hydrate`).
- `hydrate-each-100` — the first-data-change adoption pass after mount. This catches regressions in the AST→entries cache (`renderer.js buildStringCache`) — on a cache miss the path reverts to a full `buildHTMLStringPure` per item.

If your fix targets only one of these phases, putting them in one combined measure dilutes the signal. Split them — and pick the window that contains your fix.

### 3. Loop the operation N times inside one `performance.measure`

If item count is fixed by what you're benching, loop the hydration cycle N times inside a single measure. A 100-item × 10-cycle measure gets you the same ~60ms duration as a 1000-item × 1-cycle one, with the same noise-floor benefit. The mount path needs `setHTMLUnsafe` each iteration (not `innerHTML` — that does *not* process DSD, see below) and a fresh container.

---

## Don't reach for these (they look like the fix, but aren't)

- **Cranking `sampleSize` past 50** — narrows CI inside the floor, doesn't lower the floor. Wastes per-config timeout budget.
- **Tightening `autoSampleConditions` to `["1%"]` or `["0%"]`** — tells tachometer to keep chasing resolution it physically can't reach. The run burns its `timeout` and emits Unsure verdicts. Set the threshold *above* the predicted noise floor, not below it.
- **Re-running the bench expecting noise to "settle"** — it won't. The floor is inherent to the duration; subsequent runs will look the same.
- **Trusting the cross-session "regressed from peak" column** — that comparison operates on absolute ms across runs on different runner conditions and produces phantom regressions on PRs that didn't change perf. Read the within-session `vs main` column. (The schema_v2 reporter overhaul addresses this.)

---

## Sanity check before you re-bench

When `tachometer` says "no meaningful change," confirm the bench is actually exercising the hydrate path you changed. Two silent failure modes — both common, both produce a bench that "works" while measuring the wrong thing — are worth verifying before scaling up:

1. **`innerHTML` doesn't process Declarative Shadow DOM.** Only `setHTMLUnsafe` (or `Document.parseHTMLUnsafe`) attaches the shadow root from `<template shadowrootmode="open">`. If your bench uses `innerHTML`, the custom element's `shadowRoot` is `null` when `connectedCallback` fires, `hasServerContent` is false, and the element falls through to `fullRender` instead of `hydrate`. Your bench measures fresh client render.

2. **`renderToString` returns an empty body in browser test env unless `Template.isServer = true`.** That flag is set once at module load from `typeof window === 'undefined'`. In Chrome (which is where tachometer runs), it's `false`, the client `Renderer` is selected, and the DSD wrapper is emitted around an empty string. The canonical `bench-hydrate.js` sidesteps this by driving `ServerRenderer` directly off the cloned template's AST in the browser — note the lack of a top-level `renderToString` call. If you're calling `renderToString` from the bench, wrap it in a `try/finally` that toggles `Template.isServer`.

If either of these is in play, your fix never had a chance to register because the bench was never running the hydrate code path. Verify the SSR'd HTML contains hydration markers (`<!--sui:v1:N-->` / `<!--sui-block:v1:N-->`) and that the post-DSD shadow root is non-empty before any JS runs.

---

## Concrete next step

Bump items to 1000 (or loop the 100-item op 10×), re-run, and confirm the `Expected Noise` column drops into the ±1-3% range. Then your real fix should be visible — or the bench will tell you, with statistical confidence, that it isn't.

## References

- `packages/component/bench/tachometer/bench-hydrate.js` — canonical 1000-item dual-window pattern
- `ai/skills/authoring/ssr-hydration.md` — Gotcha 3 (noise floor scaling) and Gotchas 1-2 (silent-failure traps)
- `ai/skills/workflows/contributing/improve-performance.md` — duration/noise table, tuning-knob semantics
- `ai/skills/contributing/read-bench-report.md` — how to read `Expected Noise` vs. observed CI width in the reporter
- `tools/ci/bench/reporter/reporter.js` — the `Expected Noise` column emitter
