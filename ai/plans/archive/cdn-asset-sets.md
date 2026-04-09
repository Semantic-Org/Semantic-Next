# CDN Asset Sets (Icons & Fonts)

## Goal

Establish a top-level CDN route type for static asset sets — icon libraries and font families — so CDN users can load icons and fonts without npm, Google Fonts, or any third-party dependency. Assets are SUI-versioned (the project curates which upstream versions ship) and served extensionless for clean URLs.

## Design Decisions (resolved)

- **Single version axis:** Icons and fonts version with SUI releases. SUI upgrades upstream library versions (Lucide, Lato) as part of its own releases. Users don't pin upstream versions independently.
- **Hosted SVGs, not inlined:** CSS custom properties with `url()` are lazy — the browser only fetches SVGs/fonts that are actually used. A page using 15 of 250 icons pays for 15 requests, not a 500KB bundle.
- **Extensionless CSS:** `/icons/lucide` serves `text/css`, matching the existing `/css` pattern. Assets under the set path keep their extensions (`/icons/lucide/house.svg`).
- **Top-level routes:** `/icons` and `/fonts` are new route types alongside `/css`, `/vendor`, and SUI packages. Not nested under `/core`.
- **Path structure:** CSS at `icons/{lib}.css`, assets flat at `icons/{lib}/*.svg` (no `svg/` subfolder). Build rewrites source paths (`url('./svg/x.svg')` → `url('./{lib}/x.svg')`).

## Endpoints

```
/icons@0.18.0/lucide           → Lucide CSS mappings (text/css)
/icons@0.18.0/phosphor         → Phosphor CSS mappings
/icons@0.18.0/tabler           → Tabler CSS mappings
/icons@0.18.0/material-symbols → Material Symbols CSS mappings
/icons@0.18.0/heroicons        → Heroicons CSS mappings
/icons@0.18.0/dev              → Developer/framework logos
/icons@0.18.0/lucide/house.svg → Individual SVG

/fonts@0.18.0/lato             → Lato @font-face CSS (text/css)
/fonts@0.18.0/lato/lato-regular.woff2 → Font file

/icons/lucide                  → 302 → latest versioned
/icons@latest/lucide           → 302 → exact version
/icons@canary/lucide           → 60s TTL
```

Usage:
```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/fonts/lato">
<link rel="stylesheet" href="https://cdn.semantic-ui.com/icons/lucide">
<script type="module" src="https://cdn.semantic-ui.com/core@canary/standard"></script>

<ui-icon home></ui-icon>
```

## Implementation

### 1. Worker routing (`tools/cdn/worker/index.js`)
- Add `icons` and `fonts` route types to `parseRoute` — pattern: `/{type}@{version}/{name}` and `/{type}@{version}/{name}/{asset}`
- Bare name (no asset path) → serve `{name}.css` as `text/css` (extensionless)
- Asset path → serve from R2 with correct content type
- Same version/cache/redirect logic as all other route types
- Add `.svg: 'image/svg+xml'` and `.woff2: 'font/woff2'` to `CONTENT_TYPES`

### 2. Build step (new script)
- Read icon set CSS from `src/primitives/icon/sets/{lib}/{lib}.css`
- Rewrite `url('./svg/{name}.svg')` → `url('./{lib}/{name}.svg')`
- Write to `dist/cdn/icons/{lib}.css`
- Copy SVGs flat to `dist/cdn/icons/{lib}/*.svg`
- Handle `dev` set separately (SVGs live alongside CSS, not in `svg/` subfolder)
- Wire into wireit build chain

### 3. Font source + build
- Create `src/fonts/lato/` with `@font-face` CSS and woff2 files (sourced from fontsource or Google Fonts download)
- Build: copy CSS to `dist/cdn/fonts/lato.css`, rewrite paths, copy woff2 to `dist/cdn/fonts/lato/`

### 4. Upload (`tools/cdn/upload.js`)
- Extend to upload `dist/cdn/icons/` and `dist/cdn/fonts/` as top-level R2 prefixes
- R2 key pattern: `icons/{version}/{filepath}` and `fonts/{version}/{filepath}`

### 5. Testing
- **Unit tests:** extend `worker.test.js` with `parseRoute` tests for all icon/font URL patterns (versioned, latest, canary, assets, extensionless)
- **Unit tests:** mock R2 fetch tests for extensionless CSS serving, asset serving, version redirects
- **Browser tests:** new test file hitting live CDN — load icon set CSS, verify CSS custom properties resolve, verify SVGs load, verify icons render in `<ui-icon>`
- **Red-team subagent:** spawn adversarial test designer to find edge cases (collisions with existing routes, cache header correctness, CORS on fonts, malformed paths)

### 6. README + docs
- New "Asset Sets (Icons & Fonts)" section in `tools/cdn/README.md`
- Update usage examples to include font/icon `<link>` tags

## Sessions (estimated)

1. Worker routing + unit tests for parseRoute and fetch
2. Build step for icons (CSS rewrite + SVG copy) + verify dist output
3. Font source (Lato) + font build step
4. Upload changes + README
5. Red-team test design + browser tests
6. PR, merge, live CDN verification

## Dependencies

None — unblocked, independent of token finalization and component work.

## Completion

- **Estimated:** 8-16h (1-2d) pair
- **Actual:** ~6.5h wall clock (14:09–20:32 ET), one session. Includes CI wait time, design discussion, and process work (code-review skill, feature process refinements).
- **Completed:** 2026-04-01
- **Delta notes:** Came in under estimate. Major course correction mid-session: relative `url()` in CSS custom properties doesn't resolve relative to the declaring stylesheet — switched to absolute CDN URLs. Also added: semver downgrade guard on latest pointer, `--force-assets` flag, canary upload skip optimization, `dev` → `brands` rename, interactive icon library switcher example, code-review skill, feature process refinements.
