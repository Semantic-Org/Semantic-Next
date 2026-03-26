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

```js
import { Signal } from "https://cdn.semantic-ui.com/@semantic-ui/reactivity/0.18.0/dist/cdn/reactivity.min.js"
```

Changes needed:
1. Set `cdnRoot` to `https://cdn.semantic-ui.com`
2. URL pattern: `{pkg}/{version}/{entrypoint}` (no `@` before version)
3. Entry point resolution from local `package.json` exports (no jsdelivr API calls) — use the `cdn` or `jsdelivr` export condition
4. Handle third-party deps (lit, tailwindcss-iso) — either bundle them or add direct replacements

### Third-party dependency handling

For SUI packages, the CDN format rewrites cross-package imports. For third-party deps:
- **Option A**: Use `directReplacements` to point at bundled versions on the CDN
- **Option B**: Bundle third-party deps inline (like the bundle format does for tailwind)
- **Option C**: Serve third-party packages on the CDN too

Tailwind's `tailwindcss-iso` dependency is the main case. Lit is the other.

## Dependencies

- [CDN Site](cdn-site.md) — needs a target to rewrite URLs to

## Open Questions

- Should the CDN format be buildable with a configurable base URL, or always target `cdn.semantic-ui.com`?
- How to handle the lit dependency chain (lit has many sub-path exports like `lit/directive.js`)

## Status

Not started. Plugin infrastructure exists, needs configuration and testing.
