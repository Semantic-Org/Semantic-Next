# CSS Tokens

> **Skill:** `sui:tokens`
> **Purpose:** Reference for available CSS design tokens in Semantic UI

CSS tokens are CSS custom properties that provide consistent, theme-aware values for styling components.

---

## T-Shirt Scale Pattern

Many token families use a consistent 9-level scale:

| Primary | Alias |
|---------|-------|
| `-3xs` | `-micro` |
| `-2xs` | `-mini` |
| `-xs` | `-tiny` |
| `-s` | `-small` |
| `-m` | `-medium` |
| `-l` | `-large` |
| `-xl` | `-big` |
| `-2xl` | `-huge` |
| `-3xl` | `-massive` |

**Token families with t-shirt scales:**
- `--spacing-{size}` - spacing and gaps
- `--size-{size}` - general sizing
- `--border-radius-{size}` - corner rounding
- `--title-{size}` - header/display text
- `--text-{size}` - body copy text

Use whichever naming style you prefer - `--spacing-m` and `--spacing-medium` are equivalent.

---

## The Semantic Token Principle

**Always use the token that carries the most semantic meaning.**

Tokens exist in layers. Semantic tokens (like `--text-color`) are built from raw scale values (like `--standard-80`). Always prefer the semantic token when it matches your intent.

```css
/* WRONG - raw scale values when semantic tokens exist */
color: var(--standard-80);              /* What is this? Body text? An icon? */
background: var(--red-0);               /* Is this a background? A highlight? */
border-color: var(--standard-15);       /* What kind of border? */

/* RIGHT - semantic tokens communicate intent */
color: var(--text-color);               /* This is body text */
background: var(--red-background-color); /* This is a red background */
border-color: var(--border-color);      /* This is a standard border */
```

**When to use raw scale values:**
- No semantic token exists for your use case
- You're deliberately customizing (e.g., `--red-20` for a non-standard red background)

**The test:** If another developer reads the token name, can they understand what it's for?

---

## Styling Text

### Semantic Text Tokens (Use These)

```css
/* Neutral text */
--text-color                 /* Body text */
--header-color               /* Headers */
--muted-text-color           /* Secondary/supporting text */
--light-text-color           /* Tertiary/hint text */
--disabled-text-color        /* Disabled state */

/* State variants */
--hovered-text-color
--pressed-text-color
--selected-text-color

/* Inverted (for dark backgrounds in light mode, vice versa) */
--inverted-text-color
--inverted-muted-text-color
--inverted-light-text-color

/* Colored text */
--red-text-color             /* Also: -hover, -pressed, -disabled variants */
--blue-text-color
--green-text-color
/* ...all 13 colors */

/* Brand text */
--primary-text-color         /* Also: -hover, -pressed, -disabled variants */
--secondary-text-color

/* Semantic state text */
--positive-text-color        /* Success */
--negative-text-color        /* Error */
--warning-text-color         /* Warning */
--info-text-color            /* Info */
```

### Raw Scale (For Customization Only)

Only use these when no semantic token fits:

```css
--standard-{n}    /* Foreground color at n% - for custom text shades */
```

**Scale:** 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100

---

## Styling Backgrounds

### Semantic Background Tokens (Use These)

```css
/* Colored backgrounds */
--red-background-color
--blue-background-color
--green-background-color
/* ...all 13 colors */

/* Semantic state backgrounds */
--positive-background-color  /* Success */
--negative-background-color  /* Error */
--warning-background-color   /* Warning */
--info-background-color      /* Info */

/* Page */
--page-background
```

### Raw Scale (For Customization)

```css
/* Neutral backgrounds */
--standard-5                 /* Subtle tint */
--standard-10                /* Slightly stronger */
--inverted-100               /* Solid background color */

/* Custom colored backgrounds */
--red-20                     /* Darker red bg than --red-background-color */
--blue-10                    /* Lighter blue bg */
```

---

## Styling Borders

### Semantic Border Tokens (Use These)

**Full border declarations** (includes width and style):

```css
--border                     /* Standard border */
--internal-border            /* Dividers within a container */
--very-subtle-border         /* Barely visible */
--subtle-border              /* Lighter/less prominent */
--strong-border              /* More prominent */
--selected-border            /* Selected state */
--disabled-border            /* Disabled state */

/* Colored borders */
--red-border
--blue-border
/* ...all 13 colors */
```

