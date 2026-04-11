# Review: Plan 01 — Replace unsafeHTML Comment Anchors with Text Node Anchors

**Score: Strongly Agree**

## Summary

This plan is correct, well-scoped, and the proposed approach is the obvious right fix. It follows an established pattern already used throughout the same file.

## Detailed Evaluation

### 1. Will the proposed changes work mechanically?

Yes. The plan proposes the exact same transformation that block directives already perform successfully in both client render and hydration paths:

- **Client render** (lines 507-508): `region.anchor = document.createTextNode(''); marker.replaceWith(region.anchor);`
- **Hydration** (lines 1467-1468): `region.anchor = document.createTextNode(''); comment.replaceWith(region.anchor);`

This pattern has been battle-tested across conditionals, each loops, subtemplates, and every other block directive. The unsafeHTML expression is the only code path that was missed.

The `comment.after(parsed)` call works identically on text nodes — `Node.after()` inserts siblings regardless of the target node type. `parseHTML` returns a `DocumentFragment`, whose children get inserted as siblings. No behavioral change.

### 2. Does replacing a comment node with an empty text node have any DOM behavior differences that matter?

No meaningful differences for this use case:

- **`.after()`** — works identically on Comment and Text nodes (both inherit from `CharacterData` -> `Node`; `.after()` is defined on `ChildNode` mixin which both implement).
- **`.isConnected`** — works identically on both.
- **Sibling traversal** (`nextSibling`) — works identically on both.
- **Empty text node visibility** — empty text nodes (`data === ''`) are invisible in DevTools Elements panel (actually an improvement).
- **Text node merging** — the plan correctly notes this is not a risk. The DOM API `createTextNode('')` creates a distinct node. Merging only happens during HTML parsing or explicit `normalize()` calls. No code in this codebase calls `normalize()`.
- **CSS layout** — empty text nodes do not generate text runs or affect layout. A comment node also does not affect layout. No change.

### 3. Is the ordering of operations correct?

Yes. The plan explicitly calls out the critical ordering for the hydration path:

1. Collect `ownedNodes` by walking `comment.nextSibling` chain — **BEFORE** replacement
2. Replace comment with text node anchor — **AFTER** collection
3. Create Reaction referencing anchor — **AFTER** replacement

This is correct because:
- The sibling walk (step 1) needs the comment in its original position to find the server-rendered content nodes.
- The Reaction (step 3) must reference the anchor (text node), not the comment, because `removeMarkers` will disconnect the comment.

The client render path has no ordering concern since `ownedNodes` starts empty.

### 4. Are there other call sites that reference the comment anchor that would need updating?

No. I verified all uses of `comment` within the `unsafeHTML` branches:

**Client render path (lines 429-445):**
- `comment.isConnected` (line 432) — must change to `anchor.isConnected`
- `comment.after(parsed)` (line 442) — must change to `anchor.after(parsed)`

**Hydration path (lines 1357-1386):**
- `comment.nextSibling` (line 1360) — must stay as `comment` (runs before replacement)
- `comment.isConnected` (line 1371) — must change to `anchor.isConnected`
- `comment.after(parsed)` (line 1383) — must change to `anchor.after(parsed)`

The plan's pseudocode correctly handles all of these. There are no other references to these specific comment variables outside these two branches.

### Edge Cases

The plan does not miss any edge cases. I checked:

- **Null/empty values**: The existing guard `if (value != null && value !== '')` is preserved. When the value is empty, no nodes are inserted and `ownedNodes` stays empty. The anchor just sits there as an empty text node. Same behavior as before.
- **Multiple unsafeHTML expressions in one template**: Each gets its own anchor — independent, no interference.
- **SVG context**: `unsafeHTML` inside SVG would still work because `anchor.after()` inserts into the same parent regardless of namespace.
- **Component disconnection**: `anchor.isConnected` correctly detects disconnection, same as `comment.isConnected` did (when it worked).

### Minor Observations

- The plan uses `comment.replaceWith(anchor)` while the adjacent normal-text-expression code (line 449) uses `parent.replaceChild(textNode, comment)`. Both are equivalent. Using `replaceWith` is consistent with how block directives do it. Either works; no issue here.
- The plan correctly identifies this as Category 2 complexity. It is a mechanical transformation with zero ambiguity.

## Verdict

Ship it as written. The plan is precise, the approach is proven by existing code, and the ordering is explicitly correct. No alternative approach needed.
