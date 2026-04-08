# Renderer Construction Cost Analysis

## Source Files Examined

- `packages/renderer/src/engines/native/renderer.js` — full file, 1809 lines
- `packages/renderer/src/engines/lit/renderer.js` — full file, 524 lines
- `packages/renderer/src/expression-evaluator.js` — full file, 245 lines
- `packages/renderer/src/engines/native/reaction-scope.js` — full file, 30 lines
- `packages/renderer/src/build-html-string.js` — full file, 203 lines
- `packages/reactivity/src/signal.js` — full file, 337 lines
- `packages/reactivity/src/dependency.js` — full file, 40 lines
- `packages/utils/src/crypto.js` — full file, 142 lines
- `packages/templating/src/template.js` — full file, 1134 lines

---

## Question 1: Constructor Cost Model and Dependency Map

### What Each Piece Does

The native Renderer constructor performs the following work, in order:

| Step | Operation | Cost | Downstream Consumer |
|------|-----------|------|---------------------|
| 1 | `this.ast = ast \|\| []` | negligible (reference copy) | `render()` -> `readAST()` -> `buildHTMLString()` |
| 2 | `this.data = data` | negligible (reference copy) | `eval()`, `setData()`, `bumpDataVersion()` |
| 3 | `this.snippets = snippets \|\| {}` | negligible | `collectSnippets`, `buildHTMLString`, `createSnippet` |
| 4 | `this.collectSnippets(this.ast)` | O(n) AST top-level nodes | populates `this.snippets` before `buildHTMLString` needs them |
| 5 | `this.helpers = helpers \|\| {}` | negligible | passed to ExpressionEvaluator, used in `eval()` |
| 6 | `this.id = ++Renderer._nextId` | negligible | **nothing functional** in native renderer (debug-only) |
| 7 | `this.dataVersion = new Signal(0)` | moderate — creates Dependency, calls `Error.captureStackTrace` once | `eval()` calls `this.dataVersion.get()` to track subtree version; `bumpDataVersion()` calls `.increment()` |
| 8 | `this.scope = new ReactionScope()` | negligible — 3 empty arrays | tracks all Reactions created during `render()`; `scope.dispose()` tears them down |
| 9 | `new ExpressionEvaluator({...})` | negligible — stores 3 references | all expression evaluation in `eval()`, `bindMarkers()`, etc. |
| 10 | `this.notifyUpdate = () => {...}` | negligible — closure | `createAsync()`, `bumpDataVersion()` |

### Dependency Graph (what blocks what)

```
buildHTMLString()  <--- needs this.snippets (from collectSnippets)
                   <--- needs this.ast
                   
bindMarkers()      <--- needs this.evaluator (from ExpressionEvaluator)
                   <--- needs this.dataVersion (from Signal)
                   <--- needs this.scope (from ReactionScope)
                   
render() calls     buildHTMLString -> parseHTML -> bindMarkers (sequential)
```

Critical path: `collectSnippets` must complete before `render()` calls `buildHTMLString` (which receives `this.snippets`). The Signal, ReactionScope, and ExpressionEvaluator are all needed by `bindMarkers` but not by `buildHTMLString` or `parseHTML`.

### Dominant Costs

1. **`new Signal(0)`**: The Signal constructor creates a `Dependency` which calls `Error.captureStackTrace()`. In V8, stack trace capture involves unwinding the call stack — typically 5-20us depending on depth. For a `dataVersion` Signal that is essentially a monotonic counter, full debugging metadata is likely unnecessary.

2. **`collectSnippets`**: Linear scan of top-level AST nodes. For a typical component with 10-50 top-level nodes, this is sub-microsecond. For very deeply nested templates, still cheap because it's top-level only. The comment in the code says "The compiler hoists snippets to the front, so a top-level scan is sufficient."

3. **Everything else**: Reference assignments and small object allocations. Combined cost is well under 0.1ms.

