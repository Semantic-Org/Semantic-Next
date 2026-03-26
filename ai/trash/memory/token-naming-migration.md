# Token Naming Migration: adjective-noun → noun-subcategory

## Overview

This document catalogs tokens that use `--adjective-noun` pattern and should be migrated to `--noun-subcategory` for consistency and discoverability.

**Current pattern (inconsistent):** `--tablet-breakpoint`, `--muted-text-color`
**Target pattern:** `--breakpoint-tablet`, `--text-color-muted`

---

## Already Correct (noun-subcategory)

These token families already follow the correct pattern:
- `--spacing-*` (spacing-xs, spacing-large, etc.)
- `--size-*` (size-m, size-3xs-base, etc.)
- `--title-*` (title-m, title-large, etc.)
- `--text-*` (text-m, text-large, etc.)
- `--border-radius-*` (border-radius-m, border-radius-large, etc.)
- `--container-*` (container-text, container-wide, etc.)
- Color scales: `--red-*`, `--blue-*`, `--primary-*`, `--standard-*`, `--inverted-*`
- State colors: `--positive-*`, `--negative-*`, `--info-*`, `--warning-*`

---

## High Priority: Breakpoints

**File:** `src/css/tokens/global/layout.css`

| Current | Proposed |
|---------|----------|
| `--mobile-breakpoint` | `--breakpoint-mobile` |
| `--tablet-breakpoint` | `--breakpoint-tablet` |
| `--computer-breakpoint` | `--breakpoint-computer` |
| `--large-monitor-breakpoint` | `--breakpoint-large-monitor` |
| `--widescreen-monitor-breakpoint` | `--breakpoint-widescreen` |

**Computed derivatives** (`src/css/tokens/computed/layout.css`):

| Current | Proposed |
|---------|----------|
| `--largest-mobile-screen` | `--screen-max-mobile` |
| `--largest-tablet-screen` | `--screen-max-tablet` |
| `--largest-small-monitor` | `--screen-max-small-monitor` |
| `--largest-large-monitor` | `--screen-max-large-monitor` |

---

## High Priority: Text Colors

**File:** `src/css/tokens/themes/computed/typography.css`

| Current | Proposed |
|---------|----------|
| `--header-color` | `--color-header` |
| `--text-color` | `--color-text` |
| `--dark-text-color` | `--color-text-dark` |
| `--muted-text-color` | `--color-text-muted` |
| `--light-text-color` | `--color-text-light` |
| `--unselected-text-color` | `--color-text-unselected` |
| `--hovered-text-color` | `--color-text-hovered` |
| `--pressed-text-color` | `--color-text-pressed` |
| `--selected-text-color` | `--color-text-selected` |
| `--disabled-text-color` | `--color-text-disabled` |
| `--inverted-text-color` | `--color-text-inverted` |
| `--inverted-muted-text-color` | `--color-text-inverted-muted` |
| `--inverted-light-text-color` | `--color-text-inverted-light` |
| `--inverted-unselected-text-color` | `--color-text-inverted-unselected` |
| `--inverted-hovered-text-color` | `--color-text-inverted-hovered` |
| `--inverted-pressed-text-color` | `--color-text-inverted-pressed` |
| `--inverted-selected-text-color` | `--color-text-inverted-selected` |
| `--inverted-disabled-text-color` | `--color-text-inverted-disabled` |

---

## High Priority: Border Colors

**File:** `src/css/tokens/themes/computed/layout.css`

| Current | Proposed |
|---------|----------|
| `--border-color` | `--color-border` |
| `--internal-border-color` | `--color-border-internal` |
| `--subtle-border-color` | `--color-border-subtle` |
| `--very-subtle-border-color` | `--color-border-very-subtle` |
| `--strong-border-color` | `--color-border-strong` |
| `--selected-border-color` | `--color-border-selected` |
| `--strong-selected-border-color` | `--color-border-selected-strong` |
| `--disabled-border-color` | `--color-border-disabled` |

**Border shorthand tokens:**

