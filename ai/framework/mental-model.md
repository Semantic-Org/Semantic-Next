---
title: Semantic UI Mental Model
description: Core mental model for AI agents working with Semantic UI, covering component architecture, reactivity system, template syntax, and framework design patterns.
keywords: [mental model, architecture, signals, reactivity, web components, shadow DOM, templates]
audience: framework
skill: mental-model
type: doc
---

# Semantic UI: Mental Model for AI Agents

> **Purpose**: Provide mental model for Semantic UI's patterns
> **Approach**: Focus on what's unique, defer details to specialized guides
> **Navigation**: Use manifest files for discovery of `ai/` documentation

---

## What is Semantic UI?

Semantic UI is **two things**:

1. **A Web Component Framework** - For building reactive web components with signals-based state management, Shadow DOM encapsulation, and a novel template syntax

2. **A First-Party UI Widget Library** - Ships with primitives (spec-driven components like `ui-button`, `ui-input`), behaviors (logic attachments like transitions, portals), and complex components

**Core Philosophy**: Web standards first, progressive enhancement, signals-based reactivity. Components render as standard HTML, enhance with JavaScript, and become fully reactive with the framework.

---

## The `defineComponent` Pattern

### Basic Structure

```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

export const MyComponent = defineComponent({
  tagName: 'my-component',
  template,
  css,
  defaultSettings: { /* public reactive config */ },
  defaultState: { /* internal reactive state */ },
  createComponent: ({ self, state, settings, $, ... }) => ({ /* instance methods */ }),
  events: { /* event handlers */ },
  onCreated: ({ self, state, ... }) => { /* initialization */ },
  onRendered: ({ $, isClient, ... }) => { /* post-render setup */ },
  onDestroyed: ({ self, ... }) => { /* cleanup */ },
});
```

### The Callback Arguments Pattern

Every lifecycle callback and event handler receives the same destructured argument object:

```javascript
const createComponent = ({
  // Component instance
  self,           // The component instance
  el,             // The DOM element

  // Reactive data
  state,          // Internal signals (use .get()/.set() in JS)
  settings,       // Public config (reactive proxy - direct access)

  // Reactivity utilities
  signal,         // Create new signals: signal(initialValue)
  reaction,       // Create reactive computations
  afterFlush,     // Run code after DOM updates

  // DOM querying
  $,              // Query within component (no shadow piercing)
  $$,             // Deep query (pierces shadow DOM)

  // Component tree (for intentional parent-child relationships)
  findParent,     // Navigate up: findParent('parent-tag')
  findChild,      // Navigate down: findChild('child-tag')

  // Events
  dispatchEvent,  // Emit custom events (bubbles by default)
  attachEvent,    // Manually attach events

  // Environment
  isClient,       // true in browser
  isServer,       // true during SSR
}) => ({
  // Return object becomes the component instance
  myMethod() {
    // Methods go here
  }
});
```

### Why `self` Exists

The `self` parameter enables the concise arrow function pattern for `createComponent`:

```javascript
// Arrow function returning object literal - clean and simple
const createComponent = ({ self, state }) => ({
  getPercentage() {
    return (state.value.get() / state.max.get()) * 100;
  },
  getDisplayText() {
    const percentage = self.getPercentage();
    return `${percentage}%`;
  },
});
```

Arrow functions don't have their own `this`, so `self` provides access to the component instance. If you prefer using `this`, use a regular function:

```javascript
// Regular function - `this` is the component instance
const createComponent = function({ state }) {
  return {
    getPercentage() {
      return (state.value.get() / state.max.get()) * 100;
    },
    getDisplayText() {
      const percentage = this.getPercentage();
      return `${percentage}%`;
    },
  };
};
```

Both patterns work. Codebase convention uses arrow functions with `self`.

### Storing Non-Reactive Data on `self`

The return object from `createComponent` can include non-reactive data - static values, cached calculations, timers, or any data that doesn't need to trigger re-renders:

```javascript
const createComponent = ({ self, state, settings }) => ({
  // Non-reactive data (component props)
  apiEndpoint: '/api/users',           // Static config
  validationRules: loadRules(),        // Cached calculation
  debounceTimer: null,                 // Mutable non-reactive
  MAX_RETRIES: 3,                      // Constants

  // Methods can access via self
  fetchData() {
    fetch(self.apiEndpoint)            // Access non-reactive prop
      .then(data => state.data.set(data));
  },

  startDebounce(fn, delay) {
    clearTimeout(self.debounceTimer);
    self.debounceTimer = setTimeout(fn, delay);
  }
});
```

`self` props: API endpoints, constants, timers, cached values, external library instances - data that doesn't need reactive updates.

### Accessing the Component Instance from the DOM

The component instance is stored directly on the DOM element (`el`). This is how external code interacts with components:

```javascript
// The instance is on the element itself
const el = document.querySelector('my-component');
const instance = el.component;             // The component instance (self)
const context = el.dataContext;            // Full flattened data context

// Or via query helper
const instance = $('my-component').component();

// Call public methods
instance.fetchData();
instance.publicMethod();

// Access non-reactive props
console.log(instance.apiEndpoint);

// This is how findParent/findChild work internally -
// they traverse the DOM and access .component on elements
```

This pattern enables:
- Imperative control from page scripts
- Parent-to-child communication via `findChild().methodName()`
- External configuration after mount

`self`, `tpl`, and `component` are aliases for the same instance.

---

## The Reactivity Model

Semantic UI uses **signals-based reactivity** with two distinct patterns for settings vs state.

### Settings: Reactive Proxy

Settings appear to be a plain object but are a reactive proxy backed by signals:

```javascript
const defaultSettings = {
  theme: 'light',
  size: 'medium',
  disabled: false
};

// In component logic - direct assignment triggers reactivity
settings.theme = 'dark';           // This triggers template updates!
settings.size = 'large';           // No .set() needed

// In templates - automatic reactivity
// {theme} updates when settings.theme changes

// Inside reactions - creates dependencies
reaction(() => {
  console.log(settings.theme);     // Re-runs when theme changes
});
```

Destructuring breaks reactivity:
```javascript
const { theme } = settings;        // Captures value at this moment (static)
const currentTheme = settings.theme;  // Reactive access through proxy
```

### State: Explicit Signal API

State uses explicit signals with a rich helper API:

```javascript
const defaultState = {
  isOpen: false,
  counter: 0,
  items: [],
  user: { name: '' }
};

// Reading
const value = state.counter.get();     // Explicit read
const value = state.counter.value;     // Property access

// Writing
state.counter.set(5);                  // Set value
state.counter.value = 5;               // Property assignment

// Built-in helpers
state.counter.increment(1);            // Numbers
state.counter.decrement(1);
state.isOpen.toggle();                 // Booleans
state.counter.clear();                 // Reset to default

// Array helpers
state.items.push(item);
state.items.removeItem(item);
state.items.setProperty(id, 'done', true);  // Update item by ID

// Object helpers
state.user.setProperty('name', 'Alice');
state.user.setProperties({ name: 'Bob', age: 30 });
```

### Template Reactivity is Automatic

In templates, you don't call `.get()` - the framework handles it via a **proxy that automatically unwraps values**:

```javascript
// In component logic (explicit)
const count = state.counter.get();

// In templates (automatic)
// {counter}                    ← Framework calls .get() for you
// {#if isOpen}...{/if}         ← Reactive conditional
```

**How it works**: The renderer uses a JavaScript `Proxy` that:
1. Intercepts property access
2. Calls `.get()` on any `Signal` instance
3. Invokes zero-argument functions automatically

This is why `{getTitle}` works the same as `{getTitle()}` in templates.

### Template Data Context is Flattened

Templates receive a **flattened data context** that merges:
- `data` - External data passed to the component
- `state` - All state signals (accessible by name directly)
- `instance` - All methods from `createComponent`

```javascript
// These are all available at the same level in templates:
{userName}           // from data
{isOpen}             // from state (auto-unwrapped)
{getDisplayText}     // from createComponent methods (auto-invoked)
{settings.theme}     // settings still accessed via settings.*
```

This flattening is why you write `{counter}` not `{state.counter}` in templates.

---

## Template Expression Syntax

Semantic UI templates use a **novel dual syntax** that supports both JavaScript-style and Lisp-style expressions.

### Basic Expressions

