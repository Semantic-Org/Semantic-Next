---
title: Reactivity Package Guide
description: Comprehensive guide to the @semantic-ui/reactivity package, a standalone signals-based reactive system with automatic dependency tracking for state management.
keywords: [reactivity, signals, reactions, dependency tracking, state management, computed values]
audience: framework
skill: reactivity
type: doc
---

# Semantic UI Reactivity System Guide

**For AI agents working with Semantic UI's `@semantic-ui/reactivity` package**

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
import { Signal, Reaction, Dependency, Scheduler } from '@semantic-ui/reactivity';
```

## Signal API

### Constructor

```javascript
new Signal(initialValue, options)
```

**Parameters**:
- `initialValue`: Any - The initial value for the signal
- `options`: Object (optional)
  - `context`: Object - Debugging context metadata
  - `equalityFunction`: Function - Custom equality comparison (default: deep equality)
  - `allowClone`: Boolean - Whether to clone values (default: true) 
  - `cloneFunction`: Function - Custom cloning function (default: deep clone)

**Examples**:
```javascript
// Basic signal
const count = new Signal(0);

// Signal with no cloning (for performance or object identity)
const element = new Signal(domElement, { allowClone: false });

// Signal with custom equality
const user = new Signal(userData, {
  equalityFunction: (a, b) => a.id === b.id  // Only compare by ID
});

