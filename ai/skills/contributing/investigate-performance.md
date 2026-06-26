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

**A conclusion is the measurement chain you produced, not the destination.** Naming a cause is worth nothing without a chain of measurements *you ran in this investigation* that forces it. Two things follow:

- **Investigate the regression a user feels, not the one that's easy to isolate.** A synthetic microbench getting slower (setting a signal to itself, subscribe/unsubscribe churn) is rarely worth acting on. A real component workload getting slower (editing a todo, rendering a list) is the finding. The synthetic bench is tempting because it isolates cleanly — the weight gate in Step 1 keeps you honest about which one to chase.
- **A prior cause-claim is a hypothesis, not an answer.** The cause may already be written down — a commit message, a PR comment, an `ai/workspace` note, a code comment. Treat it as a lead to test, never as evidence. See "Evidence Integrity" below.

**The anti-pattern to watch for in yourself is deflection: drifting away from the measurement that would settle it.** It wears several costumes — chasing the bench that isolates cleanly, calling a regression "noise" or "an artifact," treating a prior claim as proof, pausing until the benches are "fixed." Each one feels like progress, and the tell is subtle: reasoning toward deflection comes out *composed and rigorous*, not flustered — so the calm is no signal you're right. Don't try to catch it by how sound the argument feels; it will feel sound. Catch it by direction: if a line of reasoning concludes "so we don't need to measure," that is the moment to measure. Two forms account for most failed investigations:

- **Let the weighted profile pick the suite to dig into and what the write-up owes each regressor — not how the investigation spends its time.** Suite-weight × magnitude (Step 1) shows where the user-felt cost concentrates: a +70% `todo` regressor dwarfs a +27% `signal` microbench, so the focus and the final report belong there, not on the synthetic bench that happens to isolate cleanly. It's a focus-and-coverage heuristic, not a stopwatch — the investigation follows the signal wherever it leads.
- **Earn a harder claim, don't settle for "the bench is flawed."** "It's noise / a cross-bench artifact / contamination" is the easy out, and it tends to arrive before the legwork does. Each of those is a claim about a *channel* you then have to measure (Step 5 counters, a heap trace) — a place to start digging, not a verdict. The conclusion worth having is usually unintuitive and hard-won: it turns on how several parts interact (reactivity, each-block reconcile, V8 specialization) and survives because the measurements force it, not because it fit first.

**A bench that *didn't* regress is a control — use the contrast.** Why a near-neighbor on the same code path stayed flat is as much signal as why its sibling moved. `rename-500` (pure `setProperty`) is a large *win* while `edit-cycle-5` (`setProperty` plus an `editingId` flip and a row re-render) regresses — the delta between the two points at the editing/re-render path, not at `setProperty`. "Why did this one *not* move?" is often the cleanest localizer you have, and it's the other reason the weighted budget governs the *report*, not the *investigation*: chasing the contrast means deliberately spending time on benches that didn't regress at all.

**A uniform effect can't explain a non-uniform profile.** If your mechanism is the same size on every bench (a 1.20× everywhere) but the regressions aren't (+71% on one, +10% on another), the *spread* is unexplained data your conclusion still has to fit. And a multiplier identical on winners and losers — the benches that got *faster* show it too — isn't a per-bench cause at all; it points at shared or inherited state (item count, heap, bench ordering). Differential across benches → the real per-bench cause; uniform across all of them → something environmental upstream.

---

## Evidence Integrity — prior claims are leads, not answers

You'll read prior explanations along the way — git log is a legitimate bisection tool, and commit messages and workspace notes are right there. The discipline is in how you carry what you read:

1. **A prior cause-claim earns the scrutiny of your own untested guess.** "The commit message says it's cross-bench contamination" is a hypothesis to design a measurement against, with room to be wrong — not a conclusion.
2. **Disclose what you encountered.** If your conclusion matches a claim already written down, say so and show the chain that stands without it.
3. **Convergence counts only between measurements** — agreement between your conclusion and something you read is not corroboration.
4. **A conclusion you can't reconstruct from measurements you ran is a citation, not a finding.** Name it as such.

❌ "git log says PR #213 caused it via extra reactive work, and my trace shows reactive functions hot — confirmed"
✅ "PR #213's message claims extra reactive work. I counted `Reaction.run` across both bundles: equal. The cost is per-call, not call-count — the claim doesn't hold"

