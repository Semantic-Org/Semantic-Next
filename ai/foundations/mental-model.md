# Semantic UI Mental Model

> **For:** AI agents seeking deep architectural understanding  
> **Prerequisites:** None - foundational document  
> **Related:** [Component Guide](../guides/component-generation-instructions.md) • [Patterns Cookbook](../guides/patterns-cookbook.md) • [Quick Reference](../foundations/quick-reference.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## Table of Contents

- [Core Philosophy](#core-philosophy)
- [Architectural Foundation](#architectural-foundation)
- [Reactivity Mental Model](#reactivity-mental-model)
- [Component Lifecycle Model](#component-lifecycle-model)
- [Data Flow Architecture](#data-flow-architecture)
- [Component Communication Architecture](#component-communication-architecture)
- [Shadow DOM & Encapsulation](#shadow-dom--encapsulation)
- [Template Compilation Model](#template-compilation-model)
- [Performance Architecture](#performance-architecture)
- [Design System Integration](#design-system-integration)
- [Framework Interoperability](#framework-interoperability)

---

## Core Philosophy

### Web Standards First

Semantic UI is built on the fundamental belief that **web standards are the foundation of sustainable web development**. Unlike frameworks that abstract away the platform, Semantic UI enhances and amplifies web standards:

```
Traditional Framework Approach:
Framework APIs → Virtual Abstraction → Platform Translation → DOM

Semantic UI Approach:
Enhanced Web Standards → Direct Platform Integration → DOM
```

**Why this matters**: This approach ensures longevity, reduces vendor lock-in, and aligns with the platform's evolution rather than fighting against it.

### Progressive Enhancement Philosophy

The framework embodies progressive enhancement at its core:

1. **Static HTML** works without JavaScript
2. **Enhanced HTML** gains interactivity when JavaScript loads
3. **Reactive HTML** becomes fully dynamic with the framework

This isn't just about graceful degradation—it's about building components that naturally integrate into any environment.

### Signals-First Reactivity

Semantic UI adopts Signals as the fundamental reactive primitive because:

- **Fine-grained updates**: Only the exact DOM nodes that need updating are touched
- **Automatic dependency tracking**: No manual subscription management
- **Synchronous by default**: Predictable state updates with optional async batching
- **Composable**: Signals can be combined and transformed declaratively

---

## Architectural Foundation

### The Hybrid Prototype/Instance Pattern

Understanding this pattern is crucial to grasping how Semantic UI components work:

```
Component Definition (Prototype)
├── Template AST (compiled once, shared)
├── CSS Styles (processed once, shared)
├── Default Configuration
└── Behavior Definitions

    ↓ defineComponent() registers

Component Instance (Per DOM Element)
├── Shadow DOM Root
├── Reactive State (unique per instance)
├── Mutable Settings (unique per instance)
├── Local Event Handlers
└── Lifecycle Callbacks
```

**Why this architecture**:
- **Memory efficiency**: Shared template compilation across instances
- **Isolation**: Each instance has independent reactive state and settings
- **Performance**: One-time compilation with multiple instantiations

### Modular Package System

```
@semantic-ui/component     ← Web Component framework
    ↓ depends on
@semantic-ui/reactivity    ← Signals system
@semantic-ui/templating    ← AST-based templates
@semantic-ui/query         ← Shadow DOM aware queries
@semantic-ui/utils         ← Shared utilities
```

Each package can be used independently, enabling:
- **Gradual adoption**: Use only what you need
- **Framework agnostic**: Reactivity system works outside components
- **Testing isolation**: Mock or replace individual systems

---

## Reactivity Mental Model

### The Signal→Reaction→DOM Flow

Understanding reactivity requires thinking in terms of directed graphs:

```
Signal (Data)
    ↓ change triggers
Reaction (Computation)
    ↓ updates
DOM (View)
```

**Template reactivity is automatic**:
```html
<!-- This template expression becomes a Reaction -->
<p>Count: {counter}</p>

<!-- This conditional becomes a Reaction -->
{#if isActive}
  <div>Active content</div>
{/if}
```

**Component logic reactivity is explicit**:
```javascript
// Manual reaction creation
reaction(() => {
  if (state.counter.get() > 10) {
    state.warning.set(true);
  }
});
```

### The Dual Access Pattern

Signals have different access patterns based on context:

```javascript
// In component logic (explicit)
state.counter.get()        // Read value
state.counter.set(5)       // Write value
state.counter.increment()  // Helper method

// In templates (implicit)
{counter}                  // Automatic .get() call
```

**Why this distinction**: Templates are reactive contexts where dependency tracking is automatic. Component logic requires explicit control over when reactivity occurs.

### Reactivity vs Non-Reactivity

Understanding when reactivity happens is crucial:

**Reactive Contexts** (automatic dependency tracking):
- Template expressions `{value}`
- Template conditionals `{#if condition}`
- Template loops `{#each items}`
- Manual reactions `reaction(() => {})`

**Non-Reactive Contexts** (manual control):
- Event handlers
- Lifecycle callbacks
- Component methods
- External function calls

**Mental Model**: Reactivity is "contagious" within reactive contexts and must be explicitly invoked elsewhere.

---

## Component Lifecycle Model

### The Three-Phase Lifecycle

```
CREATION PHASE
├── Component constructor called
├── defaultState → reactive Signals
├── defaultSettings → mutable configuration
├── createComponent() returns instance methods
└── onCreated() for initialization

RENDERING PHASE
├── Template compilation (once per component type)
├── Shadow DOM creation
├── Data context binding
├── Event handler attachment
└── onRendered() for post-render setup

DESTRUCTION PHASE
├── Event handler cleanup (automatic)
├── Reaction cleanup (automatic)
├── onDestroyed() for manual cleanup
└── Shadow DOM removal
```

**Key Insight**: Most cleanup is automatic thanks to AbortController usage and reaction tracking. Manual cleanup in `onDestroyed` should be rare.

### Settings vs State vs Component Props Mental Model

This distinction is fundamental to component design:

```
SETTINGS (Public API - Reactive Configuration)
├── Public interface for component consumers
├── Passed at component creation or modified during lifecycle
├── Controls component behavior and appearance
├── Fully reactive everywhere (proxy-based)
├── Think: "component's public API"
└── Examples: theme, size, disabled, variant, maxItems

STATE (Internal Reactive Data)
├── Internal component memory and conditions
├── Created and managed within component lifecycle
├── Reactive signals for internal state tracking
├── Not directly accessible from outside
├── Think: "component's private memory"
└── Examples: isOpen, currentValue, validationErrors, loading

COMPONENT PROPS (Non-Reactive Data)
├── Properties on the object returned from createComponent
├── Accessible as self.propName and directly in templates
├── Non-reactive data for performance optimization
├── Static values, snapshots, utilities, timers
├── Think: "component's static utilities"
└── Examples: apiEndpoint, cachedCalculations, debounceTimer
```

**Key Patterns**:
```javascript
const createComponent = ({ settings, state, self }) => ({
  // Component props - direct instance properties
  apiEndpoint: '/api/users',        // Non-reactive static data
  validationRules: getRules(),      // Cached calculation
  debounceTimer: null,              // Mutable non-reactive

  updateTheme(newTheme) {
    settings.theme = newTheme;      // Settings are mutable and reactive
  },

  toggleOpen() {
    state.isOpen.toggle();          // State uses signal API
  },

  makeApiCall() {
    fetch(self.apiEndpoint)         // Access component props via self
      .then(data => state.data.set(data));
  }
});
```

**Decision Rules**:
- **Settings** → External consumers should configure this (public API)
- **State** → Internal reactive data that drives UI updates
- **Component Props** → Static, cached, or non-reactive data

---

## Data Flow Architecture

### The Data Context Model

Templates operate within a "data context" - think of it as "all variables available in this scope":

```
Component Data Context:
├── State signals (reactive, automatic .get() in templates)
├── Settings (fully reactive, direct access)
├── Component props (non-reactive, direct access via self.propName)
├── Local template variables
├── Helper functions (only for complex logic or external API)
└── Parent context (in sub-templates)
```

**Template Access Patterns**:
```html
<!-- State signals (automatic .get()) -->
{value}              <!-- state.value.get() -->
{items.length}       <!-- state.items.get().length -->

<!-- Settings (direct access) -->
{theme}              <!-- settings.theme -->
{size}               <!-- settings.size -->

<!-- Component props (direct access) -->
{apiEndpoint}        <!-- self.apiEndpoint -->
{maxRetries}         <!-- self.maxRetries -->
```

**Mental Model**: The data context provides direct access to all component data without needing getter methods. Templates automatically handle reactivity for state and settings.

### Settings Reactivity Implementation

The `settings` object is a proxy that makes its **top-level properties** reactive. When you assign a new value to a setting (e.g., `settings.theme = 'dark';` or `settings.complexObject = newObject;`), the underlying signal for that property is updated, triggering reactions and template updates.

**Deep Reactivity of Object/Array Settings:**
If a setting holds an object or an array (e.g., `settings.config = { enabled: true, items: [1,2] };`), the reactivity of *changes made directly within* that object or array (e.g., `settings.config.enabled = false;` or `settings.config.items.push(3);`) needs careful consideration:

* **Reassigning the Top-Level Property (Always Reactive):** Changing the entire object/array instance on the setting will always trigger reactivity correctly:
    ```javascript
    // This IS reactive because settings.config itself is being reassigned
    settings.config = { ...settings.config, enabled: false };
    settings.config = { ...settings.config, items: [...settings.config.items, 3] };
    ```

* **Direct Deep Mutation (Behavior Details):**
    The settings proxy primarily tracks assignments to its top-level properties. If you retrieve an object or array from settings (e.g., `const myConf = settings.config;`) and then mutate `myConf` directly (e.g., `myConf.enabled = false;`), this direct mutation does not pass through the settings proxy's `set` trap for the `config` property itself.
    Therefore, for reliable reactivity with complex object/array settings, it's generally recommended to treat them as if they were immutable: reassign the top-level setting property with a new, modified object or array.
    This behavior is distinct from `Signal` instances, where the `Signal` API provides explicit helper methods (like `setProperty()`, `push()`) for achieving reactive deep mutations on the data held by the signal. Always consult specific component documentation if it details different behavior for its particular settings.

Settings are fully reactive everywhere through a sophisticated proxy system:

```javascript
// Settings proxy creates hidden signals for reactivity
createSettingsProxy() {
  component.settingsVars = new Map();
  return new Proxy({}, {
    get: (target, property) => {
      let signal = component.settingsVars.get(property);
      if (signal) {
        signal.get(); // Creates dependency in reactive contexts
      }
      return currentValue;
    },
    set: (target, property, value) => {
      component.setSetting(property, value);
      signal.set(value); // Triggers reactive updates
    }
  });
}
```

**Settings Access Patterns**:
```javascript
// In templates (reactive)
{theme}                    // Automatically reactive
{#if large}               // Boolean setting as conditional

// In component logic (reactive when inside reactions)
reaction(() => {
  console.log(settings.theme); // Creates dependency, will re-run
});

// Direct modification (triggers reactivity)
settings.theme = 'dark';      // Updates hidden signal
settings.size = 'large';      // Template updates automatically
```

---

## Component Communication Architecture

Semantic UI provides three primary patterns for component communication, each suited for different scenarios. The choice of pattern depends on the relationship between components and the direction of data flow.


## Component Communication Architecture

Semantic UI provides three primary patterns for component communication, each suited for different scenarios. The choice of pattern depends on the relationship between components and the direction of data flow.

### 1. Event-Driven Notifications (Decoupled)

**The preferred method for child-to-parent communication and notifying external consumers.**

* **Pattern**: Components use the `dispatchEvent` helper to emit standard `CustomEvent`s. This helper ensures events **bubble by default**, making them easy to listen for from an ancestor.
* **Use Case**: A child component needs to announce a state change (e.g., `'itemSelected'`, `'formSubmitted'`, `'panelToggled'`) without knowing who or what is listening. This keeps components loosely coupled and highly reusable.
* **Mental Model**: "Fire-and-forget." The component broadcasts that something happened; it's up to parents or other parts of the application to listen and react.

```javascript
// Child (e.g., ui-form-field)
dispatchEvent('valueChange', { field: 'email', value: 'new@test.com' });

// Parent listens using standard event delegation
const events = {
  'valueChange ui-form-field': ({ data }) => {
    // data.field === 'email'
    // data.value === 'new@test.com'
  }
}
```

### 2. Imperative Control (External & Parent-to-Child)

**The preferred method for an *external script* or a parent component to command a child from *outside* its own component instance.**

* **Pattern**: Access the component's public API (the instance returned from `createComponent`) via the DOM element's `.component` property. The query library's `$('selector').component()` is a convenient helper for this.
* **Use Case**: An external script needs to open a modal, a parent form needs to tell a child field to validate itself, or a dashboard needs to tell a chart to refresh its data.
* **Mental Model**: Direct, imperative control. The caller has a reference to the component instance and can invoke its public methods.

```javascript
// External script controlling a counter component
const counterComponent = $('ui-counter').component();

// Call public methods on the instance. Note that a selector can
// return multiple components, so you might need to iterate.
counterComponent.each(instance => {
  instance.setCounter(10);
  instance.startCounter();
});
```

### 3. Hierarchical Traversal (Tightly-Coupled Systems)

**A specialized pattern for *internal* communication within systems of components that are designed to work together and share state.**

* **Pattern**: A parent uses `findChild()` or `findChildren()` to get instances of its direct children. A child uses `findParent()` to access its direct parent's instance.
* **Use Case**: A `todo-list` managing its `todo-item` children, or an `accordion` coordinating its `accordion-panel`s. In these cases, the components are fundamentally part of a larger system, and direct state access is more efficient than a complex web of events.
* **Mental Model**: "A single, distributed organism." Components are not independent but are parts of a larger whole. Use this pattern when components are not meant to be used separately.

```javascript
// Child (todo-item) accessing parent's shared state
const createComponent = ({ findParent, data }) => ({
  toggleCompleted() {
    const todoList = findParent('todo-list');
    todoList.todos.setProperty(data.todo._id, 'completed', true);
  }
});
```

### Communication Anti-Patterns to Avoid

-   **Global State Stores**: The framework's architecture is designed to avoid the need for external state management libraries. Use the three patterns above instead.
-   **Direct Child State Manipulation**: A parent should not reach into a child's internal `state` object (e.g., `child.state.isOpen.set(true)`). It should instead call a public method on the child's instance (e.g., `child.open()`).

---

## Shadow DOM & Encapsulation

### The Encapsulation Strategy

Semantic UI uses Shadow DOM for true style and DOM encapsulation:

```
Light DOM (Application)
└── <ui-component>
    └── Shadow DOM (Component)
        ├── <style> (scoped styles)
        ├── Template content
        └── <slot> (content projection)
```

**Benefits**:
- **Style isolation**: Component styles can't leak or be overridden
- **DOM isolation**: Internal structure hidden from external queries
- **Content projection**: Flexible content composition via slots

### Query Strategy Across Boundaries

The `@semantic-ui/query` library solves the Shadow DOM traversal problem:

```javascript
// Standard query (stops at shadow boundaries)
$('.button')              // Only light DOM

// Deep query (crosses shadow boundaries)
$$('.button')             // Light + Shadow DOM

// Component boundary aware
$$('ui-dropdown .option') // Finds .option inside ui-dropdown's shadow DOM
```

**Mental Model**: Think of `$$` as "CSS selectors that understand web components."

### Event Handling Across Boundaries

Events in web components have complex bubbling behavior:

```
Shadow DOM Event Flow:
1. Event occurs in shadow DOM
2. Bubbles to shadow root
3. Re-targets to host element
4. Continues bubbling in light DOM
```

Semantic UI's event system handles this automatically through event delegation and composed path analysis.

### Event Binding Strategies

Semantic UI provides multiple event binding strategies through keywords:

```javascript
const events = {
  // Standard (default): Event delegation within component
  'click .button': () => {},

  // Global: Bind to elements outside component
  'global scroll window': () => {},
  'global hashchange window': () => {},

  // Deep: Access intentional child components (button-group -> button)
  'deep click ui-button .icon': () => {},  // Parent managing child component

  // Bind: Direct binding (for non-bubbling events)
  'bind customevent some-component': () => {},

  // Multiple events, single selector
  'mouseup, mouseleave .element': () => {},

  // Single event, multiple selectors
  'click .btn1, click .btn2': () => {},
};
```

**When to Use Each Strategy**:
- **Default**: Event delegation within your component's template
- **Global**: Page-level events (scroll, hashchange, resize)
- **Deep**: Parent component managing its intentional child components (button-group → button, pane-group → pane)
- **Bind**: Custom events from 3rd-party components that don't bubble by default

---

## Template Compilation Model

### The AST Transformation Pipeline

Templates undergo a sophisticated compilation process:

```
Template Source
    ↓ parse
Abstract Syntax Tree (AST)
    ↓ optimize
Reactive AST (with dependency tracking)
    ↓ render
Live DOM + Reactive Bindings
```

**Key Insight**: Templates are compiled once per component type, then reused across instances with different data contexts.

### Expression Evaluation Strategies

Templates support dual expression syntax for flexibility:

```javascript
// Lisp-style (functional)
{formatDate date 'YYYY-MM-DD' timezone}

// JavaScript-style (familiar)
{formatDate(date, 'YYYY-MM-DD', timezone)}

// Nested expressions
{formatDate (addDays date 7) 'YYYY-MM-DD'}
```

**Why both**: Teams can choose the style that fits their codebase and preferences.

### Template Reactivity Mechanics

```
Template Expression: {counter}
    ↓ compiles to
Reactive Binding: () => context.counter
    ↓ creates
Reaction: auto-updates DOM when counter changes
    ↓ cleanup
Automatic: reaction disposed when template unmounts
```

This happens automatically for all template expressions, conditionals, and loops.

---

## Performance Architecture

### Reactive Update Batching

Semantic UI uses a sophisticated batching strategy:

```
Synchronous Updates (immediate):
- Signal.set() updates signal value
- Dependencies marked as dirty

Asynchronous Updates (batched):
- queueMicrotask() schedules reaction flush
- All pending reactions run in single batch
- DOM updates applied efficiently
```

**Mental Model**: Think "sync state, async DOM" - state changes are immediate, DOM updates are batched.

### Memory Management Strategy

**Automatic Cleanup Systems**:
- **AbortController**: All event listeners auto-removed on component destruction
- **Reaction Tracking**: Template reactions auto-disposed when templates unmount
- **WeakRef Caching**: Template caches use weak references for automatic GC

**Manual Cleanup Rarely Needed**: Most resources clean up automatically. Only manual cleanup needed for external resources (timers, network requests, etc.).

### AST Sharing and Optimization

```
Component Definition Time:
└── Template → AST (compiled once)

Component Instance Time:
├── AST + Data Context → Rendered DOM
├── Shared AST across all instances
└── Independent data contexts per instance
```

This provides excellent memory efficiency for applications with many component instances.

---

## Design System Integration

### CSS Custom Properties Strategy

Semantic UI integrates with design systems through CSS custom properties:

```css
/* Design system tokens */
:root {
  --primary-color: #007bff;
  --spacing-md: 1rem;
  --border-radius: 4px;
}

/* Component styles inherit tokens */
:host {
  --button-bg: var(--primary-color);
  --button-padding: var(--spacing-md);
  border-radius: var(--border-radius);
}
```

**Mental Model**: Components are themeable through CSS custom properties, enabling design system consistency without build-time processing.

### Attribute-Based Configuration

Components support three configuration dialects:

```html
<!-- Verbose (explicit) -->
<ui-button size="large" variant="primary">

<!-- Concise (boolean attributes) -->
<ui-button large primary>

<!-- Classic (class-based) -->
<ui-button class="large primary">
```

This provides migration paths from CSS frameworks while supporting modern component APIs.

---

## Framework Interoperability

### Universal Component Pattern

Semantic UI components work across environments:

```
Browser Environment:
├── Custom Elements Registry
├── Shadow DOM support
└── Full reactive features

Server Environment:
├── Static HTML generation
├── Attribute processing
└── No JavaScript features

Framework Integration:
├── React: Custom elements "just work"
├── Vue: Native custom element support
├── Angular: CUSTOM_ELEMENTS_SCHEMA
└── Vanilla: Standard web components
```

**Mental Model**: Components are web standards first, framework integration second.

### Progressive Enhancement Model

```
Enhancement Levels:
1. Static HTML → Basic functionality
2. + Custom Elements → Component lifecycle
3. + JavaScript → Full reactivity
4. + Framework → Advanced integration
```

This allows components to work in environments with varying JavaScript support levels.

---

## Key Mental Model Takeaways

1. **Web Standards Foundation**: Everything builds on standard web platform APIs.
2. **Signals-First Reactivity**: Think in terms of reactive data flow, not imperative DOM updates.
3. **Hierarchy of Communication**: Prefer `dispatchEvent` > `$('...').component()` > `findParent()` based on the level of coupling required. Avoid global state stores.
4. **Mutable Settings**: Settings can be modified during component lifecycle and are reactive in templates.
5. **Component Isolation**: Shadow DOM provides true encapsulation with controlled communication.
6. **Template Compilation**: Templates are compiled once, executed many times with different data.
7. **Automatic Resource Management**: Most cleanup happens automatically through careful API design.
8. **Progressive Enhancement**: Components work at multiple levels of JavaScript support.
9. **Design System Integration**: CSS custom properties enable consistent theming.
10. **Framework Agnostic**: Components integrate with any framework supporting custom elements.

Understanding these mental models enables effective use of Semantic UI and helps explain the "why" behind its design decisions.

---

**Source References:**
- Core implementation: `/packages/component/src/`
- Reactivity system: `/packages/reactivity/src/`
- Template compiler: `/packages/templating/src/compiler/`
- Query system: `/packages/query/src/`
- Component examples: `/docs/src/examples/todo-list/`
