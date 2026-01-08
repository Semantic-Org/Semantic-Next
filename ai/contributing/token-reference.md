---
title: CSS Design Token Reference
description: Complete reference of all available CSS design tokens, including theme-adaptive colors, spacing, typography, and layout variables.
keywords: [CSS tokens, design tokens, CSS variables, theming, colors, spacing, typography]
audience: contributing
type: doc
---

# Semantic UI CSS Design Token Reference

> **For:** AI agents creating examples and documentation
> **Purpose:** Complete reference of all available CSS design tokens
> **Source:** Verified from `/dist/semantic-ui.css` (canonical compiled tokens)
> **Related:** [CSS Token Guide](./token-usage.md) • [Example Authoring](/ai/contributing/documentation/examples/authoring.md)

---

## 🚨 **CRITICAL: Light/Dark Mode Tokens**

**ESSENTIAL UNDERSTANDING**: Semantic UI's theming system uses `standard-` and `inverted-` tokens that automatically adapt to light/dark themes. These are the foundation of the entire design system.

### **Theme-Adaptive Color System**

```css
/* LIGHT MODE: standard-color = black LCH, inverted-color = white LCH */
/* DARK MODE: standard-color = white LCH, inverted-color = black LCH */

/* Core theme colors (automatically switch between themes) */
--standard-color      /* Theme text color (black LCH in light, white LCH in dark) */
--inverted-color      /* Opposite theme color (white LCH in light, black LCH in dark) */
--text-color          /* Main text color (computed from standard) */
--header-color        /* Header text color (computed from standard) */
--page-background     /* Page background (white in light, black in dark) */
```

### **Standard Scale (Theme-Adaptive with Opacity)**
**CRITICAL**: Numbers represent opacity percentages applied to the current theme's base color. Higher numbers = more opaque.

```css
/* oklch(var(--standard-color) / X%) where X is the number */
/* Light mode: standard-color = black, so standard-80 = 80% opacity black */
/* Dark mode: standard-color = white, so standard-80 = 80% opacity white */

--standard-5          /* 5% opacity - very subtle */
--standard-10         /* 10% opacity - subtle backgrounds */
--standard-15         /* 15% opacity - light borders */
--standard-20         /* 20% opacity - disabled elements */
--standard-25         /* 25% opacity */
--standard-30         /* 30% opacity - subtle borders */
--standard-40         /* 40% opacity - muted elements */
--standard-50         /* 50% opacity - medium elements */
--standard-60         /* 60% opacity - muted text */
--standard-70         /* 70% opacity - secondary text */
--standard-75         /* 75% opacity */
--standard-80         /* 80% opacity - primary text */
--standard-85         /* 85% opacity - dark text */
--standard-90         /* 90% opacity - headers */
--standard-95         /* 95% opacity - strong text */
--standard-100        /* 100% opacity - maximum contrast */

/* Inverted scale (opposite theme color with opacity) */
/* oklch(var(--inverted-color) / X%) where X is the number */
--inverted-5          /* 5% inverted color */
--inverted-10         /* 10% inverted color */
--inverted-15         /* 15% inverted color */
--inverted-20         /* 20% inverted color */
--inverted-25         /* 25% inverted color */
--inverted-30         /* 30% inverted color */
--inverted-40         /* 40% inverted color */
--inverted-50         /* 50% inverted color */
--inverted-60         /* 60% inverted color */
--inverted-70         /* 70% inverted color */
--inverted-75         /* 75% inverted color */
--inverted-80         /* 80% inverted color */
--inverted-85         /* 85% inverted color */
--inverted-90         /* 90% inverted color */
--inverted-95         /* 95% inverted color */
--inverted-100        /* 100% inverted color */
```

### **Solid Color Variants (No Theme Switching)**
**CRITICAL**: These are absolute colors that don't change between themes.

