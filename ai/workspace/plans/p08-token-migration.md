# Token Migration Guide — a0f551f0

Mapping of removed/changed CSS tokens to their new equivalents after the spacing & styling token rework.

---

## Overview of Changes

The commit reorganizes tokens into a clearer architecture:

| File | What happened |
|------|--------------|
| `tokens/base.css` | **New.** `--base-size`, `--base-spacing`, `--Xpx` (rem), `--relative-Xpx` (em), `--size-ratio`, `--em-size`, `--body-size`, `--reference-size` |
| `tokens/sizing.css` | Simplified. Removed intermediate `--base-*` scale, brevity aliases, `--size-*-em`, `--relative-{name}` aliases. `--Xpx`/`--relative-Xpx` moved to base.css |
| `tokens/spacing.css` | Rearchitected. `--spacing-*` → `--margin-*` (rem). `--padding-*`/`--gap-*` now use `--size-ratio`. Added `--indent-*`, `--gutter-*`, directional shorthands |
| `tokens/typography.css` | `--text-*` and `--title-*` now em-based via `--relative-Xpx`. Removed natural-language aliases. `--h1`–`--h5` now rem-based via `--Xpx` |
| `tokens/forms.css` | Padding bumped: `--relative-10px` → `--relative-12px`, `--relative-12px` → `--relative-14px` |

### Behavioral notes

- **Padding values increased ~14%.** Old `--padding-m` was `1em`. New is `calc(var(--size-ratio) * 1em)` ≈ `1.143em` at base 14/16. Intentional.
- **`--vertical-padding` / `--horizontal-padding` were swapped.** Old had the directions backwards. New is correct.
- **`--bold` changed** from `bold` to `600`.
- **`--h4` changed** from `15px` to `var(--16px)`.
- **Size alias shift:** `--mini`/`--tiny`/`--small` each shifted down one step (intentional revaluation).

---

## Removed Tokens — Full Migration Map

### 1. Sizing — Brevity Aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--micro` | `--mini` (if used as component size) or `--size-3xs` |
| `--3xs` | `--size-3xs` |
| `--2xs` | `--size-2xs` |
| `--xs` | `--size-xs` |
| `--s` | `--size-s` |
| `--m` | `--size-m` |
| `--l` | `--size-l` |
| `--xl` | `--size-xl` |
| `--2xl` | `--size-2xl` |
| `--3xl` | `--size-3xl` |

### 2. Sizing — Base Primitives (removed)

These were intermediate computation tokens. Replace with the `--Xpx` value they resolved to:

| Removed | Replacement | Note |
|---------|-------------|------|
| `--base-3xs` | `--10px` | Was `round((10/14) * var(--base-size))` |
| `--base-2xs` | `--11px` | |
| `--base-xs` | `--12px` | |
| `--base-s` | `--13px` | |
| `--base-m` | `--14px` | Was `var(--base-size)` |
| `--base-l` | `--16px` | |
| `--base-xl` | `--18px` | |
| `--base-2xl` | `--20px` | |
| `--base-3xl` | `--24px` | |

### 3. Sizing — Em Scale (removed)

| Removed | Replacement | Note |
|---------|-------------|------|
| `--size-3xs-em` | `--text-3xs` (for text) or `--relative-10px` (generic) | |
| `--size-2xs-em` | `--text-2xs` or `--relative-11px` | |
| `--size-xs-em` | `--text-xs` or `--relative-12px` | |
| `--size-s-em` | `--text-s` or `--relative-13px` | |
| `--size-m-em` | `--text-m` or `--relative-14px` | |
| `--size-l-em` | `--text-l` or `--relative-16px` | |
| `--size-xl-em` | `--text-xl` or `--relative-18px` | |
| `--size-2xl-em` | `--text-2xl` or `--relative-20px` | |
| `--size-3xl-em` | `--text-3xl` or `--relative-24px` | |

### 4. Sizing — Relative Named Aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--relative-micro` | `--text-3xs` |
| `--relative-mini` | `--text-2xs` |
| `--relative-tiny` | `--text-xs` |
| `--relative-small` | `--text-s` |
| `--relative-medium` | `--text-m` |
| `--relative-large` | `--text-l` |
| `--relative-big` | `--text-xl` |
| `--relative-huge` | `--text-2xl` |
| `--relative-massive` | `--text-3xl` |

