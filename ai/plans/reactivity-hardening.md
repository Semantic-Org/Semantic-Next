# Reactivity Hardening

## Goal

Close the Reaction / Scheduler / Dependency hygiene gaps surfaced by the council fresh-take review of the reactivity package. Items 1-4 and Item 7 have shipped. Item 1 expanded beyond its original scope when the interleave-to-stable contract emerged during the work and was corrected toward in real time. Items 5, 6, 8 ship in this PR. Item 9 is gated on Item 7 bench data.

Complementary to [Signal Performance](active/signal-performance.md) which owns the `safety` preset and freeze work in PR #150. The API rename — lowercase free-function surface, dropping Reaction static forwards, DX verb decisions — is a separate initiative scoped post-hardening as a multi-PR sweep across packages, src, docs, and examples.

## Status

| # | Item | Status |
|---|---|---|
| 1 | afterFlush stranding + interleave-to-stable contract + per-pass snapshot | **shipped** (c58d4706d, d29cca246, 1b78ed56e) |
| 2 | `stop()` terminal + `invalidate()` guard on stopped | **shipped** (69c84361e) |
| 3 | `firstRun` in finally on throw (covers `run` and `guard`) | **shipped** (f06001dab) |
| 4 | `Dependency.cleanUp` + `unsubscribe` → `remove` | **shipped** (fa165d94f) |
| 5 | Scheduler set-swap | remaining |
| 6 | `boundRun` removal + shared `mergeContext` helper | remaining |
| 7 | Benchmark additions (5 new benches) | **shipped** via [PR #203](https://github.com/Semantic-Org/Semantic-Next/pull/203) |
| 8 | Lazy refcounted computed (unify `derive`/`computed`) | remaining |
| 9 | Mark-and-sweep dep tracking | gated on Item 7 data |

## Design / Implementation

Tests are the durable contract for each item. Code blocks are illustrative — one valid implementation. The implementation may deviate from the sketch during the work, as it did for Items 1 and 3.

### Item 1: `afterFlush` contract — shipped

**Contract.** `afterFlush(cb)` observes the post-cascade settled world. The flush loop interleaves reaction drains and one-batch-at-a-time afterFlush drains until both queues are empty in the same iteration. Callbacks registered during a batch run in the next batch — with any reactions they queued flushed first. The plan originally specified only the stranding fix; the interleave-to-stable contract emerged from implementation work and is now load-bearing for any downstream code that depends on "after flush" meaning "after the world has settled."

**Tests (durable):**
- `internals.test.js:245` — drains reactions queued by an afterFlush callback before the next callback runs (**the contract test**)
- `internals.test.js:213` — drains afterFlush callbacks registered during afterFlush in the same flush
- `internals.test.js:227` — schedules a flush when afterFlush registers with no pending work
- `internals.test.js:197` — handles afterFlush registered from inside a reaction body

**Follow-up.** The cycle cap (`maxFlushIterations = 100`) now spans both queues with a unified iteration counter. Add a test for reaction↔afterFlush ping-pong hitting the cap. One-test addition; lands with Item 5 or 6.

### Item 2: `stop()` terminal — shipped

**Contract.** `stop()` is terminal. A stopped reaction is removed from `pendingReactions`, has its dependency edges severed, fires cleanups, and cannot be resurrected by `invalidate()` or by a signal change racing in.

**Tests (durable):**
- `reaction.test.js:600` — `invalidate` on a stopped reaction is a no-op
- `reaction.test.js:616` — `stop` removes from `pendingReactions` mid-cycle
- `reaction.test.js:504` + `internals.test.js:404` — `stop` is idempotent
- `internals.test.js:415` — stopped reaction never re-runs on dependency change

### Item 3: throw-safety in `run` and `guard` — shipped

**Contract.** A reaction that throws is left invalidated; `firstRun` advances to false in `finally`; re-invalidation tracks fresh deps from a known baseline. `Reaction.guard` whose `f()` throws on first run propagates value changes on later successful runs.

**Tests (durable):**
- `internals.test.js:299` — `firstRun` advances on throw, fresh deps on re-invalidation
- `internals.test.js:531` — guard propagates value changes after first-run throw

**Unification realized during work.** The plan originally listed two separate fixes for Problems A (`run`) and B (`guard`). The implementation found one change covers both because `Reaction.guard`'s inner `comp.run()` flows through the same try/finally. Single source of truth, two test surfaces, one fix.

### Item 4: `Dependency.remove` — shipped

**Behavior.** No external change. `Dependency.cleanUp` and `Dependency.unsubscribe` merged into `Dependency.remove(reaction)`. All call sites updated. Pure cleanup.

### Item 5: Scheduler set-swap — remaining

**Problem.** `const reactions = [...Scheduler.pendingReactions]` allocates a fresh array on every flush iteration. With per-expression granularity, a single app-signal change can invalidate hundreds of reactions, so the allocation scales with fan-out.

**Direction.** Set-swap. Preserves coalescing semantics — new invalidations land in the next pass.

**Contract.** All existing reaction-flush tests continue passing. `flush-fanout-allocation-1000x500` bench shows measurable allocation drop and wall-clock improvement. Existing `reactive-fanout-500x1200` should also improve as a side effect.

Illustrative implementation:

```js
const toRun = Scheduler.pendingReactions;
Scheduler.pendingReactions = new Set();
for (const r of toRun) {
  if (r.stopped) continue;
  try { r.run(); } catch (e) { if (!firstError) firstError = e; }
}
```

The cycle counter accounting that spans both queues must be preserved — the swap doesn't get to skip the iteration increment.

### Item 6: `boundRun` removal + shared `mergeContext` helper — remaining

**Problem A.** `this.boundRun = this.run.bind(this)` allocates one bound function per Reaction. Only consumer is `Reaction.create` for the initial run. Scheduler stores reaction objects and calls `.run()` directly. Pure churn in a per-expression model.

**Problem B.** Three near-identical `setContext` / `addContext` blocks across `Signal`, `Reaction`, and `Dependency`. All gate on `config.mode !== 'off'`, all do object spreads.

**Direction.** Drop `boundRun`; `Reaction.create` calls `reaction.run()` directly. Extract `mergeContext(target, additional, defaults)` helper to `helpers.js`; each class passes its own seed values (`{ value }` for Signal, `{ firstRun }` for Reaction, raw bag for Dependency).

**Contract.** No behavioral change. All existing tracing-mode tests continue passing. `sub-unsub-100k` measures this directly — expected: small but measurable improvement. (Currently runs at 22ms on CI — near the noise floor; if the win is small the bench may need amplification to clear σ.)

**Coordination note.** Item 6 conflicts with PR #150's `helpers.js` changes (`config` object centralization, `signalTag`). Rebase order is determined by which branch ships first. Surface is small enough to make the rebase mechanical either way.

### Item 7: Benchmark additions — shipped via PR #203

Five new tachometer measurements added to `bench-signal.js` and both measurement arrays in `tachometer-ci-signal.json`. Iteration counts grounded in actual CI durations of existing benches; target window 60-150ms.

Stable-dependency churn (gates Item 9):
- `reactive-stable-fanout-5000x100` — 5000 reactions × 1 signal × 100 invalidations
- `reactive-stable-deps-3reads-5000x100` — 5000 reactions × 3 signals × 100 cycles (median templating shape)

Computed lifecycle (informs Item 8):
- `computed-unobserved-200x500` — 200 computed signals derived from a root, no observer, root updated 500 times
- `computed-subscribe-unsubscribe-10k` — create + attach + detach × 10k cycles

Scheduler allocation (verifies Item 5):
- `flush-fanout-allocation-1000x500` — 1000 flush cycles × 500-subscriber fanout

**Dropped from original list:** `reaction-stable-deps-10kx1k` (companion redundant with the wide-fan + median-shape pair) and `reaction-create-stop-200kx10` (overlaps existing `sub-unsub-100k`).

Signal-read benches (`signal-read-object-tracked-1m`, `signal-read-array-tracked-500x10k`, `signal-write-large-array-1000x10k`) belong to [signal-performance](active/signal-performance.md), not here.

### Item 8: Unify `derive`/`computed` with lazy reference counting — remaining

**Problem.** The WeakRef in `Signal.derive` guards the wrong side of the retention chain. Strong path is `source → dep.subscribers → reaction → closure → derivedSignal`. WeakRef on the source protects a leak that can't happen (source GC implies no subscribers fire) while doing nothing about the leak that does happen (derived discarded while source lives). `Signal.computed` has the same pattern without the WeakRef. Neither `_derivedReaction` nor `_computedReaction` is consumed outside the constructor that sets it.

**Direction.** Collapse both primitives into a single `Signal.computed(fn, { parent = Reaction.current } = {})`. Computed signals subscribe to upstream only when they have ≥1 downstream subscriber. When the last subscriber detaches, the internal reaction stops, severing the strong root from the source. Matches Vue 3, MobX, Solid. Eliminates the leak entirely without WeakRef gymnastics. `derive` becomes a thin compatibility wrapper. Remove `_derivedReaction` / `_computedReaction` private fields and the `sourceRef.deref()` check in the reaction body. Parent-reaction scoping via `onCleanup` is retained for renderer-tree usage.

**Semantic note (audit-cleared 2026-05-13).** Top-level `Signal.computed(fn)` historically re-ran on every source change regardless of observers. Post-change, unobserved computeds are dormant — the first observer triggers subscription and the first read, additional observers share the cached value, last-observer detach severs upstream and stops the internal reaction. Call-site audit across `packages/`, `src/`, and `docs/src` found zero framework-internal consumers and three example consumers, all wrapped in `Reaction.create`. Every existing consumer observes; the behavior change is invisible to current code.

**Contract.**

Tests (durable, to be written with the implementation):
- Computed with no subscriber does not eagerly compute when source changes
- Computed gains/loses subscribers correctly across mount/unmount cycles
- Bare `Signal.computed(fn)` followed by abandonment leaves `source.dependency.subscribers.size === 0`
- Parent-scoped computed still cleans up on parent stop

Acceptance criteria (vs Item 7's baselines on main):
- `computed-unobserved-200x500` improves dramatically — near-zero work for the unobserved case
- `computed-subscribe-unsubscribe-10k` shows acceptable reference-counting overhead
- Existing `computed-chain-10x60k` stays flat or improves (subscribers exist throughout the run)

### Item 9: Dependency-tracking rewrite — gated

**Hypothesis.** Every `Reaction.run()` tears down all prior dependencies (`dep.remove(this)` on each, `dependencies.clear()`) and re-acquires them as the callback executes. In the per-expression model where most expressions read the same 1-3 signals every run, the stable-dependency case dominates and the churn is pure waste.

**Counter.** `Set.delete` + `Set.add` on small sets is fast and allocation-free on modern V8. The existing `reaction-dep-diff-45k` benchmark measures the changing-dependency case; nothing measures stable-deps churn today. The hypothesis may not survive measurement.

**Gating:** Item 7's stable-dep benchmarks must show meaningful headroom before this PR lands. Specific thresholds:
- `reactive-stable-fanout-5000x100` shows ≥2× headroom attributable to Set churn
- `reactive-stable-deps-3reads-5000x100` confirms in the median shape

**Direction if proceeding — versioned mark-and-sweep edges:**
- Each reaction has an iteration counter, incremented per run
- Each dependency edge stores `lastSeen` (the iteration where it was touched)
- During tracking, signal reads update `lastSeen` to the current iteration
- After the callback, sweep edges where `lastSeen !== current` and remove them

Side benefit: natural transactional error recovery. If the callback throws, the partial sweep is skipped and dependencies remain intact for the next run.

**Acceptance criteria:**
- `reactive-stable-fanout-5000x100` improves ≥2×
- `reactive-stable-deps-3reads-5000x100` improves ≥1.5×
- `reaction-dep-diff-45k` flat or better (changing-set case must not regress)
- `sub-unsub-100k` flat (creation/teardown path unchanged)

If improvements don't materialize, abandon and document the measurement so this isn't relitigated.

## Open Questions

- **Item 9 viability.** Gated on Item 7 benchmark data. Honest possibility of abandonment.

## Deferred to other plans

- **API rename / lowercase free-function surface** (`signal`, `reaction`, `computed`, `nonreactive`, `guard`, `afterFlush`). Massive scope (~week of practical work) covering the reactivity package, renderer, components, src, docs, and examples. Separate initiative; lands post-hardening as a multi-PR sweep.
- **`flushed()` Promise companion** to `afterFlush`. DX wrapper for the 10% genuinely-async caller case. Belongs to the rename initiative — adding new top-level surface is the rename's domain, not hardening's.
- **Drop Reaction's static forwards** (`flush`, `scheduleFlush`, `afterFlush`, `getSource`). Tied to the rename's free-function surface.
- **TrackingContext extraction** — separating `Scheduler.current` and the save/restore dance from both Reaction and Scheduler. Conceptually clean, deferred to surface settling.
- **Read-side cloning rework and `safety` preset system** — owned by [Signal Performance](active/signal-performance.md) and PR #150.

## Dependencies

- [Signal Performance](active/signal-performance.md) — file overlap is small. Item 8 touches `signal.js` (computed/derive paths) which #150 also rewrites. Item 6 touches `helpers.js` which #150 reorganizes around `config`. Item 5 touches `scheduler.js` which #150 doesn't reshape. Rebase friction is manageable; ordering determined by which branch ships first.

**Downstream:** None hard. Items 5-9 are independent of other roadmap work.

## Sessions (estimated)

1. **Items 5, 6, 8 bundled PR** (~4-5h pair) — set-swap, boundRun + mergeContext, lazy refcounted computed. Includes the four Item 8 tests and the cycle-cap test follow-up from Item 1. Bench data cited against Item 7's baselines (now on main via PR #203).
2. **Item 9 evaluation** (~4-8h pair, conditional) — read this PR's stable-dep numbers against main's Item-7 baselines. Either rewrite via versioned mark-and-sweep or document abandonment with the measurement attached.

Total: ~4-5h baseline; up to ~13h if Item 9 proceeds.

## Origin

Originated from a five-frontier-model council fresh-take review of the reactivity package (gpt-5.5, deepseek-v4-pro, gemini-3.1-pro, claude-opus-4.7, grok-4.3). Source artifact at `ai/workspace/fresh-takes/reactivity-fresh-take.md`; synthesis at `ai/workspace/fresh-takes/pr-sequence.md`. Items 1 and 3 expanded beyond their original specs during implementation through real-time correction — the plan now documents the realized contracts rather than the anticipated ones.
