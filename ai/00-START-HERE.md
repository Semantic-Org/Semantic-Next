# Semantic UI AI Documentation Hub

**For:** AI agents working with the Semantic UI web component framework  
**Purpose:** Navigate framework documentation and resolve development tasks efficiently

---

## Framework Overview

Semantic UI is a modern web component framework built on web standards with signals-based reactivity. It provides shadow DOM encapsulated components with automatic dependency tracking, component tree navigation, and template-driven development.

**Core Philosophy:** Web standards first, progressive enhancement, signals-based reactivity.

---

## Task Routing - REQUIRED FIRST STEP

**BEFORE proceeding with any task:**

1. Read `/ai/meta/workflows-manifest.json` to check if your task matches an existing workflow
2. If a workflow matches, read that workflow file and follow it exactly
3. If no workflow matches, proceed to "Quick Task Resolution" below

Workflows contain required steps (testing, types, exports, documentation) that are easy to miss without following the complete process.

---

## Task Assurance Loop

1. Confirm the user request, required workflows, and prerequisite context.
2. Load the canonical references (documentation, examples, source) relevant to the task.
3. Outline a lightweight plan when the work spans multiple steps or files.
4. Implement only what the request covers, following established Semantic UI patterns.
5. Verify the result against canonical sources, required tests, or workflows and reconcile with the original ask.
6. Surface unresolved questions or dependencies immediately so the requester can confirm next steps.

---

## Quick Task Resolution

### Building Components
**Need to:** Create, modify, or understand components for any application
**Start with:** [Component Generation Guide](/ai/guides/components/creating-components.md)
**Contains:** Framework usage patterns, component architecture, implementation best practices

### Creating Documentation Examples
**Need to:** Add examples to the documentation system
**Start with:** [Example Authoring Guide](/ai/documentation/authoring/example-authoring.md)
**Contains:** Metadata system, playground behavior, file organization, step-by-step workflows

### Package API Documentation
**Need to:** Understand package APIs (reactivity, utils, query, templating, specs)
**Start with:** [Packages Directory](/ai/packages/)
**Contains:** Complete API reference for all standalone packages

### Understanding Architecture
**Need to:** Grasp framework concepts, mental models, design decisions  
**Start with:** [`foundations/mental-model.md`](./foundations/mental-model.md)  
**Contains:** Core philosophy, component lifecycle, reactivity system, Shadow DOM

### Finding Code & Documentation
**Need to:** Locate files, APIs, examples in the codebase  
**Start with:** [`foundations/codebase-navigation-guide.md`](./foundations/codebase-navigation-guide.md)  
**Contains:** File structure, search strategies, tool usage, canonical sources

### API Reference & Syntax
**Need to:** Quick lookup of method signatures, event syntax, template syntax  
**Start with:** [`foundations/quick-reference.md`](./foundations/quick-reference.md)  
**Contains:** Complete API reference, decision flowcharts, common recipes

### Implementation Patterns
**Need to:** Best practices, common patterns, advanced techniques
**Start with:** [Component Authoring Best Practices](/ai/guides/components/component-authoring-best-practices.md)
**Look at:** `/src/components/` (panels, global-search, nav-menu, inpage-menu, mobile-menu)
**Contains:** Communication patterns, state management, event handling, performance, production examples

### Testing & Quality Assurance
**Need to:** Write tests, understand test organization, choose test types
**Start with:** [Testing Guide](/ai/guides/development/testing.md)
**Contains:** Test types (unit/DOM/browser), file organization, running tests, writing patterns

### TypeScript Types & JSDoc
**Need to:** Add type definitions, write JSDoc comments, understand DX requirements
**Start with:** [TypeScript Types Guide](/ai/guides/development/typescript-types.md)
**Contains:** JSDoc patterns, type organization, documentation links, examples

### Build System & Tooling
**Need to:** Understand build commands, modify build scripts, add build outputs, debug build issues
**Start with:** [Build System Guide](/ai/guides/development/build-system.md)
**Contains:** Two-system architecture (JS libraries vs web components), build commands reference, esbuild plugins, export conditions, wireit orchestration, common workflows, idiosyncrasies

### Code Formatting & Style
**Need to:** Understand formatting rules, comment hierarchy, code style conventions
**Start with:** [Code Formatting Guide](/ai/guides/development/code-formatting.md)
**Contains:** dprint configuration, three-level comment hierarchy, formatting best practices

