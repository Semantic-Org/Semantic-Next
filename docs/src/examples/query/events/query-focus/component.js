import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  label: ''
};

defineComponent({
  tagName: 'example-field',
  template,
  css,
  defaultSettings,
  delegatesFocus: true,
});
