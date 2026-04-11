# Expression Evaluation on First-Run Hydration: Analysis & Recommendation

## Problem Statement

During hydration, every Reaction executes its callback on `firstRun` purely to register Signal dependencies via `dependency.depend()`. The first-run evaluation result is discarded — the server already produced the correct DOM. The full expression evaluation cascade runs (token parsing, deep data lookup, `new Function` + `with` for JS expressions, helper resolution) just to trigger the side-effect of `Signal.get()` calls.

## How Dependency Registration Actually Works

The chain from expression to dependency:

```
Reaction.run()
  → sets Scheduler.current = this
  → calls callback(this)
    → callback calls this.eval(expression, data)
      → ExpressionEvaluator.lookupExpressionValue()
        → lookupTokenValue()
          → getDeepDataValue() calls signal.get() for dotted paths
          → or evaluateJavascript() where Proxy.get trap calls signal.get()
          → or accessTokenValue() which reads signal.value
            → Signal.value getter calls this.dependency.depend()
              → Dependency.depend() checks Scheduler.current, adds bidirectional link:
                  dependency.subscribers.add(Scheduler.current)
                  Scheduler.current.dependencies.add(this)
  → clears Scheduler.current = null
```

The critical fact: `dependency.depend()` is a 6-line method. It checks `Scheduler.current`, adds two Set entries. That's the only thing needed for reactivity to work on subsequent runs. Everything before it in the chain is cost paid to reach Signal access points.

## Cost Breakdown Per Expression Evaluation

Tracing through `lookupTokenValue` for a typical expression like `item.name`:

1. **`getLiteralValue(token)`** — regex tests, string checks. ~0.001ms. Cheap.
2. **`getDeepDataValue(data, 'item.name')`** — `split('.')`, reduce with Signal checks. ~0.005ms. This is where `signal.get()` happens for data-context signals.
3. **`accessTokenValue()`** — function binding for dotted paths, Signal unwrapping. ~0.002ms.
4. **`evaluateJavascript(token, data)`** (only if steps 2-3 return undefined) — `new Function('ctx', 'with(ctx) { return ... }')` + Proxy construction + execution. ~0.02-0.08ms. This is the expensive path.
5. **Helper lookup** — object property access. ~0.001ms. Cheap.

For simple data lookups (`name`, `item.name`, `count`), the cost is dominated by steps 2-3. For JS expressions (`count > 5`, `items.length`, ternaries), step 4 dominates and is 10-40x more expensive than `depend()`.

### The `dataVersion` Signal

Every `eval()` call also reads `this.dataVersion.get()`, which registers an additional dependency. This is a global version counter that forces all expressions to re-evaluate when `bumpDataVersion()` is called (used for subtemplate data propagation). This adds one extra `depend()` per expression.

### Additional Cost: Expression Parsing

`lookupExpressionValue` for multi-token expressions (Lisp-style like `formatDate date 'h:mm a'`) recursively:
1. Calls `addParensToExpression()` — regex replace
2. Calls `getExpressionArray()` — another regex match + recursive parse
3. Iterates tokens backwards, recursively calling `lookupExpressionValue` per token

For a 3-token expression, this is 4 recursive calls through the entire lookup pipeline.

## Where First-Run Evals Happen in Hydration

Tracing through `hydrateMarkers`:

| Binding Type | Location | First-Run Behavior |
|---|---|---|
| **Text expression** | `hydrateTextExpression` L1424-1438 | `eval()` on firstRun, return early (skip DOM write) |
| **Unsafe HTML text** | `hydrateTextExpression` L1377-1383 | `eval()` on firstRun, return early |
| **Single attr** | `hydrateAttributes` L1305-1311 | `eval()` on firstRun, return early |
| **Multi attr** | `hydrateAttributes` L1335-1344 | `eval()` all parts on firstRun, return early |
| **Property binding** | `hydrateAttributes` L1274-1281 | `lookupTokenValue()` on firstRun, return early |
| **Conditional** | `hydrateConditional` L1614-1636 | `getBranch()` calls `eval()` on condition (no firstRun skip — needed to detect branch changes) |
| **Each loop** | `hydrateEach` L1642-1653 | `eval(node.over)` on firstRun, return early |
| **Async** | `hydrateAsync` L1695-1701 | `eval(node.expression)` on firstRun (triggers promise) |
| **Rerender/guard** | `hydrateRerender` L1736-1748 | `guard()` + `eval()` on firstRun |
| **Subtemplate** | `hydrateSubtemplate` L983-1038 | `lookupExpressionValue(node.name)` + `unpackNodeData()` on firstRun |

