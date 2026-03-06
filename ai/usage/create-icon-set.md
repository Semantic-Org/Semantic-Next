---
title: Create Icon Sets for Semantic UI
description: Guide for creating custom icon sets for use with SUI's icon component. Covers mask, image, and font rendering techniques, canonical name mappings, and SVG guidelines.
keywords: [icons, icon set, SVG, ui-icon, CSS custom properties, mask, font icons, canonical names]
audience: usage
skill: create-icon-set
type: skill
---

# Create Icon Sets for Semantic UI

> **Skill:** `sui:create-icon-set`
> **Purpose:** Guide for creating custom icon sets for use with SUI's icon component
> **Last Updated:** 2026-03-04

---

## How It Works

The `<ui-icon>` component renders icons from **CSS custom properties**. You don't need to modify the framework — just write a CSS file that defines `--icon-*` variables on `:root` and include it on your page. CSS custom properties cascade through shadow DOM, so every `<ui-icon>` in your app can resolve your icons regardless of nesting depth.

```
Your CSS file (on :root)           ui-icon reads the vars
--icon-logo: url('./logo.svg')  →  mask-image: var(--icon-mask)
```

The component is imported from `@semantic-ui/core`. Your CSS provides the icon data.

---

## Quick Start

**1. Import the icon component:**

```js
import { UIIcon } from '@semantic-ui/core';
```

**2. Write a CSS file with your icons:**

```css
/* my-icons.css */
:root {
  --icon-logo: url('./logo.svg');
  --icon-dashboard: url('./dashboard.svg');
  --icon-profile: url('./profile.svg');
}
```

**3. Include the CSS on your page:**

```js
import './my-icons.css';
```

**4. Use your icons:**

```html
<ui-icon icon="logo"></ui-icon>
<ui-icon icon="dashboard"></ui-icon>
<ui-icon icon="profile"></ui-icon>
```

That's it. No build step, no registration, no framework modifications.

---

## Rendering Techniques

The component supports three rendering techniques. Your CSS chooses the technique by which properties it defines — only the ones with values produce visible output.

### Mask (Monochrome SVG) — Default

Icons inherit `currentColor`, so they match your text color and respond to SUI color variations and theming.

```css
:root {
  --icon-home: url('./home.svg');
  --icon-search: url('./search.svg');
}
```

**Property pattern:** `--icon-{name}`

**Best for:** Most icon sets — UI icons, navigation icons, action icons.

### Image (Multi-Color)

For icons with multiple colors like brand logos, colored illustrations, or emoji.

```css
:root {
  /* Set-level defaults to switch to image technique */
  --icon-brand-bg: transparent;

  /* Icon definitions */
  --icon-figma-image: url('./figma.svg');
  --icon-sketch-image: url('./sketch.svg');
}
```

**Property pattern:** `--icon-{name}-image`

Set `--icon-{setname}-bg: transparent` to prevent the mask technique's `currentColor` from overlaying the image.

**Best for:** Brand logos, multi-color illustrations, flags.

### Font (Icon Font Glyphs)

For existing icon fonts where each icon is a Unicode glyph.

```css
:root {
  --icon-home-font: 'MyIconFont';
  --icon-home-glyph: '\e900';
}
```

**Property pattern:** `--icon-{name}-font` + `--icon-{name}-glyph`

**Best for:** Migrating from a font-based icon system.

### Mixing Techniques

A single CSS file can mix techniques. Most icons can use masks while a few special ones use images:

```css
:root {
  /* Monochrome icons (mask) */
  --icon-settings: url('./settings.svg');
  --icon-search: url('./search.svg');

  /* Colored logo (image) */
  --icon-company-logo-image: url('./company-logo.svg');
  --icon-company-logo-bg: transparent;
}
```

---

## Using the `set` Attribute

For icon sets with a distinct identity (like brand logos), name your set and use the `set` attribute:

```css
:root {
  /* Set-level defaults */
  --icon-brands-bg: transparent;

  /* Icons in this set */
  --icon-figma-image: url('./figma.svg');
  --icon-sketch-image: url('./sketch.svg');
}
```

```html
<ui-icon icon="figma" set="brands"></ui-icon>

<!-- Colon shorthand (equivalent) -->
<ui-icon icon="figma:brands"></ui-icon>
```

