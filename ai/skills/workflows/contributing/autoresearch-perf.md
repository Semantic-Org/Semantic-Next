---
title: Autoresearch Performance Regressions
description: Methodology for running an autonomous hypothesis-test-measure loop to close performance regressions. Covers loop shape, gate discipline, iteration artifacts, and failure modes observed in practice.
keywords: [autoresearch, performance, regression, tachometer, hypothesis, iteration, background agent, gate discipline]
audience: contributing
type: workflow
workflow: autoresearch-perf
---

# AI Workflow: Autoresearch Performance Regressions

**An autonomous hypothesis → gate → measure → decide loop for closing perf regressions**

This workflow is the autonomous variant of `improve-performance`. Use it when you have a target set of regressed benchmarks, a baseline to compare against, and multiple candidate mechanisms whose winner isn't obvious. A background agent iterates in a worktree; a reviewer (human or separate agent) reads each iteration's artifact and intervenes only when gates misfire.

**Golden rule: the loop is hypothesis → gate → measure → decide. Every iteration produces an artifact that survives the loop's death. Skip no gate, commit no midloop code, trust no cached reasoning.**

## Design Principles

- **Empiricism over deduction.** The loop's value is that it exposes hypotheses to the full-dimensional benchmark space rather than reasoning from an undersampled corner. A hypothesis that seems obviously right in a diff can fail at the test gate or trip a regression on a non-target metric. Let the measurements decide.
- **Artifacts outlive iterations.** Every iteration writes `iter-N.md` with hypothesis, change, measurement, verdict, and next-hypothesis seed — even rejected ones. A rejected iteration is sample space explored; the write-up teaches the next iteration what *not* to try.
- **Gates are non-negotiable.** Test gate first (fast), regression gate second (cheap), measurement gate third (slow). Skipping any gate corrupts the loop's verdict.
- **Never commit during the loop.** Work on uncommitted changes. A commit mid-loop makes rollback mean `git reset`, which loses the artifact trail. Commit only when the loop stops with a validated best-known state.
- **Persistence pays off, but bounded.** The loop should have a budget (iteration count, consecutive-reject count, or wall-clock). Unbounded autoresearch drifts. Two consecutive rejects or eight iterations total is a reasonable default.
- **Local and CI diverge — know which you trust.** Local tachometer runs in whatever Chrome/hardware you have; CI uses its own. Magnitudes shift, sometimes sign-flip on noisy benches (see Failure Modes). Baseline and iteration runs must be apples-to-apples on the same host.

---

## When to Use Autoresearch

✅ Use autoresearch when:
- You have a confirmed regression set (e.g. tachometer CI showed N metrics regressed by >5pp vs main)
- The root cause spans multiple candidate mechanisms — you don't know which will win
- You can run the benchmark suite locally in under ~5 min per iteration
- You can afford 30-60 min per iteration wall-clock and 4-8 total iterations

❌ Don't use autoresearch when:
- You already know the fix — just implement it and measure
- The regression has one confirmed cause that's already been analyzed
- The benchmark suite can't isolate what you're optimizing (no local signal)
- CI is your only measurement surface (tachometer in CI is too slow for a tight iteration loop even after parallelization — iterating requires a local runner)

---

## Prerequisites

Before launching the loop, you need four things:

| Prerequisite | What | Why |
|---|---|---|
| Baseline measurement | iter-0 JSON files + frozen baseline source snapshot | Every subsequent iteration compares against this. No baseline, no verdicts. |
| Reproducible runner | Local tachometer that builds both `baseline` and `current` bundles and runs them round-robin | The agent must be able to re-run without manual intervention. |
| Measurable targets | Named benchmarks with known iter-0 deltas vs main | The gate needs a threshold to apply. "Make it faster" is not a target. |
| Gate thresholds | Target improvement threshold + non-target regression cap | e.g. "target metrics improve by >5pp; no non-target metric regresses >3pp" |

