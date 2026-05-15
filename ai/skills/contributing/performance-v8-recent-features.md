---
title: V8 Recent Shipped Features and What's NOT Shipped
description: Inventory of recently-shipped V8/Chrome JS features and their shipping milestones, plus what is commonly assumed-shipped but isn't. Covers iterator helpers (Chrome 122), Set methods (Chrome 122), `using` / `await using` explicit resource management (Chrome 134), RegExp.escape (Chrome 136), regex /v flag, non-backtracking regex engine, Promise.withResolvers (Chrome 119), AbortSignal.any (Chrome 116), AbortSignal.timeout (Chrome 103), import attributes with `with` syntax (Chrome 123), Float16Array (Chrome 135), Uint8Array base64/hex methods, resizable ArrayBuffer (Chrome 111), Array.fromAsync (Chrome 121), Error.cause. NOT shipped — Records & Tuples (withdrawn), ShadowRealm (Stage 3), Temporal (in flight), JSON.parse source-text access (in flight), source phase imports (Stage 3), Map.getOrInsert (verify), decorators (limited optimization).
keywords: [iterator helpers, Iterator.prototype, Set.intersection, Set.union, Set methods, using, await using, explicit resource management, Symbol.dispose, RegExp.escape, regex /v flag, non-backtracking regex, Promise.withResolvers, AbortSignal.any, AbortSignal.timeout, import attributes, JSON modules, Float16Array, Uint8Array base64, Uint8Array hex, resizable ArrayBuffer, Array.fromAsync, Error.cause, Records and Tuples, ShadowRealm, Temporal, decorators, Map.getOrInsert]
audience: authoring
skill: performance-v8-recent-features
type: skill
---

# V8 Recent Shipped Features and What's NOT Shipped

> **Skill:** `performance-v8-recent-features`
> **Purpose:** What's actually available in stable Chrome as of May 2026, and what's commonly assumed-shipped but isn't. TC39 proposal stage and "shipping in V8" are not the same thing.

**Golden rule: Cite the shipping milestone, not just the feature name. "Available since Chrome X" is more useful than "use feature Y."**

When in doubt, check **Chrome Platform Status** (chromestatus.com).

---

## Iterator helpers (Chrome 122, Feb 2024)

Methods on `Iterator.prototype`: `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `toArray`, `forEach`, `some`, `every`, `find`. Plus `Iterator.from(iterable)`. Stage 4 (ES2025).

✅ When the source is genuinely lazy (a generator, infinite sequence, multi-MB collection) or you're using `.take(N)` to truncate:

```js
const sum = bigArray.values().filter(x => x > 0).map(x => x * 2).reduce(add, 0);
// No intermediate array allocation
```

❌ When the pipeline is short and the source is eager:

```js
const sum = small.filter(x => x > 0).map(x => x * 2).reduce(add, 0);
// Each helper allocates a wrapper iterator. For a 50-element pipeline, that's
// more overhead than the eager Array equivalent.
```

Source: v8.dev/features/iterator-helpers.

---

## Set methods (Chrome 122, baseline since June 2024)

`intersection`, `union`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom` on `Set.prototype`.

✅ Faster than hand-rolled — engine walks the smaller set and probes the larger one, no array allocation, no Set spread:

```js
const isect = a.intersection(b);
```

❌ Slower hand-rolled:

```js
const isect = new Set([...a].filter(x => b.has(x)));
```

⚠ The methods accept any *set-like* (object with `size`, `has`, `keys`) on the right side, but require an actual `Set` instance on the left.

---

## Explicit Resource Management — `using` and `await using` (Chrome 134, May 2025)

```js
{
  using subscription = effect(() => { /* … */ });
  // subscription[Symbol.dispose]() called automatically at scope exit
}
```

Plus `await using` for async disposal, `DisposableStack`, `AsyncDisposableStack`, `SuppressedError`.

⚠ Top-level `using` is **not** allowed; must be inside a block, function body, or for-loop.

✅ Make framework primitives (effects, subscriptions, computeds) return objects with `[Symbol.dispose]` set. Users then get deterministic cleanup.

Cost: one extra check at scope exit per `using` declaration — negligible.

