---
title: Make Components Theme-Aware
description: Using design tokens inside shadow DOM CSS, responding to theme changes with onThemeChanged, writing CSS that adapts to light/dark mode, and understanding how the token cascade works inside a component.
keywords: [shadow DOM theming, design tokens, onThemeChanged, theme-aware CSS, dark mode components, container style queries, standard tokens, inverted tokens]
audience: authoring
skill: component-theming
type: skill
---

# Make Components Theme-Aware

> **Skill:** `sui:component-theming`
> **Purpose:** Build custom components whose styles automatically adapt to light/dark mode and respond to runtime theme changes
> **Last Updated:** 2026-03-04

---

**Golden rule: Use `--standard-*` and `--{color}-N` tokens. Never write separate light/dark CSS blocks.** The token system does the work. Your component should have one set of styles that works in both themes.

## Why Tokens Work Inside Shadow DOM

CSS custom properties (variables) pierce shadow DOM boundaries. When the page sets `[dark]` on `<html>`, the theme layer redefines `--standard-color`, `--lightness-*`, and all computed tokens. These new values cascade into every shadow root automatically.

This means a component using `var(--standard-5)` for its background gets a light gray in light mode and a dark gray in dark mode without any theme-specific CSS.

---

## Writing Theme-Adaptive CSS

### Standard and Inverted Tokens

The two fundamental token families for neutral colors:

| Token | Light Mode | Dark Mode | Use for |
|-------|-----------|-----------|---------|
| `--standard-5` | 5% black (near white) | 5% white (near black) | Subtle backgrounds |
| `--standard-15` | 15% black | 15% white | Borders |
| `--standard-30` | 30% black | 30% white | Muted elements |
| `--standard-60` | 60% black | 60% white | Secondary text |
| `--standard-90` | 90% black (near black) | 90% white (near white) | Primary text |
| `--inverted-*` | White-based | Black-based | Opposite of standard |

The number is an opacity percentage. Low numbers are always subtle, high numbers are always strong, regardless of theme.

```css
/* ✅ One set of styles, both themes */
.card {
  background: var(--standard-5);
  color: var(--standard-90);
  border: 1px solid var(--standard-15);

  .header {
    border-bottom: 1px solid var(--standard-10);
  }

  .muted {
    color: var(--standard-60);
  }
}
```

### Color Scale Tokens

Named colors (`--red-5` through `--red-100`, `--blue-5` through `--blue-100`, etc.) also invert automatically. The lightness and chroma multipliers flip in dark mode:

```css
.alert {
  &.error {
    background: var(--red-5);       /* Light: pale red, Dark: deep red */
    color: var(--red-90);            /* Light: dark red, Dark: bright red */
    border: 1px solid var(--red-15);
  }

  &.success {
    background: var(--green-5);
    color: var(--green-90);
    border: 1px solid var(--green-15);
  }
}
```

### Semantic Tokens Over Raw Scale

When a semantic token exists, prefer it. It communicates intent and is easier to override:

```css
/* ✅ Semantic token — intent is clear */
color: var(--text-color);
border-color: var(--border-color);
background: var(--red-background-color);

/* ❌ Raw scale — what is this for? */
color: var(--standard-80);
border-color: var(--standard-15);
background: var(--red-0);
```

Use raw scale tokens when no semantic token matches your need.

---

## Container Style Queries for Theme-Specific Effects

Some visual effects genuinely need different parameters per theme (e.g., shadows, blur, glow). Use container style queries for these cases only:

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

The `--dark-mode` and `--light-mode` variables are booleans (`true`/`false`) set by the theme layer. They're available as container style query targets because they're defined on theme context selectors (`:root`, `[dark]`, `[light]`).

**Use sparingly.** If you find yourself writing many `@container style(--dark-mode: true)` blocks, you're probably not using the right tokens.

---

## Theme-Aware Shadows

Shadows are a common case where tokens alone handle most needs:

```css
.elevated {
  box-shadow:
    0 2px 4px oklch(var(--standard-color) / 10%),
    0 4px 8px oklch(var(--standard-color) / 5%);
}
```

This produces dark shadows in light mode and subtle light shadows in dark mode. The `var(--standard-color)` resolves to the LCH components of black or white depending on theme.

---

## Invariant Colors

When a color must not change between themes (logos, brand marks, status indicators):

```css
/* -invariant tokens always use the light-mode lightness scale */
.status-dot {
  background: var(--green-50-invariant);
}

/* Or use the raw base color */
.brand-logo {
  color: var(--blue);  /* Base blue — not theme-scaled */
}
```

---

## The `onThemeChanged` Lifecycle Hook

When the page theme changes at runtime (e.g., user toggles dark mode), components may need to run JavaScript logic beyond CSS adaptation. The `onThemeChanged` callback handles this.

### How It Works

Define `onThemeChanged` in your component definition:

```js
defineComponent({
  tagName: 'my-chart',
  template: '<canvas></canvas>',
  onCreated({ self }) {
    self.renderChart();
  },
  onThemeChanged({ darkMode, self }) {
    // Re-render chart with colors appropriate to new theme
    self.updateChartColors(darkMode);
  },
  createComponent({ el }) {
    return {
      renderChart() { /* ... */ },
      updateChartColors(isDark) {
        // Update canvas-drawn elements that can't use CSS tokens
        const textColor = isDark ? '#ffffff' : '#000000';
        // ...
      },
    };
  },
});
```

