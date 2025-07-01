# Semantic UI CSS Guide

**Purpose**: Essential CSS patterns for building custom components using Semantic UI primitives  
**Audience**: AI agents building custom components with existing UI primitives

## Core Philosophy

**Build WITH primitives, not FROM scratch**. Use existing Semantic UI components (`ui-button`, `ui-input`, `ui-card`, etc.) as building blocks. Add minimal CSS only for layout, spacing, and component-specific behavior.

### Discovering Primitive Capabilities

**CRITICAL**: Before using any primitive, verify its available attributes and options by reading its spec files:

- **Entry point**: `src/specs/specs.js` - Lists all available component specs
- **Component specs**: `src/components/{component}/specs/{component}-component.json` - Complete attribute definitions
- **Never guess attributes** - Icons, colors, sizes, etc. must be verified in spec files

**Example**: For `<ui-icon>`, read `src/components/icon/specs/icon-component.json` to find:
- Available icons: `check`, `arrow-right`, `settings`, etc. (200+ options)
- Size options: `mini`, `tiny`, `small`, `large`, `huge`, etc.
- Color options: `red`, `blue`, `green`, etc.
- States: `disabled`, `loading`, `spin`, etc.

### Flexible Attribute Syntax

The framework supports multiple attribute syntaxes and intelligent value matching:

```html
<!-- ✅ RECOMMENDED: Concise syntax -->
<ui-button large primary>Submit</ui-button>
<ui-icon arrow-right large></ui-icon>

<!-- ✅ ACCEPTABLE: Verbose syntax when needed -->
<ui-button size="large" emphasis="primary">Submit</ui-button>
<ui-icon icon="arrow-right" size="large"></ui-icon>

<!-- ✅ ACCEPTABLE: Classic class syntax -->
<ui-button class="large primary">Submit</ui-button>
```

**Recommendation**: Use concise syntax (`<ui-button large primary>`) for cleaner, more readable code.

The system automatically handles:
- **Space to dash conversion**: `"right arrow"` → `"arrow-right"`
- **Dash order reversal**: `"right-arrow"` ↔ `"arrow-right"`  
- **Multiple syntax forms**: attribute values, boolean attributes, class names

### Primary Development Approach

```html
<!-- ✅ CORRECT: Use existing primitives with concise syntax -->
<div class="my-form">
  <ui-input class="email" placeholder="Email"></ui-input>
  <ui-button class="submit" primary>Submit</ui-button>
</div>
```

```css
/* ✅ CORRECT: Minimal CSS for layout */
.my-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
  max-width: 400px;
}
```

### Avoid Recreating Primitives

```html
<!-- ❌ WRONG: Recreating button functionality -->
<button class="custom-button primary">Submit</button>
```

## Design Token System

**CRITICAL**: Always reference the canonical token files to discover available tokens. **Never guess or hallucinate token names.**

### Token Discovery Process

**MANDATORY**: Use Read tool to examine these files for complete token listings:

1. **`src/css/tokens/global/constants.css`** - Fundamental color definitions
2. **`src/css/tokens/global/typography.css`** - Font sizes, weights, families
3. **`src/css/tokens/global/layout.css`** - Spacing, sizing, layout values
4. **`src/css/tokens/global/interaction.css`** - Transitions, animations, timing
5. **`src/css/tokens/global/visual.css`** - Borders, shadows, effects
6. **`src/css/tokens/computed/colors.css`** - Computed color scales
7. **`src/css/tokens/themes/computed/base.css`** - Theme-adaptive tokens

### Essential Token Categories

**Always verify tokens exist in the source files before using them.**

#### Theme-Adaptive Colors
Use these tokens that automatically adapt between light/dark themes:
- `--standard-5` through `--standard-100` (check computed/colors.css for exact range)
- `--inverted-5` through `--inverted-100` (check computed/colors.css for exact range)
- `--text-color`, `--border-color`, `--page-background` (verify in base.css)

