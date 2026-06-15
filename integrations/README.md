# Semantic UI integrations

Use Semantic UI with your server or build tool. Each integration is a thin adapter over the framework's own renderer or compiler.

## Renderers

These plugins find web components in your html and render them as DSD (Declarative Shadow DOM). This allows them to appear fully styled before the component loads on the client. SUI components do not need clientside shims to support hydration as their own lifecycle events will detect the DSD and upgrade the component.

| Package | Use it for |
|---|---|
| [`@semantic-ui/server`](./server) | Any server (Express, Hono, node:http) |
| [`@semantic-ui/vite`](./vite) | Vite |
| [`@semantic-ui/eleventy`](./eleventy) | Static sites |
| [`@semantic-ui/astro`](./astro) | Astro |

## Loaders

These integrations support two special use cases which improve experience authoring Semantic UI components
* `?raw` - Let's you load raw assets like css or templates on the server using `import foo.html?raw`
* `?ast` - Let's you import a Semantic UI template as an AST to pass directly to `defineComponent` and avoid runtime compilation
  
| Package | Use it for |
|---|---|
| [`@semantic-ui/esbuild`](./esbuild) | esbuild |
| [`@semantic-ui/rollup`](./rollup) | Rollup and Rolldown |

The bundler loaders (Vite, esbuild, Rollup) share one engine, [`@semantic-ui/build`](../tools/build). Reach for that directly only for a bundler without a named package.
