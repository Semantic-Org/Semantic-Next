# Plan: Per-Item Markers + DOM-Reusing First Mutation (Strategy D+E)

## Dependencies
- None strictly. Can be implemented independently of other plans.
- Benefits from plan 08 (single walker) since the per-item marker scanning during first mutation would use the same walk pattern.

## Problem

After SSR hydration, `hydrateEach` registers one Reaction on the collection expression and returns. Zero per-item work — no `itemSignal`, no Proxy, no per-item Reactions, no `itemMap`. This gives O(1) hydration cost, which must be preserved.

On the first mutation (e.g., search filter keystroke), the current code tears down ALL server-rendered DOM and rebuilds from scratch via `readAST`. For a 1000-item list with 5 expressions per item:
- O(N) DOM node removals (~2000 nodes)
- O(N) DOM node creations (~2000 nodes)
- O(N*K) Reaction creations (~5000)
- Full layout recalculation

This first-mutation cliff costs ~200ms — catastrophic for search filtering where mutations happen on every keystroke.

## What Must Be Preserved
- **O(1) hydration cost.** Lists that never mutate (static data tables, article feeds, marketing pages) must pay zero per-item cost during hydration. This is the primary SSR use case.

## Solution: Two Parts

### Part 1: Server-Emitted Per-Item Markers (Strategy E)

The server emits `<!--sui-item:KEY-->` before each item's content inside each blocks.

**Server change in `ServerRenderer.renderEach` (server.js ~line 232):**
```js
for (let i = 0; i < items.length; i++) {
  const eachData = this.getEachData(items[i], i, collectionType, node);
  const itemData = { ...data, ...eachData };
  const key = this.getItemID(items[i], i, collectionType);
  html += `<!--sui-item:${key}-->`;
  // ... existing render logic ...
}
```

`getItemID` must be available to `ServerRenderer`. Extract to shared utility or duplicate — logic is identical to client `Renderer.getItemID`.

**Marker format:** `<!--sui-item:KEY-->` where KEY is the output of `getItemID` (prefers `_id`, `id`, `key`, `hash`, `_hash`, `value`, falls back to index).

**HTML overhead:** ~24 bytes per item (16 byte prefix + average 8 char key). For 1000 items: ~24KB raw, compresses well with gzip (repetitive prefix).

**Edge cases:**
- Special characters in keys: escape `--` and `>` (forbidden in HTML comments)
- Empty items (conditional hides everything): marker present, zero content nodes
- Nested each loops: inner each loops are wrapped in their own `<!--sui-block:v1:N-->` pairs, so inner item markers don't collide with outer ones

### Part 2: DOM-Reusing First Mutation (Strategy D)

Keep O(1) hydration (current behavior). On first mutation, instead of teardown+rebuild, adopt existing server-rendered DOM nodes and wire per-item reactivity to them.

**Modified `hydrateEach` flow:**

```
First run (hydration):
  1. Evaluate collection expression → register dependency
  2. Parse item boundary markers from region.ownedNodes → build key list
  3. Store serverItems mapping: key → node group
  4. Return (zero per-item work, O(1))

First mutation (collection Signal changes):
  1. Evaluate new collection
  2. For each new item, check if key exists in serverItems
  3. If match: carve out that item's DOM nodes, create itemSignal + Proxy,
     call hydrateInnerContent on those nodes → wire per-item Reactions.
     DOM stays in place.
  4. If no match (new item): render fresh via readAST (same as today)
  5. Remove unmatched server items
  6. Populate itemMap with all items (adopted + new)
  7. Transition to normal createEach keyed reconciliation for all subsequent mutations

Subsequent mutations:
  Identical to createEach — keyed reconciliation via itemMap
```

**What this eliminates on first mutation:**
- Zero DOM creation for unchanged items (skip `buildHTMLString` + `parseHTML` per item)
- Zero DOM teardown for items that persist
- Only items that are genuinely new or removed touch the DOM