The `set` attribute creates a CSS fallback chain — if the specific icon doesn't define a property, the set-level default applies. This is how `--icon-brands-bg: transparent` disables the mask background for all icons in the set.

---

## Shorthand Support & Canonical Icon Names

Semantic UI supports shorthand syntax like `<ui-icon close>` instead of `<ui-icon icon="close">`. Shorthand works for a curated set of ~320 **canonical icon names** — standardized names like `close`, `search`, `notifications` that express intent rather than visual shape.

To enable shorthand for your icon set, review the canonical names exported as `ICON_NAMES` from `@semantic-ui/specs`, then map your native icon names to the canonical names your set can support.

```js
// The canonical icon list is available as:
import { ICON_NAMES } from '@semantic-ui/specs';
// → ['add', 'check', 'close', 'search', 'notifications', ...]
```

Add an alias section in your CSS that maps canonical names to your native names:

```css
:root {
  /* Your native icon definitions */
  --icon-x: url('./x.svg');
  --icon-bell: url('./bell.svg');
  --icon-magnifying-glass: url('./magnifying-glass.svg');
  --icon-house: url('./house.svg');

  /* Canonical name mappings */
  --icon-close: var(--icon-x);
  --icon-notifications: var(--icon-bell);
  --icon-search: var(--icon-magnifying-glass);
  --icon-home: var(--icon-house);

  /* Aliases (alternative names for the same icon) */
  --icon-cancel: var(--icon-x);
  --icon-dismiss: var(--icon-x);
}
```

This enables:
- **Shorthand syntax** — `<ui-icon close>` works because `close` is a canonical name
- **Markup portability** — canonical markup works regardless of which icon set is loaded
- **Set swapping** — change one CSS import to switch all icons to a different library
- **LLM-friendly markup** — canonical names like `notifications` express intent better than library-specific names like `bell`

If a canonical name already matches your native name (e.g., both use `home`), no alias is needed. You only need aliases where the names differ.

---

## Loading Multiple Sets

Multiple icon sets coexist on the same page. They all define properties on `:root` so there's no conflict as long as names don't collide:

```js
import '@semantic-ui/core/icon/sets/feather.css';  // standard UI icons
import './my-brand-icons.css';                      // your custom brand icons
```

```html
<!-- From feather -->
<ui-icon close></ui-icon>

<!-- From your custom set -->
<ui-icon icon="company-logo" set="brand"></ui-icon>
```

---

## SVG Guidelines

**For mask-based icons** (the default):
- Monochrome — single fill color (use black or `currentColor`)
- Consistent viewBox across the set (e.g., `0 0 24 24`)
- Optimized — strip metadata, comments, empty groups
- Consistent use of `fill` or `stroke` (don't mix within a set)

**For image-based icons:**
- Multi-color is fine
- Transparent background (the component handles background)
- Consistent viewBox still important for sizing

---

## Complete Example: App Icon Set

A real-world example combining monochrome UI icons with a colored logo:

```css
/* app-icons.css */
:root {
  /* Monochrome app icons (mask technique) */
  --icon-dashboard: url('./icons/dashboard.svg');
  --icon-analytics: url('./icons/analytics.svg');
  --icon-customers: url('./icons/customers.svg');
  --icon-inventory: url('./icons/inventory.svg');
  --icon-reports: url('./icons/reports.svg');

  /* Colored app logo (image technique) */
  --icon-app-logo-image: url('./icons/app-logo.svg');
  --icon-app-logo-bg: transparent;
}
```

```js
import { UIIcon } from '@semantic-ui/core';
import '@semantic-ui/core/icon/sets/feather.css';  // standard icons
import './app-icons.css';                           // app-specific icons
```

```html
<!-- Standard icon from feather -->
<ui-icon settings></ui-icon>

<!-- Custom app icons -->
<ui-icon icon="dashboard"></ui-icon>
<ui-icon icon="app-logo"></ui-icon>
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Use Components** | `sui:use-components` | General component usage, specs, attributes, events |
| **Style Components** | `sui:style-components` | Customizing component appearance, CSS variables, `::part()` |
| **Design Tokens** | `sui:design-tokens` | Available design tokens for colors, spacing, effects |
