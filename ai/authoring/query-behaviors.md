---
title: Query Plugins and Behaviors
description: Guide for extending SUI's Query system with custom plugins and behaviors. Covers plugin creation, behavior lifecycle, mutation observers, and event delegation.
keywords: [Query plugins, behaviors, mutation observer, event delegation, lifecycle, extend Query]
audience: authoring
skill: query-behaviors
type: skill
---

# Query Plugins and Behaviors

> **Skill:** `sui:query-behaviors`
> **Purpose:** Extending SUI's Query system with custom plugins and behaviors
> **Last Updated:** 2026-03-04

---

## Architecture Overview

Query provides two extension mechanisms at different complexity levels:

```
Simple Plugins ($.plugin)
├── Direct prototype extension
├── Stateless operations
├── Method chaining support
└── No lifecycle management

Behaviors (registerBehavior)
├── Full instance management
├── Settings persistence
├── Event delegation system
├── Mutation observers
├── CSS injection
├── Lifecycle hooks
└── Configuration objects
```

### Core Source Files

| File | Purpose |
|------|---------|
| `packages/query/src/register-behavior.js` | Behavior registration, instance loop, return value collection |
| `packages/query/src/behavior.js` | Behavior class: lifecycle, events, mutations, method dispatch |
| `packages/query/src/helpers.js` | Plugin alias exposure (`$.fn`, `$.plugin`) |

---

## Simple Plugins (Prototype Extension)

Simple plugins extend `Query.prototype` directly. Three aliases point to the same object:

```javascript
// All three are equivalent: $.fn === $.plugin === Query.prototype
$.fn.methodName = function() { /* ... */ };
$.plugin.methodName = function() { /* ... */ };
Query.prototype.methodName = function() { /* ... */ };
```

### Plugin Pattern

```javascript
import { $ } from '@semantic-ui/query';

$.plugin.maskInput = function({ type = 'alphanumeric' } = {}) {
  this.on('keydown', (event) => {
    const presets = {
      alpha: /[a-zA-Z]/,
      numeric: /[0-9]/,
      alphanumeric: /[a-zA-Z0-9]/,
    };
    if (event.key.length > 1) return; // allow special keys
    const regex = type instanceof RegExp ? type : presets[type];
    if (event.key.search(regex) === -1) {
      event.preventDefault();
    }
  });
  return this; // enable chaining
};

// Usage
$('input').maskInput({ type: 'numeric' }).addClass('validated');
```

**Key constraints:**
- `this` is the Query instance -- use `.each()` for element iteration
- Return `this` for chaining, or a collected value
- No built-in state management, event cleanup, or lifecycle hooks
- Events use Query's `.on()` directly -- cleanup is manual

---

## Behaviors (Complex Plugins)

### Complete Registration Interface

```javascript
import { registerBehavior } from '@semantic-ui/query';

registerBehavior({
  // Required
  name: 'behaviorName',

  // Optional
  namespace: 'storageKey',            // property name on DOM element (defaults to name)

  // Settings
  defaultSettings: {
    option1: 'value',
    option2: 100,
  },
  allowDataOverride: true,            // data-* attributes override settings (default: true)

  // Configuration objects (customizable, support templating)
  selectors: { trigger: '.trigger', content: '.content' },
  classNames: { active: 'active', visible: 'visible' },
  errors: { noTarget: 'No target element found' },
  templates: { wrapper: '<div class="wrapper"></div>' },

  // CSS injection (constructed stylesheet, cached across instances)
  css: `.behavior { display: block; }`,

  // Behavior factory -- returned methods become the instance API
  createBehavior: ({ $, el, $el, self, settings }) => ({
    initialize() { /* runs automatically after createBehavior */ },
    show() { /* ... */ },
    hide() { /* ... */ },
    toggle() { /* ... */ },
  }),

  // Setup (runs once for the first instance, shared across all instances)
  setup: ({ $, settings, $elements, templates }) => ({
    sharedCache: new Map(),
    $overlay: $('<div>').appendTo('body'),
  }),

  // Declarative events
  events: {
    'click .trigger': ({ self, event }) => { /* ... */ },
    'global scroll window': ({ self }) => { /* ... */ },
  },

  // Declarative mutations
  mutations: {
    'add .item': ({ $added, self }) => { /* ... */ },
    'attributes [data-value]': ({ attributeValue, oldValue }) => { /* ... */ },
  },

  // Fallback for string-based invocation when method not found
  customInvocation: ({ methodName, methodArgs, self }) => {
    return self.performAction(methodName, ...methodArgs);
  },

  // Lifecycle
  onCreated: ({ el, settings }) => { /* ... */ },
  onDestroyed: ({ el }) => { /* ... */ },
});
```

