# CDN Build Fix

## Goal

Fix the CDN dist format (`dist/cdn/`) so it rewrites bare imports to `cdn.semantic-ui.com` URLs instead of jsdelivr. This is the key to serving packages without dependency duplication — each package file imports from other packages via URL, and the browser deduplicates by URL identity.

## Design

### Current state

The `resolveBareImports` esbuild plugin (`internal-packages/esbuild-resolve-bare-imports/src/index.js`) rewrites bare imports to jsdelivr URLs:

```js
import { Signal } from "@semantic-ui/reactivity"
// becomes
import { Signal } from "https://cdn.jsdelivr.net/npm/@semantic-ui/reactivity@0.18.0/dist/index.min.js"
```

The plugin already supports `cdnRoot` and a custom `resolver` function, but:
- `cdnRoot` defaults to `https://cdn.jsdelivr.net/npm`
- Entry point resolution queries jsdelivr's API (`data.jsdelivr.com`)
- The URL pattern is `{pkg}@{version}/{entrypoint}` (npm/jsdelivr convention)

### Target state

SUI packages use clean paths (scope dropped, `dist/cdn/` flattened). Third-party goes under `/vendor/`.

```js
// SUI package
import { Signal } from "@semantic-ui/reactivity"
// becomes
import { Signal } from "https://cdn.semantic-ui.com/reactivity@0.18.0/reactivity.min.js"

// Third-party
import { unsafeCSS } from "lit"
// becomes
import { unsafeCSS } from "https://cdn.semantic-ui.com/vendor/lit@3.3.2/lit.js"

// Third-party sub-path
import { repeat } from "lit/directives/repeat.js"
// becomes
import { repeat } from "https://cdn.semantic-ui.com/vendor/lit@3.3.2/directives/repeat.js"

// Canary build — SUI uses canary, external stays pinned
import { Signal } from "https://cdn.semantic-ui.com/reactivity@canary/reactivity.min.js"
import { unsafeCSS } from "https://cdn.semantic-ui.com/vendor/lit@3.3.2/lit.js"
```

### Changes needed

1. **Custom resolver** — replace the default jsdelivr resolver with one that:
   - Drops `@semantic-ui/` scope for SUI packages → `{name}@{version}/{name}.min.js`
   - Prefixes `/vendor/` for third-party packages → `vendor/{pkg}@{version}/{entrypoint}`
   - Resolves entry points from local `package.json` exports (no jsdelivr API calls)
   - Accepts a `channel` param (`canary` or a version string) for SUI packages
2. **Entry point resolution** — use the `cdn`/`jsdelivr` export condition from package.json, or the naming convention (`{name}.min.js` for SUI packages). Third-party needs the manifest.
3. **All third-party deps hosted** — no bundling at any level. `lit`, `lit-html`, `@lit/reactive-element`, `@lit-labs/ssr-dom-shim`, `tailwindcss-iso`, `tailwindcss` all get rewritten to `/vendor/` URLs. The full transitive tree is resolved and rewritten.

### What stays the same

- The esbuild plugin architecture — `onResolve` handler marking imports as external with rewritten paths
- The caching system for entry point resolution
- The `directReplacements` mechanism (useful for edge cases)
- The three build formats (ESM, bundle, CDN) all continue to be produced

## Dependencies

- [CDN Site](cdn-site.md) — needs the R2 bucket and Worker to exist so the URLs resolve

## Completion

- **Estimated:** 8-16h (1-2d) pair
- **Actual:** Completed as part of CDN site (~6h total)
- **Completed:** 2026-03-27
- **Delta notes:** Plugin already had the hooks. Included in CDN site estimate.
