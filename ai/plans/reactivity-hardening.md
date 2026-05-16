# Reactivity Hardening

## Goal

Close the Reaction / Scheduler / Dependency hygiene gaps surfaced by the council fresh-take review of the reactivity package. Most items are local correctness or allocation fixes converged on by all five frontier models. A few are deferred architectural decisions (lazy refcounted computed, dep-tracking rewrite) that need their own measurement or design pass.

Complementary to [Signal Performance](signal-performance.md) — that plan owns the Signal-side preset and freeze work. This plan owns everything else in the reactivity package.

## Design / Implementation

### Item 1: `Scheduler.afterFlush` stranding

**Problem:** `Scheduler.afterFlush(cb)` pushes onto `afterFlushCallbacks` without scheduling a flush. If the callback registers outside an active flush window — and no reactive invalidation follows — the callback strands indefinitely. The conventional contract is "after the current or next flush," not "only if some unrelated future invalidation happens."

**Solution:** Schedule a flush in `afterFlush` itself, gated on whether one is already pending:

```js
static afterFlush(callback) {
  Scheduler.afterFlushCallbacks.push(callback);
  if (!Scheduler.isFlushScheduled) {
    Scheduler.scheduleFlush();
  }
}
```

Tests:
- `afterFlush` registered with no pending work fires on the next microtask
- `afterFlush` registered inside another `afterFlush` runs in the same drain
- `afterFlush` registered inside a reaction callback runs after that flush
- Existing afterFlush behavior under active flush unchanged

### Item 2: `stop()` / `invalidate()` resurrection

**Problem:** `stop()` sets `active = false` but `invalidate()` unconditionally sets `active = true`. If a signal fires after stop and the reaction is still in any `dep.subscribers` set, `changed()` calls `invalidate()` which silently re-arms the reaction. A test pins this revival behavior, but no real consumer relies on it — the test was speculative source-archaeology, not user-grounded.

**Solution:** Introduce an explicit `stopped` flag separate from `active`. Stop becomes terminal:

```js
constructor(...) {
  this.stopped = false;
  this.active = true;
  // ...
}

stop() {
  if (this.stopped) return;
  this.stopped = true;
  this.active = false;
  Scheduler.pendingReactions.delete(this);
  for (const dep of this.dependencies) dep.remove(this);
  this.dependencies.clear();
  this.fireCleanups();
}

invalidate(context) {
  if (this.stopped) return;
  this.active = true;
  if (context) this.addContext(context);
  Scheduler.scheduleReaction(this);
}
```

Tests:
- Stopped reaction is removed from `pendingReactions`
- `invalidate()` on a stopped reaction is a no-op (no resurrection)
- Calling `stop()` twice is harmless
- Replace the existing revival test with one asserting `invalidate` on stopped does nothing

### Item 3: Throw-safety in `run()` and `guard`

**Problem A:** If a reaction's callback throws, `firstRun` is never set to false and `dependencies` is already cleared. On next invalidation the reaction re-runs with `firstRun: true` and an empty dep set, but `fireCleanups()` already ran against state the callback didn't establish.

**Problem B:** `Reaction.guard`'s inner `comp.firstRun` only flips false after the callback completes successfully. If `f()` throws on the first run, `firstRun` stays true, and the next successful run skips the equality check — meaning guard's downstream invalidation never fires for the first recovered value.

**Solution:** Move `firstRun = false` into `finally` in both places. Document the contract: "A reaction that throws is left invalidated; it re-tracks from scratch on next schedule."

```js
run() {
  if (!this.active) return;
  // ... existing tracing/cleanup ...
  try {
    // ... existing body ...
  } finally {
    this.firstRun = false;
    Scheduler.current = previousReaction;
  }
}
```

Tests:
- A reaction that throws on first run, then succeeds on next invalidation, tracks fresh dependencies
- `Reaction.guard` whose `f()` throws on first run propagates value changes on later successful runs

### Item 4: `Dependency.cleanUp` / `unsubscribe` merge

**Problem:** Two methods with identical bodies (`this.subscribers.delete(reaction)`) called from different sites in `Reaction.run` and `Reaction.stop`. The faux-distinction adds a term to the lifecycle without behavioral difference. Pure cleanup.

**Solution:** Collapse to `Dependency.remove(reaction)`. Update call sites in `reaction.js`.

### Item 5: Scheduler set-swap

**Problem:** `const reactions = [...Scheduler.pendingReactions]` materializes a fresh array on every flush iteration. With per-expression granularity a single signal change can invalidate hundreds of expression-reactions, so the allocation scales with fan-out.

**Solution:** Set-swap. Preserves coalescing semantics — new invalidations land in the next pass.

