---
title: Server-Side Rendering
description: How Semantic UI components render on the server — Lit SSR integration, isServer/isClient guards, lifecycle behavior during SSR, hydration, and patterns for writing SSR-safe components.
keywords: [SSR, server-side rendering, isServer, isClient, Lit SSR, hydration, astro, server rendering, declarative shadow DOM]
audience: authoring
skill: component-ssr
type: skill
---

# Server-Side Rendering

> **Skill:** `sui:component-ssr`
> **Purpose:** SUI-specific SSR patterns — what the framework auto-guards, the two scopes where `isServer`/`isClient` are available, lifecycle behavior during server rendering, and canonical guard patterns from first-party components.
> **Last Updated:** 2026-03-04

---

**Golden rule: Guard browser code, not server code.** `createComponent`, `onCreated`, and `onRendered` all fire on the server. State setup, data computation, and return values from `createComponent` should run unconditionally. Only wrap code that touches browser APIs (`localStorage`, `window`, DOM manipulation, `IntersectionObserver`, behaviors, etc.) in `isClient` guards.

---

## Two Scopes for `isServer` / `isClient`

The most common mistake is importing `isServer` when a callback parameter is available, or forgetting to import when at module scope.

### Callback Scope (most common)

Inside `createComponent`, `onCreated`, `onRendered`, `onDestroyed`, events, and keys — both `isServer` and `isClient` are available as callback params. No import needed. Use whichever reads naturally for your guard — don't negate the other.

```javascript
// ✅ RIGHT — use the positive form that matches intent
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.trigger').tooltip({ position: 'top' });
  }
};

const createComponent = ({ self, isServer }) => ({
  getPreference() {
    if (isServer) {
      return;
    }
    return localStorage.getItem('pref');
  },
});

// ❌ WRONG — don't negate, use the other constant
const onRendered = ({ $, isServer }) => {
  if (!isServer) { ... }
};
```

### Module Scope

In `defaultSettings` or other code that runs at definition time (outside callbacks), you must import from `@semantic-ui/utils`. Both `isServer` and `isClient` are exported — use whichever reads naturally.

```javascript
import { isServer } from '@semantic-ui/utils';

const defaultSettings = {
  scrollContext: isServer ? null : window,
};
```
*Pattern from: `src/components/inpage-menu/inpage-menu.js`*

```javascript
// ❌ WRONG — isServer is not a global, this throws at module scope
const defaultSettings = {
  scrollContext: isServer ? null : window, // ReferenceError
};

// ✅ RIGHT — import first
import { isServer } from '@semantic-ui/utils';
const defaultSettings = {
  scrollContext: isServer ? null : window,
};
```

---

## What the Framework Auto-Guards

These are guarded internally — you do not need to protect them in component code:

| Feature | Where guarded | What happens on server |
|---------|--------------|----------------------|
| `dispatchEvent` | `template.js` | Silently returns (no-op) |
| Key bindings (`keys`) | `template.js` `bindKeys()` | Skipped entirely |
| Theme observer (`onThemeChanged`) | `template.js` `attachEvents()` | MutationObserver and event listener skipped |
| `darkMode` getter | `define-component.js` `getData()` | Returns `undefined` instead of querying DOM |
| `isDarkMode()` | `web-component.js` | Returns `undefined` on server |
| Reactive directive reactions | All 6 renderer directives | Reactions only created on client; server gets a single evaluated value |
| `adoptStylesheet` | `utils/css.js` | Returns immediately (no-op) |
| Subtemplate CSS merging | `define-component.js` | Concatenated into parent CSS for DSD `<template>` output |
| `customElements.define` | `define-component.js` | Only guarded for duplicate registration on client |

**You do NOT need to guard:**
- Template expressions, conditionals (`{#if}`), loops (`{#each}`)
- State initialization (`defaultState`)
- Signals and computed values returned from `createComponent`
- Settings access via `settings` proxy
- The `dispatchEvent` callback param (auto-guarded)

---

## Lifecycle on the Server

The server render executes `createComponent`, `onCreated`, and `onRendered`. `onDestroyed` does not fire on the server.

| Hook | Fires on server? | Typical guard pattern |
|------|-----------------|----------------------|
| `createComponent` | Yes | Guard browser-only methods internally, not the whole function |
| `onCreated` | Yes | Guard reactive subscriptions that touch DOM |
| `onRendered` | Yes | Guard behaviors, DOM queries, scroll listeners |
| `onDestroyed` | No | No guard needed for SSR, but convention is to guard defensively |

### Guard Granularity

Guard the smallest browser-dependent unit, not the entire hook. Let state setup run on both server and client so SSR produces correct initial HTML.

```javascript
// ✅ RIGHT — state setup runs on server, only DOM work is guarded
const onCreated = ({ self, state, isClient }) => {
  state.theme.set(self.getLocalTheme());
  if (isClient) {
    self.calculateTheme();
  }
};
```
*Pattern from: `src/components/theme-switcher/theme-switcher.js`*

```javascript
// ❌ WRONG — skipping the entire hook means server render has no initial state
const onCreated = ({ self, state, isClient }) => {
  if (!isClient) return;
  state.theme.set(self.getLocalTheme());
  self.calculateTheme();
};
```

### Early Return Pattern

When the entire hook body is browser-only (e.g., binding observers, scroll handlers), an early return is the canonical pattern:

```javascript
const onRendered = ({ self, isServer, settings }) => {
  if (isServer || !settings.menu.length) {
    return;
  }
  self.bindPageEvents();
  self.calculateScrollHeight();
};

const onDestroyed = ({ self, isServer }) => {
  if (isServer) {
    return;
  }
  self.unbindPageEvents();
};
```
*Pattern from: `src/components/inpage-menu/inpage-menu.js`*

