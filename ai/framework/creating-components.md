---
title: Creating Components Guide
description: Comprehensive guide to creating Semantic UI components - from basics to advanced patterns
keywords: [components, defineComponent, state, templates, events, lifecycle]
audience: framework
skill: creating-components
---

# Creating Semantic UI Components

> **The definitive reference for building Semantic UI web components**
>
> This guide covers everything from basic component structure to advanced patterns observed in production components. It combines framework documentation with real-world patterns from `/src/components/`.

---

## Quick Start

### Minimal Component

```javascript
import { defineComponent } from '@semantic-ui/component';

export const MyComponent = defineComponent({
  tagName: 'my-component',
  template: `<div class="container">{message}</div>`,
  css: `:host { display: block; }`,
  defaultState: { message: 'Hello World' }
});
```

### Production Component Structure

Real components use separate files for maintainability:

```
my-component/
  index.js          # Re-exports for clean imports
  my-component.js   # Component definition
  my-component.html # Template
  my-component.css  # Styles
```

**Example from `src/components/panels/panel.js`:**

```javascript
import { defineComponent } from '@semantic-ui/component';
import css from './panel.css?raw';
import template from './panel.html?raw';

const Panel = defineComponent({
  tagName: 'ui-panel',
  template,
  css,
  defaultSettings,
  createComponent,
  events,
});

export default Panel;
export { Panel };
```

---

## Component Definition API

### Complete `defineComponent` Options

```javascript
defineComponent({
  // Identity
  tagName: 'my-component',        // Custom element name (optional for templates-only)
  plural: true,                   // Component manages multiple children

  // Content
  template,                       // HTML template string
  css,                           // Scoped CSS string
  pageCSS,                       // CSS attached to document (for Light DOM)

  // Data
  defaultSettings: {},           // Public reactive configuration
  defaultState: {},              // Internal reactive state

  // Composition
  subTemplates: {},              // Child template components

  // Logic
  createComponent: () => ({}),   // Instance methods and properties
  events: {},                    // Event handlers
  keys: {},                      // Keyboard shortcuts

  // Lifecycle
  onCreated: () => {},           // After initialization, before DOM
  onRendered: () => {},          // After DOM is ready
  onDestroyed: () => {},         // Cleanup when removed
});
```

### Callback Arguments

Every callback receives a destructured object with these properties:

```javascript
{
  // Component Instance
  self,              // The component instance (use for method calls)
  el,                // The DOM element

  // Reactive Data
  state,             // Internal signals (use .get()/.set() in JS)
  settings,          // Public config (reactive proxy - direct access)

  // Reactivity Utilities
  signal,            // Create signals: signal(initialValue)
  reaction,          // Create reactive computations
  afterFlush,        // Run after DOM updates complete

  // DOM Querying
  $,                 // Query within component (no shadow piercing)
  $$,                // Deep query (pierces shadow DOM)

  // Component Tree
  findParent,        // Navigate up: findParent('parent-tag')
  findChild,         // Navigate down: findChild('child-tag')
  getChild,          // Get child by index
  getChildren,       // Get all children of type

  // Events
  dispatchEvent,     // Emit custom events (bubbles by default)
  attachEvent,       // Manually attach events
  bindKey,           // Dynamic key binding
  unbindKey,         // Remove key binding

  // Environment
  isClient,          // true in browser
  isServer,          // true during SSR
  isRendered,        // Function: check if component is rendered
}
```

**Event handlers receive additional arguments:**

```javascript
{
  event,             // Native event object
  target,            // Element matching selector (not event.target)
  data,              // data-* attributes + event.detail (auto-converted)
  value,             // Input value (for input events)
  isDeep,            // true if from nested component
}
```

---

## State and Settings

### Settings: Public Reactive Configuration

Settings are for **public configuration** that external code can change:

```javascript
const defaultSettings = {
  theme: 'light',
  size: 'medium',
  disabled: false,
  items: [],
  onSelect: null,    // Callback functions work too
};
```

