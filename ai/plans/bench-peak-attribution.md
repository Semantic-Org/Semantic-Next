# Bench Peak Attribution

## Goal

Eliminate phantom "Regressions from peak" produced by cross-session absolute-ms comparisons in the bench reporter. PR #174 (test-only, no perf-affecting code) currently surfaces 25 false REOPENED verdicts; the active perf PR #150 carries several false REOPENED among its 17 (`+1%`/`+2%` rows where main has drifted between iterations). Today the reporter cannot distinguish "iteration N regressed metric X" from "main moved between iteration N's bench and now."

The fix: persist the same-session percent-delta tachometer already emits in `differences[].percentChange`, switch peak attribution to compare those instead of cross-session absolute ms, and drop the main-history overlay on PR comments. Within-session round-robin divides out environmental variance at each end of the comparison; absolute-ms compare across sessions does not.

## Status

`scoped` — design decisions made; implementation surface concrete (5 source files + tests across 2 PRs).

## Background

Cross-run peak attribution shipped in #146 (D3b), reading `bench-history.json` populated by #145 (D3a). `computeHistoryStatus` (`reporter.js:733`) picks peak per metric as the entry with lowest absolute `ci[1]` upper bound, then classifies current vs peak as WIN / TIED-PEAK / REOPENED.

Tachometer's tight CIs are valid only *within the same session*: round-robin between current and baseline divides out OS scheduling, GC, and JIT jitter that vary across runs. Across sessions — especially when main has moved between two bench runs that each round-robin'd against their own tip-of-tree — absolute-ms comparisons mix real signal with main-side drift.

The percent-delta tachometer emits (`differences[base.index].percentChange`, already extracted at run time by `loadAllMetrics` at `reporter.js:113-150`) is the within-session-tight number. It is comparable across iterations *if the baseline (tip-of-tree) is comparable*. By persisting the baseline SHA, the reporter can both compare correctly and flag confounded comparisons when the baseline SHAs differ enough to matter.

History today has 8 v1 entries spanning 2026-04-18 to 2026-05-02 (`packages/**`-touching merges only; test/harness/docs merges skip the bench). Those entries were the data feed for the buggy peak attribution being replaced — preserving them adds no analytic value and would force dual-version reading complexity. PR 1 wipes the file to empty v2 in the same diff that turns on v2 writes; v1 input is rejected explicitly thereafter.

## In Scope

| # | Change | Track |
|---|---|---|
| A1 | Schema_v2 — persist `percent_delta_ci` + `baseline_sha` per metric. Reset `bench-history.json` to empty v2; drop v1 reading entirely. | Methodology |
| A2 | `append-history` + `fetch-pr-history` extract both fields; workflow plumbs `--baseline-sha`. | Methodology |
| A3 | Reporter peak attribution operates on `percent_delta_ci`. | Methodology |
| A4 | `--scope pr` flag; comment job drops main-history overlay. | Methodology |
| A5 | Drift flag rendering when peak vs current `baseline_sha` differ; quantify magnitude via chain-of-percent-deltas across main entries. | Methodology |
| B1 | Drop `toggle-first-10` / `toggle-last-10`; keep `toggle-middle-10` (not position-aware). | Cleanup |
| B2 | `timeout` 3→2 (conditional on validation against last ~10 main runs). | Cleanup |

## Out of Scope (Deferred)

| Item | Reason |
|---|---|
| Story-driven config rename (`tachometer-ci-rendering-throughput`, etc.) | Cosmetic. `discover.js` globs `tachometer-ci*.json` so renames are zero-code-change, but the reporter already groups metrics by source file path. Defer until the rename has a concrete consumer. |
| New end-to-end micros: `wake-count-single-key`, `nested-mutation`, `hydrate-1000-card` | Sketched in [`icebox/bench-suite-expansion.md`](icebox/bench-suite-expansion.md). Lands when underlying reactivity / hydration work creates a gating need. |
| Internal hot-path micros (`micro-expression-evaluator`, `micro-signal`, etc.) | Sketched in [`icebox/bench-suite-expansion.md`](icebox/bench-suite-expansion.md). Lands when an audit flags a hot-path regression the macro suite missed. |
| `remove-{first,middle,last}-10` triplet collapse | Rejected, not deferred. Position-aware (head/middle/tail take different splice paths in flat-list reconcile). Keep all three. |
| `branch_start_sha` schema field | No consumer asking. Cheap to add later. |
| Main-drift dashboard | Separate concern from peak attribution. Build if/when long-running perf branches make it useful. |

## Track A — Peak Attribution Methodology Fix

### A1. Schema_v2 (and v1 wipe)

`bench-history.json` and the in-memory `pr-history.json` schema_version: **2** (no v1 read path). Per-metric entries:

```json
{
  "create-1k": {
    "ci": [96.1, 97.6],
    "mean_ms": 96.85,
    "percent_delta_ci": [-2.5, -1.5],
    "baseline_sha": "abc1234..."
  }
}
```

