# Performance Investigation — Render Pipeline

Living document cataloging findings, hypotheses, and areas of exploration from the perf test harness work.

**Test harness:** `docs/src/pages/perf/` — three routes (ssr, hydrated, client) using PerfCards component with 1000 static items. Instrumentation in `renderer.js` (eval counter) and `base.js` (hydrate breakdown).

**Environment:** VirtualBox Linux VM, 8GB RAM, 8 dedicated CPUs. No CPU/network throttling.

---

## Confirmed Findings

### hashCode (fnv1a) in native Renderer constructor — 1.4ms dead cost
- `this.id = hashCode({ ast, data, isSVG })` serializes and hashes the entire AST + data context on every Renderer construction
- The Lit renderer uses this for subtree caching (`LitRenderer.getID` at line 448 of lit/renderer.js)
- The native renderer never reads `this.id` — it was carried over from the Lit renderer and serves no purpose
- **Options:** (a) replace with cheap sequential ID for debugging, (b) defer to post-hydration cleanup pass, (c) design a cheaper ID scheme if subtree caching is planned for native
- **Status:** identified, not yet changed

### Template.clone() triggers full attach() during hydration
- Passing `renderRoot` to `clone()` causes the Template constructor to call `attach()` synchronously
- `attach()` calls `initialize()` (creates Renderer, runs createComponent, builds callParams with all the `.bind()` calls), then `attachEvents()` (0.9ms parsing event strings and setting up delegation), then `bindKeys()`
- During hydration, events and keys could be deferred — nobody is interacting in the first 10ms
- **Proposed pattern:** clone without renderRoot, initialize, hydrateMarkers, then defer attach to microtask/rAF
- **Status:** discussed, needs design work on the split point

### removeMarkers — 6ms at 1000 items
- After hydration, walks the entire shadow root removing all `sui` comment nodes
- Pure DOM cost — TreeWalker + node.remove() × N markers
- This is cosmetic (clean DevTools) and could be deferred to rAF
- **Status:** easy win, just move to deferred pass

