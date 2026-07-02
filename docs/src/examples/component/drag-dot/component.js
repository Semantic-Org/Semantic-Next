import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  x: 120,
  y: 70,
  dragging: false,
};

const events = {
  'pointerdown .dot'({ state }) {
    state.dragging.set(true);
    return 'cancel';
  },
  'global pointermove body'({ $, state, event }) {
    if (!state.dragging.get()) {
      return;
    }
    const area = $('.area').bounds();
    state.x.set(event.clientX - area.left);
    state.y.set(event.clientY - area.top);
  },
  'global pointerup body'({ state }) {
    state.dragging.set(false);
  },
};

defineComponent({
  tagName: 'drag-dot',
  template,
  css,
  defaultState,
  events,
});