---

## Guard Patterns by Category

### Browser API Access

Guard individual methods that touch `localStorage`, `window`, `navigator`, `document` directly:

```javascript
const createComponent = ({ isServer }) => ({
  getThemePreference() {
    if (isServer) {
      return;
    }
    return localStorage.getItem('theme');
  },
  getSystemPreference() {
    if (isServer) {
      return;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
});
```
*Pattern from: `src/components/theme-switcher/theme-switcher.js`*

### Behaviors (Tooltip, Transition, etc.)

Behaviors manipulate DOM and must be client-only. Guard in `onRendered`:

```javascript
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.toggle').tooltip({
      topLayer: true,
      position: 'right',
    });
  }
};
```
*Pattern from: `src/components/sidebar-toggle/sidebar-toggle.js`*

### DOM Queries that Reach Outside Shadow Root

Queries scoped to the component shadow root generally work on the server (they find nothing and return empty Query objects). But queries that target `document` or `window` need guards:

```javascript
const onRendered = ({ $, self, attachEvent, isClient }) => {
  if (isClient) {
    attachEvent(document, 'astro:after-swap', self.onPageChange);
  }
};
```
*Pattern from: `src/components/topbar-menu/topbar-menu.js`*

### `createComponent` initialize()

When `initialize()` binds keys or sets up reactions that touch the DOM, guard the whole body:

```javascript
const createComponent = ({ self, bindKey, reaction, state, isServer, settings }) => ({
  initialize() {
    if (isServer) {
      return;
    }
    bindKey(settings.openKey, self.openModal);
    self.calculateResults();
    self.calculateSelected();
  },
  // ... other methods still run on server
});
```
*Pattern from: `src/components/global-search/global-search.js`*

### Using `isClient` as a Runtime Check

`isClient` can be used as a runtime boolean inside methods, not just as a guard:

```javascript
const createComponent = ({ isClient }) => ({
  canSaveState() {
    return isClient && settings.saveState;
  },
});
```
*Pattern from: `src/components/sidebar-toggle/sidebar-toggle.js`*

---

## SSR Pipeline

SUI uses `@semantic-ui/astro-lit` (a maintained fork of `@astrojs/lit`) which uses `@lit-labs/ssr` to render components on the server.

### Server Render Flow

1. Astro calls `renderToStaticMarkup(tagName, props, slots)`
2. A `LitElementRenderer` instance is created for the tag
3. Properties and attributes are set on the instance
4. `connectedCallback()` fires (triggers `willUpdate` → `initialize` → `onCreated`)
5. Shadow DOM contents are rendered as a `<template shadowrootmode="open">` (Declarative Shadow DOM)
6. Slots are serialized into the light DOM

### Hydration Flow

1. Browser parses DSD `<template shadowrootmode>` — shadow roots are created natively
2. For browsers without DSD support, a polyfill (`@webcomponents/template-shadowroot`) runs on `DOMContentLoaded`
3. `lit-element-hydrate-support.js` patches LitElement to reuse existing shadow DOM instead of re-rendering
4. `defer-hydration` attribute is removed, triggering the client-side update cycle
5. The full lifecycle fires on the client — state is re-initialized, reactions are created, events are bound

### Key Implication

Components render **twice**: once on the server (HTML generation) and once on the client (hydration). Your `createComponent` and `onCreated` run in both environments. State set during SSR does not transfer — the client re-initializes from defaults. This is why `isClient` guards exist: not to prevent errors, but to prevent side effects (localStorage writes, observer creation, event binding) from executing in the wrong environment.

---

## Subtemplate CSS and DSD

On the client, subtemplates adopt their CSS at runtime via `adoptStylesheet`. On the server, there's no `adoptedStyleSheets` API. The framework handles this by merging all subtemplate CSS into the parent component's CSS at definition time:

```javascript
// Inside defineComponent — this runs automatically
each(subTemplates, (template) => {
  if (template.css) {
    css += template.css;
  }
});
```

This merged CSS ends up inside the DSD `<template>` element, ensuring subtemplates are styled correctly in the server-rendered HTML before hydration.

---

## Quick Reference

```javascript
// Callback scope — destructure from params (no import)
const createComponent = ({ isServer, isClient }) => ({ ... });
const onRendered = ({ isClient }) => { ... };
const onCreated = ({ isServer }) => { ... };
const onDestroyed = ({ isServer }) => { ... };

// Module scope — import required
import { isServer } from '@semantic-ui/utils';
const defaultSettings = { ctx: isServer ? null : window };

// Guard browser APIs, let state setup run unconditionally
const onCreated = ({ state, self, isClient }) => {
  state.theme.set(self.getLocalTheme());    // runs on both
  if (isClient) {
    self.calculateTheme();                   // client only
  }
};

// Auto-guarded (no action needed):
//   dispatchEvent, key bindings, theme observer,
//   darkMode, reactive directive reactions,
//   adoptStylesheet, subtemplate CSS merging
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component Behaviors** | `sui:component-behaviors` | Attaching behaviors (always need `isClient` guard) |
| **Component Lifecycle** | `sui:component-lifecycle` | Understanding hook execution order and params |
| **Component Authoring** | `sui:component-authoring` | Full `defineComponent` guide |
| **Component Patterns** | `sui:component-patterns` | Communication, cleanup, DOM querying patterns |
| **Mental Model** | `sui:mental-model` | Framework-level overview |
