# CDN Tooling

Cloudflare Worker + R2 upload for `cdn.semantic-ui.com`.

## Sourcemaps

All JS and CSS responses include a `SourceMap` HTTP header pointing to the correct `.map` URL. Sourcemap files are accessible alongside their source files:

| Source URL | Sourcemap URL |
|---|---|
| `https://cdn.semantic-ui.com/component@0.18.0` | `SourceMap` header → `/component@0.18.0/component.min.js.map` |
| `https://cdn.semantic-ui.com/core@0.18.0/button.min.js` | `/core@0.18.0/button.min.js.map` |
| `https://cdn.semantic-ui.com/css@0.18.0` | `SourceMap` header → `/semantic-ui@0.18.0.css.map` |
| `https://cdn.semantic-ui.com/semantic-ui@0.18.0.css` | `/semantic-ui@0.18.0.css.map` |

## Endpoints

### CSS

| URL | Behavior |
|---|---|
| `https://cdn.semantic-ui.com/css` | 302 → latest versioned CSS |
| `https://cdn.semantic-ui.com/css@0.18.0` | Versioned, immutable |
| `https://cdn.semantic-ui.com/css@canary` | Canary, 60s TTL |
| `https://cdn.semantic-ui.com/css@latest` | 302 → exact version |
| `https://cdn.semantic-ui.com/semantic-ui.css` | Alias → same as `/css` |
| `https://cdn.semantic-ui.com/semantic-ui@0.18.0.css` | Alias → same as `/css@0.18.0` |
| `https://cdn.semantic-ui.com/semantic-ui@canary.css` | Alias → same as `/css@canary` |

Serves `semantic-ui.min.css` by default (minified).

### Import Map

| URL | Behavior |
|---|---|
| `https://cdn.semantic-ui.com/importmap.js` | Latest loader — synchronous, inline import map |
| `https://cdn.semantic-ui.com/importmap@0.18.0.js` | Versioned loader, immutable |
| `https://cdn.semantic-ui.com/importmap@canary.js` | Canary loader |
| `https://cdn.semantic-ui.com/importmap.json` | Latest raw JSON |
| `https://cdn.semantic-ui.com/importmap@0.18.0.json` | Versioned raw JSON |
| `https://cdn.semantic-ui.com/importmap@canary.json` | Canary raw JSON |

The `.js` loader is a synchronous script that injects a `<script type="importmap">` — no fetch, no race condition with `<script type="module">`.

### SUI Packages

CDN format — all bare imports rewritten to full `cdn.semantic-ui.com` URLs. Deps resolved by the browser via URL identity, no import map needed for sub-dependencies.

**Bare URL (no filename) → serves the package entry point JS:**

| URL | Entry point served |
|---|---|
| `https://cdn.semantic-ui.com/core@0.18.0` | `semantic-ui.min.js` |
| `https://cdn.semantic-ui.com/component@0.18.0` | `component.min.js` |
| `https://cdn.semantic-ui.com/reactivity@0.18.0` | `reactivity.min.js` |
| `https://cdn.semantic-ui.com/query@0.18.0` | `query.min.js` |
| `https://cdn.semantic-ui.com/templating@0.18.0` | `templating.min.js` |
| `https://cdn.semantic-ui.com/renderer@0.18.0` | `renderer.min.js` |
| `https://cdn.semantic-ui.com/compiler@0.18.0` | `compiler.min.js` |
| `https://cdn.semantic-ui.com/utils@0.18.0` | `utils.min.js` |
| `https://cdn.semantic-ui.com/specs@0.18.0` | `specs.min.js` |
| `https://cdn.semantic-ui.com/tailwind@0.18.0` | `tailwind.min.js` |

**Individual files — primitives, components, and behaviors:**

| URL | What it loads |
|---|---|
| `https://cdn.semantic-ui.com/core@0.18.0/button.min.js` | Primitive (individual component) |
| `https://cdn.semantic-ui.com/core@0.18.0/button.js` | Unminified variant |
| `https://cdn.semantic-ui.com/core@0.18.0/copy-button.min.js` | Component (composed from primitives) |
| `https://cdn.semantic-ui.com/core@0.18.0/tooltip.min.js` | Behavior (registers on Query prototype) |
| `https://cdn.semantic-ui.com/core@0.18.0/transition.min.js` | Behavior |
| `https://cdn.semantic-ui.com/specs@0.18.0/icons/meta` | Sub-path, extensionless — tries `.min.js` then `.js` |

