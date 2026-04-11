# Each Block Hydration: Per-Item Reactivity After SSR

## Problem Statement

After SSR hydration, each blocks have zero per-item reactive bindings. `hydrateEach` registers one Reaction on the collection expression. On first mutation, the entire list tears down all server-rendered DOM and rebuilds from scratch via `readAST`. For a 1000-item search-filtered list, every keystroke causes a full DOM rebuild of all visible items.

## Why The Current Approach Exists

The lazy full-rebuild design was a deliberate tradeoff — not an oversight. Three structural constraints make per-item hydration hard:

### 1. No Item Boundaries in Server HTML

`ServerRenderer.renderEach` (server.js:232-257) emits:
```
<!--sui-block:v1:{id}-->
{item0 HTML}{item1 HTML}...{itemN HTML}
<!--/sui-block:v1:{id}-->
```

No per-item markers exist. The client cannot determine where item 0's DOM ends and item 1's DOM begins without re-evaluating the template to count nodes per item. This is the fundamental structural blocker for any strategy that wants to adopt existing DOM on a per-item basis.

### 2. Proxy-Based Per-Item Data Contexts

`createEach` (renderer.js:636-649) creates per-item reactivity through:
```js
const itemSignal = new Signal(eachData);
const itemProxy = this.createItemDataProxy(data, itemSignal);
```

Each item gets a `Proxy` wrapping the parent data context, where item-specific keys (`item`, `index`, `this`) resolve from an `itemSignal` and everything else falls through to the parent. Inner expressions and nested blocks bind to this proxy — when `itemSignal` updates, those bindings re-evaluate.

