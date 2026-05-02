# Tachometer Overhaul

## Status

**Superseded for active planning by [`../bench-reporter-overhaul.md`](../bench-reporter-overhaul.md)** (ROADMAP P15).

PR A (CI parallelization) and PR C (in-house Node reporter) shipped from the original design. PR B (suite rationalization + knob tuning) was partially absorbed (`autoSampleConditions: ["2%"]`, partial triplet collapses, `tachometer-ci-hydrate.json`) and partially carried forward into the active plan as **Track B** of the overhaul.

A separate methodology bug surfaced after PR C shipped — peak attribution operating on cross-session absolute ms produces phantom "regressions from peak" on PRs without perf changes (PR #174 surfaced 23 of these). The fix lives in the active plan as **Track A** (schema_v2 with within-session percent-delta + tip-of-tree SHA, `--scope pr` flag, tip-of-tree drift flag).

This file remains as historical design context — the principles, status taxonomy rationale, JSON schema design, and PR A / PR C execution playbooks are referenced by the active plan rather than repeated. Read this for the *why* behind decisions in the active plan; read the active plan for what's getting built next.

The full plan below was the original three-PR design; sections describing PR A and PR C are historical context for what shipped.

---

## Original framing

Coordinated overhaul of **what** we measure, **how** the CI runs it, and
**how the results are reported**. Three changes land together because they
only pay off in combination: a cleaner suite wasted in the old reporter
gains little; a new reporter over the current noisy suite gains little;
and neither is usable without parallel CI to keep wall-clock under 10 min.

Audience is both the PR reviewer and the next autoresearch agent session.
The guiding rule is **no row without an action pointer** — every line in
the artifact should either move a decision forward or get cut.

## Framing principles

1. **Agent handoff, not status report.** The artifact must answer "what
   should I try next?" — not "where are we?". Wins and losses without a
   next-action pointer are wasted signal.

2. **Honest CIs only.** Tachometer resolves 95% CIs before emitting a
   number, or marks the result `unsure`. Overlapping CIs = statistical
   tie, not "one run was lucky". Peak = the commit whose CI dominates
   all others on a metric, or the cluster of commits whose CIs overlap
   at the bottom.

3. **Absolute `this-change`, not PR-vs-main delta, for cross-commit
   comparisons.** Main moves under a long-lived perf PR. Deltas across
   commits mix two moving parts; absolute `this-change` CIs for each run
   give the branch's own trajectory cleanly. Delta-vs-main stays as a
   secondary column for context.

4. **Branch-start baseline, not current main, for progress claims.** "How
   far we've come on this branch" needs a stable reference. First run on
   the branch is that reference.

5. **Stories over rows.** Three macro suites organized by *what is being
   measured*, not by benchmark origin. Micros cover internal hot paths
   that end-to-end benches can't isolate.

6. **Parallel, fast feedback.** One CI job per config, ≤10 min wall-clock,
   per-check status, edit-in-place comment. Slow feedback kills iteration.

## Suite rationalization

### Problem with the current suite

27 benchmarks across three configs (`tachometer-ci.json`,
`tachometer-ci-todo.json`, `tachometer-ci-todo-micro.json`). Watching it
move across 17 commits on `perf/native` revealed two issues:

1. **Redundancy without positional relevance.** Triplets like
   `filter-all/active/completed` and `toggle-first/last/middle` move
   within ±1-5pp of each other on nearly every commit. They triangulate
   noise but add nothing that one representative wouldn't catch —
   at 3× the noise budget and 3× the comment surface area.

2. **Coverage gaps on framework-relevant patterns.** Fine-grained
   reactivity (wake count on a single-key mutation), nested mutation
   (`items[i].nested.x = v`), and SSR hydration end-to-end are all
   invisible to current PR CI.

### Rationale for which positional triplets stay

Keep positional triplets *only* when the algorithm under test is
position-aware — i.e. when front/middle/back exercise different code
paths or data layouts.

- **Remove operations are position-aware.** Head removal vs splice vs
  tail pop take different paths in both the reconcile loop (marker
  bookkeeping, DOM removal order) and the underlying state array.
  **Keep** `remove-first/middle/last` (micro) and
  `remove-5-front/middle/back` (macro).
- **Toggle-* operations are NOT position-aware.** Same code path
  regardless of N. **Collapse** to `toggle-middle` alone.
- **Filter-* operations are NOT position-aware.** Filter iterates every
  item regardless of result set size. **Collapse** to `filter-completed`
  (most sensitive through the rendering path).

### Cuts

| Drop | Rationale |
|---|---|
| `ci/create-10k` | 10× N of create-1k, same op. 1k catches constant-factor regressions; 10k is dominated by allocation overhead that rarely moves independently. |
| `todo/bulk-add-200` | 4× N of bulk-add-50, same op. Moves in lockstep. |
| `todo-micro/toggle-first` | Collapsing to `toggle-middle`. |
| `todo-micro/toggle-last` | Collapsing to `toggle-middle`. |
| `todo-micro/filter-all` | Collapsing to `filter-completed`. |
| `todo-micro/filter-active` | Collapsing to `filter-completed`. |

Net: 27 → 21 macro benchmarks before adds.

### Keeps (unchanged — pulling their weight)

- **Krausest-style (6):** create-1k, append-1k, update-10th, select, swap-rows, clear
- **TodoMVC macro (8):** bulk-add-50, add-20, toggle-10, toggle-all, remove-5-front, remove-5-middle, remove-5-back, clear-completed
- **TodoMVC micro (7):** toggle-middle, remove-first, remove-middle, remove-last, filter-completed, edit-start, edit-save

### Adds

Reclaim the budget from cuts to cover current gaps:

1. **`reactivity-micro/wake-count-single-key`** — mutate one key on one
   item in a 1000-item each. Assert on wake count, not timing. Ideally
   a `Reaction.setTracing()`-backed counter emitted via
   `performance.mark()` and read out in tachometer via a measurement
   expression. Directly exposes the fine-grained-reactivity win when it
   lands.

2. **`reactivity-micro/nested-mutation`** — `items[i].nested.x = v` on a
   1000-item list with nested objects. Measures the current coarse-notify
   path vs any future fine-grained scheme. Also the gate for the
   freeze-default design choice — with freeze-on-set this either works
   or throws; either outcome is measurable.

3. **`hydration-macro/hydrate-1000-card`** — full hydration path for
   `/perf/hydrated`: `renderToString()` output into DOM, time to
   `hydrate()` complete, time to first interactive update. Today's
   biggest perf story (the hydration pass on `perf/native` was a ~425ms
   regression that took four plans to close) has no PR-gate signal.

### Story-driven reorganization

Reorganize configs around *what is being measured* rather than *origin
of benchmark*. Four story-driven suites:

- **`rendering-throughput`** — mount/append/swap/teardown under load.
  create-1k, append-1k, swap-rows, clear, bulk-add-50.
- **`reactivity`** — update propagation efficiency.
  update-10th, toggle-middle, toggle-all, toggle-10, edit-start,
  edit-save, add-20, wake-count-single-key, nested-mutation.
- **`structural-changes`** — reordering / removal / filter.
  remove-first/middle/last (micro), remove-5-front/middle/back (macro),
  filter-completed, clear-completed, select.
- **`hydration`** — SSR + hydrate.
  hydrate-1000-card.

Each suite's PR comment becomes interpretable at a glance: "reactivity
got 30% faster, structural-changes held, hydration regressed 5%" tells
a reviewer *where to look*. Today they cross-reference three tables of
27 mixed-axis rows.

## Internal hot-path micro-benches (file-scoped coverage)

End-to-end benches mask internal-hot-path regressions. A 20% regression
in the expression evaluator shifts `update-10th` by maybe 2-3%, below
the noise floor. A PR that only touches `expression-evaluator.js` gets
no meaningful signal from the end-to-end suite.

### Candidates (one config per hot-path file)

| Config | Covers | Ops per sample |
|---|---|---|
| `micro-expression-evaluator` | `expression-evaluator.js` | Lookup (`a.b.c`), JS (`a + b`), helper call, ternary, mixed Lisp/JS |
| `micro-signal` | `packages/reactivity/src/signal.js` | `set(same)` (equality fast path), `set(changed)`, `notify` with N subscribers, subscribe/unsubscribe churn |
| `micro-reaction-scheduler` | `packages/reactivity/src/reaction.js` | flushTask, microtask coalescing, dependency-set diffing, nested-reaction teardown |
| `micro-template-compiler` | `packages/templating/src/*` | Parse (cold), parse (cached), AST walk, snippet args extraction |
| `micro-build-html-string` | `packages/renderer/src/build-html-string.js` | Fragment serialization, attribute binding scan, DSD marker emission |
| `micro-dom-walker` | `packages/renderer/src/engines/native/renderer.js` (bindMarkers walker) | Single-pass SHOW_ELEMENT\|SHOW_COMMENT over 1000-node tree, blockDepth skip, per-item marker adoption |

### Triggering strategy

**Run all micro-benches on every PR.** They are cheap (<30s total).
Arguments for conditional per-file triggering exist (less CI load), but:

- Cross-file regressions are real — a change to `signal.js` can move the
  expression evaluator's observed cost. Always-run catches these.
- Conditional logic adds workflow complexity for small savings.

If CI cost becomes a concern, use a `[skip-micro]` commit message tag
rather than path-based routing. Keep the opt-out simple.

### Why micros complement the macro suite

Macro suites tell the *product* story (user-observable latency). Micros
tell the *implementation* story (per-op cost). Both are needed:

- A 3× wake-count reduction at the Signal layer may show as only 5% in
  `update-10th` because DOM work dominates. Macro undersells the win.
- An allocation regression in the expression evaluator may not move any
  macro bench measurably but will cause GC pauses on heavy pages.
  Macro misses the regression entirely.

A comment showing "macro suite held, `micro-expression-evaluator`
regressed 40%" is diagnostically gold: regression is isolated to one
unit, fix is local.

## CI orchestration

### Time budget — where the 32 min goes today

Runs of the current 27-bench suite take 31-33 min consistently. Three
coordinated levers close that gap. The suite cut above is lever 1 of 3;
all three ship together.

Per config today, tachometer does:

1. **Mandatory floor**: `sampleSize` (50) × 2 URLs × N metrics, round-robin
   at ~300-500ms per sample. For a 7-metric config: ~700 samples ≈ 5 min
   just to reach the sample-size floor.
2. **Auto-sample tail**: up to `timeout` (5 min, micro 3 min) chasing
   every metric's CI against `autoSampleConditions`.

Current configs ask for `autoSampleConditions: ["0%", "10%"]` — both
"is there any difference?" *and* "is the difference ≥10%?". The `0%`
condition cannot converge when the true delta is truly zero
(tachometer's own docs flag this: "if the actual difference is very
close to a condition, the condition will never be met and the timeout
will expire"). Every `unsure 🔍 -0% - +0%` verdict is 3-5 min of
compute producing a non-actionable answer.

Relaxing to `["10%"]` would be the wrong fix: autoresearch *depends* on
sub-10% signal because small wins stack. A 3% improvement on update-10th
plus 2% on swap-rows plus 1.5% on clear is a real perf story; with a
10% floor they're all rounded to "within 10%" and the feedback loop is
dead.

### Knob tuning (ships with the config rationalization)

| change | current | proposed | effect |
|---|---|---|---|
| `autoSampleConditions` | `["0%", "10%"]` | `["2%"]` (start), tighten to `["1%"]` if data supports | kills the zero-convergence tail; floor set by runner noise, not preference |
| `timeout` (per-config cap) | 5 / 5 / 3 min | 2 min uniform | caps worst case; aligns with the 3-min per-bench cap below |
| `sampleSize` | 50 | **keep 50** | don't erode the floor when the other knobs pay back enough |

The resolution floor is a **runner-noise question, not a preference
choice.** On a quiet workstation tachometer narrows well under ±0.5%;
on shared GHA runners at `sampleSize: 50`, small-time metrics
(`toggle-*` ~2ms, `edit-save` ~20ms) routinely carry CI widths of
1-2% relative. Below that floor we can't converge regardless of how
long we sample.

**Validation step before committing the value:** pull CI widths from
the last ~10 runs on `perf/native`, look at the distribution per
metric. If ≥90% of metrics routinely converged to CIs narrower than
±1%, use `["1%"]`. If the floor is closer to ±2%, use `["2%"]`. Start
at `["2%"]` as the safe default — a metric resolved at ±2% still
preserves the stackable autoresearch signal; a metric that won't
converge produces `unsure` and wastes compute.

Why `["2%"]` keeps autoresearch signal:

- **True delta 5%**: CI narrows to ~[4%, 6%], entirely outside ±2% →
  converges with actual magnitude preserved.
- **True delta 0.3%**: CI ~[-0.5%, +1.1%], within ±2% → converges as
  "within 2% (noise floor)". Fast, not `unsure`.
- **True delta 0%**: CI ~[-0.8%, +0.8%], within ±2% → converges
  quickly. No more timeout on zero deltas.
- **Boundary case**: only metrics with true delta right at ±2% can
  fail — narrow sliver.

A 3% + 2% + 1.5% stack still surfaces: each individual metric
resolves to its actual magnitude (the CI of a 3% delta is outside ±2%,
so the output is the real `[2.5%, 3.5%]`, not "within 2%"). The floor
is only what we *round to* when the true effect is smaller than we can
distinguish.

For debugging a specific borderline metric, run locally with
`autoSampleConditions: ["0.5%"]` and a longer timeout — never in CI.

### Combined impact of the three levers

| lever | serial time |
|---|---|
| Current (27 benches, `["0%", "10%"]`, 3 serial configs) | ~32 min |
| + suite cut (21 → 27 with adds, still 3 configs) | ~28 min |
| + knob tuning (`["10%"]`, 2-min cap) | ~12-15 min |
| + parallel matrix (one job per story-driven config) | **~5-7 min wall-clock** |

The suite cut alone doesn't hit the target; the knob tuning alone
doesn't hit the target; parallelization alone doesn't hit the target.
All three together do.

### Parallel config jobs (matrix strategy)

One GitHub Actions job per tachometer config, running concurrently.
Wall-clock = duration of the slowest config, not the sum.

- Current slowest configs run ~10-12 min each on the full 27-bench suite.
- After cut + knob tuning + split: each config runs 3-8 benches with a
  2-min auto-sample cap. Slowest individual config targets ~5-7 min;
  micros run in ~1-3 min.
- **Target: under 10 min wall-clock**, driven by the slowest macro
  config (likely `structural-changes` with the remove-* triplets).

### Per-check PR statuses

Each parallel job exposes as a separate check in the PR checks panel.
A single red X next to `micro-signal` tells a reviewer exactly what
regressed without opening the comment. This is the piecemeal feedback
that agents can surface via `gh pr checks` and humans can scan in
the GitHub UI.

**Check conclusion taxonomy.** Red X means "we measured a regression."
UNSURE metrics use `neutral` conclusion, not `failure` — collapsing
"couldn't tell" into the same signal as "confirmed regression"
misleads both humans and agents. Per-suite rule: any REGRESSED metric
→ failure; otherwise any UNSURE metric → neutral; otherwise success.

### Budget cap per bench

Hard per-bench timeout (3 min each). If a bench times out, it reports
`unsure — insufficient samples` and the suite moves on. 9/10 confident
results in 10 min beats 10/10 in 40 min where some are unrigorous anyway.

### Concurrency control

Add `concurrency: { group: bench-${{ github.ref }}, cancel-in-progress: true }`
to `benchmarks.yml`. Rapid pushes currently stack runs; an older run
completing last can overwrite the comment from a newer run. Already
identified in the earlier CI review; fix lands with this overhaul.

### Tiering (fallback, not recommended yet)

If per-PR time stays painful even after parallelization:

- **Always-run:** micros + high-signal macros (update-10th, toggle-all,
  swap-rows, clear, bulk-add-50).
- **Nightly (cron on main):** positional remove-* triplets, create-10k,
  full TodoMVC macro.

Downside: regressions in nightly-tier benches surface days later, past
bisection-cheap. Fallback only.

## Reporter redesign

Replace `andrewiggins/tachometer-reporter-action@v2` with an in-house
Node script, **capped at ≤300 LOC with a minimal test surface.** If
it grows beyond that in initial implementation, it's accruing
maintenance debt that wasn't priced into the replace-vs-depend
decision — stop, reconsider, possibly find a narrower scope. Reasons
to own it at all:

- The action's HTML output requires regex parsing. Every agent doing
  autoresearch runs the same `<h4>…<strong>…<em>` extraction. Native
  markdown table removes that step entirely.
- The action buries the commit SHA in HTML `data-*` attributes. Humans
  reading the comment can't tell which commit's numbers they're looking
  at without cross-referencing Checks.
- The "⏳ results are out of date" banner over stale data misleads both
  humans and agents. Stale data with a banner is worse than no data.
- We own the format → we can evolve it for agent autoresearch (attempts
  graveyard, REOPENED taxonomy, JSON adjunct) without patching an
  upstream action.

### Comment shape

```
## Bench — `7efaff9` · Perf: Gate each phase-3 notify on shallow prop diff
Branch start: `56554b4` · 25 commits · run #42 @ 2026-04-14 18:36Z · [full run ↗](url)

**Wins 14** · Tied-peak 8 · **Regressed 5** · Unexplored 0 · Unsure 0

### Regressed from peak (sorted by severity)
| metric            | current CI      | peak CI        | peak commit                              | bisect candidates   |
|-------------------|-----------------|----------------|------------------------------------------|---------------------|
| update-10th       | [13.8, 14.3]ms  | [9.5, 10.1]ms  | `782d01b` Bug: stringify item keys       | `7924af5`, `deb712c`|
| toggle-last       | [2.4, 2.7]ms    | [1.7, 1.9]ms   | `00f8141` Feat: Add deepFreeze           | `7924af5`           |

Bisect-candidates column caps at 2-3 (nearest-to-peak + most-recent).
Full list per metric lives in the JSON adjunct.

### Wins vs branch-start (collapsed)
<details>
[full table: metric | current CI | branch-start CI | Δ]
</details>

### Abandoned attempts
- `11adcca` Perf: Specialize defineBlock reaction callback — reverted in `0873084`
  - observed: update-10th [x,y] → [a,b], toggle-last [x,y] → [a,b]

### Top commits by net perf impact (wins − regressions caused)
- `782d01b` Bug: stringify item keys                       +6 net
- `9071884` Perf: per-item markers + DOM-reusing first mutation  +4 net
- `7924af5` Perf: Gate each phase-3 notify on shallow prop diff  −2 net
- `deb712c` Perf: Skip itemSignal.notify on freshly-created      −1 net

### Machine-readable
[bench-report.json ↗](artifact-url) — for agent consumption
```

### Status taxonomy

Every metric is classified into exactly one of:

- **WIN** — HEAD's CI dominates every prior commit's CI (non-overlapping
  below), and dominates branch-start.
- **TIED-PEAK** — HEAD's CI overlaps the top cluster. No single winner;
  HEAD is in the winning set.
- **REOPENED** — some earlier commit's CI is below HEAD's CI with
  non-overlapping margin. Metric was improved, then lost. Highest-value
  actionable signal — cherry-pick candidate.
- **UNEXPLORED** — HEAD's CI overlaps branch-start; no commit on the
  branch beat branch-start on this metric. No progress made.
- **UNSURE** — tachometer couldn't resolve within timeout (metric
  within `autoSampleConditions` threshold of the comparator). Reported
  separately; not counted as win or loss.

### Structured JSON adjunct

Alongside the markdown comment, attach `bench-report.json` as a workflow
artifact. Agents run `gh run download` → parse JSON → operate. Schema:

```json
{
  "head": { "sha": "7efaff9", "msg": "...", "intent_class": "Perf" },
  "branch_start": { "sha": "56554b4", "msg": "..." },
  "run_id": 42,
  "workflow_run_url": "...",
  "suites": {
    "reactivity": {
      "status": "complete | running | failed",
      "metrics": {
        "update-10th": {
          "status": "REOPENED",
          "current_ci": [13.8, 14.3],
          "branch_start_ci": [10.8, 11.2],
          "peak": {
            "sha": "782d01b",
            "msg": "Bug: stringify item keys so adoption actually matches",
            "intent_class": "Bug",
            "ci": [9.5, 10.1]
          },
          "tied_peak_cluster": ["782d01b"],
          "intervening_commits": ["deb712c", "7924af5"],
          "bisect_candidates": ["7924af5"],
          "vs_main_delta": "+30%"
        }
      }
    }
  },
  "abandoned_attempts": [
    { "sha": "11adcca", "msg": "...", "reverted_in": "0873084",
      "observed_impact": {"update-10th": [[9.9, 10.3], [13.8, 14.3]]} }
  ],
  "commit_impact": [
    { "sha": "782d01b", "msg": "...", "wins": 5, "regressions_caused": 0, "net": 5 },
    { "sha": "7924af5", "msg": "...", "wins": 1, "regressions_caused": 3, "net": -2 }
  ]
}
```

The markdown comment is a rendered view of this JSON; the JSON is the
source of truth.

### Persistence: commit `bench-history.json` on merge

Workflow artifacts expire (90 days default). For cross-session agent
autoresearch spanning multi-week or multi-PR perf branches, the
history *is* the asset — losing it 90 days after a run kills the
feedback loop for any long-lived perf initiative.

Solution: on merge of any PR with benchmark artifacts, append the
final `bench-report.json` to `bench/history/bench-history.json` on
main. Cheap (a few KB per merge), permanent, and the agent reading
this file has the full cross-PR history available by default.
Implement as a post-merge GitHub Action that runs once per merged PR
that produced benchmark data.

### In-progress state

Replace the "⏳ results are out of date, stale numbers below" pattern
with an explicit state line, no data rendered:

```
## Bench — `7efaff9` · Perf: ...
Status: running (4/10 suites complete) · Last complete run: `11adcca` at 14:23Z
[partial results available once more suites complete]
```

Stale data under a "currently running" banner trains readers to
distrust the comment. No-data is better than misleading-data.

### Piecemeal editing

The collector job from the parallel matrix posts the initial comment
and edits in place as each suite finishes. Readers see:

1. **t=0**: "Status: running (0/10) · building baseline"
2. **t=2m**: micros land → table row for each micro suite filled in
3. **t=5m**: fast macros land → rows fill in
4. **t=10m**: slowest macro lands → `Status: complete`, full verdict
   line + abandoned-attempts + intent-class summary rendered

Each edit is a full-comment rewrite from the latest JSON state.

## Measurement hygiene (applies to all views)

- **Peak = non-overlapping CI dominance.** If HEAD's CI lower bound
  exceeds candidate-peak's CI upper bound → HEAD regressed. If they
  overlap → tied, no regression claim.
- **Tied-peak clusters are treated as a set.** Cherry-pick arbitrarily
  within; don't rank within a tie.
- **Unsure metrics are a third state.** Not wins, not losses. Reported
  in their own bucket in both the markdown and JSON.
- **Branch-start baseline is the first run's `this-change` CI.** Stable
  reference for the "this branch" story. `vs-main` lives as a secondary
  column for context only.

## Where this lands

### Constraint: `workflow_run` uses main's workflow copy

`benchmarks-report.yml` triggers on `workflow_run`. GitHub always uses
**main's copy** of a workflow triggered by `workflow_run`, not the PR
head's. Reporter changes only take effect once merged to main; they
cannot be validated inline on the PR that introduces them.

`benchmarks.yml` triggers on `pull_request` and uses the PR head's
copy, so suite and matrix changes do validate inline.

### Staged landing — three PRs, not one

Each PR has independent correctness value and ships separately. The
10-min wall-clock target is achieved only after all three land, but
each is validatable on its own and a bug in a later PR doesn't force
rolling back earlier ones.

**PR A — CI parallelization (unblocks wall-clock immediately).**
Matrix-per-config + per-check PR status + concurrency group + 3-min
per-bench cap. Same old suite, same old reporter. The existing
`tachometer-reporter-action@v2` already handles multi-artifact
downloads (`path: results/**/*.json`), so this works without reporter
changes. Validatable inline on the introducing PR — `pull_request`
event uses the PR head's workflow copy. **Payoff: wall-clock drops to
the slowest single config (~10-12 min) from 32 min, concurrency bug
fixed.**

**PR B — Suite rationalization + knob tuning (on top of A).** New
four-story config layout, 27 → ~22 metrics, `autoSampleConditions:
["2%"]`, 2-min per-config cap. Still uses the existing reporter
(it renders any tachometer JSON). Validatable inline. Before
landing, pull CI widths from ~10 past `perf/native` runs to confirm
`["2%"]` converges; tighten to `["1%"]` if data supports. **Payoff:
suite tells a story per config, serial time drops, resolution floor
honest to the hardware.**

**PR C — Reporter replacement (on top of B).** New Node script, JSON
adjunct schema, status taxonomy, commit-impact ranking, history
persistence on merge. Delete `tachometer-reporter-action@v2` usage.
Cannot be validated inline — `workflow_run` uses main's workflow
copy, so the new reporter only runs once merged. Acceptance test: the
landing PR touches a trivial `packages/**` file; the first run after
merge exercises the new reporter and we read the resulting comment.

**Prep work before PR A: merge `perf/native` to main** — unblocks
everything downstream and gives us a clean baseline.

**Prep work before PR C: build the reporter locally first.** Pull run
artifacts from a real PR with `gh run download` as a fixture; iterate
the Node script + JSON schema + markdown renderer against real data
until the rendered comment reads correctly. Land only once the
offline rendering is right.

### Execution walkthrough — per-PR procedure

Short version of the whole loop: **A and B are "PR then merge" with
inline verification. C is "build rigorously offline, then land, then
verify on the next real PR."** Rigor is front-loaded for C to replace
the verification step we can't do normally.

#### PR A — CI parallelization

**Dev**

1. Branch off main. Modify `.github/workflows/benchmarks.yml` —
   matrix-per-config, add `concurrency` block, 3-min per-bench cap,
   separate check name per matrix cell.
2. Push, open PR. The `pull_request` trigger uses the PR head's
   workflow, so the new matrix runs immediately on this PR.

**Confirm before merge** (all visible in the PR itself)

- Actions tab shows N parallel jobs (`bench-reactivity`,
  `bench-structural-changes`, etc.) instead of one serial job.
- Checks panel lists each as its own entry — you can see red X on
  just one suite.
- Wall-clock on the slowest job ≈ what you'd expect (~10-12 min
  today, since suite is unchanged).
