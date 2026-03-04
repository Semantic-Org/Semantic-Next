---
title: Style Semantic UI Components
description: Skill for customizing the appearance of Semantic UI components from outside
audience: skills
skill: style
---

# Style Semantic UI Components

---

## What You Can and Can't Style

SUI components use Shadow DOM for style encapsulation. This means external CSS selectors **cannot reach inside** components:

```css
/* ❌ This won't work — Shadow DOM blocks it */
ui-button .internal-icon { color: red; }
```

**Three ways to customize from outside:**

| Method | What it does | Use when |
|--------|--------------|----------|
| CSS variables | Override specific values | Changing colors, sizes, spacing |
| `::part()` | Style exposed elements | One-off overrides, any CSS property |
| Theme inheritance | Light/dark cascades | Section-level theme control |

---

## CSS Variable Overrides

The primary way to customize components. Set variables at different scopes:

### Component-Wide

Affects all instances of a component:

```css
ui-button {
  --primary-color: green;
  --padding: var(--padding-l);
}
```

### Container-Scoped

Affects components within a specific section:

```css
.sidebar ui-button {
  --primary-color: var(--grey);
}

.checkout-form ui-input {
  --border-color: var(--blue-border-color);
}
```

### Instance-Scoped

Affects a specific instance. **Use a class, not inline styles:**

```css
/* ✅ Correct — class-based */
ui-button.submit {
  --padding: var(--padding-l);
  --primary-color: var(--green);
}

ui-button.cancel {
  --primary-color: var(--red);
}
```

```html
<ui-button class="submit" primary>Complete Order</ui-button>
<ui-button class="cancel">Cancel</ui-button>
```

```css
/* ❌ Avoid — inline styles are harder to maintain */
<ui-button style="--padding: var(--padding-l)">
```

### Finding Available Variables

Use MCP tools to discover what variables a component exposes:
- `get_component` — check the spec's CSS or settings
- Inspect the component's stylesheet in browser devtools

---

## `::part()` for One-Off Overrides

When CSS variables aren't enough, use `::part()` to style exposed internal elements. **Any CSS property works:**

```css
/* Change icon color and add rotation */
ui-button.special::part(icon) {
  color: var(--red);
  transform: rotate(45deg);
}

/* Style menu item labels */
ui-menu.nav::part(item-label) {
  font-weight: var(--bold);
  text-transform: uppercase;
}
```

### When to Use `::part()`

- **One-off styling**: A specific button needs a red icon
- **Properties not exposed as variables**: Transform, filter, custom animations
- **Strong overrides**: When you need full CSS control over an element

### Nested Parts

Components with subcomponents pass parts through via `exportparts`. For example, `ui-menu` exposes parts from its nested `menu-item` children:

```css
ui-menu::part(item-icon) { /* styles icons in menu items */ }
ui-menu::part(item-label) { /* styles labels in menu items */ }
```

The specific parts available vary by component — check the component's template or spec.

---

## Theme-Aware Styling

Basic theme switching (`<html dark>`, `<div light>`) is covered in `/sui:use`. Additional patterns for layout authors:

### Theme-Invariant Sections

Keep a section in a fixed theme regardless of page theme:

```html
<html light>
  <body>
    <aside dark>
      <!-- Sidebar stays dark even on light pages -->
      <ui-menu vertical>...</ui-menu>
    </aside>
    <main>
      <!-- Main content follows page theme -->
    </main>
  </body>
</html>
```

### Writing Theme-Aware CSS

Use container style queries to write your own CSS that responds to the current theme:

```css
@container style(--dark-mode: true) {
  .my-sidebar {
    /* dark mode styles */
  }
}

@container style(--light-mode: true) {
  .my-sidebar {
    /* light mode styles */
  }
}
```

This lets your custom CSS adapt alongside SUI components without hardcoding theme checks.

---

## Responsive Styling with Container Queries

CSS custom properties can't be used in media queries, but SUI uses a technique to make breakpoints work as overridable CSS variables with container queries.

The pattern: compute a comparison value from the container's width minus the breakpoint. When the container is below the breakpoint, the result clamps to `0px`. A `@container style()` query matches on that result.

```css
/* 1. Register the comparison property */
@property --breakpoint-comparison {
  syntax: "<length>";
  inherits: true;
  initial-value: 1px;
}

:root {
  --mobile-breakpoint: 768px;
}

/* 2. Compute: collapses to 0px when below breakpoint */
.component {
  --breakpoint-comparison: max(calc(100cqi - var(--mobile-breakpoint)), 0px);
}

/* 3. Query the result */
@container component style(--breakpoint-comparison: 0) {
  .stackable.cards {
    display: flex;
    flex-direction: column;
  }
}
```

The `@property` registration ensures the computed value resolves correctly for the style query. The `initial-value: 1px` means above-breakpoint by default.

Theme authors override the breakpoint with a single line:

```css
ui-card {
  --card-stackable-breakpoint: 500px;
}
```

Because it uses `cqi` (container inline size), the same component responds differently depending on its container — a card in a sidebar stacks at a different point than a card in the main content.

---

## Quick Reference

```css
/* Component-wide override */
ui-button {
  --primary-color: teal;
}

/* Container-scoped */
.dark-section ui-card {
  --card-background: var(--standard-10);
}

/* Instance with class (preferred) */
ui-button.hero-cta {
  --padding: var(--padding-l);
}

/* ::part() for one-offs */
ui-button.special::part(icon) {
  color: gold;
}
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **CSS Tokens** | `/sui:tokens` | Available design tokens for colors, spacing, effects |
| **Use Semantic UI** | `/sui:use` | Component usage, specs, attributes, events |
| **Integrate Semantic UI** | `/sui:integrate` | Framework integration, SSR, installation |
