# CSS Token Architecture Guide

## Token System Hierarchy

### Directory Structure
```
src/css/
├── tokens.css                    # Main cascade orchestrator
└── tokens/
    ├── global/                   # Base token definitions
    │   ├── constants.css        # Core constants
    │   ├── typography.css       # Typography base values
    │   ├── layout.css          # Layout base values
    │   ├── interaction.css     # Animation/transition values
    │   ├── visual.css          # Visual effects, spacing
    │   └── brands.css          # Brand color definitions
    ├── computed/                 # Theme-agnostic computed values
    │   ├── typography.css       # Calculated type scales
    │   ├── em-sizing.css       # Em-based spacing tokens
    │   ├── layout.css          # Layout calculations
    │   ├── colors.css          # Color calculations
    │   └── interaction.css     # Computed interactions
    └── themes/                   # Theme-aware values
        ├── light/                # Light theme base values
        │   ├── base.css         # Theme flags and swaps
        │   ├── colors.css       # Light color scales
        │   └── interaction.css  # Light interactions
        ├── dark/                 # Dark theme overrides
        │   ├── base.css         # Theme flags and swaps
        │   ├── colors.css       # Dark color scales
        │   ├── interaction.css  # Dark interactions
        │   └── effects.css      # Dark-specific effects
        └── computed/             # Theme-aware computed values
            ├── base.css         # Standard/inverted tokens
            ├── colors.css       # Theme-dependent colors
            ├── typography.css   # Theme typography
            ├── brand.css        # Brand color variations
            ├── layout.css       # Theme layouts
            ├── effects.css      # Theme effects
            ├── state-colors.css # Semantic state colors (positive/negative/info/warning)
            └── interaction.css  # Theme interactions
```

## Two Computation Contexts

### 1. Theme-Agnostic Computed (`tokens/computed/`)
Values derived from base tokens that remain constant across themes.

**Characteristics:**
- Computed once from base units
- No theme awareness
- Mathematical relationships only
- Imported early in cascade

**Examples:**
```css
/* Spacing scale from base unit */
--space-2x: calc(var(--base-unit) * 2);
--space-4x: calc(var(--base-unit) * 4);

/* Type scale from base size */
--font-large: calc(var(--base-font-size) * 1.25);
--font-xlarge: calc(var(--base-font-size) * 1.5);
```

### 2. Theme-Aware Computed (`tokens/themes/computed/`)
Values that depend on theme-specific base values.

**Characteristics:**
- Computed from theme-aware variables
- Must import after theme layers
- Inherits overridden values
- Provides final token API

**Examples:**
```css
/* Uses theme-aware --lightness-20 which inverts in dark mode */
--surface-subtle: oklch(from var(--base) calc(l * var(--lightness-20)) c h);

/* References theme-specific opacity scale */
--overlay-backdrop: rgb(0 0 0 / var(--opacity-backdrop));
```

> **For complete theming details**: See `ai/guides/css/theming.md` for how the standard/inverted swapping and color scale inversions work.

## CSS Layer Architecture

### Critical Import Order (tokens.css)
```css
/* 1. Global base tokens */
@import url('./tokens/global/constants.css') layer(tokens.global.constants);
@import url('./tokens/global/typography.css') layer(tokens.global.typography);
@import url('./tokens/global/layout.css') layer(tokens.global.layout);
@import url('./tokens/global/visual.css') layer(tokens.global.visual);

/* 2. Theme-agnostic computed values */
@import url('./tokens/computed/typography.css') layer(tokens.computed.typography);
@import url('./tokens/computed/em-sizing.css') layer(tokens.computed.emSizing);
@import url('./tokens/computed/layout.css') layer(tokens.computed.layout);
@import url('./tokens/computed/colors.css') layer(tokens.computed.colors);

/* 3. Light theme base values */
@import url('./tokens/themes/light/base.css') layer(tokens.themes.light.base);
@import url('./tokens/themes/light/colors.css') layer(tokens.themes.light.colors);

/* 4. Dark theme overrides */
@import url('./tokens/themes/dark/base.css') layer(tokens.themes.dark.base);
@import url('./tokens/themes/dark/colors.css') layer(tokens.themes.dark.colors);

/* 5. Theme-aware computed values (MUST be last) */
@import url('./tokens/themes/computed/base.css') layer(tokens.themes.computed.base);
@import url('./tokens/themes/computed/colors.css') layer(tokens.themes.computed.colors);
@import url('./tokens/themes/computed/typography.css') layer(tokens.themes.computed.typography);
```

**RULE:** Theme-aware computed MUST come after all theme definitions.

## Variable Resolution Patterns

### Pattern 1: Direct Theme Override
Base value → Theme override → Consumer

```css
/* Light theme */
--opacity-hover: 0.1;

/* Dark theme */
--opacity-hover: 0.15;  /* Override for better visibility */

/* Consumer */
.interactive:hover {
  background: rgb(255 255 255 / var(--opacity-hover));
}
```

### Pattern 2: Computed from Theme Variables
Base value → Theme override → Computed token → Consumer

```css
/* Light theme */
--scale-factor: 1;

/* Dark theme */
--scale-factor: 0.5;  /* Invert scale */

/* Theme-aware computed */
--emphasis-strong: calc(var(--base-emphasis) * var(--scale-factor));

/* Consumer */
.highlight {
  opacity: var(--emphasis-strong);
}
```

### Pattern 3: Invariant References
Base value → Invariant token → Consumer (ignores theme)

```css
/* Base definition (never overridden) */
--base-grid-size: 8px;

/* Invariant reference */
--grid-invariant: var(--base-grid-size);

/* Consumer - same in all themes */
.grid {
  gap: var(--grid-invariant);
}
```