- Push a second commit within a minute of the first — old run should
  cancel (concurrency group).
- Comment from old `tachometer-reporter-action@v2` still renders
  correctly across multiple artifacts.

**Merge.** Clean rollback available (revert the workflow file).

#### PR B — Suite rationalization + knob tuning

**Pre-work (before branching)**

Pull CI widths from the last ~10 `perf/native` runs; eyeball what
tachometer actually resolves at on GHA. If ≥90% converge below ±1%,
ship `["1%"]`. Otherwise ship `["2%"]`. This is a ~15-min gh-api
script, no commits.

**Dev**

1. Branch off main (which now has PR A).
2. Write the four new story-driven configs
   (`rendering-throughput.json`, `reactivity.json`,
   `structural-changes.json`, `hydration.json`), matching HTML
   fixtures, delete the three old `tachometer-ci*.json` files.
3. Add the three new benches (`wake-count-single-key`,
   `nested-mutation`, `hydrate-1000-card`). Also add the six
   micro-bench configs.
4. Push, open PR.

**Confirm before merge**

- Matrix now spawns one job per new config + one per micro — check
  the list matches the plan.
- Each job completes within the 2-min auto-sample cap.
- Wall-clock target (~5-7 min on slowest) hit.
- No metric hits the old `unsure 🔍 -0% - +0%` pattern. If any do,
  the noise floor you chose is too tight — bump to `["2%"]`.
