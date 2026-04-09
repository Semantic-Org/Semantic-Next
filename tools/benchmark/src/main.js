import { defineComponent } from '@semantic-ui/component';
import bootstrapCSS from '../css/bootstrap/dist/css/bootstrap.min.css';
import mainCSS from '../css/main.css';
import { buildData } from './store.js';
import ast from './template.html?ast';

const defaultState = {
  rows: { value: [], options: { allowClone: false, equalityFunction: () => false } },
  selected: { value: 0, options: { allowClone: false, equalityFunction: () => false } },
};

const createComponent = ({ state }) => ({
  isSelected(id) {
    return state.selected.get() === id ? 'danger' : '';
  },

  run() {
    state.rows.set(buildData(1000));
    state.selected.set(0);
  },

  runLots() {
    state.rows.set(buildData(10000));
    state.selected.set(0);
  },

  add() {
    state.rows.set(state.rows.peek().concat(buildData(1000)));
  },

  update() {
    const rows = state.rows.peek();
    for (let i = 0, len = rows.length; i < len; i += 10) {
      rows[i] = { id: rows[i].id, label: rows[i].label + ' !!!' };
    }
    state.rows.set(rows);
  },

  clear() {
    state.rows.set([]);
    state.selected.set(0);
  },

  swapRows() {
    const rows = state.rows.peek();
    if (rows.length > 998) {
      const tmp = rows[1];
      rows[1] = rows[998];
      rows[998] = tmp;
      state.rows.set(rows);
    }
  },
});

const events = {
  'click .lbl'({ state, data }) {
    state.selected.set(Number(data.id));
  },
  'click .remove'({ state, data }) {
    const id = Number(data.id);
    const rows = state.rows.peek();
    const idx = rows.findIndex(r => r.id === id);
    if (idx !== -1) {
      state.rows.set([...rows.slice(0, idx), ...rows.slice(idx + 1)]);
    }
  },
};

defineComponent({
  tagName: 'bench-app',
  ast,
  css: bootstrapCSS + mainCSS,
  defaultState,
  createComponent,
  events,
});
