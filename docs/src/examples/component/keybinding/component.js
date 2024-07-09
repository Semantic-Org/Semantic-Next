import { createComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const state = {
  width: 100,
  height: 100
};

const keys = {
  'esc'({tpl}) {
    state.width.set(100);
    state.height.set(100);
  },
  'left'({state}) {
    state.width.decrement();
  },
  'right'({tpl}) {
    state.width.increment();
  },
  'up'({state}) {
    state.height.decrement();
  },
  'down'({tpl}) {
    state.height.increment();
  },
};

createComponent({
  tagName: 'grow-block',
  keys,
  state
});
