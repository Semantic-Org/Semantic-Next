import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  plan: 'free',
};

const createComponent = ({ state }) => ({
  cycle() {
    const order = ['free', 'trial', 'pro', 'team', 'enterprise'];
    const next = order[(order.indexOf(state.plan.get()) + 1) % order.length];
    state.plan.set(next);
  },
});

export default defineComponent({
  tagName: 'match-multi-value',
  template,
  css,
  defaultState,
  createComponent,
});
