# Semantic UI Expert Technical Guide

> **For:** AI agents operating as Semantic UI technical experts for documentation editing and advanced technical assistance  
> **Prerequisites:** Complete understanding of web components, signals-based reactivity, and advanced JavaScript patterns  
> **Context Loading Strategy:** Read this guide first, then load specialized guides as needed for specific technical domains

## Essential Context Loading for Expert-Level Work

**Foundation Context** (load first):
- [`../foundations/mental-model.md`](../foundations/mental-model.md) - Core architectural concepts and philosophy
- [`../foundations/quick-reference.md`](../foundations/quick-reference.md) - Complete API syntax reference
- [`../foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md) - Finding implementations and examples

**Specialized Technical Context** (load based on task):
- [`../specialized/reactivity-system-guide.md`](../specialized/reactivity-system-guide.md) - Deep Signal and Reaction implementation details
- [`../specialized/templating-system-guide.md`](../specialized/templating-system-guide.md) - AST compilation and template mechanics
- [`../specialized/query-system-guide.md`](../specialized/query-system-guide.md) - Shadow DOM querying and component configuration

**Practical Implementation Context**:
- [`../guides/component-generation-instructions.md`](../guides/component-generation-instructions.md) - Component creation patterns and conventions
- [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) - Advanced patterns and communication strategies
- [`../guides/html-css-style-guide.md`](../guides/html-css-style-guide.md) - CSS architecture and design token usage

---

## Expert Persona Requirements

As a Semantic UI expert, you must demonstrate deep technical understanding of:

1. **Core Architecture**: How the modular package system works together (`@semantic-ui/component`, `@semantic-ui/reactivity`, `@semantic-ui/templating`, `@semantic-ui/query`, `@semantic-ui/utils`)
2. **Rendering Pipeline**: The Lit integration, custom directives, and dual update mechanisms
3. **Reactivity Systems**: Both the settings proxy system and signals implementation
4. **Template System**: AST compilation, data context flattening, and reactive binding creation
5. **Component Lifecycle**: Prototype vs instance patterns, cloning, and memory management
6. **Implementation Nuances**: Edge cases, performance implications, and architectural decisions

---

## Critical Technical Understanding

### Dual Rendering Architecture

**Essential Insight**: Semantic UI uses two different update mechanisms:

```
Settings (Lit Properties)           State (Custom Signals)
├── Proxy with hidden signals      ├── Direct Signal instances
├── Lit property system            ├── Custom Lit directives  
├── Component-level re-renders     ├── Surgical DOM updates
├── Full template re-evaluation    ├── Targeted node updates
└── DOM attribute synchronization  └── Bypasses Lit update cycle
```

**Why This Matters**: When editing documentation about reactivity, you must distinguish between these systems. Settings changes trigger Lit's standard update cycle (heavier), while state changes use fine-grained Signal reactions (lighter).

> **Deep Dive**: See [`../specialized/reactivity-system-guide.md`](../specialized/reactivity-system-guide.md) for complete Signal implementation details and [`../foundations/mental-model.md`](../foundations/mental-model.md) for the Settings vs State conceptual framework.

### Template Compilation and Data Context

Templates undergo AST compilation that creates reactive bindings:

```javascript
// Template source
{#if isVisible}{value}{/if}

// Compiles to AST nodes that generate:
() => isVisible.get() ? renderValue() : nothing
```

**Data Context Flattening**: Templates receive a flattened context:
- **State signals**: Auto-call `.get()` → `{value}` becomes `state.value.get()`
- **Settings proxy**: Direct access → `{theme}` becomes `settings.theme`
- **Component props**: Direct access → `{apiUrl}` becomes `self.apiUrl`
- **Methods**: Available as functions → `{getDisplayText}` becomes `self.getDisplayText()`

> **Implementation Details**: See [`../specialized/templating-system-guide.md`](../specialized/templating-system-guide.md) for complete AST compilation process and [`../guides/component-generation-instructions.md`](../guides/component-generation-instructions.md) for practical template syntax patterns.

### Component Instantiation Architecture

**Prototype Pattern**: `defineComponent()` creates a Template prototype with compiled AST, shared across all instances. When custom elements are created, this prototype is cloned with instance-specific data context.

**Memory Efficiency**: AST compilation happens once per component type. Template instances share the compiled AST but have independent data contexts.

### Signal Implementation Details

Signals use a dependency tracking system:

```javascript
class Signal {
  get value() {
    this.dependency.depend(); // Establishes reactive relationship
    return this.currentValue;
  }
  
  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = newValue;
      this.dependency.changed(); // Triggers scheduled reactions
    }
  }
}
```

**Batching**: Reactions are scheduled via `queueMicrotask()` and flushed in batches for performance.

### Settings Proxy Mechanics

```javascript
createSettingsProxy() {
  this.settingsVars = new Map(); // Hidden signal storage
  
  return new Proxy(defaultSettings, {
    get: (target, property) => {
      let signal = this.settingsVars.get(property);
      if (!signal) {
        signal = new Signal(target[property]);
        this.settingsVars.set(property, signal);
      }
      return signal.get(); // Creates dependency in reactive contexts
    },
    
    set: (target, property, value) => {
      target[property] = value;
      this.setSetting(property, value); // Updates Lit property
      signal.set(value); // Triggers Signal reactions
    }
  });
}
```

**Dual Updates**: Settings assignment updates both the Lit property (triggering component re-render) AND the hidden signal (triggering specific reactions).

### Component Tree Navigation Implementation

`findParent(tagName)` traverses DOM ancestry:

```javascript
findParent(tagName) {
  let current = this.element?.parentNode;
  while (current) {
    if (current.tagName?.toLowerCase() === tagName.toLowerCase()) {
      return current.component; // Component instance
    }
    current = current.parentNode;
  }
  return null;
}
```

**Shadow DOM Boundaries**: Navigation crosses shadow roots because it traverses the composed DOM tree, not the light DOM tree.

> **Parent-Child Patterns**: See [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) for comprehensive parent-child communication strategies and [`../foundations/mental-model.md`](../foundations/mental-model.md) for the component tree navigation philosophy.

### Event System Architecture

Event delegation uses different strategies:

- **Standard**: `addEventListener` on render root with `element.matches(selector)`
- **Deep**: Uses `$$` (querySelectorAllDeep) to establish listeners across shadow boundaries
- **Global**: Binds to `window`, `document`, or `body` for page-level events
- **Bind**: Direct binding for non-bubbling custom events

### Query System Shadow DOM Traversal

```javascript
// $ uses standard querySelectorAll (light DOM only)
$('.button') // Finds .button in current component

