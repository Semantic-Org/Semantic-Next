---
title: Component Lifecycle
description: Complete guide to component lifecycle hooks, execution order, callback arguments, SSR guards, cleanup patterns, and DOM lifecycle events in Semantic UI components.
keywords: [lifecycle, createComponent, initialize, onCreated, onRendered, onDestroyed, onThemeChanged, SSR, isClient, isServer, cleanup, attachEvent, DOM events]
audience: authoring
skill: component-lifecycle
---

# Component Lifecycle

> **Skill:** `sui:component-lifecycle`
> **Purpose:** Complete guide to component lifecycle hooks, execution order, callback arguments, cleanup patterns, and SSR considerations.
> **Last Updated:** 2026-03-04

---

**Golden rule: Use the earliest hook that gives you what you need.** Put state setup in `createComponent`, pre-render logic in `onCreated`, DOM work in `onRendered`. If you put DOM work in `onCreated`, it will fail. If you put state setup in `onRendered`, it will cause unnecessary re-renders.

---

## Execution Order

```
defineComponent()
    │
    ▼
┌──────────────────────────────────┐
│  1. createComponent()            │  Instance created, state/settings available
│     └─ initialize()              │  Called immediately if defined on instance
├──────────────────────────────────┤
│  2. onCreated()                  │  Instance ready, DOM not yet rendered
│     └─ dispatches "created"      │  Native DOM event on element
├──────────────────────────────────┤
│  3. render()                     │  Template evaluated, HTML produced
├──────────────────────────────────┤
│  4. onRendered()                 │  Shadow DOM available, events attached
│     └─ dispatches "rendered"     │  Native DOM event on element
├──────────────────────────────────┤
│     ... component is live ...    │
├──────────────────────────────────┤
│  5. onDestroyed()                │  Component removed from DOM
│     └─ dispatches "destroyed"    │  Native DOM event on element
└──────────────────────────────────┘
```

`onThemeChanged` fires independently whenever the `dark`/`light` class changes on `<html>`.

---

## Lifecycle Hooks

### createComponent

Defines the component instance: methods, reactive computations, exposed values. Runs once per component instantiation. Returns an object that becomes the `self` (also `tpl`, `component`) in all other callbacks.

```javascript
const createComponent = ({ self, signal, state, settings, reaction, $ }) => ({
  count: signal(0),
  isEven: (number) => number % 2 === 0,
  initialize() {
    reaction(() => {
      console.log('Count changed:', self.count.get());
    });
  },
});
```

#### initialize()

If the returned instance object includes a method named `initialize`, the framework calls it immediately after the instance is created. Use it for reactive computations, derived state, or one-time setup that depends on `self` being fully constructed.

```javascript
// ✅ Correct: reactive setup in initialize
const createComponent = ({ self, state, reaction }) => ({
  initialize() {
    reaction(() => {
      if (state.query.get().length > 0) {
        self.search();
      }
    });
  },
  search() { /* ... */ },
});

// ❌ WRONG: DOM queries in createComponent/initialize (DOM doesn't exist yet)
const createComponent = ({ $ }) => ({
  initialize() {
    $('.button').addClass('ready'); // will fail
  },
});
```

### onCreated

Fires after `createComponent` and `initialize()` complete but before the DOM renders. The component instance (`self`) is available but the shadow DOM is not.

**Use for:** Attaching external event handlers, setting initial state from settings, pre-render logic.

```javascript
const onCreated = ({ self, state, settings, isClient }) => {
  state.theme.set(self.getLocalTheme());
  if (isClient) {
    self.calculateTheme();
  }
};
```

### onRendered

Fires once after the first render of the shadow DOM. DOM queries (`$`, `$$`) work here. This is where you bind observers, measure elements, or start animations.

```javascript
const onRendered = ({ self, isClient, settings }) => {
  if (isClient) {
    self.bindPageEvents();
  }
};
```

**Important:** `onRendered` fires on the server too. Guard DOM access with `isClient`.

### onDestroyed