```js
const toRun = Scheduler.pendingReactions;
Scheduler.pendingReactions = new Set();
for (const r of toRun) {
  if (r.stopped) continue;
  try { r.run(); } catch (e) { if (!firstError) firstError = e; }
}
```

Benchmark precursor: `flush-fanout-allocation-1000x500` — 1000 flush cycles, 500 invalidations each. Captures the fan-out shape. Expected: measurable improvement, allocation count drops sharply.

### Item 6: `boundRun` removal + shared `setContext` helper

**Problem A:** `this.boundRun = this.run.bind(this)` in the Reaction constructor allocates one bound function per Reaction. The only caller is `Reaction.create` for the first run; the scheduler stores reaction objects and calls `.run()` directly. Pure churn in a per-expression model.

**Problem B:** Three near-identical `setContext` / `addContext` blocks across `Signal`, `Reaction`, and `Dependency`. All gated on `isTracing()`, all do object spreads. A small shared helper in `helpers.js` collapses these.

**Solution:**
- Drop `boundRun`. `Reaction.create` calls `reaction.run()` directly.
- Extract shared `mergeContext(target, additional, defaults)` helper. Each class passes its own seed values (`{ value }` for Signal, `{ firstRun }` for Reaction, raw bag for Dependency).

Benchmark: existing `sub-unsub-100k` measures this directly. Expected: small but measurable improvement. (Currently runs at 22ms on CI — near the noise floor; if the win is small the bench may need amplification to clear σ.)

### Item 7: Benchmark additions

These workloads aren't gating Items 1-6 (those land on correctness merits), but they baseline the perf claims and gate the larger Item 9 rewrite. Each follows the existing pattern in `bench-signal.js` — `performance.mark` + `performance.measure`, sink-anchored, iteration counts grounded in actual CI durations of existing benches to clear the σ-floor with headroom.

Ships as a precursor PR to main so the `tip-of-tree` side of tachometer-CI emits the same measurements as `this-change` when the hardening PR runs.

Stable-dependency churn (gates Item 9):
- `reactive-stable-fanout-5000x100` — 5000 reactions each reading the same single signal, 100 invalidations
- `reactive-stable-deps-3reads-5000x100` — 5000 reactions × 3 signals × 100 cycles (median templating shape)

Computed lifecycle (informs Item 8):
- `computed-unobserved-200x500` — 200 computed signals derived from a root, no external subscriber, root updated 500 times
- `computed-subscribe-unsubscribe-10k` — create computed, attach subscriber, detach, repeat 10k times

Scheduler allocation (verifies Item 5):
- `flush-fanout-allocation-1000x500` — 1000 flush cycles, 500-subscriber fanout each

**Dropped from original list:** `reaction-stable-deps-10kx1k` (companion measurement redundant with the wide-fan + median-shape pair) and `reaction-create-stop-200kx10` (overlaps existing `sub-unsub-100k`). Five new benches; Item 6 cites existing `sub-unsub-100k` directly.

### Item 8: Unify `derive` / `computed` with lazy reference counting

**Problem:** The WeakRef in `Signal.derive` guards the wrong side of the retention chain. The strong path is `source → dep.subscribers → reaction → closure → derivedSignal`. A WeakRef on the source protects against a leak that can't happen (source GC implies no subscribers fire) while doing nothing about the leak that does happen (derived discarded while source lives).

`Signal.computed` has the same pattern without the WeakRef. Neither `_derivedReaction` nor `_computedReaction` is consumed anywhere outside the constructor that sets it.

**Solution:** Collapse both primitives into a single `Signal.computed(fn, { parent = Reaction.current } = {})`. Computed signals subscribe to upstream only when they have ≥1 downstream subscriber. When the last subscriber detaches, the internal reaction stops, severing the strong root from the source. Matches Vue 3, MobX, Solid. Eliminates the leak entirely without WeakRef gymnastics. `derive` becomes a thin compatibility wrapper.

Remove `_derivedReaction` / `_computedReaction` private fields, the `new WeakRef(this)` machinery, and the `sourceRef.deref()` check in the reaction body. Parent-reaction scoping via `onCleanup` is retained for renderer-tree usage.

**Semantic note (audit-cleared):** Top-level `Signal.computed(fn)` historically re-ran on every source change regardless of whether anyone observed the result. Post-change, an unobserved computed is dormant — the first observer triggers subscription and the first read, additional observers share the cached value, last-observer detach severs upstream and stops the internal reaction. A call-site audit of `Signal.computed` and `.derive` across `packages/`, `src/`, and `docs/src` found zero framework-internal consumers and three example consumers, all wrapped in `Reaction.create`. Every existing consumer observes, so the behavior change is invisible to current code. Future bare-`Signal.computed` use outside a reaction sees the new lazy behavior, which matches the conventions established by every other modern signals library.

