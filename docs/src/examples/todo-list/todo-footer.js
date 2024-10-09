import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./todo-footer.css');
const template = await getText('./todo-footer.html');


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
    const listEl = $('.todo-list').get(0);
    listEl.scrollTop = listEl.scrollHeight;
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

const todoFooter = createComponent({
  templateName: 'todoFooter',
  template,
  css,
  createInstance,
  events,
});

export { todoFooter };
