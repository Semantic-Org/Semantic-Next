// Equality: Custom equality functions for signals
import { flush, reaction, signal } from '@semantic-ui/reactivity';

// Signal with custom equality (only compare by id)
const user = signal({ id: 1, name: 'Alice', lastLogin: '2023-01-01' }, {
  equality: (oldUser, newUser) => oldUser.id === newUser.id,
});

// Reaction to observe user changes
reaction(() => {
  console.log('User:', user.get().name);
});

// Change name - triggers reaction (different id)
user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-02' });
flush();

// Change lastLogin but keep same id - does NOT trigger (same id)
user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-03' });
flush();

// Change name with same id - does NOT trigger (same id)
user.set({ id: 2, name: 'Robert', lastLogin: '2023-01-03' });
flush();