The information is in the data and you'll find it. Integrity is in how you handle it.

---

## When to Reach for This Skill

The bench bot reports a confident regression on a PR (`/read-ci-reports` shows it in the ❌ Slower bucket). You've ruled out noise (CIs are tight, multiple runs reproduce). The CI bench delta is real — now you need to know *why*.

This skill is for that *why* phase, not the *did it regress* phase.

---

## The Flow That Works

```
1. Identify weighted targets, clear the weight gate          → /read-ci-reports
2. Read the bench, parse its template (AST), orient on it    → bench source, validate_template, authoring skills
3. Calibrate V8 priors                                       → performance-v8-* skills
   ── gather (no hypothesis needed) ──
4. Capture a trace; diff hot functions, current vs baseline  → chrome-devtools MCP
   → a discounted hypothesis falls out of what the trace shows
   ── steelman (a hypothesis is required to write the test) ──
5. Count calls / catch spurious evaluations to confirm it    → injected counters / Playwright
6. A/B a candidate change locally                            → local tachometer, custom bundles
7. Read the suspect framework path                           → only after a measurement points at it
8. Spawn /fresh-take subagents if reasoning loops            → escape solution momentum
9. Locate the fix at the named construct, confirm by re-measure → smallest change that kills the channel, keeps the win
```

Each step is cheap (~5-10 minutes) and produces empirical signal.

**Two kinds of instrument, and the order is not arbitrary.** *Gathering* tools (the Chrome trace, a tachometer baseline diff) need no hypothesis — they run first and hand you one by showing where the cost is. *Steelmanning* tools (counter / Playwright instrumentation of call counts and spurious evaluations) you cannot even write until you have a specific suspicion, because you instrument the exact thing you suspect. So gather first, let the hypothesis fall out of the measurement, then steelman it. If you're reaching for the counter test with nothing specific to count, you haven't gathered enough yet. The hypothesis is born from a measurement, never from a read.

**The question that actually ends a root-cause investigation: *which channel?*** Localizing the cost to a function is not the finding. The finding is naming the channel with a captured measurement: more calls (counter injection), slower per call from GC live-set pressure (heap/scavenge trace), slower per call from JIT tier / IC state (CPU self-time profile), or allocation survival (heap trajectory). "It's a measurement artifact" or "it's contamination" is where you start digging, not where you stop — those are claims about a channel you still have to measure. The heap channel has a cheap control: reorder the suspect op to run *first*, ahead of the suite's heavy allocators, and re-bench — if the regression vanishes, the cost was cross-op heap state an earlier op left behind, not the regressing op's code. The suites now collect between ops to close this confound (`measureOp` / `destroy()`, see `extend-bench-suite`), so on current main a surviving regression is more likely real — but confirm the suite still passes `--expose-gc`, since the collect silently no-ops without it.

**The gates.** Four checkable stops carry the method, and because each is cleared by producing an *artifact*, the artifact is also the verification — the skill never has to watch over your shoulder. The **weight gate** (Step 1): the heaviest real-workload regressor is measured. The **orientation gate** (Step 2): the expected-reactivity prediction is written before the trace. The **V8 gate** (Step 3): a V8 claim cites the current skill, not stale recall. The **grounding gate** (Step 2): the construct is named before any mechanism claim. None is passed by saying you cleared it — only by the artifact existing.

---

## Step 1 — Identify Targets With Weights

Not all regressions are equal. Use this fixed heuristic so you don't have to guess what matters:

| package suite | weight | rationale |
|---|---:|---|
| `krausest` | 5× | js-framework-benchmark, headline external comparison |
| `todo`, `template`, `hydrate` | 2× | real component/app workloads — what a user actually feels |
| `signal`, `compiler-micros`, `renderer-micros`, other synthetics | 0.25× | internal microbenches; a regression here is rarely something anyone acts on |

Build a target table: bench name, weight, **PR-vs-main delta in percentage points**, ranked by **weight × magnitude**. A +70% regression on `todo` (2× × 70 = 140) outranks a +27% regression on a `signal` microbench (0.25× × 27 = 6.75) by 20×.

