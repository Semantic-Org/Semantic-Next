---
title: Component State Management
description: How to manage data in components — settings (public reactive API), state (internal signals), component props (non-reactive), signal helpers, reactivity controls, and the template data context.
keywords: [settings, state, signal, component props, defaultSettings, defaultState, createComponent, reactive proxy, data context, afterFlush, peek, nonreactive, self]
audience: authoring
skill: component-state
---

# Component State Management

> **Skill:** `sui:component-state`
> **Purpose:** Decision-making guide for managing data in Semantic UI components — when to use settings vs state vs component props, how each behaves reactively, and how templates access them.
> **Last Updated:** 2026-03-04

---

**Golden rule: Settings are the public API, state is the internal store, component props are scratch space. Pick the wrong one and you fight the reactivity system instead of using it.**

---

## Three Data Sources

Every component has three places to put data. Choosing correctly determines whether updates flow automatically or require manual wiring.

| Source | Declared in | Reactive? | Accessible from outside? | In template as... |
|--------|-------------|-----------|--------------------------|-------------------|
| **Settings** | `defaultSettings` | Yes (reactive Proxy) | Yes (attributes, JS, Query) | `{name}` directly |
| **State** | `defaultState` | Yes (Signal instances) | No | `{name}` directly |
| **Component props** | `createComponent` return | No | Via `self` only | `{methodName}` or `{propName}` |

### How templates see them

The template data context is **flat**. Settings, state, and the component instance are spread into a single namespace:

```js
// Inside packages/templating, getDataContext() does:
{ ...this.data, ...this.state, ...this.instance }
```

This means `{counter}` in a template could resolve from settings, state, or the component instance. **State wins over settings for same-named keys** because it spreads second.

```html
<!-- ✅ Direct name — template resolves from the flat context -->
<p>Count: {counter}</p>

<!-- ❌ WRONG — state is not a proxy object in templates -->
<p>Count: {state.counter}</p>
<p>Count: {counter.get()}</p>
```

---

## Settings — The Public API

Settings are the external configuration surface. Users set them via HTML attributes, JavaScript properties, or Query.

### Declaring

```js
const defaultSettings = {
  animation: 'fade',
  duration: 300,
  items: [],
  onSelect: null,
};

defineComponent({
  tagName: 'my-dropdown',
  defaultSettings,
  // ...
});
```

A setting's type is **inferred from its default value** — no explicit type declarations needed.

### How users set them

```html
<!-- HTML attributes (kebab-case maps to camelCase) -->
<my-dropdown animation="slide" duration="500"></my-dropdown>
<my-dropdown start-index="3"></my-dropdown>   <!-- sets startIndex -->
```

```js
// JavaScript property
document.querySelector('my-dropdown').animation = 'slide';

// Query library
$('my-dropdown').settings({ animation: 'slide', duration: 500 });
$('my-dropdown').setting('onSelect', (item) => console.log(item));
```

Functions cannot be serialized as attributes — pass them via JavaScript or Query's `initialize()`.

### Reactivity behavior

Settings are backed by a **reactive Proxy**. The proxy intercepts property access and maps each setting to an internal Signal, so reading a setting inside a `reaction()` creates a dependency.

```js
const onCreated = ({ settings, reaction }) => {
  // ✅ Reactive — re-runs when settings.animation changes
  reaction(() => {
    console.log(`Animation is: ${settings.animation}`);
  });
};
```

Settings are also reactive in templates — template expressions, conditionals, and loops all auto-track setting dependencies.

### The destructuring trap

Because settings use a Proxy, **destructuring captures the value at that moment** and loses reactivity:

```js
// ❌ WRONG — captured once, never updates
const onCreated = ({ settings }) => {
  const { animation } = settings;  // snapshot, not reactive
};

// ✅ RIGHT — read through the proxy each time
const onCreated = ({ settings, reaction }) => {
  reaction(() => {
    console.log(settings.animation);  // reads through proxy, reactive
  });
};
```