```css
/* Absolute black scale (always black, regardless of theme) */
--black-solid-5       /* Very light black (95% lightness) */
--black-solid-10      /* Light black (90% lightness) */
--black-solid-15      /* Medium light black (85% lightness) */
--black-solid-20      /* Medium black (80% lightness) */
--black-solid-25      /* Medium black (75% lightness) */
--black-solid-30      /* Medium black (70% lightness) */
--black-solid-40      /* Medium dark black (60% lightness) */
--black-solid-50      /* Medium black (50% lightness) */
--black-solid-60      /* Dark black (40% lightness) */
--black-solid-70      /* Darker black (30% lightness) */
--black-solid-75      /* Darker black (25% lightness) */
--black-solid-80      /* Very dark black (20% lightness) */
--black-solid-85      /* Very dark black (15% lightness) */
--black-solid-90      /* Nearly black (10% lightness) */
--black-solid-95      /* Almost black (5% lightness) */
--black-solid-100     /* Pure black (0% lightness) */

/* Absolute white scale (always white, regardless of theme) */
--white-solid-5       /* Very light white (5% opacity) */
--white-solid-10      /* Light white (10% opacity) */
--white-solid-15      /* Medium light white (15% opacity) */
--white-solid-20      /* Medium white (20% opacity) */
--white-solid-25      /* Medium white (25% opacity) */
--white-solid-30      /* Medium white (30% opacity) */
--white-solid-40      /* Medium white (40% opacity) */
--white-solid-50      /* Medium white (50% opacity) */
--white-solid-60      /* Medium white (60% opacity) */
--white-solid-70      /* Medium white (70% opacity) */
--white-solid-75      /* Medium white (75% opacity) */
--white-solid-80      /* Light white (80% opacity) */
--white-solid-85      /* Light white (85% opacity) */
--white-solid-90      /* Very light white (90% opacity) */
--white-solid-95      /* Nearly white (95% opacity) */
--white-solid-100     /* Pure white (100% opacity) */

/* Theme-mapped solid variants */
--standard-solid-5 through --standard-solid-100    /* Maps to black-solid in light, white-solid in dark */
--inverted-solid-5 through --inverted-solid-100    /* Maps to white-solid in light, black-solid in dark */
```

---

## 🎨 **Complete Color Palette**

### **Brand Colors (Base Values)**
```css
/* Base brand colors - the foundation for all color scales */
--red: oklch(0.59 0.27 28)
--orange: oklch(0.65 0.2 44.37)
--yellow: oklch(0.78 0.18 81.24)
--olive: oklch(0.69 0.19 119.53)
--green: oklch(0.62 0.26 145.53)
--teal: oklch(0.66 0.14 188.03)
--blue: oklch(0.56 0.21 251)
--violet: oklch(0.46 0.26 283.29)
--purple: oklch(0.54 0.26 314.43)
--pink: oklch(0.59 0.27 358.33)
--brown: oklch(0.5 0.11 51.34)
--grey: oklch(0.57 0 0)
--slate: oklch(0.23 0 0)
```

### **Computed Color Scales (CRITICAL UNDERSTANDING)**

**Each brand color generates a complete scale using lightness and chroma multipliers:**

```css
/* Example: Red color scale (same pattern applies to all colors) */
--red-0: oklch(from var(--red) calc(l * 1.66) calc(c * 0.15) h)    /* Very light red */
--red-5: oklch(from var(--red) calc(l * 1.61) calc(c * 0.25) h)    /* Light red */
--red-10: oklch(from var(--red) calc(l * 1.52) calc(c * 0.35) h)   /* Light red */
--red-20: oklch(from var(--red) calc(l * 1.39) calc(c * 0.55) h)   /* Subtle red */
--red-30: oklch(from var(--red) calc(l * 1.25) calc(c * 0.75) h)   /* Muted red */
--red-40: oklch(from var(--red) calc(l * 1.10) calc(c * 0.90) h)   /* Secondary red */
--red-50: var(--red)                                                /* Base red (unchanged) */
--red-60: oklch(from var(--red) calc(l * 0.88) calc(c * 0.90) h)   /* Darker red */
--red-70: oklch(from var(--red) calc(l * 0.76) calc(c * 0.75) h)   /* Dark red */
--red-80: oklch(from var(--red) calc(l * 0.64) calc(c * 0.55) h)   /* Very dark red */
--red-90: oklch(from var(--red) calc(l * 0.52) calc(c * 0.35) h)   /* Near black red */
--red-95: oklch(from var(--red) calc(l * 0.38) calc(c * 0.25) h)   /* Very dark red */
--red-100: oklch(from var(--red) calc(l * 0.25) calc(c * 0.15) h)  /* Darkest red */

/* All colors follow this same pattern: */
/* --{color}-0 through --{color}-100 for: */
/* red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, slate */
```