Tests:
- Computed with no subscriber does not eagerly compute when source changes
- Computed gains/loses subscribers correctly across mount/unmount cycles
- Bare `Signal.computed(fn)` followed by abandonment leaves `source.dependency.subscribers.size === 0`
- Parent-scoped computed still cleans up on parent stop
- Existing `computed-chain-10x60k` benchmark stays flat or improves (subscribers exist throughout the run)

Acceptance criteria (vs Item 7's baselines):
- `computed-unobserved-200x500` improves dramatically — near-zero work for the unobserved case
- `computed-subscribe-unsubscribe-10k` shows acceptable reference-counting overhead

### Item 9: Dependency-tracking rewrite (gated)

**Problem (hypothesized):** Every `Reaction.run()` tears down all prior dependencies (`dep.cleanUp(this)` on each, `dependencies.clear()`) and re-acquires them from scratch as the callback executes. In the per-expression model where most expressions read the same 1–3 signals every run, the stable-dependency case dominates and the churn is pure waste.

**Counter:** `Set.delete` + `Set.add` on small sets is fast and allocation-free on modern V8. The existing `reaction-dep-diff-45k` benchmark measures the changing-dependency case; nothing measures stable-deps churn today. The hypothesis may not survive measurement.

**Gating:** Item 7's stable-dep benchmarks must show meaningful headroom before this PR lands. Specific thresholds:
- `reactive-stable-fanout-5000x100` shows ≥2× headroom attributable to Set churn
- `reactive-stable-deps-3reads-5000x100` confirms in the median shape

**If proceeding — versioned mark-and-sweep edges:**
- Each reaction has an iteration counter, incremented per run
- Each dependency edge stores `lastSeen` (the iteration where it was touched)
- During tracking, signal reads update `lastSeen` to the current iteration
- After the callback, sweep edges where `lastSeen !== current` and remove them

Side benefit: this gives natural transactional error recovery. If the callback throws, the partial sweep is skipped and dependencies remain intact for the next run.

**Acceptance criteria:**
- `reactive-stable-fanout-5000x100` improves ≥2×
- `reactive-stable-deps-3reads-5000x100` improves ≥1.5×
- `reaction-dep-diff-45k` flat or better (changing-set case must not regress)
- `sub-unsub-100k` flat (creation/teardown path unchanged)

If improvements don't materialize, abandon and document the measurement so this isn't relitigated.

## Open Questions

- **TrackingContext extraction.** Council's strong synthesis proposed extracting a small module that owns `Scheduler.current` and the save/restore dance, so neither `Reaction` nor `Scheduler` owns the tracking slot. Conceptually clean but deferred work — schedule after Items 1-8 settle, decide whether to include in this plan or split.
- **Dep-tracking rewrite (Item 9) viability.** Gated on Item 7 benchmark data. Honest possibility of abandonment.

## Dependencies

- [Signal Performance](signal-performance.md) — file overlap (mainly `signal.js`, which Items 1-6 don't touch). Coordinate rebase order. Items 1-6 stabilize `reaction.js` and `scheduler.js` and reduce the conflict surface for Signal Performance's eventual rebase.

**Downstream:** None hard. Items 1-6 are pure hygiene improvements that don't gate other roadmap work.

## Sessions (estimated)

1. **Items 1-8 bundled PR** (~6-8h pair) — nine commits, regression tests per fix, benchmarks for Items 5/6/8 alongside the fixes, single PR mirroring the recent PR #201 reactivity-fix arc. Risk 3/10 (lazy refcounting in Item 8 is a semantic change, but the call-site audit cleared all current consumers). The PR description names the audit result explicitly.
2. **Item 9 evaluation + possible rewrite** (4-8h pair, conditional) — read benchmarks from Item 7's bench additions once the bundled PR has been live long enough to baseline. Either rewrite or document abandonment.

Total time: 6-8h baseline; up to 16h if Item 9 proceeds.

## Status

Scoped for Items 1-8. Initial for Item 9 — gated on Item 7 benchmark data with an explicit abandonment path.

Item 8's call-site audit ran on 2026-05-13 and surfaced zero framework-internal consumers plus three example consumers, all wrapped in `Reaction.create`. The semantic change to lazy refcounting is invisible to every existing consumer, so Item 8 promotes from deferred decision to in-bundle.

Originated from a five-frontier-model council fresh-take review of the reactivity package. Source artifact at `ai/workspace/fresh-takes/reactivity-fresh-take.md` and synthesis at `ai/workspace/fresh-takes/pr-sequence.md`.
