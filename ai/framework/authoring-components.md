---
title: Web Component Authoring Guide
description: Self-contained reference for creating custom web components using defineComponent(), covering templates, state management, events, CSS, and common patterns.
keywords: [component authoring, defineComponent, templates, state, events, CSS, patterns]
audience: framework
type: doc
---

# Semantic UI Web Component Authoring Guide

> **For:** AI agents building websites using Semantic UI's component framework
> **Purpose:** Self-contained reference for creating custom web components with `defineComponent()`
> **Prerequisites:** Install per https://next.semantic-ui.com/ui/start/install
> **Last Updated:** 2025-12-21

---

## Component Definition Pattern

Every component follows this structure:

```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultSettings = {
  // Configuration passed via attributes - REACTIVE everywhere
  theme: 'light',
  size: 'medium',
  disabled: false
};

const defaultState = {
  // Internal reactive data that changes during lifecycle
  isOpen: false,
  currentValue: '',
  items: []
};

const createComponent = ({ self, state, settings, $, $$, reaction, dispatchEvent }) => ({
  // Component methods

  getValue() {
    return state.currentValue.get();
  },

  setValue(newValue) {
    state.currentValue.set(newValue);
  },

  // CRITICAL: Use self.methodName() for internal calls
  getDisplayText() {
    const value = self.getValue();  // NOT this.getValue()
    return `Current: ${value}`;
  }
});

const events = {
  // Standard event delegation
  'click .button'({ self, data }) {
    self.handleClick(data);
  },

  // Deep: Listen to child web components
  'deep click ui-button'({ self, data }) {
    self.handleButtonClick(data);
  },

  // Global: Page-level events
  'global keydown body'({ event, self }) {
    if (event.key === 'Escape') self.close();
  }
};

const onCreated = ({ state, settings, reaction }) => {
  // Before DOM ready - setup reactions, initialize state
  state.items.set(settings.initialItems || []);
};

const onRendered = ({ self, $, isClient }) => {
  // DOM ready - browser-only setup
  if (isClient) {
    $('.auto-focus').focus();
  }
};

const onDestroyed = ({ self }) => {
  // Cleanup external resources (timers, observers)
  if (self.observer) self.observer.disconnect();
};

export const MyComponent = defineComponent({
  tagName: 'my-component',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
  onCreated,
  onRendered,
  onDestroyed
});
```

### File Organization

Components use a three-file pattern:
- `component.js` - Definition with `defineComponent()`
- `component.html` - Template with reactive expressions
- `component.css` - Scoped styles (Shadow DOM)

---

## CRITICAL RULES

These are the most common mistakes. Follow them exactly:

| Rule | Correct | Wrong |
|------|---------|-------|
| Method calls | `self.methodName()` | `this.methodName()` |
| Query variables | `const $button = $('.btn')` | `const button = $('.btn')` |
| Class names | `.large`, `.primary` | `.size-large`, `.btn-primary` |
| CSS values | `var(--spacing)` | `16px` |
| HTML attributes | `showlabel="true"` | `showLabel="true"` |

---

## Template Syntax

### Expressions
```html
<!-- Direct variable access (state, settings, methods all available) -->
<div class="{theme}">{currentValue}</div>
<span>{getDisplayText}</span>
```

### Conditionals
```html
{#if isOpen}
  <div class="content">Open content</div>
{else if isLoading}
  <div class="loader">Loading...</div>
{else}
  <div class="closed">Closed</div>
{/if}
```

### Loops
```html
<!-- Each...in syntax (recommended) -->
{#each item in items}
  <div class="item" data-index="{index}">
    {item.name} - {item.value}
  </div>
{else}
  <div class="empty">No items</div>
{/each}

<!-- Direct property access -->
{#each users}
  <div>{name} - {email}</div>
{/each}
```

### Slots
```html
<!-- Default slot -->
<div class="wrapper">{>slot}</div>

<!-- Named slots -->
<header>{>slot header}</header>
<main>{>slot}</main>
<footer>{>slot footer}</footer>
```

### Sub-templates
```html
{>itemTemplate data=item index=index}
```