### **Primary & Secondary Colors**
```css
--primary-color: var(--blue)          /* Main brand color */
--primary: var(--primary-color)       /* Alias for primary-color */
--secondary-color: var(--slate)       /* Secondary brand color */
--secondary: var(--secondary-color)   /* Alias for secondary-color */
```

### **Color Text Variants**
```css
--red-text-color: var(--red-70)       /* Red text (70% opacity) */
--orange-text-color: var(--orange-70) /* Orange text */
--yellow-text-color: var(--yellow-70) /* Yellow text */
--olive-text-color: var(--olive-70)   /* Olive text */
--green-text-color: var(--green-70)   /* Green text */
--teal-text-color: var(--teal-70)     /* Teal text */
--blue-text-color: var(--blue-70)     /* Blue text */
--violet-text-color: var(--violet-70) /* Violet text */
--purple-text-color: var(--purple-70) /* Purple text */
--pink-text-color: var(--pink-70)     /* Pink text */
--brown-text-color: var(--brown-70)   /* Brown text */
--grey-text-color: var(--grey-70)     /* Grey text */
--slate-text-color: var(--slate-70)   /* Slate text */

--primary-text-color: var(--blue-text-color)     /* Primary brand text */
--secondary-text-color: var(--slate-text-color)  /* Secondary brand text */
```

### **Color Background Variants**
```css
--red-background-color: var(--red-0)       /* Red background (0% opacity) */
--orange-background-color: var(--orange-0) /* Orange background */
--yellow-background-color: var(--yellow-0) /* Yellow background */
--olive-background-color: var(--olive-0)   /* Olive background */
--green-background-color: var(--green-0)   /* Green background */
--teal-background-color: var(--teal-0)     /* Teal background */
--blue-background-color: var(--blue-0)     /* Blue background */
--violet-background-color: var(--violet-0) /* Violet background */
--purple-background-color: var(--purple-0) /* Purple background */
--pink-background-color: var(--pink-0)     /* Pink background */
--brown-background-color: var(--brown-0)   /* Brown background */
--grey-background-color: var(--grey-0)     /* Grey background */
--slate-background-color: var(--slate-0)   /* Slate background */
```

### **Simplified Color Names (CONFIRMED PATTERN)**
```css
/* Simplified background names (remove -color suffix) */
--red-background: var(--red-background-color)       /* Red background */
--orange-background: var(--orange-background-color) /* Orange background */
--yellow-background: var(--yellow-background-color) /* Yellow background */
--olive-background: var(--olive-background-color)   /* Olive background */
--green-background: var(--green-background-color)   /* Green background */
--teal-background: var(--teal-background-color)     /* Teal background */
--blue-background: var(--blue-background-color)     /* Blue background */
--violet-background: var(--violet-background-color) /* Violet background */
--purple-background: var(--purple-background-color) /* Purple background */
--pink-background: var(--pink-background-color)     /* Pink background */
--brown-background: var(--brown-background-color)   /* Brown background */
--grey-background: var(--grey-background-color)     /* Grey background */
--slate-background: var(--slate-background-color)   /* Slate background */
```

