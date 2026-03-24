# Sizing System Inventory

Documenting all existing groupings from src/css token files.

---

## File: `src/css/tokens/global/sizing.css`

### Group: Base Font Size
```css
--font-size: 14px;
```
- Unit: px
- Purpose: Controls rem calculation

### Group: Size Scale Base Values
```css
--size-3xs-base: 10;
--size-2xs-base: 11;
--size-xs-base: 12;
--size-s-base: 13;
--size-m-base: 14;
--size-l-base: 16;
--size-xl-base: 18;
--size-2xl-base: 20;
--size-3xl-base: 24;
```
- Unit: unitless
- Purpose: Raw numbers for size calculations

### Group: Em Size Base
```css
--em-size: var(--size-m-base);
```
- Unit: unitless (14)
- Purpose: Base for em/rem calculations

---

## File: `src/css/tokens/global/spacing.css`

### Group: Spacing Scale (Primary)
```css
--spacing-3xs: 0.125rem;
--spacing-2xs: 0.25rem;
--spacing-xs: 0.5rem;
--spacing-s: 0.75rem;
--spacing-m: 1rem;
--spacing-l: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;
--spacing-3xl: 4rem;
```
- Unit: rem
- Purpose: Layout rhythm, gaps between elements

### Group: Spacing Default
```css
--spacing: var(--spacing-m);
```
- Unit: rem (via alias)
- Purpose: Default spacing value

### Group: Spacing Natural Language Aliases
```css
--spacing-micro: var(--spacing-3xs);
--spacing-mini: var(--spacing-2xs);
--spacing-tiny: var(--spacing-xs);
--spacing-small: var(--spacing-s);
--spacing-medium: var(--spacing-m);
--spacing-large: var(--spacing-l);
--spacing-big: var(--spacing-xl);
--spacing-huge: var(--spacing-2xl);
--spacing-massive: var(--spacing-3xl);
```
- Unit: rem (via alias)
- Purpose: Human-readable aliases

### Group: Spacing Structural Aliases
```css
--spacing-section: var(--spacing-2xl);
--spacing-page: var(--spacing-3xl);
```
- Unit: rem (via alias)
- Purpose: Semantic layout spacing

### Group: Spacing Legacy
```css
--compact-spacing: var(--spacing-xs);
```
- Unit: rem (via alias)
- Purpose: Legacy alias

---

## File: `src/css/tokens/computed/em-sizing.css`

### Group: Font Size (Computed)
```css
--font-size: calc(var(--em-size) * 1px);
```
- Unit: px
- Purpose: Computed font size from em-size base

### Group: Size Scale (rem)
```css
--size-3xs: calc((var(--size-3xs-base) / var(--em-size)) * 1rem);
--size-2xs: calc((var(--size-2xs-base) / var(--em-size)) * 1rem);
--size-xs: calc((var(--size-xs-base) / var(--em-size)) * 1rem);
--size-s: calc((var(--size-s-base) / var(--em-size)) * 1rem);
--size-m: calc((var(--size-m-base) / var(--em-size)) * 1rem);
--size-l: calc((var(--size-l-base) / var(--em-size)) * 1rem);
--size-xl: calc((var(--size-xl-base) / var(--em-size)) * 1rem);
--size-2xl: calc((var(--size-2xl-base) / var(--em-size)) * 1rem);
--size-3xl: calc((var(--size-3xl-base) / var(--em-size)) * 1rem);
```
- Unit: rem
- Purpose: Fixed sizes relative to root

### Group: Size Scale (em)
```css
--size-3xs-em: calc((var(--size-3xs-base) / var(--em-size)) * 1em);
--size-2xs-em: calc((var(--size-2xs-base) / var(--em-size)) * 1em);
--size-xs-em: calc((var(--size-xs-base) / var(--em-size)) * 1em);
--size-s-em: calc((var(--size-s-base) / var(--em-size)) * 1em);
--size-m-em: calc((var(--size-m-base) / var(--em-size)) * 1em);
--size-l-em: calc((var(--size-l-base) / var(--em-size)) * 1em);
--size-xl-em: calc((var(--size-xl-base) / var(--em-size)) * 1em);
--size-2xl-em: calc((var(--size-2xl-base) / var(--em-size)) * 1em);
--size-3xl-em: calc((var(--size-3xl-base) / var(--em-size)) * 1em);
```
- Unit: em
- Purpose: Relative sizes that scale with component

### Group: Natural Language Aliases (rem)
```css
--micro: var(--size-3xs);
--mini: var(--size-2xs);
--tiny: var(--size-xs);
--small: var(--size-s);
--medium: var(--size-m);
--large: var(--size-l);
--big: var(--size-xl);
--huge: var(--size-2xl);
--massive: var(--size-3xl);
```
- Unit: rem (via alias)
- Purpose: Human-readable size aliases

### Group: Short Aliases (rem)
```css
--3xs: var(--size-3xs);
--2xs: var(--size-2xs);
--xs: var(--size-xs);
--s: var(--size-s);
--m: var(--size-m);
--l: var(--size-l);
--xl: var(--size-xl);
--2xl: var(--size-2xl);
--3xl: var(--size-3xl);
```
- Unit: rem (via alias)
- Purpose: Terse size aliases

### Group: Relative Aliases (em)
```css
--relative-micro: var(--size-3xs-em);
--relative-mini: var(--size-2xs-em);
--relative-tiny: var(--size-xs-em);
--relative-small: var(--size-s-em);
--relative-medium: var(--size-m-em);
--relative-large: var(--size-l-em);
--relative-big: var(--size-xl-em);
--relative-huge: var(--size-2xl-em);
--relative-massive: var(--size-3xl-em);
```
- Unit: em (via alias)
- Purpose: Human-readable scaling aliases

