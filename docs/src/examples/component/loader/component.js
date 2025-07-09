import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  type: 'liquid',
  size: 'medium',
  visible: true,
  text: 'LOADING'
};

const defaultState = {
  isAnimating: true
};

const createComponent = ({ self, state, settings }) => ({

  initialize() {
    state.isAnimating.set(settings.visible);
  },

  start() {
    state.isAnimating.set(true);
  },

  stop() {
    state.isAnimating.set(false);
  },

  toggle() {
    state.isAnimating.toggle();
  },

  isAnimating() {
    return state.isAnimating.get();
  },

  getLoaderClasses() {
    return {
      [settings.type]: true,
      [settings.size]: true,
      visible: settings.visible,
      animating: state.isAnimating.get()
    };
  },
});


export const UILoader = defineComponent({
  tagName: 'ui-loader',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
});
