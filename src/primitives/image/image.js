import { defineComponent } from '@semantic-ui/component';

import css from './image-bundle.css?raw';
import template from './image.html?raw';
import componentSpec from './specs/image-component.js';

// no functionality
const createComponent = ({ darkMode, settings }) => ({
  getSrc() {
    if (darkMode && settings.darkSrc) {
      return settings.darkSrc;
    }
    if (lightMode && settings.lightSrc) {
      return settings.darkSrc;
    }
    return settings.src;
  },
});

const onThemeChanged = ({ self }) => {
  console.log('theme changed');
};

const UIContainer = defineComponent({
  tagName: 'ui-image',
  componentSpec,
  template,
  css,
  onThemeChanged,
  createComponent,
});

export { UIContainer };
