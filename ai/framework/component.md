---
title: Component Package Guide
description: Guide to the @semantic-ui/component package, covering defineComponent API, component patterns, universal execution scope, CSS architecture, and lifecycle hooks.
keywords: [component, defineComponent, web components, settings, state, lifecycle, CSS]
audience: framework
type: doc
---

# Semantic UI Component System Guide

**For AI agents working with `@semantic-ui/component`**

## Overview

The `@semantic-ui/component` package is the runtime factory (`defineComponent`) that creates Web Components. It orchestrates reactivity, templating, and rendering.

**Core Principle:** Do NOT extend `LitElement` directly. Use `defineComponent()`.

## Two Component Patterns

1.  **Spec-Driven (Primitives):** Used for low-level Design System components (`Button`, `Input`). Relies on a JSON Spec (`.spec.js`) to enforce strict attribute contracts and generate CSS classes automatically.
2.  **Config-Driven (Widgets):** Used for application components (`UserProfile`, `DataTable`). Relies on `defaultSettings` and `defaultState` for configuration. **Specs are optional.**

## The `defineComponent` API

```javascript
import { defineComponent } from '@semantic-ui/component';

export const MyComponent = defineComponent({
  // 1. Identity
  tagName: 'ui-my-component',

  // 2. Styles
  css: `:host { display: block; }`, // Injected into Shadow DOM
  pageCSS: `body { overflow: hidden; }`, // "Escape Valve": Injected into Document Head

  // 3. Data Model (Spec-Optional)
  defaultSettings: { variant: 'primary', isOpen: false },
  defaultState: { counter: 0 },

  // 4. Logic Factory
  createComponent: ({ self, state, settings }) => {
    /* ... */
  },

  // 5. Bindings
  events: {
    'click .btn': ({ self }) => self.toggle()
  },

  // 6. Lifecycle
  onCreated: ({ self }) => { /* ... */ }
});
```

## The Universal Execution Scope

Every function in the component definition (`createComponent`, `events`, `keys`, `onCreated`, `onRendered`, etc.) receives the same destructurable object as its first argument.

### Core Properties

- **`self`** (or `component`, `tpl`): The component instance object (the return value of `createComponent`).
- **`el`**: The host DOM element (`this`).
- **`$`**: Scoped Query selector (`self.$`) for Shadow DOM access.
- **`$$`**: Deep Query selector (`self.$$`) for piercing Shadow DOM.

### State & Data

- **`state`**: Internal reactive Signals map. Access via `.get()`/`.set()`.
- **`settings`**: Public reactive properties Proxy.
- **`data`**: Raw data context (snapshot of state + settings).

### Reactivity Helpers

- **`reaction`**: Register a reaction that auto-disposes when component destroys.
- **`signal`**: Create a new signal scoped to the component.
- **`flush`** / **`afterFlush`** / **`nonreactive`**: Scheduler control.

### Event & DOM

- **`dispatchEvent`**: Fire CustomEvents that bubble correctly.
- **`attachEvent`**: Bind global events (window/document) that auto-cleanup.
- **`bindKey`** / **`unbindKey`**: Manage keyboard shortcuts dynamically.

### Traversal (Component Communication)

- **`findParent(templateName)`**: Find nearest ancestor component.
- **`findChild(templateName)`**: Find first matching child component.
- **`findChildren(templateName)`**: Find all matching child components.

## CSS Architecture

- **`css`**: Scoped to the component's Shadow DOM. Use this for 99% of styling.
- **`pageCSS`**: Injected into the Light DOM (Global Document). Use for `@keyframes`, body scroll locks, or portal styling.

## Lifecycle Hooks

- **`onCreated`**: Called when class is instantiated. State/Settings are ready. DOM is NOT ready.
- **`onRendered`**: Called after the Template Renderer has committed DOM. Safe to use `$()`.
- **`onDestroyed`**: Called when disconnected. Use for manual cleanup (timers, external subs).
- **`onThemeChanged`**: Called when system or app theme changes.
