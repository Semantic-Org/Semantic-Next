---
title: Improve Performance
description: Workflow for auditing, profiling, optimizing, and validating performance improvements across any package using vitest bench, V8 profiling, and two benchmarking strategies.
keywords: [performance, optimization, benchmarks, profiling, vitest bench, V8, node --prof, audit, A/B testing, trace]
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

## Two Benchmarking Strategies

Choose the strategy that fits the code being optimized. Using the wrong one produces misleading results.

### Strategy 1: Sequential compare (default)

Save benchmark results before changes, compare after. This is the **common case** — use it for any code where stubbing a fair baseline is complex.

```bash
# Before changes — save numbers
npm run bench -- --outputJson bench/.baseline.json

# Make changes, run tests

# After — compare against saved run
npm run bench -- --compare bench/.baseline.json
```

| | |
|---|---|
| **Use when** | Classes are coupled (reactivity, renderer, component), or the function depends on shared module state |
| **Strength** | No stub maintenance, measures the real integrated system |
| **Weakness** | Sequential runs have thermal/GC/JIT noise between them |
| **Minimum delta** | **10%** — below this, noise dominates and the result is not trustworthy |

### Strategy 2: Same-process A/B (when stubs are simple)

Copy the pre-change implementation to `bench/baseline/`, rename exports, run both in the same bench process. Both implementations share identical JIT warmup, thermal conditions, and GC pressure.

```js
import { isEqual } from '../src/equality.js';
import { isEqualBaseline } from './baseline/equality.js';

describe('shallow equal — 10-key settings', () => {
  bench('baseline', () => { isEqualBaseline(settingsA, settingsB); });
  bench('optimized', () => { isEqual(settingsA, settingsB); });
});
```

| | |
|---|---|
| **Use when** | Pure/isolated functions (utils, expression evaluator) where copying the baseline is a simple rename with no dependency rewiring |
| **Strength** | Same JIT/thermal/GC conditions — eliminates run-order bias |
| **Weakness** | Stub fidelity — if the baseline setup differs from the optimized setup, results are poisoned |
| **Minimum delta** | **5%** — same-process comparison has a lower noise floor |

### How to tell which to use

Ask: **can I copy the function into `bench/baseline/`, rename the export, and have it work with zero dependency changes?**

- **Yes** → Strategy 2 (A/B). Utils functions, standalone helpers, pure transforms.
- **No** → Strategy 1 (compare). Classes with cross-references, code that depends on shared singletons (Scheduler.current), code that imports from its own package.

**`packages/utils` always uses Strategy 2.** Every function is a pure export with no shared mutable state — copying to `bench/baseline/` with a renamed export is trivial. The A/B approach gives the tightest measurements here because utils functions are fast (500k+ ops/sec) where sequential noise would dominate.

---

## Two Tools, Two Jobs

Each tool answers a different question. Using the wrong one produces misleading results.

| | **vitest bench** | **profile.js** |
|---|---|---|
| **Question** | "How fast?" (ops/sec) | "Where is time spent?" (tick breakdown) |
| **Use for** | Measuring throughput, comparing before/after | Identifying hot functions, regex costs, allocation patterns |
| **Strength** | Thousands of samples, statistical rme%, handles variance | Clean V8 data with no framework noise |
| **Weakness** | Can't tell you *why* something is slow | Single-trial — unsuitable for A/B measurement |
| **Minimum delta** | 5-10% depending on strategy | Not applicable — not a measurement tool |

**Do not use profile.js for A/B comparisons.** It runs a single trial — variance between runs is ±5-10%, which swallows small changes. Use it only for tracing (with `node --prof`) and for quick sanity checks during iteration.

**Do not use vitest bench for profiling.** It runs inside vite's worker pool. V8 tick data is buried in framework overhead.

## Profiling: Where Time Is Spent

Vitest bench measures throughput but can't tell you *which functions or operations* dominate the cost. For that, you need V8 profiling via a standalone script.

**Why not profile through vitest?** Vitest bench runs inside vite's transform pipeline in worker isolates. The profile data is buried in framework overhead — vite module transforms, sourcemap codec, worker IPC — and the actual hot functions don't even register above the noise floor.

Each package has a standalone `bench/profile.js` that imports the module directly and runs tight loops with no harness overhead. Run it under `node --prof` and process the tick log into agent-readable text.

### Profile workflow

```bash
cd packages/<pkg>

# 1. Run under V8 profiler (filter to slow groups)
node --prof bench/profile.js "inline object"

# 2. Process the tick log — single isolate, no workers
node --prof-process isolate-*.log > bench/.profile.txt

# 3. Read the output — top functions by tick count
head -80 bench/.profile.txt

# 4. Clean up
rm isolate-*.log bench/.profile.txt
```

The `[JavaScript]` section of `--prof-process` output lists every function and regex by tick count. For the expression evaluator, this revealed that six different regex operations account for more time than the actual evaluation logic — something invisible from benchmark numbers alone.

