# Reactivity Functional Surface

## Goal

`@semantic-ui/reactivity`'s published API becomes module-level free functions: `signal`, `reaction`, `derive`, `computed`, `nonreactive`, `guard`, `afterFlush`, `flush`, `currentReaction`, `selector`. The `Signal` and `Reaction` classes remain exported for `instanceof` checks and inheritance, but the static-method-namespace pattern (`Reaction.create`, `Reaction.nonreactive`, `Signal.computed`, etc.) goes away.

The win is concrete and is the reason to do this pre-1.0: **static methods on a class ship with the class**. Today, any consumer that creates a reaction pulls in `Reaction.nonreactive`, `Reaction.guard`, `Reaction.afterFlush`, `Reaction.flush`, `Reaction.scheduleFlush`, `Reaction.getSource`, `Reaction.current`, and `Reaction.create` whether they call them or not. Removing those statics and re-publishing as free functions lets the bundler drop what nobody imports. For the standalone trio on CDN (`@semantic-ui/utils` + `@semantic-ui/reactivity` + `@semantic-ui/query`), this is the difference between paying for the full reactivity surface and paying only for the primitives you reach for. It also positions future additions (`selector`, eventual `batch`, combinators, resource primitives) to land as free-fn-only modules that cost nothing to non-users.

Secondary win: the surface starts reading like `@semantic-ui/utils` — bare verbs and nouns at the import line, no class-namespace ceremony for things that are not actually class operations (a flush is a Scheduler op, not a Reaction op).

## Design / Implementation

### Published module surface

Module exports after the refactor:

```js
import {
  // construction
  signal, reaction, derive, computed, selector,
  // control
  nonreactive, guard, afterFlush, flush, currentReaction,
  // tracing
  setTracing, isTracing, setStackCapture, isStackCapture,
  // classes (instanceof, inheritance, advanced)
  Signal, Reaction, Dependency, Scheduler,
} from '@semantic-ui/reactivity'
```

Construction factories return real class instances (Signal and Reaction stay as classes internally for monomorphic prototype dispatch and cross-realm `Symbol.hasInstance`). `signal(0)` is `new Signal(0)` under the hood. `reaction(cb)` is `new Reaction(cb).run()`. The classes ship because consumers can still write `new Signal(0)` if they prefer that idiom — dual construction shape is fine and matches the SUI position on meeting people in their natural idiom.

### Removed from Reaction class statics

All proxy-to-Scheduler statics go away. `Reaction.create`, `Reaction.current`, `Reaction.flush`, `Reaction.scheduleFlush`, `Reaction.afterFlush`, `Reaction.getSource`, `Reaction.nonreactive`, `Reaction.guard`, `Reaction.setTracing`, `Reaction.isTracing`, `Reaction.setStackCapture`, `Reaction.isStackCapture` — each becomes a free fn at module level, none remains on the class. The Reaction class is left with prototype methods only (`run`, `stop`, `invalidate`, `onCleanup`, `fireCleanups`, `setContext`, `addContext`, `setTrace`) and the state booleans (`firstRun`, `active`).

### Removed from Signal class statics

`Signal.computed` becomes free fn only. Tracing setters that were duplicated as `Signal.setTracing` / `Signal.isTracing` / `Signal.setStackCapture` / `Signal.isStackCapture` (already exported separately from `helpers.js`) drop their class-static duplicates.

### Signal statics kept and renamed

`Signal.equalityFunction`, `Signal.cloneFunction`, `Signal.idFunction` lose the `Function` suffix. After: `Signal.equality`, `Signal.clone`, `Signal.id`. The suffix was type information the passed value already carries. `Signal.safety` keeps its name — the framing is intentional ("how careful should this signal be") and three of the four preset values (`'reference'`, `'clone'`, `'none'`) read as safety modes, not as mode tags. `Symbol.hasInstance` stays for cross-realm checks.

### Signal option names

Same suffix drop on instance options:

```js
// before
new Signal(0, { equalityFunction, cloneFunction, idFunction })
// after
signal(0, { equality, clone, id })
```

`safety` stays. The Reaction option `firstRun: false` (suppress auto-run on construction) keeps its name — the option and the instance state `comp.firstRun` describe the same concept at two scopes (configure it, then check it), which matches the consistent-vocab-across-levels principle.