Baseline is typically captured in its own first iteration (iter-0). Freeze a copy of the file(s) being modified (`each.baseline.js` pattern) so later iterations can diff against a known state, not against whatever the agent last wrote.

---

## Loop Shape

```
┌──────────────────────┐
│ iter-0: baseline     │
│ (no change; capture  │
│  current state)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────┐
│ iter-N (for N = 1, 2, 3, ...)                │
│                                              │
│  1. Form hypothesis (mechanism claim)        │
│  2. Implement change                         │
│  3. Run tests                    ─── GATE 1  │
│     ↓ fail → revert, write-up, next iter     │
│  4. Run benchmark suite                      │
│  5. Compare vs iter-0 baseline   ─── GATE 2  │
│     ↓ non-target regressed >3pp → refine     │
│  6. Compare target metrics       ─── GATE 3  │
│     ↓ target unimproved → revert or refine   │
│  7. If all gates pass: promote to best-known │
│  8. Write iter-N.md (hypothesis / change /   │
│     measurement / verdict / next seed)       │
└──────────┬───────────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Stop when:           │
│ - Target set closed  │
│ - Budget exhausted   │
│ - 2 consecutive      │
│   rejects            │
│ - STOP.md signal     │
└──────────────────────┘
```

Each iteration is a single hypothesis. Do not try two things at once — if you land a change that bundles two mechanisms and it improves the target, you cannot tell which one paid.

---

## The Three Gates

Three gates in order. Skip none. Failure at an earlier gate short-circuits later ones.

| Gate | Runs | Checks | Consequence of failure |
|---|---|---|---|
| **Test gate** | After change, before measurement | Full package test suite (`npm test`) | Full revert. Log why the test failed in iter-N.md. Tests that fail often encode contracts the hypothesis didn't know about. |
| **Regression gate** | After measurement | No non-target metric regressed by more than the threshold (default >3pp) vs iter-0 baseline | Refine, don't promote. Either tighten the hypothesis or diagnose the regression and iterate. |
| **Measurement gate** | After regression gate | Target metric(s) improved by a meaningful, confident margin | Revert if measurement shows no change or worse. Refine if partial improvement. |

### Test gate

Fast, cheap, unforgiving. Run the full suite, not the filtered subset. A filtered run can miss tests whose assertions encode the contract your hypothesis violated.

**Case study — iter-1, `each.js` phase-3 notify.** The hypothesis was "replace conditional `notify()` with unconditional `itemSignal.set()`; let `isEqual` gate the wakeup." Tests ran green on a partial subset. Full suite surfaced `subtree-caching.test.js §8 should update conditional branches when item data changes` — the test mutates `items[0].active` in place, and the `as`-form wrapper's shallow identity defeats `isEqual`. The notify branch was load-bearing for that contract. Full revert; write-up noted the contract; next iteration knew to preserve `notify()` semantics.

### Regression gate

A target-only verdict is incomplete. The full suite's verdict is what ships.

**Case study — iter-2, shallow props snapshot.** The hypothesis closed the primary target confidently but regressed a non-target metric well beyond gate threshold: every item mutates on the non-target's scenario, so the new per-reconcile snapshot allocation dominated that bench. Without the regression gate, this would have shipped as "net positive." With the gate, it was marked Refine; the next iteration eliminated the allocation via in-place refresh and kept the primary win while narrowing the non-target loss.

**Threshold choice.** The gate threshold sits above the bench's inherent noise floor. Short benches have larger inherent variance than long benches — the reporter exposes a duration-derived Expected Noise per metric, and a regression is "real" when it clears that floor. In the absence of Expected Noise, a blanket few-percentage-point threshold works as a starting default; revisit when the reporter's per-bench noise estimate is available.

### Measurement gate

"No measurable improvement" is a revert, not a retry with the same hypothesis. If the data says the mechanism didn't help, the hypothesis was wrong — don't rationalize it.

