// Equality: Custom equality functions for signals
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Signal with custom equality (only compare by id)
const user = new Signal({ id: 1, name: 'Alice', lastLogin: '2023-01-01' }, {
  equalityFunction: (oldUser, newUser) => oldUser.id === newUser.id,
});

// Reaction to observe user changes
Reaction.create(() => {
  console.log('User:', user.get().name);
});

// Change name - triggers reaction (different id)
user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-02' });
Reaction.flush();

// Change lastLogin but keep same id - does NOT trigger (same id)
user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-03' });
Reaction.flush();

// Change name with same id - does NOT trigger (same id)
user.set({ id: 2, name: 'Robert', lastLogin: '2023-01-03' });
Reaction.flush();