- Old reporter renders the new configs — sanity-check the comment
  reads correctly even though it's the last time we'll see it.

**Merge.** Revert is clean (restore old configs, keep matrix).

#### PR C — Reporter replacement

This is the one that can't be validated inline. Build confidence
*before* opening the PR, not during review.

**Pre-work (substantial, no PR open yet)**

1. `gh run download` artifacts from ~20 past runs across different
   branches → check into `reporter/fixtures/`.
2. Write the reporter as a ≤300-LOC Node script. Unit tests snapshot
   its markdown + JSON output per fixture. Iterate locally until
   every fixture renders right.
3. **Shadow-mode check**: render last ~10 merged PRs with the new
   reporter, diff against the old posted comments. Investigate every
   disagreement — new logic wrong, or old logic was misleading. Both
   are findings.
4. (Optional, high confidence) Push reporter to your fork's main,
   open a throwaway PR on the fork, watch the full `workflow_run`
   cycle end-to-end on infrastructure you don't care about.
5. Rehearse the revert locally on a staging branch. Confirm
   `git revert <sha>` restores the old reporter cleanly.

**Dev**

1. Branch off main. Add the reporter script, fixtures, tests.
   Replace `benchmarks-report.yml` to call the script instead of the
   action. Add the post-merge `bench-history.json` append workflow.