**Net assessment**: The native renderer constructor is already quite lean compared to the Lit renderer. The hashCode removal (previously ~1.4ms) replaced by `++Renderer._nextId` was the single biggest win already taken. The remaining construction overhead is dominated by Signal creation for `dataVersion`.

---

## Question 2: collectSnippets — Is Per-Instance Work Necessary?

### What Snippets Are

Snippets are template-local named blocks defined with `{#snippet name}...{/snippet}` syntax. They are reusable template fragments within the same template scope. Unlike subtemplates, they share the parent data context and are resolved by name at render time.

### Where They Come From

1. The template compiler (`TemplateCompiler`) parses `{#snippet}` blocks into AST nodes with `type: 'snippet'`.
2. The compiler hoists these to the top of the AST (per the code comment at line 77-78 of the native renderer).
3. The `buildHTMLString` function skips snippet nodes (line 168-169 of build-html-string.js), emitting no HTML or markers for them.
4. When a `{> snippetName}` reference is encountered, it's resolved from `this.snippets` at render time.

### How collectSnippets Works

```js
collectSnippets(ast) {
  for (const node of ast) {
    if (node.type === 'snippet') {
      this.snippets[node.name] = node;
    }
  }
}
```

Top-level linear scan, no recursion. Since the compiler hoists snippet definitions, no deep walk is needed.

### Is Per-Instance Work Necessary?

**Why it exists**: The native renderer must populate `this.snippets` before `buildHTMLString` is called. The Lit renderer does this inline during `readAST()` (line 148-149), encountering snippet definitions before their references because the compiler orders them first. The native renderer can't do this during `buildHTMLString` (which is a pure function) so it pre-collects.

**Key observation**: Snippets come from the AST. For a given component, the AST is the same across all instances. However, the `snippets` parameter can also be passed in from a parent renderer (e.g., when rendering subtrees), so the initial `this.snippets = snippets || {}` seeds the map with inherited snippets, and `collectSnippets` adds the local ones.

### Approaches

**Approach A: Static snippet extraction at compile time**

- **Mechanism**: The compiler could emit a separate `snippets` map alongside the AST, containing `{ name: astNode }` pairs extracted during compilation. The Renderer constructor would merge this pre-built map instead of scanning.
- **Tradeoffs**: Eliminates runtime scan entirely. Requires compiler changes. The AST itself would still contain snippet nodes (for consistency/debugging), meaning the data is duplicated.
- **Optimizes for**: Constructor speed at the cost of compile-time work (acceptable since compile is once-per-component).

**Approach B: Cache snippet extraction per AST identity**

- **Mechanism**: Use a WeakMap keyed on the AST array reference. First construction scans and caches; subsequent constructions with the same AST array get the cached result.
- **Tradeoffs**: First construction still pays the scan. Requires WeakMap lookup per construction. Only works if the AST array is the same reference (which it is for web components using cached ASTs, but would miss `clone()` cases).
- **Optimizes for**: Repeated instantiation of the same component type.

**Approach C: Lazy collection on first snippet reference**

- **Mechanism**: Don't collect snippets in the constructor. Instead, on the first `{> name}` resolution that fails to find a snippet, scan the AST at that point.
- **Tradeoffs**: Adds latency to first snippet reference. More complex code path. If there are no snippets, the scan never happens (common for simple components).
- **Optimizes for**: Components without snippets (the majority case).

**Approach D: Keep as-is**

- **Mechanism**: Current top-level scan in constructor.
- **Tradeoffs**: Cost is O(top-level-node-count), typically 10-50 iterations with a type-string comparison each. This is sub-microsecond work. The code comment explaining the hoisting invariant makes the intent clear.
- **Optimizes for**: Simplicity, correctness, readability.

**Assessment**: The cost of `collectSnippets` is negligible — a handful of microseconds even for large templates. The current implementation is clean and the compiler invariant (hoisting) makes it correct. The per-instance work is genuinely necessary because each Renderer instance needs its own `snippets` map (it can be seeded by a parent and augmented by local definitions). Unless profiling shows this becoming a bottleneck, optimization here would be premature.

---

## Question 3: ExpressionEvaluator — Instance vs. Static Methods