#### Spacing & Layout
**MANDATORY**: Use Read tool on `src/css/tokens/global/layout.css` to discover all available spacing tokens:
- Do not use any spacing tokens without first verifying they exist in the source file
- Common tokens that exist: `--spacing`, `--compact-spacing` (but always verify exact names)
- Never guess or create new token names like `--medium-spacing`, `--large-spacing`

**CRITICAL**: Also examine `src/css/tokens/computed/em-sizing.css` for the sophisticated em-based sizing system:
- Tokens like `--2px`, `--4px`, `--8px` etc. represent pixel values at base em size
- These scale automatically when parent elements have `font-size: large` or `font-size: small`
- Essential for components that need to scale proportionally with text size

#### Typography
**MANDATORY**: Use Read tool on `src/css/tokens/global/typography.css` to discover all available typography tokens:
- Do not use any typography tokens without first verifying they exist in the source file
- Some tokens may exist like `--small`, `--large`, `--bold` (but always verify exact names)
- Never guess or create new token names like `--extra-large`, `--semi-bold`

#### Effects
**MANDATORY**: Use Read tool on `src/css/tokens/global/visual.css` and `src/css/tokens/global/interaction.css`:
- Do not use any effect tokens without first verifying they exist in the source files
- Some tokens may exist for borders, shadows, transitions (but always verify exact names)
- Never guess or create new token names

### Token Usage Pattern

```css
/* ✅ CORRECT: Use verified tokens */
.custom-component {
  padding: var(--spacing);           /* Verify exists in layout.css */
  border-radius: var(--border-radius); /* Verify exists in visual.css */
  background: var(--standard-5);     /* Verify exists in computed/colors.css */
  transition: var(--transition);     /* Verify exists in interaction.css */
}

/* ✅ CORRECT: Em-based sizing for scalable components */
.scalable-component {
  padding: var(--8px);               /* 8px at base size, scales with font-size */
  margin: var(--4px);                /* 4px at base size, scales with font-size */
  border-width: var(--1px);          /* 1px at base size, scales with font-size */
}

/* ❌ WRONG: Guessing token names */
.custom-component {
  padding: var(--medium-spacing);    /* May not exist */
  color: var(--primary-text);        /* May not exist */
}

/* ❌ WRONG: Fixed pixel values don't scale */
.scalable-component {
  padding: 8px;                      /* Won't scale with parent font-size */
}
```

## Component Composition Patterns

### Layout Components

```html
<div class="dashboard">
  <ui-card class="stats-card">
    <ui-button compact>Refresh</ui-button>
  </ui-card>
  <ui-card class="chart-card">
    <!-- Custom chart content -->
  </ui-card>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing);
}

.stats-card {
  --card-padding: var(--compact-spacing);
}
```

### Form Components

```html
<form class="settings-form">
  <div class="field">
    <label>Theme</label>
    <ui-input class="theme-input" placeholder="Enter theme"></ui-input>
  </div>
  <div class="actions">
    <ui-button class="cancel">Cancel</ui-button>
    <ui-button class="save" primary>Save</ui-button>
  </div>
</form>
```

```css
.settings-form {
  max-width: 500px;
}

.field {
  margin-bottom: var(--spacing);
}

.actions {
  display: flex;
  gap: var(--spacing);
  justify-content: flex-end;
}
```

## Theme Handling

### Automatic Theme Adaptation

Primitives handle theme switching automatically. Your CSS should use theme-adaptive tokens:

```css
/* ✅ CORRECT: Theme-adaptive */
.wrapper {
  background: var(--standard-5);    /* Adapts to theme */
  border: 1px solid var(--standard-15);
}

/* ❌ WRONG: Fixed colors */
.wrapper {
  background: #f5f5f5;              /* Only works in light theme */
}
```

### Theme-Specific Overrides

When you need theme-specific styling, use container style queries:

```css
/* Base styles */
.custom-element {
  filter: blur(2px);
}

/* Dark mode override */
@container style(--dark-mode: true) {
  .custom-element {
    filter: blur(4px) brightness(1.2);
  }
}
```

