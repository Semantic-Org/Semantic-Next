import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

defineComponent({
  tagName: 'responsive-grid',
  template,
  css,
});
