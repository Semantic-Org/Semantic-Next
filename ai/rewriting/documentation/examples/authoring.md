---
title: Examples System Canonical Guide
description: Complete reference for creating documentation examples, covering metadata schema, file organization, example types, design tokens, and quality standards.
keywords: [examples, metadata, playground, design tokens, component examples, code patterns, validation]
audience: contributing
skill: doc-examples-authoring
type: doc
---

# Semantic UI Examples System - Canonical Guide

> **For:** AI agents working with the Semantic UI documentation example system
> **Prerequisites:** Understanding of Semantic UI architecture and documentation structure
> **Scope:** Complete reference for example creation, metadata, organization, and navigation
> **Related:** [Component Development Guide](/ai/framework/creating-components.md) • [HTML Guide](/ai/framework/html.md) • [CSS Token Guide](/ai/framework/design-tokens.md) • [Documentation Hub](/ai/00-START-HERE.md)

---

## 🎯 **Example Philosophy**

**The bar**: Would this example feel at home in official React, Vue, or Svelte docs?

### **The Four Pillars**

1. **Immediately obvious interaction** - User knows exactly what to do without reading instructions
2. **Code like a koan** - Minimal lines, the essence of the concept, nothing extra
3. **Sharp but minimal design** - Clean visuals that serve the teaching, not impress
4. **Aha moment front and center** - The key insight is the entire example

### **Critical Anti-Patterns**

```html
<!-- ❌ NEVER: Redundant description paragraph -->
<p>This example demonstrates how to use .filter() to filter elements</p>

<!-- ❌ NEVER: Raw <button> elements (breaks dark mode, not dogfooding) -->
<button class="submit">Click</button>

<!-- ✅ CORRECT: Just the example content, use ui-button -->
<ui-button class="submit">Click</ui-button>
```

### **What Makes a Great Example**

| Quality | Bad | Good |
|---------|-----|------|
| Interaction | "Click 'Iterate Items' to see each() in action" | Button labeled "Next" that obviously advances steps |
| Code | 37 lines with helper functions and reset logic | 7 lines showing the one thing |
| Design | Multiple colored borders, animations, transforms | Border, background change on state |
| Teaching | Shows 3 variations of similar thing | Shows the one essential thing clearly |

### **Real Patterns Over Demos**

Examples should show things developers actually build:
- ✅ Wizard stepper (onNext), ping/pong communication (dispatchEvent), nested box highlighting (closest/closestAll)
- ❌ Abstract "Item A, Item B, Item C" with "Process Items" button

### **Parallel Structure for Related Methods**

Methods like `closest` and `closestAll` should use identical HTML/CSS with only the JS differing. The parallel structure makes the difference obvious.

---

## 📋 **Detailed Standards**

### **Core Pedagogical Principles**
1. **Single Concept Focus**: Each example demonstrates ONE clear concept or API method
2. **Immediate Understanding**: Code should be instantly comprehensible to developers
3. **Practical Application**: Show real-world usage patterns, not abstract examples
4. **Visual Feedback**: Interactive examples provide immediate visual confirmation
5. **Authoritative Simplicity**: Clean, professional code that developers can trust and copy

### **Official Documentation Style Standards**
- **Concise**: No unnecessary complexity or features
- **Clear**: Purpose obvious from first glance
- **Practical**: Copy-pasteable patterns for real projects
- **Professional**: Production-quality code standards
- **Consistent**: Follows framework conventions throughout

---

## 📋 **System Overview**

The Semantic UI documentation system uses a **hierarchical example taxonomy** that demonstrates framework capabilities from simple concepts to complex integrations. Examples are organized in a progressive learning structure with multiple levels of categorization.

### **Architecture Principles**
1. **Progressive Complexity**: Examples build conceptual understanding from foundational → advanced
2. **Domain Separation**: Components, packages, and integrations are clearly distinguished
3. **Discoverable Navigation**: Automatic system generation based on metadata
4. **Flexible Organization**: Support for both flat and nested folder structures

---

## 🎯 **Example Types & Behaviors**

**Critical Understanding**: `exampleType` controls **playground behavior and injections**, NOT file structure requirements.

### **Component Examples** (`exampleType: 'component'`)
- **Playground Behavior**: Shows code with automatic SUI framework injections
- **Injections**:
  - SUI core library (`semantic-ui.js` + `semantic-ui.css`)
  - Error interceptor for runtime error display
  - Auto-generated `page.html` wrapper with `<head>`, `<body>` structure
- **File Priority**: Page files (`page.html/css/js`) displayed as primary artifacts in left pane
- **File Structure**: Can be `component.js/html/css` OR `page.js/html` OR mixed
- **Use Case**: Any example that needs SUI framework context (components, reactivity demos, package examples that need UI)
- **Layout**: Left panel prioritizes page files, right panel shows component files
- **Script Load Order**: `page.css` → `error.js/css` → `component.js` → `page.js`

### **Log Examples** (`exampleType: 'log'`)
- **Playground Behavior**: Console-focused output, hides page.html rendering
- **Injections**:
  - Console logging interceptor (`log.js/css`) for enhanced console display
  - Error interceptor for runtime error display
  - Basic SUI framework access
- **File Priority**: `index.js` displayed as primary artifact
- **File Structure**: Usually `index.js` only
- **Use Case**: Pure package API demonstrations, utility function examples
- **Special Behavior**: Hides `page.html` preview, focuses on console output in styled container

### **Page Examples** (`exampleType: 'page'`)
- **Playground Behavior**: Standalone pages with NO automatic SUI injections
- **Injections**: None - requires manual `<html>`, `<head>`, `<body>` setup
- **File Priority**: `page.html` must be complete standalone HTML document
- **File Structure**: Custom structure with full HTML documents
- **Use Case**: **ONLY for demonstrating actual include code** - CDN usage, external integrations
- **Manual Setup**: Must include all imports, stylesheets, and DOM structure
- **Important**: Should show copyable code that users would actually implement, not standard examples

