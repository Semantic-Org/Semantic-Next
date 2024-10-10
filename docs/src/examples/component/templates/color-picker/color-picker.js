import { defineComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = ({ self, dispatchEvent }) => ({
  colorOptions: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  selectedColor: new ReactiveVar('#ff0000'),

  selectColor(color) {
    self.selectedColor.set(color);
    dispatchEvent('color-selected', { color });
  }
});

const events = {
  'click .option'({ self, data }) {
    self.selectColor(data.color);
  }
};

defineComponent({
  tagName: 'color-picker',
  events,
  template,
  css,
  createComponent
});