**Border colors only** (when you need just the color):

```css
--border-color
--internal-border-color
--very-subtle-border-color
--subtle-border-color
--strong-border-color
--selected-border-color

/* Colored */
--red-border-color
--blue-border-color
/* ...all 13 colors */

/* Semantic states */
--positive-border-color
--negative-border-color
--warning-border-color
--info-border-color
```

### Decision Guide

| Intent | Use |
|--------|-----|
| Standard element border | `--border` |
| Divider inside a card/container | `--internal-border` |
| De-emphasized border | `--subtle-border` |
| Emphasized border | `--strong-border` |
| Red-colored border | `--red-border` or `--red-border-color` |
| Custom border opacity | `--standard-{n}` as border-color |

---

## Colors

### Base Colors

Thirteen named colors: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `slate`

```css
background: var(--red);      /* The base red (equivalent to --red-50) */
```

### Color Scale (0-100)

Each color has a scale from light to dark. **The scale inverts between themes** to maintain appropriate contrast.

**Pattern:** `--{color}-{n}` where n = 0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100

> **The scale is lightness, not intensity.** `--red-0` is not "no red" - it's the lightest tint of red (almost white with a red tint). `--red-50` is the base color. `--red-100` is the darkest shade (almost black with red undertone). Think of it like mixing paint: 0 = white with a drop of color, 50 = pure color, 100 = color mixed with black.

| Range | Light Mode | Dark Mode | Typical Use |
|-------|------------|-----------|-------------|
| 0-10 | Light tints | Dark shades | Backgrounds |
| 20-30 | Medium light | Medium dark | Borders, subtle UI |
| 50 | Base color | Base color | The color itself |
| 60-70 | Darker | Lighter | Text |
| 80-100 | Very dark | Very light | Headers, strong emphasis |

```css
/* These automatically adapt to theme */
background: var(--blue-5);    /* Light blue bg (light mode) → Dark blue bg (dark mode) */
color: var(--blue-70);        /* Readable blue text in either theme */
```

### Semantic Shortcuts

Pre-configured for common use cases - **prefer these over raw scale values**:

```css
--{color}-text-color              /* Readable text */
--{color}-background-color        /* Appropriate background */
--{color}-border-color            /* Border color */
--{color}-header-color            /* Header text */
```

### Brand Colors

```css
--primary-color / --primary       /* Primary brand (default: blue) */
--secondary-color / --secondary   /* Secondary brand (default: slate) */

/* Full scale available */
--primary-0 through --primary-100
--secondary-0 through --secondary-100

/* Shortcuts */
--primary-text-color, --primary-background-color, etc.
```

### Semantic State Colors

| Base Token | Default | Purpose |
|------------|---------|---------|
| `--positive-color` | green | Success, confirmation |
| `--negative-color` | red | Errors, destructive |
| `--warning-color` | orange | Warnings, caution |
| `--info-color` | teal | Information, tips |

Each has full scale (`--positive-0` to `--positive-100`) and shortcuts (`--positive-text-color`, `--positive-background-color`, etc.)

### Social Brand Colors

`--{platform}-color` where platform = `facebook`, `twitter`, `linked-in`, `youtube`, `pinterest`, `instagram`. Also `--instagram-gradient`.

### Invalid Token Examples

```css
/* WRONG - these don't exist */
--red-15                /* Scale: 0,5,10,20,30... no 15 */
--red-text              /* Must be --red-text-color */
--gray                  /* British spelling: --grey */
--primary-bg            /* Must be --primary-background-color */
--standard              /* Needs number: --standard-80 */
```

---

## Neutrals & Theme System

### Standard & Inverted

| Token Pattern | Light Mode | Dark Mode | Use For |
|---------------|------------|-----------|---------|
| `--standard-{n}` | Black at n% | White at n% | Foreground (text, icons, borders) |
| `--inverted-{n}` | White at n% | Black at n% | Backgrounds, inverse contexts |

