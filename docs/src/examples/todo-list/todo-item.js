import { defineComponent, getText } from '@semantic-ui/component';
const css = await getText('./todo-item.css');
const template = await getText('./todo-item.html');

const createComponent = ({ self, data, signal, findParent, $ }) => ({
  editing: signal(false),
  getClasses() {
    return {
      completed: data.todo.completed,
      editing: self.editing.get()
    };
  },
  getTodos() {
    return findParent('todoList').todos;
  },
  toggleCompleted() {
    const todos = self.getTodos();
    const todo = data.todo;
    console.log(todos.value);
    todos.setProperty(todo._id, 'completed', !todo.completed);
  },
  changeText(text) {
    const todos = self.getTodos();
    todos.setProperty(data.todo._id, 'text', text);
  },
  removeTodo() {
    self.getTodos().removeItem(data.todo._id);
  },
});

const events = {
  'change .toggle'({ event, self, $ }) {
    self.toggleCompleted();
  },
  'click .destroy'({ event, self }) {
    self.removeTodo();
  },
  'dblclick li'({ event, self, afterFlush, $ }) {
    self.editing.set(true);
    afterFlush(() => {
      $('input.edit').focus();
    });
  },
  'keydown input.edit'({ event, self, $ }) {
    if (event.key === 'Enter') {
      $(this).blur();
    }
  },
  'blur input.edit'({ event, self, $ }) {
    self.changeText($(this).val());
    self.editing.set(false);
  },
};

const todoItem = defineComponent({
  templateName: 'todoItem',
  template,
  css,
  createComponent,
  events,
});

export { todoItem };
