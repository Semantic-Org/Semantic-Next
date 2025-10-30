# Semantic UI Component Development Guide

> **For:** AI agents building Semantic UI components for any application
> **Prerequisites:** Basic understanding of web components and JavaScript
> **Scope:** Framework usage patterns, component architecture, implementation best practices
> **Related:** [Mental Model](/ai/foundations/mental-model.md) • [Patterns Cookbook](./patterns.md) • [API Reference](/ai/foundations/quick-reference.md)
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## 🚨 **CRITICAL: Read This Before Building Components**

This guide covers building Semantic UI components for **any application** - whether for your own projects, libraries, or documentation examples.

### **📋 Are You Creating a Documentation Example?**

**If you were asked to create an "example component" or "component example":**
- **STOP** - You likely need the **[Example Authoring Guide](/ai/documentation/authoring/example-authoring.md)** instead
- Documentation examples have specific metadata, file structure, and playground requirements
- **When in doubt, clarify with the user:** "Are you building a component for an application, or creating a documentation example?"

**Use this guide for:**
- Components for your own applications
- Library components
- Understanding framework patterns and architecture
- General component development skills

**MANDATORY READING BEFORE COMPONENT DEVELOPMENT:**

1. **HTML Patterns**: [`../guides/html-guide.md`](/ai/guides/html.md) - Semantic markup and class naming conventions
2. **CSS Architecture**: [`../guides/css-guide.md`](/ai/guides/styling/css-guide.md) - CSS nesting, responsive design, and architecture patterns  
3. **Design Tokens**: [`../guides/css-token-guide.md`](/ai/guides/styling/tokens/token-usage.md) - Token system and verification workflow
4. **Primitive Usage**: [`../guides/primitive-usage-guide.md`](/ai/guides/primitives.md) - Using existing primitives and composition patterns
5. **Method References**: [`../foundations/mental-model.md`](/ai/foundations/mental-model.md) - Critical `self.methodName()` patterns
6. **Component Communication**: [`../guides/patterns-cookbook.md`](./patterns.md) - Detailed guide to communication patterns

**⚠️ Common Mistakes**:
- Using prefixed class names like `.size-large` instead of `.large`
- Using `this.method()` instead of `self.method()`
- Using hardcoded CSS values instead of design tokens like `var(--large)`
- Not prefixing query variables with `$` (use `const $div = $('div')`)
- Creating components without proper file organization
- **Accessing internal component state directly** instead of using public API methods
- **🚨 CRITICAL: Using HTML elements instead of first-party UI components** (see First-Party Components section below)

---

## 📚 **Complete Reference Sources**

For comprehensive information beyond this guide:

- **🏗️ HTML Patterns**: [`../guides/html-guide.md`](/ai/guides/html.md) - Semantic markup and class naming conventions
- **🎨 CSS Architecture**: [`../guides/css-guide.md`](/ai/guides/styling/css-guide.md) - CSS nesting, responsive design, and architecture patterns
- **🎯 Design Tokens**: [`../guides/css-token-guide.md`](/ai/guides/styling/tokens/token-usage.md) - Token system and verification workflow  
- **🧩 Primitive Usage**: [`../guides/primitive-usage-guide.md`](/ai/guides/primitives.md) - Using existing primitives and composition patterns
- **🧠 Mental Model & Architecture**: [`../foundations/mental-model.md`](/ai/foundations/mental-model.md) - Core concepts, method references, component communication
- **📖 Patterns & Recipes**: [`../guides/patterns-cookbook.md`](./patterns.md) - Detailed implementation patterns and communication
- **⚡ Quick API Reference**: [`../foundations/quick-reference.md`](/ai/foundations/quick-reference.md) - Complete API syntax and options
- **🗺️ Codebase Navigation**: [`../foundations/codebase-navigation-guide.md`](/ai/foundations/codebase-navigation-guide.md) - Finding documentation and examples

**Rule**: When you need information beyond basic component creation, consult these canonical sources rather than guessing or duplicating information.

## Tailwind CSS Integration

**⚠️ IMPORTANT**: Use Tailwind CSS **only when explicitly requested**. Default to design tokens and semantic class patterns.

### Using the Tailwind Plugin

Semantic UI provides first-class Tailwind integration through `@semantic-ui/tailwind`:

```javascript
import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

let definition = {
  tagName: 'my-button',
  template: `<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
    <slot></slot>
  </button>`,
  css: `@theme { --color-blue-500: #3b82f6; }`
};

