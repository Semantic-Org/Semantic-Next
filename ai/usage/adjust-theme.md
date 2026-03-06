---
title: Theme Semantic UI
description: Runtime theming for SUI pages and layouts — switching light/dark mode, nested theme contexts, theme-invariant sections, color overrides, and writing custom CSS that responds to the current theme.
keywords: [dark mode, light mode, theme switching, nested themes, color overrides, container style queries, theme-invariant]
audience: usage
skill: adjust-theme
type: skill
---

# Adjust Theme in Semantic UI

> **Skill:** `sui:adjust-theme`
> **Purpose:** Control light/dark mode across pages, sections, and individual components
> **Last Updated:** 2026-03-04

---

**Golden rule: Set the theme on a container, not on individual properties.** The token system handles the rest. You should rarely write theme-specific CSS.

## How Theme Switching Works

SUI's token system uses CSS variable remapping. When you set a theme on an element, two things happen:

1. `--standard-color` swaps between black and white
2. All `--standard-*` and color scale tokens (`--red-5`, `--blue-90`, etc.) automatically recalculate

Components and layouts built with these tokens adapt with zero extra CSS.

---

## Setting the Theme

### Page-Wide

Set on `<html>` for the entire page. Light mode is the default.

```html
<html dark>           <!-- dark mode -->
<html light>          <!-- explicit light mode -->
<html theme="dark">   <!-- attribute syntax -->
```

All three attribute syntaxes are equivalent: `dark`, `class="dark"`, `theme="dark"`. Use whichever fits your codebase.

### Toggling at Runtime

Add or remove the attribute on `<html>`:

```js
// Toggle dark mode
document.documentElement.toggleAttribute('dark');

// Or set explicitly
document.documentElement.setAttribute('dark', '');

// Or remove it
document.documentElement.removeAttribute('dark');
```

SUI components observe this change automatically and re-render in the new theme. The system also fires a `themechange` event on `<html>` that components can listen for.

### Section-Level

Any container element can override the theme for its subtree:

```html
<html light>
  <body>
    <aside dark>
      <!-- Everything inside uses dark theme tokens -->
      <ui-menu vertical>...</ui-menu>
      <ui-button>Dark button</ui-button>
    </aside>
    <main>
      <!-- Follows page theme (light) -->
      <ui-card>Light card</ui-card>
    </main>
  </body>
</html>
```

The selectors that activate theme tokens use doubled specificity (`[dark][dark]`, `[light][light]`) so that nested overrides always win over the page-level default.

### Component-Level

Force a specific theme on a single component:

```html
<ui-card dark>Always dark, regardless of page theme</ui-card>
<ui-button light>Always light, regardless of page theme</ui-button>
```

---

## Nested Theme Contexts

Themes nest naturally. Each container creates a new theme context that its children inherit:

```html
<html dark>
  <div light>
    <p>Light text here</p>
    <div dark>
      <p>Back to dark</p>
      <ui-button>Dark button</ui-button>
    </div>
  </div>
</html>
```

This works because the token remapping happens at the CSS variable level. Each `[dark]` or `[light]` selector redefines `--standard-color`, `--lightness-*`, and other computed tokens for its subtree.

---

## Theme-Invariant Sections

To keep a section in a fixed theme regardless of the page setting, set the theme attribute explicitly on that container:

```html
<html>
  <!-- This sidebar stays dark even if page switches to light -->
  <aside dark>
    <ui-menu vertical>...</ui-menu>
  </aside>
  <main>
    <!-- Main content follows whatever <html> says -->
  </main>
</html>
```

A common pattern: dark sidebars and headers that remain dark regardless of the page theme.

---

## Overriding What Colors Mean

### Redefining a Named Color

Override a base color and all its scale tokens recalculate:

```css
/* Make "blue" actually teal across the whole page */
:root {
  --blue: oklch(0.62 0.17 195);
}

/* Or scoped to a section */
.brand-section {
  --blue: oklch(0.55 0.20 260);
}
```

Every token that depends on `--blue` (`--blue-5`, `--blue-90`, `--primary-color` if mapped to blue, etc.) updates automatically.

### Overriding Semantic Tokens

For more targeted changes, override the semantic tokens directly:

```css
/* Change what "primary" means for a section */
.checkout {
  --primary-color: var(--green);
}

/* Override text color for a specific container */
.muted-section {
  --text-color: var(--standard-60);
}
```

### Scope Hierarchy

Overrides cascade by CSS specificity, from broadest to narrowest:

```css
:root { --primary-color: var(--blue); }           /* Page default */
.sidebar { --primary-color: var(--grey); }         /* Section */
ui-button.cta { --primary-color: var(--green); }   /* Instance */
```