### **Folder Examples** (`exampleType: 'folder'`)
- **Playground Behavior**: All files in folder included, tabs layout
- **Injections**: Same as component examples - full SUI framework injections
- **File Priority**: All files shown equally in tab interface
- **File Structure**: Multiple components, subcomponents, utilities
- **Use Case**: Complete applications, multi-component systems

---

## 📊 **Metadata System**

### **Complete Metadata Schema**

The authoritative schema is defined in `docs/src/content/config.js`:

```javascript
const examplesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.optional(z.string()),                    // Optional: Custom ID override
    title: z.string(),                             // Required: Display name
    hidden: z.optional(z.boolean()),               // Optional: Hide from navigation
    exampleType: z.string(),                       // Required: 'component', 'log', 'page', 'folder'
    folder: z.optional(z.string()),                // Optional: Include all files in folder
    fold: z.optional(z.boolean()),                 // Optional: Code folding behavior
    category: z.optional(z.string()),              // Optional: Top-level category
    selectedFile: z.optional(z.string()),          // Optional: Default file to show
    subcategory: z.string(),                       // Required: Secondary categorization
    description: z.string(),                       // Required: Tooltip/summary text
    tip: z.optional(z.string()),                   // Optional: Educational guidance
    tags: z.array(z.string()),                     // Required: Array for search/filtering
    shortTitle: z.optional(z.string()),            // Optional: Abbreviated display name
    additionalPageFiles: z.optional(z.string().array()), // Optional: Extra page files
  }),
});
```

### **Required Fields**
```yaml
title: 'Example Name'              # Display name (can be long)
exampleType: 'component'           # component|log|page|folder
subcategory: 'UI Components'       # Organization category
description: 'Brief description'   # Functionality summary
tags: ['component', 'ui']          # Search/filtering tags
```

### **Optional Organization Fields**
```yaml
id: 'short-name'                   # Override folder matching (useful for long titles)
category: 'Components'             # Top-level grouping
shortTitle: 'Button'               # Compact menu name
hidden: true                       # Hide from public listings
```

### **Playground Behavior Fields**
```yaml
selectedFile: 'component.js'       # Default active file tab
fold: false                        # Show/hide import/export boilerplate
tip: 'Use design tokens'           # Helpful implementation note
additionalPageFiles: ['demo.js']   # Files grouped with page files in menus
```

### **ID Resolution Logic**
1. If `id` field is provided in metadata → use that value
2. If no `id` field → auto-generate by tokenizing `title` (spaces → hyphens, lowercase)

**Critical Rule**: The resolved ID **must match the folder name exactly** for routing to work.

---

## 🗂️ **File Organization System**

### **Critical File Discovery Logic**

The system uses **regex pattern matching** to find examples anywhere in the nested folder structure:

```javascript
// From playground.js - actual discovery logic
let deepPath = `${basePath}.*/${contentID}/${subFolder}`;
let shallowPath = `${basePath}${contentID}/${subFolder}`;
```

This means examples can be organized in **any nested structure** and the system will find them by matching the final folder name to the ID.

### **Folder Structure Rules**
1. **Final folder name MUST exactly match example ID** for routing
2. **Nested organization is standard** - examples are categorized in subfolders
3. **IDs must be globally unique** across all packages/categories
4. **Use descriptive prefixes** to avoid conflicts (`reactive-increment` not `increment`)

### **Real Example Organization Patterns**

#### **Component Examples** (`exampleType: 'component'`)
```
/docs/src/examples/component/loader/
├── component.js     # Main component definition (REQUIRED)
├── component.html   # Component template (REQUIRED)
├── component.css    # Component styles (REQUIRED)
├── page.html        # Custom demo (optional - auto-generated if missing)
├── page.css         # Demo styling (optional)
└── page.js          # Demo interactions (optional)

/docs/src/examples/framework/lifecycle/counter/
├── component.js     # Component files
├── component.html
└── component.css
```

#### **Package/Log Examples** (`exampleType: 'log'`)
```
/docs/src/examples/utils/strings/utils-capitalize/
└── index.js         # Complete demonstration code

/docs/src/examples/reactivity/introduction/signals/
├── page.js          # Package demonstration
└── page.html        # Demo page
```

#### **Metadata Files Location** (Always flat)
```
/docs/src/content/examples/
├── loader.mdx              # Metadata for component/loader example
├── counter.mdx             # Metadata for framework/lifecycle/counter
├── utils-capitalize.mdx    # Metadata for utils/strings/utils-capitalize
└── signals.mdx             # Metadata for reactivity/introduction/signals
```

### **Key Discovery: ExampleType vs File Pattern**

**IMPORTANT**: Some examples have mismatched metadata vs actual file structure:

- **Signals example**: `exampleType: 'component'` but has `page.js/page.html` files (package pattern)
- **Utils examples**: `exampleType: 'log'` with `index.js` files (correct)
- **True components**: `exampleType: 'component'` with `component.js/html/css` files (correct)

### **File Naming Conventions**
- **MDX files should match their ID**: `signals.mdx` for `id: 'signals'`
- **Component files**: Use standard names (`component.js`, `component.html`, `component.css`)
- **Subcomponent files**: Use hyphenated names (`todo-item.js`, `todo-item.html`, `todo-item.css`)

---

## 🧭 **Navigation & Taxonomy System**

### **Top-Level Categories**
Defined in `docs/src/helpers/menus.js` as `topbarDisplayMenu`:
- Framework
- UI Components
- Templates
- Reactivity
- Query