### Trigger Mechanisms

The callback fires in two situations:

1. **MutationObserver** — watches `<html>` for `class` attribute changes (adding/removing `dark`)
2. **`themechange` event** — listens for a custom `themechange` event dispatched on `<html>`

The callback is debounced (10ms) so that simultaneous triggers from both mechanisms collapse into a single invocation.

### Callback Parameters

`onThemeChanged` receives the standard callback params object. The key property:

| Param | Type | Description |
|-------|------|-------------|
| `darkMode` | `boolean` | `true` if the current theme is dark |

The `darkMode` value is computed via `isDarkMode()`, which checks both `<html class="dark">` and the CSS variable `--dark-mode` on the element itself.

### When You Need It

Most components don't need `onThemeChanged`. The CSS token system handles the vast majority of theme adaptation automatically. Use it when:

- **Canvas or WebGL rendering** — drawn elements can't use CSS variables
- **Third-party library integration** — chart libraries, map widgets, etc. that need explicit color values
- **Computed values** — JavaScript logic that derives from the current theme

Do **not** use it to toggle CSS classes or update styles that tokens already handle.

---

## The Token Cascade Inside a Component

Understanding the four layers helps when debugging unexpected appearance:

```
Layer 1: Base colors (defined once in :root)
  --blue: oklch(0.62 0.17 238)
  --black-lch: 0 0 0
  --white-lch: 1 0 0

Layer 2: Theme context (set by [dark] or [light] on any ancestor)
  --standard-color: var(--black-lch)  →  var(--white-lch) in dark
  --lightness-5: var(--base-lightness-5)  →  var(--base-lightness-95) in dark

Layer 3: Computed tokens (auto-calculated)
  --standard-5: oklch(var(--standard-color) / 5%)
  --blue-5: oklch(from var(--blue) calc(l * var(--lightness-5)) calc(c * var(--chroma-5)) h)

Layer 4: Semantic tokens
  --text-color: var(--standard-80)
  --border-color: var(--standard-15)
```

**All four layers cascade through shadow DOM.** A component at any depth in the DOM tree receives the correct computed values for its theme context. If a `<div dark>` wraps your component, it sees dark-mode token values even if the page is light.

### Why Color Scales Invert

In light mode, `--lightness-5` is a high multiplier (makes colors lighter). In dark mode, it maps to `--base-lightness-95` (a low multiplier, makes colors darker). The result: `--red-5` is always "subtle red" and `--red-90` is always "strong red", regardless of theme.

---

## Patterns and Anti-Patterns

### ✅ DO: Write Once with Tokens

```css
.component {
  background: var(--standard-5);
  color: var(--text-color);
  border: 1px solid var(--border-color);

  &.highlighted {
    background: var(--blue-5);
    border-color: var(--blue-30);
  }
}
```

### ❌ DON'T: Duplicate Styles per Theme

```css
/* WRONG — defeats the token system */
.component {
  background: #f5f5f5;
  color: #333;
}
[dark] .component {
  background: #1a1a1a;
  color: #eee;
}
```

### ❌ DON'T: Wrap Tokens in Component Variables

```css
/* UNNECESSARY — adds indirection without value */
:host {
  --my-bg: var(--standard-5);
  --my-text: var(--standard-90);
}
.wrapper {
  background: var(--my-bg);
  color: var(--my-text);
}
```

Use the tokens directly unless you're creating a genuinely new abstraction (e.g., `--track-color` on a slider component).

### ✅ DO: Use Container Queries Only for Effects

```css
/* Only when tokens can't express the difference */
.frosted {
  @container style(--dark-mode: true) {
    backdrop-filter: blur(12px) saturate(1.2);
  }
  @container style(--light-mode: true) {
    backdrop-filter: blur(6px) saturate(1.0);
  }
}
```

---

## Checklist for Theme-Aware Components

1. Use `--standard-*` and `--inverted-*` for neutral colors
2. Use `--{color}-N` for semantic color scales
3. Prefer semantic tokens (`--text-color`) over raw scales (`--standard-80`)
4. Use container style queries only for visual effects that tokens can't express
5. Add `onThemeChanged` only for non-CSS rendering (canvas, third-party libs)
6. Test in both light and dark mode — verify contrast and readability
7. Never hardcode hex/rgb values for theme-dependent colors

---

## Quick Reference

```css
/* Neutral adaptive colors */
background: var(--standard-5);
color: var(--standard-90);
border: 1px solid var(--standard-15);

/* Color scale (auto-inverts) */
background: var(--red-5);
color: var(--red-90);

/* Theme-invariant */
background: var(--blue-50-invariant);

/* Adaptive shadows */
box-shadow: 0 2px 4px oklch(var(--standard-color) / 10%);

/* Theme-conditional (use sparingly) */
@container style(--dark-mode: true) { ... }
```

```js
// Lifecycle hook (only for non-CSS concerns)
defineComponent({
  onThemeChanged({ darkMode, self }) {
    self.updateCanvas(darkMode);
  },
});
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component CSS** | `sui:component-css` | General CSS patterns inside shadow DOM |
| **Design Tokens** | `sui:design-tokens` | Full token reference (all families, all values) |
| **Adjust Theme** | `sui:adjust-theme` | Consumer-side theming (setting light/dark, nested contexts) |
