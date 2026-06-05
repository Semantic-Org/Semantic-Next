// Helper: push
import { flush, reaction, signal } from '@semantic-ui/reactivity';
import { last } from '@semantic-ui/utils';

const notifications = signal([
  { text: 'Welcome!', read: false },
]);

// output the last notification in array
reaction(() => console.log(last(notifications.get())));

// New message notification is last
notifications.push({ text: 'New message received', read: false });
flush();

// System update notification is last
notifications.push(
  { text: 'Friend request', read: false },
  { text: 'System update', read: false },
);
