# Semantic UI CSS Token Guide

**Purpose**: Comprehensive guide to the design token system  
**Audience**: Developers working with design tokens and CSS variables

## Token System Overview

The Semantic UI design token system provides a sophisticated, theme-aware foundation for consistent styling across all components. The token architecture separates concerns between global definitions, computed values, and theme-specific overrides.

## Token Directory Structure

```
src/css/tokens/
├── global/           # Base token definitions
│   ├── colors.css    # Color scales and base colors
│   ├── visual.css    # Typography, spacing, effects
│   └── interaction.css # Transitions, animations
├── computed/         # Calculated and derived tokens
│   ├── global.css    # Computed global tokens
│   └── themes.css    # Theme-aware computed values
└── themes/           # Theme-specific mappings
    ├── light.css     # Light theme definitions
    └── dark.css      # Dark theme definitions
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

### Theme-Invariant Colors

**Use standard/inverted tokens for automatic theme adaptation:**

```css
/* ✅ Theme-adaptive backgrounds */
.card {
  background: var(--standard-5);     /* Light: light gray, Dark: dark gray */
  border: 1px solid var(--standard-15);
}

.inverted-card {
  background: var(--inverted-5);     /* Opposite of standard */
  color: var(--inverted-90);
}
```

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

### Light/Dark Mode Detection

**Use container style queries for theme-specific overrides:**

```css
/* Component adapts to theme automatically via tokens */
.component {
  background: var(--standard-5);     /* Auto-adapts */
  color: var(--text-color);          /* Auto-adapts */
}

/* Override when tokens can't express the difference */
@container style(--dark-mode: true) {
  .component {
    filter: brightness(1.1);
    backdrop-filter: blur(4px);
  }
}

@container style(--light-mode: true) {
  .component {
    box-shadow: inset 0 0 10px var(--standard-10);
  }
}
```

### Theme Variables

```css
/* Available theme detection variables */
--dark-mode: true       /* Set when dark theme active */
--light-mode: true      /* Set when light theme active */
--dark-mode-factor: 0|1 /* Numeric for calculations */
--light-mode-factor: 1|0 /* Inverse of dark-mode-factor */
```

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

- **Colors**: `src/css/tokens/global/colors.css`
- **Spacing/Typography**: `src/css/tokens/global/visual.css`
- **Effects/Transitions**: `src/css/tokens/global/interaction.css`
- **Theme mappings**: `src/css/tokens/themes/light.css`

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