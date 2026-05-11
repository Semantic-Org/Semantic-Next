# @semantic-ui/examples

A standalone, runnable copy of every framework example, served as plain HTML pages with bundled component code. Each example is a self-contained folder that builds from source against the monorepo packages.

This directory is mirrored from `docs/src/examples/` by `scripts/sync.js` — the canonical source for each example lives there, not here.

## Running locally

```bash
npm run dev
```

Starts an esbuild dev server at `http://localhost:3000`. The landing page lists every example; each card links to a standalone page that loads its own bundle. Edits to source files trigger automatic rebuilds.

## Layout

```
examples/
├── curriculum.js          pedagogy metadata (order, headlines, intros, notes)
├── index.html             generated landing page
├── index.js               generated barrel re-exporting every example component
├── scripts/
│   ├── sync.js            pulls source from docs/src/examples/, generates pages
│   └── dev.js             esbuild bundler + static server
└── src/
    └── <example-id>/
        ├── component.js   the component definition
        ├── component.html template (when not inlined)
        ├── component.css  shadow-scoped styles (when not inlined)
        ├── page.html      generated wrapper that mounts the component
        ├── page.js        optional page-level orchestration
        └── page.css       optional page-level styles
```

Each `<example-id>` folder is a single example. Files inside `src/` are copies — edits should be made in `docs/src/examples/<example-id>/` and re-synced.

## Adding or editing an example

1. Author the source in `docs/src/examples/<category>/<example-id>/`.
2. Add an entry to `curriculum.js` if the example should appear in the walkthrough. The entry's `id` must match the source folder name.
3. Run `npm run build` to sync, or `npm run watch` to track changes continuously.

`scripts/sync.js` discovers each curriculum ID's source folder, rewrites `getText(...)` calls into Vite-style `?raw` imports, wraps `page.html` in a complete document, and regenerates `index.html` from `curriculum.js` order.

## Curriculum

`curriculum.js` is the source of truth for example ordering and pedagogy metadata. Each entry declares:

- `id` — folder name under `src/` (matches the source folder in `docs/src/examples/`)
- `headline` — short descriptive title rendered on the landing page and per-example header
- `intro` — one paragraph describing what the example does and demonstrates
- `newPatterns` — comma-separated list of framework features introduced in this example
- `whatToNotice` — bullet list of specific observations, each making a claim about a framework capability

`CORE_COUNT` divides the curriculum into an ordered walkthrough (first N examples) and standalone pattern examples (the rest). Inline markdown is supported in prose fields: backticks render as `<code>`, `**double asterisks**` as `<strong>`.

## Scripts

| Command | Effect |
|---|---|
| `npm run dev` | Bundle + serve at `localhost:3000`, watch for source changes |
| `npm run build` | One-shot sync from `docs/src/examples/` and regenerate landing page |
| `npm run watch` | Same as `build`, then keep syncing on source changes |

## Source

The examples are part of the Semantic UI Next monorepo. The framework packages they depend on (`@semantic-ui/component`, `@semantic-ui/query`, `@semantic-ui/templating`, …) are resolved through the workspace, so edits to those packages are picked up immediately by `npm run dev`.
