# Bench Coverage Expansion

## Goal

Two tracks of bench coverage shipped in one PR.

**Track A — Fine-grained reactivity workloads.** Seven workload-shaped metrics in a new `bench-template-reactivity` cell, anchored to production component patterns (tabs selection, password-strength derived state, card-search filtering, dropdown selected-item, async-search results) and to the doc-promised-but-unrealized invariants the renderer doesn't yet deliver. Pure client-mount path — no SSR, no hydration. Models the naive case of CDN-loaded or agentic-VM-loaded SUI components. A separate amplification of an existing `bench-hydrate.js` metric covers the SSR-hydration variant of the same invariants.

**Track B — Per-file hot-path micros.** Per-package isolation benches that catch sub-noise-floor regressions on PRs touching a single hot-path file. The macro suite shifts by 2-3% on a 20% regression in `expression-evaluator.js` — below the resolution floor. Per-file micros surface those.

Together they fill measurement gaps that the existing krausest / todo / hydrate / signal cells don't reach.

## Status

`complete` — all seven Track A metrics shipped, hydration metric amplified, Track B signal extensions + renderer micros + compiler micros all shipped, bench reporter gained a purpose-extraction + glossary system (extra-scope), per-suite purpose comments authored across all five bench files (extra-scope), snippet/subtemplate arg-source-propagation correctness tests landed in renderer (extra-scope), two previously-skipped granularity tests promoted (one to passing, one to `it.fails`). Plan + roadmap entries updated. PR #181 open and ready. Post-merge tail: bench-history.json populates after merge, the `--edit-last` workflow fix for duplicate-bot-comments takes effect post-merge.

## Supersedes

[`../icebox/bench-suite-expansion.md`](../icebox/bench-suite-expansion.md). Removed in this PR.

- Icebox Track 2 (wake-count, nested-mutation, hydrate-1000) — fully absorbed. Wake-count drops in favor of wall-clock benches (real Reactions doing real small work makes wake count visible as wall-clock — no instrumentation primitive needed). `nested-mutation` is partly covered by Track A's `derived-cascade-100` and `stable-ref-mutate-500`. `hydrate-1000-card` already exists in `bench-hydrate.js` (the `100` in metric names is residual from when items were 100; today they are 1000).
- Icebox Track 1 (per-file micros) — absorbed as Track B below. The plan named this "templating" but `TemplateCompiler` lives in `@semantic-ui/compiler`, so the package-level infra was stood up there.

## Track A — Fine-grained reactivity workloads

Seven metrics in `packages/component/bench/tachometer/bench-template-reactivity.js`, served via `tachometer-ci-template-reactivity.json`. Pure client-mount — `document.createElement → appendChild → flush → mutate`.

### Subtemplate / snippet axis

Direct exercise of the per-key isolation gap in subtemplate args. The doc at `docs/src/pages/docs/guides/templates/subtemplates.mdx` promises that shorthand individual props and `reactiveData={...}` are surgical-per-key. The skipped tests in `packages/renderer/test/browser/subtree-spurious.test.js` document that today's renderer flattens both through `unpackNodeData` and re-evals every child expression on any key change.

| Metric | Workload | Coverage |
|---|---|---|
| `subtemplate-reactive-data-100` | 100 child subtemplates with `{>card reactiveData={label: getLabel, status: getStatus}}`. Mutate `labelVal` 50×. | Documented invariant: `it.fails` test in `subtree-spurious.test.js` (post-fix the test flips to passing). |
| `subtemplate-shorthand-props-100` | 100 child subtemplates with `{>card label=getLabel status=getStatus}`. Mutate `labelVal` 50×. | Same gap, different syntactic form. A renderer fix that lands one likely lands both. |
| `snippet-args-per-key-100` | 100 invocations of a `{#snippet card label=labelArg status=statusArg}` expansion. Mutate `labelVal` 50×. | Today already at the per-expression-isolation ideal (calibration confirmed via `subtree-caching.test.js #28` correctness tests). Bench locks in current correct behavior — slower verdict on a future regression flags coarse-snippet introduction. |

### Broader reactivity axis

Each anchored to a production example's mutation pattern.