Setting this up during hydration requires: (a) knowing which DOM nodes belong to each item, and (b) creating the proxy + signal + inner Reactions per item. Without item boundaries in the DOM (#1), this requires the same `readAST` pass you'd do on a full render — except you'd also need to match/adopt existing nodes instead of creating new ones.

### 3. Zero-Cost Hydration Was The Design Goal

The current approach achieves minimal hydration time: one `Reaction.create` call, one `eval()` of the collection expression to register the dependency, then return. No DOM walking, no per-item allocation, no inner Reaction setup. For pages where most lists are static after load (marketing pages, documentation, static catalogs), this is optimal — you pay zero cost for items that never change.

## Candidate Strategies

### Strategy A: Current Approach (Lazy Full Rebuild)
**Status quo.** One Reaction per each block. First mutation tears down all server DOM and re-renders from scratch using `createEach`'s diffing logic.

**Hydration cost:** O(1) — one Reaction, one eval.
**First mutation cost:** O(N * K) where N = items, K = expressions per item. Full `readAST` for every item. Creates N Signals, N Proxies, N ReactionScopes, and all inner Reactions.
**Subsequent mutation cost:** O(diff) — `createEach` has keyed reconciliation (getItemID, reorder, add/remove).

**Problem:** First mutation cost is cliff-shaped. A 1000-item list with 5 expressions per item creates ~6000 Reactions and rebuilds the entire DOM tree. For search filtering (where mutations happen on every keystroke at 16ms budget), this is catastrophic.

### Strategy B: Full Per-Item Hydration
Wire all per-item Reactions during hydration. Every item gets its itemSignal, Proxy, inner Reactions, and ReactionScope — identical to what `createEach` sets up on a fresh render.

**Requires:** Item boundary markers in server HTML (see Enabler below).
**Hydration cost:** O(N * K) — same as a full render, minus DOM creation. For 1000 items with 5 expressions each, ~6000 Reaction.create calls during hydration.
**First mutation cost:** O(diff) — incremental from the start.
**Subsequent mutation cost:** O(diff).

**Problem:** Eliminates the zero-cost hydration property. A docs page with 50 components, each containing 20-item lists, would create ~6000 Reactions during hydration instead of ~50. TTI regresses significantly. Pays upfront for interactivity that may never happen.

### Strategy C: Idle-Time Progressive Hydration
Hydrate items in batches during `requestIdleCallback`. Start with Strategy A's single Reaction, then progressively wire per-item bindings during idle time.

**Hydration cost:** O(1) initially, O(N * K) amortized over idle frames.
**First mutation cost:** O(remaining unhyrated items) if mutation arrives before idle hydration completes.
**Subsequent mutation cost:** O(diff) once fully hydrated.

**Problem:** Complexity explosion. Must track partially-hydrated state: which items have Reactions, which don't. A mutation during progressive hydration must handle a mixed state — some items with per-item Reactions (update via signal), others with only server DOM (must rebuild). The Reaction that watches the collection must know about this split. Race conditions between idle callbacks and user-triggered mutations. The complexity is disproportionate to the benefit, especially since the common case (user interacts quickly) hits the partial state anyway.

### Strategy D: DOM-Reusing First Mutation
Keep Strategy A's zero-cost hydration. On the first mutation after hydration, instead of tearing down server DOM and rebuilding, adopt existing DOM nodes and wire per-item bindings to them.

**Hydration cost:** O(1) — same as Strategy A.
**First mutation cost:** O(N * K) for Reaction setup, but O(1) for DOM operations on unchanged items. Changed items get fresh DOM. Items that match by key and haven't changed keep their server-rendered nodes.
**Subsequent mutation cost:** O(diff) — identical to `createEach`.

**Requires:** Item boundary markers in server HTML, OR a way to determine item boundaries from the AST.

**How it works:**
1. On first mutation, evaluate the new item list (same as today).
2. For each new item, check if a matching key existed in the server-rendered set.
3. If yes: carve out that item's DOM nodes (using boundary markers or AST node count), create itemSignal + Proxy, call `hydrateMarkers` on those nodes to wire inner Reactions. The DOM stays in place.
4. If no: render fresh via `readAST` (same as today for new items).
5. Transition to normal `createEach` diffing for all subsequent mutations.

**Problem:** Still O(N * K) Reaction setup on first mutation. But avoids the O(N) DOM teardown + rebuild that dominates the cost. DOM creation is the expensive part (layout, paint, GC of removed nodes). Reaction.create is ~0.01ms each — 6000 of them is ~60ms, tolerable for a single keystroke delay.

### Strategy E: Deferred Hydration with Stale-While-Revalidate
Keep Strategy A's single Reaction. On first mutation, immediately re-render only the VISIBLE items (intersection observer or viewport check), defer the rest. Stale server DOM for off-screen items is invisible to the user.

**Problem:** Requires intersection observer setup during hydration (adds cost), viewport awareness in the each block (cross-cutting concern), and still needs item boundaries for selective re-rendering. The each block shouldn't know about visibility — that's the scroll container's concern.

## Enabler: Server-Emitted Item Boundary Markers

Strategies B, D, and the robust version of C all require knowing where each item's DOM starts and ends. Two approaches:

### Option 1: Comment Markers Per Item
```
<!--sui-block:v1:{id}-->
<!--sui-item:0-->
{item 0 HTML}
<!--sui-item:1-->
{item 1 HTML}
<!--/sui-block:v1:{id}-->
```

**Cost:** 2 comment nodes per item in server HTML. ~40 bytes per item. For 1000 items: ~40KB additional HTML. Comment nodes are cheap to parse but add to DOM node count.

**Server change:** `ServerRenderer.renderEach` adds `<!--sui-item:{i}-->` before each item's content. Minimal change (~3 lines).

**Client change:** `hydrateBlockDirective` parses item boundaries when collecting ownedNodes between block markers. Groups nodes into per-item arrays.

### Option 2: AST-Based Node Counting
The AST for each item content is identical across items (same template). Count the number of top-level DOM nodes the content AST produces, then slice the ownedNodes array by that stride.

**Cost:** Zero additional HTML. No server changes.

**Problem:** Fragile. The AST node count doesn't directly correspond to DOM nodes when:
- Conditional blocks render different branches per item (different node counts)
- Unsafe HTML produces variable node counts
- Nested each blocks expand differently per item
- Text nodes merge with adjacent static text during HTML parsing

This approach works ONLY for templates where every item produces exactly the same number of top-level DOM nodes. That's true for the common case (`{#each item in items}<div>...</div>{/each}` — always 1 div per item) but fails for any template with conditionals or variable content at the item root.

### Recommendation: Option 1 (Comment Markers)
The 40 bytes per item is negligible relative to actual item content. Comment markers are robust against all template shapes. The server change is trivial. The client parsing is straightforward — iterate ownedNodes, split on `sui-item:` comments.

## Recommendation: Strategy D (DOM-Reusing First Mutation)

### Rationale

1. **Preserves zero-cost hydration.** Strategy D is the only approach that keeps hydration at O(1) while also avoiding full DOM rebuild on first mutation. This matters for the primary SSR use case: pages with many lists where most are never mutated.

2. **Eliminates the dominant cost.** The expensive part of first mutation is DOM teardown + rebuild, not Reaction setup. A 1000-item list rebuild involves ~2000 DOM node removals + ~2000 DOM node insertions + layout recalculation. Strategy D replaces this with ~6000 `Reaction.create` calls (~60ms) and zero DOM churn for unchanged items.

3. **Fits the existing architecture.** The each block already has keyed reconciliation (getItemID), itemSignal + Proxy creation, and DynamicRegion management. Strategy D reuses ALL of this machinery — it's not a new abstraction, it's an alternative entry point into the same data structures.

4. **Graceful degradation.** If item boundaries are missing (older server, marker version mismatch), fall back to Strategy A's full rebuild. The marker check is: "does the first node inside the block region start with `sui-item:`?" If no, use the current code path.

### Implementation Sketch

**Server (server.js:renderEach):**
```js
for (let i = 0; i < items.length; i++) {
  html += `<!--sui-item:${i}-->`;  // <-- add this
  const eachData = this.getEachData(items[i], i, collectionType, node);
  const itemData = { ...data, ...eachData };
  // ... existing render logic
}
```

**Client (renderer.js:hydrateEach):**
```js
hydrateEach({ node, data, scope, region }) {
  const itemMap = new Map();
  let currentKeys = [];

  // Parse server-rendered item boundaries from region.ownedNodes
  const serverItems = this.parseItemBoundaries(region.ownedNodes);

  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !region.anchor.isConnected) {
      comp.stop();
      return;
    }

    const rawItems = this.eval(node.over, data) || [];
    const collectionType = this.getCollectionType(rawItems);
    const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

    if (comp.firstRun) {
      // Build initial key list from server items (for diffing on next run)
      currentKeys = items.map((item, i) => this.getItemID(item, i, collectionType));
      return;
    }

    // From here: identical to createEach's Reaction body,
    // except "existing key" case adopts server DOM instead of
    // assuming prior client render.
    // ... (standard keyed reconciliation)
  }));
}
```

The key addition is `parseItemBoundaries` and modifying the "existing key found" branch to handle server-rendered nodes that don't yet have itemSignal/Proxy/scope. On first mutation, items that still match by key get their server DOM adopted and wired. Items that are new or changed get fresh `readAST` renders. After first mutation, `itemMap` is fully populated and subsequent mutations use the normal `createEach` diffing path.

### Cost Summary

| Scenario | Hydration | First Mutation | Subsequent |
|---|---|---|---|
| Strategy A (current) | O(1) | O(N*K) DOM + Reactions | O(diff) |
| Strategy B (full) | O(N*K) | O(diff) | O(diff) |
| Strategy D (recommended) | O(1) | O(N*K) Reactions only | O(diff) |

For 1000 items, 5 expressions each:
- Strategy A first mutation: ~200ms (DOM rebuild dominates)
- Strategy D first mutation: ~60ms (Reaction setup only, zero DOM churn for unchanged items)
- Savings: ~140ms per first mutation, which for search filtering means the difference between dropped frames and smooth interaction.

### Risks

1. **Stale server DOM.** If the client evaluates expressions differently from the server (time-dependent values, randomness), adopted nodes show stale content until their Reactions fire. Mitigation: Reactions fire synchronously during `hydrateMarkers`, so the DOM updates immediately after adoption. The visual flash is sub-frame.

2. **Node count mismatch.** If the server rendered N items but the client evaluates N-1 (data changed between server render and hydration), the boundary markers won't align with the new item list. Mitigation: key-based matching. Only adopt nodes whose key matches. Unmatched server nodes get removed. Unmatched client items get fresh renders.

3. **Complexity.** Strategy D adds a third code path (hydrate-adopt) alongside create (fresh render) and update (keyed diff). Mitigation: the adopt path is a thin adapter that calls existing primitives (createItemDataProxy, hydrateMarkers, getItemID). It doesn't introduce new abstractions.
