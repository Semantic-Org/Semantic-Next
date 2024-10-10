import { defineComponent } from '@semantic-ui/component';
import template from './todo-footer.html?raw';
import css from './todo-footer.css?raw';

const createInstance = ({ self, findParent, $ }) => ({
  filters: ['all', 'active', 'complete'],

  todoList() {
    return findParent('todoList');
  },

  getIncomplete() {
    const todos = self.todoList().todos.get();
    return todos.filter((todo) => !todo.completed);
  },

  hasAnyCompleted() {
    return self.todoList().todos.value.some((todo) => todo.completed);
  },

  isActiveFilter(filter) {
    return self.todoList().filter.get() == filter;
  },

  setFilter(filter) {
    self.todoList().filter.set(filter);
  },

  scrollToBottom() {
    const todoList = $('.todo-list')[0];
    todoList.scrollTop = todoList.scrollHeight;
  },

  clearCompleted() {
    self.todoList().todos.filter((todo) => !todo.completed);
  },
});

const events = {
  'click .clear-completed'({ event, self }) {
    self.clearCompleted();
  },
};

const todoFooter = defineComponent({
  templateName: 'todoFooter',
  template,
  css,
  createInstance,
  events,
});

export { todoFooter };