### **Subcategory Organization**
Also defined in `menus.js` as `subCategorySortOrder`:
```javascript
'Reactivity': [
  'Introduction',
  'Variables',
  'Helpers',
  'Performance',
  'Controls',
  'Advanced',
]
```

### **Example Discovery Process**
1. System reads all `.mdx` files from `docs/src/content/examples/`
2. Groups by `category` and `subcategory`
3. Sorts according to `subCategorySortOrder`
4. Builds dynamic navigation menus

### **Route Generation**
Routes generated in `docs/src/pages/examples/[...slug].astro`:
- Gets example ID from metadata or tokenized title
- Searches for matching folder using glob patterns
- Supports both deep and shallow path structures

---

## 📝 **Example Code Patterns (Verbatim from Real Examples)**

### **Package-Specific Import Patterns**

#### **Utils Package Examples**
**From `utils-capitalize/index.js`:**
```javascript
import { capitalize } from '@semantic-ui/utils';

console.log(capitalize('hello world'));
console.log(capitalize('javascript'));
console.log(capitalize(''));
console.log(capitalize('a'));
```

#### **Query Package Examples**
**From `query-is-in-view/page.js`:**
```javascript
import { $ } from '@semantic-ui/query';

// Single $ import for all query operations
const $box = $('.draggable');
const $container = $('.container');

// Check visibility with different thresholds
const basicCheck = $box.isInView({ viewport: $container });
```

#### **Reactivity Package Examples**
**From `signals/page.js`:**
```javascript
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create a signal for the count
const count = new Signal(0);

// Update the display whenever count changes
Reaction.create(() => {
  $('.count').text(count.get());
});
```

#### **Component Package Examples**
**From `component.js` files:**
```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  defaultState,
  createComponent,
});
```

#### **Template Package Examples**
**From template examples:**
```javascript
import { Template } from '@semantic-ui/templating';

const defaultSettings = {
  rowTemplate: new Template(),
  headers: [],
  rows: [],
};
```

**Key Characteristics:**
- **Minimal imports**: Only what's needed for the demonstration
- **Multiple test cases**: Edge cases and typical usage
- **Clear output**: Console logs show immediate results
- **No complexity**: Pure function demonstration

### **Interactive Example HTML Pattern**
**From `query-is-in-view/page.html`:**
```html
<div class="container">
  <div class="draggable box">Drag Me</div>
  <div class="filler"></div>
</div>

<div class="output">
  <h3>Visibility Status</h3>
  <pre></pre>
</div>
```
**Key Characteristics:**
- **Semantic containers**: `.container`, `.output` describe purpose
- **Minimal markup**: Only essential elements for demonstration
- **Clear hierarchy**: Container → interactive element → feedback

### **Design Token CSS Pattern with MANDATORY Nesting**
**From `query-is-in-view/page.css`:**
```css
.container {
  position: relative;
  width: 500px;
  height: 400px;
  border: var(--border);
  margin: 50px;
  border-radius: var(--border-radius);
  overflow: auto;

  /* force scroll */
  .filler {
    width: 800px;
    height: 1600px;
  }
}

.box {
  position: absolute;
  padding: 15px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  transition-property: border, background;

  &.in-view {
    background: var(--green-background);
    border: var(--green-border);
    color: var(--green-text-color);
  }

  &.partially-in-view {
    background: var(--orange-background);
    border: var(--orange-border);
    color: var(--orange-text-color);
  }

  &.out-of-view {
    background: var(--red-background);
    border: var(--red-border);
    color: var(--red-text-color);
  }
}

.output {
  background: var(--standard-5);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--padding);
  margin: var(--margin) 0;

  h3 {
    margin-top: 0;
    color: var(--standard-70);
  }

  pre {
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 13px;
    line-height: 1.4;
    min-height: 200px;
    overflow-y: auto;
  }
}
```
**MANDATORY CHARACTERISTICS:**
- **🚨 ALWAYS use CSS nesting**: Use `&` for state classes, nest child elements
- **100% design tokens**: No hardcoded colors, spacing, or effects
- **Semantic nesting**: CSS structure mirrors HTML hierarchy
- **State-based styling**: Use `&.state-class` for element states
- **Natural CSS**: Readable, maintainable nested patterns

### **Interactive JavaScript Pattern**
**From `query-is-in-view/page.js`:**
```javascript
import { $ } from '@semantic-ui/query';

// Check visibility with different thresholds
const basicCheck = $box.isInView({ viewport: $container });
const halfVisible = $box.isInView({ viewport: $container, threshold: 0.5 });
const fullyVisible = $box.isInView({ viewport: $container, fully: true });

// Update visual state
$box.removeClass('in-view partially-in-view out-of-view');
if (fullyVisible) {
  $box.addClass('in-view');
}
else if (basicCheck) {
  $box.addClass('partially-in-view');
}
else {
  $box.addClass('out-of-view');
}
```
**Key Characteristics:**
- **Single API focus**: Demonstrates `isInView()` method variations
- **Practical usage**: Real-world configuration options
- **Visual feedback**: Immediate CSS class updates
- **Clear variable names**: `$box`, `$container` follow SUI patterns

---

## 🎨 **Common Design Tokens (Verified from Real Examples)**

**CRITICAL**: Only use design tokens that have been verified to exist. Here are tokens confirmed from actual examples:

### **Layout & Spacing**
```css
/* Standard layout tokens */
--border              /* Standard border styling */
--border-radius       /* Standard border radius */
--margin              /* Standard margin */
--vertically-spaced   /* Vertical margin spacing */

/* Em-based sizing tokens */
--8px, --12px, --16px, --24px    /* Responsive spacing that scales with font-size */
```

