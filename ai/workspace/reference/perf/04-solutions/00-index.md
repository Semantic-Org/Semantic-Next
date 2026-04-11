# Solutions Index — Verbatim from Agent Reports

All entries are direct quotes from the four performance analysis reports.

---

## Hydration Critical Path

### Problem: removeMarkers is a separate 6ms TreeWalker pass

> **Approach 1: Status quo with deferred removeMarkers only**
> Move `removeMarkers()` from synchronous hydration into `requestIdleCallback` or `setTimeout(..., 0)`.
> Saves ~6ms (28% of the 23ms total) with zero risk to correctness. The markers are inert comment nodes that don't affect layout, rendering, or event handling.
> **Risk:** Near zero.

> **Approach 3: Marker removal via single combined TreeWalker**
> Instead of separate `hydrateMarkers` + `removeMarkers` passes, remove markers inline during `hydrateMarkers`. The hydration walker already visits every comment node. After processing a marker (wiring its Reaction), remove the comment node immediately or collect it for batch removal at the end of the same pass.
> Currently `hydrateMarkers` replaces some comments with text node anchors (e.g., `comment.replaceWith(region.anchor)` in block handling, `comment.remove()` in text expression handling) but leaves block closing markers (`/sui-block:`) in the DOM. `removeMarkers` then does a second full TreeWalker pass to clean everything.
> **Risk:** Low-medium.

---

### Problem: attachEvents and bindKeys run synchronously during hydration

> **Approach 2: Two-phase hydration (sync critical + async interactive)**
> Split hydration into two phases:
> - **Phase 1 (synchronous):** `getData`, `clone/initialize` (without `attachEvents` / `bindKeys`), `hydrateMarkers`. This gives the component a working reactive binding layer.
> - **Phase 2 (deferred via rAF or idle callback):** `attachEvents`, `bindKeys`, `removeMarkers`.
> This requires restructuring `attach()` in template.js.
> **Risk:** Medium.

---

### Problem: attach() chains initialize + attachEvents + bindKeys with no separation

> **Approach 1: Split `attach()` into `attachReactivity()` and `attachInteractivity()`**
> Factor `attach()` into two methods:
> ```js
> attachReactivity(renderRoot) {
>   if (!this.initialized) { this.initialize(); }
>   this.renderRoot = renderRoot;
>   this.parentNode = renderRoot;
> }
> attachInteractivity(renderRoot, { parentNode, startNode, endNode } = {}) {
>   this.parentNode = parentNode || renderRoot;
>   this.startNode = startNode;
>   this.endNode = endNode;
>   this.attachEvents();
>   this.bindKeys();
> }
> ```
> **Risk:** The `onCreated` callback runs during `initialize()`. If user code does `attachEvent(...)` in `onCreated`, it needs `eventController`. This would fail if interactivity is deferred.

> **Approach 2: Pass a `deferEvents` option to `attach()`**
> ```js
> attach(renderRoot, { deferEvents = false, ... } = {}) {
>   if (!this.initialized) { this.initialize(); }
>   this.renderRoot = renderRoot;
>   this.parentNode = parentNode || renderRoot;
>   if (!deferEvents) {
>     this.attachEvents();
>     this.bindKeys();
>   }
> }
> ```
> **Risk:** Low.

> **Approach 3: Constructor option to suppress `attach()` entirely**
> Add `autoAttach: false` to the Template constructor options. When false, the constructor stores `renderRoot` but does not call `attach()`.
> ```js
> if (renderRoot && autoAttach !== false) {
>   this.attach(renderRoot);
> }
> ```
> **Risk:** Low-medium.

> **Approach 4: Move `eventController` creation to `initialize()`**
> Instead of splitting the flow, create `eventController` during `initialize()` so that `callParams.abortController` is valid from the start. Then `attachEvents()` reuses the existing controller instead of creating a new one. This doesn't change the hydration sequence but removes the ordering constraint, making future splitting safe.
> **Risk:** Very low.

---

### Problem: buildHTMLString called twice during hydration

