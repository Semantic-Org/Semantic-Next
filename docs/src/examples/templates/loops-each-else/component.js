import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  items: [], // empty array to demonstrate else condition
};

defineComponent({
  tagName: 'each-else',
  template,
  css,
  defaultState,
});
