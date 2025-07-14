import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  message: 'Hello!',
  active: false,
};

defineComponent({
  tagName: 'ui-display',
  template,
  css,
  defaultSettings,
});