# CDN Load Endpoint

## Goal

Replace the current `importmap.js` / `importmap.json` endpoints with a unified `/load` endpoint that serves as the single entry point for using Semantic UI from the CDN. The loader injects an import map and optionally loads packages, CSS (tokens only or full page styles), icon sets, and fonts — collapsing up to four separate tags into one.

The endpoint should embody SUI's natural language philosophy: every attribute reads as a declarative instruction, not a technical configuration.

## Target Snippet

```html
<!-- Full page setup (own the page) -->
<script src="https://cdn.semantic-ui.com/load" packages="core" css="all" icons="lucide" fonts="lato"></script>
<ui-button primary>Click Me</ui-button>

<!-- Embedding into an existing page (tokens only, no global styles) -->
<script src="https://cdn.semantic-ui.com/load" packages="core" css icons="lucide"></script>
<ui-button primary>Click Me</ui-button>
```

One line of setup. One line of markup.

## Design Decisions (Settled)

### Endpoint naming: `/load` not `/loader` or `/importmap`

**Decision:** The endpoint is `/load`.

**Rationale:** Read the tag as a sentence — "script source: CDN load packages core, css, icons lucide, fonts lato." `load` is a verb that forms a grammatical sentence with the attributes that follow it. `loader` is a noun next to other nouns (`loader packages core` doesn't parse as English). `importmap` describes the mechanism, not the intent.

**Ecosystem context:** The term "loader" has deep lineage (SystemJS, RequireJS, the original ES Module Loader spec, Node's `--loader` flag). But the endpoint name should describe what the user is *doing*, not what the infrastructure *is*. The user is loading packages, not configuring a loader.

### Attribute naming: `packages` not `load`

**Decision:** The attribute for selecting JS packages is `packages="core"` (or `packages="core,query,reactivity"`).

**Rationale:** Originally considered `load="core"` but the endpoint is already named `/load` — `load` + `load` overloads the word. `packages` describes the *what*, not the *action*. It reads naturally: "load packages core." For combo sub-selection within a package: `packages="core/button,modal"`.

### CSS attribute: `css` not `tokens`, with two tiers

**Decision:** The attribute is `css` (not `tokens`). It supports two tiers:

```html
css              → tokens only (pure custom properties, zero side effects)
css="all"        → tokens + reset (normalize) + base (page-level styling)
```

**Why `css` not `tokens`:** `tokens` is technically more accurate (the bare attribute serves a stylesheet of pure CSS custom properties), but the person writing this tag doesn't know what tokens are yet. Their mental model is "I need CSS for this to look right." When they forget the attribute and components look broken, `css` leads to "oh, I forgot the CSS" while `tokens` leads to "what are tokens?" — a documentation detour.

**Why bare `css` is safe to recommend unconditionally:** The token stylesheet (`tokens.css`) is pure custom property declarations. It doesn't style any elements. It can't conflict with anything. The variables sit inert until a component's Shadow DOM references them. Someone dropping a `<ui-button>` into an existing WordPress page or React app gets working components with zero visual side effects on their existing styles.

**Why components don't need the reset or base:** Shadow DOM boundaries prevent external selectors from reaching inside components. The reset (normalize.css) targets specific elements (`h1`, `button`, `input`, etc.) — none of these selectors match elements inside a shadow root. The only things that cross the boundary are inherited properties on `html`/`body` (`line-height: 1.15`, `-webkit-text-size-adjust: 100%`), both of which SUI components override internally via their own scoped CSS and token references.

**Why `css="all"` is opt-in:** The base stylesheet sets `body` background, font family, text color, heading sizes, link styles, scrollbar appearance, smooth scrolling, `text-wrap: pretty`, `field-sizing: content`, and `interpolate-size: allow-keywords`. These are modern best practices that designers would turn on by default in a fresh project, but they change existing behavior in pages that already have their own styles. The distinction isn't "safe vs dangerous" — it's "components only" vs "components + page."

**Vocabulary consistency:** `css` matches the explicit endpoint (`/css`), so the word stays the same between the one-tag and multi-tag setups:

```html
<!-- one tag, tokens only -->
<script src="https://cdn.semantic-ui.com/load" packages="core" css></script>

<!-- one tag, full page -->
<script src="https://cdn.semantic-ui.com/load" packages="core" css="all"></script>

<!-- explicit, tokens only -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css@0.18.0/tokens">

<!-- explicit, full page -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
```

**Middle tier (`css="reset"`) considered and deferred:** A third tier (tokens + reset, no base) is logically coherent but unlikely to be used. The person who wants that level of control is also the person who writes explicit `<link>` tags. The explicit endpoints (`/css/tokens`, `/css/reset`, `/css/base`) support à la carte selection; the loader attribute keeps it simple with two tiers.

### Non-standard attributes: intentional spec deviation

**Decision:** Use bare attributes (`css`, `packages`, `icons`, `fonts`) directly on the `<script>` tag, not `data-` prefixed.

**Rationale:** The HTML parser doesn't care — non-standard attributes on `<script>` are parsed, stored on the element, and accessible via `getAttribute()`. The browser doesn't throw or warn. The only cost is HTML validator complaints.

The benefit is readability and brand consistency. SUI already uses non-standard attribute syntax on its own components (`<ui-button large>` where `large` is a bare attribute resolved through the spec system). Using `data-packages` would be inconsistent with the framework's identity — it reads like a different framework wrote the first line. `packages="core"` reads like SUI.

**Risks considered:**
- *Future spec collision:* Could `packages` or `css` become real attributes on `<script>`? `css` has no precedent, `packages` is generic but not in any proposal. Low risk, and migratable if it ever happens.
- *Framework interference:* Some frameworks strip non-standard attributes during SSR/hydration. But this is a classic script tag, not a component — frameworks don't process these.
- *Linters:* HTML validators will flag it. Minor annoyance for users who run strict validation.

**Precedent:** Google Analytics used `async` before it was specced. Cloudflare workers use non-standard attributes. The `data-` prefix exists because the web was full of custom attributes — "convention" isn't "requirement."

### Import maps as the happy path

**Decision:** The import map is the primary recommended approach, not the combo endpoint or direct URL imports.

**Rationale:** Import maps have been baseline across all browsers since 2023. Teaching people a proprietary combo URL convention when there's a web standard that does the same job is backwards. The import map approach also produces portable code — if someone later moves to a bundler, their `import '@semantic-ui/core'` statements don't change.

**The three approaches, in recommended order:**
1. **Import map (happy path):** `/load` with `packages` — bare specifiers, standard imports, portable code.
2. **Direct URL imports (no setup):** `<script type="module" src="https://cdn.semantic-ui.com/core@0.18.0">` — good for single-file experiments, CodePens. Tradeoff: CDN-coupled imports.
3. **Combo endpoint (optimization):** `core@0.18.0/button,input,modal` — cherry-pick components in a single request. Performance tool, not a starting point.

### The loader is a classic script (not a module)

**Decision:** `/load` serves a classic (non-module) script.

**Rationale:** Import maps must be present in the DOM before any ES module starts resolving. The browser spec enforces this — once any module has been imported, injecting an import map is an error. A classic synchronous script can inject `<script type="importmap">` into the DOM before any `<script type="module">` is processed by the parser.

This means `/load` cannot be used as `<script type="module" src="...">` and cannot be dynamically `import()`ed from another module. This is an inherent constraint of import maps, not a design choice. The individual package files (e.g., `core@0.18.0/button.min.js`) remain normal ES modules.

## Design Decisions (CSS Injection via `blocking="render"`)

### The FOUC problem

When the loader injects CSS via JavaScript, the injected `<link>` tags are *not* render-blocking by spec. The browser may paint before the CSS arrives, causing a flash of unstyled content. For a design system, this is a dealbreaker.

### Why `blocking="render"` is the answer

The `blocking="render"` attribute on `<link>` elements tells the browser to block rendering until the resource loads — exactly the behavior that parser-discovered `<link>` tags get automatically. This makes JS-injected stylesheets render-safe.

**Browser support (as of April 2026, via caniuse.com/wf-blocking-render):**
- Chrome/Edge: shipped since version 105 (September 2022)
- Safari: shipped since 18.2, including iOS Safari
- Firefox: **not yet supported** (not in 149–152). Mozilla's standards position is "positive." `blocking="render"` is included in the **Interop 2026** focus areas (under Cross-document View Transitions sub-features), meaning all three engine teams have committed to shipping it in 2026.
- Global coverage: **91%** as of February 2026
- SUI 1.0 target: end of 2026 — Firefox is the sole holdout. By 1.0 launch, `blocking="render"` should be fully baseline.

### Alternatives considered and rejected

**`document.write('<link ...')`** — Actually works (written content enters the parser stream and IS render-blocking). But Chrome actively throttles and warns about `document.write` on slow connections, and it breaks if the document has already finished parsing. Building flagship DX on a deprecated API is not viable.

**Inline the CSS tokens into the loader script as a `<style>` block** — The token stylesheet is small (~4-5KB gzipped). Could be baked in at build time. No FOUC because it's synchronous. But CSS then lives inside JS, caching is coupled, version alignment gets fragile. And icons/fonts are still separate resources needing their own loading, so you haven't collapsed everything.

**Rely on practical browser behavior (no explicit blocking)** — Most browsers won't paint if a stylesheet is added to `<head>` before first paint and is still loading. But "in practice" isn't "by spec," varies by browser/connection/document complexity. Shipping a quickstart that sometimes flashes is a bad first impression.

**Explicit `<link>` tags only (no CSS injection)** — Works everywhere today, no FOUC. This is the fallback/explicit-control approach. The tradeoff is more tags, which is fine for production but worse for the golden quickstart snippet.

### Fallback strategy

The explicit multi-tag setup remains documented as the "full control" approach and works in all browsers today:

```html
<!-- Full page (equivalent to css="all") -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/icons/lucide">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/fonts/lato">
<script src="https://cdn.semantic-ui.com/load" packages="core"></script>

<!-- Embedding (equivalent to bare css) -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css@0.18.0/tokens">
<script src="https://cdn.semantic-ui.com/load" packages="core"></script>
```

If `blocking="render"` support is incomplete at 1.0 launch, the loader can detect support and warn in the console, or the docs can note the browser requirement for the single-tag CSS attributes.

## Versioning Behavior

Follows the same pattern as all other CDN endpoints:

| URL | Behavior | Cache |
|---|---|---|
| `/load` | 302 → latest versioned | 5 min TTL on redirect |
| `/load@latest` | 302 → exact version | 5 min TTL on redirect |
| `/load@canary` | Served directly | 60s TTL |
| `/load@0.18.0` | Served directly | Immutable (1 year) |

The raw import map JSON remains available for manual use:

| URL | Behavior |
|---|---|
| `/load@0.18.0.json` | Raw import map JSON |
| `/load@0.18.0` | Classic script (the loader) |

## Attribute Reference

| Attribute | Type | Example | Behavior |
|---|---|---|---|
| `packages` | Comma-separated | `packages="core"`, `packages="core,query,reactivity"` | Injects import map, then dynamically imports the listed packages |
| `css` | Boolean or keyword | `css` (bare) | Injects token stylesheet only (`/css/tokens@{version}`) with `blocking="render"` |
| `css` | | `css="all"` | Injects tokens + reset + base (`/css@{version}`) with `blocking="render"` |
| `icons` | Value | `icons="lucide"`, `icons="lucide,phosphor"` | Injects icon stylesheet(s) with `blocking="render"` |
| `fonts` | Value | `fonts="lato"` | Injects font stylesheet(s) with `blocking="render"` |

Without `packages`, the loader only injects the import map (resolution without loading). This is useful when the consumer's own `<script type="module">` handles imports.

Without any CSS/icons/fonts attributes, the loader only handles JS — no stylesheets injected.

### CSS sub-endpoints (explicit `<link>` usage)

For fine-grained control, the CSS layers are available as individual endpoints:

| URL | Content |
|---|---|
| `/css` | Everything (tokens + reset + base) — same as `css="all"` |
| `/css@0.18.0/tokens` | Pure custom properties only — same as bare `css` |
| `/css@0.18.0/reset` | Normalize (depends on tokens) |
| `/css@0.18.0/base` | Page-level styling (depends on tokens + reset) |

All follow standard versioning: `/css@0.18.0/tokens`, `/css@canary/tokens`, `/css/tokens` (302 → latest), etc. The version goes on the parent (`/css@version/layer`), consistent with icons (`/icons@version/lucide`) and fonts (`/fonts@version/lato`).

## Implementation Sketch

The loader script (served as a classic script):

```js
(function() {
  var s = document.currentScript;

  // 1. Inject import map (always)
  if (!document.querySelector('script[type="importmap"]')) {
    var map = document.createElement('script');
    map.type = 'importmap';
    map.textContent = JSON.stringify(/* baked in at build time */);
    document.head.appendChild(map);
  }

  // 2. Inject CSS resources (if requested)
  var base = 'https://cdn.semantic-ui.com';
  var v = /* version, baked in at build time */;

  if (s.hasAttribute('css')) {
    var cssValue = s.getAttribute('css');
    if (cssValue === 'all') {
      // Full page: tokens + reset + base
      injectCSS(base + '/css@' + v);
    } else {
      // Bare attribute or css="tokens": tokens only
      injectCSS(base + '/css@' + v + '/tokens');
    }
  }

  var icons = s.getAttribute('icons');
  if (icons) {
    icons.split(',').forEach(function(set) {
      injectCSS(base + '/icons@' + v + '/' + set.trim());
    });
  }

  var fonts = s.getAttribute('fonts');
  if (fonts) {
    fonts.split(',').forEach(function(set) {
      injectCSS(base + '/fonts@' + v + '/' + set.trim());
    });
  }

  // 3. Load packages (if requested)
  var pkgs = s.getAttribute('packages');
  if (pkgs) {
    pkgs.split(',').forEach(function(pkg) {
      import(base + '/' + pkg.trim() + '@' + v);
    });
  }

  function injectCSS(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('blocking', 'render');
    document.head.appendChild(link);
  }
})();
```

### Build-time concerns

- The import map JSON and version string are baked in at build time (same as current `importmap.js` in `upload.js:buildImportMap()`).
- The loader is generated per-version, uploaded to R2 alongside other versioned assets.
- The raw `.json` variant is the import map data without the loader wrapper.

### Build system changes

**New CSS entry points.** Currently `build-ui-framework.js` produces one CSS output (`semantic-ui.min.css`) from `all.css`. Three additional esbuild CSS builds are needed:

| Entry file | Output | R2 key pattern |
|---|---|---|
| `src/definitions/tokens.css` | `tokens.min.css` + `.map` | `@semantic-ui/core/{version}/dist/tokens.min.css` |
| `src/definitions/global/reset.css` | `reset.min.css` + `.map` | `@semantic-ui/core/{version}/dist/reset.min.css` |
| `src/definitions/global/base.css` | `base.min.css` + `.map` | `@semantic-ui/core/{version}/dist/base.min.css` |

Each uses esbuild's CSS loader (which follows `@import`). Tokens has ~30 sub-imports to resolve into one flat file. Reset and base are essentially flat already. This is adding entry points to the existing pipeline, not a structural change.

**Loader script generation.** The `buildImportMap()` function in `upload.js` currently generates `importmap@{version}.js` and `importmap@{version}.json`. This needs to be extended to also generate `load@{version}.js` and `load@{version}.json`. The `.json` output is identical (raw import map). The `.js` output is the new loader IIFE (with import map JSON and version baked in).

### Upload changes

`upload.js` currently uploads CSS via a hardcoded list of four files (`semantic-ui.css`, `.css.map`, `.min.css`, `.min.css.map`). This list needs to expand to include the sub-layer files:

```js
const cssFiles = [
  'semantic-ui.css', 'semantic-ui.css.map', 'semantic-ui.min.css', 'semantic-ui.min.css.map',
  'tokens.css', 'tokens.css.map', 'tokens.min.css', 'tokens.min.css.map',
  'reset.css', 'reset.css.map', 'reset.min.css', 'reset.min.css.map',
  'base.css', 'base.css.map', 'base.min.css', 'base.min.css.map',
];
```

The `uploadImportMaps()` function needs a parallel `uploadLoader()` that writes `_meta/load@{version}.js` and `_meta/load@{version}.json`. The `updateVersionPointer()` function needs to update `load@latest` and bare `load.js`/`load.json` in the same way it currently handles `importmap@latest`.

### Worker routing changes

The Worker (`worker/index.js`) needs three additions to `parseRoute()` and the fetch handler:

**1. `/load` endpoint** — mirrors the import map pattern but with the new name:

```js
// In parseRoute():
const loadMatch = pathname.match(/^\/load(?:@(.+))?\.(js|json)$/);
if (loadMatch) {
  return { type: 'load', version: loadMatch[1] || null, format: loadMatch[2] };
}
// Bare /load (no extension) → defaults to .js format
if (pathname === '/load' || pathname.match(/^\/load@([^.]+)$/)) {
  return { type: 'load', version: /* extract */, format: 'js' };
}
```

The fetch handler mirrors the existing `importmap` case — serves from `_meta/load@{version}.js` or `.json`.

**2. CSS sub-paths** — version on the parent, sub-path after (consistent with icons/fonts):

```
/css@0.18.0/tokens   → R2: @semantic-ui/core/0.18.0/dist/tokens.min.css
/css@0.18.0/reset    → R2: @semantic-ui/core/0.18.0/dist/reset.min.css
/css@0.18.0/base     → R2: @semantic-ui/core/0.18.0/dist/base.min.css
/css@0.18.0          → R2: @semantic-ui/core/0.18.0/dist/semantic-ui.min.css (unchanged)
```

This follows the icons pattern (`/icons@0.18.0/lucide`) — version on the parent, layer name as sub-path. The existing `cssShortMatch` regex needs to be extended to capture an optional sub-path:

```js
const cssMatch = pathname.match(/^\/css(?:@([^/]+))?(?:\/(.+?))?$/);
// cssMatch[1] = version, cssMatch[2] = sub-layer (tokens|reset|base) or undefined
```

The R2 key mapping in the fetch handler routes `sub-layer` → `{sub-layer}.min.css` and `undefined` → `semantic-ui.min.css`. Sourcemap handling (`.map` suffix, `SourceMap` header, inline rewrite) applies to all variants.

**3. Backward compatibility** — the existing `/importmap.js` and `/importmap@{version}.json` endpoints continue to work unchanged. The `/load` endpoint is additive.

### Test changes

**Unit tests** (`test/unit/worker.test.js`): Add `parseRoute` tests for the new patterns:

```js
describe('parseRoute — load endpoint', () => {
  it('/load → latest loader', ...);
  it('/load@0.18.0 → versioned loader', ...);
  it('/load@canary.json → canary raw JSON', ...);
});

describe('parseRoute — CSS sub-paths', () => {
  it('/css@0.18.0/tokens → tokens only', ...);
  it('/css@canary/reset → canary reset', ...);
  it('/css/tokens → latest tokens', ...);
});
```

**Browser tests** (`test/browser/cdn.test.js`): Add tests for the new CSS sub-endpoints and loader:

```js
describe('CDN CSS Sub-endpoints', () => {
  it('/css@canary/tokens returns CSS', ...);
  it('/css@canary/tokens does not include reset or base rules', ...);
  it('/css@canary returns full CSS (tokens + reset + base)', ...);
});

describe('CDN Loader', () => {
  it('/load serves classic script with import map', ...);
  it('/load.json serves raw import map JSON', ...);
});
```

## Open Questions

1. **Should the import map include all SUI packages or only the ones listed in `packages`?** Currently the import map resolves all SUI packages. Unused mappings are inert (the browser ignores them), but it means loading `packages="reactivity"` also injects mappings for `core`, `query`, etc. This is probably fine — the import map data is small and having all mappings available means subsequent `<script type="module">` blocks can import any SUI package without additional setup. Confirm this is acceptable.

2. **Should `packages` without a value (bare boolean) load a default set?** e.g., `<script src="/load" packages css>` could default to `packages="core"`. This is even more concise but might be too magical. Leaning toward requiring an explicit value.

3. **Combo sub-selection syntax in `packages`.** Is `packages="core/button,modal"` supported? This would trigger the combo endpoint under the hood. Needs design for how this interacts with the import map (the import map resolves bare specifiers, but combo loads are URL-based).

## Dependencies

- [CDN Directory Pages](cdn-directory-pages.md) — the load endpoint's behavior and attributes need to be documented on the root dir page and package index pages. Content dependency, not a technical blocker.
- `blocking="render"` browser support — the CSS injection feature depends on this reaching baseline. As of April 2026, 91% global coverage (Chrome, Edge, Safari). Firefox is the sole holdout, committed via Interop 2026. If it slips, the fallback is explicit `<link>` tags with the loader handling only JS.

## Status

Initial scope. Design decisions are settled from a pair session (2026-04-02). Implementation not started. Needs a follow-up session to resolve open questions and finalize the Worker routing changes.
