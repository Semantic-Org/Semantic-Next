---
title: Icon System Architecture
description: How the icon system works end-to-end — mappings, build pipeline, CSS rendering, alias resolution, and how to extend it.
keywords: [icons, icon sets, mappings, build pipeline, aliases, CSS custom properties, contributing]
audience: contributing
skill: icon-system
type: skill
---

# Icon System Architecture

> **Skill:** `icon-system`
> **Purpose:** How the icon system is built, how its artifacts are generated, and how to extend it
> **Last Updated:** 2026-03-19

---

## Overview

Semantic UI's icon system is a **multi-library facade**. Users write semantic names like `home`, `search`, `settings` in their markup, and the system resolves those to actual SVGs from whichever icon library is loaded (Lucide, Phosphor, Tabler, Material Symbols, or Heroicons). Swapping libraries is a one-line import change — zero markup changes.

The system has three layers:

```
mappings.js (source of truth)
    ↓ build scripts
CSS icon sets  +  icons.meta.js (aliases)
    ↓ runtime
<ui-icon> component (renders an <i> tag with CSS custom properties)
```

---

## Source of Truth: `mappings.js`

**Location:** `packages/specs/src/icons/mappings.js`

This single file defines all 481 canonical icon names. Each entry contains:

```js
'arrow-down': {
  category: 'navigation',
  aliases: ['down', 'arrow-downward', 'move-down'],
  description: 'Navigate or move downward',
  lucide: 'arrow-down',
  phosphor: 'arrow-down',
  tabler: 'arrow-down',
  materialSymbols: 'arrow_downward',
  heroicons: 'arrow-down',
},
```

| Field | Purpose |
|-------|---------|
| key | The canonical Semantic UI name — what users write in markup |
| `category` | Groups icons in docs and generated CSS comments |
| `aliases` | Alternative names that resolve to this icon at runtime |
| `description` | Human-readable purpose (used in docs) |
| `lucide`, `phosphor`, etc. | The native name in each icon library (`null` if unavailable) |

**Every other icon artifact is derived from this file.** If you need to add, rename, or remove an icon, this is the only file you edit by hand.

### Supporting files

| File | Purpose | Edited by hand? |
|------|---------|-----------------|
| `packages/specs/src/icons/categories.js` | Display order for the 33 icon categories | Yes |
| `packages/specs/src/icons/index.js` | Re-exports `iconMappings`, `ICON_CATEGORIES`, and `ICON_NAMES` | Rarely |
| `packages/specs/src/icons/icons.meta.js` | Generated — `iconNames[]`, `iconAliasGroups[]`, `iconAliases{}` | **No** (auto-generated) |

---

## Build Pipeline

Three scripts in `packages/specs/scripts/` generate all icon artifacts from `mappings.js`:

### 1. `build-icon-meta.js` → `icons.meta.js`

Generates the JS alias resolution data:

```
mappings.js  →  icons.meta.js
                 ├─ iconNames[]       (481 canonical names)
                 ├─ iconAliasGroups[] (grouped alias arrays)
                 └─ iconAliases{}     (flat lookup: alias → canonical)
```

The grouped format (`[canonical, alias1, alias2, ...]`) reduces bundle size ~40% compared to a flat object. The flat object is expanded once at module load for O(1) lookup.

### 2. `build-icon-css.js` → per-library CSS files

Generates one CSS file per icon library:

```
mappings.js  →  src/primitives/icon/sets/lucide/lucide.css
                src/primitives/icon/sets/phosphor/phosphor.css
                src/primitives/icon/sets/tabler/tabler.css
                src/primitives/icon/sets/material-symbols/material-symbols.css
                src/primitives/icon/sets/heroicons/heroicons.css
```

Each CSS file contains two sections:

**Section 1 — Native Icon Definitions** map library-native names to SVG file URLs:
```css
--icon-house: url('./svg/house.svg');        /* Lucide's native name */
--icon-arrow-down: url('./svg/arrow-down.svg');
```

**Section 2 — Canonical Name Mappings** alias canonical names to native names (only when they differ):
```css
--icon-home: var(--icon-house);              /* canonical → native */
--icon-maximize: var(--icon-maximize-2);
```

