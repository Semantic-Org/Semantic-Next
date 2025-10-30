# Semantic UI Query System Guide

> **For:** AI agents working with DOM querying and manipulation in Semantic UI  
> **Purpose:** Comprehensive reference for the Query package and component debugging  
> **Prerequisites:** Basic understanding of DOM and Shadow DOM concepts  
> **Related:** [Mental Model](/ai/foundations/mental-model.md) • [Component Guide](/ai/guides/components/creating-components.md) • [Quick Reference](/ai/foundations/quick-reference.md)  
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

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
- `add(selector)` - Create new collection combining current elements with elements from selector

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
- `appendTo(selector)`, `prependTo(selector)` - Insert elements as children of targets
- `insertBefore(selector)`, `insertAfter(selector)` - Insert elements relative to targets
- `before(content)`, `after(content)` - Insert content before/after elements (aliases)

### Attribute/Property Management
- `attr(name)`, `attr(name, value)` - Get/set attributes
- `removeAttr(name)` - Remove attributes
- `addAttr(attributes)` - Add one or more attributes with empty string values (for boolean attributes)
- `prop(name)`, `prop(name, value)` - Get/set properties
- `data()`, `data(key)`, `data(key, value)` - Get/set data attributes
- `removeData(keys)` - Remove data attributes (supports space-separated strings or arrays)

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
- `onNext(event, options)` - Promise-based event waiting

### Dimensions and Positioning
- `width(value)`, `height(value)` - Get/set dimensions
- `scrollWidth(value)`, `scrollHeight(value)` - Get/set scroll dimensions
- `scrollTop(value)`, `scrollLeft(value)` - Get/set scroll position
- `position(options)` - Get/set position with global, local, and relative coordinates
- `pagePosition(options)` - Get document-relative position (viewport + scroll)
- `dimensions()` - Get comprehensive dimension info (position, size, box model)
- `bounds()` - Get DOMRect bounding box information
<<<<<<< HEAD
- `intersects(target, options)` - Check if elements intersect with target (with threshold, sides, details, all)
=======
>>>>>>> next
- `offsetParent(options)` - Get offset parent for positioning
- `naturalWidth()`, `naturalHeight()` - Get natural dimensions
- `naturalDisplay(options)` - Get natural display value (ignoring display: none)
- `clippingParent()` - Get element that clips visual bounds
- `containingParent()` - Get simple containing parent (offsetParent)
- `positioningParent(options)` - Get accurate positioning context parent
<<<<<<< HEAD
- `scrollParent(options)` - Get nearest scrollable container or all scroll parents in hierarchy
=======
>>>>>>> next

### Visibility and Display
- `show(options)` - Show hidden elements using natural display value
- `hide()` - Hide elements by setting display: none
- `toggle(options)` - Toggle visibility state
- `isVisible(options)` - Check if elements are visible (with opacity/visibility checks)
<<<<<<< HEAD
- `isInView(options)` - Check if elements are within viewport bounds (inherits all intersects options)
=======
- `isInViewport(options)` - Check if elements are within viewport bounds (defaults to clipping parent)
>>>>>>> next

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

// Combine multiple collections for batch operations
const $headers = $('h1, h2, h3');
const $content = $('p, div');
const $all = $headers.add($content);

// Apply styles to all combined elements
$all.addClass('highlighted');

// Build collections progressively
let $collection = $('.initial-items');
$collection = $collection.add('.more-items');
$collection = $collection.add(document.getElementById('special-item'));

// Works with empty collections
const $empty = $('.nonexistent');
const $real = $empty.add('.existing-elements'); // Returns only existing elements
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

### Promise-based Event Handling

