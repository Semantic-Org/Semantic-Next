# Semantic UI integrations

Use Semantic UI with your server or build tool. Each integration is a thin adapter over the framework's own renderer or compiler.

## Server Side Hydration

These plugins can be used to render SUI components on the server. 

They work by finding web components in your html and then rendering them as DSD (Declarative Shadow DOM). This allows them to appear fully styled before the component loads on the client. 

SUI components do not need any additional code to support hydration in your client bundle as their own lifecycle events will detect the DSD and upgrade the component on the client.

| Package | Use it for |
|---|---|
| [`@semantic-ui/server`](./server) | Any server (Express, Hono, node:http) |
| [`@semantic-ui/vite`](./vite) | Vite |
| [`@semantic-ui/eleventy`](./eleventy) | Static sites |
| [`@semantic-ui/astro`](./astro) | Astro |

## Build Pipeline Tools

SUI provides tools to support build pipelines to improve the experience authoring Semantic UI components.

* `?raw` - Lets you load raw assets like css or templates on the server using `import foo.html?raw`
* `?ast` - Lets you import a Semantic UI template as an AST to pass directly to `defineComponent` and avoid runtime compilation
  
| Package | Use it for |
|---|---|
| [`@semantic-ui/esbuild`](./esbuild) | esbuild |
| [`@semantic-ui/rollup`](./rollup) | Rollup and Rolldown |

The bundler loaders (Vite, esbuild, Rollup) share one engine, [`@semantic-ui/build`](../tools/build). Reach for that directly only for a bundler without a named package.
