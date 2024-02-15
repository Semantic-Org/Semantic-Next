import { createComponent } from '@semantic-ui/component';

import template from './todo-footer.html';
import css from './todo-footer.css';

const createInstance = (tpl, $) => ({
  filters: ['all', 'active', 'complete'],

  todoList() {
    return tpl.parent('todoList');
  },

  getIncomplete() {
    const todos = tpl.todoList().todos.get();
    return todos.filter((todo) => !todo.completed);
  },

  hasAnyCompleted() {
    return tpl.todoList().todos.value.some((todo) => todo.completed);
  },

  isActiveFilter(filter) {
    return tpl.todoList().filter.get() == filter;
  },

  setFilter(filter) {
    tpl.todoList().filter.set(filter);
  },

  clearCompleted() {
    tpl.todoList().todos.removeItems((todo) => todo.completed);
  },
});

const events = {
  'click .filters'(event, tpl, $, data) {
    tpl.setFilter(data.filter);
  },
  'click .clear-completed'(event, tpl) {
    tpl.clearCompleted();
  },
};

const todoFooter = createComponent({
  templateName: 'todoFooter',
  template,
  css,
  createInstance,
  events,
});

export { todoFooter };
