import { reaction, signal } from '@semantic-ui/reactivity';

const users = signal([
  { id: 'aliceuser', name: 'Alice', health: 'Bad' },
  { id: 'samuser', name: 'Sam', health: 'Okay' },
]);

// Log any changes in users
reaction(() => console.log(users.value));

// changes aliceuser's name to 'Allison'
users.setProperty('aliceuser', 'name', 'Allison');

// changes everyone's health to 'Good'
users.setArrayProperty('health', 'Good');
