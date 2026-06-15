# Semantic UI integrations

Use Semantic UI with your server or build tool. Each integration is a thin adapter over the framework's own renderer or compiler.

Two kinds:

**Renderers** render your components on the server so the page arrives fully styled, with no flash before they upgrade. You write no hydration code. Each tag becomes Declarative Shadow DOM (the HTML that renders a component fully styled before its JavaScript loads), which the browser builds on its own, and the component upgrades itself once its script loads. You write `<my-button>`, the renderer emits its DSD.

**Loaders** add the `?raw` and `?ast` import suffixes you use when authoring components in a bundler. They build your components, they don't render them.

| Integration | Package | Kind | Use it for |
|---|---|---|---|
| [Server](./server) | `@semantic-ui/server` | renderer | Expand tags to DSD on any server (Express, Hono, node:http) |
| [Vite](./vite) | `@semantic-ui/vite` | renderer | Author and auto-expand your components in Vite |
| [Eleventy](./eleventy) | `@semantic-ui/eleventy` | renderer | Expand tags to DSD at build time for static sites |
| [Astro](./astro) | `@semantic-ui/astro` | renderer | Components in Astro with `client:*` directives |
| [esbuild](./esbuild) | `@semantic-ui/esbuild` | loader | Author your components with esbuild |
| [Rollup](./rollup) | `@semantic-ui/rollup` | loader | Author your components with Rollup or Rolldown |

The bundler loaders (Vite, esbuild, Rollup) share one engine, [`@semantic-ui/build`](../tools/build). Reach for that directly only for a bundler without a named package.
