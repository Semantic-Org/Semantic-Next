# Bench Comment Truthfulness

## Goal

Lift the per-section confidence of the `semantic-performance-bot` PR comment so a reviewer can act on it directly rather than treat it as a starting point for investigation. Two concerns drive this: reporter-side asymmetries that produce phantom regression rows on cross-iteration sections, and bench-authoring violations of the documented duration → resolution contract that hide real signal under saturated zero-deltas. Audit during PR #183 (`feat/fine-grained-reactivity`) surfaced both classes; this plan consolidates the fixes.

The objective function the bot is asked to serve is "catch win/loss against `main`" and "catch win/loss against previous commits on this PR." Today the first is at ~95% on the metrics that aren't saturated. The second varies sharply by metric — high on benches that meet the duration contract, low on heavy-allocation benches whose cross-session noise floor exceeds the reporter's uniform 2% gate. After this plan, both objectives are achievable at ~85-95% across the suite.

## Background

PR #183 audit artifacts at `ai/workspace/artifacts/pr-183-bench-audit/` document the ground evidence — JSON tachometer outputs across four iterations, reproductions of `comment.md` per iteration (byte-for-byte match), per-metric cross-session ratios, and traced code paths. The reporter is algorithmically faithful; the defects are upstream of rendering.

## Design / Implementation

### Tier 1 — reporter and bench-authoring edits

Each item below is a local change, no harness state, no new pipelines. Prioritized by aggregate confidence delta across affected sections.

| # | Fix | Surface | Mechanism |
|---|---|---|---|
| 1 | Mirror `touches_packages` filter into peak selection (`reporter.js:927-942`). Today the bisect-candidate filter at `:969` excludes harness-only commits but peak selection doesn't. Asymmetric. | reporter | Removes peaks pinned to `.github`-only or `ai/`-only iterations. Eliminates the 5-of-8 phantom Regression-from-peak rows on PR #183. |
| 2 | Add peak-quality gate: require peak iteration's own observed/expected CI ratio ≤ 2× before it's eligible. | reporter (`computeHistoryStatus`) | Prevents an outlier-noisy iteration from anchoring a peak that no future iteration can match. Caught by challenge-lens audit on `filter-cycle-20`'s peak being 5.5× expected width. |
| 3 | Truthful bisect-candidate copy. Today's text at `reporter.js:122-124` reads "the commits between the peak iteration and HEAD" — actually it's "bench-measured packages-touching commits" with cancelled and push-collapsed runs invisible. | reporter | Either annotate `(N unmeasured)` after the visible candidates, or reword the description to acknowledge the filter. |
| 4 | Suppress same-metric duplication. Today `filter-cycle-20` appears in both Inconclusive and Regressions-from-peak with contradictory framings. | reporter render path | When a metric's within-session CI lies within the noise band, skip it from cross-iteration tables. Same-session classification wins. |
| 5 | Per-bench σ from samples for `expected_noise_pp` (`reporter.js:152`). Today's σ=2ms global is the documented baseline but under-predicts noise on heavy-allocation benches by 4-9× (clear-10k σ=17.6ms empirical vs 2ms model). | reporter | Compute σ from `bm.samples` per cell. Renders accurate "Expected Noise" and tightens the Inconclusive/Too Fast classifier on edge cases. |
| 6 | Footer wording: "Sample size: 50 floor / N max" (or the actual range) instead of bare "Sample size: 50". Today obscures auto-sample. Actual cell counts in PR #183 ranged 50→280. | reporter (`:473`) | Reader sees when a cell auto-sampled to the timeout vs converged at the floor. |
| 7 | Tighter Inconclusive copy (`reporter.js:429`). Today says "Running more samples in a future run might settle these metrics" — true for sampling-unlucky cases, false for benches that are genuinely variance-dominant. | reporter | "More samples may settle these metrics, but if a metric stays here across iterations the bench may be intrinsically variable." |
| 8 | Move `// purpose:` comments adjacent to `performance.mark` in `bench-template-reactivity.js`. Today 8 of 9 metrics author the comment above the `await mount(...)` line, violating the `extend-bench-suite` skill convention. | bench file | One-line edits per metric. Glossary returns to full coverage. |
| 9 | Honest "Base:" link. Today `reporter.js:766-771` falls back to `tree/main` (moving branch tip) because `--base-sha` isn't passed by `benchmarks-report.yml:103-114`. The baseline SHA is in the artifact; just thread it through. | workflow + reporter | Header link pins to the real measurement baseline. |

### Tier 2 — bench amplification audit

Per the documented contract in `extend-bench-suite`, a bench must produce within-session CIs that resolve at the 2% threshold given its duration. Audit each bench file against the duration → resolution table:

- < 5ms → "Too Fast", amplify
- 5-20ms → noise-floor-limited on zero-delta
- 20-100ms → fits 2%
- > 100ms → tight CI

Two specific audits emerged from the PR #183 data:

**`bench-template-reactivity.js` per-cycle saturation.** Five metrics (`active-indicator-200`, `stable-ref-mutate-500`, `snippet-args-per-key-100`, `snippet-in-subtemplate-100`, `active-indicator-nested-200`) measure exactly `cycle_count × 16.667ms` because `await flush()` is inside the inner loop and the per-cycle work is sub-frame. Three more partially saturate. Fix per the contract: amplify per-cycle work (more children per subtemplate, larger workload), or restructure to one rAF outside the timed region rather than 50.

**Cross-session-variance audit on krausest/todo metrics.** Empirical cross-session midpoint ranges divided by within-session CI widths produce ratios > 3× for 13 metrics (including `remove-row-front-20` 13.34×, `remove-row-middle-20` 11.70×, `bulk-add-500` 5.20×). Per the contract, amplify cycle counts until the bench's wall-clock dominates host-side allocation/GC variance. Concrete starting point: compute the per-metric ratio as part of the next 5 main pushes and fix any metric that stays > 3× across them.

The reframe-lens audit and Jack's architectural pushback both confirmed the right answer is bench-side amplification, not harness-side calibration. The harness stays simple (one global threshold, the duration model). The bench files take a one-time audit pass.

## Confidence delta per section

| Section | Today | After Tier 1 | After Tier 1 + Tier 2 |
|---|---|---|---|
| Header verdict | ~95% | ~95% | ~96% |
| Faster (N) | ~95% | ~96% | ~97% |
| Slower (N) | ~95% | ~96% | ~97% |
| No Change (N) | ~85% (~10% on saturated) | ~88% | ~92% |
| Inconclusive | ~35% | ~60% | ~70% |
| Too Fast to Measure | ~60% | ~75% | ~80% |
| 🏆 New peaks (N) | ~55% | ~80% | ~85% |
| 📜 Regressions from peak (N) | ~40-75% | ~80% | ~85% |

Highest leverage items: #1 (peak filter), #2 (peak quality gate), and the Tier 2 amplification work. Lowest cost / cleanest wins: #4 (suppression), #6 (footer), #7-8 (copy/comments).

## Decisions

Resolved during scope upgrade.

- **No-eligible-peak fallout (Tier 1 #1).** Omit the row. Matches the `null` historyStatus path for new metrics. Rendering a "no eligible peak" placeholder is just noise.
- **Per-cell σ fallback (Tier 1 #5).** Use per-cell σ when samples ≥ 20; fall back to global SIGMA_ABS_MS=2ms below that. The 50-sample floor in CI configs makes the fallback rare — covers cells that hit the timeout before reaching the floor.
- **Tier 2 amplification scope.** Krausest is signal-only here, not a parity contract — its job is to predict our trend on the published js-framework-benchmark suite. A bench permanently in "Too Fast" produces zero signal, so resolution wins over workload-shape preservation. Amplification stays within the operation (more iterations or larger scale, never a different operation).
- **Tier 2 split-out.** Tier 2 lands in a follow-up plan. Reason: amplification renames or silently shifts metric definitions (`-20` → `-100`), which breaks comparability of the FGR branch's existing bench-bot history. Tier 1 is pure improvement for FGR debug; Tier 2 is the disruption. Decoupling them lets FGR keep using its existing data while we land the reporter fixes. Filed as [Bench Amplification Audit](../icebox/bench-amplification-audit.md).

## Sessions (estimated)

1. Reporter Tier 1 edits — peak filter + quality gate, per-cell σ, suppression, copy/footer, base-SHA fallback. Bench-side: align purpose comments with the extractor's expectation. ~3-4h.
2. Subagent copy review pass on the rendered comment, rewrite for first-time readers. ~30m.

## Dependencies

None for Tier 1. Tier 2 (separate plan) lands after FGR's path forward is resolved.

## Status

`scoped` — Tier 1 in flight on `feat/bench-comment-truthfulness`. Decisions on open questions captured above. Tier 2 split out as [Bench Amplification Audit](../icebox/bench-amplification-audit.md) and waits on FGR.

## References

- Audit artifacts: `ai/workspace/artifacts/pr-183-bench-audit/` (JSON, reproduced comments, per-metric ratios, traced code paths)
- Skills consulted: `extend-bench-suite`, `read-bench-report`, `improve-performance` workflow
- Tachometer README cited at `ai/workspace/artifacts/pr-183-bench-audit/tachometer-readme.md`
