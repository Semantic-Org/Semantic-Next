# @semantic-ui/reactivity

This is a paired down signal/reactivity library loosely inspired by [Tracker](https://github.com/meteor/meteor/tree/devel/packages/tracker) from [Meteor JS](https://github.com/meteor/meteor/). It is used to control reactive updates from Semantic and is built into its templating system.


`ReactiveVar` lets you define a variable which will trigger any `Reaction` or functions called by a reaction to retrigger when it is modified.

`Reaction` is a reactive context, this will rerun when referenced reactive values are modified.

Reactions are enqueued and then flushed using the [microtask queue](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

- [Basic Usage](#basic-usage)
- [Equality](#equality)
  * [Property / Array Mutations](#property--array-mutations)
  * [Booleans](#booleans)
  * [First Run](#first-run)
- [Controlling Reactivity](#controlling-reactivity)
  * [Guard](#guard)
  * [Peeking at Current Value](#peeking-at-current-value)
  * [Nonreactive](#nonreactive)
  * [Flushing Changes](#flushing-changes)
  * [Accessing Computation](#accessing-computation)
- [Helper Functions](#helper-functions)
  * [Number Helpers](#numbers)
  * [Array Mutation Helpers](#array-mutation-helpers)
  * [Array of Objects](#array-of-objects)


## Basic Usage

You can create a reaction by simply creating a variable then modifying its value.

```javascript

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let reactiveValue = new ReactiveVar('first');
Reaction.create(computation => {
  console.log(reactiveValue.get());
});

// equivalent ways to set value
saying.value = 'second' // option 1
saying.set('second');  // option 2

// outputs first, second
```

 Any computation will receive itself as the first parameter of its callback, which you use to do things like check if its the `firstRun` or call `stop()` to stop the computation.

```javascript

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('hello');
Reaction.create(comp => {
  if(comp.firstRun) {
    console.log('First run!');
  }
  // stop computation if value is set to goodbye
  if(saying.value == 'goodbye') {
    comp.stop();
  }
});
saying.set('goodbye');
```

## Equality

When declaring a reactive variable you can pass in an equality function that will be used to determine if calculations should be rerun when the value is updated. The default function is [`isEqual`](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/utils) from utils which will handle most common cases like dates, binary data and deep object equality.

Objects

```javascript

let obj1 = { name: 'Sally', age: 22 };
let obj2 = { name: 'Sally', age: 22 };
let reactiveObj = new ReactiveVar(obj1);
Reaction.create(comp => {
  console.log(reactiveObj.get());
});
reactiveObj.set(obj2);

// outputs {name: 'Sally', age: 22}

```

```javascript

let obj1 = { name: 'Sally', age: 22 };
let obj2 = { name: 'Sally', age: 23 };
let reactiveObj = new ReactiveVar(obj1);

Reaction.create(comp => {
  console.log(reactiveObj.get());
});

reactiveObj.set(obj2);
// outputs {name: 'Sally', age: 22}
// outputs {name: 'Sally', age: 23}

```

```javascript
// always rerun
const customIsEqual = (a, b) => {
  return false;
}
let reactiveObj = new ReactiveVar({ name: 'Sally', age: 22 }, customIsEqual);

Reaction.create(comp => {
  const obj = reactiveObj.get();
  console.log('Log');
});
reactiveObj.set(reactiveObj.get());
// log runs twice
```

### Property / Array Mutations

You can use the `set` helper to declaratively update values like arrays and objects, which would not normally trigger reactivity if you simply modify their `value`.

Objects

```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let person = {
  name: 'Jack',
  age: 32,
}
let reactivePerson = new ReactiveVar(person);
Reaction.create(comp => {
  console.log(reactivePerson.get().name);
});

person.name = 'Jill';

reactivePerson.set(person);
// outputs Jack, Jill
```

Arrays

```javascript

let rows = [
  { name: 'Sally', age: 22 },
  { name: 'Jack', age: 32 }
];
let reactiveRows = new ReactiveVar(rows);

Reaction.create(comp => {
  console.log(reactiveRows.get().length);
});

rows.pop();

reactiveRows.set(rows);
// outputs 2, 1
```

```javascript
const numbers = new ReactiveVar([10, 20, 30]);

// Add an item to the end
numbers.push(40);
// 10, 20, 30, 40

numbers.unshift(0);
// 0, 10, 20, 30, 40

numbers.splice(0, 2);
// 0, 10

numbers.setIndex(1, 99);
// 0, 99

numbers.removeIndex(1);
// 0
```

### Booleans

Boolean helpers allow you to toggle the state of a ReactiveVar that holds a boolean value.

```javascript
const isToggled = new ReactiveVar(false);

// Toggle the boolean value
isToggled.toggle();
console.log('Value is now true');

isToggled.toggle();
console.log('Value is now false again');
```

### First Run

You can use `firstRun` to determine if this calculation is running from an initial value being set. Keep in mind though if you leave the function early on first run it will never set up a reactive reference to unreachable code.

```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('hello');
Reaction.create(comp => {
  if(comp.firstRun) {
    return;
  }
  let saying = saying.get();
  console.log(saying);
  // outputs nothing (early termination on first run prevents reactive var from being referenced)
});

Reaction.create(comp => {
  let saying = saying.get();
  if(comp.firstRun) {
    return;
  }
  console.log(saying);
  // outputs goodbye
});

saying.set('goodbye');

```

## Controlling Reactivity

### Guard

You can help fine-tune reactivity by using guard to only pay attention to certain parts of a reactive context

```javascript
  const userAge = new ReactiveVar(30);
  const userName = new ReactiveVar('John Doe');
  const lastUpdated = new ReactiveVar(new Date()); // Assume this updates frequently
  const getUserInfo = () => {
    return {
      name: userName,
      age: userAge,
      date: lastUpdated,
    };
  };
  Reaction.create((comp) => {
    Reaction.guard(() => {
      let user = getUserInfo(); // we only want to call this function if name/age changes
      return {
        name: user.name,
        age: user.age,
      };
    });
    if(!comp.firstRun) {
      console.log(`User Info Updated: Name: ${userInfo.name}, Age: ${userInfo.age}`);
    }
    // Simulate updates
    setTimeout(() => {
      userName.value = 'Jane Doe'; // This should trigger the reaction
    }, 300);
    setTimeout(() => {
      userAge.value = 31; // This should also trigger the reaction
    }, 1000);
    setTimeout(() => {
      lastUpdated.value = new Date(); // This should NOT trigger the reaction
    }, 2000);
  });
```

### Peeking at Current Value

To get the current value of a `ReactiveVar` without establishing a reactive dependency, use the `peek()` method. This is particularly useful when you need to access the value for read-only purposes outside of a reactive computation and do not want to trigger reactivity.

```javascript
const counter = new ReactiveVar(10);

// Access the value without triggering reactivity
const currentValue = counter.peek();
console.log(`Current value without establishing dependency: ${currentValue}`);
```

### Nonreactive
The `Reaction.nonreactive` function allows you to perform computations or access reactive variables without establishing a reactive dependency. This is useful when you need to read from a reactive source but don't want the surrounding computation to re-run when the source changes.

```javascript
const reactiveValue = new ReactiveVar('Initial Value');

// Perform a non-reactive read
Reaction.nonreactive(() => {
  const value = reactiveValue.get();
  console.log(`Read inside nonreactive: ${value}`);
});

reactiveValue.set('Updated Value'); // Does not trigger the console.log inside nonreactive
```

### Flushing Changes

When a `ReactiveVar` updates an update is enqueued and flushes asynchronously when the microtask queue is processed. This means that intermediary values will not be processed when updating code in a loop.

You can trigger the queue to be immediately flushed to prevent this by using the `Reaction.flush()` helper.

```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let number = new ReactiveVar(1);
Reaction.create(comp => {
  console.log(number.get());
});

[1,2,3,4,5].forEach(value => number.set(value));

let number = new ReactiveVar(1);
Reaction.create(comp => {
  console.log(number.get());
});

[1,2,3,4,5].forEach(value => {
  number.set(value);
  Reaction.flush();
});
// outputs 1,2,3,4,5
```

### Accessing Computation

You can access the current computation either using the returned value from `create` or as the first parameter of the callback.

This can be helpful to inspect the listeners or to stop the computation using the `stop` method.


```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let number = new ReactiveVar(1);
Reaction.create(comp => {
  if(number.get() > 3) {
    comp.stop();
    return;
  }
  console.log(number.get());
});

let comp = Reaction.create(() => {
  if(number.get() > 3) {
    comp.stop();
    return;
  }
  console.log(number.get());
});

[1,2,3,4,5].forEach(value => {
  number.set(value);
  Reaction.flush();
});
// both output 1,2,3

```

## Helper Functions

### Numbers

`ReactiveVar` includes a couple helpers numbers

```javascript
  let count = new ReactiveVar(0);
  count.increment(); // set to 1
```
```javascript
  let count = new ReactiveVar(0);
  count.increment(2); // set to 2
```
```javascript
  let count = new ReactiveVar(2);
  count.decrement(); // set to 1
```
```javascript
  let count = new ReactiveVar(0);
  count.decrement(2); // set to 1
```

### Date

`ReactiveVar` includes a helper to make dates asier

```javascript
  let date = new ReactiveVar().now(); // initializes as now
  setTimeout(() => {
    date.now(); // now 1 second later
  }, 1000);
```




### Array Mutation Helpers

`ReactiveVar` includes a few helpers for some of the most common usecases for manipulating arrays

```javascript
  let items = new ReactiveVar([0,1,2]);
  items.removeIndex(1); // outputs 0, 2
```
```javascript
  let items = new ReactiveVar([0,2,2]);
  items.setIndex(1); // outputs 0, 1, 2
```
```javascript
  let items = new ReactiveVar([0,1,2]);
  items.unshift(); // outputs 1, 2
```
```javascript
  let items = new ReactiveVar([0,1,2]);
  items.push(3); // outputs 0, 1, 2, 3
```

### Array of Objects

`ReactiveVar` provides several helpers for manipulating arrays of objects a common data structure when handling structured data.

```javascript
const tasks = new ReactiveVar([
  { _id: 'task1_uuid', task: 'Implement feature', completed: true }
  { _id: 'task2_uuid', task: 'Write Tests', completed: true }
  { _id: 'task3_uuid', task: 'Write documentation', completed: false },
]);
```

```javascript
// sets 'write documentation' to complete
tasks.setProperty('task3_uuid', 'completed', true);
```

```javascript
// replaces task 1 with new task
const newTask = { _id: 'tasks1_uuid', task: 'Reimplement feature', completed: false };
tasks.replaceItem('task1_uuid', newTask)
```

```javascript
// gets index of id
const index = tasks.getIndex('tasks1_uuid')
```

```javascript
// gets id from an item
const id = tasks.getID(tasks.get()[0])
```

```javascript
// remove task 2 from list
tasks.removeItem('tasks2_uuid')
```
