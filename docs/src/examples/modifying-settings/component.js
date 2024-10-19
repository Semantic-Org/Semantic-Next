import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  name: 'Jack',
};

defineComponent({
  tagName: 'name-card',
  template,
  css,
  settings,
});
