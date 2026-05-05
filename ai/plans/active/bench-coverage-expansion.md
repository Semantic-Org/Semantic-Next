# Bench Coverage Expansion

## Goal

Two tracks of bench coverage in one PR.

**Track A — Fine-grained reactivity workloads.** Six workload-shaped metrics in a new `bench-reactivity` cell, anchored to production component patterns (tabs selection, password-strength derived state, card-search filtering) and to the doc-promised-but-unrealized invariants the renderer doesn't yet deliver. Pure client-mount path — no SSR, no hydration. Models the naive case of CDN-loaded or agentic-VM-loaded SUI components.

**Track B — Per-file hot-path micros.** Per-package isolation benches that catch sub-noise-floor regressions on PRs touching a single hot-path file. The macro suite shifts by 2-3% on a 20% regression in `expression-evaluator.js` — below the resolution floor. Per-file micros surface those.

Together they fill two distinct measurement gaps that the existing krausest / todo / hydrate / signal cells don't reach.

## Status

`initial` — Track A bench candidates need calibration to confirm wall-clock spreads exist in today's renderer at the proposed N. Track B candidates need duration estimation per micro before the bench shells land. Open questions on negative-control inclusion and Track B scope (cheap extensions vs full new package infra).

## Supersedes

[`../icebox/bench-suite-expansion.md`](../icebox/bench-suite-expansion.md). Removed in this PR.

- Icebox Track 2 (wake-count, nested-mutation, hydrate-1000) — fully absorbed. Wake-count drops in favor of wall-clock benches (real Reactions doing real small work makes wake count visible as wall-clock — no instrumentation primitive needed). `nested-mutation` is partly covered by Track A's `derived-cascade-100` and `stable-ref-mutate-500`. `hydrate-1000-card` already exists in `bench-hydrate.js` (the `100` in metric names is residual from when items were 100; today they are 1000).
- Icebox Track 1 (per-file micros) — absorbed as Track B below.

## Track A — Fine-grained reactivity workloads

Six metrics in a new file `packages/component/bench/tachometer/bench-reactivity.js`, served via `tachometer-ci-reactivity.json`. Pure client-mount — `document.createElement → appendChild → flush → mutate`. Each anchored to a real example pattern with a clear "what wins under an ideal renderer" target.

### Subtemplate / snippet axis

Direct exercise of the per-key isolation gap in subtemplate args. The doc at `docs/src/pages/docs/guides/templates/subtemplates.mdx` promises that shorthand individual props and `reactiveData={...}` are surgical-per-key. The skipped tests in `packages/renderer/test/browser/subtree-spurious.test.js` say today's renderer flattens both through `unpackNodeData` and re-evals every child expression on any key change.

| Metric | Workload | Wins close gap |
|---|---|---|
| `subtemplate-reactiveData-100` | 100 child subtemplates with `{>card reactiveData={label: getLabel, status: getStatus}}`. Mutate `labelVal` 50×. | Skipped test in `subtree-spurious.test.js:527`. Today: 200 expressions re-eval. Ideal: 100. |
| `subtemplate-shorthand-props-100` | 100 child subtemplates with `{>card label=getLabel status=getStatus}`. Mutate `labelVal` 50×. | Skipped test in `subtree-spurious.test.js:465`. Same gap, different syntactic form. A renderer fix that lands one likely lands both — bench validates. |
| `subtemplate-data-blob-100` | 100 child subtemplates with `{>card data=getCardData}`. Mutate label inside cardData 50×. | Negative control. Coarse-by-design — every child expression re-evals on any input change. Should NOT improve when fine-grained reactivity lands. Catches accidental tightening of the documented coarse-blob semantic. |

### Broader reactivity axis

Each anchored to a production example's mutation pattern. Tests fine-grained reactivity invariants outside the subtemplate boundary.

| Metric | Anchor | Workload | Wins close gap |
|---|---|---|---|
| `active-indicator-200` | tabs, dropdown, async-search `selectedIndex`, card-search filter highlight | 200 items each reading `is item.id selectedId` from one external signal. Cycle selectedId 100×. | Ideal: 2 items re-eval per cycle (prev-active + new-active). Today: likely all 200. |
| `stable-ref-mutate-500` | card-search results, async-search results | 500-item list, replace `items[i]` with fresh ref. 100 cycles, each picking different `i`. | Ideal: 1 item's expressions re-eval per cycle. Tests per-key isolation in `#each` outside of subtemplates. |
| `derived-cascade-100` | password-strength | One root signal feeding 8 derived expressions (length check, uppercase, digit, special, label, two class maps, percentage). 100 character mutations. | Ideal: derived chains short-circuit when intermediates don't move. Today: 800 evaluations. |

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
2. **Track A — one config or split.** Six metrics in `tachometer-ci-reactivity.json` keeps the suite cohesive. Splitting `derived-cascade-100` off (it stresses computation, not rendering) would isolate the signal but adds a second matrix cell. Lean: one config.
3. **Track B scope.** Cheap extensions only (`micro-signal` + `micro-reaction-scheduler` extending `bench-signal.js` — net ~2h) vs full set including renderer + templating new package infra (~6-8h additional). Lean: ship cheap extensions in this PR; defer renderer + templating new infra to a follow-up unless calibration shows the gap is urgent and not catchable any other way.
4. **Track A calibration confidence.** Today's "200 re-eval / 0 re-eval" claims are inferred from the skipped tests, not measured. Calibration step (Session 1) is a precondition — if today's gap is only 2× rather than larger, bench duration math changes and some metrics may drop.

## Dependencies

None. Bench harness, reporter, matrix discovery, history archival are all in place (`tools/ci/bench/` + `.github/workflows/benchmarks*.yml`). Work is bench source + tachometer configs.

## Sessions (estimated)

1. **Track A calibration.** Instrument the four reactivity-axis candidates locally. Add throwaway counters to confirm today's wake count and measure the wall-clock spread. Adjust N upward where the spread is tight, downward where it's so dramatic the bench is unstable. ~3h.
2. **Track A bench file + config.** Write `bench-reactivity.js`, two HTML fixtures, `tachometer-ci-reactivity.json`. Add to `build-ci.js`. Local zero-delta dry run via `node build-ci.js current`, `node build-ci.js baseline` (same source both sides), `npx tachometer --config tachometer-ci-reactivity.json`. ~3h.
3. **Track B cheap extensions.** Add `micro-signal` and `micro-reaction-scheduler` entries to existing `bench-signal.js`. Calibrate iteration counts to clear the noise floor. ~2h.
4. **Track B new infra (conditional on open-question ruling).** Stand up `bench-renderer-micros.js` + `tachometer-ci-renderer-micros.json` in renderer. Stand up `bench/tachometer/` infra in templating. ~4-6h.
5. **PR open + first CI bench run.** Validate that metrics resolve in CI, that the reporter renders all metrics correctly, and that `bench-history.json` gets its first entries after merge.

Total: 8-14h pair depending on Track B scope.

## Completion criteria

- Track A metrics resolve cleanly on a zero-delta run (CI within ±2% of zero) and produce spreads consistent with the calibration step under a synthetic renderer perturbation.
- Track B metrics chosen for inclusion clear ~10ms mean after amplification — no perpetual residency in "Too Fast to Measure Precisely."
- The icebox plan is removed and `ROADMAP.md` reflects the supersession.
- Bench design rationale lives in the bench file's header comment (per the existing convention in `bench-todo.js`, `bench-krausest.js`, `bench-hydrate.js`), not a standalone doc.
