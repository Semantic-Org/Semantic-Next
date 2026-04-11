# Marker Discovery Analysis: Approaches to Locating Dynamic Binding Positions During Hydration

## Question 1: Why the Current Architecture Exists, and Alternative Strategies for Bridging the Server-Client Gap

### Why the Current Approach Exists

The marker-based architecture provides three properties that any alternative must preserve:

**1. Server-side simplicity and universality.** The server renderer (`ServerRenderer.renderNodes()`) is pure string concatenation. It runs in Node, Deno, Bun, and Cloudflare Workers. It produces standard HTML — no binary formats, no custom parsing. The comment markers (`<!--sui:v1:N-->`) are valid HTML that any CDN, proxy, or cache layer passes through transparently. This is a deliberate constraint: the server has zero DOM dependencies.

**2. Declarative Shadow DOM compatibility.** The output HTML includes `<template shadowrootmode="open">` so the browser creates shadow roots during parsing — before any JavaScript executes. The markers must survive the browser's HTML parser, which eliminates approaches that embed information in parser-invisible locations (processing instructions, custom node types, etc.). Comment nodes are the only DOM-native metadata carrier that survives innerHTML parsing inside a `<template>` element.

**3. Positional independence from data.** The `entries` array produced by `buildHTMLString(ast)` depends only on AST structure, not data values. This is why `_hydrationEntries` is cached on the prototype in `base.js:153` — every instance of a component shares the same entry map. If marker positions depended on data (e.g., the count of items in an `{#each}`), this prototype caching would break.

**4. Incremental hydration via block nesting.** The block marker pairs (`<!--sui-block:v1:N-->...<!--/sui-block:v1:N:bM-->`) encode a tree structure in the flat comment stream. `hydrateMarkers` processes only top-level markers (tracking `blockDepth`), and block handlers recurse into their owned DOM via `hydrateInnerContent`. This means the client can hydrate a conditional's content using the correct sub-AST without knowing the shape of sibling blocks. The closing marker metadata (`:bM`) even encodes which branch the server chose, enabling mismatch detection.

### The Fundamental Tension

The server builds markers by walking the AST left-to-right, concatenating strings. It knows the exact position of every dynamic binding because it placed them. This knowledge is then serialized into positional comment nodes in the HTML string.

The client has the AST (via `buildHTMLString`) and the live DOM (from DSD parsing). It needs to establish a mapping: `entries[N] -> DOM node at position N`. The comment markers in the DOM are how it bridges this gap.

For text expressions and block directives, this works cleanly: the markers are in the DOM as comment nodes, and a single TreeWalker pass finds them. For attribute expressions, there is an asymmetry: the server evaluates `class="{theme}"` to `class="dark"` — no marker survives in the DOM. The client must rediscover which elements have dynamic attributes using a separate mechanism.

### Approaches to Bridging the Server-Client Gap

#### Approach A: Comment Markers + Reference DOM (Current)

**Mechanism:** Server embeds comment markers for text/block positions. Client finds them via TreeWalker (SHOW_COMMENT). For attributes, client rebuilds the HTML string from the AST, parses it into a reference DOM, and walks both trees in parallel to discover which real elements have marker-bearing attributes.

**Tradeoffs:**
- (+) Server output is clean, valid HTML with no attribute pollution
- (+) Comment markers are cheap to produce (string concat) and cheap to find (SHOW_COMMENT filter skips all non-comment nodes in native code)
- (+) Block nesting encoded structurally via paired markers
- (-) Attribute discovery requires building a reference DOM string, parsing it via `template.innerHTML`, and synchronizing two TreeWalkers with block-skip logic
- (-) `buildHTMLString` is called twice for components with attribute bindings (once for entries array, once in `hydrateAttributes` for the reference DOM HTML string)
- (-) Three TreeWalker passes: blockOwnedElements discovery, parallel element walk, comment walk