**npm path alias — 301 redirect to clean path:**

| URL | Redirects to |
|---|---|
| `https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0` | `/core@0.18.0` |
| `https://cdn.semantic-ui.com/@semantic-ui/component@0.18.0/foo.js` | `/component@0.18.0/foo.js` |

### Vendor Packages

Third-party dependencies with bare imports rewritten to CDN URLs. Always pinned to exact versions from the lockfile — no `latest`/`canary`.

```
https://cdn.semantic-ui.com/vendor/lit@3.3.2/index.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directive.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directives/repeat.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/async-directive.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directives/if-defined.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directives/unsafe-html.js
https://cdn.semantic-ui.com/vendor/lit-element@4.2.1/lit-element.js
https://cdn.semantic-ui.com/vendor/lit-html@3.3.2/lit-html.js
https://cdn.semantic-ui.com/vendor/@lit/reactive-element@2.1.1/reactive-element.js
https://cdn.semantic-ui.com/vendor/@lit-labs/ssr-dom-shim@1.4.0/index.js
https://cdn.semantic-ui.com/vendor/tailwindcss-iso@1.0.6/src/browser/index.js
https://cdn.semantic-ui.com/vendor/tailwindcss@4.1.12/dist/lib.mjs
https://cdn.semantic-ui.com/vendor/@pagefind/modular-ui@1.3.0/npm_dist/mjs/modular-core.mjs
```

### Asset Sets (Icons & Fonts)

Self-hosted icons and fonts, versioned with SUI releases. Extensionless CSS paths serve the set stylesheet; asset files keep their extensions. Browsers only fetch assets that are actually used (CSS custom properties and `@font-face` are lazy).

**Icons:**

| URL | What it loads |
|---|---|
| `https://cdn.semantic-ui.com/icons@0.18.0/lucide` | Lucide icon CSS (text/css, extensionless) |
| `https://cdn.semantic-ui.com/icons@0.18.0/phosphor` | Phosphor icon CSS |
| `https://cdn.semantic-ui.com/icons@0.18.0/tabler` | Tabler icon CSS |
| `https://cdn.semantic-ui.com/icons@0.18.0/material-symbols` | Material Symbols icon CSS |
| `https://cdn.semantic-ui.com/icons@0.18.0/heroicons` | Heroicons icon CSS |
| `https://cdn.semantic-ui.com/icons@0.18.0/brands` | Brand/framework logos (multi-color) |
| `https://cdn.semantic-ui.com/icons@0.18.0/lucide/house.svg` | Individual SVG (resolved by CSS) |

**Fonts:**

| URL | What it loads |
|---|---|
| `https://cdn.semantic-ui.com/fonts@0.18.0/lato` | Lato @font-face CSS (text/css, extensionless) |
| `https://cdn.semantic-ui.com/fonts@0.18.0/lato/LatoLatin-Regular.woff2` | Font file (resolved by CSS) |

**Version aliases** follow the same pattern as all other endpoints:

| URL | Behavior |
|---|---|
| `https://cdn.semantic-ui.com/icons/lucide` | 302 → latest versioned |
| `https://cdn.semantic-ui.com/icons@latest/lucide` | 302 → exact version |
| `https://cdn.semantic-ui.com/icons@canary/lucide` | Canary, 60s TTL |
| `https://cdn.semantic-ui.com/icons@0.18.0/lucide` | Immutable (1 year) |

When preloading font files directly, the `crossorigin` attribute is required:

```html
<link rel="preload"
      href="https://cdn.semantic-ui.com/fonts@0.18.0/lato/LatoLatin-Regular.woff2"
      as="font" type="font/woff2" crossorigin>
```

### Combo Endpoint

Load specific primitives, components, and behaviors with a single `<script>` tag. Core package only — no import map needed.

**Comma-separated (mix any category):**

| URL | Behavior |
|---|---|
| `https://cdn.semantic-ui.com/core@0.18.0/button,input,modal` | Primitives |
| `https://cdn.semantic-ui.com/core@canary/button,tooltip` | Primitive + behavior |
| `https://cdn.semantic-ui.com/core@canary/button,panels,tooltip` | Primitive + component + behavior |

