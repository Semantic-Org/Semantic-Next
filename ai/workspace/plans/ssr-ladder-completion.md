# SSR Ladder Completion Plan

## Goal

Complete the SSR hydration ladder from step 20 to step 50, covering every edge case from simple spec-driven primitives through full production page layouts. Each step is verified via Chrome MCP on the test-ssr page and backed by automated tests.

## Current State

Steps 1-19 pass: static HTML, text/attribute expressions, conditionals, each, snippets, subtemplates, nested blocks, async, rerender, guard, slots, unsafe HTML, isClient/isServer, each+conditional, snippet in each, multi-branch, object iteration, spec-driven {ui} classes.

Step 20 (ui-button) renders with correct {ui} classes but has two known bugs:
1. Doubled snippet content during hydration — `hydrateBlockDirective` for snippet-type template nodes renders fresh content instead of adopting server DOM
2. False hydration mismatch warning for `{#if animated}` — server `renderConditional` closing marker records wrong branch index

## Process

Work is unassisted. For each step:

1. Add the step component to `docs/src/components/SSRDemo/SSRLadder.js`
2. Add the step to `docs/src/pages/test-ssr.astro` with expected content
3. Navigate to `https://dev.semantic-ui.com/test-ssr` via Chrome MCP
4. Use `evaluate_script` to check: hydrated, clean (zero comments), correct content
5. If failing: debug via `evaluate_script` (inspect shadow DOM, check console errors)
6. Fix the renderer/hydration/server code
7. Run `cd packages/renderer && npm test` to verify no regressions
8. Commit when the step passes

Use `docs/src/pages/test.astro` for client-only debugging (no SSR). Use Chrome MCP `list_console_messages` to check for hydration mismatch warnings and errors.

## Reference Files

### Renderer
- `packages/renderer/src/engines/native/renderer.js` — client renderer, hydration methods
- `packages/renderer/src/engines/native/server.js` — ServerRenderer
- `packages/renderer/src/build-html-string.js` — shared HTML assembly
- `packages/renderer/src/expression-evaluator.js` — shared expression evaluation

### Component
- `packages/component/src/engines/native/base.js` — WebComponentBase, hydration entry point
- `packages/component/src/render-to-string.js` — renderToString for test-ssr.astro
- `packages/component/src/define-component.js` — component definition, engine selection
- `packages/component/src/component-helpers.js` — getUIClasses, settings, shared helpers

### Astro Integration
- `internal-packages/astro/server.js` — Astro SSR renderer
- `internal-packages/astro/index.js` — Astro plugin registration
- `docs/astro.config.mjs` — Astro config (integration registration)

### Test Infrastructure
- `docs/src/components/SSRDemo/SSRLadder.js` — ladder step definitions
- `docs/src/pages/test-ssr.astro` — SSR test page with DSD + hydration verification
- `docs/src/pages/test.astro` — client-only test page (no SSR, for debugging)
- `packages/renderer/test/browser/html-output.test.js` — structural conformance tests
- `packages/renderer/test/unit/server.test.js` — ServerRenderer unit tests

### Architecture Reference
- Load `native-renderer` skill via MCP for full as-built architecture
- `ai/guestbook.md` entry 7 — implementation lessons and debugging methodology
- `ai/plans/native-renderer-refinement.md` — code quality improvements

### Key Patterns
- **Hydration text splitting**: server merges expression value with static text into one DOM text node. Hydration splits at value boundary using `splitText()`. See `hydrateTextExpression` in renderer.js.
- **Subtemplate hydration**: `hydrateSubtemplate` clones template for lifecycle but skips render(), hydrates inner markers on existing DOM. The Reaction's first run is a no-op.
- **Mismatch detection**: closing block markers embed branch index `<!--/sui-block:v1:N:bINDEX-->`. Client compares against its evaluation. Environment guards (isClient/isServer) are silent.
- **Marker cleanup**: `removeMarkers()` sweeps all `sui*` and `/sui*` comments after hydration.
- **Element capture in loops**: TreeWalker loops must capture `const element = el` per iteration for Reaction closures. This bug has appeared three times.

## The Ladder: Steps 20-50

### Tier 1: Fix Known Bugs (Steps 20-21)

| Step | Name | What it tests |
|------|------|---------------|
| 20 | `ui-button primary` | Spec-driven primitive with snippets, {ui} classes, slot. FIX: doubled snippet content during hydration, branch index mismatch |
| 21 | `ui-button with href` | Same component, `<a>` variant via `{#if href}`. Tests conditional snippet branching |

### Tier 2: Simple Primitives (Steps 22-26)

