# CDN Site (cdn.semantic-ui.com)

## Goal

Stand up a self-hosted CDN at `cdn.semantic-ui.com` backed by Cloudflare R2 + Worker. Replaces reliance on jsdelivr for serving SUI packages to end users and the docs playground. Provides versioned, deduplicated package files with an import map loader for drop-in usage. All historical versions are permanently available.

## Design

### Infrastructure: Cloudflare R2 + Worker

- **R2** — Object storage. Each release uploads a new version folder, old versions persist (add-only). Free tier: 10GB storage, 10M reads/month, zero egress fees.
- **Worker** — Sits in front of R2. Handles URL routing, version alias resolution (302 redirects for `latest`/`canary`), clean URL → R2 key mapping, cache headers, and package index pages.
- **Custom domain** — `cdn.semantic-ui.com` via Cloudflare (DNS already managed there).

### Why not alternatives

- **jsdelivr** — intermittent downtime, can't serve CDN format (custom import rewrites)
- **GitHub Pages** — overwrites old versions on each deploy, no accumulation
- **Vercel** — each deploy is a complete snapshot, no model for accumulating versions across deploys

### URL Structure

SUI packages get clean top-level paths. Third-party deps live under `/vendor/`. No `/npm/` prefix, no `/dist/cdn/` internals — the Worker flattens these. The `@semantic-ui/` scope is dropped since the domain already establishes ownership.

```
# SUI packages — first-class, clean paths
cdn.semantic-ui.com/core@0.18.0/semantic-ui.min.js
cdn.semantic-ui.com/component@0.18.0/component.min.js
cdn.semantic-ui.com/reactivity@0.18.0/reactivity.min.js

# Full npm paths also work (Worker alias)
cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js

# Third-party — under /vendor/
cdn.semantic-ui.com/vendor/lit@3.3.2/lit.js
cdn.semantic-ui.com/vendor/lit@3.3.2/directive.js
cdn.semantic-ui.com/vendor/@lit/reactive-element@2.1.1/reactive-element.js
cdn.semantic-ui.com/vendor/tailwindcss-iso@1.0.6/browser.min.js
cdn.semantic-ui.com/vendor/tailwindcss@4.1.12/dist/lib.mjs

# Version aliases — 302 redirect to exact version
cdn.semantic-ui.com/core@latest/...     → 302 → core@0.18.0/...
cdn.semantic-ui.com/core@canary/...     → 302 → core@canary-abc123/...

# CSS — top-level with version alias
cdn.semantic-ui.com/semantic-ui@0.18.0.css
cdn.semantic-ui.com/semantic-ui@latest.css    → 302 → versioned
cdn.semantic-ui.com/semantic-ui.css           → 302 → latest

# Import map loader + data
cdn.semantic-ui.com/importmap.js              → latest (synchronous, inline)
cdn.semantic-ui.com/importmap@0.18.0.js       → pinned (immutable)
cdn.semantic-ui.com/importmap@canary.js       → canary
cdn.semantic-ui.com/importmap@0.18.0.json     → raw JSON
```

### Entry point resolution

SUI packages follow a naming convention: the CDN entry point is `{name}.min.js` (e.g., `component.min.js`, `reactivity.min.js`, `semantic-ui.min.js`). The Worker derives this from the package name — no manifest needed. Requests without a filename (e.g., `cdn.semantic-ui.com/component@0.18.0`) serve a package info page.

Third-party packages under `/vendor/` need a manifest since their naming isn't predictable. Generated at upload time.

### Worker routing

The Worker maps clean public URLs to R2 keys:

```
/core@0.18.0/semantic-ui.min.js
  → R2: @semantic-ui/core/0.18.0/dist/cdn/semantic-ui.min.js

/@semantic-ui/core@0.18.0/semantic-ui.min.js
  → same R2 key (alias)

/vendor/lit@3.3.2/directive.js
  → R2: vendor/lit/3.3.2/directive.js

/core@latest/...
  → 302 redirect to /core@0.18.0/...

/semantic-ui.css
  → 302 → /semantic-ui@latest.css → 302 → /semantic-ui@0.18.0.css
```

### Cache headers

| URL pattern | Cache-Control |
|---|---|
| Exact version (`core@0.18.0/...`) | `public, max-age=31536000, immutable` |
| `latest` alias | `public, max-age=300` (5 min) — serves 302 redirect |
| `canary` alias | `public, max-age=60` (1 min) — serves 302 redirect |
| `importmap.js` (latest) | `public, max-age=300` |
| `importmap@0.18.0.js` (pinned) | `public, max-age=31536000, immutable` |

### Import map loader

The loader is **synchronous** — it embeds the import map data directly, no fetch. This avoids the race condition where `<script type="module">` blocks execute before an async fetch completes.

