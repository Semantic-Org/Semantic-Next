---
title: Tailwind CSS in Shadow DOM
description: Using the TailwindPlugin to compile and use Tailwind CSS at runtime inside Shadow DOM components — setup, configuration, class usage, and integration with the design token system.
keywords: [tailwind, tailwindcss, shadow DOM, runtime compilation, TailwindPlugin, utility classes, tailwindcss-iso, @theme, @utility, @custom-variant]
audience: authoring
skill: component-tailwind
---

# Tailwind CSS in Shadow DOM

> **Skill:** `sui:component-tailwind`
> **Purpose:** How to use Tailwind CSS inside Semantic UI components via the `TailwindPlugin` — a pre-processing plugin that compiles Tailwind utilities at runtime for Shadow DOM encapsulation.
> **Last Updated:** 2026-03-04

---

**Golden rule: Tailwind is a plugin that transforms definitions before `defineComponent` — it is not a build step.** Call `await TailwindPlugin(definition)` to generate scoped Tailwind CSS, then pass the result to `defineComponent`.

---

## Why a Plugin?

Tailwind CSS cannot penetrate Shadow DOM boundaries. Global Tailwind stylesheets do not apply inside web components. The `TailwindPlugin` solves this by scanning your component definition for Tailwind classes and generating the CSS that gets scoped inside the component's Shadow DOM.

Key architectural properties:
- **No build step** — uses `tailwindcss-iso` (an isomorphic Tailwind compiler) that runs in both browser and Node.js
- **No CSP headers** — the browser implementation uses WASM, not `eval` or inline styles
- **Pre-processing pattern** — transforms the definition *before* `defineComponent`, keeping `defineComponent` synchronous
- **Tailwind 4** — uses Tailwind CSS v4 syntax (`@theme`, `@utility`, `@custom-variant`)

---

## Basic Setup

### Minimal Example

```js
import { defineComponent } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

let definition = {
  tagName: 'my-card',
  template: '<div class="p-4 bg-blue-500 text-white rounded-lg">Hello</div>',
};

definition = await TailwindPlugin(definition);
export const MyCard = defineComponent(definition);
```

### Multi-File Component

```js
import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

const template = await getText('./my-card.html');
const css = await getText('./my-card.css');

let definition = {
  tagName: 'my-card',
  template,
  css,
  defaultSettings: {
    title: '',
  },
};

definition = await TailwindPlugin(definition);
export const MyCard = defineComponent(definition);
```

### Inline Pattern (Top-Level Await)

```js
export const MyCard = defineComponent(
  await TailwindPlugin({
    tagName: 'my-card',
    template: '<div class="p-4 bg-white shadow-lg rounded-xl">Content</div>',
  })
);
```

---

## How It Works

The plugin follows a three-step process:

1. **Extract** — Scans the entire component definition for Tailwind class usage
2. **Compile** — Passes extracted content to `tailwindcss-iso` to generate CSS
3. **Replace** — Returns a new definition with `css` set to the generated Tailwind CSS

### What Gets Scanned

The plugin scans every location where Tailwind classes might appear:

| Source | What is scanned |
|--------|-----------------|
| `template` | HTML template string |
| `css` | Component CSS (including `@theme`, `@utility`, `@custom-variant`) |
| `createComponent` | Function body (converted to string) |
| `onCreated`, `onRendered`, `onDestroyed` | Lifecycle function bodies |
| `onThemeChanged`, `onAttributeChanged` | Lifecycle function bodies |
| `events` | All event handler function bodies |
| `keys` | All key handler function bodies |
| `subTemplates` | Recursive scan of all sub-template `template` and `css` fields |

This means Tailwind classes referenced in JavaScript (e.g., dynamically applied via `$().addClass('bg-red-500')`) are detected as long as the class string literal appears in the function body.

### CSS Replacement

The generated CSS **replaces** the definition's `css` field entirely. The original `css` content is fed into the Tailwind compiler as input (so `@theme` and `@utility` directives are processed), and the output is the fully compiled CSS:

```js
// Input definition
{ css: '@theme { --color-brand: #3b82f6; }', template: '<div class="bg-brand">' }

// After TailwindPlugin — css is the compiled output
{ css: '/* generated Tailwind CSS containing .bg-brand utility */', template: '<div class="bg-brand">' }
```

---

## Using Tailwind CSS Features

### @theme — Customize Design Tokens

Use `@theme` in your component CSS to override or extend Tailwind's default theme within the component:

```css
@theme {
  --color-gray-100: theme(colors.zinc.100);
  --color-gray-700: theme(colors.zinc.700);
  --color-gray-950: theme(colors.zinc.950);
}
```

### @utility — Custom Utilities

Define custom utility classes:

```css
@utility transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### @custom-variant — Custom Variants

Define custom variant selectors. This is useful for patterns like class-based dark mode:

```css
/* Trigger dark mode via a .dark class on the component root */
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<div class="{darkMode ? 'dark' : ''}">
  <p class="text-gray-900 dark:text-white">Adapts to theme</p>
</div>
```

### Standard Tailwind Classes

All Tailwind v4 utility classes work as expected:

```html
<div class="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
  <img class="h-12 w-12 rounded-full" src="{avatar}" />
  <div class="flex flex-col">
    <span class="text-sm font-semibold text-gray-900">{name}</span>
    <span class="text-xs text-gray-500">{role}</span>
  </div>
