import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./card.css');
const template = await getText('./card.html');

export const card = defineComponent({
  template,
  css
});
