# Reactivity Docs Migration + setArrayProperty Split

## Goal

Two follow-ups deferred out of the functional-surface refactor ([PR #226](https://github.com/Semantic-Org/Semantic-Next/pull/226), merged into main):

1. **Docs + types migration.** The reactivity guides, API reference, playground examples, and hand-authored `.d.ts` files still teach the old class-static surface (`Reaction.create`, `Signal.computed`, `signal.subscribe`, `equalityFunction`/`cloneFunction`/`idFunction`, `getID`/`getIDs`/`hasID`). The runtime shipped the functional surface (`signal`, `reaction`, `derive`, `computed`, `match`, free-fn `flush`/`afterFlush`/`nonreactive`/`guard`, renamed options/helpers). TypeScript consumers currently see `.d.ts` methods that throw at runtime. This is the larger and more urgent half.

2. **`setArrayProperty` split.** The overloaded `setArrayProperty(indexOrProperty, property, value)` arg-sniffs between "set on one item by index" and "set on all items." The functional-surface plan flagged splitting it into two honestly-named methods, deferred because it needs a design decision and wants workshopping against Query's overloading conventions.

These bundle because they touch the same package and the same release window (0.18.0), and because the safety-model doc reconciliation (below) is intertwined with the reactivity doc pass.

## Design / Implementation

### Part 1 — Docs + types migration (scoped, mechanical-with-judgment)

**Surface (verify against current main before starting — counts drift):**
- `docs/src/pages/docs/guides/reactivity/` — 10 mdx guides
- `docs/src/pages/docs/api/reactivity/` — ~12 mdx API pages
- `docs/src/examples/reactivity/` — ~50 example files (`index.js`, plus `page.js`/`component.js` multi-file examples)
- `packages/reactivity/types/*.d.ts` — `signal.d.ts`, `reaction.d.ts`, `scheduler.d.ts`, `index.d.ts`

**What changed in the runtime (the migration target):**
- Class statics gone: `Reaction.create` → `reaction()`, `Reaction.flush` → `flush()`, `Reaction.afterFlush` → `afterFlush()`, `Reaction.scheduleFlush` → `scheduleFlush()`, `Reaction.nonreactive` → `nonreactive()`, `Reaction.guard` → `guard()`, `Reaction.getSource` → `getSource()`, `Reaction.current` → `currentReaction()`, `Signal.computed` → `computed()`
- `signal.subscribe(cb)` removed — compose `reaction(() => cb(s.value))`
- Option/static renames: `equalityFunction` → `equality`, `cloneFunction` → `clone`, `idFunction` → `id`
- Helper renames: `getID`/`getIDs`/`hasID` → `getId`/`getIds`/`hasId`
- `match(source, matchFn?)` is new (Solid's `createSelector` adapted) — worth a guide/API entry, not just a migration target
- `new Signal()` and `new Reaction()` still work and still export — dual idiom is intentional. Docs should *lead* with the factory form (`signal()`, `reaction()`) but `new` is not wrong. Don't frame `new` as deprecated.

**Hard breaks vs modernizations (treat differently):**
- *Hard breaks* (example throws at runtime today): anything using `Reaction.create`/`.flush`/etc, `Signal.computed`, `.subscribe()`, the renamed option keys, the renamed id helpers. The `reactive-subscribe` example + its intro section document a method that no longer exists — these need rethinking (convert to `reaction`, or retire the page), not just find-replace.
- *Modernizations* (still runs, just old idiom): bare `new Signal(0)`. Update to `signal(0)` for house style but it is not breaking.

**Safety-model doc reconciliation (do NOT skip — separate axis of staleness):**
`docs/src/pages/docs/guides/reactivity/signal-options.mdx` documents a `freeze` preset as the default (deep-freeze, throws on mutation). **`freeze` does not exist in the shipped runtime.** It was evaluated for ~a month and abandoned for performance and DX reasons (unintuitive throw-on-mutate errors). The shipped `safety` presets are `clone`, `reference` (default), `none` — verify against `packages/reactivity/src/signal.js` (`static safety = 'reference'`, `protect()` only branches on `'clone'`). Rewrite the safety section to the three real presets. This is the "safety doc updates" the refactor plan said this PR would bundle. Trust the source, not the existing doc.

**Types (`.d.ts`) — CR finding #2, ships wrong contracts today:**
- `signal.d.ts` — `SignalOptions` still declares `equalityFunction`/`allowClone`/`cloneFunction`; rename to `equality`/`clone`/`id`, drop `allowClone` (gone), add `safety`. Remove the `subscribe()` declaration. Remove `static computed`. Rename `getID`/`getIDs`/`hasID`. Add `static equality`/`clone`/`id`/`safety`. Add the instance `derive`. The module-level free fns (`signal`/`reaction`/`derive`/`computed`/`match`/`nonreactive`/`guard`/`flush`/`afterFlush`/`scheduleFlush`/`currentReaction`/`getSource`) need declarations — likely new `.d.ts` files under `types/helpers/` mirroring `src/helpers/`, re-exported from `index.d.ts`.
- `reaction.d.ts` — strip all the removed statics (`create`/`current`/`flush`/`scheduleFlush`/`afterFlush`/`getSource`/`nonreactive`/`guard`/tracing). Reaction is noun-only now. Document the `firstRun` constructor option (auto-run, opt out with `{ firstRun: false }`).
- `index.d.ts` — mirror `src/index.js`'s export shape.
- The `types` skill (`ai/skills/contributing/types.md`) is the authority on the mirror structure, cross-package imports, `@see` link derivation, and where `any` is the honest answer. Read it before touching `.d.ts`.

**Verification:**
- Every example must run. Examples are served + rendered via the Semantic UI MCP tools and the playground — a throwing example is a visible failure. Use the MCP `validate_template` / example-rendering tooling to confirm, and the docs dev server (https://dev.semantic-ui.com) to spot-check rendered pages.
- `grep -rE "Reaction\.(create|flush|...)|Signal\.computed|\.subscribe\(|equalityFunction|cloneFunction|idFunction|\.getID\b|\.getIDs\b|\.hasID\b" docs/ packages/reactivity/types/` returns clean at the end.

### Part 2 — `setArrayProperty` split (initial, needs design)

Current shape:
```js
sig.setArrayProperty(0, 'count', 5);   // index form — set on item at index 0
sig.setArrayProperty('done', true);    // all-items form — set on every item
```
The arg-sniff (`isNumber(indexOrProperty)`) picks the branch. Two operations behind one name.

**Open design questions (resolve in a pair session, do not guess):**
- Names. The refactor plan floated `setItemProperty(index, prop, value)` + `setEach(prop, value)`. Confirm or revise. `setEach` reads clean for the all-items case; `setItemProperty` is wordy but honest. Alternatives worth weighing: `setItem(index, prop, value)`, `setAll(prop, value)`.
- Relationship to `setProperty` (id form) and `setProperty` (object form), which *also* overload. Does the split want to extend to those, or stay scoped to the array-index case? Query's `on()`/event-delegation overloading is the in-house reference for when overloading is idiomatic vs when honest names win — workshop against it.
- Migration: this is a BREAKING rename. CHANGELOG entry + the doc/example/type updates in Part 1 must reflect the final names (so Part 2's design ideally lands before or with Part 1's example pass to avoid double-touching the collection-helpers docs).

**Out of scope:** the broader "should all overloaded Signal methods split" question. Scope this to `setArrayProperty` only; note the others as a possible future pass.

## Skills to read before the work is complete

Load these via MCP (`use_skill`) or read directly. The agent picking this up should treat them as required, not optional:

**For the types half:**
- `contributing/types` — mirror structure, `import type`, `@see` URL derivation, `this`-param patterns, where `any` is honest. The `.d.ts` files are hand-authored and ship to consumers.

**For the docs half (`ai/skills/docs/`):**
- `docs-writing` — prose quality framework, voice
- `docs-authoring-standards` — the baseline conventions every page follows
- `docs-paths` — how doc/example file paths map to URLs and how examples wire into pages
- `docs-examples-authoring` — how playground examples are structured (`index.js` vs multi-file `page.js`/`component.js`)
- `docs-page-api-reference` — format for the `api/reactivity/` pages (signatures, param tables, header hierarchy)
- `docs-page-guide` — format for the `guides/reactivity/` conceptual pages
- `docs-target-audience` — who the docs are for (informs example density)
- `docs-ai-tropes` — the catalog of AI prose tells to avoid (em-dashes, magic adverbs, etc.)

**User-invocable doc skills** (also available as `/example`, `/guide`, `/api-doc`):
- `example` — creating/editing playground examples
- `guide` — guide pages
- `api-doc` — API reference pages

**Project-specific reminders:**
- Examples are written for AI evaluators — maximize feature-demonstration density (see the example-audience guidance).
- Voice rules from AGENTS.md `<code_formatting>` apply to mdx prose: lowercase first word where natural, no em-dashes, no semicolons in prose, no unicode arrows, drop trailing periods on one-liners.
- Use MCP doc tooling (`list_examples`, `get_example`, `validate_template`, the doc-serving endpoints) rather than reading `docs/` files blind — the MCP surface is the contract.

## Open Questions

- **`setArrayProperty` final names** — needs the pair session described in Part 2. Everything else in Part 1 is executable now.
- **`match` doc placement** — does it get its own API page (`api/reactivity/match.mdx`) + a guide section, or fold into an existing collection/derivation page? Quick call during the pass.
- **`reactive-subscribe` example/intro** — convert to a `reaction` example or retire the page? It currently teaches a removed method.
- **Sequencing Part 1 vs Part 2** — if `setArrayProperty` names land first, the collection-helpers docs/examples/types get touched once. If docs go first, they get touched twice. Lean: resolve Part 2's names early (short session), then run Part 1 once with final names.

## Dependencies

- **Upstream:** [Reactivity Functional Surface](archive/reactivity-functional-surface.md) — merged. This is its deferred tail.
- **Blocks:** [Release 0.18.0](active/release-0-18-0.md) — the release ships with correct docs + types or it ships consumer-facing lies. The types are wrong-at-runtime today, so this gates a clean tag.

## Sessions (estimated)

1. **`setArrayProperty` design** (~1h pair) — lock names, decide scope vs the other overloaded setters, decide sequencing. Short.
2. **Types migration** (~2-3h) — `.d.ts` rewrite to the functional surface + safety options + helper renames. Gated on the `types` skill read. Verifiable with `tsc`-adjacent checks and consumer-shape review.
3. **Docs + examples migration** (~4-6h) — the 60+ file pass: guides, API pages, examples. Includes the safety-model reconciliation and the `subscribe`/`match` page decisions. Each example verified rendering via MCP/playground.

Total: ~7-10h, dominated by the example pass. Mode: `pair` for the design session, `agent`-with-checkpoints viable for the mechanical migration once names are locked and skills are read.

## Status

`initial` for Part 2 (`setArrayProperty` names unresolved). `scoped` for Part 1 (docs + types) — the migration targets are concrete and verifiable, the only judgment calls are the `subscribe`/`match` page decisions and the safety-section rewrite, all flagged above. Created 2026-05-29 as the deferred tail of the functional-surface refactor. Handing to a fresh agent: read the skills listed above before completing, verify the safety model against `signal.js` source (the existing `freeze` docs are stale), and confirm every example runs.
