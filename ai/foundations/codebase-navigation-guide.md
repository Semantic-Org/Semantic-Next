# Semantic UI Codebase Navigation Guide

## Table of Contents

- [Quick Location Reference](#quick-location-reference)
- [Documentation Reading Order](#documentation-reading-order)
- [Tool Usage Strategies](#tool-usage-strategies)
- [Documentation Locations](#documentation-locations)
- [Source Code Locations](#source-code-locations)
- [Example Code Locations](#example-code-locations)
- [Configuration & Build Files](#configuration--build-files)
- [Search Strategies by Topic](#search-strategies-by-topic)
- [Common Investigation Patterns](#common-investigation-patterns)

---

## Quick Location Reference

### Root Structure
```
/project-root-dir/
├── ai/                     ← AI context documentation (YOU ARE HERE)
├── docs/                   ← Documentation website and examples
├── packages/               ← Core framework source code
├── examples/               ← Standalone examples and demos
├── src/                    ← Component library (design system)
├── tests/                  ← Test suites and configurations
└── scripts/                ← Build and utility scripts
```

### Documentation Hub: `/docs/`
```
docs/
├── src/pages/              ← All documentation content
│   ├── api/                ← **CANONICAL** API reference docs (organized by package)
│   ├── components/         ← Component system guides
│   ├── templates/          ← Template syntax guides
│   ├── reactivity/         ← Reactivity system guides
│   ├── query/              ← Query library guides
│   └── *.mdx               ← Top-level guides
├── src/examples/           ← **CANONICAL** examples (hand-written best practices)
└── src/helpers/menus.js    ← **CRITICAL** Documentation menu structure (MUST MODIFY for new pages)
```

### Core Framework: `/packages/`
```
packages/
├── component/              ← Web component framework
├── reactivity/             ← Signals-based reactivity
├── templating/             ← AST template compiler
├── query/                  ← DOM querying library
├── renderer/               ← Lit integration
├── utils/                  ← Shared utilities
├── specs/                  ← Component specifications
└── tailwind/               ← Tailwind CSS integration
```

---

## Documentation Reading Order

> **CRITICAL FOR AI AGENTS**: Documentation should be read in menu order as defined in `/docs/src/helpers/menus.js`. This order represents the proper learning progression that builds context incrementally. Reading docs out of order will result in missing foundational concepts needed to understand advanced topics. **To add new documentation pages, you MUST modify the menu structure in this file.**

### Framework Documentation (`sidebarMenuFramework`)

#### **1. Introduction**
- `/introduction` - Start here for overview and getting started

#### **2. Components** (Core system)
- `/components` - Component overview and features
- `/components/create` - Creating components with defineComponent
- `/components/instances` - Component functionality
- `/components/lifecycle` - Component lifecycle hooks
- `/components/rendering` - Templates & Data Context
- `/components/settings` - Component configuration
- `/components/state` - Component state management
- `/components/events` - **ESSENTIAL** Event handling patterns
- `/components/reactivity` - Reactivity in components
- `/components/dom` - DOM manipulation and querying
- `/components/styling` - Component styling approaches
- `/components/keys` - Keyboard bindings

#### **3. Templates** (Template system)
- `/templates` - Template overview and syntax
- `/templates/expressions` - **ESSENTIAL** Expression syntax and evaluation
- `/templates/conditionals` - If/else logic in templates
- `/templates/loops` - **ESSENTIAL** Each loops and iteration
- `/templates/slots` - Content projection
- `/templates/subtemplates` - Component composition
- `/templates/snippets` - **ESSENTIAL** Inline template fragments
- `/templates/helpers` - Global template helpers

#### **4. Reactivity** (Signals system)
- `/reactivity` - Reactivity overview
- `/reactivity/signals` - Signal primitives
- `/reactivity/reactions` - Reactive computations
- `/reactivity/mutation-helpers` - Array/object helpers
- `/reactivity/flush` - Update batching and timing
- `/reactivity/controls` - Controlling reactivity
- `/reactivity/performance` - Optimization strategies
- `/reactivity/debugging` - Debugging reactive code
- `/reactivity/signal-options` - Advanced signal configuration

#### **5. Query** (DOM helpers)
- `/query` - Query library overview
- `/query/basics` - Basic DOM querying
- `/query/shadow-dom` - **ESSENTIAL** Shadow DOM traversal
- `/query/components` - **ESSENTIAL** Component configuration (.settings, .initialize, .component)
- `/query/chaining` - Method chaining patterns
- `/query/browser` - Browser usage patterns

### API Reference (`sidebarMenuAPI`)

> **CANONICAL LOCATION**: All API documentation is at `/docs/src/pages/api/` organized by package and grouped by function.

#### **1. Components** (`/api/component/`)
- `/api/component/define-component` - Main component creation API
- `/api/component/utilities` - Component utility functions
- `/api/component/web-component-base` - Base web component class

#### **2. Template Helpers** (`/api/helpers/`)
- `/api/helpers/arrays` - Array manipulation helpers
- `/api/helpers/comparison` - Comparison and logic helpers
- `/api/helpers/css` - CSS and styling helpers
- `/api/helpers/dates` - Date formatting helpers
- `/api/helpers/debug` - Debugging helpers
- `/api/helpers/logical` - Logical operators
- `/api/helpers/numeric` - Number manipulation
- `/api/helpers/objects` - Object manipulation
- `/api/helpers/reactivity` - Reactivity helpers
- `/api/helpers/strings` - String manipulation

#### **3. Reactivity** (`/api/reactivity/`)
- `/api/reactivity/signal` - Signal implementation
- `/api/reactivity/reaction` - Reaction implementation
- `/api/reactivity/scheduler` - Update scheduling
- `/api/reactivity/dependency` - Dependency tracking
- `/api/reactivity/number-helpers` - Number signal helpers
- `/api/reactivity/boolean-helpers` - Boolean signal helpers
- `/api/reactivity/array-helpers` - Array signal helpers
- `/api/reactivity/collection-helpers` - Collection signal helpers
- `/api/reactivity/date-helpers` - Date signal helpers

#### **4. Query** (`/api/query/`)
- `/api/query/basic` - Basic querying methods
- `/api/query/attributes` - Attribute manipulation
- `/api/query/components` - **ESSENTIAL** Component methods (.settings, .initialize, etc.)
- `/api/query/content` - Content manipulation
- `/api/query/css` - CSS manipulation
- `/api/query/dimensions` - Size and positioning
- `/api/query/dom-manipulation` - DOM modification
- `/api/query/dom-traversal` - DOM navigation
- `/api/query/events` - Event handling
- `/api/query/iterators` - Collection iteration
- `/api/query/logical-operators` - Logic operations
- `/api/query/utilities` - Utility methods
- `/api/query/internal` - Internal methods

#### **5. Utils** (`/api/utils/`)
- `/api/utils/arrays` - Array utilities
- `/api/utils/browser` - Browser detection
- `/api/utils/cloning` - Object cloning
- `/api/utils/colors` - Color manipulation
- `/api/utils/crypto` - Cryptographic functions
- `/api/utils/dates` - Date utilities
- `/api/utils/equality` - Equality checking
- `/api/utils/errors` - Error handling
- `/api/utils/functions` - Function utilities
- `/api/utils/looping` - Iteration utilities
- `/api/utils/numbers` - Number utilities
- `/api/utils/objects` - Object utilities
- `/api/utils/types` - Type checking
- `/api/utils/regex` - Regular expressions
- `/api/utils/ssr` - Server-side rendering
- `/api/utils/strings` - String utilities

#### **6. Template Compiler** (`/api/templating/`)
- `/api/templating/template-compiler` - Template compilation
- `/api/templating/ast` - Abstract Syntax Tree
- `/api/templating/template` - Template class
- `/api/templating/string-scanner` - Template parsing

#### **7. Renderer** (`/api/renderer/`)
- `/api/renderer/lit-renderer` - Lit integration
- `/api/renderer/lit-directives` - Custom Lit directives

> **Note**: If a specific documentation path is not available, always refer to `/docs/src/helpers/menus.js` for the current menu structure.

---

## Semantic UI Search Patterns

### **Common Grep Patterns**

```bash
# Find all defineComponent usages
pattern="defineComponent" include="*.js" path="/docs/src/examples/"

# Find parent-child communication patterns
pattern="findParent|findChild" include="*.js" path="/docs/src/examples/"

# Find reactivity patterns
pattern="signal|reaction" include="*.js" path="/packages/reactivity/"

# Find design token usage
pattern="var\\(--" include="*.css" path="/src/"

# Find event handling patterns
pattern="events.*:" include="*.js" path="/docs/src/examples/"

# Find CSS class patterns
pattern="\\.[a-z-]+\\s*{" include="*.css" path="/src/components/"
```

### **Common Glob Patterns**

```bash
# Component examples
pattern="*component.js" path="/docs/src/examples/"

# All CSS files in components
pattern="*.css" path="/src/components/"

# Test files
pattern="*.test.js" path="/tests/"

# Token definition files
pattern="*.css" path="/src/css/tokens/"
```

---

## Tool Usage Strategies

### When to Use Each Tool

#### **Use `Read` tool when:**
- You know the exact file path
- Reading specific documentation files
- Examining individual source files
- Looking at specific examples

#### **Use `Grep` tool when:**
- Searching for specific code patterns
- Finding implementations of a feature
- Locating all files using a specific API
- Searching within a specific directory tree

#### **Use `Glob` tool when:**
- Finding files by name pattern
- Locating all files of a certain type
- Discovering related files

#### **Use `Task` tool when:**
- Complex multi-step investigations
- Need to search across multiple locations
- Uncertain about exact location
- Researching broad topics

### Validation Workflow

- Confirm you've retrieved the canonical documentation, examples, and source before editing.
- Map each required change to the files you just discovered so nothing is missed.
- After implementation, revisit the same references to verify behaviour and note any remaining gaps for handoff.

### Efficient Search Patterns

#### **For API Information:**
```bash
# 1. Check API documentation first (CANONICAL)
Read: /docs/src/pages/api/{package}/{function}
# 2. Find implementation
Grep: pattern="export.*{functionName}" include="*.js" path="/packages/"
# 3. Look for examples
Grep: pattern="{functionName}" include="*.js" path="/docs/src/examples/"
```

#### **For Component Examples:**
```bash
# 1. Check canonical examples
Glob: pattern="*{topic}*" path="/docs/src/examples/"
# 2. Search for usage patterns
Grep: pattern="{componentName}" include="*.html,*.js" path="/docs/src/examples/"
```

#### **For Implementation Details:**
```bash
# 1. Find main implementation
Read: /packages/{packageName}/src/
# 2. Check tests for usage
Grep: pattern="{feature}" include="*.test.js" path="/packages/{packageName}/test/"
```

---

## Documentation Locations

### User-Facing Documentation: `/docs/src/pages/`

#### **Top-Level Guides**
- `introduction.mdx` - Getting started, overview
- `guide.mdx` - Main user guide
- `expert-guide.mdx` - Advanced usage patterns
- `theming.mdx` - Styling and design system

#### **Component System** (`/docs/src/pages/components/`)
- `index.mdx` - Component overview and features
- `create.mdx` - Creating components with defineComponent
- `state.mdx` - Component state management
- `settings.mdx` - Component configuration
- `reactivity.mdx` - Reactivity in components
- `events.mdx` - **ESSENTIAL** Event handling patterns
- `keys.mdx` - Keyboard bindings
- `lifecycle.mdx` - Component lifecycle hooks
- `styling.mdx` - Component styling approaches
- `dom.mdx` - DOM manipulation and querying

#### **Template System** (`/docs/src/pages/templates/`)
- `index.mdx` - Template overview and syntax
- `expressions.mdx` - **ESSENTIAL** Expression syntax and evaluation
- `conditionals.mdx` - If/else logic in templates
- `loops.mdx` - **ESSENTIAL** Each loops and iteration
- `snippets.mdx` - **ESSENTIAL** Inline template fragments
- `subtemplates.mdx` - Component composition
- `slots.mdx` - Content projection
- `helpers.mdx` - Global template helpers

#### **Reactivity System** (`/docs/src/pages/reactivity/`)
- `index.mdx` - Reactivity overview
- `signals.mdx` - Signal primitives
- `reactions.mdx` - Reactive computations
- `mutation-helpers.mdx` - Array/object helpers
- `performance.mdx` - Optimization strategies
- `controls.mdx` - Controlling reactivity
- `debugging.mdx` - Debugging reactive code

#### **Query Library** (`/docs/src/pages/query/`)
- `index.mdx` - Query library overview
- `basics.mdx` - Basic DOM querying
- `shadow-dom.mdx` - **ESSENTIAL** Shadow DOM traversal
- `components.mdx` - **ESSENTIAL** Component configuration (.settings, .initialize, .component)
- `chaining.mdx` - Method chaining patterns

#### **API Reference** (`/docs/src/pages/api/`)
> **CANONICAL LOCATION**: All API documentation organized by package and function
```
api/
├── component/              ← defineComponent, utilities, web-component-base
├── reactivity/             ← Signal, Reaction, Dependency, helpers
├── templating/             ← Template, compiler, helpers
├── query/                  ← $, $$, DOM methods
├── renderer/               ← Lit integration
├── helpers/                ← Global template helpers
└── utils/                  ← Utility functions
```

### Finding Documentation

#### **By Topic:**
```bash
# Component creation
Read: /docs/src/pages/components/create.mdx

# Event handling
Read: /docs/src/pages/components/events.mdx

# Template syntax
Read: /docs/src/pages/templates/expressions.mdx

# API reference
Read: /docs/src/pages/api/{package}/index.mdx
```

#### **By Feature:**
```bash
# Settings configuration
Grep: pattern="settings" include="*.mdx" path="/docs/src/pages/"

# findParent/findChild usage
Grep: pattern="findParent|findChild" include="*.mdx" path="/docs/src/pages/"

# Template-as-settings
Grep: pattern="Template.*settings|settings.*Template" include="*.mdx" path="/docs/src/pages/"
```

---

## Source Code Locations

### Core Implementation: `/packages/`

#### **Component System** (`/packages/component/`)
```
component/
├── src/
│   ├── define-component.js     ← Main component creation API
│   ├── web-component.js        ← Base web component class + settings proxy
│   ├── index.js               ← Package exports
│   └── helpers/               ← Component utilities
├── test/                      ← Component tests
└── types/                     ← TypeScript definitions
```

#### **Reactivity System** (`/packages/reactivity/`)
```
reactivity/
├── src/
│   ├── signal.js              ← Signal implementation
│   ├── reaction.js            ← Reaction implementation  
│   ├── dependency.js          ← Dependency tracking
│   ├── scheduler.js           ← Update batching
│   └── index.js              ← Package exports
└── test/                     ← Reactivity tests
```

#### **Template System** (`/packages/templating/`)
```
templating/
├── src/
│   ├── template.js            ← Template class and lifecycle
│   ├── template-helpers.js    ← Global helpers
│   ├── compiler/
│   │   ├── template-compiler.js  ← **ESSENTIAL** AST compilation
│   │   └── string-scanner.js     ← Template parsing
│   └── index.js              ← Package exports
└── test/                     ← Template tests
```

#### **Query Library** (`/packages/query/`)
```
query/
├── src/
│   ├── query.js              ← **ESSENTIAL** Main query implementation
│   ├── node-wrapper.js      ← DOM node utilities
│   └── index.js             ← Package exports
└── test/                    ← Query tests
```

### Finding Implementation

#### **By Feature:**
```bash
# Settings reactivity implementation
Read: /packages/component/src/web-component.js
# Look for: createSettingsProxy, settingsVars

# Template compilation
Read: /packages/templating/src/compiler/template-compiler.js
# Look for: compile, parseEach, parseIf

# Signal implementation
Read: /packages/reactivity/src/signal.js
# Look for: get, set, mutation helpers

# Query shadow DOM crossing
Read: /packages/query/src/query.js
# Look for: querySelectorAllDeep, $$
```

#### **By Pattern:**
```bash
# Event handling implementation
Grep: pattern="attachEvent|addEventListener" include="*.js" path="/packages/"

# Template evaluation
Grep: pattern="evaluateExpression|evaluateConditional" include="*.js" path="/packages/"

# Component tree navigation
Grep: pattern="findParent|findChild" include="*.js" path="/packages/"
```

---

## Example Code Locations

### 🌟 **Canonical Examples**: `/docs/src/examples/`

#### **ESSENTIAL Examples** (Hand-written best practices)
```
examples/
├── todo-list/                 ← **BEST** Parent-child communication
├── component/
│   ├── templates/
│   │   ├── advanced-subtemplates/  ← **ESSENTIAL** Template-as-settings
│   │   ├── color-picker/      ← Template composition
│   │   ├── snippets/          ← Snippet usage patterns
│   │   └── subtemplates/      ← Component composition
│   ├── events/
│   │   ├── event-binding/     ← Event handler patterns
│   │   ├── event-data/        ← Data attribute handling
│   │   └── global-events/     ← Global event patterns
│   ├── complex/
│   │   ├── accordion/         ← Deep events, parent-child
│   │   ├── test-element/      ← Comprehensive component
│   │   └── clock/             ← Lifecycle and timers
│   ├── tabs/                  ← Component coordination
│   ├── context-menu/          ← Dynamic positioning
│   └── maximal/              ← Full-featured component
├── form-builder/             ← Dynamic forms
├── star-rating/              ← Interactive components
├── reactivity/
│   ├── birthday/             ← Reactivity concepts
│   ├── ball-simulation/      ← Performance patterns
│   └── template-reactivity/  ← Template reactivity
└── loops/                    ← Template iteration
```

#### **WARNING: AI-Generated Example** (Use with caution)
```
examples/component/dropdown/   ← Contains potential anti-patterns
```

### Finding Examples

#### **By Pattern:**
```bash
# Parent-child communication
Read: /docs/src/examples/todo-list/
Read: /docs/src/examples/component/complex/accordion/

# Template-as-settings
Read: /docs/src/examples/component/templates/advanced-subtemplates/

# Event handling
Read: /docs/src/examples/component/events/

# Reactivity patterns
Glob: pattern="*reactivity*" path="/docs/src/examples/"
```

#### **By Feature:**
```bash
# findParent/findChild usage
Grep: pattern="findParent|findChild" include="*.js" path="/docs/src/examples/"

# dispatchEvent patterns
Grep: pattern="dispatchEvent" include="*.js" path="/docs/src/examples/"

# Settings configuration
Grep: pattern="\.settings\(" include="*.js" path="/docs/src/examples/"

# Template syntax usage
Grep: pattern="#each|#if|>template" include="*.html" path="/docs/src/examples/"
```

---

## Configuration & Build Files

### Project Configuration
```
Root Level:
├── package.json               ← Main package configuration
├── dprint.json               ← Code formatting
├── meta.json                 ← Project metadata
└── scripts/                  ← Build utilities

Tests:
├── tests/configs/            ← Test configurations
├── tests/scripts/            ← Test utilities
└── tests/setup/              ← Test setup

Documentation:
├── docs/package.json         ← Docs site dependencies
├── docs/astro.config.mjs     ← Documentation site config
├── docs/src/helpers/menus.js ← **ESSENTIAL** Documentation menu structure
└── docs/tsconfig.json        ← TypeScript config
```

### Finding Configuration

#### **Build Process:**
```bash
# Main build config
Read: /package.json
Read: /scripts/

# Documentation build
Read: /docs/package.json
Read: /docs/astro.config.mjs

# Menu structure (ESSENTIAL for documentation order)
Read: /docs/src/helpers/menus.js

# Test configuration
Read: /tests/configs/
```

#### **Dependencies:**
```bash
# Framework dependencies
Grep: pattern="@semantic-ui" include="package.json" path="/"

# Development tools
Grep: pattern="vite|astro|playwright" include="package.json" path="/"
```

---

## Search Strategies by Topic

### Component Creation
```bash
1. Read: /docs/src/pages/components/create.mdx
2. Read: /docs/src/pages/api/component/define-component.mdx
3. Read: /packages/component/src/define-component.js
4. Grep: pattern="defineComponent" include="*.js" path="/docs/src/examples/"
5. Read: /docs/src/examples/component/minimal/
```

### Event Handling
```bash
1. Read: /docs/src/pages/components/events.mdx  # ESSENTIAL
2. Read: /docs/src/pages/api/query/events.mdx
3. Read: /packages/templating/src/template.js   # Implementation
4. Grep: pattern="events.*:" include="*.js" path="/docs/src/examples/"
5. Read: /docs/src/examples/component/events/
```

### Template Syntax
```bash
1. Read: /docs/src/pages/templates/expressions.mdx
2. Read: /docs/src/pages/templates/loops.mdx
3. Read: /docs/src/pages/api/templating/template-compiler.mdx
4. Read: /packages/templating/src/compiler/template-compiler.js
5. Grep: pattern="#each|#if|{>" include="*.html" path="/docs/src/examples/"
```

### Reactivity System
```bash
1. Read: /docs/src/pages/reactivity/index.mdx
2. Read: /docs/src/pages/api/reactivity/signal.mdx
3. Read: /packages/reactivity/src/signal.js
4. Read: /packages/reactivity/src/reaction.js
5. Read: /docs/src/examples/reactivity/
```

### Component Configuration
```bash
1. Read: /docs/src/pages/query/components.mdx  # ESSENTIAL
2. Read: /docs/src/pages/api/query/components.mdx
3. Grep: pattern="\.settings\(|\.initialize\(" include="*.js" path="/docs/src/examples/"
4. Read: /packages/query/src/query.js
5. Read: /docs/src/examples/component/templates/advanced-subtemplates/
```

### Parent-Child Communication
```bash
1. Read: /docs/src/examples/todo-list/         # BEST example
2. Grep: pattern="findParent|findChild" include="*.js" path="/docs/src/examples/"
3. Grep: pattern="dispatchEvent" include="*.js" path="/docs/src/examples/"
4. Read: /docs/src/examples/component/complex/accordion/
5. Read: /docs/src/pages/components/events.mdx # For event patterns
```

### Performance & Debugging
```bash
1. Read: /docs/src/pages/reactivity/performance.mdx
2. Read: /docs/src/pages/reactivity/debugging.mdx
3. Read: /docs/src/pages/api/reactivity/scheduler.mdx
4. Read: /docs/src/examples/reactivity/ball-simulation/
5. Grep: pattern="afterFlush|Reaction\.nonreactive" include="*.js" path="/packages/"
```

### Tailwind Integration
```bash
1. Read: /packages/tailwind/README.md                    # Plugin overview
2. Read: /packages/tailwind/AGENTS.md                    # Implementation details
3. Read: /packages/tailwind/node_modules/tailwindcss-iso/README.md  # WASM engine
4. Read: /ai/guides/components/generation.md#tailwind-css-integration
5. Grep: pattern="TailwindPlugin" include="*.js" path="/docs/src/examples/"
```

---

## Common Investigation Patterns

### "How do I..." Questions

#### **"How do I create a component?"**
```bash
1. Read: /docs/src/pages/components/create.mdx
2. Read: /docs/src/pages/api/component/define-component.mdx
3. Read: /docs/src/examples/component/minimal/component.js
4. Grep: pattern="defineComponent" include="*.js" path="/docs/src/examples/" | head -5
```

#### **"How do I handle events?"**
```bash
1. Read: /docs/src/pages/components/events.mdx
2. Read: /docs/src/pages/api/query/events.mdx
3. Read: /docs/src/examples/component/events/event-binding/
4. Grep: pattern="'click|'deep|'global" include="*.js" path="/docs/src/examples/"
```

#### **"How do I use templates?"**
```bash
1. Read: /docs/src/pages/templates/index.mdx
2. Read: /docs/src/pages/api/templating/template-compiler.mdx
3. Read: /docs/src/examples/component/templates/
4. Grep: pattern="template.*:" include="*.js" path="/docs/src/examples/"
```

### "Where is..." Questions

#### **"Where is [specific feature] implemented?"**
```bash
1. Grep: pattern="{feature}" include="*.js" path="/packages/"
2. Read: /packages/{likely-package}/src/
3. Grep: pattern="{feature}" include="*.test.js" path="/packages/"
4. Read: /docs/src/pages/api/{package}/
```

#### **"Where are examples of [pattern]?"**
```bash
1. Grep: pattern="{pattern}" include="*.js,*.html" path="/docs/src/examples/"
2. Task: "Find examples of {pattern} in the docs/src/examples directory"
```

### "Why does..." Questions

#### **"Why does [behavior] happen?"**
```bash
1. Read: /ai/semantic-ui-mental-model.md  # Design rationale
2. Grep: pattern="{behavior}" include="*.js" path="/packages/"
3. Read: Implementation file to understand logic
4. Read: /docs/src/pages/{relevant-section}/ # Conceptual explanation
```

#### **"Why is [pattern] recommended?"**
```bash
1. Read: /ai/semantic-ui-patterns-cookbook.md
2. Grep: pattern="{pattern}" include="*.mdx" path="/docs/src/pages/"
3. Read: /docs/src/examples/ # See canonical usage
```

### "What's the difference..." Questions

#### **"What's the difference between State and Settings?"**
```bash
1. Read: /docs/src/pages/components/state.mdx
2. Read: /docs/src/pages/components/settings.mdx
3. Read: /ai/semantic-ui-mental-model.md # Conceptual differences
4. Read: /docs/src/pages/api/component/ # API differences
```

#### **"What's the difference between $ and $$?"**
```bash
1. Read: /docs/src/pages/query/shadow-dom.mdx
2. Read: /docs/src/pages/api/query/basic.mdx
3. Read: /packages/query/src/query.js
4. Read: /docs/src/examples/query/dom/shadow-dom/
```

---

## Quick Reference for Common Needs

### **Need to understand concepts?** 
→ `/ai/semantic-ui-mental-model.md`

### **Need API reference?** 
→ `/docs/src/pages/api/` (CANONICAL) or `/ai/semantic-ui-quick-reference.md`

### **Need code patterns?** 
→ `/ai/semantic-ui-patterns-cookbook.md`

### **Need implementation details?** 
→ `/packages/{package}/src/`

### **Need usage examples?** 
→ `/docs/src/examples/`

### **Need documentation?** 
→ `/docs/src/pages/` (read in menu order from `/docs/src/helpers/menus.js`)

### **Need to debug?** 
→ Search for `.test.js` files + implementation

### **Need menu structure?**
→ `/docs/src/helpers/menus.js` (ESSENTIAL for documentation navigation order)

---

**Remember**: 
1. **Always start with documentation** (`/docs/src/pages/`) in menu order from `menus.js`
2. **API documentation is CANONICAL** at `/docs/src/pages/api/` organized by package
3. **Use canonical examples** (`/docs/src/examples/`) before diving into implementation 
4. **Use the `Task` tool** for complex investigations that span multiple locations
5. **Refer to `menus.js`** if specific documentation paths are not available
