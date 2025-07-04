# Semantic UI Query System Guide

**For AI agents working with Semantic UI's `@semantic-ui/query` package**

## Overview

The `@semantic-ui/query` package is a standalone DOM querying and manipulation library that provides jQuery-like functionality with modern JavaScript features. It's designed specifically to handle Shadow DOM traversal and component-aware querying while remaining lightweight and focused.

## Package Structure

```
@semantic-ui/query
├── Query         ← Main query class with DOM manipulation methods
├── $ function    ← Standard DOM querying (respects Shadow DOM boundaries)  
├── $$ function   ← Deep querying (crosses Shadow DOM boundaries)
└── Utilities     ← Global management and aliasing functions
```

**Main Exports**:
```javascript
import { $, $$, Query, exportGlobals, restoreGlobals, useAlias } from '@semantic-ui/query';
```

## Core Functions

### $ - Standard DOM Querying

The `$` function provides standard DOM querying that respects Shadow DOM boundaries.

```javascript
import { $ } from '@semantic-ui/query';

// Query selectors (standard CSS selectors)
$('.button')                    // All elements with class 'button' in light DOM
$('#main')                      // Element with id 'main'
$('input[type="text"]')         // All text inputs
$('div > .child')               // Direct child selectors

// Create elements from HTML
$('<div class="new-element">Content</div>')
$('<span>Text</span>')

// Wrap existing elements
$(document.body)                // Wrap body element
$(elementArray)                 // Wrap array of elements
$(nodeList)                     // Wrap NodeList

// Global selectors
$('window')                     // Window object (special handling)
$('body')                       // Document body
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
- `slice(start, end)` - Get subset of elements

### DOM Traversal
- `find(selector)` - Find descendants
- `parent()`, `parents()` - Get parent elements
- `children()`, `siblings()` - Get child/sibling elements
- `next()`, `prev()` - Get adjacent siblings
- `closest(selector)` - Find closest ancestor matching selector

### Content Manipulation
- `html()`, `html(content)` - Get/set innerHTML
- `text()`, `text(content)` - Get/set textContent
- `val()`, `val(value)` - Get/set form element values
- `append()`, `prepend()` - Add content to elements
- `before()`, `after()` - Add content around elements

### Attribute/Property Management
- `attr(name)`, `attr(name, value)` - Get/set attributes
- `removeAttr(name)` - Remove attributes
- `prop(name)`, `prop(name, value)` - Get/set properties
- `data(key)`, `data(key, value)` - Get/set data attributes

### CSS and Styling
- `css(property)`, `css(property, value)` - Get/set CSS properties
- `addClass()`, `removeClass()`, `toggleClass()` - Manage CSS classes
- `hasClass()` - Check for CSS class
- `show()`, `hide()` - Show/hide elements

### Event Handling
- `on(event, selector, handler)` - Event delegation
- `off(event, handler)` - Remove event listeners
- `trigger(event, data)` - Trigger custom events
- `one(event, handler)` - One-time event listener

### Dimensions and Positioning
- `width()`, `height()` - Get/set dimensions
- `innerWidth()`, `outerWidth()` - Get calculated dimensions
- `offset()`, `position()` - Get element positioning
- `scrollTop()`, `scrollLeft()` - Get/set scroll position

### Component Integration (Semantic UI specific)
- `settings(newSettings)` - Configure component settings
- `initialize(settings)` - Initialize component before DOM insertion
- `component()` - Get component template instance
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
// jQuery-style chaining
$('.items')
  .addClass('processed')
  .find('.button')
  .on('click', handleClick)
  .css('color', 'blue')
  .end()                    // Return to previous selection (.items)
  .fadeIn();
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

// Data attributes
$('.item').data('id', 123);
const itemId = $('.item').data('id');

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