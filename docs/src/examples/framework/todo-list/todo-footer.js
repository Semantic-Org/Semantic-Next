import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./todo-footer.css');
const template = await getText('./todo-footer.html');

const defaultSettings = {
  todos: [],
  currentFilter: null,
};

const createComponent = ({ self, findParent, $, settings }) => ({
  filters: ['all', 'active', 'complete'],

  getIncompleteCount() {
    return settings.todos.filter((todo) => !todo.completed)?.length;
  },

  hasAnyCompleted() {
    return settings.todos.some((todo) => todo.completed);
  },

  isActiveFilter(filter) {
    return settings.currentFilter == filter;
  },

  setFilter(filter) {
    settings.filter.set(filter);
  },

  scrollToBottom() {
    const listEl = $('.todo-list').get(0);
    listEl.scrollTop = listEl.scrollHeight;
  },

  clearCompleted() {
    settings.todos.filter((todo) => !todo.completed);
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
  createComponent,
  defaultSettings,
  events,
});

export { todoFooter };
