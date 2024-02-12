import { createComponent } from '@semantic-ui/component';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

import template from './todo-item.html';
import css from './todo-item.css';

const createInstance = (tpl, $) => ({
  editing: new ReactiveVar(false),

  getTodos() {
    return tpl.parent('todoList').todos;
  },
  toggleCompleted() {
    const todos = tpl.getTodos();
    const todo = tpl.data.todo;
    todos.setProperty(todo._id, 'completed', !todo.completed);
  },
  changeText(text) {
    const todos = tpl.getTodos();
    todos.setProperty(tpl.data.todo._id, 'text', text);
  },
  removeTodo() {
    tpl.getTodos().removeItem(tpl.data.todo._id);
  },
});

const onRendered = (tpl, $) => {
  //console.log('rerender');
};

const events = {
  'change .toggle'(event, tpl, $) {
    tpl.toggleCompleted();
  },
  'click .destroy'(event, tpl) {
    tpl.removeTodo();
  },
  'dblclick li'(event, tpl, $) {
    tpl.editing.set(true);
    Reaction.afterFlush(() => {
      $('input.edit').focus();
    });
  },
  'keydown input.edit'(event, tpl, $) {
    if(event.key === 'Enter') {
      $(this).blur();
    }
  },
  'blur input.edit'(event, tpl, $) {
    tpl.changeText($(this).val());
    tpl.editing.set(false);
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