`baseline_sha` (not `tip_of_tree_sha`) for honesty across both run types. Push-to-main and PR-iteration entries carry the field uniformly.

The 8 existing v1 entries get wiped — committed as `{"schema_version": 2, "commits": []}` in this PR's diff. v1 reading is dropped from both `loadHistory` and `readOrSeedHistory`; v1 input rejected explicitly. Pre-1.0 honest cleanup beats backward-compat for data that fed the bug.

### A2. Append + fetch capture both numbers

- `append-history.js:loadMetrics` pairs `this-change` with `tip-of-tree` per metric, reads `differences[base.index].percentChange.{low,high}`, persists as `percent_delta_ci`. Same change in `fetch-pr-history.js:loadMetrics`.
- New `--baseline-sha` CLI flag on `append-history.js`. Workflow resolves and passes:
  - PR run (`benchmarks.yml:138`): `git rev-parse FETCH_HEAD` after baseline checkout.
  - Push-to-main (`benchmarks.yml:135`): `git rev-parse HEAD~1` after parent checkout.
- The bench workflow writes `baseline-sha.txt` alongside the tachometer JSON in the upload artifact. `fetch-pr-history.js` reads the sidecar from each downloaded prior run; iterations predating this PR's deployment had v1 entries that the wipe removed, so no historical compatibility surface.
- `loadHistory` and `readOrSeedHistory` accept v2 only. v1 input throws on append (caller must reset) or returns null on read (graceful no-history path engages).

### A3. Reporter switches peak attribution to percent-delta

`computeHistoryStatus` (line 733) currently picks peak by lowest absolute `ci[1]`. Change to: peak = entry with most-negative `percent_delta_ci[1]` upper bound.

WIN / REOPENED / TIED-PEAK comparison runs on percent-delta CIs instead of absolute CIs. Cross-session environmental variance is divided out at each end. `delta_from_peak_pct` becomes (current pct-delta midpoint) − (peak pct-delta midpoint) — a meaningful "you regressed N percentage points of improvement" number.

Status taxonomy unchanged in name, more honest in computation.

### A4. `--scope pr` flag

`benchmarks-report.yml:58-61` overlays main's `bench-history.json` onto the PR checkout before invoking the reporter. Add `--scope pr` to `reporter.js`; comment job invokes it. Drop the "Fetch latest bench-history.json from main" step from the comment job.

