import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  isActive: true,
};

export default defineComponent({
  tagName: 'if-condition',
  template,
  css,
  defaultState,
});
