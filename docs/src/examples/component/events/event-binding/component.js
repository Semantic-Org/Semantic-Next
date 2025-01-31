import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  width: 250,
  height: 250,
};

const createComponent = ({ state, self }) => ({
  delta: 50,
  increaseWidth: () =>  state.width.increment(self.delta),
  decreaseWidth: () =>  state.width.decrement(self.delta),
  increaseHeight: () => state.height.increment(self.delta),
  decreaseHeight: () => state.height.decrement(self.delta),
  getStyle() {
    const width = state.width.get();
    const height = state.height.get();
    return `
      width: ${width > 0 ? width : 0}px;
      height: ${height > 0 ? height : 0}px;
    `;
  }
});

const events = {
  'click .decrease.width'({ self }) {
    self.decreaseWidth();
  },
  'click .increase.width'({ self }) {
    self.increaseWidth();
  },
  'click .decrease.height'({ self }) {
    self.decreaseHeight();
  },
  'click .increase.height'({ self }) {
    self.increaseHeight();
  },
};

defineComponent({
  tagName: 'circle-expand',
  template,
  css,
  defaultState,
  events,
  createComponent,
});
