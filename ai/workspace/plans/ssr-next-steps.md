# SSR Next Steps — Recursive Nested Component Rendering

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

The renderer needs access to component definitions. Options:

**Option A: Pass a registry to ServerRenderer**
```javascript
const renderer = new ServerRenderer({
  ast, data, subTemplates, helpers,
  componentRegistry, // Map<tagName, ComponentClass>
});
```

The registry is built by whoever creates the renderer:
- In `renderToString`: pass the registry from the module's imported components
- In Astro `server.js`: build from all components imported by the page

**Option B: Import-time auto-registration**
Components register themselves in a global server-side map when their module is imported. This happens naturally because `defineComponent` runs at import time.

```javascript
// In define-component.js, server-only:
import { isServer } from '@semantic-ui/utils';

const serverRegistry = isServer ? new Map() : null;

// Inside defineComponent, after creating webComponent:
if (isServer && tagName) {
  serverRegistry.set(tagName, webComponent);
}

export { serverRegistry };
```

The ServerRenderer reads from this registry. No explicit passing needed.

**Recommendation: Option B** — It's automatic and doesn't require threading a registry through every call site. The `isServer` guard ensures zero client impact. The concern about "defineComponent runs on both client and server" is addressed by the guard — the Map only exists on the server.

The previous attempt at this was stopped because the guard was being added mid-stream without care. The implementation should:
1. Add the registry as a separate export from define-component.js
2. Guard with `isServer` so the Map is never created on the client
3. Use `serverRegistry?.set()` so the set call is also guarded
4. Document why it exists

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

### Phase 2: Server Registry
1. Add `isServer`-guarded registry to define-component.js
2. Export it from @semantic-ui/component
3. Verify it populates when component modules are imported on the server

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
