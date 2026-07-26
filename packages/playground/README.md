# @semantic-ui/playground

Sandbox engine for live code examples: give it a set of files, get back a real URL serving them — plus builds, module resolution, and language intelligence. Headless by design; UI components are consumers of the same API an agent uses.

```js
import { PlaygroundProject } from '@semantic-ui/playground';

const project = new PlaygroundProject({
  files: {
    'page.html': { content: '<html>…</html>' },
    'component.js': { content: '…' },
  },
});
await project.build();
iframe.src = `${project.previewUrl}page.html`;
```

## The pieces

| Seam | Entry | Role |
|---|---|---|
| Project | `@semantic-ui/playground` | `PlaygroundProject` — files model, build orchestration, sessions, events (`buildStart`, `buildDone`, `buildError`, `filesChanged`, `urlChanged`, `recovered`) |
| Worker | `dist/assets/tooling-worker.js` | one shared worker per page multiplexing every project: transform, bare-import CDN rewriting, lazily-loaded TypeScript intelligence |
| Serving | `@semantic-ui/playground/serving` + `dist/assets/service-worker.js` | sessions served at real URLs under the sandbox scope; materialized files, broadcast recovery, self-healing ports |
| Editor | `@semantic-ui/playground/editor` | CodeMirror-backed editor adapter: per-file states with undo history, pragma regions, composable completion sources |

## Serving model

Every project file gets a real URL at `{sandboxUrl}sui-playground-v1/{sessionId}/{path}`. Any call shape inside the sandbox resolves — `fetch('./component.html')`, dynamic `import()`, `new URL(rel, import.meta.url)`, stylesheet and asset references. Non-transformed files serve byte-identical.

The service worker holds sessions fully materialized. Its failure model is recovery, not prevention: a terminated or replaced worker broadcasts for the owning page, which reconnects and re-pushes; a session port that stops answering is reopened and the send retried. Previews recover by iframe replacement, never reload.

## Resolution

Import-map entries pass through untouched — the map is injected into served documents and the browser resolves natively, which is what lets mapped packages fetch sibling assets (wasm, fonts). Bare specifiers outside the map rewrite to CDN ESM URLs (jsdelivr `/+esm` semantics), versioned from the project's `package.json` when present.

## Build shape

JS files take the fast path: `es-module-lexer` scan plus import rewriting, no TypeScript load. The TypeScript module (a ~3.5MB lazy chunk) loads only when a project contains `.ts` files or requests completions/hover/diagnostics — render-only sessions never pay for it.

## Host head injection

`new PlaygroundProject({ headHTML })` injects host-supplied HTML into the `<head>` of every served document at build time, alongside the import map — including documents the project authors itself. Fragments serve byte-identical and editor source is untouched, so an embedding host can sync its theme into previews, add instrumentation, or set a `<base>` without polluting what the user reads and edits. Mechanism lives here; policy (what to inject) stays with the host.

## Pragmas

Special comments shape what the editor shows without changing what builds:

```
/* sui-hide */ … /* sui-hide-end */       invisible in the editor, present in output
/* sui-fold */ … /* sui-fold-end */       collapsed behind a "…" widget
<!-- sui-hide --> … <!-- sui-hide-end --> same, HTML comment dialect
```

`playground-hide` / `playground-fold` are recognized aliases. Pragma comments are never visible — folded or expanded — and decorations never mutate the document.

## Assets

`npm run build` bundles the two workers into `dist/assets/` as self-contained files. Consumers serve that directory statically at the sandbox path (the docs site copies it into `public/sandbox/` via `docs/scripts/sync-sandbox.mjs`) — the assets must never enter a dev server's transform pipeline.
