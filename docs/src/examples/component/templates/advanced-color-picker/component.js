import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// these can be passed in as attributes or properties
const settings = {
  colorOptions: ['red', 'yellow', 'green', 'blue', 'purple', 'pink'],
  color: '#FF0000',
};

// this is a reactive internal state store
const state = {
  hoveredColor: '',
};

const createInstance = ({self, settings, $, dispatchEvent}) => ({
  selectColor(color) {
    settings.color = color;
    dispatchEvent('color-selected', { color });
  }
});

const events = {

  'click .option': function({ $, self }) {
    const color = $(this).computedStyle('background-color');
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
  settings,
  state,
  createInstance
});
