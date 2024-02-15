import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { createComponent } from '@semantic-ui/component';

import template from './todo-header.html';
import css from './todo-header.css';

const createInstance = (tpl, $) => ({
  allCompleted: new ReactiveVar(false),

  getTodos() {
    return tpl.parent('todoList').todos;
  },

  completeAll() {
    tpl.getTodos().setArrayProperty('completed', true);
  },

  completeNone() {
    tpl.getTodos().setArrayProperty('completed', false);
  },

  addTodo(text) {
    tpl.getTodos().push({
      _id: text,
      text: text,
      completed: false,
    });
  },

  calculateAllCompleted() {
    tpl.reaction((comp) => {
      const allCompleted = tpl.allCompleted.get();
      if (comp.firstRun) {
        return;
      }
      if (allCompleted) {
        tpl.completeAll();
      } else {
        tpl.completeNone();
      }
    });
  },
});

const events = {
  'keydown input.new-todo'(event, tpl, $) {
    if (event.key === 'Enter') {
      const text = $(this).val();
      if (!text) {
        return;
      }
      tpl.addTodo(text);
      $(this).val('');
      Reaction.afterFlush(() => {
        const todoList = tpl.$$('.todo-list')[0];
        todoList.scrollTop = todoList.scrollHeight;
      });
    }
  },
};

const onCreated = (tpl) => {
  tpl.calculateAllCompleted();
};

const todoHeader = createComponent({
  templateName: 'todoHeader',
  template,
  css,
  createInstance,
  onCreated,
  events,
});

export { todoHeader };