### ID-helper casing

`getID`, `getIDs`, `hasID` become `getId`, `getIds`, `hasId`. Consistent with `idFunction` (lowercase already) and with broader modern JS convention.

### Dropped from Signal prototype

`signal.subscribe(cb)` is removed. It was a thin wrapper around `reaction(() => cb(s.value))`. The primitive composes trivially and the wrapper was the kind of surface that AI assistants reach for over the canonical primitive. Pre-1.0 churn is acceptable; consumers that used it compose with `reaction` directly.

### Shared derive / computed implementation

Today `Signal.prototype.derive` and `Signal.computed` each inline a WeakRef-to-output pattern with parent-reaction cleanup. They share enough structure to factor out one private helper:

```js
const createDerivedSignal = (reactionBody, options) => {
  const out = new Signal(undefined, options)
  const ref = new WeakRef(out)
  const r = new Reaction(() => {
    const live = ref.deref()
    if (!live) { return r.stop() }
    reactionBody(live)
  })
  r.run()
  Scheduler.current?.onCleanup(() => r.stop())
  return out
}

export const derive = (source, fn, options) =>
  createDerivedSignal((out) => out.set(fn(source.get())), options)

export const computed = (fn, options) =>
  createDerivedSignal((out) => out.set(fn()), options)

Signal.prototype.derive = function (fn, options) {
  return derive(this, fn, options)
}
```

`derive` ships with both the free-fn shape and the instance shape (same shared core). `computed` is free-fn only — there's no source signal to hang it off. The WeakRef-to-output + parent-reaction `onCleanup` contract must survive the refactor verbatim; it's load-bearing for nested derived signals not pinning their sources through the reaction's closure.

### selector lands as free fn

