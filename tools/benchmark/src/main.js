import { defineComponent } from '@semantic-ui/component';
import bootstrapCSS from '../css/bootstrap/dist/css/bootstrap.min.css';
import mainCSS from '../css/main.css';
import { buildData } from './store.js';
import ast from './template.html?ast';

// Mutations use in-place helpers (push / removeItem / peek + notify), never
// mutate-then-set-same-ref, which would no-op under reference equality.
const defaultState = {
  rows: [],
  selected: 0,
};

const createComponent = ({ state, match }) => {
  // per-key selector: selection change re-fires only the flipped rows
  const selectedMatch = match(state.selected);
  return {
    isSelected(id) {
      return selectedMatch(id) ? 'danger' : '';
    },

    run() {
      state.rows.set(buildData(1000));
    },

    runLots() {
      state.rows.set(buildData(10000));
    },

    add() {
      state.rows.push(...buildData(1000));
    },

    update() {
      const rows = state.rows.peek();
      for (let i = 0, len = rows.length; i < len; i += 10) {
        rows[i].label += ' !!!';
      }
      state.rows.notify();
    },

    clear() {
      state.rows.set([]);
    },

    swapRows() {
      const rows = state.rows.peek();
      if (rows.length > 998) {
        const tmp = rows[1];
        rows[1] = rows[998];
        rows[998] = tmp;
        state.rows.notify();
      }
    },
  };
};

const events = {
  'click .lbl'({ state, data }) {
    state.selected.set(data.id);
  },
  'click .remove'({ state, data }) {
    state.rows.removeItem(data.id);
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
