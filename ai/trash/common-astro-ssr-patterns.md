# Astro framework integrations: SSR, hydration, and renderer architecture

**Every official Astro UI framework integration follows a three-file architecture** — an integration entry point that registers a renderer via `addRenderer()`, a server entrypoint implementing `check()` and `renderToStaticMarkup()`, and a client entrypoint that hydrates components in the browser. This pattern, consistent across React, Vue, Svelte, Solid, Preact, and the now-deprecated Lit integration, is the foundation of Astro's islands architecture. The renderer API has remained stable from Astro 4 through 6, with only minor type additions (URL support for entrypoints in v5) and Vite environment changes in v6. Understanding these patterns is essential for anyone building a custom framework integration.

## The three-part renderer contract

Every framework integration must satisfy three distinct contracts with Astro's core. The **integration entry point** is the package's default export — a function returning an `AstroIntegration` object with hooks. The critical hook is `astro:config:setup`, where the integration calls `addRenderer()` to register its renderer and `updateConfig()` to inject framework-specific Vite plugins.

The `AstroRenderer` interface is deliberately minimal:

```typescript
interface AstroRenderer {
  name: string;                      // e.g. '@astrojs/react'
  clientEntrypoint?: string | URL;   // browser hydration script
  serverEntrypoint: string | URL;    // SSR rendering module
}
```

The **server entrypoint** must export an object implementing `SSRLoadedRendererValue`, which defines the runtime SSR contract:

```typescript
interface SSRLoadedRendererValue {
  check: (Component: any, props: Record<string, any>, 
          children: Record<string, string>, 
          metadata?: AstroComponentMetadata) => Promise<boolean>;
  renderToStaticMarkup: (Component: any, props: Record<string, any>,
                         children: Record<string, string>,
                         metadata?: AstroComponentMetadata) 
                         => Promise<{ html: string; attrs?: Record<string, string> }>;
  supportsAstroStaticSlot?: boolean;
  renderHydrationScript?: () => string;
}
```

The `check()` function determines renderer ownership — Astro iterates through registered renderers and calls each `check()` until one returns `true`. The `renderToStaticMarkup()` function produces the server HTML. The optional `renderHydrationScript()` injects a page-level bootstrap script (only Solid uses this). The **`supportsAstroStaticSlot`** flag, set to `true` by all current integrations, enables Astro's optimization where slot content within islands is rendered as static `<astro-static-slot>` elements rather than being re-rendered by the framework.

The `AstroComponentMetadata` object passed to both functions carries hydration context:

```typescript
type AstroComponentMetadata = {
  displayName: string;
  hydrate?: 'load' | 'idle' | 'visible' | 'media' | 'only';
  hydrateArgs?: any;
  componentUrl?: string;
  componentExport?: { value: string; namespace?: boolean };
  astroStaticSlot: true;
};
```

When `hydrate` is undefined, the component renders as static HTML with **zero client JavaScript**. This is the default behavior — partial hydration is opt-in per component.

## How each framework implements `check()` and SSR

Each integration's component detection strategy reflects its framework's compilation model. **React** checks whether a component is a function or a class extending `React.Component`. When multiple JSX frameworks coexist, it also evaluates file paths against `include`/`exclude` glob patterns provided via a virtual module (`astro:react:opts`). **Vue** detects compiled Single File Components by checking for `ssrRender` (template-compiled) or `__ssrInlineRender` (script setup) properties. **Svelte 5** looks for `$$payload` in the component's stringified form — a signature of Svelte's server-compiled output. **Solid** renders the component and verifies the output is valid Solid markup. **Preact** mirrors React's detection but guards against falsely intercepting React 19 components when both integrations run side-by-side.

The SSR rendering approaches diverge significantly:

- **React** uses streaming by default via `renderToPipeableStream` or `renderToReadableStream`, collecting chunks into a string. It sets `identifierPrefix` for `useId()` to prevent collisions between islands. The `experimentalDisableStreaming` option falls back to synchronous `renderToString` for CSS-in-JS compatibility.
- **Vue** creates a fresh `createSSRApp()` instance per component, wrapping it with `h(Component, props, slots)`. It calls `await setup(app)` from a virtual module (`virtual:@astrojs/vue/app`) before rendering, allowing users to register Vue plugins (Pinia, i18n) that work identically on server and client. Rendering uses `renderToString(app)` from `vue/server-renderer`.
- **Svelte 5** calls `render()` from `svelte/server`, which uses `$$payload.out` to accumulate HTML incrementally without a virtual DOM. Slots are converted to Svelte 5 snippets via `createRawSnippet()`.
- **Solid** uses `renderToStringAsync()` with automatic `<Suspense>` wrapping, enabling `createResource()` and `lazy()` to resolve during SSR. It passes `renderId` for island isolation and `noScripts: true` for non-hydrating components.
- **Preact** uses synchronous `renderToString` from `preact-render-to-string` — no streaming support, but the **3KB runtime** makes it the lightest option.