**Case study — iter-4, in-place refresh in the `if` branch too.** Hypothesis: the remaining regressions on `remove-5-middle`/`remove-first` come from per-reconcile allocation in the same-ref-changed-index path; eliminating that allocation should recover them. Measurement showed no meaningful improvement on the motivating benches plus 2-3pp drift on unrelated ones. Correct call: roll back to iter-3's state, keep iter-3 as best-known, write up that this hypothesis was null.

---

## Iteration Artifact: `iter-N.md`

The iteration artifact is the loop's memory. Every iteration — kept, rejected, or null — writes one. A dead iteration without a write-up is a failure of the loop, not of the hypothesis.

### Required sections

```markdown
# Iteration N: <one-line hypothesis description>

## Hypothesis
<what you believe and why. Cite the mechanism — not "this should be faster"
but "this fires N notifies per reconcile that wake M bindings; replacing
with a prop-diff reduces wakes to actual-mutation count.">

## Change
<minimal diff or pseudocode. Should fit in one screen. If it doesn't,
the hypothesis is too broad — split it.>

## Measurement
<absolute CIs for target metrics; regression-gate table for non-targets.
Reference the JSON artifact filenames.>

## Verdict
- [ ] Keep
- [ ] Refine (specifies next seed)
- [ ] Revert (hypothesis was wrong)

## Why it failed (if rejected)
<root cause: why did the hypothesis not survive the gates? This is the
most valuable section — it teaches the next iteration.>

## Next hypothesis seed
<what should iter-N+1 try? A rejected iteration without a next seed
stalls the loop.>
```

The `Next hypothesis seed` is load-bearing. Even kept iterations write one — if the target set isn't closed, the loop continues, and the seed is the starting point.

---

## Artifact Layout

Conventional layout under `ai/workspace/autoresearch/`:

```
autoresearch/
  iter-0.md                    ← baseline write-up (no change; "this is where we started")
  iter-0-ci.json               ← tachometer JSON for CI suite
  iter-0-todo.json             ← tachometer JSON for TodoMVC macro
  iter-0-todo-micro.json       ← tachometer JSON for TodoMVC micro
  <file>.baseline.js           ← frozen snapshot of the file being modified

  iter-1.md                    ← first hypothesis attempt
  iter-1-ci.json               ← (omitted if rejected at test gate)
  ...

  iter-N.md                    ← current iteration
  iter-N-ci.json
  iter-N-todo.json
  iter-N-todo-micro.json

  best-ci.json                 ← copy of iter-N-ci.json where N is the best-known
  best-todo.json               ← updated only after a successful promotion
  best-todo-micro.json
  <file>.best-iterN.js         ← frozen snapshot of best-known source state

  SUMMARY.md                   ← written when loop stops: primary targets closed,
                                 remaining gate violations, promotion trail

  parse.mjs                    ← utility script: parses tachometer JSON → delta table
  STOP.md                      ← (if present) signal to end the loop at next checkpoint
```

**Conventions:**
- Filenames are lowercase kebab-case. `iter-3.md`, not `iteration-three.md`.
- JSON files are never rewritten — each iteration writes its own.
- `best-*.json` are **copies**, not symlinks. Source-of-truth for the next iteration's "what's our current best?" question.
- `<file>.baseline.js` and `<file>.best-iterN.js` are frozen copies, not git references. Git state during the loop is unstable.

---

## Budget and Stop Conditions

The loop must terminate. Common stop conditions:

| Condition | Rationale |
|---|---|
| All primary targets closed (within gate threshold vs main) | The work is done. |
| Iteration budget exhausted (typically 8) | Every iteration costs compute; diminishing returns past ~6. |
| Two consecutive rejects | If two hypotheses in a row didn't survive, the remaining solution space probably requires a protocol change that's out of scope for the loop. |
| `STOP.md` appears in artifact directory | External signal (human reviewer or another agent) to end cleanly. |
| Runtime cap (e.g. 3 hours wall-clock) | Safety net for unattended runs. |

Stop cleanly: finish the current iteration (write its `iter-N.md`), write `SUMMARY.md`, do not leave a half-written iteration artifact.

---

## Decision Discipline

