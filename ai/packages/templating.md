# Semantic UI Templating System Guide

**For AI agents working with Semantic UI's `@semantic-ui/templating` package**

## Overview

The `@semantic-ui/templating` package is a standalone HTML templating system that compiles template strings into an Abstract Syntax Tree (AST) for efficient rendering and updates. It supports both single `{}` and double `{{}}` bracket syntax and integrates deeply with the Semantic UI component framework. The templating system is designed primarily for web component development but can be used independently for advanced use cases.

> **Important**: When using Semantic UI components, templates are automatically created via `defineComponent`. Direct use of the `Template` class is only recommended for advanced use-cases.

## Package Structure

```
@semantic-ui/templating
├── Template        ← Main template class with lifecycle and rendering
├── TemplateCompiler ← Compiles template strings to Abstract Syntax Trees
├── StringScanner   ← Low-level string parsing utilities
└── TemplateHelpers ← Built-in helper functions for expressions
```

**Main Exports**:
```javascript
import { Template, TemplateCompiler, StringScanner, TemplateHelpers } from '@semantic-ui/templating';
```

## Template Syntax

### Flexible Syntax Support

Template syntax is designed to be adaptable to your team's preferences and to help components feel more natural across codebases of different languages.

#### Bracket Syntax
Both single and double bracket syntax are supported (must be consistent per file):

```html
<!-- Single bracket syntax -->
Welcome, {getFirstName}

<!-- Double bracket syntax -->
Welcome, {{getFirstName}}
```

#### Expression Styles
Expressions support both Lisp-style spaced expressions and JavaScript-style expressions:

```html
<!-- Lisp Simple -->
{formatDate date 'h:mm a' timezone}

<!-- JavaScript -->
{formatDate(date, 'h:mm a')}

<!-- Lisp Nested -->
{formatDate date, 'h:mm a' (getTimezone user)}

<!-- JavaScript Nested -->
{formatDate(date, 'h:mm a', getTimezone(user))}
```

### Basic Expressions

Expressions are evaluated against the template's [data context](../../docs/src/pages/docs/guides/components/rendering.mdx) and are reactive, automatically updating when underlying values change.

```html
<!-- Value output -->
{name}
{user.profile.name}
{items.0.title}

<!-- Function calls -->
{someMethod argumentOne argumentTwo}

<!-- Complex nested expressions -->
{formatDateTime someDate 'YYYY-MM-DD HH:mm' (object timezone='local')}

<!-- Nested expressions -->
{formatDate (getDate now) 'h:mm a'}

<!-- HTML output (escaped by default) -->
{description}  <!-- <script> becomes &lt;script&gt; -->

<!-- Unescaped HTML (raw output) -->
{#html someHTML}  <!-- Use with caution - potential XSS risk -->
```

#### Boolean Attributes

**CRITICAL**: When using expressions in HTML attributes, the presence/absence of quotes determines behavior:

```html
<!-- Quoted attributes - Always outputs as string -->
<a data-number="{getZero}"></a>
<!-- Result: <a data-number="0"></a> -->

<!-- Unquoted attributes - Attribute removed if falsey -->
<input type="checkbox" checked={isChecked} />
<!-- If isChecked == true: <input type="checkbox" checked /> -->
<!-- If isChecked == false: <input type="checkbox" /> -->

<!-- Conditional attributes using ternary -->
<div role={hasContent ? 'separator' : false} aria-hidden={hasContent ? false : 'true'}>
<!-- If hasContent == true: <div role="separator"> -->
<!-- If hasContent == false: <div aria-hidden="true"> -->
```

**Special Boolean Attributes** (entire attribute removed if falsey):
`allowfullscreen`, `async`, `autofocus`, `autoplay`, `checked`, `controls`, `default`, `defer`, `disabled`, `formnovalidate`, `inert`, `ismap`, `itemscope`, `loop`, `multiple`, `muted`, `nomodule`, `novalidate`, `open`, `playsinline`, `readonly`, `required`, `reversed`, `selected`

**Use Case**: Conditional ARIA attributes, optional HTML boolean attributes, dynamic attribute presence.

#### Expression Evaluation
Expressions are evaluated right to left with variables being read from the component's data context:

```html
{concat firstName ' ' lastName}
<!-- evaluates to: concat(firstName, ' ', lastName) -->

{titleCase concat firstName ' ' lastName}
<!-- evaluates to: titleCase(concat(firstName, ' ', lastName)) -->
```

### Conditional Rendering