### What the Constructor Does

```js
constructor({ data, helpers, dataVersion } = {}) {
  this.data = data;
  this.helpers = helpers || {};
  this.dataVersion = dataVersion;
}
```

Three reference assignments. No computation. All regex patterns are static class properties (compiled once, shared across all instances). The constructor cost is essentially zero.

### How the Instance Is Used

The ExpressionEvaluator is used throughout the Renderer via:
- `this.evaluator.lookupExpressionValue(expr, data)` — always receives explicit `data` parameter
- `this.evaluator.lookupTokenValue(expr, data)` — always receives explicit `data` parameter
- `this.evaluator.setData(newData)` — called from `Renderer.setData()` to keep `this.evaluator.data` in sync

The instance-stored `this.data` is used as a default when methods are called without a `data` parameter. In practice, the renderer almost always passes `data` explicitly.

The `this.helpers` reference is used in `lookupTokenValue()` (line 185: `const helper = this.helpers[token]`) and `evaluateJavascript()` (line 66: `context = { ...this.helpers, ...context }`).

The `this.dataVersion` reference is used in `evaluate()` (line 23: `this.dataVersion.get()`) to register Signal dependencies for subtree propagation.

### Approaches

**Approach A: Fully static methods with parameter injection**

- **Mechanism**: Convert ExpressionEvaluator to a namespace of static methods. Every call passes `data`, `helpers`, `dataVersion` explicitly.
- **Tradeoffs**: Eliminates instance allocation entirely (saving ~0 meaningful cost). Every call site grows by 2-3 parameters. `lookupTokenValue` internally calls `evaluateJavascript` which calls back to `lookupExpressionValue` — threading context through this recursive call chain requires passing parameters through every frame or using a thread-local style context object.
- **Optimizes for**: Theoretical purity. The mutual recursion between `lookupExpressionValue` -> `lookupTokenValue` -> `evaluateJavascript` makes this approach verbose in practice.

**Approach B: Singleton evaluator with method-level context**

- **Mechanism**: Create one ExpressionEvaluator per application (or per component class) and set data/helpers/dataVersion before each evaluation batch. Like a reusable context object.
- **Tradeoffs**: Introduces statefulness concerns — the evaluator must be "primed" before use and can't be called reentrantly with different contexts. Reentrancy is relevant: a subtemplate's evaluator shouldn't share state with the parent's.
- **Optimizes for**: Reducing allocations (one shared instance vs. one per Renderer).

**Approach C: Inline evaluator methods on the Renderer**

- **Mechanism**: Move the methods from ExpressionEvaluator directly onto the Renderer class. The Renderer already stores `this.data`, `this.helpers`, `this.dataVersion`. The evaluator is purely a delegation target.
- **Tradeoffs**: Eliminates the ExpressionEvaluator class and its allocation. Makes the Renderer class larger. The ExpressionEvaluator is shared between Lit and Native renderers — inlining would require duplication or a different sharing mechanism (mixin, prototype delegation).
- **Optimizes for**: Removing one object allocation and one level of indirection.

**Approach D: Keep as-is**

- **Mechanism**: Current pattern — one ExpressionEvaluator per Renderer instance.
- **Tradeoffs**: The constructor does three property assignments. The instance allocation in V8 is a young-gen pointer bump (nanoseconds). The code separation between Renderer (DOM manipulation) and ExpressionEvaluator (expression parsing/evaluation) is a clean architectural boundary.
- **Optimizes for**: Code organization, shared implementation between Lit and Native engines, clear separation of concerns.

**Assessment**: The ExpressionEvaluator constructor does zero meaningful work — it stores three references. The instance allocation cost is negligible. The class exists for architectural reasons (shared between two renderer engines, separation of expression evaluation from DOM manipulation). Converting to static methods would add complexity to the recursive call chain without measurable performance benefit. The instance is not the problem; the work it does at evaluation time (e.g., `evaluateJavascript` with `new Function` + `with` + `Proxy`) is where real cost lives, and that's orthogonal to construction.