</div>
```

Hover, focus, responsive, and all other standard variants work:

```html
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white rounded-lg transition-colors">
  <slot></slot>
</button>
```

---

## Tailwind and Design Tokens

Semantic UI ships a design token system (`--standard-*`, `--primary-color`, `--spacing`, etc.) and a first-party UI component library built on those tokens. **Tailwind is a fully supported alternative.** You can use SUI's web component framework with Tailwind as your sole styling approach — no design tokens, no first-party CSS required.

### Three Valid Approaches

| Approach | When |
|----------|------|
| **Tailwind only** | You prefer utility-class CSS. Use SUI's component framework (`defineComponent`, reactivity, Shadow DOM) with Tailwind for all styling. |
| **Design tokens only** | You want the SUI theme system with semantic tokens, auto-adapting light/dark mode, and the `{ui}` class pattern. |
| **Mixed** | Use design tokens for theme-aware values (colors, borders) and Tailwind for layout utilities (flex, grid, spacing). |

### Building SUI Primitives

The first-party primitives (`ui-button`, `ui-menu`, etc.) use design tokens internally because they participate in the spec system and the `{ui}` class pattern. If you're contributing to the first-party library, use design tokens. If you're building your own components with SUI's framework, use whichever styling approach you prefer.

### Mixing Both

Tailwind's `@theme` customizations and Semantic UI's CSS custom properties occupy different namespaces, so they coexist without conflict:

```html
<!-- Tailwind utilities for layout, SUI tokens for theming -->
<div class="flex items-center gap-4 p-4 rounded-lg"
     style="background: var(--standard-5); color: var(--text-color);">
  <slot></slot>
</div>
```

---

## Common Patterns

### Dynamic Classes in JavaScript

Classes referenced in `createComponent` or lifecycle functions are detected because the plugin stringifies those functions:

```js
const createComponent = ({ $ }) => ({
  highlightError() {
    // 'bg-red-100' and 'border-red-500' are detected by the plugin
    $('.field').addClass('bg-red-100 border-red-500');
  },
});
```

### Subtemplates

Sub-template content is scanned recursively. No extra setup needed:

```js
let definition = {
  tagName: 'ui-card',
  template: '<div class="bg-white shadow-lg">{>header}{>body}</div>',
  subTemplates: {
    header: {
      template: '<header class="p-4 border-b"><slot name="header"></slot></header>',
    },
    body: {
      template: '<div class="p-4"><slot></slot></div>',
    },
  },
};

definition = await TailwindPlugin(definition);
```

### Dark Mode via Class Toggle

Use `@custom-variant` with a class on the component root to integrate with Semantic UI's theme system:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<div class="component {darkMode ? 'dark' : ''}">
  <div class="bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300">
    {content}
  </div>
</div>
```

The `darkMode` template variable is available in all components and reflects the current theme state.

---

## Anti-Patterns

### Calling TailwindPlugin after defineComponent

```js
// ❌ WRONG — plugin must run BEFORE defineComponent
const MyCard = defineComponent(definition);
await TailwindPlugin(definition); // too late, component already defined

// ✅ RIGHT — transform first, then define
definition = await TailwindPlugin(definition);
const MyCard = defineComponent(definition);
```

### Forgetting await

```js
// ❌ WRONG — TailwindPlugin is async, returns a Promise
definition = TailwindPlugin(definition); // definition is now a Promise
defineComponent(definition); // breaks

// ✅ RIGHT — await the result
definition = await TailwindPlugin(definition);
defineComponent(definition);
```

### Using Tailwind in first-party primitives

First-party SUI primitives (`ui-button`, `ui-menu`, etc.) use design tokens for theme integration. Don't mix Tailwind into these:

```html
<!-- ❌ WRONG — Tailwind inside an SUI primitive that uses the spec/token system -->
<div class="bg-gray-100 text-gray-900">

<!-- ✅ RIGHT — design tokens for SUI primitives -->
<div style="background: var(--standard-5); color: var(--text-color);">
```

For your own custom components, either approach is valid.

### Expecting global Tailwind styles in Shadow DOM

```html
<!-- ❌ WRONG — global Tailwind stylesheet won't reach inside Shadow DOM -->
<link rel="stylesheet" href="tailwind.css">
<my-component></my-component> <!-- Tailwind classes inside won't work -->

<!-- ✅ RIGHT — use TailwindPlugin to generate scoped CSS per component -->
```

---

## Quick Reference

```js
// Import
import { TailwindPlugin } from '@semantic-ui/tailwind';

// Basic usage
let definition = { tagName: 'x-demo', template, css };
definition = await TailwindPlugin(definition);
export const Demo = defineComponent(definition);

// Inline
export const Demo = defineComponent(await TailwindPlugin({ tagName: 'x-demo', template }));

// Plugin scans: template, css, createComponent, all lifecycle hooks,
//               events, keys, and subTemplates (recursively)

// Tailwind v4 CSS features in component css:
// @theme { --color-brand: #3b82f6; }
// @utility custom-shadow { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
// @custom-variant dark (&:where(.dark, .dark *));
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component CSS** | `sui:component-css` | Writing CSS with design tokens instead of Tailwind |
| **Component Authoring** | `sui:component-authoring` | Full guide to `defineComponent` and component structure |
| **Component Theming** | `sui:component-theming` | Design token system and theme integration |
| **Component Composition** | `sui:component-composition` | Subtemplates and component nesting patterns |
| **Mental Model** | `sui:mental-model` | Framework-level overview including where Tailwind fits |
