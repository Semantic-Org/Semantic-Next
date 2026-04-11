# Signal Performance

## Goal

Improve the performance characteristics of `@semantic-ui/reactivity` — specifically the clone-on-read cost that dominates signal throughput. Introduces a `safety` preset system that unifies value protection and equality checking into a single, opinionated API with escape hatches.

## Design / Implementation

### Item 1: `safety` preset system

**Problem:** The current `allowClone` boolean is a single axis that doesn't capture the full design space. Value protection (freeze/clone/none) and equality checking (isEqual/none) are two independent concerns that users think about as one concept: "how careful should this signal be?"

**Solution:** A `safety` preset that configures both axes with sensible defaults. Each preset names the signal's relationship to its value:

```
'freeze'    → { protection: 'freeze', equality: isEqual }      // we protect your data (throw on mutation)
'clone'     → { protection: 'clone',  equality: isEqual }      // we copy your data (silent protection)
'reference' → { protection: 'none',   equality: isEqual }      // we trust you with your data (just dedupe)
'none'      → { protection: 'none',   equality: () => false }  // we stay out of the way
```

- `freeze` — new default. Freeze on set, return reference on read. Mutation throws. **15-71x faster** than clone on real SUI component data (benchmarked).
- `clone` — old default. Clone on read and write. One-line migration for users who need mutable copies from `.get()`.
- `reference` — the standard signals model (Solid, Preact, TC39). No protection, user follows immutable patterns, equality still deduplicates. For developers who know what everyone else is doing and chose not to do it.
- `none` — framework internals. Raw notification channel, no overhead. Replaces `allowClone: false`.

**Override hierarchy:** `safety` preset → `Signal.defaultSafety` static → `equalityFunction`/`cloneFunction` instance options. Any combination of the 6 cells is reachable:

```js
// Global default
Signal.defaultSafety = 'freeze';

// Per-signal preset
new Signal(data, { safety: 'reference' })

// Override individual axis within a preset
new Signal(data, { safety: 'freeze', equalityFunction: () => false })  // freeze, always notify
new Signal(data, { safety: 'none', equalityFunction: isEqual })        // no protection, but dedupe
```

### Item 2: Deep freeze replaces clone-on-read

**Problem:** Every `.value` / `.get()` of an object or array deep-clones the entire value. `.get()` is the hottest path — called inside every reaction.

**Benchmarked against real SUI component data:**

| Shape | Single op | Set + 5 reads |
|---|---|---|
| Small state (1-6 keys) | 2-8x faster | 17-23x faster |
| Medium settings (nested objects) | 3-4x faster | 15-16x faster |
| Large settings (19 keys + callbacks) | 7x faster | 71x faster |
| Spec objects (45+ map entries) | 4x faster | 28x faster |
| Populated search results (20 items) | 3x faster | 21x faster |

**Integration points:**
- `Signal.set value()` — `deepFreeze(newValue)` instead of `maybeClone(newValue)` (when safety is `freeze`)
- `Signal.get value()` — return `this.currentValue` directly (no clone needed — value is frozen)
- `Signal.peek()` — return `this.currentValue` directly
- `Signal.constructor` — freeze initial value
- `Signal.mutate()` — array helpers already bypass mutate (fix #4 shipped). General `mutate()` needs to clone internally before mutating, then freeze the result.
- `get({ clone: false })` — no longer needed, deprecate or no-op
- `maybeClone` — only used when `safety: 'clone'`
- Add `deepFreeze` utility to `@semantic-ui/utils`
- Class instances — skip freezing (same `isClassInstance` gate as current clone skip)

### Item 3: Flush error boundary

**Problem:** If any reaction throws during `flush()`, remaining reactions and afterFlush callbacks are aborted.

**Solution:** Wrap each `reaction.run()` in try/catch. Log error, continue. ~3 lines in `scheduler.js`.

### Item 4: Consolidate array maybeClone WeakMaps (only if `clone` mode is used)

**Problem:** `maybeClone` for arrays creates N WeakMap allocations instead of 1.

**Solution:** Thread a shared `seen` map, or use `preserveNonCloneable` in utils `clone`. Only relevant for `safety: 'clone'` — freeze and reference modes don't touch `maybeClone`.

## Open Questions

- **`mutate()` under freeze** — The general `mutate()` API needs to internally thaw (clone) → run mutation fn → freeze result. Array helpers already notify directly (fix #4). Is the general `mutate()` used enough in userland to justify the thaw path, or should it just require returning a new value?

## Dependencies

None — all items are independent of the broader roadmap.

## Known callsites requiring `safety: 'none'`

- `createSettingsProxy` in `component-helpers.js` — Signal used for dependency tracking only, `set()` called on every proxy read
- `itemSignal` in renderer each loops — currently `allowClone: false`
- `dataVersion` — already migrated to raw `Dependency` (no longer a Signal)

## Already shipped (this branch)

| # | Fix | File |
|---|-----|------|
| 4 | Array helpers notify directly, skip O(n) clone+compare | `signal.js` |
| 5 | `notify()` and `run()` skip debug calls in prod | `signal.js`, `reaction.js` |
| 6 | null no longer enters clone path in getter | `signal.js` |
| 8 | Dev-mode warning when `mutate` returns same reference | `signal.js` |
| 10 | Flush cycle detection (100-iteration max) | `scheduler.js` |
| 11 | `setProperty` dispatches on data type, not argument count | `signal.js` |
| — | `dependency.changed()` → `signal.notify()` in renderer | `renderer.js` |
| — | `dataVersion` Signal → raw `Dependency` | `renderer.js`, `expression-evaluator.js` |

## Sessions (estimated)

1. Implement `safety` preset system + `deepFreeze` utility, migrate Signal internals, verify all 83 reactivity tests pass (~2-3h pair)
2. Flush error boundary + `mutate()` under freeze + migrate `allowClone: false` callsites to `safety: 'none'` (~1-2h pair)

## Status

Scoped. Benchmarking complete. API design finalized. 8 fixes already shipped on this branch.
