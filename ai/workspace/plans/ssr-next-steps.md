# SSR — Nested Component Rendering

## Curriculum — Read Before Starting

### 1. Understand how the Lit SSR integration works (the reference)
Read ALL five files in order. This is the solved version of the problem — understand it before writing code.
- `docs/node_modules/@semantic-ui/astro-lit/server-shim.js` — server customElements shim
- `docs/node_modules/@semantic-ui/astro-lit/server.js` — recursive SSR renderer (study `renderShadow` + `elementRenderers`)
- `docs/node_modules/@semantic-ui/astro-lit/client-shim.js` — DSD polyfill
- `docs/node_modules/@semantic-ui/astro-lit/hydration-support.js` — hydration patches
- `docs/node_modules/@semantic-ui/astro-lit/dist/client.js` — client entrypoint (prop transfer)
- `docs/node_modules/@semantic-ui/astro-lit/dist/index.js` — plugin registration (all hooks)

### 2. Understand the native SSR integration (what needs work)
- `internal-packages/astro/server.js` — current Astro SSR renderer
- `internal-packages/astro/index.js` — plugin registration
- `packages/renderer/src/engines/native/server.js` — ServerRenderer
- `packages/component/src/render-to-string.js` — renderToString

### 3. Load essential MCP context
- `use_skill mental-model` — how the framework thinks
- `use_skill native-renderer` — how the native DOM renderer works (contributing audience)
- `use_skill component-ssr` — SSR patterns and guards
- `use_skill render-pipeline` — template string → DOM pipeline

### 4. Understand the component under test
- `src/components/nav-menu/nav-menu.js` — createComponent, settings, events
- `src/components/nav-menu/nav-menu.html` — template (renders `<ui-icon>`, `<ui-input>`)

### 5. Read the hydration test suite
- `packages/renderer/test/browser/ssr-hydration.test.js` — 68 tests, shows expected SSR → hydration behavior

### 6. Read the guestbook entry from this session
- `ai/guestbook.md` — Entry 9 documents the marker matching bug, Proxy trap, and methodology lessons

## Problem Statement

Web components rendered inside another component's shadow DOM during SSR produce raw HTML tags with no Declarative Shadow DOM. The inner component's template is never rendered on the server.

**Observable symptom:** With JS disabled, `<ui-icon>` elements inside nav-menu's shadow DOM are empty. With JS enabled, they render correctly after hydration.

**Verification routes:**
- `/test-ssr/component` — NavMenu rendered via Astro SSR, no client directive (pure SSR output)
- `/test-ssr/hydrated` — Same NavMenu with `client:load` (SSR + hydration)

Open both side-by-side. The delta between them is the work to be done.

## How the Astro Plugin Pipeline Works

### The Integration Points (5 files in `@semantic-ui/astro-lit`)

The Lit-based Astro integration is the reference for how this was solved before. It lives in `docs/node_modules/@semantic-ui/astro-lit/` and has 5 files:

| File | Role | When it runs |
|------|------|-------------|
| `server-shim.js` | Server-side `customElements` registry + `HTMLElement` shim | Before SSR |
| `server.js` | SSR renderer — `renderToStaticMarkup` using `LitElementRenderer` | During SSR |
| `client-shim.js` | DSD polyfill for older browsers | Injected in `<head>` |
| `hydration-support.js` | Patches LitElement to reuse existing shadow DOM | Before hydration |
| `client.js` | Sets complex props as JS properties, removes `defer-hydration` | During island hydration |

The native integration lives in `internal-packages/astro/` and currently has `server.js` and `index.js`. It's missing capabilities that the Lit integration provides.

### How `client:load` Flows

1. Astro calls the registered renderer's `renderToStaticMarkup(Component, props, slotted)`
2. Astro wraps the output in `<astro-island>` with metadata (`component-url`, `opts`, etc.)
3. If the renderer has a working `clientEntrypoint`, Astro serializes props into the island and sets `renderer-url`
4. On the client, Astro imports the component module, then calls the client entrypoint with the deserialized props

