---
title: Component Authoring Guide
description: Practical guide to building components with defineComponent — file structure, createComponent pattern, the self pattern, settings vs state, template data context, lifecycle, and common anti-patterns.
keywords: [defineComponent, createComponent, component, self, settings, state, template, lifecycle, subtemplate, web component, tagName, shadow DOM]
audience: authoring
skill: component-authoring
type: skill
---

# Component Authoring Guide

> **Skill:** `component-authoring`
> **Purpose:** Practical guide to building components with `defineComponent` — file structure, instance creation, the `self` pattern, data context, lifecycle ordering, and common mistakes.
> **Last Updated:** 2026-03-04

---

**Golden rule: A component is a Template with optional extras.** Start with `template` only. Add `createComponent`, `events`, `state`, `css` as needed. Never scaffold what you do not yet need.

---

## The One API: defineComponent

Every component — from a three-line greeting to a full search modal — uses the same function:

```js
import { defineComponent } from '@semantic-ui/component';

// Web component (has a tag name)
defineComponent({ tagName: 'my-widget', template, css, createComponent, ... });

// Subtemplate (no tag name) — returned as a Template
const row = defineComponent({ template, css, createComponent, ... });
```

- **With `tagName`**: registers a custom element via `customElements.define`, rendered as `<my-widget>`
- **Without `tagName`**: returns a Template, used as a subtemplate via `{>row}` in a parent

This is the single most important distinction. Everything else is configuration.

---

## Decision Tree: What Do I Need?

```
Start: I need a component
│
├─ Does it need a tag name for use in HTML?
│  ├─ YES → set tagName (web component)
│  └─ NO  → omit tagName (subtemplate, passed via subTemplates)
│
├─ Does it need reactive internal data?
│  ├─ Simple values → use defaultState
│  └─ Explicit control → use signal() inside createComponent
│
├─ Does it accept external configuration?
│  └─ YES → use defaultSettings
│
├─ Does it have behavior / methods?
│  └─ YES → use createComponent
│
├─ Does it listen to DOM events?
│  └─ YES → use events (see component-events)
│
├─ Does it have scoped styles?
│  └─ YES → use css (see component-css)
│
└─ Is it a canonical UI primitive (button, input, menu)?
   └─ YES → add componentSpec (see component-specs)
```

---

## File Structure

### Inline (simple components)

```js
defineComponent({
  tagName: 'current-time',
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
```

### Multi-file (production components)

```
my-widget/
├── index.js              ← re-export
├── my-widget.js          ← defineComponent + createComponent + events
├── my-widget.html        ← template
└── my-widget.css         ← scoped CSS
```

```js
// With build tools (Vite/Webpack)
import css from './my-widget.css?raw';
import template from './my-widget.html?raw';

// Browser / Node (no build step)
import { getText } from '@semantic-ui/component';
const css = await getText('./my-widget.css');
const template = await getText('./my-widget.html');
```

---

## createComponent — Defining Behavior

`createComponent` is a function that receives destructured params and returns an object. That object becomes the component instance, accessible as `self` everywhere.

```js
const createComponent = ({ self, state, settings, $, $$ }) => ({
  // Methods
  increment() {
    state.counter.increment();
  },
  reset() {
    state.counter.set(settings.startingNumber);
  },

  // Computed values (called as functions in template)
  isEven(number) {
    return number % 2 === 0;
  },

  // Initialization (auto-called after instance creation)
  initialize() {
    self.reset();
  },
});
```

### The `initialize()` Convention

If the returned object has an `initialize` method, it is **automatically called** after `createComponent` returns — you never call it manually. This happens before `onCreated`.

**Lifecycle order:**
1. `createComponent()` runs, returns instance object
2. `instance.initialize()` auto-called (if defined)
3. `onCreated` fires (component attached to DOM)
4. First render
5. `onRendered` fires (shadow DOM rendered)
6. On removal: `onDestroyed` fires

### The `self` Pattern

`self` (aliased as `tpl` and `component`) is the instance object returned from `createComponent`. It is available in every callback:

```js
// In createComponent — self references the instance being built
const createComponent = ({ self, state, interval }) => ({
  start() {
    interval(() => state.count.increment(), 1000);
  },
});

// In events — same self
const events = {
  'click .start'({ self }) { self.start(); },
};

// In lifecycle — same self
const onRendered = ({ self, isClient }) => {
  if (isClient) self.start();
};
```

The `interval` and `timeout` helpers auto-cancel when the component is destroyed — no manual cleanup needed.

---

## Callback Parameters

