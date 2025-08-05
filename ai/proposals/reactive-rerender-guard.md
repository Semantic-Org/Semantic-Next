# Reactive Rerender & Guard Blocks Proposal

**Status:** Ready for Implementation  
**Type:** New Feature  
**Packages:** `@semantic-ui/templating`, `@semantic-ui/renderer`  
**Author:** AI Agent Discussion Session  
**Date:** 2025-01-12

## 🚨 CRITICAL IMPLEMENTATION INSTRUCTIONS

**MANDATORY CONTEXT LOADING:**
Before implementing, you MUST read these files in order to understand the architecture:

1. **`/ai/foundations/mental-model.md`** - Core architectural understanding
2. **`/ai/packages/reactivity.md`** - How Reaction.create() and signals work
3. **`/packages/renderer/src/lit/directives/reactive-conditional.js`** - Existing directive pattern
4. **`/packages/renderer/src/lit/directives/reactive-async.js`** - Another directive example
5. **`/packages/renderer/src/lit/renderer.js`** - How renderer evaluates AST nodes
6. **`/packages/templating/src/compiler/template-compiler.js`** - How compiler parses templates

**KEY ARCHITECTURAL PRINCIPLES:**
- Data context is **FLATTENED** - access `userId` not `user.id`
- Template functions don't need `()` - write `{getUserName}` not `{getUserName()}`
- Expression evaluation uses `this.evaluateExpression(value, data)`
- Directive patterns: render() sets up reaction, watchChanges() creates Reaction.create()
- Follow EXACT patterns from reactive-conditional.js and reactive-async.js

**CRITICAL:** This proposal contains the complete specification. Do not deviate from the syntax or behavior described here.

## Problem Statement

### Current Limitation

Semantic UI's reactive system provides fine-grained updates when reactive data (state signals and settings) changes. However, templates often contain a mix of reactive and non-reactive data:

**Reactive Data Sources:**
- `state` - Signals that trigger automatic updates
- `settings` - Reactive proxy that triggers automatic updates

**Non-Reactive Data Sources:**
- Component instance properties/methods
- Cached computations
- Third-party integrations
- Current timestamps

### The Batching Problem

When you need to update sections containing both reactive and non-reactive data, you need a way to re-evaluate the entire section when reactive dependencies change.

```javascript
const createComponent = ({ state, self }) => ({
  apiEndpoint: '/api/users',        // Non-reactive property
  getCacheKey() { /* ... */ },      // Computed value
  getTimestamp() { return Date.now(); } // Current time
});
```

**Template problem:**
```html
<!-- Mixed reactive and non-reactive data -->
<div>
  <p>User: {userId}</p>           <!-- Reactive - auto-updates -->
  <p>API: {apiEndpoint}</p>       <!-- Non-reactive - stale -->
  <p>Cache: {getCacheKey}</p>     <!-- Computed - stale -->
  <p>Updated: {getTimestamp}</p>  <!-- Timestamp - stale -->
</div>
```

**Problem:** When `userId` changes, only that expression updates. The non-reactive expressions remain stale despite potentially depending on the new user data.

### Use Cases Requiring Solution

1. **Batching mixed data** - Sections with both reactive and non-reactive expressions
2. **Third-party integrations** - Libraries that need full DOM replacement
3. **Performance optimization** - Batch updates instead of many fine-grained changes
4. **Complex computed displays** - Values derived from multiple data sources

## Solution Overview

**Core Concept:** Use reactive data as triggers to re-evaluate entire template sections, batching updates for both reactive and non-reactive expressions.

### 1. Reactive Rerender Block (`{#rerender}`)
Re-evaluates a content block when reactive dependencies change, refreshing all expressions within.

### 2. Keyed Guard Block (`{#guard}`)  
Re-evaluates only when a computed key expression produces a different result, providing performance optimization for expensive sections.

Both share the same directive implementation with behavioral flags.

## Syntax Specification

### Basic Reactive Rerender
```html
{#rerender expression}
  <!-- Content rerenders when reactive values in expression change -->
{/rerender}
```

### Keyed Guard Rerender
```html
{#guard keyExpression}
  <!-- Content rerenders only when keyExpression result changes -->
{/guard}
```

### Hybrid Approach (Advanced)
```html
{#rerender expression key=keyExpression}
  <!-- Watch expression for changes, but only rerender if key changed -->
{/rerender}
```

## Detailed Usage Examples

### 1. Single Dependency
```html
{#rerender userId}
  <!-- When userId changes, re-evaluate entire section -->
  <div>
    <p>User: {getUserDisplayName}</p>    <!-- Uses current userId -->
    <p>API: {apiEndpoint}</p>            <!-- Non-reactive property -->
    <p>Cache: {getCacheKey}</p>          <!-- Computed from current data -->
    <p>Updated: {getTimestamp}</p>       <!-- Fresh timestamp -->
  </div>
{/rerender}
```

