import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'world-clock',
  template,
  css,
  defaultSettings: {
    city: 'Local',
    timezone: 'local',
    format: '12h',
  },
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