### Class Binding
```html
<div class="{classMap getMenuStates}">...</div>
```
```javascript
getMenuStates() {
  return {
    visible: state.visible.get(),
    active: state.active.get()
  };
}
```

---

## State & Reactivity

### State vs Settings

| Use | For |
|-----|-----|
| `settings` | Configuration from attributes, reactive, rarely changes |
| `state` | Internal data that changes during component lifecycle |

### Reading & Writing State
```javascript
// Reading
const value = state.counter.get();
const value = state.counter.value;  // property access

// Writing
state.counter.set(5);
state.counter.value = 5;

// Built-in helpers
state.counter.increment(1);      // Numbers
state.isVisible.toggle();        // Booleans
state.items.push(newItem);       // Arrays
state.user.setProperty('name', 'Alice');  // Objects
```

### Settings (Always Reactive)
```javascript
// Direct assignment triggers reactivity
settings.theme = 'dark';
settings.size = 'large';

// In templates - automatic updates
// {theme} updates when settings.theme changes
```

### Reactions
```javascript
const onCreated = ({ state, settings, reaction }) => {
  // Derived state
  reaction(() => {
    const items = state.items.get();
    const filter = state.filter.get();
    state.filteredItems.set(items.filter(i => i.type === filter));
  });

  // React to settings changes
  reaction(() => {
    if (settings.maxItems && state.items.get().length > settings.maxItems) {
      state.items.set(state.items.get().slice(0, settings.maxItems));
    }
  });
};
```

### Non-Reactive Reads
```javascript
// Use .peek() when you don't want to create dependencies
const currentValue = state.someValue.peek();
```

---

## Event Handling

### Event Types

```javascript
const events = {
  // STANDARD: Within component's Shadow DOM
  'click .action-button'({ self, target, data, event }) {
    self.handleAction(data.actionType);
  },

  // DEEP: Child web components (crosses Shadow DOM)
  'deep toggle ui-accordion-panel'({ self, data }) {
    self.handlePanelToggle(data);
  },

  // GLOBAL: Outside component (window, document, body)
  'global scroll window'({ self }) {
    self.updateScrollPosition();
  },

  // MULTIPLE EVENTS
  'mouseenter, mouseleave .hover-item'({ event, state }) {
    state.isHovered.set(event.type === 'mouseenter');
  }
};
```

### Data Attribute Conversion
```html
<button data-item-id="123" data-amount="5" data-active="true">
```
```javascript
'click button'({ data }) {
  // Automatic type conversion:
  // data.itemId = "123" (string)
  // data.amount = 5 (number)
  // data.active = true (boolean)
}
```

### Dispatching Events
```javascript
const createComponent = ({ dispatchEvent }) => ({
  selectItem(item) {
    // dispatchEvent bubbles by default
    dispatchEvent('itemSelected', { item, timestamp: Date.now() });
  }
});
```

---

## CSS Essentials

### Shadow DOM Scoping
```css
/* Simple class names - no namespacing needed */
:host {
  display: block;
  --component-height: 2rem;
}

.container {
  display: flex;
  padding: var(--spacing);

  .header {
    font-size: var(--large);
    font-weight: var(--bold);
  }
}
```

### Design Tokens (Use These)
```css
/* Spacing */
padding: var(--spacing);
margin: var(--compact-spacing);
gap: var(--relaxed-spacing);

/* Typography */
font-size: var(--small);
font-size: var(--large);
font-weight: var(--bold);

/* Colors */
color: var(--text-color);
background: var(--primary-color);
border-color: var(--positive-color);

/* Effects */
border-radius: var(--border-radius);
transition: var(--transition);
```

### Semantic Class Variations
```css
/* Size variations */
.small { --component-height: 1.5rem; }
.medium { --component-height: 2rem; }
.large { --component-height: 2.5rem; }

/* Color variations */
.primary { --component-color: var(--primary-color); }
.success { --component-color: var(--positive-color); }
.danger { --component-color: var(--negative-color); }
```

### Theme-Aware Styling
```css
:host {
  color: var(--text-color);
  background: var(--background-color);
}
/* Tokens automatically adapt to light/dark themes */
```

