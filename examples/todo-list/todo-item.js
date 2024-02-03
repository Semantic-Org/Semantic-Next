import { createComponent } from '@semantic-ui/component';
import template from './todo-item.html';
import css from './todo-item.css';

const createInstance = (tpl, $) => ({
  toggleCompleted() {
    let todo = tpl.data.item;
    todo.completed = !todo.completed;
    tpl.parent().todos.setItem(tpl.data.index, todo);
  },
  maybeCompleted() {
    const completed = tpl.data.item.completed;
    return completed ? 'completed ' : '';
  },
  removeTodo() {
    tpl.parent().todos.removeItem(tpl.data.index);
  }
});

const onRendered = (tpl, $) => {
  if(tpl.data.item.completed) {
    $('.toggle').get(0).checked = true;
  }
  else {
    $('.toggle').get(0).checked = false;
  }
};

const events = {
  'change .toggle'(event, tpl) {
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
  onRendered,
  events,
});

export { todoItem };