### Group: Pixel Values (rem)
```css
--1px: calc((1 / var(--em-size)) * 1rem);
--2px: calc((2 / var(--em-size)) * 1rem);
... (continues 1-64)
--64px: calc((64 / var(--em-size)) * 1rem);
```
- Unit: rem
- Purpose: Exact pixel values as fixed rem
- Count: 64 tokens

### Group: Pixel Values (em)
```css
--relative-1px: calc((1 / var(--em-size)) * 1em);
--relative-2px: calc((2 / var(--em-size)) * 1em);
... (continues 1-64)
--relative-64px: calc((64 / var(--em-size)) * 1em);
```
- Unit: em
- Purpose: Exact pixel values as scaling em
- Count: 64 tokens

---

## File: `src/css/tokens/computed/layout.css`

### Group: Padding Scale (Primary)
```css
--padding-3xs: var(--spacing-3xs);
--padding-2xs: var(--spacing-2xs);
--padding-xs: var(--spacing-xs);
--padding-s: var(--spacing-s);
--padding-m: var(--spacing-m);
--padding-l: var(--spacing-l);
--padding-xl: var(--spacing-xl);
--padding-2xl: var(--spacing-2xl);
--padding-3xl: var(--spacing-3xl);
```
- Unit: rem (via spacing alias) **← PROBLEM: should be em**
- Purpose: Component internal spacing

### Group: Padding Default
```css
--padding: var(--padding-m);
```
- Unit: rem (via alias)
- Purpose: Default padding value

### Group: Padding Natural Language Aliases
```css
--padding-micro: var(--padding-3xs);
--padding-mini: var(--padding-2xs);
--padding-tiny: var(--padding-xs);
--padding-small: var(--padding-s);
--padding-medium: var(--padding-m);
--padding-large: var(--padding-l);
--padding-big: var(--padding-xl);
--padding-huge: var(--padding-2xl);
--padding-massive: var(--padding-3xl);
```
- Unit: rem (via alias)
- Purpose: Human-readable padding aliases

### Group: Padding Legacy
```css
--compact-padding: var(--padding-xs);
```
- Unit: rem (via alias)
- Purpose: Legacy alias

### Group: Padding Directional Utilities
```css
--horizontally-padded: 0rem var(--padding);
--vertically-padded: var(--padding) 0rem;
```
- Unit: rem
- Purpose: Shorthand for directional padding

### Group: Margin Scale (Primary)
```css
--margin-3xs: var(--spacing-3xs);
--margin-2xs: var(--spacing-2xs);
--margin-xs: var(--spacing-xs);
--margin-s: var(--spacing-s);
--margin-m: var(--spacing-m);
--margin-l: var(--spacing-l);
--margin-xl: var(--spacing-xl);
--margin-2xl: var(--spacing-2xl);
--margin-3xl: var(--spacing-3xl);
```
- Unit: rem (via spacing alias) **← Correct: margin should be rem**
- Purpose: Document flow spacing

### Group: Margin Default
```css
--margin: var(--margin-m);
```
- Unit: rem (via alias)
- Purpose: Default margin value

### Group: Margin Natural Language Aliases
```css
--margin-micro: var(--margin-3xs);
--margin-mini: var(--margin-2xs);
--margin-tiny: var(--margin-xs);
--margin-small: var(--margin-s);
--margin-medium: var(--margin-m);
--margin-large: var(--margin-l);
--margin-big: var(--margin-xl);
--margin-huge: var(--margin-2xl);
--margin-massive: var(--margin-3xl);
```
- Unit: rem (via alias)
- Purpose: Human-readable margin aliases

### Group: Margin Directional Utilities
```css
--vertically-spaced: var(--margin) 0rem;
--horizontally-spaced: 0rem var(--margin);
--centered: var(--spacing) auto;
```
- Unit: rem
- Purpose: Shorthand for directional margin

---

## Summary

| Group | Token Count | Unit | File |
|-------|-------------|------|------|
| Base font size | 1 | px | global/sizing.css |
| Size base values | 9 | unitless | global/sizing.css |
| Em size base | 1 | unitless | global/sizing.css |
| Spacing scale | 9 | rem | global/spacing.css |
| Spacing default | 1 | rem | global/spacing.css |
| Spacing NL aliases | 9 | rem | global/spacing.css |
| Spacing structural | 2 | rem | global/spacing.css |
| Spacing legacy | 1 | rem | global/spacing.css |
| Font size computed | 1 | px | computed/em-sizing.css |
| Size scale (rem) | 9 | rem | computed/em-sizing.css |
| Size scale (em) | 9 | em | computed/em-sizing.css |
| Size NL aliases (rem) | 9 | rem | computed/em-sizing.css |
| Size short aliases | 9 | rem | computed/em-sizing.css |
| Size relative aliases | 9 | em | computed/em-sizing.css |
| Pixel values (rem) | 64 | rem | computed/em-sizing.css |
| Pixel values (em) | 64 | em | computed/em-sizing.css |
| Padding scale | 9 | rem* | computed/layout.css |
| Padding default | 1 | rem | computed/layout.css |
| Padding NL aliases | 9 | rem | computed/layout.css |
| Padding legacy | 1 | rem | computed/layout.css |
| Padding directional | 2 | rem | computed/layout.css |
| Margin scale | 9 | rem | computed/layout.css |
| Margin default | 1 | rem | computed/layout.css |
| Margin NL aliases | 9 | rem | computed/layout.css |
| Margin directional | 3 | rem | computed/layout.css |

**Total: ~250 tokens**

*Padding is rem but should be em
