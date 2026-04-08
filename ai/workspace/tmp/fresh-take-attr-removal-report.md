# Analysis: DOM Implications of Removing Data Attributes During rAF

## Question 1: Concrete Browser-Internal Consequences of `removeAttribute` on an Unmatched `data-*` Attribute in Shadow DOM

When `removeAttribute('data-sui-bind')` is called on an element where that attribute is not referenced by any CSS selector, not observed by any JavaScript (no `MutationObserver`, not in `observedAttributes`), and lives inside a shadow root, here is what the browser engine actually does, step by step:

### Step 1: DOM Tree Mutation (unavoidable)

The `Element::removeAttribute` implementation in all major engines (Blink's `Element::removeAttributeInternal`, Gecko's `Element::UnsetAttr`, WebKit's `Element::removeAttributeInternal`) performs the following:

1. **Attribute lookup** — The engine searches the element's `NamedNodeMap` (or equivalent internal `AttributeVector`/`AttrArray`) for the named attribute. This is a linear scan over the element's attribute list. For a typical element with 3-8 attributes, this is trivially fast (nanosecond scale).

2. **Attribute storage removal** — The attribute node/entry is removed from the internal attribute storage. In Blink, this means removing from the `ElementData`'s `AttributeVector`. If the element uses a `ShareableElementData` (shared across identical elements), this triggers a copy-on-write to `UniqueElementData` — though for hydrated web component shadow DOM elements that already have unique bindings, they'll typically already have `UniqueElementData`.

3. **`dataset` cache invalidation** — Since `data-*` attributes are reflected via the `DOMStringMap` (`element.dataset`), the engine marks the dataset proxy as stale. This is a flag flip, not a computation. If nobody reads `dataset` after this point, no work results.

4. **DOM mutation notification dispatch** — The engine fires its internal "attribute changed" notification. This is the routing point where downstream consumers are notified. With no `MutationObserver` and no `attributeChangedCallback` registered for this attribute, the internal dispatch finds zero listeners and returns immediately.

### Step 2: Style Invalidation (conditionally skipped)

This is the critical performance-relevant step. Here's what actually happens:

1. **Invalidation set check** — Modern engines (Blink since ~2017, Gecko similarly) maintain **style invalidation sets** — precomputed data structures derived from all stylesheets in scope. These sets record which attribute names, class names, IDs, and pseudo-classes appear in any selector. When an attribute is mutated, the engine checks the invalidation set for that attribute name.

2. **For `data-sui-bind` with no matching selector** — The attribute name will NOT appear in the invalidation set. The engine performs a hash lookup (O(1)) against the set, finds no match, and **skips style invalidation entirely**. No `ComputedStyle` recalculation is scheduled. This is the single biggest optimization: the style system is not touched at all.

3. **Scope of the check** — Inside a shadow root, the engine only checks the shadow root's invalidation sets (derived from `<style>` elements or adopted stylesheets within that shadow root), not the document-level stylesheets. This is a fundamental property of style scoping in shadow DOM (addressed further in Question 2).

### Step 3: Layout Invalidation (skipped)

Since style invalidation was skipped (no selector matched), no `ComputedStyle` changed, so no layout properties changed. The layout tree is not marked dirty. **Zero layout work.**

### Step 4: Paint Invalidation (skipped)

Since no style changed and no layout was invalidated, no paint invalidation occurs. The composited layers are untouched. **Zero paint work.**

### Step 5: Rendering Pipeline Impact

The `requestAnimationFrame` callback runs at the beginning of the frame's rendering pipeline (after microtasks, before style/layout/paint). The `removeAttribute` calls complete synchronously within the callback. Since no style invalidation was triggered, the subsequent style recalculation phase of that frame has no additional work from these mutations. The entire rAF callback is effectively a series of DOM tree edits with no rendering cascade.

### Net Cost Per Element

For a single unmatched `data-*` attribute removal:
- **~50-200 nanoseconds** for the attribute lookup + removal + internal bookkeeping
- **~10-30 nanoseconds** for the invalidation set hash lookup (miss)
- **Zero** style, layout, or paint cost

For 20 elements in a shadow root: **~1-5 microseconds total**. For 50 components x 20 elements = 1000 elements across a page: **~50-200 microseconds total**. This is well within a single frame budget (16.6ms) and would not register on a performance trace.

---

## Question 2: Shadow Root vs. Light DOM Style Invalidation Scope

### Shadow DOM: Scoped Invalidation

When `removeAttribute` is called on an element inside a shadow root, the style invalidation check is scoped to the shadow root's own stylesheets:

1. **Each shadow root maintains its own `StyleEngine`/`StyleResolver` data** — In Blink, this is the `ShadowRootStyleSheetCollection` which tracks adopted stylesheets and `<style>` elements within the shadow root. Gecko similarly maintains per-shadow-root style data via `ServoStyleSet`.

2. **Invalidation sets are per-scope** — The invalidation sets (which record what attribute names appear in selectors) are built from the shadow root's stylesheets only. When `removeAttribute` is called, the engine checks ONLY the shadow root's invalidation sets.

3. **Document stylesheets are NOT checked** — This is a fundamental guarantee of shadow DOM encapsulation. Even if the document has a selector like `[data-sui-bind] { color: red }`, it cannot match elements inside a shadow root (barring `::part()` which uses a different mechanism). The engine does not waste time checking document-level invalidation sets for shadow-scoped elements.

4. **`:host` context selectors** — The one nuance is `:host([data-sui-bind])` style rules. If such a rule existed in the shadow root's styles, it would reference the host element's attributes, not the inner elements'. Since the `data-sui-bind` attributes are on inner elements, this is irrelevant. But even if it were on the host, only that single host element would be invalidated.

### Light DOM: Broader Invalidation

In contrast, `removeAttribute` on a light DOM element checks the document's full stylesheet invalidation sets:

1. **All document stylesheets** — Every `<link rel="stylesheet">`, `<style>`, and adopted stylesheet on the document is included in the invalidation set.

2. **Broader scope of potential matches** — Third-party stylesheets, browser extension injected styles, and user stylesheets are all included. The invalidation set is larger, and the probability of a match (and thus expensive style recalculation) is higher.

3. **Subtree invalidation** — If a light DOM selector matches, the invalidation may affect descendants. In shadow DOM, even if a shadow-root-scoped selector matched, the invalidation is naturally bounded by the shadow root's subtree.

### Practical Difference

For this use case (removing `data-sui-bind` from shadow DOM elements), the shadow boundary provides a meaningful performance advantage:

- The invalidation set check is against a small, known set of styles (only the component's own styles).
- No external stylesheet can accidentally cause a style invalidation.
- The worst-case invalidation scope is bounded to the shadow root's subtree (~5-50 elements), not the entire document.

This makes the shadow DOM case strictly faster and more predictable than the equivalent light DOM operation.

---

## Question 3: Worst-Case Impact When a CSS Selector Matches

If a selector like `[data-sui-bind]` exists — either in the shadow root's styles (the only case that would actually match), a user's stylesheet (wouldn't match shadow DOM elements, but would match light DOM elements), or a browser extension's injected styles (complex — some extensions use `!important` + `all: initial` or inject into shadow roots) — here's the worst-case analysis for removing the attribute from 1000 elements in a single rAF callback:

### Style Recalculation

1. **Each `removeAttribute` triggers a style invalidation** — The element is marked as needing style recalculation. Modern engines batch these invalidations; they don't recalculate immediately on each mutation.

2. **Batched recalculation** — All 1000 elements are marked dirty during the synchronous rAF callback. When the browser's rendering pipeline reaches the "recalc style" phase, it processes all dirty elements in one pass.

3. **Cost per element** — Style recalculation for a single element involves matching the element against all applicable selectors and computing the `ComputedStyle`. For a shadow root with ~5-20 rules, this is fast (~1-5 microseconds per element). For a document with hundreds of rules, it's more expensive (~5-20 microseconds per element).

4. **For 1000 elements** — In the shadow DOM case (small stylesheet): **~1-5 milliseconds**. In a hypothetical light DOM case with a large stylesheet: **~5-20 milliseconds** (potentially problematic for frame budget).

### Selector Specifics Matter

The type of selector changes the invalidation strategy:

- **`[data-sui-bind]`** (simple attribute selector) — Only the element itself is invalidated. This is the best case. No descendant invalidation.
- **`[data-sui-bind] > .child`** (descendant/child combinator) — The engine must also invalidate children of the changed element, because removing the attribute may change whether `.child` descendants match. This broadens the invalidation scope.
- **`[data-sui-bind] ~ .sibling`** (sibling combinator) — Subsequent siblings must also be invalidated. This is the most expensive pattern.

### Layout Thrashing

If the matched CSS selector changes layout-affecting properties (width, height, padding, display, position, etc.):

1. **Each element gets a layout invalidation** — The element and its ancestors up to the layout root are marked as needing layout.
2. **For 1000 elements across 50 shadow roots** — Each shadow root is its own layout scope (if the host creates a formatting context, which it typically does for block-level custom elements). Layout invalidation within one shadow root doesn't propagate to siblings.
3. **Worst case** — If the selector changes `display` or `position`, the entire subtree of each affected element needs relayout. For 1000 elements: **~5-15 milliseconds** for layout.

### Paint Invalidation

If the selector changes visual properties (color, background, border, opacity, transform, etc.):

1. **Paint invalidation per element** — Each element is marked for repaint. The browser batches these into paint regions.
2. **Composited layers** — If elements are on their own compositor layers (due to `will-change`, `transform`, `opacity`, etc.), the repaint is isolated to those layers. Otherwise, the paint region expands to cover all affected elements.
3. **For 1000 elements** — Repaint cost depends heavily on whether the elements share layers. Worst case (all in one layer, spread across the viewport): **~2-10 milliseconds**.

### Total Worst-Case Budget

For 1000 elements with a matching selector that changes both layout and paint properties:
- Style recalc: ~5-20ms
- Layout: ~5-15ms
- Paint: ~2-10ms
- **Total: ~12-45ms** (1-3 frames dropped)

This would be a visible jank event. However, this scenario requires:
1. A CSS selector actually matching `[data-sui-bind]` inside the shadow root
2. That selector affecting layout/paint properties
3. 1000 elements being mutated

In the intended use case (no matching selector), the cost is ~0.05-0.2ms total, which is negligible.

---

## Question 4: Edge Cases and Non-Obvious Behaviors

### Custom Element `attributeChangedCallback`

- **`observedAttributes` gating** — `attributeChangedCallback` is only invoked for attributes listed in the element's static `observedAttributes` array. If `data-sui-bind` is not in `observedAttributes`, the callback is never invoked — the engine checks the set before dispatching.
- **If observed** — If a custom element inside the shadow root happens to observe `data-sui-bind` (unlikely but possible with third-party components), the callback fires synchronously during `removeAttribute`. This could trigger arbitrary JavaScript execution, including DOM mutations, within the TreeWalker iteration. However, since the attribute is being removed (not added), and the TreeWalker walks forward, this is safe — removed attributes don't affect element ordering.
- **Host element distinction** — The elements inside the shadow root are typically plain HTML elements (div, span, etc.), not custom elements. Custom element children would be unusual in this context. If they are present, only their own `observedAttributes` matters.

### MutationObserver Notifications

- **Microtask timing** — `MutationObserver` callbacks are delivered as microtasks, not synchronously. All 1000 `removeAttribute` calls in the rAF callback complete before any `MutationObserver` callback fires.
- **Record batching** — If a `MutationObserver` is watching the shadow root's subtree for attribute changes, it receives a single callback with up to 1000 `MutationRecord` entries. This is a single microtask, not 1000 separate callbacks.
- **Shadow DOM scoping** — A `MutationObserver` on the document or light DOM elements cannot observe mutations inside a closed shadow root. For open shadow roots, an observer must explicitly reference the shadow root or an element within it. Browser extension content scripts typically observe the document, not individual shadow roots.
- **Memory** — Each `MutationRecord` retains a reference to the target element and the old attribute value. For 1000 records with moderately sized `data-sui-bind` values, this could be ~50-100KB of retained memory until the observer callback processes and releases them. This is a minor concern but worth noting.

### Accessibility Tree Updates

- **`data-*` attributes are not reflected in the accessibility tree** — The `data-sui-bind` attribute does not map to any ARIA property or accessible name/description. Removing it triggers no accessibility tree update in any engine.
- **Exception: `aria-*` and role** — Only `aria-*` attributes, `role`, `tabindex`, and certain HTML attributes (like `alt`, `title`, `label`) trigger accessibility tree updates on removal. `data-*` is explicitly excluded.

### SVG Namespace Handling

- **SVG elements inside shadow DOM** — If the shadow root contains SVG elements with `data-sui-bind`, `removeAttribute` works identically to HTML elements for `data-*` attributes. The `data-*` namespace is not affected by SVG namespace rules (it uses the null namespace in both HTML and SVG contexts).
- **`TreeWalker` with SVG** — `NodeFilter.SHOW_ELEMENT` correctly includes SVG elements. `hasAttribute` and `removeAttribute` work on SVG elements without namespace qualification for `data-*` attributes. No issue here.

### Interaction with Incremental Rendering

- **Browser rendering pipeline ordering** — The rAF callback runs after the browser has composited the previous frame and before it begins the current frame's rendering work (style, layout, paint, composite). All mutations within the rAF callback are batched and processed in the subsequent rendering steps of that same frame.
- **Mid-frame interruption** — In Blink's `LifecycleUpdate`, if the rAF callback takes too long (>~5ms), the browser may defer remaining rendering work to the next frame. For the no-selector-match case (~0.2ms), this is not a concern.
- **Content Visibility** — If any ancestor of the shadow root has `content-visibility: auto` and is off-screen, the browser may skip style/layout/paint for that subtree entirely, making the removal even cheaper.

### TreeWalker Safety

- **Live iteration** — `TreeWalker` iterates over a live DOM tree. `removeAttribute` does not change the tree structure (no elements are added or removed), so the TreeWalker iteration is safe and deterministic.
- **Contrast with `querySelectorAll`** — Using `shadowRoot.querySelectorAll('[data-sui-bind]')` would return a static NodeList. This is also safe but has a slightly different cost profile: the querySelectorAll call does the attribute matching upfront (O(n) scan), while the TreeWalker checks each element during iteration. For shadow roots with ~5-50 elements, the difference is negligible. The TreeWalker approach avoids allocating a NodeList array, making it marginally more memory-efficient.

### Adopted Stylesheets Timing

- **Adopted stylesheet changes** — If `adoptedStyleSheets` on the shadow root are modified concurrently (e.g., theming changes), the invalidation sets are rebuilt. If this happens between `removeAttribute` calls within the same rAF callback, some removals might check old invalidation sets and others check new ones. In practice this is harmless — either way, the engine correctly determines whether the attribute is referenced. But it's a theoretical non-determinism in the cost of each individual removal.

---

## Question 5: Cost Comparison — Removing a `data-*` Attribute vs. Removing a Comment Node

### Removing a `data-*` Attribute

As analyzed in Question 1, for an unmatched attribute:
- **Attribute lookup**: Linear scan of element's attribute list (~50-100ns)
- **Attribute storage removal**: Array manipulation on `AttributeVector` (~20-50ns)
- **Invalidation set check**: Hash lookup, miss (~10-30ns)
- **Internal notifications**: Check for observers, find none (~10-20ns)
- **Total: ~90-200 nanoseconds**
- **No downstream invalidation work** (when no selector matches)

### Removing a Comment Node

`parentNode.removeChild(commentNode)` or `commentNode.remove()`:

1. **Tree mutation** — The comment node must be unlinked from the DOM tree. This involves updating the parent's child list (doubly-linked list pointer updates in most engines): set previousSibling.nextSibling = nextSibling, set nextSibling.previousSibling = previousSibling, update parent's firstChild/lastChild if needed. **~30-60 nanoseconds.**

2. **Range and selection updates** — The engine must check if any `Range` or `Selection` objects reference this node or its boundaries. In Blink, this is tracked via `NodeRareData` — if no ranges reference the node, this is a quick null check. **~5-10 nanoseconds.**

3. **MutationObserver notification** — If a `MutationObserver` is watching the parent for `childList` changes, a `MutationRecord` is created. Same cost as the attribute case — if no observer, quick bail. **~10-20 nanoseconds.**

4. **Style invalidation** — Comment nodes are NOT part of the render tree. They have no `ComputedStyle`. Removing a comment node triggers **zero style invalidation**. The engine doesn't even check invalidation sets because the removed node type (`Comment`) is known to be non-rendered. **~0 nanoseconds.**

5. **Layout invalidation** — **None.** Comment nodes don't participate in layout. No layout tree nodes reference them. The layout tree is completely unaffected.

6. **Paint invalidation** — **None.** Comment nodes are invisible.

7. **Node destruction / GC** — If the removed comment node has no remaining JavaScript references, it becomes eligible for garbage collection. The GC cost is amortized and not directly attributable to the removal call.

### Direct Comparison

| Aspect | `removeAttribute('data-sui-bind')` | `removeChild(commentNode)` |
|--------|-----------------------------------|-----------------------------|
| Core operation cost | ~90-200ns (attribute lookup + removal) | ~45-90ns (pointer updates) |
| Style invalidation check | ~10-30ns (hash lookup, miss) | ~0ns (skipped entirely for comment nodes) |
| Layout/paint check | Skipped (no style change) | Skipped (not a rendered node) |
| Observer check | ~10-20ns | ~10-20ns |
| **Total** | **~110-250ns** | **~55-110ns** |

### Verdict

**Removing a comment node is approximately 2x cheaper than removing a `data-*` attribute**, primarily because:

1. **No attribute lookup cost** — Comment removal is pure tree surgery (pointer updates), while attribute removal requires scanning the attribute list.
2. **No style invalidation set check** — The engine knows at the type level that comment nodes are non-rendered and skips the invalidation machinery entirely. Attribute removal must always check the invalidation set, even if the check is fast.
3. **Simpler data structure** — Unlinking a node from a doubly-linked list is ~2 pointer writes. Removing an attribute from an `AttributeVector` involves an array shift operation.

However, there is one important counterpoint: **tree structure changes are more "significant" mutations than attribute changes.** Some browser internals (like incremental DOM serialization, tree snapshots, and certain developer tools hooks) track structural mutations more aggressively than attribute mutations. In practice this rarely matters, but it means comment removal has slightly higher variance in real-world cost depending on what else is observing the tree.

### Practical Implications

Both operations are in the sub-microsecond range per element. At the scale described (1000 elements across a page), the difference is:

- **Attribute removal**: ~0.1-0.25ms total
- **Comment removal**: ~0.05-0.11ms total

Neither is performance-relevant. The difference of ~0.1ms is invisible. The choice between the two should be made on architectural grounds (which pattern is cleaner, more maintainable, less error-prone), not performance grounds.

That said, if the metadata were stored as comment nodes instead of data attributes, you would gain a second advantage beyond raw removal cost: comment nodes are completely invisible to the CSS engine at all times. There is zero risk of an accidental selector match causing style invalidation, because comment nodes simply don't exist in the style system's world. This provides a stronger guarantee of zero style-invalidation cost, independent of what stylesheets are present — a form of defense-in-depth that the attribute approach achieves only when no selector matches.

---

## Summary

The proposed `requestAnimationFrame` cleanup of `data-sui-bind` attributes from shadow DOM elements is safe and performant:

- **No-selector-match case (expected)**: ~0.05-0.2ms for 1000 elements across a page. Zero style, layout, or paint cost. Completely invisible to users and performance tools.
- **Shadow DOM scoping provides isolation**: Style invalidation checks only the shadow root's own stylesheets, not the document's. This bounds worst-case cost and prevents external stylesheets from causing unexpected invalidation.
- **Worst case (selector matches)**: ~12-45ms if a selector matching `[data-sui-bind]` exists and affects layout/paint properties. This would require the component's own styles to reference the attribute (since external styles can't penetrate shadow DOM).
- **Comment nodes are ~2x cheaper to remove** but both are sub-microsecond per element. The difference is architecturally irrelevant at this scale. Comment nodes do offer a categorical guarantee of zero style system interaction.
- **Edge cases are benign**: No accessibility tree impact, safe TreeWalker iteration, properly scoped MutationObserver behavior, no SVG namespace issues.

The proposed approach is sound. The cleanup cost is negligible compared to the hydration work that precedes it.
