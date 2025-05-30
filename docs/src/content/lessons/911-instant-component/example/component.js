import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'live-clock',
  template,
  css,
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
