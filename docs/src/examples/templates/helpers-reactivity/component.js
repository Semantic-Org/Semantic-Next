import { defineComponent, getText } from '@semantic-ui/component';
import { Signal } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  counter: 0,
  status: 'Online',
  trigger: false,
};

const createComponent = ({ state }) => ({
  getStatusMessage() {
    // This function references status signal
    return `Status: ${state.status.get()}`;
  },

  getGuardedMessage() {
    // This function references counter signal
    return state.counter.get() > 5 ? `High: ${state.counter.get()}` : 'Low';
  },
});

const events = {
  'click .increment'({ state }) {
    state.counter.increment();
  },
  'click .toggle-trigger'({ state }) {
    state.trigger.toggle();
  },
  'click .toggle-status'({ state }) {
    state.status.set(state.status.get() === 'Online' ? 'Offline' : 'Online');
  },
};

defineComponent({
  tagName: 'helpers-reactivity',
  template,
  css,
  defaultState,
  events,
  createComponent,
});
