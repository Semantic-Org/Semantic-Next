# Hydration Marker Removal: Analysis and Recommendation

## Problem Statement

After hydration wires reactive bindings, a separate full TreeWalker pass over the shadow root removes all hydration comment markers. At 1000 items this costs ~6ms out of a ~23ms hydration budget (~26%).

## Source Analysis

### What `removeMarkers` does (base.js:195-208)

A standalone TreeWalker over the entire shadow root collecting all comments matching `startsWith('sui')` or `startsWith('/sui')`, then batch-removing them. This is a complete second traversal of the DOM.

### What hydration already removes

Tracing every marker type through `hydrateMarkers` and its callees:

| Marker type | Example | Removed during hydration? | How |
|---|---|---|---|
| COMMENT_MARKER (text expr) | `<!--sui:v1:0-->` | **Yes** | `hydrateTextExpression` calls `comment.remove()` or `comment.replaceWith(textNode)` (renderer.js:1417, 1421) |
| COMMENT_MARKER (unsafeHTML) | `<!--sui:v1:3-->` | **No** — kept as anchor | `hydrateTextExpression` uses comment for `comment.after(parsed)` on reactive updates (renderer.js:1390) |
| BLOCK_MARKER (opening) | `<!--sui-block:v1:2-->` | **Yes** | `hydrateBlockDirective` calls `comment.replaceWith(region.anchor)` (renderer.js:1480) |
| Closing block marker | `<!--/sui-block:v1:2:b0-->` | **Yes** | `hydrateBlockDirective` calls `next.remove()` (renderer.js:1468) |
| RAW_TEXT_MARKER | `<!--sui-rawtext:v1:5-->` | **Not handled** | `hydrateMarkers` walker (renderer.js:1142-1175) does not match `RAW_TEXT_MARKER`. Only the initial-render walker (renderer.js:306) does. |

### Key finding: latent bug with unsafeHTML

`removeMarkers` removes ALL `sui:*` comments indiscriminately, including the comment anchor that `hydrateTextExpression` deliberately preserves for `unsafeHTML` expressions. After removal:

1. The Reaction's `comment.isConnected` check (renderer.js:1378) returns `false`
2. The Reaction self-stops via `comp.stop()` (renderer.js:1379)
3. The `unsafeHTML` expression becomes permanently non-reactive

This is not caught by the test suite because:
- The "no hydration comments remain" test (ssr-hydration.test.js:658) uses `{#if show}<span>{msg}</span>{/if}` — no unsafeHTML
- The unsafeHTML test (ssr-hydration.test.js:458) only checks initial content, not post-hydration reactivity

### Why `removeMarkers` exists as a separate pass

Given the analysis above, it exists for two reasons:

1. **Catch-all safety net**: In case any marker survives hydration (e.g., RAW_TEXT_MARKER comments, or markers from entries that don't match in `hydrateMarkers` due to the `if (!entry) { continue; }` guard at line 1181).
2. **Clean DevTools**: The commit message says "clean DevTools, zero comment noise" (base.js:174). Even a single leftover `<!--sui:v1:...-->` in the inspector is confusing.

The separation is **not** because hydration can't remove markers — it's because hydration was written incrementally and the safety net was added to guarantee cleanliness regardless of which paths were taken. But the blanket removal is now actively harmful for `unsafeHTML`.

## Proposed Solutions Evaluated

### Option A: Defer removeMarkers to rAF/idle callback

**What it saves**: Moves ~6ms off the synchronous hydration path. Total work unchanged.

**Problems**:
- Does not fix the unsafeHTML anchor bug — just delays it.
- Comments are visible in DevTools during the gap (defeats "clean DevTools" goal).
- `requestIdleCallback` has no urgency guarantee. Under load, markers could persist for seconds.
- Adds complexity (lifecycle state where markers may or may not exist).

**Estimated improvement**: 0ms eliminated, ~6ms shifted. Net performance gain for hydration budget: ~6ms (deferred). But total page work is the same.

### Option B: Inline marker removal during hydrateMarkers

**Core insight**: `hydrateMarkers` already visits every comment via its TreeWalker (renderer.js:1142-1175). It currently processes COMMENT_MARKER and BLOCK_MARKER comments and skips everything else. The individual handlers (`hydrateTextExpression`, `hydrateBlockDirective`) already remove or replace their markers as they process them. The only markers that survive are:

1. **RAW_TEXT_MARKER** — not matched by the hydration walker
2. **unsafeHTML COMMENT_MARKER** — deliberately kept as anchor
3. **Orphaned markers** — entries with no match (`if (!entry) { continue; }`)

If we add RAW_TEXT_MARKER handling to the hydration walker (which it should have anyway — it's a functional gap), the only surviving markers are unsafeHTML anchors (which **must** survive) and the rare orphan (which is harmless).

**What it saves**: Eliminates the entire second TreeWalker pass. That's the full ~6ms.

**What it costs**: ~5 lines of code change in the hydration walker.

**Estimated improvement**: ~6ms eliminated (not deferred — the work simply doesn't happen).

## Recommendation: Option B (inline removal) + fix unsafeHTML bug

The implementation is:

1. **Add RAW_TEXT_MARKER to `hydrateMarkers` walker** (renderer.js ~1162). When encountered, collect it for removal. This mirrors how the initial-render path handles it (renderer.js:306-309) but for hydration we just need to remove the comment since `hydrateAttributes` already wired the element via the parallel walk.

2. **Collect orphan markers during the walker pass**. Comments that match `sui*` or `/sui*` but aren't COMMENT_MARKER or BLOCK_MARKER (or are COMMENT_MARKER/BLOCK_MARKER but have no matching entry) get added to a removal list during the same walk. One pass, zero extra work.

3. **Remove `removeMarkers()` call from `hydrate()`** (base.js:175). The second TreeWalker pass is eliminated entirely.

4. **Do NOT remove unsafeHTML comment anchors**. The hydration handlers already leave these in place correctly. By removing the blanket `removeMarkers` call, we fix the latent bug for free.

5. **Update the test** (ssr-hydration.test.js:658). The "no hydration comments remain" test needs to either:
   - Exempt unsafeHTML anchors from the assertion, or
   - Add a companion test that verifies unsafeHTML comments DO remain (since they're functional anchors, not debris)

### Concrete diff sketch

In `hydrateMarkers` (renderer.js), the walker loop at lines 1146-1175 becomes:

```js
const markersToRemove = [];
while ((comment = commentWalker.nextNode())) {
  const text = comment.data;

  if (text.startsWith('/sui-block:')) {
    blockDepth--;
    if (blockDepth === 0) { markersToRemove.push(comment); }
    continue;
  }
  if (blockDepth > 0) {
    if (text.startsWith(BLOCK_MARKER)) { blockDepth++; }
    continue;
  }

  if (text.startsWith(COMMENT_MARKER)) {
    const markerID = parseInt(text.slice(COMMENT_MARKER.length));
    if (!isNaN(markerID)) {
      commentsToProcess.push({ comment, markerID, type: 'expression' });
      // Text expressions remove their own comment during processing.
      // unsafeHTML expressions keep theirs as an anchor — don't touch.
    }
  }
  else if (text.startsWith(BLOCK_MARKER)) {
    const markerID = parseInt(text.slice(BLOCK_MARKER.length));
    if (!isNaN(markerID)) {
      commentsToProcess.push({ comment, markerID, type: 'block' });
      blockDepth++;
      // Block handlers remove their own opening/closing comments.
    }
  }
  else if (text.startsWith(RAW_TEXT_MARKER)) {
    // Raw text markers aren't wired during hydration (attributes handle it).
    // Just schedule removal.
    markersToRemove.push(comment);
  }
}

// ... process entries ...

// Clean up any markers that weren't removed by their handlers
for (const node of markersToRemove) {
  if (node.isConnected) { node.remove(); }
}
```

Note: the closing block markers at depth 0 are added to `markersToRemove` above. But `hydrateBlockDirective` already removes them at line 1468. The `isConnected` guard handles this double-schedule gracefully — if the handler already removed it, the cleanup is a no-op.

### Why this is safe

- Text expression handlers already remove their comments (lines 1417, 1421). No change.
- unsafeHTML handlers deliberately keep their comments. `removeMarkers` was the only thing that broke this — removing it fixes the bug.
- Block handlers already remove both opening and closing markers (lines 1468, 1480). No change.
- RAW_TEXT_MARKER gets explicit cleanup in the same pass. No second walk needed.
- Orphaned entries (no match) are left as-is by the walker — they're inert comments that don't affect functionality. If cosmetic cleanliness is important, they could be added to `markersToRemove` too, but this is a rare edge case.

### Performance summary

| Approach | Sync ms saved | Total ms saved | Fixes unsafeHTML bug | Complexity |
|---|---|---|---|---|
| Defer to rAF | ~6ms (shifted) | 0ms | No (delays it) | Medium |
| Inline removal | **~6ms (eliminated)** | **~6ms** | **Yes** | Low |

**Recommendation: Option B.** It eliminates ~6ms of redundant DOM traversal, fixes a latent reactivity bug with unsafeHTML, and is a smaller diff than the deferral approach.