### **Colors & Text**
```css
/* Text colors */
--text-color          /* Standard text color */
--red-text-color      /* Red text color */
--green-text-color    /* Green text color */
--blue-text-color     /* Blue text color */
--orange-text-color   /* Orange text color */

/* Background colors */
--red-background      /* Red background color */
--green-background    /* Green background color */
--blue-background     /* Blue background color */
--orange-background   /* Orange background color */

/* Border colors */
--red-border          /* Red border color */
--green-border        /* Green border color */
--blue-border         /* Blue border color */
--orange-border       /* Orange border color */

/* Standard theme-adaptive colors */
--standard-5          /* Light background */
--standard-10         /* Slightly darker background */
--standard-15         /* Border colors */
--standard-70         /* Text colors */

/* Primary color system */
--primary-background-color
--primary-text-color
--primary-hover-background-color
```

### **Typography**
```css
/* Font weights */
--bold                /* Bold text weight */

/* Font sizes (from examples) */
--large               /* Large text size */
```

### **Effects & Transitions**
```css
--transition          /* Standard transition timing */
```

### **MANDATORY Token Verification**
**Before using ANY design token:**
1. **Check the CSS Token List Guide** at `/ai/contributing/token-reference.md` for complete reference
2. **Verify in source files** using Read tool on `/src/css/tokens/` if needed
3. **Check if it appears in real examples** you've read
4. **Use exact token name** - no guessing or variations

### **Example Token Usage (Nested CSS with Semantic Classes)**
```css
/* Standard layout and spacing */
.container {
  border: var(--border);
  border-radius: var(--border-radius);
  margin: var(--vertically-spaced) 0;

  .output {
    background: var(--standard-5);
    border: var(--border);
    border-radius: var(--border-radius);
    margin: var(--margin) 0;
  }
}

/* Semantic header types with state variants */
.header {
  color: var(--header-color);
  font-weight: var(--bold);
  margin: var(--margin) 0;

  &.error {
    color: var(--red-text-color);
    background: var(--red-background);
    border: var(--red-border);
  }

  &.success {
    color: var(--green-text-color);
    background: var(--green-background);
    border: var(--green-border);
  }

  &.warning {
    color: var(--orange-text-color);
    background: var(--orange-background);
    border: var(--orange-border);
  }
}

/* Natural language shared properties */
.message {
  padding: var(--12px);
  border-radius: var(--border-radius);
  margin: var(--8px) 0;

  &.error {
    color: var(--red-text-color);
    background: var(--red-background);
    border: var(--red-border);
  }

  &.success {
    color: var(--green-text-color);
    background: var(--green-background);
    border: var(--green-border);
  }
}
```

---

## 🚀 **Creation Workflows**

### **Component Example Workflow**

#### Step 1: Plan Component
- Use TodoWrite tool for multi-step component creation
- **MANDATORY**: Read `/ai/contributing/token-reference.md` for complete design token reference
- **MANDATORY**: Read `/ai/framework/html.md` for semantic HTML patterns
- **MANDATORY**: Read `/ai/framework/design-tokens.md` for design token usage patterns
- **MANDATORY**: Read relevant package guide in `/ai/framework/` if using specific packages
- **MANDATORY**: Read 1-3 existing examples with highest similarity to requested example for style patterns
- Check existing components in `/src/components/` for patterns
- Review component specs in `/src/components/{component}/specs/`

#### Step 2: Create Directory Structure
**🚨 CRITICAL FILE PATH REQUIREMENTS:**

```bash
# Component files location (MANDATORY PATH - note the nested structure)
mkdir -p /docs/src/examples/category/subcategory/my-component-name/

# Metadata file location (MANDATORY PATH - flat structure)
touch /docs/src/content/examples/my-component-name.mdx
```

**ABSOLUTE PATH REQUIREMENTS:**
- **Component files**: MUST be in `/docs/src/examples/logical-category/logical-subcategory/example-id/`
- **Metadata files**: MUST be in `/docs/src/content/examples/example-id.mdx` (flat structure)
- **Both locations are REQUIRED** - the component will not work without both
- **ID must match final folder name exactly** (e.g., folder `loader/` → id `'loader'` → `loader.mdx`)
- **Organize in most logical location** for the type of example being created

**ORGANIZATIONAL EXAMPLES:**
- UI Component: `/docs/src/examples/component/loader/` → ID: `'loader'` → `/docs/src/content/examples/loader.mdx`
- Utils Function: `/docs/src/examples/utils/strings/utils-capitalize/` → ID: `'utils-capitalize'` → `/docs/src/content/examples/utils-capitalize.mdx`
- Query Method: `/docs/src/examples/query/visibility/query-is-in-view/` → ID: `'query-is-in-view'` → `/docs/src/content/examples/query-is-in-view.mdx`
- Reactivity Demo: `/docs/src/examples/reactivity/introduction/signals/` → ID: `'signals'` → `/docs/src/content/examples/signals.mdx`

**ORGANIZATION LOGIC:**
- **Package examples**: `/docs/src/examples/{package}/{logical-grouping}/{example-id}/`
- **Component examples**: `/docs/src/examples/component/{example-id}/` or `/docs/src/examples/framework/{logical-grouping}/{example-id}/`
- **Choose path** that makes sense for discovery and maintainability

**❌ WRONG PATHS (DO NOT USE):**
- `/examples/your-component/` (this is for standalone examples, not docs)
- `/docs/src/examples/your-component.mdx` (metadata goes in content/examples/)
- Missing either component files OR metadata file

#### Step 3: Component Metadata Template
```yaml
---
title: 'My Component Name'
exampleType: 'component'
subcategory: 'UI Components'
description: 'Brief description of functionality'
tags: ['component', 'ui', 'interaction']
selectedFile: 'component.js'
tip: 'Use design tokens for consistent styling'
---
```