> The hydration path calls `buildHTMLString` in two places:
> 1. `base.js` line 153: to get `entries` (cached on prototype)
> 2. `renderer.js` line 1196: inside `hydrateAttributes` to create a reference DOM for parallel attribute walking
> The `htmlString` from call #1 is not passed through (only `entries` is cached on the prototype).
> If the `htmlString` were also cached alongside `entries` on the prototype, `hydrateAttributes` could reuse it instead of calling `buildHTMLStringPure` again.
> **Estimated savings:** ~1-2ms.

---

### Problem: canHydrate() TreeWalker followed by hydrateMarkers TreeWalker

> `canHydrate()` walks comment nodes to find the first `sui:` marker and check its version string. Then `hydrateMarkers` walks comment nodes again to process all markers.
> The version check could be integrated into the `hydrateMarkers` entry point as a preamble.

---

### Problem: Lazy hydration for off-screen components

> **Approach 5: Lazy hydration — hydrate on first interaction or viewport entry**
> Instead of hydrating in `connectedCallback` (even with the rAF deferral), register an IntersectionObserver or interaction listener. Only hydrate when the component enters the viewport or receives a user interaction (click, focus, pointer).
> For components below the fold, this could eliminate hydration entirely during initial page load.
> **Risk:** High. This is a semantic change — components go from "always hydrated after connectedCallback" to "maybe hydrated." Every consumer of `el.component` would need null checks.

---

### Problem: Expression evaluation during hydration firstRun is costly

> **Approach 1: Batch dependency registration without Reaction execution**
> Instead of creating a Reaction, running its callback, and relying on the reactive tracking to register dependencies, provide a direct API.
> If the set of dependencies is known statically (e.g., from AST analysis of which variables an expression references), we could skip the first-run evaluation entirely.
> **Risk:** High. The reactive system's correctness depends on runtime dependency tracking. Static analysis can only approximate this.

> **Approach 2: Deferred first-run — register deps on first Signal change**
> Create Reactions with `firstRun: false`, but register them on a "global dependency" that fires on the first data change. When the first Signal changes, a single flush runs all hydration Reactions for their actual first evaluation, establishing real dependencies.
> **Risk:** Medium. The jank moves from page load (where it's expected) to user interaction (where it's not).

> **Approach 3: Reduce expression evaluation cost with cached lookups**
> The `ExpressionEvaluator.lookupExpressionValue` parses expressions on every call (tokenization, operator detection, function resolution). Cache the parsed expression structure (token array, helper resolution) so repeat evaluations skip parsing.
> A simple `Map<string, ParsedExpression>` cache would eliminate repeated parsing.
> **Risk:** Very low.

> **Approach 4: Share dependency sets across identical bindings**
> In an `{#each}` loop with 1000 items, each item creates the same set of Reactions with the same expression strings. Create one "prototype Reaction" that records which data keys the expression reads, then for each item, directly wire the Reaction to the item's Signal without evaluating.
> **Risk:** Medium.

> **Approach 5: Skip first-run evaluation for simple lookups, use DOM content as proof**
> Walk the expression AST to find variable references and register dependencies directly on the corresponding data keys. Scoped to the simpler case of text interpolation (`{name}`, `{item.count}`) where the expression is a single variable lookup or dotted path. Falls back to full evaluation for complex expressions.
> **Risk:** Medium.

---

## Marker Discovery

### Problem: Reference DOM built to discover attribute binding positions

> **Approach B: Server-Embedded Attribute Markers (data-sui-bind)**
> The server emits attribute markers directly in the HTML, e.g., `<div data-sui-bind="0,2" class="dark" style="color: red">`. During hydration, a single TreeWalker (SHOW_ELEMENT) finds all elements with `data-sui-bind` and maps them to their entries. No reference DOM needed.
> Eliminates the reference DOM entirely — no `template.innerHTML`, no parallel walk, no block-owned-element discovery.

> **Approach C: AST-Derived Index Map (No Markers in DOM for Attributes)**
> Compute a "binding map" from the AST that describes attribute bindings by DOM tree position. Add a parallel output — `elementBindings[]` — that records, for each element in document order, which entries are attribute bindings on it. During hydration, a single element TreeWalker counts elements and looks up bindings by index.