Normalize those products across all the confident regressors and you get a **focus-and-coverage budget**: it tells you which suite is worth digging into, and roughly how much of the final write-up each regressor is owed. With todo at 140 against signal's 6.75, the dig and the report belong with todo — "where does the weighted regression actually live," not "which row is rank 1." It is not an investigation stopwatch, though: a small regressor can turn out to be the shared root, and a bench that didn't move at all is often your best control (see "use the contrast" above). Use the budget to choose where to start and to keep the report honest about the heavy regressors; let the signal decide where the investigation actually goes.

**The weight gate.** The investigation isn't done until you've *measured* the highest weight×magnitude regressor. If the conclusion rests on the synthetic micro-benches while the top-ranked real-workload regressor (e.g. `todo:edit-cycle-5` +70%) is still unmeasured, the wrong thing got investigated — build that bundle and profile it first. "By analogy to the signal benches" doesn't clear the gate; only a measurement does.

**Do not** burn cycles on borderline-noise regressions — `/read-ci-reports` documents the noise-floor envelope per duration. But "low magnitude" is weighted too: a 2× suite just above the noise floor can still outrank a large synthetic swing.

---

## Step 2 — Read the Bench, and Orient on the Component It Drives

Info-gathering, not theorizing — read to learn *what the workload is*, never to conclude *why it's slow* (that comes from measurement). Three grounding moves:

**Read the bench definition.** Open `packages/*/bench/tachometer/bench-*.js` and read the regressing case verbatim. The name is not the workload: `todo:edit-cycle-5` is `editTodo` + `saveTodo` — an `editingId` flip plus a field write that re-renders a row, so it runs the each-block reconciler over object-valued signals; `signal:set-same-10m` is a primitive `set` that never reaches that path. This is what tells you which bench is worth a trace and which code path to instrument.

**Parse the template — don't eyeball it.** Run `validate_template` (Semantic UI MCP) with `includeAST` on the regressing component's template string. The node list tells you exactly which expressions route through JavaScript evaluation (object literals, operators, ternaries), which are bare-variable lookups, which are Lisp-style helper calls, and which are block directives — so when a trace or counter implicates `evaluateJavascript`, you attach it to a *specific AST node* instead of guessing. These benches deliberately mix expression shapes (bare var, data path, Lisp helper, JS object literal, `{#if}`/`{#each}`) precisely to catch a regression in any one shape, so the task is to localize to a shape and a node — not to wave at "expression evaluation occurs." A claim like "+40 `evaluateJavascript` calls on a Lisp-style arg" is refuted on sight by an AST that contains no such JS node.

**For a component regression, orient on how components actually work — from the user-facing side — before you trace.** This is the step renderer investigations skip. The code your trace lands in (`packages/renderer/src/engines/native`) is a *separate package* from `packages/component` and the authoring surface a user writes against. A trace gives you hot function names; it does not tell you how a component behaves in practice — how expression evaluation, each-blocks, computeds, and reactivity actually fire when someone writes a template. Without that model you'll mis-read the trace. Orient first through the authoring curriculum:

- `example-curriculum` — the fastest orientation: a ranked path through real components
- `component-templating`, `component-state` — how templates, helpers, expressions, and signal mutations behave
- one or two real examples — the template/expression demos make expression evaluation concrete in a way the renderer source does not

You're not memorizing the API. You're building enough of the user-facing mental model that the trace's hot functions map onto something you understand. Ground where the measurement points: the user-facing model for template and reactivity bugs, the framework plumbing (state init, lifecycle, scheduling) for the ones that aren't — sometimes the trace leads upstream of the component entirely, to a shared `defaultState` or the scheduler, and that's where to read.

**The orientation gate.** Before you capture a trace, write the *expected* reactive behavior of the regressing workload from the AST and the component: the expressions and their shapes, what the triggering action mutates, and what each mutation should invalidate — once each. This is a prediction of correct behavior, not a cause-hypothesis; it's the baseline the trace is read against, so the regression shows up as the *gap* between what should fire and what did. Writing it before you measure is also what stops the trace from being read to fit a conclusion you'd already reached. The prediction is part of the deliverable — which is what makes the grounding checkable without anyone looking over your shoulder.

**The grounding gate.** You may not assert a *mechanism* — why the cost exists — until you can name the specific AST node, template construct, or source path it concerns. "Expression evaluation occurs" and "extra reactive work" are not mechanisms; "the `classMap {…}` object-literal node re-evaluates N extra times per `editingId` flip" is. Until you can name the construct, what you have is a measured *effect with an open mechanism* — say exactly that, rather than dressing the effect as a cause.

