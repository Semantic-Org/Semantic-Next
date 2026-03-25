---
title: Shadow DOM and Theme Cascade
description: How CSS custom properties flow through nested themes and into shadow DOM, and why the token system uses specific selector patterns.
keywords: [shadow DOM, CSS variables, theme cascade, nested themes, custom properties]
audience: contributing
type: doc
---

# Shadow DOM and Theme Cascade

## The Three Theme Folders

The token system uses three folders with different CSS selectors:

| Folder | Selectors | Purpose |
|--------|-----------|---------|
| `themes/light/` | `html, .light.theme.theme, [light][light], [theme][theme="light"]` | Sets INPUT values for light mode |
| `themes/dark/` | `html.dark, .dark.theme.theme, [dark][dark], [theme][theme="dark"]` | Overrides inputs for dark mode |
| `themes/computed/` | `:root, .theme, [light], [dark], [theme]` | Defines FORMULAS using inputs |

**Key differences:**
- Light/dark use **doubled attribute selectors** (`[light][light]`) for higher specificity
- Computed uses **single selectors** including `:root` for shadow DOM support
- Light matches `html` by default; dark only matches when explicitly set

## Nested Theme Cascade

Consider this structure:

```html
<html class="light">
  <div theme="dark">
    <my-component light>
      #shadow-root
    </my-component>
  </div>
</html>
```

Each element matches different selectors:

| Element | Matches | Theme |
|---------|---------|-------|
| `<html>` | `html`, `:root` | Light (default) |
| `<div theme="dark">` | `[theme][theme="dark"]`, `[theme]` | Dark |
| `<my-component light>` | `[light][light]`, `[light]` | Light (override) |

The `light` attribute on the component **overrides** the inherited dark theme because the doubled selector `[light][light]` directly matches the element.

## Shadow DOM Variable Inheritance

CSS custom properties inherit into shadow DOM through the host element:

```
<my-component light>          ← [light][light] sets --standard-color
  │                           ← [light] sets --text-color: var(--standard-80)
  ▼ inherits
  #shadow-root
    <div class="label">       ← uses inherited --text-color
```

The shadow DOM doesn't need to re-import global token CSS. Variables set on the host element flow in automatically.

## Component-Specific Tokens

Components define their own tokens in `src/primitives/{component}/css/theme/`. These use `:root` to target the shadow root:

```css
/* button/css/theme/button-theme.css */
:root {
  --button-background: var(--standard-5);
  --button-color: var(--text-color);
  --button-border-radius: var(--border-radius);
}
```

This works because:
1. `:root` in shadow DOM matches the **shadow root**, not `<html>`
2. The component tokens reference global tokens (`--standard-5`, `--text-color`)
3. Those global tokens inherit from the host element with correct theme values

## Why Computed Needs Multiple Selectors

Computed uses `:root, .theme, [light], [dark], [theme]` because:

- **`:root`** - Ensures formulas apply to shadow roots when component CSS is loaded
- **`[light]`, `[dark]`** - Ensures formulas recompute at theme boundaries in light DOM
- **`[theme]`, `.theme`** - Catches explicit theme containers

Without the attribute selectors, nested themes in light DOM wouldn't recompute the formulas.

## Why Light/Dark Use Doubled Selectors

Light and dark themes use `[light][light]` instead of `[light]` for **specificity**:

- Computed: `[light]` = specificity (0, 1, 0)
- Light theme: `[light][light]` = specificity (0, 2, 0)

This ensures INPUT values from light/dark beat the FORMULA definitions from computed when both match the same element.

## Complete Resolution Example

For `--text-color` on `<my-component light>` inside a dark container:

```
1. Computed [light] defines:
   --standard-80: oklch(var(--standard-color) / 80%)
   --text-color: var(--standard-80)

2. Light [light][light] defines (higher specificity):
   --standard-color: var(--black-lch)

3. Resolution:
   --standard-color → black (from light theme input)
   --standard-80 → 80% black (computed from input)
   --text-color → 80% black (computed result)

4. Shadow DOM:
   Inherits --text-color from host
   Component CSS uses var(--text-color) → 80% black
```

## Nested Themes Inside Shadow DOM

For nested themes inside shadow DOM to work, the component must include theme CSS:

```html
<my-component>
  #shadow-root
    <style>/* theme CSS with [theme="dark"] selectors */</style>
    <div theme="dark">
      <!-- dark theme applies here -->
    </div>
</my-component>
```

The attribute selectors `[theme][theme="dark"]` match elements inside shadow DOM, enabling nested theme support within components.