### Duplicate Registration is Safe

If `registerBehavior` is called with a name that already exists, it silently returns. This allows multiple components to depend on the same behavior without conflict.

---

## Callback Parameters

All behavior callbacks (`createBehavior`, event/mutation handlers, `onCreated`, `onDestroyed`) receive the same parameter object via `Behavior.call()`:

```javascript
({
  // Core
  $,                    // Query constructor bound to this element's document
  el,                   // raw DOM element
  $el,                  // Query-wrapped element
  self,                 // behavior instance (all methods + shared state)
  behavior,             // alias for self

  // Configuration (live getters)
  settings,             // merged settings
  selectors,            // selector config object
  classNames,           // class name config object
  errors,               // error message config object
  templates,            // HTML template config object

  // Utilities
  namespace,            // behavior namespace string
  attachEvent,          // bind external events with auto-cleanup
  dispatchEvent,        // dispatch auto-namespaced CustomEvent
  dispatchGroupEvent,   // dispatch event across all elements initialized in the same $().behavior() call
  abortSignal,          // AbortController for lifecycle teardown
  cache,                // persistent cache on Query.prototype[namespace] (shared across ALL instances of this behavior)
  data,                 // element's dataset as parsed native values

  // Logging
  log, debug, warn, error,   // level-gated logging functions

  // Element index (useful for multi-element initialization)
  index,                // 0-based index in the $elements collection
  total,                // total element count
  isFirst,              // true if index === 0
  isLast,               // true if index === total - 1
})
```

Event handlers additionally receive: `event`, `target`, `value`, `data`.
Mutation handlers additionally receive: `mutations`, `$added`, `$removed`, `$target`, `target`, and for attribute mutations: `attributeName`, `attributeValue`, `oldValue`.

> **Note:** The source uses `attributeValue` (not `newValue`) for the current attribute value.

---

## Configuration Objects and Templating

Configuration objects (`selectors`, `classNames`, `errors`, `templates`) are customizable constants that support `{key}` interpolation in event and mutation strings:

```javascript
registerBehavior({
  name: 'accordion',
  selectors: { header: '.accordion-header', content: '.accordion-content' },

  events: {
    // {header} is replaced with selectors.header at runtime
    'click {header}': ({ self }) => self.toggle(),
  },

  mutations: {
    // templating works in mutation strings too
    'add {content}': ({ $added }) => $added.hide(),
  },
});
```

Template interpolation resolves against `selectors`, `classNames`, and `settings` (in that order). This is powered by `Behavior.TEMPLATING_REGEX` (`/\{(\w+)\}/g`).

### Runtime Overrides

```javascript
// Global override (affects all future instances)
$.tooltip.selectors.trigger = '.custom-trigger';
$.tooltip.errors.noContent = 'Contenu introuvable'; // i18n

// Per-instance override
$('.element').tooltip({
  selectors: { trigger: '.my-trigger' },
});

// Data attribute override (when allowDataOverride: true)
// <div data-show-delay="500" data-trigger="hover"></div>
```

---

## Event System

### Event Declaration Syntax

