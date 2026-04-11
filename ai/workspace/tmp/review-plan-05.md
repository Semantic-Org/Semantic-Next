# Review: Plan 05 - Cache `htmlString` Alongside `entries` on Prototype

## Score: Agree

The plan is sound. The core claim is correct and the proposed implementation is clean. Below is the detailed analysis.

---

## 1. Are the two calls truly identical?

**Yes, for the top-level hydration path.**

Call 1 (`base.js:133`):
```js
const { entries } = this.template.renderer.buildHTMLString(this.template.ast);
```
This calls `buildHTMLStringPure(ast, { snippets: this.snippets, isSVG })` via the instance method wrapper at `renderer.js:134`. The `isSVG` parameter defaults to `this.isSVG` in `readAST`, but here `buildHTMLString` is called directly with only `ast` — the second argument is `undefined`, so `isSVG` is `undefined` (falsy).

Call 2 (`renderer.js:1190`):
```js
const { htmlString } = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets });
```
Here `ast` is the parameter passed from `hydrateMarkers`. At the top level, `hydrateMarkers` is called from `base.js:139` without an `ast` option, so `ast` is `undefined`, and the fallback `this.ast` is used — which is the same AST object.

**AST reference**: Same. Both use `this.template.ast` / `this.ast` (the template's AST is assigned to the renderer's `this.ast` during construction).

**Snippets**: Same. Both use `this.snippets` from the same renderer instance. Snippets are set during renderer construction and not mutated between the two calls.

**isSVG**: Technically different — call 1 passes `undefined` as the second arg to `buildHTMLString(ast, isSVG)` which forwards as `isSVG: undefined`, while call 2 omits `isSVG` entirely. Both are falsy and `buildHTMLString` defaults `isSVG` to `false`. The output is identical. However, there's a minor nit: `buildHTMLString` in `readAST` (line 115) passes `isSVG` from the `readAST` parameter (which defaults to `this.isSVG`). The hydration path calls `buildHTMLString(this.template.ast)` directly, not through `readAST`, so `isSVG` is never passed. This is fine — top-level components are never SVG roots. But the plan should note this assumption.

**Verdict: Inputs are identical. The claim holds.**

---

## 2. Threading `htmlString` through `hydrateMarkers` to `hydrateAttributes`

The current call chain is:

```
base.js:hydrate()
  -> renderer.hydrateMarkers(root, entries, data, scope)
    -> renderer.hydrateAttributes(root, entries, data, scope, ast)
      -> buildHTMLStringPure(ast || this.ast, { snippets })  // <-- redundant call
```

`hydrateMarkers` signature: `hydrateMarkers(root, entries, data, scope, { ast } = {})`
`hydrateAttributes` signature: `hydrateAttributes(root, entries, data, scope, ast)`

The plan proposes adding `htmlString` to `hydrateAttributes`:
```js
hydrateAttributes(root, entries, data, scope, ast, htmlString)
```

This is clean. The parameter is positional and optional — existing internal callers that don't pass it get the fallback behavior. The `hydrateMarkers` call just needs to forward it:

```js
hydrateMarkers(root, entries, data, scope, { ast, htmlString } = {}) {
  // ...
  this.hydrateAttributes(root, entries, data, scope, ast, htmlString);
}
```

And `base.js:hydrate()`:
```js
this.template.renderer.hydrateMarkers(
  this.shadowRoot,
  entries,
  this.template.renderer.data,
  this.template.renderer.scope,
  { htmlString: prototypeTemplate._hydrationHTML },
);
```

This is straightforward — the options bag in `hydrateMarkers` already exists for `ast`, so adding `htmlString` there is natural. The positional arg on `hydrateAttributes` is slightly less elegant but consistent with its existing signature style.

**Verdict: Clean enough. The options bag on `hydrateMarkers` makes this ergonomic.**

---

## 3. Do recursive `hydrateInnerContent` calls use different ASTs?

**Yes, confirmed.**

`hydrateInnerContent` at line 1580-1593:
```js
hydrateInnerContent(ownedNodes, contentAST, data, scope) {
    const { entries } = buildHTMLStringPure(contentAST, { snippets: this.snippets });
    // ...
    this.hydrateMarkers(container, entries, data, scope, { ast: contentAST });
}
```

This passes `contentAST` — which is the inner content AST of a block directive (e.g., the body of an `{#if}` or `{#each}`). This is a sub-tree of the top-level AST, not the same reference. The plan's fallback in `hydrateAttributes` handles this correctly:

```js
if (!htmlString) {
    htmlString = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets }).htmlString;
}
```

Recursive calls won't pass `htmlString`, so they fall through to rebuilding — which is correct because their AST differs.

There's also the snippet/subtemplate hydration path at line 947 which calls `currentInstance.renderer.buildHTMLString(currentInstance.ast)` on a *different renderer instance* entirely, so the top-level cache is irrelevant there.

**Verdict: Claim is correct. Recursive calls use different ASTs and correctly won't hit the cache.**

---

## 4. Could `htmlString` differ between the two calls?

**No, not in the current code.**

The sequence in `hydrate()` is:
1. Clone template, set up data context
2. Call `buildHTMLString(this.template.ast)` -> cache entries (and proposed: cache htmlString)
3. Call `hydrateMarkers(...)` which internally calls `hydrateAttributes(...)` which calls `buildHTMLStringPure(this.ast, ...)`

Between steps 2 and 3, nothing mutates:
- **AST**: Immutable after compilation. The same object reference is used.
- **Snippets**: Set during renderer construction from the compiled template. Not modified during hydration.
- **isSVG**: Both calls use falsy/default `false`.

The only theoretical risk would be if `template.clone()` or `template.initialize()` modified the AST or snippets, but `clone` creates a new Template instance referencing the same AST, and `initialize` runs the `createComponent` callback — it doesn't touch the AST.

**Verdict: No mutation path exists between the two calls. The cached value is safe to reuse.**

---

## Minor observations

1. **The plan correctly marks itself as obsolete if plan 04 lands.** If `data-sui-bind` eliminates `hydrateAttributes` entirely, this caching is unnecessary. Good contingency framing.

2. **Memory cost is negligible.** One string per component *type* (on the prototype), not per instance. The string is the same one that would be generated anyway.

3. **One thing the plan doesn't mention**: the `htmlString` could also be reused by `parseHTML` if the full hydration path were ever to need a reference DOM for other purposes. But that's speculative and not relevant to the current scope.

4. **The `isSVG` asymmetry is harmless but worth a comment.** In `base.js`, `buildHTMLString` is called without `isSVG`. In `hydrateAttributes`, `buildHTMLStringPure` is called without `isSVG`. Both default to `false`. But if someone later adds SVG component support and expects `this.isSVG` to propagate through hydration, they'd need to update both paths. A code comment noting the assumption would be prudent.

---

## Summary

The plan is correct in its analysis and clean in its proposed implementation. The two calls are provably identical, the threading is ergonomic via the existing options bag, recursive calls correctly bypass the cache, and no mutation can occur between the two calls. The only gap is the unmentioned `isSVG` assumption, which is harmless for all current use cases.
