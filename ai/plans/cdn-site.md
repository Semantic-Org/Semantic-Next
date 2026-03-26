# CDN Site (cdn.semantic-ui.com)

## Goal

Stand up a self-hosted CDN at `cdn.semantic-ui.com` backed by Cloudflare R2. Replaces reliance on jsdelivr for serving SUI packages to end users and the docs playground. Provides versioned, deduplicated package files with an import map loader for drop-in usage. All historical versions are permanently available.

## Design

### Why Cloudflare R2

- **Version accumulation is natural** — each release uploads a new version folder, old versions persist because you only add, never delete. No incremental build or deploy-time assembly needed.
- **Free tier covers SUI easily** — 10GB storage, 10M reads/month, zero egress fees
- **Custom domain** — `cdn.semantic-ui.com` points directly to the R2 bucket via Cloudflare
- **Edge cached** — Cloudflare's network handles caching automatically
- **S3-compatible API** — standard tooling for uploads

### Why not alternatives

- **jsdelivr** — intermittent downtime, can't serve CDN format (custom import rewrites)
- **GitHub Pages** — overwrites old versions on each deploy, no accumulation
- **Vercel** — each deploy is a complete snapshot, no good model for accumulating versions across deploys without external storage

### URL Structure

```
cdn.semantic-ui.com/
  @semantic-ui/core/0.18.0/dist/...        # tagged, immutable
  @semantic-ui/core/0.19.0/dist/...        # tagged, immutable
  @semantic-ui/core/latest/dist/...        # alias, updated on release
  @semantic-ui/core/canary/dist/...        # overwritten on each main merge
  @semantic-ui/component/0.18.0/dist/...
  ...
  importmap-0.18.0.json                     # versioned import map
  importmap-latest.json                     # latest stable
  importmap-canary.json                     # latest main
  importmap.js                              # drop-in loader script
  index.html                                # landing page with docs
```

### What it serves

The CDN hosts the full transitive dependency tree — SUI packages, direct dependencies (lit, tailwindcss-iso), and their dependencies (@lit/reactive-element, lit-html, etc.) all as separate folders. Every bare module import at every level is rewritten to its CDN URL. No bundling at any level — complete deduplication via URL identity. This is the same architecture as jsdelivr/esm.sh.

```
cdn.semantic-ui.com/
  @semantic-ui/component/0.18.0/dist/cdn/component.js
  lit/3.2.0/lit.js
  lit/3.2.0/directive.js
  lit/3.2.0/directives/repeat.js
  @lit/reactive-element/2.1.0/reactive-element.js
  tailwindcss-iso/1.0.6/dist/browser.js
  ...
```

Also serves:
- Pre-generated import maps per version
- A landing page with usage docs (partially built at `scripts/cdn/gh-pages/`)

### Publish pipeline

Two GitHub Actions:

**On tagged release:**
1. Build all packages (`npm run build:packages`)
2. Build CDN format artifacts (with `cdnRoot = https://cdn.semantic-ui.com`) — rewrites ALL bare imports (SUI + third-party) to CDN URLs
3. Resolve full transitive dependency tree — walk all SUI and third-party deps recursively. The `resolveBareImports` plugin already walks this graph for rewriting; the same walk drives the upload manifest.
4. Rewrite bare imports at every level (SUI packages, lit, lit-html, @lit/reactive-element, tailwindcss-iso, etc.) to CDN URLs
5. Upload all packages to R2: `@semantic-ui/{pkg}/{version}/...`, `lit/{version}/...`, `@lit/reactive-element/{version}/...`, etc. (skip if version+path already exists in bucket — immutable)
6. Upload `latest/` alias (overwrite)
7. Generate and upload `importmap-{version}.json` and `importmap-latest.json`

**On main merge:**
1. Same build steps
2. Upload to R2 under `canary/` prefix (overwrite)
3. Upload `importmap-canary.json`

The upload script is ~50 lines using the S3-compatible API.

### Repo structure

```
tools/cdn/
  upload.js               # R2 upload script (S3 API)
  generate-importmap.js   # builds import map JSON from package versions
  index.html              # landing page
  importmap.js            # drop-in loader script
```

### Existing work

- `scripts/cdn/` has templates for import map generation, entry point resolution, package index pages, and a landing page — migrate useful parts to `tools/cdn/`
- `resolveBareImports` esbuild plugin already supports `cdnRoot` and `resolver` params

## Dependencies

- [CDN Build Fix](cdn-build-fix.md) — the CDN dist format must rewrite to `cdn.semantic-ui.com` URLs
- Cloudflare account with R2 enabled and `cdn.semantic-ui.com` DNS configured

## Open Questions

- Cache-Control headers — immutable for versioned paths, short TTL for `latest`/`canary`?
- Whether to also serve a `latest` redirect (302) vs a copy of the files
- Third-party package versioning strategy — when SUI bumps its lit dependency, old SUI versions still reference the old lit version (which is fine, it's immutable in the bucket). But need to ensure the upload step doesn't skip uploading a new lit version if one already exists at a different version.
- Lit has many sub-path exports (`lit/directive.js`, `lit/directives/repeat.js`, etc.) — need to upload the full package, not just the entry point

## Status

Not started. Partial scaffolding exists in `scripts/cdn/`.
