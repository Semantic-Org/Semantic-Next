import { createComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const state = {
  width: 250,
  height: 250
};

const keys = {
  'up'    : ({ state }) => state.height.decrement(10),
  'right' : ({ state }) => state.width.increment(10),
  'down'  : ({ state }) => state.height.increment(10),
  'left'  : ({ state }) => state.width.decrement(10),
  'esc'   : ({ state }) => {
    state.width.set(250);
    state.height.set(250);
  },
};

createComponent({
  tagName: 'grow-block',
  template,
  css,
  keys,
  state
});
