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

const createComponent = ({ state, settings, self }) => ({
  increaseWidth: () => state.width.increment(settings.delta),
  decreaseWidth: () => state.width.decrement(settings.delta),
  increaseHeight: () => state.height.increment(settings.delta),
  decreaseHeight: () => state.height.decrement(settings.delta),
});

const events = {
  'click .decrease.width': ({ self }) => self.decreaseWidth(),
  'click .increase.width': ({ self }) => self.increaseWidth(),
  'click .decrease.height': ({ self }) => self.decreaseHeight(),
  'click .increase.height': ({ self }) => self.increaseHeight(),
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
