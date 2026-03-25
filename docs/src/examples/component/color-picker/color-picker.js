import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  colorOptions: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
};

const defaultState = {
  selectedColor: '#ff0000',
};

const createComponent = ({ state, dispatchEvent }) => ({
  selectColor(color) {
    state.selectedColor.set(color);
    dispatchEvent('color-selected', { color });
  },
});

const events = {
  'click .option'({ self, data }) {
    self.selectColor(data.color);
  },
};

defineComponent({
  tagName: 'color-picker',
  defaultState,
  defaultSettings,
  events,
  template,
  css,
  createComponent,
});
