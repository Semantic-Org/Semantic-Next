# Semantic UI Query System Guide

> **For:** AI agents working with DOM querying and manipulation in Semantic UI  
> **Purpose:** Comprehensive reference for the Query package and component debugging  
> **Prerequisites:** Basic understanding of DOM and Shadow DOM concepts  
> **Related:** [Mental Model](../foundations/mental-model.md) • [Component Guide](../guides/component-generation-instructions.md) • [Quick Reference](../foundations/quick-reference.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## Table of Contents

- [Core Query Concepts](#core-query-concepts)
- [Shadow DOM Traversal Strategy](#shadow-dom-traversal-strategy)
- [Component Instance Access](#component-instance-access)
- [Component Debugging Workflow](#component-debugging-workflow)
- [Event System Integration](#event-system-integration)
- [Performance Considerations](#performance-considerations)
- [Advanced Query Patterns](#advanced-query-patterns)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Core Query Concepts

### The Dual Query System

Semantic UI provides two entry points for DOM querying, each with distinct capabilities:

```javascript
import { $, $$ } from '@semantic-ui/query';

// Standard DOM querying (respects Shadow DOM boundaries)
$('button')              // Finds buttons in light DOM only
$('ui-dropdown')         // Finds dropdown components, but not their internal structure

// Deep querying (pierces Shadow DOM boundaries)  
$$('button')             // Finds buttons in light AND shadow DOM
$$('ui-dropdown .item')  // Finds .item elements inside dropdown's shadow DOM
```

**Mental Model**: Think of `$` as "CSS selectors" and `$$` as "CSS selectors that understand web components."

### Query Instance Architecture

Every Query instance contains:

```javascript
const $elements = $('div');

// Core properties
$elements.length         // Number of matched elements
$elements.selector       // Original selector used
$elements.options        // Query configuration (root, pierceShadow)
$elements[0], $elements[1] // Array-like access to elements

// Chaining system
$elements.find('.child')  // Returns new Query instance
$elements.chain([newEl])  // Create Query with specific elements
```

### Query Options and Configuration

```javascript
// Root scoping
$('button', { root: shadowRoot })           // Query within specific root
$('input', { root: document.getElementById('form') })

// Shadow DOM piercing
$('button', { pierceShadow: true })         // Equivalent to $$('button')

// Component-scoped querying
const dropdown = $('ui-dropdown').get(0);
$('button', { root: dropdown.shadowRoot }); // Query inside component
```
```

### $$ - Deep DOM Querying

The `$$` function performs deep querying that crosses Shadow DOM boundaries, essential for component-aware applications.

```javascript
import { $$ } from '@semantic-ui/query';

// Cross Shadow DOM boundaries
$$('.button')                   // Finds .button in light DOM AND shadow DOMs
$$('ui-dropdown .option')       // Finds .option inside ui-dropdown components
$$('#modal .close-btn')         // Deep search across all shadow roots

// Same element creation as $
$$('<div>Content</div>')        // Create elements (same as $)
$$(existingElements)            // Wrap elements (same as $)
```

**Key Difference**: `$$` pierces through Shadow DOM boundaries while `$` stops at shadow roots.

### Query Class

The `Query` class is the underlying implementation that both `$` and `$$` return.

```javascript
import { Query } from '@semantic-ui/query';

// Direct instantiation
const query = new Query('.selector', {
  root: document,               // Root element to search from
  pierceShadow: false,          // Whether to cross Shadow DOM boundaries
  prevObject: null              // Previous query object for chaining
});
```

## Query Methods Overview

The Query class provides a comprehensive set of methods organized into logical categories:

### Basic Operations
- `length` - Number of matched elements
- `get(index)` - Get element at index
- `eq(index)` - Get new Query object with element at index
- `first()`, `last()` - Get first/last element as new Query

### DOM Traversal
- `find(selector)` - Find descendants
- `parent(selector)` - Get parent elements
- `children(selector)`, `siblings(selector)` - Get child/sibling elements
- `next(selector)`, `prev(selector)` - Get adjacent siblings
- `closest(selector, options)` - Find closest ancestor matching selector, optionally all ancestors
- `closestAll(selector)` - Find all ancestor elements matching selector

### Content Manipulation
- `html()`, `html(content)` - Get/set innerHTML
- `text()`, `text(content)` - Get/set textContent
- `val()`, `val(value)` - Get/set form element values
- `append(content)`, `prepend(content)` - Add content to elements
- `insertBefore(selector)`, `insertAfter(selector)` - Insert elements relative to targets
- `before(content)`, `after(content)` - Insert content before/after elements (aliases)

### Attribute/Property Management
- `attr(name)`, `attr(name, value)` - Get/set attributes
- `removeAttr(name)` - Remove attributes
- `prop(name)`, `prop(name, value)` - Get/set properties

### CSS and Styling
- `css(property)`, `css(property, value)` - Get/set CSS properties
- `cssVar(variable, value)` - Get/set CSS custom properties
- `computedStyle(property)` - Get computed styles
- `addClass(classes)`, `removeClass(classes)`, `toggleClass(classes)` - Manage CSS classes
- `hasClass(className)` - Check for CSS class

### Event Handling
- `on(event, selector, handler)` - Event delegation
- `off(event, handler)` - Remove event listeners
- `trigger(event, data)` - Trigger events
- `dispatchEvent(event, data, settings)` - Dispatch custom events
- `one(event, handler)` - One-time event listener

### Dimensions and Positioning
- `width(value)`, `height(value)` - Get/set dimensions
- `scrollWidth(value)`, `scrollHeight(value)` - Get/set scroll dimensions
- `scrollTop(value)`, `scrollLeft(value)` - Get/set scroll position
- `offsetParent(options)` - Get offset parent for positioning
- `naturalWidth()`, `naturalHeight()` - Get natural dimensions

### Component Integration (Semantic UI specific)
- `settings(newSettings)` - Configure component settings
- `setting(name, value)` - Get/set individual component settings
- `initialize(settings)` - Initialize component before DOM insertion
- `component()` - Get component instance
- `dataContext()` - Get component's data context for debugging

## Component-Aware Methods

These methods are specifically designed for working with Semantic UI web components:

### .settings() - Runtime Configuration

Use `.settings()` to configure or update a component instance that is already live in the DOM and has been fully initialized by the framework. This method interacts with the component's reactive settings system.

Update component settings after the component is in the DOM:

```javascript
// Configure dropdown component
$('ui-dropdown').settings({
  items: getDropdownItems(),
  onSelect: handleSelection,
  maxItems: 10,
  searchable: true
});

// Update form validation
$('ui-form').settings({
  validationRules: newRules,
  onValidate: validationHandler,
  showErrors: true
});
```

### .initialize() - Pre-DOM Configuration

This method is primarily intended for setting complex, non-serializable properties on a component's DOM element *before* it is fully processed and upgraded by the framework, or shortly after it's added to the DOM (akin to applying properties around `DOMContentLoaded`). If the component instance is already live and fully interactive, prefer using `.settings()` for configuration changes.

Configure components before they're processed by the browser:

```javascript
// Create and initialize before adding to DOM
const container = $('#container');
container.html('<ui-data-table></ui-data-table>');

container.find('ui-data-table').initialize({
  dataProvider: () => fetchData(),
  columns: columnDefinitions,
  onRowClick: handleRowClick,
  sortable: true
});
```

### .component() - Direct Component Access

Get direct access to the component's **instance object**. This instance object is the value returned by the component's `createComponent` function and is also available as `self` within the component's own methods and lifecycle hooks. This allows you to call public methods defined on the component or interact with its exposed parts programmatically.

```javascript
const modalInstance = $('ui-modal').component();

// Call component methods directly (these are methods returned by createComponent)
modalInstance.open();
modalInstance.setContent(newContent);

// Access component state (if explicitly exposed on the instance,
// or via state signals if the instance provides direct access to them).
// Note: Direct state manipulation like this should be done cautiously.
// Prefer calling methods on the instance if they achieve the same result.
if (modalInstance.state && modalInstance.state.isOpen) { // Example: Check if 'state' is exposed
  const isOpen = modalInstance.state.isOpen.get();
  modalInstance.state.title.set('New Title');
}
```

### .dataContext() - Debug Component State

Access component's internal state for debugging:

```javascript
const context = $('ui-form').dataContext();

console.log('Current state:', context.state);
console.log('Settings:', context.settings);
console.log('Available methods:', Object.keys(context.self));
console.log('Element:', context.el);
```

## Advanced DOM Querying

### Shadow DOM Traversal

```javascript
// Standard query stops at shadow boundaries
$('ui-dropdown .option').length;           // 0 (can't cross shadow DOM)

// Deep query crosses shadow boundaries  
$$('ui-dropdown .option').length;          // 5 (finds options inside shadow DOM)

// Specific component targeting
$$('ui-modal .close-button');              // Finds close buttons in modal components
$$('ui-form input[type="text"]');          // Finds text inputs in form components
```

### Custom Root Elements

```javascript
// Query within specific containers
const modal = $('ui-modal').get(0);
const inputs = new Query('input', { root: modal });

// Pierce shadow DOM from specific root
const deepInputs = new Query('input', { 
  root: modal, 
  pierceShadow: true 
});
```

### Ancestral Traversal Patterns

```javascript
// Find the closest ancestor
$('.item').closest('.container');                 // Single closest container

// Find all matching ancestors
$('.item').closestAll('.container');              // All container ancestors
$('.item').closest('.container', { returnAll: true }); // Equivalent syntax

// Cross Shadow DOM boundaries
$$('.shadow-item').closestAll('.container');      // Find containers across shadow DOM

// Working with multiple elements
$('.multiple-items').closestAll('.shared-ancestor'); // Automatically deduplicates
```

### Element Creation and Manipulation

```javascript
// Create complex HTML structures
const form = $(`
  <ui-form>
    <div class="field">
      <label>Name</label>
      <input type="text" name="name">
    </div>
    <button type="submit">Submit</button>
  </ui-form>
`);

// Add to DOM and configure
$('#container').append(form);
form.settings({
  onSubmit: handleSubmit,
  validation: validationRules
});
```

## Event Handling Patterns

### Basic Event Binding

```javascript
// Direct event binding
$('.button').on('click', function(event) {
  console.log('Button clicked:', this);
});

// Event delegation (handles dynamic content)
$('#container').on('click', '.dynamic-button', function(event) {
  console.log('Dynamic button clicked:', this);
});
```

### Component Event Handling

```javascript
// Listen to component events
$('ui-accordion').on('panel-opened', function(event) {
  console.log('Panel opened:', event.detail);
});

// Multiple event types
$('ui-dropdown').on('selection-changed item-added', function(event) {
  console.log('Dropdown event:', event.type, event.detail);
});
```

### Global Event Management

```javascript
// Window/document events
$('window').on('resize', function() {
  console.log('Window resized');
});

$('document').on('keydown', function(event) {
  if (event.key === 'Escape') {
    $('.modal').component().close();
  }
});
```

## Chaining and Utility Methods

### Method Chaining

```javascript
// Query-style chaining
$('.items')
  .addClass('processed')
  .find('.button')
  .on('click', handleClick)
  .css('color', 'blue')
  .end();                   // Return to previous selection (.items)
```

### Iteration and Filtering

```javascript
// Iterate over elements
$('.item').each(function(index, element) {
  console.log(`Item ${index}:`, element);
});

// Filter elements
$('.item')
  .filter('.active')        // Keep only active items
  .addClass('highlighted');

// Complex filtering
$('.item').filter(function(index, element) {
  return $(element).data('priority') > 5;
});
```

### Content and Data Operations

```javascript
// Work with content
$('.title').text('New Title');
$('.container').html('<p>New content</p>');

// HTML data attributes via attr()
$('.item').attr('data-id', '123');
const itemId = $('.item').attr('data-id');

// Form values
$('input[name="email"]').val('user@example.com');
const email = $('input[name="email"]').val();
```

## Global Management

### Export to Global Scope

```javascript
import { exportGlobals } from '@semantic-ui/query';

// Make $ and $$ available globally
exportGlobals();
// Now $ and $$ are available on window object

// Selective export
exportGlobals({ 
  dollar: true,           // Export $ to window.$
  doubleDollar: false,    // Don't export $$
  query: true             // Export Query class to window.Query
});
```

### Restore Previous Globals

```javascript
import { restoreGlobals } from '@semantic-ui/query';

// Restore original $ and $$ values
restoreGlobals();

// Also remove Query class
restoreGlobals({ removeQuery: true });
```

### Custom Aliases

```javascript
import { useAlias } from '@semantic-ui/query';

// Create custom alias
const jQ = useAlias;
const select = useAlias;

// Use with same functionality as $
jQ('.button').addClass('styled');
select('#modal').component().open();
```

## Performance Considerations

### Efficient Querying

```javascript
// Cache frequently used selectors
const buttons = $('.button');
const modals = $$('ui-modal');

// Use specific selectors
$('#specific-id .child');        // Better than $('.child')
$('.container > .direct-child'); // Better than $('.container .child')

// Limit search scope
const form = $('#user-form');
const inputs = form.find('input'); // Search within form only
```

### Shadow DOM Performance

```javascript
// Use $ when you don't need to cross Shadow DOM
const lightDOMButtons = $('.button');        // Faster

// Use $$ only when necessary
const allButtons = $$('.button');             // Slower, but finds all buttons

// Target specific components
const dropdownOptions = $$('ui-dropdown .option'); // More targeted
```

## Integration Patterns

### With Semantic UI Components

```javascript
// Component lifecycle integration
function setupUserInterface() {
  // Create and configure components
  $('#app').html(`
    <ui-header></ui-header>
    <ui-sidebar></ui-sidebar>
    <ui-main-content></ui-main-content>
  `);
  
  // Configure each component
  $$('ui-header').settings({
    title: 'My Application',
    showUser: true
  });
  
  $$('ui-sidebar').settings({
    items: navigationItems,
    collapsible: true
  });
}
```

### With External Libraries

```javascript
// Integration with other DOM libraries
function integrateWithLibrary() {
  // Get raw DOM elements for external libraries
  const chartContainer = $('#chart').get(0);
  new ExternalChart(chartContainer, chartOptions);
  
  // Use query methods alongside external libraries
  $('#chart').addClass('chart-loaded');
}
```

## Common Use Cases

1. **Component Configuration**: Use `.settings()` and `.initialize()` for component setup
2. **Cross-Shadow DOM Queries**: Use `$$` to find elements inside web components
3. **Event Delegation**: Handle events on dynamic content with proper delegation
4. **DOM Manipulation**: Create, modify, and manage DOM content
5. **Form Handling**: Manage form elements and validation
6. **Animation Integration**: Coordinate with CSS transitions and animations
7. **Component Communication**: Access component methods and state

## Key Principles

1. **Shadow DOM Awareness**: Choose `$` vs `$$` based on whether you need to cross shadow boundaries
2. **Component Integration**: Use component-specific methods for web component interaction
3. **Event Delegation**: Use delegation for dynamic content and better performance
4. **Method Chaining**: Leverage chaining for concise and readable code
5. **Scope Limiting**: Limit query scope for better performance
6. **Global Management**: Manage global namespace conflicts appropriately

This query system provides a modern, component-aware approach to DOM manipulation while maintaining familiar jQuery-like syntax and patterns.