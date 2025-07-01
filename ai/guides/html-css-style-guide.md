# Semantic UI HTML & CSS Style Guide

This guide captures the distinctive patterns and philosophies for writing HTML and CSS within Semantic UI web components.

## Core Philosophy: Natural Language Applied to Markup

Your approach to HTML and CSS reflects a deep understanding of how natural language concepts can be applied to markup, creating intuitive, semantic, and maintainable code.

---

## HTML Style Patterns

### Semantic Element Naming

**Use natural language concepts for class names that describe purpose, not implementation:**

```html
<!-- ✅ Natural language describing function -->
<div class="slider">
  <div class="fill"></div>
  <div class="guide"></div>
  <div class="track"></div>
  <div class="handle"></div>
</div>

<!-- ✅ Purpose-driven naming -->
<div class="swatch">
  <div class="shade">dark</div>
  <div class="info">
    <div class="var">--primary-color</div>
    <div class="value">#007bff</div>
  </div>
</div>

<!-- ✅ Role-based naming -->
<div class="accordion">
  <div class="section">
    <div class="header">
      <span class="title">Section Title</span>
      <span class="icon">↓</span>
    </div>
    <div class="content">Section content</div>
  </div>
</div>
```

### Hierarchical Structure Through Nesting

**Reflect content hierarchy through natural DOM nesting:**

```html
<!-- ✅ Natural containment hierarchy -->
<div class="palette">
  <div class="group">
    <h3 class="name">Primary Colors</h3>
    <div class="colors">
      <div class="swatch">
        <div class="shade">500</div>
        <div class="info">
          <div class="var">--primary-500</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ✅ Form field containment -->
<div class="field">
  <label for="email">Email</label>
  <input type="text" id="email" name="email">
  <div class="error">Please enter a valid email</div>
  <div class="help">We'll never share your email</div>
</div>
```

### Component Part Identification

**Use `part` attribute for exposing component internals:**

```html
<!-- ✅ Parts for external styling -->
<div class="number">
  <div class="counter" part="counter">{number}</div>
</div>

<div class="menu" part="menu">
  <div class="item" part="menu-item">Item 1</div>
</div>
```

### Class-Based Element References ⚠️ **CRITICAL PATTERN**

**Avoid ID attributes - use class names for element targeting:**

```html
<!-- ✅ CORRECT: Use class names for element targeting -->
<ui-button class="submit" emphasis="primary">Submit</ui-button>
<select class="size">
  <option value="small">Small</option>
  <option value="large">Large</option>
</select>
<ui-input class="email" type="email" placeholder="Email">

<!-- ❌ WRONG: Using ID attributes -->
<ui-button id="submitBtn" emphasis="primary">Submit</ui-button>
<select id="sizeSelect">
  <option value="small">Small</option>
</select>
<ui-input id="emailInput" type="email">
```

**Why avoid IDs:**
- **Reusability**: Classes allow multiple instances, IDs enforce uniqueness
- **Maintainability**: Class-based queries are more flexible and consistent
- **Component isolation**: Classes work better with Shadow DOM encapsulation
- **Semantic clarity**: Element purpose described by class name, not arbitrary ID

### Data Attributes for State

**Use data attributes for component state and interaction:**

```html
<!-- ✅ Data attributes for component logic -->
<div class="header" data-index="{index}">
<div class="swatch" data-color="{name}" data-shade="{shade.name}">
<div class="field" data-name="{field.name}">
```

### Accessible Markup Integration

**Seamlessly integrate ARIA attributes:**

```html
<!-- ✅ Natural accessibility -->
<div class="menu" role="menu" part="menu">
  <div class="item" role="menuitem" tabindex="0">Menu Item</div>
</div>
```

---

## CSS Custom Properties Strategy

### ⭐ **KEY PRINCIPLE: Design Token vs. Custom Property Decision**

**Use provided design tokens when available. Only create custom CSS properties for component-specific values not covered by the global design system.**

### Available Global Design Tokens

**📍 Canonical Reference**: See `/src/css/tokens/` for complete token definitions:
- `/src/css/tokens/colors.css` - Full color scales and color system
- `/src/css/tokens/global.css` - Typography, spacing, layout, and core tokens  
- `/src/css/tokens/computed.css` - Calculated values and derived tokens
- `/src/css/tokens/themes/light.css` - Light theme color mappings
- `/src/css/tokens/themes/computed.css` - Theme-aware computed values

