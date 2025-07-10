# Documentation Review Checklist

## Review Progress Tracking

### Framework Documentation (`sidebarMenuFramework`)

#### Introduction
- [ ] `/introduction` - Introduction page

#### Components (11 pages)
- [ ] `/components` - Overview
- [ ] `/components/create` - Creating
- [ ] `/components/instances` - Functionality
- [ ] `/components/lifecycle` - Lifecycle
- [ ] `/components/rendering` - Templates & Data
- [ ] `/components/settings` - Settings
- [ ] `/components/state` - State
- [ ] `/components/events` - Events
- [ ] `/components/reactivity` - Reactivity
- [ ] `/components/dom` - DOM
- [ ] `/components/styling` - Styling
- [ ] `/components/keys` - Key Bindings

#### Templates (8 pages)
- [ ] `/templates` - Overview
- [ ] `/templates/expressions` - Expressions
- [ ] `/templates/conditionals` - Conditionals
- [ ] `/templates/loops` - Loops
- [ ] `/templates/async` - Async
- [ ] `/templates/slots` - Slots
- [ ] `/templates/subtemplates` - Subtemplates
- [ ] `/templates/snippets` - Snippets
- [ ] `/templates/helpers` - Helpers

#### Reactivity (9 pages)
- [ ] `/reactivity` - Overview
- [ ] `/reactivity/signals` - Signals
- [ ] `/reactivity/dependent-signals` - Dependent Signals
- [ ] `/reactivity/reactions` - Reactions
- [ ] `/reactivity/mutation-helpers` - Mutations
- [ ] `/reactivity/flush` - Flushing
- [ ] `/reactivity/controls` - Reactive Controls
- [ ] `/reactivity/performance` - Performance
- [ ] `/reactivity/debugging` - Debugging
- [ ] `/reactivity/signal-options` - Advanced Options

#### Query (5 pages)
- [ ] `/query` - Overview
- [ ] `/query/basics` - Basics
- [ ] `/query/shadow-dom` - Shadow DOM
- [ ] `/query/components` - Components
- [ ] `/query/chaining` - Chaining
- [ ] `/query/browser` - Browser Usage

#### Advanced Usage (2 pages)
- [ ] `/advanced/common-issues` - Common Issues
- [ ] `/advanced/ssr` - Server Side Rendering

### API Reference (`sidebarMenuAPI`)

#### Components API (3 pages)
- [ ] `/api/component` - Overview
- [ ] `/api/component/define-component` - Define Component
- [ ] `/api/component/utilities` - Utility Functions
- [ ] `/api/component/web-component-base` - Base Class

#### Template Helpers (10 pages)
- [ ] `/api/helpers` - Overview
- [ ] `/api/helpers/arrays` - Arrays
- [ ] `/api/helpers/comparison` - Comparison
- [ ] `/api/helpers/css` - CSS
- [ ] `/api/helpers/dates` - Dates
- [ ] `/api/helpers/debug` - Debug
- [ ] `/api/helpers/logical` - Logical Operators
- [ ] `/api/helpers/numeric` - Numeric
- [ ] `/api/helpers/objects` - Objects
- [ ] `/api/helpers/reactivity` - Reactivity
- [ ] `/api/helpers/strings` - Strings

#### Reactivity API (9 pages)
- [ ] `/api/reactivity` - Overview
- [ ] `/api/reactivity/signal` - Signal
- [ ] `/api/reactivity/reaction` - Reaction
- [ ] `/api/reactivity/scheduler` - Scheduler
- [ ] `/api/reactivity/dependency` - Dependency
- [ ] `/api/reactivity/number-helpers` - Number Helpers
- [ ] `/api/reactivity/boolean-helpers` - Boolean Helpers
- [ ] `/api/reactivity/array-helpers` - Array Helpers
- [ ] `/api/reactivity/collection-helpers` - Collection Helpers
- [ ] `/api/reactivity/date-helpers` - Date Helpers

#### Query API (12 pages)
- [ ] `/api/query` - Overview
- [ ] `/api/query/basic` - Basic Usage
- [ ] `/api/query/attributes` - Attributes
- [ ] `/api/query/components` - Components
- [ ] `/api/query/content` - Content
- [ ] `/api/query/css` - CSS
- [ ] `/api/query/dimensions` - Size & Dimensions
- [ ] `/api/query/dom-manipulation` - DOM Manipulation
- [ ] `/api/query/dom-traversal` - DOM Traversal
- [ ] `/api/query/events` - Events
- [ ] `/api/query/iterators` - Iterators
- [ ] `/api/query/logical-operators` - Logical Operators
- [ ] `/api/query/utilities` - Utilities
- [ ] `/api/query/internal` - Internal

#### Utils API (16 pages)
- [ ] `/api/utils` - Overview
- [ ] `/api/utils/arrays` - Arrays
- [ ] `/api/utils/browser` - Browser
- [ ] `/api/utils/cloning` - Cloning
- [ ] `/api/utils/colors` - Colors
- [ ] `/api/utils/crypto` - Crypto
- [ ] `/api/utils/dates` - Dates
- [ ] `/api/utils/equality` - Equality
- [ ] `/api/utils/errors` - Errors
- [ ] `/api/utils/functions` - Functions
- [ ] `/api/utils/looping` - Looping
- [ ] `/api/utils/numbers` - Numbers
- [ ] `/api/utils/objects` - Objects
- [ ] `/api/utils/types` - Types
- [ ] `/api/utils/regex` - Regular Expressions
- [ ] `/api/utils/ssr` - SSR
- [ ] `/api/utils/strings` - Strings

#### Template Compiler (4 pages)
- [ ] `/api/templating` - Overview
- [ ] `/api/templating/template-compiler` - Template Compiler
- [ ] `/api/templating/ast` - Abstract Syntax Tree (AST)
- [ ] `/api/templating/template` - Template
- [ ] `/api/templating/string-scanner` - String Scanner

#### Renderer (2 pages)
- [ ] `/api/renderer` - Overview
- [ ] `/api/renderer/lit-renderer` - Lit Renderer
- [ ] `/api/renderer/lit-directives` - Lit Directives

### UI Components (`sidebarMenuUI`)

#### Usage (2 pages)
- [ ] `/usage` - Overview
- [ ] `/usage/html` - HTML Usage
- [ ] `/usage/framework` - Framework Usage

#### UI Primitives
- [ ] `/ui` - Overview
- [ ] Individual component pages (dynamic list)

## Summary
Total pages to review: ~95 pages

## Notes
- Check each page for patterns identified in `doc-ai-slop-identification-guide.md`
- Record specific issues in `doc-poor-writing-review-list.md`
- Focus on removal over rewriting
- Compare against examples in `doc-good-writing-examples.md`