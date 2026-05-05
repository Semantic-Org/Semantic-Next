# Bench Coverage Expansion

## Goal

Two tracks of bench coverage in one PR.

**Track A — Fine-grained reactivity workloads.** Seven workload-shaped metrics in a new `bench-reactivity` cell, anchored to production component patterns (tabs selection, password-strength derived state, card-search filtering) and to the doc-promised-but-unrealized invariants the renderer doesn't yet deliver. Pure client-mount path — no SSR, no hydration. Models the naive case of CDN-loaded or agentic-VM-loaded SUI components. A separate amplification of an existing `bench-hydrate.js` metric covers the SSR-hydration variant of the same invariants.

**Track B — Per-file hot-path micros.** Per-package isolation benches that catch sub-noise-floor regressions on PRs touching a single hot-path file. The macro suite shifts by 2-3% on a 20% regression in `expression-evaluator.js` — below the resolution floor. Per-file micros surface those.

Together they fill two distinct measurement gaps that the existing krausest / todo / hydrate / signal cells don't reach.

## Status

`initial` — Track A bench candidates need calibration to confirm wall-clock spreads exist in today's renderer at the proposed N. Track B candidates need duration estimation per micro before the bench shells land. Calibration is a hard gate on the metric set: any metric whose today-spread sits at the σ-floor doesn't ship.

## Supersedes

[`../icebox/bench-suite-expansion.md`](../icebox/bench-suite-expansion.md). Removed in this PR.

- Icebox Track 2 (wake-count, nested-mutation, hydrate-1000) — fully absorbed. Wake-count drops in favor of wall-clock benches (real Reactions doing real small work makes wake count visible as wall-clock — no instrumentation primitive needed). `nested-mutation` is partly covered by Track A's `derived-cascade-100` and `stable-ref-mutate-500`. `hydrate-1000-card` already exists in `bench-hydrate.js` (the `100` in metric names is residual from when items were 100; today they are 1000).
- Icebox Track 1 (per-file micros) — absorbed as Track B below.

## Track A — Fine-grained reactivity workloads

Seven metrics in a new file `packages/component/bench/tachometer/bench-reactivity.js`, served via `tachometer-ci-reactivity.json`. Pure client-mount — `document.createElement → appendChild → flush → mutate`. Each anchored to a real example pattern.

Metric descriptions deliberately avoid prescribing per-eval counts ("ideal: 100, today: 200"). The bench commits to wall-clock only; baking eval-count predictions into bench design primes readers toward one solution shape (per-key Signal subscription) and would obscure wins from any other approach (compile-time dependency analysis, render-graph memoization, etc.).

Eval counts are valuable as calibration *artifacts*, not bench commitments. Calibration session 1 records today's eval count alongside the wall-clock spread for each metric; the artifact lives in a calibration log (`ai/workspace/artifacts/bench-reactivity-calibration.md` or similar), not in the bench code. Future debugging can answer "did this fix close the count gap or only the wall-clock gap?" without the bench itself prescribing a target.

### Subtemplate / snippet axis

Direct exercise of the per-key isolation gap in subtemplate and snippet args. The doc at `docs/src/pages/docs/guides/templates/subtemplates.mdx` promises that shorthand individual props and `reactiveData={...}` are surgical-per-key. The skipped tests in `packages/renderer/test/browser/subtree-spurious.test.js` document that today's renderer flattens both through `unpackNodeData` and re-evals every child expression on any key change.

| Metric | Workload | Coverage |
|---|---|---|
| `subtemplate-reactiveData-100` | 100 child subtemplates with `{>card reactiveData={label: getLabel, status: getStatus}}`. Mutate `labelVal` 50×. | Documented invariant: skipped test `subtree-spurious.test.js:527`. |
| `subtemplate-shorthand-props-100` | 100 child subtemplates with `{>card label=getLabel status=getStatus}`. Mutate `labelVal` 50×. | Documented invariant: skipped test `subtree-spurious.test.js:465`. Shares the `unpackNodeData` flatten path with reactiveData; cut if calibration shows 1:1 wall-clock tracking with `subtemplate-reactiveData-100`. |
| `snippet-args-per-key-100` | 100 invocations of a `{#snippet card label=labelArg status=statusArg}` expansion via `{>card label=getLabel status=getStatus}` calls. Mutate `labelVal` 50×. | Snippets are the third FGR adoption site (after each-items and subtemplate reactiveData) with a more subtle failure mode — zero-reactivity inside subtemplate-nested snippets per the FGR plan's open question 1. Without this metric, snippet-site regressions land bench-blind. |

### Broader reactivity axis

Each anchored to a production example's mutation pattern. Tests fine-grained reactivity invariants outside the subtemplate boundary.

