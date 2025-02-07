import { Signal, Reaction } from '@semantic-ui/reactivity';

const users = new Signal([
  { id: 'aliceuser', name: 'Alice', health: 'Bad' },
  { id: 'samuser', name: 'Sam', health: 'Okay'},
]);

// Reaction logs when value changes
Reaction.create((reaction) => {
  const currentUsers = users.get();
  if(!reaction.firstRun) {
    console.log(currentUsers);
  }
});

// changes aliceuser's name to 'Allison'
users.setProperty('aliceuser', 'name', 'Allison');

// changes everyone's health to 'Good'
users.setArrayProperty('health', 'Good');