### HTML & CSS Guidelines
**Need to:** Writing templates, styling components, design tokens, theming
**Start with:** [HTML Guide](/ai/guides/html/style-guide.md) • [CSS Guide](/ai/guides/css/css-guide.md) • [Theming](/ai/guides/css/theming.md) • [CSS Tokens](/ai/guides/css/tokens/token-usage.md)
**Contains:** Template patterns, CSS architecture, theme system, design token usage

### Reactivity System (Standalone Library)
**Need to:** Understand signals, reactions, dependency tracking
**Start with:** [Reactivity Package](/ai/packages/reactivity.md)
**Contains:** Signal API, Reaction API, standalone usage, performance optimization

### DOM Querying & Manipulation (Standalone Library)
**Need to:** Query DOM, handle Shadow DOM, configure components
**Start with:** [Query Package](/ai/packages/query.md)
**Contains:** $ vs $$ usage, component configuration, event handling

### Utility Functions (Standalone Library)
**Need to:** Array processing, object manipulation, type checking, formatting
**Start with:** [Utils Package](/ai/packages/utils.md)
**Contains:** Complete utility library reference, performance patterns

### Workflow Decision Tree
Choose the workflow that matches your task:

- **Need to scaffold a new UI primitive?** → [`/ai/workflows/components/scaffold-primitive.md`](/ai/workflows/components/scaffold-primitive.md)
- **Need a new or updated component spec?** → [`/ai/workflows/components/define-primitive-spec.md`](/ai/workflows/components/define-primitive-spec.md)
- **Implement CSS from an approved spec?** → [`/ai/workflows/components/implement-primitive-css.md`](/ai/workflows/components/implement-primitive-css.md)
- **Add or enhance a package utility function?** → [`/ai/workflows/utils/add-util-function.md`](/ai/workflows/utils/add-util-function.md)
- **Create or refine documentation examples?** → [`/ai/workflows/documentation/refine-example-documentation-copy.md`](/ai/workflows/documentation/refine-example-documentation-copy.md)
- **Introduce new template syntax?** → [`/ai/workflows/templates/add-template-syntax.md`](/ai/workflows/templates/add-template-syntax.md)
- **Add Query package methods?** → [`/ai/workflows/query/add-query-method.md`](/ai/workflows/query/add-query-method.md)
- **Publish a new AI context guide?** → [`/ai/workflows/meta/add-ai-context.md`](/ai/workflows/meta/add-ai-context.md)

### Following Workflows
**Need to:** Step-by-step processes for specific tasks
**Start with:** [Workflows Directory](/ai/workflows/)
**Contains:** Primitive scaffolding, component authoring, CSS implementation, template syntax addition, agent creation, documentation refinement, utility function addition

---

## Context Loading Strategies

### **Framework Newcomer Context**
Essential context for understanding Semantic UI architecture and patterns:
1. [Mental Model](/ai/foundations/mental-model.md) - Core concepts and philosophy
2. [Component Generation Guide](/ai/guides/components/creating-components.md) - Component creation patterns
3. [Quick Reference](/ai/foundations/quick-reference.md) - API reference

### **Component Development Context**
Context for building components for any application:
1. [Component Generation Guide](/ai/guides/components/creating-components.md) - Framework usage and architecture patterns
2. [Component Patterns Cookbook](/ai/guides/components/component-authoring-best-practices.md) - Communication and state patterns
3. [HTML Guide](/ai/guides/html/style-guide.md) + [CSS Guide](/ai/guides/css/css-guide.md) - Markup and styling conventions
4. **Tailwind Integration**:
   - [../packages/tailwind/README.md](../packages/tailwind/README.md) - Plugin overview
   - [../packages/tailwind/AGENTS.md](../packages/tailwind/AGENTS.md) - Technical implementation

### **Documentation Creation Context**
Context for creating examples and documentation:
1. [Example Authoring Guide](/ai/documentation/authoring/example-authoring.md) - Complete example metadata system and docs requirements
2. [Package Documentation](/ai/packages/) - Package API demonstrations and references
3. [Component Generation Guide](/ai/guides/components/creating-components.md) - Component implementation patterns

### **Advanced Architecture Context**
Context for complex implementation and debugging:
1. [Mental Model](/ai/foundations/mental-model.md) - Deep architectural understanding
2. [Component Patterns Cookbook](/ai/guides/components/component-authoring-best-practices.md) - Advanced patterns and anti-patterns
3. [Reactivity Package](/ai/packages/reactivity.md) - Reactive programming
4. [Query Package](/ai/packages/query.md) - DOM manipulation

