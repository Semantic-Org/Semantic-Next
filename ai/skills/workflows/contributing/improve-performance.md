---
title: Improve Performance
description: Workflow for auditing, profiling, optimizing, and validating performance improvements. Uses tachometer as the committed measurement standard, vitest bench and V8 profiling for iteration.
keywords: [performance, optimization, benchmarks, profiling, tachometer, vitest bench, V8, node --prof, audit]
audience: contributing
type: workflow
workflow: improve-performance
---

# AI Workflow: Improve Performance

**A rigorous audit → fix → measure cycle for any package**

This workflow produces measurable performance improvements validated by benchmarks. It applies to any package in the monorepo — utils, reactivity, renderer, templating, etc.

## Design Principles

- **Measure, don't guess.** Every optimization must be benchmarked against the pre-change baseline. "An agent thinks this is faster" is not evidence.
- **Trace before you optimize.** Benchmarks tell you *what's slow*; profiling tells you *why*. Always trace to identify the dominant cost before writing code.
- **Realistic data shapes.** Benchmark inputs should mirror real component settings, state objects, and attribute names — not `{a:1}` toy objects. V8 optimizes differently for different object shapes.
- **Hot paths first.** Focus on functions that appear in profiles during component rendering, signal dirty-checking, and SSR. Formatting utilities and error paths are low priority.
- **Algorithmic wins over micro-optimizations.** Cache expensive constructors, eliminate O(n²), remove per-call allocations. Skip changes that save nanoseconds but cost readability.
- **Iterate.** Re-audit after fixing the first round of issues. Deeper optimizations become visible only after the dominant cost is removed — it often takes 2-3 rounds to converge.

---

## Expression Evaluator: Real-World Distribution

Audit of 209 expressions across 29 production component templates (`src/`), validated against 706 expressions across 113 example templates (`docs/src/examples/`):

| Evaluator path | Production (`src/`) | Examples (`docs/`) | Description |
|---|---|---|---|
| **Simple identifier** | **58%** | 54% | `{label}`, `{icon}`, `{disabled}` — direct property lookup |
| **Dotted path** | **21%** | 14% | `{item.name}`, `{user.role}` — nested traversal |
| **Lisp helper** | **19%** | 21% | `{classIf isActive 'active'}` — parsed, cached |
| **JS eval** | **2%** | 8% | `{count + 1}`, ternaries — `new Function` + Proxy |
| **Complex Lisp** | **0%** | 4% | Inline objects/arrays, nested parens — parse + regex heavy |

**79% of production expression evaluations are a property lookup** (simple identifier or dotted path). Lisp helpers account for nearly all of the rest. JS eval and complex Lisp are virtually absent in production code — they appear in docs examples that demonstrate edge-case syntax.

When prioritizing expression evaluator performance, weight efforts by this distribution. A 10% improvement on simple identifiers has more real-world impact than a 2x improvement on complex Lisp expressions.

---

## Tools

Three tools serve different purposes. Using the wrong one for the job produces misleading results.

| | **tachometer** | **vitest bench** | **profile.js** |
|---|---|---|---|
| **Role** | Source of truth | Iteration feedback | Tracing |
| **Question** | "How fast, with what confidence?" | "Did this change help?" (quick check) | "Where is time spent?" |
| **Runs in** | Real Chrome (headless) | Node via vitest workers | Node directly |
| **Statistics** | 50+ samples, 95% CI, auto-sampling | Thousands of ops, rme% | Single trial |
| **Output** | JSON for CI aggregation | Terminal table | V8 tick log text |
| **Use for** | Committed measurements, CI gates | Fast iteration during a perf pass | Identifying hot functions, regex costs |
| **Do NOT use for** | — | Final committed numbers | A/B comparison |

**Tachometer is the committed standard.** All performance claims in commits and PRs must be validated by tachometer benchmarks. vitest bench and profile.js are iteration tools — useful during development but not authoritative.

### Why tachometer

- Runs in real Chrome — measures the actual browser rendering pipeline, not a Node.js approximation
- Statistical rigor — repeated sampling with confidence intervals, auto-samples until significance
- JSON output — CI can aggregate reports across commits to detect regressions
- Same-session comparison — round-robins between variants to eliminate thermal/GC/JIT bias
- Import maps — resolves monorepo bare specifiers natively in the browser, no build step