```js
// cdn.semantic-ui.com/importmap.js — auto-generated at publish time
(function() {
  const script = document.createElement('script');
  script.type = 'importmap';
  script.textContent = JSON.stringify({
    "imports": {
      "@semantic-ui/core": "https://cdn.semantic-ui.com/core@0.18.0",
      "@semantic-ui/component": "https://cdn.semantic-ui.com/component@0.18.0"
      // ... all SUI packages, bare URLs — Worker resolves entry points
    }
  });
  document.currentScript.after(script);
})();
```

The import map only contains SUI packages — no `lit`, no `tailwindcss-iso`. Users never import those directly. All sub-dependency resolution happens via the rewritten imports in the CDN format files.

### Getting started

**Using pre-built UI components:**
```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/semantic-ui.css">
<script src="https://cdn.semantic-ui.com/importmap.js"></script>

<script type="module">
  import '@semantic-ui/core';
</script>

<ui-button primary>Click Me</ui-button>
```

**Building custom components:**
```html
<script type="importmap">
{
  "imports": {
    "@semantic-ui/component": "https://cdn.semantic-ui.com/component@0.18.0/component.min.js"
  }
}
</script>

<script type="module">
  import { defineComponent } from '@semantic-ui/component';

  defineComponent({
    tagName: 'current-time',
    template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
    defaultState: { time: new Date() },
    onCreated({ state }) {
      setInterval(() => state.time.now(), 1000);
    }
  });
</script>

<current-time></current-time>
```

### Full dependency tree

~14 runtime packages, intentionally small:

**SUI packages (8):**
```
@semantic-ui/component → query, reactivity, renderer, templating, utils
@semantic-ui/query → utils
@semantic-ui/reactivity → (none)
@semantic-ui/renderer → templating, utils
@semantic-ui/templating → utils
@semantic-ui/utils → (none)
@semantic-ui/specs → utils
@semantic-ui/tailwind → component, utils, tailwindcss-iso
```

**Lit tree (4 runtime packages):**
```
lit → lit-element, lit-html, @lit/reactive-element
lit-element → @lit/reactive-element, lit-html, @lit-labs/ssr-dom-shim
lit-html → (none at runtime)
@lit/reactive-element → @lit-labs/ssr-dom-shim
@lit-labs/ssr-dom-shim → (none)
```

**Tailwind path (2 packages):**
```
tailwindcss-iso → tailwindcss (peer dep)
tailwindcss → (none — self-contained 680K dist, relative chunk imports only)
```

### Canary channel

On every main merge, SUI packages upload under `canary` version. The CDN build resolver uses `canary` for `@semantic-ui/*` packages and the locked version for external deps.

```
cdn.semantic-ui.com/component@canary/component.min.js
  → imports from cdn.semantic-ui.com/utils@canary/...           (SUI → canary)
  → imports from cdn.semantic-ui.com/vendor/lit@3.3.2/...       (external → pinned)
```

### Versioning rules

- **Exact versions** — immutable, permanent
- **`latest`** — 302 redirect to current stable release. Updated on tagged release.
- **`canary`** — 302 redirect to canary build ID. Updated on main merge.
- **No semver ranges** — `core@^0.18.0` is not supported
- **No `latest` for third-party** — always pinned to lockfile version

302 redirects for aliases are critical: the browser resolves to the exact version URL, so `latest` and `0.18.0` share module identity. No duplicate instantiation.

### Publish pipeline

Two GitHub Actions:

**On tagged release:**
1. Build all packages (`npm run build:packages`)
2. Build CDN format artifacts (`cdnRoot = https://cdn.semantic-ui.com`) — rewrites all bare imports to CDN URLs. SUI packages use tag version, external deps use lockfile version.
3. Resolve full transitive dependency tree → upload manifest
4. Upload SUI packages to R2 (skip if version already exists)
5. Upload third-party deps to R2 (skip if version already exists)
6. Generate and upload `importmap@{version}.js`, `importmap@{version}.json`
7. Update `latest` version pointer (KV or manifest file in R2)
8. Regenerate `importmap.js` (latest) and upload
9. Upload `semantic-ui@{version}.css`

**On main merge:**
1. Same build, resolver uses `canary` for SUI packages
2. Upload SUI packages under canary version
3. Update canary pointer
4. Regenerate `importmap@canary.js`

### Pages

- **Root** (`cdn.semantic-ui.com/`) — landing page: quick start, import map examples, package grid. Rewrite from scratch (current GH Pages version is 1+ years stale).
- **Package index** (`cdn.semantic-ui.com/component@0.18.0`) — entry point URL, import snippet, link to docs. Served by Worker when request has no file extension.

### CDN Index Pages (separate scope — frontend agent)

The CDN needs two HTML pages served by the Worker. These should be designed by a frontend agent using the `frontend-design` skill.

**Root landing page** (`cdn.semantic-ui.com/`)
- Quick start: CSS link + importmap loader + one import line
- Package grid with all SUI packages and their descriptions
- Import methods: loader script vs static import map vs direct URL
- Links to docs, GitHub

