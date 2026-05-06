---
title: Extending the Benchmark Suite
description: How to add a new tachometer benchmark to the renderer bench suite — pattern, naming, duration considerations, and where it lands in CI.
keywords: [tachometer, benchmark, performance, CI, bench, perf, sampleSize, autoSampleConditions, noise floor]
audience: contributing
skill: extend-bench-suite
type: skill
---

# Extending the Benchmark Suite

> **Skill:** `extend-bench-suite`
> **Purpose:** Add a new tachometer benchmark that runs in CI and reports cleanly through the in-house bench reporter.

**Golden rule: estimate the bench's absolute duration on GHA before writing it.** Per-sample timing noise on the shared runners is roughly constant at σ≈2ms, which means relative noise scales inversely with duration. A 2ms bench and a 50ms bench eat the same ~2ms of irreducible jitter but show it as ±30% vs ±1%. **Benches under ~5ms will land in "Too Fast to Measure Precisely" on zero-delta runs regardless of how clean the code is** — they still work for detecting real perf changes that clear the noise, but reviewers see them flagged as unresolved most of the time.

---

## When to Add a Bench

Add one only if at least one of these holds:

- **A current or near-future perf initiative needs to gate on it.** The bench proves the feature does what it claims and catches regressions later. Ship it with the feature PR, not speculatively.
- **A hot path has no coverage.** The existing suite covers rendering throughput, reactivity, and list-structural ops. Before adding, check `packages/*/bench/tachometer/tachometer-ci*.json` to see if something close already exists. Benches live alongside the package they primarily exercise: component benches in `packages/component/bench/tachometer/`, signal benches in `packages/reactivity/bench/tachometer/`.

**Do not add a bench just because a workload seems interesting.** Every bench costs ~1 min of CI time (initial samples at N=50 + some auto-sample tail) and more comment surface area for reviewers. Benches without a failure mode they actually gate against are noise.

---

## Anatomy

A CI-gated bench is three files working together:

| File | Role |
|------|------|
| `bench-<name>.js` under `packages/<pkg>/bench/tachometer/` | Defines the workload and emits `performance.mark`/`performance.measure` for each metric |
| `ci-current-<name>.html` + `ci-baseline-<name>.html` | Loads the built bundle; tachometer navigates here |
| `tachometer-ci-<suite>.json` | Lists which measurements to collect; configures sampleSize, timeout, autoSampleConditions |

