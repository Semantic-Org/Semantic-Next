# Bench Amplification Audit

## Goal

Every metric in the bench suite must be able to resolve a 2% delta on the GHA runner. Today some metrics fail this contract via three different failure modes, and the reporter ends up flagging them as "Too Fast" or "Inconclusive" on every iteration regardless of what the PR did. A bench that always lands in those buckets gives the reader zero signal, which is the opposite of why the bench exists.

The PR #183 audit at `ai/workspace/artifacts/pr-183-bench-audit/` already contains the data needed to identify the failing metrics. The work here is to amplify them within their existing operation (more iterations or larger scale — never a different operation).

## Background

Three failure modes feed "always-Too-Fast / always-Inconclusive":

1. **rAF-saturated** (`bench-template-reactivity.js`). Five metrics — `active-indicator-200`, `stable-ref-mutate-500`, `snippet-args-per-key-100`, `snippet-in-subtemplate-100`, `active-indicator-nested-200` — measure exactly `cycle_count × 16.667ms` because `await flush()` sits inside the inner loop and the per-cycle work is sub-frame. The wall clock reports rAF cadence, not work cost. Three more metrics in the same file partially saturate.

2. **Cross-session-variance dominant.** Within-session CI is tight, but the metric's mean wanders across sessions. The audit found 13 metrics with cross-session midpoint ranges divided by within-session CI widths exceeding 3× — `remove-row-front-20` 13.34×, `remove-row-middle-20` 11.70×, `bulk-add-500` 5.20×, ten more. The bench's wall-clock isn't dominating host-side allocation/GC variance.

3. **Absolute duration too short.** Mean duration in the 5-20ms band where σ≈2ms produces ±5-15% expected noise. The 2% gate is below the bench's physical floor.

The bench-comment-truthfulness PR delivered Tier 1 reporter fixes that surface these failures honestly in the PR comment. This plan is the Tier 2 follow-through: fix the failing benches.

## Why this is a separate plan

Amplifying a metric (`remove-row-front-20` → `remove-row-front-100`) breaks comparability with any in-flight branch whose bench files predate the change. The FGR branch in particular is being re-planned right now, and its existing bench-bot comment history is load-bearing diagnostic data. Landing amplification while FGR is open silently invalidates that history. This plan waits until FGR's path forward is settled — either rebased onto post-amplification main or restarted from a clean branch.

## Design / Implementation

### Audit pass

For each bench file in `packages/*/bench/tachometer/`:

1. Read the per-metric mean duration from the latest main bench-history entry.
2. Compute the cross-session ratio (variance ratio audit data is at `ai/workspace/artifacts/pr-183-bench-audit/` — start there, refresh against the latest 5 main pushes if needed).
3. Flag any metric that fails ANY of:
   - rAF-saturated (mean ≈ N × 16.667ms within tolerance, where N is the cycle count)
   - Mean duration < 20ms
   - Cross-session ratio > 3×

### Fix pass

For each flagged metric, amplify within the operation:

- **rAF-saturated.** Move `await flush()` outside the timed region (one rAF, not 50), or amplify per-cycle work (more children per subtemplate, larger workload). Naming: keep the existing metric name unless the workload semantics genuinely change, in which case rename and update the tachometer config.
- **Cross-session-variance dominant.** Increase iteration count until wall-clock dominates host-side noise. Naming: rename to reflect the new iteration count (`remove-row-front-20` → `remove-row-front-100`).
- **Absolute duration too short.** Loop the operation enough times to clear the 20ms floor. Naming: same as above.

### Discontinuity handling

Renames and silent iteration-count changes both break in-flight branches' comparability. Prefer rename — the discontinuity is explicit and forces in-flight branches to rebase before getting useful comparisons, which is what we want.

## Open Questions

- Should rAF-saturated metrics keep their names if the fix is "move rAF outside the timed region" rather than amplifying work? The semantics shift from "50 cycles of frame-budget waiting" to "one frame of measured work." Argument for rename: the metric measures something different now. Argument for keep: same operation, same scale, just instrumentation correction.
- For metrics in `bench-todo.js` mirroring TodoMVC contestant patterns, is there parity to preserve? The skill says yes-for-krausest and no-for-todo, but worth confirming before amplifying todo-side metrics.

## Dependencies

- [Bench Comment Truthfulness](../active/bench-comment-truthfulness.md) — Tier 1 lands the reporter fixes that make the audit findings visible in PR comments. This plan acts on those findings.
- FGR resolution — waits until any in-flight FGR branch is either rebased onto post-amplification main or restarted clean. Otherwise, the FGR branch's existing bench-bot history loses comparability against the new metric definitions.

## Status

`initial` — needs the failing-metric list refreshed against the latest main bench-history before scoping. Audit data at `ai/workspace/artifacts/pr-183-bench-audit/` is the starting point; the actual work needs a current-data pass.

## References

- Audit artifacts: `ai/workspace/artifacts/pr-183-bench-audit/`
- Skills: `extend-bench-suite` (duration → resolution table), `read-bench-report` (Inconclusive vs Too Fast classification), `improve-performance`
- Sibling plan: [Bench Comment Truthfulness](../active/bench-comment-truthfulness.md)