### **Color Border Variants**
```css
/* Border colors (30% opacity) */
--red-border-color: var(--red-30)       /* Red border color */
--orange-border-color: var(--orange-30) /* Orange border color */
--yellow-border-color: var(--yellow-30) /* Yellow border color */
--olive-border-color: var(--olive-30)   /* Olive border color */
--green-border-color: var(--green-30)   /* Green border color */
--teal-border-color: var(--teal-30)     /* Teal border color */
--blue-border-color: var(--blue-30)     /* Blue border color */
--violet-border-color: var(--violet-30) /* Violet border color */
--purple-border-color: var(--purple-30) /* Purple border color */
--pink-border-color: var(--pink-30)     /* Pink border color */
--brown-border-color: var(--brown-30)   /* Brown border color */
--grey-border-color: var(--grey-30)     /* Grey border color */
--slate-border-color: var(--slate-30)   /* Slate border color */

/* Complete border declarations (1px solid + color) */
--red-border: 1px solid var(--red-30)       /* Red border */
--orange-border: 1px solid var(--orange-30) /* Orange border */
--yellow-border: 1px solid var(--yellow-30) /* Yellow border */
--olive-border: 1px solid var(--olive-30)   /* Olive border */
--green-border: 1px solid var(--green-30)   /* Green border */
--teal-border: 1px solid var(--teal-30)     /* Teal border */
--blue-border: 1px solid var(--blue-30)     /* Blue border */
--violet-border: 1px solid var(--violet-30) /* Violet border */
--purple-border: 1px solid var(--purple-30) /* Purple border */
--pink-border: 1px solid var(--pink-30)     /* Pink border */
--brown-border: 1px solid var(--brown-30)   /* Brown border */
--grey-border: 1px solid var(--grey-30)     /* Grey border */
--slate-border: 1px solid var(--slate-30)   /* Slate border */
```

---

## 📏 **Layout & Spacing System**

### **Core Spacing**
```css
--spacing: 1rem                /* Base spacing unit */
--compact-spacing: 0.5rem      /* Compact spacing (half base) */
```

### **Computed Spacing Patterns**
```css
--padding: var(--spacing)                    /* Standard padding */
--compact-padding: var(--compact-spacing)   /* Compact padding */
--margin: var(--spacing)                     /* Standard margin */

/* Directional patterns */
--horizontally-padded: 0rem var(--padding)  /* Left/right padding only */
--vertically-padded: var(--padding) 0rem    /* Top/bottom padding only */
--vertically-spaced: var(--spacing) 0rem    /* Top/bottom margin only */
--horizontally-spaced: 0rem var(--spacing)  /* Left/right margin only */
--centered: var(--spacing) auto             /* Centered with vertical margin */
```

### **Border Radius System**
```css
--border-radius: 4px           /* Standard border radius */
--circular-radius: 500rem      /* Circular border radius */

/* Attached border radius patterns */
--top-attached-border-radius: var(--border-radius) var(--border-radius) 0px 0px
--right-attached-border-radius: var(--border-radius) 0px 0px var(--border-radius)
--bottom-attached-border-radius: 0px 0px var(--border-radius) var(--border-radius)
--left-attached-border-radius: 0px var(--border-radius) var(--border-radius) 0px
```

### **Border System**
```css
/* Theme-adaptive border colors */
--standard-border-color: var(--black-border-lch)   /* Light mode: black-based */
--inverted-border-color: var(--white-border-lch)   /* Light mode: white-based */
/* In dark mode, these flip: standard becomes white-based, inverted becomes black-based */

/* Computed border colors with opacity */
--border-color: oklch(var(--standard-border-color) / 15%)              /* Standard border */
--internal-border-color: oklch(var(--standard-border-color) / 10%)     /* Internal borders */
--subtle-border-color: oklch(var(--standard-border-color) / 8%)        /* Subtle borders */
--very-subtle-border-color: oklch(var(--standard-border-color) / 5%)   /* Very subtle borders */
--strong-border-color: oklch(var(--standard-border-color) / 22%)       /* Strong borders */
--selected-border-color: oklch(var(--standard-border-color) / 35%)     /* Selected borders */

/* Complete border declarations (1px solid + color) */
--border: 1px solid var(--border-color)                    /* Standard border */
--internal-border: 1px solid var(--internal-border-color) /* Internal borders */
--subtle-border: 1px solid var(--subtle-border-color)     /* Subtle borders */
--very-subtle-border: 1px solid var(--very-subtle-border-color) /* Very subtle borders */
--strong-border: 1px solid var(--strong-border-color)     /* Strong borders */
--selected-border: 1px solid var(--selected-border-color) /* Selected borders */

/* Absolute border colors (don't change with theme) */
--black-border-color: oklch(var(--black-border-lch) / 10%)     /* Always black-based */
--white-border-color: oklch(var(--white-border-lch) / 10%)     /* Always white-based */
--black-border: 1px solid var(--black-border-color)            /* Always black border */
--white-border: 1px solid var(--white-border-color)            /* Always white border */
```

