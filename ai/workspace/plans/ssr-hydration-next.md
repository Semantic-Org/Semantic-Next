# SSR Hydration — Next Phase

## Curriculum — Read Before Starting

### 1. Understand what was built in this session
- `packages/component/src/component-registry.js` — server-side tag→class lookup
- `packages/component/src/expand-custom-elements.js` — recursive nested component SSR
- `packages/component/src/render-to-string.js` — canonical SSR path (Astro delegates to this)
- `internal-packages/astro/server.js` — thin 17-line adapter over renderToString
- `packages/component/src/engines/native/base.js` — hydration entry point, `_hydrating` flag, rAF deferral

### 2. Understand the hydration path (the code that needs work)
- `packages/component/src/engines/native/base.js` — `hydrate()`, `connectedCallback()`, `requestUpdate()`
- `packages/renderer/src/engines/native/renderer.js` — `hydrateMarkers()`, `hydrateAttributes()`, `hydrateTextExpression()`, `hydrateBlockDirective()`, `hydrateEach()`, `hydrateConditional()`
- `packages/renderer/src/engines/native/dynamic-region.js` — `DynamicRegion`, `setContent()`, `clear()`
- `packages/templating/src/template.js` — `clone()`, `initialize()`, `attach()`, `attachEvents()`

### 3. Understand the reactivity system
- `packages/reactivity/src/signal.js` — Signal, `get()`, `maybeClone()`, `dependency.depend()`
- `packages/reactivity/src/reaction.js` — `Reaction.create()`, first-run behavior, `firstRun` option
- `packages/reactivity/src/dependency.js` — dependency tracking
- `packages/reactivity/src/scheduler.js` — flush, microtask scheduling

### 4. Load essential MCP context
- `use_skill mental-model` — how the framework thinks
- `use_skill native-renderer` — how the native DOM renderer works
- `use_skill component-ssr` — SSR patterns and guards

### 5. Reference: how Lit solves this
- `docs/node_modules/@semantic-ui/astro-lit/server.js` — Lit SSR renderer
- `docs/node_modules/@semantic-ui/astro-lit/hydration-support.js` — Lit hydration patches
- `docs/node_modules/@semantic-ui/astro-lit/dist/client.js` — Lit client prop transfer
- Key difference: Lit's `defer-hydration` prevents ANY work until explicitly activated

### 6. Read the guestbook
- `ai/guestbook.md` — previous agents' lessons, especially Entry 9 (marker matching)

## Test Routes

| Route | Path | What it tests |
|-------|------|--------------|
| **vanilla** | `/test-ssr/vanilla` | `renderToString` directly — SSR in isolation |
| **component** | `/test-ssr/component` | Astro `renderToStaticMarkup` — SSR through Astro |
| **hydrated** | `/test-ssr/hydrated` | Astro + `client:load` — SSR + hydration |
| **ladder** | `/test-ssr/ladder` | 44 automated regression steps |

All test routes have `searchable` and `expand-all` on NavMenu. The **hydrated** route
is the primary verification target — type into search, confirm results filter correctly
without duplication, icons persist, input doesn't resize.

## Verification Process

### After every code change:
1. Run renderer tests: `cd packages/renderer && npx vitest run` (721 tests)
2. Reload `/test-ssr/hydrated` in Chrome MCP
3. Type a letter into the search box — confirm filtering works, no duplication
4. Check that icons remain visible after hydration
5. Check that the search input doesn't change size

### For performance changes:
1. Navigate to `https://dev.semantic-ui.com/ui/start`
2. Measure DCL: `performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd`
3. Check that scrolling is not blocked during hydration
4. Use `globalThis.__SUI_TRACE__ = true` for console timing (trace utility in `packages/component/src/trace.js`)
5. For flame chart analysis, do NOT use `performance.mark/measure` — it clutters the chart. Use the browser's native profiler.

### For Astro integration changes:
- Restart the dev server — Astro renderer changes don't hot-reload

## Open Bugs

### P0: 3x content duplication on hydrated route
**Symptom:** After typing in search, filtered results appear 3 times.
**Bisected to:** `adfc7343` — the core SSR commit that replaced the Astro server.js.
**Root cause hypothesis:** The old Astro server.js used `<script data-ssr-props>` to pass
complex props (arrays/objects) as JSON inside the DSD. The new `renderToString` serializes
them as JSON attributes instead. The `_restoreSSRProps` mechanism was removed. Complex props
like `menu` (array of objects) may not survive the attribute roundtrip correctly, causing
the each block to see "new" data on first reactive update and re-render alongside existing
server DOM.
**Investigation path:**
1. Compare the HTML output of old vs new server.js for the same NavMenu props
2. Check if `menu` array arrives correctly in the component's data context after hydration
3. Check if the `{#each}` DynamicRegion's `ownedNodes` correctly track the server DOM
4. The `clear()` in `setContent()` should remove old nodes before inserting new — verify this