| Metric | Anchor | Workload | Coverage |
|---|---|---|---|
| `active-indicator-200` | tabs, dropdown, async-search `selectedIndex`, card-search filter highlight | 200 items each reading `is item.id selectedId` from one external signal. Cycle selectedId 100×. | External-signal-into-each fan-out. Tests whether per-item bindings reading external state isolate to the items whose computed value changes. |
| `stable-ref-mutate-500` | card-search results, async-search results | 500-item list, replace `items[i]` with fresh ref. 100 cycles, each picking different `i`. | Per-key isolation in `#each` outside subtemplates. Same-array-ref + per-item ref change. |
| `derived-cascade-100` | password-strength | One root signal feeding 8 derived expressions (length check, uppercase, digit, special, label, two class maps, percentage). 100 character mutations. | Derived-chain short-circuit when intermediate values don't move. |

### Negative control

Documented coarse semantic that should NOT improve under fine-grained reactivity work. Wall-clock should stay flat. Catches accidental tightening that would constitute a behavioral break.

| Metric | Workload | Documented coarse path |
|---|---|---|
| `subtemplate-data-blob-100` | 100 child subtemplates with `{>card data=getCardData}`. Mutate label inside cardData 50×. | `data={expression}` evaluates the whole blob on every change; every child re-evaluates by design. |

A second negative control on the `setDataContext` + `bumpDataVersion` coarse path was considered and dropped — symmetry alone doesn't justify a CI cell, and a metric named `coarse-bumpDataVersion-50` reads as cryptic internal-API rather than workload-pattern. Add only if accidental tightening of `setDataContext` becomes a concrete concern.

### Hydration coverage

Track A is pure client-mount. The hydration variant of the same invariants — does the SSR adoption path correctly wire per-item subscriptions to external signals — is FGR's open-question-4 and the failure mode that surfaced in PR #175. The existing `hydrate-helper-100-state-change` metric in `bench-hydrate.js` exercises this shape (hydrate from SSR → mutate `state.activeID` → measure per-item helper re-eval cost) but currently sits at ~6ms with ±26-29% noise — perpetually "Too Fast to Measure Precisely."

Amplify the existing metric (raise iteration count or per-iteration work) to clear the σ-floor. No new file or config — extend `bench-hydrate.js` in place.

## Track B — Per-file hot-path micros

Distributed across packages so each runs only when the owning package's `@semantic-ui/*` dep closure intersects the diff (per matrix discovery in `tools/ci/bench/matrix/discover.js`).

| Bench | Owning package | Cost shape |
|---|---|---|
| `micro-signal` (`set(same)` fast path, `set(changed)`, sub/unsub churn) | reactivity | Cheap. Extend existing `bench-signal.js` — file already has 8 workload metrics. Add the cheap-op isolations as new entries on both this-change and tip-of-tree sides. |
| `micro-reaction-scheduler` (`flushTask` alone, microtask coalescing, dependency-set diffing, nested-reaction teardown) | reactivity | Cheap. Extend `bench-signal.js`. |
| `micro-expression-evaluator` (simple identifier, dotted path, Lisp helper, JS eval, mixed) | renderer | Net-new infra. Renderer's `bench/tachometer/` has only `signature.js` (one-off). Needs `bench-renderer-micros.js` + `tachometer-ci-renderer-micros.json` + ci-current/baseline html + `build-ci.js` for the renderer package. |
| `micro-build-html-string` | renderer | Add to `bench-renderer-micros.js` once that infra exists. |
| `micro-dom-walker` (bindMarkers TreeWalker pass) | renderer | Add to `bench-renderer-micros.js`. |
| `micro-template-compiler` (parse cold, parse cached, AST walk, snippet args extraction) | templating | Net-new infra. Templating has no `bench/tachometer/` directory at all. Full package setup. |

Production distribution weights from `../../skills/workflows/contributing/improve-performance.md`: 79% of expression evaluations in production are property lookups (simple identifier + dotted path), 19% Lisp, 2% JS. Calibrate `micro-expression-evaluator` mix to match — a 10% improvement on simple identifiers has more real-world impact than a 2× improvement on complex Lisp.

## Methodology

Same constraints as the rest of the bench harness, no carve-outs:

- Within-session percent-delta only across iterations (`differences[].percentChange`). Cross-session absolute-ms compare mixes per-session environmental variance.
- Same-session round-robin pattern (`this-change` / `tip-of-tree` benchmarks paired in the config).
- `sampleSize: 50, timeout: 3, autoSampleConditions: ["2%"]`.
- Wall-clock only — no wake-count instrumentation, no `mode: callback` divergence. Real Reactions doing real small work makes wake count visible as wall-clock.
- Author-neutrality preserved by the existing harness overlay-from-main in `.github/workflows/benchmarks.yml`. Bench source + configs are pinned to main on every PR run.
- Each metric amplified to clear ~10-15ms minimum so it resolves cleanly under the σ≈2ms × 2 = ±2% floor.

## Out of scope

