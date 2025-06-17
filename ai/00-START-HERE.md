# Semantic UI AI Documentation Hub

**For:** AI agents working with the Semantic UI web component framework  
**Purpose:** Navigate framework documentation and resolve development tasks efficiently

---

## Framework Overview

Semantic UI is a modern web component framework built on web standards with signals-based reactivity. It provides shadow DOM encapsulated components with automatic dependency tracking, component tree navigation, and template-driven development.

**Core Philosophy:** Web standards first, progressive enhancement, signals-based reactivity.

---

## Quick Task Resolution

### 🚀 **Building Components**
**Need to:** Create, modify, or understand components  
**Start with:** [`guides/component-generation-instructions.md`](./guides/component-generation-instructions.md)  
**Contains:** Complete component creation patterns, lifecycle, templates, events

### 🧠 **Understanding Architecture** 
**Need to:** Grasp framework concepts, mental models, design decisions  
**Start with:** [`foundations/mental-model.md`](./foundations/mental-model.md)  
**Contains:** Core philosophy, component lifecycle, reactivity system, Shadow DOM

### 🔍 **Finding Code & Documentation**
**Need to:** Locate files, APIs, examples in the codebase  
**Start with:** [`foundations/codebase-navigation-guide.md`](./foundations/codebase-navigation-guide.md)  
**Contains:** File structure, search strategies, tool usage, canonical sources

### ⚡ **API Reference & Syntax**
**Need to:** Quick lookup of method signatures, event syntax, template syntax  
**Start with:** [`foundations/quick-reference.md`](./foundations/quick-reference.md)  
**Contains:** Complete API reference, decision flowcharts, common recipes

### 🎯 **Implementation Patterns**
**Need to:** Best practices, common patterns, advanced techniques  
**Start with:** [`guides/patterns-cookbook.md`](./guides/patterns-cookbook.md)  
**Contains:** Communication patterns, state management, event handling, performance

### 🎨 **HTML & CSS Guidelines**
**Need to:** Writing templates, styling components, design tokens  
**Start with:** [`guides/html-css-style-guide.md`](./guides/html-css-style-guide.md)  
**Contains:** Template patterns, CSS architecture, design token usage

### 🔄 **Reactivity System** (Standalone Library)
**Need to:** Understand signals, reactions, dependency tracking  
**Start with:** [`specialized/reactivity-system-guide.md`](./specialized/reactivity-system-guide.md)  
**Contains:** Signal API, Reaction API, standalone usage, performance optimization

### 🔍 **DOM Querying & Manipulation** (Standalone Library)
**Need to:** Query DOM, handle Shadow DOM, configure components  
**Start with:** [`specialized/query-system-guide.md`](./specialized/query-system-guide.md)  
**Contains:** $ vs $$ usage, component configuration, event handling

### 🛠️ **Utility Functions** (Standalone Library)
**Need to:** Array processing, object manipulation, type checking, formatting  
**Start with:** [`specialized/utils-package-guide.md`](./specialized/utils-package-guide.md)  
**Contains:** Complete utility library reference, performance patterns

---

## Context Loading Strategies

### **Framework Newcomer Context**
Essential context for understanding Semantic UI architecture and patterns:
1. [`foundations/mental-model.md`](./foundations/mental-model.md) - Core concepts and philosophy
2. [`guides/component-generation-instructions.md`](./guides/component-generation-instructions.md) - Component creation patterns
3. [`foundations/quick-reference.md`](./foundations/quick-reference.md) - API reference

### **Component Development Context**
Context for building and modifying components:
1. [`guides/component-generation-instructions.md`](./guides/component-generation-instructions.md) - Complete creation patterns
2. [`guides/patterns-cookbook.md`](./guides/patterns-cookbook.md) - Communication and state patterns
3. [`guides/html-css-style-guide.md`](./guides/html-css-style-guide.md) - Styling conventions
4. **Tailwind Integration**:
   - [`../packages/tailwind/README.md`](../packages/tailwind/README.md) - Plugin overview
   - [`../packages/tailwind/AGENTS.md`](../packages/tailwind/AGENTS.md) - Technical implementation

### **Advanced Architecture Context**
Context for complex implementation and debugging:
1. [`foundations/mental-model.md`](./foundations/mental-model.md) - Deep architectural understanding
2. [`guides/patterns-cookbook.md`](./guides/patterns-cookbook.md) - Advanced patterns and anti-patterns
3. [`specialized/reactivity-system-guide.md`](./specialized/reactivity-system-guide.md) - Reactive programming
4. [`specialized/query-system-guide.md`](./specialized/query-system-guide.md) - DOM manipulation

