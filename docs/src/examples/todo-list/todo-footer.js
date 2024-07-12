import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./todo-footer.css');
const template = await getText('./todo-footer.html');


const createInstance = ({ tpl, findParent, $ }) => ({
  filters: ['all', 'active', 'complete'],

  todoList() {
    return findParent('todoList');
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

  scrollToBottom() {
    const todoList = $('.todo-list')[0];
    todoList.scrollTop = todoList.scrollHeight;
  },

  clearCompleted() {
    tpl.todoList().todos.filter((todo) => !todo.completed);
  },
});

const events = {
  'click .clear-completed'({ event, tpl }) {
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
