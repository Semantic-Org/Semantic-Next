import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { TodoItem } from './todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';


const createInstance = (tpl, $) => ({

  todos: new ReactiveVar([]),

  allSelected: new ReactiveVar(false),

  selectAll() {
    let todos = tpl.todos.get();
    each(todos, todo => todo.selected);
    todos.set(todos);
  },

  selectNone() {
    let todos = tpl.todos.get();
    each(todos, todo => !todo.selected);
    todos.set(todos);
  },

  calculateSelection() {
    tpl.reaction((comp) => {
      if(comp.firstRun) {
        return;
      }
      if(tpl.allSelected.get()) {
        tpl.selectAll();
      }
      else {
        tpl.selectNone();
      }
    });
  }

});

const onCreated = (tpl) => {
  tpl.calculateSelection();

};

const events = {
  'click selectAll'(event, tpl) {
    let todos = tpl.todos.get();
    each(todos, todo => todo.selected);
    todos.set(todos);
  }
};


const TodoList = createComponent({
  tagName: 'todo-list',
  subTemplates: {
    TodoItem
  },
  template,
  css,
  createInstance,
  onCreated,
  events,
});

export { TodoList };
