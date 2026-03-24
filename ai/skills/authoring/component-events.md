---
title: Component Events Guide
description: Event handling in Semantic UI components — the event DSL, delegation, dispatching custom events, event data, handler return values, @event template syntax, attachEvent, and cross-component communication patterns.
keywords: [events, event DSL, delegation, dispatchEvent, attachEvent, deep events, global events, bind events, custom events, event data, "@event", keys, keyboard, findParent, findChild]
audience: authoring
skill: component-events
type: skill
---

# Component Events Guide

> **Skill:** `component-events`
> **Purpose:** Event handling in Semantic UI components — the DSL syntax, delegation model, dispatching, data flow, and the decision tree for cross-component communication
> **Last Updated:** 2026-03-04

---

## Golden Rule

**Events are delegated to the shadow root.** All selectors in the `events` object use event delegation — the handler is attached to the component's shadow root, not to each matching element. This means dynamically added elements matching the selector will fire the handler without re-binding. Use the `deep`, `global`, and `bind` keywords only when delegation doesn't reach the target.

---

## Event DSL Syntax

The `events` object maps event strings to handler functions. The string format is:

```
[keyword] eventName[, eventName] [selector[, selector]]
```

### The Four Dialects

| Keyword | Attached To | Use When |
|---------|------------|----------|
| *(none)* | Shadow root (delegated) | Default — elements in your template |
| `deep` | Shadow root (delegated, pierces) | Target is inside a child web component's shadow DOM or slotted content |
| `global` | The selector itself (document/window) | Window events: `scroll`, `resize`, `hashchange` |
| `bind` | Each matching element directly | CustomEvents that don't bubble, or when delegation won't work |

### Syntax Examples

```js
const events = {
  // Standard delegated — most common
  'click .submit'({ self }) {
    self.submit();
  },

  // Multiple events, one selector
  'mouseup, mouseleave .handle'({ state }) {
    state.dragging.set(false);
  },

  // Multiple selectors
  'click .save, click .apply'({ self }) {
    self.persist();
  },

  // Component-wide (no selector) — fires on any part of the component
  'mouseover'({ state }) {
    state.hovered.set(true);
  },

  // Deep — pierces child web component shadow DOM
  'deep click menu-item'({ self, value }) {
    self.setValue(value);
  },

  // Global — window/document events
  'global resize window'({ self }) {
    self.onResize();
  },

  // Bind — attach directly to matching elements (not delegated)
  'bind customevent some-component'({ data }) {
    // CustomEvents don't bubble by default
  },
};
```

### Non-Bubbling Event Mapping

Because delegation requires bubbling, the framework automatically maps non-bubbling events to their bubbling equivalents:

| You Write | Actually Bound |
|-----------|---------------|
| `blur` | `focusout` |
| `focus` | `focusin` |
| `mouseenter` | `mouseover` |
| `mouseleave` | `mouseout` |

---

## Handler Parameters

Every event handler receives the standard callback params (`self`, `$`, `$$`, `state`, `settings`, `reaction`, `signal`, etc.) plus event-specific extras:

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | Event | The native DOM event object |
| `data` | Object | Merged: `event.detail` + `data-*` attributes from the target element |
| `value` | any | Shortcut: `target.value \|\| event.target.value \|\| event.detail.value` |
| `target` | Element | The element matching the selector (not the event origin) |
| `isDeep` | boolean | `true` if the event came from inside a child component's shadow DOM |

### `this` Context

Inside the handler, `this` refers to the DOM element matching the selector. This lets you use `$(this)` for element-specific operations:

```js
'click .item'({ $, self }) {
  $(this).addClass('active');
  self.selectItem($(this).data('id'));
}
```

---

## Event Data

### HTML Data Attributes

Data attributes on the target element are automatically parsed and available via `data`:

```html
<ui-button data-action="increment" data-amount="5">+5</ui-button>
```