```javascript
events: {
  'click': handler,                     // on behavior element itself
  'click .button': handler,             // delegated within behavior element
  'mouseenter, mouseleave': handler,    // multiple events
  'click .btn1, click .btn2': handler,  // multiple events + selectors
  'global scroll window': handler,      // outside behavior element
  'bind customEvent .element': handler, // direct binding (non-bubbling)
  'click {trigger}': handler,           // with {key} templating
};
```

**Keywords:**
| Keyword | Behavior |
|---------|----------|
| *(none)* | Event delegation on `$element` |
| `global` | Binds to the specified selector anywhere in the document |
| `bind` | Direct binding (no delegation) on matched children — use for non-bubbling events like custom component events that don't set `composed` or `bubbles` |

**Bubble mapping:** Non-bubbling events are automatically mapped to their bubbling equivalents for delegation (`blur` -> `focusout`, `focus` -> `focusin`, `mouseenter` -> `mouseover`, `mouseleave` -> `mouseout`).

### Event Cleanup

All events are bound with an `AbortController`. On `destroy()`, `controller.abort('behavior destroyed')` removes every event at once.

### attachEvent() -- Programmatic External Events

For events that cannot be declared statically, use `attachEvent` from the callback params:

```javascript
createBehavior: ({ attachEvent }) => ({
  initialize() {
    // binds with pierceShadow: true and auto-cleanup via AbortController
    attachEvent('ui-button', 'click', (event) => { /* ... */ });
  },
});
```

### dispatchEvent() -- Auto-Namespaced Events

```javascript
createBehavior: ({ dispatchEvent, dispatchGroupEvent }) => ({
  show() {
    // dispatches 'tooltip:show' (auto-namespaced with behavior name)
    dispatchEvent('show', { content: this.content });
    // dispatch across all elements in the group
    dispatchGroupEvent('show');
  },
});
```

Events are dispatched as `CustomEvent` with `bubbles: true` and `cancelable: true`.

---

## Mutation Observers

### Mutation Declaration Syntax

```javascript
mutations: {
  '.item': handler,                        // any change to .item elements
  'add .item': handler,                    // only additions
  'remove .item': handler,                 // only removals
  'observe .container => .item': handler,  // watch specific container
  'attributes .element': handler,          // attribute changes
  'text .element': handler,                // text content changes
  '{listItem}': handler,                   // with templating
};
```

**Keywords:**
| Keyword | Observer Config | Triggers on |
|---------|----------------|-------------|
| *(none)* / `standard` | `childList + subtree` | Addition or removal |
| `add` | `childList + subtree` | Addition only |
| `remove` | `childList + subtree` | Removal only |
| `observe` | `childList + subtree` | Changes within specified container |
| `attributes` | `attributes + attributeOldValue` | Attribute changes |
| `text` | `characterData + characterDataOldValue` | Text content changes |

The `observe` keyword supports fat arrow syntax to separate the observed container from the filter selector: `'observe .container => .item'`.

### Mutation Cleanup

`MutationObserver` instances are stored in `this.mutationObservers` and disconnected on `destroy()`.

---

## Method Invocation

### Invocation Patterns

```javascript
// String method invocation
$('.element').tooltip('show');
$('.element').tooltip('methodName', arg1, arg2);

// Natural language lookup (camelCase conversion)
$('.element').tooltip('toggle state');    // calls toggleState()
$('.element').tooltip('is visible');      // calls isVisible()

// Direct instance access
document.querySelector('.element').tooltip.show();
```

### Method Lookup Algorithm

For a query like `'toggle state'`:
1. `toggleState()` -- camelCase conversion
2. `toggle.state` -- dot notation traversal
3. `toggle['state']` -- property access
4. `customInvocation()` -- fallback handler

### Custom Invocation

For flexible string-based APIs (e.g., transitions):

