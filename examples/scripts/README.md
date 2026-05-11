# examples/scripts

Build and dev tooling for the examples package. Two scripts: `sync.js` regenerates the static pages; `dev.js` serves them with live rebuild. Both are pure Node + esbuild — no framework-specific tooling.

## sync.js

Mirrors example sources from `docs/src/examples/` into `examples/src/`, regenerates `index.html` from `curriculum.js`, and writes a top-level barrel re-exporting every component.

```bash
node scripts/sync.js                    # sync all examples once
node scripts/sync.js todo-list clock    # sync just the named examples
node scripts/sync.js --watch            # initial sync + watch for source changes
```

For each example it:

1. Walks `docs/src/examples/` to find the source folder matching the curriculum `id`.
2. Wipes the destination folder under `examples/src/<id>/` and copies the files verbatim.
3. Rewrites docs-style imports (`const x = await getText('./foo.html')`) into Vite-style `?raw` imports (`import x from './foo.html?raw'`) so the dev bundler can pick them up.
4. Wraps `page.html` in a complete HTML document — adds doctype, theme-bootstrap script, framework CSS/JS, the example's own bundle, and the lesson-notes panel rendered from `curriculum.js`.
5. Rewrites root-relative asset paths (e.g. `/images/avatar/...`) to point at the published docs origin, since those assets aren't served locally.

After all examples sync, it regenerates `examples/index.html` (the landing page) and `examples/index.js` (a barrel that re-exports every component class).

The mirror is one-way: `docs/src/examples/` is the canonical source. Edits to `examples/src/` are overwritten on the next sync.

## dev.js

esbuild-based bundler and static server. Discovers every folder under `examples/src/`, bundles its `component.js` (and `page.js`, if present) into `examples/dist/<id>/`, and serves the entire `examples/` directory at `http://localhost:3000`.

```bash
node scripts/dev.js
```

The generated `page.html` files reference `/dist/<id>/component.js` for the bundle; the bundler watches source files and rebuilds on change. Framework packages are resolved through the workspace, so edits to `packages/*` are picked up on the next request.

A small esbuild plugin (`raw-text`) routes `.css?raw` and `.html?raw` imports to the text loader so the same source can be consumed by the docs site (via `getText`) and the examples bundler (via `?raw`) without modification.

## page.css

Stylesheet inlined into every generated `page.html` by `sync.js`. Keeps the per-page footprint to one HTTP request and lets `sync.js` regenerate pages without touching a shared stylesheet on disk.
