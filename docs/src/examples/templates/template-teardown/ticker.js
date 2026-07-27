import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./ticker.css');
const template = await getText('./ticker.html');

const defaultState = {
  ticks: 0,
};

const createComponent = ({ self, state, interval, findParent }) => ({
  initialize() {
    // cached because findParent walks the template chain, which is unlinked before onDestroyed runs
    self.parent = findParent('templateTeardown');
    interval(() => {
      state.ticks.increment();
      self.parent.say(`tick ${state.ticks.get()}`);
    }, 1000);
  },
});

export const ticker = defineComponent({
  template,
  css,
  defaultState,
  createComponent,
  onDestroyed({ self }) {
    self.parent.say('destroyed');
  },
});
