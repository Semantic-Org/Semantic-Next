# Recommendations — Verbatim from Solution Reports

## remove-markers
> ## Recommendation: Option B (inline removal) + fix unsafeHTML bug
> 
> The implementation is:
> 
> 1. **Add RAW_TEXT_MARKER to `hydrateMarkers` walker** (renderer.js ~1162). When encountered, collect it for removal. This mirrors how the initial-render path handles it (renderer.js:306-309) but for hydration we just need to remove the comment since `hydrateAttributes` already wired the element via the parallel walk.
> 
> 2. **Collect orphan markers during the walker pass**. Comments that match `sui*` or `/sui*` but aren't COMMENT_MARKER or BLOCK_MARKER (or are COMMENT_MARKER/BLOCK_MARKER but have no matching entry) get added to a removal list during the same walk. One pass, zero extra work.
> 
> 3. **Remove `removeMarkers()` call from `hydrate()`** (base.js:175). The second TreeWalker pass is eliminated entirely.
> 
> 4. **Do NOT remove unsafeHTML comment anchors**. The hydration handlers already leave these in place correctly. By removing the blanket `removeMarkers` call, we fix the latent bug for free.
> 
> 5. **Update the test** (ssr-hydration.test.js:658). The "no hydration comments remain" test needs to either:
>    - Exempt unsafeHTML anchors from the assertion, or
>    - Add a companion test that verifies unsafeHTML comments DO remain (since they're functional anchors, not debris)
> 
> ### Concrete diff sketch
> 
> In `hydrateMarkers` (renderer.js), the walker loop at lines 1146-1175 becomes:
> 
> ```js
> const markersToRemove = [];
> while ((comment = commentWalker.nextNode())) {
>   const text = comment.data;
> 
>   if (text.startsWith('/sui-block:')) {
>     blockDepth--;
>     if (blockDepth === 0) { markersToRemove.push(comment); }
>     continue;
>   }
>   if (blockDepth > 0) {
>     if (text.startsWith(BLOCK_MARKER)) { blockDepth++; }
>     continue;
>   }
> 
>   if (text.startsWith(COMMENT_MARKER)) {
>     const markerID = parseInt(text.slice(COMMENT_MARKER.length));
>     if (!isNaN(markerID)) {
>       commentsToProcess.push({ comment, markerID, type: 'expression' });
>       // Text expressions remove their own comment during processing.
>       // unsafeHTML expressions keep theirs as an anchor — don't touch.
>     }
>   }
>   else if (text.startsWith(BLOCK_MARKER)) {
>     const markerID = parseInt(text.slice(BLOCK_MARKER.length));
>     if (!isNaN(markerID)) {
>       commentsToProcess.push({ comment, markerID, type: 'block' });
>       blockDepth++;
>       // Block handlers remove their own opening/closing comments.
>     }
>   }
>   else if (text.startsWith(RAW_TEXT_MARKER)) {
>     // Raw text markers aren't wired during hydration (attributes handle it).
>     // Just schedule removal.
>     markersToRemove.push(comment);
>   }
> }
> 
> // ... process entries ...
> 
> // Clean up any markers that weren't removed by their handlers
> for (const node of markersToRemove) {
>   if (node.isConnected) { node.remove(); }
> }
> ```
> 
> Note: the closing block markers at depth 0 are added to `markersToRemove` above. But `hydrateBlockDirective` already removes them at line 1468. The `isConnected` guard handles this double-schedule gracefully — if the handler already removed it, the cleanup is a no-op.
> 
> ### Why this is safe
> 
> - Text expression handlers already remove their comments (lines 1417, 1421). No change.
> - unsafeHTML handlers deliberately keep their comments. `removeMarkers` was the only thing that broke this — removing it fixes the bug.
> - Block handlers already remove both opening and closing markers (lines 1468, 1480). No change.
> - RAW_TEXT_MARKER gets explicit cleanup in the same pass. No second walk needed.
> - Orphaned entries (no match) are left as-is by the walker — they're inert comments that don't affect functionality. If cosmetic cleanliness is important, they could be added to `markersToRemove` too, but this is a rare edge case.
> 
> ### Performance summary
> 
> | Approach | Sync ms saved | Total ms saved | Fixes unsafeHTML bug | Complexity |
> |---|---|---|---|---|
> | Defer to rAF | ~6ms (shifted) | 0ms | No (delays it) | Medium |
> | Inline removal | **~6ms (eliminated)** | **~6ms** | **Yes** | Low |
> 
> **Recommendation: Option B.** It eliminates ~6ms of redundant DOM traversal, fixes a latent reactivity bug with unsafeHTML, and is a smaller diff than the deferral approach.

---

## walker-consolidation
> ## Recommendation
> 
> **Implement Option B (AST-derived element ordinal map) as the primary optimization. Keep Pass 4 as-is. Skip Option A and Option C.**
> 
> ### Rationale
> 
> 1. **Option B targets the dominant cost.** The reference DOM construction (`template.innerHTML` + `cloneNode`) is by far the most expensive operation in the attribute hydration pass. Profiling data from the existing `__hydPerf.buildHTMLTime` instrumentation confirms this. Eliminating it removes one full HTML parse per hydration scope (including recursive inner content hydration calls, which each build their own reference DOM).
> 
> 2. **Option B is structurally sound.** The `buildHTMLString` function already walks the AST in document order and tracks element vs. text position (`analyzePosition`). Adding an element ordinal counter to entries requires ~15 lines of code in `buildHTMLString` and ~20 lines to replace the parallel walker in `hydrateAttributes`.
> 
> 3. **Option A provides marginal gains for significant complexity.** Merging comment walks saves ~0.05ms total. A `SHOW_ALL` walker that handles both elements and comments requires careful interleaving logic with block-depth tracking, and still cannot eliminate the reference DOM. The code complexity increase is not justified.
> 
> 4. **Option C removes a useful safety net for negligible savings.** Pass 4 costs ~0.02ms and catches real bugs. The test "no hydration comments remain" directly validates this contract.
> 
> ### Implementation Sketch
> 
> **In `buildHTMLString` (build-html-string.js):**
> 
> ```js
> // Add to state tracked during processNodes
> let elementOrdinal = 0;
> 
> case 'html': {
>   // Count opening tags in the html fragment to advance ordinal
>   const openTags = (node.html.match(/<[a-zA-Z][^/>]*(?:>|$)/g) || []);
>   // Exclude self-closing/void elements from count
>   // ... (details depend on exact void element handling)
>   elementOrdinal += openTags.length;
>   // ...existing logic
>   break;
> }
> 
> case 'expression': {
>   if (classification.insideTag) {
>     entries.push({ ..., elementOrdinal: elementOrdinal - 1 }); // -1 because ordinal advanced past the opening tag
>   }
>   // ...existing logic
> }
> ```
> 
> Actually, the cleaner approach: since `analyzePosition` already looks at the HTML buffer to determine if we're inside a tag, we can count `<tag` opens (minus self-closing ends) in the buffer to get the current element ordinal. This is computed once per attribute entry during `buildHTMLString` -- no per-node cost.
> 
> **In `hydrateAttributes` (renderer.js):**
> 
> Replace:
> - `buildHTMLString` + `template.innerHTML` + reference DOM construction
> - `blockOwnedElements` discovery (Pass 1) + parallel walker (Pass 2)
> 
> With:
> - Single `SHOW_ELEMENT` walker over real DOM with block-owned filtering
> - Index elements into an array by ordinal
> - For each attribute entry, look up the real element by `entry.elementOrdinal`
> 
> The `blockOwnedElements` set is still needed for filtering, but the reference DOM parse is eliminated entirely.
> 
> ### Expected Impact
> 
> | Component complexity | Current cost (est.) | After Option B (est.) | Savings |
> |---|---|---|---|
> | Simple (20 elements, 5 attrs) | ~0.3ms | ~0.15ms | ~0.15ms |
> | Medium (100 elements, 20 attrs) | ~0.8ms | ~0.35ms | ~0.45ms |
> | Complex (300 elements, 50 attrs) | ~2.0ms | ~0.7ms | ~1.3ms |
> 
> The savings compound for templates with nested blocks, since each `hydrateInnerContent` call currently builds its own reference DOM. With ordinals baked into entries, inner content hydration skips the reference DOM entirely.
> 
> ### Remaining Concern
> 
> The element ordinal approach requires that the AST-derived ordinal exactly matches the browser's element enumeration order. This is guaranteed when:
> 1. The AST is produced by the same compiler that generated the server HTML
> 2. Block-owned elements are correctly excluded from the ordinal sequence (they are, because `buildHTMLString` emits blocks as single comment markers, not expanded elements)
> 3. SVG elements count correctly (they do, since they're regular elements in the tree)
> 
> The only fragility is void/self-closing element handling in the ordinal counter. The `html` node content may contain `<br>`, `<img>`, `<input>` etc. which are elements but don't have closing tags. The counter must match how `TreeWalker(SHOW_ELEMENT)` enumerates them -- which it does, since void elements are still elements in the DOM. The counter should increment for every `<tag` that is not a closing tag (`</tag`), regardless of whether it self-closes.

---

## attach-splitting
> ## Final Recommendation
> 
> **Move `eventController` creation to `initialize()`, then defer `attach()` in the hydration path.**
> 
> ### Step 1: Create eventController during initialize() (correctness fix)
> 
> In `template.js`, move the AbortController creation from `attachEvents()` to `initialize()`:
> 
> ```js
> initialize() {
>   // ... existing code ...
>   this.eventController = new AbortController();
>   // ... callParams now gets a valid abortController ...
> }
> ```
> 
> And in `attachEvents()`, remove the creation but keep the abort-and-recreate pattern:
> 
> ```js
> attachEvents(events = this.events) {
>   if (!this.parentNode || !this.renderRoot) {
>     fatal('You must set a parent before attaching events');
>   }
>   this.removeEvents();
>   // Recreate controller for this event binding cycle
>   this.eventController = new AbortController();
>   // Update callParams reference
>   if (this.callParams) {
>     this.callParams.abortController = this.eventController;
>   }
>   // ... rest unchanged ...
> }
> ```
> 
> ### Step 2: Defer attach() after hydration in WebComponentBase
> 
> ```js
> hydrate(prototypeTemplate) {
>   // ...
>   this.template = prototypeTemplate.clone({
>     data,
>     element: this,
>     // No renderRoot — separates initialize from event wiring
>   });
>   this.template.initialize();
> 
>   this.template._isHydrating = true;
>   // ... hydrate markers ...
>   this.template._isHydrating = false;
>   this.template.rendered = true;
>   this._hydrating = false;
> 
>   // Attach events after hydration — deferred to next frame
>   // so the browser can process input from the initial paint
>   requestAnimationFrame(() => {
>     this.template.attach(this.renderRoot);
>   });
> }
> ```
> 
> ### Step 3: No changes needed for subtemplates
> 
> The native renderer's `createSubtemplate()` and `hydrateSubtemplate()` already call `attach()` explicitly and synchronously after the work completes. Deferring these would be risky (Reaction race) and the per-component cost is small (~0.1ms). The multiplied cost only matters in the `{#each}` hydration path, where all 1000 items are processed in one synchronous batch before any rAF fires — so deferring individual `attach()` calls wouldn't help within that batch anyway.
> 
> ### Expected improvement
> 
> - **Hydration of single component:** ~0.1-0.5ms saved (events deferred past the critical hydration path)
> - **Hydration of component with 1000 subtemplate items:** 0ms saved (subtemplate attach is already explicit, and the synchronous batch runs before any rAF)
> - **Correctness:** `callParams.abortController` is no longer `undefined` during `createComponent` callbacks
> 
> ### Honest assessment
> 
> The 0.9ms figure for 1000 items is real but small relative to the total hydration cost. The deferral helps Time-to-Interactive for the top-level component but doesn't reduce total work. The main value of this change is:
> 
> 1. **Correctness**: fixing the `eventController` being `undefined` in `callParams`
> 2. **Architecture**: aligning the hydration path with the subtemplate pattern (explicit `initialize()` then explicit `attach()`)
> 3. **Future-proofing**: once event deferral is established, individual subtemplate `attach()` calls could be batched and deferred as a group in a later optimization

---

## event-controller-ordering
> ## Recommendation: Make `abortController` a getter on `callParams`
> 
> Change line 307 from a value capture to a getter:
> 
> ```js
> // Before (captures undefined at callParams construction time)
> abortController: this.eventController,
> 
> // After (reads live value when accessed)
> get abortController() {
>   return template.eventController;
> },
> ```
> 
> Apply the same change to `buildCallParams()` at line 851.
> 
> **Why a getter, not moving `eventController` creation earlier:**
> - `attachEvents()` intentionally calls `removeEvents()` first (line 508), aborting any existing controller before creating a fresh one. This reset-and-recreate pattern is deliberate — it supports re-attachment after DOM moves.
> - Creating `eventController` in the constructor or `initialize()` would mean the first `attachEvents()` call immediately aborts the controller that `callParams` holds. The getter avoids this by always returning the current live value.
> - A getter has zero runtime cost (property access is the same speed as reading an object property — V8 optimizes getter access on plain objects).
> 
> **What this eliminates:**
> - The `undefined` window between `initialize()` and `attachEvents()`
> - Any future ordering sensitivity if hydration splits the initialization sequence
> - A subtle API contract violation where a documented parameter is silently `undefined`
> 
> **What this preserves:**
> - The existing two-controller architecture (template lifetime vs event lifetime)
> - The `attachEvents()` reset-and-recreate pattern
> - All existing behavior — `attachEvent()` already works, and no code currently reads the broken property

---

## build-html-string-caching
> ## Recommendation: Cache `htmlString` Alongside `entries` on the Prototype
> 
> ### The Change
> 
> In `base.js hydrate()`, cache both outputs:
> 
> ```js
> if (!prototypeTemplate._hydrationEntries) {
>   const { entries, htmlString } = this.template.renderer.buildHTMLString(this.template.ast);
>   prototypeTemplate._hydrationEntries = entries;
>   prototypeTemplate._hydrationHTML = htmlString;
> }
> ```
> 
> In `renderer.js hydrateAttributes()`, accept an optional `htmlString` parameter
> and skip the rebuild when provided:
> 
> ```js
> hydrateAttributes(root, entries, data, scope, ast, htmlString) {
>   if (!htmlString) {
>     htmlString = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets }).htmlString;
>   }
>   // ... rest unchanged
> }
> ```
> 
> Thread the cached string through `hydrateMarkers`:
> 
> ```js
> hydrateMarkers(root, entries, data, scope, { ast, htmlString } = {}) {
>   // ...
>   if (attrEntries.length > 0) {
>     this.hydrateAttributes(root, entries, data, scope, ast, htmlString);
>   }
> }
> ```
> 
> And from `base.js`:
> 
> ```js
> this.template.renderer.hydrateMarkers(
>   this.shadowRoot,
>   entries,
>   this.template.renderer.data,
>   this.template.renderer.scope,
>   { htmlString: prototypeTemplate._hydrationHTML },
> );
> ```
> 
> ### Why This Is Safe
> 
> 1. **Pure function, identical inputs** — proven above. The cached `htmlString` is
>    byte-identical to what the second call would produce.
> 
> 2. **Prototype-level cache is correct** — `_hydrationEntries` is already prototype-cached
>    with the same rationale: entries depend on AST structure, not instance data.
>    `htmlString` has the same dependency profile.
> 
> 3. **Recursive calls unaffected** — `hydrateInnerContent` and subtemplate hydration
>    pass their own AST, so they never hit the top-level cache. The `htmlString`
>    parameter defaults to `undefined`, falling through to the existing rebuild.
> 
> 4. **Conditional guard preserved** — `hydrateAttributes` is only called when
>    `attrEntries.length > 0`. Templates without attribute expressions skip both
>    calls today and will continue to.
> 
> 5. **No test changes required** — the 18 SSR hydration tests cover static HTML,
>    text expressions, attribute expressions (including mixed static+dynamic and
>    reactivity), conditionals, each loops, snippets, subtemplates, nested blocks,
>    async, rerender, guard, slots, unsafe HTML, and environment guards. The change
>    is invisible to all of them because it produces the same reference DOM.
> 
> ### What This Eliminates
> 
> Per call (eliminated on all but the first instance of each component type):
> 
> - **1 full AST walk** — `processNodes()` iterates every node, running string
>   concatenation, regex classification, and entry construction
> - **String allocation** — the `htmlString` (often several KB for real components)
>   is assembled via repeated `+=` concatenation
> - **~1-2ms per component** — consistent with prior profiling measurements stored
>   in `globalThis.__hydPerf.buildHTMLTime`
> 
> For pages with many instances of the same component (e.g., a list of cards),
> the savings compound: N-1 instances skip the rebuild entirely.
> 
> ### Memory Cost
> 
> One additional string reference on the prototype. This is the same `htmlString`
> that was already being constructed and immediately discarded. The string is shared
> across all instances (prototype-level), so the marginal memory is one string per
> component *type*, not per instance. For a typical component template this is
> sub-10KB — negligible relative to the DOM it describes.

---

## expression-eval-firstrun
> ## Recommendation
> 
> **Implement Approach 5: Simple Lookup Fast Path with Full-Eval Fallback.**
> 
> ### Rationale
> 
> 1. **Conservative correctness.** The regex filter is strict — only `identifier` and `identifier.path.segments` are fast-pathed. Everything else falls through to the battle-tested evaluator. No new failure modes.
> 
> 2. **Eliminates the right cost.** The expensive part of simple lookups isn't `depend()` — it's the evaluator's multi-step cascade: literal checks, `getDeepDataValue` with its `wrapFunction` calls and intermediate allocations, the `evaluateJavascript` fallback that constructs a `new Function` and Proxy per invocation (line 100-107 of expression-evaluator.js). The fast path replaces all of this with a direct path walk.
> 
> 3. **Proportional to the problem.** Simple lookups are ~75% of expressions. For a component with 40 expressions hydrated, this eliminates ~30 full evaluator passes.
> 
> 4. **Incremental.** Can be added to `hydrateTextExpression`, `hydrateAttributes`, and `hydrateEach` independently. No architectural changes to the Reaction system, data model, or expression evaluator.
> 
> 5. **Measurable.** The `__hydPerf` instrumentation already tracks `evalFirstRun` and `evalFirstRunTime`. The fast path can add its own counter to validate the split.
> 
> ### What It Does NOT Solve
> 
> - Block directives (if, each, async, rerender) still need full eval on first-run because they use the result to determine behavior (which branch to render, template identity, etc.)
> - Complex expressions still need full eval to discover dependencies through the Proxy mechanism
> - The `dataVersion.get()` call remains in all paths (required for subtemplate data propagation)
> 
> ### Estimated Net Impact
> 
> For a spec-driven component with 30 expressions (typical for a medium SUI primitive):
> - ~22 simple lookups skip full eval: saves ~22 * 0.03ms = ~0.66ms
> - ~8 complex expressions: no change
> - Block directive first-runs: no change (they need the result)
> 
> For a page with 50 hydrated components: ~33ms savings. That's noticeable in Time to Interactive.
> 
> For each-loops with 100 items, each item having 5 expressions (4 simple, 1 complex): saves ~100 * 4 * 0.03ms = ~12ms per loop.
> 
> ### Additional Quick Win: Expression Parsing Cache (Approach 3)
> 
> Can be combined with Approach 5 at near-zero risk. Add a module-level `Map<string, TokenArray>` in ExpressionEvaluator:
> 
> ```js
> static _parseCache = new Map();
> 
> getExpressionArray(expr) {
>   let cached = ExpressionEvaluator._parseCache.get(expr);
>   if (cached) return cached;
>   // ... existing parse logic ...
>   ExpressionEvaluator._parseCache.set(expr, result);
>   return result;
> }
> ```
> 
> This benefits complex expressions on subsequent runs (not just first-run), so it compounds with Approach 5.

---

## attribute-reference-dom
> ## Recommendation: Option 1 — Server-Embedded `data-sui-bind`
> 
> ### Rationale
> 
> 1. **Largest performance gain with lowest risk.** Eliminates ~7 of ~8ms by removing the innerHTML parse, the blockOwnedElements walk, and the parallel TreeWalker entirely. The replacement is a single-pass element walker that checks for `data-sui-bind` attributes.
> 
> 2. **No structural alignment problem.** Options 2 and 4 must solve the block-expansion alignment problem (template has one node where the DOM has N nodes). Option 1 sidesteps this entirely — the marker is ON the target element. There is no second tree to keep in sync.
> 
> 3. **Encoding is simple.** The server already classifies every expression into attribute/property/event and knows which attribute name it belongs to (via `analyzePosition`). Emitting this as a string attribute is trivial.
> 
> 4. **Caches cleanly.** The client can strip `data-sui-bind` after hydration (same pass as removing comment markers). DevTools stay clean.
> 
> 5. **Eliminates the doubled `buildHTMLString` call.** `hydrateInnerContent` currently calls `buildHTMLString` to get entries, then `hydrateAttributes` calls it again to get the reference DOM. With `data-sui-bind`, `hydrateAttributes` disappears as a concept — attribute binding discovery is folded into a simple element scan.
> 
> 6. **HTML size cost is acceptable.** A typical dynamic element adds ~25 bytes for `data-sui-bind="class:0"`. At 1000 items with 2 dynamic attributes each, that's ~30KB — less than 2% of a typical page payload. Gzip compresses these repetitive patterns extremely well (likely <5KB after compression).
> 
> ### Comparison to Option 3 (Comment Markers)
> 
> Option 3 is the closest alternative. It eliminates the same operations and has similar HTML overhead. The deciding factor is robustness: `data-sui-bind` is an attribute on the target element itself, which means the client finds the element and the binding metadata in one operation. Comment markers require finding the comment, then navigating to the next element sibling, which can fail with intervening text nodes or be disrupted by HTML normalization. The attribute approach is structurally more reliable.
> 
> ### Implementation Sketch
> 
> **Server (`ServerRenderer.renderExpression`, attribute position):**
> 
> When `classification.insideTag` is true, the server currently emits the evaluated value. It would additionally need to accumulate binding metadata for the current element. Since `renderExpression` processes expressions sequentially within a tag, the server can buffer entries until it sees the closing `>` of the current tag, then emit `data-sui-bind="..."` before the `>`.
> 
> Alternatively (simpler): track attribute bindings per-element during the `renderNodes` walk. When an `html` node contains a closing `>`, flush any accumulated bindings as a `data-sui-bind` attribute. This mirrors how `analyzePosition` works — tracking tag open/close state via the htmlBuffer.
> 
> **Client (`hydrateMarkers`):**
> 
> Replace the `hydrateAttributes` call with:
> 
> ```js
> // Single-pass element walk to find data-sui-bind attributes
> const attrWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
> let el;
> while ((el = attrWalker.nextNode())) {
>   const bindAttr = el.getAttribute('data-sui-bind');
>   if (!bindAttr) continue;
>   el.removeAttribute('data-sui-bind');
> 
>   // Parse: "class:0,data-count:1,.value:2,@click:3"
>   for (const part of bindAttr.split(',')) {
>     const [attrSpec, ...ids] = part.split(':');
>     // ... wire Reaction using entry from entries[id], same logic as current
>   }
> }
> ```
> 
> **`hydrateInnerContent` simplification:**
> 
> Currently calls `buildHTMLStringPure(contentAST)` to get entries, then passes them to `hydrateMarkers`. With `data-sui-bind`, attribute entries are no longer needed for the inner content — the markers are already on the DOM elements. `hydrateInnerContent` only needs entries for text and block markers, which are found via the existing comment walker pass.
> 
> This means `hydrateInnerContent` can either:
> - Continue passing the full entries array (comment walker uses entry IDs for text/block markers — unaffected)
> - Or skip entries that are `insideTag` since they're now handled by the attribute scan
> 
> ### Encoding Format
> 
> ```
> data-sui-bind="attrName:entryID[,attrName:entryID]*"
> ```
> 
> Examples:
> - Single dynamic attribute: `data-sui-bind="class:0"`
> - Multiple: `data-sui-bind="class:0,data-id:2"`
> - Multi-expression attribute: `data-sui-bind="class:0+3"` (entries 0 and 3 interleaved in class)
> - Property: `data-sui-bind=".value:1"`
> - Event: `data-sui-bind="@click:2"`
> - Boolean/ifDefined: `data-sui-bind="?disabled:4"` (or just `disabled:4` — classification is already in the entry)
> 
> Note: The `?` prefix for boolean isn't strictly necessary since the entry already contains `classification.type === 'boolean'` or `node.ifDefined`. But making the encoding self-describing means the client doesn't need to look up the entry to know how to wire the binding. This helps if we later want to wire bindings without the full entries array (e.g., for streaming hydration).
> 
> ### What Must Remain Unchanged
> 
> - **Text markers** (`<!--sui:v1:N-->`) — unaffected. They remain as comment nodes.
> - **Block markers** (`<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->`) — unaffected.
> - **Entry ID numbering** — unchanged. The server and client both walk the AST in the same order, assigning sequential IDs. The `data-sui-bind` attribute just references these same IDs.
> - **`buildHTMLString` function** — unchanged. It still produces the entries array and htmlString for normal client rendering. Only the hydration path stops building a reference DOM.
> - **`bindMarkers` (normal client render)** — unchanged. This path uses the reference DOM (which it already has from parseHTML) and doesn't need `data-sui-bind`.

---

## each-hydration
> ## Recommendation: Strategy D (DOM-Reusing First Mutation)
> 
> ### Rationale
> 
> 1. **Preserves zero-cost hydration.** Strategy D is the only approach that keeps hydration at O(1) while also avoiding full DOM rebuild on first mutation. This matters for the primary SSR use case: pages with many lists where most are never mutated.
> 
> 2. **Eliminates the dominant cost.** The expensive part of first mutation is DOM teardown + rebuild, not Reaction setup. A 1000-item list rebuild involves ~2000 DOM node removals + ~2000 DOM node insertions + layout recalculation. Strategy D replaces this with ~6000 `Reaction.create` calls (~60ms) and zero DOM churn for unchanged items.
> 
> 3. **Fits the existing architecture.** The each block already has keyed reconciliation (getItemID), itemSignal + Proxy creation, and DynamicRegion management. Strategy D reuses ALL of this machinery — it's not a new abstraction, it's an alternative entry point into the same data structures.
> 
> 4. **Graceful degradation.** If item boundaries are missing (older server, marker version mismatch), fall back to Strategy A's full rebuild. The marker check is: "does the first node inside the block region start with `sui-item:`?" If no, use the current code path.
> 
> ### Implementation Sketch
> 
> **Server (server.js:renderEach):**
> ```js
> for (let i = 0; i < items.length; i++) {
>   html += `<!--sui-item:${i}-->`;  // <-- add this
>   const eachData = this.getEachData(items[i], i, collectionType, node);
>   const itemData = { ...data, ...eachData };
>   // ... existing render logic
> }
> ```
> 
> **Client (renderer.js:hydrateEach):**
> ```js
> hydrateEach({ node, data, scope, region }) {
>   const itemMap = new Map();
>   let currentKeys = [];
> 
>   // Parse server-rendered item boundaries from region.ownedNodes
>   const serverItems = this.parseItemBoundaries(region.ownedNodes);
> 
>   scope.track(Reaction.create((comp) => {
>     if (!comp.firstRun && !region.anchor.isConnected) {
>       comp.stop();
>       return;
>     }
> 
>     const rawItems = this.eval(node.over, data) || [];
>     const collectionType = this.getCollectionType(rawItems);
>     const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;
> 
>     if (comp.firstRun) {
>       // Build initial key list from server items (for diffing on next run)
>       currentKeys = items.map((item, i) => this.getItemID(item, i, collectionType));
>       return;
>     }
> 
>     // From here: identical to createEach's Reaction body,
>     // except "existing key" case adopts server DOM instead of
>     // assuming prior client render.
>     // ... (standard keyed reconciliation)
>   }));
> }
> ```
> 
> The key addition is `parseItemBoundaries` and modifying the "existing key found" branch to handle server-rendered nodes that don't yet have itemSignal/Proxy/scope. On first mutation, items that still match by key get their server DOM adopted and wired. Items that are new or changed get fresh `readAST` renders. After first mutation, `itemMap` is fully populated and subsequent mutations use the normal `createEach` diffing path.
> 
> ### Cost Summary
> 
> | Scenario | Hydration | First Mutation | Subsequent |
> |---|---|---|---|
> | Strategy A (current) | O(1) | O(N*K) DOM + Reactions | O(diff) |
> | Strategy B (full) | O(N*K) | O(diff) | O(diff) |
> | Strategy D (recommended) | O(1) | O(N*K) Reactions only | O(diff) |
> 
> For 1000 items, 5 expressions each:
> - Strategy A first mutation: ~200ms (DOM rebuild dominates)
> - Strategy D first mutation: ~60ms (Reaction setup only, zero DOM churn for unchanged items)
> - Savings: ~140ms per first mutation, which for search filtering means the difference between dropped frames and smooth interaction.
> 
> ### Risks
> 
> 1. **Stale server DOM.** If the client evaluates expressions differently from the server (time-dependent values, randomness), adopted nodes show stale content until their Reactions fire. Mitigation: Reactions fire synchronously during `hydrateMarkers`, so the DOM updates immediately after adoption. The visual flash is sub-frame.
> 
> 2. **Node count mismatch.** If the server rendered N items but the client evaluates N-1 (data changed between server render and hydration), the boundary markers won't align with the new item list. Mitigation: key-based matching. Only adopt nodes whose key matches. Unmatched server nodes get removed. Unmatched client items get fresh renders.
> 
> 3. **Complexity.** Strategy D adds a third code path (hydrate-adopt) alongside create (fresh render) and update (keyed diff). Mitigation: the adopt path is a thin adapter that calls existing primitives (createItemDataProxy, hydrateMarkers, getItemID). It doesn't introduce new abstractions.

---

## key-to-dom-mapping
> ## Recommendation: Approach B -- Per-Item Comment Markers
> 
> ### Rationale
> 
> 1. **Universality:** Comment markers handle every template shape -- single root, multi-root, text-only, conditional, snippet, nested blocks. They sit outside the content and don't interfere with any element's semantics.
> 
> 2. **Consistency with existing patterns:** The codebase already uses paired comment markers for every block directive (`<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->`). Per-item markers extend this pattern naturally: `<!--sui-item:KEY-->` sits between the block opening and closing markers, one per item. The hydration walker already knows how to scan siblings and match comments.
> 
> 3. **Minimal implementation surface:**
>    - Server: ~5 lines in `ServerRenderer.renderEach` to emit the marker before each item
>    - Client: `hydrateEach` replaces the current "skip on first run, full re-render on change" with "scan item markers, build itemMap, transition to keyed reconciliation" -- mirroring `createEach`'s existing logic
> 
> 4. **Streaming-compatible:** Markers are emitted incrementally as each item renders. No buffering required.
> 
> 5. **HTML size cost is negligible:**
>    - 50-item list with average 8-char keys: ~1.2 KB of markers
>    - Compare to the item content itself (typically 100-500 bytes per item): markers add 5-20% overhead
>    - Compresses extremely well with gzip/brotli (repetitive `<!--sui-item:` prefix)
>    - The alternative (no markers, full list re-render on first change) costs far more: a 50-item list re-render means 50x `readAST` + 50x fragment creation + 50x DOM insertion. The ~1.2 KB of markers prevents that entire operation
> 
> 6. **Hydration speed benefit is concrete:**
>    - Without markers: first reactive change touching the collection triggers `readAST` for every item, discards all server-rendered DOM, re-creates everything. For a 50-item nav menu, that's ~50 `readAST` calls + DOM tree creation
>    - With markers: `hydrateEach` builds `itemMap` from existing DOM on first run (one linear scan, O(n) in DOM nodes). Subsequent changes use keyed reconciliation -- only changed/added/removed items touch the DOM. A single item addition is 1 `readAST` call instead of 50
> 
> ### Marker Format
> 
> ```
> <!--sui-item:KEY-->
> ```
> 
> Where KEY is the string output of `getItemID`. For object items this is typically `id`, `_id`, `key`, etc. For string items it's the string itself. For index-based fallback it's the numeric index.
> 
> Special characters in keys (unlikely but possible) should be escaped. Since this is inside an HTML comment, the only forbidden sequences are `--` and `>`. A simple encoding: replace `-` with `-d` and `>` with `-g` (with `-` as the escape character). This handles edge cases without adding complexity to the common path where keys are alphanumeric.
> 
> ### Server-Side Changes
> 
> In `ServerRenderer.renderEach` (server.js, lines 232-257):
> 
> ```js
> renderEach(node, data, scope) {
>   const id = scope.entryId++;
>   let html = `<!--${BLOCK_MARKER}${id}-->`;
> 
>   const rawItems = this.evaluator.lookupExpressionValue(node.over, data) || [];
>   const collectionType = isArray(rawItems) ? 'array' : 'object';
>   const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;
> 
>   if (isEmpty(items) && node.elseContent) {
>     html += this.renderNodes(node.elseContent, data);
>   }
>   else {
>     for (let i = 0; i < items.length; i++) {
>       const eachData = this.getEachData(items[i], i, collectionType, node);
>       const itemData = { ...data, ...eachData };
>       const key = this.getItemID(items[i], i, collectionType);  // NEW
>       html += `<!--sui-item:${key}-->`;                          // NEW
>       const itemEvaluator = new ExpressionEvaluator({ data: itemData, helpers: this.helpers });
>       const savedEvaluator = this.evaluator;
>       this.evaluator = itemEvaluator;
>       html += this.renderNodes(node.content, itemData);
>       this.evaluator = savedEvaluator;
>     }
>   }
> 
>   html += `<!--/sui-block:v1:${id}-->`;
>   return html;
> }
> ```
> 
> Note: `getItemID` needs to be added to `ServerRenderer` (or extracted to a shared utility). The logic is identical to the client's `Renderer.getItemID`.
> 
> ### Client Hydration Changes
> 
> Replace the current `hydrateEach` (which does full re-render on any change) with a version that:
> 
> 1. On first run: scans `ownedNodes` for `<!--sui-item:KEY-->` markers, groups nodes between markers, populates `itemMap` with `{ nodes, itemSignal, scope }` per item
> 2. On subsequent runs: uses the same keyed reconciliation as `createEach` -- reuse existing items by key, create new ones, remove stale ones
> 
> The inner content of each item (expressions, conditionals, nested blocks) has already been hydrated by `hydrateInnerContent` during the block directive processing in `hydrateBlockDirective`. The per-item marker scanning only needs to know node boundaries, not parse inner content.
> 
> ### Impact on Existing Tests
> 
> All existing hydration tests pass without modification -- the per-item markers are additional comments that the test helpers strip:
> ```js
> function shadowHTML(el) {
>   return el.shadowRoot.innerHTML
>     .replace(/<!--[\s\S]*?-->/g, '')  // strips all comments including sui-item markers
>     .replace(/\s+/g, ' ')
>     .trim();
> }
> ```
> 
> New tests should verify:
> - Per-item hydration preserves DOM nodes when a single item is added/removed
> - Keyed reconciliation works after hydration (reorder, insert, delete)
> - Multi-root items are correctly grouped
> - Empty list -> non-empty list transition works
> - Non-empty list -> empty list (else content) works
> - Nested each loops have independent item markers

---

## hashcode-removal
> ## Recommendation: Remove `this.id` and unused `hashCode` import from native Renderer
> 
> ### What to change
> 
> 1. **Remove line 58** (`this.id = ++Renderer._nextId`) from the native Renderer constructor
> 2. **Remove `hashCode` from the import** on line 8 (it is not called anywhere)
> 3. **Remove the explanatory comment** on lines 52-57 (references the removed code)
> 
> ### What NOT to change
> 
> - **LitRenderer.getID** and its `this.id` assignment — the `getID` method is actively used by `renderContent()` for subtree caching. The constructor's `this.id` is technically dead but removing it could break assumptions if external code ever inspects renderer identity. Low risk to leave; zero cost since the hash is already computed for `renderContent`.
> - **LitRenderer.getID's dead `isSVG` parameter** — cosmetic cleanup, not a perf issue, and changing the signature could break callers.
> 
> ### Performance impact
> 
> The sequential ID (`++Renderer._nextId`) is nearly free — a single increment. But it's dead code that produces `NaN`, which is worse than useless: it signals intent that doesn't exist. Removing it eliminates one property allocation per Renderer instance and removes a misleading import.
> 
> The real win was the prior change from `hashCode({ ast, data, isSVG })` to the sequential ID, which eliminated ~1.4ms of JSON serialization + FNV-1a hashing per Renderer construction. That win is already captured. This cleanup removes the vestigial remnant.
> 
> ### Secondary cleanup opportunity
> 
> The `hashCode` removal unblocks removing the entire `@semantic-ui/utils` `hashCode` import if no other call sites exist in this file. After the edit, the import line should be updated to exclude `hashCode`.
> 
> ## Files
> 
> | File | Change |
> |------|--------|
> | `packages/renderer/src/engines/native/renderer.js:8` | Remove `hashCode` from import |
> | `packages/renderer/src/engines/native/renderer.js:52-58` | Remove comment block and `this.id` assignment |

---

## signal-stack-trace
> ## Recommendation: Option B (Lazy Stack Trace via Debug Flag)
> 
> **Rationale:**
> 
> 1. **Addresses the actual bottleneck.** The captureStackTrace cost lives in the Dependency
>    constructor, not in Signal-specific logic. Options A and C don't eliminate it without
>    also changing Dependency.
> 
> 2. **Broadest impact.** This benefits every Signal and Dependency in the system, not just
>    dataVersion. For a page with 30 components and ~240 Signals, eliminating ~240
>    captureStackTrace calls at ~5-10us each saves **~1.2-2.4ms** of initialization time.
>    The ongoing mutation savings (2 calls per bumpDataVersion per re-render) compound during
>    interaction.
> 
> 3. **Minimal API surface change.** `Reaction.getSource()` already requires the developer
>    to be inside a flush callback. Adding `Dependency.debug = true` (or
>    `import { enableDebug } from '@semantic-ui/reactivity'`) is a one-time setup for
>    developers who use this diagnostic.
> 
> 4. **Zero cost in production.** Stack traces serve no purpose in production builds. A
>    debug flag makes this explicit.
> 
> 5. **Chesterton's fence respected.** The traces exist for `Reaction.getSource()`. The
>    flag preserves that capability entirely -- it just moves from always-on to opt-in.
> 
> ### Estimated Savings
> 
> | Scenario | Signals Created | captureStackTrace Calls Eliminated | Time Saved |
> |---|---|---|---|
> | Single component init | ~8 | ~8 (construction) | ~40-80us |
> | Page with 30 components | ~240 | ~240 (construction) | ~1.2-2.4ms |
> | 30 components, each re-renders once | ~240 | ~240 + 60 (mutations) | ~1.5-3.0ms |
> | Heavy interaction (100 bumpDataVersion) | - | 200 (mutations) | ~1.0-2.0ms |
> 
> ### Implementation Sketch
> 
> ```js
> // dependency.js
> export class Dependency {
>   static debug = false;
> 
>   constructor(...metadata) {
>     this.subscribers = new Set();
>     this.context = metadata;
>     if (Dependency.debug) {
>       this.captureTrace(this.context);
>     }
>   }
> 
>   captureTrace(context) {
>     if (Error.captureStackTrace) {
>       Error.captureStackTrace(context, this.captureTrace);
>     } else {
>       context.stack = new Error().stack;
>     }
>   }
> 
>   setContext(context = {}) {
>     if (Dependency.debug) {
>       this.captureTrace(context);
>     }
>     this.context = context;
>   }
> 
>   // ... rest unchanged
> }
> ```
> 
> ```js
> // signal.js -- setTrace() also guarded
> setTrace() {
>   if (Dependency.debug) {
>     if (Error.captureStackTrace) {
>       Error.captureStackTrace(this.context, this.setTrace);
>     } else {
>       this.context.stack = new Error().stack;
>     }
>   }
> }
> ```
> 
> The `Scheduler.getSource()` method should log a warning if `Dependency.debug` is false
> and no stack is available, guiding developers to enable it.
> 
> ### Risks
> 
> - **Debugging friction increase.** A developer hitting an issue for the first time
>   won't have traces available. They'll need to enable debug mode and reproduce. This is
>   mitigated by a clear console warning from `getSource()`.
> - **Test coverage.** Tests that exercise `Reaction.getSource()` need `Dependency.debug = true`
>   in setup. Check for any such tests before implementing.
> 
> ### What NOT to Do
> 
> - Don't create a Counter class or LightSignal -- it fragments the reactive API for a
>   narrow win that the debug flag achieves more broadly.
> - Don't make dataVersion a bare Dependency -- the `.get()` / `.increment()` API is cleaner
>   and consistent with the rest of the codebase. The real cost is in Dependency, not Signal.
> - Don't remove traces entirely -- `Reaction.getSource()` is a valuable debugging tool
>   that justifies its existence. Just make it opt-in.

---

## lazy-hydration
> ## Recommendation: Not pursued at this time
> 
> **Rationale:**
> 
> 1. **The existing rAF deferral already solves the paint problem.** DSD content is visible instantly. The user sees the page before any hydration runs. This is the high-value win that SSR + DSD already delivers.
> 
> 2. **The post-paint blocking window (100-250ms for 50 components) is real but not critical.** This is comparable to React hydration on similar-complexity pages. The native renderer's hydration is already 33% faster than Lit. The ROI of lazy hydration is marginal relative to the contract breakage risk.
> 
> 3. **The contract surface is too wide.** Five distinct APIs (`el.component`, `el.dataContext`, `findParent`, `findChild`, `Template.renderedTemplates`) plus Query's `.component()` helper all assume hydration has completed. Making these lazy-safe requires either:
>    - A Promise-based API (`await el.whenHydrated()`) -- breaks synchronous call sites
>    - Auto-hydration on access (`el.component` getter triggers hydration) -- unpredictable timing, hidden performance cliffs
>    - Both of these are worse than the problem they solve
> 
> 4. **The real optimization target is hydration speed, not hydration timing.** The SSR plan already identifies the path: cache `_hydrationEntries` on the prototype (done), then move to WASM for string operations. A 2x speedup in `hydrateMarkers` would reduce the 100-250ms window to 50-125ms -- more impactful than lazy hydration and zero risk to contracts.
> 
> 5. **If pursued later, opt-in per-component is the only safe shape.** A `hydration: 'lazy'` option in `defineComponent` that the component author explicitly chooses, with documentation that `el.component` is unavailable until hydration. This puts the contract tradeoff in the hands of the person who knows whether the component needs immediate programmatic access. But even this should wait until there's empirical evidence that post-paint hydration time is a user-facing problem on real pages.
> 
> ## What to do instead
> 
> 1. **Profile real docs pages** with the existing `globalThis.__hydTiming` instrumentation to get actual numbers. The estimates above are theoretical.
> 2. **Optimize `hydrateMarkers` itself** -- the parallel walker approach, the `buildHTMLString` call during attribute hydration, and the Reaction creation loop are all candidates for micro-optimization.
> 3. **Batch rAF hydrations with yielding** -- instead of running all 50 hydrations in one rAF, yield to the browser every N components (e.g., hydrate 5, yield via `setTimeout(0)`, hydrate 5 more). This keeps the visual painted AND keeps the main thread responsive. This is a much safer version of "lazy hydration" that preserves all contracts.
> 
> Option 3 (rAF batching with yielding) is the recommendation if post-paint interactivity is measured as a real problem. It preserves all contracts, requires no API changes, and can be implemented entirely within `connectedCallback` using a shared hydration queue.

---

## attribute-discovery-arbitration
> ## Recommendation: Option A (Server-Embedded `data-sui-bind`)
> 
> Option A is the clear winner across all five evaluation dimensions.
> 
> The core insight is that the alignment problem (template structure != live DOM structure) is the fundamental cost of the current approach, and the two options address it differently:
> 
> - **Option A eliminates the alignment problem.** The binding metadata is on the target element. There is no second tree. No alignment needed.
> 
> - **Option B shifts the alignment problem.** Instead of DOM-to-DOM alignment (via parallel TreeWalkers), it uses AST-to-DOM alignment (via ordinal counting with block-owned skipping). The bookkeeping changes; the fundamental challenge remains. And the new alignment has a strictly weaker correctness guarantee because the AST traversal doesn't go through the browser's HTML parser, opening the door to implicit-element bugs (`<tbody>`, SVG auto-namespacing).
> 
> Option A's only downside is ~25 bytes per bound element of HTML overhead, which gzip reduces to near-zero and which is orders of magnitude smaller than the performance benefit.
> 
> The implementation scope is moderate and well-contained: ~80 lines of server logic to emit the attribute, ~80 lines of client logic to consume it (replacing the current ~100-line `hydrateAttributes`). No compiler changes. No AST format changes. Clean fallback for version mismatches.

---
