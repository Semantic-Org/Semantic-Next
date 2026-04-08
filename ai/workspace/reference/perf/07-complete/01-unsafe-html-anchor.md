# Plan: Replace unsafeHTML Comment Anchors with Text Node Anchors

## Dependencies
None. This is a standalone fix that can be implemented independently.

## Problem
`unsafeHTML` expressions use comment nodes as anchors for reactive updates. This causes two issues:

1. **Hydration bug (confirmed):** `removeMarkers()` indiscriminately removes all `sui`-prefixed comments after hydration, including `unsafeHTML` anchors. The Reaction's `comment.isConnected` check returns false, the Reaction self-stops, and the expression becomes permanently non-reactive. Verified live at `/perf/unsafe-html` — toggling state after hydration does not update `{#html}` expressions.

2. **DevTools noise (client render):** Comment anchors are visible in DevTools as `<!--sui:v1:N-->` nodes in the shadow root. This applies to client-rendered components where `removeMarkers` never runs.

## Solution
Replace the comment anchor with an empty text node (`document.createTextNode('')`) in both the client render and hydration paths. This is the same pattern already used by normal text expressions at line 447-448 of `renderer.js`.

An empty text node:
- Supports `.after(content)` for inserting sibling nodes
- Supports `.isConnected` for liveness checks
- Is not targeted by `removeMarkers` (which only matches comment nodes)
- Is invisible in DevTools (empty text nodes don't render in the Elements panel)
- Does not merge with adjacent text nodes (DOM API creates, not HTML parser)

## Files to Change

### `packages/renderer/src/engines/native/renderer.js`

**Client render path — `bindTextExpression` (~line 428-444):**
```js
// Before: comment is the anchor
if (exprNode.unsafeHTML) {
  const ownedNodes = [];
  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !comment.isConnected) { ... }
    ...
    comment.after(parsed);
    ...
  }));
}

// After: replace comment with text node anchor
if (exprNode.unsafeHTML) {
  const anchor = document.createTextNode('');
  comment.replaceWith(anchor);
  const ownedNodes = [];
  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !anchor.isConnected) { ... }
    ...
    anchor.after(parsed);
    ...
  }));
}
```

**Hydration path — `hydrateTextExpression` (~line 1354-1377):**
Same transformation. Replace comment with text node anchor before creating the Reaction. The `ownedNodes` collection (lines 1366-1375) should happen before the replacement so sibling scanning still works against the original comment position.

```js
// Before
if (exprNode.unsafeHTML) {
  const ownedNodes = [];
  let next = comment.nextSibling;
  while (...) { ownedNodes.push(next); next = next.nextSibling; }
  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !comment.isConnected) { ... }
    ...
    comment.after(parsed);
    ...
  }));
}

// After
if (exprNode.unsafeHTML) {
  const ownedNodes = [];
  let next = comment.nextSibling;
  while (...) { ownedNodes.push(next); next = next.nextSibling; }
  const anchor = document.createTextNode('');
  comment.replaceWith(anchor);
  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !anchor.isConnected) { ... }
    ...
    anchor.after(parsed);
    ...
  }));
}
```

## Tests

1. **Verify hydration reactivity:** The test page at `docs/src/pages/perf/unsafe-html.astro` already confirms the bug. After the fix, the "reactivity" indicator should show "working" instead of "BROKEN."

2. **Add to `ssr-hydration.test.js`:** A new test case that:
   - SSR-renders a component with `{#html}` expressions
   - Hydrates it
   - Mutates state that the `{#html}` expression depends on
   - Asserts the DOM content updated

3. **Verify client render path:** Switch the test page to `client:only` and confirm anchors are invisible (zero comments in shadow root) and reactivity works.

## Complexity
Category 2 — two surgical edits in the same file, same transformation, pattern already established by adjacent code. Plus one new test case.
