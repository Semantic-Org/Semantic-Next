# Attribute Discovery During Hydration: Arbitration of Options A vs B

## Chesterton's Fence: Why the Reference DOM Exists

Before evaluating replacements, the critical question: why does `hydrateAttributes` build a reference DOM at all?

The answer is precise and narrow. During normal client rendering (`bindMarkers`, line 175), the renderer parses its own `htmlString` into a DOM fragment, and attribute markers like `__sui3__` survive in the parsed DOM as literal attribute values. A single `TreeWalker(SHOW_ELEMENT)` pass finds elements with `ATTR_MARKER_PREFIX` in their attributes, extracts marker IDs, and wires Reactions. No alignment problem exists because there's only one DOM.

During **hydration**, the DOM already exists (server-rendered). The server evaluated expressions inline: `class="dark"` not `class="__sui3__"`. The markers are gone. The hydrator must rediscover which elements have dynamic attributes and which entry IDs correspond to them.

The reference DOM reconstructs what the client would have produced. By walking both DOMs in parallel (reference element N = real element N), the hydrator maps each reference element's marker-bearing attributes to the corresponding real DOM element. The `blockOwnedElements` set exists because block directives (`{#if}`, `{#each}`) are single comment nodes in the reference DOM but expand to N elements in the real DOM. Without skipping block-owned elements, the parallel walkers desync after the first block.

The design is sound. The cost profile at scale is not:
- `buildHTMLStringPure(ast)`: ~1ms (pure string concatenation)
- `template.innerHTML = htmlString`: ~4ms (HTML parsing to build reference DOM)
- `blockOwnedElements` walk: ~1ms (sibling + descendant enumeration per block)
- Parallel TreeWalker: ~2ms (element-by-element matching)
- **Total: ~8ms at 1000 items**

Additionally, `hydrateInnerContent` (line 1592) calls `buildHTMLStringPure(contentAST)` to get entries, then `hydrateMarkers` calls `hydrateAttributes` which calls `buildHTMLStringPure` again on the same AST to build the reference DOM. This doubles the string assembly cost for every block with attribute bindings.

---

## Option A: Server-Embedded `data-sui-bind` Attribute

### Mechanism

The server emits `data-sui-bind="class:0,data-id:2"` on elements with dynamic attributes. During hydration, a single `TreeWalker(SHOW_ELEMENT)` finds elements with this attribute, parses the spec, and wires Reactions.

### What Browser Operations Are Eliminated

| Operation | Current Cost (1000 items) | After Option A |
|---|---|---|
| `buildHTMLStringPure` in `hydrateAttributes` | ~1ms | **Eliminated** |
| `template.innerHTML` (reference DOM parse) | ~4ms | **Eliminated** |
| `blockOwnedElements` walk | ~1ms | **Eliminated** |
| Parallel TreeWalker | ~2ms | **Eliminated** |
| Single SHOW_ELEMENT walker + attr check | N/A | **~0.5ms** (new) |
| `data-sui-bind` removal | N/A | **~0.3ms** (new) |
| **Net** | **~8ms** | **~0.8ms** |

The doubled `buildHTMLStringPure` calls in `hydrateInnerContent` paths are also eliminated. For recursive structures (each > if > snippet with attributes), this prevents O(depth) redundant string assembly.

### Server-Side Complexity

The server must track "which element am I currently inside" during `renderExpression`. Currently, `renderExpression` (server.js line 143) calls `analyzePosition(scope.htmlBuffer)` which already determines whether an expression is inside a tag and which attribute it belongs to. The classification information exists; it just isn't persisted.

Implementation path: Add a `currentElementBindings` array to the scope. When `classification.insideTag` is true, push `{attrName, entryId}`. When the next `html` node closes the tag (contains `>`), flush accumulated bindings as `data-sui-bind="..."` before the `>`.

The flush-on-close-tag approach mirrors how `analyzePosition` already works (tracking `lastOpen`/`lastClose` state via htmlBuffer). It doesn't change the server's single-pass architecture.

### Edge Case Analysis

**Tables with implicit `<tbody>`:** The browser auto-inserts `<tbody>` during HTML parsing. This would affect Option B (ordinal counting) but not Option A. `data-sui-bind` is on the element itself; even if the browser reparents elements, the attribute travels with them.

**SVG namespace:** SVG elements parsed from innerHTML may behave differently than SVG elements in an already-parsed server document. Irrelevant for Option A since no innerHTML parse occurs.

**Text node merging:** Adjacent text nodes can merge during HTML parsing, changing child counts and ordinals. Option A is unaffected; it only walks elements and reads their own attributes.

