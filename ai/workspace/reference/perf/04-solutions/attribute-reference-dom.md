# Eliminating the Reference DOM in hydrateAttributes

## Problem Statement

During hydration, `hydrateAttributes` (renderer.js:1192) rebuilds a second DOM from `buildHTMLString` output to discover which elements have dynamic attribute bindings. This is necessary because the server evaluates attribute expressions inline — replacing `__sui0__` markers with real values like `"dark"` — so the hydrated DOM contains no trace of which attributes were dynamic.

At 1000 items, `hydrateAttributes` costs ~8ms:
- `buildHTMLString(ast)` — pure string assembly (~1ms)
- `template.innerHTML = htmlString` — HTML parsing into reference DOM (~4ms)
- `blockOwnedElements` walk — sibling scan + inner TreeWalker per block element (~1ms)
- Parallel TreeWalker walk — element-by-element matching between reference and real DOM (~2ms)

The `innerHTML` parse and the `blockOwnedElements` bookkeeping are the dominant costs. The actual binding wiring (Reaction creation) is cheap by comparison.

## What the Reference DOM Provides

The reference DOM answers one question: **which element at which tree position has which attribute bindings?**

Specifically, `hydrateAttributes` extracts:
1. **Element identity** — which real DOM element corresponds to which AST position
2. **Attribute name** — the attribute that contains marker(s)
3. **Marker layout within the attribute** — static parts interleaved with marker IDs (e.g., `"base __sui3__"` means the attribute has static `"base "` followed by expression entry 3)
4. **Binding classification** — the entry's `classification.type` (attribute, boolean, property, event) which determines how the Reaction is wired

Items 2-4 are already available from the `entries` array returned by `buildHTMLString`. The entries array knows `entry.classification.type`, `entry.classification.attribute`, and `entry.classification.insideTag`. The only information the reference DOM provides that the entries array does not is **item 1: which real DOM element to bind to**.

The parallel TreeWalker walk (reference element N <-> real element N, skipping block-owned elements) is the mechanism that resolves element identity.

## Why the blockOwnedElements Walk Exists

In the reference DOM, block directives (`{#if}`, `{#each}`, etc.) are single comment nodes. In the real (hydrated) DOM, the server expanded them into actual content — potentially many elements. A naive parallel walk would immediately go out of sync because the real DOM has more elements than the reference DOM.

The solution: before the parallel walk, scan the real DOM for block marker pairs and mark every element between them (and their descendants) as "block-owned." The parallel walker then skips these elements via a `NodeFilter`, keeping the two walkers aligned on the same structural elements.

This is correct but expensive: for each block marker pair, it does a sibling walk to find the closing marker, then for each element inside, a nested TreeWalker to mark all descendants.

## Why hydrateInnerContent Doubles the Work

`hydrateInnerContent` (line 1592) is called for each block directive's content (if branches, each items, etc.). It calls `buildHTMLStringPure(contentAST)` to get the entries array, then calls `hydrateMarkers(container, entries, data, scope, { ast: contentAST })`. Inside `hydrateMarkers`, if any entries are attribute bindings, it calls `hydrateAttributes` which calls `buildHTMLStringPure(contentAST)` **again** — this time to produce the htmlString for the reference DOM.

So for every block with attribute bindings, `buildHTMLString` runs twice on the same AST. And for deeply nested blocks (each containing if, containing snippet), this fans out recursively.

## Proposed Solutions Analysis

### 1. Server-Embedded Attribute Markers (`data-sui-bind="0,2"`)

**Mechanism:** The server adds a `data-sui-bind` attribute to each element that has dynamic attributes. The value encodes which entry IDs are bound and to which attributes.

Example: `<div class="dark" data-sui-bind="class:0">` means entry 0 is bound to the `class` attribute.

