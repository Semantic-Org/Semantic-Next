import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  name: 'World',
  color: 'blue',
};

defineComponent({
  tagName: 'ui-profile',
  template,
  css,
  defaultSettings,
});
