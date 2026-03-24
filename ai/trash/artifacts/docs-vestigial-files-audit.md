# Docs Vestigial Files Audit

Audit of `/docs/` for orphaned, unused, or vestigial files.

---

## Summary

| Category | Files | Reclaimable Size |
|----------|------:|-----------------|
| Unused font families (commented-out CSS) | ~33 files | ~480 KB |
| Unused Lato weight variants | 14 files | ~620 KB |
| Unused images (`new-avatar/`, diagrams, misc) | ~19 files | ~3.9 MB |
| Videos (entirely unreferenced) | 7 files | ~2.4 MB |
| Sandbox service worker files | 3 files | ~56 KB |
| Orphaned CSS files | 6 files | — |
| Orphaned JS files | 8 files | — |
| Orphaned components | 3 files | — |
| Archived lesson content | 7 dirs | ~152 KB |
| Vestigial pages (drafts/dupes) | 4 files | — |
| Misc public files | 4 files | — |
| **Total** | **~100+ files** | **~7.6 MB** |

---

## 1. Public Fonts — Commented-Out or Unreferenced

`fonts.css` only has active `@font-face` for **4 Lato weights**. Everything else is either commented out or has no CSS at all.

### Entire directories safe to remove:

| Directory | Files | Why |
|-----------|------:|-----|
| `public/fonts/inter/` | 6 | CSS commented out |
| `public/fonts/plus-jakarta-sans/` | 4 | CSS commented out |
| `public/fonts/public-sans/` | 6 | CSS commented out |
| `public/fonts/geist-sans/` | 2 | CSS commented out |
| `public/fonts/line/` | 5 | Never referenced in any CSS |

### Unused Lato weight variants (14 of 18 files):

Only Regular, Italic, Semibold, SemiboldItalic are declared in `fonts.css`. The rest ship but are never loaded:

- `LatoLatin-Black.woff2`, `LatoLatin-BlackItalic.woff2`
- `LatoLatin-Bold.woff2`, `LatoLatin-BoldItalic.woff2`
- `LatoLatin-Hairline.woff2`, `LatoLatin-HairlineItalic.woff2`
- `LatoLatin-Heavy.woff2`, `LatoLatin-HeavyItalic.woff2`
- `LatoLatin-Light.woff2`, `LatoLatin-LightItalic.woff2`
- `LatoLatin-Medium.woff2`, `LatoLatin-MediumItalic.woff2`
- `LatoLatin-Thin.woff2`, `LatoLatin-ThinItalic.woff2`

### Standalone font files:

| File | Status |
|------|--------|
| `public/fonts/brand-icons.woff2` | No references anywhere |
| `public/fonts/icons.woff2` | Referenced only from orphaned `legacy-sui/icon.css` (itself unused) |

---

## 2. Public Images — Unreferenced

### `public/images/new-avatar/` (entire directory, ~3.8 MB)

Never referenced from source — appears to be candidate replacement avatars:

- `dima.jpg`, `dima.png`, `dima2.png`, `josie.png`, `scarsdale.png`
- `small/dima.jpg`

### Other unreferenced images:

| File | Notes |
|------|-------|
| `public/images/api-banner-image.png` | No references |
| `public/images/background-gradient.webp` | No references |
| `public/images/bg.jpg` | No references (`bg2.jpg` IS used) |
| `public/images/bg3.jpg` | No references |
| `public/images/bg4.png` | No references |
| `public/images/create-diagram.png` | No references |
| `public/images/destroy-diagram.png` | No references |
| `public/images/lifecycle-diagram2.png` | No references (variant of used diagram) |
| `public/images/skeleton/paragraph.png` | No references |
| `public/images/ui.png` | No references |

---

## 3. Public Videos — Entirely Unreferenced (~2.4 MB)

No file in `public/videos/` is referenced from source:

- `1.gif`, `1.mp4`, `1.webm`
- `2.gif`, `2.mp4`
- `3.gif`, `3.mp4`

---

## 4. Public Sandbox — Unreferenced (~56 KB)

These service worker files have no references in the docs source:

- `public/sandbox/playground-service-worker.js`
- `public/sandbox/playground-service-worker-proxy.html`
- `public/sandbox/playground-typescript-worker.js`

---

## 5. Public Misc Files

| File | Notes |
|------|-------|
| `public/cdn-redirector.js` | No references from source |
| `public/cdn-test.html` | No references from source |
| `public/llms.txt` | No references (may be intentional for LLM crawlers) |
| `public/robots.txt` | No references (standard web file — likely intentional) |

