// Helper: push
import { Signal, Reaction } from '@semantic-ui/reactivity';

const notifications = new Signal([
  { text: 'Welcome!', read: false }
]);

Reaction.create((reaction) => {
  const current = notifications.get();
  if(!reaction.firstRun) {
    console.log('New notification:', current[current.length - 1]);
  }
});

// Add new notification
notifications.push({ text: 'New message received', read: false });
Reaction.flush();
// Output: New notification: { text: 'New message received', read: false }

// Add multiple notifications
notifications.push(
  { text: 'Friend request', read: false },
  { text: 'System update', read: false }
);
Reaction.flush();
// Output: Shows latest notification added