### How tachometer output reaches a reviewer

Tachometer emits JSON. In this repo, CI hands that JSON to an in-house reporter (`tools/ci/bench/reporter/`) that renders a PR comment with per-metric verdicts (faster/slower/no change/unsure) and uploads a structured `bench-report.json` artifact for agent consumption. The reporter is the human-readable surface; the JSON adjunct is the agent-readable one. Both derive from the same tachometer output — no parallel data paths.

### Tachometer in monorepos

Tachometer's `koa-node-resolve` can't follow transitive bare imports through npm workspace symlinks. Use **browser-native import maps** instead:

```html
<script type="importmap">
{
  "imports": {
    "@semantic-ui/component": "/packages/component/src/index.js",
    "@semantic-ui/renderer": "/packages/renderer/src/index.js",
    "@semantic-ui/reactivity": "/packages/reactivity/src/index.js",
    "@semantic-ui/templating": "/packages/templating/src/index.js",
    "@semantic-ui/templating/template": "/packages/templating/src/template.js",
    "@semantic-ui/utils": "/packages/utils/src/index.js",
    "@semantic-ui/query": "/packages/query/src/index.js",
    "@semantic-ui/compiler": "/packages/compiler/src/index.js"
  }
}
</script>
```

Config must set `"resolveBareModules": false` so tachometer doesn't interfere with the import map. `root` points to the monorepo root for serving source files.

### Tachometer bench pattern

Lit's bench harness ([lit/lit `packages/benchmarks`](https://github.com/lit/lit/tree/main/packages/benchmarks)) is the reference for the cycle-loop methodology used here. Same shape on this suite:

1. **One HTML file** — import map + `<script type="module" src="./bench.js">`
2. **One JS file** — imports, setup, all benchmark operations in sequence
3. **`performance.mark()` / `performance.measure()`** — each operation emits a named measure
4. **`flush()`** inside cycle loops — sync drain of pending Reactions, **never `await rAF`**. rAF inside a measured loop gates each iteration on the 16.66ms vsync clock, so 50 cycles wall-clock at ~833ms regardless of work and sub-frame deltas vanish. lit-html benches are fully synchronous in the measured region for the same reason. See `extend-bench-suite` for the full anti-pattern call-out.
5. **`await rAF` only outside measurement** (between metrics, in the `mount()` helper) or as a one-shot tail after a single huge bulk op where the work itself dominates.
6. **Config** — `"mode": "performance"` with `"entryName"` for each measure

```js
// bench.js
import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';

const flush = () => new Promise(r => requestAnimationFrame(r));    // mount/cleanup
const flushWork = () => Reaction.flush();                          // inside loops

// ... setup ...

// One-shot bulk op: work dominates, single rAF tail is fine.
performance.mark('create-1k-start');
el.component.create(1000);
await flush();
performance.measure('create-1k', 'create-1k-start');

// Cycle loop: sync drain per iteration, no rAF.
performance.mark('toggle-10-start');
for (let i = 0; i < 10; i++) {
  el.component.toggle(i);
  flushWork();
}
performance.measure('toggle-10', 'toggle-10-start');
```

```json
{
  "root": "../../../..",
  "resolveBareModules": false,
  "sampleSize": 50,
  "timeout": 3,
  "autoSampleConditions": ["2%"],
  "benchmarks": [{
    "url": "index.html",
    "browser": { "name": "chrome", "headless": true },
    "measurement": [
      { "mode": "performance", "entryName": "create-1k" }
    ]
  }]
}
```

### Tuning knobs

Three config-level knobs shape the confidence/time tradeoff. Pick with intent — defaults baked into tachometer lean toward "resolve everything, even zero-delta noise," which is wall-clock-expensive and produces many unsure verdicts.

- **`sampleSize`** — the mandatory floor of samples tachometer collects before auto-sampling kicks in. Smaller floors are faster but produce wider CIs. 50 is a reasonable default; going below ~30 produces unreliable CIs.
- **`autoSampleConditions`** — the resolution granularity tachometer chases. `["0%"]` asks it to resolve zero-delta metrics to below zero, which cannot converge when the true delta actually is zero — the run then burns its timeout. Choose a threshold slightly above the host's noise floor (a couple of percentage points works as a starting point). This is a **resolution** choice, not an **accuracy** choice — the 95% CI itself is not being relaxed.
- **`timeout`** — per-config wall-clock cap. Lower values cap worst case at the cost of leaving some metrics unresolved; higher values converge more metrics at the cost of CI time. Tune against realistic-delta runs, not zero-delta runs.