**Optimizes for:** Clean server output, HTML spec compliance, no server-side coordination needed.

#### Approach B: Server-Embedded Attribute Markers (data-sui-bind)

**Mechanism:** The server emits attribute markers directly in the HTML, e.g., `<div data-sui-bind="0,2" class="dark" style="color: red">`. During hydration, a single TreeWalker (SHOW_ELEMENT) finds all elements with `data-sui-bind` and maps them to their entries. No reference DOM needed.

**Tradeoffs:**
- (+) Eliminates the reference DOM entirely — no `template.innerHTML`, no parallel walk, no block-owned-element discovery
- (+) Single-pass element walk can handle both attribute and text marker collection
- (+) Directly encodes the server's knowledge of which elements are dynamic
- (-) Adds bytes to every element with a dynamic attribute (attribute name + marker IDs)
- (-) Requires server to track which elements have expressions — currently the server uses `analyzePosition(htmlBuffer)` to classify inline, but doesn't track element identity across expressions
- (-) The `data-sui-bind` attribute must be cleaned up after hydration (one more DOM mutation per bound element)
- (-) Changes the server output format — existing cached/CDN'd server HTML would need version-gated handling

**Optimizes for:** Client-side speed at the cost of slightly larger HTML and server-side tracking.

#### Approach C: AST-Derived Index Map (No Markers in DOM for Attributes)

**Mechanism:** Instead of building a reference DOM, compute a "binding map" from the AST that describes attribute bindings by DOM tree position. The AST encodes the static HTML structure, so you can compute: "the 3rd element in document order has a dynamic `class` attribute at entry index 2." Then walk the real DOM elements and apply bindings positionally.

Concretely: `buildHTMLString` already produces `entries[]` with full classification. Add a parallel output — `elementBindings[]` — that records, for each element in document order, which entries are attribute bindings on it. During hydration, a single element TreeWalker counts elements and looks up bindings by index.

**Tradeoffs:**
- (+) No reference DOM, no innerHTML parsing
- (+) No attribute markers in the server HTML
- (+) The element index map is cacheable on the prototype (it depends only on AST structure)
- (-) Requires block-owned-element skipping logic to stay in sync between AST counting and real DOM counting — the same alignment problem the parallel walker solves, but shifted from DOM to AST analysis
- (-) Server-rendered block content (each items) expands to variable element counts, so the index map can only cover top-level (non-block-owned) elements. This is acceptable because `hydrateAttributes` already skips block-owned elements.
- (-) Fragile if any DOM transformation (e.g., browser normalization, style tag removal in `hydrate()`) changes element ordering before the walk

**Optimizes for:** Zero server overhead, pure AST analysis, but requires careful alignment invariants.

#### Approach D: Unified Marker Stream (Comments Encode Attributes Too)

**Mechanism:** The server emits comment markers for attribute bindings, not just text/block bindings. Before each element with dynamic attributes, inject `<!--sui-attr:v1:N:attrName-->`. The client's single comment TreeWalker collects both text markers and attribute markers. When it encounters an attribute marker, it looks at the next element sibling and wires the binding.

**Tradeoffs:**
- (+) Eliminates the reference DOM and the parallel element walk
- (+) One TreeWalker pass handles everything
- (+) Server logic is straightforward: emit a comment before elements with dynamic attrs
- (-) Significantly increases comment node count in the DOM — every dynamic attribute on every element gets a comment. In a 1000-item list with 3 dynamic attributes per item, that's 3000 extra comment nodes
- (-) Comment nodes before elements change the DOM structure — `nextElementSibling` logic becomes necessary, and the comment must be adjacent to its element (tables, `<tr>` context, etc. may reparse comments out)
- (-) More bytes in the HTML payload
- (-) Must handle multi-expression attributes (e.g., `class="base {mod}"`) — the marker needs to encode that this is a partial attribute, not a full replacement