Aliases (like `edit` → `pencil`) are **not** in CSS. They were moved to JS in a recent refactor to eliminate thousands of redundant CSS custom properties across all five sets.

### 3. `build-icon-svg.js` → SVG files

Copies actual SVG files from installed npm packages into each set's `svg/` directory:

```
node_modules/lucide-static/icons/house.svg
  → src/primitives/icon/sets/lucide/svg/house.svg
```

This script reads the generated CSS to determine which native names are needed, then resolves them from the appropriate npm package.

### Running the pipeline

```bash
# In order — CSS must exist before SVG copy can read it
node packages/specs/scripts/build-icon-meta.js
node packages/specs/scripts/build-icon-css.js
node packages/specs/scripts/build-icon-svg.js
```

---

## How CSS Rendering Works

The `<ui-icon>` component renders a single `<i>` tag with inline CSS custom properties that reference the icon set's `:root` variables.

### Monochrome icons (mask technique)

The five standard sets (Lucide, Phosphor, Tabler, Material Symbols, Heroicons) use CSS `mask-image`:

```css
.icon {
  background: var(--icon-bg, currentColor);    /* icon color = text color */
  mask-image: var(--icon-mask, var(--icon-fallback));
  mask-size: 100% 100%;
}
```

The component sets `--icon-mask` to the resolved icon variable:

```css
/* For <ui-icon home> */
style="--icon-mask: var(--icon-home);"

/* var(--icon-home) → var(--icon-house) → url('./svg/house.svg') */
```

Because icons are CSS masks filled with `currentColor`, they automatically respond to `color` changes, inherit from parent elements, and work with color variations like `<ui-icon red home>`.

### Multi-color icons (image technique)

The `dev` set uses `background-image` instead of masks to preserve native SVG colors:

```css
/* dev/index.css */
--icon-dev-img: none;        /* set-level default */
--icon-react-mark-img: url('./react-mark.svg');
```

The component generates a fallback chain when `set` is specified:

```css
/* For <ui-icon icon="react-mark" set="dev"> */
style="
  --icon-mask: var(--icon-react-mark, var(--icon-dev));
  --icon-bg-image: var(--icon-react-mark-img, var(--icon-dev-img));
"
```

The mask falls through to `none` while `--icon-bg-image` resolves to the colored SVG.

---

## Alias Resolution

When a user writes `<ui-icon edit>` or `<ui-icon icon="notifications">`, the component resolves the name through `iconAliases` before generating CSS properties:

```js
// icon.js
import { iconAliases } from '@semantic-ui/specs/icons/meta';

// In getIconParts():
const icon = iconAliases[icon] || icon;
// 'edit' → 'pencil', 'notifications' → 'bell', 'home' → 'home' (already canonical)
```

This happens in JavaScript at component initialization, not in CSS. The resolved canonical name is then used to build the CSS custom property references (`var(--icon-pencil)`).

### Why aliases are in JS, not CSS

Previously, every alias was a CSS custom property in every icon set:

```css
/* Old approach — in EVERY set's CSS file */
--icon-edit: var(--icon-pencil);
--icon-notifications: var(--icon-bell);
/* × ~2,500 aliases × 5 sets = ~12,500 extra lines */
```

Moving resolution to a single JS module (`icons.meta.js`) eliminated this redundancy. The alias data is shared across all icon sets and loaded once.

---

## The `<ui-icon>` Component

**Location:** `src/primitives/icon/`

### Key files

| File | Purpose |
|------|---------|
| `icon.js` | Component logic — `getIconParts()`, `getIconStyle()`, alias resolution |
| `icon.html` | Template — renders `<i class="{ui}icon" style={getIconStyle}>` |
| `icon-bundle.css` | Bundled CSS — definition + theme layers for the shadow DOM |
| `specs/icon.spec.js` | Spec definition — declares content, variations, states, settings |
| `specs/icon.component.js` | Auto-generated from spec — the flat attribute map with `optionAttributes` |
| `index.js` | Exports `UIIcon` |

