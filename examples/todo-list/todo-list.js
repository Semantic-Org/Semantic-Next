import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';

import template from './todo-list.html';
import css from './todo-list.css';

const createInstance = (tpl, $) => ({

  todos: new ReactiveVar([{text: 'Test 123', completed: false}]),
  filter: new ReactiveVar('all'),
  allSelected: new ReactiveVar(false),

  filters: [
    'all',
    'active',
    'complete'
  ],

  getVisibleTodos() {
    const filter = tpl.filter.get();
    return tpl.todos.get().filter(todo => {
      if(filter == 'active') {
        return !todo.completed;
      }
      else if(filter == 'complete') {
        return todo.completed;
      }
      return true;
    });
  },

  selectAll() {
    tpl.todos.set(each(tpl.todos.value, todo => todo.completed = true));
  },

  selectNone() {
    tpl.todos.set(each(tpl.todos.value, todo => todo.completed = false));
  },

  getIncomplete() {
    return tpl.todos.value.filter(todo => !todo.completed);
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

  calculateSelection() {
    tpl.reaction((comp) => {
      if(tpl.allSelected.get()) {
        tpl.selectAll();
      }
      else {
        tpl.selectNone();
      }
    });
  },

  isActiveFilter(filter) {
    return tpl.filter.get() == filter;
  },

  clearCompleted() {
    tpl.todos.set(todos.filter(todo => todo.completed));
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
  tpl.calculateSelection();
  tpl.addRouter();
};

const onDestroyed = (tpl) => {
  tpl.removeRouter();
};

const events = {
  'keydown input.new-todo'(event, tpl, $) {
    if(event.key === 'Enter') {
      tpl.addTodo( $(this).val() );
    }
  },
  'change .toggle-all'(event, tpl, $) {
    $(event.target).attr('checked', !$(event.target).attr('checked'));
    tpl.allSelected.toggle();
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
