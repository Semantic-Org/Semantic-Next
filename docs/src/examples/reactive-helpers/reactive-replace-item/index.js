// Helper: replaceItem
import { Signal, Reaction } from '@semantic-ui/reactivity';

const contacts = new Signal([
  { id: 'alice123', name: 'Alice', email: 'alice@email.com' },
  { id: 'bob456', name: 'Bob', email: 'bob@email.com' }
]);

Reaction.create((reaction) => {
  const currentContacts = contacts.get();
  if(!reaction.firstRun) {
    console.log('Updated contacts:', currentContacts);
  }
});

// Replace entire contact record
contacts.replaceItem('alice123', {
  id: 'alice123',
  name: 'Alice Smith',
  email: 'asmith@email.com'
});
Reaction.flush();
// Output: Shows updated contact list with Alice's new details