Config-tuning decisions interact: sample size floors how narrow a CI can get; `autoSampleConditions` controls whether tachometer keeps sampling once the floor is reached. Raising one without the other often wastes time.

### Expected noise scales with bench duration

A methodology fact worth internalizing: per-sample timing noise on a given host is roughly constant in absolute terms (OS scheduling, GC, JIT jitter — typically sub-millisecond). Relative noise scales *inversely with benchmark duration*.

A 2ms bench and a 50ms bench both absorb roughly the same absolute jitter, but the relative noise looks very different:

| bench duration | expected relative noise floor |
|---|---|
| ~2ms | ±10-20% |
| ~10ms | ±2-5% |
| ~50ms+ | ±1% or tighter |

Consequences:

- **Short benches can't resolve small deltas.** A 2ms bench will never confirm a 3% change at the confidence level because the per-sample noise swamps it. This isn't a tachometer bug; it's physics of the measurement.
- **Don't tune thresholds to what you wish you could detect.** Tune to what the measurement actually supports. Asking for ±1% resolution on a 2ms bench means the metric is permanently "unsure" regardless of sampling time.
- **The in-house reporter exposes this as a per-metric `Expected Noise`** column. When a metric shows Unsure with CI width similar to the expected-noise estimate, the bench is running at its physical floor — more samples don't help. When the CI width is wider than the estimate, the metric is genuinely variable beyond its duration's predicted floor and more samples may resolve it.

### Recognizing the "Challenge the Tests" Failure Mode

When perf investigation gets hard, agents reliably pivot from "diagnose the code" to "question the measurement." This section exists because the pivot happens in nearly every session that uses CI as a baseline, and because specific evidence against it is available.

The failure shape:
1. Investigation doesn't quickly yield a root cause.
2. Agent reframes results as noise, bench design flaws, or measurement instability.
3. Agent proposes changing the test harness rather than the code.

Challenging the harness is sometimes correct. But it requires evidence. Here is the evidence this harness has already produced.

#### "These confident regressions are probably noise"

**The harness has been empirically validated against null changes.** Null PRs (build-tool polish, workflow YAML edits) produce exactly zero confident regressions:

- PR #143 ([comment](https://github.com/Semantic-Org/Semantic-Next/pull/143#issuecomment-4253067182)) — "Build: Reporter polish" — reports `✅ 0 faster · ❌ 0 slower · 🔍 15 unsure · ⚪ 8 no change`
- PR #149 ([bench comment](https://github.com/Semantic-Org/Semantic-Next/pull/149)) — "Build: Discover runs all benchmarkable packages" — reports `✅ 0 faster · ❌ 0 slower · 🔍 18 unsure · ⚪ 13 no change`
- PR #228 ([bench comment](https://github.com/Semantic-Org/Semantic-Next/pull/228)) — "Refactor: Use the signal() factory at internal callsites" — a *bundled hot-path* refactor of `template.js` and `derived.js`, behavior-preserving — reports `✅ 0 faster · ❌ 0 slower`

Three independent null changes, three reports of zero-in-each-confident-bucket. The reporter's "Confidently slower" classification is not prone to false positives on this hardware at 50 samples. #228 is the strongest of the three. It changes the bundled reactive hot path itself, so it also rules out the "any bundle change perturbs V8 and tips a fragile bench" story. Perturbation is falsifiable, and the null series falsifies it.

The reporter does acknowledge the noise floor separately — it has a "Too Fast to Measure Precisely" bucket with per-metric CI width and expected-noise columns. That's where noise-dominated benches land. If a metric is in the *confident* bucket, it has already passed that check.

If a bench is confidently regressed, the regression is real signal regardless of absolute magnitude. Diagnose it.

#### "The regressions keep rotating between benches — that's noise"

Classification can rotate because the CI width straddles the 2% floor differently across runs. The underlying delta does not.

