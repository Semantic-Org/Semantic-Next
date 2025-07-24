import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {};

const createComponent = ({ state }) => ({});

defineComponent({
  tagName: 'template-settings',
  template,
  css,
  defaultState,
  createComponent,
});