When to **keep**: all three gates passed. Update `best-*.json` and the frozen source snapshot. Continue the loop only if primary targets aren't yet closed.

When to **refine**: one or more gates failed but the mechanism shows partial improvement. Document which gate failed and what the next seed is. Refinement usually means narrowing the change (smaller diff, tighter scope), not broadening it.

When to **revert**: the hypothesis was wrong. Two flavors:

1. **Structural revert** — test gate failed. The hypothesis violated a contract. Write the contract into the `Why it failed` section so future iterations see it.
2. **Null-result revert** — measurement gate showed no change or worse. The hypothesis didn't help. Don't rationalize; don't refine; don't iterate on the same idea twice. Move to the next seed.

When to **promote**: a kept iteration has all three gates clear AND improves the target set AND doesn't regress any non-target beyond threshold. The best-known snapshot updates. Previous best-known is archived (kept as `<file>.best-iterK.js` for history, never deleted mid-loop).

### Reporter vocabulary as loop vocabulary

Once the PR-comment reporter is in place, its classification buckets map directly onto loop verdicts. A target metric classified as a confident improvement with no non-target classified as a confident regression is a gate-passed iteration. A target metric that the reporter marks Unsure — Too Fast to Measure Precisely is a metric the loop cannot make progress on at that bench's duration. A non-target metric classified as a confident regression is a regression-gate violation regardless of how good the target looks. Prefer the reporter's taxonomy over ad-hoc pp thresholds once it's available — same decisions, better-anchored vocabulary.

---

## Failure Modes Observed in Practice

Named and battle-tested on a real loop.

### Pattern-matching the result to the hypothesis

You expected a win. The numbers show a mixed result. You look at the numbers and reach for a story that preserves the win ("the regression is just noise"). The autoresearch agent's discipline is to read what the data says before interpreting it.

**Signal**: you find yourself discounting a >3pp regression because you want to keep the improvement. **Fix**: apply the gate. A non-target regression above threshold is a reject regardless of how good the target numbers look.

### Test-gate bypass

Tests are slow. The impulse is to run a filtered subset. The hypothesis may violate a contract only the full suite encodes.

**Signal**: you skip the test gate "because I know this change is safe." **Fix**: full suite, every iteration, no exceptions. Even well-known changes can trip distant tests.

### Over-iterating on the same idea

You have a favored mechanism. Iteration N failed. Iteration N+1 tries a minor variation. Iteration N+2 tries another minor variation. Four iterations later the mechanism still hasn't paid.

**Signal**: two consecutive iterations on the same mechanism both failed. **Fix**: stop the loop. The remaining gains probably require a different category of change (protocol-level, algorithm-level) that's out of scope for the current loop.

### Local/CI divergence mistaken for noise

Local tachometer shows one result; CI shows a significantly different one for the same metric. Common divergences: Chrome version, hardware variance (JIT behavior under allocation pressure), sample-size truncation at per-bench timeout.

**Signal**: a confident-magnitude flip between local and CI. **Fix**: document both. Trust CI for the ship decision; use local for iteration feedback. Don't tune the loop to local-only signal if the CI result will contradict.

**Case study**: one benchmark measured confidently positive locally vs confidently negative in CI for the same commit — a complete sign inversion. Both measurements were technically correct; the environments differed. The loop continued using local for speed, with the understanding that the final verdict was CI's.

### Collapsing to "noise" too quickly

A small result (±2-3pp) gets labeled "noise" and the iteration is marked null. Later a trend emerges showing several "noise" iterations actually moved the metric by a stacked 10pp.

**Signal**: multiple consecutive iterations all producing sub-threshold results in the same direction. **Fix**: the threshold is a gate, not a verdict on truth. Sub-threshold *trends* across iterations are real signal; look at the sequence, not just the isolated iteration.

### Scope creep

Iteration N's change lands cleanly. The agent reasons: "while I'm here, I may as well fix the adjacent thing." Iteration N+1's change now bundles two mechanisms.