```javascript
// Modern async/await event handling
async function handleUserFlow() {
  // Wait for user to click start button
  await $('.start-button').onNext('click');
  console.log('User started the process');
  
  // Wait for form submission
  await $('#form').onNext('submit');
  console.log('Form submitted');
  
  // Wait for animation to complete
  await $('.success-message').onNext('animationend');
  console.log('Success animation finished');
}

// Component event waiting
async function waitForModalClose() {
  try {
    await $('.modal').onNext('modal:closed', { timeout: 5000 });
    console.log('Modal closed successfully');
  } catch (error) {
    console.log('Modal did not close within timeout');
  }
}

// Event delegation with promises
async function waitForDynamicContent() {
  // Wait for click on dynamically added elements
  const event = await $('#container').onNext('click', '.dynamic-item');
  console.log('Dynamic item clicked:', event.target);
}

// Transition and animation coordination
async function animateSequence() {
  $('.element').addClass('fade-in');
  await $('.element').onNext('animationend');
  
  $('.element').addClass('slide-up');  
  await $('.element').onNext('animationend');
  
  $('.element').addClass('bounce');
  await $('.element').onNext('animationend');
  
  console.log('Animation sequence complete!');
}
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

// Boolean attributes with addAttr (web component patterns)
$('ui-button').addAttr('disabled');              // Single boolean attribute
$('ui-input').addAttr(['required', 'readonly']); // Multiple boolean attributes
$('ui-modal').addAttr(['open', 'modal', 'centered']); // Custom component attributes

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

## Visibility Control Patterns

### Advanced Show/Hide Operations

The Query system provides sophisticated visibility control methods that go beyond basic display toggling. These methods integrate with CSS analysis and modern visibility properties.

```javascript
// Basic show/hide operations
$('.hidden-elements').show();        // Shows elements using natural display value
$('.visible-elements').hide();       // Hides elements with display: none
$('.toggle-elements').toggle();      // Toggles based on current state

// Performance-optimized operations (skip stylesheet analysis)
$('.many-elements').show({ calculate: false });    // Uses tag-based lookup
$('.toggle-items').toggle({ calculate: false });   // Faster for simple cases
```

### Natural Display Calculation

The `naturalDisplay()` method analyzes CSS rules to determine the proper display value for elements:

```javascript
// Full CSS analysis (default behavior)
$('.hidden-flex-container').naturalDisplay();     // 'flex' (from CSS rules)
$('.hidden-table-row').naturalDisplay();          // 'table-row' (from CSS rules)

// Tag-based lookup for performance
$('div').naturalDisplay({ calculate: false });    // 'block' (tag default)
$('span').naturalDisplay({ calculate: false });   // 'inline' (tag default)
$('table').naturalDisplay({ calculate: false });  // 'table' (tag default)
```

### Advanced Visibility Detection

The enhanced `isVisible()` method checks multiple visibility factors:

```javascript
// Basic visibility (layout dimensions only)
$('.elements').isVisible();                        // Checks display and dimensions

// Include opacity in visibility check
$('.fade-elements').isVisible({ includeOpacity: true });    // Also checks opacity > 0

// Skip modern visibility properties
$('.legacy-check').isVisible({ includeVisibility: false }); // Skip visibility/content-visibility

// Comprehensive visibility check
$('.complete-check').isVisible({ 
  includeOpacity: true,     // Check opacity > 0
  includeVisibility: true   // Check visibility: hidden and content-visibility: hidden
});
```

### Component Visibility Patterns

Working with component visibility in the context of Shadow DOM:

```javascript
// Show/hide components themselves
$$('ui-modal').hide();                    // Hide modal components
$$('ui-dropdown.disabled').show();       // Show disabled dropdowns

// Show/hide elements within components
$$('ui-form .error-message').show();     // Show error messages inside forms
$$('ui-table .loading-indicator').hide(); // Hide loading states

// Toggle component states
$$('ui-sidebar').toggle();               // Toggle sidebar visibility
$$('ui-tooltip.auto-hide').toggle({ calculate: false }); // Fast toggle
```

### Animation Integration Patterns

Coordinate visibility changes with CSS animations:

```javascript
async function fadeInElement() {
  const $element = $('.fade-target');
  
  // Show element but make it transparent first
  $element.css('opacity', '0').show();
  
  // Trigger fade-in animation
  $element.addClass('fade-in');
  
  // Wait for animation to complete
  await $element.onNext('animationend');
  console.log('Fade-in complete');
}

async function slideToggle() {
  const $panel = $('.slide-panel');
  const isVisible = $panel.isVisible();
  
  if (isVisible) {
    $panel.addClass('slide-out');
    await $panel.onNext('animationend');
    $panel.hide().removeClass('slide-out');
  } else {
    $panel.show().addClass('slide-in');
    await $panel.onNext('animationend');
    $panel.removeClass('slide-in');
  }
}
```

### Performance Considerations for Visibility

```javascript
// Cache visibility state for multiple operations
const $elements = $('.dynamic-content');
const isVisible = $elements.isVisible();

if (Array.isArray(isVisible)) {
  // Mixed visibility states - handle individually
  $elements.each((el, index) => {
    if (!isVisible[index]) {
      $(el).show({ calculate: false }); // Fast show for hidden elements
    }
  });
} else if (!isVisible) {
  // All hidden - batch show operation
  $elements.show(); // Full calculation for proper display values
}

