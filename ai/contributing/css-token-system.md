---
title: CSS Token System Architecture
description: How Semantic UI's design token system is structured and how to extend it. Covers the two-base sizing system, OKLCH color generation, theme-aware computed tokens, cascade layers, and file organization.
keywords: [CSS tokens, design tokens, OKLCH, theming, dark mode, light mode, base-size, base-spacing, custom properties, cascade layers, color scales, sizing, spacing, typography]
audience: contributing
skill: css-token-system
---

# CSS Token System Architecture

> **Skill:** `sui:css-token-system`
> **Purpose:** Deep knowledge of how SUI's CSS tokens are computed so you can extend the system using the same principles
> **Last Updated:** 2026-03-05

**Golden rule: Tokens are computed from base values through formulas. Extend by adding to the formula chain, not by hardcoding values.**

Every token in the system traces back to a small set of base primitives (`--base-size`, `--base-spacing`, base OKLCH colors, etc.) through deterministic `calc()` or relative color expressions. When you add a new token, it must participate in this chain so it scales, themes, and adapts automatically.

---

## File Architecture

Tokens are organized in three layers, imported via CSS cascade layers in `src/css/tokens.css`:

```
src/css/
  tokens.css              # Import manifest with @layer declarations
  tokens/
    base.css              # Base units, --Xpx, --relative-Xpx
    sizing.css            # Component size scale (--size-3xs to --size-3xl)
    spacing.css           # Padding/gap (em), margin/spacing (rem)
    typography.css        # Font families, weights, text/title/heading scales
    colors.css            # Color primitives, opacity scales, lightness/chroma curves
    brand.css             # --primary-color, --secondary-color, semantic state colors
    border-radius.css     # Border radius scale + aliases
    breakpoints.css       # Responsive breakpoints
    z-index.css           # Layer stacking (page, float, overlay)
    motion.css            # Duration, easing, transition shorthand
    states.css            # Hover/focus/active lightness modifiers, focus ring
    forms.css             # Input padding
    loader.css            # Loader size, speed, positioning
    scrollbars.css        # Scrollbar dimensions and settings
    layout.css            # Box model, containers, grid columns
    themes/
      light/              # Theme-specific base values (light is default)
        colors.css        # --standard-color, --lightness-N, --chroma-N
        borders.css       # Border LCH base values
        surfaces.css      # UI surface hue/chroma/lightness
        shading.css       # Transparent overlay colors
        typography.css    # Link colors
        states.css        # Focus border, selection colors
      dark/               # Dark mode overrides
        colors.css        # Reverses lightness/chroma scales, swaps standard/inverted
        borders.css       # Swaps border color base
        typography.css    # Hand-tuned text/link colors for dark contrast
        shadows.css       # Boosted shadows for dark mode visibility
      computed/           # Derived tokens that recompute per theme boundary
        colors.css        # Standard/inverted alpha scales, per-color tonal palettes
        brand.css         # Primary/secondary/semantic tonal palettes
        typography.css    # Text color tokens (--text-color, --muted-text-color, etc.)
        borders.css       # Border color tokens and shorthand
        surfaces.css      # UI background tokens
        shadows.css       # Shadow tokens
        shading.css       # Gradient tokens
        scrollbars.css    # Scrollbar color tokens
        forms.css         # Form focus tokens
        loader.css        # Loader color tokens
```

### Which file to open

| You want to... | Open |
|----------------|------|
| Change the base font size or spacing | `base.css` |
| Add a new component size step | `sizing.css` |
| Add a new spacing token | `spacing.css` |
| Change a font family or add a text size | `typography.css` |
| Change a base color's hue | `colors.css` |
| Add a semantic brand alias | `brand.css` |
| Add a theme-aware computed token | `themes/computed/{category}.css` |
| Override a value specifically for dark mode | `themes/dark/{category}.css` |
| Tune the lightness/chroma curve | `themes/light/colors.css` + `themes/dark/colors.css` |

---

## The Two-Base Sizing System

SUI separates font sizing from spacing into two independent base values:

```css
--base-size: 14;      /* Font size base (px) */
--base-spacing: 16;   /* Spacing/rem base (px) */
--size-ratio: calc(var(--base-spacing) / var(--base-size));  /* 1.1429 */
```