> **Note:** `robots.txt` and `llms.txt` are conventionally accessed directly by bots/crawlers and don't need source references. Flag for review but likely intentional.

---

## 6. Orphaned CSS (6 files)

These CSS files exist but are never imported or referenced:

| File | Notes |
|------|-------|
| `src/css/legacy-sui/accordion.css` | Legacy SUI 2.5.0 styles, never imported |
| `src/css/legacy-sui/header.css` | Legacy SUI 2.5.0 styles, never imported |
| `src/css/legacy-sui/icon.css` | Legacy SUI 2.5.0 styles, never imported |
| `src/css/legacy-sui/image.css` | Legacy SUI 2.5.0 styles, never imported |
| `src/css/fake-sui/container.css` | Marked "shim for docs until component ready" |
| `src/css/pages/todo.css` | Styles for `todo-list` element, never imported |

Only `input.css` and `rail.css` from `legacy-sui/` are actively imported (by `Body.astro`).

---

## 7. Orphaned JavaScript (8 files)

### Clearly unused:

| File | Notes |
|------|-------|
| `src/javascript/test.js` | **Empty file** (0 bytes) |
| `src/javascript/query.js` | Sets `globalThis.$ = $`, but never imported from any page |
| `src/javascript/gradient.js` | No references from any source file |
| `src/javascript/sui-classic/accordion.js` | Legacy SUI JS, no references |
| `src/javascript/sui-classic/transition.js` | Legacy SUI JS, no references |

### Plasma/hero variants (developed but not wired up):

`homepage.js` imports only `plasma.js`. These are alternative implementations or overlay effects that were developed but are not currently active:

| File | Notes |
|------|-------|
| `src/javascript/plasma-hq.js` | Alternative plasma implementation |
| `src/javascript/plasma-fast.js` | Performance-optimized variant |
| `src/javascript/plasma-device.js` | Device-specific variant |
| `src/javascript/hero-globe-ui.js` | WebGL globe overlay — not imported |
| `src/javascript/hero-orbiting-ui.js` | Orbiting UI overlay — not imported |
| `src/javascript/hero-particles.js` | Floating particles overlay — not imported |
| `src/javascript/hero-traces.js` | Signal trace overlay — not imported |
| `src/javascript/profiling.js` | Dev benchmarking tool (loaded manually via console) |

> **Note:** The plasma variants and hero overlays appear to be R&D / iteration work. `profiling.js` is a dev-only tool designed to be imported from the console. These may be worth keeping in a different location if still useful for development.

---

## 8. Orphaned Components (3 files)

| File | Notes |
|------|-------|
| `src/components/topbar.js` | Empty file (0 bytes), distinct from active `TopBar.astro` |
| `src/components/SlotComponent.js` | Defines `slot-element` custom element, never imported |
| `src/components/Test/` (directory) | `index.js`, `component.js`, `.css`, `.html` — never imported |

---

## 9. Archived Content (`src/archive/`, ~152 KB)

Entire directory of superseded lesson/tutorial content with no navigation links:

- `112-components/` — Old components tutorial
- `112-components2/` — Duplicate variant
- `113-data-context/` — Obsolete data context tutorial
- `114-subtemplates/` — Archived subtemplate tutorial
- `211-introduction/` — Old introduction
- `311-using-guide/` — Archived usage guide
- `911-introduction/` — Another archived intro

---

## 10. Vestigial Pages

| File | Notes |
|------|-------|
| `src/pages/docs/guides/components/index2.mdx` | Draft variant of components guide |
| `src/pages/docs/guides/components/index3.mdx` | Another draft variant |
| `src/pages/docs/guides/components/specs-old.mdx` | Superseded by current `specs.mdx` |
| `src/pages/test.astro` | Development test page with Checklist component |

---

## 11. Public Fixtures

| File | Status |
|------|--------|
| `public/fixtures/example-data.json` | **Used** |
| `public/fixtures/styles.css` | **Used** |
| `public/fixtures/example-text.txt` | No references found |
| `public/fixtures/template.html` | No references found |

> **Note:** Fixture files may be loaded dynamically at runtime (e.g., via `fetch()` in playground examples). Verify before removing.

---

## Recommended Priority

1. **High confidence, high impact:** Unused font directories (~480 KB), unused Lato variants (~620 KB), `new-avatar/` images (~3.8 MB), videos (~2.4 MB)
2. **High confidence, low impact:** Empty files (`test.js`, `topbar.js`), orphaned CSS, orphaned components, archive directory
3. **Review before removing:** Sandbox files, plasma variants (may want to preserve in a branch), `llms.txt`/`robots.txt`, fixture files
