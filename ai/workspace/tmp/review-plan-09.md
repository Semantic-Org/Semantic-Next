# Review: Plan 09 — Each Hydration DOM Reuse

**Score: Agree**

The plan is architecturally sound and well-analyzed. The two-part decomposition (server markers + client adoption) is the right shape. There are several implementation subtleties that need careful handling, detailed below.

---

## Evaluation Point 1: `region.ownedNodes` availability

**Verdict: Correct, with a nuance worth documenting.**

Walk-through of `hydrateBlockDirective` for an `each` node:

1. Lines 1438-1463: The walker collects all sibling nodes between the opening `<!--sui-block:v1:N-->` and closing `<!--/sui-block:v1:N-->` comments into `ownedNodes[]`. Nested blocks are tracked via `blockDepth` so inner block pairs don't terminate the scan early.
2. Line 1456: The closing comment is removed from the DOM.
3. Line 1468: The opening comment is replaced with `region.anchor`.
4. Line 1469: `region.ownedNodes = ownedNodes` — the region now holds the full flat list of server-rendered DOM nodes.
5. Lines 1474-1483: `getServerRenderedAST(node, data)` returns `null` for `each` (line 1576), so the `hydrateInnerContent` block is **skipped entirely**. This is intentional — `each` needs per-item data contexts, so generic inner-content hydration would use wrong data.
6. Line 1521: `hydrateEach({ node, data, scope, region })` is called with the region whose `ownedNodes` contains all server-rendered item DOM.

The owned nodes are in the live DOM at this point (they were never detached — the `hydrateInnerContent` path that detaches-and-reattaches was skipped). The plan's assumption that `region.ownedNodes` is populated and available is **correct**.

**Nuance:** The owned nodes include `<!--sui-item:KEY-->` comment markers interspersed with content nodes. Parsing these is straightforward — iterate `region.ownedNodes`, split on comment nodes matching `sui-item:`. However, the plan should note that the `sui-item` comments need to be included in the `ownedNodes` array (they are siblings between the block markers, so they will be). When items are later adopted, the item comment markers should be removed or retained as item boundary markers for debugging — this is an implementation detail but worth deciding up front.

---

## Evaluation Point 2: `hydrateInnerContent` on arbitrary node groups

**Verdict: Correct — it supports this use case directly.**

`hydrateInnerContent(ownedNodes, contentAST, data, scope)` at line 1580:

1. Takes an arbitrary array of DOM nodes (`ownedNodes`)
2. Wraps them in a temporary `DocumentFragment` container (line 1585-1588)
3. Calls `buildHTMLStringPure(contentAST)` to get the entry list for the AST
4. Calls `hydrateMarkers(container, entries, data, scope, { ast: contentAST })` — this walks the container's tree looking for comment markers and wires up expressions/blocks
5. Updates the `ownedNodes` array with the post-hydration node list

This design is explicitly built for "hydrate a subset of DOM with a sub-AST and custom data context." Calling it per-item with `node.content` as the AST and per-item proxy data is exactly the intended use pattern.

**One consideration:** `hydrateInnerContent` calls `buildHTMLStringPure(contentAST)` to generate `entries`. For DOM-reusing first mutation, this call would happen once per item (N times for N adopted items). Since `contentAST` is the same `node.content` for every item, the `entries` structure is identical — only the data differs. The implementation should compute `entries` once outside the loop and pass it in, or `hydrateInnerContent` should be refactored to accept pre-computed entries. This is a performance optimization (avoiding N redundant AST-to-entries compilations) but aligns with the plan's goal of minimizing first-mutation cost.

---

## Evaluation Point 3: Transition from adopted to keyed reconciliation

**Verdict: Correct — `createEach`'s Reaction has no structural assumptions about initial population of `itemMap`.**

Looking at `createEach` (lines 559-655), the Reaction's body on non-first-run:

1. Builds `newKeys` from the current items (line 595)
2. Iterates `currentKeys` to remove items not in `newKeySet` (lines 598-605) — disposes scope, removes DOM nodes, deletes from `itemMap`
3. Iterates `newKeys` to position/create items (lines 609-651) — checks `itemMap.has(key)`, either updates position or creates new

The only state it depends on is: `itemMap` (Map of key -> `{ nodes, itemSignal, scope, item, index }`), `currentKeys` (array of keys in current order), and `showingElse` (boolean).

As long as the adoption step populates `itemMap` with entries matching the `{ nodes, itemSignal, scope, item, index }` shape, and sets `currentKeys` to the corresponding key array, subsequent Reaction runs will reconcile correctly. There are no hidden assumptions about how `itemMap` was initially created — it is a plain `Map` with a documented entry shape.

**The plan should be explicit:** After first-mutation adoption, the `hydrateEach` Reaction should be stopped, and a new `createEach`-style Reaction should be installed (or the same Reaction should switch to the keyed reconciliation code path). The plan's pseudocode implies this but doesn't spell out the mechanism. The cleanest approach: after first-mutation adoption populates `itemMap` and `currentKeys`, set a flag (`adopted = true`) so subsequent runs of the same Reaction use the `createEach` reconciliation logic inline. Extracting the reconciliation logic into a shared helper (used by both `createEach` and the post-adoption path) would be cleaner than duplicating it.

---

## Evaluation Point 4: Shrinking collection (100 server items, 50 client items)

**Verdict: Mostly sound, but cleanup needs careful implementation.**

The plan says: "key-based matching — only adopt nodes whose key matches." Walk-through:

1. First mutation fires. New collection has 50 items with keys `[k1, k2, ..., k50]`.
2. `serverItems` map has 100 entries: `{k1: [nodes], k2: [nodes], ..., k100: [nodes]}`.
3. For each of the 50 new items, the key is found in `serverItems`, nodes are adopted, `hydrateInnerContent` wires reactivity.
4. The remaining 50 entries in `serverItems` (`k51`..`k100`) are unmatched.

**Cleanup of unmatched nodes:** These nodes are currently in the live DOM (inside `region.ownedNodes`). They must be removed. The plan doesn't specify the mechanism. Two options:

- **Option A:** After adoption loop, iterate remaining `serverItems` entries and call `node.remove()` on each of their DOM nodes. Simple and correct.
- **Option B:** Build the adopted items into a new fragment in the correct order, then call `region.setContent(fragment, listScope)` which clears all existing `ownedNodes` and replaces with the new fragment. This is cleaner because `setContent` handles the old-node cleanup via `region.clear()`.

Option B is preferable because it also handles reordering (if server had `[k1, k2, k3]` and client has `[k3, k1]`, the nodes need to be reordered). The adoption step should: (1) build a fragment with adopted/new nodes in the correct client order, (2) call `region.setContent()` to atomically replace the server content.

**Edge case within the edge case:** If the `sui-item` comment markers are not removed during adoption, calling `region.clear()` will remove them. If they ARE removed during adoption (parsed and discarded), the remaining unmatched items' markers are still in the DOM and must be explicitly removed. Either way, the implementation needs a pass to clean up all `sui-item` comments.

**Another edge case:** If the collection goes from 100 items to 0 items with an `{:else}` block, the adoption path should detect this and fall through to the existing else-rendering logic, removing all server nodes via `region.setContent()` or `region.clear()`.

---

## Evaluation Point 5: Nested each loops and item boundary parsing

**Verdict: Correct — no interference, but parsing must respect depth.**

Server output for nested each:
```html
<!--sui-block:v1:0-->              <!-- outer each -->
  <!--sui-item:a-->                <!-- outer item a -->
    <div>
      <!--sui-block:v1:1-->        <!-- inner each -->
        <!--sui-item:x-->          <!-- inner item x -->
          <span>ax</span>
        <!--sui-item:y-->          <!-- inner item y -->
          <span>ay</span>
      <!--/sui-block:v1:1-->       <!-- inner each close -->
    </div>
  <!--sui-item:b-->                <!-- outer item b -->
    ...
<!--/sui-block:v1:0-->             <!-- outer each close -->
```

The `hydrateBlockDirective` walker already tracks `blockDepth` (line 1441). When collecting `ownedNodes` for the outer each, inner `<!--sui-block:v1:1-->` increments depth, and `<!--/sui-block:v1:1-->` decrements it — the inner block pair is consumed as owned nodes of the outer each, not misinterpreted as the outer closing marker.

**For item boundary parsing:** When scanning `region.ownedNodes` for `<!--sui-item:KEY-->` markers at the outer level, the parser must skip markers that appear inside nested block pairs. The same depth-tracking pattern used by `hydrateBlockDirective` should be applied: maintain a block depth counter, and only recognize `sui-item` comments at depth 0. Inner `sui-item` comments (depth > 0) belong to the inner each and will be parsed when that inner each's adoption runs.

This is straightforward but the plan should call it out explicitly — naive "scan all comments for `sui-item:`" would incorrectly include inner items as outer item boundaries.

---

## Additional Observations

### `getItemID` consistency between server and client

The plan correctly identifies that `getItemID` must be shared. The server's `ServerRenderer` currently has `getEachData` (line 351) but no `getItemID`. The client's `getItemID` (line 679) has a specific priority order: `_id > id > key > hash > _hash > value > index`. The server must use exactly the same logic or keys will mismatch. Extracting to a shared utility in a common file (perhaps alongside `getEachData` which is already duplicated) is the right call.

### The `ownedNodes` state after `hydrateBlockDirective` for `each`

Because `getServerRenderedAST` returns `null` for `each`, the nodes in `region.ownedNodes` have NOT been through `hydrateInnerContent`. This means any expression markers (`<!--sui:v1:N-->`) and nested block markers inside the each content are still raw comments in the DOM. This is actually ideal for the plan — the adoption step calls `hydrateInnerContent` per-item with per-item data, which will process those inner markers correctly.

### Comment character escaping

The plan mentions escaping `--` and `>` in keys (forbidden in HTML comments). This is important. Keys derived from `item.id` or `item.value` could contain arbitrary strings. The escaping scheme should be simple and reversible (e.g., `--` to `-_-`, `>` to `-gt-`), and applied identically on server (when emitting) and client (when parsing). Worth defining the exact escaping in the implementation.

---

## Summary

The plan is well-conceived and the approach is sound. The core insight — O(1) hydration preserved, deferred per-item wiring on first mutation using server-emitted boundaries — is the right architecture. The main implementation details that need attention:

1. **Depth-aware item boundary parsing** for nested each loops (scan at depth 0 only)
2. **Pre-compute `entries` once** when calling `hydrateInnerContent` N times with the same AST
3. **Explicit cleanup mechanism** for unmatched server nodes (prefer `region.setContent` with a reordered fragment)
4. **Extract reconciliation logic** into a shared helper rather than duplicating between `createEach` and the post-adoption path
5. **Key escaping scheme** defined and shared between server and client
6. **Decide on `sui-item` comment retention** — remove during parsing or leave for debugging
