import { defineComponent } from '@semantic-ui/component';

import { sync } from '@semantic-ui/sync';

import { Todos } from './todos.js';
import { todoItem } from './todo-item.js';

import template from './component.html?raw';
import css from './component.css?raw';

const defaultState = {
  filter: 'all',
  editingId: null,
  sharing: false,
  shareUrl: null,
};

// one declaration. it provisions the pool (deduped across components) AND
// surfaces it as db.todos — a read+write reactive handle with the same surface
// as a state signal. status rides the handle (db.todos.ready). no separate
// queries section: the subscription is the read, db.todos is how you touch it.
const subscriptions = ({ subscribe }) => ({
  todos: subscribe('todos.all'),
});

// reads are plain array methods over db.todos, identical to a state signal.
// writes are the same id-addressed signal helpers — now optimistic, durable,
// and on the wire. the graduation from local state was: state.todos → db.todos.
const createComponent = ({ self, state, db }) => ({

  activeTodos() {
    return db.todos.get().filter(todo => !todo.completed);
  },

  completedTodos() {
    return db.todos.get().filter(todo => todo.completed);
  },

  filteredTodos() {
    const filter = state.filter.get();
    if (filter === 'active') return self.activeTodos();
    if (filter === 'completed') return self.completedTodos();
    return db.todos.get();
  },

  allCompleted() {
    const todos = db.todos.get();
    return todos.length > 0 && self.activeTodos().length === 0;
  },

  initialize() {
    self.setFilterFromHash();
  },

  setFilterFromHash() {
    const hash = window.location.hash;
    if (hash === '#/active') state.filter.set('active');
    else if (hash === '#/completed') state.filter.set('completed');
    else state.filter.set('all');
  },

  isEditing(id) {
    return state.editingId.get() === id;
  },

  // global reactive connection surface — how this reaches templates is an
  // open 0a question (import vs callParam injection); import shown
  sync,

  saveTodo(id, title) {
    state.editingId.set(null);
    if (!title.trim()) {
      db.todos.removeItem(id);
      return;
    }
    db.todos.setItemProperty(id, 'title', title.trim());
  },
});

const events = {

  'keydown .new-todo'({ db, value, target, event }) {
    if (event.key === 'Enter' && value.trim()) {
      db.todos.push({ title: value.trim() });
      target.value = '';
    }
  },

  'change .toggle-all'({ db, self }) {
    db.todos.setProperty('completed', !self.allCompleted());
  },

  'change .toggle'({ db, data }) {
    db.todos.toggleItemProperty(data.id, 'completed');
  },

  'dblclick .todo-list label'({ state, data, $, afterFlush }) {
    state.editingId.set(data.id);
    afterFlush(() => {
      $('.editing .edit').focus();
    });
  },

  'click .destroy'({ db, data }) {
    db.todos.removeItem(data.id);
  },

  'keydown .edit'({ target, event }) {
    if (event.key === 'Enter') {
      target.blur();
    }
  },

  'focusout .edit'({ self, state, data, value }) {
    if (state.editingId.get() !== null) {
      self.saveTodo(data.id, value);
    }
  },

  'click .clear-completed'({ db }) {
    db.todos.filter(todo => !todo.completed);
  },

  // an action — async, unsimulatable, awaited. 'share' not 'publish':
  // the registration verbs (publish/mutator/action/searchIndex) are reserved
  async 'click .share'({ state }) {
    state.sharing.set(true);
    try {
      const { url } = await Todos.share();
      state.shareUrl.set(url);
    }
    finally {
      state.sharing.set(false);
    }
  },

  'global hashchange window'({ self }) {
    self.setFilterFromHash();
  },
};

const keys = {
  'esc'({ state }) {
    if (state.editingId.get() === null) return true;
    state.editingId.set(null);
  },
};

export const TodoApp = defineComponent({
  tagName: 'todo-app',
  template,
  css,
  defaultState,
  subscriptions,
  createComponent,
  events,
  keys,
  subTemplates: { todoItem },
});
