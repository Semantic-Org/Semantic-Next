// Helper: unshift
import { Signal, Reaction } from '@semantic-ui/reactivity';
import { first } from '@semantic-ui/utils';

const chatMessages = new Signal([
  { user: 'system', text: 'Chat started' }
]);

Reaction.create(() => console.log(first(chatMessages.value)));

// Add new message to start
chatMessages.unshift({ user: 'Alice', text: 'Hello!' });
Reaction.flush();

// Add two new messages to start
chatMessages.unshift(
  { user: 'Bob', text: 'Hi everyone!' },
  { user: 'Charlie', text: 'Hey!' }
);