### 2. Multiple Dependencies (Composite Function)
```html
{#rerender getUserDependencies}
  <!-- Function accesses multiple reactive values -->
  <div>
    <p>User: {getUserDisplayName}</p>
    <p>Theme: {currentTheme}</p>
    <p>Permissions: {userPermissions}</p>
  </div>
{/rerender}
```

**Component method:**
```javascript
const createComponent = ({ state }) => ({
  getUserDependencies() {
    state.userId.get();         // Creates reactive dependency
    state.theme.get();          // Creates reactive dependency  
    state.permissions.get();    // Creates reactive dependency
    // Reactive context automatically tracks all accessed signals
    return true; // Return value irrelevant for dependency tracking
  }
});
```

### 3. Third-Party Integration
```html
{#rerender chartData}
  <!-- When chartData changes, re-initialize the chart -->
  <div id="d3-chart"></div>
  {initializeD3Chart()}
{/rerender}
```

### 4. Performance Guard
```html
{#guard getUserHash()}
  <!-- Only re-evaluate when getUserHash() result changes -->
  <!-- Prevents expensive recomputation if hash is same -->
  <expensive-user-dashboard />
{/guard}
```

### 5. Hybrid Optimization
```html
{#rerender userId key=getAccessLevel()}
  <!-- Watch userId, but only rerender if access level changed -->
  <permission-sensitive-content />
{/rerender}
```

## Technical Implementation Plan

### 1. Template Compiler Changes (`packages/templating/src/compiler/template-compiler.js`)

#### Add Regex Patterns
```javascript
static basePatterns = {
  // ... existing patterns
  RERENDER: '^{OPEN}\\s*#(rerender|guard)\\s+',
  CLOSE_RERENDER: '^{OPEN}\\s*\\/(rerender|guard)\\s*',
}
```

#### Add Switch Cases
```javascript
case 'RERENDER': {
  const isGuard = tag.content.includes('guard');
  
  // Parse key attribute if present (for hybrid syntax)
  const { expression, key } = this.parseRerenderExpression(tag.content);
  
  newNode = {
    ...newNode,
    type: 'rerender',
    expression: expression,
    key: key, // Optional key expression
    keyOnly: isGuard, // Flag for guard-only behavior
    content: []
  };
  
  setCurrentContent(newNode);
  addToAST(newNode);
  break;
}

case 'CLOSE_RERENDER': {
  returnToLastContent();
  break;
}
```

#### Add Parser Method
```javascript
parseRerenderExpression(content) {
  // Parse "expression key=keyExpr" syntax
  const keyMatch = content.match(/\s+key=(.+)$/);
  if (keyMatch) {
    const expression = content.replace(/\s+key=.+$/, '').trim();
    const key = keyMatch[1].trim();
    return { expression, key };
  }
  return { expression: content.trim(), key: null };
}
```

### 2. Renderer Changes (`packages/renderer/src/lit/renderer.js`)

#### Add Switch Case
```javascript
case 'rerender':
  this.addValue(this.evaluateRerender(node, data));
  break;
```

#### Add Evaluation Method
```javascript
evaluateRerender(node, data) {
  const directiveMap = (value, key) => {
    if (key == 'expression') {
      return () => this.evaluateExpression(value, data);
    }
    if (key == 'key') {
      return () => this.evaluateExpression(value, data);
    }
    if (key == 'content') {
      return () => this.renderContent({ ast: value, data });
    }
    return value;
  };
  
  // Store original expression for debugging
  node.expression = node.expression;
  
  let rerenderArguments = mapObject(node, directiveMap);
  return reactiveRerender(rerenderArguments);
}
```

### 3. Directive Implementation (`packages/renderer/src/lit/directives/reactive-rerender.js`)

#### Complete Implementation
```javascript
import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { isClient } from '@semantic-ui/utils';

export class ReactiveRerenderDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.lastKey = Symbol('initial'); // Unique initial value
  }

  render(condition) {
    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create new reaction on client
    if (isClient) {
      this.watchChanges(condition);
    }

    return this.renderCurrentState(condition);
  }

  watchChanges(condition) {
    const context = {
      message: `rerender block: {#${condition.keyOnly ? 'guard' : 'rerender'} ${condition.expression}}`,
      rerender: condition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // Evaluate expression to establish reactive dependencies
      condition.expression();
      
      // For keyed rerender, also evaluate key
      let currentKey = this.lastKey;
      if (condition.key || condition.keyOnly) {
        const keyExpr = condition.key || condition.expression;
        currentKey = keyExpr();
      }

      // Decide whether to rerender
      let shouldRerender = !computation.firstRun;
      
      if (condition.key || condition.keyOnly) {
        // Key-based rerendering: only if key changed
        shouldRerender = shouldRerender && (currentKey !== this.lastKey);
        this.lastKey = currentKey;
      }

      if (shouldRerender) {
        this.setValue(condition.content());
      }
    }, { context });
  }

  renderCurrentState(condition) {
    return condition.content();
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // Reaction will be recreated in next render
  }
}

