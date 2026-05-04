# SSR Hydration Skill Eval Rubric

Each eval prompt has 5-8 binary assertions (pass/fail). Skill is "significantly better than baseline" when its mean pass rate exceeds baseline by at least 30 percentage points across all evals, AND no eval regresses below baseline.

## Eval 0: innerHTML-doesnt-process-DSD

| # | Assertion |
|---|---|
| A | Identifies that `innerHTML` does NOT process `<template shadowrootmode>` (the DSD spec) |
| B | Recommends `setHTMLUnsafe` (or `Document.parseHTMLUnsafe`) as the correct API |
| C | Explains the consequence chain: no shadowRoot at parse time → `hasServerContent === false` → `connectedCallback` runs `fullRender` instead of `hydrate` |
| D | Notes that the failure is silent (no error) — the test "succeeds" but is testing a different code path than intended |
| E | Mentions that the browser's main HTML parser DOES process DSD; the limitation is on fragment parsers (`innerHTML`, `outerHTML`, `insertAdjacentHTML`) |

## Eval 1: renderToString-empty-in-browser-env

| # | Assertion |
|---|---|
| A | Identifies `Template.isServer` as the controlling flag |
| B | Explains `template.render()` selects between `engine.serverRenderer` and `engine.renderer` based on `Template.isServer` |
| C | Notes the client `Renderer` writes to DOM and does not produce HTML strings, leaving the wrapper template empty |
| D | Recommends toggling `Template.isServer = true` for the duration of the `renderToString` call |
| E | Mentions wrapping in try/finally to restore the prior value (so other tests aren't affected) |

## Eval 2: each-block-external-state-not-reactive-after-hydrate

| # | Assertion |
|---|---|
| A | Identifies `each.hydrate` deliberately defers per-item Reaction wiring (not a bug in the lazy design) |
| B | Explains the chain: `each.hydrate` only registers a dep on `node.over`; per-item Reactions wire later via `adoptServerItems` when items signal fires |
| C | Recognizes that if items never mutates, `update` never runs, and per-item bindings stay unwired forever |
| D | Connects the bug to `getItemClasses` reading `state.activeID` — the external signal has no Reaction to invalidate, so mutations are silently lost |
| E | References the each-content-classifier (or equivalent fix shape: "force eager adoption when bindings could read external state") as the resolution |
| F | Notes the per-binding Reactions use `skipFirstWrite: true` — they evaluate to register deps but trust the SSR'd DOM; the evaluation IS what registers external deps |

## Eval 3: tachometer-bench-noise-floor-too-high

| # | Assertion |
|---|---|
| A | Identifies that bench noise floor scales inversely with bench duration |
| B | Quotes or paraphrases the duration→noise table: ~2ms = ±10-20%, ~10ms = ±2-5%, ~50ms+ = ±1% |
| C | Explains the physics: per-sample jitter (OS scheduling, GC, JIT) is roughly constant in absolute terms, typically sub-millisecond |
| D | Concludes that at ~6ms, ±28% is the floor; no amount of additional sampling lowers it |
| E | Recommends increasing work per sample (e.g., bump to 1000 items) to push bench duration into the ±1% band |
| F | Optionally references the perf-improvement skill or `improve-performance` workflow as the source for this methodology |

## Eval 4: snippet-arg-inside-each-not-reactive

| # | Assertion |
|---|---|
| A | Recognizes this is the same root cause as eval 2 (each-hydrate deferral) — not a snippet-specific bug |
| B | Explains that snippet args (`label=item.name`) are evaluated by the per-item content path; the snippet body sees those args via `buildSnippetProxy` |
| C | Notes that without per-item Reactions wired, the snippet arg evaluation never re-runs when items change in place |
| D | Identifies that the each-content-classifier conservatively bails on snippet/template/rerender/async invocations (treating them as cross-AST/dynamic) — forcing eager adoption — which is the fix |
| E | Mentions the existing test `snippet with named args inside each is reactive after hydration` (PR #175 unskipped it) OR equivalent: this scenario is a known regression test |