**Optimizes for:** Architectural simplicity (one walker, one marker type), but at the cost of DOM size.

#### Approach E: Compile-Time Position Encoding (Metadata Sidecar)

**Mechanism:** The compiler (or `buildHTMLString`) produces a compact binary or JSON "hydration manifest" alongside the HTML. This manifest encodes: for each entry, the type (text/attr/block), the DOM path to its target (e.g., `[0, 2, 1]` meaning first child, third child, second child), and binding metadata. The server can include this manifest as a `<script type="application/sui-hydration">` in the component's shadow root, or transmit it out-of-band.

During hydration, the client reads the manifest and navigates directly to each binding target using `firstChild`/`nextSibling` chains — no TreeWalker, no marker scanning.

**Tradeoffs:**
- (+) Zero comment markers needed in the DOM — cleaner output
- (+) Direct DOM navigation is faster than TreeWalker filtering (fewer virtual function calls)
- (+) Manifest is cacheable and shareable across instances (same AST = same paths)
- (-) Path-based navigation is brittle to DOM normalization (browser may merge text nodes, add implicit `<tbody>`, etc.)
- (-) Block content has variable depth — paths can only address the static skeleton, not server-expanded `{#each}` items
- (-) Requires embedding a script element in the shadow root or a separate delivery channel
- (-) Additional complexity: two representations (manifest + HTML) that must stay in sync
- (-) For attribute bindings, the path gives the element — but the client still needs to know which attributes are dynamic and how they decompose (static + dynamic parts)

**Optimizes for:** Minimal DOM overhead at the cost of fragile position encoding and format complexity.

---

## Question 2: What Information the Reference DOM Provides, and Alternatives

### Exactly What the Reference DOM Provides

Reading `hydrateAttributes` (renderer.js:1192-1358), the reference DOM serves one purpose: **it tells the client which real DOM elements have dynamic attributes, and what the attribute values look like with markers still present.**

The server renders `<div class="{theme}">` as `<div class="dark">`. The client sees `class="dark"` — there is no way to distinguish this from a static `class="dark"`. The reference DOM, built from `buildHTMLString(ast)`, contains `class="__sui2__"` — the raw marker token. By walking the reference DOM and checking for `ATTR_MARKER_PREFIX` in attribute values, the client identifies:

1. **Which elements** have dynamic attributes (the reference element has `__suiN__` in some attribute)
2. **Which attributes** are dynamic (the specific attribute containing the marker)
3. **The decomposition** of mixed static+dynamic attributes (e.g., `class="base __sui3__"` means the attribute has a static prefix "base " and a dynamic part at entry 3)

The parallel walk then maps reference elements to real elements by position (document order of elements, skipping block-owned elements in the real DOM since blocks are single comments in the reference DOM).

The block-owned-element discovery (renderer.js:1208-1229) exists because the reference DOM has `<!--sui-block:v1:N-->` as a single comment where the real DOM has the fully expanded block content (potentially hundreds of elements for an `{#each}`). Without skipping, the walkers desynchronize immediately.

### Alternative Ways to Bridge This Information Gap

#### Alt 2A: Server Emits Attribute Binding Markers (Same as Approach B Above)

The server writes `data-sui-bind="2:class,5:style"` on elements with dynamic attributes. The client reads this attribute directly — no reference DOM, no parallel walk.

**What it eliminates:** `buildHTMLString` call for reference HTML, `template.innerHTML` parse, block-owned-element TreeWalker, parallel element TreeWalker.

**What it requires:** Server-side tracking of which elements have expressions in their attributes. Currently `ServerRenderer.renderExpression()` uses `analyzePosition(scope.htmlBuffer)` to classify positions, but it doesn't accumulate per-element binding metadata. The server would need to track "current element" state and flush a `data-sui-bind` attribute when the tag closes.

**Difficulty:** Moderate. The server's `htmlBuffer` already tracks tag boundaries for `analyzePosition`. Adding a per-element accumulator is straightforward. The main challenge is handling multi-expression attributes correctly in the encoding.