---

## 📐 **Size Scale System**

### **Semantic Size Names**
```css
/* Absolute sizes (rem-based) */
--mini: calc(var(--mini-ratio) * 1rem)       /* Mini size */
--tiny: calc(var(--tiny-ratio) * 1rem)       /* Tiny size */
--small: calc(var(--small-ratio) * 1rem)     /* Small size */
--medium: calc(var(--medium-ratio) * 1rem)   /* Medium size (base) */
--large: calc(var(--large-ratio) * 1rem)     /* Large size */
--big: calc(var(--big-ratio) * 1rem)         /* Big size */
--huge: calc(var(--huge-ratio) * 1rem)       /* Huge size */
--massive: calc(var(--massive-ratio) * 1rem) /* Massive size */

/* Relative sizes (em-based, scale with container) */
--relative-mini: calc(var(--mini-ratio) * 1em)       /* Relative mini */
--relative-tiny: calc(var(--tiny-ratio) * 1em)       /* Relative tiny */
--relative-small: calc(var(--small-ratio) * 1em)     /* Relative small */
--relative-medium: calc(var(--medium-ratio) * 1em)   /* Relative medium */
--relative-large: calc(var(--large-ratio) * 1em)     /* Relative large */
--relative-big: calc(var(--big-ratio) * 1em)         /* Relative big */
--relative-huge: calc(var(--huge-ratio) * 1em)       /* Relative huge */
--relative-massive: calc(var(--massive-ratio) * 1em) /* Relative massive */
```

### **Pixel-Perfect Sizing (1px-64px)**
```css
/* Em-scaled pixel values (responsive) */
--1px through --64px         /* 1px to 64px, scaled with em-size */
--relative-1px through --relative-64px  /* Container-relative versions */

/* Most commonly used pixel tokens */
--1px, --2px, --3px, --4px, --5px, --6px, --7px, --8px
--10px, --12px, --14px, --15px, --16px, --18px, --20px
--24px, --28px, --30px, --32px, --40px, --48px, --56px, --64px
```

---

## 🎨 **Typography System**

### **Font Properties**
```css
--font-name: "Lato"           /* Primary font family */
--header-font: [computed]     /* Header font family */
--page-font: [computed]       /* Body font family */

--bold: bold                  /* Bold font weight */
--normal: normal              /* Normal font weight */
--header-font-weight: var(--bold)  /* Header font weight */
```

### **Text Colors by Usage**
```css
--text-color: var(--standard-80)              /* Primary text */
--header-color: var(--standard-90)            /* Header text */
--dark-text-color: var(--standard-85)         /* Dark text */
--muted-text-color: var(--standard-60)        /* Muted text */
--light-text-color: var(--standard-40)        /* Light text */
--disabled-text-color: var(--standard-20)     /* Disabled text */
--selected-text-color: var(--standard-95)     /* Selected text */
--pressed-text-color: var(--standard-90)      /* Pressed text */
--hovered-text-color: var(--standard-80)      /* Hovered text */

/* Inverted variants */
--inverted-text-color: var(--inverted-90)           /* Inverted text */
--inverted-muted-text-color: var(--inverted-80)     /* Inverted muted */
--inverted-light-text-color: var(--inverted-70)     /* Inverted light */
--inverted-disabled-text-color: var(--inverted-20)  /* Inverted disabled */
```