| Current | Proposed |
|---------|----------|
| `--black-border` | `--border-black` |
| `--white-border` | `--border-white` |
| `--internal-border` | `--border-internal` |
| `--very-subtle-border` | `--border-very-subtle` |
| `--subtle-border` | `--border-subtle` |
| `--strong-border` | `--border-strong` |
| `--selected-border` | `--border-selected` |
| `--strong-selected-border` | `--border-selected-strong` |
| `--disabled-border` | `--border-disabled` |
| `--solid-border` | `--border-solid` |
| `--solid-black-border` | `--border-solid-black` |
| `--solid-white-border` | `--border-solid-white` |
| `--selected-black-border` | `--border-black-selected` |
| `--selected-white-border` | `--border-white-selected` |

---

## Medium Priority: Typography

**File:** `src/css/tokens/global/typography.css`

| Current | Proposed |
|---------|----------|
| `--header-font` | `--font-header` |
| `--page-font` | `--font-page` |
| `--header-font-weight` | `--font-weight-header` |
| `--header-line-height` | `--line-height-header` |
| `--link-text-decoration` | `--text-decoration-link` |
| `--link-hover-text-decoration` | `--text-decoration-link-hover` |
| `--header-top-margin` | `--margin-header-top` |
| `--header-bottom-margin` | `--margin-header-bottom` |
| `--paragraph-margin` | `--margin-paragraph` |
| `--paragraph-line-height` | `--line-height-paragraph` |

---

## Medium Priority: Interaction States

**File:** `src/css/tokens/global/interaction.css`

| Current | Proposed |
|---------|----------|
| `--recessed-opacity` | `--opacity-recessed` |
| `--disabled-opacity` | `--opacity-disabled` |
| `--hover-lightness` | `--lightness-hover` |
| `--focus-lightness` | `--lightness-focus` |
| `--down-lightness` | `--lightness-down` |
| `--active-lightness` | `--lightness-active` |
| `--link-opacity` | `--opacity-link` |
| `--loader-duration` | `--duration-loader` |
| `--input-vertical-padding` | `--padding-input-vertical` |
| `--input-horizontal-padding` | `--padding-input-horizontal` |

**Focus ring tokens:**

| Current | Proposed |
|---------|----------|
| `--focused-ring` | `--ring-focus` |
| `--focused-outline-color` | `--color-outline-focus` |
| `--focused-ring-color` | `--color-ring-focus` |
| `--focused-ring-outline-width` | `--ring-outline-width-focus` |
| `--focused-ring-width` | `--ring-width-focus` |
| `--focused-ring-shadow` | `--shadow-ring-focus` |

---

## Medium Priority: Effects (Gradients & Shadows)

**File:** `src/css/tokens/themes/computed/effects.css`

**Gradients:**

| Current | Proposed |
|---------|----------|
| `--very-subtle-gradient` | `--gradient-very-subtle` |
| `--subtle-gradient` | `--gradient-subtle` |
| `--gradient` | `--gradient` (keep) |
| `--strong-gradient` | `--gradient-strong` |
| `--very-strong-gradient` | `--gradient-very-strong` |
| `--subtle-inverted-gradient` | `--gradient-inverted-subtle` |
| `--inverted-gradient` | `--gradient-inverted` |
| `--subtle-angled-gradient` | `--gradient-angled-subtle` |
| `--angled-gradient` | `--gradient-angled` |
| `--strong-angled-gradient` | `--gradient-angled-strong` |
| `--horizontal-gradient` | `--gradient-horizontal` |
| (etc. for all gradient variants) | |

**Shadows:**

| Current | Proposed |
|---------|----------|
| `--text-shadow` | `--shadow-text` |
| `--subtle-shadow` | `--shadow-subtle` |
| `--shadow` | `--shadow` (keep) |
| `--subtle-inset-shadow` | `--shadow-inset-subtle` |
| `--inset-shadow` | `--shadow-inset` |
| `--floating-shadow` | `--shadow-floating` |
| `--subtle-top-lip-shadow` | `--shadow-lip-top-subtle` |
| `--subtle-bottom-lip-shadow` | `--shadow-lip-bottom-subtle` |
| `--subtle-left-lip-shadow` | `--shadow-lip-left-subtle` |
| `--subtle-right-lip-shadow` | `--shadow-lip-right-subtle` |

---

