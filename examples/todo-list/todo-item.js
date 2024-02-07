import { createComponent } from '@semantic-ui/component';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

import template from './todo-item.html';
import css from './todo-item.css';

const createInstance = (tpl, $) => ({
  editing: new ReactiveVar(false),
  toggleCompleted() {
    const todos = tpl.parent().todos;
    const todo = tpl.data.todo;
    todos.setProperty(todo._id, 'completed', !todo.completed);
  },
  changeText(text) {
    const todos = tpl.parent().todos;
    todos.setProperty(tpl.data.todo._id, 'text', text);
  },
  removeTodo() {
    tpl.parent().todos.removeItem(tpl.data.todo._id);
  },
});

const onRendered = (tpl, $) => {
  //console.log('on rendered called', tpl.data.todo.text);
  if($('.toggle').length) {
    if(tpl.data.todo.completed) {
      $('.toggle').get(0).checked = true;
    }
    else {
      $('.toggle').get(0).checked = false;
    }
  }
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