---

## Question 4: Renderer Identification Strategies

### Why the Hash Originally Included Both AST and Data

The Lit renderer's `getID({ ast, data, isSVG })` created a content-addressed identity: two renderers are "the same" if and only if they have the same template structure AND the same data. This was designed for **subtree caching** — when Lit re-renders, it checks if a subtree's content hash matches an existing cached render tree. If so, it skips re-rendering and returns the cached Lit template, just updating data via `cachedRender()`.

Including `data` in the hash means: "this is the exact render output identity." Including `ast` means: "this is the template structure identity." Together they represent a snapshot of what would be produced.

**However**: Looking more carefully at `LitRenderer.getID()` (line 34-42), the current Lit implementation does NOT include `data`:

```js
static getID({ ast, key, position, isSVG } = {}) {
  if (key !== undefined) {
    return hashCode({ ast, key });
  }
  if (position !== undefined) {
    return hashCode({ ast, position });
  }
  return hashCode({ ast });
}
```

Only the constructor call on line 59 passes `data`: `this.id = LitRenderer.getID({ ast, data, isSVG })`. But `getID` ignores `data` since neither `key` nor `position` are passed. So the top-level Lit renderer ID is `hashCode({ ast })` — AST-only, not including data. The `data` parameter in the constructor call is unused by `getID`.

For subtree caching in `renderContent()` (line 446-469), the ID uses `{ ast, key, position }` — never data. Subtrees are identified by their AST structure and either a key (from `{#each}`) or a position (from snippets), enabling reuse across re-renders when the structure hasn't changed.

**The native renderer has already removed hashCode entirely**, replacing it with `++Renderer._nextId`. This was done because the native renderer doesn't implement subtree caching. The comment at line 52-57 documents this explicitly.

### Strategies for Renderer Identification

**Approach A: Sequential ID (current native approach)**

