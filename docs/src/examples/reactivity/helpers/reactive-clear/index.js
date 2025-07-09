import { Reaction, Signal } from '@semantic-ui/reactivity';

const userData = new Signal({ name: 'Alice', age: 30 });

Reaction.create((reaction) => {
  const user = userData.get();
  if (!reaction.firstRun) {
    console.log(`User data: ${user ? JSON.stringify(user) : 'cleared'}`);
  }
});

userData.set({ name: 'Bob', age: 25 }); // Update user
Reaction.flush();

userData.clear(); // Clear to undefined
Reaction.flush();