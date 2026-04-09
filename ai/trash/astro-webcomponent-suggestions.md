# Building Astro integrations for web component SSR

**Astro's renderer API provides a clean three-file contract — integration entry, server entrypoint, and client entrypoint — that any web component framework can implement to achieve full SSR with island-based hydration.** The official `@astrojs/lit` integration demonstrated this pattern before its deprecation in Astro 5.0, and its architecture remains the definitive blueprint for custom web component renderers. With Declarative Shadow DOM now at ~96% browser support and Astro 6 refining the integration API, building a custom web component SSR integration is more viable than ever — though significant challenges around DOM shimming, slot handling, and property serialization require careful design.

---

## The renderer API is a three-part contract

Every Astro framework integration registers a renderer via `addRenderer()` in the `astro:config:setup` hook. The renderer object has three fields:

```typescript
interface AstroRenderer {
  name: string;                          // Unique identifier, e.g. '@myorg/wc-renderer'
  serverEntrypoint: string | URL;        // Required — renders components to HTML on the server
  clientEntrypoint?: string | URL;       // Optional — handles hydration in the browser
}
```

The **server entrypoint** must default-export an object implementing `SSRLoadedRendererValue` with two critical functions. `check(Component, props, children)` returns `true` if this renderer owns the component — Astro calls every registered renderer's `check()` sequentially until one claims the component. `renderToStaticMarkup(Component, props, children, metadata)` produces `{ html: string, attrs?: Record<string, string> }`. Two optional members complete the interface: **`supportsAstroStaticSlot`** (boolean) tells Astro to preserve `<astro-slot>` elements inside islands for hydration, and **`renderHydrationScript`** (function returning a script string) injects a one-time page-level script before the first component from this renderer (used by Solid.js for its hydration data structures).

The **client entrypoint** default-exports a curried function: `(element: Element) => async (Component, props, slotted, { client }) => void`. The outer function receives the `<astro-island>` wrapper element; the inner function performs framework-specific hydration. When `client` is `'only'`, no server HTML exists and the function must do a full client render. For all other directives, the HTML is already in the DOM and the function should hydrate non-destructively.

The `children`/`slotted` parameter on both server and client is **`Record<string, string>`** — slot names mapped to pre-rendered HTML strings, with `'default'` holding the default slot content. This is a key constraint: slot content arrives as raw HTML, not as framework component instances.

---

## How hooks wire integrations into Astro's build pipeline

The integration lifecycle follows a deterministic hook sequence. Understanding the execution order is essential for placing configuration at the right stage:

```
astro:config:setup → astro:route:setup → astro:routes:resolved → astro:config:done
                                                                      ↓
                      ┌─ dev ──→ astro:server:setup → astro:server:start → astro:server:done
                      └─ build ─→ astro:build:start → astro:build:setup → astro:build:ssr
                                                                        → astro:build:generated
                                                                        → astro:build:done
```

**`astro:config:setup`** is the primary hook for renderer integrations. It provides `addRenderer()`, `updateConfig()` (for injecting Vite plugins), `injectScript()` (for polyfills or runtime preambles), and `addClientDirective()` (for custom hydration strategies). The `command` parameter (`'dev' | 'build' | 'preview' | 'sync'`) enables environment-specific behavior — for instance, React injects its Fast Refresh preamble only during dev.

Astro 5 added **`astro:route:setup`** for per-route prerender control and **`astro:routes:resolved`** for inspecting all resolved routes. Astro 6 introduced **`setPrerenderer()`** in `astro:build:start` for custom prerendering logic, removed the deprecated `routes` parameter from `astro:build:done`, and integrated Vite's Environment API so `astro:build:setup` runs once with all environments rather than separately per target.

The standard integration factory pattern looks like this:

```typescript
export default function myWCIntegration(options?: Config): AstroIntegration {
  return {
    name: 'my-wc-renderer',
    hooks: {
      'astro:config:setup': ({ addRenderer, updateConfig, injectScript }) => {
        addRenderer({
          name: 'my-wc-renderer',
          serverEntrypoint: 'my-wc-renderer/server.js',
          clientEntrypoint: 'my-wc-renderer/client.js',
        });
        updateConfig({
          vite: {
            plugins: [/* framework Vite plugins */],
            ssr: { noExternal: ['my-framework'] },
            optimizeDeps: { include: ['my-wc-renderer/client.js'] },
          },
        });
        injectScript('page', 'import "my-wc-renderer/polyfills.js"');
      },
    },
  };
}
```

---

## Island hydration works through the `<astro-island>` custom element

Astro's partial hydration system centers on the **`<astro-island>` custom element**, defined in `packages/astro/src/runtime/server/astro-island.ts` and prebuilt into an inline `<script>`. When a component uses any `client:*` directive, the server wraps its rendered HTML in an `<astro-island>` element carrying all the metadata needed for client-side hydration:

| Attribute | Purpose |
|-----------|---------|
| `component-url` | Vite-resolved path to the bundled component JS |
| `renderer-url` | Path to the framework's client entrypoint |
| `props` | Serialized props using Astro's custom `[typeCode, value]` tuple format |
| `client` | Directive name: `load`, `idle`, `visible`, `media`, or `only` |
| `ssr` | Present (empty string) when server-rendered; absent for `client:only` |
| `opts` | JSON with component display name and directive argument |
| `before-hydration-url` | Optional pre-hydration script URL |

Each client directive corresponds to a separate script file that registers a function on `self.Astro`. **`client:load`** calls the hydration function immediately. **`client:idle`** wraps it in `requestIdleCallback` (with an optional `timeout` argument). **`client:visible`** uses an `IntersectionObserver` (with optional `rootMargin`). **`client:media`** gates on `window.matchMedia()`. **`client:only`** behaves identically to `client:load` in timing, but critically **skips server rendering entirely** — the island outputs an empty placeholder and renders fully client-side.

The hydration lifecycle proceeds in five stages: the `connectedCallback` fires → the `<astro-island>` waits for children if `await-children` is set (using a `MutationObserver` looking for the `<!--astro:end-->` comment marker) → any `before-hydration-url` script loads → the directive function decides *when* to hydrate → `loadFn()` dynamically imports both `component-url` and `renderer-url` in parallel → props are deserialized via `reviveObject()` → the framework hydrator mounts the component.

Props serialization uses **numeric type codes** supporting 11 types: plain objects (0), arrays (1), RegExp (2), Date (3), Map (4), Set (5), BigInt (6), URL (7), and typed arrays (8-10). Functions, class instances, symbols, and circular references cannot cross the server-client boundary.

Custom client directives can be registered via `addClientDirective({ name, entrypoint })` in `astro:config:setup`. The directive entrypoint exports `(load, opts, element) => void`, where `load` is an async function that imports the component and returns the hydration function. This enables patterns like `client:click` (hydrate on first click) or `client:hover`.

---

## SSR of web components requires Declarative Shadow DOM and DOM shims

Server-rendering custom elements presents unique challenges absent in virtual-DOM frameworks. The primary enabler is **Declarative Shadow DOM (DSD)** — a browser feature allowing shadow roots to be defined in HTML without JavaScript:

```html
<my-element>
  <template shadowrootmode="open">
    <style>:host { display: block; }</style>
    <slot></slot>
  </template>
  <p>Light DOM content</p>
</my-element>
```

When the HTML parser encounters `<template shadowrootmode="open">`, it creates a real shadow root and attaches it to the parent element with zero JavaScript. DSD reached **~96% global browser support** by early 2026, with Firefox 123+ (Feb 2024) closing the last major gap. The `@webcomponents/template-shadowroot` polyfill covers remaining browsers.

**The `@astrojs/lit` integration** (deprecated in Astro 5, continued as community `@semantic-ui/astro-lit`) demonstrated the canonical pattern for web component SSR. Its server entrypoint uses `@lit-labs/ssr` to render Lit components, producing DSD markup with `<!--lit-part-->` comment markers for hydration. The `check()` function verifies components by looking for classes extending `LitElement` or an exported `tagName` variable. A critical design choice: Lit components require exporting `tagName` because custom elements use dash-cased names while Astro components use PascalCase imports.

The server environment lacks browser APIs, so **DOM shimming** is essential. Lit's `@lit-labs/ssr-dom-shim` provides a minimal shim — just enough for `customElements.define()`, basic `HTMLElement`, and template rendering. It intentionally excludes `querySelector`, `parentNode`, and other DOM traversal methods for performance. Vanilla web components that use these APIs in constructors or `connectedCallback` will fail during SSR. Alternatives like **linkedom** or **happy-dom** provide fuller DOM coverage but at higher overhead. The experimental `custom-elements-ssr` package by Pascal Schilp used linkedom to enable SSR of vanilla `HTMLElement` subclasses in Astro, implementing the `ElementRenderer` interface.

Client-side hydration for Lit requires loading `@lit-labs/ssr-client/lit-element-hydrate-support.js` **before** any Lit imports. LitElement detects existing DSD shadow roots and adopts them instead of re-rendering, updating only the dynamic parts identified by `<!--lit-part-->` markers.

### The ecosystem beyond Lit remains sparse

- **Stencil**: Has its own hydrate app for SSR but no Astro renderer integration exists
- **FAST (Microsoft)**: No known Astro SSR integration
- **Enhance**: A standalone SSR library for custom elements using server-only render functions with automatic CSS scoping; could theoretically be wrapped as an Astro renderer but no integration exists
- **WebC (11ty)**: SSR-first single-file components with optional shadow DOM; an experimental WebC-to-Astro compiler exists for research
- **Shoelace/Web Awesome**: Built on Lit, so uses the Lit SSR pipeline

The community-maintained `@semantic-ui/astro-lit` is currently the only actively maintained web component SSR integration for Astro 5+.

---

## Five challenges specific to web component SSR

**1. Shadow DOM serialization overhead.** DSD requires each component *instance* to carry its own `<template shadowrootmode="open">` — templates cannot be shared or reused across instances. A page with 50 instances of the same component gets 50 copies of the shadow DOM template, inflating HTML payload. Compression mitigates this, but it's a real cost. Light DOM components avoid this entirely but lose shadow DOM's style encapsulation.

