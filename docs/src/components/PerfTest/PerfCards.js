import { defineComponent } from '@semantic-ui/component';

import { items } from './data.js';
import css from './PerfCards.css?raw';
import template from './PerfCards.html?raw';

const defaultState = {
  search: '',
};

const createComponent = ({ self, state }) => ({
  items,

  filteredItems() {
    const query = (state.search.get() || '').toLowerCase().trim();
    if (!query) { return self.items; }
    return self.items.filter(item =>
      item.name.toLowerCase().includes(query)
      || item.category.toLowerCase().includes(query)
      || item.tags.some(t => t.label.toLowerCase().includes(query))
    );
  },
});

const events = {
  'input input'({ state, value }) {
    state.search.set(value);
  },
};

const PerfCards = defineComponent({
  tagName: 'perf-cards',
  template,
  css,
  defaultState,
  createComponent,
  events,
});

export default PerfCards;
export { PerfCards };