Source: v8.dev/features/explicit-resource-management, May 2025.

---

## Promise.withResolvers (Chrome 119, Oct 2023)

```js
const { promise, resolve, reject } = Promise.withResolvers();
```

✅ Replaces the deferred pattern. Same cost as the constructor pattern.

---

## AbortSignal.any (Chrome 116, Aug 2023) and AbortSignal.timeout (Chrome 103, July 2022)

✅ Composite cancellation:

```js
const signal = AbortSignal.any([
  userAbortSignal,
  AbortSignal.timeout(5000),
]);
```

---

## RegExp.escape (Chrome 136, April 2025)

```js
const re = new RegExp(RegExp.escape(userInput), 'g');
```

TC39 Stage 4 Feb 2025. Replaces home-rolled `escapeRegex` helpers.

---

## RegExp /v flag (Chrome 112, early 2023)

Unicode set operations in character classes: `/[\p{Decimal_Number}--[0-9]]/v` matches non-ASCII digits.

✅ Use for correctness.
⚠ Negligible perf impact vs `/u`. Not a perf optimization.

---

## Non-backtracking RegExp engine (Chrome 88, 2021)

V8 has an experimental NFA-based engine selectively used for patterns where backtracking would be catastrophic. Most regexes still use the backtracking engine.

✅ Nothing to opt into. V8 chooses.
❌ Catastrophic backtracking is still a risk for hand-written patterns with nested quantifiers like `(a+)+`.

Source: v8.dev/blog/non-backtracking-regexp (Jan 2021).

---

## Float16Array (Chrome 135, March 2025)

Half-precision (16-bit) float typed array. Reads convert to Number; writes round to fp16. TC39 Stage 4 Feb 2025.

⚠ No hardware vectorization yet in V8 — values are software-converted via the fp16.h library inside V8.

✅ Useful for transferring data to GPU, or storing perceptual values where 16 bits suffice.

---

## Uint8Array base64 / hex methods

`Uint8Array.fromBase64`, `Uint8Array.fromHex`, `.toBase64()`, `.toHex()`. TC39 Stage 4 Feb 2025.

⚠ **Verify Chrome shipping milestone before depending on it** — the spec is finalized but the Chrome milestone has been moving. SIMD-accelerated implementations exist (the spec references simdutf).

---

## Import attributes — `with` syntax (Chrome 123, March 2024)

```js
import data from './x.json' with { type: 'json' };
```

✅ Syntax renamed from `assert` to `with`. No runtime perf implication; it's a module-loader concern.

---

## JSON modules (Chrome 123, March 2024)

`import x from './x.json' with { type: 'json' }`. Native JSON imports without a runtime fetch. Lazy parsed by V8.

---

## Resizable ArrayBuffer (Chrome 111, March 2023)

```js
const buf = new ArrayBuffer(initialBytes, { maxByteLength: maxBytes });
buf.resize(newBytes);  // in place
```

✅ Useful for off-main-thread signal graphs over SharedArrayBuffer + Atomics, or any TypedArray-backed store that needs to grow without copy.

---

## Atomics, SharedArrayBuffer

Available where the page is `crossOriginIsolated`. `Atomics.waitAsync` (Chrome 87+) is the non-blocking version of `Atomics.wait`.

✅ Use for cross-worker propagation. Not relevant to single-thread benchmark code.

---

## JSON.stringify Dragonbox rewrite (Chrome 138, August 2025)

Over 2× faster on the fast path. Also accelerates every other number-to-string conversion. See `performance-v8-strings` for the fast-path conditions.

---

## Object.groupBy / Map.groupBy (Chrome 117, Sept 2023)

✅ Useful for clarity. Performance roughly equivalent to hand-rolled `Map.set` loops.

---

## Array.fromAsync (Chrome 121, Jan 2024)

✅ Async counterpart to `Array.from`. Useful for collecting from `ReadableStream` or any async iterable.
⚠ Allocates the full array; not a streaming primitive.

---

## Error.cause (Chrome 93)

```js
new Error('failed', { cause: originalErr });
```

✅ Cheap to set. Useful for error chaining; debugger and stack-trace printers show the chain.

