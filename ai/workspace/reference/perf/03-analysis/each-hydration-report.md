# Each Block Hydration: Strategy Analysis

## Source Files Reviewed

- `packages/renderer/src/engines/native/renderer.js` — `hydrateEach`, `createEach`, `hydrateBlockDirective`, `getServerRenderedAST`, `createItemDataProxy`, `getItemID`, `getEachData`, `hydrateInnerContent`, `hydrateMarkers`
- `packages/renderer/src/engines/native/server.js` — `ServerRenderer.renderEach`, `getEachData`
- `packages/renderer/src/engines/native/dynamic-region.js` — `DynamicRegion`
- `packages/renderer/src/engines/native/reaction-scope.js` — `ReactionScope`
- `packages/reactivity/src/signal.js` — `Signal` (item signals, equality, clone, mutation)
- `packages/renderer/test/browser/ssr-hydration.test.js` — Hydration tests including each-specific cases (sections 5, 8, 15, 16, and post-hydration list mutations)
- `packages/renderer/test/browser/subtree-each.test.js` — Each loop behavior tests across rendering engines

---

## Question 1: Why the Current Approach Exists, and the Strategy Space

### Why `hydrateEach` Is Deliberately Different

The current approach — evaluate the collection expression on firstRun to register a dependency, then return without wiring any per-item Reactions — is not an oversight. It is a deliberate architectural choice that makes the right tradeoffs given three structural realities of this framework:

**Reality 1: Per-item data contexts are Proxy-based and require itemSignals.**

In `createEach`, each item's data context is a `Proxy` backed by an `itemSignal` (a Signal holding the item's `{[as]: item, index: i}` data). Inner expressions track the `itemSignal` through the Proxy's `get` trap. This mechanism is what enables per-item granular updates when the collection changes (e.g., item reorder without full re-render).

Hydrating into this system requires *constructing* the Proxy chain and itemSignal for each item, then making every inner Reaction track through it. This is fundamentally different from hydrating a conditional, where the data context is the same parent context the server used. For `{#if}`, hydration can simply call `hydrateInnerContent(ownedNodes, contentAST, data, scope)` — the `data` parameter is the same flat data context. For `{#each}`, each item needs its *own* data context object, and the server-rendered DOM has no marker metadata distinguishing which DOM nodes belong to which item.

**Reality 2: There is no per-item boundary in the server-rendered HTML.**

The server's `renderEach` emits a single pair of block markers around ALL items:

```html
<!--sui-block:v1:5-->
<div data-id="x1">One</div>
<div data-id="x2">Two</div>
<!--/sui-block:v1:5-->
```

There are no per-item delimiters. The client cannot determine from the DOM alone where item 0 ends and item 1 begins. For items that render as a single root element, a heuristic could count top-level children. But items can render as multiple siblings (`{#each item in items}<span>{item.name}</span><span>{item.value}</span>{/each}`), making boundary detection impossible without explicit markers.

**Reality 3: The static-data case is the common SSR case.**

Most server-rendered lists are static data tables, article feeds, product grids, or navigation menus. They render once and never change. For these, wiring 8000 Reactions (8 expressions x 1000 items) is pure overhead — CPU cycles spent on firstRun evaluations, memory allocated for Reaction objects, dependency tracking bookkeeping. The current approach pays zero per-item cost.

The `subtree-each.test.js` tests confirm the expected behavior: both `reactive` and `non-reactive` variants are tested, but exclusively through the client-render path. The hydration tests in `ssr-hydration.test.js` verify that lists survive hydration (DOM preserved) and that mutations work post-hydration (grow, shrink, transition to else), but they do *not* test per-item granular reactivity after hydration — consistent with the design that per-item Reactions don't exist until the first mutation.

### Strategy Space for List Hydration

#### Strategy A: Current Approach — Lazy Full Rebuild

**Mechanism:** Register a single Reaction on the collection expression during hydration. On first mutation, tear down all server-rendered DOM and re-render the entire list via `readAST`, which creates the full `itemSignal` + Proxy + per-item Reaction structure.