### **Standalone Package Context**
Context for using individual packages outside the framework:
1. [Reactivity Package](/ai/packages/reactivity.md) - Independent reactive state
2. [Query Package](/ai/packages/query.md) - Shadow DOM-aware querying
3. [Utils Package](/ai/packages/utils.md) - Utility functions
4. [Templating Package](/ai/packages/templating.md) - Template system
5. [Specs Package](/ai/packages/specs.md) - Component specifications

### **Problem Solving Context**
Context for debugging and finding solutions:
1. [`foundations/codebase-navigation-guide.md`](./foundations/codebase-navigation-guide.md) - Locating information
2. [`foundations/quick-reference.md`](./foundations/quick-reference.md) - Quick syntax lookup

---

## Document Descriptions

| Document | Focus | Audience | Content Type |
|----------|--------|----------|--------------|
| **mental-model.md** | Architecture & Concepts | All levels | Conceptual |
| **guides/components/creating-components.md** | Component Creation | Beginners to Intermediate | Tutorial + Reference |
| **guides/components/component-authoring-best-practices.md** | Best Practices | Intermediate to Advanced | Patterns + Examples |
| **/ai/guides/development/testing.md** | Testing & QA | All levels | Guidelines + Patterns |
| **/ai/guides/development/typescript-types.md** | TypeScript & JSDoc | All levels | Guidelines + Examples |
| **quick-reference.md** | API Lookup | All levels | Reference |
| **packages/reactivity.md** | Signals & Reactions | Intermediate | Tutorial + Reference |
| **packages/query.md** | DOM Manipulation | Intermediate | Tutorial + Reference |
| **guides/html/style-guide.md** | HTML & Templates | All levels | Guidelines + Examples |
| **guides/html/using-ui-primitives.md** | UI Primitives | All levels | Guidelines + Examples |
| **/ai/guides/css/css-guide.md** | CSS Architecture | All levels | Guidelines + Examples |
| **packages/utils.md** | Utility Functions | All levels | Reference |
| **codebase-navigation-guide.md** | Finding Information | All levels | Navigation Guide |

---

## Decision Trees

### "I need to..."