- **Mechanism**: `this.id = ++Renderer._nextId`. Monotonically increasing integer.
- **What it enables**: Unique instance identification for debugging. O(1) construction.
- **What it precludes**: Content-addressed caching (can't determine if two renderers represent the same content). Can't deduplicate identical subtrees.
- **Tradeoffs**: Zero cost. Perfectly adequate when there is no subtree cache. Note: `_nextId` is never initialized as a static field, so the first increment produces `NaN` — this is harmless since the id is unused functionally, but could be cleaned up with `static _nextId = 0`.

**Approach B: AST-only hash (what Lit actually does for top-level)**

- **Mechanism**: `hashCode({ ast })` — hash the template structure, ignore data context.
- **What it enables**: Identifying which renderers share the same template structure. Could enable template-level caching of parsed HTML (`<template>` elements).
- **What it precludes**: Distinguishing renderers with the same template but different data (not needed for structural caching).
- **Tradeoffs**: The native renderer already has `templateCache` (line 37) keyed on the HTML string from `buildHTMLString` — this already serves the structural caching purpose. An AST hash would be redundant with the existing string-keyed cache. Cost: 0.5-1.4ms per construction depending on AST size (the original cost that was removed).

**Approach C: AST reference identity (cheap structural identity)**

- **Mechanism**: Use the AST array reference directly as a Map key. `const id = ast;` or use a WeakMap keyed on the AST.
- **What it enables**: Same-template detection at zero hashing cost. Works because component ASTs are compiled once and reused by reference.
- **What it precludes**: Cross-boundary deduplication (two components that happen to have identical templates would not share an ID). Doesn't work for dynamically generated ASTs.
- **Tradeoffs**: Eliminates all hashing cost. Requires that AST identity is stable, which it is for web components (AST is compiled once and stored on the class).

**Approach D: Compound key with AST + position/key (for future subtree caching)**

- **Mechanism**: Similar to Lit's `getID()` — hash AST with a position index or iteration key.
- **What it enables**: Full subtree deduplication. An `{#each}` rendering 1000 items with the same inner template could share parsed DOM templates across items.
- **What it precludes**: Nothing, if implemented well.
- **Tradeoffs**: Only valuable when subtree caching is implemented. The native renderer's `parseHTML` already caches at the HTML-string level via `templateCache`, so the main remaining benefit would be caching the *bound* subtree state (avoiding `bindMarkers` re-execution). This is architecturally different from Lit's approach because the native renderer's bindings are imperative Reactions rather than declarative template parts.

**Approach E: Remove the id field entirely**

- **Mechanism**: Delete `this.id` from the native Renderer constructor.
- **What it enables**: Slightly cleaner code, signals that there is no identity-based caching.
- **What it precludes**: Debug identification of renderer instances. If subtree caching is added later, the field would need to be re-added.
- **Tradeoffs**: The sequential ID costs nothing and provides some debug utility. Removing it saves exactly zero performance. The tradeoff is purely about code clarity — does having an unused-in-practice `id` field mislead readers into thinking it's functionally significant?

### Comparative Summary

| Approach | Cost per construction | Enables caching? | When to use |
|---|---|---|---|
| Sequential (current) | ~0 | No | No subtree cache planned |
| AST-only hash | 0.5-1.4ms | Template-level | Redundant with existing `templateCache` |
| AST reference identity | ~0 | Template-level | If structural identity matters later |
| AST + position hash | 0.5-1.4ms | Full subtree | If subtree caching is implemented |
| Remove entirely | ~0 | No | Aggressive minimalism |

---

## Cross-Cutting Observations

### Signal(0) for dataVersion

The most significant remaining construction cost is `new Signal(0)`. The Signal constructor path:
1. `new Dependency({ firstRun: true, value: 0 })` allocates a Dependency with a `Set()` for subscribers
2. `Dependency.setContext()` calls `Error.captureStackTrace()` — this is the single most expensive operation in the constructor, typically 5-20us in V8
3. `Signal.maybeClone(0)` — returns 0 immediately (primitive)
4. `Signal.setContext()` — creates a small object

The `dataVersion` Signal is used as a monotonic counter for subtree data propagation. It's incremented via `.increment()` and read via `.get()` to register dependency tracking. Its value is never inspected — only its change notifications matter.

**Possible approaches for this specific Signal:**
1. **Lightweight counter Signal**: A purpose-built "version counter" class that skips cloning, equality checking, stack traces, and context metadata. It would only need `get()` (registers dependency), `increment()` (notifies subscribers), and the underlying `Dependency`.
2. **Lazy stack trace**: Make `Error.captureStackTrace` opt-in via a global debug flag, so production builds skip it.
3. **Bare Dependency**: Use a raw `Dependency` instance instead of a `Signal` wrapping it. Call `.depend()` where `dataVersion.get()` is used, and `.changed()` where `dataVersion.increment()` is used.

### Template.initialize() Relative Cost

The Renderer is constructed inside `Template.initialize()`, which also:
- Runs `createComponent()` — user code, unbounded cost
- Creates a Reaction watching all state Signals — one `Reaction.create()` per template
- Builds `callParams` with ~30 properties including multiple `.bind()` calls (each `.bind()` creates a new function object)
- Creates 5 lifecycle closures (onCreated, onRendered, onDestroyed, onUpdated, onThemeChanged)

The `callParams` construction with its ~10 `.bind()` calls is likely comparable in cost to the entire Renderer constructor. In the grand scheme of `initialize()`, Renderer construction is a modest fraction — the user's `createComponent()` function and the callParams setup are likely larger contributors.

### The Real Bottleneck is Not Construction

For the native renderer, the expensive work happens in `render()` and especially `bindMarkers()`:
- `buildHTMLString()` walks the entire AST
- `parseHTML()` parses HTML via `template.innerHTML` (or clones from cache)
- `bindMarkers()` creates TreeWalkers, scans all elements and comments, creates Reactions for every binding

During hydration, the cost is even higher: `hydrateMarkers` builds a reference DOM, creates parallel TreeWalkers, and must match server-rendered content with client-side bindings.

The constructor, at current state, is not a meaningful fraction of the total render path.