// Plugin scans for Tailwind classes and generates scoped CSS
definition = await TailwindPlugin(definition);

export const MyButton = defineComponent(definition);
```

**Key Benefits:**
- Zero build step - Runs natively in browser via WASM
- Shadow DOM scoped - No global CSS conflicts
- Full Tailwind support - @theme, @utility, all features work

### When to Use Tailwind vs Design Tokens

**Use Tailwind for:**
- Rapid prototyping and utility classes
- Complex responsive layouts (`grid-cols-1 md:grid-cols-3`)
- Team familiarity with Tailwind workflow

**Use Design Tokens for:**
- Consistent design system integration
- Performance (no compilation overhead)
- Simple styling needs

**Combining Both:**
```css
:host {
  /* Component-specific + design tokens */
  --button-height: 2.5rem;
  background: var(--primary-color);
}
/* Tailwind utilities in template */
```

**📚 Implementation Details:**
- Plugin architecture: `../../packages/tailwind/AGENTS.md`
- WASM compilation: `../../packages/tailwind/node_modules/tailwindcss-iso/README.md`
- Browser engine: `../../packages/tailwind/node_modules/tailwindcss-iso/AGENTS.md` (if available)

## 🚨 **CRITICAL: Use First-Party UI Components**

### **ALWAYS Use Available Components from `/src/components/`**

Semantic UI provides comprehensive first-party components that **MUST** be used instead of creating custom HTML elements. Each component has a specification file at `/src/components/{component}/specs/{component}.json` that defines its exact API.

**Available Components**: `ui-button`, `ui-input`, `ui-label`, `ui-icon`, `ui-menu`, `ui-card`, `ui-container`, `ui-modal`, `ui-segment`, `ui-rail`

### **Essential Rule: Read Component Specs First**

**Before using any first-party component, read its specification:**
- **Button**: `/src/components/button/specs/button.json`
- **Input**: `/src/components/input/specs/input.json`
- **Icon**: `/src/components/icon/specs/icon.json`
- **[Component]**: `/src/components/[component]/specs/[component].json`

### **Standard Usage Pattern**

```html
<!-- ❌ DON'T DO THIS - Custom HTML/CSS -->
<button class="my-custom-button primary large">Click Me</button>
<input type="text" class="my-styled-input" />

<!-- ✅ DO THIS - Use First-Party Components (based on actual specs) -->
<ui-button primary large>Click Me</ui-button>
<ui-input type="text" placeholder="Enter value..." />
<ui-icon icon="search" large />
```

### **Component Composition Example**

```javascript
// component.js - Standard pattern
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'user-profile',
  template,
  css,
  // ... component definition
});
```html
<!-- component.html - Compose with first-party components (based on specs) -->
<ui-container>
  <ui-segment>
    <ui-card>
      <ui-icon icon="user" large />
      <ui-button primary>Edit Profile</ui-button>
    </ui-card>
  </ui-segment>
</ui-container>
```

**Critical Rules**:
1. **Read the spec file first** - never guess component APIs
2. **Use exact attribute names** from the specification
3. **Check available variations and types** in the spec
4. **Verify icon names** against the icon spec options list

## 📁 **Component File Organization**

Components are built using a consistent three-file pattern that provides separation of concerns and optimal development experience.

### **Standard Component Structure**

**Core component files:**
- **`component.js`** - Main component definition with `defineComponent`
- **`component.html`** - Component template with reactive expressions
- **`component.css`** - Component styles (scoped via Shadow DOM)

**Subcomponent files:**
- Use hyphenated names like `todo-item.js`, `todo-item.html`, `todo-item.css`
- Import and reference in parent component

### **Component File Benefits**
- **Separation of concerns** - Logic, markup, and styling cleanly separated
- **Shadow DOM scoping** - CSS automatically scoped to component
- **Hot reloading** - Each file can be modified independently
- **Reusability** - Components can be imported and used anywhere

## Component Definition Pattern

Always follow this pattern for component definition:

```javascript
import { defineComponent, getText } from '@semantic-ui/component';
// Import any subcomponents here
import { subComponent } from './sub-component.js';

const css = await getText('./component.css');
const template = await getText('./component.html');
// Note on getText():
// The `getText()` utility, re-exported from `@semantic-ui/utils`, uses `fetch`
// to load text files like component.css and component.html.
// It's primarily useful in browser environments where build tools for direct
// text/raw imports (e.g., import templateText from './component.html?raw')
// are not available. If your development environment supports raw asset imports
// (like Vite or ESBuild with appropriate loaders/plugins), using those native
// import mechanisms is generally preferred for better bundling and performance.

const defaultSettings = {
  // Configuration that controls component behavior
  // These are MUTABLE and REACTIVE everywhere
  theme: 'light',
  size: 'medium',
  disabled: false
};

const defaultState = {
  // Internal reactive state that changes during lifecycle
  isOpen: false,
  currentValue: '',
  errors: {}
};

const createComponent = ({ self, state, settings, $, $$, findParent, findChild, reaction, dispatchEvent, signal }) => ({
  // Component instance methods

  // Example computed property
  getComputedValue() {
    // Access state with .get() in JavaScript code
    const stateValue = state.someValue.get();
    return stateValue * 2;
  },

  // Example method calling another method
  getDisplayText() {
    if (!settings.showLabel) return '';
    // ✅ CRITICAL: Use self.methodName() for internal method calls
    const percentage = self.getComputedValue();
    return `${percentage}%`;
  },

  // Example method for setup
  setupReactions() {
    reaction(() => {
      // Set up a reaction that updates when dependencies change
      const valueA = state.valueA.get();
      state.derivedValue.set(valueA * 2);
    });
  }
});

const events = {
  // Standard: Event delegation within component
  'click .selector'({ self, event, data }) {
    self.methodName();
  },

  // Deep: Parent managing intentional child components
  'deep click ui-child-component'({ self, data }) {
    self.handleChildClick(data);
  },

  // Global: Page-level events outside component
  'global scroll window'({ self }) {
    self.handleScroll();
  },

  // Input handling with automatic data attribute conversion
  'input .input-selector'({ state, value, data }) {
    state.inputValue.set(value);
    // data-* attributes automatically converted to proper types
  }
};

const onCreated = ({ self, state, settings, reaction }) => {
  // Initialize component (before DOM is ready)
  // Setup reactions, initialize state from settings
};

const onRendered = ({ self, $, $$, isClient }) => {
  // Component is in DOM, can access elements
  if (isClient) {
    self.setupReactions();
    // DOM manipulation, focus management
  }
};

const onDestroyed = ({ self }) => {
  // Clean up external resources (most cleanup is automatic)
  // Clear timers, close connections, etc.
};

export const ComponentName = defineComponent({
  tagName: 'component-name',
  template,
  css,
  defaultSettings,
  defaultState,
  events,
  createComponent,
  onCreated,
  onRendered,
  onDestroyed,
  subTemplates: {
    // Reference sub-templates here.
    // A sub-template is typically an instance of the `Template` class.
    // You can create such an instance by calling `defineComponent`
    // with a template, css, etc., but *without* specifying a `tagName`.
    // This `Template` instance can then be used here or with the
    // "Template-as-Settings" pattern.
    // Example:
    // import { itemTemplate } from './item-template.js'; // assume item-template.js exports a Template instance
    // subTemplates: { item: itemTemplate }
    subComponent
  }
});
```

## Essential Template Syntax

Templates have a flattened data context with automatic reactivity. Key patterns:

### Basic Expressions
```html
<!-- State and settings are reactive automatically -->
<div class="status {theme}">{currentValue}</div>

<!-- Methods from createComponent are available -->
<div>{getComputedValue}</div>

<!-- Settings are mutable and reactive -->
<button class="{size} {theme}" disabled="{disabled}">Click me</button>
```

### Control Flow
```html
{#if condition}
  <div>Conditional content</div>
{else if otherCondition}
  <div>Alternative content</div>
{else}
  <div>Default content</div>
{/if}
```

### Iteration (Multiple Syntaxes)
```html
<!-- Each...in syntax (recommended) -->
{#each item in items}
  <div>{item.name} - {index}</div>
{else}
  <div>No items found</div>
{/each}

<!-- Direct property access -->
{#each users}
  <div>{name} - {email}</div>
{/each}
```

### Sub-templates and Slots
```html
<!-- Include sub-templates with data -->
{>subComponent data=item index=index}

<!-- Template-as-settings (fundamental pattern) -->
{>template name=itemTemplate data=item}

<!-- Content projection -->
{>slot}
{>slot header}
```

### Snippets (Reusable Template Fragments)
```html
{#snippet userCard}
  <div class="user">
    <img src="{avatar}" alt="{name}" />
    <h3>{name}</h3>
  </div>
{/snippet}

{#each users}
  {>userCard}
{/each}
```