#### Alt 2B: Entries Array with Element Ordinal

Enhance `buildHTMLString` to compute, for each attribute entry, the document-order index of its containing element (counting only top-level non-block elements). Cache this on the prototype alongside `_hydrationEntries`.

During hydration, walk elements once (SHOW_ELEMENT, skipping block-owned) and match by ordinal index.

**What it eliminates:** Reference DOM construction and parsing.

**What it retains:** Block-owned-element discovery (still needed to skip correctly), element TreeWalker (but only one, not two).

**Key insight:** The information about *which attribute* and *what parts* is already in the `entries` array. The only missing piece is the element ordinal — which element in the DOM does entry N belong to. This is computable from the AST by counting HTML nodes that are opening tags.

**Difficulty:** Low-moderate. The counting logic mirrors what `buildHTMLString` already does. The risk is alignment: the count must match the TreeWalker's traversal order after block-skip filtering.

#### Alt 2C: data-sui-idx on Every Element (Server-Side)

The server stamps `data-sui-idx="N"` on every element, where N is the document-order element index. The client can then index directly into a precomputed map: `attrBindingsByElementIndex[N]`.

**What it eliminates:** All walker alignment problems. The index is absolute.

**What it requires:** Every element gets an extra attribute — massive overhead for large templates. Cleanup adds one DOM mutation per element.

**Difficulty:** Low implementation, high cost. Only viable if restricted to elements that actually have dynamic attributes, which converges to Alt 2A.

#### Alt 2D: Eliminate the Attribute Gap at the Server Level

Instead of evaluating attributes inline, the server emits attribute markers the same way the client does: `class="__sui2__"`. Then, a post-processing pass on the server evaluates and replaces them.

Wait — this changes the server output format. The browser would see `class="__sui2__"` in the DSD, which would be wrong. So this approach only works if the server also resolves them, meaning the client still can't see the markers.

**Revised version:** The server emits *both* the evaluated attribute AND a comment marker: `<!--sui-attr:v1:2:class--><div class="dark">`. The client finds the comment, navigates to the next element, and knows `class` is dynamic at entry 2.

**What it eliminates:** Reference DOM, parallel walk, block-owned discovery.

**What it adds:** Comment nodes before every element with dynamic attributes. For a 1000-card list template where the top-level template has (say) 5 elements with dynamic attributes, this adds 5 comments. For block-expanded content, the each handler already does teardown-and-rebuild on update, so inner attribute markers aren't needed during top-level hydration.

**Difficulty:** Low. Server emits an additional comment string. Client adds a branch in the comment walker.

#### Alt 2E: Two-Phase Hydration: Wire Text/Blocks First, Attributes Lazily

Observation from the brief: at 1000 items, most content is inside `{#each}`, and `hydrateAttributes` only processes the *top-level template* (the each handler uses coarse rebuild). If the top-level template has few dynamic attributes, the absolute cost is bounded.

