# @semantic-ui/reactivity

This is a paired down signal/reactivity library loosely inspired by [Tracker](https://github.com/meteor/meteor/tree/devel/packages/tracker) from [Meteor JS](https://github.com/meteor/meteor/). It is used to control reactive updates from Semantic and is built into its templating system.


`ReactiveVar` lets you define a variable which will trigger any `Reaction` or functions called by a reaction to retrigger when it is modified.

`Reaction` is a reactive context, this will rerun when referenced reactive values are modified.

Reactions are enqueued and then flushed using the [microtask queue](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)


### Basic

You can get or set values using `var.value` or `var.get()` and `var.set()`, both handle reactivity similarly and its up to developers preference which to use.

```javascript

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('hello');
Reaction.create(comp => {
  console.log(saying.get());
});

saying.set('goodbye');
// outputs hello, goodbye
```

```javascript

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('hello');
Reaction.create(comp => {
  console.log(saying.value);
});

saying.value = 'goodbye';
// outputs hello, goodbye
```

## Equality

You can specify an equality function as the second parameter of `ReactiveVar`. If it is not specified it will use the `isEqual` function provided in the utils library. The default equality function handles most general cases of equality including objects with matching properties, dates, and binary data.

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



### Property / Array Mutations

Unlike Preact Signals or Lit Reactive Elements, ReactiveVar will consider mutations to properties or arrays to be updates. This greatly simplifies many simple cases of reactivity like updating lists.

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
// outputs nothing since reactive reference is never reached because of early termination

```

### Flushing Changes

When a `ReactiveVar` updates an update is enqueued and flushes asynchronously when the microtask queue is processed. This means that intermediary values will not be processed when updating code in a loop.

You can trigger the queue to be immediately flushed to prevent this by using the `Tracker.flush()` helper.

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
