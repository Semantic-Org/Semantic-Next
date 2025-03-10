import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  width: 250,
  height: 250,
};

const createComponent = ({state, self}) => ({
  delta: 50,
  adjustSize({dimension, helper}) {
    state[dimension][helper](self.delta);
  },
  getStyle() {
    const width = state.width.get();
    const height = state.height.get();
    return `
      width: ${width > 0 ? width : 0}px;
      height: ${height > 0 ? height : 0}px;
    `;
  }
});

const events = {
  // data-dimension and data-helper are passed through as data
  'click ui-button'({self, data}) {
    self.adjustSize(data);
  }
};

defineComponent({
  tagName: 'circle-expand',
  template,
  css,
  defaultState,
  events,
  createComponent,
});
