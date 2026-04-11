# Prior View: Each Hydration

Written before reviewing agent reports.

## My current understanding

The each block's hydration is deliberately coarse — it evaluates the collection expression to register a dependency, then returns on firstRun. No per-item Reactions are wired. The server-rendered DOM stays as-is. On first mutation, the entire list tears down and re-renders from scratch via readAST, which then creates full per-item Reactions with keyed reconciliation.

This means 1000 items × ~8 expressions = ~8000 expressions have no reactive wiring after hydration. The first list change is expensive (full rebuild), but subsequent changes use the efficient keyed path.

## Why I think the current approach exists

Per-item hydration is hard because:
- The server renders items as flat DOM nodes between block markers. There are no per-item boundaries — just a stream of elements.
- To wire per-item Reactions, you'd need to identify which DOM nodes belong to which item. The server doesn't encode item boundaries.
- Each item needs an itemSignal and a Proxy that overlays item data on parent data. Creating 1000 of these during hydration is its own cost.
- The keyed reconciliation in createEach depends on itemMap — a Map of key → {nodes, itemSignal, scope}. Building this from server DOM requires knowing the keys, which requires evaluating each item's identity.

The coarse approach avoids all of this complexity. It's a principled choice: hydration is about getting to interactive, not about optimizing for a mutation that may never happen.

## What I think the alternatives are

**1. Status quo** — coarse hydration, first mutation rebuilds. Optimal for static lists, pays once for dynamic lists.

**2. Full per-item hydration** — server embeds item boundary markers, client creates itemSignal/Proxy/scope per item, recursively hydrates inner markers. High hydration cost for large lists, but first mutation is cheap (keyed reconciliation from the start).

**3. Lazy per-item hydration** — on first mutation, instead of teardown+rebuild via readAST, walk the existing DOM to identify per-item boundaries, create itemSignal/Proxy/scope for each, and wire Reactions to existing nodes. Essentially "hydrate on first write" instead of "hydrate on page load" or "rebuild on first write."

**4. Partial hydration** — wire the each Reaction but also wire a few critical per-item bindings (the key expression, the first visible text). Enough to handle simple mutations (add/remove by key) without full rebuild, but not full per-expression reactivity.

## Where I'm uncertain

- Option 3 (lazy hydration on first mutation) seems like the best tradeoff but I don't know if it's feasible. The existing DOM was rendered by the server without itemSignals or Proxies — can you retroactively wire the same reactive data flow that createEach sets up? The DOM nodes are there, the data is known, but the reactive plumbing (Proxy layering item data over parent data with Signal-based updates) would need to be built for existing nodes rather than fresh ones.

- Whether the server should encode item boundaries. Adding `<!--sui-item:N-->` markers between items would add bytes to the HTML but make per-item hydration structurally simple. The question is whether it's worth the payload cost for lists that may never mutate.

- I genuinely don't know which is cheaper at 1000 items: creating 8000 Reactions during hydration (option 2), or rebuilding 1000 items from scratch on first mutation (option 1). Both are ~O(N*M) where N is items and M is expressions per item. The constant factors differ — Reaction.create vs readAST+parseHTML+bindMarkers.