**Settings are reactive everywhere - no `.get()`/`.set()` needed:**

```javascript
// Direct assignment triggers reactivity
settings.theme = 'dark';

// In reactions, creates dependency
reaction(() => {
  console.log(settings.theme);  // Re-runs when theme changes
});

// In templates - automatic reactivity
// <div class="{theme}">  updates when settings.theme changes
```

**Real pattern from `src/components/panel.js`:**

```javascript
const defaultSettings = {
  direction: 'vertical',
  resizable: true,
  minSize: '0px',
  maxSize: '0px',
  size: 'grow',
  label: '',
  canMinimize: true,
  minimized: false,
  // Function settings for complex behavior
  getNaturalSize: (panel, { direction, minimized }) => {
    return panel?.component.getNaturalSize(panel, { direction, minimized });
  },
};
```

### State: Internal Reactive Data

State is for **internal data** that changes during the component lifecycle:

```javascript
const defaultState = {
  isOpen: false,
  currentValue: '',
  selectedIndex: 0,
  items: [],
  errors: {},
};
```

**State uses explicit signal API in JavaScript:**

```javascript
// Reading
const value = state.counter.get();
const value = state.counter.value;

// Writing
state.counter.set(5);
state.counter.value = 5;

// Built-in helpers
state.counter.increment(1);      // Numbers
state.counter.decrement(1);
state.isOpen.toggle();           // Booleans
state.counter.clear();           // Reset to default
state.counter.now();             // Set to current Date

// Array helpers
state.items.push(item);
state.items.removeItem(item);
state.items.setProperty(id, 'done', true);

// Object helpers
state.user.setProperty('name', 'Alice');
state.user.setProperties({ name: 'Bob', age: 30 });
```

**In templates, state is automatically unwrapped:**

```html
<!-- No .get() needed in templates -->
<div>{counter}</div>
<div class="{isOpen ? 'open' : 'closed'}">
```

### Component Props: Non-Reactive Instance Data

For data that doesn't need reactivity, add properties directly to the component instance:

**Real pattern from `src/components/panels/panels.js`:**

```javascript
const createComponent = ({ self, el, settings, $ }) => ({
  // Non-reactive tracking data
  panels: [],
  renderedPanels: [],

  // Cache for performance
  cache: {
    groupSize: undefined,
    groupScrollOffset: undefined,
    resizeStart: undefined,
    resizeIndex: undefined,
  },

  // Methods access via self
  setGroupCalculations() {
    self.cache.groupSize = self.getGroupSize();
    self.cache.groupScrollOffset = self.getGroupScrollOffset();
  },
});
```

**Real pattern from `src/components/inpage-menu/inpage-menu.js`:**

```javascript
const createComponent = ({ self, state, ... }) => ({
  observer: null,           // IntersectionObserver instance
  lastScrollPosition: 0,    // Scroll tracking
  isScrolling: false,       // Race condition prevention
  isActivating: false,      // State flag
  scrollingDown: false,     // Direction tracking
  // ...
});
```

**Use component props for:**
- DOM references and observers
- Timers and intervals
- Caches and memoized values
- Non-reactive flags for race condition prevention
- Static configuration

---

## Templates

### Template Data Context

Templates receive a **flattened data context** - you access everything at the top level:

```javascript
// In component logic
state.counter.get()        // Explicit
settings.theme             // Through proxy
self.getDisplayText()      // Method call

// In templates - everything is flat
{counter}                  // state.counter (auto-unwrapped)
{theme}                    // settings.theme
{getDisplayText}           // self.getDisplayText() (auto-invoked)
```

### Expression Syntax

```html
<!-- Variable interpolation -->
{variableName}
{user.name}
{settings.theme}

<!-- Method calls - both styles work -->
{formatDate date 'YYYY-MM-DD'}     <!-- Lisp style -->
{formatDate(date, 'YYYY-MM-DD')}   <!-- JS style -->

<!-- JavaScript expressions -->
{items.filter(i => i.active).length}
{items.slice(0, 5)}

<!-- HTML output (unescaped) -->
{#html richTextContent}
```