```javascript
registerBehavior({
  name: 'transition',
  createBehavior: ({ self }) => ({
    performTransition(type, duration) { /* ... */ },
  }),
  customInvocation: ({ methodName, methodArgs, self }) => {
    return self.performTransition(methodName, ...methodArgs);
  },
});

// Enables: $('.modal').transition('fade in', 500);
```

---

## Lifecycle

### Full Lifecycle Flow

```
Registration
├── registerBehavior() called
├── Query.behaviors.set(name, behavior)
└── Query.prototype[name] created

Initialization ($element.behavior() called)
├── setup() runs once (first instance only)
├── Behavior constructor
│   ├── Settings merged (defaults → global → per-instance → data attributes)
│   ├── Shared behavior merged via extend(this, sharedBehavior)
│   ├── CSS adopted (constructed stylesheet)
│   ├── Data overrides applied
│   ├── AbortController created
│   ├── createBehavior() called, methods merged onto instance
│   ├── Existing instance destroyed if present
│   ├── Instance attached to element[namespace]
│   ├── Events attached
│   ├── Mutations attached
│   ├── initialize() called (if returned from createBehavior)
│   └── onCreated() called
└── Instance ready

Destruction
├── destroy() called (or reinitialize triggered)
├── Mutation observers disconnected
├── AbortController aborts all events
├── onDestroyed() called
└── element[namespace] deleted
```

### initialize() Pattern

If `createBehavior` returns an object with an `initialize` method, it runs automatically after all events and mutations are attached. This is the right place for setup logic that depends on the behavior being fully wired:

```javascript
createBehavior: ({ $el, self, settings }) => ({
  initialize() {
    // events and mutations are already attached here
    $el.find(settings.selector).each(self.enhance);
  },
  enhance(el) { /* ... */ },
}),
```

### setup() Function

Runs once for the entire behavior type (not per-element). The return value is stored on `Query.prototype[namespace]` and persists for the lifetime of the page — it does not re-run if all instances are destroyed and new ones created. Returns shared resources accessible via `self`:

```javascript
setup: ({ $, settings, $elements, templates }) => {
  // $elements is plural -- all elements being initialized
  return {
    cache: new Map(),
    $sharedTooltip: $(templates.tooltip).appendTo('body'),
  };
},

createBehavior: ({ self }) => ({
  useShared() {
    self.cache.set('key', 'value');      // from setup
    self.$sharedTooltip.show();          // from setup
  },
}),
```

### Destroying a Behavior

Call `destroy` via string invocation:

```javascript
$('.element').tooltip('destroy');
// or directly
document.querySelector('.element').tooltip.destroy();
```

This disconnects mutation observers, aborts all events via the AbortController, calls `onDestroyed()`, and deletes the instance from `element[namespace]`.

### Reinitialization