The framework provides extensive design tokens that should be used instead of custom properties:

#### **Colors** (Use these, don't recreate)
```css
/* ✅ Use provided color tokens */
color: var(--text-color);               /* Not: var(--component-text-color) */
background: var(--inverted-100);        /* Not: var(--component-background) */
border-color: var(--border-color);      /* Not: var(--component-border-color) */

/* Full color scales available */
--red-0 through --red-100               /* All hue scales 0-100 */
--standard-5 through --standard-100     /* Theme-aware neutrals */
--inverted-5 through --inverted-100     /* Theme-aware inverted */
```

#### **Spacing** (Use these, don't recreate)
```css
/* ✅ Use provided spacing tokens */
margin: var(--spacing);                 /* Not: var(--component-margin) */
padding: var(--compact-spacing);        /* Not: var(--component-padding) */
gap: var(--compact-spacing);            /* Not: var(--component-gap) */
```

#### **Typography** (Use these, don't recreate)
```css
/* ✅ Use provided size tokens */
font-size: var(--large);               /* Not: var(--component-font-size) */
font-weight: var(--bold);              /* Not: var(--component-font-weight) */
```

#### **Effects** (Use these, don't recreate)
```css
/* ✅ Use provided effect tokens */
border-radius: var(--border-radius);    /* Not: var(--component-border-radius) */
transition: var(--transition);          /* Not: var(--component-transition) */
box-shadow: var(--floating-shadow);     /* Not: var(--component-shadow) */
```

#### **Layout** (Use these, don't recreate)
```css
/* ✅ Use provided layout tokens */
z-index: var(--float-layer);           /* Not: var(--component-z-index) */
```

### When to Create Custom CSS Properties

**Only create custom properties for component-specific measurements and constraints not provided by the design system:**

```css
:host {
  /* ✅ Component-specific dimensions */
  --slider-height: 10px;               /* Component-specific measurement */
  --handle-size: 24px;                 /* Component-specific size */
  --card-width: 300px;                 /* Component-specific constraint */
  --card-image-max-height: 250px;      /* Component-specific limit */
  
  /* ✅ Component-specific theme mappings */
  --track-color: var(--standard-10);   /* Maps to design token */
  --fill-color: var(--yellow);         /* Maps to design token */
  --handle-color: var(--yellow);       /* Maps to design token */
}
```

### ❌ **Anti-Pattern Examples**

```css
/* ❌ Don't recreate what's already provided */
:host {
  --component-text-color: var(--text-color);      /* Unnecessary wrapper */
  --component-spacing: 1rem;                      /* Use var(--spacing) */
  --component-border-radius: 4px;                 /* Use var(--border-radius) */
  --component-transition: all 0.15s ease;         /* Use var(--transition) */
  --component-primary-color: var(--primary-color); /* Unnecessary wrapper */
}
```

### Natural CSS Nesting

**Use nesting to mirror HTML hierarchy and create readable, maintainable styles:**

```css
.palette {
  max-width: 1200px;
  margin: 0 auto;
  
  .group {
    margin-bottom: calc(var(--spacing) * 3);
    
    .name {
      color: var(--header-color);       /* ✅ Use design token */
      font-size: var(--h3);             /* ✅ Use design token */
      margin: 0 0 var(--spacing) 0;     /* ✅ Use design token */
      text-transform: capitalize;
    }
  }
  
  .colors {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0;
  }
}
```

### State-Based Styling

**Use natural class combinations and pseudo-selectors for states:**

```css
.swatch {
  cursor: pointer;
  transition: var(--transition);        /* ✅ Use design token */
  
  &:hover {
    z-index: 2;
    transform: scale(1.02);
    box-shadow: var(--floating-shadow); /* ✅ Use design token */
  }
  
  &.copied {
    transform: scale(1.05);
  }
}

.switch input:checked {
  ~ .slider {
    background-color: var(--blue);      /* ✅ Use design token */
    
    &:before {
      transform: translateX(20px);      /* ✅ Component-specific value OK */
    }
  }
  
  ~ .label {
    color: var(--standard-80);          /* ✅ Use design token */
  }
}
```

### Component-Specific CSS Property Pattern

**The correct pattern for component-specific values:**

