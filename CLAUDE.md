# Semantic UI - Claude Code Integration Guide

This file provides Claude Code-specific guidance for working with the Semantic UI web component framework. It acts as an intelligent entry point to the comprehensive AI context system located in `/ai/`.

## Context Loading Strategy

### **Essential Context Foundation**
Always load these foundational files for any Semantic UI task:
1. **[`ai/00-START-HERE.md`](ai/00-START-HERE.md)** - Navigation hub and task-based routing
2. **[`ai/foundations/mental-model.md`](ai/foundations/mental-model.md)** - Core architectural concepts

### **Task-Based Context Loading**
```
Building Components → ai/guides/component-generation-instructions.md
Debugging Issues → ai/foundations/codebase-navigation-guide.md  
Implementation Patterns → ai/guides/patterns-cookbook.md
API Reference → ai/foundations/quick-reference.md
HTML/CSS Work → ai/guides/html-css-style-guide.md
```

## Claude Code Specific Workflows

### **Component Development Workflow**
1. **Plan Task**: Use TodoWrite tool for multi-step component work
2. **Load Context**: Read `ai/guides/component-generation-instructions.md` 
3. **Explore Codebase**: Use Glob/Grep tools to find similar components
4. **Implement**: Follow established patterns from examples
5. **Validate**: Run lint/typecheck commands if available
6. **Mark Complete**: Update TodoWrite with progress

### **Debugging Workflow**
1. **Read Navigation Guide**: `ai/foundations/codebase-navigation-guide.md`
2. **Use Search Tools**: Prefer Task tool for keyword searches
3. **Read Specific Files**: Use Read tool for targeted investigation
4. **Apply Mental Model**: Reference `ai/foundations/mental-model.md` for "why" questions

### **Code Review Workflow**
1. **Load Patterns**: `ai/guides/patterns-cookbook.md`
2. **Check Style Guide**: `ai/guides/html-css-style-guide.md`
3. **Verify API Usage**: `ai/foundations/quick-reference.md`

## Essential Framework Mental Model

### **Core Architecture (Complete Reference)**
```
defineComponent() → Web Component Registration
├── template: HTML with reactive expressions {value}
├── css: Scoped styles with design tokens var(--token)
├── defaultState: Reactive signals (state.value.get/set)
├── defaultSettings: Mutable configuration (settings.property)
├── createComponent: Instance methods (self.method())
├── events: Event delegation ({ 'click .btn': handler })
└── lifecycle: onCreated, onRendered, onDestroyed
```

### **Reactivity Flow**
```
Signal Change → Reaction Triggered → Template Updated → DOM Updated
```

### **Component Communication**
```
Parent ↔ Child: findParent('tag-name') / findChild('tag-name')
Events: dispatchEvent() for notifications
State Sharing: Expose signals on component instance
```

### **Critical Patterns**
- **Settings vs State**: Settings = configuration, State = dynamic data
- **Template Expressions**: `{value}` auto-reactive, `value.get()` in component logic
- **CSS Tokens**: Use `var(--design-token)`, not custom properties
- **Method References**: Use `self.method()` not `this.method()`

## Common Task Patterns

### **Create New Component**
```javascript
// Required files: component.js, component.html, component.css
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'my-component',
  template,
  css,
  defaultState: { count: 0 },
  defaultSettings: { theme: 'default' },
  createComponent: ({ state, settings, self }) => ({
    increment() { state.count.increment(); }
  }),
  events: {
    'click .button': ({ self }) => self.increment()
  }
});
```

### **Component Communication**
```javascript
// Child accessing parent
const parent = findParent('parent-component');
const parentData = parent.sharedData.get();

// Parent managing child  
const child = findChild('child-component');
child.updateDisplay();

// Event notifications
dispatchEvent('dataChanged', { newValue: data });
```

### **Reactive State Management**
```javascript
// In component logic
state.items.push(newItem);                    // Reactive array mutation
state.user.setProperty('name', 'Alice');      // Reactive object update
state.counter.increment();                    // Built-in helpers

// In templates (automatic reactivity)
{items.length}                                // Auto-updates
{#if user.isActive}...{/if}                  // Conditional rendering
{#each items}...{/each}                      // List rendering
```

## Claude Code Tool Optimization

### **Search Strategy**
```
Unknown Keywords/Concepts → Task tool (multi-round search)
Specific File Paths → Read tool (direct access)
Class Definitions → Glob tool (pattern matching)
Code Within Files → Grep tool (content search)
```

