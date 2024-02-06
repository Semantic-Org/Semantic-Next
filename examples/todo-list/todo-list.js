import { createComponent } from '@semantic-ui/component';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';

const createInstance = (tpl, $) => ({

  // reactive state
  todos: new ReactiveVar([
    { _id: 'id-0', text: 'Another one 1', completed: false },
    { _id: 'id-1', text: 'Another one 2', completed: false },
    { _id: 'id-2', text: 'Another one 3', completed: false },
  ]),
  filter: new ReactiveVar('all'),
  allCompleted: new ReactiveVar(false),

  // static state
  filters: [ 'all', 'active', 'complete'],

  getVisibleTodos() {
    const filter = tpl.filter.get();
    const todos = tpl.todos.get();
    each(todos, (todo) => {
      if(!todo._id) {
        todo._id = todo.text;
      }
    });
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
      _id: text,
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
  },
  'click .todo'(event, tpl, $, data) {
    tpl.todos.removeItem(data.id);
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
