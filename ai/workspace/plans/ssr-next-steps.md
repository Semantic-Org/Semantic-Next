# SSR Next Steps — Recursive Nested Component Rendering

## How the Astro Plugin Pipeline Works

### The Lit Integration (reference — `@semantic-ui/astro-lit` in node_modules)

Five files, each with a distinct role:

1. **`server-shim.js`** — Runs before anything else on the server. Sets up `@lit-labs/ssr-dom-shim` which provides a server-side `customElements` registry and `HTMLElement` shim. Patches `customElements.define` to store `tagName` on the class via `Symbol.for('tagName')`. This is how `LitElementRenderer` finds the class for a tag name.

2. **`server.js`** — The SSR renderer. Uses `LitElementRenderer` from `@lit-labs/ssr`. The critical call: `instance.renderShadow({ elementRenderers: [LitElementRenderer] })`. The `elementRenderers` array tells the streaming renderer: "when you encounter a custom element tag in the output, use this renderer for it." This is how recursive nested rendering happens — it's built into the rendering architecture, not bolted on.

3. **`client-shim.js`** — Injected into `<head>` inline. Polyfill for DSD (`<template shadowrootmode>`) in browsers that don't support it.

4. **`hydration-support.js`** — Runs `before-hydration`. Patches LitElement to reuse existing shadow DOM instead of re-rendering from scratch.

5. **`client.js`** — The `clientEntrypoint`. Called by Astro's island runtime with `(element, Component, props, slots)`. Sets complex props as JS properties (`component[name] = value`), removes `defer-hydration`.

### How `client:load` Works

When a component has `client:load` in an Astro template:
- **Server**: Astro calls `renderToStaticMarkup(Component, props, slots)` from the registered renderer
- **Server**: Astro wraps the output in `<astro-island>` with metadata:
  - `component-url` — JS module to import on the client
  - `props` — serialized props (ONLY if `clientEntrypoint` exists and Astro can resolve it)
  - `renderer-url` — client entrypoint URL (ONLY if resolvable)
  - `opts` — component name/export
- **Client**: Astro imports the component module
- **Client**: If `renderer-url` exists, Astro calls the client entrypoint with the deserialized props
- **Client**: If NO `renderer-url`, Astro just imports the module — the element upgrades via `customElements.define` with no prop transfer

### Without `client:load`

Components like `<TopbarMenu menu={menu}>` or `<Menu items={items}>` have NO client directive:
- **Server**: Astro still calls `renderToStaticMarkup` (because `check()` returns true)
- **Server**: Output is placed directly in HTML — no `<astro-island>` wrapper
- **Client**: No module import, no hydration island. The DSD is the final output
- **Client**: BUT the element's module may load anyway (another `client:load` component imports the same package), causing `customElements.define` → upgrade → `connectedCallback`

### Current Native Integration Gaps

1. **No recursive rendering** — `ServerRenderer.render()` outputs nested custom elements as raw HTML tags. The Lit integration's `elementRenderers` pattern provides recursive rendering built into the render loop.

2. **No prop serialization on islands** — The `astro-island` has NO `props` attribute because our `clientEntrypoint` isn't resolvable by Astro. The `renderer-url` is null. Our workaround (`<script data-ssr-props>`) fills this gap but is non-standard.

3. **No server-side `customElements` shim** — The Lit integration provides a server `customElements` that maps tagNames to classes. Our ServerRenderer has no way to look up a component class from a tag name encountered in HTML.

## The Problem

When a component's template contains another custom element (e.g., nav-menu renders `<ui-icon>`), the ServerRenderer outputs the inner element as a raw HTML tag with no shadow DOM. The inner component's DSD is never generated.

## Testing Workflow — Two-Tab Comparison

### Setup
- **Page 1 (left):** JS disabled — shows pure SSR output
- **Page 5 (right):** JS enabled — shows hydrated result
- Navigate both to the same URL, take screenshots, diff

### Dedicated Test Routes

Create focused test routes that isolate specific rendering scenarios. Each route renders ONE component pattern via `renderToString` with minimal surrounding markup.

**Route: `/test-ssr`** — The existing ladder (44 steps, controlled components)

**Route: `/test-ssr-nav`** — Nav-menu in isolation
```astro
---
import { renderToString } from '@semantic-ui/component';
import { NavMenu } from '@semantic-ui/core';

const menu = [
  { name: 'Introduction', url: '/intro', icon: 'book' },
  { name: 'Getting Started', url: '/start', icon: 'zap', pages: [
    { name: 'Installation', url: '/install' },
    { name: 'Quick Start', url: '/quick' },
  ]},
];
---
<Fragment set:html={renderToString(NavMenu, { menu, expandAll: true, dark: true })} />
```

This route shows nav-menu SSR output WITHOUT Astro islands, WITHOUT client:load. Pure server HTML. In the left tab (JS off), we see exactly what the server produced. In the right tab (JS on), we see what hydration does. Comparing them reveals:
- Which nested components (`<ui-icon>`, `<ui-input>`) lack DSD
- Whether text content matches
- Whether classes/attributes are correct

### Alternative: client:load Comparison

Instead of JS disabled, use two routes:
- `/test-ssr-nav-static` — renders NavMenu WITHOUT client:load (server only, never hydrates)
- `/test-ssr-nav-hydrated` — renders NavMenu WITH client:load (server + hydration)