### Profile script pattern

Profile scripts mirror the same data/helpers as the bench file but run a simple timed loop. They support an optional CLI filter to narrow to specific expression groups.

```js
import { TargetModule } from '../src/target.js';

const ITERATIONS = 500_000;

// Same realistic data as bench file
const data = { /* ... */ };

const groups = {
  'fast path':  [/* inputs that exercise the fast path */],
  'slow path':  [/* inputs that exercise the slow path */],
};

const filter = process.argv[2]?.toLowerCase();
const instance = new TargetModule(data);

// Warm up — let V8 optimize before profiling
for (const [, inputs] of Object.entries(groups)) {
  for (const input of inputs) {
    for (let i = 0; i < 1000; i++) instance.run(input);
  }
}

for (const [name, inputs] of Object.entries(groups)) {
  if (filter && !name.toLowerCase().includes(filter)) continue;
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    for (let j = 0; j < inputs.length; j++) {
      instance.run(inputs[j]);
    }
  }
  const ms = (performance.now() - start).toFixed(1);
  const total = ITERATIONS * inputs.length;
  const opsPerSec = ((total / (ms / 1000)) / 1000).toFixed(0);
  console.log(`${name.padEnd(22)} ${ms.padStart(8)}ms  ${opsPerSec.padStart(8)}K ops/s`);
}
```

Key details:
- **Warm-up loop** runs each input 1000 times before the timed section so V8 has JIT-compiled the hot functions. Without this, the profile is dominated by `CompileLazy`.
- **Groups with filter** let you zoom into one category (`node --prof bench/profile.js "inline"`) so the tick log isn't diluted across fast and slow paths.
- **No test framework imports.** The script must be runnable with plain `node` — any import that pulls in vite/vitest contaminates the profile.

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

## Step 1: Scaffold

If the package doesn't have bench infrastructure yet:

```bash
mkdir -p packages/<pkg>/bench/baseline
```

Create `bench/baseline/.gitignore`:
```
*
!.gitignore
!README.md
```

Create `vitest.bench.config.js`:
```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      include: ['bench/**/*.bench.js'],
    },
  },
});
```

Add to `package.json` scripts:
```json
"bench": "vitest bench --config vitest.bench.config.js"
```

Create `bench/profile.js` following the profile script pattern above. This is the standalone profiling entry point — it should import the module directly, define the same realistic data as the bench file, and run timed loops with group filtering.

## Step 2: Audit

Spawn one agent per source file. Each agent reads the file and reports performance footguns on the happy path — unnecessary allocations, repeated work, O(n²) complexity, closure captures in hot loops, patterns that defeat V8 optimizations.

Agents should NOT flag:
- Unusual/edge-case code paths with exotic settings
- Micro-optimizations below flame chart threshold
- Style or readability concerns
- Development-only code paths (guarded by `isDevelopment`)

Compile results into a table: file, function, issue, severity (high/medium/low).

### Audit prompt template

```
Read `/path/to/file.js` in full.

[Brief description of what this file does and why it's hot.]

Audit for performance footguns on the happy path — things that would show up
in flame charts during common usage.

Focus on:
- Unnecessary allocations in hot paths
- Repeated work that could be cached/memoized
- O(n²) or worse algorithmic complexity
- Expensive operations done eagerly when lazy would suffice
- Closure captures that prevent GC or cause megamorphic call sites
- Patterns that defeat V8 optimizations

Do NOT flag:
- Unusual/edge-case code paths with exotic settings
- Micro-optimizations below flame chart threshold
- Style or readability concerns

Report: function name, lines, issue, severity, suggestion. Under 300 words.
```

## Step 3: Prioritize

Rank findings by impact. Discuss with the user before implementing — some findings may be intentional tradeoffs.

General priority order:
1. **Signal/reactivity hot path** — runs on every state change
2. **Render/expression hot path** — runs on every template expression every render
3. **Frequently called utilities** — type checks, iteration, string conversions
4. **Batch operations** — search, formatting, date parsing

## Step 4: Choose and Declare Measurement Strategy

Before capturing a baseline, explicitly state which benchmarking strategy you are using and why it is the right choice for this code. This prevents wasting iteration cycles on unreliable comparisons.

State: **"Using Strategy [1/2] because [reason]."**

Decision checklist:
- Can the function be copied to `bench/baseline/` with zero dependency rewiring? → **Strategy 2**
- Does it depend on shared state, cross-references, or package internals? → **Strategy 1**
- Is the expected improvement <10%? → **Strategy 2** (lower noise floor) or skip (below measurable threshold)

**Do not use profile.js timing output for A/B comparisons.** It runs a single trial — variance swallows changes under 10%. Profile scripts are for tracing (identifying *where* time goes), not measuring *how much* faster.

