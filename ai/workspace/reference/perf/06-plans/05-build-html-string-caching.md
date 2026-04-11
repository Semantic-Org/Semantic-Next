# Plan: Cache `htmlString` Alongside `entries` on Prototype

## Status
**Obsolete if plan 04 (`data-sui-bind`) lands.** With server-embedded attribute markers, `hydrateAttributes` is eliminated entirely — there is no second `buildHTMLString` call to cache. Keep this plan as a contingency if plan 04 is deferred or descoped.

## Dependencies
None. Standalone fix.

## Problem

`buildHTMLString` is called twice with identical inputs during top-level component hydration:

1. `base.js:153` — produces `entries` (cached on prototype via `_hydrationEntries`). Discards `htmlString`.
2. `renderer.js:1196` inside `hydrateAttributes()` — produces `htmlString` (parsed into reference DOM). Discards `entries`.

Same pure function, same AST input, same snippets. The `htmlString` from call 1 is thrown away, then regenerated from scratch in call 2.

## Solution

Cache both outputs on the prototype:

```js
if (!prototypeTemplate._hydrationEntries) {
  const { entries, htmlString } = this.template.renderer.buildHTMLString(this.template.ast);
  prototypeTemplate._hydrationEntries = entries;
  prototypeTemplate._hydrationHTML = htmlString;
}
```

Thread `htmlString` through to `hydrateAttributes` so it skips the rebuild:

```js
hydrateAttributes(root, entries, data, scope, ast, htmlString) {
  if (!htmlString) {
    htmlString = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets }).htmlString;
  }
  // ... rest unchanged
}
```

Recursive `hydrateInnerContent` calls pass their own sub-AST and don't hit the top-level cache — they fall through to the existing rebuild.

## Estimated Savings
~1-2ms per component type (eliminated on all but the first instance). Compounds for pages with many instances of the same component.

## Memory Cost
One string reference per component type on the prototype. Sub-10KB for typical templates.

## Review Contentions

> **`isSVG` asymmetry.** Call 1 passes `undefined`, call 2 omits it entirely. Both default to `false` and top-level components are never SVG roots, so it's harmless. Worth a code comment explaining this if implemented.

## Complexity
Category 2 — cache one additional output alongside an existing cache, thread it through one call chain.
