import { flush, reaction, signal } from '@semantic-ui/reactivity';

const tasks = signal([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Walk dog', completed: true },
  { id: 3, text: 'Write code', completed: false },
  { id: 4, text: 'Read book', completed: true },
]);

reaction((computation) => {
  const currentTasks = tasks.get();
  if (!computation.firstRun) {
    console.log(`Tasks: ${JSON.stringify(currentTasks)}`);
  }
});

// move completed tasks to the end
tasks.mutate(arr => {
  const completed = arr.filter(task => task.completed);
  const incomplete = arr.filter(task => !task.completed);
  arr.splice(0, arr.length, ...incomplete, ...completed);
});
flush();

// bulk-update with custom per-task logic
tasks.mutate(arr => {
  arr.forEach((task, index) => {
    task.priority = task.completed ? 'low' : (index < 2 ? 'high' : 'medium');
    if (!task.completed) {
      task.dueDate = new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString();
    }
  });
});
flush();
