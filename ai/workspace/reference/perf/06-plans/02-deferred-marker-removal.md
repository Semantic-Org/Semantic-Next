# Plan: Defer Marker Removal to Post-Paint

## Dependencies
- **Plan 01 (unsafeHTML text node anchors)** must land first. Without it, the deferred cleanup destroys unsafeHTML anchors during the post-paint window, preserving the existing reactivity bug.

## Problem
`removeMarkers()` runs synchronously after `hydrateMarkers()` inside the rAF hydration callback. It walks the entire shadow root with a TreeWalker, collecting and removing all `sui`-prefixed comment nodes. This costs ~6ms at 1000 items (~26% of hydration time). The work is purely cosmetic — markers are invisible comment nodes inside shadow roots that only matter for DevTools cleanliness.

## Solution
Move `removeMarkers()` from the synchronous hydration path to a deferred post-paint callback. Start with `requestAnimationFrame` (fires before next paint — markers gone by next frame). If profiling shows this eats into frame budget, relax to `idleCallback` from `@semantic-ui/utils` (already wraps `requestIdleCallback` with Safari `setTimeout` fallback).

## Files to Change

### `packages/component/src/engines/native/base.js`

In `hydrate()`, replace the synchronous `removeMarkers()` call:

```js
// Before
this.removeMarkers();

// After
requestAnimationFrame(() => {
  if (this.isConnected) {
    this.removeMarkers();
  }
});
```

The `isConnected` guard handles the edge case where a component is removed from the DOM between hydration and the deferred callback (flagged by fresh-take analysis).

### No other files change

`removeMarkers()` itself is unchanged. The hydration walker (`hydrateMarkers`) is unchanged. Individual handlers still remove their own markers inline as they process them — this deferred pass only catches stragglers.

## Tradeoffs

**What improves:**
- ~6ms removed from synchronous hydration budget per component
- For a page with 50 components, this compounds — all cleanup moves out of the hydration rAF frame

**What the deferred window looks like:**
- Markers are visible in DevTools for ~16ms (one frame) if using rAF
- Markers are inside shadow roots — only visible when actively inspecting a specific component
- No end-user-visible effect (comments don't render, don't affect layout)

**`onRendered` ordering:**
- `onRendered` fires via `setTimeout(fn, 0)` — it may run before the deferred cleanup
- User code in `onRendered` that inspects `shadowRoot.innerHTML` would see stale markers
- Acceptable: `onRendered` is for component logic, not DOM cosmetics

**Fallback path:**
- If rAF proves too eager (eats frame budget), switch to `idleCallback` from `@semantic-ui/utils` (`packages/utils/src/browser.js:53`) which already handles the Safari fallback

## Tests
- Existing test "no hydration comments remain" needs to await the deferred callback (e.g., wait one rAF + tick before asserting)
- The `/perf/unsafe-html` test page already checks for remaining comments — verify it still passes after the deferral

## Review Contentions

> **After plan 01 lands, `removeMarkers()` may become a no-op.** Every marker type is already handler-removed during the hydration walk: text expressions do `comment.remove()`, block directives do `comment.replaceWith(region.anchor)` + `next.remove()`, nested markers are handled recursively. The only surviving type was unsafeHTML anchors — which plan 01 fixes. Verify after plan 01 whether the TreeWalker finds anything to remove. If not, consider removing `removeMarkers()` entirely or converting to a dev-only assertion rather than deferring a no-op.

## Complexity
Category 2 — single line change in `base.js` (swap synchronous call for rAF-wrapped call with guard). Test timing adjustment. May become "delete the call entirely" after plan 01.
