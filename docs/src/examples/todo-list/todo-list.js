import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';
import { todoHeader } from './todo-header.js';
import { todoFooter } from './todo-footer.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({ self, $ }) => ({
  // global state
  todos: new ReactiveVar([
    { _id: '1', completed: false, text: 'Take out trash' },
    { _id: '2', completed: false, text: 'Mow lawn' },
    { _id: '3', completed: false, text: 'Do dishes' },
    { _id: '4', completed: false, text: 'Go to work' },
    { _id: '5', completed: false, text: 'Play the trombone' },
    { _id: '6', completed: false, text: 'Win the lottery' },
    { _id: '7', completed: false, text: 'Take children to daycare' },
    { _id: '8', completed: false, text: 'Buy easter eggs' },
  ]),
  filter: new ReactiveVar('all'),

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
