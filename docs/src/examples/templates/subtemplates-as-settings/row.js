import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./row.css');
const template = await getText('./row.html');

export const Row = defineComponent({
  template,
  css,
});
