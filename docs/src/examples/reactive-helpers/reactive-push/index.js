// Helper: push
import { Signal, Reaction } from '@semantic-ui/reactivity';
import { last } from '@semantic-ui/utils';

const notifications = new Signal([
  { text: 'Welcome!', read: false }
]);

// output the last notification in array
Reaction.create(() => console.log( last(notifications.get()) ));

// New message notification is last
notifications.push({ text: 'New message received', read: false });
Reaction.flush();

// System update notification is last
notifications.push(
  { text: 'Friend request', read: false },
  { text: 'System update', read: false }
);
