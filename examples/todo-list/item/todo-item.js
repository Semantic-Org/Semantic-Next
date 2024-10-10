import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';

import template from './todo-item.html?raw';
import css from './todo-item.css?raw';

const createInstance = ({ self, data, reactiveVar, findParent, $ }) => ({
  editing: reactiveVar(false),
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
  'dblclick li'({ event, self, $ }) {
    self.editing.set(true);
    Reaction.afterFlush(() => {
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
  createInstance,
  events,
});

export { todoItem };
