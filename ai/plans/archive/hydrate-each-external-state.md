# Each-Hydrate Reactivity for External-State Bindings

## Goal

Fix a silent reactivity loss inside hydrated `{#each}` blocks: per-item bindings whose helpers close over external state (a component method that reads `state.x`, an attribute expression like `class="{classMap getItemClasses item}"`) never registered Reactions when items arrived from props and never mutated. State mutations the helper depended on had nothing to invalidate; the SSR'd DOM stayed stale forever. The docs site `inpage-menu` reproduced this on every page that hydrated with menu items from props — scroll never updated the active class.

The fix had to land without reintroducing the ~425ms hydrate regression on 1000-item lists that the prior `hydration-perf-pass` had paid down by making `each.hydrate` deliberately lazy.

## Design / Implementation

### Where the bug actually lived

`each.hydrate` (`packages/renderer/src/engines/native/blocks/each.js`) was a one-line opt-out from the framework's "wire per-binding Reactions on hydrate" invariant that every other block honored:

```js
hydrate({ node, lookupExpression, self }) {
  lookupExpression(node.over);   // dep on the items collection
  self.hasHydrated = true;
}
```

The reasoning, per the perf pass: per-item Reactions are expensive (item count × bindings per item), so defer wiring until the items signal first fires. When that fires, `update` calls `adoptServerItems` which walks the per-item DOM and wires Reactions in place via `hydrateInnerContent` with `skipFirstWrite: true`.

The bug was that the perf optimization assumed per-item bindings only depend on item-local data. When a binding closed over external state (state signal accessed via a closure inside a helper), the items signal could be the wrong dep — items might never mutate. With no Reaction wired, the external signal had no subscriber. The bindings stayed stuck on whatever the server rendered.

### The classifier

`packages/renderer/src/engines/native/blocks/each-content-classifier.js` walks the each block's content AST once per AST identity (cached on a module-level `WeakMap`) and decides whether everything resolves locally. Identifier extraction is a small static-syntactic walk:

- Strip string literals (`'...'`, `"..."`, `` `...` ``)
- Walk character-by-character tracking brace depth
- For each identifier-like token:
  - Skip if preceded by `.` (property access — only the head matters)
  - Skip if followed by `:` while inside `{...}` (object literal key)
  - Otherwise classify against `iteration-vars ∪ pure-helper-registry ∪ reserved-names`

`PURE_HELPERS` is `Object.keys(TemplateHelpers)` — framework-shipped helpers don't read user signals. User-registered helpers and component instance methods fall into the "external" bucket via the same path as state signals: statically indistinguishable, conservative bail.

Recursive walk handles nested blocks. For nested `each → if → each`, the inner each's iteration vars accumulate on top of the outer's. Conservative bails:
- `each` without explicit `as` (item keys spread into local scope; statically indistinguishable from external names)
- `template`/`snippet`/`rerender`/`async`/`guard` invocations (cross-AST or dynamic; not traced)
- Unknown node types

### `each.hydrate` consults the classifier

```js
hydrate({ node, data, scope, region, renderAST, lookupExpression, hydrateInnerContent, self, isSVG }) {
  lookupExpression(node.over);
  self.hasHydrated = true;
  if (isEachContentSelfContained(node)) { return; }    // lazy path preserved
  const { items, collectionType } = resolveItems(node, lookupExpression);
  if (items.length === 0) { return; }
  const adopted = adoptServerItems({ ... });
  if (adopted) { self.hasHydrated = false; }            // already wired; update() shouldn't try again
}
```

Self-contained → existing lazy hydrate. Anything else → `adoptServerItems` eagerly so per-item Reactions register their external deps now.

### Where the work runs

`each.hydrate` only fires on the SSR-then-hydrate path. The 90% of users who runtime-compile in the browser without SSR pay zero analyzer cost. SSR users pay one walk per unique each-content AST shape (cached). The AST stays clean — no per-node hydration metadata, just a binding-layer cache keyed by AST identity.

## Supporting changes

### PR #176 — test infrastructure (`Test: Make Hydration Tests Actually Hydrate`)

Three latent bugs surfaced once the test setup was corrected to actually hydrate:

- **`ssrAndHydrate` used `wrapper.innerHTML = html`.** `innerHTML`'s fragment parser does NOT process `<template shadowrootmode>`, only `setHTMLUnsafe` and `parseHTMLUnsafe` do. The element parsed with no shadowRoot, `hasServerContent` was false, and `connectedCallback` ran `fullRender` instead of `hydrate`. Every "SSR hydration" test in the file was actually testing fresh client render. Fix: switch to `setHTMLUnsafe`.

- **`renderToString` returns empty output unless `Template.isServer` is true.** Toggle it for the duration of the SSR call so the server renderer path activates in the browser test env.

- **`shadowHTML` helper.** `data-sui-bind` markers are stripped by a post-hydrate `requestAnimationFrame` (Plan 02 from the previous perf pass). Tests assert state right after the `rendered` event (one microtask earlier), so the stripper hadn't run yet. Treating `data-sui-bind` as scaffolding the way comment markers already were fixed the assertions.

