---
title: CSS Token System Internals
description: Comprehensive contributor reference for the Semantic UI CSS token system — file organization, computation cascade, color generation, sizing math, theme inversion, Shadow DOM delivery, and how to safely add or modify tokens.
keywords: [tokens, CSS custom properties, OKLCH, lightness scale, chroma, standard inverted, base size, base spacing, rem, em, relative-px, shadow DOM, theme cascade, dark mode, light mode, computed tokens, color scale, brand tokens, invariant]
audience: contributing
skill: css-token-system
---

# CSS Token System Internals

> **Skill:** `sui:css-token-system`
> **Purpose:** Contributor-level reference for understanding and modifying the Semantic UI design token architecture from source

---

## Table of Contents

| Section | Approx. Line | What You'll Find |
|---------|-------------|------------------|
| [Golden Rule](#golden-rule) | ~39 | The single most important principle |
| [File Organization](#file-organization) | ~45 | Directory tree, what lives where |
| [Import Order and Layer Cascade](#import-order-and-layer-cascade) | ~102 | `tokens.css` orchestration, CSS layer names |
| [Computation Contexts](#computation-contexts) | ~155 | Root, light, dark, computed — why four contexts exist |
| [Base Size Scaling](#base-size-scaling) | ~223 | `--base-size`, `--base-spacing`, `--reference-size`, the three px token families |
| [Spacing System](#spacing-system) | ~318 | Padding (em) vs margin (rem), alias families, the ratchet effect |
| [Color Generation Pipeline](#color-generation-pipeline) | ~372 | OKLCH relative color syntax, lightness/chroma scales, shade generation |
| [Standard / Inverted Pattern](#standard--inverted-pattern) | ~475 | The theme-polarity abstraction and why it exists |
| [Invariant Colors](#invariant-colors) | ~530 | Colors that must NOT invert between themes |
| [Brand and Semantic Colors](#brand-and-semantic-colors) | ~560 | Primary/secondary, positive/negative/info/warning |
| [Component Tokens](#component-tokens) | ~617 | How primitives define `:host` variables that reference global tokens |
| [Shadow DOM Theme Cascade](#shadow-dom-theme-cascade) | ~701 | How tokens reach Shadow DOM, selector patterns, `--dark-mode` |
| [Adding or Modifying Tokens](#adding-or-modifying-tokens) | ~772 | Step-by-step procedures, naming conventions |
| [Common Mistakes](#common-mistakes) | ~816 | Anti-patterns with corrections |
| [Quick Reference](#quick-reference) | ~890 | Condensed lookup tables |
| [Related Skills](#related-skills) | ~989 | Adjacent skills |

---

## Golden Rule

**Every visual value in the system traces back to either `--base-size` (for type/sizing) or `--base-spacing` (for layout). If your new token doesn't connect to one of these roots — or to a theme-aware intermediate like `--standard-color` or `--lightness-N` — it will not scale with the design system and will break when themes change.**

---

## File Organization

```
src/css/
  all.css                          # Entry point: global.css + tokens.css
  global.css                       # CSS reset + base styles (layer: global)
  tokens.css                       # Orchestrator — imports every token file with layer assignments

  tokens/
    base.css                       # --base-size, --base-spacing, --Npx, --relative-Npx
    sizing.css                     # --size-3xs..3xl, --mini..--massive
    spacing.css                    # --padding-*, --gap-*, --margin-*, --spacing-*, --gutter-*
    typography.css                 # Fonts, weights, line heights, --text-*, --title-*, --h1..h5
    colors.css                     # Base OKLCH hues, black/white scales, lightness/chroma curves
    brand.css                      # --primary-color, --secondary-color, semantic state aliases
    border-radius.css              # --border-radius-3xs..3xl, natural-language aliases
    breakpoints.css                # --mobile-breakpoint through --widescreen-monitor-breakpoint
    layout.css                     # Container widths, grid column fractions
    motion.css                     # --duration, --easing, --transition
    states.css                     # --hover-lightness, --disabled-opacity, focus ring
    forms.css                      # --input-padding
    loader.css                     # Loader size/speed
    scrollbars.css                 # Custom scrollbar dimensions
    z-index.css                    # --page-layer, --float-layer, --overlay-layer

    themes/
      light/
        colors.css                 # Standard=black, inverted=white, lightness pass-through
        typography.css             # --link-color
        borders.css                # --standard-border-color = black-based
        shading.css                # Alpha overlays tuned for light backgrounds
        surfaces.css               # --ui-hue, --ui-emphasis
        states.css                 # --form-focused-border-color, selection colors

      dark/
        colors.css                 # Standard=white, inverted=black, lightness INVERTED
        typography.css             # --text-color boosted, --link-color adjusted
        borders.css                # --standard-border-color = white-based
        shadows.css                # Shadow intensity boosted for dark backgrounds

      computed/
        colors.css                 # --standard-N, --inverted-N alpha scales; all color shades (--red-0..100 etc.)
        brand.css                  # --primary-0..100, --secondary-0..100, semantic state shades
        typography.css             # --text-color, --header-color, all state text colors
        borders.css                # --border-color, --border shorthand, strength variants
        shadows.css                # --shadow, --floating-shadow, lip shadows
        surfaces.css               # --ui-background, --ui-background-emphasis
        shading.css                # --gradient, --inverted-gradient, angle/direction variants
        scrollbars.css             # Theme-aware track/thumb colors
        loader.css                 # Theme-aware loader colors
        forms.css                  # --form-focused-muted-border-color
```

**Key structural insight**: The `tokens/` directory contains theme-invariant primitives. The `themes/` subdirectory is split into three contexts — light, dark, and computed — that the cascade evaluates in order.

---

## Import Order and Layer Cascade

The file `src/css/tokens.css` is the orchestrator. It defines the exact CSS layer ordering that determines how tokens resolve. The import order is:

```css
/* 1. Global tokens — theme-invariant primitives */
@import url('./tokens/base.css')        layer(tokens.base);
@import url('./tokens/sizing.css')      layer(tokens.sizing);
@import url('./tokens/spacing.css')     layer(tokens.spacing);
@import url('./tokens/typography.css')  layer(tokens.typography);
@import url('./tokens/layout.css')      layer(tokens.layout);
@import url('./tokens/colors.css')      layer(tokens.colors);
@import url('./tokens/brand.css')       layer(tokens.brand);
@import url('./tokens/border-radius.css') layer(tokens.borderRadius);
@import url('./tokens/breakpoints.css') layer(tokens.breakpoints);
@import url('./tokens/z-index.css')     layer(tokens.zIndex);
@import url('./tokens/motion.css')      layer(tokens.motion);
@import url('./tokens/states.css')      layer(tokens.states);
@import url('./tokens/forms.css')       layer(tokens.forms);
@import url('./tokens/loader.css')      layer(tokens.loader);
@import url('./tokens/scrollbars.css')  layer(tokens.scrollbars);

/* 2. Light theme — sets theme-polarity variables */
@import url('./tokens/themes/light/colors.css')     layer(tokens.themes.light.colors);
@import url('./tokens/themes/light/typography.css')  layer(tokens.themes.light.typography);
@import url('./tokens/themes/light/borders.css')     layer(tokens.themes.light.borders);
@import url('./tokens/themes/light/shading.css')     layer(tokens.themes.light.shading);
@import url('./tokens/themes/light/surfaces.css')    layer(tokens.themes.light.surfaces);
@import url('./tokens/themes/light/states.css')      layer(tokens.themes.light.states);

/* 3. Dark theme — overrides polarity variables */
@import url('./tokens/themes/dark/colors.css')      layer(tokens.themes.dark.colors);
@import url('./tokens/themes/dark/typography.css')   layer(tokens.themes.dark.typography);
@import url('./tokens/themes/dark/borders.css')      layer(tokens.themes.dark.borders);
@import url('./tokens/themes/dark/shadows.css')      layer(tokens.themes.dark.shadows);

/* 4. Computed — derives final tokens from polarity variables */
@import url('./tokens/themes/computed/colors.css')     layer(tokens.themes.computed.colors);
@import url('./tokens/themes/computed/brand.css')      layer(tokens.themes.computed.brand);
@import url('./tokens/themes/computed/surfaces.css')   layer(tokens.themes.computed.surfaces);
@import url('./tokens/themes/computed/typography.css')  layer(tokens.themes.computed.typography);
@import url('./tokens/themes/computed/borders.css')    layer(tokens.themes.computed.borders);
@import url('./tokens/themes/computed/shadows.css')    layer(tokens.themes.computed.shadows);
@import url('./tokens/themes/computed/shading.css')    layer(tokens.themes.computed.shading);
@import url('./tokens/themes/computed/scrollbars.css') layer(tokens.themes.computed.scrollbars);
@import url('./tokens/themes/computed/loader.css')     layer(tokens.themes.computed.loader);
@import url('./tokens/themes/computed/forms.css')      layer(tokens.themes.computed.forms);
```

The layer naming follows the pattern `tokens.<category>` for globals and `tokens.themes.<context>.<domain>` for theme-dependent tokens. This layer structure means computed tokens always resolve after light/dark polarity is established.

---

## Computation Contexts

The token system has four computation contexts. Understanding which context a token belongs to is the most important skill for working in this codebase.

### 1. Root (`:root`) — Theme-Invariant Primitives

Files in `tokens/` (not `themes/`). Selector: `:root`.

These tokens never change between light and dark modes. They define raw values: base units, OKLCH hues, lightness curves, size scales, spacing multipliers, breakpoints.

```css
/* tokens/base.css */
:root {
  --base-size: 14;
  --base-spacing: 16;
}

/* tokens/colors.css */
:root {
  --red: oklch(0.59 0.27 28);
  --base-lightness-50: 1.0;
  --base-chroma-50: 1.0;
}
```

### 2. Light Theme — Sets Polarity Direction

Files in `themes/light/`. Selectors: `html`, `.light.theme.theme`, `[light][light]`, `[theme][theme="light"]`.

Light is the default (targets bare `html`). It maps abstract "standard" and "inverted" to concrete black/white:

```css
--standard-color: var(--black-lch);   /* standard = black in light mode */
--inverted-color: var(--white-lch);   /* inverted = white in light mode */
--lightness-0: var(--base-lightness-0);  /* pass through unchanged */
--lightness-100: var(--base-lightness-100);
```

### 3. Dark Theme — Reverses Polarity

Files in `themes/dark/`. Selectors: `html.dark`, `.dark.theme.theme`, `[dark][dark]`, `[theme][theme="dark"]`.

Dark mode swaps standard/inverted AND reverses the lightness/chroma scales:

```css
--standard-color: var(--white-lch);   /* standard = white in dark mode */
--inverted-color: var(--black-lch);   /* inverted = black in dark mode */
--lightness-0: var(--base-lightness-100);  /* REVERSED */
--lightness-100: var(--base-lightness-0);  /* REVERSED */
```

### 4. Computed — Derives Final Values

Files in `themes/computed/`. Selector: `:root, .theme, [light], [dark], [theme]`.

These tokens reference polarity variables set by light/dark contexts. Because CSS custom properties resolve at use-time (not definition-time), the same computed token resolves differently depending on which theme context is active:

```css
/* themes/computed/typography.css */
--text-color: var(--standard-80);
/* In light mode: --standard-80 = oklch(black / 80%) → dark text */
/* In dark mode:  --standard-80 = oklch(white / 80%) → light text */
```

**Why this matters**: When adding a new token, you must place it in the correct context. A token that references `--standard-color` or `--lightness-N` belongs in computed. A token that defines a raw value belongs in root. A token that sets polarity direction belongs in light or dark.

---

## Base Size Scaling

The entire sizing system flows from two root values:

```css
--base-size: 14;      /* Controls font sizes and type */
--base-spacing: 16;   /* Controls spacing and rem base */
```

### The Reference Size

```css
--reference-size: 14;   /* The base the system was designed at — never changes */
```

All px-token formulas divide by `--reference-size`. This means: when `--base-size` equals `--reference-size` (both 14), tokens produce their nominal pixel value. When `--base-size` changes, all tokens scale proportionally.

### Three Families of Pixel Tokens

The system provides three distinct families for different scaling behaviors:

#### `--Npx` (Precise / rem-based)

Scales with `--base-size` but does NOT ratchet with component font-size.

```css
--14px: calc(round(var(--base-size) * 14 / var(--reference-size), 1) / var(--base-spacing) * 1rem);
```

**Use for**: Page headings, fixed layout values, anything that should scale with the global theme but not with component size.

```css
/* tokens/typography.css */
--h1: var(--28px);
--h2: var(--24px);
```

#### `--relative-Npx` (Relative / em-based)

Scales with `--base-size` AND ratchets with component font-size.

```css
--relative-14px: calc(14 / var(--reference-size) * 1em);
```

**Use for**: Component-internal values that must scale when a component changes size — input padding, icon offsets, internal text sizing.

```css
/* tokens/forms.css */
--input-vertical-padding: var(--relative-10px);
--input-horizontal-padding: var(--relative-14px);
```

#### `--size-*` (Component Size Scale / rem-based)

Maps to `--Npx` tokens. Sets the em context for a component.

```css
--size-3xs: var(--10px);    /* --mini */
--size-xs:  var(--12px);    /* --small */
--size-m:   var(--14px);    /* --medium (default) */
--size-l:   var(--16px);    /* --large */
--size-3xl: var(--24px);    /* --massive */
```

When a component is sized (e.g., `<ui-button large>`), its `font-size` is set to `--size-l` (rem). This creates a new em context, causing all `--relative-*` and `--padding-*` tokens inside the component to ratchet proportionally.

### The Ratchet Effect

```
                    --base-size: 14           --base-size: 16
                    component: medium         component: large (font-size: --size-l)
 --relative-10px    10px (10/14 * 1em)        11.4px (10/14 * 16px em)
 --padding-m        16px (1.143 * 1 * 1em)    18.3px (1.143 * 1 * 16px em)
 --14px             14px (rem, no ratchet)     16px (rem, scales with base only)
```

```css
/* ❌ WRONG — raw px in component CSS */
padding: 10px 14px;

/* ✅ RIGHT — relative tokens that ratchet with component size */
padding: var(--relative-10px) var(--relative-14px);
```

### The Size Ratio

```css
--size-ratio: calc(var(--base-spacing) / var(--base-size));  /* 16/14 = 1.1429 */
```

This ratio bridges the gap between the sizing grid (14px-based) and the spacing grid (16px-based). The em-based spacing tokens (`--padding-*`, `--gap-*`) multiply by `--size-ratio` so that `--padding-m` produces 16px inside a 14px-context component — aligning spacing to the 16px grid even though the type is on a 14px grid.

---

## Spacing System

### Em-Based Spacing (Component Internal)

Padding, gap, and indent tokens are em-based and ratchet with component font-size:

```css
--padding-3xs: calc(var(--size-ratio) * 0.125 * 1em);  /*  2px @ 14px */
--padding-xs:  calc(var(--size-ratio) * 0.5   * 1em);  /*  8px @ 14px */
--padding-m:   calc(var(--size-ratio) * 1     * 1em);  /* 16px @ 14px */
--padding-xl:  calc(var(--size-ratio) * 2     * 1em);  /* 32px @ 14px */
```

**Alias families**: `--gap-*` and `--indent-*` alias `--padding-*` identically. Use the name that matches intent:

| Token Family | Use For |
|-------------|---------|
| `--padding-*` | Internal component spacing (CSS `padding`) |
| `--gap-*` | Flex/grid gap between child elements |
| `--indent-*` | Text or content indentation |

### Rem-Based Spacing (Layout/Structural)

Margin, spacing, and gutter tokens are rem-based and do NOT ratchet:

```css
--margin-xs:  0.5rem;    /*   8px */
--margin-m:   1rem;      /*  16px */
--margin-xl:  2rem;      /*  32px */
--margin-4xl: 6rem;      /*  96px */
--margin-5xl: 8rem;      /* 128px */
```

The margin scale extends to 5xl (padding stops at 3xl). If you need spacing that large, you are in layout territory.

**Alias families**: `--spacing-*` and `--gutter-*` alias `--margin-*` identically.

| Token Family | Use For |
|-------------|---------|
| `--margin-*` | Space between components (CSS `margin`) |
| `--spacing-*` | Designer-facing term for inter-component distance |
| `--gutter-*` | Grid gutters and column gaps |

```css
/* ❌ WRONG — using padding tokens for layout spacing */
.section + .section { margin-top: var(--padding-xl); }

/* ✅ RIGHT — margin tokens for layout, padding tokens for component internals */
.section + .section { margin-top: var(--margin-xl); }
.card { padding: var(--padding-m); }
```

---

## Color Generation Pipeline

Colors are generated through a multi-stage pipeline using CSS relative color syntax in OKLCH.

### Stage 1: Base Hues (root)

Thirteen named colors defined as OKLCH values in `tokens/colors.css`:

```css
--red:    oklch(0.59 0.27 28);
--blue:   oklch(0.62 0.17 238.00);
--green:  oklch(0.62 0.26 145.53);
--grey:   oklch(0.57 0 0);
/* ... 13 total */
```

These are the "50" shade — the unmodified base color. Each is a single OKLCH triplet (lightness, chroma, hue).

### Stage 2: Lightness and Chroma Curves (root)

Defined in `tokens/colors.css`, these curves control how shades are generated:

```css
/* Lightness: higher = lighter, maps shade 0 (lightest) to 100 (darkest) */
--base-lightness-0:   1.66;   /* multiplied against base L */
--base-lightness-50:  1.0;    /* identity — the base color unchanged */
--base-lightness-100: 0.25;   /* very dark */

/* Chroma: bell-curve shape, most saturated at 50 */
--base-chroma-0:   0.15;   /* very desaturated */
--base-chroma-50:  1.0;    /* identity */
--base-chroma-100: 0.15;   /* very desaturated */
```

The curve is NOT linear. The lightness values are hand-tuned for perceptual uniformity in OKLCH space.

### Stage 3: Theme-Aware Lightness (light/dark)

Light mode passes through unchanged. Dark mode REVERSES the scale:

```css
/* Light: --lightness-0 = very light, --lightness-100 = very dark */
--lightness-0: var(--base-lightness-0);
--lightness-100: var(--base-lightness-100);

/* Dark: --lightness-0 = very dark, --lightness-100 = very light */
--lightness-0: var(--base-lightness-100);
--lightness-100: var(--base-lightness-0);
```

This inversion is why `--red-0` is a pale pink in light mode and a deep maroon in dark mode — the shade NUMBER stays constant but its visual appearance inverts.

### Stage 4: Per-Color Lightness/Chroma Mappings (computed)

Each color gets its own lightness and chroma mapping tokens that initially delegate to the global scale:

```css
--red-lightness-50: var(--lightness-50);
--red-chroma-50: var(--chroma-50);
```

This indirection exists so individual colors can override specific shade values. Red uses this for hue shift correction:

```css
/* Prevents dark reds from drifting toward orange */
--red-hue-shift-60: 4;
--red-hue-shift-70: 6;
--red-hue-shift-80: 8;
```

### Stage 5: Final Shade Generation (computed)

The final shade tokens use CSS relative color syntax:

```css
--red-0: oklch(from var(--red)
  calc(l * var(--red-lightness-0))
  calc(c * var(--red-chroma-0))
  h
);
--red-50: var(--red);  /* identity — no transformation */
--red-100: oklch(from var(--red)
  calc(l * var(--red-lightness-100))
  calc(c * var(--red-chroma-100))
  calc(h - var(--red-hue-shift-100, 0))
);
```

The `oklch(from ...)` syntax takes the base color, multiplies its lightness and chroma by the curve values, and optionally shifts the hue. The shade at 50 is always the unmodified base color.

### Shade Scale

```
0    5    10   20   30   40   50   60   70   80   90   95   100
^                             ^                              ^
lightest                    base                         darkest
(in light mode)            color                    (in light mode)
```

In dark mode, the visual meaning flips: shade 0 becomes the darkest and shade 100 becomes the lightest, because the lightness multipliers are swapped.

---

## Standard / Inverted Pattern

This is the core theme abstraction. Rather than writing separate light and dark values for every semantic token, the system uses two meta-variables that swap polarity:

```css
/* Light mode */
--standard-color: var(--black-lch);   /* "foreground-direction" */
--inverted-color: var(--white-lch);   /* "background-direction" */

/* Dark mode */
--standard-color: var(--white-lch);   /* swapped */
--inverted-color: var(--black-lch);   /* swapped */
```

Computed tokens then reference `--standard-*` and `--inverted-*`:

```css
/* Computed — resolves based on active theme */
--text-color: var(--standard-80);           /* 80% opacity foreground */
--inverted-text-color: var(--inverted-90);  /* 90% opacity background */
--border-color: oklch(var(--standard-border-color) / 15%);
```

### Alpha Scales

The standard/inverted pattern produces alpha-based opacity scales:

```css
--standard-5:  oklch(var(--standard-color) / 5%);
--standard-50: oklch(var(--standard-color) / 50%);
--standard-80: oklch(var(--standard-color) / 80%);
```

### Solid Scales

For contexts where transparency is undesirable (overlapping elements, performance), solid equivalents exist using `color-mix`:

```css
/* Light mode */
--standard-solid-10: var(--black-solid-10);  /* color-mix(in srgb, black 10%, white) */

/* Dark mode */
--standard-solid-10: var(--white-solid-10);  /* color-mix(in srgb, white 10%, black) */
```

```css
/* ❌ WRONG — hardcoded black alpha, breaks in dark mode */
background: rgba(0, 0, 0, 0.05);

/* ✅ RIGHT — standard token, automatically inverts */
background: var(--standard-solid-5);
```

---

## Invariant Colors

Some colors must NOT invert between themes — a red error badge should look the same red regardless of theme. The system provides invariant versions:

```css
--lightness-0-invariant: var(--base-lightness-0);    /* always light-mode mapping */
--lightness-100-invariant: var(--base-lightness-100); /* never inverted */

--red-50-invariant: var(--red);  /* the base color, always */
--red-80-invariant: oklch(from var(--red)
  calc(l * var(--lightness-80-invariant))
  calc(c * var(--chroma-80-invariant))
  h
);
```

Invariant tokens are generated for red, blue, primary, and secondary in the computed context. They use `--lightness-N-invariant` and `--chroma-N-invariant` which always point to `--base-lightness-N` / `--base-chroma-N` without the dark mode reversal.

```css
/* ❌ WRONG — this red inverts in dark mode */
color: var(--red-80);

/* ✅ RIGHT — this red stays constant across themes */
color: var(--red-80-invariant);
```

Use invariant colors sparingly. Most UI should follow the theme. Invariant colors are for: status indicators, brand marks, color swatches, and accessibility-critical fixed-contrast elements.

---

## Brand and Semantic Colors

### Brand Colors

Defined in `tokens/brand.css`, these alias named colors to semantic roles:

```css
--primary-color: var(--blue);
--secondary-color: var(--slate);
```

The computed context then generates full shade scales:

```css
--primary-0: oklch(from var(--primary-color) calc(l * var(--lightness-0)) calc(c * var(--chroma-0)) h);
--primary-50: var(--primary-color);
--primary-100: oklch(from var(--primary-color) calc(l * var(--lightness-100)) calc(c * var(--chroma-100)) h);
```

Plus semantic text/background/border aliases:

```css
--primary-text-color: var(--primary-70);
--primary-text-color-hover: var(--primary-80);
--primary-text-color-disabled: var(--primary-40);
```

### Semantic State Colors

```css
--positive-color: var(--green);
--negative-color: var(--red);
--info-color: var(--teal);
--warning-color: var(--orange);
```

Each gets a full shade scale and semantic aliases:

```css
--positive-background-color: var(--positive-5);
--positive-border-color: var(--positive-20);
--positive-header-color: var(--positive-90);
--positive-text-color: var(--positive-70);
```

### Changing Brand Colors

To rebrand, override `--primary-color` at `:root`. The entire shade scale, all semantic aliases, and all component tokens that reference them automatically update:

```css
:root {
  --primary-color: oklch(0.59 0.27 28); /* red as primary */
}
```

---

## Component Tokens

Primitives define their own tokens in `:host` scope inside `css/theme/` directories. These tokens reference global tokens to connect to the design system.

### File Structure

Each primitive has a theme orchestrator file:

```css
/* src/primitives/button/css/theme/button-theme.css */
@import url('./content/button-variables.css') layer(button.theme.content.button);
@import url('./types/emphasis-variables.css') layer(button.theme.types.emphasis);
@import url('./states/hover-variables.css') layer(button.theme.states.hover);
@import url('./variations/sizing-variables.css') layer(button.theme.variations.sizing);
/* ... */
```

### Component Token Pattern

Component tokens use `:host` scope and reference global tokens:

```css
/* content/button-variables.css */
:host {
  --button-vertical-padding: var(--input-vertical-padding);   /* → global form token */
  --button-font-family: var(--page-font);                     /* → global typography */
  --button-font-weight: var(--bold);                          /* → global weight */
  --button-text-color: var(--black-80);                       /* → global color */
  --button-border-radius: var(--border-radius);               /* → global radius */
  --button-background-image: var(--subtle-gradient);          /* → computed shading */
  --button-transition-duration: var(--duration);              /* → global motion */
}
```

### Size Scaling in Components

Components map named sizes to the global size scale:

```css
/* variations/sizing-variables.css */
:host {
  --button-mini: var(--mini);       /* → var(--size-3xs) → var(--10px) */
  --button-small: var(--small);     /* → var(--size-xs)  → var(--12px) */
  --button-medium: inherit;         /* default, inherits page font-size */
  --button-large: var(--large);     /* → var(--size-l)   → var(--16px) */
  --button-massive: var(--massive); /* → var(--size-3xl) → var(--24px) */
}
```

### Emphasis Types and State Colors

Emphasis types reference brand tokens and use OKLCH relative color syntax for state variants:

```css
/* types/emphasis-variables.css */
:host {
  --button-primary-color: var(--primary-color);
  --button-primary-color-hover: oklch(from var(--button-primary-color) calc(l + var(--hover-lightness)) c h);
  --button-primary-color-focus: oklch(from var(--button-primary-color) calc(l + var(--focus-lightness)) c h);
  --button-primary-color-down:  oklch(from var(--button-primary-color) calc(l + var(--down-lightness)) c h);
}
```

The state lightness modifiers (`--hover-lightness: 0.05`, `--down-lightness: -0.08`) come from `tokens/states.css` and are applied uniformly across all emphasis colors.

### Styled Variants and Standard Tokens

The "styled" type demonstrates how standard/inverted tokens flow into components:

```css
/* types/styled-variables.css */
:host {
  --button-styled-background: var(--standard-solid-5);
  --button-styled-color: var(--text-color);
  --button-styled-border-color: var(--border-color);
  --button-styled-hover-background: var(--standard-solid-15);
  --button-styled-active-background: var(--standard-solid-20);
}
```

These automatically invert in dark mode because `--standard-solid-*` swaps polarity.

---

## Shadow DOM Theme Cascade

### How Global Tokens Reach Shadow DOM

CSS custom properties inherit through Shadow DOM boundaries. When a primitive defines:

```css
:host {
  --button-text-color: var(--black-80);
}
```

The `var(--black-80)` reference resolves against the inherited value of `--black-80` from the document, which was set in `tokens/colors.css` on `:root`.

### Theme Selector Patterns

The light and dark theme files use specific selector patterns designed for nested theme contexts:

```css
/* Light theme */
html,
.light.theme.theme,
[light][light],
[theme][theme="light"] { ... }

/* Dark theme */
html.dark,
.dark.theme.theme,
[dark][dark],
[theme][theme="dark"] { ... }

/* Computed tokens */
:root, .theme, [light], [dark], [theme] { ... }
```

The doubled selectors (`.theme.theme`, `[light][light]`, `[dark][dark]`) increase specificity so nested theme contexts override inherited values. This allows:

```html
<html class="dark">
  <some-component light>
    <!-- light theme tokens apply inside this component -->
  </some-component>
</html>
```

### The `--dark-mode` CSS Variable

Components can trigger dark mode locally via CSS:

```css
some-element {
  --dark-mode: true;
}
```

The `WebComponentBase.isDarkMode()` method checks this:

```js
isDarkMode() {
  return $('html').hasClass('dark') || $(this).cssVar('dark-mode') == 'true';
}
```

### `pageCSS` and `adoptStylesheet`

When a component uses `pageCSS` in `defineComponent`, that CSS is adopted to the document level (not Shadow DOM) via `adoptStylesheet()`. This is used for styles that must exist on the page, like layout adjustments based on component presence.

Component-scoped `css` is applied via Lit's `static get styles()` which creates a `CSSStyleSheet` adopted to the Shadow DOM root.

---

## Adding or Modifying Tokens

### Adding a New Global Token

1. **Determine the computation context**: Does it reference `--standard-*`, `--lightness-N`, or any theme-polarity variable? If yes, it goes in `themes/computed/`. If it's a raw value, it goes in the appropriate `tokens/*.css` file.

2. **Follow the naming convention**:
   - Use `--` prefix (CSS custom property)
   - Kebab-case: `--my-new-token`
   - Include scale suffix for scaled tokens: `--my-token-m`, `--my-token-l`
   - Include state suffix for state variants: `--my-token-hover`, `--my-token-disabled`

3. **Connect to the grid**: Reference `--relative-Npx` for em-based values, `--Npx` for rem-based values, or a spacing token for spacing.

4. **Add to the orchestrator**: If you create a new file, add an `@import` line with a layer assignment in `tokens.css`.

5. **Test in both themes**: Every new token must produce correct values in both light and dark mode.

### Adding a New Component Token

1. Create the variable in the appropriate theme file under `css/theme/` using `:host` scope.
2. Reference global tokens rather than raw values.
3. Import the file in the component's theme orchestrator with the correct layer name.

### Modifying a Color's Shade Behavior

To adjust how a specific color generates its shade scale, override the per-color lightness/chroma mappings in `themes/computed/colors.css`:

```css
/* Make teal's light shades warmer */
--teal-lightness-0: calc(var(--lightness-0) * 0.95);
--teal-chroma-0: calc(var(--chroma-0) * 1.2);
```

To add hue correction (like red has), add hue-shift tokens:

```css
--mycolor-hue-shift-80: 5;  /* shift 5 degrees at shade 80+ */
```

Then reference it in the shade generation formula using `calc(h - var(--mycolor-hue-shift-80, 0))`.

---

## Common Mistakes

### Using Raw Color Values

```css
/* ❌ WRONG — does not respond to theme changes */
color: rgba(0, 0, 0, 0.6);
background: #f5f5f5;

/* ✅ RIGHT — theme-aware tokens */
color: var(--muted-text-color);
background: var(--standard-solid-5);
```

### Using Raw Pixel Values

```css
/* ❌ WRONG — does not scale with --base-size or component size */
padding: 10px 14px;
font-size: 12px;

/* ✅ RIGHT — scalable tokens */
padding: var(--relative-10px) var(--relative-14px);
font-size: var(--text-xs);
```

### Using Layout Tokens for Component Internals

```css
/* ❌ WRONG — rem-based margin token does not ratchet with component size */
.card-content { padding: var(--margin-m); }

/* ✅ RIGHT — em-based padding token ratchets correctly */
.card-content { padding: var(--padding-m); }
```

### Putting Theme-Dependent Tokens in Root

```css
/* ❌ WRONG — this token references --standard-color but is in :root */
:root {
  --my-text-color: var(--standard-80);
}

/* ✅ RIGHT — place in themes/computed/ with the correct selector */
:root, .theme, [light], [dark], [theme] {
  --my-text-color: var(--standard-80);
}
```

### Hardcoding Dark Mode Overrides

```css
/* ❌ WRONG — manual dark mode override, misses nested theme contexts */
.dark .my-element { color: white; }

/* ✅ RIGHT — use standard/inverted tokens that auto-invert */
.my-element { color: var(--text-color); }
```

### Missing Doubled Selectors for Theme Files

```css
/* ❌ WRONG — single attribute selector, insufficient specificity for nesting */
[light] { --my-token: value; }

/* ✅ RIGHT — doubled selector matches the existing pattern */
html, .light.theme.theme, [light][light], [theme][theme="light"] {
  --my-token: value;
}
```

---

## Quick Reference

### Root Units

| Token | Value | Purpose |
|-------|-------|---------|
| `--base-size` | `14` | Root font-size number (no unit) |
| `--base-spacing` | `16` | Root spacing number, 1rem = this many px |
| `--reference-size` | `14` | Design reference — never change |
| `--size-ratio` | `16/14 = 1.1429` | Bridges type grid to spacing grid |
| `--em-size` | `16px` | Document root `font-size` |
| `--page-size` | `14px` | Body `font-size` |

### Pixel Token Families

| Family | Unit | Scales With Base | Ratchets With Component | Use For |
|--------|------|-----------------|------------------------|---------|
| `--Npx` | rem | Yes | No | Page headings, fixed layout |
| `--relative-Npx` | em | Yes | Yes | Component-internal precision |
| `--size-*` | rem | Yes | No | Component base font-size |

### Spacing Token Families

| Family | Unit | Ratchets | Alias Of | Use For |
|--------|------|---------|----------|---------|
| `--padding-*` | em | Yes | (canonical) | Component internal `padding` |
| `--gap-*` | em | Yes | `--padding-*` | Flex/grid `gap` |
| `--indent-*` | em | Yes | `--padding-*` | Text indentation |
| `--margin-*` | rem | No | (canonical) | Inter-component `margin` |
| `--spacing-*` | rem | No | `--margin-*` | Designer-facing spacing term |
| `--gutter-*` | rem | No | `--margin-*` | Grid gutters |

### Named Sizes

| Name | Scale | Token |
|------|-------|-------|
| `--mini` | 3xs | `--size-3xs` = `--10px` |
| `--tiny` | 2xs | `--size-2xs` = `--11px` |
| `--small` | xs | `--size-xs` = `--12px` |
| `--medium` | m | `--size-m` = `--14px` |
| `--large` | l | `--size-l` = `--16px` |
| `--big` | xl | `--size-xl` = `--18px` |
| `--huge` | 2xl | `--size-2xl` = `--20px` |
| `--massive` | 3xl | `--size-3xl` = `--24px` |

### Theme Selectors

| Context | Selector Pattern |
|---------|-----------------|
| Light (default) | `html, .light.theme.theme, [light][light], [theme][theme="light"]` |
| Dark | `html.dark, .dark.theme.theme, [dark][dark], [theme][theme="dark"]` |
| Computed | `:root, .theme, [light], [dark], [theme]` |
| Component | `:host` |

### Standard/Inverted Mapping

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--standard-color` | `--black-lch` | `--white-lch` |
| `--inverted-color` | `--white-lch` | `--black-lch` |
| `--standard-80` | 80% black | 80% white |
| `--text-color` | `--standard-80` (dark text) | `--standard-90` (light text, boosted) |
| `--lightness-0` | `--base-lightness-0` (light) | `--base-lightness-100` (dark) |
| `--lightness-100` | `--base-lightness-100` (dark) | `--base-lightness-0` (light) |

### Available Color Names

`red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `slate`

Each generates shades: `--{color}-0` through `--{color}-100`

### Color Shade Scale (Light Mode)

| Shade | Visual | Common Uses |
|-------|--------|-------------|
| 0 | Lightest tint | Background fills |
| 5 | Very light | Subtle backgrounds |
| 10-20 | Light | Hover backgrounds, light borders |
| 30 | Medium-light | Border colors |
| 40-50 | Mid / base | The named color itself |
| 60-70 | Medium-dark | Text on light backgrounds |
| 80 | Dark | Header text, emphasis |
| 90-100 | Darkest | Strong emphasis |

### Layer Naming

| Pattern | Example |
|---------|---------|
| Global tokens | `layer(tokens.base)`, `layer(tokens.colors)` |
| Light theme | `layer(tokens.themes.light.colors)` |
| Dark theme | `layer(tokens.themes.dark.colors)` |
| Computed | `layer(tokens.themes.computed.colors)` |
| Component content | `layer(button.theme.content.button)` |
| Component types | `layer(button.theme.types.emphasis)` |
| Component states | `layer(button.theme.states.hover)` |
| Component variations | `layer(button.theme.variations.sizing)` |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Token Architecture** | `sui:token-architecture` | Understanding the high-level token design philosophy |
| **Theme-Aware Tokens** | `sui:theme-aware-tokens` | Deep dive into light/dark theme token mechanics |
| **Base Size Scaling** | `sui:base-size-scaling` | Understanding the sizing math in detail |
| **Shadow DOM Theming** | `sui:shadow-dom-theming` | How theme tokens reach components at runtime |
| **Style Components** | `sui:style` | Customizing component appearance from the outside |
| **CSS Tokens Reference** | `sui:tokens` | Consumer-facing token lookup tables |
