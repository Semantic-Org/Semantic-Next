import { Reaction, Signal } from '@semantic-ui/reactivity';

let person1 = new Signal({ name: 'Sally', age: 22 });
let person2 = { name: 'Tom', age: 28 };
Reaction.create(reaction => {
  const inner1 = person1.get(); // reactive
  const inner2 = person2; // not reactive
  if (reaction.firstRun) {
    console.log('first run');
  }
  else {
    console.log('value changed', inner1);
  }
});

// updating signal causes reaction
person1.setProperty('age', 30);

// updating variable causes no reaction
person2.age = 30;