Behavioral effect:
- Test-only / no-prior-bench PRs (#174-style): peak attribution sees only PR-iteration history, which is empty → "Regressions from peak" section disappears. The bug is the bug.
- Iterative perf PR (#150-style): peak from PR iterations only → only surfaces "iteration N was better on metric X than current." This is the load-bearing autoresearch signal.
- Push-to-main runs: untouched. History archival continues as today (now writing v2 entries to a freshly-emptied file).

### A5. Drift flag

When current and peak entries have different `baseline_sha`, quantify the cumulative main-side drift on the metric by walking `bench-history.json` between the two baseline SHAs and combining each main commit's `percent_delta_ci`. Absolute-ms comparison between two main entries would re-introduce the cross-session unreliability the rest of this plan exists to fix; the chain-of-percent-deltas is the only methodologically valid path.

Combine: `∏(1 + pct_i) − 1` precisely; for small values the sum of the chain approximates well. Threshold: cumulative drift ≥ ~5pp triggers the flag. Below that, drift is in the runner-noise floor across the chain and would clutter every long-running PR.

```markdown
| metric | current | peak | vs peak | bisect candidates |
| `create-1k` | -2% ⚠️ | -10% @ `abc1234` | regressed +8pp | `def5678`, `9abc012` |

⚠️ main moved +6pp on this metric between baselines (`abc1234` → `def5678`,
   chained across 4 main commits). Comparison may include main-side change.
```

Use the existing severity emoji slot for visual consistency with the Faster/Slower section style. One footnote per flagged row.

**Chain-gap handling.** If main commits between the two baselines lack `percent_delta_ci` (or main-history is empty — the day-zero case after the wipe), the chain can't be fully computed. Render the flag without a magnitude:

```markdown
⚠️ main moved between baselines; drift magnitude unavailable
   (0/N entries available in chain). Comparison may include main-side change.
```

Honest about the data gap; the disclosure still fires. Fixtures cover the chain-walking *logic*; real history grows the quantification *utility* over weeks as v2 entries accumulate (~3-4 weeks for full chain coverage on most PR windows).

## Track B — Suite Cleanup (independently shippable)

### B1. `toggle-{first,last}-10` collapse

Per the original suite-rationalization rationale: `toggle` operations are not position-aware (same code path regardless of position in the list). Three metrics measure the same thing.

- `tachometer-ci-todo-micro.json`: drop `toggle-first-10` and `toggle-last-10` measurement entries from both `this-change` and `tip-of-tree` benchmark blocks.
- `bench-todo.js`: drop the corresponding `performance.measure` calls.

`remove-{first,middle,last}-10` stays as three metrics — those ARE position-aware (head/middle/tail splice paths differ in flat-list reconcile).

### B2. `timeout` 3→2 minutes (conditional)

Validate first against the last ~10 push-to-main runs' wall-clock for the slowest matrix cell. Quick `gh api` check:

```bash
gh run list --workflow=benchmarks.yml --branch main --limit 20 \
  --json databaseId,conclusion,createdAt,updatedAt,jobs --jq '...'
```

If 95th percentile of the slowest cell is comfortably under 2 minutes (with ~30s head-room for tachometer's auto-sample tail to converge metrics that need it), ship the knob. Otherwise keep at 3 — wall-clock is not the binding constraint today.

## Sequencing — Two PRs

| PR | Scope | Inline-validatable? |
|---|---|---|
| 1 | Track A entire (A1–A5): schema_v2 writes + reads v2 only, peak switch, `--scope pr`, drift flag, `bench-history.json` reset | Bench job validates inline (PR head's workflow runs the new writers and tests). The comment job runs via `workflow_run` which uses main's reporter copy — comment behavior validates only after merge. Mitigation in Risk below. |
| 2 | Track B: B1 + B2 | ✓ — `pull_request` event uses PR head's workflow. |

PR 2 lands whenever — independent of PR 1.

## Files Touched

| File | PR | Change |
|---|---|---|
| `tools/ci/bench/reporter/append-history.js` | 1 | Pair `this-change` + `tip-of-tree` to extract `percent_delta_ci`; accept `--baseline-sha`; `readOrSeedHistory` accepts v2 only. |
| `tools/ci/bench/reporter/fetch-pr-history.js` | 1 | Same extraction; read `baseline-sha.txt` sidecar from downloaded artifacts. |
| `tools/ci/bench/reporter/reporter.js` | 1 | `loadHistory` accepts v2 only; `computeHistoryStatus` operates on `percent_delta_ci`; `--scope pr` flag; drift-flag rendering with chain-of-percent-deltas. |
| `tools/ci/bench/reporter/bench-history.json` | 1 | Wipe to `{"schema_version": 2, "commits": []}`. |
| `tools/ci/bench/reporter/append-history.test.js` | 1 | Update to v2 expectations; add tests for `--baseline-sha` plumbing and v1 rejection. |
| `tools/ci/bench/reporter/reporter.test.js` | 1 | Update `fixtures/history-sample.json` to v2; add tests for percent-delta peak, `--scope pr`, drift flag, chain-gap handling. |
| `.github/workflows/benchmarks.yml` | 1 | Resolve baseline SHA from baseline checkout; write `baseline-sha.txt` to results dir; include in upload artifact path. |
| `.github/workflows/benchmarks-report.yml` | 1 | Pass `--baseline-sha` to `append-history` (read from artifact sidecar); drop main-history overlay step on comment job; add `--scope pr` to reporter call. |
| `packages/component/bench/tachometer/tachometer-ci-todo-micro.json` | 2 | Drop `toggle-first-10`, `toggle-last-10` entries from both benchmark blocks. |
| `packages/component/bench/tachometer/bench-todo.js` | 2 | Drop the corresponding `performance.measure` calls. |
| `packages/*/bench/tachometer/tachometer-ci-*.json` (5 files) | 2 (conditional) | `timeout` 3 → 2 if validation passes. |

## Sessions (estimated)

1. **PR 1 — methodology fix end-to-end** (~7-9h pair). Schema_v2 capability, peak attribution switch, `--scope pr`, drift flag with chain-of-percent-deltas, fixture + test rebuild, workflow plumbing. Bigger diff but no inter-PR timing dependency.
2. **PR 2 — suite cleanup** (~2h pair). Triplet drop is mechanical; knob change is gh-api validation + JSON edits. Independent.

## Risk

Bench infrastructure, not user-facing framework code. Blast radius: bench bot comments and the JSON adjunct that agents consume.

- **Comment regression on in-flight PRs**: PR 1 changes the comment shape on every active PR's next bench run after merge. Cosmetic, not blocking — reviewers see fewer phantom regressions, not more.
- **`workflow_run` constraint on PR 1's reporter changes**: doesn't validate inline (`workflow_run` always uses main's workflow copy, not the PR head's). The bench job validates via inline fixtures and the test suite, but the live comment a reviewer sees on PR 1 itself is still rendered by main's pre-merge reporter. Mitigation:
  - Offline fixture coverage. `tools/ci/bench/reporter/fixtures/` extends with v2 history fixtures plus handcrafted tachometer JSON exercising the drift flag, `--scope pr` against empty PR-iteration history, and the chain-gap rendering case.
  - Shadow-mode validation. Run the new reporter offline against ~10 prior merged PRs' artifact sets via `gh run download`; compare to the posted comments and investigate every disagreement before merging.
  - Land at a quiet window (no active perf PRs in flight). Immediately open a trivial follow-up PR touching `packages/**` so the first real bench run after merge exercises the new reporter against real data.
  - Prepare the revert commit before merging; target revert latency is minutes, not hours.

## Dependencies

None. The two PRs are independently revertable.

## Open Questions

None.
