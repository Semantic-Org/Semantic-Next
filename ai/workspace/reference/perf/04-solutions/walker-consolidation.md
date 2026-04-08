# Walker Consolidation Analysis

## Current Pass Inventory

The hydration path executes the following DOM traversals inside `hydrateMarkers()` and its caller `WebComponentBase.hydrate()`:

### Pass 0: Version check (`canHydrate`)
- **Filter:** `SHOW_COMMENT`
- **Scope:** `shadowRoot`
- **Purpose:** Walk comments looking for any versioned marker (`sui:v1:` or `sui-block:v1:`) to confirm the server HTML was produced by a compatible renderer version. Returns on first match.
- **Cost:** Typically visits 1-3 nodes (first comment found). Negligible.

### Pass 1: Block-owned element discovery
- **Filter:** `SHOW_COMMENT` (outer), then `SHOW_ELEMENT` (inner per block)
- **Scope:** `root` (shadowRoot or fragment during recursive hydration)
- **Code:** Lines 1209-1229 of `renderer.js`
- **Purpose:** Build a `Set<Element>` of all elements that live inside block regions (between `<!--sui-block:v1:N-->` and `<!--/sui-block:v1:N-->`). These must be skipped during the parallel element walk (Pass 2) because block directives expand to N elements in the real DOM but are a single comment in the reference DOM.
- **Data produced:** `blockOwnedElements: Set<Element>`
- **Cost:** Full comment walk of `root`, plus for every block-owned element, an inner `SHOW_ELEMENT` walker that marks all descendants. This is the most expensive discovery pass for templates with many blocks or deep nesting.

### Pass 2: Parallel element walk for attributes
- **Filter:** `SHOW_ELEMENT` x2 (reference DOM + real DOM)
- **Scope:** Reference DOM (freshly parsed from `buildHTMLString`), real DOM (`root` with filter skipping `blockOwnedElements`)
- **Code:** Lines 1232-1358
- **Purpose:** Walk the reference DOM's elements in parallel with the real DOM's elements. The reference DOM contains `__sui0__`-style attribute markers that identify which attributes are dynamic. The real DOM has the server-rendered attribute values. For each marker found on a reference element, wire a `Reaction` on the corresponding real element.
- **Data consumed:** `blockOwnedElements` (from Pass 1), `entries`, `htmlString` (from `buildHTMLString`)
- **Data produced:** Reactive attribute bindings (Reactions wired to real elements)
- **Cost:** One `buildHTMLString` call (string assembly from AST, ~fast), one `template.innerHTML` parse of that string into a reference DOM (the expensive part), then a parallel walk of both trees. The reference DOM parse is the single largest cost in this pass.

### Pass 3: Comment walk for text and block markers
- **Filter:** `SHOW_COMMENT`
- **Scope:** `root`
- **Code:** Lines 1142-1189
- **Purpose:** Find `<!--sui:v1:N-->` (text expression) and `<!--sui-block:v1:N-->` (block directive) comments. Tracks `blockDepth` to process only top-level markers -- inner markers are handled recursively by block handlers (`hydrateInnerContent`). For each marker, dispatches to `hydrateTextExpression` or `hydrateBlockDirective`.
- **Data consumed:** `entries`
- **Data produced:** Reactive text bindings (text nodes replace comments), DynamicRegions for blocks
- **Note:** `hydrateBlockDirective` itself does a sibling walk (not a TreeWalker) to collect owned nodes between the opening and closing block markers. This is O(siblings), not a full tree walk.

### Pass 4: Marker removal
- **Filter:** `SHOW_COMMENT`
- **Scope:** `shadowRoot`
- **Code:** Lines 196-208 of `base.js`
- **Purpose:** Remove all remaining comment nodes that start with `sui` or `/sui`. Ensures clean DevTools and zero comment noise.
- **Data consumed:** None (operates purely on comment node text)
- **Test constraint:** The test "no hydration comments remain in shadow DOM" (line 658 of `ssr-hydration.test.js`) explicitly asserts zero comment nodes remain after hydration.

## Data Dependency Graph

```
canHydrate (Pass 0)
    |
    v
buildHTMLString(AST) --> { htmlString, entries }
    |                          |
    v                          |
Pass 1: blockOwnedElements     |
    |                          |
    v                          v
Pass 2: parallel walk   <-- entries, htmlString, blockOwnedElements
    |
    v
Pass 3: comment walk    <-- entries
    |
    v
Pass 4: remove markers  (standalone, no data deps)
```