The `selector` primitive (Solid's `createSelector` adapted for SUI) lands in this PR as a free function, not on `Signal.prototype`. This validates the architectural pitch: new primitives become cheap additions that tree-shake when unused. The implementation in [PR #224](https://github.com/Semantic-Org/Semantic-Next/pull/224) ships sans the bench-tooling changes also included in that PR. Tests are adapted from #224 to the free-fn signature.

```js
const select = selector(currentRoute, (key, value) => key === value)
// inside a reaction:
select(routeKey)  // returns boolean, wakes only on flip
```

### Callback parameter convention

No enforcement. The reaction callback receives the Reaction instance as its first argument; authors name it whatever fits the callsite. Docs use `reaction` for top-level non-nesting cases (shadowing the import is fine, it costs an ESLint `no-shadow` rule and nothing else) and switch to a distinct name when nesting forces it (`outer`, `r`, etc.). Framework internals continue to use distinct names because they nest reactions constantly.

### Internal callsite migration

~30 files across `packages/{renderer,templating,component,query}/src` plus behaviors use `new Signal` and `Reaction.create` today. All migrate to the factory form. The renderer's snapshot of `Signal.equalityFunction` in `reactive-context.js` becomes `Signal.equality`. The `each` branch's read of `Signal.idFunction` becomes `Signal.id`. The templating `template.js` callback bag (`reaction`, `signal`, `afterFlush`, `flush`, `nonreactive`) already exposes the functional shape to user code and switches its underlying implementation to the free fns. Template helpers `guard` and `nonreactive` in `template-helpers.js` repoint to the free fns.

**Migration tactic:** temporarily remove `Signal` and `Reaction` from `index.js` exports during this work. Every internal `new Signal` and `instanceof Signal` errors at compile / runtime, which forces a complete sweep. Restore the class exports at the end of the session once internal callers are clean. Catches anything a search might miss.

### Throw-safety preservation

The hardening that shipped in [PR #207](https://github.com/Semantic-Org/Semantic-Next/pull/207) (terminal `stopped` flag, `firstRun = false` in `finally`, per-reaction try/catch in `flush`, throw-safety in `Reaction.guard`'s inner reaction) is preserved verbatim. Bias toward the current shape — this refactor does not rework hardening semantics. If a future PR wants to revisit those choices, that's a separate body of work against whatever main ships.

### Test migration

All reactivity package tests, plus tests in renderer/templating/component/query that construct Signals or Reactions directly, migrate to the factory form. Tests that exercise instance methods stay structurally identical.

### Types migration

`packages/reactivity/types/index.d.ts` rewrite to declare the module-level functions. Class `.d.ts` files lose their static-method declarations and gain the free-fn signatures. Cross-package type imports update where the old static names appear.

### Out of scope

- **Docs migration.** `packages/reactivity/README.md`, MCP context (`ai/skills/essentials/mental-model.md`, `ai/skills/contributing/internals.md`), Astro doc pages at `docs/src/pages/docs/guides/reactivity/` (10 mdx files), and playground examples ship in a separate PR bundled with the `safety` setting doc updates. The refactor PR exposes the new API surface; the docs PR teaches it.
- `setArrayProperty` split into `setItemProperty` / `setEach` — deferred for its own follow-up plan, needs workshopping with the Query overloading patterns
- The bench-tooling changes from PR #224 — selector lands without those
- TC39 Signals integration (separate iceboxed plan)
- Reactivity-hardening Item 9 (dep-tracking rewrite) — closed out, not relitigated here
- Rewriting throw-safety / hardening primitives — bias toward current shape, future PRs handle that against whatever main ships

## Open Questions

None substantive. All naming decisions resolved in the 2026-05-28 pair session.

## Dependencies

**Blocks:** [Release 0.18.0](release-0-18-0.md). The 0.18.0 release ships this refactor as the last substantive API change before docs polish and tag.

**Blocked by:** None.

**Coordinates with:** [PR #224](https://github.com/Semantic-Org/Semantic-Next/pull/224) (selector). The selector implementation lands inside this PR as a free fn; #224 itself either closes or is rewritten to ship the bench tooling separately, depending on what's still useful from that branch after this lands.

## Preflight

Before any rewrites, audit reactivity test coverage and fill gaps so the suite actually catches regressions of the contracts the refactor preserves — not just "tests pass" but "tests would catch the failure modes." The pat-on-the-back failure mode is refactoring, watching green tests, declaring success, and shipping a subtle break in something the tests didn't actually exercise.

Contracts the suite must verify before the rewrite begins:

- `nonreactive(fn)` — reads inside don't subscribe the caller
- `guard(fn, eq)` — deep-equality short-circuits downstream re-fires
- `afterFlush(cb)` — runs after the in-flight flush, ordering preserved across reaction batches
- `flush()` — synchronous drain, including reactions queued by other reactions during the same flush
- `currentReaction()` — returns the active reaction or null
- `derive` and `computed` — WeakRef on the output side, parent-reaction `onCleanup` registration, derive-inside-reaction cleanup-on-parent-stop
- `signal()` factory return — passes `instanceof Signal`, exposes prototype methods identically to `new Signal()`
- `reaction()` factory — auto-runs by default, `{ firstRun: false }` opts out, returns a Reaction instance
- Class exports still satisfy `instanceof` (Symbol.hasInstance cross-realm)
- Throw-safety hardening from PR #207 — terminal `stopped`, `firstRun = false` in `finally`, per-reaction try/catch in `flush`

~1-2h pair. Fill any gaps; verify the new tests fail meaningfully when their target contract is broken (mutation testing in spirit, not necessarily mechanically).

## Session

One focused session, ~6-8h pair after preflight.

- Wire the new free fns in `index.js`
- Factor `createDerivedSignal`
- Remove statics from Reaction and Signal (`Reaction.create`, `Reaction.current`, `Reaction.flush`, `Reaction.scheduleFlush`, `Reaction.afterFlush`, `Reaction.getSource`, `Reaction.nonreactive`, `Reaction.guard`, tracing dupes; `Signal.computed`, tracing dupes)
- Rename `Signal.equality` / `Signal.clone` / `Signal.id` statics; same on option keys
- Rename `getId` / `getIds` / `hasId`
- Drop `Signal.prototype.subscribe`
- Add `selector` module with adapted tests from PR #224
- Temporarily yank `Signal` / `Reaction` class exports to force the internal-callsite sweep complete, restore at end
- Internal callsites in `packages/{renderer,templating,component,query}/src` + behaviors all updated
- Type files rewritten
- Full monorepo suite green
- CHANGELOG entry for BREAKING

Preflight + session: ~7-10h total in one sitting.

## Status

`scoped` — design decisions made in pair session 2026-05-28. Ready to execute. All naming questions resolved; one deferred follow-up (`setArrayProperty`) explicitly out of scope.
