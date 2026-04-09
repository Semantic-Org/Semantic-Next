# Review: Plan 08 — Single Walker for bindMarkers

**Score: Agree**

The plan is sound and the implementation approach is correct. The merge is mechanical, the risks are identified, and the expected performance improvement is real. One nuance on attribute mutations during the walk deserves a note, but it does not block the approach.

---

## Question 1: Does `SHOW_ELEMENT | SHOW_COMMENT` work correctly?

**Yes.** `NodeFilter.SHOW_ELEMENT` is `0x1` and `NodeFilter.SHOW_COMMENT` is `0x80`. The bitwise OR (`0x81`) is the documented way to create a combined filter per the DOM spec (https://dom.spec.whatwg.org/#interface-nodefilter). The walker visits every matching node in document order, interleaving elements and comments naturally. This is not an exotic usage — it is the designed API.

## Question 2: Are element mutations during the walk safe?

**Mostly yes, with one subtlety the plan should note.**

The element processing code does two things synchronously during the walk:

1. `element.removeAttribute(attrName)` — for `property` and `event` bindings (lines 219, 232). This modifies the element's attribute list but does not affect the DOM tree structure. TreeWalker tracks its position via parent/sibling/child node references, not attribute state, so `removeAttribute` is safe.

2. `element.setAttribute(attrName, value)` / `element.removeAttribute(attrName)` — inside Reaction callbacks (lines 249-261). These are *deferred* — `Reaction.create()` runs synchronously on first creation (it's a `firstRun`), so these do execute during the walk. However, they modify attributes on the current element, not the tree structure, so the walker is unaffected.

The existing code already collects `attrsToProcess` into a snapshot array before iterating (lines 179-185), specifically because `removeAttribute` on a `property`/`event` binding would mutate the live `element.attributes` NamedNodeMap mid-iteration. This is already correctly handled and carries over unchanged to the merged walker.

**No tree structure mutations occur during element processing.** The `removeAttribute` calls affect the current element's attributes only. The walker is safe.

## Question 3: Are comments collected and processed after the walk?

**Yes, this is the current pattern and it is preserved correctly.**

Looking at the actual code:

- **Pass 2** (lines 288-311): All comments are collected into `commentsToProcess` during the walk.
- **Post-walk** (lines 313-325): Collected comments are iterated and dispatched to `bindTextExpression`, `bindRawTextContent`, or `bindBlockDirective`.

The comment processing methods do mutate the tree:
- `bindTextExpression` (line 449): `parent.replaceChild(textNode, comment)` — replaces the comment with a text node.
- `bindTextExpression` unsafeHTML path (line 442): `comment.after(parsed)` — inserts nodes after the comment (comment itself is kept as an anchor).
- `bindRawTextContent` (line 347): `comment.remove()` — removes the comment entirely.
- `bindBlockDirective` -> `createConditional` (line 508): `marker.replaceWith(region.anchor)` — replaces the comment with a text node anchor.

**No comments are processed inline during the walk.** All are deferred. The plan correctly preserves this pattern.

## Question 4: Does document order guarantee `processedAttrIDs` is populated before comments?

**Yes, for the cases where it matters, but the concern is slightly moot.**

In document order, a TreeWalker visits a parent element before its descendant nodes. So if element E has an attribute marker `__sui5__` and a descendant comment `<!--sui:5-->`, the element is visited first, `processedAttrIDs.add(5)` fires, and when the comment is later reached, the check `!processedAttrIDs.has(5)` correctly skips it.

However, the more important observation: **this scenario should not occur in practice.** An entry is either an attribute expression (generates an attribute marker on an element) or a text expression (generates a comment marker). The same marker ID should not appear as both an attribute marker and a comment marker in the same template. The `processedAttrIDs` check is defensive — it guards against accidental double-processing if an attribute marker's ID somehow matches a comment marker's ID.

For the defensive case, document order provides the right guarantee: elements are always visited before their descendant comments. The only theoretical gap would be a comment that is a *preceding sibling* of an element, but that would mean the comment and element are at the same level and the comment references an attribute marker on a later sibling — a scenario that does not arise from the template compiler's output.

**Verdict: safe.**

## Question 5: Performance implications of combined vs. single-type filters

**The combined filter is not slower — and may be marginally faster in total.**

TreeWalker is implemented natively in C++ in all major browser engines. The `whatToShow` bitmask is checked via a single bitwise AND operation per node visited internally:

```cpp
// Simplified from Chromium's TreeWalker implementation
if (node->nodeType() & whatToShow) { /* accept */ }
```

The cost of `nodeType & 0x81` vs `nodeType & 0x1` is identical — it's one CPU instruction either way. There is no optimization path for single-type filters vs combined filters; the bitmask check is the same code path.

The real performance gain comes from:
1. **One walker construction instead of two** — `document.createTreeWalker()` has allocation and initialization overhead.
2. **One traversal of the DOM tree instead of two** — the internal node-stepping logic (walking the tree via firstChild/nextSibling/parentNode) runs once instead of twice.
3. **Better cache locality** — the DOM nodes are visited once while they're hot in CPU cache, rather than traversed, evicted, then traversed again.

For a 1000-row table with ~8000 nodes, eliminating the second traversal should save measurably. The added per-node `nodeType` branch in JavaScript is a trivial cost compared to the eliminated full-tree walk.

---

## Minor Suggestions

1. **Early termination.** The plan does not mention it, but if all entries have been processed (both attribute and comment markers accounted for), the walk can break early. This could be added as a follow-up optimization — track a counter and bail when `processedAttrIDs.size + commentsToProcess.length >= entries.length`.

2. **Attribute snapshot collection.** The current code's `attrsToProcess` array (lines 179-185) is important for correctness because `removeAttribute` mutates the live `NamedNodeMap`. The plan's pseudocode includes this pattern but make sure the actual implementation preserves it — it's easy to accidentally inline the attribute iteration.

3. **Hydration path complexity.** The plan mentions merging the hydration walker too. Note that `hydrateMarkers` has `blockDepth` tracking (lines 1142-1157) which adds complexity to a combined walker — elements inside block regions need to be skipped for hydration but not for client rendering. This is tractable but should be treated as a separate change after Plan 04 lands, as the plan already suggests.

---

## Summary

The plan correctly identifies that two TreeWalker passes over the same DOM fragment is redundant work on a hot path. The proposed `SHOW_ELEMENT | SHOW_COMMENT` combined filter is the standard DOM API for this, the attribute-only mutations are safe during iteration, comments are already deferred correctly, and document order provides the right guarantees for `processedAttrIDs`. The implementation is mechanical — the two loop bodies are pasted into a single `nodeType` branch with no logic changes.

Category 2 complexity is right. This is a clean win.