```js
'click ui-button'({ data }) {
  // data = { action: 'increment', amount: 5 }
  // Values are JSON.parse'd — numbers, booleans, objects come through typed
}
```

This pattern is powerful for reducing handler count — one handler, many data-driven targets:

```js
// ✅ One handler driven by data attributes
'click ui-button'({ self, data }) {
  state[data.dimension][data.helper](settings.delta);
}

// ❌ Separate handler per button
'click .increase.width': ({ self }) => self.increaseWidth(),
'click .decrease.width': ({ self }) => self.decreaseWidth(),
'click .increase.height': ({ self }) => self.increaseHeight(),
'click .decrease.height': ({ self }) => self.decreaseHeight(),
```

### Custom Event Data

Data dispatched via `dispatchEvent` is merged into the same `data` object:

```js
// Emitting component
dispatchEvent('resizeStart', { initialSize: 100, direction: 'horizontal' });

// Listening component
'resizeStart ui-panel'({ data }) {
  // data = { initialSize: 100, direction: 'horizontal' }
}
```

---

## Handler Return Values

| Return Value | Effect |
|-------------|--------|
| `false` | Calls `event.stopPropagation()` — prevents the event from reaching other handlers |
| `'cancel'` | Calls `event.preventDefault()` — cancels the browser's default action |

```js
const events = {
  'click .internal-link'({ self, data }) {
    self.navigate(data.href);
    return false; // stop propagation — handled internally
  },
  'submit form'({ self }) {
    self.handleSubmit();
    return 'cancel'; // prevent native form submission
  },
};
```

---

## Dispatching Custom Events

Use `dispatchEvent` from `createComponent` or any callback to emit events from your component:

```js
const createComponent = ({ dispatchEvent, self }) => ({
  selectItem(itemID) {
    self.activeItem = itemID;
    dispatchEvent('itemactive', { itemID });
  },
});
```

**What `dispatchEvent` does:**
1. Calls `element.onItemactive(eventData)` if the callback exists as a setting (camelCase with `on` prefix)
2. Fires a native `CustomEvent` on the component element

Consumers listen to dispatched events like any other event:

```js
// From another component's events object
'itemactive inpage-menu'({ data }) {
  const { itemID } = data;
}

// Via Query
$('inpage-menu').on('itemactive', (event) => {
  const { itemID } = event.detail;
});

// Via vanilla JS
document.querySelector('inpage-menu')
  .addEventListener('itemactive', (e) => {
    const { itemID } = e.detail;
  });
```

### Callbacks vs Events

```js
const defaultSettings = {
  // ✅ Setting callback — use when caller needs to return a value to control behavior
  shouldShow: () => true,

  // ❌ Setting callback for notification — use dispatchEvent instead
  onShow: function() {},
};
```

Use setting callbacks only when the caller must return a value (e.g., to cancel an action). For notifications, dispatch an event.

---

## Lifecycle Events

Every component automatically emits lifecycle events as native DOM events. Listen to them in parent components:

```js
const events = {
  'rendered child-component'({ data }) {
    const childInstance = data.component;
    childInstance.doSomething();
  },
  'destroyed child-component'() {
    // child was torn down
  },
};
```

Available lifecycle events: `created`, `rendered`, `destroyed`.

---

## Template Event Binding (`@event`)

Bind events directly in templates using `@event` syntax:

```html
<div @click={toggleMenu}>Toggle</div>
<input @input={handleSearch}>
<button @mousedown={startDrag}>Drag</button>
```

The handler must be a function available in the template data context (a method from `createComponent`):

```js
const createComponent = ({ state }) => ({
  toggleMenu() {
    state.menuOpen.toggle();
  },
});
```

```html
<div @click={toggleMenu}>Menu</div>
```

**When to use `@event` vs `events` object:**

| Approach | Best For |
|----------|----------|
| `events` object | Delegation across dynamic content, data-attribute-driven handlers, `deep`/`global`/`bind` keywords |
| `@event` in template | Simple one-off bindings where the target is explicit in the template |

