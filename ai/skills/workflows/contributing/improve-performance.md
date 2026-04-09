---
title: Improve Performance
description: Workflow for auditing, optimizing, and validating performance improvements across any package using vitest bench with two benchmarking strategies.
keywords: [performance, optimization, benchmarks, vitest bench, V8, flame chart, audit, A/B testing]
audience: contributing
type: workflow
workflow: improve-performance
---

# AI Workflow: Improve Performance

**A rigorous audit → fix → measure cycle for any package**

This workflow produces measurable performance improvements validated by benchmarks. It applies to any package in the monorepo — utils, reactivity, renderer, templating, etc.

## Design Principles

- **Measure, don't guess.** Every optimization must be benchmarked against the pre-change baseline. "An agent thinks this is faster" is not evidence.
- **Realistic data shapes.** Benchmark inputs should mirror real component settings, state objects, and attribute names — not `{a:1}` toy objects. V8 optimizes differently for different object shapes.
- **Hot paths first.** Focus on functions that appear in flame charts during component rendering, signal dirty-checking, and SSR. Formatting utilities and error paths are low priority.
- **Algorithmic wins over micro-optimizations.** Cache expensive constructors, eliminate O(n²), remove per-call allocations. Skip changes that save nanoseconds but cost readability.
- **Iterate.** Re-audit after fixing the first round of issues. Deeper optimizations become visible only after the dominant cost is removed — it often takes 2-3 rounds to converge.

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

## Step 1: Scaffold

If the package doesn't have bench infrastructure yet:

```bash
mkdir -p packages/<pkg>/bench/baseline
```

Create `bench/baseline/.gitignore`:
```
*
!.gitignore
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

## Step 4: Capture Baseline

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

## Step 7: Implement and Measure

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

## Step 8: Iterate

After fixing obvious issues, **re-audit**. Spawn fresh agents on the modified files. Deeper optimizations often become visible only after the dominant cost is removed. Expect 2-3 rounds before convergence.

## Step 9: Clean Up

After all optimizations are confirmed:

1. Delete `bench/baseline/` contents (the `.gitignore` stays)
2. If Strategy 2 was used, restore bench files to their non-A/B form
3. Delete `bench/.baseline.json` if present
4. Run the bench suite one final time to establish new absolute numbers
5. Run the full test suite to confirm green
6. Commit with `Perf:` prefix per repository conventions

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

## Packages with Bench Infrastructure

| Package | Bench dir | Notes |
|---------|-----------|-------|
| `packages/utils` | `bench/` | 6 bench files covering equality, objects, cloning, strings, types, crypto |
| `packages/reactivity` | `bench/` | Reaction, Dependency, Scheduler benchmarks |

## Related Workflows

| Workflow | Command | Use when... |
|---------|---------|-------------|
| **Design Util Function** | `design-util-function` | Creating a new utility from scratch |
| **Add Util Function** | `add-util-function` | Adding tests, types, docs for a new utility |
| **Testing** | `testing` | Understanding test environments and conventions |