---

## Step 3 — Ground Claims Against Current V8 Behavior

Before reasoning about *why* a regression exists, read these:

- `performance-v8-overview` — tier model context
- `performance-v8-object-model` — hidden classes, IC monomorphic/poly/megamorphic, allocation site dedup (this skill specifically debunks "objects from different source locations are different shapes", which is a common wrong intuition)
- `performance-v8-memory` — GC generations, young-gen is cheap, Proxy is not specialized
- `performance-v8-stale-advice` — the firewall against pre-2022 V8 folklore (object.freeze speed, try/catch deopts, blanket monomorphism cargo culting)
- `performance-v8-compilation` — feedback stability, deopt triggers, what Maglev/Turbofan inline

**The V8 grounding gate.** Your knowledge of V8 comes from training and has a cutoff; these skills were written to current behavior as of May 2026, and V8 moved in the gap. So a claim about V8 internals — specialization, deopts, IC state, GC, inlining — rests on the skill paragraph that covers it, the way you'd cite any source more recent than your own memory. This isn't a check on you; your recall of this one area is out of date by construction, and the skill is the patch. An uncited V8 claim is running on stale priors — ground it, or drop it.

A common failure mode: an agent forms a hidden-class polymorphism hypothesis, then proceeds for ~30 minutes building elaborate theory around it. The object-model skill explicitly says "two `{a:1, b:2}` literals at different lines share a shape." Reading that one paragraph would have prevented the entire detour.

---

## Step 4 — Gather: Capture Chrome DevTools Traces

This is the lead gathering tool — it needs no hypothesis and produces one. (Cheapest first move before tracing: a tachometer baseline diff, Step 6, to confirm the regression reproduces locally and how big it is.) The chrome-devtools MCP server lets you capture a full V8 sampling trace from inside the conversation. This is the single most informative tool in this flow.

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

## Step 5 — Steelman the Hypothesis: Inject Counters / Playwright

This is a steelmanning tool, so it comes *after* the trace has handed you a hypothesis — you instrument the specific thing you now suspect (a helper firing too often, a spurious re-evaluation), to confirm or kill it. If you don't yet have something specific to count, go back and gather.

❌ inject a counter with nothing specific in mind, hoping a number stands out
✅ trace points at "evaluateJavascript looks hot" → count `evaluateJavascript` to confirm it's more calls vs slower per call

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

## Step 6 — Local Tachometer: Reproduce, Size, and A/B

Dual-use, and the workhorse of both classes: a baseline diff (current vs reverted) *gathers* — it confirms the regression reproduces locally and how big it is, no hypothesis needed — and a custom-bundle A/B *steelmans* a candidate change ("does reordering the bench eliminate the regression?", "does this expression form change the result?", "does my fix actually fix it?").

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

## Step 7 — Read the Suspect Framework Source