The **Lit** integration (removed in Astro 5) was architecturally unique. It used `@lit-labs/ssr`'s `LitElementRenderer` to simulate the custom element lifecycle in Node.js, producing Declarative Shadow DOM output with `<template shadowrootmode="open">`. This required installing global DOM shims (`window`, `document`) on the Node.js process — a known source of conflicts with other integrations.

## Client hydration scripts and the `<astro-island>` element

When a component uses a `client:*` directive, Astro wraps the server-rendered HTML in an `<astro-island>` custom element that stores all hydration metadata as attributes: the component URL, export name, renderer URL, serialized props, and directive type. The built-in client directives control *when* hydration begins:

- **`client:load`** — immediate, highest priority
- **`client:idle`** — deferred to `requestIdleCallback`
- **`client:visible`** — triggered by `IntersectionObserver`
- **`client:media="(query)"`** — triggered by `matchMedia`
- **`client:only="framework"`** — skips SSR entirely, client-render only

Each framework's client entrypoint exports a function that receives the `<astro-island>` element and returns an async hydration callback. The callback receives the component constructor, deserialized props, slot content, and the directive metadata.

**React's client** calls `ReactDOM.hydrateRoot()` for SSR'd components or `ReactDOM.createRoot().render()` for `client:only`. It wraps hydration in `React.startTransition()` to avoid blocking when multiple islands hydrate simultaneously. It listens for `astro:unmount` (fired during View Transitions) to call `root.unmount()`.

**Vue's client** distinguishes between `createSSRApp()` for hydration (`app.mount(element, true)`) and `createApp()` for fresh mounting (`app.mount(element, false)`). Critically, it calls the same `setup(app)` function from the virtual module, ensuring Vue plugins are registered identically on both server and client.

**Svelte 5's client** (using a `.svelte.ts` extension for runes awareness) calls `hydrate()` from `svelte` for SSR content or `mount()` for `client:only`. Slots are converted to snippet functions on the client side.

**Solid's client** calls `hydrate()` from `solid-js/web` with a matching `renderId` that corresponds to the server render. For `client:only`, it uses `render()` instead. Solid's hydration is distinctive because it also depends on a page-level `_$HY` data structure injected via `renderHydrationScript()` — inline scripts scattered through the SSR HTML call into this structure to transfer server state.

**Lit's client** (pre-Astro 5) was the most unusual: it simply called `customElements.define()` to register the element class, relying on the browser's built-in custom element upgrade mechanism. A polyfill for Declarative Shadow DOM handled browsers without native support.

## Vite plugin configuration patterns across integrations

Each integration injects framework-specific Vite plugins via `updateConfig({ vite: { plugins: [...] } })` in the `astro:config:setup` hook. The patterns share a common structure but differ in complexity.

**React** injects three Vite plugins: `@vitejs/plugin-react` for JSX transforms and Fast Refresh, an `@astrojs/react:opts` virtual module plugin that exposes integration options via `devalue.uneval()`, and a `@astrojs/react:environment` plugin that configures `optimizeDeps` per Vite environment. In dev mode, it also injects the Fast Refresh preamble via `injectScript('before-hydration', preamble)`. The environment plugin deduplicates `react` and `react-dom`, pre-bundles framework dependencies for the client environment, and adds `ssr.noExternal` entries for CJS-only libraries like MUI.

**Svelte** injects `@sveltejs/vite-plugin-svelte` (which handles `.svelte` compilation) plus an environment plugin with custom esbuild plugins for optimizing Svelte's server internals. It pre-bundles `svelte/server` and `svelte/internal/server` for SSR environments.

**Vue** injects `@vitejs/plugin-vue`, optionally `@vitejs/plugin-vue-jsx`, a virtual module plugin for the `appEntrypoint` feature, and optionally Vue DevTools. It externalizes `@vue/server-renderer` from the SSR bundle.

**Solid** injects `vite-plugin-solid` with `ssr: true` — this flag is critical because Solid's compiler generates entirely different output for server (string concatenation) versus client (direct DOM operations). Without it, server builds would attempt to use browser DOM APIs.

All JSX-based integrations (React, Preact, Solid) support `include`/`exclude` glob patterns and emit warnings via `astro:config:done` when multiple JSX renderers are detected without disambiguation.