**Strategy 1:** Save benchmark output before making changes:
```bash
cd packages/<pkg> && npm run bench -- --outputJson bench/.baseline.json
```

**Strategy 2:** Copy implementations to `bench/baseline/`, rename exports. The `bench/baseline/` directory is gitignored.

## Step 5: Add Test Coverage

Before optimizing, verify test coverage for the functions being changed. Add tests for any untested behavior. Run tests against the current code to confirm they pass:

```bash
cd packages/<pkg> && npm test
```

All tests must pass across all environments. If any test fails, investigate — never dismiss failures.

## Step 6: Write Benchmarks

Create bench files with realistic data shapes declared outside the bench callback (prevents constant-folding by V8). Each bench file covers one source module.

For Strategy 2, include both baseline and optimized in the same `describe` block. For Strategy 1, just bench the current code — comparison happens via `--compare`.

## Step 7: Trace

Before optimizing, profile the slow groups to identify the dominant cost. This prevents wasted effort — without tracing, you're guessing which part of a function to optimize.

```bash
cd packages/<pkg>

# Run with profiling, filtered to the slow group
node --prof bench/profile.js "slow group name"

# Process into readable text
node --prof-process isolate-*.log 2>/dev/null | head -80

# Clean up tick logs
rm isolate-*.log
```

Read the `[JavaScript]` section and identify:
1. **The top 3-5 functions by tick count** — these are the optimization targets
2. **Regex entries** — each regex that appears is a separate cost; multiple regexes on the hot path compound
3. **Builtin entries** — `ArrayPrototypeShift`, `SetConstructor`, `CompileLazy` etc. point to specific code patterns to eliminate

If a single function dominates (>30% of JS ticks), optimize that function. If ticks are spread across many small operations (regex, builtins, property access), the optimization is structural — caching, fewer passes, or a different algorithm.

**Re-trace after each optimization round.** The dominant cost shifts as you fix things. What was #3 before may become #1 after fixing #1 and #2.

## Step 8: Implement and Measure

Make the optimization. Run benchmarks:

```bash
# Strategy 1
cd packages/<pkg> && npm run bench -- --compare bench/.baseline.json

# Strategy 2
cd packages/<pkg> && npm run bench
```

Run the full test suite after every change:
```bash
cd packages/<pkg> && npm test
```

## Step 9: Iterate

After fixing obvious issues, **re-trace and re-audit**. The dominant cost shifts after each round — what was buried at 0.3% of ticks may become the new #1 after fixing the top offender.

The cycle per round is:
1. **Trace** — `node --prof bench/profile.js "group"` → process → read top functions
2. **Optimize** — target the dominant cost identified by the trace
3. **Bench** — confirm measurable improvement in ops/sec
4. **Test** — confirm correctness

Spawn fresh audit agents on modified files. Expect 2-3 rounds before convergence.

## Step 10: Clean Up

After all optimizations are confirmed:

1. Delete `bench/baseline/` contents (the `.gitignore` and `README.md` stay)
2. If Strategy 2 was used, restore bench files to their non-A/B form
3. Delete `bench/.baseline.json` if present
4. Delete any leftover `isolate-*.log` files
5. Run the bench suite one final time to establish new absolute numbers
6. Run the full test suite to confirm green
7. Commit with `Perf:` prefix per repository conventions

## Running Benchmarks

```bash
cd packages/<pkg>

# Run all benchmarks
npm run bench

# Run a specific bench file
npx vitest bench --config vitest.bench.config.js bench/signal.bench.js

# Save baseline for sequential compare
npm run bench -- --outputJson bench/.baseline.json

# Compare against saved baseline
npm run bench -- --compare bench/.baseline.json
```

## Running Profiles

```bash
cd packages/<pkg>

# Run all groups (prints timing summary)
node bench/profile.js

# Filter to specific group
node bench/profile.js "inline object"

# Profile with V8 tick log
node --prof bench/profile.js "inline object"

# Process tick log into text (redirect stderr to hide warnings)
node --prof-process isolate-*.log 2>/dev/null | head -80

# Clean up
rm isolate-*.log
```

## Packages with Bench Infrastructure

| Package | Bench dir | Profile | Notes |
|---------|-----------|---------|-------|
| `packages/utils` | `bench/` | — | 6 bench files covering equality, objects, cloning, strings, types, crypto |
| `packages/reactivity` | `bench/` | — | Reaction, Dependency, Scheduler benchmarks |
| `packages/renderer` | `bench/` | `bench/profile.js` | Expression evaluator benchmarks + standalone profiling |

## Related Workflows

| Workflow | Command | Use when... |
|---------|---------|-------------|
| **Design Util Function** | `design-util-function` | Creating a new utility from scratch |
| **Add Util Function** | `add-util-function` | Adding tests, types, docs for a new utility |
| **Testing** | `testing` | Understanding test environments and conventions |
