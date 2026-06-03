import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  count: 3,
};

const createComponent = ({ $, reaction, state }) => ({
  draw() {
    const $canvas = $('canvas');
    const canvas = $canvas.get(0);
    const ctx = canvas.getContext('2d');
    const color = $canvas.computedStyle('color');
    // the reaction re-runs and redraws the bar whenever count changes
    reaction(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, state.count.get() * 24, canvas.height);
    });
  },
});

const onRendered = ({ self, isClient }) => {
  if (isClient) {
    self.draw();
  }
};

const events = {
  'click .increment'({ state }) {
    state.count.increment(1, 10);
  },
  'click .decrement'({ state }) {
    state.count.decrement(1, 0);
  },
};

defineComponent({
  tagName: 'reactive-canvas',
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState,
});