**Named presets (cumulative tiers):**

| URL | Description |
|---|---|
| `https://cdn.semantic-ui.com/core@0.18.0/standard` | General-purpose primitives (~40-50 at 1.0) |
| `https://cdn.semantic-ui.com/core@0.18.0/extended` | Standard + specialized components |
| `https://cdn.semantic-ui.com/core@0.18.0/full` | Every user-facing component |

Presets are sourced from the `bundle` field in each component's `.spec.js` file, aggregated at build time into `dist/presets.json`, and uploaded to R2. The Worker loads presets from R2 with 60s caching.

The Worker generates a tiny JS module that re-exports each component's CDN format file. The browser follows the import chain and deduplicates shared deps by URL identity.

```js
// Generated for /core@0.18.0/button,input,modal
export * from "https://cdn.semantic-ui.com/core@0.18.0/button.min.js";
export * from "https://cdn.semantic-ui.com/core@0.18.0/input.min.js";
export * from "https://cdn.semantic-ui.com/core@0.18.0/modal.min.js";
```

### Version Aliases

| Alias | Behavior | Cache |
|---|---|---|
| `@latest` | 302 redirect to current stable release | 5 min TTL on redirect |
| `@canary` | Served directly (files at canary path in R2) | 60s TTL |
| `@0.18.0` (exact) | Served directly | Immutable (`max-age=31536000`) |

`latest` is updated on tagged release. `canary` is overwritten on every main merge. Vendor packages are always exact versions — no aliases.

## Usage Examples

### Combo endpoint (simplest)

```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/fonts/lato">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/icons/lucide">
<script type="module" src="https://cdn.semantic-ui.com/core@canary/standard"></script>
<ui-button primary>Click Me</ui-button>
<ui-icon home></ui-icon>
<ui-input placeholder="Type here"></ui-input>
```

### Specific components + behavior

```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<script type="module" src="https://cdn.semantic-ui.com/core@canary/button,tooltip"></script>
<script type="module">
  import { $ } from 'https://cdn.semantic-ui.com/query@canary';
  $('ui-button').tooltip();
</script>
<ui-button data-text="Hello!">Hover me</ui-button>
```

### Import map (full control)

```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<script src="https://cdn.semantic-ui.com/importmap.js"></script>
<script type="module">
  import '@semantic-ui/core';
</script>
<ui-button primary>Click Me</ui-button>
```

### Building custom components

```html
<script type="importmap">
{
  "imports": {
    "@semantic-ui/component": "https://cdn.semantic-ui.com/component@0.18.0"
  }
}
</script>
<script type="module">
  import { defineComponent } from '@semantic-ui/component';
  defineComponent({
    tagName: 'my-counter',
    template: 'Count: {count}',
    defaultState: { count: 0 },
    onCreated({ state }) {
      setInterval(() => state.count.increment(), 1000);
    }
  });
</script>
<my-counter></my-counter>
```

## Operations

### Deploy Worker

```bash
cd tools/cdn && npx wrangler deploy
```

Deploy after changing `worker/index.js`. CI deploys the Worker automatically on each main merge and tag push.

### Upload Files

Handled by CI on main merge (canary) and tag push (release). To run manually:

```bash
# Canary
cd tools/cdn && node upload.js --version canary

# Tagged release
cd tools/cdn && node upload.js --version 0.18.0 --latest
```

### Pre-Deploy Check

```bash
node tools/cdn/check-bare-imports.js
```

Scans `dist/cdn/` and `dist/vendor-cdn/` for bare module specifiers that would break without an import map. Runs automatically in CI before upload.

### Post-Deploy Tests

```bash
npm run test:cdn
```

28 Vitest browser tests against the live CDN — verifies combo endpoints, presets, individual files, package imports, and cross-category loading. Runs automatically in CI after deploy.

### Rebuilding Vendor Packages

Vendor packages (lit, tailwindcss-iso, etc.) are built through the CDN rewrite pipeline (`build-vendor-cdn.js`) and uploaded to R2. Currently `--force-vendor` is enabled in CI to ensure vendor files stay in sync with the build pipeline.

To rebuild manually:

1. Rebuild locally: `npm run build:vendor-cdn`
2. Force re-upload: `cd tools/cdn && node upload.js --version canary --force-vendor`

Requires `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` env vars.
