---
title: Component CSS Authoring
description: Canonical patterns for writing CSS inside a component's shadow DOM — nesting, container queries, responsive design, state management, theming, and design token usage.
keywords: [CSS, nesting, container queries, responsive design, shadow DOM, design tokens, theming, host, custom properties, animation]
audience: authoring
skill: component-css
type: skill
---

# Component CSS Authoring

> **Skill:** `component-css`
> **Purpose:** Canonical patterns for writing CSS inside a component's shadow DOM — nesting, container queries, responsive design, state management, theming, and design token usage.
> **Last Updated:** 2026-03-04

---

**Golden rule: Use design tokens, not raw values.** If a token exists for the value you need, use it. Hardcoded colors, spacing, and typography values break theming and consistency.

## Core Philosophy

Write minimal, maintainable CSS that leverages the design token system and mirrors HTML structure through natural nesting patterns.

---

## CSS Architecture

### Nesting Patterns

**MANDATORY**: Use CSS nesting to mirror HTML hierarchy:

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing);

  .sidebar {
    background: var(--standard-5);

    .navigation {
      padding: var(--spacing);

      .section {
        margin-bottom: var(--spacing);

        .header {
          font-weight: var(--bold);
          margin-bottom: var(--compact-spacing);
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: var(--compact-spacing);

          .item {
            padding: var(--compact-spacing);
            cursor: pointer;

            &:hover {
              background: var(--standard-10);
            }
          }
        }
      }
    }
  }

  .content {
    background: var(--page-background);

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing);
      border-bottom: 1px solid var(--standard-15);

      .title {
        font-size: var(--large);
        font-weight: var(--bold);
      }

      .actions {
        display: flex;
        gap: var(--compact-spacing);
      }
    }
  }
}
```

### Component Scoping

**Use `:host` for component root styling:**

```css
:host {
  display: block;
  container: component / inline-size;
}

/* Component internal styles */
.wrapper {
  padding: var(--spacing);
  background: var(--standard-5);
}
```

---

## Responsive Design

### Container Queries

**Components should respond to their container, not the viewport:**

```css
:host {
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

### Dynamic Breakpoints

**Use the flag technique for CSS variable-based breakpoints:**

```css
:host {
  --mobile-breakpoint: 600px;
  --tablet-breakpoint: 900px;
  container: component / inline-size;
}

.container {
  --mobile-flag: max(calc(100cqi - var(--mobile-breakpoint)), 0px);
  --tablet-flag: max(calc(100cqi - var(--tablet-breakpoint)), 0px);
}

@container style(--mobile-flag: 0) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@container style(--tablet-flag: 0) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## State Management

### Class-Based States

```css
.button {
  padding: var(--8px) var(--16px);
  background: var(--standard-5);
  transition: var(--transition);

  &:hover {
    background: var(--standard-10);
  }

  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &.active {
    background: var(--primary-color);
    color: var(--white);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: var(--standard-5);
    }
  }
}
```

### Attribute-Based States

```css
/* Component state attributes */
:host([loading]) .content {
  opacity: 0.5;
  pointer-events: none;
}

:host([expanded]) .collapsible-content {
  max-height: none;
}

/* Data attribute states */
[data-state="error"] .field {
  border-color: var(--red);
}

[data-theme="dark"] .component {
  background: var(--standard-90);
}
```

---

## Theme Handling

### Automatic Theme Adaptation

Semantic UI uses a sophisticated theme system where CSS variables automatically adapt between light and dark modes. Components should be written once using theme-aware tokens.

**Key Concept**: The `--standard-*` and `--inverted-*` tokens automatically swap their underlying colors between themes:

```css
.component {
  /* These adapt automatically between themes */
  background: var(--standard-5);     /* Light: light gray, Dark: dark gray */
  color: var(--standard-90);          /* Light: near black, Dark: near white */
  border: 1px solid var(--standard-15);
}
```

### Theme-Specific Overrides

**Only use container style queries when automatic tokens can't express the visual difference:**

```css
.glass-effect {
  /* Base styling uses theme-aware tokens */
  background: var(--standard-5);

  /* Visual effects that need different parameters per theme */
  @container style(--dark-mode: true) {
    backdrop-filter: blur(8px) brightness(1.1);
  }

  @container style(--light-mode: true) {
    box-shadow: inset 0 0 10px var(--standard-10);
  }
}
```

---

## Animation and Transitions

### Consistent Transitions

```css
.interactive-element {
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--floating-shadow);
  }
}