```html
<!-- Variable interpolation -->
{variableName}
{user.name}
{settings.theme}

<!-- Method calls - JavaScript style -->
{formatDate(date, 'YYYY-MM-DD')}
{getUser(userId)}

<!-- Method calls - Lisp style (space-separated) -->
{formatDate date 'YYYY-MM-DD'}
{getUser userId}

<!-- Both styles work -->
```

### Automatic Unwrapping

Templates automatically:
1. Call `.get()` on signals
2. Invoke zero-argument functions
3. Bind method context

```html
<!-- These are equivalent in templates -->
{counter}              <!-- state.counter.get() - auto unwrap -->
{getTitle}             <!-- getTitle() - auto invoke -->
{user.getName}         <!-- user.getName() - auto bind and invoke -->
```

### Conditionals

```html
{#if condition}
  <div>Shown when true</div>
{else if otherCondition}
  <div>Alternative</div>
{else}
  <div>Default</div>
{/if}

<!-- With expressions -->
{#if items.length > 0}
  <div>Has items</div>
{/if}
```

### Iteration

```html
<!-- Each with named variable -->
{#each item in items}
  <div>{item.name} - Index: {index}</div>
{else}
  <div>No items</div>
{/each}

<!-- Direct property access (item becomes context) -->
{#each users}
  <div>{name} - {email}</div>
{/each}

<!-- With custom index name -->
{#each item, i in items}
  <div>#{i}: {item.name}</div>
{/each}
```

### Snippets (Reusable Fragments)

```html
{#snippet userCard}
  <div class="user">
    <img src="{avatar}" />
    <h3>{name}</h3>
  </div>
{/snippet}

<!-- Use snippet -->
{#each users}
  {>userCard}
{/each}

<!-- With data override -->
{>userCard name="Guest" avatar="/default.png"}
```

### Sub-templates and Slots

```html
<!-- Include sub-template with data -->
{>itemTemplate data=item index=index}

<!-- Content projection (slots) -->
{>slot}              <!-- Default slot -->
{>slot header}       <!-- Named slot -->
```

### Boolean Attributes

**Quoted vs unquoted determines behavior**:

```html
<!-- Unquoted: Attribute removed if falsy -->
<input type="checkbox" checked={isChecked} />
<!-- If false: <input type="checkbox" /> -->

<!-- Quoted: Always outputs as string -->
<div data-count="{count}">
<!-- If count=0: <div data-count="0"> -->
```

---

## Behaviors

Behaviors are **reusable logic units that attach to any DOM element** - not just web components. They use a jQuery-like API:

```javascript
// Usage
$('.modal-content').portal('body');
$('.element').transition('fade in');
$('.form').validation({ rules: {...} });

// Definition (registerBehavior)
registerBehavior({
  name: 'portal',
  defaultSettings: { context: 'auto' },
  onCreated({ self, $el }) { /* setup */ },
  onDestroyed({ self }) { /* cleanup */ },
  createBehavior: ({ self, $el, settings }) => ({
    portal() { /* implementation */ },
    restore() { /* implementation */ }
  })
});
```

**Distinction**:
- **Components** = Custom elements with Shadow DOM (`<my-component>`)
- **Behaviors** = Logic attached to existing elements (`$('.any-element').behaviorName()`)

Behaviors handle cross-cutting concerns: transitions, portals, validation, tooltips, infinite scroll.

---

## Event Handling

### Event Binding Strategies

```javascript
const events = {
  // Standard: Event delegation within component
  'click .button': ({ self, event, data }) => {
    self.handleClick();
  },

  // Global: Events outside component (window, document, body)
  'global scroll window': ({ self }) => {
    self.updatePosition();
  },

  // Deep: Parent listening to child component events
  'deep click ui-button': ({ data }) => {
    // Parent component handling child button clicks
  },

  // Multiple events
  'mouseenter, mouseleave .item': ({ event }) => {
    // Handle both events
  }
};
```

### Event Handler Arguments

```javascript
'click .item'({
  self,           // Component instance
  event,          // Native event object
  target,         // Element matching selector (not event.target)
  data,           // Merged: data-* attributes + event.detail
  value,          // Input value (for input events)
  isDeep,         // True if from nested component
  state, settings, $, $$  // Standard arguments
}) {
  // data-amount="5" becomes data.amount = 5 (auto type-converted)
}
```