Every callback (`createComponent`, `events`, `onCreated`, `onRendered`, `onDestroyed`, `keys`) receives the same destructured parameter object:

| Parameter | Purpose |
|-----------|---------|
| `self` / `tpl` / `component` | Component instance from `createComponent` |
| `el` | Raw DOM element |
| `$` / `$$` | Shadow DOM-scoped / piercing query |
| `state` | Reactive state (each key is a Signal) |
| `settings` | Reactive settings proxy |
| `signal` / `reaction` | Create a new Signal or Reaction |
| `data` | Template data context |
| `dispatchEvent` | Fire custom events |
| `findParent` / `findChild` / `findChildren` | Walk the render tree |
| `isClient` / `isServer` | Environment detection |
| `isRendered` | Returns whether component has rendered |
| `darkMode` | Current dark mode state |
| `rerender` | Force re-render |
| `afterFlush` / `nonreactive` | Reactivity timing controls |
| `attachEvent` | Attach external event with auto-cleanup |
| `bindKey` / `unbindKey` | Dynamic keybinding |

Destructure only what you need. Do not destructure params you are not using.

---

## Settings vs State

| | Settings | State |
|--|----------|-------|
| **Purpose** | Public API (external configuration) | Private data (internal) |
| **Declared via** | `defaultSettings` | `defaultState` or `signal()` in `createComponent` |
| **Set externally** | Yes — HTML attributes, DOM properties, `$().settings()` | No |
| **Reactive** | Yes (proxy-based) | Yes (Signal-based) |
| **In template** | By name: `{color}` | By name: `{counter}` |
| **Access in code** | `settings.color` | `state.counter.get()` / `state.counter.set(v)` |

```js
const defaultSettings = {
  color: 'blue',           // users can set: <my-widget color="red">
  maxItems: 10,
};

const defaultState = {
  counter: 0,              // internal, managed by component logic
  isExpanded: false,
};
```

**Key distinction**: Settings are read through a reactive proxy (`settings.color`), not through `.get()`. State values are Signals and use `.get()` / `.set()`.

For deep coverage of state management, see `reactive-state`.

---

## Template Data Context

Templates resolve names by checking these sources in order:

1. **Component instance** — methods and properties from `createComponent`
2. **Settings** — values from `defaultSettings`
3. **State** — values from `defaultState`
4. **Subtemplate data** — data passed from a parent via `{>sub data=value}`
5. **Global helpers** — built-in helpers like `formatDate`, `classMap`, `concat`

```html
<!-- Calls the getName method from createComponent -->
{getName}

<!-- Reads the 'color' setting -->
{color}

<!-- Reads the 'counter' state (auto-unwraps Signal) -->
{counter}

<!-- Calls global helper -->
{formatDate time 'h:mm:ss a'}
```

Signals auto-unwrap in templates — you write `{counter}`, not `{counter.get()}`.

### Flat Context

The data context is flat. This means you can move a value between `createComponent`, `defaultSettings`, and `defaultState` without changing your template. The template does not care where `{name}` lives.

```js
// These three are equivalent from the template's perspective:
const createComponent = () => ({ name: 'Jack' });
const defaultSettings = { name: 'Jack' };
const defaultState = { name: 'Jack' };
// Template: {name} → "Jack" in all cases
```

**Composing with primitives**: Semantic UI ships spec-driven primitives — use them directly in your templates. When the Semantic UI MCP server is available, use `list_components` to see what's available. See `use` for attribute syntax.

---

## Subtemplates

A subtemplate is a component without a `tagName`. It participates in the parent's render tree.

