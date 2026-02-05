---
title: Semantic UI Icon System Guide
description: Canonical reference for the icon system architecture — CSS custom property cascade, canonical naming, rendering techniques, icon sets, and cross-library mapping.
keywords: [icons, icon sets, CSS custom properties, shadow DOM, canonical names, svg, mask, font icons]
audience: framework
skill: icons
type: doc
---

# Semantic UI Icon System Guide

**Purpose**: Canonical reference for understanding how the icon system works
**Audience**: AI agents and developers using, extending, or debugging the icon system

---

## Core Architecture

The icon system is built on a single architectural insight: **CSS custom properties are the only styling mechanism that cascades through shadow DOM boundaries**.

Icons in a web component framework appear deeply nested — a `<ui-icon>` inside a `<ui-button>` inside a `<ui-card>` inside a `<ui-modal>` is 4+ shadow roots deep. None of the standard styling escape hatches work here:

- `::part()` only pierces one shadow root
- `::slotted()` only styles slotted content
- Putting icon definitions inside each component's shadow DOM stylesheet would both lock icons in place (no swapping) and massively bloat SSR output (Lit SSR duplicates stylesheets per instance)

**The solution**: Icon sets are pure CSS files that define `--icon-*` custom properties on `:root`. These cascade through unlimited shadow DOM depth for free. The `<ui-icon>` component's own CSS is tiny — it just reads the variables.

```
Icon Set CSS (on :root)        →  cascades through shadow DOM  →  ui-icon reads vars
--icon-home: url('./home.svg')    :root → ui-card → ui-button      mask-image: var(--icon-mask)
```

### Why Not Other Approaches?

| Approach | Problem |
|----------|---------|
| Inline SVG | Requires JS to inject, loses CSS color inheritance |
| `::part()` styling | Only pierces one shadow DOM level |
| Stylesheet in component | Locked in time; SSR duplicates per instance |
| External stylesheet import | Can't cross shadow DOM boundaries |
| **CSS custom properties** | **Cascades through all shadow roots** |

---

## Two-Tier Icon Usage

### Tier 1: Canonical Icons (Shorthand)

Semantic UI defines a curated set of ~320 **canonical icon names** — universal terms chosen for human and LLM readability. These are the "standard pack."

```html
<!-- Shorthand syntax — icon name as boolean attribute -->
<ui-icon close></ui-icon>
<ui-icon search></ui-icon>
<ui-icon sparkles></ui-icon>

<!-- Explicit syntax — equivalent -->
<ui-icon icon="close"></ui-icon>
```

Canonical names:
- Are exported as `ICON_NAMES` from `@semantic-ui/specs`
- Become part of the component spec's `optionAttributes`
- Enable shorthand: `<ui-icon close>` resolves to `icon="close"` via `adjustPropertyFromAttribute`
- Express **intent**, not visual shape: `close` not `x`, `notifications` not `bell`, `sparkles` not `auto-fix-high`
- Map across icon libraries — swapping the CSS import changes all icons without touching markup

### Tier 2: Raw Icons (Explicit Only)

Any icon defined in a loaded CSS file can be used with the `icon` attribute:

```html
<!-- Library-native name from feather -->
<ui-icon icon="airplay"></ui-icon>

<!-- Custom icon from a custom set -->
<ui-icon icon="my-custom-icon"></ui-icon>
```

These bypass the canonical naming layer — they resolve directly to `--icon-{name}` in CSS. No shorthand, no cross-library mapping.

### When to Use Each

| Scenario | Syntax | Why |
|----------|--------|-----|
| Standard UI icons (nav, actions, status) | `<ui-icon close>` | Portable, readable, intent-clear |
| Library-specific icons not in canonical set | `<ui-icon icon="airplay">` | Escape hatch for niche icons |
| Custom icon sets | `<ui-icon icon="my-logo" set="brand">` | Custom sets with `set` attribute |

---

## Canonical Name Design

The ~320 canonical names exported as `ICON_NAMES` from `@semantic-ui/specs` are organized into categories:

| Category | Examples |
|----------|----------|
| action | `add`, `check`, `copy`, `delete`, `download`, `edit`, `save`, `send`, `share`, `upload` |
| ai | `bot`, `sparkles`, `wand` |
| brand | `github`, `google`, `slack`, `twitter` |
| commerce | `cart`, `payment`, `shipping`, `store`, `wallet` |
| communication | `email`, `inbox`, `notifications`, `phone` |
| data | `chart-line`, `chart-bar`, `filter`, `search`, `sort` |
| navigation | `back`, `chevron-down`, `close`, `home`, `menu`, `next` |
| status | `error`, `help`, `info`, `loading`, `success`, `warning` |
| user | `avatar`, `login`, `logout`, `user`, `users` |

