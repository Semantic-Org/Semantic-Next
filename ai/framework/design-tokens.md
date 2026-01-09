---
title: Semantic UI CSS Token Guide
description: Comprehensive guide to the design token system, including color scales, spacing tokens, typography, visual effects, and theme-aware computed values.
keywords: [design tokens, CSS variables, color scales, spacing, typography, theming, OKLCH]
audience: framework
skill: design-tokens
type: doc
---

# Semantic UI CSS Token Guide

**Purpose**: Comprehensive guide to the design token system
**Audience**: Developers working with design tokens and CSS variables

## Token System Overview

The Semantic UI design token system provides a sophisticated, theme-aware foundation for consistent styling across all components. The token architecture separates concerns between global definitions, computed values, and theme-specific overrides.

## Token Directory Structure

```
src/css/
├── tokens.css        # Main orchestrator file
└── tokens/
    ├── global/       # Base token definitions
    │   ├── constants.css     # Core constants
    │   ├── typography.css    # Base typography
    │   ├── layout.css       # Layout fundamentals
    │   ├── interaction.css  # Animations, transitions
    │   ├── visual.css       # Effects, spacing
    │   └── brands.css       # Brand colors
    ├── computed/     # Theme-agnostic calculated values
    │   ├── typography.css    # Type scales
    │   ├── em-sizing.css    # Em-based spacing
    │   ├── layout.css       # Layout calculations
    │   ├── colors.css       # Color computations
    │   └── interaction.css  # Interaction values
    └── themes/       # Theme-specific values
        ├── light/    # Light theme base
        │   ├── base.css         # Theme flags
        │   ├── colors.css       # Color scales
        │   └── interaction.css  # Interactions
        ├── dark/     # Dark theme base
        │   ├── base.css         # Theme flags
        │   ├── colors.css       # Color scales
        │   ├── interaction.css  # Interactions
        │   └── effects.css      # Dark effects
        └── computed/ # Theme-aware computed
            ├── base.css         # Standard/inverted
            ├── colors.css       # Color tokens
            ├── typography.css   # Type tokens
            ├── brand.css        # Brand colors
            ├── layout.css       # Layout tokens
            ├── effects.css      # Visual effects
            ├── state-colors.css # Semantic state colors
            └── interaction.css  # Interactions
```

## Token Verification Workflow

**MANDATORY**: Always verify token existence before use:

```css
/* ✅ CORRECT: Verify token exists */
/* 1. Read src/css/tokens/global/visual.css */
/* 2. Confirm --spacing token exists */
/* 3. Use exact token name */
.component {
  padding: var(--spacing);
}

/* ❌ WRONG: Assuming tokens exist */
.component {
  padding: var(--component-padding); /* May not exist */
}
```

## Color Token System

### Base Color Scales

**Every hue provides a 0-100 scale:**

```css
/* Primary color scales */
--red-0, --red-5, --red-10, ... --red-95, --red-100
--blue-0, --blue-5, --blue-10, ... --blue-95, --blue-100
--green-0, --green-5, --green-10, ... --green-95, --green-100
```

### Theme-Aware Colors

**The `--standard-*` and `--inverted-*` tokens automatically adapt between themes:**

```css
/* ✅ Automatic theme adaptation */
.card {
  background: var(--standard-5);     /* Light: 5% black, Dark: 5% white */
  border: 1px solid var(--standard-15);
}

/* Inverted provides the opposite color */
.inverted-section {
  background: var(--inverted-5);     /* Light: 5% white, Dark: 5% black */
  color: var(--inverted-90);
}
```

> **Important**: These tokens use OKLCH color space and sophisticated remapping. For complete understanding of the theme system, see `ai/guides/css/theming.md`

### Semantic Color Tokens

```css
/* Global semantic colors */
--text-color            /* Primary text color */
--muted-text-color      /* Secondary text color */
--border-color          /* Default border color */
--page-background       /* Page background color */
--component-background  /* Component background color */
```

## Spacing Token System

### Em-Based Sizing

**All spacing tokens scale with parent font-size:**

```css
/* Em-based tokens that scale automatically */
--2px, --4px, --6px, --8px, --12px, --16px, --24px, --32px

/* Usage examples */
.button {
  padding: var(--8px) var(--16px);  /* Scales with font-size */
  margin-bottom: var(--12px);
}

/* Parent with larger font-size automatically scales children */
.large-context {
  font-size: 1.2em;  /* All --Npx tokens now 20% larger */
}
```

### Standard Spacing

```css
/* Fixed spacing tokens */
--compact-spacing       /* Tight spacing within components */
--spacing              /* Standard spacing between elements */
--section-spacing      /* Larger spacing between sections */
```

## Typography Tokens

### Font Sizes

```css
/* Semantic size tokens */
--small, --medium, --large, --huge
--h1, --h2, --h3, --h4, --h5, --h6

/* Usage */
.title {
  font-size: var(--h2);
  font-weight: var(--bold);
}
```

### Font Weights

```css
--normal, --bold, --light
```

## Visual Effect Tokens

### Border Radius

```css
--border-radius         /* Standard border radius */
--small-border-radius   /* Subtle rounding */
--large-border-radius   /* Prominent rounding */
```

### Shadows

```css
--subtle-shadow         /* Light drop shadow */
--floating-shadow       /* Elevated element shadow */
--deep-shadow          /* Prominent shadow */
```

### Transitions

```css
--transition           /* Standard transition timing */
--fast-transition      /* Quick state changes */
--slow-transition      /* Smooth, deliberate changes */
```

## Computed Token System

