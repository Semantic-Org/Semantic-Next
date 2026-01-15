---
title: CSS Token Architecture Guide
description: Technical architecture of the CSS token system, covering the two-context computation model, cascade ordering rules, and variable resolution patterns.
keywords: [token architecture, CSS layers, variable resolution, theme-agnostic, theme-aware, cascade order]
audience: contributing
type: doc
---

# CSS Token Architecture Guide

## Token File Organization

Tokens live in `src/css/tokens/` with this structure:

- **Root files** (`tokens/*.css`) - Primitives and theme-agnostic computed values
- **Theme files** (`tokens/themes/light/`, `tokens/themes/dark/`) - Theme-specific base values and overrides
- **Computed files** (`tokens/themes/computed/`) - Theme-aware computed values

The orchestrator `tokens.css` imports everything in the correct cascade order.

## Two Computation Contexts

### 1. Theme-Agnostic (root files)

Values computed from base tokens that stay constant across themes.

**Characteristics:**
- Pure math on primitives
- No references to theme-aware variables
- Computed once at page load

**Examples:**
```css
/* Pixel tokens from base-size */
--14px: calc((14 / var(--base-size)) * 1rem);

/* Spacing scale from space-unit */
--space-2: calc(var(--space-unit) * 2);
```

### 2. Theme-Aware (`themes/computed/`)

Values that depend on theme-specific inputs like lightness scales or standard/inverted colors.

**Characteristics:**
- References variables that differ per theme
- Must import AFTER theme definitions
- Provides the final consumer API

**Examples:**
```css
/* Color scale using theme-aware lightness */
--red-70: oklch(from var(--red) calc(l * var(--red-lightness-70)) ...);

/* Semantic color using standard/inverted */
--text-color: var(--standard-80);
```

### Lazy Resolution

CSS variables resolve at use-time, not definition-time. This means alias tokens like `--red-text-color: var(--red-70)` can live in root files - the underlying `--red-70` in `themes/computed/` provides theme awareness when the alias is actually used.

## Cascade Order Rules

The import order in `tokens.css` is critical:

1. **Root tokens** - Primitives and theme-agnostic computed
2. **Light theme** - Base values (applied by default)
3. **Dark theme** - Overrides (applied when dark mode active)
4. **Theme-aware computed** - MUST be last

**The rule:** Theme-aware computed must import after all theme definitions, or it won't see the overridden values.

## Variable Resolution Patterns

### Pattern 1: Direct Theme Override

```css
/* Light */ --opacity-hover: 0.1;
/* Dark */  --opacity-hover: 0.15;  /* Override */
```

### Pattern 2: Computed from Theme Variables

```css
/* Theme sets multiplier */
--lightness-70: 1.4;      /* Light */
--lightness-70: 0.6;      /* Dark - inverted */

/* Computed uses it */
--red-70: oklch(from var(--red) calc(l * var(--lightness-70)) c h);
```

### Pattern 3: Invariant (Theme-Immune)

```css
--red-50-invariant: var(--red);  /* Never changes */
```

## Placement Rules

**Put in root files when:**
- Pure mathematical relationship to primitives
- No color values that should invert
- No contrast/visibility adjustments per theme

**Put in `themes/computed/` when:**
- References `--standard`, `--inverted`, or lightness scales
- Needs different values for dark mode visibility
- Semantic meaning (text color, border color) vs raw value

**Put in `themes/light/` or `themes/dark/` when:**
- Setting theme flags or base inputs
- Overriding a computed default for one theme only

## Anti-Patterns

```css
/* WRONG: Theme-aware calc in root file */
--emphasis: calc(var(--base) * var(--theme-multiplier));

/* WRONG: Consumer uses base value */
padding: calc(var(--base-unit) * 4);  /* Use --space-4 instead */

/* WRONG: Circular dependency */
--a: calc(var(--b) * 2);
--b: calc(var(--a) / 2);
```

## Adding New Tokens

1. Determine computation type (theme-agnostic vs theme-aware)
2. Create in appropriate file/directory
3. Add import in correct position in `tokens.css`
4. Consumers use the computed token, not base values
