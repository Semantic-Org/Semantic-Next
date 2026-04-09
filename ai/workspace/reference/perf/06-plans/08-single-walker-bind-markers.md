# Plan: Unified Single-Pass Walker for bindMarkers

## Dependencies
- **Plan 04 (`data-sui-bind`)** changes the hydration path's attribute discovery. This plan focuses primarily on the client render path (`bindMarkers`), which is independent. The hydration path (`hydrateMarkers`) benefits from the same pattern after plan 04 lands.

## Problem

`bindMarkers` (renderer.js:168) runs on every client render — `fullRender()`, and every dynamic block re-render via `readAST` (each-loop mutations, conditional flips, async resolution, snippet invocations). It does two separate TreeWalker passes over the same DOM fragment:

- **Pass 1** (line 175): `SHOW_ELEMENT` — walks all elements looking for `__sui0__` attribute markers
- **Pass 2** (line 288): `SHOW_COMMENT` — walks all comments looking for text/block/rawtext markers

This is the hot path for reactive updates. In krausest/js-framework-benchmark scenarios (large list creates, swaps, partial updates), `bindMarkers` runs on every list mutation. The two-walk pattern shows up as a significant cost in flame charts — the DOM fragment is traversed twice, and for large fragments (1000-row table), each traversal touches thousands of nodes.

The hydration path (`hydrateMarkers`, line 1132) has the same two-walk pattern plus additional passes (block-owned-element discovery, parallel walker for reference DOM). Plan 04 eliminates the extra hydration passes, but the base two-walk pattern remains.

## Solution

Merge both passes into a single `SHOW_ELEMENT | SHOW_COMMENT` TreeWalker. One walk, both node types handled inline:

```js
bindMarkers(root, entries, data, scope, ast) {
  if (entries.length === 0) { return; }

  const attrMarkerRegex = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');
  const processedAttrIDs = new Set();
  const commentsToProcess = [];

  // Single pass: elements + comments
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Attribute marker processing (existing Pass 1 logic)
      const element = node;
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.value.includes(ATTR_MARKER_PREFIX)) {
          // ... existing attribute binding logic ...
        }
      }
    }
    else if (node.nodeType === Node.COMMENT_NODE) {
      // Comment marker processing (existing Pass 2 logic)
      const text = node.data;
      if (text.startsWith(COMMENT_MARKER)) {
        const markerID = parseInt(text.slice(COMMENT_MARKER.length));
        if (!isNaN(markerID) && !processedAttrIDs.has(markerID)) {
          commentsToProcess.push({ comment: node, markerID, type: 'expression' });
        }
      }
      else if (text.startsWith(RAW_TEXT_MARKER)) {
        // ... existing rawtext logic ...
      }
    }
  }

  // Process collected comments (same as current)
  for (const { comment, markerID, type } of commentsToProcess) {
    // ... existing dispatch to bindTextExpression, bindBlockDirective ...
  }
}
```

### Why comments are collected, not processed inline

Comment processing (text expressions, block directives) can mutate the DOM — `comment.replaceWith(textNode)`, `comment.remove()`, DynamicRegion insertion. These mutations could interfere with the live TreeWalker if done during iteration. The current code already collects comments into `commentsToProcess` and processes them after the walk (line 288-340). This pattern is preserved.

Element attribute processing doesn't mutate the tree structure (it modifies attributes on existing elements), so it's safe to process inline during the walk.

### Hydration path

`hydrateMarkers` (line 1132) can adopt the same pattern. After plan 04 lands (`data-sui-bind` eliminates the reference DOM), the hydration attribute discovery is already a single element walk checking for `data-sui-bind`. Merging that with the comment walk gives one pass for hydration too.

## Files to Change

| File | Change |
|------|--------|
| `packages/renderer/src/engines/native/renderer.js` | `bindMarkers`: merge Pass 1 (element walker) and Pass 2 (comment walker) into single `SHOW_ELEMENT \| SHOW_COMMENT` walker |
| `packages/renderer/src/engines/native/renderer.js` | `hydrateMarkers`: same merge (after plan 04 lands) |

## Expected Impact

The primary benefit is halving the TreeWalker traversal cost on every client render:

- **1000-row table create:** one walk of ~8000 nodes instead of two walks of ~8000 nodes each
- **Each-loop partial update:** one walk of the re-rendered fragment instead of two
- **Conditional flip:** one walk of the branch content instead of two

The per-node cost of `walker.nextNode()` + a `nodeType` check is cheaper than two separate walker constructions + two full traversals. The savings scale linearly with fragment size.

For hydration (secondary): same improvement, plus the attribute handling folds into the same walk (after plan 04).

## Risks

- **`SHOW_ELEMENT | SHOW_COMMENT` filter behavior:** Verify that the combined filter correctly visits both node types in document order. This is standard DOM behavior but should be confirmed with a test on fragments containing interleaved elements and comments.
- **Block depth tracking in hydration path:** The hydration comment walker tracks `blockDepth` to process only top-level markers. This logic carries over unchanged — it's driven by comment content, not walker filter type.
- **`processedAttrIDs` set:** Currently used to prevent the comment walker from processing entries already handled by the element walker. With a single walk, the element processing happens first (elements precede their child comments in document order for attribute markers). The set is still needed for the same reason — some entry IDs are attribute bindings, not text bindings.

## Review Contentions

> **Early termination opportunity.** The walker traverses the entire DOM fragment even after all entries have been processed. Add a counter that tracks how many entries remain unprocessed. When it hits zero, break the walk. This avoids traversing trailing static DOM nodes (which can be the majority of the tree for templates with a few dynamic bindings in a large static structure).

> **Hydration path `blockDepth` tracking.** The client render path (`bindMarkers`) does not track block depth — it processes all markers at all depths because the DOM fragment is freshly created with all markers in place. The hydration path (`hydrateMarkers`) tracks `blockDepth` because it must only process top-level markers (inner markers are handled recursively by block handlers). Merging the hydration walker into the same single-pass pattern requires interleaving block-depth tracking with element processing. This is not a trivial merge — the implementing agent must handle the hydration path separately from the client render path, or design the depth tracking to be opt-in based on context.

## Complexity
Category 2-3. Single file, mechanical merge of two walker loops into one. The logic within each branch is unchanged — just the iteration structure changes. Needs thorough testing against the existing `bindMarkers` test suite and the krausest benchmark to validate the improvement.