### **Typography Spacing**
```css
--line-height: calc(20 / 14)                    /* Base line height */
--header-line-height: var(--relative-18px)      /* Header line height */
--paragraph-margin: 0em 0em 1em                 /* Paragraph margins */
--header-top-margin: 2rem                       /* Header top margin */
--header-bottom-margin: 1rem                    /* Header bottom margin */
```

---

## 🎭 **Effects & Interactions**

### **Transitions & Timing**
```css
--duration: 0.15s             /* Standard transition duration */
--easing: ease                /* Standard easing function */
--transition: all var(--duration) var(--easing)  /* Complete transition */
```

### **Opacity States**
```css
--disabled-opacity: 0.4       /* Disabled element opacity */
--recessed-opacity: 0.4       /* Recessed element opacity */
--link-opacity: 0.6           /* Link opacity */
```

### **Interaction Lightness Adjustments**
```css
--hover-lightness: 0.05       /* Lightness increase on hover */
--focus-lightness: -0.05      /* Lightness decrease on focus */
--down-lightness: -0.08       /* Lightness decrease when pressed */
--active-lightness: -0.08     /* Lightness decrease when active */
```

### **Shadow System**
```css
--text-shadow: 0px 1px 1px var(--strong-transparent-black)
--subtle-shadow: 0px 1px 2px 0 var(--strong-transparent-black)
--shadow: 0px 1px 2px 0 var(--very-strong-transparent-black)
--floating-shadow: 0px 2px 4px 0px rgb(34 36 38 / 12%), 0px 2px 10px 0px rgb(34 36 38 / 15%)

/* Inset shadows */
--subtle-inset-shadow: 0px 1px 2px 0 var(--transparent-black) inset
--inset-shadow: 0px 2px 3px 0 var(--strong-transparent-black) inset
```

### **Focus States**
```css
--focused-ring-color: var(--primary-color)     /* Focus ring color */
--focused-ring-width: 3px                      /* Focus ring width */
--focused-ring-outline-width: 1px              /* Focus outline width */
--focused-outline-color: var(--inverted-100)   /* Focus outline color */
```

---

## 📱 **Grid & Layout System**

### **Breakpoints**
```css
--mobile-breakpoint: 320px           /* Mobile breakpoint */
--tablet-breakpoint: 768px           /* Tablet breakpoint */
--computer-breakpoint: 992px         /* Computer breakpoint */
--large-monitor-breakpoint: 1200px   /* Large monitor breakpoint */
--widescreen-monitor-breakpoint: 1920px /* Widescreen breakpoint */
```

### **Grid Column Widths**
```css
/* 16-column grid fractions */
--one-wide: calc(1 / var(--column-count) * 100%)      /* 1/16 width */
--two-wide: calc(2 / var(--column-count) * 100%)      /* 2/16 width */
--three-wide: calc(3 / var(--column-count) * 100%)    /* 3/16 width */
--four-wide: calc(4 / var(--column-count) * 100%)     /* 4/16 width */
--five-wide: calc(5 / var(--column-count) * 100%)     /* 5/16 width */
--six-wide: calc(6 / var(--column-count) * 100%)      /* 6/16 width */
--seven-wide: calc(7 / var(--column-count) * 100%)    /* 7/16 width */
--eight-wide: calc(8 / var(--column-count) * 100%)    /* 8/16 width */
--nine-wide: calc(9 / var(--column-count) * 100%)     /* 9/16 width */
--ten-wide: calc(10 / var(--column-count) * 100%)     /* 10/16 width */
--eleven-wide: calc(11 / var(--column-count) * 100%)  /* 11/16 width */
--twelve-wide: calc(12 / var(--column-count) * 100%)  /* 12/16 width */
--thirteen-wide: calc(13 / var(--column-count) * 100%) /* 13/16 width */
--fourteen-wide: calc(14 / var(--column-count) * 100%) /* 14/16 width */
--fifteen-wide: calc(15 / var(--column-count) * 100%)  /* 15/16 width */
--sixteen-wide: calc(16 / var(--column-count) * 100%)  /* 16/16 width */

/* Equal column divisions */
--one-column: calc(1 / 1 * 100%)      /* 100% width (1 column) */
--two-column: calc(1 / 2 * 100%)      /* 50% width (2 columns) */
--three-column: calc(1 / 3 * 100%)    /* 33.33% width (3 columns) */
--four-column: calc(1 / 4 * 100%)     /* 25% width (4 columns) */
--five-column: calc(1 / 5 * 100%)     /* 20% width (5 columns) */
--six-column: calc(1 / 6 * 100%)      /* 16.67% width (6 columns) */
--seven-column: calc(1 / 7 * 100%)    /* 14.29% width (7 columns) */
--eight-column: calc(1 / 8 * 100%)    /* 12.5% width (8 columns) */
--nine-column: calc(1 / 9 * 100%)     /* 11.11% width (9 columns) */
--ten-column: calc(1 / 10 * 100%)     /* 10% width (10 columns) */
--eleven-column: calc(1 / 11 * 100%)  /* 9.09% width (11 columns) */
--twelve-column: calc(1 / 12 * 100%)  /* 8.33% width (12 columns) */
--thirteen-column: calc(1 / 13 * 100%) /* 7.69% width (13 columns) */
--fourteen-column: calc(1 / 14 * 100%) /* 7.14% width (14 columns) */
--fifteen-column: calc(1 / 15 * 100%)  /* 6.67% width (15 columns) */
--sixteen-column: calc(1 / 16 * 100%)  /* 6.25% width (16 columns) */
```