This split was an empirically-driven decision. Research across 22 major frameworks showed the industry converged on 14px as the optimal body text size and 4px/16px as the natural spacing grid — independently. SUI parameterizes both so a theme author can adjust either without breaking the other.

- `--em-size` sets the document root font-size to `--base-spacing * 1px`, making `1rem = --base-spacing px`
- `--page-size` sets the body font-size to `--base-size * 1px`, making `1em` match the text size in body context
- `--size-ratio` bridges them: em-based spacing tokens multiply by this ratio so padding aligns to the spacing grid even though the font is a different size

### Three unit types

The system produces three families of pixel-equivalent tokens from a single `--reference-size: 14`:

| Token | Unit | Formula | Scales with | Use for |
|-------|------|---------|-------------|---------|
| `--Xpx` | rem | `round(base-size * X / ref, 1) / base-spacing * 1rem` | Site theme (`--base-size`) | Fixed sizes: page headings, icon sizes, borders |
| `--relative-Xpx` | em | `X / ref * 1em` | Theme AND component font-size | Component-internal: input padding, icon offsets |
| Raw `rem` | rem | Direct `rem` values | Site theme (`--base-spacing`) | Layout: margins between components, section gaps |

```css
/* ❌ WRONG - hardcoded pixel value, doesn't scale */
font-size: 18px;

/* ✅ RIGHT - scales with --base-size via the --Xpx token */
font-size: var(--18px);

/* ❌ WRONG - raw em without the scaling formula */
padding: 0.5em;

/* ✅ RIGHT - em-based spacing through the size-ratio bridge */
padding: var(--padding-xs);
```

---

## Spacing

Spacing tokens split into two domains based on what should scale with component size:

### Component spacing (em-based) — ratchets with font-size

`--padding-*`, `--gap-*`, and `--indent-*` are identical values with different names to communicate intent. They use em units scaled through `--size-ratio`:

```css
--padding-m: calc(var(--size-ratio) * 1 * 1em);  /* 16px @ 14px font */
```

When a component changes size (e.g. `.large.button` sets a larger font-size), all em-based padding scales proportionally. The scale runs from `3xs` to `3xl`.

### Layout spacing (rem-based) — does not ratchet

`--margin-*`, `--spacing-*`, and `--gutter-*` are identical values for structural space between components. They use direct rem values:

```css
--margin-m: 1rem;  /* 16px */
```

These don't change when a component changes size — a large button still has the same margin as a medium button. The scale extends to `5xl` for page-level sections.

```css
/* ❌ WRONG - using layout spacing for component-internal padding */
padding: var(--margin-m);

/* ✅ RIGHT - em-based token for component internals */
padding: var(--padding-m);

/* ❌ WRONG - using component spacing for space between components */
margin-bottom: var(--padding-l);

/* ✅ RIGHT - rem-based token for layout spacing */
margin-bottom: var(--margin-l);
```

---

## Sizing

Component sizes are defined as `--size-*` tokens that map to `--Xpx` values. These set a component's base font-size, which then causes all em-based internal spacing to ratchet:

```css
--size-3xs: var(--10px);   --mini:    var(--size-3xs);
--size-2xs: var(--11px);   --tiny:    var(--size-2xs);
--size-xs:  var(--12px);   --small:   var(--size-xs);
--size-m:   var(--14px);   --medium:  var(--size-m);
--size-l:   var(--16px);   --large:   var(--size-l);
--size-xl:  var(--18px);   --big:     var(--size-xl);
--size-2xl: var(--20px);   --huge:    var(--size-2xl);
--size-3xl: var(--24px);   --massive: var(--size-3xl);
```

Natural language aliases (`--mini` through `--massive`) exist for component specs.

---

## Typography

Three text sizing scales serve different purposes:

| Scale | Unit | Use for | Range |
|-------|------|---------|-------|
| `--text-*` | em (`--relative-Xpx`) | Text inside components, ratchets with component size | `3xs`-`3xl` |
| `--title-*` | em (`--relative-Xpx`) | Component headings (card titles, modal headers), wider jumps | `3xs`-`3xl` |
| `--h1`-`--h5` | rem (`--Xpx`) | Page-level document headings, fixed within page context | 28px-14px @ base 14 |

