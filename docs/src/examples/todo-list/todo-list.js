import { defineComponent, getText } from '@semantic-ui/component';
import { each } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';
import { todoHeader } from './todo-header.js';
import { todoFooter } from './todo-footer.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = ({ self, signal, $ }) => ({
  // global state
  todos: signal([]),
  filter: signal('all'),

  getVisibleTodos() {
    const filter = self.filter.get();
    const todos = self.todos.get();
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
  getRouteFilter() {
    return window.location.hash.substring(2) || 'all'; // #/foo
  },
  setRouteFilter() {
    self.filter.set(self.getRouteFilter());
  },
  removeRouter() {
    $(window).off(self.hashEvent);
  },
});

const onCreated = ({ self, isClient }) => {
};

const onRendered = ({ self, isClient }) => {
  if (isClient) {
    self.setRouteFilter();
  }
};

const onDestroyed = ({ self }) => {
  self.removeRouter();
};

const events = {
  'global hashchange window'({ self }) {
    self.setRouteFilter();
  },

  // toggle all checkbox is in the main html although its functionality is in the header
  // this is per todo-mvc spec
  'change .toggle-all'({ event, self, findChild, $ }) {
    const headerTpl = findChild('todoHeader');
    $(event.target).attr('checked', !$(event.target).attr('checked'));
    headerTpl.allCompleted.toggle();
  },
};

const TodoList = defineComponent({
  tagName: 'todo-list',
  subTemplates: {
    todoHeader,
    todoItem,
    todoFooter,
  },
  template,
  css,
  events,
  createComponent,
  onCreated,
  onRendered,
  onDestroyed,
});

export { TodoList };
