# SSR — Each-Loop Hydration & Remaining Issues

## Curriculum — Read Before Starting

### 1. Essential principles (read FIRST)
- `use_skill ssr-principles` — **MANDATORY**. Trust-then-wire, shared helpers, mismatch prevention. This governs all SSR/hydration decisions.
- `use_skill mental-model` — How the framework thinks
- `use_skill native-renderer` — How the native DOM renderer works (contributing audience)

### 2. Understand the hydration architecture
- `packages/component/src/engines/native/base.js` — `WebComponentBase`: constructor, `connectedCallback`, `hydrate()`, `fullRender()`, `attributeChangedCallback`, `requestUpdate`
- `packages/renderer/src/engines/native/renderer.js` — Client renderer: `hydrateMarkers`, `hydrateBlockDirective`, `hydrateEach`, `hydrateConditional`, `hydrateInnerContent`, `hydrateTextExpression`, `hydrateAttributes`, `createEach` (for comparison)
- `packages/renderer/src/engines/native/dynamic-region.js` — `DynamicRegion`: anchor, ownedNodes, childScopes, setContent, clear
- `packages/renderer/src/engines/native/reaction-scope.js` — Hierarchical Reaction cleanup

### 3. Understand the server renderer
- `packages/renderer/src/engines/native/server.js` — `ServerRenderer`: AST → HTML string with comment markers
- `packages/component/src/render-to-string.js` — `renderToString`: DSD wrapper, `expandCustomElements`, `resolveOptionAttributes`, `{ui}` computation
- `packages/component/src/expand-custom-elements.js` — Post-render expansion of nested custom element tags
- `packages/component/src/component-helpers.js` — Shared helpers: `resolveOptionAttributes`, `getUIClasses`, `createSettingsProxy`

### 4. Understand how Lit handled this (the reference that worked)
- `packages/component/src/engines/lit/base.js` — Lit base class: `willUpdate` → clone → initialize, then `render` → template.render → Lit processes TemplateResult
- `packages/renderer/src/engines/lit/directives/reactive-data.js` — Lit directive with firstRun skip + Reaction
- Key insight: Lit's `requestUpdate()` isn't suppressed during hydration. When `initialize()` mutates settings, the Lit reactive property triggers a second render pass that reconciles.

### 5. Understand the component under test
- `src/components/nav-menu/nav-menu.js` — `getMenu()`, `filterBySearchTerm()`, `configureSearch()`, events
- `src/components/nav-menu/nav-menu.html` — Template: nested each loops, snippets, conditionals, `<ui-icon>`, `<ui-input>`

### 6. Load additional MCP context as needed
- `use_skill component-ssr` — SSR patterns and guards
- `use_skill render-pipeline` — Template string → DOM pipeline
- `use_skill component-lifecycle` — Hook execution order

### 7. Read the agent analyses from the previous session
These are in `ai/workspace/tmp/` — read ALL of them for context:
- `duplication-neutral-analysis.md` — Exhaustive trace of each-loop hydration flow
- `duplication-challenge-analysis.md` — Structural critique of `hydrateEach`
- `state-divergence-neutral-analysis.md` — Timing gap analysis, text-split bug
- `state-divergence-challenge-analysis.md` — Why firstRun skip should be removed for text/attrs
- `icon-neutral-analysis.md` — Root cause: stale data + overlaySettingsSignals filter
- `icon-challenge-analysis.md` — Trust-then-wire structural critique

## What Was Fixed (prior session)

### SSR rendering bugs (server produces wrong HTML)
- **Option attribute resolution** — `tiny=""` on `<ui-input>` wasn't mapping to `size="tiny"`. Added `resolveOptionAttributes()` shared helper in `component-helpers.js`, used from both `renderToString` and `deserializeAttrs`.
- **`{ui}` computed too early** — `renderToString` computed `{ui}` classes before `initialize()` ran. Moved computation to after `initialize()` so settings mutations (like `icon = 'search'`) are reflected.
- **Ladder slot passing** — `renderToString` was receiving children as a raw string instead of `{ slots: { default: ... } }`.