### Dispatching Events

```javascript
const createComponent = ({ dispatchEvent }) => ({
  selectItem(item) {
    dispatchEvent('itemSelected', { item });
    // Events bubble by default
  }
});
```

---

## Navigation & Discovery

### Manifest Files

The `ai/` folder documentation:

- **`ai/meta/context-manifest.json`** - All documentation files with categories, tags, dependencies
- **`ai/meta/workflows-manifest.json`** - Step-by-step workflows for specific tasks
- **`ai/00-START-HERE.md`** - Task routing and decision trees

### Documentation Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Foundation** | Core concepts, API reference | `mental-model.md`, `quick-reference.md` |
| **Packages** | Standalone package APIs | `packages/reactivity.md`, `packages/query.md` |
| **Guides** | Task-specific how-tos | `guides/components/creating-components.md` |
| **Workflows** | Step-by-step procedures | `workflows/components/scaffold-primitive.md` |

### Guide Locations

| Topic | Path |
|-------|------|
| Components | `ai/guides/components/creating-components.md` |
| API syntax | `ai/framework/quick-reference.md` |
| Codebase navigation | `ai/foundations/codebase-navigation-guide.md` |
| Communication patterns | `ai/guides/components/component-authoring-best-practices.md` |
| Reactivity | `ai/packages/reactivity.md` |
| Templates | `ai/packages/templating.md` |
| DOM querying | `ai/packages/query.md` |
| CSS/Theming | `ai/guides/css/css-guide.md` |

---

## Common Patterns

### Arrow vs Regular Functions in `createComponent`
```javascript
// Arrow function: use self
const createComponent = ({ self }) => ({
  getDisplayText() { return self.getPercentage(); }
});

// Regular function: this works
const createComponent = function({ }) {
  return {
    getDisplayText() { return this.getPercentage(); }
  };
};
```

### Template Expressions
```html
{counter}              <!-- Auto-unwraps state.counter.get() -->
{state.counter.get()}  <!-- Breaks reactivity tracking -->
```

### Settings Access
```javascript
const { theme } = settings;  // Static value, loses reactivity
const theme = settings.theme;  // Reactive access
```

### CSS Class Names
```css
.large { }      /* Shadow DOM provides scoping */
.primary { }    /* No prefixes needed */
```

### Design Tokens
```css
font-size: var(--small);       /* Use tokens */
color: var(--primary-color);
```

### Query Variable Convention
```javascript
const $button = $('.button');  /* $ prefix for query results */
```

---

## Framework Architecture

```
@semantic-ui/component     ← Web component framework (defineComponent)
    ↓ uses
@semantic-ui/reactivity    ← Signals system (Signal, Reaction)
@semantic-ui/templating    ← Template compiler (AST-based)
@semantic-ui/query         ← DOM queries (shadow-aware $, $$)
@semantic-ui/utils         ← Utilities (formatting, type checking)
@semantic-ui/specs         ← Spec system (drives primitives)
```

**Primitives** (`src/primitives/`) - Spec-driven first-party components. Spec defines API, CSS/JS implement it. Examples: `ui-button`, `ui-input`, `ui-icon`.

**Components** (`src/components/`) - Logic-driven components for complex UI (panels, menus, modals).

**Behaviors** (`src/behaviors/`) - Attachable logic (transitions, portals).

---

## Summary

1. **Signals + Shadow DOM** - Fine-grained reactivity with encapsulation
2. **Callback pattern** - Destructured arguments with `self` reference
3. **Settings proxy** - Object syntax, signal behavior
4. **Dual template syntax** - JS-style or Lisp-style expressions
5. **Progressive enhancement** - HTML first, enhanced with JS

**Related manifests:**
- `ai/meta/workflows-manifest.json` - Task workflows
- `ai/00-START-HERE.md` - Task routing
- `ai/framework/quick-reference.md` - API syntax

---

**Related Documentation:**
- [Quick Reference](./quick-reference.md) - Complete API syntax
- [Codebase Navigation](./codebase-navigation-guide.md) - Finding files and code
- [Creating Components](../guides/components/creating-components.md) - Full component guide
- [Component Best Practices](../guides/components/component-authoring-best-practices.md) - Communication patterns