A pattern introduced in **Astro 6** (with Vite 7) is the `configEnvironment` plugin hook, which replaced per-target build configuration. Integrations now configure `optimizeDeps` separately for `client`, `ssr`, and `prerender` environments in a single `configEnvironment` callback rather than through the old `astro:build:setup` target-based system.

## Props serialization and the islands data flow

Props serialization is handled by **Astro's core runtime**, not by individual integrations. This is a key architectural decision — all frameworks share the same serialization boundary. Supported types include plain objects, numbers, strings, arrays, `Map`, `Set`, `RegExp`, `Date`, `BigInt`, `URL`, `Uint8Array`, `Uint16Array`, `Uint32Array`, and `Infinity`. **Functions cannot cross the island boundary** — they exist only during server rendering.

Serialized props are embedded as attributes on the `<astro-island>` element. On the client, Astro's runtime deserializes them before passing to the framework's client entrypoint. This means integration authors don't need to implement custom serialization — they receive already-deserialized props.

Slots follow a different path. The server renderer receives slots as `Record<string, string>` — HTML strings keyed by slot name. Each integration wraps these in framework-appropriate constructs: Vue uses a `StaticHtml` component that renders via `innerHTML` wrapped in `<astro-slot>` tags, Svelte uses `createRawSnippet()`, and React/Preact set `dangerouslySetInnerHTML`. The `astroStaticSlot` optimization (enabled by `supportsAstroStaticSlot: true`) uses `<astro-static-slot>` for non-hydrating slot content, which Astro strips during final HTML processing.

**Server Islands** (stable since Astro 5) use `server:defer` and follow a different data path entirely: props are encrypted and sent as a GET query string (switching to POST if the URL exceeds 2048 bytes), with the component rendered asynchronously on the server and injected via a fetch.

## What changed in Astro 5 and 6 for integration authors

**Astro 5** made several integration-relevant changes: `clientEntrypoint` and `serverEntrypoint` now accept `URL` types alongside strings. The `@astrojs/lit` integration was **removed** due to low adoption (~1% of users) and the experimental state of Lit SSR. The output modes were simplified — `output: 'hybrid'` merged into `output: 'static'`, leaving only `'static'` and `'server'`. The `app.render()` signature changed to accept a single `renderOptions` object. Server Islands moved from experimental to stable. The Container API became available for programmatic rendering and testing, with `getContainerRenderer()` exported by all integrations.

**Astro 6** brought more disruptive changes by upgrading to **Vite 7** with its Environment API. The `astro:build:setup` hook now fires once with all environments configured (`ssr`, `client`, `prerender`) instead of separately per build target — the `target` parameter was removed entirely. The `astro:ssr-manifest` virtual module was deleted. The `routes` property was removed from `astro:build:done` (replaced by `astro:routes:resolved`). A new `setPrerenderer()` function in `astro:build:start` allows adapters to implement custom prerendering. Node.js **22.12.0+** is now required.

## Best practices for writing custom integrations

The official integrations reveal several architectural best practices. **Use virtual modules** to pass configuration from the integration entry point to server/client entrypoints — React's `astro:react:opts` pattern with `devalue.uneval()` is the canonical example. **Always set `supportsAstroStaticSlot: true`** unless your framework cannot handle `<astro-slot>` elements in its output. **Use `configEnvironment`** instead of monolithic Vite config to differentiate between client and SSR dependency optimization. **Export `getContainerRenderer()`** alongside the default integration export to support the Container API.

For component detection in `check()`, prefer compile-time signatures over runtime rendering. Vue's `ssrRender`/`__ssrInlineRender` check and Svelte's `$$payload` check are effectively free, while Solid's approach of actually rendering is more expensive but necessary given its compilation model. When multiple JSX frameworks might coexist, implement `include`/`exclude` filtering and warn users who haven't configured disambiguation.

For the client entrypoint, always handle both the hydration case (SSR content exists) and the `client:only` case (no server HTML). Listen for `astro:unmount` events to properly clean up framework roots during View Transitions. Avoid shipping framework-specific polyfills or global shims when possible — Lit's requirement for global DOM shims was a significant pain point that contributed to its deprecation.

## Conclusion

Astro's renderer API achieves remarkable framework agnosticism through a thin three-function contract (`check`, `renderToStaticMarkup`, and the client hydration callback) that each framework fills according to its own rendering philosophy. The most significant architectural insight is that **props serialization and hydration timing are handled entirely by Astro's core** — integrations only need to know how to render and hydrate using their framework's native APIs. This separation of concerns means a new framework integration can be implemented in roughly 200–300 lines across three files, with most complexity residing in Vite plugin configuration rather than rendering logic. The Astro 6 shift to Vite 7's Environment API is the most impactful recent change for integration authors, requiring per-environment configuration where monolithic Vite config previously sufficed.