Control flow using `#if`, `#else if`, and `#else`:

```html
<!-- Simple if/else -->
{#if isLoggedIn}
  <div>Welcome back!</div>
{else}
  <div>Please log in</div>
{/if}

<!-- Complex if/elseif/else -->
{#if is user.role 'admin'}
  <div>Admin Panel</div>
{else if is user.role 'moderator'}
  <div>Moderator Tools</div>
{else if user.isActive}
  <div>User Dashboard</div>
{else}
  <div>Account Inactive</div>
{/if}

<!-- Using helper functions -->
{#if not isEmpty items}
  <ul>{#each items}<li>{name}</li>{/each}</ul>
{/if}
```

### Iteration (Each Blocks)

```html
<!-- Simple iteration (items become data context) -->
<ul>
{#each menuItems}
  <li class="{activeIf isActive}">{label}</li>
{/each}
</ul>

<!-- Named iteration (preserve outer context) -->
<ul>
{#each item in menuItems}
  <li>Menu: {menuName} - Item: {item.label}</li>
{/each}
</ul>

<!-- With index -->
<ul>
{#each item, index in menuItems}
  <li>{numberFromIndex index}. {item.label}</li>
{/each}
</ul>

<!-- Each with else (when empty) -->
{#each tasks}
  <div class="task">{title}</div>
{else}
  <div class="empty">No tasks available</div>
{/each}
```

### Rerender and Guard Blocks

Control when and how template sections re-evaluate in response to reactive changes.

```html
<!-- Rerender block - forces complete re-evaluation when userId changes -->
{#rerender userId}
  <p>User: {userName}</p>
  <p>Timestamp: {getTimestamp}</p>
{/rerender}

<!-- Guard block - only re-renders when getUserStatus result changes -->
{#guard getUserStatus}
  <div class="status-{getUserStatus}">
    <p>Status: {getUserStatus}</p>
    <p>Expensive computation here...</p>
  </div>
{/guard}
```

**Key differences:**
- **Rerender blocks** force re-evaluation of all content, including non-reactive expressions
- **Guard blocks** use `Reaction.guard()` to only update when computed values actually change
- Both create AST nodes with `type: 'rerender'` but different `expression`/`key` properties

### Subtemplates (Partials)

```html
<!-- Simple subtemplate -->
{> userCard user}

<!-- Subtemplate with additional data -->
{> userCard name=user.name role='admin' canEdit=true}

<!-- Dynamic template with reactive data -->
{>template
  name=getTemplateName
  reactiveData={
    userName=user.name
    isOnline=user.status.online
  }
  data={
    theme: 'dark',
    showAvatar: true
  }
}

<!-- Slot rendering -->
{> slot header}
```

## Template Class API

### Constructor Options

```javascript
const template = new Template({
  templateName: 'UserProfile',        // Debug name for template
  template: '<div>{name}</div>',      // Template string
  ast: compiledAST,                   // Pre-compiled AST (performance)
  data: { name: 'Alice' },            // Initial data context
  element: domElement,                // DOM element reference
  renderRoot: shadowRoot,             // Render target (shadow DOM)
  css: '.user { color: blue; }',      // CSS styles
  events: { 'click .btn': handler },  // Event bindings
  keys: { 'ctrl+s': saveHandler },    // Keyboard shortcuts
  defaultState: { counter: 0 },       // Reactive state definition
  subTemplates: { userCard: template }, // Available subtemplates
  createComponent: function() {},      // Component initialization
  parentTemplate: parentTpl,          // Parent template reference
  renderingEngine: 'lit',             // Rendering engine ('lit' default)
  attachStyles: true,                 // Auto-attach CSS to renderRoot
  onCreated: () => {},                // Lifecycle: after creation
  onRendered: () => {},               // Lifecycle: after render
  onUpdated: () => {},                // Lifecycle: after update
  onDestroyed: () => {},              // Lifecycle: before destruction
  onThemeChanged: () => {}            // Event: theme change
});
```

### Core Methods

#### Rendering
```javascript
// Initialize template (called automatically)
template.initialize();

// Attach to DOM
await template.attach(shadowRoot);

// Render template
const html = template.render();
const htmlWithData = template.render({ additionalVar: 'value' });

// Clone template
const newTemplate = template.clone({
  data: { newData: 'value' },
  templateName: 'ClonedTemplate'
});
```

#### Data Management
```javascript
// Set data context
template.setDataContext({ user: userData });
template.setDataContext({ user: userData }, { rerender: false });

// Get combined data context
const context = template.getDataContext(); // data + state + instance
```

