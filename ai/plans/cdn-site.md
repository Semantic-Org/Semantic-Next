# CDN Site (cdn.semantic-ui.com)

## Goal

Stand up a self-hosted CDN at `cdn.semantic-ui.com` as a Vercel project in `tools/cdn`. Replaces reliance on jsdelivr for serving SUI packages to end users and the docs playground. Provides versioned, deduplicated package files with an import map loader for drop-in usage.

## Design

### Why not jsdelivr / GitHub Pages

- jsdelivr has intermittent downtime and slow response times
- GitHub Pages overwrites old versions on each deploy — brittle for versioned packages
- A Vercel deploy gives immutable deploys, edge caching, proper headers, and version preservation

### URL Structure

```
cdn.semantic-ui.com/
  @semantic-ui/core/{version}/dist/...
  @semantic-ui/component/{version}/dist/...
  @semantic-ui/reactivity/{version}/dist/...
  ...
  importmap-{version}.json      # versioned import map
  importmap-latest.json          # latest stable
  importmap.js                   # drop-in loader script
```

### What it serves

- CDN format dist files (bare imports rewritten to `cdn.semantic-ui.com` URLs — no dependency duplication)
- Pre-generated import maps per version
- A landing page with usage docs (partially built at `scripts/cdn/gh-pages/`)

### Existing work

- `scripts/cdn/` has templates for import map generation, entry point resolution, package index pages, and a landing page
- `resolveBareImports` esbuild plugin already supports `cdnRoot` and `resolver` params

### Deployment

- Vercel project at `tools/cdn`
- Publish pipeline: on tagged release, build CDN format artifacts, deploy to Vercel
- Previous versions remain accessible (immutable deploys)

## Dependencies

- [CDN Build Fix](cdn-build-fix.md) — the CDN dist format must rewrite to `cdn.semantic-ui.com` URLs

## Open Questions

- How to handle third-party deps (lit, tailwindcss-iso) — bundle them in or serve them too?
- Version retention policy — serve all versions forever, or prune old ones?
- Whether the publish pipeline should be a GitHub Action or a manual step

## Status

Not started. Partial scaffolding exists in `scripts/cdn/`.