---

## 🔗 **Links & Navigation**

### **Link Colors**
```css
--link-color: oklch(0.74 0.15 249.95)        /* Standard link color */
--link-hover-color: oklch(0.7 0.18 250.31)   /* Link hover color */
--link-text-decoration: none                  /* Link text decoration */
--link-hover-text-decoration: var(--link-text-decoration) /* Link hover decoration */
```

---

## 🎪 **Social Brand Colors**

### **Social Media Brands**
```css
--facebook-color: #1877F2      /* Facebook brand blue */
--twitter-color: #55ACEE       /* Twitter brand blue */
--linked-in-color: #1F88BE     /* LinkedIn brand blue */
--youtube-color: #FF0000       /* YouTube brand red */
--pinterest-color: #BD081C     /* Pinterest brand red */
--instagram-color: #FD1D1D     /* Instagram brand red */
```

---

## 💡 **Usage Guidelines**

### **CRITICAL: Theme-Adaptive Tokens**
**ALWAYS use `standard-` and `inverted-` tokens for theme compatibility:**

```css
/* ✅ CORRECT - Automatically adapts to light/dark */
.text {
  color: var(--text-color);          /* Uses standard-80 */
  background: var(--standard-5);     /* Light in light mode, dark in dark mode */
  border: var(--border);             /* Theme-adaptive border */
}

/* ❌ WRONG - Hardcoded colors break in dark mode */
.text {
  color: black;
  background: #f5f5f5;
  border: 1px solid #ddd;
}
```

### **Common Usage Patterns**
```css
/* Text hierarchy */
color: var(--header-color);        /* Primary headers */
color: var(--text-color);          /* Body text */
color: var(--muted-text-color);    /* Secondary text */
color: var(--light-text-color);    /* Tertiary text */

/* Background layers */
background: var(--page-background); /* Page background */
background: var(--standard-5);      /* Card backgrounds */
background: var(--standard-10);     /* Subtle elevated backgrounds */

/* Borders */
border: var(--border);              /* Standard borders */
border: var(--subtle-border);       /* Light borders */
border: var(--strong-border);       /* Emphasized borders */

/* Branded elements */
color: var(--primary-text-color);   /* Primary brand text */
background: var(--blue-background); /* Branded backgrounds */
border: var(--blue-border);         /* Branded borders */
```

### **Sizing Recommendations**
```css
/* Use semantic sizes for scalability */
font-size: var(--large);           /* Instead of 16px */
padding: var(--12px);               /* For precise pixel control */
margin: var(--spacing);             /* For consistent spacing */
border-radius: var(--border-radius); /* For consistent rounding */
```

---

**Source Verification**: All tokens verified from `/dist/semantic-ui.css` on compilation date.