#### Reactive State
```javascript
// Create reactive state
template.state = template.createReactiveState({
  counter: 0,                    // Simple value
  items: { value: [], options: { allowClone: false } }, // Complex config
  user: { value: null, options: { equalityFunction: (a, b) => a.id === b.id } }
});

// Update state
template.state.counter.increment();
template.state.items.push(newItem);
template.state.user.set(newUser);

// Create signals manually
const signal = template.signal('initial value');
const configuredSignal = template.signal(0, { allowClone: false });
```

#### Event Handling
```javascript
// Built-in event delegation
const events = {
  'click .button': function({ event, target, value, data }) {
    console.log('Button clicked:', { event, target, value, data });
  },
  
  // Global events (outside component)
  'global click .external': function({ event }) {
    console.log('External click');
  },
  
  // Direct binding (after render)
  'bind focus input': function({ event, target }) {
    console.log('Input focused');
  },
  
  // Deep events (pierce shadow DOM)
  'deep click ui-modal': function({ event }) {
    console.log('Modal clicked');
  },
  
  // Multiple events
  'click, dblclick .item': function({ event }) {
    console.log('Item interaction:', event.type);
  }
};

// Attach events
template.attachEvents(events);

// Programmatic event attachment
template.attachEvent('.button', 'click', handler);

// Dispatch custom events
template.dispatchEvent('userSelected', { userId: 123 });
```

#### Keyboard Shortcuts
```javascript
// Keyboard bindings
const keys = {
  'ctrl+s': function({ event, inputFocused }) {
    if (!inputFocused) {
      saveData();
      return false; // Prevent default
    }
    return true; // Allow default
  },
  'escape': closeModal,
  'ctrl+k, ctrl+p': openCommandPalette // Sequence
};

// Bind keys
template.bindKeys(keys);
template.bindKey('f1', showHelp);
template.unbindKey('ctrl+s');
```

### DOM Querying Methods

```javascript
// Query within template (respects boundaries)
const buttons = template.$('.button');
const inputs = template.$('input[type="text"]');

// Deep query (crosses shadow DOM)
const allModals = template.$$('ui-modal');
const nestedButtons = template.$$('.nested .button');

// Global queries
const body = template.$('body');
const doc = template.$('document');
```

### Reactive Methods

```javascript
// Create reactions (auto-cleanup on destroy)
template.reaction(() => {
  const count = template.state.counter.get();
  template.$('.count').text(count);
});

// Create standalone signals
const userSignal = template.signal({ name: 'Alice' });

// Use static reactive utilities
template.call(function({ afterFlush, nonreactive, flush }) {
  afterFlush(() => {
    // Run after all reactive updates
  });
  
  const value = nonreactive(() => {
    return someSignal.get(); // No dependency created
  });
  
  flush(); // Force immediate update
});
```

### Template Hierarchy Methods

```javascript
// Find templates by name
const userTemplate = template.findTemplate('UserCard');
const parentTemplate = template.findParent('UserList');
const childTemplate = template.findChild('UserAvatar');
const allChildren = template.findChildren(); // All children
const namedChildren = template.findChildren('MenuItem'); // Named children

// Set/remove parent relationships
template.setParent(parentTemplate);
template.removeParent();
```

## TemplateCompiler API

### Basic Compilation

```javascript
import { TemplateCompiler } from '@semantic-ui/templating';

// Compile template string to AST
const compiler = new TemplateCompiler('<div>{name}</div>');
const ast = compiler.compile();

// Use pre-compiled AST for performance
const template = new Template({ ast, data: { name: 'Alice' } });
```

### AST Structure

The compiler generates an Abstract Syntax Tree with these node types:

```javascript
// HTML nodes
{ type: 'html', html: '<div class="container">' }

// Expression nodes
{ type: 'expression', value: 'userName' }
{ type: 'expression', value: 'user.name', unsafeHTML: true }

// Conditional nodes
{
  type: 'if',
  condition: 'isActive',
  content: [...childNodes],
  branches: [
    { type: 'elseif', condition: 'isPending', content: [...] },
    { type: 'else', content: [...] }
  ]
}

// Iteration nodes
{
  type: 'each',
  over: 'items',           // What to iterate
  as: 'item',              // Variable name (optional)
  indexAs: 'index',        // Index variable (optional)
  content: [...childNodes],
  else: { type: 'else', content: [...] } // Empty state (optional)
}

// Template nodes
{
  type: 'template',
  name: 'userCard',
  reactiveData: { userName: 'user.name' },
  data: { theme: 'dark' }
}

// Slot nodes
{ type: 'slot', name: 'header' }
```

