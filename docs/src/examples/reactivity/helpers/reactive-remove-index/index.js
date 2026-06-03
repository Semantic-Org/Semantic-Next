// Helper: removeIndex
import { reaction, signal } from '@semantic-ui/reactivity';

const tasks = signal([
  { text: 'Learn Signals', completed: true },
  { text: 'Write Tests', completed: false },
  { text: 'Update Docs', completed: false },
]);

reaction((computation) => {
  const currentTasks = tasks.get();
  if (!computation.firstRun) {
    console.log('Remaining tasks:', currentTasks);
  }
});

// Remove first task
tasks.removeIndex(0);
