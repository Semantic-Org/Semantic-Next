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
   - `/docs/src/pages/api/query/events.mdx` - Events API (shows complexity requiring multiple examples)

3. **Design System**
   - `/ai/guides/css-token-guide.md` - CSS token system for styling examples

4. **Navigation Structure**
   - `/docs/src/helpers/menus.js` - Query subcategories to be populated

5. **Canonical Example Patterns**
   - `/docs/src/examples/query/events/query-on-delegate/` - Complex but refined pattern
   - `/docs/src/examples/query/attributes/query-addclass/` - Simple method pattern
   - `/docs/src/examples/query/content/query-text/` - Getter/setter pattern
   - `/docs/src/examples/query/events/query-on/` - Multiple patterns in one method
   - `/docs/src/examples/query/events/query-on-abort/` - Advanced options pattern
   - `/docs/src/examples/query/events/query-on-callback/` - Complex data demonstration

## Overview

This plan creates comprehensive examples for the @semantic-ui/query library, with focused examples that serve as canonical references from API documentation. The examples emphasize visual feedback and educational clarity over completeness.

## Critical Implementation Principles

### **Educational Focus**
1. **One Clear Teaching Goal Per Example**: Each example teaches one specific concept clearly
2. **Teaching Clarity Over Best Practices**: Avoid complex patterns that distract from the core concept
3. **Visual Feedback**: Show results on the page, not in console
4. **Real Differences**: Demonstrate actual behavior differences, not artificial distinctions

### **Structural Requirements**
1. **Standard Pixels**: Use `20px`, `10px` instead of `var(--20px)` unless teaching em-based scaling
2. **Remove Frivolous DOM**: No wrapper divs that don't serve the educational purpose
3. **One-Word Classes**: `.list`, `.item`, `.log` not `.todo-list`, `.list-container`
4. **Semantic Nesting**: Allow meaningful nesting like `.item` inside `.list`
5. **Simplify Before Hyphenating**: Ask "can I make this simpler?" before adding complex names

### **Content Standards**
1. **Clean Teaching Code**: Core method calls should be immediately visible and understandable
2. **Separate Support Code**: Helpers like `updateLog()` should be minimal and outside teaching areas
3. **No Redundant Headers**: Playground shows the title, don't duplicate it
4. **Modern Patterns**: Use pointer events, not mouse events
5. **Concise Titles**: Just `'Query .methodName()'` in metadata

### **Styling Guidelines**
1. **Subtle Styling**: Use `--subtle-shadow`, subtle gradients. When in doubt, NO styling
2. **Proper Token Usage**: `var(--border)` not `border: 1px solid var(--standard-15)`
3. **UI Components**: Use `ui-button` with semantic attributes, not custom buttons
4. **Design Token Hierarchy**: `--standard-5`, `--standard-10` for backgrounds

### **File Organization**
1. **Lowercase Folder Names**: `query-addclass` not `query-addClass`
2. **Exact ID Matching**: Folder name must match metadata `id` field exactly
3. **Component Type**: Use `exampleType: 'component'` with page files only
4. **Shadow DOM Exception**: Only use component files when demonstrating shadow DOM features

## Complex Method Strategy

For complex methods like `.on()`, create **multiple focused examples** rather than one comprehensive example:

### Example: Event Handling Methods
Based on `/docs/src/pages/api/query/events.mdx` complexity:

1. **`query-on`** - Basic binding patterns (single events, chained events, multiple event types)
2. **`query-on-delegate`** - Event delegation for dynamic content 
3. **`query-on-abort`** - Abort controller cleanup patterns
4. **`query-on-callback`** - Event object properties and `this` context
5. **`query-one`** - One-time event binding
6. **`query-off`** - Removing event handlers  
7. **`query-dispatchevent`** - Creating custom events
8. **`query-trigger`** - Triggering existing events

Each example focuses on **one aspect** of the API rather than trying to show everything.

## Updated Folder Structure

All examples follow the pattern: `/docs/src/examples/query/{category}/query-{method}/`

```
/docs/src/examples/query/
├── setup/
│   ├── query-esm-usage/
│   ├── query-browser-usage/
│   └── query-noconflict/
├── introduction/
│   ├── query-dom/
│   ├── query-shadow-dom/          # Keep existing
│   ├── query-chaining/
│   └── query-creating-dom/
├── attributes/
│   ├── query-addclass/            # ✅ Canonical pattern
│   ├── query-removeclass/
│   ├── query-toggleclass/
│   ├── query-hasclass/
│   ├── query-attr/
│   ├── query-removeattr/
│   └── query-prop/
├── content/
│   ├── query-text/                # ✅ Canonical pattern
│   ├── query-html/
│   ├── query-outerhtml/
│   ├── query-textnode/
│   └── query-val/
├── css/
│   ├── query-css/
│   ├── query-cssvar/
│   └── query-computedstyle/
├── dimensions/
│   ├── query-width/
│   ├── query-height/
│   ├── query-scrollheight/
│   ├── query-scrollwidth/
│   ├── query-scrollleft/
│   ├── query-scrolltop/
│   ├── query-offsetparent/
│   ├── query-naturalwidth/
│   └── query-naturalheight/
├── dom-manipulation/
│   ├── query-remove/
│   ├── query-clone/
│   └── query-insertafter/
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
│   ├── query-on/                  # ✅ Canonical pattern
│   ├── query-on-delegate/         # ✅ Canonical pattern
│   ├── query-on-abort/            # ✅ Canonical pattern
│   ├── query-on-callback/         # ✅ Canonical pattern
│   ├── query-one/
│   ├── query-off/
│   ├── query-dispatchevent/
│   ├── query-trigger/
│   ├── query-focus/
│   ├── query-blur/
│   ├── query-click/
│   └── query-submit/
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
    └── query-chain/
```

