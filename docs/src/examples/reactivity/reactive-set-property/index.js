import { Signal } from '@semantic-ui/reactivity';

const users = new Signal([
  { id: 'aliceuser', name: 'Alice', health: 'Bad' },
  { id: 'samuser', name: 'Sam', health: 'Okay'},
]);

// changes aliceuser's age
users.setProperty('aliceuser', 'name', 'Allison');
console.log(users.get());

// changes everyone's health
users.setArrayProperty('health', 'Good');
console.log(users.get());