Calling a behavior with new settings on an element that already has an instance triggers `reinitialize()`: the old instance is destroyed and a new one created (CSS is not re-adopted on reinit since it's already in the document).

---

## CSS Integration

Behaviors inject CSS via constructed stylesheets:

```javascript
registerBehavior({
  name: 'tooltip',
  css: `
    .tooltip { position: absolute; opacity: 0; transition: opacity 0.3s; }
    .tooltip.visible { opacity: 1; }
  `,
});
```

- Uses the browser's Constructed Stylesheet API via `adoptStylesheet` from `@semantic-ui/utils`
- Cached and reused across instances
- Adopted to the element's root (document or shadow root)

---

## Instance Management

### Storage

Instances are stored directly on DOM elements:

```javascript
// Default: element[behaviorName]
element.tooltip = behaviorInstance;

// Custom namespace
registerBehavior({ name: 'tooltip', namespace: 'myTooltip' });
// element.myTooltip = behaviorInstance;
```

### Instance Access

```javascript
const instance = Behavior.getInstance(element, 'tooltip');
// equivalent to: element.tooltip
```

---

## Return Value Collection

When a method is called across multiple elements, return values are collected intelligently:

```javascript
// Single element -- single value
$('.one').tooltip('is visible');     // true

// Multiple elements, same value -- single value (deduplicated)
$('.three').tooltip('get type');     // 'info'

// Multiple elements, different values -- array
$('.three').tooltip('get type');     // ['info', 'warning']

// Void methods -- returns Query instance for chaining
$('.el').tooltip('show').addClass('active');
```

---

## Settings Merge Order

Settings are resolved with increasing precedence:

```
Query.prototype[name].defaultSettings   ← registration defaults
→ merged with user settings              ← $el.behavior({ ... })
→ overridden by data attributes          ← data-option="value" (if allowDataOverride)
```

Global overrides on `Query.prototype[name]` for `classNames`, `selectors`, `errors` are also merged at runtime, giving three levels of configurability.

---

## Logging

Behaviors have built-in level-gated logging:

```javascript
createBehavior: ({ log, debug, warn, error }) => ({
  show() {
    debug('Showing tooltip');     // only outputs if logLevel >= 'debug'
    error('Failed to position');  // only outputs if logLevel >= 'error'
  },
}),
```

Log levels (in order): `silent`, `error`, `warn`, `info`, `debug`. Set via `logLevel` in settings or globally via `$.logLevel`.

Performance tracking is available via `logPerformance: true`, which wraps all method calls in a `Proxy` that records `performance.mark` / `performance.measure` timings.

---

## Decision Matrix

### When to Use Each

| Use a **Simple Plugin** when... | Use a **Behavior** when... |
|---|---|
| Utility method (`.shuffle()`, `.formatDate()`) | Stateful component (tooltip, modal, accordion) |
| One-time operation | Complex event handling (drag & drop) |
| Stateless transformation | Settings persistence needed |
| Simple event binding | Animation system with string API |
| DOM manipulation helper | DOM monitoring (auto-enhance, lazy load) |

### Feature Comparison

| Feature | Simple Plugin | Behavior |
|---------|--------------|----------|
| State management | Manual | Built-in |
| Settings system | Manual | Auto merging + data overrides |
| Event handling | Query `.on()` | Declarative + delegation + auto-cleanup |
| Mutation observers | Manual | Declarative syntax |
| CSS injection | Manual | Constructed stylesheets, cached |
| Method invocation | Direct only | String + natural language + custom |
| Return values | Manual | Intelligent collection |
| Lifecycle hooks | None | `initialize` / `onCreated` / `onDestroyed` |
| Instance storage | Manual | Automatic on element |
| Configuration objects | None | `selectors` / `classNames` / `errors` / `templates` |
| Templating | None | `{key}` interpolation |
| Logging | Manual | Level-gated, built-in |
| Shared resources | Manual | `setup()` function |
| Performance tracking | Manual | `logPerformance` proxy |

---

## Quick Reference

### Register a Simple Plugin

```javascript
$.plugin.myMethod = function(options = {}) {
  return this.each((el) => { /* per-element work */ });
};
```

### Register a Behavior

```javascript
registerBehavior({
  name: 'myBehavior',
  defaultSettings: { delay: 100 },
  selectors: { trigger: '.trigger' },
  createBehavior: ({ $el, self, settings }) => ({
    initialize() { /* runs after events/mutations attached */ },
    show() { /* ... */ },
  }),
  events: { 'click {trigger}': ({ self }) => self.show() },
  mutations: { 'add .item': ({ $added }) => { /* ... */ } },
  onCreated: ({ el }) => { /* ... */ },
  onDestroyed: ({ el }) => { /* ... */ },
});
```

### Invoke a Behavior Method

```javascript
$('.el').myBehavior('show');              // string invocation
$('.el').myBehavior('is visible');        // natural language
document.querySelector('.el').myBehavior.show(); // direct
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Query** | `sui:query` | Basic `$` / `$$` usage, selectors, DOM manipulation, events |
| **Reactive State** | `sui:reactive-state` | Signals and reactions for reactive state |
