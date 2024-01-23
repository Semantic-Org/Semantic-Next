# @semantic-ui/reactivity

This is a paired down signal/reactivity library loosely inspired by Tracker from Meteor JS. It is used to control reactive updates from Semantic and is built into its templating system.


`ReactiveVar` lets you define a variable which will trigger any `Reaction` or functions called by a reaction to retrigger when it is modified.

`Reaction` is a reactive context, this will rerun when referenced reactive values are modified.

Reactions are enqueued and then flushed using the [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

## Equality

You can specify an equality function as the second parameter of ReactiveVar. If it is not specified it will use the `isEqual` function provided in the utils library. This handles most general cases of equality including objects with matching properties, dates, and binary data.

## Example


### Basic

```javascript

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('foo');
Reaction.create(comp => {
  let saying = tpl.saying.get();
  console.log(saying);
});
tpl.saying.set('goodbye');

// outputs hello, goodbye
```


### Property / Array Mutations

Unlike Preact Signals or Lit Reactive Elements, ReactiveVar will consider mutations to properties or arrays to be updates. This greatly simplifies many simple cases of reactivity like updating lists.

```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let person = new ReactiveVar({
  name: 'Jack',
  age: 32,
});
Reaction.create(comp => {
  if(comp.firstRun) {
    return;
  }
  console.log(person.get().name);
});

person.name = 'Jill';
// outputs Jack, Jill


### First Run

You can use `firstRun` to determine if this calculation is running from an initial value being set. Keep in mind though if you leave the function early on first run it will never set up a reactive reference to unreachable code.

```javascript
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let saying = new ReactiveVar('foo');
Reaction.create(comp => {
  if(comp.firstRun) {
    return;
  }
  let saying = tpl.saying.get();
  console.log(saying);
  // outputs nothing since reactive reference is never reached
});

Reaction.create(comp => {
  let saying = tpl.saying.get();
  if(comp.firstRun) {
    return;
  }
  console.log(saying);
  // outputs goodbye
});

tpl.saying.set('goodbye');

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
