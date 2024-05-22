import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './item/todo-item.js';
import { todoHeader } from './header/todo-header.js';
import { todoFooter } from './footer/todo-footer.js';

import template from './todo-list.html?raw';
import css from './todo-list.css?raw';

const createInstance = ({ tpl, $ }) => ({
  // global state
  todos: new ReactiveVar([]),
  filter: new ReactiveVar('all'),

  getVisibleTodos() {
    const filter = tpl.filter.get();
    const todos = tpl.todos.get();
    each(todos, (todo) => {
      if (!todo._id) {
        todo._id = todo.text;
      }
    });
    return todos.filter((todo) => {
      if (filter == 'active') {
        return !todo.completed;
      }
      else if (filter == 'complete') {
        return todo.completed;
      }
      return true;
    });
  },

  scrollToBottom() {
    const todoList = $('.todo-list').get(0);
    todoList.scrollTop = todoList.scrollHeight;
  },

  // handle state
  addRouter() {
    tpl.hashEvent = $(window).on('hashchange', tpl.setRouteFilter);
  },
  getRouteFilter() {
    return window.location.hash.substring(2) || 'all'; // #/foo
  },
  setRouteFilter() {
    tpl.filter.set(tpl.getRouteFilter());
  },
  removeRouter() {
    $(window).off(tpl.hashEvent);
  },
});

const onCreated = ({ tpl, isClient }) => {
  if (isClient) {
    tpl.addRouter();
  }
};

const onRendered = ({ tpl, isClient }) => {
  if (isClient) {
    tpl.setRouteFilter();
  }
};

const onDestroyed = ({ tpl }) => {
  tpl.removeRouter();
};

const events = {
  // toggle all checkbox is in the main html although its functionality is in the header
  // this is per todo-mvc spec
  'change .toggle-all'({ event, tpl, findChild, $ }) {
    const headerTpl = findChild('todoHeader');
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
  onRendered,
  onDestroyed,
});

export { TodoList };
