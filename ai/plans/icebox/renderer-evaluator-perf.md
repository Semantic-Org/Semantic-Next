# Renderer + Evaluator Performance

## Goal

Concrete perf optimizations across the native renderer and `ExpressionEvaluator` — eliminate per-render allocations, specialize hot-path call patterns, hoist module-level constants, fix small DOM leaks. None transformative individually; together they reduce overhead in the inner loop of list rendering and expression evaluation.

Iceboxed because the existing render path is fast enough at current scale (per the `signal-performance` lesson, microbenchmark gains often translate to single-digit percentages on real workloads). Promote when a benchmark or production workload demonstrates the win, or when adjacent work (`fine-grained-reactivity`, `signal-performance`) opens parts of the surface for clean folding.

PR #175's eager-wire shape costs +5-12% on mount benches and +18% on `hydrate-helper-100-state-change` at 1000 items vs main. That cost is the contract for correct per-item reactivity, not a bug. No individual mechanism in this plan clears a >1ms-at-1000-items savings threshold without conflicting with `fine-grained-reactivity`'s direction (which replaces `createItemDataProxy` and `itemSignal` wholesale).

## Areas

### Renderer hot path

Inner loop of list rendering — `each`-item proxy, dynamic regions, attribute binding.

- **`createItemDataProxy` `get` trap clones per access.** Obsoleted by `fine-grained-reactivity.md`'s `ReactiveDataContext`, which drops `createItemDataProxy` entirely. Revisit only if that plan doesn't ship.
- **`Signal.peek()` clones via `maybeClone`** — defeats peek's purpose. Return `currentValue` directly. Composes naturally with `signal-performance`'s freeze rewrite, which eliminates clone overhead by construction.
- **Inline attribute processing in `bindMarkers`.** Current pass collects into an `attrsToProcess` array per element before iterating. Inline the binding call to skip the intermediate array.
- **`evaluateRawTextNodes` uses object spreads in each loops** — replace with `Object.create(data)` + property assignment.

### ExpressionEvaluator (V8-targeted)

Most expressions in real templates are simple identifiers or short Lisp-style helper calls. The current evaluator pays consistent allocation and call-overhead costs that compound at 100+ expressions per render.

- **Hoist regexps and caches to module scope.** Class-static access goes through property lookup on the constructor each time; module-level consts are TurboFan-resolvable at compile time. The static fields can stay as backward-compat references to the module bindings.
- **Eliminate `token.join(' ')` allocation in recursive evaluation.** `lookupExpressionValue` reconstructs a string from an array just to recurse — pass the array directly. The visited Set and array-handling already exist in the recursion path.
- **Specialize function invocation for 0-3 args** (the 90% case). Avoid rest-args `Array(argCount)` allocation:
  ```js
  switch (argCount) {
    case 0: result = tokenValue(); break;
    case 1: result = tokenValue(results[index + 1]); break;
    // ... up to 3
    default: { /* spread fallback */ }
  }
  ```
- **Cache dotted path segments.** `getDeepDataValue` walks via `path.substring(start, end)` per segment per lookup — allocates a string per segment per call. Cache `path → segments` in a module-level Map (5000-cap, batch-clear).
- **Thread precomputed `dotIndex` through the call chain.** `lookupTokenValue` already computes `token.indexOf('.')`; pass it to `getDeepDataValue` and `accessTokenValue` instead of recomputing.
- **`evaluateJavascript` destructures an options object on every call.** Pass `includeHelpers` as a direct boolean parameter; default-when-undefined inside.
- **Conditional `getValue` in `getExpressionArray`.** When no parenthesized groups were captured (common case), skip the placeholder-detect regex per token.
- **Charcode-based fast paths in `getLiteralValue`.** Already partly applied; finish the pattern for string-literal start/end and quote-char comparison.

### Bug fix worth capturing

- **Verify `DynamicRegion.clear()` removes `endAnchor`.** Earlier code had a leak where conditional content swaps left orphan `endAnchor` text nodes in the DOM. Current `clear()` may already address this — confirm during scoping. Cheap one-line fix if not.

## Approaches considered and rejected

- **WeakMap caching for Signal values** — Signals are reactive; caching would break notification semantics.
- **Manual char-by-char string building for quote stripping** — `result += char` is O(n²) in many engines; regex replace is faster.
- **LRU eviction via `cache.keys().next().value`** — allocates iterators per eviction; batch `clear()` amortizes better.
- **Replacing `instanceof Signal`** — V8 handles `instanceof` efficiently for monomorphic shapes; structural alternatives add checks on the common non-Signal path.

## Open Questions

- **WASM renderer relationship.** The server-side hot path moves to WASM (`wasm-renderer.md`) eventually. Client-side renderer + evaluator stays in JS — these items still pay off there.
- **Benchmark scope.** Each item moves a small amount; cumulative gain shows on list-heavy workloads (filter-keystroke on 1000-row tables, hydrated-cards re-render). Need a representative benchmark before measuring — todo-list and krausest are starting points but neither hits the V8 escape-analysis edges this plan probes.

## Dependencies

- `signal-performance.md` lands first — freeze rewrite eliminates the `Signal.peek` clone item.
- `fine-grained-reactivity.md` lands first — `ReactiveDataContext` removes `createItemDataProxy` and the per-item Proxy item entirely.

## Status

`initial`. Iceboxed. Promote when a benchmark on a real workload (post-fine-grained-reactivity, post-freeze) shows residual headroom, or when a downstream perf complaint identifies a specific bottleneck this plan addresses.
