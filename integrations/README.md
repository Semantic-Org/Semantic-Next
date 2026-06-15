# Semantic UI integrations

Use Semantic UI with your server or build tool. Each integration is a thin adapter over the framework's own renderer or compiler.

## Renderers

Render your components on the server so the page arrives fully styled, with no flash before they upgrade. You write no hydration code. Each tag becomes Declarative Shadow DOM (the HTML that renders a component fully styled before its JavaScript loads), which the browser builds on its own, and the component upgrades itself once its script loads. You write `<my-button>`, the renderer emits its DSD.

| Package | Use it for |
|---|---|
| [`@semantic-ui/server`](./server) | Any server (Express, Hono, node:http) |
| [`@semantic-ui/vite`](./vite) | Vite |
| [`@semantic-ui/eleventy`](./eleventy) | Static sites |
| [`@semantic-ui/astro`](./astro) | Astro |

## Loaders

Add the `?raw` and `?ast` import suffixes you use when authoring components in a bundler. They build your components, they don't render them.

| Package | Use it for |
|---|---|
| [`@semantic-ui/esbuild`](./esbuild) | esbuild |
| [`@semantic-ui/rollup`](./rollup) | Rollup and Rolldown |

The bundler loaders (Vite, esbuild, Rollup) share one engine, [`@semantic-ui/build`](../tools/build). Reach for that directly only for a bundler without a named package.
