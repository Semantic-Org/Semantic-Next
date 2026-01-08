---
title: Component Authoring Best Practices
description: Advanced patterns and best practices for implementing complex Semantic UI components, covering communication, state management, events, templates, reactivity, and performance.
keywords: [best practices, patterns, communication, state management, events, templates, performance]
audience: framework
type: doc
---

# Component Authoring Best Practices

> **For:** AI agents implementing complex component patterns and best practices
> **Prerequisites:** [Mental Model](/ai/framework/mental-model.md) and [Component Generation](./creating-components.md)
> **Related:** [Quick Reference](/ai/framework/quick-reference.md) • [HTML Guide](/ai/framework/html.md) • [CSS Guide](/ai/framework/css.md)
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## Table of Contents

- [Component Communication Patterns](#component-communication-patterns)
- [State Management Patterns](#state-management-patterns)
- [Event Handling Patterns](#event-handling-patterns)
- [Template Patterns](#template-patterns)
- [Reactivity Patterns](#reactivity-patterns)
- [Performance Patterns](#performance-patterns)
- [Architecture Patterns](#architecture-patterns)
- [Common Recipes](#common-recipes)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Migration Patterns](#migration-patterns)

---

## Component Communication Patterns

The framework provides three distinct patterns for communication. Choosing the correct one is essential for creating robust, maintainable components.

### Communication Pattern Decision Tree

```
How do your components need to relate to each other?

├── A child needs to notify its parent or the outside world?
│   └── **PRIMARY: Use Event-Driven Notifications with `dispatchEvent`**
│       ├── **Why?** Decoupled, reusable, standards-compliant. Child makes no assumptions.
│       ├── **Example:** Panel dispatches 'resizeStart', accordion-panel dispatches 'toggle'
│       └── **Pattern from:** src/components/panels/panel.js (events for notifications)

├── An external script needs to command a component?
│   └── **Use Direct API Access with `$('selector').component()`**
│       ├── **Why?** Imperative control from outside the component
│       ├── **Example:** Page script calling `modal.open()` or `form.validate()`
│       └── **Pattern:** External control, not parent-child communication

├── Parent-child system where parent coordinates multiple children?
│   └── **Use Hybrid: Events (primary) + findParent (secondary)**
│       ├── **Events for notifications:** Child tells parent something happened
│       ├── **findParent for actions:** Child asks parent to run multi-child coordination
│       ├── **Example:** Panel minimize → parent redistributes space across ALL panels
│       └── **Why hybrid:** Parent has algorithm to coordinate multiple children, not just one
```

### 1. Child → Parent Notification Pattern (`dispatchEvent`)

**Use when**: A child needs to notify its parent or external consumers of state changes, user interactions, or internal events. This is the **default and preferred** pattern.

```javascript
// Child component (ui-accordion-panel) dispatches a bubbling event
const createComponent = ({ dispatchEvent, state }) => ({
  toggle() {
    const wasOpen = state.isOpen.get();
    state.isOpen.toggle();

    // Notify any listener that this panel has toggled.
    // The event bubbles up the DOM tree.
    dispatchEvent('toggle', {
      panelId: this.id,
      isOpen: state.isOpen.get(),
      wasOpen
    });
  }
});

// Parent component (ui-accordion) listens using standard event delegation
const events = {
  // The 'deep' keyword ensures the listener works across Shadow DOM boundaries
  'deep toggle ui-accordion-panel': ({ data, self }) => {
    // data contains { panelId, isOpen, wasOpen }
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
  }
};
```

### 2. Imperative Control Pattern (`$('...').component()`)

**Use when**: An **external script** (outside the component's Shadow DOM) needs to call public methods on a component instance.

```javascript
// Child component (ui-counter) defines its public API in createComponent
const createComponent = ({ self, state, settings }) => ({
  // Public method
  setCounter(number) {
    state.counter.set(number);
  },
  // Another public method
  startCounter() {
    state.running.set(true);
    self.interval = setInterval(() => state.counter.increment(), 1000);
  },
  // Another public method
  stopCounter() {
    state.running.set(false);
    clearInterval(self.interval);
  },
});

// External script imperatively controls the component instance
import { $ } from '@semantic-ui/query';

// Get the component instance(s) from the DOM element(s)
const $counters = $('ui-counter');

// Call public methods on the instance.
// Note: A selector can return multiple components, so iterate if necessary.
$counters.each(component => {
  component.setCounter(100);
  component.stopCounter();
});
```

### 3. Parent-Child Coordination Pattern (Events + findParent Hybrid)

**Use when**: Building a **tightly-coupled system** like panels/tabs/accordions where parent manages children.

**PRIMARY: Use events for notifications** (child → parent)
**SECONDARY: Use findParent for actions** (child needs parent to do something complex)

```javascript
// Pattern from src/components/panels/panel.js + panels.js

// Child (ui-panel) - PRIMARILY dispatches events
const createComponent = ({ dispatchEvent, findParent, el, settings }) => ({
  startResize(event) {
    self.resizing.set(true);

    // ✅ PRIMARY: Event for notification
    dispatchEvent('resizeStart', {
      initialSize: self.getCurrentFlex(),
      direction: settings.direction,
      startPosition: self.getPointerPosition(event),
    });
  },

  endResize() {
    // ✅ PRIMARY: Event for notification
    dispatchEvent('resizeEnd', {
      initialSize: self.initialSize,
      finalSize: self.getCurrentFlex(),
    });
  },

  minimize() {
    settings.minimized = true;

    // ✅ SECONDARY: Call parent method for complex operation
    const panels = findParent('uiPanels');
    const index = panels.getPanelIndex(el);
    panels.setPanelMinimized(index);  // Parent handles resize algorithm
  }
});

// Parent (ui-panels) - listens to events, exposes methods for complex operations
const events = {
  // ✅ PRIMARY: Listen to child events
  'resizeStart ui-panel'({ self, event, data }) {
    if (inArray(event.target, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(event.target, data);
    }
  },

  'resizeEnd ui-panel'({ self, event, data }) {
    if (inArray(event.target, self.panels)) {
      self.removeDragStartCalculations();
      self.saveLayout();
    }
  }
};

const createComponent = ({ self }) => ({
  panels: [],

  // ✅ SECONDARY: Public method for complex operations
  setPanelMinimized(index) {
    let naturalSize = self.getNaturalPanelSize(index);
    // Complex: resize algorithm, constraints, coordination
    self.changePanelSize(index, relativeSize, { manualResize: true });
    self.saveLayout();
  }
});
```

**Decision tree**:
- Child notifies parent something happened → `dispatchEvent` ✅
- Parent needs complex multi-panel coordination → child calls parent method ✅
- Child just needs parent data → `findParent` for read-only access ✅

### Bi-directional Communication Pattern (Combined Approach)

**Use when**: A component system needs both notification and control pathways.

```javascript
// Parent (ui-form) uses both events and exposes a direct API
const createComponent = ({ signal, state }) => ({
  formData: signal({}),
  errors: signal({}),

  // Public API method for external control
  validate() {
    // ... validation logic ...
    return state.isValid.get();
  }
});

const events = {
  // Listens for notifications from children
  'valuechange ui-form-field': ({ data, self }) => {
    self.formData.setProperty(data.fieldName, data.value);
  }
};

// Child (ui-form-field) uses both dispatchEvent and can access parent via findParent
const createComponent = ({ findParent, dispatchEvent, state, self }) => ({
  // Notifies parent of value changes
  onValueChange(newValue) {
    dispatchEvent('valuechange', { fieldName: self.name, value: newValue });
  },

  // Can also access parent for shared configuration/state
  getParentConfig() {
    return findParent('ui-form').settings;
  }
});
```


---

## State Management Patterns

### Local Component State Pattern

**Use when**: State is only relevant to the individual component

```javascript
const defaultState = {
  isExpanded: false,
  animation: 'none',
  contentHeight: 0
};

const createComponent = ({ state }) => ({
  toggle() {
    state.isExpanded.toggle();
    state.animation.set('expanding');
  },

  onAnimationComplete() {
    state.animation.set('none');
  }
});
```

### Shared Parent-Child State Pattern

**Use when**: Multiple related components need to coordinate state, typically using the `findParent` pattern for tightly-coupled systems.

```javascript
// Parent exposes shared signals
const createComponent = ({ signal }) => ({
  selectedItems: signal(new Set()),
  selectionMode: signal('multiple'),

  toggleSelection(itemId) {
    const selected = this.selectedItems.get();
    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      if (this.selectionMode.get() === 'single') {
        selected.clear();
      }
      selected.add(itemId);
    }
    this.selectedItems.set(new Set(selected));
  }
});

// Children access parent's shared state
const createComponent = ({ findParent, reaction, state }) => ({
  onCreated() {
    const parent = findParent('item-list');

    reaction(() => {
      const isSelected = parent.selectedItems.get().has(this.id);
      state.selected.set(isSelected);
    });
  }
});
```

### Settings-Driven State Pattern

**Use when**: Component behavior changes based on configuration

```javascript
const defaultSettings = {
  mode: 'single',
  autoClose: true,
  duration: 300
};

const defaultState = {
  activeItems: []
};

const createComponent = ({ settings, state, reaction }) => ({
  onCreated() {
    // React to settings changes
    reaction(() => {
      if (settings.mode === 'single' && state.activeItems.get().length > 1) {
        // Auto-adjust state when settings change
        const firstItem = state.activeItems.get()[0];
        state.activeItems.set([firstItem]);
      }
    });
  },

  addActiveItem(item) {
    const current = state.activeItems.get();
    if (settings.mode === 'single') {
      state.activeItems.set([item]);
    } else {
      state.activeItems.set([...current, item]);
    }
  }
});
```

### Cross-Component State Synchronization Pattern

**Use when**: Distant components need to share state through a common ancestor, using `findParent`.

```javascript
// Top-level data provider
const createComponent = ({ signal }) => ({
  globalSelection: signal(new Set()),
  currentUser: signal(null),
  theme: signal('light'),

  updateSelection(items) {
    this.globalSelection.set(new Set(items));
  }
});

// Descendant components access shared state
const createComponent = ({ findParent, reaction }) => ({
  onCreated() {
    const app = findParent('app-shell');

    reaction(() => {
      const selected = app.globalSelection.get();
      this.updateUI(selected.has(this.itemId));
    });
  },

  selectItem() {
    const app = findParent('app-shell');
    const selection = new Set(app.globalSelection.get());
    selection.add(this.itemId);
    app.updateSelection(Array.from(selection));
  }
});
```

---

## Event Handling Patterns

### Event Delegation Pattern (Standard)

**Use when**: Handling events within your component's template

```javascript
const events = {
  // Handles all buttons, even dynamically added ones
  'click .action-button': ({ target, data, self }) => {
    const action = data.action;
    const itemId = data.itemId;
    self.performAction(action, itemId);
  },

  // Multiple event types on same elements
  'mouseenter, mouseleave .hover-item': ({ event, target, state }) => {
    const isEnter = event.type === 'mouseenter';
    state.hoveredItem.set(isEnter ? target.dataset.itemId : null);
  }
};
```

### Global Event Pattern

**Use when**: Responding to page-level events outside your component

```javascript
const events = {
  'global scroll window': ({ self }) => {
    self.updateScrollPosition();
  },

  'global resize window': ({ self, afterFlush }) => {
    self.recalculateLayout();
    afterFlush(() => {
      self.adjustChildPositions();
    });
  },

  'global keydown document': ({ event, self }) => {
    if (event.key === 'Escape' && self.isModalOpen()) {
      self.closeModal();
      event.preventDefault();
    }
  },

  'global hashchange window': ({ self }) => {
    self.syncWithURLHash();
  }
};
```

### Child Event Pattern (Parent-Child Components)

**Use when**: Parent component needs to listen to events from intentional child components across Shadow DOM boundaries.

```javascript
// Accordion managing panels
const events = {
  'toggle ui-accordion-panel': ({ data, self }) => {
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
    self.updateActiveCount();
  },

  'deep contentchange ui-accordion-panel': ({ data, self }) => {
    self.adjustPanelHeight(data.panelId, data.newHeight);
  }
};

// Button group managing buttons
const events = {
  'deep click ui-button': ({ target, data, self }) => {
    if (self.settings.selectionMode === 'single') {
      self.clearOtherSelections();
    }
    self.setSelected(data.buttonId, true);
  }
};
```

### Custom Event Chain Pattern

**Use when**: Creating a chain of custom events through component hierarchy

```javascript
// Child dispatches to parent
const createComponent = ({ dispatchEvent }) => ({
  onUserAction() {
    dispatchEvent('itemaction', {
      action: 'select',
      itemId: this.id,
      timestamp: Date.now()
    });
  }
});

// Parent processes and re-dispatches
const events = {
  'deep itemaction ui-list-item': ({ data, self }) => {
    self.processItemAction(data);

    // Re-dispatch for external listeners
    self.dispatchEvent('listchange', {
      type: 'itemaction',
      originalData: data,
      listId: self.id
    });
  }
};

// Grandparent handles final event
const events = {
  'deep listchange ui-list': ({ data, self }) => {
    self.updateGlobalState(data);
    self.logUserActivity(data);
  }
};
```

### Event Data Transformation Pattern

**Use when**: Converting data attributes to strongly typed event data

```html
<button
  class="quantity-btn"
  data-action="increment"
  data-item-id="123"
  data-amount="5"
  data-allow-negative="false"
>+</button>
```javascript
const events = {
  'click .quantity-btn': ({ data, self }) => {
    // data attributes auto-converted to proper types
    const { action, itemId, amount, allowNegative } = data;
    // amount = 5 (number), allowNegative = false (boolean)

    self.updateQuantity(itemId, action === 'increment' ? amount : -amount, allowNegative);
  }
};
```

---

## Template Patterns

### Conditional Rendering Pattern

```html
<!-- Progressive loading states -->
{#if loading}
  <div class="loading-spinner">Loading...</div>
{else if error}
  <div class="error-message">
    <h3>Error occurred</h3>
    <p>{error.message}</p>
    <button onclick="{retry}">Retry</button>
  </div>
{else if hasAny data}
  <div class="content">
    {#each item in data}
      <div class="item">{item.name}</div>
    {else}
      <div class="empty">No items to display</div>
    {/each}
  </div>
{else}
  <div class="empty-state">
    <h3>Welcome!</h3>
    <p>Get started by adding some items.</p>
    <button onclick="{showAddDialog}">Add Item</button>
  </div>
{/if}
```

### Dynamic Component Pattern

```html
<!-- Render different components based on data -->
{#each item in items}
  {#if item.type === 'text'}
    {>textComponent data=item}
  {else if item.type === 'image'}
    {>imageComponent data=item}
  {else if item.type === 'video'}
    {>videoComponent data=item}
  {else}
    {>unknownComponent data=item}
  {/if}
{/each}

<!-- Or use dynamic template name -->
{#each item in items}
  {>template name="{item.type}Component" data=item}
{/each}
```

### Snippet Composition Pattern

```html
<!-- Reusable UI patterns -->
{#snippet actionButton variant="primary"}
  <button class="ui button {variant}" onclick="{action}">
    {>slot icon}
    <span class="text">{>slot}</span>
  </button>
{/snippet}

{#snippet statusBadge}
  <span class="badge {status.toLowerCase()}">
    {status}
  </span>
{/snippet}

<!-- Usage in template -->
<div class="item-card">
  <h3>{title}</h3>
  <p>{description}</p>

  <div class="item-meta">
    {>statusBadge status=item.status}
    <span class="date">{formatDate item.createdAt}</span>
  </div>

  <div class="actions">
    {>actionButton variant="primary" action="{edit}"}
      <i class="edit icon">{>slot icon}</i>
      Edit
    {/actionButton}

    {>actionButton variant="secondary" action="{delete}"}
      <i class="trash icon">{>slot icon}</i>
      Delete
    {/actionButton}
  </div>
</div>
```

### Form Pattern with Validation

```html
<form class="ui form {#if errors}has-errors{/if}">
  {#each field in formFields}
    <div class="field {#if errors[field.name]}error{/if}">
      <label>{field.label}</label>

      {#if field.type === 'select'}
        <select
          name="{field.name}"
          value="{values[field.name]}"
          onchange="{updateField}"
        >
          {#each option in field.options}
            <option value="{option.value}">{option.label}</option>
          {/each}
        </select>
      {else if field.type === 'textarea'}
        <textarea
          name="{field.name}"
          value="{values[field.name]}"
          placeholder="{field.placeholder}"
          onchange="{updateField}"
        ></textarea>
      {else}
        <input
          type="{field.type || 'text'}"
          name="{field.name}"
          value="{values[field.name]}"
          placeholder="{field.placeholder}"
          onchange="{updateField}"
        />
      {/if}

      {#if errors[field.name]}
        <div class="error-message">{errors[field.name]}</div>
      {/if}
    </div>
  {/each}

  <div class="actions">
    <button
      type="submit"
      class="ui primary button"
      disabled="{!valid || submitting}"
      onclick="{submit}"
    >
      {#if submitting}Submitting...{else}Submit{/if}
    </button>
    <button type="button" onclick="{reset}">Reset</button>
  </div>
</form>
```

---

## Reactivity Patterns

### Derived State Pattern

```javascript
const createComponent = ({ state, reaction }) => ({
  onCreated() {
    // Computed properties that update automatically
    reaction(() => {
      const items = state.items.get();
      const filter = state.filter.get();

      const filtered = items.filter(item => {
        if (filter === 'completed') return item.completed;
        if (filter === 'active') return !item.completed;
        return true;
      });

      state.filteredItems.set(filtered);
      state.itemCount.set(filtered.length);
    });

    // Validation reaction
    reaction(() => {
      const values = state.formValues.get();
      const errors = this.validate(values);
      state.errors.set(errors);
      state.isValid.set(Object.keys(errors).length === 0);
    });
  }
});
```

### Reactive Settings Pattern

```javascript
const createComponent = ({ settings, state, reaction, $ }) => ({
  onCreated() {
    // React to settings changes
    reaction(() => {
      const theme = settings.theme;
      $(':host').attr('data-theme', theme);
    });

    reaction(() => {
      const size = settings.size;
      $(':host').toggleClass('compact', size === 'small');
    });

    // Auto-adjust state when settings change
    reaction(() => {
      if (settings.maxItems && state.items.get().length > settings.maxItems) {
        const trimmed = state.items.get().slice(0, settings.maxItems);
        state.items.set(trimmed);
      }
    });
  }
});
```

### External Data Synchronization Pattern

```javascript
const createComponent = ({ state, reaction, settings }) => ({
  onCreated() {
    // Sync with external API
    reaction(() => {
      const query = state.searchQuery.get();
      if (query.length > 2) {
        this.debounceSearch(query);
      }
    });

    // Sync with localStorage
    reaction(() => {
      const preferences = state.userPreferences.get();
      if (settings.persistPreferences) {
        localStorage.setItem('preferences', JSON.stringify(preferences));
      }
    });

    // Sync with URL
    reaction(() => {
      const filters = state.activeFilters.get();
      const params = new URLSearchParams();
      filters.forEach(filter => params.append('filter', filter));
      window.history.replaceState({}, '', `?${params}`);
    });
  }
});
```

### Performance Optimization Pattern

```javascript
const createComponent = ({ state, reaction, afterFlush }) => ({
  onCreated() {
    // Batch expensive operations
    reaction(() => {
      const items = state.items.get();
      const needsRecalc = state.needsRecalculation.get();

      if (needsRecalc) {
        afterFlush(() => {
          this.recalculateLayout();
          this.updatePositions();
          state.needsRecalculation.set(false);
        });
      }
    });

    // Debounced reactions
    let timeout;
    reaction(() => {
      const searchTerm = state.searchTerm.get();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, 300);
    });
  }
});
```

---

## Performance Patterns

### Production Pattern: Lifecycle-Managed Resources

The framework auto-cleans its own APIs. You only clean up native browser APIs.

```javascript
// From src/components/inpage-menu/inpage-menu.js

// ✅ Auto-cleanup (framework APIs)
createComponent: ({ attachEvent, reaction }) => ({
  initialize() {
    // Framework cleans up automatically
    attachEvent(window, 'hashchange', self.onHashChange);
    attachEvent(scrollElement, 'scroll', self.onScroll, { passive: true });

    reaction(() => {
      const theme = state.theme.get();
      updateTheme(theme);
    });  // Auto-disposed on component destroy
  }
})

// ❌ Manual cleanup required (native browser APIs)
createComponent: ({ self }) => ({
  observer: null,  // Component prop

  bindIntersectionObserver() {
    self.observer = new IntersectionObserver(self.onIntersection);
    sections.forEach(s => self.observer.observe(s));
  }
})

onDestroyed: ({ self }) => {
  // Must clean up native APIs
  if (self.observer) {
    self.observer.disconnect();
  }
}
```

### Production Pattern: Race Condition Prevention

Use component props (non-reactive flags) to prevent race conditions.

```javascript
// From src/components/inpage-menu/inpage-menu.js

createComponent: ({ self }) => ({
  isScrolling: false,  // Component prop (non-reactive flag)
  isActivating: false, // Component prop (non-reactive flag)

  scrollToPosition(position) {
    self.isScrolling = true;  // Set flag
    scrollContext.scrollTo({ top: position, behavior: 'smooth' });

    $(scrollContext).one('scrollend', () => {
      requestIdleCallback(() => {
        self.isScrolling = false;  // Clear flag
      });
    });
  },

  onIntersection(entries) {
    // Only update when NOT scrolling (prevents race)
    if (!self.isScrolling && newVisibleItems.length) {
      self.setActiveItem(newVisibleItems[0]);
    }
  }
})
```

**Why component props**: Non-reactive flags don't trigger re-renders. Just gate logic.

### Component Props for Non-Reactive Data

Use component props for caching and non-reactive tracking:

```javascript
// From src/components/panels/panels.js

const createComponent = ({ state, settings, self }) => ({
  // ✅ Component props - non-reactive, performance optimized
  panels: [],                           // Track child elements
  renderedPanels: [],                   // Initialization tracking
  cache: {                              // Computation cache
    groupSize: undefined,
    groupScrollOffset: undefined,
  },

  setGroupCalculations() {
    self.cache.groupSize = self.getGroupSize();
    self.cache.groupScrollOffset = self.getGroupScrollOffset();
  },

  removeGroupCalculations() {
    delete self.cache.groupSize;
    delete self.cache.groupScrollOffset;
  }
});
```

**Performance benefits**:
- No signal overhead for non-reactive data
- Direct property access (faster than `.get()/.set()`)
- Reduced memory usage
- Use for: tracking, flags, caches, timers, static config

### Lazy Loading Pattern

```javascript
const createComponent = ({ state, $, isClient }) => ({
  onRendered() {
    if (!isClient) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    $('.lazy-load').each((el) => {
      observer.observe(el);
    });
  },

  async loadContent(element) {
    const src = element.dataset.src;
    try {
      const content = await fetch(src).then(r => r.text());
      element.innerHTML = content;
      element.classList.add('loaded');
    } catch (error) {
      element.classList.add('error');
    }
  }
});
```

### Virtual Scrolling Pattern

```javascript
const createComponent = ({ state, reaction, $ }) => ({
  onCreated() {
    reaction(() => {
      const items = state.allItems.get();
      const scrollTop = state.scrollTop.get();
      const containerHeight = state.containerHeight.get();
      const itemHeight = 50; // Fixed height

      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );

      state.visibleItems.set(items.slice(startIndex, endIndex));
      state.offsetY.set(startIndex * itemHeight);
    });
  },

  onScroll(event) {
    state.scrollTop.set(event.target.scrollTop);
  }
});
```

### Memory Management Pattern

```javascript
const createComponent = ({ state, reaction }) => ({
  observers: new Set(),
  timers: new Set(),

  onCreated() {
    // Track external resources for cleanup
    const observer = new MutationObserver(this.handleMutation);
    this.observers.add(observer);

    const timer = setInterval(this.updateTime, 1000);
    this.timers.add(timer);
  },

  onDestroyed() {
    // Cleanup external resources
    this.observers.forEach(observer => observer.disconnect());
    this.timers.forEach(timer => clearInterval(timer));
    this.observers.clear();
    this.timers.clear();
  }
});
```

---

## Architecture Patterns

### Component Composition Pattern

```javascript
// Base component
const createBaseComponent = ({ state, settings }) => ({
  // Common functionality
  show() { state.visible.set(true); },
  hide() { state.visible.set(false); },
  toggle() { state.visible.toggle(); }
});

// Extended component
const createComponent = ({ state, settings, ...args }) => ({
  ...createBaseComponent({ state, settings, ...args }),

  // Extended functionality
  slideDown() {
    this.show();
    // Add slide animation
  }
});
```

### Plugin Pattern

```javascript
// Core component
const createComponent = ({ state, settings, plugins = [] }) => ({
  // Core functionality

  onCreated() {
    // Initialize plugins
    plugins.forEach(plugin => {
      if (plugin.onCreated) {
        plugin.onCreated.call(this);
      }
    });
  }
});

// Plugin definition
const draggablePlugin = {
  onCreated() {
    this.makeDraggable();
  },

  makeDraggable() {
    // Add drag functionality
  }
};

// Usage
defineComponent({
  createComponent: ({ ...args }) => createComponent({
    ...args,
    plugins: [draggablePlugin]
  })
});
```

### Factory Pattern

```javascript
// Component factory
const createListComponent = (config) => {
  const defaults = {
    itemComponent: 'ui-list-item',
    selectionMode: 'multiple',
    sortable: false
  };

  const settings = { ...defaults, ...config };

  return defineComponent({
    defaultSettings: settings,

    createComponent: ({ state, settings }) => ({
      addItem(item) {
        state.items.push({
          ...item,
          component: settings.itemComponent
        });
      }
    })
  });
};

// Usage
const todoList = createListComponent({
  itemComponent: 'todo-item',
  selectionMode: 'none',
  sortable: true
});
```

---

## Common Recipes

### Modal Dialog Pattern

```javascript
const defaultState = {
  isOpen: false,
  content: null,
  backdrop: true
};

const createComponent = ({ state, $, dispatchEvent }) => ({
  open(content) {
    state.content.set(content);
    state.isOpen.set(true);
    $('body').addClass('modal-open');

    dispatchEvent('modalopen');
  },

  close() {
    state.isOpen.set(false);
    $('body').removeClass('modal-open');

    dispatchEvent('modalclose');
  }
});

const events = {
  'click .backdrop': ({ self, state }) => {
    if (state.backdrop.get()) {
      self.close();
    }
  },

  'global keydown document': ({ event, self, state }) => {
    if (event.key === 'Escape' && state.isOpen.get()) {
      self.close();
    }
  }
};
```

### Drag and Drop Pattern

```javascript
const createComponent = ({ state, $, dispatchEvent }) => ({
  onRendered() {
    this.makeDraggable();
  },

  makeDraggable() {
    let dragData = null;

    $('.draggable').on('dragstart', (event) => {
      dragData = {
        id: event.target.dataset.id,
        type: event.target.dataset.type
      };
      event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    });

    $('.drop-zone').on('dragover', (event) => {
      event.preventDefault();
    });

    $('.drop-zone').on('drop', (event) => {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      dispatchEvent('itemdropped', {
        item: data,
        dropZone: event.target.dataset.zone
      });
    });
  }
});
```

### Infinite Scroll Pattern

```javascript
const createComponent = ({ state, $, settings }) => ({
  onRendered() {
    const sentinel = $('.scroll-sentinel');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !state.loading.get()) {
        this.loadMore();
      }
    });

    observer.observe(sentinel[0]);
  },

  async loadMore() {
    if (state.hasMore.get()) {
      state.loading.set(true);

      try {
        const newItems = await this.fetchItems(state.page.get());
        state.items.push(...newItems);
        state.page.increment();
        state.hasMore.set(newItems.length === settings.pageSize);
      } finally {
        state.loading.set(false);
      }
    }
  }
});
```

---

## Anti-Patterns to Avoid

### ❌ Unnecessary Getter Methods for Template Data

```javascript
// DON'T DO THIS - Redundant getter methods
const createComponent = ({ state, settings }) => ({
  // These are anti-patterns - data is already available in templates
  getTheme() { return settings.theme; },           // settings.theme already available
  getCurrentValue() { return state.value.get(); }, // value already available
  getApiUrl() { return settings.apiEndpoint; },    // apiEndpoint already available
  isOpen() { return state.open.get(); },          // open already available
});
```html
<!-- DON'T DO THIS -->
<div class="{getTheme}">                <!-- Unnecessary method call -->
  Current value: {getCurrentValue}      <!-- Unnecessary method call -->
  API: {getApiUrl}                      <!-- Unnecessary method call -->
  {#if isOpen}Content{/if}              <!-- Unnecessary method call -->
</div>
```

**Why this is wrong**: Template data context already provides direct access to all component data.

```html
<!-- DO THIS INSTEAD - Direct access in templates -->
<div class="{theme}">                    <!-- settings.theme -->
  Current value: {value}                 <!-- state.value -->
  API: {apiEndpoint}                     <!-- settings.apiEndpoint -->
  {#if open}Content{/if}                 <!-- state.open -->
</div>
```

**When to create getter methods**: Only for external API access or complex logic:

```javascript
// DO THIS - Only when providing external API or complex logic
const createComponent = ({ state, settings }) => ({
  // ✅ GOOD - External API for query library access
  getCurrentSelection() {
    return state.items.get().filter(item => item.selected);
  },

  // ✅ GOOD - Complex logic not suitable for templates
  getFormData() {
    return {
      values: state.values.get(),
      isValid: this.validateAll()
    };
  }
});

// External access via query library
const component = $('my-component').getComponent();
const selection = component.getCurrentSelection(); // ✅ Useful external API
```

### ❌ Direct DOM Manipulation Without Reactivity

```javascript
// DON'T DO THIS
const createComponent = ({ $ }) => ({
  updateCount(count) {
    $('.counter').text(count); // Direct DOM update
  }
});

// DO THIS INSTEAD
const defaultState = { count: 0 };
// Template: <span class="counter">{count}</span>
const createComponent = ({ state }) => ({
  updateCount(count) {
    state.count.set(count); // Reactive update
  }
});
```

### ❌ Global State Instead of Component Tree

```javascript
// DON'T DO THIS
import { globalStore } from './store.js';

const createComponent = () => ({
  getData() {
    return globalStore.data; // Global dependency
  }
});

// DO THIS INSTEAD
const createComponent = ({ findParent }) => ({
  getData() {
    return findParent('data-provider').data.get(); // Component tree
  }
});
```

### ❌ Breaking Event Delegation

```javascript
// DON'T DO THIS
const createComponent = ({ $ }) => ({
  onRendered() {
    $('.dynamic-button').on('click', this.handler); // Won't work for dynamic content
  }
});

// DO THIS INSTEAD
const events = {
  'click .dynamic-button': ({ self }) => self.handler() // Event delegation
};
```

### ❌ Ignoring Lifecycle for Cleanup

```javascript
// DON'T DO THIS
const createComponent = () => ({
  startTimer() {
    setInterval(this.update, 1000); // Never cleaned up
  }
});

// DO THIS INSTEAD
const createComponent = () => ({
  timers: new Set(),

  startTimer() {
    const timer = setInterval(this.update, 1000);
    this.timers.add(timer);
  },

  onDestroyed() {
    this.timers.forEach(timer => clearInterval(timer));
  }
});
```

### ❌ Mixing Reactive and Non-Reactive Patterns

```javascript
// DON'T DO THIS
const createComponent = ({ state }) => ({
  updateData(data) {
    state.items.value.push(data); // Mutating without reactivity
    this.rerenderManually();
  }
});

// DO THIS INSTEAD
const createComponent = ({ state }) => ({
  updateData(data) {
    state.items.push(data); // Reactive mutation
  }
});
```

### ❌ Overusing findParent/findChild

```javascript
// DON'T DO THIS for decoupled components
const createComponent = ({ findParent }) => ({
  onClick() {
    const parent = findParent('some-container');
    parent.doSomething(); // Creates tight coupling
  }
});

// DO THIS INSTEAD for decoupled components
const createComponent = ({ dispatchEvent }) => ({
  onClick() {
    dispatchEvent('action'); // Loose coupling
  }
});
```

---

## Migration Patterns

### From jQuery to Semantic UI

```javascript
// jQuery pattern
$('.button').on('click', function() {
  $(this).addClass('active');
  $('#counter').text(parseInt($('#counter').text()) + 1);
});

// Semantic UI pattern
const defaultState = { counter: 0 };

const events = {
  'click .button': ({ target, state, $ }) => {
    $(target).addClass('active');
    state.counter.increment();
  }
};

// Template: <span id="counter">{counter}</span>
```

### From React to Semantic UI

```javascript
// React pattern
const [count, setCount] = useState(0);
const [items, setItems] = useState([]);

const addItem = (item) => {
  setItems(prev => [...prev, item]);
  setCount(prev => prev + 1);
};

// Semantic UI pattern
const defaultState = {
  count: 0,
  items: []
};

const createComponent = ({ state }) => ({
  addItem(item) {
    state.items.push(item);
    state.count.increment();
  }
});
```

### From Vue to Semantic UI

```javascript
// Vue pattern
export default {
  data() {
    return { message: 'Hello' };
  },
  computed: {
    reversed() {
      return this.message.split('').reverse().join('');
    }
  }
};

// Semantic UI pattern
const defaultState = { message: 'Hello' };

const createComponent = ({ state, reaction }) => ({
  onCreated() {
    reaction(() => {
      const reversed = state.message.get().split('').reverse().join('');
      state.reversed.set(reversed);
    });
  }
});
```

---

**Source References:**
- Component Examples: `/docs/src/examples/`
- Event Documentation: `/docs/src/pages/components/events.mdx`
- API Documentation: `/docs/src/pages/api/`
- Implementation: `/packages/`