**Signal**: an iter-N.md `## Change` section spans two distinct mechanisms. **Fix**: one hypothesis per iteration, always. If two are genuinely coupled, name the coupling explicitly and call it one mechanism; otherwise split into two iterations.

### Extrapolating from undersampled plan data

Before launching the loop, an agent looks at past per-commit tachometer tables and decides "these benchmarks move in lockstep — collapse them" or "this metric is always noisy — ignore it." The decision is reasonable given the small dataset. When the loop runs against real deltas, the pattern reverses: benchmarks that correlated across a few commits show independent sensitivity to the actual change; "always noisy" benchmarks resolve cleanly when the delta is large enough.

**Signal**: a pre-loop call to restructure the suite, skip a bench, or adjust thresholds based on patterns observed in a handful of past runs. **Fix**: validate the pre-loop reasoning against real-delta data before committing to it — either run the loop against a commit with known non-trivial deltas first, or let the restructure ride a separate PR that can be reverted if the assumption was wrong. Pattern-matching on a small sample is reasoning-from-an-undersampled-corner, the opposite of what the loop is meant to do.

---

## Signs of Healthy vs Unhealthy Iteration

Healthy iteration quality looks like:
- Every iter-N.md has all required sections filled in, including rejected iterations
- Rejects have a crisp `Why it failed` that a reader can act on
- Next-hypothesis seeds build on what the previous iteration learned (not random guesses)
- Primary target numbers move monotonically toward zero (with the occasional reject/rollback mid-sequence)
- Non-target gate violations trend down across iterations, even if they don't hit zero

Unhealthy iteration quality signs:
- Iter-N.md's `Why it failed` section says "not sure, moving on"
- Next-hypothesis seeds repeat mechanisms already tried
- Primary target doesn't move for 3+ iterations
- Non-target regressions grow across iterations (the loop is drifting away from regression-gate discipline)
- No `iter-N.md` for rejected attempts (the loop is erasing its own learning)

Stop the loop on any of the unhealthy signs. Re-baseline, re-scope, or hand the work to a human.

---

## Reviewer Role

Autoresearch is autonomous but not unsupervised. A reviewer (human or separate agent) reads each iter-N.md as it lands and intervenes only when:

- The loop is drifting (unhealthy signs above)
- A gate is being misapplied (e.g. the agent promoted a result that violated the regression gate)
- A hypothesis is out of scope for the loop's framing
- The `STOP.md` signal should fire

The reviewer does **not**:
- Rewrite hypotheses
- Dispute verdicts that the gates correctly adjudicated
- Pre-empt iterations with their own opinion

The loop's autonomy is its value. If the reviewer is rewriting the agent's hypotheses, they should run the loop themselves.

---

## Quick Reference

```
# Setup
capture baseline → iter-0/ directory + frozen source snapshots
set budget (8 iterations default)
set gate thresholds (>3pp non-target regression = reject)

# Per iteration
form hypothesis with mechanism claim
implement (minimal diff)
run full test suite    ──→ fail? full revert; write iter-N.md; continue
run benchmark suite
compare non-targets    ──→ >3pp regressed? refine; write iter-N.md
compare targets        ──→ no meaningful improvement? revert
all gates passed?      ──→ promote: update best-*.json + frozen snapshot

# Always
write iter-N.md (hypothesis / change / measurement / verdict / next seed)
never commit mid-loop

# Stop when
primary targets closed OR
budget exhausted OR
2 consecutive rejects OR
STOP.md appears OR
wall-clock cap hit

# On stop
write SUMMARY.md
commit best-known state (first commit of the loop's lifetime)
```

---

## Related

| Workflow / Skill | Use when... |
|---|---|
| **improve-performance** (workflow) | General perf audit/fix/measure cycle. Autoresearch is the autonomous variant of this. |
| **plan-session** (skill) | You're scoping a perf pass and need a plan before committing to an autoresearch loop. |
| **red-team-testing** (skill) | Designing the test suite that the test gate will run against. |
| **agent-lessons** (skill) | Prior-art notes from agent sessions, including methodology patterns that generalized beyond their original task. |
