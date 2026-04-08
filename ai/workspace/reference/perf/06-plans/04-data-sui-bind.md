# Plan: Server-Embedded `data-sui-bind` to Eliminate Reference DOM

## Dependencies
- **Plan 02 (deferred marker removal)** — the `data-sui-bind` attributes should be stripped in the same deferred cleanup pass as comment markers. The cleanup mechanism must exist before this lands.

## Problem

During hydration, `hydrateAttributes` rebuilds a second DOM from `buildHTMLString` output to discover which elements have dynamic attribute bindings. The server evaluates attribute expressions inline (`class="dark"` not `class="__sui0__"`), so the hydrated DOM contains no trace of which attributes were dynamic. The reference DOM provides that missing information via a parallel TreeWalker walk.

At 1000 items this costs ~8ms:
- `buildHTMLStringPure(ast)`: ~1ms (string concatenation)
- `template.innerHTML = htmlString`: ~4ms (HTML parsing to build reference DOM)
- `blockOwnedElements` walk: ~1ms (sibling + descendant enumeration per block)
- Parallel TreeWalker: ~2ms (element-by-element matching)

Additionally, `buildHTMLString` is called twice during hydration — once for the entries array (cached on prototype) and once inside `hydrateAttributes` for the reference DOM HTML string. Recursive `hydrateInnerContent` calls each build their own reference DOM.

## Solution

The server emits `data-sui-bind` on elements with dynamic attributes. The client reads it directly — no reference DOM, no parallel walk, no block-owned-element discovery.

### Server encoding format

```
data-sui-bind="attrName:entryID[,attrName:entryID]*"
```

Examples:
- Single: `data-sui-bind="class:0"`
- Multiple: `data-sui-bind="class:0,data-id:2"`
- Multi-expression: `data-sui-bind="class:0+3"` (entries 0 and 3 interleaved in class)
- Property: `data-sui-bind=".value:1"`
- Event: `data-sui-bind="@click:2"`
- Boolean: `data-sui-bind="?disabled:4"`

### What it eliminates

| Operation | Current cost (1000 items) | After |
|---|---|---|
| `buildHTMLStringPure` in `hydrateAttributes` | ~1ms | **Eliminated** |
| `template.innerHTML` (reference DOM parse) | ~4ms | **Eliminated** |
| `blockOwnedElements` walk | ~1ms | **Eliminated** |
| Parallel TreeWalker | ~2ms | **Eliminated** |
| Single SHOW_ELEMENT walker + attr read | N/A | ~0.5ms (new) |
| **Net** | **~8ms** | **~0.5ms** |

The doubled `buildHTMLString` calls in recursive `hydrateInnerContent` paths are also eliminated.

### Why not AST-derived ordinal map

The competing approach (element ordinal counting from the AST) was rejected because of the `<tbody>` implicit insertion problem. The browser auto-inserts `<tbody>` during HTML parsing, which the AST doesn't account for. This causes silent binding misalignment on table templates. The `data-sui-bind` approach eliminates the alignment problem entirely — the metadata is on the target element.

## Files to Change

### `packages/renderer/src/engines/native/server.js`

In `renderExpression()`, when `classification.insideTag` is true, accumulate binding metadata for the current element. When the tag closes (next `html` node containing `>`), flush as `data-sui-bind="..."` before the `>`.

The server already classifies every expression via `analyzePosition` — the classification (attribute name, type, entry ID) is known. This adds tracking of accumulated bindings per element and a flush on tag close.

`getItemID` needs to be available to `ServerRenderer` (currently only on the client `Renderer`). Extract to a shared utility or duplicate — the logic is identical.

### `packages/renderer/src/engines/native/renderer.js`

Replace `hydrateAttributes()` with a single-pass element walker:

```js
// Single-pass element walk to find data-sui-bind attributes
const attrWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
let el;
while ((el = attrWalker.nextNode())) {
  const bindAttr = el.getAttribute('data-sui-bind');
  if (!bindAttr) continue;

  // Parse: "class:0,data-id:2,.value:1,@click:3"
  for (const part of bindAttr.split(',')) {
    const [attrSpec, ...ids] = part.split(':');
    // Wire Reaction using entry from entries[id]
    // Same binding logic as current hydrateAttributes per-entry wiring
  }
}
```

