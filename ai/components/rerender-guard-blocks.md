# Rerender and Guard Blocks

## Overview

Rerender and guard blocks are template syntax features that control when and how template sections re-evaluate in response to reactive data changes.

## Syntax

### Rerender Block
Forces complete re-evaluation of content when reactive dependencies change:
```html
{#rerender expression}
  <!-- Content re-evaluates when expression's dependencies change -->
{/rerender}
```

### Guard Block  
Only re-evaluates content when the computed value changes:
```html
{#guard keyExpression}
  <!-- Content only re-evaluates when keyExpression result changes -->
{/guard}
```

## Implementation Details

### AST Structure
Both blocks use `type: 'rerender'` with different property combinations:

```javascript
// Rerender block
{
  type: 'rerender',
  expression: 'userId',
  key: null,
  content: [...]
}

// Guard block
{
  type: 'rerender', 
  expression: null,
  key: 'getUserStatus',
  content: [...]
}
```

### How It Works

1. **Rerender blocks** establish reactive dependencies on the expression and force complete content re-evaluation whenever those dependencies change. This includes re-evaluating non-reactive expressions like timestamps.

2. **Guard blocks** use `Reaction.guard()` to track when the key expression's computed value changes. Content only re-evaluates when the value is different from the previous evaluation.

### Key Difference from Conditionals

Unlike `{#if}` blocks which show/hide content, rerender blocks always show their content but control when it gets refreshed. This is useful for:
- Refreshing timestamps when data changes
- Re-computing derived values
- Forcing template expressions to re-evaluate

## Use Cases

### Rerender Block Use Cases
- Displaying timestamps that should update when related data changes
- Showing computed values that depend on reactive state
- Forcing re-evaluation of helper functions

### Guard Block Use Cases  
- Expensive computations that should only re-run when necessary
- Preventing unnecessary DOM updates for frequently changing data
- Optimizing render performance for complex templates

### Example Patterns

```html
<!-- Timestamp updates when user changes -->
{#rerender userId}
  <p>Last updated: {getTimestamp}</p>
  <p>User: {userName}</p>
{/rerender}

<!-- Only re-render when status actually changes -->
{#guard computeUserStatus}
  <div class="status-{computeUserStatus}">
    <p>Status: {computeUserStatus}</p>
    <p>Complex UI based on status...</p>
  </div>
{/guard}
```

## Performance Considerations

1. **Rerender blocks** can be expensive if they contain large amounts of content or are triggered frequently
2. **Guard blocks** add a small overhead to track the key value but can significantly reduce re-renders

## Related Concepts

- **Reactive Conditionals** (`{#if}`) - For showing/hiding content
- **Reactive Expressions** (`{expression}`) - For individual reactive values  
- **Signals and Reactions** - The underlying reactivity system

## Common Pitfalls

1. Using rerender blocks for content that doesn't need forced re-evaluation
2. Forgetting that guard blocks still track their key expression reactively
3. Using complex computations in guard keys that defeat the performance benefit