### Syntax Detection

```javascript
// Automatic syntax detection
const syntax = TemplateCompiler.detectSyntax(templateString);
// Returns: 'singleBracket' or 'doubleBracket'

// Template preprocessing
const processed = TemplateCompiler.preprocessTemplate(`
  <ui-button disabled />
`);
// Becomes: <ui-button disabled></ui-button>
```

## TemplateHelpers API

Built-in helper functions available in all expressions:

### Logical Helpers
```html
{#if not isEmpty items}...{/if}
{#if is status 'active'}...{/if}
{#if isExactly value true}...{/if}
{#if notEqual a b}...{/if}
{#if greaterThan count 10}...{/if}
{#if lessThanEquals index maxItems}...{/if}
```

### String Helpers
```html
<h1>{capitalize title}</h1>
<h2>{titleCase subtitle}</h2>
<div>{concat prefix " - " suffix}</div>
<span>{join tags ", "}</span>
<p>{joinComma items true true}</p> <!-- Oxford comma, quotes -->
```

### Conditional CSS Helpers
```html
<div class="{activeIf isSelected}">Item</div>
<div class="{selectedIf isChosen}">Option</div>
<div class="{disabledIf isLocked}">Button</div>
<div class="{checkedIf isComplete}">Checkbox</div>
<div class="{classIf isImportant 'priority' 'normal'}">Task</div>
<div class="{maybe showBorder 'bordered' ''}">Content</div>
```

### Array and Object Helpers
```html
{#if hasAny items}
  <ul>
    {#each items}
      <li>{title} ({numberFromIndex @index})</li>
    {/each}
  </ul>
{/if}

{#each arrayFromObject settings}
  <div>{key}: {value}</div>
{/each}

{#each range 1 10}
  <span>Page {.}</span>
{/each}
```

### Date Formatting
```html
<time>{formatDate createdAt 'YYYY-MM-DD'}</time>
<span>{formatDateTime updatedAt 'MMM DD, YYYY h:mm A'}</span>
<span>{formatDateTimeSeconds timestamp 'HH:mm:ss'}</span>
```

### Utility Helpers
```html
<!-- Debugging -->
{log "Debug value:" someVariable}
{debugger} <!-- Breakpoint -->
{debugReactivity} <!-- Show reactive dependencies -->

<!-- Data manipulation -->
<script type="application/json">{stringify data}</script>
<span>{tokenize searchText}</span>
<div class="{classes ['btn', 'primary', activeClass]}">Button</div>
```

### Class Mapping
```html
<div class="{classMap {
  'active': isActive,
  'disabled': isDisabled,
  'large': size === 'large'
}}">Dynamic Classes</div>
```

## Component Integration

### With Semantic UI Components