**What it optimizes for:** Fastest possible hydration. Zero per-item work. Minimizes time-to-interactive for pages with large lists that are read-only.

**Tradeoffs:**
- First mutation is expensive: O(N) DOM teardown + O(N) DOM creation + O(N*K) Reaction creation (K = expressions per item)
- Causes a visible flash on large lists during first interaction (all DOM nodes removed and recreated)
- After first mutation, the list has full keyed reconciliation — subsequent mutations are efficient
- For lists that never mutate, this is optimal: zero wasted work

**Best when:** Lists are mostly read-only. Time-to-interactive matters more than first-interaction latency.

#### Strategy B: Full Per-Item Hydration

**Mechanism:** During hydration, re-evaluate the collection expression, iterate over items, split the server-rendered DOM into per-item node groups, create an `itemSignal` and Proxy for each item, and call `hydrateInnerContent` on each item's nodes with its per-item data context. Build the `itemMap` and `currentKeys` arrays so that subsequent mutations use keyed reconciliation directly.

**What it optimizes for:** First-mutation responsiveness. Identical behavior after hydration as after client render. No observable difference between SSR-hydrated and client-rendered lists.

**Tradeoffs:**
- Hydration cost is O(N*K): every expression in every item must be evaluated to register Signal dependencies
- For a 1000-item list with 8 expressions per item, this is ~8000 `eval()` calls + ~8000 Reaction objects + ~8000 dependency registrations during hydration
- Memory: 8000 Reactions + 1000 itemSignals + 1000 Proxies + 1000 entries in `itemMap`
- Requires solving the per-item DOM boundary problem (see Question 3)
- Hydration time could be significant — potentially 50-200ms for a 1000-item list based on the current eval cost profile
- For lists that never mutate, all this work is wasted

**Best when:** Lists are frequently filtered/sorted/mutated and first-interaction latency matters more than initial load speed.

#### Strategy C: Deferred Per-Item Hydration (Idle-Time Progressive)

**Mechanism:** During hydration, register the collection-level Reaction (same as current). Then schedule per-item hydration work using `requestIdleCallback` (or `setTimeout(fn, 0)` as a fallback). Items are hydrated progressively — each idle callback processes a batch of items, creating their itemSignals, Proxies, and inner Reactions. If a mutation arrives before progressive hydration completes, abort the progressive work and fall back to full re-render for unhydrated items.

**What it optimizes for:** Best of both worlds — fast initial hydration (like Strategy A) with eventual full reactivity (like Strategy B) without blocking the main thread.

**Tradeoffs:**
- Implementation complexity: need to track which items have been hydrated and which haven't
- A mutation during progressive hydration creates a mixed state: some items have Reactions, others don't. The mutation handler must detect this and handle it correctly (partial keyed reconciliation for hydrated items, full re-render for unhydrated ones — or just fall back entirely)
- `requestIdleCallback` has no deadline guarantee. On busy pages, items may remain unhydrated for hundreds of milliseconds
- Debugging complexity: the system's state depends on when the browser found idle time
- Memory allocation pattern is unpredictable — GC pressure may spike during idle callbacks

**Best when:** Lists are large and *sometimes* interactive. Hedges between read-only and interactive without committing to either.

#### Strategy D: DOM-Reusing First Mutation

**Mechanism:** Keep the current hydration approach (single collection-level Reaction, no per-item work). But change what happens on first mutation: instead of tearing down all DOM and re-rendering via `readAST`, *adopt* the existing server-rendered DOM nodes. Walk the existing nodes, split them into per-item groups, create itemSignals and Proxies, and wire Reactions to the existing DOM — essentially performing "late hydration" of the items at mutation time, reusing the existing DOM nodes rather than rebuilding them.

This is distinct from Strategy B because it defers the per-item work until it's actually needed (the first mutation), but avoids the DOM teardown/rebuild cost that makes Strategy A's first mutation expensive.