// Signal with debugging context
const items = new Signal([], {
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

#### Subscription
```javascript
const unsubscribe = signal.subscribe((value, reaction) => {
  console.log('Signal changed to:', value);
  // reaction object provides metadata about the change
});

// Clean up
unsubscribe.stop();
```

### Data Type Helpers

#### Array Operations
```javascript
const items = new Signal([1, 2, 3]);

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
items.setArrayProperty(0, 'completed', true);        // Set property on item at index
items.setArrayProperty('completed', true);           // Set property on all items
```

#### Object Operations
```javascript
const user = new Signal({ name: 'Alice', age: 30 });

// Property operations
user.setProperty('name', 'Bob');                     // Set single property
user.setProperty('profile', 'bio', 'Software dev');  // Set nested property
```

#### Number Operations
```javascript
const counter = new Signal(0);

counter.increment();           // Add 1
counter.increment(5);          // Add 5
counter.increment(2, 10);      // Add 2, max value 10

counter.decrement();           // Subtract 1  
counter.decrement(3);          // Subtract 3
counter.decrement(2, 0);       // Subtract 2, min value 0
```

#### Boolean Operations
```javascript
const flag = new Signal(false);

flag.toggle();                 // Flip boolean value
```

#### Date Operations
```javascript
const timestamp = new Signal(new Date('2023-01-01'));

timestamp.now();               // Set to current date/time
```

#### ID-based Operations (for arrays of objects)
```javascript
const users = new Signal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

// Find by ID (supports id, _id, hash, key properties)
const index = users.getItem(1);           // Returns index of item with id=1
users.setProperty(1, 'name', 'Alice2');   // Set property on item with id=1
users.replaceItem(1, newUserObject);      // Replace entire item with id=1
users.removeItem(1);                      // Remove item with id=1
```

### Advanced Signal Configuration

#### Custom Equality Functions
```javascript
// Only trigger updates when specific properties change
const user = new Signal(userData, {
  equalityFunction: (oldUser, newUser) => {
    return oldUser.id === newUser.id && 
           oldUser.name === newUser.name &&
           oldUser.email === newUser.email;
    // Changes to other properties won't trigger updates
  }
});
```

#### Cloning Control
```javascript
// Disable cloning for performance or object identity preservation
const expensiveObject = new Signal(largeDataStructure, {
  allowClone: false  // No cloning, use object as-is
});

// Custom cloning function
const customSignal = new Signal(data, {
  cloneFunction: (value) => {
    // Custom cloning logic
    return JSON.parse(JSON.stringify(value));
  }
});
```

#### Debugging Setup
```javascript
const signal = new Signal(initialValue, {
  context: { 
    name: 'userList',
    component: 'UserManager',
    description: 'List of active users'
  }
});

// Enable stack traces for debugging
signal.setTrace();

// Add additional context
signal.addContext({ lastModified: Date.now() });

// Access debugging info
console.log(signal.context);
```

## Reaction API

### Creating Reactions

```javascript
// Create and run immediately (default)
const reaction = Reaction.create((reaction) => {
  const value = signal.get();  // Creates dependency
  console.log('Signal value:', value);
  
  if (reaction.firstRun) {
    console.log('This is the first execution');
  }
});

// Create without running immediately
const reaction = Reaction.create(callback, { firstRun: false });
reaction.boundRun(); // Run manually when ready
```

### Reaction Lifecycle

```javascript
const reaction = Reaction.create((reaction) => {
  // Reaction logic here
});

// Check if active
console.log(reaction.active);  // true

// Stop the reaction
reaction.stop();              // Cleans up dependencies, prevents future runs

// Check if stopped
console.log(reaction.active); // false
```

### Reaction Context and Debugging

```javascript
const reaction = Reaction.create((reaction) => {
  // Access reaction metadata
  console.log(reaction.firstRun);    // Boolean: is this the first execution?
  console.log(reaction.context);     // Debugging context
}, {
  context: { name: 'userValidator', source: 'ValidationSystem' }
});

// Add context after creation
reaction.addContext({ lastRun: Date.now() });

// Enable stack traces
reaction.setTrace();
```

## Signal Derived and Computed Values

### Instance Method: derive()

**Single-source transformation**: Creates a new signal that derives its value from this signal.

```javascript
const items = new Signal(['apple', 'banana', 'cherry']);
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

### Static Method: Signal.computed()

**Multi-source computation**: Creates a signal that computes its value from multiple signals.

```javascript
const quantity = new Signal(5);
const price = new Signal(10.99);
const taxRate = new Signal(0.08);

const total = Signal.computed(() => {
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

**Use cases**:
- Combine multiple signals into totals, averages, or complex calculations
- Create conditional values based on multiple state signals
- Aggregate data from different sources
- Build reactive formulas and expressions

### When to Use Each

**Use `derive()` when:**
- Transforming **one signal** into another format
- Creating pipelines of single-source operations
- The relationship is clearly "this derives from that"

**Use `Signal.computed()` when:**
- Combining **multiple signals** into one value
- Dependencies come from different sources
- Creating complex calculations or conditional logic

### Advanced Patterns

**Chaining derived signals:**
```javascript
const users = new Signal([...]);
const activeUsers = users.derive(arr => arr.filter(u => u.active));
const activeCount = activeUsers.derive(arr => arr.length);
```

**Mixed derive and computed:**
```javascript
const items = new Signal([...]);
const subtotal = items.derive(arr => arr.reduce((sum, item) => sum + item.price, 0));
const tax = Signal.computed(() => subtotal.get() * taxRate.get());
const total = Signal.computed(() => subtotal.get() + tax.get());
```

**Performance considerations:**
- For complex single-source transformations, do them in one derive() rather than chaining
- Derived/computed signals inherit all Signal behavior (equality checking, cloning, etc.)
- Each derive/computed creates a Reaction internally

## Static Reaction Methods

### Manual Scheduling Control

```javascript
// Force immediate execution of all pending reactions
Reaction.flush();

// Run code after all reactions complete
Reaction.afterFlush(() => {
  // All reactive updates are done, safe for DOM operations
  console.log('All reactions finished');
});

// Schedule a flush (usually automatic)
Reaction.scheduleFlush();
```

### Non-reactive Execution

```javascript
// Read signals without creating dependencies
const value = Reaction.nonreactive(() => {
  return signal.get();  // Won't create dependency in current reaction
});

// Useful for debugging or conditional logic
Reaction.create(() => {
  const shouldProcess = Reaction.nonreactive(() => {
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
const result = Reaction.guard(() => {
  // Expensive computation
  return expensiveCalculation(signal.get());
});

// With custom equality check
const result = Reaction.guard(
  () => expensiveCalculation(signal.get()),
  (oldResult, newResult) => oldResult.id === newResult.id
);
```

## Standalone Usage Patterns

### Basic Reactive State

```javascript
import { Signal, Reaction } from '@semantic-ui/reactivity';

// Create reactive state
const count = new Signal(0);
const message = new Signal('Hello');

// Create reactive computations
Reaction.create(() => {
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
const items = new Signal([
  { id: 1, completed: false },
  { id: 2, completed: true },
  { id: 3, completed: false }
]);

const completedCount = new Signal(0);
const totalCount = new Signal(0);

// Automatically compute derived state
Reaction.create(() => {
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
const preferences = new Signal(
  JSON.parse(localStorage.getItem('prefs') || '{}')
);

Reaction.create(() => {
  const prefs = preferences.get();
  localStorage.setItem('prefs', JSON.stringify(prefs));
});

// Sync with server
const userData = new Signal(null);

Reaction.create(() => {
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
const items = new Signal([]);
const needsRecompute = new Signal(false);

Reaction.create(() => {
  const currentItems = items.get();
  needsRecompute.set(true);
  
  Reaction.afterFlush(() => {
    if (needsRecompute.get()) {
      performExpensiveComputation(currentItems);
      needsRecompute.set(false);
    }
  });
});

// Use peek() to avoid unnecessary dependencies
Reaction.create(() => {
  const triggerValue = triggerSignal.get();  // Creates dependency
  
  // Read other signals without creating dependencies
  const data1 = signal1.peek();
  const data2 = signal2.peek();
  
  processData(triggerValue, data1, data2);
});
```

## Key Principles

1. **Signals hold reactive state**: Use `Signal` for any state that should trigger updates
2. **Reactions observe changes**: Use `Reaction.create()` for side effects and computations
3. **Automatic dependency tracking**: Reading a signal inside a reaction creates a dependency
4. **Equality-based updates**: Signals only trigger updates when values actually change
5. **Cloning prevents mutations**: Values are cloned by default to prevent accidental mutations
6. **Configurable behavior**: Cloning, equality, and other behaviors can be customized
7. **Standalone operation**: No dependency on components or framework - works anywhere

## Common Use Cases

- **State management**: Replace useState/setState patterns with reactive signals
- **Computed values**: Automatically derive state from other reactive values  
- **External sync**: Keep signals in sync with localStorage, APIs, URL state
- **Performance optimization**: Batch expensive operations with afterFlush
- **Data validation**: Reactive validation that updates as data changes
- **Cache invalidation**: Automatically invalidate caches when dependencies change

This reactivity system provides a solid foundation for building reactive applications with automatic dependency tracking and efficient update propagation.