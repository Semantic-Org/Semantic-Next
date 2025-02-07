// Helper: replaceItem
import { Signal, Reaction } from '@semantic-ui/reactivity';

const contacts = new Signal([
  { id: 'alice123', name: 'Alice', email: 'alice@email.com' },
  { id: 'bob456', name: 'Bob', email: 'bob@email.com' }
]);

Reaction.create(() => console.log('Updated contacts:', contacts.value));

// Replace entire contact record
const newContact = {
  id: 'alice123',
  name: 'Alice Smith',
  email: 'asmith@email.com'
};
contacts.replaceItem('alice123', newContact);
// Output: Shows updated contact list with Alice's new details