**Naming principles:**
- Use the most common/intuitive term a developer or LLM would reach for
- Express purpose, not visual shape (`close` not `x`, `notifications` not `bell`)
- Simple words preferred (`tree` over `hierarchy`, `fire` over `flame`)
- No duplicate top-level names — visually identical icons collapse into one with aliases
- Visual noun pattern for shapes: `filled-circle`, `empty-circle`

**Aliases** in the cross-library mappings handle alternative terms (e.g., `close` has aliases `cancel`, `dismiss`, `x`). In the icon set CSS, both canonical names and aliases resolve to the same underlying icon.

---

## How an Icon Renders

### The Resolution Chain

When `<ui-icon close>` appears in markup:

```
1. HTML attribute
   <ui-icon close>
       ↓ adjustPropertyFromAttribute (spec optionAttributes lookup)
2. Property assignment
   el.icon = "close"
       ↓ getIconStyle() in icon.js
3. CSS custom property wiring
   style="--icon-mask: var(--icon-close); --icon-image: var(--icon-close-image); ..."
       ↓ CSS cascade from :root through shadow DOM
4. Icon set CSS resolution
   --icon-close: var(--icon-x)           (canonical alias in feather set)
   --icon-x: url('./x.svg')             (native feather definition)
       ↓
5. Rendering
   mask-image: url('./x.svg')           (SVG mask with currentColor)
```

### The Component (`icon.js`)

The component has two key methods:

**`getIconParts()`** — Parses the icon name and optional set:
```js
// <ui-icon icon="react-mark" set="dev"> → { icon: 'react-mark', set: 'dev' }
// <ui-icon icon="react-mark:dev">       → { icon: 'react-mark', set: 'dev' }
// <ui-icon close>                       → { icon: 'close', set: undefined }
```

**`getIconStyle()`** — Generates inline CSS custom properties with a fallback chain:
```js
// With set:
--icon-mask: var(--icon-react-mark, var(--icon-dev));
--icon-image: var(--icon-react-mark-image, var(--icon-dev-image));
--icon-bg: var(--icon-react-mark-bg, var(--icon-dev-bg));
--icon-glyph: var(--icon-react-mark-glyph, var(--icon-dev-glyph));

// Without set:
--icon-mask: var(--icon-close);
--icon-image: var(--icon-close-image);
--icon-bg: var(--icon-close-bg);
--icon-glyph: var(--icon-close-glyph);
```

The set provides a fallback — if the specific icon isn't found, set-level defaults apply.

### The CSS (`icon.css`)

The icon element supports three rendering techniques simultaneously. Only one produces visible output, determined by which CSS custom properties the icon set defines:

```css
.icon {
  /* Mask technique (default for monochrome SVG) */
  background: var(--icon-bg, currentColor);
  mask-image: var(--icon-mask, none);

  /* Image technique (for multi-color icons) */
  background-image: var(--icon-image, none);

  /* Font technique (for icon fonts) */
  font-family: var(--icon-font, inherit);
}
.icon::before {
  content: var(--icon-glyph, '');
}
```

---

## Rendering Techniques

Icon sets choose their rendering technique by which CSS custom properties they populate. The technique is a **set-level concern** — the `<ui-icon>` component doesn't know or care which technique is active.

### Mask-Based (Monochrome SVG)

The default and most common technique. SVGs are used as CSS mask images, so the icon inherits `currentColor` and works naturally with text color, themes, and the `color` variation.

```css
:root {
  --icon-home: url('./home.svg');
  --icon-search: url('./search.svg');
}
```

**Used by**: Feather, Lucide, Heroicons, and most icon libraries
**Pros**: Inherits text color, works with SUI color variations, small CSS footprint
**Cons**: Monochrome only

### Image-Based (Multi-Color)

For icons with multiple colors (like brand logos). Uses `background-image` instead of mask, with `transparent` background to disable the mask layer.

```css
:root {
  /* Set-level defaults to switch technique */
  --icon-dev-bg: transparent;
  --icon-dev-image: none;

  /* Individual icon definitions */
  --icon-react-mark-image: url('./react-mark.svg');
  --icon-svelte-mark-image: url('./svelte-mark.svg');
}
```

