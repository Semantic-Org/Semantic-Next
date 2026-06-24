import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  status: 'idle',
  message: 'Request failed',
  count: 12,
};

const createComponent = ({ state }) => ({
  cycle() {
    const order = ['idle', 'loading', 'success', 'error'];
    const next = order[(order.indexOf(state.status.get()) + 1) % order.length];
    state.status.set(next);
  },
});

export default defineComponent({
  tagName: 'match-basic',
  template,
  css,
  defaultState,
  createComponent,
});