**Current state:** The native integration's `clientEntrypoint` is not resolvable by Astro (the `renderer-url` attribute is null on all islands). Astro treats the components as generic custom elements — it imports the module but doesn't transfer props. A `<script data-ssr-props>` workaround in the DSD handles prop transfer instead.

### Without `client:load`

Components placed in Astro templates without a client directive are SSR-only. Astro calls `renderToStaticMarkup` but creates no island. No JS hydration occurs. The DSD output is final. This is where correct nested rendering matters most.

## Architecture Facts

### How the ServerRenderer produces HTML

`packages/renderer/src/engines/native/server.js`

The ServerRenderer walks the compiled AST and produces an HTML string. Custom element tags appear as `{ type: 'html', html: '<ui-icon ...' }` nodes — they're just strings by the time the renderer sees them. The renderer has no mechanism to recognize them as components.

### How the Lit SSR solved recursive rendering

`docs/node_modules/@semantic-ui/astro-lit/server.js` — line 67:

```javascript
const shadowContents = instance.renderShadow({
  elementRenderers: [LitElementRenderer],
  ...
});
```

The `elementRenderers` array tells the Lit streaming renderer: when you encounter a custom element tag in the output, use this renderer for it. Recursive rendering is built into the render loop — the renderer intercepts custom element tags as they're produced, not as a post-processing step.

### How component definitions are available

- On the client: `customElements.define(tagName, class)` registers globally
- On the Lit server: `server-shim.js` provides a server-side `customElements` that stores `tagName → class` via a patched `.define()`
- On the native server: no equivalent exists. `defineComponent` creates the class but doesn't register it anywhere server-accessible

Every component class already has `ComponentClass.componentTagName`, `ComponentClass.template` (prototype Template with AST), and `ComponentClass.config` (css, spec, settings, properties).

### How `renderToString` works

`packages/component/src/render-to-string.js`

Takes a component class + attrs + children. Clones the prototype template, forces native engine, initializes, renders, wraps in DSD. This is the single-component SSR path. It does NOT handle nested components in the output.

### How the Astro `server.js` works

`internal-packages/astro/server.js`

Creates a `ServerRenderer` directly (not through Template.clone). Runs `createComponent` with a manually-built params object. Renders, wraps in DSD. Also does NOT handle nested components.

## Constraints

1. `defineComponent` is the user-facing API. It runs on both client and server. SSR infrastructure should not be added there — component authors shouldn't think about SSR when reading that code.

2. The native `ServerRenderer` is a pure string-producing function. It has no DOM, no element instances, no `customElements`.

3. Nested custom element tags can have dynamic attributes from the parent's template expressions (e.g., `<ui-icon icon={title.icon}>`). By render time, these are resolved to concrete values in the HTML string.

4. Components import their dependencies at module level (e.g., nav-menu imports Icon). These imports cause `defineComponent` to run for the dependency, making the class available in the module scope.

5. The Astro integration receives the top-level component class but not its dependency tree. It doesn't know what nested components the template will produce.

## Source Files to Read

### Native SSR (current implementation)
- `internal-packages/astro/server.js` — Astro integration SSR renderer
- `internal-packages/astro/index.js` — Astro plugin registration
- `packages/renderer/src/engines/native/server.js` — ServerRenderer
- `packages/component/src/render-to-string.js` — renderToString
- `packages/component/src/define-component.js` — defineComponent

### Lit SSR (reference implementation — read ALL of these)
- `docs/node_modules/@semantic-ui/astro-lit/server-shim.js` — Server customElements shim
- `docs/node_modules/@semantic-ui/astro-lit/server.js` — Lit SSR renderer with recursive rendering
- `docs/node_modules/@semantic-ui/astro-lit/client-shim.js` — DSD polyfill
- `docs/node_modules/@semantic-ui/astro-lit/hydration-support.js` — Hydration patches
- `docs/node_modules/@semantic-ui/astro-lit/dist/client.js` — Client entrypoint
- `docs/node_modules/@semantic-ui/astro-lit/dist/index.js` — Plugin registration with all hooks

