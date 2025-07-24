import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {};

defineComponent({
  tagName: 'subtemplates-reactivity',
  template,
  css,
  defaultState,
});
