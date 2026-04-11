# buildHTMLString Double-Call During Hydration

## Problem Statement

`buildHTMLString` (a pure function) is called twice with identical inputs during
top-level component hydration. The first call caches `entries` on the prototype
but discards `htmlString`. The second call reconstructs `htmlString` from scratch
to build a reference DOM for attribute position matching.

## Call Trace

### Call 1 — `base.js:153` (inside `hydrate()`)

```js
const { entries } = this.template.renderer.buildHTMLString(this.template.ast);
prototypeTemplate._hydrationEntries = entries;
```

- **Inputs**: `this.template.ast` (via instance method, which passes `this.snippets`, `isSVG=undefined`)
- **Output consumed**: `entries` only — cached on `prototypeTemplate._hydrationEntries`
- **Output discarded**: `htmlString`

### Call 2 — `renderer.js:1196` (inside `hydrateAttributes()`, called from `hydrateMarkers()`)

```js
const { htmlString } = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets });
```

- **Inputs**: `this.ast` (fallback — `ast` param is `undefined` for top-level call), `this.snippets`, no `isSVG`
- **Output consumed**: `htmlString` only — parsed into a reference `<template>` element
- **Output discarded**: `entries` (parameter `entries` comes from the cached `_hydrationEntries`)

### Why `ast || this.ast`?

The `ast` parameter exists for recursive inner-content hydration (`hydrateInnerContent`
at line 1605), which passes a sub-AST (`contentAST`) that differs from the top-level
AST. In the top-level call from `base.js`, no `ast` option is passed, so it falls back
to `this.ast` — which is the same object reference as `this.template.ast` (assigned at
`template.js:268`).

### Other `buildHTMLString` Call Sites (not affected)

| Location | AST | Purpose |
|---|---|---|
| `renderer.js:1593` (`hydrateInnerContent`) | `contentAST` (sub-AST) | Different AST — builds entries for inner block content |
| `renderer.js:946` (subtemplate hydration) | `currentInstance.ast` | Different renderer instance entirely |
| `renderer.js:122` (`readAST`) | varies | Normal render path, not hydration |

These operate on different ASTs or different renderer instances. A top-level cache
would not alias with them and they would not benefit from it.

## Purity Analysis

`buildHTMLString` is a pure function. Its output depends solely on:

1. **`ast`** — Identical object reference in both calls (confirmed via template.js:268)
2. **`snippets`** — Same `this.snippets` map, populated once in constructor via `collectSnippets()`
3. **`isSVG`** — `undefined`/`false` in both calls

No data-dependent values, no side effects, no external state. Given the same
inputs, the output is byte-identical.

## Recommendation: Cache `htmlString` Alongside `entries` on the Prototype

### The Change

In `base.js hydrate()`, cache both outputs:

```js
if (!prototypeTemplate._hydrationEntries) {
  const { entries, htmlString } = this.template.renderer.buildHTMLString(this.template.ast);
  prototypeTemplate._hydrationEntries = entries;
  prototypeTemplate._hydrationHTML = htmlString;
}
```

In `renderer.js hydrateAttributes()`, accept an optional `htmlString` parameter
and skip the rebuild when provided:

```js
hydrateAttributes(root, entries, data, scope, ast, htmlString) {
  if (!htmlString) {
    htmlString = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets }).htmlString;
  }
  // ... rest unchanged
}
```

Thread the cached string through `hydrateMarkers`:

```js
hydrateMarkers(root, entries, data, scope, { ast, htmlString } = {}) {
  // ...
  if (attrEntries.length > 0) {
    this.hydrateAttributes(root, entries, data, scope, ast, htmlString);
  }
}
```

And from `base.js`:

```js
this.template.renderer.hydrateMarkers(
  this.shadowRoot,
  entries,
  this.template.renderer.data,
  this.template.renderer.scope,
  { htmlString: prototypeTemplate._hydrationHTML },
);
```

### Why This Is Safe

1. **Pure function, identical inputs** — proven above. The cached `htmlString` is
   byte-identical to what the second call would produce.

2. **Prototype-level cache is correct** — `_hydrationEntries` is already prototype-cached
   with the same rationale: entries depend on AST structure, not instance data.
   `htmlString` has the same dependency profile.

3. **Recursive calls unaffected** — `hydrateInnerContent` and subtemplate hydration
   pass their own AST, so they never hit the top-level cache. The `htmlString`
   parameter defaults to `undefined`, falling through to the existing rebuild.

4. **Conditional guard preserved** — `hydrateAttributes` is only called when
   `attrEntries.length > 0`. Templates without attribute expressions skip both
   calls today and will continue to.

5. **No test changes required** — the 18 SSR hydration tests cover static HTML,
   text expressions, attribute expressions (including mixed static+dynamic and
   reactivity), conditionals, each loops, snippets, subtemplates, nested blocks,
   async, rerender, guard, slots, unsafe HTML, and environment guards. The change
   is invisible to all of them because it produces the same reference DOM.

### What This Eliminates

Per call (eliminated on all but the first instance of each component type):

- **1 full AST walk** — `processNodes()` iterates every node, running string
  concatenation, regex classification, and entry construction
- **String allocation** — the `htmlString` (often several KB for real components)
  is assembled via repeated `+=` concatenation
- **~1-2ms per component** — consistent with prior profiling measurements stored
  in `globalThis.__hydPerf.buildHTMLTime`

For pages with many instances of the same component (e.g., a list of cards),
the savings compound: N-1 instances skip the rebuild entirely.

### Memory Cost

One additional string reference on the prototype. This is the same `htmlString`
that was already being constructed and immediately discarded. The string is shared
across all instances (prototype-level), so the marginal memory is one string per
component *type*, not per instance. For a typical component template this is
sub-10KB — negligible relative to the DOM it describes.