**Used by**: The `dev` icon set (framework logos)
**Pros**: Full color SVGs, gradients, multi-tone
**Cons**: Can't inherit text color, doesn't respond to SUI color variations

### Font-Based (Icon Fonts)

For legacy icon fonts or specialized glyph sets. Uses `::before` pseudo-element with a font glyph.

```css
:root {
  --icon-home-font: 'MyIconFont';
  --icon-home-glyph: '\e900';
}
```

**Pros**: Familiar for projects migrating from font-based icon systems
**Cons**: Blurry at sub-pixel sizes, harder to maintain, no multi-color

### Mixed Techniques

A single icon set can mix techniques per-icon. The component CSS always has all three channels active — only the ones with defined values produce output. You could have a set where most icons use masks but a few special ones use images.

---

## Icon Sets

### Structure

An icon set is a CSS file that defines `--icon-*` custom properties on `:root`, plus the associated SVG/font assets. It's imported as a CSS module:

```js
// In your app entry point or layout
import '@semantic-ui/core/icon/sets/feather.css';
import '@semantic-ui/core/icon/sets/dev.css';
```

Registered as package exports in `package.json`:
```json
{
  "./icon/sets/feather.css": {
    "import": "./src/primitives/icon/sets/feather/index.css"
  },
  "./icon/sets/dev.css": {
    "import": "./src/primitives/icon/sets/dev/index.css"
  }
}
```

### Anatomy of an Icon Set CSS File

A complete icon set has three sections:

```css
/* 1. Native library definitions — raw SVGs with library-native names */
:root {
  --icon-x: url('./x.svg');
  --icon-bell: url('./bell.svg');
  --icon-home: url('./home.svg');
  /* ... all icons in the library ... */
}

/* 2. Canonical name mappings — bridges SUI names to native names */
:root {
  --icon-close: var(--icon-x);
  --icon-notifications: var(--icon-bell);
  /* --icon-home already matches, no mapping needed */
}

/* 3. Alias mappings — alternative names from mappings.json */
:root {
  --icon-cancel: var(--icon-x);
  --icon-dismiss: var(--icon-x);
}
```

Section 1 is the raw library. Sections 2 and 3 are the canonical bridge that enables:
- `<ui-icon close>` shorthand (via canonical names in the spec)
- Icon set swapping without markup changes (both feather and lucide define `--icon-close`)
- Alias support (`cancel`, `dismiss`, and `close` all resolve to the same icon)

### The `set` Attribute

The `set` attribute provides namespacing and technique-level defaults:

```html
<!-- Explicit set -->
<ui-icon icon="react-mark" set="dev"></ui-icon>

<!-- Colon syntax (equivalent) -->
<ui-icon icon="react-mark:dev"></ui-icon>
```

This makes `getIconStyle()` generate a fallback chain: `var(--icon-react-mark-image, var(--icon-dev-image))`. Set-level defaults (like `--icon-dev-bg: transparent`) configure the rendering technique for all icons in the set.

### Loading Multiple Sets

Multiple sets can be loaded simultaneously. They coexist because they all define properties on `:root`:

```js
import '@semantic-ui/core/icon/sets/feather.css';  // monochrome UI icons
import '@semantic-ui/core/icon/sets/dev.css';       // colored framework logos
```

### Swapping Icon Libraries

The canonical naming layer means you can swap icon libraries by changing one import:

```js
// Before
import '@semantic-ui/core/icon/sets/feather.css';

// After — all canonical icons resolve to lucide equivalents
import '@semantic-ui/core/icon/sets/lucide.css';
```

No markup changes needed. Both sets define the same canonical `--icon-*` variables, just pointing at different SVGs.

---

## Cross-Library Mapping

### Cross-Library Mappings

A central mapping file (currently `src/primitives/icon/sets/mappings.json`, location may change) defines how each canonical icon name maps to 8 supported icon libraries:

```json
{
  "close": {
    "category": "navigation",
    "aliases": ["cancel", "dismiss", "x"],
    "description": "Close modal/panel",
    "lucide": "x",
    "feather": "x",
    "heroicons": "x-mark",
    "tabler": "x",
    "phosphor": "x",
    "bootstrap": "x-lg",
    "material": "close",
    "ionicons": "close"
  }
}
```

When a mapping is `null`, the library doesn't have an equivalent icon — no alias line should be generated for it.

### Supported Libraries