You can safely destructure `settings` from the callback params (that's the proxy itself). But do not destructure individual setting values out of it if you need reactivity.

### Reading settings in component logic

```js
const createComponent = ({ settings, state }) => ({
  initialize() {
    // Read settings to seed state
    state.items.set(settings.initialItems || []);
  },
  getTabContent() {
    // Read settings directly — reactive inside reactions/templates
    return settings.tabs[state.tabIndex.value]?.content;
  },
});
```

---

## State — The Internal Store

State is the component's private reactive data. Each property in `defaultState` becomes a **Signal instance** when the component initializes.

### Declaring

```js
const defaultState = {
  counter: 0,
  isOpen: false,
  items: [],
  selectedItem: null,
};
```

### Reading and writing in component logic

State signals support both `.get()`/`.set()` and the `.value` property accessor:

```js
const createComponent = ({ state }) => ({
  getCount() {
    return state.counter.get();      // method style
    // return state.counter.value;   // property style — equivalent
  },
  reset() {
    state.counter.set(0);            // method style
    // state.counter.value = 0;      // property style — equivalent
  },
});
```

### Signal helpers

Because state properties are Signal instances, they expose convenience methods. These are verified from the Signal source:

**Numbers:**
```js
state.counter.increment();         // +1
state.counter.increment(5);        // +5
state.counter.increment(1, 100);   // +1, capped at 100
state.counter.decrement();         // -1
state.counter.decrement(1, 0);     // -1, floored at 0
```

**Booleans:**
```js
state.isOpen.toggle();             // flip true/false
```

**Arrays:**
```js
state.items.push({ id: 1, text: 'New' });           // append
state.items.unshift(item);                            // prepend
state.items.splice(1, 2);                             // remove/replace
state.items.filter(item => item.active);              // filter in place
state.items.map(item => ({ ...item, done: true }));   // transform
state.items.getIndex(0);                              // read by index
state.items.setIndex(0, newItem);                     // write by index
state.items.removeIndex(0);                           // remove by index

// ID-based operations (matches id, _id, hash, or key properties)
state.items.getItem('abc');                           // find by ID
state.items.setProperty('abc', 'done', true);         // set property on item by ID
state.items.replaceItem('abc', newItem);              // replace entire item
state.items.removeItem('abc');                        // remove by ID
state.items.setArrayProperty('active', false);        // set property on all items
```

**Objects / Dates / General:**
```js
state.user.setProperty('name', 'Alex');    // set single object property
state.lastUpdated.now();                   // set to current Date
state.anything.clear();                    // set to undefined
state.anything.peek();                     // read WITHOUT creating dependency
state.anything.mutate(val => { val.x = 1; }); // mutate in place, reactivity auto-detected
```

### Reactivity behavior

State signals are reactive in both `reaction()` blocks and templates:

```js
const onCreated = ({ state, reaction }) => {
  reaction(() => {
    // Re-runs whenever counter changes
    console.log(`Count: ${state.counter.get()}`);
  });
  state.counter.increment();  // triggers the reaction above
};
```

```html
<!-- Template — reactive by default, no .get() needed -->
Counter is: {counter}
```

---

## Component Props — Non-reactive Scratch Space

Anything returned from `createComponent` that is **not a signal** is a component prop. Methods, static data, cached references — they live on `self` and are callable from templates, events, and other methods.

```js
const createComponent = ({ self, state, signal, reaction }) => ({
  // This IS a signal — reactive
  count: signal(0),

  // These are component props — NOT reactive
  birthdayCalendar: [
    { name: 'Jack', birthday: 'August 10' },
    { name: 'Elliot', birthday: 'January 13' },
  ],

  isEven: (number) => (number % 2 === 0),

  increment() {
    self.count.increment();
  },
});
```

Component props appear in the template data context, so methods and static values are callable directly:

```html
{isEven counter}
{#each person in birthdayCalendar}
  {person.name}: {person.birthday}
{/each}
```

### When to use component props

- **Methods**: Logic callable from templates and events
- **Static data**: Lookup tables, configuration arrays, constants
- **DOM references**: Cached query results (non-reactive by nature)
- **External instances**: Third-party library objects

Component props are **not tracked by the reactivity system**. Changing them does not trigger re-renders. If you need a value to update the template, use state or a signal.

---

## Decision Tree: Settings vs State vs Component Props

```
Is this data set from outside the component?
├── YES → Settings (defaultSettings)
│         Users configure it via attributes, JS properties, or Query
│
└── NO → Does it need to trigger re-renders when changed?
    ├── YES → State (defaultState) or signal() in createComponent
    │         Use defaultState for simple initial values
    │         Use signal() for signals that need custom options
    │
    └── NO → Component prop (plain value on createComponent return)
             Static data, methods, cached references
```

### Choosing between defaultState and signal()

Both create Signal instances. The difference is declaration convenience:

```js
// defaultState — simple, declarative, converted to signals automatically
const defaultState = { counter: 0, isOpen: false };

// signal() in createComponent — needed when you want signal options or
// to create signals dynamically
const createComponent = ({ signal }) => ({
  element: signal(null, { allowClone: false }),  // custom options
  count: signal(0),                               // explicit signal
});
```

Use `defaultState` by default. Use `signal()` when you need `allowClone: false`, custom equality, or signals created conditionally.

---

## Reactivity Controls

### peek — Read without subscribing

```js
// ✅ Read without creating a dependency
const currentValue = state.counter.peek();
```

Use `peek()` when you need the current value inside a reaction but don't want that signal to trigger re-runs.

### Reaction.nonreactive — Suppress tracking for a block

```js
const createComponent = ({ state, reaction }) => ({
  initialize() {
    reaction(() => {
      const count = state.counter.get();  // tracked

      // Read other signals without tracking them
      const config = Reaction.nonreactive(() => {
        return state.config.get();
      });

      processData(count, config);
    });
  },
});
```

In templates, use the `nonreactive` helper to prevent tracking:

```html
{#each item in nonreactive items}
  {item}
{/each}
```

### afterFlush — Run code after reactive updates complete

```js
const createComponent = ({ $, state, afterFlush }) => ({
  resetForm() {
    state.username.value = '';
    state.email.value = '';

    // DOM is updated after the reactive flush
    afterFlush(() => {
      $('input[name="username"]').focus();
    });
  },
});
```

`afterFlush` is essential when you need to interact with the DOM after state changes have been rendered.

### flush — Force immediate processing

```js
const createComponent = ({ state, flush }) => ({
  submitForm() {
    state.touched.set(allTouched);
    flush();  // process all pending reactions NOW
    // state.valid is guaranteed current after flush
    if (!state.valid.get()) return;
  },
});
```

---

## Exposing Reactivity Across Components

Component state and settings are private. To share reactive data, expose a signal on the component instance:

```js
// parent component
const createComponent = ({ signal }) => ({
  todos: signal([]),
});
```

```js
// child component
const createComponent = ({ findParent }) => ({
  getTodos() {
    const parent = findParent('todoList');
    return parent.todos.get();  // reactive — tracks the parent's signal
  },
});
```

---

## Common Patterns

```js
// Initialize state from settings
const createComponent = ({ state, settings }) => ({
  initialize() {
    state.items.set(settings.initialItems || []);
  },
});

// Derived state with reaction
const createComponent = ({ state, reaction }) => ({
  initialize() {
    reaction(() => {
      const items = state.items.get();
      state.completedCount.set(items.filter(i => i.done).length);
    });
  },
});

// Event handlers updating state
const events = {
  'click .toggle'({ state }) { state.isOpen.toggle(); },
  'click .item'({ state, data }) { state.selectedItem.set(data.id); },
};
```

---

## Quick Reference

### Settings
```js
defaultSettings: { key: defaultValue }    // declare
settings.key                              // read (reactive in reactions + templates)
settings.key = newValue                   // write (triggers reactivity)
```

### State
```js
defaultState: { key: defaultValue }       // declare (auto-converted to Signals)
state.key.get() / state.key.value         // read (reactive in reactions)
state.key.set(v) / state.key.value = v    // write
state.key.peek()                          // read without tracking
state.key.increment() / .toggle() / ...   // type-specific helpers
```

### Component Props
```js
createComponent: () => ({
  myMethod() { },                         // declare (on self, in template context)
  myData: [1, 2, 3],                      // static, non-reactive
})
```

### Template Access
```html
{settingName}                             <!-- from settings -->
{stateName}                               <!-- from state (no .get()) -->
{methodName arg1 arg2}                    <!-- from component instance -->
```

### Reactivity Controls
```js
signal.peek()                             // read without dependency
Reaction.nonreactive(() => signal.get())  // suppress tracking in block
afterFlush(() => { /* post-render */ })    // run after DOM updates
flush()                                   // force immediate processing
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reactivity System** | `sui:reactive-state` | Deep dive on standalone Signal/Reaction APIs outside components |
| **Component HTML** | `sui:component-html` | Writing template markup that consumes settings and state |
| **Component CSS** | `sui:component-css` | Styling that responds to state-driven class changes |
