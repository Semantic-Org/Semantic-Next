# Semantic UI Theme Architecture Guide

**Purpose**: Canonical reference for understanding and implementing light/dark mode theming
**Audience**: AI agents and developers working with Semantic UI's theming system
**Prerequisites**: Basic understanding of CSS variables and color theory

> Last Updated: 2025-11-03

## Core Philosophy

Semantic UI's theming system is built on a fundamental principle: **write once, adapt everywhere**. Unlike traditional approaches that require duplicate CSS for each theme, Semantic UI uses a sophisticated variable remapping system that automatically adapts colors to the current theme context.

## How Theme Switching Works

### The Four-Layer Architecture

```
1. Base Colors (defined once)
   ↓
2. Theme Context (light/dark mode flags)
   ↓
3. Computed Tokens (automatic calculations)
   ↓
4. Component Styles (theme-agnostic)
```

### Layer 1: Base Color Definitions

Base colors are defined once in OKLCH color space for perceptually uniform adjustments:

```css
/* Light theme base colors (simplified) */
--red: oklch(0.59 0.27 28);
--blue: oklch(0.62 0.17 238);
--green: oklch(0.62 0.26 145.53);
```

### Layer 2: Theme Context Variables

The theme system sets context flags and swaps color references:

```css
/* Light Mode (from src/css/tokens/themes/light/base.css) */
[light], .light.theme {
  --dark-mode: false;
  --light-mode: true;

  /* Critical: standard = black-based, inverted = white-based */
  --standard-color: var(--black-lch);
  --inverted-color: var(--white-lch);
}

/* Dark Mode (from src/css/tokens/themes/dark/base.css) */
[dark], .dark.theme {
  --dark-mode: true;
  --light-mode: false;

  /* Critical: standard = white-based, inverted = black-based (SWAPPED!) */
  --standard-color: var(--white-lch);
  --inverted-color: var(--black-lch);
}
```

### Layer 3: Computed Tokens

Computed tokens automatically calculate values based on the current theme:

```css
/* From src/css/tokens/themes/computed/base.css */
/* These use whichever color --standard-color points to */
--standard-5: oklch(var(--standard-color) / 5%);
--standard-10: oklch(var(--standard-color) / 10%);
--standard-15: oklch(var(--standard-color) / 15%);
/* ... continues to --standard-100 */
```

### Layer 4: Component Implementation

Components use theme-agnostic tokens that automatically adapt:

```css
.component {
  /* Automatically adapts to theme */
  background: var(--standard-5);    /* Light: light gray, Dark: dark gray */
  color: var(--standard-90);         /* Light: near black, Dark: near white */
  border: 1px solid var(--standard-15);
}
```

## The Standard/Inverted Pattern

### Understanding the Naming

- **`--standard-*`**: The "normal" color for the current theme
  - Light mode: Black-based colors (dark text, light backgrounds)
  - Dark mode: White-based colors (light text, dark backgrounds)

- **`--inverted-*`**: The opposite of standard
  - Light mode: White-based colors
  - Dark mode: Black-based colors

### Opacity Scale Meanings

The number in `--standard-N` represents opacity percentage:

| Token | Light Mode Result | Dark Mode Result | Typical Use |
|-------|------------------|------------------|-------------|
| `--standard-5` | 5% black (very light gray) | 5% white (very dark gray) | Subtle backgrounds |
| `--standard-10` | 10% black (light gray) | 10% white (dark gray) | Secondary backgrounds |
| `--standard-15` | 15% black | 15% white | Borders |
| `--standard-30` | 30% black | 30% white | Muted elements |
| `--standard-60` | 60% black | 60% white | Secondary text |
| `--standard-90` | 90% black (near black) | 90% white (near white) | Primary text |

## Color Scale Inversion

### The Lightness/Chroma Remapping

For semantic color scales (red, blue, green, etc.), the system inverts lightness and chroma multipliers:

```css
/* Light Mode (from src/css/tokens/themes/light/colors.css) */
--lightness-5: 1.61;   /* Makes color lighter (161% of base) */
--lightness-95: 0.38;  /* Makes color darker (38% of base) */

/* Dark Mode (from src/css/tokens/themes/dark/colors.css) */
--lightness-5: var(--base-lightness-95);  /* Now 0.38 - darker! */
--lightness-95: var(--base-lightness-5);  /* Now 1.61 - lighter! */
```

### Color Scale Computation

Colors are computed using OKLCH relative color syntax:

```css
/* From src/css/tokens/themes/computed/colors.css */
--red-5: oklch(from var(--red)
  calc(l * var(--red-lightness-5))  /* Multiplies lightness */
  calc(c * var(--red-chroma-5))     /* Multiplies chroma */
  h                                  /* Preserves hue */
);
```

Result:
- **Light mode**: `--red-5` = very light red (high lightness multiplier)
- **Dark mode**: `--red-5` = very dark red (low lightness multiplier due to inversion)

## Practical Usage Patterns

### Basic Theme-Adaptive Styling

```css
/* ✅ CORRECT: Use standard tokens for automatic adaptation */
.card {
  background: var(--standard-5);
  color: var(--standard-90);
  border: 1px solid var(--standard-15);
}

.card:hover {
  background: var(--standard-10);
}

/* ❌ WRONG: Hardcoding colors requires manual theme handling */
.card {
  background: #f5f5f5;
}
[dark] .card {
  background: #1a1a1a;
}
```

### Using Semantic Color Scales

```css
/* ✅ CORRECT: Color scales automatically adapt */
.alert-error {
  background: var(--red-5);      /* Light red / Dark red */
  color: var(--red-90);           /* Dark red / Light red */
  border: 1px solid var(--red-15);
}

/* The same token provides proper contrast in both themes */
```