### Animations
```css
.modal {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.2s ease;
}

.modal.visible {
  opacity: 1;
  transform: scale(1);
}

@starting-style {
  .modal.visible {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

---

## Using First-Party UI Primitives

When building components, use Semantic UI primitives instead of raw HTML:

```html
<!-- INSIDE your custom component's template -->

<!-- Instead of <button> -->
<ui-button primary large>Submit</ui-button>

<!-- Instead of <input> -->
<ui-input type="text" placeholder="Enter value..." />

<!-- Instead of custom card markup -->
<ui-card>
  <ui-icon icon="user" />
  <span>{userName}</span>
</ui-card>
```

Available primitives: `ui-button`, `ui-card`, `ui-container`, `ui-divider`, `ui-icon`, `ui-image`, `ui-input`, `ui-label`, `ui-menu`, `ui-modal`, `ui-rail`, `ui-segment`, `ui-table`

---

## Common Patterns

### Form Handling
```javascript
const defaultState = {
  values: {},
  errors: {}
};

const createComponent = ({ state, dispatchEvent }) => ({
  updateField(fieldName, value) {
    state.values.setProperty(fieldName, value);
  },

  validate() {
    const errors = {};
    const values = state.values.get();
    if (!values.email) errors.email = 'Required';
    state.errors.set(errors);
    return Object.keys(errors).length === 0;
  },

  submit() {
    if (self.validate()) {
      dispatchEvent('submit', { values: state.values.get() });
    }
  }
});

const events = {
  'input .field'({ data, value, state }) {
    state.values.setProperty(data.fieldName, value);
  }
};
```

### Modal Dialog
```javascript
const defaultState = {
  isOpen: false
};

const createComponent = ({ state, $, dispatchEvent }) => ({
  open() {
    state.isOpen.set(true);
    dispatchEvent('open');
  },

  close() {
    state.isOpen.set(false);
    dispatchEvent('close');
  }
});

const events = {
  'click .backdrop'({ self }) {
    self.close();
  },

  'global keydown body'({ event, self, state }) {
    if (event.key === 'Escape' && state.isOpen.get()) {
      self.close();
    }
  }
};
```

### List with Items
```javascript
const defaultSettings = {
  items: []
};

const defaultState = {
  selectedIndex: -1
};

const createComponent = ({ state, settings, dispatchEvent }) => ({
  selectItem(index) {
    state.selectedIndex.set(index);
    dispatchEvent('select', {
      item: settings.items[index],
      index
    });
  }
});
```
```html
{#each item in items}
  <div
    class="item {#if index === selectedIndex}selected{/if}"
    data-index="{index}"
  >
    {item.name}
  </div>
{/each}
```

### Parent-Child Communication
```javascript
// Child dispatches events
const createComponent = ({ dispatchEvent }) => ({
  toggle() {
    dispatchEvent('toggle', { isOpen: state.isOpen.get() });
  }
});

// Parent listens
const events = {
  'deep toggle child-component'({ data, self }) {
    self.handleChildToggle(data);
  }
};
```

---

## Query Usage

```javascript
const createComponent = ({ $, $$ }) => ({
  // $ for single element, $$ for multiple
  // ALWAYS prefix variables with $

  highlightFirst() {
    const $firstItem = $('.item');
    $firstItem.addClass('highlighted');
  },

  clearAll() {
    const $allItems = $$('.item');
    $allItems.removeClass('active');
  },

  getComponent() {
    const $child = $('child-component');
    return $child.component();  // Access child's API
  }
});
```

---

## Lifecycle Summary

| Hook | When | Use For |
|------|------|---------|
| `onCreated` | Before DOM | Setup reactions, initialize state |
| `onRendered` | DOM ready | Focus, measurements, external libs |
| `onDestroyed` | Cleanup | Clear timers, disconnect observers |

---

## Documentation

- **Installation**: https://next.semantic-ui.com/ui/start/install
- **Component API**: https://next.semantic-ui.com/docs/api/component/define-component
- **Template Syntax**: https://next.semantic-ui.com/docs/guides/templates
- **Reactivity**: https://next.semantic-ui.com/docs/guides/reactivity
- **Events**: https://next.semantic-ui.com/docs/guides/components/events
