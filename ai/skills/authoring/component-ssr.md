---
title: Server-Side Rendering
description: How Semantic UI components render on the server. Native renderToString SSR, isServer/isClient guards, lifecycle behavior during SSR, self-hydration, and patterns for writing SSR-safe components.
keywords: [SSR, server-side rendering, isServer, isClient, renderToString, hydration, astro, server rendering, declarative shadow DOM]
audience: authoring
skill: component-ssr
type: skill
---

# Server-Side Rendering

> **Skill:** `component-ssr`
> **Purpose:** SUI-specific SSR patterns — what the framework auto-guards, the two scopes where `isServer`/`isClient` are available, lifecycle behavior during server rendering, and canonical guard patterns from first-party components.
> **Last Updated:** 2026-06-14

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
| `darkMode` getter | `engines/native/base.js` `getData()` | Returns `undefined` instead of querying DOM |
| `isDarkMode()` | `component-helpers.js` | Returns `undefined` on server |
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

SUI server-renders through its own native renderer. No Lit, no DOM shim. The published `@semantic-ui/astro` integration is a thin adapter whose `renderToStaticMarkup` calls `renderToString` from `@semantic-ui/component`. The host framework only emits the server HTML and loads the component JS. it never hydrates the component itself.

### Server Render Flow

1. `renderToString(ComponentClass, attrs)` clones the prototype template, forcing the native engine
2. `template.initialize()` runs `createComponent` with `isServer: true` (same factory the client runs)
3. `ServerRenderer` walks the AST and produces an HTML string with hydration comment markers
4. `expandCustomElements` recursively renders nested components as their own DSD
5. The output wraps in `<template shadowrootmode="open">` (Declarative Shadow DOM) with the component CSS

### Self-Hydration Flow

The component hydrates itself in its own `connectedCallback`. there is no host-driven hydration step.

1. The browser parses the DSD natively and attaches the shadow root before any JS runs, so the user sees styled content immediately
2. The component JS loads, `customElements.define` upgrades the element, the constructor detects the existing shadow root
3. `connectedCallback` sees server content and `canHydrate()` confirms the marker version matches, then defers wiring (one microtask) so the browser paints first
4. `hydrate()` clones the template, runs `createComponent` again client-side, and wires Reactions to the existing DOM via the comment markers

`hydrate: false` (server-only components) stamps an `ssr` attribute on the element. `connectedCallback` early-returns on it, so the DSD stays visible but inert. The client integration removes the attribute when a `client:*` directive opts the component into hydration.

For the full phase-by-phase walk (markers, `canHydrate`, `_hydrating`, `skipFirstWrite`), see `ssr-hydration`. For the AST and engine selection, see `render-pipeline`.

### Key Implication

`createComponent` and `onCreated` run in **both** environments — once on the server (HTML generation) and once on the client (hydration). State set during SSR does not transfer. the client re-initializes from defaults. This is why `isClient` guards exist: not to prevent errors, but to prevent side effects (localStorage writes, observer creation, event binding) from executing in the wrong environment.

---

## Subtemplate CSS and DSD

On the client, subtemplates adopt their CSS at runtime via `adoptStylesheet`. On the server, there's no `adoptedStyleSheets` API. The framework handles this by merging all subtemplate CSS into the parent component's CSS at definition time:

```javascript
// Inside defineComponent — this runs automatically
each(subTemplates, (subTemplate, name) => {
  if (subTemplates[name].css) {
    css += subTemplates[name].css;
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
| **SSR & Hydration Pipeline** | `ssr-hydration` | Deep dive on markers, DSD parsing, the hydrate-or-render decision |
| **Render Pipeline** | `render-pipeline` | AST, engine selection, expression evaluation |
| **Component Behaviors** | `component-behaviors` | Attaching behaviors (always need `isClient` guard) |
| **Component Lifecycle** | `component-lifecycle` | Understanding hook execution order and params |
| **Component Authoring** | `component-authoring` | Full `defineComponent` guide |
| **Component Patterns** | `component-patterns` | Communication, cleanup, DOM querying patterns |
| **Mental Model** | `mental-model` | Framework-level overview |
