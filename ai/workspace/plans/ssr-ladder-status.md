# SSR Ladder — Status Report

## Session Summary (2026-03-31)

### Major Fixes Applied

1. **Block marker depth matching** (renderer.js) — Inner blocks from nested snippets/conditionals can share marker IDs when scopes reset. The sibling walk for collecting owned nodes now tracks block nesting depth instead of matching by ID prefix. This fixed doubled snippet content and hydration mismatch warnings for ui-button and all nested snippet patterns.

2. **Inner content attribute hydration AST** (renderer.js) — `hydrateAttributes` was building the reference DOM from the top-level component AST even when called from nested `hydrateInnerContent`. This caused parallel element walkers to misalign. Now threads the content AST through `hydrateMarkers → hydrateAttributes`.

3. **SSR settings for createComponent** (render-to-string.js) — `renderToString` didn't provide a `settings` object to `createComponent`, causing Icon's `getIconStyle` and similar methods to crash. Now sets `template.settings = data`.

4. **Complex props serialization** (astro/server.js, base.js) — Arrays and objects passed as Astro component props were lost during client hydration (HTML attributes only carry primitives). The Astro integration now serializes complex props as a JSON `<script data-ssr-props>` tag inside the DSD template. `WebComponentBase._restoreSSRProps()` reads and applies them before hydration.

5. **Nav-menu string menu handling** (nav-menu.js) — The native renderer JSON-stringifies arrays for HTML attributes. Added defensive JSON.parse in `getMenu()` for the mobile-menu internal nav-menu pattern.

6. **Button template typo** (button.html) — `{/snipppet}` → `{/snippet}` (was already fixed on disk).

7. **onRendered guard** (base.js) — Guard setTimeout callback with optional chaining for components that disconnect before the deferred callback fires.

### Ladder Status — 37/37 Passing

Steps 1-19: Basic SSR patterns (static, expressions, conditionals, loops, snippets, subtemplates, async, rerender, guard, slots, unsafe HTML, isClient/isServer, spec-driven)
Steps 20-21: ui-button (primary, href variant)
Steps 22-26: Simple primitives (icon, label, divider, spinner, container)
Steps 27-28: Button variants (disabled, with icon)
Step 29: ui-input (with icon — tests attribute expressions in conditional branches)
Steps 30-33: Post-hydration reactivity (click, input, toggle, list update)
Step 34: Settings change via attribute
Step 35: Deferred settings (nav-menu pattern — array received after mount)
Steps 36-37: Nested shadow DOMs, subtemplates with primitives

### Doc Pages Status

| Route | Errors | Notes |
|-------|--------|-------|
| `/ui/start` | 0 | Full page — sidebar, topbar, right rail, content |
| `/docs/guides/components/create` | 0 | Guide with code examples |
| `/docs/guides/templates/expressions` | 0 | Template docs |
| `/docs/api/reactivity/signal` | 0 | API reference |
| `/docs/api/query/events` | 0 | Query API reference |
| `/docs/guides/reactivity/signals` | 0 | Reactivity guide |
| `/ui/start/guides/using-ui` | 0 | UI guide |
| `/ui/primitives/button` | 2 | tooltip.js null.remove — pre-existing behavior issue |
| `/ui/primitives/icon` | 2 | Same tooltip issue on code sample copy buttons |

### Known Remaining Issues

1. **Mobile-menu sidebar duplication** — The mobile-menu component renders 3 internal nav-menus (previous, active, next panels) inside a `<dialog>`. These are becoming visible in the sidebar area. This is a CSS/visibility issue, not an SSR bug.

2. **Tooltip null.remove** — The tooltip behavior in copy-button tries to remove an element that doesn't exist during initial hydration. Non-blocking, pre-existing.

3. **Icon style attribute** — `getIconStyle()` returns multi-line CSS which the HTML parser splits into separate attributes. Server HTML is malformed but client hydration corrects it. Could be fixed by making getIconStyle return single-line CSS.

### Files Modified

- `packages/renderer/src/engines/native/renderer.js` — depth-based marker matching, AST threading for attribute hydration
- `packages/component/src/engines/native/base.js` — SSR props restoration, onRendered guard
- `packages/component/src/engines/native/factory.js` — (reverted defer-hydration)
- `packages/component/src/render-to-string.js` — settings for createComponent
- `internal-packages/astro/server.js` — complex props JSON serialization
- `internal-packages/astro/index.js` — (simplified)
- `internal-packages/astro/client.js` — (created but unused — Astro 6 custom elements don't use framework client entrypoints)
- `src/primitives/button/button.html` — snippet typo fix
- `src/components/nav-menu/nav-menu.js` — string menu handling
- `docs/src/components/SSRDemo/SSRLadder.js` — ladder step components
- `docs/src/pages/test-ssr.astro` — test harness