Key observations:
- Pass 0 is trivially cheap and independent. Not worth merging.
- Pass 1 MUST complete before Pass 2 starts (Pass 2's `realWalker` filter depends on `blockOwnedElements`).
- Pass 2 and Pass 3 are independent of each other -- they could run in either order. Pass 2 reads elements, Pass 3 reads comments. They don't share data.
- Pass 4 depends on Passes 2 and 3 completing (comments used as markers/anchors in Pass 3 must be processed before removal).
- Each recursive call to `hydrateInnerContent` triggers a fresh `hydrateMarkers` call on the block's owned nodes, repeating Passes 1-3 on a sub-scope.

## Analysis of Proposed Solutions

### Option A: Fused single-pass walker (SHOW_ALL)

**Concept:** Replace Passes 1, 2, 3 with a single `SHOW_ALL` TreeWalker that processes elements (for attributes) and comments (for text/blocks) in document order, using block-depth tracking to identify owned elements inline.

**Why it doesn't work as stated:** The fundamental problem is that Pass 2 requires a *reference DOM* -- a separately-parsed DOM tree with attribute markers intact. The real DOM has server-rendered attribute values (e.g., `class="primary large button"`), not markers (e.g., `class="__sui0__button"`). A single-pass walker over the real DOM cannot discover which attributes are dynamic without the reference DOM or an alternative mapping.

A SHOW_ALL walker could merge Passes 1 and 3 (both read comments in the real DOM), but Pass 2 inherently operates on two separate DOM trees.

**What a fused pass would look like:** A `SHOW_COMMENT` walker that combines:
- Block-owned element discovery (building the Set)
- Text/block marker processing (dispatching to handlers)
- Marker removal (removing processed comments in-place)

This eliminates 2 of the 3 comment walks. But it **cannot** eliminate the reference DOM or the parallel element walk.

**Estimated savings:** Eliminates ~2 comment tree traversals. For a typical component with 50-100 DOM nodes and 10-20 comments, each traversal is ~0.01-0.05ms. Total: ~0.02-0.1ms saved. Modest.

### Option B: AST-derived element ordinal map (eliminate reference DOM)

**Concept:** Instead of building a reference DOM and walking it in parallel with the real DOM, derive an ordinal map from the AST that says "the Nth element in the real DOM (excluding block-owned elements) has dynamic attributes X, Y, Z with marker IDs A, B, C."

**Why it exists in its current form:** The reference DOM approach was chosen because it's *correct by construction*. The browser's HTML parser resolves the same tokenization edge cases (self-closing tags, void elements, attribute quoting, SVG namespace) as the server. Any AST-based ordinal computation would need to replicate those parser behaviors exactly, which is fragile.

**What the AST can provide:** The `entries` array already classifies every expression as text-position or attribute-position (via `analyzePosition`). It knows the marker ID, the attribute name, and the binding type. What it doesn't naturally provide is *which element* each attribute binding belongs to -- that mapping currently comes from the parallel walk.

**Building the map:** During `buildHTMLString`, we could track an element counter that increments on each opening tag and record which element ordinal each attribute entry belongs to. This would give us:

```js
entries[3] = { id: 3, type: 'expression', classification: { type: 'attribute', attribute: 'class' }, elementOrdinal: 7 }
```

Then during hydration, a single `SHOW_ELEMENT` walk over the real DOM (with block-owned filtering) would index elements by ordinal, and we'd look up entries by ordinal instead of walking a reference DOM.

**Risks:**
1. The ordinal must account for elements inside blocks (which are absent from the real DOM's top-level walk). Since `buildHTMLString` processes blocks as single entries (comments), not expanded elements, the ordinals naturally exclude block-interior elements -- this aligns correctly.
2. SVG namespace elements and raw text elements must increment the ordinal counter correctly.
3. The ordinal must be stable across server render -> client hydration. Since both use the same AST and the same `buildHTMLString`, this should hold.

**Estimated savings:** Eliminates the reference `template.innerHTML` parse (~0.1-0.5ms depending on template size) and one `SHOW_ELEMENT` walk. The innerHTML parse is the dominant cost in Pass 2. For a component with 200 elements and 30 attribute bindings, this could save 0.2-0.8ms -- meaningful for complex components.

### Option C: Merge comment walk with marker removal

**Concept:** Instead of a separate Pass 4, remove comment markers as they're processed in Pass 3. For text markers, `hydrateTextExpression` already calls `comment.remove()` (line 1417). For block markers, `hydrateBlockDirective` calls `comment.replaceWith(region.anchor)` (line 1480). The closing block marker is also removed (line 1469).

**Current state:** Looking closely at the code, Pass 3 already removes or replaces most comments:
- Text expression comments: removed at line 1417 (`comment.remove()`) or replaced at line 1421 (`comment.replaceWith(textNode)`)
- Block opening comments: replaced with anchor text nodes at line 1480
- Block closing comments: removed at line 1469

The remaining comments after Pass 3 are:
- Comments inside block-owned regions that weren't yet processed (they get processed recursively via `hydrateInnerContent`)
- The `canHydrate` walk (Pass 0) doesn't remove anything
- Any stray comments not matching known marker prefixes (unlikely but defensive)

So Pass 4 (`removeMarkers` in base.js) is a **safety net** that catches any markers not consumed by the recursive hydration. In practice, after a correct hydration, it should find very few or zero remaining markers.

**Estimated savings:** If hydration is correct, this pass walks the tree but finds nothing to remove. Cost: ~0.01-0.03ms. Eliminating it saves nearly nothing but removes a safety guarantee.

**Risk:** If any code path fails to remove its markers (bug in a new block type, edge case in recursive hydration), the safety net catches it. Removing it means bugs become user-visible (comment nodes in DevTools).

## Recommendation

**Implement Option B (AST-derived element ordinal map) as the primary optimization. Keep Pass 4 as-is. Skip Option A and Option C.**

### Rationale

1. **Option B targets the dominant cost.** The reference DOM construction (`template.innerHTML` + `cloneNode`) is by far the most expensive operation in the attribute hydration pass. Profiling data from the existing `__hydPerf.buildHTMLTime` instrumentation confirms this. Eliminating it removes one full HTML parse per hydration scope (including recursive inner content hydration calls, which each build their own reference DOM).

2. **Option B is structurally sound.** The `buildHTMLString` function already walks the AST in document order and tracks element vs. text position (`analyzePosition`). Adding an element ordinal counter to entries requires ~15 lines of code in `buildHTMLString` and ~20 lines to replace the parallel walker in `hydrateAttributes`.

3. **Option A provides marginal gains for significant complexity.** Merging comment walks saves ~0.05ms total. A `SHOW_ALL` walker that handles both elements and comments requires careful interleaving logic with block-depth tracking, and still cannot eliminate the reference DOM. The code complexity increase is not justified.

4. **Option C removes a useful safety net for negligible savings.** Pass 4 costs ~0.02ms and catches real bugs. The test "no hydration comments remain" directly validates this contract.

### Implementation Sketch

**In `buildHTMLString` (build-html-string.js):**

```js
// Add to state tracked during processNodes
let elementOrdinal = 0;

case 'html': {
  // Count opening tags in the html fragment to advance ordinal
  const openTags = (node.html.match(/<[a-zA-Z][^/>]*(?:>|$)/g) || []);
  // Exclude self-closing/void elements from count
  // ... (details depend on exact void element handling)
  elementOrdinal += openTags.length;
  // ...existing logic
  break;
}

case 'expression': {
  if (classification.insideTag) {
    entries.push({ ..., elementOrdinal: elementOrdinal - 1 }); // -1 because ordinal advanced past the opening tag
  }
  // ...existing logic
}
```

Actually, the cleaner approach: since `analyzePosition` already looks at the HTML buffer to determine if we're inside a tag, we can count `<tag` opens (minus self-closing ends) in the buffer to get the current element ordinal. This is computed once per attribute entry during `buildHTMLString` -- no per-node cost.

**In `hydrateAttributes` (renderer.js):**

Replace:
- `buildHTMLString` + `template.innerHTML` + reference DOM construction
- `blockOwnedElements` discovery (Pass 1) + parallel walker (Pass 2)

With:
- Single `SHOW_ELEMENT` walker over real DOM with block-owned filtering
- Index elements into an array by ordinal
- For each attribute entry, look up the real element by `entry.elementOrdinal`

The `blockOwnedElements` set is still needed for filtering, but the reference DOM parse is eliminated entirely.

### Expected Impact

| Component complexity | Current cost (est.) | After Option B (est.) | Savings |
|---|---|---|---|
| Simple (20 elements, 5 attrs) | ~0.3ms | ~0.15ms | ~0.15ms |
| Medium (100 elements, 20 attrs) | ~0.8ms | ~0.35ms | ~0.45ms |
| Complex (300 elements, 50 attrs) | ~2.0ms | ~0.7ms | ~1.3ms |

The savings compound for templates with nested blocks, since each `hydrateInnerContent` call currently builds its own reference DOM. With ordinals baked into entries, inner content hydration skips the reference DOM entirely.

### Remaining Concern

The element ordinal approach requires that the AST-derived ordinal exactly matches the browser's element enumeration order. This is guaranteed when:
1. The AST is produced by the same compiler that generated the server HTML
2. Block-owned elements are correctly excluded from the ordinal sequence (they are, because `buildHTMLString` emits blocks as single comment markers, not expanded elements)
3. SVG elements count correctly (they do, since they're regular elements in the tree)

The only fragility is void/self-closing element handling in the ordinal counter. The `html` node content may contain `<br>`, `<img>`, `<input>` etc. which are elements but don't have closing tags. The counter must match how `TreeWalker(SHOW_ELEMENT)` enumerates them -- which it does, since void elements are still elements in the DOM. The counter should increment for every `<tag` that is not a closing tag (`</tag`), regardless of whether it self-closes.
