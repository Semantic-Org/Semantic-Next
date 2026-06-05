---
title: Reactivity System Guide
description: Comprehensive guide to the @semantic-ui/reactivity package — a standalone signals-based reactive system with automatic dependency tracking for state management.
keywords: [signals, reactions, dependency tracking, state management, computed values, derived signals, reactive proxy, computed, afterFlush]
audience: authoring
skill: reactive-state
type: skill
---

# Reactivity System Guide

> **Skill:** `reactive-state`
> **Purpose:** Comprehensive guide to the @semantic-ui/reactivity package — a standalone signals-based reactive system with automatic dependency tracking for state management.
> **Last Updated:** 2026-03-04

---

## Overview

The `@semantic-ui/reactivity` package is a standalone signals-based reactive system that provides fine-grained reactivity with automatic dependency tracking. It can be used independently of Semantic UI components for any application requiring reactive state management.

## Package Structure

```
@semantic-ui/reactivity
├── Signal      ← Core reactive primitive for state
├── Reaction    ← Reactive computations and side effects
├── Dependency  ← Internal dependency tracking system
└── Scheduler   ← Internal update batching and timing
```

**Main Exports**:
```javascript
import { signal, reaction, computed, derive, match } from '@semantic-ui/reactivity';
```

---

## Signal API

### Creating a Signal

```javascript
signal(initialValue, options)
```

**Parameters**:
- `initialValue`: Any - The initial value for the signal
- `options`: Object (optional)
  - `safety`: `'reference'` | `'clone'` | `'none'` - How the stored value is guarded against outside mutation (default: `'reference'`)
  - `equality`: Function - Custom equality comparison (default: deep equality)
  - `clone`: Function - Custom clone, used when `safety` is `'clone'` (default: deep clone)
  - `id`: Function - Resolves array-item identity for the id-based collection helpers
  - `context`: Object - Debugging context metadata

**Examples**:
```javascript
// Basic signal
const count = signal(0);

// 'reference' (the default) stores by reference, no cloning, preserving identity
const element = signal(domElement, { safety: 'reference' });

// Signal with custom equality
const user = signal(userData, {
  equality: (a, b) => a.id === b.id  // Only compare by ID
});

// Signal with debugging context
const items = signal([], {
  context: { name: 'todoItems', source: 'TodoStore' }
});
```

### Core Methods

#### Reading Values
```javascript
signal.get()           // Read value, creates dependency in reactive contexts
signal.value           // Property accessor, same as get()
signal.peek()          // Read value WITHOUT creating dependency
```

#### Writing Values
```javascript
signal.set(newValue)   // Set new value, triggers reactivity if changed
signal.value = newValue // Property setter, same as set()
signal.clear()         // Set value to undefined
```

### Data Type Helpers

#### Array Operations
```javascript
const items = signal([1, 2, 3]);

// Mutation helpers (reactive)
items.push(4, 5);              // Add items to end
items.unshift(0);              // Add items to beginning
items.splice(1, 2, 'a', 'b');  // Remove/replace items

// Transformation helpers (reactive)
items.map(x => x * 2);         // Transform all items
items.filter(x => x > 2);      // Filter items

// Index operations
items.getIndex(0);             // Get item at index (creates dependency)
items.setIndex(0, 'new');      // Set item at index
items.removeIndex(0);          // Remove item at index

// Array property operations
items.setIndexProperty(0, 'completed', true);        // Set property on item at index
items.setProperty('completed', true);                // Set property on every item
```

#### Object Operations
```javascript
const user = signal({ name: 'Alice', age: 30 });

// Property operations
user.setProperty('name', 'Bob');                     // Set single property
```

#### Number Operations
```javascript
const counter = signal(0);

counter.increment();           // Add 1
counter.increment(5);          // Add 5
counter.increment(2, 10);      // Add 2, max value 10

counter.decrement();           // Subtract 1
counter.decrement(3);          // Subtract 3
counter.decrement(2, 0);       // Subtract 2, min value 0
```

#### Boolean Operations
```javascript
const flag = signal(false);

flag.toggle();                 // Flip boolean value
```

#### Date Operations
```javascript
const timestamp = signal(new Date('2023-01-01'));

timestamp.now();               // Set to current date/time
```

#### ID-based Operations (for arrays of objects)
```javascript
const users = signal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

// Find by ID (supports id, _id, hash, key properties)
const index = users.getItem(1);           // Returns index of item with id=1
users.setItemProperty(1, 'name', 'Alice2');   // Set property on item with id=1
users.replaceItem(1, newUserObject);      // Replace entire item with id=1
users.removeItem(1);                      // Remove item with id=1
```

