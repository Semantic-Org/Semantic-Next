import { defineComponent } from '@semantic-ui/component';

import css from './UnsafeHtmlTest.css?raw';
import template from './UnsafeHtmlTest.html?raw';

const defaultState = {
  status: 'success',
};

const createComponent = ({ state }) => ({
  staticBadge: '<span style="color: gold; font-weight: bold;">STATIC</span>',

  getStatusBadge() {
    const status = state.status.get();
    const color = status === 'success' ? '#4ade80' : '#f87171';
    return `<span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span>`;
  },

  getIcon() {
    const status = state.status.get();
    const color = status === 'success' ? '#4ade80' : '#f87171';
    return `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="${color}"/></svg>`;
  },
});

const events = {
  'click .toggle'({ state }) {
    const current = state.status.get();
    state.status.set(current === 'success' ? 'error' : 'success');
  },
};

const UnsafeHtmlTest = defineComponent({
  tagName: 'unsafe-html-test',
  template,
  css,
  defaultState,
  createComponent,
  events,
});

export default UnsafeHtmlTest;
export { UnsafeHtmlTest };