```css
:host {
  /* Component-specific measurements that aren't design tokens */
  --slider-height: 10px;
  --handle-size: 24px;
  --track-color: var(--standard-10);    /* Maps to design token */
  --fill-color: var(--yellow);          /* Maps to design token */
}

.slider {
  height: var(--slider-height);         /* Use component property */
  background: var(--track-color);       /* Use component property → design token */
  border-radius: var(--border-radius);  /* Use design token directly */
  
  .handle {
    width: var(--handle-size);          /* Use component property */
    height: var(--handle-size);         /* Use component property */
    background: var(--fill-color);      /* Use component property → design token */
    border-radius: 50%;                 /* Direct value for circular */
    box-shadow: var(--floating-shadow); /* Use design token directly */
  }
}
```

### Progressive Enhancement Through Container Queries

**Use container queries for responsive behavior within components:**

```css
.colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  
  @container (max-width: 600px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  
  @container (max-width: 400px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/* Context-aware visibility */
@container (max-width: 400px) {
  .info {
    display: none;
  }
}
```

### Thoughtful Animation and Transitions

**Smooth, purposeful animations using design system tokens:**

```css
.handle {
  transition: left 0.1s ease;           /* Component-specific timing */
}

.fill, .guide {
  transition: width 0.1s ease;          /* Component-specific timing */
}

/* Disable transitions during interaction */
.slider.dragging {
  .fill, .guide, .handle {
    transition: none;
  }
}

/* Modern CSS animation features */
@starting-style {
  .menu.visible {
    opacity: 0;
    transform: scale(0.4);
  }
}

.menu.visible {
  opacity: 1;
  transform: scale(1);
  transition: var(--transition);        /* ✅ Use design token */
}
```

---

## Key Principles

### 1. **Design Token First**
- Always check if a design token exists before creating custom properties
- Use the extensive color scales (`--red-0` to `--red-100`, `--standard-5` to `--standard-100`)
- Use provided spacing (`--spacing`, `--compact-spacing`), typography, and effect tokens

### 2. **Component-Specific Properties for Unique Values**
- Only create custom properties for measurements specific to your component
- Map custom properties to design tokens: `--track-color: var(--standard-10)`
- Expose dimensions that users might want to customize: `--handle-size`, `--card-width`

### 3. **Semantic Class Naming**
- Use natural language that describes the element's purpose
- Avoid implementation details in class names
- Prefer role-based naming: `.header`, `.content`, `.handle`

### 4. **Hierarchical CSS Architecture**
- Mirror HTML structure in CSS nesting
- Create clear parent-child relationships
- Use nesting to establish context and inheritance

### 5. **Progressive Enhancement**
- Use container queries for component-specific responsive behavior
- Layer interactions and states naturally
- Design for graceful degradation

### 6. **Natural State Management**
- Use class combinations for states: `.swatch.copied`
- Leverage CSS pseudo-selectors: `:checked`, `:hover`
- Create smooth transitions between states using design tokens

---

## Anti-Patterns to Avoid

### ❌ Recreating Design Tokens
```css
/* Don't create custom properties for values already provided */
:host {
  --component-text-color: var(--text-color);
  --component-border: 1px solid var(--border-color);
  --component-spacing: var(--spacing);
}
```

### ❌ Implementation-Based Naming
```css
/* Don't use technical implementation details */
.flexbox-container {}
.grid-item-3-columns {}
.border-radius-4px {}
```

### ❌ Hardcoded Values When Tokens Exist
```css
/* Don't hardcode values that exist as design tokens */
.slider {
  border-radius: 4px;                   /* Use var(--border-radius) */
  transition: all 0.15s ease;           /* Use var(--transition) */
  color: #333;                          /* Use var(--text-color) */
}
```

---

## Tailwind CSS Integration

**📚 For complete Tailwind integration details**: See [`component-generation-instructions.md#tailwind-css-integration`](./component-generation-instructions.md#tailwind-css-integration)

**⚠️ IMPORTANT**: Use Tailwind CSS **only when explicitly requested**. Default to design tokens and semantic class patterns.

## Summary

Your HTML and CSS style reflects a sophisticated understanding of how natural language concepts can be applied to web development. The key characteristics are:

- **Design token integration** with custom properties only for component-specific values
- **Intuitive naming** that reflects purpose over implementation  
- **Hierarchical structure** that mirrors content relationships
- **Contextual responsiveness** through container queries
- **Smooth interactions** with design system transitions
- **Seamless accessibility** integration

This approach creates code that leverages the full power of the design system while maintaining component-specific customization where needed.
