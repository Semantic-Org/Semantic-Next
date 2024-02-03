import { createComponent } from '@semantic-ui/component';
import template from './todo-item.html';
import css from './todo-item.css';

const createInstance = (tpl, $) => ({
  toggleCompleted() {
    todos[tpl.data.index].completed = !todos[tpl.data.index].completed;
    tpl.parent().todos.set(todos);
  },
  removeTodo() {
    tpl.parent().todos.removeItem(tpl.data.index);
  }
});

const events = {
  'change label'(event, tpl) {
    tpl.toggleCompleted();
  },
  'click .destroy'(event, tpl) {
    tpl.removeTodo();
  }
};

const todoItem = createComponent({
  templateName: 'todoItem',
  template,
  css,
  createInstance,
  events,
});

export { todoItem };
