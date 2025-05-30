# Semantic UI Component Generation Instructions

> **For:** AI agents creating Semantic UI components  
> **Prerequisites:** Basic understanding of web components and JavaScript  
> **Related:** [Mental Model](../foundations/mental-model.md) • [Patterns Cookbook](../guides/patterns-cookbook.md) • [API Reference](../foundations/quick-reference.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## 🚨 **CRITICAL: Read This Before Creating Components**

**MANDATORY READING BEFORE COMPONENT CREATION:**

1. **CSS & Design Patterns**: [`../guides/html-css-style-guide.md`](../guides/html-css-style-guide.md) - Essential for CSS class naming and design token usage
2. **Method References**: [`../foundations/mental-model.md`](../foundations/mental-model.md) - Critical `self.methodName()` patterns 
3. **Component Communication**: [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) - Parent-child patterns and event handling

**⚠️ Common Mistakes**: 
- Using prefixed class names like `.size-large` instead of `.large`
- Using `this.method()` instead of `self.method()` 
- Using hardcoded CSS values instead of design tokens like `var(--large)`
- Not prefixing query variables with `$` (use `const $div = $('div')`)
- Creating components in wrong directory structure
- Forgetting to create the required content metadata file
- **Not following HTML/CSS style guide for page files** (page.css and page.html must ALSO follow design token and semantic naming patterns)
- **Accessing internal component state directly** instead of using public API methods
- **🚨 CRITICAL: Using HTML elements instead of first-party UI components** (see First-Party Components section below)

---

## 📚 **Complete Reference Sources**

For comprehensive information beyond this guide:

- **🎨 HTML/CSS Style Guide**: [`../guides/html-css-style-guide.md`](../guides/html-css-style-guide.md) - **ESSENTIAL** CSS class naming and design token usage
- **🧠 Mental Model & Architecture**: [`../foundations/mental-model.md`](../foundations/mental-model.md) - Core concepts, method references, component tree navigation
- **📖 Patterns & Recipes**: [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) - Detailed implementation patterns and communication
- **⚡ Quick API Reference**: [`../foundations/quick-reference.md`](../foundations/quick-reference.md) - Complete API syntax and options
- **🗺️ Codebase Navigation**: [`../foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md) - Finding documentation and examples

**Rule**: When you need information beyond basic component creation, consult these canonical sources rather than guessing or duplicating information.

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
```

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

## 🚨 **MANDATORY: Component File Structure & Paths**

When creating a new component example, you **MUST** follow this exact structure:

### **Required Directory Structure**
```
/docs/src/examples/your-component-name/
├── component.js     # Main component definition (REQUIRED)
├── component.html   # Component template (REQUIRED)
├── component.css    # Component styles (REQUIRED)
├── page.html        # Custom demo (optional - auto-generated if missing)
├── page.css         # Demo styling (optional)
└── page.js          # Demo interactions (optional)

/docs/src/content/examples/
└── your-component-name.mdx  # Metadata file (REQUIRED)
```

### **Critical Requirements**
1. **Component files** MUST go in `/docs/src/examples/your-component-name/`
2. **Metadata file** MUST go in `/docs/src/content/examples/your-component-name.mdx`
3. **Both locations are REQUIRED** - the component will not work without both
4. **Folder name and metadata filename MUST match** (e.g., `loader/` folder → `loader.mdx` file)
5. **Title in metadata MUST match folder name** (e.g., folder `loader` → title `'Loader'`)

### **❌ Wrong Paths (DO NOT USE)**
- `/examples/your-component/` (this is for standalone examples, not docs)
- `/docs/src/examples/your-component.mdx` (metadata goes in content/examples/)
- Missing either component files OR metadata file

## Component Structure

**Core component files:**
- `component.js` - Main component definition
- `component.html` - Component template  
- `component.css` - Component styles (scoped to component)

**Demo page files (all optional):**
- `page.html` - Custom usage example (auto-generated if not provided)
- `page.css` - Demo page styling (use design tokens, not hardcoded values)
- `page.js` - Demo interactions (for complex demo functionality)

**🚨 CRITICAL: Page File Standards**
**page.html and page.css MUST follow the same HTML/CSS style guide as component files:**
- **page.css** must use design tokens (`var(--spacing)`, `var(--text-color)`) not hardcoded values
- **page.html** must use terse, semantic class names (`.container`, `.grid`, `.item`) not hyphenated names (`.demo-container`, `.loader-grid`)
- **page.css** must use CSS nesting and natural hierarchy patterns
- **page.js** must prefix all query variables with `$` (`const $button = $('#btn')`)

**Subcomponent files:**
- Use hyphenated names like `todo-item.js`, `todo-item.html`, `todo-item.css`

**Important**: Never use inline styles in `page.html` - use `page.css` for demo page styling

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

**🚨 MANDATORY**: Read [`../guides/html-css-style-guide.md`](../guides/html-css-style-guide.md) for complete CSS patterns.

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

### For Intentional Parent-Child Relationships
Component tree navigation is designed for components **meant to work together**:

```javascript
// Child accessing parent (button → button-group)
const createComponent = ({ findParent }) => ({
  updateSelection() {
    const group = findParent('ui-button-group');
    const mode = group.getSelectionMode();      // Get parent config
    group.clearOtherSelections(this.id);       // Call parent method
  }
});

// Parent managing children (accordion → panels)
const createComponent = ({ getChildren }) => ({
  closeAllPanels() {
    const panels = getChildren('ui-accordion-panel');
    panels.forEach(panel => panel.close());
  }
});
```

### Event-Based Notification
```javascript
// Child notifies parent of changes
const createComponent = ({ dispatchEvent }) => ({
  toggle() {
    state.isOpen.toggle();
    dispatchEvent('toggle', {
      panelId: this.id,
      isOpen: state.isOpen.get()
    });
  }
});

// Parent listens with deep events
const events = {
  'deep toggle ui-accordion-panel': ({ data, self }) => {
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
  }
};
```

### Common Parent-Child Patterns
- **Component Systems**: button-group ↔ button, accordion ↔ panel
- **Container Components**: form ↔ form-field, table ↔ table-row
- **Layout Components**: pane-group ↔ pane, tab-container ↔ tab

> **📚 For complete communication patterns**: See `/ai/semantic-ui-patterns-cookbook.md` → Component Communication Patterns

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

**Why `self.` is required**: The component methods are bound to the `self` object, not `this`. See [`../foundations/mental-model.md`](../foundations/mental-model.md) for complete explanation.

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
**For imperative DOM updates or access to component instances from page scope, see [`../specialized/query-system-guide.md`](../specialized/query-system-guide.md) - Complete Query API reference**

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

## Adding New Examples to Documentation

When creating examples to showcase your components, you need to add them to the documentation system. This involves two main parts: creating a metadata file and providing the actual component files.

### 1. Create Example Metadata (.mdx file)

Create a `.mdx` file in `/docs/src/content/examples/` with frontmatter metadata:

```markdown
---
title: 'Your Component Name'
exampleType: 'component'
category: 'Components'
subcategory: 'UI Components'  # or 'CSS Tokens', 'Form Elements', etc.
tags: ['component', 'ui', 'interaction']
description: A brief description of what your component does
tip: Optional helpful tip about implementation details
---
```

**Common subcategories:**
- `UI Components` - Interactive interface elements
- `Form Elements` - Input, validation, and form-related components
- `Layout` - Containers, grids, positioning components
- `CSS Tokens` - Design system and theming examples
- `Data Display` - Tables, lists, charts, visualization
- `Navigation` - Menus, tabs, breadcrumbs
- `Feedback` - Modals, alerts, progress indicators

### 2. Create Component Files

Add your component files in `/docs/src/examples/your-component-name/`:

**Required files:**
- `component.js` - Main component definition
- `component.html` - Component template
- `component.css` - Component styles

**Optional files:**
- `page.html` - Custom usage example (auto-generated if not provided)
- `page.js` - Page-level JavaScript for complex demos
- `page.css` - Page-specific styling
- Additional subcomponent files (e.g., `sub-item.js`, `sub-item.html`, `sub-item.css`)

### 3. Understanding Auto-Generated page.html

If you don't provide a `page.html` file, the system automatically generates one using your component's tag name (e.g., `<your-component></your-component>`). This auto-generation relies on the `tagName` being defined in your `component.js` via `defineComponent`.

**For template-only components** (defined using `defineComponent` but without a `tagName`), auto-generation of `page.html` is not applicable as there's no tag to render. In such cases, you **must** provide a custom `page.html`. This custom page should demonstrate how to programmatically create an instance of the template and render it (e.g., by importing the template definition and calling its `render()` method, then appending the result to the DOM or integrating it with a host component).

**Auto-generated structure:**
```html
<your-component></your-component>
```

**When to provide custom page.html:**
- Your component needs specific configuration or settings
- You want to demonstrate multiple usage patterns
- The component requires surrounding context or container elements
- You need to show component composition or interaction

**Example custom page.html:**
```html
<div class="demo-container">
  <h3>Basic Usage</h3>
  <my-component size="small"></my-component>

  <h3>With Custom Settings</h3>
  <my-component size="large" theme="dark"></my-component>
</div>
```

### 4. Playground Script Injection System

The documentation system includes a sophisticated script injection system for the interactive playground. Understanding this helps you write better examples.

#### Code Folding and Hiding (Special Cases Only)

The playground supports code folding and hiding markers, but these should **only be used in extremely special cases** for specific pedagogical purposes (like learning examples where you want to focus attention on specific concepts).

**⚠️ Avoid using these markers in regular component examples** - they create an anti-pattern that hides implementation details that users should see and understand.

```javascript
/* playground-hide */
// Only use for debugging code or pedagogical examples
/* playground-hide */

/* playground-fold */
// Only use when you specifically want to hide complexity for learning purposes
/* playground-fold */
```

#### How Auto-Generated HTML Works

The playground system automatically wraps your component in a complete HTML document:

**Generated wrapper structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Component Example</title>
  <script type="importmap">
    {
      "imports": {
        "@semantic-ui/component": "/dist/@semantic-ui/component.js",
        // ... other imports
      }
    }
  </script>
  <script>
    // Error handling and debugging setup
    window.addEventListener('error', (e) => {
      console.error('Playground Error:', e.error);
    });
  </script>
</head>
<body>
  <!-- Your component code gets injected here -->
  <script type="module">
    // Your JavaScript code with imports resolved
  </script>
</body>
</html>
```

**Key features:**
- **Import map resolution** - Framework imports are automatically resolved
- **Error handling** - Runtime errors are caught and displayed
- **Hot reloading** - Changes trigger automatic updates
- **CSS injection** - Component styles are automatically included

#### Best Practices for Examples

**1. Keep code visible and transparent:**
- Show all relevant implementation details
- Avoid hiding code with playground markers unless absolutely necessary for pedagogical purposes
- Let users see and learn from complete, real implementations

**2. Provide meaningful examples:**
- Show real-world usage patterns
- Include edge cases and error states
- Demonstrate accessibility features
- Use realistic data and content

**3. Consider progressive complexity:**
- Start with basic usage in auto-generated `page.html`
- Add custom `page.html` for advanced scenarios
- Use `page.js` for complex interactive demos

### 5. File Organization Examples

**Simple component (auto-generated page):**
```
/docs/src/examples/simple-button/
├── component.js     # Main component
├── component.html   # Template
├── component.css    # Styles
└── (page.html auto-generated)
```

**Complex component with custom demo:**
```
/docs/src/examples/advanced-table/
├── component.js     # Main table component
├── component.html   # Table template
├── component.css    # Table styles
├── row.js          # Row subcomponent
├── row.html        # Row template
├── row.css         # Row styles
├── page.html       # Custom demo page
├── page.js         # Demo interactions
└── page.css        # Demo styling
```

**Multi-component system:**
```
/docs/src/examples/todo-list/
├── component.js     # Main todo-list
├── component.html   # List template
├── component.css    # List styles
├── todo-item.js    # Item subcomponent
├── todo-item.html  # Item template
├── todo-item.css   # Item styles
├── todo-header.js  # Header subcomponent
├── todo-header.html # Header template
├── todo-header.css # Header styles
├── todo-footer.js  # Footer subcomponent
├── todo-footer.html # Footer template
├── todo-footer.css # Footer styles
├── page.html       # Complete demo
└── page.css        # Demo styling
```

## Creating Package Examples (Non-Component)

For examples that demonstrate core packages like `@semantic-ui/reactivity` or `@semantic-ui/query` rather than full components, use a simpler structure with just an `index.js` file.

### Package Example Structure

**Simple package example:**
```
/docs/src/examples/reactive-helpers/reactive-now/
└── index.js     # Complete example code
```

**Package example with supporting files:**
```
/docs/src/examples/query/dom/shadow-dom/
├── component.js     # Component definition (if needed)
├── component.html   # Template (if needed)
├── component.css    # Styles (if needed)
├── page.html       # Demo page
├── page.js         # Demo interactions
└── page.css        # Demo styling
```

### Package Example Patterns

**1. Reactivity Examples** - Demonstrating Signal and Reaction APIs:
```javascript
import { Reaction, Signal } from '@semantic-ui/reactivity';

const counter = new Signal(0);

Reaction.create((reaction) => {
  console.log(`Counter value: ${counter.get()}`);
  if (reaction.firstRun) {
    console.log('First run - setting up reaction');
  }
});

// Demonstrate the specific API feature
counter.increment(1);   // For reactive-increment example
counter.now();          // For reactive-now example
counter.removeIndex(0); // For reactive-remove-index example
```

**2. Query Examples** - Demonstrating DOM querying and manipulation:
```javascript
import { $, $$ } from '@semantic-ui/query';

// Demonstrate specific query features
const elements = $$('ui-component .selector');
elements.forEach(el => {
  el.classList.add('processed');
});
```

**3. Utility Examples** - Demonstrating helper functions and utilities:
```javascript
import { helper, utility } from '@semantic-ui/utilities';

// Show practical usage of utility functions
const result = helper(inputData);
console.log('Processed result:', result);
```

### Package Example Guidelines

**Focus on specific APIs:**
- Each example should demonstrate one specific feature or method
- Keep examples minimal and focused
- Use clear, descriptive console logging to show results
- Include comments explaining what the code demonstrates

**Common patterns:**
```javascript
// 1. Import the specific package
import { Signal, Reaction } from '@semantic-ui/reactivity';

// 2. Set up initial state
const data = new Signal(['item1', 'item2', 'item3']);

// 3. Create reaction to observe changes
Reaction.create((reaction) => {
  const currentData = data.get();
  if (!reaction.firstRun) {
    console.log('Data changed:', currentData);
  }
});

// 4. Demonstrate the specific feature
data.push('item4');  // Shows reactive array mutation
```

**Naming conventions for package examples:**
- `reactive-[method-name]` - For reactivity API demonstrations
- `query-[feature]` - For query API demonstrations  
- `[package]-[feature]` - For other package demonstrations

### When to Use Package Examples vs Component Examples

**Use package examples (index.js) for:**
- Demonstrating core API features like Signal methods
- Showing utility function usage
- Teaching fundamental concepts
- Simple code snippets that don't need UI

**Use component examples (component.js/html/css) for:**
- Interactive UI demonstrations
- Complete component implementations
- Complex user interactions
- Visual demonstrations of functionality

Package examples are ideal for teaching the building blocks and core APIs that developers will use when creating their own components.