**Mental model:**
- `--standard` = foreground color (what you read/see)
- `--inverted` = background color (what's behind)

### Theme Detection

For conditional styling based on current theme:

```css
--dark-mode                  /* true in dark mode, false in light */
--light-mode                 /* true in light mode, false in dark */
```

Use with container style queries:

```css
@container style(--dark-mode: true) {
  .custom-element { /* dark mode styles */ }
}
```

### Invariant Colors (Don't Swap)

For when you need colors that stay the same regardless of theme:

```css
/* Always black/white regardless of theme */
--black-{n}                  /* Black at n% opacity */
--white-{n}                  /* White at n% opacity */

/* Solid grays (opaque, not transparent) */
--black-solid-{n}            /* Opaque gray scale */
--white-solid-{n}

/* Color scales that don't invert */
--red-{n}-invariant          /* Same red-10 in light and dark mode */
--blue-{n}-invariant
--primary-{n}-invariant
```

**When to use invariant:** Overlays, fixed-color branding, elements where semantic meaning requires a specific color regardless of theme. More common than you'd expect!

---

## Effects (Use These for UX)

Gradients and shadows are **visual differentiation tools**. They're calibrated to be subtle - use them freely to create hierarchy and distinguish adjacent elements.

### Gradients

Solve: "These two areas are the same color but need visual separation"

**Pattern:** `--{intensity}-{direction}-gradient`

| Intensity | Direction |
|-----------|-----------|
| `very-subtle-`, `subtle-`, (none), `strong-`, `very-strong-` | (vertical), `angled-`, `horizontal-`, `inverted-` |

Examples: `--gradient`, `--subtle-angled-gradient`, `--very-strong-horizontal-gradient`

### Shadows

**Pattern:** `--{intensity}-{type}-shadow`

| Type | Use |
|------|-----|
| `shadow` | Standard elevation |
| `floating-shadow` | Dropdowns, popovers |
| `inset-shadow` | Pressed/recessed |
| `{side}-lip-shadow` | Edge highlights (top, bottom, left, right) |
| `text-shadow` | Text depth |

Intensity: `subtle-` or none. Example: `--subtle-shadow`, `--subtle-top-lip-shadow`

---

## Spacing

### Spacing Scale

Full t-shirt scale available:

```css
--spacing-{size}             /* 3xs→3xl: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px */
--spacing                    /* Default (= --spacing-m, 16px) */
```

### Layout Helpers

```css
--padding                    /* Default padding (= --spacing) */
--compact-padding            /* Tighter padding */
--compact-spacing            /* Tighter spacing */
--margin                     /* Default margin */

--vertically-spaced          /* margin: var(--spacing) 0 */
--horizontally-spaced        /* margin: 0 var(--spacing) */
--vertically-padded          /* padding: var(--spacing) 0 */
--horizontally-padded        /* padding: 0 var(--spacing) */
--centered                   /* margin: var(--spacing) auto */
```

### Containers

For constraining content width:

```css
--text-container             /* 700px - readable text column */
--content-container          /* 960px - standard content width */
--wide-container             /* 1200px - wide layouts */
--fluid-container            /* 100% (aliases --fluid) */
--fluid                      /* 100% - general utility */
```

### Border Radius

Full t-shirt scale available:

```css
--border-radius-{size}       /* 3xs→3xl: 0, 1px, 2px, 3px, 4px, 8px, 12px, 16px, 24px */
--border-radius              /* Default (= --border-radius-m, 4px) */
--circular-radius            /* Fully rounded (500rem) - for pills, circles */
```

**Attached elements:** `--{side}-attached-border-radius` (top, right, bottom, left) - rounds only the corners on that side.

### Split Widths

For dividing 100% width into portions:

| Pattern | Logic | Example |
|---------|-------|---------|
| `--{n}-wide` | n/16 of grid (uses `--column-count`) | `--four-wide` = 25% |
| `--{n}-column` | 1/n equal division | `--three-column` = 33.33% |

Both support 1-16. Use `-wide` for grid-based layouts, `-column` for equal splits.

### Breakpoints

```css
--mobile-breakpoint          /* 320px */
--tablet-breakpoint          /* 768px */
--computer-breakpoint        /* 992px */
--large-monitor-breakpoint   /* 1200px */
--widescreen-monitor-breakpoint /* 1920px */
```

---

## Sizing

### Size Scale

Full t-shirt scale with short aliases:

```css
--size-{size}                /* 3xs→3xl: 10px, 11px, 12px, 13px, 14px, 16px, 18px, 20px, 24px */
--{size}                     /* Short form: --3xs, --2xs, --xs, --s, --m, --l, --xl, --2xl, --3xl */
--small, --medium, --large   /* Natural language aliases also work */
```

### Pixel Tokens (Scalable Components)

**Pattern:** `--{n}px` (1-64)

These express exact pixel values as scalable em units. Think in pixels, get components that scale proportionally when parent font-size changes.

```css
/* A button using pixel tokens */
.button {
  padding: var(--8px) var(--16px);
  border-radius: var(--4px);
  gap: var(--6px);
}

/* When rendered at "large" size (larger parent font-size),
   ALL values scale proportionally - button grows but keeps its shape */
```

| Token | Unit | Scales With |
|-------|------|-------------|
| `--{n}px` | rem | Root font size (global scaling) |
| `--relative-{n}px` | em | Parent font size (local scaling) |

**This is essential for components with size variations** (small/medium/large). Set font-size on the parent, and all `--{n}px` values scale together.

---

## Interaction

### Transitions

```css
--transition                 /* all 0.15s ease */
--duration                   /* 0.15s */
--easing                     /* ease */
```

### Focus States

```css
--focused-ring-shadow        /* Focus ring for interactive elements */
--focused-ring-color         /* Ring color (primary) */
--focused-ring-width         /* Ring thickness */
```

### State Adjustments

```css
--hover-lightness            /* Lightness shift on hover */
--focus-lightness            /* Lightness shift on focus */
--down-lightness             /* Lightness shift when pressed */
--active-lightness           /* Lightness shift when active */
--disabled-opacity           /* Opacity for disabled: 0.4 */
--recessed-opacity           /* Opacity for recessed UI: 0.4 */
```

---

## Z-Index Layers

Organized to prevent z-index conflicts:

```css
/* Page content: 1-5 */
--page-layer                 /* 1 */
--page-layer-1 through -5

/* Floating elements: 100-105 */
--float-layer                /* 100 */
--float-layer-1 through -5

/* Overlays: 1000-1005 */
--overlay-layer              /* 1000 */
--overlay-layer-1 through -5
```

---

## Typography

### Title Scale (Headers/Display)

For headings and display text. Larger jumps between sizes for clear visual hierarchy.

```css
--title-{size}               /* 3xs→3xl: 10px, 12px, 14px, 16px, 18px, 24px, 32px, 48px, 64px */
--title-size                 /* Default (= --title-m, 18px) */
```

### Text Scale (Body Copy)

For body text. Tighter increments for fine-tuning readability.

```css
--text-{size}                /* 3xs→3xl: 10px, 11px, 12px, 13px, 14px, 16px, 18px, 20px, 24px */
--text-size                  /* Default (= --text-m, 14px) */
```

### Line Heights

```css
--line-height                /* Body text */
--header-line-height         /* Headers (tighter) */
--paragraph-line-height      /* Paragraphs (looser for readability) */
```

### Links

```css
--link-color                 /* Default link color (theme-aware) */
--link-hover-color           /* Link hover state */
--link-text-decoration       /* Default: none */
--link-hover-text-decoration /* Hover decoration */
```

### Form Inputs

Cross-component tokens for consistent form styling (inputs, dropdowns, textareas):

```css
--input-padding              /* Combined padding */
--input-vertical-padding
--input-horizontal-padding
--form-focused-border-color
--input-highlight-background
--input-highlight-color
```

### Font Properties

```css
--page-font                  /* Body font stack */
--header-font                /* Header font stack */
--bold                       /* bold */
--normal                     /* normal */
```

---

## Quick Reference: Most Used Tokens

From real component examples:

```css
/* Layout */
--border-radius, --border, --padding, --spacing, --compact-spacing

/* Text */
--text-color, --muted-text-color, --primary-text-color

/* Backgrounds */
--standard-5, --standard-10, --inverted-100

/* Effects */
--transition, --subtle-gradient, --angled-gradient, --floating-shadow

/* Sizing */
--small, --medium, --large, --8px, --16px

/* Borders */
--border, --internal-border, --border-color
```
