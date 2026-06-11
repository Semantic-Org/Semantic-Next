import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./poem.css');
const template = await getText('./poem.html');

defineComponent({
  tagName: 'whitespace-poem',
  template,
  css,
});