### 5. Spacing — `--spacing-*` → `--margin-*` (rem layout scale)

| Removed | Replacement |
|---------|-------------|
| `--spacing-3xs` | `--margin-3xs` |
| `--spacing-2xs` | `--margin-2xs` |
| `--spacing-xs` | `--margin-xs` |
| `--spacing-s` | `--margin-s` |
| `--spacing-m` | `--margin-m` |
| `--spacing-l` | `--margin-l` |
| `--spacing-xl` | `--margin-xl` |
| `--spacing-2xl` | `--margin-2xl` |
| `--spacing-3xl` | `--margin-3xl` |
| `--spacing` | `--margin` |

### 6. Spacing — `--spacing-{name}` aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--spacing-micro` | `--margin-3xs` |
| `--spacing-mini` | `--margin-2xs` |
| `--spacing-tiny` | `--margin-xs` |
| `--spacing-small` | `--margin-s` |
| `--spacing-medium` | `--margin-m` |
| `--spacing-large` | `--margin-l` |
| `--spacing-big` | `--margin-xl` |
| `--spacing-huge` | `--margin-2xl` |
| `--spacing-massive` | `--margin-3xl` |

### 7. Spacing — Structural aliases (removed)

| Removed | Replacement | Note |
|---------|-------------|------|
| `--section-margin` | `--margin-2xl` | Was `var(--spacing-2xl)` = `3rem` |
| `--vertically-spaced` | `--vertical-margin` | Was `var(--spacing) 0` |
| `--horizontally-spaced` | `--horizontal-margin` | Was `0 var(--spacing)` |
| `--centered` | *(inline)* `var(--margin) auto` | No direct replacement token |

### 8. Spacing — Gap named aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--gap-micro` | `--gap-3xs` |
| `--gap-mini` | `--gap-2xs` |
| `--gap-tiny` | `--gap-xs` |
| `--gap-small` | `--gap-s` |
| `--gap-medium` | `--gap-m` |
| `--gap-large` | `--gap-l` |
| `--gap-big` | `--gap-xl` |
| `--gap-huge` | `--gap-2xl` |
| `--gap-massive` | `--gap-3xl` |

### 9. Spacing — Numeric gap scale (removed)

| Removed | Replacement |
|---------|-------------|
| `--gap-1` through `--gap-16` | *(removed)* Use `--gap-*` scale or raw `Nem` values |

### 10. Spacing — Padding named aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--padding-micro` | `--padding-3xs` |
| `--padding-mini` | `--padding-2xs` |
| `--padding-tiny` | `--padding-xs` |
| `--padding-small` | `--padding-s` |
| `--padding-medium` | `--padding-m` |
| `--padding-large` | `--padding-l` |
| `--padding-big` | `--padding-xl` |
| `--padding-huge` | `--padding-2xl` |
| `--padding-massive` | `--padding-3xl` |

### 11. Spacing — Compound padding tokens (removed)

| Removed | Replacement | Note |
|---------|-------------|------|
| `--tight-padding` | `--padding-xs` | Was `var(--padding-xs)` |
| `--very-tight-padding` | `--padding-2xs` | Was `var(--padding-2xs)` |
| `--tight-vertical-padding` | `var(--padding-xs) 0` | Inline the value |
| `--very-tight-vertical-padding` | `var(--padding-2xs) 0` | Inline the value |
| `--tight-horizontal-padding` | `0 var(--padding-xs)` | Inline the value |
| `--very-tight-horizontal-padding` | `0 var(--padding-2xs)` | Inline the value |
| `--rectangular-padding` | `var(--padding-s) var(--padding-m)` | Inline the value |
| `--rectangular-tight-padding` | `var(--padding-xs) var(--padding-s)` | Inline the value |
| `--rectangular-very-tight-padding` | `var(--padding-2xs) var(--padding-xs)` | Inline the value |

### 12. Spacing — Numeric space grid (removed)

| Removed | Replacement |
|---------|-------------|
| `--space-unit` | `--relative-2px` |
| `--space-1` | `--relative-2px` |
| `--space-2` | `--relative-4px` |
| `--space-3` | `--relative-6px` |
| `--space-4` | `--relative-8px` |
| `--space-N` | `--relative-{N*2}px` |