---

## Writing Theme-Aware Custom CSS

When writing your own CSS alongside SUI components, use the same token system so your styles adapt automatically.

### Use Standard Tokens

```css
/* ✅ Your custom styles adapt to theme automatically */
.my-card {
  background: var(--standard-5);
  color: var(--standard-90);
  border: 1px solid var(--standard-15);
}

/* ❌ Hardcoded values require manual theme handling */
.my-card {
  background: #f5f5f5;
  color: #333;
}
```

### Inverted Tokens for Backgrounds and Surfaces

The `--inverted-*` tokens use the opposite of `--standard-color` — white in light mode, black in dark mode. They're the primary tokens for backgrounds and surfaces:

```css
/* --standard-* = foreground (text, icons, borders) */
/* --inverted-* = background (surfaces, panels, overlays) */

.panel {
  background: var(--inverted-100);   /* Solid background: white in light, black in dark */
  color: var(--standard-90);         /* Text: near-black in light, near-white in dark */
}

.subtle-surface {
  background: var(--inverted-5);     /* Very subtle background tint */
}

.overlay {
  background: var(--inverted-80);    /* Semi-transparent overlay */
}
```

**Scale:** `--inverted-{n}` where n = 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100

Inverted text tokens also exist for text on colored or dark backgrounds:

```css
--inverted-text-color              /* Text on inverted backgrounds */
--inverted-muted-text-color        /* Muted text on inverted backgrounds */
--inverted-light-text-color        /* Light/tertiary text on inverted backgrounds */
--inverted-disabled-text-color     /* Disabled text on inverted backgrounds */
```

For the complete token reference, see `sui:design-tokens`.

### Container Style Queries

When token-based styling isn't enough (e.g., different visual effects per theme), use container style queries:

```css
.glass-panel {
  background: var(--standard-5);

  @container style(--dark-mode: true) {
    backdrop-filter: blur(8px) brightness(1.1);
    box-shadow: 0 0 20px var(--primary-color-20);
  }

  @container style(--light-mode: true) {
    box-shadow: inset 0 1px 3px var(--standard-10);
    backdrop-filter: blur(4px);
  }
}
```

The `--dark-mode` and `--light-mode` variables are set to `true`/`false` by the theme layer and are available as container style query targets.

### Invariant Colors

When a color must not change between themes:

```css
/* -invariant tokens use the light-mode scale regardless of theme */
.brand-badge {
  background: var(--blue-50-invariant);  /* Same blue in both themes */
}

/* Or use the raw base color (not scaled) */
.logo {
  color: var(--blue);  /* The base blue, unscaled */
}
```

---

## The Token Cascade (How It Works)

You don't need to understand this to use theming, but it helps when debugging.

```
1. Base colors         --blue: oklch(0.62 0.17 238)
   ↓
2. Theme context       [dark] swaps --standard-color from black to white
                       [dark] inverts --lightness-* scale
   ↓
3. Computed tokens     --standard-5: oklch(var(--standard-color) / 5%)
                       --blue-5: oklch(from var(--blue) calc(l * var(--lightness-5)) ...)
   ↓
4. Semantic tokens     --text-color: var(--standard-80)
                       --border-color: var(--standard-15)
   ↓
5. Component styles    color: var(--text-color)
```

In light mode, `--standard-color` resolves to black, so `--standard-5` is 5% black (very light gray). In dark mode, it resolves to white, so `--standard-5` is 5% white (very dark gray). Same token name, correct result in both themes.

Color scales (e.g., `--red-5` through `--red-100`) work similarly: the lightness multipliers invert in dark mode so that low numbers are always subtle and high numbers are always strong, regardless of theme.

---

## Quick Reference

```html
<!-- Page theme -->
<html dark>
<html light>

<!-- Section override -->
<div dark> ... </div>
<aside light> ... </aside>

<!-- Component override -->
<ui-card dark>
<ui-button light>

<!-- Runtime toggle -->
<script>
  document.documentElement.toggleAttribute('dark');
</script>
```

```css
/* Override base color */
:root { --blue: oklch(0.55 0.20 260); }

/* Override semantic token */
.section { --primary-color: var(--green); }

/* Theme-conditional effects */
@container style(--dark-mode: true) { ... }
@container style(--light-mode: true) { ... }

/* Theme-invariant color */
background: var(--blue-50-invariant);
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Style Components** | `sui:style-components` | Customizing component appearance from outside |
| **Design Tokens** | `sui:design-tokens` | Looking up available design tokens |
| **Use Components** | `sui:use-components` | Component usage, attributes, events |
| **Component Theming** | `sui:component-theming` | Building custom components that respond to themes |