```javascript
// Component definition using templating
const componentDefinition = {
  template: `
    <div class="ui dropdown {activeIf isOpen}">
      <div class="text">{selectedItem.label}</div>
      <div class="menu {maybe isOpen 'visible' ''}">
        {#each items}
          <div class="item {selectedIf isSelected}" data-value="{value}">
            {label}
          </div>
        {/each}
      </div>
    </div>
  `,
  
  defaultState: {
    isOpen: false,
    selectedItem: null,
    items: []
  },
  
  events: {
    'click .dropdown': function({ state }) {
      state.isOpen.toggle();
    },
    'click .item': function({ event, state, data }) {
      const value = data.value;
      const item = state.items.get().find(i => i.value === value);
      state.selectedItem.set(item);
      state.isOpen.set(false);
    }
  },
  
  createComponent() {
    return {
      setItems(items) {
        this.state.items.set(items);
      },
      
      getSelected() {
        return this.state.selectedItem.get();
      }
    };
  }
};

// Use with component system
const template = new Template(componentDefinition);
```

### Standalone Usage Patterns

```javascript
// Simple templating
const template = new Template({
  template: '<h1>Hello {name}!</h1>',
  data: { name: 'World' }
});

document.body.innerHTML = template.render();

// Reactive templating
const listTemplate = new Template({
  template: `
    <div>
      <h2>Todo List ({completedCount}/{totalCount})</h2>
      <ul>
        {#each todos}
          <li class="{checkedIf completed}">
            <input type="checkbox" {#if completed}checked{/if}>
            {title}
          </li>
        {/each}
      </ul>
    </div>
  `,
  
  defaultState: {
    todos: [],
    completedCount: 0,
    totalCount: 0
  },
  
  createComponent() {
    // Auto-compute derived state
    this.reaction(() => {
      const todos = this.state.todos.get();
      this.state.totalCount.set(todos.length);
      this.state.completedCount.set(
        todos.filter(todo => todo.completed).length
      );
    });
    
    return {
      addTodo(title) {
        this.state.todos.push({ title, completed: false });
      },
      
      toggleTodo(index) {
        this.state.todos.setArrayProperty(index, 'completed', 
          !this.state.todos.getIndex(index).completed
        );
      }
    };
  }
});
```

## Advanced Features

### Custom Rendering Engines

```javascript
// Default uses Lit renderer
const template = new Template({
  renderingEngine: 'lit', // Default
  template: templateString
});

// Can be extended for other rendering systems
```

### Performance Optimization

```javascript
// Pre-compile templates for performance
const compiler = new TemplateCompiler(templateString);
const ast = compiler.compile();

// Reuse AST for multiple instances
const template1 = new Template({ ast, data: data1 });
const template2 = new Template({ ast, data: data2 });

// Minimize reactive dependencies
template.reaction(() => {
  // Use peek() to read without creating dependencies
  const triggerValue = triggerSignal.get();  // Creates dependency
  const readOnlyValue = dataSignal.peek();   // No dependency
  
  updateUI(triggerValue, readOnlyValue);
});
```

### Template Caching and Management

```javascript
// Global template registry
Template.addTemplate(template);           // Auto-added on creation
const found = Template.findTemplate('UserCard');
const all = Template.getTemplates('UserCard');
Template.removeTemplate(template);        // Auto-removed on destruction

// Template hierarchy
const parent = template.findParent('UserList');
const children = template.findChildren('UserItem');
```

## Integration with Other Packages

### With Reactivity System

```javascript
import { Signal, Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';

// External signals
const userSignal = new Signal({ name: 'Alice' });

const template = new Template({
  template: '<div>Hello {user.name}!</div>',
  
  createComponent() {
    // Sync external signal with template data
    this.reaction(() => {
      const user = userSignal.get();
      this.data.user = user;
    });
  }
});
```

### With Query System

```javascript
import { $ } from '@semantic-ui/query';
import { Template } from '@semantic-ui/templating';

// Templates integrate seamlessly with query system
const template = new Template({
  template: '<button class="save-btn">Save</button>',
  
  createComponent() {
    // Use $ within template context
    this.$('.save-btn').on('click', () => {
      this.save();
    });
    
    // Query outside template
    this.attachEvent('body', 'keydown', (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }
});
```

### With Utils Package

```javascript
import { debounce, formatDate } from '@semantic-ui/utils';
import { Template } from '@semantic-ui/templating';

const template = new Template({
  template: `
    <input placeholder="Search...">
    <div>Last updated: {formatDate lastUpdate 'MMM DD, YYYY'}</div>
  `,
  
  defaultState: {
    searchQuery: '',
    lastUpdate: new Date()
  },
  
  events: {
    'input input': debounce(function({ value, state }) {
      state.searchQuery.set(value);
      this.performSearch(value);
    }, 300)
  }
});
```

## Key Principles

1. **AST-Based Compilation**: Templates compile to abstract syntax trees for efficient rendering
2. **Reactive Integration**: Deep integration with Semantic UI's reactivity system
3. **Component-Aware**: Designed specifically for web component architecture
4. **Framework Agnostic**: Can be used standalone or with any framework
5. **Security-First**: HTML escaping by default, explicit unsafe HTML rendering
6. **Performance Optimized**: Template compilation, AST reuse, and reactive efficiency
7. **Developer Experience**: Rich debugging, context information, and error handling

## Common Use Cases

1. **Web Component Templates**: Primary use case for Semantic UI components
2. **Dynamic Content Generation**: Data-driven UI rendering
3. **Conditional UI States**: Complex conditional rendering logic
4. **List and Table Rendering**: Efficient iteration with reactivity
5. **Form Generation**: Dynamic form creation with validation
6. **Email Templates**: Server-side template rendering
7. **Documentation Sites**: Static and dynamic content generation

This templating system provides a powerful foundation for building reactive, component-based user interfaces while maintaining the flexibility to be used in various contexts from simple string templating to complex web applications.