/* Component-specific timing */
.slider {
  .handle {
    transition: left 0.1s ease;
  }

  &.dragging .handle {
    transition: none;
  }
}
```

### Modern CSS Animation

```css
/* Entry animations */
@starting-style {
  .modal.visible {
    opacity: 0;
    transform: scale(0.8);
  }
}

.modal.visible {
  opacity: 1;
  transform: scale(1);
  transition: var(--transition);
}

/* Keyframe animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## CSS Custom Properties

### Component-Specific Properties

**Only create custom properties for values not covered by design tokens:**

```css
:host {
  /* Component-specific measurements */
  --slider-height: 6px;
  --handle-size: 20px;
  --track-border-radius: 3px;

  /* Map to design tokens */
  --track-color: var(--standard-10);
  --fill-color: var(--primary-color);
  --handle-color: var(--white);
}

.slider {
  height: var(--slider-height);
  background: var(--track-color);
  border-radius: var(--track-border-radius);

  .fill {
    background: var(--fill-color);
    border-radius: var(--track-border-radius);
  }

  .handle {
    width: var(--handle-size);
    height: var(--handle-size);
    background: var(--handle-color);
    border-radius: 50%;
    box-shadow: var(--subtle-shadow);
  }
}
```

### External Customization

```css
/* Expose customization points */
:root {
  --component-max-width: 600px;
  --component-spacing: var(--spacing);
}

/* Allow external override */
my-component {
  --component-max-width: 800px;
  --component-spacing: var(--compact-spacing);
}
```

---

## Quick Reference

```css
/* Component root */
:host { display: block; container: component / inline-size; }

/* Token usage */
color: var(--text-color);              /* Semantic token */
background: var(--standard-5);         /* Scale token (theme-adaptive) */
font-size: var(--large);               /* Size token */
gap: var(--spacing);                   /* Spacing token */
transition: var(--transition);         /* Timing token */

/* Container queries over media queries */
@container component (max-width: 600px) { ... }

/* Theme overrides (only when tokens aren't enough) */
@container style(--dark-mode: true) { ... }

/* State patterns */
:host([loading]) .content { opacity: 0.5; }
&.active { background: var(--primary-color); }
&:hover { background: var(--standard-10); }
```

### DO / DON'T

```css
/* ❌ WRONG - raw values */
color: #333;
padding: 16px;
font-size: 14px;

/* ✅ RIGHT - design tokens */
color: var(--text-color);
padding: var(--spacing);
font-size: var(--medium);

/* ❌ WRONG - viewport media query for component layout */
@media (max-width: 600px) { .grid { ... } }

/* ✅ RIGHT - container query */
@container component (max-width: 600px) { .grid { ... } }

/* ❌ WRONG - flat CSS */
.dashboard-sidebar-nav-item { ... }

/* ✅ RIGHT - nested CSS mirroring HTML */
.dashboard { .sidebar { .navigation { .item { ... } } } }
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Design Tokens** | `design-tokens` | Looking up available design tokens |
| **Component HTML** | `component-html` | Writing the HTML template your CSS targets |
| **Style Components** | `style-components` | Customizing component appearance from outside |
| **Component Theming** | `component-theming` | Making components fully theme-aware |
| **Component Specs** | `component-specs` | How specs generate CSS classes automatically |
