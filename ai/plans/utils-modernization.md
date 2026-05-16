# Utils Modernization

## Goal

`@semantic-ui/utils` has accumulated a mix of principled next-gen design and lodash-parity leftovers. The library's instinct is right — when two functions exist, they should capture meaningfully distinct behaviors, not arg-shape variants. A few leftovers violate that, and a few modern patterns are missing.

This plan captures the decisions needed to reconcile the library with that principle and stage the breaking changes behind a single release window.

**Naming principle**: two exports earn their place when they express **distinct intent at the call site**, even if the implementations overlap. Two names for the same intent (`any = some`) is a wart; two names for distinct intents that happen to share a body (`wrapFunction` as defensive normalization vs `constant` as explicit factory) is a feature — the name is for the reader.

## Design / Implementation

### Removals (breaking)

| Export | Issue | Proposed action |
|--------|-------|-----------------|
| `any` | Exact alias of `some` (`arrays.js:237`) — two names, one function | Delete. Document `some` as canonical (matches `Array.prototype.some`). |
| `onlyKeys` | Same operation as `pick` but takes array instead of spread args | Pick one shape. Most callers pass an array today (from config/filters/`Object.keys`) — recommend standardizing on `pick(obj, keys)` taking an array, delete `onlyKeys`. |

### Signature changes (breaking)

| Export | Issue | Proposed action |
|--------|-------|-----------------|
| `first` / `last` | Return-type polymorphism: `first(arr)` returns element, `first(arr, 2)` returns array | Split: `first(arr)` always returns the element. Add `firstN(arr, n)` / `lastN(arr, n)` that always return arrays. |

### Additions

| Export | Rationale |
|--------|-----------|
| `returnsSelf`, `returnsNull`, `returnsTrue`, `returnsFalse`, `returnsUndefined` | Named, shared, reference-stable functions for the common constant returns. Ship the common cases as direct exports so every consumer dedupes to the same closure — enables reference-equality checks like `template.js`'s `this.onThemeChangedCallback !== noop` pattern to generalize across the codebase. |
| `constant = wrapFunction` | Alias for the explicit-factory intent. Same body as `wrapFunction`, different semantic intent at the call site: `wrapFunction(x)` reads as defensive normalization ("value-or-function, normalize"); `constant(x)` reads as explicit factory ("function that returns this"). Covers the programmatic-value case (`constant(config.default)`) where a direct named export can't. |
| `identity` → rename to `returnsSelf` | `identity` is brand-new in this release (from the noop/identity split). Rename to `returnsSelf` for consistency with the prefix family and to avoid FP jargon. Ship both renames together in this release window rather than churning twice. |
| `pipe(...fns)(x)` | Functional composition is idiomatic in modern TS; lodash's `flow` is clunky. Small primitive, pairs well with existing polymorphic iterators. |
| `attempt(fn, fallback)` or `safely(fn)` | Several sites in the codebase use `try { ... } catch { /* noop */ }` (see `browser.js:113,152,178,191`). A named helper makes intent greppable and documents the pattern. |
| `tap(fn)` | Passes value through while running a side effect. Small, useful in pipes and reactive chains. |

### Decisions needed

- **Do `any` and `onlyKeys` get deprecation shims in this release, or hard-deleted?** Hard-delete is cleaner for a 1.0-era library; deprecation adds complexity for a short window. Recommend hard-delete + loud CHANGELOG entry + migration note.
- **`first`/`last` strategy:** (a) always-scalar + new `firstN`/`lastN`, or (b) always-array (breaking for all current 1-arg callers)? Recommend (a) — smaller blast radius, clearer semantics at call site.
- **`pick` arg shape final answer:** spread (`pick(obj, 'a', 'b')`) or array (`pick(obj, ['a', 'b'])`)? Recommend array — composes with `Object.keys`, filter results, config. Spread is 2014 ergonomics for hand-literal keys that rarely appear in modern code.
- **`pipe` return style:** eager (`pipe(fns, x)`) or curried (`pipe(...fns)(x)`)? Curried composes better; eager is simpler.
- **`attempt` vs `safely` naming:** `attempt(fn, fallback)` reads naturally ("attempt this, else fallback"). `safely(fn)` suggests "swallow errors" without the fallback value — less useful.
- **Shape resolved.** Ship shared direct exports for the common constant returns (`returnsSelf`, `returnsNull`, `returnsTrue`, `returnsFalse`, `returnsUndefined`) — reference-stable across consumers, enables dedup and ref-equality checks. `constant` is an alias of `wrapFunction` covering the programmatic-value case. `identity` renames to `returnsSelf` in the same release window.
  - Rejected names along the way: `always` (asserts continued truth when actual use is ephemeral-default), bare `returns(value)` / `constant(value)` as the *only* surface (works, but loses the dedup win from sharing primitive closures across the codebase).

### Out of scope

- Changes to `extend` / `deepExtend` / `assignInPlace` — the three merge variants already capture distinct contracts (shallow / recursive / sync-with-deletion). Leave as-is.
- Rewriting `proxyObject`, `weightedObjectSearch`, `hashCode` — these are niche, principled, and earn their export.

### Completed as one-line wins (not part of this plan)

- `proxyObject` default swapped from `noop` to `() => ({})`. *Revisit:* `() => ({})` allocates a fresh closure on each defaulted call — once `always` lands, change to `always({})` for a shared reference.
- `hasProperty` reduced to thin re-export of `Object.hasOwn` (ES2022).
- `utility-functions.md` skill updated for `noop` / `identity` split.

### Adoption once `always` lands

Audit the codebase for `() => <literal>` patterns that are candidates to migrate:
- `NO_EQUALITY = () => false` in `reactivity/src/signal.js` → `always(false)`
- `filter: () => true` defaults (e.g. `docs/src/examples/templates/expressions-fn/filter-list.js:7`)
- `proxyObject` default (above)
- Any `defaultSettings` entries that use bare `() => x` closures

## Open Questions

See "Decisions needed" above. Five design calls, all quick — should fit in one pair session.

Once decisions are made:
- Codemod for `any` → `some`, `onlyKeys` → `pick` across `packages/`, `src/`, `docs/`, `tools/`.
- Audit `first(arr, N)` / `last(arr, N)` call sites — all need rewrite to `firstN` / `lastN`.
- CHANGELOG entries under **BREAKING** for each removal/signature change.
- Type-file updates.
- Skill doc (`ai/skills/authoring/utility-functions.md`) updates.

## Dependencies

None. Can land anytime — breaking changes batch naturally with other utils changes in a release window.

## Status

`initial` — design decisions pending. Created 2026-04-16 off the utils review following the signal-safety PR.
