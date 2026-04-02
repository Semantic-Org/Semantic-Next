# CDN Load Endpoint

## Goal

Replace the current `importmap.js` / `importmap.json` endpoints with a unified `/load` endpoint that serves as the single entry point for using Semantic UI from the CDN. The loader injects an import map and handles component loading, CSS token injection, page-level styles, icon sets, and fonts — collapsing the entire setup into a single tag.

The endpoint should embody SUI's natural language philosophy: every attribute reads as a declarative instruction, not a technical configuration.

## Target Snippet

```html
<!-- Most common: just works — tokens, Lato, Lucide all auto-injected -->
<script src="https://cdn.semantic-ui.com/load" components="button,input,modal"></script>
<ui-button primary><ui-icon home></ui-icon> Home</ui-button>

<!-- Full page ownership: add page-level styles (reset + base) -->
<script src="https://cdn.semantic-ui.com/load" components="button,input,modal" css></script>

<!-- Override defaults: different icon set, suppress font -->
<script src="https://cdn.semantic-ui.com/load" components="button" icons="phosphor" fonts="none"></script>

<!-- Embedding: suppress all auto-injection, manage CSS yourself -->
<script src="https://cdn.semantic-ui.com/load" components="button" css="none" icons="none" fonts="none"></script>
```

One line of setup. One line of markup.

## Design Decisions (Settled)

### Endpoint naming: `/load` not `/loader` or `/importmap`

**Decision:** The endpoint is `/load`.

