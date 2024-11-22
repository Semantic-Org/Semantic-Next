import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./row2.css');
const template = await getText('./row2.html');

export const row2 = defineComponent({
  template,
  css,
});