### Hydration bugs (client destroys correct server DOM)
- **`overlaySettingsSignals` filter** — Only overlaid settings Signals for keys in `defaultSettings`. Spec attributes without default values (like `icon`) were excluded, making them invisible to hydration. Removed the filter — all `settingsVars` Signals are overlaid.
- **`attributeChangedCallback` during hydration** — The `_hydrating` flag was suppressing `requestUpdate()` entirely. This blocked legitimate state changes from `initialize()`. Moved the guard to `attributeChangedCallback` instead — attribute parsing is silenced (DOM already reflects attributes), but `requestUpdate()` flows freely for `initialize()` mutations.
- **unsafeHTML dependency registration** — `hydrateTextExpression` for unsafeHTML skipped `eval()` on firstRun, meaning no Signal dependencies were registered.

### Infrastructure
- Test routes use `@css` and `@layouts` aliases
- New `/test-ssr/client` route — pure client render baseline (no SSR)

## Remaining Bugs

### Bug 1: Each-loop 3x duplication (HIGH PRIORITY)

**Symptom:** On `/test-ssr/hydrated`, typing 'g' into the search input produces "Getting Started" section THREE times instead of once.

**Works correctly on:** `/test-ssr/client` (pure client render — one copy)

**What the agent analyses found:**
1. `getServerRenderedAST()` returns `null` for each blocks (line ~1394 of renderer.js). This means `hydrateInnerContent` is NEVER called for each-loop content — inner expressions are left as static, un-hydrated text.
2. `hydrateEach` creates a Reaction that skips on firstRun (registers deps only). On subsequent runs, it does a FULL teardown-and-rebuild via `readAST` + `region.setContent`.
3. Neither agent could statically trace the exact 3x mechanism. Top hypotheses:
   - `region.clear()` fails to remove server DOM because node references became stale during the parent if-block's `hydrateInnerContent` fragment-move process
   - Signal write cascading from `filterBySearchTerm`'s synchronous `state.selectedIndex.set()` and `state.maxIndex.set()` during `getMenu()` evaluation causes the Reaction to fire multiple times
   - Overlapping node ownership between the if-block's DynamicRegion and the each-block's DynamicRegion
4. Both agents agreed `hydrateEach` is structurally underengineered — no per-item hydration, no keyed reconciliation. Every other framework (Lit, Svelte, Solid) hydrates each items individually.

**Empirical verification needed:**
- Add `console.log` in `hydrateEach`'s Reaction to count fires per search input
- Check whether `region.ownedNodes` nodes are still `isConnected` at the time `clear()` runs
- Compare against `createEach` behavior (the non-hydration path that works correctly)

### Bug 2: Step 40 ladder failure (state divergence)

**Symptom:** Component with `defaultState: { label: 'server' }` and `initialize()` that sets `label` to `'client'` on the client. After hydration, DOM shows "server" instead of "client".

**Root cause:** The firstRun skip in `hydrateTextExpression` prevents writing the current value to the DOM, even though the Signal already holds 'client'. The Signal change from `initialize()` happened before the Reaction was wired, so no subsequent notification fires.

**The `attributeChangedCallback` fix (committed) partially addresses this** — `requestUpdate()` is no longer suppressed during hydration, so `initialize()` mutations can trigger a render pass. However, that render pass calls `template.render()` → `bumpDataVersion()`, which fires ALL Reactions' non-firstRun paths — including `hydrateEach` which does full teardown.

**Fix direction (from agent analyses):**
- For text and attribute hydration Reactions: remove the `firstRun` skip. The expression is already evaluated for dependency registration. `textNode.data = sameValue` and `setAttribute(name, sameValue)` are browser no-ops. No perf cost.
- Keep `firstRun` skip for `hydrateEach` (prevents structural teardown) and unsafeHTML (prevents expensive reparse)
- This requires the each-loop bug to be fixed FIRST, because `bumpDataVersion` from `requestUpdate` would trigger `hydrateEach`'s non-firstRun path