The `build-ci.js` script bundles the bench JS files with esbuild into `dist/current/` and `dist/baseline/` (baseline uses the PR's base-branch `packages/*/src/`). The CI workflow at `.github/workflows/benchmarks.yml` spawns one parallel matrix cell per `tachometer-ci*.json` config discovered in changed packages.

---

## The Authoring Pattern

### Measurement: `performance.mark` + `performance.measure`

Each metric wraps its workload with a paired mark/measure. The convention uses a `startMark` helper so the start-mark name is derivable from the metric name:

```js
const startMark = (name) => `${name}-start`;

performance.mark(startMark('toggle-middle'));
await toggleMiddleItem();
performance.measure('toggle-middle', startMark('toggle-middle'));
```

The **first argument to `performance.measure`** is the metric name. Tachometer extracts it via `measurement.entryName` — these must match exactly.

### ❌ Wrong — end-mark convention diverges

```js
// Inconsistent with existing benches; the reporter's source-link resolver
// matches the first quoted occurrence of the metric name, so stray unrelated
// literals can misdirect the link.
performance.mark('toggle-middle-begin');
performance.measure('toggleMiddle', 'toggle-middle-begin');
```

### ✅ Right — same name everywhere

```js
performance.mark(startMark('toggle-middle'));
performance.measure('toggle-middle', startMark('toggle-middle'));
```

### Tachometer config entry

```json
{
  "$schema": "...",
  "root": "../../../..",
  "sampleSize": 50,
  "timeout": 3,
  "autoSampleConditions": ["2%"],
  "benchmarks": [
    {
      "name": "this-change",
      "url": "ci-current-<suite>.html",
      "browser": { "name": "chrome", "headless": true },
      "measurement": [
        { "mode": "performance", "entryName": "toggle-middle" }
      ]
    },
    {
      "name": "tip-of-tree",
      "url": "ci-baseline-<suite>.html",
      "browser": { "name": "chrome", "headless": true },
      "measurement": [
        { "mode": "performance", "entryName": "toggle-middle" }
      ]
    }
  ]
}
```

**Always list the same measurements in both the `this-change` and `tip-of-tree` entries** — tachometer compares pairwise, so the sets must match.

**Don't change these knob values without a reason:**

| Knob | Value | Why |
|------|-------|-----|
| `sampleSize` | `50` | Floor calibrated against GHA runner noise; smaller → wider CIs, more unsure verdicts |
| `autoSampleConditions` | `["2%"]` | Resolution floor below runner's per-sample noise; tighter → metrics can't converge on zero-delta |
| `timeout` | `3` | 3-minute auto-sample cap per config; larger adds CI wall-clock without resolving stubborn metrics |

---

## Cycle-loop flushing: `Reaction.flush()`, never `await rAF`

The single most expensive methodology mistake on this suite was waiting for `requestAnimationFrame` between mutations inside a measured region. Don't do it. Fix it on sight if you find it.

> The pattern below is informed by reading lit-html's tachometer harness end-to-end — `kitchen-sink`, `repeat`, `template-heavy`, and the `lit-element/list` component-level benches in [lit/lit `packages/benchmarks`](https://github.com/lit/lit/tree/main/packages/benchmarks). lit-html measured regions are fully synchronous (no `await rAF`). `lit-element` benches use `await updateComplete()` between mutations — LitElement's commit is microtask-scheduled, so they wait on the framework's own settle promise rather than racing it. The handful of rAF appearances in their bench tree amortize across whole loops, not per iteration.

### Why it's wrong

The reactivity Scheduler queues Reactions on a microtask. Microtasks drain before the next animation frame fires. So after `signal.set(...)`:

1. `Dependency.changed()` schedules pending Reactions
2. The microtask queue drains — every queued Reaction runs, every DOM update commits — synchronously, *before* rAF
3. rAF eventually fires ~16ms later, sitting idle waiting

`await new Promise(r => requestAnimationFrame(r))` after a mutation adds **~16ms of idle wait after the work is already done**. It's not "wait for paint" (tachometer measures wall-clock between marks; paint is irrelevant). It's not "wait for the framework to settle" (microtask drain already did that). It's pure idle.

When you put that `await rAF` inside a cycle loop, every iteration gates on the 16.66ms vsync clock:

```js
// ❌ Anti-pattern — measures frame cadence, not work
performance.mark('start');
for (let i = 0; i < 50; i++) {
  state.x.set(i);
  await new Promise(r => requestAnimationFrame(r));
}
performance.measure('metric', 'start');
```

The wall clock is `50 × 16.66ms ≈ 833ms` regardless of how much CPU the framework spent. A bench where every cycle does 0.1ms of work and one where every cycle does 15ms of work both wall-clock at ~833ms — both fit under one frame, both wait the same idle 16ms after, both measure the same. **Sub-frame JS-work deltas are invisible.**

This pattern hid an entire reactivity investigation's per-key isolation work — trivial-helper and realistic-helper benches alike read at zero delta because they were watching the frame clock, not the framework.

### The pattern that measures work

```js
// ✅ Sync drain — wall-clock is the actual work
import { Reaction } from '@semantic-ui/reactivity';
const flushWork = () => Reaction.flush();

performance.mark('start');
for (let i = 0; i < 50; i++) {
  state.x.set(i);
  flushWork();
}
performance.measure('metric', 'start');
```

`Reaction.flush()` is a re-export of `Scheduler.flush()`. It walks the queue and runs every pending Reaction inline — same work the microtask would have done, just synchronously, without waiting for vsync. Wall-clock between the marks is now the sum of actual reactive work the loop drove. A 50% per-cycle JS-time win shows up as a 50% wall-clock win, not as no change.

### When `await rAF` is still right

rAF inside a measured region is appropriate **only** when:

- **One-shot mount metrics where the framework's lifecycle is genuinely async.** `each-mount-1000`-style benches that mark, append a custom element, await rAF once, then measure — the rAF gives `connectedCallback` and any rAF-deferred lifecycle hooks time to complete. One rAF, not 50.
- **One-shot bulk operations after a signal mutation when the work itself is huge.** `bulk-add-500`, `clear-completed-250`, `create-1k`, `replace-1k`, `clear-10k` — the work dominates wall-clock (hundreds of ms); the rAF is a constant ~16ms tail and reads as an honest paint-settle gate. `flushWork()` would also work; `await flush()` is acceptable here for symmetry with the mount helpers above.

rAF **between** metrics (after `destroy()`, before the next `mount()`) is fine — that's outside any measured region and just gives the previous metric's tear-down time to fully settle. The `mount()` helper at the top of every bench file uses `flush` (rAF) for exactly this reason.

### Diagnostic: am I rAF-bound?

If your bench's 50-cycle mean is suspiciously close to `50 × 16.66ms = 833ms` regardless of what you change in the workload, it's rAF-bound. Same heuristic for 100 cycles (~1666ms) or 25 cycles (~417ms). Look for `await flush()` (or `await new Promise(r => rAF(r))`) inside the `for` loop and replace with `flushWork()`.

### Two flushes, one file

The convention every bench in `packages/component/bench/tachometer/` uses:

```js
import { Reaction } from '@semantic-ui/reactivity';

// Pre-measurement / between-metric idle wait. rAF gates `mount()` so any
// connectedCallback-deferred microtasks settle before the next metric starts.
const flush = () => new Promise(r => requestAnimationFrame(r));

// Sync drain of pending Reactions. Used inside `performance.mark` ...
// `performance.measure` regions where a per-iteration `await rAF` would
// dominate wall-clock with 16ms idle gaps and bury sub-frame JS-work deltas.
const flushWork = () => Reaction.flush();
```

`flush` for setup and one-shot mount tails. `flushWork` for everything inside a cycle loop in a measured region. If you're writing a new bench file, copy this pair and use them with intent.

---

## Decision: Extend an Existing Bench File or Create a New One?

**Extend existing if the workload fits an existing bench's fixture.** Most new metrics add to `bench-todo.js` (TodoMVC-style list operations) or `bench-krausest.js` (krausest js-framework-benchmark parity workload). Add the `mark`/`measure` pair to the JS file, add the `entryName` to the appropriate `tachometer-ci*.json`. Done in 5 minutes.

**`bench-krausest.js` has a special contract.** It mirrors `tools/benchmark/src/main.js` (the externally-served krausest contestant) and pins `safety: 'reference'` on its signals so the bench always measures the perf fast path regardless of `Signal.defaultSafety`. New metrics here must use SUI-idiomatic helpers (`push`, `map`, `removeItem`, new-ref `set`) — no mutate-then-set-same-ref patterns, which would silently no-op under reference equality. If you find yourself reaching for `equalityFunction: () => false` to make a new metric fire, the metric belongs in `bench-todo.js` instead.

**Create a new bench file if the workload is orthogonal.** E.g., a hydration bench needs its own fixture setup; a signal micro-bench has a different harness shape. Then you need:

1. `bench-<name>.js` with the workload
2. `ci-current-<name>.html` and `ci-baseline-<name>.html` that load `./dist/current/bench-<name>.js` and `./dist/baseline/bench-<name>.js`
3. A new `tachometer-ci-<name>.json` config
4. Update `build-ci.js` to include the new bench file in its `benchFiles` array

The matrix workflow auto-discovers `tachometer-ci*.json` globs, so the new config gets picked up without editing `benchmarks.yml`.

---

## Duration Check Before Writing

Before you write the workload, estimate how long a single iteration will take on CI. The duration determines what the reporter will do with your bench on zero-delta PRs:

| Mean duration | Expected relative noise (σ≈2ms) | How the reporter classifies on zero-delta |
|---|---|---|
| < 5ms | ±30% or wider | "Too Fast to Measure Precisely" — always unresolved |
| 5–20ms | ±5% to ±15% | Usually noise-floor-limited on zero-delta; resolves cleanly under >10% real delta |
| 20–100ms | ±1% to ±5% | Fits the ["2%"] floor — resolves cleanly when CI is narrow |
| > 100ms | < ±1% | Tight CIs; surfaces real regressions at the ~2% threshold |

**If your workload is naturally under 5ms**, scale it up. Loop the operation enough times to get into the 20ms+ range. For example: `toggle-10` loops the toggle operation 10× to amplify a per-toggle delta that would be lost in noise at 1×.

### ❌ Tiny single-iteration workload

```js
performance.mark(startMark('signal-set'));
signal.set(42);
performance.measure('signal-set', startMark('signal-set'));
// mean ≈ 0.01ms — can't measure
```

### ✅ Amplified to a measurable scale

```js
performance.mark(startMark('signal-set-1k'));
for (let i = 0; i < 1000; i++) { signal.set(i); }
performance.measure('signal-set-1k', startMark('signal-set-1k'));
// mean ≈ 15ms — resolvable under real perf deltas
```

Naming convention for amplified workloads: suffix with the iteration count (`signal-set-1k`, `create-1k`, `bulk-add-50`).

---

## Naming Conventions

| Rule | Example |
|------|---------|
| `kebab-case` | `toggle-middle`, `remove-5-front` |
| Suffix iteration count when amplified | `create-1k`, `update-10th`, `bulk-add-50` |
| No framework prefix | `create-1k` — not `sui-create-1k` (the suite is already SUI-scoped) |
| Unique across the whole suite | Tachometer's `entryName` is global per matrix cell, but the reporter indexes by name across all configs — collisions break cross-referencing |

### ❌ Name collision across configs

`tachometer-ci-krausest.json` has `clear-10k` (table-clear workload).
`tachometer-ci-todo.json` also wants `clear` (todo-list clear). **Don't** reuse a bare `clear` — pick a disambiguated name.

### ✅ Disambiguated names

`clear-10k` (krausest table clear after runlots) and `clear-completed-250` (TodoMVC clear-completed button at 250-item scale).

---

## Before You Push

You should run tachometer locally before pushing a new or changed bench. The point is two-fold: confirm the bench wires up correctly, and read its noise floor on the host you're working from. CI's noise floor is GHA's (σ≈2ms); your laptop's may differ — but a bench that's too short or too noisy on your machine will be too short or too noisy on CI in the same direction.

### Check first — does local tachometer work on this host?

```sh
grep -qi microsoft /proc/version && echo "WSL2 — push to CI for tachometer" || echo "Native Linux/Mac — local tachometer works"
```

**WSL2 is a known dead end for tachometer.** Selenium-spawned chromedriver crashes before binding its HTTP port (selenium reports `ECONNREFUSED 127.0.0.1:<port>`). Manually-launched chromedriver works fine on the same host, but tachometer doesn't expose a "use this existing chromedriver" knob, and patching its selenium config is more friction than it's worth. Skip the local loop, push to a draft PR, and use the bench-bot comment as your noise-floor source.

If you're on native Linux or macOS, continue to the local loop below.

### The local loop

```sh
cd packages/<pkg>/bench/tachometer   # e.g. packages/component or packages/reactivity
node build-ci.js current
node build-ci.js baseline             # same source both sides → zero delta
npx tachometer --config tachometer-ci-<suite>.json
```

`tachometer --config <file>` honors every knob in the JSON. Override at the CLI when iterating:

| CLI flag | Config key | Use locally for |
|---|---|---|
| `--sample-size=N` / `-n N` | `sampleSize` | Quicker passes during iteration. Drop below 30 only for a smoke test, never for committed numbers |
| `--timeout=M` | `timeout` (minutes) | Cap wall-clock per config |
| `--auto-sample-conditions=0%` | `autoSampleConditions` | Zero-delta dry runs converge fastest with `0%` |
| `--json-file=out.json` | — | Save raw output for offline inspection |
| `--csv-file=stats.csv` | — | Per-metric summary table |

### Reading the zero-delta output

Same source on both sides means the **true** delta is zero. What tachometer reports tells you the noise floor:

- `unsure` with a tight CI (e.g. `±1.5%`) on a long-running metric → resolvable noise floor; real perf changes ≥2% will be visible on this machine
- `unsure` with wide CI on a short bench (e.g. `-15% to +15%`) → bench is duration-limited; scale the workload up or it'll come back unresolved on every PR
- `slower` or `faster` on zero delta → clock skew between samples, thermal throttling, or background load. Re-run after closing other apps; if it persists, the host is too unstable to trust

The headline number to record is **CI half-width as a percentage of the mean**. That's your local floor. If it's wider than ±5% on a metric meant to gate ≥2% deltas, the bench can't do its job here.

### Iteration shortcut

For a fast read on whether a single new metric is shaped right (without sampling the whole suite):

```sh
# temporary tachometer-noise-floor.json that lists ONLY the new metrics
# in both this-change and tip-of-tree arrays; don't commit it
npx tachometer --config tachometer-noise-floor.json --auto-sample-conditions=0% --timeout=2
```

This converges in under two minutes on a typical metric and reads the floor without re-running everything in the suite. Delete the temporary config before pushing.

### Environment gotchas

- **Stale chromedriver/Chrome processes** between runs. Kill them: `pkill -9 chrome; pkill -9 -f chromedriver`.
- **`XDG_RUNTIME_DIR` missing** on stripped-down Linux environments — Chrome logs `dbus/bus.cc` errors and may fail to start. Fix: `mkdir -p /tmp/runtime-$UID && chmod 700 /tmp/runtime-$UID && export XDG_RUNTIME_DIR=/tmp/runtime-$UID`.

### Sanity checks on the result

- Tachometer reports the expected number of measurements (`N for this-change, N for tip-of-tree`). A mismatch means an `entryName` is in one array but not the other.
- Each measurement name matches what you defined.
- Mean duration is in the range you estimated — if it's 10× shorter than expected, something's wrong with the workload (early return? optimiser elision? `await flush()` skipped?).
- No `ReferenceError` or `undefined is not a function` in the Chrome console. Open `ci-current-<suite>.html` in a browser to debug interactively.

If the local run works and the noise floor is acceptable, push. CI will run the same config in matrix form and the in-house reporter will render the PR comment — see `read-bench-report` for what each section means. Local floor and GHA floor will not match exactly — record both in the PR body so reviewers know what to expect.

---

## Quick Reference

**Files to touch for an extension to an existing suite:**

1. `packages/<pkg>/bench/tachometer/bench-<existing>.js` — add `mark`/`measure` pair
2. `packages/<pkg>/bench/tachometer/tachometer-ci-<suite>.json` — add `{ mode: 'performance', entryName: '<metric>' }` to BOTH `this-change` and `tip-of-tree` measurement arrays

**Files to touch for a new bench file:**

1. `bench-<name>.js` — workload + marks
2. `ci-current-<name>.html` / `ci-baseline-<name>.html` — fixtures (copy an existing pair)
3. `tachometer-ci-<name>.json` — config
4. `build-ci.js` — add `'bench-<name>.js'` to `benchFiles` array

**Knobs to leave alone unless you have data:**

```json
{ "sampleSize": 50, "timeout": 3, "autoSampleConditions": ["2%"] }
```

**Duration target:** 20–100ms mean. Scale up short workloads via iteration count.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reading Bench Reports** | `/read-bench-report` | Reviewing a bench comment on a PR |
| **Internals** | `/internals` | Understanding the renderer's hot paths when picking what to benchmark |