export const reactiveRerender = directive(ReactiveRerenderDirective);
```

### 4. Export Updates (`packages/renderer/src/index.js`)

```javascript
export { ReactiveRerenderDirective, reactiveRerender } from './lit/directives/reactive-rerender.js';
```

## Data Context Understanding

**Critical:** Semantic UI's data context is **flattened**. Template expressions access values directly by name, not through nested objects:

```javascript
// Component has flattened data context
const dataContext = {
  userId: state.userId.get(),           // From state
  theme: settings.theme,                // From settings  
  apiEndpoint: self.apiEndpoint,        // From component instance
  getUserDisplayName: self.getUserDisplayName  // Method reference
}
```

**Template usage:**
```html
{#rerender userId + theme}
  <!-- NOT user.id or settings.theme -->
  <div>{getUserDisplayName}</div>  <!-- Functions don't need () in templates -->
{/rerender}
```

## Performance Considerations

### Memory Management
- Reactions are automatically cleaned up on disconnect
- Use `lastKey` caching to avoid unnecessary rerenders
- Share directive implementation between rerender and guard

### Optimization Strategies
- Use `{#guard}` for expensive computations
- Combine multiple reactive dependencies in single expression
- Consider debouncing for rapid updates (future enhancement)

## Testing Strategy

### Unit Tests (Directive)
```javascript
describe('ReactiveRerenderDirective', () => {
  test('rerenders when reactive dependency changes')
  test('does not rerender when key unchanged (guard mode)')
  test('handles hybrid expression + key syntax')
  test('cleans up reactions on disconnect')
})
```

### Integration Tests (Template Compiler)
```javascript
describe('Rerender Template Compilation', () => {
  test('parses {#rerender expression} syntax')
  test('parses {#guard expression} syntax') 
  test('parses hybrid key= syntax')
  test('generates correct AST nodes')
})
```

### Performance Tests
```javascript
describe('Rerender Performance', () => {
  test('guard prevents unnecessary rerenders')
})
```

## Migration & Compatibility

### Existing Code
- No breaking changes to existing templates
- New blocks are opt-in enhancements
- Follows established compiler patterns

### When to Use Each Approach

**Use `{#rerender}`:**
- Need to capture non-reactive data changes
- Third-party component integration
- Simple reactive dependency watching

**Use `{#guard}`:**
- Expensive rendering operations
- Want to prevent unnecessary updates
- Complex key-based change detection

**Use hybrid syntax:**
- Advanced use cases requiring both patterns
- Performance-critical sections with complex dependencies

## Future Enhancements

Potential additions without breaking changes:

1. **Debouncing:** `{#rerender expression debounce=300}`
2. **Conditional rerender:** `{#rerender expression when=condition}`
3. **Named blocks:** `{#rerender "component-name" expression}`
4. **Rerender groups:** Coordinate multiple blocks

## Implementation Contract

**EXACT IMPLEMENTATION STEPS:**

1. **Template Compiler** (`packages/templating/src/compiler/template-compiler.js`):
   - Add `RERENDER: '^{OPEN}\\s*#(rerender|guard)\\s+'` pattern
   - Add `CLOSE_RERENDER: '^{OPEN}\\s*\\/(rerender|guard)\\s*'` pattern
   - Add case for `RERENDER` that creates `{ type: 'rerender', expression, keyOnly, content: [] }`
   - Add case for `CLOSE_RERENDER` that calls `returnToLastContent()`

2. **Renderer** (`packages/renderer/src/lit/renderer.js`):
   - Add `case 'rerender':` in readAST() switch statement
   - Implement `evaluateRerender(node, data)` following the EXACT pattern from `evaluateConditional`
   - Map expression and content functions using `directiveMap`

3. **Directive** (`packages/renderer/src/lit/directives/reactive-rerender.js`):
   - Create `ReactiveRerenderDirective` extending `AsyncDirective`
   - Implement `render()`, `watchChanges()`, `renderCurrentState()`, `disconnected()`
   - Handle `keyOnly` flag for guard behavior with key comparison logic
   - Export as `reactiveRerender = directive(ReactiveRerenderDirective)`

4. **Exports** (`packages/renderer/src/index.js`):
   - Add `ReactiveRerenderDirective` and `reactiveRerender` to exports

**SUCCESS CRITERIA:** 
- All syntax examples in this proposal work correctly
- Follows EXACT patterns from existing directives
- No deviation from specified behavior
