# Reactivity Surface Rename

## Goal

Bring the `@semantic-ui/reactivity` public surface in line with 2026 conventions before 1.0 ships. Promote `signal`, `reaction`, `computed`, `nonreactive`, `guard`, `afterFlush`, `flushed`, `batch`, `flush` to top-level free-function imports. Sweep callsites across `packages/`, `src/`, `docs/`, and `docs/src/examples`. Final phase removes the class-static forwards entirely — no compat aliases, no dual surface.

Justified by the legibility test: every line that touches the reactivity surface reads more clearly under the new form. `signal(0)` over `new Signal(0)`. `computed(fn)` over `Signal.computed(fn)`. `afterFlush(cb)` over `Reaction.afterFlush(cb)`. The class-indirection layer in the current form doesn't carry meaning at the call site — the rename drops it without losing the underlying type structure.

Sequenced after [reactivity-hardening](reactivity-hardening.md) and [signal-performance / PR #150](active/signal-performance.md) close, to avoid mixing correctness/perf bisects with surface migration noise. Estimated at a week of practical work; ships before 1.0 launch end of year.

## Design / Implementation

Maturity: **scoped**. Surface rule concrete, phase sequencing fixed, removal list known. The Open Questions section captures gametime decisions that surface during execution, not blockers.

### The rule

One canonical form per operation. No dual surface, no aliases.

- **Operations → top-level free functions only.** `signal`, `computed`, `reaction`, `nonreactive`, `guard`, `afterFlush`, `flushed`, `batch`, `flush`. After Phase 3 these do not exist as class statics.
- **State and configuration → on the class only.** `Signal.configure({...})`, `Signal.tracing`, `Signal.stackCapture`, `Signal.safety`, `Signal.defaultEquality`, `Signal.defaultClone`, `Signal.noEquality`, `Reaction.current`, `Scheduler.scheduleFlush` (framework-internal), `Scheduler.getSource` (debug utility). No top-level alias.
- **Instance methods → on the instance.** Every `.get`, `.set`, `.value`, `.peek`, `.clone`, `.subscribe`, `.derive`, `.notify`, `.mutate`, plus all 20+ mutators on Signal. `.stop`, `.invalidate`, `.run`, `.firstRun`, `.active`, `.stopped`, `.dependencies`, `.onCleanup` on Reaction.
- **Class types → exported for `instanceof` and extension.** `Signal`, `Reaction`, `Scheduler`, `Dependency` remain. Used for type checks and library-author subclassing; not the canonical entry surface.

Single principle: **operations are verbs (functions), state is a noun (on the class).** No edge cases.

`template.js` already follows this pattern. Inside `buildCallParams` (packages/templating/src/template.js:880-887), templates destructure `reaction`, `signal`, `afterFlush`, `nonreactive`, `flush` into callback scope. Inside `createComponent({ reaction, signal, afterFlush })` the lowercase forms have been live in real user code for three years. The rename promotes that pattern from "template-scoped destructuring" to "package-level imports" — lifting the scope, not inventing a shape.

### Convention: `comp` for the captured/param

`reaction(fn)` returns a `Reaction` instance. The natural variable name `reaction` collides with the imported function. Convention: use `comp` as the capture name and as the callback parameter name.

```js
const comp = reaction(() => {...});  // capture for .stop()
comp.stop();

reaction((comp) => {                  // param name
  if (comp.firstRun) {...}
});
```

Matches the framework's longstanding "computation" terminology (the Tracker lineage word for "active reactive computation"). In real component code, signals and reactions usually get assigned to instance properties (`self.items = signal([])`, `self.reactions.push(reaction(...))`), which dodges the collision entirely — only the ~10% of usages that capture for `.stop()` need the convention.

### Phase 1 — Add free-function surface

New top-level exports from `@semantic-ui/reactivity`:

```js
export {
  signal,       // (initial, options) => Signal
  computed,     // (fn, options) => Signal
  reaction,     // (fn, options) => Reaction
  nonreactive,  // (fn) => T — passthrough that pops tracking
  guard,        // (fn, eqFn) => T — equality-gated re-track
  afterFlush,   // (cb) => void — interleave-to-stable contract per reactivity-hardening Item 1
  flushed,      // () => Promise<void> — async companion to afterFlush
  batch,        // (fn) => T — sync-only, suppress flush scheduling until block exits
  flush,        // () => void — sync drain
} from './surface.js';
```

Each is a thin wrapper around the existing class API. `signal(v)` is `new Signal(v)`. `reaction(fn)` is `Reaction.create(fn)` returning the instance. `flushed()` is `() => new Promise(r => afterFlush(r))`. `batch(fn)` is the new primitive — sync-only, async escapes at first await.

One small PR. No internal callsites change yet. TypeScript types accompany.

### Phase 2 — Internal sweep

Three PRs that can run in parallel after Phase 1 lands. Each is bounded by directory scope so reviewers can read the diff in one pass.

**Phase 2a — `packages/*/src` sweep.** Renderer (lit + native engines), component, templating, query, query/behavior. Every `Reaction.create(...)` → `reaction(...)`. Every `Signal.computed(...)` → `computed(...)`. Every `new Signal(...)` → `signal(...)`. Every `Reaction.afterFlush`, `Reaction.flush`, `Reaction.nonreactive`, `Reaction.guard` → free function imports. Test files at `packages/reactivity/test/unit/` migrate here too — they're the canonical examples agents pattern-match against.

**Phase 2b — `src/` sweep.** First-party components and behaviors. Same migration mechanics.

**Phase 2c — `docs/src` + `docs/src/examples` sweep.** Documentation guides and playground examples. Largest file count, lowest behavioral risk. Migration guide for downstream users co-authored here (lives in the docs).

### Phase 3 — Removal

Once Phase 2 is complete, drop from the class API:

- `Reaction.create(fn)` static
- `Reaction.nonreactive`, `Reaction.guard`, `Reaction.afterFlush`, `Reaction.flush` static forwards
- `Signal.computed(fn)` static

These are removed entirely. No compat shims, no deprecation warnings, no JSDoc tags carrying old names forward. Pre-launch with no downstream users means clean rename.

What stays:

- `Signal`, `Reaction`, `Scheduler`, `Dependency` classes — exported for `instanceof`, type, library-author extension
- `Signal.configure`, `Signal.tracing`, `Signal.stackCapture`, `Signal.safety`, `Signal.defaultEquality`, `Signal.defaultClone`, `Signal.noEquality` statics
- `Reaction.current` static
- `Scheduler.scheduleFlush`, `Scheduler.getSource` statics (framework-internal, low-frequency debug)
- All instance methods on Signal and Reaction
- `Signal.derive(fn)` as an instance method — reads naturally on the source noun, post-hardening Item 8 shares the lazy-refcount machinery with `computed()`. Not a duplicate; `computed(fn)` is open-ended while `source.derive(fn)` is source-bound.

Migration guide ships with this phase: changelog entry mapping each removed form to its replacement. No codemod — find/replace covers it, no downstream consumers to support.

## Open Questions

Gametime decisions that surface during execution. Not blockers.

- **`flushed()` semantics from inside a reaction callback.** What does `await flushed()` mean when called from inside a reaction's body? My read: it resolves when the current flush completes; since the reaction is part of that flush, `await flushed()` from inside a callback waits for the post-cascade tail. Confirm in Phase 1 implementation when the wrapper is written.
- **Exact wording in the migration guide.** Drafted in Phase 2c when the surface is fully visible.

## Dependencies

- [Reactivity Hardening](reactivity-hardening.md) — Items 5/6/8 must ship first. The rename promotes a stable underlying surface; Items 5/6/8 are still moving that surface.
- [Signal Performance / PR #150](active/signal-performance.md) — `.clone()` method, `safety` preset, removed legacy exports (`setTracing` etc. already gone). The rename builds on this surface.

Hardening Item 9 evaluation can run in parallel — its outcome doesn't gate the rename.

**Downstream:** Last reactivity-side work before 1.0. Nothing reactivity-side blocks on it.

## Sessions (estimated)

1. **Phase 1** — additive top-level exports + types + `flushed()` (~2-3h pair).
2. **Phase 2a** — `packages/*/src` sweep + internal tests (~6-8h pair). Largest internal blast radius.
3. **Phase 2b** — `src/` sweep (~4-6h pair).
4. **Phase 2c** — `docs/src` + `docs/src/examples` sweep + migration guide (~6-8h pair). Largest file count.
5. **Phase 3** — class-static removal + changelog (~2-3h pair).

Total: ~20-30h (3-5d) pair across multiple sessions. Phases 2a-c land in parallel after Phase 1.

## Risk

Medium. Pervasive but mechanical — every callsite is a local find-replace, and the type system catches every miss in CI. Behavioral risk concentrated in Phase 3 (the removal) which is reviewable as a single diff.

Main failure mode is naming regret post-1.0. The rule (operations are verbs, state is a noun) is the gate against this — every name passes through it. The `comp` convention for capture and callback param is codified up front, not retrofitted. The legibility test ran on six example diffs from `docs/src/examples/reactivity/` and passed each one — every diffed line reads more clearly under the new form than under the old.

## Origin

Emerged from the [reactivity-hardening](reactivity-hardening.md) scoping conversation when DX surface decisions and correctness/perf work became visibly entangled. Split so hardening can ship without surface churn confusing the bisect.

The class-as-namespace pattern (`Signal.computed`, `Reaction.create`) reads as 2014-era Tracker convention. Modern reactive libraries (Solid, Vue 3.5, Preact, Angular, TC39 Signals) converged on lowercase top-level verbs. First-principles linguistics on the names — "reaction" as the noun for the thing, "Reaction" as the class — means the rename is consolidation around descriptive language, not abandonment of what the class-based surface earned across three years of work.