**Alternatively:** Fix `hydrateEach` to use keyed reconciliation (matching `createEach`), then a reconciliation `bumpDataVersion` after hydration handles all divergence cases naturally.

### Bug 3: Text node splitting uses client state (pre-existing)

**Found by:** State divergence neutral agent

**Location:** `renderer.js` ~line 1217 in `hydrateTextExpression`

The text node splitting logic evaluates the expression with current client data to determine the split boundary between the expression value and adjacent static text. If client state differs from server state, the split happens at the wrong position, corrupting text nodes.

## Testing

### Visual routes (Chrome MCP)

| Route | Path | What it tests |
|-------|------|--------------|
| **client** | `/test-ssr/client` | Pure client render — the "known correct" baseline |
| **component** | `/test-ssr/component` | Pure SSR — no hydration |
| **hydrated** | `/test-ssr/hydrated` | SSR + hydration — compare against client and component |
| **ladder** | `/test-ssr/ladder` | 44-step automated regression suite |

**Progression:** Fix bugs so hydrated matches client. Use component to verify SSR output. Ladder catches regressions.

### Automated tests

```bash
cd packages/renderer && npx vitest run  # 721 tests, 14 files
```

### Diagnosing by route

| Visible in | Root cause is in |
|-----------|-----------------|
| All three | ServerRenderer (`server.js`) |
| component + hydrated | Astro integration or `renderToString` |
| hydrated only | Client hydration (`base.js`, renderer hydrate methods) |

## Architecture Notes

### The hydration flow (native base.js)
```
connectedCallback()
  → DSD detected → _hydrating = true
  → rAF → hydrate(prototypeTemplate)
    → getData() — reads element properties
    → prototypeTemplate.clone({ data, element, renderRoot })
      → Template constructor → initialize()
        → createComponent() + user's initialize()
        → Renderer created with overlaySettingsSignals(getDataContext())
    → _isHydrating = true
    → buildHTMLString(ast) → get entries (marker descriptions)
    → hydrateMarkers(shadowRoot, entries, data, scope)
      → Pass 1: attribute bindings (reference DOM matching)
      → Pass 2: comment markers (text expressions + block directives)
    → _isHydrating = false
    → rendered = true, _hydrating = false
    → removeMarkers()
    → setTimeout(onRendered, 0)
```

### Key difference from Lit path
In the Lit base class (`willUpdate` → `render`), `requestUpdate()` is never suppressed. When `initialize()` mutates a reactive property, Lit schedules a second render pass that reconciles any divergence. The native path now allows `requestUpdate()` during hydration (as of the `attributeChangedCallback` fix), but `hydrateEach`'s destructive non-firstRun behavior makes the reconciliation pass unsafe.

### The `createEach` vs `hydrateEach` gap
`createEach` (normal render path, ~line 540) uses keyed reconciliation with per-item Signals and a `Map<key, { nodes, itemSignal, scope }>`. Items are updated in place via `itemSignal.set(newData)`. New items get fresh renders. Removed items get `scope.dispose()` + node removal.

`hydrateEach` (hydration path, ~line 1445) has none of this. First run: evaluate list to register deps, skip. Subsequent runs: full teardown via `region.setContent()` and rebuild via `readAST`. No per-item tracking, no keyed reconciliation, no incremental updates.

## Recommended Approach

1. **Instrument `hydrateEach`** to understand the 3x: count Reaction fires, check node connectivity, log region state
2. **Fix the 3x duplication** — either fix the specific mechanism or refactor `hydrateEach` to wire per-item Reactions
3. **Remove firstRun skip for text/attribute hydration** — safe once each-loop doesn't do destructive full-rebuild
4. **Verify step 40 passes** — should work naturally once text expressions write on firstRun
5. **Run full test suite** — `cd packages/renderer && npx vitest run`
6. **Test real doc pages** — `/ui/start`, `/ui/components/button`