### **Tool Usage Patterns**
```javascript
// ✅ Good: Batch multiple tool calls
TodoWrite → Read → Glob → Edit (single response)

// ✅ Good: Use Task for exploration
Task: "Find all dropdown components and their configuration patterns"

// ✅ Good: Specific tool for specific needs  
Glob: "**/*dropdown*" → Read specific files

// ❌ Avoid: Sequential single tool calls
Read → (wait) → Glob → (wait) → Edit
```

### **Performance Optimization**
- **Batch tool calls** in single responses when possible
- **Use Task tool** for open-ended exploration
- **Cache common patterns** in todo lists for complex work
- **Prefer specific tools** (Read vs Task) when you know the target

## Framework-Specific Guidelines

### **Must-Read Before Component Creation**
1. **CSS Patterns**: [`ai/guides/html-css-style-guide.md`](ai/guides/html-css-style-guide.md) - Design token usage
2. **Method References**: [`ai/foundations/mental-model.md`](ai/foundations/mental-model.md) - `self.method()` patterns
3. **Component Communication**: [`ai/guides/patterns-cookbook.md`](ai/guides/patterns-cookbook.md) - Parent-child patterns

### **Critical Anti-Patterns to Avoid**
- ❌ Prefixed CSS classes (`.size-large` → use `.large`)
- ❌ `this.method()` → use `self.method()`  
- ❌ Hardcoded CSS values → use design tokens `var(--token)`
- ❌ Global state stores → use component tree navigation
- ❌ Direct DOM manipulation → use reactive templates

### **Design Token Priority**
```css
/* ✅ First: Use existing design tokens */
color: var(--text-color);
spacing: var(--spacing);
border-radius: var(--border-radius);

/* ✅ Second: Component-specific values → design tokens */
--handle-size: 24px;                  /* Component-specific */
--track-color: var(--standard-10);    /* Maps to design token */

/* ❌ Never: Recreate existing tokens */
--component-text-color: var(--text-color);  /* Unnecessary wrapper */
```

## Advanced Context Loading

### **Specialized Package Work**
```
Reactivity System → ai/specialized/reactivity-system-guide.md
DOM Querying → ai/specialized/query-system-guide.md  
Template System → ai/specialized/templating-system-guide.md
Utility Functions → ai/specialized/utils-package-guide.md
```

### **Complex Implementation Contexts**
```
Template-as-Settings Pattern → ai/guides/patterns-cookbook.md#template-as-settings-pattern
Parent-Child Communication → ai/guides/patterns-cookbook.md#component-communication-patterns  
Query Component Configuration → ai/guides/patterns-cookbook.md#query-library-patterns
```

## TodoWrite Integration for Complex Tasks

### **When to Use TodoWrite**
- Multi-step component creation
- Complex debugging across multiple files  
- Feature implementation requiring coordination
- Code review with multiple checks

### **Task Breakdown Examples**
```javascript
// ✅ Component Creation Task List
[
  { content: "Research existing dropdown patterns", status: "pending" },
  { content: "Create dropdown.js with basic structure", status: "in_progress" },
  { content: "Implement template with design tokens", status: "pending" },
  { content: "Add event handling and state management", status: "pending" },
  { content: "Test integration with parent components", status: "pending" },
  { content: "Run lint and typecheck", status: "pending" }
]
```

## Context Memory Management

### **Context Optimization Strategy**
1. **Foundation First**: Begin with navigation hub and mental model
2. **Targeted Loading**: Add specific guides based on task requirements
3. **Cross-Reference Navigation**: Use document links rather than loading all content
4. **Task-Scoped Context**: Load only context relevant to current work

### **Context Loading Sequence**
```
1. ai/00-START-HERE.md (navigation foundation)
2. ai/foundations/mental-model.md (architectural foundation)
3. Task-specific guide (component, patterns, etc.)
4. ai/foundations/quick-reference.md (API syntax)
5. Specialized guides (domain-specific requirements)
```

---

## Context Loading Protocol

**For any Semantic UI task:**

1. **Foundation**: [`ai/00-START-HERE.md`](ai/00-START-HERE.md) - Always load first
2. **Architecture**: [`ai/foundations/mental-model.md`](ai/foundations/mental-model.md) - Core concepts  
3. **Task-Specific**: Load appropriate specialized guide
4. **Reference**: [`ai/foundations/quick-reference.md`](ai/foundations/quick-reference.md) - API syntax

**Context Optimization**: The AI context system uses ~8K token documents with cross-references. Load documents sequentially based on task requirements rather than loading multiple large documents simultaneously.

---

*This file serves as an intelligent entry point to the comprehensive AI documentation system. For complete information, always refer to the specialized guides in the `/ai/` directory.*