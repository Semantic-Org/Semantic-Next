import { defineComponent, getText } from '@semantic-ui/component';
import { generateID } from '@semantic-ui/utils';

import { todoItem } from './todo-item.js';

const template = await getText('./component.html');
const css = await getText('./component.css');

const STORAGE_KEY = 'todos-semantic-ui';

const defaultState = {
  todos: [],
  filter: 'all',
  editingId: null,
};

const createComponent = ({ self, state, reaction }) => ({

  initialize() {
    self.loadTodos();
    self.setFilterFromHash();
    reaction(() => {
      const todos = state.todos.get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    });
  },

  loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) state.todos.set(JSON.parse(stored));
    } catch (e) {
      // ignore corrupt data
    }
  },

  setFilterFromHash() {
    const hash = window.location.hash;
    if (hash === '#/active') state.filter.set('active');
    else if (hash === '#/completed') state.filter.set('completed');
    else state.filter.set('all');
  },

  // computed
  hasTodos() {
    return state.todos.get().length > 0;
  },

  filteredTodos() {
    const todos = state.todos.get();
    const filter = state.filter.get();
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  },

  activeCount() {
    return state.todos.get().filter(t => !t.completed).length;
  },

  hasCompleted() {
    return state.todos.get().some(t => t.completed);
  },

  allCompleted() {
    const todos = state.todos.get();
    return todos.length > 0 && todos.every(t => t.completed);
  },

  isEditing(id) {
    return state.editingId.get() === id;
  },

  // actions
  addTodo(title) {
    const trimmed = title.trim();
    if (!trimmed) return;
    state.todos.push({
      id: generateID(),
      title: trimmed,
      completed: false,
    });
  },

  toggleTodo(id) {
    const todo = state.todos.getItem(id);
    if (todo) {
      state.todos.replaceItem(id, { ...todo, completed: !todo.completed });
    }
  },

  toggleAll(completed) {
    state.todos.map(t => ({ ...t, completed }));
  },

  deleteTodo(id) {
    state.todos.removeItem(id);
  },

  saveTodo(id, title) {
    const trimmed = title.trim();
    if (!trimmed) {
      self.deleteTodo(id);
      return;
    }
    state.todos.setProperty(id, 'title', trimmed);
    state.editingId.set(null);
  },

  clearCompleted() {
    state.todos.filter(t => !t.completed);
  },
});

const events = {

  'keydown .new-todo'({ self, event }) {
    if (event.key === 'Enter') {
      self.addTodo(event.target.value);
      event.target.value = '';
    }
  },

  'change .toggle-all'({ self, event }) {
    self.toggleAll(event.target.checked);
  },

  'change .toggle'({ self, data }) {
    self.toggleTodo(data.id);
  },

  'dblclick .todo-list label'({ state, data, $, afterFlush }) {
    state.editingId.set(data.id);
    afterFlush(() => {
      const editInput = $('.editing .edit').el();
      if (editInput) editInput.focus();
    });
  },

  'click .destroy'({ self, data }) {
    self.deleteTodo(data.id);
  },

  'keydown .edit'({ event }) {
    if (event.key === 'Enter') {
      event.target.blur();
    }
  },

  'focusout .edit'({ self, state, data, event }) {
    if (state.editingId.get() !== null) {
      self.saveTodo(data.id, event.target.value);
    }
  },

  'click .clear-completed'({ self }) {
    self.clearCompleted();
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

defineComponent({
  tagName: 'todo-app',
  template,
  css,
  defaultState,
  createComponent,
  events,
  keys,
  subTemplates: { todoItem },
});
