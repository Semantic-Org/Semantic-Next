---
title: Investigating Performance Regressions
description: The flow that produces real diagnoses for perf regressions in this codebase — from CI bench reports to Chrome DevTools traces to counter instrumentation. Covers the dead ends to avoid (static reading, hidden-class hypotheses without verification, bench-file edits that get overlaid away) and the techniques that actually localize root cause.
keywords: [performance investigation, perf regression, chrome devtools, MCP profile, counter instrumentation, tachometer local, fresh-take, V8 profiling, bench harness, reactive call count]
audience: contributing
skill: investigate-performance
type: skill
---

# Investigating Performance Regressions

> **Skill:** `investigate-performance`
> **Purpose:** The flow that actually produces root cause for perf regressions on this codebase. Static reading and theorizing fail repeatedly. Use this as the order of operations.

**Golden rule: profile before you theorize.** A Chrome DevTools trace + a few injected counters localize the mechanism in minutes. Reading framework source files trying to derive why something is slow burns hours and converges on plausible-sounding wrong answers. Start with measurement.

---

## When to Reach for This Skill

The bench bot reports a confident regression on a PR (`/read-bench-report` shows it in the ❌ Slower bucket). You've ruled out noise (CIs are tight, multiple runs reproduce). The CI bench delta is real — now you need to know *why*.

This skill is for that *why* phase, not the *did it regress* phase.

---

## The Flow That Works

```
1. Identify the bench targets (weighted)                  → /read-bench-report
2. Read the relevant V8 skills FIRST                      → ground claims against current engine behavior
3. Capture Chrome traces, PR vs main, of one bench        → chrome-devtools MCP
4. Diff hot functions (inclusive + exclusive self-time)   → identify suspects
5. Inject counters into the bundle                        → tell more-calls vs slower-per-call
6. Repeat with a tighter hypothesis                       → bisect into the framework path
7. Spawn /fresh-take subagents if static reasoning loops  → escape solution momentum
```

Steps 3-5 are the breakthrough. Each step is cheap (~5-10 minutes) and produces empirical signal.

---

## Step 1 — Identify Targets With Weights

Not all regressions are equal. The PR author or maintainer has weights. Typical pattern in this codebase:

| package suite | weight | rationale |
|---|---:|---|
| `krausest` | 5× | js-framework-benchmark, headline external comparison |
| `todo`, `template`, `hydrate` | 1× | end-user workloads |
| `signal`, `compiler-micros`, `renderer-micros` | 0.25× | internal microbenches, useful but not user-facing |

Build a target table: bench name, weight, **PR-vs-main delta in percentage points**. Order by weight × magnitude. Investigate the heaviest first; stop when remaining gaps are noise-floor adjacent (~±4% on short benches).

**Do not** burn cycles on borderline-noise regressions — `/read-bench-report` documents the noise-floor envelope per duration.

---

## Step 2 — Ground Claims Against Current V8 Behavior

Before reasoning about *why* a regression exists, read these:

- `performance-v8-overview` — tier model context
- `performance-v8-object-model` — hidden classes, IC monomorphic/poly/megamorphic, allocation site dedup (this skill specifically debunks "objects from different source locations are different shapes", which is a common wrong intuition)
- `performance-v8-memory` — GC generations, young-gen is cheap, Proxy is not specialized
- `performance-v8-stale-advice` — the firewall against pre-2022 V8 folklore (object.freeze speed, try/catch deopts, blanket monomorphism cargo culting)
- `performance-v8-compilation` — feedback stability, deopt triggers, what Maglev/Turbofan inline

These exist precisely because agents bring incorrect priors from training data. **Cite them when making claims.** When you find yourself reasoning about V8 IC behavior without a citation, stop and verify.

A common failure mode: an agent forms a hidden-class polymorphism hypothesis, then proceeds for ~30 minutes building elaborate theory around it. The object-model skill explicitly says "two `{a:1, b:2}` literals at different lines share a shape." Reading that one paragraph would have prevented the entire detour.

---

## Step 3 — Capture Chrome DevTools Traces

