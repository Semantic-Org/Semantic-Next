import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import { todoItem } from './todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';

const createInstance = (tpl, $) => ({

  // reactive state
  todos: new ReactiveVar([
    { text: 'Pickup drycleaning', completed: false },
    { text: 'Get groceries', completed: false },
    { text: 'Take kids to school', completed: false },
  ]),
  filter: new ReactiveVar('all'),
  allCompleted: new ReactiveVar(false),

  // static state
  filters: [ 'all', 'active', 'complete'],

  getVisibleTodos() {
    const filter = tpl.filter.get();
    const todos = tpl.todos.get();
    return todos.filter(todo => {
      if(filter == 'active') {
        return !todo.completed;
      }
      else if(filter == 'complete') {
        return todo.completed;
      }
      return true;
    });
  },

  completeAll() {
    tpl.todos.setArrayProperty('completed', true);
  },

  completeNone() {
    tpl.todos.setArrayProperty('completed', false);
  },

  getIncomplete() {
    const todos = tpl.todos.get();
    return todos.filter(todo => !todo.completed);
  },

  addTodo(text) {
    tpl.todos.push({
      text: text,
      completed: false,
    });
  },

  hasAnyCompleted() {
    return tpl.todos.value.some(todo => todo.completed);
  },

  calculateAllCompleted() {
    tpl.reaction((comp) => {
      const allCompleted = tpl.allCompleted.get();
      if(comp.firstRun) {
        return;
      }
      if(allCompleted) {
        tpl.completeAll();
      }
      else {
        tpl.completeNone();
      }
    });
  },

  isActiveFilter(filter) {
    return tpl.filter.get() == filter;
  },

  clearCompleted() {
    tpl.todos.removeItems(todo => todo.completed);
  },

  // handle state
  addRouter() {
    tpl.hashEvent = $(window).on('hashchange', (event) => {
      let filter = window.location.hash.substring(2); // #/foo
      tpl.filter.set(filter);
    });
  },
  removeRouter() {
    $(window).off(tpl.hashEvent);
  }

});

const onCreated = (tpl) => {
  tpl.calculateAllCompleted();
  tpl.addRouter();
};

const onDestroyed = (tpl) => {
  tpl.removeRouter();
};

const events = {
  'keydown input.new-todo'(event, tpl, $) {
    if(event.key === 'Enter') {
      tpl.addTodo( $(this).val() );
      $(this).val('');
    }
  },
  'change .toggle-all'(event, tpl, $) {
    $(event.target).attr('checked', !$(event.target).attr('checked'));
    tpl.allCompleted.toggle();
  },
  'click .filters'(event, tpl, $, data) {
    tpl.filter.set(data.filter);
  },
  'click .clear-completed'(event, tpl) {
    tpl.clearCompleted();
  }
};


const TodoList = createComponent({
  tagName: 'todo-list',
  subTemplates: {
    todoItem
  },
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { TodoList };
