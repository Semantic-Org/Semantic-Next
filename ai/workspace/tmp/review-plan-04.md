# Review: Plan 04 — Server-Embedded `data-sui-bind`

**Score: Agree**

The core idea is sound and well-motivated. Eliminating the reference DOM and parallel TreeWalker by having the server embed binding metadata directly on elements is architecturally clean. The server already has all the information needed (via `analyzePosition`), and the client gains a fast single-pass element walker instead of the current multi-pass approach. The `<tbody>` implicit insertion argument for rejecting ordinal-based approaches is decisive.

That said, there are several issues the plan underspecifies or gets wrong that would cause implementation problems.

---

## 1. Server Architecture: "Accumulate and Flush" Integration

**Feasibility: Medium — works but requires structural care.**

The server renderer does NOT currently track element open/close state. It has a `scope.htmlBuffer` that accumulates raw HTML for `analyzePosition` classification, and a flat `html` string for output. There is no concept of "current element" or "tag close event."

The plan says: "When the tag closes (next `html` node containing `>`), flush as `data-sui-bind="..."` before the `>`."

This is achievable but requires inserting the attribute *before* the `>` in an already-concatenated string. The server builds HTML via `html += node.html` for raw HTML nodes and `html += this.renderExpression(...)` for expressions. The `>` that closes a tag will appear inside an `html` node. So the flush would need to:

1. Accumulate bindings during expression rendering (this is straightforward — `classification` already provides attr name and type, and `id` is the entry ID).
2. When processing an `html` node, detect tag close by scanning for `>` in the HTML fragment.
3. Inject `data-sui-bind="..."` before the first `>` that closes the current tag.

The tricky part: an `html` node can contain multiple tags (e.g., `</div><div class="`), so the detection needs to be position-aware relative to the htmlBuffer's open/close tracking. A reasonable implementation would track a `pendingBindings` array on the scope and, when an `html` node is processed, check if the htmlBuffer transitions from "inside tag" to "outside tag" (i.e., a `>` appears that closes the currently-open tag). At that point, splice the attribute into the output.

This is not as clean as the plan implies but is entirely feasible. The server renderer is already doing `htmlBuffer` tracking for `analyzePosition`, so extending it to track pending bindings is natural.

## 2. Encoding Format Edge Cases

**The format `attrName:entryID` has a real ambiguity with colons.**

The proposed encoding is: `data-sui-bind="attrName:entryID[,attrName:entryID]*"`

Consider `xlink:href` (SVG namespace attribute). This would encode as `xlink:href:3`, which is ambiguous when splitting on `:`. The parser would see `['xlink', 'href', '3']` and misinterpret `xlink` as the attribute name and `href` as the entry ID.

**Fix:** Split on the *last* colon, not all colons. Or use a different separator (e.g., `=` since it won't appear in attribute names or entry IDs): `data-sui-bind="class=0,xlink:href=3"`. This also reads more naturally.

**Multi-expression attributes with `+`:** The plan shows `class:0+3` for interleaved entries. The current `hydrateAttributes` handles this by parsing the marker string `__sui0____sui3__` and building a `parts` array with static segments interleaved. The `data-sui-bind` encoding loses the static segments. For `class="foo {dynamic1} bar {dynamic2}"`, the client needs to know the static parts `"foo "`, `" bar "`, `""` to reconstruct the value. The entry IDs alone are insufficient.

**This is a significant gap.** The plan's proposed walker does `const [attrSpec, ...ids] = part.split(':')` and says "Wire Reaction using entry from entries[id]" — but for multi-expression attributes, the client needs both the entry nodes (for expression evaluation) AND the static text segments. Currently those static segments come from parsing the reference DOM's `__sui0__` markers, which naturally preserves the interleaved static text.

**Options:**
- (a) Only use `data-sui-bind` for single-expression attributes (the common case). Fall back to reference DOM for multi-expression attributes. This gets 90%+ of the benefit with minimal complexity.
- (b) Encode static segments in the attribute value itself using a sentinel pattern. Risky — the evaluated values could collide.
- (c) Accept that on first run the client reads the current attribute value from the DOM and uses the entry count to infer segment boundaries. This is fragile.
- (d) Encode static parts in the bind value: `class:0+"bar "+3` — but this makes the encoding much more complex to parse.

Option (a) is the pragmatic choice. Multi-expression attributes are uncommon enough that preserving the reference DOM path for just those cases is worth the simplicity.

## 3. What `hydrateAttributes` Does Beyond Discovery

**The plan underestimates what needs to be replicated.**

`hydrateAttributes` is ~165 lines. Here's what it does beyond "finding elements with dynamic attributes":

1. **Block-owned element exclusion** (lines 1201-1222): Walks comment markers to build a `Set` of elements inside block directive regions (each, if, etc.), then skips them in the real walker. This is necessary because block content gets its own entry ID space — attribute bindings inside an `{#each}` block are hydrated separately via `hydrateInnerContent`, NOT by the parent's `hydrateAttributes`.

2. **Marker parsing** (lines 1246-1259): For multi-expression attributes, parses the `__sui0__` marker strings to extract interleaved static text and entry IDs into a `parts` array.

3. **Property binding wiring** (lines 1264-1278): Creates a `Reaction` that evaluates the expression and sets `element[propName]`. Removes the DOM attribute. Skips first run.

4. **Event binding wiring** (lines 1280-1290): Creates event listener, wires disposal via `scope.onDispose()`. Removes the DOM attribute.

5. **Single-expression attribute reactions** (lines 1297-1321): Creates a `Reaction` with ifDefined/boolean handling, JSON serialization for objects/arrays, and special-casing for `checked`/`selected`/`value` properties.

6. **Multi-expression attribute reactions** (lines 1322-1349): Creates a `Reaction` that concatenates static + dynamic parts. On first run, evaluates all expressions to register Signal dependencies but skips the DOM write.

Items 3-6 are pure binding-wiring logic that the replacement walker MUST replicate. The plan's pseudocode (`// Wire Reaction using entry from entries[id] // Same binding logic as current hydrateAttributes per-entry wiring`) hand-waves this, but the actual binding code is substantial and nuanced. The replacement walker won't be dramatically simpler than `hydrateAttributes` — it will be faster because it skips the reference DOM construction and parallel walk, but the binding logic itself is the same volume of code.

Item 1 (block-owned element exclusion) **does** disappear — this is a real win. With `data-sui-bind`, the walker simply reads the attribute from whatever element has it. Elements inside block regions won't have `data-sui-bind` from the parent scope (they'll have their own, set during inner content rendering). So there's no need to skip them. This is correct and is the cleanest part of the plan.

