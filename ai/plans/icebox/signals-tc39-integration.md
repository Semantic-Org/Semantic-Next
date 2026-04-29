# Signals TC39 Integration

## Goal

When the TC39 Signals proposal ships in engines, adopt native `Signal.State` and `Signal.Computed` as the backing primitives while preserving SUI's opinion layer (`safety` presets, mutation helpers, scheduler). This is a performance and alignment play — SUI's API surface doesn't change, but the reactive graph traversal moves to engine speed.

## Context

The TC39 Signals proposal (Stage 1 as of early 2025) defines:
- `Signal.State` — writable signal, reference semantics, optional `equals` function
- `Signal.Computed` — lazy/pull-based derived signal, glitch-free topological evaluation
- `Signal.subtle.Watcher` — low-level subscription primitive for framework schedulers

The proposal is deliberately minimal — no equality by default, no value protection, no batching, no helpers. SUI's `safety: 'reference'` preset has identical semantics to `Signal.State`.

## Design

### Layer 1: `Signal.State` as backing store

SUI's `Signal` class uses `Signal.State` internally instead of `this.currentValue` + `this.dependency`:

```
SUI Signal (safety: 'reference')  →  thin wrapper over Signal.State
SUI Signal (safety: 'freeze')     →  Signal.State + deepFreeze on write
SUI Signal (safety: 'clone')      →  Signal.State + clone on read/write
SUI Signal (safety: 'none')       →  Signal.State with equals: () => false
```

The `reference` preset becomes a near-zero-cost passthrough — the native primitive does the work. Freeze/clone add their protection layer on top. The `safety` API design was built with this transition in mind.

### Layer 2: Lazy vs eager computed

TC39's `Signal.Computed` is lazy — only recomputes when read. SUI's current `Signal.computed()` is eager — recomputes immediately via `Reaction`. Both models have valid use cases:

- **Eager** — settings-derived computations. Always observed (template reads every render), change infrequently. Must be ready immediately. The cost of a lazy cache miss on a hot render path outweighs the cost of an eager recompute on an infrequent settings change.
- **Lazy** — state-derived computations. May not be observed in every render branch (conditional templates, hidden panels). Don't compute until someone reads.

SUI already distinguishes settings from state at the component model level. The framework could choose automatically:
- `Signal.computed()` → native `Signal.Computed` (lazy, engine-speed)
- Settings-derived computations → remain eager via `Reaction`
- Or: expose both and let the template compiler choose based on observation patterns

### Layer 3: `Signal.subtle.Watcher` replaces `Dependency`

SUI's `Dependency` class is a manual subscribe/notify primitive. `Signal.subtle.Watcher` serves the same role but integrated with the native reactive graph. Migration:

- `Dependency.depend()` → tracked reads on a native `Signal.State`
- `Dependency.changed()` → writes to a native `Signal.State`
- `Scheduler` wires into `Watcher` for notification → microtask flush

The scheduler itself stays — TC39 deliberately doesn't ship one. But the plumbing from signal change → scheduler notification uses native `Watcher` instead of manual subscriber sets.

### Layer 4: Mutation helpers, ID operations, `Reaction.guard`

These are pure SUI value-add. Nothing in TC39 addresses them. They stay as-is, wrapping the native primitives. This is SUI's contribution: the opinion layer that the proposal deliberately left out.

### Migration path

1. Feature-detect `Signal.State` availability
2. Swap internal backing store (behind the same public API)
3. Run full test suite — observable behavior is identical
4. Benchmark to confirm native primitives are actually faster (they should be, but verify)
5. Optionally expose `Signal.lazy()` or `Signal.computed({ lazy: true })` for the native computed path

No public API changes. No breaking changes. Users don't know the engine switched.

## Open Questions

- **Timing** — TC39 Signals has been Stage 1 since April 2024 with no advancement in two years. Zero browser implementation activity — no V8, SpiderMonkey, or JSC tracking bugs, intents, or prototypes. Champions' own strategy requires extensive framework integration before seeking Stage 2. Realistic timeline: Stage 3 around 2028-2029, Baseline Widely Available 2032-2033. This plan exists to ensure current design decisions don't fight the future direction. No implementation work until Stage 3+.
- **Polyfill strategy** — signal-polyfill exists. Worth adopting early for the topological sort / glitch-free guarantee? Or wait for native? The polyfill adds bundle size that SUI's current push-based system doesn't need.
- **Lazy computed API** — `Signal.computed()` vs `Signal.lazy()` vs `Signal.computed(fn, { lazy: true })`. Naming TBD when the feature is concrete.
- **`Reaction` survival** — Does `Reaction.create()` (autorun/effect pattern) still exist alongside native computed? Probably yes — it's the imperative escape hatch that computed can't replace (side effects, DOM writes, cleanup logic).

## Dependencies

- [Signal Performance](../signal-performance.md) — the `safety` preset system must ship first. It's the API surface that makes this transition clean.
- TC39 Signals reaching Stage 3+ with stable API

## Status

Deferred. Design direction captured. No implementation until TC39 progresses. Current `safety` API is designed to be forward-compatible with this plan.
