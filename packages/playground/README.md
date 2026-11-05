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

An app that owns its URLs (a client-side router at `/team/acme`) has paths that are not files. `new PlaygroundProject({ fallback: 'index.html' })` serves that document for any navigation whose path has no file, so a reload, an "open in new tab" or a shared preview link lands in the app, and `previewUrl` itself opens it at its root. Only document loads fall back; a fetch for a missing asset still 404s. A fallback served for a deep path carries a `<base href>` at the session root, so the document's relative `./app.js` resolves the same from `/team/acme` as from the root (the usual `<base>` caveat applies: in-page `#hash` links resolve against the root too).

## Preview

`PlaygroundPreview` binds a project to an iframe the host owns. Every served document carries a small bridge script, injected at build time like the import map, that reports the document's location and uncaught errors to the parent and takes navigation commands. The host never reaches into the frame's window or depends on what the app exposes as globals.

```js
import { PlaygroundPreview, PlaygroundProject } from '@semantic-ui/playground';

const project = new PlaygroundProject({ files, fallback: 'index.html' });
const preview = new PlaygroundPreview({ project, frame: iframe, path: '/' });

preview.on('navigate', ({ path, canGoBack, canGoForward }) => urlBar.textContent = path);
preview.on('error', ({ message }) => status.textContent = message);
preview.reload();            // also what every build does: in place, on the route the app is on
preview.navigate('/team/acme');
preview.back(); preview.forward();
preview.url;                 // the sandbox url of the current route, for an open-in-new-tab link
project.build();
```

A frame whose document never reported (a navigation that never committed, the missing-session page) is replaced rather than reloaded, so the host should read `preview.frame` rather than keep its own reference. Attributes on the frame carry over.

## Resolution

Import-map entries pass through untouched — the map is injected into served documents and the browser resolves natively, which is what lets mapped packages fetch sibling assets (wasm, fonts). Bare specifiers outside the map rewrite to CDN ESM URLs (jsdelivr `/+esm` semantics), versioned from the project's `package.json` when present.

## Build shape

JS files take the fast path: `es-module-lexer` scan plus import rewriting, no TypeScript load. The TypeScript module (a ~3.5MB lazy chunk) loads only when a project contains `.ts`, `.tsx` or `.jsx` files or requests completions/hover/diagnostics — render-only sessions never pay for it.

JSX compiles through TypeScript's automatic runtime: `.jsx` and `.tsx` files emit `import { jsx } from 'react/jsx-runtime'`, which resolves like any bare specifier (CDN, or the import map). `new PlaygroundProject({ jsxImportSource: 'preact' })` points it at another runtime. Outputs rename to `.js`, so imports between files use the `.js` name, as with TypeScript. Frameworks whose JSX needs their own compiler (Solid, Vue) are out of scope: the build's one compiler is TypeScript.

## Host head injection

`new PlaygroundProject({ headHTML })` injects host-supplied HTML into the `<head>` of every served document at build time, alongside the import map — including documents the project authors itself. Fragments serve byte-identical and editor source is untouched, so an embedding host can sync its theme into previews, add instrumentation, or set a `<base>` without polluting what the user reads and edits. Mechanism lives here; policy (what to inject) stays with the host.

## Editor theming

`createEditor({ theme })` adopts CSS text into the editor's root. Nest rules under `.cm-editor` (`.cm-editor .cm-gutters { … }`, `.cm-editor .cm-cursor { … }`): CodeMirror's base theme scopes its own rules under a generated class at that same specificity, and the adopted sheet comes later in the cascade, so nested rules win. A flat `.cm-gutters { … }` loses on specificity and needs `!important`.

## Pragmas

Special comments shape what the editor shows without changing what builds:

```
/* sui-hide */ … /* sui-hide-end */       invisible in the editor, present in output
/* sui-fold */ … /* sui-fold-end */       collapsed behind a "…" widget
<!-- sui-hide --> … <!-- sui-hide-end --> same, HTML comment dialect
```

`playground-hide` / `playground-fold` are recognized aliases. Pragma comments are never visible — folded or expanded — and decorations never mutate the document.

Hidden regions leave a gap in the document's line numbers (6, then 13). `createEditor({ lineNumbers: 'continuous' })` numbers the lines the reader sees instead, so a sample with hidden scaffolding reads 1 to N.

## Assets

`npm run build` bundles the two workers into `dist/assets/` as self-contained files. Consumers serve that directory statically at the sandbox path (the docs site copies it into `public/sandbox/` via `docs/scripts/sync-sandbox.mjs`) — the assets must never enter a dev server's transform pipeline.