### Test infrastructure
- `docs/src/pages/test-ssr/component.astro` — Pure SSR route (no client directive)
- `docs/src/pages/test-ssr/hydrated.astro` — SSR + client:load route
- `docs/src/pages/test-ssr.astro` — 44-step hydration ladder

### Component under test
- `src/components/nav-menu/nav-menu.js` — Component JS
- `src/components/nav-menu/nav-menu.html` — Template (renders `<ui-icon>`, `<ui-input>`)

## Testing SSR-Only Output

There are two ways to see pure SSR output without JS hydration:

### Method 1: Use the `/test-ssr/component` route (preferred)
This route renders the component without `client:load`, so no hydration island is created. The DSD output is final — no JS needed. However, other components on the page that share the same module may still trigger `customElements.define`, causing the element to upgrade.

### Method 2: Disable JavaScript in Chrome DevTools
For the `/test-ssr/vanilla` and `/test-ssr/hydrated` routes, disabling JS shows the pure server output before any client code runs. This is the most accurate view of what the server produced.

**Chrome MCP cannot disable JS programmatically** — the `emulate` tool has no JS toggle. To use this workflow:
1. Ask the user to open Chrome DevTools on the target tab
2. Ask them to disable JavaScript (Settings > Debugger > Disable JavaScript, or Cmd+Shift+P > "Disable JavaScript")
3. Reload the page
4. Take screenshots via Chrome MCP as normal
5. Ask the user to re-enable JS when done

Alternatively, the user can keep two browser windows — one with JS disabled permanently — and the agent navigates both to the same URL for side-by-side comparison.

## Process for Iterating

Four test routes under `/test-ssr/`:

| Route | Path | What it tests |
|-------|------|--------------|
| **ladder** | `/test-ssr/ladder` | 44 automated steps covering every SSR pattern — regression suite |
| **vanilla** | `/test-ssr/vanilla` | `renderToString` directly — ServerRenderer in isolation, no Astro |
| **component** | `/test-ssr/component` | Astro `renderToStaticMarkup` — no client directive, pure SSR |
| **hydrated** | `/test-ssr/hydrated` | Astro `renderToStaticMarkup` + `client:load` — SSR + hydration |

The **ladder** is the visual regression safety net — run it after any change to confirm nothing broke. It tests 44 patterns from static HTML through deep nesting (if > each > snippet > component), post-hydration reactivity, deferred settings, and spec-driven primitives. All steps should show green. If a step goes red, the step name tells you exactly which pattern regressed.

There is also an **automated hydration test suite** at `packages/renderer/test/browser/ssr-hydration.test.js` (68 tests). Run with `cd packages/renderer && npx vitest run`. This tests the ServerRenderer → DSD → hydration round-trip programmatically, without a browser. The full renderer suite is 721 tests across 14 files — run it after any renderer change.

### Progression: vanilla → component → hydrated

Work through these in order. Each step narrows the scope of what could be wrong.

**Step 1: Get vanilla right.**
This is the simplest path — `renderToString` with no Astro layer. If the HTML is wrong here, it'll be wrong everywhere. Fix ServerRenderer issues at this level.

*Success criteria:* The screenshot matches what the hydrated version shows, minus interactivity. Same text, same structure, same nesting. Icons should render (nested component DSD). Expanded sections should show pages.

**Step 2: Get component to match vanilla.**
Same component, but now through the Astro `renderToStaticMarkup` path. If vanilla looks right but component doesn't, the gap is in the Astro integration (`internal-packages/astro/server.js`) — prop handling, attribute serialization, or how the renderer is configured.

*Success criteria:* Identical to vanilla.