**2. Light DOM SSR is poorly supported.** Lit SSR's `@lit-labs/ssr` only supports shadow DOM components. The common Lit pattern `createRenderRoot() { return this; }` for light DOM rendering doesn't work properly during SSR — it still emits DSD markup. This is a known limitation (Lit issue #3080).

**3. Slot semantics diverge.** Astro's `<slot />` in `.astro` files behaves differently from the web component `<slot>` element. In web components, `<slot>` projects light DOM children into shadow DOM; in Astro, slots are compile-time content insertion points. When an Astro integration renders web components, it must bridge this gap — typically by wrapping slot content in `<astro-slot>` elements with the appropriate `name` attributes.

**4. Property vs. attribute serialization.** HTML attributes are strings only. Complex props (objects, arrays) cannot be round-tripped through HTML attributes. Lit addresses this with the `defer-hydration` attribute pattern — the element renders with `defer-hydration` set, allowing JavaScript to set properties before the first update. Any custom integration must solve this same problem.

**5. Multiple renderer conflicts.** The DOM shim globals (`HTMLElement`, `customElements`) that web component SSR requires can interfere with other framework integrations running in the same Node process. The `@astrojs/lit` integration's shim needed to be loaded first, and integration ordering in `astro.config.mjs` mattered.

---

## Building a custom web component renderer: complete reference

A practical custom integration for web component SSR follows this package structure:

```
my-wc-renderer/
├── src/
│   ├── index.ts      # Integration factory + getContainerRenderer()
│   ├── server.ts     # check() + renderToStaticMarkup()
│   └── client.ts     # Hydration handler
└── package.json      # exports: ".", "./server.js", "./client.js"
```

The **server entrypoint** for DSD-based web component SSR renders each component with its shadow DOM content:

```typescript
async function renderToStaticMarkup(Component, props, children) {
  const tagName = Component.tagName;
  const shadowContent = renderShadowTree(Component, props);
  const html = `<${tagName}>
    <template shadowrootmode="open">
      <style>${Component.styles || ''}</style>
      ${shadowContent}
      <slot></slot>
    </template>
    ${children['default'] || ''}
  </${tagName}>`;
  return { html };
}
```

The **client entrypoint** for web components is simpler than for virtual-DOM frameworks because custom elements have a built-in upgrade mechanism — once `customElements.define()` runs, existing elements in the DOM automatically upgrade:

```typescript
export default (element: Element) => {
  return async (Component, props, slotted, { client }) => {
    const tagName = Component.tagName;
    if (!customElements.get(tagName)) {
      customElements.define(tagName, Component);
    }
    if (client === 'only') {
      const el = document.createElement(tagName);
      for (const [key, value] of Object.entries(props)) {
        key in el ? (el[key] = value) : el.setAttribute(key, String(value));
      }
      if (slotted['default']) el.innerHTML = slotted['default'];
      element.appendChild(el);
    } else {
      const existing = element.querySelector(tagName);
      if (existing) Object.entries(props).forEach(([k, v]) => (existing[k] = v));
    }
  };
};
```

The `package.json` should include the `"astro-integration"` keyword to enable `astro add` support, and properly export all three entrypoints. For Astro 5+, export `getContainerRenderer()` for the Container API — in Astro 6, this returns `AstroRenderer` directly (the `ContainerRenderer` type is deprecated).

Key implementation rules to follow:

- **`check()` must be fast** — it runs for every component on every page for every renderer. Avoid dynamic imports inside it.
- **Renderer ordering matters** — an overly broad `check()` can steal components from other frameworks.
- **Always set `supportsAstroStaticSlot: true`** if your hydration logic needs to access slot content from the DOM.
- **Include client dependencies in `optimizeDeps.include`** and exclude server-only code to prevent Vite dev-mode import errors.
- **Handle `astro:unmount`** for cleanup during View Transitions: `element.addEventListener('astro:unmount', () => cleanup())`.

---

## Conclusion

Astro's integration API provides a well-defined, hook-based architecture that cleanly separates server rendering from client hydration. The three-file contract (integration entry, server entrypoint, client entrypoint) is framework-agnostic by design, and the `<astro-island>` custom element handles all the orchestration of timing, prop serialization, and lazy loading.

For web components specifically, Declarative Shadow DOM has matured enough for production SSR, but the tooling ecosystem remains thin. **The Lit SSR pipeline is the only battle-tested approach**, and even it carries limitations around light DOM components and DOM shim coverage. The deprecation of `@astrojs/lit` from the official Astro org signals a strategic shift: Astro views web components as client-side islands enhanced with progressive enhancement, rather than as SSR-first primitives.

The most pragmatic path for a custom web component integration today is to model it closely on the `@astrojs/lit` / `@semantic-ui/astro-lit` architecture — use `@lit-labs/ssr` for Lit-based components, or build a custom DOM shim layer (linkedom or happy-dom) for vanilla custom elements. The alternative "split component" approach — server-rendered HTML structure via `.astro` files with web components handling only interactivity — avoids the SSR complexity entirely and aligns well with Astro's static-first philosophy.