This is less brittle than disabling JS because the static route is permanently non-interactive — no risk of accidentally enabling JS.

## The Fix — Recursive Component Rendering

### Where to Implement

The fix belongs in the **ServerRenderer**, not the Astro integration. The ServerRenderer already walks the AST and produces HTML. It needs to recognize custom element tags in its output and recursively render their shadow DOM.

### The Challenge

Custom element tags appear as `{ type: 'html', html: '<ui-icon ...' }` nodes in the AST. By the time the renderer processes them, they're just strings. The tag's attributes may span multiple AST nodes (HTML + expression + HTML).

### Approach: Post-Process in `render()`

After `renderNodes()` produces the full HTML string, scan it for custom element tags and inject their DSD.

```
render() → renderNodes(ast) → htmlString
         → resolveNestedComponents(htmlString) → finalHTML
```

`resolveNestedComponents` would:
1. Find custom element tags using a regex: `<([\w]+-[\w-]+)([^>]*)>(.*?)</\1>` (with proper handling for self-closing, nesting, etc.)
2. For each match, look up the component by tag name
3. Parse the attributes from the tag
4. Call `renderToString(ComponentClass, parsedAttrs, innerHTML)`
5. Replace the original tag with the renderToString output

### Component Lookup

The renderer needs access to component definitions. The registry should NOT live in `defineComponent` — that's the user-facing API and shouldn't have SSR concerns. Component authors reading that code don't want to think about SSR.

**Approach: Registry lives in the SSR layer**

Components already expose everything needed via static properties: `ComponentClass.template`, `ComponentClass.config`, `ComponentClass.componentTagName`. The registry is built where SSR actually happens.

**Option A: Pass registry to ServerRenderer as a constructor option**
```javascript
// In renderToString or Astro server.js:
const registry = new Map();
// Populated from whatever components have been imported in this module
registry.set('ui-icon', Icon);
registry.set('ui-button', Button);
// etc.

const renderer = new ServerRenderer({
  ast, data, subTemplates, helpers,
  componentRegistry: registry,
});
```

Whoever calls the renderer is responsible for providing the registry. This is explicit and scoped.

**Option B: Build registry from customElements (Astro server shim)**
On the server, `customElements.define` is shimmed (or could be). The shim maintains a map. The ServerRenderer reads from it. This is how `@lit-labs/ssr` works — it has a server-side `customElements` implementation.

**Option C: Build registry automatically from module imports**
A separate SSR utility module (e.g., `@semantic-ui/component/ssr`) exports a `getComponentRegistry()` that scans loaded modules. This keeps SSR code out of the core component path entirely.

**Recommendation: Option A** — Most explicit, easiest to reason about, no magic. The Astro integration already imports all the components it needs. `renderToString` callers already have the component class. The registry is just a Map passed down.

### Attribute Parsing

When the post-processor finds `<ui-icon icon="book" class="icon">`, it needs to parse those attributes into a props object: `{ icon: 'book', class: 'icon' }`. A simple regex parser works for HTML attributes.

### Recursion Depth

Nested components can contain OTHER nested components. The post-processor should recurse, but with a depth limit (e.g., 10) to prevent infinite loops from circular component references.

### Slot Content

`<ui-button>Click Me</ui-button>` — the text between the tags is slot content. `renderToString` already handles the `children` parameter for this.

## Implementation Order

### Phase 1: Test Infrastructure
1. Create `/test-ssr-nav` route with nav-menu in isolation
2. Verify the two-tab workflow shows the gap (icons missing in SSR)
3. Add ladder steps for nested component SSR expectations

### Phase 2: ServerRenderer Registry Option
1. Add optional `componentRegistry` param to ServerRenderer constructor
2. Pass it through from `renderToString` and Astro `server.js`
3. Build the registry at the call site from imported components

### Phase 3: Post-Process in ServerRenderer
1. Add `resolveNestedComponents(html)` method to ServerRenderer
2. Call it at the end of `render()`
3. Use regex to find custom element tags
4. Look up each tag in the registry
5. Call `renderToString` for each, inject the DSD
6. Handle recursion with depth limit

### Phase 4: Astro Integration
1. Verify the Astro `server.js` path also benefits (it creates ServerRenderer directly)
2. The registry is auto-populated by imports, so it should "just work"
3. Test with the two-tab comparison on real doc pages

### Phase 5: Validation
1. Two-tab comparison on `/test-ssr-nav` — icons should appear in SSR
2. Two-tab comparison on `/ui/start` — full page should match
3. Run the full ladder (44 steps should still pass)
4. Run renderer tests (721 should still pass)
5. Check 20 doc pages for zero errors

## Risks

- **Regex HTML parsing** is fragile. Edge cases: attributes with `>` characters, nested same-tag components, self-closing tags. May need a simple state-machine parser instead.
- **Performance**: recursive rendering adds server-side render time. Each nested component is a full `renderToString` call. For pages with many icons, this could add up.
- **Circular references**: Component A renders Component B which renders Component A. The depth limit prevents infinite recursion but the output would be truncated.
- **Attribute type conversion**: HTML attributes are strings. The nested component needs the same type conversion that `attributeChangedCallback` would do on the client. Boolean attributes (`disabled`, `expandAll`) need special handling.