### Advanced Signal Configuration

#### Custom Equality Functions
```javascript
// Only trigger updates when specific properties change
const user = signal(userData, {
  equality: (oldUser, newUser) => {
    return oldUser.id === newUser.id &&
           oldUser.name === newUser.name &&
           oldUser.email === newUser.email;
    // Changes to other properties won't trigger updates
  }
});
```

#### Cloning Control
```javascript
// 'reference' (the default) skips cloning for performance or object identity
const expensiveObject = signal(largeDataStructure, {
  safety: 'reference'
});

// 'clone' stores defensive copies, here with a custom clone function
const customSignal = signal(data, {
  safety: 'clone',
  clone: (value) => {
    // Custom cloning logic
    return JSON.parse(JSON.stringify(value));
  }
});
```

#### Debugging Setup
```javascript
const userListSignal = signal(initialValue, {
  context: {
    name: 'userList',
    component: 'UserManager',
    description: 'List of active users'
  }
});

// Enable stack traces for debugging
userListSignal.setTrace();

// Add additional context
userListSignal.addContext({ lastModified: Date.now() });

// Access debugging info
console.log(userListSignal.context);
```

---

## Reaction API

### Creating Reactions

```javascript
// Create and run immediately (default)
const logReaction = reaction((computation) => {
  const value = mySignal.get();  // Creates dependency
  console.log('Signal value:', value);

  if (computation.firstRun) {
    console.log('This is the first execution');
  }
});

// Create without running immediately
const deferredReaction = reaction(callback, { firstRun: false });
deferredReaction.boundRun(); // Run manually when ready
```

### Reaction Lifecycle

```javascript
const myReaction = reaction((computation) => {
  // Reaction logic here
});

// Check if active
console.log(myReaction.active);  // true

// Stop the reaction
myReaction.stop();              // Cleans up dependencies, prevents future runs

// Check if stopped
console.log(myReaction.active); // false
```

### Reaction Context and Debugging

```javascript
const validatorReaction = reaction((computation) => {
  // Access reaction metadata
  console.log(computation.firstRun);    // Boolean: is this the first execution?
  console.log(computation.context);     // Debugging context
}, {
  context: { name: 'userValidator', source: 'ValidationSystem' }
});

// Add context after creation
validatorReaction.addContext({ lastRun: Date.now() });

// Enable stack traces
validatorReaction.setTrace();
```

---

## Derived and Computed Values

### Instance Method: derive()

**Single-source transformation**: Creates a new signal that derives its value from this signal.

```javascript
const items = signal(['apple', 'banana', 'cherry']);
const itemCount = items.derive(arr => arr.length);

// itemCount automatically updates when items change
items.push('orange');
console.log(itemCount.get()); // 4
```

**Parameters**:
- `computeFn`: Function - Receives the current signal value and returns the derived value
- `options`: Object (optional) - Same options as Signal constructor

**Use cases**:
- Transform array to count, filtered subset, or mapped values
- Extract properties from objects
- Format data for display
- Create calculated fields from single data sources

### Function: computed()

**Multi-source computation**: Creates a signal that computes its value from multiple signals.

```javascript
const quantity = signal(5);
const price = signal(10.99);
const taxRate = signal(0.08);

const total = computed(() => {
  const subtotal = quantity.get() * price.get();
  return subtotal + (subtotal * taxRate.get());
});

// total automatically updates when any dependency changes
quantity.set(3);
console.log(total.get()); // Recalculated total
```

**Parameters**:
- `computeFn`: Function - Accesses other signals with .get() and returns computed value
- `options`: Object (optional) - Same options as Signal constructor

### When to Use Each

**Use `derive()` when:**
- Transforming **one signal** into another format
- Creating pipelines of single-source operations
- The relationship is clearly "this derives from that"

**Use `computed()` when:**
- Combining **multiple signals** into one value
- Dependencies come from different sources
- Creating complex calculations or conditional logic

### Advanced Patterns

**Chaining derived signals:**
```javascript
const users = signal([...]);
const activeUsers = users.derive(arr => arr.filter(u => u.active));
const activeCount = activeUsers.derive(arr => arr.length);
```

**Mixed derive and computed:**
```javascript
const items = signal([...]);
const subtotal = items.derive(arr => arr.reduce((sum, item) => sum + item.price, 0));
const tax = computed(() => subtotal.get() * taxRate.get());
const total = computed(() => subtotal.get() + tax.get());
```

