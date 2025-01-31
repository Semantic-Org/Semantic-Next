import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  text: 'Initial',
};

const onCreated = ({state}) => {
  state.text.set('Created');
};

defineComponent({
  tagName: 'ui-text',
  template,
  css,
  defaultState,
  onCreated,
});
