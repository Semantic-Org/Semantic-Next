import { Reaction, Signal } from '@semantic-ui/reactivity';

const tasks = new Signal([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Walk dog', completed: true },
  { id: 3, text: 'Write code', completed: false },
  { id: 4, text: 'Read book', completed: true }
]);

Reaction.create((reaction) => {
  const currentTasks = tasks.get();
  if (!reaction.firstRun) {
    console.log(`Tasks: ${JSON.stringify(currentTasks)}`);
  }
});

// Using mutate for complex array restructuring
// Example: Move all completed tasks to the end
tasks.mutate(arr => {
  const completed = arr.filter(task => task.completed);
  const incomplete = arr.filter(task => !task.completed);
  arr.splice(0, arr.length, ...incomplete, ...completed);
});
Reaction.flush();

// Using mutate for complex conditional modifications
// Example: Bulk update with custom logic
tasks.mutate(arr => {
  arr.forEach((task, index) => {
    // Add priority based on position and completion
    task.priority = task.completed ? 'low' : (index < 2 ? 'high' : 'medium');
    // Add timestamps for incomplete tasks
    if (!task.completed) {
      task.dueDate = new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString();
    }
  });
});
Reaction.flush();