```css
/* ❌ WRONG - using --size-* for text inside a component */
font-size: var(--size-l);

/* ✅ RIGHT - --text-* ratchets with the component */
font-size: var(--text-l);
```

---

## Color System

### Base colors and the generative pipeline

Each named color is a single OKLCH value in `colors.css`:

```css
--red: oklch(0.59 0.27 28);
--blue: oklch(0.62 0.17 238.00);
```

From this single value, the system generates a full 0-100 tonal palette via relative color syntax in `themes/computed/colors.css`:

```css
--blue-0:  oklch(from var(--blue) calc(l * var(--blue-lightness-0))  calc(c * var(--blue-chroma-0))  h);
--blue-50: var(--blue);  /* Base color, no transform */
--blue-100: oklch(from var(--blue) calc(l * var(--blue-lightness-100)) calc(c * var(--blue-chroma-100)) h);
```

The lightness and chroma multipliers are defined as curves in `colors.css` (`--base-lightness-*`, `--base-chroma-*`). Lower steps are lighter/less saturated, higher steps are darker/less saturated, with the base color at step 50. The specific curve values are subject to tuning before 1.0.

**Changing `--blue: oklch(...)` to a different hue automatically regenerates the entire tonal palette, including all semantic aliases (`--blue-text-color`, `--blue-border-color`, `--blue-background-color`).**

### Per-color tuning

Every color gets its own lightness and chroma indirection layer:

```css
--red-lightness-70: var(--lightness-70);  /* Default: pass through */
--red-hue-shift-70: 6;                    /* Red-specific: shift hue to prevent orange drift */
```

Most colors pass straight through to the shared scale. The per-color layer exists because some hues need correction at certain steps — red shifts its hue at dark steps to avoid looking orange. Once one color needs this, the architecture supports it uniformly for all colors.

### Opacity scales

Black and white each have three scale families in `colors.css`:

| Family | Example | Use for |
|--------|---------|---------|
| Alpha | `--black-50` | Semi-transparent overlays that composite with background |
| Solid | `--black-solid-50` | Opaque equivalents via `color-mix` for contexts that can't use alpha |
| LCH | `--black-lch: 0 0 0` | Building block for OKLCH expressions |

### Semantic color aliases

`colors.css` maps tonal steps to semantic roles for each named color:

```css
--red-text-color: var(--red-70);
--red-background-color: var(--red-0);
--red-border-color: var(--red-30);
--red-header-color: var(--red-80);
```

---

## Theme System

### How themes work

Light and dark themes set "working variables" that computed tokens read from. The mechanism has three parts:

**1. Theme files set working variables** (`themes/light/colors.css`, `themes/dark/colors.css`):

```css
/* Light: straight-through */
--standard-color: var(--black-lch);
--lightness-0: var(--base-lightness-0);    /* Lightest */
--lightness-100: var(--base-lightness-100); /* Darkest */

/* Dark: reversed */
--standard-color: var(--white-lch);
--lightness-0: var(--base-lightness-100);   /* Was darkest, now maps to lightest step */
--lightness-100: var(--base-lightness-0);   /* Was lightest, now maps to darkest step */
```

**2. Computed tokens read working variables** (`themes/computed/`):

```css
--text-color: var(--standard-80);
--red-0: oklch(from var(--red) calc(l * var(--red-lightness-0)) ...);
```

**3. Standard/inverted abstraction** provides theme-aware black/white:

| Token | Light mode | Dark mode |
|-------|-----------|-----------|
| `--standard-*` | Black at N% | White at N% |
| `--inverted-*` | White at N% | Black at N% |
| `--standard-solid-*` | Opaque black at N% | Opaque white at N% |

### Invariant tokens

Tokens suffixed with `-invariant` use the base scales directly, bypassing theme inversion. Use these when a color must look the same regardless of theme:

```css
--red-70-invariant: oklch(from var(--red) calc(l * var(--lightness-70-invariant)) ...);
```

### Theme nesting

The selector patterns support arbitrary nesting of themes:

```html
<html theme="dark">
  <ui-component light>     <!-- re-enters light theme -->
    <ui-sub dark>           <!-- re-enters dark theme -->
    </ui-sub>
  </ui-component>
</html>
```

