import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { createComponent } from '@semantic-ui/component';

import template from './todo-header.html?raw';
import css from './todo-header.css?raw';

const createInstance = ({ tpl, $, reaction, findParent }) => ({
  allCompleted: new ReactiveVar(false),

  getTodoList() {
    return findParent('todoList');
  },

  getTodos() {
    return tpl.getTodoList().todos;
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
    reaction((comp) => {
      const allCompleted = tpl.allCompleted.get();
      if (comp.firstRun) {
        return;
      }
      if (allCompleted) {
        tpl.completeAll();
      }
      else {
        tpl.completeNone();
      }
    });
  },
});

const events = {
  'keydown input.new-todo'({ event, tpl, $, $$ }) {
    if (event.key === 'Enter') {
      const text = $(this).val();
      if (!text) {
        return;
      }
      tpl.addTodo(text);
      $(this).val('');
      Reaction.afterFlush(() => {
        tpl.getTodoList().scrollToBottom();
      });
    }
  },
};

const onCreated = ({ tpl }) => {
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
