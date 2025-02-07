// Helper: removeIndex
import { Signal, Reaction } from '@semantic-ui/reactivity';

const tasks = new Signal([
  { text: 'Learn Signals', completed: true },
  { text: 'Write Tests', completed: false },
  { text: 'Update Docs', completed: false }
]);

Reaction.create((reaction) => {
  const currentTasks = tasks.get();
  if(!reaction.firstRun) {
    console.log('Remaining tasks:', currentTasks);
  }
});

// Remove first task
tasks.removeIndex(0);