```js
// row.js — no tagName
import { defineComponent } from '@semantic-ui/component';
export const row = defineComponent({
  template: `<tr><td>{name}</td><td>{age}</td></tr>`,
  css: `td { padding: var(--padding); }`,
});

// table.js — uses row as subtemplate
import { row } from './row.js';
defineComponent({
  tagName: 'data-table',
  template: `{#each rows as item}{>row name=item.name age=item.age}{/each}`,
  subTemplates: { row },
  createComponent: () => ({
    rows: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }],
  }),
});
```

Key rules:
- Pass subtemplates via the `subTemplates` option in `defineComponent`
- Reference in template with `{>name}`
- Data flows from parent via named attributes: `{>row name=item.name}`
- Subtemplates can have their own `createComponent`, `events`, `css`, and `state`
- Subtemplate CSS is automatically merged into the parent's stylesheet

---

## defineComponent Options Reference

```js
defineComponent({
  // Identity
  tagName,              // String — registers custom element (omit for subtemplate)

  // Rendering
  template,             // String — HTML template
  ast,                  // Object — precompiled AST (alternative to template)
  css,                  // String — scoped Shadow DOM CSS
  pageCSS,              // String — CSS adopted to document level (added once)

  // Behavior
  createComponent,      // Function → Object — defines instance methods/properties
  events,               // Object — event bindings: { 'click .btn': handler }
  keys,                 // Object — keybindings: { 'ctrl+s': handler }

  // Data
  defaultSettings,      // Object — public props (external API)
  defaultState,         // Object — private reactive state

  // Lifecycle
  onCreated,            // Function — after DOM attachment
  onRendered,           // Function — after shadow DOM render
  onDestroyed,          // Function — on removal from DOM
  onThemeChanged,       // Function — when theme changes
  onAttributeChanged,   // Function — when attribute changes

  // Composition
  subTemplates,         // Object — { name: Template }

  // Primitives only
  componentSpec,        // Object — spec for automatic property configuration
});
```

---

## Common Anti-Patterns

### 1. DOM queries before render

```js
// ❌ WRONG — $ in createComponent or onCreated won't find rendered DOM
const createComponent = ({ $ }) => ({
  initialize() {
    const height = $('.content').height(); // returns 0 or fails
  },
});

// ✅ RIGHT — use onRendered for DOM queries
const onRendered = ({ $ }) => {
  const height = $('.content').height();
};
```

### 2. Forgetting that state values are Signals

```js
// ❌ WRONG — comparing signal object, not its value
if (state.isActive) { ... } // always truthy — it's a Signal object

// ✅ RIGHT — read the value
if (state.isActive.get()) { ... }
```

### 3. Mutating state directly

```js
// ❌ WRONG — mutating the value in place, no reactivity triggered
const items = state.todos.get();
items.push(newItem);

// ✅ RIGHT — use Signal mutation helpers
state.todos.push(newItem);
```

### 4. Using this instead of self

```js
// ❌ WRONG — `this` is the DOM element, not the component instance
const events = {
  'click .btn'() {
    this.doSomething(); // `this` is the clicked element
  },
};

// ✅ RIGHT — destructure self
const events = {
  'click .btn'({ self }) {
    self.doSomething();
  },
};
```

### 5. Putting everything in createComponent

```js
// ❌ WRONG — initialization side effects in createComponent
const createComponent = ({ state }) => {
  setInterval(() => state.time.now(), 1000); // side effect during definition
  return { ... };
};

// ✅ RIGHT — side effects in initialize or onCreated
const createComponent = ({ self, state }) => ({
  initialize() {
    setInterval(() => state.time.now(), 1000);
  },
});
```

### 6. Over-scaffolding

```js
// ❌ WRONG — empty options add noise
defineComponent({
  tagName: 'simple-greeting',
  template: `<p>Hello {name}</p>`,
  css: '',
  createComponent: () => ({}),
  events: {},
  defaultSettings: { name: 'World' },
  defaultState: {},
});

// ✅ RIGHT — only what's needed
defineComponent({
  tagName: 'simple-greeting',
  template: `<p>Hello {name}</p>`,
  defaultSettings: { name: 'World' },
});
```

---

## Accessing Components Externally

```js
import { $ } from '@semantic-ui/query';

// Get instance and call methods
const counter = $('ui-counter').component();
counter.setCounter(42);

// Update settings externally
$('ui-counter').settings({ startingNumber: 100 });

// From inside another component — walk the render tree
const createComponent = ({ findParent, findChild }) => ({
  getParentData() {
    return findParent('parent-widget').getData();
  },
});
```

The instance is stored on the DOM element as `el.component`, isolated from native DOM properties.

---

## Quick Reference

```
Lifecycle:  createComponent → initialize() → onCreated → render → onRendered → [updates] → onDestroyed

Minimal:    defineComponent({ tagName: 'x-hello', template: `<p>Hello</p>` })
With state: defineComponent({ tagName: 'x-count', template: `{n}`, defaultState: { n: 0 } })
Subtemplate: export const row = defineComponent({ template: `<td>{name}</td>` })

Settings → public, proxy-based:   settings.color
State    → private, Signal-based:  state.counter.get() / .set(v)
Template → flat lookup:            {name} checks instance → settings → state → data → helpers
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| `component-css` | Writing scoped CSS for component shadow DOM |
| `component-html` | HTML structure and class naming patterns |
| `reactive-state` | Deep dive into signals, reactions, and state management |
| `component-specs` | Building spec-driven primitives (ui-button, ui-input) |
| `component-theming` | Design tokens and theme integration |
| `mental-model` | Framework-level understanding of how everything fits together |