Only AFTER a measurement points at a function is reading its source productive. The trace tells you *which function*; you read source to understand *what mechanism within that function* differs between variants. (This is distinct from Step 2's read: there you learn what the bench and component *do*, to aim the measurement; here you read the framework internals the measurement already implicated.)

Cross-reference:

- The bundle line numbers in the trace point you at the post-bundling line, not the source. Use `grep -n 'functionName' dist/current/bench-*.js` to find context.
- Map back to source: `grep -rn 'functionName' packages/*/src/`.
- For framework primitives that the bench uses, the relevant skills are in `ai/skills/contributing/`:
  - `native-renderer` for the each-block reconcile, per-item Proxy, scope.reaction binding
  - `internals` for higher-level framework architecture

---

## Step 8 — Spawn Fresh-Take Agents When Reasoning Loops

When you've been on the same hypothesis for an hour and the data isn't agreeing, you're probably in the failure mode the `fresh-take` skill targets: solution momentum.

Per `/fresh-take`:

1. Write a brief that captures **problem knowledge** (observations, constraints, V8 skill references) **but not solution momentum** (your specific hypotheses, code paths you've explored).
2. Spawn 2-3 subagents with different lenses (neutral, challenge, survey).
3. Audit each subagent's output for V8 skill citations — if they didn't cite `performance-v8-object-model` or `performance-v8-stale-advice`, their priors may be uncalibrated.
4. Present findings to user without reconciliation, per the skill.

The value here is that fresh agents, unanchored to the hypothesis you've been circling, often name the mechanism you'd ruled out prematurely. Counter instrumentation can then confirm or kill their read empirically.

---

## Step 9 — Suggest the Fix, and Confirm It

A diagnosis isn't finished at the channel. The deliverable points at *where* to fix — but a fix locus is earned, not guessed. Two halves: locate, then confirm.

**Locate — only once the mechanism is closed.** You can propose a specific change only when you can name the construct that produces the redundant work: the AST node, the binding, the subscription, the source line (this is what the grounding gate is for). Finding the *smallest correct* change is what demands deep-stack understanding — trace the cost from the symptom (extra `evaluateJavascript` calls) to the code that *schedules* it (which reaction over-fires, which dependency edge is redundant), and propose the minimal change that removes it. If the mechanism is still open — bounded effect, unnamed construct — say so and stop there. "Here is the effect and the candidate locus to investigate" is an honest hand-off; a guessed one-line fix is deflection with a patch on it.

**Name the trade, prefer the root cause.** State what the fix must preserve. Here: kill the redundant wakeups *without* reintroducing the per-read clone that won the other benches. Prefer removing the redundant work at its source over masking it — a memoize or guard that hides the symptom is the bench-editing reflex in a different costume.

**Confirm by re-measuring, never by reasoning.** A fix is unconfirmed until the same chain that found the bug shows it gone:

- Re-run the channel measurement on a build *with* the fix — the metric that was +20% (Δ`Reaction.run`, the +N node evals) goes to ~0.
- The win survives — re-A/B the benches that improved (`rename-500`); they must still win.
- No new regression — re-run the weighted set, not just the one bench.
- Correctness holds — run the component tests; the change alters cost, not behavior.
- Confirm in CI, since the local machine differs and CI rebuilds benches from main.

The most decisive of these is *ablation*: remove the suspected cause and show the effect disappears while the win survives — a leak-fix that drops the inflated counter to clone parity proves the leak was the cause in a way correlation can't.

"It should be faster now" is the false-composure signature again: re-measure, or it isn't fixed. And land it the way the codebase lands perf fixes — present the change plus the before/after measurement chain for review. A single local A/B is evidence for a proposal, not grounds to self-merge.

And performance is iterative. A result that moves the needle but leaves a residual you can't fully account for — a magnitude gap, an unexplained second-order effect — is an honest place to close a loop: name the residual precisely, push the fix, re-measure, and open the next loop on what's left. That's a loop boundary, not a failure. What's not allowed is relabeling the residual "noise" or "the machine" to avoid the next loop.

---

## Dead Ends to Avoid

**Static code reading without measurement.** It convinces you of a mechanism, then the data disagrees.
❌ read renderer source for an hour to derive why each-block reconcile got slower
✅ trace first — it names the function in 5 minutes, then read that function

**V8 specialization claims without a citation.** V8 has moved a lot since 2017.
❌ "X is slow because the object went polymorphic" / "Y causes a deopt"
✅ cite the `performance-v8-*` paragraph or a v8.dev post, or drop the claim (two `{a,b}` literals at different lines share a shape)

**Allocation count mistaken for allocation cost.** Young-gen allocation is cheap (`performance-v8-memory`); surviving into old gen is the expensive part.
❌ "this variant allocates more, therefore it's slower"
✅ profile old-gen survival before blaming GC

**Trace self-time read as call count.** Self-time is sample-based time spent; call count needs instrumentation.
❌ "self-time is high, so it's being called more"
✅ inject a counter to tell more-calls from slower-per-call — they answer different questions

**"It's just a machine difference."** When a local repro reproduces the regression's *sign* but not CI's *magnitude*, that gap is a finding to chase, not a shrug — bench ordering and cross-bench state accumulation routinely amplify on CI.
❌ "local shows +20%, CI shows +71%, must be the machine" → stop
✅ measure it — does the accumulated/leaked state differ under the full CI run order? a uniform mechanism that yields a 7× spread across benches isn't fully explained yet

**Pushing bench-file changes to CI to test hypotheses.** The workflow overlays `packages/*/bench/` from main before building, so PR-level bench edits are silently discarded (Step 6).
❌ tweak the bench, push, wait for the bot to re-run
✅ build both bundles locally and A/B with tachometer

**"The benchmark is wrong" — and its quieter form, "let's wait until the benches are fixed."** When an investigation stalls, editing the bench to be "more factual" — rewriting the workload, reordering, loosening thresholds, dropping a case — can feel like progress, but it hides the symptom and turns a real regression into a green check. Once CI's overlay rules that out (it rebuilds `packages/*/bench/` from main, so the edit can't land), the same impulse tends to return as a pause: "we shouldn't dig further until the benches are fixed — they have a JIT-warmup / GC-timing flaw." Watch for this one in yourself — it's deflection's most convincing costume, because JIT tier-up and GC pauses *are* real channels (see "which channel?" above), so the case for it comes out genuinely rigorous. The rigor isn't the signal; the direction is — the argument ends at "don't measure," which is the cue to measure. An elaborate methodology critique is still a detour until a measurement backs it.

The constructive move is to confirm, not argue. Tachometer is built for exactly this: it runs repeated samples and reports a 95% confidence interval per comparison (`percentChange.{low,high}`) — establishing significance via the central limit theorem is the point of the tool, not a gap in it. So "the run is too short to be significant" is already answered by the interval the harness produced and by the per-duration noise floor `/read-ci-reports` documents — start there. The same standard settles the harder claims: **a methodology flaw is something you demonstrate, not a reason to halt before you have.** Bump warmup iterations, force GC between samples, reorder the cases and A/B locally (Step 6), and show the regression collapses. If it doesn't collapse, the bench is sound and the regression is real — that's the finding. And absent that demonstration, "let's wait until the benches are fixed" is not grounds to stop. Keep going until a measurement settles it. (`/read-ci-reports` and `/extend-bench-suite` carry the statistical details — this skill only needs to point at them.)

---

## Quick Reference

| Phase | Tool | Output |
|---|---|---|
| Targets (weight × magnitude) | `/read-ci-reports` | ranked list; krausest 5× / todo·template·hydrate 2× / synthetics 0.25× |
| Weight gate | — | heaviest real-workload regressor is measured, not "by analogy" |
| Orient | bench source + `example-curriculum`, `component-templating` | what the workload does + how the component works user-side |
| Parse the template | `validate_template` `includeAST` | which expressions are JS-eval vs bare var vs Lisp vs block — map the symptom to a node |
| Orientation gate | AST + component model | a written prediction of expected reactivity, before the trace |
| V8 gate | `performance-v8-*` skills | V8 claims cite current (post-cutoff) behavior, not stale recall |
| Gather (no hypothesis) | chrome-devtools `performance_start_trace`; tachometer baseline diff | per-function self-time; reproduces + size |
| Name the channel | heap trace / CPU self-time / counters | calls vs GC vs JIT vs allocation — measured |
| Grounding gate | — | the AST node/construct named before any mechanism claim |
| Steelman (needs hypothesis) | sed-injected `window.__counters` / Playwright | per-region call counts, spurious evals |
| A/B a fix | local tachometer with custom bundles | PR-vs-variant percentChange CI |
| Evidence integrity | — | every prior cause-claim disclosed; conclusion = your measurement chain |
| Suggest + confirm fix | re-run the channel measurement on a fixed build | channel metric → 0, win preserved, no new regression, tests pass |
| Stuck | `/fresh-take` with problem-knowledge brief | independent subagent reads |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reading CI Reports** | `/read-ci-reports` | Interpreting the bench-bot PR comment |
| **Extend Bench Suite** | `/extend-bench-suite` | Adding a new bench, local tachometer setup |
| **Improve Performance** | `/improve-performance` | Audit-fix-measure cycle for an entire package |
| **Fresh Take** | `/fresh-take` | Escaping solution momentum with subagent delegation |
| **V8 Object Model** | `performance-v8-object-model` | Hidden classes, IC, polymorphism reality check |
| **V8 Memory** | `performance-v8-memory` | GC, allocation cost, Proxy speed |
| **V8 Stale Advice** | `performance-v8-stale-advice` | Firewall against pre-2022 perf folklore |
| **Native Renderer** | `native-renderer` | Each-block reconcile, per-item Proxy, binding dispatch |
| **Example Curriculum** | `example-curriculum` | Orient on how components work user-side before a component perf dig |
| **Component Templating** | `component-templating` | Template syntax, helpers, expression evaluation in practice |
| **Component State** | `component-state` | Signal API and mutation-method behavior |
