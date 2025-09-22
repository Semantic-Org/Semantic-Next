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

const events = {
  'click ui-button'({ self }) {
    self.toggleCheckbox();
  },
};

defineComponent({
  tagName: 'boolean-attributes',
  template,
  css,
  events,
  defaultState,
  createComponent,
});
