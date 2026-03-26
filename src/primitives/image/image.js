import { defineComponent } from '@semantic-ui/component';

import css from './image-bundle.css?raw';
import template from './image.html?raw';
import componentSpec from './specs/image.component.js';

const defaultState = {
  darkMode: false,
};

// no functionality
const createComponent = ({ state, settings, darkMode, data }) => ({
  initialize() {
    state.darkMode.set(darkMode);
  },
  getSrc() {
    const darkMode = state.darkMode.get();
    if (darkMode && settings.darkSrc) {
      return settings.darkSrc;
    }
    if (!darkMode && settings.lightSrc) {
      return settings.darkSrc;
    }
    return settings.src;
  },
});

const onThemeChanged = ({ state, darkMode }) => {
  state.darkMode.set(darkMode);
};

const Image = defineComponent({
  tagName: 'ui-image',
  componentSpec,
  template,
  css,
  defaultState,
  createComponent,
  onThemeChanged,
});

export { Image };