### Conditionals

```html
{#if condition}
  <div>True content</div>
{else if otherCondition}
  <div>Alternative</div>
{else}
  <div>Default</div>
{/if}

<!-- With expressions -->
{#if items.length > 0}
  <div>Has {items.length} items</div>
{/if}

<!-- Inline in attributes -->
<div class="{#if active}active{/if} {#if large}large{/if}">
```

### Loops

```html
<!-- Named variable (recommended) -->
{#each item in items}
  <div>{item.name} - Index: {index}</div>
{else}
  <div>No items</div>
{/each}

<!-- Direct property access -->
{#each users}
  <div>{name} - {email}</div>
{/each}

<!-- Custom index name -->
{#each item, i in items}
  <div>#{i}: {item.name}</div>
{/each}

<!-- Object iteration -->
{#each value, key in object}
  <div>{key}: {value}</div>
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

### Slots and Sub-templates

```html
<!-- Default slot -->
{>slot}

<!-- Named slots -->
{>slot header}
{>slot content}

<!-- Sub-template with data -->
{>templateName data=item index=index}

<!-- Template-as-settings pattern -->
{>template name=rowTemplate data=row}
```

**Real pattern from `src/components/panels/panel.html`:**

```html
<div class="{classMap getClassMap}{direction} panel" part="panel">
  {#if label}
    <span class="self label">
      {label}
      <div class="actions">
        {#if canMinimize}
          {#if minimized}
            <ui-icon link maximize class="toggle-size"></ui-icon>
          {else}
            <ui-icon link minus class="toggle-size"></ui-icon>
          {/if}
        {/if}
      </div>
    </span>
  {/if}
  {>slot}
</div>
{#if notEqual getIndex 0}
  <span class="{classMap getHandleClassMap}handle" part="handle">
    <span class="divider"></span>
  </span>
{/if}
```

### Boolean Attributes

**Quoting determines behavior:**

```html
<!-- Unquoted: Attribute removed if falsy -->
<input checked={isChecked} />
<!-- Result when false: <input /> -->

<!-- Quoted: Always outputs as string -->
<div data-count="{count}">
<!-- Result when count=0: <div data-count="0"> -->
```

### Class Binding with classMap

```javascript
// In createComponent
getClassMap() {
  return {
    active: state.isActive.get(),
    disabled: settings.disabled,
    large: settings.size === 'large',
  };
}
```

```html
<div class="{classMap getClassMap}other-class">
```

---

## Event Handling

### Event Binding Strategies

```javascript
const events = {
  // Standard: Event delegation within component
  'click .button': ({ self, data }) => {
    self.handleClick(data);
  },

  // Multiple events on same selector
  'mouseenter, mouseleave .item': ({ event, state }) => {
    state.hovered.set(event.type === 'mouseenter');
  },

  // Deep: Parent listening to child component events
  'deep click ui-button': ({ data }) => {
    // Child button clicked
  },

  // Global: Events outside component
  'global scroll window': ({ self }) => {
    self.updatePosition();
  },

  'global hashchange window': ({ self }) => {
    self.syncWithURL();
  },

  // Component-wide (no selector)
  'mouseover': ({ state }) => {
    state.hovered.set(true);
  },
};
```

### Dispatching Events

```javascript
const createComponent = ({ dispatchEvent }) => ({
  selectItem(item) {
    dispatchEvent('itemSelected', {
      item,
      timestamp: Date.now()
    });
    // Events bubble by default
  }
});
```

**Real pattern from `src/components/panels/panel.js`:**

```javascript
startResize(event) {
  self.resizing.set(true);
  self.initialSize = self.getCurrentFlex();

  dispatchEvent('resizeStart', {
    initialSize: self.initialSize,
    direction: settings.direction,
    startPosition: self.getPointerPosition(event),
  });
  // ... mouse event handling
},

endResize() {
  // ... cleanup
  dispatchEvent('resizeEnd', {
    initialSize: self.initialSize,
    finalSize: self.getCurrentFlex(),
  });
}
```

**Parent listening (from `src/components/panels/panels.js`):**

```javascript
const events = {
  'resizeStart ui-panel'({ self, event, data }) {
    const panel = event.target;
    if (inArray(panel, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(panel, data);
    }
  },

  'resizeDrag ui-panel'({ self, event, data }) {
    const panel = event.target;
    if (inArray(panel, self.panels)) {
      requestAnimationFrame(() => {
        self.setPointerCalculations(panel, data);
        self.resizePanels(self.cache.resizeIndex, self.cache.resizeDelta);
        self.setEndPointerCalculations();
      });
    }
  },
};
```

### Keyboard Shortcuts

```javascript
const keys = {
  'up'({ self, state }) {
    if (!state.modalOpen.get()) return;
    self.selectPrevious();
  },

  'down'({ self, state }) {
    if (!state.modalOpen.get()) return;
    self.selectNext();
  },

  'enter'({ self, state }) {
    if (!state.modalOpen.get()) return;
    self.visitResult();
  },

  'ctrl + k'({ self }) {
    self.openModal();
  },
};
```

**Dynamic key binding from `src/components/global-search/global-search.js`:**

```javascript
const createComponent = ({ self, bindKey, settings }) => ({
  initialize() {
    bindKey(settings.openKey, self.openModal);
  },
});
```

---

## Lifecycle Hooks

### Execution Order

1. Component constructor
2. Settings/State initialization
3. `createComponent()` - returns instance methods
4. `onCreated()` - component initialized, no DOM yet
5. Template compilation and rendering
6. `onRendered()` - DOM is ready
7. Component lifetime...
8. `onDestroyed()` - cleanup before removal

### onCreated

Use for initialization logic before DOM is available:

```javascript
const onCreated = ({ self, state, settings, reaction }) => {
  // Initialize state from settings
  state.theme.set(settings.defaultTheme);

  // Setup reactions
  reaction(() => {
    if (state.count.get() > 10) {
      state.warning.set(true);
    }
  });
};
```

**Real pattern from `src/components/theme-switcher/theme-switcher.js`:**

```javascript
const onCreated = function({ self, state, isClient }) {
  state.theme.set(self.getLocalTheme());
  if (isClient) {
    self.calculateTheme();
  }
};
```

### onRendered

Use for DOM manipulation and browser-only setup:

```javascript
const onRendered = ({ self, $, isClient, settings }) => {
  if (!isClient) return;

  self.bindPageEvents();
  self.calculateScrollHeight();

  if (settings.useAccordion) {
    el.setAttribute('accordion', '');
  }
};
```

**Real pattern from `src/components/inpage-menu/inpage-menu.js`:**

```javascript
const onRendered = function({ self, isServer, settings }) {
  if (isServer || !settings.menu.length) {
    return;
  }
  self.bindPageEvents();
  self.calculateScrollHeight();
};
```

### onDestroyed

Use for cleanup of **external resources only** (framework cleans up its own APIs):

```javascript
const onDestroyed = function({ self, isServer }) {
  if (isServer) return;

  // Clean up external resources
  if (self.observer) {
    self.observer.disconnect();
  }

  // Clear timers
  self.timers.forEach(timer => clearInterval(timer));
};
```

---

## Reactivity

### Creating Reactions

Reactions automatically re-run when their dependencies change:

```javascript
const createComponent = ({ state, reaction, afterFlush }) => ({
  initialize() {
    // Basic reaction
    reaction(() => {
      const value = state.searchQuery.get();
      if (value.length > 2) {
        self.performSearch(value);
      }
    });

    // Reaction with cleanup
    reaction(() => {
      const items = state.items.get();
      afterFlush(() => {
        self.measureLayout();
      });
    });
  }
});
```

**Real pattern from `src/components/global-search/global-search.js`:**

```javascript
async calculateResults() {
  reaction(async (reaction) => {
    const rawResults = state.rawResults.get();
    const startIndex = state.resultOffset.get();
    const endIndex = startIndex + settings.resultsPerPage;

    if (reaction.firstRun) {
      return;
    }

    const results = await Promise.all(
      rawResults.results.slice(startIndex, endIndex).map(r => r.data())
    );
    state.results.set(results);
    // ...
  });
}
```

### Creating Signals

Create additional signals for complex state:

```javascript
const createComponent = ({ signal }) => ({
  resizing: signal(false),
  initialized: signal(false),

  startResize() {
    self.resizing.set(true);
  }
});
```

### Performance Optimization

```javascript
// Non-reactive read (no dependency created)
const value = state.counter.peek();

// Non-reactive execution block
Reaction.nonreactive(() => {
  // Code here doesn't track dependencies
  state.counter.set(5);
});

// Run after all DOM updates
afterFlush(() => {
  self.measureLayout();
});
```

---

## Component Communication

### Pattern 1: Events (Primary - Decoupled)

**Child dispatches, parent listens:**

```javascript
// Child component
const createComponent = ({ dispatchEvent }) => ({
  toggle() {
    state.isOpen.toggle();
    dispatchEvent('toggle', {
      isOpen: state.isOpen.get()
    });
  }
});

// Parent component
const events = {
  'toggle ui-accordion-panel': ({ data, self }) => {
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
  }
};
```

### Pattern 2: Direct API Access (Imperative Control)

**External code calling component methods:**

```javascript
// External script
const component = $('my-component').component();
component.publicMethod();

// Or via query
$('ui-modal').component().show();
$('ui-modal').find('.search input').focus();
```

### Pattern 3: Parent-Child Coordination (Tightly Coupled)

**For component systems designed to work together:**

```javascript
// Child (ui-panel) calls parent for complex operations
minimize() {
  const panels = findParent('uiPanels');
  const index = panels.getPanelIndex(el);
  panels.setPanelMinimized(index);  // Parent handles algorithm
},

// Parent (ui-panels) discovers and manages children
addPanels() {
  let $childPanelGroups = $(el).find('ui-panels');
  let $childPanelGroupPanels = $childPanelGroups.find('ui-panel');
  let $allPanels = $(el).find('ui-panel');
  let $panels = $allPanels.not($childPanelGroupPanels);
  self.panels = $panels.get();
}
```

### Communication Decision Tree

```
Child needs to notify parent?
  └── Use dispatchEvent (events bubble up)

Parent needs to command child?
  └── Use $('child').component().method()

Tightly coupled system (like panels)?
  └── Events for notifications + findParent for complex operations

Distant components need shared state?
  └── Navigate to common ancestor via findParent
```

---

## DOM Querying

### $ vs $$

```javascript
const createComponent = ({ $, $$ }) => ({
  // $ - Query within component (no shadow crossing)
  updateLocal() {
    const $button = $('.button');
    $button.addClass('active');
  },

  // $$ - Deep query (crosses shadow DOM)
  findGlobal() {
    const $dropdowns = $$('ui-dropdown');
    $$('iframe').one('pointerenter', self.handleIframe);
  },
});
```

**CRITICAL: Always prefix query variables with `$`:**

```javascript
// Correct
const $button = $('.button');
const $items = $$('.item');

// Wrong
const button = $('.button');
```

### Query Options

```javascript
// Disable shadow piercing for specific query
$('.panels', { pierceShadow: false }).scrollTop();

// Query from document root
$(settings.scrollContext, { root: document }).get(0);
```

### Component Access

```javascript
// Get component instance
const component = $('ui-dropdown').component();
component.setValue('new-value');

// Configure component
$('ui-panel').settings({
  theme: 'dark',
  collapsible: true
});

// Access data context
const context = $('ui-dropdown').dataContext();
```

---

## CSS Architecture

### Shadow DOM Scoping

CSS is automatically scoped - use simple class names:

```css
/* No namespacing needed */
:host {
  display: block;
}

.container {
  padding: var(--spacing);
}

.button {
  background: var(--primary-color);
}

/* State classes */
.active { }
.disabled { }
.large { }
```

### Design Tokens

Always use design tokens instead of hardcoded values:

```css
:host {
  /* Component-specific custom properties */
  --panel-handle-height: 14px;
  --panel-divider-width: 1px;
}

.label {
  font-size: var(--small);           /* Design token */
  font-weight: var(--bold);          /* Design token */
  color: var(--text-color);          /* Design token */
  transition: var(--transition);     /* Design token */
}
```

### Class Naming Convention

```css
/* Correct: Simple, semantic names */
.small { }
.medium { }
.large { }
.primary { }
.success { }

/* Wrong: Prefixed names */
.size-small { }     /* Don't do this */
.theme-primary { }  /* Don't do this */
```

### Real CSS Pattern

**From `src/components/panels/panel.css`:**

```css
:host {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  overflow: hidden;
  container: panel / inline-size;
}

:host {
  --panel-handle-height: 14px;
  --panel-divider-width: 1px;
  --panel-label-font-weight: var(--bold);
  --panel-label-padding: 0.75rem;
  --panel-divider-color: var(--solid-border-color);
}

.panel {
  display: contents;

  .label {
    display: flex;
    font-weight: var(--panel-label-font-weight);
    padding: var(--panel-label-padding);

    &.active {
      color: var(--panel-label-active-color);
    }
  }

  &.minimized {
    .label {
      background: var(--panel-label-minimized-background);
    }
  }
}

.handle {
  display: flex;
  position: absolute;
  z-index: 10;

  &.disabled {
    pointer-events: none;
  }

  &:hover .divider {
    background-color: var(--panel-divider-color-hover);
  }
}
```

---

## Common Patterns from Production Components

### Race Condition Prevention

**From `src/components/inpage-menu/inpage-menu.js`:**

```javascript
const createComponent = ({ self }) => ({
  isScrolling: false,      // Flag to prevent intersection updates
  isActivating: false,     // Flag to prevent scroll events

  scrollToPosition(position) {
    self.isScrolling = true;  // Set flag

    $(scrollContext).one('scrollend', () => {
      requestIdleCallback(() => {
        self.isScrolling = false;  // Clear flag
      });
    });

    scrollContext.scrollTo({ top: position, behavior: 'smooth' });
  },

  onIntersection(entries) {
    // Only update when NOT scrolling
    if (!self.isScrolling && newVisibleItems.length) {
      self.setActiveItem(newVisibleItems[0]);
    }
  }
});
```

### External Resource Cleanup

```javascript
const createComponent = ({ self, attachEvent }) => ({
  observer: null,

  bindIntersectionObserver() {
    self.observer = new IntersectionObserver(self.onIntersection);
    sections.forEach(s => self.observer.observe(s));
  },

  unbindPageEvents() {
    if (self.observer) {
      self.observer.disconnect();
    }
  }
});

const onDestroyed = ({ self }) => {
  self.unbindPageEvents();
};
```

### Initialization with Dynamic Keys

**From `src/components/global-search/global-search.js`:**

```javascript
const createComponent = ({ self, bindKey, isServer, settings }) => ({
  initialize() {
    if (isServer) return;

    bindKey(settings.openKey, self.openModal);
    self.calculateResults();
    self.calculateLoadSearch();
  },
});
```

### Async Reactions

```javascript
async calculateLoadSearch() {
  reaction(async (reaction) => {
    try {
      const { Instance } = await import('@pagefind/modular-ui');
      this.search = new Instance({
        bundlePath: settings.bundlePath,
      });
      // Setup handlers...
    } catch (error) {
      console.warn('Search disabled:', error);
    }
    reaction.stop();  // One-time initialization
  });
}
```

### Menu/List Filtering

**From `src/components/nav-menu/nav-menu.js`:**

```javascript
filterBySearchTerm(menu = [], searchTerm = state.searchTerm.get()) {
  if (!searchTerm) return menu;

  const matches = (a = '') => a.toLowerCase().includes(searchTerm.toLowerCase());

  return menu.reduce((acc, section) => {
    const sectionMatches = matches(section.name);

    if (sectionMatches) {
      acc.push({
        ...section,
        highlight: self.highlightMatch(section.name, searchTerm)
      });
    }
    // ... recursive filtering
    return acc;
  }, []);
},

highlightMatch(text, searchTerm) {
  const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (index === -1) return text;

  return {
    before: text.substring(0, index),
    match: text.substring(index, index + searchTerm.length),
    after: text.substring(index + searchTerm.length)
  };
}
```

### Scroll Into View

```javascript
scrollIntoView(index) {
  if (!isRendered()) return;

  const element = $('.results .result').get(index);
  const container = $('.results').get(0);
  if (!element) return;

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const notOnPage = elementRect.top < containerRect.top ||
                    elementRect.bottom > containerRect.bottom;

  if (notOnPage) {
    element.scrollIntoView({ block: 'nearest' });
  }
}
```

---

## Anti-Patterns to Avoid

### Using `this` Instead of `self`

```javascript
// Wrong
const createComponent = () => ({
  getDisplayText() {
    return this.getValue();  // Won't work
  }
});

// Correct
const createComponent = ({ self }) => ({
  getDisplayText() {
    return self.getValue();  // Works
  }
});
```

### Calling `.get()` in Templates

```html
<!-- Wrong - breaks reactivity tracking -->
{state.counter.get()}

<!-- Correct - auto-unwrapped -->
{counter}
```

### Destructuring Settings (Loses Reactivity)

```javascript
// Wrong - static value
const { theme } = settings;

// Correct - reactive
const theme = settings.theme;
```

### Hardcoded CSS Values

```css
/* Wrong */
.label {
  font-size: 0.75rem;
  color: #495057;
}

/* Correct */
.label {
  font-size: var(--small);
  color: var(--text-color);
}
```

### Prefixed Class Names

```css
/* Wrong */
.size-large { }
.theme-primary { }

/* Correct */
.large { }
.primary { }
```

### Missing $ Prefix on Query Variables

```javascript
// Wrong
const button = $('.button');

// Correct
const $button = $('.button');
```

### Unnecessary Getter Methods

```javascript
// Wrong - redundant, data is already in template context
getTheme() { return settings.theme; }
getCurrentValue() { return state.value.get(); }

// Correct - only create getters for complex logic or external API
getFormData() {
  return {
    values: state.values.get(),
    isValid: self.validateAll()
  };
}
```

---

## Critical Rules Summary

1. **Use `self.methodName()`** for internal method calls, not `this.methodName()`

2. **Use design tokens** (`var(--spacing)`) instead of hardcoded values

3. **Use simple class names** (`.large`, `.primary`) not prefixed names

4. **Prefix query variables** with `$` (`const $button = $('.button')`)

5. **Settings are reactive** - direct assignment triggers updates

6. **State uses signals** - call `.get()` in JS, automatic in templates

7. **Clean up external resources** in `onDestroyed` (framework handles its own APIs)

8. **Use `dispatchEvent`** for child-to-parent communication

9. **Use first-party components** (`ui-button`, `ui-icon`) instead of raw HTML

10. **Check `isClient`/`isServer`** before browser-only code

---

## Related Documentation

- [Mental Model](/ai/framework/mental-model.md) - Core concepts and architecture
- [Best Practices](/ai/framework/best-practices.md) - Advanced patterns and communication
- [HTML Guide](/ai/framework/html.md) - Markup conventions
- [CSS Guide](/ai/framework/css.md) - Styling architecture
- [Design Tokens](/ai/framework/design-tokens.md) - Token system

---

**Canonical Examples:**
- `/docs/src/examples/todo-list/` - Parent-child communication
- `/docs/src/examples/component/complex/accordion/` - Deep events
- `/src/components/panels/` - Complex coordination
- `/src/components/global-search/` - Async patterns, keyboard handling
- `/src/components/inpage-menu/` - Intersection observer, scroll handling
