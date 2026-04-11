# Plan: Expression Eval First-Run Optimization

## Status
**Punted.** The proposed approaches have correctness risks that outweigh the performance gains.

## What Was Proposed

**Simple Lookup Fast Path (Approach 5):** For expressions matching `/^[a-zA-Z_$][0-9a-zA-Z_$.]*$/`, bypass the full ExpressionEvaluator and walk the data context path directly, calling `dependency.depend()` on Signals found along the way.

**Expression Parsing Cache (Approach 3):** Cache `getExpressionArray()` results in a static `Map<string, TokenArray>`.

## Why Punted

### Fast Path (Approach 5)
The fast path's `registerDepsForPath` replaces the evaluator's dependency discovery with a direct path walk. The concern: the data context merges settings (Proxy-wrapped Signals), state (raw Signals), and createComponent return values (plain objects, functions) into a flat namespace. Whether `current[part]` correctly triggers the same Signal access as the full evaluator depends on how each value type surfaces in the merged context — Proxy traps, raw Signal instances, getters, or plain values all behave differently.

If the fast path misses a Signal dependency for any value type, the binding silently falls back to coarse `dataVersion`-only reactivity instead of fine-grained Signal tracking. This is the worst kind of bug — functionally correct (the binding updates eventually via `bumpDataVersion`) but with degraded performance characteristics that are invisible to the developer.

The reactive system has two intentional paths:
- **Fine-grained:** Expression reads a Signal → `dependency.depend()` → Signal change triggers just that Reaction
- **Coarse:** Expression reads plain data → only `dataVersion` registered → `bumpDataVersion` triggers all such Reactions

The full evaluator correctly discovers which path applies for every expression. The fast path cannot guarantee this without replicating the evaluator's exact resolution behavior for every data context type, which defeats the purpose.

### Expression Parsing Cache (Approach 3)
`getExpressionArray()` (expression-evaluator.js:31-61) only fires for multi-token expressions that aren't resolved by `lookupTokenValue` first. Simple lookups (`{name}`, `{item.name}`) short-circuit before reaching it. The cache benefits only the minority of expressions that are multi-token Lisp-style calls (`{formatDate date 'h:mm a'}`). The win is real but small — low priority relative to the other plans.

## Future Consideration

If expression eval cost becomes a measured bottleneck on real pages (not just the 1000-item synthetic test), revisit with approaches that work WITH the evaluator rather than around it:
- Profile which step in the evaluator cascade dominates (literal checks, `getDeepDataValue`, `evaluateJavascript`)
- Optimize the hot path within the evaluator itself rather than bypassing it
- Consider whether the `new Function` + `with` + Proxy path in `evaluateJavascript` (lines 99-107) can be avoided for expressions that `getDeepDataValue` already resolved