| Step | Name | What it tests |
|------|------|---------------|
| 22 | `ui-icon` | Spec-driven, SVG content, icon alias resolution |
| 23 | `ui-label` | Spec-driven, simple template, multiple variations |
| 24 | `ui-divider` | Spec-driven, minimal template, CSS-only variations |
| 25 | `ui-spinner` | Spec-driven, CSS animation, no JS logic |
| 26 | `ui-container` | Spec-driven, slot-based layout component |

### Tier 3: Interactive Primitives (Steps 27-31)

| Step | Name | What it tests |
|------|------|---------------|
| 27 | `ui-button disabled` | Boolean spec attribute, attribute reflection |
| 28 | `ui-button with icon` | Nested ui-icon subcomponent inside button, icon slot |
| 29 | `ui-input` | Form element, value binding, placeholder, spec-driven |
| 30 | `ui-menu with items` | Each loop over menu items, active state, selection events |
| 31 | `ui-modal` | Portal-like component, conditional visibility, overlay |

### Tier 4: Post-Hydration Reactivity (Steps 32-37)

| Step | Name | What it tests |
|------|------|---------------|
| 32 | `button click after hydration` | Server renders button, client hydrates, click event fires |
| 33 | `input value after hydration` | Server renders input, client types, value updates reactively |
| 34 | `conditional toggle after hydration` | Server renders if-branch, client toggles to else-branch |
| 35 | `each list update after hydration` | Server renders 3 items, client adds/removes items |
| 36 | `settings change after hydration` | Server renders with setting A, client changes to setting B via property |
| 37 | `attribute change after hydration` | Server renders with attr, client changes via setAttribute |

### Tier 5: Nested Component Hydration (Steps 38-42)

| Step | Name | What it tests |
|------|------|---------------|
| 38 | `button inside card` | Primitive inside primitive, nested shadow DOMs |
| 39 | `icon inside button inside card` | Three-level nesting, each with own shadow root and DSD |
| 40 | `menu with button items` | Each loop producing nested components |
| 41 | `subtemplate with nested primitives` | Subtemplate containing spec-driven children |
| 42 | `snippet producing components` | Snippet that renders web components |

### Tier 6: Docs Components (Steps 43-46)

| Step | Name | What it tests |
|------|------|---------------|
| 43 | `copy-button` | Real docs component: state (copied), icon swap, tooltip behavior |
| 44 | `theme-switcher` | Real docs component: localStorage, dark/light toggle, isServer guards |
| 45 | `nav-menu` | Real docs component: each loop, active URL matching, hierarchical menu |
| 46 | `topbar-menu` | Real docs component: slot-based layout, responsive behavior |

### Tier 7: Astro Integration (Steps 47-50)

| Step | Name | What it tests |
|------|------|---------------|
| 47 | `astro client:load single component` | Full Astro round-trip: SSR via plugin → DSD → hydrate on load |
| 48 | `astro client:load multiple components` | Multiple distinct components on one page, each SSRs and hydrates independently |
| 49 | `astro client:visible` | Lazy hydration: component SSRs, hydrates only when scrolled into view |
| 50 | `astro page with nav + content + footer` | Full page layout: multiple components, nested, with slots, all SSR'd and hydrated |

## Key Bugs to Fix Before Proceeding

### Bug 1: Snippet Hydration Double-Render

**Location**: `renderer.js` `hydrateBlockDirective` → `case 'template'` for snippets
**Problem**: Snippets during hydration call `hydrateRerender` which renders fresh content alongside server content
**Fix pattern**: Same as `hydrateSubtemplate` — adopt existing DOM nodes, wire Reactions without rendering
**Test**: Step 20 — ui-button shadow DOM should have one copy of `.button` div content, not two

### Bug 2: Server Branch Index for Else

**Location**: `server.js` `renderConditional`
**Problem**: When the if-condition is false but has an else branch, the server correctly renders the else content. But if the condition evaluates to a falsy value OTHER than `false` (like `undefined`), the branch tracking may record -1 instead of the else branch index.
**Fix**: Ensure the else branch always gets its index recorded in the closing marker
**Test**: Step 20 — no hydration mismatch warning for `{#if animated}` when animated is undefined

## Success Criteria

All 50 steps show ✅ in the test-ssr.astro log:
- `hydrate=✓` — component has a template instance
- `clean=✓` — zero comment nodes in shadow root
- `content=✓` — text content matches expected

Zero console errors. Hydration mismatch warnings only for intentional `{#if isClient}` patterns (and those are suppressed).

Post-hydration reactivity verified: buttons click, inputs type, conditionals toggle, lists update.

Full Astro page renders with multiple components, all server-rendered, all hydrated, all interactive.