## Canonical File Templates

### Standard Method Example Template

Based on `query-addclass` and `query-text` patterns:

**Metadata** (`/docs/src/content/examples/query-{method}.mdx`):
```yaml
---
title: 'Query .methodName()'
shortTitle: '.methodName()'
id: 'query-methodname'
exampleType: 'component'
category: 'Query'
subcategory: 'Category Name'
tags: ['query', 'category', 'specific-features']
description: 'Demonstrates the .methodName() method for [specific use case]'
tip: '[When to use this method or key behavior insight]'
selectedFile: 'page.js'
---
```

**HTML Structure** (`page.html`):
```html
<p>Brief description of what to do</p>

<div class="target">Element to interact with</div>

<div class="controls">
  <ui-button class="action" primary>Action Button</ui-button>
  <ui-button class="reset">Reset</ui-button>
</div>

<div class="output">
  Result display area
</div>
```

**CSS Styling** (`page.css`):
```css
.target {
  padding: 20px;
  background: var(--standard-5);
  border: var(--border);
  border-radius: var(--border-radius);
  margin: 20px 0;
  transition: var(--transition);
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.output {
  margin: 20px 0;
  padding: 10px;
  background: var(--standard-10);
  border-radius: var(--border-radius);
  font-family: monospace;
}
```

**JavaScript Logic** (`page.js`):
```javascript
import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

// Core teaching method - clean and focused
$('.action').on('click', () => {
  $('.target').methodName(parameters);
  updateOutput('Method executed successfully');
});

// Reset functionality
$('.reset').on('click', () => {
  // Reset to initial state
  updateOutput('Reset to initial state');
});
```

## Implementation Standards

### **Method Analysis Process**

For each method, determine:
1. **Core concept**: What is the ONE thing this method does?
2. **Key variations**: Are there multiple signatures or important options?
3. **Visual demonstration**: How can users see the method working?
4. **Real differences**: What distinguishes this from similar methods?
5. **Split criteria**: Does complexity require multiple focused examples?

### **Example Split Guidelines**

Create separate examples when:
- Method has fundamentally different signatures (normal vs delegation)
- Advanced options significantly change behavior (abort controllers)  
- Teaching multiple concepts simultaneously creates confusion
- API documentation has distinct sections that need individual examples

### **Quality Checklist**

Each example must:
1. **Demonstrate ONE clear concept** without cognitive overhead
2. **Show visual results** that prove the method works
3. **Use modern web standards** (pointer events, design tokens)
4. **Follow structural principles** (one-word classes, minimal DOM)
5. **Provide immediate feedback** for user interactions
6. **Handle edge cases** gracefully (empty selections, multiple elements)
7. **Reset functionality** to allow repeated testing

## Implementation Priority

### **Phase 1: Core Methods** (Essential functionality)
1. **Attributes**: addClass, removeClass, toggleClass, attr, prop
2. **Content**: text, html, val
3. **Events**: on, off, one, dispatchEvent
4. **DOM Traversal**: find, closest, filter

### **Phase 2: Advanced Methods** (Extended functionality)
1. **CSS**: css, cssVar, computedStyle
2. **Dimensions**: width, height, scrollTop, scrollLeft
3. **DOM Manipulation**: remove, clone, insertAfter
4. **Iterators**: each, map, get

### **Phase 3: Specialized Methods** (Complete coverage)
1. **Setup**: ESM usage, browser usage, no conflict
2. **Introduction**: DOM basics, shadow DOM, chaining
3. **Utilities**: count, exists, chain
4. **Advanced Events**: abort patterns, callback details

## Success Metrics

Implementation is complete when:
1. **Every Query method has a focused example** with clear teaching goals
2. **Examples follow consistent patterns** established by canonical examples
3. **Complex methods are properly decomposed** into focused sub-examples
4. **Visual feedback clearly demonstrates** each method's functionality
5. **API documentation can link directly** to relevant examples
6. **Navigation structure is fully populated** in menus.js
7. **Examples work across device sizes** and interaction methods

## Critical Success Factors

1. **Study canonical examples first** - Understand the refined patterns before creating new examples
2. **Focus on educational clarity** - Complex APIs need multiple simple examples, not one complex example  
3. **Test the teaching effectiveness** - Can someone learning Query understand the method from the example?
4. **Maintain consistency** - Follow the established structural and styling patterns exactly
5. **Verify real differences** - Ensure examples demonstrate actual behavioral differences, not artificial ones

This plan creates a comprehensive, educational resource that serves as both learning material and canonical API reference documentation for the Query library, based on proven patterns and refined implementation standards.