Download `bench-report.json` artifacts for multiple runs:
```bash
gh run download <run_id> -R <owner>/<repo>
```

Compute per-bench means across runs (each artifact has `benchmarks[].samples[]` with 50+ measurements). Real noise produces random-signed deltas around zero. A real regression produces same-signed deltas with a stable central tendency.

Example from PR #148 session: `toggle-middle` showed PR-slower by +11.2%, +8.9%, +11.3% across three consecutive runs. The confidence *classification* fluctuated between runs, but the underlying delta was a stable ~10%. Aggregating artifacts revealed it as real; reading summaries alone would have supported the "rotating noise" interpretation.

This aggregation is minutes of work once the artifacts are downloaded. Do it before concluding the pattern is noise.

#### "Main baseline is drifting between runs — the measurement is unreliable"

Tip-of-tree absolute times often vary 20-100% across runs due to CI-host variance (thermal, noisy neighbors, JIT state). This does not invalidate anything.

Tachometer computes delta within a single run on the same host with interleaved samples. The relevant quantity is `(PR_mean - tip_mean) / tip_mean` per run. Inter-run baseline drift is cancelled by this structure. That main runs 60% faster on Tuesday than Thursday says nothing about whether your PR is faster or slower than main on either day.

#### "Let me scale the bench up to make the signal cleaner"

Valid for some cases, not others:

- **Valid**: A bench in the "Too Fast to Measure Precisely" bucket with ±15% expected noise can't resolve a 3% delta. Scaling 10x moves it into a regime where small real deltas resolve cleanly. Use scaling when you suspect a real small delta underneath high-noise measurement.
- **Not a fix**: A bench in the confident-regressed bucket will remain confidently regressed at 10x scale — only the absolute ms delta grows. Scaling does not erase a real regression; it makes the regression harder to miss.

When proposing a scale change, state up front: which bucket is the bench currently in, what resolution is needed, what the scaling should change. If you find yourself scaling a confident-bucket bench, stop and re-examine the motivation.

#### The general principle

When the harness starts feeling like the enemy, the move is to name the specific property you're challenging, produce evidence that contradicts it, and only then discuss harness changes. The default stance is: the harness is correct, the code has a regression, your job is to find it.

#### The elimination trap

The failure above has a quieter cousin that survives careful tracing. When the obvious suspects are ruled out, the conclusion drifts to whatever could not be falsified (V8 internals, GC, bundle layout, harness noise), and "by elimination it must be X" launders "X is the only thing I couldn't disprove" into "X is what the evidence points to." Those are opposite. A claim that survives because nothing can kill it carries no evidentiary weight.

Two specific errors produce this, both from the PR #229 `clear-completed` investigation:

- **Where code runs is not where its cost shows.** `buildCallParams` runs once per instance at create time, and the create-heavy benches (`create-10k`, `bulk-add-500`) were flat, so it was "ruled out." Wrong. The per-instance structure it built (three `.bind()` closures) was paid later, on teardown and multi-flush paths (`clear-completed` +22%, `add-20` +14%). A create-only bench cannot show a cost paid at teardown, so it does not exonerate create-time code. Map a cost to where it is paid, not to where the statement executes.

- **Magnitude hand-bounds do not exonerate.** "Three binds is a few hundred nanoseconds, it cannot be 8ms, so it must be a second-order V8 effect" was the exact reasoning that justified parking the conclusion in fog. The bisect proved three binds were the entire 8ms. An intuition about how much a construct costs is not evidence. The bench is.

The corrective is mechanical, not clever. When you cannot locate a cost by reading, bisect it: revert only the suspect on the same branch and re-bench. The PR #229 cause was found in one CI cycle by reverting three lines, after extended source reading had concluded "emergent V8 effect, profile-only." A controlled revert is cheaper and more honest than any reading-derived mechanism. If a confident finding resists localization, the next move is another bisect, not a foggier hypothesis.

### Gotchas

**Stale Chrome/chromedriver processes.** Tachometer launches chromedriver and Chrome headless. If a run is killed mid-flight, these processes persist and block the next run. Kill them before retrying:
```bash
pkill -9 chrome; pkill -9 -f chromedriver
```

**`performance` measurement mode is config-only.** The `--measure` CLI flag only accepts `callback`, `fcp`, or `global`. To use `performance.mark()`/`performance.measure()`, you must use a config file with `"mode": "performance"`.