**What it optimizes for:** Eliminates the worst case of Strategy A (the full DOM rebuild on first mutation) while preserving its best case (zero per-item work during hydration for lists that never mutate).

**Tradeoffs:**
- Requires solving the per-item DOM boundary problem (same as Strategy B), but can use the current collection data to determine boundaries at mutation time
- More complex than Strategy A's current "nuke and rebuild": the mutation handler needs two paths — one for the first mutation (adopt existing DOM) and one for subsequent mutations (normal keyed reconciliation)
- The adoption process still requires O(N*K) Reaction creation, just deferred to mutation time instead of hydration time. The *latency* of the first mutation is similar to Strategy B's hydration latency, but the *perceived* latency may be worse because the user is actively waiting for a UI response
- The adopted DOM nodes may have stale content if per-item data changed between server render and first mutation. Reactions would fire and update, but there's a brief inconsistency window
- For add/remove mutations, some existing nodes can be reused (keyed matches) and others need fresh rendering — a hybrid path

**Best when:** The first mutation typically changes few items (e.g., adding one item to a list, toggling one item's state). The overhead of adopting N-1 existing items is lower than rebuilding all N items.

#### Strategy E: Marker-Enriched SSR with Boundary Metadata

**Mechanism:** Change the server renderer to emit per-item boundary markers inside the each block:

```html
<!--sui-block:v1:5-->
<!--sui-item:id=x1-->
<div data-id="x1">One</div>
<!--sui-item:id=x2-->
<div data-id="x2">Two</div>
<!--/sui-block:v1:5-->
```

During hydration, the client can parse these markers to establish the key-to-DOM mapping, split nodes into per-item groups, and perform per-item hydration (Strategy B) or deferred hydration (Strategy C) with correct boundaries.

**What it optimizes for:** Eliminates the per-item boundary detection problem entirely. Makes all other strategies feasible without heuristics. The server has perfect knowledge of item boundaries and keys — embedding that in the HTML makes it available to the client.

**Tradeoffs:**
- Increases server-rendered HTML size: ~25-40 bytes per item (`<!--sui-item:id=...-->`)
- For a 1000-item list, that's 25-40KB of additional HTML — significant for large lists
- Changes the server renderer's output format (breaking change for any consumers of the marker format)
- All hydration strategies that need per-item boundaries become simpler to implement
- The markers provide a key list that the client can use to detect server/client data mismatches
- Can be made optional: only emit item markers if the component opts into per-item hydration

**Best when:** Used as an *enabler* for Strategy B, C, or D rather than as a strategy on its own. The cost is HTML size; the benefit is reliable per-item boundary detection.

---

## Question 2: The Middle Ground — DOM-Reusing First Mutation

This question asks specifically about the approach described as Strategy D above. Here is a deeper analysis of the mechanism and its feasibility.

### Current First-Mutation Path (hydrateEach, non-firstRun)

```js
// Lines 1660-1674 of renderer.js
const fragment = document.createDocumentFragment();
const listScope = scope.child();
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const eachData = this.getEachData(item, i, collectionType, node);
  const itemSignal = new Signal(eachData);
  const itemProxy = this.createItemDataProxy(data, itemSignal);
  const itemScope = listScope.child();
  const itemFragment = this.readAST({ ast: node.content, data: itemProxy, scope: itemScope });
  fragment.append(itemFragment);
}
region.setContent(fragment, listScope);
```

`region.setContent` calls `region.clear()` which removes all server-rendered nodes, then inserts the new fragment. The cost breakdown:
1. O(N) `Signal` constructions + `Proxy` creations (cheap — ~1 microsecond each)
2. O(N) `readAST` calls, each of which calls `buildHTMLString` + `parseHTML` + `bindMarkers` (expensive — the entire rendering pipeline per item)
3. O(N*M) DOM node removals + O(N*M) DOM node insertions (M = DOM nodes per item)

The DOM operations in step 3 are the most expensive part. `readAST` creates fresh DOM via `template.innerHTML` + `cloneNode(true)`, producing a DocumentFragment per item. Each fragment is appended to the parent. Then `region.clear()` removes all old nodes. This is O(2*N*M) DOM mutations total.

### The DOM-Reusing Alternative

Instead of calling `readAST` for each item, the first mutation could:

1. **Split existing DOM nodes into per-item groups.** This requires knowing item boundaries. Without server-emitted markers (Strategy E), the client must re-evaluate the collection and use heuristics or template analysis to determine how many top-level DOM nodes each item produces. The AST for `node.content` can be statically analyzed: count the top-level nodes (html nodes + expression comments + block directive comments) to determine nodes-per-item. This is reliable for fixed-structure templates but breaks for conditional content that changes the node count per item.

2. **Create itemSignals and Proxies.** Same as current — O(N) cheap allocations.

3. **Call `hydrateInnerContent` on each item's node group.** This walks the existing DOM nodes, finds markers, and wires Reactions — but does NOT create new DOM. The only DOM operations are replacing comment markers with text nodes (for text expressions) and removing closing block markers.

4. **Build the `itemMap`.** Map key → `{ nodes, itemSignal, scope }` for each item.

5. **Apply the actual mutation.** With `itemMap` populated, use the normal keyed reconciliation path from `createEach` to handle additions, removals, and reorders.

### What This Eliminates

- **No `buildHTMLString` per item** — saves the HTML string assembly cost
- **No `parseHTML` per item** — saves the `template.innerHTML` + `cloneNode` cost
- **No DOM creation for unchanged items** — saves O((N-delta)*M) DOM node creations
- **No DOM removal of server-rendered nodes** — saves O(N*M) `node.remove()` calls

For a 1000-item list where a search filter reduces to 500 items, the current approach does: remove 1000 items' DOM + create 500 items' DOM = 1500*M DOM mutations. The reusing approach does: hydrate 1000 items' inner Reactions (no DOM creation) + remove 500 items' DOM = 500*M DOM mutations + 1000*K Reaction creations.

### Feasibility Concerns

**Per-item boundary detection without markers.** The AST for `node.content` can be analyzed to count "top-level output nodes" — but this count must be stable across items. If the template contains `{#if item.active}<extra-node/>{/if}`, different items produce different node counts. The server emits actual DOM (not markers) for the chosen branch, so the node count varies. This makes heuristic splitting unreliable.

A practical mitigation: during the first mutation, the client has both the server-rendered DOM and the current collection data. It can re-evaluate the collection, then for each item, walk forward through the DOM nodes counting the expected number of top-level outputs from the AST. But this requires evaluating conditionals within items to determine which branches the server took — which is exactly the "full per-item hydration" of Strategy B, just invoked at mutation time.

**Mixed-state Reactions.** After DOM-reusing hydration, the list has Reactions wired to existing DOM nodes. These Reactions track `itemSignal` through the Proxy. If the mutation that triggered this process was a collection replacement (e.g., search filter), the Reaction wiring happened with the *old* item data. The keyed reconciliation then updates `itemSignal.set(newEachData)` for matched items, causing their Reactions to fire and update. For removed items, their scopes are disposed. For new items, fresh DOM is created via `readAST`. This is correct but requires careful ordering: wire Reactions first, then apply the mutation.

### Verdict

Strategy D is the most promising middle ground but its viability hinges entirely on solving per-item boundary detection. Without server-emitted item markers, the detection is fragile for templates with conditional content inside items. If the template structure is known to be fixed (no conditionals, no variable-length content per item), static AST analysis can determine nodes-per-item reliably. This covers many real-world cases (data tables, card grids) but not all.

The cleanest path to Strategy D is to combine it with Strategy E (server-emitted item markers), making boundary detection trivial. The HTML size cost is modest — 25 bytes per marker * 1000 items = 25KB — and the markers are removed during hydration.

---

## Question 3: Establishing Key-to-DOM Mapping from Server-Rendered Content

### The Core Problem

`createEach` uses `getItemID(item, i, collectionType)` to compute a key for each item. This key is derived from the item's *data* (checking `_id`, `id`, `key`, `hash`, `_hash`, `value` in order, falling back to the array index). The key exists in the data domain, not the DOM domain.

The server-rendered DOM has no trace of these keys. There are no `data-key` attributes, no item-boundary comments, no metadata at all. The server's `renderEach` simply iterates and emits HTML:

```js
for (let i = 0; i < items.length; i++) {
  const eachData = this.getEachData(items[i], i, collectionType, node);
  const itemData = { ...data, ...eachData };
  html += this.renderNodes(node.content, itemData);
}
```

### Approach 1: Re-evaluate Collection + Static AST Analysis

**Mechanism:** During hydration, evaluate the collection expression to get the current items array. For each item, compute its key via `getItemID`. Analyze the AST `node.content` to determine the number of top-level DOM nodes per item. Walk the server-rendered DOM, assigning consecutive groups of N nodes to consecutive items.

**How it works for fixed-structure templates:**
```
Template: {#each item in items}<div class="card">{item.name}</div>{/each}
AST analysis: node.content has 1 top-level html node → each item = 1 DOM element
Server DOM: [<div>Alice</div>, <div>Bob</div>, <div>Carol</div>]
Mapping: items[0] ("Alice", key="alice") → [div:0], items[1] → [div:1], items[2] → [div:2]
```

**Breaks when:** Template has conditional content (`{#if item.featured}<badge/>{/if}`) that changes the top-level node count per item. Or when items render multiple text nodes that the browser merges.

**Reliability:** High for single-root-element templates (which are the majority in practice). Fragile otherwise.

### Approach 2: Server-Emitted Item Markers (Strategy E)

**Mechanism:** The server emits `<!--sui-item:KEY-->` before each item's content. The client parses these markers to build the key-to-DOM mapping.

```html
<!--sui-block:v1:5-->
<!--sui-item:alice-->
<div class="card">Alice</div>
<!--sui-item:bob-->
<div class="card">Bob</div>
<!--/sui-block:v1:5-->
```

**How the client processes it:**
1. Walk siblings inside the block region
2. When encountering `<!--sui-item:KEY-->`, start a new group
3. All nodes until the next `<!--sui-item:...-->` or `<!--/sui-block:...-->` belong to this item
4. Map: `"alice" → [<div>Alice</div>]`, `"bob" → [<div>Bob</div>]`

**Reliability:** Perfect — the server has authoritative knowledge of items and keys. Works for any template structure.

**Cost:** ~20-30 bytes per item in HTML. For 1000 items, ~25KB. Removed during hydration so no runtime memory cost.

### Approach 3: Closing Marker Metadata

**Mechanism:** Instead of per-item markers, embed the item count and key list in the each block's *closing* marker:

```html
<!--sui-block:v1:5-->
<div class="card">Alice</div>
<div class="card">Bob</div>
<!--/sui-block:v1:5:n2:k=alice,bob-->
```

The client parses the closing marker to learn: there are 2 items, keys are `["alice", "bob"]`. Combined with static AST analysis (nodes-per-item), the client can split the DOM.

**Reliability:** Better than Approach 1 alone because the client knows the exact item count. Still requires AST analysis for node splitting. For fixed-structure templates, this is sufficient. For variable-structure templates, additional per-item node counts could be embedded: `<!--/sui-block:v1:5:n2:k=alice,bob:nc=1,1-->` (nc = node counts per item).

**Cost:** One extended comment instead of N item markers. Much smaller HTML overhead. For 1000 items, the key list could be large (~10KB for average-length string keys), but it's a single string rather than distributed across the DOM.

**Tradeoff vs Approach 2:** Approach 2 is simpler to parse (linear walk) and more robust (no AST analysis needed). Approach 3 is more compact but requires a secondary analysis step.

### Approach 4: Data-Attribute Stamping

**Mechanism:** The server stamps each item's *root element* with a `data-sui-key` attribute:

```html
<!--sui-block:v1:5-->
<div class="card" data-sui-key="alice">Alice</div>
<div class="card" data-sui-key="bob">Bob</div>
<!--/sui-block:v1:5-->
```

The client walks elements inside the block region, reads `data-sui-key`, and builds the mapping.

**Reliability:** Only works when each item renders exactly one root element. Multi-root items (e.g., `{#each}<span>{item.name}</span><span>{item.value}</span>{/each}`) have no single element to stamp. This is a fundamental limitation.

**Cost:** Per-element attribute instead of per-item comment. Slightly less HTML than Approach 2. Survives HTML minification (comments can be stripped; attributes cannot).

**Tradeoff:** More restrictive than Approach 2 but more durable across HTML processing pipelines.

### Approach 5: Client-Side Collection Evaluation + DOM Content Matching

**Mechanism:** During hydration, evaluate the collection expression to get items. For each item, evaluate the per-item template AST to predict what the server rendered (text content, attribute values). Match predicted content against actual DOM nodes to establish the mapping.

**Example:** Item `{name: "Alice", id: "alice"}` with template `<div class="card">{item.name}</div>` → predicted: `<div class="card">Alice</div>`. Walk DOM nodes, find matching `<div>` with textContent "Alice" → match.

**Reliability:** Extremely fragile. Multiple items could produce identical DOM. Matching algorithms are complex and error-prone. Not a serious option for production.

**Cost:** O(N*K) expression evaluations + O(N*M) DOM reads for matching. More expensive than just re-rendering.

---

## Question 4: How Other Frameworks Handle List Hydration

### Solid (Fine-Grained Reactive, Most Architecturally Similar)

Solid's `<For>` component uses a "reconcile" approach during hydration. The server renders items with no per-item markers. During hydration, Solid walks the DOM using a cursor-based system that mirrors the render tree structure. Each component and each iteration of `<For>` advances the cursor through the server-rendered DOM, claiming nodes as it goes.

Key mechanism: Solid's hydration is *order-preserving*. The client re-executes the component tree in the same order the server did. When `<For>` hydrates, it evaluates the collection, iterates in order, and for each item, hydrates the item's sub-tree by advancing the DOM cursor. There are no boundary markers — the cursor position implicitly tracks item boundaries because the hydration walk mirrors the render walk.

**What this teaches:** If hydration walks the AST in render order (not via TreeWalker on the flat DOM), item boundaries emerge naturally from the walk structure. The current Semantic UI hydration uses a flat TreeWalker over comment markers, which loses the hierarchical structure. An AST-guided hydration walk would preserve it.

**Tradeoff:** Solid's approach evaluates every expression during hydration (to advance the cursor correctly). This is equivalent to Strategy B — full per-item cost. Solid accepts this cost because its expressions are extremely cheap (direct signal reads, no `eval()`/`new Function()`).

### Svelte 5

Svelte compiles `{#each}` blocks to per-item "block" objects. During SSR, Svelte emits HTML with hydration anchors (comment markers similar to Semantic UI's). During hydration, Svelte uses a `hydrate_node` cursor that walks the DOM in render order.

For each items, Svelte's compiled code calls `each_block.create()` which advances the hydration cursor, claiming DOM nodes. Because Svelte's hydration is compiler-driven (each component has a bespoke hydration function generated at compile time), it knows exactly how many DOM nodes each item produces — this information is compiled into the hydration code.

**What this teaches:** Compiler-generated per-item hydration functions eliminate the boundary detection problem entirely. The compiler knows the template structure and generates code that advances the cursor by exactly the right number of nodes per item. This is only possible with ahead-of-time compilation.

**Applicability:** Semantic UI's TemplateCompiler produces an AST, not compiled hydration functions. The AST-interpreter approach (walk the AST, evaluate expressions) could still benefit from this insight: the AST *is* the per-item structure, and walking it in render order provides implicit boundaries.

### Qwik (Resumability)

Qwik takes a fundamentally different approach: no hydration at all. The server serializes the application state into the HTML as JSON in `<script>` tags. Component code is not downloaded or executed until the user interacts with something. When an interaction occurs, Qwik lazy-loads only the handler for that specific interaction.

For lists, this means: the server renders all items with their current state embedded in the HTML. On the client, no Reactions are created for any items until the user interacts with one. When they do, Qwik loads the component code, deserializes the state, and creates reactivity *only for the relevant part of the tree*.

**What this teaches:** The "no per-item hydration cost" principle is sound — Qwik validates the idea that deferring all per-item work until interaction is a viable strategy. The difference is Qwik's architecture supports per-item lazy loading (because component boundaries are the lazy-loading unit), while Semantic UI's current architecture requires the entire each block to re-render on any collection change.

**Applicability:** Semantic UI could adopt a Qwik-inspired approach for *individual item interactions* (event handlers, per-item state changes) without the full resumability architecture. For example: event handlers on items could be wired lazily (registered during hydration as simple DOM event listeners that, when triggered, perform just-in-time Reaction setup for that item). But this requires a fundamentally different event binding model.

### Marko (Streaming + Islands)

Marko's "tags API" renders lists on the server with fine-grained serialized state. During hydration, Marko uses a "split component" architecture where the server-rendered HTML includes serialized component state that the client can deserialize without re-evaluating expressions.

For `<for>` (Marko's list iteration), the server serializes the item data alongside the HTML. The client deserializes item data from the HTML, creates per-item reactive scopes, and wires them to the existing DOM. No re-evaluation of expressions needed — the serialized values are trusted.

**What this teaches:** Serializing evaluated expression values alongside the HTML eliminates the need to re-evaluate expressions during hydration. The client wires Reactions that *will* fire on future changes but trusts the server-rendered values for the initial state. This is close to what Semantic UI's `hydrateTextExpression` already does (evaluate on firstRun to register deps, skip the DOM write because "server content is trusted") — but Marko avoids even the firstRun evaluation by providing the values inline.

**Applicability:** Semantic UI's firstRun evaluation is already cheap for top-level expressions. For per-item expressions, the serialization approach could be useful: embed evaluated values in the HTML so the client can register dependencies without re-evaluating. But this conflicts with the framework's `ExpressionEvaluator` architecture, which requires `eval()` to resolve arbitrary expressions — you can't serialize the dependency graph without running the evaluator.

### Summary of Lessons

| Framework | Strategy | Per-item hydration cost | Key insight |
|-----------|----------|------------------------|-------------|
| Solid | Full per-item hydration via cursor walk | O(N*K) expression evaluations | AST-order walk provides implicit item boundaries |
| Svelte 5 | Compiler-generated per-item hydration | O(N*K) but compiled (fast) | Compiler knows node counts; no runtime boundary detection |
| Qwik | Zero hydration; lazy per-interaction | Zero until interaction | Deferring all work until needed is a valid architecture |
| Marko | Serialized state; no re-evaluation | O(N) deserialization | Inline values eliminate eval cost; dependency registration separate from evaluation |
| Semantic UI (current) | Single collection Reaction; lazy full rebuild | Zero during hydration, O(N*K) + full DOM rebuild on first mutation | Deliberately trades first-mutation cost for zero hydration cost |

The strongest applicable insight is from Solid: **AST-order hydration walk provides implicit item boundaries.** If `hydrateEach` iterated over items and called `hydrateInnerContent` per item while advancing through the DOM in order, it would naturally split the DOM at item boundaries — no markers needed. The catch is that this requires evaluating the collection during hydration (to know N and to create per-item data contexts), which is the core cost that the current design avoids.

The second strongest insight is from Qwik/current-design: **zero-cost hydration for read-only lists is a feature, not a bug.** Any per-item hydration strategy must preserve this as an option (opt-in per-item hydration, not mandatory).
