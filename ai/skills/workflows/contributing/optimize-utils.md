---
title: Optimize Utils Performance
description: Workflow for profiling, optimizing, and validating performance improvements to @semantic-ui/utils functions with A/B benchmarking against a baseline.
keywords: [performance, optimization, benchmarks, vitest bench, V8, flame chart, utils]
audience: contributing
type: workflow
workflow: optimize-utils
---

# AI Workflow: Optimizing Utils Performance

**A rigorous audit → fix → measure cycle for `@semantic-ui/utils`**

This workflow produces measurable performance improvements with A/B benchmarks proving each change. It uses `bench/baseline/` as an ephemeral directory for reference implementations that are compared against optimized code in the same vitest bench process — same warmup, same thermal conditions, same V8 JIT state.

## Design Principles

- **Measure, don't guess.** Every optimization must be A/B benchmarked against the baseline implementation. "An agent thinks this is faster" is not evidence.
- **Realistic data shapes.** Benchmark inputs should mirror real component settings, state objects, and attribute names — not `{a:1}` toy objects. V8 optimizes differently for different object shapes.
- **Same-process comparison.** Never compare sequential runs. Baseline and optimized implementations run in the same `vitest bench` process so they share identical JIT, GC, and thermal conditions. This eliminates reward hacking from run-order effects.
- **Hot paths first.** Focus on functions that appear in flame charts during component rendering, signal dirty-checking, and SSR. Formatting utilities and error paths are low priority.
- **Algorithmic wins over micro-optimizations.** Cache expensive constructors, eliminate O(n²), remove per-call allocations. Skip changes that save nanoseconds but cost readability.

## Step 1: Audit

Spawn one agent per source file in `packages/utils/src/`. Each agent reads the file and reports performance footguns on the happy path — unnecessary allocations, repeated work, O(n²) complexity, closure captures in hot loops, patterns that defeat V8 optimizations.

Agents should NOT flag:
- Unusual/edge-case code paths with exotic settings
- Micro-optimizations below flame chart threshold
- Style or readability concerns

Compile results into a table: file, function, issue, severity (high/medium/low).

## Step 2: Prioritize

Rank findings by impact:
1. **Signal hot path** — `isEqual`, reactivity-adjacent code
2. **Render hot path** — `clone`, `deepExtend`, `get`, CSS adoption
3. **Frequently called** — type checks, `each`, string conversions
4. **Batch operations** — search, formatting, date parsing

Discuss findings with the user before implementing. Some findings may be intentional tradeoffs.

## Step 3: Capture Baseline

Before making any changes, copy the current implementation of each function you plan to optimize into `bench/baseline/`:

```bash
# Copy from main branch (or current branch if baseline isn't on main yet)
git show main:packages/utils/src/equality.js > packages/utils/bench/baseline/equality.js
```

Rename exports to avoid conflicts:

```js
// bench/baseline/equality.js
export const isEqualBaseline = (a, b, ...) => { ... };
```

The `bench/baseline/` directory is gitignored — these files are ephemeral.

## Step 4: Add Test Coverage

Before optimizing, verify test coverage for the functions being changed. Add tests for any untested behavior — especially:

- Options/flags that affect the code path being optimized
- Edge cases at the boundary of the optimization (empty inputs, single-element collections)
- The specific code path the optimization targets

Run tests against the **current** (pre-optimization) code to confirm they pass:

```bash
cd packages/utils && npm test
```

All 22 test files must pass across node, jsdom, and browser environments. If any test fails, investigate — never dismiss failures.

## Step 5: Write A/B Benchmarks

Update or create bench files that import both implementations:

```js
import { isEqual } from '../src/equality.js';
import { isEqualBaseline } from './baseline/equality.js';

describe('shallow equal — 10-key settings', () => {
  bench('baseline', () => { isEqualBaseline(settingsA, settingsB); });
  bench('optimized', () => { isEqual(settingsA, settingsB); });
});
```

### Data shape guidelines

Use realistic inputs declared **outside** the bench callback (prevents constant-folding):

| Function | Realistic input |
|----------|----------------|
| `isEqual` | 10-key component settings object, nested state with arrays |
| `clone` | Component settings, nested state with Date/RegExp |
| `deepExtend` | Defaults merged with user overrides |
| `get` | 3-4 level dotted paths into component state |
| `escapeHTML` | Template text with and without special characters |
| `hashCode` | CSS strings of varying length |

## Step 6: Implement and Measure

Make the optimization. Run the A/B benchmark:

```bash
cd packages/utils && npm run bench
```

The summary shows `Nx faster than baseline` for each group. Record the results.

**Minimum threshold:** An optimization should show at least **5% improvement** on its target scenario to justify the code change. Below that, measurement noise dominates and the change may not be a real win.

Run the full test suite after every change:

```bash
cd packages/utils && npm test
```

## Step 7: Iterate

If the audit found multiple issues, repeat Steps 3-6 for each. After fixing obvious issues, re-audit — deeper optimizations often become visible only after the dominant cost is removed. The initial audit may run 2-3 rounds.

## Step 8: Clean Up

After all optimizations are confirmed:

1. **Delete `bench/baseline/`** contents (the `.gitignore` stays)
2. **Restore bench files** to their non-A/B form (remove baseline imports and comparison groups)
3. **Run the bench suite** one final time to establish the new absolute baseline numbers
4. **Run the full test suite** to confirm everything is green
5. **Commit** with `Perf:` prefix per repository conventions

## Running Benchmarks

```bash
cd packages/utils

# Run all benchmarks
npm run bench

# Run a specific bench file
npx vitest bench --config vitest.bench.config.js bench/equality.bench.js
```

## Benchmark File Locations

```
packages/utils/
  bench/
    baseline/           ← Ephemeral: reference implementations (gitignored)
      .gitignore        ← Ignores everything except itself
    equality.bench.js   ← isEqual scenarios
    objects.bench.js    ← deepExtend, get, weightedObjectSearch
    cloning.bench.js    ← clone scenarios
    strings.bench.js    ← camelToKebab, kebabToCamel, escapeHTML
    types.bench.js      ← isEmpty, type checks
    crypto.bench.js     ← hashCode, tokenize
  vitest.bench.config.js
```

## Related Workflows

| Workflow | Command | Use when... |
|---------|---------|-------------|
| **Design Util Function** | `design-util-function` | Creating a new utility from scratch |
| **Add Util Function** | `add-util-function` | Adding tests, types, docs for a new utility |
| **Testing** | `testing` | Understanding test environments and conventions |
