// Helper: getItem (ID-based operations)
import { Reaction, Signal } from '@semantic-ui/reactivity';

const users = new Signal([
  { id: 'user1', name: 'Alice', status: 'online' },
  { id: 'user2', name: 'Bob', status: 'offline' },
  { id: 'user3', name: 'Carol', status: 'online' },
]);

Reaction.create(() => {
  const user = users.getItem('user2'); // Find user with id=2
  console.log(`User ${user.name} is ${user.status}`);
});

// Update user 2's status
users.setProperty('user2', 'status', 'online');

