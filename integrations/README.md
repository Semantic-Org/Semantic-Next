# Semantic UI integrations

Use Semantic UI with your framework, build tool, or server. Every integration is a thin adapter over the framework's own renderer. Components server-render to Declarative Shadow DOM and self-hydrate when their JavaScript loads.

| Integration | Package | Use it for |
|---|---|---|
| [Astro](./astro) | `@semantic-ui/astro` | Components in Astro with `client:*` directives |
| [Eleventy](./eleventy) | `@semantic-ui/eleventy` | Static sites, expand tags to DSD at build time |
| [Vite](./vite) | `@semantic-ui/vite` | SSR config for any Vite-based server |
| [esbuild](./esbuild) | `@semantic-ui/esbuild` | `?raw` template and style imports in an esbuild build |
| [Server](./server) | `@semantic-ui/server` | Render on any server (Express, Hono, node:http) |

## How it works

Semantic UI components are custom elements that self-hydrate from Declarative Shadow DOM. On the server, `renderToString` turns a component into a DSD string with no DOM shim. It's pure string work that runs in Node, Bun, Deno, or at the edge. In the browser, the component's `connectedCallback` finds that DSD and wires up reactivity. The host framework only emits the HTML and loads the component JS, which is why each integration stays small.

`@semantic-ui/server` is the common substrate. The others add framework or build-tool glue on top of it.