> **📚 For complete template syntax**: See `/ai/semantic-ui-quick-reference.md` → Template Syntax Reference

## CSS Guidelines ⚠️ **CRITICAL PATTERNS**

**🚨 MANDATORY**: Read the canonical CSS guides for complete patterns:
- [`../guides/html-guide.md`](/ai/guides/html.md) - Semantic markup and class naming
- [`../guides/css-guide.md`](/ai/guides/styling/css-guide.md) - CSS architecture and responsive design
- [`../guides/css-token-guide.md`](/ai/guides/styling/tokens/token-usage.md) - Design token system and verification

### Essential Class Naming Rules

```css
/* ✅ CORRECT: Use semantic class names directly (no prefixes) */
.small { --progress-height: 0.5rem; }
.medium { --progress-height: 1rem; }
.large { --progress-height: 1.5rem; }

.primary { --progress-color: var(--primary-color); }
.success { --progress-color: var(--positive-color); }
.danger { --progress-color: var(--negative-color); }

/* ❌ WRONG: Don't use prefixed class names */
.size-small { /* DON'T DO THIS */ }
.theme-primary { /* DON'T DO THIS */ }
.progress-bar-large { /* DON'T DO THIS */ }
```

### Essential Design Token Usage

```css
:host {
  /* ✅ CORRECT: Use provided design tokens */
  --progress-height: 1rem;
  border-radius: var(--border-radius);    /* Use design token */
  transition: var(--transition);          /* Use design token */
}

.label {
  font-size: var(--small);               /* Use design token */
  font-weight: var(--bold);              /* Use design token */
  color: var(--text-color);              /* Use design token */
  margin-top: var(--compact-spacing);    /* Use design token */
}

/* ❌ WRONG: Don't hardcode values that exist as design tokens */
.bad-label {
  font-size: 0.75rem;                    /* DON'T: Use var(--small) */
  font-weight: 500;                      /* DON'T: Use var(--bold) */
  color: #495057;                        /* DON'T: Use var(--text-color) */
  transition: all 0.3s ease;             /* DON'T: Use var(--transition) */
}
```

### Shadow DOM Benefits & Pattern

```css
:host {
  /* Component-specific measurements only */
  --component-height: 2rem;
  --handle-size: 24px;
}

.container {
  display: flex;
  padding: var(--spacing);              /* Use design token */
  border-radius: var(--border-radius); /* Use design token */

  .header {
    font-size: var(--large);           /* Use design token */
    font-weight: var(--bold);          /* Use design token */

    .title {
      color: var(--text-color);        /* Use design token */
    }
  }
}

/* Settings-based theming */
:host([data-theme="dark"]) {
  --text-color: #ffffff;
  --bg-color: #1a1a1a;
}

/* Modern CSS features */
@starting-style {
  .modal.visible {
    opacity: 0;
    transform: scale(0.95);
  }
}

.modal.visible {
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease;
}
```

**Shadow DOM Benefits**:
- Use simple class names like `.container` (no namespacing needed)
- No class name collisions between components
- CSS custom properties for design system integration
- Container queries: `@container component (min-width: 500px) { ... }`

## Reactivity Guidelines

### State vs Settings Decision Rule
- **Settings**: Configuration that controls component behavior (mutable & reactive everywhere)
- **State**: Internal reactive data that changes during component lifecycle

### State Access Patterns
```javascript
// Reading state
const value = state.counter.get();           // Explicit read
const value = state.counter.value;           // Property access

// Writing state
state.counter.set(5);                        // Set new value
state.counter.value = 5;                     // Property assignment

// Built-in helpers
state.counter.increment(1);                  // Numbers
state.isVisible.toggle();                    // Booleans
state.items.push(newItem);                   // Arrays
state.user.setProperty('name', 'Alice');     // Objects
```

### Settings Reactivity (Key Feature)
```javascript
// Settings are FULLY REACTIVE everywhere
settings.theme = 'dark';                     // Direct assignment triggers reactivity
settings.size = 'large';                     // Template updates automatically

// Reactive in component logic (inside reactions)
reaction(() => {
  console.log(settings.theme);               // Creates dependency, will re-run
});

// Reactive in templates (automatic)
// {theme} will update when settings.theme changes
```

### Settings and State Initialization in `onCreated`

While `settings` are reactive throughout the component's lifecycle, initializing `state` from `settings` within the `onCreated` hook is a **one-time operation**.

```javascript
const onCreated = ({ state, settings }) => {
  // This sets the initial value of state.items based on the
  // current value of settings.initialItems at creation time.
  state.items.set(settings.initialItems || []);
};
```

