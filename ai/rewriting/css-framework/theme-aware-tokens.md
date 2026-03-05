---
title: Theme-Aware Token Architecture
description: How CSS tokens flow through global, computed, and theme layers, with emphasis on understanding the two computation contexts and cascade order.
keywords: [theme tokens, computed tokens, cascade order, light mode, dark mode, CSS variables]
audience: contributing
skill: theme-aware-tokens
type: doc
---

# Theme-Aware Token Architecture

## The Two Computation Contexts

CSS tokens exist in two computation contexts:

**Theme-Agnostic** (root `tokens/` files)
- Pure math on primitives
- Same result regardless of theme
- Example: `--14px: calc((14 / var(--base-size)) * 1rem)`

**Theme-Aware Computed** (`tokens/themes/computed/`)
- Derived from values that differ per theme
- Must cascade AFTER theme definitions
- Example: `--shadow: 0px 1px 2px 0 var(--very-strong-transparent-black)`

The distinction exists because CSS variables resolve lazily at render time. A theme-aware computed token references variables that have different values in light vs dark mode—it must be defined after those values are set.

## Tracing a Shadow Through the System

Consider `--subtle-shadow`. Here's how it resolves:

```
Component uses:
  box-shadow: var(--subtle-shadow);
                    │
                    ▼
themes/computed/effects.css defines:
  --subtle-shadow: 0px 1px 2px 0 var(--strong-transparent-black);
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
          Light theme resolves:                      Dark theme resolves:
  --strong-transparent-black:                --strong-transparent-black:
    oklch(var(--black-lch) / 8%)               oklch(var(--black-lch) / 20%)
```

Same token name, different visual result. Dark mode uses 20% opacity (shadows need more contrast against dark backgrounds); light mode uses 8%.

## The Dual Purpose of Theme Folders

Theme folders (`themes/light/`, `themes/dark/`) serve two purposes:

### 1. Providing Inputs
Raw values that differ between themes:
```css
/* themes/light/... */
--strong-transparent-black: oklch(var(--black-lch) / 8%);

/* themes/dark/... */
--strong-transparent-black: oklch(var(--black-lch) / 20%);
```

### 2. Overriding Computed Outputs
When the formula itself must differ per theme, not just the inputs:
```css
/* themes/computed/effects.css - default formula */
--subtle-shadow: 0px 1px 2px 0 var(--strong-transparent-black);

/* themes/dark/effects.css - override with different formula */
--subtle-shadow: 0px 1px 2px 0 var(--transparent-black);
```

The dark override uses `--transparent-black` instead of `--strong-transparent-black`—a different variable entirely, not just a different value for the same variable.

## Cascade Order Matters

The import order in `tokens.css` is architecturally significant:

1. **Root tokens** - Primitives and theme-agnostic computed (colors, sizing, spacing, etc.)
2. **Light theme** - Base values applied by default
3. **Dark theme** - Overrides applied when dark mode is active
4. **Theme-aware computed** - MUST come after theme definitions

If theme-aware computed tokens imported before theme values, they'd reference undefined or default values instead of the theme-specific ones.

## The Standard/Inverted Pattern

The most pervasive theme-aware pattern is `--standard` and `--inverted`:

```css
/* Light mode */
--standard-color: var(--black-lch);   /* foreground = black */
--inverted-color: var(--white-lch);   /* background = white */

/* Dark mode */
--standard-color: var(--white-lch);   /* foreground = white */
--inverted-color: var(--black-lch);   /* background = black */
```

Then computed tokens use these:
```css
--text-color: var(--standard-80);           /* 80% foreground */
--page-background: var(--inverted-100);     /* 100% background */
```

The same semantic token (`--text-color`) resolves to near-black in light mode and near-white in dark mode without any conditional logic—just CSS variable resolution.

## Identifying Which Context a Token Belongs In

**Theme-agnostic** if:
- Pure mathematical relationship to global primitives
- No color values that should invert
- No opacity/contrast adjustments per theme

**Theme-aware** if:
- References `--standard`, `--inverted`, or theme-defined colors
- Needs different values for visibility/contrast per theme
- Semantic meaning ("text color", "border color") rather than raw value

## Common Patterns

### Color Scales
```css
/* Theme-aware: these invert */
--red-5: oklch(from var(--red) calc(l * var(--bg-lightness-5)) c h);
```

### Semantic Colors
```css
/* Theme-aware: references standard */
--text-color: var(--standard-80);
--muted-text-color: var(--standard-60);
```

### Effects
```css
/* Theme-aware: opacity differs for visibility */
--shadow: 0px 1px 2px 0 var(--very-strong-transparent-black);
```

### Spacing and Sizing
```css
/* Theme-agnostic: pure math */
--spacing-m: 1rem;
--14px: calc((14 / var(--base-size)) * 1rem);
```