---

## Error.stackTraceLimit = 0

✅ Skips stack capture for errors thrown and immediately caught. Measurable impact for hot throw-catch patterns.
⚠ Set locally and reset; don't change globally. Hot throw-catch is itself usually an anti-pattern.

---

## NOT shipped in V8 as of May 2026

These are commonly assumed-shipped but are not. Don't recommend them as available features.

### Records and Tuples — withdrawn

❌ The `Record & Tuple` proposal was **withdrawn from TC39 in 2024** in favor of further design exploration. Don't plan around them. The `===`-on-immutable-structures behavior they would have enabled does not exist in JS.

### ShadowRealm — Stage 3, not shipped

❌ V8 implementation has not landed in stable Chrome. Don't depend on it.

### Decorators — Stage 3, partial support

⚠ V8 parses the syntax but engine-level optimization for decorated classes is limited; the decorator runtime indirection prevents Maglev from inlining the accessor pair when class auto-accessors are used.

❌ Avoid decorators on framework hot paths.
✅ Decorators on declarative-only surfaces (custom-element registration) are fine.

### Temporal — landed in Firefox, V8 in progress

⚠ Stage 4 reached March 2026 per the TC39 cut, slated for ES2027. Firefox shipped. **Chrome implementation is in progress at time of writing (May 2026); verify Chrome Platform Status before recommending.**

✅ Use a polyfill (`@js-temporal/polyfill` or `temporal-polyfill`) if you need it now.

### JSON.parse source-text access — in flight

⚠ Richard Gibson's proposal adds a context object to the JSON.parse reviver exposing the raw source text per value. Useful for BigInt round-trip preservation. V8 implementation in flight. **Verify Chrome Platform Status before depending on it.**

### Source phase imports — Stage 3

❌ `import source x from './x.wasm'` allows importing a WebAssembly module's compiled form without instantiating it. Not yet shipped in stable Chrome as of May 2026. Verify before depending on it.

### Map.prototype.getOrInsert / getOrInsertComputed — Stage 4 March 2026

⚠ Replaces the `if (!m.has(k)) m.set(k, v); return m.get(k);` pattern. Stage 4 March 2026; **shipping in V8 uncertain as of May 2026**. Verify Chrome Platform Status.

---

## Quick Reference: shipping milestones

| Feature | Chrome | Notes |
|---------|--------|-------|
| AbortSignal.timeout | 103 | July 2022 |
| AbortSignal.any | 116 | Aug 2023 |
| Object.groupBy / Map.groupBy | 117 | Sept 2023 |
| Promise.withResolvers | 119 | Oct 2023 |
| Array.fromAsync | 121 | Jan 2024 |
| Iterator helpers | 122 | Feb 2024 |
| Set methods | 122 | Feb 2024, baseline June 2024 |
| Import attributes (`with`) | 123 | March 2024 |
| JSON modules | 123 | March 2024 |
| Mutable heap numbers | 133 | Feb 2025 |
| `using` / `await using` | 134 | May 2025 |
| Float16Array | 135 | March 2025 |
| RegExp.escape | 136 | April 2025 |
| Explicit compile hints | 136 | April 2025 |
| JSON.stringify Dragonbox (2× faster) | 138 | Aug 2025 |
| Resizable ArrayBuffer | 111 | March 2023 |
| Atomics.waitAsync | 87 | 2020 |
| `Symbol.dispose` / `using` | 134 | May 2025 |

---

## Primary sources

- v8.dev/features/iterator-helpers
- v8.dev/features/explicit-resource-management — May 2025
- v8.dev/blog/json-stringify — Aug 2025
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
- TC39 proposal repos for shipping status
- Chrome Platform Status (chromestatus.com) for ship dates

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the broader perf model. |
| **Uncertain Topics** | `use_skill('performance-v8-uncertain-topics')` | About to claim a feature is shipped when its V8 milestone is in flight. |
| **Memory** | `use_skill('performance-v8-memory')` | For `using`/`await using` in context of deterministic cleanup. |
| **Strings** | `use_skill('performance-v8-strings')` | For JSON.stringify fast-path conditions and regex changes. |
