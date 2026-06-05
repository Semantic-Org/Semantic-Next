// Helper: setIndexProperty
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const tasks = signal([
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Walk the dog', completed: false },
  { id: 3, title: 'Write code', completed: true },
]);

reaction(() => {
  const completed = tasks.get().filter(task => task.completed).length;
  console.log(`Completed tasks: ${completed}`);
});

// Mark first task as completed
tasks.setIndexProperty(0, 'completed', true);
flush();

// Mark all remaining tasks as completed
tasks.setProperty('completed', true);
flush();
