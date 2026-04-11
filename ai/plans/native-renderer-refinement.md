# Native Renderer Refinement

## Goal

The native renderer works. 573 tests pass. TodoMVC runs. The architecture is sound — single-pass HTML assembly, comment markers, TreeWalker binding. This plan is about making it beautiful.

These are not bugs. They're the places where a correct implementation can become an elegant one.

---

## 1. PreparedTemplate Caching

**What it is:** Parse HTML once per AST, clone per instance.

**Why it matters:** Every `readAST` call does `template.innerHTML = htmlString`. Inside an `{#each}` with 100 items rendering the same subtemplate, that's 100 parses of the same HTML string. `innerHTML` is the most expensive DOM operation we do.

**The fix:**

```js
const templateCache = new Map();

function getParsedTemplate(htmlString) {
  let cached = templateCache.get(htmlString);
  if (!cached) {
    const tpl = document.createElement('template');
    tpl.innerHTML = htmlString;
    cached = tpl.content;
    templateCache.set(htmlString, cached);
  }
  return cached.cloneNode(true);
}
```

Cache by HTML string (which is deterministic from the AST). `cloneNode(true)` is significantly faster than re-parsing — benchmarks show 5-10x for typical component templates. The comment markers survive cloning.

**Subtlety:** The cache needs to be per-component-definition, not global, to avoid memory growth. Attach it to the prototype Template or the Renderer constructor. WeakRef if concerned about GC.

---

## 2. Remove `__isItemProxy` Flag

**What it is:** A magic property on the each-item Proxy to distinguish "inside each body" from "top level."

**Why it exists:** `unpackNodeData` needs to know whether static `data={}` expressions should track dependencies (yes inside each, no outside). Currently detects this by checking `data.__isItemProxy`.

**The clean fix:** Thread the context explicitly.

```js
readAST({ ast, data, scope, isSVG, isReactiveContext = false })
```

When `createEach` calls `readAST` for item content, pass `isReactiveContext: true`. This flows into `bindBlockDirective` → `createSubtemplate` → `unpackNodeData`, which checks `isReactiveContext` instead of `data.__isItemProxy`.

Remove the `__isItemProxy` getter from the Proxy. The Proxy becomes a clean data bridge with no framework-specific properties.

---

## 3. Selective dataVersion Tracking

**What it is:** Only track `dataVersion` in Reactions that need subtree propagation.

**Why it matters:** Every binding Reaction currently calls `this.eval()` which reads `this.dataVersion.get()`. For top-level components, `dataVersion` never changes — Reactions track individual Signals directly. The `dataVersion.get()` call adds a dependency that never fires, wasting a slot in the Reaction's dependency Set.

`dataVersion` only matters for subtrees: when a parent calls `setDataContext` + `render` on a subtemplate, `bumpDataVersion` is the mechanism that tells the subtemplate's Reactions to re-evaluate against new data.

**The fix:** Two evaluation methods instead of one.

```js
// For bindings in top-level components and each-item bodies
// (where Signals provide direct dependency tracking)
evalDirect(expression, data) {
  return this.evaluator.lookupExpressionValue(expression, data);
}

// For bindings in subtemplates
// (where dataVersion propagation drives updates)
evalTracked(expression, data) {
  this.dataVersion.get();
  return this.evaluator.lookupExpressionValue(expression, data);
}
```

`readAST` for subtemplates uses `evalTracked`. Everything else uses `evalDirect`. This removes unnecessary dependency tracking from the common case.

**Alternative:** Instead of two methods, add a `tracksDataVersion` boolean to the Renderer constructor. Subtemplates set it to true. The single `eval()` method checks it. Less code duplication, same effect.

---

## 4. Reuse Comment Markers as Anchors

**What it is:** Use the `<!--sui-block:N-->` comment directly as the DynamicRegion anchor instead of replacing it with an empty text node.

**Why it matters:** Currently `bindBlockDirective` does `marker.replaceWith(region.anchor)` — creating a new empty text node and discarding the comment. This is one unnecessary DOM operation per block directive, and it removes information that's useful during development (the comment shows which block directive lives at that position).

**The fix:**

```js
createConditional({ node, data, scope, parentNode, marker }) {
  const region = new DynamicRegion(parentNode, null);
  region.anchor = marker; // reuse the comment as anchor
  // marker stays in the DOM — invisible to users, visible in DevTools
  // ...
}
```

