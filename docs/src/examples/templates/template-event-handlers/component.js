import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  checked: false,
};

const createComponent = ({ state }) => ({
  toggleCheckbox() {
    state.checked.toggle();
  },
});

defineComponent({
  tagName: 'template-events',
  template,
  css,
  defaultState,
  createComponent,
});