---

## Dynamic Event Binding (`attachEvent`)

Use `attachEvent` when you don't know the selector until runtime or need to bind to external elements:

```js
const onCreated = ({ attachEvent, settings, self, isClient }) => {
  if (isClient) {
    attachEvent(settings.scrollContext, 'scroll', self.onScroll);
  }
};
```

**Key behavior:**
- Events bound via `attachEvent` are automatically removed when the component is destroyed (via `AbortController`)
- Returns the handler reference for manual unbinding:

```js
const handler = attachEvent('body', 'click', () => {
  console.log('clicked');
});
$('body').off('click', handler);
```

- By default uses `{ pierceShadow: true }` — the selector resolves across shadow boundaries

---

## Keyboard Events (`keys`)

The `keys` object provides declarative keyboard binding separate from the `events` object:

```js
const keys = {
  'up'({ self, state }) {
    if (!state.active.get()) return;
    self.selectPrevious();
  },
  'down'({ self, state }) {
    if (!state.active.get()) return;
    self.selectNext();
  },
  'enter'({ self }) {
    self.confirm();
  },
  'ctrl+k'({ self }) {
    self.openSearch();
  },
};
```

Key handlers are bound globally on `document`. Return `true` from a key handler to allow the default browser action; any other return (including `undefined`) calls `preventDefault()`.

Use `bindKey` from callbacks for dynamic key binding:

```js
const onCreated = ({ bindKey, settings, self }) => {
  bindKey(settings.openKey, self.openModal);
};
```

---

## Communication Decision Tree

When components need to talk to each other, choose the right mechanism:

```
Does the parent need to control/cancel the action?
├─ YES → Setting callback: shouldShow: () => true
└─ NO → Is communication upward (child → parent)?
    ├─ YES → dispatchEvent('eventName', data)
    │         Parent listens: 'eventName child-tag'({ data }) { ... }
    └─ NO → Is communication downward (parent → child)?
        ├─ YES → Does parent need to call a method?
        │   ├─ YES → findChild('childName').methodName()
        │   └─ NO → Pass data via settings/attributes
        └─ SIDEWAYS → Use findParent to locate shared ancestor
```

### Production Patterns

**Child dispatches, parent listens** (most common):
```js
// panel.js — child dispatches resize events
dispatchEvent('resizeStart', { initialSize, direction, startPosition });

// panels.js — parent listens and coordinates
'resizeStart ui-panel'({ self, event, data }) {
  const panel = event.target;
  self.setDragStartCalculations(panel, data);
}
```

**Child finds parent for direct API calls:**
```js
// panel.js — child reaches up to parent
const createComponent = ({ findParent }) => ({
  getPanels() {
    return findParent('uiPanels');
  },
});
```

---

## Quick Reference

### Event DSL Format
```
[deep|global|bind] eventName[, eventName] [selector[, selector]]
```

### Handler Params (event-specific)
```
event    — native Event
data     — { ...dataset, ...event.detail }
value    — target.value || event.target.value || detail.value
target   — element matching selector
isDeep   — boolean
```

### Return Values
```
return false    → stopPropagation()
return 'cancel' → preventDefault()
```

### Dispatching
```js
dispatchEvent('name', { key: value })  // fires CustomEvent + onName callback
```

### Dynamic Binding
```js
attachEvent(selector, 'eventName', handler)  // auto-cleanup on destroy
bindKey('ctrl+k', handler)                   // dynamic keyboard binding
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Mental Model** (`mental-model`) | Understanding callback params and destructuring patterns |
| **Component HTML** (`component-html`) | Template syntax including `@event` binding |
| **Reactive State** (`reactive-state`) | Signal methods used in event handlers (`toggle`, `increment`, `set`) |
| **Query Behaviors** (`query-behaviors`) | Building behaviors with their own event delegation |
| **Component Specs** (`component-specs`) | Declaring events in spec definitions for primitives |