**Performance considerations:**
- For complex single-source transformations, do them in one derive() rather than chaining
- Derived/computed signals inherit all Signal behavior (equality checking, cloning, etc.)
- Each derive/computed creates a Reaction internally

---

## Scheduling and Control Functions

### Manual Scheduling Control

```javascript
// Force immediate execution of all pending reactions
flush();

// Run code after all reactions complete
afterFlush(() => {
  // All reactive updates are done, safe for DOM operations
  console.log('All reactions finished');
});

// Schedule a flush (usually automatic)
scheduleFlush();
```

### Non-reactive Execution

```javascript
// Read signals without creating dependencies
const value = nonreactive(() => {
  return mySignal.get();  // Won't create dependency in current reaction
});

// Useful for debugging or conditional logic
reaction(() => {
  const shouldProcess = nonreactive(() => {
    return someOtherSignal.get() > 10;  // Check condition without dependency
  });

  if (shouldProcess) {
    const data = mainSignal.get();  // This WILL create dependency
    processData(data);
  }
});
```

### Guarded Computations

```javascript
// Only trigger reactions if the computed result actually changes
const result = guard(() => {
  // Expensive computation
  return expensiveCalculation(mySignal.get());
});

// With custom equality check
const result = guard(
  () => expensiveCalculation(mySignal.get()),
  (oldResult, newResult) => oldResult.id === newResult.id
);
```

---

## Standalone Usage Patterns

### Basic Reactive State

```javascript
import { signal, reaction, afterFlush } from '@semantic-ui/reactivity';

// Create reactive state
const count = signal(0);
const message = signal('Hello');

// Create reactive computations
reaction(() => {
  const currentCount = count.get();
  const currentMessage = message.get();

  console.log(`${currentMessage}: ${currentCount}`);
});

// Update state (triggers reaction)
count.set(5);           // Logs: "Hello: 5"
message.set('Count');   // Logs: "Count: 5"
count.increment();      // Logs: "Count: 6"
```

### Derived State Pattern

```javascript
const items = signal([
  { id: 1, completed: false },
  { id: 2, completed: true },
  { id: 3, completed: false }
]);

const completedCount = signal(0);
const totalCount = signal(0);

// Automatically compute derived state
reaction(() => {
  const currentItems = items.get();

  totalCount.set(currentItems.length);
  completedCount.set(currentItems.filter(item => item.completed).length);
});

// Updates derived state automatically
items.push({ id: 4, completed: true });
console.log(completedCount.get()); // 2
console.log(totalCount.get());     // 4
```

### External System Integration

```javascript
// Sync with localStorage
const preferences = signal(
  JSON.parse(localStorage.getItem('prefs') || '{}')
);

reaction(() => {
  const prefs = preferences.get();
  localStorage.setItem('prefs', JSON.stringify(prefs));
});

// Sync with server
const userData = signal(null);

reaction(() => {
  const user = userData.get();
  if (user && user.id) {
    // Debounce or batch these requests in real applications
    fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  }
});
```

### Performance Optimization

```javascript
// Use afterFlush for expensive operations
const items = signal([]);
const needsRecompute = signal(false);

reaction(() => {
  const currentItems = items.get();
  needsRecompute.set(true);

  afterFlush(() => {
    if (needsRecompute.get()) {
      performExpensiveComputation(currentItems);
      needsRecompute.set(false);
    }
  });
});

// Use peek() to avoid unnecessary dependencies
reaction(() => {
  const triggerValue = triggerSignal.get();  // Creates dependency

  // Read other signals without creating dependencies
  const data1 = signal1.peek();
  const data2 = signal2.peek();

  processData(triggerValue, data1, data2);
});
```

---

## Key Principles

1. **Signals hold reactive state**: Use `Signal` for any state that should trigger updates
2. **Reactions observe changes**: Use `reaction()` for side effects and computations
3. **Automatic dependency tracking**: Reading a signal inside a reaction creates a dependency
4. **Equality-based updates**: Signals only trigger updates when values actually change
5. **Cloning prevents mutations**: Values are cloned by default to prevent accidental mutations
6. **Configurable behavior**: Cloning, equality, and other behaviors can be customized
7. **Standalone operation**: No dependency on components or framework - works anywhere

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Architecture Overview** | `architecture-overview` | Understanding how reactivity fits into SUI's architecture |
| **Utility Functions** | `utility-functions` | Utility functions for debounce, throttle, and other patterns alongside signals |