#### Step 4: Implement Component Files
- **component.js**: Use `defineComponent`, `self.method()` references, `$` prefixed queries
- **component.html**: Follow `/ai/framework/html.md` - semantic classes, natural hierarchy
- **component.css**: Follow `/ai/framework/design-tokens.md` - 100% design tokens, CSS nesting

#### Step 5: Page File Standards
- **page.css**: **MANDATORY** - Use only design tokens per `/ai/framework/design-tokens.md`
- **page.html**: **MANDATORY** - Follow `/ai/framework/html.md` semantic patterns
- **page.js**: Prefix query variables with `$` (`const $button = $('#btn')`)

### **Package Example Workflow**

#### Step 1: Research and Plan
- **MANDATORY**: Read `/ai/framework/design-tokens.md` for design token usage
- **MANDATORY**: Read relevant package guide in `/ai/framework/` for API patterns
- **MANDATORY**: Read 1-3 existing package examples with highest similarity for style patterns
- Plan minimal demonstration of single API concept

#### Step 2: Package Example Structure
```
/docs/src/examples/package-feature-name/
└── index.js         # Complete demonstration code
```

#### Step 2: Package Metadata Template
```yaml
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

#### Step 3: Package Code Pattern
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

### **Page/Integration Example Workflow**

#### Step 1: Research and Plan
- **MANDATORY**: Read 1-3 existing page examples (CDN example) for complete HTML patterns
- **MANDATORY**: Understand that page examples show copyable include code
- Plan complete standalone HTML document demonstration

#### Step 2: Custom Structure
```
/docs/src/examples/integration-name/
├── page.html        # Manual HTML setup
├── page.css         # Custom styling
└── page.js          # Integration code
```

#### Step 2: Integration Metadata
```yaml
---
title: 'CDN Integration Example'
exampleType: 'page'
subcategory: 'CDN Usage'
description: 'Shows how to use SUI from CDN'
tags: ['cdn', 'integration', 'setup']
---
```

#### Step 3: Manual Setup Implementation
- Manually import SUI from CDN or external sources
- Show complete setup without automatic injections
- Demonstrate integration patterns

---

## 🎨 **Playground Layout System**

### **File Organization Logic**
- **Component Files**: `component.js`, `component.html`, `component.css`, `index.js`
  - Appear in **left panel/menu** (Panel 0)
  - Get `'grow'` sizing (expand to fill space)
  - Considered "definition" files

- **Page Files**: `page.html`, `page.css`, `page.js` + `additionalPageFiles`
  - Appear in **right panel/menu** (Panel 1)
  - Get smaller sizing (11% each)
  - Considered "demo/usage" files

### **Responsive Behavior**
- **Desktop (>1200px)**: Separate component/page menus, panels or tabs
- **Tablet (768-1200px)**: Combined menus, vertical layout
- **Mobile (<768px)**: Single tab view with code/preview toggle

### **Layout Modes**
- **Tabs**: Single menu, selected file shows in content area
- **Panels**: Split view, both sides visible, resizable

---

## 📦 **Package-Specific Patterns**

### **Reactivity Examples**
```javascript
import { Reaction, Signal } from '@semantic-ui/reactivity';

const counter = new Signal(0);

Reaction.create((reaction) => {
  console.log(`Counter value: ${counter.get()}`);
  if (reaction.firstRun) {
    console.log('First run - setting up reaction');
  }
});

// Demonstrate specific API features
counter.increment(1);   // For reactive-increment example
counter.now();          // For reactive-now example
counter.removeIndex(0); // For reactive-remove-index example
```

### **Query Examples**
```javascript
import { $, $$ } from '@semantic-ui/query';

// Demonstrate specific query features
const elements = $$('ui-component .selector');
elements.forEach(el => {
  el.classList.add('processed');
});
```

### **Utility Examples**
```javascript
import { helper, utility } from '@semantic-ui/utilities';

// Show practical usage of utility functions
const result = helper(inputData);
console.log('Processed result:', result);
```

### **Package Example Naming Conventions**
- `reactive-[method-name]` - For reactivity API demonstrations
- `query-[feature]` - For query API demonstrations
- `[package]-[feature]` - For other package demonstrations

---

## 🎯 **Example Type Decision Guide**

```
Creating interactive UI component?
├── Complex multi-file system → exampleType: 'folder'
└── Standard component → exampleType: 'component'

Demonstrating core package APIs?
├── Reactivity/Utils/Query demos → exampleType: 'log'
└── Learning/tutorial focus → exampleType: 'log'

Creating standalone page/integration?
├── CDN usage example → exampleType: 'page'
├── External library demo → exampleType: 'page'
└── Manual setup required → exampleType: 'page'
```

### **Package Examples vs Component Examples**

**Use package examples (index.js) for:**
- Demonstrating core API features like Signal methods
- Showing utility function usage
- Teaching fundamental concepts
- Simple code snippets that don't need UI

**Use component examples (component.js/html/css) for:**
- Interactive UI demonstrations
- Complete component implementations
- Complex user interactions
- Visual demonstrations of functionality

---

## ✅ **Validation Requirements**

### **Critical Requirements Check**
- [ ] Folder name matches metadata filename exactly
- [ ] Title in metadata matches folder name appropriately
- [ ] Using `self.method()` not `this.method()` (components)
- [ ] CSS uses design tokens not hardcoded values (components)
- [ ] Query variables prefixed with `$` (components)
- [ ] HTML attributes lowercase (`showlabel` not `showLabel`) (components)
- [ ] IDs are globally unique across all categories
- [ ] Subcategory exists in `subCategorySortOrder`

### **Auto-Generated page.html**
- System auto-generates `page.html` if not provided for components with `tagName`
- **Template-only components** (no `tagName`) **must** provide custom `page.html`
- Custom `page.html` should demonstrate programmatic template instantiation

### **Subcomponent Naming Patterns**
**From real examples** like `todo-list`, `subtemplates-as-settings`:

**File naming for subcomponents:**
- Use simple names: `row.js`, `row.html`, `row.css`
- Multiple variants: `row.js`, `row2.js` for different templates
- **NOT hyphenated** for subcomponents (unlike main component folders)

**Template-only component exports:**
```javascript
// From row.js - template component without tagName
import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./row.css');
const template = await getText('./row.html');