**What this still costs on first mutation:**
- O(N*K) Reaction.create calls for adopted items (~60ms for 1000 items × 5 expressions)
- This is the irreducible cost of wiring fine-grained reactivity

**Cost comparison (1000 items, 5 expressions each):**

| | Strategy A (current) | Strategy D |
|---|---|---|
| Hydration | O(1) | O(1) |
| First mutation | ~200ms (DOM rebuild) | ~60ms (Reactions only) |
| Subsequent | O(diff) | O(diff) |

### Graceful Degradation

If item boundary markers are absent (older server HTML, marker version mismatch), the first node inside the block region won't start with `sui-item:`. Fall back to Strategy A's current full-rebuild behavior. Zero risk to existing cached content.

## Files to Change

| File | Change |
|------|--------|
| `packages/renderer/src/engines/native/server.js` | `renderEach`: emit `<!--sui-item:KEY-->` per item. Extract/share `getItemID`. |
| `packages/renderer/src/engines/native/renderer.js` | `hydrateEach`: parse item boundaries on first run, store key→nodes mapping. On first mutation, adopt existing nodes instead of rebuilding. |
| Shared utility | `getItemID` extracted from `Renderer` to be importable by `ServerRenderer` |

## Risks

1. **Third code path.** Adds "adopt-each" alongside "create-each" and "hydrate-each". Future changes to the each-loop data model must consider all three. Mitigated by: the adopt path reuses existing primitives (`createItemDataProxy`, `hydrateInnerContent`, `getItemID`) — it's a thin adapter, not a new abstraction.

2. **Per-item boundary detection edge cases.** Multi-root items, conditional content within items, text-only items, items with zero rendered nodes. Mitigated by: comment markers handle all template shapes — everything between consecutive `<!--sui-item:-->` markers belongs to one item, regardless of content structure.

3. **Stale server DOM during adoption.** If item data changed between server render and first mutation (time-dependent values, randomness), adopted nodes show stale content until their Reactions fire. Mitigated by: Reactions fire synchronously during `hydrateInnerContent`, so DOM updates immediately after adoption. The visual flash is sub-frame.

4. **The 60ms first-mutation cost.** Still 3-4 dropped frames for 1000 items. For search filtering with per-keystroke mutations, this is noticeable on the first keystroke. Mitigated by: subsequent keystrokes use keyed reconciliation and are fast. The cliff is a one-time cost, not recurring.

## Review Contentions

> **Cache item content entries.** `buildHTMLStringPure(contentAST)` produces identical entries for every item (same AST, different data). Compute entries once outside the item loop, not per-item. This is an easy performance win that the plan should make explicit.

> **Extract reconciliation into a shared helper.** `createEach`'s Reaction body contains the keyed reconciliation logic (match by key, reorder, add, remove). The adoption path needs the same logic after populating `itemMap` from server DOM. Rather than duplicating, extract into a shared function that both `createEach`'s ongoing Reaction and the adoption path's first-mutation handler call. The shared function takes `(items, itemMap, currentKeys, region, ...)` and returns the updated `itemMap` and `currentKeys`.

> **Depth-track item boundary markers.** The item boundary parser must only recognize `<!--sui-item:KEY-->` at block depth 0 within the each block's owned nodes. If an item's content contains a nested `{#each}` (which has its own `<!--sui-block:v1:N-->` pairs and potentially its own `<!--sui-item:-->` markers), those inner markers must be skipped. Implement the same `blockDepth` tracking pattern used by `hydrateMarkers`: increment on `sui-block:`, decrement on `/sui-block:`, only process `sui-item:` at depth 0.

## Complexity
Category 3 — moderate-high. Server change is trivial (~5 lines). Client change is the substantial part: parsing item boundaries, building the adoption mapping, the hybrid first-mutation path that mixes adoption with fresh rendering for new items, and transitioning to standard keyed reconciliation. Well-analyzed in the solution reports and the approach is architecturally sound, but needs careful implementation and thorough testing of edge cases.