## Container Queries for Responsiveness

### Basic Container Setup

```css
:host {
  display: block;
  container: component / inline-size;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing);
}

@container component (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### Dynamic Breakpoints with CSS Variables

For customizable breakpoints, use the flag technique:

```css
:host {
  --mobile-breakpoint: 600px;
  container: component / inline-size;
}

.container {
  --mobile-flag: max(calc(100cqi - var(--mobile-breakpoint)), 0px);
}

@container style(--mobile-flag: 0) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

## HTML & CSS Patterns

**MANDATORY**: Follow all HTML patterns from `ai/guides/html-css-style-guide.md`. Key requirements:

### Class Naming and Element Targeting
- **Use semantic, purpose-driven class names** (not implementation details)
- **NEVER use ID attributes for styling** - always use classes for element targeting
- **Follow natural language naming patterns** as outlined in the HTML style guide

```html
<!-- ✅ CORRECT: Semantic class names, no IDs -->
<div class="color-picker">
  <div class="preview">
    <ui-button class="current-color"></ui-button>
  </div>
  <div class="controls">
    <ui-input class="hex-input" placeholder="#000000"></ui-input>
  </div>
</div>

<!-- ❌ WRONG: Implementation details, ID usage -->
<div class="flex-container">
  <div class="absolute-positioned">
    <ui-button id="submitBtn">Submit</ui-button>
  </div>
</div>
```

### CSS Nesting and Architecture

**MANDATORY**: Use CSS nesting to mirror HTML hierarchy as specified in `ai/guides/html-css-style-guide.md`:

```css
.color-picker {
  max-width: 400px;
  
  .preview {
    padding: var(--spacing);
    margin-bottom: var(--spacing);
    
    .current-color {
      width: 100%;
    }
  }
  
  .controls {
    display: flex;
    gap: var(--spacing);
    
    .hex-input {
      flex: 1;
    }
  }
}

## JavaScript Integration

### CSS Variable Manipulation

```javascript
// Set CSS variables for theming
$(el).cssVar('primary-color', '#007bff');
```

### Theme Change Reactions

```javascript
defineComponent({
  onThemeChanged: ({ darkMode }) => {
    if (darkMode) {
      // Update charts, canvases, or external libraries
      chart.updateTheme('dark');
    }
  }
});
```

## Best Practices

### ✅ DO

1. **Use existing primitives** - `ui-button`, `ui-input`, `ui-card`, etc.
2. **Verify tokens in source files** - Never guess token names
3. **Use em-based sizing tokens** - `--2px`, `--4px`, etc. for scalable components
4. **Keep CSS minimal** - Focus on layout and composition
5. **Use container queries** - For component-responsive behavior
6. **Use semantic class names** - Describe purpose, not implementation

### ❌ DON'T

1. **Don't recreate primitive functionality** - Use existing `ui-*` components
2. **Don't guess token names** - Always verify in `src/css/tokens/`
3. **Don't use complex CSS architecture** - Keep styling simple
4. **Don't use IDs for styling** - Use classes for flexibility
5. **Don't hardcode colors** - Use theme-adaptive tokens

## Token Verification Workflow

Before using any token:

1. **Read the source file**: Use Read tool on relevant `src/css/tokens/` file
2. **Find the exact token name**: Look for the CSS variable definition
3. **Use the verified token**: Copy the exact name from the source
4. **Test theme adaptation**: Ensure it works in both light and dark modes

## Quick Reference

### Common Verified Pattern

```css
/* Always verify these tokens exist in source files */
.component {
  padding: var(--spacing);
  background: var(--standard-5);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

/* Container query responsive */
@container component (max-width: 600px) {
  .component {
    padding: var(--compact-spacing);
  }
}
```

This guide ensures you build maintainable custom components by leveraging the existing primitive system while adding only the minimal CSS needed for your specific use case.