**Rationale:** Read the tag as a sentence — "script source: CDN load components button, input, modal, icons, fonts." `load` is a verb that forms a grammatical sentence with the attributes that follow it. `loader` is a noun next to other nouns (`loader components button` doesn't parse as English). `importmap` describes the mechanism, not the intent.

**Ecosystem context:** The term "loader" has deep lineage (SystemJS, RequireJS, the original ES Module Loader spec, Node's `--loader` flag). But the endpoint name should describe what the user is *doing*, not what the infrastructure *is*. The user is loading packages, not configuring a loader.

### Attribute naming: bare attributes as capabilities

**Decision:** Every SUI package name is a valid bare attribute on the loader tag. Each reads as a single word describing what you need.

**`components`** — the primary path. Cherry-pick or use presets. Auto-injects tokens, Lato, Lucide.

```html
<!-- Cherry-pick -->
<script src="https://cdn.semantic-ui.com/load" components="button,input,modal"></script>

<!-- Named preset -->
<script src="https://cdn.semantic-ui.com/load" components="standard"></script>
```

Presets (standard, extended, full) are sourced from the `bundle` field in each component's `.spec.js` and resolve through the existing combo endpoint. No new code needed.

**`authoring`** — for building custom components. Injects import map + tokens (custom component CSS needs them). No SUI components, fonts, or icons loaded.

```html
<script src="https://cdn.semantic-ui.com/load" authoring></script>
<script type="module">
  import { defineComponent } from '@semantic-ui/component';
</script>
```

**`reactivity`, `query`, `utils`, `templating`, `renderer`, `compiler`, `specs`** — bare attributes that eagerly load the named package. Import map always injected. No CSS auto-injection.

```html
<script src="https://cdn.semantic-ui.com/load" reactivity></script>
<script type="module">
  import { Signal, Reaction } from '@semantic-ui/reactivity';
</script>
```

```html
<script src="https://cdn.semantic-ui.com/load" query></script>
<script type="module">
  import { $ } from '@semantic-ui/query';
</script>
```

```html
<script src="https://cdn.semantic-ui.com/load" utils></script>
<script type="module">
  import { capitalize, unique } from '@semantic-ui/utils';
</script>
```

**Combining attributes:** Bare attributes compose naturally:

```html
<!-- Use SUI components + build custom ones -->
<script src="https://cdn.semantic-ui.com/load" components="button" authoring></script>

<!-- Reactivity + utils without UI -->
<script src="https://cdn.semantic-ui.com/load" reactivity utils></script>

<!-- Just the import map, nothing loaded -->
<script src="https://cdn.semantic-ui.com/load"></script>
```

**Why bare attributes over `packages="reactivity"`:** The SUI pattern is bare attributes as words. `<ui-button primary>` not `<ui-button variant="primary">`. The loader follows the same philosophy — `<script load reactivity>` reads as English. `packages` as an attribute is retired.

### CSS attribute: inferred tokens, opt-in page styles

**Decision:** `components` auto-injects everything needed for a complete UI: tokens, default font (Lato), and default icon set (Lucide). The `css` attribute opts into page-level styles. `="none"` overrides any auto-injection.

| Attribute | With `components` | With `packages` |
|---|---|---|
| *(none)* | Tokens + Lato + Lucide auto-injected | Nothing injected |
| `css` | Above + reset + base (page styles) | Tokens + reset + base |
| `css="none"` | Nothing CSS-related injected | Nothing injected |
| `icons="none"` | Suppress icon auto-injection | — |
| `fonts="none"` | Suppress font auto-injection | — |

**Why everything is inferred with `components`:** The natural language context drives it. "Load components button" is a complete instruction — the user expects working components. Tokens, fonts, and icons are all component dependencies:
- **Tokens:** Shadow DOM CSS references `var(--primary-color)`, `var(--text-color)`, etc. Without them, components have broken styling. No valid use case for components without tokens.
- **Fonts:** Components reference `var(--page-font)` which resolves to `'Lato', ...`. Without Lato loaded, text renders in Arial — subtly wrong spacing and weight. An LLM generating UI can't diagnose this; the human sees "looks off" but can't identify why.
- **Icons:** Button's most common pattern is `<ui-button><ui-icon home></ui-icon> Save</ui-button>`. Without icon CSS, the icon renders as an empty box. The icon CSS is ~6KB gzipped with lazy SVG loading — no wasted bandwidth for unused icons.

This means `<script src="/load" components="button"></script>` just works. Zero failure modes. The minimum viable tag produces a complete, correct UI.

**Why `="none"` overrides exist:** For users embedding into existing pages who have their own font, token layer, or icon system. These are power users making deliberate choices — the escape hatch is for them, not the common case.

**Why `css` (bare) means page styles:** With tokens/fonts/icons inferred, `css` becomes explicitly about page-level styling — the reset (normalize) and base stylesheet (body font, heading sizes, link styles, scrollbar appearance, `text-wrap: pretty`, `field-sizing: content`, etc.). This is genuinely opt-in because it affects elements outside your components. The distinction is "components only" vs "components + page."

**Why nothing is inferred with `packages`:** The `packages` path is for users who know what they're doing — loading standalone libraries like `reactivity` or `utils` that have no CSS dependency. Even `packages="core"` doesn't auto-inject because the user has explicitly chosen the lower-level API; they're responsible for their own setup.

**Token safety:** The token stylesheet is pure custom property declarations. It doesn't style any elements. It can't conflict with anything. The variables sit inert until a component's Shadow DOM references them. Auto-injection is safe for any page — WordPress, React, an existing design system.

**Shadow DOM isolation:** Components don't need the reset or base because Shadow DOM boundaries prevent external selectors from reaching inside. The reset (normalize.css) targets specific elements (`h1`, `button`, `input`, etc.) — none of these match inside a shadow root.

### Non-standard attributes: intentional spec deviation

**Decision:** Use bare attributes (`css`, `packages`, `components`, `icons`, `fonts`) directly on the `<script>` tag, not `data-` prefixed.

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
1. **Components (happy path):** `/load` with `components` — cherry-pick what you need, tokens auto-injected, import map available for subsequent imports.
2. **Packages (full control):** `/load` with `packages` — load full package entry points, manage CSS yourself. For standalone libraries or advanced use.
3. **Direct URL imports (no loader):** `<script type="module" src="https://cdn.semantic-ui.com/core@0.18.0">` — good for single-file experiments, CodePens. Tradeoff: CDN-coupled imports, manual CSS.

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
<!-- Full page (equivalent to components + css + icons + fonts) -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/icons/lucide">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/fonts/lato">
<script src="https://cdn.semantic-ui.com/load" components="button,input,modal"></script>

<!-- Embedding (equivalent to components + icons + fonts — tokens only) -->
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css@0.18.0/tokens">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/icons/lucide">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/fonts/lato">
<script src="https://cdn.semantic-ui.com/load" components="button,input,modal" css="none"></script>
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

### JS loading (bare attributes)

| Attribute | Behavior |
|---|---|
| `components="button,input"` | Cherry-pick components via combo endpoint. Auto-injects tokens, Lato, Lucide. |
| `components="standard"` | Named preset (standard, extended, full). Same auto-injection. |
| `authoring` | Loads `@semantic-ui/component`. Auto-injects tokens only. |
| `reactivity` | Loads `@semantic-ui/reactivity`. No auto-injection. |
| `query` | Loads `@semantic-ui/query`. No auto-injection. |
| `utils` | Loads `@semantic-ui/utils`. No auto-injection. |
| `templating` | Loads `@semantic-ui/templating`. No auto-injection. |
| `renderer` | Loads `@semantic-ui/renderer`. No auto-injection. |
| `compiler` | Loads `@semantic-ui/compiler`. No auto-injection. |
| `specs` | Loads `@semantic-ui/specs`. No auto-injection. |
| `tailwind` | Loads `@semantic-ui/tailwind`. No auto-injection. |
| *(none)* | Import map only — resolution without loading. |

### CSS & assets (override defaults)

| Attribute | Behavior |
|---|---|
| `css` | Injects full page styles: tokens + reset + base |
| `css="none"` | Suppresses all CSS auto-injection |
| `icons` (bare) | Lucide (same as default with `components`) |
| `icons="phosphor"` | Override default icon set |
| `icons="lucide,brands"` | Multiple sets |
| `icons="none"` | Suppress icon auto-injection |
| `fonts` (bare) | Lato (same as default with `components`) |
| `fonts="lato"` | Explicit font set |
| `fonts="none"` | Suppress font auto-injection |

### Injection logic

**With `components`:** Full component experience — tokens, Lato, Lucide auto-injected. `css` adds page styles. `="none"` suppresses any individual resource.

**With `authoring`:** Tokens auto-injected (custom component CSS needs them). No fonts, icons, or SUI components.

**With package attributes (`reactivity`, `query`, `utils`, etc.):** Nothing auto-injected. `css`, `icons`, `fonts` opt in explicitly.

**Bare `/load`:** Import map only.

### CSS sub-endpoints (explicit `<link>` usage)

For fine-grained control, the CSS layers are available as individual endpoints:

| URL | Content |
|---|---|
| `/css` | Everything (tokens + reset + base) — same as `css` attribute |
| `/css@0.18.0/tokens` | Pure custom properties only — auto-injected by `components` |
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

  var base = 'https://cdn.semantic-ui.com';
  var v = /* version, baked in at build time */;
  var hasComponents = s.hasAttribute('components');
  var hasAuthoring = s.hasAttribute('authoring');
  var cssNone = s.getAttribute('css') === 'none';

  // 2. Inject CSS resources
  if (!cssNone) {
    if (s.hasAttribute('css')) {
      injectCSS(base + '/css@' + v);
    } else if (hasComponents || hasAuthoring) {
      injectCSS(base + '/css@' + v + '/tokens');
    }
  }

  // 3. Icons — auto-inject lucide with components
  var iconsAttr = s.getAttribute('icons');
  if (iconsAttr !== 'none') {
    var icons = iconsAttr || (hasComponents ? 'lucide' : null);
    if (icons) {
      icons.split(',').forEach(function(set) {
        injectCSS(base + '/icons@' + v + '/' + set.trim());
      });
    }
  }

  // 4. Fonts — auto-inject lato with components
  var fontsAttr = s.getAttribute('fonts');
  if (fontsAttr !== 'none') {
    var fonts = fontsAttr || (hasComponents ? 'lato' : null);
    if (fonts) {
      fonts.split(',').forEach(function(set) {
        injectCSS(base + '/fonts@' + v + '/' + set.trim());
      });
    }
  }

  // 5. Load components (via combo endpoint)
  var components = s.getAttribute('components');
  if (components) {
    import(base + '/core@' + v + '/' + components);
  }

  // 6. Load authoring lib
  if (hasAuthoring) {
    import(base + '/component@' + v);
  }

  // 7. Load bare package attributes
  var pkgs = ['reactivity','query','utils','templating','renderer','compiler','specs','tailwind'];
  // Note: 'component' is handled by 'authoring' above — not in this list
  // because `<script load component>` reads ambiguously
  pkgs.forEach(function(pkg) {
    if (s.hasAttribute(pkg)) {
      import(base + '/' + pkg + '@' + v);
    }
  });

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
| `src/css/tokens.css` | `tokens.min.css` + `.map` | `@semantic-ui/core/{version}/dist/tokens.min.css` |
| `src/css/global/reset.css` | `reset.min.css` + `.map` | `@semantic-ui/core/{version}/dist/reset.min.css` |
| `src/css/global/base.css` | `base.min.css` + `.map` | `@semantic-ui/core/{version}/dist/base.min.css` |

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

## Resolved Questions

1. **Import map scope:** Include all SUI packages. Mappings are inert if unused, data is small, and having everything available means any subsequent `<script type="module">` just works.

2. **`packages` attribute retired.** Replaced by bare package attributes (`reactivity`, `query`, `utils`, etc.) following SUI's bare-attribute pattern. `<script load reactivity>` reads as English.

3. **Component sub-selection:** Separate `components` attribute (not overloaded on `packages`). `components="button,modal"` triggers the combo endpoint. Named presets (`components="standard"`) also supported.

4. **Auto-injection with `components`:** Tokens, Lato font, and Lucide icons are all auto-injected — they are component dependencies, not separate resources. An LLM generating UI gets a complete, correct result from `components="button"` alone. `css="none"`, `icons="none"`, `fonts="none"` override individually.

5. **Auto-injection with `authoring`:** Tokens auto-injected (custom component CSS needs them). No fonts or icons — the authoring user manages their own. `tailwind` alongside `authoring` doesn't change this; Tailwind users who also want tokens get them via `authoring`. Those who don't add `css="none"`.

6. **`css` attribute semantics:** Bare `css` means full page styles (tokens + reset + base). `css="all"` eliminated — redundant. The default depends on context: `components` auto-injects tokens, `authoring` auto-injects tokens, bare package attributes inject nothing. `css` and `css="none"` are explicit overrides.

7. **`tailwind` as bare attribute:** Loads `@semantic-ui/tailwind` (browser-native Oxide fork for shadow DOM). No auto-injection of its own — training data for LLMs using Tailwind doesn't know about SUI tokens, so mixing them by default would confuse generated code.

## Dependencies

- [CDN Directory Pages](cdn-dir-pages.md) — the load endpoint's behavior and attributes need to be documented on the root dir page and package index pages. Content dependency, not a technical blocker.
- `blocking="render"` browser support — the CSS injection feature depends on this reaching baseline. As of April 2026, 91% global coverage (Chrome, Edge, Safari). Firefox is the sole holdout, committed via Interop 2026. If it slips, the fallback is explicit `<link>` tags with the loader handling only JS.

## Status

Scoped. Design decisions settled, open questions resolved from pair session (2026-04-02). Implementation not started.