**Conditional content inside elements:** `<div class="{#if x}a{else}b{/if}">` is illegal (block directives can't appear inside attribute values), so this case doesn't arise. Conditional content between elements creates block markers, which Option A ignores entirely (it only processes `data-sui-bind`).

**Property/event bindings:** These are `REMOVE_ATTR`'d from server HTML. They don't appear in the real DOM at all. Option A encodes them in `data-sui-bind` with `.` and `@` prefixes (e.g., `data-sui-bind=".value:1,@click:2"`). The server already strips them from the HTML; it just also writes them into the bind attribute.

**Multi-expression attributes:** `class="base {mod} {size}"` has entries interleaved with static parts. Encoding: `data-sui-bind="class:1+3"` (entry IDs). The client reconstructs the part layout: static text from the entries array, marker positions from the bind spec. This works because the entries array already contains `classification.attribute` for each entry.

### HTML Size Overhead

Per element with dynamic attributes: `data-sui-bind="class:0"` is ~22 bytes. `data-sui-bind="class:0,data-count:1,.value:2,@click:3"` is ~52 bytes.

At 1000 items with 2 dynamic attrs each: ~25-30KB raw. After gzip: ~2-4KB (highly repetitive patterns compress to near-zero).

---

## Option B: AST-Derived Element Ordinal Map

### Mechanism

During `buildHTMLString`, compute an `elementOrdinal` for each attribute entry by counting opening tags in the html nodes. Cache this map on the prototype. During hydration, walk the real DOM with `SHOW_ELEMENT`, count elements (skipping block-owned ones), and look up bindings by ordinal.

### What Browser Operations Are Eliminated

| Operation | Current Cost (1000 items) | After Option B |
|---|---|---|
| `buildHTMLStringPure` in `hydrateAttributes` | ~1ms | **Eliminated** (cached) |
| `template.innerHTML` (reference DOM parse) | ~4ms | **Eliminated** |
| `blockOwnedElements` walk | ~1ms | **Retained** |
| Single SHOW_ELEMENT walker with ordinal counting | ~2ms | **Retained** (modified) |
| **Net** | **~8ms** | **~3ms** |

### The Fundamental Issue: blockOwnedElements Is Retained

This is the decisive architectural difference. Option B replaces the reference DOM TreeWalker with an ordinal-counting TreeWalker, but the block-owned-element skipping problem remains identical. The ordinal map says "entry 5 is on element ordinal 3," but the real DOM has expanded blocks, so the walker must skip block-owned elements to reach "element ordinal 3" relative to the template structure.

The `blockOwnedElements` walk (lines 1208-1229) is a non-trivial piece of machinery:
1. Find all block marker comments in the real DOM
2. For each marker pair, walk siblings to find the closing marker
3. For each element inside the pair, run a nested TreeWalker to mark all descendants
4. Build a Set of all block-owned elements
5. Use this Set as a NodeFilter for the counting walker

This entire mechanism exists solely to align template-structure ordinals with live-DOM positions. Option A eliminates the need for this alignment entirely. Option B preserves it.

### Edge Case Analysis

**Tables with implicit `<tbody>`:** The browser inserts `<tbody>` elements that don't exist in the AST. If the AST counts element ordinals based on opening tags, it won't count `<tbody>`. But the DOM walker will encounter it. Unless the walker has special logic to skip auto-inserted elements (which is fragile and browser-dependent), the ordinals desync.

This is not a theoretical concern. A template like:
```html
<table><tr><td class="{cls}">...</td></tr></table>
```
produces the AST: `<table>` (ordinal 0), `<tr>` (ordinal 1), `<td>` (ordinal 2). But the browser DOM is: `<table>`, `<tbody>`, `<tr>`, `<td>` — ordinals 0, 1, 2, 3. Entry on ordinal 2 (td in AST) would bind to ordinal 2 in DOM (tr), not ordinal 3 (td).

The reference DOM approach handles this automatically: both DOMs go through the browser's HTML parser, so both get the implicit `<tbody>`. Option A handles it because the marker is on the element itself. Option B has a real bug here.

**SVG namespace elements:** Similar issue. SVG has different parsing rules, and some elements may be auto-namespaced differently. Option B must handle this; Option A doesn't care.

**DOM normalization:** Browsers may normalize attribute order, whitespace handling, or self-closing tags differently than the AST predicts. Option B's ordinal contract spans the AST-to-DOM boundary. Option A's contract is element-local (the attribute is on the element).

### Cacheability Advantage

The ordinal map is cacheable on the prototype (it depends only on AST structure, not data). This means the `buildHTMLStringPure` call in `hydrateAttributes` can be completely eliminated after the first instance. This is a genuine advantage for components with many instances — the cache is computed once.

However, `hydrateAttributes` is already called per-instance (each hydration builds its own reference DOM). The ordinal map caching would eliminate the per-instance `buildHTMLStringPure` and `innerHTML` costs. At 1000 instances of the same component, this is significant. But Option A also has zero per-instance compute overhead — the markers are already in the DOM from the server.

---

## Comparative Analysis

### Performance

**Option A wins.** It eliminates ~7.2ms of the ~8ms cost. Option B eliminates ~5ms but retains the blockOwnedElements walk (~1ms) and the ordinal-counting walker (~2ms modified). The gap is ~2-3ms, which is meaningful at scale.

The difference is structural: Option A moves information to where it's consumed (the DOM element), so discovery is O(elements with bindings). Option B requires a global alignment pass (blockOwnedElements) that is O(all elements in block regions), regardless of how many have bindings.

### Complexity

**Option A wins.** Lines changed:

- Option A: ~30 lines in server.js (flush logic), ~40 lines replacing `hydrateAttributes` in renderer.js, ~10 lines simplifying `hydrateInnerContent`. Net: remove ~80 lines, add ~80 lines. The new code is simpler (no parallel walk, no blockOwnedElements).

- Option B: ~20 lines in build-html-string.js (ordinal computation), ~30 lines for prototype caching, ~20 lines modifying `hydrateAttributes` to use ordinals (blockOwnedElements walk remains). Net: add ~70 lines, remove ~30 lines. The remaining code retains the blockOwnedElements complexity.

Systems touched: Option A touches server.js and renderer.js. Option B touches build-html-string.js and renderer.js. Neither touches the compiler.

### Robustness

**Option A wins decisively.** The `<tbody>` issue alone is disqualifying for Option B without additional engineering. Option A has zero alignment fragility because there is no cross-tree alignment — the marker is co-located with the target.

Option A's main robustness risk is "does the server emit the attribute correctly?" Since the server already classifies expressions via `analyzePosition` and already tracks `scope.htmlBuffer`, this is a low-risk extension of existing logic.

Option B's robustness risk is "does the AST ordinal match the DOM ordinal after the browser parses the HTML, with block-owned elements skipped?" This is the same alignment problem the reference DOM exists to solve, just with different bookkeeping. The reference DOM works because both trees go through the same parser. Option B replaces one tree with an AST traversal that doesn't go through the parser, introducing a category of alignment bugs.

### Maintenance

**Option A wins.** Six months from now, a contributor looking at the hydration code will see:

- Option A: "Walk elements, if `data-sui-bind` exists, parse it and wire Reactions." Self-explanatory. The binding metadata is visible in DevTools during debugging (before cleanup).

- Option B: "Walk elements, count ordinals, skip block-owned elements, look up ordinal in prototype-cached map." Requires understanding the blockOwnedElements mechanism and the AST-to-DOM ordinal contract. Same conceptual load as today.

### Composability with Other Optimizations

**Option A is equal or better.**

- *Inline marker removal*: Option A naturally extends. If comment markers are also eliminated in favor of element-local metadata, the approach generalizes.
- *Per-item each markers*: Block markers remain as comments regardless of approach. Neither option changes how blocks work.
- *Expression eval fast path*: Both approaches wire Reactions the same way after discovery. Neither affects eval performance.
- *Streaming hydration*: Option A's self-describing encoding (`data-sui-bind=".value:1,@click:2"`) means elements can be hydrated as they stream in without needing the full entries array upfront. Option B requires the ordinal map (which requires the full AST) before any element can be hydrated.

---

## Concerns with Option A: Addressed

### "Changes server output format"

Yes. This is a feature, not a bug. The server format is internal to the framework (not a public API). The existing `MARKER_VERSION` field in comment markers already provides version handling. Adding a version check for `data-sui-bind` presence is trivial.

### "Requires server to track current element"

The server already tracks tag open/close state via `scope.htmlBuffer` and `analyzePosition`. Accumulating binding metadata is a lightweight extension of this existing tracking.

### "Attribute must be cleaned up after hydration"

One `removeAttribute('data-sui-bind')` per bound element, inside the same walker pass that reads it. This is a single DOM mutation per bound element, which is fast (~0.001ms each). At 1000 elements: ~1ms total, already accounted for in the estimate.

### "Existing cached/CDN'd server HTML would need version handling"

The hydration code already checks `MARKER_VERSION` in comment markers and falls back to full render on mismatch. The same pattern applies: if `data-sui-bind` is expected but absent, fall back to the reference DOM path. This provides a clean upgrade path with zero risk of breaking existing cached content.

---

## Recommendation: Option A (Server-Embedded `data-sui-bind`)

Option A is the clear winner across all five evaluation dimensions.

The core insight is that the alignment problem (template structure != live DOM structure) is the fundamental cost of the current approach, and the two options address it differently:

- **Option A eliminates the alignment problem.** The binding metadata is on the target element. There is no second tree. No alignment needed.

- **Option B shifts the alignment problem.** Instead of DOM-to-DOM alignment (via parallel TreeWalkers), it uses AST-to-DOM alignment (via ordinal counting with block-owned skipping). The bookkeeping changes; the fundamental challenge remains. And the new alignment has a strictly weaker correctness guarantee because the AST traversal doesn't go through the browser's HTML parser, opening the door to implicit-element bugs (`<tbody>`, SVG auto-namespacing).

Option A's only downside is ~25 bytes per bound element of HTML overhead, which gzip reduces to near-zero and which is orders of magnitude smaller than the performance benefit.

The implementation scope is moderate and well-contained: ~80 lines of server logic to emit the attribute, ~80 lines of client logic to consume it (replacing the current ~100-line `hydrateAttributes`). No compiler changes. No AST format changes. Clean fallback for version mismatches.
