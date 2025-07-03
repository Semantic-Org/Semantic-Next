// Helper: getItem (ID-based operations)
import { Reaction, Signal } from '@semantic-ui/reactivity';

const users = new Signal([
  { id: 1, name: 'Alice', status: 'online' },
  { id: 2, name: 'Bob', status: 'offline' },
  { id: 3, name: 'Carol', status: 'online' },
]);

Reaction.create(() => {
  const index = users.getItem(2); // Find user with id=2
  const user = users.get()[index];
  console.log(`User ${user.name} is ${user.status}`);
});

// Update user 2's status
users.setProperty(2, 'status', 'online');
Reaction.flush();

// Remove user 2
users.removeItem(2);
Reaction.flush();