If `settings.initialItems` is changed after the component is created (e.g., programmatically via `$('my-component').settings({ initialItems: newArray })`), the `state.items` will not automatically update based on this `onCreated` logic.

To keep a state property synchronized with a setting property after initial creation, you must set up an explicit reaction:

```javascript
const createComponent = ({ state, settings, reaction }) => ({
  onCreated() {
    // One-time initialization
    state.items.set(settings.initialItems || []);

    // Explicit reaction to keep state.items in sync with settings.initialItems
    reaction(() => {
      // Note: Depending on the desired behavior, you might want to compare
      // the new settings.initialItems with the current state.items
      // to avoid unnecessary updates or to merge data.
      // This example simply overwrites state.items when settings.initialItems changes.
      state.items.set(settings.initialItems || []);
    });
  }
});
```

Refer to the "Reactive Settings Pattern" in the Patterns Cookbook for more details.

### Performance Optimization
```javascript
// Non-reactive reads (when you don't want dependencies)
const currentValue = state.someValue.peek();

// Batch DOM updates
afterFlush(() => {
  // Runs after all reactive updates complete
  this.measureLayout();
});
```

> **📚 For complete reactivity patterns**: See `/ai/semantic-ui-patterns-cookbook.md` → Reactivity Patterns

## Component Communication Patterns

There are three primary ways for components to communicate, each with a specific purpose. Choosing the right one is crucial for building maintainable applications.

### 1. Events (Primary Pattern)
**Use `dispatchEvent` for child-to-parent notifications.** This is the most common and decoupled pattern. The framework's `dispatchEvent` helper ensures custom events bubble by default.

```javascript
// Child component dispatches an event
const createComponent = ({ dispatchEvent }) => ({
  selectItem(item) {
    // ...
    dispatchEvent('itemSelected', { selectedItem: item });
  }
});

// Parent component listens for the event
const events = {
  'itemSelected ui-child-component': ({ data }) => {
    // data.selectedItem is available here
    console.log('An item was selected:', data.selectedItem);
  }
};
```

### 2. Direct API Access (Parent-to-Child Control)
**Use `$('selector').component()` when a parent needs to imperatively command a child.**

```javascript
// In page.js or a parent component
const childComponent = $('ui-child-component').component();
childComponent.publicMethod(); // Call a method defined in the child's createComponent

// In the child component (ui-child-component.js)
const createComponent = ({ state }) => ({
  publicMethod() {
    state.internalValue.set('Updated by parent');
  }
});
```

### 3. Hierarchical Traversal (Tightly-Coupled Systems)
**Use `findParent()` and `findChild()` only for systems of components that are designed to work together and are not intended to be used separately,** like `todo-list` and its `todo-item`s.

```javascript
// todo-item.js (Child)
const createComponent = ({ findParent, data }) => ({
  toggleCompleted() {
    // Directly access and modify the parent's state
    const parent = findParent('todo-list');
    parent.todos.setProperty(data.todo._id, 'completed', !data.todo.completed);
  }
});
```
> **📚 For a detailed decision guide and more examples**: See [`../guides/patterns-cookbook.md`](./patterns.md) → Component Communication Patterns

## ⚠️ **CRITICAL Method Reference Pattern**

**🚨 MANDATORY**: Always use `self.methodName()` when calling component methods from within other methods:

```javascript
const createComponent = ({ self, state, settings }) => ({
  getPercentage() {
    const { value, min, max } = settings;
    const range = max - min;
    const adjustedValue = Math.max(min, Math.min(max, value));
    return ((adjustedValue - min) / range) * 100;
  },

  getDisplayText() {
    if (!settings.showLabel) return '';
    // ✅ CRITICAL: Use self.methodName() for internal method calls
    const percentage = self.getPercentage();
    return `${percentage}%`;
  },

  // ❌ WRONG: Using this.methodName()
  getBadDisplayText() {
    const percentage = this.getPercentage(); // DON'T DO THIS
    return `${percentage}%`;
  }
});
```

**Why `self.` is required**: The component methods are bound to the `self` object, not `this`. See [`../foundations/mental-model.md`](/ai/foundations/mental-model.md) for complete explanation.

## ⚠️ **CRITICAL HTML Attribute Naming**

**HTML attributes don't automatically convert to camelCase - they remain lowercase:**