export const Row = defineComponent({
  template,
  css,
  // No tagName - this is a template export
});
```

**Usage in parent component:**
```javascript
// From component.js - using template as setting
import { Template } from '@semantic-ui/templating';

const defaultSettings = {
  rowTemplate: new Template(), // Template instance for subcomponent
  headers: [],
  rows: [],
};
```


### **Component File Standards**
- **component.js**: Use `defineComponent`, proper API patterns
- **component.html**: First-party UI components, semantic classes
- **component.css**: Design tokens, semantic naming, CSS nesting
- **page.html**: No inline styles, semantic classes only
- **page.css**: Design tokens, natural hierarchy patterns
- **page.js**: `$` prefixed queries, proper SUI integration

---

## 🔗 **Integration Points**

### **Playground System**
- Files loaded via `getExampleFiles()` in `docs/src/helpers/playground.js`
- Supports both flat and nested folder structures
- Automatically includes required dependencies and boilerplate

### **MDX References & Integration Patterns**
- API documentation references examples using `<PlaygroundExample id="example-id">`
- Guide pages can embed examples inline
- Example IDs used consistently across documentation

**Integration Documentation Patterns:**
```markdown
<!-- Embedding examples in documentation -->
<PlaygroundExample id="query-is-in-view" />

<!-- Reference examples in guides -->
See the [Query .width() example](query-width) for basic usage patterns.

<!-- Link to specific examples -->
[Advanced usage](query-outerwidth) shows additional configuration options.
```

**Cross-Reference Requirements:**
- **Example IDs must be linkable** from API docs and guides
- **Use exact example IDs** in documentation links
- **Maintain consistency** between example metadata and documentation references

### **Content Collection**
- All examples part of Astro content collection
- Metadata validated and typed
- Examples queryable and filterable programmatically

---

## 🎓 **Pedagogical Standards & Requirements**

### **MANDATORY Example Quality Standards**

#### **Simplicity Requirements**
- **Single concept focus**: Each example demonstrates exactly ONE API method or concept
- **Minimal code**: Only include code essential to the demonstration
- **No feature creep**: Resist adding "helpful" but unrelated functionality
- **Clear purpose**: A developer should understand the example's goal in 3 seconds

#### **Code Quality Requirements**
- **Professional standards**: Production-quality code that developers can trust
- **Design token usage**: Use only `var(--token-name)` - never hardcoded values
- **Semantic HTML**: Follow `/ai/framework/html.md` patterns exactly
- **Query prefixing**: All DOM queries must use `$` prefix (`const $element = $('.selector')`)

#### **Educational Requirements**
- **Practical application**: Show real-world usage patterns
- **Edge case coverage**: Include common edge cases in demonstrations
- **Visual feedback**: Interactive examples must provide immediate visual confirmation
- **Copy-pasteable**: Code should work when copied to real projects

### **Natural Language CSS Philosophy**

**CRITICAL**: Semantic UI uses **natural language** concepts in CSS. Think in terms of shared semantic properties that multiple elements can inherit.

#### **Shared Property Patterns**
```css
/* ✅ CORRECT: Semantic properties that can be combined */
.scroll {
  overflow: auto;

  &.inner { /* inner scroll areas */
    height: 100%;
  }

  &.outer { /* outer scroll containers */
    max-height: 400px;
  }
}

.primary {
  background: var(--primary-background-color);
  color: var(--primary-text-color);

  &.action { /* primary actions */
    cursor: pointer;
    border: none;
  }

  &.text { /* primary text */
    font-weight: var(--bold);
  }
}

.large {
  font-size: var(--large);

  &.button {
    padding: var(--16px) var(--24px);
  }

  &.text {
    line-height: 1.4;
  }
}
```

**HTML Usage:**
```html
<div class="scroll inner">...</div>    <!-- gets overflow: auto + height: 100% -->
<div class="scroll outer">...</div>    <!-- gets overflow: auto + max-height: 400px -->
<button class="primary action">...</button>  <!-- gets primary colors + cursor pointer -->
<span class="primary text">...</span>        <!-- gets primary colors + bold weight -->
```

**AI Self-Reflection Process:**
1. **Survey the example**: What elements actually exist in this specific example?
2. **Identify REAL shared properties**: Do multiple elements actually share the same CSS properties?
3. **Apply shared grouping ONLY if beneficial**: If only one element has `overflow: auto`, don't create `.scroll` base class
4. **Keep it simple**: Don't force semantic groupings where none naturally exist

**Decision Framework:**
```css
/* ✅ GOOD: Multiple elements share 'primary' styling */
<button class="primary action">Save</button>
<span class="primary text">Important</span>
→ CREATE: .primary { background: var(--primary-color); }

/* ✅ GOOD: Multiple scroll areas */
<div class="scroll inner">Content</div>
<div class="scroll outer">Container</div>
→ CREATE: .scroll { overflow: auto; }

/* ✅ GOOD: Only one element needs overflow */
<div class="container">Content</div>
→ DON'T CREATE: .scroll base class
→ JUST USE: .container { overflow: auto; }
```

**Anti-Pattern Warning:**
```css
/* ❌ WRONG: Forcing semantic grouping for single use */
.container {
  .primary {  /* Only used once in this example */
    background: var(--primary-color);

    &.button {
      padding: var(--8px);
    }
  }
}

