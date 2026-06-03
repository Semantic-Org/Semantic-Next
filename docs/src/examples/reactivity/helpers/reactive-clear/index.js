import { flush, reaction, signal } from '@semantic-ui/reactivity';

const userData = signal({ name: 'Alice', age: 30 });

reaction((computation) => {
  const user = userData.get();
  if (!computation.firstRun) {
    console.log(`User data: ${user ? JSON.stringify(user) : 'cleared'}`);
  }
});

userData.set({ name: 'Bob', age: 25 });
flush();

userData.clear();
flush();