```
Create a new component?
├── Simple component → guides/components/creating-components.md
├── Complex interactions → guides/components/component-authoring-best-practices.md (Component Communication)
└── Custom styling → guides/html/style-guide.md + guides/styling/css-guide.md

Understand an error or behavior?
├── Find where code is located → foundations/codebase-navigation-guide.md
├── Understand the concept → foundations/mental-model.md
└── Look up API syntax → foundations/quick-reference.md

Handle component communication?
├── Parent-child coordination → guides/components/component-authoring-best-practices.md (Communication Patterns)
├── Event handling → guides/components/creating-components.md (Events)
└── State sharing → foundations/mental-model.md (Component Tree Navigation)

Work with reactivity?
├── Basic state management → guides/components/creating-components.md (State)
├── Advanced reactive patterns → packages/reactivity.md
└── Performance optimization → guides/components/component-authoring-best-practices.md (Performance)

Write or run tests?
├── Test organization → guides//ai/guides/development/testing.md (Test Organization)
├── Choose test type → guides//ai/guides/development/testing.md (Test Types)
├── Write tests → guides//ai/guides/development/testing.md (Writing Tests)
└── Package-specific patterns → guides//ai/guides/development/testing.md (Package-Specific Patterns)

Add TypeScript types?
├── JSDoc patterns → guides/typescript-types.md (JSDoc Requirements)
├── Type organization → guides/typescript-types.md (Type File Organization)
├── Function types → guides/typescript-types.md (Type Patterns)
└── Examples & best practices → guides/typescript-types.md (Common Scenarios)

Work with the build system?
├── Understand build commands → guides/development/build-system.md (Build Commands Reference)
├── Modify build scripts → guides/development/build-system.md (Build Scripts Deep Dive)
├── Debug build issues → guides/development/build-system.md (Common Workflows)
└── Add new build outputs → guides/development/build-system.md (Export Conditions Strategy)

Style components?
├── Basic CSS patterns → guides/html/style-guide.md + guides/styling/css-guide.md
├── Design token usage → guides/styling/tokens/token-usage.md
└── Component-specific styling → guides/components/creating-components.md (CSS)

Query and manipulate DOM?
├── Basic querying → packages/query.md (Basic Operations)
├── Shadow DOM traversal → packages/query.md (Deep Querying)
└── Component configuration → packages/query.md (Component Methods)
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
- **Unknown Error:** foundations/codebase-navigation-guide.md → Find implementation → foundations/mental-model.md for context
- **New Feature:** foundations/mental-model.md → guides/components/creating-components.md → guides/components/component-authoring-best-practices.md
- **Code Review:** guides/components/component-authoring-best-practices.md → guides/styling/css-guide.md → foundations/quick-reference.md

### **Search Strategy**
- Use foundations/codebase-navigation-guide.md for file locations
- Use foundations/quick-reference.md for API signatures
- Use guides/components/component-authoring-best-practices.md for implementation examples
- Use foundations/mental-model.md for "why" questions

---

## External References

- **Live Examples:** `/docs/src/examples/` (canonical component examples)
- **API Documentation:** `/docs/src/pages/api/` (complete API reference)
- **Source Code:** `/packages/` (framework implementation)
- **Component Library:** `/src/components/` (design system components)

---

## Complete AI Documentation Structure

For exploratory browsing, here's the complete directory taxonomy:

```
ai/
├── 00-START-HERE.md           ← You are here - main navigation hub
├── foundations/               ← Core concepts (no prerequisites)
│   ├── mental-model.md        ← Architecture and philosophy
│   ├── quick-reference.md     ← API syntax lookup
│   └── codebase-navigation-guide.md  ← Finding files and code
├── guides/                    ← Implementation guides
│   ├── components/            ← Component development
│   │   ├── creating-components.md ← Creating components
│   │   └── component-authoring-best-practices.md        ← Best practices and patterns
│   ├── css/                   ← CSS and design
│   │   ├── css-guide.md       ← CSS architecture
│   │   └── tokens/            ← Design token system
│   │       ├── architecture.md    ← Token system design
│   │       ├── token-usage.md     ← How to use tokens
│   │       └── token-reference.md ← Token lookup table
│   ├── html/                  ← HTML and templates
│   │   ├── style-guide.md     ← Semantic markup patterns
│   │   └── using-ui-primitives.md ← UI primitive composition
│   ├── query/                 ← Query library guides
│   │   └── plugins-and-behaviors.md  ← Plugins & behaviors
│   └── development/           ← Development practices
│       ├── /ai/guides/development/testing.md         ← Testing & QA
│       └── typescript-types.md ← TypeScript & JSDoc
├── packages/                  ← Standalone package documentation
│   ├── reactivity.md          ← Signals and reactions
│   ├── query.md               ← DOM querying
│   ├── utils.md               ← Utility functions
│   ├── templating.md          ← Template system
│   └── specs.md               ← Component specifications
├── documentation/             ← Documentation guidelines
│   ├── authoring/             ← Creating documentation
│   │   └── example-authoring.md  ← Example creation guide
│   └── writing/               ← Content quality
│       ├── page-writing.md        ← Page writing guidelines
│       ├── evaluation-persona.md  ← Review standards
│       ├── good-examples.md       ← Quality examples
│       ├── slop-identification.md ← AI-generated content detection
│       ├── link-grammar.md        ← Link and grammar rules
│       └── rewrite-instructions.md← Content improvement guide
├── workflows/                 ← Step-by-step processes
│   ├── agents/                ← Agent workflows
│   │   └── create-subagent-context.md  ← Subagent creation
│   ├── components/            ← Component workflows
│   │   ├── scaffold-primitive.md       ← Scaffold UI primitive
│   │   ├── define-primitive-spec.md    ← Spec authoring
│   │   └── implement-primitive-css.md  ← CSS implementation
│   ├── documentation/         ← Documentation workflows
│   │   └── refine-example-documentation-copy.md ← Doc refinement
│   ├── templates/             ← Template workflows
│   │   └── add-template-syntax.md      ← Adding syntax
│   └── utils/                 ← Utility workflows
│       └── add-util-function.md        ← Function addition
├── tools/                     ← Development tools
│   ├── subagents/             ← Agent coordination system
│   │   ├── orchestrator.md        ← Orchestrator agent
│   │   ├── domain/                ← Domain-specific agents
│   │   ├── process/               ← Process-specific agents
│   │   └── [agent specs...]       ← Agent specifications
│   ├── scripts/               ← Automation scripts
│   │   └── update-markdown-links.sh  ← Link update utility
│   └── mcp/                   ← Model Context Protocol integrations
└── meta/                      ← Meta-documentation
    ├── context-loading-instructions.md  ← How to use this system
    └── agent-guestbook.md     ← Agent learning and continuity
```

---

**Last Updated:** Framework architecture documentation complete and current
**Maintenance:** Update this file when adding new documentation or changing structure
