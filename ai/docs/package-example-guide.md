# Semantic UI Package Example Guide

> **For:** AI agents creating package demonstrations for Semantic UI documentation  
> **Prerequisites:** Understanding of package APIs (reactivity, utils, query)  
> **Related:** [Example Creation Guide](./example-creation-guide.md) • [Component Generation](../guides/component-generation-instructions.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## 📦 **Package Example Overview**

Package examples demonstrate the core Semantic UI packages (reactivity, utils, query) independently of the component system. These examples focus on API demonstration, console output, and learning-oriented content.

### **Key Characteristics**
- **Purpose**: Show package APIs in isolation
- **Format**: Usually single `index.js` files with console logging
- **Focus**: Clear, minimal demonstrations of specific features
- **Output**: Console-based results visible in playground

---

## 🎯 **Creating Package Examples**

### **Simple Package Example Structure**
```
/docs/src/examples/reactive-signals/
└── index.js                      # Complete demonstration code

/docs/src/content/examples/
└── reactive-signals.mdx          # Metadata file
```

### **Package Example Metadata Template**
```yaml
---
title: 'Signal Creation and Updates'
id: 'reactive-signals'            # Matches folder name
exampleType: 'log'                # Enables console logging
subcategory: 'Reactivity'
description: 'Demonstrates basic Signal API usage'
tags: ['reactivity', 'signals', 'tutorial']
selectedFile: 'index.js'
tip: 'Watch the console output to see reactive updates'
---
```

### **Package Example Patterns**
```javascript
// index.js - Standard package example pattern
import { Signal, Reaction } from '@semantic-ui/reactivity';

// 1. Set up initial state
const counter = new Signal(0);

// 2. Create reaction to observe
Reaction.create((reaction) => {
  const value = counter.get();
  console.log(`Counter: ${value}`);
  if (!reaction.firstRun) {
    console.log('Value changed!');
  }
});

// 3. Demonstrate the specific feature
counter.increment(1);  // Triggers reaction
counter.set(5);        // Triggers reaction
```

---

## 📚 **Package-Specific Patterns**

### **Reactivity Examples** - Demonstrating Signal and Reaction APIs
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

### **Query Examples** - Demonstrating DOM querying and manipulation
```javascript
import { $, $$ } from '@semantic-ui/query';

// Demonstrate specific query features
const elements = $$('ui-component .selector');
elements.forEach(el => {
  el.classList.add('processed');
});
```

### **Utility Examples** - Demonstrating helper functions and utilities
```javascript
import { helper, utility } from '@semantic-ui/utilities';

// Show practical usage of utility functions
const result = helper(inputData);
console.log('Processed result:', result);
```

---

## 🚀 **Step-by-Step Package Example Creation**

### **Step 1: Plan Package Demo**
- Identify specific package feature to demonstrate (Signal methods, utility functions, etc.)
- Plan minimal, focused example showing the API

### **Step 2: Create Simple Structure**
```
/docs/src/examples/package-feature-name/
└── index.js         # Complete demonstration code
```

### **Step 3: Create Package Metadata File**
Create `/docs/src/content/examples/package-feature-name.mdx`:
```markdown
---
title: 'Feature Name Demo'
exampleType: 'log'
subcategory: 'Reactivity'  # or 'Utilities', 'Query System'
description: 'Demonstrates specific package feature'
tags: ['reactivity', 'signals', 'api']
selectedFile: 'index.js'
tip: 'Watch console output for reactive updates'
---
```

### **Step 4: Implement Package Demo**
```javascript
// index.js - Standard pattern
import { PackageAPI } from '@semantic-ui/package';

// 1. Set up initial state/data
const signal = new Signal(initialValue);

// 2. Create observable reaction
Reaction.create((reaction) => {
  const value = signal.get();
  console.log(`Current value: ${value}`);
});

// 3. Demonstrate the specific feature
signal.specificMethod();  // Shows the API in action
```

---

## 📋 **Package Example Guidelines**

### **Focus on specific APIs:**
- Each example should demonstrate one specific feature or method
- Keep examples minimal and focused
- Use clear, descriptive console logging to show results
- Include comments explaining what the code demonstrates

### **Common patterns:**
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

### **Naming conventions for package examples:**
- `reactive-[method-name]` - For reactivity API demonstrations
- `query-[feature]` - For query API demonstrations  
- `[package]-[feature]` - For other package demonstrations

---

## 🎯 **When to Use Package Examples vs Component Examples**

### **Use package examples (index.js) for:**
- Demonstrating core API features like Signal methods
- Showing utility function usage
- Teaching fundamental concepts
- Simple code snippets that don't need UI

### **Use component examples (component.js/html/css) for:**
- Interactive UI demonstrations
- Complete component implementations
- Complex user interactions
- Visual demonstrations of functionality

Package examples are ideal for teaching the building blocks and core APIs that developers will use when creating their own components.

---

## 📝 **Package Example Structure Examples**

### **Simple package example:**
```
/docs/src/examples/reactive-helpers/reactive-now/
└── index.js     # Complete example code
```

### **Package example with supporting files:**
```
/docs/src/examples/query/dom/shadow-dom/
├── component.js     # Component definition (if needed)
├── component.html   # Template (if needed)
├── component.css    # Styles (if needed)
├── page.html       # Demo page
├── page.js         # Demo interactions
└── page.css        # Demo styling
```

---

**Last Updated:** Package example creation system documentation  
**Maintenance:** Update this file when adding new package APIs or changing example patterns