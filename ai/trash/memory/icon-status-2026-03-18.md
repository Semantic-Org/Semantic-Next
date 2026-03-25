# Icon System Status — 2026-03-18

## Completed

### Core Component (`src/primitives/icon/`)
- `icon.js` — Working `<ui-icon>` with CSS custom property rendering (mask, image, font techniques)
- `icon.html` — Template with link wrapping
- `icon-bundle.css` — Styling
- `specs/` — Complete spec with ~305 canonical icon names as `optionAttributes` (enables `<ui-icon home>` shorthand)

### Canonical Icon Vocabulary (`packages/specs/src/icons/`)
- `mappings.js` (3040 lines) — ~291 canonical names mapped to Lucide, Phosphor, Tabler, Material Symbols, Heroicons. Each entry has category, aliases, description.
- `index.js` — Exports `ICON_NAMES`, `iconMappings`, `ICON_CATEGORIES` (29 categories)
- Naming review mostly done — semantic conflicts resolved (copy/duplicate, active/radio, refresh/sync, tree/hierarchy)

### Generated CSS Icon Sets (`src/primitives/icon/sets/`)
- 5 library sets generated with CSS + SVGs: `lucide/`, `heroicons/`, `tabler/`, `phosphor/`, `material-symbols/`
- 1 hand-maintained set: `dev/` — colored framework logos (React, Vue, Svelte, Angular, Astro, Next.js)
- Build pipeline: `packages/specs/scripts/generate-icon-css.js` + download/fetch/build scripts
- Feather set removed, replaced by Lucide and others

### Research Artifacts
- Universal names vocabulary (240 icons) in `icon-universal-names.md`
- Lucide popularity data, Shadcn usage data, Heroicons partial mappings in `workspace/memory/`

---

## Open / Remaining

### Cross-Library Mapping Issues (`icon-mapping-review.md`)
Unresolved items — mostly heroicons edge cases:
- `anchor` — nautical anchor vs link icon inconsistency across sets
- `dashboard` — wildly different visuals per set
- `record` — heroicons maps to "stop" (square) instead of circle
- `circle` — heroicons maps to "stop" (square)
- `loading` — heroicons/material/ionicons use refresh arrows, not spinners
- Lost semantics: `assigned`, `anonymous`, `typing`, `return` degrade in some sets

### Stroke Width Progressive Enhancement (`plans/add-icon-stroke-width.md`)
Complete plan exists but is **not implemented**. Would add:
- `defaultState` with `resolved` and `svgMarkup`
- `onRendered` hook to decode mask-image data URI into inline SVG
- CSS `--icon-stroke` / `--icon-stroke-cap` / `--icon-stroke-join` custom properties
- `:has(svg)` selector to disable mask when real SVG is present

### Icon Gaps (`artifacts/icon-gaps.md`)
Suggested additions — partially stale (some already added):
- **High priority**: `message`, `scan`, `translate`, `palette`, `rocket`, `crown`, `percent`, `restore`
- **Medium priority**: `maximize`, `minimize`, `badge`, `dot`, `circle-check`, `circle-x`, `dollar`, `signal`
- Already in spec: `hash`, `minus`, `notifications-off`

### Spec Hygiene
- `icon.spec.json` has the `Size` variation defined **twice** (lines 434-536)
- Icon gaps list needs reconciliation against current `mappings.js`
