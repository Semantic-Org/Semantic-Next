# Style Semantic UI Components

> sui:style - Skill for customizing the appearance of Semantic UI components from outside.

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
  --button-padding: 1.5em;
}
```

### Container-Scoped

Affects components within a specific section:

```css
.sidebar ui-button {
  --primary-color: var(--gray);
}

.checkout-form ui-input {
  --input-border-color: var(--blue);
}
```

### Instance-Scoped

Affects a specific instance. **Use a class, not inline styles:**

```css
/* ✅ Correct — class-based */
ui-button.submit {
  --button-padding: 2em;
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
<ui-button style="--button-padding: 2em">
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
  font-weight: bold;
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

Breakpoint tokens work with container queries, not media queries:

```css
.my-component {
  --below-tablet: max(calc(100cqi - var(--tablet-breakpoint)), 0px);
  container-type: inline-size;
}

@container style(--below-tablet: 0px) {
  .my-component {
    flex-direction: column;
  }
}
```

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
  --button-padding: 1.5em 3em;
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
