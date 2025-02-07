// Helper: unshift
import { Signal, Reaction } from '@semantic-ui/reactivity';

const chatMessages = new Signal([
  { user: 'system', text: 'Chat started' }
]);

Reaction.create((reaction) => {
  const messages = chatMessages.get();
  if(!reaction.firstRun) {
    console.log('New message:', messages[0]);
  }
});

// Add new message to start
chatMessages.unshift({ user: 'Alice', text: 'Hello!' });
Reaction.flush();
// Output: New message: { user: 'Alice', text: 'Hello!' }

// Add multiple messages to start
chatMessages.unshift(
  { user: 'Bob', text: 'Hi everyone!' },
  { user: 'Charlie', text: 'Hey!' }
);
Reaction.flush();
// Output: Shows newest message at start
