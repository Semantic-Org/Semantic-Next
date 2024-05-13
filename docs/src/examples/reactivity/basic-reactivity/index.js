import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let obj1 = { name: 'Sally', age: 22 };
let obj2 = { name: 'Tom', age: 28 };
let reactiveObj = new ReactiveVar(obj1);
Reaction.create(reaction => {
  const inner1 = reactiveObj.get(); // reactivity source
  const inner2 = obj2; // not reactive
  if(reaction.firstRun) {
    console.log('first run');
  }
  else {
    console.log('value changed', inner1);
  }
});

obj1.age = 30;
// causes reaction
reactiveObj.set(obj1);

// causes no reaction
obj2.age = 30;