2. Push, open PR. **The PR's own benchmark comment will still be
   rendered by the OLD reporter** (because `workflow_run` uses main's
   copy) — so the PR comment is not a test of anything.

**Confirm before merge** (not in the PR's comment — elsewhere)

- CI runs the Node unit test suite (add it to `.github/workflows/ci.yml`
  if not already) — all fixture snapshots pass.
- Shadow-mode output reviewed.
- Fork dry-run (if you did it) was clean.
- Revert commit drafted and ready to push.

**Merge** — at a quiet window, no active perf PRs in flight.

**Post-merge acceptance test** (the actual live validation)

1. Immediately open a trivial follow-up PR — one-character change to
   any `packages/**` file — to trigger `benchmarks.yml`.
2. The first real run exercises the new reporter (main now has it).
3. Read the rendered comment critically. If wrong → push the
   prepared revert within minutes.
4. If right → monitor the next ~5 real perf PRs for subtle issues
   that only show on real data.

### Testing strategy

PR A and PR B are `pull_request`-triggered and validate inline — push
the branch, watch the run, inspect the output. Standard iterative
development; nothing special to call out.

PR C is the hard case. `workflow_run` uses main's workflow copy, so
the new reporter cannot execute on its own PR. Strategy for landing
PR C with confidence despite this constraint:

**1. Offline fixtures + unit tests (mandatory, ships in PR C).**
Pull `results/*.json` from ~20 past runs across multiple branches
with `gh run download`, check them into `reporter/fixtures/`. Write
a Node test suite that feeds each fixture to the reporter and snapshots
the markdown + JSON output. Cover the edge cases explicitly:

- all-green run (no regressions, no unsure)
- mixed run (regressions + unsure + wins)
- partial failure (one suite's artifact is missing)
- empty run (tachometer timed out, zero results)
- malformed JSON (one suite's output is corrupt)
- first run on a branch (no peak history yet)
- force-pushed branch (SHA not in the current linear history)

Snapshot tests catch the majority of logic bugs offline — status
classification (WIN / TIED-PEAK / REOPENED / UNEXPLORED / UNSURE),
CI-overlap math, commit-impact ranking, bisect-candidate selection.

**2. Shadow-mode validation against historical runs.** Before landing
PR C, run the new reporter offline against the last ~10 merged PRs'
artifact sets. For each, read the rendered output and compare to the
old reporter's posted comment. Confirm the new rendering surfaces the
same wins/regressions the old one flagged, plus the new dimensions
(peak attribution, REOPENED classification, commit-impact ranking).
If shadow-mode disagrees with the old reporter on a known-outcome PR,
the disagreement itself is diagnostic — either the new logic is wrong
or the old reporter was misleading. Either way, investigate before
merging.

**3. Optional: fork dry-run for true end-to-end validation.** Push the
new reporter to a personal fork's main, open a throwaway PR against
that fork that touches `packages/**` to trigger `benchmarks.yml`.
Because the fork's main has the new reporter, `workflow_run` there
uses it. This is the only way to exercise the full
`pull_request → workflow_run → comment` cycle without landing on
upstream main. Worth the ~15 min of setup if confidence from #1 and
#2 isn't quite enough.

**4. Land on main with caution.** Steps at landing time:

- Merge at a quiet window (no active perf PRs queued).
- Immediately open the acceptance-test PR (trivial `packages/**`
  change) — the first real run is the live validation.
- Watch the full pipeline: matrix spawns, suites complete, collector
  edits the comment, JSON adjunct uploads, post-merge history commit
  fires on the next merge.
- Keep the revert commit prepared and ready to push. Target revert
  latency is minutes, not hours.

**5. Post-landing monitor.** For the first ~5 PRs after landing PR C,
spot-check each comment against expectations. Agents doing
autoresearch in that window should explicitly flag any reading that
seems wrong — "this metric shows WIN but the number is higher than
branch-start" kind of discrepancies. Early noise catches late bugs.

### Rollback plan

Staged landing means granular rollback:

- PR A bad → revert A, keep old serial workflow. Easy.
- PR B bad → revert B, keep new matrix. Old suite runs in parallel.
- PR C bad → revert C, keep new suite + matrix. Old reporter renders
  new configs (it's format-agnostic on the tachometer JSON side).
- Structured JSON is the contract inside PR C — markdown rendering
  bugs don't compromise the underlying data; fix-forward is usually
  preferable to revert for cosmetic issues.

**Revert rehearsal.** Before merging PR C, dry-run the revert
locally: `git revert <sha>` on a staging branch, confirm the diff
restores the old action config cleanly, close the staging branch.
That way the production revert (if needed) is muscle memory, not
discovery.

## Open questions

- **Wake-count instrumentation path.** Tachometer measures timing;
  asserting on a count requires either (a) emitting the count as a
  timing delta via `setTimeout(0, count * 1ms)` (hack, measurable but
  ugly), or (b) extending tachometer with a custom `measurement` type.
  (b) is correct but is work.
- **Nested-mutation setup contract.** Reuse nested objects across
  mutations (measures `isEqual` path) or freshly spread each time
  (measures allocation path)? Both interesting; probably two benches
  under a common umbrella.
- **Hydration bench baseline.** `/perf/hydrated` currently runs against
  whatever DOM the server produced. Stable comparison needs a
  snapshotted HTML input that doesn't change when renderer output
  format changes. Probably a fixture-HTML-per-commit approach rebuilt
  on each run.
- **Bisect candidate heuristic.** "Commits after peak that touched
  likely files" requires a file→metric mapping we don't have. Start
  naive ("all commits between peak and HEAD"); refine if the signal
  is too noisy to act on. Even the naive version is more than the
  current reporter offers.
- **Attempts-graveyard detection.** Reverts are mechanical
  (`git log --grep '^Revert'`). Other abandonment patterns (commit X
  landed, commit Y silently supersedes) aren't. Start with reverts;
  add an explicit `[abandoned]` message tag if supersede cases matter.
- **Branch-start detection.** "First commit on this branch" is
  `merge-base(HEAD, main)` + 1, but PRs with force-pushes or rebases
  scramble that. Default: anchor to the first `Benchmarks` run's SHA
  (whatever commit produced the first `results/*.json` artifact
  visible on this PR's runs). Fallback if that breaks down: an
  explicit `.bench-baseline` dotfile at the repo root with a
  `BASELINE_SHA=...` line, committed once at branch start. Ship with
  the run-based default, add the dotfile mechanism only if agents
  start fighting the detection.
- **Hosting the JSON adjunct for humans.** Workflow artifacts are
  authenticated behind GitHub login. Agents with `gh` auth can fetch;
  anonymous readers of a public PR cannot. Acceptable for now (public
  repo, few anonymous readers of perf JSON); flag if ever a blocker.

## Not in scope

- Memory profiling (separate tool — Chrome heap snapshots, not tachometer).
- Framework-vs-framework comparison (Krausest comparison suite; out of
  scope for internal regression tracking).
- SSR server-side render timing alone (covered by server-side benchmarks
  in a separate runner).
- Historical backfill of pre-existing PR comments into the new format.
  Old PRs keep their old comments; new PRs use new reporter.
