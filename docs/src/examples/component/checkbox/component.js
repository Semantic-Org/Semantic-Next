import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  checked: false,
  label: '',
};

defineComponent({
  tagName: 'ui-checkbox',
  template,
  css,
  settings,
});