Fires when the component is removed from the DOM. The framework auto-cleans reactions, events, and observers (see [Cleanup](#cleanup-decision-tree)). Use this for resources the framework cannot track.

```javascript
const onDestroyed = ({ self, isServer }) => {
  if (isServer) return;
  self.unbindPageEvents(); // e.g. IntersectionObserver.disconnect()
};
```

### onThemeChanged

Fires when the user's theme changes (light/dark class toggle on `<html>`). Debounced (10ms) to coalesce rapid changes.

```javascript
const onThemeChanged = ({ self, darkMode }) => {
  self.updateChartColors(darkMode);
};
```

Only active on the client. Only fires if `onThemeChanged` is provided (no MutationObserver is created otherwise).

---

## Callback Arguments

Every lifecycle callback, event handler, and key binding receives the same destructured parameter object. Destructure only what you need.

### Standard Arguments

| Parameter | Description |
|-----------|-------------|
| `el` | Raw DOM element of the web component |
| `self` / `tpl` / `component` | Component instance from `createComponent` |
| `$` / `$$` | Query scoped to shadow DOM / piercing shadow DOM |
| `reaction` / `signal` | Create reactive computation / signal |
| `flush` / `afterFlush` / `nonreactive` | Reactive timing controls |
| `settings` | Reactive settings proxy (read/write) |
| `state` | Reactive state signals |
| `data` | Full template data context |
| `rerender` | Force a full DOM re-render |
| `isRendered` | Function: whether DOM has rendered |
| `isServer` / `isClient` | Environment detection booleans |
| `dispatchEvent` | Emit custom events from component |
| `attachEvent` | Listen to external events (auto-cleaned on destroy) |
| `bindKey` | Bind keyboard shortcuts dynamically |
| `abortController` | AbortController tied to component lifecycle |
| `helpers` | Access to template helpers |
| `template` / `templateName` | Underlying Template instance and its name |
| `templates` | All rendered templates on page |
| `findTemplate` / `findParent` / `findChild` / `findChildren` | Template tree traversal |
| `darkMode` | Whether dark mode is active (lazy getter) |

### Event-Only Arguments

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | Event | The native event object |
| `value` | any | `event.target.value` |
| `data` | Object | `event.detail` merged with `data-*` attributes |

### Key Binding Arguments

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputFocused` | Boolean | Whether any input/contenteditable is focused |
| `repeatedKey` | Boolean | Whether the key is held down |

---

## SSR Considerations

All lifecycle hooks fire on the server in the same order as on the client. Browser globals do not exist on the server.

```javascript
// ✅ Guard browser-only code
const onRendered = ({ self, isClient }) => {
  if (isClient) {
    self.bindIntersectionObserver();
  }
};

// ❌ WRONG: unguarded browser API
const onCreated = ({ state }) => {
  state.url.set(window.location.pathname); // crashes on server
};
```

**Rule of thumb:** Any code referencing `window`, `document`, `localStorage`, `navigator`, `IntersectionObserver`, `ResizeObserver`, or `requestAnimationFrame` must be wrapped in `if (isClient)`.

---

## DOM Lifecycle Events

Each lifecycle hook dispatches a corresponding native DOM event on the component element. These are non-composed (do not cross shadow DOM boundaries).

| Event Name | When | `event.detail` |
|------------|------|-----------------|
| `created` | After instance initialized, before DOM | `{ component }` |
| `rendered` | After first render | `{ component }` |
| `destroyed` | After removal from DOM | `{ component }` |

Listen from external code or another component's event DSL:

```javascript
// From JavaScript
document.querySelector('my-component')
  .addEventListener('rendered', (e) => e.detail.component.doSomething());

// From another component's events
const events = {
  'rendered my-child'({ data }) {
    data.component.configure({ parent: self });
  },
};
```

---

## Cleanup Decision Tree

```
Is the resource created by the framework?
│
├─ YES: Framework auto-cleans it
│   ├─ Reactions created via reaction()        ✅ auto-stopped
│   ├─ Events declared in events = {}          ✅ auto-removed
│   ├─ Events added via attachEvent()          ✅ auto-removed (AbortController)
│   ├─ Key bindings declared in keys = {}      ✅ auto-removed
│   ├─ MutationObserver for onThemeChanged     ✅ auto-disconnected
│   └─ Template tree references (parent/child) ✅ auto-removed
│
└─ NO: You must clean it up in onDestroyed
    ├─ setInterval / setTimeout                ❌ clearInterval/clearTimeout
    ├─ IntersectionObserver                    ❌ observer.disconnect()
    ├─ ResizeObserver                          ❌ observer.disconnect()
    ├─ Raw addEventListener (not attachEvent)  ❌ removeEventListener
    ├─ WebSocket connections                   ❌ socket.close()
    └─ Third-party library instances           ❌ instance.destroy()
```

### attachEvent vs addEventListener

`attachEvent` auto-unbinds when the component is destroyed via an internal `AbortController`. Always prefer it over raw `addEventListener`:

```javascript
// ✅ Auto-cleaned on destroy
const onRendered = ({ attachEvent, self, isClient }) => {
  if (isClient) {
    attachEvent(window, 'hashchange', self.onHashChange);
  }
};

// ❌ Leaks — raw listener requires manual cleanup in onDestroyed
window.addEventListener('hashchange', self.onHashChange);
```

### Manual Cleanup Pattern

Store a reference on `self` and clean up in `onDestroyed`:

```javascript
const createComponent = ({ self }) => ({
  observer: null,
  bindObserver() {
    self.observer = new IntersectionObserver(self.onIntersect, { threshold: [0, 1] });
  },
});

const onRendered = ({ self, isClient }) => {
  if (isClient) self.bindObserver();
};

const onDestroyed = ({ self, isServer }) => {
  if (isServer) return;
  if (self.observer) self.observer.disconnect();
};
```

### Timer Cleanup

```javascript
const createComponent = ({ self, state }) => ({
  initialize() {
    self.interval = setInterval(() => state.counter.increment(), 1000);
  },
});

const onDestroyed = ({ self }) => {
  clearInterval(self.interval);
};
```

---

## Quick Reference

```javascript
defineComponent({
  createComponent,  // 1. Define instance + initialize()
  onCreated,        // 2. Instance ready, no DOM
  onRendered,       // 3. DOM available
  onDestroyed,      // 4. Removed from DOM
  onThemeChanged,   // Fires on theme swap
});
```

| Hook | DOM? | `self`? | Runs on server? | Use for |
|------|------|---------|-----------------|---------|
| `createComponent` | No | Defining it | Yes | State, methods, reactive setup |
| `initialize()` | No | Yes | Yes | Reactions, derived state |
| `onCreated` | No | Yes | Yes | External events, pre-render logic |
| `onRendered` | Yes | Yes | Yes (guard!) | DOM queries, observers, animations |
| `onDestroyed` | Removed | Yes | Yes | Manual resource cleanup |
| `onThemeChanged` | Yes | Yes | No | Theme-dependent recalculation |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Component HTML** (`sui:component-html`) | Writing shadow DOM templates |
| **Component CSS** (`sui:component-css`) | Styling components |
| **Reactive State** (`sui:reactive-state`) | Signals, reactions, dependency tracking |
| **Component Specs** (`sui:component-specs`) | Adding specs to primitives |