The `data-sui-bind` attribute is stripped during the deferred cleanup pass (plan 02).

Remove or simplify:
- `hydrateAttributes()` — replaced by the inline walker above
- `blockOwnedElements` discovery — no longer needed (no parallel walk to keep aligned)
- The second `buildHTMLStringPure` call inside `hydrateAttributes` — eliminated

### `packages/renderer/src/engines/native/renderer.js` — `hydrateInnerContent`

Currently calls `buildHTMLStringPure(contentAST)` to get entries, then calls `hydrateMarkers` which calls `hydrateAttributes` which calls `buildHTMLStringPure` again. With `data-sui-bind`, attribute bindings are on the DOM elements already. `hydrateInnerContent` only needs entries for text and block markers.

### `packages/renderer/src/build-html-string.js`

No changes needed. `buildHTMLString` continues to produce `entries` and `htmlString` for client rendering. Only the hydration path stops building a reference DOM.

## HTML Size Overhead

Per element with dynamic attributes: ~22-52 bytes depending on binding count.
At 1000 items with 2 dynamic attrs each: ~30KB raw, ~2-4KB after gzip (highly repetitive patterns).

The attributes are stripped during the deferred cleanup pass and don't persist in the post-hydration DOM.

## Version Handling

The hydration code already checks `MARKER_VERSION` in comment markers and falls back to full render on mismatch. Same pattern: if `data-sui-bind` is expected but absent (older server HTML), fall back to the current reference DOM path. Clean upgrade, zero risk to cached content.

## Review Contentions

> **Colon ambiguity in encoding.** `xlink:href:3` is unparseable with naive `:` splitting. Use `=` as the separator instead: `data-sui-bind="class=0,xlink:href=3"`. Apply to all examples in this plan.

> **Multi-expression attributes lose static segments.** `class="foo {a} bar {b}"` encodes as `class=0+3`, but the client needs the static `"foo "` and `" bar "` text between the expressions to reconstruct the attribute value. Two options: (a) limit `data-sui-bind` to single-expression attributes (the 90% case) and fall back to the current reference DOM approach for multi-expression attributes, or (b) encode the full attribute template including static segments (e.g., `class=s:foo%20+0+s:%20bar%20+3`). Option (a) is simpler and covers the vast majority of cases. The implementing agent must decide and handle both paths.

> **Binding-wiring logic is ~95 lines, not just discovery.** `hydrateAttributes` is 165 lines total. ~70 lines (block-owned-element exclusion, reference DOM construction) disappear. ~95 lines of binding-wiring logic remain: property bindings (`element[prop] = value`), event bindings (`addEventListener`), single-expression Reactions with boolean/ifDefined handling, multi-expression Reactions with static segment interleaving. All of this must be replicated in the replacement walker. Don't underestimate the scope.

> **Server flush is non-trivial.** The server renderer has no element open/close tracking today. It builds HTML via string concatenation with `scope.htmlBuffer` for position analysis. Injecting `data-sui-bind` before `>` requires detecting tag-close transitions in `html` nodes and splicing the attribute into the output string. This is doable (the position analysis machinery already exists) but requires careful integration, not a 5-line change.

> **Property/event bindings for removed attributes work correctly.** The server strips `.value` and `@click` from the HTML via `REMOVE_ATTR_REGEX`. `data-sui-bind` still encodes them. The client wires them via `element[prop]` and `addEventListener`, neither of which requires a DOM attribute to exist. Confirmed safe.

> **Block-scoped entry IDs.** The server creates fresh scope objects (with `entryId: 0`) for block inner content. `hydrateInnerContent` calls `buildHTMLString` independently for inner ASTs. `data-sui-bind` entry IDs inside blocks are naturally scoped correctly. Explicitly verify during implementation.

> **Stale `getItemID` reference.** The plan mentions `getItemID` needing to be available to ServerRenderer — this is for plan 09 (each hydration), not this plan. Remove from files-to-change.

## Complexity
Category 3 — moderate-high. Server renderer changes (accumulate + flush binding metadata), client renderer changes (replace hydrateAttributes with element walker), cleanup integration. Well-analyzed and the arbitration report confirmed the approach across five dimensions. The fresh-take agent confirmed attribute removal in rAF is safe (sub-microsecond per element, no style recalc when no selector matches, shadow DOM scopes the invalidation check).