## Medium Priority: Computed Layout

**File:** `src/css/tokens/computed/layout.css`

| Current | Proposed |
|---------|----------|
| `--compact-padding` | `--padding-compact` |
| `--horizontally-padded` | `--padded-horizontal` |
| `--vertically-padded` | `--padded-vertical` |
| `--vertically-spaced` | `--spaced-vertical` |
| `--horizontally-spaced` | `--spaced-horizontal` |
| `--top-attached-border-radius` | `--border-radius-attached-top` |
| `--right-attached-border-radius` | `--border-radius-attached-right` |
| `--bottom-attached-border-radius` | `--border-radius-attached-bottom` |
| `--left-attached-border-radius` | `--border-radius-attached-left` |
| `--default-scrollbar-width` | `--scrollbar-width-default` |
| `--page-min-width` | `--width-page-min` |

---

## Low Priority: Visual/Scrollbar

**File:** `src/css/tokens/global/visual.css`

| Current | Proposed |
|---------|----------|
| `--track-border-radius` | `--scrollbar-border-radius-track` |
| `--thumb-border-radius` | `--scrollbar-border-radius-thumb` |
| `--thumb-transition` | `--scrollbar-transition-thumb` |

**File:** `src/css/tokens/themes/computed/effects.css`

| Current | Proposed |
|---------|----------|
| `--track-background` | `--scrollbar-background-track` |
| `--thumb-background` | `--scrollbar-background-thumb` |
| `--thumb-inactive-background` | `--scrollbar-background-thumb-inactive` |
| `--thumb-hover-background` | `--scrollbar-background-thumb-hover` |
| `--track-inverted-background` | `--scrollbar-background-track-inverted` |
| `--thumb-inverted-background` | `--scrollbar-background-thumb-inverted` |
| (etc.) | |

---

## Low Priority: State Color Aliases

**File:** `src/css/tokens/themes/computed/state-colors.css`

| Current | Proposed |
|---------|----------|
| `--positive-background-color` | `--color-background-positive` |
| `--positive-border-color` | `--color-border-positive` |
| `--positive-header-color` | `--color-header-positive` |
| `--positive-text-color` | `--color-text-positive` |
| `--negative-background-color` | `--color-background-negative` |
| `--negative-border-color` | `--color-border-negative` |
| `--negative-header-color` | `--color-header-negative` |
| `--negative-text-color` | `--color-text-negative` |
| `--info-background-color` | `--color-background-info` |
| `--info-border-color` | `--color-border-info` |
| `--info-header-color` | `--color-header-info` |
| `--info-text-color` | `--color-text-info` |
| `--warning-background-color` | `--color-background-warning` |
| `--warning-border-color` | `--color-border-warning` |
| `--warning-header-color` | `--color-header-warning` |
| `--warning-text-color` | `--color-text-warning` |

---

## Excluded: Brand Colors

**File:** `src/css/tokens/global/brands.css`

These follow `--{brand}-color` pattern which reads naturally and groups by brand:
- `--facebook-color`
- `--twitter-color`
- etc.

**Recommendation:** Keep as-is. Brand names are proper nouns, not adjectives.

---

## Excluded: Column/Width Utilities

**File:** `src/css/tokens/computed/layout.css`

These use number-first naming which is appropriate:
- `--one-wide`, `--two-wide`, etc.
- `--one-column`, `--two-column`, etc.

**Recommendation:** Keep as-is. These are grid utilities with established naming.

---

## Migration Notes

1. **Search scope:** Must search `src/` and `docs/` for all usages
2. **Order of operations:**
   - Update token definitions first
   - Then search/replace all usages
   - Consider keeping old names as deprecated aliases temporarily
3. **Testing:** Verify CSS builds and visual regression after changes
4. **Documentation:** Update `ai/workspace/memory/sui-tokens.md` after migration

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Breakpoints | 5 |
| Text colors | 18 |
| Border colors/borders | 26 |
| Typography | 10 |
| Interaction states | 16 |
| Gradients | ~25 |
| Shadows | ~12 |
| Layout utilities | 11 |
| Scrollbar | ~12 |
| State color aliases | 16 |
| **Total** | **~150 tokens** |