## 4. Property and Event Bindings for Removed Attributes

**This works correctly — no issue.**

The server strips `.value=__SUI_REMOVE__` and `@click=__SUI_REMOVE__` via `REMOVE_ATTR_REGEX` on the final `render()` output. So the hydrated DOM has no `.value` or `@click` attributes.

With `data-sui-bind`, the encoding would be `data-sui-bind=".value:1,@click:2"`. The client walker reads this, sees the `.` and `@` prefixes, and wires property/event bindings respectively. The fact that no corresponding DOM attribute exists is fine — property bindings set `element[propName]`, not `element.setAttribute()`, and event bindings call `addEventListener()`. Neither requires the attribute to exist on the element.

One detail: for property bindings, the current code does `element.removeAttribute(attrName)` (line 1276) after wiring. With `data-sui-bind`, there's no attribute to remove — which is correct. The walker just needs to skip that `removeAttribute` call for property/event bindings, or guard it with `element.hasAttribute()`.

Similarly, for boolean attributes that evaluated to falsy (server returned `REMOVE_ATTR` and the attribute was stripped), the `data-sui-bind` would still list them. The client walker needs to handle the case where the attribute is absent from the DOM but listed in `data-sui-bind` — this is the same as property bindings and works fine.

**However:** There's a subtlety with boolean attributes that evaluated to *falsy* on the server. Currently, when the server sees `?disabled={falsy}`, it returns `REMOVE_ATTR` and does `scope.entryId++`. But does it also need to emit the binding metadata? Yes — the attribute is dynamic even when its current value is falsy. The server needs to accumulate the binding even for `REMOVE_ATTR` entries. The plan doesn't call this out, but the implementation would naturally handle it as long as the accumulation happens before the REMOVE_ATTR early return.

## 5. Version Fallback Detection

**The plan's description is vague but the approach is workable.**

"If `data-sui-bind` is expected but absent, fall back to reference DOM path."

The trigger would be: the client's `entries` array contains attribute entries (expressions with `classification.insideTag`), but a TreeWalker walk of the root finds zero elements with `data-sui-bind` attributes. This is a cheap check — walk elements until you find one with the attribute, or exhaust the tree.

A cleaner approach: tie it to the existing `MARKER_VERSION` system. The comment markers already contain `v1`. Bump to `v2` when `data-sui-bind` is emitted. If the client sees `v1` markers, it knows to use the reference DOM path. If it sees `v2` markers, it knows `data-sui-bind` is present. This avoids a speculative walk and makes the version contract explicit.

Alternatively, since `hydrateMarkers` already checks `entries` for attribute entries before calling `hydrateAttributes`, the fallback could be: if attribute entries exist but the first `data-sui-bind` lookup returns null, switch to the reference DOM path. The cost of one failed `getAttribute` is negligible.

---

## Summary

| Question | Assessment |
|---|---|
| Server can accumulate and flush? | Yes, but requires careful integration with html node processing. No current element tracking exists. |
| Encoding edge cases? | Colon ambiguity with namespace attrs. Multi-expression static segments not preserved. |
| hydrateAttributes replacement completeness? | Binding-wiring logic (165 lines) must be replicated in full. Only discovery/alignment code disappears. |
| Property/event bindings for removed attrs? | Works correctly. Minor guard needed for removeAttribute calls. |
| Version fallback trigger? | Workable via marker version bump or first-element probe. |

**The plan is directionally correct and the performance analysis is solid.** The main risks are:

1. **Multi-expression attributes** — the encoding format doesn't preserve static segments. Recommend either supporting only single-expression attrs in v1, or encoding the full attribute template pattern.
2. **Block-scoped entry IDs** — the plan doesn't discuss how `data-sui-bind` entry IDs work inside block directive content (each/if). Since the server creates a fresh scope with `entryId: 0` for block inner content, and the client's `hydrateInnerContent` calls `buildHTMLString` independently for the inner AST, the entry IDs in `data-sui-bind` inside blocks will be relative to the inner AST — which is correct and matches. But this needs to be explicitly verified during implementation.
3. **Stale note about `getItemID`** — the plan mentions extracting `getItemID` to a shared utility, but `getItemID` is used for keyed `each` reconciliation, not for `data-sui-bind` encoding. This appears to be a leftover from a different plan or an error.
