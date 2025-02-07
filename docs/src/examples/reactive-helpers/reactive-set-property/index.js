import { Signal, Reaction } from '@semantic-ui/reactivity';

const users = new Signal([
  { id: 'aliceuser', name: 'Alice', health: 'Bad' },
  { id: 'samuser', name: 'Sam', health: 'Okay'},
]);

// Log any changes in users
Reaction.create(() => console.log(users.value));

// changes aliceuser's name to 'Allison'
users.setProperty('aliceuser', 'name', 'Allison');

// changes everyone's health to 'Good'
users.setArrayProperty('health', 'Good');
