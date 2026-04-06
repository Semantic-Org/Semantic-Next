import { defineComponent, getText } from '@semantic-ui/component';
import { noop } from '@semantic-ui/utils';

import { filterList } from './filter-list.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  filter: 'short',
};

const createComponent = ({ self, state }) => ({
  filters: {
    short: (item) => item.length <= 5,
    long: (item) => item.length > 5
  },
  getFilterFn(filter = state.filter.get()) {
    const fn = self.filters[filter] || noop;
    return fn;
  },
  figFilter: (item) => (item == 'Fig')
});

const events = {
  'click ui-button'({ state, data }) {
    state.filter.set(data.filter);
  },
};

defineComponent({
  tagName: 'fn-demo',
  template,
  css,
  defaultState,
  createComponent,
  events,
});