### isDarkMode() forced style recalc in getData() — 5ms+ saved (FIXED)
- `getData()` called `this.isDarkMode()` eagerly, which calls `cssVar('dark-mode')` → `getPropertyValue` → forced browser style recalculation
- At 1000 items the DOM is large, so the style recalc cost scaled superlinearly (6.3ms)
- **Root cause chain:** `isDarkMode()` was designed to be lazy (it's a getter in `callParams`), but `getData()` resolved it eagerly. Then `getDataContext()` used object spread (`...this.data`) which also resolves getters, defeating any lazy fix on `getData()` alone.
- **Fix (committed):** Changed `darkMode` to a lazy getter via `Object.defineProperty` in both native and Lit `getData()`. Changed `getDataContext()` and `render()` to use `extend()` (which preserves property descriptors) instead of object spread.
- `getData` dropped from 6.3ms → 0.0ms after fix
- **Commit:** `Perf: Make darkMode lazy in getData to avoid forced style recalc`

---

## Hydration Architecture

### Each loop inner content is not hydrated with per-item Reactions
- `getServerRenderedAST()` returns null for `each` blocks
- `hydrateInnerContent()` is never called for each items
- Per-item expressions (text, attributes, conditionals, snippets) have no Reactions wired during hydration
- The each block's outer Reaction watches the collection expression; on first mutation it tears down all DOM and re-renders from scratch via `readAST`
- **Implication:** for static lists that never change, this is fine (no wasted work). For interactive lists (filtering, sorting), every update is a full re-render of visible items. Confirmed: search filtering works correctly on hydrated route — it just uses the coarse path.
- **Status:** understood, correct behavior. Per-item hydration would be an optimization for interactive lists.

### Expression evaluation during hydration — eval-then-discard pattern
- Hydration Reactions call `this.eval(expr, data)` on firstRun to register Signal dependencies, then discard the value
- The full expression evaluation cascade runs (token lookup, JS eval, helper resolution) purely for the side effect of Signal `.get()` calls registering dependencies
- `dependency.depend()` is the only thing needed to register a dep — it doesn't require a value
- **Open question:** is there a cheaper way to register deps without full evaluation? For simple tokens (`{count}`, `{item.name}`), you could resolve to a Signal and call `.dependency.depend()` directly. For complex expressions (`{formatDate date 'h:mm a'}`), you need to evaluate to discover which Signals are touched.
- At 1000 items with the each-doesn't-hydrate-inner pattern, only 6 evals happen during hydration (2 firstRun), so this is not currently the bottleneck for this component shape. Would matter more for a component with many top-level expressions.
- **Status:** understood mechanically, not yet a bottleneck in our test case

### Deferred hydration cleanup pass
- Pattern: synchronous hydration does only what's needed for reactive correctness, then schedules non-critical work
- **Synchronous:** clone template, createComponent, wire reactive bindings (hydrateMarkers)
- **Microtask/rAF:** hashCode computation, attachEvents, bindKeys, removeMarkers, state Reaction for onUpdated
- Rationale: nobody interacts with the page in the first 10ms after JS loads. Event delegation at the shadow root works as soon as the listener is attached — but attaching it 1 frame later is invisible to users.
- **Status:** proposed, needs design. Key question: does Template.attach() need to be refactored to support partial initialization, or can hydrate() just call the pieces in a different order?

---

## Observations from Flamechart

### 100 items (hydrate total: 5.7ms)
```
clone:          4.0ms (includes initialize + Renderer construction + attachEvents)
  attach:       4.7ms (called from Template constructor when renderRoot passed)
    initialize: includes hashCode 1.4ms, attachEvents 0.9ms
hydrateMarkers: 1.7ms
  hydrateAttr:  1.9ms (reference DOM build + parallel walk)
removeMarkers:  0.7ms
```

### 1000 items — before darkMode fix (hydrate total: 28ms)
```
getData:         6.3ms (isDarkMode forced style recalc — FIXED)
clone:           1.4ms (JIT warmed up — true cost lower than 100-item run)
hydrateMarkers: 14.2ms
  walker:        2.1ms
removeMarkers:   6.0ms
```

### 1000 items — after darkMode fix (hydrate total: 22.7ms)
```
getData:         0.0ms
clone:           2.4ms
hydrateMarkers: 13.7ms
  walker:        2.0ms
removeMarkers:   6.4ms
```

### Chrome AI analysis flagged (1000 items with helpers)
- `hydrateAttributes`: 8ms — reference DOM build + parallel walk is the biggest single cost
- `isDarkMode` → `getPropertyValue` → forced style recalc: 5ms (FIXED)
- `removeMarkers`: 5ms — pure DOM cleanup, deferrable
- `fnv1a` hashing: 1.4ms dead cost in Renderer constructor
- Deep module dependency tree causing waterfall loading (dev server artifact)
- Forced reflow at 1000 items (DOMSize insight triggered)

---

## Patterns Discovered

### Object spread resolves getters — use extend() for lazy properties
- `{ ...obj }` eagerly evaluates every getter on `obj` and stores the result as a plain value
- This defeated the lazy `darkMode` getter and would defeat any future lazy property in the data context
- `extend()` from `@semantic-ui/utils` copies property descriptors, preserving getters
- **Rule:** anywhere the data context is merged, use `extend()` not spread. Same applies to any object that may carry lazy getters (settings proxies, computed properties).

---

## Not Yet Explored

### Client render path comparison
- At 100 items: client render 96ms, hydrate 5.7ms (17x faster)
- Need to measure client render at 1000 items for apples-to-apples comparison
- The client render number includes module loading which hydration also pays — the interesting comparison is `fullRender()` vs `hydrate()` after modules are loaded

### Signal clone/equality cost
- Every `Signal.get()` clones arrays and objects via `maybeClone()`
- Every `Signal.set()` runs `isEqual()` (deep equality) then `maybeClone()`
- During hydration firstRun evals, `.get()` is called for dependency registration — the clone cost is paid even though the value is discarded
- Deferred investigation: disable clone (`allowClone: false`), measure % difference
- **Status:** saved for dessert

### Template event string parsing
- `parseEventString()` runs regex parsing on every event string during `attachEvents()`
- For components with many events, this adds up. Could be pre-parsed at define time.
- **Status:** noted, not measured

### Alternative approaches to DOM marker discovery
- Current approach: TreeWalker over the live DOM to find comment markers and attribute positions
- The server produced these markers with pure string manipulation — no DOM involved
- **Open questions:**
  - Could the client also work from the HTML string instead of the parsed DOM? The server's `buildHTMLString` output is a known string with markers at known character positions. If we parsed it with string operations (regex, indexOf) before or instead of TreeWalker, would that be faster?
  - Could we avoid the marker discovery walk entirely by encoding marker positions into a compact structure during SSR (e.g., a JSON array of `[nodeIndex, type, entryId]` tuples embedded as a data attribute on the host element)?
  - The reference DOM in `hydrateAttributes` is already a string→DOM→walk roundtrip just to find attribute positions. That's the server's string, re-parsed into DOM, re-walked. Could we serialize attribute binding positions during SSR instead?
  - WASM-based approach: a Rust parser that walks the HTML string and returns marker positions as a typed array. Probably overkill for single-component hydration but could matter for pages hydrating dozens of components simultaneously.
  - Most creative option: don't discover markers at all. The AST already knows the structure. Could we walk the AST and the DOM in lockstep (like `hydrateAttributes` does with the reference DOM, but against the real DOM directly) instead of scanning for markers?
- The fundamental tension: markers exist because the server's string output and the client's live DOM are different representations of the same structure. Every approach to hydration has to bridge that gap somehow. TreeWalker is the browser's native tool for it. The question is whether the bridge can be built cheaper by shifting work to the server or to the AST.
- **Status:** open exploration, no measurements yet

### TreeWalker nextNode cost
- Chrome AI flagged `nextNode` as ~1ms (5% of the hydration task) just for DOM traversal
- This is the TreeWalker stepping through the shadow root to find comment markers and element attributes
- Scales linearly with DOM node count — at 1000 items with ~8 nodes per card, that's ~8000 nodes to walk
- Multiple walkers run during hydration: comment walker in `hydrateMarkers`, element walker in `hydrateAttributes`, plus the block-owned-element walker for skipping
- **Open question:** could the walks be consolidated into a single pass? Currently separate because attribute markers and comment markers use different NodeFilter modes (SHOW_ELEMENT vs SHOW_COMMENT)
- **Status:** noted from flamechart, not yet measured in isolation

### hydrateAttributes reference DOM construction
- Builds a second DOM from `buildHTMLString` just to locate attribute marker positions
- At 1000 items, most of the content is inside the each block (which isn't hydrated for attributes)
- Could potentially share the reference DOM across instances or cache it on the prototype
- **Status:** 1.9ms at 100 items, 8ms at 1000 items (from Chrome AI analysis)