### Theme-Aware Calculations

**Computed tokens automatically adjust based on theme context:**

```css
/* From src/css/tokens/computed/themes.css */
--computed-text-contrast: calc(var(--standard-90) * var(--light-mode-factor));
--computed-border-opacity: calc(0.1 + (0.15 * var(--dark-mode-factor)));
```

### Dynamic Sizing

```css
/* Responsive sizing based on container */
--responsive-padding: calc(var(--spacing) * var(--container-size-factor));
--adaptive-font-size: calc(var(--base-size) * var(--scale-factor));
```

## Theme Integration

### Automatic Theme Adaptation

Most styling should use theme-aware tokens that automatically adapt:

```css
/* Component automatically adapts to current theme */
.component {
  background: var(--standard-5);     /* Adapts: light gray ↔ dark gray */
  color: var(--text-color);          /* Adapts: dark text ↔ light text */
  border: 1px solid var(--standard-15);
}
```

### Theme-Specific Overrides

**Only use container style queries for effects that can't be expressed with tokens:**

```css
@container style(--dark-mode: true) {
  .glass-panel {
    /* Dark mode needs more blur for visibility */
    backdrop-filter: blur(8px) brightness(1.1);
  }
}

@container style(--light-mode: true) {
  .glass-panel {
    /* Light mode uses subtle shadows */
    box-shadow: inset 0 0 10px var(--standard-10);
  }
}
```

### Available Theme Variables

```css
/* Boolean flags */
--dark-mode: true/false
--light-mode: true/false

/* Numeric factors for calculations */
--dark-mode-factor: 1 (in dark) or 0 (in light)
--light-mode-factor: 1 (in light) or 0 (in dark)
```

> **For complete theming documentation**: See `ai/guides/css/theming.md` for how the theme system works, including the standard/inverted swap mechanism, color scale inversions, and OKLCH color computations.

## Custom Property Guidelines

### When to Create Custom Properties

**Only create custom properties for component-specific values:**

```css
:host {
  /* ✅ Component-specific measurements */
  --slider-height: 6px;
  --handle-size: 20px;
  --track-border-radius: 3px;
  
  /* ✅ Map to design tokens */
  --track-color: var(--standard-10);
  --fill-color: var(--primary-color);
  --handle-color: var(--white);
}
```

### Anti-Patterns

```css
/* ❌ DON'T recreate existing tokens */
:host {
  --component-text-color: var(--text-color);     /* Unnecessary wrapper */
  --component-spacing: var(--spacing);           /* Already exists */
  --component-border-radius: var(--border-radius); /* Already exists */
}
```

## Token Usage Patterns

### Component Styling

```css
.interactive-element {
  /* Use tokens directly */
  padding: var(--8px) var(--12px);
  background: var(--standard-5);
  border: 1px solid var(--standard-15);
  border-radius: var(--border-radius);
  color: var(--text-color);
  transition: var(--transition);
  
  &:hover {
    background: var(--standard-10);
    box-shadow: var(--subtle-shadow);
  }
  
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}
```

### Responsive Scaling

```css
.scalable-component {
  /* Em-based tokens scale with font-size */
  padding: var(--8px);
  margin: var(--12px);
  gap: var(--6px);
  
  /* Parent context affects all child em-based measurements */
  &.large {
    font-size: 1.25em; /* All --Npx tokens now 25% larger */
  }
  
  &.small {
    font-size: 0.875em; /* All --Npx tokens now 12.5% smaller */
  }
}
```

## Cross-References

**Related guides:**
- **HTML structure**: See `ai/guides/html/style-guide.md` for semantic markup patterns
- **CSS architecture**: See `ai/guides/styling/css-guide.md` for nesting and responsive design
- **Primitive usage**: See `ai/guides/primitives.md` for using existing primitives

## Token Verification Checklist

### Before Using Any Token

1. **Read the token file**: Use Read tool on `src/css/tokens/global/visual.css` or relevant file
2. **Find exact token name**: Copy the exact `--token-name` from source
3. **Verify token scope**: Ensure token is appropriate for your use case
4. **Use without modification**: Never wrap tokens in custom properties unless necessary

### Common Token Files to Check

- **Base constants**: `src/css/tokens/global/constants.css`
- **Typography base**: `src/css/tokens/global/typography.css`
- **Spacing/Effects**: `src/css/tokens/global/visual.css`
- **Animations/Transitions**: `src/css/tokens/global/interaction.css`
- **Brand colors**: `src/css/tokens/global/brands.css`
- **Em-based sizing**: `src/css/tokens/computed/em-sizing.css`
- **Theme flags**: `src/css/tokens/themes/light/base.css`, `src/css/tokens/themes/dark/base.css`
- **Standard/Inverted tokens**: `src/css/tokens/themes/computed/base.css`
- **Theme color scales**: `src/css/tokens/themes/computed/colors.css`

## Best Practices Summary

### ✅ DO
1. **Verify token existence before use**
2. **Use theme-invariant tokens (--standard-N, --inverted-N)**
3. **Leverage em-based sizing tokens for scalable components**
4. **Create custom properties only for component-specific values**
5. **Map custom properties to design tokens when possible**

### ❌ DON'T
1. **Assume tokens exist without verification**
2. **Recreate existing tokens as custom properties**
3. **Use hardcoded values when tokens exist**
4. **Create theme-specific custom properties**
5. **Guess token names**

This token system provides the foundation for consistent, theme-aware, and scalable styling across the entire Semantic UI framework. Always verify, never assume, and leverage the sophisticated token architecture that's already built.