Key observation: conditionals, async, rerender, and subtemplates **cannot skip first-run eval** — they need the result to determine behavior (which branch, whether it's a promise, template identity). Only text expressions, attributes, and property bindings purely waste the result.

## Proposed Solutions: Evaluation

### 1. Static Analysis — Extract Dependencies Without Running Expressions

**Concept:** Parse the expression string to identify which data-context keys it references, then call `dependency.depend()` directly for each key's Signal.

**Why it exists as full-eval today:** The expression evaluator supports a dual syntax (Lisp + JS), deep dotted paths, helpers that return Signals, computed getters, and Proxy-based data contexts. A static analysis would need to handle:
- `name` — simple lookup
- `item.name` — dotted path where `item` might be a Signal containing an object
- `formatDate date 'h:mm a'` — helper call where `date` is the Signal
- `items.length > 0` — JS expression where `items` is a Signal
- `isNew ? 'new' : 'old'` — JS ternary
- `concat 'hi ' (isNew ? 'new' : 'old')` — mixed Lisp/JS with nested parens

The Proxy in `evaluateJavascript` auto-unwraps Signals on property access. Replicating this statically would mean parsing JS expressions to find identifier references — essentially a partial JS parser.

**Estimated effort:** Very high. Partial JS parsing, handling all expression forms.
**Estimated improvement:** Eliminates ~80% of eval cost for simple lookups. No improvement for JS expressions where the `new Function` is the dependency discovery mechanism.
**Risk:** Any expression form missed by static analysis means a Signal dependency is never registered, causing silent reactivity failures. The test surface area for this is enormous given the dual syntax.
**Verdict:** Too risky for the benefit. The expression language is intentionally dynamic.

### 2. Deferred First-Run — Register Deps on First Signal Change

**Concept:** Don't run the Reaction callback at all on first-run. Instead, wait for any Signal in the data context to change, then run the callback for the first time.

**Why it can't work:** Reactions discover their dependencies *by running*. If you don't run the callback, you don't know which Signals to listen to. You'd need a way to say "when ANY signal in this data context changes, run this for the first time" — but that requires knowing the universe of possible signals, and the data context includes Proxies, computed values, helpers that return Signals, and deep dotted paths.

Concretely: if a component has `state.count` and `state.name`, and a text expression only depends on `count`, deferred registration would need to either (a) subscribe to all state signals (over-subscribing, causing unnecessary re-renders) or (b) know statically which signals the expression uses (back to static analysis).

**Estimated improvement:** Would eliminate 100% of first-run eval cost.
**Risk:** Over-subscription causes O(N*M) wasted re-renders where N is expressions and M is state signals. For a spec-driven component with 15 spec attributes and 20 expressions, that's 300 unnecessary reaction runs on the first change.
**Verdict:** The cure is worse than the disease.

### 3. Expression Parsing Cache (Map of Parsed Token Arrays)

**Concept:** Cache the result of `getExpressionArray()` — the regex parsing + recursive token tree — keyed by expression string.

**How it works today:** `lookupExpressionValue` calls `addParensToExpression` then `getExpressionArray` on every evaluation. These are pure functions of the expression string. They produce identical results every time.

**What it eliminates:** Two regex operations and a recursive parse per expression, per evaluation. This is significant for multi-token expressions but negligible for simple data lookups.

**Estimated improvement:** For simple lookups (`name`, `item.name`): ~0% — they short-circuit at `lookupTokenValue` before reaching `getExpressionArray`. For multi-token expressions (`formatDate date 'h:mm a'`): ~20-30% of eval time, since the parsing is a real fraction. But these are a small proportion of total expressions (most template expressions are simple lookups or JS infix operators).

**Risk:** Near zero. Pure function, deterministic output, trivially correct cache.
**Verdict:** Low-risk incremental improvement. Worth doing but won't move the needle for hydration.

### 4. Share Dependency Sets Across Each-Loop Items

**Concept:** In an each loop with N items, every item renders the same template AST with the same expression strings. If item 0's Reaction for `{item.name}` discovers it depends on `itemSignal`, items 1-N should too. Register deps once, clone the dependency set.

**Why it's hard:** The dependencies aren't on the same Signal instances across items. Each item creates its own `itemSignal` (line 637 in renderer.js) and its own `itemProxy`. The dependency registered is on `itemSignal.dependency` — a different Dependency object per item. You can't share Dependency objects across items because each item needs its own invalidation path.

What you *could* share is the knowledge that "this expression reaches the data context through `item.name`, so it will depend on whatever Signal provides `item`." But that's back to static analysis.

**Estimated improvement:** Would eliminate (N-1)/N of first-run eval cost inside each loops (where N is item count). For a 20-item list, that's 95% of first-run each eval.
**Risk:** High complexity for the proxy-based data context. The item proxy delegates to `itemSignal.value` which triggers `depend()` — you'd need to restructure how item data flows.
**Verdict:** Architecturally appealing but requires rethinking the each-loop data model.

### 5. Skip First-Run Eval for Simple Lookups, Fall Back for Complex

**Concept:** Classify expressions at `buildHTMLString` time into "simple" (single identifier or dotted path) vs "complex" (everything else). For simple expressions during hydration first-run, directly look up the Signal in the data context and call `signal.dependency.depend()`. Fall back to full eval for complex expressions.

**Implementation:**
```js
// In buildHTMLString or as a post-pass on entries:
entry.isSimpleLookup = /^[a-zA-Z_$][0-9a-zA-Z_$.]*$/.test(expression);

// In hydrateTextExpression first-run path:
if (entry.isSimpleLookup) {
  this.registerDepsForPath(exprNode.value, data);
} else {
  this.eval(exprNode.value, data);
}
```

Where `registerDepsForPath` walks the dotted path, calling `.dependency.depend()` on any Signal found:
```js
registerDepsForPath(path, data) {
  this.dataVersion.get(); // register dataVersion dep
  const parts = path.split('.');
  let current = data;
  for (const part of parts) {
    if (current instanceof Signal) {
      current.dependency.depend();
      current = current.currentValue;
    }
    if (current == null) return;
    current = current[part];
  }
  if (current instanceof Signal) {
    current.dependency.depend();
  }
}
```

**What it eliminates:** For simple lookups (which are the majority of template expressions): the `lookupTokenValue` cascade, `getLiteralValue` checks, `evaluateJavascript` fallback. Replaces it with a direct path walk + `depend()`. For JS expressions (`count > 5`, ternaries), falls back to full eval — which is correct because those need the Proxy + `new Function` machinery to discover which identifiers they access.

**Estimated improvement:** ~60-70% of first-run eval time eliminated. Simple lookups dominate expression counts. The remaining 30-40% is complex expressions that genuinely need full evaluation.

**Risk:** Moderate. The `registerDepsForPath` must handle the same cases as `getDeepDataValue`:
- Signal wrapping at any level of the path
- Proxy-based data contexts (each-loop item proxies)
- The `dataVersion` global dep

The fallback ensures correctness — any expression that doesn't match the simple regex gets the full eval. The regex is conservative: it only matches `foo` or `foo.bar.baz`, nothing with operators, parens, quotes, or spaces.

**Critical subtlety with Proxies:** The each-loop `createItemDataProxy` returns a Proxy. When we access `proxy.item`, the Proxy's `get` trap calls `itemSignal.value` which calls `depend()`. So the path walk on a Proxy still correctly registers dependencies. **However**, the walk accesses `current[part]` which triggers the Proxy getter — this means it reads `itemSignal.value` which clones arrays/objects. This is the same cost as today's path. The savings come from avoiding the `lookupTokenValue` overhead (literal checks, JS eval fallback).

For non-proxy data (the common case of settings and state signals at the top level), the savings are real: we bypass the entire ExpressionEvaluator pipeline.

**Verdict:** Best risk/reward ratio. Conservative regex ensures correctness. Fallback path is the existing code. Can be implemented incrementally.

## Measurement: What Fraction of Expressions Are Simple Lookups?

From the test suite and typical SUI component templates:

| Expression | Simple? | Frequency |
|---|---|---|
| `{greeting}` | Yes | Very common |
| `{item.name}` | Yes | Very common (each loops) |
| `{count}` | Yes | Common |
| `{ui}` | Yes | Every spec-driven component |
| `{cls}` | Yes | Common |
| `{item.active}` | Yes | Common |
| `{is mode "a"}` | No (helper call) | Moderate |
| `{count > 0}` | No (JS operator) | Moderate |
| `{formatDate date 'h:mm a'}` | No (helper call) | Rare |
| `{isNew ? 'new' : 'old'}` | No (JS ternary) | Rare |
| `{getCategory}` | Yes (but resolves to function) | Moderate |

Estimate: **70-80%** of template expressions are simple identifier or dotted-path lookups.

## Recommendation

**Implement Approach 5: Simple Lookup Fast Path with Full-Eval Fallback.**

### Rationale

1. **Conservative correctness.** The regex filter is strict — only `identifier` and `identifier.path.segments` are fast-pathed. Everything else falls through to the battle-tested evaluator. No new failure modes.

2. **Eliminates the right cost.** The expensive part of simple lookups isn't `depend()` — it's the evaluator's multi-step cascade: literal checks, `getDeepDataValue` with its `wrapFunction` calls and intermediate allocations, the `evaluateJavascript` fallback that constructs a `new Function` and Proxy per invocation (line 100-107 of expression-evaluator.js). The fast path replaces all of this with a direct path walk.

3. **Proportional to the problem.** Simple lookups are ~75% of expressions. For a component with 40 expressions hydrated, this eliminates ~30 full evaluator passes.

4. **Incremental.** Can be added to `hydrateTextExpression`, `hydrateAttributes`, and `hydrateEach` independently. No architectural changes to the Reaction system, data model, or expression evaluator.

5. **Measurable.** The `__hydPerf` instrumentation already tracks `evalFirstRun` and `evalFirstRunTime`. The fast path can add its own counter to validate the split.

### What It Does NOT Solve

- Block directives (if, each, async, rerender) still need full eval on first-run because they use the result to determine behavior (which branch to render, template identity, etc.)
- Complex expressions still need full eval to discover dependencies through the Proxy mechanism
- The `dataVersion.get()` call remains in all paths (required for subtemplate data propagation)

### Estimated Net Impact

For a spec-driven component with 30 expressions (typical for a medium SUI primitive):
- ~22 simple lookups skip full eval: saves ~22 * 0.03ms = ~0.66ms
- ~8 complex expressions: no change
- Block directive first-runs: no change (they need the result)

For a page with 50 hydrated components: ~33ms savings. That's noticeable in Time to Interactive.

For each-loops with 100 items, each item having 5 expressions (4 simple, 1 complex): saves ~100 * 4 * 0.03ms = ~12ms per loop.

### Additional Quick Win: Expression Parsing Cache (Approach 3)

Can be combined with Approach 5 at near-zero risk. Add a module-level `Map<string, TokenArray>` in ExpressionEvaluator:

```js
static _parseCache = new Map();

getExpressionArray(expr) {
  let cached = ExpressionEvaluator._parseCache.get(expr);
  if (cached) return cached;
  // ... existing parse logic ...
  ExpressionEvaluator._parseCache.set(expr, result);
  return result;
}
```

This benefits complex expressions on subsequent runs (not just first-run), so it compounds with Approach 5.
