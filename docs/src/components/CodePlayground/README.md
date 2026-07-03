# CodePlayground

Interactive code sandboxes for docs pages, built on [`@semantic-ui/playground`](../../../../packages/playground/README.md) — the engine owns builds, serving, and editor internals; this component owns the docs UI around them.

## The pieces

| Piece | Role |
|---|---|
| `CodePlayground.js` | Full editor: file tabs/panels, editors, LSP + TypeScript intelligence, preview, AST tab |
| `../ExamplePreview/` | Chromeless variant: project + preview only, for embedding live examples outside docs pages. Accepts a shared `project` setting, which is how CodePlayground drives its own preview pane |
| `../../helpers/playground.js` / `injections.js` | Resolve example files, inject import maps, SUI bundles, error interceptor, theme script |
| `lib/lsp-client.js` | Singleton client for the SUI template LSP worker |
| `lib/codemirror.css` | Editor theme, adopted into the shadow root alongside the engine's structural styles |
| `public/sandbox/` | Engine worker assets, synced from the package by `docs/scripts/sync-sandbox.mjs` — rerun after rebuilding the playground package |

## How the parts connect

CodePlayground owns a `PlaygroundProject` (created in `setFiles`). Each visible file hosts an editor adapter from `@semantic-ui/playground/editor`; edits flow through `fileEdited` into the project, which rebuilds debounced and reloads the preview on `buildDone`. Language intelligence composes per file type: `.html` files get the SUI LSP plugin (completions, hover, diagnostics for template syntax), `.js`/`.ts` files get TypeScript completions, hover, and diagnostics from the shared tooling worker.

The AST tab compiles `component.html` (or the `template:` string in `component.js`) with `TemplateCompiler` on every edit.

## Notes

- **Theme**: sandbox documents can't read the embedding page's theme from localStorage — pages like the homepage force a theme without persisting it. The injected head script (and each `page`-type example's own copy) inherits from `window.frameElement.ownerDocument` instead, falling back to localStorage when not framed.
- **Package URLs**: the sandbox import map and injected bundles resolve from `injections.js`: local dev serves `${SITE}/node_modules`, static builds serve `${SITE}/packages` (populated by `copy-docs-packages.js`), production uses the CDN. `SITE` must be a real deployable origin at build time — prebuilt CI deploys bake the branch alias in via the deploy workflow, since `VERCEL_URL` doesn't exist outside Vercel's own builders.
- **Boilerplate folding**: `hideComponentBoilerplate` in `helpers/playground.js` wraps imports and exports in fold pragmas. The engine's pragma regions handle display; see the package README for marker semantics.
