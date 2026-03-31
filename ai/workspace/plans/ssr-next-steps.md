# SSR — Nested Component Rendering

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

## Process for Iterating

### Step 1: Observe the gap

Navigate to `/test-ssr/component` and `/test-ssr/hydrated`. Screenshot both. The visual delta is the specification.

### Step 2: Inspect the SSR output

```bash
curl -s https://dev.semantic-ui.com/test-ssr/component | # extract DSD content
```

Find the `<ui-icon>` tags in the output. Confirm they have no `<template shadowrootmode>` inside them. This is the concrete artifact to fix.

### Step 3: Make a change

Implement a candidate approach.

### Step 4: Verify

Reload `/test-ssr/component`. Screenshot. Compare with `/test-ssr/hydrated`. Did the gap narrow? Are there new problems?

### Step 5: Expand the test

Swap the component in the test routes to another pattern (e.g., TopbarMenu, a button with icon). Verify the fix generalizes.

### Step 6: Check real pages

Navigate to `/ui/start` and compare the SSR output with the hydrated version. The fix should improve real page rendering.

## Known Issues Beyond Nested Rendering

### Attribute serialization for complex values
`JSON.stringify()` is the standard approach for serializing arrays/objects as HTML attributes. The `[object Object]` bug was a missing stringify call in `serializeAttributes`. Non-serializables (functions) should be skipped. This is largely fixed but needs verification.

### Hydration performance
The client-side hydration locks the browser for several seconds on pages with many components. Flame charts show it re-running every calculation and hitting clone logic — suggesting the hydration path is doing full re-computation rather than adopting server DOM and wiring bindings. This defeats the purpose of SSR. The hydration path in `WebComponentBase.hydrate()` and the renderer's `hydrateMarkers` should be audited for unnecessary work — the server already computed the values, the client should trust that output and only wire reactivity.

## Questions for Independent Evaluation

1. Where in the rendering pipeline is the right interception point for nested custom elements — and what are the tradeoffs of each location?

2. How do other SSR systems for web components (not just Lit) solve this? What patterns exist beyond `elementRenderers`?

3. What information does the ServerRenderer need about nested components, and where can it get that information without polluting the component authoring API?

4. Is the `clientEntrypoint` gap (Astro not serializing props) a separate problem or connected to recursive rendering? Should they be solved together?

5. Why is hydration re-running computations and hitting clone logic? What work is the hydration path doing that it shouldn't be, and where is the boundary between "adopt server DOM" and "re-compute"?
