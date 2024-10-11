import { defineComponent, getText } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';

const state = {
  width: 250,
  height: 250,
};

const createComponent = ({state, tpl}) => ({
  delta: 50,
  increaseWidth: () =>  state.width.increment(tpl.delta),
  decreaseWidth: () =>  state.width.decrement(tpl.delta),
  increaseHeight: () => state.height.increment(tpl.delta),
  decreaseHeight: () => state.height.decrement(tpl.delta),
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
  'click .decrease.width'({tpl}) {
    tpl.decreaseWidth();
  },
  'click .increase.width'({tpl}) {
    tpl.increaseWidth();
  },
  'click .decrease.height'({tpl}) {
    tpl.decreaseHeight();
  },
  'click .increase.height'({tpl}) {
    tpl.increaseHeight();
  },
};

export const CircleExpand = defineComponent({
  tagName: 'circle-expand',
  template,
  css,
  state,
  events,
  createComponent,
});
