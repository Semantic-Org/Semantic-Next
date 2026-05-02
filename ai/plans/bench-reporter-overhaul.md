# Bench Reporter Overhaul — Correctness & Suite Rationalization

## Goal

Coordinate two outstanding bench-bot improvements that need to land together:

- **Track A — Peak attribution correctness.** Fix phantom "regressions from peak" caused by cross-session absolute-ms comparisons. Store within-session percent-delta CIs, scope peak to PR iterations, flag tip-of-tree drift.
- **Track B — Suite rationalization remainder.** Finish the still-outstanding piece of the original `tachometer-overhaul` design: collapse non-position-aware triplets, add the fine-grained-reactivity / nested-mutation micro-benches, reorganize configs around what's measured rather than benchmark origin.

Both tracks touch `bench-history.json` and the configs that index into it. Coordinated landing avoids schema/metric-rename collisions and lets the suite reorg's new metrics start writing v2 entries from day one.

This plan supersedes [`icebox/tachometer-overhaul.md`](icebox/tachometer-overhaul.md) for active planning. The icebox file stays as historical design context — its principles section, status taxonomy rationale, and PR A / PR C history are referenced rather than repeated here.

## Background

The original `tachometer-overhaul` design landed in three coordinated PRs:

| PR | Scope | Status |
|---|---|---|
| **A** | CI parallelization — matrix-per-config, concurrency group, per-bench cap | **Shipped.** |
| **C** | In-house Node reporter (`tools/ci/bench/reporter/`) replacing `tachometer-reporter-action@v2` | **Shipped.** |
| **B** | Suite rationalization + knob tuning | **Partial.** |

What shipped from PR B:
- `autoSampleConditions: ["2%"]` across all configs.
- `tachometer-ci-hydrate.json` with `hydrate-each-100` (a partial of the original `hydrate-1000-card` design).
- Some triplet collapses (`filter-active`/`completed`/`all` → `filter-cycle-20`).

Still outstanding from PR B:
- Story-driven config reorg (configs are still origin-named: `krausest`, `todo`, `todo-micro`, `hydrate`).
- Remaining triplet collapses (`toggle-first`/`middle`/`last` still all present).
- New micro-benches: `wake-count-single-key`, `nested-mutation`. (`hydrate-1000-card` partially covered by `hydrate-each-100`; could amplify.)
- `timeout` cap from 3 → 2 minutes per config.

A separate methodology bug surfaced after PR C shipped, in PR #174 (test/templating, no perf changes): 23 phantom "regressions from peak" against an anomalous-fast main commit (#162). The shipped reporter at `tools/ci/bench/reporter/reporter.js:733` (`computeHistoryStatus`) merges main-commit history with PR-iteration history and picks peak as the lowest absolute CI upper bound across the merged set. Cross-session absolute-ms compare is what tachometer's design specifically warns against — only same-session round-robin produces tight cross-run CIs. The schema designed in PR C (`schema_version: 1`) stores only absolute `this-change` CI, discarding the percent-delta from `differences[]` that's the actually-comparable cross-iteration number.

The two tracks interact at the bench-history layer: A bumps the schema; B renames metrics and adds new ones. A clean rollout lands A's schema-write capability first so B's reorganized configs accumulate v2-shape entries from their first push.

## Track A — Peak Attribution Correctness

### A1. Schema bump — store within-session-tight numbers

`bench-history.json` and the in-memory `pr-history.json` schema_version → 2. Per-metric entries gain:

```json
{
  "create-1k": {
    "ci": [96.1, 97.6],                 // existing — absolute this-change CI
    "mean_ms": 96.85,                   // existing — derived
    "percent_delta_ci": [-2.5, -1.5],   // NEW — same-session round-robin's % vs tip-of-tree
    "tip_of_tree_sha": "abc1234..."     // NEW — SHA tip-of-tree pointed at when bench ran
  }
}
```

`percent_delta_ci` is the within-session-tight number tachometer warrants. Comparable across iterations when tip-of-tree is pinned. The `tip_of_tree_sha` lets the reporter detect main movement between iterations and flag confounded comparisons.