```javascript
// Settings definition
const defaultSettings = {
  showLabel: true    // camelCase in JavaScript
};

// Template usage (reactive)
{#if showLabel}     // camelCase in templates

// HTML usage (lowercase)
<progress-bar showlabel="false">  // lowercase in HTML attributes
<progress-bar show-label="false"> // kebab-case also works but converts to camelCase
```

## Essential Component Patterns

### Lifecycle Initialization
```javascript
const onCreated = ({ state, settings, reaction }) => {
  // Initialize state from settings
  state.theme.set(settings.defaultTheme);

  // Setup reactive computations
  reaction(() => {
    if (state.count.get() > 10) {
      state.warning.set(true);
    }
  });
};

const onRendered = ({ $, isClient }) => {
  // Browser-only DOM setup
  if (isClient) {
    $('.auto-focus').focus();
    this.setupExternalLibrary();
  }
};
```

### Event Binding Strategies
```javascript
const events = {
  // Standard: Within component
  'click .button': ({ self }) => self.toggle(),

  // Deep: Parent managing child components
  'deep click ui-button': ({ self, data }) => self.handleChild(data),

  // Global: Page-level events
  'global scroll window': ({ self }) => self.updatePosition(),

  // Form inputs with data attributes
  'input .field': ({ state, value, data }) => {
    state.fieldValue.set(value);
    // data-field-name="email" becomes data.fieldName = "email"
  }
};
```

### Query Strategies ⚠️ **CRITICAL NAMING CONVENTION**

**🚨 MANDATORY**: All variables holding query results MUST be prefixed with `$`

```javascript
const createComponent = ({ $, $$ }) => ({
  // ✅ CORRECT: $ prefix for query variables
  updateLocalElement() {
    const $button = $('.local-button');
    $button.addClass('active');
  },

  // ✅ CORRECT: $ prefix for multiple elements
  findGlobalElements() {
    const $dropdowns = $$('ui-dropdown');
    const $options = $$('ui-dropdown .option');
    return { $dropdowns, $options };
  },

  // ✅ CORRECT: $ prefix in method parameters
  highlightElement($element) {
    $element.addClass('highlighted');
  },

  // ❌ WRONG: Missing $ prefix
  badExample() {
    const button = $('.button');        // DON'T DO THIS
    const elements = $$('.item');       // DON'T DO THIS
  }
});
```

**Why $ prefix is required**:
- Clearly distinguishes Query collection results from other variables
- Makes code more readable and maintainable
- Prevents confusion between DOM elements and regular data
- Follows established convention for query-based variables

### Component Encapsulation & DOM Access ⚠️ **CRITICAL PATTERNS**

#### **Public API Design**
**🚨 MANDATORY**: Components must expose public API methods and hide internal state

```javascript
const createComponent = ({ self, state, settings }) => ({
  // ✅ CORRECT: Expose public methods for external access
  start() {
    state.isAnimating.set(true);
  },

  stop() {
    state.isAnimating.set(false);
  },

  toggle() {
    state.isAnimating.toggle();
  },

  isAnimating() {
    return state.isAnimating.get();           // Public getter, not direct state access
  }
});
```

#### **DOM Querying & Component Access**
**For imperative DOM updates or access to component instances from page scope, see [Query Package](/ai/packages/query.md) - Complete Query API reference**

**🚨 MANDATORY Query Variable Naming**: All variables holding query results MUST be prefixed with `$`:
```javascript
// ✅ CORRECT
const $button = $('.button');
const $loader = $('#dynamicLoader');
const loaderComponent = $loader.eq(0).component();

// ❌ WRONG
const button = $('.button');                 // Missing $ prefix
```

#### **UI Component Preference**
**🚨 MANDATORY**: Use existing UI components instead of regular HTML elements

```html
<!-- ✅ CORRECT: Use framework UI components -->
<ui-button emphasis="primary">Toggle</ui-button>
<ui-input value="text" type="text"></ui-input>

<!-- ❌ WRONG: Regular HTML when UI components exist -->
<button>Toggle</button>                      <!-- Use ui-button instead -->
<input type="text" value="text">             <!-- Use ui-input instead -->
```

**Available UI Components** (check `/src/components/` for complete list):
- `ui-button` - Interactive buttons with emphasis, colors, sizes
- `ui-input` - Form inputs with validation and styling
- `ui-card` - Content containers
- `ui-modal` - Dialog overlays
- `ui-menu` - Navigation menus