### Theme-Specific Overrides

Use container style queries only when automatic tokens can't express the difference:

```css
.glass-panel {
  /* Base styling uses adaptive tokens */
  background: var(--standard-5);

  /* Effects that need different treatment per theme */
  @container style(--dark-mode: true) {
    /* More blur in dark mode for visibility */
    backdrop-filter: blur(8px) brightness(1.1);
    /* Glow effect only in dark mode */
    box-shadow: 0 0 20px var(--primary-color-20);
  }

  @container style(--light-mode: true) {
    /* Subtle inset shadow in light mode */
    box-shadow: inset 0 1px 3px var(--standard-10);
    /* Less blur needed */
    backdrop-filter: blur(4px);
  }
}
```

### Invariant Colors

When you need colors that don't change between themes:

```css
/* Use -invariant tokens for consistent colors across themes */
.brand-element {
  background: var(--blue-50-invariant);  /* Same blue in both themes */
}

/* Or use specific theme-independent colors */
.always-red {
  background: var(--red);  /* Base red, unchanged */
}
```

## Theme Detection and Context

### Available Theme Variables

```css
/* Boolean flags for conditionals */
--dark-mode: true/false
--light-mode: true/false

/* Numeric factors for calculations */
--dark-mode-factor: 1 (in dark) or 0 (in light)
--light-mode-factor: 1 (in light) or 0 (in dark)
```

### Using Theme Factors in Calculations

```css
.adaptive-element {
  /* Increase opacity in dark mode */
  opacity: calc(0.8 + (0.2 * var(--dark-mode-factor)));

  /* Different blur amounts */
  backdrop-filter: blur(calc(4px + (4px * var(--dark-mode-factor))));

  /* Conditional padding */
  padding: calc(var(--spacing) * (1 + (0.5 * var(--dark-mode-factor))));
}
```

## Common Patterns and Anti-Patterns

### ✅ DO: Use Theme-Aware Tokens

```css
.component {
  /* Colors that adapt automatically */
  background: var(--standard-5);
  color: var(--text-color);
  border-color: var(--standard-15);

  /* Semantic colors that adapt */
  &.error {
    background: var(--red-5);
    color: var(--red-text-color);
  }
}
```

### ❌ DON'T: Create Theme-Specific Selectors

```css
/* AVOID: Duplicating styles for each theme */
.component {
  background: #f0f0f0;
}

[dark] .component {
  background: #1a1a1a;
}

/* This defeats the purpose of the token system */
```

### ✅ DO: Use Container Style Queries for Effects

```css
/* When visual effects need different parameters */
.frosted-glass {
  @container style(--dark-mode: true) {
    backdrop-filter: blur(12px) saturate(1.2);
  }

  @container style(--light-mode: true) {
    backdrop-filter: blur(6px) saturate(1.0);
  }
}
```

### ❌ DON'T: Wrap Existing Tokens

```css
/* UNNECESSARY: Don't create wrappers for existing tokens */
:host {
  --my-background: var(--standard-5);    /* Redundant */
  --my-text: var(--standard-90);         /* Redundant */
}
```

## Implementation Checklist

When implementing theme-aware components:

1. **Start with standard tokens**: Use `--standard-*` and `--inverted-*` for neutrals
2. **Use semantic color scales**: Use `--{color}-{scale}` for colored elements
3. **Leverage automatic adaptation**: Let the token system handle theme switching
4. **Add overrides sparingly**: Only use container style queries for effects that can't be tokenized
5. **Test in both themes**: Verify contrast and visibility in light and dark modes
6. **Avoid hardcoded colors**: Always use tokens instead of hex/rgb values

## Advanced Techniques

### Dynamic Theme-Aware Gradients

```css
.gradient-header {
  background: linear-gradient(
    135deg,
    var(--standard-5),
    var(--standard-10)
  );
}
```

### Calculating Custom Shades

```css
/* Create custom opacity using standard color */
.custom-shade {
  background: oklch(var(--standard-color) / 7.5%);

  /* Or mix colors */
  background: color-mix(
    in oklch,
    var(--primary-color) 20%,
    var(--standard-5)
  );
}
```

### Theme-Aware Shadows

```css
.elevated {
  /* Shadow automatically uses appropriate color */
  box-shadow:
    0 2px 4px oklch(var(--standard-color) / 10%),
    0 4px 8px oklch(var(--standard-color) / 5%);
}
```

## Token File Reference

Key files for understanding the implementation:

- **Theme detection**: `src/css/tokens/themes/light/base.css`, `src/css/tokens/themes/dark/base.css`
- **Computed tokens**: `src/css/tokens/themes/computed/base.css`
- **Color computations**: `src/css/tokens/themes/computed/colors.css`
- **Lightness/chroma scales**: `src/css/tokens/themes/light/colors.css`, `src/css/tokens/themes/dark/colors.css`

## Best Practices Summary

1. **Write once**: Use theme-aware tokens to write styles once
2. **Trust the system**: The automatic adaptations are carefully calibrated
3. **Think in contrasts**: Use the scale (5, 10, 15... 90, 95) to express contrast relationships
4. **Semantic over specific**: Prefer `--text-color` over `--standard-90` when available
5. **Effects need overrides**: Visual effects often need manual theme handling
6. **Test thoroughly**: Always verify appearance in both themes

## Cross-References

- **Token usage basics**: See `ai/guides/css/tokens/token-usage.md`
- **CSS architecture**: See `ai/guides/css/css-guide.md`
- **Component patterns**: See `ai/guides/components/creating-components.md`

---

This architecture enables truly theme-agnostic component development while maintaining precise control over visual appearance in each theme context. The sophistication lies not in complexity, but in the elegant remapping of a small set of variables that cascade through the entire system.