Computed tokens use `:root, .theme, [light], [dark], [theme]` as selectors to recompute at every theme boundary. The exact cascade resolution between theme layers and computed layers is an area of active refinement — when working on theme boundary behavior, test in the browser rather than reasoning about cascade order from source.

### Theme selector patterns

| Context | Selector |
|---------|----------|
| Light theme | `html, .light.theme.theme, [light][light], [theme][theme="light"]` |
| Dark theme | `html.dark, .dark.theme.theme, [dark][dark], [theme][theme="dark"]` |
| Computed (all themes) | `:root, .theme, [light], [dark], [theme]` |
| Global (no theme) | `:root` |

---

## Borders

Borders use a separate LCH base (`--standard-border-color`) hand-tuned for contrast rather than reusing `--standard-color`. The border system has:

- **Alpha borders** — `--border-color`, `--subtle-border-color`, `--strong-border-color` etc. at varying opacity
- **Solid borders** — `--solid-border-color` for contexts that can't use alpha
- **Shorthand tokens** — `--border: 1px solid var(--border-color)` for common patterns
- **State variants** — `--selected-border-color`, `--disabled-border-color`
- **Theme-invariant** — `--black-border-color`, `--white-border-color` don't flip

---

## Shading and Shadows

### Transparent overlays

Five intensity levels of alpha overlays defined per-theme in `themes/light/shading.css` and `themes/dark/colors.css`:

```css
--very-subtle-transparent-black  /* 2-3% */
--subtle-transparent-black       /* 3-5% */
--transparent-black              /* 5-15% */
--strong-transparent-black       /* 8-20% */
--very-strong-transparent-black  /* 15-20% */
```

Dark mode boosts these values for visibility. These are **lighting layers** (alpha compositing), not decorative color.

### Gradients

Computed from the transparent overlay tokens in `themes/computed/shading.css`. Available in four directions (vertical, inverted, angled, horizontal) at five intensity levels:

```css
--gradient: linear-gradient(var(--transparent-white), var(--transparent-black));
```

### Shadows

Text shadows, elevation shadows, inset shadows, and lip shadows in `themes/computed/shadows.css`. Dark mode overrides boost shadow intensity.

---

## Other Token Families

### Motion

```css
--duration: 0.15s;
--easing: ease;
--transition: all var(--duration) var(--easing);
```

### Z-Index

Three stacking layers with 5 sub-levels each:

| Layer | Base | Use for |
|-------|------|---------|
| `--page-layer` | 1 | In-flow page content |
| `--float-layer` | 100 | Dropdowns, tooltips, sticky elements |
| `--overlay-layer` | 1000 | Modals, drawers, toasts |

### Border Radius

Scale from `3xs` (0) to `3xl` (24px) with natural language aliases (`--border-radius-small`, etc.) and attached variants (`--top-attached-border-radius`).

### Layout

Container widths (`--text-container: 700px`, `--content-container: 960px`, `--wide-container: 1200px`), a 16-column grid system, and responsive breakpoints.

### Forms

Input padding uses `--relative-Xpx` tokens so it scales with component size:
```css
--input-padding: var(--relative-10px) var(--relative-14px);
```

---

## Naming Conventions

Token names follow consistent patterns across all families. When adding new tokens, match these conventions:

### Scale types

| Scale type | Steps | Used by | When to use |
|------------|-------|---------|-------------|
| **T-shirt** | `3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl` | sizing, padding, gap, margin, text, title, border-radius | Graduated values where the steps form a progression |
| **Intensity** | `very-subtle, subtle, [bare], strong, very-strong` | transparent overlays, gradients, borders, shadows | Strength or emphasis where the default is the middle |
| **Numeric tonal** | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | colors, lightness, chroma, opacity | Continuous scales derived from a base value |
| **Named layers** | `{layer}, {layer}-1` through `{layer}-5` | z-index | Discrete stacking contexts |

### Bare defaults

Every scale provides an unsuffixed token that maps to `-m` or the most common value:

```css
--padding: var(--padding-m);
--margin: var(--margin-m);
--border-radius: var(--border-radius-m);
--gap: var(--gap-m);
--transition: all var(--duration) var(--easing);  /* composite default */
```

### Intentional aliases

When the same values serve different semantic purposes, create aliases with names that communicate intent:

```css
/* Same scale, different intent */
--padding-m / --gap-m / --indent-m     /* component spacing (em) */
--margin-m / --spacing-m / --gutter-m  /* layout spacing (rem) */
--mini / --tiny / --small / ...        /* natural language for --size-3xs etc. */
```

### Directional variants

Use `top-`, `bottom-`, `left-`, `right-`, `vertical-`, `horizontal-` prefixes:

```css
--top-padding:      var(--padding) 0 0 0;
--vertical-padding: var(--padding) 0;
```

### Theme polarity

Theme-aware pairs use `standard-*` / `inverted-*`. Values that must not flip use the `-invariant` suffix:

```css
--standard-80   /* black 80% in light, white 80% in dark */
--inverted-80   /* white 80% in light, black 80% in dark */
--red-70-invariant  /* same red-70 regardless of theme */
```

### Semantic role suffixes

Color families generate consistent role tokens: `-text-color`, `-background-color`, `-border-color`, `-header-color`. State variants append `-hover`, `-pressed`, `-disabled`:

```css
--red-text-color           /* base role */
--red-text-color-hover     /* state variant */
--red-text-color-disabled  /* state variant */
```

---

## Extending the Token System

### Adding a new global token

1. Create or edit a file in `src/css/tokens/`
2. Define under `:root` — these are theme-independent primitives
3. Add the import to `src/css/tokens.css` with an appropriate `layer(tokens.{name})`
4. If the value should scale with base-size, express it using `--Xpx` or `--relative-Xpx` tokens
5. If it's a spacing value, decide: component-internal (em-based) or layout (rem-based)
6. Pick the scale type that fits: t-shirt for graduated values, intensity for strength/emphasis
7. Provide a bare default at `-m` or the most common value

### Adding a theme-aware computed token

1. Put the token in the appropriate `themes/computed/{category}.css`
2. Use the computed selector: `:root, .theme, [light], [dark], [theme]`
3. Reference working variables (`--standard-*`, `--lightness-*`, `--inverted-*`) — never raw `--black-*` or `--white-*` directly
4. If the token needs different values in dark mode, test the cascade behavior in the browser

```css
/* ❌ WRONG - hardcoded for light mode */
--my-surface: oklch(0 0 0 / 5%);

/* ✅ RIGHT - uses theme-aware working variable */
--my-surface: var(--standard-5);
```

### Adding a brand/semantic color scale

Follow the pattern in `themes/computed/brand.css` — reference `--{name}-color` as base, apply `--lightness-*` and `--chroma-*` scales:

```css
--my-semantic-50: var(--my-semantic-color);
--my-semantic-70: oklch(from var(--my-semantic-color) calc(l * var(--lightness-70)) calc(c * var(--chroma-70)) h);
```

---

## Quick Reference

### Formulas

| Token family | Formula |
|-------------|---------|
| `--Xpx` | `round(base-size * X / ref, 1) / base-spacing * 1rem` |
| `--relative-Xpx` | `X / ref * 1em` |
| `--padding-*` | `size-ratio * multiplier * 1em` |
| `--margin-*` | Direct `rem` values |
| Color tonal step | `oklch(from BASE calc(l * LIGHTNESS) calc(c * CHROMA) h)` |
| Standard alpha | `oklch(var(--standard-color) / N%)` |

### Cascade layer order

```
tokens.base → tokens.sizing → tokens.spacing → tokens.typography →
tokens.colors → tokens.brand → ... →
tokens.themes.light.* → tokens.themes.dark.* → tokens.themes.computed.*
```

### Unit selection

| Context | Use | Why |
|---------|-----|-----|
| Component font-size | `--size-*` (rem via `--Xpx`) | Sets the em context, scales with theme only |
| Text inside component | `--text-*` (em via `--relative-Xpx`) | Ratchets with component size |
| Component padding/gap | `--padding-*` / `--gap-*` (em) | Ratchets with component size |
| Space between components | `--margin-*` / `--spacing-*` (rem) | Doesn't ratchet, stays on grid |
| Fixed pixel-precise value | `--Xpx` (rem) | Scales with theme, not component |
| Component-internal precise value | `--relative-Xpx` (em) | Scales with theme AND component |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Component Tailwind** | Styling components using Tailwind with SUI tokens |
| **Mental Model** | Understanding the overall SUI architecture |