// $$ implements querySelectorAllDeep (crosses shadow boundaries)
$$('.button') // Finds .button in current component AND child shadow DOMs
```

**Implementation**: `$$` recursively calls `querySelectorAll` on each shadow root encountered in the DOM tree.

> **Query System Details**: See [`../specialized/query-system-guide.md`](../specialized/query-system-guide.md) for complete DOM querying implementation and component configuration patterns.

---

## Package-Specific Expertise

### @semantic-ui/component

**Core Files**:
- `define-component.js`: Main component creation API, Template prototype management
- `web-component.js`: WebComponentBase class, settings proxy, Lit integration

**Key Patterns**:
- Hybrid prototype/instance pattern for memory efficiency
- Settings proxy creating hidden signals on-demand
- Template cloning with instance-specific data contexts

### @semantic-ui/reactivity

**Core Files**:
- `signal.js`: Signal implementation with dependency tracking
- `reaction.js`: Reactive computation management
- `dependency.js`: Dependency tracking and change notification
- `scheduler.js`: Batched update scheduling

**Key Patterns**:
- Fine-grained reactivity with automatic dependency tracking
- Equality-based change detection with configurable functions
- Microtask-based batching for performance

> **Complete Reference**: [`../specialized/reactivity-system-guide.md`](../specialized/reactivity-system-guide.md) covers the full Signal and Reaction API with standalone usage patterns.

### @semantic-ui/templating

**Core Files**:
- `template.js`: Template class and lifecycle management
- `compiler/template-compiler.js`: AST compilation from template strings
- `template-helpers.js`: Global template helper functions

**Key Patterns**:
- AST-based compilation for performance
- Data context flattening and scope management
- Reactive binding creation during compilation

> **Deep Implementation**: [`../specialized/templating-system-guide.md`](../specialized/templating-system-guide.md) explains the complete template compilation pipeline and syntax features.

### @semantic-ui/query

**Core Files**:
- `query.js`: Main query implementation with $ and $$
- `node-wrapper.js`: jQuery-like chaining API

**Key Patterns**:
- Shadow DOM-aware querying with querySelectorAllDeep
- Component configuration methods (`.settings()`, `.initialize()`, `.component()`)
- jQuery-compatible chaining for developer familiarity

> **Query Patterns**: [`../specialized/query-system-guide.md`](../specialized/query-system-guide.md) covers advanced querying techniques and the Template-as-Settings pattern for component configuration.

### @semantic-ui/renderer

**Core Files**:
- `lit/renderer.js`: Lit integration layer
- `lit/directives/`: Custom Lit directives for Semantic UI features

**Key Patterns**:
- Converting Semantic UI AST to Lit TemplateResult
- Custom directives for reactive features (`reactive-each`, `reactive-conditional`)
- Integration between Signal system and Lit's update cycle

---

## Documentation Editing Expertise

### Technical Accuracy Requirements

When editing technical documentation, ensure:

1. **Correct Terminology**: Distinguish settings (proxy) vs state (signals) vs component props (direct)
2. **Accurate API Signatures**: Method parameters, return types, and side effects
3. **Implementation Details**: When to mention Lit vs Signal systems
4. **Performance Implications**: When operations trigger full re-renders vs surgical updates
5. **Memory Management**: Automatic cleanup vs manual cleanup requirements

### Common Documentation Errors to Catch

❌ **Conflating Settings and State**:
```javascript
// Wrong: Settings don't use .get()/.set()
settings.theme.set('dark')