/* ✅ CORRECT: Simple direct styling */
.container {
  .button {
    background: var(--primary-color);
    padding: var(--8px);
  }
}
```

### **Content Standards**

#### **HTML Structure**
```html
<!-- ✅ CORRECT: Semantic, purpose-driven with spaced class names -->
<div class="container">
  <div class="inner scroll">
    <div class="scroll content">
      <div class="controls">
        <button class="action primary">Test Function</button>
      </div>
      <div class="output">
        <pre class="result"></pre>
      </div>
    </div>
  </div>
</div>

<!-- ❌ WRONG: Hyphenated class names -->
<div class="container">
  <div class="inner-scroll">
    <div class="scroll-content">
      <button class="action-button">Test</button>
    </div>
  </div>
</div>

<!-- ❌ WRONG: Implementation-focused -->
<div class="flex-column">
  <div class="btn-container">
    <button id="testBtn">Test Function</button>
  </div>
</div>
```

#### **CSS Patterns with Shared Natural Language Properties**
```css
/* ✅ CORRECT: Shared semantic properties (Semantic UI natural language approach) */
.container {
  background: var(--standard-5);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacing);

  /* Shared property: anything with 'scroll' gets overflow behavior */
  .scroll {
    overflow: auto;

    &.inner {
      height: 100%;
      border: var(--border);
    }

    &.outer {
      max-height: 400px;
      border-radius: var(--border-radius);
    }
  }

  /* Shared property: anything 'primary' gets primary styling */
  .primary {
    background: var(--primary-background-color);
    color: var(--primary-text-color);

    &:hover {
      background: var(--primary-hover-background-color);
    }

    &.action {
      border: none;
      cursor: pointer;
      padding: var(--8px) var(--16px);
    }
  }

  /* Shared property: anything with 'content' gets content spacing */
  .content {
    padding: var(--12px);

    &.main {
      padding: var(--24px);
    }
  }
}

/* ❌ WRONG: Hyphenated class selectors */
.container {
  .inner-scroll {
    overflow: auto;
  }

  .action-button {
    background: var(--primary-background-color);
  }
}

/* ❌ WRONG: Flat CSS without nesting */
.container {
  background: var(--standard-5);
  padding: var(--spacing);
}

.container .item {
  margin: var(--8px);
}

/* ❌ WRONG: Hardcoded values */
.container {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
}
```

#### **JavaScript Patterns**
```javascript
// ✅ CORRECT: Clear, focused demonstration
import { capitalize } from '@semantic-ui/utils';

console.log(capitalize('hello world'));  // "Hello world"
console.log(capitalize(''));             // ""

// ❌ WRONG: Unnecessary complexity
import { capitalize, forEach, map } from '@semantic-ui/utils';

const testCases = ['hello world', 'javascript', ''];
const processor = {
  process: (items) => map(items, capitalize),
  display: (results) => forEach(results, console.log)
};
```

### **Documentation Standards**

#### **Metadata Copywriting Standards**
**CRITICAL**: Follow editorial standards from `/ai/contributing/workflows/refine-example-documentation-copy.md`

**Title Guidelines:**
- Use exact API method names for package examples (`Query .width()`)
- Keep component titles descriptive but concise (`Color Picker`)

**Description Guidelines:**
```yaml
# ✅ CORRECT: Complete the title, don't repeat it
title: 'Query .focus()'
description: 'Sets keyboard focus on elements'

# ❌ WRONG: Redundant demonstration language
title: 'Query .focus()'
description: 'Demonstrates using .focus() to focus elements'
```

**Tip Guidelines:**
```yaml
# ✅ CORRECT: Non-obvious framework-specific insight
tip: 'Unlike remove(), detached elements can be reattached with events intact'

# ✅ CORRECT: Unique implementation detail
tip: 'Excludes padding and border (unlike offsetWidth which includes them)'

# ❌ WRONG: Obvious statement
tip: 'Use addClass() to add CSS classes to elements'

# ✅ CORRECT: When in doubt, omit entirely
tip: # Leave empty rather than stating the obvious
```

**Research Requirements:**
- **MANDATORY**: Read source implementation in `/packages/{package}/src/` before writing tips
- **Verify claims**: All framework-specific behavior must be verified in source code
- **Compare to standards**: Explain how SUI differs from native DOM APIs or common patterns

#### **Example Metadata Requirements**
- **Description**: Complete the title concept without repetition
- **Tags**: Include the primary package/method being shown
- **Tip**: Provide non-obvious insights or omit entirely
- **Title**: Use exact API method names where applicable

#### **File Organization Requirements**
- **Folder naming**: Must match example ID exactly
- **File naming**: Follow established patterns (`component.js`, `page.js`, `index.js`)
- **Structure consistency**: Similar examples should have similar file structures

### **Quality Checklist**

#### **Before Creating Any Example**
1. ✅ Read `/ai/framework/html.md` for HTML patterns
2. ✅ Read `/ai/framework/design-tokens.md` for CSS token usage
3. ✅ Read relevant `/ai/framework/` guide for package-specific patterns
4. ✅ **Read 1-3 existing examples with highest similarity to requested example**
5. ✅ Identify the single concept to demonstrate
6. ✅ Plan minimal code to show that concept clearly

#### **How to Find Similar Examples**
**For Package Examples**: Search for examples using the same package:
```bash
# Find utils examples
find docs/src/examples -name "*utils-*" -type d | head -3

# Find query examples
find docs/src/examples -name "*query-*" -type d | head -3

# Find reactivity examples
find docs/src/examples -name "*reactive-*" -type d | head -3
```

**For Component Examples**: Look in same subcategory or with similar functionality:
```bash
# Find similar component types
ls docs/src/examples/component/
ls docs/src/examples/framework/

