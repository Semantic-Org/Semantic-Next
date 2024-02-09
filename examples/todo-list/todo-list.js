import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './item/todo-item.js';
import { todoHeader } from './header/todo-header.js';
import { todoFooter } from './footer/todo-footer.js';

import template from './todo-list.html';
import css from './todo-list.css';

const createInstance = (tpl, $) => ({

  // global state
  todos: new ReactiveVar([]),
  filter: new ReactiveVar('all'),

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

  // handle state
  addRouter() {
    tpl.hashEvent = $(window).on('hashchange', tpl.setRouteFilter);
  },
  getRouteFilter() {
    return window.location.hash.substring(2); // #/foo
  },
  setRouteFilter() {
    tpl.filter.set( tpl.getRouteFilter());
  },
  removeRouter() {
    $(window).off(tpl.hashEvent);
  },

  addFakeTodos(count) {
    const todos = tpl.todos.get();
    for(let i = 0; i < count; i++) {
      todos.push({ _id: `id${i}`, text: `todo ${i}`, completed: false });
    }
    tpl.todos.set(todos);
  }

});

const onCreated = (tpl) => {
  tpl.addRouter();
  tpl.setRouteFilter();
  tpl.addFakeTodos(200);
};

const onDestroyed = (tpl) => {
  tpl.removeRouter();
};


const events = {
  // toggle all checkbox is in the main html although its functionality is in the header
  // this is per todo-mvc spec
  'change .toggle-all'(event, tpl, $) {
    const headerTpl = tpl.child('todoHeader');
    $(event.target).attr('checked', !$(event.target).attr('checked'));
    headerTpl.allCompleted.toggle();
  },
};

const TodoList = createComponent({
  tagName: 'todo-list',
  subTemplates: {
    todoHeader,
    todoItem,
    todoFooter,
  },
  template,
  css,
  events,
  createInstance,
  onCreated,
  onDestroyed,
});

export { TodoList };