// Efficient toggle patterns
function toggleWithCache() {
  const $toggles = $('.toggle-items');
  const states = $toggles.isVisible();
  
  $toggles.each((el, index) => {
    const $el = $(el);
    if (Array.isArray(states) ? states[index] : states) {
      $el.hide(); // Fast hide
    } else {
      $el.show({ calculate: false }); // Fast show with basic display
    }
  });
}
```

### Debugging Visibility Issues

Use visibility methods to diagnose display problems:

```javascript
function debugVisibility(selector) {
  const $elements = $(selector);
  
  console.log('=== Visibility Debug ===');
  console.log('Elements found:', $elements.length);
  
  $elements.each((el, index) => {
    const $el = $(el);
    console.log(`Element ${index}:`);
    console.log('  - isVisible():', $el.isVisible());
    console.log('  - isVisible(opacity):', $el.isVisible({ includeOpacity: true }));
    console.log('  - naturalDisplay():', $el.naturalDisplay());
    console.log('  - computedStyle(display):', $el.computedStyle('display'));
    console.log('  - computedStyle(opacity):', $el.computedStyle('opacity'));
    console.log('  - computedStyle(visibility):', $el.computedStyle('visibility'));
  });
}

// Usage
debugVisibility('.problematic-elements');
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
5. **Visibility Control**: Show, hide, and toggle elements with proper display calculation
6. **Form Handling**: Manage form elements and validation
7. **Animation Integration**: Coordinate with CSS transitions and animations
8. **Component Communication**: Access component methods and state

## Key Principles

1. **Shadow DOM Awareness**: Choose `$` vs `$$` based on whether you need to cross shadow boundaries
2. **Component Integration**: Use component-specific methods for web component interaction
3. **Event Delegation**: Use delegation for dynamic content and better performance
4. **Method Chaining**: Leverage chaining for concise and readable code
5. **Visibility Control**: Use `show()`/`hide()`/`toggle()` with proper display calculation over direct CSS manipulation
6. **Scope Limiting**: Limit query scope for better performance
7. **Global Management**: Manage global namespace conflicts appropriately

## Advanced Positioning and Layout Patterns

### Modern Position Calculations

```javascript
// Get all coordinate systems at once
const pos = $('#tooltip').position();
console.log('Viewport:', pos.global);  // Relative to viewport
console.log('Container:', pos.local);  // Relative to positioned parent

// Get position relative to specific element
const relativePos = $('#child').position({ 
  relativeTo: '#reference',
  precision: 'subpixel' 
});

// Position element relative to another
$('#popup').position({
  relativeTo: $('#trigger'),
  top: 10,     // 10px below trigger
  left: 0      // Aligned to left edge
});

// Get document position (handles scrolling)
const pagePos = $('#element').pagePosition();
console.log(`Element is ${pagePos.top}px from document top`);
```

### Comprehensive Layout Analysis

```javascript
// Get all dimension information
const dims = $('#complex-element').dimensions();

// Access everything you need for calculations
console.log('Content size:', dims.width, 'x', dims.height);
console.log('With padding:', dims.innerWidth, 'x', dims.innerHeight);
console.log('Full size:', dims.outerWidth, 'x', dims.outerHeight);
console.log('Including margins:', dims.marginWidth, 'x', dims.marginHeight);

// Position information
console.log('Viewport position:', dims.top, dims.left);
console.log('Document position:', dims.pageTop, dims.pageLeft);

// Box model details
console.log('Padding:', dims.box.padding);
console.log('Border:', dims.box.border);  
console.log('Margin:', dims.box.margin);

// Scroll state
console.log('Scroll position:', dims.scrollTop, dims.scrollLeft);
console.log('Scrollable area:', dims.scrollWidth, dims.scrollHeight);
```

### Viewport-Aware UI

