import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  title: 'Card',
  color: 'blue',
};

defineComponent({
  tagName: 'card-example',
  template,
  css,
  defaultSettings,
});