// Correct: Settings use direct assignment
settings.theme = 'dark'
```

❌ **Incorrect Method References**:
```javascript
// Wrong: Use self.method() not this.method()
this.updateDisplay()

// Correct: Component methods via self
self.updateDisplay()
```

❌ **Misunderstanding Template Context**:
```javascript
// Wrong: Templates don't need .get() for state
{value.get()}

// Correct: Templates auto-call .get()
{value}
```

### Advanced Concepts to Verify

- **Template-as-Settings Pattern**: Runtime template injection via settings
- **Component Tree Navigation**: Intentional parent-child relationships vs global state
- **Event Binding Strategies**: When to use standard vs deep vs global events
- **Shadow DOM Implications**: CSS encapsulation, event retargeting, query boundaries
- **Lifecycle Timing**: onCreated vs onRendered vs willUpdate execution order

---

## Example Analysis Expertise

### Canonical Example Patterns

**TodoMVC** (`/docs/src/examples/todo-list/`):
- Demonstrates parent-child state sharing via `findParent()`
- Shows proper Signal mutation methods (`setProperty`, `removeItem`)
- Illustrates event-based communication between components

**Ball Simulation** (`/docs/src/examples/reactivity/ball-simulation/`):
- Time-driven reactivity using Signal as animation loop driver
- Performance optimization with `peek()` for non-reactive reads
- Canvas integration with reactive state management

**Context Menu** (`/docs/src/examples/component/context-menu/`):
- Global event handling for click-outside behavior
- Dynamic positioning with viewport boundary detection
- Keyboard navigation with key binding system

**Form Builder** (`/docs/src/examples/form-builder/`):
- Reactive validation using reaction() for derived state
- Complex state management with nested objects
- Template-driven dynamic form generation

> **Pattern Analysis**: See [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) for detailed breakdowns of these patterns and [`../foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md) for locating additional examples.

### Anti-Pattern Recognition

When reviewing examples, identify these anti-patterns:

❌ **Unnecessary Getter Methods**:
```javascript
// Wrong: Creating getters for data already in template context
getTheme() { return settings.theme; }
```

❌ **Breaking Event Delegation**:
```javascript
// Wrong: Manual event binding that won't work for dynamic content
$('.button').on('click', handler)
```

❌ **Global State Usage**:
```javascript
// Wrong: Global stores instead of component tree navigation
import { globalStore } from './store.js'
```

---

## Advanced Technical Scenarios

### Custom Directive Development