```javascript
// Lazy loading with viewport detection (uses clipping parent by default)
function setupLazyLoading() {
  $('.lazy-image').each((img) => {
<<<<<<< HEAD
    if ($(img).isInView({ threshold: 0.1 })) {
=======
    if ($(img).isInViewport({ threshold: 0.1 })) {
>>>>>>> next
      img.src = img.dataset.src;
      img.classList.remove('lazy-image');
    }
  });
}

// Scroll-triggered animations within specific container
$('#content-area').on('scroll', () => {
  $('.animate-on-scroll').each((element) => {
    // Check visibility within the scrolling content area
<<<<<<< HEAD
    if ($(element).isInView({ threshold: 0.5 })) {
=======
    if ($(element).isInViewport({ threshold: 0.5 })) {
>>>>>>> next
      element.classList.add('animated');
    }
  });
});

// Check visibility within custom viewport (modal, sidebar, etc.)
<<<<<<< HEAD
if ($('.modal-content').isInView({ fully: true, viewport: $('#modal') })) {
=======
if ($('.modal-content').isInViewport({ fully: true, viewport: $('#modal') })) {
>>>>>>> next
  console.log('Modal content is fully visible within modal viewport');
}

// Progressive reveal based on browser viewport
$('.reveal-items').each((item) => {
  const $item = $(item);
  // Explicitly use browser viewport instead of clipping parent
<<<<<<< HEAD
  if ($item.isInView({ threshold: 0.25, viewport: document.documentElement })) {
    $item.addClass('fade-in');
  }
});

// Check that ALL elements in selection are visible (new 'all' parameter)
if ($('.required-items').isInView({ all: true })) {
  console.log('All required items are visible');
  $('.submit-button').prop('disabled', false);
}

// Get detailed intersection information for analytics
$('.tracked-elements').each((el) => {
  const details = $(el).isInView({ returnDetails: true });
  if (details && details.intersects) {
    console.log(`Element ${el.id}: ${(details.ratio * 100).toFixed(1)}% visible`);
    // Use elementPosition for obstruction analysis
    const pos = details.elementPosition;
    if (pos.top < 0) console.log(`Element ${el.id} extends above viewport`);
  }
});

// Using intersects with new 'all' parameter for complex intersection checks
if ($('.draggable-items').intersects('.drop-zone', { all: true, threshold: 0.8 })) {
  console.log('All items are mostly within drop zone');
  $('.drop-zone').addClass('ready-for-drop');
}
=======
  if ($item.isInViewport({ threshold: 0.25, viewport: document.documentElement })) {
    $item.addClass('fade-in');
  }
});
>>>>>>> next
```

### Dynamic Positioning

```javascript
// Smart tooltip positioning with accurate positioning context
function positionTooltip($tooltip, $trigger) {
  const triggerPos = $trigger.position({ type: 'global' });
  const triggerDims = $trigger.dimensions();
  const tooltipDims = $tooltip.dimensions();
  
  // Find the actual positioning context for the tooltip
  const $positioningContext = $tooltip.positioningParent();
  
  // Calculate best position to keep tooltip in viewport
  let top = triggerPos.top + triggerDims.height + 5;
  let left = triggerPos.left;
  
  // Adjust if tooltip would go off-screen
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (left + tooltipDims.width > viewportWidth) {
    left = triggerPos.left + triggerDims.width - tooltipDims.width;
  }
  
  if (top + tooltipDims.height > viewportHeight) {
    top = triggerPos.top - tooltipDims.height - 5;
  }
  
  $tooltip.css({ top: `${top}px`, left: `${left}px` });
}

<<<<<<< HEAD
// Position tooltip within scrollable container
function positionTooltipInScroller($tooltip, $trigger) {
  const $scrollContainer = $trigger.scrollParent();

  if ($scrollContainer[0] !== window) {
    // Element is within a scrollable container
    const scrollBounds = $scrollContainer.bounds();
    const triggerPos = $trigger.position({ relativeTo: $scrollContainer });

    // Position tooltip within scroll container bounds
    $tooltip.css({
      position: 'absolute',
      top: triggerPos.top + $trigger.height() + 5,
      left: Math.min(triggerPos.left, scrollBounds.width - $tooltip.width())
    });

    // Append to scroll container to inherit scrolling
    $scrollContainer.append($tooltip);
  } else {
    // Use viewport positioning
    positionTooltip($tooltip, $trigger);
  }
}

// Handle scroll events on appropriate containers
function setupScrollAwareTooltip($trigger, $tooltip) {
  const $allScrollers = $trigger.scrollParent({ all: true });

  $allScrollers.on('scroll', () => {
    // Hide tooltip when any parent scrolls
    $tooltip.hide();
  });
}

=======
>>>>>>> next
// Relative positioning for connected elements
$('#draggable').on('drag', (event) => {
  // Position connected indicator relative to draggable
  $('#indicator').position({
    relativeTo: '#draggable',
    top: -30,
    left: 10
  });
});

// Center element relative to container
function centerInContainer($element, $container) {
  const containerDims = $container.dimensions();
  const elementDims = $element.dimensions();
  
  // Use accurate positioning context for calculations
  const $positioningParent = $element.positioningParent();
  
  $element.position({
    relativeTo: $container,
    top: (containerDims.height - elementDims.height) / 2,
    left: (containerDims.width - elementDims.width) / 2
  });
}
```

This query system provides a modern, component-aware approach to DOM manipulation while maintaining familiar jQuery-like syntax and patterns.