**What it eliminates:**
- `buildHTMLString` call in `hydrateAttributes` (the htmlString is never needed)
- `innerHTML` parse of reference DOM
- `blockOwnedElements` walk (no parallel walk needed)
- Parallel TreeWalker (no reference DOM to walk)

**What it costs:**
- Server HTML size increases: each element with a dynamic attribute gets `data-sui-bind="..."`. For a template like `<div class="{theme}" data-count="{count}">`, the server emits `data-sui-bind="class:0,data-count:1"`. Typical overhead: 20-40 bytes per element with dynamic attributes.
- Hydration must parse the `data-sui-bind` value (string split — negligible)
- `data-sui-bind` must be removed after hydration (same as removing comment markers — already done)
- Server renderer (`ServerRenderer.renderExpression`) needs new logic to track which element it's inside and accumulate bind metadata

**Complexity of encoding:**

For single-expression attributes: `attrName:entryID` (e.g., `class:0`)

For multi-expression attributes: `attrName:entryID+entryID` with static parts encoded. But the `entries` array already has the full part layout (static + marker interleaving). The bind attribute only needs to say "entry 3 and entry 5 are on the `class` attribute of this element" — the client reconstructs the part layout from the entries.

For property bindings (`.prop={expr}`) and event bindings (`@click={handler}`): these are stripped from the HTML entirely (marked `REMOVE_ATTR`). The bind attribute needs to encode these too, but they don't survive in the real DOM as attributes. Could use a comment before the element instead, or encode in a different attribute.

Actually, re-examining: property and event bindings are already removed from the server HTML via `REMOVE_ATTR` + regex. During hydration, they still need to be wired. The reference DOM currently has the `__sui0__` marker in the attribute position, which tells the hydrator "entry 0 is a property/event binding on this element." Without the reference DOM, the `data-sui-bind` attribute must encode this.

Encoding: `data-sui-bind="class:0,.prop:1,@click:2"` — prefix with `.` for properties, `@` for events. Clean, unambiguous, and the existing classification logic already distinguishes these types.

**Estimated improvement:** Eliminates ~7ms of the ~8ms cost at 1000 items. The remaining ~1ms is the single-pass element walker to find and process `data-sui-bind` attributes.

**Risk:** Low. The encoding is straightforward. The server already classifies expressions into attribute/property/event positions — this just emits the classification as a string.

### 2. AST-Derived Element Ordinal Index Map (Cached on Prototype)

**Mechanism:** At compile time (or on first hydration), walk the AST and build a map: `entryID -> elementOrdinalIndex`. Cache this on the prototype template since it depends only on AST structure. During hydration, do a single TreeWalker pass over the real DOM (skipping block-owned elements), numbering each element 0, 1, 2, ... Then look up which elements need bindings from the map.

**What it eliminates:**
- `innerHTML` parse of reference DOM
- Reference DOM TreeWalker

**What it does NOT eliminate:**
- `blockOwnedElements` walk (still needed to keep ordinal numbering aligned)
- The fundamental complexity: the AST ordinal is based on the template structure with unexpanded blocks. The real DOM has expanded blocks. Keeping ordinals aligned requires the same skip logic that exists today.

**Estimated improvement:** Eliminates ~4ms (innerHTML parse). Retains ~3ms for blockOwnedElements walk and ordinal-skipping element walk. Net: ~4ms savings.

**Risk:** Medium. The ordinal index is fragile — it assumes the AST walk order exactly matches the TreeWalker element order. Any divergence (SVG namespace, custom element ordering, whitespace-sensitive elements) silently misaligns bindings. The current parallel-walk approach has the same fragility but at least both walkers traverse parsed DOM trees, giving them the same ordering semantics. An AST-derived ordinal introduces a new ordering contract between AST traversal and DOM traversal.

### 3. Unified Comment Marker Stream (Comments Before Elements with Dynamic Attrs)

**Mechanism:** The server emits a comment before each element that has dynamic attributes: `<!--sui-attr:v1:0:class:0,data-count:1-->` followed by the element. The client finds these comments during the existing comment walker pass, then processes the next sibling element.

