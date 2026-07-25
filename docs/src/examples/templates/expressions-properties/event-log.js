import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./event-log.css');
const template = await getText('./event-log.html');

const defaultSettings = {
  entries: [],
};

defineComponent({
  tagName: 'event-log',
  template,
  css,
  defaultSettings,
});