**Step 3: Get hydrated to match component.**
Same as component but with `client:load`. If component looks right but hydrated introduces problems (duplication, flashing, layout shifts, locked browser), the gap is in the hydration/client path — marker matching, prop restoration, or unnecessary re-computation.

*Success criteria:* Identical to component, plus interactivity works (clicking, accordion, search).

### Diagnosing by where a bug appears

| Visible in | Root cause is in |
|-----------|-----------------|
| All three | ServerRenderer (`packages/renderer/src/engines/native/server.js`) |
| component + hydrated only | Astro integration (`internal-packages/astro/server.js`) |
| hydrated only | Client hydration (`packages/component/src/engines/native/base.js`, `renderer.js` hydrate methods) |
| vanilla only | `renderToString` setup (`packages/component/src/render-to-string.js`) |

### Current state (as of 2026-03-31)

| Route | What renders | What's missing |
|-------|-------------|---------------|
| vanilla | Full menu tree, pages expanded, active state highlighted | No icons (nested `<ui-icon>` has no DSD) |
| component | Section titles only | Pages not expanded, no icons. Astro path renders less than vanilla — `expandAll` or menu data may not be reaching the renderer correctly |
| hydrated | Full menu tree (but 3x duplicated from mobile-menu) | No icons in SSR output (JS adds them). Mobile-menu duplication |

Note: vanilla currently renders MORE than component. This means the Astro `server.js` path has a gap vs `renderToString` — investigate prop/settings handling differences between the two paths.

### Expanding to other components

Once NavMenu renders correctly across all three routes, swap the component in the test routes to other patterns:
- TopbarMenu (topbar with tabs)
- A simple button with icon (nested ui-icon)
- GlobalSearch (modal-like, conditional visibility)

Each exercises different SSR patterns. The same vanilla → component → hydrated progression applies.

### Checking real pages

After the test routes look correct, navigate to `/ui/start` and compare. The fix should flow through to real doc pages automatically since they use the same Astro integration path.

## Known Issues Beyond Nested Rendering

### Attribute serialization for complex values
`JSON.stringify()` is the standard approach for serializing arrays/objects as HTML attributes. The `[object Object]` bug was a missing stringify call in `serializeAttributes`. Non-serializables (functions) should be skipped. This is largely fixed but needs verification.

### Hydration performance
The client-side hydration locks the browser for several seconds on pages with many components. Flame charts show it re-running every calculation and hitting clone logic — suggesting the hydration path is doing full re-computation rather than adopting server DOM and wiring bindings. This defeats the purpose of SSR. The hydration path in `WebComponentBase.hydrate()` and the renderer's `hydrateMarkers` should be audited for unnecessary work — the server already computed the values, the client should trust that output and only wire reactivity.

## When You're Stuck

If you've been iterating and the screenshots aren't converging, use the `fresh-take` skill (load via `use_skill fresh-take` from MCP, audience: contributing). It guides you through extracting problem knowledge from your current context, stripping solution momentum, and delegating to a fresh subagent for independent evaluation. The fresh agent sees the problem without your trajectory and may identify approaches you've been orbiting past.

Key: separate what you've LEARNED about the problem (constraints, architecture facts) from what you've TRIED (specific approaches, hypotheses). Transfer the former, isolate the latter. See the skill for the full methodology.

## Questions for Independent Evaluation

1. Where in the rendering pipeline is the right interception point for nested custom elements — and what are the tradeoffs of each location?

2. How do other SSR systems for web components (not just Lit) solve this? What patterns exist beyond `elementRenderers`?

3. What information does the ServerRenderer need about nested components, and where can it get that information without polluting the component authoring API?

4. Is the `clientEntrypoint` gap (Astro not serializing props) a separate problem or connected to recursive rendering? Should they be solved together?

5. Why is hydration re-running computations and hitting clone logic? What work is the hydration path doing that it shouldn't be, and where is the boundary between "adopt server DOM" and "re-compute"?