### 13. Typography — Removed aliases

| Removed | Replacement |
|---------|-------------|
| `--font-size` | `--body-size` |
| `--text-size` | `--text-m` |
| `--title-size` | `--title-m` |

### 14. Typography — Text named aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--text-micro` | `--text-3xs` |
| `--text-mini` | `--text-2xs` |
| `--text-tiny` | `--text-xs` |
| `--text-small` | `--text-s` |
| `--text-medium` | `--text-m` |
| `--text-large` | `--text-l` |
| `--text-big` | `--text-xl` |
| `--text-huge` | `--text-2xl` |
| `--text-massive` | `--text-3xl` |

### 15. Typography — Title named aliases (removed)

| Removed | Replacement |
|---------|-------------|
| `--title-micro` | `--title-3xs` |
| `--title-mini` | `--title-2xs` |
| `--title-tiny` | `--title-xs` |
| `--title-small` | `--title-s` |
| `--title-medium` | `--title-m` |
| `--title-large` | `--title-l` |
| `--title-big` | `--title-xl` |
| `--title-huge` | `--title-2xl` |
| `--title-massive` | `--title-3xl` |

### 16. Typography — Layout tokens (removed)

| Removed | Replacement | Note |
|---------|-------------|------|
| `--header-top-margin` | `--margin-xl` | Was `2rem` |
| `--header-bottom-margin` | `--margin-m` | Was `1rem` |
| `--paragraph-margin` | *(inline)* `0 0 var(--margin-m)` | Was `0em 0em 1em` |
| `--glyph-width` | *(inline)* `1.1em` | |
| `--line-height-offset` | *(inline)* `calc((var(--line-height) - 1em) / 2)` | |
| `--header-line-height-offset` | *(inline)* `calc(var(--header-line-height) - 1em) / 2` | |
| `--header-calc-top-margin` | *(inline calc)* | Was `calc(var(--header-top-margin) - var(--header-line-height-offset))` |
| `--header-margin` | *(inline values)* | Was `var(--header-calc-top-margin) 0em var(--header-bottom-margin)` |

---

## Tokens That Still Exist (unchanged or moved)

These tokens survived but may have moved files or changed formulas:

| Token | Status |
|-------|--------|
| `--base-size` | **Moved** from sizing.css → base.css. Same name. |
| `--Xpx` (1–64) | **Moved** from sizing.css → base.css. Formula changed but semantic is identical. |
| `--relative-Xpx` (1–64) | **Moved** from sizing.css → base.css. Formula changed but semantic is identical. |
| `--size-3xs` through `--size-3xl` | **Simplified.** Now use `var(--Xpx)` instead of computing from `--base-*`. |
| `--padding-3xs` through `--padding-3xl` | **Formula changed.** Now `calc(var(--size-ratio) * N * 1em)` — ~14% larger at base 14/16. |
| `--gap-3xs` through `--gap-3xl` | **Changed.** Now aliases of `--padding-*` (were independent em values). |
| `--gap` | **Kept.** Still `var(--gap-m)`. |
| `--padding` | **Kept.** Still `var(--padding-m)`. |
| `--text-3xs` through `--text-3xl` | **Changed.** From `px` to `var(--relative-Xpx)` (now em-based). |
| `--title-3xs` through `--title-3xl` | **Changed.** From `px` to `var(--relative-Xpx)` (now em-based). |
| `--h1` through `--h5` | **Changed.** From raw `px` to `var(--Xpx)` (now rem-based). `--h4` bumped from 15→16px. |
| `--line-height` | **Changed.** From `calc(20/14)` to `calc(20/var(--reference-size))`. |
| `--bold` | **Changed.** From `bold` to `600`. |

---

## Usages Found in Codebase

### Impact Summary

