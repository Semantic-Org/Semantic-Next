# Comprehensive Query Examples Implementation Plan

## Primary References

Before implementing this plan, agents MUST read these documents in order:

1. **Example Creation System**
   - `/ai/docs/example-creation-guide.md` - Core example creation requirements
   - `/ai/docs/example-metadata-guide.md` - Metadata structure and navigation
   - `/ai/docs/package-example-guide.md` - Package-specific example patterns

2. **Query Documentation**
   - `/docs/src/pages/api/query/index.mdx` - Query API overview
   - `/packages/query/README.md` - Query package documentation
   - `/docs/src/pages/query/index.mdx` - Query user guide

3. **Design System**
   - `/ai/guides/css-token-guide.md` - CSS token system for styling examples

4. **Navigation Structure**
   - `/docs/src/helpers/menus.js` - Current Query subcategories (currently empty, will be populated)

5. **Existing Example**
   - `/docs/src/examples/query/dom/shadow-dom/` - Current Query example structure

## Overview

This plan creates comprehensive examples for the @semantic-ui/query library, with one example per method to serve as canonical references from API documentation. The examples emphasize visual feedback over console logging and use consistent patterns throughout.

## Principles

1. **One Example Per Method**: Each Query method gets its own dedicated example
2. **Visual Feedback**: Results are displayed on the page, not in console
3. **Component Type**: Use `exampleType: 'component'` with page files only (except shadow DOM examples)
4. **Canonical References**: Examples can be directly linked from API documentation
5. **Progressive Learning**: Examples ordered from basic to advanced within categories
6. **Design Token Usage**: All styling uses CSS tokens from the design system

## Folder Structure

All examples follow the pattern: `/docs/src/examples/query/{category}/query-{method}/`

```
/docs/src/examples/query/
├── setup/
│   ├── query-esm-usage/
│   ├── query-browser-usage/
│   └── query-no-conflict/
├── introduction/
│   ├── query-dom/
│   ├── query-shadow-dom/
│   ├── query-chaining/
│   └── query-creating-dom/
├── components/
│   ├── query-settings/
│   ├── query-initialize/
│   ├── query-data-context/
│   └── query-component/
├── attributes/
│   ├── query-addClass/
│   ├── query-removeClass/
│   ├── query-toggleClass/
│   ├── query-hasClass/
│   ├── query-attr/
│   ├── query-removeAttr/
│   └── query-prop/
├── content/
│   ├── query-html/
│   ├── query-outerHTML/
│   ├── query-text/
│   ├── query-textNode/
│   └── query-val/
├── css/
│   ├── query-css/
│   ├── query-cssVar/
│   └── query-computedStyle/
├── dimensions/
│   ├── query-width/
│   ├── query-height/
│   ├── query-scrollHeight/
│   ├── query-scrollWidth/
│   ├── query-scrollLeft/
│   ├── query-scrollTop/
│   ├── query-offsetParent/
│   ├── query-naturalWidth/
│   └── query-naturalHeight/
├── dom-manipulation/
│   ├── query-remove/
│   ├── query-clone/
│   └── query-insertAfter/
├── dom-traversal/
│   ├── query-filter/
│   ├── query-children/
│   ├── query-parent/
│   ├── query-find/
│   ├── query-not/
│   ├── query-closest/
│   ├── query-is/
│   ├── query-siblings/
│   └── query-index/
├── events/
│   ├── query-on/
│   ├── query-on-delegate/
│   ├── query-one/
│   ├── query-off/
│   └── query-dispatchEvent/
├── iterators/
│   ├── query-each/
│   ├── query-map/
│   └── query-get/
├── logical-operators/
│   ├── query-eq/
│   └── query-end/
└── utilities/
    ├── query-count/
    ├── query-exists/
    ├── query-focus/
    ├── query-blur/
    └── query-chain/
```

## File Structure Per Example

### Standard Example (Most Methods)

Each example contains:
- `/docs/src/examples/query/{category}/query-{method}/`
  - `page.html` - Demo markup with interactive elements
  - `page.css` - Styling using design tokens
  - `page.js` - Method demonstration with visual output
- `/docs/src/content/examples/query-{method}.mdx` - Metadata file

### Shadow DOM Examples Only

For examples demonstrating shadow DOM functionality:
- `/docs/src/examples/query/{category}/query-{method}/`
  - `component.js` - Web component definition
  - `component.html` - Component template
  - `component.css` - Component styles
  - `page.html` - Demo using the component
  - `page.css` - Demo styling
  - `page.js` - Interaction logic
- `/docs/src/content/examples/query-{method}.mdx` - Metadata file

## Metadata Template

```yaml
---
title: 'Query .methodName() - Brief Description'
shortTitle: '.methodName()'
id: 'query-method-name'
exampleType: 'component'
category: 'Query'
subcategory: 'Category Name'
tags: ['query', 'category', 'method-type', 'use-case']
description: 'Demonstrates the .methodName() method for [specific use case]'
tip: '[When to use this method or key behavior to remember]'
selectedFile: 'page.js'
---
```

### Metadata Guidelines

- **title**: Full descriptive title including method name
- **shortTitle**: Just the method name for sidebar (150px constraint)
- **id**: Must match folder name exactly
- **subcategory**: Must match menu structure categories
- **tags**: Include 'query' + category + specific features
- **tip**: Practical guidance for when/why to use the method

## Implementation Patterns

### Visual Output Pattern

For methods that return values or perform operations:

```html
<!-- page.html -->
<div class="demo">
  <div class="target" id="element">
    <p>Target Element</p>
    <span class="detail">With nested content</span>
  </div>
  
  <div class="actions">
    <button id="execute">Execute .methodName()</button>
    <button id="reset">Reset</button>
  </div>
  
  <div class="result">
    <h4>Result</h4>
    <div id="output"></div>
  </div>
</div>
```

```css
/* page.css */
.demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
  padding: var(--spacing);
}

.target {
  padding: var(--16px);
  background: var(--standard-5);
  border: 1px solid var(--standard-15);
  border-radius: var(--border-radius);
}

.actions {
  display: flex;
  gap: var(--8px);
}

.actions button {
  padding: var(--8px) var(--16px);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.actions button:hover {
  background: var(--primary-hover);
}

.result {
  padding: var(--12px);
  background: var(--standard-10);
  border-radius: var(--border-radius);
  font-family: monospace;
}

.result h4 {
  margin: 0 0 var(--8px) 0;
  font-size: var(--small);
  color: var(--muted-text-color);
}
```

```javascript
// page.js
import { $ } from '@semantic-ui/query';

const $element = $('#element');
const $output = $('#output');
const $execute = $('#execute');
const $reset = $('#reset');

// Store initial state
const initialHTML = $element.html();

$execute.on('click', () => {
  // Execute the method
  const result = $element.methodName(parameters);
  
  // Display result
  if (result !== undefined) {
    $output.html(`<pre>${JSON.stringify(result, null, 2)}</pre>`);
  } else {
    $output.text('Method executed successfully (no return value)');
  }
  
  // Show visual changes if applicable
  // e.g., for addClass: element visually changes
});

$reset.on('click', () => {
  $element.html(initialHTML);
  $element.attr('class', ''); // Reset classes if needed
  $output.text('Reset to initial state');
});
```

### Method Categories

#### Setup Examples
Show different ways to include and configure Query:
- **ESM Usage**: Modern ES module import
- **Browser Usage**: Global script usage with CDN
- **No Conflict**: Managing $ conflicts with other libraries

#### Introduction Examples
Core concepts:
- **DOM**: Basic $ selector usage
- **Shadow DOM**: $$ for crossing boundaries (keep existing example)
- **Chaining**: Demonstrating .end() and method chaining
- **Creating DOM**: $('<div>') syntax for element creation

#### Component Integration Examples
Web component specific features:
- **Settings**: .settings() for component configuration
- **Initialize**: .initialize() for component setup
- **Data Context**: Accessing component data
- **Component**: .component() method for instance access

## Implementation Order

1. **Setup Examples** - Foundation for using Query
2. **Introduction Examples** - Core concepts
3. **Attributes** - Most commonly used methods
4. **Content** - Text and HTML manipulation
5. **CSS** - Styling methods
6. **Events** - Event handling (critical for interactivity)
7. **DOM Traversal** - Navigation methods
8. **DOM Manipulation** - Modification methods
9. **Dimensions** - Size and position methods
10. **Iterators** - Collection methods
11. **Logical Operators** - Advanced selection
12. **Utilities** - Helper methods
13. **Components** - Web component integration

## Quality Criteria

Each example must:

1. **Work Standalone**: Function without external dependencies
2. **Show Clear Results**: Visual feedback for every action
3. **Use Design Tokens**: No hardcoded colors/spacing
4. **Be Interactive**: User can trigger the method
5. **Handle Edge Cases**: Show behavior with empty selections, multiple elements
6. **Include Reset**: Allow users to reset and try again
7. **Document Behavior**: Clear labels and result displays

## Special Considerations

### Methods with Multiple Patterns

Some methods need multiple examples:
- `.on()` - Basic binding example + delegation example
- `.css()` - Getter example + setter example
- `.attr()` - Single attribute + multiple attributes

### Shadow DOM Examples

Only create component files when demonstrating shadow DOM features:
- `query-shadow-dom` (existing)
- `query-component`
- `query-settings`
- `query-initialize`

### Getter/Setter Methods

For methods that can both get and set values:
- Show both operations in one example
- Use separate buttons for "Get Value" and "Set Value"
- Display current value prominently

## Menu Structure Update

Update `/docs/src/helpers/menus.js` to add Query subcategories:

```javascript
'Query': [
  'Setup',
  'Introduction', 
  'Attributes',
  'Content',
  'CSS',
  'Dimensions',
  'DOM Manipulation',
  'DOM Traversal',
  'Events',
  'Iterators',
  'Logical Operators',
  'Utilities',
  'Components',
],
```

## Success Metrics

The implementation is complete when:

1. Every Query method has a dedicated example
2. All examples follow consistent patterns
3. Examples can be linked from API documentation
4. Visual feedback clearly shows what each method does
5. The Query section in examples navigation is fully populated
6. All examples use proper design tokens
7. Shadow DOM examples properly demonstrate boundary crossing

## Notes for Implementers

1. **Verify Methods**: Check `/packages/query/src/query.js` for the complete method list
2. **Test Interactivity**: Ensure all buttons and interactions work
3. **Cross-browser**: Test in multiple browsers for compatibility
4. **Responsive**: Examples should work on mobile viewports
5. **Accessibility**: Include proper ARIA labels where needed
6. **Performance**: Keep examples lightweight and fast

This plan creates a comprehensive, educational resource that serves as both learning material and API reference documentation for the Query library.