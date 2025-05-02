import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  delta: 50,
};

const defaultState = {
  width: 250,
  height: 250,
};

const createComponent = ({ state, settings }) => ({

  // this destructures the button data
  // data-dimension and data-helper and uses it to adjust state
  adjustSize({ dimension, helper }) {
    state[dimension][helper](settings.delta);
  },

});

const events = {

  // data-dimension and data-helper are passed from html metadata
  // i.e. <ui-button data-dimension="width" data-helper="increment">
  'click ui-button'({ self, data }) {
    self.adjustSize(data);
  },
};

defineComponent({
  tagName: 'circle-expand',
  template,
  css,
  defaultState,
  defaultSettings,
  events,
  createComponent,
});
