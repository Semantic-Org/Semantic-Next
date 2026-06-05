// Helper: unshift
import { flush, reaction, signal } from '@semantic-ui/reactivity';
import { first } from '@semantic-ui/utils';

const chatMessages = signal([
  { user: 'system', text: 'Chat started' },
]);

reaction(() => console.log(first(chatMessages.value)));

// Add new message to start
chatMessages.unshift({ user: 'Alice', text: 'Hello!' });
flush();

// Add two new messages to start
chatMessages.unshift(
  { user: 'Bob', text: 'Hi everyone!' },
  { user: 'Charlie', text: 'Hey!' },
);