The chrome-devtools MCP server lets you capture a full V8 sampling trace from inside the conversation. This is the single most informative tool in this flow.

**Setup:**

1. Build the bench bundles you want to compare. `current` is your working tree (the PR change), `baseline` is the same tree with the change reverted. The pattern is: build one, flip the source line under test, build the other, restore:

   ```bash
   cd packages/<pkg>/bench/tachometer
   node build-ci.js current
   # flip the single source line under test, rebuild baseline, then restore it
   node build-ci.js baseline
   ```

   Keep the flip to the smallest possible diff so the two bundles isolate exactly the change you're investigating.

2. Serve the repo over HTTP from a stable port:

   ```bash
   python3 -m http.server 8766 --directory <repo-root> &
   ```

3. Navigate the MCP browser to the bench page, capture the trace:

   ```
   mcp__chrome-devtools__navigate_page url=...ci-current-todo.html
   mcp__chrome-devtools__performance_start_trace autoStop=false filePath=/tmp/trace-ref.json
   # poll for performance.measure('rename-500') or similar end-marker
   mcp__chrome-devtools__performance_stop_trace filePath=/tmp/trace-ref.json
   ```

4. Repeat for the other variant (`ci-baseline-todo.html` → `/tmp/trace-clone.json`).

### Diff hot functions

A traced file is ~150-200MB JSON. Parse it offline and aggregate self-time per function within the target bench's `performance.measure` region:

```js
// /tmp/parse.mjs
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('/tmp/trace-ref.json', 'utf8'));
const events = t.traceEvents;
// 1) find region: events.filter(e => e.name === 'toggle-all-200' && e.cat?.includes('blink.user_timing'))
//    use ph='b' (begin) and ph='e' (end) timestamps
// 2) Build profile node table from ProfileChunk events; build sample stream with cumulative timestamps
// 3) Filter samples within [regionStart, regionEnd]
// 4) Aggregate selfTime by node.callFrame.functionName + url:line
//    (normalize 'current/' vs 'baseline/' bundle paths)
// 5) Same for inclusive — walk each sample's stack via parent map built from node.children
// 6) Diff current-self vs baseline-self per function — biggest positive Δ is your suspect
```

**What "hot" looks like.** A regression where 85% of the gap concentrates in 1-2 functions is much easier to diagnose than one spread across 20. If you see the latter, the mechanism is probably structural (allocation pattern, GC, scheduler) rather than a single hot loop.

### Single-capture limitations

Single Chrome traces are not statistically rigorous — variance is high. But for *identifying which function the cost lives in*, one capture is usually enough. You're not measuring the delta — CI bench already did that — you're localizing where the time is spent.

---

## Step 4 — Inject Counters to Distinguish More-Calls vs Slower-Per-Call

The trace gives self-time per function. It does NOT give call count. Without call count, you can't tell:

- "this function is intrinsically slower per call in mode A" (deopt, IC pollution, allocator pressure)
- "this function is called more times in mode A" (extra reactive wakeups, cascade in a hot loop)

These have different fixes. Distinguish them with injected counters.

### The pattern

Patch the bundle file *after build*, between `build-ci.js` and serving:

```bash
DIR=packages/<pkg>/bench/tachometer
for variant in current baseline; do
  FILE=$DIR/dist/$variant/bench-todo.js
  # Find the function in the bundle, inject a counter on first line
  sed -i 's|evaluateJavascript(code, context, { includeHelpers = true } = {}) {|evaluateJavascript(code, context, { includeHelpers = true } = {}) {\n    if (typeof window !== "undefined" \&\& window.__counters) window.__counters.evals++;|' $FILE
  # Same pattern for notifyField, Dependency.changed, Reaction.run, etc.
done
```

The counters are global on `window.__counters`. Initialize them via `initScript` on `mcp__chrome-devtools__navigate_page`:

```js
// initScript runs before any bundle code
window.__counters = { evals: 0, notifies: 0, depFires: 0 };
window.__byMeasure = {};
const _mark = performance.mark.bind(performance);
const _measure = performance.measure.bind(performance);
// Wrap mark/measure to snapshot counter values per region
performance.mark = function(name, opts) {
  if (typeof name === 'string' && name.endsWith('-start')) {
    const m = name.slice(0, -'-start'.length);
    window.__byMeasure[m] = { _start: { ...window.__counters } };
  }
  return _mark(name, opts);
};
performance.measure = function(name, start) {
  const r = _measure(name, start);
  const m = window.__byMeasure[name];
  if (m) {
    const c = window.__counters, s = m._start;
    Object.keys(c).forEach(k => { m[k] = c[k] - s[k]; });
    delete m._start;
  }
  return r;
};
```

Navigate, wait for the bench to finish, read `window.__byMeasure`:

```js
mcp__chrome-devtools__evaluate_script function=`async () => {
  while (Date.now() < deadline) {
    if (performance.getEntriesByType('measure').find(e => e.name === 'rename-500')) break;
    await new Promise(r => setTimeout(r, 500));
  }
  return { byMeasure: window.__byMeasure };
}`
```

### What this distinguishes

Run both modes. Compare `byMeasure['toggle-all-200']` across modes:

- If `evals` count is equal and self-time differs → **per-call cost** is the issue (V8 specialization, IC behavior). Drill deeper into what changes in the per-call path.
- If `evals` count differs proportionally to the wall-clock delta → **more calls** is the issue. Find which call site is firing extra.

A locked-step ratio is the strongest signal here: when the call-count delta and the wall-clock delta move by the same factor across every regressing bench (and non-regressing benches show equal counts), the regression is extra work being scheduled, not slower per-operation. That distinction points at completely different fixes, so it's worth confirming before you touch source.

### Counter granularity hierarchy

Start broad, narrow down:

1. `evaluateJavascript` — counts JS-style expression evaluations
2. `notifyField` — counts per-field dep fires from each-block reconcile
3. `Dependency.changed` — counts all dep fires (broader than notifyField)
4. `Reaction.run` — counts Reaction re-runs (= binding wakes)
5. `Signal.set value` setter — counts every signal write

Adding more counters per investigation iteration narrows the suspect down to a specific call site.

---

## Step 5 — Local Tachometer for Hypothesis Tests

When you want to test a hypothesis ("does reordering the bench eliminate the regression?", "does changing this expression form change the result?"), you can run tachometer locally with custom-built bundles.

**Critical constraint that's easy to miss:** the CI bench workflow at `.github/workflows/benchmarks.yml:115-122` overlays `packages/*/bench/` from main before building either bundle. **This means PR-level changes to bench files are silently discarded by CI.** It's a deliberate anti-gaming defense.

So: bench-file experiments must be tested LOCALLY, not via CI push. Or, if the change is genuinely a methodology improvement (e.g. fixing an `await rAF` antipattern), push it to main first as a `Bench:` commit, then re-run the PR's bench.

**Local tachometer flow:**

```bash
# Build both bundles from your working tree
cd packages/<pkg>/bench/tachometer
node build-ci.js current
# Modify source (e.g. flip the source line under test, edit a bench file)
node build-ci.js baseline
# Restore source

# Write tachometer config + HTML files pointing at the two bundle paths
# Then:
<repo-root>/node_modules/.bin/tachometer \
  --config $(pwd)/my-experiment.json \
  --json-file /tmp/experiment.json
```

**Wrapper script pattern** — the harness resets cwd between commands, so wrap tachometer in a shell script:

```bash
#!/bin/bash
cd <repo-root>/packages/<pkg>/bench/tachometer || exit 1
exec <repo-root>/node_modules/.bin/tachometer \
  --config $(pwd)/my-experiment.json --json-file /tmp/out.json
```

Tachometer takes 3-7 minutes for ~30 samples × 2 configs. Output JSON has `benchmarks[].differences[]` with `percentChange.{low,high}` — that's your 95% CI for the experiment.

See `/extend-bench-suite` for the full local-tachometer reference.

---

## Step 6 — Read Bundle Source to Identify Suspect Code Paths