- Two genuine bugs surfaced (skipped with `it.skip` and a comment naming each):
  - `onCreated state mutation updates DOM after hydration` — state mutated in onCreated runs before `hydrateMarkers` wires Reactions; `skipFirstWrite` then skips the DOM update. Out of scope for this branch.
  - `snippet with named args inside each is reactive after hydration` — same family as this branch's bug. Unskipped by the fix.

### PR #177 — bench duration bump

The 100-item `hydrate-helper-100-mount` bench ran at ~6ms with ±28% noise floor. Anything below ±28% reads as no-change — completely unresolvable. Per the perf-improvement skill's bench-duration table: ~2ms = ±10-20%, ~10ms = ±2-5%, ~50ms+ = ±1%. Bumping to 1000 items pushed the helper-mount bench to ~40ms (±1% band) and the eager-adopt bench to ~80ms. One-line change at two `makeItems` call sites; metric names kept their `-100` suffix.

## Empirical verdict (post-PR-#177 bench)

Within-session vs main, at 1000-item resolution:

| metric | Δ vs main | reading |
|---|---|---|
| `hydrate-each-100` (item-only, first-mutation adoption) | -0.7% to +0.7% | flat |
| `hydrate-each-100-mount` (item-only mount) | -0.7% to +1.4% | flat |
| `hydrate-helper-100-mount` (helper mount, eager-wired) | -0.9% to +0.6% | **flat** |
| `hydrate-helper-100-state-change` | **+19% (1ms)** | confidently slower |

The eager-wire cost on 1000 items is below the bench's noise floor at the mount window. The challenge fresh-take's premise (eager wiring would be a real ~425ms perf cost worth a static analyzer to avoid) doesn't survive the empirical test at this scale. The `+19%` / `+1ms` on `state-change` is the cost of the work the framework is supposed to do on a state mutation — main's "fast" number was the silent-failure baseline this fix repairs.

## Open Questions / Resolved

- **Is the classifier worth the surface area?** The challenge view (revert to canonical eager + opt-in `static` flag for hot paths) is structurally cleaner: every other block hydrate hook honors the per-binding-Reactions-on-hydrate invariant; `each.hydrate` was the lone exception, and the entire `adoptServerItems`-on-mutation apparatus exists to compensate. The empirical bench supports this view: eager wiring is invisible at 1000 items. The classifier survives because it preserves the lazy path at *zero observable cost* for the ~30% of real components whose each-content is item-local — but the architectural argument for ripping it out and going eager-by-default is real and worth revisiting.

- **Method-call evaluation as witness.** `Dependency.depend()` is a no-op when `Scheduler.current` is null. The only way to register a Signal dep is to read it inside an active Reaction. So the runtime per-binding Reaction IS the optimal analyzer; static analysis is just predicting at compile-time what runtime would tell us O(1) at hydrate time. The classifier accepts this and uses static analysis only to *gate* whether to wire the Reaction at all — which is the only thing static analysis can soundly do.

- **`hydrate-helper-100-state-change` regression as feature, not bug.** The +1ms is the cost of 1000 helper invocations + 1000 setAttribute calls firing on `setActive('id-50')`. Main's baseline was 0 work because per-item Reactions weren't wired. Tachometer's "Slower" verdict is correctness-bought, not a regression to fix.

## Dependencies

- **PR #176** (Test: Make Hydration Tests Actually Hydrate) — required to surface the bug under tests at all. Until `ssrAndHydrate` used `setHTMLUnsafe`, every "hydration" test was running `fullRender` and hiding the deferral.
- **PR #177** (Test: Bump hydrate bench to 1000 items) — required to give tachometer enough resolution to read the perf delta. At 100 items the bench couldn't see ±25% changes.
- **Prior `hydration-perf-pass`** — the lazy `each.hydrate` it introduced is what this PR threads the needle on. Reverting it without a classifier would have re-paid the ~425ms regression on PerfCards.

## Reversal — classifier ripped out (2026-05-04)

The classifier design described above shipped in the initial PR #175 review rounds and was ripped out one round later. The architectural objections (raised in PR review) made it un-mergeable:

- **Abstraction-breaking.** The classifier lived in `blocks/` but wasn't itself a block. It re-derived per-block knowledge (how `each`/`if`/`svg` content is shaped) via hardcoded `case` statements, duplicating what the block registry already knows.
- **Extensibility hole.** A user-registered custom block hits the `default:` branch → bail conservative → permanently can't use the lazy hydrate path. The framework's own block types were privileged.
- **Shadow lexer.** Hardcoded `RESERVED_NAMES` (JS keywords) and `IMPLICIT_LOCALS` arrays, char-by-char expression scanning with brace-depth and ternary tracking — a quasi-JS parser re-implementing what the compiler already does.
- **Predicting what runtime tells you for free.** `Dependency.depend()` is a no-op outside an active Reaction; the runtime per-binding Reaction IS the optimal analyzer. The classifier was a static-analysis artifact predicting what live evaluation would tell us O(1) at hydrate time.

