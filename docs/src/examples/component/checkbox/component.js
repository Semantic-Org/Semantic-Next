import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  checked: false,
  label: '',
};

defineComponent({
  tagName: 'ui-checkbox',
  template,
  css,
  defaultSettings,
});