Only AFTER you have an empirical signal (trace + counter data) is reading source code productive. The trace tells you *which function*; you read source to understand *what mechanism within that function* differs between variants.

Cross-reference:

- The bundle line numbers in the trace point you at the post-bundling line, not the source. Use `grep -n 'functionName' dist/current/bench-*.js` to find context.
- Map back to source: `grep -rn 'functionName' packages/*/src/`.
- For framework primitives that the bench uses, the relevant skills are in `ai/skills/contributing/`:
  - `native-renderer` for the each-block reconcile, per-item Proxy, scope.reaction binding
  - `internals` for higher-level framework architecture

---

## Step 7 — Spawn Fresh-Take Agents When Reasoning Loops

When you've been on the same hypothesis for an hour and the data isn't agreeing, you're probably in the failure mode the `fresh-take` skill targets: solution momentum.

Per `/fresh-take`:

1. Write a brief that captures **problem knowledge** (observations, constraints, V8 skill references) **but not solution momentum** (your specific hypotheses, code paths you've explored).
2. Spawn 2-3 subagents with different lenses (neutral, challenge, survey).
3. Audit each subagent's output for V8 skill citations — if they didn't cite `performance-v8-object-model` or `performance-v8-stale-advice`, their priors may be uncalibrated.
4. Present findings to user without reconciliation, per the skill.

The value here is that fresh agents, unanchored to the hypothesis you've been circling, often name the mechanism you'd ruled out prematurely. Counter instrumentation can then confirm or kill their read empirically.

---

## Dead Ends to Avoid

**Static code reading without measurement.** Convinces you of a mechanism, then the data disagrees. The trace tells you in 5 minutes what reading takes hours to maybe-guess.

**Speculating about V8 specialization without citation.** V8 has moved a lot since 2017. If you're claiming "X is slow because of polymorphism" or "Y causes deopt", cite the specific V8 skill paragraph or v8.dev post. Otherwise you're probably wrong.

**Pushing bench-file changes to CI to test hypotheses.** The benchmarks workflow overlays `packages/*/bench/` from main before building. Your changes are silently discarded. Test locally.

**Mistaking allocation cost for the dominant cost.** Per `performance-v8-memory`, young-gen allocation is cheap. "This variant allocates more therefore it's slower" is wrong on its own — surviving into old gen is the expensive part. Verify with actual GC profiling, not allocation counting.

**Equating Chrome trace self-time with call count.** Self-time is sample-based and reflects time spent. Call count requires instrumentation. The two answer different questions.

**Trying to make the regression disappear by changing the bench code.** The bench is there to expose the regression. Routing around it (e.g. rewriting a JS-eval expression to Lisp form) hides the symptom; it doesn't diagnose the cause. The maintainer rightly pushes back on this.

---

## Quick Reference

| Phase | Tool | Output |
|---|---|---|
| Targets | `/read-bench-report` | weighted bench list |
| Ground claims | `performance-v8-*` skills | V8 priors are calibrated |
| Profile | chrome-devtools MCP `performance_start_trace` | per-function self-time |
| Distinguish call-count vs per-call | sed-injected `window.__counters` | per-region call counts |
| Hypothesis test | local tachometer with custom bundles | PR-vs-variant percentChange CI |
| Stuck | `/fresh-take` with problem-knowledge brief | independent subagent reads |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reading Bench Reports** | `/read-bench-report` | Interpreting the bench-bot PR comment |
| **Extend Bench Suite** | `/extend-bench-suite` | Adding a new bench, local tachometer setup |
| **Improve Performance** | `/improve-performance` | Audit-fix-measure cycle for an entire package |
| **Fresh Take** | `/fresh-take` | Escaping solution momentum with subagent delegation |
| **V8 Object Model** | `performance-v8-object-model` | Hidden classes, IC, polymorphism reality check |
| **V8 Memory** | `performance-v8-memory` | GC, allocation cost, Proxy speed |
| **V8 Stale Advice** | `performance-v8-stale-advice` | Firewall against pre-2022 perf folklore |
| **Native Renderer** | `native-renderer` | Each-block reconcile, per-item Proxy, binding dispatch |
