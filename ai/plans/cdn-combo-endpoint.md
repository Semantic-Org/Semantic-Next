# CDN Combo Endpoint

## Status

Implemented. Deployed to `cdn.semantic-ui.com`.

## What Was Built

A comma-separated component selector and named preset system for loading specific UI components with a single `<script>` tag — no import map, no configuration.

```html
<script type="module" src="https://cdn.semantic-ui.com/core@canary/button,input,modal"></script>
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
```

### Combo Endpoint

The Worker detects combo URLs (commas or preset name) and generates a JS module that re-exports each component's CDN format file. Works with primitives, components, and behaviors interchangeably.

### Presets

Three cumulative tiers — `standard` ⊂ `extended` ⊂ `full` — sourced from the `bundle` field in each component's `.spec.js` file. Aggregated at build time into `dist/presets.json`, uploaded to R2, loaded by the Worker with 60s caching.

### CI Pipeline

1. **Build** → all packages, vendor CDN, UI components
2. **Pre-deploy gate** → `check-bare-imports.js` scans for unresolved bare imports
3. **Upload** → R2 (SUI packages, vendor, import maps, presets)
4. **Deploy** → Cloudflare Worker
5. **Cache purge** → Cloudflare zone purge
6. **Post-deploy verification** → 28 Vitest browser tests against live CDN

### Key Decisions

- **Presets in specs, not a manifest** — the `bundle` field in `.spec.js` files is the source of truth. Keeps preset membership part of the component creation workflow.
- **String, not array** — `bundle: 'standard'` means "in standard, extended, and full." The value is the lowest tier the component appears in.
- **No category presets** — rejected `form`/`layout` in favor of three cumulative tiers. Agents use comma-separated lists for precise control.
- **Behaviors as standalone CDN files** — `tooltip`, `transition`, `attach`, `escape` are loadable individually via the combo endpoint.
- **Worker reads presets from R2** — no hardcoded preset lists to keep in sync.

### Files Changed

- `tools/cdn/worker/index.js` — combo URL detection, shim generation, preset loading from R2
- `tools/cdn/upload.js` — preset manifest upload from `dist/presets.json`
- `tools/cdn/check-bare-imports.js` — pre-deploy bare import scanner
- `tools/cdn/test/browser/cdn.test.js` — combo endpoint + preset browser tests
- `tools/cdn/test/browser/packages.test.js` — individual package import tests
- `tools/cdn/vitest.config.js` — Vitest browser config for CDN tests
- `internal-packages/scripts/src/build-ui-deps.js` — bundle field aggregation
- `src/primitives/*/specs/*.spec.js` — `bundle` field added to all current primitives
- `src/behaviors/*/index.js` — barrel files so behaviors get CDN builds
- `.github/workflows/cdn-canary.yml` — full pipeline with tests and cache purge
- `.github/workflows/cdn-deploy.yml` — same for tagged releases

### Future

- **`standard` preset grows** — currently ~14 components, targeting ~40-50 at 1.0
- **Remove `--force-vendor`** — once vendor files are stable, skip re-upload for existing versions
- **Build service** — if download size becomes a concern, a Worker running esbuild via WASM could produce truly deduplicated single-file bundles. The URL format stays the same.
