import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  colorOptions: ['red', 'yellow', 'green', 'blue', 'purple', 'pink'],
  color: '#FF0000',
};

const defaultState = {
  hoveredColor: '',
};

const createComponent = ({self, settings, $, dispatchEvent}) => ({
  selectColor(color) {
    settings.color = color;
    dispatchEvent('colorselected', { color });
  }
});

const events = {

  'click .option'({ target, $, self }) {
    const color = $(target).computedStyle('background-color');
    self.selectColor(color);
  },

  'mouseover, mouseleave .option'({event, data, state}) {
    const color = (event.type == 'mouseover')
      ? data.color
      : undefined
    ;
    state.hoveredColor.set(color);
  },

  'click ui-button'({$, self}) {
    const color = $('.custom-color').val();
    self.selectColor(color);
  },

  'input .custom-color'({event, state }) {
    state.hoveredColor.set(event.target.value);
  },

};

defineComponent({
  tagName: 'advanced-color-picker',
  events,
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent
});