> **Approach D: Unified Marker Stream (Comments Encode Attributes Too)**
> The server emits comment markers for attribute bindings, not just text/block bindings. Before each element with dynamic attributes, inject `<!--sui-attr:v1:N:attrName-->`. The client's single comment TreeWalker collects both text markers and attribute markers.

> **Approach E: Compile-Time Position Encoding (Metadata Sidecar)**
> The compiler produces a compact binary or JSON "hydration manifest" alongside the HTML. This manifest encodes: for each entry, the type (text/attr/block), the DOM path to its target (e.g., `[0, 2, 1]` meaning first child, third child, second child), and binding metadata. The server can include this manifest as a `<script type="application/sui-hydration">` in the component's shadow root.

---

### Problem: Multiple TreeWalker passes during hydration

> **Option 3A: Fused Single-Pass Walker (SHOW_ALL)**
> Use one TreeWalker with `SHOW_ELEMENT | SHOW_COMMENT` filter. Process both element bindings and comment markers in a single traversal. Element ordinal counting must skip block-owned elements. During the fused walk, you'd track block depth. Elements encountered at depth > 0 are block-owned and don't increment the ordinal counter.

> **Option 3B: Eliminate Passes by Moving Information to the DOM (Server Markers for Everything)**
> If the server emits markers for *all* binding types (text, block, AND attribute), the client needs only the comment walker pass.

> **Option 3C: Keep Passes But Eliminate the Reference DOM**
> Keep the comment walker as-is. Replace Passes 1+2 with an AST-derived element binding map. Walk elements once (no reference DOM), using the map to know which elements at which ordinal positions have dynamic attributes.

> **Option 3E: Merge Comment Walk with Marker Removal**
> The marker removal pass walks all comments and removes those starting with `sui` or `/sui`. If `hydrateMarkers` collected all comments into a removal list as it processed them, the post-hydration removal pass could be eliminated.

---

## Each Hydration

### Problem: Each loop inner content has no per-item Reactions after hydration

> **Strategy A: Current Approach — Lazy Full Rebuild**
> Register a single Reaction on the collection expression during hydration. On first mutation, tear down all server-rendered DOM and re-render the entire list via `readAST`, which creates the full `itemSignal` + Proxy + per-item Reaction structure.
> **Best when:** Lists are mostly read-only. Time-to-interactive matters more than first-interaction latency.

> **Strategy B: Full Per-Item Hydration**
> During hydration, re-evaluate the collection expression, iterate over items, split the server-rendered DOM into per-item node groups, create an `itemSignal` and Proxy for each item, and call `hydrateInnerContent` on each item's nodes with its per-item data context. Build the `itemMap` and `currentKeys` arrays so that subsequent mutations use keyed reconciliation directly.
> **Best when:** Lists are frequently filtered/sorted/mutated and first-interaction latency matters more than initial load speed.

> **Strategy C: Deferred Per-Item Hydration (Idle-Time Progressive)**
> During hydration, register the collection-level Reaction (same as current). Then schedule per-item hydration work using `requestIdleCallback`. Items are hydrated progressively — each idle callback processes a batch of items. If a mutation arrives before progressive hydration completes, abort the progressive work and fall back to full re-render for unhydrated items.
> **Best when:** Lists are large and *sometimes* interactive.

> **Strategy D: DOM-Reusing First Mutation**
> Keep the current hydration approach. But change what happens on first mutation: instead of tearing down all DOM and re-rendering via `readAST`, *adopt* the existing server-rendered DOM nodes. Walk the existing nodes, split them into per-item groups, create itemSignals and Proxies, and wire Reactions to the existing DOM.
> **Best when:** The first mutation typically changes few items.

> **Strategy E: Marker-Enriched SSR with Boundary Metadata**
> Change the server renderer to emit per-item boundary markers inside the each block:
> ```html
> <!--sui-block:v1:5-->
> <!--sui-item:id=x1-->
> <div data-id="x1">One</div>
> <!--sui-item:id=x2-->
> <div data-id="x2">Two</div>
> <!--/sui-block:v1:5-->
> ```
> **Best when:** Used as an *enabler* for Strategy B, C, or D rather than as a strategy on its own.

