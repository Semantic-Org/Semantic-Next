---
title: Base Size Scaling System
description: How the sizing system scales from a single control point, why 14px is the default, and why a 2px grid is necessary for dense application UIs.
keywords: [base-size, scaling, 14px, 2px grid, dense UI, sizing tokens]
audience: contributing
type: doc
---

# Base Size Scaling System

## The Single Control Point

The entire sizing system scales from one variable:

```css
--base-size: 14;  /* Change to 16 for marketing sites */
```

Changing this value proportionally scales all size tokens, pixel utilities, and spacing values throughout the framework.

## Industry Standard: 16px Base, 4px Grid

The overwhelming majority of CSS frameworks use a 16px base font size with a 4px spacing grid:

| Framework | Base Size | Grid Unit |
|-----------|-----------|-----------|
| Tailwind CSS | 16px | 4px |
| Chakra UI | 16px | 4px |
| Radix | 16px | 4px |
| Open Props | 16px | 4px |
| MUI | 16px | 8px (4px half-step) |
| Mantine | 16px | varies |

This works well because:
- 16px is the browser default, requiring no override
- 16 divides cleanly by 4 (4 subdivisions) and 8 (2 subdivisions)
- Content-focused sites benefit from generous spacing

These frameworks target marketing sites, documentation, and general-purpose web content where information density is not a constraint.

## Why 14px Default (Not 16px)

Most CSS frameworks default to 16px because it's the browser default and works well for content-focused sites. Semantic UI defaults to 14px because it targets **information-dense application UIs**.

Dense workflow software—admin panels, developer tools, ERP systems, financial applications—requires tighter spacing to fit complex layouts. At 16px base, default padding and margins consume too much screen real estate for these use cases.

The framework is designed for the harder problem (dense UIs) and scales up for simpler cases, rather than the reverse.

## Why 2px Grid (Not 4px)

The 4px grid has become an industry standard, but it assumes a 16px base:

```
16px ÷ 4 = 4 clean subdivisions
```

With a 14px base, the 4px grid doesn't align:

```
14px ÷ 4 = 3.5 (fractional, can't render crisply)
```

A 2px grid restores clean alignment:

```
14px ÷ 2 = 7 clean subdivisions
```

### The Alignment Problem

Consider a container with 1em padding (14px at base). With a 4px grid, your spacing options are:

```
4px  - too tight
8px  - doesn't subdivide 14 evenly
12px - doesn't subdivide 14 evenly
16px - larger than the container padding itself
```

None of these create harmonious internal proportions with a 14px container.

With a 2px grid, you get:

```
2px, 4px, 6px, 8px, 10px, 12px, 14px
```

Now 6px (3 units) and 8px (4 units) are available, and 14px lands exactly on-grid. Internal elements can align with the container's natural rhythm.

### Practical Example

A button with 14px base and 1em padding:
- **4px grid**: Internal icon gap must be 4px or 8px—neither feels right
- **2px grid**: 6px gap available, proportionally balanced with 14px padding

The 2px grid isn't about wanting more granularity—it's about **maintaining alignment when your base em is 14px**.

## How Scaling Works

### Layer 1: Design Baseline Ratios

The size scale is designed at 14px, with each step defined as a ratio:

```css
/* sizing.css - base values */
--base-size: 14;

--base-3xs: round(calc((10 / 14) * var(--base-size)));  /* tiny */
--base-2xs: round(calc((11 / 14) * var(--base-size)));
--base-xs:  round(calc((12 / 14) * var(--base-size)));
--base-s:   round(calc((13 / 14) * var(--base-size)));
--base-m:   var(--base-size);                            /* anchor */
--base-l:   round(calc((16 / 14) * var(--base-size)));
--base-xl:  round(calc((18 / 14) * var(--base-size)));
--base-2xl: round(calc((20 / 14) * var(--base-size)));
--base-3xl: round(calc((24 / 14) * var(--base-size)));
```

The hardcoded `14` in the ratios is intentional—it's the **design reference point**, not a value to parameterize. The ratios express "at 14px base, large is 16px" as a fixed design decision.

### Layer 2: Rounding for Pixel Precision

The `round()` function ensures whole-pixel values when scaling:

| Size | At base-size: 14 | At base-size: 16 |
|------|------------------|------------------|
| `--base-3xs` | round((10/14) × 14) = **10** | round((10/14) × 16) = **11** |
| `--base-m` | 14 | 16 |
| `--base-l` | round((16/14) × 14) = **16** | round((16/14) × 16) = **18** |

Without rounding, `--base-l` at 16 would be 18.29px—a fractional value that can't render crisply.

### Layer 3: Normalized rem/em Values

Computed sizing divides by `--base-size` to produce normalized units:

```css
/* sizing.css - computed from base values */
--size-m: calc((var(--base-m) / var(--base-size)) * 1rem);  /* always 1rem */
--size-l: calc((var(--base-l) / var(--base-size)) * 1rem);

--14px: calc((14 / var(--base-size)) * 1rem);
--16px: calc((16 / var(--base-size)) * 1rem);
```

This keeps `--size-m` pinned at exactly 1rem (the anchor point) while other sizes scale proportionally around it.

### Layer 4: Pixel Token Stability

The `--Npx` tokens maintain their visual pixel value regardless of base size:

| Token | base-size: 14 | base-size: 16 | Visual Result |
|-------|---------------|---------------|---------------|
| `--14px` | (14/14) × 1rem = 1rem | (14/16) × 1rem = 0.875rem | 14px |
| `--16px` | (16/14) × 1rem = 1.143rem | (16/16) × 1rem = 1rem | 16px |

A `--14px` token always renders as 14 visual pixels. The rem value adjusts so the output stays constant.

## Switching to 16px for Marketing Sites

For content-focused sites where 16px base is appropriate:

```css
:root {
  --base-size: 16;
}
```

All tokens automatically recalculate:
- Size scale steps increase proportionally
- Pixel tokens maintain visual values
- Spacing inherits the new base through `--space-unit: var(--relative-2px)`
- Component padding scales with `--relative-Npx` tokens

### Switching to 4px Grid

When using 16px base, you can also switch to the industry-standard 4px grid:

```css
:root {
  --base-size: 16;
  --space-unit: var(--relative-4px);
}
```

This changes the `--space-{n}` scale from 2px increments to 4px increments:

| Token | With 2px unit | With 4px unit |
|-------|---------------|---------------|
| `--space-1` | 2px | 4px |
| `--space-2` | 4px | 8px |
| `--space-4` | 8px | 16px |
| `--space-8` | 16px | 32px |

The t-shirt scale (`--spacing-xs`, `--gap-m`, etc.) continues to work unchanged—those use rem/em values independent of the space unit.

### When to Use Each Configuration

| Configuration | Use Case |
|---------------|----------|
| `--base-size: 14` + 2px grid | Dense application UIs (default) |
| `--base-size: 16` + 2px grid | Content sites wanting fine control |
| `--base-size: 16` + 4px grid | Content sites matching Tailwind/ecosystem conventions |

## Summary

| Decision | Rationale |
|----------|-----------|
| 14px default | Dense application UIs need tighter spacing |
| 2px grid | 14px doesn't divide evenly by 4 |
| Hardcoded 14 in ratios | Design reference point, not parameterized |
| `round()` in calculations | Ensures whole-pixel rendering |
| Single `--base-size` control | One change scales entire system |