### How shorthand attributes work

The spec system enables `<ui-icon home>` to work as shorthand for `<ui-icon icon="home">`. The spec's `content` definition lists all 481 canonical names as `options` for the `icon` attribute. The compiled `icon.component.js` maps each name in `optionAttributes`:

```js
optionAttributes: {
  "home": "icon",
  "search": "icon",
  "settings": "icon",
  "red": "color",
  "large": "size",
  // ...
}
```

When the component sees an unknown attribute like `home`, it checks `optionAttributes`, finds it maps to `icon`, and treats it as `icon="home"`.

---

## Categories

**Location:** `packages/specs/src/icons/categories.js`

The 31 categories are sorted by typical web app usage frequency:

```
navigation, action, status, user, form, data, file, media,
media-controls, text, editing, communication, social, commerce,
time, security, settings, organization, business, finance,
location, system, device, connectivity, development, brand,
gamification, ai, education, weather, misc
```

Categories affect:
- Comment headers in generated CSS files
- Documentation grouping
- No runtime behavior — they are purely organizational

---

## How to Add a New Icon

1. **Choose or create a canonical name.** Use a descriptive, intent-based name (e.g., `binoculars` not `icon-47`). Check existing names to avoid near-duplicates.

2. **Add the entry to `mappings.js`:**
   ```js
   'binoculars': {
     category: 'action',
     aliases: ['spy', 'observe', 'look-ahead'],
     description: 'Observe or look into the distance',
     lucide: 'binoculars',
     phosphor: 'binoculars',
     tabler: 'binoculars',
     materialSymbols: null,     // null if library doesn't have it
     heroicons: null,
   },
   ```

3. **Run the build pipeline:**
   ```bash
   node packages/specs/scripts/build-icon-meta.js
   node packages/specs/scripts/build-icon-css.js
   node packages/specs/scripts/build-icon-svg.js
   ```

4. **Rebuild the component spec** (so the new name works as a shorthand attribute):
   ```bash
   # The spec build reads ICON_NAMES from the specs package
   npm run build:specs
   ```

5. **Verify** — the new icon should work as `<ui-icon binoculars>` with any loaded icon set (that has a non-null mapping).

### Adding a new icon set

To add a seventh icon library:

1. Add a new field to every entry in `mappings.js` (e.g., `fontAwesome: 'house'`)
2. Add the library config to `build-icon-css.js` and `build-icon-svg.js`
3. Install the npm package that ships the SVGs
4. Run the full build pipeline
5. Create the set directory under `src/primitives/icon/sets/`

---

## The `dev` Set (Special Case)

The `dev` set is hand-maintained, not generated. It contains ~13 framework logos (React, Vue, Svelte, Angular, Astro, Next.js) in both full and mark variants.

**Location:** `src/primitives/icon/sets/dev/`

Unlike the five monochrome sets:
- Icons are full-color SVGs, not monochrome outlines
- Uses `background-image` instead of `mask-image`
- Doesn't define canonical names — icons are accessed via `icon` attribute + `set="dev"`
- Not affected by color variations

```html
<ui-icon icon="react-mark" set="dev"></ui-icon>
<ui-icon icon="vue" set="dev"></ui-icon>
```

---

## Icon Selection Methodology

The 481 canonical names were chosen through a multi-pass AI-assisted process documented in `ai/research/icons/`. The selection applied a "semantic name test": would an agent or developer reach for this name when building a UI? Icons that passed express a clear UI concept (`notifications`, `dashboard`, `upload`) rather than a visual description (`bell-outline-24px`).

Key principles:
- **Intent over shape** — canonical names describe what the icon communicates, not what it looks like
- **One concept, one name** — the mapping layer resolves library synonyms, so `trash` maps to whichever glyph each library prefers (`trash-2` in Lucide, `trash` in Phosphor)
- **Aliases are generous** — common variations (`edit`/`modify`/`write`, `close`/`cancel`/`dismiss`) all resolve correctly, reducing the need to memorize exact names
- **Coverage follows usage** — the distribution across categories reflects typical web application needs, not the source library's full catalog