**Package info page** (`cdn.semantic-ui.com/component@0.18.0`)
- Currently the Worker serves JS when no filepath is given (for import map resolution)
- For browser navigation (human visiting the URL), serve an HTML info page instead
- Use content negotiation: `Accept: text/html` → info page, otherwise → JS entry point
- Show: package name, version, entry point URL, copy-paste import map snippet, link to docs

**Files to create/modify:**
- `tools/cdn/templates/index.html` — root landing page template (new)
- `tools/cdn/templates/package.html` — package info page template (new)
- `tools/cdn/worker/index.js` — add content negotiation to the SUI route's no-filepath case, serve root page from `_meta/index.html` in R2
- `tools/cdn/upload.js` — add step to generate and upload landing page HTML (with current version/package data baked in)

**Constraints:**
- Pages must work as static HTML (no client-side rendering framework)
- Should match the Semantic UI visual language
- Landing page needs to be updated on each release (version numbers in examples)
- Existing `scripts/cdn/gh-pages/index.html` is 1+ years stale but can be used as structural reference (not design reference)

### Repo structure

```
tools/cdn/
  worker/               # Cloudflare Worker source
    index.js            # routing, redirects, cache headers, index pages
    manifest.js         # version pointers (latest, canary)
  upload.js             # R2 upload script (S3 API)
  generate-importmap.js # builds importmap.js and importmap.json
  generate-pages.js     # landing page + package index templates
  templates/            # HTML templates
  wrangler.toml         # Cloudflare Worker config
```

### Deployment strategy

**Phase 1: Local testing**
- Build CDN format artifacts locally, run upload script against R2 bucket
- Deploy Worker to `cdn.semantic-ui.com` (no traffic yet — GH Pages DNS still active)
- Verify: URLs resolve, Worker routing works, cache headers correct, 302 redirects work, import map loader is synchronous, package index pages render

**Phase 2: Playground integration**
- Point the docs playground's production path at `cdn.semantic-ui.com` (swap jsdelivr in `injections.js` and `importmap.json.js`)
- Deploy a docs preview build, verify all playground examples work end-to-end with CDN format files
- This validates the full chain: CDN build → upload → Worker → import map → playground iframe

**Phase 3: Go live**
- Cut DNS from GH Pages to R2/Worker (no migration — current GH Pages CDN is unused, project is pre-1.0)
- Enable GitHub Actions for release and canary pipelines
- The CDN is live. Getting started docs reference it.

### Existing work & cleanup

- `scripts/cdn/` has templates for import map generation, entry point resolution, and a landing page. Migrate useful parts to `tools/cdn/`, then delete `scripts/cdn/`.
- Remove GitHub Pages CDN workflow (`.github/workflows/cdn-deploy.yml` if it exists).
- `resolveBareImports` esbuild plugin already supports `cdnRoot` and `resolver` params.

## Dependencies

- [CDN Build Fix](cdn-build-fix.md) — the CDN dist format must rewrite bare imports to `cdn.semantic-ui.com` URLs
- Cloudflare R2 bucket + Worker configured with `cdn.semantic-ui.com`

## What Jack Needs to Set Up

### Cloudflare (one-time, ~15 min)

1. **Create R2 bucket** — Cloudflare dashboard → R2 → Create Bucket. Name it `semantic-ui-cdn` or similar.
2. **Create R2 API token** — R2 → Manage R2 API Tokens → Create. Needs `Object Read & Write` permission on the bucket. Save the Access Key ID and Secret Access Key.
3. **Bind custom domain** — R2 bucket settings → Custom Domains → Add `cdn.semantic-ui.com`. Cloudflare handles the DNS record and SSL automatically since you already manage DNS there.
4. **Create Worker** (optional initially — can start with R2 direct serving, add Worker later for clean URL routing). Workers & Pages → Create → Worker. Route it to `cdn.semantic-ui.com/*`.

### GitHub (one-time, ~5 min)

5. **Add secrets** to the repo: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` (your account's R2 endpoint URL), `R2_BUCKET_NAME`.
6. **Create two workflow files** — `.github/workflows/cdn-release.yml` (on tag) and `.github/workflows/cdn-canary.yml` (on main merge).

### Then We Build

7. The upload script, Worker, import map generator, and GitHub Actions are all code — we write those together in `tools/cdn/`.

## Status

Not started. Partial scaffolding exists in `scripts/cdn/`. Fresh-take evaluation at `ai/workspace/tmp/cdn-url-design-evaluation.md`.

## Completion

- **Estimated:** 24-40h (3-5d) pair
- **Actual:** ~6h pair
- **Completed:** 2026-03-27
- **Delta notes:** Came in well under estimate. Cloudflare R2 + Worker was straightforward. CDN build fix (bare import rewriting) done in parallel.