### P1: Hydration blocks main thread
**Symptom:** CPU at 100% for ~1-1.5s during hydration. Scrollbar works (rAF deferral) but
CPU spins.
**Root cause:** Each component runs full lifecycle synchronously: clone → initialize
(createComponent, event parsing, Reactions) → buildHTMLString → hydrateMarkers. For 60+
icons at ~4ms each = 240ms just for icons.
**Cost breakdown (from profiling /ui/start):**
- `each` utility: 42% — iterates 481 icon properties per icon instance
- `cloneValue`: 6.1% — Signal defensive cloning on construction and get()
- `dispatchEvent`: 4.9% — lifecycle events during hydration
- `hydrateAttributes`: 3% — the actual DOM wiring (the REAL work)
**Optimization tiers (see `ai/workspace/plans/hydration-optimization.md`):**
1. Skip first-run DOM writes in hydration Reactions (done for text/attr, blocks already had it)
2. Skip defensive cloning during hydration — `signal.get({ clone: false })` API exists
3. Suppress lifecycle events during hydration (done)
4. Cache event parsing from prototype template
5. Eliminate reference DOM in hydrateAttributes
6. Lazy createComponent — defer until first interaction

### P2: Icon hydration cost
**Symptom:** Each `<ui-icon>` takes ~4ms to hydrate. 60 icons on a docs page = 240ms.
**Root cause:** The icon spec has 481 option attributes. `getSettingsFromConfig` and
`getUIClasses` iterate ALL of them for every icon instance.
**Fix:** For hydration, read from actual element attributes instead of iterating the full
property list. Or cache the settings resolution per-component-type.

### P2: `_restoreSSRProps` removed but may still be needed
**Symptom:** Related to the 3x duplication bug.
**Context:** The old server.js serialized complex props as `<script data-ssr-props>` JSON
inside the DSD. The client read this in `_restoreSSRProps` before hydration. We removed this
in favor of attribute-based serialization with type converters. But the `menu` array (deeply
nested objects) may not roundtrip correctly through `JSON.stringify` → HTML attribute →
`fromAttribute` → `JSON.parse`.
**Options:**
1. Bring back `<script data-ssr-props>` as fallback for complex props that exceed attribute limits
2. Fix the attribute roundtrip for complex props
3. Don't serialize complex props at all — let the parent re-provide them during hydration

## Architecture Decisions Made

These were discussed and agreed upon. Don't revisit without reason.

1. **Component registry** — module-level Map, populated in `defineComponent`, mirrors engine
   registry pattern. Client never queries it (uses `customElements`).

2. **One SSR path** — `renderToString` is canonical. Astro server.js is a thin adapter.

3. **Two-phase rendering** — ServerRenderer produces HTML, then `expandCustomElements` scans
   for nested components and recursively renders. Not streaming/generator.

4. **Type-driven property converters** — standard `toAttribute`/`fromAttribute` per type.
   Users override via expert config objects in `defaultSettings`.

5. **rAF-deferred hydration** — `connectedCallback` schedules hydration via
   `requestAnimationFrame`. DSD provides instant visual; interactivity wires progressively.

6. **`_hydrating` flag in constructor** — set when `this.shadowRoot` exists (DSD detected).
   Suppresses `requestUpdate` until hydration completes. Must be in constructor because
   `attributeChangedCallback` fires before `connectedCallback`.

## Chrome MCP Tab Map

| Tab | Route | JS | Purpose |
|-----|-------|----|---------|
| 1 | vanilla | on | SSR via renderToString |
| 2 | component | on | SSR via Astro renderToStaticMarkup |
| 3 | hydrated | **off** | Pure SSR output |
| 5 | hydrated | on | SSR + hydration (primary test target) |
| 6 | /ui/start | on | Real docs page for perf measurement |

## Trace Utility

`packages/component/src/trace.js` — opt-in console timing:
```js
import { trace } from '../../trace.js';
const done = trace('hydrate:nav-menu');
// ... work ...
done(); // logs: [sui] hydrate:nav-menu 12.3ms
```
Enable via Chrome MCP initScript (survives reload):
```js
navigate_page({ type: 'reload', initScript: 'globalThis.__SUI_TRACE__ = true' })
```

## Key Insight from This Session

The Lit production build does the same /introduction page in 400ms. Our native renderer
takes 1.3s (dev, warm cache). The gap is not in the rendering architecture — it's in
hydration doing N × full_lifecycle instead of N × wire_bindings. The SSR output is correct.
The hydration path needs to trust it and do minimal work.