### Template-as-Settings Pattern ⭐ **FUNDAMENTAL**
```javascript
// Define template components for flexible rendering
const UserRowTemplate = defineComponent({
  template: `<tr><td>{name}</td><td>{email}</td></tr>`
});

// Component uses template setting
const defaultSettings = {
  rowTemplate: new Template(),  // Will be overridden
  items: []
};

// Template: {#each item in items}
//            {>template name=rowTemplate data=item}
//          {/each}

// Configure at runtime
$('data-table').settings({
  rowTemplate: UserRowTemplate,     // Custom rendering
  items: userData
});
```

> **📚 For comprehensive patterns**: See `/ai/semantic-ui-patterns-cookbook.md`

## Important Notes ⚠️ **REVIEW BEFORE CODING**

### Critical Reminders

**🚨 Method References**: Always use `self.methodName()` when calling component methods from within other methods (NOT `this.methodName()`)

**🚨 CSS Class Names**: Use semantic class names like `.large`, `.primary` (NOT `.size-large`, `.theme-primary`)

**🚨 Design Tokens**: Use `var(--large)`, `var(--primary-color)` instead of hardcoded values like `16px`, `#007bff`

**🚨 HTML Attributes**: Use lowercase `showlabel="false"` in HTML (NOT `showLabel="false"`)

### Framework Behavior

- The framework uses a batched update system - multiple state changes may be coalesced
  - Use `flush()` to manually force immediate updates if needed
  - Use `afterFlush(() => {})` to run code after all pending updates complete
- In templates, the data context is flattened - properties from settings, state, and methods are all directly accessible
- Always use shadow DOM principles for CSS (simple class names, nested selectors)
- Use reaction() to set up reactive computations, not for side effects

## Additional Best Practices

### Class Naming in Shadow DOM
- Keep class names simple and semantic (e.g., `.menu` instead of `.context-menu-container`)
- No need for namespacing or prefixing since Shadow DOM provides encapsulation
- Example: Use `.item`, `.divider`, `.header` instead of `.component-item`, etc.
- **CRITICAL**: Use `.large`, `.primary` NOT `.size-large`, `.theme-primary`

### State vs Settings
- `settings`: Use for configurable properties that typically don't change after initialization
  ```javascript
  const defaultSettings = {
    items: [],      // ✓ Configuration that the user provides
    width: 180,     // ✓ Customizable property
  };
  ```
- `state`: Use only for values that change during component lifetime due to user interaction
  ```javascript
  const defaultState = {
    visible: false,    // ✓ Changes during component use
    activeIndex: -1,   // ✓ Changes during component use
    items: []          // ✗ Don't duplicate settings in state
  };
  ```

### Template Syntax Clarifications
- Iteration uses `index` automatically, don't declare an index variable:
  ```html
  <!-- Correct -->
  {#each item in items}
    <div data-index="{index}">{item.label}</div>
  {/each}

  <!-- Incorrect -->
  {#each item, index in items}
    <div data-index="{index}">{item.label}</div>
  {/each}
  ```

- Use simple ternary expressions in attribute bindings:
  ```html
  <div tabindex="{isActive ? '0' : '-1'}"></div>
  ```

### Event Handling
- Always use the provided `dispatchEvent` function rather than creating DOM events manually:
  ```javascript
  // Correct
  dispatchEvent('select', { item, index });

  // Incorrect
  const event = new CustomEvent('select', {
    detail: { item, index },
    bubbles: true
  });
  element.dispatchEvent(event);
  ```

- For global events, use `body` rather than `document`:
  ```javascript
  // Correct
  'global click body'({ self }) {
    self.hideMenu();
  }

  // Avoid
  'global click document'({ self }) {
    self.hideMenu();
  }
  ```

### Slotted Content Pattern
- Use slots to create intuitive wrapper components:
  ```html
  <div class="container">
    {>slot}
  </div>
  ```

- This enables a natural usage pattern:
  ```html
  <my-component>
    <div class="content">Wrapped content</div>
  </my-component>
  ```

### Modern CSS Techniques
- Use `@starting-style` for smooth enter animations:
  ```css
  .menu.visible {
    opacity: 1;
    transform: scale(1);
  }
  @starting-style {
    .menu.visible {
      opacity: 0;
      transform: scale(0.95);
    }
  }
  ```

- Use class-based visibility toggling instead of inline styles:
  ```css
  .menu {
    visibility: hidden;
    opacity: 0;
  }
  .menu.visible {
    visibility: visible;
    opacity: 1;
  }
  ```