`DynamicRegion.setContent` calls `this.anchor.after(fragment)` — this works identically for comment nodes and text nodes. `DynamicRegion.clear` removes `ownedNodes` but keeps the anchor. No behavior change.

**Bonus:** During development, DevTools shows `<!--sui-block:3-->` instead of an anonymous empty text node. You can see exactly where each conditional/each/async region lives in the DOM tree.

---

## 5. Error Boundaries for Expression Evaluation

**What it is:** Meaningful error reporting when an expression throws.

**Currently:** If `{user.profile.name}` throws because `user` is null, the Reaction catches nothing — `lookupExpressionValue` returns undefined, the text node gets empty string. Silently correct behavior, but unhelpful for debugging.

**The fix:** Wrap expression evaluation in a try/catch that surfaces the error with context:

```js
evalSafe(expression, data, context) {
  try {
    return this.evaluator.lookupExpressionValue(expression, data);
  }
  catch (e) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[SUI] Expression error in {${expression}}`,
        context ? `(${context})` : '',
        e,
      );
    }
    return undefined;
  }
}
```

Dev-only — stripped in production builds. The `context` parameter identifies which template and which element the expression belongs to, so the developer can find the source.

---

## 6. buildHTMLString as a Static Method

**What it is:** Make `buildHTMLString` and `analyzePosition` independent of Renderer instances.

**Why it matters:** These are pure functions of the AST. They don't read `this.data`, `this.helpers`, or any instance state. Making them static (or standalone functions) clarifies this and enables direct reuse by the SSR module without instantiating a Renderer.

```js
// Before: called as this.buildHTMLString(ast)
// After: called as Renderer.buildHTMLString(ast) or buildHTMLString(ast)
```

The SSR module imports `buildHTMLString` directly. No Renderer instance needed for the server path. The function takes an AST, returns `{ htmlString, entries }`. Pure in, pure out.

---

## 7. Snippet Registration Timing

**What it is:** Snippets are currently registered during `buildHTMLString` — a side effect in what should be a pure function.

**Why it matters:** `buildHTMLString` writes to `this.snippets[node.name] = node` when it encounters a snippet definition. This is a mutation during what's conceptually a read-only assembly pass. It works because snippets are always defined before they're referenced (the compiler hoists them), but it's architecturally impure.

**The fix:** Return snippets as part of `buildHTMLString`'s output:

```js
buildHTMLString(ast) {
  // ...
  return { htmlString, entries, snippets };
}
```

The caller merges snippets into `this.snippets` before calling `bindMarkers`. `buildHTMLString` stays pure. This also makes the SSR path cleaner — it receives snippets as data, not as a side effect.

---

## 8. DynamicRegion Simplification

**What it is:** `DynamicRegion` currently takes `parentNode` and `referenceNode` constructor parameters that are only used by the old segment-based approach. With the single-pass architecture, every region is created from a block marker comment — the parent and position are implicit.

**The fix:** Simplify the constructor to take just the anchor:

```js
class DynamicRegion {
  constructor(anchor) {
    this.anchor = anchor;
    this.ownedNodes = [];
    this.childScopes = [];
  }

  clear() { ... }
  setContent(fragment, scope) { ... }
  getLastNode() { ... }
}
```

The `placeAnchor()` method is removed — the anchor is the comment marker passed in from `bindBlockDirective`. No lazy creation, no reference node tracking.

---

## Priority Order

If I had one session, I'd do in this order:

1. **Reuse comment markers as anchors** (#4) — simplest change, immediate DevTools benefit, removes unnecessary DOM operations
2. **Remove `__isItemProxy`** (#2) — cleans up the worst abstraction leak
3. **PreparedTemplate caching** (#1) — biggest performance impact
4. **buildHTMLString as static** (#6) + **snippet registration** (#7) — purity, SSR readiness
5. **Selective dataVersion tracking** (#3) — performance refinement for common case
6. **DynamicRegion simplification** (#8) — architectural cleanliness
7. **Error boundaries** (#5) — developer experience

Items 1-4 are about making the code match the architecture's intent. Items 5-8 are polish.

## Status

Ready whenever someone picks it up. Each item is independent — they can be done in any order without conflicts.