| Token Pattern | Files | Usages | Priority |
|--------------|-------|--------|----------|
| bare `--spacing` | ~55 files | ~105 | **HIGH** — context-dependent replacement |
| `--vertically-spaced` | ~65 files | ~88 | **HIGH** — mostly `margin: var(--vertically-spaced)` |
| `--spacing-xs` | ~25 files | ~38 | **MEDIUM** — straightforward swap to `--margin-xs` |
| `--spacing-{name}` (micro–massive) | 3 files | ~18 | **LOW** — divider component only |
| `--relative-{name}` (medium/large/huge) | 5 files | 8 | **LOW** — button + segment |
| `--gap-{name}` (small/large) | 1 file | 3 | **LOW** |
| `--padding-{name}` (large) | 1 file | 1 | **LOW** |
| `--rectangular-tight-padding` | 1 file | 1 | **LOW** — tooltip |
| `--space-2` | 1 file | 1 | **LOW** — tooltip |
| `--font-size` (bare) | 1 file | 1 | **LOW** — global/base.css |
| `--text-medium` | 1 file | 1 | **LOW** |
| `--horizontally-spaced` | 0 files | 0 | — |
| `--centered` | 0 files | 0 | — |
| brevity aliases (--xs, --m, etc.) | 0 files | 0 | — |
| `--size-*-em` | 0 files | 0 | — |
| `--base-3xs` through `--base-3xl` | 0 files | 0 | — |
| `--text-size` / `--title-size` | 0 files | 0 | — |
| `--section-margin` | 0 files | 0 | — |

### Context-dependent: bare `--spacing`

The bare `--spacing` token was used for margins, padding, and gaps interchangeably. Each usage needs context-aware replacement:

- `margin: var(--spacing) ...` → `var(--margin) ...`
- `padding: var(--spacing)` → `var(--padding)` or `var(--margin)` depending on whether it's component padding (em) or layout padding (rem)
- `gap: var(--spacing)` → `var(--gap)` (if inside a component) or `var(--gutter)` (if layout)
- `calc(var(--spacing) * N)` → `calc(var(--margin) * N)` for layout, or `calc(var(--padding) * N)` for component

### Critical src/ files (production components)

> **Important:** `*-bundle.css` files are **build-generated** by `build-ui-deps` (they flatten `@import` chains). Never edit them directly. Edit only the source theme files under `css/theme/`. Run `npm run build:ui-deps` after to regenerate bundles.

| Source File (edit this) | Tokens Used | Count |
|------|------------|-------|
| `src/primitives/divider/css/theme/variations/spacing-variables.css` | `--spacing-{name}` | 9 |
| `src/primitives/card/css/theme/content/card-variables.css` | `--spacing` | 2 |
| `src/primitives/card/css/theme/content/icon-variables.css` | `--spacing-xs` | 1 |
| `src/primitives/card/css/theme/content/meta-variables.css` | `--spacing-xs` | 1 |
| `src/primitives/card/css/theme/plural/cards-variables.css` | `--spacing` | 1 |
| `src/primitives/card/css/theme/variations/horizontal-variables.css` | `--spacing` | 1 |
| `src/primitives/segment/css/theme/content/segment-variables.css` | `--spacing`, `--relative-medium` | 2 |
| `src/primitives/segment/css/theme/variations/padded-variables.css` | `--relative-large`, `--relative-huge` | 2 |
| `src/primitives/segment/css/theme/variations/floated-variables.css` | `--spacing` | 1 |
| `src/primitives/button/css/theme/content/label-variables.css` | `--relative-medium` | 1 |
| `src/primitives/menu/css/theme/content/menu-variables.css` | `--vertically-spaced` | 1 |
| `src/components/nav-menu/nav-menu.css` | `--spacing-xs` | 6 |
| `src/components/global-search/global-search.css` | `--spacing` | 1 |
| `src/components/mobile-menu-toggle/mobile-menu-toggle.css` | `--spacing` | 1 |
| `src/components/theme-switcher/theme-switcher.css` | `--spacing` | 1 |
| `src/behaviors/tooltip/tooltip.css` | `--rectangular-tight-padding`, `--space-2` | 2 |
| `src/css/global/base.css` | `--font-size` | 1 |

### docs/ files (most affected)

The docs site uses `--vertically-spaced` and bare `--spacing` pervasively across ~100+ example/component CSS files. Most are simple mechanical replacements:

- `margin: var(--vertically-spaced)` → `margin: var(--vertical-margin)` (dozens of files)
- `margin: var(--spacing) ...` / `margin-*: var(--spacing)` → `var(--margin)` variants
- `margin-*: var(--spacing-xs)` → `var(--margin-xs)`
- A few `gap:` and `padding:` usages need case-by-case assessment