**Component element API.** After `appendChild` + one `requestAnimationFrame`, these are available:

| Property | What it is |
|---|---|
| `el.component` | `createComponent` return value — your methods and computed values |
| `el.template` | Template instance — `el.template.state` for direct state access |
| `el.shadowRoot` | Shadow DOM root — for querying rendered output |

```js
const el = document.createElement('my-component');
document.body.appendChild(el);
await new Promise(r => requestAnimationFrame(r));

el.component.create(1000);              // ✅ call component methods
el.template.state.items.peek();         // ✅ read state directly
el.create(1000);                        // ❌ methods live on el.component, not el
```

**CLI flags can't override config.** `--sample-size`, `--timeout` etc. are rejected when `--config` is used. Set everything in the JSON config file.

**Chrome version must match chromedriver.** Tachometer auto-installs chromedriver on first run. If you upgrade Chrome, delete the cached chromedriver (`node_modules/tachometer/node_modules/chromedriver/`) and let tachometer reinstall it.

---

## Profiling: Where Time Is Spent

Benchmarks measure throughput but can't tell you *which functions or operations* dominate the cost. For that, use V8 profiling via a standalone script.

**Why not profile through vitest or tachometer?** Vitest runs inside vite's transform pipeline in worker isolates. Tachometer runs in Chrome where V8's tick profiler isn't easily accessible. Both bury the actual hot functions in framework overhead. A standalone `profile.js` runs under `node --prof` with no harness noise.

### Profile workflow

```bash
cd packages/<pkg>

# 1. Run under V8 profiler (filter to slow groups)
node --prof bench/profile.js "inline object"

# 2. Process the tick log
node --prof-process isolate-*.log 2>/dev/null | head -80

# 3. Clean up
rm isolate-*.log
```

### Reading profile output

The `[JavaScript]` section is sorted by tick count. Focus on:

| What to look for | What it means |
|---|---|
| `JS: *functionName file:///path:line` | Optimized JS function — `*` means V8 compiled it. High ticks = hot function |
| `RegExp: <pattern>` | Time spent in regex execution. Multiple regex entries = death by a thousand cuts |
| `Builtin: CompileLazy` | V8 compiling functions on the fly — warm-up loop may be too short |
| `Builtin: KeyedLoadIC_Megamorphic` | Polymorphic property access — object shapes are inconsistent |
| `Builtin: ArrayPrototypeShift` | `shift()` in a loop — O(n) per call, consider index-based iteration |
| `Builtin: SetConstructor/Add/Delete` | Set overhead — consider whether the Set is needed per-call |
| High `unaccounted` ticks | Profiling interval too coarse for the workload — increase iterations |

---

## Adding a Tachometer Benchmark to a Package

Follow this recipe when adding component-level benchmarks to a new package.

### Files to create

```
packages/<pkg>/bench/tachometer/
  index.html          ← import map + <script type="module" src="./bench.js">
  bench.js            ← component setup + performance.mark/measure operations
  tachometer.json     ← local config (resolveBareModules: false)
  tachometer-ci.json  ← CI config (same measurements, two benchmarks: this-change + tip-of-tree)
  ci-current.html     ← loads ./dist/current/bench.js (esbuild bundle)
  ci-baseline.html    ← loads ./dist/baseline/bench.js (esbuild bundle)
  build-ci.js         ← esbuild bundler for CI
  dist/.gitignore     ← * !.gitignore
```

### Import map

The import map in `index.html` must list every `@semantic-ui/*` package your bench.js imports (directly or transitively):

```html
<script type="importmap">
{
  "imports": {
    "@semantic-ui/component": "/packages/component/src/index.js",
    "@semantic-ui/renderer": "/packages/renderer/src/index.js",
    "@semantic-ui/reactivity": "/packages/reactivity/src/index.js",
    "@semantic-ui/templating": "/packages/templating/src/index.js",
    "@semantic-ui/templating/template": "/packages/templating/src/template.js",
    "@semantic-ui/utils": "/packages/utils/src/index.js",
    "@semantic-ui/query": "/packages/query/src/index.js",
    "@semantic-ui/compiler": "/packages/compiler/src/index.js"
  }
}
</script>
```

