# SSR Ladder — Status Report

## Session Summary (2026-03-31)

### Major Fixes Applied

1. **Block marker depth matching** (renderer.js) — Inner blocks from nested snippets/conditionals can share marker IDs when scopes reset. The sibling walk for collecting owned nodes now tracks block nesting depth instead of matching by ID prefix. This fixed doubled snippet content and hydration mismatch warnings for ui-button and all nested snippet patterns.

2. **Inner content attribute hydration AST** (renderer.js) — `hydrateAttributes` was building the reference DOM from the top-level component AST even when called from nested `hydrateInnerContent`. This caused parallel element walkers to misalign. Now threads the content AST through `hydrateMarkers → hydrateAttributes`.

3. **SSR settings for createComponent** (render-to-string.js) — `renderToString` didn't provide a `settings` object to `createComponent`, causing Icon's `getIconStyle` and similar methods to crash. Now sets `template.settings = data`.

4. **Complex props serialization** (astro/server.js, base.js) — Arrays and objects passed as Astro component props were lost during client hydration (HTML attributes only carry primitives). The Astro integration now serializes complex props as a JSON `<script data-ssr-props>` tag inside the DSD template. `WebComponentBase._restoreSSRProps()` reads and applies them before hydration.

5. **Snippet data Proxy ownKeys** (renderer.js) — The expression evaluator's JS eval spreads the data context. Without `ownKeys`/`getOwnPropertyDescriptor` traps, snippet getter keys were lost during spread. Added these traps so ternary expressions in snippet data evaluate correctly.

6. **Nav-menu string menu handling** (nav-menu.js) — Defensive JSON.parse in `getMenu()` for when the native renderer JSON-stringifies arrays for HTML attributes.

7. **Button template typo** (button.html) — `{/snipppet}` → `{/snippet}`.

8. **onRendered guard** (base.js) — Guard setTimeout callback with optional chaining for components that disconnect before the deferred callback fires.

### Ladder Status — 44/44 Passing

| Range | Pattern |
|-------|---------|
| 1-19 | Basic SSR patterns (static, expressions, conditionals, loops, snippets, subtemplates, async, rerender, guard, slots, unsafe HTML, isClient/isServer, spec-driven) |
| 20-21 | ui-button (primary, href variant with `<a>` tag) |
| 22-26 | Simple primitives (icon, label, divider, spinner, container) |
| 27-28 | Button variants (disabled, with icon) |
| 29 | ui-input with icon (attribute expressions in conditional branches) |
| 30-33 | Post-hydration reactivity (click, input, toggle, list update) |
| 34 | Settings change via attribute |
| 35 | Deferred settings (nav-menu pattern — array received after mount) |
| 36-37 | Nested shadow DOMs, subtemplates with primitives |
| 38 | Ternary expression in snippet data |
| 39 | Each loop with snippet ternary (exact nav-menu pattern) |
| 40 | isServer guard in initialize() |
| 41 | Nested component in each loop (icons in list) |
| 42 | Multiple named slots (header/default/footer) |
| 43 | Snippet producing components (two ui-buttons) |
| 44 | Deep nesting (if > each > snippet > ui-label — 4 levels) |

### Doc Pages Status — 10 Checked

| Route | Errors | Notes |
|-------|--------|-------|
| `/ui/start` | 0 | Full page — sidebar, topbar, right rail, content |
| `/docs/guides/components/create` | 0 | Guide with code examples |
| `/docs/guides/templates/expressions` | 0 | Template docs |
| `/docs/guides/templates/loops` | 0 | Loops guide |
| `/docs/guides/templates/slots` | 0 | Slots guide |
| `/docs/api/reactivity/signal` | 0 | API reference |
| `/docs/api/query/events` | 0 | Query API reference |
| `/ui/primitives/button` | 2 | tooltip.js null.remove (pre-existing behavior bug) |
| `/ui/primitives/icon` | 0 | Clean |
| `/ui/primitives/input` | 2 | tooltip.js null.remove (same behavior bug) |

**8/10 pages zero errors. The 2 pages with errors have a pre-existing tooltip behavior issue unrelated to SSR.**

### Known Remaining Issues

1. **Tooltip null.remove** — The tooltip behavior in copy-button tries to remove an element that doesn't exist during initial hydration. Pre-existing, non-blocking. Fix belongs in the tooltip behavior, not SSR.

2. **Icon style attribute** — `getIconStyle()` returns multi-line CSS which the HTML parser splits into separate attributes. Server HTML is malformed but client hydration corrects it. Could be fixed by making getIconStyle return single-line CSS.

3. **Mobile-menu nav-menu sidebar overlap** — The mobile-menu renders 3 nav-menus (previous/active/next) inside a dialog. On some pages these leak visually below the main sidebar nav-menu. CSS visibility issue, not SSR.

### Files Modified

**Renderer (packages/renderer/)**
- `src/engines/native/renderer.js` — depth-based marker matching, AST threading for attribute hydration, snippet Proxy ownKeys

**Component (packages/component/)**
- `src/engines/native/base.js` — SSR props restoration, onRendered guard
- `src/engines/native/factory.js` — (no net changes)
- `src/render-to-string.js` — settings for createComponent

**Astro Integration (internal-packages/astro/)**
- `server.js` — complex props JSON serialization
- `index.js` — (simplified)
- `client.js` — created (unused — Astro 6 custom elements don't need framework client entrypoints)

**First-Party Components**
- `src/primitives/button/button.html` — snippet typo fix
- `src/components/nav-menu/nav-menu.js` — string menu handling

**Test Infrastructure**
- `docs/src/components/SSRDemo/SSRLadder.js` — 25 new step components
- `docs/src/pages/test-ssr.astro` — test harness with data-step selectors, reversed display, Query integration