### Class Binding with Object Maps
- Return object maps from methods for conditional classes:
  ```javascript
  getMenuStates() {
    return {
      visible: state.visible.get(),
      active: state.active.get()
    };
  }
  ```

- Use with `classMap` helper in templates:
  ```html
  <div class="{classMap getMenuStates}"></div>
  ```

### Performance Optimizations
- Use `requestAnimationFrame` for DOM measurements and position calculations:
  ```javascript
  showElement() {
    state.visible.set(true);
    requestAnimationFrame(() => self.measureAndPosition());
  }
  ```

- For non-reactive reads in calculations, use `.peek()` to avoid triggering reactions:
  ```javascript
  const position = state.position.peek();
  ```

### Lifecycle Events
- Emit events for component lifecycle where appropriate:
  ```javascript
  showMenu() {
    // Setup code...
    dispatchEvent('show');
  }

  hideMenu() {
    // Cleanup code...
    dispatchEvent('hide');
  }
  ```

### Proper Parameter Access
- Access parameters directly as provided in function arguments:
  ```javascript
  // Correct
  createComponent({ self, state, settings }) {
    // Use state and settings directly
  }

  // Incorrect
  createComponent({ self }) {
    // Don't use self.state or self.settings
  }
  ```

### DOM Element Access in Event Handlers
The `target` argument in event handlers refers to the DOM element that matched the selector.
The `event.target` argument refers to the actual element that originated the event, which might be a child of `target`.
Avoid using `this` in event handlers to refer to DOM elements; prefer the explicit `target` or `event.target` arguments for clarity.

```javascript
'input .field'({ state, $, target, event }) { // Added target, event to destructured args
  // `target` is the .field element
  const value = $(target).val();
  state.inputValue.set(value);

  // If you needed the precise element that the input event fired on (which is `target` in this specific 'input .field' case)
  // you could use event.target:
  // const specificInputElement = event.target;
}
```

## Reference Examples

When creating components, refer to these example implementations in the knowledgebase for guidance on common patterns:

### Component Composition
- **TodoMVC** - A complete task management implementation demonstrating:
  - Parent-child component composition
  - State management across multiple components
  - Local storage persistence
  - Filtering and computed values
  - Reference files: `todo-list.js`, `todo-item.js`, `todo-header.js`, `todo-footer.js`

### User Interface Patterns
- **Context Menu** - Right-click menu system demonstrating:
  - Slotted content pattern
  - Position calculations
  - Keyboard navigation
  - Animation transitions
  - Reference files: `component.js`, `component.html`, `component.css`

- **UI-Panel** - Resizable panels demonstrating:
  - Drag interaction handling
  - Size calculations
  - Layout persistence
  - Reference files: `Panel.js`, `Panel.html`, `Panel.css`, `Panels.js`

### Search & Input Patterns
- **Search Component** - Search with dynamic results demonstrating:
  - Asynchronous data handling
  - Dynamic filtering
  - Keyboard navigation of results
  - Reference files: `component.js`, `component.html`, `component.css`

### Data Visualization
- **Spectrum Analyzer** - Audio visualization demonstrating:
  - Canvas drawing
  - Animation loops
  - Media API integration
  - Reference files: `component.js`

### Context Menu
- **Context Menu** - Customizable right-click menu demonstrating:
  - Slotted content wrapper pattern for intuitive usage
  - Dynamic positioning with viewport boundary detection
  - Keyboard navigation with arrow keys, Enter, and Escape
  - Modern CSS transitions with `@starting-style`
  - Class-based state management with object maps
  - Accessibility support with ARIA roles and keyboard focus
  - Event delegation with `deep contextmenu` handling
  - Reference files: `component.js`, `component.html`, `component.css`

When implementing a new component, consider:
1. Does an existing example demonstrate a similar interaction pattern?
2. How does the reference example handle state management?
3. What event handling patterns might be applicable?
4. How is component composition structured?

Refer to these examples for practical implementations of the patterns described in these instructions.

## 📖 **Creating Documentation Examples**

To showcase your components in the Semantic UI documentation system:

- **📋 Example Authoring Guide**: [Documentation Authoring](/ai/documentation/authoring/example-authoring.md) - Creating examples and documentation content
- **📦 Package Examples**: Refer to [Documentation Authoring](/ai/documentation/authoring/example-authoring.md) for package-specific example creation

The documentation system has specific requirements for file structure, metadata, and organization that are separate from general component development.

---

**Last Updated:** Component implementation guidance
**Maintenance:** Update this file when component patterns or framework APIs change