## Token Categories by Computation Type

### Global Base Tokens (`tokens/global/`)
- Constants and core values
- Base typography settings
- Layout fundamentals
- Interaction timing
- Visual effect bases
- Brand color definitions

### Theme-Agnostic Computed (`tokens/computed/`)
- Typography scales
- Em-based sizing (`--2px`, `--4px`, etc.)
- Layout calculations
- Color manipulations (non-theme-dependent)
- Interaction computations

### Theme-Specific Base (`tokens/themes/{light,dark}/`)
- Theme flags (`--dark-mode`, `--light-mode`)
- Color scale multipliers
- Lightness/chroma values
- Theme-specific interactions
- Visual effects overrides

### Theme-Aware Computed (`tokens/themes/computed/`)
- Standard/inverted color tokens
- Semantic color scales (red-5, blue-10, etc.)
- Typography with theme awareness
- Brand color variations
- Layout with theme adaptations
- Visual effects (shadows, borders)
- Message type colors (error, warning, success)
- Theme-dependent interactions

## Architectural Principles

### 1. Separation of Concerns
- Base values: Define the source truth
- Theme values: Override for theme adaptation
- Computed values: Derive final tokens

### 2. Cascade Awareness
- Import order determines inheritance
- Later layers override earlier ones
- Computed layers must see theme overrides

### 3. Single Source of Truth
- Each value has one canonical definition
- Overrides are explicit and traceable
- No duplicate definitions across contexts

### 4. Progressive Enhancement
```css
/* Base functionality */
--spacing: var(--base-spacing);

/* Theme enhancement */
--spacing: var(--theme-spacing, var(--base-spacing));

/* Computed enhancement */
--spacing-responsive: calc(var(--spacing) * var(--scale-factor));
```

### 5. Token API Stability
Consumers use computed tokens, not base values:
```css
/* Consumer ALWAYS uses computed token */
padding: var(--space-4);  /* NOT var(--base-unit) * 4 */
```

## Variable Naming Conventions

### Base Values
```css
--base-[property]: value;        /* Single source */
--base-unit: 4px;
--base-radius: 4px;
```

### Working Values
```css
--[property]: value;             /* Can be overridden */
--radius: var(--base-radius);
--emphasis: var(--base-emphasis);
```

### Computed Values
```css
--[semantic-name]: computation;  /* Final API */
--radius-small: calc(var(--radius) * 0.5);
--surface-raised: var(--elevation-1);
```

### Invariant Values
```css
--[property]-invariant: value;   /* Never changes */
--grid-invariant: var(--base-grid);
--ratio-invariant: var(--base-ratio);
```

## Common Architectural Patterns

### Scale Generation
```css
/* Base */
--base-scale: 1.25;

/* Computed */
--scale-1: var(--base-scale);
--scale-2: calc(var(--scale-1) * var(--base-scale));
--scale-3: calc(var(--scale-2) * var(--base-scale));
```

### Contextual Computation
```css
/* Theme sets context */
--context-multiplier: 1;    /* Light */
--context-multiplier: -1;   /* Dark (inverted) */

/* Computed uses context */
--directional-value: calc(var(--base-value) * var(--context-multiplier));
```

### Conditional Defaults
```css
/* Computed with fallback */
--final-value: var(--theme-override, var(--base-default));
```

## Anti-Patterns to Avoid

### 1. Computing in Wrong Context
```css
/* WRONG: Theme-aware computation in theme-agnostic context */
/* tokens/computed/spacing.css */
--space-emphasis: calc(var(--base-space) * var(--theme-multiplier));
```

### 2. Direct Base References in Consumers
```css
/* WRONG: Consumer uses base value directly */
.component {
  padding: calc(var(--base-unit) * 4);
}

/* CORRECT: Use computed token */
.component {
  padding: var(--space-4);
}
```

### 3. Circular Dependencies
```css
/* WRONG: Circular reference */
--value-a: calc(var(--value-b) * 2);
--value-b: calc(var(--value-a) / 2);
```

### 4. Theme Logic in Base Layer
```css
/* WRONG: Theme awareness in base definition */
/* tokens/themes/light/base.css */
--base-value: var(--dark-mode) ? 0 : 1;
```

## Debugging Token Resolution

### Resolution Order Verification
1. Check import order in tokens.css
2. Verify layer names match exactly
3. Confirm computed imports after themes
4. Validate no duplicate imports

### Variable Tracing
```css
/* Add debug variables to trace resolution */
--debug-source: 'light-theme';
--debug-computed: calc(var(--base) * var(--multiplier));
```

### Common Resolution Issues
- Theme-aware computed importing too early
- Missing intermediate variable definitions
- Conflicting layer names
- Circular dependency chains

## Token System Extension

### Adding New Token Category
1. Determine computation type (theme-agnostic vs theme-aware)
2. Create appropriate file in correct directory
3. Add import in correct position in tokens.css
4. Define base → working → computed chain
5. Document token API for consumers

### Migration Strategy
When moving tokens between computation contexts:
1. Identify all consumers
2. Create new computed tokens
3. Update imports in correct order
4. Migrate consumers to new tokens
5. Remove old definitions

## Performance Considerations

### Computation Costs
- Theme-agnostic: Computed once per page load
- Theme-aware: Recomputed on theme change
- Complex calculations: Consider pre-computing

### Optimization Patterns
```css
/* Pre-compute complex values */
--complex-result: 0.7071;  /* sqrt(2)/2 */

/* Instead of */
--complex-result: calc(sqrt(2) / 2);
```