### **Standalone Package Context**
Context for using individual packages outside the framework:
1. [`specialized/reactivity-system-guide.md`](./specialized/reactivity-system-guide.md) - Independent reactive state
2. [`specialized/query-system-guide.md`](./specialized/query-system-guide.md) - Shadow DOM-aware querying
3. [`specialized/utils-package-guide.md`](./specialized/utils-package-guide.md) - Utility functions

### **Problem Solving Context**
Context for debugging and finding solutions:
1. [`foundations/codebase-navigation-guide.md`](./foundations/codebase-navigation-guide.md) - Locating information
2. [`foundations/quick-reference.md`](./foundations/quick-reference.md) - Quick syntax lookup

---

## Document Descriptions

| Document | Focus | Audience | Content Type |
|----------|--------|----------|--------------|
| **mental-model.md** | Architecture & Concepts | All levels | Conceptual |
| **component-generation-instructions.md** | Component Creation | Beginners to Intermediate | Tutorial + Reference |
| **patterns-cookbook.md** | Best Practices | Intermediate to Advanced | Patterns + Examples |
| **quick-reference.md** | API Lookup | All levels | Reference |
| **reactivity-system-guide.md** | Signals & Reactions | Intermediate | Tutorial + Reference |
| **query-system-guide.md** | DOM Manipulation | Intermediate | Tutorial + Reference |
| **html-css-style-guide.md** | Styling & Templates | All levels | Guidelines + Examples |
| **utils-package-guide.md** | Utility Functions | All levels | Reference |
| **codebase-navigation-guide.md** | Finding Information | All levels | Navigation Guide |

---

## Decision Trees

### "I need to..."

```
Create a new component?
├── Simple component → component-generation-instructions.md
├── Complex interactions → patterns-cookbook.md (Component Communication)
└── Custom styling → html-css-style-guide.md

Understand an error or behavior?
├── Find where code is located → codebase-navigation-guide.md
├── Understand the concept → mental-model.md
└── Look up API syntax → quick-reference.md

Handle component communication?
├── Parent-child coordination → patterns-cookbook.md (Communication Patterns)
├── Event handling → component-generation-instructions.md (Events)
└── State sharing → mental-model.md (Component Tree Navigation)

Work with reactivity?
├── Basic state management → component-generation-instructions.md (State)
├── Advanced reactive patterns → reactivity-system-guide.md
└── Performance optimization → patterns-cookbook.md (Performance)

Style components?
├── Basic CSS patterns → html-css-style-guide.md
├── Design token usage → html-css-style-guide.md (CSS Custom Properties)
└── Component-specific styling → component-generation-instructions.md (CSS)

Query and manipulate DOM?
├── Basic querying → query-system-guide.md (Basic Operations)
├── Shadow DOM traversal → query-system-guide.md (Deep Querying)
└── Component configuration → query-system-guide.md (Component Methods)
```

---

## Tips for AI Agents

### **Context Management**
- Each document is designed for ~8K context windows
- Cross-references indicate related content without duplicating it
- Start with the most specific document for your task

### **Information Hierarchy**
1. **Quick Reference** - API syntax and signatures
2. **Guides** - How-to instructions and tutorials  
3. **Patterns** - Best practices and advanced techniques
4. **Architecture** - Concepts and mental models

### **Common Workflows**
- **Unknown Error:** codebase-navigation-guide.md → Find implementation → mental-model.md for context
- **New Feature:** mental-model.md → component-generation-instructions.md → patterns-cookbook.md
- **Code Review:** patterns-cookbook.md → html-css-style-guide.md → quick-reference.md

### **Search Strategy**
- Use codebase-navigation-guide.md for file locations
- Use quick-reference.md for API signatures
- Use patterns-cookbook.md for implementation examples
- Use mental-model.md for "why" questions

---

## External References

- **Live Examples:** `/docs/src/examples/` (canonical component examples)
- **API Documentation:** `/docs/src/pages/api/` (complete API reference)  
- **Source Code:** `/packages/` (framework implementation)
- **Component Library:** `/src/components/` (design system components)

---

**Last Updated:** Framework architecture documentation complete and current  
**Maintenance:** Update this file when adding new documentation or changing structure