---

### Problem: Key-to-DOM mapping from server-rendered content

> **Approach 1: Re-evaluate Collection + Static AST Analysis**
> Evaluate the collection expression to get the current items array. For each item, compute its key via `getItemID`. Analyze the AST `node.content` to determine the number of top-level DOM nodes per item. Walk the server-rendered DOM, assigning consecutive groups of N nodes to consecutive items.
> **Reliability:** High for single-root-element templates. Fragile otherwise.

> **Approach 2: Server-Emitted Item Markers (Strategy E)**
> The server emits `<!--sui-item:KEY-->` before each item's content. The client parses these markers to build the key-to-DOM mapping.
> **Reliability:** Perfect.

> **Approach 3: Closing Marker Metadata**
> Instead of per-item markers, embed the item count and key list in the each block's *closing* marker: `<!--/sui-block:v1:5:n2:k=alice,bob-->`
> **Reliability:** Better than Approach 1 alone because the client knows the exact item count.

> **Approach 4: Data-Attribute Stamping**
> The server stamps each item's *root element* with a `data-sui-key` attribute.
> **Reliability:** Only works when each item renders exactly one root element.

---

## Renderer Construction

### Problem: hashCode (fnv1a) over AST+data costs ~1.4ms and is unused

> **Approach A: Sequential ID (current native approach)**
> `this.id = ++Renderer._nextId`. Monotonically increasing integer.
> **What it enables:** Unique instance identification for debugging. O(1) construction.
> **What it precludes:** Content-addressed caching.
> Note: `_nextId` is never initialized as a static field, so the first increment produces `NaN`.

> **Approach C: AST reference identity (cheap structural identity)**
> Use the AST array reference directly as a Map key. `const id = ast;` or use a WeakMap keyed on the AST.
> **What it enables:** Same-template detection at zero hashing cost. Works because component ASTs are compiled once and reused by reference.

> **Approach E: Remove the id field entirely**
> Delete `this.id` from the native Renderer constructor.
> The sequential ID costs nothing and provides some debug utility. Removing it saves exactly zero performance.

---

### Problem: collectSnippets runs per-instance

> **Approach A: Static snippet extraction at compile time**
> The compiler could emit a separate `snippets` map alongside the AST.

> **Approach B: Cache snippet extraction per AST identity**
> Use a WeakMap keyed on the AST array reference. First construction scans and caches.

> **Approach D: Keep as-is**
> Cost is O(top-level-node-count), typically 10-50 iterations with a type-string comparison each. This is sub-microsecond work.

---

### Problem: Signal(0) for dataVersion triggers Error.captureStackTrace

> **Possible approaches for this specific Signal:**
> 1. **Lightweight counter Signal**: A purpose-built "version counter" class that skips cloning, equality checking, stack traces, and context metadata. It would only need `get()` (registers dependency), `increment()` (notifies subscribers), and the underlying `Dependency`.
> 2. **Lazy stack trace**: Make `Error.captureStackTrace` opt-in via a global debug flag, so production builds skip it.
> 3. **Bare Dependency**: Use a raw `Dependency` instance instead of a `Signal` wrapping it. Call `.depend()` where `dataVersion.get()` is used, and `.changed()` where `dataVersion.increment()` is used.

---

### Problem: ExpressionEvaluator instance allocation per Renderer

> **Approach D: Keep as-is**
> The constructor does three property assignments. The instance allocation in V8 is a young-gen pointer bump (nanoseconds). The class exists for architectural reasons (shared between two renderer engines, separation of expression evaluation from DOM manipulation).
> Converting to static methods would add complexity to the recursive call chain without measurable performance benefit.

---

### Cross-cutting observation from renderer construction report

> **Important discovery: the Lit renderer's `getID()` actually ignores `data`** — the parameter is passed but unused. The native renderer's sequential ID costs nothing and is never consumed functionally.

> **The real bottleneck is not construction — it's `render()` and especially `bindMarkers()`/`hydrateMarkers()`.** Within `Template.initialize()`, the `callParams` construction (with ~10 `.bind()` calls) and user's `createComponent()` likely outweigh the Renderer constructor.