### Adding a new operation

When adding a `performance.measure()` to `bench.js`, add a matching `entryName` to **both** `tachometer.json` and `tachometer-ci.json`. If you forget, the measurement runs but tachometer doesn't report it.

### Component method access

`createComponent` return values live on `el.component`, not on the element itself. After mounting, wait one `requestAnimationFrame` before accessing:

```js
const el = document.createElement('my-component');
document.body.appendChild(el);
await new Promise(r => requestAnimationFrame(r));
el.component.create(1000); // ✅
el.create(1000);           // ❌ TypeError
```

### CI auto-discovery

The benchmarks workflow auto-discovers `tachometer-ci.json` configs. No workflow edits needed when adding a new package — just create the files.

---

## Workflow Steps

### Step 0: Declare Strategy

Before measuring anything, state your approach:

> "Iterating with vitest bench for fast feedback on [target]. Will validate final results with tachometer."

Or for component-level work:

> "Using tachometer directly for [target] since it involves DOM rendering."

This prevents wasting cycles on the wrong tool — profile.js numbers that look conclusive but aren't, or vitest bench numbers that get committed without tachometer validation.

### Step 1: Audit

Spawn one agent per source file. Each agent reads the file and reports performance footguns on the happy path — unnecessary allocations, repeated work, O(n²) complexity, closure captures in hot loops, patterns that defeat V8 optimizations.

Agents should NOT flag:
- Unusual/edge-case code paths with exotic settings
- Micro-optimizations below flame chart threshold
- Style or readability concerns
- Development-only code paths (guarded by `isDevelopment`)

Compile results into a table: file, function, issue, severity (high/medium/low).

### Step 2: Prioritize

Rank findings by impact. Discuss with the user before implementing — some findings may be intentional tradeoffs.

General priority order:
1. **Signal/reactivity hot path** — runs on every state change
2. **Render/expression hot path** — runs on every template expression every render
3. **Frequently called utilities** — type checks, iteration, string conversions
4. **Batch operations** — search, formatting, date parsing

### Step 3: Trace

Before optimizing, profile the slow groups to identify the dominant cost. This prevents wasted effort — without tracing, you're guessing which part of a function to optimize.

If a single function dominates (>30% of JS ticks), optimize that function. If ticks are spread across many small operations (regex, builtins, property access), the optimization is structural — caching, fewer passes, or a different algorithm.

**Re-trace after each optimization round.** The dominant cost shifts as you fix things.

### Step 4: Add Test Coverage

Before optimizing, verify test coverage for the functions being changed. Add tests for any untested behavior. All tests must pass after every change.

### Step 5: Implement and Iterate

The cycle per round:
1. **Trace** — `node --prof bench/profile.js "group"` → identify dominant cost
2. **Implement** — target that cost
3. **Quick check** — `npm run bench` (vitest) for fast feedback during iteration
4. **Test** — `npm run test` to confirm correctness
5. **Repeat** until diminishing returns (expect 2-3 rounds)

Use vitest bench for fast iteration feedback. Do not treat vitest bench numbers as final — they are directional, not authoritative.

### Step 6: Validate with Tachometer

Once the optimization is stable and tests pass, validate with tachometer. This is the authoritative measurement with statistical confidence intervals — every committed performance claim must be backed by tachometer results.

**Check first — can this host run tachometer?**

```sh
grep -qi microsoft /proc/version && echo "WSL2 — push to CI" || echo "Native Linux/Mac — local works"
```

WSL2 is a known dead end (selenium-spawned chromedriver crashes with `ECONNREFUSED` before binding its HTTP port). On WSL2, push to a draft PR and use the bench-bot comment as your validation. On native Linux or macOS, run locally.

**Local before/after comparison.** Tachometer's `build-ci.js` produces two bundles — `dist/current/` from your working tree and `dist/baseline/` from main. The config compares them in one round-robin session, eliminating thermal/GC/JIT bias:

```sh
cd packages/<pkg>/bench/tachometer
node build-ci.js current               # your working tree
node build-ci.js baseline              # checks out main, builds, restores tree
npx tachometer --config tachometer-ci-<suite>.json
```

**Run a single suite, not the whole battery.** Each `tachometer-ci-*.json` covers one suite (krausest, todo, template, signal, hydrate). Pass the one you actually changed:

```sh
npx tachometer --config tachometer-ci-template.json
```

CLI overrides for iteration speed (don't ship tuned numbers — these are for shaping, not committing):

| CLI flag | Use for |
|---|---|
| `--sample-size=30` / `-n 30` | Faster passes during iteration. Below 30 → don't trust the CI |
| `--timeout=2` | Cap wall-clock per config (default 3 min auto-sample) |
| `--auto-sample-conditions=0%` | Zero-delta dry runs converge fastest with `0%` |
| `--json-file=out.json` | Save raw output to inspect offline |

**Reading the output.** Tachometer prints a per-metric verdict: `faster`, `slower`, `unsure`, or `no change`, with the 95% CI for percent-delta. Verdict definitions match the bench-bot's PR comment — see the `read-ci-reports` skill. Two things specifically to check:

- Confidence interval **width** as a percent of the mean. That's your local noise floor for each metric.
- Whether the verdict matches your hypothesis. A `faster` verdict at the magnitude you expected is the signal. `unsure` with a CI tight to the noise floor means the bench is too short to resolve the change at this scale — amplify the workload (more iterations) or measure something else.

**Don't substitute other tools.** Playwright, vitest bench, and direct Chrome runs all skip tachometer's round-robin sampling and convergence checks. Numbers from those tools are iteration-grade signal and never authoritative.

### Step 7: Clean Up

1. Delete any leftover `isolate-*.log` files
2. Delete `bench/.baseline.json` if present
3. Delete `bench/baseline/` contents if Strategy 2 was used during iteration
4. Run the full test suite to confirm green
5. Commit with `Perf:` prefix per repository conventions

---

## Quick Reference

### vitest bench (iteration)

```bash
cd packages/<pkg>

npm run bench                                    # Run all micro-benchmarks
npm run bench -- --outputJson bench/.baseline.json  # Save for comparison
npm run bench -- --compare bench/.baseline.json     # Compare after changes
```

### profile.js (tracing)

```bash
cd packages/<pkg>

node bench/profile.js                    # Run all groups
node bench/profile.js "inline object"    # Filter to group
node --prof bench/profile.js "group"     # V8 tick profiling
node --prof-process isolate-*.log 2>/dev/null | head -80
rm isolate-*.log
```

### tachometer (committed measurement)

WSL2 is a dead end — push to CI. On native Linux/macOS:

```bash
cd packages/<pkg>/bench/tachometer
node build-ci.js current
node build-ci.js baseline
npx tachometer --config tachometer-ci-<suite>.json
# Iteration overrides: -n 30 / --timeout=2 / --auto-sample-conditions=0%
# (don't ship tuned numbers; the JSON config is the committed config)
```

The component-level battery (krausest/todo/template/hydrate) lives in `packages/component/bench/tachometer/`; run a suite with the per-suite invocation above against its `tachometer-ci-<suite>.json`.

## Packages with Bench Infrastructure

| Package | vitest bench | profile.js | tachometer | Notes |
|---------|-------------|------------|------------|-------|
| `packages/utils` | `bench/` | — | — | Bench files covering equality, objects, cloning, strings, types, crypto |
| `packages/reactivity` | `bench/` | — | `bench/tachometer/` | Reaction, Dependency, Scheduler benchmarks; signal tachometer |
| `packages/renderer` | `bench/` | `bench/profile.js` | `bench/tachometer/` | Expression evaluator, V8 profiling; renderer micros + signature tachometer |
| `packages/component` | — | — | `bench/tachometer/` | Component-level tachometer battery: krausest, todo, template, hydrate |
| `packages/compiler` | — | — | `bench/tachometer/` | Compiler micros tachometer |

## Related Workflows

| Workflow | Command | Use when... |
|---------|---------|-------------|
| **Autoresearch Perf Regressions** | `autoresearch-perf` | Running an autonomous hypothesis-test-measure loop on a regression set whose root cause isn't obvious. The autonomous variant of this workflow. |
| **Design Util Function** | `design-util-function` | Creating a new utility from scratch |
| **Add Util Function** | `add-util-function` | Adding tests, types, docs for a new utility |
| **Testing** | `testing` | Understanding test environments and conventions |