**What it eliminates:**
- `buildHTMLString` call in `hydrateAttributes`
- `innerHTML` parse of reference DOM
- `blockOwnedElements` walk
- Parallel TreeWalker
- Separate attribute pass (folded into existing comment pass)

**What it costs:**
- One comment node per element with dynamic attributes in the server HTML
- Comments inside block regions are already handled by the depth-tracking logic — attribute comments would need to be recognized and processed at the correct nesting level

**Estimated improvement:** Same as option 1 (~7ms eliminated). Slightly less HTML overhead than data attributes since comments don't appear in the element's attribute list.

**Risk:** Medium. Comments are fragile — browser HTML parsing can move them, and some sanitizers strip them. The block marker scheme already relies on comments surviving the parse intact, so this is an existing risk, but adding more comment types increases exposure. Also, the comment must be the *immediate previous sibling* of the element, which can fail if there's intervening whitespace text nodes.

### 4. Compile-Time Position Encoding Manifest

**Mechanism:** The template compiler produces an `attributeBindings` manifest alongside the AST: `[{ entryID: 0, elementPath: [0, 2, 0], attrName: 'class', parts: [...] }, ...]`. The `elementPath` is the child-index path from the root to the element (e.g., `[0, 2, 0]` means root's child 0, then child 2, then child 0). The client traverses the real DOM using these paths.

**What it eliminates:**
- `buildHTMLString` call in `hydrateAttributes`
- `innerHTML` parse of reference DOM
- `blockOwnedElements` walk
- Parallel TreeWalker

**What it costs:**
- Compiler complexity — the template compiler must track element positions during AST generation
- Path traversal during hydration (N `childNodes[i]` lookups per binding)
- Block-expanded content changes child indices — the manifest path is wrong for content inside blocks. This is the same fundamental problem: the template structure differs from the rendered DOM.

**Estimated improvement:** Theoretically ~7ms eliminated. But the block content problem means paths are only valid for elements outside blocks. For elements inside blocks, the paths must be computed relative to the block content root, which brings back the same recursive sub-AST processing.

**Risk:** High. The impedance mismatch between template structure (blocks as single nodes) and rendered DOM (blocks expanded into content) makes absolute paths unreliable. The approach would need per-block-level relative paths, which is essentially a reimplementation of the current parallel-walk logic with different bookkeeping.

## Recommendation: Option 1 — Server-Embedded `data-sui-bind`

### Rationale

1. **Largest performance gain with lowest risk.** Eliminates ~7 of ~8ms by removing the innerHTML parse, the blockOwnedElements walk, and the parallel TreeWalker entirely. The replacement is a single-pass element walker that checks for `data-sui-bind` attributes.

2. **No structural alignment problem.** Options 2 and 4 must solve the block-expansion alignment problem (template has one node where the DOM has N nodes). Option 1 sidesteps this entirely — the marker is ON the target element. There is no second tree to keep in sync.

3. **Encoding is simple.** The server already classifies every expression into attribute/property/event and knows which attribute name it belongs to (via `analyzePosition`). Emitting this as a string attribute is trivial.

4. **Caches cleanly.** The client can strip `data-sui-bind` after hydration (same pass as removing comment markers). DevTools stay clean.

5. **Eliminates the doubled `buildHTMLString` call.** `hydrateInnerContent` currently calls `buildHTMLString` to get entries, then `hydrateAttributes` calls it again to get the reference DOM. With `data-sui-bind`, `hydrateAttributes` disappears as a concept — attribute binding discovery is folded into a simple element scan.

6. **HTML size cost is acceptable.** A typical dynamic element adds ~25 bytes for `data-sui-bind="class:0"`. At 1000 items with 2 dynamic attributes each, that's ~30KB — less than 2% of a typical page payload. Gzip compresses these repetitive patterns extremely well (likely <5KB after compression).

### Comparison to Option 3 (Comment Markers)

Option 3 is the closest alternative. It eliminates the same operations and has similar HTML overhead. The deciding factor is robustness: `data-sui-bind` is an attribute on the target element itself, which means the client finds the element and the binding metadata in one operation. Comment markers require finding the comment, then navigating to the next element sibling, which can fail with intervening text nodes or be disrupted by HTML normalization. The attribute approach is structurally more reliable.

### Implementation Sketch

**Server (`ServerRenderer.renderExpression`, attribute position):**

When `classification.insideTag` is true, the server currently emits the evaluated value. It would additionally need to accumulate binding metadata for the current element. Since `renderExpression` processes expressions sequentially within a tag, the server can buffer entries until it sees the closing `>` of the current tag, then emit `data-sui-bind="..."` before the `>`.

Alternatively (simpler): track attribute bindings per-element during the `renderNodes` walk. When an `html` node contains a closing `>`, flush any accumulated bindings as a `data-sui-bind` attribute. This mirrors how `analyzePosition` works — tracking tag open/close state via the htmlBuffer.

**Client (`hydrateMarkers`):**

Replace the `hydrateAttributes` call with:

```js
// Single-pass element walk to find data-sui-bind attributes
const attrWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
let el;
while ((el = attrWalker.nextNode())) {
  const bindAttr = el.getAttribute('data-sui-bind');
  if (!bindAttr) continue;
  el.removeAttribute('data-sui-bind');

  // Parse: "class:0,data-count:1,.value:2,@click:3"
  for (const part of bindAttr.split(',')) {
    const [attrSpec, ...ids] = part.split(':');
    // ... wire Reaction using entry from entries[id], same logic as current
  }
}
```

**`hydrateInnerContent` simplification:**

Currently calls `buildHTMLStringPure(contentAST)` to get entries, then passes them to `hydrateMarkers`. With `data-sui-bind`, attribute entries are no longer needed for the inner content — the markers are already on the DOM elements. `hydrateInnerContent` only needs entries for text and block markers, which are found via the existing comment walker pass.

This means `hydrateInnerContent` can either:
- Continue passing the full entries array (comment walker uses entry IDs for text/block markers — unaffected)
- Or skip entries that are `insideTag` since they're now handled by the attribute scan

### Encoding Format

```
data-sui-bind="attrName:entryID[,attrName:entryID]*"
```

Examples:
- Single dynamic attribute: `data-sui-bind="class:0"`
- Multiple: `data-sui-bind="class:0,data-id:2"`
- Multi-expression attribute: `data-sui-bind="class:0+3"` (entries 0 and 3 interleaved in class)
- Property: `data-sui-bind=".value:1"`
- Event: `data-sui-bind="@click:2"`
- Boolean/ifDefined: `data-sui-bind="?disabled:4"` (or just `disabled:4` — classification is already in the entry)

Note: The `?` prefix for boolean isn't strictly necessary since the entry already contains `classification.type === 'boolean'` or `node.ifDefined`. But making the encoding self-describing means the client doesn't need to look up the entry to know how to wire the binding. This helps if we later want to wire bindings without the full entries array (e.g., for streaming hydration).

### What Must Remain Unchanged

- **Text markers** (`<!--sui:v1:N-->`) — unaffected. They remain as comment nodes.
- **Block markers** (`<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->`) — unaffected.
- **Entry ID numbering** — unchanged. The server and client both walk the AST in the same order, assigning sequential IDs. The `data-sui-bind` attribute just references these same IDs.
- **`buildHTMLString` function** — unchanged. It still produces the entries array and htmlString for normal client rendering. Only the hydration path stops building a reference DOM.
- **`bindMarkers` (normal client render)** — unchanged. This path uses the reference DOM (which it already has from parseHTML) and doesn't need `data-sui-bind`.