# Search by metadata tags
grep -r "tags.*animation" docs/src/content/examples/ | head -3
```

**Pattern Recognition**: Choose examples that match:
- **Same package** (utils, query, reactivity, component)
- **Similar complexity level** (simple function vs. interactive demo)
- **Same file structure** (index.js only vs. page.html+js+css)

#### **Code Review Requirements**
1. ✅ No hardcoded colors, spacing, or typography
2. ✅ All design tokens verified to exist in source files
3. ✅ **CSS uses mandatory nesting patterns** - no flat CSS selectors
4. ✅ **HTML uses spaced class names** - `"inner scroll"` not `"inner-scroll"`
5. ✅ **CSS uses shared semantic properties ONLY when beneficial** - don't force groupings for single use
6. ✅ HTML follows semantic naming patterns
7. ✅ JavaScript uses `$` prefixed query variables
8. ✅ Example demonstrates exactly one concept clearly
9. ✅ Code is copy-pasteable for real projects

#### **Metadata Review Requirements**
1. ✅ Description completes title without repetition or "demonstrates" language
2. ✅ Tip adds genuine non-obvious insight or omitted entirely
3. ✅ Framework-specific claims verified in source code (`/packages/{package}/src/`)
4. ✅ Title + description + tip flow as coherent thought
5. ✅ Tags include primary package/method being demonstrated

## 📚 **Best Practices**

### **ID Naming**
- Use **descriptive prefixes** to avoid conflicts (`reactive-increment` not `increment`)
- Keep IDs **concise but clear** (`signals` not `signal-basics-introduction`)
- Use **kebab-case** consistently
- Consider **global uniqueness** across all example categories

### **Organization Principles**
1. **Simple → Complex**: Each subcategory should progress in difficulty
2. **Conceptual grouping**: Group related functionality together
3. **Logical prerequisites**: Earlier examples establish concepts used later
4. **Clear boundaries**: Each subcategory has distinct purpose

---

## 📋 **Universal Creation Steps**

1. **Plan Task**: Use TodoWrite tool for multi-step work
2. **Create Structure**: Establish folders and files in correct locations
3. **Write Metadata**: Create MDX file with complete frontmatter
4. **Implement Code**: Follow type-specific patterns and standards
5. **Validate Requirements**: Check all critical requirements
6. **Test Functionality**: Verify example loads and works correctly
7. **Run Quality Checks**: Execute lint/typecheck commands if available
8. **Validate Example Loads**: Verify routing and file discovery works
9. **Present for User Testing**: **MANDATORY** - Wait for user to test example in REPL environment
10. **Incorporate Feedback**: Make any necessary adjustments based on user testing
11. **Final Validation**: Complete technical validation checklist
12. **Mark Complete**: Update TodoWrite with completed tasks

## 🔍 **Detailed Validation Workflows**

### **Pre-Testing Technical Validation**
**Before presenting to user, verify:**

#### **File Structure Validation**
```bash
# Verify component files exist in correct nested location
ls /docs/src/examples/category/subcategory/example-id/

# Verify metadata file exists in flat location
ls /docs/src/content/examples/example-id.mdx

# Check ID matches final folder name
# folder: /docs/src/examples/utils/strings/utils-capitalize/
# metadata: /docs/src/content/examples/utils-capitalize.mdx
# ID: 'utils-capitalize' ✅
```

#### **Import Validation**
```bash
# For package examples - verify imports are minimal and correct
grep "import.*@semantic-ui" example-folder/index.js

# For component examples - verify getText pattern
grep "getText.*component" example-folder/component.js
```

#### **Design Token Validation**
```bash
# Verify all CSS uses design tokens
grep -v "var(--" example-folder/*.css
# Should return no results (all styles use tokens)

# Check for hardcoded values
grep -E "#[0-9a-f]{3,6}|rgb\(|[0-9]+px" example-folder/*.css
# Should return no results (no hardcoded colors/sizes)
```

#### **Routing Validation**
1. **ID Resolution Check**: Confirm ID in metadata matches final folder name exactly
2. **Path Discovery**: Ensure regex pattern `${basePath}.*/${contentID}/${subFolder}` will find the example
3. **Global Uniqueness**: Verify ID is unique across all examples

### **Post-User-Testing Validation**
**After user confirms functionality:**

#### **Integration Validation**
- ✅ Example loads in playground without errors
- ✅ All interactive elements function correctly
- ✅ Console output appears for log examples
- ✅ Visual styling matches framework standards
- ✅ Example can be linked from documentation

#### **Quality Assurance Checklist**
- ✅ No console errors during example load
- ✅ All imports resolve correctly
- ✅ CSS design tokens verified in source files
- ✅ HTML follows semantic naming patterns
- ✅ Metadata flows as coherent description
- ✅ Example demonstrates single concept clearly
- ✅ Code is production-quality and copy-pasteable

## 🧪 **REPL Testing & User Feedback**

**CRITICAL**: All examples will be loaded in a live REPL environment where users can interact with them immediately.

### **After Example Creation**
1. **Present the example** to the user for testing
2. **Wait for user feedback** on functionality, clarity, and behavior
3. **Do not assume the example works** until user confirms
4. **Be prepared to make adjustments** based on real testing

### **Common Testing Scenarios**
- **Interactive examples**: User will click, drag, type, and interact with all elements
- **Console examples**: User will observe console output and verify correctness
- **Visual examples**: User will check appearance, responsiveness, and styling
- **API examples**: User will test edge cases and different input values

### **Feedback Integration**
- **Functionality issues**: Fix broken interactions or incorrect behavior
- **Clarity problems**: Simplify confusing code or improve visual feedback
- **Performance issues**: Optimize slow interactions or excessive updates
- **Style inconsistencies**: Adjust to match framework design standards


---

This canonical guide consolidates all example system knowledge into a single authoritative reference, eliminating redundancy while preserving comprehensive coverage of the Semantic UI documentation example system.