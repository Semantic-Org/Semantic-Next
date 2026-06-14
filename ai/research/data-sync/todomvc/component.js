import { defineComponent } from '@semantic-ui/component';

import { sync } from '@semantic-ui/sync';

import { Todos } from './todos.js';
import { todoItem } from './todo-item.js';

import template from './component.html?raw';
import css from './component.css?raw';

const defaultState = {
  filter: 'all',
  editingId: null,
  publishing: false,
  shareUrl: null,
};

// two stages: the subscription provisions the pool (deduped across
// components), the query reads it. subscriptions never join the template
// data context — {todos} below is always the query
const subscriptions = ({ subscribe }) => ({
  todos: subscribe('todos.all'),
});

const queries = () => ({
  todos: () => Todos.find(),
});

// query language stops at the sections above — downstream is pure JS
// over the array, no selectors in component logic or templates
const createComponent = ({ self, state, queries }) => ({

  activeTodos() {
    return queries.todos.filter(todo => !todo.completed);
  },

  completedTodos() {
    return queries.todos.filter(todo => todo.completed);
  },

  filteredTodos() {
    const filter = state.filter.get();
    if (filter === 'active') return self.activeTodos();
    if (filter === 'completed') return self.completedTodos();
    return queries.todos;
  },

  allCompleted() {
    return queries.todos.length > 0 && self.activeTodos().length === 0;
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
      Todos.delete({ id });
      return;
    }
    Todos.saveTitle({ id, title });
  },
});

const events = {

  'keydown .new-todo'({ value, target, event }) {
    if (event.key === 'Enter' && value.trim()) {
      Todos.add({ title: value });
      target.value = '';
    }
  },

  'change .toggle-all'({ self }) {
    Todos.setAllCompleted({ completed: !self.allCompleted() });
  },

  'change .toggle'({ data }) {
    Todos.toggle(data);
  },

  'dblclick .todo-list label'({ state, data, $, afterFlush }) {
    state.editingId.set(data.id);
    afterFlush(() => {
      $('.editing .edit').focus();
    });
  },

  'click .destroy'({ data }) {
    Todos.delete(data);
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

  'click .clear-completed'() {
    Todos.clearCompleted();
  },

  async 'click .publish'({ state }) {
    state.publishing.set(true);
    try {
      const { url } = await Todos.publish();
      state.shareUrl.set(url);
    }
    finally {
      state.publishing.set(false);
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
  queries,
  createComponent,
  events,
  keys,
  subTemplates: { todoItem },
});
