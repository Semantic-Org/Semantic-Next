# Bench Suite Expansion

## Status

`initial` — drafted, not on the active roadmap. Lands when underlying perf work creates a gating need, or when an audit identifies a regression the current suite missed. The current suite is comprehensive at the macro level; these are surgical adds.

## Goal

Expand bench coverage where the current suite has identified gaps. Two tracks: file-scoped micro-benches for hot paths the macro suite can't isolate signal on, and end-to-end benches for reactivity and hydration patterns the current suite doesn't exercise.

## Track 1 — Internal hot-path micros (file-scoped coverage)

Macro suites tell the *product* story (user-observable latency); micros tell the *implementation* story (per-op cost). A 20% regression in `expression-evaluator.js` shifts `update-10th` by maybe 2-3% — below the noise floor. A PR touching only `expression-evaluator.js` gets no meaningful signal from the end-to-end suite.

Candidates — one config per hot-path file:

| Config | Covers | Operations per sample |
|---|---|---|
| `micro-expression-evaluator` | `packages/renderer/src/expression-evaluator.js` | Simple identifier, dotted path, Lisp helper, JS eval, mixed |
| `micro-signal` | `packages/reactivity/src/signal.js` | `set(same)` fast path, `set(changed)`, `notify` with N subscribers, sub/unsub churn |
| `micro-reaction-scheduler` | `packages/reactivity/src/reaction.js` | `flushTask`, microtask coalescing, dependency-set diffing, nested-reaction teardown |
| `micro-template-compiler` | `packages/templating/src/*` | Parse (cold), parse (cached), AST walk, snippet args extraction |
| `micro-build-html-string` | `packages/renderer/src/build-html-string.js` | Fragment serialization, attribute binding scan, DSD marker emission |
| `micro-dom-walker` | `packages/renderer/src/engines/native/renderer.js` (`bindMarkers` walker) | Single-pass SHOW_ELEMENT / SHOW_COMMENT over 1000-node tree, `blockDepth` skip, per-item marker adoption |

Weight bench design by production distribution — 79% of production template expressions are property lookup (simple identifier + dotted path), 19% Lisp helpers, 2% JS eval. A 10% improvement on simple identifiers has more real-world impact than a 2× improvement on complex Lisp.

## Track 2 — Reactivity / hydration adds

Three benches identified as gaps in the current end-to-end suite, each tied to specific design directions:

- **`wake-count-single-key`** — mutate one key on one item in a 1000-item each. Asserts on wake count via `Reaction.setTracing()` counter. Directly exposes the fine-grained-reactivity win when that work lands.
- **`nested-mutation`** — `items[i].nested.x = v` on a 1000-item list with nested objects. Measures coarse-notify path; gates the freeze-default design choice.
- **`hydrate-1000-card`** — full SSR + hydrate end-to-end at 1000-card scale. Likely subsumed by amplifying `hydrate-each-100` to N=1000; confirm before building separately.

## Methodology constraint

Only compare percent-deltas across runs, never absolute ms across sessions. Each new config follows the `this-change` / `tip-of-tree` round-robin pattern; cross-iteration comparison uses `differences[].percentChange`. Same rule the rest of the bench infrastructure operates under.

## Open Questions

1. **Wake-count instrumentation path.** Emit count as ms-encoded measurement via `performance.mark` (no upstream patch), or extend tachometer with a custom measurement type. Lean: ms-encoded.
2. **Nested-mutation setup contract.** Reuse nested objects across mutations (measures `isEqual` path) or freshly spread each time (measures allocation path). Probably two benches under a common umbrella.
3. **Hydration bench scaling.** Amplify `hydrate-each-100` to N=1000, or build a separate fixture? Amplify first; build a separate fixture only if format-change bench instability becomes a problem.
4. **Triggering for micros.** Always-run on every PR, or path-based filtering? Lean: always-run — cross-file regressions are real (a `signal.js` change can move expression-evaluator's observed cost). If CI cost becomes a concern, use a `[skip-micro]` commit message tag rather than path-based routing.

## When this lands

Each track triggers independently:

- **Track 1** lands when an audit flags a hot-path regression the macro suite missed, OR when starting a perf pass on a file the macro suite can't isolate signal for.
- **Track 2** lands when the underlying reactivity / hydration work creates a gating need (fine-grained reactivity for `wake-count-single-key`; freeze-by-default for `nested-mutation`; hydration scaling for `hydrate-1000-card`).

No speculative builds — the suite is already comprehensive at the macro level.

## Dependencies

None. Each bench in either track is independently shippable.