Existing `ci`/`mean_ms` (absolute `this-change`) stay for context and the cross-main-commit "did this commit improve over its parent" view (the original design's principle 3 is sound for that surface).

### A2. Append-history extracts both numbers

`append-history.js:64-83` (`loadMetrics`) currently filters to `this-change` and stores only its mean CI. Update to walk both `this-change` and `tip-of-tree` entries per metric, extract percent-delta from `differences[]` (the same array `reporter.js:137` already reads for current-vs-base), and record the tip-of-tree SHA passed in via new `--tip-of-tree-sha` flag.

Tip-of-tree SHA is known at bench time:
- **PR run** (`benchmarks.yml:138`): `git rev-parse FETCH_HEAD` after the baseline checkout.
- **Push-to-main run** (`benchmarks.yml:135`): `git rev-parse HEAD~1`.

`fetch-pr-history.js:91-116` does the same extraction for prior PR-iteration runs.

### A3. Reporter peak attribution operates on percent-delta

`computeHistoryStatus` (reporter.js:733) currently picks peak as the commit with the lowest absolute CI upper bound. Switch to: peak is the commit with the most-negative percent-delta upper bound on `metrics[name].percent_delta_ci`.

Status taxonomy unchanged (WIN / TIED-PEAK / REOPENED), now operating on within-session-tight numbers at both ends. Cross-session environmental variance is divided out at each end. Methodologically clean to within tachometer's design contract.

The JSON adjunct's `delta_from_peak_pct` becomes the difference between current's percent-delta midpoint and peak's percent-delta midpoint — a meaningful "you regressed N percentage points of improvement" number.

### A4. Scope peak to PR iterations only on PR comments

`benchmarks-report.yml:58-61` currently fetches main's `bench-history.json` into the reporter's working directory before invoking the reporter. This merges main-commit history with PR-iteration history at peak-attribution time.

Add a `--scope pr` flag to reporter.js that bypasses main-history loading. The comment job invokes it. Drop the "Fetch latest bench-history.json from main" step.

Behavioral effect:
- Tests-only / no-prior-bench PRs → peak attribution empty → "Regressions from peak" section gone.
- Iterative perf PR → peak from PR iterations only → surfaces "iteration N was better on metric X than current."

### A5. Tip-of-tree drift flag

When current and peak entries have different `tip_of_tree_sha`, render a flag on the row noting main moved during PR lifetime. Threshold: ~5% of metric magnitude in absolute-ms shift (below that, main movement is in the runner-noise floor anyway).

```markdown
| metric | current | peak | vs peak | bisect candidates |
| `create-1k` | -2% (≠main¹) | -10% @ `abc1234` | regressed +8pp | `def5678`, `9abc012` |

¹ tip-of-tree differs between current and peak — main moved by Δ ms during PR lifetime; comparison may include main-side change.
```

Lean: flag, don't drop. Reviewers can interpret a flagged row better than they can act on a missing one.

## Track B — Suite Rationalization Remainder

### B1. Story-driven config reorganization

Replace origin-named configs with story-driven ones — the question reviewers ask, not which file the bench came from.

| New config | Metrics (drawn from existing configs / bench files) |
|---|---|
| `tachometer-ci-rendering-throughput.json` | `create-1k`, `create-10k`, `append-1k`, `bulk-add-500`, `add-20`, `clear-10k`, `swap-rows-20` |
| `tachometer-ci-reactivity.json` | `update-10th-10`, `toggle-middle-10` (collapsed from triplet — see B2), `toggle-all-20`, `toggle-10`, `edit-start-10`, `edit-cycle-5`, plus new `wake-count-single-key`, `nested-mutation` |
| `tachometer-ci-structural-changes.json` | `remove-row-{front,middle,back}-N`, `remove-{5-front,10-middle,5-back}`, `remove-middle-10` (collapsed from triplet — see B2), `filter-cycle-20`, `clear-completed-250`, `select-40` |
| `tachometer-ci-hydration.json` | `hydrate-each-100` (existing); future `hydrate-1000-card` if/when added |

Old configs (`tachometer-ci-krausest`, `tachometer-ci-todo`, `tachometer-ci-todo-micro`, `tachometer-ci-hydrate`) are deleted. `discover.js` glob-discovers `tachometer-ci-*.json` so the matrix updates without workflow edits.

The bench JS files (`bench-krausest.js`, `bench-todo.js`, `bench-hydrate.js`) keep their fixture identities — krausest still mirrors the external js-framework-benchmark contestant, todo is still TodoMVC. The reorg is at the *config* layer (which metrics get measured under which story heading), not at the bench-file layer.

### B2. Triplet collapses

Per the original design's "position-aware vs not" rationale:

- **Position-aware → keep**:
  - `remove-row-{front,middle,back}-N` (different paths in keyed reconcile + array splice)
  - `remove-{5-front,10-middle,5-back}` (same)
- **Not position-aware → collapse to one**:
  - `toggle-{first,middle,last}-10` → `toggle-middle-10`. Same code path regardless of position.
- **Borderline — open question (see #8)**: `remove-{first,middle,last}-10` in `tachometer-ci-todo-micro`.

### B3. New micro-benches

- **`wake-count-single-key`**: mutate one key on one item in a 1000-item each. Asserts on wake count via `Reaction.setTracing()` counter, emitted as `performance.measure('wake-count-single-key', ...)` with the count encoded as ms (1ms × count).
- **`nested-mutation`**: `items[i].nested.x = v` on a 1000-item list with nested objects. Measures the coarse-notify path; gates the freeze-default design choice.
- **`hydrate-1000-card`** (optional): full SSR + hydrate end-to-end at 1000-card scale. Largely covered by amplifying `hydrate-each-100` to N=1000 — confirm whether the existing bench at higher scale satisfies the original intent or a separate fixture is needed.

### B4. Knob tuning final pass

- `autoSampleConditions: ["2%"]` already shipped across all configs. ✓
- Outstanding: `timeout` 3 → 2 minutes. Validate first against last ~10 main runs' wall-clock to confirm the cap doesn't truncate convergence on the longest-running config. Quick `gh api` / `jq` script.

## How the Tracks Interact

**Schema migration must precede metric renames.** A1 (schema_v2 capability) ships first. Then B1's reorganized configs accumulate v2-shape entries from their first main push. Old metric names (e.g. `toggle-first-10`, `toggle-last-10`) become orphan v1 entries in history; A3's reporter ignores them (no current metric named that to compare against).

**Peak attribution coverage on new metrics is delayed.** A new bench (e.g. `wake-count-single-key`) gets its first v2 entry on the main push that adds it, then accumulates one entry per main commit. Peak attribution kicks in once the PR-iteration history (or main history) has at least one entry for that metric. Same as today's add-a-bench behavior; no special handling needed.

**`discover.js` matrix is glob-based.** Renaming configs (`tachometer-ci-krausest.json` → `tachometer-ci-rendering-throughput.json`) doesn't require workflow edits. The matrix output names update naturally; PR check titles change, which is desirable.

**Test fixtures touched by both tracks.** `reporter.test.js` fixtures (`real-delta`, `zero-delta`) currently mirror the old origin-named configs (`renderer-tachometer-ci.json`, etc.). After B1 the fixture filenames update. A also updates `history-sample.json` to v2. Coordinate the fixture changes so each PR's tests run green.

**Shared `tip_of_tree_sha` plumbing.** A's `--tip-of-tree-sha` workflow output is computed once and consumed by both append-history (Track A) and the reporter step. B's config rename has no effect on the plumbing — it's per-metric, not per-config.

## Rollout — combined ordering under the `workflow_run` constraint

Reporter changes only take effect once merged. Same constraint the original `tachometer-overhaul` plan called out for PR C. Rollout order matters for the schema → suite-reorg → behavior-change progression:

| Stage | Track | Scope | Validates inline? |
|---|---|---|---|
| **PR 1** | A | Schema_v2 read+write capability. New main pushes write v2 entries; reporter reads v2 transparently but doesn't yet use it for peak attribution. No PR-comment behavior change. | Schema-write ✓ on push-to-main; comment unchanged. |
| **PR 2** | B | Suite rationalization: config reorg, triplet collapses, knob `timeout` final pass. Existing reporter renders new configs unchanged. New metrics begin accumulating v2 entries from first push. | ✓ — `pull_request` event uses PR head's workflow. |
| **PR 3** | A | Peak attribution switch to percent-delta. `--scope pr` flag. Workflow drops main-history fetch on comment job. Tip-of-tree drift flag rendered. | ✗ — `workflow_run` uses main's copy. Validate via offline fixtures + post-merge acceptance test (trivial follow-up PR). |
| **PR 4 (optional)** | B | New micro-benches (`wake-count-single-key`, `nested-mutation`). Independent of A; lands when the underlying perf work needs them. | ✓ — `pull_request`. |

PR 1 → PR 2 ordering: schema-write capability lands first so B's new configs write v2 entries from the start.
PR 1 → PR 3 ordering: schema_v2 must be writing for ~10 main pushes before PR 3 has data to read.
PR 2 ↔ PR 4 are independent of each other.

Each PR is independently revertable.

## Open Questions

1. **v1→v2 entry migration on read.** Stay v1-shape or rewrite on read? Lean: stay v1; let v2 accumulate organically. (Track A.)
2. **Schema_v1 graceful-degrade in reporter.** Fall back to absolute peak attribution, or surface no peak section? Lean: no peak section; absolute peak is what we're retiring. (Track A.)
3. **Branch-start anchoring.** Add as a third schema field, or defer? The original `tachometer-overhaul` design tracked branch-start as a stable reference for "this branch's progress" (principle 4). Lean: defer; user's stated intent satisfied without it. (Track A.)
4. **Tip-of-tree drift threshold.** What absolute-ms shift triggers the confound flag? Lean: ~5% of metric magnitude. (Track A.)
5. **Main-drift on a separate dashboard.** Build, or leave untracked? Lean: defer; track separately if/when needed. Could become its own P-track plan. (Track A.)
6. **Story-driven config naming.** `rendering-throughput`, `reactivity`, `structural-changes`, `hydration` are the original design's names. Confirm or revise. (Track B.)
7. **`select-40` placement.** Original design called select "structural"; current bench treats it as part of krausest's keyed-table workflow. Reactivity vs structural-changes is borderline. Confirm. (Track B.)
8. **Triplet collapse for `remove-{first,middle,last}-10` in `todo-micro`.** Original design said collapse all not-position-aware triplets; remove operations on a flat list ARE position-aware (head/tail vs middle take different splice paths). Keep all three or collapse to middle? Lean: keep — they're position-aware. (Track B.)
9. **Wake-count instrumentation path.** Emit count as ms-encoded measurement via `performance.mark`, or extend tachometer with custom measurement type? Lean: ms-encoded (no upstream patch). (Track B.)
10. **Knob `timeout` 3 → 2 minutes.** Validate against last ~10 main runs first. Quick gh-api script before committing. (Track B.)

## Files Touched

| File | PR | Change |
|---|---|---|
| `tools/ci/bench/reporter/append-history.js` | 1 | Extract `percent_delta_ci` + `tip_of_tree_sha`; write `schema_version: 2`. |
| `tools/ci/bench/reporter/fetch-pr-history.js` | 1 | Same extraction for PR-iteration runs. |
| `tools/ci/bench/reporter/reporter.js` | 1, 3 | PR 1: schema_v2 read support, no behavior change. PR 3: peak attribution on percent-delta, `--scope pr` flag, tip-of-tree drift flag rendering. |
| `.github/workflows/benchmarks.yml` | 1 | Compute and emit tip-of-tree SHA from baseline checkout (workflow output). |
| `.github/workflows/benchmarks-report.yml` | 1, 3 | PR 1: pass `--tip-of-tree-sha` to append-history. PR 3: drop "Fetch latest bench-history.json from main" step in comment job; add `--scope pr` to reporter call. |
| `tools/ci/bench/reporter/reporter.test.js` | 1, 3 | Update `history-sample.json` to v2; add `history-sample-v1.json` for graceful-degrade test; add tests for drift flag and `--scope pr`. |
| `tools/ci/bench/reporter/append-history.test.js` | 1 | Tests for v2 schema writing. |
| `packages/component/bench/tachometer/tachometer-ci-{krausest,todo,todo-micro,hydrate}.json` | 2 | Delete. |
| `packages/component/bench/tachometer/tachometer-ci-{rendering-throughput,reactivity,structural-changes,hydration}.json` | 2 | Create — story-driven configs. |
| `packages/component/bench/tachometer/bench-{krausest,todo,hydrate}.js` | 2 | Triplet collapse: remove `toggle-first-10` / `toggle-last-10` measurements; keep `toggle-middle-10`. |
| `packages/reactivity/bench/tachometer/bench-wake-count.js` (new) | 4 | `wake-count-single-key` micro. |
| `packages/reactivity/bench/tachometer/bench-nested-mutation.js` (new) | 4 | `nested-mutation` micro. |
| `tools/ci/bench/reporter/fixtures/real-delta/*.json` | 2 | Rename to match new config naming. |
| `tools/ci/bench/reporter/bench-history.json` | — | Auto-updated as main pushes accumulate v2 entries. No manual touch. |

## Dependencies

None blocking. PRs are independently revertable. Either track can stall without blocking the other.

## Risk

Bench infrastructure, not user-facing framework code. Blast radius is the bench bot comments and the JSON adjunct that agents consume.

- **Comment regression for in-flight PRs**: PR 3 changes the comment shape on every active PR's next bench run. Cosmetic, not blocking — reviewers see fewer phantom regressions. No data loss.
- **Schema migration race**: PR 1 must merge before PR 3 lands. Otherwise PR 3's reporter looks for `percent_delta_ci` in a v1 history. Open Question 2's no-peak-section graceful-degrade covers this — worst case, the section is empty for the gap window.
- **Metric-rename history orphans**: PR 2's triplet collapses retire `toggle-first-10` / `toggle-last-10`. Their existing v1 history entries become orphans (no current metric to compare). Reporter ignores them naturally — no current metric named that means no peak attribution lookup. No remediation needed.
- **`workflow_run` constraint**: as with the original `tachometer-overhaul` PR C, PR 3 doesn't validate inline. Mitigation: thorough offline test coverage; merge during a quiet window; have revert ready.

## Status

`initial` — combines the original `tachometer-overhaul` PR B remainder and the newly-identified peak-attribution correctness work. Ten open questions are real design calls; ~45-min pair to resolve them upgrades to `scoped`. Implementation surface is concrete (~10 source files across the four PRs, modest LOC each).

Total estimate post-scoping: 16-24h pair across 4 PRs (PR 4 optional and independent).

Supersedes [`icebox/tachometer-overhaul.md`](icebox/tachometer-overhaul.md) for active planning.

## Sessions (estimated, post-scoping)

1. **PR 1** (Track A schema_v2 capability): append-history + fetch-pr-history extract percent-delta + tip-of-tree SHA; workflow plumbing; reporter reads v2 transparently; fixture + tests. ~4-5h pair.
2. **PR 2** (Track B suite reorg): four story-driven configs replace origin-named ones; `toggle-{first,last}-10` collapse to middle; `timeout` 3→2 (after validation); fixtures rename. ~4-6h pair.
3. **PR 3** (Track A peak switch): `computeHistoryStatus` operates on percent-delta CIs; `--scope pr` flag; workflow drops main-history fetch on comment job; tip-of-tree drift flag rendering. ~3-4h pair.
4. **PR 4** (Track B new micros, optional and independent): `wake-count-single-key`, `nested-mutation`. Lands when the underlying reactivity work needs them. ~3-5h pair.
