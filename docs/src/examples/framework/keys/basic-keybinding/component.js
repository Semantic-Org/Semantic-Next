import { defineComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  width: 250,
  height: 250,
};

const keys = {
  up: ({ state }) => state.height.decrement(10, 0),
  left: ({ state }) => state.width.decrement(10, 0),
  right: ({ state }) => state.width.increment(10),
  down: ({ state }) => state.height.increment(10),
  esc: ({ settings, state }) => {
    state.width.set(settings.width);
    state.height.set(settings.height);
  },
};

defineComponent({
  tagName: 'grow-block',
  template,
  css,
  keys,
  defaultState,
});