Understanding how to extend the renderer with custom Lit directives:

```javascript
// Example: Custom directive for Semantic UI feature
import { directive, Directive } from 'lit/directive.js';

class ReactiveCustomDirective extends Directive {
  update(part, [signal, options]) {
    // Integrate with Signal system
    // Update specific DOM nodes
  }
}
```

### Performance Optimization Patterns

- **Component Props vs State**: Use non-reactive component props for static data
- **Reaction Batching**: Understanding when reactions run and how to control timing
- **Memory Management**: Template prototype sharing and automatic cleanup systems

### Framework Integration Scenarios

- **React Integration**: How custom elements work with React's rendering
- **SSR Considerations**: Server-side rendering limitations and patterns
- **Progressive Enhancement**: Graceful degradation strategies

---

## Verification Checklist for Expert-Level Documentation

When editing or reviewing technical documentation:

- [ ] **Architecture Accuracy**: Correctly describes the underlying Lit + Signal hybrid system
- [ ] **API Precision**: Method signatures, parameters, and return values are exact
- [ ] **Performance Implications**: Notes when operations are expensive vs lightweight
- [ ] **Pattern Consistency**: Follows established patterns from canonical examples
- [ ] **Implementation Details**: Includes relevant technical nuances without overwhelming beginners
- [ ] **Code Examples**: All code examples are tested and follow framework conventions
- [ ] **Cross-References**: Links to related concepts and implementation details
- [ ] **Edge Cases**: Mentions important limitations or edge case behaviors

---

## Essential Reference Knowledge

### Critical File Locations
- **Core Implementation**: `/packages/component/src/define-component.js`
- **Reactivity System**: `/packages/reactivity/src/signal.js`
- **Template Compiler**: `/packages/templating/src/compiler/template-compiler.js`
- **Query System**: `/packages/query/src/query.js`
- **Canonical Examples**: `/docs/src/examples/todo-list/`, `/docs/src/examples/component/complex/accordion/`

> **Navigation Guide**: Use [`../foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md) for complete file location reference and search strategies.

### Key Mental Models
- **Prototype vs Instance**: Templates are prototypes, component instances clone them
- **Dual Reactivity**: Settings use Lit properties, state uses custom signals
- **Data Context Flattening**: Templates see unified scope of all data types
- **Component Tree Navigation**: Hierarchical communication via DOM ancestry
- **Shadow DOM Boundaries**: CSS isolation with controlled communication

### Implementation Patterns
- **Template-as-Settings**: Runtime template injection for customization
- **Event Delegation**: Multiple strategies for different component relationships
- **Memory Management**: Automatic cleanup with manual escape hatches
- **Progressive Enhancement**: Graceful degradation and framework interoperability

---

This guide provides the deep technical foundation required to operate as a Semantic UI expert. Use it as your reference for understanding implementation nuances, architectural decisions, and the sophisticated engineering that makes the framework both powerful and maintainable.

## Related Documentation for Comprehensive Understanding

**For Complete System Architecture**:
- [`../00-START-HERE.md`](../00-START-HERE.md) - Documentation hub with task-based navigation
- [`../foundations/mental-model.md`](../foundations/mental-model.md) - Complete architectural mental models and philosophy

**For Specific Technical Domains**:
- [`../specialized/reactivity-system-guide.md`](../specialized/reactivity-system-guide.md) - Signal and Reaction deep dive
- [`../specialized/templating-system-guide.md`](../specialized/templating-system-guide.md) - Template compilation and syntax
- [`../specialized/query-system-guide.md`](../specialized/query-system-guide.md) - DOM querying and component configuration
- [`../specialized/utils-package-guide.md`](../specialized/utils-package-guide.md) - Utility functions and shared libraries

**For Practical Implementation**:
- [`../guides/component-generation-instructions.md`](../guides/component-generation-instructions.md) - Component creation and best practices
- [`../guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) - Advanced patterns and real-world solutions
- [`../guides/html-css-style-guide.md`](../guides/html-css-style-guide.md) - CSS architecture and design token integration

**For Documentation Work**:
- [`../foundations/quick-reference.md`](../foundations/quick-reference.md) - Complete API reference for fact-checking
- [`../foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md) - Finding implementations and canonical examples