| Library | Icons | Technique |
|---------|-------|-----------|
| Lucide | 1669+ | Mask (monochrome SVG) |
| Feather | 287 | Mask (monochrome SVG) |
| Heroicons | 316 | Mask (monochrome SVG) |
| Tabler | 5963 | Mask (monochrome SVG) |
| Phosphor | 9000+ | Mask (monochrome SVG) |
| Bootstrap Icons | 2000+ | Mask (monochrome SVG) |
| Material Icons | 2500+ | Mask (monochrome SVG) |
| Ionicons | 1300+ | Mask (monochrome SVG) |

---

## Spec Integration

The icon component is spec-driven. The spec file (`icon.spec.js`) imports `ICON_NAMES` and places them as content options:

```js
import { ICON_NAMES } from '@semantic-ui/specs';

export default {
  tagName: 'ui-icon',
  content: [{
    name: 'Icon',
    attribute: 'icon',
    options: ICON_NAMES,
  }],
  // ...
};
```

This means:
- All canonical icon names appear in `optionAttributes` → enabling shorthand `<ui-icon close>`
- The spec system handles attribute parsing, value fuzzing (`close`, `cancel`, reversed ordering)
- Documentation and TypeScript types are generated from the same source

### Value Fuzzing

The attribute system normalizes icon values:

```html
<!-- All equivalent -->
<ui-icon icon="chevron-down"></ui-icon>
<ui-icon icon="down-chevron"></ui-icon>
<ui-icon icon="chevron down"></ui-icon>
<ui-icon icon="down chevron"></ui-icon>
```

This is handled by `adjustPropertyFromAttribute` which tokenizes spaces to dashes and tries reversed orderings.

---

## Variations and States

From the icon spec:

### States
- **`disabled`** — Reduces opacity, disables interaction. Supports `clickable-disabled` for visually disabled but interactive.
- **`loading`** — Shows loading animation.

### Variations
- **`size`** — `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
- **`color`** — `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `slate`
- **`fitted`** — Removes spacing around the icon.
- **`link`** — Formats as a clickable link.
- **`spin`** — Continuous rotation animation.
- **`inverted`** — For use on dark backgrounds.

### Settings
- **`set`** — The icon set to use (e.g., `dev`, `feather`).
- **`href`** — Wraps the icon in an anchor link.
- **`target`** — Link target (used with `href`).

### Plural Container

`<ui-icons>` groups multiple icons, supporting shared `color` and `size` variations:

```html
<ui-icons size="large" color="blue">
  <ui-icon home></ui-icon>
  <ui-icon settings></ui-icon>
  <ui-icon user></ui-icon>
</ui-icons>
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/primitives/icon/icon.js` | Component definition (`getIconParts`, `getIconStyle`) |
| `src/primitives/icon/icon.html` | Template |
| `src/primitives/icon/css/definition/content/icon.css` | Core rendering CSS (mask, image, font techniques) |
| `src/primitives/icon/css/theme/content/icon-variables.css` | Design tokens (size, opacity, spacing) |
| `src/primitives/icon/specs/icon.spec.js` | Component specification |
| `src/primitives/icon/sets/feather/index.css` | Feather icon set CSS |
| `src/primitives/icon/sets/dev/index.css` | Dev icon set CSS (colored logos) |
| `packages/specs/src/icon.js` | `ICON_NAMES` — canonical icon name list (source of truth) |
| `src/primitives/icon/sets/mappings.json` | Cross-library canonical name mappings (location may change) |

---

## Current Status

The icon system architecture is complete but the canonical mapping layer is in progress:

- **Complete**: Component rendering, CSS technique system, spec integration, `dev` icon set, shorthand syntax
- **Complete (~98%)**: Canonical icon name selection (`ICON_NAMES` in `@semantic-ui/specs`)
- **In progress**: Cross-library mappings (nascent, sometimes incorrect)
- **Not started**: Canonical alias sections in icon set CSS files (feather currently only has native names)

For the canonical system to work end-to-end, each icon set CSS needs its alias section generated from the cross-library mappings. Without it, `<ui-icon close>` resolves to `--icon-close` in CSS, but no icon set currently defines that variable (feather defines `--icon-x` instead).

---

## Related Documentation

- [Specs Package Guide](./specs.md) — How component specs drive attribute parsing
- [Using Primitives](./using-primitives.md) — Composing components with icons
- [CSS Style Guide](./css-style-guide.md) — Design token usage
- [Theme Architecture](./theming.md) — How icons respond to light/dark mode via `currentColor`