| Metric | Anchor | Workload | Coverage |
|---|---|---|---|
| `active-indicator-200` | tabs, dropdown, async-search `selectedIndex`, card-search filter highlight | 200 items each reading `is item.id selectedId` from one external signal. Cycle selectedId 100×. | External-signal-into-each fan-out. Calibration showed today's behavior re-evals 198 of 200 items per cycle (99× gap to the ideal of 2). |
| `stable-ref-mutate-500` | card-search results, async-search results | 500-item list, replace `items[i]` with fresh ref. 100 cycles, each picking different `i`. | Per-key isolation in `#each` outside subtemplates. Calibration showed today is already at the ideal (1 per cycle). Bench locks in correct behavior — regression to coarse list re-eval is caught. |
| `derived-cascade-100` | password-strength | One root signal feeding 7 derived expressions (length check, uppercase, digit, special, label, class map, percentage). 100 character mutations. | Eval count is 7/cycle today and ideal — wall-clock spread is contingent on FGR shipping DOM-update short-circuit on stable derived outputs. |

### Negative control

Documented coarse semantic that should NOT improve under fine-grained reactivity work. Wall-clock should stay flat. Catches accidental tightening that would constitute a behavioral break.

| Metric | Workload | Documented coarse path |
|---|---|---|
| `subtemplate-data-blob-100` | 100 child subtemplates with `{>card data=getCardData}`. Mutate label inside cardData 50×. | `data={expression}` evaluates the whole blob on every change; every child re-evaluates by design. |

### Hydration coverage

The existing `hydrate-helper-100-state-change` metric in `bench-hydrate.js` exercises the SSR-adoption variant of the same invariants (hydrate from SSR → mutate `state.activeID` → measure per-item helper re-eval cost) but previously sat at ~6ms with ±26-29% noise. Amplified to 10 cycles to clear the σ-floor.

## Track B — Per-file hot-path micros

Distributed across packages so each runs only when the owning package's `@semantic-ui/*` dep closure intersects the diff (per matrix discovery in `tools/ci/bench/matrix/discover.js`).

| Bench | Owning package | Metrics shipped |
|---|---|---|
| Reactivity hot paths | reactivity | Extends existing `bench-signal.js` with `signal-set-same-10m`, `signal-sub-unsub-100k`, `reaction-flush-noop-5m`, `reaction-coalesce-200x100`, `reaction-dep-diff-30k`. |
| Renderer hot paths | renderer | New `bench-renderer-micros.js` + supporting infra. Metrics: `micro-expr-simple-100k`, `micro-expr-lisp-50k`, `micro-expr-js-10k`, `micro-build-html-string-10k`, `micro-dom-walker-1000x15`. |
| Compiler hot paths | compiler | New `bench-compiler-micros.js` + supporting infra. Metrics: `micro-compiler-parse-cold-normal-500` (headline for runtime-browser-compile case), `micro-compiler-parse-cold-complex-200` (kitchen-sink edge case), `micro-compiler-ast-walk-5k`, `micro-compiler-snippet-args-5k`. `parse-cached` skipped — confirmed no cache layer exists in the compiler. |

Production distribution weights from `../../skills/workflows/contributing/improve-performance.md`: 79% of expression evaluations are property lookups (simple identifier + dotted path), 19% Lisp, 2% JS. The `micro-expr-*` mix is calibrated against this.

## Reporter additions

Two extra-scope changes in `tools/ci/bench/reporter/`:

1. **Purpose-extraction system.** Each metric carries a `// purpose: <text>` single-line comment immediately above its `performance.mark(startMark(...))` call. The reporter walks bench files once, indexes per-metric source location and purpose, and renders a collapsed `📖 Bench glossary` `<details>` block at the bottom of the PR comment.
2. **Single-pass file index.** The two prior resolvers (source-location + purpose) collapsed into one walk indexed by metric name. Drops the per-metric N×2 file scan.

Voice rules for purpose comments: no colons/semicolons/em-dashes, no AI tells, capitalize first word, ≤25 words, hard cap 120 chars per line, lead with active verb, strip `measures`/`tests whether`/`validates` prefixes.

## Renderer correctness tests

Three new tests in `subtree-caching.test.js #28` confirm basic update-propagation when a snippet or subtemplate arg's source signal changes — DOM updates correctly. These passed on first run, confirming snippet/reactiveData/shorthand-props paths all do basic-correctness reactivity (the question was per-key isolation, not basic propagation).

Two previously-skipped tests unburied:

- `subtree-spurious.test.js` snippet-args granularity test — promoted to plain `it()`, passes today (snippet path is per-expression isolated).
- `subtree-spurious.test.js` reactiveData granularity test — converted to `it.fails()`, surfaces the documented coarseness gap. Flips to a real failure when the gap is closed, prompting marker removal.

## Sessions actuals

| Session | Estimated | Done |
|---|---|---|
| 1. Track A calibration | ~3h | ✓ Findings: 5 metrics had real coarseness gaps, 2 metrics already at ideal. Both kept (regression-protection role). |
| 2. Track A bench file + config | ~3h | ✓ |
| 3. Hydration metric amplification | ~30m | ✓ |
| 4. Track B signal cheap extensions | ~2h | ✓ |
| 5. Track B renderer infra | ~4h | ✓ |
| 6. Track B compiler infra | ~2h | ✓ (named "templating" in plan; actual home is `@semantic-ui/compiler`) |
| 7. PR open + first CI run | — | Partial. PR #181 open, CI runs the two new package-level cells (renderer-micros, compiler-micros) directly; the `bench-template-reactivity` cell is overlaid out of this PR's CI run by the harness's PR-side bench overlay (test-taker can't author the test). Post-merge bench validates the full set. |

## Out of scope (delivered as extras beyond plan)

| Item | Why included |
|---|---|
| Bench reporter purpose system + glossary | One-line metric descriptions in PR comments help reviewers without click-through. Self-extends via `// purpose:` convention; future bench authors get glossary entries free. |
| Per-suite purpose comments (4 existing suites + 4 new) | Glossary needs the data. ~50 metrics covered. |
| Voice cleanup pass on purpose comments | Workspace voice spec set rules; first authoring round didn't fully apply them. Sweep aligned all 50. |
| Snippet/subtemplate arg-source propagation correctness tests | Calibration session surfaced ambiguity (snippet markers showed 0/cycle — could mean basic reactivity broken OR per-expression isolation working). Tests resolved the ambiguity (passing means basic correctness fine, plus per-expression isolation works for snippets). |
| Workflow `--edit-last` → explicit-id-lookup fix | Investigation of duplicate bot comments on this PR found `gh pr comment --edit-last` flaked once (likely token-rotation related). Replaced with stable REST lookup by author-login. |

## Out of scope (deferred)

| Item | Reason |
|---|---|
| Templating-package-level micros | Folded into compiler micros (TemplateCompiler lives in compiler). Standalone templating bench infra would need a different workload (Template.render runtime, not compile-time), which is already covered by the macro suite (todo / krausest / hydrate). |
| Wake-count instrumentation as a tachometer measurement type | Wall-clock benches deliver the same signal cleanly. |

## Methodology

Same constraints as the rest of the bench harness:

- Within-session percent-delta only across iterations (`differences[].percentChange`).
- Same-session round-robin pattern (`this-change` / `tip-of-tree`).
- `sampleSize: 50, timeout: 3, autoSampleConditions: ["2%"]`.
- Wall-clock only — no wake-count instrumentation, no `mode: callback` divergence.
- Author-neutrality preserved by the existing harness overlay-from-main.
- Each metric amplified to clear ~10-15ms minimum (verified in node + chromium smoke tests).

## Dependencies

None. Bench harness, reporter, matrix discovery, history archival are all in place.

## Completion

- **Estimated:** 12-15h pair (Sessions 1-5+7); +2h if templating infra ships in this PR rather than as follow-up.
- **Actual:** ~5h wall-clock across 19 commits (first commit `33a7c96c8` at 09:45, last `4f4a1f243` at 14:46), plus ~25 lens/scoring subagent dispatches across two code-review rounds.
- **Completed:** 2026-05-05.
- **Delta notes:** Came in well under estimate. Calibration was the fast-fix step — discovered two metrics already at the ideal in ~30 minutes, recovered scope (kept them as regression-protection benches) after the reframe. Code-review iteration added ~2h of fix passes. Reporter purpose-extraction + glossary, correctness tests, voice-cleanup sweep, and the workflow `--edit-last` fix were all extra-scope adds beyond the plan that emerged from review or downstream investigation. Templating-package-level micros folded into compiler-package home (`TemplateCompiler` lives in `@semantic-ui/compiler`, not `@semantic-ui/templating`).