| Item | Reason |
|---|---|
| Wake-count instrumentation as a tachometer measurement type | Wall-clock benches deliver the same signal cleanly. Encoding wake count as ms duration would lie about units in the reporter UI. |
| `hydrate-1000-card` | Already covered by `bench-hydrate.js` at N=1000. |
| Form-builder field-typing bench | The interesting signal there reduces to "external signal change in `#each` triggers per-item re-eval" — already covered by Track A's `active-indicator-200`. |
| Drag-rate continuous-mutation bench (rating-slider) | Distinct workload but the underlying gap (rating-stable expressions re-firing during drag) reduces to "external signal change with `state.rating` unchanged" — partially covered by Track A. Defer unless drag-specific perf work creates a gating need. |
| Story-driven config rename (`tachometer-ci-rendering-throughput`, etc.) | Cosmetic. `discover.js` globs `tachometer-ci*.json` so renames are zero-code-change. |

## Open questions

1. **`subtemplate-data-blob-100` — keep or drop.** Negative control catches accidental semantic regression but adds CI time and noise to the headline. Lean: keep initially; drop if the cell's wall-clock exceeds 6 minutes.
2. **Track A — one config or split.** Seven metrics in `tachometer-ci-reactivity.json` keeps the suite cohesive. Splitting `derived-cascade-100` off (it stresses computation, not rendering) would isolate the signal but adds a second matrix cell. Lean: one config.
3. **Track B scope.** Cheap extensions only (`micro-signal` + `micro-reaction-scheduler` extending `bench-signal.js` — net ~2h) vs full set including renderer + templating new package infra (~6-8h additional). Lean: ship cheap extensions + renderer infra in this PR. The macro suite shifts only 2-3% on a 20% regression in `expression-evaluator.js` (per the plan's own framing), so renderer per-file micros earn their slot independently of any specific upcoming PR — they catch sub-resolution-floor regressions on whichever future PR introduces them. Defer templating infra to a follow-up unless calibration shows urgent gap.
4. **Track A calibration confidence.** Today's per-key invalidation claims are inferred from the skipped tests, not measured. Calibration session 1 is a hard gate — metric names don't get committed until measured. If a metric's wall-clock spread is below the σ-floor today, it has no resolvable signal and shouldn't ship; better to find that out in calibration than after CI. Specifically: amplify N (item count, mutation count) until the metric clears ~10-15ms, or drop the metric.

## Dependencies

None. Bench harness, reporter, matrix discovery, history archival are all in place (`tools/ci/bench/` + `.github/workflows/benchmarks*.yml`). Work is bench source + tachometer configs.

## Sessions (estimated)

1. **Track A calibration.** Instrument all seven Track A candidates locally. Throwaway counters record today's eval-count per metric (saved to a calibration log artifact); wall-clock measurement establishes the spread. Adjust N until each metric clears ~10-15ms; drop any metric whose spread sits at the σ-floor today. Hard gate on metric-name commit. ~3h.
2. **Track A bench file + config.** Write `bench-reactivity.js`, HTML fixtures, `tachometer-ci-reactivity.json`. Add to `build-ci.js`. Local zero-delta dry run (same source on both sides) verifies the reporter resolves the metrics within ±2% of zero. ~3h.
3. **Hydration metric amplification.** Raise iteration count or per-iteration work in `hydrate-helper-100-state-change` until it clears ~10ms test time. Single-file edit in `bench-hydrate.js`. ~30m.
4. **Track B cheap extensions.** Add `micro-signal` and `micro-reaction-scheduler` entries to existing `bench-signal.js`. Calibrate iteration counts to clear the noise floor. ~2h.
5. **Track B renderer infra.** Stand up `bench-renderer-micros.js` + `tachometer-ci-renderer-micros.json` + ci-current/baseline html + `build-ci.js` for the renderer package. Add `micro-expression-evaluator`, `micro-build-html-string`, `micro-dom-walker`. ~4h.
6. **Track B templating infra (deferred unless urgent).** Stand up `bench/tachometer/` infra in templating. ~2h follow-up.
7. **PR open + first CI bench run.** Validate that metrics resolve in CI, that the reporter renders all metrics correctly, and that `bench-history.json` gets its first entries after merge.

Total: 12-15h pair (sessions 1-5+7); add 2h if templating infra ships in this PR rather than as follow-up.

## Completion criteria

- Track A metrics resolve cleanly on a zero-delta run (CI within ±2% of zero) and produce spreads consistent with the calibration step under a synthetic renderer perturbation.
- Track B metrics chosen for inclusion clear ~10ms mean after amplification — no perpetual residency in "Too Fast to Measure Precisely."
- Amplified `hydrate-helper-100-state-change` clears the σ-floor (no longer flagged "Too Fast to Measure Precisely" with ±26-29% expected noise).
- Calibration log artifact captures today's eval-count per Track A metric — referenceable by future debugging without prescribing targets in the bench code.
- The icebox plan is removed and `ROADMAP.md` reflects the supersession.
- Bench design rationale lives in the bench file's header comment (per the existing convention in `bench-todo.js`, `bench-krausest.js`, `bench-hydrate.js`), not a standalone doc.
