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

Follow the pattern from [lit's benchmarks](https://github.com/nicolo-ribaudo/nicolo-ribaudo.github.io/tree/HEAD/nicolo-ribaudo.github.io/src/assets):

1. **One HTML file** — import map + `<script type="module" src="./bench.js">`
2. **One JS file** — imports, setup, all benchmark operations in sequence
3. **`performance.mark()` / `performance.measure()`** — each operation emits a named measure
4. **`requestAnimationFrame`** — wait for render completion between operations
5. **Config** — `"mode": "performance"` with `"entryName"` for each measure

```js
// bench.js
import { defineComponent } from '@semantic-ui/component';

// ... setup ...

performance.mark('create-1k-start');
el.component.create(1000);
await new Promise(r => requestAnimationFrame(r));
performance.measure('create-1k', 'create-1k-start');
```

```json
{
  "root": "../../../..",
  "resolveBareModules": false,
  "benchmarks": [{
    "url": "index.html",
    "browser": { "name": "chrome", "headless": true },
    "measurement": [
      { "mode": "performance", "entryName": "create-1k" }
    ]
  }]
}
```

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

## Workflow Steps

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

Once the optimization is stable and tests pass, validate with tachometer:

```bash
npm run bench:component
```

This produces the authoritative measurement with statistical confidence intervals. Only commit performance claims backed by tachometer results.

For before/after comparison, run tachometer with two benchmark URLs in the same session — it round-robins to eliminate run-order bias.

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

```bash
cd packages/renderer

npm run bench:component    # Run all component operations via tachometer config
```

## Packages with Bench Infrastructure

| Package | vitest bench | profile.js | tachometer | Notes |
|---------|-------------|------------|------------|-------|
| `packages/utils` | `bench/` | — | — | 6 bench files covering equality, objects, cloning, strings, types, crypto |
| `packages/reactivity` | `bench/` | — | — | Reaction, Dependency, Scheduler benchmarks |
| `packages/renderer` | `bench/` | `bench/profile.js` | `bench/tachometer/` | Expression evaluator, V8 profiling, component-level benchmarks |

## Related Workflows

| Workflow | Command | Use when... |
|---------|---------|-------------|
| **Design Util Function** | `design-util-function` | Creating a new utility from scratch |
| **Add Util Function** | `add-util-function` | Adding tests, types, docs for a new utility |
| **Testing** | `testing` | Understanding test environments and conventions |