**Approach:** Defer attribute hydration entirely. Wire text and block bindings immediately (they're the interactive parts — list reactivity, conditional toggling). Wire attribute bindings in an idle callback or on first interaction.

**What it eliminates:** Nothing structurally — still needs the reference DOM eventually. But moves 8ms out of the critical path.

**What it risks:** Visual inconsistency if a signal changes an attribute before attribute bindings are wired. The server content would show the stale value until the idle callback fires.

**Difficulty:** Low implementation, moderate risk. Best suited as a complement to a structural optimization, not a standalone solution.

---

## Question 3: TreeWalker Passes — What Each Does and Architectural Options

### Current Passes During `hydrateMarkers`

**Pass 1: Block-Owned Element Discovery** (renderer.js:1208-1229)
- Filter: SHOW_COMMENT on the root
- Purpose: Find all `<!--sui-block:v1:N-->` comment markers, then walk siblings between opening and closing markers to collect every ELEMENT_NODE (and its descendants) into `blockOwnedElements: Set`
- Why it exists: The parallel element walker (Pass 2) must skip elements that are inside block regions. In the reference DOM, a block is a single comment node. In the real DOM, a block expands to N elements. If the real walker doesn't skip block-owned elements, it falls out of sync with the reference walker.
- Information collected: `Set<Element>` — the set of real DOM elements owned by any block

**Pass 2: Parallel Element Walk** (renderer.js:1232-1358)
- Filter: SHOW_ELEMENT on both reference and real DOM (real DOM uses `acceptNode` to skip `blockOwnedElements`)
- Purpose: For each reference element with `__suiN__` attribute markers, find the corresponding real element and wire Reactions for attribute, property, and event bindings
- Why it exists: Attribute markers don't survive in the server HTML, so the only way to locate dynamic attributes is positional correspondence between a marker-bearing reference DOM and the real DOM
- Information collected: Per-element, per-attribute binding wiring (Reactions created inline)

**Pass 3: Comment Walk** (renderer.js:1141-1175)
- Filter: SHOW_COMMENT on the root
- Purpose: Find text expression markers (`<!--sui:v1:N-->`) and block directive markers (`<!--sui-block:v1:N-->`). Tracks `blockDepth` to process only top-level markers.
- Why it exists: Text and block positions are encoded as comments by the server. This is the primary discovery mechanism.
- Information collected: Array of `{ comment, markerID, type }` for deferred processing

**Additional Post-Walk: Marker Removal** (base.js:195-208)
- Filter: SHOW_COMMENT on the shadow root
- Purpose: Remove all `sui`/`/sui` prefixed comments after hydration is complete
- Why it exists: Cleaner DevTools output, zero comment noise in production DOM
- This is a fourth TreeWalker pass over the entire shadow root

### What Drives the Separation

The passes exist separately because they serve different tree models:

1. Block-owned discovery needs to walk *siblings at the document level* (not a tree walk — it uses `nextSibling` chains starting from block comments). But it starts by finding block comments, which requires a TreeWalker.

2. The parallel element walk needs two walkers advancing in lockstep. The real walker's filter function uses the block-owned set, creating a data dependency on Pass 1.

3. The comment walk for text/block markers is logically independent of the element walk but operates on the same root. It tracks `blockDepth` state that is orthogonal to element positions.

### Architectural Options for Traversal Work

#### Option 3A: Fused Single-Pass Walker (SHOW_ALL)

Use one TreeWalker with `SHOW_ELEMENT | SHOW_COMMENT` filter. Process both element bindings and comment markers in a single traversal.

**Mechanism:** Walk the real DOM once. When encountering a comment, classify it (text marker, block opener, block closer). When encountering an element, check if it has dynamic attributes by consulting a precomputed element-ordinal map from the AST (see Alt 2B).

**What it eliminates:** The reference DOM, the parallel walk, the block-owned discovery pass. One walk instead of three.

**Challenge:** Element ordinal counting must skip block-owned elements. During the fused walk, you'd track block depth. Elements encountered at depth > 0 are block-owned and don't increment the ordinal counter. This is exactly the `blockDepth` logic already in the comment walker.

**Feasibility:** High if the attribute binding problem is solved via element ordinals or server markers. The comment walker already demonstrates the blockDepth tracking needed.

#### Option 3B: Eliminate Passes by Moving Information to the DOM (Server Markers for Everything)

If the server emits markers for *all* binding types (text, block, AND attribute), the client needs only the comment walker pass. Attribute markers as comments before elements (see Approach D / Alt 2D) would let the comment walker handle everything.

**What it eliminates:** The reference DOM, the parallel element walk, and the block-owned-element pass.

**What it adds:** More comment nodes in the server HTML.

#### Option 3C: Keep Passes But Eliminate the Reference DOM

Keep the comment walker (Pass 3) as-is. Replace Passes 1+2 with an AST-derived element binding map. Walk elements once (no reference DOM), using the map to know which elements at which ordinal positions have dynamic attributes.

Block-owned-element skip logic can be derived from the AST: every block entry in `entries` produces a "skip zone" in element counting. Or more practically, track block depth during the element walk (same approach as the comment walker's `blockDepth`), but this requires interleaving comment and element observation — which converges on Option 3A.

**Alternatively:** Pre-scan comments (a lightweight pass — just collect block boundary positions, no per-element work), then do the element walk with skip knowledge. This is two passes instead of three, and the first pass is cheaper than the current block-owned-element discovery (no inner TreeWalker per block to mark descendants).

#### Option 3D: Defer to Block Handlers (Current Architecture, Refined)

The current architecture already does something elegant: top-level `hydrateMarkers` only processes top-level markers, and block handlers call `hydrateInnerContent` recursively. For the attribute discovery specifically, each recursive call builds a reference DOM from the *sub-AST*, not the full AST — so the reference DOM is smaller.

The optimization here is: for the top-level component, the reference DOM covers only non-block content (blocks are single comments). For a component with 3 static divs, a conditional, and an each loop, the reference DOM has ~5 elements — the reference DOM parse and parallel walk are trivially fast.

**Observation:** The 8ms cost cited in the brief for `hydrateAttributes` at 1000 items may be dominated by recursive `hydrateInnerContent` calls within blocks (each conditional inside the each loop calls `hydrateAttributes` for its sub-AST). If so, the optimization target is reducing per-inner-content overhead, not the top-level pass.

#### Option 3E: Merge Comment Walk with Marker Removal

The marker removal pass (base.js:195-208) walks all comments and removes those starting with `sui` or `/sui`. If `hydrateMarkers` collected all comments into a removal list as it processed them, the post-hydration removal pass could be eliminated. `hydrateTextExpression` already removes or replaces comments (`comment.remove()` or `comment.replaceWith(textNode)`). Block handlers remove closing markers. The only remaining comments after hydration are those not processed (inner markers of blocks that get torn down and rebuilt, like `{#each}`).

**What it eliminates:** One full TreeWalker pass over the shadow root.

**What it requires:** Each block handler that takes ownership of nodes must ensure its markers are collected for removal, or the removal logic must accept that some comments may remain.

---

## Question 4: Approaches from Other Frameworks

### Solid.js — Marker-Free Hydration via DOM Path Compilation

**How it works:** Solid's compiler emits code that navigates the DOM using `.firstChild` / `.nextSibling` chains. The template is compiled to a function like:

```js
const _el = _tmpl.cloneNode(true);
const _el2 = _el.firstChild;
const _el3 = _el2.nextSibling.nextSibling;
insert(_el2, () => name());
```

No markers in the DOM at all. The compiler knows the exact DOM structure because it compiled the template. During hydration, the same navigation code runs against the server-rendered DOM.

**What it solves:** Zero runtime marker discovery. No TreeWalker passes. Attribute bindings are compiled to direct `element.setAttribute()` calls on the navigated element references.

**What it assumes:** The DOM structure is identical between server and client. Any normalization mismatch (browser adding `<tbody>`, merging text nodes) breaks navigation. Solid handles this by normalizing its template output to match browser behavior.

**Applicability to SUI:** SUI's template compiler could theoretically emit navigation code. The challenge is that SUI's templates use comment markers for block boundaries and DynamicRegions, which Solid doesn't have (Solid uses a different block rendering model). SUI's AST is evaluated at runtime, not compiled to JS functions — the template language supports mixed Lisp-style and JS expressions that are evaluated dynamically. Switching to compiled navigation would be a fundamental architectural change.

### Svelte 5 — Hydration Markers with <!--[--> / <!--]-->

**How it works:** Svelte 5 uses paired comment markers `<!--[-->...<!--]-->` to delimit dynamic regions (similar to SUI's block markers). During hydration, it walks the DOM with a cursor-based approach: `hydrate_node` advances a pointer through the DOM, matching against expected structure.

Attribute bindings are handled by the compiler generating direct code: `$.attr(node, "class", value)`. The `node` reference is obtained during the cursor walk.

**What it solves:** Attributes don't need a reference DOM because the compiler generates code that knows exactly which nodes need which bindings. The hydration walk is a single pass.

**Applicability to SUI:** The cursor-based approach could inform an optimized single-pass walker. However, Svelte's compile-time knowledge of bindings is more complete because Svelte compiles templates to JS — SUI interprets templates at runtime from AST. SUI could move closer to this model by pre-computing a "hydration plan" from the AST that encodes the walk order and binding targets.

### Qwik — Resumability, No Hydration Walk

**How it works:** Qwik doesn't hydrate at all in the traditional sense. The server serializes component state and event handler references into the HTML (as attributes like `on:click="..."` pointing to lazy-loaded chunks). When the user interacts, Qwik loads only the relevant handler code. There is no "find all binding points and wire them" step.

**What it solves:** Eliminates hydration entirely for non-interactive components. The cost is O(interactions) not O(bindings).

**What it assumes:** A fundamentally different component model where state is serializable and handlers are independently loadable. The server output contains enough metadata to reconstruct any handler without re-executing component code.

**Applicability to SUI:** Partial resumability is possible for SUI components that are display-only (pure render, no interactivity). For reactive components, SUI's signal-based reactivity requires Reactions to be created and subscribed — this is inherently a hydration-time operation. The `{#each}` coarse-rebuild pattern already defers per-item wiring until the first update, which is a limited form of lazy hydration.

### Marko — Automatic Streaming + Out-of-Order Hydration

**How it works:** Marko 6 (Tags API) uses a compiler that emits both server rendering and client hydration code from the same source. The compiler generates "registrations" — unique IDs for each component/binding — that are embedded in the HTML as attributes. The client runtime uses these IDs to selectively hydrate components on interaction.

Marko serializes a "hydration manifest" as inline `<script>` tags that describe the component tree structure and data. Marker discovery is replaced by manifest reading.

**What it solves:** No DOM walking for discovery. The manifest contains direct references (by ID or position) to all binding targets.

**Applicability to SUI:** A manifest approach (see Approach E) could work for SUI. The challenge is that SUI components use Declarative Shadow DOM, so the manifest would need to be inside each shadow root. The per-component overhead of parsing an inline manifest may exceed the TreeWalker cost for small components, while being a win for large templates.

### Key Insight Across Frameworks

All performant hydration strategies share one principle: **the compiler should do the work, not the runtime.** Solid compiles to navigation chains. Svelte compiles to direct binding code. Qwik compiles to resumable references. Marko compiles to a manifest.

SUI's current architecture evaluates templates from AST at runtime, which means binding discovery is necessarily a runtime operation. The `entries` array from `buildHTMLString` is the closest analog to a compiled binding manifest — it describes every dynamic position with its type and AST node. The question is how efficiently the client can map those entries to live DOM nodes.

The highest-leverage options that preserve SUI's runtime-AST model are:

- **Server-side attribute markers** (Approach B / Alt 2A): Move the minimum information needed to eliminate the reference DOM into the server output. This is the Marko-like approach, scoped to attributes only.
- **AST-derived element ordinal map** (Alt 2B + Option 3A): Keep the server output clean and compute the mapping from the AST at build time. This is closer to Solid's approach but with runtime AST traversal instead of compile-time code generation.
- **Fused single-pass walker** (Option 3A): Regardless of how the attribute problem is solved, merging the TreeWalker passes into one walk that tracks element ordinals and block depth simultaneously would reduce the constant factor on DOM traversal.
