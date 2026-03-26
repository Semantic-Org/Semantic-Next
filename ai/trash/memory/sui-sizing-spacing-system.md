# Semantic UI Sizing & Spacing System

## Overview

The sizing and spacing system is designed around three principles:
1. **Single control point** - Change `--base-size` to scale everything
2. **Semantic tokens for AI** - Natural language names for LLM coding
3. **Numeric grid for humans** - Fine-grained control for manual tweaking

## Architecture

```
global/sizing.css     → Base values (unitless, ratio-scaled)
computed/sizing.css   → Size scale (rem/em), pixel utilities
computed/spacing.css  → Spacing, gap, padding, margin, numeric grid
```

---

## Sizing System

### Base Configuration (`global/sizing.css`)

```css
--base-size: 14;  /* Change to 16 for marketing sites */

/* All values scale from 14px baseline ratios */
--base-3xs: round(calc((10 / 14) * var(--base-size)));  /* 10 @ 14, 11 @ 16 */
--base-m:   var(--base-size);                           /* Always equals base */
--base-3xl: round(calc((24 / 14) * var(--base-size)));  /* 24 @ 14, 27 @ 16 */
```

**Key insight:** The 14 is hardcoded as the design baseline. Ratios preserve relationships when scaling.

### Computed Sizes (`computed/sizing.css`)

```css
/* rem - fixed to root (for font-size) */
--size-xs: calc((var(--base-xs) / var(--base-size)) * 1rem);

/* em - scales with component */
--size-xs-em: calc((var(--base-xs) / var(--base-size)) * 1em);
```

**Math note:** `--base-size` cancels out in division, so `--size-xs` is always the same ratio regardless of base-size. Actual pixel value comes from html `font-size`.

### Size Aliases

```css
/* Natural language (for font-size) */
--small: var(--size-s);    /* font-size: var(--small) */
--medium: var(--size-m);
--large: var(--size-l);

/* Short form */
--xs: var(--size-xs);
--m: var(--size-m);
--xl: var(--size-xl);

/* Relative (em-based) */
--relative-small: var(--size-s-em);
```

### Pixel Utilities

```css
/* Fixed (rem) */
--4px: calc((4 / var(--base-size)) * 1rem);

/* Relative (em) - scales with component */
--relative-4px: calc((4 / var(--base-size)) * 1em);
```

---

## Spacing System

### Four Semantic Scales (`computed/spacing.css`)

| Scale | Unit | Use Case |
|-------|------|----------|
| `--spacing-*` | rem | Layout rhythm, between components |
| `--gap-*` | em | Between elements within components |
| `--padding-*` | em | Edge to content within components |
| `--margin-*` | rem | Document flow (aliases spacing) |

### Why Different Units?

- **rem** = Fixed to root. Layout stays consistent regardless of component size.
- **em** = Scales with component. When you make a button larger via font-size, its padding/gap scale proportionally.

### T-Shirt Scale

```css
--spacing-3xs: round(0.125rem, 1px);  /*  2px - subpixel rounded */
--spacing-2xs: round(0.25rem, 1px);   /*  4px - subpixel rounded */
--spacing-xs:  0.5rem;                /*  7px */
--spacing-s:   round(0.75rem, 1px);   /* 10px - subpixel rounded */
--spacing-m:   1rem;                  /* 14px */
--spacing-l:   1.5rem;                /* 21px */
--spacing-xl:  2rem;                  /* 28px */
--spacing-2xl: 3rem;                  /* 42px */
--spacing-3xl: 4rem;                  /* 56px */
```

**Subpixel handling:** Values that result in fractional pixels (0.125rem = 1.75px at 14px base) use `round(value, 1px)` to snap to integers.

### Natural Language Aliases

```css
--spacing-small: var(--spacing-s);
--gap-small: var(--gap-s);
--padding-small: var(--padding-s);
```

### Structural Aliases

```css
--spacing-section: var(--spacing-2xl);  /* Between sections */
--spacing-page: var(--spacing-3xl);     /* Page-level spacing */
```

---

## Numeric Grid (for Human Tweaking)

### Purpose

The semantic scale is optimized for AI/LLM coding. The numeric grid is for designers/developers doing pixel-perfect manual adjustments.

### Implementation

```css
--space-unit: var(--relative-2px);  /* 2px base - more precision than Tailwind's 4px */

--space-1:  var(--space-unit);                   /*  2px */
--space-2:  calc(var(--space-unit) * 2);         /*  4px */
--space-7:  calc(var(--space-unit) * 7);         /* 14px = base */
--space-40: calc(var(--space-unit) * 40);        /* 80px */
```

### Why 2px Base?

- More granular than Tailwind's 4px grid
- 14px (base font) lands on `--space-7`
- Fine-grained enough for design tweaks, coarse enough to prevent bikeshedding

---

## Usage Guidelines

### For LLM/AI Coding

Use semantic tokens:
```css
padding: var(--padding-small);
gap: var(--gap-xs);
margin-bottom: var(--spacing-section);
font-size: var(--small);
```

### For Human Fine-Tuning

Use numeric grid:
```css
padding: var(--space-3);   /* 6px */
gap: var(--space-4);       /* 8px */
margin: var(--space-10);   /* 20px */
```

### Context-Aware Token Selection

| CSS Property | Token Type | Unit | Example |
|--------------|------------|------|---------|
| `font-size` | sizing | rem | `var(--small)` |
| `padding` | padding | em | `var(--padding-xs)` |
| `margin` | spacing/margin | rem | `var(--spacing-m)` |
| `gap` | gap | em | `var(--gap-small)` |

---

## Scaling the System

To scale for a marketing site with larger text:

```css
:root {
  --base-size: 16;  /* Instead of 14 */
}
```

Everything scales proportionally:
- Font sizes increase
- Spacing/padding ratios preserved
- Pixel utilities adjust automatically
