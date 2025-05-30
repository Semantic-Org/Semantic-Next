# Semantic UI Quick Reference

## Table of Contents

- [Component Definition API](#component-definition-api)
- [State Management API](#state-management-api)
- [Template Syntax Reference](#template-syntax-reference)
- [Event Handling API](#event-handling-api)
- [Query API Reference](#query-api-reference)
- [Reactivity API Reference](#reactivity-api-reference)
- [Lifecycle Hooks Reference](#lifecycle-hooks-reference)
- [Component Tree Navigation](#component-tree-navigation)
- [Decision Flowcharts](#decision-flowcharts)
- [Common Recipes](#common-recipes)
- [Debugging Tips](#debugging-tips)

---

## Component Definition API

### defineComponent(config)

```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'my-component',           // Optional: omit for template-only components
  template,                         // Required: HTML template
  css,                             // Optional: scoped styles
  defaultSettings: {},             // Optional: mutable reactive configuration
  defaultState: {},                // Optional: reactive state signals
  subTemplates: {},                // Optional: child templates
  createComponent: ({ ... }) => ({}),  // Optional: instance methods
  events: {},                      // Optional: event handlers
  keys: {},                        // Optional: keyboard shortcuts
  onCreated: ({ ... }) => {},      // Optional: post-creation hook
  onRendered: ({ ... }) => {},     // Optional: post-render hook
  onDestroyed: ({ ... }) => {},    // Optional: cleanup hook
});
```

### Callback Arguments

All lifecycle callbacks and event handlers receive these arguments:

```javascript
{
  // Component references
  self,           // Component instance with methods
  el,             // DOM element reference
  
  // State & Settings
  state,          // Reactive state signals
  settings,       // Mutable reactive settings proxy
  
  // Reactivity
  signal,         // Create new signals: signal(initialValue)
  reaction,       // Create reactive computations
  afterFlush,     // Run code after DOM updates
  
  // DOM manipulation
  $,              // Standard DOM queries (no shadow DOM crossing)
  $$,             // Deep DOM queries (crosses shadow DOM)
  
  // Component tree (for intentional parent-child relationships)
  findParent,     // Navigate up: findParent('tag-name')
  findChild,      // Navigate down: findChild('tag-name')
  getChild,       // Get child by index: getChild(0)
  getChildren,    // Get all children of type
  
  // Events
  attachEvent,    // Manually attach events
  dispatchEvent,  // Emit custom events
  bindKey,        // Dynamically bind keys
  unbindKey,      // Dynamically unbind keys
  
  // Environment
  isClient,       // true in browser
  isServer,       // true during SSR
}
```

### Event Handler Additional Arguments

Event handlers receive all standard arguments plus:

```javascript
{
  // Event-specific arguments
  event,          // Native event object
  target,         // Element matching the selector (may differ from event.target)
  data,           // An object containing merged data. It includes properties from the
                  // element's `dataset` attributes (with values type-converted, e.g., "true" to true)
                  // and properties from the `event.detail` object (if the event is a CustomEvent).
                  // In case of key collisions between `dataset` and `event.detail`,
                  // properties from `event.detail` will overwrite those from `dataset`.
  value,          // Input value (for input events)
  isDeep,         // Event from nested component/slot
}
```

### Key Binding Additional Arguments

Key binding handlers receive all standard arguments plus:

```javascript
{
  // Key-specific arguments
  event,          // Native keyboard event
  inputFocused,   // Whether any input/contenteditable is focused
  repeatedKey,    // Whether the key is held down
}
```

---

## Component Data Management

### Settings - Public API (Fully Reactive)

```javascript
const defaultSettings = {
  theme: 'light',        // Public configuration
  size: 'medium',        // User-controllable
  disabled: false,       // External API
  maxItems: 10          // Public limits
};

// Settings are reactive everywhere (no .get()/.set() needed)
settings.theme = 'dark';               // Triggers reactivity
settings.size = 'large';               // Template updates automatically
```

### State - Internal Reactive Data

```javascript
const defaultState = {
  isOpen: false,         // Internal conditions
  currentValue: null,    // Internal reactive data
  items: [],            // Internal collections
  errors: {}            // Internal state tracking
};

// State uses explicit signal API in component logic
state.isOpen.set(true);               // Explicit in logic
// {isOpen} in templates              // Automatic in templates
```

### Component Props - Non-Reactive Data

```javascript
const createComponent = ({ state, settings, self }) => ({
  // Component props - direct instance properties
  apiEndpoint: '/api/users',          // Static data
  validationRules: getRules(),        // Cached calculation
  debounceTimer: null,               // Mutable non-reactive
  constants: { MAX_RETRIES: 3 },     // Static values
  
  // Methods have access to all data types
  makeApiCall() {
    fetch(self.apiEndpoint)           // Access via self
      .then(data => state.data.set(data));
  }
});
```

### State Access Patterns

```javascript
// Reading state
const value = state.counter.get();      // Explicit read
const value = state.counter.value;      // Property access

// Writing state  
state.counter.set(5);                   // Set new value
state.counter.value = 5;                // Property assignment

// Built-in helpers
state.counter.increment(amount);        // Add to number
state.counter.decrement(amount);        // Subtract from number
state.counter.toggle();                 // Toggle boolean
state.counter.now();                    // Set to current Date
state.counter.clear();                  // Reset to default value
```

### Array State Operations

```javascript
// Array manipulation
state.items.push(item);                 // Add item
state.items.unshift(item);              // Add to beginning
state.items.pop();                      // Remove last
state.items.shift();                    // Remove first
state.items.splice(index, count, ...items);  // Splice operation

// Item operations
state.items.removeItem(item);           // Remove by reference
state.items.removeIndex(index);         // Remove by index
state.items.setIndex(index, newItem);   // Update by index
state.items.replaceItem(oldItem, newItem);  // Replace item

// Property operations
state.items.setProperty(id, 'completed', true);       // Set property on item by ID
state.items.setArrayProperty('selected', false);      // Set property on all items
state.items.setArrayProperty(2, 'active', true);     // Set property on item at index
```

### Object State Operations

```javascript
// Object property manipulation
state.user.setProperty('name', 'Alice');              // Set single property
state.user.setProperties({ name: 'Bob', age: 30 });  // Set multiple properties
state.user.deleteProperty('age');                     // Delete property
```

### Settings - Fully Reactive

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

Settings use a proxy system with hidden signals for full reactivity:

```javascript
// Settings are reactive everywhere
settings.theme = 'dark';               // Direct assignment triggers reactivity
settings.size = 'large';               // Template updates automatically

// Reactive in component logic (inside reactions)
reaction(() => {
  console.log(settings.theme);         // Creates dependency, will re-run when changed
});

// Reactive in templates (automatic)
// {theme} will update when settings.theme changes
```

**Settings Proxy Implementation**:
```javascript
// Behind the scenes - creates hidden signals
createSettingsProxy() {
  component.settingsVars = new Map();
  return new Proxy({}, {
    get: (target, property) => {
      let signal = component.settingsVars.get(property);
      if (signal) signal.get(); // Creates dependency
      return currentValue;
    },
    set: (target, property, value) => {
      signal.set(value); // Triggers reactive updates
    }
  });
}
```

---

## Template Syntax Reference

### Basic Expressions

```html
<!-- Variable interpolation -->
{variableName}
{user.name}
{settings.theme}

<!-- Method calls (Lisp style) -->
{formatDate date 'YYYY-MM-DD'}
{add counter 1}
{getUser userId}

<!-- Method calls (JavaScript style) -->
{formatDate(date, 'YYYY-MM-DD')}
{add(counter, 1)}
{getUser(userId)}

<!-- Mixed style - JavaScript in parentheses -->
{doSomething (arg1 + 2) (arg2 + 3) {a: 1, b: 2}}

<!-- Complex JavaScript expressions -->
{formatDate (getDate now) 'h:mm'}
{titleCase (concat firstName ' ' lastName)}

<!-- Any JavaScript can be used -->
{users.filter(u => u.active).length}
{items.slice(0, 5)}
{someArray.map(item => item.name).join(', ')}

<!-- HTML output (unescaped) -->
{#html richTextContent}
```

### Conditionals

```html
<!-- Basic if -->
{#if condition}
  Content when true
{/if}

<!-- If-else -->
{#if isLoggedIn}
  Welcome back!
{else}
  Please log in
{/if}

<!-- If-else if-else -->
{#if status === 'loading'}
  Loading...
{else if status === 'error'}
  Error occurred
{else}
  Content loaded
{/if}

<!-- Conditionals with expressions -->
{#if users.length > 0}
  Found {users.length} users
{/if}

{#if (getUserCount) > 10}
  Many users
{/if}

<!-- Inline conditionals -->
<div class="{#if active}active{/if}">

<!-- Helper conditionals -->
{#if hasAny items}
  {#each items}...
{/if}
```

### Loops

```html
<!-- Basic each (access properties directly) -->
{#each people}
  {name} - {age}
{/each}

<!-- Each with this reference -->
{#each numbers}
  {this}
{/each}

<!-- Each...in syntax -->
{#each member in team.members}
  <li>{member.name} - {member.age}</li>
{/each}

<!-- Each...in with index -->
{#each member, index in team.members}
  <li>#{index + 1}: {member.name}</li>
{/each}

<!-- Each...as syntax (alternative) -->
{#each team.members as member}
  <li>{member.name} - {member.age}</li>
{/each}

<!-- Each...as with index -->
{#each team.members as member, index}
  <li>#{index + 1}: {member.name}</li>
{/each}

<!-- Object iteration -->
{#each value, key in object}
  <div>{key}: {value}</div>
{/each}

<!-- Loop with else (empty state) -->
{#each items}
  <div>{name}</div>
{else}
  <div>No items found</div>
{/each}

<!-- Loops with expressions -->
{#each item in getVisibleItems}
  {item.name}
{/each}

{#each item in users.slice(0, 5)}
  {item.name}
{/each}

{#each number in [1, 2, 3]}
  {number}
{/each}

<!-- Auto-available index in arrays -->
{#each person in team}
  Employee #{index + 1}: {person.name}
{/each}

<!-- Custom index alias -->
{#each product, i in products}
  <p>Item #{i + 1}: {product.name}</p>
{/each}

<!-- Nested loops with custom aliases -->
{#each team, teamIndex in teams}
  <h4>{team.name}</h4>
  {#each member, memberIndex in team.members}
    <li>Team #{teamIndex + 1}, Member #{memberIndex + 1}: {member.name}</li>
  {/each}
{/each}
```

### Slots and Sub-templates

```html
<!-- Default slot -->
{>slot}

<!-- Named slot -->
{>slot header}
{>slot content}

<!-- Sub-template inclusion -->
{>templateName}

<!-- Sub-template with data -->
{>templateName data=item index=index}

<!-- Standard notation (defaults to reactiveData) -->
{>cardTemplate title="Hello" user=currentUser}

<!-- Verbose notation with explicit reactive/static data -->
{>template 
  name="cardTemplate"
  reactiveData={ user: currentUser, count: itemCount }
  data={ title: "Static Title", theme: "dark" }
}
```

### Snippets

```html
<!-- Define snippet (no parameters) -->
{#snippet userCard}
  <div class="user">
    <img src="{avatar}" alt="{name}" />
    <h3>{name}</h3>
    <p>{email}</p>
  </div>
{/snippet}

<!-- Use snippet -->
{#each users}
  {>userCard}
{/each}

<!-- Snippet with data context modification -->
{#snippet greeting}
  {greeting} {name}
{/snippet}

<!-- Use snippet with data -->
{>greeting greeting="hello" name="Sally"}
{>greeting greeting="goodbye" name="Sally"}

<!-- Conditional snippet usage -->
{#if href}
  <a href="{href}">
    {>content}
  </a>
{else}
  {>content}
{/if}

{#snippet content}
  {beforeText} {text} {afterText}
{/snippet}
```

### Class and Style Binding

```html
<!-- Dynamic classes -->
<div class="{classMap getClasses}">

<!-- Style binding -->
<div style="width: {width}px; height: {height}px;">

<!-- Conditional classes -->
<div class="{#if active}active{/if} {#if large}large{/if}">

<!-- Class object helper -->
<div class="{classMap { active: isActive, disabled: !enabled }}">

<!-- Boolean attributes (no quotes = attribute removed if falsy) -->
<input type="checkbox" checked={isChecked} />
<button disabled={!isEnabled}>Click me</button>

<!-- String attributes (with quotes = always string output) -->
<div data-value="{numericValue}">  <!-- Always outputs as string -->
```

---

## Event Handling API

### Event Binding Strategies

Semantic UI provides multiple event binding strategies through keywords:

```javascript
const events = {
  // Standard (default): Event delegation within component
  'click .button': ({ self }) => self.doSomething(),
  
  // Global: Bind to elements outside component
  'global scroll window': () => handleGlobalScroll(),
  'global hashchange window': () => handleHashChange(),
  'global resize window': () => handleResize(),
  
  // Deep: Access intentional child components (parent managing children)
  'deep click ui-button': () => handleChildButton(),      // button-group → button
  'deep select ui-dropdown': () => handleChildSelect(),   // form → dropdown
  'deep toggle ui-accordion-panel': () => {},             // accordion → panel
  
  // Bind: Direct binding (for non-bubbling events)
  'bind customevent some-component': () => handleCustomEvent(),
  
  // Multiple events, single selector
  'mouseup, mouseleave .element': ({ state }) => state.active.set(false),
  
  // Single event, multiple selectors  
  'click .btn1, click .btn2': ({ target }) => console.log(target),
  
  // Component-wide events (no selector)
  'mouseover': ({ state }) => state.hovered.set(true),
  'mouseout': ({ state }) => state.hovered.set(false),
};
```

### When to Use Each Strategy

- **Standard (default)**: Event delegation within your component's template
- **Global**: Page-level events that happen outside your component (scroll, hashchange, resize)
- **Deep**: Parent component managing its intentional child components (button-group → button, pane-group → pane, form → form-field)
- **Bind**: Custom events that don't bubble by default, or when you need direct binding

### Event Handler Arguments

```javascript
const events = {
  'click .item': ({ 
    // Standard arguments
    self, state, settings, $, $$,
    
    // Event-specific arguments  
    event,      // Native event object
    target,     // Element matching selector (not event.target)
    data,       // data-* attributes + event.detail (auto type-converted)
    value,      // Input value (for input events)
    isDeep      // true if event from nested component
  }) => {
    // data-amount="5" becomes data.amount = 5 (number)
    // data-enabled="true" becomes data.enabled = true (boolean)
    // Custom event detail is merged with data attributes
  }
};
```

### Custom Event Dispatching

```javascript
const createComponent = ({ dispatchEvent }) => ({
  notifyChange(value) {
    dispatchEvent('valuechange', {
      newValue: value,
      timestamp: Date.now()
    });
  }
});

// Listen to custom events
const events = {
  'valuechange custom-component': ({ data }) => {
    // data = { newValue, timestamp }
  }
};
```

---

## Query API Reference

### Basic Query Operations

```javascript
// Standard DOM queries (no shadow DOM crossing)
$('.selector')                    // Query within component
$('.selector').addClass('active') // jQuery-like chaining
$('.selector').css('color', 'red')
$('.selector').attr('data-id', '123')
$('.selector').text('New content')
$('.selector').html('<strong>Bold</strong>')

// Deep queries (crosses shadow DOM boundaries)
$$('.selector')                   // Query across shadow boundaries
$$('ui-component .internal')      // Query inside web components
$$('.global-element')             // Find elements anywhere
```

### Query Chaining

```javascript
$('.user-profile')
  .find('.avatar')
    .attr('src', '/new-avatar.png')
    .addClass('updated')
  .end()
  .find('.username')
    .text('New Username')
    .addClass('changed');
```

### Component Configuration & Access

```javascript
// Get component instance from DOM element
const component = $('ui-dropdown').getComponent();
component.setValue('new-value');

// Configure component with settings (after DOM insertion)
$('ui-panel').settings({
  theme: 'dark',
  collapsible: true,
  onToggle: (isOpen) => console.log('Panel toggled:', isOpen),  // Function setting
  allowedSizes: ['small', 'medium', 'large'],                  // Array setting
  config: { animation: { duration: 300, easing: 'ease' } }     // Object setting
});

// Pre-initialize before DOM insertion (for non-serializable settings)
$('ui-modal').initialize({
  autoOpen: true,
  backdrop: false,
  onClose: () => updatePageState(),              // Function
  validationRules: getValidationRules(),         // Complex object
  allowedActions: ['save', 'cancel', 'delete'],  // Array from JS
  
  // Template-as-settings (preferred pattern for dynamic rendering)
  rowTemplate: CustomRowTemplate,                // Entire template component
  headerTemplate: CustomHeaderTemplate,          // Custom header renderer
  emptyTemplate: EmptyStateTemplate              // Empty state template
});

// Access component's template instance
const template = $('ui-dropdown').component();
template.openDropdown();                        // Call template methods
template.state.selectedValue.set('new-value'); // Access template state

// Access component's data context
const context = $('ui-dropdown').dataContext();
console.log('Current state:', context.state);
console.log('Settings:', context.settings);
console.log('Available methods:', Object.keys(context.self));
```

### Component Lifecycle Integration

```javascript
// Pattern: Configure component programmatically
function setupAdvancedDropdown(selector, options) {
  // Initialize with complex settings
  $(selector).initialize({
    items: options.dataSource,                    // Dynamic data
    filterFunction: options.customFilter,         // Custom function
    onSelectionChange: options.onSelect,          // Callback function
    templates: {                                  // Template overrides
      item: options.itemTemplate,
      empty: options.emptyTemplate
    }
  });
}

// Pattern: Dynamic component configuration
function updateComponentSettings(selector, newConfig) {
  const component = $(selector).getComponent();
  
  // Update settings that can't be serialized to attributes
  $(selector).settings({
    dataProvider: newConfig.getDataProvider(),    // Function
    validationSchema: newConfig.schema,           // Complex object
    onDataChange: newConfig.changeHandler         // Callback
  });
  
  // Or access template directly for immediate changes
  const template = $(selector).component();
  template.updateConfiguration(newConfig);
}
```

### Event Handling

```javascript
// Attach events
$('.button').on('click', (event) => {
  console.log('Clicked!');
});

// Event delegation
$(document).on('click', '.dynamic-button', (event) => {
  // Handles dynamically added buttons
});

// Remove events
$('.button').off('click', handlerFunction);
```

---

## Reactivity API Reference

### Signal Creation and Management

```javascript
import { Signal, Reaction } from '@semantic-ui/reactivity';

// Create signals
const counter = new Signal(0);
const items = new Signal([]);
const user = new Signal({ name: 'Jack' });

// Signal operations
counter.get()              // Read value
counter.set(5)             // Set value  
counter.value = 5          // Property assignment
counter.increment(1)       // Built-in helpers
counter.decrement(1)
counter.toggle()           // For booleans
counter.now()              // Set to current Date
counter.clear()            // Reset to default
```

### Reaction Creation

```javascript
// Create reactions
const dispose = Reaction.create(() => {
  console.log('Counter:', counter.get());
  // Re-runs when counter changes
});

// Component-scoped reactions
const createComponent = ({ reaction }) => ({
  onCreated() {
    reaction(() => {
      // Automatically disposed when component destroys
      if (state.count.get() > 10) {
        state.warning.set(true);
      }
    });
  }
});
```

### Control Flow

```javascript
// Prevent reactivity
const value = counter.peek();  // Read without creating dependency

// Non-reactive execution
Reaction.nonreactive(() => {
  // Code here doesn't track dependencies
  counter.set(5);
});

// Guard against unnecessary recalculations
const computed = Signal.guard(() => {
  // Only re-runs if result would change
  return expensiveCalculation();
});
```

### Batching and Flushing

```javascript
// Manual flush control
import { afterFlush } from '@semantic-ui/reactivity';

const updateStates = ({ afterFlush }) => {
  state.counter.set(5);
  state.message.set('Updated');
  
  afterFlush(() => {
    // Runs after all DOM updates
    console.log('DOM updated');
  });
};
```

---

## Lifecycle Hooks Reference

### Hook Execution Order

```javascript
// 1. Component constructor
// 2. Settings/State initialization  
// 3. createComponent() - returns instance methods
// 4. onCreated() - component fully initialized
// 5. Template compilation and rendering
// 6. onRendered() - DOM is ready
// ... component lifetime ...
// 7. onDestroyed() - component being removed
```

### Hook Signatures

```javascript
const createComponent = ({ self, state, settings, signal, reaction, ...args }) => ({
  // Return object becomes component instance
  myMethod() {
    // Component instance methods
  }
});

const onCreated = ({ self, state, settings, isClient, isServer, ...args }) => {
  // Initialization logic
  // Setup reactions, timers, external subscriptions
};

const onRendered = ({ self, $, $$, isClient, isServer, ...args }) => {
  // Post-render setup
  // DOM manipulation, focus management
  // Only runs in browser (isClient === true)
};

const onDestroyed = ({ self, state, ...args }) => {
  // Cleanup logic (rarely needed - most cleanup is automatic)
  // Clear external timers, close connections
};
```

### Common Patterns

```javascript
// Initialize state from settings
const onCreated = ({ state, settings }) => {
  state.theme.set(settings.defaultTheme);
  state.items.set(settings.initialItems || []);
};

// Setup DOM after render
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.auto-focus').focus();
    setupExternalLibrary();
  }
};

// Reactive initialization
const createComponent = ({ reaction, state }) => ({
  onCreated() {
    reaction(() => {
      // Reactive validation
      const isValid = this.validateForm();
      state.valid.set(isValid);
    });
  }
});
```

---

## Component Tree Navigation

### For Intentional Parent-Child Relationships

Component tree navigation is designed for **intentional parent-child component relationships** - components designed to work together:

### findParent(tagName)

`findParent(tagName)` searches for an ancestor component. The search mechanism prioritizes the DOM tree: it traverses upwards from the current component's host element (`template.element?.parentNode`), looking for an ancestor element that hosts a component matching the specified `tagName`. It will return the *closest* such DOM ancestor.

As a fallback for non-DOM-based nesting (e.g., logical template partials embedded directly within another template's render logic), it may also consult internal `parentTemplate` links established during template rendering. If no `tagName` is provided, `findParent` typically finds the closest component parent regardless of its tag name.

For finding multiple parents or searching more globally across all rendered templates by their developer-assigned `templateName`, utilities like `findParents(tagName)` (if available) or `Template.findTemplate(templateName)` (which accesses a map of all rendered templates by `templateName`) can be considered.

```javascript
const createComponent = ({ findParent }) => ({
  // Child component accessing its designed parent
  getParentData() {
    const parent = findParent('button-group');    // button → button-group
    return parent.getSelectionMode();
  },
  
  shareState() {
    const form = findParent('form-container');    // form-field → form
    return form.formData;
  },
  
  notifyParent() {
    const accordion = findParent('ui-accordion'); // panel → accordion
    accordion.panelToggled(this.id);
  }
});
```

### findChild(tagName) / getChildren()

```javascript
const createComponent = ({ findChild, getChild, getChildren }) => ({
  // Parent component managing its children
  updateChild() {
    const child = findChild('ui-button');        // button-group → button
    child.setSelected(true);
  },
  
  updateByIndex() {
    const firstChild = getChild(0);              // first child by index
    firstChild.highlight();
  },
  
  updateAllChildren() {
    const children = getChildren('ui-panel');    // pane-group → all panes
    children.forEach(child => child.refresh());
  }
});
```

### Common Parent-Child Patterns

**Use Cases**:
- **Component Systems**: button-group ↔ button, accordion ↔ accordion-panel
- **Container Components**: form ↔ form-field, table ↔ table-row  
- **Layout Components**: pane-group ↔ pane, tab-container ↔ tab
- **List Components**: todo-list ↔ todo-item, menu ↔ menu-item

### State Sharing Patterns

```javascript
// Parent exposes state for children
const createComponent = ({ signal }) => ({
  // Exposed properties for child access
  todos: signal([]),
  selectedId: signal(null),
  
  addTodo(todo) {
    this.todos.push(todo);
  }
});

// Child accesses parent state
const createComponent = ({ findParent }) => ({
  getTodos() {
    return findParent('todo-list').todos;  // Direct signal access
  },
  
  selectTodo(id) {
    const parent = findParent('todo-list');
    parent.selectedId.set(id);  // Modify parent state
  }
});
```

---

## Decision Flowcharts

### Component Data Type Decision Guide

```
What type of data is this?

├── Should external consumers configure this?
│   ├── YES → Use Settings (Public API)
│   │   ├── settings.theme = 'dark' (reactive everywhere)
│   │   └── Examples: theme, size, disabled, onSelect callback
│   
├── Does this data drive UI updates internally?
│   ├── YES → Use State (Internal Reactive)
│   │   ├── state.isOpen.set(true) (explicit in logic)
│   │   └── Examples: isOpen, selectedItem, validationErrors
│   
└── Is this static, cached, or non-reactive data?
    ├── YES → Use Component Props (Non-Reactive)
    │   ├── Access via self.propName or directly in templates
    │   └── Examples: apiEndpoint, constants, timers, cached values
```

### When to Create Methods That Return Values

```
Should I create a method that returns data?

├── Is this for external API consumers?
│   ├── YES → Create the method (external access via query library)
│   └── Examples: getFormData(), getCurrentSelection(), exportData()
│
├── Is this complex logic unsuitable for templates?
│   ├── YES → Create the method 
│   └── Examples: getFilteredResults(), calculateTotals()
│
└── Is this just returning existing state/settings/props?
    ├── YES → DON'T create the method (use direct access)
    └── Templates already have access to all data context
```

### When to Use $ vs $$

```
Do you need to query across Shadow DOM boundaries?
├── YES → Use $$ (querySelectorAllDeep)
│   ├── Examples: $$('ui-dropdown .option')
│   ├── Examples: $$('.global-notification')
│   └── Note: Slower but more powerful
└── NO → Use $ (querySelectorAll)
    ├── Examples: $('.local-button')
    ├── Examples: $('input[name="email"]')
    └── Note: Faster, standard DOM only
```

### Component Configuration Strategy

```
When should you configure components programmatically?
├── Non-serializable settings (functions, complex objects) → .initialize() or .settings()
│   ├── Callback functions: onSelect, onValidate, onClose
│   ├── Complex data: validation schemas, dynamic arrays
│   ├── Function references: custom filters, formatters
│   ├── Template components: rowTemplate, itemTemplate, headerTemplate
│   └── Use .initialize() before DOM insertion, .settings() after
│
├── Simple attribute-based settings → HTML attributes
│   ├── theme="dark", size="large", disabled="true"
│   ├── Serializable values that don't change
│   └── Static configuration
│
└── Need template access → .component() and .dataContext()
    ├── Direct state manipulation
    ├── Method invocation
    └── Debugging and inspection
```

### Template-as-Settings Pattern

**The preferred pattern for dynamic rendering in complex components**:

```javascript
// Define template components for custom rendering
import { UserRowTemplate } from './templates/user-row.js';
import { AdminRowTemplate } from './templates/admin-row.js';
import { EmptyStateTemplate } from './templates/empty-state.js';

// Configure component with template settings
$('dynamic-table').settings({
  rowTemplate: UserRowTemplate,        // Template component for each row
  emptyTemplate: EmptyStateTemplate,   // Template when no data
  headers: ['Name', 'Email', 'Role']   // Static configuration
});

// Switch templates dynamically
function switchToAdminView() {
  $('dynamic-table').settings({
    rowTemplate: AdminRowTemplate,     // Different template component
    headers: ['Name', 'Permissions', 'Last Login']
  });
}

// Component template uses the setting
// Template: {>template name=rowTemplate data=rowData}
```

**Use cases**:
- **Data Tables**: Custom row/cell rendering based on data type
- **Lists**: Different item templates for different item types  
- **Cards**: Custom card layouts for different content types
- **Forms**: Dynamic field templates based on field type
- **Modals**: Custom content templates for different modal types

### Event Binding Strategy Choice

```
Where is the event you need to handle?
├── Within your component template → Standard delegation
│   └── 'click .button': () => {}
├── Outside your component (page-level) → Global
│   ├── 'global scroll window': () => {}
│   └── 'global hashchange window': () => {}
├── In intentional child components → Deep
│   ├── button-group listening to button events
│   ├── accordion listening to panel events
│   └── 'deep click ui-button': () => {}
└── Custom events that don't bubble → Bind
    └── 'bind customevent some-component': () => {}
```

### Component Communication Strategy

```
What type of component relationship?
├── Same Component → Use local state
├── Intentional Parent-Child → Use findParent/findChild
│   ├── Child needs parent data → findParent('parent-tag')
│   ├── Parent controls child → findChild('child-tag')
│   ├── Examples: button-group ↔ button, form ↔ field
│   └── Expose signals on component instance
├── Distant Components → Navigate component tree
│   ├── findParent() to common ancestor
│   └── Access shared state through ancestor
└── Unrelated Components → Component tree navigation
    ├── Create top-level data provider component
    └── All descendants use findParent('data-provider')
```

---

## Common Recipes

### Form Validation Pattern

```javascript
const defaultState = {
  values: {},
  errors: {},
  valid: false
};

const createComponent = ({ state, reaction }) => ({
  onCreated() {
    // Reactive validation
    reaction(() => {
      const values = state.values.get();
      const errors = this.validateForm(values);
      state.errors.set(errors);
      state.valid.set(Object.keys(errors).length === 0);
    });
  },
  
  validateForm(values) {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.name) errors.name = 'Name is required';
    return errors;
  },
  
  updateField(name, value) {
    state.values.setProperty(name, value);
  }
});

// Template with validation display
```html
<input 
  type="email" 
  value="{values.email}" 
  class="{#if errors.email}error{/if}"
/>
{#if errors.email}
  <span class="error-message">{errors.email}</span>
{/if}
```

### Parent-Child Component Pattern

```javascript
// Parent component (todo-list)
const createComponent = ({ signal }) => ({
  todos: signal([]),  // Exposed for children
  filter: signal('all'),
  
  addTodo(text) {
    this.todos.push({
      id: generateId(),
      text,
      completed: false
    });
  },
  
  setFilter(newFilter) {
    this.filter.set(newFilter);
  }
});

// Child component (todo-item)  
const createComponent = ({ findParent, data }) => ({
  getTodos() {
    return findParent('todo-list').todos;
  },
  
  toggleCompleted() {
    const todos = this.getTodos();
    todos.setProperty(data.todo.id, 'completed', !data.todo.completed);
  },
  
  remove() {
    this.getTodos().removeItem(data.todo.id);
  }
});

// Child component (todo-filter)
const createComponent = ({ findParent }) => ({
  setFilter(filter) {
    const parent = findParent('todo-list');
    parent.setFilter(filter);
  }
});
```

### Settings Reactivity Pattern

```javascript
const defaultSettings = {
  theme: 'light',
  size: 'medium',
  collapsible: true
};

const createComponent = ({ settings, reaction, $ }) => ({
  onCreated() {
    // React to setting changes
    reaction(() => {
      const theme = settings.theme; // Reactive access
      $(':host').attr('data-theme', theme);
    });
    
    reaction(() => {
      if (!settings.collapsible) {
        this.expandAll(); // Auto-expand if collapsible disabled
      }
    });
  },
  
  switchTheme() {
    // Modify settings - triggers reactions and template updates
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
  },
  
  updateSize(newSize) {
    settings.size = newSize;
    // Template automatically re-renders due to settings reactivity
  }
});

// Template automatically updates when settings change
```html
<div class="content {settings.theme} {settings.size}">
  Current theme: {theme}
  Current size: {size}
  {#if collapsible}
    <button class="toggle">Toggle</button>
  {/if}
</div>
```

### Deep Event Pattern (Parent-Child Components)

```javascript
// button-group (parent) listening to button (child) events
const events = {
  // Listen to clicks on child buttons
  'deep click ui-button': ({ target, data }) => {
    const buttonValue = data.value;
    this.selectButton(buttonValue);
  },
  
  // Listen to child component custom events
  'deep buttonselected ui-button': ({ data }) => {
    this.handleButtonSelection(data.value);
  }
};

// accordion (parent) listening to panel (child) events  
const events = {
  'deep toggle ui-accordion-panel': ({ target, data }) => {
    if (settings.exclusive) {
      this.closeOtherPanels(data.panelId);
    }
  }
};

// form (parent) listening to field (child) events
const events = {
  'deep valuechange ui-form-field': ({ data }) => {
    this.updateFieldValue(data.fieldName, data.newValue);
    this.validateField(data.fieldName);
  }
};
```

### Global Event Pattern

```javascript
const events = {
  // Page-level events
  'global scroll window': ({ self }) => {
    self.handleScroll();
  },
  
  'global hashchange window': ({ self }) => {
    self.updateFromHash();
  },
  
  'global resize window': ({ self }) => {
    self.recalculateLayout();
  },
  
  // Global keyboard shortcuts
  'global keydown document': ({ event, self }) => {
    if (event.key === 'Escape') {
      self.closeModal();
    }
  }
};
```

### Complex Loop with Filtering

```html
<!-- Filter and slice in template -->
{#each item in items.filter(i => i.active).slice(0, 10)}
  <div class="item">{item.name}</div>
{else}
  <div class="empty">No active items</div>
{/each}

<!-- Use helper method for complex logic -->
{#each item in getFilteredItems}
  <div class="item">{item.name}</div>
{/each}

<!-- Nested loops with custom index names -->
{#each category, catIndex in categories}
  <section class="category">
    <h2>{category.name}</h2>
    {#each item, itemIndex in category.items.slice(0, 5)}
      <div class="item" data-category="{catIndex}" data-item="{itemIndex}">
        {item.name}
      </div>
    {/each}
  </section>
{/each}
```

---

## Debugging Tips

### Settings Reactivity Debugging

```javascript
const createComponent = ({ settings, reaction }) => ({
  onCreated() {
    // Debug settings changes
    reaction(() => {
      console.log('Settings changed:', {
        theme: settings.theme,
        size: settings.size
      });
    });
  },
  
  debugSettings() {
    // Access settings proxy internals
    console.log('Settings vars:', this.settingsVars);
    console.log('Current settings:', settings);
  }
});
```

### Component Tree Debugging

```javascript
const createComponent = ({ findParent, getChildren }) => ({
  debugTree() {
    console.log('Parent:', findParent('*')); // Find any parent
    console.log('Children:', getChildren('*')); // Find all children
    
    // Walk up parent chain
    let current = this;
    let level = 0;
    while (current) {
      console.log(`Level ${level}:`, current.templateName);
      current = current.parentTemplate;
      level++;
    }
  }
});
```

### Event Debugging

```javascript
const events = {
  'click .debug': ({ event, target, data, isDeep }) => {
    console.log('Event details:', {
      event,
      target,          // Element matching selector
      eventTarget: event.target,  // Actual event target
      data,           // Converted data attributes
      isDeep,         // From nested component
      composedPath: event.composedPath()
    });
  },
  
  'deep click ui-button': ({ event, target, data }) => {
    console.log('Deep event from child button:', {
      childButton: target,
      buttonData: data
    });
  }
};
```

### Common Issues and Solutions

**Issue**: Settings changes not triggering reactions
```javascript
// ❌ Wrong: Not inside a reaction
console.log(settings.theme); // Just reads value, no dependency

// ✅ Correct: Inside reaction creates dependency
reaction(() => {
  console.log(settings.theme); // Reactive access
});
```

**Issue**: Deep events not firing
```javascript
// ❌ Wrong: Using deep for unrelated components
'deep click random-component': () => {}

// ✅ Correct: Using deep for intentional child components
'deep click ui-button': () => {}  // button-group → button
```

**Issue**: findParent not finding component
```javascript
// ❌ Wrong: Components not in parent-child relationship
findParent('unrelated-component') // Returns null

// ✅ Correct: Intentional parent-child relationship
findParent('button-group')        // button → button-group
```

**Issue**: Event target confusion
```javascript
const events = {
  'click .item': ({ event, target }) => {
    // target = element matching .item selector
    // event.target = actual element clicked (may be child of .item)
    console.log('Clicked .item:', target);
    console.log('Actually clicked:', event.target);
  }
};
```

---

**Source References:**
- API Documentation: `/docs/src/pages/api/`
- Template Documentation: `/docs/src/pages/templates/`
- Event Documentation: `/docs/src/pages/components/events.mdx`
- Component Examples: `/docs/src/examples/`
- Core Implementation: `/packages/`