**Final architecture.** `each.hydrate` honors the same "register Reactions on hydrate" contract every other block hook honors. `adoptServerItems` is called immediately; per-item Reactions wire in place against the server-rendered DOM. No lazy/eager gate, no AST classifier, no special path. Empty-items + elseContent hydrates the else branch in place (what the perf pass had dropped).

```js
hydrate({ node, data, scope, region, renderAST, lookupExpression, hydrateInnerContent, self, isSVG }) {
  const { items, collectionType } = resolveItems(node, lookupExpression);
  if (items.length === 0) {
    if (node.elseContent) { /* hydrate elseContent in place + push isElse record */ }
    return;
  }
  const adopted = adoptServerItems({ ... });
  adoptServerItems({ ... });
}
```

The empirical bench at 1000 items showed eager wiring is **flat vs main** — the lazy optimization the classifier was protecting wasn't paying for itself at any scale we measured. The `+19% / +1ms on state-change` regression is the work the framework should be doing on a state mutation; main's "fast" baseline was the silent-failure shape this PR repairs.

**Files removed in the reversal:**
- `packages/renderer/src/engines/native/blocks/each-content-classifier.js` (260 lines)
- `packages/renderer/test/unit/each-content-classifier.test.js` (190 lines, 29 unit tests)

**Lesson.** When a prior optimization forces you to invent a parallel system to preserve it, and the optimization doesn't measurably pay for itself, the right answer is to drop the optimization, not bolt on the parallel system. The classifier was a workaround for an over-optimization. The empirical bench should have been the load-bearing input from the start; "the perf pass said this matters" was a stale assumption that didn't survive the bench-resolution upgrade in PR #177.

## Status

Completed 2026-05-02. Reversed 2026-05-04 (classifier ripped out, canonical eager shape).

## Completion

- **Estimated:** half-day to characterize and fix.
- **Actual:** ~6h wall-clock across one session (2026-05-02). ~3h active engineering once the bug was characterized; the rest was investigation, fresh-take subagents, bench-resolution debugging, and PR-stack management.
- **Completed:** 2026-05-02
- **Delta notes:** Two unplanned discoveries dominated the time:
  1. **`innerHTML` doesn't process DSD.** Spent two hours iterating on test setups that all "passed" because the test helper was running `fullRender`, not `hydrate`. The user pushed back on the strong claim ("are you saying hydration didn't work at all?") which forced me to verify with a probe test instead of asserting. The probe confirmed Chromium 147's `innerHTML` left the `<template>` as a literal child element; `setHTMLUnsafe` produced a real shadow root. Single fact, hours of indirection if it goes uncaught.
  2. **Bench noise floor.** First post-fix tachometer report came back "No Meaningful Change" at 100 items. The user asked whether the hydrate benches were too short to resolve anything — they were. The 6ms-13ms bench durations sat in the ±10-28% noise band and "no change" was meaningless. Bumping to 1000 items moved them into the ±1% band where the truthful `+19% on state-change` and `flat on mount` signals became visible. The perf-improvement skill's bench-duration table (~2ms → ±10-20%, ~50ms → ±1%) was the load-bearing reference.

  These two non-obvious findings now live in the `ssr-hydration` skill so future agents don't relearn them.

### Artifacts landed

- **PR #175** — bug fix on `bug/hydrate-reactivity`. Adds `each-content-classifier.js`, gates `each.hydrate`, 19 unit tests, unskips one previously-skipped integration test.
- **PR #176** — test infra on `test/hydrate-bench-real-dsd`. `ssrAndHydrate` uses `setHTMLUnsafe`, `Template.isServer` toggle, `shadowHTML` strips `data-sui-bind`. Adds `hydrate-helper-100-mount` and `hydrate-helper-100-state-change` measurements.
- **PR #177** — bench resolution on `test/hydrate-bench-1000-items`. One-line `makeItems(100)` → `makeItems(1000)` × 2.
- Two `<task-notification>`-style fresh-take analyses in `ai/workspace/fresh-takes/` (neutral + challenge lenses) — preserved as historical context for the architectural debate.

### Methodology notes for future agents

- **`innerHTML` and DSD don't mix.** Any test or bench that injects DSD HTML must use `setHTMLUnsafe` (or `Document.parseHTMLUnsafe`). `innerHTML` will silently fall through to `fullRender`. There is no error or warning.
- **`renderToString` in browser env requires `Template.isServer = true`.** Otherwise it returns empty output (`<tag><template shadowrootmode="open"></template></tag>`) because `template.render()` selects the client renderer, which writes to DOM, not strings.
- **Bench noise floor scales with bench duration.** Per-sample jitter is roughly constant in absolute terms; relative noise scales inversely with duration. Don't trust "no change" verdicts on benches under ~30ms — they may be unresolvable at ±10%+. Match bench scale to the resolution you need.
- **Cross-session "regressed from peak" verdicts are phantoms** until the `bench-reporter-overhaul` Track A schema_v2 ships. Read within-session `vs main` (in the "No Change" / "Slower" / "Faster" tables) for truthful signal.
